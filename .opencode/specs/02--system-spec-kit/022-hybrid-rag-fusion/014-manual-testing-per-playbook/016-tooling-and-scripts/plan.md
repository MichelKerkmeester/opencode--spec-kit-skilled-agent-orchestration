---
title: "Implementation Plan: 016-tooling-and-scripts manual testing"
description: "This plan structures execution for the 23 tooling-and-scripts manual scenarios assigned to phase 016. It organizes exact prompts, destructive-vs-safe sequencing, evidence collection, and verdict handling under the review protocol."
trigger_phrases:
  - "implementation plan"
  - "manual testing"
  - "tooling and scripts"
  - "149"
  - "PHASE-001"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: 016-tooling-and-scripts manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Spec folder documentation + sandbox evidence artifacts |
| **Testing** | manual + MCP |

### Overview
This plan sequences the phase-016 tooling-and-scripts scenarios so low-risk inspections and verification suites run before any sandbox-destructive flows. It keeps the playbook prompts exact, applies the merged review protocol for verdicts, and separates shell-driven manual checks from MCP-backed contract validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All 23 test IDs are resolved to a source prompt, command path, and evidence expectation.
- [ ] The playbook, review protocol, and feature catalog links are available from this phase folder.
- [ ] Sandbox targets exist for destructive checks (`bulk-delete`, malformed memories, generated phase folders, watcher temp files).
- [ ] MCP/runtime prerequisites are known for tests that require slash commands or `memory_save`.
- [ ] The `139` session-capturing scenario is sourced from the canonical `M-007` section, not reconstructed from memory.

### Definition of Done
- [ ] `spec.md` and `plan.md` both cover all 23 phase-016 scenarios.
- [ ] Every scenario has an exact prompt in Section 5 and a matching acceptance rule in `spec.md`.
- [ ] Evidence collection expectations align with `../../manual_testing_playbook/review_protocol.md` verdict rules.
- [ ] Destructive scenarios are constrained to disposable folders, sandbox files, or checkpoint-backed targets.
- [ ] A quick structural audit confirms required anchors, frontmatter fields, and test IDs are present.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual testing pipeline with evidence-first verdicting

### Key Components
- **Preconditions**: Validate environment, sandbox targets, and source references before running a scenario.
- **Execution**: Run the exact prompt/command sequence from the playbook without rewriting intent.
- **Evidence**: Capture transcripts, logs, diffs, manifests, or screenshots named by scenario.
- **Verdict**: Apply review-protocol rules to classify each scenario as `PASS`, `PARTIAL`, or `FAIL`.

### Data Flow
`preconditions -> execute -> evidence -> verdict`

The phase packet should be used as an operator checklist: establish safe prerequisites, run the documented commands, capture readable evidence, then apply the review protocol so feature-level rollups remain deterministic.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Confirm source references: playbook, review protocol, tooling feature docs, and phase-system catalog anchors.
- [ ] Prepare sandbox paths for watcher tests, malformed memory files, admin CLI dry-run/delete checks, and generated phase-folder structures.
- [ ] Confirm MCP availability for `memory_save` and slash-command scenarios.
- [ ] Establish checkpoint or delete-after-use cleanup rules for any scenario that mutates files or creates folders.

### Phase 2: Non-Destructive Tests
- [ ] Run documentation, grep, audit, and targeted-suite scenarios first: `061`, `062`, `070`, `089`, `127`, `128`, `135`, `136`, `137`, `138`, `147`, and `PHASE-001`.
- [ ] Capture direct evidence from stdout, grep output, Vitest transcripts, or verifier summaries.
- [ ] Use these runs to confirm baseline health before any write-path checks begin.

### Phase 3: Destructive Tests
- [ ] Constrain watcher, admin CLI, session-capture, malformed-memory, and phase-folder workflows to sandbox targets: `099`, `113`, `139`, `149`, `PHASE-002`, `PHASE-003`, `PHASE-004`, and `PHASE-005`.
- [ ] For `113`, use `specs/test-sandbox` or equivalent disposable scope and preserve any checkpoint-warning evidence.
- [ ] For `139` and `149`, keep malformed or thin-memory files outside active production memory folders except when the test explicitly audits the active corpus.
- [ ] For `PHASE-002` through `PHASE-005`, create disposable parent/child phase folders and remove or quarantine them after evidence capture.

