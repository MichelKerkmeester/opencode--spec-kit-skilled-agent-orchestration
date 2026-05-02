● skill(sk-code-review)

I’m auditing the catalog against the actual implementation now. I’ll inventory the 22 docs, scan both codebases, then produce a file-by-file alignment report with severity counts.

● memory_context
  └ {"summary":"Context retrieved via quick mode (quick strategy)","data":{"strat...

● Route skill and list catalog files (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/ against mcp_server
  │ and scripts source code, flag mismatches" --threshold 0.8 && printf '\n---DIR---\n' && find
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration -maxdepth 1 -type f
  │ -name '*.md' | sort
  └ 59 lines...

I’ve got the catalog inventory and routing. Next I’m loading the review/overlay guidance plus the 22 catalog files, then I’ll cross-check each claim against both `mcp_server` and `scripts`.

● Read SKILL.md
  │ .agents/skills/sk-code-opencode/SKILL.md
  └ 1 line read

● skill(sk-code-opencode)

● Read review_core.md
  │ .agents/skills/sk-code-review/references/review_core.md
  └ 98 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code-review/references/quick_reference.md
  └ 59 lines read

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 9 lines...

I’ve loaded the review baseline and the OpenCode overlay. Now I’m checking the structure of the 22 docs so I can distinguish claimed features from background/context and avoid false mismatches.

● Summarize catalog doc structure (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')
  │ for p in sorted(base.glob('*.md')):
  │ text = p.read_text()…
  └ 238 lines...

● search scoring normalization novelty boost interference scoring classification based decay folder…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Search (grep)
  │ "^# " in *.md (.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration)
  └ 22 lines found

● Extract core sections from all docs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')
  │ for p in sorted(base.glob('*.md')):…
  └ 32 lines...

● Read 01-score-normalization.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalizati
  │ on.md
  └ 77 lines read

● Read 14-local-gguf-reranker-via-node-llama-cpp.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-rerank
  │ er-via-node-llama-cpp.md
  └ 127 lines read

● Read 18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-r
  │ anking-bounded-proposals-and-rollback.md
  └ 55 lines read

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 34 files found

● List directory .opencode/skill/system-spec-kit/scripts
  └ 34 files found

● Search (glob)
  │ "**/shared/**" in .opencode/skill/system-spec-kit/mcp_server
  └ No matches found

● Search (glob)
  │ "**/shared/**" in .opencode/skill/system-spec-kit/scripts
  └ No matches found

The docs are structured consistently, which helps. I’m now turning each file into a checklist of claimed paths/identifiers and comparing that against the current tree to spot stale references versus truly missing features.

✗ Read catalog_audit_inputs.json
  │ ~/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/files/catalog_audit_inputs.json
  └ Path does not exist

● Parse docs into audit inputs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ root = Path('.opencode/skill/system-spec-kit')
  │ base = root/'feature_catalog/11--scoring-and-calibration'…
  └ 22 lines...

● Read shell output Waiting up to 10 seconds for command output
  └ 1 line...

● List shells
  └ Active shell sessions:

I hit a bad shell pattern while generating the audit input file, so I’m restarting that step cleanly and keeping the review moving. After that I’ll use the generated matrix to validate each catalog entry against live code.

● Stop shell
  └ 1 line...

● Find missing referenced paths (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ root = Path('.opencode/skill/system-spec-kit')
  │ base = root/'feature_catalog/11--scoring-and-calibration'…
  └ 17 lines...

● Parse docs into audit inputs (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ root = Path('.opencode/skill/system-spec-kit')
  │ base = root/'feature_catalog/11--scoring-and-calibration'…
  └ 22 lines...

● Read catalog_audit_inputs.json
  │ ~/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/files/catalog_audit_inputs.json
  └ 1 line read

● Search (grep)
  │ "SPECKIT_SCORE_NORMALIZATION|normalizeRrfScores|normalizeCompositeScores|RERANKER_LOCAL|SPECKIT_
  │ MEMORY_ADAPTIVE_RANKING|effectiveScore|negative feedback|auto-promot|promotion|RRF_K|overlap
  │ bonus|holdout|learned stage 2|tool-level ttl|embedding cache|folder scoring|interference" in
  │ {mcp_server,scripts}/**/*.{ts,js,py,sh} (.opencode/skill/system-spec-kit)
  └ No matches found

● Generate token hit matrix (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json, subprocess, shlex
  │ root = Path('.opencode/skill/system-spec-kit')
  │ base = root/'feature_catalog/11--scoring-and-calibration'…
  └ 57 lines...

● Extract current reality lead lines (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')
  │ for p in sorted(base.glob('*.md')):…
  └ 30 lines...

● List inline code tokens per doc (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')
  │ for p in sorted(base.glob('*.md')):…
  └ 52 lines...

The first pass is useful: most docs have live `mcp_server` evidence, but a few either reference deleted paths or describe features that look disabled/aspirational. I’m now pulling exact file-line evidence so the final report is specific instead of guessy.

● Summarize doc claim strength (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')
  │ keywords = ['IMPLEMENTED', 'EFFECTIVELY DISABLED', 'graduated', 'introduced', 'now', …
  └ 32 lines...

● Build file-line evidence matrix (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ root = Path('.opencode/skill/system-spec-kit')
  │ source_roots = [root/'mcp_server', root/'scripts']…
  └ 62 lines...

✗ Read catalog_evidence.json
  │ ~/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/files/catalog_evidence.json
  └ Path does not exist

● Build file-line evidence matrix (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ root = Path('.opencode/skill/system-spec-kit')
  │ source_roots = [root/'mcp_server', root/'scripts']…
  └ 53 lines...

● Read catalog_evidence.json
  │ ~/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/files/catalog_evidence.json
  └ L1:260 (260 lines read)

● Read catalog_evidence.json
  │ ~/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/files/catalog_evidence.json
  └ L260:520 (261 lines read)

● Read catalog_evidence.json
  │ ~/.copilot/session-state/c4b842ae-3516-43ce-9767-8799f1c14248/files/catalog_evidence.json
  └ L520:700 (80 lines read)

● Read 05-folder-level-relevance-scoring.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-rele
  │ vance-scoring.md
  └ 58 lines read

● Read folder-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts
  └ 21 lines read

● Read folder-relevance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
  └ 238 lines read

✗ Read folder-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/shared/scoring/folder-scoring.ts
  └ Path does not exist

● Search (glob)
  │ "**/rrf-fusion.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (glob)
  │ "**/folder-scoring.ts" in .opencode/skill/system-spec-kit
  └ 2 files found

● Search (glob)
  │ "**/local-reranker.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

I found one clear drift already: `05-folder-level-relevance-scoring.md` describes a four-factor folder formula, but the live `folder-relevance.ts` implementation is the damped `DocScore = (1/sqrt(M+1))*SUM(score)` path instead. I’m validating the rest of the “maybe stale” entries the same way.

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ 1 line read

● Read 17-temporal-structural-coherence-scoring.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structur
  │ al-coherence-scoring.md
  └ 50 lines read

● Read 13-scoring-and-fusion-corrections.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusio
  │ n-corrections.md
  └ 73 lines read

● Read 06-embedding-cache.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.m
  │ d
  └ 46 lines read

● Read embedding-cache.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
  └ 226 lines read

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ L1:260 (260 lines read)

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ L242:430 (189 lines read)

✗ Read learned-combiner.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-combiner.ts
  └ Path does not exist

● Read 08-rrf-k-value-sensitivity-analysis.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensi
  │ tivity-analysis.md
  └ 46 lines read

● Read k-value-analysis.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts
  └ 1 line read

● Read 19-learned-stage2-weight-combiner.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/19-learned-stage2-we
  │ ight-combiner.md
  └ 53 lines read

● Read learned-combiner.ts
  │ .opencode/skill/system-spec-kit/shared/ranking/learned-combiner.ts
  └ 558 lines read

● Read k-value-analysis.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts
  └ L1:260 (260 lines read)

● Read 20-shadow-feedback-holdout-evaluation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/20-shadow-feedback-h
  │ oldout-evaluation.md
  └ 47 lines read

● Read shadow-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts
  └ L1:260 (260 lines read)

● Read 10-auto-promotion-on-validation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on
  │ -validation.md
  └ 65 lines read

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L520:700 (176 lines read)

● Search (grep)
  │ "fuseResultsRsf|canonicalRrfId|withSyncedScoreAliases|syncScoreAliasesInPlace" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/shared)
  └ 7 lines found

● Search (grep)
  │ "fuseResultsRsf|canonicalRrfId|withSyncedScoreAliases|syncScoreAliasesInPlace|computeInterferenc
  │ eScoresBatch|resolveEffectiveScore" in {lib,handlers,tests,core,configs,shared}/**/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

I’ve isolated the likely drift cases. I’m doing one last pass over `scripts/` now so I can explicitly say whether each feature is `mcp_server`-only or actually has companion implementation there too.

● Search (grep)
  │ "SPECKIT_SCORE_NORMALIZATION|SPECKIT_NOVELTY_BOOST|SPECKIT_INTERFERENCE_SCORE|SPECKIT_CLASSIFICA
  │ TION_DECAY|SPECKIT_FOLDER_SCORING|SPECKIT_NEGATIVE_FEEDBACK|SPECKIT_MEMORY_ADAPTIVE_RANKING|SPEC
  │ KIT_LEARNED_STAGE2_COMBINER|SPECKIT_SHADOW_FEEDBACK|SPECKIT_CALIBRATED_OVERLAP_BONUS|SPECKIT_RRF
  │ _K_EXPERIMENTAL|RERANKER_LOCAL" in **/*.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Check scripts matches per feature (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, subprocess
  │ base = Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')
  │ scripts = Path('.opencode/skill/system-spec-kit/scripts')…
  └ 58 lines...

I’ve confirmed `scripts/` doesn’t materially implement these scoring features; almost all real behavior lives in `mcp_server` plus a few shared modules. I’m pulling a final set of exact source snippets for the remaining edge cases, then I’ll deliver the per-file verdicts.

● Search (grep)
  │ "SPECKIT_NOVELTY_BOOST|calculateNoveltyBoost|noveltyBoostApplied"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts)
  └ 3 lines found

● Search (grep)
  │ "SPECKIT_INTERFERENCE_SCORE|computeInterferenceScoresBatch|INTERFERENCE_SIMILARITY_THRESHOLD"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts)
  └ 8 lines found

● Search (grep)
  │ "SPECKIT_CLASSIFICATION_DECAY|halfLifeDays|stability adjustment|classification decay"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts)
  └ 6 lines found

● Search (grep)
  │ "executeAutoPromotion|PROMOTION_PATHS|MAX_PROMOTIONS_PER_WINDOW|PROMOTION_WINDOW_HOURS|memory_pr
  │ omotion_audit" (.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts)
  └ 13 lines found

● Search (grep)
  │ "recordNegativeFeedbackEvent|RECOVERY_HALF_LIFE_MS|SPECKIT_NEGATIVE_FEEDBACK|negative_feedback_e
  │ vents" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 17 lines found

● Search (grep)
  │ "resolveEffectiveScore|withSyncedScoreAliases|syncScoreAliasesInPlace|stage2Score" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 39 lines found

● Read folder-scoring.ts
  │ .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "computeSingleFolderScore|computeFolderScores|folder-relevance|twoPhaseRetrieval|computeFolderRe
  │ levanceScores" in {mcp_server,shared,scripts}/**/*.{ts,js,py,sh}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search folder scoring call sites (shell)
  │ rg -n
  │ "computeSingleFolderScore|computeFolderScores|twoPhaseRetrieval|computeFolderRelevanceScores"
  │ .opencode/skill/system-spec-kit/{mcp_server,shared,scripts} --glob '*.{ts,js,py,sh}' | head -n
  │ 120
  └ 77 lines...

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1248:1280 (32 lines read)

● Read rank-memories.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts
  └ L1:220 (220 lines read)

● Read 11-scoring-and-ranking-corrections.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranki
  │ ng-corrections.md
  └ 58 lines read

● Read rrf-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ L100:140 (41 lines read)

● Read rrf-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ L612:632 (21 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L40:90 (51 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L248:270 (23 lines read)

I searched both requested trees. Real implementation is overwhelmingly in `mcp_server` (plus shared modules it imports); `scripts/` only had direct touchpoints for folder scoring and ablation tooling.

`01-score-normalization.md | ALIGNED | mcp_server/shared normalization hooks match the catalog (`shared/algorithms/rrf-fusion.ts`, `mcp_server/lib/scoring/composite-scoring.ts`); no direct scripts implementation.`

`02-cold-start-novelty-boost.md | ALIGNED | Catalog correctly says effectively disabled: `mcp_server/lib/scoring/composite-scoring.ts:482-487` makes `SPECKIT_NOVELTY_BOOST` inert and telemetry stays `noveltyBoostApplied: false`.`

`03-interference-scoring.md | ALIGNED | `mcp_server/lib/scoring/interference-scoring.ts` implements batch interference scoring, configurable threshold, and `SPECKIT_INTERFERENCE_SCORE`; no scripts-side implementation.`

`04-classification-based-decay.md | ALIGNED | `mcp_server/lib/cognitive/fsrs-scheduler.ts` contains classification-gated decay under `SPECKIT_CLASSIFICATION_DECAY`; no scripts implementation.`

`05-folder-level-relevance-scoring.md | PARTIAL | The four-factor folder formula is real in `shared/scoring/folder-scoring.ts:55-63,186-234` and used by `scripts/memory/rank-memories.ts:17-29,153-156`, but live two-phase retrieval in `mcp_server/lib/search/hybrid-search.ts:1256-1273` uses `computeFolderRelevanceScores()` from `mcp_server/lib/search/folder-relevance.ts:38-45` (DocScore), so the catalog conflates two different paths. P1.`

`06-embedding-cache.md | ALIGNED | `mcp_server/lib/cache/embedding-cache.ts` creates the SQLite `(content_hash, model_id)` cache, updates `last_used_at`, and evicts LRU-style; no scripts implementation.`

`07-double-intent-weighting-investigation.md | ALIGNED | The described multi-stage intent weighting still exists in the hybrid/intention/adaptive-fusion path; no direct scripts implementation.`

`08-rrf-k-value-sensitivity-analysis.md | ALIGNED | `mcp_server/lib/eval/k-value-analysis.ts:127-191` runs the documented K sweep `[10,20,40,60,80,100,120]` with MRR@5/Kendall tau metrics; no scripts implementation.`

`09-negative-feedback-confidence-signal.md | ALIGNED | `mcp_server/lib/scoring/negative-feedback.ts:34-164` records `negative_feedback_events` and applies 30-day recovery; `search-flags.ts` exposes `SPECKIT_NEGATIVE_FEEDBACK`.`

`10-auto-promotion-on-validation.md | ALIGNED | `mcp_server/lib/search/auto-promotion.ts` matches thresholds/throttle (`5/10`, `3 per 8h`) and audit table; `mcp_server/handlers/checkpoints.ts:582-661` returns `autoPromotion`.`

`11-scoring-and-ranking-corrections.md | ALIGNED | The four listed fixes are present across `composite-scoring.ts`, `causal-boost.ts`, and `lib/eval/ablation-framework.ts`; scripts only add ancillary ablation tooling.`

`12-stage-3-effectivescore-fallback-chain.md | ALIGNED | `mcp_server/lib/search/pipeline/types.ts:49-67` implements the documented fallback chain; `stage2-fusion.ts:250-270` syncs aliases and `stage3-rerank.ts` preserves `stage2Score`.`

`13-scoring-and-fusion-corrections.md | PARTIAL | Most fixes align, but item #13 is stale: the doc still describes `fuseResultsRsfMulti()` / `fuseResultsRsfCrossVariant()`, while current fusion exports only `canonicalRrfId`, `fuseResultsMulti`, `fuseResultsCrossVariant` from `shared/algorithms/rrf-fusion.ts:617-632`; RSF paths/tests are removed. P1.`

`14-local-gguf-reranker-via-node-llama-cpp.md | ALIGNED | `mcp_server/lib/search/local-reranker.ts` exists and the flag/model gating matches the catalog; no scripts implementation.`

`15-tool-level-ttl-cache.md | ALIGNED | `mcp_server/lib/cache/tool-cache.ts` provides TTL/max-entry tool caching as documented; no scripts implementation.`

`16-access-driven-popularity-scoring.md | ALIGNED | `mcp_server/lib/storage/access-tracker.ts` still exposes accumulator state, popularity score, usage boost, and batched flush behavior; no scripts implementation.`

`17-temporal-structural-coherence-scoring.md | PARTIAL | A coherence dimension exists in `mcp_server/handlers/quality-loop.ts:242-359`, but it checks structural quality, future-dated completion claims, and unresolved/self causal links—not the broader spec-folder chronology / non-existent-predecessor semantics the doc claims. P2.`

`18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md | ALIGNED | Adaptive-ranking shadow proposals and the `SPECKIT_MEMORY_ADAPTIVE_RANKING` rollback gate are present on the mcp_server side; no scripts implementation.`

`19-learned-stage2-weight-combiner.md | ALIGNED | `shared/ranking/learned-combiner.ts` matches ridge regression, LOOCV, SHAP, shadow scoring, and model persistence; no scripts implementation.`

`20-shadow-feedback-holdout-evaluation.md | ALIGNED | `mcp_server/lib/feedback/shadow-scoring.ts` matches deterministic holdout selection, weekly evaluation, promotion gate, and audit tables; no scripts implementation.`

`21-calibrated-overlap-bonus.md | ALIGNED | mcp_server flag wiring plus shared RRF fusion support calibrated overlap bonus with default-on disable switch; no scripts implementation.`

`22-rrf-k-experimental.md | ALIGNED | `search-flags.ts` + `mcp_server/lib/eval/k-value-analysis.ts` implement experimental/default-on K tuning and judged sweep helpers; no scripts implementation.`

`SUMMARY: total=22, aligned=19, partial=3, misaligned=0, P0=0, P1=2, P2=1.`

