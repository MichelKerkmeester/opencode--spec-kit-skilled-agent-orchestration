---
title: "Decision Record: Perfect Session Capturing [template:level_3/decision-record.md]"
description: "Record the decision to formalize the post-audit roadmap as phases 018-020 while keeping the live-proof boundary conservative."
trigger_phrases:
  - "decision"
  - "phase 018"
  - "phase 019"
  - "phase 020"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Formalize The Follow-Up Roadmap As Phases 018-020

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Michel Kerkmeester, Codex |

---

### Context

The audit pass already identified the remaining work clearly, but that truth only lived in the parent narrative and `research.md`. Without child phases for runtime contract/indexability, source capabilities, and live proof, the follow-up work would remain discoverable only by reading long synthesis docs instead of the actual phase tree.

### Constraints

- Do not overstate current live CLI proof.
- Do not rewrite older child phases in this pass.
- Use the exact requested phase numbers: `018`, `019`, and `020`.

---

### Decision

**We chose**: add three sequential child phases under the parent pack:

1. `018-runtime-contract-and-indexability`
2. `019-source-capabilities-and-structured-preference`
3. `020-live-proof-and-parity-hardening`

**How it works**:
- Phase `018` documents the shipped validation-rule metadata and explicit write/index dispositions.
- Phase `019` documents the shipped typed source-capability model and structured-input preference.
- Phase `020` documents the still-open retained live-proof work and keeps the parent proof boundary honest.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Create phases 018-020 explicitly (chosen)** | Makes the roadmap visible in the phase tree and keeps the parent pack truthful | Requires parent and child doc synchronization | 10/10 |
| Leave the follow-up work only in `research.md` | Lowest doc effort | Future operators must rediscover the roadmap from long-form audit text | 3/10 |
| Mark the whole parent pack complete and skip new phases | Simplest status story | False closure; hides the retained live-proof gap | 1/10 |

**Why this one**: the remaining work is phase-shaped. The documentation should reflect that directly.

---

### Consequences

**What improves**:
- The parent pack now has an explicit post-audit roadmap.
- Implemented runtime work and open live-proof work are separated cleanly.
- Future operators can resume from phase `020` without rereading the full audit.

**What it costs**:
- The parent pack stays in-progress until retained live proof is refreshed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase numbering drifts again after tooling append operations | Medium | Treat `018`-`020` as canonical and validate recursively |
| Automated parity is mistaken for full CLI closure | High | Keep phase `020` open until retained artifacts exist |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The roadmap needs a first-class place in the phase tree |
| 2 | **Beyond Local Maxima?** | PASS | We compared research-only notes versus phase docs |
| 3 | **Sufficient?** | PASS | Parent sync plus child phases captures the remaining work clearly |
| 4 | **Fits Goal?** | PASS | The user asked for these exact phase folders |
| 5 | **Open Horizons?** | PASS | Phase `020` keeps the final live-proof work resumable |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Add new child folders `018`, `019`, `020`.
- Update the parent Level 3 docs to reference the new roadmap.
- Keep live-proof claims conservative until phase `020` is actually closed.

**How to roll back**: revert only the new child phase markdown and the parent roadmap edits, then rerun recursive validation.
<!-- /ANCHOR:adr-002 -->
