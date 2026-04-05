# Iteration 002 — Merged Findings

**Focus**: scripts/lib/, shared/, scripts/evals/, scripts/spec-folder/
**Agents**: copilot-C1 (lib analysis), copilot-C2 (shared standards), codex-A1 (evals/spec-folder bugs)
**New findings**: 30

---

## P1 (HIGH) Findings

### [BUG] frontmatter-migration.ts: Duplicate frontmatter on large files (C1)
- **File(s)**: scripts/lib/frontmatter-migration.ts:398-411, 1213-1219
- **Description**: `detectFrontmatter()` returns `found: false` when opening block exceeds 50 lines. `buildFrontmatterContent()` then prepends NEW frontmatter, creating duplicates.

### [BUG] flowchart-generator.ts: Sequential workflows misclassified as parallel (C1)
- **File(s)**: scripts/lib/flowchart-generator.ts:97-100, 167-170, 195-197, 220-245
- **Description**: `detectWorkflowPattern()` uses `phases.length > 4` as sole parallelism signal. Any 5+ phase sequential workflow shown as parallel, phases beyond 4 omitted.

### [BUG] shared/embeddings/factory.ts: Silent provider swap changes dimensions (C2)
- **File(s)**: shared/embeddings/factory.ts:191-223, 233-262
- **Description**: `createEmbeddingsProvider()` silently swaps failed cloud provider for `hf-local` even when embedding dimension changes. Callers can receive incompatible vectors.

### [BUG] shared/parsing/spec-doc-health.ts: Filesystem exceptions swallowed (C2)
- **File(s)**: shared/parsing/spec-doc-health.ts:78-80, 116-119, 136-139, 159-162, 207-209, 259-261
- **Description**: Health evaluator swallows filesystem exceptions, making unreadable files or permission issues look healthy. Correctness problem for auditing API.

### [BUG] deleted-chk210-quality-backfill-script: Malformed metadata injection (A1)
- **File(s)**: scripts/evals/deleted-chk210-quality-backfill-script:40
- **Description**: Writes quality metadata into fenced yaml block with `quality_flags:` on separate line, while shared workflow writes `quality_flags: []` correctly. Backfill can write malformed metadata while updating DB.

### [BUG] deleted-phase3-telemetry-dashboard-script: CLI contract drift (A1)
- **File(s)**: scripts/evals/deleted-phase3-telemetry-dashboard-script:69
- **Description**: Only accepts positional specFolder, but repair workflow calls with `--check`, `--sync`, `--verify` flags. Treats flags as folder paths.

### [BUG] collect-redaction-calibration-inputs.ts: False-green exits (A1)
- **File(s)**: scripts/evals/collect-redaction-calibration-inputs.ts:26, 45, 75
- **Description**: Hardcodes one spec scratch path, records failing command exit codes as text instead of failing. Can exit 0 with corpus full of broken inputs.

### [BUG] map-ground-truth-ids.ts: Regex-based TS source parsing (A1)
- **File(s)**: scripts/evals/map-ground-truth-ids.ts:79, 204, 526
- **Description**: Regex-parses TypeScript source instead of loading structured data. Only warns if zero queries, still writes output artifact and exits successfully. False-green failure mode.

---

## P2 (MEDIUM) Findings

### [LOGIC] structure-aware-chunker.ts: Full duplicate of shared implementation (C1)
- **File(s)**: scripts/lib/structure-aware-chunker.ts vs shared/lib/structure-aware-chunker.ts
- **Description**: Line-for-line duplicate. Only banner/comment differences. Future fixes can miss one copy.

### [LOGIC] content-filter.ts: O(n²) similarity with weak heuristic (C1)
- **File(s)**: scripts/lib/content-filter.ts:376-398, 580-609
- **Description**: Each item compared against all prior content using position-based char comparison on first 200 chars. Poor scaling and accuracy.

### [LOGIC] semantic-signal-extractor.ts: Duplicated trigger ranking pipeline (C1)
- **File(s)**: scripts/lib/semantic-signal-extractor.ts:166-257, 260-287, 294-414 vs shared/trigger-extractor.ts:534-659
- **Description**: Script-side rebuilds placeholder filtering, n-gram scoring, candidate merging, substring dedupe on top of shared primitives. Behavior drift risk.

