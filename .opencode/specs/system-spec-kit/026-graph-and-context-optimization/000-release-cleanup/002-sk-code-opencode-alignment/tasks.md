---
title: "Tasks: sk-code-opencode Alignment"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task breakdown for auditing and aligning sk-code-opencode standards, verifier guidance, checklists, and release-cleanup metadata."
trigger_phrases:
  - "sk-code-opencode alignment tasks"
  - "002-sk-code-opencode-alignment tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-sk-code-opencode-alignment"
    last_updated_at: "2026-04-28T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented sk-code-opencode alignment"
    next_safe_action: "Review final diff or commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-code-opencode Alignment

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Read system-spec-kit planning workflow and templates (`.opencode/skill/system-spec-kit/`)
- [x] T002 [P] Audit parent/root resource maps and release-cleanup phase state (`specs/system-spec-kit/026-graph-and-context-optimization/`)
- [x] T003 [P] Audit current `sk-code-opencode` skill surface (`.opencode/skill/sk-code-opencode/`)
- [x] T004 [P] Inspect system-spec-kit integration points for skill routing and command ownership (`.opencode/command/spec_kit/`, `.opencode/skill/system-spec-kit/`)
- [x] T005 [P] Inspect neighboring release-cleanup spec style (`000-release-cleanup/003-*`, `000-release-cleanup/004-*`)
- [x] T006 Record implementation-time drift inventory for module systems, verifier claims, header shapes, and evidence citations. [EVIDENCE: package configs, verifier script/tests, and targeted `rg` checks read before edits]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T101 Align TypeScript NodeNext ESM and legacy CommonJS guidance. [EVIDENCE: `.opencode/skill/sk-code-opencode/references/typescript/quality_standards.md`, `.opencode/skill/sk-code-opencode/references/typescript/style_guide.md`, `.opencode/skill/sk-code-opencode/references/typescript/quick_reference.md`, `.opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md`]
- [x] T102 Align JavaScript CommonJS versus plugin ESM guidance. [EVIDENCE: `.opencode/skill/sk-code-opencode/references/javascript/quality_standards.md`, `.opencode/skill/sk-code-opencode/references/javascript/style_guide.md`, `.opencode/skill/sk-code-opencode/references/javascript/quick_reference.md`, `.opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md`]
- [x] T103 Align verifier contract docs with script behavior, or update script/tests. [EVIDENCE: docs now state marker-level automatic checks and manual checklist gates; verifier code unchanged]
- [x] T104 Normalize header examples across docs and checklists. [EVIDENCE: TS checklist says module header; JS docs scope boxed headers and strict mode by extension/path]
- [x] T105 Refresh stale evidence citations and missing-path examples. [EVIDENCE: shared and Python references now use current full paths or mark examples as historical]
- [x] T106 Update `sk-code-opencode` README and related-resource lists. [EVIDENCE: README now documents module boundaries and verifier limits]
- [x] T107 Refresh child and parent metadata after edits. [EVIDENCE: skill graph metadata and child packet metadata updated]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T201 Run `verify_alignment_drift.py --root .opencode/skill/sk-code-opencode`. [EVIDENCE: PASS, scanned 3 supported files, 0 findings]
- [x] T202 Run verifier tests if verifier code changed. [EVIDENCE: verifier code unchanged; existing tests also run, 9 passed]
- [x] T203 Run targeted `rg` checks for stale contradictions. [EVIDENCE: no active parent/sibling `002-feature-catalog` hits; stale CommonJS/ESM claims scoped]
- [x] T204 Run strict validation on this child packet. [EVIDENCE: strict validation passed after implementation]
- [x] T205 Validate parent release-cleanup packet or document unrelated pre-existing validation noise. [EVIDENCE: parent validation remains blocked by historical sibling issues, documented in summary]
- [x] T206 Update implementation summary after implementation. [EVIDENCE: implementation summary updated from planning-only to implemented]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 checklist items are marked with evidence.
- [x] No stale `002-feature-catalog` references remain in active parent metadata.
- [x] Verifier and docs agree on automatic versus manual gates.
- [x] Metadata refreshes are complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
