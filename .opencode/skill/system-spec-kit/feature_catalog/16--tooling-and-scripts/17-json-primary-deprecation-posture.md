---
title: "JSON-primary deprecation posture"
description: "Routine saves prefer --json or --stdin structured input, while positional JSON file input remains supported on the same structured path; operator guidance documents JSON-first save workflows without claiming positional input was removed."
---

# JSON-primary deprecation posture

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. FEATURE BREAKDOWN](#3--feature-breakdown)
- [4. SOURCE FILES](#4--source-files)
- [5. VERIFICATION SOURCES](#5--verification-sources)
- [6. SOURCE METADATA](#6--source-metadata)

## 1. OVERVIEW

Phase 017 established the JSON-primary deprecation posture for `generate-context.js`. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract, while positional JSON file input remains functional on the same structured-input path.

The obsolete follow-up phases now live in the archived branch for this workstream.

---

## 2. CURRENT REALITY

The shipped posture enforces the following behavior:

1. Positional JSON file input remains supported and routes through the same structured loader path as other file-backed saves.
2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented and preferred routine-save paths for AI-composed structured input.
3. Operator-facing guidance in SKILL.md and the save command documents JSON mode as the preferred routine-save contract, not an exclusive removal of positional file input.
4. The obsolete follow-up phases (001-session-source-validation, 002-outsourced-agent-handback, 003-multi-cli-parity) are archived under the retired branch for this workstream.

---

## 3. FEATURE BREAKDOWN

### 3.1 JSON-primary preference

- Direct positional mode using a JSON file path still works and routes through `loadCollectedData()`.
- The removed behavior is routine runtime-derived capture, not structured file-backed JSON input.

### 3.2 Structured JSON as primary contract

- `--json '<inline-json>'` accepts structured session data as a CLI argument.
- `--stdin` reads structured JSON from standard input.
- File-backed JSON (path as first argument) remains on the same structured path.
- Explicit CLI target still outranks payload `specFolder` in structured-input modes.

### 3.3 Operator guidance updates

- SKILL.md updated to describe `--json` / `--stdin` as the preferred routine-save contract.
- The save command (`/memory:save`) updated to document the JSON-primary posture.
- CLAUDE.md and equivalent agent instructions updated to emphasize structured JSON capture without claiming positional file input was removed.

### 3.4 Follow-up phase archival

- Phases 001 (session-source-validation), 002 (outsourced-agent-handback), and 003 (multi-cli-parity) moved under the archived follow-up branch.
- These phases were originally designed to improve runtime-capture quality but became obsolete when the JSON-primary posture stopped depending on routine runtime capture.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/memory/generate-context.ts` | CLI argument parsing for `--json`, `--stdin`, and positional JSON file input |
| `scripts/loaders/data-loader.ts` | Structured-input routing enforcement |
| `scripts/types/session-types.ts` | Structured JSON enrichment types |
| `SKILL.md` | Operator guidance: JSON-primary deprecation posture |
| `.opencode/command/memory/save.md` | Save command alignment with the JSON-primary contract |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, explicit CLI target authority, and positional JSON file support |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Invalid inline JSON and missing-target failures for structured-input modes |

---

## 5. VERIFICATION SOURCES

- `cd .opencode/skill/system-spec-kit/scripts && npm run check`
- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`

---

## 6. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: JSON-primary deprecation posture
- Source spec: `009-perfect-session-capturing/017-json-primary-deprecation`
- Phase: 017
