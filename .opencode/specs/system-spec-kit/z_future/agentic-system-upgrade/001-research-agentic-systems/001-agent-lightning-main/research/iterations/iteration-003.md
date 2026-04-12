# Iteration 003 — Structured Reward Signals Versus Scalar Feedback

Date: 2026-04-09

## Research question
Does Agent Lightning's reward-as-span pattern offer a better way to represent evaluator signals than `system-spec-kit`'s current scalar feedback events and confidence updates?

## Hypothesis
Agent Lightning likely preserves richer evaluator meaning than Public does today, but the directly transferable piece will probably be a structured validation payload rather than a full RL reward pipeline.

## Method
I traced how Agent Lightning emits, stores, extracts, and matches rewards across the emitter, runner, adapter, and architecture docs. I then compared that path against Public's current implicit feedback ledger, explicit `memory_validate` schema, confidence tracker, and auto-promotion logic to see whether Public already has an equivalent structured evaluator surface.

## Evidence
- Agent Lightning's `emit_reward()` accepts either a single numeric reward or a multi-dimensional reward dictionary, requires a `primary_key` when the reward is multi-dimensional, and serializes the result into ordered reward dimensions on the span. [SOURCE: external/agentlightning/emitter/reward.py:148-210]
- Reward extraction deliberately preserves one primary reward for downstream consumers: `get_reward_value()` returns the first ordered reward dimension when present. [SOURCE: external/agentlightning/emitter/reward.py:213-226]
- When an agent rollout returns a numeric result, the runner converts that return value into a reward span, assigns a new sequence id, and stores the reward span alongside the trace rather than keeping reward only in process-local memory. [SOURCE: external/agentlightning/runner/agent.py:293-314]
- The adapter side still treats reward as a distinct concern: `Transition` includes a dedicated `reward` field, and `match_rewards()` assigns reward spans to LLM calls using explicit matching policies such as `FIRST_OCCURRENCE` and `FIRST_SIBLING`. [SOURCE: external/agentlightning/adapter/triplet.py:65-82] [SOURCE: external/agentlightning/adapter/triplet.py:522-575]
- The architecture guide makes the design intent explicit: `(state, action, reward)` is the basic learning unit, and reward spans travel through the same store and adapter boundary as the rest of the trace. [SOURCE: external/docs/deep-dive/birds-eye-view.md:308-317]
- Public's implicit feedback ledger records only five event types and a coarse confidence tier (`strong|medium|weak`). It is shadow-only and intentionally has no ranking side effects. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:19-45] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:161-199]
- Public's explicit validation path updates one scalar confidence score and a validation count. Negative feedback decreases confidence, and the result is later consumed as promotion eligibility rather than as a richer evaluator payload. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:96-179]
- Auto-promotion is threshold-based on positive validation counts (`>=5`, `>=10`), again confirming that the current system treats evaluator output as scalar progression rather than structured judgment dimensions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:120-193]
- `memory_validate` currently accepts `wasUseful`, rank/query metadata, session metadata, and notes, but no structured metric bundle or primary-vs-secondary evaluation dimensions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-316]

## Analysis
Agent Lightning does two things that Public does not. First, it preserves evaluator output as a first-class span artifact instead of collapsing it immediately into a single state mutation. Second, it can represent more than one reward dimension while still giving downstream logic a canonical primary score. Public already has the raw places where evaluation enters the system, but those surfaces are split between event logging and confidence mutation, with no shared structured payload.

The important nuance is that Agent Lightning itself still collapses to a scalar reward at the triplet boundary when training logic needs it. That means the transferable pattern is not "keep everything infinitely rich forever"; it is "capture a richer evaluator payload first, then reduce it deliberately." For Public, that would enable future review or research evaluators to record a primary score plus supporting dimensions such as evidence quality, breadth, or confidence calibration before the existing confidence and promotion machinery consumes a derived summary.

## Conclusion
confidence: high

finding: Agent Lightning's reward-as-span pattern is a meaningful upgrade over Public's current validation model because it separates structured evaluator capture from downstream reduction. Public already has validation and feedback plumbing, but it lacks a shared schema for multi-dimensional evaluator output. The best adoption is not RL training itself; it is adding an optional structured evaluator payload that can later be reduced into confidence updates, promotion decisions, or dashboard metrics.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** define a structured evaluator payload shape, decide where it is persisted, and map primary versus supporting metrics into existing confidence and promotion flows
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing Public schema that already captured evaluator outputs as multiple named dimensions, either in `memory_validate`, the feedback ledger, or the confidence tracker, and did not find one. I also checked whether Agent Lightning itself preserved only scalar reward values; instead it preserves multi-dimensional rewards first and reduces later.

## Follow-up questions for next iteration
- Does Agent Lightning's adapter boundary reveal a reusable normalization seam between raw execution artifacts and downstream analysis?
- How much of the Trainer's pluggability is genuinely transferable to Public, versus being training-runtime overhead?
- Can Agent Lightning's selective agent targeting help Public avoid overlap with the generic multi-agent work in phase 005?
