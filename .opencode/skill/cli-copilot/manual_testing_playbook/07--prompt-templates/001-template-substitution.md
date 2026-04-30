---
title: "CP-018 -- Prompt template substitution"
description: "This scenario validates the documented Security Audit prompt template for `CP-018`. It focuses on confirming the template substitutes cleanly with `[file]` replaced and Copilot returns severity-classified findings for an intentionally flawed snippet."
---

# CP-018 -- Prompt template substitution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-018`.

---

## 1. OVERVIEW

This scenario validates the documented Security Audit prompt template for `CP-018`. It focuses on confirming the template from `assets/prompt_templates.md` §3 substitutes cleanly with `[file]` replaced by a real sandbox file. Copilot must return severity-classified findings that identify the intentional `eval()` flaw.

### Why This Matters

cli-copilot ships a curated set of prompt templates in `assets/prompt_templates.md` covering 9+ task categories. If template substitution silently fails (placeholders remain unreplaced or Copilot ignores the structured template framing), every documented prompt-template recipe loses its reliability. Verifying severity classification against an intentionally flawed snippet is the cheapest objective check that the template is being honoured end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the Security Audit template from `assets/prompt_templates.md` §3 substitutes cleanly and Copilot returns severity-classified findings that identify the intentional `eval()` flaw
- Real user request: `Take the Security Audit template from cli-copilot's prompt_templates.md, substitute the file placeholder with a tiny Python file that has an obvious eval() flaw, and verify Copilot returns severity-rated findings.`
- RCAF Prompt: `As a cross-AI orchestrator using cli-copilot's documented prompt templates, take the Security Audit template from assets/prompt_templates.md §3, substitute [file] with /tmp/cp-018-snippet.py (a small Python file with an intentional eval() flaw), dispatch the resulting prompt to Copilot via --model gpt-5.4 as documented in the template, and verify the answer covers OWASP Top 10 framing and rates findings by severity. Return a concise pass/fail verdict with the main reason and the highest-severity finding.`
- Expected execution process: orchestrator captures pre-call tripwire, writes the intentionally flawed snippet to `/tmp/cp-018-snippet.py`, substitutes `[file]` in the documented Security Audit template, dispatches the prompt with the documented `--model gpt-5.4`, then verifies the response identifies the eval() flaw, includes a severity classifier and references at least one OWASP-related concept
- Expected signals: `EXIT=0`. Response identifies the eval() flaw (e.g. mentions `eval`, code injection, untrusted input). Response includes at least one severity classifier (critical/high/medium/low or P0/P1/P2 or warning/info). Response references at least one OWASP-related concept (e.g. injection, untrusted input, A03:2021). Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + the highest-severity finding line + a one-line note that the template substituted cleanly
- Pass/fail: PASS if EXIT=0 AND eval() flaw identified AND >= 1 severity classifier AND >= 1 OWASP-related concept AND tripwire diff is empty. FAIL if eval() flaw missed, no severity classification, no OWASP framing or project tree mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the Security Audit template substitutes cleanly and Copilot returns severity-rated findings".
2. Stay local: this is a direct CLI dispatch with the documented model from the template.
3. Capture pre-call tripwire and write the flawed sandbox snippet.
4. Substitute `[file]` in the template and dispatch.
5. Inspect the response for eval() identification, severity classification, OWASP framing and confirm tripwire diff is empty.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-018 | Prompt template substitution | Confirm the Security Audit template from `assets/prompt_templates.md` §3 substitutes cleanly and Copilot returns severity-classified findings that identify the intentional `eval()` flaw | `As a cross-AI orchestrator using cli-copilot's documented prompt templates, take the Security Audit template from assets/prompt_templates.md §3, substitute [file] with /tmp/cp-018-snippet.py (a small Python file with an intentional eval() flaw), dispatch the resulting prompt to Copilot via --model gpt-5.4 as documented in the template, and verify the answer covers OWASP Top 10 framing and rates findings by severity. Return a concise pass/fail verdict with the main reason and the highest-severity finding.` | 1. `bash: git status --porcelain > /tmp/cp-018-pre.txt && printf '%s\n' 'def run_user_input(expr):' '    # SECURITY ISSUE: directly evaluates untrusted input' '    return eval(expr)' '' 'if __name__ == "__main__":' '    result = run_user_input(input("expression: "))' '    print(result)' > /tmp/cp-018-snippet.py` -> 2. `bash: copilot -p "Security review of @/tmp/cp-018-snippet.py. Scan for: OWASP Top 10, hardcoded secrets and insecure dependencies. Rate findings by severity." --model gpt-5.4 --allow-all-tools 2>&1 \| tee /tmp/cp-018-out.txt; echo "EXIT=$?"` -> 3. `bash: git status --porcelain > /tmp/cp-018-post.txt && diff /tmp/cp-018-pre.txt /tmp/cp-018-post.txt && grep -ciE 'eval' /tmp/cp-018-out.txt && grep -ciE '(critical\|high\|medium\|low\|P0\|P1\|P2\|severity\|warning)' /tmp/cp-018-out.txt && grep -ciE '(OWASP\|A0[0-9]:202[0-9]\|injection\|untrusted)' /tmp/cp-018-out.txt` | Step 1: pre-tripwire captured, flawed snippet written; Step 2: EXIT=0, response covers security audit; Step 3: tripwire diff empty, eval grep >= 1, severity grep >= 1, OWASP/injection grep >= 1 | `/tmp/cp-018-snippet.py` (target snippet) + `/tmp/cp-018-out.txt` (transcript) + `/tmp/cp-018-pre.txt` and `/tmp/cp-018-post.txt` (tripwire pair) + 3 grep counts | PASS if EXIT=0 AND eval grep >= 1 AND severity grep >= 1 AND OWASP/injection grep >= 1 AND tripwire diff empty; FAIL if any grep returns 0, EXIT != 0, or project tree mutated | 1. If eval grep is 0, Copilot likely did not actually read the snippet file — verify the `@/tmp/cp-018-snippet.py` reference resolved (check transcript for file-read confirmation). 2. If severity grep is 0, the model may not have honoured the template's "Rate findings by severity" instruction, re-issue with stronger framing. 3. If OWASP grep is 0 but severity is present, Copilot scored the finding without OWASP framing, partial PASS, flag for review |

### Optional Supplemental Checks

After PASS, look for whether Copilot proposed a fix (e.g. switch to `ast.literal_eval` or schema validation). The Security Audit template does not strictly require fix proposals, but their presence is a signal that the model engaged with the snippet beyond surface-level pattern matching.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §5 REFERENCES lists `prompt_templates.md` as a Templates and Assets file |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | §3 Code Review Security Audit template (Framework: TIDD-EC, model: gpt-5.4) |
| `../../assets/prompt_quality_card.md` | §3 Task to Framework Map maps Review tasks to TIDD-EC |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CP-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/001-template-substitution.md`
