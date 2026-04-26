---
title: "154 -- JSON-primary deprecation posture"
description: "This scenario validates the JSON-primary deprecation posture: routine saves prefer --json/--stdin, direct positional JSON file input remains supported on the same structured path, and operator guidance reflects the JSON-first save contract."
---

# 154 -- JSON-primary deprecation posture

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. SCENARIO CONTRACT](#2-scenario-contract)
- [3. TEST EXECUTION](#3-test-execution)
- [4. REFERENCES](#4-references)
- [5. SOURCE METADATA](#5-source-metadata)

## 1. OVERVIEW

This scenario validates the phase 017 JSON-primary deprecation posture. It confirms that structured JSON is the preferred routine-save path, while direct positional JSON file input remains supported on the same structured loader path.

---

## 2. SCENARIO CONTRACT

Operators verify the JSON-first save contract: structured JSON succeeds and direct positional file input still succeeds.

- Objective: Verify JSON-primary preference without removing positional file input support
- Prompt: `As a tooling validation operator, validate JSON-primary deprecation posture against the documented validation surface. Verify jSON-primary preference without removing positional file input support. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Path 1 exits 0, Path 2 exits 0, Path 3 exits 0
- Pass/fail: PASS if all three paths behave as documented; FAIL if any path has unexpected behavior

---

## 3. TEST EXECUTION

### Prompt

```
Test the generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) --stdin with valid structured payload should succeed, and (3) direct positional JSON file input should still succeed on the same structured path. Return a pass/fail verdict for each path.
```

### Commands

1. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0
2. `printf '{"specFolder":"test","sessionSummary":"test"}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <spec-folder>` → expect exit 0
3. `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json <spec-folder>` → expect exit 0

### Expected

Path 1: exit 0, Path 2: exit 0, Path 3: exit 0

### Evidence

CLI exit codes and stdout/stderr output

### Pass / Fail

- **Pass**: all three paths match documented behavior
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check generate-context.ts argument parsing, loader routing, and structured-input authority

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/17-json-primary-deprecation-posture.md](../../feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md)
- Source spec: [017-json-primary-deprecation/spec.md](../../../../specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/spec.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 154
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/154-json-primary-deprecation-posture.md`
- phase_018_change: direct positional JSON file input remains supported; scenario now validates JSON-first preference without claiming removal
- audited_post_018: true