### Phase 4: Evidence Collection and Verdict
- [ ] Ensure every scenario captures readable evidence named in the playbook (logs, transcripts, manifests, JSON output, or screenshots).
- [ ] Evaluate each scenario against the review protocol: preconditions satisfied, prompt/command sequence followed, expected signals present, evidence complete, rationale explicit.
- [ ] Record `PASS`, `PARTIAL`, or `FAIL` per scenario and preserve triage notes for any non-pass outcome.
- [ ] Derive feature verdicts only after all mapped scenarios have evidence-backed scenario verdicts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---|---|---|---|
| `061` | Tree thinning for spec folder consolidation | `Validate tree thinning behavior (PI-B1).` | manual |
| `062` | Progressive validation for spec documents | `Run progressive validation (PI-B2).` | manual |
| `070` | Dead code removal | `Audit dead code removal outcomes.` | manual |
| `089` | Code standards alignment | `Validate code standards alignment outcomes.` | manual |
| `099` | Real-time filesystem watching (P1-7) | `Validate SPECKIT_FILE_WATCHER behavior.` | manual |
| `113` | Standalone admin CLI | `Validate standalone admin CLI commands.` | manual |
| `127` | Migration checkpoint scripts | `Run the migration checkpoint script verification suite.` | manual |
| `128` | Schema compatibility validation | `Run the schema compatibility validation suite.` | manual |
| `135` | Grep traceability for feature catalog code references | `Validate feature catalog grep traceability.` | manual |
| `136` | Feature catalog annotation name validity | `Validate all Feature catalog annotation names against catalog.` | manual |
| `137` | Multi-feature annotation coverage | `Validate multi-feature files carry all applicable annotations.` | manual |
| `138` | MODULE: header compliance via `verify_alignment_drift.py` | `Validate MODULE: header compliance across all non-test .ts files.` | manual |
| `139` | Session capturing pipeline quality | `Run full closure verification for spec 009-perfect-session-capturing, including JSON authority, stateless enrichment, the full native fallback chain (OpenCode, Claude, Codex, Copilot, Gemini), numeric quality calibration, and indexing readiness.` | manual |
| `147` | Constitutional memory manager command | `Validate /memory:learn constitutional manager flow and documentation consistency.` | manual |
| `149` | Rendered memory template contract | `Validate the rendered-memory template contract for memory_save, generate-context, and historical remediation.` | MCP |
| `PHASE-001` | Phase detection scoring | `Verify phase detection scoring produces valid 5-dimension output for a complex spec folder.` | manual |
| `PHASE-002` | Phase folder creation | `Create a phase-decomposed spec folder and verify parent and child structure.` | manual |
| `PHASE-003` | Recursive phase validation | `Run recursive validation on a phase parent and verify aggregated per-phase results.` | manual |
| `PHASE-004` | Phase link validation | `Validate phase link integrity across parent and child folders.` | manual |
| `153` | JSON mode hybrid enrichment | `Validate the structured JSON summary contract for generate-context.js including toolCalls/exchanges fields and file-backed JSON authority.` | manual |
| `154` | JSON-primary deprecation posture | `Validate that routine saves require --json/--stdin, direct positional capture requires --recovery, and operator guidance reflects the two-mode contract.` | manual |
| `PHASE-005` | Phase command workflow | `Run the spec_kit:phase command end-to-end and verify all 7 workflow steps complete.` | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../manual_testing_playbook/manual_testing_playbook.md` | Internal source | Green | No canonical prompts, commands, or acceptance rules |
| `../../manual_testing_playbook/review_protocol.md` | Internal source | Green | Verdict rules and release-readiness logic become ambiguous |
| `feature_catalog/16--tooling-and-scripts/` | Internal source | Green | Scenario-to-feature traceability is incomplete |
| `../../feature_catalog/feature_catalog.md` phase-system anchors | Internal source | Green | `PHASE-001` through `PHASE-005` cannot be linked to the catalog section |
| MCP runtime (`memory_save`, slash commands) | Runtime dependency | Yellow | `147` and `149` cannot be executed end-to-end |
| Sandbox file/folder workspace | Test infrastructure | Yellow | Destructive scenarios risk touching non-disposable content |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet misstates a playbook prompt, acceptance criterion, source link, or destructive-test safety boundary.
- **Procedure**: Re-open the canonical playbook and feature sources, revert only the inaccurate documentation sections, and regenerate the affected file content from source text. Remove any disposable folders or malformed sandbox files created while validating the plan.
<!-- /ANCHOR:rollback -->

---
