# Fix Report: shared/ + scripts/ Headers & Shell Fixes

**Source audits:** H-11 (shared/ TS), H-12 (scripts/core/ + scripts/lib/ TS), H-13 (scripts/ remaining TS), H-14 (shell scripts), H-15 (scripts/evals/ + .mjs)
**Date:** 2026-03-08
**Scope:** P0 violations only (headers, commented-out code, PascalCase)

---

## TypeScript Header Fixes

All P0 header violations are files that have extended headers (4+ lines with description text inside the block) instead of the required exact 3-line MODULE block:

```
// ---------------------------------------------------------------
// MODULE: [Name]
// ---------------------------------------------------------------
```

### H-11: shared/ (6 files)

| # | File | Current State | Proposed MODULE Name |
|---|------|---------------|---------------------|
| 1 | `shared/algorithms/mmr-reranker.ts` | 4-line header: description "Maximal Marginal Relevance..." on line 3 inside block | `MODULE: MMR Reranker` (move description to line 5 as comment) |
| 2 | `shared/lib/structure-aware-chunker.ts` | 6-line header: multi-line description (lines 3-5) inside block | `MODULE: Structure-Aware Chunker` (move description below block) |
| 3 | `shared/scoring/folder-scoring.ts` | 4-line header: "Canonical location..." on line 3 inside block | `MODULE: Folder Scoring` (move description below block) |
| 4 | `shared/utils/jsonc-strip.ts` | 5-line header: 2-line description (lines 3-4) inside block | `MODULE: JSONC Strip` (move description below block) |
| 5 | `shared/utils/path-security.ts` | 4-line header: "Canonical location..." on line 3 inside block | `MODULE: Path Security` (move description below block) |
| 6 | `shared/utils/retry.ts` | 4-line header: "Canonical location..." on line 3 inside block | `MODULE: Retry With Exponential Backoff` (move description below block) |

**Pattern for all 6:** Move the description line(s) from inside the 3-line block to a comment line immediately after the closing separator.

**Before (example):**
```typescript
// ---------------------------------------------------------------
// MODULE: MMR Reranker
// Maximal Marginal Relevance for post-fusion diversity pruning.
// ---------------------------------------------------------------
```

**After:**
```typescript
// ---------------------------------------------------------------
// MODULE: MMR Reranker
// ---------------------------------------------------------------
// Maximal Marginal Relevance for post-fusion diversity pruning.
```

### H-12: scripts/core/ + scripts/lib/ (2 strict P0 files)

| # | File | Current State | Proposed Fix |
|---|------|---------------|-------------|
| 7 | `scripts/core/subfolder-utils.ts` | 4-line: line 3 has "CORE: SUBFOLDER UTILS" breaking format | Remove line 3 ("CORE: SUBFOLDER UTILS"), keep `MODULE: Subfolder Utils` |
| 8 | `scripts/lib/topic-keywords.ts` | No 3-line block at all; uses JSDoc `@file`/`@description`/`@module` header | Prepend exact 3-line `MODULE: Topic Keywords` block above the JSDoc |

**H-12 warnings (extended headers, not strict P0 but noted):** config.ts, topic-extractor.ts, tree-thinning.ts, workflow.ts, memory-indexer.ts, file-writer.ts all have 4-8 line headers with descriptions inside the block. Same fix pattern as H-11: move descriptions below the 3-line block.

### H-13: scripts/ remaining TS (40 files -- ALL fail P0-1 header)

All 40 files in H-13 have extended headers (4+ lines with description text inside the block). They all follow the same pattern: the MODULE line is correct but additional description lines sit inside the separator block.

