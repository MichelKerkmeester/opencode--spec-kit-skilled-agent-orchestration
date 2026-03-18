---
title: "Tasks: OpenCode Codebase Alignment [012-opencode-codebase-alignment/tasks]"
description: "Completion definition for every task: mark [x] only when all listed acceptance criteria are met with verifiable evidence (command output, file mapping, or review note)."
trigger_phrases:
  - "tasks"
  - "opencode"
  - "codebase"
  - "alignment"
  - "031"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: OpenCode Codebase Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending (not started) |
| `[x]` | Completed |
| `[P]` | Parallelizable once dependencies are satisfied |
| `[C]` | Conditional task (execute only if trigger condition is met) |

**Completion definition for every task**: mark `[x]` only when all listed acceptance criteria are met with verifiable evidence (command output, file mapping, or review note).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline Audit

| Status | ID | Task | Dependencies | Acceptance Criteria |
|--------|----|------|--------------|---------------------|
| [x] | T001 | Confirm scope boundaries from `spec.md` and `plan.md` and freeze non-goals for this run | None | Scope note lists in-scope/out-of-scope rules and references REQ-001/REQ-002; no ambiguity remains for touched file classes. Evidence: include/exclude rules finalized for ts/tsx/js/mjs/py/sh/json/jsonc alignment scope. |
| [x] | T002 | Build language inventory manifest for `.opencode/**/*.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`, `.py`, `.sh`, `.json`, `.jsonc` | T001 | Manifest exists and each path is classified as `align-only`, `align+defect-fix`, or `defer`; no out-of-scope paths included. Evidence: in-scope inventory completed with 394 files across ts/tsx/js/mjs/py/sh/json/jsonc. |
| [x] | T003 | Capture baseline verification command set and expected pass criteria per language stream | T001 | Baseline command matrix recorded for TS/JS/PY/SH/JSON/JSONC with stream-local and cross-stream checks mapped. Evidence: baseline commands established with `system-spec-kit` typecheck/test:cli pass criteria and mcp lanes tracked as known failing baselines. |
| [x] | T004 | Define batch manifests and rollback boundaries for WS-1 through WS-6 | T002, T003 | Each batch is capped to tool-safe size, has explicit file list, and has revert-safe boundary aligned to plan rollback rules. Evidence: drift audits completed for TS/JS, PY/SH, JSON/JSONC and priority file lists produced for WS batching/rollback boundaries. |
| [x] | T005 | Run baseline gate (G0) and record pre-edit evidence bundle | T003, T004 | G0 evidence includes inventory snapshot, baseline command outcomes, and timestamped pass/fail ledger; blockers resolved or deferred explicitly. Evidence: snapshot recorded with `system-spec-kit` typecheck/test:cli pass, mcp_server tests fail baseline, and mcp-code-mode build fails baseline. |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Language-Batch Alignment

| Status | ID | Task | Dependencies | Acceptance Criteria |
|--------|----|------|--------------|---------------------|
| [x] | T006 | Execute WS-1 batch series for TypeScript core/infra alignment | T005 | All WS-1 batches apply standards-compliant edits only; each changed file is mapped to REQ-003 and REQ-012; no contract drift observed. Evidence: WS-1 implemented batch manifests completed and verification snapshots recorded per batch gate. |
| [x] | T007 | Execute WS-2 batch series for TypeScript handlers/flow alignment | T006 | Handler/orchestration TS files aligned with minimal semantics-preserving edits; each batch passes its local checks before continuation. Evidence: WS-2 implemented batches completed with local verification snapshots captured before progression. |
| [x] | T008 | Execute WS-3 batch series for JavaScript runtime/script alignment | T006 | JS batches preserve runtime behavior, pass syntax/smoke checks, and map edits to REQ-004 with explicit intent notes. Evidence: WS-3 implemented batches and runtime/smoke verification snapshots logged in the batch ledger. |
| [x] | T009 [P] | Execute WS-4 batch series for Python utilities alignment | T005 | Python batches align naming/docstring/typing/error handling conventions, pass compile/lint/test checks, and map to REQ-005. Evidence: WS-4 implemented batches completed with compile/lint/test verification snapshots. |
| [x] | T010 [P] | Execute WS-5 batch series for Shell script alignment | T005 | Shell batches preserve CLI signature and exit semantics, pass `bash -n` plus scenario checks, and map to REQ-006. Evidence: WS-5 implemented batches completed with `bash -n` and scenario verification snapshots. |
| [x] | T011 [P] | Execute WS-6 batch series for JSON/JSONC config alignment | T005 | Config batches preserve schema/consumer compatibility, pass parse/consumer checks, and map to REQ-007. Evidence: WS-6 implemented batches completed with parse/consumer verification snapshots. |
| [x] | T012 | Apply in-scope defect fixes discovered during WS-1..WS-6 only where required for correctness | T006, T007, T008, T009, T010, T011 | Every defect fix has before/after evidence, is local to touched files, and maps to REQ-008 without unrelated cleanup. Evidence: in-scope batch-local fixes were applied with before/after notes and verification snapshots. |
| [x] | T013 | Enforce batch exit gates (G2) and stream exit gates (G3) after each completed stream | T006, T007, T008, T009, T010, T011, T012 | No stream advances with unresolved failures; each gate result is recorded with command list, outcomes, and timestamps. Evidence: G2/G3 outcomes were captured per implemented stream in the verification snapshots/ledger. |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Status | ID | Task | Dependencies | Acceptance Criteria |
|--------|----|------|--------------|---------------------|
| [x] | T014 | Run cross-stream integration verification for touched automation and runtime paths | T013 | Cross-subsystem checks pass for critical entrypoints and shared contracts where languages interact. Evidence: cross-stream verification snapshots recorded for touched automation/runtime paths. |
| [x] | T015 | Execute behavior-preservation validation on critical execution paths | T014 | Verification notes confirm no intentional behavior changes; any differences are documented as resolved defects only (REQ-001). Evidence: behavior-preservation verification snapshots confirm semantics preserved across critical paths. |
| [x] | T016 | Build consolidated verification ledger by batch, stream, and requirement mapping | T014, T015 | Ledger includes command outputs, pass/fail status, timestamps, changed-file-to-requirement mapping, and deferred items rationale. Evidence: consolidated ledger assembled from implemented WS batch records and verification snapshots. |
| [x] | T017 | Run final release gate (G4) and record completion readiness decision | T016 | G4 passes with all P0 requirements satisfied and no unresolved high-risk regressions. Evidence: final gate checks PASS (`npm run typecheck`, `npm run test:cli`, `npm run test` in mcp_server, `npm run build` in mcp-code-mode/mcp_server). |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Standards Reconciliation (If Needed)

