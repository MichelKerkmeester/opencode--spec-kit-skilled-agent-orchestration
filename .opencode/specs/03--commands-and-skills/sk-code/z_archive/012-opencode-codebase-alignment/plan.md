---
title: "Implementation Plan: OpenCode Codebase Alignment [012-opencode-codebase-alignment/plan]"
description: "This phase maps to existing planning and baseline material in ## 1. SUMMARY, ## 2. TECHNICAL STRATEGY AND EXECUTION ARCHITECTURE, ## 3. MULTI-WORKSTREAM EXECUTION WITH SEQUENCIN..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "opencode"
  - "codebase"
  - "alignment"
  - "031"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: OpenCode Codebase Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## Phase 1: Planning and Baseline

This phase maps to existing planning and baseline material in `## 1. SUMMARY`, `## 2. TECHNICAL STRATEGY AND EXECUTION ARCHITECTURE`, `## 3. MULTI-WORKSTREAM EXECUTION WITH SEQUENCING`, and `## 4. TOOL-CALL-SAFE BATCHING STRATEGY`, with baseline lock at milestone `M1` in `## 8. MILESTONES AND EXECUTION ORDER`.

## Phase 2: Implementation and Verification

This phase maps to implementation controls and verification closure in `## 5. VALIDATION GATES AND ROLLBACK PLAN`, `## 6. COMMAND AND TEST STRATEGY BY LANGUAGE AND SUBSYSTEM`, `## 7. RISK CONTROLS FOR "DO NOT BREAK SCRIPTS"`, `## 9. EVIDENCE AND TRACEABILITY MODEL`, and `## 10. COMPLETION CRITERIA`, with milestones `M2` through `M6` in `## 8. MILESTONES AND EXECUTION ORDER`.

<!-- ANCHOR:summary -->
## 1. SUMMARY

This plan executes full alignment of OpenCode TypeScript, JavaScript, Python, Shell, JSON, and JSONC files to `.opencode/skill/sk-code--opencode` with behavior preservation as the non-negotiable constraint. The delivery model is `audit -> batch implementation -> verification`, with strict batch boundaries, deterministic command execution, and rollback-safe merge units.

### Delivery Outcomes
- Standards-aligned touched files across all target languages and config formats.
- No intentional runtime behavior changes; all deviations are treated as defects.
- Explicit evidence per batch: what changed, why it changed, and how behavior was preserved.
- Risk-controlled execution for script-heavy subsystems where breakage is costly.

### Technical Context
- **Primary runtimes/toolchains:** Node.js/npm (`.ts/.tsx`, `.js/.mjs/.cjs`, `.json/.jsonc`), Python 3 (`.py`), POSIX shell/bash (`.sh`), and repo-native CLI/tooling wrappers.
- **Core subsystems touched:** handlers/orchestration, search/storage/cognitive modules, automation and MCP runtime utilities, validator/advisor tooling, install/spec/provider scripts, and workspace/skill configuration surfaces.
- **Validation command matrix references:** language and subsystem command requirements are defined in `## 6. COMMAND AND TEST STRATEGY BY LANGUAGE AND SUBSYSTEM` (sections `6.1` through `6.6`), with gate enforcement in `## 5. VALIDATION GATES AND ROLLBACK PLAN`.
- **Compatibility constraints:** preserve existing CLI signatures, config schemas, parser/consumer contracts, exit-code semantics, and cross-language artifact interfaces; prefer repository-native commands over ad hoc variants to avoid behavior drift.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:technical-strategy -->
## 2. TECHNICAL STRATEGY AND EXECUTION ARCHITECTURE

### 2.1 Three-Stage Architecture

1. **Stage A - Audit and Baseline Mapping**
   - Build language-specific inventories and classify each file as `align-only`, `align+defect-fix`, `defer`.
   - Map each candidate change to one or more requirement IDs from `spec.md`.
   - Capture current verification baselines before edits.

2. **Stage B - Batch Implementation**
   - Apply small, language-scoped or subsystem-scoped batches.
   - Enforce single-intent batches: one batch should represent one dominant reason (alignment pattern family or one bounded defect class).
   - Keep each batch independently reviewable and independently revertible.

