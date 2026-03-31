---
title: "258 -- 3-source compact merger within budget"
description: "This scenario validates Compact merger for 258. It focuses on All non-empty sources included, total within 4000 tokens."
---

# 258 -- 3-source compact merger within budget

## 1. OVERVIEW

This scenario validates Compact merger.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the compact merger (`mergeCompactBrief()`) combines context from 3 sources (Memory, Code Graph, CocoIndex) plus session state and triggered memories into a unified compact brief. Must render up to 5 sections in priority order: "Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories". Uses the budget allocator for per-source token allocation. File-level deduplication removes duplicate file paths across sections (higher-priority source keeps its mentions). Output includes allocation metadata (`totalTokenEstimate`, `sourceCount`, `mergedAt`, `mergeDurationMs`, `deduplicatedFiles`). Total must stay within 4000 tokens.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
- **Prompt**: `Validate 258 Compact merger behavior. Run the vitest suite for compact-merger and confirm: (1) mergeCompactBrief() accepts MergeInput with constitutional, codeGraph, cocoIndex, triggered, sessionState fields, (2) non-empty sources render as titled sections with "## Section Name" headers, (3) empty sources are omitted, (4) budget allocator grants per-source token limits and truncation applied, (5) file-level deduplication removes duplicate paths from lower-priority sections, (6) metadata includes totalTokenEstimate, sourceCount, mergedAt, mergeDurationMs, deduplicatedFiles, (7) total output within 4000 tokens.`
- **Expected signals**:
  - All vitest tests in `compact-merger.vitest.ts` pass
  - When all 5 inputs non-empty: 5 sections rendered ("Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories")
  - When any input is empty string: corresponding section omitted from output
  - Each section truncated to its allocated budget via `truncateToTokens()`
  - File paths appearing in multiple sections: kept in highest-priority section, removed from lower
  - `MergedBrief.allocation` shows per-source `floor`, `requested`, `granted`, `dropped`
  - `MergedBrief.metadata.totalTokenEstimate` <= 4000
  - `MergedBrief.metadata.sourceCount` matches number of non-empty sections
  - `MergedBrief.metadata.deduplicatedFiles` shows count of removed duplicate references
- **Pass/fail criteria**:
  - PASS: All non-empty sources rendered with correct headers, total within 4000 tokens, deduplication removes duplicates, metadata accurate
  - FAIL: Empty source renders as section, total exceeds 4000 tokens, duplicate file paths remain across sections, or metadata fields missing/incorrect

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 258a | Compact merger | All 5 non-empty sources render as titled sections in priority order | `Validate 258a section rendering` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Output contains "## Constitutional Rules", "## Active Files & Structural Context", "## Semantic Neighbors", "## Session State / Next Steps", "## Triggered Memories" | Test output showing rendered section headers | PASS if all 5 sections present with correct headers when all inputs non-empty | Check `mergeCompactBrief()` section construction in compact-merger.ts |
| 258b | Compact merger | Budget allocation and per-source truncation within 4000-token total | `Validate 258b budget enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | `MergedBrief.metadata.totalTokenEstimate <= 4000`, each section within its granted budget | Test output showing allocation and token estimates | PASS if total within budget and no section exceeds its granted allocation | Check `allocateBudget()` integration and `truncateToTokens()` |
| 258c | Compact merger | File-level deduplication and metadata accuracy | `Validate 258c dedup and metadata` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Duplicate file paths removed from lower-priority sections, metadata has sourceCount, mergedAt, deduplicatedFiles | Test output showing dedup count and metadata fields | PASS if duplicate file paths removed and all metadata fields present with correct values | Check `deduplicateFilePaths()` and metadata construction |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/12-compact-merger.md](../../feature_catalog/22--context-preservation-and-code-graph/12-compact-merger.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 258
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/258-compact-merger-assembly.md`
