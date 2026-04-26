---
title: "251 -- Stop hook saves token usage"
description: "This scenario validates Stop hook token tracking for 251. It focuses on Transcript parsing, cost estimation, and snapshot storage."
audited_post_018: true
---

# 251 -- Stop hook saves token usage

## 1. OVERVIEW

This scenario validates Stop hook token tracking.

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that the Stop hook (async, fires on session end) parses the Claude Code transcript JSONL for token usage data (`input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`), calculates USD cost estimates per model (Opus: $15/$75 per 1M, Sonnet: $3/$15 per 1M, Haiku: $0.25/$1.25 per 1M), stores metrics in hook state, supports incremental parsing via byte offset, auto-detects spec folder from transcript paths, and triggers auto-save when completion tokens exceed 1000.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Test transcript JSONL fixtures available (or created by test)
- **Prompt**: `As a context-and-code-graph validation operator, validate Stop hook saves token usage against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify the Stop hook (async, fires on session end) parses the Claude Code transcript JSONL for token usage data (input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens), calculates USD cost estimates per model (Opus: $15/$75 per 1M, Sonnet: $3/$15 per 1M, Haiku: $0.25/$1.25 per 1M), stores metrics in hook state, supports incremental parsing via byte offset, auto-detects spec folder from transcript paths, and triggers auto-save when completion tokens exceed 1000. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests in `hook-stop-token-tracking.vitest.ts` pass
  - `parseTranscript()` correctly aggregates `input_tokens` and `output_tokens` from all assistant messages
  - `estimateCost()` uses correct per-model pricing: Opus ($15 prompt/$75 completion per 1M), Sonnet ($3/$15), Haiku ($0.25/$1.25)
  - Incremental parsing skips lines before `startOffset` and returns `newOffset`
  - Hook state updated with `metrics.estimatedPromptTokens`, `metrics.estimatedCompletionTokens`, `metrics.lastTranscriptOffset`
  - When `estimatedCompletionTokens > 1000`, `pendingCompactPrime` is set with auto-save recommendation
  - `detectSpecFolder()` finds `.opencode/specs/` paths in transcript and returns the most frequent one
- **Pass/fail criteria**:
  - PASS: Token counts match expected values, cost estimates accurate to 4 decimal places, incremental offset works, metrics stored in hook state
  - FAIL: Token counts incorrect, cost calculation wrong for any model tier, or incremental parsing re-parses already-processed lines

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Transcript JSONL parsing extracts token counts and model against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify parseTranscript() returns correct promptTokens, completionTokens, totalTokens, messageCount, model. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts

### Expected

parseTranscript()` returns correct `promptTokens`, `completionTokens`, `totalTokens`, `messageCount`, `model

### Evidence

Test output showing parsed token values

### Pass / Fail

- **Pass**: aggregated tokens match expected fixture totals
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `claude-transcript.ts` for JSONL field mapping (`input_tokens`, `output_tokens`)

---

### Prompt

```
As a context-and-code-graph validation operator, validate Cost estimation per model pricing tier against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify estimateCost() returns correct USD for Opus ($15/$75/1M), Sonnet ($3/$15/1M), Haiku ($0.25/$1.25/1M). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts

### Expected

`estimateCost()` returns correct USD for Opus ($15/$75/1M), Sonnet ($3/$15/1M), Haiku ($0.25/$1.25/1M)

### Evidence

Test output showing cost values

### Pass / Fail

- **Pass**: cost estimates match per-model pricing to 4 decimal places
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify pricing constants in `claude-transcript.ts` estimateCost()

---

### Prompt

```
As a context-and-code-graph validation operator, validate Incremental parsing via byte offset and metric snapshot storage against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts. Verify parsing from startOffset skips prior lines, newOffset advances, metrics stored in hook state JSON. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts

### Expected

Parsing from `startOffset` skips prior lines, `newOffset` advances, metrics stored in hook state JSON

### Evidence

Test output showing offset values and state write

### Pass / Fail

- **Pass**: re-parse from newOffset yields zero new messages, and state contains metrics
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check byte offset calculation with `Buffer.byteLength` for UTF-8

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/04-stop-token-tracking.md](../../feature_catalog/22--context-preservation-and-code-graph/04-stop-token-tracking.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 251
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/251-stop-hook-saves.md`
