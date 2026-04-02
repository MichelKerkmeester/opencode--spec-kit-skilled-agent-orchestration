---
title: Deep Review Strategy - Spec 024 Compact Code Graph
description: Runtime strategy tracking review progress, dimension coverage, findings, and outcomes across iterations.
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Tracks the deep review session for spec 024 - Hybrid Context Injection (Hook + Tool Architecture). Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

---

## 2. TOPIC
Review of Hybrid Context Injection - Hook + Tool Architecture. This spec implements Claude Code hooks (PreCompact, SessionStart, Stop) for automated context preservation, with tool-based fallback for non-hook runtimes, plus Code Graph structural indexing and CocoIndex semantic bridge integration.

**Spec folder:** `.opencode/specs/02--system-spec-kit/024-compact-code-graph/`

**Key implementation files:**
- Hook scripts: `mcp_server/hooks/claude/` (compact-inject.ts, session-prime.ts, session-stop.ts, hook-state.ts, shared.ts, claude-transcript.ts)
- Code graph tools: `mcp_server/tools/code-graph-tools.ts`
- Architecture: `mcp_server/lib/architecture/layer-definitions.ts`
- Memory surface: `mcp_server/hooks/memory-surface.ts`
- Tool schemas: `mcp_server/tool-schemas.ts`
- Tool index: `mcp_server/tools/index.ts`
- Context handler: `mcp_server/handlers/memory-context.ts`
- Claude recovery: `.claude/CLAUDE.md`

---

## 3. REVIEW DIMENSIONS (coverage)
- [x] D1 Correctness - Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security - Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability - Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability - Patterns, clarity, documentation quality, safe follow-on change cost

---

## 4. NON-GOALS
- Performance benchmarking or profiling
- UI/UX review (no user-facing UI)
- Cross-browser or cross-platform testing
- Reviewing the deep research iterations (55 files) - only the final implementation matters

---

## 5. STOP CONDITIONS
- All 4 dimensions reviewed at least once
- 10 iterations reached (hard cap)
- Convergence: newFindingsRatio < 0.10 for 2+ consecutive iterations after all dimensions covered

---

## 6. COMPLETED DIMENSIONS
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | FAIL | 003, 006 | Hook-cache lifecycle and code-graph implementation both contain correctness defects that require remediation before release confidence is credible; iteration 006 re-validated that normal Stop events still skip all post-stop work and the reachable Stop branch still never performs the required save. |
| D2 Security | FAIL | 002 | Transcript-derived text is replayed as trusted hook recovery output, and code-graph tools bypass centralized schema validation for scan-scope inputs. |
| D3 Traceability | FAIL | 004 | Parent spec/checklist claims and source references drift from the reviewed hook implementation and current module paths. |
| D3 Traceability Deep Dive | FAIL | 008 | The retargeted phase audit confirmed that phases 004 and 007 correspond to real implementation, while phases 005, 006, 011, and 012 still overstate shipped behavior through stale command truth, inaccurate docs, unwired working-set tracking, and partial CocoIndex integration. |
| D4 Maintainability | FAIL | 009 | The library-core deep dive found silent DB-failure downgrades in seed resolution, a dead duplicated `TESTED_BY` branch in the structural indexer, and an `excludeGlobs` scan option that never reaches the walker. |
| D1 Correctness | FAIL | 007 | Budget/merge follow-up found two new P1 budget-integrity defects plus two smaller correctness gaps in working-set cap enforcement and default `.zsh` discovery. |
| D4 Maintainability | CONDITIONAL | 010 | Final hook-integration review verified that Claude hook registration and `hooks/index.ts` exports are wired correctly, but found two remaining D4 drifts: recovery guidance is split across root vs Claude docs, and token-count synchronization is duplicated between `response-hints.ts` and the shared envelope layer. |
| D1 Correctness | FAIL | 012 | Re-verification against the current Stop-hook and transcript parser confirmed that the `stop_hook_active === false` early return, the `pendingCompactPrime` pseudo-save branch, and the cache-token accounting gap all remain active with no severity change. |
| D1 Correctness Re-verification | FAIL | 011 | Current-code re-verification of `compact-inject.ts`, `session-prime.ts`, and `hook-state.ts` confirmed F001-F004 remain accurate without severity changes and did not uncover an additional hook-slice correctness defect. |
| D2 Security Re-verification | FAIL | 013 | Current-code re-verification confirmed F009 remains fully active, while F010 changed only in that schema declarations/helpers now exist on paper; the live dispatch path still bypasses them and still accepts caller-controlled `rootDir` into `handleCodeGraphScan()`. |
| D3 Traceability Re-verification | FAIL | 014 | Current-code/doc re-verification confirmed the 3-source hook-merge overclaim, obsolete hook-path references, and partial phase completion drift for 005/006/011/012 all remain active; Phase 008 narrowed because its checklist now acknowledges the regex parser, but the spec/parent phase table still advertise tree-sitter. |
| D4 Maintainability Re-verification | CONDITIONAL | 017 | Re-verification confirmed F014-F017 and F019 remain active without severity change; F018 narrowed to overlapping recovery authority between the root and Claude-specific docs rather than a wholly separate hook contract. |
| D1 Correctness Re-verification | FAIL | 015 | Current-code re-verification confirmed F011-F013 remain active and uncovered one more live budget-integrity defect: `mergeCompactBrief()` still bypasses `totalBudget` for `sessionState`, so the final brief can exceed the caller budget even when the allocator output looks valid. |
| D1 Correctness Re-verification | FAIL | 016 | Re-verification confirmed F005-F008 unchanged and added F021: the live `code_graph_scan` path still throws on a fresh runtime because the production tool path never initializes the code-graph DB before stale checks. |
| D3 Traceability Re-verification | FAIL | 018 | Narrow re-verification of phases 005/006/011/012 found no material improvement since iteration 014: each phase still has partial real delivery, but each checked completion status remains overstated against the current command, documentation, compaction, and CocoIndex runtime evidence. |
| D2 Security Fresh hook-state temp-file audit | FAIL | 020 | Fresh hook-state review added one major session-isolation defect and one confidentiality advisory: lossy session-id filename sanitization can alias distinct sessions into one state file, and the temp JSON still persists assistant summaries/recovery payloads without explicit restrictive permissions. |
| D1 Correctness Re-verification | FAIL | 021 | Fresh `code-graph-db.ts` audit confirmed F007 unchanged and added two DB-safety defects: `initDb()` has no durable schema/migration guard and leaves a poisoned singleton after setup failure, and the delete-then-insert refresh path is not atomic, so constraint errors can erase a file's existing graph rows. |
| D3 Traceability Decision-Record Audit | FAIL | 022 | DR-001/002/003 still match the current manifests and runtime wiring, but DR-004 is stale: the packet now operates as a 12-phase plan without an explicit decision-record supersession for the original 4-phase decomposition. |
| D1 Correctness Handler Dive | FAIL | 023 | Handler-only pass confirmed F021 and F006 unchanged and added F026: `code_graph_query` transitive traversal still emits nodes beyond `maxDepth` and duplicates converging-path nodes. |
| D2 Security Handler Re-verification | CONDITIONAL | 024 | Fresh `memory_context` handler audit added no new D2 issue: unlike `code_graph_*`, the live path still validates `memory_context` args and corroborates session reuse, no code-execution sink was found on `input`, and the only still-open concern in this slice is the previously observed raw internal error-text/details echo. |
| D4 Maintainability Test Coverage Audit | CONDITIONAL | 025 | Fresh Vitest inventory found direct coverage for only 4/6 `hooks/claude/*.ts` files and 6/10 `lib/code-graph/*.ts` files; most `F001`-`F019` failure paths remain untested, and several hook-named suites now cover helpers rather than the named live entrypoints. |
| D3 Traceability Hook Registration Audit | CONDITIONAL | 026 | Fresh hook-registration pass confirmed all three Claude lifecycle hooks are registered and the live `mcp_server/dist/hooks/claude/*` paths exist, but added `F030` because the parent spec still describes source-scoped `SessionStart(...)` matcher wiring that `.claude/settings.local.json` does not declare. |
| D1 Correctness Convergence Sweep | FAIL | 027 | Backfilled convergence sweep over the remaining lightly reviewed helper/core files found one more live public-contract defect: `code_graph_context` still advertises `includeTrace` trace metadata in the schema and Phase 010 packet, but the handler/library path never emits any trace payload. The same pass did not uncover an additional D1 issue in `runtime-detection.ts`, `mutation-feedback.ts`, `response-hints.ts`, or the `lib/code-graph/index.ts` barrel. |
| D3 Parent Checklist Convergence Audit | FAIL | 029 | Retrospective convergence pass sampled 18 checked parent checklist items and found `12 VERIFIED`, `5 PARTIAL`, and `1 UNVERIFIED`; it did not mint a new finding ID, but it confirmed the parent `checklist_evidence` mismatch now includes the still-unimplemented Claude `session_id` -> Spec Kit session bridge claim. |
| D4 Maintainability Final Convergence | CONDITIONAL | 030 | Final barrel/export/pattern pass found no new missing-export defect, but added `F032` because `session-prime.ts` still keeps a drifted private pressure-budget helper instead of reusing the shared tested helper in `hooks/claude/shared.ts`. |

