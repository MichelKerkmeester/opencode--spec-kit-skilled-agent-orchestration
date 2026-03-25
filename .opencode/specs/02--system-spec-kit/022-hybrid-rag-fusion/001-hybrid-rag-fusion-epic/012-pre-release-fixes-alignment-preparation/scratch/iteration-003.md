● skill(sk-code--review)

● Read README.md
  │ .agents/skills/sk-code--review/README.md
  └ L1:220 (79 lines read)

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ L1:240 (98 lines read)

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ L1:220 (162 lines read)

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ L1:220 (206 lines read)

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/shared/**/*.js"
  └ No matches found

I’ve loaded the review baseline and am now enumerating the actual shared-module files so I can do a file-by-file correctness pass with line-cited evidence.

● List directory .opencode/skill/system-spec-kit/shared
  └ 21 files found

● Search (glob)
  │ "**/*.js" in .opencode/skill/system-spec-kit/shared
  └ No matches found

● Search (grep)
  │ ""
  └ 11 files found

● skill(sk-code--opencode)

The shared directory includes mixed TS/JS artifacts, so I’m narrowing to the real `.js` review set now and then I’ll inspect each file directly.

● Read universal_patterns.md
  │ .agents/skills/sk-code--opencode/references/shared/universal_patterns.md
  └ L1:220 (220 lines read)

● Read quality_standards.md
  │ .agents/skills/sk-code--opencode/references/javascript/quality_standards.md
  └ L1:240 (239 lines read)

● Read javascript_checklist.md
  │ .agents/skills/sk-code--opencode/assets/checklists/javascript_checklist.md
  └ L1:220 (220 lines read)

