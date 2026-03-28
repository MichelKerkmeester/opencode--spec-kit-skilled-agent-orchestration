---
title: "118 -- Error response credential sanitization"
description: "This scenario validates credential sanitization in MCP tool error responses. It focuses on verifying API keys and tokens are stripped from buildErrorResponse() output."
---

# 118 -- Error response credential sanitization

## 1. OVERVIEW

This scenario validates credential sanitization in MCP tool error responses. It focuses on verifying API keys and tokens are stripped from `buildErrorResponse()` output.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `118` and confirm the expected signals without contradicting evidence.

- Objective: Verify credential patterns are stripped from error responses
- Prompt: `Trigger a provider error by using an invalid API key, then inspect the error response for leaked credentials. Verify that sk-*, voy_*, Bearer tokens, and key= patterns are replaced with [REDACTED] in summary, data.error, and data.details (including nested objects and arrays). Return a concise pass/fail verdict.`
- Expected signals: All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects and arrays also sanitized
- Pass/fail: PASS if no credential patterns survive in any field of the error response envelope

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 118 | Error response credential sanitization | Verify credentials stripped from error responses | `Trigger a provider error by using an invalid API key, then inspect the error response for leaked credentials. Verify that sk-*, voy_*, Bearer tokens, and key= patterns are replaced with [REDACTED] in summary, data.error, and data.details (including nested objects and arrays). Return a concise pass/fail verdict.` | 1) Set invalid VOYAGE_API_KEY or OPENAI_API_KEY 2) Call memory_search to trigger provider error 3) Inspect response.summary, response.data.error, response.data.details | All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects sanitized | Error response JSON showing [REDACTED] replacements + preserved error codes | PASS if no credential patterns survive in any field of the error response envelope | Check sanitizeErrorField regex patterns; verify sanitizeDetails recursion depth; check for new credential formats not yet covered |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/07-error-response-credential-sanitization.md](../../feature_catalog/08--bug-fixes-and-data-integrity/07-error-response-credential-sanitization.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 118
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/118-error-response-credential-sanitization.md`
