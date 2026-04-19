# Iteration 005 - X5 Adversarial Advisor / Prompt Injection Surface

## Focus

Determine whether a crafted user prompt can poison future skill-advisor hook output in two ways: by biasing the top recommendation toward the wrong skill, or by smuggling instruction-shaped text into the model-visible advisor brief. Also classify the timing surface. The required comparison point is the existing trigger-phrase sanitization hardening from phase 019/003. 

## Inputs Read

- Packet prompt and state:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/prompts/iteration-5.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-state.jsonl`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-strategy.md`
- Live advisor code:
  - `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`
- Phase 019/003 hardening authority:
  - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
  - `.opencode/skill/system-spec-kit/scripts/lib/unicode-normalization.ts`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/003-memory-quality-remediation/iterations/iteration-015.md`
- Prior packet context:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md`

## Live Attack Surface

| Vector | Current surface | Verdict | Mitigation direction |
| --- | --- | --- | --- |
| Prompt biases the top recommendation toward the wrong skill | `analyze_request()` lowercases raw prompt text, then applies phrase, token, graph-signal, keyword, and explicit skill-name boosts directly against that prompt. Any direct skill-name or slash-form mention inside the prompt can trigger the explicit-mention boost path. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2363-2447] | **Real integrity risk**. A metalinguistic prompt like "do not use sk-code-opencode; use cli-copilot instead" still gives `cli-copilot` strong routing evidence because the scorer cannot distinguish quoted/cited skill names from genuine routing intent. | Add a prompt-hook prepass that discounts quoted or negated skill mentions and treats explicit skill IDs as advisory only unless the prompt is clearly invoking that skill. Reuse the existing "quoted command reference" idea, but extend it from command bridges to skill IDs. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:1886-1928] |
| User prompt text escapes into the model-visible advisor brief | The checked-in advisor has no renderer yet; it returns JSON recommendations, not hook text. The recommendation reasons are built from matched tokens, phrases, and static labels, not from verbatim prompt spans. That means there is no direct prompt echo path in the current repo surface. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2455-2515] | **Latent, not live**. The current CLI path can be poisoned at the recommendation layer, but there is no checked-in proof that arbitrary prompt text is rendered back to the model. The brief-injection risk appears when a future adapter renders user-derived material beyond a strict allowlist. | Keep the future brief renderer whitelist-only: skill ID, confidence, uncertainty, freshness, and narrow status words. Do **not** render `reason`, prompt tokens, or semantic snippets into `additionalContext` by default. |
| Unicode-confusable or role/instruction contamination bypass | The advisor prompt path uses `prompt.lower()` and token regex extraction, but does **not** apply `canonicalFold`, control-character rejection, or contamination-pattern rejection. By contrast, phase 019/003 hardening canonical-folds trigger text and rejects control characters, HTML/role-like contamination, and path fragments before acceptance. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2363-2364] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:33-39] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:112-184] | **Future trust-boundary risk**. Today this mostly affects recall or false negatives; once hook output becomes model-visible, the lack of phase-019/003 normalization on any prompt-derived fragment becomes a real injection boundary. | Inherit phase 019/003 **P0** rules whenever any user-derived text crosses into the advisor brief: `canonicalFold`, max-length cap, control-character rejection, contamination rejection, and path-fragment rejection. |
| Timing attack via semantic auto-search | Discovery-style prompts can auto-trigger built-in CocoIndex search. The query is passed as an argv element to `subprocess.run()` with a bounded timeout, and failures degrade to empty semantic hits rather than mutating persistent advisor state. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:1715-1729] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:1837-1855] | **Availability/latency risk, not integrity persistence**. A crafted prompt can push the slower semantic lane, but it cannot inject shell syntax into the subprocess call and it does not poison later prompts. | Keep semantic search optional and bounded; record when the semantic lane fired; fail open to keyword scoring on timeout or daemon failure. |
| Persistent poisoning via cache reuse | The current runtime cache stores parsed `SKILL.md` discovery records keyed by file path, mtime, and size. It does **not** cache prompt results or prompt-derived routing state. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:28-33] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:231-284] | **Low current persistence risk**. An attacker can influence one prompt's routing, but there is no live prompt-result cache to contaminate future prompts. | If packet 020 later adds the exact prompt cache proposed in iteration 001, bind it to a session-scoped canonical prompt hash plus source signature, runtime, thresholds, and semantic-mode flag. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:95-105] |

