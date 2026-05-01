### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L794), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L137)
- **What it does**: Mnemosyne’s hybrid BM25+vector story is still a memory-store story. Public already has a federated model: `memory_search` for memories, CocoIndex for semantic code intent, and code graph for structural questions.
- **Why it matters for us**: The architecture signal here is to keep planes distinct and route by task intent, not merge every embedding-backed system into one “hybrid retrieval” feature. Mnemosyne reinforces the value of a clear memory plane, but Public’s broader federation is the stronger design.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L113), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782)
- **What it does**: Mnemosyne’s README documents a one-time model download of about 500 MB, and the wrapper handles missing binaries with a string fallback. Its project auto-init is best-effort and does not inspect the `init` exit status before logging success. Public, by contrast, already models readiness and recovery through `session_bootstrap`, structural status, and explicit next actions.
- **Why it matters for us**: The paradigm shift is to treat offline model/backend warmup as architecture, not ops trivia. If Public ever adds heavier local inference backends, readiness, degraded mode, and repair guidance should stay first-class surfaces.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [gemini/compact-inject.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: compaction-hook leverage, API-surface vs handler reality, operational `core` vs pinning semantics, runtime facade layering, memory-vs-code retrieval boundaries, offline-first readiness tradeoffs
- Questions answered: The strongest paradigm shifts are not new ranking algorithms. They are API and runtime shifts: compaction should preserve memory behavior, retrieval posture must be explicit in the tool contract, pinning should be separated from governance tiers, OpenCode should get a curated facade over the governed MCP core, and memory retrieval should remain one plane in a federated routing stack. The exact validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: Reading the wrapper first, then tracing Public’s transport, prime, search, and routing surfaces made the real deltas obvious. The highest-value gaps are cross-layer seams where Public already has the primitive but does not surface it consistently.
- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory. The external checkout is also wrapper-thin, so backend ranking specifics remain README-documented rather than source-proven.

## Recommended Next Focus
Prototype one API-surface alignment slice instead of a backend rewrite: add an explicit OpenCode-facing retrieval facade that exposes `retrievalLevel` and `pin`, then extend the OpenCode compaction payload with bounded memory-behavior guidance so OpenCode reaches parity with the existing Claude/Gemini recovery pattern.

--- Iteration 14 ---
## Findings
For EACH finding:
### Finding N: [Title]
- **Source**: exact file path(s)
- **What it does**: technical description with code evidence
- **Why it matters for us**: concrete relevance
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Sources Consulted
- [file paths examined]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Reflection
- What worked: [approach that yielded results]
- What did not work: [approach that failed]

## Recommended Next Focus
[What to investigate next]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-research pass on the pre-approved phase folder. I’ll trace the external wrapper in the required order, run the strict validator as requested, then compare the strongest pattern end-to-end against our current memory surfaces.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.4.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Deep investigation requiring multiple rounds of discovery
- Topic spans 3+ technical domains or sources
- Initial findings need progressive refinement
- Overnight or unattended research sessions
- Research where prior findings inform subsequent queries

### When NOT to Use

- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

RESEARCH BRIEF:
# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main

## 2. Role

You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.

## 3. Task

Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.

The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.

What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.
8. Examine the `experimental.session.compacting` hook implementation in `src/index.ts` line by line. Treat this as the most novel feature of the phase: capture exactly what guidance is injected, when it runs, and how that compares with Public's structural compaction plugin in `.opencode/plugins/spec-kit-compact-code-graph.js`.
9. Only after the wrapper analysis, read `external/opencode-mnemosyne-main/README.md`. Use it to extract hybrid-search claims, model choice, AGENTS.md guidance, offline-first positioning, and the stated project/global collection model. Distinguish clearly between wrapper-verified behavior and backend claims that are only documented here.
10. Treat the Mnemosyne backend as an interface contract, not an implementation you can prove from this repo. Infer the wrapper-visible backend verbs (`init`, `search`, `add`, `delete`) and the documented hybrid-search behavior, but do not fabricate internal Go ranking logic that is not present in the checked-out plugin repository.
11. Compare Mnemosyne directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` for existing hybrid retrieval, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for session bootstrap/resume behavior, `.opencode/plugins/spec-kit-compact-code-graph.js` for compaction injection, and `.opencode/skill/mcp-coco-index/README.md` for semantic code-search positioning.
12. Resolve cross-phase boundaries explicitly. Do not redo phase `001` as generic FTS5 study or phase `003` as generic BM25 study. This phase owns wrapper-to-backend boundaries, vector-search implications, OpenCode plugin ergonomics, project/global scoping, AGENTS guidance, and memory-awareness compaction behavior.
13. Before deep research begins, ensure the phase folder contains the required Spec Kit docs for the chosen level. Validate the phase folder with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict
    ```
14. After validation passes, run deep research using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.
    ```
15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, say whether the evidence is wrapper-confirmed or README-level, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, and identify the affected subsystem. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"
    ```

## 6. Research Questions

1. How is hybrid retrieval presented at the plugin boundary: what does the README claim about BM25, vector similarity, and Reciprocal Rank Fusion, and what parts of that pipeline are actually visible from the wrapper?
2. Why does Mnemosyne use `snowflake-arctic-embed-m-v1.5`, and what should `Code_Environment/Public` learn from that model choice even if Public already has other embedding-backed retrieval systems?
3. How effective is Mnemosyne's project-vs-global scope split, and would a similar ergonomic separation improve Public's memory-save and recall flows without duplicating existing scoped retrieval features?
4. What exactly does the compaction hook preserve, and how does prompt-level tool guidance differ from Public's current structural-context compaction transport?
5. What operational value comes from the plugin auto-initializing the project collection and lazily initializing the global collection, and what failure or ambiguity risks come with deriving the project key from the directory basename?
6. How should the README's AGENTS.md recommendation be interpreted as workflow guidance: is it merely usage advice, or does it reveal a reusable memory-discipline pattern for Public sessions?
7. Compared with CocoIndex's semantic code search, what is unique about Mnemosyne's hybrid memory retrieval story, and where should those systems stay separate rather than merged?
8. Compared with Public's current `memory_search` pipeline, which Mnemosyne ideas are already covered, which are partial overlaps, and which are genuinely new?
9. How does the OpenCode plugin lifecycle shape adoption compared with MCP-server-based memory systems: installation, runtime assumptions, binary dependency management, and tool exposure ergonomics?
10. What are the practical implications of the offline-first design, including local model download cost, first-run latency, privacy benefits, and failure handling when the binary or model is missing?

## 7. Do's

- Do trace the full wrapper lifecycle in `src/index.ts`, not just the README summary.
- Do separate wrapper-confirmed behavior from backend claims documented only in `README.md`.
- Do trace the hybrid-search narrative end to end as a contract: query entry, quoted search handoff, backend search call, and fused-ranking claims.
- Do study project and global scoping as product decisions, not just CLI flags.
- Do examine the compaction hook as the phase's highest-priority differentiator for `Code_Environment/Public`.
- Do compare against current Public files so the research reflects today's hybrid retrieval and compaction behavior.
- Do note where the external repo has no extra architecture files or AGENTS file, and treat that absence as evidence about how thin the wrapper really is.

## 8. Don'ts

- Do not spend most of the analysis on Mnemosyne's unseen Go internals; they are a dependency, not the plugin repo under study.
- Do not conflate the TypeScript wrapper with the backend search implementation. State clearly when a claim is README-level rather than source-proven.
- Do not ignore the compaction hook; it is the most novel and transferable feature for `Code_Environment/Public`.
- Do not claim Public lacks hybrid BM25+vector memory retrieval when `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` already proves otherwise.
- Do not try to run the system unless the binary and model are already installed; static analysis is sufficient for this phase, and first-run model download is large.
- Do not collapse this phase into generic FTS5 or BM25 discussion already owned by phases `001` and `003`.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Hybrid-search contract finding

```text
**Finding: Hybrid retrieval is a documented backend contract, not a wrapper-owned algorithm**
- Source: external/opencode-mnemosyne-main/README.md; external/opencode-mnemosyne-main/src/index.ts
- What it does: The README states that Mnemosyne combines SQLite FTS5/BM25 and sqlite-vec cosine similarity with Reciprocal Rank Fusion, while the wrapper simply forwards quoted search queries to `mnemosyne search`.
- Why it matters: Public should not copy README marketing language into implementation plans without deciding whether the value lies in ranking math, wrapper ergonomics, or agent-facing tool guidance.
- Recommendation: prototype later
- Affected area: Spec Kit Memory retrieval positioning, future plugin or wrapper design
- Risk/cost: Medium; backend behavior is not directly inspectable from this repo
```

### Example B: Compaction-resilience finding

```text
**Finding: Memory-tool awareness survives compaction through prompt injection**
- Source: external/opencode-mnemosyne-main/src/index.ts; .opencode/plugins/spec-kit-compact-code-graph.js
- What it does: Mnemosyne appends a compact memory-usage instruction block during `experimental.session.compacting`, while Public's existing compaction plugin injects structural transport context rather than memory-tool reminders.
- Why it matters: Public may already preserve structural state across compaction, but it does not yet remind the agent of concrete memory tools in the same direct way.
- Recommendation: adopt now or prototype later, depending on desired runtime surface
- Affected area: compaction strategy, startup guidance, memory-tool ergonomics
- Risk/cost: Low to medium; prompt noise and duplicate instruction handling must be designed carefully
```

## 10. Constraints

### 10.1 Error handling

- If a claim is only present in the README and not in `src/index.ts`, label it as documented behavior, not source-confirmed implementation.
- If current `Code_Environment/Public` behavior contradicts the phase brief, correct the comparison to match the code.
- If the external repo structure differs from the assumed paths, preserve the same analytical order and document the actual files used.
- If a recommendation depends on backend internals that are not visible here, mark that gap explicitly instead of guessing.

### 10.2 Scope

**IN SCOPE**

- OpenCode plugin entry point and lifecycle
- CLI bridge design and error handling
- five memory tools and their ergonomics
- project/global scoping model
- documented hybrid search contract
- AGENTS.md integration guidance from the README
- compaction-hook behavior and comparison with Public
- offline-first operational tradeoffs

**OUT OF SCOPE**

- reverse-engineering the unseen Mnemosyne Go ranking internals
- generic TypeScript style commentary
- plugin publishing workflow details
- broad FTS5 or BM25 primers already covered by other phases
- speculative replacement of Public's existing retrieval stack without evidence

### 10.3 Prioritization framework

Rank findings in this order: compaction-resilience leverage, fit with Public's current hybrid retrieval stack, clarity of wrapper-vs-backend boundary, usefulness of project/global scoping ergonomics, offline-first operational value, implementation cost, and clean differentiation from phases `001` and `003`.

## 11. Deliverables

- `phase-research-prompt.md` present and tailored specifically to `004-opencode-mnemosyne-main`
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison against current Public files for hybrid retrieval, session recovery, compaction injection, and CocoIndex positioning
- each finding labeled `adopt now`, `prototype later`, or `reject`
- each finding states whether evidence is wrapper-confirmed, README-documented, or both
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- evidence type: wrapper-confirmed / README-documented / both
- what OpenCode Mnemosyne does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected subsystem
- migration, ambiguity, or validation risk

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in hybrid search, plugin architecture, scoping, and compaction resilience
  - **Instructions** are ordered, concrete, path-specific, and start with the plugin entry point
  - **Context** is domain-specific, cross-phase aware, and corrected to match current Public capabilities
  - **Constraints** clearly separate wrapper evidence from README-level claims
  - **Examples** show strong Mnemosyne-derived findings about hybrid search contracts and compaction hooks
- at least 5 findings are evidence-backed rather than generic
- cross-phase overlap with `001` and `003` is resolved explicitly
- findings compare Mnemosyne with current Public hybrid retrieval and compaction behavior rather than a stale baseline
- project/global scoping, AGENTS guidance, offline-first tradeoffs, and compaction survival are all covered directly

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with `src/index.ts`, then `package.json`, then the five tools, then the compaction hook, then `README.md`
- the exact validation command was used for this phase folder
- the exact deep-research topic string appears in the work
- `research/research.md` contains at least 5 evidence-backed findings
- each finding distinguishes wrapper-confirmed behavior from README-documented claims where needed
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `004-opencode-mnemosyne-main`
- no edits were made outside the phase folder
- overlap with phases `001` and `003` is explicitly bounded

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 015: DEEP DIVE - SECOND PATTERN

## Focus
DEEP DIVE - SECOND PATTERN: Go deep on the second most impactful pattern. Full implementation analysis.

## Findings
For EACH finding:
### Finding N: [Title]
- **Source**: exact file path(s)
- **What it does**: technical description with code evidence
- **Why it matters for us**: concrete relevance
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Sources Consulted
- [file paths examined]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Reflection
- What worked: [approach that yielded results]
- What did not work: [approach that failed]

## Recommended Next Focus
[What to investigate next]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-research pass on the pre-approved phase folder. I’ll do a quick memory pass for prior Mnemosyne/Public context, then trace the external wrapper in the required order and compare the second strongest pattern against our current memory surfaces.
exec
/bin/zsh -lc 'rg -n "mnemosyne|compaction|runtime facade|federated stack|hybrid-rag-fusion-upgrade|004-opencode-mnemosyne-main" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: No such file or directory

 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.4.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Deep investigation requiring multiple rounds of discovery
- Topic spans 3+ technical domains or sources
- Initial findings need progressive refinement
- Overnight or unattended research sessions
- Research where prior findings inform subsequent queries

### When NOT to Use

- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

Live lifecycle branches:
- `resume` — continue the active lineage
- `restart` — start a new generation with explicit parent linkage
- `fork` — branch from the current packet state
- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
| ON_DEMAND | Only on explicit request | Templates, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research"]},
    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle"]},
    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
}

NOISY_SYNONYMS = {
    "LOOP_SETUP": {"run research": 2.0, "investigate deeply": 1.8, "overnight research": 1.5},
    "ITERATION": {"another pass": 1.5, "keep searching": 1.4, "dig deeper": 1.6},
    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
}

