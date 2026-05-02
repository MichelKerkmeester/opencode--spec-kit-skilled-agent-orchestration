● skill(sk-code-opencode)

I’m reading the affinity implementation, tests, and a bit of surrounding context so I can evaluate failure modes and propose concrete ranking upgrades rather than hand-wavy ideas.

● Read spec-affinity.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts
  └ 546 lines read

● Read spec-affinity.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts
  └ 131 lines read

● Search (grep)
  │ "spec-affinity|computeSpecAffinity|KEYWORD_STOPWORDS|SPEC_ID_REGEX|normalizeText" in
  │ **/*.{ts,tsx,js,json} (.opencode/skill/system-spec-kit/scripts)
  └ 28 lines found

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

I’ve got the core implementation loaded. Next I’m checking nearby ranking/search code and sampling real spec metadata so the proposals are grounded in how this repo actually names specs and stores signals.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L760:840 (81 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:220 (220 lines read)

● search BM25 TF-IDF lexical ranking scoring search relevance in system-spec-kit
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search embedding similarity or semantic matching code in system-spec-kit scripts and mcp_server
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/9ab5dba5-4e0f-4b3c-b2b3-eaee82b5b03d/plan.md'
  │ <<'EOF'
  │ 1. Read spec-affinity implementation and tests.
  │ 2. Inspect adjacent workflow/search code for current integration points and reusable scoring …
  └ 7 lines...

● Run spec affinity tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npm test -- --run
  │ tests/spec-affinity.vitest.ts
  └ 14 lines...

● Analyze spec token frequencies (shell)
  │ python3 - <<'PY'
  │ import json, os, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ base = root / '.opencode' / 'specs'…
  └ 103 lines...

The implementation is smaller than the surrounding system, so I’m now stress-testing it conceptually against real spec names and the repo’s existing semantic-indexing components. That should let me separate “easy heuristics” from “worth doing only if infrastructure already exists.”

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts
  └ L1:220 (9 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ 44 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ 28 lines read

● Search (grep)
  │ "bm25|tf-idf|tfidf|embedding|cosine|similarity|rank|score" in **/*.{ts,tsx,js,md,json}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Measure spec metadata token distribution (shell)
  │ python3 - <<'PY'
  │ import json, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ roots = [root/'specs', root/'.opencode'/'specs']…
  └ 327 lines...

● Estimate cross-spec token collisions (shell)
  │ python3 - <<'PY'
  │ import json, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ roots = [root/'specs', root/'.opencode'/'specs']…
  └ 111 lines...

I’ve confirmed there’s existing embedding infrastructure in the workspace, which matters because it changes “can we do semantic affinity?” from hypothetical to implementable. I’m now quantifying where the current lexical rule set would collide across real spec folders.

