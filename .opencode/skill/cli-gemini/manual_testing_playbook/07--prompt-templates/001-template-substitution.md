---
title: "CG-017 -- Prompt template substitution end-to-end"
description: "This scenario validates the prompt-templates asset for `CG-017`. It focuses on confirming an operator can pull a documented template from `assets/prompt_templates.md`, substitute placeholders, and dispatch it to Gemini with the resulting answer matching the template's intent."
---

# CG-017 -- Prompt template substitution end-to-end

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-017`.

---

## 1. OVERVIEW

This scenario validates the `assets/prompt_templates.md` template-substitution flow for `CG-017`. It focuses on confirming an operator (or calling AI) can copy a documented template, substitute its `[placeholders]`, dispatch the resulting prompt to Gemini and receive an answer that matches the template's stated intent.

### Why This Matters

The prompt-templates asset is one of two ALWAYS-loaded resources in the cli-gemini smart router. If template substitution is brittle (e.g. placeholders silently retained in the dispatched prompt, Gemini ignoring the template framing), every downstream cli-gemini delegation that relies on a template inherits the regression. This scenario gives operators a deterministic way to confirm the template flow is intact.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a documented template from `assets/prompt_templates.md` (Code Review § Comprehensive Review) can be substituted and dispatched and that Gemini returns a structured review covering at least three of the five documented review categories
- Real user request: `Take the comprehensive code-review template from cli-gemini's prompt_templates.md, fill it in for a tiny snippet I'll drop in /tmp, dispatch it, and show me Gemini covered the documented review categories.`
- Prompt: `As a cross-AI orchestrator using cli-gemini's documented prompt templates, take the Comprehensive Review template from assets/prompt_templates.md §3, substitute [file] with /tmp/cg-017-snippet.py, dispatch the resulting prompt to Gemini, and verify the answer covers at least 3 of the 5 documented review categories: logic errors, code style, error handling, performance, maintainability. Return a concise pass/fail verdict with the main reason and the count of categories Gemini covered.`
- Expected execution process: orchestrator drops a small snippet, builds the dispatched prompt by substituting `[file]` with the snippet path, runs the dispatch, then greps the response for keyword markers from each of the five review categories
- Expected signals: command exits 0, response covers >= 3 of the 5 documented categories (each category has its own keyword set: logic/bug/edge case, style/naming/consistent, error/exception/handle, performance/complexity/optimi, maintain/readab/refactor) and response includes line references or finding labels (template asks for line + severity per finding)
- Desired user-visible outcome: PASS verdict + the count of covered categories + a one-line example finding from one of them
- Pass/fail: PASS if >= 3 categories are covered AND at least one finding has a line reference or severity label. FAIL if < 3 categories appear or the response is generic prose without line/severity references

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "prove template substitution + dispatch produces a structured answer matching the template's intent".
2. Stay local. This is a direct CLI dispatch.
3. Use a snippet small enough that Gemini has the budget to address all five categories, if the snippet is huge, low coverage may reflect attention budget rather than template failure.
4. Build the dispatched prompt programmatically (heredoc) so the substitution step is auditable in evidence.
5. Surface the per-category coverage map so the operator can sanity-check what was missed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-017 | Prompt template substitution | Confirm the Comprehensive Review template substitutes cleanly and Gemini covers >= 3 of the 5 documented review categories | `As a cross-AI orchestrator using cli-gemini's documented prompt templates, take the Comprehensive Review template from assets/prompt_templates.md §3, substitute [file] with /tmp/cg-017-snippet.py, dispatch the resulting prompt to Gemini, and verify the answer covers at least 3 of the 5 documented review categories: logic errors, code style, error handling, performance, maintainability. Return a concise pass/fail verdict with the main reason and the count of categories Gemini covered.` | 1. `bash: printf '%s\n' 'def fetch(url):' '    import urllib.request' '    return urllib.request.urlopen(url).read()' '' 'def total(items):' '    s = 0' '    for i in items:' '        s = s + i' '    return s' '' 'print(fetch("http://example.com"))' > /tmp/cg-017-snippet.py` -> 2. `bash: gemini "Review @/tmp/cg-017-snippet.py thoroughly. Check for: 1) Logic errors and edge cases, 2) Code style and naming consistency, 3) Error handling completeness, 4) Performance issues, 5) Maintainability concerns. For each issue found, provide the line reference, severity (critical/warning/info), and a suggested fix." -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-017.txt; echo EXIT=$?` -> 3. `bash: cat /tmp/cg-017.txt` -> 4. `bash: { LOG=$(grep -ciE 'logic\|bug\|edge case' /tmp/cg-017.txt); STY=$(grep -ciE 'style\|naming\|consistent' /tmp/cg-017.txt); ERR=$(grep -ciE 'error\|exception\|handle' /tmp/cg-017.txt); PERF=$(grep -ciE 'performance\|complexity\|optimi' /tmp/cg-017.txt); MAINT=$(grep -ciE 'maintain\|readab\|refactor' /tmp/cg-017.txt); COVERED=0; for c in "$LOG" "$STY" "$ERR" "$PERF" "$MAINT"; do [ "$c" -gt 0 ] && COVERED=$((COVERED+1)); done; echo "logic=$LOG style=$STY error=$ERR perf=$PERF maint=$MAINT covered=$COVERED"; }` -> 5. `bash: grep -nE 'line [0-9]+\|^[[:space:]]*[0-9]+\..*\(critical\|warning\|info\)' /tmp/cg-017.txt \| head -3` | Step 2: `EXIT=0`; Step 3: prints a structured review (numbered points or sections); Step 4: `covered` count >= 3; Step 5: at least one matching line/severity reference printed | `/tmp/cg-017-snippet.py`, `/tmp/cg-017.txt`, the per-category coverage line from Step 4, the line/severity references from Step 5 | PASS if Step 4 `covered` >= 3 AND Step 5 prints at least one matching line/severity reference; FAIL if `covered` < 3 or no line/severity references are present | 1. If `covered` < 3, the model may have collapsed categories — re-run with stricter `Address EACH of the 5 numbered categories explicitly`; 2. If line references are missing, re-run with explicit `Format each finding as: line N \| severity \| description`; 3. If the snippet was truncated (Gemini cited line numbers > the snippet length), the substitution may have leaked surrounding context — re-check the prompt heredoc |

### Optional Supplemental Checks

If you want extra confidence, also confirm the dispatched prompt itself contains no remaining `[placeholder]` brackets, a quick `grep -c '\[.*\]' /tmp/cg-017-prompt.txt` (if you logged the prompt) should return 0.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (`assets/prompt_templates.md` listed under §5 REFERENCES) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | §3 CODE REVIEW → Comprehensive Review template, the exact template substituted by this scenario |
| `../../assets/prompt_quality_card.md` | §3 Task to Framework Map confirms TIDD-EC framework choice for review tasks |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CG-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/001-template-substitution.md`
