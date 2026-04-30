---
title: "257 -- Working-set tracker feeds compaction"
description: "This scenario validates Working-set tracker for 257. It focuses on Tracked files appear in compaction priority."
audited_post_018: true
---

# 257 -- Working-set tracker feeds compaction

## 1. OVERVIEW

This scenario validates Working-set tracker.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the WorkingSetTracker correctly tracks file and symbol accesses during a session, using recency-weighted scoring (frequency * recency_decay where recency_decay = 1 / (1 + age_in_minutes / 10)) for compaction priority; `getTopRoots(n)` must return the most relevant files; The tracker must support serialization/deserialization for hook state persistence, auto-evict beyond maxFiles capacity (default: 20), and feed tracked files into the compact merger for compaction context.
- Real user request: `` Please validate Working-set tracker feeds compaction against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts and tell me whether the expected signals are present: All vitest tests pass for working-set-related scenarios; `trackFile(path)` creates entry with `accessCount: 1` and current timestamp; Second `trackFile(path)` increments `accessCount` to 2 and updates `lastAccessedAt`; `getTopRoots(5)` returns files sorted by score: recently accessed high-frequency files rank first; When tracker exceeds `maxFiles * 2`, oldest entries evicted to bring count back to `maxFiles`; `serialize()` returns `Record<string, FileAccess>`, `deserialize()` reconstructs tracker with same state; `trackSymbol(symbolId, fqName, filePath)` creates symbol entry and also calls `trackFile(filePath, [fqName])`; Compact merger includes working-set top roots in the codeGraph input section. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Working-set tracker feeds compaction against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify the WorkingSetTracker correctly tracks file and symbol accesses during a session, using recency-weighted scoring (frequency * recency_decay where recency_decay = 1 / (1 + age_in_minutes / 10)) for compaction priority. getTopRoots(n) must return the most relevant files. The tracker must support serialization/deserialization for hook state persistence, auto-evict beyond maxFiles capacity (default: 20), and feed tracked files into the compact merger for compaction context. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests pass for working-set-related scenarios; `trackFile(path)` creates entry with `accessCount: 1` and current timestamp; Second `trackFile(path)` increments `accessCount` to 2 and updates `lastAccessedAt`; `getTopRoots(5)` returns files sorted by score: recently accessed high-frequency files rank first; When tracker exceeds `maxFiles * 2`, oldest entries evicted to bring count back to `maxFiles`; `serialize()` returns `Record<string, FileAccess>`, `deserialize()` reconstructs tracker with same state; `trackSymbol(symbolId, fqName, filePath)` creates symbol entry and also calls `trackFile(filePath, [fqName])`; Compact merger includes working-set top roots in the codeGraph input section
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Tracking, scoring, eviction, serialization, and merger integration all work correctly; FAIL: Scoring order incorrect (stale files rank above recent), eviction not triggered, serialization loses data, or merger output missing tracked files

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate File tracking with recency-weighted scoring and getTopRoots ordering against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify trackFile() records accesses, getTopRoots() returns files sorted by frequency * recency_decay. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts

### Expected

`trackFile()` records accesses, `getTopRoots()` returns files sorted by frequency * recency_decay

### Evidence

Test output showing tracked files and their scores/ordering

### Pass / Fail

- **Pass**: frequently + recently accessed files rank highest in getTopRoots
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check scoring formula: `accessCount / (1 + (now - lastAccessedAt) / 600_000)`

---

### Prompt

```
As a context-and-code-graph validation operator, validate Auto-eviction beyond maxFiles and serialization roundtrip against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify tracker evicts when size > 2 * maxFiles, deserialize(serialize()) preserves all entries. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts

### Expected

Tracker evicts when size > 2 * maxFiles, `deserialize(serialize())` preserves all entries

### Evidence

Test output showing eviction count and deserialized state

### Pass / Fail

- **Pass**: eviction triggers at correct threshold and serialized state fully roundtrips
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `evictOldest()` and Map-based serialization

---

### Prompt

```
As a context-and-code-graph validation operator, validate Tracked files feed into compact merger output against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts. Verify merger output contains "Active Files & Structural Context" section listing working-set top roots. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts

### Expected

Merger output contains "Active Files & Structural Context" section listing working-set top roots

### Evidence

Test output showing merger sections with tracked file paths

### Pass / Fail

- **Pass**: working-set files appear in the merged compact brief
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check compact-inject.ts buildMergedContext() codeGraph input

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/11-working-set-tracker.md](../../feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 257
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/257-working-set-compaction.md`
