# Iteration 010: Final Synthesis — Implementation Blueprint
## Focus: Synthesize all validated findings into a code-verified implementation blueprint for tool routing enforcement across MCP instructions, session priming, reactive hints, runtime docs, and agent bootstrap surfaces.

## Implementation Blueprint: file-by-file with LOC estimates

### Summary
The core research conclusion still holds: the universal enforcement point is `buildServerInstructions()`, because it is computed during MCP startup and passed to `server.setInstructions()` before the transport is connected. That makes it the only guaranteed pre-tool-call injection point across hook-compatible and non-hook runtimes. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-646`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1593-1598`]

Two implementation details changed after code verification:
1. `SessionSnapshot` already includes `cocoIndexAvailable`; only `routingRecommendation` still needs to be added. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:17-25`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:67-104`]
2. The actual runtime instruction files are `CLAUDE.md`, `.claude/CLAUDE.md`, `CODEX.md`, and `GEMINI.md`. The workspace does **not** contain `.codex/CODEX.md`, `.gemini/GEMINI.md`, or `.gemini/agents/context-prime.md`, so the spec/task list should be normalized to the real paths before implementation begins. [SOURCE: workspace listing via `view` on repo root, 2026-04-01] [SOURCE: `glob` results for `**/CODEX.md`, `**/GEMINI.md`, and `{.gemini,.codex,.claude,.opencode,.agents}/**/context-prime.md`, 2026-04-01]

### REQ-complete file list

