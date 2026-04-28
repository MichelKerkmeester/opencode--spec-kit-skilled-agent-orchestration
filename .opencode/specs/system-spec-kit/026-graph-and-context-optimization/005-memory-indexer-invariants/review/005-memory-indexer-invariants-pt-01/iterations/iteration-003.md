# Iteration 3 — Traceability

## Dimension

D3 Traceability. This pass audited core `spec_code` and `checklist_evidence` protocols, plus the `feature_catalog_code` and `playbook_capability` overlays for the spec-folder target.

## Files Reviewed

- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/plan.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/tasks.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/description.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/scripts/memory/README.md`
- `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md`
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md`
- 15 focused Vitest files named by the packet/checklist and README-regression set.

## Findings — P0 (Blockers)

No new P0 findings.

## Findings — P1 (Required)

No new P1 findings.

## Findings — P2 (Suggestions)

### P2-006: Root packet docs still carry post-merge identity drift outside the strategy artifact

The parent metadata now references `005-memory-indexer-invariants` at `specs/system-spec-kit/026-graph-and-context-optimization/description.json:20` and `specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:12`, but `REQ-014` still says the parent metadata should reference `010-memory-indexer-invariants` at `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md:193`. The stale identity also appears in `implementation-summary.md` metadata at line 42 and checklist evidence at lines 149-150.

This is not the same as the already-open strategy-map drift. The strategy issue is local to `deep-review-strategy.md`; this one lives in the canonical packet docs and makes the P1 topology requirement point at the wrong post-merge truth. Fix by changing `REQ-014`, `CHK-F03`, `CHK-F04`, and the implementation-summary metadata to the current `005-memory-indexer-invariants` folder, while preserving legacy aliases only where the metadata explicitly documents alias compatibility.

### P2-007: Feature catalog entry is mostly current but points at stale packet and ADR identifiers

The global catalog has an index-scope invariant entry, so the capability is discoverable. It documents `shouldIndexForMemory()`, `shouldIndexForCodeGraph()`, symlink hardening, the constitutional README exclusion, cleanup `--apply` / `--verify`, and walker DoS caps in `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:25`.

The traceability labels are stale, though: that same entry calls the source "Packet 026/010/002" and says the constitutional README exclusion is "per ADR-005" at line 25. The current packet is `005-memory-indexer-invariants` (`spec.md:2`), and the README exclusion decision is ADR-006 at `decision-record.md:217` through `decision-record.md:235`. The operator README now documents the stable runtime and cleanup action strings at `.opencode/skill/system-spec-kit/mcp_server/README.md:121` through `.opencode/skill/system-spec-kit/mcp_server/README.md:125`, but the catalog entry does not name the cleanup-specific action or shared governance-audit helper surface.

Patch the catalog entry to the current packet path, current ADR number, and the two stable action strings so catalog readers can get from capability claim to implementation without historical lookup.

### P2-008: Manual playbook covers the broad save/index scenario but misses first-class adversarial scenarios

The playbook has one broad context-save/index-update scenario for the packet at `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:17` through line 19. It asks operators to verify cleanup `--verify` at line 28, the four invariant counts at lines 35-36, and a non-constitutional `importanceTier: "constitutional"` spot-check at line 44. That is useful, but it does not satisfy the overlay prompt's capability matrix.

Missing first-class scenarios: cleanup CLI `--apply` execution and rollback evidence, checkpoint restore invariant validation, walker DoS adversarial inputs, and constitutional-tier promotion bypasses through update/post-insert/restore surfaces. The root playbook requires real execution and evidence at `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:9` and evidence capture at lines 205-213, so these paths should have dedicated scenario files or explicit steps instead of being implicit in the broad context-save scenario.

### P2-009: Runtime trace comments point ADR readers at the wrong packet

