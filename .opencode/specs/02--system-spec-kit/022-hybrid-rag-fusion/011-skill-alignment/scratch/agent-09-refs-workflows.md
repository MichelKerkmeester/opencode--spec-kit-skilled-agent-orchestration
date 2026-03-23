# Gap Analysis: system-spec-kit References — Workflows & Debugging
## Against 022-hybrid-rag-fusion Epic Deliverables

**Analyst:** agent-09 (leaf, depth 1)
**Date:** 2026-03-14
**Source files analyzed:**
- `references/workflows/quick_reference.md`
- `references/workflows/worked_examples.md`
- `references/workflows/execution_methods.md`
- `references/workflows/rollback_runbook.md`
- `references/debugging/troubleshooting.md`
- `references/debugging/universal_debugging_methodology.md`

**Epic context:** 022-hybrid-rag-fusion — 16 phases, 51 spec folders, 8 RAG sprints with sprint-gate validation, multi-agent campaigns (5-wave parallel, up to 16 concurrent agents), feature-flag governed rollouts, recursive phase validation, 21-child code audit campaigns, Hydra 6-phase DB architecture, multi-CLI orchestration (Codex, Copilot, Gemini, Claude Code).

---

## Per-File Gap Analysis

### quick_reference.md

- **Gap 1:** Phase workflow section (§16) describes phase creation and validation commands at a command-list level only. No entry covers sprint-gate validation: the pattern of defining metric-threshold exit gates per sprint before the next sprint begins. Absent entirely. (P0)
- **Gap 2:** Phase quick reference scores complexity but gives no guidance for epic-scale programs (16+ phases, 50+ children). The scoring table tops out at "4 phases" for score 45+; a 16-phase program scores well above that ceiling with no guidance. (P1)
- **Gap 3:** No shortcut entries for multi-agent campaign setup or teardown. The Quick Reference lists spec folder commands and memory commands but nothing about launching or coordinating parallel agent waves. (P1)
- **Gap 4:** The troubleshooting section (§11) addresses only spec folder lifecycle issues ("forgot to create spec folder", "which level to choose"). No entry covers recursive phase validation failures, e.g., a child failing validate.sh while the parent is being validated with `--recursive`. (P1)
- **Gap 5:** No entry for stale MCP metadata — the case where `memory_match_triggers()` surfaces outdated phase context from a completed sprint. Particularly relevant after sprint transitions. (P2)
- **Gap 6:** Feature-flag governance is absent from all quick reference tables. The epic used <=8 concurrent feature flags with an explicit ceiling; the reference has no shortcut or decision table for flag lifecycle management. (P1)

---

### worked_examples.md

- **Gap 1:** All four worked examples are single-folder, single-session scenarios (bug fix, notification system, GraphQL migration, resume). There is no example for an epic-scale program: a parent spec with 10+ children executed in phases over multiple weeks. This is the dominant pattern in 022. (P0)
- **Gap 2:** No worked example for parent-child spec hierarchies. The phase workflow shortcuts (in quick_reference.md) describe the folder pattern but worked_examples.md never demonstrates the full lifecycle: creating a parent, spawning children, running recursive validation, aggregating results into a parent implementation-summary. (P0)
- **Gap 3:** No worked example for sprint-gate validation. The concept — define exit gates with metric thresholds, validate before unlocking the next sprint — is core to 005 (core RAG sprints) but has no example in the worked examples library. (P0)
- **Gap 4:** No worked example for multi-agent campaign execution. The 022 epic ran 5-wave parallel campaigns with 16 concurrent agents; the worked examples reference never shows how to structure, dispatch, and verify a multi-agent wave. (P1)
- **Gap 5:** No worked example for multi-CLI orchestration: mixing Codex, Copilot, Gemini, and Claude Code agents on different tasks within a single campaign. This is a real pattern that occurred in the 022 epic (root synthesis used 13 delegated agents across two CLI providers). (P1)
- **Gap 6:** No worked example for recursive validation: running `validate.sh --recursive` on a parent with many children, interpreting mixed pass/fail results, and deciding how to handle partial failures (e.g., one child in Draft, one with 2 errors). (P1)
- **Gap 7:** No worked example for feature-flag-gated delivery: shipping features behind flags, verifying flag behavior, and staging rollout with smoke tests between flag enables. (P1)
- **Gap 8:** The example overview table (§1) caps at Level 3 and "Resuming Work". No row for Level 3+ (enterprise/governance heavy), which is the level used throughout the 022 epic. (P2)

