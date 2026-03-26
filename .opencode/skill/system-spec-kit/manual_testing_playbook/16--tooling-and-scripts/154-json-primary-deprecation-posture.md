---
title: "154 -- JSON-primary deprecation posture"
description: "This scenario validates the JSON-primary deprecation posture: routine saves require --json/--stdin, direct positional saves reject with migration guidance, and operator guidance reflects the JSON-only save contract."
---

# 154 -- JSON-primary deprecation posture

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates the phase 017 JSON-primary deprecation posture. It confirms that direct positional saves reject with migration guidance, and that `--json` and `--stdin` succeed as routine saves.

---

## 2. CURRENT REALITY

Operators verify the JSON-only save contract: structured JSON succeeds and direct positional rejects.

- Objective: Verify JSON-primary deprecation gating
- Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
- Expected signals: Path 1 exits 0, Path 2 exits non-zero with guidance text
- Pass/fail: PASS if both paths behave as documented; FAIL if any path has unexpected behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 154 | JSON-primary deprecation posture | Verify JSON-only save contract | `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` → expect non-zero exit with migration message | Path 1: exit 0, Path 2: non-zero with guidance | CLI exit codes and stdout/stderr output | PASS if both paths match documented behavior | Check generate-context.ts argument parsing and migration guidance text |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/17-json-primary-deprecation-posture.md](../../feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md)
- Source spec: [017-json-primary-deprecation/spec.md](../../../../../specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/spec.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 154
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/154-json-primary-deprecation-posture.md`
