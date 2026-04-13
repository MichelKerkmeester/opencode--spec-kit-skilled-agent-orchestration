---
title: "Tasks: Playbook Template Alignment"
description: "Task breakdown for reconciling the full 24-scenario playbook package and root operator guide."
trigger_phrases:
  - "002-manual-testing-playbook"
  - "playbook tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/002-manual-testing-playbook"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created tasks"
    next_safe_action: "Implement playbook rewrites"
    key_files: ["tasks.md"]
---
# Tasks: Playbook Template Alignment

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

## Phase 1: Graph Boosts Category (7 files)

- [x] T001 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/001-dependency-pullup.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T002 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/002-enhances-overlay.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T003 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/003-ghost-prevention.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T004 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/004-family-affinity.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T005 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/005-evidence-separation.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T006 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/006-hub-skill-edges.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T007 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/007-prerequisite-for.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]

---

## Phase 2: Compiler Category (5 files)

- [x] T008 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/001-schema-validation.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T009 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/002-zero-edge-warnings.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T010 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/003-compiled-signals.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T011 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/004-size-target.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T012 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/005-health-check.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]

---

## Phase 3: Regression Safety Category (4 files)

- [x] T013 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/001-full-regression.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T014 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/002-p0-cases.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T015 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/003-graph-cases.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]
- [x] T016 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/004-abstain-noise.md` — 5-section template, RCAF prompt [EVIDENCE: 5 sections verified]

---

## Phase 4: Root Playbook

- [x] T017 Rewrite `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` — system-spec-kit root format [EVIDENCE: copilot rewrote, sk-doc validation passes]

---

## Phase 5: Verification

- [x] T018 Normalize ALL path mentions in `01--routing-accuracy` prompts, commands, triage, and source file tables to use the `skill-advisor/scripts/` prefix [EVIDENCE: required grep sweep for bare `skill-advisor/skill_advisor.py` returned 0 matches; `no feature catalog` grep returned 0 matches]
- [x] T019 Verify all 24 scenario snippets have 5 numbered sections (OVERVIEW through SOURCE METADATA); root guide intentionally uses operator-guide format [EVIDENCE: all 24 scenario snippets confirmed 5 sections]
- [x] T020 Verify all 24 scenario snippets contain RCAF prompt pattern in sections 2 and 3 [EVIDENCE: 48 RCAF prompts across 24 scenario snippets]
