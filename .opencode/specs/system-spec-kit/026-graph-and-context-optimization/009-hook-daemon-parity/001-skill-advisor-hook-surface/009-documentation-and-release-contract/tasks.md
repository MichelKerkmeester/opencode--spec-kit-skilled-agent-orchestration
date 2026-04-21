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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/009-documentation-and-release-contract"
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

- [x] T001 [P0] Verify 006 + 007 + 008 converged with populated implementation-summary.md files [Evidence: read `../006-claude-hook-wiring/implementation-summary.md`, `../007-gemini-copilot-hook-wiring/implementation-summary.md`, and `../008-codex-integration-and-hook-policy/implementation-summary.md` on 2026-04-19.]
- [x] T002 [P0] Read all 6 prior children's implementation-summary.md for capability + bench data [Evidence: read `../002-*` through `../008-*` implementation summaries on 2026-04-19.]
- [x] T003 [P0] Read sk-doc skill for DQI rules [Evidence: read `.opencode/skill/sk-doc/SKILL.md` and `.opencode/skill/sk-doc/references/global/validation.md` on 2026-04-19.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Reference Doc

- [x] T004 [P0] Create `.opencode/skill/system-spec-kit/references/hooks/` directory if absent [Evidence: created `references/hooks/` on 2026-04-19.]
- [x] T005 [P0] Author .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md with 11 sections [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, 650 lines.]
- [x] T006 [P0] Fill Runtime capability matrix from 006/007/008 implementation-summary.md [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §2 cites Claude, Gemini, Copilot and Codex runtime status.]
- [x] T007 [P0] Add failure-mode playbook table (status × freshness → operator action) [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §4.]
- [x] T008 [P0] Add observability contract: metric names, JSONL schema, alert thresholds [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §5.]
- [x] T009 [P0] Add migration notes (per-skill fingerprints, rename/delete, fallback) [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §7.]
- [x] T010 [P0] Add concurrency section (generation tags, CAS, session locks) [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §8.]
- [x] T011 [P0] Add troubleshooting section covering top 5 symptoms [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §11 and `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` §3.]
- [x] T012 [P0] Add performance budget table from 005's timing harness [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §6 includes 004 and 005 timing data.]
- [x] T013 [P1] Run sk-doc DQI validator; fix until ≥ 0.85 [Evidence: `python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` returned DQI 97.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### CLAUDE.md

- [x] T014 [P0] Update §Mandatory Tools to describe hook as primary advisor invocation path [Evidence: `CLAUDE.md` Mandatory Tools now lists Skill Advisor Hook.]
- [x] T015 [P0] Update §Gate 2 discussion: hook primary, explicit invocation fallback [Evidence: `CLAUDE.md` Gate 2 now names hook primary and `skill_advisor.py` fallback.]
- [x] T016 [P0] Add cross-reference to new reference doc [Evidence: `CLAUDE.md` links `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.]
<!-- /ANCHOR:phase-3 -->

### Runtime READMEs

- [x] T017 [P1] Update Claude runtime README (if present) with hook registration snippet [Evidence: no Claude root README exists; updated runtime README `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md`.]
- [x] T018 [P1] Update Gemini runtime README [Evidence: no Gemini root README exists; updated runtime README `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/README.md`.]
- [x] T019 [P1] Update Copilot runtime README [Evidence: updated `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md`.]
- [x] T020 [P1] Update Codex runtime README [Evidence: no Codex root README exists; added runtime README `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md`.]

### Release Checklist

- [x] T021 [P0] Update 020 parent implementation-summary.md with release-prep section (6 items + evidence links) [Evidence: `../implementation-summary.md` Release Prep has six checked items.]
- [x] T022 [P0] Verify each item linked to authoritative source (child implementation-summary, bench results, etc.) [Evidence: release prep links child summaries, parity tests, timing tests and reference docs.]

## Phase 3: Verification

- [x] T023 [P0] DQI ≥ 0.85 on reference doc [Evidence: sk-doc `extract_structure.py` returned DQI `97`.]
- [x] T024 [P0] Capability matrix cross-referenced child-by-child [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` §2 reconciled with 006, 007 and 008 summaries.]
- [x] T025 [P0] Manual read-through for accuracy [Evidence: reviewed reference doc against 002-008 summaries and live metrics/test files.]
- [x] T026 [P0] Mark all P0 checklist items `[x]` [Evidence: `checklist.md` shows 18/18 P0 verified.]
- [x] T027 [P0] Disable flag tested: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` on one runtime (verify no subprocess run) [Evidence: Claude hook suite passed AS4 producer-not-called assertion, 9/9 tests total.]

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
