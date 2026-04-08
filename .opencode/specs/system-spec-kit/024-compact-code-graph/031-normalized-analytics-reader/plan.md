---
title: "Implementation Plan: Normalized Analytics Reader [template:level_3/plan.md]"
description: "Reader-owned replay plan for normalized session analytics, built on the completed Stop-hook producer metadata seam."
trigger_phrases:
  - "normalized analytics plan"
  - "session analytics replay plan"
  - "reader-owned analytics"
  - "024 compact code graph plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Normalized Analytics Reader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js >=18) |
| **Framework** | Claude Code hook runtime plus `better-sqlite3` |
| **Storage** | Dedicated reader-owned SQLite DB under the MCP server data directory |
| **Testing** | Vitest replay tests plus package typecheck |

### Overview
This plan implements the next research-backed continuity packet after the completed producer metadata seam. The work stays reader-owned: extend transcript replay fidelity, add normalized analytics tables plus seed metadata, ingest from hook-state producer metadata, and prove idempotent replay on unchanged and growing transcripts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Producer metadata packet already completed and verified
- [x] Reader-only scope documented clearly
- [x] Success criteria defined around replay/idempotency instead of dashboard output
- [x] Test strategy includes unchanged and growing transcript cases

### Definition of Done
- [x] Transcript replay emits deterministic turn rows
- [x] Analytics DB initializes with normalized schema and seed metadata
- [x] Ingest replays first-run, unchanged, and appended transcript cases correctly
- [x] Packet docs and implementation summary reflect the reader-only boundary
- [x] Typecheck, focused tests, and strict packet validation pass
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the writer boundary stays in the predecessor packet and is not reimplemented here.
- Confirm the active runtime scope is limited to `claude-transcript.ts`, `session-analytics-db.ts`, and focused tests.
- Re-read the continuity ordering before adding any startup or dashboard language.
- Re-run typecheck and strict validation after doc edits.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep active runtime work inside parser, reader DB, and replay tests | Prevents this packet from turning into a dashboard or startup packet |
| AI-BOUNDARY-001 | Consume `producerMetadata` but do not patch the Stop writer again here | Preserves the producer/consumer split from the prior packet |
| AI-TRUTH-001 | Treat pricing lookup data as reader infrastructure, not a finished reporting surface | Keeps later reporting packets honest |
| AI-VERIFY-001 | Require unchanged and growing transcript replay coverage | The packet is only valuable if replay stays deterministic |

### Status Reporting Format

- Start state: confirm predecessor packet and reader-only scope
- Work state: parser changes, analytics schema state, and replay test progress
- End state: typecheck result, focused Vitest result, strict validator result, and follow-on packet recommendations

### Blocked Task Protocol

1. If a change would touch `session-stop.ts`, stop and check whether it belongs in a new producer packet instead.
2. If replay identity becomes ambiguous, prefer `byte_start` over heuristics and update tests before adding more features.
3. If docs start implying dashboards or startup consumers landed, stop and restore the reader-only boundary.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reader-owned normalized replay model

### Key Components
- **`claude-transcript.ts`**: Streaming transcript parser with deterministic turn replay data
- **`session-analytics-db.ts`**: Dedicated SQLite schema, seed metadata, and ingest helpers
- **Replay tests**: First ingest, idempotent re-ingest, and growing-transcript verification
- **Deferred consumers**: Future reporting and startup packets that build on this DB later

### Data Flow
The reader starts from a completed `HookState` that already contains transcript identity and cache-token carry-forward fields. It replays transcript JSONL into normalized turn rows, recomputes session totals from those turns, and exposes additive lookup tables for model pricing and normalized cache tiers. No startup or Stop-hook writer behavior changes in this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm predecessor packet `026/.../002` is complete
- [x] Define reader-only packet scope and follow-on boundaries
- [x] Reuse the existing replay fixture instead of creating a second producer seam

### Phase 2: Core Implementation
- [x] Extend transcript replay parsing with absolute line numbers and byte offsets
- [x] Create normalized analytics DB schema plus lookup-table seeds
- [x] Implement replay ingest keyed by `claudeSessionId` and `byte_start`
- [x] Recompute session totals from normalized turns

### Phase 3: Verification
- [x] Verify first replay creates normalized session and turn rows
- [x] Verify unchanged transcript replay inserts zero new turns
- [x] Verify appended transcript replay inserts only the new turn
- [x] Update packet docs and implementation summary after the runtime checks pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Turn parsing, schema seed rows, aggregate recompute behavior | Vitest |
| Integration | First ingest, double replay, growing-transcript replay | Vitest + fixture transcript |
| Package verification | Type safety for new analytics module and parser changes | `npm run typecheck` |
| Packet verification | Structural compliance of Level 3 docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Producer metadata packet (`026/.../002`) | Internal predecessor | Green | Without transcript identity and cache tokens the reader cannot ingest truthfully |
| `better-sqlite3` analytics storage | Internal runtime dependency | Green | Needed for normalized analytics tables |
| Replay fixture `session-stop-replay.jsonl` | Internal test dependency | Green | Used to prove first replay and idempotency |
| Reporting/dashboard packet | Internal successor | Green | Does not block this packet and remains deferred |
| Startup cached-summary packet | Internal successor | Green | Must remain out of scope so this packet stays reader-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Replay inserts duplicate turns, session totals drift across replays, or docs overstate the packet as a dashboard/startup feature
- **Procedure**: Revert `claude-transcript.ts`, remove `session-analytics-db.ts`, remove the reader tests, and keep the predecessor producer packet intact
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Producer metadata seam (completed predecessor)
                |
                v
Deterministic transcript-turn replay
                |
                v
Normalized analytics DB + seed metadata
                |
                v
Idempotent replay verification
                |
                v
Later packets: reporting contract -> dashboard surface -> startup consumers
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Producer seam | Predecessor packet | Transcript identity and cache-token carry-forward | Reader DB |
| Turn replay parser | Producer seam | Deterministic turn rows | Analytics ingest |
| Analytics DB | Turn replay parser | Queryable sessions, turns, lookup tables | Later reporting packets |
| Replay verification | Analytics DB | Safe handoff signal | Later reporting/startup packets |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Deterministic turn replay** - parser must emit replay-safe offsets before ingest can exist
2. **Normalized schema and ingest** - reader DB must land before replay tests can prove value
3. **Idempotent replay verification** - packet is not complete until unchanged and growing transcript cases pass
4. **Packet closeout** - docs, implementation summary, and strict validation complete the handoff

**Total Critical Path**: One sequential runtime lane plus one documentation closeout lane

**Parallel Opportunities**:
- Packet docs can be drafted once runtime scope is stable
- Typecheck and targeted Vitest runs can execute alongside diff review
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Replay parser ready | Absolute line numbers and byte offsets verified | Phase 2 |
| M2 | Analytics DB ready | Sessions, turns, pricing, and cache-tier tables initialize cleanly | Phase 2 |
| M3 | Replay verification ready | First, unchanged, and growing transcript replays pass | Phase 3 |
| M4 | Packet closed | Strict validation passes and docs match runtime reality | Completion |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep analytics as a reader-owned replay model

**Status**: Accepted
