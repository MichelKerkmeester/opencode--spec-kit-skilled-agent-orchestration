# Strategy — 013 implementation review

## Review Charter

### Non-Goals

- Re-reviewing the research packet, plan quality, or plan decomposition as planning artifacts.
- Proposing code changes outside the implementation packet's declared target files.
- Reconstructing missing implementation from scratch when the packet already claims closeout.

### Stop Conditions

- Ten iterations are completed.
- Two consecutive iterations land below `newInfoRatio < 0.05`.
- Review becomes blocked by missing packet-local evidence required to verify a claimed outcome.

### Success Criteria

- Every finding is tied to the implementation output, not the research packet.
- Every finding cites `path:line` evidence.
- Final report groups findings by severity and names concrete follow-up target files.
- Output stays inside the canonical `review/` folder structure.

## Scope

### Files To Audit

- Packet docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `resource-map.md`
- Claimed task evidence: `applied/T-001.md` through `applied/T-016.md` when present
- Implementation files:
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`

### Sources Of Evidence

- Line-level code reads from the implementation files above
- Packet closeout docs that claim shipped behavior or verification status
- On-disk packet tree inspection to verify evidence-report presence
- Packet-local and implementation-adjacent test files

## Initial Hypotheses

1. Operation-aware CALLS selection may still mis-rank symbols when ambiguity exceeds the candidate window.
2. CocoIndex seed fidelity may regress on alternate input shapes even if the happy path passes.
3. Bounded context metadata may overstate completeness when deadlines trigger early.
4. Incremental scan cleanup may conflate "no new work" with "clear persisted summary."
5. Startup payload parity may be asserted in docs more broadly than the actual regression coverage proves.
6. Cross-runtime adapters may drift in inventory or verification reporting.
7. Packet evidence docs may over-claim packet-local applied reports.
8. Status/startup graph-quality readers may be correct, but packet docs may still drift from the real blast radius.
9. Blocked-read contracts may be solid, making them a likely negative-knowledge pass.
10. Final packet closeout may have documentation gaps even if code-path changes are directionally correct.

## Iteration Plan

1. Query subject resolution and ambiguity ranking
2. Context seed normalization and CocoIndex fidelity
3. Deadline handling and partial-output accounting
4. Scan metadata lifecycle and incremental semantics
5. Startup/runtime parity and paired coverage
6. Packet evidence integrity (`applied/`, checklist, resource map)
7. File-inventory drift across closeout docs
8. Blocked-read contract negative-knowledge pass
9. Graph-quality reader negative-knowledge pass
10. Residual-risk sweep and convergence check