3. **Stage C - Verification and Evidence Closure**
   - Run per-language checks immediately after each batch.
   - Run cross-subsystem checks at stream boundaries.
   - Produce a final aggregated verification ledger before completion claim.

### 2.2 Operating Constraints
- Behavior preservation has priority over strict style conformance if a rule introduces uncertainty.
- KISS-first: local edits over abstraction, direct fixes over framework additions.
- No opportunistic refactors, no dependency upgrades, no architecture drift.
- If standards guidance conflicts with validated runtime constraints, open a standards reconciliation item and continue with safe behavior.

### 2.3 Batch Unit Contract

Every batch must include:
- File manifest (paths only, explicit scope).
- Standards clauses being enforced.
- Verification commands and expected pass criteria.
- Rollback recipe using non-destructive git operations.
- Evidence note linking changed files to requirement IDs.

<!-- /ANCHOR:technical-strategy -->

---

<!-- ANCHOR:workstreams -->
## 3. MULTI-WORKSTREAM EXECUTION WITH SEQUENCING

### 3.1 Workstreams

| Workstream | Scope | Primary Goal | Entry Condition | Exit Condition |
|---|---|---|---|---|
| WS-0 Baseline | All target paths | Inventory + baselines + risk tagging | `spec.md` accepted | Baselines captured and approved for execution |
| WS-1 TS Core/Infra | Foundational `.ts/.tsx` modules | Align foundational patterns with zero contract drift | WS-0 complete | Type checks + impacted tests pass |
| WS-2 TS Handlers/Flow | Handler and orchestration TS files | Align control-flow and error patterns | WS-1 stable | Handler-path checks pass |
| WS-3 JavaScript Runtime | `.js/.mjs/.cjs` runtime and scripts | Align JS style and runtime safety patterns | WS-1 stable (can overlap WS-2 where independent) | Syntax + execution checks pass |
| WS-4 Python Utilities | `.py` scripts and validators | Align typing/docstring/error conventions | WS-0 complete | Compile/lint/test checks pass |
| WS-5 Shell Scripts | `.sh` automation/install/validation | Align strict-mode/quoting/exit-code behavior | WS-0 complete | Shell syntax + scenario tests pass |
| WS-6 Config Surface | `.json/.jsonc` | Align key/style/structure without schema drift | WS-0 complete | Parse/schema/consumer checks pass |
| WS-7 Standards Reconciliation | `.opencode/skill/sk-code--opencode/**/*` (if required) | Resolve proven standards-vs-runtime mismatches | Triggered by evidence from WS-1..WS-6 | Reconciled guidance with explicit rationale |

### 3.2 Dependency and Sequence Rules
- Hard order: `WS-0 -> WS-1 -> WS-2` for TS dependency safety.
- Parallel-safe after WS-0: `WS-4`, `WS-5`, `WS-6` can run in parallel if manifests do not overlap.
- JS ordering: `WS-3` starts after WS-1 baseline stability; overlap with WS-2 allowed only for no-shared-file zones.
- WS-7 is conditional and only executes after mismatch evidence is validated.

### 3.3 Merge Unit Sequencing
1. Complete one batch in one workstream.
2. Verify and lock evidence.
3. Open next batch in same stream or release dependency for downstream stream.
4. Never mix unresolved failures from one stream into another stream's batch.

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:tool-safe-batching -->
## 4. TOOL-CALL-SAFE BATCHING STRATEGY

### 4.1 Why This Is Required
Large, mixed-language batches increase aborted runs and make root-cause isolation expensive. Tool-call-safe batching enforces bounded command scope and deterministic re-runs.

### 4.2 Batch Limits
- Target size: `10-25 files` or `<= 800 net LOC` per batch, whichever is reached first.
- Script-critical batch size: `<= 10 files` for high-risk shell/install/automation paths.
- One language family per batch unless a cross-language contract check is explicitly required.

