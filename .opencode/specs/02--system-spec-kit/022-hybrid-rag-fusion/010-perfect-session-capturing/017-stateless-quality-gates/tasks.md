---
title: "Tasks: Stateless Quality Gate Fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "stateless quality gates tasks"
  - "phase 017 tasks"
  - "gate a tiering tasks"
  - "stdin tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Stateless Quality Gate Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Phase 016 is merged and test suite is green before starting any implementation work
- [x] T002 Read `workflow.ts` lines 2050–2100 to confirm Gate A structure and V8/V9 hard block positions
- [x] T003 Read `validate-memory-quality.ts` to confirm V1-V11 rule definitions and failure return shape
- [x] T004 Read `generate-context.ts` lines 195–220 to confirm CLI argument parsing and `runWorkflow()` call site
- [x] T005 Read `contamination-filter.ts` lines 50–80 to confirm `filterContamination()` signature and pattern severity map
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2a — Tiered Gate A** (`workflow.ts`, `validate-memory-quality.ts`, `workflow-e2e.vitest.ts`):

- [x] T010 [P] Add `HARD_BLOCK_RULES` constant or export to `validate-memory-quality.ts` listing V1, V3, V8, V9, V11
- [x] T011 Refactor Gate A condition in `workflow.ts` (~line 2085): abort only if a hard-block rule fails for non-file sources; log warning and continue for soft-warning rules
- [x] T012 [P] Add unit test: V10-only failure in stateless mode → save proceeds with warning (`workflow-e2e.vitest.ts`)
- [x] T013 [P] Add unit test: V8 failure in stateless mode → save aborts with QUALITY_GATE_ABORT (`workflow-e2e.vitest.ts`)
- [x] T014 [P] Add unit test: V10 + V8 failure in stateless mode → abort (hard-block wins) (`workflow-e2e.vitest.ts`)
- [x] T015 [P] Add regression assertion: soft-warning V10 pass-through logs warning output without `QUALITY_GATE_ABORT` (`workflow-e2e.vitest.ts`)

**Phase 2b — `--stdin` / `--json` Support** (`generate-context.ts`):

- [x] T020 [P] Add `--stdin` flag to CLI argument parsing in `generate-context.ts` (~line 202)
- [x] T021 [P] Add `--json <string>` flag to CLI argument parsing in `generate-context.ts` (~line 202)
- [x] T022 Implement stdin reader: read all of `process.stdin`, parse as JSON, set `parsed._source = 'file'`, pass as `options.collectedData`
- [x] T023 Implement inline JSON path: parse `--json` string value, set `_source = 'file'`, pass as `options.collectedData`
- [x] T024 Define mode precedence and spec-folder authority for stdin/json mode: explicit CLI target outranks payload `specFolder`; payload target is used when no explicit target is present
- [x] T025 Resolve and validate the target spec folder for stdin/json mode before `runWorkflow()` executes
- [x] T026 Add JSON schema validation: require valid structured content plus a resolvable target spec folder; emit descriptive error and exit non-zero on failure
- [x] T027 Handle edge cases: empty stdin (error + non-zero exit), broken pipe (graceful error), non-JSON input (parse error to stderr)
- [x] T028 [P] Add unit test: stdin/json mode passes preloaded `collectedData` and authoritative `specFolderArg` into `runWorkflow()` (`generate-context-cli-authority.vitest.ts`)
- [x] T029 [P] Add unit test: malformed JSON via `--stdin` exits non-zero with descriptive error (`generate-context-cli-authority.vitest.ts`)
- [x] T030 [P] Add unit test: invalid or missing target spec folder in stdin/json mode exits non-zero with descriptive error (`generate-context-cli-authority.vitest.ts`)
- [x] T031 [P] Add unit test: `--json '{}'` empty object fails on sufficiency check, not contamination (`generate-context-cli-authority.vitest.ts`)

**Phase 2c — Source-Aware Contamination Filter** (`contamination-filter.ts`, `workflow.ts`):

- [x] T040 [P] Add optional third `options` parameter with `captureSource?: string` to `filterContamination()` in `contamination-filter.ts` (~line 58)
- [x] T041 In tool-title-with-path severity lookup: return `'low'` when `options.captureSource === 'claude-code-capture'`; return existing `'high'` otherwise
- [x] T042 Read `workflow.ts` lines 1350–1360 to confirm the `filterContamination()` call site
- [x] T043 Thread `captureSource` from `collectedData._source` to the `filterContamination()` call in `workflow.ts` (~line 1356)
- [x] T044 [P] Add unit test: Claude Code source with tool-title-with-path pattern → low severity (`contamination-filter.vitest.ts`)
- [x] T045 [P] Add unit test: Codex source with the same pattern → original high severity (`contamination-filter.vitest.ts`)
- [x] T046 [P] Add unit test: undefined/unknown `captureSource` → falls back to original severity for all patterns (`contamination-filter.vitest.ts`)
- [x] T047 [P] Add score-cap regression test: Claude Code downgrade is not capped at 0.60, non-Claude high severity remains capped (`quality-scorer-calibration.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Retain the broader scripts closure baseline from the parent pack and phase-016 continuation as inherited evidence for the shipped Phase 017 surface
- [x] T051 Retain the broader MCP closure baseline from the parent pack and phase-016 continuation as inherited evidence for the shipped Phase 017 surface
- [x] T052 Re-read the affected TypeScript seams and confirm the implementation still matches the intended contract
- [x] T053 Rerun the targeted scripts lane that exercises the affected Phase 017 seams
- [x] T054 Confirm the `workflow-e2e.vitest.ts` failed-embedding regression now exercises the mocked `indexMemory()` failure path
- [x] T055 Confirm `generate-context-cli-authority.vitest.ts` still covers `--stdin` / `--json` target-authority behavior
- [x] T056 Confirm `quality-scorer-calibration.vitest.ts` and `contamination-filter.vitest.ts` still cover the Claude-only downgrade and non-Claude cap
- [x] T057 Confirm `workflow-e2e.vitest.ts` still hard-blocks foreign-spec contamination in stateless mode
- [x] T058 Confirm `workflow-e2e.vitest.ts` still allows V10-only stateless saves to continue with a warning
- [x] T059 Confirm `quality-scorer-calibration.vitest.ts` still preserves the capped non-Claude path
- [x] T060 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` on this phase folder and confirm zero validation errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 pre-conditions confirmed
- [x] All Phase 2 implementation tasks marked `[x]`
- [x] All Phase 3 verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] SC-001 through SC-006 verified with targeted or inherited evidence
- [x] `checklist.md` P0 items all marked with evidence tags
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../016-multi-cli-parity/tasks.md`
<!-- /ANCHOR:cross-refs -->
