# Research Synthesis: Content Routing Accuracy And Remediation Design

## Scope And Method

This packet stayed read-only and only updated `research/` artifacts. Iterations 1-10 established the baseline accuracy picture for the current three-tier router; iterations 11-20 investigated how to fix the remaining confusion pairs without changing the overall routing architecture. The analysis used direct source inspection, the shipped prototype corpus, the existing tests, and packet-local lexical comparisons over `routing-prototypes.json`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48]

## Baseline Snapshot From Iterations 1-10

The first wave findings still stand:
- The live router ships eight hard Tier1 rules, not seven. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:280]
- The measured baseline on the 132-sample synthetic corpus was `87.88%` accuracy at the shipped `0.70 / 0.70 / 0.50` thresholds. [INFERENCE: iteration-5 and iteration-9 corpus measurements]
- The strongest confusion pairs were `narrative_delivery -> narrative_progress` and `handover_state -> drop`, each with four observed errors. [INFERENCE: iterations 5-6 corpus analysis]
- The best tested threshold-only alternative (`Tier1=0.75`, `Tier2=0.65`) improved measured accuracy, but at the cost of more refusals and without fixing the underlying cue collisions. [INFERENCE: iteration-9 threshold sweep]
- Tier3 exists as a contract in `content-router.ts`, but the canonical save path does not inject a real classifier today. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008]

That means the second wave did not overturn the earlier conclusions. It translated them into concrete remediation guidance.

## 1. Delivery Versus Progress: What Is Actually Broken

The key asymmetry is inside `scoreCategories()`, not just the regex table.

- `narrative_progress` matches a wide set of implementation verbs such as `implemented`, `merged`, `added`, `built`, `fixed`, `updated`, and `shipped`, then gets an explicit `0.72` floor whenever those verbs appear in an `observations` chunk. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:341] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853]
- `narrative_delivery` only gets narrow rollout-specific phrases such as `feature flag`, `shadow`, `rollout`, `canary`, `dual-write`, `staging`, and `awaiting runtime verification`, plus a small delivery floor when some of those exact words appear. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:345] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859]
- The delivery prototypes rely on more subtle sequencing and gating language that the cue table does not learn today: `updated together`, `only then`, `same pass`, `kept pending until`, `verification stayed`, `auditable`, and other "how we delivered it" phrasing. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:37]

The practical fix for phase `001-fix-delivery-progress-confusion` is:
- Expand `RULE_CUES.narrative_delivery` in [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:345) with sequencing and verification-order language taken directly from `ND-01` through `ND-05`.
- Add a second delivery-biased floor in [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859) for phrases like `only then`, `updated together`, `same pass`, `kept pending until`, and `awaiting runtime verification`.
- Gate or soften the progress override in [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853) when strong delivery cues are present in the same chunk, so delivery can outrank raw implementation verbs.
- Refresh the most ambiguous delivery/progress prototypes in [routing-prototypes.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:37), especially `ND-03`, `ND-04`, and `NP-05`, so the Tier2 corpus reinforces the new boundary instead of repeating the old overlap. [INFERENCE: iteration-12 nearest-neighbor analysis]

## 2. Handover Versus Drop: Why Good Handover Notes Get Refused

The handover problem is caused by one heuristic decision: the router currently treats command-like operational language almost as harshly as transcript wrappers.

- The `drop` cue table lumps together real wrapper signals (`conversation transcript`, `tool telemetry`, `table of contents`) and softer operational phrases like `git diff`, `list memories`, and `force re-index`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369]
- The `drop` score then jumps to `0.92` as soon as a small subset of those patterns appears, including `git diff`. Handover only gets a `0.84` floor for `recent action`, `next safe action`, `current state`, or `resume`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:868] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877]
- The handover prototypes themselves prove why this matters: `HS-01`, `HS-03`, and `HS-04` contain `git diff`, `run the resume command`, and file-review instructions, so the prototype corpus reinforces the same operational overlap the heuristics already struggle with. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83]

The practical fix for phase `002-fix-handover-drop-confusion` is:
- Split `drop` into hard wrappers versus soft operational commands inside [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369). Transcript wrappers, table-of-contents scaffolding, and explicit boilerplate can keep the current hard drop behavior. `git diff`, `list memories`, and similar operator commands should become a lower-weight branch.
- Raise or preserve `handover_state` when strong stop-state language coexists with those softer command mentions. The right seam is [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:868), where the current handover floor can be extended with `next session`, `active files`, `remaining effort`, and other state-first phrases seen in `HS-02` and `HS-05`.
- Keep `extractHardNegativeFlags()` focused on true wrappers and boilerplate, not ordinary command mentions, so mixed-signal escalation remains meaningful. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:904]
- Refresh 1-2 handover prototypes in [routing-prototypes.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83) to be more state-first and less command-first, rather than weakening correctly categorized drop examples. [INFERENCE: iteration-14 prototype-boundary analysis]

## 3. Tier3 Wiring: What Is Missing And What It Will Cost

The Tier3 contract is real, but the runtime implementation is not.

