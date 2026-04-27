---
title: Template Compliance Contract
description: Canonical structural contract defining exact heading and anchor requirements for all spec folder documents at each documentation level (L1-L3+).
---

# Template Compliance Contract

Defines the exact heading hierarchy, required anchors, and content minimums for spec folder documents at each documentation level.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Core Principle

> Every spec folder document must match its level-specific structural contract — the exact heading hierarchy, required anchors, and content minimums — as defined by this reference and enforced by `validate.sh`.

### Source of Truth

- **Generator:** `template-structure.js` `loadTemplateContract()` output (`scripts/utils/template-structure.js`)
- **Applies to:** `distributed-governance spec authoring` agent definitions across all CLIs

### When to Use

- **Before writing** any spec folder `.md` file — consult the contract for the target level
- **After writing** any spec folder `.md` file — run `validate.sh --strict`
- **When syncing** agent definitions after template changes — follow the Sync Protocol (§9)

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:enforcement -->
## 2. ENFORCEMENT

After writing ANY spec folder `.md` file, immediately run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER> --strict
```

Fix ALL errors before proceeding to the next file or workflow step.

---

<!-- /ANCHOR:enforcement -->
<!-- ANCHOR:level-1-contract -->
## 3. LEVEL 1 CONTRACT

Level 1 covers 4 document types using the same core anchors as Level 2 but without L2 addenda sections.

### spec.md — `# Feature Specification: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## 7. OPEN QUESTIONS |

### plan.md — `# Implementation Plan: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| summary | ## 1. SUMMARY |
| quality-gates | ## 2. QUALITY GATES |
| architecture | ## 3. ARCHITECTURE |
| phases | ## 4. IMPLEMENTATION PHASES |
| testing | ## 5. TESTING STRATEGY |
| dependencies | ## 6. DEPENDENCIES |
| rollback | ## 7. ROLLBACK PLAN |

### tasks.md — `# Tasks: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

### implementation-summary.md — `# Implementation Summary`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

---

<!-- /ANCHOR:level-1-contract -->
<!-- ANCHOR:level-2-contract -->
## 4. LEVEL 2 CONTRACT

MANDATORY: Every spec document MUST follow the exact anchor + header structure below.
Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.

### spec.md — `# Feature Specification: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## OPEN QUESTIONS (number varies by level; see note below) |

