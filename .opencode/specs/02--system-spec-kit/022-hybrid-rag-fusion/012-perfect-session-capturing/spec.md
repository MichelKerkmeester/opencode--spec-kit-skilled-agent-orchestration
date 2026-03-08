# Spec: Perfect Session Capturing

## Problem Statement

The Spec Kit Memory session capturing system (`generate-context.js`) converts AI conversation state into indexed memory files for context recovery. The pipeline spans 18 TypeScript files (~6,400 LOC) across `scripts/extractors/`, `scripts/loaders/`, `scripts/core/`, `scripts/renderers/`, `scripts/utils/`, and `scripts/memory/`. Systematic exploration reveals **20+ quality issues** across the pipeline: fragile regex-based detection, hardcoded values, loose timestamp matching, truncated outputs, limited contamination filtering, and inconsistent error handling.

## Scope

**In scope:** All TypeScript files that participate in the session capture → memory file generation pipeline:

| Directory | Files | LOC |
|-----------|-------|-----|
| `scripts/extractors/` | opencode-capture.ts, collect-session-data.ts, session-extractor.ts, file-extractor.ts, decision-extractor.ts, conversation-extractor.ts, diagram-extractor.ts, quality-scorer.ts (v2), contamination-filter.ts | ~3,467 |
| `scripts/core/` | workflow.ts, config.ts, quality-scorer.ts (v1), file-writer.ts, tree-thinning.ts | ~1,714 |
| `scripts/loaders/` | data-loader.ts | 195 |
| `scripts/renderers/` | template-renderer.ts | 201 |
| `scripts/utils/` | input-normalizer.ts | 499 |
| `scripts/memory/` | generate-context.ts | 502 |
| `templates/` | context_template.md | ~27KB |

**Out of scope:** MCP server code, embedding system, search pipeline, spec folder validation scripts, test files.

## Success Criteria

1. Zero TypeScript compilation errors (`npx tsc --build`)
2. All CRITICAL and HIGH findings from 25-agent audit resolved
3. Quality scores on well-formed sessions ≥ 85%
4. No content leakage (irrelevant session content in memory files)
5. No truncation artifacts in generated memory files
6. No placeholder leakage in template rendering
7. Session IDs use cryptographic randomness (not `Math.random()`)
8. Contamination filter catches ≥25 AI chatter patterns (up from 7)
9. All hardcoded magic numbers moved to config or documented

## Non-Functional Requirements

- **Reliability:** 100% quality score on well-formed sessions with complete data
- **Security:** No path traversal, no weak randomness, atomic file writes
- **Performance:** No regression in pipeline execution time
- **Maintainability:** All magic numbers configurable, consistent error handling patterns
