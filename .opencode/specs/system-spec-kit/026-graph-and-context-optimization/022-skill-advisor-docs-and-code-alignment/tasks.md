---
title: "Tasks: Skill-Advisor Docs + Phase 020 Code Alignment"
description: "Task list for 022 — 3 doc updates + sk-code-opencode audit + remediations."
trigger_phrases:
  - "022 tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-docs-and-code-alignment"
    last_updated_at: "2026-04-19T18:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"

---
# Tasks: Skill-Advisor Docs + Phase 020 Code Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Read Phase 020 implementation-summary.md for feature inventory
- [ ] T002 [P0] Read sk-code-opencode SKILL.md for TS standards + checklist
- [ ] T003 [P0] Read existing skill-advisor docs (README, feature_catalog, manual_testing_playbook) to understand current structure
- [ ] T004 [P0] Read Phase 020 reference doc at `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` for cross-reference source
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Documentation Updates

### skill-advisor README
- [ ] T005 [P0] Update `.opencode/skill/skill-advisor/README.md` — add §Hook Invocation section (primary path); preserve explicit CLI fallback
- [ ] T006 [P0] Add cross-reference to `references/hooks/skill-advisor-hook.md` for hook surface details

### Feature Catalog
- [ ] T007 [P0] Add Phase 020 feature entries in `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md`:
  - user-prompt-submit hook (4 runtimes)
  - shared-payload advisor envelope contract
  - HMAC exact prompt cache (5-min TTL)
  - Freshness probe + per-skill fingerprints
  - Generation counter (atomic + corrupt-recovery)
  - 4-runtime parity harness
  - 200-prompt corpus parity gate
  - Disable flag (SPECKIT_SKILL_ADVISOR_HOOK_DISABLED)
  - Observability metrics (speckit_advisor_hook_*)
  - AdvisorHookDiagnosticRecord JSONL schema
  - advisor-hook-health session section
  - Privacy contract (no raw prompt persistence)

### Manual Testing Playbook
- [ ] T008 [P0] Create new section in `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`: §Hook-Based Routing (06--hook-routing folder if following existing numbered pattern)
- [ ] T009 [P0] Per-runtime smoke test steps (Claude/Gemini/Copilot/Codex):
  - Register hook per runtime's settings file (cross-reference reference doc §3)
  - Send work-intent prompt → verify `Advisor: ...` appears in session context
  - Send `/help` → verify no brief emitted
  - Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` → verify bypass
  - Simulate stale skill-graph → verify stale-badged brief still fires
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: sk-code-opencode Alignment Audit

- [ ] T010 [P0] Run sk-code-opencode audit on `mcp_server/lib/skill-advisor/*.ts` (11 files from 020/003-005)
- [ ] T011 [P0] Run audit on `mcp_server/hooks/{claude,gemini,copilot,codex}/user-prompt-submit.ts` (4 adapters)
- [ ] T012 [P0] Run audit on `mcp_server/hooks/codex/pre-tool-use.ts` + `prompt-wrapper.ts`
- [ ] T013 [P0] Run audit on `mcp_server/lib/codex-hook-policy.ts`
- [ ] T014 [P0] Run audit on Phase 020 additions to `mcp_server/lib/context/shared-payload.ts`
- [ ] T015 [P1] Document findings per file with severity (major/minor/style)
- [ ] T016 [P0] Fix major + minor findings; document deferrals (P2 style-only) with reason
- [ ] T017 [P0] Re-run Phase 020 test suites to confirm no regression
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T018 [P0] Run `npx vitest run advisor shared-payload-advisor claude-user-prompt-submit gemini-user-prompt-submit copilot-user-prompt-submit codex` — MUST PASS 118/118
- [ ] T019 [P0] Run `npx tsc --noEmit` clean
- [ ] T020 [P0] Run `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-docs-and-code-alignment --strict --no-recursive` clean
- [ ] T021 [P0] Mark all P0 checklist items `[x]` with evidence
- [ ] T022 [P0] Update implementation-summary.md with audit findings + remediations + verification
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks marked `[x]` with evidence
- skill-advisor README, feature catalog, playbook all updated
- Phase 020 TS code passes sk-code-opencode audit (or deferrals documented)
- 118/118 Phase 020 tests remain green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Parent: `../020-skill-advisor-hook-surface/implementation-summary.md`
- sk-code-opencode: `.opencode/skill/sk-code-opencode/SKILL.md`
- skill-advisor: `.opencode/skill/skill-advisor/`
- Phase 020 reference doc: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
<!-- /ANCHOR:cross-refs -->