---

## 7. RUNNING FINDINGS
- **P0 (Critical):** 0 active
- **P1 (Major):** 10 active (was 16; v2 remediation fixed F003, F005, F006, F007, F008, F009, F011, F012, F013, F014, F015, F016, F017, F018, F019, F021, F023, F024, F025, F026, F027, F028, F032; new F030-F035, F041 added)
- **P2 (Minor):** 14 active (was 16; v2 remediation fixed F004, F025; new F029, F036-F040, F042-F044 added)
- **Delta iterations 031-040:** +7 P1 new (F030-F035, F041), +8 P2 new (F029, F036-F040, F042-F044), 24 fixes verified, 3 partial fixes
- **Provisional verdict:** `CONDITIONAL` (improved — 24 of 33 original findings fixed)
- **Iteration-note:** iteration 011 was a D1 re-verification pass on the current hook code; it confirmed F001-F004 unchanged and did not add new findings.
- **Iteration-note 2:** iteration 013 was a D2 re-verification pass on the current hook/code-graph dispatch code; it confirmed F009 unchanged and F010 as changed-but-still-active because schema declarations now exist but are still not enforced on the live runtime path.
- **Iteration-note 3:** iteration 014 was a D3 re-verification pass on the current parent spec, checklists, phase specs, and runtime/docs. It confirmed the earlier traceability findings remain active, narrowed the Phase 008 mismatch to spec/title truth rather than checklist truth, and added one new P2 on the parent spec still mixing historical pre-hook status with current runtime state.
- **Iteration-note 4:** iteration 017 was a D4 re-verification pass on the current code-graph helpers, token-count serialization path, and recovery docs. It confirmed F014-F017 and F019 unchanged and narrowed F018 from broad "divergent recovery guidance" to the smaller duplicated-authority problem of overlapping manual-recovery entry points.
- **Iteration-note 5:** iteration 015 was a D1 re-verification pass on `budget-allocator.ts`, `compact-merger.ts`, and `working-set-tracker.ts`; it confirmed F011-F013 unchanged and added F020 because `sessionState` still bypasses allocation entirely.
- **Iteration-note 6:** iteration 016 was a D1 re-verification pass on the current code-graph stack. It confirmed F005-F008 unchanged and added F021 after a fresh-runtime repro showed `code_graph_scan` still throws before indexing because the live tool path never initializes the code-graph DB.
- **Iteration-note 7:** iteration 018 was a narrower D3 re-verification pass over phases 005/006/011/012 only. It added no new findings and reconfirmed that each phase still includes partial real implementation, but each checked completion status remains inaccurate.
- **Iteration-note 8:** iteration 019 was a D1 re-verification pass over `memory-surface.ts`, `hooks/index.ts`, and the Claude `compact-inject.ts` / `session-prime.ts` integration path. It confirmed the helper-level `autoSurfaceAtCompaction()` contract and budget enforcement on the MCP tool path, but added F022 because the live Claude hook path bypasses `memory-surface.ts` entirely and therefore never carries constitutional/triggered auto-surface payloads across compaction.
- **Iteration-note 8.5:** iteration 020 was a fresh D2 hook-state temp-file audit. It added F027 because lossy `session_id` filename sanitization can alias distinct sessions onto one state file with no exact-match `claudeSessionId` check on load/merge, and F028 because the temp JSON persists assistant summaries and compact-recovery payloads without explicit restrictive `0700`/`0600` permissions.
- **Iteration-note 9:** iteration 021 was a D1 deep dive on `code-graph-db.ts`. It confirmed F007 unchanged and added F023 because `initDb()` never persists or validates schema version state and leaves a poisoned cached handle behind after setup failure, plus F024 because `replaceNodes()` / `replaceEdges()` delete old rows outside their insert transactions and can therefore erase a file's graph on constraint errors.
- **Iteration-note 10:** iteration 022 was a D3 decision-record audit over DR-001 through DR-004. It confirmed DR-001/002/003 still match the shipped manifests and runtime wiring, found no post-DR-004 numbering gap because DR-005 through DR-012 already exist, and added F025 because DR-004 was never superseded after the packet expanded to 12 phases.
- **Iteration-note 11:** iteration 023 was a D1 handler-only pass over `scan.ts`, `query.ts`, `context.ts`, and `status.ts`. It reconfirmed the already-known scan-init and context-seed defects and added F026 because the transitive `code_graph_query` path still leaks nodes beyond `maxDepth` and duplicates converging-path nodes.
- **Iteration-note 12:** iteration 024 was a D2 handler-only pass over `memory-context.ts`, `tool-schemas.ts`, and the live dispatch/session helpers. It added no new finding: `memory_context` still routes through `tools/context-tools.ts` validation, resumed sessions remain corroboration-bound via `resolveTrustedSession(...)`, no code-execution sink was found on `input`, and the only still-open issue in this slice is the previously observed raw internal error-text/details echo.
- **Iteration-note 13:** iteration 025 was a D4 coverage audit over the current Vitest surface. It added F029 because only 4/6 Claude hook scripts and 6/10 code-graph library files have direct test imports, while several hook-named suites now exercise helpers instead of the named live entrypoints.
- **Iteration-note 14:** iteration 026 was a D3 hook-registration traceability pass over `.claude/settings.local.json`, the parent spec architecture section, and the live Claude hook entrypoints. It confirmed all three lifecycle hooks are registered against real compiled scripts, re-confirmed the older stale path drift, and added F030 because the spec's `SessionStart(source=...)` matcher phrasing does not map one-to-one to the shipped single-entry `SessionStart` registration; source routing lives inside `session-prime.ts`.
- **Iteration-note 15:** iteration 027 was a D1 convergence sweep over the remaining lightly reviewed helper/core files. It added F033 because `code_graph_context` still advertises trace metadata behind `includeTrace` in both the live tool schema and Phase 010 packet, but the handler/library path never emits any trace payload; the same pass did not uncover a separate D1 defect in `runtime-detection.ts`, `mutation-feedback.ts`, `response-hints.ts`, or the `lib/code-graph/index.ts` barrel.
- **Iteration-note 16:** iteration 028 was the final D2 handler convergence sweep across all requested entry points. It added F031 because `ccc_feedback` still persists caller-controlled `comment` / `resultFile` strings to disk without schema or generic length bounds, while the rest of the sweep added no new arbitrary-file-read, auth, or command-injection issue beyond the previously tracked surfaces.
- **Iteration-note 17:** iteration 029 was a retrospective D3 parent-checklist convergence pass. It sampled 18 checked parent checklist items and found `12 VERIFIED`, `5 PARTIAL`, and `1 UNVERIFIED`; it added no new finding ID, but it confirmed the existing `checklist_evidence` drift now explicitly includes the unchecked-in-runtime Claude `session_id` -> Spec Kit session bridge claim.
- **Iteration-note 18:** iteration 030 was the final D4 convergence pass over the reviewed barrel exports and hook/code-graph integration surfaces. It confirmed the hook/tool/code-graph barrels remain wired correctly, but added F032 because `session-prime.ts` still maintains a private pressure-budget helper that has already drifted from the shared, tested `calculatePressureAdjustedBudget(...)` helper in `hooks/claude/shared.ts`.
- **Normalization note:** the live running summary now carries the iteration-014 parent-spec P2, the new iteration-015 compact-merger P1, the new iteration-016 scan-init P1, the new iteration-019 hook-path split P1, the new iteration-020 hook-state isolation/confidentiality findings, the new iteration-021 DB lifecycle/atomicity P1s, the new iteration-022 decision-record supersession P2, the new iteration-023 transitive-query P1, the new iteration-025 coverage P2, the new iteration-026 hook-registration matcher P2, the new iteration-027 trace-metadata contract P1, the new iteration-028 `ccc_feedback` persistence P2, and the new iteration-030 pressure-budget-ownership P2, so this strategy tracks 0 P0, 16 P1, and 16 P2 pending remediation.
- **Correctness note:** The hook/runtime slice still has cache-lifecycle defects in `session-prime.ts` and `hook-state.ts`, and the code-graph library still has symbol-range, seed-mapping, stale-edge, JS/TS method-indexing, and fresh-runtime scan-initialization blockers.
- **Correctness note 2:** The compact helper slice now carries three separate budget-contract breaks: `allocateBudget()` cannot spend caller budgets above 4000, `mergeCompactBrief()` can overflow granted sections while still rendering zero-budget sources, and the same merger never budgets `sessionState` at all. The supporting utilities also have two smaller correctness gaps: `WorkingSetTracker` does not enforce `maxFiles` immediately, and the default indexer config never discovers `.zsh` files even though `detectLanguage()` claims support.
- **Correctness note 3:** Iteration 006 confirmed the earlier Stop-hook control-flow cluster without exposing a new `memory-surface` runtime defect. The Claude Stop hook still exits on ordinary `stop_hook_active=false` payloads, and the reachable branch still uses `pendingCompactPrime` as a pseudo save bookmark instead of persisting context.
- **Correctness note 4:** Iteration 012 re-verified the same current-code slice in `session-stop.ts`, `claude-transcript.ts`, and `shared.ts`: the Stop-hook guard still exits on `stop_hook_active === false`, the reachable branch still overloads `pendingCompactPrime` instead of saving context, and transcript accounting still excludes cache token buckets from `totalTokens` and `estimateCost()`.
- **Correctness note 5:** Iteration 019 split the compaction story into two separate paths: the MCP tool-dispatch path does call `autoSurfaceAtCompaction()` and returns the expected `AutoSurfaceResult`, but the live Claude `PreCompact` / `SessionStart` hook pair never imports that helper and still hardcodes empty `constitutional` / `triggered` slots into the cached compaction payload.
- **Correctness note 6:** Iteration 021 showed the DB layer itself still has two release-relevant safety gaps beyond F007/F021: `initDb()` only reports the hard-coded `SCHEMA_VERSION` constant and never rolls back its cached singleton on setup failure, and the per-file node/edge replacement helpers delete old rows before opening their insert transactions, so a single constraint error can wipe an indexed file's prior graph snapshot.
- **Correctness note 7:** Iteration 023 narrowed the remaining handler-local D1 surface: `code_graph_status` and the top-level `code_graph_context`/`code_graph_query` error paths still return structured payloads, but the transitive `code_graph_query` traversal is not contract-correct because it appends nodes beyond `maxDepth` and can duplicate converging-path nodes before they are marked visited.
- **Correctness note 8:** Iteration 027 closed one more light-review gap in `code_graph_context.ts`: the shipped schema and Phase 010 packet still advertise trace metadata when `includeTrace=true`, the handler still forwards the flag, but `ContextResult` has no trace field and `buildContext()` never branches on `includeTrace`, so the promised debug payload is still absent at runtime.
- **Security note:** The D2 passes now establish four distinct security surfaces: transcript-derived compact payload replay without provenance fencing (`F009`), runtime schema-bypass on the code-graph tool path (`F010`), cross-session hook-state aliasing from lossy filename sanitization (`F027`), and permission-dependent confidentiality for on-disk hook-state JSON (`F028`).
- **Security note 2:** Iteration 013 narrowed F010's status from a pure "missing schema" problem to a runtime-enforcement problem: `tool-schemas.ts` now publishes code-graph schemas and re-exports validators, but `context-server.ts` still forwards raw args into `dispatchTool(...)`, and `code-graph-tools.ts` still casts those raw objects into handler args without calling `validateToolArgs(...)`.
- **Security note 3:** Iteration 024 narrowed the `memory_context` handler surface: the live `memory_context` path still routes through `tools/context-tools.ts`, which invokes `validateToolArgs('memory_context', args)` before `handleMemoryContext(...)`, and `resolveTrustedSession(...)` still binds resumed sessions to corroborated identity/scope. No code-execution sink was found on `input`, so the remaining concern in this handler slice is the previously observed raw internal error-text/details echo rather than a new auth or injection flaw.
- **Security note 4:** Iteration 020 also reconfirmed that `session_id` path traversal is still blocked by filename sanitization, but the same hook-state layer remains unsafe because the sanitization is lossy rather than collision-resistant and the persisted JSON still relies on ambient temp-root / umask policy even though it stores `sessionSummary` and `pendingCompactPrime` content.
- **Security note 5:** Iteration 028 narrowed the remaining handler-entry D2 surface one step further: no new arbitrary-file-read sink was found outside the already-tracked `code_graph_scan.rootDir` path, but `ccc_feedback` now adds a separate persistent-write advisory because `comment` and `resultFile` bypass both schema length bounds and the generic `SEC-003` guard before hitting `appendFileSync(...)`.
- **Traceability note:** The packet still overstates the live hook merge behavior and points readers at obsolete module paths in several reviewed references. Iteration 008 extended that drift profile through phases 008-012: the tree-sitter delivery described in Phase 008 is not the shipped indexer, `code_graph_context` is narrower than the checked Phase 010 bridge contract, and the reviewed Phase 011-012 hook/runtime paths still execute heuristics and wrappers rather than the documented working-set + CocoIndex automation.
- **Traceability note 2:** The retargeted iteration-008 pass on phases 004/005/006/007/011/012 split the packet into two groups: 004 and 007 are backed by concrete runtime/tests, while 005, 006, 011, and 012 are only partially implemented and still contain checked claims that exceed the reviewed command/docs/compaction behavior.
- **Traceability note 3:** Iteration 014 confirmed the same D3 core remains active in the current repository: the parent spec still advertises a real 3-source hook merge and obsolete `scripts/hooks/claude` paths, phases 005/006/011/012 still overclaim completion, and Phase 008 only partially narrowed because its checklist now names the regex parser while the spec/title/parent phase table still present tree-sitter as the shipped contract.
- **Traceability note 4:** Iteration 018 rechecked only the four previously partial phases and found no truth-sync progress: Phase 005 still falls short at the canonical `/spec_kit:resume` contract, Phase 006 still overstates live hook behavior in docs, Phase 011 still leaves the working-set helpers largely unwired to the active compaction path, and Phase 012 still ships CocoIndex wrappers/guidance more strongly than true semantic-neighbor compaction.
- **Traceability note 5:** Iteration 022 narrowed the decision-record surface: DR-001/002/003 still map cleanly to the live implementation, but DR-004 is now stale because the packet expanded to 12 phases without an explicit superseding decision entry.
- **Traceability note 6:** Iteration 026 narrowed the hook-registration surface: `.claude/settings.local.json` correctly registers `PreCompact`, `SessionStart`, and `Stop` against live `mcp_server/dist/hooks/claude/*` scripts, so there is no missing registration or stale runtime path in the settings file. The remaining drift is documentation-level: the parent spec still describes `SessionStart(source=compact|startup|resume)` matcher-scoped hook architecture even though the shipped config registers a single unscoped `SessionStart` command and relies on `session-prime.ts` to branch on `input.source`.
- **Traceability note 7:** Iteration 027 also sharpened the Phase 010 drift: the spec/checklist still treat `includeTrace` trace metadata as shipped `code_graph_context` behavior, but the live builder never returns any trace payload, so the packet currently overstates one more tool-contract capability.
- **Traceability note 8:** Iteration 029 moved from phase-level truth to the parent checklist itself. The sampled parent checklist still is not evidence-clean: several checked parent items remain only partially backed by the live runtime, and the checked Claude `session_id` -> Spec Kit session bridge claim is still unsupported by shipped hook code even though `hook-state.ts` exposes a placeholder `speckitSessionId` field.
- **Maintainability note:** Layer metadata, tool schemas, dispatcher wiring, and packet docs are no longer a single coherent contract source for the code-graph feature family.
- **Maintainability note 2:** The library-core pass adds three more follow-on costs: seed resolution suppresses DB failures into placeholder anchors, `extractEdges()` still carries a dead `TESTED_BY` branch that `indexFiles()` already supersedes, and `excludeGlobs` is exposed but ignored by the actual file walker.
- **Maintainability note 3:** The final hook/docs pass confirmed the hook registration itself is healthy; the remaining D4 costs are duplicated recovery ownership across `CLAUDE.md` vs `.claude/CLAUDE.md` and duplicated token-count ownership across `hooks/response-hints.ts` vs `lib/response/envelope.ts`. Iteration 017 narrowed the docs issue from competing hook playbooks to overlapping manual-recovery entry points, but did not retire it.
- **Maintainability note 4:** Iteration 025 quantified the remaining regression debt: only 4/6 Claude hook scripts and 6/10 code-graph library files have direct Vitest imports, `session-prime.ts` / `session-stop.ts` still lack live entrypoint tests, and several stale-named suites (`hook-session-start`, `hook-precompact`, `hook-stop-token-tracking`) mostly exercise helpers instead of the files named in their titles.
- **Maintainability note 5:** Iteration 030 confirmed the reviewed barrels remain wired, but it found one more duplicate-ownership seam inside the Claude hook slice: `hooks/claude/shared.ts` exports a tested `calculatePressureAdjustedBudget(...)` helper while the live `session-prime.ts` entrypoint still uses its own private `calculatePressureBudget(...)` implementation with a different >90% branch.
- `F001` `session-prime.ts` clears `pendingCompactPrime` before stdout injection completes, so an output failure drops the only compact-recovery payload.
- `F002` `hook-state.ts` swallows save failures and `compact-inject.ts` logs cache success unconditionally, creating false-positive recovery state.
- `F003` `session-prime.ts` never validates `cachedAt`, so stale compact payloads remain injectable indefinitely.
- `F004` `session-prime.ts` references `workingSet`, but `hook-state.ts` never defines or persists that field.
- `F005` `structural-indexer.ts` stores one-line symbol ranges, which makes multi-line `CALLS` extraction and enclosing-seed resolution fail.
- `F006` `handlers/code-graph/context.ts` erases provider-typed seed identity, so manual and graph seeds cannot resolve through `code_graph_context`.
- `F007` `code-graph-db.ts` plus `scan.ts` leave stale inbound edges behind after symbol churn because orphan cleanup is never run on the normal incremental path.
- `F008` `structural-indexer.ts` never emits JS/TS `method` nodes, so primary-language class containment is missing.
- `F009` Hook recovery replays transcript-derived text as tool-authored `Recovered Context` without prompt-injection fencing or provenance separation.
- `F010` `code_graph_*` and `ccc_*` tool calls bypass centralized argument validation, so caller-controlled scan roots and related inputs reach handlers directly.
- `F011` `budget-allocator.ts` hard-codes a 4000-token distribution ceiling, so larger caller budgets are silently ignored.
- `F012` `compact-merger.ts` appends a truncation marker outside the granted budget and still renders sections whose allocation was trimmed to zero.
- `F013` `working-set-tracker.ts` lets the working-set map exceed the configured `maxFiles` until it grows past 2x capacity.
- `F020` `compact-merger.ts` never budgets `sessionState`, so the merged brief can exceed caller `totalBudget` even when source allocations stay within budget.
- `F014` `seed-resolver.ts` converts graph-DB failures into placeholder anchors, so callers cannot distinguish infrastructure failure from a legitimate no-match resolution.
- `F015` `structural-indexer.ts` keeps a dead per-file `TESTED_BY` branch even though the real cross-file heuristic lives later in `indexFiles()`.
- `F016` `excludeGlobs` is still a dead public scan option because the structural walker never consults the merged exclusion list.
- `F017` `indexer-types.ts` maps `.zsh` to `bash` but the default include globs never discover `.zsh` files.
- `F018` root `CLAUDE.md` and `.claude/CLAUDE.md` now describe different authoritative manual-recovery surfaces, while the actual SessionStart hook behavior only reinforces the Claude-specific `memory_context(...)` path.
- `F019` `hooks/response-hints.ts` and `lib/response/envelope.ts` both own token-count synchronization logic, leaving final MCP envelope counts with two separate maintainers and test contracts.
- `F020` `mergeCompactBrief()` never budgets `sessionState`, so the final compact brief can exceed caller `totalBudget` even when the reported source allocation stays within budget.
- `F021` `code_graph_scan` never initializes the code-graph DB on the live tool path, so a fresh runtime can throw `Code graph database not initialized` before the first scan reaches indexing.
- `F022` `compact-inject.ts` / `session-prime.ts` bypass the shared `memory-surface.ts` compaction helper entirely, so the live Claude hook path never preserves constitutional or triggered auto-surfaced memories across compaction.
- `F023` `initDb()` never persists or validates real on-disk schema version state and caches the DB handle before WAL/schema setup succeeds, so failed opens can leave a poisoned singleton that subsequent `initDb()` calls reuse.
- `F024` `replaceNodes()` and `replaceEdges()` delete the previous graph rows outside their insert transactions, so any insert-time constraint failure can erase a file's existing nodes or outgoing edges.
- `F025` `decision-record.md` still leaves DR-004 as an active “4 phases, independently deployable” rollout even though the current packet and later DR-011 now operate on a 12-phase shared-artifact plan.
- `F026` `handlers/code-graph/query.ts` appends transitive neighbors before enforcing the next-hop `maxDepth` boundary and only marks nodes visited on dequeue, so `includeTransitive` can return out-of-depth nodes and duplicate converging-path nodes.
- `F027` `hook-state.ts` collapses distinct session IDs onto the same sanitized filename and never verifies that a loaded record's `claudeSessionId` still matches the current hook input, so one aliased session can overwrite or replay another session's cached recovery state.
- `F028` `hook-state.ts` writes `sessionSummary` and `pendingCompactPrime` to temp JSON without explicit restrictive modes, so recovery-payload confidentiality depends on the host temp-root policy and process umask instead of the hook layer itself.
- `F029` the current hook/code-graph Vitest slice overstates live entrypoint protection: only 4/6 `hooks/claude/*.ts` files and 6/10 `lib/code-graph/*.ts` files have direct test imports, and several hook-named suites now cover helpers rather than the named runtime scripts.
- `F031` `ccc_feedback` writes caller-controlled `comment` and `resultFile` strings into persistent JSONL without schema `maxLength` bounds or a matching generic length guard, so callers can amplify both on-disk feedback growth and echoed success payload size through that fixed write sink.
- `F032` `hooks/claude/shared.ts` exports a tested `calculatePressureAdjustedBudget(...)` helper, but the live `session-prime.ts` entrypoint still uses a private `calculatePressureBudget(...)` helper with a different >90% reduction rule, so SessionStart pressure handling has two owners and the tested helper is not the runtime contract.
- `F033` `code_graph_context` still advertises trace metadata behind `includeTrace` in the live tool schema and Phase 010 packet, but `buildContext()` never reads the flag and `ContextResult` exposes no trace payload, so callers never receive the promised debug metadata.

