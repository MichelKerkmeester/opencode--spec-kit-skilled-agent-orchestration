---
title: "118 -- Error response credential sanitization"
description: "This scenario validates credential sanitization in MCP tool error responses. It focuses on verifying API keys and tokens are stripped from buildErrorResponse() output."
audited_post_018: true
---

# 118 -- Error response credential sanitization

## 1. OVERVIEW

This scenario validates credential sanitization in MCP tool error responses. It focuses on verifying API keys and tokens are stripped from `buildErrorResponse()` output.

---

## 2. SCENARIO CONTRACT


- Objective: Verify credential patterns are stripped from error responses.
- Real user request: `Please validate Error response credential sanitization against the documented validation surface and tell me whether the expected signals are present: All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects and arrays also sanitized.`
- RCAF Prompt: `As a data-integrity validation operator, validate Error response credential sanitization against the documented validation surface. Verify credential patterns are stripped from error responses. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects and arrays also sanitized
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if no credential patterns survive in any field of the error response envelope

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, verify credentials stripped from error responses against the documented validation surface. Verify all credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects sanitized. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set invalid VOYAGE_API_KEY or OPENAI_API_KEY
2. Call memory_search to trigger provider error
3. Inspect response.summary, response.data.error, response.data.details

### Expected

All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects sanitized

### Evidence

Error response JSON showing [REDACTED] replacements + preserved error codes

### Pass / Fail

- **Pass**: no credential patterns survive in any field of the error response envelope
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check sanitizeErrorField regex patterns; verify sanitizeDetails recursion depth; check for new credential formats not yet covered

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/07-error-response-credential-sanitization.md](../../feature_catalog/08--bug-fixes-and-data-integrity/07-error-response-credential-sanitization.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 118
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/118-error-response-credential-sanitization.md`
