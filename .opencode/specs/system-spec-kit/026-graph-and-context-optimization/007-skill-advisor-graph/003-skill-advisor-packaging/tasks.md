---
title: "Tasks: Skill Advisor Packaging"
description: "Task breakdown for feature catalog creation and reference updates."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "packaging tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Updated tasks for Level 3"
    next_safe_action: "Implement feature catalog"
    key_files: ["tasks.md"]
---
# Tasks: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

**Task Format**: `T### Description`

---

## Phase 1: Rename + Reorganize (Done)

- [x] T001 Rename the legacy shared scripts directory under `.opencode/skill` to `.opencode/skill/skill-advisor/` [EVIDENCE: folder exists]
- [x] T002 Verify skill_advisor.py works at new path (self-relative) [EVIDENCE: --health returns ok]
- [x] T003 Create empty playbook/catalog directory structures [EVIDENCE: dirs exist]
- [x] T003a Move scripts, fixtures/, out/ into `scripts/` subfolder [EVIDENCE: ls confirms structure]
- [x] T003b Fix SKILLS_DIR path in skill_advisor.py + skill_graph_compiler.py (two levels up) [EVIDENCE: --health ok, --validate-only passes]
- [x] T003c Update CLAUDE.md Gate 2 path to `skill-advisor/scripts/skill_advisor.py` [EVIDENCE: grep confirms]

---

## Phase 2: Feature Catalog Root

- [x] T004 Create root `FEATURE_CATALOG.md` matching system-spec-kit root catalog format [EVIDENCE: copilot created, sk-doc validation passes]

---

## Phase 3: Feature Catalog — Routing Pipeline (6 files)

- [x] T005 Create `01--routing-pipeline/01-skill-discovery.md` [EVIDENCE: 4 sections verified]
- [x] T006 Create `01--routing-pipeline/02-request-normalization.md` [EVIDENCE: 4 sections verified]
- [x] T007 Create `01--routing-pipeline/03-keyword-boosting.md` [EVIDENCE: 4 sections verified]
- [x] T008 Create `01--routing-pipeline/04-phrase-intent-boosting.md` [EVIDENCE: 4 sections verified]
- [x] T009 Create `01--routing-pipeline/05-confidence-calibration.md` [EVIDENCE: 4 sections verified]
- [x] T010 Create `01--routing-pipeline/06-result-filtering.md` [EVIDENCE: 4 sections verified]

---

## Phase 4: Feature Catalog — Graph System (8 files)

- [x] T011 Create `02--graph-system/01-graph-metadata-schema.md` [EVIDENCE: 4 sections verified]
- [x] T012 Create `02--graph-system/02-graph-compiler.md` [EVIDENCE: 4 sections verified]
- [x] T013 Create `02--graph-system/03-compiled-graph.md` [EVIDENCE: 4 sections verified]
- [x] T014 Create `02--graph-system/04-transitive-boosts.md` [EVIDENCE: 4 sections verified]
- [x] T015 Create `02--graph-system/05-family-affinity.md` [EVIDENCE: 4 sections verified]
- [x] T016 Create `02--graph-system/06-conflict-penalty.md` [EVIDENCE: 4 sections verified]
- [x] T017 Create `02--graph-system/07-ghost-candidate-guard.md` [EVIDENCE: 4 sections verified]
- [x] T018 Create `02--graph-system/08-evidence-separation.md` [EVIDENCE: 4 sections verified]

---

## Phase 5: Feature Catalog — Semantic Search + Testing (4 files)

- [x] T019 Create `03--semantic-search/01-cocoindex-integration.md` [EVIDENCE: 4 sections verified]
- [x] T020 Create `03--semantic-search/02-auto-triggers.md` [EVIDENCE: 4 sections verified]
- [x] T021 Create `04--testing/01-regression-harness.md` [EVIDENCE: 4 sections verified]
- [x] T022 Create `04--testing/02-health-check.md` [EVIDENCE: 4 sections verified]

---

## Phase 6: Reference Updates

- [x] T023 Update CLAUDE.md: Gate 2 path now `skill-advisor/scripts/skill_advisor.py` [EVIDENCE: grep confirms]
- [ ] T024 Add `graph-metadata.json` for `.opencode/skill/skill-advisor/` skill folder
- [ ] T025 Update all playbook/catalog command paths from `skill-advisor/skill_advisor.py` to `skill-advisor/scripts/skill_advisor.py` [NOTE: scripts moved to scripts/ subfolder after catalog creation]

---

## Phase 7: Verification

- [x] T026 Grep all feature catalog files for `scripts/` references — zero remaining [EVIDENCE: copilot verified]
- [x] T027 Verify all 18 per-feature files follow sk-doc snippet template (4 sections) [EVIDENCE: all 18 confirmed 4 sections]
- [x] T028 Verify root FEATURE_CATALOG.md links match actual files on disk [EVIDENCE: copilot verified]
- [x] T029 Verify `skill_advisor.py --health` works at new path [EVIDENCE: status ok, 20 skills found]
