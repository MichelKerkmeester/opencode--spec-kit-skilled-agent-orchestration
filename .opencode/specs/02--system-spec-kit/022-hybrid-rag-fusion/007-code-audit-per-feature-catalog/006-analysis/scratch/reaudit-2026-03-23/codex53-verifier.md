Catalog entries read (directory listed first):

1. `06--analysis/01-causal-edge-creation-memorycausallink.md`
2. `06--analysis/02-causal-graph-statistics-memorycausalstats.md`
3. `06--analysis/03-causal-edge-deletion-memorycausalunlink.md`
4. `06--analysis/04-causal-chain-tracing-memorydriftwhy.md`
5. `06--analysis/05-epistemic-baseline-capture-taskpreflight.md`
6. `06--analysis/06-post-task-learning-measurement-taskpostflight.md`
7. `06--analysis/07-learning-history-memorygetlearninghistory.md`

Prior audit read: [implementation-summary.md:1](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/006-analysis/implementation-summary.md:1>) (notably [line 38](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/006-analysis/implementation-summary.md:38>) and [lines 42-45](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/006-analysis/implementation-summary.md:42>)).

1. **Feature 01 — Causal edge creation (`memory_causal_link`)**
- File verification: `mcp_server/*` references in catalog table ([01 file lines 32-131](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md:32>)) checked; **79/79 exist**.
- Function verification:
  - Tool schema exists: [tool-schemas.ts:440](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:440>).
  - Runtime handler exists with signature: [causal-graph.ts:433](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:433>).
  - Referenced functions exist:
    - `insertEdgesBatch(...)`: [causal-edges.ts:235](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:235>)
    - `createSpecDocumentChain(...)`: [causal-edges.ts:647](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:647>)
- Flag defaults check:
  - `strength` default `1.0`: [tool-schemas.ts:443](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:443>), [causal-graph.ts:438](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:438>).
  - Clamp to `[0,1]`: [causal-edges.ts:54](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:54>).
- Unreferenced implementing files found:
  - `mcp_server/handlers/causal-graph.ts` (actual tool handler): [line 432](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:432>)
  - `mcp_server/tools/causal-tools.ts` (dispatch): [lines 20-33](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:20>)
  - `mcp_server/handlers/memory-index.ts` (invokes `createSpecDocumentChain`): [lines 497-523](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:497>)
- Behavioral accuracy:
  - 6 relation types: [causal-edges.ts:15](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:15>)
  - Upsert via `ON CONFLICT ... DO UPDATE`: [causal-edges.ts:202](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:202>)
  - Auto limits (`MAX_EDGES_PER_NODE=20`, `MAX_AUTO_STRENGTH=0.5`): [causal-edges.ts:43](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:43>), [causal-edges.ts:44](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:44>)
  - Weight history logging: [causal-edges.ts:691](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:691>)
- Verdict: **PARTIAL**

2. **Feature 02 — Causal graph statistics (`memory_causal_stats`)**
- File verification: catalog refs ([02 lines 30-133](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md:30>)); **84/84 exist**.
- Function verification:
  - Tool schema: [tool-schemas.ts:446](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:446>)
  - Handler: [causal-graph.ts:551](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:551>)
  - Stats/orphan functions: [causal-edges.ts:569](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:569>), [causal-edges.ts:600](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:600>)
- Flag defaults check: no user-facing flags/defaults for this tool; empty schema is correct ([tool-schemas.ts:449](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:449>)).
- Unreferenced implementing files found: none material beyond routing.
- Behavioral accuracy:
  - Coverage + 60% target + pass/fail: [causal-graph.ts:597](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:597>), [causal-graph.ts:601](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:601>)
  - Orphan detection and health state: [causal-graph.ts:572](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:572>), [causal-graph.ts:602](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:602>)
- Verdict: **MATCH**

3. **Feature 03 — Causal edge deletion (`memory_causal_unlink`)**
- File verification: catalog refs ([03 lines 28-127](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md:28>)); **79/79 exist**.
- Function verification:
  - Tool schema: [tool-schemas.ts:452](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:452>)
  - Handler: [causal-graph.ts:653](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653>)
  - `deleteEdgesForMemory(memoryId: string)` exists: [causal-edges.ts:552](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:552>)
- Flag defaults check: none; schema requires `edgeId` ([tool-schemas.ts:455](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:455>)).
- Unreferenced implementing files found:
  - `mcp_server/handlers/causal-graph.ts` (actual unlink handler): [line 652](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:652>)
  - `mcp_server/tools/causal-tools.ts` (dispatch): [line 33](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:33>)
  - Auto-cleanup paths on deletion:
    - [memory-crud-delete.ts:114](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:114>)
    - [memory-bulk-delete.ts:201](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:201>)
- Behavioral accuracy:
  - Drift trace includes edge IDs (enables unlink workflow): [causal-graph.ts:110](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:110>), [causal-graph.ts:407](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:407>)
- Verdict: **PARTIAL**