---

## 8. WHAT WORKED
- Reading the spec and decision records first made the highest-risk trust boundaries obvious before drilling into implementation details.
- End-to-end tracing across write-path and read-path boundaries was more productive than reviewing files in isolation.
- Comparing the published tool contracts in `tool-schemas.ts` against the real dispatcher wiring exposed concrete enforcement gaps instead of doc-only drift.
- Cross-checking likely false positives against downstream handlers was useful for ruling out an actual shared-memory auth bypass.
- Re-reading `session-stop.ts` and `edge-cases.vitest.ts` was high-yield for the compact-recovery refresh because it separated real mitigations from imagined ones: stale cleanup and `cachedAt` handling exist, just not on the normal compact-read path.
- Small runtime repros against the built `dist/lib/code-graph/*` modules were especially high-yield for this pass because they turned the budget and capacity concerns into observable invariant breaks without touching production code.
- Replaying the built Stop hook with `stop_hook_active=false` versus `true` was a useful sanity check; it matched the source trace exactly and helped separate the Stop-hook control-flow defect from unrelated MCP-side hook wiring.
- The pinned `hook-stop-token-tracking.vitest.ts` + `edge-cases.vitest.ts` rerun stayed green and was useful as a boundary check: it confirmed the parser/cache helpers still satisfy their current tests while highlighting that the live Stop-hook guard and cache-inclusive accounting contract are still uncovered.
- The iteration-011 re-verification was efficient because a focused reread of the current hook files, a targeted 4-file Vitest rerun, and a bounded stdout-size sanity check were enough to distinguish still-live correctness issues from non-issues.
- The iteration-013 re-verification was highest-signal when it traced the live `CallToolRequestSchema -> dispatchTool -> code-graph-tools -> handler` path instead of stopping at `tool-schemas.ts`; that made it possible to classify F010 as changed-but-still-active rather than incorrectly calling it fixed.
- The iteration-015 pass got the fastest signal from pairing the current compact-helper Vitest slice with tiny `dist/lib/code-graph/*` repros; that combination was enough to re-confirm F011-F013 and expose the unbudgeted `sessionState` path without widening scope beyond the reviewed helper files.
- The iteration-021 DB pass got the highest signal from tiny `dist/lib/code-graph/code-graph-db.js` repros: one corrupt-file open was enough to expose the poisoned-singleton init path, and one duplicate-symbol insert was enough to show that the delete-then-insert refresh is not atomic.
- The iteration-023 handler pass got the fastest signal from tiny `dist/handlers/code-graph/query.js` repros: one 3-node chain proved the `maxDepth` contract leak immediately, and one diamond graph showed duplicate-node emission on converging paths.
- The iteration-024 memory-context pass was highest-signal when it followed the actual `tools/index.ts -> tools/context-tools.ts -> handleMemoryContext(...)` route instead of assuming server-wide behavior from `context-server.ts`; that made it possible to rule out a false-positive schema-bypass on the `memory_context` tool itself.
- The iteration-025 coverage pass was highest-signal when it built a direct import map from the current Vitest inventory instead of trusting test filenames. That made it possible to separate real helper coverage from stale-named suites that no longer touch the live hook entrypoints.
- The iteration-026 registration pass was highest-signal when it checked all three layers together: `.claude/settings.local.json`, the built `mcp_server/dist/hooks/claude/*` entrypoints, and `session-prime.ts`'s internal `source` switch. That separated a real settings/spec traceability drift from the false positive of a missing Claude lifecycle registration.
- The iteration-027 convergence sweep was highest-signal when it re-checked the Phase 010 spec/checklist against `tool-schemas.ts`, the `handleCodeGraphContext(...)` forwarding layer, and the `ContextResult` / `buildContext()` return shape. That separated a genuine shipped contract failure (`includeTrace` is still a no-op) from the older broad contract-drift note about partially consumed knobs.
- The iteration-028 convergence sweep was highest-signal when it paired the generic `validateInputLengths(...)` key list with the specific `ccc_feedback` disk-write sink. That made it possible to separate a genuinely new handler-local persistence risk from the older broad dispatcher-validation finding.

