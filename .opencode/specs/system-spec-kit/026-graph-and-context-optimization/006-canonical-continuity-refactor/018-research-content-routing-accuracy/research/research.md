# Research Synthesis: Content Routing Classification Accuracy

## Scope And Method

This research covered the content router in `.opencode/skill/system-spec-kit/mcp_server/` with writes restricted to this packet's `research/` folder. The investigation stayed read-only and used a synthetic corpus built from the shipped Tier2 prototypes plus targeted test-style samples, because the packet explicitly forbids historical-save reconstruction. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48]

The live router shape is:
- Tier1: hard rules plus heuristic cue scoring.
- Tier2: top-3 prototype similarity.
- Tier3: prompt contract exists, but the canonical save handler currently instantiates `createContentRouter()` without a classifier dependency, so the active save path is effectively Tier1 + Tier2 + penalized Tier2 fallback/refusal. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008]

## Key Findings

### 1. Tier1 hard rules are accurate but not dominant

The code currently ships eight hard Tier1 rules, not seven: structured `decision`, `handover`, `research`, `task_update`, `metadata_only`, plus hard drops for `toolCalls`, transcript wrappers, and placeholder boilerplate. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:28]

On the 132-sample synthetic corpus, those hard rules fired only 14 times, but they were perfect on the observed set:

| Hard rule | Fires | Observed accuracy |
|---|---:|---:|
| `tier1.placeholder.boilerplate` | 9 | 100% |
| `tier1.transcript.wrapper` | 2 | 100% |
| `tier1.structured.decision` | 1 | 100% |
| `tier1.structured.metadata-only` | 1 | 100% |
| `tier1.structured.task-update` | 1 | 100% |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286] [INFERENCE: live execution of dist/lib/routing/content-router.js on the 132-sample synthetic corpus]

The accuracy problem therefore is not hard-rule false positives in the measured set. It is the much larger heuristic zone.

### 2. Tier2 is already essential in the current runtime

The overall corpus result at the shipped thresholds (`0.70 / 0.70 / 0.50`) was:

| Metric | Result |
|---|---:|
| Samples | 132 |
| Overall labeled accuracy | 87.88% |
| Tier2 routes | 64 |
| Refusals | 8 |
| Tier1-only accuracy | 72.73% |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:452] [INFERENCE: live execution of dist/lib/routing/content-router.js on the 132-sample synthetic corpus]

Tier2 therefore is not just a fallback convenience; it recovers a meaningful amount of accuracy from Tier1 misreads even before Tier3 is live.

### 3. The confusion hotspots are narrow and specific

The largest confusion pairs were:

| Confusion pair | Count | Pattern |
|---|---:|---|
| `narrative_delivery -> narrative_progress` | 4 | implementation verbs beat sequencing/gating cues |
| `handover_state -> drop` | 4 | resume notes mention `git diff`, tooling, or recovery-style language |
| `narrative_progress -> research_finding` | 2 | "source of truth" or doc-language sounds like research |
| `handover_state -> task_update` | 2 | abbreviated handover fragments lose state context |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369] [INFERENCE: live corpus misclassification clusters from iterations 5 and 6]

This is why the weakest categories were `handover_state` (`62.5%`) and `narrative_delivery` (`68.75%`), while structured categories remained perfect on the measured corpus. [INFERENCE: live execution of dist/lib/routing/content-router.js on the 132-sample synthetic corpus]

### 4. The merge contract matters as much as the class label

The router's target mapping is deterministic by category, but the write surface is not equally robust:

| Category | Default target | Merge mode | Risk summary |
|---|---|---|---|
| `narrative_progress` | `implementation-summary.md::what-built` | `append-as-paragraph` | low risk, safe no-op dedupe |
| `narrative_delivery` | `implementation-summary.md::how-delivered` | `append-as-paragraph` | low risk, same as progress |
| `decision` (`L3/L3+`) | `decision-record.md::adr-NNN` | `insert-new-adr` | medium risk, depends on healthy ADR anchor container |
| `handover_state` | `handover.md::session-log` | `append-section` | low/medium risk, resilient but still anchor-shape dependent |
| `research_finding` | `research/research.md::findings` | `append-section` | low/medium risk, resilient |
| `task_update` | `tasks.md::<phase-anchor>` | `update-in-place` | highest risk, needs exactly one target checklist line |
| `metadata_only` | `_memory.continuity` frontmatter | `update-in-place` via continuity helper | lowest risk in practice, bypasses anchor merge |
| `drop` | `scratch/pending-route-*.json::manual-review` | `refuse-to-route` | intentional non-merge path |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:918] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:925] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:440] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:627]

