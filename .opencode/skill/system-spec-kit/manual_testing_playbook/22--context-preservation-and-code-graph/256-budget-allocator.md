---
title: "256 -- Budget allocator floors and overflow"
description: "This scenario validates Budget allocator for 256. It focuses on Floor distribution and overflow redistribution."
audited_post_018: true
---

# 256 -- Budget allocator floors and overflow

## 1. OVERVIEW

This scenario validates Budget allocator.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the token budget allocator distributes the 4000-token compaction budget across 4 context sources using floor allocations (constitutional: 700, codeGraph: 1200, cocoIndex: 900, triggered: 400, overflow pool: 800) plus overflow redistribution; Empty sources release their floor to the overflow pool; Overflow is redistributed by priority order: constitutional > codeGraph > cocoIndex > triggered; Total cap is enforced with deterministic trim in reverse priority order.
- Real user request: `` Please validate Budget allocator floors and overflow against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts and tell me whether the expected signals are present: All vitest tests in `budget-allocator.vitest.ts` pass; DEFAULT_FLOORS constants: constitutional=700, codeGraph=1200, cocoIndex=900, triggered=400, overflow=800; When all sources have data: each gets at least its floor (capped at actual size); When a source is empty (actualSize=0): its full floor goes to overflow pool; Overflow redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered; `AllocationResult.totalUsed` never exceeds `totalBudget` (4000); When total exceeds budget, trim starts from triggered (lowest priority), then cocoIndex, then codeGraph, then constitutional; Each `SourceAllocation` has correct `floor`, `requested`, `granted`, `dropped` values. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Budget allocator floors and overflow against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts. Verify the token budget allocator distributes the 4000-token compaction budget across 4 context sources using floor allocations (constitutional: 700, codeGraph: 1200, cocoIndex: 900, triggered: 400, overflow pool: 800) plus overflow redistribution. Empty sources release their floor to the overflow pool. Overflow is redistributed by priority order: constitutional > codeGraph > cocoIndex > triggered. Total cap is enforced with deterministic trim in reverse priority order. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `budget-allocator.vitest.ts` pass; DEFAULT_FLOORS constants: constitutional=700, codeGraph=1200, cocoIndex=900, triggered=400, overflow=800; When all sources have data: each gets at least its floor (capped at actual size); When a source is empty (actualSize=0): its full floor goes to overflow pool; Overflow redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered; `AllocationResult.totalUsed` never exceeds `totalBudget` (4000); When total exceeds budget, trim starts from triggered (lowest priority), then cocoIndex, then codeGraph, then constitutional; Each `SourceAllocation` has correct `floor`, `requested`, `granted`, `dropped` values
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All allocation tests pass, total never exceeds 4000, overflow redistribution follows priority, empty sources release floors correctly; FAIL: Total exceeds 4000, priority order violated, or empty source floor not released to overflow pool

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Floor distribution: each source gets min(floor, actualSize) against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts. Verify each source.granted = min(source.floor, source.actualSize), unused floor added to overflow. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts

### Expected

Each source.granted = min(source.floor, source.actualSize), unused floor added to overflow

### Evidence

Test output showing allocation values

### Pass / Fail

- **Pass**: floor allocation matches min(floor, actualSize) for each source
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `allocateBudget()` Step 1 logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate Overflow redistribution follows priority order (constitutional first) against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts. Verify when sources need more than floor, overflow given by priority: constitutional > codeGraph > cocoIndex > triggered. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts

### Expected

When sources need more than floor, overflow given by priority: constitutional > codeGraph > cocoIndex > triggered

### Evidence

Test output showing bonus allocations

### Pass / Fail

- **Pass**: highest-priority sources receive overflow before lower-priority
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify PRIORITY_ORDER array in `budget-allocator.ts`

---

### Prompt

```
As a context-and-code-graph validation operator, validate Total cap enforcement: never exceeds 4000 tokens, trim in reverse priority against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts. Verify allocationResult.totalUsed <= 4000, excess trimmed from triggered first, then cocoIndex, codeGraph, constitutional. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts

### Expected

`AllocationResult.totalUsed <= 4000`, excess trimmed from triggered first, then cocoIndex, codeGraph, constitutional

### Evidence

Test output showing totalUsed and trim results

### Pass / Fail

- **Pass**: totalUsed <= 4000 in all scenarios and trim follows reverse priority
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check Step 3 trim logic with reversed PRIORITY_ORDER

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/10-budget-allocator.md](../../feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 256
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/256-budget-allocator.md`
