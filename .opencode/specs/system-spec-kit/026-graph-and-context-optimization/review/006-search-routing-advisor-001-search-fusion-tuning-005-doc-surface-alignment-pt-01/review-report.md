# Deep Review Report - 005 Doc Surface Alignment

## Executive summary

**Verdict:** CONDITIONAL  
**hasAdvisories:** true  
**Iterations:** 10  
**Active findings:** 0 P0, 2 P1, 1 P2

The packet's substantive search-runtime claims still match the live implementation, so this is not a content-correctness failure about reranker telemetry, continuity fusion, or Stage 3 gating. The open issues are packet-local traceability and replayability defects introduced or left behind after the 026 renumber: generated ancestry drift in `description.json`, and a documented target path that is not replayable in the current `system-spec-kit` tree.

## Scope

Reviewed the packet-local canonical surfaces:

| Surface | Role |
|---|---|
| `spec.md` | Scope, requirements, exact target list |
| `plan.md` | Execution contract |
| `tasks.md` | Declared implementation + verification steps |
| `checklist.md` | Claimed verification evidence |
| `implementation-summary.md` | Delivery summary and replay commands |
| `description.json` | Generated packet description metadata |
| `graph-metadata.json` | Graph/linkage metadata |

Cross-checked those against the live evidence chain where the packet makes normative runtime claims:

| Evidence file | Why it was read |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Neutralized length multiplier and reranker telemetry |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | `MIN_RESULTS_FOR_RERANK = 4` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Continuity Stage 3 lambda |
| `.opencode/skill/system-spec-kit/mcp_server/configs/README.md` | Runtime-source-of-truth guidance |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` | Canonical `description.json` generation contract |

## Method

1. Ran a correctness baseline against live search code to separate substantive doc drift from packet-only drift.
2. Rotated across security, traceability, and maintainability, keeping one review dimension per iteration.
3. Logged every iteration to `deep-review-state.jsonl`, wrote packet narratives to `iterations/iteration-NNN.md`, and mirrored iteration deltas into `deltas/iter-NNN.jsonl`.
4. Used stabilization passes plus blocked-stop events to keep reviewing after convergence math would otherwise have stopped, because the active P1 set still needed full replay corroboration.
5. Synthesized the stable finding set into this report after iteration 010.

## Findings by severity

### P0

| ID | Title | Evidence | Impact |
|---|---|---|---|
| None | — | — | No release-blocking defect was confirmed. |

### P1

| ID | Dimension | Title | Evidence | Impact |
|---|---|---|---|---|
| F001 | Traceability / Correctness | Regenerated packet ancestry is stale after renumber | `description.json:17-22`, `graph-metadata.json:3-5`, `generate-description.ts:75-88` | Packet lineage is internally inconsistent after the 026 renumber, which weakens packet discovery and ancestry-based reasoning. |
| F002 | Traceability | Packet scope references a non-replayable target path | `spec.md:98`, `implementation-summary.md:104-105` | The packet claims it changed and verified a path that does not resolve in the current `system-spec-kit` tree, so the documented scope and PASS evidence are not reproducible as written. |

### P2

| ID | Dimension | Title | Evidence | Impact |
|---|---|---|---|---|
| F003 | Maintainability | Changed-file summary is harder to replay than the underlying packet scope | `spec.md:94-100`, `implementation-summary.md:72-73`, `implementation-summary.md:104-105` | Auditors must reconstruct exact file scope from a long verification command instead of from the summary itself. |

## Findings by dimension

| Dimension | Result | Findings |
|---|---|---|
| Correctness | Mostly clean | No runtime-claim drift; F001 remains because generated ancestry no longer matches the live path contract. |
| Security | Clean | No secrets, auth, trust-boundary, or unsafe operator-guidance issue found. |
| Traceability | Weak | F001 and F002 both break packet replayability after the 026 renumber. |
| Maintainability | Advisory | F003 shows the packet can be replayed, but not as easily as it should be. |

## Adversarial self-check for P0

No P0 finding survived adversarial review.

I specifically challenged whether either P1 was actually a hidden blocker:

1. **F001** could have been dismissed as historical alias noise, but the generator contract shows `parentChain` should reflect the live folder ancestry, not an alias trail.
2. **F002** could have been downgraded as harmless wording drift, but the packet explicitly records the missing path as a modified surface and as part of the PASS verification command, which makes it a real replay failure.

Because both defects stay packet-local and do not falsify the substantive runtime claims, neither rises to P0.

## Remediation order

1. **Fix F002 first.** Repair the nonexistent `feature_catalog_in_simple_terms.md` reference in `spec.md` and the verification record so the packet's documented scope is replayable again.
2. **Fix F001 next.** Regenerate or repair `description.json` so `parentChain` matches the live `001-search-and-routing-tuning` ancestry.
3. **Fix F003 last.** Expand the implementation summary's `Files Changed` table so exact feature catalog and playbook paths are visible without replaying the full verification command.

## Verification suggestions

1. Re-run the packet metadata generation step that owns `description.json`, then confirm `parentChain` matches the live packet path.
2. Rebuild the exact changed-file list from the packet and ensure every referenced path currently resolves in the tree before recording PASS evidence again.
3. Re-run the packet's verification command with only real paths and update the implementation summary with the replayable command line.
4. Keep the runtime-claim evidence set (`cross-encoder.ts`, `stage3-rerank.ts`, `intent-classifier.ts`, `configs/README.md`) unchanged unless a new doc-alignment packet is opened.

## Appendix

### Iteration list

| Iteration | Dimension | New P0/P1/P2 | Churn |
|---|---|---|---|
| 001 | correctness | 0 / 0 / 0 | 0.00 |
| 002 | security | 0 / 0 / 0 | 0.00 |
| 003 | traceability | 0 / 2 / 0 | 0.44 |
| 004 | maintainability | 0 / 0 / 1 | 0.12 |
| 005 | correctness | 0 / 0 / 0 | 0.08 |
| 006 | security | 0 / 0 / 0 | 0.00 |
| 007 | traceability | 0 / 0 / 0 | 0.07 |
| 008 | maintainability | 0 / 0 / 0 | 0.04 |
| 009 | correctness | 0 / 0 / 0 | 0.04 |
| 010 | security | 0 / 0 / 0 | 0.03 |

### Delta churn notes

- Iteration 003 introduced the two material P1 findings.
- Iteration 004 added the sole P2 maintainability advisory.
- Iterations 005 and 007 were insight passes that strengthened F001 and F002 without adding new IDs.
- Iterations 008-010 were low-churn stabilization passes; the loop ended at the configured max of 10 iterations with a stable CONDITIONAL verdict.
