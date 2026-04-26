---
title: "CP-005 -- GPT-5.3-Codex for code generation"
description: "This scenario validates code-generation routing to `--model gpt-5.3-codex` for `CP-005`. It focuses on confirming the codex-tuned model returns a syntactically valid Python function for a specified signature."
---

# CP-005 -- GPT-5.3-Codex for code generation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-005`.

---

## 1. OVERVIEW

This scenario validates the documented code-generation routing for `CP-005`. It focuses on confirming `--model gpt-5.3-codex` returns a syntactically valid Python function for the requested signature, validating the model selection actually changes Copilot's generation behaviour toward code-tuned output.

### Why This Matters

cli-copilot's documented multi-model strategy in `references/integration_patterns.md` §5 routes "Advanced Code Generation" to `gpt-5.3-codex`. If the codex-tuned route silently produces malformed code (or routes to a different model that returns prose instead of Python), every downstream code-generation prompt template inherits the same defect. Verifying syntactic validity via `ast.parse` is the cheapest objective check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model gpt-5.3-codex` returns a syntactically valid Python function for a specified signature
- Real user request: `Ask Copilot to write a small Python function I can drop into a script — pin it to the codex model and verify the output actually parses as valid Python.`
- Prompt: `As a cross-AI orchestrator routing code generation to the codex-tuned model, invoke Copilot CLI with --model gpt-5.3-codex against the cli-copilot skill in this repository. Verify the model returns a syntactically valid Python function for the requested signature without side effects on the project tree. Return a concise pass/fail verdict with the main reason and the function signature line.`
- Expected execution process: orchestrator dispatches `copilot -p "..." --model gpt-5.3-codex 2>&1`, extracts the Python code from stdout, writes it to `/tmp/cp-005-out.py`, then runs `python3 -c "import ast; ast.parse(open('/tmp/cp-005-out.py').read())"` to verify syntactic validity
- Expected signals: `EXIT=0`. Stdout contains a Python function definition matching `def slugify(text: str) -> str:`. AST-parse step exits 0. `git status --porcelain` diff is empty
- Desired user-visible outcome: PASS verdict + the parsed function signature + a one-line note that AST parsing succeeded
- Pass/fail: PASS if EXIT=0 AND function signature matches AND AST parse succeeds AND tripwire diff is empty. FAIL if Copilot returns prose instead of code, the function signature differs, AST parse fails or the project tree is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate that pinning to gpt-5.3-codex yields valid, parseable Python for a specified signature".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Dispatch the codex-pinned generation call.
4. Extract the Python code from stdout and write it to a sandbox file.
5. Run `ast.parse` on the sandbox file to verify syntactic validity, then return a one-line verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-005 | GPT-5.3-Codex for code generation | Confirm `--model gpt-5.3-codex` returns a syntactically valid Python function for a specified signature | `As a cross-AI orchestrator routing code generation to the codex-tuned model, invoke Copilot CLI with --model gpt-5.3-codex against the cli-copilot skill in this repository. Verify the model returns a syntactically valid Python function for the requested signature without side effects on the project tree. Return a concise pass/fail verdict with the main reason and the function signature line.` | 1. `bash: git status --porcelain > /tmp/cp-005-pre.txt` -> 2. `bash: copilot -p "Return ONLY the Python source for a function with this exact signature: def slugify(text: str) -> str. The function should lowercase the input, replace non-alphanumeric runs with single hyphens, and strip leading/trailing hyphens. No prose, no markdown fences, just the def block." --model gpt-5.3-codex 2>&1 > /tmp/cp-005-raw.txt` -> 3. `bash: sed -n '/^def slugify/,/^[^ ]/p' /tmp/cp-005-raw.txt > /tmp/cp-005-out.py && python3 -c "import ast; ast.parse(open('/tmp/cp-005-out.py').read()); print('AST_PARSE_OK')" && grep -E '^def slugify\(text: str\) -> str:' /tmp/cp-005-out.py && git status --porcelain > /tmp/cp-005-post.txt && diff /tmp/cp-005-pre.txt /tmp/cp-005-post.txt` | Step 1: pre-tripwire captured; Step 2: exits 0, stdout contains a `def slugify` block; Step 3: extracted file ast-parses cleanly (`AST_PARSE_OK` printed), grep matches the exact signature, tripwire diff empty | `/tmp/cp-005-raw.txt` (full transcript) + `/tmp/cp-005-out.py` (extracted function) + `/tmp/cp-005-pre.txt` and `/tmp/cp-005-post.txt` (tripwire pair) | PASS if EXIT=0 AND extracted file ast-parses AND signature grep matches AND tripwire diff is empty; FAIL if Copilot returns prose only, AST parse fails, signature differs, or project tree is mutated | 1. If AST parse fails, inspect `/tmp/cp-005-raw.txt` for markdown fences or commentary that the sed extraction missed; tighten the prompt to "no markdown fences"; 2. If signature differs, re-issue with explicit "exact signature, no changes" framing; 3. If the model returns prose, verify `--model gpt-5.3-codex` is the active codex variant per cli_reference.md §6 |

### Optional Supplemental Checks

After PASS, run a quick semantic spot-check: `python3 -c "import sys; sys.path.insert(0, '/tmp'); from cp-005-out import slugify; print(slugify('Hello World!'))"` (or import via `importlib`) and confirm the output is a sensible slug like `hello-world`. Logical correctness is not strictly required for PASS, but a wildly wrong implementation suggests the model misread the prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, Model Selection table in §3 includes `gpt-5.3-codex` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `gpt-5.3-codex` in §6 MODELS table (Best For: Advanced Code Generation) |
| `../../references/integration_patterns.md` | §5 Multi-Model Strategy routes "Advanced Code Generation" to `gpt-5.3-codex` |

---

## 5. SOURCE METADATA

- Group: Multi-Model
- Playbook ID: CP-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--multi-model/002-gpt-codex-code-generation.md`
