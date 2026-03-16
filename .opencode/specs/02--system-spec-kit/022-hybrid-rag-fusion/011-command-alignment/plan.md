---
title: "Plan: Command Alignment"
description: "Implementation plan for aligning the memory command docs with the current 32-tool MCP surface."
---
<!-- SPECKIT_LEVEL: 2 -->
# Plan: 011-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Align the memory command documentation set with the current Spec Kit Memory MCP surface. The implementation stays scoped to command docs and the memory README, but it must start with a schema-sync pass so the work is grounded in the live 32-tool surface rather than the older 29-tool draft.

**Effort Estimate:** ~900 LOC across 8 command-doc deliverables plus verification artifacts
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:technical-context -->
## 2. TECHNICAL CONTEXT

### Source of Truth

- Tool inventory: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- Allowed/validated parameter mirror: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- Current command docs: `.opencode/command/memory/*.md`
- README index: `.opencode/command/memory/README.txt`

### Current Repo Truth

- `TOOL_DEFINITIONS` contains **32** tools.
- 16 tools currently have no command home in the memory command suite.
- Existing command docs still use stale counts, stale naming, and incomplete parameter coverage.
- `memory_get_learning_history` is currently undocumented and must be owned by `/memory:analyze history <specFolder>`.

### Documentation Constraints

- This phase edits only `spec.md`, `plan.md`, and `tasks.md`.
- The later implementation pass must still update the actual command docs and README.
- `checklist.md` remains intentionally out of scope for this refinement pass.
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

These decisions are fixed for the implementation pass:

1. `/memory:analyze history <specFolder>` is the command home for `memory_get_learning_history`.
2. `/memory:analyze` owns both analysis and eval tools.
3. `/memory:shared` owns all shared-memory lifecycle tools.
4. `/memory:manage ingest` owns async ingest start/status/cancel workflows (folded into manage).
5. `context.md` must document `minQualityScore` as a deprecated alias of `min_quality_score`.
6. `context.md` must document `memory_match_triggers` cognitive parameters if they remain missing.
7. Feature-flag notes should appear only when they materially change command behavior in the current repo.
8. Verification must use both `tool-schemas.ts` and `tool-input-schemas.ts`, not just one file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. PHASES

### Phase 0: Schema Sync Pre-Pass

Before editing command docs, generate a current baseline from the live 32-tool surface.

| Step | Action | Output | Priority |
|------|--------|--------|----------|
| 0.1 | Recount `TOOL_DEFINITIONS` and verify the total is 32 | Verified tool inventory baseline | P0 |
| 0.2 | Compare `tool-schemas.ts` properties with `ALLOWED_PARAMETERS` | Current parameter/alias baseline | P0 |
| 0.3 | Generate a tool-to-command coverage table for the current docs | Uncovered/partial coverage list | P0 |

### Phase 1: Update Existing Commands

Update the 5 existing command files to match the current surface and fixed ownership decisions.

| Step | File | Changes | Priority |
|------|------|---------|----------|
| 1.1 | `context.md` | Add `memory_context` trace/budget params, advanced `memory_search` controls, `minQualityScore`, and `memory_match_triggers` cognitive parameters | P1 |
| 1.2 | `save.md` | Add governance/provenance/retention docs and route async bulk ingestion to `/memory:manage ingest` | P1 |
| 1.3 | `manage.md` | Fix section numbering, add `confirmName`, document current stats/health/mutation params, and add `/memory:manage ingest` subcommand | P0 |
| 1.4 | `learn.md` | Refresh tool signatures and checkpoint-delete references against current schemas | P2 |
| 1.5 | `continue.md` | Refresh retrieval signatures and reference `/memory:analyze history <specFolder>` for session enrichment | P2 |

### Phase 2: Create New Commands

Create 2 new command files (analyze.md, shared.md) using the established command pattern and the ownership decisions above (ingest folded into manage).

