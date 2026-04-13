# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Fresh canonical review session for `.opencode/specs/system-spec-kit/024-compact-code-graph`, covering the root packet, all 28 child phases, relevant runtime implementation files, and related skill and agent surfaces.

### Usage

- Init: created from the deep-review workflow with the target bound to the existing spec folder.
- Iteration discipline: each leaf review pass must read this file and `review/deep-research-state.jsonl` first, then review one primary lane while keeping evidence inside scope.
- Prior context: a complete prior rerun exists under `review-prior-code-rerun-2026-04-03/`; it is reference-only and must be revalidated against the live tree.

## 2. TOPIC

Review all work documented under `.opencode/specs/system-spec-kit/024-compact-code-graph`, including spec artifacts, phase closeouts, runtime implementation files, skill contracts, and runtime agent surfaces.

## 3. REVIEW DIMENSIONS (remaining)

All configured review dimensions now have at least one live-tree review pass. Iteration 005's stabilization challenge did not invalidate any active findings, and iteration 006 closed the two remaining pending overlay protocols. The packet is now synthesis-ready with the existing active P1/P2 registry unchanged.

## 4. NON-GOALS

- Modifying files under review.
- Reusing archived findings without live verification.
- Auditing unrelated packets outside spec 024 except where explicitly referenced by in-scope docs or runtime surfaces.

## 5. STOP CONDITIONS

- Max iterations: 20.
- Earlier stop allowed only if convergence gates pass, all configured dimensions are covered, coverage has stabilized, and no active P0 or unresolved P1 remain.

## 6. COMPLETED DIMENSIONS

Covered in iterations 001-002.

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | Conditional | 001 | Root checklist evidence no longer matches the canonical implementation summary for several shipped Phase 015/016 items. |
| D2 Security | Conditional | 002 | Gemini SessionStart compact recovery still injects recovered transcript text without the provenance fence that the packet claims as shipped injection-safety hardening. |
| D3 Traceability | Conditional | 001 | `session_bootstrap` and root packet docs contain two live traceability mismatches against the current handler/output contract and sibling packet truth. |
| D4 Maintainability | Conditional | 003 | Phase 021 still publishes the superseded `session_resume()`-first recovery table even though the canonical root/runtime guidance now requires `session_bootstrap()` first. |
| D5 Performance | Conditional | 004 | Phase 027 promises a 250-400 token structural bootstrap contract with a 500-token hard ceiling, but the shared builder/handlers never enforce that bound. |
| D6 Reliability | Conditional | 002 | Claude stop-hook autosave still infers the destination spec folder from transcript-tail path frequency, so summaries can be persisted into the wrong packet after cross-spec discussion. |
| D7 Completeness | Conditional | 003 | Runtime `context-prime` copies no longer share the same structural Prime Package shape, so cross-runtime startup guidance is only partially mirrored. |

## 7. RUNNING FINDINGS

- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
- **Stabilization result (Iteration 005):** challenged all 7 active findings; 0 downgraded, 0 ruled out, 0 new.
- **Overlay closeout result (Iteration 006):** `feature_catalog_code` and `playbook_capability` both pass on current-tree evidence; 0 new findings.

## 8. WHAT WORKED

- Prior rerun artifacts provide candidate hypotheses to verify against the current tree.
- Root-packet-first review should expose release-readiness drift faster than broad unfocused file sweeps.
- Iteration 001: cross-checking root checklist evidence against live handlers and later child-phase specs surfaced contract drift quickly.
- Iteration 002: side-by-side Claude/Gemini compact-recovery reads surfaced a concrete cross-runtime prompt-safety mismatch quickly.
- Iteration 002: reading the stop-hook autosave path end-to-end (detection → state update → autosave) exposed a real continuity risk without needing archived rerun evidence.
- Iteration 003: comparing Phase 021 child-packet “What Was Built” language against root recovery docs exposed stale bootstrap guidance quickly.
- Iteration 003: diffing the OpenCode `context-prime` contract against Claude/Codex runtime copies isolated the remaining runtime-surface drift with minimal file reads.
- Iteration 004: tracing Phase 027 token-budget claims from spec/plan into `session-snapshot.ts` and the consuming handlers quickly exposed the difference between a documented hard ceiling and the current unenforced implementation.
- Iteration 005: targeted falsification against only the files backing active findings was enough to confirm which contradictions still survive without reopening the whole packet.
- Iteration 006: root index + representative leaf-doc pairing was enough to close `feature_catalog_code` and `playbook_capability` without depending on archived rerun artifacts.

