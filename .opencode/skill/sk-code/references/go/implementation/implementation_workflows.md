---
title: Go (gin + sqlc + Postgres) — Phase 1 Implementation Workflows
description: Phase-1 entry doc for the Go live branch. gin HTTP framework + sqlc compile-time SQL safety + pgx Postgres driver + go-playground/validator + golang-jwt for auth. Pairs with the React/Next.js frontend live branch.
keywords: [go, golang, gin, echo, chi, sqlc, pgx, postgres, validator, jwt, golangci-lint, slog, kerkmeester-pairing]
---

# Go — Phase 1 Implementation Workflows

Phase 1 entry point for Go work in sk-code. Patterns target a microservice backend that pairs with the React/Next.js frontend live branch (kerkmeester-style). Stack: **gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt + golangci-lint + slog**.

> Alternatives: Echo / Chi / Fiber routers work with the same architectural shape — see `gin_handler_patterns.md` migration section. sqlc can be swapped for GORM if you want runtime ORM ergonomics over compile-time safety.

---

## 1. Project bootstrap

Verify Go version + module:

```bash
go version       # expect 1.22+
cat go.mod       # confirm module name + go directive
go mod tidy      # ensure deps clean
```

Standard project layout (matches Go community conventions):

```
.
├── cmd/
│   └── api/
│       └── main.go              # entry point
├── internal/
│   ├── handler/                 # gin handlers (HTTP layer)
│   ├── service/                 # business logic
│   ├── repository/              # database access (sqlc-generated + custom)
│   ├── domain/                  # domain types, errors
│   ├── middleware/              # gin middleware (auth, CORS, logging, recovery)
│   └── config/                  # env config loader
├── pkg/                         # exportable libraries (rare for app-tier services)
├── db/
│   ├── migrations/              # golang-migrate SQL files (NNN_name.up.sql / .down.sql)
│   └── queries/                 # sqlc input SQL → generates internal/repository/*.sql.go
├── sqlc.yaml                    # sqlc config
├── Dockerfile
├── go.mod
└── go.sum
```

The `internal/` package is Go's compiler-enforced visibility boundary — anything outside the module can't import from it. Use it liberally for app code; reserve `pkg/` for libraries you genuinely intend to export.

---

## 2. Server bootstrap (`cmd/api/main.go`)

```go
package main

import (
    "context"
    "log/slog"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/jackc/pgx/v5/pgxpool"
)

func main() {
    ctx := context.Background()
    logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

    pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
    if err != nil {
        logger.Error("postgres connect failed", "err", err)
        os.Exit(1)
    }
    defer pool.Close()

    router := gin.New()
    router.Use(gin.Recovery())
    router.Use(slogMiddleware(logger))
    router.Use(corsMiddleware())

    // Routes
    api := router.Group("/api")
    api.POST("/contact", contactHandler(pool, logger))
    api.GET("/health", healthHandler(pool))

    // ... other routes ...

    srv := &http.Server{
        Addr:         ":" + getenv("PORT", "8080"),
        Handler:      router,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 30 * time.Second,
    }

    // Graceful shutdown
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Error("server failed", "err", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    shutdownCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
    defer cancel()
    _ = srv.Shutdown(shutdownCtx)
    logger.Info("shutdown complete")
}

func getenv(k, fallback string) string {
    if v := os.Getenv(k); v != "" { return v }
    return fallback
}
```

Key points:
- `slog` is the standard structured logger from Go 1.21+. JSON output → easy to parse in deployment platforms.
- `pgxpool` is pgx v5's connection pool. Don't share `*pgx.Conn` across goroutines; the pool handles checkout/checkin.
- Graceful shutdown waits for in-flight requests up to 10 seconds.
- `gin.New()` (not `gin.Default()`) — `Default()` includes a logger middleware that conflicts with slog.

---

## 3. Handler pattern (gin)

Handlers belong in `internal/handler/`. They:
1. Bind + validate request input
2. Delegate to service layer
3. Map service results / errors to HTTP responses

```go
// internal/handler/contact.go
package handler

import (
    "errors"
    "log/slog"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
    "myproject/internal/domain"
    "myproject/internal/service"
)

type contactInput struct {
    Name    string `json:"name" binding:"required,min=1"`
    Email   string `json:"email" binding:"required,email"`
    Message string `json:"message" binding:"required,min=10"`
}

func ContactHandler(svc *service.Contact, logger *slog.Logger) gin.HandlerFunc {
    return func(c *gin.Context) {
        var input contactInput
        if err := c.ShouldBindJSON(&input); err != nil {
            // gin uses go-playground/validator under the hood for binding tags
            respondError(c, http.StatusBadRequest, "VALIDATION", err.Error())
            return
        }

        if err := svc.Submit(c.Request.Context(), input.Name, input.Email, input.Message); err != nil {
            switch {
            case errors.Is(err, domain.ErrRateLimited):
                respondError(c, http.StatusTooManyRequests, "RATE_LIMITED", "try again later")
            default:
                logger.Error("contact submit failed", "err", err)
                respondError(c, http.StatusInternalServerError, "INTERNAL", "internal error")
            }
            return
        }

        c.JSON(http.StatusOK, gin.H{"ok": true})
    }
}

// Error envelope matches the React frontend's expectation:
// { "error": { "code": "...", "message": "..." } }
func respondError(c *gin.Context, status int, code, message string) {
    c.JSON(status, gin.H{"error": gin.H{"code": code, "message": message}})
}
```

