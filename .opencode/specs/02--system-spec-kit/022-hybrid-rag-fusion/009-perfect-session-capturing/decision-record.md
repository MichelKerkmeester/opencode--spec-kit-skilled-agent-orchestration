---
title: "Decision Record: Perfect [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/decision-record]"
description: "The parent pack remains audit-first and now treats the current on-disk phase layout as canonical navigation truth."
trigger_phrases:
  - "decision"
  - "perfect session capturing"
  - "roadmap phases 018 019"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat Runtime Truth As Canonical And Make The Parent Pack Audit-First

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Michel Kerkmeester, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parent `009-perfect-session-capturing` pack had drifted away from on-disk truth. The runtime and targeted tests had already moved beyond the published docs, several direct-child folders had been renamed or moved into `000-dynamic-capture-deprecation/`, and the parent pack still pointed at folders that no longer existed. The pack needed a durable way to keep authoritative navigation current without rewriting provenance-heavy history.

### Constraints

- The parent pack must stay structurally clean under recursive strict validation.
- The reconciled audit baseline through phase `017` must remain visible.
- Proof language must stay more conservative than the strongest unsupported claim.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: treat the current runtime and existing audit evidence as canonical truth, preserve `research/research.md` as the detailed synthesis, and keep the parent pack as the main audit entry point.

**How it works**: the parent spec summarizes the reconciled phase history, the proof boundaries, and the remaining open design work without hiding behind obsolete closure language.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Audit-first parent pack grounded in runtime truth (chosen)** | Matches the best available evidence and keeps readers aligned | Requires active maintenance of the parent narrative | 10/10 |
| Preserve the old closure story and only fix validation issues | Minimal doc effort | Leaves readers with the wrong picture of proof closure | 1/10 |
| Hide the audit in `research/research.md` only | Keeps the parent pack short | Makes the top-level spec less trustworthy as an entry point | 4/10 |

**Why this one**: It is the only option that keeps the top-level pack useful after the folder moves and renames while still preserving historical evidence as history.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The parent pack stays trustworthy as the entry point.
- Earlier shipped phases remain visible as reconciled history.
- Proof gaps stay explicit.

**What it costs**:
- The root pack needs continued maintenance whenever new roadmap phases are introduced.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future edits overclaim parity closure | High | Keep retained live proof as a separate requirement |
| Parent and child docs drift again | Medium | Re-run recursive validation after roadmap changes |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent pack must remain a reliable entry point |
| 2 | **Beyond Local Maxima?** | PASS | We compared old closure language and research-only alternatives |
| 3 | **Sufficient?** | PASS | Audit-first parent docs solve the trust problem without broadening scope |
| 4 | **Fits Goal?** | PASS | The user asked for truthful roadmap and audit documentation |
| 5 | **Open Horizons?** | PASS | The parent pack can absorb later roadmap phases cleanly |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Keep the parent pack centered on the audit truth.
- Preserve `research/research.md` as the detailed synthesis.
- Reconcile future roadmap phases through explicit child folders rather than vague parent-only prose.
- Record phase `018` as shipped follow-up work and keep phase `019` explicitly analysis-only.

**How to roll back**: revert only the affected runtime/docs files, restore the previous validated parent narrative, and rerun focused verification plus recursive validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
