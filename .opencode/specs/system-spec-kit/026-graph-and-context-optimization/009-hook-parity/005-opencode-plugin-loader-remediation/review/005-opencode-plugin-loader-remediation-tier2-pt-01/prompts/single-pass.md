# Single-Pass Deep Review — 009/005 OpenCode Plugin Loader Remediation

**GATE 3 PRE-ANSWERED — A**: `specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation`. Pre-approved. Proceed directly.

You are dispatched as a deep-review agent. SINGLE-PASS review covering all 4 dimensions.

## CONTEXT

Per the original 026 release-readiness program assessment:
- **Status**: 100% impl, focused tests green.
- **Specific concern**: Full vitest blocked by structural Copilot hook config mismatch in parent `.github/hooks/superset-notify.json` (uses Superset, not repo-local hooks).
- **Review angle**: Confirm plugin helper isolation is sound on its own; assess whether the structural blocker reflects real risk or just config drift.

## YOUR TASK

1. **Read inputs**:
   - `specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/{spec,plan,tasks,checklist,implementation-summary,decision-record}.md`
   - Plugin loader code under `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/` and `.opencode/plugins/`
   - Focused test files cited in implementation-summary
   - Look at `.github/hooks/superset-notify.json` to assess the structural blocker

2. **4-dimension review**:
   - **D1 Correctness**: Plugin helper loader logic, ESM export hardening, legacy export compatibility.
   - **D2 Security**: Path traversal in plugin name → import path construction. Plugin trust boundary.
   - **D3 Traceability**: REQ-* → code; checklist `file:line` evidence; the Copilot hook config blocker — is it tracked elsewhere?
   - **D4 Maintainability**: Plugin loader extensibility. Adding a new helper plugin should be a single touch surface.

3. **Output review-report.md** at `specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/review/005-opencode-plugin-loader-remediation-tier2-pt-01/review-report.md` with the standard 9-section structure + Planning Packet.

For any P0/P1: include claim-adjudication packet + Hunter→Skeptic→Referee.

## CONSTRAINTS

- LEAF agent.
- Target 12 tool calls; max 22.
- Read-only.
- Cite file:line for all P0/P1.

GO.
