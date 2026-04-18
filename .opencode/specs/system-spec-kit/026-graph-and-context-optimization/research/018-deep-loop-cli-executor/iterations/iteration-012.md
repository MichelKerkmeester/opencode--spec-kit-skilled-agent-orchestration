# Iteration 012

## Focus

Q1: two-batch 16-folder metadata refresh ordering invariants. Inspect whether the Phase 017 freshness rollout introduced durable `description.json.lastUpdated` versus `graph-metadata.json.derived.last_save_at` inconsistencies, and separate true clock-skew/race explanations from intentional one-sided refresh behavior.

## Actions Taken

1. Re-anchored on the active deep-loop context in `deep-research-strategy.md`, `deep-research-state.jsonl`, and iterations 009 through 011 to confirm that Q1 was the next highest-priority unanswered question.
2. Sampled live `026-graph-and-context-optimization` sibling metadata across all numbered folders to compare `description.json.lastUpdated`, `graph-metadata.json.derived.last_save_at`, and current packet status.
3. Read the Phase 017 packet evidence trail in `017-review-findings-remediation/spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` to reconstruct what T-CNS-03 and the H-56-1 cascade actually changed.
4. Read the current writer implementations in `scripts/core/workflow.ts`, `scripts/spec-folder/generate-description.ts`, `scripts/graph/backfill-graph-metadata.ts`, and `mcp_server/lib/graph/graph-metadata-parser.ts` to determine whether same-pass description and graph refresh are enforced by code.
5. Read the rollout commits `176bad2b2f` and `8859da9cd0` via `git show` to verify batch composition and whether either batch refreshed both metadata surfaces together.

## Findings

### P1. The claimed "16-folder sweep" was not one synchronized refresh; it was a heterogeneous two-batch rollout with different invariants

Reproduction path:
- Read `017-review-findings-remediation/tasks.md` around `T-CNS-03`.
- Read `017-review-findings-remediation/implementation-summary.md` around the Wave C rollout summary.
- Run `git show --stat --summary 176bad2b2 -- .opencode/specs/system-spec-kit/026-graph-and-context-optimization`.
- Run `git show --stat --summary 8859da9cd -- .opencode/specs/system-spec-kit/026-graph-and-context-optimization`.

Evidence:
- `implementation-summary.md` says T-CNS-03 was a one-time manual `jq`-driven `lastUpdated` refresh across 11 stale or missing folders, while the H-56-1 cascade had already refreshed 7 others via actual `/memory:save` side effects.
- Commit `176bad2b2f` touched only 11 sibling `description.json` files and did not refresh sibling `graph-metadata.json` files.
- Commit `8859da9cd0` documents a separate earlier cascade driven by canonical saves and a much wider 38-folder description refresh, not a single 16-folder transactional sweep.

Why this matters:
- The packet language sometimes reads like a single freshness proof, but the shipped rollout used two different mechanisms with different guarantees.
- That means the resulting tree never had one uniform invariant for `description.lastUpdated` versus `graph.derived.last_save_at`; some folders were refreshed by canonical saves, others by description-only surgery.

Risk-ranked remediation candidates:
- P1: rewrite the future Phase 019+ scoping language to treat the rollout as a two-mechanism freshness closure, not a synchronized sweep.
- P2: add an explicit provenance field or audit record that distinguishes `canonical_save`, `description_only_backfill`, and `graph_only_refresh`.

### P1. The observed mixed polarity is structural, not evidence of clock skew: one tool can advance description alone and another can advance graph alone

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1334-1440`.
- Read `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:189-227`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1041-1189`.
- Compare with the live sibling sample for `001` through `019`.

Evidence:
- Canonical save serializes `description.json` updates under `withSavePfdLock(...)`, writes `lastUpdated = new Date().toISOString()`, and only afterwards calls `refreshGraphMetadata(...)`.
- The standalone graph backfill and refresh helpers can refresh `graph-metadata.json` without touching `description.json`.
- The T-CNS-03 manual sweep did the opposite: it advanced `description.json` without touching graph metadata.
- Current sibling state shows both directions:
  - `001` through `006` and `011` have graph newer than description by roughly 18 to 20 hours.
  - `007` through `010` and `013` still have description newer than graph, with the `007` through `010` group lagging graph by roughly 4 days.

