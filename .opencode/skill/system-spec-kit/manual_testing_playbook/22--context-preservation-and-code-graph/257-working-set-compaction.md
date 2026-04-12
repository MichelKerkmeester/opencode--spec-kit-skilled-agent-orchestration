---
title: "257 -- Working-set tracker feeds compaction"
description: "This scenario validates Working-set tracker for 257. It focuses on Tracked files appear in compaction priority."
audited_post_018: true
---

# 257 -- Working-set tracker feeds compaction

## 1. OVERVIEW

This scenario validates Working-set tracker.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the WorkingSetTracker correctly tracks file and symbol accesses during a session, using recency-weighted scoring (frequency * recency_decay where recency_decay = 1 / (1 + age_in_minutes / 10)) for compaction priority. `getTopRoots(n)` must return the most relevant files. The tracker must support serialization/deserialization for hook state persistence, auto-evict beyond maxFiles capacity (default: 20), and feed tracked files into the compact merger for compaction context.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
- **Prompt**: `As a context-and-code-graph validation operator, validate Working-set tracker feeds compaction against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify the WorkingSetTracker correctly tracks file and symbol accesses during a session, using recency-weighted scoring (frequency * recency_decay where recency_decay = 1 / (1 + age_in_minutes / 10)) for compaction priority. getTopRoots(n) must return the most relevant files. The tracker must support serialization/deserialization for hook state persistence, auto-evict beyond maxFiles capacity (default: 20), and feed tracked files into the compact merger for compaction context. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests pass for working-set-related scenarios
  - `trackFile(path)` creates entry with `accessCount: 1` and current timestamp
  - Second `trackFile(path)` increments `accessCount` to 2 and updates `lastAccessedAt`
  - `getTopRoots(5)` returns files sorted by score: recently accessed high-frequency files rank first
  - When tracker exceeds `maxFiles * 2`, oldest entries evicted to bring count back to `maxFiles`
  - `serialize()` returns `Record<string, FileAccess>`, `deserialize()` reconstructs tracker with same state
  - `trackSymbol(symbolId, fqName, filePath)` creates symbol entry and also calls `trackFile(filePath, [fqName])`
  - Compact merger includes working-set top roots in the codeGraph input section
- **Pass/fail criteria**:
  - PASS: Tracking, scoring, eviction, serialization, and merger integration all work correctly
  - FAIL: Scoring order incorrect (stale files rank above recent), eviction not triggered, serialization loses data, or merger output missing tracked files

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 257a | Working-set tracker | File tracking with recency-weighted scoring and getTopRoots ordering | `As a context-and-code-graph validation operator, validate File tracking with recency-weighted scoring and getTopRoots ordering against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify trackFile() records accesses, getTopRoots() returns files sorted by frequency * recency_decay. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | `trackFile()` records accesses, `getTopRoots()` returns files sorted by frequency * recency_decay | Test output showing tracked files and their scores/ordering | PASS if frequently + recently accessed files rank highest in getTopRoots | Check scoring formula: `accessCount / (1 + (now - lastAccessedAt) / 600_000)` |
| 257b | Working-set tracker | Auto-eviction beyond maxFiles and serialization roundtrip | `As a context-and-code-graph validation operator, validate Auto-eviction beyond maxFiles and serialization roundtrip against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify tracker evicts when size > 2 * maxFiles, deserialize(serialize()) preserves all entries. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Tracker evicts when size > 2 * maxFiles, `deserialize(serialize())` preserves all entries | Test output showing eviction count and deserialized state | PASS if eviction triggers at correct threshold and serialized state fully roundtrips | Check `evictOldest()` and Map-based serialization |
| 257c | Working-set tracker | Tracked files feed into compact merger output | `As a context-and-code-graph validation operator, validate Tracked files feed into compact merger output against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify merger output contains "Active Files & Structural Context" section listing working-set top roots. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Merger output contains "Active Files & Structural Context" section listing working-set top roots | Test output showing merger sections with tracked file paths | PASS if working-set files appear in the merged compact brief | Check compact-inject.ts buildMergedContext() codeGraph input |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/11-working-set-tracker.md](../../feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 257
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/257-working-set-compaction.md`
