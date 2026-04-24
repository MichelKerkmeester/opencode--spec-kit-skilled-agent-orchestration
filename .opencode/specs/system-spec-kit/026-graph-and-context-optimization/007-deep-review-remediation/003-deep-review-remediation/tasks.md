---
title: "Phase [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/003-deep-review-remediation/tasks]"
description: "Task breakdown for deep-review remediation (7 findings, 8 phases A-H)."
trigger_phrases:
  - "phase"
  - "tasks"
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
    key_files: ["tasks.md"]
---
# Phase 025 Tasks

## T001 — Scaffold packet
- [x] Create folder `025-deep-review-remediation/`
- [x] Write spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
- [x] Generate description.json + graph-metadata.json via generate-context.js

## T002 — Phase A: Privacy hardening (DR-P1-001)
- [x] Add `--stdin` mode to `skill_advisor.py`
- [x] Spawn via stdin in `subprocess.ts`; drop prompt from argv
- [x] Re-export strong label sanitizer from `render.ts`
- [x] Apply sanitizer in `shared-payload.ts::coerceSharedPayloadEnvelope`
- [x] Regression test: spawn argv contains no prompt
- [x] Regression test: instruction-shaped envelope label rejected
- [x] Pass privacy/subprocess regression coverage in `advisor-subprocess.vitest.ts` + `shared-payload-advisor.vitest.ts`

## T003 — Phase B: Cache + renderer contract (DR-P1-002)
- [x] Renderer reads tokenCap from `result.metrics.tokenCap`
- [x] Prompt-cache key includes normalized `maxTokens`
- [x] Cache-hit path rebuilds envelope provenance timestamp
- [x] Ambiguity branch emits top-two when metrics.tokenCap > default
- [x] Regression tests for cache isolation + provenance freshness
- [x] Pass focused brief/cache/parity coverage in `advisor-brief-producer.vitest.ts`, `advisor-prompt-cache.vitest.ts`, and `advisor-runtime-parity.vitest.ts`

## T004 — Phase C: Telemetry fidelity (DR-P1-003)
- [x] `smart-router-measurement.ts` writes static stream to separate default path
- [x] `live-session-wrapper.ts` adds `finalizePrompt()` + skill-identity preservation
- [x] `smart-router-telemetry.ts` aggregates by promptId
- [x] `smart-router-analyze.ts` groups by promptId + baseline-SKILL handling
- [x] Regression tests: zero-read session, multi-read single session, cross-skill
- [x] Pass focused telemetry vitest suite

## T005 — Phase D: Plugin parity (DR-P1-004)
- [x] Plugin honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`
- [x] SIGTERM + 1s wait + SIGKILL escalation
- [x] Source signature in host cache key
- [x] Plugin added as 5th runtime in parity harness
- [x] Regression tests: disable, SIGKILL, source-signature invalidation
- [x] Pass `spec-kit-skill-advisor-plugin.vitest.ts` + `advisor-runtime-parity.vitest.ts`

## T006 — Phase E: Operator docs (DR-P1-005)
- [x] Replace `npm run --workspace=@spec-kit/mcp-server build` with checkout-valid command
- [x] Update Codex registration status in hook reference + catalog + playbook
- [x] Regenerate manual-testing-playbook denominator
- [x] Align measurement artifact name across docs + code
- [x] Clarify Copilot integration uses wrapper callbacks
- [x] Manual spot-check: command from hook reference succeeds on fresh checkout

## T007 — Phase F: API hygiene (DR-P2-001)
- [x] Add size cap + insertion eviction to `prompt-cache.ts`
- [x] Remove or JSDoc `normalizeAdapterOutput` alias
- [x] Add JSDoc to 7 advisor helper files

## T008 — Phase G: Test coverage (DR-P2-002)
- [x] Plugin suite: 4 negative-path cases
- [x] Subprocess suite: 3 error-code cases
- [x] Telemetry suite: path-precedence + report-writer cases
- [x] Parity suite: 1 end-to-end hook->builder case

## T009 — Phase H: Verify
- [x] Full vitest suite attempted: `npm --prefix ../../../../../skill/system-spec-kit/mcp_server test`; unrelated legacy failures remained outside Phase 025 scope
- [x] No regressions introduced by A-G in focused remediation suite
- [x] Update implementation-summary.md with per-finding completion evidence
- [x] Mark P1/P2 checklist items [x] with evidence

## T010 — Post-impl
- [ ] Memory save: `generate-context.js` on Phase 025
- [ ] Commit + push (blocked by user constraint: no git commits)
- [ ] Update T17 task to completed
