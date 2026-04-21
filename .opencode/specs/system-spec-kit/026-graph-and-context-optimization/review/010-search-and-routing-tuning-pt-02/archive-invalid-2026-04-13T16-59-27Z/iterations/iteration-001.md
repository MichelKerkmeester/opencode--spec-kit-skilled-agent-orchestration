# Iteration 1: Legacy graph-metadata baseline across promoted roots

## Focus
Reviewed the promoted root `graph-metadata.json` files for `001`, `002`, and `003`, then compared them against the closeout claims in `003-graph-metadata-validation/implementation-summary.md` to verify whether the promotion actually removed legacy plaintext metadata from the continuity research tree.

## Findings

### P0

### P1
- **F003**: `003-graph-metadata-validation` falsely claims the promoted tree has zero legacy plaintext `graph-metadata` files — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:10` — The implementation summary says phase `004` was retired because the corpus no longer contains legacy plaintext `graph-metadata` files and records `legacyGraphMetadataFiles = 0`, but the promoted root metadata files for `001`, `002`, and `003` still begin with legacy `Packet:` headers rather than canonical JSON. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:10`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:21`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/graph-metadata.json:1`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json:1`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/graph-metadata.json:1`]

{"type":"claim-adjudication","findingId":"F003","claim":"The promoted continuity-research roots still contain legacy plaintext graph-metadata despite the 003 closeout claiming zero remain.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:10",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:21",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/graph-metadata.json:1",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json:1",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/graph-metadata.json:1"],"counterevidenceSought":"I checked whether the promoted root files were already canonical JSON but only displayed oddly in the terminal, and whether the zero count referred to a narrower subtree.","alternativeExplanation":"The zero-legacy claim could have been intended for only child implementation packets, but the implementation summary states the corpus-wide result without that qualifier.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if the promoted root graph-metadata files are regenerated into canonical JSON and the zero-legacy-file claim is rerun against that refreshed corpus."}

### P2

## Ruled Out
- Broken `children_ids` under the promoted `010` parent were not the primary issue here; the first material contradiction was format/state drift, not child linkage.

## Dead Ends
- The top-level coordination parent missing root spec docs may be a separate concern, but it was not needed to prove the false zero-legacy-file claim.

## Recommended Next Focus
Inspect the operator-facing launch surfaces for `002-content-routing-accuracy` to verify whether any live prompts still dispatch against pre-promotion paths.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: This first pass surfaced a concrete promotion contradiction between the 003 closeout claim and the live promoted root metadata files.
