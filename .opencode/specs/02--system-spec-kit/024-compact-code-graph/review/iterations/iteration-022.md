# Iteration 022: D3 Traceability Decision-Record Audit

## Focus

Cross-reference `decision-record.md` DR-001 through DR-004 against the live implementation: manifests, hook registration, hook/runtime code paths, tool-dispatch wiring, and the current phase packet.

## Decision Verification

### DR-001 - Reject Dual-Graph Adoption - CONFIRMED

- The live MCP server manifest contains only the shipped local/shared, MCP, SQLite, and embedding dependencies; no `Dual-Graph`, `Codex-CLI-Compact`, `graperoot`, or comparable package appears in the implementation dependency surface.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:40-61]
- The workspace manifest likewise exposes only the local workspaces plus shared runtime dependencies, with no Dual-Graph-style dependency added at the workspace layer.[SOURCE: .opencode/skill/system-spec-kit/package.json:6-10][SOURCE: .opencode/skill/system-spec-kit/package.json:41-43]
- The reviewed hook/tool implementation imports local modules only: `compact-inject.ts` pulls from `./shared.js`, `./hook-state.js`, and `../../lib/code-graph/compact-merger.js`; `session-prime.ts` uses local hook utilities and a direct local dynamic import of `../../lib/code-graph/code-graph-db.js`; `code-graph-tools.ts` dispatches to local handlers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:12-18][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:8-23][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:5-13]

**Conclusion:** the implementation still follows the “clean-room, no Dual-Graph dependency” decision. Historical research/docs mention Dual-Graph, but the shipped code does not depend on it.

### DR-002 - Hybrid Hook + Tool Architecture - CONFIRMED

- The Claude hook layer is live: `.claude/settings.local.json` registers `PreCompact`, `SessionStart`, and `Stop` hooks against compiled local scripts under `mcp_server/dist/hooks/claude/`.[SOURCE: .claude/settings.local.json:5-39]
- Claude-specific recovery guidance exists and explicitly documents hook-assisted recovery plus manual `memory_context(..., profile: "resume")` fallback.[SOURCE: .claude/CLAUDE.md:5-32]
- The tool fallback layer also exists across non-Claude/runtime-agnostic docs: `CODEX.md`, `AGENTS.md`, and `GEMINI.md` all route continuity through `memory_context(..., profile: "resume")` and `memory_match_triggers()`.[SOURCE: CODEX.md:5-18][SOURCE: AGENTS.md:46-52][SOURCE: GEMINI.md:46-52]
- The shared tool-side implementation is real in server code: `memory-context.ts` remains the orchestration entry point for the retrieval layer, while `tools/index.ts` and `code-graph-tools.ts` expose the dispatch layer for structural/semantic support tools.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:15-24][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:5-24][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:18-55]

**Conclusion:** DR-002 still matches the architecture that shipped. Earlier D3 iterations already established that some phase docs overstate how rich the hook path is, but the hook-plus-tool layering itself is implemented.

### DR-003 - Direct Import over MCP Call for Hook Scripts - CONFIRMED

- Hook registration invokes the compiled hook entrypoints directly with `node`, not via an MCP client call or HTTP round-trip.[SOURCE: .claude/settings.local.json:10-12][SOURCE: .claude/settings.local.json:21-23][SOURCE: .claude/settings.local.json:32-35]
- `compact-inject.ts` directly imports local hook utilities plus `mergeCompactBrief` from the local compiled server code.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:12-18]
- `session-prime.ts` likewise consumes local hook utilities and a direct local dynamic import of `code-graph-db.js`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:8-23]

**Conclusion:** the hook path follows DR-003 as written: direct local imports from built output, no MCP-call indirection inside the lifecycle scripts.

### DR-004 - Phase Decomposition (4 phases, independently deployable) - CHANGED / STALE

- DR-004 still records a **4-phase**, “independently deployable” rollout with Phase 1 positioned as the immediate-value slice.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:53-61]
- The current parent spec no longer describes that packet shape; it now defines **12 phases (001-012)** in the active phase table.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:153-168]
- The decision log itself later expands the same packet: DR-011 explicitly keeps code-graph implementation in this spec folder as phases `008+`, which is incompatible with DR-004 remaining the active final phase model.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:122-133]
- The active phase docs also show shared-runtime evolution across phases. Phase 2 explicitly states that `session-prime.ts` is shared with Phase 1’s compact injection path, so the final packet no longer reads like four stable, isolated deliverables with unchanged boundaries.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:18-19][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:43-45][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/checklist.md:26-31]
- Later runtime-policy work also landed as additional packet phases beyond the original four-phase plan; Phase 4’s checklist marks Codex/Copilot/Gemini fallback and the 7-scenario matrix complete as distinct packet workstreams.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/checklist.md:15-34]

**Conclusion:** the current implementation follows an expanded 12-phase packet, not the original DR-004 framing. The drift is not that decisions stopped after DR-004; it is that DR-004 was never explicitly superseded even though the packet grew and its boundaries changed.

## Missing Decision Coverage

- There is **no numbering gap** after DR-004: `decision-record.md` already contains DR-005 through DR-012.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:63-148]
- The actual coverage gap is **supersession tracking**. No later decision record explicitly retires or amends DR-004 after the rollout expanded from 4 phases to 12 and absorbed code-graph work into the same packet.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:53-61][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:122-133][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:153-168]

## New Findings

### [P2] F025 - DR-004 still presents a 4-phase independently deployable rollout as live guidance even though the shipped packet and later decisions now operate on a 12-phase shared-artifact plan

- The decision record still states “4 phases, independently deployable” with Phase 1 as the immediate-value slice.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:53-61]
- The parent spec’s active phase table has moved to a 12-phase rollout, and DR-011 explicitly keeps the later code-graph phases inside this same spec packet.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:153-168][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:122-133]
- The current phase docs also show shared-runtime coupling that no longer reads like the unchanged four-phase decomposition, most explicitly where Phase 2 shares `session-prime.ts` with Phase 1.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:18-19][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:43-45]
- **Impact:** reviewers using `decision-record.md` as the authoritative rollout history still see stale phase rationale and can misread current packet drift as implementation slippage rather than an undocumented change in the rollout plan.
- **Fix:** append an explicit “superseded by later 12-phase packet expansion” note to DR-004, or add a new DR that records the packet-wide phase expansion and retires the original four-phase framing.

## Summary

- DR-001, DR-002, and DR-003 are still followed by the current implementation/runtime wiring.
- DR-004 is no longer current as written; the packet evolved to 12 phases without an explicit superseding decision entry.
- No missing post-DR-004 numbering gap exists; the missing traceability artifact is a supersession/amendment for DR-004 itself.
- New findings delta: **+0 P0, +0 P1, +1 P2**.
