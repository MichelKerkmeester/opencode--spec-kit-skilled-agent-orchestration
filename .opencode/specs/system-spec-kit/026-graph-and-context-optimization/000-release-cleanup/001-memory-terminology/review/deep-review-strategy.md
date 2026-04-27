# Deep Review Strategy — 001-memory-terminology PR1-PR5 Verification

## Review Charter

**Target:** PR1-PR5 phrasing-audit verification on `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology`

**Verify the ~164 edits across ~25 files hold the scope-freeze contract** from `spec.md` REQ-001:

1. **Zero identifier renames** — 21 `memory_*` MCP tools, 4 `/memory:*` slash commands, `_memory:` frontmatter keys, all `memory_*` SQL tables (incl. `working_memory`), 17 `memory-*.ts` handler filenames, `references/memory/` + `scripts/dist/memory/` folder names, all `MEMORY_*` constants
2. **Cognitive-science loanwords preserved** — `FSRS_*`, Collins-Loftus 1975 spreading-activation, Miller's-Law `working_memory`
3. **Vocabulary substitutions accurate** per `phrasing-audit.md` vocabulary key:
   - `memory` → `spec-doc record` / `indexed continuity` / `constitutional rule` / `packet` / `causal-graph node` (by local context)
4. **No semantic drift** introduced
5. **No broken anchors or cross-doc links**
6. **Runtime output strings** in handlers don't break vitest snapshot tests
7. **`spec.md` + `phrasing-audit.md`** are internally consistent

## Review Dimensions

1. **correctness** — Logic, state flow, edge cases, error handling, vocabulary substitution accuracy
2. **security** — Auth, input/output safety, data exposure, permissions (low risk for docs-only audit)
3. **traceability** — Spec/checklist alignment, cross-reference integrity, evidence coverage, contract compliance with REQ-001
4. **maintainability** — Patterns, documentation quality, clarity of phrasing, consistency across mirrors

## Scope Files (29 files)

### Spec packet (2)
- `spec.md` — Level 2 spec, REQ-001..REQ-008
- `phrasing-audit.md` — vocabulary key, hard no-touch list, current→proposed grid

### Top-level skill prose (5)
- `SKILL.md`
- `README.md`
- `config/README.md`
- `references/memory/memory_system.md`
- `references/memory/trigger_config.md`
- `references/debugging/troubleshooting.md`
- `references/validation/decision_format.md`
- `constitutional/README.md`

### Feature catalog mirrors (5)
- `system-spec-kit/feature_catalog/feature_catalog.md`
- `sk-deep-research/feature_catalog/feature_catalog.md`
- `sk-deep-review/feature_catalog/feature_catalog.md`
- `sk-improve-agent/feature_catalog/feature_catalog.md`
- `system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md`

### Manual testing playbook (1)
- `manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`

### Slash commands (4)
- `.opencode/command/memory/{save,search,learn,manage}.md`

### Agent definitions (2)
- `.claude/agents/context.md`
- `.opencode/agent/context.md`

### Runtime code — schema descriptions and outputs (3)
- `mcp_server/tool-schemas.ts`
- `mcp_server/handlers/memory-bulk-delete.ts`
- `mcp_server/handlers/memory-crud-delete.ts`
- `mcp_server/lib/search/entity-linker.ts`

### Cognitive subsystem (literature carve-out — preserve loanwords) (4)
- `mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `mcp_server/lib/cognitive/prediction-error-gate.ts`
- `mcp_server/lib/cognitive/temporal-contiguity.ts`
- `mcp_server/lib/cognitive/adaptive-ranking.ts`

## Hard No-Touch List (per spec REQ-001)

The following identifiers MUST NOT be renamed. Any rename = P0 finding.

- 21 MCP tool names: `memory_context`, `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_save`, `memory_update`, `memory_delete`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_health`, `memory_stats`, `memory_bulk_delete`, `memory_get_learning_history`, `memory_drift_why`, `memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`
- 4 slash commands: `/memory:save`, `/memory:search`, `/memory:learn`, `/memory:manage`
- Frontmatter key: `_memory:`
- SQL tables: all `memory_*` tables including `working_memory`
- Handler filenames: 17 `memory-*.ts` files in `mcp_server/handlers/`
- Folder names: `references/memory/`, `scripts/dist/memory/`
- All `MEMORY_*` constants
- Cognitive literature loanwords: `FSRS_*`, `Free Spaced Repetition Scheduler`, `Miller`, `working_memory`, `spreading activation`, `Collins-Loftus`

## Dimension Queue

Iteration 1 — **correctness inventory pass + cognitive carve-out validation**
Iteration 2 — **traceability**: REQ-001 contract compliance, anchor + cross-doc link integrity, mirror parity
Iteration 3 — **maintainability**: phrasing consistency, vocabulary substitution accuracy across files, residual untouched hits
Iteration 4 — **security + correctness sweep**: runtime output string drift, snapshot-test risk, error message consistency
Iteration 5 — **closing pass**: any remaining gaps, advisory-only items

## Stop Conditions

- All 4 dimensions covered with coverage_age >= 1
- newFindingsRatio rolling avg <= 0.08
- All P0/P1 findings have file:line evidence
- No claim adjudication blockers

## Convergence Threshold

0.10 (`maxIterations`: 5)

## Known Context

PR1-PR5 work was applied in prior session. Working tree shows the proposed edits in place. PR1 (top-level skill prose, 12 edits across 5 files) and PR2-PR5 (feature catalog mirrors, manual testing playbook, slash commands, agent definitions, MCP schemas, cognitive JSDoc) were dispatched as parallel agents and one (PR3b/c context.md mirrors) was completed in-orchestrator due to subagent edit-permission denial.

Headline patterns user flagged ("Loaded N memories", "recent memories", "your memories") were targeted via grep verification post-edit. Cognitive subsystem literature loanwords (FSRS, Miller, Collins-Loftus) are preserved verbatim.
