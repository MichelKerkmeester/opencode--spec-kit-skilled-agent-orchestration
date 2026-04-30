---
title: Go stack — gin + sqlc + Postgres live branch
description: Live reference content for sk-code GO routing. A microservice backend pairing for the React/Next.js live branch — gin HTTP framework + sqlc compile-time SQL safety + Postgres via pgx + go-playground/validator + golang-jwt for auth.
status: live
stack: GO
canonical_source: ".opencode/skill/sk-code/references/go/"
populated: true
last_synced_at: "2026-04-30"
keywords: [go, golang, gin, echo, sqlc, pgx, postgres, go-playground-validator, golang-jwt, dlv, pprof, golangci-lint]
---

# Go — sk-code live branch

Stack detected: **GO**. Live content under this folder is the canonical Go-microservice backend pairing for the React/Next.js frontend live branch — patterns chosen to integrate cleanly with the kerkmeester-style frontend (zod schemas mirrored on the Go side; JWT handoff to Auth.js; error-envelope shape consistent with React expectations).

This branch was promoted from placeholder to live in packet `056-sk-code-fullstack-branch/` (2026-04-30).

## When this branch loads

The smart router at `SKILL.md` §2 routes to this branch when stack detection identifies a Go project — marker: `go.mod`.

## Recommended stack

- **Go 1.22+** (uses generics + range-over-func patterns where helpful)
- **gin** as the primary HTTP framework (popular, well-documented; alternatives Echo / Chi noted in `implementation/gin_handler_patterns.md`)
- **pgx v5** as the Postgres driver (modern, performance-focused, supports listen/notify)
- **sqlc** for compile-time SQL safety (generates type-safe Go from SQL queries; better than GORM for kerkmeester scale)
- **go-playground/validator** for request validation (mirrors zod schemas on the React side)
- **golang-jwt/jwt v5** for JWT issuance and validation (consumable by Auth.js on the React frontend)
- **golang-migrate** for SQL migrations
- **golangci-lint** as the linter aggregator

## Subfolder map

| Subfolder | Contents | Phase |
|---|---|---|
| `implementation/` | Project layout (cmd/ + internal/ + pkg/), gin handler patterns, layered architecture (handlers → services → repositories), sqlc + pgx + Postgres, go-playground/validator, JWT auth, error envelopes, REST API design | Phase 1 |
| `debugging/` | dlv debugger workflow, structured logging with slog, request tracing, race detector, pprof profiling | Phase 2 |
| `verification/` | `go test ./...` + `golangci-lint run` + `go build ./...` flow | Phase 3 |
| `deployment/` | Dockerfile + Railway / Fly.io / DigitalOcean App Platform deploy; env vars; CORS for cross-origin React frontend | Phase 3 |
| `standards/` | gofmt / golangci-lint conventions, error wrapping (`fmt.Errorf("...%w", err)`), context propagation, no naked goroutines, package layout | Phase 1.5 |

## Asset map

| Asset folder | Contents |
|---|---|
| `assets/go/checklists/` | P0/P1/P2 checklists for code quality, debugging, verification |
| `assets/go/patterns/` | Working Go code samples: gin handler, service layer, sqlc-generated repository, JWT middleware, table-driven test |

## Cross-stack pairing

This branch pairs with the **React/Next.js frontend live branch** (`references/react/`). For the canonical React↔Go API contract, JWT handoff, error envelope shape, CORS configuration, and deploy topology, see `references/router/cross_stack_pairing.md`.

## Verification commands

```bash
go test ./...            # unit + integration tests (use -race for race detector)
golangci-lint run        # linter aggregator (gofmt + go vet + staticcheck + many more)
go build ./...           # production build (verify all packages compile)
```

For deeper checks: `go vet ./...`, `go test -race ./...`, `go test -coverprofile=coverage.out ./...`.

## Framework alternatives

- **Echo** — cleaner middleware model than gin, similar feature set. See `implementation/gin_handler_patterns.md` "Migrating from Echo / Chi" section.
- **Chi** — minimalist router; good if you don't need gin's binding helpers and prefer composition.
- **Fiber** — Express-style API on Go; less idiomatic Go but familiar to Node.js developers.

The patterns in this branch use gin as the primary example. The architectural shape (handlers → services → repositories, error envelope, validation, JWT) transfers cleanly to any framework.

## See also

- `SKILL.md` §2 (smart routing)
- `references/universal/` — stack-agnostic core
- `references/router/cross_stack_pairing.md` — React↔Go contract