L2 addenda (after core): `nfr` (## L2: NON-FUNCTIONAL REQUIREMENTS), `edge-cases` (## L2: EDGE CASES), `complexity` (## L2: COMPLEXITY ASSESSMENT)

OPEN QUESTIONS numbering varies by level:
- Level 1: `## 7. OPEN QUESTIONS`
- Level 2: `## 7. OPEN QUESTIONS`
- Level 3: `## 12. OPEN QUESTIONS`
- Level 3+: `## 16. OPEN QUESTIONS`

### plan.md — `# Implementation Plan: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| summary | ## 1. SUMMARY |
| quality-gates | ## 2. QUALITY GATES |
| architecture | ## 3. ARCHITECTURE |
| phases | ## 4. IMPLEMENTATION PHASES |
| testing | ## 5. TESTING STRATEGY |
| dependencies | ## 6. DEPENDENCIES |
| rollback | ## 7. ROLLBACK PLAN |

L2 addenda (after core): `phase-deps` (## L2: PHASE DEPENDENCIES), `effort` (## L2: EFFORT ESTIMATION), `enhanced-rollback` (## L2: ENHANCED ROLLBACK)

### tasks.md — `# Tasks: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

### checklist.md — `# Verification Checklist: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| protocol | ## Verification Protocol |
| pre-impl | ## Pre-Implementation |
| code-quality | ## Code Quality |
| testing | ## Testing |
| security | ## Security |
| docs | ## Documentation |
| file-org | ## File Organization |
| summary | ## Verification Summary |

### implementation-summary.md — `# Implementation Summary`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

---

<!-- /ANCHOR:level-2-contract -->
<!-- ANCHOR:level-3-contract -->
## 5. LEVEL 3 CONTRACT

All Level 2 documents retain their contracts above. Level 3 adds:

### decision-record.md — `# Decision Record: [Title]`

Each ADR uses parametric anchors. Replace `NNN` with the ADR number (e.g., 001):

| Anchor Pattern | Required Content |
|----------------|-----------------|
| adr-NNN | Wraps the entire ADR section |
| adr-NNN-context | ## Context subsection |
| adr-NNN-decision | ## Decision subsection |
| adr-NNN-alternatives | ## Alternatives Considered subsection |
| adr-NNN-consequences | ## Consequences subsection |
| adr-NNN-five-checks | ## Five Checks subsection |
| adr-NNN-impl | ## Implementation Notes subsection |

All 6 sub-anchors are required per ADR, in the order shown above.

---

<!-- /ANCHOR:level-3-contract -->
<!-- ANCHOR:level-3-plus-contract -->
## 6. LEVEL 3+ CONTRACT

Same structural contract as Level 3. Extended governance requirements
(approval tracking, compliance checkpoints, extended checklists) are content-level concerns
enforced by quality-audit.sh, not by structural template contracts.

---

<!-- /ANCHOR:level-3-plus-contract -->
<!-- ANCHOR:content-minimums -->
## 7. CONTENT MINIMUMS

Beyond structural compliance, `validate.sh` enforces minimum content quantities.
Agents MUST meet these thresholds to avoid warnings:

| Metric | Level 1 | Level 2 | Level 3/3+ |
|--------|---------|---------|------------|
| spec.md H2 sections | ≥ 5 | ≥ 7 | ≥ 10 |
| plan.md H2 sections | ≥ 4 | ≥ 6 | ≥ 8 |
| Requirements (`REQ-*` in spec.md) | ≥ 3 | ≥ 5 | ≥ 8 |
| Acceptance scenarios (`**Given**` in spec.md) | ≥ 2 | ≥ 4 | ≥ 6 |

**Requirements format**: Use `REQ-001`, `REQ-002`, etc. in the Requirements section.
**Acceptance scenario format**: Use `**Given** [context], **When** [action], **Then** [outcome]` in the Success Criteria or Edge Cases section.

---

<!-- /ANCHOR:content-minimums -->
<!-- ANCHOR:phase-folder-addenda -->
## 8. PHASE FOLDER ADDENDA

Phase **children** (e.g., `specs/NNN-name/001-phase/`) inherit the base contract for their level plus phase-specific addenda. These are enforced automatically by `validate.sh` via `inferPhaseSpecAddenda()` in `template-structure.js`. No additional agent knowledge is needed for children — follow the base contract and validate after writing.

Phase **parents** are NOT subject to Level 1–3+ structural contracts. When a folder qualifies as a phase parent (≥1 direct child matching `^[0-9]{3}-[a-z0-9-]+$` AND ≥1 such child has `spec.md` OR `description.json`), the parent uses the lean phase-parent template at `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` exclusively and only requires the lean trio: `spec.md` + `description.json` + `graph-metadata.json`. Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live in the children, not at the parent. The validator's phase-parent branch in `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh`, and `check-template-headers.sh` automatically skips Level-N expectations when `is_phase_parent($folder)` returns true.

Phase-parent `spec.md` content discipline is enforced by the advisory `PHASE_PARENT_CONTENT` rule (severity: warn): the parent must avoid consolidation/merge/migration narratives. Required content is root purpose + sub-phase manifest + what-needs-done. Migration history goes into an optional `templates/context-index.md` if needed. Tolerant policy preserves legacy phase parents that retain heavy docs.

---

<!-- /ANCHOR:phase-folder-addenda -->
<!-- ANCHOR:sync-protocol -->
## 9. SYNC PROTOCOL

When templates in `templates/level_N/` change:

1. Run `node scripts/utils/template-structure.js contract <level> <basename>`
   for each changed doc type to extract the updated contract JSON
2. Update this file with the new headers/anchors
3. Update the inline compact contract in all 4 distributed-governance spec-authoring flow definitions:
   - `.claude/agents/speckit.md`
   - `.opencode/agent/speckit.md`
   - `.codex/agents/speckit.toml`
   - `.gemini/agents/speckit.md`
4. Bump the `version` and `last_synced` fields in the Version History below
5. Run `validate.sh` on a sample spec folder to confirm the updated contract is correct

---

<!-- /ANCHOR:sync-protocol -->
<!-- ANCHOR:version-history -->
## 10. VERSION HISTORY

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-22 | Initial creation from template-structure.js contract output |
| 1.1.0 | 2026-03-25 | Aligned to skill reference template; relocated to references/validation/ |

---

<!-- /ANCHOR:version-history -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### References
- [validation_rules.md](./validation_rules.md) — Complete rule reference for all validation checks
- [phase_checklists.md](./phase_checklists.md) — Priority-based checklists per phase
- [path_scoped_rules.md](./path_scoped_rules.md) — Path scoping for validation rules
- [decision_format.md](./decision_format.md) — Standard format for documenting decisions

### Scripts
- [validate.sh](../../scripts/spec/validate.sh) — Validation orchestrator enforcing these contracts
- [template-structure.js](../../scripts/utils/template-structure.js) — Contract extraction engine (`loadTemplateContract()`)

### Templates
- [template_guide.md](../templates/template_guide.md) — Template usage and composition rules

<!-- /ANCHOR:related-resources -->