`task_update` is the most brittle category because both payload construction and the merge operation require a specific task/checklist identifier and a unique matching line. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:952] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:455]

### 5. `routeAs` is strong override, not soft guidance

`routeAs` is applied after the natural decision is computed. It forces the category and target, raises confidence to at least `0.50`, preserves the original natural decision in `naturalDecision`, and warns when the natural route was `drop`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:428] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:395]

That means override can rescue misclassifications, but it can also intentionally bypass a semantic refusal. The downstream save handler still enforces merge-mode compatibility and target existence, so override is not a bypass around write safety. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1069]

## Threshold Analysis

The current thresholds are not obviously wrong, but the measured tradeoff is not one-dimensional.

Baseline:
- `Tier1=0.70`, `Tier2=0.70`, `fallback/Tier3 floor=0.50`
- `87.88%` accuracy
- 8 refusals

Best measured accuracy point in the tested grid:
- `Tier1=0.75`, `Tier2=0.65`, `fallback/Tier3 floor=0.45`
- `90.15%` accuracy
- 9 refusals

[INFERENCE: threshold sweep over recorded Tier1/Tier2 outputs from the live router]

The improvement comes mainly from routing more borderline delivery cases through Tier2 instead of accepting Tier1 too early. But that same change slightly harms `narrative_progress` and raises refusal count. Changes to `Tier2` and `Tier3` floors mainly shifted refusal counts, while `Tier1` was the dominant accuracy lever in the tested range. [INFERENCE: threshold sweep over recorded Tier1/Tier2 outputs from the live router]

## Recommendations

### Primary recommendation

Keep the shipped `0.70 / 0.70 / 0.50` thresholds for now, because:
- the current runtime does not actually wire Tier3 into canonical saves,
- the measured improvement from higher Tier1 floors is real but comes with more refusals,
- the largest errors are cue/prototype collisions, not broad threshold failure.

### Better next move than threshold-only tuning

Tune cues and prototypes in two places:
- Strengthen `narrative_delivery` cues around sequencing, gating, rollout discipline, and verification order so they beat implementation verbs when appropriate.
- Relax `drop` dominance when strong handover language (`current state`, `next session`, `resume`, `blocker`) coexists with command/tool mentions.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369] [INFERENCE: corpus misclassification clusters]

### If a threshold experiment is still desired

Run a shadow-mode experiment at:
- `Tier1 = 0.75`
- `Tier2 = 0.65`
- fallback floor `0.45` or `0.50`

Treat that as an experiment, not an immediate default change, and measure:
- delivery accuracy gain,
- progress false-refusal cost,
- any increase in manual-review load.

### Tier3-specific recommendation

Do not over-optimize the `0.50` Tier3 threshold until Tier3 is actually wired into `memory-save.ts`. Today it mostly acts as the penalized Tier2 fallback/refusal cutoff, not a live model acceptance floor. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:518]

## Direct Answers To The Packet Questions

1. Tier1 hard-rule accuracy is effectively perfect on the measured hard-rule subset, but those rules cover only 14 of 132 corpus samples. The spec's "7 rules" wording is stale; the code currently has 8 hard rules.
2. Tier1->Tier2 escalation is common: 64 of 132 measured samples used Tier2, driven mostly by `top1_below_0_70`, then `margin_too_narrow`, then `mixed_signals`.
3. The main confusion pairs are delivery-progress and handover-drop, with smaller progress-research and handover-task spillover.
4. The current thresholds are defensible; a stricter Tier1 floor improves measured accuracy slightly but at the cost of more refusals. Threshold-only tuning is weaker than cue/prototype tuning.
5. Merge-mode safety varies by category. `task_update` is the most fragile; `metadata_only` is the safest because it bypasses anchor merge.
6. `routeAs` is a real override that can rescue or force routes, but it still lives under downstream target and merge-mode validation.