## 9. WHAT FAILED

- CocoIndex semantic search is unavailable in this session because the daemon socket is missing, so semantic discovery must fall back to direct reads, grep, and scope evidence.
- Iteration 001: relying on `implementation-summary.md` alone was not sufficient because sibling packet docs already supersede some statuses it still marks as deferred.
- Iteration 002: re-testing the temp-permissions hypothesis was unproductive because the live hook-state code already enforces 0700/0600 permissions.
- Iteration 003: the suspected broader bookkeeping drift in Phase 028 was not productive; the child packet stays narrowly scoped and internally aligned.
- Iteration 004: chasing the old “read paths still auto-reindex inline” performance hypothesis was unproductive; current `code_graph_context` / `code_graph_query` explicitly disable inline indexing on the read path.
- Iteration 005: a broad challenge sweep over the existing registry produced no weakening evidence, so repeating the same stabilization pass is likely low-yield.
- Iteration 006: broad keyword grep across the whole packet was noisy because scratch and archived rerun artifacts overwhelm the live overlay surfaces needed for closeout.

## 10. EXHAUSTED APPROACHES (do not retry)

- Ruled out in iteration 001: `code_graph_query.edgeType` is not a dead parameter in the live handler.
- Ruled out in iteration 002: missing hook-state temp-permission hardening is not a live issue in the current tree.
- Ruled out in iteration 003: Phase 028 does not over-claim broader startup/bootstrap remediation beyond `queryStartupHighlights()` quality fixes.
- Ruled out in iteration 004: structural read paths do not currently perform synchronous inline reindex work; the handlers pass `allowInlineIndex: false`.
- Prefer current root indexes plus live leaf docs for overlay closeout; broad packet-wide keyword sweeps are now effectively exhausted for synthesis-prep work because they mostly surface archived/scratch noise.

## 11. RULED OUT DIRECTIONS

- Iteration 001: the prior hypothesis that `code_graph_query` ignores `edgeType` was ruled out by the live handler.
- Iteration 001: the prior hypothesis that `session_resume` and `session_bootstrap` disagree on canonical ordering was ruled out by current docs and handlers.
- Iteration 002: the prior hypothesis that Claude hook-state temp files still lack 0700/0600 hardening was ruled out by the live implementation.
- Iteration 002: the prior hypothesis that the live Claude compact path still clears cached payload before stdout write was ruled out by the current `session-prime.ts` + `hook-state.ts` flow.
- Iteration 003: the prior hypothesis that Phase 028 still overstates startup-highlight remediation scope was ruled out by the live phase spec and implementation summary.
- Iteration 004: the prior hypothesis that `code_graph_context` / `code_graph_query` still trigger synchronous inline reindex work was ruled out by the current handlers plus `ensure-ready.ts` skip branch.
- Iteration 005: the hypothesis that `session_bootstrap`'s generic `hints` array already satisfies the documented recommended-next-actions contract was ruled out by the live handler/schema mismatch.
- Iteration 005: the hypothesis that Gemini compact recovery gains provenance fencing after sanitization was ruled out by the live `session-prime.ts` compact path.
- Iteration 005: the hypothesis that Phase 027's 500-token hard ceiling is enforced elsewhere in the shared structural contract was ruled out by the live `session-snapshot.ts` implementation.
- Iteration 006: the older feature-catalog root/index mismatch is ruled out in the current tree because section 22 is present in the root catalog and links the context-preservation/code-graph feature set.
- Iteration 006: the earlier playbook concern about invalid scenario `261d` input is ruled out in the current tree because the scenario now uses valid `memory_context(..., sessionId)` calls.

## 12. NEXT FOCUS

