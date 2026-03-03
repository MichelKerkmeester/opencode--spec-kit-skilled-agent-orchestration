---
title: "Decision Record: Sprint 9 — Extra Features"
description: "Architecture decisions for the productization and operational tooling sprint."
trigger_phrases:
  - "sprint 9 decisions"
  - "019 decisions"
  - "ADR"
importance_tier: "high"
contextType: "decision"
---
# Decision Record: Sprint 9 — Extra Features

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Zod for MCP Schema Validation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + 6 research agents (5/6 consensus) |

---

### Context

LLM agents calling MCP tools sometimes hallucinate parameters that don't exist. The current tool surface (~20 tools) has no strict input validation. Invalid parameters are silently ignored, leading to unpredictable behavior and wasted tool-call rounds.

### Constraints

- Must not reject currently-valid parameter combinations (backward compatibility)
- Validation overhead must be <5ms per call
- Error messages must be actionable (LLMs need to self-correct)

### Decision

**We chose**: Zod schemas with `.strict()` enforcement, gated behind `SPECKIT_STRICT_SCHEMAS` feature flag.

**How it works**: Each tool gets a Zod schema matching its current valid parameters. In strict mode, unexpected keys are rejected with a clear error. In passthrough mode (transition period), unexpected keys are accepted but logged.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Zod `.strict()`** | Type-safe, composable, great error messages, widely adopted | Additional dependency | 9/10 |
| Manual validation | No dependency | Verbose, error-prone, poor messages | 4/10 |
| JSON Schema (ajv) | Standard format | Heavier, worse TypeScript integration | 6/10 |
| io-ts | FP-style, composable | Steeper learning curve, smaller community | 5/10 |

**Why this one**: Zod is the TypeScript ecosystem standard for runtime validation. It produces human-readable error messages that LLMs can parse and self-correct from. The `.strict()` mode is exactly what we need.

### Consequences

**What improves**:
- LLM tool-call success rate increases (clear errors enable self-correction)
- Parameter documentation becomes code (schemas are the source of truth)
- Future schema changes are explicit and type-checked

**What it costs**:
- ~50KB dependency addition. Mitigation: Zod is already standard in the TypeScript ecosystem.
- Potential breakage for callers using undocumented parameters. Mitigation: `.passthrough()` transition period.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | LLM hallucination of parameters is a real, observed problem |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; Zod wins on TypeScript integration |
| 3 | **Sufficient?** | PASS | Zod covers validation, typing, and error generation in one tool |
| 4 | **Fits Goal?** | PASS | Direct path to API hardening without refactoring internals |
| 5 | **Open Horizons?** | PASS | Schemas enable future OpenAPI generation and contract testing |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: In-Process Job Queue (Not Redis/External)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + 016 synthesis |

---

### Context

Bulk indexing of 100+ spec files can exceed MCP timeout limits. We need asynchronous job processing with state tracking. The question is where to run the queue.

### Constraints

- Memory MCP runs as a local single-user process
- No external infrastructure dependencies (local-first)
- Must survive server restarts (crash recovery)

### Decision

**We chose**: In-process job queue with SQLite persistence for state, no external queue system.

**How it works**: Jobs are managed in-memory with state transitions persisted to a `jobs` table in the existing SQLite database. On restart, incomplete jobs are detected and can be retried.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process + SQLite** | Zero deps, local-first, crash recovery | Single-process concurrency limits | 9/10 |
| Redis queue (BullMQ) | Battle-tested, scalable | External dependency, overkill for single-user | 4/10 |
| File-based queue | Simple | No atomic state transitions, race conditions | 3/10 |

**Why this one**: The Memory MCP is a local-first, single-user system. Adding Redis for a job queue would violate the zero-dependency operational story. SQLite persistence provides crash recovery without external infrastructure.

### Consequences

**What improves**:
- Bulk indexing works reliably within MCP timeout constraints
- Job progress is queryable via standard MCP tool calls
- Zero operational overhead (no Redis to manage)

**What it costs**:
- Limited to single-process throughput. Mitigation: adequate for single-user; if multi-user needed, P2-8 daemon mode would address this.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | MCP timeouts on bulk operations are a real blocker |
| 2 | **Beyond Local Maxima?** | PASS | Redis considered and rejected for complexity reasons |
| 3 | **Sufficient?** | PASS | SQLite persistence handles crash recovery |
| 4 | **Fits Goal?** | PASS | Directly solves bulk indexing timeout problem |
| 5 | **Open Horizons?** | PASS | Queue pattern can scale to daemon mode later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Feature Flags Over Breaking Changes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User |

---

### Context

This sprint adds new behavior (strict validation, response envelopes, file watching) that could break existing consumers. We need a deployment strategy.

