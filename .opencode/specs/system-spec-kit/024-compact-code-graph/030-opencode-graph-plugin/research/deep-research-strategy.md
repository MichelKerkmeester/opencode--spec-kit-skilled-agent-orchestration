---
title: Deep Research Strategy
description: Tracks research progress, focus decisions, and outcomes across iterations for the 030-opencode-graph-plugin packet.
---

# Deep Research Strategy

Tracks research progress across iterations for `.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/research/`.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Determine whether the `opencode-lcm` plugin's memory-injection method should be reused for packet 024's compact code graph work, and identify any storage, ranking, privacy, repair, portability, or hook-runtime patterns worth porting into Spec Kit Memory and the broader code-graph runtime.

This run was first extended with 10 additional delegated research iterations via `cli-copilot` using `gpt-5.4` at `high` effort in 5 waves of 2.
It was then extended again with 10 local runtime-loader iterations focused on the surviving `plugin.auth` startup crash in live OpenCode.

### Usage

- **Init:** Started from the existing packet folder the user specified.
- **Per iteration:** Each pass covered one layer: runtime hooks, storage/search internals, packet 024 comparison, and recommendation synthesis.
- **Mutability:** This file records both stable analyst intent and the final reducer-style conclusions for the completed run.
- **Protection:** Research output is advisory only. No runtime code or external plugin source was modified.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Analyze `external/opencode-lcm-master` as an OpenCode plugin reference and answer two questions:
1. How should we utilize its plugin method for our compact code graph work?
2. Which of its ideas improve Spec Kit Memory itself, beyond packet 024?
3. Which of its ideas improve our existing code-graph hooks, startup/compaction flow, and operational tooling?
4. How should those expanded findings be sequenced and decomposed into future packets without reintroducing transport/storage confusion?
5. Why does live OpenCode still crash with `TypeError: null is not an object (evaluating 'plugin.auth')` even after prompt-shape and export-shape adjustments?
6. What does the packed runtime actually expect from local plugin files, explicit plugin specifiers, and module exports?

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What are the actual OpenCode hook points the plugin uses?
- [x] Does the plugin inject memory by prompt transforms, compaction notes, or both?
- [x] Which parts overlap with packet 024 decisions and existing Spec Kit Memory capabilities?
- [x] What is the recommended adoption path for packet 024?
- [x] Which plugin internals are broadly valuable for the memory system?
- [x] Which plugin internals improve the existing code-graph runtime, hooks, and compaction flow?
- [x] What are the new portability, retrieval-shaping, and health-consistency gaps after 10 delegated Copilot research passes?
- [x] What is the dependency-ordered roadmap?
- [x] How should the future work be split into packets/workstreams?
- [x] How does the live OpenCode loader actually resolve local plugins versus config plugin entries?
- [x] What export/module shape is safest under the live OpenCode loader?
- [x] What is the most likely root-cause cluster for the surviving `plugin.auth` startup crash?

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Do not implement an OpenCode plugin in this pass.
- Do not modify the external plugin checkout.
- Do not change packet 024 root research or decision-record files.
- Do not save new memories outside the spec folder.
- Do not turn the current graph runtime into a transcript archive clone.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Stop once the external plugin's insertion points, storage model, search/ranking path, privacy layer, and repair path are all verified from source.
- Stop once the report distinguishes between "reuse as method", "reuse as code", and "do not reuse".
- Stop once packet 024 fit is stated as a concrete recommendation rather than a generic comparison.
- Stop once broader code-graph/hook recommendations are concrete enough to become follow-on implementation work.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- The plugin is best treated as an OpenCode adapter pattern, not a replacement memory engine.
- Its most reusable packet-024 idea is prompt-time injection through OpenCode plugin hooks, especially `experimental.chat.messages.transform` and `experimental.session.compacting`.
- Packet 024 should keep its clean-room code graph and existing memory backends, then optionally add an OpenCode plugin shell that asks our own stack for compact memory + graph payloads.
- The most valuable general-memory upgrades are doctor-style integrity repair, blob deduplication for large payloads, privacy pre-index filtering, snapshot portability, and optional summary DAGs for expandable archives.
- The most valuable broader graph/runtime upgrades are doctor/export-import/provenance-preview capabilities layered around the existing startup/compaction and structural-bootstrap flow rather than a replacement of that flow.
- The extended delegated research shows a stronger dependency chain: shared payload/provenance layer first, OpenCode adapter second, graph-runtime hardening third.
- The extended delegated research also supports a cleaner 3-packet split: transport adapter under 024, graph ops under 024, archive-durability work outside 024.
- The live OpenCode binary auto-discovers local plugin files from `{plugin,plugins}` directories and converts them to `file://` specifiers.
- Configured plugin values that do not start with `file://` are treated as package installs, not local repo file references.
- The live loader invokes every unique module export as a plugin function, which makes non-function exports unsafe.
- The surviving startup crash is best treated as a plugin materialization/resolution issue, not a prompt payload issue.

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the plugin's `README.md`, `src/index.ts`, `src/store.ts`, `src/store-search.ts`, `src/privacy.ts`, and tests gave a complete picture without needing any external web sources.
- Comparing against packet 024's decision record and code-graph spec immediately clarified what is already solved in our stack versus what remains missing.
- Pulling exact line-number evidence from both the plugin and our MCP server made the final recommendation much less speculative.
- A second-pass comparison against `startup-brief.ts`, `session-snapshot.ts`, `session-prime.ts`, `hook-state.ts`, `compact-merger.ts`, and `ensure-ready.ts` exposed that the next gap is operational durability, not structural retrieval quality.
- The Copilot GPT-5.4 high extension was especially useful for surfacing subtle consistency issues: hidden readiness diagnostics on read paths, path-derived graph identity portability limits, first-anchor bias in `code_graph_context`, and multiple competing recovery/snapshot planes as an over-port risk.
- Packed-runtime string extraction from the real Homebrew OpenCode binary was the decisive evidence source for the startup crash extension because the local package type definitions were not sufficient.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- A focused `memory_context` lookup for this exact plugin produced no direct prior research, so it was not useful as a knowledge source for the plugin itself.
- A CocoIndex search inside the external plugin path returned no indexed hits, so direct file reads were the authoritative route for this packet.
- Looking for a packet 024 phase called `020-cli-bootstrap-context` was a dead end; the live MCP source and packet decision record were stronger comparison artifacts anyway.
- Searching for broader graph-runtime ops inside our current handlers showed that the surface is intentionally narrow today, which confirmed absence of export/import/doctor capabilities but did not itself provide a fuller operational model.
- Delegated iterations that overlapped too much with earlier packet summaries were least useful; the strongest results came from forcing narrow scopes like seed resolution, stale semantics, and packet-boundary decomposition.
- Earlier fixes that only matched local `@opencode-ai/plugin` types turned out to be weaker than expected because the active binary and wrapper/config-root behavior introduced loader semantics that were not visible from the workspace package alone.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Exact prior-memory lookup -- BLOCKED (iteration 1, 1 attempt)
- What was tried: `memory_context` with focused mode scoped to `024-compact-code-graph`
- Why blocked: no direct prior memory existed for the `opencode-lcm` plugin
- Do NOT retry: unless new plugin-specific memory is saved later

