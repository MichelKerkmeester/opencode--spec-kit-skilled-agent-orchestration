---
title: GO stack — gin backend entry README
description: Project-agnostic stack overview stub for sk-code GO routing. Pairs with the NEXTJS frontend stub via references/router/cross_stack_pairing.md. Populate when a real Go project is wired into this skill.
status: stub
stack: GO
canonical_source: ".opencode/skill/sk-code/references/go/"
populated: false
last_synced_at: 2026-04-30
keywords: [go, golang, gin, echo, sqlc, pgx, postgres, go-playground-validator, golang-jwt, dlv, pprof, golangci-lint]
---

# GO — sk-code stack stub

Stack detected: **GO**. The smart router at `SKILL.md` §2 routes to this branch when a Go project is detected.

> **Stub.** Project-agnostic placeholder. Populate the subfolder content with real patterns once a concrete Go service is wired into this skill.

- [OVERVIEW](#1--overview)

---

## TABLE OF CONTENTS

- [OVERVIEW](#1--overview)

---

## When this branch loads

Marker file: `go.mod`.

## Intended target stack (from SKILL.md description)

When populated, this branch documents a Go microservice backend paired with the NEXTJS frontend stub:

- gin (HTTP framework; alternatives Echo / Chi noted in `implementation/gin_handler_patterns.md`)
- pgx v5 (Postgres driver)
- sqlc (compile-time SQL safety; type-safe Go from SQL queries)
- go-playground/validator (request validation; mirrors zod schemas on the React side)
- golang-jwt (JWT issuance and validation; consumable by Auth.js on the React frontend)
- golang-migrate (SQL migrations)
- golangci-lint (linter aggregator)
- slog (structured logging)
- dlv + pprof (debugging and profiling)

The architectural shape (handlers → services → repositories, error envelope, validation, JWT) transfers to projects that swap any single library.

## Subfolder map

| Subfolder | Status | Intended contents |
|---|---|---|
| `implementation/` | stub | Project layout (cmd/ + internal/ + pkg/), gin handler patterns, layered architecture, sqlc + pgx + Postgres, go-playground/validator, JWT auth, error envelopes, REST API design |
| `debugging/` | stub | dlv debugger workflow, structured logging with slog, request tracing, race detector, pprof profiling |
| `verification/` | stub | `go test ./...` + `golangci-lint run` + `go build ./...` flow |
| `deployment/` | stub | Dockerfile + Railway / Fly.io / DigitalOcean App Platform deploy; env vars; CORS for cross-origin React frontend |
| `standards/` | stub | gofmt / golangci-lint conventions, error wrapping with `%w`, context propagation, no naked goroutines, package layout |

## Asset map

| Asset folder | Status | Intended contents |
|---|---|---|
| `assets/go/checklists/` | stub | P0/P1/P2 checklists for code quality, debugging, verification |
| `assets/go/patterns/` | stub | Reference Go code samples: gin handler, service layer, sqlc-generated repository, JWT middleware, table-driven test |

## Cross-stack pairing

This branch pairs with the **NEXTJS frontend stub** under `references/nextjs/`. For the canonical React ↔ Go API contract, JWT handoff, error envelope shape, CORS configuration, and deploy topology, see `references/router/cross_stack_pairing.md` (canonical contract — not a stub).

## Verification commands

These are the standard Go verification commands; they apply regardless of project specifics:

- `go test ./...` — unit + integration tests (use `-race` for race detector)
- `golangci-lint run` — linter aggregator (gofmt + go vet + staticcheck + many more)
- `go build ./...` — production build (verify all packages compile)

For deeper checks: `go vet ./...`, `go test -race ./...`, `go test -coverprofile=coverage.out ./...`.

## Framework alternatives

- **Echo** — cleaner middleware model than gin, similar feature set
- **Chi** — minimalist router; good if you don't need gin's binding helpers and prefer composition
- **Fiber** — Express-style API on Go; less idiomatic Go but familiar to Node.js developers

The patterns in this branch will use gin as the primary example when populated. The architectural shape (handlers → services → repositories, error envelope, validation, JWT) transfers cleanly to any framework.

## See also

- `SKILL.md` §2 (smart routing)
- `references/universal/` — stack-agnostic core
- `references/router/cross_stack_pairing.md` — React ↔ Go contract

---

---

## 1. OVERVIEW

_TODO: populate this section_

---

