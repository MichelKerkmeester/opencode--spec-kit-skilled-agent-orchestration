# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

Confidence: medium-high. The review audited production/test code only and found no P0 findings. It found 3 P1 findings and 3 P2 findings across the OpenCode plugin bridge, smart-router static checker, telemetry module, and packet-scoped tests.

Counts:

| Severity | Count |
| --- | ---: |
| P0 | 0 |
| P1 | 3 |
| P2 | 3 |

The implementation is not release-blocked by a P0, but the P1 findings should be fixed before relying on the plugin and static checker as governance surfaces.

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` | Static router path checker |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts` | Observe-only telemetry recorder |
| `.opencode/plugins/spec-kit-skill-advisor.js` | OpenCode plugin host |
| `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` | Bridge process for advisor brief generation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts` | Telemetry tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Plugin tests |

Not reviewed for findings:
- Spec docs, metadata drift, `description.json`, and `graph-metadata.json`.
- Markdown-only skill router prose, except as context for code behavior.

## 3. Method

Verification and evidence collection:

| Check | Result |
| --- | --- |
| Scoped vitest command | PASS on all 10 iteration runs: 2 files, 28 tests per run |
| `npm run typecheck` in `.opencode/skill/system-spec-kit` | PASS |
| `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh --json` | PASS, no errors, 5 informational warnings |
| Git history check | Reviewed relevant commits `7cead37e6`, `874554827`, `97a318d83` |
| Grep/layout checks | Confirmed targeted code locations and absence of `check-smart-router` test references outside the script |

Scoped vitest command:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
../scripts/node_modules/.bin/vitest run tests/smart-router-telemetry.vitest.ts tests/spec-kit-skill-advisor-plugin.vitest.ts --reporter=default
```

## 4. Findings By Severity

### P0

None.

### P1

| ID | Dimension | Finding | Code evidence |
| --- | --- | --- | --- |
| F001 | correctness | Native bridge ignores the plugin threshold option. The host normalizes and sends `thresholdConfidence`, but native `buildNativeBrief()` calls `handleAdvisorRecommend()` without confidence or uncertainty thresholds. | `.opencode/plugins/spec-kit-skill-advisor.js:90`, `.opencode/plugins/spec-kit-skill-advisor.js:292`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:187`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:193` |
| F003 | security | Smart-router checker accepts traversal-shaped router resources because prefix/suffix validation does not reject `..` segments before checking `skill_dir / resource`. | `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:70`, `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:100`, `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:106`, `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:260` |
| F006 | testing | Packet-scoped plugin tests mock the bridge and do not assert native threshold or uncertainty behavior, so F001/F002 can pass the requested scoped suite. | `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:8`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:293`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:297`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:187` |

### P2

| ID | Dimension | Finding | Code evidence |
| --- | --- | --- | --- |
| F002 | correctness | Native bridge prints a hard-coded `0.00` uncertainty-like second score, unlike the legacy renderer which prints actual confidence and uncertainty. | `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:121`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:135` |
| F004 | robustness | Plugin pipes bridge stderr but does not drain it, while the bridge forwards console output to stderr. Noisy dependencies can block until timeout and cause avoidable fail-open behavior. | `.opencode/plugins/spec-kit-skill-advisor.js:213`, `.opencode/plugins/spec-kit-skill-advisor.js:216`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:40`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:45` |
| F005 | robustness | Telemetry prompt observations live in a process-global `Map` with deletion only on finalize, leaving long-running sessions exposed to accumulation when finalize is missed. | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:57`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:254`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:299` |

## 5. Findings By Dimension

Correctness:
- F001: threshold option ignored in native bridge path.
- F002: native brief fabricates `0.00` as the second score.

Security:
- F003: static checker does not contain router resource paths to the skill directory.

Robustness:
- F004: stderr backpressure can degrade bridge calls into timeout/fail-open behavior.
- F005: telemetry prompt map has no expiry or bulk cleanup path.

Testing:
- F006: requested scoped plugin tests mock the bridge and miss the native contract.

## 6. Adversarial Self-Check For P0

No P0 findings were identified.

P1 reproducibility notes:
- F001/F002 were smoke-checked by running the bridge in native mode. It returned a brief shaped like `Advisor: stale; use system-spec-kit 0.92/0.00 pass.`, matching `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122`.
- F003 is line-evident: `normalize_resource()` accepts paths by prefix/suffix and the missing-path check tests `(skill_dir / resource).exists()` without resolving containment.
- F004 is line-evident: spawn config pipes stderr, and the bridge writes redirected console output to stderr.

## 7. Remediation Order

| Priority | Finding | Recommended change |
| --- | --- | --- |
| 1 | F001 | Pass `confidenceThreshold` and `uncertaintyThreshold` into native `handleAdvisorRecommend()` or route native rendering through the same brief renderer contract as legacy. |
| 2 | F002 | Stop printing `0.00` unless the value is real. Prefer exposing uncertainty from the native handler or rendering only confidence. |
| 3 | F006 | Add a packet-scoped real bridge/native test that exercises threshold propagation and uncertainty rendering. |
| 4 | F003 | Resolve each resource path and reject paths whose resolved value is outside the owning skill directory. Add a traversal regression test. |
| 5 | F004 | Drain stderr with a bounded buffer or redirect it to ignored output explicitly. Preserve prompt safety. |
| 6 | F005 | Add TTL/session cleanup for `activePromptInputs` or expose a wrapper-level cleanup method for abandoned prompts. |

## 8. Test Additions Needed

| Area | Needed test |
| --- | --- |
| Native bridge threshold | Configure `thresholdConfidence` above a known recommendation confidence and assert the native bridge does not return a `pass` brief. |
| Native bridge uncertainty | Assert native brief either includes real uncertainty or omits the second score. |
| Static checker containment | Create a fixture with `references/../../outside.md` and assert `check-smart-router.sh --json` reports it as an error. |
| Stderr robustness | Mock a bridge child that writes substantial stderr and assert the plugin resolves without waiting for timeout. |
| Telemetry cleanup | Start many prompt observations without finalize and assert a TTL/cleanup path bounds retained entries. |

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New findings | Churn | Artifact |
| --- | --- | --- | ---: | --- |
| 001 | correctness | F001, F002 | 0.55 | `review-impl/iterations/iteration-001.md` |
| 002 | security | F003 | 0.42 | `review-impl/iterations/iteration-002.md` |
| 003 | robustness | F004, F005 | 0.16 | `review-impl/iterations/iteration-003.md` |
| 004 | testing | F006 | 0.28 | `review-impl/iterations/iteration-004.md` |
| 005 | correctness | none | 0.06 | `review-impl/iterations/iteration-005.md` |
| 006 | security | none | 0.06 | `review-impl/iterations/iteration-006.md` |
| 007 | robustness | none | 0.06 | `review-impl/iterations/iteration-007.md` |
| 008 | testing | none | 0.04 | `review-impl/iterations/iteration-008.md` |
| 009 | correctness | none | 0.03 | `review-impl/iterations/iteration-009.md` |
| 010 | security | none | 0.03 | `review-impl/iterations/iteration-010.md` |

State artifacts:
- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/deltas/iter-001.jsonl` through `review-impl/deltas/iter-010.jsonl`