| # | File | Current State | Proposed MODULE Name |
|---|------|---------------|---------------------|
| 9 | `scripts/extractors/collect-session-data.ts` | 4-line (description on line 3) | `MODULE: Collect Session Data` |
| 10 | `scripts/extractors/contamination-filter.ts` | 4-line (description on line 3) | `MODULE: Contamination Filter` |
| 11 | `scripts/extractors/conversation-extractor.ts` | 4-line (description on line 3) | `MODULE: Conversation Extractor` |
| 12 | `scripts/extractors/decision-extractor.ts` | 4-line (description on line 3) | `MODULE: Decision Extractor` |
| 13 | `scripts/extractors/diagram-extractor.ts` | 4-line (description on line 3) | `MODULE: Diagram Extractor` |
| 14 | `scripts/extractors/file-extractor.ts` | 4-line (description on line 3) | `MODULE: File Extractor` |
| 15 | `scripts/extractors/implementation-guide-extractor.ts` | 4-line (description on line 3) | `MODULE: Implementation Guide Extractor` |
| 16 | `scripts/extractors/index.ts` | 4-line (description on line 3) | `MODULE: Extractors Index` |
| 17 | `scripts/extractors/opencode-capture.ts` | 4-line (description on line 3) | `MODULE: OpenCode Capture` |
| 18 | `scripts/extractors/quality-scorer.ts` | 4-line (description on line 3) | `MODULE: Quality Scorer` |
| 19 | `scripts/extractors/session-extractor.ts` | 4-line (description on line 3) | `MODULE: Session Extractor` |
| 20 | `scripts/loaders/data-loader.ts` | 4-line (description on line 3) | `MODULE: Data Loader` |
| 21 | `scripts/loaders/index.ts` | 4-line (description on line 3) | `MODULE: Loaders Index` |
| 22 | `scripts/memory/ast-parser.ts` | 4-line (description on line 3) | `MODULE: AST Parser` |
| 23 | `scripts/memory/backfill-frontmatter.ts` | 4-line (description on line 3) | `MODULE: Backfill Frontmatter` |
| 24 | `scripts/memory/cleanup-orphaned-vectors.ts` | 4-line (description on line 3) | `MODULE: Cleanup Orphaned Vectors` |
| 25 | `scripts/memory/generate-context.ts` | 4-line (description on line 3) | `MODULE: Generate Context` |
| 26 | `scripts/memory/rank-memories.ts` | 4-line (description on line 3) | `MODULE: Rank Memories` |
| 27 | `scripts/memory/reindex-embeddings.ts` | 4-line (description on line 3) | `MODULE: Reindex Embeddings` |
| 28 | `scripts/memory/validate-memory-quality.ts` | 4-line (description on line 3) | `MODULE: Validate Memory Quality` |
| 29 | `scripts/renderers/index.ts` | 4-line (description on line 3) | `MODULE: Renderers Index` |
| 30 | `scripts/renderers/template-renderer.ts` | 4-line (description on line 3) | `MODULE: Template Renderer` |
| 31 | `scripts/spec-folder/alignment-validator.ts` | 4-line (description on line 3) | `MODULE: Alignment Validator` |
| 32 | `scripts/spec-folder/directory-setup.ts` | 4-line (description on line 3) | `MODULE: Directory Setup` |
| 33 | `scripts/spec-folder/folder-detector.ts` | 4-line (description on line 3) | `MODULE: Folder Detector` |
| 34 | `scripts/spec-folder/generate-description.ts` | 4-line (description on line 3) | `MODULE: Generate Description` |
| 35 | `scripts/spec-folder/index.ts` | 4-line (description on line 3) | `MODULE: Spec Folder Index` |
| 36 | `scripts/types/session-types.ts` | 5-line (2 description lines inside block) | `MODULE: Shared Session Types` |
| 37 | `scripts/utils/data-validator.ts` | 4-line (description on line 3) | `MODULE: Data Validator` |
| 38 | `scripts/utils/file-helpers.ts` | 4-line (description on line 3) | `MODULE: File Helpers` |
| 39 | `scripts/utils/index.ts` | 4-line (description on line 3) | `MODULE: Utils Index` |
| 40 | `scripts/utils/input-normalizer.ts` | 4-line (description on line 3) | `MODULE: Input Normalizer` |
| 41 | `scripts/utils/logger.ts` | 4-line (description on line 3) | `MODULE: Logger` |
| 42 | `scripts/utils/message-utils.ts` | 4-line (description on line 3) | `MODULE: Message Utils` |
| 43 | `scripts/utils/path-utils.ts` | 4-line (description on line 3) | `MODULE: Path Utils` |
| 44 | `scripts/utils/prompt-utils.ts` | 4-line (description on line 3) | `MODULE: Prompt Utils` |
| 45 | `scripts/utils/slug-utils.ts` | 4-line (description on line 3) | `MODULE: Slug Utils` |
| 46 | `scripts/utils/task-enrichment.ts` | 4-line (description on line 3) | `MODULE: Task Enrichment` |
| 47 | `scripts/utils/tool-detection.ts` | 4-line (description on line 3) | `MODULE: Tool Detection` |
| 48 | `scripts/utils/validation-utils.ts` | 4-line (description on line 3) | `MODULE: Validation Utils` |

