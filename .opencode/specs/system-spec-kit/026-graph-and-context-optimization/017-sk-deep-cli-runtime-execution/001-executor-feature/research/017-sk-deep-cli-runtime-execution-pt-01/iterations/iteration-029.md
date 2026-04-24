## Focus

Q2 live-corpus impact pass: move beyond the code-path proof from iteration 028 and measure how much of the checked-in `026-graph-and-context-optimization` corpus is currently exposed to summary flattening if `description.json` ever falls onto the regeneration path.

## Actions Taken

1. Re-read the prior Q2 notes in `iteration-028.md` and the current strategy state to keep this pass scoped to live-corpus impact rather than re-deriving the code-path.
2. Read `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` to confirm what the explicit regeneration entrypoint preserves.
3. Read `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` to confirm the exact `loadPerFolderDescription()` validity gate and the generated `PerFolderDescription` shape.
4. Read `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` plus `scripts/tests/workflow-canonical-save-metadata.vitest.ts` to confirm that valid loads are mutated in place, while missing/corrupt loads regenerate and then continue.
5. Scanned all packet-level `description.json` files under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` and separated three buckets:
   - schema-extended files carrying keys outside the generated contract
   - long curated descriptions above the generator's 150-character explicit-description cap
   - the union of both, representing packets that are one invalid edit away from materially lossy regeneration

## Findings

### P1. The live 026 packet corpus has a non-trivial blast radius: 29 of 86 packet-level `description.json` files are one invalid edit away from materially lossy regeneration

- Packet-level corpus count: `86` `description.json` files after excluding `research/` and `review/` support artifacts.
- At-risk union count: `29/86` packet files either have schema-extended fields, descriptions longer than the generator's compact fallback shape, or both.
- Split:
  - `15` files have both schema extensions and long curated descriptions.
  - `1` file has schema extensions without a long description.
  - `13` files have long curated descriptions without schema extensions.
- This means the risk is no longer hypothetical or isolated to one hand-authored packet. Roughly one third of the packet corpus would lose information if `loadPerFolderDescription()` starts returning `null` for those files.

Reproduction path:

- Pick any at-risk packet such as:
  - `016-foundational-runtime/002-infrastructure-primitives/description.json`
  - `016-foundational-runtime/003-cluster-consumers/description.json`
  - `010-search-and-routing-tuning/description.json`
- Introduce any parse/type error that makes `loadPerFolderDescription()` fail, such as invalid JSON syntax or a non-string `description`.
- Run a canonical save or explicit description regeneration path.
- The file is rebuilt from the generated contract, dropping any keys not carried by `generatePerFolderDescription()` and replacing the curated description body with extracted fallback text.

Risk-ranked remediation candidates:

- Phase 019 P1: add a repair-mode merge path that preserves safe unknown keys and prefers the richer of existing-vs-generated description text when the old file is parseable but schema-invalid.
- Phase 019 P1: add a corpus-style regression test that feeds a schema-extended 026 packet through the invalid-load branch and asserts no silent field loss.

### P1. The hard loss boundary is now corpus-verified: valid-load canonical saves are mostly safe, but invalid-load regeneration is still destructive

- `loadPerFolderDescription()` accepts the core generated shape plus optional tracking and path-identity fields, then returns `null` on any structural invalidity.
- `workflow.ts` loads the existing file, mutates `memorySequence`, `memoryNameHistory`, and `lastUpdated`, then saves the same object when the load succeeds.
- Only when the load fails does the workflow call `generatePerFolderDescription()` and persist the fresh generated object before continuing.
- That confirms the operational boundary for Q2:
  - valid files keep their extra keys and long descriptions during normal canonical saves
  - invalid or corrupt files fall onto a regeneration branch that is still lossy for authored metadata

Reproduction path:

- Compare the safe branch in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` with the load/regenerate/save helpers in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`.
- The same distinction is mirrored in `scripts/tests/workflow-canonical-save-metadata.vitest.ts`, which mutates the loaded snapshot in place rather than reconstructing it from scratch.

Risk-ranked remediation candidates:

- Phase 019 P1: narrow the `null` fallback surface by introducing a "repairable parse" path for files that are syntactically readable but miss a subset of fields.
- Phase 019 P2: emit an explicit warning event when regeneration occurs, so operators can detect that a summary was rebuilt rather than preserved.

### P2. The most concentrated risk cluster is Phase 017 child packets, but older coordination parents also carry silently losable summaries

- The densest schema-extended cluster is `016-foundational-runtime`, especially:
  - `001-infrastructure-primitives`
  - `002-cluster-consumers`
  - `003-rollout-sweeps`
- Those files carry operator-facing planning metadata such as `scope`, `qualityGates`, `waveScope`, `downstreamDependents`, `blockingFindings`, and related packet-control keys that are outside the generated contract.
- A second, broader risk band comes from older parent packets with intentionally rich narrative descriptions but no extra fields, such as:
  - `001-research-graph-context-systems/*`
  - `008-cleanup-and-audit/description.json`
  - `010-search-and-routing-tuning/description.json`
  - `014-memory-save-rewrite/description.json`
- These are still at risk because the current regeneration surface can compress them into shorter title-shaped or first-sentence summaries even when no extra keys are present.

Reproduction path:

- Compare `description` length and custom-key shape across the representative files above, then mentally apply the generated return shape from `generatePerFolderDescription()`.
- The schema-extended Phase 017 child packets would lose packet-control metadata immediately; the long-description parents would lose summary richness even without extra-key loss.

Risk-ranked remediation candidates:

- Phase 019 P2: define a supported extension namespace for packet-control metadata instead of relying on undeclared extra keys in `description.json`.
- Phase 019 P2: add a richer summary source in `spec.md` that regeneration can target, so long-form parent packets do not collapse into first-sentence fallbacks.

## Questions Answered

- Q2: answered more concretely. The root cause remains the same regeneration contract identified in iteration 028, but the live-corpus blast radius is now quantified.
- Q2 sub-question: "How many packets are one invalid edit away from flattening?" Current estimate for the 026 packet corpus is `29/86`.
- Q2 sub-question: "Is this mostly a new Phase 017 problem?" No. Phase 017 is the highest-risk schema-extension cluster, but older coordination parents also carry materially losable long summaries.

## Questions Remaining

- Q1: whether the original H-56-1 two-batch refresh and later graph-only writes interact with this Q2 loss boundary in any real operator workflow, or whether they are mostly separate failure classes.
- Q3: whether all `SharedPayloadTrustState` vocabulary values are reachable across the seven sibling handlers.
- Q4: whether the NFKC sanitization coverage meaningfully extends beyond the currently tested script set.
- Q5: whether the `N=3` retry budget is evidence-based or just a pragmatic default.
- Q6: whether AsyncLocalStorage caller-context propagation survives every async boundary used by the runtime.
- Q7-Q10: unchanged from the state summary, though Q10 now looks even more like a policy guardrail than an empirically calibrated latency budget.

## Next Focus

Stay on Q2 only if needed for a final closure pass, but shift from packet counting to remediation design pressure:

- inspect whether any current invalid-load callers can distinguish parse failure from schema failure
- test whether a repair-mode merge can be made deterministic without reintroducing stale-field drift
- if Q2 is sufficiently saturated, switch to Q3 or Q5 for fresh information before the loop ends
