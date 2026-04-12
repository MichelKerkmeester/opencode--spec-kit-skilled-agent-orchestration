# Deep Review Report: 012-mcp-config-and-feature-flag-cleanup

## 1. Executive Summary

- Verdict: **CONDITIONAL**
- Scope: Five checked-in MCP configs plus the runtime defaults cited by the packet closeout
- Active findings: 0 P0 / 1 P1 / 0 P2
- hasAdvisories: false

## 2. Planning Trigger

Phase 012 does not need a new architecture packet, but it does need a narrow remediation pass because the current review found one remaining checked-in machine-specific path that breaks the claimed five-config parity and weakens the "no leaked paths" cleanup story.

## 3. Active Finding Registry

### P1-001 [P1] Gemini MCP config still hardcodes a local absolute workspace path
- File: `.gemini/settings.json:31`
- Evidence: Phase 012 says the cleanup is limited to five checked-in Public configs and that those configs should share the same minimal env block posture [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:59] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:116] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/checklist.md:53] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41]. Four checked-in surfaces keep the memory server repo-relative or omit a host-specific `cwd` [SOURCE: .mcp.json:16] [SOURCE: .claude/mcp.json:15] [SOURCE: .vscode/mcp.json:16] [SOURCE: opencode.json:25], but `.gemini/settings.json` still checks in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` as the server `cwd` [SOURCE: .gemini/settings.json:31].
- Recommendation: Replace the absolute Gemini `cwd` with the same repo-relative convention used by the other checked-in MCP configs, then rerun the five-file parity sweep and packet evidence refresh.

## 4. Remediation Workstreams

- Workstream A: Align `.gemini/settings.json` with the repo-relative MCP config convention already used by the other Public surfaces.

## 5. Spec Seed

- Update the packet closeout to distinguish "minimal env block parity" from "full config parity" until the Gemini `cwd` is normalized.

## 6. Plan Seed

- Edit `.gemini/settings.json`.
- Re-run the five-file config diff sweep.
- Reconfirm `MEMORY_DB_PATH` absence and `_NOTE_7_FEATURE_FLAGS` parity.
- Refresh the packet evidence lines that currently describe the five configs as identical in content and ordering.

## 7. Traceability Status

- Core protocols: `spec_code=partial`, `checklist_evidence=partial`
- Overlay protocols: not applicable in this slice

## 8. Deferred Items

- Cross-repo MCP config fanout was correctly kept out of scope for this review.
- No code defect was found in `rollout-policy.ts`, `cross-encoder.ts`, or `vector-index-store.ts`; the remaining issue is the checked-in Gemini config surface.

## 9. Audit Appendix

- Iterations completed: 3
- Dimensions covered: correctness, security, traceability, maintainability
- Ruled out: `MEMORY_DB_PATH` regression across the five configs; `_NOTE_7_FEATURE_FLAGS` string drift; runtime default-on flag drift; reranker/model drift; provider-driven embedding-dimension drift