| Order | File | Est. LOC | Change |
|---|---|---:|---|
| 1 | `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | 8-15 | Add `routingRecommendation` derived from `graphFreshness` + `cocoIndexAvailable`; do **not** re-add `cocoIndexAvailable` because it already exists. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:17-25`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:53-104`] |
| 2 | `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` | 28-40 | Extend `PrimePackage` with `routingRules: string[]`; populate it inside `buildPrimePackage()` from graph freshness and CocoIndex availability. Mirror the same routing rules in the first-tool-call prime package returned by `primeSessionIfNeeded()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:63-70`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:366-415`] |
| 3 | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | 85-110 | Add a compact **Tool Routing** section to `buildServerInstructions()`; extend the mirrored `primePackage` type with `routingRules`; render those rules in `injectSessionPrimeHints()`; add reactive routing hints into the existing `envelope.hints` pipeline for `memory_context`/`memory_search` code-search misuse. This file is the correct integration seam because it already owns both dynamic instructions and JSON-envelope hint injection. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:151-171`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:530-565`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-646`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788-879`] |
| 4 | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | 18-30 | Strengthen descriptions for `memory_context`, `memory_search`, `code_graph_query`, and `code_graph_context` so the tool catalog itself tells the model: semantic/concept search -> CocoIndex, structural relationships -> Code Graph, exact text/path -> Grep/Glob. `code_graph_query` currently describes capability but not routing intent. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:47-50`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:637-663`] |
| 5 | `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md` | 25-35 | Add a constitutional memory with the canonical decision tree: semantic/concept -> CocoIndex, structural/call graph -> Code Graph, exact text/regex/path -> Grep/Glob. This should be the single source of truth reused by docs and hook text. Constitutional memories are already surfaced automatically. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:144-174`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:929-935`] |
| 6 | `CLAUDE.md` | 10-16 | Replace passive wording with an active decision tree. The file already has a strong code-search protocol, so this is mostly a canonical wording refresh and tighter “escape hatch” framing for exact text lookups. [SOURCE: `CLAUDE.md:78-113`] |
| 7 | `.claude/CLAUDE.md` | 6-10 | Add hook-aware routing reinforcement so Claude sessions treat hook payloads as additive, not substitutes for the routing decision tree. Current file only describes hook behavior, not tool-choice enforcement. [SOURCE: `.claude/CLAUDE.md:5-24`] |
| 8 | `CODEX.md` | 8-12 | Update the actual Codex runtime instruction file with the same active routing decision tree. Current guidance already distinguishes semantic vs structural retrieval, so the change is additive enforcement language, not a rewrite. [SOURCE: `CODEX.md:28-46`] |
| 9 | `GEMINI.md` | 8-12 | Update the actual Gemini runtime instruction file at repo root; there is no `.gemini/GEMINI.md` in this workspace. [SOURCE: repo-root `GEMINI.md` exists in workspace listing, 2026-04-01] [SOURCE: `glob` for `**/GEMINI.md` returned only repo-root `GEMINI.md`, 2026-04-01] |
| 10 | `.opencode/agent/context-prime.md` | 8-12 | Add a routing block to the Prime Package output format so the bootstrap result explicitly shows the decision tree, not just tool availability. Current output format lists session context, health, and next steps only. [SOURCE: `.opencode/agent/context-prime.md:114-133`] |
| 11 | `.claude/agents/context-prime.md` | 8-12 | Same change as OpenCode/Copilot runtime copy. [SOURCE: `.claude/agents/context-prime.md:114-133`] |
| 12 | `.codex/agents/context-prime.md` | 8-12 | Same change as Codex runtime copy. [SOURCE: `.codex/agents/context-prime.md:114-133`] |
| 13 | `.agents/agents/context-prime.md` | 8-12 | Same change as generic shared copy. [SOURCE: `.opencode/agent/context-prime.md:114-133`] [SOURCE: `glob` results for context-prime agent files, 2026-04-01] |
| 14 | `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | 30-45 | Extend the existing dynamic-instructions and source-structure tests to assert: (a) Tool Routing section is present, (b) routing text is availability-aware, and (c) session-prime hints include rendered routing rules. This file already contains the right harness and `buildServerInstructions()` assertions. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1278-1335`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2198-2385`] |
| 15 | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-surface-routing.vitest.ts` (new) | 65-90 | Add focused unit coverage for `buildPrimePackage()` / routing rule derivation and for the soft-routing classifier used by reactive hints. This is the cleanest way to satisfy SC-002 without overloading the already-large `context-server.vitest.ts`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364`] |

**REQ-complete estimate:** **327-463 LOC**.

### Recommended consistency add-ons (strongly advised for REQ-004 parity)

| File | Est. LOC | Why |
|---|---:|---|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | 12-18 | Claude hook startup text currently lists tools and stale-graph warnings, but not the routing decision tree. If hooks fire before the first MCP tool call, this omission creates inconsistent first-turn guidance relative to MCP instructions. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-121`] |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | 10-16 | Gemini startup hook has the same gap: tool overview without routing rules. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:69-85`] |

**REQ-complete + hook-consistency estimate:** **349-497 LOC**.

### Dependency ordering
1. **Normalize the file map first.** Treat the actual runtime files as `CLAUDE.md`, `.claude/CLAUDE.md`, `CODEX.md`, `GEMINI.md`, plus the four existing `context-prime.md` copies. This prevents planning against nonexistent `.codex/.gemini` paths. [SOURCE: workspace listing via `view` on repo root, 2026-04-01] [SOURCE: `glob` results for runtime docs and agent files, 2026-04-01]
2. **Add `routingRecommendation` to `SessionSnapshot`.** This is the smallest shared state addition and unlocks both server-instruction and priming logic. `cocoIndexAvailable` is already there, so this is low-risk and should be done before touching rendering layers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:17-25`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:53-104`]
3. **Extend `PrimePackage` in `memory-surface.ts`.** Add `routingRules` where routing data is first assembled on the server side. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:63-70`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364`]
4. **Update `context-server.ts` next.** This file consumes both snapshot and prime-package data, so it should be changed after the upstream shapes exist. It also owns the existing hint pipeline, making it the correct place for REQ-001 and REQ-003. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:530-565`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-646`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788-879`]
5. **Update `tool-schemas.ts`.** Once the runtime behavior is implemented, align the tool catalog copy with the enforcement rules. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:637-663`]
6. **Create `gate-tool-routing.md`.** The constitutional memory should reflect the final routing language, not a draft that later diverges from code and runtime docs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:144-174`]
7. **Update runtime docs and `context-prime` agent copies.** These should consume the canonical decision tree from the implementation, not invent variants. [SOURCE: `CLAUDE.md:78-113`] [SOURCE: `CODEX.md:28-46`] [SOURCE: `.opencode/agent/context-prime.md:114-133`]
8. **Update hook startup scripts (recommended).** This closes the only remaining first-turn inconsistency for hook-compatible CLIs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-121`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:69-85`]
9. **Finish with tests and grep verification.** Existing `context-server.vitest.ts` is already the canonical place for dynamic-instructions assertions. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1278-1335`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2198-2385`]

## Gap Analysis: spec vs research

### REQ-001 — `buildServerInstructions()` includes tool-routing rules
**Research status:** Correctly identified as the universal enforcement point.

**Verified code gap:** `buildServerInstructions()` currently emits memory counts, search channels, key tools, and a Session Recovery block, but no routing decision tree. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-646`]

**Implementation gap to close:** Add a compact Tool Routing block that is availability-aware and preserves the exact-text/regex escape hatch described in the spec risk section. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:138-141`]

### REQ-002 — PrimePackage includes routing directives
**Research status:** Correctly identified, but earlier plan text understated shape duplication.

