---
title: "CG-009 -- File reference syntax (`@` prefix)"
description: "This scenario validates Gemini CLI's `@` file-reference syntax for `CG-009`. It focuses on confirming a single-shot prompt can pull explicit file contents into context via `@path/to/file` and that the resulting answer cites real content from the referenced file."
---

# CG-009 -- File reference syntax (`@` prefix)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-009`.

---

## 1. OVERVIEW

This scenario validates the `@` file-reference syntax for `CG-009`. It focuses on confirming `gemini "...@path/to/file..." -o text` resolves the path, pulls the file into context and produces an answer that demonstrably uses content from the referenced file rather than guessing from the model's prior knowledge.

### Why This Matters

The `@` syntax is the primary way the calling AI hands targeted file context to Gemini in cross-AI delegation. If `@` resolution silently skips the file, Gemini answers blind and the orchestrator wastes its quota. The scenario also verifies the `@` syntax does not require relative path gymnastics for files inside the project root.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `gemini "@path/to/file ..." -o text` resolves the file, includes its contents in context and the answer cites a verifiable string that exists in the file
- Real user request: `Pass cli-gemini's SKILL.md to Gemini using the @ syntax and have it quote the only-supported model name back to me as proof it actually read the file.`
- RCAF Prompt: `As a cross-AI orchestrator handing a single file to Gemini for analysis, invoke Gemini CLI against the cli-gemini skill in this repository using the @ file-reference syntax to pass SKILL.md. Verify the answer includes a verbatim quote that proves Gemini actually read the file (the only-supported model name). Return a concise pass/fail verdict with the main reason and the quoted string.`
- Expected execution process: orchestrator dispatches a `@` reference call, captures the response and greps for the expected verbatim string `gemini-3.1-pro-preview` to prove the file was read
- Expected signals: command exits 0. `.response` contains the literal string `gemini-3.1-pro-preview`. Answer is a single sentence or short paragraph quoting that model name in the context of "only supported model"
- Desired user-visible outcome: PASS verdict + a one-line quote such as `"the only supported model name is gemini-3.1-pro-preview"`
- Pass/fail: PASS if the response contains the literal string `gemini-3.1-pro-preview` AND the framing identifies it as the supported model. FAIL if the string is absent, the answer talks about a different model or the call errors

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "prove `@` resolves the file and Gemini reads it instead of hallucinating".
2. Stay local. This is a direct CLI dispatch.
3. Pick a verifiable verbatim string (`gemini-3.1-pro-preview`) that exists in SKILL.md and would be unlikely to surface from training data alone in this exact framing.
4. Run a `grep -c` to confirm the literal string is present in Gemini's answer.
5. Surface the quoted string in the verdict so the operator can match it against SKILL.md if they want manual confirmation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-009 | File reference syntax | Confirm `@path/to/file` resolves and the answer quotes a verifiable string from the referenced file | `As a cross-AI orchestrator handing a single file to Gemini for analysis, invoke Gemini CLI against the cli-gemini skill in this repository using the @ file-reference syntax to pass SKILL.md. Verify the answer includes a verbatim quote that proves Gemini actually read the file (the only-supported model name). Return a concise pass/fail verdict with the main reason and the quoted string.` | 1. `bash: gemini "@.opencode/skill/cli-gemini/SKILL.md What is the only supported model name listed in this file? Quote it verbatim in your one-sentence answer." -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-009.txt; echo EXIT=$?` -> 2. `bash: cat /tmp/cg-009.txt` -> 3. `bash: grep -c 'gemini-3.1-pro-preview' /tmp/cg-009.txt` | Step 1: `EXIT=0`; Step 2: prints a single-sentence answer naming the model; Step 3: grep count >= 1 | `/tmp/cg-009.txt` saved + outputs from Steps 2 and 3 | PASS if Step 3 grep count >= 1 AND Step 2 frames the model as the only supported one; FAIL if grep count is 0, the answer names a different model, or the call errors | 1. If grep count is 0, re-run with the same prompt but using `cat` injection (e.g. wrap SKILL.md content in the prompt body) to confirm the model can answer when given direct content — that isolates `@` resolution from model behaviour; 2. Inspect `/tmp/cg-009.txt` for any `cannot read file` errors (Gemini surfaces these inline); 3. Verify path is correct relative to the working directory at invocation time |

### Optional Supplemental Checks

If you want extra confidence the `@` resolution actually loaded the file (not just that the model knows the answer), repeat with a second prompt asking Gemini to quote a specific anchor comment such as `<!-- ANCHOR:related-resources -->`. That anchor is too specific to surface without reading the file.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (the actual file passed via `@` in this scenario) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §8 SPECIAL INPUT SYNTAX → File References documents the `@` prefix and glob support |
| `../../references/integration_patterns.md` | §7 CONTEXT ENRICHMENT → File References with `@` shows the orchestration pattern |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CG-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--built-in-tools/004-file-reference-syntax.md`
