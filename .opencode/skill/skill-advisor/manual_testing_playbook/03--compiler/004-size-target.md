---
title: "CP-004 -- Size Target Enforcement"
description: "This scenario validates Size Target Enforcement for `CP-004`. It focuses on the compiler reporting the graph byte count and warning whenever the 4096-byte target is exceeded."
---

# CP-004 -- Size Target Enforcement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CP-004`.

---

## 1. OVERVIEW

This scenario validates Size Target Enforcement for `CP-004`. It focuses on the compiler reporting the graph byte count and warning whenever the 4096-byte target is exceeded.

### Why This Matters

If the runtime graph grows past the size target, startup and routing overhead increase and the graph becomes harder to ship as a compact runtime artifact.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify compiled output reports its byte count and emits the correct warning state relative to the 4096-byte target
- Real user request: `"compile the skill graph and confirm whether it breaches the size target"`
- Prompt: `As a compiler validation operator, validate compiled graph size enforcement against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py. Verify the command reports the compiled byte count and that the warning state matches the 4096-byte threshold. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the compiler prints the compiled file size, and the `WARNING: Output exceeds 4KB target` line appears only when the reported byte count is above 4096
- Pass/fail: PASS if the warning behavior matches the reported byte count; FAIL if the warning is missing above 4096 bytes or appears at or below 4096 bytes

---

## 3. TEST EXECUTION

### Prompt

`As a compiler validation operator, validate compiled graph size enforcement against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py. Verify the command reports the compiled byte count and that the warning state matches the 4096-byte threshold. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`

### Expected

The compiler prints a `Compiled skill-graph.json: NNNN bytes` line. If the reported byte count is above 4096, it also prints `WARNING: Output exceeds 4KB target`. In the current workspace state, the compiled graph is 4666 bytes, so the warning is expected.

### Evidence

Capture the compiler transcript that includes the compiled byte count, the output path, and the presence or absence of the 4 KB warning message.

### Pass/Fail

- **Pass**: The compiler reports the byte count and its warning behavior matches the 4096-byte threshold
- **Fail**: The warning is missing when the byte count exceeds 4096, appears when the byte count is 4096 or less, or the byte count is not reported

### Failure Triage

Inspect output-size reporting in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`. Compare the generated `.opencode/skill/skill-advisor/scripts/skill-graph.json` against the current skill and edge count. Review recent metadata additions that may have inflated the compiled graph.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler that writes the runtime graph and reports its byte size |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled artifact whose size and warning state are under test |
| `.opencode/skill/skill-advisor/README.md` | Documentation describing the routing scripts and compiled graph tooling surface |

---

## 5. SOURCE METADATA

- Group: Compiler
- Playbook ID: CP-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--compiler/004-size-target.md`
