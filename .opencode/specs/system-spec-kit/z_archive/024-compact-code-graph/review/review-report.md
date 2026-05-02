# Review Report - 024 Compact Code Graph

## 1. Executive Summary

- Verdict: `PASS`
- Release readiness: `converged`
- Active findings: `0 P0`, `0 P1`, `7 P2`
- `hasAdvisories`: `true`
- Scope: Root packet review for recovery/bootstrap, structural bootstrap, untouched code-graph handlers, cross-runtime hook surfaces, and public packet mirrors across the reviewed runtime and documentation surfaces.

The review first converged after five iterations, then resumed at the user's request for an extension pass over untouched runtime/code-graph surfaces. The extended run covered correctness, security, traceability, maintainability, and a second stabilization pass. No release-blocking runtime defect was confirmed, but seven advisory drifts remain open.

## 2. Planning Trigger

`PASS` means the packet is shippable from a release-blocking standpoint. A follow-on cleanup plan is still warranted if the goal is packet/doc parity, because the remaining advisories now span both the earlier bootstrap/resume mirrors and the extended runtime-support/code-graph packet summaries.

## 3. Active Finding Registry

- `P2-001` Hidden `sessionId` recovery selector: `session_resume` accepts `sessionId` internally but the public schema layers do not expose it, so callers cannot disambiguate cached-session reuse even though the handler supports that path [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:87] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:669] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:442].
- `P2-002` Self-referential bootstrap guidance on missing graph state: `session_bootstrap` can surface "Call session_bootstrap first" inside its own `nextActions` because the shared structural contract does not tailor that action by source surface [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:112] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:330] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:210] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257].
- `P2-003` Session-resume public mirrors describe the legacy path: the feature catalog and manual playbook still tell operators to validate a `memory_context(mode=resume, profile=resume)` sub-call and an `ok|empty|error` graph-status contract, while the live handler uses the resume ladder and returns `fresh|stale|empty|error` [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:14] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:17] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:25] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:423] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:443].
- `P2-004` Root checklist evidence remains circular: many checked items still cite only `implementation-summary.md`, which weakens replayable verification for a later audit [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:74] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:87] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:125].
- `P2-005` Root runtime-support wording is stale for Gemini: the root spec still presents Gemini as a future hook-adapter candidate even though phase 022 and the shipped Gemini hook surfaces now document native hook delivery [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:227] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:120] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md:11] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:5].
- `P2-006` Cross-runtime fallback feature summary overstates parity: it says Claude, Codex, Copilot, and Gemini all use shell-script `session-prime.ts` hooks, while the shipped runtime detector and playbooks still distinguish Codex hooklessness from Copilot/Gemini config-driven behavior [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:14] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:38] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:43] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:50] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md:18].
- `P2-007` Root implementation summary undercounts the structural public interface: it says "Three MCP tools expose the graph" even though the shipped public surface includes `code_graph_context` as the fourth graph tool [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:94] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:988] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:1003] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:848] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:851].

## 4. Remediation Workstreams

- Recovery contract parity: expose or remove the dormant `sessionId` override path so the handler and public schema surface match.
- Bootstrap guidance hygiene: make the missing-graph recommendation source-aware so bootstrap returns a concrete next step.
- Packet/public mirror cleanup: update the feature catalog, manual playbook, and root checklist evidence pointers to match the shipped runtime.
- Runtime-support truth sync: update the root packet and cross-runtime fallback feature card so Gemini, Copilot, and Codex hook policy matches the shipped runtime detector and hook entrypoints.
- Structural surface summary cleanup: fix the root implementation summary so it counts all four public graph tools consistently.

## 5. Spec Seed

- Clarify the root packet and packet-local mirrors so `session_resume` is documented as filesystem-first resume-ladder recovery with freshness-aware graph status.
- Clarify that bootstrap's missing-graph action is source-sensitive and should not self-reference the current tool call.
- Tighten checklist evidence rules so checked items point to direct proof artifacts where possible.
- Refresh the root runtime-support matrix and cross-runtime feature summary so Gemini hook delivery and config-driven fallback policy are described in current-reality terms.
- Refresh the root implementation summary so the structural public interface lists all four graph tools.

## 6. Plan Seed

1. Update the `session_resume` schema/documentation contract and decide whether `sessionId` is supported or removed.
2. Update `buildStructuralBootstrapContract()` missing-state guidance and the affected bootstrap expectations.
3. Refresh the feature catalog, manual testing playbook, and root checklist evidence pointers to match the shipped runtime.
4. Truth-sync the root runtime-support matrix and cross-runtime fallback feature summary with the shipped Gemini, Copilot, and Codex hook-policy behavior.
5. Correct the root implementation summary's structural tool count so it matches the public MCP registrations.

## 7. Traceability Status

- `spec_code`: `advisory` — root packet recovery claims remain broadly correct, but the runtime-support matrix and structural tool count drift from shipped behavior.
- `checklist_evidence`: `advisory` — checklist sign-off is too dependent on `implementation-summary.md`.
- `feature_catalog_code`: `advisory` — `session_resume` and cross-runtime fallback mirrors both contain stale wording.
- `playbook_capability`: `advisory` — manual test scenario still validates the stale recovery contract.

## 8. Deferred Items

- Leave `P2-001` open unless a follow-on maintenance pass decides the public API should accept `sessionId`.
- Leave `P2-002` open unless startup/bootstrap messaging is being touched again.
- Leave `P2-003` and `P2-004` open unless the packet is entering a doc-parity cleanup wave.
- Leave `P2-005` and `P2-006` open unless the root packet/runtime-support docs are entering a truth-sync pass.
- Leave `P2-007` open unless the root implementation summary is already being refreshed.

## 9. Audit Appendix

- Iterations run: `10`
- Dimensions covered: `correctness`, `security`, `traceability`, `maintainability`
- Stabilization passes: `2`
- New P0/P1 findings after coverage completed: `0`
- Stop reason: `operator-requested extension reconverged with advisories`
