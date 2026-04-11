---
title: "Scan Diverse Agent (Debug)"
feature_id: "IS-003"
category: "Integration Scanner"
---

# Scan Diverse Agent (Debug)

Validates that scanning the debug agent discovers a broad set of integration surfaces (20+ expected).

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug | python3 -c "import sys,json; d=json.load(sys.stdin); s=d['summary']; assert s['totalSurfaces']>=20; assert s['commandCount']>=1; assert s['skillCount']>=5; print(f'PASS: {s[\"totalSurfaces\"]} surfaces, {s[\"commandCount\"]} commands, {s[\"skillCount\"]} skills')"
```

## Expected Signals

- `status: "complete"`
- `summary.totalSurfaces >= 20`
- `surfaces.mirrors` entries with `syncStatus: "aligned"`
- `summary.commandCount >= 1`
- `summary.skillCount >= 5`
- Surfaces span commands, skills, and global docs (CLAUDE.md, agent definitions, skill routing entries)
- Exit code is 0

## Pass Criteria

`summary.totalSurfaces` is 20 or more, mirrors are aligned, `commandCount >= 1`, `skillCount >= 5`, with surfaces found across commands, skills, and global docs.

## Failure Triage

- If `summary.totalSurfaces < 20`: review surface detection patterns to ensure all reference styles are covered (markdown links, inline mentions, routing tables, agent directory entries)
- If `summary.skillCount < 5`: check that skill routing entries referencing `debug` are being detected in CLAUDE.md and skill advisor config
- If `summary.commandCount < 1`: verify debug-related command definitions exist
- If the script errors: verify the debug agent file exists at `.opencode/agent/debug.md`

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
