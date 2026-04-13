---
title: "CP-004 -- Size Under 4KB"
description: "This scenario validates Size Under 4KB for `CP-004`. It focuses on the compiled skill graph staying within the documented 4 KB size target."
---

# CP-004 -- Size Under 4KB

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CP-004`.

---

## 1. OVERVIEW

This scenario validates Size Under 4KB for `CP-004`. It focuses on the compiled skill graph staying within the documented 4 KB size target.

### Why This Matters

If the runtime graph grows past the size target, startup and routing overhead increase and the graph becomes harder to ship as a compact runtime artifact.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify compiled output remains at or below 4096 bytes
- Real user request: `"compile the skill graph and confirm it stays under the 4 KB target"`
- Prompt: `As a compiler validation operator, validate compiled graph size against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py. Verify the reported size is 4096 bytes or less and no over-target warning is printed. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the compiler prints the compiled file size, the byte count is at or below 4096, and no size-warning line appears
- Pass/fail: PASS if the reported size is 4096 bytes or less with no warning; FAIL if the size exceeds the target or the warning is printed

---

## 3. TEST EXECUTION

### Prompt

`As a compiler validation operator, validate compiled graph size against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py. Verify the reported size is 4096 bytes or less and no over-target warning is printed. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`

### Expected

The compiler prints a `Compiled skill-graph.json: NNNN bytes` line, the reported byte count is at or below 4096, and no `WARNING: Output exceeds 4KB target` line appears.

### Evidence

Capture the compiler transcript that includes the compiled byte count, the output path, and the absence of any 4 KB warning message.

### Pass / Fail

- **Pass**: The compiled graph size is 4096 bytes or less and no warning is printed
- **Fail**: The compiled graph exceeds 4096 bytes or the compiler prints the size warning

### Failure Triage

Inspect output-size reporting in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`. Compare the generated `.opencode/skill/skill-advisor/scripts/skill-graph.json` against the current skill and edge count. Review recent metadata additions that may have inflated the compiled graph.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler that writes the runtime graph and reports its byte size |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled artifact whose size is under test |
| `.opencode/skill/skill-advisor/README.md` | Documentation describing the routing scripts and compiled graph tooling surface |

---

## 5. SOURCE METADATA

- Group: Compiler
- Playbook ID: CP-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--compiler/004-size-target.md`