---

### execution_methods.md

- **Gap 1:** `validate.sh` documentation (§2) covers basic and quiet/JSON modes only. No documentation for `--recursive` flag used in 022: validating a parent and all child phase folders in a single pass. The flag is referenced in quick_reference.md but not documented in execution_methods.md. (P0)
- **Gap 2:** `create.sh` documentation (§5) lists `--phase` as a flag concept but only shows `--subfolder`. No documented flag or workflow for creating multiple phase children in batch (e.g., creating 21 children for the code audit campaign 012). (P1)
- **Gap 3:** No execution method documented for wave-based parallel agent dispatch. The 5-wave execution model (Wave 1: P0 blockers, Wave 2: P1 fixes, Wave 3: standards, etc.) used in 022 remediation campaigns has no corresponding execution method entry. (P0)
- **Gap 4:** No execution method for multi-model agent mixing: assigning different models (GPT-5.4, gpt-5.3-codex, Sonnet) to different task categories within the same campaign based on task type (P0 fixes vs. standards vs. documentation). (P1)
- **Gap 5:** No execution method for sprint-gate evaluation: how to run the R13 evaluation suite, interpret precision/recall/MRR gates, and produce the go/no-go decision for the next sprint. (P0)
- **Gap 6:** Memory workflow (§8) documents the 12-step generate-context.js workflow but has no coverage for saving context in epic-scale scenarios: choosing which of 51 spec folders to save to, handling multi-phase context, or using the explicit CLI target override pattern (`/tmp/save-context-data.json + phase-folder`). (P1)
- **Gap 7:** No execution method for `recommend-level.sh` (§6) with `--phase` flag or for Level 3+ scenarios. The existing flag table stops at `--architectural` (forces Level 3), with no flag for multi-phase/epic classification. (P2)

---

### rollback_runbook.md

