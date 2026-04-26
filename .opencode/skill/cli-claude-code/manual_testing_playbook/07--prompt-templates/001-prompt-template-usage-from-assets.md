---
title: "CC-019 -- Prompt template usage from assets"
description: "This scenario validates Prompt template usage from assets for `CC-019`. It focuses on confirming the prompt templates inventory at `assets/prompt_templates.md` is loadable and a representative template produces well-formed output."
---

# CC-019 -- Prompt template usage from assets

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-019`.

---

## 1. OVERVIEW

This scenario validates Prompt template usage from assets for `CC-019`. It focuses on confirming the prompt templates inventory at `assets/prompt_templates.md` is loadable and a representative template produces well-formed output.

### Why This Matters

The cli-claude-code skill ships a curated template library to keep cross-AI orchestrator prompts consistent. ALWAYS rule 10 in SKILL.md mandates loading `assets/prompt_quality_card.md` before building any dispatch prompt. The template library complements that quality card by providing vetted starting points. If the templates fail to dispatch successfully or their output diverges from the documented intent, every "use the security review template" workflow becomes a custom rewrite.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the prompt templates file at `assets/prompt_templates.md` is loadable and that a representative template (Security Review under section 3) produces well-formed output when populated and dispatched.
- Real user request: `Use the cli-claude-code skill's security review template instead of writing one from scratch - load it, fill in the placeholders, and dispatch it against a real file.`
- Prompt: `As an external-AI conductor wanting to reuse a vetted prompt template instead of authoring one from scratch, load assets/prompt_templates.md from the cli-claude-code skill, select the security review template, populate the placeholders for a real target file, and dispatch the resulting claude -p command. Verify the command runs successfully and the response matches the template's intended structure (severity-tagged findings, etc.). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator reads the template file, locates the Security Review template under section 3, populates the `[file]` placeholder with a real target, dispatches the resulting `claude -p` command, then verifies the response matches the template's intended structure.
- Expected signals: Template file is readable and contains the labeled template (Security Review under section 3). Populated placeholders produce a syntactically valid `claude -p` invocation. Dispatched command exits 0 and the response shape matches the template's documented intent (severity ratings, line refs).
- Desired user-visible outcome: Verdict naming the template used, the populated invocation and the response shape observed.
- Pass/fail: PASS if template is loadable AND populated invocation dispatches cleanly AND response matches template intent. FAIL if template is missing, invocation has syntax errors or response shape diverges from the documented intent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Read `assets/prompt_templates.md` and locate the Security Review template under section 3.
3. Populate the `[file]` placeholder with a real defective sandbox file.
4. Dispatch the resulting `claude -p` command exactly as the template specifies.
5. Verify the response matches the template's documented intent.
6. Return a verdict naming the template, the invocation and the response shape.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-019 | Prompt template usage from assets | Confirm the Security Review template from `assets/prompt_templates.md` populates and dispatches cleanly | `As an external-AI conductor wanting to reuse a vetted prompt template instead of authoring one from scratch, load assets/prompt_templates.md from the cli-claude-code skill, select the security review template, populate the placeholders for a real target file, and dispatch the resulting claude -p command. Verify the command runs successfully and the response matches the template's intended structure (severity-tagged findings, etc.). Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: grep -A 5 "Security Review" .opencode/skill/cli-claude-code/assets/prompt_templates.md \| head -10` -> 2. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf "const API_KEY = 'sk-ant-1234567890abcdef';\nfunction unsafe(x) { return eval(x); }\n" > /tmp/cli-claude-code-playbook/template-target.ts` -> 3. `bash: claude -p "Security review of @/tmp/cli-claude-code-playbook/template-target.ts. Check for: XSS, CSRF, SQL injection, auth bypass, insecure defaults, hardcoded secrets, path traversal. Rate each finding: critical/high/medium/low." --agent review --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-019-output.txt` -> 4. `bash: grep -ciE '(critical\|high\|medium\|low)' /tmp/cc-019-output.txt` -> 5. `bash: grep -ciE '(api[_ ]key\|hardcoded\|eval)' /tmp/cc-019-output.txt` | Step 1: template excerpt prints the Security Review template; Step 2: defective sandbox file written; Step 3: dispatch completes; Step 4: at least 2 severity tags appear; Step 5: at least 2 findings reference the seeded issues (hardcoded API key + eval) | `/tmp/cli-claude-code-playbook/template-target.ts`, `/tmp/cc-019-output.txt`, terminal output of grep step 1 | PASS if template loads AND populated invocation dispatches cleanly AND response includes severity tags + flagged seeded issues; FAIL if template is missing, dispatch has syntax errors, or response misses the obvious findings | 1. If the template is missing, double-check the file path - templates may have moved between skill versions; 2. If dispatch has syntax errors, the populated `[file]` placeholder may not have been escaped - verify the path with `ls`; 3. If the response misses the seeded findings, the template may have been updated with stricter language requirements - check the latest version |

### Optional Supplemental Checks

To validate template breadth, pick a second template from a different category (for example "Function Analysis" under section 9 with `--json-schema`) and confirm it dispatches cleanly. Document the second template's shape match in evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` | Templates inventory (section 3 contains the Security Review template) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | The full templates library |
| `../../assets/prompt_quality_card.md` | Framework selection table referenced by template tags |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CC-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/001-prompt-template-usage-from-assets.md`
