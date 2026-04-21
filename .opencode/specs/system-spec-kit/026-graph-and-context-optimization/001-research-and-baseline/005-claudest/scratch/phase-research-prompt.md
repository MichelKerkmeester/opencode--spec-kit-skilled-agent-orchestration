# $refine TIDD-EC Prompt: 005-claudest

## 1. Header

Use the H1 above as the canonical phase prompt title for `005-claudest`.

## 2. Role

You are a specialist in Claude Code plugin marketplace architecture, conversation memory systems with FTS5/BM25 ranking, learning extraction pipelines, and token-usage observability tooling.

Work like a source-first systems analyst. Separate marketplace README claims from plugin implementation, trace hook and SQLite flows end to end, and translate Claudest's concrete design into practical improvements for `Code_Environment/Public`.

Operate with RICCE compliance throughout:
- **Role** is explicit and domain-specific.
- **Instructions** are ordered, path-specific, and execution-ready.
- **Context** is grounded in the checked-in repo and sibling phases.
- **Constraints** are explicit about scope, dependencies, and overlap.
- **Examples** are concrete, file-anchored, and reusable.

## 3. Task

Research Claudest's marketplace structure, the `claude-memory` plugin's automatic context injection and learning extraction patterns, and the `get-token-insights` observability dashboard to identify improvements for `Code_Environment/Public`'s plugin discovery, conversation memory, and token-usage observability.

The goal is not a generic plugin summary. The goal is a repo-specific translation layer: determine what Claudest proves in source, what is only documented at README level, and what `Code_Environment/Public` should adopt now, prototype later, or reject.

## 4. Context

### 4.1 System Description

Claudest is a Claude Code plugin marketplace distributed through `/plugin marketplace add gupsammy/claudest`. In this checkout it exposes eight plugins through `.claude-plugin/marketplace.json`, with `claude-memory` as the flagship. Root documentation positions the marketplace around installable plugin discovery, per-plugin version manifests, and optional marketplace auto-update through the Claude Code `/plugin` UI. The repo is Python-based, targets Python 3.7+, and keeps runtime dependencies minimal.

`claude-memory` combines automatic session recall, branch-aware SQLite storage, and a memory hierarchy that flows from global `CLAUDE.md` to repo `CLAUDE.md` to `MEMORY.md` and detailed topic files. Its storage layer uses SQLite with FTS5 and BM25 when available, FTS4 or `LIKE` fallback otherwise, and caches pre-rendered session summaries in the `branches` table so SessionStart injection becomes a fast lookup instead of replaying raw transcripts. The main user-facing surfaces are automatic context injection, `recall-conversations`, and `extract-learnings`.

The same plugin also contains `get-token-insights`, the observability feature referenced indirectly by phase `001`. That skill parses raw Claude JSONL session files into analytics tables, estimates per-turn cost using model-specific pricing and cache tier normalization, computes workflow metrics for skills, agents, and hooks, and renders an interactive HTML dashboard. Treat Claudest as the implementation packet behind the audit narrative surfaced earlier in phase `001`, not as a separate unrelated tool.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Claude Optimization Settings (Reddit post) | Config audit + cache hooks | 005 (auditor implementation lives here) | Phase 001 extracts patterns from the post; 005 examines the implementation |
| 002 | codesight | Zero-dep AST + framework detectors | None | Different problem domain |
| 003 | contextador | MCP server + queryable structure + Mainframe | None | Different problem domain |
| 004 | graphify | Knowledge graph (NetworkX + Leiden) | None | Different problem domain |
| 005 | claudest | Plugin marketplace + claude-memory + get-token-insights | 001 (related research) | Focus marketplace structure, memory plugin, plugin discovery, observability |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with `memory_search`, session continuity, `generate-context.js` for structured memory saves, an agent-facing `MEMORY.md` pattern, and importance tiers in frontmatter. It also already has `.opencode/skill/` as its own plugin-like skill distribution surface.