- **Gap 1:** The entire runbook is scoped to a single spec (`136-mcp-working-memory-hybrid-rag`) and its five automation feature flags (`SPECKIT_SESSION_BOOST`, `SPECKIT_PRESSURE_POLICY`, etc.). There is no general-purpose rollback runbook for feature-flag governed rollouts across arbitrary specs. (P0)
- **Gap 2:** No rollback pattern for sprint regression: if a sprint's quality gate was passing and a subsequent code change causes it to regress, there is no procedure for identifying the sprint boundary, reverting sprint-specific changes, and re-verifying against sprint exit gates. (P0)
- **Gap 3:** No rollback pattern for phase failure recovery: if a child phase in a multi-phase program fails (e.g., 012/021 recursive validation failure), there is no runbook section for isolating the failure, deciding whether to remediate vs. defer, and updating the parent's aggregate status. (P0)
- **Gap 4:** No rollback pattern for multi-agent campaign failure: if a wave of 6 concurrent agents produces conflicting outputs or partial failures, there is no procedure for identifying the collision, reverting agent outputs, and re-dispatching targeted agents. (P1)
- **Gap 5:** The smoke test command in §4 is hardcoded to specific 022-era test files. No generalized smoke test pattern for validating a rollback against an arbitrary spec's test suite. (P1)
- **Gap 6:** The re-enable sequence in §6 assumes a fixed ordering of 5 flags. No guidance for flag re-enable ordering when the flag dependency graph is non-linear (e.g., Hydra's 6-phase architecture where phases have explicit sequencing constraints). (P1)
- **Gap 7:** No documented rollback for Hydra-style database architecture phases. The Hydra phases (014/001-006) have default-on semantics and backward-compatible rollout; rolling back a Hydra phase requires different handling than feature-flag toggling. (P1)

---

### troubleshooting.md

- **Gap 1:** No troubleshooting section for recursive validation failures. The 022 epic produced exactly this failure (012/021: 2 errors, 1 warning from recursive spec validation). The troubleshooting guide covers vector index issues and MCP connection problems but not spec-folder validation errors or multi-child validation result aggregation. (P0)
- **Gap 2:** No troubleshooting for multi-child phase errors: when a parent runs `validate.sh --recursive` and multiple children fail with different error types, how to triage (P0 vs. P1), prioritize remediation order, and decide when the parent can be marked complete despite child failures. (P0)
- **Gap 3:** No troubleshooting for stale MCP metadata after sprint transitions. After closing a sprint (e.g., Sprint 5 to Sprint 6), memory files contain sprint-specific context that can surface incorrectly in `memory_match_triggers()`. There is no guidance for clearing or re-indexing stale sprint metadata. (P1)
- **Gap 4:** No troubleshooting for wrong spec folder selected during multi-phase epic work. The guide has a "Context loaded from wrong spec folder" entry (§5) but it only covers the basic case. It does not cover the 022 scenario where 51 spec folders exist under the same epic root and `memory_match_triggers()` may surface a sibling phase folder instead of the active one. (P1)
- **Gap 5:** No troubleshooting for campaign verification failures: when a multi-agent campaign produces checklist items that were "addressed" but not actually verified (237 items addressed in 2026-03-08 campaign; some remained unverified). No diagnosis path for distinguishing "addressed" from "verified with evidence". (P1)
- **Gap 6:** No troubleshooting for description.json path mismatches — the 022 epic hit exactly this (999-finalization's description.json referencing `015-finalization` instead of `999-finalization`). No entry in troubleshooting for detecting or fixing path collisions in per-folder description files. (P2)
- **Gap 7:** No troubleshooting for the R13 evaluation infrastructure: what to do when ground-truth queries return unexpected precision/recall results, how to distinguish evaluation infrastructure bugs from genuine retrieval degradation, and how to validate the evaluation harness itself. (P1)

---

### universal_debugging_methodology.md

- **Gap 1:** The stack-specific notes table (§6) covers Browser/JS, Node.js, Python, Go, Rust, Docker, and SQL. There is no entry for RAG pipeline debugging: how to diagnose retrieval quality issues, distinguish scoring calibration bugs from indexing bugs, and trace a query through the 4-stage pipeline (candidate generation, fusion, rerank/aggregate, filter/annotate). (P0)
- **Gap 2:** No methodology coverage for scoring calibration issues. The 022 epic's core finding in Sprint 2 was a 15:1 scoring mismatch caused by missing normalization. The 4-phase debug methodology does not address multi-signal fusion debugging, where the bug manifests as a calibration mismatch across channels rather than a code error with a stack trace. (P0)
- **Gap 3:** No methodology for retrieval quality measurement: how to apply the Observe phase when the "error" is not a thrown exception but a precision/recall metric below threshold. The universal methodology assumes observable errors; RAG debugging often requires constructing a measurement harness (R13 ground-truth queries, MRR/precision/recall metrics) before any debugging can begin. (P0)
- **Gap 4:** No guidance for debugging feature-flag interactions. When 8+ feature flags are active and a regression appears, the methodology's "one hypothesis at a time" rule applies but needs extension: a systematic flag isolation procedure (bisect-style flag disabling) to identify which flag or combination caused the regression. (P1)
- **Gap 5:** No guidance for multi-agent debugging scenarios: when 16 concurrent agents produce conflicting code changes that cause a test regression, how to apply the Observe phase to identify which agent's output introduced the failure (git log attribution, wave-by-wave test bisection). (P1)
- **Gap 6:** The "3+ fixes fail → question the architecture" rule (Phase 4) has no concrete examples for data pipeline scenarios. In 022, the scoring mismatch required recognizing that the fix was calibration (normalization), not architecture — a distinction that isn't surfaced in the current methodology. (P2)
- **Gap 7:** No methodology for debugging graph signal failures. The 022 epic found a 0% hit rate on the graph channel due to an ID mismatch. Debugging graph retrieval channels requires different tooling than the listed stack-specific tools (it requires edge-density inspection, co-activation analysis, not just console/debugger tools). (P1)

---

## Cross-Cutting Gaps

### 1. Epic-Scale Program Management (P0)
None of the six files contain guidance for programs that span 10+ phases, 50+ children, and multiple months. All examples, checklists, and workflows are designed for single-spec, single-session, or small multi-phase work. The 022 epic pattern (parent spec as documentation map, independent child phases, multi-agent verification campaigns, recursive rollup) is entirely undocumented.

### 2. Sprint-Gate Validation Pattern (P0)
The concept of metric-threshold exit gates controlling sprint progression appears nowhere in any of the six files. This is a distinct workflow from standard checklist verification: gates use quantitative measurements (MRR, precision, recall, latency thresholds), must pass before the next sprint unlocks, and require an evaluation harness to measure. No file covers sprint gate definition, evaluation, or failure handling.

### 3. Multi-Agent Campaigns (P0)
Launching, coordinating, and verifying multi-agent campaigns is absent from all six files. The execution model (wave structure, agent role assignment, model selection per wave, wave-level verification before proceeding) is a first-class workflow in 022 but has no documentation anywhere in the references/workflows/ or references/debugging/ directories.

### 4. Multi-CLI Orchestration (P1)
Using multiple CLI tools (Codex, Copilot, Gemini, Claude Code) with different models for different task types within the same program is undocumented. The quick reference, worked examples, and execution methods all assume a single AI agent operating sequentially.

### 5. RAG Pipeline Debugging (P0)
The debugging references (troubleshooting.md, universal_debugging_methodology.md) are oriented toward semantic memory system issues (vector index, MCP connection, decay calculation). Neither file addresses the RAG retrieval pipeline itself: diagnosing channel-level failures, scoring calibration bugs, or retrieval quality measurement. This is the core technical domain of the 022 epic.

### 6. Feature-Flag Lifecycle (P1)
Feature flag creation, gating, auditing, and sunset are undocumented across all six files. The rollback_runbook.md has a single-spec flag disable/re-enable sequence but no general flag lifecycle model. The 022 epic used 24+ flags across the RAG pipeline with an explicit 8-flag ceiling and a sunset audit (Sprint 7); none of this is reflected in the references.

### 7. Recursive Validation and Phase Failure Triage (P0)
`validate.sh --recursive` is mentioned in quick_reference.md's command table but is not documented in execution_methods.md, not exemplified in worked_examples.md, and not covered in troubleshooting.md for failure scenarios. Multi-child validation with mixed pass/fail results (the 021 recursive validation failure in 022) has no resolution path in any reference file.

---

## Recommendations

### Immediate (P0 — blocks accurate system-spec-kit guidance for epic-scale work)

1. **Add sprint-gate validation workflow** to `execution_methods.md`: how to define metric-threshold gates, run the evaluation harness, interpret go/no-go results, and document sprint exit evidence.

2. **Add epic-scale worked example** to `worked_examples.md`: a Level 3+ parent-child program with 5+ phases, showing the full lifecycle from parent creation through child spawning, multi-agent campaigns, recursive validation, and parent implementation-summary aggregation.

3. **Add multi-agent campaign execution method** to `execution_methods.md`: wave structure definition, agent role assignment, model selection per wave, wave-level verification gates, and failure isolation.

4. **Add recursive validation** to `execution_methods.md` (document `--recursive` flag) and add a recursive validation failure troubleshooting entry to `troubleshooting.md` with the multi-child triage decision tree.

5. **Add RAG pipeline debugging** to `universal_debugging_methodology.md` §6 stack-specific notes: 4-stage pipeline trace, scoring calibration diagnosis, retrieval quality measurement setup, and channel-level failure isolation.

6. **Add general-purpose rollback runbook** patterns to `rollback_runbook.md`: sprint regression rollback, phase failure recovery, and multi-agent campaign rollback. The current runbook is too narrowly scoped to a single spec.

### High Priority (P1 — gaps that cause incorrect behavior or documentation loss)

7. **Add feature-flag lifecycle guidance** to `quick_reference.md`: flag ceiling rule, flag audit procedure, sunset criteria, and flag dependency ordering for re-enable sequences.

8. **Add multi-CLI orchestration worked example** to `worked_examples.md`: showing model selection rationale, task-type routing, and result synthesis across multiple CLI providers.

9. **Add stale MCP metadata troubleshooting** to `troubleshooting.md`: how sprint/phase transitions cause stale trigger matches, detection via `memory_list()` date checks, and re-indexing procedure.

10. **Add Hydra-style phase rollback** to `rollback_runbook.md`: rolling back a default-on database architecture phase requires different handling than feature-flag disabling (schema migration rollback, API contract preservation).

11. **Add campaign verification troubleshooting** to `troubleshooting.md`: distinguishing "addressed" from "verified with evidence" in checklist items, and the detection pattern for superficially closed items.

### Lower Priority (P2 — quality improvements and completeness)

12. **Extend the worked examples overview table** to include Level 3+ and multi-phase epic rows.

13. **Add description.json path collision troubleshooting** to `troubleshooting.md` with detection command and fix procedure.

14. **Add flag bisection methodology** to `universal_debugging_methodology.md` for debugging feature-flag interaction regressions.

15. **Extend `recommend-level.sh` documentation** in `execution_methods.md` with a Level 3+ classification flag and multi-phase detection logic.
