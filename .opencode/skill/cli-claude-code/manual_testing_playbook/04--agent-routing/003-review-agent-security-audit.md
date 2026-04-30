---
title: "CC-013 -- Review agent security audit"
description: "This scenario validates Review agent security audit for `CC-013`. It focuses on confirming `--agent review --permission-mode plan` produces a structured security review with severity-tagged findings."
---

# CC-013 -- Review agent security audit

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-013`.

---

## 1. OVERVIEW

This scenario validates Review agent security audit for `CC-013`. It focuses on confirming `--agent review --permission-mode plan` produces a structured security review with severity-tagged findings.

### Why This Matters

The `review` agent is the canonical second-opinion auditor for cross-AI delegation. ALWAYS rule 3 mandates `--permission-mode plan` for review tasks. If the review agent fails to enforce read-only behavior, attest each checklist item or surface severity tags with line references, the security-audit cross-AI workflow (CC-018 schema-validated audits depend on this) cannot be trusted before merge.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent review --permission-mode plan` produces a structured security review of a target file with explicit verdicts on each checklist item and severity tags on findings.
- Real user request: `Use Claude Code's review agent to audit our auth handler for OWASP-style issues before I merge - I want explicit pass/fail per category, with line numbers if anything is flagged.`
- RCAF Prompt: `As an external-AI conductor wanting an independent security audit before merging a change, dispatch claude -p --agent review --permission-mode plan against @./src/auth/ (or any auth-related directory) with an explicit OWASP-style checklist (XSS, CSRF, injection, auth bypass, hardcoded secrets, insecure defaults). Verify the response either flags concrete severity-tagged findings (critical/high/medium/low) with line references OR explicitly attests to the absence of each checked vulnerability. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator picks (or seeds) an auth file with at least one known issue, dispatches with `--agent review --permission-mode plan` and an explicit checklist in the prompt, then parses for per-item verdicts and severity tags.
- Expected signals: Each checklist item (XSS, CSRF, injection, auth bypass, hardcoded secrets, insecure defaults) has an explicit verdict. Flagged findings include line references and severity tags. Response would be actionable to a human reviewer.
- Desired user-visible outcome: Verdict naming the count of flagged issues, top severity and confirmation that all checklist items received an explicit verdict.
- Pass/fail: PASS if every checklist item has an explicit verdict AND any flagged finding has a severity tag and line reference. FAIL if checklist items are silently skipped or findings lack severity/line refs.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick or seed a target file with at least one known issue (e.g., the SQL injection sample from CC-009).
3. Dispatch with explicit OWASP checklist in the prompt.
4. Parse the response for per-item verdicts and severity tags.
5. Return a verdict naming the issue count, top severity and checklist coverage.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-013 | Review agent security audit | Confirm `--agent review --permission-mode plan` produces severity-tagged findings with explicit per-item verdicts | `As an external-AI conductor wanting an independent security audit before merging a change, dispatch claude -p --agent review --permission-mode plan against @./src/auth/ (or any auth-related directory) with an explicit OWASP-style checklist (XSS, CSRF, injection, auth bypass, hardcoded secrets, insecure defaults). Verify the response either flags concrete severity-tagged findings (critical/high/medium/low) with line references OR explicitly attests to the absence of each checked vulnerability. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf "const API_KEY = 'sk-ant-1234567890abcdef';\nfunction login(username, password) {\n  const sql = \"SELECT * FROM users WHERE username = '\" + username + \"' AND password = '\" + password + \"'\";\n  return db.exec(sql);\n}\n" > /tmp/cli-claude-code-playbook/auth-defective.ts` -> 2. `bash: claude -p "Security review of @/tmp/cli-claude-code-playbook/auth-defective.ts. Check each of these explicitly and give a verdict (FOUND or CLEAN) for each: (1) XSS, (2) CSRF, (3) SQL injection, (4) auth bypass, (5) hardcoded secrets, (6) insecure defaults. For any FOUND items, include severity (critical/high/medium/low) and line references." --agent review --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-013-output.txt` -> 3. `bash: grep -ciE '(found\|clean)' /tmp/cc-013-output.txt` -> 4. `bash: grep -iE '(critical\|high\|medium\|low)' /tmp/cc-013-output.txt \| head -5` -> 5. `bash: grep -iE '(line [0-9])' /tmp/cc-013-output.txt \| head -5` | Step 1: sandbox file with hardcoded API key and SQL injection written; Step 2: dispatch completes; Step 3: count of FOUND/CLEAN verdicts >= 6 (one per checklist item); Step 4: at least 2 severity tags appear (for the two known issues); Step 5: at least 2 line references appear | `/tmp/cli-claude-code-playbook/auth-defective.ts`, `/tmp/cc-013-output.txt`, terminal grep results | PASS if all 6 checklist items have explicit verdicts AND >=2 severity tags AND >=2 line references; FAIL if items are silently skipped or findings lack severity/line refs | 1. If checklist items are missing, the response may have summarized - re-run with explicit "give a verdict for each numbered item" framing; 2. If severity tags are missing, the prompt may need to demand them more strictly - update to "MUST include severity"; 3. If `--agent review` is rejected, run `claude agents list` and check `.opencode/agent/review.md` exists |

### Optional Supplemental Checks

For pipeline integration, follow up with CC-018 (structured output with json-schema) using the same target file - the structured findings array should match the prose checklist verdicts captured here.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Review agent details (section 4) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | Security Review template (section 3) |
| `../../references/integration_patterns.md` | Generate-Review-Fix Cycle (section 2) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/003-review-agent-security-audit.md`
