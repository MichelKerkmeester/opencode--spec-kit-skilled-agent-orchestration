---
title: "JSON-only save contract"
description: "Routine saves require --json or --stdin structured input; direct positional saves are rejected; operator guidance documents JSON as the sole save contract."
---

# JSON-only save contract

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. FEATURE BREAKDOWN](#3--feature-breakdown)
- [4. SOURCE FILES](#4--source-files)
- [5. VERIFICATION SOURCES](#5--verification-sources)
- [6. SOURCE METADATA](#6--source-metadata)

## 1. OVERVIEW

Phase 017 established the JSON-only save contract for `generate-context.js`. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is now the sole save contract for routine use.

The obsolete follow-up phases now live in the archived branch for this workstream.

---

## 2. CURRENT REALITY

The shipped posture enforces the following behavior:

1. Direct positional saves now exit non-zero with operator-facing migration guidance to the structured JSON contract.
2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented routine-save paths.
3. Operator-facing guidance in SKILL.md and the save command documents JSON mode as the sole save contract.
4. The obsolete follow-up phases (001-session-source-validation, 002-outsourced-agent-handback, 003-multi-cli-parity) are archived under the retired branch for this workstream.

---

## 3. FEATURE BREAKDOWN

### 3.1 JSON-only enforcement

- Direct positional mode (no `--json` or `--stdin`) now rejects with a non-zero exit and migration guidance.
- This removes the unreliable direct runtime-capture path from routine CLI use. There is no flag to re-enable it.

### 3.2 Structured JSON as primary contract

- `--json '<inline-json>'` accepts structured session data as a CLI argument.
- `--stdin` reads structured JSON from standard input.
- File-backed JSON (path as first argument) remains on the structured path.
- Explicit CLI target still outranks payload `specFolder` in structured-input modes.

### 3.3 Operator guidance updates

- SKILL.md updated to describe JSON mode as the sole routine-save contract.
- The save command (`/memory:save`) updated to document the JSON-only posture.
- CLAUDE.md and equivalent agent instructions updated to reflect the single-mode contract: JSON only.

### 3.4 Follow-up phase archival

- Phases 001 (session-source-validation), 002 (outsourced-agent-handback), and 003 (multi-cli-parity) moved under the archived follow-up branch.
- These phases were originally designed to improve runtime-capture quality but became obsolete when the JSON-only posture removed direct routine capture entirely.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/memory/generate-context.ts` | CLI argument parsing, JSON-only enforcement, migration guidance |
| `scripts/loaders/data-loader.ts` | Structured-input routing enforcement |
| `scripts/types/session-types.ts` | Structured JSON enrichment types |
| `SKILL.md` | Operator guidance: JSON-only save contract |
| `.opencode/command/memory/save.md` | Save command alignment with JSON-only contract |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, positional rejection |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Direct-mode rejection enforcement |

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
