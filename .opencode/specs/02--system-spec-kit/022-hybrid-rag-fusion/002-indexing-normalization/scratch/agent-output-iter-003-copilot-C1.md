● skill(sk-code--opencode)

I’m mapping the embedding pipeline end to end first, then I’ll answer each question with source-backed findings and concrete numbers. After that I’ll do a quick cross-check for the `sk-doc` memory-save edge case.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ 1 line read

● Read embedding-cache.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
  └ 226 lines read

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts
  └ 48 lines read

● Read batch-processor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts
  └ 175 lines read

● Read retry-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts
  └ 573 lines read

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (grep)
  │ "memory save|save context|generate-context|implementation-summary|sk-doc|spec folder
  │ documentation|trigger ambiguity|memory_index_scan|memory_save" in
  │ **/*.{md,ts,js,py,json,jsonc,sh}
  └ 5 lines found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/c19baa64-b9e2-45bb-908e-709862919491/plan.md'
  │ <<'EOF'
  │ 1. Read all embedding-related files and extract concrete constants/flows.
  │ 2. Trace cache boundaries between shared script-side embeddings and MCP SQLite cache.…
  └ 4 lines...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Analyze embedding system performance:
  │ batching, cache reuse, retry/rate limiting, duplicate embeddings, and sk-doc memory save trigger
  │ ambiguity." --threshold 0.8
  └ 35 lines...

I’ve got the main MCP-side pieces. Now I’m tracing the shared embedding implementation and the doc-generation/memory-save path to answer the duplicate-work and ambiguity questions precisely.

● Search (grep)
  │ "BATCH_DELAY_MS|BATCH_RATE_LIMIT_DELAY|MAX_CACHE|cache|LRU|evict|generateBatchEmbeddings|generat
  │ eDocumentEmbedding|generateEmbeddingWithTimeout|clearEmbeddingCache|getEmbeddingCacheStats|isPro
  │ viderInitialized|validateApiKey|provider" (.opencode/skill/system-spec-kit/shared/embeddings.ts)
  └ 119 lines found

● Search (grep)
  │ "normalizeContentForEmbedding|generateDocumentEmbedding|storeEmbedding\(|lookupEmbedding\(|compu
  │ teContentHash\(|embedding_status|content_hash" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "sk-doc|generate-context\.js|memory save|save
  │ context|memory_index_scan|memory_save|implementation-summary|spec folder documentation|save
  │ memory|/memory:save" in **/*.{md,ts,js,py,sh,json,jsonc} (.opencode)
  └ 5 lines found

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