---

## 9. WHAT FAILED
- CocoIndex and memory MCP discovery were unavailable in this session, so review work fell back to direct repository inspection.
- The local Vitest invocations for `tool-input-schema.vitest.ts` and `review-fixes.vitest.ts` stalled without output in this session, so schema-test verification is still unresolved.
- Existing review artifact numbering is inconsistent, so convergence will need one cleanup pass before final reporting.
- There is still no automated test that simulates a stdout-write failure after `pendingCompactPrime` is cleared, so `F001` remains confirmed by control-flow inspection rather than by direct reproduction.
- The current compact-helper tests still do not cover configurable budgets above 4000, zero-budget section rendering, unbudgeted `sessionState`, strict `maxFiles` enforcement, or default `.zsh` discovery.
- The targeted code-graph/runtime vitest slice still does not cover DB-unavailable seed resolution, custom `excludeGlobs`, or the dead per-file `TESTED_BY` branch, so passing tests do not reduce the new D4 findings.
- There is still no automated test that exercises the real Stop-hook guard semantics (`false` for ordinary Stop, `true` for recursive continuation), so the verified Stop-hook P1s remain largely protected only by code review and manual reproduction.
- The stop-hook token tests still assert cache-bucket extraction without checking whether `totalTokens` or `estimateCost()` include those cached-token buckets, so the transcript-accounting defect remains invisible to the current regression slice.
- There is still no test that forces `saveState()` to fail or that faults the post-read/pre-write SessionStart path, so F001 and F002 continue to rely on source-level control-flow review plus contract reasoning rather than a deterministic regression harness.
- The schema-validation tests exercise validator behavior in isolation, but there is still no end-to-end assertion that the live `code_graph_*` / `ccc_*` dispatch path invokes those validators before handler execution.
- The current crash-recovery coverage still does not simulate a second `initDb()` after setup failure or a constraint error inside `replaceNodes()` / `replaceEdges()`, so the new DB lifecycle and atomicity defects were invisible to the existing regression slice.
- There is still no handler-level regression test that exercises `code_graph_query` with `includeTransitive` across a strict `maxDepth` boundary or a converging-path graph, so F026 remained invisible to the current test suite.
- There is still no end-to-end runtime assertion that the live `memory_context` dispatch path both rejects malformed MCP args and redacts internal failure details, so the latest D2 narrowing still depends on direct dispatcher/handler inspection rather than a single integrated regression.
- Three stale-named hook suites now overstate live entrypoint protection: `hook-session-start.vitest.ts` does not import `session-prime.ts`, `hook-precompact.vitest.ts` does not import `compact-inject.ts`, and `hook-stop-token-tracking.vitest.ts` does not import `session-stop.ts`. The only direct `compact-inject.ts` imports are placeholder edge-case tests that do not execute the merged-context path.
- The parent spec still does not distinguish registration-level matcher configuration from in-script `SessionStart` source branching, so the current hook architecture cannot be audited from `.claude/settings.local.json` alone.
- There is still no regression that proves the live `code_graph_context` path changes shape or emits any additional payload when `includeTrace=true`, so the checked Phase 010 trace-metadata contract remained invisible to the current test surface until direct source inspection in iteration 027.
- There is still no regression that proves the live `ccc_feedback` path rejects oversized `comment` / `resultFile` payloads before writing them to `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl`, so the new iteration-028 persistence finding was still invisible to the current test surface.

