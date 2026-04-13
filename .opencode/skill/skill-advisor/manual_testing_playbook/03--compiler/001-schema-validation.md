---
title: "CP-001 -- Schema Validation"
description: "This scenario validates Schema Validation for `CP-001`. It focuses on every graph-metadata.json file passing compiler validation without errors."
---

# CP-001 -- Schema Validation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CP-001`.

---

## 1. OVERVIEW

This scenario validates Schema Validation for `CP-001`. It focuses on every graph-metadata.json file passing compiler validation without errors.

### Why This Matters

If metadata schema validation fails, the compiled graph cannot be trusted and every graph-aware routing scenario becomes suspect.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify all discovered graph metadata files pass compiler validation
- Real user request: `"validate every skill graph metadata file"`
- Prompt: `As a compiler validation operator, validate schema compliance against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only. Verify 21 graph-metadata.json files are discovered, validation passes, and the command exits cleanly. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the compiler reports 21 discovered metadata files, prints a validation-passed message, and exits with code 0
- Pass/fail: PASS if 21 files are discovered with zero validation errors and exit code 0; FAIL if validation errors appear or the discovered count drops below 21

---

## 3. TEST EXECUTION

### Prompt

`As a compiler validation operator, validate schema compliance against .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only. Verify 21 graph-metadata.json files are discovered, validation passes, and the command exits cleanly. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only`

### Expected

The compiler reports `Discovered 21 skill graph-metadata.json files`, prints a validation-passed message, and exits successfully with no schema errors.

### Evidence

Capture the full compiler transcript, including the discovered-file count, validation summary, and shell exit status.

### Pass/Fail

- **Pass**: 21 metadata files are discovered, validation passes, and the command exits 0
- **Fail**: Any validation error appears, the discovered count is lower than 21, or the command exits non-zero

### Failure Triage

Review schema validation in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`. Inspect representative metadata such as `.opencode/skill/mcp-figma/graph-metadata.json` and `.opencode/skill/system-spec-kit/graph-metadata.json` for missing required fields. Re-run with pretty output if a specific file needs closer inspection.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler and schema validator under test |
| `.opencode/skill/mcp-figma/graph-metadata.json` | Representative MCP metadata subject to schema validation |
| `.opencode/skill/system-spec-kit/graph-metadata.json` | Representative system skill metadata subject to schema validation |

---

## 5. SOURCE METADATA

- Group: Compiler
- Playbook ID: CP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--compiler/001-schema-validation.md`
