---
title: "Stop hook token tracking"
description: "Stop hook token tracking parses Claude Code transcript JSONL for token usage, calculates cost estimates per model, and stores snapshots."
---

# Stop hook token tracking

## 1. OVERVIEW

Stop hook token tracking parses Claude Code transcript JSONL for token usage, calculates cost estimates per model, and stores snapshots.

The Stop hook runs asynchronously on session end. It reads stdin JSON, parses the transcript file for usage data (input_tokens, output_tokens, cache tokens), calculates USD cost estimates per model (Opus/Sonnet/Haiku), and stores metrics in hook state. Supports incremental parsing via byte offset.

---

## 2. CURRENT REALITY

mcp_server/hooks/claude/session-stop.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Hook` | Stop hook: parse, estimate, store | mcp_server/hooks/claude/claude-transcript.ts |
| `Hook` | JSONL transcript parser and cost estimator | mcp_server/tests/hook-stop-token-tracking.vitest.ts |

### Tests

| File | Focus |
|------|-------|
| `Transcript parsing, cost estimation, incremental offset` | phase 003 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Stop hook token tracking
- Current reality source: spec 024-compact-code-graph 
