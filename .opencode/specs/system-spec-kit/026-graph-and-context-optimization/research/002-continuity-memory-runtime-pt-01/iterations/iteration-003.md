## Focus

Audit Q2: `/memory:save` planner-first routing drift, with emphasis on the 8-category route table, planner-vs-apply gating, fallback behavior, and route/merge semantics that are documented differently from the live handler.

## Actions Taken

1. Read the operator contract in `.opencode/command/memory/save.md` and the routing reference in `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`; extracted the documented 8-category table plus the planner-first/full-auto wording.
2. Read `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`; confirmed the live runtime flag is `SPECKIT_SAVE_PLANNER_MODE`, not a `SPECKIT_MEMORY_SAVE_EXECUTE` gate.
3. Read `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`; traced `ROUTING_CATEGORIES`, Tier 1 heuristics, `buildTarget(...)`, and the Tier 3 prompt contract for targets and merge modes.
4. Read `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`; traced `shouldPlanCanonicalSave`, planner response construction, full-auto handoff, and the canonical prepared-save path.
5. Read `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` and `handlers/save/validation-responses.ts`; confirmed the planner response shape is blockers/advisories/follow-up actions only and does not invoke an external save workflow.
6. Read `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts` and `handlers/save/spec-folder-mutex.ts`; checked `insert-new-adr` numbering and the scope of the save mutex.
7. Read `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`; compared the public tool schema wording with the router's live target paths.

## Findings

### Route matrix

| routeAs value | Documented target | Code target | Documented merge-mode | Code merge-mode | Drift verdict |
| --- | --- | --- | --- | --- | --- |
| `narrative_progress` | `implementation-summary.md::what-built` | `implementation-summary.md::what-built` | `append-as-paragraph` | `append-as-paragraph` | match |
| `narrative_delivery` | `implementation-summary.md::how-delivered` | `implementation-summary.md::how-delivered` | `append-as-paragraph` | `append-as-paragraph` | match |
| `decision` | `decision-record.md::adr-NNN` on L3/L3+; `implementation-summary.md::decisions` on L1/L2 | same | `insert-new-adr` on L3/L3+; `update-in-place` on L1/L2 | same | match |
| `handover_state` | `handover.md::session-log` | `handover.md::session-log` | `append-section` | `append-section` | match |
| `research_finding` | `research/research.md::findings` | `research/research.md::findings` | `append-section` | `append-section` | match* |
| `task_update` | `tasks.md::<phase-anchor>` | `tasks.md::<likelyPhaseAnchor \|\| phase-1>` | `update-in-place` | `update-in-place` | match |
| `metadata_only` | `_memory.continuity` / `implementation-summary.md::_memory.continuity` | `implementation-summary.md::_memory.continuity` | `update-in-place` | `update-in-place` | match |
| `drop` | `scratch/pending-route-<hash>.json` via refusal | refusal path uses `<hash>`; explicit `routeAs: "drop"` maps to `scratch/pending-route-drop.json` | `refuse-to-route` | `refuse-to-route` | drift |

\* The route table matches, but user-facing schema/error strings still advertise legacy `research.md`; see `FIND-iter003-research-target-doc-string-drift`.

### P1

- `FIND-iter003-planner-default-gated-by-hints`  
  The docs say canonical save requests are planner-first by default and only mutate after explicit `plannerMode: "full-auto"` opt-in, but the handler only enters planner mode when at least one routing hint is already present. `save.md` documents planner-first default and full-auto opt-in (`.opencode/command/memory/save.md:78-79`), while the live gate is `const shouldPlanCanonicalSave = !dryRun && plannerMode !== 'full-auto' && Boolean(routeAs || mergeModeHint || targetAnchorId);` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2637-2638`). If that condition is false, the request falls through to `indexMemoryFile(...)` and mutates immediately (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2969-2978`). This is specified-but-unimplemented default planner behavior.

