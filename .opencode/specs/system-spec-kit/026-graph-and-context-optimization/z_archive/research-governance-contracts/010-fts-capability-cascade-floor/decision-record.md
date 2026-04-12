---
title: "Decision Record: FTS Capability Cascade Floor [template:level_3/decision-record.md]"
description: "Decision record for 010-fts-capability-cascade-floor."
trigger_phrases:
  - "010-fts-capability-cascade-floor"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: FTS Capability Cascade Floor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship the FTS capability cascade floor before cache-warning hooks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet planning pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

R7 says the FTS substrate is already mostly shipped, but runtime truth still needs hardening before continuity analytics or cache-warning readers depend on it. The packet matters because lexical-path truth and forced-degrade behavior should stabilize first.

### Constraints

- Must preserve current retrieval semantics when FTS5 is unavailable.
- Must not overstate an unsupported legacy fallback lane.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Open a bounded packet that hardens FTS capability detection, records the lexical path chosen at runtime, and exposes explicit fallback status before phase `002-implement-cache-warning-hooks`.

**How it works**: The packet keeps the lexical helper, handler, tests, and docs on one truthful forced-degrade vocabulary covering compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **FTS capability cascade floor packet** | Low-risk hardening that stabilizes successor contracts | Still needs later packets for higher-level user-facing work | 8/10 |
| **Skip straight to phase 002** | Feels faster for cache-warning work | Leaves lexical-path truth and degrade semantics unresolved | 5/10 |
| **Claim an unsupported legacy lane anyway** | Sounds like extra coverage | Not supported by the research and would overstate the runtime | 1/10 |

**Why this one**: It preserves the refined packet order and keeps successor work from relying on guessed search capabilities.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Successor packets inherit a truthful lexical-path and fallback contract.
- Forced-degrade handling becomes easier to audit across runtime, tests, and docs.

**What it costs**:
- This packet spends time on runtime truth before visible follow-on features. Mitigation: keep the phase `002` dependency explicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Capability labels drift from reality | H | Freeze the four-case matrix in tests and packet docs. |
| Scope expands into broader search work | M | Keep the packet focused on runtime truth surfaces only. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R7 names this hardening as the first concrete implementation packet in the track. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were considered, including skipping straight to phase `002`. |
| 3 | **Sufficient?** | PASS | The packet focuses on one bounded seam rather than a broader search rewrite. |
| 4 | **Fits Goal?** | PASS | The packet exists to stabilize truthful runtime behavior before successor work. |
| 5 | **Open Horizons?** | PASS | Later packets can build on this contract without redefining lexical fallback semantics. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet-local runtime truth now ships in `memory-search.ts` and `sqlite-fts.ts`, with the handler surfacing `lexicalPath` and `fallbackState` directly on `memory_search` responses.
- Focused tests now freeze compile-probe miss, missing table, `no such module: fts5`, and BM25 runtime failure as distinct degrade cases.
- Packet docs and the runtime search README now describe the same forced-degrade vocabulary, with packet `002-implement-cache-warning-hooks` called out as the downstream consumer.

**How to roll back**: Revert packet-local runtime changes, keep phase `002` blocked, and reopen the seam only after the truthful fallback contract is restored.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