### 4.3 Execution Pattern Per Batch
1. Preflight commands (no edits): inventory subset + baseline checks.
2. Apply edits only to listed manifest files.
3. Run language-local checks first.
4. Run subsystem smoke checks second.
5. If any failure: stop batch, diagnose, and resolve or rollback before continuing.

### 4.4 Abort Prevention Controls
- Prefer path-scoped commands over whole-repo runs during batch validation.
- Keep command chains sequential and explicit for dependent steps.
- Record exact command set and exit status to support deterministic retries.
- Avoid mixing formatting, refactor, and defect repair in one execution pass.

### 4.5 Autonomous Run Protocol

#### Pre-Task Checklist
- Confirm batch manifest, requirement mapping, and baseline evidence are present.
- Confirm commands are scoped to the active batch and rollback remains isolated.

#### Execution Rules
- Execute in strict order: preflight -> edits -> local checks -> smoke checks -> evidence update.
- Stop on first failing gate; do not continue into downstream workstreams.

#### Status Reporting
- Report each batch as `pending`, `in-progress`, `passed`, or `failed` with command evidence.
- Include stream ID, batch ID, and current gate state in each update.

#### Blocked Task (BLOCKED)
- Mark as `BLOCKED` when a gate fails, dependencies are unresolved, or rollback is in progress.
- Resume only after a verified fix or completed rollback at the same batch boundary.

<!-- /ANCHOR:tool-safe-batching -->

---

<!-- ANCHOR:gates-and-rollback -->
## 5. VALIDATION GATES AND ROLLBACK PLAN

### 5.1 Validation Gates

| Gate | Trigger | Required Evidence | Block Condition |
|---|---|---|---|
| G0 Baseline Gate | Before first edit | Inventory snapshot + baseline command pass list | Missing baseline evidence |
| G1 Batch Entry Gate | Before each batch | Manifest + intent mapping to requirements | Scope mismatch |
| G2 Batch Exit Gate | After each batch | Language-local checks + subsystem smoke checks | Any failing check |
| G3 Stream Exit Gate | After stream completion | Stream-wide regression checks | Unresolved regressions |
| G4 Final Release Gate | Before completion claim | Cross-stream verification ledger | Any P0 requirement unmet |

### 5.2 Rollback Principles
- Use non-destructive rollback by reverting isolated batch commits.
- Keep rollback scope equal to the failing batch boundary.
- Do not proceed with downstream batches until rollback or fix is verified.

### 5.3 Rollback Procedure
1. Detect failure at G2/G3/G4.
2. Freeze new edits in affected stream.
3. Revert failing batch commit(s) only.
4. Re-run baseline and failing verification subset.
5. Re-plan the batch with smaller scope if root cause is unclear.

### 5.4 Recovery Mode for Unclear Failures
- Split batch into smaller slices (`<= 5 files` for scripts, `<= 10` for others).
- Re-run checks after each slice.
- If uncertainty remains, defer high-risk files and proceed with low-risk alignment.

<!-- /ANCHOR:gates-and-rollback -->

---

<!-- ANCHOR:command-strategy -->
## 6. COMMAND AND TEST STRATEGY BY LANGUAGE AND SUBSYSTEM

The exact command variants should use repository-native scripts when available; fallback commands below define minimum required checks.

### 6.1 TypeScript (`.ts/.tsx`)
- Static check: `npx tsc --noEmit`
- Unit/integration tests (impacted scope): `npm test -- <path-or-pattern>`
- Stream-level validation: full TypeScript test/lint/build command set used by repo standards
- Subsystems: handlers, search, storage, cognitive, formatters, parsing

### 6.2 JavaScript (`.js/.mjs/.cjs`)
- Syntax check: `node --check <file>`
- Runtime smoke check for edited scripts: `node <script> --help` or repo-specific dry-run mode
- Tests where present: `npm test -- <path-or-pattern>`
- Subsystems: automation scripts, MCP runtime JS utilities, pattern/reference libraries

### 6.3 Python (`.py`)
- Compile check: `python3 -m py_compile <file>`
- Lint/style (if configured): `python3 -m ruff check <path>`
- Tests where present: `pytest <path-or-pattern>`
- Subsystems: validators, advisor scripts, extraction/documentation tooling

