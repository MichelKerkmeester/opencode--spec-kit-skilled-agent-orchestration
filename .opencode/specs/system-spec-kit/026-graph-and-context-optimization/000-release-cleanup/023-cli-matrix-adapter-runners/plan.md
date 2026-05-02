---
title: "Implementation Plan: CLI Matrix Adapter Runners"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Plan and verification record for implementing CLI adapter runners and a manifest-driven meta-runner for the external CLI matrix."
trigger_phrases:
  - "023-cli-matrix-adapter-runners"
  - "CLI matrix adapter"
  - "matrix runner adapters"
  - "cli-codex adapter"
  - "cli-copilot adapter"
  - "cli-gemini adapter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners"
    last_updated_at: "2026-04-29T17:16:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Plan executed"
    next_safe_action: "Run targeted smoke"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: CLI Matrix Adapter Runners

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, JSON, Markdown, Vitest |
| **Framework** | MCP server package under `.opencode/skill/system-spec-kit/mcp_server` |
| **Storage** | Manifest JSON, per-cell JSONL output, `summary.tsv` |
| **Testing** | Targeted mocked Vitest tests only |

### Overview

Packet 030 recommended feature-owned runners plus a meta-aggregator rather than forcing every feature into one harness (`030-v1-0-4-full-matrix-stress-test-design/plan.md:52`, `:54`, `:89`, `:95`, `:99`). Packet 035 then found the adapter layer absent and recorded 42 `RUNNER_MISSING` cells (`022-full-matrix-execution-validation/findings.md:11`, `:15`, `:73`, `:75`). This packet implements the missing external CLI adapter layer and leaves real matrix execution to a later verification pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet 036 target folder was supplied by the user.
- [x] Packet 030 design source read for F1-F14 and executor expectations.
- [x] Packet 035 findings read for `RUNNER_MISSING` evidence and `NA` F11 Gemini precedent.
- [x] CLI skill docs and existing deep-loop dispatch tests read for invocation shapes.
- [x] Existing MCP server build and Vitest configuration read.

### Definition of Done

- [x] Five adapters exist and compile.
- [x] Manifest enumerates 70 external CLI cells.
- [x] Meta-runner writes JSONL and `summary.tsv` outputs.
- [x] One smoke test file exists per adapter.
- [x] `npm run build` exits 0.
- [x] `npx vitest run matrix-adapter` exits 0 with 5 files and 10 tests passed.
- [x] Strict validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manifest-driven adapters with shared process/result normalization.

### Key Components

| Component | Purpose |
|-----------|---------|
| `adapter-common.ts` | Owns the adapter contract, timeout, spawn, stdout/stderr capture, expected-signal matching, and result normalization |
| `adapter-cli-codex.ts` | Sends the prompt over stdin to `codex exec ... -` |
| `adapter-cli-copilot.ts` | Sends the prompt as the `-p` argument to `copilot` |
| `adapter-cli-gemini.ts` | Sends the prompt as the positional `gemini` argument |
| `adapter-cli-claude-code.ts` | Sends the prompt through `claude -p` with `acceptEdits` |
| `adapter-cli-opencode.ts` | Sends the prompt through `opencode run` with model, agent, variant, format, and `--dir` |
| `matrix-manifest.json` | Freezes F1-F14 x five external CLI cells |
| `run-matrix.ts` | Loads the manifest, filters cells, routes adapters, writes results, and prints aggregates |

### Data Flow

`matrix-manifest.json` -> template resolution -> CLI adapter -> `AdapterResult` -> `<output>/<feature>-<executor>.jsonl` -> `summary.tsv` -> stdout aggregate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery

- Read packet 030 spec and plan. Confirmed F1-F14, five external CLI executors, native/inline outside this packet, and first-class non-applicable cells (`030-v1-0-4-full-matrix-stress-test-design/spec.md:48`, `:96`, `:97`; `022-full-matrix-execution-validation/findings.md:35`, `:153`).
- Read packet 035 findings and per-cell evidence. Confirmed 42 runner-missing cells and the ticket mapping to 036 (`022-full-matrix-execution-validation/findings.md:15`, `:199`, `:203`).

### Phase 2: Adapter Implementation

- Implemented shared adapter normalization in `adapter-common.ts`.
- Implemented five thin CLI adapters with environment-overridable defaults.
- Preserved stdout/stderr/exitCode in every result.

### Phase 3: Manifest and Meta-Runner

- Created `matrix-manifest.json` with 70 cells, 14 features, 5 executors, and `F11-cli-gemini` as `applicable:false`.
- Created `run-matrix.ts` with concurrency 3, filter flags, executor flags, JSONL output, `summary.tsv`, and feature/executor pass-rate aggregates.

### Phase 4: Tests and Docs

- Added five `matrix-adapter-*.vitest.ts` files.
- Added `matrix-adapter-test-utils.ts` to mock child processes.
- Added `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md` and updated `.opencode/skill/system-spec-kit/mcp_server/README.md`.

### Phase 5: Verification

- Ran `npm run build`: exit 0.
- Ran `npx vitest run matrix-adapter`: 5 files, 10 tests passed.
- Ran strict validator: exit 0 after packet docs were created.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Production TypeScript and included helper files | `npm run build` |
| Adapter smoke | PASS and timeout behavior per adapter | `npx vitest run matrix-adapter` |
| Manifest sanity | 70 cells, 14 features, 5 executors, F11 Gemini `NA` | `node -e` JSON inspection |
| Spec validation | Required Level 2 docs/metadata | `validate.sh --strict` |

### L2 Verification Addendum

- Adapter tests mock `node:child_process` and assert argv shapes for each CLI.
- Timeout tests use fake timers and never execute binaries.
- The meta-runner itself is not used to run real CLIs in this packet.
- The full vitest suite was not run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 030 design | Spec docs | Available | Defines F1-F14 and Option C architecture |
| Packet 035 findings | Evidence docs | Available | Defines runner-missing gap this packet closes |
| CLI binaries/auth | Runtime environment | Not exercised in tests | Real matrix runs may produce `BLOCKED` |
| Vitest | Dev dependency | Available | Smoke tests pass |
| TypeScript build | Dev dependency | Available | Build passes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build failure, adapter smoke failure, or strict validator failure that cannot be fixed surgically.
- **Procedure**: Remove the new `matrix_runners/` files, remove the `matrix-adapter-*` tests, revert the `.opencode/skill/system-spec-kit/mcp_server/README.md` reference, and preserve packet docs with failure evidence.
- **Data reversal**: No database or runtime state migrations were introduced.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
030 design + 035 findings -> adapter contracts -> manifest -> meta-runner
        -> mocked adapter smoke tests -> docs -> strict validator
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Discovery | Medium | Read design, findings, CLI docs, build/test config |
| Adapter implementation | Medium | Shared common runner plus five thin adapters |
| Manifest/meta-runner | Medium | 70-cell manifest and aggregate writer |
| Tests/docs | Medium | Five smoke tests plus packet docs |
| Verification | Low | Build, targeted Vitest, strict validator |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [x] Do not run real CLIs during tests.
- [x] Keep CLI defaults environment-overridable.
- [x] Keep matrix execution separate from packet 035 findings.

### Rollback Procedure

1. Stop any real `run-matrix.ts` invocation.
2. Preserve output directory if one exists.
3. Revert only packet 036 code/docs changes.
4. Re-run `npm run build` and the strict validator.
<!-- /ANCHOR:enhanced-rollback -->