● List shared JS files (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && find
  │ .opencode/skill/system-spec-kit/shared -type f -name '*.js' | sort
  └ 34 lines...

I’ve got the concrete JS scope now. To keep the review thorough, I’m doing two things in parallel: building a line-numbered combined source dump for direct inspection, and running a focused review pass over the same files to cross-check for missed correctness issues.

● Code-review Review shared JS
  └ Agent started in background with agent_id: shared-modules-review. You can use...

● Create combined shared JS dump (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('.opencode/skill/system-spec-kit/shared')
  │ files = sorted(root.rglob('*.js'))
  │ out = Path('/tmp/shared-js-review.txt')…
  └ 17 lines...

● Read (Code-review agent — Review shared JS)
  └ Running

● List shared JS line counts (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('.opencode/skill/system-spec-kit/shared')
  │ for path in sorted(root.rglob('*.js')):
  │ with path.open('r', encoding='utf-8') as f:…
  └ 37 lines...

I’ve identified the high-risk modules by size and surface area. I’m reading those first in full, then I’ll sweep the smaller helpers and confirm or discard any candidate issues with exact line citations.

● Read embeddings.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings.js
  └ L1:260 (260 lines read)

● Read trigger-extractor.js
  │ .opencode/skill/system-spec-kit/shared/dist/trigger-extractor.js
  └ L1:260 (260 lines read)

● Read rrf-fusion.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/rrf-fusion.js
  └ L1:260 (260 lines read)

● Read fusion-lab.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js
  └ L1:260 (260 lines read)

● Read embeddings.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings.js
  └ L261:655 (395 lines read)

● Read trigger-extractor.js
  │ .opencode/skill/system-spec-kit/shared/dist/trigger-extractor.js
  └ L261:616 (356 lines read)

● Read rrf-fusion.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/rrf-fusion.js
  └ L261:517 (257 lines read)

● Read fusion-lab.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js
  └ L261:413 (153 lines read)

I’ve already confirmed one concrete default-flag bug and one score-normalization contract bug. I’m sweeping the remaining helpers for similarly evidence-backed issues before I finalize the report.

● Read factory.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings/factory.js
  └ L1:260 (260 lines read)

● Read learned-combiner.js
  │ .opencode/skill/system-spec-kit/shared/dist/ranking/learned-combiner.js
  └ L1:260 (260 lines read)

● Read path-security.js
  │ .opencode/skill/system-spec-kit/shared/dist/utils/path-security.js
  └ L1:220 (108 lines read)

● Read retry.js
  │ .opencode/skill/system-spec-kit/shared/dist/utils/retry.js
  └ L1:260 (260 lines read)

● Read retry.js
  │ .opencode/skill/system-spec-kit/shared/dist/utils/retry.js
  └ L261:318 (58 lines read)

● Read (Code-review agent — Review shared JS)
  └ Running

● Search (grep)
  │ "!== 'false'|!== '0'|toLowerCase\(\)\.trim\(\)" in **/*.js
  │ (.opencode/skill/system-spec-kit/shared/dist)
  └ 13 lines found

● Search (grep)
  │ "result\.value|\.score\b" in **/*.js (.opencode/skill/system-spec-kit/shared/dist/algorithms)
  └ 25 lines found

● Read adaptive-fusion.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js
  └ L1:323 (323 lines read)

● Read mmr-reranker.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.js
  └ L1:220 (104 lines read)

● Read chunking.js
  │ .opencode/skill/system-spec-kit/shared/dist/chunking.js
  └ L1:220 (100 lines read)

● Read normalization.js
  │ .opencode/skill/system-spec-kit/shared/dist/normalization.js
  └ L1:240 (219 lines read)

● Read folder-scoring.js
  │ .opencode/skill/system-spec-kit/shared/dist/scoring/folder-scoring.js
  └ L1:320 (288 lines read)

● Read structure-aware-chunker.js
  │ .opencode/skill/system-spec-kit/shared/dist/lib/structure-aware-chunker.js
  └ L1:220 (148 lines read)

● Read jsonc-strip.js
  │ .opencode/skill/system-spec-kit/shared/dist/utils/jsonc-strip.js
  └ L1:220 (86 lines read)

● Read paths.js
  │ .opencode/skill/system-spec-kit/shared/dist/paths.js
  └ L1:160 (65 lines read)

I want to be able to say this was a true full-file pass, not just targeted spot checks, so I’m loading the remainder of the combined source dump in contiguous chunks now.

✗ Read shared-js-review.txt
  │ /tmp/shared-js-review.txt
  └ Permission denied and could not request permission from user

✗ Read shared-js-review.txt
  │ /tmp/shared-js-review.txt
  └ Permission denied and could not request permission from user

✗ Read shared-js-review.txt
  │ /tmp/shared-js-review.txt
  └ Permission denied and could not request permission from user

✗ Read shared-js-review.txt
  │ /tmp/shared-js-review.txt
  └ Permission denied and could not request permission from user

✗ Read shared-js-review.txt
  │ /tmp/shared-js-review.txt
  └ Permission denied and could not request permission from user

✗ Read shared-js-review.txt
  │ /tmp/shared-js-review.txt
  └ Permission denied and could not request permission from user

● Read retrieval-trace.js
  │ .opencode/skill/system-spec-kit/shared/dist/contracts/retrieval-trace.js
  └ L1:220 (104 lines read)

● Read memory-sufficiency.js
  │ .opencode/skill/system-spec-kit/shared/dist/parsing/memory-sufficiency.js
  └ L1:320 (291 lines read)

● Read memory-template-contract.js
  │ .opencode/skill/system-spec-kit/shared/dist/parsing/memory-template-contract.js
  └ L1:340 (302 lines read)

● Read spec-doc-health.js
  │ .opencode/skill/system-spec-kit/shared/dist/parsing/spec-doc-health.js
  └ L1:360 (323 lines read)

● Read (Code-review agent — Review shared JS)
  └ Running

● Read hf-local.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings/providers/hf-local.js
  └ L1:320 (291 lines read)

● Read openai.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings/providers/openai.js
  └ L1:280 (247 lines read)

● Read voyage.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings/providers/voyage.js
  └ L1:320 (273 lines read)

● Read learned-combiner.js
  │ .opencode/skill/system-spec-kit/shared/dist/ranking/learned-combiner.js
  └ L261:401 (141 lines read)

● Read factory.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings/factory.js
  └ L261:506 (246 lines read)

● Read matrix-math.js
  │ .opencode/skill/system-spec-kit/shared/dist/ranking/matrix-math.js
  └ L1:220 (143 lines read)

● Read index.js
  │ .opencode/skill/system-spec-kit/shared/dist/index.js
  └ L1:220 (155 lines read)

● Read index.js
  │ .opencode/skill/system-spec-kit/shared/dist/algorithms/index.js
  └ L1:120 (23 lines read)

● Read config.js
  │ .opencode/skill/system-spec-kit/shared/dist/config.js
  └ L1:120 (49 lines read)

● Read profile.js
  │ .opencode/skill/system-spec-kit/shared/dist/embeddings/profile.js
  └ L1:180 (71 lines read)

● Read types.js
  │ .opencode/skill/system-spec-kit/shared/dist/types.js
  └ L1:120 (18 lines read)

The parallel review pass just finished. I’m pulling its results now and using them to double-check the last unread files before I write the final findings-only report.

● Read (Code-review agent — Review shared JS)
  └ idle

● Read quality-extractors.js
  │ .opencode/skill/system-spec-kit/shared/dist/parsing/quality-extractors.js
  └ L1:220 (50 lines read)

● Read quality-extractors.test.js
  │ .opencode/skill/system-spec-kit/shared/dist/parsing/quality-extractors.test.js
  └ L1:220 (120 lines read)

● Read spec-doc-health.test.js
  │ .opencode/skill/system-spec-kit/shared/dist/parsing/spec-doc-health.test.js
  └ L1:260 (228 lines read)

● Read token-estimate.js
  │ .opencode/skill/system-spec-kit/shared/dist/utils/token-estimate.js
  └ L1:80 (17 lines read)

# Iteration 003: Shared Modules Correctness Review
## Agent: copilot / gpt-5.4 / high
## Dimension: correctness
## Files Reviewed
- `.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js`
- `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js`
- `.opencode/skill/system-spec-kit/shared/dist/algorithms/index.js`
- `.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.js`
- `.opencode/skill/system-spec-kit/shared/dist/algorithms/rrf-fusion.js`
- `.opencode/skill/system-spec-kit/shared/dist/chunking.js`
- `.opencode/skill/system-spec-kit/shared/dist/config.js`
- `.opencode/skill/system-spec-kit/shared/dist/contracts/retrieval-trace.js`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings.js`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings/factory.js`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings/profile.js`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings/providers/hf-local.js`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings/providers/openai.js`
- `.opencode/skill/system-spec-kit/shared/dist/embeddings/providers/voyage.js`
- `.opencode/skill/system-spec-kit/shared/dist/index.js`
- `.opencode/skill/system-spec-kit/shared/dist/lib/structure-aware-chunker.js`
- `.opencode/skill/system-spec-kit/shared/dist/normalization.js`
- `.opencode/skill/system-spec-kit/shared/dist/parsing/memory-sufficiency.js`
- `.opencode/skill/system-spec-kit/shared/dist/parsing/memory-template-contract.js`
- `.opencode/skill/system-spec-kit/shared/dist/parsing/quality-extractors.js`
- `.opencode/skill/system-spec-kit/shared/dist/parsing/quality-extractors.test.js`
- `.opencode/skill/system-spec-kit/shared/dist/parsing/spec-doc-health.js`
- `.opencode/skill/system-spec-kit/shared/dist/parsing/spec-doc-health.test.js`
- `.opencode/skill/system-spec-kit/shared/dist/paths.js`
- `.opencode/skill/system-spec-kit/shared/dist/ranking/learned-combiner.js`
- `.opencode/skill/system-spec-kit/shared/dist/ranking/matrix-math.js`
- `.opencode/skill/system-spec-kit/shared/dist/scoring/folder-scoring.js`
- `.opencode/skill/system-spec-kit/shared/dist/trigger-extractor.js`
- `.opencode/skill/system-spec-kit/shared/dist/types.js`
- `.opencode/skill/system-spec-kit/shared/dist/utils/jsonc-strip.js`
- `.opencode/skill/system-spec-kit/shared/dist/utils/path-security.js`
- `.opencode/skill/system-spec-kit/shared/dist/utils/retry.js`
- `.opencode/skill/system-spec-kit/shared/dist/utils/token-estimate.js`

## Findings
### P1-001: Score normalizers accept `value` but then compute with `score`
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js:49-55`, `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js:64-80`, `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js:94-99`, `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js:103-125`
- Description: `minMaxNormalize()` and `zScoreNormalize()` filter items by `result.score ?? result.value`, but the later math always reads `r.score`. For inputs that only populate `value`, the item survives filtering yet `r.score` stays `undefined`, so min/max, sums, variance, and normalized outputs become `NaN`.
- Impact: Any caller that passes value-only scored results can get corrupted normalization and unstable or invalid fused rankings from `minmax_linear` / `zscore_linear`.
- Fix: Normalize into a local numeric `effectiveScore` first, or map each retained item to `{ ...result, score: result.score ?? result.value }` before running the math.

### P2-002: Shadow fusion flag is documented as default-OFF but implemented as default-ON
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js:29-35`, `.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js:324-339`
- Description: The module header and JSDoc say `SPECKIT_FUSION_POLICY_SHADOW_V2` is default OFF, but `isShadowFusionV2Enabled()` returns true whenever the env var is unset because it only disables on `'false'`/`'0'`.
- Impact: The system runs all three fusion policies in parallel by default instead of only the active policy, changing runtime behavior and overhead from the documented rollout contract.
- Fix: Make the unset case return `false`, or update both docs and callers if graduated-ON behavior is actually intended.

### P2-003: Empty `anchors` arrays suppress fallback extraction from content
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/shared/dist/parsing/memory-sufficiency.js:200-208`, `.opencode/skill/system-spec-kit/shared/dist/parsing/memory-sufficiency.js:252-255`
- Description: Anchor fallback uses `snapshot.anchors || extractAnchorsFromContent(...)`. In JavaScript, `[]` is truthy, so callers that pass an empty anchors array prevent content-based anchor extraction even when the markdown actually contains anchors.
- Impact: `evaluateMemorySufficiency()` can undercount support evidence and anchor presence, causing borderline memories to be scored lower or rejected unnecessarily.
- Fix: Use an explicit length check, e.g. `snapshot.anchors?.length ? snapshot.anchors : extractAnchorsFromContent(...)`.

## Summary
- Total findings: 3 (P0: 0, P1: 1, P2: 2)
- newFindingsRatio: 1.00


Total usage est:        1 Premium request
API time spent:         6m 40s
Total session time:     5m 0s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.9m in, 15.7k out, 1.8m cached (Est. 1 Premium request)
 claude-sonnet-4.5        1.3m in, 6.3k out, 1.1m cached (Est. 0 Premium requests)