### 6.4 Shell (`.sh`)
- Syntax check: `bash -n <file>`
- Lint/style (if configured): `shellcheck <file>`
- Behavior check: script-specific dry-run/test-mode invocations with expected exit codes and output shape
- Subsystems: install scripts, spec scripts, provider activation/status, helper libraries

### 6.5 JSON and JSONC (`.json/.jsonc`)
- Parse check JSON: `node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"`
- Parse check JSONC (with parser used by project tooling): run consumer/parser script used in repo
- Consumer validation: execute impacted command that reads the config to verify no schema/contract drift
- Subsystems: MCP configs, skill configs, template rules, workspace configs

### 6.6 Cross-Subsystem Verification
- Script entrypoint smoke tests for critical automation flows.
- MCP/tool invocation checks for changed handler paths.
- Contract checks where one language consumes artifacts from another.

<!-- /ANCHOR:command-strategy -->

---

<!-- ANCHOR:risk-controls -->
## 7. RISK CONTROLS FOR "DO NOT BREAK SCRIPTS"

### 7.1 Script Safety Rules
- Treat scripts as production-critical interfaces.
- Preserve CLI signatures, option parsing, output contracts, and exit code semantics.
- Prefer additive/internal safety fixes over restructuring script control flow.

### 7.2 High-Risk Change Types Requiring Extra Checks
- Quoting changes in shell commands.
- Strict mode additions/alterations (`set -euo pipefail`) when scripts previously tolerated missing vars.
- Path handling changes (relative/absolute resolution).
- Error handling rewrites that alter non-zero exit propagation.

### 7.3 Script Verification Bundle (Mandatory Per Script Batch)
- `bash -n` for all touched shell scripts.
- Script-specific execution scenarios: success path, expected-failure path, invalid-input path.
- Output compatibility check for downstream consumers (human or machine parsers).
- Before/after comparison for key invocation outputs where stable output is required.

### 7.4 Guardrails for Shared Utilities
- If shared helper script is touched, run all known dependent scripts in smoke mode.
- Keep helper updates in separate batch from endpoint script alignment where possible.
- If helper impact radius is uncertain, defer helper changes and proceed with leaf script alignment.

<!-- /ANCHOR:risk-controls -->

---

<!-- ANCHOR:milestones -->
## 8. MILESTONES AND EXECUTION ORDER

1. **M1 Baseline Locked**: WS-0 complete with approved inventories and baselines.
2. **M2 TS Foundation Stable**: WS-1 complete and green.
3. **M3 TS Flow Stable**: WS-2 complete and green.
4. **M4 Parallel Streams Stable**: WS-3/WS-4/WS-5/WS-6 complete with no unresolved blockers.
5. **M5 Standards Reconciled**: WS-7 complete if triggered by evidence.
6. **M6 Final Verification Passed**: G4 passed with full ledger and behavior-preservation statement.

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:evidence-model -->
## 9. EVIDENCE AND TRACEABILITY MODEL

Each batch records:
- Batch ID and workstream ID.
- File manifest.
- Requirement mapping (`REQ-001` to `REQ-012` as applicable).
- Command list with outcomes and timestamps.
- Defect evidence for any in-scope bug fix (repro before, proof after).
- Behavior-preservation note for changed execution paths.

Release evidence includes:
- Consolidated verification ledger by language and subsystem.
- List of deferred items with rationale and explicit non-impact statement.
- Final assertion that no intentional behavior changes were introduced.

<!-- /ANCHOR:evidence-model -->

---

<!-- ANCHOR:done-criteria -->
## 10. COMPLETION CRITERIA

This plan is complete when all conditions are true:
- All P0 requirements in `spec.md` are satisfied with evidence.
- Every completed batch passed G2 and each stream passed G3.
- Final gate G4 passed with cross-stream verification ledger.
- No unresolved high-risk script regressions remain.
- Any standards reconciliation updates are evidence-backed and internally consistent.

<!-- /ANCHOR:done-criteria -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Skill Standard Source**: `.opencode/skill/sk-code--opencode/SKILL.md`
