---
title: "Implementation Plan: 013 - Deprecate Skill Graph and README/Skill-Ref [001-deprecated-skill-graph-experiment/plan]"
description: "This pass is completion-focused: capture final deprecation proof after cleanup already landed. The flow confirms no SGQS/readme-indexing/skill-ref residue remains in target area..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "013"
  - "deprecate"
  - "skill"
  - "001"
  - "deprecated"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: 013 - Deprecate Skill Graph and README/Skill-Ref Indexing (Completion Pass 2)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, shell-based verification |
| **Framework** | MCP server handlers/tests + OpenCode command/skill/agent docs |
| **Storage** | SQLite runtime artifacts in `mcp_server/dist/database` |
| **Testing** | `npx tsc`, Vitest (`npm test`), `rg` policy sweeps |

### Overview

This pass is completion-focused: capture final deprecation proof after cleanup already landed. The flow confirms no SGQS/readme-indexing/skill-ref residue remains in target areas, records additional command and README anchor cleanup, then validates compile/test gates and closes Level 3 documentation artifacts.

This phase also serves as the canonical consolidation target for legacy skill-graph child folders, with archive mapping tracked in `merge-manifest.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Scope frozen to declared coverage targets.
- [x] Required verification evidence defined.
- [x] Level 3 documentation requirement confirmed.

### Definition of Done

- [x] Completion evidence captured for compile/test/forbidden-term sweeps.
- [x] Additional cleanup actions documented (command + README TOC anchors + MCP residuals).
- [x] Decision record finalized with retained causal graph boundary.
- [x] Spec validation passes; placeholder scan outcome is captured (generated-memory section labels are currently flagged).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deprecation closure and contract hardening: remove unsupported surfaces, preserve supported causal graph behavior.

### Key Components

- **Evidence Layer**: command-based compile/test/scan outputs.
- **Policy Surface Layer**: command/skill/agent docs and MCP schemas/handlers.
- **Runtime Asset Layer**: rebuilt `dist` runtime assets required by tests.

### Data Flow

Requested cleanup state is validated through deterministic commands. Results are captured into checklist entries and summarized in ADR + implementation summary for release-grade closure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Collect Completion Evidence

- [x] Verify compile (`npx tsc -p tsconfig.json`) in `mcp_server`.
- [x] Verify full tests (`npm test`) in `mcp_server`.
- [x] Verify forbidden-term and command YAML cleanup scans.

### Phase 2: Document Residual Cleanup Completion

- [x] Record command cleanup (`graph_node`, README indexing notes removal).
- [x] Record README TOC anchor additions in three README files.
- [x] Record `SkillGraphLike` -> `MemoryGraphLike` cleanup and dist asset restoration.

### Phase 3: Create Level 3 Artifacts

- [x] Author `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- [x] Ensure completed-state checkboxes and evidence links are present.

### Phase 4: Validate Documentation Bundle

- [x] Run spec validation script on `013` folder.
- [x] Run placeholder check on `013` folder.

### Phase 5: Legacy Skill-Graph Consolidation and Archive

- [x] Create merge manifest documenting legacy source coverage and destination archive paths.
- [x] Consolidate legacy-scope documentation context into active `013` artifacts.
- [x] Move legacy skill-graph folders under `../z_archive/skill-graph-legacy/`.
- [x] Mark parent root lifecycle docs as intentionally removed and keep child folders as canonical sources.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | `mcp_server` type validation | `npx tsc -p tsconfig.json` |
| Full Regression | `mcp_server` Vitest suite | `npm test` |
| Static Sweep | Deprecation residue and cleanup proof | `rg` |
| Documentation Validation | Level 3 artifact completeness | `validate.sh`, `check-placeholders.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing cleanup changes in code/docs | Internal | Green | Completion docs cannot claim closure |
| mcp_server test runtime assets | Internal | Green | Tests can fail or become non-representative |
| Validation scripts in `system-spec-kit` | Internal | Green | Completion claim cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: verification evidence indicates deprecation residue or failing quality gates.
- **Procedure**:
  1. Re-open cleanup tasks for failing area.
  2. Apply corrective code/doc updates in parent implementation scope.
  3. Re-run compile/test/scans and re-validate this spec folder.
- **Data Reversal**: none in this phase; this pass documents completion state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 8. DEPENDENCY GRAPH

```
Evidence Collection --> Residual Cleanup Documentation --> Artifact Authoring --> Validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evidence Collection | Existing cleanup state | Verified command outputs | All later phases |
| Residual Documentation | Evidence collection | Concrete completion claims | Artifact authoring |
| Artifact Authoring | Prior two phases | Level 3 docs | Validation |
| Validation | Complete docs | Completion-ready status | Final claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 9. CRITICAL PATH

1. Capture compile/test results and forbidden-term scans.
2. Author checklist with concrete evidence.
3. Finalize ADR boundaries and summary.
4. Run validation scripts.

**Total Critical Path**: single completion cycle.

**Parallel Opportunities**:

- Evidence scans can run in parallel.
- Spec/task/summary drafting can run in parallel after evidence capture.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 10. MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence captured | Compile/tests/scans recorded | 2026-02-21 |
| M2 | Level 3 docs authored | All six artifacts created | 2026-02-21 |
| M3 | Validation status captured | `validate.sh` pass + placeholder scan recorded (`9` generated-memory label matches) | 2026-02-21 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:verification-commands -->
## 11. VERIFICATION COMMANDS

```bash
cd .opencode/skill/system-spec-kit/mcp_server && npx tsc -p tsconfig.json
cd .opencode/skill/system-spec-kit/mcp_server && unset VOYAGE_API_KEY && npm test
rg -n -i "sgqs|skill-ref|readme-indexing|skill-graph" .opencode/skill/system-spec-kit/mcp_server --glob '!**/dist/**' --glob '!**/node_modules/**'
rg -n "graph_node" .opencode/command/create
rg -n -i "README indexing|readme indexing|auto-index|index readme|includeReadmes" .opencode/command/create/assets/create_folder_readme_auto.yaml .opencode/command/create/assets/create_folder_readme_confirm.yaml
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment
bash .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment
```
<!-- /ANCHOR:verification-commands -->

---

<!-- ANCHOR:adr-link -->
## 12. ARCHITECTURE DECISION RECORD LINK

See `decision-record.md` for deprecation tradeoffs and the explicit retained causal graph boundary.
<!-- /ANCHOR:adr-link -->

---

<!-- ANCHOR:ai-execution-protocol -->
## 13. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm task maps to a `T###` item in `tasks.md`.
- Confirm touched path is in declared coverage targets.
- Confirm verification command(s) for the task are known before execution.

### Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ-01 | Execute phases in sequence unless task is marked `[P]` | Prevent evidence gaps |
| TASK-SCOPE-01 | Do not edit outside this `013` spec folder for docs artifacts | Prevent scope creep |
| TASK-VERIFY-01 | Any completion claim must be backed by command/file evidence | Prevent unsupported claims |

### Status Reporting Format

- `STATUS: <phase> | TASK: <T###> | RESULT: <pass/fail/in-progress> | EVIDENCE: <command/file>`

### Blocked Task Protocol

1. Mark blocked task as `[B]` in `tasks.md` with blocker reason.
2. Capture blocker evidence in `checklist.md`.
3. Continue unblocked `[P]` tasks.
4. Escalate unresolved blockers with required decision.
<!-- /ANCHOR:ai-execution-protocol -->
