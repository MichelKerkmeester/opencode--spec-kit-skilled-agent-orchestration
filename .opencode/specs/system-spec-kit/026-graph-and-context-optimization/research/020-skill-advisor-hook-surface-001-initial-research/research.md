# Skill-Advisor Hook Surface Research Synthesis

## Executive Summary

The 020 skill-advisor hook surface should ship as a contract-first, renderer-first train, not as direct runtime hook wiring. The refined path is:

```text
002 shared-payload advisor contract
  -> 003 advisor freshness and source cache
  -> 004 advisor brief producer and cache policy
  -> 005 renderer and regression harness
  -> 006 Claude hook wiring
  -> 007 Gemini/Copilot hook wiring
  -> 008 Codex integration and hook policy
  -> 009 documentation and release contract
```

The first shippable slice is `002 -> 003 -> 004 -> 005 -> 006`: payload vocabulary, freshness, the core `AdvisorHookResult` producer, renderer fixtures, and one real Claude prompt-time integration. Gemini, Copilot, and Codex follow as parity expansions after the shared renderer is proven.

Proceed with all eight child specs (`002-009`) so dependencies are explicit, but implement `002-006` first. Runtime hooks must wait until the payload contract, source freshness cache, fail-open producer, and normalized renderer tests exist.

Source trail: this synthesis consolidates iterations `001` through `009`; iteration `010` is final polish and convergence only.

## Surface Enumeration

Iteration 001 found that existing Spec Kit hooks are lifecycle and compact-recovery oriented, not prompt-time advisor surfaces. No checked-in runtime currently runs `skill_advisor.py` automatically on every relevant prompt.

| Runtime | Existing trigger evidence | Current behavior | Skill-advisor hook gap |
| --- | --- | --- | --- |
| Claude | `SessionStart`, `PreCompact`, `Stop` in `.claude/settings.local.json` and `hooks/claude/*` | Startup/resume/clear/compact context, compact cache, stop autosave | No registered `UserPromptSubmit`; no advisor prompt hook |
| Gemini | `SessionStart`, `PreCompress`, `BeforeAgent`, `SessionEnd` in `.gemini/settings.json` and `hooks/gemini/*` | Startup context and one-shot compact recovery through JSON `additionalContext` | `BeforeAgent` exists but current code is compact-only, not prompt advisor routing |
| Copilot | `sessionStart` wrapper and Superset `userPromptSubmitted` notification config | Startup banner and external notifications | `userPromptSubmitted` exists as notification evidence, not model-visible advisor injection |
| Codex | Repo docs/tests still model Codex hooks as unavailable | Current repo uses MCP fallback assumptions | Installed Codex evidence later disproved the hookless assumption; repo lacks a Codex adapter |

Important conclusion: `hooks/memory-surface.ts` is not a prompt-submit runtime hook. It can auto-prime at MCP tool dispatch or compaction, but it does not see every user prompt before model execution. The skill-advisor hook must therefore live in runtime prompt-submit adapters, not in existing MCP tool-surface helpers.

Prompt-time candidates:

| Runtime | Candidate event | Research verdict |
| --- | --- | --- |
| Claude | `UserPromptSubmit` | Best first runtime target, but needs a new checked-in adapter and a real fixture/capture |
| Gemini | `BeforeAgent` or prompt-equivalent hook | Viable after renderer exists; must emit JSON `hookSpecificOutput.additionalContext` |
| Copilot | `userPromptSubmitted` command hook | Needs capture proving model-visible injection, not only notification |
| Codex | `UserPromptSubmit` | Viable in modern Codex with `codex_hooks`; needs `hooks/codex/` and dynamic hook-policy detection |

## Pattern Parallel Map

Iteration 002 mapped the existing code-graph startup producer to advisor equivalents. The reusable architecture is producer -> shared payload -> runtime surface.

