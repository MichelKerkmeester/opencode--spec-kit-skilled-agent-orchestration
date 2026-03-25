● skill(sk-code--review)

I’m mapping each catalog entry to the actual `mcp_server` and `scripts` implementations, then I’ll score alignment per file and summarize the mismatches by severity.

✗ Read plan.md
  │ ~/.copilot/session-state/a62c3ce4-9c49-4e2b-9afe-0a97799b01c0/plan.md
  └ Path does not exist

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/*.md"
  └ 11 files found

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/ and compare
  │ described features against .opencode/skill/system-spec-kit/mcp_server and
  │ .opencode/skill/system-spec-kit/scripts source code" --threshold 0.8
  └ 59 lines...

● skill(sk-code--opencode)

I’ve got the 11 catalog files. Next I’m doing a bulk pass to extract each document’s claims and trace them to concrete code locations in both source trees so the final report is evidence-based, not just title-matched.

● Read 02-chunk-collapse-deduplication.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collap
  │ se-deduplication.md
  └ 48 lines read

● Read 01-graph-channel-id-fix.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channe
  │ l-id-fix.md
  └ 55 lines read

● Read 03-co-activation-fan-effect-divisor.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activatio
  │ n-fan-effect-divisor.md
  └ 47 lines read

● Read 04-sha-256-content-hash-deduplication.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-cont
  │ ent-hash-deduplication.md
  └ 69 lines read

● Read 05-database-and-schema-safety.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and
  │ -schema-safety.md
  └ 59 lines read

● Read 06-guards-and-edge-cases.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-e
  │ dge-cases.md
  └ 56 lines read

● Read 07-canonical-id-dedup-hardening.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id
  │ -dedup-hardening.md
  └ 43 lines read

● Read 08-mathmax-min-stack-overflow-elimination.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-
  │ stack-overflow-elimination.md
  └ 78 lines read

● Read 09-session-manager-transaction-gap-fixes.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/09-session-mana
  │ ger-transaction-gap-fixes.md
  └ 62 lines read

● Read 10-chunking-orchestrator-safe-swap.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orc
  │ hestrator-safe-swap.md
  └ 42 lines read

● Read 11-working-memory-timestamp-fix.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/11-working-memo
  │ ry-timestamp-fix.md
  └ 43 lines read

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/a62c3ce4-9c49-4e2b-9afe-0a97799b01c0/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read all 11 feature catalog markdown files in 08--bug-fixes-and-data-integrity.…
  └ 6 lines...

● Context Reviewing catalog alignment
  │ Search (grep)
  │   │ "frequency_counter|importance_weight|Math\.min\(1\.0, currentWeight \+ 0\.1\)|CREATE TABLE
  │   IF
  │   │ NOT EXISTS|ALTER TABLE|database\.transaction|source_id = \? OR target_id = \?|changes ===
  │   │ 0|db_connections = new Map|includeArchived" in
  │   **/{reconsolidation.ts,reconsolidation-bridge.ts,
  │   │ checkpoints.ts,causal-edges.ts,pe-gating.ts,vector-index-store.ts}
  │   │ (.opencode/skill/system-spec-kit/mcp_server)
  │   └ 5 lines found
  └ Search (grep)
      │ "j = i \+ 1|return null|most-recent|expires_at|slice\(0,
      limit\)|EMBEDDING_VALIDATION|partial"
      │ in **/{temporal-contiguity.ts,extraction-adapter.ts,vector-index-store.ts}
      │ (.opencode/skill/system-spec-kit/mcp_server)
      └ 55 lines found

I’ve finished the document read-through. I’m now spot-checking the most failure-prone claims directly in code: exact fix mechanics, source-file lists, and whether anything equivalent exists in `scripts` or if the doc is server-only by design.

● Search (grep)
  │ "return null|most-recent|resolve"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts)
  └ 55 lines found

● Search (grep)
  │ "mem:\$\{edgeId\}|mem:|parseInt|Number\(|canonical"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts)
  └ 31 lines found

● Search (grep)
  │ "includeContent|dedup|collapse|chunk"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 5 lines found

● Search (grep)
  │ "collapse|dedup|includeContent|chunk"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
  └ 5 lines found

● Search (grep)
  │ "sqrt\(|relatedCount|boostScore|co-activation|coactivation"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts)
  └ 60 lines found

● Search (grep)
  │ "sqrt\(|relatedCount|coactivation_strength|boost"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 5 lines found

● Search (grep)
  │ "sha-?256|content_hash|hash|embedding"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
  └ 58 lines found

● Search (grep)
  │ "frequency_counter|importance_weight|Math\.min\(1\.0, currentWeight \+ 0\.1\)"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
  └ 31 lines found

● Search (grep)
  │ "CREATE TABLE|ALTER TABLE|transaction|BEGIN"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 56 lines found

● Search (grep)
  │ "source_id = \?|target_id = \?|OR target_id|DELETE FROM causal_edges"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
  └ 42 lines found

