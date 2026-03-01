---
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
title: "Tasks: Online Visual Upgrade (Next Stage) [001-online-visual-upgrade/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "online"
  - "visual"
  - "upgrade"
  - "next"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Online Visual Upgrade (Next Stage)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

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
## Phase 1: Router parity and matrix setup

- [x] T001 Document routing parity primitives and weighted intent routing in skill doc (`.opencode/skill/sk-doc-visual/SKILL.md`) [EVIDENCE: `rg -n "SMART ROUTING|RESOURCE_MAP|LOADING_LEVELS" .opencode/skill/sk-doc-visual/SKILL.md`]
- [x] T002 Add machine-readable version matrix with pinned library versions (`.opencode/skill/sk-doc-visual/assets/library_versions.json`) [EVIDENCE: pins present for Mermaid `11.12.3`, ELK `0.2.0`, Chart.js `4.5.1`, anime.js `4.3.6`]
- [x] T003 Add canonical REFERENCES section and routing-aligned reference map (`.opencode/skill/sk-doc-visual/SKILL.md`) [EVIDENCE: section `## 5. REFERENCES`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Template modernization

- [x] T004 Update reference guidance and compatibility notes (`.opencode/skill/sk-doc-visual/references/quick_reference.md`, `.opencode/skill/sk-doc-visual/references/library_guide.md`, `.opencode/skill/sk-doc-visual/references/quality_checklist.md`, `.opencode/skill/sk-doc-visual/references/css_patterns.md`, `.opencode/skill/sk-doc-visual/references/navigation_patterns.md`) [EVIDENCE: updated files present with 2026-02-22 timestamps]
- [x] T005 Update `architecture.html` to modernization schema (`.opencode/skill/sk-doc-visual/assets/templates/architecture.html`) [EVIDENCE: validator PASS]
- [x] T006 Update `data-table.html` to modernization schema (`.opencode/skill/sk-doc-visual/assets/templates/data-table.html`) [EVIDENCE: validator PASS]
- [x] T007 Update `mermaid-flowchart.html` to modernization schema (`.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html`) [EVIDENCE: validator PASS]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Validator and drift checks

- [x] T008 Extend validator with accessibility and hardening checks (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`) [EVIDENCE: checks for `color-scheme`, Mermaid hardening, canvas fallback, `prefers-contrast`, `forced-colors`]
- [x] T009 Create version drift check script (`.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh`) [EVIDENCE: `bash .opencode/skill/sk-doc-visual/scripts/check-version-drift.sh` -> `Version alignment OK`]
- [x] T010 Add fixture-driven validator tests (`.opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh`, `.opencode/skill/sk-doc-visual/scripts/tests/fixtures/*`) [EVIDENCE: `validator fixture tests passed`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Minimal sk-doc touchpoint

- [x] T011 Apply scoped sk-doc touchpoint updates (`.opencode/skill/sk-doc/assets/opencode/skill_md_template.md`, `.opencode/skill/sk-doc/references/skill_creation.md`) [EVIDENCE: both files updated on 2026-02-22]
- [x] T012 Record touchpoint scope in closeout docs (`.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/001-online-visual-upgrade/implementation-summary.md`) [EVIDENCE: closeout section includes scope-boundary note]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and closeout

- [x] T013 Run validator checks for all three templates (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`) [EVIDENCE: PASS on `architecture.html`, `data-table.html`, `mermaid-flowchart.html`]
- [x] T014 Run drift and fixture checks with expected behavior (`.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh`, `.opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh`) [EVIDENCE: drift `Version alignment OK`; fixtures expected exits all pass]
- [x] T015 Update checklist and implementation summary evidence (`.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/001-online-visual-upgrade/checklist.md`, `.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/001-online-visual-upgrade/implementation-summary.md`) [EVIDENCE: closeout documentation updated]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