RESOURCE_MAP = {
    "LOOP_SETUP": ["references/loop_protocol.md", "references/state_format.md", "assets/deep_research_config.json"],
    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
    "CONVERGENCE": ["references/convergence.md"],
    "STATE": ["references/state_format.md", "assets/deep_research_strategy.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active

def discover_markdown_resources(base_path: Path) -> list[str]:
    """Discover all .md files in the assets directory."""
    return sorted(str(p.relative_to(base_path)) for p in (base_path / "references").glob("*.md"))
```

### Phase Detection

Detect the current research phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists | Loop protocol, state format |
| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Quick reference |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-research "topic"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-research command│  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (final output)     │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-research (LEAF agent)  │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE research cycle  │
    │  - Writes: findings + state      │
    │  - Tools: WebFetch, Grep, etc.  │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-research-config.json       │  Persists across iterations
    │  deep-research-state.jsonl      │
    │  deep-research-strategy.md      │
    │  findings-registry.json          │
    │  research/iterations/iteration-NNN.md │
    │  research/research.md (workflow-owned │
    │  progressive synthesis)         │
    └─────────────────────────────────┘
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.

Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-research
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Determine focus
  |                                         3. Research (3-5 actions)
  |                                         4. Write iteration-NNN.md
  |                                         5. Update strategy.md
  |                                         6. Append state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile final research/research.md
  |
Save --> generate-context.js --> verify memory artifact
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
| **JSONL log** | Append-only structured log for lineage and iteration data |
| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |

codex
The external path differs from the phase prompt, so I’m re-anchoring on the actual directory layout before tracing more code. Next I’m locating the real wrapper files, then I’ll read `src/index.ts` in the mandated order and line up the Public comparison points alongside it.
exec
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/memory/.gitkeep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/.gitkeep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Task Group: 026 Batch Review Findings Remediation (002/003/008/010/013/014)
     2	scope: remediation pass that closes active P1 findings documented in parent `review/review-report.md` without rerunning deep-review iterations
     3	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for follow-up “fix findings” runs in 026 when the request is to patch documented review findings and verify closure across targeted packets
     4	
     5	## Task 1: Fix all active findings from synthesized 026 review report across six phases with targeted verification, outcome success
     6	
     7	### rollout_summary_files
     8	
     9	- rollout_summaries/2026-04-09T15-19-09-O7Hp-026_fix_batch_review_findings.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T17-19-09-019d72d3-6266-79c3-a21a-c0016dec6fcf.jsonl, updated_at=2026-04-09T17:16:36+00:00, thread_id=019d72d3-6266-79c3-a21a-c0016dec6fcf, task-local focus=close P1 findings in phases 002/003/008/010/013/014 and rerun strict/typecheck/tests)
    10	
    11	### keywords
    12	
    13	- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
    14	
    15	## User preferences
    16	
    17	- when the user requested “Fix all findings and recommendations documented in … review-report.md from all review iterations,” treat it as a remediation pass over the documented findings only; do not start new review iterations unless explicitly asked [Task 1]
    18	
    19	## Reusable knowledge
    20	
    21	- packet 002 status/traceability must reflect real downstream readiness; once the 010 validator exists, document 002 as “Implemented — predecessor verified” instead of blocked to avoid traceability P1 findings [Task 1]
    22	- packet 003 review references must point to real local review artifacts (for example `../review/003-memory-quality-issues/review-report.md`) so strict validator integrity checks pass [Task 1]
    23	- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
    24	- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
    25	- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
    26	- packet 014 enrichment claims must stay graph-local; remove wording that implies resume/bootstrap carriage and keep ownership with packet 011 payload validators [Task 1]
    27	- verification pattern that closed the set: `npm run typecheck`, focused Vitest for `graph-first-routing-nudge` + `sqlite-fts` + `handler-memory-search`, then strict validate over phases 002/003/008/010/013/014 [Task 1]
    28	
    29	## Failures and how to do differently
    30	
    31	- symptom: strict validation fails on packet 003 with missing parent review references; cause: spec/docs pointed to non-existent review paths; fix: use explicit relative links to local review artifacts under `../review/003-memory-quality-issues/` before rerunning strict validation [Task 1]
    32	
    33	# Task Group: 026 Batch-Phase Deep Review State Tracking, Continuations, and Iteration Extensions
    34	scope: per-phase deep-review packet execution under `026-graph-and-context-optimization/review/` with strict write-scope boundaries, shared-state synchronization, and continuation/extension handling
    35	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 026 batch-review runs in this checkout when asked to run, continue, or extend phase review iterations without touching runtime implementation files
    36	
    37	## Task 1: Execute Batch C deep reviews for phases 011-014 with scoped writes and state updates, outcome success
    38	
    39	### rollout_summary_files
    40	
    41	- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=011-014 packet generation + aggregate state bump to 8/13)
    42	
    43	### keywords
    44	
    45	- batch-phase-review-state.json, 026-graph-and-context-optimization/review/<phase-slug>, deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-dashboard.md, iteration-NNN.md, review-report.md, phasesCompleted 8/13
    46	
    47	## Task 2: Handle continuation command by validating completion state and consolidated report presence, outcome success
    48	
    49	### rollout_summary_files
    50	
    51	- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=resume check at 13/13 + consolidated report verification)
    52	
    53	### keywords
    54	
    55	- continue, phasesCompleted == totalPhases, status complete, batch-phase-review-consolidated.md, overall verdict FAIL, aggregate findings 0 P0 7 P1 0 P2
    56	
    57	## Task 3: Extend Batch A (002-005) from 5 to 10 iterations and re-sync per-phase + batch artifacts, outcome success
    58	
    59	### rollout_summary_files
    60	
    61	- rollout_summaries/2026-04-09T14-19-21-dEbR-batch_a_review_extensions_026_graph_context.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-21-019d729c-a473-7082-989e-7b5a71cf2227.jsonl, updated_at=2026-04-09T15:02:18+00:00, thread_id=019d729c-a473-7082-989e-7b5a71cf2227, task-local focus=iteration-006..010 extension for 002-005 + consolidated totals update)
    62	
    63	### keywords
    64	
    65	- extra stability passes, iteration-006..010, deep-review-state.jsonl append, deep-review-dashboard.md 10/10, deep-review-strategy.md max-iteration update, batch-phase-review-consolidated.md total iterations 83, no new findings
    66	
    67	## Task 4: Extend Batch B (006-010) to 10 iterations and re-sync program totals to 108, outcome success
    68	
    69	### rollout_summary_files
    70	
    71	- rollout_summaries/2026-04-09T14-19-26-Ga5w-batch_b_review_10_iteration_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-26-019d729c-b7c1-72c1-90c2-e72c0eb0d52e.jsonl, updated_at=2026-04-09T15:12:27+00:00, thread_id=019d729c-b7c1-72c1-90c2-e72c0eb0d52e, task-local focus=006-010 iteration-006..010 extension + convergence/aggregate sync)
    72	
    73	### keywords
    74	
    75	- batch-b, 006-010, deep-review-config.json maxIterations 10, deep-review-state.jsonl, iteration-006..010, deep-review-findings-registry.json convergenceScore 1.0, batch-phase-review-state.json, batch-phase-review-consolidated.md, total iterations 108
    76	
    77	## User preferences
    78	
    79	- when running 026 batch deep review, the user-required scope was explicit: writes limited to `026/review/<phase-slug>/*`, the shared state file, and optionally the consolidated report; keep review targets read-only and do not edit parent/runtime artifacts [Task 1]
    80	- when instructions include “write consolidated report only if all 13 phases are complete,” gate report creation on `phasesCompleted == totalPhases` and otherwise emit only the batch result summary [Task 1]
    81	- when the user replied “continue,” expected behavior was resume-aware verification (re-read state and artifacts) instead of restarting all phase reviews from scratch [Task 2]
    82	- when operator requested “extra stability passes,” extend each targeted phase from 5 to 10 iterations before closure and sync batch-level state/report immediately [Task 3][Task 4]
    83	
    84	## Reusable knowledge
    85	
    86	- authoritative tracker path is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-state.json`; every phase completion should update `phasesCompleted`, `phasesRemaining`, `phaseResults`, `aggregateFindings`, and `lastUpdated` in one pass [Task 1][Task 3][Task 4]
    87	- required per-phase packet set under `review/<phase-slug>/`: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `review-report.md` [Task 1][Task 3][Task 4]
    88	- continuation stop rule: if state already shows `13/13 complete` and `batch-phase-review-consolidated.md` exists, do not rerun phase loops; verify report/state alignment and close [Task 2]
    89	- extension workflow for confidence runs: add `iteration-006` through `iteration-010`, append JSONL rows, raise dashboard counters/convergence, refresh strategy + review report, then mirror new totals in batch state and consolidated report [Task 3][Task 4]
    90	- if `batch-phase-review-state.json` is missing, initialize the full 13-phase tracker first so later batch extension runs can update `iterationsCompleted` and aggregate counts deterministically [Task 4]
    91	- after extension passes, run a quick Python integrity check to confirm each phase packet has 10 iteration files and `deep-review-findings-registry.json` reports `convergenceScore: 1.0` before finalizing shared-state/consolidated totals [Task 4]
    92	
    93	## Failures and how to do differently
    94	
    95	- symptom: stale or conflicting batch totals (for example per-phase files at 10 iterations but global files still at 5); cause: extending iterations without re-syncing shared tracker/consolidated report; fix: treat `batch-phase-review-state.json` and `batch-phase-review-consolidated.md` as mandatory final sync targets after every extension pass [Task 3]
    96	- symptom: batch extension cannot be applied cleanly because tracker metadata is absent; cause: missing `batch-phase-review-state.json`; fix: seed the tracker with the canonical 13-phase structure before per-phase review updates [Task 4]
    97	
    98	# Task Group: 026 Packet Docs/Memory Alignment Audit and Commit-Split Discipline
    99	scope: strict Level 1-3+ doc and memory alignment under `026-graph-and-context-optimization` with metadata-only memory fixes and packet-group commit splits
   100	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 026 audit/alignment runs in this checkout when user asks for strict validation across packet folders without runtime code edits
   101	
   102	## Task 1: Align Level-3 parent + research packet docs/memory with strict-clean validation, outcome success
   103	
   104	### rollout_summary_files
   105	
   106	- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=research group + 32 memory metadata anchor normalization)
   107	
   108	### keywords
   109	
   110	- 026-graph-and-context-optimization, validate.sh --strict, metadata anchor closure, canonical-docs postflight evidence blocks, 32 memory files, docs(026-research), minimum edits required
   111	
   112	## Task 2: Align `003-memory-quality-issues` docs/memory with standalone packet commit, outcome success
   113	
   114	### rollout_summary_files
   115	
   116	- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-memory-quality) packet-local summary)
   117	
   118	### keywords
   119	
   120	- 003-memory-quality-issues, docs(026-memory-quality), packet commit split, validate.sh --strict, 9 phases 0 errors 0 warnings, metadata trailer restoration
   121	
   122	## Task 3: Align runtime packet docs/memory (002 and 004-014) while keeping runtime code untouched, outcome success
   123	
   124	### rollout_summary_files
   125	
   126	- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-runtime) and targeted validation on 002/014)
   127	
   128	### keywords
   129	
   130	- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 005-code-graph-upgrades, description.json memory/metadata.json untouched
   131	
   132	## User preferences
   133	
   134	- when the user asked to “Audit and align every Level 1-3+ spec document and every memory artifact under ...026...,” they expected strict `validate.sh --strict` runs on each target folder, minimum memory-only edits, and logical split commits without extra routing questions [Task 1][Task 2][Task 3]
   135	- when running runtime packet alignment, the user explicitly constrained scope to docs/memory trees and “NO runtime code edits”; future runs should leave runtime source and JSON ownership files untouched even if nearby files are dirty [Task 3]
   136	- after research-group work, the user expectation was a standalone packet commit per group with explicit before/after validator counts and memory-fix lists instead of bundled mega-commits [Task 1][Task 2][Task 3]
   137	
   138	## Reusable knowledge
   139	
   140	- high-yield preflight: run a metadata-anchor audioscope/normalization script before manual edits; in this rollout it caught all 32 files missing metadata closure faster than iterative validator reruns [Task 1]
   141	- memory fixes in this workflow stay bounded to frontmatter + metadata anchor/canonical block closure; do not rewrite narrative bodies, ids, or timestamps during audit cleanup [Task 1]
   142	- commit body format that repeatedly worked: folders touched, before/after ERROR+WARNING counts from strict validator runs, and per-memory reason notes for restored anchors/metadata [Task 1][Task 2][Task 3]
   143	- for runtime-group closeout, stage packet docs first, add newly surfaced memory files manually, then run targeted validators (for example 002 + 014) in addition to root validation so evidence is packet-local and auditable [Task 3]
   144	
   145	## Failures and how to do differently
   146	
   147	- symptom: repeated validator churn while memory files still fail metadata closure; cause: relying on phase-level validator output alone instead of direct anchor sweep; fix: run anchor audit script first, normalize all misses in one pass, then rerun strict validator [Task 1]
   148	
   149	# Task Group: 026/003 Packet 009 Post-Save Render Fixes and Wild-Save Review Closure
   150	scope: render-layer memory pipeline fixes in `003-memory-quality-issues/009-post-save-render-fixes` with acceptance anchored to a real 014 wild save and zero post-save-review issues
   151	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
   152	
   153	## Task 1: Ship 009 render-layer fixes (A-I lanes), tests, and final wild save with clean post-save review, outcome success
   154	
   155	### rollout_summary_files
   156	
   157	- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
   158	
   159	### keywords
   160	
   161	- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
   162	
   163	## User preferences
   164	
   165	- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]
   166	- for this packet family, user acceptance includes a real post-save round-trip using the target packet context (not only unit tests), and the final report should show zero post-save-review issues [Task 1]
   167	
   168	## Reusable knowledge
   169	
   170	- keep JSON payload overrides wired through normalizer/collector: `phase`, `status/sessionStatus`, and completion-percent aliases must map to `projectPhase`, `sessionStatus`, and `completionPercent` to prevent stale-default warnings [Task 1]
   171	- preserve authored `SUMMARY` text as full OVERVIEW when length is `<=800` chars via `renderOverviewSummary(..., truncateOnWordBoundary(...))`; only truncate longer payloads [Task 1]
   172	- reviewer OVERVIEW extraction is robust when heading/line-scanned between section boundaries, not regex-sliced; this prevents false D1 truncation flags on valid long summaries [Task 1]
   173	- trigger phrase filtering should block short folder-like numeric shorthands while preserving longer numeric authored phrases like `014 code graph upgrades runtime` [Task 1]
   174	- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
   175	- post-save quality warning language now keys on `input_completeness_score`; keep diagnostics terminology consistent with this field [Task 1]
   176	
   177	## Failures and how to do differently
   178	
   179	- symptom: D1 false positive for truncated OVERVIEW despite full saved paragraph; cause: regex extraction capped review window; fix: switch reviewer extraction to heading-based line scanning [Task 1]
   180	- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
   181	- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]
   182	
   183	# Task Group: 026/014 Code Graph Upgrades Runtime Closeout and Regression Floor
   184	scope: adopt-now runtime lane + docs closeout for `005-code-graph-upgrades` with detector provenance, blast-radius constraints, and explicit verification gates
   185	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for follow-on edits to 014 graph/query/session payload logic in this checkout when regression-floor and strict doc validation must stay green
   186	
   187	## Task 1: Implement 014 runtime/docs plus missing regression-floor test and strict verification sweep, outcome success
   188	
   189	### rollout_summary_files
   190	
   191	- rollout_summaries/2026-04-09T07-35-51-j53b-implement_014_code_graph_upgrades.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T09-35-51-019d712b-3824-7403-9e7e-a2a68ef35e61.jsonl, updated_at=2026-04-09T09:39:44+00:00, thread_id=019d712b-3824-7403-9e7e-a2a68ef35e61)
   192	
   193	### keywords
   194	
   195	- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
   196	
   197	## User preferences
   198	
   199	- when strict validation failed due to `implementation-summary.md` linking `014/spec.md`, the expectation was to fix path validity first and rerun strict checks; future docs should never reference non-existent relative markdown paths [Task 1]
   200	- when verification listed four scripts tests but only three executed, the expected behavior was to add the missing file and rerun; coverage claims must be backed by actual discovered files (`rg --files tests`) [Task 1]
   201	- packet closeout reporting should enumerate the same gate sequence explicitly (typecheck, server Vitest batch, scripts Vitest batch, strict validator) and keep out-of-scope packets untouched [Task 1]
   202	
   203	## Reusable knowledge
   204	
   205	- shipped 014 lane includes detector provenance vocabulary carriers, blast-radius traversal with explicit depth cap and union semantics, and low-authority hot-file breadcrumb evidence while preserving packet 011 trust-axis payloads [Task 1]
   206	- regression guard for this lane is the added file `scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts`; rerun it whenever detector/query surfaces change [Task 1]
   207	- doc closeout requires synchronized updates across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` with exact evidence pointers and explicit deferred-lane notes per ADR-003 [Task 1]
   208	
   209	## Failures and how to do differently
   210	
   211	- symptom: strict validator fails with missing file reference; cause: implementation summary linked `014/spec.md` instead of in-folder `spec.md`; fix: repair link before rerunning validator [Task 1]
   212	- symptom: scripts suite undercounts expected files; cause: missing regression-floor test file; fix: verify listed test files exist first, then rerun suite [Task 1]
   213	
   214	# Task Group: sk-code-opencode HEAD~10 TypeScript Scope Verification (Style-Only)
   215	scope: bounded style-verifier sweep over the exact HEAD~10 TypeScript diff under `.opencode/skill/system-spec-kit/` with hard stop on failing required verification gates
   216	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for user-requested sk-code-opencode conformance sweeps where scope and stop rules are explicitly fixed by git diff output
   217	
   218	## Task 1: Verify/fix sk-code-opencode drift on 87 in-scope TS files, outcome partial (halted after required suite failures)
   219	
   220	### rollout_summary_files

codex
I’ve confirmed the wrapper repo is directly under `external/`, not nested one level deeper. I’m pulling the prior iteration and the exact comparison files now so the next pass can stay focused on the second pattern instead of re-covering the facade-layer finding.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	### Lifecycle Contract
     2	
     3	- **Why it matters for us**: This suggests a paradigm shift from “smart backend, thin docs” to “strategy is part of the public contract.” If the runtime tells agents to use a retrieval posture, that posture needs to exist in the surfaced tool contract.
     4	- **Recommendation**: adopt now
     5	- **Impact**: high
     6	
     7	### Finding 3: Split memory policy into orthogonal axes instead of overloading tiers
     8	- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L203), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L291)
     9	- **What it does**: Mnemosyne’s `core` is a write-time operational flag. Public already has a separate operational dimension in ranking: `is_pinned = 1` bypasses decay and preserves raw importance weight. But Public’s save/update contracts expose tier and weight, not pinning.
    10	- **Why it matters for us**: The architecture should separate three concerns: governance/content tier (`constitutional`, `critical`), operational continuity (`pin`), and scope/visibility (`tenant`, `shared`, project alias). Mnemosyne’s simpler model makes that separation easier to see.
    11	- **Recommendation**: adopt now
    12	- **Impact**: high
    13	
    14	### Finding 4: Move from one universal memory surface to runtime-specific facades over a governed core
    15	- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L2), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L92), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L25), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
    16	- **What it does**: Mnemosyne is a wrapper-thin OpenCode plugin around one binary and five tools. Public is already a memory platform with retrieval, governance, health, bootstrap, and routing. The OpenCode transport layer already implies a separation between core payload production and runtime-specific delivery.
    17	- **Why it matters for us**: The paradigm shift is not “replace MCP with a thin wrapper,” but “treat runtime UX as a facade layer.” Public can keep the rich governed core and add a smaller OpenCode-optimized surface where that ergonomics matters.
    18	- **Recommendation**: prototype later
    19	- **Impact**: high
    20	
    21	### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
    22	- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L794), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L137)
    23	- **What it does**: Mnemosyne’s hybrid BM25+vector story is still a memory-store story. Public already has a federated model: `memory_search` for memories, CocoIndex for semantic code intent, and code graph for structural questions.
    24	- **Why it matters for us**: The architecture signal here is to keep planes distinct and route by task intent, not merge every embedding-backed system into one “hybrid retrieval” feature. Mnemosyne reinforces the value of a clear memory plane, but Public’s broader federation is the stronger design.
    25	- **Recommendation**: adopt now
    26	- **Impact**: medium
    27	
    28	### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
    29	- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L113), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782)
    30	- **What it does**: Mnemosyne’s README documents a one-time model download of about 500 MB, and the wrapper handles missing binaries with a string fallback. Its project auto-init is best-effort and does not inspect the `init` exit status before logging success. Public, by contrast, already models readiness and recovery through `session_bootstrap`, structural status, and explicit next actions.
    31	- **Why it matters for us**: The paradigm shift is to treat offline model/backend warmup as architecture, not ops trivia. If Public ever adds heavier local inference backends, readiness, degraded mode, and repair guidance should stay first-class surfaces.
    32	- **Recommendation**: prototype later
    33	- **Impact**: medium
    34	
    35	## Sources Consulted
    36	- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
    37	- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
    38	- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
    39	- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
    40	- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
    41	- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
    42	- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
    43	- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
    44	- [claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
    45	- [gemini/compact-inject.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts)
    46	- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
    47	- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
    48	- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
    49	- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
    50	- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)
    51	
    52	## Assessment
    53	- New information ratio: 0.81
    54	- Questions addressed: compaction-hook leverage, API-surface vs handler reality, operational `core` vs pinning semantics, runtime facade layering, memory-vs-code retrieval boundaries, offline-first readiness tradeoffs
    55	- Questions answered: The strongest paradigm shifts are not new ranking algorithms. They are API and runtime shifts: compaction should preserve memory behavior, retrieval posture must be explicit in the tool contract, pinning should be separated from governance tiers, OpenCode should get a curated facade over the governed MCP core, and memory retrieval should remain one plane in a federated routing stack. The exact validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`.
    56	
    57	## Reflection
    58	- What worked: Reading the wrapper first, then tracing Public’s transport, prime, search, and routing surfaces made the real deltas obvious. The highest-value gaps are cross-layer seams where Public already has the primitive but does not surface it consistently.
    59	- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory. The external checkout is also wrapper-thin, so backend ranking specifics remain README-documented rather than source-proven.
    60	
    61	## Recommended Next Focus
    62	Prototype one API-surface alignment slice instead of a backend rewrite: add an explicit OpenCode-facing retrieval facade that exposes `retrievalLevel` and `pin`, then extend the OpenCode compaction payload with bounded memory-behavior guidance so OpenCode reaches parity with the existing Claude/Gemini recovery pattern.
    63	
    64	RESEARCH BRIEF:
    65	# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main
    66	
    67	## 2. Role
    68	
    69	You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.
    70	
    71	## 3. Task
    72	
    73	Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.
    74	
    75	## 4. Context
    76	
    77	### 4.1 System Description
    78	
    79	OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.
    80	
    81	The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.
    82	
    83	### 4.2 Cross-Phase Awareness Table
    84	
    85	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
    86	|-------|--------|-------------|-------------|-----------------|
    87	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
    88	| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
    89	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
    90	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |
    91	
    92	### 4.3 What This Repo Already Has
    93	
    94	`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.
    95	
    96	What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.
    97	
    98	## 5. Instructions
    99	
   100	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
   101	2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
   102	3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
   103	4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
   104	5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
   105	6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
   106	7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.
   107	8. Examine the `experimental.session.compacting` hook implementation in `src/index.ts` line by line. Treat this as the most novel feature of the phase: capture exactly what guidance is injected, when it runs, and how that compares with Public's structural compaction plugin in `.opencode/plugins/spec-kit-compact-code-graph.js`.
   108	9. Only after the wrapper analysis, read `external/opencode-mnemosyne-main/README.md`. Use it to extract hybrid-search claims, model choice, AGENTS.md guidance, offline-first positioning, and the stated project/global collection model. Distinguish clearly between wrapper-verified behavior and backend claims that are only documented here.
   109	10. Treat the Mnemosyne backend as an interface contract, not an implementation you can prove from this repo. Infer the wrapper-visible backend verbs (`init`, `search`, `add`, `delete`) and the documented hybrid-search behavior, but do not fabricate internal Go ranking logic that is not present in the checked-out plugin repository.
   110	11. Compare Mnemosyne directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` for existing hybrid retrieval, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for session bootstrap/resume behavior, `.opencode/plugins/spec-kit-compact-code-graph.js` for compaction injection, and `.opencode/skill/mcp-coco-index/README.md` for semantic code-search positioning.
   111	12. Resolve cross-phase boundaries explicitly. Do not redo phase `001` as generic FTS5 study or phase `003` as generic BM25 study. This phase owns wrapper-to-backend boundaries, vector-search implications, OpenCode plugin ergonomics, project/global scoping, AGENTS guidance, and memory-awareness compaction behavior.
   112	13. Before deep research begins, ensure the phase folder contains the required Spec Kit docs for the chosen level. Validate the phase folder with:
   113	    ```bash
   114	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict
   115	    ```
   116	14. After validation passes, run deep research using this exact topic:
   117	    ```text
   118	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.
   119	    ```
   120	15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, say whether the evidence is wrapper-confirmed or README-level, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, and identify the affected subsystem. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   121	    ```bash
   122	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"
   123	    ```
   124	
   125	## 6. Research Questions
   126	
   127	1. How is hybrid retrieval presented at the plugin boundary: what does the README claim about BM25, vector similarity, and Reciprocal Rank Fusion, and what parts of that pipeline are actually visible from the wrapper?
   128	2. Why does Mnemosyne use `snowflake-arctic-embed-m-v1.5`, and what should `Code_Environment/Public` learn from that model choice even if Public already has other embedding-backed retrieval systems?
   129	3. How effective is Mnemosyne's project-vs-global scope split, and would a similar ergonomic separation improve Public's memory-save and recall flows without duplicating existing scoped retrieval features?
   130	4. What exactly does the compaction hook preserve, and how does prompt-level tool guidance differ from Public's current structural-context compaction transport?
   131	5. What operational value comes from the plugin auto-initializing the project collection and lazily initializing the global collection, and what failure or ambiguity risks come with deriving the project key from the directory basename?
   132	6. How should the README's AGENTS.md recommendation be interpreted as workflow guidance: is it merely usage advice, or does it reveal a reusable memory-discipline pattern for Public sessions?
   133	7. Compared with CocoIndex's semantic code search, what is unique about Mnemosyne's hybrid memory retrieval story, and where should those systems stay separate rather than merged?
   134	8. Compared with Public's current `memory_search` pipeline, which Mnemosyne ideas are already covered, which are partial overlaps, and which are genuinely new?
   135	9. How does the OpenCode plugin lifecycle shape adoption compared with MCP-server-based memory systems: installation, runtime assumptions, binary dependency management, and tool exposure ergonomics?
   136	10. What are the practical implications of the offline-first design, including local model download cost, first-run latency, privacy benefits, and failure handling when the binary or model is missing?
   137	
   138	## 7. Do's
   139	
   140	- Do trace the full wrapper lifecycle in `src/index.ts`, not just the README summary.
   141	- Do separate wrapper-confirmed behavior from backend claims documented only in `README.md`.
   142	- Do trace the hybrid-search narrative end to end as a contract: query entry, quoted search handoff, backend search call, and fused-ranking claims.
   143	- Do study project and global scoping as product decisions, not just CLI flags.
   144	- Do examine the compaction hook as the phase's highest-priority differentiator for `Code_Environment/Public`.
   145	- Do compare against current Public files so the research reflects today's hybrid retrieval and compaction behavior.
   146	- Do note where the external repo has no extra architecture files or AGENTS file, and treat that absence as evidence about how thin the wrapper really is.
   147	
   148	## 8. Don'ts
   149	
   150	- Do not spend most of the analysis on Mnemosyne's unseen Go internals; they are a dependency, not the plugin repo under study.
   151	- Do not conflate the TypeScript wrapper with the backend search implementation. State clearly when a claim is README-level rather than source-proven.
   152	- Do not ignore the compaction hook; it is the most novel and transferable feature for `Code_Environment/Public`.
   153	- Do not claim Public lacks hybrid BM25+vector memory retrieval when `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` already proves otherwise.
   154	- Do not try to run the system unless the binary and model are already installed; static analysis is sufficient for this phase, and first-run model download is large.
   155	- Do not collapse this phase into generic FTS5 or BM25 discussion already owned by phases `001` and `003`.
   156	- Do not edit anything under `external/` or outside this phase folder.
   157	
   158	## 9. Examples
   159	
   160	### Example A: Hybrid-search contract finding
   161	
   162	```text
   163	**Finding: Hybrid retrieval is a documented backend contract, not a wrapper-owned algorithm**
   164	- Source: external/opencode-mnemosyne-main/README.md; external/opencode-mnemosyne-main/src/index.ts
   165	- What it does: The README states that Mnemosyne combines SQLite FTS5/BM25 and sqlite-vec cosine similarity with Reciprocal Rank Fusion, while the wrapper simply forwards quoted search queries to `mnemosyne search`.
   166	- Why it matters: Public should not copy README marketing language into implementation plans without deciding whether the value lies in ranking math, wrapper ergonomics, or agent-facing tool guidance.
   167	- Recommendation: prototype later
   168	- Affected area: Spec Kit Memory retrieval positioning, future plugin or wrapper design
   169	- Risk/cost: Medium; backend behavior is not directly inspectable from this repo
   170	```
   171	
   172	### Example B: Compaction-resilience finding
   173	
   174	```text
   175	**Finding: Memory-tool awareness survives compaction through prompt injection**
   176	- Source: external/opencode-mnemosyne-main/src/index.ts; .opencode/plugins/spec-kit-compact-code-graph.js
   177	- What it does: Mnemosyne appends a compact memory-usage instruction block during `experimental.session.compacting`, while Public's existing compaction plugin injects structural transport context rather than memory-tool reminders.
   178	- Why it matters: Public may already preserve structural state across compaction, but it does not yet remind the agent of concrete memory tools in the same direct way.
   179	- Recommendation: adopt now or prototype later, depending on desired runtime surface
   180	- Affected area: compaction strategy, startup guidance, memory-tool ergonomics
   181	- Risk/cost: Low to medium; prompt noise and duplicate instruction handling must be designed carefully
   182	```
   183	
   184	## 10. Constraints
   185	
   186	### 10.1 Error handling
   187	
   188	- If a claim is only present in the README and not in `src/index.ts`, label it as documented behavior, not source-confirmed implementation.
   189	- If current `Code_Environment/Public` behavior contradicts the phase brief, correct the comparison to match the code.
   190	- If the external repo structure differs from the assumed paths, preserve the same analytical order and document the actual files used.
   191	- If a recommendation depends on backend internals that are not visible here, mark that gap explicitly instead of guessing.
   192	
   193	### 10.2 Scope
   194	
   195	**IN SCOPE**
   196	
   197	- OpenCode plugin entry point and lifecycle
   198	- CLI bridge design and error handling
   199	- five memory tools and their ergonomics
   200	- project/global scoping model
   201	- documented hybrid search contract
   202	- AGENTS.md integration guidance from the README
   203	- compaction-hook behavior and comparison with Public
   204	- offline-first operational tradeoffs
   205	
   206	**OUT OF SCOPE**
   207	
   208	- reverse-engineering the unseen Mnemosyne Go ranking internals
   209	- generic TypeScript style commentary
   210	- plugin publishing workflow details
   211	- broad FTS5 or BM25 primers already covered by other phases
   212	- speculative replacement of Public's existing retrieval stack without evidence
   213	
   214	### 10.3 Prioritization framework
   215	
   216	Rank findings in this order: compaction-resilience leverage, fit with Public's current hybrid retrieval stack, clarity of wrapper-vs-backend boundary, usefulness of project/global scoping ergonomics, offline-first operational value, implementation cost, and clean differentiation from phases `001` and `003`.
   217	
   218	## 11. Deliverables
   219	
   220	- `phase-research-prompt.md` present and tailored specifically to `004-opencode-mnemosyne-main`
   221	- `research/research.md` as the canonical report with at least 5 evidence-backed findings
   222	- explicit comparison against current Public files for hybrid retrieval, session recovery, compaction injection, and CocoIndex positioning
   223	- each finding labeled `adopt now`, `prototype later`, or `reject`
   224	- each finding states whether evidence is wrapper-confirmed, README-documented, or both
   225	- `implementation-summary.md` created at the end
   226	- memory saved from this phase folder using `generate-context.js`
   227	
   228	Minimum finding schema:
   229	
   230	- finding title
   231	- exact source evidence
   232	- evidence type: wrapper-confirmed / README-documented / both
   233	- what OpenCode Mnemosyne does
   234	- why it matters for `Code_Environment/Public`
   235	- recommendation: `adopt now`, `prototype later`, or `reject`
   236	- affected subsystem
   237	- migration, ambiguity, or validation risk
   238	
   239	## 12. Evaluation Criteria
   240	
   241	- CLEAR target: `>= 40/50`
   242	- RICCE compliance is visible in the prompt:
   243	  - **Role** is specialized in hybrid search, plugin architecture, scoping, and compaction resilience
   244	  - **Instructions** are ordered, concrete, path-specific, and start with the plugin entry point
   245	  - **Context** is domain-specific, cross-phase aware, and corrected to match current Public capabilities
   246	  - **Constraints** clearly separate wrapper evidence from README-level claims
   247	  - **Examples** show strong Mnemosyne-derived findings about hybrid search contracts and compaction hooks
   248	- at least 5 findings are evidence-backed rather than generic
   249	- cross-phase overlap with `001` and `003` is resolved explicitly
   250	- findings compare Mnemosyne with current Public hybrid retrieval and compaction behavior rather than a stale baseline
   251	- project/global scoping, AGENTS guidance, offline-first tradeoffs, and compaction survival are all covered directly
   252	
   253	## 13. Completion Bar
   254	
   255	The phase is only complete when all of the following are true:
   256	
   257	- the reading order started with `src/index.ts`, then `package.json`, then the five tools, then the compaction hook, then `README.md`
   258	- the exact validation command was used for this phase folder
   259	- the exact deep-research topic string appears in the work
   260	- `research/research.md` contains at least 5 evidence-backed findings

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main
     2	
     3	## 2. Role
     4	
     5	You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.
     6	
     7	## 3. Task
     8	
     9	Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.
    10	
    11	## 4. Context
    12	
    13	### 4.1 System Description
    14	
    15	OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.
    16	
    17	The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.
    18	
    19	### 4.2 Cross-Phase Awareness Table
    20	
    21	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
    22	|-------|--------|-------------|-------------|-----------------|
    23	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
    24	| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
    25	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
    26	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |
    27	
    28	### 4.3 What This Repo Already Has
    29	
    30	`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.
    31	
    32	What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.
    33	
    34	## 5. Instructions
    35	
    36	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
    37	2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
    38	3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
    39	4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
    40	5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
    41	6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
    42	7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.
    43	8. Examine the `experimental.session.compacting` hook implementation in `src/index.ts` line by line. Treat this as the most novel feature of the phase: capture exactly what guidance is injected, when it runs, and how that compares with Public's structural compaction plugin in `.opencode/plugins/spec-kit-compact-code-graph.js`.
    44	9. Only after the wrapper analysis, read `external/opencode-mnemosyne-main/README.md`. Use it to extract hybrid-search claims, model choice, AGENTS.md guidance, offline-first positioning, and the stated project/global collection model. Distinguish clearly between wrapper-verified behavior and backend claims that are only documented here.
    45	10. Treat the Mnemosyne backend as an interface contract, not an implementation you can prove from this repo. Infer the wrapper-visible backend verbs (`init`, `search`, `add`, `delete`) and the documented hybrid-search behavior, but do not fabricate internal Go ranking logic that is not present in the checked-out plugin repository.
    46	11. Compare Mnemosyne directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` for existing hybrid retrieval, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for session bootstrap/resume behavior, `.opencode/plugins/spec-kit-compact-code-graph.js` for compaction injection, and `.opencode/skill/mcp-coco-index/README.md` for semantic code-search positioning.
    47	12. Resolve cross-phase boundaries explicitly. Do not redo phase `001` as generic FTS5 study or phase `003` as generic BM25 study. This phase owns wrapper-to-backend boundaries, vector-search implications, OpenCode plugin ergonomics, project/global scoping, AGENTS guidance, and memory-awareness compaction behavior.
    48	13. Before deep research begins, ensure the phase folder contains the required Spec Kit docs for the chosen level. Validate the phase folder with:
    49	    ```bash
    50	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict
    51	    ```
    52	14. After validation passes, run deep research using this exact topic:
    53	    ```text
    54	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.
    55	    ```
    56	15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, say whether the evidence is wrapper-confirmed or README-level, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, and identify the affected subsystem. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    57	    ```bash
    58	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"
    59	    ```
    60	
    61	## 6. Research Questions
    62	
    63	1. How is hybrid retrieval presented at the plugin boundary: what does the README claim about BM25, vector similarity, and Reciprocal Rank Fusion, and what parts of that pipeline are actually visible from the wrapper?
    64	2. Why does Mnemosyne use `snowflake-arctic-embed-m-v1.5`, and what should `Code_Environment/Public` learn from that model choice even if Public already has other embedding-backed retrieval systems?
    65	3. How effective is Mnemosyne's project-vs-global scope split, and would a similar ergonomic separation improve Public's memory-save and recall flows without duplicating existing scoped retrieval features?
    66	4. What exactly does the compaction hook preserve, and how does prompt-level tool guidance differ from Public's current structural-context compaction transport?
    67	5. What operational value comes from the plugin auto-initializing the project collection and lazily initializing the global collection, and what failure or ambiguity risks come with deriving the project key from the directory basename?
    68	6. How should the README's AGENTS.md recommendation be interpreted as workflow guidance: is it merely usage advice, or does it reveal a reusable memory-discipline pattern for Public sessions?
    69	7. Compared with CocoIndex's semantic code search, what is unique about Mnemosyne's hybrid memory retrieval story, and where should those systems stay separate rather than merged?
    70	8. Compared with Public's current `memory_search` pipeline, which Mnemosyne ideas are already covered, which are partial overlaps, and which are genuinely new?
    71	9. How does the OpenCode plugin lifecycle shape adoption compared with MCP-server-based memory systems: installation, runtime assumptions, binary dependency management, and tool exposure ergonomics?
    72	10. What are the practical implications of the offline-first design, including local model download cost, first-run latency, privacy benefits, and failure handling when the binary or model is missing?
    73	
    74	## 7. Do's
    75	
    76	- Do trace the full wrapper lifecycle in `src/index.ts`, not just the README summary.
    77	- Do separate wrapper-confirmed behavior from backend claims documented only in `README.md`.
    78	- Do trace the hybrid-search narrative end to end as a contract: query entry, quoted search handoff, backend search call, and fused-ranking claims.
    79	- Do study project and global scoping as product decisions, not just CLI flags.
    80	- Do examine the compaction hook as the phase's highest-priority differentiator for `Code_Environment/Public`.
    81	- Do compare against current Public files so the research reflects today's hybrid retrieval and compaction behavior.
    82	- Do note where the external repo has no extra architecture files or AGENTS file, and treat that absence as evidence about how thin the wrapper really is.
    83	
    84	## 8. Don'ts
    85	
    86	- Do not spend most of the analysis on Mnemosyne's unseen Go internals; they are a dependency, not the plugin repo under study.
    87	- Do not conflate the TypeScript wrapper with the backend search implementation. State clearly when a claim is README-level rather than source-proven.
    88	- Do not ignore the compaction hook; it is the most novel and transferable feature for `Code_Environment/Public`.
    89	- Do not claim Public lacks hybrid BM25+vector memory retrieval when `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` already proves otherwise.
    90	- Do not try to run the system unless the binary and model are already installed; static analysis is sufficient for this phase, and first-run model download is large.
    91	- Do not collapse this phase into generic FTS5 or BM25 discussion already owned by phases `001` and `003`.
    92	- Do not edit anything under `external/` or outside this phase folder.
    93	
    94	## 9. Examples
    95	
    96	### Example A: Hybrid-search contract finding
    97	
    98	```text
    99	**Finding: Hybrid retrieval is a documented backend contract, not a wrapper-owned algorithm**
   100	- Source: external/opencode-mnemosyne-main/README.md; external/opencode-mnemosyne-main/src/index.ts
   101	- What it does: The README states that Mnemosyne combines SQLite FTS5/BM25 and sqlite-vec cosine similarity with Reciprocal Rank Fusion, while the wrapper simply forwards quoted search queries to `mnemosyne search`.
   102	- Why it matters: Public should not copy README marketing language into implementation plans without deciding whether the value lies in ranking math, wrapper ergonomics, or agent-facing tool guidance.
   103	- Recommendation: prototype later
   104	- Affected area: Spec Kit Memory retrieval positioning, future plugin or wrapper design
   105	- Risk/cost: Medium; backend behavior is not directly inspectable from this repo
   106	```
   107	
   108	### Example B: Compaction-resilience finding
   109	
   110	```text
   111	**Finding: Memory-tool awareness survives compaction through prompt injection**
   112	- Source: external/opencode-mnemosyne-main/src/index.ts; .opencode/plugins/spec-kit-compact-code-graph.js
   113	- What it does: Mnemosyne appends a compact memory-usage instruction block during `experimental.session.compacting`, while Public's existing compaction plugin injects structural transport context rather than memory-tool reminders.
   114	- Why it matters: Public may already preserve structural state across compaction, but it does not yet remind the agent of concrete memory tools in the same direct way.
   115	- Recommendation: adopt now or prototype later, depending on desired runtime surface
   116	- Affected area: compaction strategy, startup guidance, memory-tool ergonomics
   117	- Risk/cost: Low to medium; prompt noise and duplicate instruction handling must be designed carefully
   118	```
   119	
   120	## 10. Constraints
   121	
   122	### 10.1 Error handling
   123	
   124	- If a claim is only present in the README and not in `src/index.ts`, label it as documented behavior, not source-confirmed implementation.
   125	- If current `Code_Environment/Public` behavior contradicts the phase brief, correct the comparison to match the code.
   126	- If the external repo structure differs from the assumed paths, preserve the same analytical order and document the actual files used.
   127	- If a recommendation depends on backend internals that are not visible here, mark that gap explicitly instead of guessing.
   128	
   129	### 10.2 Scope
   130	
   131	**IN SCOPE**
   132	
   133	- OpenCode plugin entry point and lifecycle
   134	- CLI bridge design and error handling
   135	- five memory tools and their ergonomics
   136	- project/global scoping model
   137	- documented hybrid search contract
   138	- AGENTS.md integration guidance from the README
   139	- compaction-hook behavior and comparison with Public
   140	- offline-first operational tradeoffs
   141	
   142	**OUT OF SCOPE**
   143	
   144	- reverse-engineering the unseen Mnemosyne Go ranking internals
   145	- generic TypeScript style commentary
   146	- plugin publishing workflow details
   147	- broad FTS5 or BM25 primers already covered by other phases
   148	- speculative replacement of Public's existing retrieval stack without evidence
   149	
   150	### 10.3 Prioritization framework
   151	
   152	Rank findings in this order: compaction-resilience leverage, fit with Public's current hybrid retrieval stack, clarity of wrapper-vs-backend boundary, usefulness of project/global scoping ergonomics, offline-first operational value, implementation cost, and clean differentiation from phases `001` and `003`.
   153	
   154	## 11. Deliverables
   155	
   156	- `phase-research-prompt.md` present and tailored specifically to `004-opencode-mnemosyne-main`
   157	- `research/research.md` as the canonical report with at least 5 evidence-backed findings
   158	- explicit comparison against current Public files for hybrid retrieval, session recovery, compaction injection, and CocoIndex positioning
   159	- each finding labeled `adopt now`, `prototype later`, or `reject`
   160	- each finding states whether evidence is wrapper-confirmed, README-documented, or both
   161	- `implementation-summary.md` created at the end
   162	- memory saved from this phase folder using `generate-context.js`
   163	
   164	Minimum finding schema:
   165	
   166	- finding title
   167	- exact source evidence
   168	- evidence type: wrapper-confirmed / README-documented / both
   169	- what OpenCode Mnemosyne does
   170	- why it matters for `Code_Environment/Public`
   171	- recommendation: `adopt now`, `prototype later`, or `reject`
   172	- affected subsystem
   173	- migration, ambiguity, or validation risk
   174	
   175	## 12. Evaluation Criteria
   176	
   177	- CLEAR target: `>= 40/50`
   178	- RICCE compliance is visible in the prompt:
   179	  - **Role** is specialized in hybrid search, plugin architecture, scoping, and compaction resilience
   180	  - **Instructions** are ordered, concrete, path-specific, and start with the plugin entry point
   181	  - **Context** is domain-specific, cross-phase aware, and corrected to match current Public capabilities
   182	  - **Constraints** clearly separate wrapper evidence from README-level claims
   183	  - **Examples** show strong Mnemosyne-derived findings about hybrid search contracts and compaction hooks
   184	- at least 5 findings are evidence-backed rather than generic
   185	- cross-phase overlap with `001` and `003` is resolved explicitly
   186	- findings compare Mnemosyne with current Public hybrid retrieval and compaction behavior rather than a stale baseline
   187	- project/global scoping, AGENTS guidance, offline-first tradeoffs, and compaction survival are all covered directly
   188	
   189	## 13. Completion Bar
   190	
   191	The phase is only complete when all of the following are true:
   192	
   193	- the reading order started with `src/index.ts`, then `package.json`, then the five tools, then the compaction hook, then `README.md`
   194	- the exact validation command was used for this phase folder
   195	- the exact deep-research topic string appears in the work
   196	- `research/research.md` contains at least 5 evidence-backed findings
   197	- each finding distinguishes wrapper-confirmed behavior from README-documented claims where needed
   198	- `checklist.md` is updated with evidence and completion marks
   199	- `implementation-summary.md` exists
   200	- memory is saved successfully for `004-opencode-mnemosyne-main`
   201	- no edits were made outside the phase folder
   202	- overlap with phases `001` and `003` is explicitly bounded

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "name": "opencode-mnemosyne",
     3	  "version": "0.2.4",
     4	  "description": "OpenCode plugin for local persistent memory using Mnemosyne — offline semantic search, no cloud required",
     5	  "type": "module",
     6	  "main": "dist/index.js",
     7	  "types": "dist/index.d.ts",
     8	  "scripts": {
     9	    "build": "tsc",
    10	    "dev": "tsc --watch",
    11	    "typecheck": "tsc --noEmit",
    12	    "ci": "tsc --noEmit && tsc"
    13	  },
    14	  "keywords": [
    15	    "opencode",
    16	    "opencode-plugin",
    17	    "mnemosyne",
    18	    "memory",
    19	    "local",
    20	    "offline",
    21	    "semantic-search",
    22	    "ai",
    23	    "coding-agent"
    24	  ],
    25	  "author": "gandazgul",
    26	  "license": "MIT",
    27	  "repository": {
    28	    "type": "git",
    29	    "url": "git+https://github.com/gandazgul/opencode-mnemosyne.git"
    30	  },
    31	  "dependencies": {
    32	    "@opencode-ai/plugin": "^1.2.24"
    33	  },
    34	  "devDependencies": {
    35	    "@types/node": "^25.4.0",
    36	    "typescript": "^5.9.3"
    37	  },
    38	  "opencode": {
    39	    "type": "plugin"
    40	  },
    41	  "files": [
    42	    "dist"
    43	  ]
    44	}

 succeeded in 0ms:
     1	import path from "node:path";
     2	import { type Plugin, tool } from "@opencode-ai/plugin";
     3	
     4	export const MnemosynePlugin: Plugin = async (ctx) => {
     5	  const { directory, worktree, client } = ctx;
     6	  const targetDir = directory || worktree || process.cwd();
     7	
     8	  const log = {
     9	    debug: (msg: string) =>
    10	      client.app
    11	        .log({ body: { service: "mnemosyne", level: "debug", message: msg } })
    12	        .catch(() => {}),
    13	    info: (msg: string) =>
    14	      client.app
    15	        .log({ body: { service: "mnemosyne", level: "info", message: msg } })
    16	        .catch(() => {}),
    17	    warn: (msg: string) =>
    18	      client.app
    19	        .log({ body: { service: "mnemosyne", level: "warn", message: msg } })
    20	        .catch(() => {}),
    21	    error: (msg: string) =>
    22	      client.app
    23	        .log({ body: { service: "mnemosyne", level: "error", message: msg } })
    24	        .catch(() => {}),
    25	  };
    26	
    27	  // Strip trailing slashes but keep the root slash if it's just "/"
    28	  let projectDir = targetDir.replace(/(.+?)\/+$/, "$1");
    29	  const projectRaw = path.basename(projectDir);
    30	  const project = projectRaw === "global" ? "default" : (projectRaw || "default");
    31	
    32	  await log.debug(`Plugin loaded for project: ${project} (dir: ${targetDir})`);
    33	
    34	  /**
    35	   * Run the mnemosyne CLI binary gracefully using Bun.spawn.
    36	   * Avoids shell interpolation entirely by passing args as array.
    37	   */
    38	  async function mnemosyne(...args: string[]): Promise<string> {
    39	    await log.debug(`Executing: mnemosyne ${args.join(" ")}`);
    40	    try {
    41	      // @ts-ignore - Bun is globally available in opencode environment
    42	      const proc = Bun.spawn(["mnemosyne", ...args], {
    43	        cwd: targetDir,
    44	        stdout: "pipe",
    45	        stderr: "pipe",
    46	      });
    47	
    48	      const [stdout, stderr, exitCode] = await Promise.all([
    49	        new Response(proc.stdout).text(),
    50	        new Response(proc.stderr).text(),
    51	        proc.exited,
    52	      ]);
    53	
    54	      if (exitCode !== 0) {
    55	        await log.error(`Execution failed (code ${exitCode}): ${stderr}`);
    56	        throw new Error(stderr.trim() || `mnemosyne ${args[0]} failed`);
    57	      }
    58	
    59	      // mnemosyne may write output to stderr (older versions), use whichever has content
    60	      const output = stdout || stderr;
    61	      await log.debug(`Execution successful. Output size: ${output.length}`);
    62	      return output;
    63	    }
    64	    catch (e: unknown) {
    65	      await log.error(`Execution error: ${e instanceof Error ? e.stack : String(e)}`);
    66	      const msg = e instanceof Error ? e.message : String(e);
    67	      if (
    68	        msg.includes("not found") ||
    69	        msg.includes("ENOENT") ||
    70	        msg.includes("No such file")
    71	      ) {
    72	        return "Error: mnemosyne binary not found. Install it: https://github.com/gandazgul/mnemosyne#install";
    73	      }
    74	      throw e;
    75	    }
    76	  }
    77	
    78	  // Auto-init the project collection (idempotent).
    79	  try {
    80	    // @ts-ignore
    81	    await Bun.spawn(["mnemosyne", "init", "--name", project], {
    82	      cwd: targetDir,
    83	      stdout: "ignore", // Silence "collection already exists" logs
    84	      stderr: "pipe",   // Keep stderr for critical errors
    85	    }).exited;
    86	    await log.info(`Ensured collection exists: ${project}`);
    87	  }
    88	  catch (e) {
    89	    await log.warn(`Failed to auto-init collection: ${e}`);
    90	  }
    91	
    92	  return {
    93	    // ── Tools ──────────────────────────────────────────────
    94	
    95	    tool: {
    96	      memory_recall: tool({
    97	        description:
    98	          "Search project memory for relevant context, past decisions, and preferences. Use this at the start of conversations and whenever past context would help.",
    99	        args: {
   100	          query: tool.schema.string().describe("Semantic search query"),
   101	        },
   102	        async execute(args) {
   103	          await log.info(`Searching project memory for: ${args.query}`);
   104	          // Quote the query to prevent SQLite FTS errors with hyphens and special characters
   105	          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
   106	          const result = await mnemosyne(
   107	            "search",
   108	            "--name",
   109	            project,
   110	            "--format",
   111	            "plain",
   112	            safeQuery,
   113	          );
   114	          return result.trim() || "No memories found.";
   115	        },
   116	      }),
   117	
   118	      memory_recall_global: tool({
   119	        description:
   120	          "Search global memory for cross-project preferences, decisions and patterns.",
   121	        args: {
   122	          query: tool.schema.string().describe("Semantic search query"),
   123	        },
   124	        async execute(args) {
   125	          await log.info(`Searching global memory for: ${args.query}`);
   126	          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
   127	          const result = await mnemosyne(
   128	            "search",
   129	            "--global",
   130	            "--format",
   131	            "plain",
   132	            safeQuery,
   133	          );
   134	          return result.trim() || "No global memories found.";
   135	        },
   136	      }),
   137	
   138	      memory_store: tool({
   139	        description:
   140	          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
   141	        args: {
   142	          content: tool.schema.string().describe("Concise memory to store"),
   143	          core: tool.schema.boolean().optional().describe(
   144	            "If true, this memory is always injected into context (like AGENTS.md). Use sparingly."
   145	          ),
   146	        },
   147	        async execute(args) {
   148	          await log.info(`Storing project memory: ${args.content}`);
   149	          const cmdArgs = ["add", "--name", project];
   150	          if (args.core) {
   151	            cmdArgs.push("--tag", "core");
   152	          }
   153	          cmdArgs.push(args.content);
   154	          return (
   155	            await mnemosyne(...cmdArgs)
   156	          ).trim();
   157	        },
   158	      }),
   159	
   160	      memory_store_global: tool({
   161	        description:
   162	          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
   163	        args: {
   164	          content: tool.schema.string().describe("Global memory to store"),
   165	          core: tool.schema.boolean().optional().describe(
   166	            "If true, this memory is always injected into context. Use sparingly."
   167	          ),
   168	        },
   169	        async execute(args) {
   170	          await log.info(`Storing global memory: ${args.content}`);
   171	          // Ensure the global collection exists.
   172	          try {
   173	            // @ts-ignore
   174	            await Bun.spawn(["mnemosyne", "init", "--global"], {
   175	              cwd: targetDir,
   176	              stdout: "ignore", // Silence "collection already exists" logs
   177	              stderr: "pipe",   // Keep stderr for critical errors
   178	            }).exited;
   179	            await log.info("Ensured global collection exists.");
   180	          }
   181	          catch (e) {
   182	            await log.warn(`Failed to auto-init global collection: ${e}`);
   183	          }
   184	          const cmdArgs = ["add", "--global"];
   185	          if (args.core) {
   186	            cmdArgs.push("--tag", "core");
   187	          }
   188	          cmdArgs.push(args.content);
   189	          return (await mnemosyne(...cmdArgs)).trim();
   190	        },
   191	      }),
   192	
   193	      memory_delete: tool({
   194	        description:
   195	          "Delete an outdated or incorrect memory by its document ID (shown in [brackets] in recall/list results).",
   196	        args: {
   197	          id: tool.schema.number().describe("Document ID to delete"),
   198	        },
   199	        async execute(args) {
   200	          await log.info(`Deleting memory document ID: ${args.id}`);
   201	          return (await mnemosyne("delete", String(args.id))).trim();
   202	        },
   203	      }),
   204	    },
   205	
   206	    // ── Hooks ──────────────────────────────────────────────
   207	
   208	    // Inject memory instructions into compaction so they survive
   209	    // context window resets.
   210	    "experimental.session.compacting": async (_input, output) => {
   211	      output.context.push(`## Persistent Memory (mnemosyne)
   212	
   213	You have persistent memory tools: memory_recall, memory_store, memory_delete,
   214	memory_recall_global, memory_store_global.
   215	
   216	When to use memory:
   217	- Search memory when past context would help answer the user's request.
   218	- Store concise summaries of important decisions, preferences, and patterns.
   219	- Delete outdated memories when new decisions contradict them.
   220	- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).
   221	- Use **global** variants for cross-project preferences (coding style, tool choices).
   222	- At the end of a session, store any relevant memories for future sessions.`);
   223	    },
   224	  };
   225	};

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1365ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


2026-04-10T20:12:09.794462Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 66
codex
The prior iteration makes the ranking clear enough: the first pattern was runtime facades, so I’m going deep on the next one, the federated retrieval plane. I’m pulling the wrapper’s README claims and the Public search/routing implementation side by side so the conclusion is anchored in actual handler behavior rather than repo-level descriptions.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# opencode-mnemosyne
     2	
     3	OpenCode plugin for **local persistent memory** using [Mnemosyne](https://github.com/gandazgul/mnemosyne). Gives your AI coding agent memory that persists across sessions -- entirely offline, no cloud APIs.
     4	
     5	This is the local/offline alternative to cloud-based memory plugins like opencode-supermemory.
     6	
     7	## Prerequisites
     8	
     9	Install the mnemosyne binary first:
    10	
    11	```bash
    12	# From source (requires Go 1.21+, GCC, Task)
    13	git clone https://github.com/gandazgul/mnemosyne.git
    14	cd mnemosyne
    15	task install
    16	```
    17	
    18	See the [mnemosyne README](https://github.com/gandazgul/mnemosyne#quick-start) for detailed setup instructions. On first use, mnemosyne will automatically download its ML models (~500 MB one-time).
    19	
    20	## Install
    21	
    22	Add to your `opencode.json`:
    23	
    24	```json
    25	{
    26	  "$schema": "https://opencode.ai/config.json",
    27	  "plugin": ["opencode-mnemosyne"]
    28	}
    29	```
    30	
    31	That's it. OpenCode will install the plugin automatically.
    32	
    33	## What it does
    34	
    35	### Tools
    36	
    37	The plugin registers five tools available to the AI agent:
    38	
    39	| Tool | Description |
    40	|------|-------------|
    41	| `memory_recall` | Search project memory for relevant context and past decisions |
    42	| `memory_recall_global` | Search global memory for cross-project preferences |
    43	| `memory_store` | Store a project-scoped memory (optionally as `core`) |
    44	| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
    45	| `memory_delete` | Delete an outdated memory by its document ID |
    46	
    47	### Hooks
    48	
    49	- **`experimental.session.compacting`** -- Injects memory tool instructions into the compaction prompt so the agent retains awareness of its memory capabilities across context window resets.
    50	
    51	### Memory scoping
    52	
    53	| Scope | Collection | Persists across |
    54	|-------|-----------|-----------------|
    55	| Project | `<directory-name>` | Sessions in the same project |
    56	| Global | `global` | All projects |
    57	| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
    58	| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
    59	
    60	The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.
    61	
    62	## AGENTS.md (recommended)
    63	
    64	For best results, add this to your project or global `AGENTS.md` so the agent uses memory proactively from the start of each session:
    65	
    66	```markdown
    67	## Memory (mnemosyne)
    68	
    69	- At the start of a session, use memory_recall and memory_recall_global to search for context
    70	  relevant to the user's first message.
    71	- After significant decisions, use memory_store to save a concise summary.
    72	- Delete contradicted memories with memory_delete before storing updated ones.
    73	- Use memory_recall_global / memory_store_global for cross-project preferences.
    74	- Mark critical, always-relevant context as core (core=true) — but use sparingly.
    75	- When you are done with a session, store any memories that you think are relevant
    76	  to the user and the project. This will help you recall important information in
    77	  future sessions.
    78	```
    79	
    80	## How it works
    81	
    82	Mnemosyne is a local document store with hybrid search:
    83	- **Full-text search** (SQLite FTS5, BM25 ranking)
    84	- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
    85	- **Reciprocal Rank Fusion** combines both for best results
    86	
    87	All ML inference runs locally via ONNX Runtime. Your memories never leave your machine.
    88	
    89	## Development
    90	
    91	This project uses standard Node.js tools: `npm` for package management and `tsc` (TypeScript compiler) for building.
    92	
    93	```bash
    94	# Install dependencies
    95	npm install
    96	
    97	# Build the project
    98	npm run build
    99	
   100	# Start the compiler in watch mode for development
   101	npm run dev
   102	
   103	# Run TypeScript checks
   104	npm run typecheck
   105	```
   106	
   107	## License
   108	
   109	MIT

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '430,700p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   430	
   431	// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
   432	// resolveArtifactRoutingQuery, applyArtifactRouting — now imported from lib/search/search-utils.ts
   433	// CacheArgsInput — now imported from lib/search/search-utils.ts
   434	// parseNullableInt, collapseAndReassembleChunkResults — now imported from lib/search/chunk-reassembly.ts
   435	
   436	/* ───────────────────────────────────────────────────────────────
   437	   3. CONFIGURATION
   438	──────────────────────────────────────────────────────────────── */
   439	
   440	// Sections 3–5 (STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants,
   441	// StrengthenOnAccess, applyTestingEffect, filterByMemoryState) removed in
   442	// These were only used by the legacy V1 pipeline.
   443	// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
   444	// Query expansion through its own stages.
   445	
   446	/* ───────────────────────────────────────────────────────────────
   447	   6. SESSION DEDUPLICATION UTILITIES
   448	──────────────────────────────────────────────────────────────── */
   449	
   450	function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
   451	  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
   452	    return {
   453	      results,
   454	      dedupStats: { enabled: false, sessionId: null }
   455	    };
   456	  }
   457	
   458	  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
   459	
   460	  if (filtered.length > 0) {
   461	    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
   462	  }
   463	
   464	  return {
   465	    results: filtered as MemorySearchRow[],
   466	    dedupStats: {
   467	      ...dedupStats,
   468	      sessionId
   469	    }
   470	  };
   471	}
   472	
   473	// Sections 7–9 (applyCrossEncoderReranking, applyIntentWeightsToResults,
   474	// ShouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
   475	// These were only used by the legacy V1 pipeline
   476	// Path. The V2 4-stage pipeline handles all equivalent functionality.
   477	
   478	/* ───────────────────────────────────────────────────────────────
   479	   10. MAIN HANDLER
   480	──────────────────────────────────────────────────────────────── */
   481	
   482	/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
   483	 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
   484	 * @returns MCP response with ranked search results
   485	 */
   486	async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
   487	  const _searchStartTime = Date.now();
   488	  resetLastLexicalCapabilitySnapshot();
   489	  // BUG-001: Check for external database updates before processing
   490	  await checkDatabaseUpdated();
   491	
   492	  const {
   493	    cursor,
   494	    query,
   495	    concepts,
   496	    specFolder,
   497	    folderBoost,
   498	    tenantId,
   499	    userId,
   500	    agentId,
   501	    sharedSpaceId,
   502	    limit: rawLimit = 10,
   503	    tier,
   504	    contextType,
   505	    useDecay: useDecay = true,
   506	    includeContiguity: includeContiguity = false,
   507	    includeConstitutional: includeConstitutional = true,
   508	    includeContent: includeContent = false,
   509	    anchors,
   510	    bypassCache: bypassCache = false,
   511	    sessionId,
   512	    enableDedup: enableDedup = true,
   513	    intent: explicitIntent,
   514	    autoDetectIntent: autoDetectIntent = true,
   515	    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
   516	    applyStateLimits: applyStateLimits = false,
   517	    rerank = true, // Enable reranking by default for better result quality
   518	    applyLengthPenalty: applyLengthPenalty = true,
   519	    trackAccess: trackAccess = false, // opt-in, off by default
   520	    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
   521	    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
   522	    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
   523	    minQualityScore,
   524	    min_quality_score,
   525	    mode,
   526	    includeTrace: includeTraceArg = false,
   527	    sessionTransition,
   528	    profile,
   529	    retrievalLevel: retrievalLevel = 'auto',
   530	  } = args;
   531	  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
   532	  const includeTrace = includeTraceByFlag || includeTraceArg === true;
   533	  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
   534	  const progressiveScopeKey = JSON.stringify({
   535	    tenantId: normalizedScope.tenantId ?? null,
   536	    userId: normalizedScope.userId ?? null,
   537	    agentId: normalizedScope.agentId ?? null,
   538	    sessionId: normalizedScope.sessionId ?? null,
   539	    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
   540	  });
   541	
   542	  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
   543	  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
   544	  const hasQuery = typeof query === 'string' && query.trim().length > 0;
   545	  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
   546	  if (!hasCursor && !hasQuery && !hasConcepts) {
   547	    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
   548	  }
   549	
   550	  if (hasCursor) {
   551	    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
   552	    if (!resolved) {
   553	      return createMCPErrorResponse({
   554	        tool: 'memory_search',
   555	        error: 'Cursor is invalid, expired, or out of scope',
   556	        code: 'E_VALIDATION',
   557	        details: { parameter: 'cursor' },
   558	        recovery: {
   559	          hint: 'Retry the original search to generate a fresh continuation cursor',
   560	        },
   561	      });
   562	    }
   563	
   564	    const snippetResults = extractSnippets(resolved.results);
   565	    return createMCPSuccessResponse({
   566	      tool: 'memory_search',
   567	      summary: `Returned ${snippetResults.length} continuation results`,
   568	      data: {
   569	        count: snippetResults.length,
   570	        results: snippetResults,
   571	        continuation: resolved.continuation,
   572	      },
   573	      startTime: _searchStartTime,
   574	      cacheHit: false,
   575	    });
   576	  }
   577	
   578	  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
   579	
   580	  // Validate numeric limit parameter
   581	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   582	    ? Math.min(Math.floor(rawLimit), 100)
   583	    : 10;
   584	
   585	  // BUG-007: Validate query first with proper error handling
   586	  let normalizedQuery: string | null = null;
   587	  if (query !== undefined) {
   588	    try {
   589	      normalizedQuery = validateQuery(query);
   590	    } catch (validationError: unknown) {
   591	      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
   592	        const message = toErrorMessage(validationError);
   593	        return createMCPErrorResponse({
   594	          tool: 'memory_search',
   595	          error: message,
   596	          code: 'E_VALIDATION',
   597	          details: { parameter: 'query' },
   598	          recovery: {
   599	            hint: 'Provide a valid query string or use concepts array instead'
   600	          }
   601	        });
   602	      }
   603	      normalizedQuery = null;
   604	    }
   605	  }
   606	
   607	  const hasValidQuery = normalizedQuery !== null;
   608	  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
   609	  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
   610	
   611	  if (!hasValidQuery && !hasValidConcepts) {
   612	    return createMCPErrorResponse({
   613	      tool: 'memory_search',
   614	      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
   615	      code: 'E_VALIDATION',
   616	      details: { parameter: 'query' },
   617	      recovery: {
   618	        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
   619	      }
   620	    });
   621	  }
   622	
   623	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   624	    return createMCPErrorResponse({
   625	      tool: 'memory_search',
   626	      error: 'specFolder must be a string',
   627	      code: 'E_VALIDATION',
   628	      details: { parameter: 'specFolder' },
   629	      recovery: {
   630	        hint: 'Provide specFolder as a string path'
   631	      }
   632	    });
   633	  }
   634	
   635	  // Eval logger — capture query at pipeline entry (fail-safe)
   636	  let _evalQueryId = 0;
   637	  let _evalRunId = 0;
   638	  try {
   639	    const evalEntry = logSearchQuery({
   640	      query: effectiveQuery,
   641	      intent: explicitIntent ?? null,
   642	      specFolder: specFolder ?? null,
   643	    });
   644	    _evalQueryId = evalEntry.queryId;
   645	    _evalRunId = evalEntry.evalRunId;
   646	  } catch (_error: unknown) { /* eval logging must never break search */ }
   647	
   648	  const artifactRoutingQuery = resolveArtifactRoutingQuery(
   649	    normalizedQuery,
   650	    hasValidConcepts ? concepts : undefined
   651	  );
   652	  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
   653	
   654	  // Intent-aware retrieval
   655	  let detectedIntent: string | null = null;
   656	  let intentConfidence = 0;
   657	  let intentWeights: IntentWeights | null = null;
   658	
   659	  if (explicitIntent) {
   660	    if (intentClassifier.isValidIntent(explicitIntent)) {
   661	      detectedIntent = explicitIntent;
   662	      intentConfidence = 1.0;
   663	      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
   664	    } else {
   665	      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
   666	    }
   667	  }
   668	
   669	  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
   670	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
   671	    detectedIntent = classification.intent;
   672	    intentConfidence = classification.confidence;
   673	    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);
   674	
   675	    if (classification.fallback) {
   676	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
   677	    } else {
   678	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
   679	    }
   680	  }
   681	
   682	  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
   683	  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
   684	  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
   685	    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
   686	    detectedIntent = 'understand';
   687	    intentConfidence = 1.0;
   688	    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
   689	  }
   690	
   691	  // Phase C: Intent-to-profile auto-routing.
   692	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
   693	  let effectiveProfile: string | undefined = profile;
   694	  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
   695	    try {
   696	      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
   697	      if (autoProfile) {
   698	        effectiveProfile = autoProfile;
   699	        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
   700	      }

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '740,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   740	// Don't support. If index changes significantly, restart the server to refresh instructions.
   741	async function buildServerInstructions(): Promise<string> {
   742	  if (!isDynamicInitEnabled()) {
   743	    return '';
   744	  }
   745	
   746	  const stats = await getMemoryStats();
   747	  const channels: string[] = ['vector', 'fts5'];
   748	  if (bm25Index.isBm25Enabled()) channels.push('bm25');
   749	  if (isGraphUnifiedEnabled()) channels.push('graph');
   750	  if (isDegreeBoostEnabled()) channels.push('degree');
   751	  const staleWarning = stats.staleCount > 10
   752	    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
   753	    : '';
   754	
   755	  const lines = [
   756	    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
   757	    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
   758	    `Search channels: ${channels.join(', ')}.`,
   759	    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
   760	    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
   761	    staleWarning.trim(),
   762	  ];
   763	
   764	  // Phase 024 / Item 4: Session recovery digest from session-snapshot
   765	  try {
   766	    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
   767	    const snap = getSessionSnapshot();
   768	    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
   769	    if (hasData) {
   770	      const recommended = !snap.primed ? 'call session_bootstrap()' :
   771	        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
   772	        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
   773	      lines.push('');
   774	      lines.push('## Session Recovery');
   775	      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
   776	      lines.push(`- Code graph: ${snap.graphFreshness}`);
   777	      lines.push(`- Session quality: ${snap.sessionQuality}`);
   778	      lines.push(`- Recommended: ${recommended}`);
   779	    }
   780	  } catch { /* session-snapshot not available — skip digest */ }
   781	
   782	  // Phase 027: Structural bootstrap guidance for non-hook runtimes
   783	  lines.push('');
   784	  lines.push('## Structural Bootstrap (Phase 027)');
   785	  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
   786	  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
   787	  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
   788	  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
   789	
   790	  // Phase 024: Tool routing decision tree
   791	  try {
   792	    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
   793	    const snap = getSnap();
   794	    const routingRules: string[] = [];
   795	    if (snap.cocoIndexAvailable) {
   796	      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
   797	    }
   798	    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
   799	      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
   800	    }
   801	    routingRules.push('Exact text/regex matching → Grep tool');
   802	    if (routingRules.length > 0) {
   803	      lines.push('');
   804	      lines.push('## Tool Routing');
   805	      for (const rule of routingRules) {
   806	        lines.push(`- ${rule}`);
   807	      }
   808	    }
   809	  } catch { /* tool routing snapshot unavailable — skip */ }
   810	
   811	  return lines.filter(Boolean).join(' ');
   812	}
   813	
   814	/** Register a callback to be invoked asynchronously after each tool call completes. */
   815	export function registerAfterToolCallback(fn: AfterToolCallback): void {
   816	  afterToolCallbacks.push(fn);
   817	}
   818	
   819	async function invalidateReinitializedDbCaches(): Promise<void> {
   820	  const invalidatedEntries = toolCache.clear();
   821	
   822	  try {
   823	    const triggerMatcher = await import('./lib/parsing/trigger-matcher.js');
   824	    if (typeof triggerMatcher.clearCache === 'function') {
   825	      triggerMatcher.clearCache();
   826	    }
   827	  } catch (error: unknown) {
   828	    const message = error instanceof Error ? error.message : String(error);
   829	    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
   830	  }
   831	
   832	  if (invalidatedEntries > 0) {
   833	    console.error(`[context-server] Cleared ${invalidatedEntries} tool-cache entries after DB reinitialization`);
   834	  }
   835	}
   836	
   837	/* ───────────────────────────────────────────────────────────────
   838	   3. SERVER INITIALIZATION
   839	──────────────────────────────────────────────────────────────── */
   840	
   841	const server = new Server(
   842	  { name: 'context-server', version: '1.7.2' },
   843	  { capabilities: { tools: {} } }
   844	);
   845	const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
   846	
   847	/* ───────────────────────────────────────────────────────────────
   848	   4. TOOL DEFINITIONS (T303: from tool-schemas.ts)
   849	──────────────────────────────────────────────────────────────── */
   850	
   851	server.setRequestHandler(ListToolsRequestSchema, async () => ({
   852	  tools: TOOL_DEFINITIONS
   853	}));
   854	
   855	/* ───────────────────────────────────────────────────────────────
   856	   5. TOOL DISPATCH (T303: routed through tools/*.ts)
   857	──────────────────────────────────────────────────────────────── */
   858	
   859	// eslint-disable-next-line @typescript-eslint/no-explicit-any
   860	server.setRequestHandler(CallToolRequestSchema, async (request, _extra: unknown): Promise<any> => {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Spec Kit Compact Code Graph OpenCode Plugin                              ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	'use strict';
     5	
     6	// ─────────────────────────────────────────────────────────────────────────────
     7	// 1. OVERVIEW
     8	// ─────────────────────────────────────────────────────────────────────────────
     9	// Thin OpenCode plugin hook layer for packet 030.
    10	// Important runtime boundary: never import the MCP server bundle directly
    11	// inside the OpenCode host process because its native modules (better-sqlite3,
    12	// sqlite-vec) may be compiled for a different Node ABI than the host runtime.
    13	// Instead, call a plain `node` bridge process that loads the server bundle in
    14	// the user's normal Node environment and returns the transport plan as JSON.
    15	
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	// 2. IMPORTS
    18	// ─────────────────────────────────────────────────────────────────────────────
    19	
    20	import { randomUUID } from 'node:crypto';
    21	import { execFile } from 'node:child_process';
    22	import { fileURLToPath } from 'node:url';
    23	
    24	import { tool } from '@opencode-ai/plugin';
    25	import {
    26	  createSyntheticTextPart,
    27	  hasUnsafeMessageTransformParts,
    28	  hasSyntheticTextPartMarker,
    29	  isMessageAnchorLike,
    30	} from './spec-kit-opencode-message-schema.mjs';
    31	
    32	// ─────────────────────────────────────────────────────────────────────────────
    33	// 3. CONSTANTS AND TYPES
    34	// ─────────────────────────────────────────────────────────────────────────────
    35	
    36	const PLUGIN_ID = 'spec-kit-compact-code-graph';
    37	const DEFAULT_CACHE_TTL_MS = 5000;
    38	const DEFAULT_BRIDGE_TIMEOUT_MS = 15000;
    39	const DEFAULT_NODE_BINARY = 'node';
    40	const RESUME_MODE = 'minimal';
    41	const MESSAGES_TRANSFORM_ENABLED = true;
    42	const MESSAGES_TRANSFORM_MODE = 'schema_aligned';
    43	const SYNTHETIC_METADATA_KEY = 'specKitCompactCodeGraph';
    44	const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
    45	
    46	/**
    47	 * @typedef {{
    48	 *   cacheTtlMs?: number,
    49	 *   specFolder?: string,
    50	 *   nodeBinary?: string,
    51	 *   bridgeTimeoutMs?: number,
    52	 * }} PluginOptions
    53	 */
    54	
    55	/**
    56	 * @typedef {{
    57	 *   hook: string,
    58	 *   title: string,
    59	 *   payloadKind: string,
    60	 *   dedupeKey: string,
    61	 *   content: string,
    62	 * }} TransportBlock
    63	 */
    64	
    65	/**
    66	 * @typedef {{
    67	 *   interfaceVersion: string,
    68	 *   transportOnly: true,
    69	 *   retrievalPolicyOwner: string,
    70	 *   event: {
    71	 *     hook: string,
    72	 *     trackedPayloadKinds: string[],
    73	 *     summary: string,
    74	 *   },
    75	 *   systemTransform?: TransportBlock,
    76	 *   messagesTransform: TransportBlock[],
    77	 *   compaction?: TransportBlock,
    78	 * }} TransportPlan
    79	 */
    80	
    81	// ─────────────────────────────────────────────────────────────────────────────
    82	// 4. MODULE STATE
    83	// ─────────────────────────────────────────────────────────────────────────────
    84	
    85	const transportCache = new Map();
    86	let runtimeReady = false;
    87	let lastRuntimeError = null;
    88	
    89	// ─────────────────────────────────────────────────────────────────────────────
    90	// 5. HELPERS
    91	// ─────────────────────────────────────────────────────────────────────────────
    92	
    93	function normalizePositiveInt(value, fallback) {
    94	  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
    95	}
    96	
    97	function normalizeOptions(rawOptions) {
    98	  if (!rawOptions || typeof rawOptions !== 'object') {
    99	    return {
   100	      cacheTtlMs: DEFAULT_CACHE_TTL_MS,
   101	      specFolder: undefined,
   102	      nodeBinary: process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY,
   103	      bridgeTimeoutMs: DEFAULT_BRIDGE_TIMEOUT_MS,
   104	    };
   105	  }
   106	
   107	  const options = /** @type {PluginOptions} */ (rawOptions);
   108	  return {
   109	    cacheTtlMs: normalizePositiveInt(options.cacheTtlMs, DEFAULT_CACHE_TTL_MS),
   110	    specFolder: typeof options.specFolder === 'string' && options.specFolder.trim()
   111	      ? options.specFolder.trim()
   112	      : undefined,
   113	    nodeBinary: typeof options.nodeBinary === 'string' && options.nodeBinary.trim()
   114	      ? options.nodeBinary.trim()
   115	      : (process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
   116	    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS),
   117	  };
   118	}
   119	
   120	function cacheKeyForSession(sessionID, specFolder) {
   121	  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
   122	}
   123	
   124	function parseTransportPlan(responseText) {
   125	  if (!responseText) {
   126	    return null;
   127	  }
   128	
   129	  try {
   130	    const parsed = JSON.parse(responseText);
   131	    const data = parsed?.data ?? parsed;
   132	    const plan = data?.opencodeTransport;
   133	    if (!plan || typeof plan !== 'object') {
   134	      return null;
   135	    }
   136	    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
   137	      return null;
   138	    }
   139	    return /** @type {TransportPlan} */ (plan);
   140	  } catch {
   141	    return null;
   142	  }
   143	}
   144	
   145	function stringifyError(error) {
   146	  if (!error) {
   147	    return 'Unknown bridge error';
   148	  }
   149	  if (error instanceof Error) {
   150	    return error.message;
   151	  }
   152	  return String(error);
   153	}
   154	
   155	function execFilePromise(file, args, options) {
   156	  return new Promise((resolve, reject) => {
   157	    execFile(file, args, options, (error, stdout, stderr) => {
   158	      if (error) {
   159	        reject(error);
   160	        return;
   161	      }
   162	      resolve({
   163	        stdout: typeof stdout === 'string' ? stdout : '',
   164	        stderr: typeof stderr === 'string' ? stderr : '',
   165	      });
   166	    });
   167	  });
   168	}
   169	
   170	async function runTransportBridge({ projectDir, specFolder, nodeBinary, bridgeTimeoutMs }) {
   171	  const args = [BRIDGE_PATH, '--minimal'];
   172	  if (specFolder) {
   173	    args.push('--spec-folder', specFolder);
   174	  }
   175	
   176	  const result = await execFilePromise(nodeBinary, args, {
   177	    cwd: projectDir,
   178	    env: process.env,
   179	    timeout: bridgeTimeoutMs,
   180	    maxBuffer: 1024 * 1024,
   181	  });
   182	  return parseTransportPlan(result.stdout.trim());
   183	}
   184	
   185	async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
   186	  const key = cacheKeyForSession(sessionID, specFolder);
   187	  const now = Date.now();
   188	  const cached = transportCache.get(key);
   189	
   190	  if (cached && cached.expiresAt > now) {
   191	    return cached.plan;
   192	  }
   193	
   194	  try {
   195	    const plan = await runTransportBridge({
   196	      projectDir,
   197	      specFolder,
   198	      nodeBinary,
   199	      bridgeTimeoutMs,
   200	    });
   201	
   202	    if (!plan) {
   203	      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
   204	      runtimeReady = false;
   205	      transportCache.delete(key);
   206	      return null;
   207	    }
   208	
   209	    runtimeReady = true;
   210	    lastRuntimeError = null;
   211	    transportCache.set(key, {
   212	      plan,
   213	      expiresAt: now + cacheTtlMs,
   214	      updatedAt: new Date(now).toISOString(),
   215	    });
   216	    return plan;
   217	  } catch (error) {
   218	    runtimeReady = false;
   219	    lastRuntimeError = stringifyError(error);
   220	    transportCache.delete(key);
   221	    return null;
   222	  }
   223	}
   224	
   225	function extractEventSessionID(event) {
   226	  if (!event || typeof event !== 'object') {
   227	    return null;
   228	  }
   229	
   230	  if (typeof event.sessionID === 'string') {
   231	    return event.sessionID;
   232	  }
   233	
   234	  if (event.properties && typeof event.properties === 'object') {
   235	    if (typeof event.properties.sessionID === 'string') {
   236	      return event.properties.sessionID;
   237	    }
   238	    if (event.properties.info && typeof event.properties.info === 'object') {
   239	      if (typeof event.properties.info.sessionID === 'string') {
   240	        return event.properties.info.sessionID;

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md | sed -n '70,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    70	
    71	### Key Features
    72	
    73	| Feature | Description |
    74	|---|---|
    75	| Semantic search | Query by concept or intent, not exact text |
    76	| CLI and MCP modes | `ccc` for terminal use, `ccc mcp` for AI agent integration |
    77	| Language filters | `--lang` (CLI) or `languages` (MCP) narrows results by language |
    78	| Path filters | `--path` (CLI) or `paths` (MCP) scopes results to a directory |
    79	| Incremental indexing | Only re-embeds changed files on subsequent runs |
    80	| Daemon architecture | Auto-starts, auto-restarts on version or settings change |
    81	| Spec Kit integration | Companion lifecycle tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) and code-graph/session integration are available through system-spec-kit |
    82	| Two embedding models | Local (no API key) or cloud (higher quality) |
    83	| 28+ languages | Language-aware chunk splitting preserves function and class boundaries |
    84	
    85	In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
    86	
    87	<!-- /ANCHOR:overview -->
    88	
    89	---
    90	
    91	<!-- ANCHOR:quick-start -->
    92	## 2. QUICK START
    93	
    94	**Step 1: Install and verify**
    95	
    96	Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.
    97	
    98	```bash
    99	bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
   100	```
   101	
   102	**Step 2: Build the index**
   103	
   104	Run from the project root. The first run scans all supported files and generates embeddings. It takes 1-5 minutes depending on codebase size.
   105	
   106	```bash
   107	ccc index
   108	```
   109	
   110	**Step 3: Check index status**
   111	
   112	Confirm files are indexed before searching.
   113	
   114	```bash
   115	ccc status
   116	```
   117	
   118	**Step 4: Search**
   119	
   120	Run a natural-language query. Add language and path filters to narrow results.
   121	
   122	```bash
   123	ccc search "authentication middleware"
   124	ccc search "error handling" --lang typescript
   125	ccc search "database migration" --path "src/**" --limit 5
   126	```
   127	
   128	<!-- /ANCHOR:quick-start -->
   129	
   130	---
   131	
   132	<!-- ANCHOR:features -->
   133	## 3. FEATURES
   134	
   135	### 3.1 FEATURE HIGHLIGHTS
   136	
   137	CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
   138	
   139	The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.
   140	
   141	Language and path filters apply after ranking, which means they narrow an already semantically ranked result set rather than replacing semantic ranking with keyword matching. This design keeps the filters fast and the results meaningful. For multi-query agent sessions, set `refresh_index=false` on follow-up calls after the first query has already triggered a refresh. The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors.
   142	
   143	The CLI and MCP interfaces are complementary, not redundant. The CLI handles index management operations (`index`, `status`, `reset`, `init`, `daemon`) that have no MCP equivalents. The MCP server exposes only the `search` tool because index management is a human-initiated operation, not an agent-initiated one. When building an AI workflow that needs semantic search, configure the MCP server and let agents call `search` directly.
   144	
   145	### 3.2 FEATURE REFERENCE
   146	
   147	**CLI commands**
   148	
   149	| Command | Purpose | Key Flags |
   150	|---|---|---|
   151	| `ccc search QUERY` | Semantic search | `--lang`, `--path`, `--limit`, `--offset`, `--refresh` |
   152	| `ccc index` | Build or update the vector index | none |
   153	| `ccc status` | Show index statistics | none |
   154	| `ccc init` | Initialize project (`/.cocoindex_code/`) | `-f` / `--force` |
   155	| `ccc reset` | Reset databases | `--all` (include settings), `-f` (skip prompt) |
   156	| `ccc mcp` | Start MCP server (stdio mode) | none |
   157	| `ccc daemon status` | Show daemon state | none |
   158	| `ccc daemon restart` | Restart daemon | none |
   159	| `ccc daemon stop` | Stop daemon | none |
   160	
   161	**MCP tool: `search`**
   162	
   163	| Parameter | Type | Required | Default | Description |
   164	|---|---|---|---|---|
   165	| `query` | string | Yes | - | Natural-language search query |
   166	| `languages` | list or null | No | null | Filter by programming languages |
   167	| `paths` | list or null | No | null | Filter by file paths |
   168	| `limit` | integer | No | 5 | Maximum number of results to return |
   169	| `offset` | integer | No | 0 | Number of results to skip for pagination |
   170	| `refresh_index` | boolean | No | true | Trigger index refresh before searching |
   171	
   172	**CLI vs. MCP parameter differences**
   173	
   174	| Concept | CLI | MCP | Note |
   175	|---|---|---|---|
   176	| Language filter | `--lang` (repeatable flag) | `languages` (list) | CLI: one flag per language. MCP: list of strings |
   177	| Path filter | `--path` (single string) | `paths` (list) | CLI: one path. MCP: multiple paths |
   178	| Result limit | `--limit` (default 10) | `limit` (default 5) | Different defaults |
   179	| Index refresh | `--refresh` (default false) | `refresh_index` (default true) | Different defaults |
   180	| Pagination | `--offset` | `offset` (default 0) | Available on both surfaces |

codex
I’ve got the key contrast now: Mnemosyne exposes one memory store with two scopes, while Public already advertises a three-system retrieval model. I’m drilling one layer deeper into the actual memory-search stages and session bootstrap surfaces so the final output can say what is merely documented versus what the code really routes today.
exec
/bin/zsh -lc 'rg -n "hybrid|fts5|bm25|vector|retrievalLevel|artifactRouting|code_graph_query|cocoindex|semantic" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
214:  retrievalLevel?: 'local' | 'global' | 'auto';
482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
529:    retrievalLevel: retrievalLevel = 'auto',
648:  const artifactRoutingQuery = resolveArtifactRoutingQuery(
652:  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
707:  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
708:    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
777:        : 'hybrid',
805:      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
822:        (retrievalLevel === 'global') ||
823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
937:    if (artifactRouting) {
938:      extraData.artifactRouting = artifactRouting;
939:      extraData.artifact_routing = artifactRouting;
992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };

exec
/bin/zsh -lc 'rg -n "session_bootstrap|code_graph_scan|cocoIndexAvailable|Tool Routing|Semantic/concept code search|Structural queries" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:176:    cocoIndexAvailable: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:795:    if (snap.cocoIndexAvailable) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:804:      lines.push('## Tool Routing');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "memory_context|memory_search|mcp__cocoindex_code__search|code_graph_query|retrieve|routing" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Bootstrap Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 024 / Item 7: Composite tool that runs session_resume
     5	// + session_health in one call, merging results with hints.
     6	
     7	import { handleSessionResume } from './session-resume.js';
     8	import type { CachedSessionSummaryDecision } from './session-resume.js';
     9	import { handleSessionHealth } from './session-health.js';
    10	import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
    11	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    12	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    13	import {
    14	  attachStructuralTrustFields,
    15	  buildStructuralContextTrust,
    16	  createSharedPayloadEnvelope,
    17	  summarizeUnknown,
    18	  summarizeCertaintyContract,
    19	  trustStateFromStructuralStatus,
    20	  type SharedPayloadCertainty,
    21	  type SharedPayloadEnvelope,
    22	  type SharedPayloadSection,
    23	  StructuralTrustPayloadError,
    24	  type StructuralTrust,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  coerceSharedPayloadEnvelope,
    29	  type OpenCodeTransportPlan,
    30	} from '../lib/context/opencode-transport.js';
    31	import {
    32	  buildCodeGraphOpsContract,
    33	  type CodeGraphOpsContract,
    34	} from '../lib/code-graph/ops-hardening.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	interface SessionBootstrapArgs {
    42	  specFolder?: string;
    43	}
    44	
    45	interface SessionBootstrapResult {
    46	  resume: Record<string, unknown>;
    47	  health: Record<string, unknown>;
    48	  cachedSummary?: CachedSessionSummaryDecision;
    49	  structuralContext?: StructuralBootstrapContract & StructuralTrust;
    50	  structuralRoutingNudge?: {
    51	    advisory: true;
    52	    readiness: 'ready';
    53	    preferredTool: 'code_graph_query';
    54	    message: string;
    55	    preservesAuthority: 'session_bootstrap';
    56	  };
    57	  payloadContract?: SharedPayloadEnvelope;
    58	  opencodeTransport?: OpenCodeTransportPlan;
    59	  graphOps?: CodeGraphOpsContract;
    60	  hints: string[];
    61	  nextActions: string[];
    62	}
    63	
    64	/* ───────────────────────────────────────────────────────────────
    65	   2. HELPERS
    66	──────────────────────────────────────────────────────────────── */
    67	
    68	function extractData(response: MCPResponse): Record<string, unknown> {
    69	  try {
    70	    const text = response?.content?.[0]?.text;
    71	    if (typeof text === 'string') {
    72	      const parsed = JSON.parse(text);
    73	      return parsed?.data ?? parsed ?? {};
    74	    }
    75	  } catch { /* parse failed */ }
    76	  return {};
    77	}
    78	
    79	function extractHints(data: Record<string, unknown>): string[] {
    80	  if (Array.isArray(data.hints)) return data.hints as string[];
    81	  return [];
    82	}
    83	
    84	function extractCachedSummary(
    85	  data: Record<string, unknown>,
    86	): CachedSessionSummaryDecision | null {
    87	  const candidate = data.cachedSummary;
    88	  if (candidate && typeof candidate === 'object') {
    89	    return candidate as CachedSessionSummaryDecision;
    90	  }
    91	  return null;
    92	}
    93	
    94	function buildNextActions(
    95	  resumeData: Record<string, unknown>,
    96	  healthData: Record<string, unknown>,
    97	  structuralContext: StructuralBootstrapContract,
    98	): string[] {
    99	  const nextActions = new Set<string>();
   100	
   101	  if (resumeData.error) {
   102	    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
   103	  }
   104	
   105	  if (healthData.error) {
   106	    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
   107	  }
   108	
   109	  if (structuralContext.recommendedAction) {
   110	    nextActions.add(structuralContext.recommendedAction);
   111	  }
   112	
   113	  if (structuralContext.status === 'ready') {
   114	    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
   115	  } else if (structuralContext.status === 'stale') {
   116	    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
   117	  } else {
   118	    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
   119	  }
   120	
   121	  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
   122	  if (healthStatus === 'warning' || healthStatus === 'stale') {
   123	    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
   124	  }
   125	
   126	  return [...nextActions].slice(0, 3);
   127	}
   128	
   129	function extractStructuralTrustFromPayload(
   130	  payload: SharedPayloadEnvelope | null,
   131	): StructuralTrust | null {
   132	  if (!payload) {
   133	    return null;
   134	  }
   135	
   136	  const structuralSection = payload.sections.find((section) =>
   137	    section.key === 'structural-context' && section.structuralTrust,
   138	  );
   139	
   140	  return structuralSection?.structuralTrust ?? null;
   141	}
   142	
   143	function buildStructuralRoutingNudge(
   144	  structuralContext: StructuralBootstrapContract,
   145	): SessionBootstrapResult['structuralRoutingNudge'] | null {
   146	  if (structuralContext.status !== 'ready') {
   147	    return null;
   148	  }
   149	
   150	  return {
   151	    advisory: true,
   152	    readiness: 'ready',
   153	    preferredTool: 'code_graph_query',
   154	    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
   155	    preservesAuthority: 'session_bootstrap',
   156	  };
   157	}
   158	
   159	/* ───────────────────────────────────────────────────────────────
   160	   3. HANDLER
   161	──────────────────────────────────────────────────────────────── */
   162	
   163	/** Handle session_bootstrap tool call — one-call session setup */
   164	export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
   165	  const startMs = Date.now();
   166	  const allHints: string[] = [];
   167	
   168	  // Sub-call 1: session_resume with full resume payload
   169	  let resumeData: Record<string, unknown> = {};
   170	  try {
   171	    const resumeResponse = await handleSessionResume({
   172	      specFolder: args.specFolder,
   173	    });
   174	    resumeData = extractData(resumeResponse);
   175	    allHints.push(...extractHints(resumeData));
   176	  } catch (error: unknown) {
   177	    const message = error instanceof Error ? error.message : String(error);
   178	    resumeData = { error: message };
   179	    allHints.push('session_resume failed. Try calling it manually.');
   180	  }
   181	
   182	  // Sub-call 2: session_health
   183	  let healthData: Record<string, unknown> = {};
   184	  try {
   185	    const healthResponse = await handleSessionHealth();
   186	    healthData = extractData(healthResponse);
   187	    allHints.push(...extractHints(healthData));
   188	  } catch (error: unknown) {
   189	    const message = error instanceof Error ? error.message : String(error);
   190	    healthData = { error: message };
   191	    allHints.push('session_health failed. Try calling it manually.');
   192	  }
   193	
   194	  // Phase 027: Structural bootstrap contract
   195	  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
   196	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   197	    allHints.push(
   198	      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
   199	    );
   200	  }
   201	
   202	  const cachedSummary = extractCachedSummary(resumeData);
   203	  if (cachedSummary?.status === 'accepted') {
   204	    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
   205	  }
   206	  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
   207	  if (structuralRoutingNudge) {
   208	    allHints.push(structuralRoutingNudge.message);
   209	  }
   210	
   211	  // Deduplicate hints
   212	  const uniqueHints = [...new Set(allHints)];
   213	
   214	  // Record bootstrap telemetry once for the composite call.
   215	  const durationMs = Date.now() - startMs;
   216	  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
   217	  recordBootstrapEvent('tool', durationMs, completeness);
   218	
   219	  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
   220	  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:112:        ? `Track OpenCode routing hints for ${args.specFolder}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:113:        : 'Track OpenCode routing hints for the current packet/runtime state',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:73:  /** Phase 009 T041: Graph retrieval routing rules for AI session priming */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:74:  routingRules?: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:468:    toolRoutingRules.push('semantic/concept queries → mcp__cocoindex_code__search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:481:    routingRules: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:148:    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:224:    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:360:      ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Surface
     3	// ───────────────────────────────────────────────────────────────
     4	// Lib modules
     5	import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
     6	import * as vectorIndex from '../lib/search/vector-index.js';
     7	import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
     8	import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives.js';
     9	import * as graphDb from '../lib/code-graph/code-graph-db.js';
    10	import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
    11	import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
    12	import * as workingMemory from '../lib/cognitive/working-memory.js';
    13	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    14	
    15	import type { Database } from '@spec-kit/shared/types';
    16	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    17	
    18	/* ───────────────────────────────────────────────────────────────
    19	   1. TYPES
    20	──────────────────────────────────────────────────────────────── */
    21	
    22	interface ConstitutionalMemory {
    23	  id: number;
    24	  specFolder: string;
    25	  filePath: string;
    26	  title: string;
    27	  importanceTier: string;
    28	  /** PI-A4: LLM-consumable retrieval directive, e.g. "Always surface when: …" */
    29	  retrieval_directive?: string;
    30	}
    31	
    32	interface AutoSurfaceResult {
    33	  constitutional: ConstitutionalMemory[];
    34	  triggered: {
    35	    memory_id: number;
    36	    spec_folder: string;
    37	    title: string;
    38	    matched_phrases: string[];
    39	  }[];
    40	  codeGraphStatus?: {
    41	    status: 'ok' | 'error';
    42	    data?: {
    43	      totalFiles: number;
    44	      totalNodes: number;
    45	      totalEdges: number;
    46	      staleFiles: number;
    47	      lastScanAt: string | null;
    48	      dbFileSize: number | null;
    49	      schemaVersion: number;
    50	      nodesByKind: Record<string, number>;
    51	      edgesByType: Record<string, number>;
    52	      parseHealth: Record<string, number>;
    53	    };
    54	    error?: string;
    55	  };
    56	  sessionPrimed?: boolean;
    57	  primedTool?: string;
    58	  /** T018: Structured Prime Package returned on first tool call */
    59	  primePackage?: PrimePackage;
    60	  surfaced_at: string;
    61	  latencyMs: number;
    62	}
    63	
    64	/** T018: Structured session prime payload for non-hook CLI auto-priming */
    65	interface PrimePackage {
    66	  specFolder: string | null;
    67	  currentTask: string | null;
    68	  codeGraphStatus: 'fresh' | 'stale' | 'empty';
    69	  cocoIndexAvailable: boolean;
    70	  recommendedCalls: string[];
    71	  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
    72	  structuralContext?: StructuralBootstrapContract;
    73	  /** Phase 009 T041: Graph retrieval routing rules for AI session priming */
    74	  routingRules?: {
    75	    graphRetrieval: string;
    76	    communitySearch: string;
    77	    toolRouting: string;
    78	  };
    79	}
    80	
    81	/* ───────────────────────────────────────────────────────────────
    82	   2. MEMORY SURFACE HOOK CONFIGURATION
    83	──────────────────────────────────────────────────────────────── */
    84	
    85	const MEMORY_AWARE_TOOLS: Set<string> = new Set([
    86	  'memory_context',
    87	  'memory_search',
    88	  'memory_quick_search',
    89	  'memory_match_triggers',
    90	  'memory_list',
    91	  'memory_save',
    92	  'memory_index_scan'
    93	]);
    94	
    95	// Token budgets for dual-scope lifecycle hooks (TM-05)
    96	const TOOL_DISPATCH_TOKEN_BUDGET = 4000;
    97	const COMPACTION_TOKEN_BUDGET = 4000;
    98	
    99	// Constitutional memory cache
   100	// Module-level mutable state: safe in a single-process MCP server.
   101	// If the server ever runs multi-process, replace with a shared store.
   102	let constitutionalCache: ConstitutionalMemory[] | null = null;
   103	let constitutionalCacheTime = 0;
   104	const CONSTITUTIONAL_CACHE_TTL = 60000; // 1 minute
   105	// Per-session priming tracker: a Set of session IDs that have been primed.
   106	// Replaces the previous process-global boolean to avoid skipping priming
   107	// for new sessions on long-lived MCP servers.
   108	const primedSessionIds: Set<string> = new Set();
   109	
   110	// T018: Session-level tracking for prime package and session_health
   111	const serverStartedAt = Date.now();
   112	let lastToolCallAt = Date.now();
   113	let lastActiveSessionId: string | null = null;
   114	
   115	/** T018: Update last tool call timestamp (called from context-server dispatch). */
   116	function recordToolCall(sessionId?: string): void {
   117	  lastToolCallAt = Date.now();
   118	  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
   119	    lastActiveSessionId = sessionId.trim();
   120	  }
   121	}
   122	
   123	/** T018: Get session tracking timestamps */
   124	function getSessionTimestamps(): { serverStartedAt: number; lastToolCallAt: number } {
   125	  return { serverStartedAt, lastToolCallAt };
   126	}
   127	
   128	/**
   129	 * T018: Check if a specific session has been primed.
   130	 * Session identity is required to avoid cross-session bleed-through.
   131	 */
   132	function isSessionPrimed(sessionId: string): boolean {
   133	  return primedSessionIds.has(sessionId);
   134	}
   135	
   136	/** Mark a specific session as primed */
   137	function markSessionPrimed(sessionId: string): void {
   138	  primedSessionIds.add(sessionId);
   139	  lastActiveSessionId = sessionId;
   140	}
   141	
   142	function getLastActiveSessionId(): string | null {
   143	  return lastActiveSessionId;
   144	}
   145	
   146	/* ───────────────────────────────────────────────────────────────
   147	   3. CONTEXT EXTRACTION
   148	──────────────────────────────────────────────────────────────── */
   149	
   150	function extractContextHint(args: Record<string, unknown> | null | undefined): string | null {
   151	  if (!args || typeof args !== 'object') return null;
   152	
   153	  const contextFields = ['input', 'query', 'prompt', 'specFolder', 'filePath'];
   154	  for (const field of contextFields) {
   155	    if (args[field] && typeof args[field] === 'string' && (args[field] as string).length >= 3) {
   156	      return args[field] as string;
   157	    }
   158	  }
   159	
   160	  // Join concepts array if present
   161	  if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
   162	    const strings = args.concepts.filter((c): c is string => typeof c === 'string');
   163	    if (strings.length > 0) return strings.join(' ');
   164	  }
   165	
   166	  return null;
   167	}
   168	
   169	/* ───────────────────────────────────────────────────────────────
   170	   4. CONSTITUTIONAL MEMORIES
   171	──────────────────────────────────────────────────────────────── */
   172	
   173	async function getConstitutionalMemories(): Promise<ConstitutionalMemory[]> {
   174	  const now = Date.now();
   175	
   176	  if (constitutionalCache && (now - constitutionalCacheTime) < CONSTITUTIONAL_CACHE_TTL) {
   177	    return constitutionalCache;
   178	  }
   179	
   180	  try {
   181	    const db: Database | null = vectorIndex.getDb();
   182	    if (!db) return [];
   183	
   184	    const rows = db.prepare(`
   185	      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
   186	      FROM memory_index
   187	      WHERE importance_tier = 'constitutional'
   188	      AND embedding_status IN ('success', 'pending', 'partial')
   189	      ORDER BY created_at DESC
   190	      LIMIT 10
   191	    `).all();
   192	
   193	    constitutionalCache = (rows as Record<string, unknown>[]).map((r) => ({
   194	      id: r.id as number,
   195	      specFolder: r.spec_folder as string,
   196	      filePath: r.file_path as string,
   197	      title: r.title as string,
   198	      importanceTier: r.importance_tier as string
   199	    }));
   200	    constitutionalCacheTime = now;
   201	
   202	    return constitutionalCache;
   203	  } catch (err: unknown) {
   204	    const message = err instanceof Error ? err.message : String(err);
   205	    console.warn('[SK-004] Failed to fetch constitutional memories:', message);
   206	    return [];
   207	  }
   208	}
   209	
   210	function clearConstitutionalCache(): void {
   211	  constitutionalCache = null;
   212	  constitutionalCacheTime = 0;
   213	}
   214	
   215	function getCodeGraphStatusSnapshot(): NonNullable<AutoSurfaceResult['codeGraphStatus']> {
   216	  try {
   217	    const stats = graphDb.getStats();
   218	    const staleCount = (graphDb.getDb().prepare(`
   219	      SELECT COUNT(*) as c FROM code_files
   220	      WHERE parse_health = 'error' OR parse_health = 'recovered'
   221	    `).get() as { c: number }).c;
   222	
   223	    return {
   224	      status: 'ok',
   225	      data: {
   226	        totalFiles: stats.totalFiles,
   227	        totalNodes: stats.totalNodes,
   228	        totalEdges: stats.totalEdges,
   229	        staleFiles: staleCount,
   230	        lastScanAt: stats.lastScanTimestamp,
   231	        dbFileSize: stats.dbFileSize,
   232	        schemaVersion: stats.schemaVersion,
   233	        nodesByKind: stats.nodesByKind,
   234	        edgesByType: stats.edgesByType,
   235	        parseHealth: stats.parseHealthSummary,
   236	      },
   237	    };
   238	  } catch (err: unknown) {
   239	    return {
   240	      status: 'error',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: OpenCode Transport Adapter
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 030 / Phase 2: transport-only mapping from shared payload
     5	// contracts to OpenCode-oriented startup, message, and compaction blocks.
     6	
     7	import type { SharedPayloadEnvelope, SharedPayloadSection } from './shared-payload.js';
     8	
     9	/** Hook names emitted by the OpenCode transport adapter. */
    10	export type OpenCodeTransportHook =
    11	  | 'event'
    12	  | 'experimental.chat.system.transform'
    13	  | 'experimental.chat.messages.transform'
    14	  | 'experimental.session.compacting';
    15	
    16	/** One transport block delivered to an OpenCode runtime hook surface. */
    17	export interface OpenCodeTransportBlock {
    18	  hook: OpenCodeTransportHook;
    19	  title: string;
    20	  payloadKind: SharedPayloadEnvelope['kind'];
    21	  dedupeKey: string;
    22	  content: string;
    23	}
    24	
    25	/** Complete transport-only plan derived from shared startup/resume payloads. */
    26	export interface OpenCodeTransportPlan {
    27	  interfaceVersion: '1.0';
    28	  transportOnly: true;
    29	  retrievalPolicyOwner: 'runtime';
    30	  event: {
    31	    hook: 'event';
    32	    trackedPayloadKinds: SharedPayloadEnvelope['kind'][];
    33	    summary: string;
    34	  };
    35	  systemTransform?: OpenCodeTransportBlock;
    36	  messagesTransform: OpenCodeTransportBlock[];
    37	  compaction?: OpenCodeTransportBlock;
    38	}
    39	
    40	function isSharedPayloadEnvelope(value: unknown): value is SharedPayloadEnvelope {
    41	  if (!value || typeof value !== 'object') {
    42	    return false;
    43	  }
    44	  const record = value as Record<string, unknown>;
    45	  return typeof record.kind === 'string'
    46	    && typeof record.summary === 'string'
    47	    && Array.isArray(record.sections)
    48	    && !!record.provenance
    49	    && typeof record.provenance === 'object';
    50	}
    51	
    52	/** Narrow an unknown runtime payload to the shared transport envelope contract. */
    53	export function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null {
    54	  return isSharedPayloadEnvelope(value) ? value : null;
    55	}
    56	
    57	function renderSections(sections: SharedPayloadSection[], maxSections: number = 2): string {
    58	  return sections
    59	    .slice(0, maxSections)
    60	    .map((section) => `### ${section.title}\n${section.content}`)
    61	    .join('\n\n');
    62	}
    63	
    64	function renderBlockContent(payload: SharedPayloadEnvelope, prefix?: string): string {
    65	  const parts = [
    66	    prefix ? `${prefix}\n` : null,
    67	    `Summary: ${payload.summary}`,
    68	    renderSections(payload.sections),
    69	    `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
    70	  ].filter(Boolean);
    71	  return parts.join('\n\n');
    72	}
    73	
    74	function appendStartupSnapshotNote(content: string): string {
    75	  return [
    76	    content,
    77	    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
    78	  ].join('\n\n');
    79	}
    80	
    81	/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
    82	export function buildOpenCodeTransportPlan(args: {
    83	  bootstrapPayload?: SharedPayloadEnvelope | null;
    84	  startupPayload?: SharedPayloadEnvelope | null;
    85	  resumePayload?: SharedPayloadEnvelope | null;
    86	  healthPayload?: SharedPayloadEnvelope | null;
    87	  compactionPayload?: SharedPayloadEnvelope | null;
    88	  specFolder?: string | null;
    89	}): OpenCodeTransportPlan {
    90	  const trackedPayloadKinds = [
    91	    args.bootstrapPayload?.kind,
    92	    args.startupPayload?.kind,
    93	    args.resumePayload?.kind,
    94	    args.healthPayload?.kind,
    95	    args.compactionPayload?.kind,
    96	  ].filter((kind): kind is SharedPayloadEnvelope['kind'] => !!kind);
    97	
    98	  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
    99	  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
   100	    (payload): payload is SharedPayloadEnvelope => !!payload,
   101	  );
   102	  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
   103	
   104	  return {
   105	    interfaceVersion: '1.0',
   106	    transportOnly: true,
   107	    retrievalPolicyOwner: 'runtime',
   108	    event: {
   109	      hook: 'event',
   110	      trackedPayloadKinds,
   111	      summary: args.specFolder
   112	        ? `Track OpenCode routing hints for ${args.specFolder}`
   113	        : 'Track OpenCode routing hints for the current packet/runtime state',
   114	    },
   115	    ...(systemPayload
   116	      ? {
   117	        systemTransform: {
   118	          hook: 'experimental.chat.system.transform',
   119	          title: 'OpenCode Startup Digest',
   120	          payloadKind: systemPayload.kind,
   121	          dedupeKey: `system:${systemPayload.kind}`,
   122	          content: appendStartupSnapshotNote(renderBlockContent(
   123	            systemPayload,
   124	            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
   125	          ),
   126	          ),
   127	        },
   128	      }
   129	      : {}),
   130	    messagesTransform: messagePayloads.map((payload, index) => ({
   131	      hook: 'experimental.chat.messages.transform' as const,
   132	      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
   133	      payloadKind: payload.kind,
   134	      dedupeKey: `messages:${payload.kind}:${index}`,
   135	      content: renderBlockContent(
   136	        payload,
   137	        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
   138	      ),
   139	    })),
   140	    ...(compactionPayload
   141	      ? {
   142	        compaction: {
   143	          hook: 'experimental.session.compacting',
   144	          title: 'OpenCode Compaction Resume Note',
   145	          payloadKind: compactionPayload.kind,
   146	          dedupeKey: `compaction:${compactionPayload.kind}`,
   147	          content: renderBlockContent(
   148	            compactionPayload,
   149	            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
   150	          ),
   151	        },
   152	      }
   153	      : {}),
   154	  };
   155	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts | sed -n '130,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   130	  const sections: string[] = [];
   131	
   132	  if (filePaths.length > 0) {
   133	    sections.push('## Active Files\n' + filePaths.map(p => `- ${p}`).join('\n'));
   134	  }
   135	  if (topics.length > 0) {
   136	    sections.push('## Recent Topics\n' + topics.map(t => `- ${t}`).join('\n'));
   137	  }
   138	
   139	  const meaningfulLines = transcriptLines
   140	    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
   141	    .slice(-5);
   142	  if (meaningfulLines.length > 0) {
   143	    sections.push('## Recent Context\n' + meaningfulLines.join('\n'));
   144	  }
   145	
   146	  // Hint for AI to use CocoIndex for semantic neighbors after recovery
   147	  if (filePaths.length > 0) {
   148	    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
   149	  }
   150	
   151	  return sections.join('\n\n');
   152	}
   153	
   154	type AutoSurfaceAtCompactionResult = Awaited<ReturnType<typeof autoSurfaceAtCompaction>>;
   155	
   156	function renderConstitutionalMemories(
   157	  autoSurfaced: AutoSurfaceAtCompactionResult,
   158	): string {
   159	  const constitutional = autoSurfaced?.constitutional ?? [];
   160	  if (constitutional.length === 0) {
   161	    return '';
   162	  }
   163	
   164	  const lines = constitutional.map((memory) => {
   165	    const details: string[] = [`- ${memory.title}`];
   166	
   167	    if (memory.retrieval_directive) {
   168	      details.push(`  ${memory.retrieval_directive}`);
   169	    }
   170	
   171	    const provenance = [memory.specFolder, memory.filePath].filter(Boolean).join(' | ');
   172	    if (provenance) {
   173	      details.push(`  ${provenance}`);
   174	    }
   175	
   176	    return details.join('\n');
   177	  });
   178	
   179	  return `## Constitutional Rules\n${lines.join('\n')}`;
   180	}
   181	
   182	function renderTriggeredMemories(
   183	  autoSurfaced: AutoSurfaceAtCompactionResult,
   184	): string {
   185	  const triggered = autoSurfaced?.triggered ?? [];
   186	  if (triggered.length === 0) {
   187	    return '';
   188	  }
   189	
   190	  const lines = triggered.map((memory) => {
   191	    const matchedPhrases = [...new Set(memory.matched_phrases
   192	      .map((phrase) => phrase.trim())
   193	      .filter((phrase) => phrase.length > 0))];
   194	
   195	    if (matchedPhrases.length === 0) {
   196	      return `- ${memory.title}`;
   197	    }
   198	
   199	    return `- ${memory.title} (matched: ${matchedPhrases.join(', ')})`;
   200	  });
   201	
   202	  return `## Relevant Memories\n${lines.join('\n')}`;
   203	}
   204	
   205	/**
   206	 * Build merged context using the 3-source merge pipeline.
   207	 * Extracts session state from transcript, then delegates budget allocation
   208	 * and section rendering to mergeCompactBrief.
   209	 */
   210	async function buildMergedContext(transcriptLines: string[]): Promise<string> {
   211	  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
   212	  const filePaths = extractFilePaths(sanitizedLines);
   213	  const topics = extractTopics(sanitizedLines);
   214	
   215	  // Build codeGraph input: active files + structural hints
   216	  const codeGraphParts: string[] = [];
   217	  if (filePaths.length > 0) {
   218	    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
   219	  }
   220	  const codeGraph = codeGraphParts.join('\n\n');
   221	
   222	  // Build cocoIndex input: semantic neighbor hint for post-recovery
   223	  const cocoIndex = filePaths.length > 0
   224	    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
   225	    : '';
   226	
   227	  // Build sessionState input: recent context + topics + attention signals
   228	  const sessionParts: string[] = [];
   229	
   230	  // Spec folder detection
   231	  const specFolder = detectSpecFolder(sanitizedLines);
   232	  if (specFolder) {
   233	    sessionParts.push(`Active spec folder: ${specFolder}`);
   234	  }
   235	
   236	  // Working memory attention signals
   237	  const attentionSignals = extractAttentionSignals(sanitizedLines);
   238	  if (attentionSignals.length > 0) {
   239	    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
   240	  }
   241	
   242	  if (topics.length > 0) {
   243	    sessionParts.push('Recent topics:\n' + topics.map(t => `- ${t}`).join('\n'));
   244	  }
   245	  const meaningfulLines = sanitizedLines
   246	    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
   247	    .slice(-5);
   248	  if (meaningfulLines.length > 0) {
   249	    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
   250	  }
   251	  const sessionState = sessionParts.join('\n\n');
   252	
   253	  const selection = createPreMergeSelectionMetadata({
   254	    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
   255	    fileCount: filePaths.length,
   256	    topicCount: topics.length,
   257	    attentionSignalCount: attentionSignals.length,
   258	    notes: [
   259	      sanitizedLines.length !== transcriptLines.length
   260	        ? 'Recovered compact transcript lines were removed before pre-merge selection.'

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '440,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   440	    const lastScan = graphSnapshot.data.lastScanAt;
   441	    const totalFiles = graphSnapshot.data.totalFiles ?? 0;
   442	    if (totalFiles === 0) {
   443	      codeGraphStatus = 'empty';
   444	    } else if (!lastScan || (Date.now() - new Date(lastScan).getTime() > 24 * 60 * 60 * 1000)) {
   445	      codeGraphStatus = 'stale';
   446	    } else {
   447	      codeGraphStatus = 'fresh';
   448	    }
   449	  }
   450	
   451	  // F046: CocoIndex availability via shared helper (no process.cwd())
   452	  const cocoIndexAvailable = isCocoIndexAvailable();
   453	
   454	  // Build recommended calls based on state
   455	  const recommendedCalls: string[] = [];
   456	  if (codeGraphStatus === 'stale' || codeGraphStatus === 'empty') {
   457	    recommendedCalls.push('code_graph_scan');
   458	  }
   459	  if (!specFolder) {
   460	    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
   461	  }
   462	  if (cocoIndexAvailable && recommendedCalls.length === 0) {
   463	    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
   464	  }
   465	
   466	  const toolRoutingRules: string[] = [];
   467	  if (cocoIndexAvailable) {
   468	    toolRoutingRules.push('semantic/concept queries → mcp__cocoindex_code__search');
   469	  }
   470	  if (codeGraphStatus !== 'empty') {
   471	    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
   472	  }
   473	  toolRoutingRules.push('exact text/regex → Grep');
   474	
   475	  // Phase 027: Structural bootstrap contract for auto-prime surface
   476	  const structuralContext = buildStructuralBootstrapContract('auto-prime');
   477	
   478	  return {
   479	    specFolder, currentTask, codeGraphStatus, cocoIndexAvailable, recommendedCalls,
   480	    structuralContext,
   481	    routingRules: {
   482	      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
   483	      communitySearch: 'When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.',
   484	      toolRouting: `SEARCH ROUTING: ${toolRoutingRules.join(' | ')}`,
   485	    },
   486	  };
   487	}
   488	
   489	async function primeSessionIfNeeded(
   490	  toolName: string,
   491	  toolArgs: Record<string, unknown>,
   492	  sessionId?: string,
   493	): Promise<AutoSurfaceResult | null> {
   494	  // Derive a session key from explicit sessionId or tool args.
   495	  const effectiveSessionId = sessionId
   496	    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
   497	    ?? (typeof toolArgs.session_id === 'string' ? toolArgs.session_id : null);
   498	
   499	  if (!effectiveSessionId || effectiveSessionId.trim().length === 0) {
   500	    return null;
   501	  }
   502	
   503	  if (isSessionPrimed(effectiveSessionId)) {
   504	    return null;
   505	  }
   506	
   507	  const startTime = Date.now();
   508	  const contextHint = extractContextHint(toolArgs);
   509	
   510	  try {
   511	    const constitutional = await getConstitutionalMemories();
   512	    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);
   513	    const codeGraphStatus = getCodeGraphStatusSnapshot();
   514	    const latencyMs = Date.now() - startTime;
   515	
   516	    // T018: Build structured Prime Package
   517	    const primePackage = buildPrimePackage(toolArgs, codeGraphStatus);
   518	
   519	    // F045: Mark session as primed AFTER successful execution (not before try)
   520	    markSessionPrimed(effectiveSessionId);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '760,1030p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   760	  if (cachedPayload) {
   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
   762	  } else {
   763	    // Wait for embedding model only on cache miss
   764	    if (!isEmbeddingModelReady()) {
   765	      const modelReady = await waitForEmbeddingModel(30000);
   766	      if (!modelReady) {
   767	        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
   768	      }
   769	    }
   770	
   771	    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
   772	    const pipelineConfig: PipelineConfig = {
   773	      query: effectiveQuery,
   774	      concepts: hasValidConcepts ? concepts : undefined,
   775	      searchType: (hasValidConcepts && concepts!.length >= 2)
   776	        ? 'multi-concept'
   777	        : 'hybrid',
   778	      mode,
   779	      limit,
   780	      specFolder,
   781	      tenantId: normalizedScope.tenantId,
   782	      userId: normalizedScope.userId,
   783	      agentId: normalizedScope.agentId,
   784	      sharedSpaceId: normalizedScope.sharedSpaceId,
   785	      tier,
   786	      contextType,
   787	      includeArchived,
   788	      includeConstitutional,
   789	      includeContent,
   790	      anchors,
   791	      qualityThreshold,
   792	      minState: minState ?? '',
   793	      applyStateLimits,
   794	      useDecay,
   795	      rerank,
   796	      applyLengthPenalty,
   797	      sessionId,
   798	      enableDedup,
   799	      enableSessionBoost,
   800	      enableCausalBoost,
   801	      trackAccess,
   802	      detectedIntent,
   803	      intentConfidence,
   804	      intentWeights: toIntentWeightsConfig(intentWeights),
   805	      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
   806	      trace,
   807	    };
   808	
   809	    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
   810	    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
   811	
   812	    // Phase B T018/T019: Community search fallback — inject community members on weak results
   813	    let communityFallbackApplied = false;
   814	    const shouldRunCommunitySearch = (
   815	      isDualRetrievalEnabled() &&
   816	      isCommunitySearchFallbackEnabled() &&
   817	      effectiveQuery.length > 0 &&
   818	      (retrievalLevel === 'global' || retrievalLevel === 'auto')
   819	    );
   820	    if (shouldRunCommunitySearch) {
   821	      const isWeakResult = resultsForFormatting.length === 0 ||
   822	        (retrievalLevel === 'global') ||
   823	        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
   824	      if (isWeakResult) {
   825	        try {
   826	          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
   827	          if (communityResults.totalMemberIds.length > 0) {
   828	            // Fetch the actual memory rows for community member IDs
   829	            const memberIds = communityResults.totalMemberIds.slice(0, 20);
   830	            const placeholders = memberIds.map(() => '?').join(', ');
   831	            const db = requireDb();
   832	            const memberRows = db.prepare(`
   833	              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
   834	                     quality_score, created_at
   835	              FROM memory_index
   836	              WHERE id IN (${placeholders})
   837	            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
   838	
   839	            if (memberRows.length > 0) {
   840	              // Mark community-sourced results and assign a base score
   841	              const communityRows = memberRows.map((row) => ({
   842	                ...row,
   843	                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
   844	                score: 0.45,
   845	                _communityFallback: true,
   846	              }));
   847	              // Merge: append community results not already in pipeline results
   848	              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
   849	              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
   850	              if (newRows.length > 0) {
   851	                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
   852	                communityFallbackApplied = true;
   853	              }
   854	            }
   855	          }
   856	        } catch (err: unknown) {
   857	          const msg = err instanceof Error ? err.message : String(err);
   858	          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
   859	        }
   860	      }
   861	    }
   862	
   863	    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
   864	    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
   865	      let boostedCount = 0;
   866	      for (const r of resultsForFormatting) {
   867	        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
   868	        if (filePath && filePath.includes(folderBoost.folder)) {
   869	          const raw = (r as Record<string, unknown>);
   870	          if (typeof raw.similarity === 'number') {
   871	            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
   872	            boostedCount++;
   873	          }
   874	        }
   875	      }
   876	      // Re-sort by similarity after boosting
   877	      if (boostedCount > 0) {
   878	        resultsForFormatting.sort((a, b) => {
   879	          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
   880	          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
   881	          return sb - sa;
   882	        });
   883	      }
   884	    }
   885	
   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
   887	      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
   888	      if (activeGoal) {
   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
   890	      }
   891	      if (Array.isArray(anchors) && anchors.length > 0) {
   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
   893	      }
   894	
   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
   896	      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
   897	      goalRefinementPayload = {
   898	        activeGoal: goalRefinement.metadata.activeGoal,
   899	        applied: goalRefinement.metadata.refined,
   900	        boostedCount: goalRefinement.metadata.boostedCount,
   901	      };
   902	    }
   903	
   904	    // Build extra data from pipeline metadata for response formatting
   905	    const lexicalCapability = getLastLexicalCapabilitySnapshot();
   906	    if (lexicalCapability) {
   907	      console.error(
   908	        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
   909	      );
   910	    }
   911	
   912	    const extraData: Record<string, unknown> = {
   913	      stateStats: pipelineResult.annotations.stateStats,
   914	      featureFlags: {
   915	        ...pipelineResult.annotations.featureFlags,
   916	      },
   917	      pipelineMetadata: pipelineResult.metadata,
   918	    };
   919	    if (lexicalCapability) {
   920	      extraData.lexicalPath = lexicalCapability.lexicalPath;
   921	      extraData.fallbackState = lexicalCapability.fallbackState;
   922	    }
   923	
   924	    if (pipelineResult.annotations.evidenceGapWarning) {
   925	      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
   926	    }
   927	
   928	    if (detectedIntent) {
   929	      extraData.intent = {
   930	        type: detectedIntent,
   931	        confidence: intentConfidence,
   932	        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
   933	        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
   934	      };
   935	    }
   936	
   937	    if (artifactRouting) {
   938	      extraData.artifactRouting = artifactRouting;
   939	      extraData.artifact_routing = artifactRouting;
   940	    }
   941	
   942	    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
   943	      extraData.feedbackSignals = { applied: true };
   944	      extraData.feedback_signals = { applied: true };
   945	    }
   946	
   947	    if (pipelineResult.metadata.stage2.graphContribution) {
   948	      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
   949	      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
   950	    }
   951	
   952	    if (pipelineResult.metadata.stage3.rerankApplied) {
   953	      extraData.rerankMetadata = {
   954	        reranking_enabled: true,
   955	        reranking_requested: true,
   956	        reranking_applied: true,
   957	      };
   958	    }
   959	
   960	    if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
   961	      extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   962	      extraData.chunk_reassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   963	    }
   964	
   965	    if (pipelineResult.trace) {
   966	      extraData.retrievalTrace = pipelineResult.trace;
   967	    }
   968	    try {
   969	      const adaptiveShadow = buildAdaptiveShadowProposal(
   970	        requireDb(),
   971	        effectiveQuery,
   972	        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
   973	      );
   974	      if (adaptiveShadow) {
   975	        extraData.adaptiveShadow = adaptiveShadow;
   976	        extraData.adaptive_shadow = adaptiveShadow;
   977	      }
   978	    } catch (_error: unknown) {
   979	      // Adaptive proposal logging is best-effort only
   980	    }
   981	
   982	    _evalChannelPayloads = buildEvalChannelPayloads(resultsForFormatting);
   983	
   984	    const appliedBoosts: Record<string, unknown> = {
   985	      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
   986	      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
   987	    };
   988	    if (folderBoost && folderBoost.folder) {
   989	      appliedBoosts.folder = { applied: true, folder: folderBoost.folder, factor: folderBoost.factor };
   990	    }
   991	    if (communityFallbackApplied) {
   992	      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
   993	    }
   994	    extraData.appliedBoosts = appliedBoosts;
   995	    extraData.applied_boosts = appliedBoosts;
   996	
   997	    let formatted = await formatSearchResults(
   998	      resultsForFormatting as RawSearchResult[],
   999	      pipelineConfig.searchType,
  1000	      includeContent,
  1001	      anchors,
  1002	      null,
  1003	      null,
  1004	      extraData,
  1005	      includeTrace,
  1006	      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
  1007	      specFolder ?? null // REQ-D5-001: pass specFolder for recovery narrowing detection
  1008	    );
  1009	
  1010	    // Prepend evidence gap warning if present
  1011	    if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
  1012	      try {
  1013	        const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
  1014	        if (typeof parsed.summary === 'string') {
  1015	          parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
  1016	          formatted.content[0].text = JSON.stringify(parsed, null, 2);
  1017	        }
  1018	      } catch (_error: unknown) {
  1019	        // Non-fatal
  1020	      }
  1021	    }
  1022	
  1023	    if (isProgressiveDisclosureEnabled()) {
  1024	      const parsedFormatted = parseResponseEnvelope(formatted);
  1025	      if (parsedFormatted) {
  1026	        const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
  1027	          ? parsedFormatted.envelope.data as Record<string, unknown>
  1028	          : {};
  1029	        data.progressiveDisclosure = buildProgressiveResponse(
  1030	          resultsForFormatting,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Gemini BeforeAgent Hook — Compact Inject (One-Shot)
     4	// ───────────────────────────────────────────────────────────────
     5	// Runs on Gemini CLI BeforeAgent event. Checks for cached compact
     6	// payload from PreCompress hook and injects it once. Subsequent
     7	// BeforeAgent calls are no-ops (one-shot behavior).
     8	//
     9	// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
    10	//                 timestamp, prompt }
    11	//
    12	// Gemini stdout: JSON with hookSpecificOutput.additionalContext
    13	//   → Gemini appends to the agent's prompt
    14	
    15	import {
    16	  hookLog, truncateToTokenBudget,
    17	  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET,
    18	  sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
    19	} from '../claude/shared.js';
    20	import { ensureStateDir, loadState, readCompactPrime, clearCompactPrime } from '../claude/hook-state.js';
    21	import { parseGeminiStdin, formatGeminiOutput } from './shared.js';
    22	
    23	const CACHE_TTL_MS = 30 * 60 * 1000;
    24	
    25	async function main(): Promise<void> {
    26	  ensureStateDir();
    27	
    28	  const input = await withTimeout(parseGeminiStdin(), HOOK_TIMEOUT_MS, null);
    29	  if (!input) {
    30	    hookLog('warn', 'gemini:compact-inject', 'No stdin input received');
    31	    return;
    32	  }
    33	
    34	  const sessionId = input.session_id ?? 'unknown';
    35	
    36	  // One-shot: only inject if there's a pending compact payload
    37	  const pendingCompactPrime = readCompactPrime(sessionId);
    38	  if (!pendingCompactPrime) {
    39	    // No cached payload — this is the normal case for non-post-compress turns
    40	    return;
    41	  }
    42	
    43	  const { payload, cachedAt } = pendingCompactPrime;
    44	  const cachedAtMs = new Date(cachedAt).getTime();
    45	  const cacheAgeMs = Date.now() - cachedAtMs;
    46	
    47	  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    48	    hookLog('warn', 'gemini:compact-inject', `Rejecting stale compact cache (cached at ${cachedAt})`);
    49	    return;
    50	  }
    51	
    52	  const sanitizedPayload = sanitizeRecoveredPayload(payload);
    53	  const wrappedPayload = wrapRecoveredCompactPayload(sanitizedPayload, cachedAt);
    54	
    55	  hookLog('info', 'gemini:compact-inject', `Injecting cached compact brief (${sanitizedPayload.length} chars, cached at ${cachedAt})`);
    56	
    57	  const state = loadState(sessionId);
    58	  const sections: string[] = [
    59	    '## Recovered Context (Post-Compression)',
    60	    wrappedPayload,
    61	    '',
    62	    '## Recovery Instructions',
    63	    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    64	  ];
    65	
    66	  if (state?.lastSpecFolder) {
    67	    sections.push('', `## Active Spec Folder`, `Last active: ${state.lastSpecFolder}`);
    68	  }
    69	
    70	  const rawOutput = truncateToTokenBudget(sections.join('\n'), COMPACTION_TOKEN_BUDGET);
    71	  const output = formatGeminiOutput(rawOutput);
    72	  process.stdout.write(output);
    73	
    74	  // Clear compact payload only AFTER stdout write succeeds
    75	  clearCompactPrime(sessionId);
    76	
    77	  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
    78	}
    79	
    80	// Run — exit cleanly even on error
    81	main().catch((err: unknown) => {
    82	  hookLog('error', 'gemini:compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
    83	}).finally(() => {
    84	  process.exit(0);
    85	});

codex
I’ve got enough evidence on the Public side to map the retrieval planes cleanly: memory, semantic code, and structural code are already separated both in docs and in bootstrap/auto-prime payloads. I’m closing the loop with a couple of targeted checks on schema exposure and repo structure so the final findings can distinguish “implemented in tool contracts” from “only hinted in prompts.”
exec
/bin/zsh -lc 'rg -n "retrievalLevel|memory_search|memory_context|code_graph_query|mcp__cocoindex_code__search" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '210,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -name AGENTS.md -o -name CLAUDE.md -o -name README.md | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
42:  name: 'memory_context',
43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
49:  name: 'memory_search',
50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
639:  name: 'code_graph_query',
664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',

 succeeded in 0ms:
   210	const memoryMatchTriggers: ToolDefinition = {
   211	  name: 'memory_match_triggers',
   212	  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
   213	  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
   214	};
   215	
   216	// T306: Added asyncEmbedding parameter for non-blocking embedding generation
   217	const memorySave: ToolDefinition = {
   218	  name: 'memory_save',
   219	  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
   220	  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
   221	};
   222	
   223	// L3: Discovery - Browse and explore (Token Budget: 800)
   224	const memoryList: ToolDefinition = {
   225	  name: 'memory_list',
   226	  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
   227	  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
   228	};
   229	
   230	const memoryStats: ToolDefinition = {
   231	  name: 'memory_stats',
   232	  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
   233	  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
   234	};
   235	
   236	const memoryHealth: ToolDefinition = {
   237	  name: 'memory_health',
   238	  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
   239	  inputSchema: {
   240	    type: 'object',
   241	    additionalProperties: false,
   242	    properties: {
   243	      reportMode: {
   244	        type: 'string',
   245	        enum: ['full', 'divergent_aliases'],
   246	        default: 'full',
   247	        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
   248	      },
   249	      limit: {
   250	        type: 'number',
   251	        default: 20,
   252	        minimum: 1,
   253	        maximum: 200,
   254	        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
   255	      },
   256	      specFolder: {
   257	        type: 'string',
   258	        description: 'Optional spec folder filter for divergent alias triage mode.'
   259	      },
   260	      autoRepair: {
   261	        type: 'boolean',
   262	        default: false,
   263	        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
   264	      },
   265	      confirmed: {
   266	        type: 'boolean',
   267	        default: false,
   268	        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
   269	      }
   270	    },
   271	    required: []
   272	  },
   273	};
   274	
   275	// L4: Mutation - Modify existing memories (Token Budget: 500)
   276	const memoryDelete: ToolDefinition = {
   277	  name: 'memory_delete',
   278	  description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Requires EITHER id (single delete) OR specFolder + confirm:true (bulk delete). Token Budget: 500.',
   279	  inputSchema: {
   280	    type: 'object',
   281	    additionalProperties: false,
   282	    'x-requiredAnyOf': [['id'], ['specFolder', 'confirm']],
   283	    properties: {
   284	      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
   285	      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
   286	      confirm: { type: 'boolean', const: true, description: 'Safety gate. When provided, confirm must be true.' }
   287	    }
   288	  },
   289	};
   290	
   291	const memoryUpdate: ToolDefinition = {
   292	  name: 'memory_update',
   293	  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
   294	  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
   295	};
   296	
   297	const memoryValidate: ToolDefinition = {
   298	  name: 'memory_validate',
   299	  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
   300	  inputSchema: {
   301	    type: 'object',
   302	    additionalProperties: false,
   303	    properties: {
   304	      id: { type: 'number', minimum: 1, description: 'Memory ID to validate' },
   305	      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
   306	      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
   307	      queryTerms: { type: 'array', items: { type: 'string' }, description: 'Optional normalized query terms used for learned feedback term extraction' },
   308	      resultRank: { type: 'number', minimum: 1, description: 'Optional rank position (1-based) of the selected memory in search results' },
   309	      totalResultsShown: { type: 'number', minimum: 1, description: 'Optional total number of results shown to the user' },
   310	      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
   311	      intent: { type: 'string', description: 'Optional classified intent associated with the originating query' },
   312	      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
   313	      notes: { type: 'string', description: 'Optional free-form notes associated with this validation event' },
   314	    },
   315	    required: ['id', 'wasUseful']
   316	  },
   317	};
   318	
   319	const memoryBulkDelete: ToolDefinition = {
   320	  name: 'memory_bulk_delete',
   321	  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
   322	  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
   323	};
   324	
   325	// L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
   326	const checkpointCreate: ToolDefinition = {
   327	  name: 'checkpoint_create',
   328	  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
   329	  inputSchema: {
   330	    type: 'object',
   331	    additionalProperties: false,
   332	    properties: {
   333	      name: { type: 'string', minLength: 1, description: 'Unique checkpoint name' },
   334	      specFolder: { type: 'string', description: 'Limit to specific spec folder' },
   335	      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
   336	      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
   337	      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
   338	      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
   339	      metadata: { type: 'object', description: 'Additional metadata' }
   340	    },

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md

exec
/bin/zsh -lc 'rg -n "snowflake-arctic|Reciprocal Rank Fusion|RRF|global collection|directory-name|core" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
43:| `memory_store` | Store a project-scoped memory (optionally as `core`) |
44:| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
55:| Project | `<directory-name>` | Sessions in the same project |
57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
58:| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
60:The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.
74:- Mark critical, always-relevant context as core (core=true) — but use sparingly.
84:- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
85:- **Reciprocal Rank Fusion** combines both for best results

codex
I’ve confirmed the external repo really is wrapper-thin: there’s only the README and wrapper source, with no extra AGENTS or architecture files to hide backend logic. I’m doing one last schema pass for `retrievalLevel` exposure, then I’ll synthesize the deep-dive writeup in the exact iteration format and explicitly call out the read-only limits on file updates and memory save.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '40,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
    41	const memoryContext: ToolDefinition = {
    42	  name: 'memory_context',
    43	  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    44	  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
    45	};
    46	
    47	// L2: Core - Primary operations (Token Budget: 3500)
    48	const memorySearch: ToolDefinition = {
    49	  name: 'memory_search',
    50	  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    51	  inputSchema: {
    52	    type: 'object',
    53	    additionalProperties: false,
    54	    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    55	    properties: {
    56	      cursor: {
    57	        type: 'string',
    58	        minLength: 1,
    59	        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
    60	      },
    61	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
    62	      concepts: {
    63	        type: 'array',
    64	        items: { type: 'string', minLength: 1 },
    65	        minItems: 2,
    66	        maxItems: 5,
    67	        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
    68	      },
    69	      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
    70	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
    71	      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
    72	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
    73	      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
    74	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
    75	      sessionId: {
    76	        type: 'string',
    77	        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
    78	      },
    79	      enableDedup: {
    80	        type: 'boolean',
    81	        default: true,
    82	        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
    83	      },
    84	      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
    85	      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
    86	      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
    87	      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
    88	      includeConstitutional: {
    89	        type: 'boolean',
    90	        default: true,
    91	        description: 'Include constitutional tier memories at top of results (default: true)'
    92	      },
    93	      enableSessionBoost: {
    94	        type: 'boolean',
    95	        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
    96	      },
    97	      enableCausalBoost: {
    98	        type: 'boolean',
    99	        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
   100	      },
   101	      includeContent: {
   102	        type: 'boolean',
   103	        default: false,
   104	        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
   105	      },
   106	      anchors: {
   107	        type: 'array',
   108	        items: { type: 'string' },
   109	        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
   110	      },
   111	      profile: {
   112	        type: 'string',
   113	        enum: ['quick', 'research', 'resume', 'debug'],
   114	        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
   115	      },
   116	      min_quality_score: {
   117	        type: 'number',
   118	        minimum: 0,
   119	        maximum: 1,
   120	        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts | sed -n '132,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   132	  const sections: OutputSection[] = [
   133	    {
   134	      title: 'Session Context',
   135	      content: startupSurface,
   136	    },
   137	    {
   138	      title: 'Recovery Tools',
   139	      content: [
   140	        '- `memory_context({ input, mode })` — unified context retrieval',
   141	        '- `memory_match_triggers({ prompt })` — fast trigger matching',
   142	        '- `memory_search({ query })` — semantic search',
   143	        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
   144	      ].join('\n'),
   145	    },
   146	  ];
   147	  if (startupBrief?.graphOutline) {
   148	    sections.push({
   149	      title: 'Structural Context',
   150	      content: startupBrief.graphOutline,
   151	    });
   152	  } else if (startupBrief?.graphState === 'empty') {
   153	    sections.push({
   154	      title: 'Structural Context',
   155	      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
   156	    });
   157	  }
   158	
   159	  if (sessionContinuity) {
   160	    sections.push({
   161	      title: 'Session Continuity',
   162	      content: sessionContinuity,
   163	    });
   164	  }
   165	
   166	  if (startupBrief?.graphState === 'stale') {
   167	    sections.push({
   168	      title: 'Stale Code Graph Warning',
   169	      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
   170	    });
   171	  }
   172	
   173	  return sections;
   174	}
   175	
   176	/** Handle source=resume: load resume context for continued session */
   177	function handleResume(sessionId: string): OutputSection[] {
   178	  const state = loadState(sessionId);
   179	  const startupBrief = buildStartupBrief ? buildStartupBrief() : null;
   180	  const sections: OutputSection[] = [];
   181	
   182	  if (state?.lastSpecFolder) {
   183	    sections.push({
   184	      title: 'Session Continuity',
   185	      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
   186	    });
   187	  } else {
   188	    sections.push({
   189	      title: 'Session Resume',
   190	      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
   191	    });
   192	  }
   193	
   194	  return sections;
   195	}
   196	
   197	/** Handle source=clear: minimal output after /clear */
   198	function handleClear(): OutputSection[] {
   199	  return [
   200	    {
   201	      title: 'Fresh Context',
   202	      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
   203	    },
   204	  ];
   205	}
   206	
   207	async function main(): Promise<void> {
   208	  ensureStateDir();
   209	
   210	  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);

exec
/bin/zsh -lc "rg -n \"searchCommunities|isDualRetrievalEnabled|community search fallback|retrievalLevel\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:483:      communitySearch: 'When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:12:import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:13:import { searchCommunities } from '../lib/search/community-search.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:815:      isDualRetrievalEnabled() &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:826:          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:101:export function searchCommunities(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:175:    console.warn(`[community-search] searchCommunities failed (fail-open): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:661: * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:664:export function isDualRetrievalEnabled(): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:18:import { searchCommunities } from '../lib/search/community-search';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:53:describe('searchCommunities()', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:71:    expect(searchCommunities('search', db)).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:79:    expect(searchCommunities('search', db)).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:93:    const result = searchCommunities('search quality', db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:114:    const result = searchCommunities('search', db, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:126:    const result = searchCommunities('search pipeline', db);

codex
I’ve confirmed `retrievalLevel` is not just an internal heuristic; it’s also surfaced in bootstrap text and auto-prime routing, even though it isn’t front-and-center in the base tool description. I’m doing one short read on the dual-retrieval flag docs and community search helper so I can be precise about where Public already goes beyond Mnemosyne’s two-scope wrapper.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '652,680p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   652	 * and injects matching community members as candidates.
   653	 * Default: TRUE (graduated). Set SPECKIT_COMMUNITY_SEARCH_FALLBACK=false to disable.
   654	 */
   655	export function isCommunitySearchFallbackEnabled(): boolean {
   656	  return isFeatureEnabled('SPECKIT_COMMUNITY_SEARCH_FALLBACK');
   657	}
   658	
   659	/**
   660	 * Phase B T019: Dual-level retrieval mode.
   661	 * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
   662	 * Default: TRUE (graduated). Set SPECKIT_DUAL_RETRIEVAL=false to disable.
   663	 */
   664	export function isDualRetrievalEnabled(): boolean {
   665	  return isFeatureEnabled('SPECKIT_DUAL_RETRIEVAL');
   666	}
   667	
   668	/**
   669	 * Phase C: Intent-to-profile auto-routing.
   670	 * When enabled, classifyIntent() results automatically select a response profile
   671	 * (quick, research, resume, debug) when no explicit profile is specified by the caller.
   672	 * Default: TRUE (graduated). Set SPECKIT_INTENT_AUTO_PROFILE=false to disable.
   673	 */
   674	export function isIntentAutoProfileEnabled(): boolean {
   675	  return isFeatureEnabled('SPECKIT_INTENT_AUTO_PROFILE');
   676	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts | sed -n '101,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   101	export function searchCommunities(
   102	  query: string,
   103	  db: Database.Database,
   104	  limit: number = 5,
   105	): CommunitySearchOutput {
   106	  const emptyOutput: CommunitySearchOutput = {
   107	    results: [],
   108	    totalMemberIds: [],
   109	    source: 'community_fallback',
   110	  };
   111	
   112	  if (!isCommunitySearchFallbackEnabled() || !isCommunitySummariesEnabled()) {
   113	    return emptyOutput;
   114	  }
   115	
   116	  try {
   117	    if (!tableExists(db, 'community_summaries')) {
   118	      return emptyOutput;
   119	    }
   120	
   121	    const queryTerms = extractQueryTerms(query);
   122	    if (queryTerms.length === 0) return emptyOutput;
   123	
   124	    const rows = db.prepare(`
   125	      SELECT community_id, summary, member_ids, member_count
   126	      FROM community_summaries
   127	      ORDER BY community_id ASC
   128	    `).all() as Array<{
   129	      community_id: number;
   130	      summary: string;
   131	      member_ids: string;
   132	      member_count: number;
   133	    }>;
   134	
   135	    if (rows.length === 0) return emptyOutput;
   136	
   137	    // Score and rank communities by query-term match
   138	    const scored: CommunitySearchResult[] = [];
   139	    for (const row of rows) {
   140	      const matchScore = scoreSummary(row.summary, queryTerms);
   141	      if (matchScore > 0) {
   142	        scored.push({
   143	          communityId: row.community_id,
   144	          summary: row.summary,
   145	          memberIds: parseMemberIds(row.member_ids),
   146	          memberCount: row.member_count,
   147	          matchScore,
   148	        });
   149	      }
   150	    }
   151	
   152	    // Sort by match score descending, then by member count descending
   153	    scored.sort((a, b) => {
   154	      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
   155	      return b.memberCount - a.memberCount;
   156	    });
   157	
   158	    const topResults = scored.slice(0, limit);
   159	
   160	    // Collect unique member IDs across all matched communities
   161	    const memberIdSet = new Set<number>();
   162	    for (const r of topResults) {
   163	      for (const id of r.memberIds) {
   164	        memberIdSet.add(id);
   165	      }
   166	    }
   167	
   168	    return {
   169	      results: topResults,
   170	      totalMemberIds: Array.from(memberIdSet),
   171	      source: 'community_fallback',
   172	    };
   173	  } catch (error: unknown) {
   174	    const message = error instanceof Error ? error.message : String(error);
   175	    console.warn(`[community-search] searchCommunities failed (fail-open): ${message}`);
   176	    return emptyOutput;
   177	  }
   178	}

exec
/bin/zsh -lc 'rg -n "retrievalLevel" -A3 -B3 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
codex
One useful discrepancy just surfaced: `memory_search` supports `retrievalLevel` in the handler and the runtime hints mention it, but the shared `tool-schemas.ts` search schema doesn’t appear to expose it. I’m verifying that absence across the full schema block now, because that’s exactly the kind of contract drift this phase should call out.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '120,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
   121	      },
   122	      minQualityScore: {
   123	        type: 'number',
   124	        minimum: 0,
   125	        maximum: 1,
   126	        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
   127	      },
   128	      bypassCache: {
   129	        type: 'boolean',
   130	        default: false,
   131	        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
   132	      },
   133	      rerank: {
   134	        type: 'boolean',
   135	        default: true,
   136	        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
   137	      },
   138	      applyLengthPenalty: {
   139	        type: 'boolean',
   140	        default: true,
   141	        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
   142	      },
   143	      applyStateLimits: {
   144	        type: 'boolean',
   145	        default: false,
   146	        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
   147	      },
   148	      minState: {
   149	        type: 'string',
   150	        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
   151	        default: 'WARM',
   152	        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
   153	      },
   154	      intent: {
   155	        type: 'string',
   156	        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
   157	        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
   158	      },
   159	      autoDetectIntent: {
   160	        type: 'boolean',
   161	        default: true,
   162	        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
   163	      },
   164	      // Fix #13 : Expose previously hidden handler parameters
   165	      trackAccess: {
   166	        type: 'boolean',
   167	        default: false,
   168	        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
   169	      },
   170	      includeArchived: {
   171	        type: 'boolean',
   172	        default: false,
   173	        description: 'Include archived memories in search results. Default: false (archived excluded).'
   174	      },
   175	      mode: {
   176	        type: 'string',
   177	        enum: ['auto', 'deep'],
   178	        default: 'auto',
   179	        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
   180	      },
   181	      includeTrace: {
   182	        type: 'boolean',
   183	        default: false,
   184	        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
   185	      }
   186	    }
   187	  },
   188	};
   189	
   190	// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
   191	const memoryQuickSearch: ToolDefinition = {
   192	  name: 'memory_quick_search',
   193	  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
   194	  inputSchema: {
   195	    type: 'object',
   196	    additionalProperties: false,
   197	    properties: {
   198	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
   199	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
   200	      specFolder: { type: 'string', description: 'Restrict to spec folder' },
   201	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
   202	      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
   203	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
   204	      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
   205	    },
   206	    required: ['query'],
   207	  },
   208	};
   209	
   210	const memoryMatchTriggers: ToolDefinition = {

exec
/bin/zsh -lc 'grep -n "retrievalLevel" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts || true' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
codex
# Iteration 015: DEEP DIVE - SECOND PATTERN

## Focus
DEEP DIVE - SECOND PATTERN: the retrieval-plane boundary. Full implementation analysis of whether Mnemosyne’s hybrid memory search should influence Public as a unified semantic engine or stay one plane inside a federated retrieval stack.

## Findings
### Finding 1: Mnemosyne’s hybrid story stays inside one memory plane, while Public already codifies a federated retrieval stack
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L42), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L795), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85)
- **What it does**: README-documented Mnemosyne promises BM25 plus vector plus RRF, but wrapper-confirmed behavior exposes only memory tools over `mnemosyne search/add/delete`. Public, by contrast, explicitly routes memory retrieval to `memory_context` or `memory_search`, semantic code retrieval to `mcp__cocoindex_code__search`, and structural code retrieval to `code_graph_query`.
- **Why it matters for us**: The right lesson is not “merge everything semantic into one hybrid engine.” It is “keep memory retrieval as one plane in a larger task-routed system.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Public’s memory plane already goes deeper than Mnemosyne’s project/global split through `retrievalLevel` and community fallback
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L660), [community-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts#L101), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L482)
- **What it does**: Wrapper-confirmed Mnemosyne has two collection scopes: project and global. Public’s memory handler already supports `retrievalLevel: local/global/auto`, and when enabled it can fall back from entity search into community summaries and inject member memories back into the result set.
- **Why it matters for us**: Mnemosyne does not add a stronger retrieval model than Public already has inside the memory plane. Its value is ergonomic simplicity, not retrieval depth.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Public operationalizes retrieval federation at runtime; Mnemosyne mostly documents it as expected agent behavior
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L143), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L454), [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L138)
- **What it does**: Mnemosyne’s README recommends AGENTS instructions and its compaction hook reminds the agent that memory tools exist. Public goes further: bootstrap, auto-prime, and session-prime all surface concrete recovery calls and tool-routing guidance before the user has to remember the architecture.
- **Why it matters for us**: Public’s federation is not just conceptual; it is already encoded into runtime guidance. That is a stronger pattern than Mnemosyne’s README-first discipline.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Mnemosyne’s project/global model is a thin UX alias over collection naming, not a replacement for Public’s governed scope model
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L44), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L69)
- **What it does**: Wrapper-confirmed Mnemosyne derives the project collection from `path.basename(targetDir)`, renames `global` to `default`, auto-inits the project collection at load, and lazily inits the global collection on first global write. Public’s exposed scope surfaces are instead `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`.
- **Why it matters for us**: Mnemosyne’s UX is attractive, but its basename-derived project key is much weaker than Public’s explicit governed scope model. If we copy anything, it should be the convenience aliasing, not the authority model.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Public has a contract-visibility gap: `retrievalLevel` exists in runtime behavior but not in the shared `memory_search` schema
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L760), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L482), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L186)
- **What it does**: Public’s handler and runtime hints clearly support local or global memory retrieval plus automatic community fallback, but the shared `memory_search` schema block does not expose a `retrievalLevel` input at all. Mnemosyne avoids this kind of split because its project/global distinction is visible directly in separate tools.
- **Why it matters for us**: This is the clearest actionable gap from the second pattern: Public’s memory-plane federation is stronger than Mnemosyne’s, but its contract surface does not fully reveal that power.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [iteration-014.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md)
- [phase-research-prompt.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
- [community-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.72
- Questions addressed: retrieval-plane boundary, project vs global scoping ergonomics, runtime routing enforcement, AGENTS guidance reuse, contract drift between handler and schema
- Questions answered: Mnemosyne confirms the value of a dedicated memory plane, but Public’s stronger design is federation by task intent. Public already exceeds Mnemosyne inside the memory plane through `retrievalLevel` and community fallback. The most actionable gap is not backend ranking work; it is surfacing that memory-plane contract consistently in the shared schema and OpenCode-facing UX. The exact validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: Reading the wrapper before the README, then tracing Public from `tool-schemas.ts` to `memory-search.ts` to bootstrap and hook surfaces made the real architecture boundary obvious.
- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, or `implementation-summary.md`, and I could not run `generate-context.js` successfully for a real memory save. The phase prompt’s nested `external/opencode-mnemosyne-main` path also does not match the actual checkout, which is rooted directly at `external/`.

## Recommended Next Focus
Third pattern: offline-first readiness and failure handling. Go deeper on how Mnemosyne’s missing-binary and first-model-download behavior compares with Public’s explicit readiness, degraded-mode, and repair guidance, and identify whether any OpenCode-facing readiness facade should be added without weakening the governed core.
hook: Stop
hook: Stop Completed
tokens used
148,349
# Iteration 015: DEEP DIVE - SECOND PATTERN

## Focus
DEEP DIVE - SECOND PATTERN: the retrieval-plane boundary. Full implementation analysis of whether Mnemosyne’s hybrid memory search should influence Public as a unified semantic engine or stay one plane inside a federated retrieval stack.

## Findings
### Finding 1: Mnemosyne’s hybrid story stays inside one memory plane, while Public already codifies a federated retrieval stack
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L42), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L795), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85)
- **What it does**: README-documented Mnemosyne promises BM25 plus vector plus RRF, but wrapper-confirmed behavior exposes only memory tools over `mnemosyne search/add/delete`. Public, by contrast, explicitly routes memory retrieval to `memory_context` or `memory_search`, semantic code retrieval to `mcp__cocoindex_code__search`, and structural code retrieval to `code_graph_query`.
- **Why it matters for us**: The right lesson is not “merge everything semantic into one hybrid engine.” It is “keep memory retrieval as one plane in a larger task-routed system.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Public’s memory plane already goes deeper than Mnemosyne’s project/global split through `retrievalLevel` and community fallback
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L660), [community-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts#L101), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L482)
- **What it does**: Wrapper-confirmed Mnemosyne has two collection scopes: project and global. Public’s memory handler already supports `retrievalLevel: local/global/auto`, and when enabled it can fall back from entity search into community summaries and inject member memories back into the result set.
- **Why it matters for us**: Mnemosyne does not add a stronger retrieval model than Public already has inside the memory plane. Its value is ergonomic simplicity, not retrieval depth.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Public operationalizes retrieval federation at runtime; Mnemosyne mostly documents it as expected agent behavior
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L143), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L454), [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L138)
- **What it does**: Mnemosyne’s README recommends AGENTS instructions and its compaction hook reminds the agent that memory tools exist. Public goes further: bootstrap, auto-prime, and session-prime all surface concrete recovery calls and tool-routing guidance before the user has to remember the architecture.
- **Why it matters for us**: Public’s federation is not just conceptual; it is already encoded into runtime guidance. That is a stronger pattern than Mnemosyne’s README-first discipline.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Mnemosyne’s project/global model is a thin UX alias over collection naming, not a replacement for Public’s governed scope model
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L44), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L69)
- **What it does**: Wrapper-confirmed Mnemosyne derives the project collection from `path.basename(targetDir)`, renames `global` to `default`, auto-inits the project collection at load, and lazily inits the global collection on first global write. Public’s exposed scope surfaces are instead `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`.
- **Why it matters for us**: Mnemosyne’s UX is attractive, but its basename-derived project key is much weaker than Public’s explicit governed scope model. If we copy anything, it should be the convenience aliasing, not the authority model.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Public has a contract-visibility gap: `retrievalLevel` exists in runtime behavior but not in the shared `memory_search` schema
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L760), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L482), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L186)
- **What it does**: Public’s handler and runtime hints clearly support local or global memory retrieval plus automatic community fallback, but the shared `memory_search` schema block does not expose a `retrievalLevel` input at all. Mnemosyne avoids this kind of split because its project/global distinction is visible directly in separate tools.
- **Why it matters for us**: This is the clearest actionable gap from the second pattern: Public’s memory-plane federation is stronger than Mnemosyne’s, but its contract surface does not fully reveal that power.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [iteration-014.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md)
- [phase-research-prompt.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
- [community-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.72
- Questions addressed: retrieval-plane boundary, project vs global scoping ergonomics, runtime routing enforcement, AGENTS guidance reuse, contract drift between handler and schema
- Questions answered: Mnemosyne confirms the value of a dedicated memory plane, but Public’s stronger design is federation by task intent. Public already exceeds Mnemosyne inside the memory plane through `retrievalLevel` and community fallback. The most actionable gap is not backend ranking work; it is surfacing that memory-plane contract consistently in the shared schema and OpenCode-facing UX. The exact validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: Reading the wrapper before the README, then tracing Public from `tool-schemas.ts` to `memory-search.ts` to bootstrap and hook surfaces made the real architecture boundary obvious.
- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, or `implementation-summary.md`, and I could not run `generate-context.js` successfully for a real memory save. The phase prompt’s nested `external/opencode-mnemosyne-main` path also does not match the actual checkout, which is rooted directly at `external/`.

## Recommended Next Focus
Third pattern: offline-first readiness and failure handling. Go deeper on how Mnemosyne’s missing-binary and first-model-download behavior compares with Public’s explicit readiness, degraded-mode, and repair guidance, and identify whether any OpenCode-facing readiness facade should be added without weakening the governed core.
