---
title: "154 -- JSON-primary deprecation posture"
description: "This scenario validates the JSON-primary deprecation posture: routine saves require --json/--stdin, direct positional capture requires --recovery, and operator guidance reflects the two-mode contract."
---

# 154 -- JSON-primary deprecation posture

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates the phase 017 JSON-primary deprecation posture. It confirms that direct positional saves without `--recovery` reject with migration guidance, that `--json` and `--stdin` succeed as routine saves, and that `--recovery` correctly enables stateless capture.

---

## 2. CURRENT REALITY

Operators verify the three-path contract: structured JSON succeeds, direct positional rejects, and explicit recovery enables stateless capture.

- Objective: Verify JSON-primary deprecation gating
- Prompt: `Test the three generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --recovery should reject with migration guidance, (3) --recovery with a spec folder should enable stateless capture. Return a pass/fail verdict for each path.`
- Expected signals: Path 1 exits 0, Path 2 exits non-zero with guidance text, Path 3 enters stateless capture
- Pass/fail: PASS if all three paths behave as documented; FAIL if any path has unexpected behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 154 | JSON-primary deprecation posture | Verify three-path save contract | `Test the three generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --recovery should reject with migration guidance, (3) --recovery with a spec folder should enable stateless capture. Return a pass/fail verdict for each path.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` → expect non-zero exit with migration message 3) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery <spec-folder>` → expect stateless capture attempt | Path 1: exit 0, Path 2: non-zero with guidance, Path 3: stateless capture | CLI exit codes and stdout/stderr output | PASS if all three paths match documented behavior | Check generate-context.ts argument parsing, --recovery flag detection, and migration guidance text |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/17-json-primary-deprecation-posture.md](../../feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md)
- Source spec: [017-json-primary-deprecation/spec.md](../../../specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/spec.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 154
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/154-json-primary-deprecation-posture.md`
