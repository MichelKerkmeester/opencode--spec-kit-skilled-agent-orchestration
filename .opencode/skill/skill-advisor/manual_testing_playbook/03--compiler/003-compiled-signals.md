---
title: "CP-003 -- Compiled Output Includes Signals"
description: "This scenario validates Compiled Output Includes Signals for `CP-003`. It focuses on the runtime graph preserving per-skill intent_signals in the compiled output."
---

# CP-003 -- Compiled Output Includes Signals

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CP-003`.

---

## 1. OVERVIEW

This scenario validates Compiled Output Includes Signals for `CP-003`. It focuses on the runtime graph preserving per-skill intent_signals in the compiled output.

### Why This Matters

If compiled intent signals disappear, the runtime graph loses the semantic hints that make graph-aware routing explainable and auditable.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify compiled skill-graph.json includes the signals mapping
- Real user request: `"inspect whether compiled graph output keeps intent signals"`
- Prompt: `As a compiler validation operator, validate compiled signal preservation against .opencode/skill/skill-advisor/scripts/skill-graph.json. Verify the signals field exists and contains entries for the current skill set. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the command prints `True` for the presence check, the signals map has entries for the active skills, and the field maps skill IDs to intent_signals arrays
- Pass/fail: PASS if the signals field is present and populated for most skills; FAIL if the field is missing or effectively empty

---

## 3. TEST EXECUTION

### Prompt

`As a compiler validation operator, validate compiled signal preservation against .opencode/skill/skill-advisor/scripts/skill-graph.json. Verify the signals field exists and contains entries for the current skill set. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 -c "import json; g=json.load(open('.opencode/skill/skill-advisor/scripts/skill-graph.json')); print('signals' in g, len(g.get('signals',{})))"`

### Expected

The command prints `True` followed by a populated entry count near the current skill count, demonstrating that the `signals` field exists and is not empty.

### Evidence

Capture the command output plus, if needed, a short JSON excerpt showing that `signals` maps skill IDs to intent_signals arrays.

### Pass / Fail

- **Pass**: The signals field is present and contains entries for most or all skills
- **Fail**: The signals field is missing, false, or empty

### Failure Triage

Inspect the signal-compilation logic in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`. Compare the compiled `.opencode/skill/skill-advisor/scripts/skill-graph.json` output with a representative source such as `.opencode/skill/system-spec-kit/graph-metadata.json`. Re-run the compiler if the runtime graph looks stale.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler logic that emits the signals map |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled runtime graph inspected for the signals field |
| `.opencode/skill/system-spec-kit/graph-metadata.json` | Representative source metadata contributing intent_signals to the compiled graph |

---

## 5. SOURCE METADATA

- Group: Compiler
- Playbook ID: CP-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--compiler/003-compiled-signals.md`