| Step | File | Scope | Priority |
|------|------|-------|----------|
| 2.1 | `analyze.md` | `task_preflight`, `task_postflight`, causal graph tools, and eval/reporting tools | P1 |
| 2.2 | `shared.md` | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` | P1 |
| 2.3 | ~~`ingest.md`~~ | Ingest folded into `/memory:manage ingest` (see Step 1.3) | — |

### Phase 3: Update the README

| Step | File | Changes | Priority |
|------|------|---------|----------|
| 3.1 | `README.txt` | Expand from 5 to 7 commands, update usage examples, and normalize all history references to the final `history` name | P1 |
| 3.2 | `README.txt` | Add a full tool-coverage table mapping each of the 32 tools to its primary command home | P1 |

### Phase 4: Verification

| Step | Action | Success Criteria |
|------|--------|-----------------|
| 4.1 | Generate post-change coverage table | All 32 tools mapped to a command home |
| 4.2 | Run parameter completeness audit | All live properties and aliases documented |
| 4.3 | Verify command/index naming consistency | README, command docs, and related-command sections all agree |
| 4.4 | Verify quick-reference and workflow routing | Examples and subcommand names match the intended command contract |
| 4.5 | Run spec validation for the planning docs | Validation passes except for the known out-of-scope `checklist.md` gap |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:implementation-details -->
## 5. IMPLEMENTATION DETAILS

### Existing Command Update Pattern

For each existing command update:

1. Read the command file plus both schema sources.
2. Compare the documented surface against the current tool inventory and allowed-parameter mirror.
3. Add missing parameters using the command's existing documentation style.
4. Update workflow sections only where parameter behavior changes the command contract.
5. Remove stale naming and make command ownership explicit.

### New Command Pattern

Each new command should follow the existing memory-command structure:

```text
Frontmatter
MANDATORY FIRST ACTION
Purpose / Contract
Argument Routing
MCP Enforcement Matrix
Workflow Sections
Error Handling
Quick Reference
Related Commands
```

### Command Ownership Model

- `context.md`: L1-L2 retrieval entry points and advanced retrieval controls
- `save.md`: synchronous save/index flows and save-related advanced parameters
- `manage.md`: maintenance, mutations, checkpoints, and async ingest (via `/memory:manage ingest`)
- `analyze.md`: analysis, causal graph, eval, reporting, and learning history (via `/memory:analyze history`)
- `shared.md`: shared-space lifecycle and rollout status
<!-- /ANCHOR:implementation-details -->

---

<!-- ANCHOR:verification -->
## 6. VERIFICATION STRATEGY

Verification must prove:

- every tool in `TOOL_DEFINITIONS` (32 total) has a command home
- every current property and alias in the command-facing schemas is documented
- `README.txt` describes the final 7-command surface
- the command suite consistently uses the final `history` subcommand name
- all open questions from the earlier draft have been resolved in the docs

Recommended checks:

```bash
python3 - <<'PY'
# Count tools and generate coverage table from TOOL_DEFINITIONS
PY

rg -n "<stale-count-or-open-question-pattern>" \
  .opencode/command/memory .opencode/command/memory/README.txt

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-command-alignment
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Schema files diverge from each other | Medium | High | Phase 0 must compare both schema sources before command edits begin |
| New commands fragment discoverability | Low | Medium | README coverage matrix and related-command sections must provide the unified index |
| Shared/governance docs are overexplained for basic users | Low | Low | Keep rollout-dependent behavior in advanced callouts rather than the primary happy path |
| Validation still reports spec-folder hygiene issues | High | Low | Treat missing `checklist.md` as a known out-of-scope artifact for this pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:assumptions -->
## 8. ASSUMPTIONS

- The implementation pass will edit the actual command docs and README after this refinement lands.
- The command set after implementation is fixed at 7 commands.
- The planning docs should reflect current repo truth even if earlier research drafts used older counts.
- This pass should remove ambiguity, not perform any MCP or command implementation changes.
<!-- /ANCHOR:assumptions -->

---

<!--
PLAN: 011-command-alignment
Complete (2026-03-15)
32-tool schema baseline, 7-command final suite (ingest in manage, history in analyze)
-->