- `FIND-iter003-generate-context-fallback-doc-only`  
  The command docs still frame `generate-context.js` as the primary save mechanism around the planner-first rewrite, but the live planner path never invokes it and its follow-up actions only point back to the in-handler atomic writer and local maintenance steps. The docs say `generate-context.js` remains the primary save mechanism and describe planner-first/full-auto around that flow (`.opencode/command/memory/save.md:77-79`), but the planner follow-ups are `apply`, `refresh-graph`, `reindex`, `reconsolidate`, and `enrich` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1684-1739`), and the planner branch returns `buildPlannerResponse(...)` directly from `atomicSaveMemory(...)` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2937-2967`). The response builder is a pure envelope serializer, not a workflow bridge (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:446-485`). That makes the advertised fallback-to-`generate-context.js` behavior doc-only in this runtime slice.

- `FIND-iter003-adr-numbering-cross-process-race`  
  The route table itself matches for `decision`, but the L3/L3+ `insert-new-adr` implementation allocates ADR numbers from the current anchor snapshot and relies on an in-process mutex, so the numbering is deterministic per snapshot but not cross-process safe. `buildTarget(...)` sends L3/L3+ decisions to `decision-record.md` with `insert-new-adr` (`.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1072-1076`). The merge code computes `nextAdrNumber` as `max(existing adr-NNN) + 1` from `anchorBody` (`.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:359-383`, `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:764-772`). The save mutex is only an in-memory `Map` (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:9-27`), and the atomic-save comment explicitly scopes protection to the per-process mutex (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3031-3037`). So the documented decision route exists, but the implementation does not guarantee unique ADR numbering across concurrent processes.

### P2

- `FIND-iter003-merge-mode-hint-validator-only`  
  `mergeModeHint` is exposed publicly but is not documented in the operator contract/reference files as part of the routing contract, and the implementation does not let it steer routing; it only accepts the hint when it exactly matches the router's chosen merge mode. The public tool schema advertises `mergeModeHint` as an optional routed-save hint (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:223`), but neither `save.md` nor `save_workflow.md` documents its behavior. In code, a mismatch is rejected outright (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1411-1424`), and the applied merge mode is just `params.mergeModeHint ?? effectiveDecision.target.mergeMode` after that validation (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1443-1460`). This is implemented-but-undocumented behavior, and "hint" is misleading because it does not select alternate merge modes.

- `FIND-iter003-drop-override-fixed-filename`  
  The docs say `drop` routes to `scratch/pending-route-<hash>.json` via refusal, and also say `routeAs` can force any of the 8 categories. In code, refusal uses the chunk hash, but an explicit `routeAs: "drop"` maps through `buildTarget('drop')` to `refusalTarget('drop')`, which produces `scratch/pending-route-drop.json` instead of a hash-specific filename. The documented target is the hashed refusal file (`.opencode/command/memory/save.md:99,115`; `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:317,326`), while the explicit drop target is built from the literal string `'drop'` (`.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1085-1095`). This is a narrow route-specific drift in the live routing table.

- `FIND-iter003-research-target-doc-string-drift`  
  The routing docs and router both standardize `research_finding` on `research/research.md`, but the public `memory_save` schema and the handler's own validation error still advertise `research.md`. The route table in `save.md` and `save_workflow.md` points to `research/research.md::findings` (`.opencode/command/memory/save.md:96`; `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:314`), and `buildTarget(...)` does the same (`.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1078-1080`). But the thrown allowlist error still names `research.md` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2650-2651`), and the tool schema repeats that legacy path (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:223`). The runtime still supports the legacy file for compatibility, but the public save surfaces drift from the canonical routed target.

## Questions Answered

Q2 is **fully answered**.

1. **Source-of-truth route decision**: `ROUTING_CATEGORIES` + `buildTarget(...)` in `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:22-31,1062-1087`.
2. **Canonical targets + merge modes**: all 8 documented categories exist in code with the same target/merge-mode pair, except for the explicit-`drop` filename drift described above.
3. **Merge-mode hint behavior**: not a selector; it is a validator-only compatibility parameter that rejects mismatches.
4. **Planner-first default**: drifted. The live handler only plans when routing hints are already supplied.
5. **Fallback parity**: drifted. The live planner/follow-up path does not call `generate-context.js`.
6. **Enum drift**: ruled out. The same 8 route values appear in `save.md`, `save_workflow.md`, `tool-schemas.ts`, `memory-save.ts`, and `content-router.ts`.

## Questions Remaining

1. **Q3 Gates A-F enforcement** - trace continuity-read gating and regression coverage.
2. **Q4 D1-D8 remediation landing status** - verify packet-002 fixes in runtime code, not just docs/tests.
3. **Q5 Cache-warning hook transcript identity + replay coverage** - inspect transcript identity and replay invariants.
4. **Q6 Reducer / state rehydration schema agreement** - compare hook-state, thin continuity, and reducer schema expectations.
5. **Q7 JSONL audit events vs live emitters** - enumerate runtime event types and compare with audit docs.

## Next Focus

Audit **Q3** next: Gate enforcement drift between documented continuity-read gates, regression tests, and the live handlers that decide when packet continuity is allowed to load.
