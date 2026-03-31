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

---

## 7. RUNNING FINDINGS
- **P0 (Critical):** 0 active
- **P1 (Major):** 8 active
- **P2 (Minor):** 9 active
- **Delta this iteration:** +0 P0, +0 P1, +2 P2
- **Provisional verdict:** `CONDITIONAL`
- **Iteration-note:** review artifacts and state entries still have some numbering drift from earlier passes, but the substantive finding clusters remain stable.
- **Normalization note:** final cumulative counts use the review brief's authoritative prior summary (0 P0, 8 P1, 7 P2) plus the two new P2 findings from iteration 010; older bullets below still reflect earlier split bookkeeping from prior passes.
- **Correctness note:** The hook/runtime slice still has cache-lifecycle defects in `session-prime.ts` and `hook-state.ts`, and the code-graph library still has symbol-range, seed-mapping, stale-edge, and JS/TS method-indexing blockers.
- **Correctness note 2:** The compact helper slice adds two more budget-contract breaks: `allocateBudget()` cannot spend caller budgets above 4000, and `mergeCompactBrief()` can overflow granted sections while still rendering zero-budget sources. The supporting utilities also have two smaller correctness gaps: `WorkingSetTracker` does not enforce `maxFiles` immediately, and the default indexer config never discovers `.zsh` files even though `detectLanguage()` claims support.
- **Correctness note 3:** Iteration 006 confirmed the earlier Stop-hook control-flow cluster without exposing a new `memory-surface` runtime defect. The Claude Stop hook still exits on ordinary `stop_hook_active=false` payloads, and the reachable branch still uses `pendingCompactPrime` as a pseudo save bookmark instead of persisting context.
- **Security note:** The D2 passes now establish two distinct trust-boundary problems: temp-state reuse/integrity around compact recovery, and trusted replay of raw transcript text plus unvalidated code-graph scan scope.
- **Traceability note:** The packet still overstates the live hook merge behavior and points readers at obsolete module paths in several reviewed references. Iteration 008 extended that drift profile through phases 008-012: the tree-sitter delivery described in Phase 008 is not the shipped indexer, `code_graph_context` is narrower than the checked Phase 010 bridge contract, and the reviewed Phase 011-012 hook/runtime paths still execute heuristics and wrappers rather than the documented working-set + CocoIndex automation.
- **Traceability note 2:** The retargeted iteration-008 pass on phases 004/005/006/007/011/012 split the packet into two groups: 004 and 007 are backed by concrete runtime/tests, while 005, 006, 011, and 012 are only partially implemented and still contain checked claims that exceed the reviewed command/docs/compaction behavior.
- **Maintainability note:** Layer metadata, tool schemas, dispatcher wiring, and packet docs are no longer a single coherent contract source for the code-graph feature family.
- **Maintainability note 2:** The library-core pass adds three more follow-on costs: seed resolution suppresses DB failures into placeholder anchors, `extractEdges()` still carries a dead `TESTED_BY` branch that `indexFiles()` already supersedes, and `excludeGlobs` is exposed but ignored by the actual file walker.
- **Maintainability note 3:** The final hook/docs pass confirmed the hook registration itself is healthy; the remaining D4 costs are duplicated recovery guidance (`CLAUDE.md` vs `.claude/CLAUDE.md`) and duplicated token-count ownership (`hooks/response-hints.ts` vs `lib/response/envelope.ts`).
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
- `F014` `seed-resolver.ts` converts graph-DB failures into placeholder anchors, so callers cannot distinguish infrastructure failure from a legitimate no-match resolution.
- `F015` `structural-indexer.ts` keeps a dead per-file `TESTED_BY` branch even though the real cross-file heuristic lives later in `indexFiles()`.
- `F016` `excludeGlobs` is still a dead public scan option because the structural walker never consults the merged exclusion list.
- `F017` `indexer-types.ts` maps `.zsh` to `bash` but the default include globs never discover `.zsh` files.
- `F018` root `CLAUDE.md` and `.claude/CLAUDE.md` now describe different authoritative manual-recovery surfaces, while the actual SessionStart hook behavior only reinforces the Claude-specific `memory_context(...)` path.
- `F019` `hooks/response-hints.ts` and `lib/response/envelope.ts` both own token-count synchronization logic, leaving final MCP envelope counts with two separate maintainers and test contracts.

---

## 8. WHAT WORKED
- Reading the spec and decision records first made the highest-risk trust boundaries obvious before drilling into implementation details.
- End-to-end tracing across write-path and read-path boundaries was more productive than reviewing files in isolation.
- Comparing the published tool contracts in `tool-schemas.ts` against the real dispatcher wiring exposed concrete enforcement gaps instead of doc-only drift.
- Cross-checking likely false positives against downstream handlers was useful for ruling out an actual shared-memory auth bypass.
- Re-reading `session-stop.ts` and `edge-cases.vitest.ts` was high-yield for the compact-recovery refresh because it separated real mitigations from imagined ones: stale cleanup and `cachedAt` handling exist, just not on the normal compact-read path.
- Small runtime repros against the built `dist/lib/code-graph/*` modules were especially high-yield for this pass because they turned the budget and capacity concerns into observable invariant breaks without touching production code.
- Replaying the built Stop hook with `stop_hook_active=false` versus `true` was a useful sanity check; it matched the source trace exactly and helped separate the Stop-hook control-flow defect from unrelated MCP-side hook wiring.