Several implementation sites map to the current ADRs but their comments cite `packet 026/011`, which is not the on-disk packet under review. Examples:

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:308` cites ADR-006 in packet `026/011`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:452` cites ADR-006 in packet `026/011`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:105` cites ADR-006 in packet `026/011`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1312` cites ADR-006 in packet `026/011`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372` cites ADR-012 in packet `026/011`.

The code behavior still maps to the accepted decisions, but the breadcrumb does not. Update those comments to the current packet ID and ADR numbers after the root merge.

## Traceability Checks

### CORE: `spec_code`

| Requirement | Status | Implementation evidence | Test / validation evidence |
|---|---|---|---|
| REQ-001 | Pass | Cross-file `UPDATE` / `REINFORCE` downgrades to `CREATE` in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:77` through line 95; candidate canonical path is preserved in `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:128` through line 148. | `.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:46`, `:108`, `:161`. |
| REQ-002 | Pass | `memory_index_scan` threads `fromScan: true` in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:420`; normal save origin defaults are separated in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2009` through line 2045; transactional `candidate_changed` remains in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2420` through line 2429. | `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:585`, `:712`, `:747`, `:841`, `:884`. |
| REQ-003 | Pass | Memory exclusions include `z_future` in `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25` through line 29; discovery and graph-metadata paths call the helper at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:112` and `:279`; save-time guard rejects excluded paths at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2714`. | `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts:55`, `:74`. |
| REQ-004 | Pass | Code-graph exclusions include `external` in `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31` through line 48; recursive code graph checks call `shouldIndexForCodeGraph()` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1290`; `specificFiles` uses the canonical path at line 1444. | `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts:62`, `:93`; `.opencode/skill/system-spec-kit/mcp_server/tests/symlink-realpath-hardening.vitest.ts:89`. |
| REQ-005 | Pass | Save-time invalid constitutional tiers are downgraded and audited at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:313` through line 325; stable action strings live at `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:117` through line 121. | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:345`, `:373`, `:396`. |
| REQ-006 | Pass with existing advisory | SQL update guard at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:446` through line 472; post-insert guard at `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:91` through line 116; restore-time guard at `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1312` through line 1356. | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:146`, `:195`; `.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts:124`, `:161`, `:214`. Constitutional README storage-boundary gap remains P1-001 and is not re-flagged. |
| REQ-007 | Pass | Cleanup plan and apply run inside `database.transaction(...)` at `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:429` through line 435; cleanup downgrade audit emission at lines 336-359. | `.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts:46`; checklist live DB evidence remains non-replayable as already covered by P2-002. |
| REQ-008 | Partial | The named runtime surfaces have focused tests, but checklist evidence is mostly file/no-line or command-output evidence. | Checklist evidence quality: 61 checked items; 1 concrete file-line PASS, 40 PARTIAL, 20 FAIL, plus CHK-T15 BLOCKED. P2-002 already covers the generic evidence defect. |
| REQ-009 | Pass | ADR-001 and ADR-002 record A2/B2 decisions at `decision-record.md:36` through line 105. | Checklist lines 66-67 cite the ADRs but without file-line evidence. |
| REQ-010 | Pass | ADR-003 through ADR-012 cover Track B and Wave-2 decisions at `decision-record.md:110` through line 403. | Checklist line 137 cites ADR-001 through ADR-012 but without file-line evidence. |
| REQ-011 | Partial | Cleanup deletes and rewrites ancillary references at `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:310` through line 333. | Checklist line 125 records live duplicate consolidation counts as narrative evidence, not replayable file-line evidence. |
| REQ-012 | Partial with existing P1 | Parser/discovery exclude constitutional README in `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:950`, `:954`, and `:972`; discovery test coverage exists at `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:454`; parser coverage at `.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:336` and `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:301`. | Existing P1-001 remains: storage-layer constitutional path logic still treats README as constitutional-path, not rule-file-only. |
| REQ-013 | Partial | Build/typecheck/test outcomes are recorded in `implementation-summary.md:167` through line 205 and limitations at lines 241-247. | Checklist lines 110-112 are command-output/narrative evidence, not file-line evidence. |
| REQ-014 | Fail | Spec says parent metadata references `010-memory-indexer-invariants` at `spec.md:193`; actual parent metadata references `005-memory-indexer-invariants` at parent `description.json:20` and parent `graph-metadata.json:12`. | New P2-006. |
| REQ-015 | Blocked | Pending live rescan is recorded at `checklist.md:113` and `implementation-summary.md:243`. | CHK-T15 rationale is accurate and not understated: it explicitly requires MCP restart plus embedding-capable `memory_index_scan`; it is a live runtime gate, not a missing local test. |
| REQ-016 | Pass | Operator README documents invariants at `.opencode/skill/system-spec-kit/mcp_server/README.md:113` through line 125. | Checklist line 139 cites the README section but no line number. |

Protocol verdict: partial/fail. Runtime implementation mostly maps to REQ-001..REQ-016, but REQ-014 contradicts current parent metadata and CHK evidence remains weak.

### CORE: `checklist_evidence`

Enumerated 62 checklist items: 61 checked and one pending (`CHK-T15`). Evidence quality:

| Evidence class | Count | Notes |
|---|---:|---|
| PASS: concrete file:line | 1 | `CHK-W2-06` cites `cleanup-index-scope-violations.ts:429-435` at `checklist.md:91`. |
| PARTIAL: file path but no line | 40 | Example: `CHK-B01` names `index-scope.ts`, `memory-index-discovery.ts`, `spec-doc-paths.ts`, and `memory-parser.ts` at `checklist.md:73`, but none with lines. |
| FAIL: narrative or command output | 20 | Examples: `CHK-001` is narrative at `checklist.md:49`; `CHK-T12` and `CHK-T13` record only exit-code summaries at lines 110-111. |
| BLOCKED | 1 | `CHK-T15` at `checklist.md:113`; rationale accurately states MCP restart plus embedding-capable scan requirement. |

