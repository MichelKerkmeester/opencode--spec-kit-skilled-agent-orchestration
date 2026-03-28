# Doc Alignment Audit - Agent 2

## Scope

Audited the requested System Spec Kit skill docs plus the root repository README against the live Memory Database Refinement runtime.

Files reviewed:
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md`
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- `.opencode/skill/system-spec-kit/references/templates/template_style_guide.md`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- `.opencode/skill/system-spec-kit/assets/*.md`
- `README.md`

## Source-of-Truth Checks

Validated doc claims against live implementation and refinement artifacts:
- `mcp_server/tool-schemas.ts` confirms `33` MCP tools.
- `mcp_server/lib/search/vector-index-schema.ts` defines `56` `memory_index` columns in the checked-in schema.
- `mcp_server/lib/search/search-flags.ts` confirms runtime rollout resolution and `SPECKIT_GRAPH_WALK_ROLLOUT` states: `off`, `trace_only`, `bounded_runtime`.
- `mcp_server/handlers/causal-graph.ts` confirms read-transaction/truncation metadata behavior.
- `mcp_server/lib/eval/ablation-framework.ts` and `handlers/eval-reporting.ts` confirm missing-query-ID warnings, token-usage handling, and dashboard/reporting behavior.
- `026-memory-database-refinement/tasks.md`, `implementation-summary.md`, and `scratch/p2-triage-agent{1,3,4}.md` confirmed the specific refinement fixes that required documentation alignment.

## Files Updated

### 1. `.opencode/skill/system-spec-kit/README.md`

Updated:
- Removed brittle structural counts/line-count claims for `mcp_server/`.
- Clarified that indexing populates vector/FTS5/BM25 surfaces and that graph/degree signals are retrieval-time concerns.
- Fixed env-var guidance from `SPEC_KIT_DB_PATH` to `MEMORY_DB_PATH`.
- Rewrote the feature-flag section to describe runtime-resolved flags instead of static/import-time behavior.
- Updated the MCP-server README description to mention current 5-channel retrieval and runtime rollout behavior.

### 2. `.opencode/skill/system-spec-kit/SKILL.md`

Updated:
- Changed the integrated memory-system overview from 3-channel wording to current 5-channel retrieval wording.
- Kept the tool count at `33` and pointed to `mcp_server/tool-schemas.ts` as the tool source of truth.
- Corrected `shared_memory_status()` from `L3` to `L5`.
- Rewrote `memory_search()` summary to reflect intent routing, channel normalization, graph/degree signals, reranking, and filtering.
- Expanded search architecture notes to reflect fixed fallback thresholds, disabled-channel preservation, post-rerank truncation, and token-budget enforcement.
- Expanded save-pipeline notes to cover stale-parse revalidation, duplicate verification, and integrity-critical vector/projection cleanup.
- Added current refinement notes for causal truncation metadata, eval guardrails, and runtime-resolved flag behavior.

### 3. `README.md`

Updated:
- Replaced stale memory-engine diagram copy (`PE gating - constitutional tiers`) with runtime/eval language that matches the current refinement surface.
- Fixed the default database path to `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`.
- Rewrote the memory feature-flag section around runtime-resolved behavior and current control groups.
- Replaced the obsolete 25-table schema summary with a current high-level description centered on `memory_index` plus companion FTS/vector/graph/lifecycle/eval tables.
- Corrected the FAQ entry so `memory_match_triggers()` is described as the fast trigger/cognitive pass, while full hybrid retrieval is attributed to `memory_context()` / `memory_search()`.

## Reviewed But Left Unchanged

No refinement-sensitive memory-runtime drift was found in:
- `references/structure/folder_structure.md`
- `references/templates/level_specifications.md`
- `references/templates/template_guide.md`
- `references/templates/template_style_guide.md`
- `references/workflows/quick_reference.md`
- `assets/complexity_decision_matrix.md`
- `assets/level_decision_matrix.md`
- `assets/parallel_dispatch_config.md`
- `assets/template_mapping.md`

Reason:
- These files are focused on spec-folder/template workflow mechanics and do not currently describe the changed memory-runtime counts, save/graph/eval behavior, or feature-flag semantics that drifted elsewhere.

## Verification

Commands run:

```bash
git diff -- .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/SKILL.md README.md
rg -n "SPEC_KIT_DB_PATH|shared/mcp_server/database/context-index.sqlite|25 tables|memory_match_triggers\\(\\) runs a 5-channel hybrid search|PE gating ─ constitutional tiers|vector \\+ FTS \\+ BM25|shared_memory_status\\(\\).*L3" .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/SKILL.md README.md
for f in .opencode/skill/system-spec-kit/references/structure/folder_structure.md .opencode/skill/system-spec-kit/references/templates/level_specifications.md .opencode/skill/system-spec-kit/references/templates/template_guide.md .opencode/skill/system-spec-kit/references/templates/template_style_guide.md .opencode/skill/system-spec-kit/references/workflows/quick_reference.md .opencode/skill/system-spec-kit/assets/*.md; do
  rg -n "33 tools|31 tools|57 columns|56 columns|5-channel|feature flag|graph walk|runtime-resolved|SPECKIT_GRAPH_WALK_ROLLOUT|memory_search\\(|memory_match_triggers\\(" "$f" || true
done
```

Verification outcome:
- Targeted stale claims were removed from the edited files.
- The untouched reference/assets files did not contain refinement-sensitive runtime descriptions that needed correction.
- Net change: `3` files updated, `39` insertions, `35` deletions.

## Follow-on Notes

- The user-scoped files now align with the live runtime on tool count (`33`) and DB-path conventions, but the broader repo still contains older memory-server docs outside this task scope, including `mcp_server/README.md`, `INSTALL_GUIDE.md`, and other feature/playbook references.
- The checked-in spec packet itself still contains historical claims such as `31 tools` / `57-column schema`; I did not edit packet core docs because this task only asked for the skill docs, assets, references, and root README.