4. **Feature 04 — Causal chain tracing (`memory_drift_why`)**
- File verification: catalog refs ([04 lines 34-137](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md:34>)); **84/84 exist**.
- Function verification:
  - Tool schema: [tool-schemas.ts:434](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:434>)
  - Handler signature: [causal-graph.ts:244](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:244>)
  - Traversal function: [causal-edges.ts:400](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:400>)
- Flag defaults check:
  - `maxDepth` default `3`: [tool-schemas.ts:437](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:437>), [causal-graph.ts:247](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:247>)
  - range clamp `[1,10]`: [causal-graph.ts:253](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:253>)
- Unreferenced implementing files found: none material beyond routing.
- Behavioral accuracy:
  - relation weights: [causal-edges.ts:30](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:30>)
  - cycle prevention (`visited`): [causal-edges.ts:415](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:415>)
  - relations filter and maxDepthReached flag: [causal-graph.ts:323](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:323>), [causal-graph.ts:409](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:409>)
- Verdict: **MATCH**

5. **Feature 05 — Epistemic baseline capture (`task_preflight`)**
- File verification: catalog refs ([05 lines 30-128](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:30>)); **79/79 exist**.
- Function verification:
  - Tool schema: [tool-schemas.ts:421](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:421>)
  - Handler signature: [session-learning.ts:215](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:215>)
- Flag defaults check:
  - optional defaults in handler (`knowledgeGaps=[]`, `sessionId=null`) align with optional schema fields: [session-learning.ts:223](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:223>), [schemas/tool-input-schemas.ts:302](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:302>)
- Unreferenced implementing files found: none material.
- Behavioral accuracy:
  - unique `(spec_folder, task_id)`: [session-learning.ts:154](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:154>)
  - update-if-preflight and block-if-complete: [session-learning.ts:253](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:253>), [session-learning.ts:261](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:261>)
- Verdict: **MATCH**

6. **Feature 06 — Post-task learning measurement (`task_postflight`)**
- File verification: catalog refs ([06 lines 32-128](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:32>)); **77/77 exist**.
- Function verification:
  - Tool schema: [tool-schemas.ts:427](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:427>)
  - Handler signature: [session-learning.ts:365](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:365>)
- Flag defaults check:
  - optional defaults (`gapsClosed=[]`, `newGapsDiscovered=[]`) align with optional schema fields: [session-learning.ts:373](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:373>), [schemas/tool-input-schemas.ts:312](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:312>)
- Unreferenced implementing files found: none material.
- Behavioral accuracy:
  - LI formula and uncertainty inversion: [session-learning.ts:413](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:413>), [session-learning.ts:417](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:417>)
  - interpretation bands: [session-learning.ts:421](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:421>)
  - phase update and gap JSON persistence: [session-learning.ts:439](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:439>)
  - preflight required error: [session-learning.ts:408](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:408>)
  - extra behavior not documented: re-correction allowed on already-`complete` rows: [session-learning.ts:396](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:396>)
- Verdict: **PARTIAL**

7. **Feature 07 — Learning history (`memory_get_learning_history`)**
- File verification: catalog refs ([07 lines 30-126](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:30>)); **77/77 exist**.
- Function verification:
  - Tool schema: [tool-schemas.ts:517](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:517>)
  - Handler signature: [session-learning.ts:529](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:529>)
- Flag defaults check:
  - `limit=10`, `onlyComplete=false`, `includeSummary=true`: [tool-schemas.ts:520](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:520>), [session-learning.ts:534](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:534>)
  - Catalog documents `onlyComplete` usage but not `includeSummary` default.
- Unreferenced implementing files found: none material.
- Behavioral accuracy:
  - `onlyComplete` filter: [session-learning.ts:564](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:564>)
  - ordered `updated_at DESC`: [session-learning.ts:568](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:568>)
  - summary stats + trend interpretation: [session-learning.ts:629](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:629>), [session-learning.ts:679](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:679>)
  - boundary nuance: catalog says `7-15` positive ([feature line 20](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:20>)), code uses `> 7` for positive ([session-learning.ts:681](</Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:681>)).
- Verdict: **PARTIAL**

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 01 | Causal edge creation (`memory_causal_link`) | YES (79/79) | YES (core signatures present) | YES | YES | PARTIAL |
| 02 | Causal graph statistics (`memory_causal_stats`) | YES (84/84) | YES | YES | NO (material) | MATCH |
| 03 | Causal edge deletion (`memory_causal_unlink`) | YES (79/79) | YES | YES | YES | PARTIAL |
| 04 | Causal chain tracing (`memory_drift_why`) | YES (84/84) | YES | YES | NO (material) | MATCH |
| 05 | Epistemic baseline capture (`task_preflight`) | YES (79/79) | YES | YES | NO (material) | MATCH |
| 06 | Post-task learning measurement (`task_postflight`) | YES (77/77) | YES | YES | NO (material) | PARTIAL |
| 07 | Learning history (`memory_get_learning_history`) | YES (77/77) | YES | PARTIAL | NO (material) | PARTIAL |