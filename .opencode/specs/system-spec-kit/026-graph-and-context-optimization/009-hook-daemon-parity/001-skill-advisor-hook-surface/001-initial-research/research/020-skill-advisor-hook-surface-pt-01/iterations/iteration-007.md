# Iteration 007 - Implementation Cluster Decomposition and Shared-Payload Decision

## Focus

Answer the remaining architecture-planning questions for the 020 skill-advisor hook surface:

- Q9: how should the parent proposal decompose into implementation children?
- Q10: what, if anything, must phase 018/R4 shared-payload carry for a first-class skill-advisor brief?

This iteration treats the prior six iterations as settled inputs. The decomposition below is a shipping graph, not just a file list: every child has a clear unblocker relationship, effort estimate, and first-shippable surface.

## Source Evidence

- The parent 020 plan originally reserved seven children: advisor brief producer, Claude wiring, Gemini wiring, Copilot wiring, Codex integration, freshness signal, and documentation. It explicitly said exact child numbering and count would be determined by research convergence. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/plan.md:129-137`]
- The parent spec requires a compact advisor brief with top skill, confidence, uncertainty, freshness, cache state, shared-payload transport, cross-runtime parity, the 019/004 200-prompt corpus, and fail-open behavior. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:109-128`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:136-151`]
- Iteration 002 found that `getAdvisorFreshness()` must compare skill inventory, graph metadata, advisor runtime/script sources, and graph artifacts, then map to `live|stale|absent|unavailable`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md:31-34`]
- Iteration 003 recommended a 15-minute source cache, a 5-minute exact prompt-result cache, an 80-token target brief, and a 120-token hard cap. It also showed that the 40-token brief is unsafe because it hides threshold and freshness state. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-003.md:91-163`]
- Iteration 004 answered Q1: modern Codex has native hook evidence including `UserPromptSubmit`, but this repository still needs a first-class `hooks/codex/` adapter and dynamic Codex hook-policy detection. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-state.jsonl:5`]
- Iteration 005 defined the typed `AdvisorHookResult`, fail-open matrix, bounded retry policy, and the rule that `status: "fail_open"` always means `brief: null`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-005.md:83-236`]
- Iteration 006 answered Q6, Q7, and Q8: use marker-aware prompt thresholds, memory-only prompt fingerprints by default, opt-in 5-minute HMAC exact cache if persisted, and normalized runtime-output tests instead of raw snapshot equality. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-006.md:31-206`]
- The current shared-payload contract allows `kind` values `startup`, `resume`, `health`, `bootstrap`, and `compaction`; section sources are `memory`, `code-graph`, `semantic`, `session`, or `operational`; producer values do not include a skill-advisor producer. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:10-18`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:187-206`]
- Runtime coercion rejects unknown envelope kinds, producers, and trust states, and existing transport tests already assert rejection of invalid producer values. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:126-163`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:168-180`]
- The code-graph startup brief already creates a `kind: "startup"` envelope with `producer: "startup_brief"`, sections, trust state, and source refs. The advisor should mirror that shape without pretending advisor identity belongs in the lifecycle `kind`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:200-257`]

## Part A - Refined Child Decomposition (Q9)

### Final Recommendation

Replace the parent's provisional 7-child plan with **8 implementation children after 001-initial-research**:

| Order | Child | Action vs parent proposal | Effort | Depends on | Ships / unblocks |
| ---: | --- | --- | --- | --- | --- |
| 1 | `002-shared-payload-advisor-contract` | Add new prerequisite child | 0.5-1 day | 001 research | Enables all first-class advisor envelopes and prevents runtime hooks from emitting labels the transport rejects. |
| 2 | `003-advisor-freshness-and-source-cache` | Move parent `007-freshness-signal` earlier and split source-cache work into it | 0.5-1 day | 002 | Provides `getAdvisorFreshness()`, source signatures, 15-minute source cache, and trust vocabulary for the brief producer. |
| 3 | `004-advisor-brief-producer-cache-policy` | Rename/expand parent `002-advisor-brief-producer` | 1.5-2.5 days | 002, 003 | Builds `buildSkillAdvisorBrief()`, `AdvisorHookResult`, renderer, prompt policy, fail-open handling, 80-token/120-token brief caps, and 5-minute exact HMAC cache path. |
| 4 | `005-advisor-renderer-and-regression-harness` | Add new test/harness child | 1-2 days | 004 | Creates renderer fixtures, normalized runtime-output comparisons, privacy assertions, and 019/004 corpus parity gates. Runtime children depend on this to avoid drift. |
| 5 | `006-claude-hook-wiring` | Keep parent Claude child, but make it the first user-visible runtime slice | 0.75-1.5 days | 004, 005 | Wires session-prime plus UserPromptSubmit for Claude and proves the prompt-time path before multi-runtime rollout. |
| 6 | `007-gemini-copilot-hook-wiring` | Merge parent Gemini and Copilot children | 1.5-2.5 days | 004, 005, 006 | Applies the proven adapter pattern to Gemini JSON `additionalContext` and Copilot hook surfaces with normalized parity tests. |
| 7 | `008-codex-integration-and-hook-policy` | Keep parent Codex child, expand scope for policy detection | 1-2 days | 002, 004, 005 | Adds `hooks/codex/`, native UserPromptSubmit integration where available, and fallback/policy detection for older Codex installations. |
| 8 | `009-documentation-and-release-contract` | Renumber parent documentation child | 0.5-1 day | 006, 007, 008 | Documents hook contract, disable flags, failure modes, privacy boundary, runtime setup, and manual verification. |

### Why This Diff From the Parent Plan

| Parent child | Refined outcome | Rationale |
| --- | --- | --- |
| `002-advisor-brief-producer` | Becomes `004-advisor-brief-producer-cache-policy` | The producer cannot be safely built before payload vocabulary and freshness/source signatures exist. It also needs fail-open, prompt-policy, and cache rules from iterations 3, 5, and 6. |
| `003-claude-hook-wiring` | Stays separate as `006-claude-hook-wiring` | Claude is the fastest first visible integration and should prove prompt-time injection before other runtimes follow. |
| `004-gemini-hook-wiring` | Merged into `007-gemini-copilot-hook-wiring` | Gemini and Copilot both consume existing compact/session hook infrastructure and should be parity-tested together after Claude proves the renderer. |
| `005-copilot-hook-wiring` | Merged into `007-gemini-copilot-hook-wiring` | Same reason: keep adapter differences explicit inside one parity child, not two near-duplicate children. |
| `006-codex-integration` | Becomes `008-codex-integration-and-hook-policy` | Iteration 4 turned Codex from "maybe hookless" into "native hook candidate plus repository policy gap"; it deserves a dedicated adapter/policy child. |
| `007-freshness-signal` | Moves earlier as `003-advisor-freshness-and-source-cache` | Freshness is not an optional late feature. It is required for safe brief wording, cache invalidation, and shared-payload trust state. |
| `008-documentation` | Becomes `009-documentation-and-release-contract` | Docs should land after runtime behavior is real, but contract notes can be drafted while runtime children are in review. |
| None | Add `002-shared-payload-advisor-contract` | Current transport rejects unknown producers; runtime hooks must not emit advisor envelopes until the contract is intentionally extended. |
| None | Add `005-advisor-renderer-and-regression-harness` | The normalized cross-runtime harness is the guard that lets runtime wiring stay small and prevents raw snapshot drift. |

## Critical Path and Dependencies

```text
001 research
  -> 002 shared-payload advisor contract
      -> 003 advisor freshness and source cache
          -> 004 advisor brief producer/cache/fail-open
              -> 005 renderer + corpus regression harness
                  -> 006 Claude hook wiring
                      -> 007 Gemini/Copilot hook wiring
                  -> 008 Codex integration and hook policy
                      -> 009 documentation and release contract
