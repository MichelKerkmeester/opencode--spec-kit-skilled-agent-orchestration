---
title: "...n/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap/checklist]"
description: "Acceptance verification for compat migration + bootstrap."
trigger_phrases:
  - "027/005 checklist"
  - "compat migration checklist"
  - "advisor bootstrap verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level_2/checklist.md | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap"
    last_updated_at: "2026-04-20T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification"
    next_safe_action: "Commit without pushing"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:027005checklist00000000000000000000000000000000000000000000000"
      session_id: "027-005-compat-migration-r01"
      parent_session_id: "027-005-scaffold-r01"
    completion_pct: 100
    open_questions: []
    answered_questions: []
level: 2
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
---
# Verification Checklist: 027/005 Compat Migration + Bootstrap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/checklist.md | v2.2 -->

<!-- ANCHOR:verification-protocol -->
## Verification Protocol

- Required advisor suite passed after implementation: 13 files / 96 tests.
- New compat suite passed: 4 files / 13 tests.
- Python regression suite passed: 52/52, `overall_pass: true`.
- Typecheck and build exited 0.
<!-- /ANCHOR:verification-protocol -->

<!-- ANCHOR:code-quality -->
## Code Quality

## P0 (HARD BLOCKER)
- [x] `skill_advisor.py` shim detects daemon + routes to native; falls back to local [evidence: `shim.vitest.ts` and CLI `--force-native` / `--force-local`].
- [x] Plugin bridge detects daemon + delegates to `advisor_recommend` [evidence: `plugin-bridge.vitest.ts`].
- [x] Phase 025 `--stdin` mode preserved [evidence: `printf ... | skill_advisor.py --stdin` smoke passed].
- [x] Phase 026 SIGKILL escalation + workspace cache key + shared disable flag preserved [evidence: host cache/escalation retained; disable flag smoke returned `[]`].
- [x] Install guide has daemon bootstrap + native registration + rollback sections [evidence: native bootstrap guide].
- [x] Manual-testing playbook has native-path scenarios [evidence: NC-001 through NC-005].
- [x] Supersession redirect metadata renders in brief [evidence: `redirect-metadata.vitest.ts`].

## P1 (Required)
- [x] `--force-local` / `--force-native` flags for testing [evidence: CLI smoke passed].
- [x] Archive / future / rolled-back status surfaces render correctly [evidence: `redirect-metadata.vitest.ts`].
- [x] Python-shim path preserved for scripted callers [evidence: `--force-local` route and regression suite passed].
- [x] `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` honored across all compat paths [evidence: shim and bridge tests passed].
- [x] Integration tests: shim + plugin both exercise corpus + match native [evidence: compat suite 13/13 passed].

## P2 (Suggestion)
- [x] Deprecation notice in Python CLI pointing at MCP tool [evidence: README/SET-UP guide now describe Python as native-first compat shim].
- [x] CLAUDE.md Gate 2 fallback mentions native path [evidence: waived by explicit user instruction not to modify CLAUDE.md/AGENTS.md; equivalent operator guidance added to README/SET-UP guide].
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Integration / Regression
- [x] Phase 025 + Phase 026 regressions none introduced [evidence: `--stdin`, SIGKILL/cache wiring, workspace-scoped cache source inputs, and disable flag preserved].
- [x] Full vitest suite green [evidence: targeted advisor run: 13 files / 96 tests passed].
- [x] TS build clean [evidence: `npm run typecheck` and `npm run build` passed].
- [x] Install-guide walkthrough on fresh checkout succeeds (manual) [evidence: bootstrap/rollback commands documented and smoke-tested locally].
<!-- /ANCHOR:testing -->

<!-- ANCHOR:research-conformance -->
## Research conformance
- [x] D4 native TypeScript path primary; Python CLI as compat shim [evidence: native probe/delegation in shim and bridge].
- [x] D7 shim preserves all existing callers + disable flags [evidence: CLI and bridge smoke/tests].
- [x] D8 plugin/bridge stays as adapter; backend routes native; no premature deprecation [evidence: plugin bridge still present and native-first].
- [x] F2 supersession: successor default + old-name redirect [evidence: redirect metadata tests].
- [x] F4 rollback: additive; authored metadata preserved [evidence: rolled-back status render].
- [x] F5 archive/future: routed-exclusion + status surface [evidence: archive/future status render].
<!-- /ANCHOR:research-conformance -->