What this repo does **not** currently show is Claude Code marketplace integration comparable to `.claude-plugin/marketplace.json`, nor a `claude-memory`-style token auditor that ingests local Claude JSONL files and emits an HTML dashboard. Do not describe Public as lacking memory or retrieval. Compare Claudest against the current stack, not a blank slate.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat `external/` as read-only.
2. Read repo guidance first: start with relevant `AGENTS.md` instructions, then inspect the phase folder layout before editing any markdown.
3. Read the external repo in this order before synthesizing findings: `external/README.md`, `external/CLAUDE.md`, `external/.claude-plugin/marketplace.json`, `external/plugins/`, `external/docs/`, and `external/pyproject.toml`.
4. Start the domain walkthrough with marketplace structure, not plugin internals: enumerate the installed plugin catalog, the discovery model, the per-plugin manifest pattern, and the version duplication between `.claude-plugin/marketplace.json` and plugin-local `.claude-plugin/plugin.json`.
5. Then focus on `external/plugins/claude-memory/`. Read its `README.md`, `hooks/hooks.json`, `hooks/memory-context.py`, `hooks/sync_current.py`, and the shared library under `skills/recall-conversations/scripts/memory_lib/`, especially `db.py` and `summarizer.py`.
6. Trace one full automatic context-injection flow end to end: SessionStart hook registration -> session selection -> cached `context_summary` lookup -> fallback rendering -> `hookSpecificOutput.additionalContext` injection -> Stop/import-time summary computation.
7. Read the recall layer next: `skills/recall-conversations/SKILL.md`, `scripts/search_conversations.py`, and `scripts/recent_chats.py`. Capture the actual query interface, BM25 usage, project filtering, and fallback behavior.
8. Read the learning-extraction layer after recall: `skills/extract-learnings/SKILL.md`, then the `memory-auditor.md` and `signal-discoverer.md` agent files. Treat consolidation mode, layer placement, and batch-processing workflow as first-class research targets.
9. Read the observability layer next: `skills/get-token-insights/SKILL.md`, `scripts/ingest_token_data.py`, and `templates/dashboard.html`. Focus on JSONL ingestion, pricing normalization, cache cliff detection, workflow analytics, and dashboard output contracts.
10. Cross-reference this phase with sibling phase `001-claude-optimization-settings`, because the Reddit post discussed there points at the auditor implemented here. Use phase `001` to avoid duplicate findings and to explain why 005 is implementation-oriented.
11. Before deep research begins, ensure this phase folder contains Level 3 Spec Kit docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`. Use `@speckit` for markdown authoring when the runtime allows it; otherwise preserve the same Level 3 expectations manually.
12. Save canonical research output under `research/`, with `research/research.md` as the final report. The report must contain at least five findings, and every finding must cite exact `external/plugins/` or `external/.claude-plugin/` paths.
13. Validate the phase folder with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest" --strict
    ```
14. Run `spec_kit:deep-research` using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external and identify concrete improvements for Code_Environment/Public, especially around Claude Code plugin marketplace structure, conversation memory with FTS5/BM25 ranking, automatic context injection on session start, learning extraction with batch-processing agents, and token-usage observability dashboards.
    ```
15. After research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest"
    ```

## 6. Research Questions

