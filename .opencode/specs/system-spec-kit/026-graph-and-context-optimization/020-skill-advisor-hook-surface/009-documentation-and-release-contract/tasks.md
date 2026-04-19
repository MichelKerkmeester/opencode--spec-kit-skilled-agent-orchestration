---
title: "Tasks: Documentation + Release Contract"
description: "Task list for 020/009 — final doc + CLAUDE.md + READMEs + release checklist."
trigger_phrases:
  - "020 009 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 006/007/008 converge"
    blockers: ["006-claude-hook-wiring", "007-gemini-copilot-hook-wiring", "008-codex-integration-and-hook-policy"]
    key_files: []

---
# Tasks: Documentation + Release Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Verify 006 + 007 + 008 converged with populated implementation-summary.md files
- [ ] T002 [P0] Read all 6 prior children's implementation-summary.md for capability + bench data
- [ ] T003 [P0] Read sk-doc skill for DQI rules
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Reference Doc

- [ ] T004 [P0] Create `.opencode/skill/system-spec-kit/references/hooks/` directory if absent
- [ ] T005 [P0] Author .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md with 11 sections
- [ ] T006 [P0] Fill Runtime capability matrix from 006/007/008 implementation-summary.md
- [ ] T007 [P0] Add failure-mode playbook table (status × freshness → operator action)
- [ ] T008 [P0] Add observability contract: metric names, JSONL schema, alert thresholds
- [ ] T009 [P0] Add migration notes (per-skill fingerprints, rename/delete, fallback)
- [ ] T010 [P0] Add concurrency section (generation tags, CAS, session locks)
- [ ] T011 [P0] Add troubleshooting section covering top 5 symptoms
- [ ] T012 [P0] Add performance budget table from 005's timing harness
- [ ] T013 [P1] Run sk-doc DQI validator; fix until ≥ 0.85
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### CLAUDE.md

- [ ] T014 [P0] Update §Mandatory Tools to describe hook as primary advisor invocation path
- [ ] T015 [P0] Update §Gate 2 discussion: hook primary, explicit invocation fallback
- [ ] T016 [P0] Add cross-reference to new reference doc
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
### Runtime READMEs

- [ ] T017 [P1] Update .claude/README.md (if present) with hook registration snippet
- [ ] T018 [P1] Update .gemini/README.md
- [ ] T019 [P1] Update Copilot runtime README
- [ ] T020 [P1] Update .codex/README.md
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
### Release Checklist

- [ ] T021 [P0] Update 020 parent implementation-summary.md with release-prep section (6 items + evidence links)
- [ ] T022 [P0] Verify each item linked to authoritative source (child implementation-summary, bench results, etc.)
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:phase-6 -->
## Phase 3: Verification

- [ ] T023 [P0] DQI ≥ 0.85 on reference doc
- [ ] T024 [P0] Capability matrix cross-referenced child-by-child
- [ ] T025 [P0] Manual read-through for accuracy
- [ ] T026 [P0] Mark all P0 checklist items `[x]`
- [ ] T027 [P0] Disable flag tested: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` on one runtime (verify no subprocess run)
<!-- /ANCHOR:phase-6 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- Reference doc published with DQI ≥ 0.85
- CLAUDE.md Gate 2 updated
- 4 runtime READMEs updated (where present)
- 020 parent release section filled with evidence
- Disable flag verified working
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessors: `../006-*`, `../007-*`, `../008-*`
- sk-doc: `.opencode/skill/sk-doc/`
<!-- /ANCHOR:cross-refs -->