- `createContentRouter()` already accepts `classifyWithTier3` and `cache`, and `resolveTier3Decision()` already knows how to validate, cache, and incorporate the result. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:630]
- `memory-save.ts` never injects those dependencies. The current call in [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008) constructs the router with no arguments, which hardwires `classifyWithTier3` to a null-returning stub. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:391]
- There is no production Tier3 client anywhere else in the repo. The only reusable pattern is the OpenAI-compatible `fetch()` wrapper in [llm-reformulation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185), which already handles env-based endpoint configuration, timeout, aborts, and fail-open behavior.

The practical fix for phase `003-wire-tier3-llm-classifier` is:
- Add a small classifier adapter that builds the Tier3 prompt via [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128), sends it to an OpenAI-compatible endpoint, and returns `Tier3RawResponse | null`.
- Inject that adapter into the router constructor at [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008), along with a cache implementation so repeated ambiguous chunks can reuse the existing session/spec-folder cache logic.
- Keep the integration fail-open. If the endpoint is missing, slow, or invalid, the current Tier2 fallback path should remain the runtime behavior.

Expected latency and cost impact:
- The contract is intentionally bounded: `gpt-5.4`, `reasoningEffort: low`, `temperature: 0`, `maxOutputTokens: 200`, `timeoutMs: 2000`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:12]
- Tier3 only runs on the ambiguous tail after Tier1 and Tier2 fail to accept, so the additional model call is not on every save. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470]
- Repeated identical chunks can become zero-cost after the first call because of the existing cache. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:640]
- The main operational risk is latency, not token volume, because `memory-save.ts` normalizes markdown before routing but does not hard-cap chunk length prior to Tier3. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:806] [INFERENCE: live save chunks are not length-capped before Tier3]

## 4. Prototype Quality: Balanced, But Not Well Separated

`routing-prototypes.json` is healthy by count and unhealthy by semantic spacing.

- Each category has five examples, so coverage is even. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1]
- Delivery and progress still share a large amount of vocabulary, and handover and drop are closer than they should be in operational language. [INFERENCE: packet-local lexical overlap and nearest-neighbor scans from iterations 12 and 14]
- `negativeHints` are present on every prototype, but the live router does not currently use them anywhere in heuristic or Tier2 scoring. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:151]

That means the right prototype fix is targeted:
- Adjust a few delivery and handover examples so they become stronger anchors for their categories.
- Leave the rest of the corpus stable so the post-fix benchmark measures cue/prototype improvements, not a wholesale library rewrite.

## 5. Test Coverage: Happy Paths Exist, Regression Coverage Does Not

The current tests prove the router API shape, but they do not defend the failure modes the research found.

- `content-router.vitest.ts` has one positive-path test per category, several Tier3 contract/cache tests, and one override-against-drop test. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48]
- It does not have regression cases for:
  - delivery text that also contains implementation verbs,
  - handover text that also contains `git diff` or restart-command language,
  - research/metadata overlap,
  - decision/research or task/handover adversarial boundaries. [INFERENCE: iteration-18 test audit]
- `handler-memory-save.vitest.ts` only proves routed behavior when `routeAs` is explicitly provided, so it does not currently verify the natural routing path where Tier3 would be wired. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1076]

The implementation phases should therefore add:
- Router-level regression tests for the two measured confusion seams.
- At least one handler-level natural-routing test that reaches Tier3 and one that proves safe fallback when the classifier returns `null` or times out.

## Implementation Guidance By Phase

### Phase 001: `001-fix-delivery-progress-confusion`

Primary code targets:
- [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:345)
- [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:853)
- [routing-prototypes.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:37)
- [content-router.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:65)

Change description:
- Expand delivery cues with sequencing, gating, same-pass, and verification-order language.
- Add a delivery-biased floor when those phrases are present.
- Prevent the progress floor from automatically winning when strong delivery cues coexist.
- Refresh 2-3 ambiguous delivery/progress prototypes.
- Add regression tests for ambiguous delivery chunks that currently look like implementation summaries.

### Phase 002: `002-fix-handover-drop-confusion`

Primary code targets:
- [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:353)
- [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877)
- [routing-prototypes.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:83)
- [content-router.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:110)

Change description:
- Split hard drop wrappers from soft operational commands.
- Let strong stop-state and resume language outrank soft command mentions.
- Keep true transcript and boilerplate wrappers as hard drops.
- Refresh 1-2 handover prototypes so they lead with state, blockers, and next safe action rather than commands.
- Add regression tests where handover coexists with `git diff`, restart instructions, or file-review lists.

### Phase 003: `003-wire-tier3-llm-classifier`

Primary code targets:
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008)
- [content-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128)
- [llm-reformulation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185)
- [handler-memory-save.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1076)

Change description:
- Implement a real Tier3 classifier adapter using the existing prompt contract.
- Inject it into the canonical save-path router.
- Reuse timeout, abort, and env-based configuration patterns from the existing OpenAI-compatible helper.
- Preserve fail-open fallback behavior and expose audit visibility for latency/cache hits.
- Add natural-routing handler tests plus router tests for timeouts, null responses, and cache reuse.

## Final Recommendation

Implement the phases in this order:
1. `001-fix-delivery-progress-confusion`
2. `002-fix-handover-drop-confusion`
3. `003-wire-tier3-llm-classifier`

Then rerun the same synthetic corpus and targeted regression tests as a before/after benchmark. The research no longer points to a threshold-first fix. It points to cue tuning, prototype sharpening, and missing save-path wiring.
