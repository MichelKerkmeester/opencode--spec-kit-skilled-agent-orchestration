---
title: "Scan Known Agent (Debug)"
feature_id: "IS-001"
category: "Integration Scanner"
---

# Scan Known Agent (Debug)

Validates that scanning a known agent discovers all integration surfaces and confirms mirror alignment.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that scanning a known agent discovers all integration surfaces and confirms mirror alignment against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `status: "complete"` at root level. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['summary']['mirrorSyncStatus']=='all-aligned'; print('PASS')"
```

## Expected

- `status: "complete"` at root level
- `surfaces.canonical.exists: true`
- `surfaces.mirrors` array with 3 entries, each with `syncStatus: "aligned"`
- `summary.totalSurfaces >= 20`
- `summary.mirrorSyncStatus: "all-aligned"`
- `summary.commandCount >= 1`
- `summary.skillCount >= 1`
- Exit code is 0

## Pass Criteria

All mirrors report `syncStatus: "aligned"`, `summary.mirrorSyncStatus` equals `"all-aligned"`, `commandCount > 0`, `skillCount > 0`, and exit code is 0.

## Failure Triage

- If `surfaces.canonical.exists` is `false`: check that the debug agent file exists at `.opencode/agent/debug.md`
- If any mirror has `syncStatus` other than `"aligned"`: compare agent definitions across `.claude/agents/`, `.codex/agents/`, `.opencode/agent/`, and `.gemini/agents/` for inconsistencies
- If `summary.commandCount` is 0: verify debug-related command definitions exist in `.opencode/skill/*/commands/` or `.agents/commands/`
- If the script errors: verify Node.js version and that `scan-integration.cjs` has no syntax errors

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
