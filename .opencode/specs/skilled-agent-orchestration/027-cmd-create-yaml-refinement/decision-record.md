---
title: "Decision Record: Create Command YAML [03--commands-and-skills/027-cmd-create-yaml-refinement/decision-record]"
description: "Accepted implementation decision covering the shared top-level contract used to normalize the create-command YAML suite."
trigger_phrases:
  - "create yaml refinement adr"
  - "create command yaml standardization decision"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Create Command YAML Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Standardize the Create YAML Suite on One Shared Top-Level Contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-19 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The create-command YAML suite had become uneven. The newer feature-catalog and testing-playbook assets were materially thinner than both the `spec_kit` baseline and the more mature create-command assets, and the broader suite did not expose one stable top-level workflow contract. We needed a normalization approach that made the suite easier to review and extend without redesigning every command.

### Constraints

- Command names and behavior had to stay stable.
- The newer feature/testing assets needed a larger rewrite than the older mature assets.
- `create_folder_readme` already combines README and install-guide branches in one file, so a full split would have been a larger follow-up rather than a safe refinement.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: standardize the entire create YAML suite on one shared top-level contract, then use that contract to rewrite the thinner feature/testing assets and lightly normalize the broader create asset set.

**How it works**: Every create YAML asset now exposes the same core workflow scaffolding concepts such as runtime path resolution, input contract, gate logic, workflow overview, recovery, termination, and rules. The feature-catalog and testing-playbook pairs received the largest upgrades, while the older create assets gained the shared framing without losing their command-specific internals.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Normalize around one shared top-level contract** | Makes the suite coherent without changing user-facing command behavior | Still leaves `create_folder_readme` as a large unified file | 10/10 |
| Only fix the 4 newer YAMLs | Less work immediately | Leaves the broader suite drift in place and weakens the baseline for future assets | 6/10 |
| Split `create_folder_readme` immediately | Could produce the cleanest long-term structure | Much larger scope and higher behavior-regression risk | 5/10 |

**Why this one**: It delivered the biggest structural win for the smallest safe scope. The suite now has one clearer baseline, and the larger `folder_readme` split can remain a deliberate future decision instead of an opportunistic refactor.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The create YAML suite now reads like one family of workflows.
- Future create-command work has a more stable structural baseline.
- Confirm-mode assets for feature catalog and testing playbook no longer feel under-specified.

**What it costs**:
- The YAML files are longer. Mitigation: the added structure is shared and predictable, which lowers review cost across the suite.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Structural normalization accidentally changes behavior | H | Keep command-specific branches and semantics intact while only normalizing top-level framing |
| `create_folder_readme` still feels unusually large | M | Treat it as an explicit short-term exception with better top-level parity |
| Future assets diverge again | M | Use this shared contract as the new baseline for later create-command work |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The suite had visible structural drift across live workflow assets |
| 2 | **Beyond Local Maxima?** | PASS | We considered only fixing the newest files and rejected that as too narrow |
| 3 | **Sufficient?** | PASS | One shared top-level contract addresses the major drift without a full command redesign |
| 4 | **Fits Goal?** | PASS | The work directly targets the user request to mimic `spec_kit` YAML style more closely |
| 5 | **Open Horizons?** | PASS | The suite is now easier to extend, and `folder_readme` can still be split later if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The feature-catalog and testing-playbook asset pairs now expose richer auto/confirm symmetry.
- The agent, changelog, and folder_readme asset pairs now expose the shared top-level contract sections.
- The spec packet records the refinement scope, verification steps, and residual exception for `create_folder_readme`.

**How to roll back**: Revert the affected YAML assets as one batch, rerun the full parse pass, and re-apply the cleanup in smaller groups if necessary.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