1. How does Claudest's plugin discovery model actually work from `.claude-plugin/marketplace.json` through per-plugin `.claude-plugin/plugin.json`, and what would a comparable marketplace layer mean for `Code_Environment/Public`?
2. What does the `claude-memory` SQLite schema actually store in `projects`, `sessions`, `branches`, `messages`, `branch_messages`, and FTS tables, and why is branch-level aggregation important for BM25-ranked recall?
3. How does automatic context injection work at SessionStart and clear time, including session selection rules, cached `context_summary` usage, fallback behavior, and the exact shape of injected context?
4. How does `recall-conversations` expose search and chronological browsing, and what does its BM25/FTS5 -> FTS4 -> `LIKE` cascade imply for portability and ranking quality?
5. How does `extract-learnings` move information from raw conversation recall into the memory hierarchy, and how do `memory-auditor` and `signal-discoverer` divide verification vs discovery work during consolidation mode?
6. How does the memory hierarchy `CLAUDE.md -> repo CLAUDE.md -> MEMORY.md -> topic files` compare with `Code_Environment/Public`'s current Spec Kit Memory + `MEMORY.md` model, and where are the approaches complementary versus redundant?
7. How does `get-token-insights` parse raw JSONL files into analytics tables, normalize model pricing and cache tiers, and derive metrics like cache cliffs, skill usage, subagent usage, and hook latency?
8. What exactly does the HTML dashboard surface, and which dashboard sections or data contracts would be most valuable for `Code_Environment/Public` without copying the full presentation layer?
9. How do plugin versioning and auto-update work in practice, including root marketplace manifests, per-plugin manifests, and the `/plugin` marketplace auto-update flow described in the README?
10. Which Claudest ideas are implementation-backed and ready to borrow, which need prototyping because they depend on Claude-specific local JSONL formats or plugin runtime behavior, and which should be rejected because Public already covers the capability another way?

## 7. Do's

- Do examine the `claude-memory` SQLite schema in detail, especially FTS tables, `branch_messages`, `aggregated_content`, `context_summary`, and `summary_version`.
- Do trace one full session-start context injection flow from hook registration to cached-summary injection.
- Do study `memory-auditor.md` and `signal-discoverer.md` as separate roles in the learning-extraction pipeline.
- Do inspect the `get-token-insights` pricing and cache-normalization logic directly in source before repeating any README claims.
- Do compare the `CLAUDE.md -> MEMORY.md -> topic files` hierarchy with Public's Spec Kit Memory and `generate-context.js` workflow.
- Do distinguish marketplace-level patterns, memory-layer patterns, and observability-layer patterns instead of collapsing them into one feature bucket.

## 8. Don'ts

- Don't analyze every Claudest plugin equally. `claude-memory` is the flagship, and `get-token-insights` is the direct overlap point with phase `001`.
- Don't conflate this phase with phase `001`. Phase `001` extracts lessons from the Reddit post; phase `005` examines the implementation that produced that audit.
- Don't focus on marketing copy, shields, or release badges when the plugin code proves something narrower or more precise.
- Don't try to install plugins or exercise runtime behavior that depends on a live Claude Code plugin environment.
- Don't describe `Code_Environment/Public` as lacking memory or retrieval just because it lacks Claudest's exact packaging model.
- Don't spend the phase on peripheral plugins like `claude-content` unless they expose a marketplace-level architectural pattern relevant to discovery, versioning, or distribution.

## 9. Examples

### Example Finding: Cached summary injection turns startup recall into a database lookup

```text
**Finding: claude-memory shifts session-start context injection from transcript replay to cached branch summaries**
- Source: external/plugins/claude-memory/hooks/hooks.json; external/plugins/claude-memory/hooks/memory-context.py; external/plugins/claude-memory/hooks/sync_current.py; external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/summarizer.py; external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py
- What it does: Stop-time and import-time paths compute `context_summary` and `context_summary_json` for each active branch, store them on the `branches` table, and SessionStart reads the cached markdown summary before emitting `hookSpecificOutput.additionalContext`.
- Why it matters: `Code_Environment/Public` already has session continuity, but this packet shows a concrete pattern for separating cheap startup orientation from on-demand deep recall without replaying raw transcripts.
- Recommendation: prototype later
- Affected area: session recovery, startup context injection, memory artifact design
- Risk/cost: medium; the pattern is strong, but it depends on reliable deterministic summarization heuristics and a storage model that matches Public's current memory boundaries
```

Use that level of specificity for every major finding:
- exact source paths
- what the implementation really does
- why it matters for `Code_Environment/Public`
- recommendation label
- affected subsystem
- risk, ambiguity, or validation cost