| Status | ID | Task | Dependencies | Acceptance Criteria |
|--------|----|------|--------------|---------------------|
| [x] | T018 [C] | Detect and log standards-vs-runtime mismatches requiring WS-7 | T013 | Mismatch log includes concrete code evidence and why current guidance cannot be applied safely. Evidence: N/A - not triggered; no proven fundamental standards-vs-runtime mismatch requiring WS-7 updates. |
| [x] | T019 [C] | Review mismatch evidence and decide reconcile path (`docs update` or `documented exception`) | T018 | Decision note exists per mismatch with rationale, impact, and approved safe path. Evidence: N/A - not triggered; no proven fundamental standards-vs-runtime mismatch requiring WS-7 updates. |
| [x] | T020 [C] | Apply approved WS-7 updates to `.opencode/skill/sk-code--opencode/**/*` | T019 | Updated standards text matches validated runtime constraints and remains consistent across related guidance. Evidence: N/A - not triggered; no proven fundamental standards-vs-runtime mismatch requiring WS-7 updates. |
| [x] | T021 [C] | Re-verify affected streams after WS-7 updates | T020 | Impacted checks re-run successfully; reconciliation does not introduce behavior or policy conflicts. Evidence: N/A - not triggered; no proven fundamental standards-vs-runtime mismatch requiring WS-7 updates. |
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Completion Artifacts

| Status | ID | Task | Dependencies | Acceptance Criteria |
|--------|----|------|--------------|---------------------|
| [x] | T022 | Update `checklist.md` with evidence-backed `[x]` status for completed P0/P1/P2 items | T017, T021 | Checklist entries include concrete evidence references (commands, artifacts, or review notes); no unchecked P0 remains. Evidence: checklist updated with evidence-backed statuses. |
| [x] | T023 | Generate `implementation-summary.md` with final change narrative and verification evidence | T022 | Summary documents scope executed, batch outcomes, defect fixes, behavior-preservation statement, and known deferrals. Evidence: implementation-summary.md created. |
| [x] | T024 | Produce release-ready completion packet for maintainer review | T023 | Packet contains verification ledger, checklist status, implementation summary, rollback notes, and approval checkpoint status. Evidence: completion packet assembled (`tasks.md`, `checklist.md`, `implementation-summary.md`) and memory context saved. |
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:execution-sequencing -->
## Autonomous Sequencing and Behavior-Safe Rollout Rules

1. Do not start any Phase 2 task before T005 baseline gate evidence is complete.
2. Do not run downstream batches when a current batch has unresolved gate failures.
3. Parallel execution is allowed only for tasks marked `[P]` or independent streams with non-overlapping manifests.
4. Every batch must be independently revertible before the next batch starts.
5. If behavior uncertainty appears at any point, pause stream progression, reduce batch size, and re-verify.
6. Completion claim is blocked until T017 plus Phase 5 artifact tasks are complete.
<!-- /ANCHOR:execution-sequencing -->

---

<!-- ANCHOR:parallelization -->
## Parallelization Map

- After T005, `T009 [P]`, `T010 [P]`, and `T011 [P]` may run in parallel when manifests do not overlap.
- `T008` may overlap with `T007` only where file sets and runtime contracts do not intersect.
- `T018` can begin after `T013` if mismatches are detected, but `T020` cannot start before `T019`.
<!-- /ANCHOR:parallelization -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `T001` through `T024` are marked `[x]`, or `[C]` tasks are explicitly marked not-triggered with evidence.
- [x] All P0 requirements in `spec.md` are satisfied with verifiable evidence.
- [x] Final gate G4 is passed and recorded.
- [x] `checklist.md` and `implementation-summary.md` are updated and consistent with the verification ledger.
- [x] Completion packet is assembled for maintainer review, including rollback notes and saved memory context.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
