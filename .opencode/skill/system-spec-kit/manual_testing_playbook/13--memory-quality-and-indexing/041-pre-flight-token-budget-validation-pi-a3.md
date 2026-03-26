---
title: "041 -- Pre-flight token budget validation (PI-A3)"
description: "This scenario validates Pre-flight token budget validation (PI-A3) for `041`. It focuses on Confirm save-time preflight warn/fail behavior."
---

# 041 -- Pre-flight token budget validation (PI-A3)

## 1. OVERVIEW

This scenario validates Pre-flight token budget validation (PI-A3) for `041`. It focuses on Confirm save-time preflight warn/fail behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `041` and confirm the expected signals without contradicting evidence.

- Objective: Confirm save-time preflight warn/fail behavior
- Prompt: `Verify pre-flight token budget validation (PI-A3). Capture the evidence needed to prove Token estimate is computed before embedding/database writes; near-limit input emits PF021 warning; over-limit input emits PF020 failure; behavior follows MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, and MCP_TOKEN_WARNING_THRESHOLD. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`
- Pass/fail: PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 041 | Pre-flight token budget validation (PI-A3) | Confirm save-time preflight warn/fail behavior | `Verify pre-flight token budget validation (PI-A3). Capture the evidence needed to prove Token estimate is computed before embedding/database writes; near-limit input emits PF021 warning; over-limit input emits PF020 failure; behavior follows MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, and MCP_TOKEN_WARNING_THRESHOLD. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare memory files near and over the save-time token limit 2) Run `memory_save({filePath:"<sandbox-file>", dryRun:true})` or the equivalent save preflight path 3) Verify warning/failure payloads from `preflight.ts` | Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD` | Preflight response payloads showing estimated tokens, warning/failure codes, and env-sensitive thresholds | PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior | Verify `preflight.ts` token counting math → Check `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD` wiring → Inspect dry-run/save preflight behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md](../../feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 041
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md`
