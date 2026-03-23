---
title: Template Compliance Contract
version: 1.0.0
source: template-structure.js (scripts/utils/template-structure.js)
last_synced: 2026-03-22
applies_to: "@speckit agent definitions across all CLIs"
---

# Template Compliance Contract

> Canonical structural contract for all spec folder documents.
> Referenced by @speckit agent definitions across all CLIs.
> Source of truth: `template-structure.js` loadTemplateContract() output.

## Purpose

This file defines the EXACT heading and anchor structure required for every
spec folder document at each documentation level. Agents MUST follow these
contracts when creating or editing spec folder markdown files. The validation
system (`validate.sh`) enforces these contracts post-write.

## Enforcement Rule

After writing ANY spec folder `.md` file, immediately run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER> --strict
```

Fix ALL errors before proceeding to the next file or workflow step.

---

## Level 1 Contract (4 Document Types)

Level 1 uses the same headers/anchors as Level 2 for the 4 shared doc types
(spec.md, plan.md, tasks.md, implementation-summary.md), minus the L2 addenda
sections. Refer to the Level 2 tables below -- include only the core rows
(not the "L2 addenda" lines).

---

## Level 2 Contract (5 Document Types)

MANDATORY: Every spec document MUST follow the exact anchor + header structure below.
Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.

### spec.md -- `# Feature Specification: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## 10. OPEN QUESTIONS |

L2 addenda (after core): `nfr` (## L2: NON-FUNCTIONAL REQUIREMENTS), `edge-cases` (## L2: EDGE CASES), `complexity` (## L2: COMPLEXITY ASSESSMENT)

### plan.md -- `# Implementation Plan: [Title]`

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

### tasks.md -- `# Tasks: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

### checklist.md -- `# Verification Checklist: [Title]`

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

### implementation-summary.md -- `# Implementation Summary`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

---

## Level 3 Contract (Adds decision-record.md)

All Level 2 documents retain their contracts above. Level 3 adds:

### decision-record.md -- `# Decision Record: [Title]`

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

## Level 3+ Contract

Same structural contract as Level 3. Extended governance requirements
(AI protocols, sign-offs, extended checklists) are content-level concerns
enforced by quality-audit.sh, not by structural template contracts.

---

## Content Minimums (SECTION_COUNTS rule)

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

## Phase Folder Addenda

Phase parent/child folders (e.g., `specs/NNN-name/001-phase/`) inherit the
base contract for their level plus phase-specific addenda. These are enforced
automatically by `validate.sh` via `inferPhaseSpecAddenda()` in
`template-structure.js`. No additional agent knowledge is needed -- follow the
base contract and validate after writing.

---

## Sync Protocol

When templates in `templates/level_N/` change:

1. Run `node scripts/utils/template-structure.js contract <level> <basename>`
   for each changed doc type to extract the updated contract JSON
2. Update this file with the new headers/anchors
3. Update the inline compact contract in all 5 @speckit agent definitions:
   - `.claude/agents/speckit.md`
   - `.opencode/agent/speckit.md`
   - `.opencode/agent/chatgpt/speckit.md`
   - `.codex/agents/speckit.toml`
   - `.gemini/agents/speckit.md`
4. Bump the `version` and `last_synced` fields in the frontmatter above
5. Run `validate.sh` on a sample spec folder to confirm the updated contract is correct

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-22 | Initial creation from template-structure.js contract output |
