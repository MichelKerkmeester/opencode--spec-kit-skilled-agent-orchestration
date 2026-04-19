---
title: "Phase 025 — Checklist"
description: "Acceptance verification for deep-review remediation."
importance_tier: "normal"
contextType: "implementation"
---

# Phase 025 Checklist

## P0 Items

None (no blocker-severity findings).

## P1 Items (all REQUIRED)

### DR-P1-001 — Privacy
- [x] `skill_advisor.py` accepts `--stdin` mode with prompt on stdin (`skill_advisor.py:2803`, `skill_advisor.py:2892`)
- [x] `subprocess.ts` spawn argv contains no raw prompt (verified via `advisor-subprocess.vitest.ts`; stdin plumbing at `subprocess.ts:137`, `subprocess.ts:155`, `subprocess.ts:235`)
- [x] `shared-payload.ts::coerceSharedPayloadEnvelope` rejects instruction-shaped `skillLabel` (`shared-payload.ts:491`, `shared-payload.ts:504`; sanitizer export at `render.ts:50`, `render.ts:140`)
- [x] Test: spawn argv assertion passes (`advisor-subprocess.vitest.ts`)
- [x] Test: envelope instruction-label rejection passes (`shared-payload-advisor.vitest.ts`)

### DR-P1-002 — Renderer/cache
- [x] Ambiguity rendered across all 4 runtimes (Claude/Gemini/Copilot/Codex) and OpenCode plugin path (`advisor-runtime-parity.vitest.ts`)
- [x] Cache key includes normalized `maxTokens` (`prompt-cache.ts:20`, `prompt-cache.ts:51`, `prompt-cache.ts:61`)
- [x] Different tokenCaps produce distinct cache entries (`advisor-prompt-cache.vitest.ts`, `advisor-brief-producer.vitest.ts`)
- [x] Cache-hit envelope `provenance.generatedAt` equals top-level `generatedAt` (`skill-advisor-brief.ts:383`, `skill-advisor-brief.ts:392`)
- [x] Test: focused brief/cache new cases pass (`advisor-brief-producer.vitest.ts`, `advisor-prompt-cache.vitest.ts`, `advisor-renderer.vitest.ts`)

### DR-P1-003 — Telemetry
- [x] Static measurement default output path separated from live stream (`smart-router-measurement.ts:104`, `smart-router-measurement.ts:637`)
- [x] `finalizePrompt(promptId)` implemented in wrapper (`live-session-wrapper.ts:190`)
- [x] `observedSkill` preserved in Read records (`live-session-wrapper.ts:80`, `live-session-wrapper.ts:175`; `smart-router-telemetry.ts:16`)
- [x] Analyzer aggregates by promptId (`smart-router-analyze.ts:123`)
- [x] Baseline SKILL.md read treated as non-violating when no non-SKILL read follows (`smart-router-analyze.ts:119`, `smart-router-analyze.ts:137`)
- [x] Test: zero-read session, multi-read single session, cross-skill all pass (`smart-router-telemetry.vitest.ts`, `smart-router-analyze.vitest.ts`)

### DR-P1-004 — Plugin parity
- [x] Plugin honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (`spec-kit-skill-advisor.js:19`, `spec-kit-skill-advisor.js:50`)
- [x] Plugin SIGKILL escalation after 1s SIGTERM (`spec-kit-skill-advisor.js:215`, `spec-kit-skill-advisor.js:221`)
- [x] Plugin host cache key includes source signature (`spec-kit-skill-advisor.js:64`, `spec-kit-skill-advisor.js:94`)
- [x] Plugin runs in `advisor-runtime-parity.vitest.ts` as 5th runtime
- [x] Plugin output matches native hooks on 6 canonical fixtures (`advisor-runtime-parity.vitest.ts`)
- [x] Test: plugin disable + SIGKILL + source-sig invalidation all pass (`spec-kit-skill-advisor-plugin.vitest.ts`)

### DR-P1-005 — Operator docs
- [x] `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` executes cleanly from repo root
- [x] Doc command replaces all `npm run --workspace=@spec-kit/mcp-server build` references (`skill-advisor-hook.md:89` plus README, setup guide, validation, smoke playbook)
- [x] Codex registration status consistent across 3 docs (`skill-advisor-hook.md`, `feature_catalog.md`, `manual_testing_playbook.md`)
- [x] Manual playbook denominator matches actual scenario count (`manual_testing_playbook.md:51`, `manual_testing_playbook.md:149`)
- [x] Measurement artifact name unified (`smart-router-measurement-results.jsonl` and `.opencode/reports/smart-router-static/compliance.jsonl`)
- [x] Copilot integration described as wrapper callback where applicable (`feature_catalog.md`, `manual_testing_playbook.md`)

## P2 Items (suggested; defer if time-boxed)

### DR-P2-001 — API hygiene
- [x] Prompt cache has size cap (MAX_CACHE_ENTRIES) (`prompt-cache.ts:11`)
- [x] Insertion-time eviction implemented (`prompt-cache.ts:103`)
- [x] Normalizer alias removed or JSDoc'd (`normalize-adapter-output.ts`)
- [x] JSDoc added to 7 advisor helper files (exported public surfaces)

### DR-P2-002 — Test coverage
- [x] Plugin suite: invalid bridge stdout + nonzero close + session cache isolation + targeted eviction (`spec-kit-skill-advisor-plugin.vitest.ts`)
- [x] Subprocess suite: schema-invalid JSON + non-busy nonzero exit + SQLITE_BUSY retry exhaustion (`advisor-subprocess.vitest.ts`)
- [x] Telemetry suite: path-precedence + report-writer (`smart-router-telemetry.vitest.ts`, `smart-router-analyze.vitest.ts`)
- [x] Parity suite: end-to-end hook->builder case without stubs (`advisor-runtime-parity.vitest.ts`)

## Integration / Regression

- [ ] `npm --prefix .opencode/skill/system-spec-kit/mcp_server test` — attempted; unrelated legacy failures remained outside Phase 025 scope
- [x] No regressions in runtime parity adapters covered by focused parity harness (`advisor-runtime-parity.vitest.ts`)
- [ ] No regressions in 200-prompt corpus parity harness
- [ ] 019/004 corpus parity 200/200 maintained
- [ ] HMAC cache p95 ≤ 50ms maintained (spot-check)
