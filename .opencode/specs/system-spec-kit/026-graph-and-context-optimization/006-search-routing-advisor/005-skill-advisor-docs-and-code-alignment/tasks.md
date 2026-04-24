---
title: "...ec-kit/026-graph-and-context-optimization/006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment/tasks]"
description: "Task list for 022 — 3 doc updates + sk-code-opencode audit + remediations."
trigger_phrases:
  - "022 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment"
    last_updated_at: "2026-04-19T18:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
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

- [x] T001 [P0] Read Phase 020 implementation-summary.md for feature inventory [Evidence: 020 parent summary loaded; feature inventory used in `implementation-summary.md`]
- [x] T002 [P0] Read sk-code-opencode SKILL.md for TS standards + checklist [Evidence: TypeScript style, quality, quick reference, and checklist loaded before audit]
- [x] T003 [P0] Read existing skill-advisor docs (README, feature_catalog, manual_testing_playbook) to understand current structure [Evidence: README, root feature catalog, root playbook, setup guide, and existing category files inspected]
- [x] T004 [P0] Read Phase 020 reference doc at ../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md for cross-reference source [Evidence: hook reference and validation playbook loaded]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### skill-advisor README
- [x] T005 [P0] Update `../../../../skill/skill-advisor/README.md` — add §Hook Invocation section (primary path); preserve explicit CLI fallback [Evidence: README §2 and §3]
- [x] T006 [P0] Add cross-reference to references/hooks/skill-advisor-hook.md for hook surface details [Evidence: README links to Skill Advisor Hook Reference in §2 and Related Documents]

### Feature Catalog
- [x] T007 [P0] Add Phase 020 feature entries in ../../../../skill/skill-advisor/feature_catalog/feature_catalog.md:
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
  - [Evidence: feature catalog §5 `HOOK SURFACE` has 12 entries covering this list]

### Manual Testing Playbook
- [x] T008 [P0] Create new section in ../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md: §Hook-Based Routing (06--hook-routing folder if following existing numbered pattern) [Evidence: root playbook §12 and 06--hook-routing/001-hook-routing-smoke.md]
- [x] T009 [P0] Per-runtime smoke test steps (Claude/Gemini/Copilot/Codex):
  - Register hook per runtime's settings file (cross-reference reference doc §3)
  - Send work-intent prompt → verify `Advisor: ...` appears in session context
  - Send `/help` → verify no brief emitted
  - Set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` → verify bypass
  - Simulate stale skill-graph → verify stale-badged brief still fires
  - [Evidence: 06--hook-routing/001-hook-routing-smoke.md HR-001 through HR-006]
### sk-code-opencode Alignment Audit

- [x] T010 [P0] Run sk-code-opencode audit on `mcp_server/lib/skill-advisor/*.ts` (11 files from 020/003-005) [Evidence: `scratch/audit-findings.md` per-file audit ledger]
- [x] T011 [P0] Run audit on `mcp_server/hooks/{claude,gemini,copilot,codex}/user-prompt-submit.ts` (4 adapters) [Evidence: `scratch/audit-findings.md` per-file audit ledger]
- [x] T012 [P0] Run audit on `mcp_server/hooks/codex/pre-tool-use.ts` + `prompt-wrapper.ts` [Evidence: `scratch/audit-findings.md` per-file audit ledger]
- [x] T013 [P0] Run audit on `mcp_server/lib/codex-hook-policy.ts` [Evidence: `scratch/audit-findings.md` per-file audit ledger]
- [x] T014 [P0] Run audit on Phase 020 additions to `mcp_server/lib/context/shared-payload.ts` [Evidence: `scratch/audit-findings.md` per-file audit ledger]
- [x] T015 [P1] Document findings per file with severity (major/minor/style) [Evidence: `scratch/audit-findings.md`, major=0, minor=9, style_deferred=0]
- [x] T016 [P0] Fix major + minor findings; document deferrals (P2 style-only) with reason [Evidence: all 9 minor findings fixed; no deferrals]
- [x] T017 [P0] Re-run Phase 020 test suites to confirm no regression [Evidence: 19 files / 118 tests passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 [P0] Run `npx vitest run advisor shared-payload-advisor claude-user-prompt-submit gemini-user-prompt-submit copilot-user-prompt-submit codex` — MUST PASS 118/118 [Evidence: targeted Phase 020 command returned 19 files / 118 tests passed]
- [x] T019 [P0] Run `npx tsc --noEmit` clean [Evidence: `npx tsc --noEmit` in `mcp_server` exited 0]
- [x] T020 [P0] Run `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment --strict --no-recursive` clean [Evidence: strict validation returned errors=0, warnings=0]
- [x] T021 [P0] Mark all P0 checklist items `[x]` with evidence [Evidence: `checklist.md` has 15/15 P0 items verified]
- [x] T022 [P0] Update implementation-summary.md with audit findings + remediations + verification [Evidence: `implementation-summary.md` populated]
<!-- /ANCHOR:phase-3 -->

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
- Parent: `../../009-hook-package/001-skill-advisor-hook-surface/implementation-summary.md`
- sk-code-opencode: `../../../../skill/sk-code-opencode/SKILL.md`
- skill-advisor: `.opencode/skill/skill-advisor/`
- Phase 020 reference doc: ../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md
<!-- /ANCHOR:cross-refs -->