## Determination

**X5 is answered with a split verdict.**

1. **Yes, a crafted prompt can poison the advisor's recommendation outcome today.** The scoring model treats raw prompt text as routing evidence, and explicit skill mentions are heavily boosted without a general-purpose distinction between "the user is asking to use this skill" and "the user is merely mentioning this skill inside a larger sentence." [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2417-2430]
2. **No, the current checked-in surface does not yet show a direct prompt-to-brief injection path.** The advisor currently emits structured JSON recommendations; there is no checked-in `buildSkillAdvisorBrief()` or renderer that echoes arbitrary prompt text to the model. The direct injection risk is therefore a **future hook-renderer boundary**, not a proven live exploit in the current repo. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2890-2905]
3. **Timing attacks are real only as bounded latency shaping.** Semantic auto-search can make selected prompts slower, but the subprocess call is argv-based rather than shell-based and falls back safely on timeout. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:1718-1725]

## Cross-Reference: Phase 019/003 P0 and P1 Carry-Over

Phase 019/003's sanitizer establishes the right boundary split for this packet:

### P0 carry-over for any model-visible advisor text

These must apply whenever user-derived text, even a derived token or snippet, crosses into `additionalContext`:

1. `canonicalFold` Unicode normalization. [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:112-117]
2. Reject control characters and overlong input. [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:37-40] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:135-141]
3. Reject contamination markers such as HTML tags, role labels, `system prompt`, `developer message`, and tool-state language. [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:38] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:153-155]
4. Reject path fragments and packet-slug leakage. [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:33-35] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:157-159]

### P1 carry-over for extracted prompt-derived fragments only

These should remain narrow heuristics for optional extracted fields, not blanket prompt blocking:

1. Suspicious numbered-prefix rejection such as `phase 7`, `iter 5`, `q12`, and `f21`. [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:36] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:172-174]
2. Synthetic-bigram suppression and standalone-stopword cleanup. Iteration 015 showed these are low-false-positive fixes when applied narrowly to extracted trigger-like fragments. [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:100-110] [SOURCE: file:.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:176-181] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/003-memory-quality-remediation/iterations/iteration-015.md:31-60]

The important scope rule is: **P0 belongs at the trust boundary; P1 belongs only on extracted, optional prompt-derived facets.**

## Minimum Mitigation Set for Packet 020+

1. **Never render raw prompt text into the advisor brief.** The brief should be composed from trusted local fields only: skill ID, confidence, uncertainty, freshness, and fixed labels.
2. **Do not render the advisor `reason` string into model-visible context.** It is diagnostic and may contain prompt-derived match labels that were never designed as a trust-safe prompt surface.
3. **Add a prompt-normalization layer before future hook scoring/brief generation.** At minimum: `canonicalFold`, length cap, control-character rejection, and contamination detection from phase 019/003.
4. **Add a metalinguistic-skill-mention guard.** If a skill name appears inside quotes, negation, comparison text, or a sentence about the skill itself, reduce or suppress the explicit-skill boost.
5. **Keep semantic search bounded and observable.** Timing variance should be visible in metrics and never required for correct routing.

## Ruled Out

### Shell-command injection through the semantic-search subprocess

Ruled out on the currently inspected path. The built-in CocoIndex call uses `subprocess.run([...])` with the prompt as a positional argv item, not a shell-interpolated string, so prompt text cannot break out into shell syntax through this call site. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:1718-1725]

## Decisions

- **Record X5 as answered with a split risk model.** Recommendation poisoning is live; direct brief-text injection is mostly latent until a renderer crosses the trust boundary with user-derived text.
- **Import phase 019/003 P0 guards into the future advisor brief boundary.** The current advisor path does not normalize prompt text strongly enough for model-visible reuse.
- **Treat phase 019/003 P1 heuristics as extracted-text cleanup only.** They are valuable for optional derived prompt facets, but too heuristic to use as the primary routing contract.
- **Class timing attacks as availability issues, not persistence issues.** Current caches are inventory-scoped, not prompt-scoped.

## Question Status

- **X5 answered**: the packet now has a concrete attack-surface table, a live-vs-latent threat split, and a minimum mitigation set anchored to the existing phase 019/003 sanitizer contract.

## Next Focus

Iteration 6 should move to X6 and define the observability contract: which metrics prove advisor-route quality, semantic-lane latency, fail-open behavior, and future hook freshness without logging raw prompts.
