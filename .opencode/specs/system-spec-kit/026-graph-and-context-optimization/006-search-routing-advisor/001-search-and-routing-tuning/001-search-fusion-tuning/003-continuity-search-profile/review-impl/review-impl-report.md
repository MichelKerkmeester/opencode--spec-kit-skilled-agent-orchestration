# Implementation Deep Review Report - Continuity Search Profile

## 1. Executive summary

Verdict: CONDITIONAL.

Counts: P0=0, P1=4, P2=1. Confidence: medium-high for the cited implementation issues, medium for runtime blast radius because the public request path mostly constrains intents before they reach the fusion helper.

The implementation is not cleanly shippable because the required scoped Vitest command is red/flaky and because `getAdaptiveWeights()` accepts raw string keys and unbounded env-controlled retuning before assuming valid numeric weights. I did not find a P0 security hole or data-loss path.

## 2. Scope

Code files audited:

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` | Continuity fusion profile and adaptive fusion helper |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Public intent union and MMR lambda map |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive fusion and continuity profile regression tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts` | Adaptive ranking continuity path test |
| `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts` | Continuity K-value evaluation fixture |
| `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts` | Intent union and lambda map tests |

Spec docs were read only to determine the implementation scope. Findings that cite only spec docs were intentionally excluded.

## 3. Method

- Ran the required scoped Vitest command once with full output and repeated it across the loop. Results were inconsistent: some runs passed, multiple runs failed on the same adaptive-fusion T12 assertion.
- Ran `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`: PASS.
- Checked git history for the implementation files. The continuity profile was introduced in `d8ea31810c`; later local-scope commits changed tests, especially `adaptive-fusion.vitest.ts`.
- Used `rg`, `find`, `git log`, `git blame`, and direct numbered reads. CocoIndex and memory MCP calls returned immediate cancellation in this session, so local search was used as the fallback.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| None | - | No P0 findings survived review. | - |

### P1

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| IMPL-F001 | correctness | Prototype-key intent strings bypass the unknown-intent default path. `getAdaptiveWeights()` indexes a plain object with a raw string and then assumes numeric fields. | `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:138`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:142`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:170` |
| IMPL-F002 | robustness | `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` is not validated or clamped before it can produce negative or invalid weights. | `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:86`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:149`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:153`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:158`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:163` |
| IMPL-F003 | testing | Required scoped Vitest verification is red/flaky in the adaptive-fusion degradation branch. | `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:268`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:396`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:401` |
| IMPL-F004 | correctness | The dedicated continuity profile is still subject to generic document-type retuning, but tests only assert the no-document-type path. | `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:148`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:156`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:108`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:134` |

### P2

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| IMPL-F005 | testing | Graph field validation omits the new continuity profile from shared graphWeight/graphCausalBias checks. | `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:307`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:357` |

## 5. Findings by dimension

Correctness:

- IMPL-F001: raw profile lookup should use an own-property safe map/default path.
- IMPL-F004: continuity profile invariants are ambiguous when `documentType` is present.

Security:

- No P0/P1 security finding. The public intent union is still limited to 7 intents at `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7`, and no secret, traversal, shell, auth, or permission boundary appears in the scoped code.

Robustness:

- IMPL-F002: env-driven document-type factor can produce invalid weights.
- IMPL-F003: verification behavior is unstable enough to reduce release confidence.

Testing:

- IMPL-F003: scoped Vitest command fails intermittently at the degradation assertion.
- IMPL-F005: continuity is missing from shared graph-field validation.

## 6. Adversarial self-check for P0

P0 candidate checked: prototype-key intent strings.

Expected vs actual: unknown intent strings should consistently fall back to `DEFAULT_WEIGHTS`; the code instead uses `INTENT_WEIGHT_PROFILES[intent]` on a normal object at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:142`. This is a real correctness hardening issue, but not P0 because the main request path constrains public `IntentType` values in `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7`, and the observed failure mode is ranking degradation/channel omission rather than data loss, crash, or direct privilege impact.

P0 candidate checked: flaky scoped Vitest.

Expected vs actual: verification should be deterministically green; repeated runs alternated between exit 0 and exit 1, with failures at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:268`. This blocks a PASS verdict, but it is not a production crash path by itself.

## 7. Remediation order

1. Fix IMPL-F003 first so the scoped test command is deterministic. Prefer asserting the actual fallback contract with one controlled standard result, or isolate the mock so the comparison cannot observe a different module/mock state.
2. Fix IMPL-F001 by using an own-property safe profile lookup, for example `Object.hasOwn(INTENT_WEIGHT_PROFILES, intent) ? INTENT_WEIGHT_PROFILES[intent] : DEFAULT_WEIGHTS`, or a `Map`.
3. Fix IMPL-F002 by validating `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` as finite and within a safe range before using it.
4. Decide and encode the continuity/documentType contract for IMPL-F004: either exempt continuity from document-type retuning or add explicit expected-value tests.
5. Add continuity to the shared graph profile validation list for IMPL-F005.

## 8. Test additions needed

- `getAdaptiveWeights('__proto__')`, `getAdaptiveWeights('constructor')`, and another inherited key should return the same normalized default as ordinary unknown intents.
- Env-factor tests should cover negative, zero, non-finite, and extreme `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` values and assert every returned weight is finite and in `[0, 1]`.
- Continuity with document types should be explicitly tested for the chosen contract.
- Add `continuity` to `PROFILE_NAMES` in the graph field validation block.
- Stabilize T12 and run the scoped test command several times in a row before closing the remediation.

## 9. Appendix: iteration list + churn

| Iteration | Dimension | New findings | Vitest | Churn |
|---|---|---|---|---:|
| 001 | correctness | IMPL-F001 | exit 1 | 0.28 |
| 002 | security | none | exit 1 | 0.04 |
| 003 | robustness | IMPL-F002 | exit 0 | 0.24 |
| 004 | testing | IMPL-F003 | exit 1 | 0.31 |
| 005 | correctness | IMPL-F004 | exit 1 | 0.20 |
| 006 | security | none | exit 0 | 0.03 |
| 007 | robustness | refinement of IMPL-F003 | exit 1 | 0.05 |
| 008 | testing | IMPL-F005 | exit 1 | 0.08 |
| 009 | correctness | none | exit 0 | 0.02 |
| 010 | security | none | exit 1 | 0.02 |

Stop reason: maxIterationsReached. Clean convergence was not claimed because active P1 findings remain and the scoped verification command was unstable.