**Verified code gap:** `PrimePackage` exists already and already contains `cocoIndexAvailable`; what is missing is `routingRules`, plus the mirrored `primePackage` shape in `context-server.ts`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:63-70`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:161-168`]

**Implementation gap to close:** Add `routingRules` in both places and render them in `injectSessionPrimeHints()`, otherwise REQ-007 becomes only partially satisfied. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:552-562`]

### REQ-003 — Tool response hints redirect misjudgment
**Research status:** Correct in concept, but the code-verified seam is narrower than the research summary implied.

**Verified code gap:** There is already a generic `envelope.hints` pipeline in `context-server.ts`, but no routing-specific classifier. Passive enrichment is response-text-based; it does not see the original tool arguments, so by itself it is not sufficient for `memory_context` / `memory_search` misuse detection. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788-811`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:821-879`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:144-213`]

**Implementation gap to close:** Reactive routing hints should be injected in `context-server.ts` using the dispatched tool name + args, then appended to the existing `envelope.hints` array as soft suggestions.

### REQ-004 — All runtimes receive enforcement
**Research status:** Broadly correct, but incomplete on startup-path parity.

**Verified code gap:** MCP dynamic instructions cover all CLIs once the server connects, but Claude/Gemini also have hook startup scripts that currently show tool availability without routing rules. If left unchanged, hook-compatible CLIs will still see weaker first-turn guidance than non-hook CLIs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-121`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:69-85`]

**Implementation gap to close:** Decide whether hook-session-prime updates are in-scope for REQ-004 or an explicit consistency add-on. I recommend treating them as part of the enforcement rollout.

### REQ-005 — Constitutional memory for routing
**Research status:** Correct.

**Verified code gap:** Only `gate-enforcement.md` exists today; there is no tool-routing constitutional memory yet. [SOURCE: `glob` for `**/gate-*.md` under system-spec-kit returned only `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, 2026-04-01]

**Implementation gap to close:** Add `gate-tool-routing.md` and keep it short enough to remain always-on without crowding higher-value constitutional content.

### REQ-006 — Runtime instruction files updated
**Research status:** Correct target, but the path list in the spec/plan is partially wrong.

**Verified code gap:** The real files are `CLAUDE.md`, `.claude/CLAUDE.md`, `CODEX.md`, and `GEMINI.md`. The earlier plan/spec references to `.codex/CODEX.md` and `.gemini/GEMINI.md` do not match the workspace. [SOURCE: workspace listing via `view` on repo root, 2026-04-01] [SOURCE: `glob` for `**/CODEX.md` and `**/GEMINI.md`, 2026-04-01]

**Implementation gap to close:** Normalize the spec/task file list before coding or at least treat those spec paths as aliases for the real files.

### REQ-007 — Context-prime agent outputs routing rules
**Research status:** Correct, but actual runtime coverage is four agent files, not five.

**Verified code gap:** The `context-prime` output format currently has no routing section. There are four existing copies to update: `.opencode/agent/context-prime.md`, `.claude/agents/context-prime.md`, `.codex/agents/context-prime.md`, and `.agents/agents/context-prime.md`. There is no `.gemini/agents/context-prime.md` in this repo. [SOURCE: `.opencode/agent/context-prime.md:114-133`] [SOURCE: `glob` results for context-prime agent files, 2026-04-01]

**Implementation gap to close:** Add the same compact routing block to all four real copies and correct the task list accordingly.

## Risk Assessment: per layer

### Layer 1 — MCP server instructions (`buildServerInstructions()`)
**Risk:** Low.

**Why:** The code path is startup-only and additive. The main risk is token bloat or stale availability messaging because instructions are computed once per server start. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:602-605`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-646`]

**Mitigation:** Keep the routing block under ~200 tokens, make it availability-aware, and preserve the exact-text/regex escape hatch so the model is not told to use CocoIndex for literal grep tasks. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:138-141`]

### Layer 2 — Session priming / PrimePackage
**Risk:** Low to medium.

**Why:** The data model is duplicated between `memory-surface.ts` and `context-server.ts`, so field drift is possible if only one side is edited. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:63-70`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:161-168`]

**Mitigation:** Add `routingRules` in both places in the same change and cover the shape in unit tests. Also prefer derived routing rules over free-form prose so behavior stays deterministic.

### Layer 3 — Reactive response hints
**Risk:** Medium.

