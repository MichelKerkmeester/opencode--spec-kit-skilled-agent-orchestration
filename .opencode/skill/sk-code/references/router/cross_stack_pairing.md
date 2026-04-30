---
title: React ↔ Go cross-stack pairing — canonical contract
description: The shared API contract, JWT handoff, error envelope, CORS configuration, and deploy topology between the React/Next.js frontend live branch and the Go backend live branch. Read from BOTH stacks; this is the single source of truth for what crosses the wire.
keywords: [cross-stack, pairing, react-go, api-contract, jwt, error-envelope, cors, vercel, railway, fly-io, kerkmeester]
---

# React ↔ Go cross-stack pairing

This doc is the **canonical contract** between the React/Next.js frontend live branch and the Go backend live branch under `sk-code`. Read it from either side; it owns what crosses the wire.

References:
- React side: `references/react/implementation/api_integration.md`
- Go side: `references/go/implementation/api_design.md`

If your project deviates from any contract here, document the deviation in your project's CLAUDE.md / AGENTS.md so future work stays consistent.

---

## 1. Topology

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│  React / Next.js (Vercel)   │  HTTPS  │  Go / gin (Railway / Fly.io) │
│  - SSR + RSC + Server Acts  │ ──────▶ │  - REST API + JWT auth       │
│  - Auth.js (consumes JWT)   │         │  - Postgres via pgx + sqlc   │
│  - vanilla-extract + motion │         │  - structured logs (slog)    │
└─────────────────────────────┘         └──────────────────────────────┘
            │                                       │
            └─── shared schema sources ─────────────┘
                 (zod on React; validator tags on Go;
                  manually mirrored, see §3)
```

**Hostnames (typical):**
- Frontend: `https://example.com` (production), `https://*-example.vercel.app` (previews)
- Backend: `https://api.example.com` (production), local dev: `http://localhost:8080`

The frontend reads `process.env.NEXT_PUBLIC_API_URL` to pick the backend; the backend reads `ALLOWED_ORIGINS` to lock down CORS.

---

## 2. API contract — REST + JSON envelope

### Conventions

- **Transport:** REST over HTTPS, JSON request/response bodies
- **Versioning:** URL prefix `/api/v1/...` (bump major prefix on breaking changes; never silently break)
- **Methods:** standard verbs — `GET` (read), `POST` (create), `PATCH` (partial update), `PUT` (full replace, rare), `DELETE` (remove)
- **Resource naming:** kebab-case plural nouns (`/api/v1/blog-posts`, `/api/v1/contact-messages`)
- **Status codes:** use HTTP semantics — `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Too Many Requests`, `500 Internal Server Error`

### Success envelope

The Go backend wraps successful responses in a thin envelope:

```json
{
  "data": { /* resource or array of resources */ },
  "meta": { /* optional: pagination, timing, version */ }
}
```

Examples:

```json
// GET /api/v1/blog-posts/123
{
  "data": {
    "id": "post_123",
    "title": "Hello",
    "createdAt": "2026-04-30T10:00:00Z"
  }
}

// GET /api/v1/blog-posts?cursor=abc&limit=20
{
  "data": [ { "id": "post_124", "title": "..." }, /* ... */ ],
  "meta": {
    "nextCursor": "post_144",
    "hasMore": true
  }
}
```

**Field casing:** camelCase on the wire (matches TypeScript / JS expectations on the React side; Go marshals via `json:"camelCase"` struct tags).

**Timestamps:** RFC 3339 / ISO 8601 with timezone (`2026-04-30T10:00:00Z`). Never Unix epoch on the wire.

**IDs:** prefixed strings (`post_<ulid>`, `user_<ulid>`) — easier to debug than bare UUIDs and prevents ID collisions across resource types.

### Error envelope

**This is the most important shared contract.** Both stacks must agree on the exact shape:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Email is required",
    "details": { "field": "email" }
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `error.code` | string | yes | UPPER_SNAKE_CASE machine code; stable across releases |
| `error.message` | string | yes | Human-readable; safe to display to end users (no stack traces, no DB internals) |
| `error.details` | object | no | Structured details — validation field, retry-after seconds, etc. |

**Canonical codes** (extend per project, but these baseline must hold):

| Code | HTTP status | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 / 422 | Request body failed schema validation |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Authenticated but not allowed |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Unique constraint, version mismatch, etc. |
| `RATE_LIMITED` | 429 | Throttled; client should back off |
| `INTERNAL` | 500 | Catch-all server error |

