# Implementation Deep Review Report

## 1. Executive Summary

Verdict: changes required.

Confidence: high for the implementation issues listed below. The loop audited the actual code files claimed by the packet, not spec-doc drift. Scoped Vitest stayed green across all requested iteration checks, but the audit found one P0 security boundary issue, two P1 correctness/testing issues, and two P2 robustness issues.

Counts:

| Severity | Count |
| --- | ---: |
| P0 | 1 |
| P1 | 2 |
| P2 | 2 |

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Production router implementation |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` | Production routing prototype library |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Scoped regression suite |

Spec docs were used only to discover scope. Findings that cited only `.md`, `description.json`, or `graph-metadata.json` were rejected by design.

## 3. Method

Verification and evidence gathered:

| Check | Result |
| --- | --- |
| `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/content-router.vitest.ts --reporter=default` | PASS, 30/30 in every recorded run |
| `git log --oneline --decorate --max-count=12 -- <scoped files>` | Checked; implementation traces to `d8ea31810c feat(026): implement 10 sub-phases + 30-iteration deep review` |
| `git blame` on soft/hard cue and regression-test lines | Checked; packet lines trace to `d8ea31810c` |
| `rg` over router/prototypes/tests | Checked routing cue layout, target-doc handling, tests, and consumers |
| Runtime probes using built `dist/lib/routing/content-router.js` | Checked repository-state handover refusal, arbitrary Tier 3 target_doc acceptance, and `routeAs: "drop"` consistency |

## 4. Findings By Severity

### P0

| ID | Finding | Code Evidence |
| --- | --- | --- |
| IMPL-P0-001 | Tier 3 can route to an arbitrary `target_doc` path. A classifier response with `target_doc: "../../package.json"` is accepted into the final routing decision with `refusal=false`. Downstream save handling joins the routed string with the spec folder and proceeds if the path exists. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427` |

### P1

| ID | Finding | Code Evidence |
| --- | --- | --- |
| IMPL-P1-001 | Handover notes that include repository state can still be refused. `repository state` remains a hard drop cue and can outrank strong handover language, producing a manual-review target for a valid stop-state note. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1010`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:274` |
| IMPL-P1-002 | Tests miss the hard-wrapper-plus-handover case and refreshed prototype tests only assert category. A `handover_state` decision with `refusal=true` can pass the category-only prototype assertion. | `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:133`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:140`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:535`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:556`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409` |

### P2

| ID | Finding | Code Evidence |
| --- | --- | --- |
| IMPL-P2-001 | Explicit `routeAs: "drop"` produces an inconsistent decision: category `drop` and a refuse-to-route target, but `refusal=false` and `overrideable=true`. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:511`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:518`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1076`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:509` |
| IMPL-P2-002 | Tier 3 prompt construction sends unbounded raw chunk text even though the normalized routing text is clipped to 2048 chars. Large chunks can inflate requests and prompt-injection surface. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:586`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:591`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1125`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1130`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1310` |

## 5. Findings By Dimension

| Dimension | Findings |
| --- | --- |
| Correctness | IMPL-P1-001 |
| Security | IMPL-P0-001 |
| Robustness | IMPL-P2-001, IMPL-P2-002 |
| Testing | IMPL-P1-002 |

## 6. Adversarial Self-Check For P0

P0 reproduction:

1. Inject a Tier 3 classifier response with `category: "handover_state"`, `confidence: 0.83`, `target_doc: "../../package.json"`, `target_anchor: "session-log"`, and `merge_mode: "append-section"`.
2. Run `classifyContent()` on ambiguous text with Tier 3 enabled.
3. Observed result: final decision has `target.docPath="../../package.json"`, `refusal=false`, and `tierUsed=3`.

Expected result:

The router should canonicalize the target to `handover.md` for `handover_state`, or refuse the route. It should never trust model-provided target paths directly.

Why this is P0:

The production validator accepts the target string in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859`, the final decision uses it in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`, and downstream target resolution uses a path join in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153`. That is a write-boundary escape risk if the routed path exists.

## 7. Remediation Order

1. Fix IMPL-P0-001 first: canonicalize or allow-list Tier 3 target docs by category, and add resolved-path containment in the save handler before reads or writes.
2. Fix IMPL-P1-001: demote `repository state` and similar telemetry to soft operational cues when strong handover language is present, or require transcript/wrapper context before giving them drop dominance.
3. Add IMPL-P1-002 tests immediately after fixing routing behavior.
4. Fix IMPL-P2-001 by treating `routeAs: "drop"` as refusal or rejecting it as an override.
5. Fix IMPL-P2-002 by bounding Tier 3 prompt text.

## 8. Test Additions Needed

Add focused tests in `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`:

| Test | Expected |
| --- | --- |
| Tier 3 returns `target_doc: "../../package.json"` for `handover_state` | Router refuses or replaces target with `handover.md` |
| Handover text includes `Current state`, `Repository state`, and `Next session` | `handover_state`, `handover.md`, `refusal=false` |
| Refreshed HS-01 and HS-04 prototypes | Assert category, target doc, merge mode, and `refusal=false` |
| `routeAs: "drop"` | Either schema/runtime rejection or decision has `refusal=true`, `overrideable=false` |
| Oversized Tier 3 chunk | Prompt uses bounded chunk text |

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New Findings | Churn |
| --- | --- | --- | ---: |
| 001 | correctness | IMPL-P1-001 | 1.0 |
| 002 | security | IMPL-P0-001 | 0.625 |
| 003 | robustness | IMPL-P2-001, IMPL-P2-002 | 0.2 |
| 004 | testing | IMPL-P1-002 | 0.2308 |
| 005 | correctness | none | 0 |
| 006 | security | none | 0 |
| 007 | robustness | none | 0 |
| 008 | testing | none | 0 |
| 009 | correctness | none | 0 |
| 010 | security | none | 0 |

Artifacts:

- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `iter-010.jsonl`