Why this matters:
- The inconsistency does not require a race or wall-clock skew to appear. It is a direct consequence of the repo exposing independent description-only and graph-only refresh paths.
- Q1 is therefore best answered as a contract-design problem: the system has no same-pass coupling guarantee for the two metadata surfaces.

Risk-ranked remediation candidates:
- P1: define a same-pass metadata contract for canonical freshness claims, for example a shared save token or mirrored `derived.last_description_sync_at`.
- P1: prohibit future "freshness closure" sweeps from using description-only edits unless graph metadata is refreshed in the same pass.
- P2: narrow manual maintenance scripts so they explicitly declare whether they are one-sided refreshes instead of silently appearing equivalent to canonical saves.

### P1. There is still no durable proof that graph metadata and description metadata were refreshed together in the same pass

Reproduction path:
- Search the codebase for `last_description_sync_at`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`.
- Read `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`.

Evidence:
- `rg -n "last_description_sync_at" .opencode/skill/system-spec-kit` returns no hits.
- `deriveGraphMetadata(...)` always stamps `derived.last_save_at = nowIso`, but the schema contains no companion description-sync timestamp.
- `generate-description.ts` preserves only a narrow subset of existing description fields in explicit-description mode (`memorySequence` and `memoryNameHistory`) and does not coordinate with graph metadata at all.

Why this matters:
- Even when the current timestamps look close, the repo cannot prove whether they came from the same operation or from separate one-sided maintenance steps.
- This is the missing invariant underneath both the T-CNS-03 rollout ambiguity and the rich-content overwrite follow-up from Q2.

Risk-ranked remediation candidates:
- P1: add a shared provenance field or save-run identifier written by both metadata writers when they participate in the same canonical save.
- P2: teach validation and reporting surfaces to distinguish "same-pass fresh" from "independently fresh enough."

### P2. The current validator posture masks half of the mismatch surface instead of diagnosing it

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts:233-279`.
- Compare the validator rule to the live sibling sample and the T-CNS-03 commit shape.

Evidence:
- The validator warns only when the continuity timestamp is older than graph metadata by more than 10 minutes.
- When the delta is negative, it reports `clock_drift` and passes.
- That means the exact asymmetry created by T-CNS-03 style description-only updates is treated as benign rather than flagged as an ordering mismatch.

Why this matters:
- The validator cannot distinguish real clock drift from one-sided manual metadata surgery.
- This helps explain why the Phase 017 packet could claim freshness closure while the tree still carries mixed-polarity metadata deltas today.

Risk-ranked remediation candidates:
- P2: keep the one-sided continuity warning if needed, but add a second diagnostic for "independent metadata surfaces disagree on refresh direction."
- P3: avoid using the word `clock_drift` unless the system actually has evidence of clock skew rather than independent refresh channels.

## Questions Answered

- Q1 is answered with an important nuance: the current inconsistency pattern is real, but it is not best explained as clock skew or an intra-save race.
- The stronger explanation is structural:
  - the rollout was two-batch and used two different mechanisms
  - canonical save writes description first and graph second
  - standalone tools can refresh graph without description
  - T-CNS-03 refreshed description without graph
- Result: the repo has no durable same-pass proof for `description.json.lastUpdated` versus `graph-metadata.json.derived.last_save_at`, so mixed polarity is expected over time.

## Questions Remaining

- Q2 remains open in depth: exactly which rich `description.json` fields need preservation semantics, and should preservation happen in `generate-description.ts`, the workflow caller, or both?
- A follow-on design question remains for Phase 019+: should metadata freshness be asserted by timestamp proximity at all, or should the system move to a shared provenance marker that makes one-sided refreshes explicit?
- It is still worth checking whether any documented operator playbooks or scripts outside Phase 017 encourage description-only freshness sweeps that would reintroduce the same mismatch pattern.

## Next Focus

Return to Q2 and deepen the preserve-field analysis for `generate-description.js`. Focus on the exact overwrite paths, which rich fields are currently lost, and the safest mitigation pattern that preserves hand-authored content without blocking canonical regeneration.