**Go side** — emit via a single helper:

```go
// internal/transport/http/respond.go
func respondError(c *gin.Context, status int, code, msg string, details map[string]any) {
    c.AbortWithStatusJSON(status, gin.H{"error": gin.H{
        "code": code, "message": msg, "details": details,
    }})
}
```

**React side** — parse via a single helper:

```typescript
// src/lib/api.ts
export class APIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: Record<string, unknown>,
  ) { super(message); }
}

export async function apiCall<T>(path: string, init: RequestInit & { jwt?: string } = {}): Promise<T> {
  const { jwt, ...rest } = init;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
      ...rest.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new APIError(
      body.error?.message ?? 'Request failed',
      body.error?.code,
      res.status,
      body.error?.details,
    );
  }
  return body.data as T;
}
```

Always throw `APIError` on the React side; never return raw `Response`. The form layer can then `catch (err) { if (err instanceof APIError && err.code === 'VALIDATION_FAILED') ... }`.

---

## 3. Schema mirroring — zod ↔ go-playground/validator

The frontend defines validation in zod; the backend re-validates with `go-playground/validator` struct tags. **The two must agree.** They are mirrored manually — there is no codegen step.

```typescript
// React: src/lib/schemas/contact.ts
import { z } from 'zod';
export const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});
export type ContactInput = z.infer<typeof ContactSchema>;
```

```go
// Go: internal/api/contact/types.go
type ContactInput struct {
    Name    string `json:"name"    validate:"required,min=1,max=100"`
    Email   string `json:"email"   validate:"required,email"`
    Message string `json:"message" validate:"required,min=10,max=2000"`
}
```

**Discipline:** when changing one side, change the other in the same PR. The cross-stack pairing checklist (in both `assets/react/checklists/` and `assets/go/checklists/`) calls this out explicitly.

**Why not codegen?** The trade-off: codegen tools (sqlc-style for the wire) add build complexity. Two small files in two repos / packages, kept in sync by discipline + checklist, is the kerkmeester-scale answer. Reconsider at scale (~50+ shared schemas).

---

## 4. JWT handoff — Go issues, React stores, Auth.js consumes

### Issuance (Go)

The backend signs JWTs using HS256 with a server-only secret:

```go
// internal/auth/jwt.go
import "github.com/golang-jwt/jwt/v5"

type Claims struct {
    UserID string `json:"sub"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

func IssueJWT(userID, email string, secret []byte) (string, error) {
    claims := Claims{
        UserID: userID, Email: email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "api.example.com",
            Audience:  jwt.ClaimStrings{"example.com"},
        },
    }
    return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secret)
}
```

**Endpoint:** `POST /api/v1/auth/login` returns `{ data: { token: "...", user: {...} } }`.

### Storage (React)

Two patterns, choose one per project:

**Pattern A — Auth.js with httpOnly cookie (recommended for SSR-heavy apps):**

The React app's Auth.js Credentials provider calls Go's `/auth/login`, receives the JWT, and stores it in an httpOnly cookie. Server Components / Route Handlers / Server Actions read the cookie, call Go with `Authorization: Bearer ${token}`. Client never touches the JWT directly — XSS-safe.

**Pattern B — In-memory + refresh token (recommended for SPA-heavy apps):**

JWT lives in React state / Zustand store. Refresh token in httpOnly cookie. On mount, hydrate by calling `/auth/refresh`. Trade-off: lost on full page reload until refresh completes.

**Either way:** the JWT itself never goes to localStorage / sessionStorage. XSS would exfiltrate it.

### Verification (Go middleware)

```go
// internal/auth/middleware.go
func RequireAuth(secret []byte) gin.HandlerFunc {
    return func(c *gin.Context) {
        h := c.GetHeader("Authorization")
        if !strings.HasPrefix(h, "Bearer ") {
            respondError(c, 401, "UNAUTHORIZED", "Missing bearer token", nil); return
        }
        tokenStr := strings.TrimPrefix(h, "Bearer ")
        claims := &Claims{}
        _, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
            if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
            return secret, nil
        })
        if err != nil {
            respondError(c, 401, "UNAUTHORIZED", "Invalid or expired token", nil); return
        }
        c.Set("userID", claims.UserID)
        c.Set("email", claims.Email)
        c.Next()
    }
}
```

Apply to protected route groups only — public endpoints (`/health`, `/auth/login`, `/auth/refresh`) skip it.

---

## 5. CORS — Go-side configuration

The Go backend must allow the React frontend's origins. Use `gin-contrib/cors`:

```go
// cmd/server/main.go
import "github.com/gin-contrib/cors"

