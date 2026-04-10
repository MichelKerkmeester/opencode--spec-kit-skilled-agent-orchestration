## Assessment
- New information ratio: 0.30

## Recommended Next Focus
Compare this freshness-only Mex model against Phase 003’s true FSRS-style memory lifecycle, then spec one Public-native temporal contract with four separate lanes: `freshness provenance`, `retrieval decay`, `session attention decay`, and `archival or repair`. That will keep us from collapsing “old,” “irrelevant,” and “possibly wrong” into one score.
--- Iteration 24 ---
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

--
## Findings
### Finding 1: Static markdown reference integrity is the only clear adopt-now slice
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: Mex extracts typed markdown claims from inline code, code blocks, and dependency headings, then runs zero-token checks for missing paths, dead frontmatter edges, and `patterns/INDEX.md` drift. It already distinguishes real missing references from pattern/template placeholders by downgrading some path misses to warnings.
- **Why it matters for us**: This cleanly maps to our real gap. Spec Kit already has semantic retrieval, trigger recall, causal links, and health tooling, but it does not statically verify that markdown references still point to real files or that pattern indexes stay in sync.
- **Recommendation**: adopt now
- **Impact**: high
--- Iteration 21 ---
--- Iteration 25 ---
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

--
## Findings
### Finding 1: Static markdown reference integrity is the only clear adopt-now slice
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: Mex extracts typed markdown claims from inline code, code blocks, and dependency headings, then runs zero-token checks for missing paths, dead frontmatter edges, and `patterns/INDEX.md` drift. It already distinguishes real missing references from pattern/template placeholders by downgrading some path misses to warnings.
- **Why it matters for us**: This cleanly maps to our real gap. Spec Kit already has semantic retrieval, trigger recall, causal links, and health tooling, but it does not statically verify that markdown references still point to real files or that pattern indexes stay in sync.
- **Recommendation**: adopt now
- **Impact**: high
--- Iteration 21 ---
- **Why it matters**: This is useful after a conflict or drift event, but it does not prevent concurrent writes or resolve competing memory versions. It is a recovery workflow, not a merge-control system.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Spec Kit Memory already has explicit shared vs private scoping with deny-by-default access control
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L893), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L1703), [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L507), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L144), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L985)
- **What it does**: Shared memory is opt-in. Spaces start locked, membership is role-based, caller identity must be exactly one user or agent, and retrieval filters candidates by `tenantId`, `userId`, `agentId`, and allowed `sharedSpaceId`s before ranking continues.
- **Why it matters**: This is the concrete multi-agent safety layer Mex lacks. Spec Kit distinguishes private scope from collaborative scope at query time and mutation time, rather than relying on directory boundaries alone.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Spec Kit Memory also has real concurrent-write and conflict controls that Mex does not
- **Source**: [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1632), [spec-folder-mutex.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts#L1), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1513), [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L135), [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L678), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1503)
- **What it does**: The server forces SQLite WAL mode, `memory_save` serializes writes with a per-spec-folder mutex, uses unique pending-file suffixes to avoid pending-file races, logs shared-space conflicts into `shared_space_conflicts`, and escalates repeat or high-risk collisions from `append_version` to `manual_merge`.
- **Why it matters**: This is a genuine concurrency and merge-conflict story: serialize same-scope saves, preserve data, and retain an auditable record when shared writes collide. That is materially stronger than Mex’s “repair after drift” approach.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Checkpoint restore adds another safety boundary by blocking saves and rolling back failed merge restores
- **Source**: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1080), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L1097), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L1855)
- **What it does**: `memory_save` refuses writes while checkpoint restore maintenance is active, and merge-mode restore uses savepoints so reinsertion failures roll back instead of leaving partially restored scoped data behind.
- **Why it matters**: This is important multi-agent safety during maintenance windows. It prevents a restore from interleaving with live writes and turning scoped memories or shared-space state into mixed snapshots.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.48

## Recommended Next Focus
Compare these backend safeguards against the user-facing surface. The next high-value pass is: how should `memory_search`, `memory_context`, and `/spec_kit:resume` expose shared-space conflicts, degraded trust, or `manual_merge` requirements so multi-agent collisions become visible workflow state instead of remaining mostly internal audit data.

RESEARCH BRIEF:
# $refine TIDD-EC Prompt: 002-mex-main

## 2. Role

You are a research specialist in knowledge scaffold architectures, drift detection systems, markdown-based persistence, and codebase-knowledge synchronization. Work like a systems analyst who can separate scaffold design, static drift checking, and targeted AI repair loops, then translate Mex's concrete mechanisms into practical improvements for `Code_Environment/Public`.

## 3. Task

Research Mex's markdown scaffold and drift detection patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around staleness detection, codebase-knowledge synchronization, and structured project knowledge. Determine which Mex patterns should be `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

Mex is a structured markdown scaffold with a TypeScript/Node.js CLI for persistent AI project memory. Instead of a database, it keeps project knowledge in navigable markdown files such as `AGENTS.md`, `ROUTER.md`, `context/*.md`, and `patterns/*.md`. Its defining mechanism is drift detection: eight static checkers validate scaffold claims against the real codebase without AI or token spend. Those checkers cover path validation, frontmatter edges, pattern index consistency, staleness based on git history, command existence, dependency claims, cross-file contradictions, and script coverage. Drift starts at score `100` and deducts `-10` per error, `-3` per warning, and `-1` per info. The scaffold is designed to grow after real work through pattern creation, targeted context updates, and current-state refreshes rather than one-time setup alone.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 002 (memory persistence) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 001 (memory), 003 (memory) | Focus drift detection, scaffold structure, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (local memory) | Focus vector search, plugin architecture, scoping |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit validation via `validate.sh` with severity-oriented checks, indexed memory files with frontmatter, and a `MEMORY.md`-style documentation/memory model. What it does **not** currently have is an automated drift checker that compares documentation or memory scaffolds against the actual filesystem, commands, dependencies, git staleness, or cross-file contradictions. Research should stay centered on that gap rather than re-covering general memory persistence already addressed by phase `001`.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Start with `external/mex-main/README.md`. Read the positioning, the eight-checker summary, the drift-score model, the command surface, and the documented file structure before inferring anything from implementation details.
3. Immediately after the README, inspect the scaffold contract files in this order: `external/mex-main/AGENTS.md`, `external/mex-main/ROUTER.md`, `external/mex-main/SETUP.md`, and `external/mex-main/SYNC.md`. Treat these as the canonical markdown scaffold, growth loop, and resync workflow.
4. Map the scaffold structure explicitly: project-root tool instruction file, scaffold root, `context/` files, `patterns/INDEX.md`, pattern files, and the GROW step that updates project state and creates new patterns from real work.
5. Read `external/mex-main/src/cli.ts` next. Trace the user-facing layers in order: `mex init`, `mex check`, `mex sync`, `mex pattern add`, `mex watch`, and `mex commands`. Use this to anchor later claims about the relationship between setup, drift detection, targeted sync, and scaffold growth.
6. Read `external/mex-main/src/drift/index.ts`, `src/drift/claims.ts`, `src/drift/frontmatter.ts`, and `src/drift/scoring.ts`. Understand how Mex finds scaffold files, extracts claims from markdown, parses frontmatter edges, runs checker passes, and computes the final drift score.
7. Read `external/mex-main/src/scanner/index.ts` plus the scanner modules it composes. Focus on how Mex builds a structured brief first, then instructs AI to populate scaffold files from that brief rather than from raw exploratory browsing.
8. Read `external/mex-main/src/sync/brief-builder.ts` and `src/pattern/index.ts`. Study how Mex turns drift issues into targeted repair prompts, supplies filesystem and git context, and appends new patterns into the scaffold instead of treating documentation as static.
9. Examine the first three drift checkers individually: `src/drift/checkers/path.ts`, `src/drift/checkers/edges.ts`, and `src/drift/checkers/index-sync.ts`. Document the actual detection logic, severity behavior, placeholder handling, and what kind of documentation drift each checker catches.
10. Examine the next three drift checkers individually: `src/drift/checkers/staleness.ts`, `src/drift/checkers/command.ts`, and `src/drift/checkers/dependency.ts`. Capture the exact thresholds and matching rules, including how staleness uses both days and commit counts, how commands are validated, and how dependency claims are compared to manifests.
11. Examine the final two drift checkers individually: `src/drift/checkers/cross-file.ts` and `src/drift/checkers/script-coverage.ts`. Explain how Mex detects contradictions across scaffold files and how it checks whether real scripts are missing from the scaffold narrative.
12. Compare Mex directly against current `Code_Environment/Public` capabilities: Spec Kit validation, memory frontmatter, documented memory/index structure, and other repo guidance files. Be precise about where Mex adds new capability versus where it overlaps with systems already covered by phases `001`, `003`, or `004`.
13. Before any deep-research run, ensure this phase folder contains the expected spec-kit docs for the chosen level. Validate the phase folder with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict
    ```
14. After validation passes, run deep research using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main and identify concrete improvements for Code_Environment/Public, especially around knowledge scaffold design, drift detection, staleness checking, codebase-knowledge synchronization, and structured project memory.
    ```
15. Save all outputs inside this phase folder, especially under `research/`. Every finding must cite exact file paths, describe what Mex actually does, why it matters for `Code_Environment/Public`, whether it should be `adopt now`, `prototype later`, or `reject`, what subsystem it would affect, and what migration or validation risk comes with it. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main"
    ```

## 6. Research Questions

1. How does Mex's markdown-first scaffold change the tradeoff between navigability, editability, and correctness compared with database-backed memory systems?
2. How do the eight drift checkers compose into a practical health model, and where are the blind spots between checker coverage and actual scaffold truthfulness?
3. Are Mex's staleness thresholds (`30` warning days, `90` error days, `50` warning commits, `200` error commits) reasonable defaults, and how might similar thresholds be calibrated for `Code_Environment/Public`?
4. What makes Mex's path, edge, and index-sync checks useful as low-cost documentation integrity guards, and which of those ideas translate cleanly into Spec Kit?
5. How effective is the scoring model (`100 - 10/error - 3/warning - 1/info`) as a developer-facing health metric, and would `Code_Environment/Public` benefit from a comparable score or from severity-only reporting?
6. How does Mex's claim extraction model work in practice, especially its distinction between paths, commands, dependencies, and versions pulled from markdown?
7. What does Mex gain by checking real scripts that are undocumented in the scaffold, and how does that differ from existing `validate.sh` checks in this repo?
8. How does Mex's targeted sync flow convert static drift findings into precise AI repair prompts, and could `Code_Environment/Public` adopt a similar "fix only what's broken" pattern?
9. How do Mex's GROW rules and `pattern add` workflow support scaffold auto-growth after tasks rather than only during initialization?
10. What are the strongest arguments for keeping some project knowledge in markdown even when richer search or database systems exist elsewhere in the stack?

## 7. Do's

- Do examine each of the eight drift checkers individually rather than relying on the README summary alone.
- Do study the scoring algorithm and relate score behavior to developer incentives and operational clarity.
- Do analyze how scaffold growth happens after tasks through GROW rules, `pattern add`, targeted sync, and current-state updates.
- Do compare Mex's drift logic directly against `Code_Environment/Public` validation and memory/documentation surfaces.
- Do separate static drift detection from AI-assisted repair; they are distinct layers in Mex.
- Do highlight which Mex ideas help codebase-knowledge synchronization without requiring a database.
- Do address overlap with phase `001` explicitly so this phase stays focused on drift detection and scaffold design rather than generic persistence.

## 8. Don'ts

- Do not focus the research on npm packaging, build tooling, or release mechanics.
- Do not dismiss the markdown approach as primitive; markdown is the core persistence decision under evaluation.
- Do not confuse drift detection with AI-based validation or sync; the checkers are zero-token static analysis.
- Do not let README prose overrule source evidence from `src/`.
- Do not recommend importing Mex wholesale if the reusable value is only a subset of its design.
- Do not collapse this phase into memory-persistence comparisons already owned by phase `001`.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Staleness-checking finding

`src/drift/checkers/staleness.ts` does not rely on human judgment alone; it flags scaffold files by both elapsed days and commits since last change. A strong finding would explain why combining temporal and repository-activity signals is stronger than date-only freshness, show how that could improve Public's documentation hygiene, and classify the idea as `adopt now`, `prototype later`, or `reject`.

### Example B: Drift-detection composition finding

Mex does not use one monolithic "docs are wrong" check. `path.ts`, `edges.ts`, `index-sync.ts`, `command.ts`, `dependency.ts`, `cross-file.ts`, and `script-coverage.ts` each catch a different failure mode. A strong finding would describe how those checks work together, identify which subset would most improve `Code_Environment/Public`, and explain where Spec Kit validation already covers adjacent concerns.

## 10. Constraints

### 10.1 Error handling

- If a README claim cannot be verified in `src/`, mark it as unverified instead of repeating it as fact.
- If a checker behaves differently from the README summary, prefer the source code and call out the discrepancy explicitly.
- If a file path inside the external repo is missing, say so plainly and continue with the remaining evidence rather than guessing.
- If the external repo structure changes from the paths named here, adjust the reading path but preserve the same analytical order.

### 10.2 Scope

**IN SCOPE**

- scaffold structure and navigation model
- markdown persistence design
- all eight drift checkers
- scoring and health reporting
- staleness thresholds and git-based freshness signals
- targeted sync prompt generation
- scaffold auto-growth and pattern creation
- comparison with `Code_Environment/Public` validation and memory surfaces

**OUT OF SCOPE**

- generic Node.js packaging analysis
- benchmarking build performance
- speculative database redesigns not grounded in Mex evidence
- unrelated hybrid-RAG implementation details
- re-litigating memory persistence questions already owned by phase `001`

### 10.3 Prioritization framework

Rank findings in this order: drift-detection value for `Code_Environment/Public`, documentation-to-code synchronization impact, scaffold simplicity-to-maintainability ratio, staleness-signal usefulness, compatibility with existing Spec Kit workflows, implementation cost, and cross-phase differentiation from phases `001`, `003`, and `004`.

## 11. Deliverables

- `spec.md`, `plan.md`, `tasks.md`, and any level-required spec docs present and valid before deep research starts
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison between Mex and current `Code_Environment/Public` documentation/memory validation capabilities
- findings that classify each recommendation as `adopt now`, `prototype later`, or `reject`
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- what Mex does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected subsystem
- migration risk, false-positive risk, or validation requirement

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in scaffold architecture, drift detection, markdown persistence, and synchronization
  - **Instructions** are ordered, concrete, and path-specific
  - **Context** is domain-specific and cross-phase aware
  - **Constraints** clearly limit scope and error handling
  - **Examples** show what strong Mex findings look like
- at least 5 findings are evidence-backed rather than speculative
- findings analyze both the benefits and limitations of markdown-first persistence
- findings compare Mex's static drift detection against existing `validate.sh` behavior rather than treating them as interchangeable
- overlap with phase `001` is explicitly resolved so this phase stays focused on drift detection and scaffold design

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order covered README, scaffold contract files, CLI flow, drift engine, targeted sync, and all eight checker implementations
- the validation command passed on this exact phase folder
- `research/research.md` contains at least 5 evidence-backed findings
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `002-mex-main`
- no edits were made outside the phase folder
- recommendations explicitly address staleness detection, codebase-knowledge synchronization, and structured project knowledge
- cross-phase overlap with phase `001` is explicitly addressed and bounded

OUTPUT FORMAT:
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Assessment
- New information ratio: [0.0-1.0]

## Recommended Next Focus
[next direction]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only research pass for iteration 26, centered on semantic vs lexical retrieval trade-offs in Mex versus Spec Kit Memory. I’ll do a quick memory/context pass first, then inspect the external and internal code paths that actually implement retrieval, ranking, and hybrid fusion before I synthesize the iteration output.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/mcp-coco-index/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: mcp-coco-index
description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of relevant code, patterns, and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration."
allowed-tools: [Bash, Read, Grep, Glob]
version: 1.0.0
---

<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, all-MiniLM-L6-v2 -->

# CocoIndex Code - Semantic Code Search via Vector Embeddings

Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server (1 tool: `search`) for AI agent integration via stdio transport.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User asks to "find code that does X" or "search for implementations of Y"
- User needs to discover code by concept or intent rather than exact text
- User wants to find similar code patterns across the codebase
- Grep/Glob exact matching is insufficient and fuzzy or semantic matching is needed
- User mentions "semantic search", "code search", "find similar code"
- User needs to locate logic handling a specific concern (e.g., "where is the retry logic")
- User wants to understand how a concept is implemented across multiple files
- User asks "how is X implemented" or "what handles Y"
- User wants to understand architecture or module relationships
- Starting work on an unfamiliar part of the codebase (onboarding queries)
- @context agent is exploring code structure and needs concept-based discovery
- Any exploration task where the exact function/class name is unknown

**Automatic Triggers**:
- "semantic search", "find code that", "search for implementations"
- "similar code", "code that handles", "where is the logic for"
- "cocoindex", "ccc", "vector search"
- "find similar", "code search", "search codebase"
- "how is", "what handles", "where does", "understand the"
- "explore", "architecture", "module relationships"
- "onboarding", "unfamiliar code", "new to this"

### When NOT to Use

**Do not use for**:
- Exact text or regex search (use Grep instead)
- File name or path search (use Glob instead)
- Reading known files (use Read instead)
- The codebase has not been indexed yet (run `ccc index` first)
- Simple string matching where the exact token is known
- Non-code files (semantic search is optimized for source code)

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                                   |
| ----------- | ------------------------ | ------------------------------------------- |
| ALWAYS      | Every skill invocation   | references/tool_reference.md                |
| CONDITIONAL | If intent signals match  | references/search_patterns.md, references/cross_cli_playbook.md |
| ON_DEMAND   | Only on explicit request | Full troubleshooting and configuration docs |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool_reference.md"

INTENT_SIGNALS = {
    "SEARCH": {"weight": 4, "keywords": ["search", "find", "where", "similar", "semantic", "code that"]},
    "INDEX": {"weight": 4, "keywords": ["index", "reindex", "update index", "build index", "refresh"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "configure", "ccc not found"]},
    "STATUS": {"weight": 3, "keywords": ["status", "stats", "how many files", "indexed"]},
    "TROUBLESHOOT": {"weight": 3, "keywords": ["error", "failed", "not working", "empty results"]},
    "CROSS_CLI": {"weight": 3, "keywords": ["copilot", "gemini", "claude", "codex", "cross cli", "multi query"]},
    "CONCURRENCY": {"weight": 3, "keywords": ["refresh_index", "concurrency", "concurrent", "follow-up query"]},
}

RESOURCE_MAP = {
    "SEARCH": ["references/search_patterns.md", "references/cross_cli_playbook.md", "references/tool_reference.md"],
    "INDEX": ["references/tool_reference.md"],
    "INSTALL": ["references/tool_reference.md"],
    "STATUS": ["references/tool_reference.md"],
    "TROUBLESHOOT": ["references/tool_reference.md", "references/cross_cli_playbook.md", "references/search_patterns.md"],
    "CROSS_CLI": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
    "CONCURRENCY": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "all commands", "configuration guide", "cross cli playbook"],
    "ON_DEMAND": ["references/tool_reference.md", "references/search_patterns.md", "references/cross_cli_playbook.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    if getattr(task, "index_missing", False):
        scores["INDEX"] += 5
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SEARCH"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_cocoindex_code_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Two Approaches

CocoIndex Code provides two access patterns for semantic code search:

1. **CLI (ccc)** - Direct terminal usage, fastest for one-off searches
2. **MCP server** - AI agent integration via `ccc mcp` (stdio mode)

### CLI Approach (Primary) - CocoIndex Code CLI

#### Semantic Search

```bash
# Basic semantic search
ccc search "error handling middleware" --limit 5

# Filter by language
ccc search "database connection" --lang typescript

# Filter by path
ccc search "authentication" --path "src/**"

# Combine filters
ccc search "retry logic" --lang python --path "lib/**" --limit 10
```

#### Index Management

```bash
# Check index status
ccc status

# Build or update the index
ccc index

# Reset project databases (destructive)
ccc reset

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

exec
/bin/zsh -lc 'rg -n "semantic|lexical|hybrid|fusion|memory_search|memory_context|CocoIndex|BM25|FTS|trigger" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 014-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
24:- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
25:- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
165:- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]
173:- trigger phrase filtering should block short folder-like numeric shorthands while preserving longer numeric authored phrases like `014 code graph upgrades runtime` [Task 1]
180:- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
205:- shipped 014 lane includes detector provenance vocabulary carriers, blast-radius traversal with explicit depth cap and union semantics, and low-authority hot-file breadcrumb evidence while preserving packet 011 trust-axis payloads [Task 1]
313:- 005-claudest, execution-ready lane, FTS helper forced-degrade matrix, stop-hook metadata patch, normalized analytics reader, cached-summary fast path, verifier discoverer split, token-insight contracts
383:- Claudest continuation is now an execution-ready sequence to preserve in order: FTS helper and forced-degrade tests -> stop-hook metadata patch -> normalized analytics reader -> cached-summary fast path -> verifier/discoverer split -> token-insight contracts [Task 3]
392:- follow-on phase train now implemented as: `026/005` measurement contract -> `026/006` trust-axis contract -> `026/007` detector floor -> `026/008` graph hint nudge -> `026/009` auditable publication -> `024/032` cached-summary consumer -> `024/033` optional FTS hardening -> `024/034` workflow/token-insight split [Task 8]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
460:- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
753:## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
798:- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]
847:- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1069:## Task 7: Verify and harden FTS5 ablation integrity (alignment guard + evaluation mode + parent-id normalization)
1087:- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1192:scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping
1199:- rollout_summaries/2026-03-27T13-58-07-KxRC-hybrid_rag_fusion_deep_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T14-58-07-019d2f96-895d-7600-a315-cf9e5ee673c0.jsonl, updated_at=2026-03-27T17:15:58+00:00, thread_id=019d2f96-895d-7600-a315-cf9e5ee673c0)
1203:- /spec_kit:deep-research --review, 20 iterations, evidenceGap, handler-memory-triggers.vitest.ts, FEATURE_CATALOG.md
1274:- Advisor benchmark/regression commands need explicit `--dataset` and semantic-disable env toggle for stable timing [Task 1]
1278:- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
1443:scope: structured JSON save authority, recovery-only fallback semantics, and Phase 016/011 runtime-doc-test parity
1451:- rollout_summaries/2026-03-20T13-25-39-plA6-json_mode_hybrid_enrichment_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T14-25-39-019d0b6c-4b37-7893-95f2-4903cf5564fa.jsonl, updated_at=2026-03-20T14:12:18+00:00, thread_id=019d0b6c-4b37-7893-95f2-4903cf5564fa)
1457:## Task 2: Restore/verify Phase 016 runtime/docs (dedup, projectPhase, trigger filter, retry health, contextType)
1473:- rollout_summaries/2026-03-22T10-21-03-Dc6v-review_spec_011_hybrid_rag_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T11-21-03-019d150f-ff8f-7340-8845-e3d582e7f2cb.jsonl, updated_at=2026-03-22T12:12:08+00:00, thread_id=019d150f-ff8f-7340-8845-e3d582e7f2cb)
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1503:- Phase 016 regression checks should include trigger filter export coverage, retry-health snapshot behavior, contextType passthrough, and pre-save dedup docs/tests [Task 2]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1540:- rollout_summaries/2026-03-21T13-00-24-DDYC-022_hybrid_rag_fusion_root_normalization.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T14-00-24-019d107b-868a-7b62-8c96-076460904ae2.jsonl, updated_at=2026-03-21T14:12:37+00:00, thread_id=019d107b-868a-7b62-8c96-076460904ae2)
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1551:- rollout_summaries/2026-03-21T11-13-41-ktLk-hybrid_rag_fusion_alignment_audit_2026_03_21.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T12-13-41-019d1019-d5aa-7be2-860a-ed8eaa45fe5a.jsonl, updated_at=2026-03-21T12:13:04+00:00, thread_id=019d1019-d5aa-7be2-860a-ed8eaa45fe5a)
1577:scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
1614:- rollout_summaries/2026-03-21T12-12-58-Tp5J-hybrid_rag_fusion_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T13-12-58-019d1050-19ec-7bd2-b5bd-7078f5a1dd6f.jsonl, updated_at=2026-03-21T12:59:53+00:00, thread_id=019d1050-19ec-7bd2-b5bd-7078f5a1dd6f)
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1855:- rollout_summaries/2026-03-13T11-17-06-8uZ8-orphan_remediation_hybrid_rag.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-17-06-019ce6ea-1692-7a91-913f-e70a7ef27206.jsonl, updated_at=2026-03-13T12:19:33+00:00, thread_id=019ce6ea-1692-7a91-913f-e70a7ef27206)
1900:- rollout_summaries/2026-03-13T14-00-56-wEII-audit_hybrid_rag_fusion_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T15-00-56-019ce780-1534-78c0-aa0e-53e96b088204.jsonl, updated_at=2026-03-13T14:52:39+00:00, thread_id=019ce780-1534-78c0-aa0e-53e96b088204)
1949:- rollout_summaries/2026-03-12T17-35-18-3ZLY-hybrid_rag_spec_folder_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T18-35-18-019ce31d-f9c0-74d1-9f39-6de8573ff6aa.jsonl, updated_at=2026-03-12T18:01:53+00:00, thread_id=019ce31d-f9c0-74d1-9f39-6de8573ff6aa)
1960:- rollout_summaries/2026-03-12T16-54-20-kwyP-hybrid_rag_lifecycle_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-54-20-019ce2f8-78de-7020-b460-a2ad3d10009f.jsonl, updated_at=2026-03-12T18:05:20+00:00, thread_id=019ce2f8-78de-7020-b460-a2ad3d10009f)
1975:- rollout_summaries/2026-03-13T07-35-56-VaWc-hybrid_rag_retrieval_015_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T08-35-56-019ce61f-9983-79b0-92d9-268ec7dbeb98.jsonl, updated_at=2026-03-13T08:10:57+00:00, thread_id=019ce61f-9983-79b0-92d9-268ec7dbeb98)
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2015:- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "DEEP RESEARCH iteration 26 semantic vs lexical trade-offs for Spec Kit Memory vs Mex hybrid strategies" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1494ms:
2026-04-10 22:58:44.812 xcodebuild[85534:38512983]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:58:44.990 xcodebuild[85534:38512981] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-pthP1POG' (errno=Operation not permitted)
2026-04-10 22:58:45.367 xcodebuild[85606:38513112]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:58:45.473 xcodebuild[85606:38513111] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !memory, !spec, context, document~"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep research(phrase), context, deep(name), iteration, research(name)"
  },
  {
    "skill": "mcp-coco-index",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !semantic, embedding~, index(name), research~, semantic"
  }
]

codex
I’ve got the skill context loaded. The next pass is the concrete one: I’m pulling the retrieval and scoring code from both Spec Kit Memory and Mex so we can separate where semantic recall is actually stronger, where lexical signals are deliberately superior, and what a disciplined hybrid policy should look like.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/README.md: No such file or directory

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/src/cli.ts: No such file or directory

