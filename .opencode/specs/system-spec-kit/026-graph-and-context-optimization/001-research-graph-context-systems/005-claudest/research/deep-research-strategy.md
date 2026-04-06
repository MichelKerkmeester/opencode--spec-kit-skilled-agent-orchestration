---
title: Deep Research Strategy - 005-claudest
description: Runtime strategy file tracking deep research on the Claudest external repo (marketplace, claude-memory, get-token-insights) for applicability to Code_Environment/Public.
---

# Deep Research Strategy - Session Tracking (005-claudest)

Session for phase `005-claudest` deep research. Iteration dispatch is overridden to `cli-codex` (`gpt-5.4`, reasoning effort `high`, `--full-auto`/fast mode). Sandbox `workspace-write` so Codex iterations can write iteration-NNN.md directly.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Drive iterative deep research across the `external/` Claudest checkout, tracing marketplace structure, the `claude-memory` plugin (FTS5/BM25 recall, automatic SessionStart injection, learning-extraction agents), and the `get-token-insights` observability dashboard, and translating each into concrete recommendations for `Code_Environment/Public`.

### Usage

- **Init:** This file was populated from `scratch/phase-research-prompt.md` §6 research questions, §7 Do's, §8 Don'ts, §10 Scope Boundaries, and §11 Deliverables.
- **Per iteration:** `cli-codex` reads Next Focus, investigates with read-only inspection of `external/`, and writes evidence into `research/iterations/iteration-NNN.md`. The reducer then refreshes sections 7-11.
- **Mutability:** Mutable for analyst-owned sections; machine-owned sections rewritten by reducer.
- **Protection:** Shared state with explicit ownership boundaries.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Research the external Claudest repo at `005-claudest/external/` and identify concrete improvements for `Code_Environment/Public`, especially around: (1) Claude Code plugin marketplace structure, (2) conversation memory with FTS5/BM25 ranking, (3) automatic context injection on session start, (4) learning extraction with batch-processing agents (memory-auditor, signal-discoverer), and (5) token-usage observability dashboards (get-token-insights).

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: How does Claudest's plugin discovery model actually work from `external/.claude-plugin/marketplace.json` through per-plugin `external/plugins/*/.claude-plugin/plugin.json`, and what would a comparable marketplace layer mean for `Code_Environment/Public`?
- [x] Q2: What does the `claude-memory` SQLite schema actually store in `projects`, `sessions`, `branches`, `messages`, `branch_messages`, and FTS tables, and why is branch-level aggregation important for BM25-ranked recall? (files: `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`)
- [x] Q3: How does automatic context injection work at SessionStart and clear time, including session selection rules, cached `context_summary` usage, fallback behavior, and the exact shape of injected context? (files: `external/plugins/claude-memory/hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, `skills/recall-conversations/scripts/memory_lib/summarizer.py`)
- [x] Q4: How does `recall-conversations` expose search and chronological browsing, and what does its BM25/FTS5 -> FTS4 -> `LIKE` cascade imply for portability and ranking quality? (files: `skills/recall-conversations/SKILL.md`, `scripts/search_conversations.py`, `scripts/recent_chats.py`)
- [x] Q5: How does `extract-learnings` move information from raw conversation recall into the memory hierarchy, and how do `memory-auditor` and `signal-discoverer` divide verification vs discovery work during consolidation mode? (files: `skills/extract-learnings/SKILL.md`, `memory-auditor.md`, `signal-discoverer.md`)
- [x] Q6: How does the memory hierarchy `CLAUDE.md -> repo CLAUDE.md -> MEMORY.md -> topic files` compare with `Code_Environment/Public`'s current Spec Kit Memory + `MEMORY.md` model? Where are the approaches complementary vs redundant?
- [x] Q7: How does `get-token-insights` parse raw JSONL files into analytics tables, normalize model pricing and cache tiers, and derive metrics like cache cliffs, skill usage, subagent usage, and hook latency? (files: `skills/get-token-insights/SKILL.md`, `scripts/ingest_token_data.py`, `templates/dashboard.html`)
- [x] Q8: What exactly does the HTML dashboard surface, and which dashboard sections or data contracts would be most valuable for `Code_Environment/Public` without copying the full presentation layer?
- [x] Q9: How do plugin versioning and auto-update work in practice, including root marketplace manifests, per-plugin manifests, and the `/plugin` marketplace auto-update flow? Preserve any version discrepancies between root and plugin-local manifests.
- [ ] Q10: Which Claudest ideas are implementation-backed and ready to borrow (`adopt now`), which need prototyping because they depend on Claude-specific local JSONL formats or plugin runtime behavior (`prototype later`), and which should be rejected because Public already covers the capability another way (`reject`)?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Deep analysis of peripheral plugins unless they expose a marketplace-level architecture pattern (explicit out-of-scope: `claude-content` deep dive).
- Generic Claude Code usage tips unrelated to marketplace/memory/observability.
- Installing or executing live plugins or depending on `/plugin` runtime behavior.
- Rewriting `Code_Environment/Public` around Claudest's exact plugin runtime.
- Duplicating work from sibling phase `001-claude-optimization-settings` (which extracts Reddit-post audit patterns). This phase examines the implementation.
- Describing `Code_Environment/Public` as "lacking memory" - compare against current Spec Kit Memory + `generate-context.js` + `MEMORY.md` baseline instead.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 10 key questions answered with source-backed evidence.
- `research/research.md` has at least 5 evidence-backed findings, each citing exact `external/plugins/` or `external/.claude-plugin/` paths.
- Every finding has a recommendation label (`adopt now` | `prototype later` | `reject`).
- Cross-phase overlap with `001-claude-optimization-settings` is explicitly resolved.
- Convergence composite score > 0.60 (weighted vote: rolling-average, MAD noise floor, question coverage >= 0.85).
- Max iterations = 10 reached.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: How does Claudest's plugin discovery model actually work from `external/.claude-plugin/marketplace.json` through per-plugin `external/plugins/*/.claude-plugin/plugin.json`, and what would a comparable marketplace layer mean for `Code_Environment/Public`?
- Q2: What does the `claude-memory` SQLite schema actually store in `projects`, `sessions`, `branches`, `messages`, `branch_messages`, and FTS tables, and why is branch-level aggregation important for BM25-ranked recall? (files: `external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py`)
- Q3: How does automatic context injection work at SessionStart and clear time, including session selection rules, cached `context_summary` usage, fallback behavior, and the exact shape of injected context? (files: `external/plugins/claude-memory/hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, `skills/recall-conversations/scripts/memory_lib/summarizer.py`)
- Q4: How does `recall-conversations` expose search and chronological browsing, and what does its BM25/FTS5 -> FTS4 -> `LIKE` cascade imply for portability and ranking quality? (files: `skills/recall-conversations/SKILL.md`, `scripts/search_conversations.py`, `scripts/recent_chats.py`)
- Q5: How does `extract-learnings` move information from raw conversation recall into the memory hierarchy, and how do `memory-auditor` and `signal-discoverer` divide verification vs discovery work during consolidation mode? (files: `skills/extract-learnings/SKILL.md`, `memory-auditor.md`, `signal-discoverer.md`)
- Q6: How does the memory hierarchy `CLAUDE.md -> repo CLAUDE.md -> MEMORY.md -> topic files` compare with `Code_Environment/Public`'s current Spec Kit Memory + `MEMORY.md` model? Where are the approaches complementary vs redundant?
- Q7: How does `get-token-insights` parse raw JSONL files into analytics tables, normalize model pricing and cache tiers, and derive metrics like cache cliffs, skill usage, subagent usage, and hook latency? (files: `skills/get-token-insights/SKILL.md`, `scripts/ingest_token_data.py`, `templates/dashboard.html`)
- Q8: What exactly does the HTML dashboard surface, and which dashboard sections or data contracts would be most valuable for `Code_Environment/Public` without copying the full presentation layer?
- Q9: How do plugin versioning and auto-update work in practice, including root marketplace manifests, per-plugin manifests, and the `/plugin` marketplace auto-update flow? Preserve any version discrepancies between root and plugin-local manifests.

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the root marketplace first made the rest of the evidence easy to interpret because it established the catalog schema and exact plugin set before comparing local manifests. (iteration 1)
- Reading the schema first made the search scripts easy to interpret because the branch/message split explains both the FTS tables and the result-hydration queries. (iteration 2)
- Reading the hook registration and injector together made the lifecycle boundary and cache-vs-fallback split obvious very quickly. (iteration 3)
- Reading the skill first made the later agent docs much easier to map onto the overall consolidation lifecycle. (iteration 4)
- Reading the parser, analytics builder, and dashboard contract together made it easy to trace each derived metric from raw JSONL field to UI payload. (iteration 5)
- Reading the inline script and the deploy step together made the dashboard's true contract boundary very obvious. (iteration 6)
- Reading the hierarchy description and placement rules together made the overlap with Spec Kit Memory much clearer than reading the recall engine docs alone. (iteration 7)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The prompt's example plugin path for `get-token-insights` did not exist in this checkout, so it could not serve as the comparison manifest. (iteration 1)
- Nothing failed materially. (iteration 2)
- The mirrored plugin was not at repo-root `external/`, so the first read attempt failed until I resolved the phase-local `external/` copy. (iteration 3)
- The initial path assumption was too shallow because this packet vendors `claude-memory` under the spec-local `external/` tree, not repo root. (iteration 4)
- The initial repo-root path assumption was wrong because this research packet vendors the plugin inside its own `external/` subtree. (iteration 5)
- Nothing failed materially. (iteration 6)
- The requested plugin-local `CLAUDE.md` was absent, so the layer model had to be inferred from adjacent documentation instead of a single canonical file. (iteration 7)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead.

### `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file.

### `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution.

### Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract.

### Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer.

### Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout.

### No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration.

### None this iteration -- BLOCKED (iteration 3, 3 attempts)
- What was tried: None this iteration
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration

### None this iteration. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration.

### Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive.

### The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`.

### The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`.

### Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted.

### Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation.

### Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- The prompt suggested `external/plugins/get-token-insights/.claude-plugin/plugin.json` as an example comparison target, but that plugin folder does not exist in this checkout; I switched the comparison read to `external/plugins/claude-skills/.claude-plugin/plugin.json`. (iteration 1)
- Treating per-plugin `plugin.json` as the place where update behavior is configured; the inspected manifests only expose package metadata, not update controls. (iteration 1)
- None this iteration (iteration 2)
- None this iteration (iteration 2)
- None this iteration (iteration 3)
- The fallback path is not a special "last 3 exchanges" renderer in current source, even though `_build_fallback_context()` says that in its docstring; the implementation mirrors the same short-session/full render and long-session first-2 plus last-6 structure used by `render_context_summary()`. (iteration 3)
- `external/plugins/claude-memory/skills/extract-learnings/SKILL.md` rules out the idea that consolidation writes raw recalled conversations directly into memory. The source inserts ranking, deduplication, target-layer selection, proposal review, and approval before execution. (iteration 4)
- No `skills/extract-learnings/scripts/` directory exists under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/skills/extract-learnings/`, so there were no script-level consolidation helpers to inspect this iteration. (iteration 4)
- Copying `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` wholesale into Code_Environment/Public. The reusable value is the data contract and derived metrics, not the specific HTML/CSS/Chart.js presentation layer. (iteration 5)
- Initial path resolution at repo root failed because `get-token-insights` lives under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/...`, not under a top-level `external/` directory in this checkout. (iteration 5)
- Borrowing the full `dashboard.html` presentation layer: inline CSS theme tokens, scanline overlay, fixed ticker, collapsible section behavior, Chart.js wiring, Google Fonts dependency, and the SVG-specific skill chart are not the durable value. They are transport and styling decisions, not the underlying contract. (iteration 6)
- None this iteration. (iteration 6)
- Reusing the "Skills to Consider Disabling" widget as-is. The useful part is still `skill_usage[].{skill,count,errors}`; the disable-table copy and threshold (`count <= 2`) is opinionated product policy, not a reusable observability primitive. (iteration 6)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/plugins/claude-memory/CLAUDE.md` does not exist, so the plugin-specific layer description had to be reconstructed from the plugin README and `extract-learnings` skill instead. (iteration 7)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/MEMORY.md` does not exist, so the Public-side comparison used `CLAUDE.md`, the `system-spec-kit` skill, and `generate-context.js` rather than a top-level repo memory file. (iteration 7)
- Treating a repo-root `MEMORY.md` as necessary for Public. The current model works without one because retrieval is MCP-backed and spec-folder-scoped rather than file-rooted. (iteration 7)
- Treating Claudest's hierarchy as a drop-in replacement for Public's memory stack. Public already has stronger retrieval, richer scoping, and explicit spec-folder context preservation. (iteration 7)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 8 should focus on Q10 synthesis: roll up all prior findings into the adopt now / prototype later / reject matrix. This is the meta-question and works best as a synthesis pass rather than another fresh iteration.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Prior memory
No prior Spec Kit Memory matches for "Claudest claude-memory plugin marketplace" (memory_context returned zero results with evidence gap).

### Related context surfaced by auto-surface hook (adjacent, not directly about Claudest)

- `system-spec-kit/023-hybrid-rag-fusion-refinement/013-fts5-fix-and-search-dashboard` — prior FTS5 work in Public's own memory MCP. Useful comparison for Claudest's FTS5/BM25 cascade.
- `system-spec-kit/024-compact-code-graph/003-stop-hook-tracking` — prior token tracking / Stop-hook work. Useful comparison for `get-token-insights` cache-cliff detection.
- `system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme` — memory MCP documentation context.
- `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` — prior signal-extraction implementation. Directly relevant to Claudest's `signal-discoverer` agent.

### Repo baseline to compare against
`Code_Environment/Public` already has: Spec Kit Memory (`memory_context`, `memory_search`, `memory_save`), `generate-context.js` structured saves, session continuity with `session_bootstrap`/`session_resume`, `MEMORY.md` agent-facing index, importance tiers in frontmatter, `.opencode/skill/` as a skill-distribution surface. It does NOT currently have: a `.claude-plugin/marketplace.json`-style marketplace manifest, a Claude-JSONL token auditor that emits an HTML dashboard, or Stop-time cached `context_summary` persistence on branches.

### Cross-phase awareness
Phase `001-claude-optimization-settings` extracts lessons from the Reddit audit post (pattern side). This phase `005-claudest` examines the implementation side. Do not restate audit patterns - focus on what the Claudest source actually does.

### External repo layout (seen at init)
`.claude-plugin/`, `.github/`, `.gitignore`, `.pre-commit-config.yaml`, `CHANGELOG.md`, `CLAUDE.md`, `README.md`, `docs/`, `plugins/` (dir), `pyproject.toml`, `scripts/`, `tests/`.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Dispatch override: iteration agent = `cli-codex` (`codex exec --model gpt-5.4 -c model_reasoning_effort=high --full-auto --sandbox workspace-write`). Default `@deep-research` agent is NOT used for iteration dispatch in this session.
- Current generation: 1
- Started: 2026-04-06T14:35:44Z
<!-- /ANCHOR:research-boundaries -->
