---
title: "CC-018 -- Structured output with json-schema"
description: "This scenario validates Structured output with json-schema for `CC-018`. It focuses on confirming `--json-schema '...' --output-format json` produces a Claude Code response that conforms to the supplied schema."
---

# CC-018 -- Structured output with json-schema

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-018`.

---

## 1. OVERVIEW

This scenario validates Structured output with json-schema for `CC-018`. It focuses on confirming `--json-schema '...' --output-format json` produces a Claude Code response that conforms to the supplied schema.

### Why This Matters

`--json-schema` is the cli-claude-code skill's strongest pipeline-integration mechanism. The Claude Tools Reference (`references/claude_tools.md`) explicitly contrasts this against Codex CLI's prompt-based JSON requests and Gemini CLI's `--output_format json` (no schema validation), positioning Claude Code's schema validation as the strongest structural guarantee. If responses do not conform to the supplied schema, every downstream pipeline that consumes Claude Code output (CC-013 review pipelines, CC-019 template-driven dispatches) becomes brittle.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CC-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--json-schema '...' --output-format json` produces a response that conforms to the supplied schema and can be safely consumed by a downstream pipeline without ad-hoc reshaping.
- Real user request: `Use Claude Code to audit a file and give me back JSON that strictly matches my schema (severity-tagged findings with line numbers and recommendations) - I'm piping this into another tool.`
- Prompt: `As an external-AI conductor needing pipeline-grade structured output for a security audit (severity-tagged findings with line numbers and recommendations), dispatch claude -p with --json-schema '...' --output-format json --permission-mode plan and a schema describing findings[] with severity enum, line number, description, and recommendation. Validate the returned JSON against the schema using jq or a JSON validator and verify each finding includes the required fields. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator constructs a minimal JSON schema for `findings[]`, dispatches with `--json-schema '...' --output-format json --permission-mode plan` against a defective sandbox file, validates the returned JSON parses cleanly and confirms each finding has the schema-required fields.
- Expected signals: Response is valid JSON parseable by `jq`. The inner `result` payload conforms to the supplied schema. Every finding has `severity` (one of critical/high/medium/low), `description` and a recommendation. The response can be piped into a downstream tool without ad-hoc reshaping.
- Desired user-visible outcome: Verdict naming the count of schema-valid findings and confirmation that downstream piping would work.
- Pass/fail: PASS if response is valid JSON AND every finding has the required schema fields AND the inner payload conforms to the schema enum. FAIL if any finding is missing required fields or the JSON envelope is malformed.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Construct a minimal JSON schema covering the findings shape.
3. Seed a defective sandbox file with multiple known issues.
4. Dispatch with `--json-schema '...' --output-format json --permission-mode plan`.
5. Validate the response against the schema with `jq`.
6. Return a verdict naming the count of schema-valid findings.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-018 | Structured output with json-schema | Confirm `--json-schema --output-format json` produces a schema-conformant response suitable for downstream pipelines | `As an external-AI conductor needing pipeline-grade structured output for a security audit (severity-tagged findings with line numbers and recommendations), dispatch claude -p with --json-schema '...' --output-format json --permission-mode plan and a schema describing findings[] with severity enum, line number, description, and recommendation. Validate the returned JSON against the schema using jq or a JSON validator and verify each finding includes the required fields. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf "const API_KEY = 'sk-ant-1234567890abcdef';\nfunction login(username, password) {\n  const sql = \"SELECT * FROM users WHERE username = '\" + username + \"' AND password = '\" + password + \"'\";\n  return db.exec(sql);\n}\n" > /tmp/cli-claude-code-playbook/audit-target.ts` -> 2. `bash: claude -p "Audit @/tmp/cli-claude-code-playbook/audit-target.ts for security vulnerabilities. Output a structured findings list." --json-schema '{"type":"object","properties":{"findings":{"type":"array","items":{"type":"object","properties":{"severity":{"type":"string","enum":["critical","high","medium","low"]},"line":{"type":"number"},"description":{"type":"string"},"recommendation":{"type":"string"}},"required":["severity","description","recommendation"]}}},"required":["findings"]}' --permission-mode plan --output-format json 2>&1 > /tmp/cc-018-output.json` -> 3. `bash: jq empty /tmp/cc-018-output.json && echo OK_JSON_PARSE` -> 4. `bash: jq -r '.result' /tmp/cc-018-output.json \| jq '.findings \| length'` -> 5. `bash: jq -r '.result' /tmp/cc-018-output.json \| jq '.findings[] \| select(.severity != null and .description != null and .recommendation != null) \| .severity' \| wc -l` -> 6. `bash: jq -r '.result' /tmp/cc-018-output.json \| jq '.findings[].severity' \| sort -u` | Step 1: defective file with hardcoded key + SQL injection written; Step 2: dispatch completes, JSON written; Step 3: `OK_JSON_PARSE` printed; Step 4: findings count >= 2 (key + injection); Step 5: count of findings with all required fields equals total findings count (no missing fields); Step 6: severity values are within the documented enum (critical/high/medium/low) | `/tmp/cli-claude-code-playbook/audit-target.ts`, `/tmp/cc-018-output.json`, terminal `jq` output | PASS if response is valid JSON AND all findings have required fields AND severity values match the enum; FAIL if any finding is missing fields or severity is outside the enum | 1. If the inner `.result` is a string of JSON (double-encoded), the dispatcher may not have honored `--json-schema` - re-pipe through `jq -R 'fromjson'`; 2. If severity values are outside the enum, the model violated the schema - check Claude Code version and verify `--json-schema` support; 3. If findings are missing required fields, tighten the prompt to demand each field explicitly; 4. If JSON parses but `.result` is a free-form string, fall back to inspecting the full envelope shape for the actual payload key |

### Optional Supplemental Checks

For complete pipeline integration validation, pipe the schema-validated output into a small downstream consumer (e.g., a `jq` filter that emits each `critical` finding as a single line) and confirm the consumer runs without errors. This is the strongest evidence that the schema contract holds in practice.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Structured Output (section 9) |
| `../../references/claude_tools.md` | Structured Output (--json-schema) section |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | Structured Output Processing pattern (section 4) |
| `../../assets/prompt_templates.md` | Structured Analysis templates (section 9) |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CC-018
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--integration-patterns/002-structured-output-with-json-schema.md`
