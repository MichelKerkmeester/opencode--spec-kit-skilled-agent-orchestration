---
title: "Feature Specification: Stateless Quality Gate Fixes"
description: "Stateless mode memory saves from Claude Code sessions are consistently blocked by quality gates designed for curated JSON payloads. Gate A applies file-mode strictness to raw transcript captures, producing false-positive blocks on V10 (file-count divergence) and contamination (tool-title-with-path pattern)."
trigger_phrases:
  - "stateless quality gates"
  - "gate a tiering"
  - "v10 file count divergence"
  - "contamination cap stateless"
  - "stdin flag generate-context"
  - "stateless mode save blocked"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Stateless Quality Gate Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Stateless mode (`node generate-context.js "014-stateless-quality-gates"`) is blocked by quality gates designed for curated JSON payloads. Two root causes produce systematic false-positive aborts: V10 always fires because it compares inherently different file-count measurements, and the tool-title-with-path contamination pattern caps scores at 0.60 for content that is factually correct in Claude Code sessions. This spec fixes the gate architecture across three targeted changes: tiering Gate A into hard-block vs. soft-warning rules, adding `--stdin` / `--json` support that reuses the file-mode workflow without temp files, and making the contamination filter source-aware.

**Key Decisions**: Tier rules rather than disable Gate A entirely; route `--stdin` / `--json` through preloaded `collectedData` plus explicit spec-folder resolution/validation (not a temp file); downgrade only tool-title-with-path for Claude Code source.

**Critical Dependencies**: Phase 016 fixes (ALIGNMENT_BLOCK, technicalContext, confidence) must be merged first.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-18 |
| **Branch** | `014-stateless-quality-gates` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 17 of 20 |
| **Predecessor** | 013-spec-descriptions |
| **Successor** | 015-runtime-contract-and-indexability |
| **Handoff Criteria** | validate.sh + test suite passing; SC-001 through SC-006 verified |
| **R-Item** | R-17 |

---

### Phase Context

This is **Phase 17** of the Perfect Session Capturing specification.

**Scope Boundary**: Phase 017 shipped the quality-gate and CLI updates in the system-spec-kit scripts workspace so legitimate stateless Claude Code saves no longer depend on the `/tmp/save-context-data.json` workaround.
**Dependencies**: Phase 016 alignment and metadata fixes remain a prerequisite because Phase 017 builds on the explicit-CLI alignment warning path, technical-context propagation, and string-form decision confidence extraction.
**Deliverables**: Tiered Gate A, `--stdin` / `--json` CLI flags, source-aware contamination filtering, and targeted regression coverage for the affected workflow lanes.
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase shipped, `node generate-context.js "014-stateless-quality-gates"` entered stateless mode and still applied file-mode assumptions to raw CLI captures. Three compounding issues produced false-positive aborts:

1. **V10 quality gate (file-count divergence)** — `capturedFileCount` measures files from the transcript; `filesystemFileCount` measures files from git/spec enrichment. These are inherently different measurements (e.g., 3 captured vs. 15 from git), so V10 always triggers for typical sessions.

2. **Contamination cap at 0.60** — The tool-title-with-path pattern (`/\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+(?:tool\s+)?(?:on\s+)?[\/\.][^\s]+/gi`) matches Claude Code's legitimate tool references in assistant response text, triggering a high-severity cap. In Claude Code sessions, these references are factual documentation of what the AI did, not orchestration chatter.

3. **Gate A monolithic abort** (`workflow.ts:2085`) — `if (collectedData?._source !== 'file' && !qualityValidation.valid)` treats all V1-V11 failures equally. There is no tiering between safety-critical rules (V8, V9) and quality-informational rules (V10). V10 is by design a soft signal, but the architecture gives it hard-block authority in stateless mode.

The operator workaround was writing JSON to `/tmp/save-context-data.json`, which set `_source = 'file'` and bypassed Gate A entirely. That was clunky and defeated the purpose of accepting a spec folder name directly.

### Purpose

This phase fixes the quality gate architecture so stateless saves from Claude Code sessions can succeed when the content is legitimate, while preserving hard blocks for genuine contamination (V1, V3, V8, V9, V11). It also eliminates the `/tmp` workaround by shipping `--stdin` and `--json` CLI flags.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Phase 1: Tiered Gate A** (~15 lines in `workflow.ts:2085`)
- Split V1-V11 into hard-block tier (V1, V3, V8, V9, V11 — safety-critical) and soft-warning tier (V4, V5, V6, V7, V10 — quality-informational).
- Only hard-block rules abort for non-file sources; soft-warning rules log warnings but allow the save.
- Precedent: V8/V9 already have a dedicated hard block at lines 2058–2076.