```

### Parallelism

- `002` and early planning for `003` can start together, but `003` should not publish a payload until `002` defines the producer/source vocabulary.
- `006`, `007`, and `008` should not start implementation before `005` establishes normalized output fixtures. Otherwise each runtime will invent slightly different text and tests.
- `009` can draft operator docs after `004`, but final docs should wait until `006-008` confirm actual runtime commands and failure messages.

### First Shippable Slice

The first user-visible slice should be:

```text
002 -> 003 -> 004 -> 005 -> 006
```

That ships a safe Claude prompt-time advisor path with:

- first-class payload vocabulary,
- live/stale/absent/unavailable freshness,
- fail-open behavior,
- privacy-safe prompt fingerprint rules,
- renderer tests, and
- one real runtime integration.

Gemini, Copilot, and Codex then become parity expansions rather than first-time architecture work.

## Effort Summary

| Phase | Children | Estimate |
| --- | --- | ---: |
| Contract and core | 002-005 | 3.5-6.5 days |
| Runtime rollout | 006-008 | 3.25-6 days |
| Documentation/release | 009 | 0.5-1 day |
| Total | 8 children | 7.25-13.5 engineering days |

The range assumes one engineer, existing test/build tooling, and no new advisor algorithm work. It does not include extended manual testing time across installed local CLI versions.

## Part B - Shared-Payload Extension Decision (Q10)

### Decision

Do **not** add `kind: "skill-advisor"`.

The current envelope `kind` is a lifecycle/transport category: `startup`, `resume`, `health`, `bootstrap`, or `compaction`. A skill-advisor brief is a producer and section, not a lifecycle. Adding `kind: "skill-advisor"` would mix producer identity into the transport lifecycle and make `opencode-transport` routing less clear.

Use this model instead:

1. Add a producer value: `skill_advisor_brief`.
2. Add a section source value: `advisor` if the team wants explicit source typing; otherwise use `operational` for the first implementation and reserve `advisor` for a later typed-source cleanup.
3. Use `kind: "startup"` only when the advisor section is included in a session-start composite payload.
4. For prompt-time `UserPromptSubmit` output, prefer the runtime adapter's direct `additionalContext` renderer unless the implementation child adds a neutral prompt-lifecycle kind such as `prompt` or `turn`. If a new prompt lifecycle is added, it should be named for the lifecycle, not the producer.

### Why Not `kind: "skill-advisor"`

| Option | Result | Decision |
| --- | --- | --- |
| `kind: "skill-advisor"` | Producer identity becomes a payload lifecycle. Transport consumers now need special cases for one producer. | Reject. |
| Reuse `kind: "startup"` for all advisor briefs | Easy, but inaccurate for per-prompt submissions after session start. | Use only for session-start composite payloads. |
| Add `producer: "skill_advisor_brief"` with an advisor section | Matches existing `startup_brief` pattern and keeps validation strict. | Accept. |
| Add neutral prompt lifecycle kind later | Accurate if per-prompt payloads must be persisted/coerced through shared-payload transport. | Conditional follow-up in `002`. |

### Fields the Envelope Lacks Today

The existing envelope already carries:

- `provenance.producer`
- `provenance.sourceSurface`
- `provenance.trustState`
- `provenance.generatedAt`
- `provenance.lastUpdated`
- `provenance.sourceRefs`
- optional `sanitizerVersion`
- optional `runtimeFingerprint`
- section `key`, `title`, `content`, `source`, and `certainty`

That is enough for generic provenance, but not enough for structured advisor test assertions. The advisor producer needs structured metadata somewhere beside the display string. Recommended addition for `002`:

```ts
export interface AdvisorPayloadMetadata {
  status: 'ok' | 'skipped' | 'degraded' | 'fail_open';
  promptPolicyReason:
    | 'empty'
    | 'control_command'
    | 'short_casual'
    | 'explicit_marker'
    | 'governance_marker'
    | 'work_intent'
    | 'length_and_tokens'
    | 'long_prompt'
    | 'below_threshold';
  topSkill: string | null;
  recommendationKind: 'skill' | 'command' | null;
  confidence: number | null;
  uncertainty: number | null;
  passesThreshold: boolean;
  cacheHit: boolean;
  cacheKind: 'none' | 'source' | 'exact_prompt';
  sourceSignature: string | null;
  errorCode: string | null;
}
```

There are two acceptable implementation shapes:

1. Add `advisor?: AdvisorPayloadMetadata` to `SharedPayloadSection`.
2. Add a generic `metadata?: Record<string, unknown>` to `SharedPayloadSection` and validate advisor metadata inside the advisor producer helper.

The first is stricter and easier to test. The second is more extensible but needs producer-specific validators to avoid dumping arbitrary hook diagnostics into payloads.

### Required Vocabulary Changes

`002-shared-payload-advisor-contract` should update and test:

- `SHARED_PAYLOAD_PRODUCER_VALUES`: add `skill_advisor_brief`.
- `SharedPayloadSection.source`: add `advisor` or explicitly document `operational` as the advisor source for the first release.
- Transport/coercion tests: accept the new producer only when the payload shape is valid.
- Privacy tests: reject prompt text, normalized prompt text, token lists, and `promptFingerprint:*` in advisor payload provenance/source refs.
- Runtime tests: validate that `trustState` remains one of `live|stale|absent|unavailable` for advisor payloads, even though the wider shared-payload vocabulary still contains legacy values for other producers.

### Q10 Answer

The shared-payload envelope needs extension, but not via `kind: "skill-advisor"`.

Add a first-class advisor producer plus structured advisor section metadata. Reuse `kind: "startup"` only for session-start composite envelopes. For per-prompt submissions, either render direct runtime `additionalContext` from `AdvisorHookResult` or add a lifecycle-named prompt kind in the contract child. Do not encode advisor identity in `kind`.

## Findings

1. Q9 answer: the implementation should decompose into eight children after research, not the parent-proposed seven. The new children are payload-contract and renderer/regression-harness; Gemini and Copilot merge; freshness moves before the core producer.
2. The critical path is payload vocabulary -> freshness/source cache -> core brief producer -> renderer/regression harness -> runtime wiring.
3. Claude should be the first user-visible runtime slice because it proves prompt-time advisor injection with the smallest adapter surface.
4. Codex should remain a dedicated child because iteration 4 found native hook evidence but this repository still lacks adapter and dynamic hook-policy support.
5. Q10 answer: add `producer: "skill_advisor_brief"` and advisor metadata; do not add `kind: "skill-advisor"`.
6. The existing envelope lacks structured advisor metadata for status, prompt-policy reason, threshold pass/fail, cache kind, source signature, and error code.
7. Privacy constraints must be enforced in the payload helper: prompt text, normalized prompt text, token lists, and prompt fingerprints are not provenance source refs.

## Next Focus

Iteration 8 should reconcile the cache/brief empirical answers into a final implementable recommendation:

- confirm whether Q2/Q3 need another full-corpus measurement pass or are sufficiently answered by iteration 3's bounded measurements,
- decide which 020 child owns the 200-prompt parity run,
- prepare the final research synthesis outline with open-risk callouts.

## Ruled Out

- A `kind: "skill-advisor"` shared-payload lifecycle. It conflates producer identity with transport lifecycle.
- Deferring freshness to a late child. The brief producer needs freshness and source signatures to avoid unsafe wording.
- Letting each runtime child define its own advisor text. The renderer and normalized regression harness must come before runtime wiring.
- Persisting prompt fingerprints or prompt-derived terms in payload provenance.