### Semantic search inside vendored plugin -- BLOCKED (iteration 1, 1 attempt)
- What was tried: CocoIndex semantic search scoped to `external/opencode-lcm-master`
- Why blocked: the path did not return indexed results in this session
- Do NOT retry: use direct source reads for this checkout

### Live code comparison to a missing packet path -- BLOCKED (iteration 3, 1 attempt)
- What was tried: open a non-existent `020-cli-bootstrap-context` packet file
- Why blocked: file absent under packet 024
- Do NOT retry: use live MCP/hook implementation and packet root docs instead

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Adopt the full `opencode-lcm` archive as our main memory backend: ruled out because it duplicates an existing memory stack and is tightly bound to OpenCode plugin lifecycle APIs. [SOURCE: `external/opencode-lcm-master/src/index.ts:14-220`]
- Treat the plugin as a code-graph implementation: ruled out because its core archive is session/message centric, while packet 024 already defines a separate structural SQLite graph with `code_files`, `code_nodes`, and `code_edges`. [SOURCE: `external/opencode-lcm-master/src/store.ts:860-960`] [SOURCE: `009-code-graph-storage-query/spec.md:68-168`]
- Rebuild our whole hook/tool architecture around LCM: ruled out because packet 024 already decided on a hybrid hook + tool model and already exposes startup/session bootstrap surfaces. [SOURCE: `decision-record.md:39-99`] [SOURCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:21-57`]
- Replace the current compact-merger and structural-bootstrap flow: ruled out because our existing budgeted merge/deduplication and startup bootstrap flow already solves the compact-assembly problem; the missing pieces are portability, provenance, safety, and repair. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`]
- Add a second persistent recovery/snapshot plane on top of existing hook cache plus `session_resume`/`session_bootstrap`: ruled out because delegated risk analysis showed this would create competing authorities and operator confusion.

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Research complete. The next implementation-focused steps would be:

1. a follow-on packet for an OpenCode-specific adapter plugin that bridges `memory_context`/`code_graph_context` into OpenCode prompt transforms without introducing a second source of truth for memory retrieval
2. a follow-on hardening packet for graph-runtime operations: doctor/export-import/path-safety/provenance-preview improvements around the current compact graph and hook system
3. a separate archive-durability packet outside 024 for privacy compiler, blob dedupe tier, portable memory snapshots, and optional expandable archive DAGs
4. an immediate packet-030 runtime fix pass that collapses the plugin back to a single callable export and removes the bare package-style plugin specifier before retesting startup

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

- Packet 024 already recommends clean-room code graph work, complementary CocoIndex usage, and a hybrid hook + tool architecture rather than dependency adoption. [SOURCE: `decision-record.md:39-120`] [SOURCE: `research/research.md:31-86`]
- Current Spec Kit Memory already has startup instructions, session recovery digests, structural bootstrap guidance, tool routing guidance, and working-memory attention boosts. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:639-712`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:365-417`]
- Hook-capable runtimes already use shared retrieval primitives; OpenCode is explicitly the non-hook runtime that should recover with `session_bootstrap()` and `session_resume()`. [SOURCE: `.opencode/skill/system-spec-kit/references/config/hook_system.md:21-57`]
- Current graph-runtime internals already include startup briefs, bounded structural bootstrap, tempdir-backed hook state, and budgeted compaction merging; the missing layer is operational durability and portability. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47-115`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:204-260`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:14-198`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:106-197`]
- Current graph-runtime internals also reveal subtle internal gaps that matter before implementation: path-derived graph identities, hidden readiness diagnostics, inconsistent stale semantics, and unused working-set signals.
- Live startup investigation added another boundary: the real OpenCode binary and Superset wrapper must be treated as the runtime source of truth for plugin loading, because local package types can drift away from the packed loader behavior.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10 per extension wave
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-03T14:10:00+02:00
- Extended for loader crash analysis: 2026-04-04T09:10:00+02:00
<!-- /ANCHOR:research-boundaries -->