| Code-graph pattern | Advisor equivalent | Reuse level | Implementation note |
| --- | --- | --- | --- |
| `buildStartupBrief()` | `buildSkillAdvisorBrief(prompt, options)` | Adapt | Same orchestration shape, but prompt-conditioned |
| `StartupBriefResult` | `SkillAdvisorBriefResult` / `AdvisorHookResult` | Adapt | Needs recommendation records, prompt policy, freshness, diagnostics, and metrics |
| `buildGraphOutline()` | `renderAdvisorBrief()` | Adapt | Top recommendation, confidence, uncertainty, freshness, pass/fail, cache state |
| `getGraphFreshness()` | `getAdvisorFreshness()` | New design | Authority is skill inventory and advisor graph/source artifacts, not git-tracked code graph files |
| `trustStateFromGraphState()` | `trustStateFromAdvisorState()` | Direct semantic reuse | Map to `live`, `stale`, `absent`, `unavailable` |
| `createSharedPayloadEnvelope()` | Same helper | Reuse after enum extension | Add first-class producer/source vocabulary before emitting advisor envelopes |
| `coerceSharedPayloadEnvelope()` | Same transport | Reuse after enum extension | Current transport rejects unknown producers |

Advisor freshness should be non-mutating and fast. It should compare:

| Source | Freshness authority |
| --- | --- |
| `.opencode/skill/*/SKILL.md` | Discovery signature from file path, mtime, and size |
| `.opencode/skill/*/graph-metadata.json` | Newer metadata than graph artifact means stale graph signals |
| `skill_advisor.py` and `skill_advisor_runtime.py` | Newer runtime source means stale advisor snapshot |
| `skill_graph_compiler.py` | Newer compiler means graph artifact may be stale |
| `skill-graph.sqlite` | Preferred graph artifact; missing/unreadable maps to absent/unavailable |
| `skill-graph.json` fallback | Degraded/stale fallback, not live, when SQLite is missing |

Public trust mapping:

| Advisor condition | Public trust state |
| --- | --- |
| Fresh source inventory and graph artifact | `live` |
| Usable but older source or degraded health | `stale` |
| Missing inventory/script/artifact with no fallback | `absent` |
| Expected artifact exists but cannot be read, parsed, or reached in budget | `unavailable` |

## Empirical Measurements

Iteration 003 used the 019/004 200-prompt routing corpus for shape and modeled tradeoffs, then ran bounded timing and brief-length samples. It did not run the full 200-prompt benchmark; that remains a required validation gate for `005-advisor-renderer-and-regression-harness`.

Corpus shape:

| Bucket | Count |
| --- | ---: |
| `true_write` | 32 |
| `true_read_only` | 32 |
| `memory_save_resume` | 32 |
| `mixed_ambiguous` | 32 |
| `deep_loop_prompts` | 36 |
| `skill_routing_prompts` | 36 |

Bounded timing sample with semantic search disabled:

| Mode | Result |
| --- | ---: |
| Single subprocess p50 | 52.5 ms |
| Single subprocess p95 | 58.1 ms |
| Single subprocess average | 53.1 ms |
| Batch total for 19 prompts | 294.4 ms |
| Batch average per prompt | 15.5 ms |

Interpretation: per-prompt shell-out is probably too close to the parent p95 <= 50 ms gate. `004` should either introduce a warm/in-process path or explicitly update the performance gate with measured evidence. Runtime children should not paper over this by accepting slow prompt hooks.

Modeled TTL curve, assuming 30 seconds per prompt and Jaccard >= 0.22 for similar prompt pairs:

| TTL | Safe hits | Hit rate | Risky near misses |
| ---: | ---: | ---: | ---: |
| 1 min | 0 | 0.0% | 1 |
| 5 min | 9 | 4.5% | 7 |
| 15 min | 24 | 12.0% | 16 |
| 30 min | 31 | 15.5% | 22 |
| 60 min | 52 | 26.0% | 24 |

Recommended cache policy:

| Cache | TTL | Key | Use |
| --- | ---: | --- | --- |
| Source freshness cache | 15 min | workspace root + advisor source signature | Avoid repeated filesystem/signature work |
| Exact prompt-result cache | 5 min | session-scoped HMAC over canonical prompt + source signature + runtime + threshold config + semantic mode | Optional exact reuse only |
| Similarity cache | none for skipping execution | N/A | May support diagnostics, not result reuse |

Brief-length decision:

