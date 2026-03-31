---
title: "248 -- PreCompact hook fires and caches context"
description: "This scenario validates PreCompact hook context caching for 248. It focuses on PreCompact hook precomputes context and caches to hook state."
---

# 248 -- PreCompact hook fires and caches context

## 1. OVERVIEW

This scenario validates PreCompact hook context caching.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the PreCompact hook reads the transcript tail, extracts file paths and topics, builds a compact context payload via the 3-source merge pipeline, truncates to the 4000-token budget, and caches the result in hook state at `${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json`. Stdout must NOT be written (caching only).
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - The MCP server `mcp_server/` directory exists with compiled dist
- **Prompt**: `Validate 248 PreCompact hook context caching behavior. Run the vitest suite for hook-precompact and confirm: (1) transcript tail extraction produces file paths and topics, (2) the 3-source merge pipeline (mergeCompactBrief) is invoked, (3) payload is truncated to COMPACTION_TOKEN_BUDGET (4000 tokens), (4) hook state file is written with pendingCompactPrime containing payload and cachedAt, (5) no stdout output is produced.`
- **Expected signals**:
  - All vitest tests in `hook-precompact.vitest.ts` pass
  - `tailFile()` extracts last 50 lines from transcript JSONL
  - `extractFilePaths()` returns up to 20 unique file paths matching `/path/file.ext` pattern
  - `extractTopics()` returns up to 10 spec folder and tool references
  - `buildMergedContext()` produces sections (Active Files, Semantic Context, Session State)
  - `truncateToTokenBudget()` enforces the 4000-token cap (16000 chars)
  - `updateState()` stores `{ pendingCompactPrime: { payload, cachedAt } }` in session state JSON
  - Process exits with code 0 even on errors (hooks must never block Claude)
- **Pass/fail criteria**:
  - PASS: All tests pass, cached payload is within budget, hook state file contains valid `pendingCompactPrime` object
  - FAIL: Any test fails, payload exceeds 4000 tokens, or stdout is written during PreCompact

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 248a | PreCompact hook context caching | Transcript tail extraction produces file paths and topics from last 50 lines | `Validate 248a transcript extraction` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts` | `tailFile()` returns lines, `extractFilePaths()` returns paths, `extractTopics()` returns spec/tool refs | Test output showing extraction results | PASS if file paths and topics extracted from transcript tail | Verify transcript fixture exists and contains paths matching `/path/file.ext` regex |
| 248b | PreCompact hook context caching | 3-source merge pipeline builds context within 4000-token budget | `Validate 248b merge pipeline budget` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts` | `mergeCompactBrief()` called, output length <= 16000 chars (4000 tokens x 4 chars) | Test output showing token estimate | PASS if merged payload fits within COMPACTION_TOKEN_BUDGET | Check `compact-merger.ts` for budget enforcement logic |
| 248c | PreCompact hook context caching | Hook state file written with pendingCompactPrime and no stdout produced | `Validate 248c hook state caching` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts` | `updateState()` writes JSON with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`, no stdout | Test output confirming state write | PASS if state file has valid pendingCompactPrime and stdout is empty | Check `hook-state.ts` for state directory path and atomic write logic |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/02-precompact-hook.md](../../feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 248
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/248-precompact-hook.md`
