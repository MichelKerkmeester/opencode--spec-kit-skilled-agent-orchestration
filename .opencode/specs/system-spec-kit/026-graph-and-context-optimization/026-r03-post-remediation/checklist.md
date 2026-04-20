---
title: "Phase 026 — Checklist"
description: "Acceptance verification for R03 post-remediation remediation."
importance_tier: "normal"
contextType: "implementation"
---

# Phase 026 Checklist

## P0
None.

## P1 (8 must close)

- [x] **T01 / P1-007-01 / D7** Hook reference Copilot+Codex snippets byte-match or link to actual shipped files [Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:183-257`]
- [x] **T02 / P1-014-01 / D7** Operator docs have no hardcoded stale inventory/status values (or explicit snapshot annotation) [Evidence: `.opencode/skill/skill-advisor/README.md:62-64`, `:190-192`; `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:305-308`; `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:78-78`, `:222-226`; `.opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md:18-18`]
- [x] **T03 / P1-017-01 / D3** `LIVE_SESSION_WRAPPER_SETUP.md` documents `finalizePrompt()` in operator flow [Evidence: `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-169`; `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:304-304`]
- [x] **T04 / P1-018-01 / D4** Advisor producer fail-open paths preserve root-cause in diagnostics [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/error-diagnostics.ts:5-118`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:26-33`, `:79-90`, `:134-154`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:42-48`, `:191-202`, `:298-329`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:47-55`, `:360-427`, `:469-479`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:163-170`; `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:139-150`, `:229-241`; `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:98-117`, `:162-193`; `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:135-154`]
- [x] **T05 / P1-019-01 / D5** Plugin cache key includes workspace root [Evidence: `.opencode/plugins/spec-kit-skill-advisor.js:115-134`; `.opencode/plugins/spec-kit-skill-advisor.js:300-345`]
- [x] **T06 / P1-020-01 / D6** Test verifies plugin cross-workspace cache isolation [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:276-304`]
- [x] **T07 / P1-021-01 / D7** Playbook accurately describes its own structure [Evidence: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:10-28`, `:56-58`, `:117-123`, `:278-313`, `:373-384`]
- [x] **T08 / P1-028-01 / D7** Playbook measurement + analyzer commands runnable from documented cwd [Evidence: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:298-299`, `:310-313`]

## P2 (4 should close)

- [x] **T09 / P2-007-01 / D7** LT-001 has repo-relative link to wrapper setup guide [Evidence: `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:310`]
- [x] **T10 / P2-013-01 / D6** Default telemetry fallback tested [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:274-293`]
- [x] **T11 / P2-013-02 / D6** Subprocess spawn-error classification tested [Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:197-230`]
- [x] **T12 / P2-029-01 / D1** `provenance.sourceRefs` pass through same sanitizer as `skillLabel` [Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:555-587`; `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113-132`]

## Integration

- [ ] TS build passes
- [ ] Phase 025 baseline tests still pass (8 files / 65 tests)
- [ ] New tests from T06/T10/T11 pass
- [ ] No regressions in runtime hook adapters
