---
title: "Decision Record: Cached SessionStart Consumer (Gated) [template:level_3/decision-record.md]"
description: "Decision record for 012-cached-sessionstart-consumer-gated."
trigger_phrases:
  - "012-cached-sessionstart-consumer-gated"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "decision-record"
---
# Decision Record: Cached SessionStart Consumer (Gated)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Guard cached SessionStart consumption behind fidelity + freshness gates; fail closed to live reconstruction

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Current packet implementation pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

R3 keeps the fast-path idea only as a guarded consumer layered on top of R2 and packet `002`'s shipped producer artifact. The producer already persists transcript identity, cache token carry-forward values, and the bounded Stop-summary wrapper. This packet still needed an explicit decision about how the consumer should behave so that the additive continuity lane does not collapse into a second authority surface or silently reuse stale summaries. [SOURCE: spec.md:22] [SOURCE: spec.md:24] [SOURCE: spec.md:26]

### Constraints

- `session_bootstrap()` and memory resume remain authoritative. [SOURCE: spec.md:24] [SOURCE: spec.md:75]
- Cached summaries are additive continuity wrappers only. [SOURCE: spec.md:22] [SOURCE: spec.md:76]
- The wrapper is not a second packet narrative owner. [SOURCE: spec.md:22] [SOURCE: spec.md:88]
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A guarded additive consumer that evaluates fidelity and freshness first, then enriches existing `resume`, `compact`, and startup continuity surfaces only when every gate passes.

**How it works**: The consumer reads the cached Stop-summary wrapper plus packet `002` producer metadata, checks schema version, required fields, transcript identity, freshness window, and scope compatibility, and either appends bounded continuity notes or fails closed to the existing live reconstruction path with an explicit rejection reason. [SOURCE: spec.md:57] [SOURCE: spec.md:58] [SOURCE: spec.md:59] [SOURCE: spec.md:60]
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Guarded additive consumer** | Preserves R3's bounded fast path and keeps existing recovery surfaces authoritative | Requires explicit gate logic and a frozen corpus before the packet can be considered ready | 9/10 |
| **Authoritative cached fast path** | Looks simpler at runtime because cached output would replace more work | Replaces bootstrap or resume authority, which R3 explicitly rejects | 2/10 |
| **Silent best-effort cache reuse** | Minimizes code and avoids surfacing rejection detail | Violates REQ-007 because invalidation stays implicit and operators cannot diagnose why cache reuse failed | 3/10 |

**Why this one**: It is the only option that matches the research ordering, keeps the producer-consumer boundary honest, and lets the packet prove equal-or-better continuity without turning cached summaries into a second owner surface. [SOURCE: spec.md:24] [SOURCE: spec.md:114] [SOURCE: spec.md:120] [SOURCE: spec.md:121] [SOURCE: spec.md:123]
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cached continuity can help `session_resume`, `session_bootstrap`, and startup hints without replacing live reconstruction. [SOURCE: spec.md:59] [SOURCE: spec.md:60]
- Failures stay diagnosable because the consumer names fidelity and freshness rejection categories explicitly. [SOURCE: spec.md:58] [SOURCE: spec.md:121]

**What it costs**:
- The consumer now carries gate logic, transcript identity checks, and frozen-corpus verification before it can be treated as ready. Mitigation: keep the seam narrow and local to the named owner surfaces. [SOURCE: spec.md:74] [SOURCE: spec.md:78] [SOURCE: spec.md:94] [SOURCE: spec.md:97]

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A cached summary leaks into recovery without all required gates | H | Fail closed on missing summary fields, unreadable transcript state, stale timestamps, and scope mismatch before any additive injection. [SOURCE: spec.md:110] [SOURCE: spec.md:111] [SOURCE: spec.md:123] |
| Startup hints drift into a second owner surface | M | Keep hints optional, derived only from valid cached continuity, and explicitly non-authoritative. [SOURCE: spec.md:113] [SOURCE: spec.md:129] [SOURCE: spec.md:173] |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R3 requires fidelity and freshness gates before any cached SessionStart reuse is allowed. [SOURCE: spec.md:22] [SOURCE: spec.md:110] [SOURCE: spec.md:111] |
| 2 | **Beyond Local Maxima?** | PASS | The packet considered both authoritative cache replacement and silent reuse, and rejected them because they violate the train's authority and invalidation rules. [SOURCE: spec.md:83] [SOURCE: spec.md:86] [SOURCE: spec.md:121] |
| 3 | **Sufficient?** | PASS | The chosen packet stays bounded to `session_bootstrap.ts`, `session-resume.ts`, `session-prime.ts`, and the frozen corpus seam. [SOURCE: spec.md:94] [SOURCE: spec.md:97] |
| 4 | **Fits Goal?** | PASS | The consumer is additive only and keeps `session_bootstrap()` and memory resume explicit as the authoritative surfaces. [SOURCE: spec.md:24] [SOURCE: spec.md:75] [SOURCE: spec.md:143] |
| 5 | **Open Horizons?** | PASS | Successor packet `013` now has an explicit prerequisite: only package a warm-start bundle after this guarded consumer proves itself on the frozen corpus. [SOURCE: spec.md:41] [SOURCE: spec.md:131] [SOURCE: spec.md:161] |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Runtime changes in `session-resume.ts`, `session-bootstrap.ts`, and `session-prime.ts` add guarded cached-summary consumption while keeping live continuity primary.
- The frozen corpus in `scripts/tests/session-cached-consumer.vitest.ts.test.ts` proves stale, scope mismatch, fidelity failure, and valid additive reuse outcomes.
- Packet-local docs now record the bounded consumer decision, closeout evidence, and successor handoff.

**How to roll back**: Revert the packet-local consumer changes, keep packet `002`'s producer contract intact, and fall back to live reconstruction only until a new guarded consumer is ready.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