---

## 10. EXHAUSTED APPROACHES (do not retry)
- Re-running `tests/code-graph-indexer.vitest.ts` alone is not enough to establish D1 confidence for the code-graph stack.
- Treating shared-memory actor-schema looseness as an auth bypass. The reviewed handler still enforces exactly-one caller identity and rejects anonymous access.
- Treating `getStats().schemaVersion === SCHEMA_VERSION` as evidence that migrations are handled. The current code never reads persisted schema version state, so that test only proves the constant is exported.

---

## 11. RULED OUT DIRECTIONS
- `getTokenUsageRatio()` is not a meaningful D1 risk in this slice; it is simple and internally consistent.
- `computeFreshness()` and the basic stats queries are not where the current correctness failures originate.
- WAL mode itself is not the current correctness gap in the DB layer; `journal_mode = WAL` is set, but migration safety and write atomicity are still broken.
- `session_id` path traversal via hook-state filenames is ruled out by filename sanitization before path join.
- I did not elevate the 12-hex `projectHash` truncation to a separate finding in iteration 020; the live high-signal isolation break is the easier per-session filename aliasing bug, and no concrete cross-project bucket collision was demonstrated in that pass.
- Raw JSONL log injection through `ccc_feedback` is ruled out because entries are serialized with `JSON.stringify(...)`.
- The working-set recency-decay formula did not produce a new correctness finding in this pass; the confirmed tracker bug is capacity enforcement, not decay math.
- The "all sources empty" allocator path is not currently broken; `totalUsed` still falls to zero there.
- No live Dual-Graph / Codex-CLI-Compact / `graperoot` dependency reappeared in the reviewed implementation manifests or runtime imports.
- Treating `memory_context` as part of F010's schema-bypass surface. The live tool route still passes through `tools/context-tools.ts`, which invokes `validateToolArgs('memory_context', args)` before handler execution.
- Command injection through `ccc_reindex` is ruled out in the reviewed handler slice: the command string is assembled from a resolved fixed binary path plus an optional boolean `--full` suffix, not from caller-controlled shell text.

