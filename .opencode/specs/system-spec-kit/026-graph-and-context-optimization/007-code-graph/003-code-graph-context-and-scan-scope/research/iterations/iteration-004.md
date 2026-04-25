# Iteration 004 - Implementation Plan, Risk Register, Acceptance Criteria

## Focus

Define the implementation hand-off for the `code_graph_scan` regression discovered after packet 012:

- G1: Decide where the remediation packet should live.
- G2: Produce sequenced implementation tasks ready for `tasks.md`.
- G3: Register rollout risks and mitigations.
- G4: Define acceptance criteria.
- G5: Provide a concise operator runbook.

No production code was changed in this iteration.

## Actions Taken

1. Loaded `sk-deep-research` and `system-spec-kit` workflow guidance.
2. Read the Level 2/3 template guidance and sub-folder versioning rules.
3. Inspected the current `007-deep-review-remediation/` topology and packet 012 docs.
4. Re-read iteration 003 and the active `deep-research-state.jsonl`.
5. Anchored implementation task line references against current code in:
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`

## Spec Folder Decision

Decision: host the fix as a nested remediation packet under packet 012:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/
  007-deep-review-remediation/
    012-code-graph-context-and-scan-scope/
      002-incremental-fullscan-recovery/
```

Rationale:

- Packet 012 introduced the `.gitignore`-aware walk and new scan excludes, and the failure is a direct behavioral remediation of that packet rather than an independent campaign item.
- `system-spec-kit` says spec folders may be nested as coordination-root packets with child phase folders, and the sub-folder versioning guide explicitly supports returning to old work, separating implementation iterations, and preserving historical context.
- The current campaign already contains sibling `006-claude-hook-findings-remediation`, so a new sibling named `013-code-graph-scan-incremental-flag-fix` would collide. A new sibling would need to be `014-...`, but that would make the remediation look independent of packet 012.
- A nested `002-...` preserves packet 012 as the completed original implementation and records this as the second temporal iteration. Existing root docs do not need to be moved.

Recommended documentation level: Level 3.

Reason: the production diff is small, but the fix changes scan semantics, graph pruning behavior, operator-facing response fields, and DB recovery expectations. Level 3 is justified by the architecture decision and risk matrix requirements; the system-spec-kit templates state Level 3 adds architecture decisions, ADRs, and risk documentation over Level 2 verification.

Canonical spec-doc skeleton:

| File | Skeleton |
|---|---|
| `spec.md` | Metadata; Problem & Purpose; Scope; Requirements; Success Criteria; Risks & Dependencies; Open Questions; Acceptance Scenarios. Must state non-goals: no VACUUM automation, no richer parser identity, no production DB rebuild during implementation. |
| `plan.md` | Summary; Quality Gates; Architecture; Implementation Phases; Testing Strategy; Dependencies; Rollback Plan. Must explain `incremental`, `effectiveIncremental`, `fullReindexTriggered`, and stale-gate interactions. |
| `tasks.md` | Ordered task list below, grouped as preflight, code, tests, docs, build, runtime verification. Include evidence placeholders for each completed task. |
| `checklist.md` | P0: full-scan mode indexes all post-exclude files; duplicate symbol IDs do not raise UNIQUE errors; response fields are present. P1: idempotence; status/query/context smoke tests; build and focused Vitest pass. P2: README operator clarity and duplicate-count visibility. |
| `decision-record.md` | ADR-001: nested packet under `012` vs new sibling `014`; ADR-002: `IndexFilesOptions.skipFreshFiles` default `true`; ADR-003: `capturesToNodes()` first-seen dedupe vs line-suffixed IDs or signature-aware identities. |
| `implementation-summary.md` | Created after implementation only. Include final file counts, scan duration, dropped duplicate count, validation commands, and residual follow-ups. |

Ruled out:

- `007-deep-review-remediation/013-code-graph-scan-incremental-flag-fix/`: rejected because sibling `006-claude-hook-findings-remediation` already exists.
- Amending packet 012 root docs in place only: rejected because packet 012 is already completed and the new fix needs its own task/checklist evidence and ADR trail.
- New sibling `014-code-graph-scan-incremental-flag-fix/`: viable fallback if nested packets are operationally inconvenient, but less precise than nesting under the packet that introduced the regression.

## Implementation Tasks

