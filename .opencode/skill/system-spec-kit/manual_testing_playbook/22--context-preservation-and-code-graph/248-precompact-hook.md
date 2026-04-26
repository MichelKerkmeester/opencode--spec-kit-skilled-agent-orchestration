---
title: "248 -- PreCompact hook fires and caches context"
description: "This scenario validates PreCompact hook context caching for 248. It focuses on PreCompact hook precomputes context and caches to hook state."
audited_post_018: true
---

# 248 -- PreCompact hook fires and caches context

## 1. OVERVIEW

This scenario validates PreCompact hook context caching.

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that the PreCompact hook reads the transcript tail, extracts file paths and topics, builds a compact context payload via the 3-source merge pipeline, truncates to the 4000-token budget, and caches the result in hook state at `${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json`. Stdout must NOT be written (caching only).
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - The MCP server `mcp_server/` directory exists with compiled dist
- **Prompt**: `As a context-and-code-graph validation operator, validate PreCompact hook fires and caches context against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify the PreCompact hook reads the transcript tail, extracts file paths and topics, builds a compact context payload via the 3-source merge pipeline, truncates to the 4000-token budget, and caches the result in hook state at ${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json. Stdout must NOT be written (caching only). Return a concise pass/fail verdict with the main reason and cited evidence.`
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

### Prompt

```
As a context-and-code-graph validation operator, validate Transcript tail extraction produces file paths and topics from last 50 lines against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify tailFile() returns lines, extractFilePaths() returns paths, extractTopics() returns spec/tool refs. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts

### Expected

`tailFile()` returns lines, `extractFilePaths()` returns paths, `extractTopics()` returns spec/tool refs

### Evidence

Test output showing extraction results

### Pass / Fail

- **Pass**: file paths and topics extracted from transcript tail
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify transcript fixture exists and contains paths matching `/path/file.ext` regex

---

### Prompt

```
As a context-and-code-graph validation operator, validate 3-source merge pipeline builds context within 4000-token budget against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify mergeCompactBrief() called, output length <= 16000 chars (4000 tokens x 4 chars). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts

### Expected

`mergeCompactBrief()` called, output length <= 16000 chars (4000 tokens x 4 chars)

### Evidence

Test output showing token estimate

### Pass / Fail

- **Pass**: merged payload fits within COMPACTION_TOKEN_BUDGET
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `compact-merger.ts` for budget enforcement logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate Hook state file written with pendingCompactPrime and no stdout produced against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts. Verify updateState() writes JSON with pendingCompactPrime.payload and pendingCompactPrime.cachedAt, no stdout. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts

### Expected

`updateState()` writes JSON with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`, no stdout

### Evidence

Test output confirming state write

### Pass / Fail

- **Pass**: state file has valid pendingCompactPrime and stdout is empty
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `hook-state.ts` for state directory path and atomic write logic

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/02-precompact-hook.md](../../feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 248
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/248-precompact-hook.md`