● Read copilot-tool-output-1774000496261-7bvrgo.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774000496261-7bvrgo.txt
  └ L1:200 (44 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "\bBM25\b|\bbm25\b|tf-idf|tfidf|sqlite-vec|cosine similarity|cosineSimilarity|dot
  │ product|embedding similarity|hybrid retrieval|lexical" in
  │ {shared,mcp_server,scripts}/**/*.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ No matches found

● Simulate lexical false positives and negatives (shell)
  │ python3 - <<'PY'
  │ import json, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ roots = [root/'specs', root/'.opencode'/'specs']…
  └ 191 lines...

I found a strong signal already: the current target construction appears to inherit very generic trigger phrases from spec metadata, which can turn phrase-matching into “match almost any spec doc.” I’m verifying that with a concrete example from a real spec folder rather than relying on the simulation alone.

● Read description.json
  │ specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/description.json
  └ 41 lines read

● Read description.json
  │ specs/system-spec-kit/021-spec-kit-phase-system/description.json
  └ 19 lines read

● Read spec.md
  │ specs/system-spec-kit/021-spec-kit-phase-system/spec.md
  └ L1:120 (120 lines read)

● Read spec.md
  │ specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  └ L1:80 (79 lines read)

● Verify real false positive example (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx tsx -e "const {buildSpecAffinityTar
  │ gets,matchesSpecAffinityText,evaluateSpecAffinityText}=require('./utils/spec-affinity'); const
  │ a=buildSpecAffinityTargets('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/specs/system-spec-kit/021-spec-kit-phase-system'); const text='Feature …
  └ 34 lines...

Confirmed: this isn’t just theoretical. A real spec currently builds `exactPhrases` that include raw triggers like `"feature"` and `"specification"`, so unrelated spec titles can score as relevant immediately. I’m pulling one more pass on retrieval infrastructure now so the proposals can cleanly distinguish “lexical fix,” “hybrid fix,” and “full semantic fix.”

● Read index.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/index.ts
  └ L1:80 (80 lines read)

● Search (grep)
  │ "FTS5|fts5|bm25|rank_bm25|sqlite_vec|sqlite-vec|cosine|similarity" in
  │ {shared,mcp_server,scripts}/**/*.{ts,js,sql,md} (.opencode/skill/system-spec-kit)
  └ No matches found

● Sample files-to-change structural signals (shell)
  │ python3 - <<'PY'
  │ import re, json
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ files = […
  └ 61 lines...

● Measure repeated trigger phrases (shell)
  │ python3 - <<'PY'
  │ import json, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ roots = [root/'specs', root/'.opencode'/'specs']…
  └ 104 lines...

I’ve got two concrete repo-level findings now: generic trigger phrases are widespread, and there are a lot of cross-spec lexical overlaps in real metadata. I’m doing a final pass for existing SQL/vector retrieval plumbing so the proposals map onto what the codebase can realistically adopt quickly.

● Read test-embeddings-factory.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js
  └ L1:220 (117 lines read)

● Search (grep)
  │ "CREATE VIRTUAL TABLE.*fts5|fts5\(|MATCH \?|MATCH '|sqlite-vec|sqlite_vec|vec0|embedding" in
  │ {shared,mcp_server,scripts}/**/*.{ts,js,sql} (.opencode/skill/system-spec-kit)
  └ No matches found

● Verify cleaned file targets (shell)
  │ python3 - <<'PY'
  │ import re, json
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ files = […
  └ 24 lines...

● Inspect target payload and aggregate evaluation (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx tsx -e "const
  │ {buildSpecAffinityTargets,evaluateCollectedDataSpecAffinity}=require('./utils/spec-affinity');
  │ const s=buildSpecAffinityTargets('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/specs/system-spec-kit/021-spec-kit-phase-system'); …
  └ 57 lines...

I’ve got enough to make the key call: the current system is brittle mostly because of target construction, not just because it lacks embeddings. I’m pulling the exact embedding API exports now so I can say whether semantic affinity is feasible immediately or would still need plumbing work.

● Read spec-affinity.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts
  └ L12:120 (109 lines read)

● Read spec-affinity.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts
  └ L217:392 (176 lines read)

● Read spec-affinity.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts
  └ L26:131 (106 lines read)

● Search (grep)
  │ "generateDocumentEmbedding|generateQueryEmbedding|getEmbeddingDimension|getProviderMetadata|getE
  │ mbeddingProfile|createEmbeddingsProvider" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/shared)
  └ 25 lines found

I’ve verified the repo already exposes `generateDocumentEmbedding` and `generateQueryEmbedding` in the shared package, so semantic affinity is technically feasible today. I just need one last look at how expensive/async that path is before I rank it against a cheaper lexical hybrid.

● Read index.ts
  │ .opencode/skill/system-spec-kit/shared/index.ts
  └ L80:140 (61 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L320:660 (340 lines read)

● Find specs with sparse lexical vocab (shell)
  │ python3 - <<'PY'
  │ import json, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ roots = [root/'specs', root/'.opencode'/'specs']…
  └ 104 lines...

I have the shape of the problem, but I want the benchmark numbers cleaned up so they’re not inflated by mirrored `.opencode/specs` copies. One last synthetic pass on the primary `specs/` tree and then I can give you a sharper proposal stack.

● Compute cause percentages (shell)
  │ python3 - <<'PY'
  │ from math import isfinite
  │ causes={'phrase':112616,'kw2':9836,'kw3':5540,'kw4':968,'file':5432,'kw5':148,'kw6':104,'kw7':
  │ 68,'kw8':12,'kw9':16}
  │ total=sum(causes.values())…
  └ 14 lines...

● Recompute lexical benchmark on primary specs tree (shell)
  │ python3 - <<'PY'
  │ import json, re
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs')
  │ STOP = {…
  └ 156 lines...

I’ve got the cleaned benchmark now: on a synthetic cross-spec test over `specs/`, lexical affinity fires on about 27% of negative pairs, and ~84% of those hits come from phrase matches, not keyword thresholds. That points very directly at the highest-value fix.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L540:608 (68 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L520:620 (100 lines read)

● Search (grep)
  │ "evaluateCollectedDataSpecAffinity\(|buildSpecAffinityTargets\(|matchesSpecAffinityText\(" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/scripts)
  └ 17 lines found

I traced the call sites too: `spec-affinity` isn’t isolated. It’s used both in the workflow save path and in input normalization, so any semantic upgrade would ripple into hot-path filtering logic and likely force async changes unless kept as an optional reranker.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L884:915 (32 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L944:1006 (63 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1428:1450 (23 lines read)

I analyzed `spec-affinity.ts` and its tests, plus the surrounding embedding/relevance pipeline. Bottom line: the biggest problem is not “no embeddings,” it’s that target construction currently promotes generic phrases into hard anchors, so the boolean matcher is far too eager.

Direct answers:

1. Keyword matching is only strong when the text contains explicit spec IDs, exact file paths, or very distinctive slug/title tokens. It is weak on paraphrases and on families of related specs with overlapping vocabulary. The current matcher is pure lexical OR logic (`matchedFileTargets || matchedPhrases || matchedSpecId || >=2 keywords`) with no weighting or rarity model [`spec-affinity.ts:354-392`].

2. Yes, embedding similarity is technically feasible now. The workspace already exports async `generateDocumentEmbedding` / `generateQueryEmbedding`, with lazy provider init and caching [`shared/index.ts:82-133`, `shared/embeddings.ts:326-345`, `shared/embeddings.ts:543-607`]. But `spec-affinity` is used in sync hot paths in both `workflow.ts` and `input-normalizer.ts`, so a full replacement would force async plumbing through those call sites [`workflow.ts:1433-1437`, `input-normalizer.ts:890-902`, `input-normalizer.ts:944-999`].

3. True FP/FN rates are unknown because there is no labeled eval set and only 3 unit tests exist, all basic happy-path cases [`spec-affinity.vitest.ts:26-131`]. On a synthetic cross-spec benchmark over `specs/**/spec.md` (350 spec packs), the current logic fired on `33,512 / 122,150` negative cross-spec pairs (`27.44%`). `83.5%` of those false hits came from phrase matches, not keyword thresholds. Self-match false negatives were `0/350` for title/trigger positives, which is expected because the matcher is built from the same metadata.

4. `KEYWORD_STOPWORDS` is not well-calibrated enough. It filters some generic terms (`feature`, `phase`, `system`, `spec`) [`spec-affinity.ts:17-63`], but misses very high-frequency generic triggers like `specification`. In the real corpus, `226/350` specs had generic single-word triggers, and one real spec (`021-spec-kit-phase-system`) currently builds `exactPhrases` containing `"feature"` and `"specification"`, causing unrelated spec titles to match.

5. A lightweight TF-IDF/BM25-style scorer is the best next step. It would downweight corpus-common terms without forcing async embedding calls, and it fits this sync filter better than a full semantic rewrite.

6. Yes: structural signals should be fused with content. File targets, spec IDs, parent-chain segments, branch/path segments, and even spec anchors/headings are all stronger than generic phrase hits.

Proposals:

- `AFFINITY-001` — **P0 / Medium**: Remove generic trigger phrases from `exactPhrases`, or at least never let single-word triggers become exact anchors. Evidence: `buildSpecAffinityTargets()` currently copies raw trigger phrases straight into `exactPhrases` [`spec-affinity.ts:301-334`].

- `AFFINITY-002` — **P0 / Small**: Replace substring token matching with token-boundary matching. `countKeywordMatches()` uses `normalizedText.includes(token)`, so partial-word collisions are possible [`spec-affinity.ts:350-351`].

- `AFFINITY-003` — **P1 / Medium**: Move from boolean OR to weighted scoring. Example: `+5` exact spec ID, `+4` file target, `+3` rare slug phrase, `+idf(token)` lexical hits, `-5` foreign spec ID. Require either one structural hit or a score threshold.

- `AFFINITY-004` — **P1 / Medium**: Add corpus-derived IDF / BM25-lite over spec title + slug + triggers + file targets. This should improve precision much more cheaply than embeddings.

- `AFFINITY-005` — **P2 / Large**: Add embedding reranking only for ambiguous cases. Use lexical/structural scoring first, then embed the aggregated candidate text against a precomputed spec representation if the lexical score lands in a gray zone.

- `AFFINITY-006` — **P1 / Small**: Add adversarial tests. Current tests do not cover generic trigger phrases, cross-spec collisions, spec-ID prose false positives, or low-vocabulary specs [`spec-affinity.vitest.ts:26-131`].

If you want, I can turn this into a concrete implementation plan next.


Total usage est:        1 Premium request
API time spent:         5m 23s
Total session time:     6m 16s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.1m in, 20.6k out, 1.0m cached (Est. 1 Premium request)
