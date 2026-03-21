---
title: "JSON-primary deprecation posture"
description: "Routine saves require --json or --stdin structured input; direct positional stateless capture moved to --recovery only; operator guidance updated to document JSON as the primary save contract."
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

Phase 017 established the JSON-primary deprecation posture for `generate-context.js`. Dynamic session capture (which reconstructs context from runtime databases after the fact) proved unreliable for routine saves — wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is now the required routine-save contract. Stateless capture is preserved only behind the explicit `--recovery` flag for crash recovery or situations where JSON composition is impossible.

This phase also archived the obsolete dynamic-capture follow-up phases under `000-dynamic-capture-deprecation/`.

---

## 2. CURRENT REALITY

The shipped posture enforces the following behavior:

1. Direct positional saves without `--recovery` now exit non-zero with operator-facing migration guidance to the structured JSON contract.
2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented routine-save paths.
3. `generate-context.js --recovery [spec-folder]` is the only way to invoke stateless capture from runtime databases.
4. Operator-facing guidance in SKILL.md and the save command documents JSON mode as preferred and stateless mode as recovery-only.
5. The obsolete dynamic-capture follow-up phases (001-session-source-validation, 002-outsourced-agent-handback, 003-multi-cli-parity) are archived under `000-dynamic-capture-deprecation/`.

---

## 3. FEATURE BREAKDOWN

### 3.1 Recovery-only gating

- Direct positional mode (no `--json`, `--stdin`, or `--recovery`) now rejects with a non-zero exit and migration guidance.
- This prevents accidental use of the unreliable stateless capture path for routine saves.
- The `--recovery` flag explicitly opts into stateless capture for crash recovery scenarios.

### 3.2 Structured JSON as primary contract

- `--json '<inline-json>'` accepts structured session data as a CLI argument.
- `--stdin` reads structured JSON from standard input.
- File-backed JSON (path as first argument) remains on the structured path.
- Explicit CLI target still outranks payload `specFolder` in structured-input modes.

### 3.3 Operator guidance updates

- SKILL.md updated to describe JSON mode as the preferred routine-save contract.
- The save command (`/memory:save`) updated to document JSON-primary posture.
- CLAUDE.md and equivalent agent instructions updated with the two-mode contract: JSON (preferred) vs recovery-only.

### 3.4 Dynamic-capture deprecation archival

- Phases 001 (session-source-validation), 002 (outsourced-agent-handback), and 003 (multi-cli-parity) moved under `000-dynamic-capture-deprecation/`.
- These phases were originally designed to improve dynamic capture quality but became obsolete when the JSON-primary posture eliminated routine stateless capture.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/memory/generate-context.ts` | CLI argument parsing, `--recovery` gating, migration guidance |
| `scripts/loaders/data-loader.ts` | Recovery-only fallback enforcement |
| `scripts/types/session-types.ts` | Structured JSON enrichment types |
| `SKILL.md` | Operator guidance: JSON-primary, recovery-only posture |
| `.opencode/command/memory/save.md` | Save command alignment with JSON-primary contract |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, positional rejection |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Recovery-only enforcement (`--recovery` flag parsing, direct-mode rejection) |

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
