---
title: "265 -- Gemini CLI hooks session-prime fires on startup"
description: "This scenario validates Gemini CLI hooks for 265. It focuses on verifying Gemini session-prime delivers context on SessionStart events."
---

# 265 -- Gemini CLI hooks session-prime fires on startup

## 1. OVERVIEW

This scenario validates Gemini CLI hooks.

---

## 2. CURRENT REALITY

- **Objective**: Verify that Gemini CLI hook scripts correctly handle lifecycle events. The session-prime hook must read Gemini-format JSON from stdin ({session_id, source, ...}) and output hookSpecificOutput.additionalContext for context injection. On source=startup, it must deliver session priming context. On source=compact (synthetic, via readAndClearCompactPrime), it must inject cached compact payload. The compact-inject hook must perform one-shot injection on BeforeAgent events. The shared module must correctly parse Gemini stdin and format output. Cache TTL (30 minutes) must be enforced for compact payloads.
- **Prerequisites**:
  - Gemini CLI installed and configured, or hook scripts tested in isolation
  - Hook scripts compiled to dist/
  - At least one memory saved for priming content
- **Prompt**: `Validate 265 Gemini hooks. Simulate a Gemini SessionStart event with source=startup. Confirm: (1) session-prime.ts reads JSON from stdin with session_id, (2) output is JSON with hookSpecificOutput.additionalContext containing session context, (3) compact-inject.ts performs one-shot injection on BeforeAgent, (4) shared.ts parseGeminiStdin correctly parses Gemini input format, (5) stale cache (>30 min) is rejected.`
- **Expected signals**:
  - session-prime outputs valid JSON with hookSpecificOutput.additionalContext
  - additionalContext contains priming information (constitutional rules, session state)
  - compact-inject returns no output when no cached payload exists (normal case)
  - parseGeminiStdin returns GeminiHookInput with all expected fields
- **Pass/fail criteria**:
  - PASS: Session-prime delivers context on startup, compact-inject is one-shot, stdin parsing works, stale cache rejected
  - FAIL: Invalid output format, additionalContext missing, compact-inject repeats, or stale cache accepted

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 265a | Gemini CLI hooks | Session-prime outputs additionalContext on startup | `Validate 265a session-prime startup` | `echo '{"session_id":"test","source":"startup","cwd":"."}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js` | JSON output with hookSpecificOutput.additionalContext string | Hook script stdout | PASS if valid JSON with additionalContext field containing context text | Check formatGeminiOutput() and session-prime handleStartup() |
| 265b | Gemini CLI hooks | Compact-inject returns empty when no cached payload | `Validate 265b compact-inject no-op` | `echo '{"session_id":"test","hook_event_name":"BeforeAgent","prompt":"test"}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js` | No output or empty JSON (no cached compact payload) | Hook script stdout | PASS if no additionalContext injected when no cache exists | Check readAndClearCompactPrime() returns null |
| 265c | Gemini CLI hooks | Shared stdin parser handles Gemini format | `Validate 265c stdin parsing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/ --grep gemini` | parseGeminiStdin returns GeminiHookInput with session_id, source, cwd | Test output | PASS if all fields parsed correctly from Gemini JSON format | Check parseGeminiStdin() buffer concatenation and JSON.parse |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/21-gemini-cli-hooks.md](../../feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 265
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/265-gemini-hooks.md`
