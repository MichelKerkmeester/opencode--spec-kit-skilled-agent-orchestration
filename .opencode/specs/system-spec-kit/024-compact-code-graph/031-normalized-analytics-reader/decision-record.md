---
title: "Decision Record: Normalized [system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/decision-record]"
description: "Keep session analytics as a reader-owned replay model instead of expanding the Stop-hook writer."
trigger_phrases:
  - "analytics reader adr"
  - "normalized analytics decision"
  - "reader-owned replay decision"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Normalized Analytics Reader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Session Analytics as a Reader-Owned Replay Model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Codex + Michel |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a way to query token and replay facts across sessions without reopening the Stop-hook writer. The predecessor packet already persisted transcript identity and cache-token carry-forward data into hook-state. The next safe step was to build a normalized reader that consumes that seam, not to push more analytics logic into `session-stop.ts`.

### Constraints

- The producer boundary from the predecessor packet had to remain intact.
- `claudeSessionId` is the only durable primary join key we can trust today.
- Replay identity had to be deterministic enough for unchanged and growing transcripts.
- The packet could not turn into a dashboard or startup consumer lane.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a dedicated reader-owned SQLite analytics DB fed by deterministic transcript replay and existing hook-state producer metadata.

**How it works**: `parseTranscriptTurns()` emits turn rows with absolute line numbers and byte offsets. `session-analytics-db.ts` ingests those turns into normalized `analytics_sessions` and `analytics_turns` tables, recomputes session totals from the stored turns, and seeds pricing plus cache-tier lookup tables for later reporting packets.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reader-owned replay model** | Preserves the writer boundary, enables cross-session queries, and gives later packets stable replay keys | Adds a new DB module and replay tests | **9/10** |
| Keep scanning raw hook-state JSON | No new DB module required | Not queryable enough, awkward for idempotent replay, and fragile for later reporting packets | 4/10 |
| Expand `session-stop.ts` into an analytics writer | Reuses the existing hook entrypoint | Collapses reader/writer boundaries, adds more work to Stop, and risks startup or reporting drift | 2/10 |

**Why this one**: It solves the real gap now with the smallest truthful architecture change. We get normalized replay data without rewriting the producer seam or pretending a dashboard packet already exists.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cross-session analytics no longer depend on scanning raw hook-state files.
- Replay identity is explicit and testable through `byte_start` offsets plus absolute line numbers.
- Later reporting packets inherit seeded pricing and cache-tier contracts instead of inventing them ad hoc.

**What it costs**:
- We now maintain another SQLite module. Mitigation: keep the schema narrow, additive, and reader-owned.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Replay offsets are not deterministic enough | H | Key turns by `claude_session_id + transcript_path + byte_start` and verify both unchanged and growing replay cases |
| Pricing data is mistaken for a finished reporting surface | M | Keep the packet reader-only and defer dashboard or reporting endpoints explicitly |
| Future work tries to reintroduce analytics into `session-stop.ts` | H | Preserve the writer boundary in the packet docs and rollback plan |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Raw hook-state JSON was not sufficient for cross-session analytics or replay contracts. |
| 2 | **Beyond Local Maxima?** | PASS | We compared raw JSON scanning and writer-side analytics expansion before choosing the reader model. |
| 3 | **Sufficient?** | PASS | Sessions, turns, and lookup tables are enough for the next reporting packet without dragging in dashboards now. |
| 4 | **Fits Goal?** | PASS | The packet closes the exact reader gap the research called for. |
| 5 | **Open Horizons?** | PASS | Later reporting and startup packets can build on this DB without refactoring the producer seam. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `hooks/claude/claude-transcript.ts` now emits deterministic turn replay rows with absolute line numbers and byte offsets.
- `lib/analytics/session-analytics-db.ts` adds the normalized reader schema, seed metadata, and ingest helpers.
- `tests/session-analytics-db.vitest.ts` proves first-run, unchanged, and growing transcript replay behavior.

**How to roll back**: Revert the parser replay changes, remove `session-analytics-db.ts`, remove the analytics replay test file, and keep the completed producer metadata packet unchanged.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