---

## 12. NEXT FOCUS
Iterations 031-040 completed the post-v2 remediation verification pass. The original 33 findings were largely addressed (24 FIXED, 3 PARTIAL, 6 STILL_ACTIVE), but 15 new findings were added in iterations 031-040 covering the new tree-sitter parser and query-intent classifier modules.

**Highest-value follow-up:** move to remediation planning and targeted reruns. Start with the still-active D1/D2 blockers: fix the code-graph DB bootstrap and refresh semantics (persist/validate schema version state, clear failed `initDb()` attempts, and make each file refresh atomic across `upsertFile()` / `replaceNodes()` / `replaceEdges()`), repair `code_graph_query` transitive traversal so it enforces `maxDepth` before appending children and deduplicates on enqueue, then make the compact helper respect end-to-end caller budgets (remove the 4000 allocator ceiling, reserve truncation markers inside grants, suppress zero-budget sections, budget `sessionState`, and enforce `maxFiles` immediately), harden hook-state identity/confidentiality (collision-resistant session filenames, exact `claudeSessionId` checks on load, and explicit `0700`/`0600` temp-state permissions), fence or provenance-mark transcript-derived compact payloads before replay, invoke runtime schema validation on the code-graph dispatch path, constrain `code_graph_scan.rootDir` to an approved workspace boundary, and add explicit length limits plus reduced echoing for `ccc_feedback` before it appends feedback to disk. After functional remediation, backfill regression coverage for the still-unprotected entrypoints and seams: `session-prime.ts`, `session-stop.ts`, the real `compact-inject.ts` merged-context path, `code-graph-context.ts`, `seed-resolver.ts`, `working-set-tracker.ts`, and end-to-end `code_graph_*` / `ccc_*` validation paths. Finally, truth-sync the parent spec plus phases 005/006/008/010/011/012 and collapse the remaining D4 duplicate-ownership points (`CLAUDE.md` recovery guidance, token-count synchronization, and pressure-budget calculation) so follow-on maintenance has one source of truth.

