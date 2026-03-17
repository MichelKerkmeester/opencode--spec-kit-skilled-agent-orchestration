---
title: "Decision Record: Perfect Session Capturing [template:level_3/decision-record.md]"
description: "Keep the remediation honest: preserve runtime boundaries, separate live proof from fixture proof, and let the validator define completion."
trigger_phrases:
  - "decision"
  - "perfect session capturing"
  - "root remediation"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve runtime boundaries and publish only verifiable proof

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-17 |
| **Deciders** | Michel Kerkmeester, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The remediation started from a mixed state. Most code and test surfaces were healthy, but the canonical root spec pack was incomplete and still made a few stale or overstated claims. At the same time, one legacy module-contract lane still expected private or moved internals to be public.

### Constraints

- Keep `notifyDatabaseUpdated` private in `scripts/core/memory-indexer.ts`.
- Do not restore deprecated `scripts/dist/lib/retry-manager` exports when the canonical module now lives under `mcp_server/lib/providers/`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: repair the stale test lane and root spec pack without widening any public runtime boundaries, and record CLI parity as live proof, fixture-backed proof, or blocked with exact reasons.

**How it works**: the module-contract tests now assert the intended architecture instead of demanding deprecated exports. The spec documents now treat the validator, rerun commands, and live session artifacts as the authority for what we can claim complete.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve boundaries and fix tests/docs** | Keeps the runtime honest, matches current architecture, and makes completion claims defensible | Requires more documentation repair and CLI-proof nuance | 9/10 |
| Re-export private or moved internals for compatibility | Would make the old test lane pass quickly | Widens the public surface and conflicts with current architecture | 3/10 |

**Why this one**: the point of this remediation is trust. A passing test lane is not worth reopening private contracts or pretending fixture coverage proves live parity everywhere.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The module-contract lane reflects the real architecture instead of forcing deprecated exports.
- Root documentation can distinguish what was rerun live from what is only fixture-backed.

**What it costs**:
- Completion language becomes more conservative. Mitigation: keep explicit evidence for each CLI and lane.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Live proof differs from fixture proof for a given CLI | H | Record both evidence types separately and mark blocked cases explicitly |
| Recursive validation still finds phase-link drift | M | Add minimal predecessor and successor metadata without rewriting child content |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The root spec pack and one canonical lane were still blocking truthful completion |
| 2 | **Beyond Local Maxima?** | PASS | We compared test-only compatibility fixes against boundary-preserving repairs |
| 3 | **Sufficient?** | PASS | Minimal test and documentation patches resolve the known blockers without widening scope |
| 4 | **Fits Goal?** | PASS | The goal is accurate closure, not cosmetic parity |
| 5 | **Open Horizons?** | PASS | Keeping proof categories explicit scales to future CLI additions and validator changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Update `test-scripts-modules.js` to assert privacy and canonical provider boundaries.
- Restore the root Level 3 spec pack and phase-link metadata so recursive validation can certify the folder truthfully.

**How to roll back**: revert the root markdown pack and the module-lane test changes, rerun the legacy lane, and re-evaluate whether boundary widening is genuinely intended.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