### [STANDARDS] shared/adaptive-fusion.ts: Interface-design mismatch (C2)
- **File(s)**: shared/algorithms/adaptive-fusion.ts:17-28, 60-76, 135-176, 191-237, 344-419
- **Description**: Public API advertises `graphWeight`/`graphCausalBias` but actual fusion entrypoints only accept semantic + keyword lists. Type surface promises graph-aware weighting that implementation can't apply.

### [STANDARDS] shared/types.ts: Overly broad embedding provider types (C2)
- **File(s)**: shared/types.ts:22-57, shared/embeddings.ts:708-726
- **Description**: `IEmbeddingProvider.getProfile()` returns anonymous union instead of canonical profile contract. Providers are consistent but shared interface is loose.

### [STANDARDS] shared/scoring/folder-scoring.ts: Open-ended type signatures (C2)
- **File(s)**: shared/scoring/folder-scoring.ts:23, 204-218, 251-265, shared/types.ts:307-325
- **Description**: Accepts `Partial<Memory> & Record<string, unknown>`, `FolderScore` has `[key: string]: unknown`. Biggest type-safety compromise in shared surface.

### [STANDARDS] shared/index.ts: export * barrel hygiene (C2)
- **File(s)**: shared/index.ts:168, shared/algorithms/index.ts:5-7, shared/embeddings.ts:752-796
- **Description**: Barrel files use `export *`, embeddings.ts exports wide mix of APIs/diagnostics/legacy aliases. Hard to reason about public surface.

### [LOGIC] shared/chunking vs shared/lib/structure-aware-chunker: Disconnected heuristics (C2)
- **File(s)**: shared/chunking.ts:15-27, shared/lib/structure-aware-chunker.ts:10-24, 119-220
- **Description**: Both own text-sizing heuristics but are disconnected. Valid design split but drift likely.

### [BUG] run-performance-benchmarks.ts: Global console override during async (A1)
- **File(s)**: scripts/evals/run-performance-benchmarks.ts:263, 402
- **Description**: Temporarily overrides global `console.info`/`console.warn` during awaited work. Also mutates global feature-flag env vars. Concurrent work loses logs.

### [BUG] run-quality-legacy-remediation.ts: No rollback on partial failure (A1)
- **File(s)**: scripts/evals/run-quality-legacy-remediation.ts:18, 160, 181
- **Description**: Pinned to one spec/DB path. Mutates files + index with no rollback. Mid-run failure leaves partial remediation.

### [BUG] run-ablation.ts/run-bm25-baseline.ts: Resource leaks (A1)
- **File(s)**: scripts/evals/run-ablation.ts:34, 91; scripts/evals/run-bm25-baseline.ts:35, 72
- **Description**: Hardcode `/tmp` outputs. run-ablation never closes DB handle. run-bm25-baseline only closes on happy path.

### [BUG] alignment-validator.ts: Stale drift cache (A1)
- **File(s)**: scripts/spec-folder/alignment-validator.ts:96, 266
- **Description**: Caches telemetry schema/doc parity as single boolean forever. In long-lived process, later drift silently skipped after first clean check.

---

## P3 (LOW) Findings

### [PERFORMANCE] semantic-signal-extractor.ts: O(n²) indexOf dedupe (C1)
### [LOGIC] semantic-summarizer.ts: Repeated message classification (C1)
### [PERFORMANCE] content-filter.ts: Regex recompilation in pipeline (C1)
### [DEAD_CODE] decision-tree-generator.ts: Write-only asciiBoxesAvailable (C1)
### [DEAD_CODE] topic-keywords.ts: No consumers of tokenizeTopicWords (C1)
### [DEAD_CODE] anchor-generator.ts: Unused category variable (C1)
### [LOGIC] Large renderer functions need decomposition (C1) - 6 functions >200 lines
### [STANDARDS] Embedding dimension duplication across providers (C2)
### [AUTOMATION] Eval scripts share CLI/artifact/scratch patterns — need shared helper (A1)

---

## Statistics
- P1 (HIGH): 8 new findings
- P2 (MEDIUM): 12 new findings
- P3 (LOW): 9 new findings
- Total new: 29 unique findings
- Cumulative: 66 findings
- newInfoRatio: 0.78 (29/37 new vs prior)
