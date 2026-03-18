---
title: "Global Quality Sweep Protocol: 018-sk-code-opencode-refinement"
description: "Mandatory closure protocol for global verification, defect sweep, and standards compliance before completion claim."
SPECKIT_TEMPLATE_SOURCE: "governance-extension | adapted from 139 global-quality-sweep"
trigger_phrases:
  - "global quality sweep"
  - "closure protocol"
  - "final verification"
  - "defect sweep"
  - "standards compliance audit"
importance_tier: "critical"
contextType: "implementation"
---
# Global Quality Sweep Protocol: 018-sk-code-opencode-refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: governance-extension | adapted from 139 global-quality-sweep -->

---

<!-- ANCHOR:purpose -->
## Purpose and Scope

This document defines the mandatory closure protocol that must execute before any completion claim for `018-sk-code-opencode-refinement`.

Protocol coverage is global and includes every changed file in scope across:
- `.opencode/skill/sk-code--opencode/` shared references, language guides, and checklists.
- Optional `.opencode/skill/sk-code--review/` files if the conditional alignment trigger is met.
- Level 3+ spec artifacts used to prove planning, decision, verification, and closure consistency.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:mandatory-closure -->
## Mandatory Closure Protocol

### 1) Global Testing Round (Required)

- Execute one consolidated verification round across all changed files.
- Include policy assertions for inline comment threshold, AI-oriented comment semantics, numbered ALL-CAPS headers, and KISS/DRY/SOLID coverage.
- Include spec artifact validation command for this folder.
- Record every command and result in the evidence table (`ANCHOR:evidence-table`).

### 2) Global Bug Detection Sweep (Required)

- Aggregate all defects discovered during the global testing round.
- Log each defect with severity, owner, and status.
- Completion claim is blocked unless unresolved counts are:
  - `P0 = 0`
  - `P1 = 0`

### 3) `sk-code--opencode` Compliance Audit (Required)

- Audit changed `sk-code--opencode` files for alignment to refined policy contract.
- Verify scope lock and non-regression rules from `spec.md` and `decision-record.md`.
- Publish compliance result and evidence path in the table.

### 4) Conditional Standards Update Pathway (Conditional)

- Evaluate whether updated `sk-code--opencode` policy creates unresolved mismatch with `sk-code--review` baseline detection.
- If mismatch exists:
  - Apply minimal scoped updates to optional review files.
  - Re-run targeted review alignment verification commands.
  - Record evidence as Applied.
- If mismatch does not exist:
  - Mark pathway `N/A` with rationale and supporting command evidence.
<!-- /ANCHOR:mandatory-closure -->

---

<!-- ANCHOR:commands -->
## Command Bundle (File-Level)

```bash
# Policy assertions: threshold and AI semantics
rg -n "Maximum 3 comments per 10 lines|WHY|GUARD|INVARIANT|REQ-|BUG-|SEC-|RISK|PERF" \
  .opencode/skill/sk-code--opencode/SKILL.md \
  .opencode/skill/sk-code--opencode/references/shared/universal_patterns.md \
  .opencode/skill/sk-code--opencode/references/javascript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/typescript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/python/style_guide.md \
  .opencode/skill/sk-code--opencode/references/shell/style_guide.md \
  .opencode/skill/sk-code--opencode/references/config/style_guide.md

# Header non-regression: numbered ALL-CAPS sections
rg -n "^## [0-9]+\\. [A-Z0-9 ()/:-]+$" \
  .opencode/skill/sk-code--opencode/references/shared/code_organization.md \
  .opencode/skill/sk-code--opencode/references/javascript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/typescript/style_guide.md \
  .opencode/skill/sk-code--opencode/references/python/style_guide.md \
  .opencode/skill/sk-code--opencode/references/shell/style_guide.md \
  .opencode/skill/sk-code--opencode/references/config/style_guide.md

# Principle enforcement checks
rg -n "KISS|DRY|SRP|OCP|LSP|ISP|DIP" \
  .opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md \
  .opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md

# Optional review alignment checks (run only if review files changed)
rg -n "KISS|DRY|SOLID|module|adapter|interface|abstraction|responsibility|dependency|boundary" \
  .opencode/skill/sk-code--review/SKILL.md \
  .opencode/skill/sk-code--review/references/quick_reference.md \
  .opencode/skill/sk-code--review/references/code_quality_checklist.md \
  .opencode/skill/sk-code--review/references/solid_checklist.md

# Spec folder structure validation
.opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/03--commands-and-skills/018-code-opencode-refinement
```
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:evidence-table -->
## Evidence Table

| Evidence ID | Protocol Step | Command / Check | Result Summary | Artifact / Link | Defects (P0/P1/P2) | Owner | Status |
|-------------|---------------|-----------------|----------------|-----------------|--------------------|-------|--------|
| EVT-001 | Global Testing Round | Run command bundle sections 1, 2, 3, and spec validation | PASS. Policy semantics assertions, header invariants, and KISS/DRY/SOLID coverage all passed; spec validation passed with one advisory warning (`SECTION_COUNTS`). | `.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/scratch/final-quality-evidence-2026-02-22.md` | `0/0/0` | Spec closure owner | Closed |
| EVT-002 | Global Bug Detection Sweep | Consolidate defects from EVT-001 outputs and scoped diffs | PASS. No defects detected across verification outputs and scoped changed-file audit. | `.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/scratch/final-quality-evidence-2026-02-22.md` | `0/0/0` | Spec closure owner | Closed |
| EVT-003 | `sk-code--opencode` Compliance Audit | Scope check + policy/checklist invariant audit | PASS. Scope audit confirmed changed files remained within declared implementation scope (4 files). | `.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/scratch/final-quality-evidence-2026-02-22.md` | `0/0/0` | Spec closure owner | Closed |
| EVT-004 | Conditional Standards Update Pathway | Review mismatch decision + optional command bundle section 4 | PASS (Applied). Conditional review alignment path executed and assertions passed after minimal scoped review updates. | `.opencode/specs/03--commands-and-skills/018-code-opencode-refinement/scratch/final-quality-evidence-2026-02-22.md` | `0/0/0` | Spec closure owner | Closed |
<!-- /ANCHOR:evidence-table -->

---

<!-- ANCHOR:defect-log -->
## Defect Log Template for Sweep Execution

| Defect ID | Severity | File | Summary | Owner | Status |
|-----------|----------|------|---------|-------|--------|
| None | N/A | N/A | No defects were discovered during EVT-001 through EVT-004. | Spec closure owner | Closed |

Current unresolved counts:
- `P0: 0`
- `P1: 0`
- `P2: 0`
<!-- /ANCHOR:defect-log -->

---

<!-- ANCHOR:closure-gate -->
## Closure Gate

Completion claim for this spec is permitted only when all conditions below are true:

- [x] Global testing round completed with published evidence (`EVT-001`).
- [x] Global bug detection sweep completed with unresolved `P0=0` and `P1=0` (`EVT-002`).
- [x] `sk-code--opencode` compliance audit completed with evidence (`EVT-003`).
- [x] Conditional standards update pathway decision completed (`EVT-004`) as either Applied or N/A with rationale.
- [x] Spec documents synchronized and checklist evidence slots updated.

**Closure Gate Decision**: SATISFIED WITH WARNING. All mandatory closure checks passed with unresolved defects `P0=0`, `P1=0`; spec validation reported one advisory warning (`SECTION_COUNTS`).
<!-- /ANCHOR:closure-gate -->