| ID | Type | File / Anchor | Change | Expected Diff | Dependency |
|---|---|---|---|---:|---|
| T-001 | doc | `012-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/` | Create Level 3 packet from `templates/level_3/`; adapt spec, plan, tasks, checklist, decision-record. | docs only | none |
| T-002 | test | `code-graph/tests/code-graph-scan.vitest.ts:7-24` | Extend `indexFilesMock` assertions to cover options argument. | <=12 lines | T-001 |
| T-003 | code | `code-graph/lib/structural-indexer.ts:1227` | Add `IndexFilesOptions` interface and optional `options` parameter with `skipFreshFiles = true`. | <=8 lines | T-002 red/green target |
| T-004 | code | `code-graph/lib/structural-indexer.ts:1246-1249` | Apply stale-file gate only when `skipFreshFiles` is true. | <=3 lines | T-003 |
| T-005 | code | `code-graph/handlers/scan.ts:183` | Call `indexFiles(config, { skipFreshFiles: effectiveIncremental })`. | 1 line | T-003/T-004 |
| T-006 | code | `code-graph/lib/structural-indexer.ts:796-812` | Deduplicate generated `symbolId`s in `capturesToNodes()` using `seenSymbolIds`, preserving first-seen node and module node behavior. | <=12 lines | T-001 |
| T-007 | code | `code-graph/handlers/scan.ts:21-33,248-261` | Add additive response fields `fullScanRequested` and `effectiveIncremental`. | <=8 lines | T-005 |
| T-008 | test | `tests/structural-contract.vitest.ts` or `tests/tree-sitter-parser.vitest.ts` | Add 3 `indexFiles()` option tests: false returns all post-exclude files; true skips fresh files; omitted preserves stale-only default. | ~90 lines | T-003/T-004 |
| T-009 | test | `code-graph/tests/code-graph-scan.vitest.ts:85-168` | Add scan handler integration test: `incremental:false` passes `skipFreshFiles:false`, emits `fullScanRequested:true`, `effectiveIncremental:false`. | ~45 lines | T-005/T-007 |
| T-010 | test | `tests/tree-sitter-parser.vitest.ts` | Add `capturesToNodes()` duplicate-symbol regression test using duplicate captures from the same file/kind/fqName. | ~25 lines | T-006 |
| T-011 | doc | `code-graph/README.md:165-183` | Update scan behavior matrix with `fullScanRequested`, `effectiveIncremental`, and note `filesScanned` means parsed/persisted result count, not discovered candidates. | <=18 lines | T-007 |
| T-012 | build | `.opencode/skill/system-spec-kit/mcp_server/` | Run `npm run build`. | none | T-003 through T-011 |
| T-013 | verify | MCP runtime | Restart MCP server; run full scan; assert `filesScanned >= 1000`, zero `errors[]`, and new response fields. | none | T-012 |
| T-014 | verify | MCP runtime | Run `code_graph_status`, `code_graph_query`, and `code_graph_context` smoke checks against the larger graph. | none | T-013 |
| T-015 | doc | nested packet docs | Update tasks/checklist/implementation-summary with evidence, including dropped duplicate count and scan duration. | docs only | T-013/T-014 |

Ordering rationale:

- Start with the nested packet and red/green test scaffolding so the small production changes are pinned to observable behavior.
- Fix the stale-gate semantics before handler fields because handler behavior depends on `effectiveIncremental` being passed into `indexFiles()`.
- Apply parser dedupe independently after the scan-mode patch; it fixes the UNIQUE constraint blocker that would otherwise poison the full-scan acceptance run.
- Add response-field docs only after field names are final.
- Run build before MCP restart so compiled `dist` output and runtime behavior match.
- Perform runtime acceptance last because it is the highest-cost and highest-signal verification.

## Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---:|---:|---|
| R1 | Adding `IndexFilesOptions` breaks downstream callers that use `Parameters<typeof indexFiles>`. | L | M | Make the second parameter optional and default `skipFreshFiles` to `true`; existing one-arg calls and inferred parameter tuples remain backward-compatible for normal usage. |
| R2 | Dedup in `capturesToNodes()` silently drops legitimately distinct symbols such as overload signatures or same-name lexical closures. | M | M | Preserve first-seen node, emit debug/diagnostic count with file:line for dropped duplicates, and add regression coverage for known overload-like patterns. Record semantic identity improvements as a follow-up, not this crash fix. |
| R3 | Full scan grows from 33 files back to roughly the post-exclude active set (~1425 observed in iter-1), increasing scan duration and query graph size. | M | H | Measure duration in T-013; smoke `code_graph_query`, `code_graph_context`, and `code_graph_status`; keep acceptance range at 1000-3000 files; do not claim success if query/context latency or response shape regresses. |
| R4 | Existing consumers parse scan response strictly and reject additive `fullScanRequested` / `effectiveIncremental` fields. | L | M | Keep `fullReindexTriggered` unchanged and add fields only inside the existing data object; document as additive response metadata. |
| R5 | The existing 473MB DB still contains stale rows from the old 26K-file scan; full scan may reinsert correctly but not shrink file size without VACUUM. | M | M | Full scan with `incremental:false` prunes tracked files absent from results; document that SQLite file size requires separate VACUUM if storage size matters. VACUUM remains out of implementation scope. |
| R6 | The three originally erroring files now succeed by dropping duplicates, but their graph is less complete. | H | M | Quantify dropped duplicates during acceptance. Expected affected files: `structural-indexer.ts`, `tree-sitter-parser.ts`, `working-set-tracker.ts`; exact dropped-node count is UNKNOWN until instrumentation/test scan runs. |
| R7 | `filesScanned` remains operator-ambiguous because it reports parsed result count, not discovered candidate count. | H | L | Add README clarification now; defer separate discovered-vs-parsed counts unless operators need it. Do not expand this fix beyond additive response fields. |
| R8 | `ensure-ready.ts` keeps stale-only default and may appear inconsistent with explicit full scans. | M | L | Document the distinction: read-path readiness is bounded selective repair; explicit `code_graph_scan({incremental:false})` is the user-requested full rebuild path. Existing default is intentional. |
| R9 | Logging duplicate drops could create noisy output on large scans. | M | L | Gate detailed duplicate logs behind debug mode or aggregate by file with a compact summary; acceptance needs counts, not noisy per-symbol logs by default. |
| R10 | Tests that mock `indexFiles()` only by arity may fail after the second argument is introduced. | M | M | Update focused scan handler tests first and search for `indexFilesMock` / `toHaveBeenCalledWith` after implementation. |

