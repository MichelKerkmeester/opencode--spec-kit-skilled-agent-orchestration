---
title: "256 -- Budget allocator floors and overflow"
description: "This scenario validates Budget allocator for 256. It focuses on Floor distribution and overflow redistribution."
---

# 256 -- Budget allocator floors and overflow

## 1. OVERVIEW

This scenario validates Budget allocator.

---

## 2. CURRENT REALITY

- **Objective**: Verify the token budget allocator distributes the 4000-token compaction budget across 4 context sources using floor allocations (constitutional: 700, codeGraph: 1200, cocoIndex: 900, triggered: 400, overflow pool: 800) plus overflow redistribution. Empty sources release their floor to the overflow pool. Overflow is redistributed by priority order: constitutional > codeGraph > cocoIndex > triggered. Total cap is enforced with deterministic trim in reverse priority order.
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
- **Prompt**: `Validate 256 Budget allocator behavior. Run the vitest suite for budget-allocator and confirm: (1) default floors sum correctly (700+1200+900+400+800=4000), (2) each source granted min(floor, actualSize), (3) empty sources release floor to overflow pool, (4) overflow redistributed to sources needing more in priority order (constitutional first), (5) total granted never exceeds 4000 (totalBudget), (6) cap enforcement trims in reverse priority (triggered first), (7) createDefaultSources() builds correct SourceBudget array.`
- **Expected signals**:
  - All vitest tests in `budget-allocator.vitest.ts` pass
  - DEFAULT_FLOORS constants: constitutional=700, codeGraph=1200, cocoIndex=900, triggered=400, overflow=800
  - When all sources have data: each gets at least its floor (capped at actual size)
  - When a source is empty (actualSize=0): its full floor goes to overflow pool
  - Overflow redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered
  - `AllocationResult.totalUsed` never exceeds `totalBudget` (4000)
  - When total exceeds budget, trim starts from triggered (lowest priority), then cocoIndex, then codeGraph, then constitutional
  - Each `SourceAllocation` has correct `floor`, `requested`, `granted`, `dropped` values
- **Pass/fail criteria**:
  - PASS: All allocation tests pass, total never exceeds 4000, overflow redistribution follows priority, empty sources release floors correctly
  - FAIL: Total exceeds 4000, priority order violated, or empty source floor not released to overflow pool

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 256a | Budget allocator | Floor distribution: each source gets min(floor, actualSize) | `Validate 256a floor distribution` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts` | Each source.granted = min(source.floor, source.actualSize), unused floor added to overflow | Test output showing allocation values | PASS if floor allocation matches min(floor, actualSize) for each source | Check `allocateBudget()` Step 1 logic |
| 256b | Budget allocator | Overflow redistribution follows priority order (constitutional first) | `Validate 256b overflow redistribution` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts` | When sources need more than floor, overflow given by priority: constitutional > codeGraph > cocoIndex > triggered | Test output showing bonus allocations | PASS if highest-priority sources receive overflow before lower-priority | Verify PRIORITY_ORDER array in `budget-allocator.ts` |
| 256c | Budget allocator | Total cap enforcement: never exceeds 4000 tokens, trim in reverse priority | `Validate 256c total cap enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts` | `AllocationResult.totalUsed <= 4000`, excess trimmed from triggered first, then cocoIndex, codeGraph, constitutional | Test output showing totalUsed and trim results | PASS if totalUsed <= 4000 in all scenarios and trim follows reverse priority | Check Step 3 trim logic with reversed PRIORITY_ORDER |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/10-budget-allocator.md](../../feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 256
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/256-budget-allocator.md`
