---
title: "Decision Record: Nested Changelog Per Spec [02--system-spec-kit/025-nested-changelog-per-spec/decision-record]"
description: "Architecture decisions for packet-local nested changelog generation in system-spec-kit."
trigger_phrases:
  - "decision record"
  - "nested changelog"
  - "025"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Nested Changelog Per Spec

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Nested Changelog Additive and Packet-Scoped

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-03 |
| **Deciders** | Packet implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to add packet-local changelog support without breaking the existing Spec Kit completion contract. `implementation-summary.md` is already a required closeout artifact, so turning a changelog into its replacement would blur responsibilities and make packet output harder to reason about.

### Constraints

- `implementation-summary.md` already has strong workflow and template support across System Spec Kit.
- Existing packet changelog examples were useful, but they were not standardized enough to become the only closeout artifact.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep nested changelog generation additive to `implementation-summary.md`, not a replacement.

**How it works**: the generator derives packet-local change history into `changelog/` while `implementation-summary.md` remains the narrative closeout artifact. Command and skill docs now say both artifacts may be produced for packet-aware workflows, with the changelog focused on chronological packet history.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep changelog additive** | Preserves existing closeout contract, keeps artifact roles clear | Adds one more artifact for packet-aware workflows | 9/10 |
| Replace implementation summary with changelog | Fewer output files | Loses narrative summary, breaks current completion expectations | 4/10 |
| Leave packet changelogs ad hoc | No workflow changes needed | Continues drift and manual filename decisions | 3/10 |

**Why this one**: It solves the real workflow gap without destabilizing the rest of System Spec Kit. The packet can gain chronological history while keeping the implementation summary as the primary closeout narrative.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet roots and phase folders can now produce consistent packet-local history.
- Existing completion workflows stay understandable because the changelog has a distinct role.

**What it costs**:
- Packet-aware closeout can now produce two artifacts instead of one. Mitigation: command docs explicitly explain when the nested changelog should run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users assume the changelog replaces the summary | Medium | Repeat additive language in command, skill, and packet docs |
| Output path handling drifts across root and phase workflows | High | Keep path rules in `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts` and point docs at the same generator |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet `024` showed the need for a canonical nested workflow |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives included replacement and ad hoc continuation |
| 3 | **Sufficient?** | PASS | One additive generator solves the gap without restructuring closeout |
| 4 | **Fits Goal?** | PASS | Directly addresses packet-local history creation |
| 5 | **Open Horizons?** | PASS | Leaves room for future validator enforcement if later desired |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add `.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts`
- Add `.opencode/skill/system-spec-kit/templates/changelog/root.md` and `.opencode/skill/system-spec-kit/templates/changelog/phase.md`
- Update commands and docs to explain additive packet-local changelog output and the root/phase path contract

**How to roll back**: revert the nested generator, changelog templates, and command/documentation updates together, then return to implementation-summary-only packet closeout.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
