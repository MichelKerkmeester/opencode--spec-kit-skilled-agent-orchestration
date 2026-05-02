● skill(sk-code-review)

● skill(sk-code-opencode)

I’m mapping the audit scope and loading the TypeScript review standards first, then I’ll inspect every `shared/` file and synthesize findings by severity.

● Read quality_standards.md
  │ .agents/skills/sk-code-opencode/references/typescript/quality_standards.md
  └ 1 line read

● List directory .opencode/skill/system-spec-kit/shared
  └ 20 files found

● Read quick_reference.md
  │ .agents/skills/sk-code-review/references/quick_reference.md
  └ 151 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code-review/references/code_quality_checklist.md
  └ 162 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code-opencode/references/typescript/quick_reference.md
  └ 539 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code-review/references/security_checklist.md
  └ 206 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/shared/parsing/*.ts"
  └ 6 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/shared/utils/*.ts"
  └ 4 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/af9b3eab-fb65-4a87-9cdc-a1c49015b8b3/plan.md'
  │ <<'EOF'
  │ # Shared directory audit plan…
  └ 12 lines...

I’ve got the review rubric loaded. Next I’m reading the `shared/` implementation files in batches, then I’ll cross-check for `any`, export patterns, and chunking duplication.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ 1 line read

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ 1 line read

● Read chunking.ts
  │ .opencode/skill/system-spec-kit/shared/chunking.ts
  └ 110 lines read

● Read mmr-reranker.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/mmr-reranker.ts
  └ 155 lines read

● Read config.ts
  │ .opencode/skill/system-spec-kit/shared/config.ts
  └ 47 lines read

● Read adaptive-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
  └ 429 lines read

● Read rrf-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ 539 lines read

● Read quality_standards.md
  │ .agents/skills/sk-code-opencode/references/typescript/quality_standards.md
  └ L1:260 (259 lines read)

● Read paths.ts
  │ .opencode/skill/system-spec-kit/shared/paths.ts
  └ 15 lines read

● Read normalization.ts
  │ .opencode/skill/system-spec-kit/shared/normalization.ts
  └ 252 lines read

● Read types.ts
  │ .opencode/skill/system-spec-kit/shared/types.ts
  └ 507 lines read

● Read structure-aware-chunker.ts
  │ .opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts
  └ 221 lines read

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ 461 lines read

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L261:520 (259 lines read)

● Read profile.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/profile.ts
  └ 86 lines read

● Read voyage.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts
  └ 339 lines read

● Read openai.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts
  └ 320 lines read

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L1:260 (260 lines read)

● Read hf-local.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts
  └ 310 lines read

● Search (grep)
  │ "\bany\b" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ 6 lines found

● Search (grep)
  │ "export\s+\*|export\s+type\s+\*" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ 4 lines found

● Search (grep)
  │ "(export\s+(async\s+)?function|function\s+\w+\()" in **/*.ts
  │ (.opencode/skill/system-spec-kit/shared)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/shared/lib/*.ts"
  └ 1 file found

The embedding provider layer is fairly consistent so far, but I’m seeing a few review hotspots around public API typing, silent fallback behavior, and export-barrel breadth. I’m reading the remaining parsing/scoring/utils files now to confirm pattern consistency.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L521:900 (276 lines read)

● Read memory-template-contract.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts
  └ 388 lines read

● Read memory-sufficiency.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts
  └ 396 lines read

● Read quality-extractors.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts
  └ 45 lines read

● Read spec-doc-health.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts
  └ 336 lines read

● Read quality-extractors.test.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts
  └ 154 lines read

● Read spec-doc-health.test.ts
  │ .opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.test.ts
  └ 223 lines read

● Read folder-scoring.ts
  │ .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts
  └ 359 lines read

● Read retry.ts
  │ .opencode/skill/system-spec-kit/shared/utils/retry.ts
  └ 399 lines read

● Read jsonc-strip.ts
  │ .opencode/skill/system-spec-kit/shared/utils/jsonc-strip.ts
  └ 95 lines read

● Read path-security.ts
  │ .opencode/skill/system-spec-kit/shared/utils/path-security.ts
  └ 107 lines read

● Read token-estimate.ts
  │ .opencode/skill/system-spec-kit/shared/utils/token-estimate.ts
  └ 14 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/index.ts
  └ 7 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/shared/index.ts
  └ L150:210 (61 lines read)

● Search (grep)
  │ "catch \{\}|catch \([^)]*\) \{\s*\}|catch \([^)]*\) \{\s*// skip|catch \([^)]*\) \{\s*/\*" in
  │ **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ No matches found

● Search (grep)
  │ "export (async )?function [^(]+\([^)]*\)\s*(?::\s*[^\{]+)?\{|export class " in **/*.ts
  │ (.opencode/skill/system-spec-kit/shared)
  └ 58 lines found

● Search (grep)
  │ "\[key:\s*string\]:\s*unknown|Record<string, unknown>|Partial<Memory> & Record<string,
  │ unknown>|\| ReturnType<IEmbeddingProvider\['getProfile'\]>" in **/*.ts
  │ (.opencode/skill/system-spec-kit/shared)
  └ 21 lines found

I’ve finished the core/provider layers. The remaining big surface is `trigger-extractor.ts`, which is where most of the shared public API volume lives, so I’m checking that carefully for type/API/documentation consistency.

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L1:260 (260 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L521:820 (139 lines read)

● Read trigger-extractor.ts
  │ .opencode/skill/system-spec-kit/shared/trigger-extractor.ts
  └ L261:520 (260 lines read)

● Search (grep)
  │ "catch \([^)]*\) \{\s*// skip" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ No matches found

● Search (grep)
  │ "export\s*\{[\s\S]*\}" (.opencode/skill/system-spec-kit/shared/embeddings.ts)
  └ 45 lines found

● Search (grep)
  │ "catch \{" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ 6 lines found

I’ve got a solid first-pass audit. I’m running one independent review pass in parallel now to sanity-check the highest-signal issues before I finalize the report.

● Review Cross-check shared audit
  └ Agent started in background with agent_id: shared-audit-crosscheck. You can u...

● Search (grep)
  │ "graphCausalBias|graphWeight" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ 16 lines found

● Search (grep)
  │ "interface IEmbeddingProvider|getProfile\(|getProviderMetadata\(|getEmbeddingProfile\(|getEmbedd
  │ ingProfileAsync\(" in **/*.ts (.opencode/skill/system-spec-kit/shared)
  └ 12 lines found

● Search (grep)
  │ "DEFAULT_MAX_TOKENS|CHARS_PER_TOKEN|MAX_TEXT_LENGTH|estimateTokenCount" in **/*.ts
  │ (.opencode/skill/system-spec-kit/shared)
  └ 21 lines found

● Read (Review agent — Cross-check shared audit)
  └ Running

● Read (Review agent — Cross-check shared audit)
  └ Running

● Search (grep)
  │ "structure-aware-chunker|chunkMarkdown\(|splitIntoBlocks\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 24 lines found

● Search (grep)
  │ "semanticChunk\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 4 lines found

## Code Review Summary

Reviewed `29` files total: the `26` requested `shared/` files, plus `shared/lib/structure-aware-chunker.ts` for chunking comparison and `shared/index.ts` / `shared/algorithms/index.ts` for export hygiene.

Overall assessment: solid baseline. I found no explicit `any` usage in the reviewed files, and exported APIs generally have explicit return types. The strongest issues are around silent degraded behavior, overly broad shared types, and public-surface drift.

## Findings

### P1 - High

1. `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:191-223,233-262` — `createEmbeddingsProvider()` silently swaps a failed cloud provider for `hf-local`, even when the embedding dimension changes.

This is a contract break for a shared factory. Callers ask for one provider and may receive another, with only log output as the signal. Because the fallback can change vector dimensionality, downstream code can continue against an incompatible index and only discover the problem later.

2. `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts:78-80,116-119,136-139,159-162,207-209,259-261` — the health evaluator swallows filesystem exceptions and continues as if checks were simply skipped.

That makes unreadable files, transient I/O failures, or permission issues look healthier than they are. For an auditing/health API, silently suppressing read failures is a real correctness problem.

### P2 - Medium

1. `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:17-28,60-76,135-176,191-237,344-419` — the public adaptive-fusion API advertises `graphWeight` and `graphCausalBias`, but the actual fusion entrypoints only accept semantic and keyword result lists.

So the shared type surface promises graph-aware weighting that this implementation cannot apply. That is an interface-design mismatch, not just a documentation gap.

2. `.opencode/skill/system-spec-kit/shared/types.ts:22-57`, `.opencode/skill/system-spec-kit/shared/embeddings.ts:708-726`, and provider `getProfile()` implementations at `embeddings/providers/hf-local.ts:285-291`, `openai.ts:285-292`, `voyage.ts:302-309` — embedding profile/provider typing is broader than it needs to be.

`IEmbeddingProvider.getProfile()` returns an anonymous union instead of a single canonical profile contract, and `getProviderMetadata()` / `getEmbeddingProfile*()` propagate non-discriminated unions. The provider classes themselves are consistent; the shared interface around them is the part that is loose.

3. `.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:23,204-218,251-265,312-317` with `.opencode/skill/system-spec-kit/shared/types.ts:307-325` — folder scoring intentionally accepts `Partial<Memory> & Record<string, unknown>` and the canonical `FolderScore` output has an open-ended `[key: string]: unknown` index signature.

This keeps the module flexible, but it weakens the whole “shared canonical type” story and forces repeated runtime casts between camelCase and snake_case fields. It is the biggest type-safety compromise in the audited surface.

4. `.opencode/skill/system-spec-kit/shared/index.ts:168`, `.opencode/skill/system-spec-kit/shared/algorithms/index.ts:5-7`, `.opencode/skill/system-spec-kit/shared/embeddings.ts:752-796` — export hygiene is looser than the rest of the shared layer.

The barrel files use `export *`, and `embeddings.ts` exports a very wide mix of core APIs, diagnostics, legacy aliases, internal-ish helpers, and re-exported chunking constants. That makes the shared public surface harder to reason about and easier to couple against accidentally.

5. `.opencode/skill/system-spec-kit/shared/chunking.ts:15-27,37-110` vs `.opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts:10-24,37-40,119-220` — these are not direct duplicates, but they are overlapping chunking APIs with separate heuristics and constants.

`chunking.ts` is embedding-oriented truncation that returns one weighted string. `structure-aware-chunker.ts` is markdown segmentation that returns `Chunk[]` while preserving code blocks and tables. The design split is valid, but the sizing/token heuristics are disconnected, so drift is likely over time.

### P3 - Low

1. Documentation is uneven. Files like `rrf-fusion.ts`, `adaptive-fusion.ts`, and `shared/lib/structure-aware-chunker.ts` are well explained, but several public shared APIs still use placeholder doc comments instead of full TSDoc-quality contracts, especially in `config.ts`, `paths.ts`, `retry.ts`, and parts of `trigger-extractor.ts`.

2. Configuration is mostly centralized per module, but embedding dimensions/timeouts are still duplicated across providers and fallback helpers. See `embeddings.ts:625-638`, `embeddings/factory.ts:235-246`, `embeddings/providers/openai.ts:13-23`, `embeddings/providers/voyage.ts:13-34`, and `embeddings/providers/hf-local.ts:13-17`.

## Chunking Relationship

`shared/chunking.ts` and `shared/lib/structure-aware-chunker.ts` serve different layers.

`shared/chunking.ts` is an embedding-input reducer. It preserves overview/outcome/decision-heavy content and returns a single string sized for embedding providers. It is used by `shared/embeddings.ts` and `shared/embeddings/providers/hf-local.ts`.

`shared/lib/structure-aware-chunker.ts` is a markdown-aware block chunker. It returns structured `Chunk[]` values and is consumed by the AST-parser path and chunker tests. So this is not direct duplication with `semanticChunk()`.

The real duplication risk is conceptual drift: both modules own text-sizing heuristics, and `structure-aware-chunker.ts` also exists as a second copy under `scripts/lib/structure-aware-chunker.ts`.

## File Coverage

Finding-bearing files: `algorithms/adaptive-fusion.ts`, `embeddings.ts`, `embeddings/factory.ts`, `parsing/spec-doc-health.ts`, `scoring/folder-scoring.ts`, `types.ts`, `shared/index.ts`, `shared/algorithms/index.ts`, `shared/chunking.ts`, `shared/lib/structure-aware-chunker.ts`.

Mostly aligned / no major audit findings: `algorithms/mmr-reranker.ts`, `algorithms/rrf-fusion.ts`, `embeddings/profile.ts`, `embeddings/providers/hf-local.ts`, `embeddings/providers/openai.ts`, `embeddings/providers/voyage.ts`, `config.ts`, `normalization.ts`, `paths.ts`, `parsing/memory-template-contract.ts`, `parsing/memory-sufficiency.ts`, `parsing/quality-extractors.ts`, `trigger-extractor.ts`, `utils/retry.ts`, `utils/jsonc-strip.ts`, `utils/path-security.ts`, `utils/token-estimate.ts`, `parsing/quality-extractors.test.ts`, `parsing/spec-doc-health.test.ts`.

If you want, I can turn this audit into a fix plan ordered by risk.

