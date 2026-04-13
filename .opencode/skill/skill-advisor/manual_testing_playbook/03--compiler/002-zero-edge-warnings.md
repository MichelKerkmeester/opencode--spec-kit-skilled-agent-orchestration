---
title: "CP-002 -- Zero-Edge Warnings"
description: "This scenario validates Zero-Edge Warnings for `CP-002`. It focuses on orphan skills being warned without turning a soft warning into a validation failure."
---

# CP-002 -- Zero-Edge Warnings

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CP-002`.

---

## 1. OVERVIEW

This scenario validates Zero-Edge Warnings for `CP-002`. It focuses on orphan skills being warned without turning a soft warning into a validation failure.

### Why This Matters

If the compiler stops surfacing orphan skills, edge coverage drifts silently. If it escalates warnings into hard failures, harmless topology gaps can block routine validation.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify orphan skills trigger warnings but do not fail validation
- Real user request: `"check zero-edge warnings in graph validation"`
- Prompt: `As a compiler validation operator, validate zero-edge warning behavior against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only. Verify the ZERO-EDGE WARNINGS section appears, includes the current orphan skills, and still allows validation to pass. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: a `ZERO-EDGE WARNINGS` section appears, it lists the current orphan skills such as sk-deep-research and sk-git, and validation still passes
- Pass/fail: PASS if warnings are printed while validation still succeeds; FAIL if warnings disappear for known orphans or the warnings escalate into failure

---

## 3. TEST EXECUTION

### Prompt

`As a compiler validation operator, validate zero-edge warning behavior against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only. Verify the ZERO-EDGE WARNINGS section appears, includes the current orphan skills, and still allows validation to pass. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only`

### Expected

The compiler prints a `ZERO-EDGE WARNINGS` section, lists current orphan skills such as sk-deep-research and sk-git, and still reports an overall validation pass.

### Evidence

Capture the warning section, the named orphan skills, the final validation summary, and the exit status from the command.

### Pass / Fail

- **Pass**: Zero-edge warnings are present for the known orphan skills and validation still passes
- **Fail**: The warnings are missing for known orphan skills, or the warning path causes validation to fail

### Failure Triage

Review zero-edge detection in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`. Inspect `.opencode/skill/sk-deep-research/graph-metadata.json` and `.opencode/skill/sk-git/graph-metadata.json` to confirm they still contain no edges. Check whether a recent metadata change converted a warning into a hard validation error.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler logic that detects zero-edge orphan skills |
| `.opencode/skill/sk-deep-research/graph-metadata.json` | Known zero-edge metadata file expected to trigger the warning |
| `.opencode/skill/sk-git/graph-metadata.json` | Known zero-edge metadata file expected to trigger the warning |

---

## 5. SOURCE METADATA

- Group: Compiler
- Playbook ID: CP-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--compiler/002-zero-edge-warnings.md`
