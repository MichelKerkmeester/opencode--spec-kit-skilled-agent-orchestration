---
title: "Implementation Summary: Review Remediation (010/007)"
description: "Placeholder. Populated after the 6-theme remediation pass completes."
trigger_phrases:
  - "010/007 implementation summary"
  - "010 remediation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/007-review-remediation"
    last_updated_at: "2026-04-25T14:30:00Z"
    last_updated_by: "claude-opus-4-7-batch-T-A"
    recent_action: "T-A WIRE decision recorded; detect_changes registered as MCP tool across dispatcher, JSON schema, Zod validator, allowed-parameter ledger, and 6 umbrella docs"
    next_safe_action: "Run T-B (verification evidence sync) — depends on T-A complete"
    completion_pct: 5
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Implementation Summary: Review Remediation (010/007)

<!-- SPECKIT_LEVEL: 2 -->

## Status
T-A complete (detect_changes MCP wiring decision + execution). T-B through T-F pending.

## Findings Closed

### R-007-2 — `detect_changes` MCP wiring decision (T-A)

**Decision:** WIRE — register `detect_changes` as a callable MCP tool.

**Rationale:**
- Handler at `mcp_server/code_graph/handlers/detect-changes.ts` is fully implemented (canonical-root sanitization, readiness probe, diff parser, line-range overlap attribution) and unit-tested (`code_graph/tests/detect-changes.test.ts`) since 010/002.
- Docs already describe it as an operator-callable surface: feature catalog `03--discovery/04-detect-changes-preflight.md`, manual testing playbook `03--discovery/014-detect-changes-preflight.md`, and `INSTALL_GUIDE.md §4a` smoke test all demonstrate calling the tool with `{ diff, rootDir? }`.
- ADR-012-003 (deferred route/tool/shape contract safety) governs the **new** graph-entity surfaces (`route_map`, `tool_map`, `shape_check`, `api_impact`), not the routine MCP exposure of an existing read-only preflight handler. The 002 implementation summary's appeal to ADR-012-003 to defer registration was a misapplication — re-reading the ADR confirms its scope is route/tool/consumer extraction, not handler-to-MCP wiring.
- Wiring is a mechanical 4-touchpoint addition, parallel to existing patterns (`codeGraphScan`, `codeGraphContext`, `cccStatus`): no new schema infrastructure, no new validation primitives, no new dispatcher patterns.
- Marking the handler INTERNAL would require rewriting 8 doc surfaces to disclaim a capability that is otherwise complete and tested — strictly more work than wiring it, and contrary to the operator-facing experience already published in 010/006.

**Evidence — files modified (WIRE path):**

| File | Change |
|------|--------|
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Added `'detect_changes'` to `TOOL_NAMES`; imported `handleDetectChanges`; added `case 'detect_changes'` dispatcher with `parseArgs` |
| `mcp_server/tool-schemas.ts` | New `detectChanges: ToolDefinition`; appended to `TOOL_DEFINITIONS` under "L8: Code Graph" |
| `mcp_server/schemas/tool-input-schemas.ts` | New `detectChangesSchema`; entry in `TOOL_SCHEMAS`; entry in `ALLOWED_PARAMETERS` |
| `mcp_server/code_graph/handlers/index.ts` | No change needed — `handleDetectChanges` was already exported (verified 2026-04-25) |

### R-007-14 — Sync chosen path across surfaces (T-A)

The `detect_changes` story now reads consistently as a callable MCP tool across:
- `README.md` (root) — "Phase 012 adds the read-only `detect_changes` MCP tool …"
- `.opencode/skill/system-spec-kit/SKILL.md` — `detect_changes` row updated (no longer "deferred")
- `.opencode/skill/system-spec-kit/README.md` — `Preflight` row updated; footer updated
- `.opencode/skill/system-spec-kit/mcp_server/README.md` — `detect_changes` section heading no longer "tool-schema deferred"
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — §4a smoke test wording aligned (no scope change; tool is callable as documented)
- `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/04-detect-changes-preflight.md` — overview and current-reality reflect MCP-tool registration
- `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` — invocation example uses canonical `detect_changes({ … })` shape

## Findings Deferred (with Defer-To pointers)
[TBD per task ID]

## Verification Evidence (real command output)

**T-A scope (`detect_changes` wiring):**

- `tsc --noEmit` clean: **OPERATOR-PENDING** — this batch ran in a sandbox that does not allow `npm install` or pulling `typescript` via `npx`. The four edits are mechanically parallel to the surrounding `codeGraphScan` / `codeGraphContext` registrations (same `getSchema({ … })` pattern, same `optionalPathString()` / `z.string().min(1)` primitives, same `parseArgs<Parameters<typeof handleDetectChanges>[0]>` dispatcher signature already used by every other code-graph tool). Verified by inspection. Operator should run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` to confirm.
- Existing test `code_graph/tests/detect-changes.test.ts` is unchanged; the wiring does not alter handler behaviour.

## References
- spec.md, plan.md, tasks.md, checklist.md (this folder)
- 010/review/phase-review-summary.md
- 010/{001..006}/review/review-report.md
- 010/decision-record.md ADR-012-003 (re-read for scope clarification — governs NEW route/tool/shape entities only)
