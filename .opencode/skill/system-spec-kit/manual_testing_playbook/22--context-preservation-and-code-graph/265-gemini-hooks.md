---
title: "265 -- Gemini CLI hooks session-prime fires on startup"
description: "This scenario validates Gemini CLI hooks for 265. It focuses on verifying Gemini session-prime delivers context on SessionStart events."
audited_post_018: true
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
- **Prompt**: `As a context-and-code-graph validation operator, validate Gemini CLI hooks session-prime fires on startup against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/ --grep gemini. Verify gemini CLI hook scripts correctly handle lifecycle events. The session-prime hook must read Gemini-format JSON from stdin ({session_id, source, ...}) and output hookSpecificOutput.additionalContext for context injection. On source=startup, it must deliver session priming context. On source=compact (synthetic, via readAndClearCompactPrime), it must inject cached compact payload. The compact-inject hook must perform one-shot injection on BeforeAgent events. The shared module must correctly parse Gemini stdin and format output. Cache TTL (30 minutes) must be enforced for compact payloads. Return a concise pass/fail verdict with the main reason and cited evidence.`
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

### Prompt

```
Validate 265a session-prime startup
```

### Commands

1. echo '{"session_id":"test","source":"startup","cwd":"."}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js

### Expected

JSON output with hookSpecificOutput.additionalContext string

### Evidence

Hook script stdout

### Pass / Fail

- **Pass**: valid JSON with additionalContext field containing context text
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check formatGeminiOutput() and session-prime handleStartup()

---

### Prompt

```
Validate 265b compact-inject no-op
```

### Commands

1. echo '{"session_id":"test","hook_event_name":"BeforeAgent","prompt":"test"}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js

### Expected

No output or empty JSON (no cached compact payload)

### Evidence

Hook script stdout

### Pass / Fail

- **Pass**: no additionalContext injected when no cache exists
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check readAndClearCompactPrime() returns null

---

### Prompt

```
As a context-and-code-graph validation operator, validate Shared stdin parser handles Gemini format against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/ --grep gemini. Verify parseGeminiStdin returns GeminiHookInput with session_id, source, cwd. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/ --grep gemini

### Expected

parseGeminiStdin returns GeminiHookInput with session_id, source, cwd

### Evidence

Test output

### Pass / Fail

- **Pass**: all fields parsed correctly from Gemini JSON format
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check parseGeminiStdin() buffer concatenation and JSON.parse

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/21-gemini-cli-hooks.md](../../feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 265
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/265-gemini-hooks.md`
