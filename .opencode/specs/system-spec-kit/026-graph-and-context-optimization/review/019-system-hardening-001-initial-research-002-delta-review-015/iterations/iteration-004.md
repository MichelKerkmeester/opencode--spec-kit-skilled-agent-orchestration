# Iteration 004

## Focus

Complete the remaining high-confidence P1 audit around graph-metadata laundering, reconsolidation remainder, skill-advisor routing hardening, and save-time validation drift, then start the first deliberate P2 batch on legacy coverage and removed-surface findings that share those same clusters.

## Actions Taken

1. Re-read `iteration-003.md`, `deep-review-state.jsonl`, and the iteration-004 prompt pack to preserve the prior tally, open questions, and residual `UNVERIFIED` clusters.
2. Re-scanned the 015 source report in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/015-deep-review-and-remediation/review-report.md` for the target anchors: `graph-metadata-parser`, `reconsolidation`, `skill_advisor.py`, `save-quality-gate`, and the linked P2 coverage complaints.
3. Verified the current graph-metadata parser in `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`, focusing on legacy fallback import, `migrated: true` marking, derived trigger extraction, and indexable packet text generation.
4. Verified the current reconsolidation state machine in `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`, focusing on predecessor CAS, append-only merge flow, explicit `complement`/`conflict` abort statuses, and complement-window closure.
5. Verified the current skill-advisor routing stack in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, including graph-signal loading, phrase expansion, intent-signal routing, and the remaining fail-open loader paths for unreadable metadata.
6. Verified the current save/create path in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` plus the current save-quality scoring surface in `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`.
7. Cross-checked the addressing commits on current main: `1bdd1ed03` (graph-metadata laundering + packet-search boost), `104f534bd0` (transactional reconsolidation with predecessor CAS + complement window closure), `b28522bea7` + `e009eda0c4` + `678bd9bf52` (skill-advisor routing hardening).

## Findings Batch-Audited

- `7 x P1 / graph-metadata laundering + packet-search boost cluster`  
  Classification: `ADDRESSED`  
  Current-main evidence: `validateGraphMetadataContent()` now fails closed on invalid current-schema payloads, performs a bounded legacy fallback, and stamps migrated imports via `migrated: true` instead of laundering them as current-schema records (`graph-metadata-parser.ts:336-378`). The legacy importer derives fresh trigger phrases from packet/spec folder/summary text (`graph-metadata-parser.ts:249-289`), and the indexable export emits packet and migration metadata directly (`graph-metadata-parser.ts:1204-1239`). This matches the closure intent of `1bdd1ed03`.

- `4 x P1 / reconsolidation complement + duplicate-window remainder`  
  Classification: `ADDRESSED`  
  Current-main evidence: the merge path now captures a predecessor snapshot before the transaction, aborts on stale predecessors, writes the merged survivor append-only, and closes the complement window through the transactional reconsolidation path (`reconsolidation.ts:245-312`, `:678-760`, `:928-990`). That is direct closure for the residual 015 duplicate/complement complaints under `104f534bd0`, not just a later replacement primitive.

- `2 x P1 / skill-advisor routing prefix-collapse cluster`  
  Classification: `ADDRESSED`  
  Current-main evidence: the router now loads graph-derived `intent_signals` and derived trigger phrases from source metadata, normalizes signal variants, and applies the phase-016/026 phrase-boost chain instead of the older collapsed prefix behavior (`skill_advisor.py:149-180`, `:583-625`). The relevant addressing wave is `b28522bea7`, `e009eda0c4`, and `678bd9bf52`.

- `2 x P1 / skill-advisor invisible-discard / fail-open metadata-loader cluster`  
  Classification: `STILL_OPEN`  
  Current-main evidence: `_load_source_graph_signal_map()` and `_load_source_conflict_declarations()` still `continue` on unreadable or corrupt `graph-metadata.json` without surfacing a degraded-health signal (`skill_advisor.py:162-172`, `:208-218`). That means at least part of the 015 "silent drop" complaint is still live on current main.

