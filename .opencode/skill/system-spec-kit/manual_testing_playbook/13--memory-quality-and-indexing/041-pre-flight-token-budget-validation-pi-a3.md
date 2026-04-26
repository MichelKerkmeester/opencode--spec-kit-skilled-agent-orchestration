---
title: "041 -- Pre-flight token budget validation (PI-A3)"
description: "This scenario validates Pre-flight token budget validation (PI-A3) for `041`. It focuses on Confirm save-time preflight warn/fail behavior."
audited_post_018: true
---

# 041 -- Pre-flight token budget validation (PI-A3)

## 1. OVERVIEW

This scenario validates Pre-flight token budget validation (PI-A3) for `041`. It focuses on Confirm save-time preflight warn/fail behavior.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `041` and confirm the expected signals without contradicting evidence.

- Objective: Confirm save-time preflight warn/fail behavior
- Prompt: `As a spec-doc record-quality validation operator, validate Pre-flight token budget validation (PI-A3) against memory_save({filePath:"<sandbox-file>", dryRun:true}). Verify token estimate is computed before embedding/database writes; near-limit input emits PF021 warning; over-limit input emits PF020 failure; behavior follows MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, and MCP_TOKEN_WARNING_THRESHOLD. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`
- Pass/fail: PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, confirm save-time preflight warn/fail behavior against memory_save({filePath:"<sandbox-file>", dryRun:true}). Verify token estimate is computed before embedding/database writes; near-limit input emits PF021 warning; over-limit input emits PF020 failure; behavior follows MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, and MCP_TOKEN_WARNING_THRESHOLD. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Prepare saved context artifacts near and over the save-time token limit
2. Run `memory_save({filePath:"<sandbox-file>", dryRun:true})` or the equivalent save preflight path
3. Verify warning/failure payloads from `preflight.ts`

### Expected

Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`

### Evidence

Preflight response payloads showing estimated tokens, warning/failure codes, and env-sensitive thresholds

### Pass / Fail

- **Pass**: Save-time preflight returns the expected warning/failure result without indexing side effects
- **Fail**: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior

### Failure Triage

Verify `preflight.ts` token counting math → Check `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD` wiring → Inspect dry-run/save preflight behavior

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md](../../feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 041
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md`
