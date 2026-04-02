# Iteration 014: D3 Traceability Re-verification

## Focus

Re-verify the prior D3 findings from iterations 004 and 008 against the current parent spec/checklist, phase specs 005/006/011/012, and the live hook/code-graph/CocoIndex runtime surfaces.

## Prior Finding Status

### 1. Spec/checklist claims overstate hook integration and the 3-source merge pipeline - CONFIRMED

- The parent spec still describes a three-system compaction architecture and positions hooks as transport for the same retrieval primitives used elsewhere.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:54-67]
- The parent checklist still marks CocoIndex semantic neighbors, code-graph complementarity, and the compaction working-set pipeline as complete.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:39-43][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:55-63]
- The live PreCompact hook still fills the merge input with empty `constitutional` and `triggered` sections and uses a static CocoIndex hint rather than real retrieval results.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-189]
- The shared compaction helper still routes compaction through `autoSurfaceMemories(...)`, which is the older memory-only path rather than the documented working-set/CocoIndex merge.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:283-317]
- `session-prime.ts` still tells users the compact brief was auto-recovered via "3-source merge (Memory + Code Graph + CocoIndex)", so the runtime text also overstates what actually ran.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:55-60]

### 2. Spec references still point to obsolete hook paths/modules - CONFIRMED

- The parent spec still documents hook sources under `.opencode/skill/system-spec-kit/scripts/hooks/claude/` and compiled output under `scripts/dist/hooks/claude/*.js`.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:98-110]
- The current hook implementation and compiled entrypoints live under `mcp_server/hooks/claude/` and `mcp_server/dist/hooks/claude/`, as reflected by the shipped system skill docs.[SOURCE: .opencode/skill/system-spec-kit/SKILL.md:740-752]
- The parent spec's problem statement also still claims `.claude/CLAUDE.md` does not exist, but the Claude-specific recovery guide is present.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:23-29][SOURCE: .claude/CLAUDE.md:1-33]

### 3. Phases 005, 006, 011, and 012 are still marked complete while only partially implemented - CONFIRMED

- Phase 005 remains partial: the agent/runtime guidance has largely been updated and `/memory:save` documents Stop-hook duplicate detection, but the canonical `/spec_kit:resume` contract still repeats bare `memory_context({ mode: "resume" })` recovery paths without `profile: "resume"`.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/checklist.md:15-35][SOURCE: .opencode/command/spec_kit/resume.md:257-262][SOURCE: .opencode/command/spec_kit/resume.md:276-279][SOURCE: .opencode/command/spec_kit/resume.md:291-291][SOURCE: .opencode/command/spec_kit/resume.md:354-360][SOURCE: .opencode/command/memory/save.md:133-140][SOURCE: .claude/agents/context.md:346-349][SOURCE: .opencode/agent/context.md:356-359][SOURCE: .codex/agents/context.toml:337-340][SOURCE: .gemini/agents/context.md:346-349]
- Phase 006 remains partial: the docs exist, but they still claim the hook path calls the same shared retrieval primitives and that the compact merger combines Memory + Code Graph + CocoIndex, which is not what the reviewed compaction hook executes.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/006-documentation-alignment/checklist.md:17-19][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/006-documentation-alignment/checklist.md:31-35][SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-765][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-189]
- Phase 011 remains partial: the phase spec/checklist still describe working-set-driven graph/CocoIndex compaction, but the runtime path is not wired to a persisted working set and still relies on transcript heuristics plus empty Memory sections.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/spec.md:18-19][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/spec.md:66-87][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist.md:15-37][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:141-189]
- Phase 012 remains partial: `.claude/mcp.json`, `session-prime.ts`, and the `ccc_*` tool registrations are real, but the checklist still claims semantic-neighbor compaction and reverse semantic augmentation that the reviewed hook/context handler do not perform.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/checklist.md:25-40][SOURCE: .claude/mcp.json:27-35][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:74-98][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:152-155][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-26][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:33-83]

### 4. Phase 008's tree-sitter delivery description no longer matches the shipped indexer - CHANGED

- The drift is narrower than iteration 008 reported because the Phase 008 checklist now truth-syncs the shipped parser to a regex-based implementation and explicitly relegates tree-sitter to a future enhancement.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/checklist.md:15-17]
- The mismatch is still open because the phase spec title/summary and the parent phase table continue to present tree-sitter as the shipped contract.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/spec.md:14-19][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/spec.md:22-30][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:163-168]

### 5. Phase 010's bridge contract is still broader in spec/checklist than in code - CONFIRMED

- The phase spec/checklist still promise a richer `code_graph_context` contract: provider-preserving seeds, an object-shaped `subject`, explicit `semanticSeeds` / `resolvedAnchors`, and a text fallback path as part of the tool contract.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:17-33][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:35-66][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:98-145][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/checklist.md:15-25][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/checklist.md:37-41]
- The current handler accepts a reduced argument shape, collapses provider-specific seeds down to `filePath`/line ranges, and returns a simplified JSON envelope that omits the richer spec-level contract fields.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:9-31][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:39-83]

## New Findings

No new P0 or P1 findings in this pass.

### [P2] The parent spec still mixes historical pre-hook status text with current shipped runtime state

- The parent spec still says the current system relies on manual AI-driven recovery, claims `.claude/CLAUDE.md` is absent, and labels Code Graph as only "Designed (phases 008+)" even though hook guides and code-graph tool registrations are already present in the repository.[SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:23-29][SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:122-126][SOURCE: .claude/CLAUDE.md:1-33][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-26]
- Impact: a reader using the parent spec as the current contract still sees a hybrid of old "problem statement" truth and new implementation-phase truth, which makes it harder to tell whether a mismatch is intentional history or live drift.
- Fix: split historical research/problem framing from the current implementation contract, or rewrite the parent spec's problem/status sections so they describe the present runtime and reserve earlier gaps for a historical note or decision record.

## Verified Healthy Deltas

- The agent-side CocoIndex-first guidance is now aligned across `.claude`, `.opencode`, `.codex`, and `.gemini`, so the remaining Phase 005 drift is concentrated in the canonical `/spec_kit:resume` command rather than in all runtime agent definitions.[SOURCE: .claude/agents/context.md:346-349][SOURCE: .opencode/agent/context.md:356-359][SOURCE: .codex/agents/context.toml:337-340][SOURCE: .gemini/agents/context.md:346-349]
- The CocoIndex server registration and `ccc_status` / `ccc_reindex` / `ccc_feedback` tool surface are live, so the Phase 012 gap is now specifically about semantic integration depth rather than basic availability.[SOURCE: .claude/mcp.json:27-35][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-26]

## Summary

- Re-verification outcome: the core D3 findings from iterations 004 and 008 still stand.
- Narrowed drift: Phase 008 is no longer a full packet mismatch because its checklist now acknowledges the regex parser, but the spec-level tree-sitter contract still needs truth-syncing.
- Net-new issue this pass: one additional P2 on the parent spec's stale pre-hook / pre-code-graph status framing.