**Why:** This is the only layer that must classify tool misuse dynamically. Over-broad heuristics could nag on legitimate exact-text lookups; under-broad heuristics will miss the misjudgment cases the phase is trying to fix. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788-879`]

**Mitigation:** Use soft suggestions only, scope them to `memory_context` and `memory_search`, require obvious semantic/structural phrases, and suppress hints when CocoIndex/Code Graph are unavailable.

### Layer 4 — Runtime docs + constitutional memory
**Risk:** Low.

**Why:** These are additive guidance surfaces, but the main operational risk is drift across files if wording forks. [SOURCE: `CLAUDE.md:78-113`] [SOURCE: `CODEX.md:28-46`]

**Mitigation:** Author one canonical routing decision tree in `gate-tool-routing.md` and copy its wording into docs/agents/hook scripts with only runtime-specific wrappers.

### Layer 5 — Hook startup surfaces (recommended add-on)
**Risk:** Low.

**Why:** The hook scripts already emit compact startup text. The risk is mainly output-length creep, not functional breakage. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-121`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:69-85`]

**Mitigation:** Add a 2-3 line routing decision tree only; do not duplicate the full MCP instruction payload.

## Remaining Open Questions: if any
1. **Inline vs helper extraction for routing hints:** Should the query-classification logic stay inline in `context-server.ts` for a smaller patch, or move into a small helper for testability? My recommendation: inline is acceptable for the minimal patch; helper extraction is cleaner if maintainers prefer a slightly larger diff.
2. **REQ-004 scope boundary:** Should Claude/Gemini `session-prime.ts` updates be considered mandatory for this phase, or tracked as a consistency add-on? Technically MCP instructions cover all runtimes, but hook startup text still shapes first-turn behavior on hook-compatible CLIs.
3. **Routing recommendation shape:** Should `routingRecommendation` in `SessionSnapshot` be a single concise string or a typed enum plus prose? I recommend a single concise string to avoid unnecessary type churn and token overhead.
4. **Compliance metrics:** The spec asks whether compliance tracking should exist. I recommend **deferring** metrics to a later phase; nothing in the current code path suggests they are needed to make the routing fix effective.

## Final Verdict: ready for implementation? yes/no + conditions
**Yes — ready for implementation, with two normalization conditions and no technical blocker.**

Conditions:
1. Treat the real runtime instruction files as `CLAUDE.md`, `.claude/CLAUDE.md`, `CODEX.md`, and `GEMINI.md`, not nonexistent `.codex/.gemini` copies. [SOURCE: workspace listing via `view` on repo root, 2026-04-01] [SOURCE: `glob` results for `**/CODEX.md` and `**/GEMINI.md`, 2026-04-01]
2. Decide up front whether Claude/Gemini hook startup text belongs inside REQ-004 scope or is shipped as a same-PR consistency add-on. I recommend including it in the same PR because the extra LOC is small and it removes the only remaining first-turn inconsistency. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-121`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:69-85`]

If those two conditions are accepted, the implementation can proceed in a single dependency-ordered PR without touching CocoIndex or Code Graph core logic. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:82-86`]

## Key Questions Answered: which Qs this addresses
- **Q1:** What is the universal enforcement point across hook-compatible and non-hook CLIs? -> `buildServerInstructions()` plus `server.setInstructions()` at MCP startup. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-646`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1593-1598`]
- **Q2:** Where should reactive routing hints be injected? -> The existing `envelope.hints` path in `context-server.ts`, not a new protocol wrapper. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788-879`]
- **Q3:** Which fields already exist vs still need implementation? -> `cocoIndexAvailable` already exists in both `SessionSnapshot` and `PrimePackage`; `routingRecommendation` and `routingRules` do not. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:17-25`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:63-70`]
- **Q4:** What are the real runtime files to update? -> `CLAUDE.md`, `.claude/CLAUDE.md`, `CODEX.md`, `GEMINI.md`, plus four existing `context-prime` copies; not the nonexistent `.codex/.gemini` paths from the draft task list. [SOURCE: workspace listing via `view` on repo root, 2026-04-01] [SOURCE: `glob` results for runtime docs and context-prime files, 2026-04-01]
- **Q5:** What is the final implementation size and order? -> REQ-complete 327-463 LOC, or 349-497 LOC with hook-startup consistency add-ons, in the dependency order listed above.

## New Information Ratio: 0.22
This final iteration is mostly synthesis, but it did add three non-trivial corrections to the earlier research: (1) `cocoIndexAvailable` is already implemented in `SessionSnapshot` and `PrimePackage`, (2) the spec/task file map is partially wrong for Codex/Gemini runtime docs and agent copies, and (3) REQ-003 should plug into the existing `envelope.hints` pipeline rather than inventing a new response wrapper. Those corrections materially affect the implementation plan, LOC estimate, and dependency order.