codex
The external path layout is a little different than the brief text suggests, so I’m correcting to the real on-disk structure before going deeper. I’ll map the actual `external/` tree first, then resume the retrieval/ranking reads from the right files so the findings stay source-accurate.
exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external -maxdepth 2 -type f | sort | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external -maxdepth 2 -type d | sort | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/workflows
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test

 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/pull_request_template.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/.cursorrules
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/.windsurfrules
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/copilot-instructions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    13	- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 014-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
CocoIndex MCP is refusing the search call in this session, so I’m checking index health and then I’ll fall back to direct source reads if it still won’t cooperate. I still want one semantic-search attempt in the loop because this topic is exactly where concept-level search helps, but I won’t let the failure distort the research.
mcp: spec_kit_memory/ccc_status started
mcp: spec_kit_memory/ccc_status (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import chalk from "chalk";
import { Command } from "commander";
import { findConfig } from "./config.js";
import { reportConsole, reportQuiet, reportJSON } from "./reporter.js";

const program = new Command();

program
  .name("mex")
  .description("CLI engine for mex scaffold — drift detection, pre-analysis, and targeted sync")
  .version("0.4.0");

// ── Setup (npx entry point) ──
program
  .command("setup")
  .description("First-time setup — create .mex/ scaffold and populate with AI")
  .option("--dry-run", "Show what would happen without making changes")
  .action(async (opts) => {
    try {
      const { runSetup } = await import("./setup/index.js");
      await runSetup({ dryRun: opts.dryRun });
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ── Layer 2: Drift Detection ──
program
  .command("check")
  .description("Detect drift between scaffold files and codebase reality")
  .option("--json", "Output full drift report as JSON")
  .option("--quiet", "Single-line summary only")
  .option("--fix", "Run sync to fix any issues found")
  .action(async (opts) => {
    try {
      const config = findConfig();
      const { runDriftCheck } = await import("./drift/index.js");
      const report = await runDriftCheck(config);

      if (opts.json) {
        reportJSON(report);
      } else if (opts.quiet) {
        reportQuiet(report);
      } else {
        reportConsole(report);
      }

      // If --fix and there are issues, jump to sync
      const hasErrors = report.issues.some((i) => i.severity === "error");
      if (opts.fix && hasErrors) {
        const { runSync } = await import("./sync/index.js");
        await runSync(config, {});
        return;
      }

      if (hasErrors) process.exit(1);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ── Layer 1: Pre-analysis Scanner ──
program
  .command("init")
  .description("Scan codebase and generate pre-analysis brief for AI")
  .option("--json", "Output scanner brief as JSON")
  .action(async (opts) => {
    try {
      const config = findConfig();
      const { runScan } = await import("./scanner/index.js");
      const result = await runScan(config, { jsonOnly: opts.json });

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ── Layer 3: Targeted Sync ──
program
  .command("sync")
  .description("Run drift check, then build targeted prompts for AI to fix flagged files")
  .option("--dry-run", "Show what would be synced without executing")
  .option("--warnings", "Include warning-only files (by default only errors are synced)")
  .action(async (opts) => {
    try {
      const config = findConfig();
      const { runSync } = await import("./sync/index.js");
      await runSync(config, { dryRun: opts.dryRun, includeWarnings: opts.warnings });
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ── Layer 4: Patterns ──
const patternCmd = program
  .command("pattern")
  .description("Manage pattern files");

patternCmd
  .command("add <name>")
  .description("Create a new pattern file and add it to the index")
  .action(async (name) => {
    try {
      const config = findConfig();
      const { runPatternAdd } = await import("./pattern/index.js");
      await runPatternAdd(config, name);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ── Git Hook ──
program
  .command("watch")
  .description("Install/uninstall post-commit hook for automatic drift checking")
  .option("--uninstall", "Remove the post-commit hook")
  .action(async (opts) => {
    try {
      const config = findConfig();
      const { manageHook } = await import("./watch.js");
      await manageHook(config, { uninstall: opts.uninstall });
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ── Quick Reference ──
program
  .command("commands")
  .description("List all available commands and scripts")
  .action(() => {
    console.log(chalk.bold("\nCLI Commands") + chalk.dim("  (run from project root)\n"));
    console.log("  mex setup              First-time setup — create .mex/ scaffold");
    console.log("  mex setup --dry-run    Preview setup without making changes");
    console.log("  mex check              Drift score — are scaffold files still accurate?");
    console.log("  mex check --quiet      One-liner drift score");
    console.log("  mex check --json       Full drift report as JSON");
    console.log("  mex check --fix        Check and fix any errors found");
    console.log("  mex sync               Fix drift — Claude updates only what's broken");
    console.log("  mex sync --dry-run     Preview fix prompts without running them");
    console.log("  mex sync --warnings    Include warning-only files in sync");
    console.log("  mex init               Pre-scan codebase, build brief for AI");
    console.log("  mex init --json        Scanner brief as JSON");
    console.log("  mex pattern add <name> Create a new pattern file");
    console.log("  mex watch              Install post-commit hook for auto drift score");
    console.log("  mex watch --uninstall  Remove the post-commit hook");
    console.log();
    console.log(chalk.dim("Not installed globally? Replace 'mex' with 'npx promexeus'."));
    console.log();
  });

program.parse();

 succeeded in 0ms:
<div align="center">

<img src="mascot/mex-mascot.svg" alt="mex mascot" width="80">

```
  ███╗   ███╗███████╗██╗  ██╗
  ████╗ ████║██╔════╝╚██╗██╔╝
  ██╔████╔██║█████╗   ╚███╔╝
  ██║╚██╔╝██║██╔══╝   ██╔██╗
  ██║ ╚═╝ ██║███████╗██╔╝ ██╗
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
```

**mex**

[![CI](https://github.com/theDakshJaitly/mex/actions/workflows/ci.yml/badge.svg)](https://github.com/theDakshJaitly/mex/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/promexeus.svg)](https://www.npmjs.com/package/promexeus)

</div>

---

AI agents forget everything between sessions. mex gives them permanent, navigable project memory.

Every session starts cold:

- The agent has **no idea** what it built yesterday
- It forgets the conventions you agreed on
- It doesn't know what broke last week

Developers compensate by stuffing everything into CLAUDE.md — but that floods the context window, burns tokens, and degrades attention. Meanwhile, the project changes and nobody updates the docs. The agent's understanding drifts from reality.

mex is a structured markdown scaffold with a CLI that keeps it honest. The scaffold gives agents persistent project knowledge through navigable files — architecture, conventions, decisions, patterns. The CLI detects when those files drift from the actual codebase, and targets AI to fix only what's broken. The scaffold grows automatically — after every task, the agent updates project state and creates patterns from real work.

Works with any stack — JavaScript, Python, Go, Rust, and more.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=theDakshJaitly/mex&type=Timeline)](https://star-history.com/#theDakshJaitly/mex&Timeline)

## Install

The npm package is named `promexeus` (our social handle — `mex` was taken on npm). The CLI command is `mex`.

```bash
npx promexeus setup
```

That's it. The setup command creates the `.mex/` scaffold, asks which AI tool you use, pre-scans your codebase, and generates a targeted prompt to populate everything. Takes about 5 minutes.

At the end of setup, you'll be asked to install mex globally. If you accept:

```bash
mex check        # drift score
mex sync         # fix drift
```

If you skip global install, everything still works via npx:

```bash
npx promexeus check        # drift score
npx promexeus sync         # fix drift
```

You can install globally later at any time:

```bash
npm install -g promexeus
```

## Drift Detection

Eight checkers validate your scaffold against the real codebase. Zero tokens, zero AI.

| Checker | What it catches |
|---------|----------------|
| **path** | Referenced file paths that don't exist on disk |
| **edges** | YAML frontmatter edge targets pointing to missing files |
| **index-sync** | `patterns/INDEX.md` out of sync with actual pattern files |
| **staleness** | Scaffold files not updated in 30+ days or 50+ commits |
| **command** | `npm run X` / `make X` referencing scripts that don't exist |
| **dependency** | Claimed dependencies missing from `package.json` |
| **cross-file** | Same dependency with different versions across files |
| **script-coverage** | `package.json` scripts not mentioned in any scaffold file |

Scoring: starts at 100. Deducts -10 per error, -3 per warning, -1 per info.

<!-- TODO: Add screenshot of `mex check` terminal output here -->
![mex check output](screenshots/mex-check.jpg) 

## CLI

All commands run from your **project root**. If you didn't install globally, replace `mex` with `npx promexeus`.

### Commands

| Command | What it does |
|---------|-------------|
| `mex setup` | First-time setup — create `.mex/` scaffold and populate with AI |
| `mex setup --dry-run` | Preview what setup would do without making changes |
| `mex check` | Run all 8 checkers, output drift score and issues |
| `mex check --quiet` | One-liner: `mex: drift score 92/100 (1 warning)` |
| `mex check --json` | Full report as JSON for programmatic use |
| `mex check --fix` | Check and jump straight to sync if errors found |
| `mex sync` | Detect drift → choose mode → AI fixes → verify → repeat |
| `mex sync --dry-run` | Preview targeted prompts without executing |
| `mex sync --warnings` | Include warning-only files in sync |
| `mex init` | Pre-scan codebase, build structured brief for AI |
| `mex init --json` | Raw scanner brief as JSON |
| `mex watch` | Install post-commit hook (silent on perfect score) |
| `mex watch --uninstall` | Remove the hook |
| `mex commands` | List all commands and scripts with descriptions |


![mex sync output](screenshots/mex-sync.jpg)

Running check after drift is fixed by sync

![mex check after](screenshots/mex-check1.jpg)

## Before / After

Real output from testing mex on Agrow, an AI-powered agricultural voice helpline (Python/Flask, Twilio, multi-provider pipeline).

**Scaffold before setup:**
```markdown
## Current Project State
<!-- What is working. What is not yet built. Known issues.
     Update this section whenever significant work is completed. -->
```

**Scaffold after setup:**
```markdown
## Current Project State

**Working:**
- Voice call pipeline (Twilio → STT → LLM → TTS → response)
- Multi-provider STT (ElevenLabs, Deepgram) with configurable selection
- RAG system with Supabase pgvector for agricultural knowledge retrieval
- Streaming pipeline with barge-in support

**Not yet built:**
- Admin dashboard for call monitoring
- Automated test suite
- Multi-turn conversation memory across calls

**Known issues:**
- Sarvam AI STT bypass active — routing to ElevenLabs as fallback
```

**Patterns directory after setup:**
```
patterns/
├── add-api-client.md       # Steps, gotchas, verify checklist for new service clients
├── add-language-support.md  # How to extend the 8-language voice pipeline
├── debug-pipeline.md        # Where to look when a call fails at each stage
└── add-rag-documents.md     # How to ingest new agricultural knowledge
```

## Real World Results

Independently tested by a community member on **OpenClaw** across 10 structured scenarios on a homelab setup (Ubuntu 24.04, Kubernetes, Docker, Ansible, Terraform, networking, monitoring). 10/10 tests passed. Drift score: 100/100.

**Token usage before vs after mex:**

| Scenario | Without mex | With mex | Saved |
|----------|------------|---------|-------|
| "How does K8s work?" | ~3,300 tokens | ~1,450 tokens | 56% |
| "Open UFW port" | ~3,300 tokens | ~1,050 tokens | 68% |
| "Explain Docker" | ~3,300 tokens | ~1,100 tokens | 67% |
| Multi-context query | ~3,300 tokens | ~1,650 tokens | 50% |

**~60% average token reduction per session.**

Context is no longer all-or-nothing — loaded on demand, only what's relevant.

## How It Works

```
Session starts
    ↓
Agent loads CLAUDE.md (auto-loaded, lives at project root)
    ↓
CLAUDE.md says "Read .mex/ROUTER.md before doing anything"
    ↓
ROUTER.md routing table → loads relevant context file for this task
    ↓
context file → points to pattern file if task-specific guidance exists
    ↓
Agent executes with full project context, minimal token cost
    ↓
After task: agent updates scaffold (GROW step)
    ↓
New patterns, updated project state — scaffold grows from real work
```

CLAUDE.md stays at ~120 tokens. The agent navigates to only what it needs. After every task, the agent updates the scaffold — creating patterns from new task types, updating project state, fixing stale context. The scaffold compounds over time.

## File Structure

```
your-project/
├── CLAUDE.md              ← auto-loaded by tool, points to .mex/
├── .mex/
│   ├── ROUTER.md          ← routing table, session bootstrap
│   ├── AGENTS.md          ← always-loaded anchor (~150 tokens)
│   ├── context/
│   │   ├── architecture.md   # how components connect
│   │   ├── stack.md           # technology choices and reasoning
│   │   ├── conventions.md     # naming, structure, patterns
│   │   ├── decisions.md       # append-only decision log
│   │   └── setup.md           # how to run locally
│   └── patterns/
│       ├── INDEX.md           # pattern registry
│       └── *.md               # task-specific guides with gotchas + verify checklists
└── src/
```

## Multi-Tool Compatibility

exec
/bin/zsh -lc "sed -n '720,920p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 10,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: options.enableDedup !== false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: true,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'deep',
    mode: 'deep',
    ...result
  };
}

async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 8,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: options.enableDedup !== false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: true,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'focused',
    mode: 'focused',
    intent: intent,
    ...result
  };
}

async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];

  const result = await handleMemorySearch({
    query: input || 'resume work continue session',
    specFolder: options.specFolder,
    folderBoost: options.folderBoost,
    tenantId: options.tenantId,
    userId: options.userId,
    agentId: options.agentId,
    sharedSpaceId: options.sharedSpaceId,
    limit: options.limit || 5,
    includeConstitutional: false,
    includeContent: true,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: resumeAnchors,
    sessionId: options.sessionId,
    sessionTransition: options.sessionTransition,
    enableDedup: false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: false,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'resume',
    mode: 'resume',
    resumeAnchors: resumeAnchors,
    ...result
  };
}

/* ───────────────────────────────────────────────────────────────
   6. HANDLER HELPERS
──────────────────────────────────────────────────────────────── */

function resolveSessionLifecycle(
  args: ContextArgs,
  db: ReturnType<typeof vectorIndex.getDb> | null,
): SessionLifecycleResolution {
  void db;

  // Security: session scope derived from server context, not caller input
  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
    tenantId: args.tenantId,
    userId: args.userId,
    agentId: args.agentId,
  });
  if (trustedSession.error) {
    return {
      requestedSessionId: trustedSession.requestedSessionId,
      effectiveSessionId: '',
      resumed: false,
      priorMode: null,
      counter: 0,
      error: trustedSession.error,
    };
  }

  const requestedSessionId = trustedSession.requestedSessionId;
  const effectiveSessionId = trustedSession.effectiveSessionId;
  const resumed = trustedSession.trusted;
  const priorMode = resumed
    ? workingMemory.getSessionInferredMode(effectiveSessionId)
    : null;
  const counter = resumed
    ? workingMemory.getSessionEventCounter(effectiveSessionId)
    : 0;

  return {
    requestedSessionId,
    effectiveSessionId,
    resumed,
    priorMode,
    counter,
  };
}

function resolveEffectiveMode(
  args: ContextArgs,
  session: SessionLifecycleResolution,
  pressurePolicy: {
    level: string;
    ratio: number | null;
    source: string;
    warning: string | null;
  },
): EffectiveModeResolution {
  const requestedMode = args.mode ?? 'auto';
  const explicitIntent = args.intent;
  const normalizedInput = args.input.trim();

  let effectiveMode = requestedMode;
  let detectedIntent = explicitIntent;
  let intentConfidence = explicitIntent ? 1.0 : 0;
  let pressureOverrideTargetMode: PressureOverrideTargetMode = null;
  let pressureOverrideApplied = false;
  let pressureWarning: string | null = null;
  let resumeHeuristicApplied = false;

  if (!detectedIntent && requestedMode !== 'quick') {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
  }

  if (requestedMode === 'auto') {
    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';

    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
      effectiveMode = 'focused';
    }

    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
    const hasResumeContext =
      session.resumed ||
      session.priorMode === 'resume' ||
      (
        Boolean(args.specFolder) &&
        normalizedInput.length <= 120 &&
        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
      );

    if (hasResumeKeywords || hasResumeContext) {
      effectiveMode = 'resume';
      resumeHeuristicApplied = true;
    }

    const prePressureMode = effectiveMode;
    if (pressurePolicy.level === 'quick') {
      pressureOverrideTargetMode = 'quick';
    } else if (pressurePolicy.level === 'focused') {
      pressureOverrideTargetMode = 'focused';
    }

    if (pressureOverrideTargetMode) {

exec
/bin/zsh -lc "sed -n '780,980p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

function applyUsageRankingBoost(
  db: Database.Database,
  results: PipelineRow[],
): PipelineRow[] {
  if (!isUsageRankingEnabled() || !Array.isArray(results) || results.length === 0) {
    return results;
  }

  try {
    ensureUsageColumn(db);
    const resultIds = results
      .map((row) => row.id)
      .filter((id): id is number => typeof id === 'number' && Number.isFinite(id));

    if (resultIds.length === 0) {
      return results;
    }

    const placeholders = resultIds.map(() => '?').join(',');
    const usageRows = db.prepare(`
      SELECT id, COALESCE(access_count, 0) AS access_count
      FROM memory_index
      WHERE id IN (${placeholders})
    `).all(...resultIds) as Array<{ id: number; access_count: number }>;

    if (usageRows.length === 0) {
      return results;
    }

    const maxAccess = usageRows.reduce((currentMax, row) =>
      Math.max(currentMax, Number.isFinite(row.access_count) ? row.access_count : 0), 0);

    if (maxAccess <= 0) {
      return results;
    }

    const usageMap = new Map(usageRows.map((row) => [row.id, row.access_count]));
    const boosted = results.map((row) => {
      const accessCount = usageMap.get(row.id) ?? 0;
      const usageBoost = computeUsageBoost(accessCount, maxAccess);

      if (usageBoost <= 0) {
        return row;
      }

      return {
        ...withSyncedScoreAliases(row, resolveBaseScore(row) + usageBoost),
        usageBoost,
      };
    });

    return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
    return results;
  }
}

/**
 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
 *
 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
 * unintended write side-effects during read-only searches).
 *
 * For each result, the current retrievability R(t) is computed from the stored
 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
 * GRADE_GOOD update — increasing stability proportional to how much the memory
 * needed the review.
 *
 * Errors per-row are caught and logged; they do not abort the full set.
 *
 * @param db      - Active SQLite database connection
 * @param results - Pipeline rows that were accessed
 */
function applyTestingEffect(
  db: Database.Database,
  results: PipelineRow[]
): void {
  if (!db || !Array.isArray(results) || results.length === 0) return;

  for (const row of results) {
    try {
      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
      if (!lastReview) continue;

      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
        ? row.stability
        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;

      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
      const currentR = fsrsScheduler.calculateRetrievability(
        stability,
        Math.max(0, elapsedDays)
      );

      strengthenOnAccess(db, row.id, currentR);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
    }
  }
}

function recordAdaptiveAccessSignals(
  db: Database.Database,
  results: PipelineRow[],
  query: string | undefined
): void {
  if (!db || !Array.isArray(results) || results.length === 0) return;

  if (getAdaptiveMode() === 'disabled') return;

  ensureAdaptiveTables(db);
  const insertAdaptiveSignal = db.prepare(`
    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
    for (const result of accessedResults) {
      insertAdaptiveSignal.run(
        result.id,
        'access',
        1.0,
        query || '',
        '',
        '{}',
      );
    }
  });

  try {
    writeAdaptiveSignals(results);
  } catch (err: unknown) {
    // Adaptive signal capture must never block the core search pipeline.
    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
  }
}

// -- Main Stage 2 entry point --

/**
 * Execute Stage 2: Fusion + Signal Integration.
 *
 * This is the SINGLE authoritative point where all scoring signals are
 * applied. The ordering is fixed and must not be changed without updating
 * the architectural documentation (see types.ts Stage2 comment block).
 *
 * Signal application order (13 steps):
 *   1.  Session boost      (hybrid only — working memory attention)
 *   1a. Recency fusion     (all types — time-decay bonus)
 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
 *   2a. Co-activation      (spreading activation from top-N seeds)
 *   2b. Community boost    (N2c — inject co-members)
 *   2c. Graph signals      (N2a+N2b — momentum + depth)
 *   3.  Testing effect     (all types, when trackAccess = true)
 *   4.  Intent weights     (non-hybrid only — G2 prevention)
 *   5.  Artifact routing   (all types, when routing confidence > 0)
 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
 *   8.  Anchor metadata    (annotation — no score mutation)
 *   9.  Validation metadata (spec quality signals + quality scoring)
 *
 * @param input - Stage 2 input containing candidates and pipeline config
 * @returns Stage 2 output with scored results and per-signal metadata
 */
export async function executeStage2(input: Stage2Input): Promise<Stage2Output> {
  const { candidates, config } = input;
  const start = Date.now();

  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
    sessionBoostApplied: 'off',
    causalBoostApplied: 'off',
    intentWeightsApplied: 'off',
    artifactRoutingApplied: 'off',
    feedbackSignalsApplied: 'off',
    graphContribution: {
      killSwitchActive: !isGraphUnifiedEnabled(),
      causalBoosted: 0,
      coActivationBoosted: 0,
      communityInjected: 0,
      graphSignalsBoosted: 0,
      totalGraphInjected: 0,
      rolloutState: resolveGraphWalkRolloutState(),
    },
    qualityFiltered: 0,
    durationMs: 0,
  };

  // FIX #3: Deep clone candidates so in-place mutations (e.g., syncScoreAliasesInPlace)
  // cannot corrupt the original Stage 1 output. A shallow copy ([...candidates]) shares
  // the same row objects, creating a race condition if the orchestrator's timeout fallback
  // uses the original Stage 1 candidates array.
  let results: PipelineRow[] = candidates.map(row => ({ ...row }));
  const isHybrid = config.searchType === 'hybrid';

  // -- 1. Session boost --
  // Only for hybrid search type — session attention signals are most meaningful
  // When the full hybrid result set is available for ordering.
  if (isHybrid && config.enableSessionBoost && config.sessionId) {

exec
/bin/zsh -lc "sed -n '250,380p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  memory: 1.0,
  constitutional: 2.0,
  scratch: 0.6,
};

// Pattern alignment bonus configuration
export const PATTERN_ALIGNMENT_BONUSES: PatternAlignmentBonuses = {
  exact_match: 0.3,
  partial_match: 0.15,
  semantic_threshold: 0.8,
  anchor_match: 0.25,
  type_match: 0.2,
};

// TM-01: Re-export interference penalty coefficient for test access
export { INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';

// ───────────────────────────────────────────────────────────────
// 3. SCORE CALCULATIONS

// ───────────────────────────────────────────────────────────────
/**
 * Parse last_accessed value that may be:
 * - An ISO date string (new format from access-tracker)
 * - A millisecond epoch number (legacy format)
 * - null/undefined
 * Returns epoch milliseconds or null.
 */
function parseLastAccessed(value: number | string | undefined | null): number | null {
  if (value == null) return null;

  // If it's already a number, treat as epoch ms directly
  if (typeof value === 'number') return value;

  // Try ISO string parse first
  const parsed = Date.parse(value);
  if (!isNaN(parsed)) return parsed;

  // Maybe it's a stringified epoch number (legacy data)
  const asNum = Number(value);
  if (!isNaN(asNum) && asNum > 1e12) return asNum; // Reasonable ms epoch (after ~2001)

  return null;
}

/**
 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
 */
export function calculateRetrievabilityScore(row: ScoringInput): number {
  const scheduler = getFsrsScheduler();
  let stability = (row.stability as number | undefined) || 1.0;
  if (!isFinite(stability)) stability = 1.0;
  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
  const contextType = typeof row.context_type === 'string'
    ? row.context_type.toLowerCase()
    : typeof row.contextType === 'string'
      ? row.contextType.toLowerCase()
      : 'general';
  const tier = typeof row.importance_tier === 'string'
    ? row.importance_tier.toLowerCase()
    : 'normal';
  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
  // Aligned with fsrs-scheduler.ts:337 which uses the same !== 'false' convention.
  const classificationDecayEnabled = process.env.SPECKIT_CLASSIFICATION_DECAY !== 'false';

  // Return neutral 0.5 when no timestamp — prevents NaN propagation
  if (!lastReview) {
    return 0.5;
  }

  const timestamp = new Date(lastReview).getTime();
  if (isNaN(timestamp)) return 0.5; // Neutral score for invalid dates

  const elapsedMs = Date.now() - timestamp;
  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

  // TM-03: Classification decay applies at stability-level; when enabled do not
  // Additionally apply elapsed-time tier multipliers to avoid double decay.
  let adjustedStability = stability;
  if (classificationDecayEnabled) {
    if (scheduler?.applyClassificationDecay) {
      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
    } else {
      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
    }
    if (!isFinite(adjustedStability)) {
      return 1;
    }
  }

  let adjustedElapsedDays = elapsedDays;
  if (!classificationDecayEnabled) {
    const tierMultiplier = scheduler?.TIER_MULTIPLIER?.[tier]
      ?? RETRIEVABILITY_TIER_MULTIPLIER[tier]
      ?? RETRIEVABILITY_TIER_MULTIPLIER.normal;
    adjustedElapsedDays = elapsedDays * tierMultiplier;
  }

  adjustedStability = Math.max(0.001, adjustedStability);

  if (scheduler && typeof scheduler.calculateRetrievability === 'function') {
    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
    return Number.isFinite(score) ? score : 0;
  }

  // Inline FSRS power-law formula used when fsrs-scheduler module unavailable
  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);
  const score = Math.max(0, Math.min(1, retrievability));
  return Number.isFinite(score) ? score : 0;
}

export const calculateTemporalScore = calculateRetrievabilityScore;

/**
 * T032: Calculate usage score (REQ-017 Factor 2)
 * Formula: min(1.5, 1.0 + accessCount * 0.05)
 * Normalized to 0-1 range for composite scoring
 */
export function calculateUsageScore(accessCount: number): number {
  accessCount = Math.max(0, accessCount);
  const count = accessCount || 0;
  const usageBoost = Math.min(1.5, 1.0 + count * 0.05);
  return (usageBoost - 1.0) / 0.5;
}

/**
 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
 */
export function calculateImportanceScore(tier: string, baseWeight: number | undefined): number {
  const tierLower = (tier || 'normal').toLowerCase();

exec
/bin/zsh -lc "rg -n \"semantic|lexical|hybrid|fusion|FTS|BM25|vector|embedding|trigger|CocoIndex|code_graph|session boost|causal boost\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:202:// To prevent semantically meaningless `confirm: false` from passing validation.
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:212:  triggerPhrases: optionalStringArray,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:347:  channels: z.array(z.enum(['vector', 'bm25', 'fts5', 'graph', 'trigger'])).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:471:  memory_update: ['id', 'title', 'triggerPhrases', 'importanceWeight', 'importanceTier', 'allowPartialUpdate'],
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:24:  runBM25Baseline,
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:26:  type BM25SearchFn,
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:27:  type BM25SearchResult,
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:28:  type BM25BaselineResult,
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:43:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:48:  vectorIndex,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts:9:const targetScript = path.resolve(import.meta.dirname, '../../../scripts/dist/memory/reindex-embeddings.js');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:72:} from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:75:import * as vectorIndex from './lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:76:import * as _embeddings from './lib/providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:80:import * as hybridSearch from './lib/search/hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:109:// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:125:import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:163:  triggered: unknown[];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:201:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:747:  const channels: string[] = ['vector', 'fts5'];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:823:    const triggerMatcher = await import('./lib/parsing/trigger-matcher.js');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:824:    if (typeof triggerMatcher.clearCache === 'function') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:825:      triggerMatcher.clearCache();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:829:    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:945:      vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1193:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1238:    console.error('[context-server] Waiting for embedding model to be ready...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1242:      console.error('[context-server] Startup scan skipped: embedding model not ready');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1380:    runCleanupStep('vectorIndex', () => vectorIndex.closeDb());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1410:  const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1437:      if (vectorIndex.deleteMemory(row.id)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1495:    console.error('[context-server] Validating embedding API key...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1554:  vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1563:    vectorIndex,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1566:    hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1581:  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1582:  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1584:  // Mark embedding as "ready" since it will self-initialize on first use
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1589:    const report = vectorIndex.verifyIntegrity();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1593:    // Validate embedding dimension matches database
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1594:    const dimValidation = vectorIndex.validateEmbeddingDimension();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1599:      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1605:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1622:        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1656:      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1669:    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1696:    // P3-04: Rebuild BM25 index from database on startup
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1701:        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1704:        console.warn('[context-server] BM25 index rebuild failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1743:    // T099: Background retry job for pending embeddings (REQ-031, CHK-179)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1744:    // Processes memories with failed embeddings in the background
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:10:import * as vectorIndex from '../lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:12:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:484:      vectorIndex.clearConstitutionalCache(null);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:485:      vectorIndex.clearSearchCache(null);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:487:      const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:492:      triggerMatcher.refreshTriggerCache();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:675:  vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:26:  triggerPhrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:59:/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:93:  triggerCacheCleared: boolean;
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:15:All variables are optional. The server runs with sensible defaults when none are set. Variables use **graduated semantics** unless noted: they default to ON and you disable them by setting `=false`.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:66:4. [Search Pipeline: Fusion and Scoring](#4-search-pipeline-fusion-and-scoring)
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:77:15. [Embedding](#15-embedding)
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:107:| `SPECKIT_RRF` | `true` | boolean | Master switch for Reciprocal Rank Fusion. Graduated ON. | `shared/algorithms/rrf-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:108:| `SPECKIT_RRF_K` | `40` | number | RRF smoothing constant `k`. Lower = more top-heavy ranking, higher = flatter. Must be > 0. | `shared/algorithms/rrf-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:115:| `SPECKIT_EMBEDDING_EXPANSION` | `true` | boolean | Query expansion for embedding-based retrieval (R12). Suppressed when classification = "simple". Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:117:| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | Channel minimum-representation promotion after fusion. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:120:| `SPECKIT_ADAPTIVE_FUSION` | `true` | boolean | Intent-aware adaptive fusion with document-type weight shifting. Graduated ON. | `shared/algorithms/adaptive-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:125:<!-- ANCHOR:search-pipeline-fusion -->
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:138:| `SPECKIT_TEMPORAL_CONTIGUITY` | `true` | boolean | Temporal contiguity boost on raw Stage 1 vector results. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:139:| `SPECKIT_RECENCY_FUSION_WEIGHT` | `0.07` | number | Weight of recency signal in Stage 2 fusion scoring. | `lib/search/pipeline/stage2-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:140:| `SPECKIT_RECENCY_FUSION_CAP` | `0.10` | number | Maximum recency contribution cap in Stage 2 fusion. | `lib/search/pipeline/stage2-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:141:| `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` | `1.2` | number | Proportional weight shift factor per document type in adaptive fusion (20% shift at 1.2). | `shared/algorithms/adaptive-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:144:| `SPECKIT_FOLDER_TOP_K` | `5` | number | Number of top folder-scored results to inject. | `lib/search/hybrid-search.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:146:<!-- /ANCHOR:search-pipeline-fusion -->
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:157:| `SPECKIT_QUERY_CONCEPT_EXPANSION` | `true` | boolean | Query concept expansion via alias matching for hybrid search (Phase B T016). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:205:| `SPECKIT_N2A_CAP` | (profile) | number | N2a cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:206:| `SPECKIT_N2B_CAP` | (profile) | number | N2b cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:245:| `SPECKIT_SHADOW_LEARNING` | `false` | boolean | Shadow learned model loading for Stage 2 weight combiner. Opt-in: set `true` to enable. | `lib/search/pipeline/stage2-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:247:| `SPECKIT_LEARNED_STAGE2_MODEL` | (auto) | string | Custom file path for the learned Stage 2 model. Absolute or relative to cwd. | `lib/search/pipeline/stage2-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:252:| `SPECKIT_SIGNAL_VOCAB` | `true` | boolean | Signal vocabulary detection for trigger matching. Graduated ON. | `lib/parsing/trigger-matcher.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:344:<!-- ANCHOR:embedding -->
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:349:| `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` | `true` | boolean | Circuit breaker for embedding model failures. Graduated ON. | `shared/embeddings.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:350:| `SPECKIT_EMBEDDING_CB_THRESHOLD` | `3` | number | Consecutive failure count before circuit breaker opens. | `shared/embeddings.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:351:| `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` | `60000` | number | Cooldown period in ms before circuit breaker resets (min 1000). | `shared/embeddings.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:352:<!-- /ANCHOR:embedding -->
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:434:# Lower recency fusion impact
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:216:// T306: Added asyncEmbedding parameter for non-blocking embedding generation
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:263:        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:293:  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:310:      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:518:        description: 'Evaluation mode. Defaults to ablation; use k_sensitivity for raw pre-fusion RRF K analysis.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:522:        items: { type: 'string', enum: ['vector', 'bm25', 'fts5', 'graph', 'trigger'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:624:  name: 'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:657:  name: 'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:663:  name: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:681:            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:682:            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:683:            score: { type: 'number', description: 'CocoIndex relevance score' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:688:        description: 'Seeds from CocoIndex, manual input, or graph lookups',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:700:  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:706:  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:718:  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:747:      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:927:  // L8: CocoIndex
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:11:import * as vectorIndex from '../lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:18: * const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:27:function requireDb(): NonNullable<ReturnType<typeof vectorIndex.getDb>> {
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:28:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:3:description: "Operational scripts for forced embedding reindex and maintenance workflows."
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:6:  - "reindex embeddings"
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:14:> Operational entry points for maintenance tasks that run outside the normal MCP request lifecycle, such as forced full-reindex of embeddings.
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:50:+-- reindex-embeddings.ts    # Wrapper source -> ../../scripts/dist/memory/reindex-embeddings.js at runtime
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:56:- Canonical implementation source: `../../scripts/memory/reindex-embeddings.ts`
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:57:- Canonical built runtime target: `../../scripts/dist/memory/reindex-embeddings.js`
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:58:- Legacy wrapper source: `reindex-embeddings.ts`
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:59:- Legacy wrapper build output: `../dist/scripts/reindex-embeddings.js`
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:65:| `reindex-embeddings.ts`   | Backward-compatible entry point for legacy `mcp_server/scripts` path         | Delegates to `scripts/dist/memory/reindex-embeddings.js` | Spec 138 |
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:74:- Reindex implementation lives in `scripts/memory/reindex-embeddings.ts` and runs through current handlers.
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:77:- Module initialization order: `vectorIndex` -> `embeddings` -> `checkpointsLib` -> `accessTracker` -> `hybridSearch` -> `initDbState` -> `setEmbeddingModelReady`.
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:92:node scripts/dist/memory/reindex-embeddings.js
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:95:node mcp_server/dist/scripts/reindex-embeddings.js
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:100:The script exits 0 on success. Any fatal startup error (missing DB, failed embedding warm-up) exits non-zero with an error message on stderr.
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:109:- `../../scripts/memory/reindex-embeddings.ts`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:8:import * as vectorIndex from '../lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:96:  const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:212:      if (vectorIndex.deleteMemory(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:268:        latencyMs: 0, triggerCacheCleared: false,
.opencode/skill/system-spec-kit/mcp_server/cli.ts:19:type VectorIndexModule = Awaited<typeof import('./lib/search/vector-index.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:23:type TriggerMatcherModule = Awaited<typeof import('./lib/parsing/trigger-matcher.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:30:let _vector_index: VectorIndexModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:34:let _trigger_matcher: TriggerMatcherModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:42:  return _vector_index ??= await import('./lib/search/vector-index.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:58:  return _trigger_matcher ??= await import('./lib/parsing/trigger-matcher.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:138:   2. DATABASE INITIALIZATION (minimal — no MCP, no embeddings)
.opencode/skill/system-spec-kit/mcp_server/cli.ts:142:  const [vectorIndex, checkpointsLib, accessTracker, coreIndex] = await Promise.all([
.opencode/skill/system-spec-kit/mcp_server/cli.ts:149:  vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:150:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:157:  coreIndex.init({ vectorIndex, checkpoints: checkpointsLib, accessTracker });
.opencode/skill/system-spec-kit/mcp_server/cli.ts:168:  const vectorIndex = await getVectorIndex();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:170:  const db = vectorIndex.getDb()!;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:224:      "SELECT COUNT(*) as count FROM memory_index WHERE embedding_status = 'partial'"
.opencode/skill/system-spec-kit/mcp_server/cli.ts:281:  const [vectorIndex, checkpointsLib, mutationLedger, triggerMatcher, causalEdges, history] = await Promise.all([
.opencode/skill/system-spec-kit/mcp_server/cli.ts:289:  const db = vectorIndex.getDb()!;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:387:      if (vectorIndex.deleteMemory(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/cli.ts:426:  // Invalidate trigger cache
.opencode/skill/system-spec-kit/mcp_server/cli.ts:427:  triggerMatcher.clearCache();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:458:    console.log(`  Loading embedding model...`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:459:    const embeddings = await import('./lib/providers/embeddings.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:461:      await embeddings.generateEmbedding('warmup');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:525:  const vectorIndex = await getVectorIndex();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:526:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/cli.ts:594:    .then(vectorIndex => { vectorIndex.closeDb(); })
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:29:- `search-results.ts`: formats results, optional content embedding, anchor extraction, and path checks.
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:49:- File path checks are defense-in-depth for content embedding.
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:8:import * as vectorIndex from '../lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:11:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:14:} from '../lib/search/hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:15:import { generateQueryEmbedding } from '../lib/providers/embeddings.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:44:import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:83:function initializeEvalHybridSearch(database: ReturnType<typeof vectorIndex.getDb>) {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:85:  initHybridSearch(database, vectorIndex.vectorSearch, graphSearchFn);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:99:  run: (database: NonNullable<ReturnType<typeof vectorIndex.getDb>>, dbPath: string) => Promise<T>,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:102:  const activeDb = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:112:    return run(activeDb, vectorIndex.getDbPath());
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:115:  const currentDbPath = path.resolve(vectorIndex.getDbPath());
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:128:  vectorIndex.closeDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:132:    const overrideDb = vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:133:    return await run(overrideDb, vectorIndex.getDbPath());
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:135:    vectorIndex.closeDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:141:    vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:146:  database: NonNullable<ReturnType<typeof vectorIndex.getDb>>,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:149:  embedding: Float32Array | number[] | null,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:154:  if (embedding) {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:155:    const vectorResults = vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:161:    if (vectorResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:163:        source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:164:        results: vectorResults.map((row) => ({ id: row.id as number | string })),
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:268:      const embedding = await generateQueryEmbedding(query);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:276:        triggerPhrases: channelFlags.useTrigger ? undefined : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:281:      const results = await hybridSearchEnhanced(query, embedding, searchOptions);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:332:  'hybrid search fusion',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:335:  'semantic search',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:341: * 1. Runs hybridSearchEnhanced for each representative query
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:348:  const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:369:    const embedding = await generateQueryEmbedding(query);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:370:    queryLists.push(buildRawFusionLists(db, graphSearchFn, query, embedding, limit));
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:29:- `memory-search.ts` - L2 hybrid search handler with telemetry and profile support.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:30:- `memory-triggers.ts` - Trigger phrase matching, tiered content injection, and session-aware matching.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:44:- `code-graph/scan.ts` - `code_graph_scan`: index workspace files, build structural graph.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:45:- `code-graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:46:- `code-graph/status.ts` - `code_graph_status`: report graph health and statistics.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:47:- `code-graph/context.ts` - `code_graph_context`: LLM-oriented compact graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:70:- `memory-index.ts` and `mutation-hooks.ts` work together so index, update, and stale-delete flows clear trigger, constitutional, graph, co-activation, and degree caches.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:71:- `memory-crud-health.ts` surfaces embedding retry stats and FTS/index sync diagnostics as part of the health response.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:80:- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:35:- Test semantic search with a sample query
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:60:Spec Kit Memory is an MCP (Model Context Protocol) server that gives AI assistants semantic memory and context retrieval. It indexes markdown documentation and conversation memories to surface relevant information during AI interactions.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:78:│  Causal lineage      Adaptive fusion    Extended telemetry      │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:80:│  SQLite + sqlite-vec for vector storage                         │

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Trigger Matcher
// ───────────────────────────────────────────────────────────────
// Feature catalog: Trigger phrase matching (memory_match_triggers)
import type Database from 'better-sqlite3';
import * as vectorIndex from '../search/vector-index.js';
import { escapeRegex } from '../utils/path-security.js';

/* --- 1. TYPES --- */

/** Signal category detected in user prompt */
export type SignalCategory = 'correction' | 'preference' | 'reinforcement' | 'neutral';

/** Result of signal detection for a prompt */
export interface SignalDetection {
  category: SignalCategory;
  keywords: string[];
  boost: number;
}

/** Trigger cache entry for a single phrase-to-memory mapping */
export interface TriggerCacheEntry {
  triggerId: number;
  phrase: string;
  regex: RegExp;
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
}

/** Match result grouped by memory */
export interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
  matchedPhrases: string[];
  [key: string]: unknown;
}

/** Match result with additional statistics */
export interface TriggerMatchWithStats {
  matches: TriggerMatch[];
  stats: TriggerMatchStats;
}

/** Statistics about a trigger matching operation */
export interface TriggerMatchStats {
  promptLength: number;
  cacheSize: number;
  matchCount: number;
  totalMatchedPhrases: number;
  matchTimeMs: number;
  signals?: SignalDetection[];
  degraded?: TriggerMatcherDegradedState;
}

/** Cache statistics */
export interface CacheStats {
  size: number;
  timestamp: number;
  ageMs: number | null;
  regexCacheSize: number;
  maxRegexCacheSize: number;
}

export interface TriggerMatcherFailure {
  code: string;
  message: string;
  memoryId?: number;
  filePath?: string;
}

export interface TriggerMatcherDegradedState {
  code: string;
  message: string;
  failedEntries: number;
  failures: TriggerMatcherFailure[];
}

/** Memory result from getMemoriesByPhrase */
export interface MemoryByPhrase {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  importanceWeight: number;
}

/** Execution time log entry */
export interface ExecutionLogEntry {
  timestamp: string;
  operation: string;
  durationMs: number;
  target: string;
  [key: string]: unknown;
}

/** Trigger matcher configuration */
export interface TriggerMatcherConfig {
  CACHE_TTL_MS: number;
  DEFAULT_LIMIT: number;
  MIN_PHRASE_LENGTH: number;
  MAX_PROMPT_LENGTH: number;
  WARN_THRESHOLD_MS: number;
  LOG_EXECUTION_TIME: boolean;
  MAX_REGEX_CACHE_SIZE: number;
}

/* --- 2. CONFIGURATION --- */

/**
 * Defines the CONFIG constant.
 */
export const CONFIG: TriggerMatcherConfig = {
  CACHE_TTL_MS: 60000,
  DEFAULT_LIMIT: 3,
  MIN_PHRASE_LENGTH: 3,
  MAX_PROMPT_LENGTH: 5000,
  WARN_THRESHOLD_MS: 30,
  LOG_EXECUTION_TIME: true,
  MAX_REGEX_CACHE_SIZE: 100,
};

/* --- 3. EXECUTION TIME LOGGING --- */

/** Log hook execution time for monitoring and debugging */
export function logExecutionTime(operation: string, durationMs: number, details: Record<string, unknown> = {}): ExecutionLogEntry | undefined {
  if (!CONFIG.LOG_EXECUTION_TIME) {
    return;
  }

  const logEntry: ExecutionLogEntry = {
    timestamp: new Date().toISOString(),
    operation,
    durationMs: durationMs,
    target: durationMs < 50 ? 'PASS' : 'SLOW',
    ...details,
  };

  // Log to console for debugging
  if (durationMs >= CONFIG.WARN_THRESHOLD_MS) {
    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
    console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
  }

  // Return the entry for test verification
  return logEntry;
}

/* --- 4. TRIGGER CACHE --- */

// In-memory cache of trigger phrases for fast matching
let triggerCache: TriggerCacheEntry[] | null = null;
let triggerCandidateIndex: Map<string, Set<number>> | null = null;
let cacheTimestamp: number = 0;
let lastDegradedState: TriggerMatcherDegradedState | null = null;
const triggerCacheLoaderStatementByConnection = new WeakMap<Database.Database, Database.Statement>();

// LRU cache for regex objects to prevent memory leaks
const regexLruCache: Map<string, RegExp> = new Map();
const UNICODE_WORD_CHAR_CLASS = '\\p{L}\\p{N}\\p{M}';
const UNICODE_TOKEN_PATTERN = /[\p{L}\p{N}\p{M}]+/gu;
const CJK_SCRIPT_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const MIN_INDEX_NGRAM_SIZE = 2;
const MAX_INDEX_NGRAM_SIZE = 3;
const COMMON_TRIGGER_STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by',
]);
const TRIGGER_CACHE_LOADER_SQL = `
  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
  FROM memory_index
  WHERE embedding_status = 'success'
    AND trigger_phrases IS NOT NULL
    AND trigger_phrases != '[]'
    AND trigger_phrases != ''
  ORDER BY id ASC
`;

function getTriggerCacheLoaderStatement(database: Database.Database): Database.Statement {
  const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
  if (cachedStatement) {
    return cachedStatement;
  }

  const statement = database.prepare(TRIGGER_CACHE_LOADER_SQL) as Database.Statement;
  triggerCacheLoaderStatementByConnection.set(database, statement);
  return statement;
}

export function normalizeTriggerText(text: string): string {
  return normalizeUnicode(text, false)
    .trim()
    .replace(/\s+/g, ' ');
}

function buildBoundaryRegex(phrase: string): RegExp {
  const normalizedPhrase = normalizeTriggerText(phrase);
  const escaped = escapeRegex(normalizedPhrase);

  // CJK text often appears in continuous sentence flow without whitespace-delimited
  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
  // phrases are not rejected by boundary checks on neighboring CJK characters.
  if (CJK_SCRIPT_PATTERN.test(normalizedPhrase) && !/\s/u.test(normalizedPhrase)) {
    return new RegExp(escaped, 'iu');
  }

  return new RegExp(
    `(?:^|[^${UNICODE_WORD_CHAR_CLASS}])${escaped}(?:[^${UNICODE_WORD_CHAR_CLASS}]|$)`,
    'iu'
  );
}

function getUnicodeTokens(text: string): string[] {
  const normalized = normalizeTriggerText(text);
  if (!normalized) {
    return [];
  }

  return Array.from(normalized.matchAll(UNICODE_TOKEN_PATTERN), (match) => match[0]);
}

function isSignificantIndexToken(token: string): boolean {
  if (!token) {
    return false;
  }

  return token.length >= CONFIG.MIN_PHRASE_LENGTH && !COMMON_TRIGGER_STOPWORDS.has(token);
}

function extractTriggerIndexKeys(text: string): string[] {
  const normalized = normalizeTriggerText(text);
  if (!normalized) {
    return [];
  }

  const rawTokens = getUnicodeTokens(normalized);
  const tokens = rawTokens.filter(isSignificantIndexToken);
  const basis = tokens.length > 0 ? tokens : rawTokens;
  const keys = new Set<string>();

  for (const token of basis) {
    if (token) {
      keys.add(token);
    }
  }

  for (let size = MIN_INDEX_NGRAM_SIZE; size <= MAX_INDEX_NGRAM_SIZE; size += 1) {
    if (basis.length < size) {
      continue;
    }

    for (let index = 0; index <= basis.length - size; index += 1) {
      keys.add(basis.slice(index, index + size).join(' '));

exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Hybrid Search
// ───────────────────────────────────────────────────────────────
// Combines vector, FTS, and BM25 search with fallback

// 1. IMPORTS

// Local
import { getIndex, isBm25Enabled } from './bm25-index.js';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier.js';
import { fts5Bm25Search } from './sqlite-fts.js';
import { DEGREE_CHANNEL_WEIGHT } from './graph-search-fn.js';
import {
  isMMREnabled,
  isCrossEncoderEnabled,
  isLocalRerankerEnabled,
  isSearchFallbackEnabled,
  isDocscoreAggregationEnabled,
  isDegreeBoostEnabled,
  isContextHeadersEnabled,
} from './search-flags.js';
import { rerankLocal } from './local-reranker.js';
import { computeDegreeScores } from './graph-search-fn.js';
import type { GraphSearchFn } from './search-types.js';

// Feature catalog: Hybrid search pipeline

export type { GraphSearchFn } from './search-types.js';

import { routeQuery } from './query-router.js';
import { isComplexityRouterEnabled } from './query-classifier.js';
import { enforceChannelRepresentation } from './channel-enforcement.js';
import {
  truncateByConfidence,
  isConfidenceTruncationEnabled,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
} from './confidence-truncation.js';
import {
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from './dynamic-token-budget.js';
import { ensureDescriptionCache, getSpecsBasePaths } from './folder-discovery.js';
import {
  isFolderScoringEnabled,
  lookupFolders,
  computeFolderRelevanceScores,
  enrichResultsWithFolderScores,
  twoPhaseRetrieval,
} from './folder-relevance.js';

import { collapseAndReassembleChunkResults } from '../scoring/mpab-aggregation.js';

// Type-only
import type Database from 'better-sqlite3';
import type { SpreadResult } from '../cognitive/co-activation.js';
import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { ChannelName } from './query-router.js';
import type { EnforcementResult } from './channel-enforcement.js';
import type { TruncationResult } from './confidence-truncation.js';

// 2. INTERFACES

type VectorSearchFn = (
  embedding: Float32Array | number[],
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

interface HybridSearchOptions {
  limit?: number;
  specFolder?: string;
  minSimilarity?: number;
  useBm25?: boolean;
  useFts?: boolean;
  useVector?: boolean;
  useGraph?: boolean;
  includeArchived?: boolean;
  includeContent?: boolean;
  /**
   * Evaluation-only mode.
   * When true, preserve the requested top-K window by bypassing confidence
   * truncation and token-budget truncation without changing live defaults.
   */
  evaluationMode?: boolean;
  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
  intent?: string;
  /** Optional trigger phrases for query-classifier trigger-match routing path. */
  triggerPhrases?: string[];
  /**
   * Internal fallback override: when true, bypass complexity routing and
   * enable all retrieval channels for this search call.
   */
  forceAllChannels?: boolean;
  /**
   * Internal raw-candidate mode used by the Stage 1 pipeline.
   * When true, stop after channel collection and return pre-fusion candidates.
   */
  skipFusion?: boolean;
  /**
   * Internal pipeline handoff mode.
   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
   * apply the remaining pipeline scoring and aggregation steps.
   */
  stopAfterFusion?: boolean;
}

interface HybridSearchResult {
  id: number | string;
  /**
   * Normalized relevance score (0-1). Semantics depend on `source`:
   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
   * - `'graph'` — graph traversal relevance
   *
   * After hybrid merge, all source scores are min-max normalized to 0-1 within
   * their source group to ensure fair cross-method comparison (see P3-02 fix).
   */
  score: number;
  source: string;
  title?: string;
  [key: string]: unknown;
}

/** Non-enumerable shadow metadata attached to result arrays via Object.defineProperty. */
interface ShadowMetaArray {
  _s4shadow?: unknown;
  _s4attribution?: unknown;
  _degradation?: unknown;
}

/** Normalize a fused RRF result to the HybridSearchResult contract. */
function toHybridResult(result: FusionResult): HybridSearchResult {
  const sourceCandidate = (result as { source?: unknown }).source;
  const primarySource = result.sources[0] ?? 'hybrid';
  const scoreCandidate = (result as { score?: unknown }).score;

  return {
    ...result,
    id: result.id,
    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
  };
}

// 3. SPRINT 3 PIPELINE METADATA

/**
 * Optional metadata about pipeline stages attached to enhanced search results.
 * Only populated when the corresponding feature flags are enabled.
 */
interface Sprint3PipelineMeta {
  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
  routing?: {
    tier: string;
    channels: string[];
    skippedChannels: string[];
    featureFlagEnabled: boolean;
    confidence: string;
    features: Record<string, unknown>;
  };
  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
  truncation?: {
    truncated: boolean;
    originalCount: number;
    truncatedCount: number;
    medianGap: number;
    cutoffGap: number;
    cutoffIndex: number;
    thresholdMultiplier: number;
    minResultsGuaranteed: number;
    featureFlagEnabled: boolean;
  };
  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
  tokenBudget?: {
    tier: string;
    budget: number;
    applied: boolean;
    featureFlagEnabled: boolean;
    configValues: Record<string, number>;
    headerOverhead: number;
    adjustedBudget: number;
  };
}

// 4. PI-A2: DEGRADATION TYPES

/** Fallback tier in the 3-tier degradation chain. */
type FallbackTier = 1 | 2 | 3;

/** Why degradation was triggered at a given tier. */
interface DegradationTrigger {
  reason: 'low_quality' | 'insufficient_results' | 'both';
  topScore: number;
  resultCount: number;
  relativeGap?: number;
}

/** Record of a single degradation event during tiered fallback. */
interface DegradationEvent {
  tier: FallbackTier;
  trigger: DegradationTrigger;
  resultCountBefore: number;
  resultCountAfter: number;
}

/**
 * Absolute quality floor for degradation checks.
 *
 * Raw RRF scores are typically small decimals (often <0.05), so a
 * high fixed threshold causes false degradations. Use a conservative floor and
 * pair it with a relative-gap check to avoid score-scale coupling.
 */
const DEGRADATION_QUALITY_THRESHOLD = 0.02;

/** Minimum relative separation between top-1 and top-2 scores. */
const DEGRADATION_MIN_RELATIVE_GAP = 0.2;

/** Minimum result count: must have >= this many results to stay at current tier. */
const DEGRADATION_MIN_RESULTS = 3;

// 5. MODULE STATE

/** Default result limit when none is specified by the caller. */
const DEFAULT_LIMIT = 20;
/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
const PRIMARY_FALLBACK_MIN_SIMILARITY = 30;
/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
const SECONDARY_FALLBACK_MIN_SIMILARITY = 17;
/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
const TIERED_FALLBACK_MIN_SIMILARITY = 10;

/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
const MMR_MIN_CANDIDATES = 2;

/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
const MMR_DEFAULT_LAMBDA = 0.7;

/** Number of top results used as seeds for co-activation spreading. */
const SPREAD_ACTIVATION_TOP_N = 5;

/** Maximum contextual tree header length prepended to content (including brackets). */
const CONTEXT_HEADER_MAX_CHARS = 100;
/** Header/content separator characters added during contextual tree injection. */
const CONTEXT_HEADER_SEPARATOR_CHARS = 1;
/** Reserved token overhead per contextual header, calibrated to max header length. */
const CONTEXT_HEADER_TOKEN_OVERHEAD = Math.ceil(
  (CONTEXT_HEADER_MAX_CHARS + CONTEXT_HEADER_SEPARATOR_CHARS) / 4
);

let db: Database.Database | null = null;
let vectorSearchFn: VectorSearchFn | null = null;
let graphSearchFn: GraphSearchFn | null = null;

// 6. GRAPH CHANNEL METRICS (T008)

interface GraphChannelMetrics {
  totalQueries: number;
  graphHits: number;
  graphOnlyResults: number;
  multiSourceResults: number;
}

const graphMetrics: GraphChannelMetrics = {
  totalQueries: 0,
  graphHits: 0,
  graphOnlyResults: 0,
  multiSourceResults: 0,
};

/**
 * Return current graph channel metrics for health check reporting.

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Stage1 Candidate Gen
// ───────────────────────────────────────────────────────────────
// 4-stage retrieval pipeline architecture
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage avoids downstream fusion/reranking, but may apply temporal
// Contiguity to raw vector-channel hits before later pipeline stages.
// Results are collected from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
// Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: collectRawCandidates → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
//   - Quality score filtering
//   - Tier and contextType filtering
//
// I/O CONTRACT:
// Input:  Stage1Input { config: PipelineConfig }
// Output: Stage1Output { candidates: PipelineRow[], metadata }
// Key invariants:
//     - candidates contains raw channel scores; vector hits may include an
//       optional temporal-contiguity boost applied before downstream fusion
//     - Constitutional rows are always present when includeConstitutional=true and no tier filter
//     - All rows pass qualityThreshold (if set) and tier/contextType filters
// Side effects:
//     - Generates query embeddings via the embeddings provider (external call)
//     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
//
import type { Stage1Input, Stage1Output, PipelineRow } from './types.js';
import { resolveEffectiveScore } from './types.js';
import * as vectorIndex from '../vector-index.js';
import * as embeddings from '../../providers/embeddings.js';
import * as hybridSearch from '../hybrid-search.js';
import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled, isQueryDecompositionEnabled, isGraphConceptRoutingEnabled, isLlmReformulationEnabled, isHyDEEnabled, isQuerySurrogatesEnabled, isTemporalContiguityEnabled, isQueryConceptExpansionEnabled } from '../search-flags.js';
import { expandQuery } from '../query-expander.js';
import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries.js';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/db-helpers.js';
import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
import { withTimeout } from '../../errors/core.js';
import { computeBackfillQualityScore } from '../../validation/save-quality-gate.js';
import {
  isMultiFacet,
  decompose,
  mergeByFacetCoverage as mergeFacetCoveragePools,
  MAX_FACETS,
} from '../query-decomposer.js';
import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
import { runHyDE } from '../hyde.js';
import { matchSurrogates } from '../query-surrogates.js';
import { loadSurrogatesBatch } from '../surrogate-storage.js';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Hybrid search pipeline


// -- Constants --

/** Maximum number of deep-mode query variants to generate (original + expanded). */
const MAX_DEEP_QUERY_VARIANTS = 3;

/** F1: Deep-mode expansion timeout — fall back to base query if variants take too long. */
const DEEP_EXPANSION_TIMEOUT_MS = 5000;

/** Minimum cosine similarity for multi-concept search. */
const MULTI_CONCEPT_MIN_SIMILARITY = 0.5;

/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
const CONSTITUTIONAL_INJECT_LIMIT = 5;

/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
const DEFAULT_EXPANSION_CANDIDATE_LIMIT = 5;

/** D2: Timeout for facet decomposition parallel searches (ms). */
const DECOMPOSITION_TIMEOUT_MS = 5000;
const MAX_QUERY_DECOMPOSITION_FACETS = MAX_FACETS;

// -- Helper Functions --

/**
 * Filter results by a minimum quality score threshold.
 *
 * - If no threshold is provided or it is not a finite number, all results pass.
 * - Threshold is clamped to [0, 1].
 * - Rows with a missing or non-finite `quality_score` are treated as 0.
 *
 * @param results - Candidate rows to filter.
 * @param threshold - Minimum quality score in [0, 1] (inclusive).
 * @returns Filtered array; original array returned unchanged when no threshold applies.
 */
function filterByMinQualityScore(
  results: PipelineRow[],
  threshold?: number
): PipelineRow[] {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
    return results;
  }

  const clampedThreshold = Math.max(0, Math.min(1, threshold));

  return results.filter((row) => {
    const rawScore = row.quality_score as number | undefined;
    const score =
      typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
    return score >= clampedThreshold;
  });
}

function backfillMissingQualityScores(results: PipelineRow[]): PipelineRow[] {
  return results.map((row) => {
    if (row.quality_score !== 0 && row.quality_score != null) {
      return row;
    }

    return {
      ...row,
      quality_score: computeBackfillQualityScore(row),
    };
  });
}

function applyArchiveFilter(
  results: PipelineRow[],
  includeArchived: boolean
): PipelineRow[] {
  if (includeArchived) return results;
  return results.filter((row) => {
    const archived = row.is_archived ?? row.isArchived;
    if (archived == null) return true;
    if (typeof archived === 'number') return archived === 0;
    if (typeof archived === 'boolean') return archived === false;
    return true;
  });
}

function applyFolderFilter(
  results: PipelineRow[],
  specFolder?: string
): PipelineRow[] {
  if (!specFolder) return results;
  return results.filter((row) => {
    const rowSpecFolder = row.spec_folder ?? row.specFolder;
    return rowSpecFolder === specFolder;
  });
}

function applyTierFilter(
  results: PipelineRow[],
  tier?: string
): PipelineRow[] {
  if (!tier) return results;
  return results.filter((row) => row.importance_tier === tier);
}

/**
 * Resolve the effective context type from a pipeline row.
 *
 * Rows may carry context type under either `contextType` (camelCase) or
 * `context_type` (snake_case). This function normalises the lookup.
 *
 * @param row - The pipeline row to inspect.
 * @returns The context type string, or `undefined` if absent.
 */
function resolveRowContextType(row: PipelineRow): string | undefined {
  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
    return row.contextType;
  }
  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
    return row.context_type;
  }
  return undefined;
}

function mergeStringLists(...values: unknown[]): string[] {
  const merged = new Set<string>();
  for (const value of values) {
    if (!Array.isArray(value)) {
      continue;
    }
    for (const entry of value) {
      if (typeof entry === 'string' && entry.length > 0) {
        merged.add(entry);
      }
    }
  }
  return Array.from(merged);
}

function readFiniteScoreMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
    if (typeof score === 'number' && Number.isFinite(score)) {
      normalized[key] = score;
    }
  }
  return normalized;
}

function mergeScoreMaps(...maps: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const map of maps) {
    for (const [key, score] of Object.entries(map)) {
      if (!(key in merged) || score > merged[key]!) {
        merged[key] = score;
      }
    }
  }
  return merged;
}

function getCandidateSources(row: PipelineRow): string[] {
  const explicitSources = mergeStringLists(row.sources);
  if (explicitSources.length > 0) {
    return explicitSources;
  }
  return typeof row.source === 'string' && row.source.length > 0 ? [row.source] : [];
}

function getCandidateSourceScores(row: PipelineRow): Record<string, number> {
  const sourceScores = readFiniteScoreMap(row.sourceScores);
  if (Object.keys(sourceScores).length > 0) {
    return sourceScores;
  }

  const resolvedScore = resolveEffectiveScore(row);
  if (resolvedScore <= 0) {
    return {};
  }

  const fallbackScores: Record<string, number> = {};
  for (const source of getCandidateSources(row)) {
    fallbackScores[source] = resolvedScore;
  }
  return fallbackScores;
}

function annotateBranchScore(row: PipelineRow, branchLabel: string): Record<string, number> {
  const existingBranchScores = readFiniteScoreMap(row.stage1BranchScores);
  const effectiveScore = resolveEffectiveScore(row);
  if (branchLabel.length === 0 || !Number.isFinite(effectiveScore)) {
    return existingBranchScores;
  }
  return mergeScoreMaps(existingBranchScores, { [branchLabel]: effectiveScore });
}

function mergeCandidateRows(
  existing: PipelineRow | undefined,
  incoming: PipelineRow,
  branchLabel: string,
): PipelineRow {
  const incomingBranchScores = annotateBranchScore(incoming, branchLabel);
  if (!existing) {
    const sources = getCandidateSources(incoming);
    const channelAttribution = mergeStringLists(incoming.channelAttribution, sources);
    return {
      ...incoming,
      sources: sources.length > 0 ? sources : incoming.sources,
      channelAttribution: channelAttribution.length > 0 ? channelAttribution : incoming.channelAttribution,
      sourceScores: Object.keys(getCandidateSourceScores(incoming)).length > 0
        ? getCandidateSourceScores(incoming)
        : incoming.sourceScores,
      stage1BranchScores: Object.keys(incomingBranchScores).length > 0 ? incomingBranchScores : undefined,
      stage1BranchCount: Object.keys(incomingBranchScores).length || incoming.stage1BranchCount,
      channelCount: sources.length > 0 ? sources.length : incoming.channelCount,
    };
  }

  const existingScore = resolveEffectiveScore(existing);
  const incomingScore = resolveEffectiveScore(incoming);
  const primary = incomingScore > existingScore ? incoming : existing;
  const secondary = primary === incoming ? existing : incoming;

  const mergedSources = mergeStringLists(getCandidateSources(existing), getCandidateSources(incoming));
  const mergedChannelAttribution = mergeStringLists(
    existing.channelAttribution,
    incoming.channelAttribution,
    mergedSources,
  );
  const mergedSourceScores = mergeScoreMaps(
    getCandidateSourceScores(existing),
    getCandidateSourceScores(incoming),
  );
  const mergedBranchScores = mergeScoreMaps(
    readFiniteScoreMap(existing.stage1BranchScores),
    incomingBranchScores,
  );

  return {
    ...secondary,
    ...primary,
    sources: mergedSources.length > 0 ? mergedSources : primary.sources,
    source: typeof primary.source === 'string' && primary.source.length > 0
      ? primary.source
      : (mergedSources[0] ?? primary.source),
    channelAttribution: mergedChannelAttribution.length > 0
      ? mergedChannelAttribution
      : primary.channelAttribution,
    sourceScores: Object.keys(mergedSourceScores).length > 0
      ? mergedSourceScores
      : primary.sourceScores,
    stage1BranchScores: Object.keys(mergedBranchScores).length > 0
      ? mergedBranchScores
      : primary.stage1BranchScores,
    stage1BranchCount: Object.keys(mergedBranchScores).length || primary.stage1BranchCount,
    channelCount: mergedSources.length > 0 ? mergedSources.length : primary.channelCount,

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Triggers
// ───────────────────────────────────────────────────────────────
// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Feature catalog: Trigger phrase matching (memory_match_triggers)
// Feature catalog: BM25 trigger phrase re-index gate


/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

// Core utilities
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';
import { createFilePathValidator } from '../utils/validators.js';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters/index.js';

// Lib modules
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as attentionDecay from '../lib/cognitive/attention-decay.js';
import * as tierClassifier from '../lib/cognitive/tier-classifier.js';
import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier.js';
import * as coActivation from '../lib/cognitive/co-activation.js';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
// T004: Consumption instrumentation
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger.js';

// Shared handler types
import type { MCPResponse } from './types.js';
// C2 FIX: Import DB access for scope filtering
import { initialize_db } from '../lib/search/vector-index-store.js';
// T73: Import session manager for trusted session validation (IDOR prevention)
import * as sessionManager from '../lib/session/session-manager.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  [key: string]: unknown;
}

interface EnrichedTriggerMatch extends TriggerMatch {
  attentionScore: number;
  tier: string;
  coActivated: boolean;
}

interface FormattedResult {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  tier?: string;
  attentionScore?: number;
  content?: string;
  coActivated?: boolean;
  [key: string]: unknown;
}

interface DecayStats {
  decayedCount: number;
}

interface CoActivatedMemory {
  memoryId: number;
}

interface WorkingMemoryEntry {
  memoryId: number;
  attentionScore: number;
}

interface CognitiveStats {
  enabled: boolean;
  sessionId: string;
  turnNumber: number;
  decayApplied: number;
  memoriesActivated: number;
  coActivations: number;
  tierDistribution: StateStats;
  tokenMetrics: TokenMetrics;
}

interface TriggerArgs {
  prompt: string;
  specFolder?: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
}

/* ───────────────────────────────────────────────────────────────
   2b. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Per-turn decay rate for attention scoring. */
const TURN_DECAY_RATE = 0.98;
const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/* ───────────────────────────────────────────────────────────────
   2c. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/** Fetch full memory records required for FSRS tier classification. */
function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
  const records = new Map<number, TierInput>();
  if (memoryIds.length === 0) return records;

  const db = attentionDecay.getDb();
  if (!db) return records;

  try {
    const stmt = db.prepare(
      'SELECT * FROM memory_index WHERE id = ?'
    );
    for (const id of memoryIds) {
      const row = stmt.get(id) as TierInput | undefined;
      if (row) {
        records.set(row.id as number, row);
      }
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
  }

  return records;
}

/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
async function getTieredContent(
  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
  tier: string
): Promise<string> {
  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
  try {
    const fs = await import('fs');
    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
    const content = fs.readFileSync(canonicalPath, 'utf-8');
    if (tier === 'HOT') return content;
    // WARM tier returns truncated summary
    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
  } catch (_error: unknown) {
    console.warn('[memory-triggers] getTieredContent failed', {
      filePath: memoryInfo.filePath, // server-side only; safe to log
      tier,
      error: _error instanceof Error ? _error.message : String(_error),
    });
    return '';
  }
}

/* ───────────────────────────────────────────────────────────────
   3. MATCH TRIGGERS HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  const {
    prompt,
    limit: rawLimit = 3,
    session_id: rawSessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!prompt || typeof prompt !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_match_triggers',
      error: 'prompt is required and must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'prompt' },
      recovery: {
        hint: 'Provide a non-empty string for the prompt parameter'
      }
    });
  }

  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
  // manager to prevent IDOR. Callers cannot read/write working memory for
  // arbitrary sessions — only server-minted or previously tracked sessions.
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId: args.tenantId,
      userId: args.userId,
      agentId: args.agentId,
    });
    if (trustedSession.error) {
      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
      return createMCPErrorResponse({
        tool: 'memory_match_triggers',
        error: trustedSession.error,
        code: 'E_SESSION_SCOPE',
        details: { requestedSessionId: rawSessionId },
        recovery: {
          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
        },
      });
    }
    sessionId = trustedSession.effectiveSessionId;
  }

  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  await checkDatabaseUpdated();

  const startTime = Date.now();

  // Eval logger — capture trigger query at entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: prompt,
      intent: 'trigger_match',
      specFolder: null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }

  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
    try {
      if (_evalRunId && _evalQueryId) {
        logFinalResult({
          evalRunId: _evalRunId,

codex
I have the core split now: Spec Kit has a true multi-channel retrieval stack, while Mex is mostly lexical/static truth maintenance around markdown claims. I’m drilling one layer deeper into the channel routing and candidate collection so the final output can say exactly when vector semantics win, when lexical/trigger paths win, and how the hybrid policy should choose among them instead of hand-waving.
exec
/bin/zsh -lc 'rg -n "collectRawCandidates|fts5Bm25Search|getAdaptiveWeights|routeQuery|forceAllChannels|useVector|useFts|useBm25|useGraph|triggerPhrases|skipFusion|stopAfterFusion|degradation" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
11:import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
15:import { fts5Bm25Search } from './sqlite-fts.js';
34:import { routeQuery } from './query-router.js';
79:  useBm25?: boolean;
80:  useFts?: boolean;
81:  useVector?: boolean;
82:  useGraph?: boolean;
94:  triggerPhrases?: string[];
99:  forceAllChannels?: boolean;
104:  skipFusion?: boolean;
110:  stopAfterFusion?: boolean;
135:  _degradation?: unknown;
196:/** Fallback tier in the 3-tier degradation chain. */
199:/** Why degradation was triggered at a given tier. */
207:/** Record of a single degradation event during tiered fallback. */
216: * Absolute quality floor for degradation checks.
219: * high fixed threshold causes false degradations. Use a conservative floor and
465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
688:  if (options.useVector === false) allowed.delete('vector');
689:  if (options.useBm25 === false) allowed.delete('bm25');
690:  if (options.useFts === false) allowed.delete('fts');
691:  if (options.useGraph === false) {
707:    useVector: allowedChannels.has('vector'),
708:    useBm25: allowedChannels.has('bm25'),
709:    useFts: allowedChannels.has('fts'),
710:    useGraph: allowedChannels.has('graph'),
738:  routeResult: ReturnType<typeof routeQuery>;
804:      forceAllChannels: true,
862:    useBm25 = isBm25Enabled(),
863:    useFts = true,
864:    useVector = true,
865:    useGraph = true,
872:  if (useVector && embedding && vectorSearchFn) {
896:  if (useFts) {
902:  if (useBm25) {
908:  if (useGraph && graphSearchFn) {
984:    if (options.stopAfterFusion) {
1009:    const routeResult = routeQuery(query, options.triggerPhrases);
1011:    const activeChannels = options.forceAllChannels
1016:    // every fallback tier. useGraph=false also disables the dependent degree lane.
1115:    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
1116:    if (useGraph && graphSearchFn) {
1187:    if (options.skipFusion) {
1226:      ? getAdaptiveWeights(intent)
1382:  const degradationMeta = shadowMeta._degradation;
1575:          ...(degradationMeta !== undefined ? { degradation: degradationMeta } : {}),
1684:async function collectRawCandidates(
1694:    { stopAfterFusion: true }
2117: * @returns Results with _degradation metadata attached as non-enumerable property.
2124:  const degradationEvents: DegradationEvent[] = [];
2135:    // Tier 1 passed quality thresholds — attach empty degradation metadata
2136:    Object.defineProperty(finalTier1, '_degradation', {
2137:      value: degradationEvents,
2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
2151:  degradationEvents.push({
2163:    Object.defineProperty(finalTier2, '_degradation', {
2164:      value: degradationEvents,
2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
2179:  degradationEvents.push({
2190:  Object.defineProperty(finalResults, '_degradation', {
2191:    value: degradationEvents,
2470:  collectRawCandidates,
2486:  routeQuery,

exec
/bin/zsh -lc 'rg -n "generateEmbedding|expandQueryWithEmbeddings|multiConceptSearch|collectRawCandidates|vectorSearchWithContiguity|querySummaryEmbeddings|decompose|routeQueryConcepts|matchSurrogates|runHyDE" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
12://   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
16://   - hybrid: collectRawCandidates → falls back to vector on failure
41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
44:import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
45:import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries.js';
54:  decompose,
57:} from '../query-decomposer.js';
58:import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
60:import { runHyDE } from '../hyde.js';
61:import { matchSurrogates } from '../query-surrogates.js';
400:function decomposeQueryFacets(query: string): string[] {
420:  const decomposedFacets = decompose(trimmed)
424:  if (decomposedFacets.length === 0) {
428:  return [...new Set(decomposedFacets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
437:  const facets = decomposeQueryFacets(query).filter((facet) => facet !== normalizedQuery);
518:      let routingDb: Parameters<typeof routeQueryConcepts>[1];
524:      const routing = routeQueryConcepts(query, routingDb);
594:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
620:      // When enabled and the query is multi-faceted, decompose into up to 3
646:            facets = decompose(query)
666:                  return hybridSearch.collectRawCandidates(
729:                const variantResults = await hybridSearch.collectRawCandidates(
763:          candidates = (await hybridSearch.collectRawCandidates(
772:        candidates = (await hybridSearch.collectRawCandidates(
803:          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
811:              hybridSearch.collectRawCandidates(
828:                  return hybridSearch.collectRawCandidates(
875:          const hybridResults = (await hybridSearch.collectRawCandidates(
900:              vectorSearchWithContiguity(
940:        vectorSearchWithContiguity(
1109:              return hybridSearch.collectRawCandidates(
1178:      const rawHydeCandidates = await runHyDE(query, candidates, limit, specFolder);
1227:          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
1297:  // all candidate IDs and run matchSurrogates() against each. Candidates with
1324:            const matchResult = matchSurrogates(query, {
1422:  decomposeQueryFacets,

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { readFileSync } from "node:fs";
import { visit } from "unist-util-visit";
import { parseMarkdown, getHeadingAtLine, isNegatedSection } from "../markdown.js";
import type { Claim } from "../types.js";
import type { Root, Code, InlineCode, Strong, Text } from "mdast";

const KNOWN_EXTENSIONS = /\.(ts|js|tsx|jsx|py|go|rs|rb|java|json|yaml|yml|toml|md|css|scss|html|vue|svelte|sh)$/;
const COMMAND_PREFIXES = /^(npm|yarn|pnpm|bun|make|cargo|python|pip|go|node|npx|tsx)\s/;
const DEPENDENCY_SECTION_PATTERNS = /key\s*libraries|core\s*technologies|dependencies|stack|tech/i;
/** Paths with angle brackets or square brackets are template placeholders, not real paths */
const TEMPLATE_PLACEHOLDER = /[<>\[\]{}]/;

/** HTTP methods that indicate an API route, not a file path */
const HTTP_METHOD_PREFIX = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\//;

/** Things that look like paths but are actually code snippets, URL routes, or other non-path content */
function isNotAPath(value: string): boolean {
  // URL routes: /voice/incoming, /api/users — start with / but have no file extension
  if (value.startsWith("/") && !KNOWN_EXTENSIONS.test(value)) return true;

  // HTTP method + route: GET /api/bookmarks, POST /users/:id
  if (HTTP_METHOD_PREFIX.test(value)) return true;

  // Code snippets: contains =, (), ;, or other code-like characters
  if (/[=();,]/.test(value)) return true;

  // Quoted strings or attribute assignments: gather.action="...", foo="bar"
  if (/["']/.test(value)) return true;

  // Wildcard prefixes like *_streaming_client.py — patterns, not real paths
  if (value.startsWith("*")) return true;

  return false;
}

/** Extract all claims from a markdown file */
export function extractClaims(filePath: string, source: string): Claim[] {
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return [];
  }

  const tree = parseMarkdown(content);
  const claims: Claim[] = [];

  // Extract from inline code
  visit(tree, "inlineCode", (node: InlineCode) => {
    const line = node.position?.start.line ?? 0;
    const heading = getHeadingAtLine(tree, line);
    const negated = isNegatedSection(heading);

    // Path claims: contains / or ends in known extension
    if (node.value.includes("/") || KNOWN_EXTENSIONS.test(node.value)) {
      // Skip commands, template placeholders, and non-path content
      if (!COMMAND_PREFIXES.test(node.value) && !TEMPLATE_PLACEHOLDER.test(node.value) && !isNotAPath(node.value)) {
        claims.push({
          kind: "path",
          value: node.value,
          source,
          line,
          section: heading,
          negated,
        });
      }
    }

    // Command claims
    if (COMMAND_PREFIXES.test(node.value)) {
      claims.push({
        kind: "command",
        value: node.value,
        source,
        line,
        section: heading,
        negated,
      });
    }
  });

  // Extract from code blocks
  visit(tree, "code", (node: Code) => {
    const line = node.position?.start.line ?? 0;
    const heading = getHeadingAtLine(tree, line);
    const negated = isNegatedSection(heading);

    // Each line of the code block could be a command
    for (const codeLine of node.value.split("\n")) {
      const trimmed = codeLine.trim();
      if (COMMAND_PREFIXES.test(trimmed)) {
        claims.push({
          kind: "command",
          value: trimmed,
          source,
          line,
          section: heading,
          negated,
        });
      }
    }
  });

  // Extract dependencies from **BoldName** patterns in relevant sections
  visit(tree, "strong", (node: Strong) => {
    const line = node.position?.start.line ?? 0;
    const heading = getHeadingAtLine(tree, line);
    const negated = isNegatedSection(heading);

    if (heading && DEPENDENCY_SECTION_PATTERNS.test(heading)) {
      const text = getStrongText(node);
      if (!text) return;

      // Check for version pattern: "React 18" or "Node v20"
      const versionMatch = text.match(/^(.+?)\s+[v^~>=<]*(\d[\d.]*\S*)$/);
      if (versionMatch) {
        claims.push({
          kind: "dependency",
          value: versionMatch[1].trim(),
          source,
          line,
          section: heading,
          negated,
        });
        claims.push({
          kind: "version",
          value: text,
          source,
          line,
          section: heading,
          negated,
        });
      } else {
        claims.push({
          kind: "dependency",
          value: text,
          source,
          line,
          section: heading,
          negated,
        });
      }
    }
  });

  return claims;
}

function getStrongText(node: Strong): string | null {
  const textNode = node.children.find(
    (c): c is Text => c.type === "text"
  );
  return textNode?.value ?? null;
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { globSync } from "glob";
import { getGitDiff } from "../git.js";
import type { SyncTarget } from "../types.js";

/** Build a single combined prompt covering all targets */
export async function buildCombinedBrief(
  targets: SyncTarget[],
  projectRoot: string
): Promise<string> {
  const sections: string[] = [];

  for (const target of targets) {
    sections.push(await buildFileSection(target, projectRoot));
  }

  return `The following scaffold files have drift issues that need fixing. Fix all of them in one pass.

${sections.map((s, i) => `━━━ File ${i + 1}/${sections.length} ━━━\n\n${s}`).join("\n\n")}

Update each file to fix its issues. Only change what's necessary — do not rewrite sections that are correct.
When a referenced path no longer exists, find the correct current path from the filesystem context above and update the reference.`;
}

/** Build a targeted prompt for AI to fix a single file */
export async function buildSyncBrief(
  target: SyncTarget,
  projectRoot: string
): Promise<string> {
  const section = await buildFileSection(target, projectRoot);

  return `The following scaffold file has drift issues that need fixing:

${section}

Update the file to fix these issues. Only change what's necessary — do not rewrite sections that are correct.
When a referenced path no longer exists, find the correct current path from the filesystem context above and update the reference.`;
}

/** Build the content section for a single target (no wrapper instructions) */
async function buildFileSection(
  target: SyncTarget,
  projectRoot: string
): Promise<string> {
  const filePath = resolve(projectRoot, target.file);
  let fileContent: string;
  try {
    fileContent = readFileSync(filePath, "utf-8");
  } catch {
    fileContent = "(file could not be read)";
  }

  const issueList = target.issues
    .map((i) => `- [${i.severity}] ${i.code}: ${i.message}`)
    .join("\n");

  // Get git diff for paths referenced by this file's claims
  const claimedPaths = target.issues
    .filter((i) => i.claim?.kind === "path")
    .map((i) => i.claim!.value);

  const diff = claimedPaths.length
    ? await getGitDiff(claimedPaths, projectRoot)
    : target.gitDiff ?? "";

  // For MISSING_PATH issues, find what actually exists nearby
  const fileContext = buildFileContext(target, projectRoot);

  let section = `**File:** ${target.file}

**Issues found:**
${issueList}

**Current file content:**
\`\`\`markdown
${fileContent}
\`\`\``;

  if (fileContext) {
    section += `

**Filesystem context (what actually exists):**
${fileContext}`;
  }

  if (diff) {
    section += `

**Recent git changes in referenced paths:**
\`\`\`diff
${diff}
\`\`\``;
  }

  return section;
}

/** For missing path issues, list actual files in the relevant directories */
function buildFileContext(
  target: SyncTarget,
  projectRoot: string
): string | null {
  const missingPaths = target.issues
    .filter((i) => i.code === "MISSING_PATH" && i.claim?.kind === "path")
    .map((i) => i.claim!.value);

  if (missingPaths.length === 0) return null;

  const sections: string[] = [];
  const listedDirs = new Set<string>();

  for (const missing of missingPaths) {
    // Get the directory the missing file was expected in
    const dir = missing.includes("/") ? dirname(missing) : ".";
    const dirKey = dir === "." ? "root" : dir;

    // List the directory contents (skip if already listed)
    if (!listedDirs.has(dirKey)) {
      listedDirs.add(dirKey);

      const absDir = resolve(projectRoot, dir);
      if (existsSync(absDir)) {
        try {
          const files = readdirSync(absDir)
            .filter((f) => !f.startsWith("."))
            .sort();
          if (files.length > 0) {
            sections.push(`\`${dir}/\` contains: ${files.join(", ")}`);
          }
        } catch {
          // skip unreadable dirs
        }
      }
    }

    // Fuzzy search: find files with similar names anywhere in the project
    const name = basename(missing);
    const ext = name.includes(".") ? name.split(".").pop() : null;
    if (ext) {
      const matches = globSync(`**/*.${ext}`, {
        cwd: projectRoot,
        ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
        maxDepth: 5,
      });

      if (matches.length > 0 && matches.length <= 20) {
        sections.push(
          `All \`.${ext}\` files in project: ${matches.join(", ")}`
        );
        // Only list once per extension
        break;
      }
    }
  }

  return sections.length > 0 ? sections.join("\n") : null;
}

exec
/bin/zsh -lc "sed -n '980,1060p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const execution = await collectAndFuseHybridResults(query, embedding, options);
  if (execution) {
    if (options.stopAfterFusion) {
      return applyResultLimit(execution.fusedResults, options.limit);
    }

    return enrichFusedResults(query, execution, options);
  }

  return hybridSearch(query, embedding, options);
}

async function collectAndFuseHybridResults(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridFusionExecution | null> {
  try {
    const evaluationMode = options.evaluationMode === true;
    const lists: HybridFusionExecution['lists'] = [];

    // Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
    // When enabled, classifies query complexity and restricts channels to a
    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
    const routeResult = routeQuery(query, options.triggerPhrases);
    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
    const activeChannels = options.forceAllChannels
      ? new Set<ChannelName>(allPossibleChannels)
      : new Set<ChannelName>(routeResult.channels);

    // Respect explicit caller channel disables across both the primary route and
    // every fallback tier. useGraph=false also disables the dependent degree lane.
    const allowedChannels = getAllowedChannels(options);
    for (const channel of allPossibleChannels) {
      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
    }

    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));

    if (skippedChannels.length > 0) {
      s3meta.routing = {
        tier: routeResult.tier,
        channels: routeResult.channels,
        skippedChannels,
        featureFlagEnabled: isComplexityRouterEnabled(),
        confidence: routeResult.classification.confidence,
        features: routeResult.classification.features as Record<string, unknown>,
      };
    }

    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
    // Compute tier-aware budget early so it's available for downstream truncation.
    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
    const budgetResult = getDynamicTokenBudget(routeResult.tier);
    if (budgetResult.applied && !evaluationMode) {
      s3meta.tokenBudget = {
        tier: budgetResult.tier,
        budget: budgetResult.budget,
        applied: budgetResult.applied,
        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
        // headerOverhead and adjustedBudget are patched in below after they are computed
        headerOverhead: 0,
        adjustedBudget: budgetResult.budget,
      };
    }

    // Channel results collected independently, merged after all complete
    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
    let ftsChannelResults: HybridSearchResult[] = [];
    let bm25ChannelResults: HybridSearchResult[] = [];
    const vectorEmbeddingCache = new Map<number, Float32Array>();

    // All channels use synchronous better-sqlite3; sequential execution
    // Is correct — Promise.all adds overhead without parallelism.


exec
/bin/zsh -lc "sed -n '860,930p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    specFolder,
    minSimilarity = 0,
    useBm25 = isBm25Enabled(),
    useFts = true,
    useVector = true,
    useGraph = true,
    includeArchived = false,
  } = options;

  const results: HybridSearchResult[] = [];

  // Vector search
  if (useVector && embedding && vectorSearchFn) {
    try {
      const vectorResults = vectorSearchFn(embedding, {
        limit,
        specFolder,
        minSimilarity,
        includeConstitutional: false, // Handler manages constitutional separately
        includeArchived,
      });
      for (const r of vectorResults) {
        results.push({
          ...r,
          id: r.id as number,
          score: (r.similarity as number) || 0,
          source: 'vector',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
    }
  }

  // FTS search
  if (useFts) {
    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
    results.push(...ftsResults);
  }

  // BM25 search
  if (useBm25) {
    const bm25Results = bm25Search(query, { limit, specFolder });
    results.push(...bm25Results);
  }

  // Graph search
  if (useGraph && graphSearchFn) {
    try {
      const graphResults = graphSearchFn(query, { limit, specFolder });
      for (const r of graphResults) {
        results.push({
          ...r,
          id: r.id as number | string,
          score: (r.score as number) || 0,
          source: 'graph',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
    }
  }

  // Normalize scores per source before merging so one method's raw scale
  // Does not dominate others during final ranking.
  const bySource = new Map<string, HybridSearchResult[]>();
  for (const r of results) {
    const src = r.source || 'unknown';
    if (!bySource.has(src)) bySource.set(src, []);

exec
/bin/zsh -lc "sed -n '1684,1728p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
async function collectRawCandidates(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const { allowedChannels, stages } = await executeFallbackPlan(
    query,
    embedding,
    options,
    isSearchFallbackEnabled() ? 'tiered' : 'adaptive',
    { stopAfterFusion: true }
  );

  const primaryResults = stages[0]?.results ?? [];
  const retryResults = stages[1]?.results ?? [];

  if (isSearchFallbackEnabled()) {
    const mergedResults = retryResults.length > 0
      ? mergeRawCandidateSets(primaryResults, retryResults, options.limit)
      : primaryResults;
    if (mergedResults.length > 0) return applyResultLimit(mergedResults, options.limit);
  } else {
    const stagedResults = retryResults.length > 0 ? retryResults : primaryResults;
    if (stagedResults.length > 0) return applyResultLimit(stagedResults, options.limit);
  }

  if (allowedChannels.has('fts')) {
    const ftsFallback = collectCandidatesFromLists(
      [{ source: 'fts', results: ftsSearch(query, options) }],
      options.limit
    );
    if (ftsFallback.length > 0) return ftsFallback;
  }

  if (allowedChannels.has('bm25')) {
    const bm25Fallback = collectCandidatesFromLists(
      [{ source: 'bm25', results: bm25Search(query, options) }],
      options.limit
    );
    if (bm25Fallback.length > 0) return bm25Fallback;
  }

  console.warn('[hybrid-search] Raw candidate collection returned empty results');
  return [];
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Query Router
// ───────────────────────────────────────────────────────────────
// Tier-to-channel-subset routing for query complexity
// Maps classifier tiers to channel subsets for selective pipeline execution.

import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier.js';
import { getStrategyForQuery } from './artifact-routing.js';
import { classifyIntent } from './intent-classifier.js';

// Feature catalog: Query complexity router


/* ───────────────────────────────────────────────────────────────
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

/** Maps each complexity tier to the set of channels that should be executed. */
interface ChannelRoutingConfig {
  simple: ChannelName[];
  moderate: ChannelName[];
  complex: ChannelName[];
}

/** Result of the routeQuery convenience function. */
interface RouteResult {
  tier: QueryComplexityTier;
  channels: ChannelName[];
  classification: ClassificationResult;
}

/** All available channels in execution order. */
const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;

/** Minimum required channels for safe routing. */
const MIN_CHANNELS = 2;

/** Fallback channels used to pad configs that violate the minimum invariant. */
const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
const BM25_PRESERVING_ARTIFACTS = new Set([
  'spec',
  'plan',
  'tasks',
  'checklist',
  'decision-record',
  'implementation-summary',
  'research',
]);

/* ───────────────────────────────────────────────────────────────
   2. DEFAULT ROUTING CONFIG
----------------------------------------------------------------*/

/**
 * Default tier-to-channel mapping:
 * - simple:   2 channels (vector + fts) — fastest path
 * - moderate: 3 channels (vector + fts + bm25) — balanced
 * - complex:  5 channels (all) — full pipeline
 */
const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
  simple: ['vector', 'fts'],
  moderate: ['vector', 'fts', 'bm25'],
  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
};

/* ───────────────────────────────────────────────────────────────
   3. CHANNEL SUBSET RESOLUTION
----------------------------------------------------------------*/

/**
 * Enforce the minimum 2-distinct-channel invariant on a channel list.
 * If the list has fewer than MIN_CHANNELS entries, pad with
 * fallback channels (vector, fts) until the minimum is met.
 */
function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
  const result = [...new Set(channels)] as ChannelName[];
  if (result.length >= MIN_CHANNELS) return result;

  for (const fallback of FALLBACK_CHANNELS) {
    if (result.length >= MIN_CHANNELS) break;
    if (!result.includes(fallback)) {
      result.push(fallback);
    }
  }

  return result;
}

/**
 * Get the channel subset for a given complexity tier.
 *
 * @param tier - The classified query complexity tier
 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
 * @returns Array of channel names to execute, guaranteed minimum 2 channels
 */
function getChannelSubset(
  tier: QueryComplexityTier,
  config?: ChannelRoutingConfig,
): ChannelName[] {
  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
  return enforceMinimumChannels([...channels]);
}

function shouldPreserveBm25(query: string): boolean {
  const intent = classifyIntent(query).intent;
  if (intent === 'find_spec' || intent === 'find_decision') {
    return true;
  }

  const artifact = getStrategyForQuery(query).detectedClass;
  return BM25_PRESERVING_ARTIFACTS.has(artifact);
}

/* ───────────────────────────────────────────────────────────────
   4. CONVENIENCE: CLASSIFY + ROUTE
----------------------------------------------------------------*/

/**
 * Classify a query's complexity and route it to the appropriate channel subset
 * in a single call.
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
 * (full pipeline) regardless of classification result.
 *
 * @param query - The search query to classify and route
 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
 * @returns RouteResult with tier, channels, and full classification details
 */
function routeQuery(
  query: string,
  triggerPhrases?: string[],
): RouteResult {
  const classification = classifyQueryComplexity(query, triggerPhrases);

  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
  // In that case, always return all channels (full pipeline — safe default).
  if (!isComplexityRouterEnabled()) {
    return {
      tier: classification.tier,
      channels: [...ALL_CHANNELS],
      classification,
    };
  }

  const channels = getChannelSubset(classification.tier);
  const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
    ? enforceMinimumChannels([...channels, 'bm25'])
    : channels;

  return {
    tier: classification.tier,
    channels: adjustedChannels,
    classification,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
----------------------------------------------------------------*/

export {
  // Types
  type ChannelName,
  type ChannelRoutingConfig,
  type RouteResult,

  // Constants
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,

  // Functions
  getChannelSubset,
  routeQuery,

  // Internal helpers (exported for testing)
  enforceMinimumChannels,
};

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { readFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { globSync } from "glob";
import type { MexConfig, DriftReport, DriftIssue, Claim } from "../types.js";
import { extractClaims } from "./claims.js";
import { parseFrontmatter } from "./frontmatter.js";
import { computeScore } from "./scoring.js";
import { checkPaths } from "./checkers/path.js";
import { checkEdges } from "./checkers/edges.js";
import { checkIndexSync } from "./checkers/index-sync.js";
import { checkStaleness } from "./checkers/staleness.js";
import { checkCommands } from "./checkers/command.js";
import { checkDependencies } from "./checkers/dependency.js";
import { checkCrossFile } from "./checkers/cross-file.js";
import { checkScriptCoverage } from "./checkers/script-coverage.js";

/** Run full drift detection across all scaffold files */
export async function runDriftCheck(config: MexConfig): Promise<DriftReport> {
  const { projectRoot, scaffoldRoot } = config;

  // Find all markdown files in scaffold
  const scaffoldFiles = findScaffoldFiles(projectRoot, scaffoldRoot);
  const allClaims: Claim[] = [];
  const allIssues: DriftIssue[] = [];

  // Extract claims from all files
  for (const filePath of scaffoldFiles) {
    const source = relative(projectRoot, filePath);
    const claims = extractClaims(filePath, source);
    allClaims.push(...claims);
  }

  // Run checkers that work on individual files
  for (const filePath of scaffoldFiles) {
    const source = relative(projectRoot, filePath);

    // Frontmatter edge check
    const frontmatter = parseFrontmatter(filePath);
    allIssues.push(
      ...checkEdges(frontmatter, filePath, source, projectRoot, scaffoldRoot)
    );

    // Staleness check
    const stalenessIssues = await checkStaleness(source, source, projectRoot);
    allIssues.push(...stalenessIssues);
  }

  // Run checkers that work on claims
  allIssues.push(...checkPaths(allClaims, projectRoot, scaffoldRoot));
  allIssues.push(...checkCommands(allClaims, projectRoot));
  allIssues.push(...checkDependencies(allClaims, projectRoot));
  allIssues.push(...checkCrossFile(allClaims));

  // Run structural checkers
  allIssues.push(...checkIndexSync(projectRoot, scaffoldRoot));

  // Run coverage checkers (reality → scaffold direction)
  allIssues.push(...checkScriptCoverage(scaffoldFiles, projectRoot));

  const score = computeScore(allIssues);

  return {
    score,
    issues: allIssues,
    filesChecked: scaffoldFiles.length,
    timestamp: new Date().toISOString(),
  };
}

/** Find all markdown files that are part of the scaffold */
function findScaffoldFiles(
  projectRoot: string,
  scaffoldRoot: string
): string[] {
  const scaffoldPatterns = [
    "context/*.md",
    "patterns/*.md",
    "ROUTER.md",
    "AGENTS.md",
    "SETUP.md",
    "SYNC.md",
  ];

  const files: string[] = [];

  // Search inside scaffold root (handles both .mex/ and root layouts)
  for (const pattern of scaffoldPatterns) {
    const matches = globSync(pattern, {
      cwd: scaffoldRoot,
      absolute: true,
      ignore: ["node_modules/**"],
    });
    files.push(...matches);
  }

  // Also check project root for tool config files (CLAUDE.md, etc.)
  if (scaffoldRoot !== projectRoot) {
    for (const name of ["CLAUDE.md", ".cursorrules", ".windsurfrules"]) {
      const matches = globSync(name, {
        cwd: projectRoot,
        absolute: true,
        ignore: ["node_modules/**"],
      });
      files.push(...matches);
    }
  }

  // Deduplicate
  return [...new Set(files)];
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Sqlite Fts
// ───────────────────────────────────────────────────────────────
// Feature catalog: Semantic and lexical search (memory_search)
// Weighted BM25 scoring for FTS5 full-text search.
// Extracted from hybrid-search.ts ftsSearch() for independent
// Testing and future delegation.

import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
import type Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES

// ───────────────────────────────────────────────────────────────
interface FtsBm25Result {
  id: number;
  fts_score: number;
  [key: string]: unknown;
}

interface FtsBm25Options {
  limit?: number;
  specFolder?: string;
  includeArchived?: boolean;
}

type LexicalPath = 'fts5' | 'like' | 'unavailable';
type FallbackState =
  | 'ok'
  | 'compile_probe_miss'
  | 'missing_table'
  | 'no_such_module_fts5'
  | 'bm25_runtime_failure';

interface LexicalCapabilitySnapshot {
  lexicalPath: LexicalPath;
  fallbackState: FallbackState;
}

let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;

function cloneLexicalCapabilitySnapshot(
  snapshot: LexicalCapabilitySnapshot | null
): LexicalCapabilitySnapshot | null {
  return snapshot ? { ...snapshot } : null;
}

function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
  lastLexicalCapabilitySnapshot = { ...snapshot };
}

function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
}

function resetLastLexicalCapabilitySnapshot(): void {
  lastLexicalCapabilitySnapshot = null;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readCompileOptionValue(row: unknown): string | null {
  if (typeof row === 'string') {
    return row;
  }
  if (!row || typeof row !== 'object') {
    return null;
  }

  const record = row as Record<string, unknown>;
  const direct = record.compile_options;
  if (typeof direct === 'string') {
    return direct;
  }

  const firstString = Object.values(record).find((value) => typeof value === 'string');
  return typeof firstString === 'string' ? firstString : null;
}

function isNoSuchModuleFts5Error(error: unknown): boolean {
  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
}

function isBm25RuntimeFailure(error: unknown): boolean {
  const message = toErrorMessage(error).toLowerCase();
  return message.includes('bm25');
}

function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
  try {
    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    const hasFts5CompileFlag = compileRows
      .map(readCompileOptionValue)
      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));

    if (!hasFts5CompileFlag) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'compile_probe_miss',
      };
    }
  } catch {
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'compile_probe_miss',
    };
  }

  try {
    const result = (db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;

    if (!result) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'missing_table',
      };
    }
  } catch (error: unknown) {
    if (isNoSuchModuleFts5Error(error)) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'no_such_module_fts5',
      };
    }
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'missing_table',
    };
  }

  return {
    lexicalPath: 'fts5',
    fallbackState: 'ok',
  };
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Execute a weighted BM25 FTS5 search against memory_fts.
 *
 * Uses SQLite FTS5's built-in bm25() ranking function with
 * per-column weights instead of the default `rank` pseudo-column.
 * This gives title matches 10x weight, trigger_phrases 5x, etc.
 *
 * @param db - SQLite database connection
 * @param query - Raw search query (will be sanitized)
 * @param options - Search options (limit, specFolder, includeArchived)
 * @returns Array of results with BM25 scores (higher = better)
 * @example
 * ```ts
 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
 * ```
 */
function fts5Bm25Search(
  db: Database.Database,
  query: string,
  options: FtsBm25Options = {}
): FtsBm25Result[] {
  const { limit = 20, specFolder, includeArchived = false } = options;

  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
  const tokens = normalizeLexicalQueryTokens(query).fts;
  const sanitized = tokens
    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
    .join(' OR ');

  if (!sanitized) {
    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
    return [];
  }

  const folderFilter = specFolder
    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
    : '';
  const archivalFilter = !includeArchived
    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
    : '';
  const deprecatedTierFilter =
    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";

  const params: (string | number)[] = specFolder
    ? [sanitized, specFolder, specFolder, limit]
    : [sanitized, limit];

  // Bm25() returns negative scores (lower = better), so we negate
  // To produce positive scores where higher = better match.
  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
  const sql = `
    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
    FROM memory_fts
    JOIN memory_index m ON m.id = memory_fts.rowid
    WHERE memory_fts MATCH ?
      ${folderFilter}
      ${archivalFilter}
      ${deprecatedTierFilter}
    ORDER BY fts_score DESC
    LIMIT ?
  `;

  const capability = probeFts5Capability(db);
  setLastLexicalCapabilitySnapshot(capability);
  if (capability.fallbackState !== 'ok') {
    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
    return [];
  }

  try {
    const rows = (db.prepare(sql) as Database.Statement).all(
      ...params
    ) as Array<Record<string, unknown>>;

    const normalizedRows = rows.map(row => ({
      ...row,
      id: row.id as number,
      fts_score: (row.fts_score as number) || 0,
    }));
    setLastLexicalCapabilitySnapshot({
      lexicalPath: 'fts5',
      fallbackState: 'ok',
    });
    return normalizedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
      ? {
          lexicalPath: 'unavailable',
          fallbackState: 'no_such_module_fts5',
        }
      : isBm25RuntimeFailure(error)
        ? {
            lexicalPath: 'unavailable',
            fallbackState: 'bm25_runtime_failure',
          }
        : msg.toLowerCase().includes('no such table: memory_fts')
          ? {
              lexicalPath: 'unavailable',
              fallbackState: 'missing_table',
            }
          : {
              lexicalPath: 'unavailable',
              fallbackState: 'bm25_runtime_failure',
            };
    setLastLexicalCapabilitySnapshot(failureSnapshot);
    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
    return [];
  }
}

/**
 * Check if the memory_fts FTS5 virtual table exists in the database.
 *
 * Used as a feature-detect before calling fts5Bm25Search, since FTS5

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Bm25 Index
// ───────────────────────────────────────────────────────────────
// Feature catalog: BM25 trigger phrase re-index gate
import type Database from 'better-sqlite3';
import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
interface BM25SearchResult {
  id: string;
  /**
   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
   * Higher = better lexical match. Not directly comparable to vector similarity
   * scores; use min-max normalization or RRF when combining with other methods.
   */
  score: number;
}

interface BM25Stats {
  documentCount: number;
  termCount: number;
  avgDocLength: number;
}

interface BM25DocumentSource {
  title?: string | null;
  content_text?: string | null;
  trigger_phrases?: string | string[] | null;
  file_path?: string | null;
}

/* ───────────────────────────────────────────────────────────────
   1B. CONSTANTS & FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */

const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;
const BM25_WARMUP_BATCH_SIZE = 250;
const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);

/**
 * C138: Field weight multipliers for weighted BM25 scoring.
 * When indexing a document composed of multiple fields, multiply
 * each field's token scores by the appropriate weight before
 * accumulating the total document score.
 *
 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
 * not the in-memory BM25 engine in this file. Exported for shared access.
 *
 * title:           10.0 — exact title matches are the strongest signal
 * trigger_phrases:  5.0 — curated keywords next most important
 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
 * body:             1.0 — baseline weight for full body / content_text
 */
const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;

const BM25_FIELD_WEIGHTS: Record<string, number> = {
  title: BM25_FTS5_WEIGHTS[0],
  trigger_phrases: BM25_FTS5_WEIGHTS[1],
  content_generic: BM25_FTS5_WEIGHTS[2],
  body: BM25_FTS5_WEIGHTS[3],
};

/**
 * Check whether the in-memory BM25 index is enabled.
 *
 * @returns `true` when BM25 indexing/search is enabled for the current process.
 * @example
 * ```ts
 * if (isBm25Enabled()) {
 *   getIndex();
 * }
 * ```
 */
function isBm25Enabled(): boolean {
  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
  if (!value) return true; // enabled by default
  if (BM25_DISABLED_VALUES.has(value)) return false;
  return BM25_ENABLED_VALUES.has(value);
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS

// ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
]);

/**
 * Apply lightweight stemming to a token for BM25 indexing and matching.
 *
 * @param word - Token to stem.
 * @returns A lowercased token with simple suffix normalization applied.
 * @example
 * ```ts
 * simpleStem('running');
 * // 'run'
 * ```
 */
function simpleStem(word: string): string {
  let stem = word.toLowerCase();
  let suffixRemoved = false;
  // Simple suffix removal
  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
  // Only deduplicate doubled consonants when a suffix was actually removed.
  // Without this guard, original double consonants are incorrectly stripped:
  // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
  // Handle doubled consonants after suffix
  // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
  // Are identical consonants and deduplicate.
  if (suffixRemoved && stem.length >= 3) {
    const last = stem[stem.length - 1];
    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
      stem = stem.slice(0, -1);
    }
  }
  return stem;
}

function splitLexicalFragments(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);
}

/**
 * Tokenize raw text into normalized BM25 terms.
 *
 * @param text - Input text to tokenize.
 * @returns Stemmed, lowercased, stop-word-filtered terms.
 * @example
 * ```ts
 * tokenize('The memory indexing pipeline');
 * // ['memory', 'index', 'pipeline']
 * ```
 */
function tokenize(text: string): string[] {
  return splitLexicalFragments(text)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(simpleStem);
}

/**
 * Count token frequency occurrences for BM25 scoring.
 *
 * @param tokens - Normalized tokens produced by {@link tokenize}.
 * @returns A frequency map keyed by token text.
 * @example
 * ```ts
 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
 * // 2
 * ```
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
  if (Array.isArray(triggerPhrases)) {
    return triggerPhrases
      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
      .join(' ');
  }

  if (typeof triggerPhrases !== 'string') {
    return '';
  }

  const trimmed = triggerPhrases.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
        .join(' ');
    }
  } catch {
    // Fall back to raw string when the database value is not JSON.
  }

  return trimmed;
}

function buildBm25DocumentText(row: BM25DocumentSource): string {
  const textParts: string[] = [];

  if (typeof row.title === 'string' && row.title.trim()) {
    textParts.push(row.title.trim());
  }

  if (typeof row.content_text === 'string' && row.content_text.trim()) {
    textParts.push(normalizeContentForBM25(row.content_text));
  }

  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
  if (triggerPhrases) {
    textParts.push(triggerPhrases);
  }

  if (typeof row.file_path === 'string' && row.file_path.trim()) {
    textParts.push(row.file_path.trim());
  }

  return textParts.join(' ').trim();
}

// ───────────────────────────────────────────────────────────────
// 3. BM25 INDEX CLASS

// ───────────────────────────────────────────────────────────────
class BM25Index {
  private k1: number;
  private b: number;
  private documents: Map<string, { tokens: string[]; termFreq: Map<string, number> }>;
  private documentFreq: Map<string, number>;
  private totalDocLength: number;
  private warmupHandle: ReturnType<typeof setTimeout> | null;
  private warmupGeneration: number;

  constructor(k1: number = DEFAULT_K1, b: number = DEFAULT_B) {
    this.k1 = k1;
    this.b = b;
    this.documents = new Map();
    this.documentFreq = new Map();
    this.totalDocLength = 0;
    this.warmupHandle = null;
    this.warmupGeneration = 0;
  }

  addDocument(id: string, text: string): void {
    const tokens = tokenize(text);
    const termFreq = getTermFrequencies(tokens);


exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import type { MexConfig, ScannerBrief } from "../types.js";
import { scanManifest } from "./manifest.js";
import { scanEntryPoints } from "./entry-points.js";
import { scanFolderTree } from "./folder-tree.js";
import { scanTooling } from "./tooling.js";
import { scanReadme } from "./readme.js";

/** Run pre-analysis scan and return brief or prompt */
export async function runScan(
  config: MexConfig,
  opts: { jsonOnly?: boolean }
): Promise<ScannerBrief | string> {
  const brief = buildBrief(config.projectRoot);

  if (opts.jsonOnly) return brief;

  return buildPrompt(brief);
}

/** Build the scanner brief from codebase analysis */
function buildBrief(projectRoot: string): ScannerBrief {
  return {
    manifest: scanManifest(projectRoot),
    entryPoints: scanEntryPoints(projectRoot),
    folderTree: scanFolderTree(projectRoot),
    tooling: scanTooling(projectRoot),
    readme: scanReadme(projectRoot),
    timestamp: new Date().toISOString(),
  };
}

/** Build AI prompt with embedded brief */
function buildPrompt(brief: ScannerBrief): string {
  const briefJson = JSON.stringify(brief, null, 2);

  return `Here is a pre-analyzed brief of the codebase — do NOT explore the filesystem yourself, reason from this brief:

<brief>
${briefJson}
</brief>

Using this brief, populate the mex scaffold files. Focus on:
1. context/architecture.md — system components, data flow, integrations
2. context/stack.md — technologies, versions, key libraries
3. context/conventions.md — code patterns, naming, file organization
4. context/decisions.md — architectural choices and their rationale
5. context/setup.md — how to set up and run the project
6. ROUTER.md — update the "Current Project State" section

For each file, use the information from the brief rather than exploring the filesystem.
Be precise about versions, paths, and dependencies — they come directly from the manifest.`;
}

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: agents
description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
last_updated: [YYYY-MM-DD]
---

# [Project Name]

## What This Is
<!-- One sentence. What does this project do?
     Length: 1 sentence maximum.
     Not a tagline — a factual description of what the software does.
     Example: "A REST API for managing inventory across multiple warehouse locations." -->

## Non-Negotiables
<!-- Hard rules the agent must never violate. Not preferences — rules.
     These are the things that, if broken, cause real damage to the codebase.
     Length: 3-5 items. More than 5 means the list has not been prioritised.
     Example:
     - Never write database queries outside of the repository layer
     - Never commit secrets or API keys
     - Always handle errors explicitly — no silent failures -->

## Commands
<!-- The exact commands needed to work on this project.
     Include: run dev server, run tests, run linter, build.
     Use the actual commands from this codebase — not placeholders.
     For monorepos or projects with separate frontend/backend, group by area.
     Target: keep this entire file under 150 tokens. For full-stack projects
     with separate command sets, up to 200 tokens is acceptable.
     Example:
     - Dev: `npm run dev`
     - Test: `npm test`
     - Lint: `npm run lint`
     - Build: `npm run build` -->

## Scaffold Growth
After every task: if no pattern exists for the task type you just completed, create one. If a pattern or context file is now out of date, update it. The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.

## Navigation
At the start of every session, read `ROUTER.md` before doing anything else.
For full project context, patterns, and task guidance — everything is there.

 succeeded in 0ms:
---
name: router
description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
edges:
  - target: context/architecture.md
    condition: when working on system design, integrations, or understanding how components connect
  - target: context/stack.md
    condition: when working with specific technologies, libraries, or making tech decisions
  - target: context/conventions.md
    condition: when writing new code, reviewing code, or unsure about project patterns
  - target: context/decisions.md
    condition: when making architectural choices or understanding why something is built a certain way
  - target: context/setup.md
    condition: when setting up the dev environment or running the project for the first time
  - target: patterns/INDEX.md
    condition: when starting a task — check the pattern index for a matching pattern file
last_updated: [YYYY-MM-DD]
---

# Session Bootstrap

If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.

Then read this file fully before doing anything else in this session.

## Current Project State
<!-- What is working. What is not yet built. Known issues.
     Update this section whenever significant work is completed.
     This is the primary drift prevention mechanism — it re-grounds the agent every session.
     Length: 3 sections (Working / Not Built / Known Issues), 3-7 items each.
     Example:
     **Working:**
     - User authentication and session management
     - Core CRUD operations for all main entities

     **Not yet built:**
     - Email notification system
     - Admin dashboard

     **Known issues:**
     - Pagination breaks on filtered queries with more than 1000 results -->

## Routing Table

Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.

| Task type | Load |
|-----------|------|
| Understanding how the system works | `context/architecture.md` |
| Working with a specific technology | `context/stack.md` |
| Writing or reviewing code | `context/conventions.md` |
| Making a design decision | `context/decisions.md` |
| Setting up or running the project | `context/setup.md` |
| Any specific task | Check `patterns/INDEX.md` for a matching pattern |

## Behavioural Contract

For every task, follow this loop:

1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it. Narrate what you load: "Loading architecture context..."
2. **BUILD** — Do the work. If a pattern exists, follow its Steps. If you are about to deviate from an established pattern, say so before writing any code — state the deviation and why.
3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
4. **DEBUG** — If verification fails or something breaks, check `patterns/INDEX.md` for a debug pattern. Follow it. Fix the issue and re-run VERIFY.
5. **GROW** — After completing the task:
   - If no pattern exists for this task type, create one in `patterns/` using the format in `patterns/README.md`. Add it to `patterns/INDEX.md`. Flag it: "Created `patterns/<name>.md` from this session."
   - If a pattern exists but you deviated from it or discovered a new gotcha, update it with what you learned.
   - If any `context/` file is now out of date because of this work, update it surgically — do not rewrite entire files.
   - Update the "Current Project State" section above if the work was significant.

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Setup — Populate This Scaffold

This file contains the prompts to populate the scaffold. It is NOT the dev environment setup — for that, see `context/setup.md` after population.

This scaffold is currently empty. Follow the steps below to populate it for your project.

## Recommended: Use setup.sh

```bash
.mex/setup.sh
```

The script handles everything automatically:
1. Detects your project state (existing codebase, fresh project, or partial)
2. Asks which AI tool you use and copies the right config file
3. Pre-scans your codebase with `mex init` to build a structured brief (~5-8k tokens vs ~50k from AI exploration)
4. Builds and runs the population prompt — or prints it for manual paste

If you want to populate manually instead, use the prompts below.

## Detecting Your State

**Existing codebase?** Follow Option A.
**Fresh project, nothing built yet?** Follow Option B.
**Partially built?** Follow Option A — the agent will flag empty slots it cannot fill yet.

---

## Option A — Existing Codebase

Paste the following prompt into your agent:

---

**SETUP PROMPT — copy everything between the lines:**

```
You are going to populate an AI context scaffold for this project.
The scaffold lives in the root of this repository.

Read the following files in order before doing anything else:
1. ROUTER.md — understand the scaffold structure
2. context/architecture.md — read the annotation comments to understand what belongs there
3. context/stack.md — same
4. context/conventions.md — same
5. context/decisions.md — same
6. context/setup.md — same

Then explore this codebase:
- Read the main entry point(s)
- Read the folder structure
- Read 2-3 representative files from each major layer
- Read any existing README or documentation

PASS 1 — Populate knowledge files:

Populate each context/ file by replacing the annotation comments
with real content from this codebase. Follow the annotation instructions exactly.
For each slot:
- Use the actual names, patterns, and structures from this codebase
- Do not use generic examples
- Do not leave any slot empty — if you cannot determine the answer,
  write "[TO DETERMINE]" and explain what information is needed
- Keep length within the guidance given in each annotation

Then assess: does this project have domains complex enough that cramming
them into architecture.md would make it too long or too shallow?
If yes, create additional domain-specific context files in context/.
Examples: a project with a complex auth system gets context/auth.md.
A data pipeline gets context/ingestion.md. A project with Stripe gets
context/payments.md. Use the same YAML frontmatter format (name,
description, triggers, edges, last_updated). Only create these for
domains that have real depth — not for simple integrations that fit
in a few lines of architecture.md.

After populating context/ files, update ROUTER.md:
- Fill in the Current Project State section based on what you found
- Add rows to the routing table for any domain-specific context files you created

Update AGENTS.md:
- Fill in the project name, one-line description, non-negotiables, and commands

PASS 2 — Generate starter patterns:

Read patterns/README.md for the format and categories.

Generate 3-5 starter patterns for the most common and most dangerous task
types in this project. Focus on:
- The 1-2 tasks a developer does most often (e.g., add endpoint, add component)
- The 1-2 integrations with the most non-obvious gotchas
- 1 debug pattern for the most common failure boundary

Each pattern should be specific to this project — real file paths, real gotchas,
real verify steps derived from the code you read in Pass 1.
Use the format in patterns/README.md. Name descriptively (e.g., add-endpoint.md).

Do NOT try to generate a pattern for every possible task type. The scaffold
grows incrementally — the behavioural contract (step 5: GROW) will create
new patterns from real work as the project evolves. Setup just seeds the most
critical ones.

After generating patterns, update patterns/INDEX.md with a row for each
pattern file you created. For multi-section patterns, add one row per task
section using anchor links (see INDEX.md annotation for format).

PASS 3 — Wire the web:

Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
For each file, add or update the `edges` array in the YAML frontmatter.
Each edge should point to another scaffold file that is meaningfully related,
with a `condition` explaining when an agent should follow that edge.

Rules for edges:
- Every context/ file should have at least 2 edges
- Every pattern file should have at least 1 edge (usually to the relevant context file)
- Edges should be bidirectional where it makes sense (if A links to B, consider B linking to A)
- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
- Pattern files can edge to other patterns (e.g., debug pattern → related task pattern)

Important: only write content derived from the codebase.
Do not include system-injected text (dates, reminders, etc.)
in any scaffold file.

When done, confirm which files were populated and flag any slots
you could not fill with confidence.
```

---

## Option B — Fresh Project

Paste the following prompt into your agent:

---

**SETUP PROMPT — copy everything between the lines:**

```
You are going to populate an AI context scaffold for a project that
is just starting. Nothing is built yet.

Read the following files in order before doing anything else:
1. ROUTER.md — understand the scaffold structure
2. All files in context/ — read the annotation comments in each

Then ask me the following questions one section at a time.
Wait for my answer before moving to the next section:

1. What does this project do? (one sentence)
2. What are the hard rules — things that must never happen in this codebase?
3. What is the tech stack? (language, framework, database, key libraries)
4. Why did you choose this stack over alternatives?
5. How will the major pieces connect? Describe the flow of a typical request/action.
6. What patterns do you want to enforce from day one?
7. What are you deliberately NOT building or using?

After I answer, populate the context/ files based on my answers.
For any slot you cannot fill yet, write "[TO BE DETERMINED]" and note
what needs to be decided before it can be filled.

Then assess: based on my answers, does this project have domains complex
enough that cramming them into architecture.md would make it too long
or too shallow? If yes, create additional domain-specific context files
in context/. Examples: a project with a complex auth system gets
context/auth.md. A data pipeline gets context/ingestion.md. A project
with Stripe gets context/payments.md. Use the same YAML frontmatter
format (name, description, triggers, edges, last_updated). Only create
these for domains that have real depth — not for simple integrations
that fit in a few lines of architecture.md. For fresh projects, mark
domain-specific unknowns with "[TO BE DETERMINED — populate after first
implementation]".

Update ROUTER.md current state to reflect that this is a new project.
Add rows to the routing table for any domain-specific context files you created.
Update AGENTS.md with the project name, description, non-negotiables, and commands.

Read patterns/README.md for the format and categories.

Generate 2-3 starter patterns for the most obvious task types you can
anticipate for this stack. Focus on the tasks a developer will do first.
Mark unknowns with "[VERIFY AFTER FIRST IMPLEMENTATION]".

Do NOT try to anticipate every possible pattern. The scaffold grows
incrementally — the behavioural contract (step 5: GROW) will create
new patterns from real work as the project evolves. Setup just seeds
the most critical ones.

After generating patterns, update patterns/INDEX.md with a row for each
pattern file you created.

PASS 3 — Wire the web:

Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
For each file, add or update the `edges` array in the YAML frontmatter.
Each edge should point to another scaffold file that is meaningfully related,
with a `condition` explaining when an agent should follow that edge.

Rules for edges:
- Every context/ file should have at least 2 edges
- Every pattern file should have at least 1 edge
- Edges should be bidirectional where it makes sense
- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)

Important: only write content derived from your answers.
Do not include system-injected text (dates, reminders, etc.)
in any scaffold file.
```

---

## After Setup

**Verify** by starting a fresh session and asking your agent:
"Read `.mex/ROUTER.md` and tell me what you now know about this project."

A well-populated scaffold should give the agent enough to:
- Describe the architecture without looking at code
- Name the non-negotiable conventions
- Know which files to load for any given task type
- Know which patterns exist for common task types

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Sync — Realign This Scaffold

## Recommended: Use sync.sh

```bash
.mex/sync.sh
```

The script runs drift detection first, shows you exactly what's wrong, then offers:
1. **Targeted sync** — AI fixes only the flagged files (fastest, cheapest)
2. **Full resync** — AI re-reads everything and updates all scaffold files
3. **Prompt export** — shows the prompts for manual paste
4. **Exit** — fix it yourself

## Quick Check

```bash
mex check              # full drift report
mex check --quiet      # one-liner: "drift score 85/100 (1 error)"
mex sync --dry-run     # preview targeted fix prompts
```

## Manual Resync

If you prefer to paste a prompt manually, or don't have the CLI built:

---

**SYNC PROMPT — copy everything between the lines:**

```
You are going to resync the AI context scaffold for this project.
The scaffold may be out of date — the codebase has changed since it was last populated.

First, read all files in context/ to understand the current scaffold state.
Then explore what has changed in the codebase since the scaffold was last updated.
Check the last_updated dates in the YAML frontmatter of each file.

For each context/ file:
1. Compare the current scaffold content to the actual codebase
2. Identify what has changed, been added, or been removed
3. Update the file to reflect the current state

Critical rules for updating:
- Use surgical, targeted edits — NOT full file rewrites. Read the existing content,
  identify what changed, and update only those sections.
- PRESERVE YAML frontmatter structure. Never delete or rewrite the entire frontmatter block.
  Edit individual fields only. The edges, triggers, name, and description fields must
  survive every sync. If you need to update edges, add or remove individual entries —
  do not replace the entire array.
- In context/decisions.md: NEVER delete existing decisions.
  If a decision has changed, mark the old entry as "Superseded by [new decision title]"
  and add the new decision above it with today's date.
- In all other files: update content to reflect current reality
- Update last_updated in the YAML frontmatter of every file you change
- After updating each file, update ROUTER.md Current Project State

When done, report:
- Which files were updated and what changed
- Any decisions that were superseded
- Any slots that could not be filled with confidence
```

codex
I’ve got enough structure to see the shape of the answer, and now I’m collecting line-accurate evidence for the final synthesis. This last pass is about precision: exact routing defaults, exact lexical weighting behavior, and the exact Mex mechanisms that make it strong for static claim integrity but weak as a standalone semantic retriever.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Query Router
     3	// ───────────────────────────────────────────────────────────────
     4	// Tier-to-channel-subset routing for query complexity
     5	// Maps classifier tiers to channel subsets for selective pipeline execution.
     6	
     7	import {
     8	  classifyQueryComplexity,
     9	  isComplexityRouterEnabled,
    10	  type QueryComplexityTier,
    11	  type ClassificationResult,
    12	} from './query-classifier.js';
    13	import { getStrategyForQuery } from './artifact-routing.js';
    14	import { classifyIntent } from './intent-classifier.js';
    15	
    16	// Feature catalog: Query complexity router
    17	
    18	
    19	/* ───────────────────────────────────────────────────────────────
    20	   1. TYPES & CONSTANTS
    21	----------------------------------------------------------------*/
    22	
    23	/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
    24	type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
    25	
    26	/** Maps each complexity tier to the set of channels that should be executed. */
    27	interface ChannelRoutingConfig {
    28	  simple: ChannelName[];
    29	  moderate: ChannelName[];
    30	  complex: ChannelName[];
    31	}
    32	
    33	/** Result of the routeQuery convenience function. */
    34	interface RouteResult {
    35	  tier: QueryComplexityTier;
    36	  channels: ChannelName[];
    37	  classification: ClassificationResult;
    38	}
    39	
    40	/** All available channels in execution order. */
    41	const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
    42	
    43	/** Minimum required channels for safe routing. */
    44	const MIN_CHANNELS = 2;
    45	
    46	/** Fallback channels used to pad configs that violate the minimum invariant. */
    47	const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
    48	const BM25_PRESERVING_ARTIFACTS = new Set([
    49	  'spec',
    50	  'plan',
    51	  'tasks',
    52	  'checklist',
    53	  'decision-record',
    54	  'implementation-summary',
    55	  'research',
    56	]);
    57	
    58	/* ───────────────────────────────────────────────────────────────
    59	   2. DEFAULT ROUTING CONFIG
    60	----------------------------------------------------------------*/
    61	
    62	/**
    63	 * Default tier-to-channel mapping:
    64	 * - simple:   2 channels (vector + fts) — fastest path
    65	 * - moderate: 3 channels (vector + fts + bm25) — balanced
    66	 * - complex:  5 channels (all) — full pipeline
    67	 */
    68	const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
    69	  simple: ['vector', 'fts'],
    70	  moderate: ['vector', 'fts', 'bm25'],
    71	  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    72	};
    73	
    74	/* ───────────────────────────────────────────────────────────────
    75	   3. CHANNEL SUBSET RESOLUTION
    76	----------------------------------------------------------------*/
    77	
    78	/**
    79	 * Enforce the minimum 2-distinct-channel invariant on a channel list.
    80	 * If the list has fewer than MIN_CHANNELS entries, pad with
    81	 * fallback channels (vector, fts) until the minimum is met.
    82	 */
    83	function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
    84	  const result = [...new Set(channels)] as ChannelName[];
    85	  if (result.length >= MIN_CHANNELS) return result;
    86	
    87	  for (const fallback of FALLBACK_CHANNELS) {
    88	    if (result.length >= MIN_CHANNELS) break;
    89	    if (!result.includes(fallback)) {
    90	      result.push(fallback);
    91	    }
    92	  }
    93	
    94	  return result;
    95	}
    96	
    97	/**
    98	 * Get the channel subset for a given complexity tier.
    99	 *
   100	 * @param tier - The classified query complexity tier
   101	 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
   102	 * @returns Array of channel names to execute, guaranteed minimum 2 channels
   103	 */
   104	function getChannelSubset(
   105	  tier: QueryComplexityTier,
   106	  config?: ChannelRoutingConfig,
   107	): ChannelName[] {
   108	  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
   109	  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
   110	  return enforceMinimumChannels([...channels]);
   111	}
   112	
   113	function shouldPreserveBm25(query: string): boolean {
   114	  const intent = classifyIntent(query).intent;
   115	  if (intent === 'find_spec' || intent === 'find_decision') {
   116	    return true;
   117	  }
   118	
   119	  const artifact = getStrategyForQuery(query).detectedClass;
   120	  return BM25_PRESERVING_ARTIFACTS.has(artifact);
   121	}
   122	
   123	/* ───────────────────────────────────────────────────────────────
   124	   4. CONVENIENCE: CLASSIFY + ROUTE
   125	----------------------------------------------------------------*/
   126	
   127	/**
   128	 * Classify a query's complexity and route it to the appropriate channel subset
   129	 * in a single call.
   130	 *
   131	 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
   132	 * (full pipeline) regardless of classification result.
   133	 *
   134	 * @param query - The search query to classify and route
   135	 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
   136	 * @returns RouteResult with tier, channels, and full classification details
   137	 */
   138	function routeQuery(
   139	  query: string,
   140	  triggerPhrases?: string[],
   141	): RouteResult {
   142	  const classification = classifyQueryComplexity(query, triggerPhrases);
   143	
   144	  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
   145	  // In that case, always return all channels (full pipeline — safe default).
   146	  if (!isComplexityRouterEnabled()) {
   147	    return {
   148	      tier: classification.tier,
   149	      channels: [...ALL_CHANNELS],
   150	      classification,
   151	    };
   152	  }
   153	
   154	  const channels = getChannelSubset(classification.tier);
   155	  const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
   156	    ? enforceMinimumChannels([...channels, 'bm25'])
   157	    : channels;
   158	
   159	  return {
   160	    tier: classification.tier,
   161	    channels: adjustedChannels,
   162	    classification,
   163	  };
   164	}
   165	
   166	/* ───────────────────────────────────────────────────────────────
   167	   5. EXPORTS
   168	----------------------------------------------------------------*/
   169	
   170	export {
   171	  // Types
   172	  type ChannelName,
   173	  type ChannelRoutingConfig,
   174	  type RouteResult,
   175	
   176	  // Constants
   177	  DEFAULT_ROUTING_CONFIG,
   178	  ALL_CHANNELS,
   179	  MIN_CHANNELS,
   180	  FALLBACK_CHANNELS,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Sqlite Fts
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Semantic and lexical search (memory_search)
     5	// Weighted BM25 scoring for FTS5 full-text search.
     6	// Extracted from hybrid-search.ts ftsSearch() for independent
     7	// Testing and future delegation.
     8	
     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
    10	import type Database from 'better-sqlite3';
    11	
    12	// ───────────────────────────────────────────────────────────────
    13	// 2. INTERFACES
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	interface FtsBm25Result {
    17	  id: number;
    18	  fts_score: number;
    19	  [key: string]: unknown;
    20	}
    21	
    22	interface FtsBm25Options {
    23	  limit?: number;
    24	  specFolder?: string;
    25	  includeArchived?: boolean;
    26	}
    27	
    28	type LexicalPath = 'fts5' | 'like' | 'unavailable';
    29	type FallbackState =
    30	  | 'ok'
    31	  | 'compile_probe_miss'
    32	  | 'missing_table'
    33	  | 'no_such_module_fts5'
    34	  | 'bm25_runtime_failure';
    35	
    36	interface LexicalCapabilitySnapshot {
    37	  lexicalPath: LexicalPath;
    38	  fallbackState: FallbackState;
    39	}
    40	
    41	let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;
    42	
    43	function cloneLexicalCapabilitySnapshot(
    44	  snapshot: LexicalCapabilitySnapshot | null
    45	): LexicalCapabilitySnapshot | null {
    46	  return snapshot ? { ...snapshot } : null;
    47	}
    48	
    49	function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
    50	  lastLexicalCapabilitySnapshot = { ...snapshot };
    51	}
    52	
    53	function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
    54	  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
    55	}
    56	
    57	function resetLastLexicalCapabilitySnapshot(): void {
    58	  lastLexicalCapabilitySnapshot = null;
    59	}
    60	
    61	function toErrorMessage(error: unknown): string {
    62	  return error instanceof Error ? error.message : String(error);
    63	}
    64	
    65	function readCompileOptionValue(row: unknown): string | null {
    66	  if (typeof row === 'string') {
    67	    return row;
    68	  }
    69	  if (!row || typeof row !== 'object') {
    70	    return null;
    71	  }
    72	
    73	  const record = row as Record<string, unknown>;
    74	  const direct = record.compile_options;
    75	  if (typeof direct === 'string') {
    76	    return direct;
    77	  }
    78	
    79	  const firstString = Object.values(record).find((value) => typeof value === 'string');
    80	  return typeof firstString === 'string' ? firstString : null;
    81	}
    82	
    83	function isNoSuchModuleFts5Error(error: unknown): boolean {
    84	  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
    85	}
    86	
    87	function isBm25RuntimeFailure(error: unknown): boolean {
    88	  const message = toErrorMessage(error).toLowerCase();
    89	  return message.includes('bm25');
    90	}
    91	
    92	function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
    93	  try {
    94	    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    95	    const hasFts5CompileFlag = compileRows
    96	      .map(readCompileOptionValue)
    97	      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
    98	
    99	    if (!hasFts5CompileFlag) {
   100	      return {
   101	        lexicalPath: 'unavailable',
   102	        fallbackState: 'compile_probe_miss',
   103	      };
   104	    }
   105	  } catch {
   106	    return {
   107	      lexicalPath: 'unavailable',
   108	      fallbackState: 'compile_probe_miss',
   109	    };
   110	  }
   111	
   112	  try {
   113	    const result = (db.prepare(
   114	      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	
   117	    if (!result) {
   118	      return {
   119	        lexicalPath: 'unavailable',
   120	        fallbackState: 'missing_table',
   121	      };
   122	    }
   123	  } catch (error: unknown) {
   124	    if (isNoSuchModuleFts5Error(error)) {
   125	      return {
   126	        lexicalPath: 'unavailable',
   127	        fallbackState: 'no_such_module_fts5',
   128	      };
   129	    }
   130	    return {
   131	      lexicalPath: 'unavailable',
   132	      fallbackState: 'missing_table',
   133	    };
   134	  }
   135	
   136	  return {
   137	    lexicalPath: 'fts5',
   138	    fallbackState: 'ok',
   139	  };
   140	}
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. CORE FUNCTION
   144	
   145	// ───────────────────────────────────────────────────────────────
   146	/**
   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
   148	 *
   149	 * Uses SQLite FTS5's built-in bm25() ranking function with
   150	 * per-column weights instead of the default `rank` pseudo-column.
   151	 * This gives title matches 10x weight, trigger_phrases 5x, etc.
   152	 *
   153	 * @param db - SQLite database connection
   154	 * @param query - Raw search query (will be sanitized)
   155	 * @param options - Search options (limit, specFolder, includeArchived)
   156	 * @returns Array of results with BM25 scores (higher = better)
   157	 * @example
   158	 * ```ts
   159	 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
   160	 * ```
   161	 */
   162	function fts5Bm25Search(
   163	  db: Database.Database,
   164	  query: string,
   165	  options: FtsBm25Options = {}
   166	): FtsBm25Result[] {
   167	  const { limit = 20, specFolder, includeArchived = false } = options;
   168	
   169	  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
   170	  const tokens = normalizeLexicalQueryTokens(query).fts;
   171	  const sanitized = tokens
   172	    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
   173	    .join(' OR ');
   174	
   175	  if (!sanitized) {
   176	    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
   177	    return [];
   178	  }
   179	
   180	  const folderFilter = specFolder
   181	    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
   182	    : '';
   183	  const archivalFilter = !includeArchived
   184	    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
   185	    : '';
   186	  const deprecatedTierFilter =
   187	    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";
   188	
   189	  const params: (string | number)[] = specFolder
   190	    ? [sanitized, specFolder, specFolder, limit]
   191	    : [sanitized, limit];
   192	
   193	  // Bm25() returns negative scores (lower = better), so we negate
   194	  // To produce positive scores where higher = better match.
   195	  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
   196	  const sql = `
   197	    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
   198	    FROM memory_fts
   199	    JOIN memory_index m ON m.id = memory_fts.rowid
   200	    WHERE memory_fts MATCH ?
   201	      ${folderFilter}
   202	      ${archivalFilter}
   203	      ${deprecatedTierFilter}
   204	    ORDER BY fts_score DESC
   205	    LIMIT ?
   206	  `;
   207	
   208	  const capability = probeFts5Capability(db);
   209	  setLastLexicalCapabilitySnapshot(capability);
   210	  if (capability.fallbackState !== 'ok') {
   211	    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
   212	    return [];
   213	  }
   214	
   215	  try {
   216	    const rows = (db.prepare(sql) as Database.Statement).all(
   217	      ...params
   218	    ) as Array<Record<string, unknown>>;
   219	
   220	    const normalizedRows = rows.map(row => ({

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '980,1060p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   980	  options: HybridSearchOptions = {}
   981	): Promise<HybridSearchResult[]> {
   982	  const execution = await collectAndFuseHybridResults(query, embedding, options);
   983	  if (execution) {
   984	    if (options.stopAfterFusion) {
   985	      return applyResultLimit(execution.fusedResults, options.limit);
   986	    }
   987	
   988	    return enrichFusedResults(query, execution, options);
   989	  }
   990	
   991	  return hybridSearch(query, embedding, options);
   992	}
   993	
   994	async function collectAndFuseHybridResults(
   995	  query: string,
   996	  embedding: Float32Array | number[] | null,
   997	  options: HybridSearchOptions = {}
   998	): Promise<HybridFusionExecution | null> {
   999	  try {
  1000	    const evaluationMode = options.evaluationMode === true;
  1001	    const lists: HybridFusionExecution['lists'] = [];
  1002	
  1003	    // Pipeline metadata collector (populated by flag-gated stages)
  1004	    const s3meta: Sprint3PipelineMeta = {};
  1005	
  1006	    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
  1007	    // When enabled, classifies query complexity and restricts channels to a
  1008	    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
  1009	    const routeResult = routeQuery(query, options.triggerPhrases);
  1010	    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
  1011	    const activeChannels = options.forceAllChannels
  1012	      ? new Set<ChannelName>(allPossibleChannels)
  1013	      : new Set<ChannelName>(routeResult.channels);
  1014	
  1015	    // Respect explicit caller channel disables across both the primary route and
  1016	    // every fallback tier. useGraph=false also disables the dependent degree lane.
  1017	    const allowedChannels = getAllowedChannels(options);
  1018	    for (const channel of allPossibleChannels) {
  1019	      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
  1020	    }
  1021	
  1022	    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
  1023	
  1024	    if (skippedChannels.length > 0) {
  1025	      s3meta.routing = {
  1026	        tier: routeResult.tier,
  1027	        channels: routeResult.channels,
  1028	        skippedChannels,
  1029	        featureFlagEnabled: isComplexityRouterEnabled(),
  1030	        confidence: routeResult.classification.confidence,
  1031	        features: routeResult.classification.features as Record<string, unknown>,
  1032	      };
  1033	    }
  1034	
  1035	    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
  1036	    // Compute tier-aware budget early so it's available for downstream truncation.
  1037	    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
  1038	    const budgetResult = getDynamicTokenBudget(routeResult.tier);
  1039	    if (budgetResult.applied && !evaluationMode) {
  1040	      s3meta.tokenBudget = {
  1041	        tier: budgetResult.tier,
  1042	        budget: budgetResult.budget,
  1043	        applied: budgetResult.applied,
  1044	        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
  1045	        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
  1046	        // headerOverhead and adjustedBudget are patched in below after they are computed
  1047	        headerOverhead: 0,
  1048	        adjustedBudget: budgetResult.budget,
  1049	      };
  1050	    }
  1051	
  1052	    // Channel results collected independently, merged after all complete
  1053	    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
  1054	    let ftsChannelResults: HybridSearchResult[] = [];
  1055	    let bm25ChannelResults: HybridSearchResult[] = [];
  1056	    const vectorEmbeddingCache = new Map<number, Float32Array>();
  1057	
  1058	    // All channels use synchronous better-sqlite3; sequential execution
  1059	    // Is correct — Promise.all adds overhead without parallelism.
  1060	

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Bm25 Index
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: BM25 trigger phrase re-index gate
     5	import type Database from 'better-sqlite3';
     6	import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
     7	
     8	// ───────────────────────────────────────────────────────────────
     9	// 1. INTERFACES
    10	
    11	// ───────────────────────────────────────────────────────────────
    12	interface BM25SearchResult {
    13	  id: string;
    14	  /**
    15	   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
    16	   * Higher = better lexical match. Not directly comparable to vector similarity
    17	   * scores; use min-max normalization or RRF when combining with other methods.
    18	   */
    19	  score: number;
    20	}
    21	
    22	interface BM25Stats {
    23	  documentCount: number;
    24	  termCount: number;
    25	  avgDocLength: number;
    26	}
    27	
    28	interface BM25DocumentSource {
    29	  title?: string | null;
    30	  content_text?: string | null;
    31	  trigger_phrases?: string | string[] | null;
    32	  file_path?: string | null;
    33	}
    34	
    35	/* ───────────────────────────────────────────────────────────────
    36	   1B. CONSTANTS & FEATURE FLAG
    37	   ──────────────────────────────────────────────────────────────── */
    38	
    39	const DEFAULT_K1 = 1.2;
    40	const DEFAULT_B = 0.75;
    41	const BM25_WARMUP_BATCH_SIZE = 250;
    42	const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
    43	const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
    44	
    45	/**
    46	 * C138: Field weight multipliers for weighted BM25 scoring.
    47	 * When indexing a document composed of multiple fields, multiply
    48	 * each field's token scores by the appropriate weight before
    49	 * accumulating the total document score.
    50	 *
    51	 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
    52	 * not the in-memory BM25 engine in this file. Exported for shared access.
    53	 *
    54	 * title:           10.0 — exact title matches are the strongest signal
    55	 * trigger_phrases:  5.0 — curated keywords next most important
    56	 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
    57	 * body:             1.0 — baseline weight for full body / content_text
    58	 */
    59	const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;
    60	
    61	const BM25_FIELD_WEIGHTS: Record<string, number> = {
    62	  title: BM25_FTS5_WEIGHTS[0],
    63	  trigger_phrases: BM25_FTS5_WEIGHTS[1],
    64	  content_generic: BM25_FTS5_WEIGHTS[2],
    65	  body: BM25_FTS5_WEIGHTS[3],
    66	};
    67	
    68	/**
    69	 * Check whether the in-memory BM25 index is enabled.
    70	 *
    71	 * @returns `true` when BM25 indexing/search is enabled for the current process.
    72	 * @example
    73	 * ```ts
    74	 * if (isBm25Enabled()) {
    75	 *   getIndex();
    76	 * }
    77	 * ```
    78	 */
    79	function isBm25Enabled(): boolean {
    80	  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
    81	  if (!value) return true; // enabled by default
    82	  if (BM25_DISABLED_VALUES.has(value)) return false;
    83	  return BM25_ENABLED_VALUES.has(value);
    84	}
    85	
    86	// ───────────────────────────────────────────────────────────────
    87	// 2. HELPERS
    88	
    89	// ───────────────────────────────────────────────────────────────
    90	const STOP_WORDS = new Set([
    91	  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    92	  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
    93	  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
    94	  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
    95	  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
    96	]);
    97	
    98	/**
    99	 * Apply lightweight stemming to a token for BM25 indexing and matching.
   100	 *
   101	 * @param word - Token to stem.
   102	 * @returns A lowercased token with simple suffix normalization applied.
   103	 * @example
   104	 * ```ts
   105	 * simpleStem('running');
   106	 * // 'run'
   107	 * ```
   108	 */
   109	function simpleStem(word: string): string {
   110	  let stem = word.toLowerCase();
   111	  let suffixRemoved = false;
   112	  // Simple suffix removal
   113	  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
   114	  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
   115	  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   116	  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   117	  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   118	  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
   119	  // Only deduplicate doubled consonants when a suffix was actually removed.
   120	  // Without this guard, original double consonants are incorrectly stripped:
   121	  // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
   122	  // Handle doubled consonants after suffix
   123	  // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
   124	  // Are identical consonants and deduplicate.
   125	  if (suffixRemoved && stem.length >= 3) {
   126	    const last = stem[stem.length - 1];
   127	    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
   128	      stem = stem.slice(0, -1);
   129	    }
   130	  }
   131	  return stem;
   132	}
   133	
   134	function splitLexicalFragments(text: string): string[] {
   135	  if (!text || typeof text !== 'string') return [];
   136	
   137	  return text
   138	    .toLowerCase()
   139	    .replace(/[^a-z0-9\s-_]/g, ' ')
   140	    .split(/\s+/)
   141	    .map(t => t.trim())
   142	    .filter(Boolean);
   143	}
   144	
   145	/**
   146	 * Tokenize raw text into normalized BM25 terms.
   147	 *
   148	 * @param text - Input text to tokenize.
   149	 * @returns Stemmed, lowercased, stop-word-filtered terms.
   150	 * @example
   151	 * ```ts
   152	 * tokenize('The memory indexing pipeline');
   153	 * // ['memory', 'index', 'pipeline']
   154	 * ```
   155	 */
   156	function tokenize(text: string): string[] {
   157	  return splitLexicalFragments(text)
   158	    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
   159	    .map(simpleStem);
   160	}
   161	
   162	/**
   163	 * Count token frequency occurrences for BM25 scoring.
   164	 *
   165	 * @param tokens - Normalized tokens produced by {@link tokenize}.
   166	 * @returns A frequency map keyed by token text.
   167	 * @example
   168	 * ```ts
   169	 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
   170	 * // 2
   171	 * ```
   172	 */
   173	function getTermFrequencies(tokens: string[]): Map<string, number> {
   174	  const freq = new Map<string, number>();
   175	  for (const token of tokens) {
   176	    freq.set(token, (freq.get(token) || 0) + 1);
   177	  }
   178	  return freq;
   179	}
   180	
   181	function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
   182	  if (Array.isArray(triggerPhrases)) {
   183	    return triggerPhrases
   184	      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   185	      .join(' ');
   186	  }
   187	
   188	  if (typeof triggerPhrases !== 'string') {
   189	    return '';
   190	  }
   191	
   192	  const trimmed = triggerPhrases.trim();
   193	  if (!trimmed) {
   194	    return '';
   195	  }
   196	
   197	  try {
   198	    const parsed = JSON.parse(trimmed) as unknown;
   199	    if (Array.isArray(parsed)) {
   200	      return parsed
   201	        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   202	        .join(' ');
   203	    }
   204	  } catch {
   205	    // Fall back to raw string when the database value is not JSON.
   206	  }
   207	
   208	  return trimmed;
   209	}
   210	
   211	function buildBm25DocumentText(row: BM25DocumentSource): string {
   212	  const textParts: string[] = [];
   213	
   214	  if (typeof row.title === 'string' && row.title.trim()) {
   215	    textParts.push(row.title.trim());
   216	  }
   217	
   218	  if (typeof row.content_text === 'string' && row.content_text.trim()) {
   219	    textParts.push(normalizeContentForBM25(row.content_text));
   220	  }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '860,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   860	    specFolder,
   861	    minSimilarity = 0,
   862	    useBm25 = isBm25Enabled(),
   863	    useFts = true,
   864	    useVector = true,
   865	    useGraph = true,
   866	    includeArchived = false,
   867	  } = options;
   868	
   869	  const results: HybridSearchResult[] = [];
   870	
   871	  // Vector search
   872	  if (useVector && embedding && vectorSearchFn) {
   873	    try {
   874	      const vectorResults = vectorSearchFn(embedding, {
   875	        limit,
   876	        specFolder,
   877	        minSimilarity,
   878	        includeConstitutional: false, // Handler manages constitutional separately
   879	        includeArchived,
   880	      });
   881	      for (const r of vectorResults) {
   882	        results.push({
   883	          ...r,
   884	          id: r.id as number,
   885	          score: (r.similarity as number) || 0,
   886	          source: 'vector',
   887	        });
   888	      }
   889	    } catch (error: unknown) {
   890	      const msg = error instanceof Error ? error.message : String(error);
   891	      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
   892	    }
   893	  }
   894	
   895	  // FTS search
   896	  if (useFts) {
   897	    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
   898	    results.push(...ftsResults);
   899	  }
   900	
   901	  // BM25 search
   902	  if (useBm25) {
   903	    const bm25Results = bm25Search(query, { limit, specFolder });
   904	    results.push(...bm25Results);
   905	  }
   906	
   907	  // Graph search
   908	  if (useGraph && graphSearchFn) {
   909	    try {
   910	      const graphResults = graphSearchFn(query, { limit, specFolder });
   911	      for (const r of graphResults) {
   912	        results.push({
   913	          ...r,
   914	          id: r.id as number | string,
   915	          score: (r.score as number) || 0,
   916	          source: 'graph',
   917	        });
   918	      }
   919	    } catch (error: unknown) {
   920	      const msg = error instanceof Error ? error.message : String(error);
   921	      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
   922	    }
   923	  }
   924	
   925	  // Normalize scores per source before merging so one method's raw scale
   926	  // Does not dominate others during final ranking.
   927	  const bySource = new Map<string, HybridSearchResult[]>();
   928	  for (const r of results) {
   929	    const src = r.source || 'unknown';
   930	    if (!bySource.has(src)) bySource.set(src, []);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1684,1735p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1684	async function collectRawCandidates(
  1685	  query: string,
  1686	  embedding: Float32Array | number[] | null,
  1687	  options: HybridSearchOptions = {}
  1688	): Promise<HybridSearchResult[]> {
  1689	  const { allowedChannels, stages } = await executeFallbackPlan(
  1690	    query,
  1691	    embedding,
  1692	    options,
  1693	    isSearchFallbackEnabled() ? 'tiered' : 'adaptive',
  1694	    { stopAfterFusion: true }
  1695	  );
  1696	
  1697	  const primaryResults = stages[0]?.results ?? [];
  1698	  const retryResults = stages[1]?.results ?? [];
  1699	
  1700	  if (isSearchFallbackEnabled()) {
  1701	    const mergedResults = retryResults.length > 0
  1702	      ? mergeRawCandidateSets(primaryResults, retryResults, options.limit)
  1703	      : primaryResults;
  1704	    if (mergedResults.length > 0) return applyResultLimit(mergedResults, options.limit);
  1705	  } else {
  1706	    const stagedResults = retryResults.length > 0 ? retryResults : primaryResults;
  1707	    if (stagedResults.length > 0) return applyResultLimit(stagedResults, options.limit);
  1708	  }
  1709	
  1710	  if (allowedChannels.has('fts')) {
  1711	    const ftsFallback = collectCandidatesFromLists(
  1712	      [{ source: 'fts', results: ftsSearch(query, options) }],
  1713	      options.limit
  1714	    );
  1715	    if (ftsFallback.length > 0) return ftsFallback;
  1716	  }
  1717	
  1718	  if (allowedChannels.has('bm25')) {
  1719	    const bm25Fallback = collectCandidatesFromLists(
  1720	      [{ source: 'bm25', results: bm25Search(query, options) }],
  1721	      options.limit
  1722	    );
  1723	    if (bm25Fallback.length > 0) return bm25Fallback;
  1724	  }
  1725	
  1726	  console.warn('[hybrid-search] Raw candidate collection returned empty results');
  1727	  return [];
  1728	}
  1729	
  1730	/**
  1731	 * Search with automatic fallback chain.
  1732	 * When SPECKIT_SEARCH_FALLBACK=true: delegates to the 3-tier quality-aware
  1733	 * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
  1734	 * fallback — primary at minSimilarity=30, retry at 17.
  1735	 *

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '150,250p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '610,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	
   151	  // Return the entry for test verification
   152	  return logEntry;
   153	}
   154	
   155	/* --- 4. TRIGGER CACHE --- */
   156	
   157	// In-memory cache of trigger phrases for fast matching
   158	let triggerCache: TriggerCacheEntry[] | null = null;
   159	let triggerCandidateIndex: Map<string, Set<number>> | null = null;
   160	let cacheTimestamp: number = 0;
   161	let lastDegradedState: TriggerMatcherDegradedState | null = null;
   162	const triggerCacheLoaderStatementByConnection = new WeakMap<Database.Database, Database.Statement>();
   163	
   164	// LRU cache for regex objects to prevent memory leaks
   165	const regexLruCache: Map<string, RegExp> = new Map();
   166	const UNICODE_WORD_CHAR_CLASS = '\\p{L}\\p{N}\\p{M}';
   167	const UNICODE_TOKEN_PATTERN = /[\p{L}\p{N}\p{M}]+/gu;
   168	const CJK_SCRIPT_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
   169	const MIN_INDEX_NGRAM_SIZE = 2;
   170	const MAX_INDEX_NGRAM_SIZE = 3;
   171	const COMMON_TRIGGER_STOPWORDS = new Set([
   172	  'a', 'an', 'the', 'and', 'or', 'but',
   173	  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
   174	  'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by',
   175	]);
   176	const TRIGGER_CACHE_LOADER_SQL = `
   177	  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
   178	  FROM memory_index
   179	  WHERE embedding_status = 'success'
   180	    AND trigger_phrases IS NOT NULL
   181	    AND trigger_phrases != '[]'
   182	    AND trigger_phrases != ''
   183	  ORDER BY id ASC
   184	`;
   185	
   186	function getTriggerCacheLoaderStatement(database: Database.Database): Database.Statement {
   187	  const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
   188	  if (cachedStatement) {
   189	    return cachedStatement;
   190	  }
   191	
   192	  const statement = database.prepare(TRIGGER_CACHE_LOADER_SQL) as Database.Statement;
   193	  triggerCacheLoaderStatementByConnection.set(database, statement);
   194	  return statement;
   195	}
   196	
   197	export function normalizeTriggerText(text: string): string {
   198	  return normalizeUnicode(text, false)
   199	    .trim()
   200	    .replace(/\s+/g, ' ');
   201	}
   202	
   203	function buildBoundaryRegex(phrase: string): RegExp {
   204	  const normalizedPhrase = normalizeTriggerText(phrase);
   205	  const escaped = escapeRegex(normalizedPhrase);
   206	
   207	  // CJK text often appears in continuous sentence flow without whitespace-delimited
   208	  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
   209	  // phrases are not rejected by boundary checks on neighboring CJK characters.
   210	  if (CJK_SCRIPT_PATTERN.test(normalizedPhrase) && !/\s/u.test(normalizedPhrase)) {
   211	    return new RegExp(escaped, 'iu');
   212	  }
   213	
   214	  return new RegExp(
   215	    `(?:^|[^${UNICODE_WORD_CHAR_CLASS}])${escaped}(?:[^${UNICODE_WORD_CHAR_CLASS}]|$)`,
   216	    'iu'
   217	  );
   218	}
   219	
   220	function getUnicodeTokens(text: string): string[] {
   221	  const normalized = normalizeTriggerText(text);
   222	  if (!normalized) {
   223	    return [];
   224	  }
   225	
   226	  return Array.from(normalized.matchAll(UNICODE_TOKEN_PATTERN), (match) => match[0]);
   227	}
   228	
   229	function isSignificantIndexToken(token: string): boolean {
   230	  if (!token) {
   231	    return false;
   232	  }
   233	
   234	  return token.length >= CONFIG.MIN_PHRASE_LENGTH && !COMMON_TRIGGER_STOPWORDS.has(token);
   235	}
   236	
   237	function extractTriggerIndexKeys(text: string): string[] {
   238	  const normalized = normalizeTriggerText(text);
   239	  if (!normalized) {
   240	    return [];
   241	  }
   242	
   243	  const rawTokens = getUnicodeTokens(normalized);
   244	  const tokens = rawTokens.filter(isSignificantIndexToken);
   245	  const basis = tokens.length > 0 ? tokens : rawTokens;
   246	  const keys = new Set<string>();
   247	
   248	  for (const token of basis) {
   249	    if (token) {
   250	      keys.add(token);

 succeeded in 0ms:
   610	    cachedEmbedding = effectiveEmbedding;
   611	
   612	    if (!effectiveEmbedding) {
   613	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
   614	    }
   615	
   616	    // Deep mode: expand query into variants and run hybrid for each, then dedup
   617	    if (mode === 'deep' && isMultiQueryEnabled()) {
   618	      // -- D2 REQ-D2-001: Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) ---
   619	      //
   620	      // When enabled and the query is multi-faceted, decompose into up to 3
   621	      // sub-query facets and run hybrid search per facet. Results are merged
   622	      // by facet coverage (items appearing in multiple facets rank higher).
   623	      //
   624	      // This block takes the place of the synonym-expansion path below when
   625	      // decomposition fires. If decomposition is disabled, not applicable, or
   626	      // fails, execution falls through to the existing expansion logic.
   627	
   628	      if (isQueryDecompositionEnabled() && isMultiFacet(query)) {
   629	        try {
   630	          const normalizedQuery = normalizeFacetText(query);
   631	          let facets: string[] = [];
   632	
   633	          try {
   634	            facets = buildQueryDecompositionPool(query, mode)
   635	              .filter((facet) => facet !== normalizedQuery)
   636	              .map(normalizeFacetText)
   637	              .filter((facet) => facet.length > 0);
   638	          } catch (facetErr: unknown) {
   639	            const facetMsg = facetErr instanceof Error ? facetErr.message : String(facetErr);
   640	            console.warn(
   641	              `[stage1-candidate-gen] D2 faceted query decomposition failed, falling back to basic decomposition: ${facetMsg}`
   642	            );
   643	          }
   644	
   645	          if (facets.length === 0) {
   646	            facets = decompose(query)
   647	              .map(normalizeFacetText)
   648	              .filter((facet) => facet.length > 0 && facet !== normalizedQuery);
   649	          }
   650	
   651	          facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
   652	
   653	          if (facets.length > 0) {
   654	            // Run hybrid for the original query plus each facet, in parallel
   655	            const allQueries = [query, ...facets];
   656	            // FIX #7: Use Promise.allSettled so one failing facet branch
   657	            // does not discard results from all other branches.
   658	            const facetSettledResults = await withTimeout(
   659	              Promise.allSettled(
   660	                allQueries.map(async (q): Promise<PipelineRow[]> => {
   661	                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
   662	                  if (!facetEmbedding) {
   663	                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
   664	                    return [];
   665	                  }
   666	                  return hybridSearch.collectRawCandidates(
   667	                    q,
   668	                    facetEmbedding,
   669	                    { limit, specFolder, includeArchived }
   670	                  ) as Promise<PipelineRow[]>;
   671	                })
   672	              ),
   673	              DECOMPOSITION_TIMEOUT_MS,
   674	              'D2 facet decomposition',
   675	            );
   676	            const facetResultSets = facetSettledResults.map((result, idx) => {
   677	              if (result.status === 'fulfilled') return result.value;
   678	              console.warn(`[stage1-candidate-gen] D2 facet branch ${idx} rejected: ${result.reason}`);
   679	              return [] as PipelineRow[];
   680	            });
   681	
   682	            channelCount = allQueries.length;
   683	            const pools = allQueries.map((q, i) => ({
   684	              query: q,
   685	              results: facetResultSets[i] ?? [],
   686	            }));
   687	            candidates = mergeFacetCoveragePools(pools);
   688	
   689	            if (trace) {
   690	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   691	                channel: 'd2-query-decomposition',
   692	                originalQuery: query,
   693	                facets,
   694	                facetCount: facets.length,
   695	              });
   696	            }
   697	
   698	            // Skip the standard deep-mode expansion path below
   699	            // (jump to post-channel processing via the else-if chain)
   700	          }
   701	        } catch (decompErr: unknown) {
   702	          const decompMsg = decompErr instanceof Error ? decompErr.message : String(decompErr);
   703	          console.warn(
   704	            `[stage1-candidate-gen] D2 query decomposition failed, falling through to expansion: ${decompMsg}`
   705	          );
   706	          // Fall through to standard deep expansion path below (candidates is empty)
   707	        }
   708	      }
   709	
   710	      // Only run existing expansion logic when decomposition did not produce results
   711	      if (candidates.length === 0) {
   712	
   713	      const queryVariants = await buildDeepQueryVariants(query);
   714	
   715	      if (queryVariants.length > 1) {
   716	        try {
   717	          // F1: Wrap parallel variant searches with latency budget.
   718	          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
   719	          // FIX #7: Use Promise.allSettled so one failing variant does not
   720	          // discard results from all other variant branches.
   721	          const variantSettledResults = await withTimeout(
   722	            Promise.allSettled(
   723	              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
   724	                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
   725	                if (!variantEmbedding) {
   726	                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
   727	                  return [];
   728	                }
   729	                const variantResults = await hybridSearch.collectRawCandidates(
   730	                  variant,
   731	                  variantEmbedding,
   732	                  { limit, specFolder, includeArchived }
   733	                );
   734	                return variantResults as PipelineRow[];
   735	              })
   736	            ),
   737	            DEEP_EXPANSION_TIMEOUT_MS,
   738	            'Deep-mode query expansion',
   739	          );
   740	          const variantResultSets: PipelineRow[][] = variantSettledResults.map((result, idx) => {
   741	            if (result.status === 'fulfilled') return result.value;
   742	            console.warn(`[stage1-candidate-gen] Deep variant branch ${idx} rejected: ${result.reason}`);
   743	            return [] as PipelineRow[];
   744	          });
   745	
   746	          channelCount = queryVariants.length;
   747	
   748	          // Merge variant results, deduplicate by id, preserve first-occurrence order
   749	          candidates = mergeCandidateBatches(
   750	            variantResultSets.map((rows, index) => ({
   751	              label: queryVariants[index] ?? `deep-variant-${index}`,
   752	              rows,
   753	            })),
   754	          );
   755	        } catch (expandErr: unknown) {
   756	          const expandMsg =
   757	            expandErr instanceof Error ? expandErr.message : String(expandErr);
   758	          console.warn(
   759	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
   760	          );
   761	          // Fall through to single hybrid search below
   762	          channelCount = 1;
   763	          candidates = (await hybridSearch.collectRawCandidates(
   764	            query,
   765	            effectiveEmbedding,
   766	            { limit, specFolder, includeArchived }
   767	          )) as PipelineRow[];
   768	        }
   769	      } else {
   770	        // ExpandQuery returned only the original; treat as standard hybrid
   771	        channelCount = 1;
   772	        candidates = (await hybridSearch.collectRawCandidates(
   773	          query,
   774	          effectiveEmbedding,
   775	          { limit, specFolder, includeArchived }
   776	        )) as PipelineRow[];
   777	      }
   778	
   779	      } // end: if (candidates.length === 0)
   780	    } else {
   781	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
   782	      //
   783	      // When R12 is enabled and R15 does not classify the query as "simple",
   784	      // We expand the query using embedding similarity to find related terms
   785	      // From the memory index. The expanded query is used as an additional
   786	      // Hybrid search channel whose results are merged with the baseline.
   787	      //
   788	      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
   789	      // The query as "simple", suppressing expansion with zero added latency.
   790	
   791	      let r12ExpansionApplied = false;
   792	
   793	      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
   794	        try {
   795	          // ExpandQueryWithEmbeddings requires a Float32Array; the effective
   796	          // Embedding may be a number[] when generated by some providers, so
   797	          // Convert if necessary before passing it in.
   798	          const expansionEmbedding: Float32Array =
   799	            effectiveEmbedding instanceof Float32Array
   800	              ? effectiveEmbedding
   801	              : Float32Array.from(effectiveEmbedding as number[]);
   802	
   803	          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
   804	            limit: DEFAULT_EXPANSION_CANDIDATE_LIMIT,
   805	          });
   806	
   807	          // Only run an extra channel if the expansion actually produced new terms
   808	          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
   809	            // Run the baseline and the expanded query in parallel
   810	            const [baselineResults, expansionResults] = await Promise.all([
   811	              hybridSearch.collectRawCandidates(
   812	                query,
   813	                effectiveEmbedding,
   814	                { limit, specFolder, includeArchived }
   815	              ).catch((err: unknown): PipelineRow[] => {
   816	                console.warn(
   817	                  '[stage1-candidate-gen] Baseline candidate collection failed:',
   818	                  err instanceof Error ? err.message : String(err)
   819	                );
   820	                return [];
   821	              }),
   822	              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
   823	                async (expandedEmb): Promise<PipelineRow[]> => {
   824	                  if (!expandedEmb) {
   825	                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
   826	                    return [];
   827	                  }
   828	                  return hybridSearch.collectRawCandidates(
   829	                    expanded.combinedQuery,
   830	                    expandedEmb,
   831	                    { limit, specFolder, includeArchived }
   832	                  ) as Promise<PipelineRow[]>;
   833	                }
   834	              ).catch((err: unknown): PipelineRow[] => {
   835	                console.warn(
   836	                  '[stage1-candidate-gen] Expansion candidate collection failed:',
   837	                  err instanceof Error ? err.message : String(err)
   838	                );
   839	                return [];
   840	              }),
   841	            ]);
   842	
   843	            channelCount = 2;
   844	            r12ExpansionApplied = true;
   845	
   846	            // Merge both result sets, deduplicate by id, baseline-first ordering
   847	            // So baseline scores dominate when the same memory appears in both.
   848	            candidates = mergeCandidateBatches([
   849	              { label: query, rows: baselineResults as PipelineRow[] },
   850	              { label: expanded.combinedQuery, rows: expansionResults as PipelineRow[] },
   851	            ]);
   852	
   853	            if (trace) {
   854	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   855	                channel: 'r12-embedding-expansion',
   856	                expandedTerms: expanded.expanded,
   857	                combinedQuery: expanded.combinedQuery,
   858	              });
   859	            }
   860	          }
   861	        } catch (r12Err: unknown) {
   862	          const r12Msg = r12Err instanceof Error ? r12Err.message : String(r12Err);
   863	          console.warn(
   864	            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
   865	          );
   866	        }
   867	      }
   868	
   869	      // Standard hybrid search — runs when R12 is off, suppressed by R15,
   870	      // Or produced no results (candidates still empty from the try block above).
   871	      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
   872	      if (!r12ExpansionApplied) {
   873	        try {
   874	          channelCount = 1;
   875	          const hybridResults = (await hybridSearch.collectRawCandidates(
   876	            effectiveQuery,
   877	            effectiveEmbedding,
   878	            { limit, specFolder, includeArchived }
   879	          )) as PipelineRow[];
   880	          candidates = hybridResults;
   881	        } catch (hybridErr: unknown) {
   882	          const hybridMsg =
   883	            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
   884	          console.warn(
   885	            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
   886	          );
   887	
   888	          // Fallback: pure vector search
   889	          channelCount = 1;
   890	          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   891	            limit,
   892	            specFolder,
   893	            tier,
   894	            contextType,
   895	            includeConstitutional: false, // Constitutional managed separately below
   896	            includeArchived,
   897	          }) as PipelineRow[];
   898	          if (isTemporalContiguityEnabled()) {
   899	            vectorResults = (
   900	              vectorSearchWithContiguity(
   901	                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   902	                3600,
   903	              ) as PipelineRow[] | null
   904	            ) ?? vectorResults;
   905	          }
   906	          candidates = vectorResults;
   907	
   908	          if (trace) {
   909	            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
   910	              reason: hybridMsg,
   911	              channel: 'vector',
   912	            });
   913	          }
   914	        }
   915	      }
   916	    }
   917	  }
   918	
   919	  // -- Channel: Vector ---------------------------------------------------------
   920	
   921	  else if (searchType === 'vector') {
   922	    const effectiveEmbedding: Float32Array | number[] | null =
   923	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   924	
   925	    if (!effectiveEmbedding) {
   926	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
   927	    }
   928	
   929	    channelCount = 1;
   930	    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   931	      limit,
   932	      specFolder,
   933	      tier,
   934	      contextType,
   935	      includeConstitutional: false, // Constitutional managed separately below
   936	      includeArchived,
   937	    }) as PipelineRow[];
   938	    if (isTemporalContiguityEnabled()) {
   939	      vectorResults = (
   940	        vectorSearchWithContiguity(

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '760,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   760	    limit: options.limit || 8,
   761	    includeConstitutional: true,
   762	    includeContent: options.includeContent || false,
   763	    includeTrace: options.includeTrace || false, // CHK-040
   764	    anchors: options.anchors,
   765	    sessionId: options.sessionId,
   766	    sessionTransition: options.sessionTransition,
   767	    enableDedup: options.enableDedup !== false,
   768	    profile: options.profile,
   769	    intent: intent ?? undefined,
   770	    autoDetectIntent: intent ? false : true,
   771	    useDecay: true,
   772	    // minState omitted — memoryState column not yet in schema
   773	  });
   774	
   775	  return {
   776	    strategy: 'focused',
   777	    mode: 'focused',
   778	    intent: intent,
   779	    ...result
   780	  };
   781	}
   782	
   783	async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   784	  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
   785	
   786	  const result = await handleMemorySearch({
   787	    query: input || 'resume work continue session',
   788	    specFolder: options.specFolder,
   789	    folderBoost: options.folderBoost,
   790	    tenantId: options.tenantId,
   791	    userId: options.userId,
   792	    agentId: options.agentId,
   793	    sharedSpaceId: options.sharedSpaceId,
   794	    limit: options.limit || 5,
   795	    includeConstitutional: false,
   796	    includeContent: true,
   797	    includeTrace: options.includeTrace || false, // CHK-040
   798	    anchors: resumeAnchors,
   799	    sessionId: options.sessionId,
   800	    sessionTransition: options.sessionTransition,
   801	    enableDedup: false,
   802	    profile: options.profile,
   803	    intent: intent ?? undefined,
   804	    autoDetectIntent: intent ? false : true,
   805	    useDecay: false,
   806	    // minState omitted — memoryState column not yet in schema
   807	  });
   808	
   809	  return {
   810	    strategy: 'resume',
   811	    mode: 'resume',
   812	    resumeAnchors: resumeAnchors,
   813	    ...result
   814	  };
   815	}
   816	
   817	/* ───────────────────────────────────────────────────────────────
   818	   6. HANDLER HELPERS
   819	──────────────────────────────────────────────────────────────── */
   820	
   821	function resolveSessionLifecycle(
   822	  args: ContextArgs,
   823	  db: ReturnType<typeof vectorIndex.getDb> | null,
   824	): SessionLifecycleResolution {
   825	  void db;
   826	
   827	  // Security: session scope derived from server context, not caller input
   828	  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
   829	    tenantId: args.tenantId,
   830	    userId: args.userId,
   831	    agentId: args.agentId,
   832	  });
   833	  if (trustedSession.error) {
   834	    return {
   835	      requestedSessionId: trustedSession.requestedSessionId,
   836	      effectiveSessionId: '',
   837	      resumed: false,
   838	      priorMode: null,
   839	      counter: 0,
   840	      error: trustedSession.error,
   841	    };
   842	  }
   843	
   844	  const requestedSessionId = trustedSession.requestedSessionId;
   845	  const effectiveSessionId = trustedSession.effectiveSessionId;
   846	  const resumed = trustedSession.trusted;
   847	  const priorMode = resumed
   848	    ? workingMemory.getSessionInferredMode(effectiveSessionId)
   849	    : null;
   850	  const counter = resumed
   851	    ? workingMemory.getSessionEventCounter(effectiveSessionId)
   852	    : 0;
   853	
   854	  return {
   855	    requestedSessionId,
   856	    effectiveSessionId,
   857	    resumed,
   858	    priorMode,
   859	    counter,
   860	  };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '900,1040p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   900	    for (const result of accessedResults) {
   901	      insertAdaptiveSignal.run(
   902	        result.id,
   903	        'access',
   904	        1.0,
   905	        query || '',
   906	        '',
   907	        '{}',
   908	      );
   909	    }
   910	  });
   911	
   912	  try {
   913	    writeAdaptiveSignals(results);
   914	  } catch (err: unknown) {
   915	    // Adaptive signal capture must never block the core search pipeline.
   916	    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
   917	  }
   918	}
   919	
   920	// -- Main Stage 2 entry point --
   921	
   922	/**
   923	 * Execute Stage 2: Fusion + Signal Integration.
   924	 *
   925	 * This is the SINGLE authoritative point where all scoring signals are
   926	 * applied. The ordering is fixed and must not be changed without updating
   927	 * the architectural documentation (see types.ts Stage2 comment block).
   928	 *
   929	 * Signal application order (13 steps):
   930	 *   1.  Session boost      (hybrid only — working memory attention)
   931	 *   1a. Recency fusion     (all types — time-decay bonus)
   932	 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
   933	 *   2a. Co-activation      (spreading activation from top-N seeds)
   934	 *   2b. Community boost    (N2c — inject co-members)
   935	 *   2c. Graph signals      (N2a+N2b — momentum + depth)
   936	 *   3.  Testing effect     (all types, when trackAccess = true)
   937	 *   4.  Intent weights     (non-hybrid only — G2 prevention)
   938	 *   5.  Artifact routing   (all types, when routing confidence > 0)
   939	 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
   940	 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
   941	 *   8.  Anchor metadata    (annotation — no score mutation)
   942	 *   9.  Validation metadata (spec quality signals + quality scoring)
   943	 *
   944	 * @param input - Stage 2 input containing candidates and pipeline config
   945	 * @returns Stage 2 output with scored results and per-signal metadata
   946	 */
   947	export async function executeStage2(input: Stage2Input): Promise<Stage2Output> {
   948	  const { candidates, config } = input;
   949	  const start = Date.now();
   950	
   951	  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
   952	    sessionBoostApplied: 'off',
   953	    causalBoostApplied: 'off',
   954	    intentWeightsApplied: 'off',
   955	    artifactRoutingApplied: 'off',
   956	    feedbackSignalsApplied: 'off',
   957	    graphContribution: {
   958	      killSwitchActive: !isGraphUnifiedEnabled(),
   959	      causalBoosted: 0,
   960	      coActivationBoosted: 0,
   961	      communityInjected: 0,
   962	      graphSignalsBoosted: 0,
   963	      totalGraphInjected: 0,
   964	      rolloutState: resolveGraphWalkRolloutState(),
   965	    },
   966	    qualityFiltered: 0,
   967	    durationMs: 0,
   968	  };
   969	
   970	  // FIX #3: Deep clone candidates so in-place mutations (e.g., syncScoreAliasesInPlace)
   971	  // cannot corrupt the original Stage 1 output. A shallow copy ([...candidates]) shares
   972	  // the same row objects, creating a race condition if the orchestrator's timeout fallback
   973	  // uses the original Stage 1 candidates array.
   974	  let results: PipelineRow[] = candidates.map(row => ({ ...row }));
   975	  const isHybrid = config.searchType === 'hybrid';
   976	
   977	  // -- 1. Session boost --
   978	  // Only for hybrid search type — session attention signals are most meaningful
   979	  // When the full hybrid result set is available for ordering.
   980	  if (isHybrid && config.enableSessionBoost && config.sessionId) {
   981	    try {
   982	      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
   983	        results,
   984	        config.sessionId
   985	      );
   986	      results = boosted as PipelineRow[];
   987	      // FIX #4: Sync aliases immediately after session boost score mutations
   988	      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
   989	      syncScoreAliasesInPlace(results);
   990	      metadata.sessionBoostApplied = sbMeta.applied ? 'applied' : 'enabled';
   991	    } catch (err: unknown) {
   992	      const message = err instanceof Error ? err.message : String(err);
   993	      console.warn(`[stage2-fusion] session boost failed: ${message}`);
   994	      metadata.sessionBoostApplied = 'failed';
   995	    }
   996	  }
   997	
   998	  // -- 1a. Recency fusion --
   999	  // Applies a time-decay bonus to each candidate based on its created_at timestamp.
  1000	  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
  1001	  // Bonus is capped at RECENCY_FUSION_CAP and clamped to keep score in [0, 1].
  1002	  try {
  1003	    let recencyBoostedCount = 0;
  1004	    results = results.map((row) => {
  1005	      const recencyTimestamp = (row.created_at as string | undefined) ?? '';
  1006	      const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
  1007	      if (!recencyTimestamp) return row;
  1008	
  1009	      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
  1010	      const bonus = Math.min(RECENCY_FUSION_CAP, recencyScore * RECENCY_FUSION_WEIGHT);
  1011	      if (bonus <= 0) return row;
  1012	
  1013	      const baseScore = resolveBaseScore(row);
  1014	      const boostedScore = Math.min(1.0, baseScore + bonus);
  1015	      if (boostedScore === baseScore) return row;
  1016	
  1017	      recencyBoostedCount++;
  1018	      return withSyncedScoreAliases(row, boostedScore);
  1019	    });
  1020	    if (recencyBoostedCount > 0) {
  1021	      syncScoreAliasesInPlace(results);
  1022	      (metadata as Record<string, unknown>).recencyFusionApplied = true;
  1023	      (metadata as Record<string, unknown>).recencyFusionBoosted = recencyBoostedCount;
  1024	    }
  1025	  } catch (err: unknown) {
  1026	    const message = err instanceof Error ? err.message : String(err);
  1027	    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
  1028	  }
  1029	
  1030	  // -- 2. Causal boost --
  1031	  // Only for hybrid search type — causal graph traversal is seeded from the
  1032	  // Top results after session boost has re-ordered them.
  1033	  if (isHybrid && config.enableCausalBoost && isGraphUnifiedEnabled()) {
  1034	    try {
  1035	      const beforeScores = new Map(results.map((row) => [row.id, resolveBaseScore(row)]));
  1036	      const { results: boosted, metadata: cbMeta } = causalBoost.applyCausalBoost(results);
  1037	      results = (boosted as PipelineRow[]).map((row) => {
  1038	        const previous = beforeScores.get(row.id) ?? resolveBaseScore(row);
  1039	        const next = resolveBaseScore(row);
  1040	        return next !== previous

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '250,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   250	  memory: 1.0,
   251	  constitutional: 2.0,
   252	  scratch: 0.6,
   253	};
   254	
   255	// Pattern alignment bonus configuration
   256	export const PATTERN_ALIGNMENT_BONUSES: PatternAlignmentBonuses = {
   257	  exact_match: 0.3,
   258	  partial_match: 0.15,
   259	  semantic_threshold: 0.8,
   260	  anchor_match: 0.25,
   261	  type_match: 0.2,
   262	};
   263	
   264	// TM-01: Re-export interference penalty coefficient for test access
   265	export { INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';
   266	
   267	// ───────────────────────────────────────────────────────────────
   268	// 3. SCORE CALCULATIONS
   269	
   270	// ───────────────────────────────────────────────────────────────
   271	/**
   272	 * Parse last_accessed value that may be:
   273	 * - An ISO date string (new format from access-tracker)
   274	 * - A millisecond epoch number (legacy format)
   275	 * - null/undefined
   276	 * Returns epoch milliseconds or null.
   277	 */
   278	function parseLastAccessed(value: number | string | undefined | null): number | null {
   279	  if (value == null) return null;
   280	
   281	  // If it's already a number, treat as epoch ms directly
   282	  if (typeof value === 'number') return value;
   283	
   284	  // Try ISO string parse first
   285	  const parsed = Date.parse(value);
   286	  if (!isNaN(parsed)) return parsed;
   287	
   288	  // Maybe it's a stringified epoch number (legacy data)
   289	  const asNum = Number(value);
   290	  if (!isNaN(asNum) && asNum > 1e12) return asNum; // Reasonable ms epoch (after ~2001)
   291	
   292	  return null;
   293	}
   294	
   295	/**
   296	 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
   297	 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
   298	 */
   299	export function calculateRetrievabilityScore(row: ScoringInput): number {
   300	  const scheduler = getFsrsScheduler();
   301	  let stability = (row.stability as number | undefined) || 1.0;
   302	  if (!isFinite(stability)) stability = 1.0;
   303	  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
   304	  const contextType = typeof row.context_type === 'string'
   305	    ? row.context_type.toLowerCase()
   306	    : typeof row.contextType === 'string'
   307	      ? row.contextType.toLowerCase()
   308	      : 'general';
   309	  const tier = typeof row.importance_tier === 'string'
   310	    ? row.importance_tier.toLowerCase()
   311	    : 'normal';
   312	  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
   313	  // Aligned with fsrs-scheduler.ts:337 which uses the same !== 'false' convention.
   314	  const classificationDecayEnabled = process.env.SPECKIT_CLASSIFICATION_DECAY !== 'false';
   315	
   316	  // Return neutral 0.5 when no timestamp — prevents NaN propagation
   317	  if (!lastReview) {
   318	    return 0.5;
   319	  }
   320	
   321	  const timestamp = new Date(lastReview).getTime();
   322	  if (isNaN(timestamp)) return 0.5; // Neutral score for invalid dates
   323	
   324	  const elapsedMs = Date.now() - timestamp;
   325	  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
   326	
   327	  // TM-03: Classification decay applies at stability-level; when enabled do not
   328	  // Additionally apply elapsed-time tier multipliers to avoid double decay.
   329	  let adjustedStability = stability;
   330	  if (classificationDecayEnabled) {
   331	    if (scheduler?.applyClassificationDecay) {
   332	      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
   333	    } else {
   334	      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
   335	    }
   336	    if (!isFinite(adjustedStability)) {
   337	      return 1;
   338	    }
   339	  }
   340	
   341	  let adjustedElapsedDays = elapsedDays;
   342	  if (!classificationDecayEnabled) {
   343	    const tierMultiplier = scheduler?.TIER_MULTIPLIER?.[tier]
   344	      ?? RETRIEVABILITY_TIER_MULTIPLIER[tier]
   345	      ?? RETRIEVABILITY_TIER_MULTIPLIER.normal;
   346	    adjustedElapsedDays = elapsedDays * tierMultiplier;
   347	  }
   348	
   349	  adjustedStability = Math.max(0.001, adjustedStability);
   350	
   351	  if (scheduler && typeof scheduler.calculateRetrievability === 'function') {
   352	    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
   353	    return Number.isFinite(score) ? score : 0;
   354	  }
   355	
   356	  // Inline FSRS power-law formula used when fsrs-scheduler module unavailable
   357	  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);
   358	  const score = Math.max(0, Math.min(1, retrievability));
   359	  return Number.isFinite(score) ? score : 0;
   360	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { readFileSync } from "node:fs";
     2	import { visit } from "unist-util-visit";
     3	import { parseMarkdown, getHeadingAtLine, isNegatedSection } from "../markdown.js";
     4	import type { Claim } from "../types.js";
     5	import type { Root, Code, InlineCode, Strong, Text } from "mdast";
     6	
     7	const KNOWN_EXTENSIONS = /\.(ts|js|tsx|jsx|py|go|rs|rb|java|json|yaml|yml|toml|md|css|scss|html|vue|svelte|sh)$/;
     8	const COMMAND_PREFIXES = /^(npm|yarn|pnpm|bun|make|cargo|python|pip|go|node|npx|tsx)\s/;
     9	const DEPENDENCY_SECTION_PATTERNS = /key\s*libraries|core\s*technologies|dependencies|stack|tech/i;
    10	/** Paths with angle brackets or square brackets are template placeholders, not real paths */
    11	const TEMPLATE_PLACEHOLDER = /[<>\[\]{}]/;
    12	
    13	/** HTTP methods that indicate an API route, not a file path */
    14	const HTTP_METHOD_PREFIX = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\//;
    15	
    16	/** Things that look like paths but are actually code snippets, URL routes, or other non-path content */
    17	function isNotAPath(value: string): boolean {
    18	  // URL routes: /voice/incoming, /api/users — start with / but have no file extension
    19	  if (value.startsWith("/") && !KNOWN_EXTENSIONS.test(value)) return true;
    20	
    21	  // HTTP method + route: GET /api/bookmarks, POST /users/:id
    22	  if (HTTP_METHOD_PREFIX.test(value)) return true;
    23	
    24	  // Code snippets: contains =, (), ;, or other code-like characters
    25	  if (/[=();,]/.test(value)) return true;
    26	
    27	  // Quoted strings or attribute assignments: gather.action="...", foo="bar"
    28	  if (/["']/.test(value)) return true;
    29	
    30	  // Wildcard prefixes like *_streaming_client.py — patterns, not real paths
    31	  if (value.startsWith("*")) return true;
    32	
    33	  return false;
    34	}
    35	
    36	/** Extract all claims from a markdown file */
    37	export function extractClaims(filePath: string, source: string): Claim[] {
    38	  let content: string;
    39	  try {
    40	    content = readFileSync(filePath, "utf-8");
    41	  } catch {
    42	    return [];
    43	  }
    44	
    45	  const tree = parseMarkdown(content);
    46	  const claims: Claim[] = [];
    47	
    48	  // Extract from inline code
    49	  visit(tree, "inlineCode", (node: InlineCode) => {
    50	    const line = node.position?.start.line ?? 0;
    51	    const heading = getHeadingAtLine(tree, line);
    52	    const negated = isNegatedSection(heading);
    53	
    54	    // Path claims: contains / or ends in known extension
    55	    if (node.value.includes("/") || KNOWN_EXTENSIONS.test(node.value)) {
    56	      // Skip commands, template placeholders, and non-path content
    57	      if (!COMMAND_PREFIXES.test(node.value) && !TEMPLATE_PLACEHOLDER.test(node.value) && !isNotAPath(node.value)) {
    58	        claims.push({
    59	          kind: "path",
    60	          value: node.value,
    61	          source,
    62	          line,
    63	          section: heading,
    64	          negated,
    65	        });
    66	      }
    67	    }
    68	
    69	    // Command claims
    70	    if (COMMAND_PREFIXES.test(node.value)) {
    71	      claims.push({
    72	        kind: "command",
    73	        value: node.value,
    74	        source,
    75	        line,
    76	        section: heading,
    77	        negated,
    78	      });
    79	    }
    80	  });
    81	
    82	  // Extract from code blocks
    83	  visit(tree, "code", (node: Code) => {
    84	    const line = node.position?.start.line ?? 0;
    85	    const heading = getHeadingAtLine(tree, line);
    86	    const negated = isNegatedSection(heading);
    87	
    88	    // Each line of the code block could be a command
    89	    for (const codeLine of node.value.split("\n")) {
    90	      const trimmed = codeLine.trim();
    91	      if (COMMAND_PREFIXES.test(trimmed)) {
    92	        claims.push({
    93	          kind: "command",
    94	          value: trimmed,
    95	          source,
    96	          line,
    97	          section: heading,
    98	          negated,
    99	        });
   100	      }
   101	    }
   102	  });
   103	
   104	  // Extract dependencies from **BoldName** patterns in relevant sections
   105	  visit(tree, "strong", (node: Strong) => {
   106	    const line = node.position?.start.line ?? 0;
   107	    const heading = getHeadingAtLine(tree, line);
   108	    const negated = isNegatedSection(heading);
   109	
   110	    if (heading && DEPENDENCY_SECTION_PATTERNS.test(heading)) {
   111	      const text = getStrongText(node);
   112	      if (!text) return;
   113	
   114	      // Check for version pattern: "React 18" or "Node v20"
   115	      const versionMatch = text.match(/^(.+?)\s+[v^~>=<]*(\d[\d.]*\S*)$/);
   116	      if (versionMatch) {
   117	        claims.push({
   118	          kind: "dependency",
   119	          value: versionMatch[1].trim(),
   120	          source,
   121	          line,
   122	          section: heading,
   123	          negated,
   124	        });
   125	        claims.push({
   126	          kind: "version",
   127	          value: text,
   128	          source,
   129	          line,
   130	          section: heading,
   131	          negated,
   132	        });
   133	      } else {
   134	        claims.push({
   135	          kind: "dependency",
   136	          value: text,
   137	          source,
   138	          line,
   139	          section: heading,
   140	          negated,
   141	        });
   142	      }
   143	    }
   144	  });
   145	
   146	  return claims;
   147	}
   148	
   149	function getStrongText(node: Strong): string | null {
   150	  const textNode = node.children.find(
   151	    (c): c is Text => c.type === "text"
   152	  );
   153	  return textNode?.value ?? null;
   154	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	<div align="center">
     2	
     3	<img src="mascot/mex-mascot.svg" alt="mex mascot" width="80">
     4	
     5	```
     6	  ███╗   ███╗███████╗██╗  ██╗
     7	  ████╗ ████║██╔════╝╚██╗██╔╝
     8	  ██╔████╔██║█████╗   ╚███╔╝
     9	  ██║╚██╔╝██║██╔══╝   ██╔██╗
    10	  ██║ ╚═╝ ██║███████╗██╔╝ ██╗
    11	  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
    12	```
    13	
    14	**mex**
    15	
    16	[![CI](https://github.com/theDakshJaitly/mex/actions/workflows/ci.yml/badge.svg)](https://github.com/theDakshJaitly/mex/actions/workflows/ci.yml)
    17	[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
    18	[![npm version](https://img.shields.io/npm/v/promexeus.svg)](https://www.npmjs.com/package/promexeus)
    19	
    20	</div>
    21	
    22	---
    23	
    24	AI agents forget everything between sessions. mex gives them permanent, navigable project memory.
    25	
    26	Every session starts cold:
    27	
    28	- The agent has **no idea** what it built yesterday
    29	- It forgets the conventions you agreed on
    30	- It doesn't know what broke last week
    31	
    32	Developers compensate by stuffing everything into CLAUDE.md — but that floods the context window, burns tokens, and degrades attention. Meanwhile, the project changes and nobody updates the docs. The agent's understanding drifts from reality.
    33	
    34	mex is a structured markdown scaffold with a CLI that keeps it honest. The scaffold gives agents persistent project knowledge through navigable files — architecture, conventions, decisions, patterns. The CLI detects when those files drift from the actual codebase, and targets AI to fix only what's broken. The scaffold grows automatically — after every task, the agent updates project state and creates patterns from real work.
    35	
    36	Works with any stack — JavaScript, Python, Go, Rust, and more.
    37	
    38	## Star History
    39	
    40	[![Star History Chart](https://api.star-history.com/svg?repos=theDakshJaitly/mex&type=Timeline)](https://star-history.com/#theDakshJaitly/mex&Timeline)
    41	
    42	## Install
    43	
    44	The npm package is named `promexeus` (our social handle — `mex` was taken on npm). The CLI command is `mex`.
    45	
    46	```bash
    47	npx promexeus setup
    48	```
    49	
    50	That's it. The setup command creates the `.mex/` scaffold, asks which AI tool you use, pre-scans your codebase, and generates a targeted prompt to populate everything. Takes about 5 minutes.
    51	
    52	At the end of setup, you'll be asked to install mex globally. If you accept:
    53	
    54	```bash
    55	mex check        # drift score
    56	mex sync         # fix drift
    57	```
    58	
    59	If you skip global install, everything still works via npx:
    60	
    61	```bash
    62	npx promexeus check        # drift score
    63	npx promexeus sync         # fix drift
    64	```
    65	
    66	You can install globally later at any time:
    67	
    68	```bash
    69	npm install -g promexeus
    70	```
    71	
    72	## Drift Detection
    73	
    74	Eight checkers validate your scaffold against the real codebase. Zero tokens, zero AI.
    75	
    76	| Checker | What it catches |
    77	|---------|----------------|
    78	| **path** | Referenced file paths that don't exist on disk |
    79	| **edges** | YAML frontmatter edge targets pointing to missing files |
    80	| **index-sync** | `patterns/INDEX.md` out of sync with actual pattern files |
    81	| **staleness** | Scaffold files not updated in 30+ days or 50+ commits |
    82	| **command** | `npm run X` / `make X` referencing scripts that don't exist |
    83	| **dependency** | Claimed dependencies missing from `package.json` |
    84	| **cross-file** | Same dependency with different versions across files |
    85	| **script-coverage** | `package.json` scripts not mentioned in any scaffold file |
    86	
    87	Scoring: starts at 100. Deducts -10 per error, -3 per warning, -1 per info.
    88	
    89	<!-- TODO: Add screenshot of `mex check` terminal output here -->
    90	![mex check output](screenshots/mex-check.jpg) 
    91	
    92	## CLI
    93	
    94	All commands run from your **project root**. If you didn't install globally, replace `mex` with `npx promexeus`.
    95	
    96	### Commands
    97	
    98	| Command | What it does |
    99	|---------|-------------|
   100	| `mex setup` | First-time setup — create `.mex/` scaffold and populate with AI |
   101	| `mex setup --dry-run` | Preview what setup would do without making changes |
   102	| `mex check` | Run all 8 checkers, output drift score and issues |
   103	| `mex check --quiet` | One-liner: `mex: drift score 92/100 (1 warning)` |
   104	| `mex check --json` | Full report as JSON for programmatic use |
   105	| `mex check --fix` | Check and jump straight to sync if errors found |
   106	| `mex sync` | Detect drift → choose mode → AI fixes → verify → repeat |
   107	| `mex sync --dry-run` | Preview targeted prompts without executing |
   108	| `mex sync --warnings` | Include warning-only files in sync |
   109	| `mex init` | Pre-scan codebase, build structured brief for AI |
   110	| `mex init --json` | Raw scanner brief as JSON |
   111	| `mex watch` | Install post-commit hook (silent on perfect score) |
   112	| `mex watch --uninstall` | Remove the hook |
   113	| `mex commands` | List all commands and scripts with descriptions |
   114	
   115	
   116	![mex sync output](screenshots/mex-sync.jpg)
   117	
   118	Running check after drift is fixed by sync
   119	
   120	![mex check after](screenshots/mex-check1.jpg)
   121	
   122	## Before / After
   123	
   124	Real output from testing mex on Agrow, an AI-powered agricultural voice helpline (Python/Flask, Twilio, multi-provider pipeline).
   125	
   126	**Scaffold before setup:**
   127	```markdown
   128	## Current Project State
   129	<!-- What is working. What is not yet built. Known issues.
   130	     Update this section whenever significant work is completed. -->
   131	```
   132	
   133	**Scaffold after setup:**
   134	```markdown
   135	## Current Project State
   136	
   137	**Working:**
   138	- Voice call pipeline (Twilio → STT → LLM → TTS → response)
   139	- Multi-provider STT (ElevenLabs, Deepgram) with configurable selection
   140	- RAG system with Supabase pgvector for agricultural knowledge retrieval
   141	- Streaming pipeline with barge-in support
   142	
   143	**Not yet built:**
   144	- Admin dashboard for call monitoring
   145	- Automated test suite
   146	- Multi-turn conversation memory across calls
   147	
   148	**Known issues:**
   149	- Sarvam AI STT bypass active — routing to ElevenLabs as fallback
   150	```
   151	
   152	**Patterns directory after setup:**
   153	```
   154	patterns/
   155	├── add-api-client.md       # Steps, gotchas, verify checklist for new service clients
   156	├── add-language-support.md  # How to extend the 8-language voice pipeline
   157	├── debug-pipeline.md        # Where to look when a call fails at each stage
   158	└── add-rag-documents.md     # How to ingest new agricultural knowledge
   159	```
   160	
   161	## Real World Results
   162	
   163	Independently tested by a community member on **OpenClaw** across 10 structured scenarios on a homelab setup (Ubuntu 24.04, Kubernetes, Docker, Ansible, Terraform, networking, monitoring). 10/10 tests passed. Drift score: 100/100.
   164	
   165	**Token usage before vs after mex:**
   166	
   167	| Scenario | Without mex | With mex | Saved |
   168	|----------|------------|---------|-------|
   169	| "How does K8s work?" | ~3,300 tokens | ~1,450 tokens | 56% |
   170	| "Open UFW port" | ~3,300 tokens | ~1,050 tokens | 68% |
   171	| "Explain Docker" | ~3,300 tokens | ~1,100 tokens | 67% |
   172	| Multi-context query | ~3,300 tokens | ~1,650 tokens | 50% |
   173	
   174	**~60% average token reduction per session.**
   175	
   176	Context is no longer all-or-nothing — loaded on demand, only what's relevant.
   177	
   178	## How It Works
   179	
   180	```
   181	Session starts
   182	    ↓
   183	Agent loads CLAUDE.md (auto-loaded, lives at project root)
   184	    ↓
   185	CLAUDE.md says "Read .mex/ROUTER.md before doing anything"
   186	    ↓
   187	ROUTER.md routing table → loads relevant context file for this task
   188	    ↓
   189	context file → points to pattern file if task-specific guidance exists
   190	    ↓
   191	Agent executes with full project context, minimal token cost
   192	    ↓
   193	After task: agent updates scaffold (GROW step)
   194	    ↓
   195	New patterns, updated project state — scaffold grows from real work
   196	```
   197	
   198	CLAUDE.md stays at ~120 tokens. The agent navigates to only what it needs. After every task, the agent updates the scaffold — creating patterns from new task types, updating project state, fixing stale context. The scaffold compounds over time.
   199	
   200	## File Structure
   201	
   202	```
   203	your-project/
   204	├── CLAUDE.md              ← auto-loaded by tool, points to .mex/
   205	├── .mex/
   206	│   ├── ROUTER.md          ← routing table, session bootstrap
   207	│   ├── AGENTS.md          ← always-loaded anchor (~150 tokens)
   208	│   ├── context/
   209	│   │   ├── architecture.md   # how components connect
   210	│   │   ├── stack.md           # technology choices and reasoning
   211	│   │   ├── conventions.md     # naming, structure, patterns
   212	│   │   ├── decisions.md       # append-only decision log
   213	│   │   └── setup.md           # how to run locally
   214	│   └── patterns/
   215	│       ├── INDEX.md           # pattern registry
   216	│       └── *.md               # task-specific guides with gotchas + verify checklists
   217	└── src/
   218	```
   219	
   220	## Multi-Tool Compatibility

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import type { MexConfig, ScannerBrief } from "../types.js";
     2	import { scanManifest } from "./manifest.js";
     3	import { scanEntryPoints } from "./entry-points.js";
     4	import { scanFolderTree } from "./folder-tree.js";
     5	import { scanTooling } from "./tooling.js";
     6	import { scanReadme } from "./readme.js";
     7	
     8	/** Run pre-analysis scan and return brief or prompt */
     9	export async function runScan(
    10	  config: MexConfig,
    11	  opts: { jsonOnly?: boolean }
    12	): Promise<ScannerBrief | string> {
    13	  const brief = buildBrief(config.projectRoot);
    14	
    15	  if (opts.jsonOnly) return brief;
    16	
    17	  return buildPrompt(brief);
    18	}
    19	
    20	/** Build the scanner brief from codebase analysis */
    21	function buildBrief(projectRoot: string): ScannerBrief {
    22	  return {
    23	    manifest: scanManifest(projectRoot),
    24	    entryPoints: scanEntryPoints(projectRoot),
    25	    folderTree: scanFolderTree(projectRoot),
    26	    tooling: scanTooling(projectRoot),
    27	    readme: scanReadme(projectRoot),
    28	    timestamp: new Date().toISOString(),
    29	  };
    30	}
    31	
    32	/** Build AI prompt with embedded brief */
    33	function buildPrompt(brief: ScannerBrief): string {
    34	  const briefJson = JSON.stringify(brief, null, 2);
    35	
    36	  return `Here is a pre-analyzed brief of the codebase — do NOT explore the filesystem yourself, reason from this brief:
    37	
    38	<brief>
    39	${briefJson}
    40	</brief>
    41	
    42	Using this brief, populate the mex scaffold files. Focus on:
    43	1. context/architecture.md — system components, data flow, integrations
    44	2. context/stack.md — technologies, versions, key libraries
    45	3. context/conventions.md — code patterns, naming, file organization
    46	4. context/decisions.md — architectural choices and their rationale
    47	5. context/setup.md — how to set up and run the project
    48	6. ROUTER.md — update the "Current Project State" section
    49	
    50	For each file, use the information from the brief rather than exploring the filesystem.
    51	Be precise about versions, paths, and dependencies — they come directly from the manifest.`;
    52	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { readFileSync, readdirSync, existsSync } from "node:fs";
     2	import { resolve, dirname, basename } from "node:path";
     3	import { globSync } from "glob";
     4	import { getGitDiff } from "../git.js";
     5	import type { SyncTarget } from "../types.js";
     6	
     7	/** Build a single combined prompt covering all targets */
     8	export async function buildCombinedBrief(
     9	  targets: SyncTarget[],
    10	  projectRoot: string
    11	): Promise<string> {
    12	  const sections: string[] = [];
    13	
    14	  for (const target of targets) {
    15	    sections.push(await buildFileSection(target, projectRoot));
    16	  }
    17	
    18	  return `The following scaffold files have drift issues that need fixing. Fix all of them in one pass.
    19	
    20	${sections.map((s, i) => `━━━ File ${i + 1}/${sections.length} ━━━\n\n${s}`).join("\n\n")}
    21	
    22	Update each file to fix its issues. Only change what's necessary — do not rewrite sections that are correct.
    23	When a referenced path no longer exists, find the correct current path from the filesystem context above and update the reference.`;
    24	}
    25	
    26	/** Build a targeted prompt for AI to fix a single file */
    27	export async function buildSyncBrief(
    28	  target: SyncTarget,
    29	  projectRoot: string
    30	): Promise<string> {
    31	  const section = await buildFileSection(target, projectRoot);
    32	
    33	  return `The following scaffold file has drift issues that need fixing:
    34	
    35	${section}
    36	
    37	Update the file to fix these issues. Only change what's necessary — do not rewrite sections that are correct.
    38	When a referenced path no longer exists, find the correct current path from the filesystem context above and update the reference.`;
    39	}
    40	
    41	/** Build the content section for a single target (no wrapper instructions) */
    42	async function buildFileSection(
    43	  target: SyncTarget,
    44	  projectRoot: string
    45	): Promise<string> {
    46	  const filePath = resolve(projectRoot, target.file);
    47	  let fileContent: string;
    48	  try {
    49	    fileContent = readFileSync(filePath, "utf-8");
    50	  } catch {
    51	    fileContent = "(file could not be read)";
    52	  }
    53	
    54	  const issueList = target.issues
    55	    .map((i) => `- [${i.severity}] ${i.code}: ${i.message}`)
    56	    .join("\n");
    57	
    58	  // Get git diff for paths referenced by this file's claims
    59	  const claimedPaths = target.issues
    60	    .filter((i) => i.claim?.kind === "path")
    61	    .map((i) => i.claim!.value);
    62	
    63	  const diff = claimedPaths.length
    64	    ? await getGitDiff(claimedPaths, projectRoot)
    65	    : target.gitDiff ?? "";
    66	
    67	  // For MISSING_PATH issues, find what actually exists nearby
    68	  const fileContext = buildFileContext(target, projectRoot);
    69	
    70	  let section = `**File:** ${target.file}
    71	
    72	**Issues found:**
    73	${issueList}
    74	
    75	**Current file content:**
    76	\`\`\`markdown
    77	${fileContent}
    78	\`\`\``;
    79	
    80	  if (fileContext) {
    81	    section += `
    82	
    83	**Filesystem context (what actually exists):**
    84	${fileContext}`;
    85	  }
    86	
    87	  if (diff) {
    88	    section += `
    89	
    90	**Recent git changes in referenced paths:**
    91	\`\`\`diff
    92	${diff}
    93	\`\`\``;
    94	  }
    95	
    96	  return section;
    97	}
    98	
    99	/** For missing path issues, list actual files in the relevant directories */
   100	function buildFileContext(
   101	  target: SyncTarget,
   102	  projectRoot: string
   103	): string | null {
   104	  const missingPaths = target.issues
   105	    .filter((i) => i.code === "MISSING_PATH" && i.claim?.kind === "path")
   106	    .map((i) => i.claim!.value);
   107	
   108	  if (missingPaths.length === 0) return null;
   109	
   110	  const sections: string[] = [];
   111	  const listedDirs = new Set<string>();
   112	
   113	  for (const missing of missingPaths) {
   114	    // Get the directory the missing file was expected in
   115	    const dir = missing.includes("/") ? dirname(missing) : ".";
   116	    const dirKey = dir === "." ? "root" : dir;
   117	
   118	    // List the directory contents (skip if already listed)
   119	    if (!listedDirs.has(dirKey)) {
   120	      listedDirs.add(dirKey);
   121	
   122	      const absDir = resolve(projectRoot, dir);
   123	      if (existsSync(absDir)) {
   124	        try {
   125	          const files = readdirSync(absDir)
   126	            .filter((f) => !f.startsWith("."))
   127	            .sort();
   128	          if (files.length > 0) {
   129	            sections.push(`\`${dir}/\` contains: ${files.join(", ")}`);
   130	          }
   131	        } catch {
   132	          // skip unreadable dirs
   133	        }
   134	      }
   135	    }
   136	
   137	    // Fuzzy search: find files with similar names anywhere in the project
   138	    const name = basename(missing);
   139	    const ext = name.includes(".") ? name.split(".").pop() : null;
   140	    if (ext) {
   141	      const matches = globSync(`**/*.${ext}`, {
   142	        cwd: projectRoot,
   143	        ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
   144	        maxDepth: 5,
   145	      });
   146	
   147	      if (matches.length > 0 && matches.length <= 20) {
   148	        sections.push(
   149	          `All \`.${ext}\` files in project: ${matches.join(", ")}`
   150	        );
   151	        // Only list once per extension
   152	        break;
   153	      }
   154	    }
   155	  }
   156	
   157	  return sections.length > 0 ? sections.join("\n") : null;
   158	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { readFileSync } from "node:fs";
     2	import { resolve, relative } from "node:path";
     3	import { globSync } from "glob";
     4	import type { MexConfig, DriftReport, DriftIssue, Claim } from "../types.js";
     5	import { extractClaims } from "./claims.js";
     6	import { parseFrontmatter } from "./frontmatter.js";
     7	import { computeScore } from "./scoring.js";
     8	import { checkPaths } from "./checkers/path.js";
     9	import { checkEdges } from "./checkers/edges.js";
    10	import { checkIndexSync } from "./checkers/index-sync.js";
    11	import { checkStaleness } from "./checkers/staleness.js";
    12	import { checkCommands } from "./checkers/command.js";
    13	import { checkDependencies } from "./checkers/dependency.js";
    14	import { checkCrossFile } from "./checkers/cross-file.js";
    15	import { checkScriptCoverage } from "./checkers/script-coverage.js";
    16	
    17	/** Run full drift detection across all scaffold files */
    18	export async function runDriftCheck(config: MexConfig): Promise<DriftReport> {
    19	  const { projectRoot, scaffoldRoot } = config;
    20	
    21	  // Find all markdown files in scaffold
    22	  const scaffoldFiles = findScaffoldFiles(projectRoot, scaffoldRoot);
    23	  const allClaims: Claim[] = [];
    24	  const allIssues: DriftIssue[] = [];
    25	
    26	  // Extract claims from all files
    27	  for (const filePath of scaffoldFiles) {
    28	    const source = relative(projectRoot, filePath);
    29	    const claims = extractClaims(filePath, source);
    30	    allClaims.push(...claims);
    31	  }
    32	
    33	  // Run checkers that work on individual files
    34	  for (const filePath of scaffoldFiles) {
    35	    const source = relative(projectRoot, filePath);
    36	
    37	    // Frontmatter edge check
    38	    const frontmatter = parseFrontmatter(filePath);
    39	    allIssues.push(
    40	      ...checkEdges(frontmatter, filePath, source, projectRoot, scaffoldRoot)
    41	    );
    42	
    43	    // Staleness check
    44	    const stalenessIssues = await checkStaleness(source, source, projectRoot);
    45	    allIssues.push(...stalenessIssues);
    46	  }
    47	
    48	  // Run checkers that work on claims
    49	  allIssues.push(...checkPaths(allClaims, projectRoot, scaffoldRoot));
    50	  allIssues.push(...checkCommands(allClaims, projectRoot));
    51	  allIssues.push(...checkDependencies(allClaims, projectRoot));
    52	  allIssues.push(...checkCrossFile(allClaims));
    53	
    54	  // Run structural checkers
    55	  allIssues.push(...checkIndexSync(projectRoot, scaffoldRoot));
    56	
    57	  // Run coverage checkers (reality → scaffold direction)
    58	  allIssues.push(...checkScriptCoverage(scaffoldFiles, projectRoot));
    59	
    60	  const score = computeScore(allIssues);
    61	
    62	  return {
    63	    score,
    64	    issues: allIssues,
    65	    filesChecked: scaffoldFiles.length,
    66	    timestamp: new Date().toISOString(),
    67	  };
    68	}
    69	
    70	/** Find all markdown files that are part of the scaffold */
    71	function findScaffoldFiles(
    72	  projectRoot: string,
    73	  scaffoldRoot: string
    74	): string[] {
    75	  const scaffoldPatterns = [
    76	    "context/*.md",
    77	    "patterns/*.md",
    78	    "ROUTER.md",
    79	    "AGENTS.md",
    80	    "SETUP.md",
    81	    "SYNC.md",
    82	  ];
    83	
    84	  const files: string[] = [];
    85	
    86	  // Search inside scaffold root (handles both .mex/ and root layouts)
    87	  for (const pattern of scaffoldPatterns) {
    88	    const matches = globSync(pattern, {
    89	      cwd: scaffoldRoot,
    90	      absolute: true,
    91	      ignore: ["node_modules/**"],
    92	    });
    93	    files.push(...matches);
    94	  }
    95	
    96	  // Also check project root for tool config files (CLAUDE.md, etc.)
    97	  if (scaffoldRoot !== projectRoot) {
    98	    for (const name of ["CLAUDE.md", ".cursorrules", ".windsurfrules"]) {
    99	      const matches = globSync(name, {
   100	        cwd: projectRoot,
   101	        absolute: true,
   102	        ignore: ["node_modules/**"],
   103	      });
   104	      files.push(...matches);
   105	    }
   106	  }
   107	
   108	  // Deduplicate
   109	  return [...new Set(files)];
   110	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '140,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   140	      'SELECT * FROM memory_index WHERE id = ?'
   141	    );
   142	    for (const id of memoryIds) {
   143	      const row = stmt.get(id) as TierInput | undefined;
   144	      if (row) {
   145	        records.set(row.id as number, row);
   146	      }
   147	    }
   148	  } catch (err: unknown) {
   149	    const message = toErrorMessage(err);
   150	    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
   151	  }
   152	
   153	  return records;
   154	}
   155	
   156	/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
   157	async function getTieredContent(
   158	  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
   159	  tier: string
   160	): Promise<string> {
   161	  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
   162	  try {
   163	    const fs = await import('fs');
   164	    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
   165	    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
   166	    const content = fs.readFileSync(canonicalPath, 'utf-8');
   167	    if (tier === 'HOT') return content;
   168	    // WARM tier returns truncated summary
   169	    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
   170	  } catch (_error: unknown) {
   171	    console.warn('[memory-triggers] getTieredContent failed', {
   172	      filePath: memoryInfo.filePath, // server-side only; safe to log
   173	      tier,
   174	      error: _error instanceof Error ? _error.message : String(_error),
   175	    });
   176	    return '';
   177	  }
   178	}
   179	
   180	/* ───────────────────────────────────────────────────────────────
   181	   3. MATCH TRIGGERS HANDLER
   182	──────────────────────────────────────────────────────────────── */
   183	
   184	/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
   185	async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
   186	  const {
   187	    prompt,
   188	    limit: rawLimit = 3,
   189	    session_id: rawSessionId,
   190	    turnNumber: rawTurnNumber = 1,
   191	    include_cognitive: includeCognitive = true
   192	  } = args;
   193	
   194	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
   195	  if (!prompt || typeof prompt !== 'string') {
   196	    return createMCPErrorResponse({
   197	      tool: 'memory_match_triggers',
   198	      error: 'prompt is required and must be a string',
   199	      code: 'E_VALIDATION',
   200	      details: { parameter: 'prompt' },
   201	      recovery: {
   202	        hint: 'Provide a non-empty string for the prompt parameter'
   203	      }
   204	    });
   205	  }
   206	
   207	  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
   208	  // manager to prevent IDOR. Callers cannot read/write working memory for
   209	  // arbitrary sessions — only server-minted or previously tracked sessions.
   210	  let sessionId: string | undefined = rawSessionId;
   211	  if (rawSessionId) {
   212	    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
   213	      tenantId: args.tenantId,
   214	      userId: args.userId,
   215	      agentId: args.agentId,
   216	    });
   217	    if (trustedSession.error) {
   218	      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
   219	      return createMCPErrorResponse({
   220	        tool: 'memory_match_triggers',
   221	        error: trustedSession.error,
   222	        code: 'E_SESSION_SCOPE',
   223	        details: { requestedSessionId: rawSessionId },
   224	        recovery: {
   225	          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
   226	        },
   227	      });
   228	    }
   229	    sessionId = trustedSession.effectiveSessionId;
   230	  }
   231	
   232	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   233	    ? Math.min(Math.floor(rawLimit), 50)
   234	    : 3;
   235	  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
   236	    ? Math.floor(rawTurnNumber)
   237	    : 1;
   238	
   239	  await checkDatabaseUpdated();
   240	

 succeeded in 0ms:
     1	---
     2	name: router
     3	description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
     4	edges:
     5	  - target: context/architecture.md
     6	    condition: when working on system design, integrations, or understanding how components connect
     7	  - target: context/stack.md
     8	    condition: when working with specific technologies, libraries, or making tech decisions
     9	  - target: context/conventions.md
    10	    condition: when writing new code, reviewing code, or unsure about project patterns
    11	  - target: context/decisions.md
    12	    condition: when making architectural choices or understanding why something is built a certain way
    13	  - target: context/setup.md
    14	    condition: when setting up the dev environment or running the project for the first time
    15	  - target: patterns/INDEX.md
    16	    condition: when starting a task — check the pattern index for a matching pattern file
    17	last_updated: [YYYY-MM-DD]
    18	---
    19	
    20	# Session Bootstrap
    21	
    22	If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.
    23	
    24	Then read this file fully before doing anything else in this session.
    25	
    26	## Current Project State
    27	<!-- What is working. What is not yet built. Known issues.
    28	     Update this section whenever significant work is completed.
    29	     This is the primary drift prevention mechanism — it re-grounds the agent every session.
    30	     Length: 3 sections (Working / Not Built / Known Issues), 3-7 items each.
    31	     Example:
    32	     **Working:**
    33	     - User authentication and session management
    34	     - Core CRUD operations for all main entities
    35	
    36	     **Not yet built:**
    37	     - Email notification system
    38	     - Admin dashboard
    39	
    40	     **Known issues:**
    41	     - Pagination breaks on filtered queries with more than 1000 results -->
    42	
    43	## Routing Table
    44	
    45	Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.
    46	
    47	| Task type | Load |
    48	|-----------|------|
    49	| Understanding how the system works | `context/architecture.md` |
    50	| Working with a specific technology | `context/stack.md` |
    51	| Writing or reviewing code | `context/conventions.md` |
    52	| Making a design decision | `context/decisions.md` |
    53	| Setting up or running the project | `context/setup.md` |
    54	| Any specific task | Check `patterns/INDEX.md` for a matching pattern |
    55	
    56	## Behavioural Contract
    57	
    58	For every task, follow this loop:
    59	
    60	1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it. Narrate what you load: "Loading architecture context..."
    61	2. **BUILD** — Do the work. If a pattern exists, follow its Steps. If you are about to deviate from an established pattern, say so before writing any code — state the deviation and why.
    62	3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
    63	4. **DEBUG** — If verification fails or something breaks, check `patterns/INDEX.md` for a debug pattern. Follow it. Fix the issue and re-run VERIFY.
    64	5. **GROW** — After completing the task:
    65	   - If no pattern exists for this task type, create one in `patterns/` using the format in `patterns/README.md`. Add it to `patterns/INDEX.md`. Flag it: "Created `patterns/<name>.md` from this session."
    66	   - If a pattern exists but you deviated from it or discovered a new gotcha, update it with what you learned.
    67	   - If any `context/` file is now out of date because of this work, update it surgically — do not rewrite entire files.
    68	   - Update the "Current Project State" section above if the work was significant.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: agents
     3	description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
     4	last_updated: [YYYY-MM-DD]
     5	---
     6	
     7	# [Project Name]
     8	
     9	## What This Is
    10	<!-- One sentence. What does this project do?
    11	     Length: 1 sentence maximum.
    12	     Not a tagline — a factual description of what the software does.
    13	     Example: "A REST API for managing inventory across multiple warehouse locations." -->
    14	
    15	## Non-Negotiables
    16	<!-- Hard rules the agent must never violate. Not preferences — rules.
    17	     These are the things that, if broken, cause real damage to the codebase.
    18	     Length: 3-5 items. More than 5 means the list has not been prioritised.
    19	     Example:
    20	     - Never write database queries outside of the repository layer
    21	     - Never commit secrets or API keys
    22	     - Always handle errors explicitly — no silent failures -->
    23	
    24	## Commands
    25	<!-- The exact commands needed to work on this project.
    26	     Include: run dev server, run tests, run linter, build.
    27	     Use the actual commands from this codebase — not placeholders.
    28	     For monorepos or projects with separate frontend/backend, group by area.
    29	     Target: keep this entire file under 150 tokens. For full-stack projects
    30	     with separate command sets, up to 200 tokens is acceptable.
    31	     Example:
    32	     - Dev: `npm run dev`
    33	     - Test: `npm test`
    34	     - Lint: `npm run lint`
    35	     - Build: `npm run build` -->
    36	
    37	## Scaffold Growth
    38	After every task: if no pattern exists for the task type you just completed, create one. If a pattern or context file is now out of date, update it. The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.
    39	
    40	## Navigation
    41	At the start of every session, read `ROUTER.md` before doing anything else.
    42	For full project context, patterns, and task guidance — everything is there.

codex
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: Spec Kit already implements an explicit hybrid contract, and it should stay hybrid by default
- **Source**: [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006)
- **What it does**: Query routing is tiered by complexity. Simple queries run `vector + fts`, moderate adds `bm25`, and complex runs all channels including graph and degree. Even for simple queries, BM25 is preserved when the artifact looks like `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, or `research`.
- **Why it matters**: The code already encodes the right intuition: semantic search is not the whole system, and lexical retrieval stays necessary for documentation-shaped and artifact-shaped questions.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Lexical retrieval is the authority lane for exact artifact lookup, titles, trigger phrases, commands, and file-shaped queries
- **Source**: [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L146), [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L157), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L156)
- **What it does**: FTS5 uses weighted BM25 with strong bias toward `title` and `trigger_phrases`, then generic content, then body. Query tokens are normalized and OR-joined for recall. Trigger matching separately builds regex-boundary and n-gram keyed lexical caches, then returns tiered content by HOT/WARM/COLD state.
- **Why it matters**: This lane will beat embeddings whenever the user really means “find this named thing”: packet IDs, exact docs, commands, script names, trigger phrases, title fragments, or path-like nouns. It is also more auditable and cheaper.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Semantic retrieval wins when the query is conceptual, multi-faceted, or uses vocabulary that does not appear verbatim in memory files
- **Source**: [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L781), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L869)
- **What it does**: Stage 1 expands and decomposes conceptual queries with facet decomposition, deep query variants, embedding-based expansion, concept expansion, and vector fallback. The system is designed to search beyond literal phrasing before fusion happens.
- **Why it matters**: This is where semantic beats lexical: “how does X work,” “what changed around Y,” “show me similar memory-quality failures,” and other language-mismatch questions. Lexical alone will under-recall in those cases.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: The best hybrid strategy is semantic candidate generation plus non-semantic reranking, not semantic search alone
- **Source**: [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L922), [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L295), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783)
- **What it does**: After retrieval, Stage 2 injects session attention, recency fusion, causal boost, co-activation, graph signals, artifact routing, feedback signals, and validation metadata. Separately, retrievability is scored with FSRS-style decay, and resume flows explicitly disable decay while anchoring to `state`, `next-steps`, `summary`, and `blockers`.
- **Why it matters**: The right architecture is not “semantic vs lexical” as a winner-take-all choice. It is “semantic for discovery, lexical for anchoring, graph for structure, temporal and session signals for ranking.” That is the real hybrid advantage.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex is strong lexical truth maintenance, not a competing semantic retrieval engine
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36)
- **What it does**: Mex extracts lexical claims from markdown: paths, commands, dependencies, versions, frontmatter edges, and pattern index membership. Its drift engine runs static checks across the scaffold and scores integrity issues without embeddings or vector search.
- **Why it matters**: Mex will beat semantic retrieval on “is this markdown claim still true?” because that is a static lexical verification problem. But it does not replace semantic memory search for conceptual recall.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Mex’s scanner and targeted sync show the right complement: lexical or structural grounding first, AI repair second
- **Source**: [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37)
- **What it does**: Mex first builds a structured brief from manifests, entry points, folder tree, tooling, and README, then tells AI to reason from that brief. During sync it only feeds flagged files, file-local issues, nearby filesystem context, and recent git diff.
- **Why it matters**: The transferable pattern is not “replace search with markdown.” It is “use lexical or structural evidence to narrow the surface, then let AI update only the broken slice.” That is an ideal companion to Spec Kit’s hybrid retrieval stack.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: The missing contract is explicit lane arbitration and user-visible attribution
- **Source**: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1684), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L28)
- **What it does**: Raw candidate collection already falls back from hybrid execution to FTS and then BM25. The lexical subsystem also tracks `lexicalPath` and failure states such as `missing_table` or `no_such_module_fts5`.
- **Why it matters**: We already have the mechanics of lane degradation, but not a strong outward contract explaining which lane dominated, which failed, and why a result should be trusted. That makes hybrid behavior harder to debug and tune.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.44

## Recommended Next Focus
Design a concrete retrieval policy matrix for Spec Kit Memory with four explicit outcomes: `lexical-first`, `semantic-first`, `hybrid-balanced`, and `graph-first`. Tie each mode to query classes, required result attribution, degradation behavior, and eval queries so we can prove when BM25/FTS should dominate, when embeddings should dominate, and when Mex-style static drift checks should run as a separate integrity layer rather than inside the recall stack.

hook: Stop
hook: Stop Completed
tokens used
112,158
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: Spec Kit already implements an explicit hybrid contract, and it should stay hybrid by default
- **Source**: [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006)
- **What it does**: Query routing is tiered by complexity. Simple queries run `vector + fts`, moderate adds `bm25`, and complex runs all channels including graph and degree. Even for simple queries, BM25 is preserved when the artifact looks like `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, or `research`.
- **Why it matters**: The code already encodes the right intuition: semantic search is not the whole system, and lexical retrieval stays necessary for documentation-shaped and artifact-shaped questions.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Lexical retrieval is the authority lane for exact artifact lookup, titles, trigger phrases, commands, and file-shaped queries
- **Source**: [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L146), [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L157), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L156)
- **What it does**: FTS5 uses weighted BM25 with strong bias toward `title` and `trigger_phrases`, then generic content, then body. Query tokens are normalized and OR-joined for recall. Trigger matching separately builds regex-boundary and n-gram keyed lexical caches, then returns tiered content by HOT/WARM/COLD state.
- **Why it matters**: This lane will beat embeddings whenever the user really means “find this named thing”: packet IDs, exact docs, commands, script names, trigger phrases, title fragments, or path-like nouns. It is also more auditable and cheaper.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Semantic retrieval wins when the query is conceptual, multi-faceted, or uses vocabulary that does not appear verbatim in memory files
- **Source**: [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L781), [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L869)
- **What it does**: Stage 1 expands and decomposes conceptual queries with facet decomposition, deep query variants, embedding-based expansion, concept expansion, and vector fallback. The system is designed to search beyond literal phrasing before fusion happens.
- **Why it matters**: This is where semantic beats lexical: “how does X work,” “what changed around Y,” “show me similar memory-quality failures,” and other language-mismatch questions. Lexical alone will under-recall in those cases.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: The best hybrid strategy is semantic candidate generation plus non-semantic reranking, not semantic search alone
- **Source**: [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L922), [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L295), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783)
- **What it does**: After retrieval, Stage 2 injects session attention, recency fusion, causal boost, co-activation, graph signals, artifact routing, feedback signals, and validation metadata. Separately, retrievability is scored with FSRS-style decay, and resume flows explicitly disable decay while anchoring to `state`, `next-steps`, `summary`, and `blockers`.
- **Why it matters**: The right architecture is not “semantic vs lexical” as a winner-take-all choice. It is “semantic for discovery, lexical for anchoring, graph for structure, temporal and session signals for ranking.” That is the real hybrid advantage.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex is strong lexical truth maintenance, not a competing semantic retrieval engine
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36)
- **What it does**: Mex extracts lexical claims from markdown: paths, commands, dependencies, versions, frontmatter edges, and pattern index membership. Its drift engine runs static checks across the scaffold and scores integrity issues without embeddings or vector search.
- **Why it matters**: Mex will beat semantic retrieval on “is this markdown claim still true?” because that is a static lexical verification problem. But it does not replace semantic memory search for conceptual recall.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Mex’s scanner and targeted sync show the right complement: lexical or structural grounding first, AI repair second
- **Source**: [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37)
- **What it does**: Mex first builds a structured brief from manifests, entry points, folder tree, tooling, and README, then tells AI to reason from that brief. During sync it only feeds flagged files, file-local issues, nearby filesystem context, and recent git diff.
- **Why it matters**: The transferable pattern is not “replace search with markdown.” It is “use lexical or structural evidence to narrow the surface, then let AI update only the broken slice.” That is an ideal companion to Spec Kit’s hybrid retrieval stack.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: The missing contract is explicit lane arbitration and user-visible attribution
- **Source**: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1684), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L28)
- **What it does**: Raw candidate collection already falls back from hybrid execution to FTS and then BM25. The lexical subsystem also tracks `lexicalPath` and failure states such as `missing_table` or `no_such_module_fts5`.
- **Why it matters**: We already have the mechanics of lane degradation, but not a strong outward contract explaining which lane dominated, which failed, and why a result should be trusted. That makes hybrid behavior harder to debug and tune.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.44

## Recommended Next Focus
Design a concrete retrieval policy matrix for Spec Kit Memory with four explicit outcomes: `lexical-first`, `semantic-first`, `hybrid-balanced`, and `graph-first`. Tie each mode to query classes, required result attribution, degradation behavior, and eval queries so we can prove when BM25/FTS should dominate, when embeddings should dominate, and when Mex-style static drift checks should run as a separate integrity layer rather than inside the recall stack.