### Constraints

- Existing workflows must not break
- New features should be testable independently
- Rollback must be instantaneous (no code revert)

### Decision

**We chose**: Every new behavior behind a feature flag with conservative defaults. Risky features (file watcher, local reranker) default to OFF. Safe features (dynamic init, context headers) default to ON.

**How it works**: Environment variables following the existing `SPECKIT_` naming convention. Each feature can be toggled independently without code changes.

### Feature Flag Summary

| Flag | Default | Rationale |
|------|---------|-----------|
| `SPECKIT_STRICT_SCHEMAS` | `true` | High confidence from audit; `.passthrough()` available as escape hatch |
| `SPECKIT_RESPONSE_TRACE` | `false` | Opt-in to avoid token inflation |
| `SPECKIT_CONTEXT_HEADERS` | `true` | Low risk, high value, capped at 100 chars |
| `SPECKIT_FILE_WATCHER` | `false` | Risk of SQLITE_BUSY; opt-in until proven stable |
| `SPECKIT_DYNAMIC_INIT` | `true` | Zero risk, immediate value |
| `RERANKER_LOCAL` | `false` | Existing flag; hardware-dependent |

### Consequences

**What improves**:
- Zero-downtime deployment and rollback
- Individual feature testing and gradual rollout
- Existing workflows guaranteed unchanged

**What it costs**:
- Code complexity from flag checks. Mitigation: follow existing patterns (SPECKIT_ flags are already pervasive in the codebase).

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Breaking existing workflows is unacceptable |
| 2 | **Beyond Local Maxima?** | PASS | Alternative (versioned tools) is heavier and premature |
| 3 | **Sufficient?** | PASS | Covers all new features with independent toggles |
| 4 | **Fits Goal?** | PASS | Enables safe productization |
| 5 | **Open Horizons?** | PASS | Flags can be promoted to permanent once stable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Defer P2 Items Until Demand-Driven Triggers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + 016 synthesis |

---

### Context

5 of the 16 original recommendations are genuinely new but low-priority. Building them now risks premature abstraction and wasted effort.

### Constraints

- Engineering time is finite
- P0/P1 items deliver higher ROI
- P2 items have clear trigger conditions

### Decision

**We chose**: Explicitly defer all P2 items with documented trigger conditions. Do not build until the trigger fires.

| P2 Item | Trigger to Build |
|---------|-----------------|
| Daemon mode | MCP SDK standardizes HTTP transport |
| Storage adapters | Corpus exceeds 100K memories |
| Namespaces | Multi-tenant deployment demand |
| ANCHOR graph nodes | 2-day spike shows clear value |
| AST sections | Spec docs regularly exceed 1000 lines |

### Consequences

**What improves**:
- Focus on highest-ROI work
- No premature abstractions (storage adapters, namespaces)
- Each P2 item has a clear, measurable trigger

**What it costs**:
- Potential delay if a trigger fires unexpectedly. Mitigation: P2 items are well-documented in spec.md with implementation sketches ready to go.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents wasted engineering effort |
| 2 | **Beyond Local Maxima?** | PASS | Each item evaluated individually |
| 3 | **Sufficient?** | PASS | Trigger conditions are specific and measurable |
| 4 | **Fits Goal?** | PASS | Aligns with "productization, not architecture" thesis |
| 5 | **Open Horizons?** | PASS | Items preserved with full implementation sketches |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: No QMD Integration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + comparative analysis |

---

### Context

QMD (by Tobias Lutke) was one of the 3 external systems analyzed by the research agents. It provides BM25, semantic, and hybrid search for Obsidian vaults. The question was whether to integrate it as an additional search backend.

### Decision

**We chose**: No integration. The Memory MCP already surpasses QMD's search capabilities (5-channel pipeline vs 3-mode search, causal graph, attention decay, evaluation framework). Integrating QMD would add a redundant search layer.

**What we learned from QMD**: The best patterns were already adopted as architectural inspiration for P0-1 (Zod schemas from QMD's strict tool contracts), P1-5 (local reranking from QMD's node-native approach), and P1-7 (file watching from QMD's auto-indexing).

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | FAIL | Existing search is stronger; integration adds no unique capability |
| 2 | **Beyond Local Maxima?** | PASS | Thoroughly analyzed (12 research docs, comparative matrix) |
| 3 | **Sufficient?** | N/A | Decision is to NOT integrate |
| 4 | **Fits Goal?** | PASS | Avoids unnecessary dependency |
| 5 | **Open Horizons?** | PASS | Can revisit if QMD adds unique capabilities later |

**Checks Summary**: Decision correctly deferred — QMD's value was in architectural inspiration, not direct integration.
<!-- /ANCHOR:adr-005 -->