**Phase 2: `--stdin` / `--json` support** (CLI parsing + workflow handoff in `generate-context.ts`)
- Add `--stdin` flag to read JSON from stdin; add `--json '{"..."}` for inline variant.
- Parse JSON before workflow execution, resolve the target spec folder from explicit CLI override or payload `specFolder`, validate that target, and pass the parsed object as `options.collectedData` to `runWorkflow()`.
- Sets `_source` to `'file'` on parsed data, same as writing a temp file but without the filesystem side-effect.
- Eliminates the `/tmp/save-context-data.json` workaround entirely.

**Phase 3: Source-aware contamination filter** (~10 lines in `contamination-filter.ts`)
- Add an optional `captureSource` option to `filterContamination()` without reinterpreting the current denylist parameter.
- When source is `'claude-code-capture'`, downgrade tool-title-with-path from `high` to `low` severity.
- Other high-severity patterns (AI self-reference, API error leak) remain high for all sources.

### Out of Scope

- Changing V10's divergence calculation thresholds — V10 remains a valid diagnostic signal, just not a hard blocker.
- Modifying the V2 scorer or canonical scorer algorithms.
- Title/slug generation improvements (separate issue).
- Trigger phrase n-gram quality improvements (separate issue).

### Files to Change

| File Path | Change Type | Description | Phase |
|-----------|-------------|-------------|-------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Tier Gate A into hard-block and soft-warning rule sets, preserve explicit-CLI alignment warnings, and thread `captureSource` into contamination filtering | 1, 3 |
| `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | Modify | Export `HARD_BLOCK_RULES` for the stateless Gate A split | 1 |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Add `--stdin` and `--json` parsing, spec-folder resolution/validation, and preloaded `collectedData` handoff | 2 |
| `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` | Modify | Add `captureSource` parameter and downgrade tool-title-with-path only for Claude Code | 3 |
| `.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts` | Modify | Cover stateless soft-warning vs hard-block behavior and the failed-embedding regression harness | 1 |
| `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` | Modify | Cover `--stdin` / `--json` handoff and target-authority rules | 2 |
| `.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts` | Modify | Cover source-aware severity behavior | 3 |
| `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts` | Modify | Cover the uncapped Claude-specific score path | 3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate A must distinguish safety-critical rules from quality-informational rules | V10 failure alone does NOT block stateless saves. V8, V9, V11 failures still block. |
| REQ-002 | `--stdin` and `--json` must accept structured JSON and preserve file-mode workflow semantics | Valid stdin/inline JSON resolves the same target spec folder, runs through `runWorkflow()` with `_source = 'file'`, and does not trigger stateless-only abort behavior |
| REQ-003 | Claude Code captures must not trigger high-severity contamination from tool-title-with-path | Stateless Claude Code save with tool references scores > 0.60 (not capped) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | V8/V9/V11 still hard-block in stateless mode | Test with foreign spec contamination verifies abort |
| REQ-005 | `--stdin` / `--json` validate JSON shape and target spec folder before passing to workflow | Malformed JSON or invalid target spec folder produces a clear error message |
| REQ-006 | Source-aware filter only affects Claude Code captures | Other capture sources (Codex, Copilot, Gemini) retain original severity |
| REQ-007 | Broader closure evidence remains consistent with the shipped Phase 017 behavior | The parent closure baseline remains green, and the Phase 017 targeted regression lane reruns cleanly on 2026-03-18 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a legitimate Claude Code session on spec folder `014-stateless-quality-gates`, **When** `node generate-context.js "014-stateless-quality-gates"` is run, **Then** a memory file is created with no QUALITY_GATE_ABORT.
- **SC-002**: **Given** valid JSON piped to stdin or passed via `--json`, **When** `generate-context.js` runs, **Then** it resolves the same target spec folder as file mode, passes preloaded `collectedData` into `runWorkflow()`, and produces a memory file without temp-file scaffolding.
- **SC-003**: **Given** a Claude Code stateless capture containing tool-title-with-path patterns, **When** the contamination filter evaluates the content, **Then** the score is not capped at 0.60 and the save proceeds.
- **SC-004**: **Given** a stateless capture with foreign spec contamination (V8/V9 trigger), **When** Gate A evaluates the content, **Then** the save is aborted with QUALITY_GATE_ABORT regardless of source type.
- **SC-005**: **Given** a stateless save where only V10 fails, **When** Gate A evaluates, **Then** the save proceeds with a warning and the quality score reflects the V10 diagnostic signal.
- **SC-006**: **Given** a Codex or Copilot stateless capture containing tool-title-with-path patterns, **When** the contamination filter evaluates the content, **Then** original high severity is applied (behavior unchanged from before Phase 017).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 016 fixes (explicit-CLI alignment warning, technicalContext, confidence) | Low | Already implemented and tested; Phase 017 builds on those shipped semantics |
| Risk | Soft-warning tier lets low-quality saves through | Medium | V10 still logged as warning; quality score still reflects the issue; retrieval scoring can deprioritize |
| Risk | `--stdin` / `--json` implementation could drift from file-mode semantics | Medium | Explicitly reuse preloaded `collectedData` + `runWorkflow()`; add CLI authority and score-cap regression tests |
| Risk | Downgrading tool-title-with-path might miss real contamination | Low | Pattern only downgraded for Claude Code source; other patterns (AI self-reference) remain high |
| Risk | Changes touch the quality gate pipeline affecting all save paths | Medium | Each change is independently testable and reversible; add targeted regression tests per phase |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Gate A tiering adds at most one array membership check per validation rule — negligible overhead.

### Security
- **NFR-S01**: V8 and V9 hard-block rules must remain hard-blocks for all source types. The tiering change MUST NOT weaken foreign-spec contamination detection.

### Reliability
- **NFR-R01**: `--stdin` / `--json` must handle broken pipe, empty input, malformed JSON, and invalid spec-folder targets without crashing the process; exit codes must remain consistent with file-mode behavior.

---

## 8. EDGE CASES

### Data Boundaries
- Empty `--stdin` input: process must exit with a clear error message, not a silent QUALITY_GATE_ABORT.
- `--json` with an empty object `{}`: workflow should fail on sufficiency check, not contamination.
- `--stdin` or `--json` with `specFolder` in the payload and no positional target: the payload target must still be validated before `runWorkflow()` executes.

### Error Scenarios
- V10 fires AND V8 fires simultaneously: hard-block wins; save is aborted.
- `captureSource` is undefined or unknown: contamination filter falls back to original severity for all patterns.
- Malformed JSON piped to `--stdin`: parse error surfaced to stderr with non-zero exit code.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 9, LOC: ~70 net changes, Systems: quality gate pipeline + CLI entry path |
| Risk | 15/25 | Pipeline-central changes; regression risk on all save paths |
| Research | 10/20 | Root causes already diagnosed; architecture already understood |
| Multi-Agent | 5/15 | Single workstream, 3 independent sub-phases |
| Coordination | 8/15 | Phase 016 dependency; test suite gate |
| **Total** | **53/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Gate A tiering accidentally soft-warns on a safety-critical rule | High | Low | Explicit hard-block allowlist (V1, V3, V8, V9, V11) with unit test per rule |
| R-002 | `--stdin` / `--json` path diverges from file-mode semantics over time | Medium | Medium | Shared `runWorkflow()` path; explicit CLI authority tests assert target resolution and preloaded-data handoff |
| R-003 | Source-aware filter introduced without severity and score-cap tests | Medium | Low | REQ-006 acceptance criterion + contamination-filter and quality-scorer regression assertions |
| R-004 | Phase 016 not merged when Phase 017 starts | Low | Low | Block Phase 017 implementation until 016 is merged |

---

## 11. USER STORIES

### US-001: Stateless Save Without /tmp Workaround (Priority: P0)

**As a** developer using Claude Code, **I want** `node generate-context.js "014-stateless-quality-gates"` to succeed without writing to `/tmp`, **so that** the explicit spec folder argument works as documented without manual JSON scaffolding.

**Acceptance Criteria**:
1. Given a Claude Code session on a legitimate spec folder, When I run `node generate-context.js "014-stateless-quality-gates"`, Then a memory file is created with quality >= 60 and no QUALITY_GATE_ABORT.

---

### US-002: Piped JSON Input (Priority: P0)

**As a** developer scripting memory saves, **I want** `echo '{"specFolder":"..."}' | node generate-context.js --stdin`, **so that** I can pipe structured data without temp files.

**Acceptance Criteria**:
1. Given valid JSON piped to stdin or passed via `--json`, When I run the command, Then the target spec folder is resolved and validated the same way as file-mode input before `runWorkflow()` executes.
2. Given malformed JSON piped to stdin, When I run with `--stdin`, Then the process exits non-zero with a descriptive error message.

---

### US-003: Tool References Not Flagged as Contamination (Priority: P0)

**As a** developer using Claude Code, **I want** tool call references in my session text (e.g., "Read tool on /path/to/file") to not cap contamination at 0.60, **so that** accurate session summaries are not penalized for documenting what the AI did.

**Acceptance Criteria**:
1. Given a Claude Code stateless capture containing `Read tool on /src/file.ts`, When the contamination filter runs, Then the score is not capped at 0.60 and the save proceeds.
2. Given a Codex capture containing the same pattern, When the contamination filter runs, Then original severity is applied (unchanged behavior).

---

### US-004: Safety Rules Still Block (Priority: P0)

**As a** system maintainer, **I want** V8 and V9 (foreign spec contamination) to still hard-block stateless saves, **so that** the tiering change does not weaken actual safety guarantees.

**Acceptance Criteria**:
1. Given a stateless capture containing foreign spec folder references (V8/V9 trigger), When Gate A evaluates, Then the save is aborted with QUALITY_GATE_ABORT regardless of source type.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

No open questions. Root causes are fully diagnosed, the architectural approach is decided, and all three phases are independently implementable. See `decision-record.md` for formal ADR records.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