## Acceptance Criteria

- [ ] AC-1: `mcp__spec_kit_memory__code_graph_scan({"rootDir":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public","incremental":false})` returns `status:"ok"` and `data.filesScanned >= 1000`.
- [ ] AC-2: The scan response includes `data.fullScanRequested === true` and `data.effectiveIncremental === false`.
- [ ] AC-3: The scan response has `data.errors.length === 0`.
- [ ] AC-4: `code_graph_status` reports `totalFiles` in the `[1000, 3000]` range after the full scan.
- [ ] AC-5: Re-running `code_graph_scan` immediately with the same `rootDir` and `incremental:false` returns the same `code_graph_status.totalFiles` range and no errors.
- [ ] AC-6: Existing focused Vitest suites pass, including structural contract and tree-sitter parser suites; expected baseline after packet 012 was 20 tests across those two files, and new tests should raise that count.
- [ ] AC-7: New tests exist: at least 3 `indexFiles` option tests, 1 scan handler integration test, and 1 duplicate-symbol regression test.
- [ ] AC-8: `code_graph_query`, `code_graph_context`, and `code_graph_status` response shapes remain backward-compatible and pass smoke checks against the larger graph.
- [ ] AC-9: `npm run build` passes in `.opencode/skill/system-spec-kit/mcp_server/`.
- [ ] AC-10: The implementation summary records scan duration, total files, total nodes, total edges, and duplicate symbols dropped by file.

Acceptance coverage gaps:

- ACs do not prove semantic completeness for overloads or lexical-scope collisions; they only prove the graph no longer crashes and remains queryable.
- ACs do not require DB file-size reduction; SQLite `VACUUM` is deliberately out of scope.
- ACs do not benchmark hard latency thresholds for query/context tools; they require smoke compatibility and should record observed timing if available.

## Operator Runbook

After deployment, restart the Spec Kit Memory MCP server so compiled handler/indexer changes are loaded. Then run:

```json
mcp__spec_kit_memory__code_graph_scan({
  "rootDir": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
  "incremental": false
})
```

Expected response shape diff: `data.fullReindexTriggered` remains present and unchanged; `data.fullScanRequested:true` and `data.effectiveIncremental:false` are new additive fields; `data.filesScanned` should be at least 1000, `data.errors` should be empty, and readiness should report a full-scan style action. Follow with `code_graph_status` and expect `totalFiles` in the active-code range of 1000-3000. If the SQLite DB file is still large after successful pruning, run a separate VACUUM only if disk size matters; the pruning correctness does not depend on VACUUM.

## Questions Answered

1. The fix should live under packet 012 as `002-incremental-fullscan-recovery`, not as a colliding sibling `013`.
2. The implementation order should patch scan-mode semantics first, then parser dedupe, then additive response clarity, then docs/build/runtime acceptance.
3. The highest rollout risk is not code size; it is restoring the graph to ~1000-3000 files without query/context regressions.
4. Acceptance must include an actual `incremental:false` MCP scan and post-scan status/query/context smoke checks.
5. VACUUM is operationally useful for file size but out of scope for the correctness fix.

## Questions Remaining

- Exact duplicate-symbol drop counts per file are UNKNOWN until the patched scan emits diagnostics or a targeted test fixture measures them.
- Actual post-fix full-scan duration is UNKNOWN; the previous 47s scan only indexed 33 files after the stale-gate bug, so it is not predictive.
- Whether to add discovered candidate counts to the scan response remains a P2 follow-up, not part of this fix unless operator confusion persists.

## Next Focus

Iteration 5 should converge the research loop: validate this hand-off against the final state, decide whether discovered-vs-parsed counts belong in the implementation packet or a deferred follow-up, and prepare the final synthesis with the nested packet path, task plan, risk register, and acceptance criteria.
