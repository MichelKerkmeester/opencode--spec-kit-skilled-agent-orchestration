---
title: "258 -- 3-source compact merger within budget"
description: "This scenario validates Compact merger for 258. It focuses on All non-empty sources included, total within 4000 tokens."
audited_post_018: true
---

# 258 -- 3-source compact merger within budget

## 1. OVERVIEW

This scenario validates Compact merger.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the compact merger (`mergeCompactBrief()`) combines context from 3 sources (Memory, Code Graph, CocoIndex) plus session state and triggered memories into a unified compact brief; Must render up to 5 sections in priority order: "Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories"; Uses the budget allocator for per-source token allocation; File-level deduplication removes duplicate file paths across sections (higher-priority source keeps its mentions); Output includes allocation metadata (`totalTokenEstimate`, `sourceCount`, `mergedAt`, `mergeDurationMs`, `deduplicatedFiles`); Total must stay within 4000 tokens.
- Real user request: `` Please validate 3-source compact merger within budget against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts and tell me whether the expected signals are present: All vitest tests in `compact-merger.vitest.ts` pass; When all 5 inputs non-empty: 5 sections rendered ("Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories"); When any input is empty string: corresponding section omitted from output; Each section truncated to its allocated budget via `truncateToTokens()`; File paths appearing in multiple sections: kept in highest-priority section, removed from lower; `MergedBrief.allocation` shows per-source `floor`, `requested`, `granted`, `dropped`; `MergedBrief.metadata.totalTokenEstimate` <= 4000; `MergedBrief.metadata.sourceCount` matches number of non-empty sections; `MergedBrief.metadata.deduplicatedFiles` shows count of removed duplicate references. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate 3-source compact merger within budget against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify the compact merger (mergeCompactBrief()) combines context from 3 sources (Memory, Code Graph, CocoIndex) plus session state and triggered memories into a unified compact brief. Must render up to 5 sections in priority order: "Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories". Uses the budget allocator for per-source token allocation. File-level deduplication removes duplicate file paths across sections (higher-priority source keeps its mentions). Output includes allocation metadata (totalTokenEstimate, sourceCount, mergedAt, mergeDurationMs, deduplicatedFiles). Total must stay within 4000 tokens. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `compact-merger.vitest.ts` pass; When all 5 inputs non-empty: 5 sections rendered ("Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories"); When any input is empty string: corresponding section omitted from output; Each section truncated to its allocated budget via `truncateToTokens()`; File paths appearing in multiple sections: kept in highest-priority section, removed from lower; `MergedBrief.allocation` shows per-source `floor`, `requested`, `granted`, `dropped`; `MergedBrief.metadata.totalTokenEstimate` <= 4000; `MergedBrief.metadata.sourceCount` matches number of non-empty sections; `MergedBrief.metadata.deduplicatedFiles` shows count of removed duplicate references
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All non-empty sources rendered with correct headers, total within 4000 tokens, deduplication removes duplicates, metadata accurate; FAIL: Empty source renders as section, total exceeds 4000 tokens, duplicate file paths remain across sections, or metadata fields missing/incorrect

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate All 5 non-empty sources render as titled sections in priority order against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify output contains "## Constitutional Rules", "## Active Files & Structural Context", "## Semantic Neighbors", "## Session State / Next Steps", "## Triggered Memories". Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts

### Expected

Output contains "## Constitutional Rules", "## Active Files & Structural Context", "## Semantic Neighbors", "## Session State / Next Steps", "## Triggered Memories"

### Evidence

Test output showing rendered section headers

### Pass / Fail

- **Pass**: all 5 sections present with correct headers when all inputs non-empty
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `mergeCompactBrief()` section construction in compact-merger.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate Budget allocation and per-source truncation within 4000-token total against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify mergedBrief.metadata.totalTokenEstimate <= 4000, each section within its granted budget. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts

### Expected

`MergedBrief.metadata.totalTokenEstimate <= 4000`, each section within its granted budget

### Evidence

Test output showing allocation and token estimates

### Pass / Fail

- **Pass**: total within budget and no section exceeds its granted allocation
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `allocateBudget()` integration and `truncateToTokens()`

---

### Prompt

```
As a context-and-code-graph validation operator, validate File-level deduplication and metadata accuracy against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify duplicate file paths removed from lower-priority sections, metadata has sourceCount, mergedAt, deduplicatedFiles. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts

### Expected

Duplicate file paths removed from lower-priority sections, metadata has sourceCount, mergedAt, deduplicatedFiles

### Evidence

Test output showing dedup count and metadata fields

### Pass / Fail

- **Pass**: duplicate file paths removed and all metadata fields present with correct values
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `deduplicateFilePaths()` and metadata construction

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/12-compact-merger.md](../../feature_catalog/22--context-preservation-and-code-graph/12-compact-merger.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 258
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/258-compact-merger-assembly.md`
