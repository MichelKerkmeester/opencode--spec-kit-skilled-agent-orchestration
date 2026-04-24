# Focus

Observe Q2's cross-layer invariants against a representative live sample from the 026 packet tree, classify divergence types, and determine whether any packet-state drift is a real state drop rather than historical metadata skew.

# Actions Taken

1. Re-read `iteration-001.md` and `iteration-002.md` to anchor the observation pass on the previously derived Q2 invariant set instead of re-deriving rules from scratch.
2. Enumerated the active packet folders under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` and extracted the four observed state layers for each candidate packet: `spec.md` frontmatter continuity when present, `description.json.lastUpdated`, `graph-metadata.json.derived.last_save_at`, and `graph-metadata.json.derived.save_lineage`.
3. Selected eight packets to cover varied lifecycle states:
   - research root with child iteration trees: `001-research-graph-context-systems`
   - older in-progress implementation packet: `004-agent-execution-guardrails`
   - stale child-only parent packet: `007-release-alignment-revisits`
   - stale/in-progress child-only parent packet: `010-search-and-routing-tuning`
   - shipped implementation packet: `012-command-graph-consolidation`
   - planned packet: `013-advisor-phrase-booster-tailoring`
   - recently updated in-progress packet: `015-deep-review-and-remediation`
   - freshest umbrella packet: `019-system-hardening`
4. Cross-checked each sample against the five Q2 JSONL invariants from iteration 2:
   - `inv-iter002-same-pass-freshness`
   - `inv-iter002-same-pass-lineage`
   - `inv-iter002-packet-identity`
   - `inv-iter002-target-doc-parity`
   - `inv-iter002-planner-parity`
5. Searched the sampled packet docs for stored validator drift artifacts. None of the sampled folders contained a separate persisted validator drift report; only narrative references to drift/validator work appeared inside normal packet docs, so this iteration classifies live metadata state rather than replaying saved validator output.

# Findings

## P0: real divergence observed

Two active 026 packet roots currently carry metadata files without any canonical root spec document:

- `007-release-alignment-revisits`
- `010-search-and-routing-tuning`

Observed state:

- Folder contains child phase folders plus `description.json` and `graph-metadata.json`.
- No `spec.md` exists, so `_memory.continuity` is absent by construction.
- `graph-metadata.json.derived.source_docs` is `[]`, so the graph layer has no canonical target-doc evidence either.

Why this is real:

- This is not harmless clock skew. One of the four canonical state layers is missing entirely, and the target-doc parity invariant cannot be satisfied.
- Because the folders are still treated as active packets by `description.json` and `graph-metadata.json`, downstream tools can see packet metadata while having no continuity surface to update or read back.

Minimal reproduction:

1. `ls .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/001-release-alignment-revisits`
2. `ls .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning`
3. Confirm both roots lack `spec.md`.
4. `jq '.derived.source_docs' .../001-release-alignment-revisits/graph-metadata.json`
5. `jq '.derived.source_docs' .../001-search-and-routing-tuning/graph-metadata.json`
6. Observe `[]` for both while `description.json` still advertises an active `specFolder`.

Classification: `real`

Severity: `P0`

## Per-packet observations

| Packet | Lifecycle sample | Key observations | Classification |
| --- | --- | --- | --- |
| `001-research-graph-context-systems` | research root with child research folders | `packet_pointer`, `description.specFolder`, and `graph.spec_folder` agree; canonical docs exist; `description.lastUpdated` and `graph.last_save_at` drift by about 23h; `save_lineage` is null | `expected` |
| `004-agent-execution-guardrails` | older in-progress implementation packet | Identity surfaces agree and canonical docs exist; continuity timestamp is older than both metadata files; `save_lineage` is null | `expected` |
| `007-release-alignment-revisits` | stale child-only parent packet | No `spec.md`; no continuity surface; `source_docs` is empty despite active packet metadata | `real` |
| `010-search-and-routing-tuning` | stale/in-progress child-only parent packet | Same failure mode as 007: no `spec.md`, no continuity, empty `source_docs`, but still active metadata | `real` |
| `012-command-graph-consolidation` | shipped implementation packet | Identity surfaces agree; canonical docs exist; `description.lastUpdated` is newer than `graph.last_save_at`; `save_lineage` is null even after 14 saved lineage steps in `description.json.memorySequence` | `latent` |
| `013-advisor-phrase-booster-tailoring` | planned packet | `packet_pointer` drops the `system-spec-kit/` segment while `description.specFolder` and `graph.spec_folder` keep it; graph freshness lags description freshness; canonical docs exist | `latent` |
| `015-deep-review-and-remediation` | recently updated in-progress packet | Freshness is effectively same-pass (`2026-04-18T14:47:57.179Z` vs `2026-04-18T14:47:57.797Z`), but `description.specFolder` includes `.opencode/specs/...` while continuity and graph use packet-relative identity; `save_lineage` is still null on a fresh save | `latent` |
| `019-system-hardening` | freshest umbrella packet | Identity surfaces agree and same-pass freshness holds within milliseconds; `save_lineage` is still null on the newest sampled packet, disproving the "historical only" explanation for that field | `latent` |

## Invariant-by-invariant interpretation

### 1. Same-pass freshness

- Holds on the freshest sampled packet (`019`) and is effectively holding on `015`.
- Does not hold uniformly on older packets (`001`, `004`, `012`), which matches iteration 2's migration warning that historical packets can retain skew.
- `012` is the most interesting non-P0 case because `description.json` is newer while `graph-metadata.json` is older, which can mask a partial refresh path.

Current classification: `mixed`

Operational takeaway: keep migration exceptions for older packets, but treat newer desc-newer-than-graph cases like `012` as latent validator candidates rather than harmless noise.

### 2. Same-pass lineage

- Violated on every sampled packet, including the freshest packets (`015`, `019`).
- This means the iteration-2 migration note is no longer sufficient: `save_lineage: null` is not just old debt; it is still showing up on current-path saves.

Current classification: `latent`

Operational takeaway: Q2's lineage invariant should stay in Q5, but now as a live bug candidate rather than a migration-only guardrail.

### 3. Packet identity normalization

- Holds on `001`, `004`, `012`, and `019`.
- Violates in two distinct live ways:
  - `013` continuity path is missing the `system-spec-kit/` prefix.
  - `015` `description.specFolder` uses an `.opencode/specs/...` path while continuity + graph use packet-relative identity.

Current classification: `latent`

Operational takeaway: identity normalization has at least two surviving formats in active packets, which can break exact-match joins or validator assumptions even when state is not lost.

### 4. Target-doc parity

- Holds on packets with full canonical doc sets (`001`, `004`, `012`, `013`, `015`, `019`).
- Fails hard on `007` and `010`, where `source_docs` is empty because no canonical root docs exist.

Current classification: `real`

Operational takeaway: this is the clearest validator-ready P0 rule. A packet root that advertises packet metadata but has no canonical root docs is already in a dropped-state condition.

### 5. Planner parity

- Passive packet observation does not distinguish whether a given packet was last saved from `plan-only` or `full-auto`.
- No mode-specific asymmetry was visible from metadata alone, but this sample cannot prove planner parity.

Current classification: `unresolved from packet-state observation`

Operational takeaway: planner-parity assertions in Q5 still need an explicit dispatch-paired reproduction, not just tree observation.

# Questions Answered

- **Q4:** Answered. The live 026 sample shows three distinct divergence classes:
  - historical/expected skew on older packets,
  - latent invariant violations that preserve state but can mask tooling bugs,
  - real state loss where active packet roots have metadata but no canonical continuity surface.
- **Q2 refinement:** The `same-pass-lineage` invariant is now stronger than iteration 2 assumed. It is not just historical debt; it is still violated on freshly updated packets.
- **Q2 refinement:** `packet-identity` normalization is also a current-path risk, not just an archival inconsistency.

# Questions Remaining

- **Q5:** Convert the observed classes into validator policy:
  - P0: active packet root with packet metadata but no canonical root docs
  - migration exception: older freshness skew
  - latent warnings/errors: mixed packet identity formats and null `save_lineage` on fresh packets
- Determine whether the `007`/`010` missing-root-doc state comes from packet scaffolding, a prior migration, or a post-save regeneration gap.
- Reproduce a fresh canonical save into a controlled packet to decide whether `save_lineage` is being dropped at write time or only during later graph regeneration.

# Next Focus

Draft the Q5 validator/migration split from these observations:

1. Promote the missing-root-doc condition to a hard validator failure.
2. Design a migration-tolerant freshness rule that only warns on older packets but tightens for new/fresh saves.
3. Reproduce a fresh save to isolate why `save_lineage` remains null on newly updated packets.
4. Normalize packet identity expectations so continuity, description, and graph layers converge on one packet-relative format.
