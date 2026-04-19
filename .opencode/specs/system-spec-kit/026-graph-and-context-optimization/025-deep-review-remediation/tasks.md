---
title: "Phase 025 — Tasks"
description: "Task breakdown for deep-review remediation (7 findings, 8 phases A-H)."
importance_tier: "normal"
contextType: "implementation"
---

# Phase 025 Tasks

## T001 — Scaffold packet
- [x] Create folder `025-deep-review-remediation/`
- [x] Write spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
- [x] Generate description.json + graph-metadata.json via generate-context.js

## T002 — Phase A: Privacy hardening (DR-P1-001)
- [ ] Add `--stdin` mode to `skill_advisor.py`
- [ ] Spawn via stdin in `subprocess.ts`; drop prompt from argv
- [ ] Re-export strong label sanitizer from `render.ts`
- [ ] Apply sanitizer in `shared-payload.ts::coerceSharedPayloadEnvelope`
- [ ] Regression test: spawn argv contains no prompt
- [ ] Regression test: instruction-shaped envelope label rejected
- [ ] Pass `advisor-privacy.vitest.ts` + `advisor-subprocess.vitest.ts`

## T003 — Phase B: Cache + renderer contract (DR-P1-002)
- [ ] Renderer reads tokenCap from `result.metrics.tokenCap`
- [ ] Prompt-cache key includes normalized `maxTokens`
- [ ] Cache-hit path rebuilds envelope provenance timestamp
- [ ] Ambiguity branch emits top-two when metrics.tokenCap > default
- [ ] Regression tests for cache isolation + provenance freshness
- [ ] Pass `advisor-brief.vitest.ts`

## T004 — Phase C: Telemetry fidelity (DR-P1-003)
- [ ] `smart-router-measurement.ts` writes static stream to separate default path
- [ ] `live-session-wrapper.ts` adds `finalizePrompt()` + skill-identity preservation
- [ ] `smart-router-telemetry.ts` aggregates by promptId
- [ ] `smart-router-analyze.ts` groups by promptId + baseline-SKILL handling
- [ ] Regression tests: zero-read session, multi-read single session, cross-skill
- [ ] Pass telemetry vitest suite

## T005 — Phase D: Plugin parity (DR-P1-004)
- [ ] Plugin honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`
- [ ] SIGTERM + 1s wait + SIGKILL escalation
- [ ] Source signature in host cache key
- [ ] Plugin added as 5th runtime in parity harness
- [ ] Regression tests: disable, SIGKILL, source-signature invalidation
- [ ] Pass `spec-kit-skill-advisor-plugin.vitest.ts` + `advisor-runtime-parity.vitest.ts`

## T006 — Phase E: Operator docs (DR-P1-005)
- [ ] Replace `npm run --workspace=@spec-kit/mcp-server build` with checkout-valid command
- [ ] Update Codex registration status in hook reference + catalog + playbook
- [ ] Regenerate manual-testing-playbook denominator
- [ ] Align measurement artifact name across docs + code
- [ ] Clarify Copilot integration uses wrapper callbacks
- [ ] Manual spot-check: command from hook reference succeeds on fresh checkout

## T007 — Phase F: API hygiene (DR-P2-001)
- [ ] Add size cap + insertion eviction to `prompt-cache.ts`
- [ ] Remove or JSDoc `normalizeAdapterOutput` alias
- [ ] Add JSDoc to 7 advisor helper files

## T008 — Phase G: Test coverage (DR-P2-002)
- [ ] Plugin suite: 4 negative-path cases
- [ ] Subprocess suite: 3 error-code cases
- [ ] Telemetry suite: path-precedence + report-writer cases
- [ ] Parity suite: 1 end-to-end hook→builder case

## T009 — Phase H: Verify
- [ ] Full vitest suite passes: `npm --prefix .opencode/skill/system-spec-kit/mcp_server test`
- [ ] No regressions introduced by A-G
- [ ] Update implementation-summary.md with per-finding completion evidence
- [ ] Mark all checklist items [x] with evidence

## T010 — Post-impl
- [ ] Memory save: `generate-context.js` on Phase 025
- [ ] Commit + push
- [ ] Update T17 task to completed