---

## 13. KNOWN CONTEXT
- Spec has 12 phases (001-012), all marked complete
- Deep review loop has now reached iteration 030 / 030 (final convergence complete)
- 30/30 checklist items checked across P0/P1/P2
- 12 decision records (DR-001 through DR-012)
- 55 deep research iterations informed the design
- Hook scripts must complete in <2s (PreCompact/SessionStart) or run async (Stop)
- Direct import pattern chosen over MCP calls for performance (DR-003)
- PreCompact stdout is NOT injected - uses cache file bridge to SessionStart
- Code graph tools are registered in the MCP dispatch layer; the remaining review gap is about correctness, validation, and contract accuracy rather than missing exposure

---

## 14. CROSS-REFERENCE STATUS
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | mismatch | 014, 018, 026, 027 | Re-verification confirmed the parent spec still describes a real Memory + Code Graph + CocoIndex hook merge, still points at obsolete `scripts/hooks/claude` paths, still mixes historical pre-hook status text with current runtime state, now additionally implies source-scoped `SessionStart` matcher wiring that the shipped `.claude/settings.local.json` does not declare, and Phase 010 still documents `includeTrace` trace metadata as shipped `code_graph_context` behavior even though the live builder returns no trace payload. |
| checklist_evidence | core | mismatch | 014, 018, 027, 029 | Re-verification confirmed the checked packet still overstates completion for phases 005/006/011/012; iteration 018 revalidated those four phases specifically and found no truth-sync progress. Phase 008 remains only partially narrowed because its checklist now acknowledges the regex parser, but its spec/title and the parent phase table still advertise tree-sitter. Iteration 027 added another checked mismatch in Phase 010: the checklist still marks trace metadata complete for `includeTrace=true`, but the current `code_graph_context` runtime does not emit any trace payload. Iteration 029 extended the same mismatch to the parent checklist, where sampled checked items still include partial runtime delivery and the still-unimplemented Claude `session_id` -> Spec Kit session bridge claim. |
| decision_record | core | mismatch | 022 | DR-001/002/003 still align with the live implementation, but DR-004 was never superseded after the packet expanded from a 4-phase rollout to the current 12-phase plan. |