| Budget | Verdict |
| ---: | --- |
| 40 tokens | Reject as general output; hides threshold/freshness and can make failed recommendations look valid |
| 60 tokens | Minimum safe prompt-time brief; carries confidence and uncertainty |
| 80 tokens | Default; adds freshness/trust state with low context cost |
| 120 tokens | Hard cap for ambiguity/debug cases; can include top-2 fallback or reason |

Recommended default line:

```text
Advisor: live; use sk-code-opencode 0.95/0.23 pass.
```

For stale output:

```text
Advisor: stale; use sk-code-opencode 0.95/0.23 pass.
```

For no passing recommendation or fail-open output: inject no model-visible advisor brief by default.

## Codex Integration Strategy

Iteration 004 replaced the earlier "Codex has no hooks" assumption with a versioned finding: modern Codex has enough hook evidence for native prompt-time advisor injection, but this repository still lacks a Codex adapter and still hard-codes Codex hook policy as unavailable.

Evidence summary from iteration 004:

| Surface | Status | Use for 020 |
| --- | --- | --- |
| `SessionStart` | Present in local hook config and Codex hook feature evidence | Startup preamble/readiness line |
| `UserPromptSubmit` | Present in local config and supported by `additionalContext` evidence | Primary advisor brief injection surface |
| `PreToolUse` | Likely present in installed binary, but not repo-verified | Defer enforcement until runtime capture proves payload/blocking semantics |
| `PostToolUse` | Likely present, not needed for prompt advisor | Later auditing only |

Codex strategy:

1. Add a first-class adapter under `mcp_server/hooks/codex/`.
2. Parse Codex hook JSON defensively from stdin or argv, because local wrapper evidence showed JSON can be passed as an argument.
3. Emit Codex `UserPromptSubmit` hook output with `hookSpecificOutput.additionalContext`.
4. Update runtime detection so Codex is not always `hookPolicy: "unavailable"`.
5. Keep prompt wrapping as compatibility fallback for older Codex or restricted configs.
6. Do not use Superset notification hooks as the advisor integration; notification proves event observability but not model-visible context injection.

