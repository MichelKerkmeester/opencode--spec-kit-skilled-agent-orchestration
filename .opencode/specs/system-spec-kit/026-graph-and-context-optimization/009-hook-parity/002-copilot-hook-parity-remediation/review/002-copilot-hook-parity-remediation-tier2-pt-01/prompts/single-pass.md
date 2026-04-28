# Single-Pass Deep Review — 009/002 Copilot Hook Parity Remediation

**GATE 3 PRE-ANSWERED — A**: `specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation`. Pre-approved.

You are dispatched as a deep-review agent. SINGLE-PASS review covering all 4 dimensions.

## CONTEXT

Per the original 026 release-readiness program assessment:
- **Status**: 100% done, file-based custom-instructions writer validated on live Copilot.
- **Specific concern**: Copilot hook output contract differs from prompt-mutation runtimes (file-based, not stream-mutate). Full package lint has unused-variable findings outside scope.
- **Review angle**: (a) idempotency of custom-instructions merge; (b) privacy-safe diagnostics logging; (c) cleanup story across releases.

## YOUR TASK

1. **Read inputs**:
   - `specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/{spec,plan,tasks,checklist,implementation-summary,decision-record}.md`
   - The custom-instructions writer code (likely under `.opencode/skill/system-spec-kit/mcp_server/lib/hook/copilot/` or sibling)
   - Focused test files cited
   - Sample `research/` if material

2. **4-dimension review**:
   - **D1 Correctness**: Custom-instructions merge — idempotent? Concurrent writes? File-locking?
   - **D2 Security**: Diagnostics logging — does any user prompt content or sensitive path leak into the writer's output? What does the writer leave in the file system between sessions?
   - **D3 Traceability**: REQ-* mapping; checklist evidence quality; live-smoke evidence cited at file:line.
   - **D4 Maintainability**: Cleanup story — when Copilot SDK eventually lands, how does the file-based workaround retire?

3. **Output review-report.md** at `specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/review/002-copilot-hook-parity-remediation-tier2-pt-01/review-report.md` with standard 9-section + Planning Packet.

For P0/P1: claim-adjudication packet + Hunter→Skeptic→Referee.

## CONSTRAINTS

- LEAF; max 22 tool calls; read-only; file:line for P0/P1.

GO.