For deeper patterns (middleware composition, file uploads, streaming, webhook signature verification): `references/go/implementation/gin_handler_patterns.md`.

---

## 4. Service layer

Services hold business logic, are database-aware via repository injection, and are transport-agnostic (no `*gin.Context`). This makes them testable without spinning up an HTTP server.

```go
// internal/service/contact.go
package service

import (
    "context"
    "fmt"
    "myproject/internal/domain"
    "myproject/internal/repository"
)

type Contact struct {
    repo *repository.Queries  // sqlc-generated
}

func NewContact(repo *repository.Queries) *Contact {
    return &Contact{repo: repo}
}

func (s *Contact) Submit(ctx context.Context, name, email, message string) error {
    if err := s.repo.InsertContact(ctx, repository.InsertContactParams{
        Name: name, Email: email, Message: message,
    }); err != nil {
        return fmt.Errorf("insert contact: %w", err)  // wrap with %w for error chains
    }
    return nil
}
```

Error wrapping with `%w` is critical — it preserves the chain so callers can use `errors.Is` / `errors.As`.

For deeper patterns: `references/go/implementation/service_layer.md`.

---

## 5. Database — sqlc + pgx + Postgres

`sqlc.yaml`:

```yaml
version: "2"
sql:
  - engine: "postgresql"
    queries: "db/queries"
    schema: "db/migrations"
    gen:
      go:
        package: "repository"
        out: "internal/repository"
        sql_package: "pgx/v5"
```

Write SQL in `db/queries/`, sqlc generates type-safe Go:

```sql
-- db/queries/contact.sql

-- name: InsertContact :exec
INSERT INTO contacts (name, email, message, created_at)
VALUES ($1, $2, $3, now());

-- name: GetContactByEmail :one
SELECT id, name, email, message, created_at
FROM contacts
WHERE email = $1
LIMIT 1;
```

Run `sqlc generate` to produce `internal/repository/contact.sql.go` with type-safe `InsertContact(ctx, params)` and `GetContactByEmail(ctx, email)` methods.

Migrations via golang-migrate:

```bash
migrate create -ext sql -dir db/migrations -seq create_contacts_table
# edit db/migrations/000001_create_contacts_table.up.sql + .down.sql
migrate -path db/migrations -database "$DATABASE_URL" up
```

For deeper patterns (transactions, listen/notify, JSON columns, joins, pagination): `references/go/implementation/database_sqlc_postgres.md`.

---

## 6. Validation — go-playground/validator

gin uses `validator/v10` for `binding:` tags out of the box. For complex validation outside binding (e.g. cross-field), use the validator directly:

```go
import "github.com/go-playground/validator/v10"

var validate = validator.New()

type SignupInput struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=8"`
    Confirm  string `json:"confirm" validate:"required,eqfield=Password"`
}

if err := validate.Struct(input); err != nil {
    // map err.(validator.ValidationErrors) → field-level error envelope
}
```

Mirror the zod schema from the React side so client-side and server-side validation agree. See `references/go/implementation/validation_patterns.md`.

---

## 7. Auth — JWT

Use `golang-jwt/jwt/v5`. Issue tokens on login, validate on protected routes via middleware.

```go
import "github.com/golang-jwt/jwt/v5"

type Claims struct {
    UserID string `json:"sub"`
    jwt.RegisteredClaims
}

func issueToken(userID string, secret []byte) (string, error) {
    claims := Claims{
        UserID: userID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }
    return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secret)
}
```

For middleware + Auth.js handoff on the React side: `references/go/implementation/auth_jwt.md` and `references/router/cross_stack_pairing.md`.

---

## 8. CORS for the React frontend

Allowlist your Vercel deploy URLs (production + preview branches):

```go
import "github.com/gin-contrib/cors"

router.Use(cors.New(cors.Config{
    AllowOrigins: []string{
        "http://localhost:3000",
        "https://kerkmeester.com",
        "https://*.vercel.app",  // preview branches
    },
    AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
    AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders: []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge: 12 * time.Hour,
}))
```

Full deploy topology: `references/router/cross_stack_pairing.md`.

---

## 9. Phase 1 → 1.5 → 2 → 3 transition

When implementation is complete:
1. `gofmt -d ./...` — must be empty
2. `go vet ./...` — must be clean
3. `golangci-lint run` — must be clean (catches more than vet)
4. `go test ./...` — must pass; `-race` for concurrency-touching code
5. `go build ./...` — must succeed
6. Open `assets/go/checklists/code_quality_checklist.md` (Phase 1.5) and mark P0/P1 items
7. If anything fails → Phase 2 — `references/go/debugging/`
8. Once green → Phase 3 — `references/go/verification/verification_workflows.md`

Universal severity model: `references/universal/code_quality_standards.md`.

---

## 10. Framework alternatives

| Need | Use |
|---|---|
| Cleaner middleware composition than gin | **Echo** (similar feature set, more idiomatic chaining) |
| Minimalist router without binding helpers | **Chi** (compose your own; great for testing) |
| Familiar Express-style API | **Fiber** (less idiomatic Go but easy onboarding) |
| Strong typing without code generation | **Hertz** (CloudWeGo) |

The architectural shape — handlers → services → repositories, error envelope, validator, JWT — transfers cleanly. See `gin_handler_patterns.md` "Migrating from Echo / Chi" for line-for-line equivalents.

---

## See also

- `references/go/README.md` — branch overview
- `references/router/cross_stack_pairing.md` — React↔Go contract
- `references/universal/multi_agent_research.md` — Phase 0 research methodology
