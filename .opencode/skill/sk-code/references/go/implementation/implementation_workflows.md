---
title: GO — Phase 1 Implementation Workflows
description: Project-agnostic stub entry doc for the GO Phase 1 implementation walk. Populate with real workflows when a Go service is wired into this skill.
status: stub
stack: GO
populated: false
last_synced_at: 2026-04-30
---

# GO — Phase 1 Implementation Workflows

> **Stub.** Project-agnostic placeholder. This file is the Phase 1 entry point for the GO stack; populate with real implementation walks when a concrete Go service is wired into this skill.

## Intended scope

When populated, this file orchestrates the per-domain implementation walks for a Go HTTP service paired with the NEXTJS frontend stub (gin handler patterns, layered architecture, sqlc + pgx + Postgres data access, go-playground/validator, golang-jwt for auth, REST API design with success/error envelopes, deployment via Docker to Railway / Fly.io / DigitalOcean). It is the doc the smart router loads first when intent is `IMPLEMENTATION`.

## Outline (TODO)

- Project bootstrap (Go version, module init, dev / build / test commands)
- Layout (cmd/ + internal/ + pkg/ conventions)
- Handler layer (gin handler signatures, request binding, response envelope)
- Service layer (handlers → services → repositories, dependency injection, error wrapping)
- Repository layer (sqlc-generated queries, pgx connection pool, transactions)
- Validation layer (go-playground/validator struct tags, custom validators, mirroring zod schemas)
- Auth layer (golang-jwt issuance, parsing, middleware)
- API design (REST conventions, success and error envelopes, status codes, cursor pagination)
- Observability (structured logging with slog, request tracing)

## Per-domain deep-reference docs

When populated, each bullet above will have a dedicated file under `references/go/implementation/`:

- `gin_handler_patterns.md` — handler layer
- `service_layer.md` — service layer architecture
- `database_sqlc_postgres.md` — repository / data layer
- `validation_patterns.md` — validation
- `jwt_middleware.md` — auth middleware
- `api_design.md` — API design (REST + envelopes)
- `error_envelopes.md` — error envelope contract

## See also

- `references/go/README.md` — stack overview
- `references/router/cross_stack_pairing.md` — React ↔ Go contract (canonical)
- `references/webflow/implementation/implementation_workflows.md` — mirror reference (Webflow live branch; structurally similar even though stack differs)
- `SKILL.md` §2 — smart routing

---

---

## 1. OVERVIEW

_TODO: populate this section_

---