Synthesis/report generation. All configured dimensions and required overlay protocols are now covered on current-tree evidence; keep the existing active P1 set available for final write-up and verdict justification, but no further discovery pass is currently required.

## 13. KNOWN CONTEXT

- Triggered memory surfaced previous work for spec 024, including a completed deep-review remediation memory and the phase 009 spec packet.
- A prior current-tree rerun exists at `review-prior-code-rerun-2026-04-03/` with 20 iterations and verdict `CONDITIONAL`.
- Prior rerun active findings to verify against the live tree:
  - Root packet still references stale or missing hook/build/API paths.
  - Resume wrapper docs may still advertise stale `memory_context({ mode: "resume" })` call shapes.
  - Deferred-item tracking may be internally inconsistent.
  - `session_bootstrap` may still suppress non-minimal resume payload.
  - `code_graph_query` may expose an `edgeType` option that the handler ignores.
  - Structural read paths may still trigger synchronous reindex work.
  - Recovery guidance may still be split across `session_resume` and `session_bootstrap` surfaces.
  - Root packet may overstate shipped three-source compaction behavior.
  - Dispatch-time enrichment may reflect arbitrary local paths.
  - Compaction sanitizer may still allow too much instruction-like transcript text.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1 | Root packet docs still over-promise `session_bootstrap` output and carry stale shipped-status claims in the canonical implementation summary. |
| `checklist_evidence` | core | fail | 1 | Root checklist cites `implementation-summary.md` as evidence for items that the same summary still marks as deferred. |
| `skill_agent` | overlay | fail | 3 | Phase 021 still carries a stale `session_resume()`-first contract and runtime `context-prime` copies no longer share the same structural output shape. |
| `agent_cross_runtime` | overlay | fail | 2 | Claude and Gemini compact-recovery paths still diverge: Claude fences recovered payload provenance, Gemini SessionStart does not. |
| `feature_catalog_code` | overlay | pass | 6 | Root catalog section 22 and current leaf feature docs cover the packet's context-preservation/code-graph capabilities with live implementation references. |
| `playbook_capability` | overlay | pass | 6 | Root playbook section 22 and current scenario files 261/263 cover the relevant operator-facing capability checks with valid live tool surfaces. |

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md` | correctness, traceability, performance | 4 | none | reviewed |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/plan.md` | correctness, traceability, performance | 4 | none | reviewed |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/tasks.md` | maintainability, completeness | 3 | none | reviewed |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md` | correctness, traceability | 1 | P1-002 | reviewed |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md` | correctness, traceability | 1 | none | reviewed |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md` | correctness, traceability, performance | 4 | P1-002 | reviewed |
| `all 28 child phase spec packets` | none | 0 | none | pending |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | correctness, traceability | 1 | P1-001 | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | correctness, traceability, performance | 4 | P1-001 | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | correctness, traceability, performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts` | performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` | performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | correctness, traceability, performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts` | performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | performance | 4 | P1-006 | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` | performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | security, reliability, performance | 4 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | security, reliability | 2 | P1-004 | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | security, reliability | 2 | P1-003 | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts` | security, reliability | 2 | none | reviewed |
| `.opencode/skill/system-spec-kit/SKILL.md` | maintainability, completeness | 3 | none | reviewed |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | maintainability, completeness | 3 | none | reviewed |
| `AGENTS.md` | maintainability, completeness | 3 | P1-005 | reviewed |
| `.opencode/agent/context-prime.md` | maintainability, completeness | 3 | none | reviewed |
| `.claude/agents/context-prime.md` | maintainability, completeness | 3 | P2-001 | reviewed |
| `.codex/agents/context-prime.md` | maintainability, completeness | 3 | P2-001 | reviewed |
| `.opencode/skill/sk-deep-review/SKILL.md` | traceability, maintainability | 6 | none | reviewed |
| `.opencode/agent/deep-review.md` | traceability, maintainability | 6 | none | reviewed |
| `.claude/agents/deep-review.md` | traceability, maintainability | 6 | none | reviewed |

## 16. REVIEW BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`, `checklist_evidence`; overlay=`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`
- Started: 2026-04-03T07:14:00Z
