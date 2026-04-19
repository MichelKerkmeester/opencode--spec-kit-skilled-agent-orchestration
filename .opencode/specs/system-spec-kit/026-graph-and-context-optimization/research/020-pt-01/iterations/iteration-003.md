# Iteration 003 - Cache TTL and Brief Budget Measurement

## Focus

Design the empirical measurement method for prompt-time skill-advisor cache TTL and context-budget tradeoffs using the 019/004 routing corpus. This pass intentionally does not execute the full 200-prompt advisor benchmark. It loads the full corpus for shape and modeled TTL analysis, then runs bounded samples for subprocess latency, similar-prompt confidence stability, and brief-length examples.

## Source Evidence

- The active strategy asks Q2 for the empirical cache TTL sweet spot using the 019/004 200-prompt corpus, Q3 for the 40/60/80/120-token brief length curve, and Q6 for the hook firing threshold. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md:20-26`]
- The same strategy names the corpus path as `research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/deep-research-strategy.md:39-45`]
- The corpus rows include `id`, `bucket`, `prompt`, `gate3_*`, expected `skill_top_1`, `skill_correct`, and notes fields. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl:1-12`]
- `skill_advisor.py` already supports single-prompt subprocess calls, `--batch-stdin`, `--show-rejections`, `--threshold`, `--uncertainty`, and semantic hit options. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2740-2767`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2774-2821`]
- Built-in CocoIndex search can add a separate 5-second timeout path for semantic prompts, so hook-path timing should measure with `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1` first, then run a second semantic-enabled lane only for routing quality. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1482-1508`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2889-2903`]
- The current in-process skill discovery cache invalidates on `SKILL.md` mtime and size signatures, which is the correct source-cache primitive for hook usage. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:231-269`]

## Corpus Shape

The loaded file has 200 JSONL prompts across six buckets:

| Bucket | Count |
| --- | ---: |
| `true_write` | 32 |
| `true_read_only` | 32 |
| `memory_save_resume` | 32 |
| `mixed_ambiguous` | 32 |
| `deep_loop_prompts` | 36 |
| `skill_routing_prompts` | 36 |

That distribution is useful because it separates hook fire/no-fire policy from skill routing quality. The TTL study should not optimize only for repeated implementation prompts; it must include read-only, memory-save, deep-loop, and connector-routing prompts because those are the surfaces most likely to produce costly false confidence.

## Measurement Methodology

### Lane A: Advisor subprocess latency

Measure three execution modes:

1. Cold single subprocess per prompt: `python3 skill_advisor.py "$prompt" --show-rejections`.
2. Warm single subprocess per prompt after one cache-priming call: same command, same process model.
3. Batch or in-process adapter: `python3 skill_advisor.py --batch-stdin --show-rejections`.

For each lane, record:

| Metric | Definition |
| --- | --- |
| `latency_ms` | Wall time from process spawn to parsed JSON result. |
| `status` | Exit code and parse status. |
| `top_1` / `top_2` | First two returned recommendations with confidence and uncertainty. |
| `passes_threshold` | Dual threshold result from the advisor output. |
| `semantic_mode` | `disabled`, `auto`, or `precomputed_hits`. |

Recommended full-run design:

- First run `semantic_mode=disabled` to isolate hook hot-path overhead from `ccc` availability and the 5-second semantic timeout lane.
- Then run a quality-only lane with precomputed semantic hits for prompts that trigger `should_auto_use_semantic_search()`, rather than letting every hook call shell out to `ccc`.
- Report p50/p95/max separately for each bucket. A single aggregate p95 can hide deep-loop or semantic-search outliers.

### Lane B: Similar-prompt confidence stability

For each prompt in corpus order:

1. Normalize prompt tokens by lowercasing, stripping punctuation, and removing stop words.
2. Find prior prompts in the same session window.
3. Mark a similar-prompt pair when token Jaccard is at least `0.22`.
4. Split pairs into same-labeled-skill and different-labeled-skill groups.
5. For same-labeled-skill pairs, compare actual advisor confidence and uncertainty. Record `abs(conf_a - conf_b)`, `mean_confidence`, and top-1 agreement.

Important guardrail: use similar-prompt cache hits only when both the prompt fingerprint family and the advisor source signature match. Similarity alone is not safe enough to skip advisor execution because deep-research and deep-review prompts share words while requiring different skills.

### Lane C: TTL hit-rate simulation

Model corpus order as a single session stream. This iteration used an explicit assumption of one prompt every 30 seconds. For each TTL candidate, compare the current prompt with prior prompts in that TTL window:

- A potential safe hit requires same expected `skill_top_1` and token Jaccard >= `0.22`.
- A risky near miss has token Jaccard >= `0.22` but a different expected `skill_top_1`.
- Exact normalized prompt hits should be reported separately in the full run. The modeled curve below is a similar-prompt cache ceiling, not an exact-key cache rate.

## Sample Measurements

The bounded sample used 19 prompts selected across all six buckets. Built-in semantic search was disabled to isolate skill-advisor subprocess cost.

| Metric | Value |
| --- | ---: |
| Single subprocess p50 | 52.5 ms |
| Single subprocess p95 | 58.1 ms |
| Single subprocess average | 53.1 ms |
| Single subprocess min / max | 51.9 / 58.1 ms |
| Batch total for 19 prompts | 294.4 ms |
| Batch average per prompt | 15.5 ms |

Interpretation: prompt-time hook cost is dominated by process startup. If the runtime can call an in-process TypeScript producer or keep a small Python worker warm, the expected average prompt cost can be closer to the batch lane. If it shells out on every prompt, a 50-60 ms budget is acceptable for explicit command-like prompts but too noticeable for every short conversational turn.

## Similar-Prompt Confidence Sample

Ten same-skill prompt pairs were selected from the modeled 15-minute window and re-scored with semantic disabled. Nine were genuinely similar; one accidental non-similar control was excluded from the conclusion.

| Pair | Labeled skill | Similarity | Confidence | Uncertainty |
| --- | --- | ---: | --- | --- |
| `rr-iter2-023` / `rr-iter2-030` | `system-spec-kit` | 0.43 | 0.95 / 0.95 | 0.20 / 0.23 |
| `rr-iter2-024` / `rr-iter2-042` | `sk-deep-research` | 0.29 | 0.95 / 0.95 | 0.15 / 0.15 |
| `rr-iter2-026` / `rr-iter2-043` | `sk-deep-review` | 0.29 | 0.95 / 0.95 | 0.15 / 0.15 |
| `rr-iter2-043` / `rr-iter2-050` | `sk-deep-review` | 0.38 | 0.95 / 0.95 | 0.15 / 0.15 |
| `rr-iter3-090` / `rr-iter3-104` | `sk-code-review` | 0.31 | 0.93 / 0.93 | 0.28 / 0.28 |
| `rr-iter3-108` / `rr-iter3-118` | `sk-deep-research` | 0.57 | 0.95 / 0.95 | 0.15 / 0.15 |
| `rr-iter3-109` / `rr-iter3-122` | `sk-deep-review` | 0.29 | 0.95 / 0.95 | 0.15 / 0.15 |
| `rr-iter3-111` / `rr-iter3-123` | `system-spec-kit` | 0.45 | 0.95 / 0.95 | 0.15 / 0.20 |
| `rr-iter3-183` / `rr-iter3-200` | `sk-code-opencode` | 0.46 | 0.95 / 0.95 | 0.23 / 0.23 |

Average pair confidence in the valid sample was about `0.948`, with average absolute confidence difference `0.000`. This says the advisor's high-confidence lanes are stable once prompts are truly same-skill. It does not justify similarity-only cache reuse because the corpus also had near-miss pairs such as `sk-deep-research` vs `sk-deep-review` with high lexical overlap.

## TTL Tradeoff Curve

Modeled assumptions:

- Corpus order is the session order.
- Prompt cadence is 30 seconds.
- Similarity threshold is token Jaccard >= `0.22`.
- Safe hit means similar prompt and same labeled `skill_top_1`.

| TTL | Window prompts | Safe hits | Hit rate | Risky near misses |
| ---: | ---: | ---: | ---: | ---: |
| 1 min | 2 | 0 | 0.0% | 1 |
| 5 min | 10 | 9 | 4.5% | 7 |
| 15 min | 30 | 24 | 12.0% | 16 |
| 30 min | 60 | 31 | 15.5% | 22 |
| 60 min | 120 | 52 | 26.0% | 24 |

Recommendation for Q2:

- Use `15 minutes` as the default TTL for the session-scoped advisor source/result cache. It captures most of the realistic same-task locality while keeping stale-context exposure inside a single working burst.
- Use `5 minutes` for exact prompt-result cache entries if raw prompt fingerprints are stored at all.
- Do not use 30 or 60 minutes for similarity-based result reuse. The modeled hit rate improves, but the near-miss count also grows, and a stale skill recommendation in a prompt hook is more damaging than a missed cache optimization.
- Prefer caching source inventory and graph freshness over caching final recommendations. The 15-minute source cache reduces repeated filesystem/signature work without pretending two similar prompts are identical.

## Brief-Length Curve

The four brief variants should be treated as progressive disclosure, not four unrelated formats.

| Budget | Content | Quality retained | Recommended use |
| ---: | --- | --- | --- |
| 40 tokens | Top-1 skill name only | Routing nudge only; hides confidence and stale/unavailable state. | Only for already-passing explicit skill names or very tight transports. |
| 60 tokens | Top-1 + confidence + uncertainty | Enough to avoid acting on weak recommendations. | Minimum safe prompt-time brief. |
| 80 tokens | Top-1 + confidence + uncertainty + freshness | Adds source trust without much cost. | Default hook brief. |
| 120 tokens | Top-1 + top-2 fallback + confidence + uncertainty + freshness | Preserves ambiguity handling and graceful fallback. | Debug mode, long prompts, deep-loop/memory prompts, and first prompt after freshness change. |

Recommended answer for Q3: default to an 80-token target with a 120-token hard cap. The 40-token brief is too lossy because it would present failed or stale recommendations as if they were authoritative. The 60-token brief is the minimum viable gate because it carries confidence and uncertainty. The 120-token form should be available when top-2 is close, when freshness is stale, or when a deep-loop command requires command-surface clarification.

## Brief Walkthrough Sample

`freshness=live` is assumed for the examples below. The actual hook should substitute `stale`, `absent`, or `unavailable` from `getAdvisorFreshness()`.

| ID | Expected | Advisor sample | 40-token brief | 60-token brief | 80-token brief | 120-token brief |
| --- | --- | --- | --- | --- | --- | --- |
| `rr-iter2-001` | `sk-code-opencode` | `sk-code-web 0.72/0.20 fail`; fallback `sk-code-full-stack 0.31/0.45 fail` | `Advisor: sk-code-web.` | `Advisor: sk-code-web 0.72/0.20; below routing threshold.` | `Advisor: live; sk-code-web 0.72/0.20 below threshold.` | `Advisor: live; top sk-code-web 0.72/0.20 below threshold; fallback sk-code-full-stack 0.31/0.45. Continue without enforced skill.` |
| `rr-iter2-011` | `sk-code-review` | `sk-code-review 0.93/0.28 pass`; fallback `sk-deep-review 0.42/0.45 fail` | `Advisor: sk-code-review.` | `Advisor: sk-code-review 0.93/0.28 pass.` | `Advisor: live; sk-code-review 0.93/0.28 pass.` | `Advisor: live; use sk-code-review 0.93/0.28. Fallback sk-deep-review 0.42/0.45 fails; keep this read-only review.` |
| `rr-iter2-021` | `system-spec-kit` | `system-spec-kit 0.95/0.15 pass`; fallback `command-spec-kit-resume 0.33/0.45 fail` | `Advisor: system-spec-kit.` | `Advisor: system-spec-kit 0.95/0.15 pass.` | `Advisor: live; system-spec-kit 0.95/0.15 pass.` | `Advisor: live; use system-spec-kit 0.95/0.15 for memory save. Fallback command-spec-kit-resume fails.` |
| `rr-iter2-031` | `sk-code-opencode` | `sk-code-web 0.95/0.20 pass`; fallback `sk-improve-prompt 0.75/0.30 fail` | `Advisor: sk-code-web.` | `Advisor: sk-code-web 0.95/0.20 pass.` | `Advisor: live; sk-code-web 0.95/0.20 pass.` | `Advisor: live; top sk-code-web 0.95/0.20 because prompt implies patching. Fallback sk-improve-prompt 0.75/0.30 below threshold.` |
| `rr-iter2-041` | `sk-deep-research` | `sk-deep-research 0.95/0.15 pass`; fallback `command-spec-kit 0.95/0.20 pass` | `Advisor: sk-deep-research.` | `Advisor: sk-deep-research 0.95/0.15 pass.` | `Advisor: live; sk-deep-research 0.95/0.15 pass.` | `Advisor: live; use sk-deep-research 0.95/0.15. Fallback command-spec-kit 0.95/0.20 also passes, but deep-research owns the loop.` |
| `rr-iter2-051` | `mcp-coco-index` | `mcp-coco-index 0.95/0.15 pass`; fallback `system-spec-kit 0.72/0.20 fail` | `Advisor: mcp-coco-index.` | `Advisor: mcp-coco-index 0.95/0.15 pass.` | `Advisor: live; mcp-coco-index 0.95/0.15 pass.` | `Advisor: live; use mcp-coco-index 0.95/0.15 for semantic code search. Fallback system-spec-kit fails.` |
| `rr-iter3-089` | `none` | `sk-code-opencode 0.38/0.45 fail`; fallback `mcp-chrome-devtools 0.28/0.45 fail` | `Advisor: sk-code-opencode.` | `Advisor: sk-code-opencode 0.38/0.45; below threshold.` | `Advisor: live; sk-code-opencode 0.38/0.45 below threshold.` | `Advisor: live; no passing skill. Top sk-code-opencode 0.38/0.45; fallback mcp-chrome-devtools 0.28/0.45. Continue general answer.` |
| `rr-iter3-104` | `sk-code-review` | `sk-code-review 0.93/0.28 pass`; fallback `sk-improve-prompt 0.75/0.30 fail` | `Advisor: sk-code-review.` | `Advisor: sk-code-review 0.93/0.28 pass.` | `Advisor: live; sk-code-review 0.93/0.28 pass.` | `Advisor: live; use sk-code-review 0.93/0.28 for audit. Fallback sk-improve-prompt below threshold.` |
| `rr-iter3-126` | `sk-deep-research` | `sk-deep-research 0.95/0.15 pass`; fallback `sk-deep-review 0.62/0.45 fail` | `Advisor: sk-deep-research.` | `Advisor: sk-deep-research 0.95/0.15 pass.` | `Advisor: live; sk-deep-research 0.95/0.15 pass.` | `Advisor: live; use sk-deep-research 0.95/0.15 for resume deep research. Fallback sk-deep-review fails.` |
| `rr-iter3-148` | `none` | `sk-code-review 0.55/0.45 fail`; fallback `sk-improve-agent 0.38/0.45 fail` | `Advisor: sk-code-review.` | `Advisor: sk-code-review 0.55/0.45; below threshold.` | `Advisor: live; sk-code-review 0.55/0.45 below threshold.` | `Advisor: live; no passing skill. Top sk-code-review 0.55/0.45; fallback sk-improve-agent 0.38/0.45. Ask/answer generally before edits.` |
| `rr-iter3-183` | `sk-code-opencode` | `sk-code-opencode 0.95/0.23 pass`; fallback `mcp-coco-index 0.84/0.20 pass` | `Advisor: sk-code-opencode.` | `Advisor: sk-code-opencode 0.95/0.23 pass.` | `Advisor: live; sk-code-opencode 0.95/0.23 pass.` | `Advisor: live; use sk-code-opencode 0.95/0.23. Fallback mcp-coco-index 0.84/0.20 also passes for lookup support.` |
| `rr-iter3-191` | `sk-improve-prompt` | `sk-improve-prompt 0.95/0.15 pass`; fallback `sk-improve-agent 0.42/0.45 fail` | `Advisor: sk-improve-prompt.` | `Advisor: sk-improve-prompt 0.95/0.15 pass.` | `Advisor: live; sk-improve-prompt 0.95/0.15 pass.` | `Advisor: live; use sk-improve-prompt 0.95/0.15 for prompt variant work. Fallback sk-improve-agent fails.` |

The walkthrough exposes the core Q3 problem: the 40-token version is actively misleading for failed recommendations (`rr-iter2-001`, `rr-iter3-089`, `rr-iter3-148`) because it omits threshold status. The 60-token version fixes that. The 80-token version adds freshness, which matters for prompt hooks because stale advisor state should degrade trust. The 120-token version is the first one that preserves fallback ambiguity.

## When-To-Fire Guidance for Q6

Partial answer:

- Fire the hook on prompts with at least 4 meaningful tokens or at least one command-like marker (`/spec_kit`, `/memory`, `deep-research`, `deep-review`, `review`, `audit`, `fix`, `implement`, `edit`, `create`, `use the * skill`).
- Skip or return a null brief for greetings, acknowledgements, and very short prompts below 4 meaningful tokens unless they include an explicit skill/command marker.
- Always fire for memory-save/resume and deep-loop phrases because those are governance-sensitive even when short.
- For read-only analysis prompts, fire but allow the no-passing-skill result to pass through quietly. The hook should advise, not force a skill when confidence/uncertainty fail.

This threshold avoids paying the 50-60 ms subprocess cost for casual one-liners while still catching the corpus families where skill routing materially changes behavior.

## Answers

### Q2: Cache TTL

Use a two-tier cache:

1. Source freshness cache: 15 minutes, keyed by workspace root plus advisor source signature. This caches SKILL.md discovery, graph metadata, graph artifact, and advisor runtime freshness.
2. Prompt result cache: 5 minutes for exact normalized prompt fingerprints only. Similarity-based cache may annotate confidence stability, but should not skip advisor execution unless a future full benchmark proves very low near-miss risk.

The 15-minute source cache is the best tradeoff from this sample because it gives a modeled 12% similar-prompt locality ceiling without the extra stale-risk of 30 or 60 minutes. The prompt-result cache should stay shorter and exact-keyed because semantically similar prompts can still route to different skills.

### Q3: Brief Length

Default hook brief: 80-token target, 120-token hard cap. Use 60 tokens as the minimum safe brief. Do not ship a 40-token-only format for general prompt hooks because it hides confidence, uncertainty, pass/fail, and freshness.

### Q6: When To Fire

Partial answer: fire on command-like, governance-sensitive, or work-intent prompts; skip only short casual prompts with no skill/command markers. A practical threshold is 4 meaningful tokens plus marker overrides.

## Findings

1. Per-prompt shelling to the advisor costs about 53 ms in the bounded sample; batch/in-process mode lowers average cost to about 15.5 ms per prompt. Hook implementation should prefer in-process or warm-worker execution where possible.
2. Similar same-skill prompts produce stable confidence in the sample, but lexical near misses across `sk-deep-research` and `sk-deep-review` make similarity-only result reuse unsafe.
3. A 15-minute source-cache TTL is the best default. It keeps stale exposure bounded while preserving same-session locality.
4. A 5-minute exact prompt-result TTL is acceptable, but only when keyed by normalized prompt fingerprint, source signature, threshold settings, runtime, and semantic mode.
5. The 40-token brief loses necessary safety information. A 60-token brief is the minimum safe surface; 80 tokens is the recommended default; 120 tokens is the right diagnostic/ambiguous mode.
6. Semantic search should not run as an unbounded prompt-time subprocess. Use precomputed semantic hits or a separate measured lane before enabling semantic augmentation in hooks.

## Next Focus

Iteration 4 should address Q5 and Q7 together: define fail-open behavior for subprocess, JSON parse, timeout, DB lock, stale graph, and missing Python cases, then specify the privacy boundary for prompt fingerprints and whether salted hashes can be persisted or must stay in memory.

## Ruled Out

- Similarity-only recommendation cache for 30 or 60 minutes. Hit rate rises, but risk near misses and stale recommendation exposure rise too.
- A 40-token default hook brief. It is compact but hides enough state to be unsafe.
- Running full advisor health checks on every prompt. Health belongs to freshness invalidation and diagnostics, not the prompt hot path.