● Search (grep)
  │ "changes === 0|result\.changes|UPDATE"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts)
  └ 43 lines found

● Search (grep)
  │ "db_connections|includeArchived|cache key|initialize_db|close_db" in **/*vector-index-store*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 108 lines found

● Search (grep)
  │ "for \(let j = i \+ 1;|double-count|temporal"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts)
  └ 48 lines found

● Search (grep)
  │ "multi_concept_search|expires_at|AND \(m\.expires_at IS NULL OR m\.expires_at >
  │ datetime\('now'\)\)|vector_search|get_status_counts|get_stats|partial" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "canonicalResultId|mem:|combinedLexicalSearch|hybridSearch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 5 lines found

● Search (grep)
  │ "Math\.(max|min)\(\.\.\." in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 17 lines found

● Search (grep)
  │ "enforceEntryLimit|BEGIN IMMEDIATE|markMemorySent|markMemoriesSentBatch|shouldSendMemoriesBatch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 84 lines found

● Search (grep)
  │ "staged swap|parent_id|delete old|transaction|attach"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts)
  └ 76 lines found

● Search (grep)
  │ "cleanupOldSessions|datetime\(last_focused\)|CURRENT_TIMESTAMP|toISOString"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
  └ 47 lines found

● Search (grep)
  │ "graph|chunk|co-activation|sha|dedup|reconsolidation|checkpoint|causal|temporal|enforceEntryLimi
  │ t|cleanupOldSessions|chunking" in **/*.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Read (Context agent — Reviewing catalog alignment)
  └ Running

I’ve confirmed several server-side fixes directly. I’m doing one more pass over `scripts` and the more suspicious catalog entries, because the biggest drift risk here looks like inaccurate source-file lists and overstated coverage—not missing fixes outright.

● Read copilot-tool-output-1774456635124-tjfgrj.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456635124-tjfgrj.txt
  └ L1:200 (135 lines read)

● Search (grep)
  │ "graph-search-fn|canonicalResultId|chunking-orchestrator|cleanupOldSessions|enforceEntryLimit|mu
  │ lti_concept_search|vector_search|content_hash|temporal-contiguity|co-activation|boostScore" in
  │ **/*.{ts,js,py,sh} (.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

● Read copilot-tool-output-1774456635124-rah6oe.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456635124-rah6oe.txt
  └ L1:220 (122 lines read)

● Read copilot-tool-output-1774456635139-2qe7km.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456635139-2qe7km.txt
  └ L1:220 (99 lines read)

● Read copilot-tool-output-1774456635139-5zy4mp.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456635139-5zy4mp.txt
  └ L1:220 (105 lines read)

The pattern is clearer now: most entries describe real `mcp_server` fixes, but a few catalogs appear to have stale or incomplete “source files/current reality” sections. I’m validating those specific drift points before I score them.

● Search (grep)
  │ "multi_concept_search|expires_at|vector_search|get_status_counts|get_stats|EMBEDDING_VALIDATION|
  │ constitutional_results\.slice\(0, limit\)|partial"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
  └ 71 lines found

● Search (grep)
  │ "relatedCount|Math\.sqrt|coactivation_strength|boost"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 5 lines found

● Search (grep)
  │ "canonicalResultId|combinedLexicalSearch|hybridSearch|mem:"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 5 lines found

● Search (grep)
  │ "reduce\(|Math\.(max|min)\(\.\.\." in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 50 lines found

● Search (grep)
  │ "graph-search-fn|canonicalResultId|cleanupOldSessions|enforceEntryLimit|content_hash|co-activati
  │ on|temporal-contiguity|chunking-orchestrator" in **/*.{ts,js,py,sh}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 2 files found

I found one likely documentation drift already: some “guards and edge cases” claims point at implementation surfaces different from what the catalog lists. I’m verifying whether that’s just stale source-file metadata or a deeper mismatch in behavior.

● Read copilot-tool-output-1774456727213-kvs7s6.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456727213-kvs7s6.txt
  └ L1:220 (114 lines read)

● Search (grep)
  │ "multi_concept_search|expires_at|constitutional_results\.slice\(0,
  │ limit\)|EMBEDDING_VALIDATION|get_status_counts|get_stats|partial"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 108 lines found

● Read copilot-tool-output-1774456727214-1u0zoc.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774456727214-1u0zoc.txt
  └ L1:220 (128 lines read)

● Search (grep)
  │ "relatedCount|fanDivisor|Math\.sqrt|coactivation_strength|spreadActivation"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 31 lines found

● Search (grep)
  │ "rollout-policy|content-normalizer|spec-folder-hierarchy"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts)
  └ 3 lines found

● Search (grep)
  │ "anchor-chunker|chunk-thinning|mpab-aggregation"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
  └ 3 lines found

I’m down to the scoring pass. I’m just tightening evidence for one borderline entry (`session-manager transaction gap fixes`) so I can distinguish “true behavior, stale metadata” from a fully aligned write-up.

