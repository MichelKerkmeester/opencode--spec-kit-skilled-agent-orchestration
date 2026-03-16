# Tasks: Multi-CLI Parity Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = Complete | `[ ]` = Pending | `[~]` = In Progress | `[-]` = Skipped
- `[P]` = Parallel-safe
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Tool Name Aliases

- [x] TASK-001: Add `TOOL_NAME_ALIASES` constant to `phase-classifier.ts`
- [x] TASK-002: Apply alias normalization in `buildExchangeSignals()` before vector/toolNames population
- [x] TASK-003: Verify `scoreCluster()` receives normalized tool names via downstream flow
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: CLI-Agnostic Noise Patterns

- [x] TASK-004: Add generic XML wrapper tag pattern to `NOISE_PATTERNS` in `content-filter.ts`
- [x] TASK-005: Add Copilot lifecycle noise patterns (`tool.execution_start`, `tool.execution_complete`)
- [x] TASK-006: Add Codex reasoning block marker patterns
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: CLI File Provenance & View Tool Title

- [x] TASK-007: Set `_provenance: 'tool'` on FILES built from CLI tool calls in `transformOpencodeCapture()`
- [x] TASK-008: Add `case 'view':` alongside `case 'read':` in `buildToolObservationTitle()`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] TASK-009: Run `tsc --noEmit` — zero errors
- [x] TASK-010: Run `npm run build` — passes
- [x] TASK-011: Run relevant Vitest test suites — all pass
- [x] TASK-012: Fill `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
<!-- /ANCHOR:cross-refs -->