## 10. Constraints

### 10.1 Error Handling

- Claudest plugins are Python-based and may rely on local system tools, Claude runtime conventions, or user-home directory paths like `~/.claude/` and `~/.claude-memory/`. Call those dependencies out explicitly.
- If a behavior is only documented in the README but not confirmed in source, label it as README-level rather than source-proven.
- If a recommendation depends on Claude-local JSONL formats, plugin runtime events, or `/plugin` marketplace behavior that Public does not currently own, name that dependency instead of implying drop-in portability.
- If version numbers differ between root marketplace and plugin-local manifests, preserve the discrepancy explicitly and treat it as part of the versioning model.

### 10.2 Scope Boundaries

**IN SCOPE**

- marketplace structure and discovery model
- `claude-memory` architecture
- FTS5/BM25 conversation recall
- automatic context injection
- learning extraction and consolidation agents
- memory hierarchy design
- `get-token-insights` ingestion, normalization, and dashboard contracts
- versioning and marketplace auto-update pattern
- comparison with Public's current memory and observability surfaces

**OUT OF SCOPE**

- peripheral plugin feature deep dives unless they reveal marketplace architecture
- generic Claude Code usage tips
- trying to install or execute live plugins
- unrelated sibling-phase systems like AST detector design, Mainframe caches, or knowledge graphs
- rewriting Public around Claudest's exact plugin runtime

### 10.3 Prioritization Framework

Use a standard impact-effort matrix. Prioritize, in order:
1. high-impact / low-effort memory or observability ideas that complement Public's current stack
2. high-impact / medium-effort startup injection or dashboard concepts that need prototyping
3. marketplace ideas that are strategically interesting but require Claude-plugin distribution work
4. low-impact / high-effort clone-the-whole-system ideas to reject

Cross-reference phase `001` before finalizing findings so the implementation packet does not duplicate the audit-method packet.

## 11. Deliverables

- `research/research.md` with at least 5 evidence-backed findings
- every finding cites exact `external/plugins/` or `external/.claude-plugin/` paths
- a comparison section mapping Claudest patterns against Public's current Spec Kit Memory and skill-distribution model
- explicit recommendation labels: `adopt now`, `prototype later`, or `reject`
- a section on plugin discovery/versioning and another on token-usage observability
- updated `checklist.md`
- `implementation-summary.md` created at the end

Minimum finding schema:
- finding title
- exact source evidence
- evidence type: source-proven, README-level, or mixed
- what Claudest does
- why it matters for `Code_Environment/Public`
- recommendation
- affected subsystem
- risk, ambiguity, or validation requirement

## 12. Evaluation Criteria

| Dimension | Target |
| --- | --- |
| TIDD-EC completeness | All required sections are materially present |
| RICCE completeness | Role, Instructions, Context, Constraints, and Examples are explicit and usable |
| Evidence quality | Each major finding cites exact Claudest paths |
| Repo alignment | Findings compare against Public's current memory and skill surfaces |
| Domain focus | Analysis stays on marketplace structure, memory, and observability |
| Cross-phase discipline | Overlap with phase `001` is explicit and bounded |
| Actionability | Recommendations are concrete enough to drive later planning |
| CLEAR score | `>= 40/50` |

Minimum evidence bar:
- at least 5 findings
- each finding cites a specific Claudest path
- each finding explains why it matters for this repo
- each finding includes a recommendation label
- cross-phase overlap with `001` is resolved explicitly

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order covered marketplace manifests first, then `claude-memory`, then recall, extraction, and observability internals
- the exact validation command ran on this exact phase folder
- the exact deep-research topic string is used
- `research/research.md` contains at least 5 evidence-backed findings
- `checklist.md` is updated with evidence
- `implementation-summary.md` exists
- memory is saved successfully for `005-claudest`
- cross-phase overlap with `001` is addressed directly
- the work stays focused on plugin discovery, conversation memory, learning extraction, and token observability rather than broad marketplace summary