● Search (grep)
  │ "enforceEntryLimit|markMemorySent|markMemoriesSentBatch|shouldSendMemoriesBatch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts)
  └ No matches found

● Search (grep)
  │ "enforceEntryLimit|markMemorySent|markMemoriesSentBatch|shouldSendMemoriesBatch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
  └ No matches found

● Search (grep)
  │ "enforceEntryLimit|markMemorySent|markMemoriesSentBatch|shouldSendMemoriesBatch"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts)
  └ No matches found

● Search (grep)
  │ "enforceEntryLimit|markMemorySent|markMemoriesSentBatch|shouldSendMemoriesBatch"
  │ (.opencode/skill/system-spec-kit/shared/normalization.ts)
  └ No matches found

● Search (grep)
  │ "enforceEntryLimit|markMemorySent|markMemoriesSentBatch|shouldSendMemoriesBatch"
  │ (.opencode/skill/system-spec-kit/shared/types.ts)
  └ No matches found

● Read (Context agent — Reviewing catalog alignment)
  └ idle

`01-graph-channel-id-fix.md` | `ALIGNED` | `mcp_server/lib/search/graph-search-fn.ts:179-195,254-268` now coerces edge IDs with `Number(...)` at both comparison sites; `scripts` only consumes graph features, no parallel fix logic.

`02-chunk-collapse-deduplication.md` | `ALIGNED` | Stage 3 always runs chunk collapse in `mcp_server/lib/search/pipeline/stage3-rerank.ts:249-250`; regression coverage in `mcp_server/tests/handler-memory-search.vitest.ts:213-227` confirms behavior is independent of `includeContent`; no scripts-side implementation.

`03-co-activation-fan-effect-divisor.md` | `ALIGNED` | `mcp_server/lib/cognitive/co-activation.ts:90-103` and `lib/search/pipeline/stage2-fusion.ts:794-799` both apply the `sqrt(relatedCount)` fan-effect divisor; `scripts` only references built artifacts/tests.

`04-sha-256-content-hash-deduplication.md` | `ALIGNED` | `mcp_server/handlers/save/dedup.ts:93-105,165-193,237-248` checks `content_hash` within `spec_folder` and skips embedding generation for exact duplicates; `scripts` has adjacent dedup utilities, not the same save-path feature.

`05-database-and-schema-safety.md` | `PARTIAL` | B1-B5 are implemented (`reconsolidation.ts`, `checkpoints.ts`, `causal-edges.ts`, `pe-gating.ts`, `vector-index-store.ts`), but the doc’s SOURCE FILES/Test tables omit B5 (`mcp_server/lib/search/vector-index-store.ts:297,441-442,561-562,664-670`); no scripts-side equivalent.

`06-guards-and-edge-cases.md` | `PARTIAL` | E1-E6 exist, but the doc only lists source/test coverage for E1-E2. E3-E6 live in `mcp_server/lib/search/vector-index-queries.ts:117-145,192,221,249-251,316-380` and `vector-index-store.ts:739-744,779-783`; no scripts-side implementation.

`07-canonical-id-dedup-hardening.md` | `ALIGNED` | `mcp_server/lib/search/hybrid-search.ts:461-480,616,639,768,979` uses `canonicalResultId()` to normalize `42`, `"42"`, and `mem:42`; scripts only calls hybrid search, it does not implement canonical-ID normalization.

`08-mathmax-min-stack-overflow-elimination.md` | `MISALIGNED` | The catalog inventory is materially wrong and “elimination” is overstated. Hardening exists in files like `causal-boost.ts`, `evidence-gap-detector.ts`, `prediction-error-gate.ts`, `retrieval-telemetry.ts`, `reporting-dashboard.ts`, but residual spread sites remain in `mcp_server/lib/eval/k-value-analysis.ts:297-298`, `mcp_server/lib/search/graph-lifecycle.ts:271`, and scripts also still has spread usage.

`09-session-manager-transaction-gap-fixes.md` | `ALIGNED` | The three call sites are atomic in `mcp_server/lib/session/session-manager.ts:495-511,553-557,584-593`; scripts has no session-manager implementation, only general test/harness coverage.

`10-chunking-orchestrator-safe-swap.md` | `ALIGNED` | `mcp_server/handlers/chunking-orchestrator.ts:170-171,324-327,455-499` stages new children before the atomic swap; no scripts-side orchestrator implementation.

`11-working-memory-timestamp-fix.md` | `ALIGNED` | `mcp_server/lib/cognitive/working-memory.ts:251-263` moved cleanup to SQLite `datetime(...)` comparisons while `last_focused` remains `CURRENT_TIMESTAMP`; scripts mirrors timestamp format in benchmarks, not cleanup logic.

`SUMMARY` | total `11` | aligned `8` | partial `2` | misaligned `1` | `P0=0` `P1=1` `P2=2`