Protocol verdict: fail, already tracked by P2-002. This pass quantifies the scope and confirms `CHK-T15` is honestly blocked rather than understated.

### OVERLAY: `feature_catalog_code`

Status: partial. The catalog has a real capability entry at `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:25`, and the root catalog includes it in the split corpus. Claims are mostly consistent with post-Wave-2 behavior: shared helper, `z_future`/`external`, symlink realpath, README exclusion, cleanup CLI, and walker cap are all represented. Gaps: stale packet/ADR identifiers and missing explicit stable cleanup action/helper names. See P2-007.

### OVERLAY: `playbook_capability`

Status: fail/advisory. Existing broad scenario: `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:17` through line 55. Missing first-class playbook scenarios for cleanup `--apply`, checkpoint restore validation, walker DoS adversarial inputs, and non-save constitutional-tier promotion bypasses. See P2-008.

### Inventory Drift Cleanup

Confirmed drift outside the strategy artifact:

- `spec.md:193` still says parent metadata should reference `010-memory-indexer-invariants`.
- `implementation-summary.md:42` still sets `Spec Folder` to `010-memory-indexer-invariants`.
- `checklist.md:149` says docs live at `010-memory-indexer-invariants/` root; line 150 says parent metadata references `010-memory-indexer-invariants`.
- `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` still use prose `code-graph` references, while actual on-disk code lives under `.opencode/skill/system-spec-kit/mcp_server/code_graph/`. The strategy-local version is already P2-001; root-doc cleanup should avoid propagating the stale path form into future evidence.

### ADR ↔ Implementation Mapping

| ADR | Status | Implementation evidence |
|---|---|---|
| ADR-001 | Pass | `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:77` through line 95. |
| ADR-002 | Pass | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:420`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2420` through line 2429. |
| ADR-003 | Pass | `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25` through line 48; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2714`. |
| ADR-004 | Pass | Cleanup deletes forbidden rows at `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:332` through line 334. |
| ADR-005 | Pass | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:313` through line 325. |
| ADR-006 | Partial | Discovery/parser tests cover README exclusion, but storage-boundary README gap remains P1-001. |
| ADR-007 | Pass | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:446` through line 472; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:91` through line 116; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1312` through line 1356. |
| ADR-008 | Pass | `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:336` through line 359. |
| ADR-009 | Pass | `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:76` through line 80; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:112` and `:279`. |
| ADR-010 | Pass | `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:36` through line 41; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1431` through line 1445. |
| ADR-011 | Pass | `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:429` through line 435. |
| ADR-012 | Pass with traceability cleanup | `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:117` through line 121 and `:372` through line 395. Runtime comments cite the wrong packet; see P2-009. |

No ADR appears silently superseded without note. ADR-006 explicitly states it supersedes the earlier README-indexing decision at `decision-record.md:222`.

### Test ↔ Invariant Mapping

The focused test set maps cleanly to most invariants:

- `pe-orchestration.vitest.ts`: REQ-001 cross-file `UPDATE`/`REINFORCE` downgrade.
- `handler-memory-index.vitest.ts`: REQ-002 `fromScan`; constitutional README discovery; non-scan controls.
- `index-scope.vitest.ts`: REQ-003/REQ-004 helper and scanner exclusions.
- `memory-save-index-scope.vitest.ts`: REQ-005 save-time tier downgrade and scan-originated downgrade.
- `memory-crud-update-constitutional-guard.vitest.ts`: REQ-006 update mutation surface.
- `checkpoint-restore-invariant-enforcement.vitest.ts`: REQ-006 restore atomicity and tier downgrade.
- `cleanup-script-audit-emission.vitest.ts`: REQ-007 cleanup audit durability.
- `exclusion-ssot-unification.vitest.ts`: ADR-009 / SSOT unification.
- `symlink-realpath-hardening.vitest.ts`: ADR-010 realpath hardening for save and code graph.
- `walker-dos-caps.vitest.ts`: walker cap behavior, but operator observability remains P2-003.
- `memory-governance.vitest.ts`: shared audit action string coverage.

Confirmed existing test gaps without re-flagging: no storage-layer test for constitutional README as a non-indexable file (P1-001), no test for chunking helper fallback post-insert guard (P2-005), and no test asserting walker cap warnings are observable through MCP/code-graph responses rather than only logs (P2-003).

## Claim Adjudication Packets

No new P0/P1 findings, so no claim-adjudication packet is required for this iteration.

## Verdict

CONDITIONAL. Cumulative findings remain `P0=0`, `P1=1`, and now `P2=9`. The traceability pass found no new release-blocking runtime contradiction, but the packet has clear post-merge identity drift, catalog/playbook overlay gaps, and runtime ADR breadcrumb drift.

## Next Dimension

Iteration 4 should focus on D4 Maintainability: SSOT import shape, cleanup CLI testability under future schema changes, governance audit helper extensibility, and operator documentation clarity after the traceability cleanup above.
