# Iteration 21: Delivery Cue Patch Design

## Focus
Pin down the exact delivery-versus-progress cue strings and regex shapes that should change in phase `001`.

## Findings
1. The current asymmetry is concrete. `scoreCategories()` gives `narrative_progress` an unconditional `0.72` floor for `observations` chunks with implementation verbs and a `0.71` floor for certain `exchanges`, while `narrative_delivery` only gets its floor from rollout nouns such as `feature flag`, `shadow`, `rollout`, `canary`, and `dual-write`. That means a chunk can clearly describe delivery mechanics yet still lose to progress if it says "implemented" or "updated" without those rollout nouns. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:842] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853]
2. The missing delivery lexicon already exists in the shipped prototypes. `ND-01` and `ND-02` use `delivered in three passes`, `only then`, and `closure only happened after`; `ND-03` uses `kept the work pending until` and `awaiting runtime verification`; `ND-04` uses `updated together`, `same-pass`, and `same runtime truth`. None of those strings appear in the current delivery regex or delivery floor. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:54] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:70] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:78]
3. The smallest exact regex additions are two delivery-mechanics bundles:
   - `/\b(only then|updated together|same-?pass|same runtime truth|delivered in (?:two|three|four|\d+|\w+) passes)\b/`
   - `/\b(kept (?:the work )?pending until|closure only happened after|awaiting runtime verification|verification stayed)\b/`
   These phrases come directly from `ND-01` through `ND-04` and are more delivery-specific than the current broad progress verb list. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:54] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:70]
4. The progress floor should be guarded, not removed. A shared `strongDeliveryMechanics` boolean can suppress the `0.72` and `0.71` progress floors when one of the delivery bundles above matches, while leaving plain build/fix narratives untouched. This is the minimum code change that addresses the measured collision without reopening threshold tuning. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853] [INFERENCE: derived from the current floor ordering plus the prototype wording]

## Ruled Out
- Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional.

## Dead Ends
- Treating `same-pass` as sufficient by itself. The overlap spans sequencing, pending-until-verification language, and synchronized-surface wording.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:842`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:54`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:78`

## Assessment
- New information ratio: 0.33
- Questions addressed: RQ-7
- Questions answered: RQ-7

## Reflection
- What worked and why: Reading the live floors and the delivery prototypes side by side was enough to turn a vague "cue asymmetry" diagnosis into exact regex candidates.
- What did not work and why: Counting prototype overlap without tracing the floor logic still understated why progress wins in practice.
- What I would do differently: Save the exact missing strings during the first remediation wave rather than only describing them at the category level.

## Recommended Next Focus
Map the exact handover patterns that are still getting dragged into `drop`, then split hard wrapper cues from softer operational commands.