I found the shared constants, but I want one more pass through the save/index paths and provider implementations so I don’t miss any hidden retry or duplicate-embedding behavior. Then I can turn this into a clean PERF finding list.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L220:320 (101 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L735:805 (62 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L35:120 (85 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L390:620 (230 lines read)

● Search (grep)
  │ "rate limit|429|Retry-After|retry|backoff|throttle|delay|sleep" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/shared/embeddings)
  └ 18 lines found

● Search (grep)
  │ "generateDocumentEmbedding\(|generateBatchEmbeddings\(|computeContentHash\(|lookupEmbedding\(|st
  │ oreEmbedding\(|normalizeContentForEmbedding\(|content_text|embedding_status" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "sk-doc|implementation-summary|generate-context\.js|memory save|save
  │ context|/memory:save|memory_index_scan|memory_save" in **/*.{md,ts,js,py,sh,json,jsonc}
  │ (.opencode/skill)
  └ 5 lines found

● Read openai.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts
  └ L160:210 (50 lines read)

● Read voyage.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts
  └ L185:215 (31 lines read)

● Read retry.ts
  │ .opencode/skill/system-spec-kit/shared/utils/retry.ts
  └ L1:220 (219 lines read)

● Read gate-enforcement.md
  │ .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md
  └ L1:240 (106 lines read)

● Search (grep)
  │ "generateDocumentEmbedding\(|normalizeContentForEmbedding\(|lookupEmbedding\(|storeEmbedding\(|c
  │ omputeContentHash\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 20 lines found

● Search (grep)
  │ "sk-doc|implementation-summary|memory save|save
  │ context|generate-context\.js|memory_index_scan|/memory:save" in **/*.{md,ts,js,py,sh,json,jsonc}
  │ (.agents/skills/sk-doc)
  └ 27 lines found

● Search (grep)
  │ "generateDocumentEmbedding\(|generateBatchEmbeddings\(|generateEmbedding\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 43 lines found

I’ve confirmed the provider-level retries now. One last pass is to connect that with the save/index workflows so I can clearly separate “real API protection” from “duplicate embeddings caused by workflow design.”

✗ Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/tools/memory-save.ts
  └ Path does not exist

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L1:140 (140 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L1828:1848 (21 lines read)

● Search (grep)
  │ "generate-context\.js|memory_index_scan\(|memory_save\(|includeSpecDocs|implementation-summary\.
  │ md|spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md" in **/*.{ts,js,sh}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "implementation-summary|required for all levels|created after implementation|memory save|save
  │ context|generate-context\.js|spec
  │ docs|includeSpecDocs|index_spec_docs|implementation-summary\.md" in
  │ **/*.{md,ts,js,sh,json,jsonc} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I hit one stale path, so I’m narrowing directly to the exact save/index files and the spec-doc templates. That should pin down both the duplicate-embedding path and the `implementation-summary` / memory-save ambiguity.

✗ Search (grep)
  │ "save context|save memory|memory
  │ save|generate-context\.js|/memory:save|implementation-summary\.md"
  │ (.opencode/skill/system-spec-kit/AGENTS.md)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/AGENTS.md: IO error for operation on
    /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/AGENTS.md: No such file or directory (os error 2)

● Search (grep)
  │ "buildWeightedDocumentText\(|weightedEmbeddingInput|normalizeContentForEmbedding|generateDocumen
  │ tEmbedding\(|generateBatchEmbeddings\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts/core)
  └ 2 lines found

● Search (grep)
  │ "save context|save memory|memory save|generate-context\.js|/memory:save" in **/*.md
  │ (.agents/skills/sk-doc)
  └ 2 lines found

● Search (glob)
  │ "**/memory-save.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (grep)
  │ "buildWeightedDocumentText\(|normalizeContentForEmbedding\(|generateDocumentEmbedding\(|lookupEm
  │ bedding\(|storeEmbedding\(|computeContentHash\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "implementation-summary\.md|required for all levels|created after implementation
  │ completes|created after implementation|REQUIRED for all levels" in **/*.md
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L620:760 (141 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1085:1165 (81 lines read)

● Search (grep)
  │ "save context|save memory|memory save|generate-context\.js|/memory:save" (AGENTS.md)
  └ 8 lines found

● Read manual_testing_playbook_template.md
  │ .agents/skills/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md
  └ L280:300 (20 lines read)

● Search (grep)
  │ "implementation-summary\.md|required for all levels|created after implementation
  │ completes|created after implementation" in **/*.md
  └ 5 lines found

I have the memory-save rules now. I’m just extracting the exact `implementation-summary` language from the spec-kit docs so I can explain why `sk-doc` can create spec docs while memory-save is still intentionally delayed.

● Read AGENTS.md
  └ L120:160 (41 lines read)

● Search (grep)
  │ "implementation-summary\.md|required for all levels|created after implementation
  │ completes|created after implementation" (.opencode/skill/system-spec-kit/README.md)
  └ 2 lines found

● Search (grep)
  │ "implementation-summary\.md|required for all levels|created after implementation
  │ completes|created after implementation" (.opencode/skill/system-spec-kit/SKILL.md)
  └ 5 lines found

● Search (grep)
  │ "implementation-summary\.md|required for all levels|created after implementation
  │ completes|created after implementation" in **/*.md (.agents/skills/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "includeSpecDocs|spec documents|spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md|im
  │ plementation-summary\.md" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L384:405 (22 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L684:696 (13 lines read)

● Search (grep)
  │ "embeddingCache.size < EMBEDDING_CACHE_MAX_SIZE \* 0\.9|doc:|query:|same text|NOT cached by doc
  │ namespace" (.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js)
  └ 8 lines found

● Search (grep)
  │ "includeSpecDocs|implementation-summary\.md|spec\.md|plan\.md|tasks\.md|checklist\.md|decision-r
  │ ecord\.md" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "includeSpecDocs|includeSpecDocs\?: boolean|spec documents|implementation-summary\.md" in
  │ **/*.{ts,js,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 49 lines found

I’ve got the documentation angle. I’m now checking the live save path one more time to see whether the MCP SQLite cache is only used for retries or also for normal saves, because that changes the “unnecessary re-embedding” answer materially.

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L180:200 (21 lines read)

● Read memory-index-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
  └ L1:70 (70 lines read)

● Read test-embeddings-behavioral.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js
  └ L592:612 (21 lines read)

● Search (grep)
  │ "generateDocumentEmbedding\(|lookupEmbedding\(|storeEmbedding\(|computeContentHash\(|normalizeCo
  │ ntentForEmbedding\(" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 1 line found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L360:450 (91 lines read)

● Search (grep)
  │ "generateDocumentEmbedding\(|lookupEmbedding\(|storeEmbedding\(|normalizeContentForEmbedding\("
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 12 lines found

● Search (grep)
  │ "generateDocumentEmbedding\(|lookupEmbedding\(|storeEmbedding\(|normalizeContentForEmbedding\("
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 14 lines found

That answered the big question: the current save path *does* have SQLite cache plumbing, but it sits in a dedicated embedding pipeline, not in the shared script indexer. I’m reading that pipeline now to separate what’s already optimized from what still duplicates work.

● Read embedding-pipeline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
  └ L1:240 (203 lines read)

● Read chunking-orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
  └ L260:300 (41 lines read)

● Search (grep)
  │ "embedding-pipeline|computeNormalizedContentHash|buildWeightedEmbeddingInput|lookupEmbedding\(|s
  │ toreEmbedding\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 8 lines found

I’ve got enough to answer most of it, but I want the exact provider retry math before I finalize. That’ll let me state whether a single failed batch can multiply into a larger number of actual API attempts.

● Read retry.ts
  │ .opencode/skill/system-spec-kit/shared/utils/retry.ts
  └ L220:360 (141 lines read)

● Search (grep)
  │ "create implementation-summary\.md at end of implementation phase|Requires @speckit|Only agent
  │ permitted to write \*\.md inside spec folders|memory file creation"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 1 line found

● Search (grep)
  │ "while \(batchResults === null && retryCount <= MAX_429_RETRIES\)|MAX_429_RETRIES|currentBackoff
  │ = Math.min\(60000, \(currentBackoff \|\| 1000\) \* 2\)|Promise\.all\(|concurrency: number = 5"
  │ (.opencode/skill/system-spec-kit/shared/embeddings.ts)
  └ 7 lines found

● Read retry.ts
  │ .opencode/skill/system-spec-kit/shared/utils/retry.ts
  └ L360:430 (40 lines read)

● Search (grep)
  │ "Create implementation-summary\.md at end of implementation phase"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 1 line found

I’m down to one final distinction: whether `utils/batch-processor.ts` actually sits on the embedding path. If it doesn’t, that clears up the “is the delay 100ms?” confusion cleanly.

● Search (grep)
  │ "processBatches\(|processSequentially\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 32 lines found

● Search (grep)
  │ "generateBatchEmbeddings\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 8 lines found

I found the source of the confusion: there are actually **two** separate 100ms defaults in play — one for file-batch indexing and one for embedding batches. I’m pulling the indexing-batch callsite so I can distinguish them cleanly in the findings.

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L372:388 (17 lines read)

● Read batch-processor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts
  └ L37:49 (13 lines read)

Here’s the source-backed readout.

**PERF-001 — Actual embedding batch delay**
- The dedicated embedding batch helper defaults to **100ms between batches**, not between individual texts. It is configurable via `EMBEDDING_BATCH_DELAY_MS`, and per-call via `options.delayMs`. Default concurrency is **5 texts per batch**. That means the default cap is **10 batches/sec**, i.e. up to **50 text requests/sec** before provider latency is counted, not “10 texts/sec”. [`shared/embeddings.ts:43-49,445-469,521-528,739`]
- Separately, the MCP file indexer also has a **100ms** batch delay, but that is a **file-batching** delay from `SPEC_KIT_BATCH_DELAY_MS`, not the embedding helper. [`mcp_server/utils/batch-processor.ts:37-49,116-147`; `mcp_server/handlers/memory-index.ts:381-383`]
- I did **not** find production callsites of `generateBatchEmbeddings()` outside its definition/tests, so the “live” path is more likely the file-batching path above.

**PERF-002 — Rate limiting / retry / backoff**
- There is **no hard token-bucket / RPM limiter** for embeddings.
- Provider-level retries exist for **OpenAI** and **Voyage**: **3 retries** after the initial attempt, with backoff **1s, 2s, 4s**; permanent auth/client errors fail fast. [`shared/embeddings/providers/openai.ts:175-191`; `shared/embeddings/providers/voyage.ts:193-209`; `shared/utils/retry.ts:14-19,26-49,231-234,267-383`]
- Batch-level 429 handling also exists in `generateBatchEmbeddings()`: **3 batch retries**, with actual waits of **2s, 4s, 8s** (because it doubles `(currentBackoff || 1000)` on first 429). [`shared/embeddings.ts:471-510`]
- Async retry queue logic adds another layer: retry delays are **60s, 300s, 900s**; background retry job runs every **300000ms (5 min)** with batch size **5**; circuit breaker opens after **5 consecutive provider failures** for **120000ms (2 min)**. [`mcp_server/lib/providers/retry-manager.ts:86-99,110-136,174-186,454-479`]
- Generic `batch-processor.ts` has its own retry logic (**2 retries**, **1000ms then 2000ms**), but that is for indexed-item batching, not direct embedding API throttling. [`mcp_server/utils/batch-processor.ts:45-49,71-85`]

**PERF-003 — Can script-side indexer reuse the MCP SQLite cache?**
- **Not today.**
- The script-side indexer calls `generateDocumentEmbedding()` directly and never calls `lookupEmbedding()` / `storeEmbedding()`. [`scripts/core/memory-indexer.ts:16-17,64-70`]
- The MCP save path uses a separate DB-aware embedding pipeline that *does* use the SQLite cache. [`mcp_server/handlers/save/embedding-pipeline.ts:8-9,116-166,186-203`]
- The blockers are:
  - **Architecture boundary**: script code uses the shared in-memory `Map`; SQLite cache helpers live in `mcp_server` and require a `better-sqlite3` DB handle. [`shared/embeddings.ts:36-37,235-261`; `mcp_server/lib/cache/embedding-cache.ts:36-46,62-131`]
  - **Different cache key semantics**: script indexer caches the **weighted embedding input**; MCP SQLite cache key is based on **normalized parsed content hash**. [`scripts/core/memory-indexer.ts:64-70`; `mcp_server/handlers/save/embedding-pipeline.ts:111-151`]

**PERF-004 — In-memory cache size and eviction**
- In `shared/embeddings.ts`, the in-memory cache max is **1000 entries**. [`shared/embeddings.ts:36-37`]
- Eviction is **LRU by `Map` insertion order**:
  - on cache hit: `delete()` + `set()` promotes entry to MRU
  - on insert at capacity: delete the **first key** (least recently used)
- There is **no TTL** or byte-size eviction in this in-memory cache. [`shared/embeddings.ts:240-261`]
- Query embeddings are lower-priority: they are only added while cache size is below **90%** of max, i.e. below **900 entries**. [`shared/embeddings.ts:576-603`]

**PERF-005 — Unnecessary re-embedding scenarios**
- **Namespace split**: the same text can be embedded more than once because document, query, and generic embeddings use different cache keys:
  - generic: raw trimmed text
  - document: `doc:${text}`
  - query: `query:${text}`
  Tests explicitly confirm `generateEmbedding("same text")` does **not** hit the doc cache. [`shared/embeddings.ts:396-420,543-568,590-603`; `scripts/tests/test-embeddings-behavioral.js:596-610`]
- **Cross-process duplication**: script-side indexing and MCP server do not share the same in-memory cache; script-side also does not use SQLite cache. Same content can therefore be re-embedded in a different process. [`scripts/core/memory-indexer.ts:64-70`; `shared/embeddings.ts:36-37`; `mcp_server/handlers/save/embedding-pipeline.ts:129-166`]
- **Query cache drop-off**: once cache reaches **900+ entries**, repeated queries stop being cached and will re-hit the provider. [`shared/embeddings.ts:601-603`]
- **Layered retry amplification**: worst-case, a 5-item batch can multiply attempts:
  - batch concurrency **5**
  - batch retries **4 total attempts** (initial + 3 retries)
  - provider retries **4 total attempts** per item (initial + 3 retries)
  - theoretical upper bound: **5 × 4 × 4 = 80 HTTP attempts** for one logical 5-item batch. [`shared/embeddings.ts:447,472,489-510`; `shared/utils/retry.ts:267-383`]
- On the MCP side, normal saves and retry jobs **do** avoid some repeat work via the SQLite cache. [`mcp_server/handlers/save/embedding-pipeline.ts:129-166,186-203`; `mcp_server/lib/providers/retry-manager.ts:257-285`]

**PERF-006 — `sk-doc` memory-save trigger ambiguity**
- The ambiguity is real and comes from overlapping rules:
  - `memory_save` explicitly accepts **spec documents** in `specs/**/`, not just `memory/` notes. [`mcp_server/tool-schemas.ts:186-189`]
  - Spec-doc discovery/indexing includes `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`. [`mcp_server/handlers/memory-index-discovery.ts:20-29`]
  - Global rules say memory saves must use `generate-context.js` when triggered by “save context”, “save memory”, `/memory:save`, or memory-file creation. [`AGENTS.md:129-138`]
  - But system-spec-kit also says `implementation-summary.md` is a **required spec artifact** for Level 1+, while also saying it should be created **at the end of implementation**. [`system-spec-kit/SKILL.md:63,393,690`]
  - `sk-doc` guidance itself uses the phrase “save context and evidence” without clarifying whether that means a `memory/` note, indexing spec docs, or both. [`.agents/skills/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md:283-291`]
- So when `sk-doc` creates spec-folder docs, it is ambiguous whether that should immediately trigger memory-save/generate-context behavior, or whether only actual `memory/` notes should. The sharpest ambiguity is `implementation-summary.md`: it is both **required** and **deferred**.


Total usage est:        1 Premium request
API time spent:         5m 15s
Total session time:     5m 38s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.5m in, 18.7k out, 1.4m cached (Est. 1 Premium request)