allowed := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
r.Use(cors.New(cors.Config{
    AllowOrigins:     allowed,                                  // exact match list
    AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,                                     // required for cookie-based auth
    MaxAge:           12 * time.Hour,
}))
```

**`ALLOWED_ORIGINS` env (production):**

```
https://example.com,https://www.example.com
```

**Vercel preview deploys** generate `https://<branch-hash>-<project>.vercel.app` URLs — these change per push and break exact-match CORS.

Two options:

1. **Allowlist via regex** — replace `AllowOrigins` with `AllowOriginFunc`:

   ```go
   AllowOriginFunc: func(origin string) bool {
       if origin == "https://example.com" || origin == "https://www.example.com" { return true }
       return strings.HasSuffix(origin, ".example.vercel.app")
   },
   ```

2. **Separate preview backend** (Railway/Fly preview environments) per Vercel branch — heavier, but isolates auth / DB state.

Pick option 1 unless preview environments need their own data.

**Never** use `AllowOrigins: ["*"]` with `AllowCredentials: true` — browsers reject the combination, and even if they didn't, it'd be a CSRF vector.

---

## 6. Pagination — cursor-based

Cursor pagination is the default. Offset pagination breaks under concurrent inserts and gets slow at high offsets.

**Request:**

```
GET /api/v1/blog-posts?cursor=post_123&limit=20
```

**Response:**

```json
{
  "data": [ /* up to `limit` items, ordered by createdAt DESC */ ],
  "meta": {
    "nextCursor": "post_144",
    "hasMore": true
  }
}
```

When `hasMore` is `false`, `nextCursor` is `null`. The cursor is opaque to the client — typically the last item's primary key, but the client should treat it as a black-box token.

**SQL pattern (sqlc):**

```sql
-- name: ListBlogPostsAfterCursor :many
SELECT * FROM blog_posts
WHERE ($1::text = '' OR id < $1)
ORDER BY id DESC
LIMIT $2;
```

---

## 7. Deploy topology

| Layer | Recommended host | Notes |
|---|---|---|
| **Frontend (React/Next.js)** | Vercel | SSR + RSC + Server Actions all supported natively. ENV: `NEXT_PUBLIC_API_URL=https://api.example.com` |
| **Backend (Go/gin)** | Railway / Fly.io / DigitalOcean App Platform | Containerized via Dockerfile. ENV: `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS` |
| **Postgres** | Railway managed Postgres / Neon / Supabase Postgres | pgx connection string via `DATABASE_URL` |
| **Migrations** | `golang-migrate` run on deploy hook (Railway/Fly release command) | Never run migrations from the running app process |

**Local dev:**

```bash
# terminal 1 — backend
cd backend && go run ./cmd/server  # localhost:8080

# terminal 2 — frontend
cd frontend && NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev  # localhost:3000

# terminal 3 — postgres (docker)
docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16
```

CORS in dev: `ALLOWED_ORIGINS=http://localhost:3000` on the Go side.

---

## 8. Drift detection

These are the contract changes most likely to break the pairing. When making any of them, both stacks must update in the same PR (or coordinated PRs):

| Change | Both sides update |
|---|---|
| Add/remove field on a request or response body | zod schema (React) + struct + validator tag (Go) + sqlc query (Go) |
| Rename JSON field | zod schema + Go `json:"..."` tag |
| Change error code | `APIError` consumer call sites (React) + `respondError` call sites (Go) |
| Add JWT claim | `Claims` struct (Go) + Auth.js session callback (React) |
| New protected route | gin route + middleware (Go) + fetch call site + Auth.js session check (React) |
| Add Vercel preview pattern | `AllowOriginFunc` regex (Go) |

The cross-stack pairing checklist (in both `assets/react/checklists/code_quality_checklist.md` and `assets/go/checklists/code_quality_checklist.md`) flags these as P0 verification items.

---

## See also

- `references/react/implementation/api_integration.md` — React-side fetch patterns, SWR/React Query, Server Action proxying
- `references/go/implementation/api_design.md` — Go-side route layout, handler patterns, sqlc integration
- `references/go/implementation/auth_jwt.md` — full JWT issuance + refresh flow on the Go side
- `assets/react/patterns/api_call_pattern.ts` — runnable apiCall snippet
- `assets/go/patterns/handler_pattern.go` — runnable gin handler with envelope + validator
