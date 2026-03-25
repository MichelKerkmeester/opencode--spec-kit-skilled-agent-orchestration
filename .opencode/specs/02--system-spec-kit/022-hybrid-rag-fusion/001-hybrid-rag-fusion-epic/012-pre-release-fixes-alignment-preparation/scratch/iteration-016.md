# Iteration 016: Code Maintainability

## Findings

1. **Overly complex orchestration function (`runWorkflow`) increases change risk and review cost**
   - File: `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:324-1486`
   - The function is ~1,162 lines and mixes loading, alignment checks, contamination cleaning, extraction, scoring, rendering, and output orchestration in one body.
   - Heuristic branch-density pass flagged this as the highest hotspot (decision-token proxy: `133`), making safe modifications difficult without regressions.

2. **Stage-1 retrieval pipeline is a single high-cyclomatic block with many feature-flag branches**
   - File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:285-1160`
   - `executeStage1` handles concept routing, hybrid mode, decomposition, variant expansion, fallback behavior, tracing, and channel-specific logic in one large function.
   - Heuristic branch-density pass flagged decision-token proxy `114`; this is high maintenance overhead for future ranking changes.

3. **`memory_search` handler remains too large and policy-dense for safe incremental edits**
   - File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:396-1069`
   - `handleMemorySearch` spans validation, cursor handling, cache policy, intent classification, pipeline execution, adaptive logic, telemetry, and response shaping.
   - Heuristic branch-density proxy: `81`, indicating substantial cognitive load and high chance of side effects when changing behavior.

4. **Duplicated traversal logic should be shared (sync/async child-folder search)**
   - File: `.opencode/skill/system-spec-kit/scripts/dist/core/subfolder-utils.js:63-163` and `:165-270`
   - `findChildFolderSync` and `findChildFolderAsync` duplicate the same algorithm (root dedup, recursive traversal, ambiguity handling, warning strategy), differing mostly in sync vs async fs APIs.
   - This duplication creates parallel bug-fix surfaces and increases divergence risk.

5. **Duplicated directory-discovery logic exists in workspace identity utilities**
   - File: `.opencode/skill/system-spec-kit/scripts/dist/utils/workspace-identity.js:89-110` and `:111-132`
   - `findNearestOpencodeDirectoryRaw` and `findNearestOpencodeDirectory` are near-identical loops with only normalization differences.
   - Consolidating shared traversal and injecting normalization strategy would reduce maintenance overhead.

6. **Inconsistent naming patterns inside TypeScript schema module reduce readability and convention clarity**
   - File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:155`, `:1270`, `:1290`, `:1512`
   - Mixed naming styles (`run_migrations`, `safe_get_schema_version`, `migrate_confidence_columns`, `ensure_canonical_file_path_support`) coexist with surrounding camelCase conventions.
   - This inconsistency raises friction for navigation and makes refactoring/search less predictable.

7. **No-op catch branches behave like dead code paths and obscure intent**
   - File: `.opencode/skill/system-spec-kit/scripts/dist/core/subfolder-utils.js:80-83`, `:100-103`, `:146-149`, `:182-185`, `:192-195`, `:253-256`
   - Multiple catch blocks contain `if (_error instanceof Error) { void _error.message; }`, which has no behavioral effect.
   - Similar non-action branch appears in folder detection (`.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js:966-969`).
   - These branches are reachable but functionally inert, and they add noise without improving diagnostics.

8. **Comment/structure drift signals transitional tech debt in memory search handler**
   - File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:383-390`, `:634`, `:715-718`
   - The file carries legacy-structure comments (e.g., removed sections and shifted numbering), while runtime logic now routes through the V2 pipeline plus compatibility-shaped payload aliases.
   - Not a functional bug, but this “transition residue” increases onboarding time and makes intent of current vs legacy concerns less clear.

9. **Source + committed transpiled output creates mirrored maintenance surfaces**
   - Examples: 
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` and `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js`
     - `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` and `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js`
   - Large mirrored files increase review noise and drift risk unless regeneration discipline is strict.

## Summary

- **Dead/unreachable review:** no hard `if (false)`-style unreachable branches found in reviewed production paths; however, several no-op catch branches act as dead-weight logic.
- **Complexity:** three major hotspots dominate maintainability risk (`runWorkflow`, `executeStage1`, `handleMemorySearch`).
- **Naming/comments:** inconsistent naming style and transitional comments reduce readability.
- **Duplication:** algorithm duplication exists in folder traversal and workspace identity logic.
- **Tech debt:** mirrored source/dist code and legacy-compatibility residue increase future change cost.

## JSONL (type:iteration, run:16, dimensions:[maintainability])

{"type":"iteration","run":16,"dimensions":["maintainability"],"result":"issues_found","highlights":{"complexity_hotspots":[{"file":".opencode/skill/system-spec-kit/scripts/dist/core/workflow.js","symbol":"runWorkflow","lines":"324-1486","decision_proxy":133},{"file":".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts","symbol":"executeStage1","lines":"285-1160","decision_proxy":114},{"file":".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts","symbol":"handleMemorySearch","lines":"396-1069","decision_proxy":81}],"duplication":[{"file":".opencode/skill/system-spec-kit/scripts/dist/core/subfolder-utils.js","lines":["63-163","165-270"],"issue":"sync/async traversal logic duplicated"},{"file":".opencode/skill/system-spec-kit/scripts/dist/utils/workspace-identity.js","lines":["89-110","111-132"],"issue":"near-identical nearest .opencode search loops"}],"naming":[{"file":".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts","symbols":["run_migrations","safe_get_schema_version","migrate_confidence_columns","ensure_canonical_file_path_support"],"issue":"mixed snake_case in camelCase-heavy module"}],"dead_weight_code":[{"file":".opencode/skill/system-spec-kit/scripts/dist/core/subfolder-utils.js","lines":["80-83","100-103","146-149","182-185","192-195","253-256"],"issue":"no-op catch blocks with `void _error.message`"},{"file":".opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js","lines":"966-969","issue":"catch branch with no meaningful action"}],"comment_debt":[{"file":".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts","lines":["383-390","634","715-718"],"issue":"legacy-structure comments and compatibility residue increase cognitive load"}],"structural_tech_debt":[{"scope":"mcp_server source+dist","issue":"mirrored TS/JS maintenance surfaces increase drift and review overhead"}]}}
