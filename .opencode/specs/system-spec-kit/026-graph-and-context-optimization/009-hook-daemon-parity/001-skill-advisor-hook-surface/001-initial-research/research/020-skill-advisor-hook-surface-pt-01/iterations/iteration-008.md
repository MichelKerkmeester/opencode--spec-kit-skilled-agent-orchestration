# Iteration 008 - Ranked Proposal Synthesis and Validation Plan

## Focus

Pull iterations 1-7 into an implementation-ready synthesis outline without writing the final `research.md` yet. This pass ranks proposals by expected lift, blast radius, and implementation risk; assigns go/no-go guidance per refined child; and turns the remaining uncertainties into explicit iteration 9/10 follow-ups.

## Source Evidence

- Iteration 003 intentionally did not execute the full 200-prompt benchmark; it used corpus shape, bounded subprocess timings, TTL modeling, confidence-pair sampling, and brief-length examples to answer Q2/Q3 enough for architecture planning. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-003.md:5`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-003.md:181`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-003.md:190`]
- Iteration 004 changed the Codex assumption: modern Codex has enough `UserPromptSubmit` evidence for native prompt-time advisor injection, while this repo still lacks a Codex adapter and dynamic hook policy. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-004.md:83`]
- Iteration 005 resolved the fail-open contract: hook execution status, advisor freshness, and recommendation pass/fail must stay separate; `fail_open` never injects model-visible advisor context. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-005.md:224`]
- Iteration 006 resolved the privacy and test strategy: use marker-aware prompt thresholds, memory-only prompt fingerprints by default, and normalized cross-runtime adapter comparisons. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-006.md:280`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-006.md:284`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-006.md:288`]
- Iteration 007 replaced the parent provisional child list with eight children after research and made payload contract, freshness, producer, renderer harness, then runtime wiring the critical path. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-007.md:27`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-007.md:56`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-007.md:76`]
- Iteration 007 also rejected `kind: "skill-advisor"` and chose producer identity plus structured advisor metadata instead. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/iterations/iteration-007.md:188`]
- Parent acceptance still requires the 019/004 200-prompt corpus, cross-runtime snapshots, p95 latency budget, and token budget verification. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:163`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:168`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:175`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:194`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/spec.md:195`]

## Ranking Method

Ranking uses this interpretation of "blast radius x lift x risk":

- Prefer high lift with low blast radius and low implementation risk.
- Ship contract and test scaffolding before runtime adapters because those reduce downstream risk.
- Defer high-blast runtime parity slices until the first runtime proves the producer and renderer contracts.

Scoring scale:

- Blast radius: 1 = localized contract/test change, 5 = touches multiple runtime integrations.
- Lift: 1 = mostly cleanup, 5 = unlocks user-visible behavior or blocks all children.
- Risk: 1 = well-bounded and testable, 5 = volatile runtime behavior or privacy/latency exposure.
- Priority score: `lift / (blast * risk)`. Higher is earlier.

## Ranked Implementation Proposals

| Rank | Proposal | Children | Blast | Lift | Risk | Priority | Recommendation |
| ---: | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Establish the shared-payload advisor contract first. Add `skill_advisor_brief`, advisor source/metadata, coercion tests, and privacy rejection rules before any hook emits the new payload. | `002` | 1 | 5 | 1 | 5.00 | Must ship first. It prevents invalid envelope labels and gives every later child a stable contract. |
| 2 | Build freshness and source-cache authority as a producer prerequisite. Compare SKILL.md signatures, graph metadata, advisor scripts, compiler, and graph artifacts; map to `live/stale/absent/unavailable`. | `003` | 2 | 5 | 2 | 1.25 | Must ship before brief generation. It keeps stale/degraded recommendations from sounding authoritative. |
| 3 | Create the pure advisor renderer and normalized regression harness immediately after the core producer starts. Runtime adapters must consume the same renderer fixtures. | `005` | 2 | 5 | 2 | 1.25 | Must ship before multi-runtime rollout. It is the guardrail against drift. |
| 4 | Implement the core `buildSkillAdvisorBrief()` producer with prompt policy, fail-open result shape, cache policy, 80-token target, 120-token hard cap, and no raw prompt persistence. | `004` | 3 | 5 | 2 | 0.83 | Must ship after `002/003` and before runtime wiring. Use mocks first, then subprocess fixtures. |
| 5 | Ship Claude as the first user-visible runtime slice. Use it to verify prompt-time injection, stdout/stderr discipline, skip policy, and fail-open behavior against the renderer fixtures. | `006` | 3 | 4 | 2 | 0.67 | Must ship for the first slice. Do not start until `005` fixtures exist. |
| 6 | Deliver documentation and release contract once the first runtime is real, with draft docs allowed after the producer contract stabilizes. | `009` | 2 | 3 | 2 | 0.75 | Must ship for release. Draft after `004`; finalize after `006-008` behavior is verified. |
| 7 | Expand Gemini and Copilot after Claude proves the shared renderer. Gemini needs JSON `additionalContext`; Copilot needs confirmed model-visible command-hook behavior. | `007` | 4 | 4 | 3 | 0.33 | Defer from first slice, then ship as runtime parity expansion. Do not drop if parent keeps all-runtime acceptance. |
| 8 | Add Codex native hook integration and dynamic hook policy after payload/renderer contracts are stable. Keep prompt wrapper fallback for older or restricted Codex configs. | `008` | 4 | 4 | 4 | 0.25 | Defer until `005/006` are stable. Do not block first Claude slice; do block final "Codex parity" claims. |

## Go / No-Go by Child

| Child | Decision | Ship Condition | Defer / Drop Boundary |
| --- | --- | --- | --- |
| `002-shared-payload-advisor-contract` | Must ship | Producer enum/source or metadata contract compiles, transport coercion accepts valid advisor payloads, invalid producers and prompt-derived provenance are rejected. | No deferral. Runtime children are no-go without this. |
| `003-advisor-freshness-and-source-cache` | Must ship | Non-mutating freshness probe covers live, stale, absent, unavailable; 15-minute source cache is invalidated by source signature changes. | No deferral. `004` is no-go without this. |
| `004-advisor-brief-producer-cache-policy` | Must ship | `AdvisorHookResult`, prompt policy, fail-open behavior, exact HMAC prompt cache option, and renderer input shape are tested without raw prompt persistence. | No deferral for core behavior. Semantic augmentation can defer if disabled by default. |
| `005-advisor-renderer-and-regression-harness` | Must ship | Renderer fixtures and normalized runtime-output comparators exist before runtime adapters. Privacy, fail-open, token-cap, and corpus parity gates are defined. | No deferral for fixtures. Full corpus can run in this child as a focused gate rather than every PR. |
| `006-claude-hook-wiring` | Must ship first runtime | Claude UserPromptSubmit/session-prime path injects only passing live/stale-safe briefs and fails open silently with diagnostics on stderr. | No-go if Claude cannot provide model-visible prompt-submit context; then final synthesis must recommend a wrapper fallback child. |
| `007-gemini-copilot-hook-wiring` | Defer from first slice | Gemini JSON `additionalContext` and Copilot command-hook output normalize to the same renderer contract. | Defer until `006` passes. Drop only if parent scope is narrowed away from all-runtime parity. |
| `008-codex-integration-and-hook-policy` | Defer from first slice | Native Codex UserPromptSubmit adapter works where `codex_hooks` is enabled; runtime detector no longer hard-codes Codex as unavailable; fallback wrapper is tested. | Defer until payload and renderer are stable. Drop only for older Codex support if runtime policy says unavailable. |
| `009-documentation-and-release-contract` | Must ship for release | Docs cover setup, disable flag, failure modes, privacy, validation commands, runtime-specific behavior, and manual playbook. | Draft can defer until first runtime; final docs cannot be dropped. |

## Validation Plan

### `002-shared-payload-advisor-contract`

- Add unit tests for `skill_advisor_brief` producer acceptance and invalid producer rejection.
- Add section metadata tests for advisor status, prompt policy reason, top skill, confidence, uncertainty, threshold status, cache kind, source signature, and error code.
- Add privacy tests rejecting raw prompt, normalized prompt, token lists, and `promptFingerprint:*` in advisor provenance/source refs.
- Verify transport coercion still rejects unrelated unknown producers.

### `003-advisor-freshness-and-source-cache`

- Build fixture trees for:
  - all sources current -> `live`
  - newer SKILL.md, graph metadata, advisor script, or compiler -> `stale`
  - missing script/inventory/artifact -> `absent`
  - unreadable/locked/parse-failed artifact -> `unavailable`
- Assert probe is non-mutating.
- Assert the 15-minute source cache reuses signatures only when source signature and workspace root match.
- Add a regression fixture for current `skill_advisor.py --health` degraded parity so degraded does not automatically become prompt-time failure.

### `004-advisor-brief-producer-cache-policy`

- Unit-test `shouldRunAdvisor()` for empty, casual, control, explicit marker, governance marker, work intent, length/tokens, and long prompt cases.
- Mock subprocess outcomes for success, no passing skill, timeout, non-zero exit, malformed JSON, SQLite busy, process signal, missing Python, and missing script.
- Assert `fail_open` always returns `brief: null`.
- Assert stale high-confidence briefs include stale wording and no mandatory language.
- Assert normal brief target stays <=80 tokens and ambiguous/debug form stays <=120 tokens.
- Validate exact prompt-result cache is HMAC keyed with session-only secret by default and no raw prompt or normalized prompt is persisted.
- Performance budget: p95 <=50 ms for the intended production path. If shell-out remains around the iteration 003 52-58 ms sample, implementation must either introduce a warm/in-process path or explicitly update the parent performance gate before go.

### `005-advisor-renderer-and-regression-harness`

- Create renderer fixtures: `livePassingSkill`, `staleHighConfidenceSkill`, `noPassingSkill`, `failOpenTimeout`, `skippedShortCasual`, `ambiguousTopTwo`.
- Add normalized runtime-output shape: runtime, transport, additionalContext, stderr visibility, and decision.
- Use custom normalized diff as the primary assertion; keep small inline snapshots only for reviewed wrapper shapes.
- Run privacy assertions across stdout, stderr, hook-state fixtures, snapshots, and shared payload.
- Own the 019/004 200-prompt parity run: hook-produced top-1 must match direct CLI top-1 for all 200 prompts before the runtime rollout claims "no routing regression."
- Keep full corpus out of every PR unless advisor scoring/cache changes; run renderer/adapter fixtures on every relevant PR.

### `006-claude-hook-wiring`

- Add Claude UserPromptSubmit fixture tests for prompt text extraction, session id, cwd, skip policy, and prompt-submit output.
- Assert stdout is model-visible context only and diagnostics stay on stderr.
- Assert timeout/malformed advisor output exits 0 with no injected context.
- Validate session-prime startup path can include a readiness line without duplicating per-prompt advice.
- Manual smoke: a real Claude hook payload should inject the 80-token advisor brief for a passing work prompt and inject nothing for a skipped casual prompt.

### `007-gemini-copilot-hook-wiring`

- Gemini: assert JSON `hookSpecificOutput.additionalContext` carries exactly the normalized renderer brief.
- Gemini: assert plain text stdout is not treated as a passing injection path.
- Copilot: capture or fixture the configured `userPromptSubmitted` behavior and prove model-visible output normalization.
- Cross-runtime: same `AdvisorHookResult` fixture must produce semantically identical `additionalContext` after normalization.
- Fail-open parity: all adapters exit cleanly with empty model-visible context on fail-open fixtures.

### `008-codex-integration-and-hook-policy`

- Add Codex payload parser tests for JSON via argv and stdin.
- Add output fixture for Codex `UserPromptSubmit` with `hookSpecificOutput.additionalContext`.
- Add dynamic runtime-detection tests for enabled, disabled-by-scope, and unavailable Codex hook policy.
- Add prompt-wrapper fallback tests that mark provenance as wrapper fallback and do not confuse wrapper-mutated prompt text with native hook context.
- Runtime capture follow-up: verify current Codex payload shape and whether `PreToolUse` is enforceable before any enforcement use.

### `009-documentation-and-release-contract`

- Update operator docs with setup, disable flags, cache/freshness semantics, privacy contract, runtime behavior, and troubleshooting.
- Include manual verification commands for unit, adapter, corpus, and runtime smoke tests.
- Document that `kind: "skill-advisor"` was rejected; use producer identity and structured metadata instead.
- Add release checklist entries for p95 latency, token cap, 200-prompt parity, fail-open, and cross-runtime normalized parity.

## Cross-Cutting Risks and Global Mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Latency budget conflict: iteration 003 measured per-prompt shell-out p95 around 58 ms, while parent acceptance asks p95 <=50 ms. | High | Treat warm/in-process or batch-style execution as part of `004` unless the parent performance gate is explicitly changed. Add p50/p95/max timing fixtures before runtime rollout. |
| Advisor context becomes too authoritative and overrides normal judgment. | High | Brief renderer must show pass/fail, confidence, uncertainty, and freshness; failed thresholds inject nothing by default; stale output cannot use mandatory language. |
| Runtime wrapper drift creates different advice across Claude/Gemini/Copilot/Codex. | High | Central renderer plus normalized adapter fixtures in `005`; runtime children cannot define independent text. |
| Prompt privacy leakage through hook-state, JSONL, snapshots, stderr, or payload provenance. | High | Memory-only prompt fingerprints by default; HMAC exact cache is opt-in and 5-minute TTL only; privacy tests scan all output surfaces. |
| Shared-payload vocabulary update breaks existing transport consumers. | Medium | Add contract child first, keep strict validation, test old producers, and avoid `kind: "skill-advisor"`. |
| Codex hooks remain under-development and can drift. | Medium | Isolate Codex in `008`, make hook-policy dynamic, keep prompt-wrapper fallback, and do not rely on PreToolUse until runtime capture proves semantics. |
| Current advisor graph health is degraded due inventory parity mismatch. | Medium | Freshness/health must distinguish degraded-but-usable from unavailable; add fixture so degraded health does not silently fail all prompt hooks. |
| Full 200-prompt corpus is too slow for every PR. | Medium | `005` owns the full corpus parity gate for scoring/cache changes; every PR gets small renderer/adapter fixtures plus privacy/token tests. |
| Parent docs currently mention `{ kind: 'skill-advisor' }`, which research rejects. | Medium | Iteration 9 synthesis should explicitly call out plan/spec update needed before implementation children are created. |

## Open Questions / Research Follow-Ups

1. Full 019/004 corpus benchmark remains unexecuted in this research loop. Iteration 003 used bounded measurement; `005` should own the full 200-prompt parity and timing run before runtime rollout.
2. Codex `PreToolUse` and `PostToolUse` strings exist in installed binary evidence, but payload/blocking semantics remain unverified. This is not needed for prompt advice, but it is a follow-up before any enforcement design.
3. Claude `UserPromptSubmit` exact output semantics should be confirmed with a real fixture or runtime capture. The design assumes model-visible prompt-submit context is available, but the current repo has no adapter.
4. Copilot `userPromptSubmitted` model-visible injection semantics need capture. Current evidence shows notification hooks; it does not yet prove advisor context injection.
5. The final contract child must decide whether to add a neutral lifecycle `kind: "prompt"` for prompt-time envelopes or render directly from `AdvisorHookResult`.
6. The source-signature snapshot storage location remains implementation-owned: hook-state, new skill-advisor cache module, or both.
7. The disable flag name needs final naming. Parent rollback suggests `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`; runtime docs should confirm whether a per-runtime override is also needed.
8. The current advisor health degraded state needs root-cause triage only if it affects recommendation correctness. Research says do not block prompt hook architecture on it, but implementation fixtures should pin expected behavior.
9. Iteration 9 should decide whether implementation child folders are created as all eight at once or whether only first-slice children `002-006` are created initially with `007/008` documented as follow-on parity children.

## Draft `research.md` Synthesis Outline

This is an outline only; do not treat it as the final synthesis.

1. Executive decision
   - Build the skill-advisor hook surface as a contract-first, renderer-first implementation train.
   - First shippable slice: `002 -> 003 -> 004 -> 005 -> 006`.
   - Runtime parity expansions: `007` Gemini/Copilot and `008` Codex.
2. Evidence trail from iterations
   - Iteration 1: current hook trigger surfaces and gaps.
   - Iteration 2: code-graph startup-brief pattern and advisor freshness authority.
   - Iteration 3: bounded TTL, latency, and brief-budget evidence.
   - Iteration 4: Codex native hook finding.
   - Iteration 5: fail-open contract.
   - Iteration 6: privacy, prompt threshold, and snapshot harness.
   - Iteration 7: child decomposition and shared-payload decision.
3. Final architecture
   - Shared-payload producer contract.
   - Advisor freshness/source cache.
   - `AdvisorHookResult` and renderer.
   - Runtime adapters.
   - Privacy and observability.
4. Ranked implementation proposals
   - Contract first.
   - Freshness before producer.
   - Renderer harness before runtime adapters.
   - Claude first, then runtime parity.
5. Go/no-go matrix
   - Must-ship children.
   - Deferred parity children.
   - Dropped/rejected ideas.
6. Validation plan
   - Unit and contract tests.
   - Corpus parity.
   - Runtime adapter normalization.
   - Performance and token budgets.
   - Privacy scans.
7. Risks and mitigations
   - Latency.
   - Privacy.
   - Runtime drift.
   - Codex volatility.
   - Shared-payload drift.
8. Open questions and follow-up research
   - Full corpus/timing.
   - Runtime captures.
   - Prompt lifecycle kind decision.
   - Child creation sequencing.

## Convergence Status

All ten key questions now have enough answers for synthesis. New information is lower than earlier discovery iterations because iteration 8 mostly ranks and reconciles prior findings. The latest trend is downward, but it is not below the configured `0.05` convergence threshold for three consecutive iterations; this iteration should not stop the loop early. It should prepare iteration 9 to draft `research.md` and iteration 10 to finalize or resolve remaining runtime-capture questions.

## Answers Added This Iteration

### Q2: Cache TTL

Q2 is sufficiently answered for architecture: use a 15-minute source freshness cache, a 5-minute exact HMAC prompt-result cache only when enabled, and do not use similarity-only result reuse. The full 200-prompt run remains a validation gate owned by `005`, not a blocker for research synthesis.

### Q3: Brief Length

Q3 is sufficiently answered for architecture: default to an 80-token target and 120-token hard cap; 60 tokens is the minimum safe brief; 40-token-only output is rejected because it hides threshold and freshness state.

## Ruled Out

- Re-running the full 200-prompt corpus inside iteration 8. The bounded evidence is enough for architecture; full parity belongs to the regression harness child.
- Shipping any runtime hook before payload vocabulary, freshness, producer, and renderer fixtures exist.
- Keeping the parent provisional seven-child structure without the payload-contract and renderer-harness children.
- Treating Gemini, Copilot, and Codex as first-slice blockers before Claude proves the prompt-time path.
- Claiming near convergence based only on a downward trend while newInfoRatio remains far above `0.05`.
