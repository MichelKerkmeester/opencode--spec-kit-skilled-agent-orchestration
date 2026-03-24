# 013 — Memory Generation Quality (JSON Mode)

> **Level 2+ | Phase 13 of 022-hybrid-rag-fusion Epic**

<!-- SPECKIT_LEVEL: 2 -->

---

## Objective

Deep research investigation into systematic quality issues in `generate-context.js` JSON mode memory file generation. Root cause analysis and fix architecture design for 5 identified defects: path fragment trigger phrases, incomplete trigger filtering, thin content, key topic contamination, and reactive-only detection.

## Root Causes (from 012 pre-release audit)

| # | Issue | Root Code | Impact |
|---|-------|-----------|--------|
| 1 | Path fragment trigger phrases | `memory-frontmatter.ts:50-57` | "kit/022", "fusion/001" leak into trigger_phrases |
| 2 | Incomplete trigger filter | `workflow.ts:122-165` | Multi-word path fragments pass through filter |
| 3 | Thin content | `semantic-summarizer.ts:468-610` | Overview/summary sparse despite rich input |
| 4 | Key topics with path fragments | `topic-extractor.ts:29-34` | "fusion/001 hybrid" in key_topics |
| 5 | Detection without prevention | `post-save-review.ts:184-198` | Detects issues AFTER write, no feedback loop |

## Research Questions

1. **Q1 (Contamination Map)**: Where exactly do path fragment tokens enter the trigger/topic pipeline, what filters exist, and which tokens leak through?
2. **Q2 (Content Gap Analysis)**: Why does JSON mode produce thin content, and what input fields could be leveraged for enrichment?
3. **Q3 (Fix Architecture)**: What is the optimal fix architecture — centralized, distributed, or combined — and what regressions must be guarded against?

## Scope

### In scope
- `generate-context.js` JSON mode pipeline (the only mode)
- Trigger phrase extraction, filtering, and output
- Key topic extraction and contamination
- Semantic summarizer content generation
- Input normalizer JSON → NormalizedData transformation
- Title builder truncation
- Post-save-review detection patterns
- Fix architecture design with regression analysis

### Out of scope
- MCP server-side `memory_save` indexing behavior
- Embeddings/vector search pipeline
- Non-JSON input modes (none exist)
- Implementation of fixes (separate phase)

## Method

3 GPT-5.4 agents via `codex exec` (high reasoning, workspace-write sandbox), each answering one research question. Follows `spec_kit:deep-research` protocol with externalized state files.

## Success Criteria

- [x] 5 root causes documented with file:line evidence
- [ ] Q1: Complete contamination map of path fragment entry points
- [ ] Q2: Field-by-field gap analysis of JSON mode vs pipeline expectations
- [ ] Q3: Architecture decision record with pros/cons/regression risks
- [ ] Fix recommendations prioritized P0/P1/P2 with exact code locations
- [ ] Regression test plan for existing test suites