Recommended Codex output shape:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Advisor: live; use sk-code-opencode 0.95/0.23 pass."
  }
}
```

Codex should be child `008`, not a first-slice blocker. It has higher volatility because `codex_hooks` is still marked under development and repo policy detection needs to change.

## Failure Modes + Fail-Open Contract

Iteration 005 defined the core safety contract:

> Skill-advisor hook failures must never block, rewrite, or delay the user prompt beyond the hook timeout budget. Failures become structured diagnostics plus a null advisor brief.

The implementation must distinguish:

1. Hook execution status: `ok`, `skipped`, `degraded`, `fail_open`.
2. Advisor freshness: `live`, `stale`, `absent`, `unavailable`.
3. Recommendation threshold status: passing or not passing confidence/uncertainty gates.

Internal result shape:

```ts
export interface AdvisorHookResult {
  status: 'ok' | 'skipped' | 'degraded' | 'fail_open';
  freshness: 'live' | 'stale' | 'absent' | 'unavailable';
  brief: string | null;
  recommendations: AdvisorRecommendation[];
  diagnostics: AdvisorHookDiagnostics | null;
  metrics: AdvisorHookMetrics;
  generatedAt: string;
}
```

Critical rules:

- `status: "fail_open"` always means `brief: null`.
- `status: "skipped"` means prompt policy intentionally did not run the advisor.
- `status: "degraded"` may inject a brief only with explicit stale/degraded wording and no mandatory language.
- Failed threshold candidates can appear in diagnostics, but they do not produce model-visible context by default.
- Raw prompts, normalized prompts, token lists, and raw advisor stdout/stderr are never logged.

Full error table:

| Error mode | Detection | Hook behavior | Freshness | Retry |
| --- | --- | --- | --- | --- |
| Python missing | spawn/exec `ENOENT` for configured Python | Fail open, no brief, stderr diagnostic | `unavailable` | No prompt retry |
| Advisor script missing | script path absent or file-not-found | Fail open before subprocess | `absent` | No retry until source signature changes |
| Subprocess timeout | child exceeds hook timeout | Kill process, fail open | `unavailable`; stale only for health if valid prior cache exists | No immediate prompt retry |
| Malformed JSON | parse failure or invalid shape | Fail open; record sanitized short sample only | `unavailable` for invocation | No retry |
| Non-zero exit | exit code not zero | Fail open for prompt hook | `unavailable` | No prompt retry |
| SQLite busy/concurrent write | DB lock, incomplete rows, graph mtime changes mid-read | Use prior live snapshot only if source signature matches; otherwise fail open | `stale` with prior snapshot; otherwise `unavailable` | One bounded 75-125 ms retry only if >=500 ms budget remains |
| Process killed by signal | signal set or no exit code | Fail open | `unavailable` | No retry |
| Future network dependency | DNS/connect/read timeout, HTTP/schema/auth failure | Prompt hook must not live-fetch; use precomputed/cache-only data | `stale` if cached inside TTL; otherwise `unavailable` | Background only |
| Advisor health degraded | parsed health says degraded | Allow only parsed, threshold-passing brief with stale/degraded wording | `stale` | No retry |
| No recommendation passes | valid result, all candidates fail thresholds | Usually inject nothing | `live` or `stale` | No retry |
| Unsupported hook input shape | missing prompt/session/cwd after stdin and argv parsing | Fail open | `unavailable` | No retry |

Observability:

| Surface | Requirement |
| --- | --- |
| stdout | Reserved for runtime hook output only |
| stderr | One-line diagnostics, redacted, suppressed when repeated |
| metrics | In-memory counters/histograms by runtime, status, freshness, error code, duration, retries, cache hits |
| health | Optional `advisor_hook_health` or `session_health` advisor section |

## Cross-Runtime Testing + Privacy

Iteration 006 recommended a two-layer test harness:

1. Pure renderer contract tests for `renderAdvisorBrief(result, options)`.
2. Runtime adapter tests for Claude, Gemini, Copilot, and later Codex.

The renderer owns the model-visible text. Runtime adapters own outer transport only. After normalization, each runtime must produce identical advisor context for the same `AdvisorHookResult`.

Required fixtures:

| Fixture | Expected model-visible output |
| --- | --- |
| `livePassingSkill` | 80-token advisor brief |
| `staleHighConfidenceSkill` | Brief includes `Advisor: stale`; no mandatory wording |
| `noPassingSkill` | No model-visible brief by default |
| `failOpenTimeout` | No model-visible brief |
| `skippedShortCasual` | No model-visible brief |
| `ambiguousTopTwo` | 120-token debug/ambiguous form only when enabled |

Normalized runtime output:

```ts
type NormalizedAdvisorRuntimeOutput = {
  runtime: 'claude' | 'gemini' | 'copilot' | 'codex';
  transport: 'plain_stdout' | 'json_additional_context' | 'prompt_wrapper';
  additionalContext: string | null;
  stderrVisible: boolean;
  decision?: 'allow' | 'block' | 'deny';
};
```

Per-runtime assertions:

| Runtime | Assertion |
| --- | --- |
| Claude | Plain model-visible context normalizes to the shared brief |
| Gemini | JSON `hookSpecificOutput.additionalContext` carries the shared brief; plain text stdout is not a passing injection path |
| Copilot | Captured/fixture command-hook output normalizes to the shared brief |
| Codex | JSON `hookSpecificOutput.additionalContext` fixture lands in `008`; optional until adapter exists |

Privacy policy:

| Data | Default handling |
| --- | --- |
| Raw prompt | Never persist, log, snapshot, or put in payload provenance |
| Normalized prompt | Never persist |
| Tokenized prompt | Never persist |
| Prompt fingerprint | Memory-only by default; never shared-payload source ref |
| Exact prompt-result cache | Optional only, 5-minute TTL, HMAC with session secret |
| Source freshness/signature | Safe to persist in hook-state |
| Aggregate diagnostics | Safe to persist if prompt-free |

Prompt policy:

| Prompt class | Policy |
| --- | --- |
| Empty/whitespace | Skip |
| `/help`, `/clear`, `/exit`, `/quit` | Skip |
| Short casual acknowledgements | Skip |
| Explicit skill/command/governance marker | Fire |
| Work-intent verb plus >=3 meaningful tokens | Fire |
| >=20 visible chars plus >=4 meaningful tokens | Fire |
| >=50 visible chars and not casual | Fire |

This is not a single character threshold. It is: explicit marker OR work-intent shape OR length-and-token threshold.

## Implementation Cluster Decomposition

Final decomposition after iteration 10:

| Order | Child | Decision | Depends on | Scope | Effort |
| ---: | --- | --- | --- | --- | ---: |
| 1 | `002-shared-payload-advisor-contract` | Must ship first | `001` | Producer/source vocabulary, advisor metadata, transport tests, privacy rejection rules | 0.5-1 day |
| 2 | `003-advisor-freshness-and-source-cache` | Must ship before producer | `002` | `getAdvisorFreshness()`, source signatures, 15-minute source cache, trust-state adapter | 0.75-1.25 days |
| 3 | `004-advisor-brief-producer-cache-policy` | Must ship before runtime wiring | `002`, `003` | `AdvisorHookResult`, prompt policy, fail-open, renderer input, 80/120 token caps, optional HMAC exact cache | 1.25-2 days |
| 4 | `005-advisor-renderer-and-regression-harness` | Must ship before multi-runtime rollout | `004` | Renderer fixtures, normalized adapter comparators, privacy tests, token caps, 019/004 corpus parity gate | 1-2.25 days |
| 5 | `006-claude-hook-wiring` | First user-visible slice | `004`, `005` | Claude session-prime/readiness plus prompt-time injection | 0.75-1.25 days |
| 6 | `007-gemini-copilot-hook-wiring` | Deferred parity expansion | `004`, `005`, `006` | Gemini JSON adapter and Copilot command-hook adapter with normalized parity | 1.25-2.5 days |
| 7 | `008-codex-integration-and-hook-policy` | Deferred parity expansion | `002`, `004`, `005` | Codex `hooks/codex/`, `UserPromptSubmit`, dynamic hook policy, prompt-wrapper fallback | 1.25-2.25 days |
| 8 | `009-documentation-and-release-contract` | Must ship for release | `006`, `007`, `008` | Setup, disable flags, privacy, failure modes, validation, manual playbook | 0.5-1 day |

Critical path:

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

Parallelism guidance:

- `002` and planning for `003` can overlap, but no runtime payload should emit advisor labels before `002`.
- `006`, `007`, and `008` should not implement independent text before `005`.
- `009` can draft after `004`, but final docs should wait for runtime behavior from `006-008`.

Estimated effort:

| Phase | Children | Estimate |
| --- | --- | ---: |
| Contract and core | `002-005` | 3.5-6.5 days |
| Runtime rollout | `006-008` | 3.25-6 days |
| Documentation/release | `009` | 0.5-1 day |
| Total | 8 children | 7.25-13.5 engineering days |

## Ranked Proposals + Go/No-Go

Ranked proposal order:

| Rank | Proposal | Children | Recommendation |
| ---: | --- | --- | --- |
| 1 | Establish shared-payload advisor contract | `002` | Must ship first |
| 2 | Build freshness/source-cache authority | `003` | Must ship before producer |
| 3 | Create pure renderer and normalized regression harness | `005` | Must ship before runtime adapters |
| 4 | Implement core `buildSkillAdvisorBrief()` producer | `004` | Must ship after `002/003`; use mocks first |
| 5 | Ship Claude first | `006` | First user-visible runtime slice |
| 6 | Deliver docs/release contract | `009` | Draft after `004`, finalize after runtimes |
| 7 | Expand Gemini and Copilot | `007` | Defer from first slice, required for all-runtime parity |
| 8 | Add Codex native hook integration and policy | `008` | Defer until renderer and Claude slice are stable |

Go/no-go matrix:

| Child | Go condition | No-go / defer boundary |
| --- | --- | --- |
| `002` | Valid advisor producer/source or metadata contract compiles; invalid producers and prompt-derived provenance rejected | No runtime child proceeds without it |
| `003` | Freshness probe covers live/stale/absent/unavailable and source cache invalidates on signature changes | `004` no-go without it |
| `004` | Prompt policy, fail-open, token caps, cache policy, and result shape tested without raw prompt persistence | Semantic augmentation may defer if disabled by default |
| `005` | Renderer fixtures, normalized comparators, privacy assertions, token caps, and corpus parity gate exist | Runtime adapters no-go without fixtures |
| `006` | Claude prompt-submit and session-prime/readiness inject only safe briefs and fail open cleanly | If Claude cannot expose prompt-submit context, create wrapper fallback plan |
| `007` | Gemini and Copilot normalize to same renderer content | Defer until `006` passes |
| `008` | Native Codex `UserPromptSubmit` works when hooks enabled; runtime detector becomes dynamic; fallback wrapper tested | Defer until payload/renderer stable |
| `009` | Docs cover setup, flags, failure modes, privacy, validation, runtime behavior | Final docs cannot be dropped |

Rejected ideas:

| Idea | Reason |
| --- | --- |
| `kind: "skill-advisor"` | Confuses producer identity with lifecycle/transport kind |
| Similarity-only result reuse | Too many near misses across overlapping deep-loop/review prompts |
| 40-token-only prompt brief | Hides threshold/freshness and can mislead the model |
| Runtime-specific advisor text | Causes drift; renderer must be shared |
| Prompt fingerprints in provenance | User text fingerprints are not source refs |
| Prompt-time remote fetches | Violates fail-open and latency contract |

## Open Questions Remaining

These are validation or implementation questions, not architecture blockers.

| Question | Owner | Why it remains |
| --- | --- | --- |
| Full 019/004 200-prompt parity and timing run | `005` | Research used bounded measurement; full corpus should be a harness gate |
| Claude `UserPromptSubmit` exact output semantics | `006` | Current repo lacks adapter; needs fixture or runtime capture |
| Copilot model-visible `userPromptSubmitted` behavior | `007` | Existing evidence is notification-oriented |
| Codex `PreToolUse`/`PostToolUse` payload/blocking semantics | `008` or later | Not needed for prompt advice; needed only before enforcement designs |
| Neutral prompt lifecycle kind vs direct runtime rendering | `002` | Direct rendering may be enough; add `kind: "prompt"` only if per-prompt envelopes need generic transport |
| Source-signature storage location | `003` / `004` | Hook-state vs new advisor cache module is implementation detail |
| Disable flag naming | `009` | Parent suggests `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`; runtime docs should confirm per-runtime override needs |
| Current advisor degraded health root cause | `003` / `005` | Should be fixture-pinned; root-cause only if it affects recommendations |
The sequencing question is resolved for handoff: scaffold all child specs `002-009` so dependencies, parity work, and release docs are visible, but implement `002-006` first before parity work in `007-008`.

Question coverage:

| Question | Final answer location |
| --- | --- |
| Q1 Codex prompt hook surface | Codex Integration Strategy |
| Q2 cache TTL | Empirical Measurements |
| Q3 brief length | Empirical Measurements |
| Q4 freshness semantics | Pattern Parallel Map |
| Q5 fail-open modes | Failure Modes + Fail-Open Contract |
| Q6 prompt firing threshold | Cross-Runtime Testing + Privacy |
| Q7 prompt fingerprint privacy | Cross-Runtime Testing + Privacy |
| Q8 cross-runtime snapshots | Cross-Runtime Testing + Privacy |
| Q9 implementation clusters | Implementation Cluster Decomposition |
| Q10 shared-payload interaction | Pattern Parallel Map and Ranked Proposals + Go/No-Go |

Out of scope:

- Rewriting skill-advisor ranking.
- Adding server-side or LLM-backed skill classification.
- Cross-repo skill discovery.
- Multi-turn skill activation analysis.
- PreToolUse enforcement.
- Persisting live prompt histories for analytics.
- Runtime-specific wording experiments before the shared renderer exists.

## Convergence Note

All ten key questions are answered for implementation planning, all child proposals now have concrete name/scope/effort entries, and the final recommendation is stable: scaffold `002-009`, implement `002-006` first, then expand runtime parity through `007-008` and close release docs in `009`.

Iteration 010 is the final budgeted pass. It adds no new architecture discovery (`newInfoRatio: 0.01`) and closes by the configured max-iteration stop condition plus completed `research.md` and cluster mapping. The handoff is ready for the parent 020 implementation phase.