- `1 x P2 / whitespace-only trigger phrases count as real trigger coverage`  
  Classification: `STILL_OPEN`  
  Current-main evidence: `scoreTriggerQuality()` still uses the raw array length and does not trim/filter whitespace-only phrases before awarding coverage (`save-quality-gate.ts:493-499`), so the exact 015 complaint remains live.

- `6 x P2 / reconsolidation-bridge coverage complaints tied to the pre-016 bridge surface`  
  Classification: `SUPERSEDED`  
  Replacement primitives: transactional reconsolidation, predecessor CAS, append-only lineage in `create-record.ts`  
  Current-main evidence: the save path now records predecessor lineage explicitly and routes append-only writes through `create-record.ts` (`create-record.ts:307-420`), while the old 015 bridge-specific duplicate-window assumptions have been replaced by the transactional reconsolidation contract in `104f534bd0` and the follow-on transaction cleanup in `0ac9cdcba` / `d2c21c654`.

- `5 x P2 / graph-metadata packet-search / legacy key-file drift complaints attached to the pre-016 parser`  
  Classification: `SUPERSEDED`  
  Replacement primitives: migrated-marker import path + derived trigger/key-topic regeneration + stable graph-metadata indexing  
  Current-main evidence: the current parser does not preserve the old legacy shape as-is; it regenerates derived packet metadata and serializes it through the current schema before indexing (`graph-metadata-parser.ts:249-289`, `:1036-1109`, `:1204-1239`). Those P2 complaints now point at a retired parser contract, not the shipping surface.

- `4 x P2 / legacy harness / removed-surface complaints`  
  Classification: `SUPERSEDED`  
  Current-main evidence: this batch includes the 015 complaints whose reviewed surface was the removed bridge-era/manual-harness path rather than a current shipping runtime. On current main the live routing and save flow are the graph-signal router plus append-only save/reconsolidation stack, so the old harness complaints no longer land on an active surface.

## Cumulative Tally

- Findings audited in this iteration: `31`
- Cumulative audited after iteration 004: `96 / 242`
- Cumulative tally: `ADDRESSED=24`, `STILL_OPEN=6`, `SUPERSEDED=53`, `UNVERIFIED=13`
- Remaining unaudited findings after this pass: `146`

## UNVERIFIED Re-Audited

- `5 prior UNVERIFIED items` were re-examined against the now-recovered commit context.
- `3` moved out of `UNVERIFIED`: two graph-metadata attribution items now have direct `1bdd1ed03` closure evidence, and one reconsolidation complement-window item now has direct `104f534bd0` closure evidence.
- `2` moved from `UNVERIFIED` to `STILL_OPEN`: the skill-advisor fail-open metadata loader paths still suppress unreadable/corrupt source metadata without surfacing degraded routing health.
- Residual `UNVERIFIED` count is now `13`, down from `18`.

## Questions Answered

- `Q3` partial: the graph-metadata laundering / packet-search cluster is no longer evidence-limited; it is directly addressed by the phase-016 P0-C composite plus the current migrated-marker parser contract. The reconsolidation complement-window remainder is also directly addressed by the phase-016 predecessor-CAS transaction wave.
- `Q4` started: the first P2 batch shows that many bridge-era and legacy-parser complaints are better classified as `SUPERSEDED`, while the live P2 backlog is narrowing toward a small set of real validation/test gaps.
- `Q5` partial: the current residual backlog is increasingly concrete. The live items carried forward after this iteration are the two `resolveDatabasePaths` boundary findings from iteration 002, the skill-advisor fail-open metadata-loader path, the whitespace trigger-quality gap, and the broader schema/dispatcher coverage gaps around `skill_graph_*`.

## Next Focus

Continue the P2 batch on the remaining coverage-only and schema/dispatcher gaps around `skill_graph_*`, memory-save quality gates, and resume/session handlers. Keep collapsing legacy bridge/parser complaints into `SUPERSEDED`, and only promote findings into the residual restart backlog when there is clear current-main file:line evidence that the issue is still live.