---

## 15. REVIEW BOUNDARIES
**In scope:** All implementation files listed in config, spec documents (spec.md, plan.md, checklist.md, decision-record.md), and 12 phase sub-folder specs.
**Out of scope:** Research iterations, memory saves, scratch files, test fixtures not directly related to 024 implementation.

---

## 16. FINAL VERDICT
- **Synthesis status:** complete at iteration 010; re-verified at iterations 011-030; post-v2-remediation verification at iterations 031-040 with convergence reached at iteration 040
- **Artifact integrity:** the review loop has now reached its planned 40th iteration. On-disk iteration artifacts now exist for `iteration-011.md` through `iteration-040.md`.
- **Deduplicated result after v2 remediation:** 0 P0, 10 P1, 14 P2 active. V2 remediation fixed 24 of 33 original findings. Iterations 031-040 added 7 new P1 and 8 new P2 in new code (tree-sitter-parser, query-intent-classifier) and uncovered remaining gaps in partially-remediated items
- **Severity reassessment:** no confirmed P1 upgrades to P0; no confirmed P1 downgrades to P2
- **Final verdict:** `CONDITIONAL` (improved from pre-v2 CONDITIONAL)
- **Why (post-v2):** V2 remediation substantially improved the codebase — 24 of 33 original findings verified fixed. However, the verdict remains CONDITIONAL because: (1) 6 original findings remain active (F001, F002 partial, F010 partial, F020 partial, F022 partial, F033), (2) new tree-sitter parser code introduced 6 new P1s (F030-F034, F041) around AST walk correctness, import/export handling, Python decorator double-emission, and nested class qualification, (3) query-intent-classifier introduced 1 P1 (F035) and 3 P2s (F036-F038) around scoring bias and keyword coverage, (4) test coverage for new modules is still missing (F039-F040). The prior 30-iteration justification remains relevant for historical context: the re-verification passes did not retire any existing active finding, and iterations 015-016, 019-023 added eight more live defects across D1/D2: `mergeCompactBrief()` still ignores caller budget for `sessionState`, the live `code_graph_scan` path still fails on a fresh runtime because the code-graph DB is never initialized before stale checks, the live Claude compaction hook path still bypasses the shared `memory-surface.ts` helper so constitutional/triggered auto-surfaced memories are never preserved across compaction, `hook-state.ts` still aliases distinct session IDs onto one sanitized filename and can replay/clobber another session's recovery state, the same hook-state temp JSON still relies on ambient permissions despite storing assistant summaries and compact payloads, `initDb()` still lacks durable schema/migration safety and can poison the cached DB handle after setup failure, the delete-then-insert refresh helpers can still erase a file's prior graph on constraint errors, and the transitive `code_graph_query` path still returns out-of-depth and duplicate nodes. Iteration 022 added a further D3 traceability defect: DR-004 still presents the packet as a 4-phase independently deployable rollout even though the current spec and later DR-011 now operate on a 12-phase plan. Iteration 024 added no new D2 finding and narrowed the handler scope: `memory_context` itself still validates published args and corroborates session reuse, so the remaining security blockers stay transcript replay, code-graph validation bypass, the earlier raw error-message echo, and the hook-state isolation/confidentiality issues. Iteration 025 added a further D4 maintainability defect: the current Vitest slice covers only 4/6 Claude hook scripts and 6/10 code-graph library files by direct import, and several hook-named suites now exercise helpers rather than the live runtime entrypoints. Iteration 026 added a narrower D3 P2: the parent spec still describes source-scoped `SessionStart` matcher wiring, but `.claude/settings.local.json` registers a single unscoped `SessionStart` hook and leaves source routing to `session-prime.ts`. Iteration 028 added a further D2 P2: `ccc_feedback` still persists caller-controlled `comment` / `resultFile` strings to disk without length bounds, creating a storage / response-amplification sink even though raw JSONL injection remains ruled out. Iteration 030 added one final D4 P2: the shared pressure-budget helper in `hooks/claude/shared.ts` is still not the helper used by the live `session-prime.ts` entrypoint, and the two copies have already drifted in behavior. F009 remains confirmed, F010 remains active with narrowed evidence (schema declarations exist but runtime enforcement is still bypassed), F011/F012 remain confirmed, F014-F017 and F019 remain confirmed on the current D4 surfaces, and F018 narrowed without clearing. The packet therefore still carries unresolved P1 correctness/security/traceability defects plus confirmed P2 maintainability drifts. Release-readiness remains conditional on remediation and a clean verification rerun.
- **Next action:** remediate the confirmed P1 set first, including hook-state session isolation, then close the remaining handler-entry D2 gaps by enforcing runtime `ccc_*` validation, bounding `ccc_feedback.comment` / `resultFile`, and reducing success-path echoing of persisted feedback. After that, backfill regression coverage for the uncovered hook/code-graph entrypoints and validation seams, truth-sync the decision-record and parent-spec packet history (especially DR-004 versus the 12-phase rollout plus the parent spec's stale hook-layout / `SessionStart(source=...)` registration wording), and finally collapse the remaining recovery/docs, token-count, and pressure-budget duplicate-ownership surfaces before claiming closure.
