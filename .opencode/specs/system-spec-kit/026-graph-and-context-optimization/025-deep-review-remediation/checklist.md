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
- [ ] `skill_advisor.py` accepts `--stdin` mode with prompt on stdin
- [ ] `subprocess.ts` spawn argv contains no raw prompt (verified via test + manual `ps` inspection)
- [ ] `shared-payload.ts::coerceSharedPayloadEnvelope` rejects instruction-shaped `skillLabel`
- [ ] Test: spawn argv assertion passes
- [ ] Test: envelope instruction-label rejection passes

### DR-P1-002 — Renderer/cache
- [ ] Ambiguity rendered across all 4 runtimes (Claude/Gemini/Copilot/Codex)
- [ ] Cache key includes normalized `maxTokens`
- [ ] Different tokenCaps produce distinct cache entries
- [ ] Cache-hit envelope `provenance.generatedAt` equals top-level `generatedAt`
- [ ] Test: `advisor-brief.vitest.ts` new cases pass

### DR-P1-003 — Telemetry
- [ ] Static measurement default output path separated from live stream
- [ ] `finalizePrompt(promptId)` implemented in wrapper
- [ ] `observedSkill` preserved in Read records
- [ ] Analyzer aggregates by promptId
- [ ] Baseline SKILL.md read treated as non-violating when no non-SKILL read follows
- [ ] Test: zero-read session, multi-read single session, cross-skill all pass

### DR-P1-004 — Plugin parity
- [ ] Plugin honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`
- [ ] Plugin SIGKILL escalation after 1s SIGTERM
- [ ] Plugin host cache key includes source signature
- [ ] Plugin runs in `advisor-runtime-parity.vitest.ts` as 5th runtime
- [ ] Plugin output matches 4 native hooks on 6 canonical fixtures
- [ ] Test: plugin disable + SIGKILL + source-sig invalidation all pass

### DR-P1-005 — Operator docs
- [ ] `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` executes cleanly from repo root
- [ ] Doc command replaces all `npm run --workspace=@spec-kit/mcp-server build` references
- [ ] Codex registration status consistent across 3 docs
- [ ] Manual playbook denominator matches actual scenario count
- [ ] Measurement artifact name unified
- [ ] Copilot integration described as wrapper callback where applicable

## P2 Items (suggested; defer if time-boxed)

### DR-P2-001 — API hygiene
- [ ] Prompt cache has size cap (MAX_CACHE_ENTRIES)
- [ ] Insertion-time eviction implemented
- [ ] Normalizer alias removed or JSDoc'd
- [ ] JSDoc added to 7 advisor helper files (exported public surfaces)

### DR-P2-002 — Test coverage
- [ ] Plugin suite: invalid bridge stdout + nonzero close + session cache isolation + targeted eviction
- [ ] Subprocess suite: schema-invalid JSON + non-busy nonzero exit + SQLITE_BUSY retry exhaustion
- [ ] Telemetry suite: path-precedence + report-writer
- [ ] Parity suite: end-to-end hook→builder case without stubs

## Integration / Regression

- [ ] `npm --prefix .opencode/skill/system-spec-kit/mcp_server test` — all tests pass
- [ ] No regressions in 4-runtime hook adapters (`{claude,gemini,copilot,codex}-user-prompt-submit-hook.vitest.ts`)
- [ ] No regressions in 200-prompt corpus parity harness
- [ ] 019/004 corpus parity 200/200 maintained
- [ ] HMAC cache p95 ≤ 50ms maintained (spot-check)
