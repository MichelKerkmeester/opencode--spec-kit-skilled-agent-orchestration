---
title: "JSON-primary deprecation posture"
description: "Routine saves prefer --json or --stdin structured input, while positional JSON file input remains supported on the same structured path; operator guidance documents JSON-first save workflows without claiming positional input was removed."
---

# JSON-primary deprecation posture

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The JSON-primary deprecation posture for `generate-context.js` is now established. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract, while positional JSON file input remains functional on the same structured-input path.

The obsolete follow-up workstreams now live in the archived branch for this area.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The shipped posture enforces the following behavior:

1. Positional JSON file input remains supported and routes through the same structured loader path as other file-backed saves.
2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented and preferred routine-save paths for AI-composed structured input.
3. Operator-facing guidance in SKILL.md and the save command documents JSON mode as the preferred routine-save contract, not an exclusive removal of positional file input.
4. The obsolete session-source-validation, outsourced-agent-handback, and multi-cli-parity follow-up workstreams are archived under the retired branch for this area.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/memory/generate-context.ts` | CLI argument parsing for `--json`, `--stdin`, and positional JSON file input |
| `scripts/loaders/data-loader.ts` | Structured-input routing enforcement |
| `scripts/types/session-types.ts` | Structured JSON enrichment types |
| `SKILL.md` | Operator guidance: JSON-primary deprecation posture |
| `.opencode/command/memory/save.md` | Save command alignment with the JSON-primary contract |

### FEATURE BREAKDOWN

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

### 3.4 Follow-up workstream archival

- The session-source-validation, outsourced-agent-handback, and multi-cli-parity follow-up workstreams moved under the archived follow-up branch.
- These phases were originally designed to improve runtime-capture quality but became obsolete when the JSON-primary posture stopped depending on routine runtime capture.

---

### Validation And Tests

| File | Focus |
|------|-------|
| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, explicit CLI target authority, and positional JSON file support |
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Invalid inline JSON and missing-target failures for structured-input modes |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/17-json-primary-deprecation-posture.md`

### VERIFICATION SOURCES

- `cd .opencode/skill/system-spec-kit/scripts && npm run check`
- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`

---

### SOURCE METADATA
<!-- /ANCHOR:source-metadata -->
