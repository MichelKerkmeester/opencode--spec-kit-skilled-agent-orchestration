---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Tasks: Resource Map Template"
description: "Ordered task list for authoring the new cross-cutting template and wiring it into every discovery surface."
trigger_phrases:
  - "026/012 tasks"
  - "resource map tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 tasks"
    next_safe_action: "Rerun validator"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Resource Map Template

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
## Phase 1: Setup

- [x] T001 Read the 005/009 path-references-audit artifact for category baseline.
- [x] T002 Read existing cross-cutting templates (handover, research, debug-delegation) for location precedent.
- [x] T003 Read Level 2 template shapes to confirm this packet's own doc structure.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Author the new template at the templates root with frontmatter and ten category sections.
- [x] T011 Append the new filename to SPEC_DOCUMENT_FILENAMES in mcp_server/lib/config/spec-doc-paths.ts.
- [x] T012 [P] Update main templates README (Structure + Workflow Notes + Related).
- [x] T013 [P] Update level_1 README with Optional Files subsection.
- [x] T014 [P] Update level_2 README with Optional Files subsection.
- [x] T015 [P] Update level_3 README with Optional Files subsection.
- [x] T016 [P] Update level_3+ README with Optional Files subsection.
- [x] T017 Update SKILL.md canonical spec docs, cross-cutting templates, and distributed governance blocks.
- [x] T018 Update the skill root README template architecture section.
- [x] T019 Update references/templates/level_specifications.md Cross-cutting Templates and per-level Optional Files.
- [x] T020 Create the feature catalog entry under category 22.
- [x] T021 Create the manual testing playbook entry under category 22.
- [x] T022 Update CLAUDE.md Documentation Levels block.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run validate.sh --strict on this packet; capture exit 0.
- [ ] T031 Run npm run typecheck inside mcp_server; capture exit 0.
- [ ] T032 Grep every target surface for the new filename; confirm a hit per file.
- [ ] T033 Finalize implementation-summary.md with Files Changed + Verification tables.
- [ ] T034 (P2) Drop packet-local changelog file using the nested changelog template.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] validate.sh --strict exits 0.
- [ ] npm run typecheck exits 0.
- [ ] Manual grep audit confirms coverage across every discovery surface.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Reference shape**: see 005-release-cleanup-playbooks/path-references-audit artifact inside this same parent packet.
<!-- /ANCHOR:cross-refs -->