---

## 9. WHAT FAILED
- CocoIndex and memory MCP discovery were unavailable in this session, so review work fell back to direct repository inspection.
- The local Vitest invocations for `tool-input-schema.vitest.ts` and `review-fixes.vitest.ts` stalled without output in this session, so schema-test verification is still unresolved.
- Existing review artifact numbering is inconsistent, so convergence will need one cleanup pass before final reporting.
- There is still no automated test that simulates a stdout-write failure after `pendingCompactPrime` is cleared, so `F001` remains confirmed by control-flow inspection rather than by direct reproduction.
- The current compact-helper tests still do not cover configurable budgets above 4000, zero-budget section rendering, strict `maxFiles` enforcement, or default `.zsh` discovery.
- The targeted code-graph/runtime vitest slice still does not cover DB-unavailable seed resolution, custom `excludeGlobs`, or the dead per-file `TESTED_BY` branch, so passing tests do not reduce the new D4 findings.
- There is still no automated test that exercises the real Stop-hook guard semantics (`false` for ordinary Stop, `true` for recursive continuation), so the verified Stop-hook P1s remain largely protected only by code review and manual reproduction.

---

## 10. EXHAUSTED APPROACHES (do not retry)
- Re-running `tests/code-graph-indexer.vitest.ts` alone is not enough to establish D1 confidence for the code-graph stack.
- Treating shared-memory actor-schema looseness as an auth bypass. The reviewed handler still enforces exactly-one caller identity and rejects anonymous access.

---

## 11. RULED OUT DIRECTIONS
- `getTokenUsageRatio()` is not a meaningful D1 risk in this slice; it is simple and internally consistent.
- `computeFreshness()` and the basic stats queries are not where the current correctness failures originate.
- `session_id` path traversal via hook-state filenames is ruled out by filename sanitization before path join.
- Raw JSONL log injection through `ccc_feedback` is ruled out because entries are serialized with `JSON.stringify(...)`.
- The working-set recency-decay formula did not produce a new correctness finding in this pass; the confirmed tracker bug is capacity enforcement, not decay math.
- The "all sources empty" allocator path is not currently broken; `totalUsed` still falls to zero there.

---

## 12. NEXT FOCUS
All 10 review iterations are complete. No additional review surface remains open for this packet.

**Highest-value follow-up:** move to remediation planning and targeted reruns. Fix the D1 correctness defects first, then truth-sync the packet/docs, then collapse the remaining D4 duplicate-ownership points (`CLAUDE.md` recovery guidance and token-count synchronization) so follow-on maintenance has one source of truth.

---

## 13. KNOWN CONTEXT
- Spec has 12 phases (001-012), all marked complete
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
| spec_code | core | mismatch | 004 | Spec/checklist describe a real Memory + Code Graph + CocoIndex hook merge, but `compact-inject.ts` currently builds a heuristic transcript brief with empty Memory inputs. |
| checklist_evidence | core | mismatch | 004 | Checklist items are checked without file:line evidence, and some reviewed claims point to obsolete hook paths or unsupported hook behavior. |

---

## 15. REVIEW BOUNDARIES
**In scope:** All implementation files listed in config, spec documents (spec.md, plan.md, checklist.md, decision-record.md), and 12 phase sub-folder specs.
**Out of scope:** Research iterations, memory saves, scratch files, test fixtures not directly related to 024 implementation.

---

## 16. FINAL VERDICT
- **Synthesis status:** complete at iteration 010
- **Artifact integrity:** `iteration-001.md` through `iteration-006.md`, `iteration-008.md`, `iteration-009.md`, and `iteration-010.md` exist; `iteration-007.md` is still missing, so part of the later-pass evidence survives only as strategy/JSONL summaries
- **Deduplicated result:** 0 confirmed P0, 8 confirmed P1, 9 confirmed P2 after normalizing the brief's prior summary with the two new iteration-010 maintainability findings
- **Severity reassessment:** no confirmed P1 upgrades to P0; no confirmed P1 downgrades to P2
- **Final verdict:** `CONDITIONAL`
- **Why:** the final hook-integration pass did not uncover a new registration/export blocker, but confirmed the packet still carries unresolved P1 correctness/security/traceability defects plus two more P2 maintainability drifts; release-readiness therefore remains conditional on remediation and a clean verification rerun
- **Next action:** remediate the confirmed P1 set first, then truth-sync the recovery/docs surface and collapse duplicate token-count ownership before claiming closure