### H-13: Additional P0 Issues (non-header)

| # | File | P0 Type | Current State | Proposed Fix |
|---|------|---------|---------------|-------------|
| 49 | `scripts/types/session-types.ts` | PascalCase (P0-3) | Non-PascalCase names: `definitions@3`, `hierarchies@4`, `count@140` | Rename to PascalCase: `Definitions`, `Hierarchies`, `Count` (verify usage sites) |
| 50 | `scripts/utils/input-normalizer.ts` | PascalCase (P0-3) | Non-PascalCase name: `indicating@10` | Rename to PascalCase: `Indicating` (verify usage sites) |
| 51 | `scripts/memory/generate-context.ts` | Commented-out code (P0-4) | Line 248: commented-out code block | Remove or uncomment the code at line 248 |

### H-15: scripts/evals/ + .mjs (13 files fail P0-1 header)

| # | File | Current State | Proposed MODULE Name |
|---|------|---------------|---------------------|
| 52 | `scripts/evals/check-allowlist-expiry.ts` | 5-line header (description inside block) | `MODULE: Check Allowlist Expiry` |
| 53 | `scripts/evals/check-architecture-boundaries.ts` | 7-line header (multi-line description) | `MODULE: Check Architecture Boundaries` |
| 54 | `scripts/evals/check-handler-cycles-ast.ts` | 4-line header (description on line 3) | `MODULE: Check Handler Cycles AST` |
| 55 | `scripts/evals/check-no-mcp-lib-imports-ast.ts` | 5-line header (multi-line description) | `MODULE: Check No MCP Lib Imports AST` |
| 56 | `scripts/evals/check-no-mcp-lib-imports.ts` | 5-line header (description inside block) | `MODULE: Check No MCP Lib Imports` |
| 57 | `scripts/evals/map-ground-truth-ids.ts` | 15-line header (usage docs inside block) | `MODULE: Map Ground Truth IDs` |
| 58 | `scripts/evals/run-ablation.ts` | 15-line header (usage docs inside block) | `MODULE: Run Ablation` |
| 59 | `scripts/evals/run-bm25-baseline.ts` | 16-line header (usage docs inside block) | `MODULE: Run BM25 Baseline` |
| 60 | `scripts/evals/run-chk210-quality-backfill.ts` | 4-line header with `SCRIPT:` label | `MODULE: Run CHK210 Quality Backfill` |
| 61 | `scripts/evals/run-performance-benchmarks.ts` | Dual header blocks (non-standard) | `MODULE: Run Performance Benchmarks` |
| 62 | `scripts/evals/run-quality-legacy-remediation.ts` | 4-line header with `SCRIPT:` label | `MODULE: Run Quality Legacy Remediation` |
| 63 | `scripts/evals/run-phase2-closure-metrics.mjs` | Uses `SCRIPT:` instead of `MODULE:` | `MODULE: Run Phase2 Closure Metrics` |
| 64 | `mcp_server/eslint.config.mjs` | No header at all | `MODULE: ESLint Config` |

---

## Shell Script Fixes

### Missing COMPONENT Headers

All ops/ scripts have box-drawing borders but omit the required `COMPONENT:` label. `wrap-all-templates.sh` has neither box-drawing nor a COMPONENT label.

| # | File | Current Header | Proposed Fix |
|---|------|---------------|-------------|
| 1 | `scripts/ops/heal-index-drift.sh` | `# Self-healing workflow: index drift.` | Change to `# COMPONENT: Heal Index Drift` |
| 2 | `scripts/ops/heal-ledger-mismatch.sh` | `# Self-healing workflow: ledger mismatch.` | Change to `# COMPONENT: Heal Ledger Mismatch` |
| 3 | `scripts/ops/heal-session-ambiguity.sh` | `# Self-healing workflow: session ambiguity.` | Change to `# COMPONENT: Heal Session Ambiguity` |
| 4 | `scripts/ops/heal-telemetry-drift.sh` | `# Self-healing workflow: telemetry drift.` | Change to `# COMPONENT: Heal Telemetry Drift` |
| 5 | `scripts/ops/ops-common.sh` | `# Shared deterministic retry + escalation helpers...` | Change to `# COMPONENT: Ops Common` |
| 6 | `scripts/ops/runbook.sh` | `# Runbook helper for deterministic self-healing classes.` | Change to `# COMPONENT: Runbook` |
| 7 | `scripts/wrap-all-templates.sh` | `# Wraps all level_1-3+ template files...` (no box-drawing) | Add box-drawing border + `# COMPONENT: Wrap All Templates` |

