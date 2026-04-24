---
title: "Phase [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/003-deep-review-remediation/plan]"
description: "Single-session cli-codex plan to close 5 P1 + 2 P2 findings from the r02 deep-review of the skill-advisor phase stack."
trigger_phrases:
  - "phase"
  - "plan"
  - "003"
  - "deep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/003-deep-review-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: Phase 025 — Deep-Review Remediation

## Strategy

Single cli-codex session handles all 7 remediation tracks sequentially. No parallel dispatch needed — findings span overlapping files (`skill-advisor-brief.ts` appears in 3 fixes), and sequential execution avoids merge conflicts. Each track ends with its own vitest run; final full-suite run gates completion.

## Phase Sequence

### Phase A — Privacy hardening (DR-P1-001)
1. Add `--stdin` mode to `skill_advisor.py`; preserve backward-compat argv mode for scripted callers.
2. Update `subprocess.ts` to spawn with piped stdin; write prompt on stdin; drop raw prompt from argv.
3. Extract or re-export the strong instruction-label sanitizer from `render.ts:50`.
4. Wire the strong sanitizer into `shared-payload.ts::coerceSharedPayloadEnvelope` at `skillLabel` acceptance.
5. Update tests: assert spawn argv contains no prompt; assert instruction-shaped `skillLabel` rejected at envelope boundary.
6. Run `advisor-privacy.vitest.ts` + `advisor-subprocess.vitest.ts` → must pass.

### Phase B — Cache + renderer contract (DR-P1-002)
1. Decide canonical approach: renderer reads `tokenCap` from `result.metrics.tokenCap` (simpler) vs plumb through hooks (explicit). Default to reading from `result.metrics`.
2. Update `skill-advisor-brief.ts::buildPromptCacheKey` (line ~354) to include normalized `maxTokens` in the SHA-256 input.
3. Update cache-hit path (lines ~360-373) to rebuild `sharedPayload.provenance.generatedAt` with fresh timestamp, not reuse stale.
4. Update `render.ts` ambiguity branch (line ~123) to emit top-two when tokenCap from metrics exceeds default, regardless of caller plumbing.
5. Tests: `advisor-brief.vitest.ts` — new cases for maxTokens cache isolation, cache-hit provenance freshness, ambiguity render across runtimes.

### Phase C — Telemetry fidelity (DR-P1-003)
1. `smart-router-measurement.ts`: change default output path to `.opencode/reports/smart-router-static/compliance.jsonl` (distinct from live stream). Add `--live-stream` flag to opt into shared stream if needed.
2. `live-session-wrapper.ts`: add `finalizePrompt(promptId)` method; preserve skill-qualified actual read identity in records (add `observedSkill` field).
3. `smart-router-telemetry.ts`: aggregate by `promptId`, flush on finalize or timeout.
4. `smart-router-analyze.ts`: group by `promptId`, treat baseline SKILL.md read as non-violating when no subsequent non-SKILL read occurs in session.
5. Tests: `telemetry-*.vitest.ts` — zero-read session; multi-read prompt → one session record; cross-skill read classification.

### Phase D — Plugin parity (DR-P1-004)
1. `spec-kit-skill-advisor.js`: read `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` first; keep plugin-specific flag as alias or remove.
2. Timeout path (lines ~171-212): after SIGTERM, wait 1000ms; if child still alive, SIGKILL; await exit before resolving.
3. Host cache key (lines ~63-83, ~243-265): include advisor source signature (read from generated brief diagnostics or compute).
4. `advisor-runtime-parity.vitest.ts`: add plugin path as 5th runtime; run 6 canonical renderer fixtures through plugin + bridge; normalize output and compare against 4 native hooks.
5. `spec-kit-skill-advisor-plugin.vitest.ts`: new cases for disable flag, SIGKILL escalation, source-signature invalidation.

### Phase E — Operator docs (DR-P1-005)
1. Grep all docs for `npm run --workspace=@spec-kit/mcp-server build` and replace with the checkout-valid form.
2. Update `../../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md` Codex status to match shipped `hooks/codex/` adapter.
3. Update `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` §validation scope: count scenarios in file; replace denominator with actual count.
4. Reconcile measurement artifact name across `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md`, `../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `smart-router-measurement.ts` — single canonical name.
5. `../../../../../skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` or `README.md`: clarify Copilot integration uses wrapper callbacks, not native hook.

### Phase F — API hygiene (DR-P2-001)
1. `prompt-cache.ts`: add `MAX_CACHE_ENTRIES = 1000` (tunable); on set, if size > cap, evict oldest by insertion order (Map iteration order is insertion order in JS).
2. `normalize-adapter-output.ts`: remove `normalizeAdapterOutput` alias if unused in repo; else JSDoc it as legacy surface.
3. Add JSDoc to exported functions in: `source-cache.ts`, `prompt-cache.ts`, `generation.ts`, `prompt-policy.ts`, `subprocess.ts`, `skill-advisor-brief.ts`, `metrics.ts`.

### Phase G — Test coverage (DR-P2-002)
1. `spec-kit-skill-advisor-plugin.vitest.ts`: add 4 cases — invalid bridge stdout, nonzero close, session cache isolation, targeted session eviction.
2. `advisor-subprocess.vitest.ts`: add 3 cases — schema-invalid JSON, non-busy nonzero exit, SQLITE_BUSY retry exhaustion.
3. `telemetry-*.vitest.ts`: add path-precedence and markdown report-write cases.
4. `advisor-runtime-parity.vitest.ts`: add one end-to-end case that drives `buildSkillAdvisorBrief()` → `renderAdvisorBrief()` without stubs.

### Phase H — Verify
1. Run full suite: `npm --prefix ../../../../../skill/system-spec-kit/mcp_server test`
2. Fix any regressions introduced by A-G.
3. Update `implementation-summary.md` with final test count + per-finding completion evidence.

## Estimated Effort

| Phase | Effort | LOC |
|---|---|---|
| A Privacy | 1.5h | ~100 |
| B Cache/Renderer | 1.5h | ~120 |
| C Telemetry | 2h | ~180 |
| D Plugin parity | 1.5h | ~120 |
| E Docs | 1h | ~80 (docs) |
| F API hygiene | 1h | ~100 |
| G Test coverage | 1.5h | ~200 (tests) |
| H Verify | 0.5h | — |
| **Total** | **~10h** | **~900 LOC** |

(Exceeds strict L2 100-499 LOC; packet remains L2 since no architectural changes and no decision-record needed.)

## Dispatch

Single cli-codex autonomous session:
```
codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<implement Phases A-H from plan.md>"
```

No sub-agents. No parallel dispatches. No convergence loop.

## Verification

- All existing 147+ tests continue to pass.
- New regression tests added in Phases A-D, G all pass.
- Manual spot-check: spawn argv for advisor subprocess has no raw prompt.
- Manual spot-check: `npm --prefix …/mcp_server run build` succeeds.
- Docs: all `npm run --workspace=` references resolve to executable commands in this checkout.