**Before (ops/ pattern):**
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Self-healing workflow: index drift.
# ───────────────────────────────────────────────────────────────
```

**After:**
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Heal Index Drift
# ───────────────────────────────────────────────────────────────
# Self-healing workflow: index drift.
```

**Before (wrap-all-templates.sh):**
```bash
#!/usr/bin/env bash
# Wraps all level_1-3+ template files with ANCHOR tags
# Uses Node.js script with anchor-generator function
```

**After:**
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Wrap All Templates
# ───────────────────────────────────────────────────────────────
# Wraps all level_1-3+ template files with ANCHOR tags
# Uses Node.js script with anchor-generator function
```

### Missing set -euo pipefail

All 3 library files use conditional strict mode (only when executed directly, not when sourced). This is an intentional, documented design pattern with AI-WHY comments.

| # | File | Current State | Proposed Fix |
|---|------|---------------|-------------|
| 1 | `scripts/lib/git-branch.sh` | Conditional on `BASH_SOURCE[0] == $0` | Accept as documented exception OR add unconditional `set -euo pipefail` after header |
| 2 | `scripts/lib/shell-common.sh` | Conditional, with `AI-WHY` comment | Accept as documented exception (has explicit AI-WHY rationale) |
| 3 | `scripts/lib/template-utils.sh` | Conditional on `BASH_SOURCE[0] == $0` | Accept as documented exception OR add unconditional `set -euo pipefail` after header |

**Recommendation:** These should be accepted as documented exceptions. Unconditional `set -euo pipefail` in sourced libraries overrides the caller's shell options, which is the rationale documented via AI-WHY comment in `shell-common.sh`.

### Unquoted Variables

| # | File | Line | Current Code | Proposed Fix |
|---|------|------|-------------|-------------|
| 1 | `scripts/lib/git-branch.sh` | 72 | `for num in $remote_branches $local_branches $spec_dirs; do` | Convert to arrays: `branches=($remote_branches $local_branches $spec_dirs); for num in "${branches[@]}"; do` |
| 2 | `scripts/lib/git-branch.sh` | 101 | `for word in $clean_name; do` | Use `read -ra` into array: `read -ra words <<< "$clean_name"; for word in "${words[@]}"; do` |
| 3 | `scripts/rules/check-anchors.sh` | 124 | `for id in $all_ids; do` | Use `read -ra` or `mapfile`: `mapfile -t ids <<< "$all_ids"; for id in "${ids[@]}"; do` or `while IFS= read -r id; do ... done <<< "$all_ids"` |

**Note:** All 3 instances are intentional word-splitting on space-separated values. The proposed fixes use arrays for safety while preserving the splitting behavior.

---

## Summary

### TypeScript Files

| Category | Files to Fix | P0 Issue |
|----------|-------------|----------|
| H-11: shared/ header fixes | 6 | Extended headers (description inside 3-line block) |
| H-12: scripts/core/ + lib/ header fixes | 2 (strict); ~6 additional warnings | subfolder-utils.ts extra line; topic-keywords.ts wrong format |
| H-13: scripts/ remaining header fixes | 40 | All missing exact 3-line MODULE block |
| H-13: PascalCase violations | 2 | session-types.ts, input-normalizer.ts |
| H-13: Commented-out code | 1 | generate-context.ts line 248 |
| H-15: scripts/evals/ header fixes | 13 | Extended/wrong format headers |
| **TS total** | **64 files (header) + 3 non-header** | |

### Shell Files

| Category | Files to Fix | P0 Issue |
|----------|-------------|----------|
| Missing COMPONENT headers | 7 | ops/ (6) + wrap-all-templates.sh (1) |
| Conditional strict mode | 3 | lib/ sourced libraries (recommend: documented exception) |
| Unquoted variables | 2 files (3 instances) | git-branch.sh (2), check-anchors.sh (1) |
| **Shell total** | **12 files (10 unique)** | |

### Grand Total

- **TS files to fix (P0 header):** 64
- **TS files with other P0 issues:** 3 (2 PascalCase + 1 commented-out code)
- **Shell files to fix (P0):** 10 unique files, 13 violations
- **Total P0 fixes required:** 80 across 74 unique files
