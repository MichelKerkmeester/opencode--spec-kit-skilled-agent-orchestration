### Finding 6: Spec Kit Memory is structurally in a different class, so Mex should complement it rather than replace it
- **Source**: [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L47), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md#L80), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2297), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2361), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1356), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L608), [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L441), [learned-triggers-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts#L7), [embedding-cache.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts#L45)
- **What it does**: Spec Kit Memory persists a large relational model in SQLite: `memory_index`, `memory_fts`, `vec_memories`, `vec_metadata`, `active_memory_projection`, `causal_edges`, `embedding_cache`, learned-trigger isolation, governance scopes, lineage, chunking, and content-hash/canonical-path indexes. It also writes BM25 and vector side indexes during save flows.
- **Why it matters for us**: This is the key boundary. Mex is excellent at storing navigable authored docs and statically validating them, but it has none of the persistence features required for `memory_search`, `memory_context`, `memory_match_triggers`, causal tracing, session continuity, or governed retrieval. The right move is to add a Mex-like docs-drift layer on top of Public’s markdown surfaces, not to collapse Public toward Mex’s storage model.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md), [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts), [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts), [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [external/src/markdown.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts), [external/test/claims.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md), [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts), [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts), [storage/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md), [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts), [incremental-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts), [embedding-cache.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts), [learned-triggers-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts)

## Assessment
- New information ratio: 0.78
- Questions addressed: markdown persistence model, typed storage schema, indexing strategy, manifest-backed reality model, database-design contrast with Spec Kit Memory, checker-enabling ingestion layer
- Questions answered: Mex stores durable knowledge directly in markdown files and rebuilds typed analysis state on demand; its indexing is explicit via globs, edges, and `patterns/INDEX.md`; its manifest coverage is shallow outside Node; the best fit for Public is a static docs-drift subsystem, not a memory-backend replacement

## Reflection
- What worked: tracing `types.ts`, `config.ts`, `drift/index.ts`, `claims.ts`, `markdown.ts`, `scanner/manifest.ts`, and the pattern/index files exposed the storage model much faster than following README prose alone; comparing that directly against `vector-index-schema.ts`, `lineage-state.ts`, and `incremental-index.ts` made the recommendation boundary obvious
- What did not work: the phase validator still printed `cannot create temp file for here document: Operation not permitted` in this read-only environment before ending with `RESULT: PASSED`; this sandbox also prevented writing `research/research.md`, `implementation-summary.md`, checklist updates, or running `generate-context.js`

## Recommended Next Focus
Deep-dive checker calibration and failure modes: quantify where Mex’s path/edge/index/staleness heuristics would create false positives on `Code_Environment/Public`, and identify the smallest checker subset we can ship first as a Spec Kit docs-drift guard.

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

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

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
I’m treating this as a read-only research pass over the external Mex source, focused specifically on tool surfaces and registration boundaries. I’ll build on the earlier conclusions, trace the actual CLI and checker wiring, compare it to Spec Kit Memory’s MCP surface, and report only new, code-backed findings.
  → Quick memory pass for prior Mex and Spec Kit Memory context relevant to tool surfaces
  • Inspect external Mex source for CLI, command routing, checker registration, sync surface, and profile separation
  • Inspect Spec Kit Memory tool/API surface for comparison points
  • Synthesize iteration-3 findings in required format with exact source references and constraints
codex
I’m pulling a very small memory pass first so the comparison stays consistent with prior Mex and Spec Kit Memory conclusions instead of re-deriving the same baseline. After that I’ll stay in source files and trace the command surface end to end.
exec
/bin/zsh -lc 'rg -n "mex|Spec Kit Memory|tool surface|MCP|profile separation|tool registration" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
907:# Task Group: VS Code MCP Wrapper Parity with Rich MCP Server Config
909:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development and /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.vscode; reuse_rule=reuse for local VS Code MCP sync work, but preserve wrapper shape exactly
911:## Task 1: Sync `.vscode/mcp.json` to richer MCP definitions while preserving VS Code format, outcome success
1004:# Task Group: Spec-Kit Memory Index, MCP Connectivity, and Evaluation Tooling
1005:scope: warn-only gate behavior, DB/provider reliability, MCP surfacing diagnostics, and ablation-integrity verification for memory/search tooling
1006:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for memory-index/MCP/eval troubleshooting in this repo, but re-check current config paths and runtime process state before applying fixes
1059:## Task 6: Troubleshoot Desktop MCP surfacing with feature-gate and session-metadata checks
1085:- when Desktop MCP was missing and user asked “add to user level codex config first,” apply `~/.codex/config.toml` feature/config edits before deeper probes [Task 6]
1087:- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
1096:- With `EMBEDDINGS_PROVIDER=auto`, forward `VOYAGE_API_KEY` and `OPENAI_API_KEY` into the MCP child process and avoid forcing a single shared DB file that can cross provider dimensions [Task 4]
1099:- Use `codex features enable memories` and `codex features enable code_mode`, then start a new Desktop thread to test MCP surfacing; gate toggles persist in `~/.codex/config.toml` [Task 6]
1100:- When startup background scan emits `contamination_audit` JSON on stdout, Codex MCP JSON-RPC can fail to handshake; redirect/silence that stream or delay MCP client init until scan completion [Task 7]
1102:- CLI and MCP paths can target different DBs (`context-index.sqlite` vs `context-index__voyage__voyage-4__1024.sqlite`); rerun `scripts/evals/map-ground-truth-ids.ts` after DB rebuild/swap before baseline comparisons [Task 7]
1578:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit; reuse_rule=reuse for MCP/runtime governance fixes in this repo, but rerun targeted tests because handler behavior is time-sensitive
1620:## Task 5: Guard discovery handlers with E021 MCP envelopes when pre-query DB checks fail
1628:- checkDatabaseUpdated, E021, createMCPErrorResponse, memory_list, memory_stats, memory_health, requestId
1652:- Pre-query guard failures should be wrapped in MCP envelope `E021` before handler query execution so transport contracts stay stable across `memory_list`, `memory_stats`, and `memory_health` [Task 5]
1659:- symptom: pre-query freshness check throws and bypasses structured tool response; cause: handler skipped E021 envelope mapping; fix: catch `checkDatabaseUpdated()` failures at handler entry and return `createMCPErrorResponse` [Task 5]

exec
/bin/zsh -lc "pwd && rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external | sed 's#"'^#/##'"' | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
sed: 1: "s#^#/##
": bad flag in substitute command: '#'

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1004,1104p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1578,1660p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1578	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit; reuse_rule=reuse for MCP/runtime governance fixes in this repo, but rerun targeted tests because handler behavior is time-sensitive
  1579	
  1580	## Task 1: Governed retrieval/shared-space admin hardening and graph ranking fix
  1581	
  1582	### rollout_summary_files
  1583	
  1584	- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)
  1585	
  1586	### keywords
  1587	
  1588	- tenantId userId agentId sharedSpaceId, filterRowsByScope, superRefine actor identity, score=edgeStrength*fts_score, vi.hoisted
  1589	
  1590	## Task 2: Remove temp-root auto-delete from memory health autoRepair
  1591	
  1592	### rollout_summary_files
  1593	
  1594	- rollout_summaries/2026-03-20T15-43-10-Fxg6-auto_repair_temp_root_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-10-019d0bea-319e-7432-8739-3b088f450742.jsonl, updated_at=2026-03-20T17:13:04+00:00, thread_id=019d0bea-319e-7432-8739-3b088f450742)
  1595	
  1596	### keywords
  1597	
  1598	- memory_health autoRepair confirmed, temp_fixture_memory_cleanup, orphanedFiles warning, EXT-H15
  1599	
  1600	## Task 3: Preserve importance-tier overrides and harden spec-affinity matching
  1601	
  1602	### rollout_summary_files
  1603	
  1604	- rollout_summaries/2026-03-20T15-42-58-lcys-fix_tier_override_and_spec_affinity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-42-58-019d0bea-0321-7352-8e66-c5d154da20e0.jsonl, updated_at=2026-03-20T17:13:02+00:00, thread_id=019d0bea-0321-7352-8e66-c5d154da20e0)
  1605	
  1606	### keywords
  1607	
  1608	- importanceTier override, resolveImportanceTier, containsWordBoundary, spec-affinity stopwords
  1609	
  1610	## Task 4: Hybrid runtime audit for duplicate-save and crash-recovery behavior
  1611	
  1612	### rollout_summary_files
  1613	
  1614	- rollout_summaries/2026-03-21T12-12-58-Tp5J-hybrid_rag_fusion_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T13-12-58-019d1050-19ec-7bd2-b5bd-7078f5a1dd6f.jsonl, updated_at=2026-03-21T12:59:53+00:00, thread_id=019d1050-19ec-7bd2-b5bd-7078f5a1dd6f)
  1615	
  1616	### keywords
  1617	
  1618	- checkContentHashDedup, status duplicate, postMutationHooks, generateContinueSessionMd, hydra-spec-pack-consistency.vitest.ts
  1619	
  1620	## Task 5: Guard discovery handlers with E021 MCP envelopes when pre-query DB checks fail
  1621	
  1622	### rollout_summary_files
  1623	
  1624	- rollout_summaries/2026-03-12T16-00-31-5hX0-discovery_prequery_e021_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-00-31-019ce2c7-3124-79e0-bf43-8908f4eb9dc6.jsonl, updated_at=2026-03-12T16:48:04+00:00, thread_id=019ce2c7-3124-79e0-bf43-8908f4eb9dc6)
  1625	
  1626	### keywords
  1627	
  1628	- checkDatabaseUpdated, E021, createMCPErrorResponse, memory_list, memory_stats, memory_health, requestId
  1629	
  1630	## Task 6: Complete graph-signal activation audit with finite-strength clamping
  1631	
  1632	### rollout_summary_files
  1633	
  1634	- rollout_summaries/2026-03-12T12-03-38-frta-graph_signal_activation_complete_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T13-03-38-019ce1ee-5339-7543-9230-14c6fb3ad2d4.jsonl, updated_at=2026-03-12T12:58:41+00:00, thread_id=019ce1ee-5339-7543-9230-14c6fb3ad2d4)
  1635	
  1636	### keywords
  1637	
  1638	- clampStrength, isFiniteNumber, NaN/infinite rejection, memory_causal_link, causal edges
  1639	
  1640	## User preferences
  1641	
  1642	- when user asked for sk-code alignment, include alignment/lint checks before reporting done [Task 1][Task 3]
  1643	- when user asked to “check all associated code and make sure everything works,” include runtime + doc truth-sync tests [Task 4]
  1644	- when user asked to fix confirmed `003-discovery` findings, keep code + packet updates scoped to that spec folder and include envelope behavior verification [Task 5]
  1645	
  1646	## Reusable knowledge
  1647	
  1648	- Governance scope must propagate across schemas/handlers so retrieval scope stays bounded [Task 1]
  1649	- Shared-space mutation contracts should enforce single actor identity before handler writes [Task 1]
  1650	- Auto-repair should be non-destructive for temp-root orphan records and report warnings instead [Task 2]
  1651	- Run duplicate-content precheck before embedding persistence to preserve duplicate UX contract [Task 4]
  1652	- Pre-query guard failures should be wrapped in MCP envelope `E021` before handler query execution so transport contracts stay stable across `memory_list`, `memory_stats`, and `memory_health` [Task 5]
  1653	- Use shared `clampStrength` + finite-number checks for causal-edge strength writes instead of ad-hoc `Math.max/Math.min` clamps [Task 6]
  1654	
  1655	## Failures and how to do differently
  1656	
  1657	- symptom: schema/mock tests fail in new governed paths; cause: missing superRefine/hoisted mocks; fix: add schema guards and hoisted mock patterns [Task 1]
  1658	- symptom: false affinity hits from substrings; cause: naive matching; fix: boundary-based matching + stopword filtering [Task 3]
  1659	- symptom: pre-query freshness check throws and bypasses structured tool response; cause: handler skipped E021 envelope mapping; fix: catch `checkDatabaseUpdated()` failures at handler entry and return `createMCPErrorResponse` [Task 5]
  1660	

 succeeded in 0ms:
  1004	# Task Group: Spec-Kit Memory Index, MCP Connectivity, and Evaluation Tooling
  1005	scope: warn-only gate behavior, DB/provider reliability, MCP surfacing diagnostics, and ablation-integrity verification for memory/search tooling
  1006	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for memory-index/MCP/eval troubleshooting in this repo, but re-check current config paths and runtime process state before applying fixes
  1007	
  1008	## Task 1: Convert Gate 1-3 rejections into warn-only logging for `processPreparedMemory()` while preserving enforce mode
  1009	
  1010	### rollout_summary_files
  1011	
  1012	- rollout_summaries/2026-03-27T18-28-19-O94p-warn_only_spec_doc_gates.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-28-19-019d308d-e699-7573-b5db-adc9a4879845.jsonl, updated_at=2026-03-27T18:57:56+00:00, thread_id=019d308d-e699-7573-b5db-adc9a4879845)
  1013	
  1014	### keywords
  1015	
  1016	- processPreparedMemory, qualityGateMode, warn-only, GATE_1_DOC_STATUS, GATE_2_ANALYSIS_STATUS, GATE_3_CHECKLIST_STATUS
  1017	
  1018	## Task 2: Implement map-ground-truth ID remap tooling for rebuilt memory DBs
  1019	
  1020	### rollout_summary_files
  1021	
  1022	- rollout_summaries/2026-03-27T18-09-43-X5xO-map_ground_truth_ids_implementation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-09-43-019d307c-e035-7a83-981b-92c79cbae57c.jsonl, updated_at=2026-03-27T18:27:05+00:00, thread_id=019d307c-e035-7a83-981b-92c79cbae57c)
  1023	
  1024	### keywords
  1025	
  1026	- map-ground-truth-ids.ts, hard_negative, file_path::title, memory_id remap, JSON atomic write
  1027	
  1028	## Task 3: Fix startup DB path/provider drift and auto-repair temp-root cleanup for `spec_kit_memory`
  1029	
  1030	### rollout_summary_files
  1031	
  1032	- rollout_summaries/2026-03-20T15-43-10-Fxg6-auto_repair_temp_root_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-10-019d0bea-319e-7432-8739-3b088f450742.jsonl, updated_at=2026-03-20T15:57:02+00:00, thread_id=019d0bea-319e-7432-8739-3b088f450742)
  1033	- rollout_summaries/2026-03-20T15-42-58-lcys-fix_tier_override_and_spec_affinity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-42-58-019d0bea-0321-7352-8e66-c5d154da20e0.jsonl, updated_at=2026-03-20T16:00:39+00:00, thread_id=019d0bea-0321-7352-8e66-c5d154da20e0)
  1034	
  1035	### keywords
  1036	
  1037	- MEMORY_DB_PATH, context-index.sqlite, autoRepairTempRoot, ALLOWED_BASE_PATHS, checkContentHashDedup, spec-affinity
  1038	
  1039	## Task 4: Keep embeddings provider `auto` compatible while fixing startup dimension mismatches
  1040	
  1041	### rollout_summary_files
  1042	
  1043	- rollout_summaries/2026-03-12T13-18-14-Hnlx-spec_kit_memory_dimension_mismatch_codex_voyage_key.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T14-18-14-019ce232-9f8e-7d21-bc89-da101beb482b.jsonl, updated_at=2026-03-12T13:57:36+00:00, thread_id=019ce232-9f8e-7d21-bc89-da101beb482b)
  1044	
  1045	### keywords
  1046	
  1047	- EMBEDDINGS_PROVIDER=auto, VOYAGE_API_KEY, OPENAI_API_KEY, dimension mismatch, context-index.sqlite, hf-local fallback
  1048	
  1049	## Task 5: Verify `spec_kit_memory` exists in config/code when no live `memory_*` tools are exposed
  1050	
  1051	### rollout_summary_files
  1052	
  1053	- rollout_summaries/2026-03-28T09-04-14-JFQ4-memory_mcp_connectivity_check.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-04-14-019d33af-d439-7ed2-a540-7723e929ea58.jsonl, updated_at=2026-03-28T09:05:05+00:00, thread_id=019d33af-d439-7ed2-a540-7723e929ea58)
  1054	
  1055	### keywords
  1056	
  1057	- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
  1058	
  1059	## Task 6: Troubleshoot Desktop MCP surfacing with feature-gate and session-metadata checks
  1060	
  1061	### rollout_summary_files
  1062	
  1063	- rollout_summaries/2026-03-28T08-07-16-1KIB-spec_kit_memory_mcp_troubleshoot.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-07-16-019d337b-ad27-7321-a2f9-0ad1f077698d.jsonl, updated_at=2026-03-28T08:52:27+00:00, thread_id=019d337b-ad27-7321-a2f9-0ad1f077698d)
  1064	
  1065	### keywords
  1066	
  1067	- codex features enable memories, codex features enable code_mode, ~/.codex/config.toml, session_meta.dynamic_tools, mcp_startup, handshake timeout
  1068	
  1069	## Task 7: Verify and harden FTS5 ablation integrity (alignment guard + evaluation mode + parent-id normalization)
  1070	
  1071	### rollout_summary_files
  1072	
  1073	- rollout_summaries/2026-03-28T09-47-16-BtZ6-ablation_benchmark_integrity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-47-16-019d33d7-38dc-7343-8b10-d28cc9573e58.jsonl, updated_at=2026-03-28T10:51:34+00:00, thread_id=019d33d7-38dc-7343-8b10-d28cc9573e58)
  1074	- rollout_summaries/2026-03-28T08-25-17-MKwU-spec_kit_ablation_verif_docs_2026_03_28.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-25-17-019d338c-2aa0-7a83-b30f-2ddefd76e320.jsonl, updated_at=2026-03-28T09:44:06+00:00, thread_id=019d338c-2aa0-7a83-b30f-2ddefd76e320, partial outcome)
  1075	
  1076	### keywords
  1077	
  1078	- eval_run_ablation, assertGroundTruthAlignment, evaluationMode, parentMemoryId ?? row.id, Token budget overflow, contamination_audit, scripts/evals/map-ground-truth-ids.ts, context-index__voyage__voyage-4__1024.sqlite
  1079	
  1080	## User preferences
  1081	
  1082	- user required “log warning and continue instead of returning rejected” for warn-only Gates 1-3 and “do not modify ... memory-index.ts” -> keep scope tightly in `processPreparedMemory()` [Task 1]
  1083	- user required build + runtime verification (`npm run build`, forced scan/index evidence) before closeout [Task 1]
  1084	- when user asked “how to fix whilst keeping auto,” keep `EMBEDDINGS_PROVIDER=auto` and avoid hardcoded DB/env paths that force provider fallback [Task 4]
  1085	- when Desktop MCP was missing and user asked “add to user level codex config first,” apply `~/.codex/config.toml` feature/config edits before deeper probes [Task 6]
  1086	- when user then said “just tried but no luck. investigate deeper,” continue beyond one fix attempt into session metadata/log evidence [Task 6]
  1087	- when user requested ablation verification, run `eval_run_ablation({ mode:"ablation", includeFormattedReport:true, storeResults:true })` through Codex MCP before declaring FTS5 outcomes [Task 7]
  1088	- when user ordered ablation first and docs second, resolve Codex↔spec_kit_memory handshake blockers before documentation edits [Task 7]
  1089	
  1090	## Reusable knowledge
  1091	
  1092	- Warn-only pattern: Gates 1-3 should log and continue for warn-only spec docs; enforce mode must preserve rejection payloads [Task 1]
  1093	- Run scan tooling from repo root so base path resolves actual spec folders; account for 60-second scan cooldown [Task 1]
  1094	- Ground-truth remap uses read-only DB scan + atomic JSON write + hard_negative skip + dedupe by `file_path::title` [Task 2]
  1095	- Set `MEMORY_DB_PATH` consistently across client config surfaces to writable home path [Task 3]
  1096	- With `EMBEDDINGS_PROVIDER=auto`, forward `VOYAGE_API_KEY` and `OPENAI_API_KEY` into the MCP child process and avoid forcing a single shared DB file that can cross provider dimensions [Task 4]
  1097	- If `list_mcp_resources`/`list_mcp_resource_templates` are empty, treat `spec_kit_memory` as configured-but-not-exposed and verify config + handler presence before assuming tool absence in code [Task 5]
  1098	- Desktop `session_meta.dynamic_tools` plus absence of `mcp_startup` events is a stronger surfacing signal than standalone `node context-server.js` timeout probes [Task 6]
  1099	- Use `codex features enable memories` and `codex features enable code_mode`, then start a new Desktop thread to test MCP surfacing; gate toggles persist in `~/.codex/config.toml` [Task 6]
  1100	- When startup background scan emits `contamination_audit` JSON on stdout, Codex MCP JSON-RPC can fail to handshake; redirect/silence that stream or delay MCP client init until scan completion [Task 7]
  1101	- Treat any ablation run showing `Token budget overflow` and returning fewer than `recallK` results as investigation-only, not a reliable Recall@20 verdict [Task 7]
  1102	- CLI and MCP paths can target different DBs (`context-index.sqlite` vs `context-index__voyage__voyage-4__1024.sqlite`); rerun `scripts/evals/map-ground-truth-ids.ts` after DB rebuild/swap before baseline comparisons [Task 7]
  1103	
  1104	## Failures and how to do differently

codex
I’ve got the prior MCP context anchored. Next I’m tracing Mex’s own command and registration layer from the CLI entrypoint outward, then I’ll contrast that with how Spec Kit Memory exposes its MCP handlers and schemas.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main: IO error for operation on /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main: No such file or directory (os error 2)

exec
/bin/zsh -lc "rg -n \"program\\.command|command\\(|watch|pattern add|commands|sync|check|init|commander|register|profile|provider|MCP|api\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/src /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/src: No such file or directory (os error 2)
rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/package.json: No such file or directory (os error 2)

codex
The file layout differs slightly from the brief’s `external/mex-main/...` wording, so I’m adapting to the real checkout structure under `external/` and continuing in the same analysis order. I’m verifying the live paths now so the findings stay source-accurate instead of prompt-accurate.
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external -maxdepth 2 -type f | sort | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/pull_request_template.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/.cursorrules
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/.windsurfrules
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/copilot-instructions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh

exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external -maxdepth 2 -type d | sort | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/workflows
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "name": "promexeus",
     3	  "version": "0.3.1",
     4	  "description": "CLI engine for mex scaffold — drift detection, pre-analysis, and targeted sync",
     5	  "type": "module",
     6	  "bin": {
     7	    "mex": "./dist/cli.js"
     8	  },
     9	  "files": [
    10	    "dist",
    11	    "templates",
    12	    "LICENSE",
    13	    "README.md"
    14	  ],
    15	  "keywords": [
    16	    "ai",
    17	    "agents",
    18	    "scaffold",
    19	    "drift-detection",
    20	    "documentation",
    21	    "cli",
    22	    "claude",
    23	    "cursor",
    24	    "copilot"
    25	  ],
    26	  "repository": {
    27	    "type": "git",
    28	    "url": "https://github.com/theDakshJaitly/mex.git"
    29	  },
    30	  "author": "Daksh Jaitly",
    31	  "license": "MIT",
    32	  "homepage": "https://github.com/theDakshJaitly/mex#readme",
    33	  "engines": {
    34	    "node": ">=20"
    35	  },
    36	  "scripts": {
    37	    "build": "tsup",
    38	    "dev": "tsup --watch",
    39	    "test": "vitest run",
    40	    "test:watch": "vitest",
    41	    "typecheck": "tsc --noEmit"
    42	  },
    43	  "dependencies": {
    44	    "chalk": "^5.4.1",
    45	    "commander": "^13.1.0",
    46	    "glob": "^11.0.1",
    47	    "remark-frontmatter": "^5.0.0",
    48	    "remark-parse": "^11.0.0",
    49	    "simple-git": "^3.27.0",
    50	    "unified": "^11.0.5",
    51	    "unist-util-visit": "^5.0.0",
    52	    "yaml": "^2.7.0"
    53	  },
    54	  "devDependencies": {
    55	    "@types/node": "^22.0.0",
    56	    "tsup": "^8.4.0",
    57	    "typescript": "^5.7.0",
    58	    "vitest": "^3.0.0"
    59	  }
    60	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import chalk from "chalk";
     2	import { Command } from "commander";
     3	import { findConfig } from "./config.js";
     4	import { reportConsole, reportQuiet, reportJSON } from "./reporter.js";
     5	
     6	const program = new Command();
     7	
     8	program
     9	  .name("mex")
    10	  .description("CLI engine for mex scaffold — drift detection, pre-analysis, and targeted sync")
    11	  .version("0.4.0");
    12	
    13	// ── Setup (npx entry point) ──
    14	program
    15	  .command("setup")
    16	  .description("First-time setup — create .mex/ scaffold and populate with AI")
    17	  .option("--dry-run", "Show what would happen without making changes")
    18	  .action(async (opts) => {
    19	    try {
    20	      const { runSetup } = await import("./setup/index.js");
    21	      await runSetup({ dryRun: opts.dryRun });
    22	    } catch (err) {
    23	      console.error((err as Error).message);
    24	      process.exit(1);
    25	    }
    26	  });
    27	
    28	// ── Layer 2: Drift Detection ──
    29	program
    30	  .command("check")
    31	  .description("Detect drift between scaffold files and codebase reality")
    32	  .option("--json", "Output full drift report as JSON")
    33	  .option("--quiet", "Single-line summary only")
    34	  .option("--fix", "Run sync to fix any issues found")
    35	  .action(async (opts) => {
    36	    try {
    37	      const config = findConfig();
    38	      const { runDriftCheck } = await import("./drift/index.js");
    39	      const report = await runDriftCheck(config);
    40	
    41	      if (opts.json) {
    42	        reportJSON(report);
    43	      } else if (opts.quiet) {
    44	        reportQuiet(report);
    45	      } else {
    46	        reportConsole(report);
    47	      }
    48	
    49	      // If --fix and there are issues, jump to sync
    50	      const hasErrors = report.issues.some((i) => i.severity === "error");
    51	      if (opts.fix && hasErrors) {
    52	        const { runSync } = await import("./sync/index.js");
    53	        await runSync(config, {});
    54	        return;
    55	      }
    56	
    57	      if (hasErrors) process.exit(1);
    58	    } catch (err) {
    59	      console.error((err as Error).message);
    60	      process.exit(1);
    61	    }
    62	  });
    63	
    64	// ── Layer 1: Pre-analysis Scanner ──
    65	program
    66	  .command("init")
    67	  .description("Scan codebase and generate pre-analysis brief for AI")
    68	  .option("--json", "Output scanner brief as JSON")
    69	  .action(async (opts) => {
    70	    try {
    71	      const config = findConfig();
    72	      const { runScan } = await import("./scanner/index.js");
    73	      const result = await runScan(config, { jsonOnly: opts.json });
    74	
    75	      if (opts.json) {
    76	        console.log(JSON.stringify(result, null, 2));
    77	      } else {
    78	        console.log(result);
    79	      }
    80	    } catch (err) {
    81	      console.error((err as Error).message);
    82	      process.exit(1);
    83	    }
    84	  });
    85	
    86	// ── Layer 3: Targeted Sync ──
    87	program
    88	  .command("sync")
    89	  .description("Run drift check, then build targeted prompts for AI to fix flagged files")
    90	  .option("--dry-run", "Show what would be synced without executing")
    91	  .option("--warnings", "Include warning-only files (by default only errors are synced)")
    92	  .action(async (opts) => {
    93	    try {
    94	      const config = findConfig();
    95	      const { runSync } = await import("./sync/index.js");
    96	      await runSync(config, { dryRun: opts.dryRun, includeWarnings: opts.warnings });
    97	    } catch (err) {
    98	      console.error((err as Error).message);
    99	      process.exit(1);
   100	    }
   101	  });
   102	
   103	// ── Layer 4: Patterns ──
   104	const patternCmd = program
   105	  .command("pattern")
   106	  .description("Manage pattern files");
   107	
   108	patternCmd
   109	  .command("add <name>")
   110	  .description("Create a new pattern file and add it to the index")
   111	  .action(async (name) => {
   112	    try {
   113	      const config = findConfig();
   114	      const { runPatternAdd } = await import("./pattern/index.js");
   115	      await runPatternAdd(config, name);
   116	    } catch (err) {
   117	      console.error((err as Error).message);
   118	      process.exit(1);
   119	    }
   120	  });
   121	
   122	// ── Git Hook ──
   123	program
   124	  .command("watch")
   125	  .description("Install/uninstall post-commit hook for automatic drift checking")
   126	  .option("--uninstall", "Remove the post-commit hook")
   127	  .action(async (opts) => {
   128	    try {
   129	      const config = findConfig();
   130	      const { manageHook } = await import("./watch.js");
   131	      await manageHook(config, { uninstall: opts.uninstall });
   132	    } catch (err) {
   133	      console.error((err as Error).message);
   134	      process.exit(1);
   135	    }
   136	  });
   137	
   138	// ── Quick Reference ──
   139	program
   140	  .command("commands")
   141	  .description("List all available commands and scripts")
   142	  .action(() => {
   143	    console.log(chalk.bold("\nCLI Commands") + chalk.dim("  (run from project root)\n"));
   144	    console.log("  mex setup              First-time setup — create .mex/ scaffold");
   145	    console.log("  mex setup --dry-run    Preview setup without making changes");
   146	    console.log("  mex check              Drift score — are scaffold files still accurate?");
   147	    console.log("  mex check --quiet      One-liner drift score");
   148	    console.log("  mex check --json       Full drift report as JSON");
   149	    console.log("  mex check --fix        Check and fix any errors found");
   150	    console.log("  mex sync               Fix drift — Claude updates only what's broken");
   151	    console.log("  mex sync --dry-run     Preview fix prompts without running them");
   152	    console.log("  mex sync --warnings    Include warning-only files in sync");
   153	    console.log("  mex init               Pre-scan codebase, build brief for AI");
   154	    console.log("  mex init --json        Scanner brief as JSON");
   155	    console.log("  mex pattern add <name> Create a new pattern file");
   156	    console.log("  mex watch              Install post-commit hook for auto drift score");
   157	    console.log("  mex watch --uninstall  Remove the post-commit hook");
   158	    console.log();
   159	    console.log(chalk.dim("Not installed globally? Replace 'mex' with 'npx promexeus'."));
   160	    console.log();
   161	  });
   162	
   163	program.parse();

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { writeFileSync, readFileSync, existsSync, chmodSync, unlinkSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import chalk from "chalk";
     4	import type { MexConfig } from "./types.js";
     5	
     6	const HOOK_MARKER = "# mex-drift-check";
     7	
     8	function buildHookContent(config: MexConfig): string {
     9	  const cliPath = resolve(config.scaffoldRoot, "dist", "cli.js");
    10	  // Use local CLI if built, otherwise fall back to npx
    11	  const cmd = existsSync(cliPath)
    12	    ? `node "${cliPath}" check --quiet`
    13	    : "npx mex check --quiet";
    14	
    15	  return `#!/bin/sh
    16	${HOOK_MARKER}
    17	# Auto-installed by mex watch — runs drift check after each commit
    18	SCORE=$(${cmd} 2>&1) || true
    19	# Only show output if there are issues (not a perfect score)
    20	case "$SCORE" in
    21	  *"100/100"*) ;;
    22	  *) echo "$SCORE" ;;
    23	esac
    24	`;
    25	}
    26	
    27	export async function manageHook(
    28	  config: MexConfig,
    29	  opts: { uninstall?: boolean }
    30	): Promise<void> {
    31	  const hookPath = resolve(config.projectRoot, ".git", "hooks", "post-commit");
    32	
    33	  if (opts.uninstall) {
    34	    uninstallHook(hookPath);
    35	    return;
    36	  }
    37	
    38	  installHook(hookPath, config);
    39	}
    40	
    41	function installHook(hookPath: string, config: MexConfig): void {
    42	  const hookContent = buildHookContent(config);
    43	
    44	  if (existsSync(hookPath)) {
    45	    const existing = readFileSync(hookPath, "utf-8");
    46	    if (existing.includes(HOOK_MARKER)) {
    47	      console.log(chalk.yellow("mex post-commit hook is already installed."));
    48	      return;
    49	    }
    50	
    51	    // Append to existing hook
    52	    const updated = existing.trimEnd() + "\n\n" + hookContent;
    53	    writeFileSync(hookPath, updated);
    54	    chmodSync(hookPath, 0o755);
    55	    console.log(
    56	      chalk.green("Added mex drift check to existing post-commit hook.")
    57	    );
    58	    return;
    59	  }
    60	
    61	  writeFileSync(hookPath, hookContent);
    62	  chmodSync(hookPath, 0o755);
    63	  console.log(chalk.green("Installed mex post-commit hook."));
    64	}
    65	
    66	function uninstallHook(hookPath: string): void {
    67	  if (!existsSync(hookPath)) {
    68	    console.log(chalk.yellow("No post-commit hook found."));
    69	    return;
    70	  }
    71	
    72	  const content = readFileSync(hookPath, "utf-8");
    73	  if (!content.includes(HOOK_MARKER)) {
    74	    console.log(
    75	      chalk.yellow("post-commit hook exists but was not installed by mex.")
    76	    );
    77	    return;
    78	  }
    79	
    80	  // Remove mex section (everything between marker and next non-mex line)
    81	  const lines = content.split("\n");
    82	  const filtered: string[] = [];
    83	  let inMexBlock = false;
    84	
    85	  for (const line of lines) {
    86	    if (line.includes(HOOK_MARKER)) {
    87	      inMexBlock = true;
    88	      continue;
    89	    }
    90	    if (inMexBlock) {
    91	      // Skip lines that are part of the mex hook block
    92	      if (line.startsWith("#") || line.startsWith("SCORE=") ||
    93	          line.startsWith("case") || line.startsWith("  *") ||
    94	          line.startsWith("esac") || line.startsWith("npx mex") ||
    95	          line.startsWith("node ") || line.trim() === "") {
    96	        continue;
    97	      }
    98	      // Non-mex line found — stop skipping
    99	      inMexBlock = false;
   100	    }
   101	    filtered.push(line);
   102	  }
   103	
   104	  const remaining = filtered.join("\n").trim();
   105	  if (remaining === "#!/bin/sh" || remaining === "") {
   106	    // Only shebang left — remove the file
   107	    unlinkSync(hookPath);
   108	    console.log(chalk.green("Removed mex post-commit hook."));
   109	  } else {
   110	    writeFileSync(hookPath, remaining + "\n");
   111	    chmodSync(hookPath, 0o755);
   112	    console.log(
   113	      chalk.green("Removed mex section from post-commit hook.")
   114	    );
   115	  }
   116	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { existsSync } from "node:fs";
     2	import { resolve, dirname } from "node:path";
     3	import type { MexConfig } from "./types.js";
     4	
     5	/**
     6	 * Walk up from startDir looking for .git to find project root,
     7	 * then look for scaffold root (.mex/ or context/ directory).
     8	 */
     9	export function findConfig(startDir?: string): MexConfig {
    10	  const dir = startDir ?? process.cwd();
    11	
    12	  if (dir.split(/[\\/]/).includes(".mex")) {
    13	    throw new Error(
    14	      "You're inside the .mex/ directory. Run mex commands from your project root instead."
    15	    );
    16	  }
    17	
    18	  // Try git root first, fall back to cwd if no git repo
    19	  const gitRoot = findProjectRoot(dir);
    20	  const projectRoot = gitRoot ?? dir;
    21	
    22	  const mexDir = resolve(projectRoot, ".mex");
    23	  if (existsSync(mexDir) && !existsSync(resolve(mexDir, "ROUTER.md"))) {
    24	    throw new Error("Scaffold directory exists but looks incomplete. Run: mex setup");
    25	  }
    26	
    27	  const scaffoldRoot = findScaffoldRoot(projectRoot);
    28	  if (!scaffoldRoot) {
    29	    if (!gitRoot) {
    30	      throw new Error("No git repository found. Initialize one first: git init");
    31	    }
    32	
    33	    throw new Error(
    34	      "No .mex/ scaffold found. Run: mex setup"
    35	    );
    36	  }
    37	
    38	  return { projectRoot, scaffoldRoot };
    39	}
    40	
    41	function findProjectRoot(dir: string): string | null {
    42	  let current = resolve(dir);
    43	  while (true) {
    44	    if (existsSync(resolve(current, ".git"))) {
    45	      return current;
    46	    }
    47	    const parent = dirname(current);
    48	    if (parent === current) return null;
    49	    current = parent;
    50	  }
    51	}
    52	
    53	function findScaffoldRoot(projectRoot: string): string | null {
    54	  // Prefer .mex/ directory
    55	  const mexDir = resolve(projectRoot, ".mex");
    56	  if (existsSync(mexDir)) {
    57	    return mexDir;
    58	  }
    59	
    60	  // Fall back to context/ directory (current mex layout)
    61	  const contextDir = resolve(projectRoot, "context");
    62	  if (existsSync(contextDir)) return projectRoot;
    63	
    64	  return null;
    65	}

codex
I’ve confirmed Mex is a pure CLI package so far, not an MCP server. I’m now looking at the two places where “tool surface” actually appears in practice: Mex’s own subcommands and its per-agent profile files, versus Spec Kit Memory’s real MCP schema/handler registration.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "$schema": "https://opencode.ai/config.json",
     3	  "instructions": [".mex/AGENTS.md"]
     4	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Tool Configuration Files
     2	
     3	These files make the scaffold work with specific AI coding tools.
     4	Most embed the same content — a pointer to `.mex/ROUTER.md`. OpenCode uses a JSON config that references `.mex/AGENTS.md` instead.
     5	
     6	## Which file does your tool use?
     7	
     8	| Tool | File to use |
     9	|------|-------------|
    10	| Claude Code | `CLAUDE.md` → copy or symlink to project root |
    11	| Cursor | `.cursorrules` → copy or symlink to project root |
    12	| Windsurf | `.windsurfrules` → copy or symlink to project root |
    13	| GitHub Copilot | `copilot-instructions.md` → copy to `.github/` in project root |
    14	| OpenCode | `opencode.json` → copy to `.opencode/` in project root |
    15	| Codex (OpenAI) | Copy `CLAUDE.md` as `AGENTS.md` to project root |
    16	| Any other tool | Point agent to `.mex/AGENTS.md` |
    17	
    18	## Setup
    19	
    20	Copy the relevant file to the correct location in your project root:
    21	
    22	```bash
    23	# Claude Code
    24	cp .tool-configs/CLAUDE.md ./CLAUDE.md
    25	
    26	# Cursor
    27	cp .tool-configs/.cursorrules ./.cursorrules
    28	
    29	# Windsurf
    30	cp .tool-configs/.windsurfrules ./.windsurfrules
    31	
    32	# Copilot
    33	mkdir -p .github && cp .tool-configs/copilot-instructions.md ./.github/copilot-instructions.md
    34	
    35	# OpenCode
    36	mkdir -p .opencode && cp .tool-configs/opencode.json ./.opencode/opencode.json
    37	
    38	# Codex (OpenAI)
    39	cp .tool-configs/CLAUDE.md ./AGENTS.md
    40	```
    41	
    42	## If your tool is not listed
    43	
    44	Add "Read .mex/ROUTER.md before starting any task" to your tool's system prompt
    45	or paste it at the start of each session. The scaffold works identically.
    46	
    47	## Content
    48	
    49	Most files embed the Circle 1 anchor from `.mex/AGENTS.md`. OpenCode's `opencode.json` references it by path instead.
    50	`.mex/AGENTS.md` is the source of truth. If you update it, update your root tool config too.

exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server -maxdepth 2 -type f | sort | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/.gitkeep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite-shm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite-wal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite-shm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite-wal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite.bak-2026-04-03
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/speckit-eval.db
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/speckit-eval.db-shm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/speckit-eval.db-wal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/cli.d.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/cli.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/cli.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/cli.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.d.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/startup-checks.d.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/startup-checks.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/startup-checks.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/startup-checks.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.d.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tool-schemas.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/tsconfig.tsbuildinfo
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/vitest.config.d.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/vitest.config.d.ts.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/vitest.config.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/vitest.config.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/package.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/specs/descriptions.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fallback.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/api-key-validation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/api-public-surfaces.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-extraction.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/config-cognitive.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/db-dimension-integrity.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/db-state.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dead-code-regression.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dynamic-token-budget.vitest.ts

exec
/bin/zsh -lc "rg -n \"register|tool\\(|server\\.tool|z\\.object|memory_search|memory_context|memory_match_triggers|tool-schemas|createMCPErrorResponse|context-server|FastMCP|MCP\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:4:// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:14:// MCP SDK
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:30:import { TOOL_DEFINITIONS } from './tool-schemas.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:64:import { createMCPErrorResponse, wrapForMCP } from './lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:91:  registerGlobalRefreshFn,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:391:        console.error(`[context-server] afterTool callback failed for '${tool}' (${callId}): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:739:// This is by design — instruction updates require MCP protocol re-negotiation which most clients
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:756:    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:815:export function registerAfterToolCallback(fn: AfterToolCallback): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:829:    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:833:    console.error(`[context-server] Cleared ${invalidatedEntries} tool-cache entries after DB reinitialization`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:842:  { name: 'context-server', version: '1.7.2' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:848:   4. TOOL DEFINITIONS (T303: from tool-schemas.ts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:906:      console.error(`[context-server] Session priming failed (non-fatal): ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:926:          console.error(`[context-server] Auto-surface failed (non-fatal): ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:934:        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:939:      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1041:        console.warn(`[context-server] Passive enrichment failed (non-fatal): ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1125:      return wrapForMCP(errorResponse as any, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1128:      console.error(`[context-server] Failed to build MCP error envelope for '${name}': ${fallbackError}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1130:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1177: * T107: Recover pending memory files on MCP startup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1184:  console.error('[context-server] Checking for pending memory files...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1217:      console.error(`[context-server] Pending file recovery: ${recoveryResult.recovered} recovered, ${recoveryResult.failed} failed (${recoveryResult.found} total)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1219:      console.error('[context-server] No pending memory files found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1225:    console.error(`[context-server] Pending file recovery error: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1232:    console.error('[context-server] Startup scan already in progress, skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1238:    console.error('[context-server] Waiting for embedding model to be ready...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1242:      console.error('[context-server] Startup scan skipped: embedding model not ready');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1243:      console.error('[context-server] Run memory_index_scan manually after model loads');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1250:    console.error('[context-server] Starting background scan for new memory files...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1282:      console.error('[context-server] No memory files found in workspace');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1286:    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1298:        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1303:      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1305:      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1325:      console.error(`[context-server] Atomicity metrics: ${metrics.totalAtomicWrites} successful, ${metrics.totalErrors} failed, ${metrics.totalRecoveries} recovered`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1329:    console.error(`[context-server] Startup scan error: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1360:  console.error(`[context-server] ${reason}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1381:    // P1-09 FIX: Close MCP transport on shutdown
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1402:    console.error(`[context-server] Shutdown deadline exceeded after ${SHUTDOWN_DEADLINE_MS}ms`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1485:    `[context-server] Detected runtime: ${detectedRuntime.runtime} (hookPolicy=${detectedRuntime.hookPolicy})`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1495:    console.error('[context-server] Validating embedding API key...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1503:          console.warn('[context-server] ===== API KEY VALIDATION SKIPPED (network error) =====');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1504:          console.warn(`[context-server] Provider: ${validation.provider}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1505:          console.warn(`[context-server] Error: ${validation.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1507:            console.warn('[context-server] Recovery Actions:');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1509:              console.warn(`[context-server]   ${i + 1}. ${action}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1512:          console.warn('[context-server] Continuing startup — validation will occur on first use');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1514:          console.error('[context-server] ===== API KEY VALIDATION FAILED =====');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1515:          console.error(`[context-server] Provider: ${validation.provider}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1516:          console.error(`[context-server] Error: ${validation.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1517:          console.error(`[context-server] Error Code: ${validation.errorCode || 'E050'}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1519:            console.error('[context-server] Recovery Actions:');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1521:              console.error(`[context-server]   ${i + 1}. ${action}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1524:          console.error('[context-server] =====================================');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1525:          console.error('[context-server] FATAL: Cannot start MCP server with invalid API key');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1526:          console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1532:        console.warn(`[context-server] API key warning: ${validation.warning}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1536:        console.error(`[context-server] API key validated (provider: ${validation.provider})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1540:      console.error(`[context-server] API key validation error: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1541:      console.error('[context-server] Continuing startup - validation will occur on first use');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1544:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1553:  console.error('[context-server] Initializing database...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1556:  console.error('[context-server] Database initialized');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1557:  console.error('[context-server] Database path: ' + DATABASE_PATH);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1582:  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1583:  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1590:    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1591:    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1596:      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1597:      console.error(`[context-server] ${dimValidation.warning}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1598:      console.error(`[context-server] =========================================`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1599:      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1602:      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1612:      console.error('[context-server] Scoring observability initialized');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1615:      console.warn('[context-server] Scoring observability init failed (non-fatal):', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1622:        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1625:        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1637:      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1652:    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1656:      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1660:      console.error('[context-server] WARNING: Database has 0 memories — search will return no results until memories are saved');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1675:    registerGlobalRefreshFn(() => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1685:          '[context-server] Scheduled graph refresh applied: dirty_nodes=%d, updated_edges=%d',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1691:        console.warn('[context-server] Scheduled graph refresh failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1701:        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1704:        console.warn('[context-server] BM25 index rebuild failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1713:      console.error('[context-server] Cognitive memory modules initialized');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1714:      console.error(`[context-server] Working memory: ${workingMemory.isEnabled()}, Co-activation: ${coActivation.isEnabled()}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1717:      console.warn('[context-server] Cognitive modules partially failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1721:      initExtractionAdapter(database, registerAfterToolCallback);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1722:      console.error('[context-server] Extraction adapter initialized');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1725:      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1734:        console.error(`[context-server] Archival manager initialized (background job started)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1736:        console.error(`[context-server] Archival manager initialized (background job: not started)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1740:      console.warn('[context-server] Archival manager failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1751:        console.error('[context-server] Background retry job started (interval: 5min, batch: 5)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1753:        console.error('[context-server] Background retry job already running or disabled');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1757:      console.warn('[context-server] Background retry job failed to start:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1766:        console.error('[context-server] Shadow feedback evaluation scheduler started');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1768:        console.error('[context-server] Shadow feedback evaluation scheduler not started (already running or disabled)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1772:      console.warn('[context-server] Shadow feedback evaluation scheduler failed to start:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1780:        console.error(`[context-server] Batch learning: ${batchResult.shadowApplied} shadow-applied, ${batchResult.skippedMinSupport} skipped (min-support), window=${Math.round((batchResult.runAt - batchResult.windowStart) / 86_400_000)}d`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1782:        console.error('[context-server] Batch learning: no eligible candidates in window (or flag disabled)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1786:      console.warn('[context-server] Batch learning failed (non-fatal):', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1793:        console.error(`[context-server] Session manager initialized (enabled: ${sessionManager.isEnabled()})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1799:          console.error(`[context-server] Crash recovery: marked ${recoveryResult.interruptedCount} sessions as interrupted`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1807:        console.warn('[context-server] Session manager initialization returned:', sessionResult.error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1811:      console.warn('[context-server] Session manager failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1822:        console.error(`[context-server] Ingest crash recovery reset ${ingestInit.resetCount} incomplete job(s) to queued`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1826:      console.warn('[context-server] Ingest queue init failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1858:          console.error(`[context-server] File watcher started for ${watchPaths.length} path(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1860:          console.warn('[context-server] File watcher enabled, but no spec directories were found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1864:        console.warn('[context-server] File watcher startup failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1869:    console.error('[context-server] Integrity check failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1882:      console.warn('[context-server] Dynamic instructions init failed (non-fatal):', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1888:  console.error('[context-server] Context MCP server running on stdio');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1897:  main().catch((err: unknown) => { console.error('[context-server] Fatal error:', err); process.exit(1); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:3:description: All SPECKIT_* environment variables used by the Spec Kit Memory MCP server, organized by subsystem with defaults, types and source file references.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:8:> All `SPECKIT_*` environment variables for the Spec Kit Memory MCP server.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:92:| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | Enforce strict JSON schema validation on MCP tool inputs. Set `false` to relax. | `schemas/tool-input-schemas.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:93:| `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | Skip API-level input validation. Opt-in: set `true` to enable. | `context-server.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:94:| `SPECKIT_DYNAMIC_INIT` | `true` | boolean | Dynamic startup instruction injection for the MCP server. Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:4:// MCP handler layer for shared-space CRUD, membership assignment,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:7:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:8:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:52:  | { ok: false; response: MCPResponse };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:55:  public readonly response: MCPResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:57:  constructor(message: string, response: MCPResponse) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:64:function throwSharedMemoryAuthError(message: string, response: MCPResponse): never {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:74:}): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:75:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:104:      response: createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:110:          hint: 'Configure exactly one of SPECKIT_SHARED_MEMORY_ADMIN_USER_ID or SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID on the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:119:      response: createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:345:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:346:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:361:function createSharedMemoryEnableAuthError(reason: string, error: string): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:362:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:378:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:381:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:442: * @returns MCP success response describing the saved shared space.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:444:export async function handleSharedSpaceUpsert(args: SharedSpaceUpsertArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:453:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:601:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:633: * @returns MCP success response describing the updated membership.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:635:export async function handleSharedSpaceMembershipSet(args: SharedSpaceMembershipArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:644:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:719:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:750: * @returns MCP success response containing the enabled state and allowed spaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:752:export async function handleSharedMemoryStatus(args: SharedMemoryStatusArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:764:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:800:export async function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:833:      return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:849:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:15:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:27:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:130: * @returns MCP response with job ID and forecast
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:132:async function handleMemoryIngestStart(args: MemoryIngestStartArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:213:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:255:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:280:async function handleMemoryIngestStatus(args: MemoryIngestStatusArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:289:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:302:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:309:async function handleMemoryIngestCancel(args: MemoryIngestCancelArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:318:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:332:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:344:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:12:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:21:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:43:async function handleMemoryBulkDelete(args: BulkDeleteArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:46:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:98:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:108:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:133:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:311:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:32:import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:40:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:185:async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:196:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:219:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:335:    const noMatchResponse = createMCPEmptyResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:510:  const _triggersResponse = createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:45: * can surface warnings in their MCP responses (F1.10 fix).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:23:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:26:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:294:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:295:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:314: * @returns MCP response with checkpoint metadata
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:316:async function handleCheckpointCreate(args: CheckpointCreateArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:341:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:357:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:377:async function handleCheckpointList(args: CheckpointListArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:403:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:422:async function handleCheckpointRestore(args: CheckpointRestoreArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:426:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:456:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:481:  // Matches the startup rebuild sequence in context-server.ts (lines 776-791).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:500:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:520:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:545:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:564:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:583:async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:605:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:628:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:649:async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:779:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:17:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:25:import type { MCPResponse, EmbeddingProfile } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:223:async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:232:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:234:      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:250:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:259:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:268:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:277:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:286:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:332:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:334:        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:346:      hints.push('Database not connected - restart MCP server');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:358:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:427:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:449:    hints.push('Database not connected - restart MCP server');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:569:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:4:// Centralized strict Zod validation schemas for MCP tool inputs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28:  const base = z.object(shape);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:185:  // Governance args — accepted by tool-schemas.ts tool definition and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:569:    throw new ToolSchemaValidationError(toolName, `Unknown tool: "${toolName}". No schema registered.`, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:582:      // CHK-029: Log rejected params for audit trail (MCP uses stderr)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:35:import type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:401:export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:421:      // Extract data from MCP envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:24:import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:49:import type { MCPResponse, IntentClassification } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:362:  // Strategy results contain an embedded MCPResponse with content[0].text as JSON
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1080: * @returns MCP response with context-aware memory results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1082:async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1091:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1116:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1230:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1374:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1392:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1470:  const _contextResponse = createMCPResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1582:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:3:description: "MCP tool handlers, save/index orchestration helpers, and shared-memory auth utilities."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:5:  - "MCP handlers"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:24:`handlers/` is the MCP-facing handler layer. `handlers/index.ts` lazily loads these modules via async `import()` resolution and re-exports the public handler functions used by the tool dispatch layer.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:26:Primary MCP handler modules:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:66:- Public handlers expose camelCase functions plus snake_case compatibility aliases where the MCP surface still needs them.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:4:// MCP tool handler for deep_loop_graph_convergence — composite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:13:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:18:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:30:async function handleMemoryList(args: ListArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:38:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:40:      error: 'Database refresh failed before query execution. Retry the request or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:56:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:65:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:74:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:83:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:97:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:99:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:137:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:166:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:19:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:27:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:41:async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:230:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:236:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:237:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:288:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:14:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:23:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:53:function createDatabaseUnavailableDeleteResponse(): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:54:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:60:      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:61:      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:68:async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:289:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:2:title: "MCP Server Schemas"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:3:description: "Centralized Zod validation schemas for all MCP tool inputs, with strict mode control, path traversal guards and typed error formatting."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:13:# MCP Server Schemas
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:27:`schemas/` holds a single file that defines every Zod validation schema used by MCP tool handlers. All 29+ tool schemas are declared here, exported through a `TOOL_SCHEMAS` registry and consumed by tool modules via the `validateToolArgs()` function.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:39:| `tool-input-schemas.ts` | Defines Zod schemas for all 29+ MCP tools, exports `TOOL_SCHEMAS` registry, `validateToolArgs()`, `getToolSchema()`, `formatZodError()`, `getSchema()` and the `ToolSchemaValidationError` class |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:47:**Schema factory (`getSchema`)** -- Wraps `z.object()` with strict/passthrough toggling based on the `SPECKIT_STRICT_SCHEMAS` env var. All tool schemas use this factory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:61:**Consumers** -- The schemas are imported directly by tool modules (`memory-tools.ts`, `checkpoint-tools.ts`, `causal-tools.ts`, `lifecycle-tools.ts`, `context-tools.ts`, `types.ts`) and re-exported through the parent-level `tool-schemas.ts` barrel.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:67:- `../tool-schemas.ts` -- barrel re-export and `ToolDefinition` interface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:4:// MCP tool handler for deep_loop_graph_query — structured analysis
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:4:// T018: MCP tool handler for session_health — reports session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:27:import type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:66:export async function handleSessionHealth(): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:35:import type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:68:function extractData(response: MCPResponse): Record<string, unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:164:export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:10:import { createMCPSuccessResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:13:import type { MCPResponse, DatabaseExtended as Database } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:301:async function handleTaskPreflight(args: PreflightArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:369:      return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:419:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:458:async function handleTaskPostflight(args: PostflightArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:606:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:660:async function handleGetLearningHistory(args: LearningHistoryArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:842:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:3:MCP tool handlers for the structural code graph system.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:7:| File | MCP Tool | Purpose |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:22:- Schemas: `tool-schemas.ts` (L8: Code Graph definitions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:173:  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:4:// MCP tool handler for deep_loop_graph_upsert — idempotent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:4:// MCP tool handler for ccc_reindex — triggers incremental re-indexing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:56:import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:60:import type { MCPResponse, IntentClassification } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:221:  response: MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:223:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:250:function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:269:function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:296:  response: MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:314:  response: MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:317:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:338:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:339:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:350:  response: MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:352:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:383:function applyPublicationGateToResponse(response: MCPResponse): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:484: * @returns MCP response with ranked search results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:553:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:565:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:593:        return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:612:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:624:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:757:  let responseToReturn: MCPResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1142:      } as MCPResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1336:          } as MCPResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:3:description: "Documentation-only directory for the shared-memory lifecycle surfaced by MCP tools."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:17:- [3. MCP TOOL SURFACE](#3--mcp-tool-surface)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:37:## 3. MCP TOOL SURFACE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:8:import type { MCPResponse, ContextArgs } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:14:export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:29:/** Canonical DB type shared across MCP runtime modules */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:110:export function registerDatabaseRebindListener(listener: DatabaseRebindListener): () => void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:128:function registerVectorIndexListener(nextVectorIndex: VectorIndexLike): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:193:    registerVectorIndexListener(deps.vectorIndex);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md:2:title: "MCP Server Public API"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md:10:# MCP Server Public API
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:30:    throw new Error('Database not initialized. MCP server may not be running. Check server process is active, then retry.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:4:// MCP tool handler for deep_loop_graph_status — reports graph
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:4:// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:20:import { createMCPSuccessResponse, createMCPErrorResponse, createMCPEmptyResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:23:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:109:): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:111:  return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:339:async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:353:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:369:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:384:        return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:482:      return createMCPEmptyResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:520:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:558:async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:575:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:602:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:615:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:628:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:638:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:668:async function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:677:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:734:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:770:async function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:775:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:798:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:820:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:4:// Dispatch for code graph MCP tools: scan, query, status, context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:15:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:28:/** Coerce handler response to MCPResponse (fix type literal narrowing) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:29:function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:42:function validationError(tool: string, missingKeys: string[]): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:56:export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:59:      return toMCP(await handleCodeGraphScan(args as Parameters<typeof handleCodeGraphScan>[0]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:65:      return toMCP(await handleCodeGraphQuery(args as unknown as Parameters<typeof handleCodeGraphQuery>[0]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:68:      return toMCP(await handleCodeGraphStatus());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:70:      return toMCP(await handleCodeGraphContext(args as Parameters<typeof handleCodeGraphContext>[0]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:72:      return toMCP(await handleCccStatus());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:74:      return toMCP(await handleCccReindex(args as Parameters<typeof handleCccReindex>[0]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:80:      return toMCP(await handleCccFeedback(args as unknown as Parameters<typeof handleCccFeedback>[0]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:4:import type { ToolDefinition } from '../tool-schemas.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:174: * Validate tool arguments against the declared MCP input schema.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:2:title: "MCP Server Database Storage"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:11:# MCP Server Database Storage
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:26:This section provides an overview of the MCP Server Database Storage directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:28:`database/` is the canonical runtime persistence location for the default MCP server configuration in this repository.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:30:The MCP server resolves its default database directory through `shared/paths.ts` and `core/config.ts`, which point to `mcp_server/database/` unless `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR`, or `SPECKIT_DB_DIR` override it at runtime.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:80:/** Rough token-to-char ratio: 1 token ~ 4 chars (env-configurable via MCP_CHARS_PER_TOKEN) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:82:const _parsedCPT = parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:61:9. response-builder -- Assemble MCP response envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:4:// Re-exports all tool dispatch modules for context-server (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:14:export type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:30:): Promise<import('./types.js').MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:4:// MCP tool handler for ccc_status — reports CocoIndex availability and stats.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:17:import { createMCPSuccessResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:46:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:225: * @returns MCP response with ablation report or K-sensitivity results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:227:async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:313:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:345:async function handleEvalKSensitivity(args: KSensitivityArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:376:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:388:async function handleEvalReportingDashboard(args: ReportingDashboardArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:401:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md:2:title: "MCP Server Core Modules"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md:3:description: "Runtime configuration, database-state coordination, and shared rebind hooks for the MCP server."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md:10:# MCP Server Core Modules
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md:38:- `db-state.ts` owns `init()`, `checkDatabaseUpdated()`, `reinitializeDatabase()`, embedding-readiness state, constitutional cache accessors, and `registerDatabaseRebindListener()`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:10:import { createMCPErrorResponse, createMCPSuccessResponse } from '../../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:15:import type { MCPResponse } from '../types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:248:export function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:250:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:268:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:284:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:461:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:17:  MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:5:// Re-export canonical MCPResponse from shared
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:6:export type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:8:/** Narrow pre-validated MCP tool args to a specific handler arg type.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:126: * asserted by context-server.vitest.ts. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:4:// MCP tool handler for ccc_feedback — accepts search result quality feedback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:43:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:46:import type { MCPResponse, EmbeddingProfile } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:149:async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:152:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:194:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:311:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:630:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:4:// Non-critical startup checks extracted from context-server.ts (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:93:        console.warn('[context-server] \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:94:        console.warn('[context-server] \u2551  WARNING: Native runtime changed since last install  \u2551');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:95:        console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:97:          `[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion}, ${marker.platform}/${marker.arch})`.padEnd(88) + '\u2551'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:100:          `[context-server] \u2551  Running:   Node ${runtime.nodeVersion} (MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`.padEnd(88) + '\u2551'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:102:        console.warn(`[context-server] \u2551  Mismatch:  ${reasonText}`.padEnd(88) + '\u2551');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:103:        console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:104:        console.warn('[context-server] \u2551  Native modules may crash. Run:                         \u2551');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:105:        console.warn('[context-server] \u2551  bash scripts/setup/rebuild-native-modules.sh           \u2551');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:106:        console.warn('[context-server] \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:109:          `[context-server] Node runtime check: OK (${runtime.nodeVersion}, MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:122:      console.warn('[context-server] Created .node-version-marker for future runtime checks');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:126:    console.warn(`[context-server] Node version check skipped: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:22:  MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:35:function relabelResponseTool(response: MCPResponse, toolName: string): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:76:export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:3:description: "Typed MCP tool dispatch modules, schema validation, and quick-search delegation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:23:`tools/` is the MCP dispatch layer. It maps runtime tool names to validated handler calls and keeps the handler modules grouped by domain.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:32:- `types.ts` - shared MCP response type aliases and typed arg shapes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/README.md:41:- `types.ts` remains the typed boundary for parsed handler arguments and MCP response aliases.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md:2:title: "MCP Server Utilities"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md:5:  - "MCP utilities"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md:12:# MCP Server Utilities
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md:26:This section provides an overview of the MCP Server Utilities directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/utils/README.md:34:- `tool-input-schema.ts`: runtime validation of tool arguments against MCP input schemas (required fields, types, enums, constraints).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:8:import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:55:export async function runMemoryIndexScan(args: MemoryIndexScanArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/index.ts:21:  type MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:138:   2. DATABASE INITIALIZATION (minimal — no MCP, no embeddings)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:156:  // Keep CLI and MCP handlers aligned: handlers invoked from CLI rely on db-state wiring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:431:    console.log(`  Restore:     Use checkpoint_restore MCP tool with name: ${checkpointName}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:483:  // Extract summary from MCP response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:16:  MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:32:export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:17:import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:20:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:31:async function handleMemoryStats(args: StatsArgs | null): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:39:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:41:      error: 'Database refresh failed before query execution. Retry the request or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:50:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:52:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:69:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:79:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:88:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:97:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:106:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:115:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:158:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:282:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:301:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:28:  MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:66:export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:110:      // Flag-off wiring: pass null as graphFn (mirroring context-server.ts behaviour)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:297:      // Simulate the wiring decision in context-server.ts:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:16:  MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:32:export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:2:title: "MCP Server Formatters"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:11:# MCP Server Formatters
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:25:This section provides an overview of the MCP Server Formatters directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:27:`formatters/` converts internal search results into MCP-ready payloads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:23:  createMCPSuccessResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:24:  createMCPEmptyResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:25:  type MCPResponse,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:167:// MCPResponse type is imported from '../lib/response/envelope.js'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:168:export type { MCPResponse };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:396:): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:415:    return createMCPEmptyResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:708:  return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:35:import type { MCPResponse } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:87:import { createMCPErrorResponse } from '../lib/response/envelope.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1079:async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1085:    return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1199:    const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1212:    return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1309:          return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1329:      const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1344:      return createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1440:      return createMCPErrorResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1:# Spec Kit Memory MCP Server: Installation Guide
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:3:> MCP Server v1.7.2 | 2026-03-15
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:16:I want to install Spec Kit Memory MCP server from .opencode/skill/system-spec-kit/mcp_server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:20:2. Install dependencies and build the MCP server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:33:- Build the MCP server via `npm run build`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:34:- Configure the MCP server for your AI platform
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:60:Spec Kit Memory is an MCP (Model Context Protocol) server that gives AI assistants semantic memory and context retrieval. It indexes markdown documentation and conversation memories to surface relevant information during AI interactions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:72:                                  │ MCP stdio
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:75:│              Spec Kit Memory MCP Server (Node.js)               │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:112:| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP entry script |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:131:The repo contains checked-in MCP wiring for OpenCode, Claude Code, Codex, Gemini, and VS Code / Copilot, but startup-context surfacing is not identical across those runtimes:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:133:| Runtime | Checked-in MCP config | Startup / recovery surface currently visible in repo |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:135:| OpenCode | `opencode.json` | MCP wiring is checked in. A plugin-based startup digest implementation exists under `.opencode/plugins/`, but repo registration of that plugin is runtime-dependent and not shown in `opencode.json`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:138:| Gemini | `.gemini/settings.json` | Checked-in MCP config plus SessionStart / PreCompress / BeforeAgent / SessionEnd hook wiring. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:139:| Copilot | `.vscode/mcp.json` | Checked-in MCP wrapper config. Startup banner code and wrapper scripts exist, but tracked `.github/hooks/superset-notify.json` still points at the Superset hook path, so local startup-hook behavior must be verified per environment. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:141:`Claude Desktop` remains documented here as a generic MCP configuration example, but it is outside the repo-checked runtime set above. Treat this table as repository configuration evidence, not as a blanket claim of live startup parity in every client.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:163:3. **MCP client**: OpenCode, Claude Code, Codex CLI, Gemini CLI, or Copilot MCP/VS Code integration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:165:`Claude Desktop` is also shown below as a generic MCP configuration example.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:206:- `@modelcontextprotocol/sdk` (MCP protocol implementation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:214:### Step 3: Build the MCP Server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:229:ls mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:237:- [ ] `mcp_server/dist/context-server.js` exists
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:258:node mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:259:# Process starts and waits for MCP stdio input
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:294:        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:315:- `.claude/mcp.json` for MCP server registration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:334:        "/Users/YOUR_USERNAME/path/to/project/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:366:        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:391:ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:417:### Step 2: Check That the MCP Server Is Loaded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:422:What MCP tools are available?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:464:- [ ] MCP server appears in the tool list
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:469:❌ **STOP if validation fails.** Check your MCP configuration, restart the client and consult the Troubleshooting section.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:477:The MCP server starts automatically when your AI client launches. No manual start is required.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:480:# Start your AI client; the MCP server starts in the background
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:667:node mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:744:### Example 8: Troubleshooting Codex MCP Startup Failure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:747:# Symptom: Codex cannot initialize spec_kit_memory MCP server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:754:# All MCP server logging must use stderr (console.error).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:755:# stdout is reserved for MCP JSON-RPC protocol messages.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:793:| Database appears stale after restore | Client still uses old MCP process with in-memory state | Fully restart OpenCode or Claude Code |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:794:| MCP server not in tools list | Configuration file error or path is wrong | Validate JSON syntax and verify binary path (see below) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:863:Recovery: ask your AI "Index all memory files" (calls `memory_index_scan({ force: true })`). Restart your MCP client after manual database operations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:865:**MCP server not appearing in tools**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:873:   ls -la .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:890:After restoring a database backup or switching branches, the MCP server process may hold cached state from the previous database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:899:The MCP process loads the database on startup. A client reload does not always restart the MCP server process.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:944:node mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:980:| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP server entry point |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1007:node mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1037:SMOKE TEST:   node mcp_server/dist/context-server.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1053:- MCP package manifest: `.opencode/skill/system-spec-kit/mcp_server/package.json`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:2:title: "Spec Kit Memory - MCP Server"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:5:  - "MCP server"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:15:# Spec Kit Memory - MCP Server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:47:Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:55:| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:129:node dist/context-server.js --help
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:132:### Add to Your MCP Configuration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:145:        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:163:      "args": ["/absolute/path/to/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:174:After connecting your MCP client, call the health check:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:555:All 47 tools listed by architecture layer. Each entry has a plain-language description and a parameter table. For full Zod schemas with types and defaults, see `tool-schemas.ts`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1042:The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1217:├── context-server.ts          # MCP entry point and runtime bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1220:├── tool-schemas.ts            # Tool definition source of truth
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1226:├── handlers/                  # MCP tool handlers plus save/index helper modules
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1244:| `context-server.ts` | Starts the MCP listener, performs runtime bootstrap, and registers all 47 tools. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1246:| `tool-schemas.ts` | Defines every tool name, description and parameter schema in one place. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1278:Codex note: if the active Codex runtime cannot write inside the repository, set `MEMORY_DB_PATH` to a writable location (for example under your home directory or `/tmp`) so the MCP server can create and update the SQLite database safely.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1299:| `SPECKIT_STRICT_SCHEMAS` | `true` | Strict Zod validation for MCP tool inputs |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1301:| `SPECKIT_DYNAMIC_INIT` | `true` | Inject live startup memory/index summary into MCP init |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1625:**What you see**: `node dist/context-server.js` exits with a module error or `MEMORY_DB_PATH`/database-path error.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1632:node --input-type=module -e "await import('./dist/context-server.js')" 2>&1 | head -20
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1642:| Tools not appearing in MCP client | Restart the MCP client after config changes |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1681:Nothing. Memories live in the local SQLite database, not inside any AI's context. When you connect a different model to the same MCP server, it reads from the same database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1742:| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Full installation: embedding providers, database setup, MCP client config, verification |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1756:| [Model Context Protocol Spec](https://modelcontextprotocol.io) | Official MCP specification and client documentation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:40:      // Should either return a valid MCP response or throw a DB/infra error,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:100:// Module-level mutable state: safe in a single-process MCP server.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:107:// for new sessions on long-lived MCP servers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:115:/** T018: Update last tool call timestamp (called from context-server dispatch). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:522:    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/lifecycle-shutdown.vitest.ts:38:    expect(errorSpy).toHaveBeenCalledWith('[context-server] test-step cleanup failed:', error.message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/lifecycle-shutdown.vitest.ts:51:    expect(errorSpy).toHaveBeenCalledWith('[context-server] async-step cleanup failed:', error.message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:14:import { TOOL_DEFINITIONS, getSchema, validateToolArgs } from '../tool-schemas';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:240:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:243:describe('memory_search limit contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:246:      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:252:      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:258:      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:264:      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:270:      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:276:      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:282:      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:288:      validateToolArgs('memory_search', { concepts: ['solo'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:292:  it('public schema rejects unknown memory_search parameters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:294:      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:300:      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:304:  it('runtime rejects unknown memory_search parameters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:306:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:312:      validateToolArgs('memory_search', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:13:import type { MCPResponse } from '../handlers/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:15:type ErrorHelpers = Partial<Record<'createMCPSuccessResponse' | 'createMCPErrorResponse', unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:21:function hasStructuredContentError(result: MCPResponse): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:91:    it('T532-4: All handlers return MCP-formatted errors (not raw throws)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:92:      const handlers: Array<{ name: string; run: () => Promise<MCPResponse> }> = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:138:          // If no error thrown, handler may return error in MCP response format
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:183:    it('T532-8: MCP response helpers or MemoryError serialization available', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:186:      const hasCreateResponse = typeof errorHelpers.createMCPSuccessResponse === 'function';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:187:      const hasCreateError = typeof errorHelpers.createMCPErrorResponse === 'function';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:106:- Re-run the UX regression suite and the full MCP package test suite after changing the save contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:31:- `response-hints.ts`: auto-surface hint injection plus MCP JSON envelope metadata and token-count synchronization.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:33:- It is not a standalone MCP hook registration system.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:37:The `claude/` subdirectory contains hook scripts for Claude Code lifecycle events (PreCompact, SessionStart, Stop). These run as external processes triggered by Claude Code, not as MCP server modules:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:69:- auto-surface response hints enrich the MCP JSON envelope `hints` and `meta.autoSurface`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:3:description: "Session management for the Spec Kit Memory MCP server. Handles session deduplication, crash recovery and context persistence."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:12:> Session management for the Spec Kit Memory MCP server. Handles deduplication and crash recovery with context persistence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:33:The session layer provides all session-related operations for the Spec Kit Memory MCP server. It prevents duplicate context injection (saving ~50% tokens on follow-up queries) and enables crash recovery with immediate SQLite persistence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:102:**Purpose**: Zero data loss on MCP server crash or context compaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:300:| `context-server.ts` | MCP server that uses session layer |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:118:    it('T521-C5: Returns MCP error response when checkpoint storage create fails', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:345:    it('T521-R4: Returns MCP error response when restore reports errors with no restored data', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:362:    it('T521-R5: Returns MCP success-with-warning when restore is partial', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:382:    it('T521-R5b: Returns MCP error response when restore reports partial failure after data changes', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:70:describe('MCP stdio logging safety', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:13:import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:17:   Helper: Parse MCP response envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:32:type SearchResultsEnvelope = MCPEnvelope<SearchResultsResponseData>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:34:function parseEnvelope(response: MCPResponse): SearchResultsEnvelope {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:41:    throw new Error('Expected text MCP content');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:236:  it('C8: Response is valid MCP envelope structure', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:5:// Collects events during MCP tool dispatch and computes quality scores.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:394:      const searchKey = generateCacheKey('memory_search', { query: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:2:import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:232:function parseEnvelope(response: MCPResponse): MCPEnvelope<{ results: MemoryResultEnvelope[] }> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:239:  return JSON.parse(firstContent.text) as MCPEnvelope<{ results: MemoryResultEnvelope[] }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:2:// Verifies current shared-provider architecture and MCP facade.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:257:  describe('MCP embeddings facade', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:234:  it('returns an MCP database-unavailable envelope when bulk delete cannot open the database', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:65:    it('T516-3: Missing query and concepts returns MCP error', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:95:    it('T516-6: Single concept without query returns MCP error', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:3:Hook scripts for Claude Code lifecycle events. These run as external Node.js processes triggered by Claude Code, not as MCP server modules.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:27:Hooks registered in `.claude/settings.local.json`. Compiled JS at `dist/hooks/claude/`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:13:  delete process.env.MCP_SERVER_NAME;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:98:      delete process.env.MCP_SERVER_NAME;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:130:      delete process.env.MCP_SERVER_NAME;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:144:      delete process.env.MCP_SERVER_NAME;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:6:/** Parse the JSON payload from an MCP response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:42:  it('T006-L2: Non-boolean includeChunks returns MCP error response with requestId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:114:  it('T006-L9: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:177:    it('T519-L1: Non-string specFolder returns MCP error response', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:203:    it('T519-S1: Invalid folderRanking returns MCP error response', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:214:    it('T519-S2: Non-array excludePatterns returns MCP error response', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:4:// All MCP tool definitions (names, descriptions, input schemas).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:5:// Extracted from context-server.ts for maintainability (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:12: * Re-export schema validation helpers used by the MCP tool entry points.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:27: * Normalized definition for a single MCP tool and its JSON schema.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:418:    // oneOf/not removed — Claude Code MCP client rejects top-level oneOf/anyOf/allOf/not
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:486:  // oneOf removed from property definitions — Claude Code MCP client rejects nested oneOf in some cases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:876: * Canonical ordered list of MCP tool registrations exposed by this server.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:102:| Chars per token | 4 | `MCP_CHARS_PER_TOKEN` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:103:| Max tokens | 8000 | `MCP_MAX_MEMORY_TOKENS` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:104:| Warning threshold | 80% | `MCP_TOKEN_WARNING_THRESHOLD` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:112:| `< MCP_MIN_CONTENT_LENGTH` | Hard fail (`PF031`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:113:| `>= CHUNKING_THRESHOLD` and `<= MCP_MAX_CONTENT_LENGTH` | Warning (`PF030`) with chunking guidance |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:114:| `> MCP_MAX_CONTENT_LENGTH` | Hard fail (`PF030`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:116:Default cap is `MCP_MAX_CONTENT_LENGTH=250000` (250KB), configurable via environment.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:293:| [../../context-server.ts](../../context-server.ts) | MCP server using validation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:301:MCP_CHARS_PER_TOKEN=4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:302:MCP_MAX_MEMORY_TOKENS=8000
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:303:MCP_TOKEN_WARNING_THRESHOLD=0.8
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:306:MCP_MIN_CONTENT_LENGTH=10
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:307:MCP_MAX_CONTENT_LENGTH=250000
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:310:MCP_DUPLICATE_THRESHOLD=0.95
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:313:MCP_ANCHOR_STRICT=true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:272:    constitutional: '',   // Constitutional rules come from Memory MCP, not available in hooks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:339:    __testables.registerGlobalRefreshFn(() => {});
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:366:  it('registered callback is invoked after delay', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:368:    __testables.registerGlobalRefreshFn(() => { called.push(Date.now()); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:730:    __testables.registerLlmBackfillFn((id) => { backfilledIds.push(id); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:742:    __testables.registerLlmBackfillFn((id) => { backfilledIds.push(id); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:792:  it('registered global refresh fn is called after scheduled delay', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:796:    __testables.registerGlobalRefreshFn(() => { log.push('global-refresh'); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:240:  if (!db) throw new Error('Database not initialized. The checkpoints module requires the MCP server to be running. Restart the MCP server and retry.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:14:type MCPTextResponse = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:19:type MCPEnvelope = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:26:function parseEnvelope(response: unknown): { envelope: MCPEnvelope; isError: boolean } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:27:  const cast = response as MCPTextResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:29:  const envelope = JSON.parse(cast.content[0].text) as MCPEnvelope;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:33:function expectErrorCode(response: unknown, expectedCodes: string[]): MCPEnvelope {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:239:  charsPerToken: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:240:  max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:241:  warning_threshold: parseFloat(process.env.MCP_TOKEN_WARNING_THRESHOLD || '0.8'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:244:  min_content_length: parseInt(process.env.MCP_MIN_CONTENT_LENGTH || '10', 10),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:245:  max_content_length: parseInt(process.env.MCP_MAX_CONTENT_LENGTH || '250000', 10),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:249:  similar_duplicate_threshold: parseFloat(process.env.MCP_DUPLICATE_THRESHOLD || '0.95'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:252:  anchor_validation_strict: process.env.MCP_ANCHOR_STRICT === 'true',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:5:const sourcePath = path.resolve(__dirname, '../context-server.ts');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:8:describe('context-server error envelope handling', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:9:  it('wraps buildErrorResponse output with wrapForMCP', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:11:    expect(sourceCode).toMatch(/return wrapForMCP\(errorResponse\s+as\s+any,\s*true\)/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:14:  it('falls back to createMCPErrorResponse when envelope building fails', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:16:    expect(sourceCode).toMatch(/Failed to build MCP error envelope/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts:17:    expect(sourceCode).toMatch(/return createMCPErrorResponse\(\{/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:50:  it('returns MCPResponse with content array', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-error-format.vitest.ts:1:// TEST: MCP ERROR FORMAT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-error-format.vitest.ts:46:describe('MCP Protocol Error Format Tests (T535) [deferred - requires DB test fixtures]', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:5:  'what imports createMCPResponse',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:16:    const { maybeStructuralNudge } = await import('../context-server.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:31:    const { maybeStructuralNudge } = await import('../context-server.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:45:    const { maybeStructuralNudge } = await import('../context-server.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:285:function initExtractionAdapter(database: Database.Database, registerCallback: RegisterAfterToolCallback): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:288:  registerCallback(handleAfterTool);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:82:    it('T517-3: Missing prompt returns MCP validation error', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:93:    it('T517-4: Null prompt returns MCP validation error', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:103:    it('T517-5: Empty string prompt returns MCP validation error', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:112:    it('T517-6: Non-string prompt returns MCP validation error', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:30:The `ops/` directory provides two background operation modules that keep the memory index current without blocking the main MCP request path:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1718:    it('returns an MCP error response when V-rule validation is unavailable in fail-closed mode', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:8:/** Parse the JSON payload from an MCP response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:138:  it('T007a-S6: Non-array excludePatterns returns MCP error response with requestId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:179:  it('T007a-S11: Invalid folderRanking returns MCP error response with requestId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:210:  it('T007a-S14: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:400:  describe('MCP Response Format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:401:    it('T523-MCP1: content[0].type is text', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:410:    it('T523-MCP2: content[0].text is valid JSON', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:1:// TEST: MCP TOOL DISPATCH
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:72:describe('MCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures]', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:15:const SOURCE_FILE = path.join(SERVER_DIR, 'context-server.ts')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:16:const TOOL_SCHEMAS_FILE = path.join(SERVER_DIR, 'tool-schemas.ts')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:114:    // T6: parseArgs with extra fields (MCP may pass unexpected args)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:209:    it('T11b: context-server uses TOOL_DEFINITIONS', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:258:    it('T15b: context-server imports scoring observability init', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:264:    it('T15c: context-server initializes scoring observability at startup', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:377:      '../tool-schemas',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:429:      registerAfterToolCallback: (fn: (tool: string, callId: string, result: unknown) => Promise<void>) => void
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:442:      registeredProcessHandlers: Map<string, Array<(...args: any[]) => unknown>>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:499:      const registeredProcessHandlers = new Map<string, Array<(...args: any[]) => unknown>>()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:564:        const handlersForEvent = registeredProcessHandlers.get(key) ?? []
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:566:        registeredProcessHandlers.set(key, handlersForEvent)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:613:      vi.doMock('../tool-schemas', () => ({ TOOL_DEFINITIONS: options?.toolDefinitions ?? [] }))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:743:            console.error(`[context-server] ${label} cleanup failed:`, msg)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:749:            console.error(`[context-server] ${label} cleanup failed:`, msg)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:762:        createMCPErrorResponse: vi.fn((data: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: true })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:763:        wrapForMCP: vi.fn((data: unknown, isError?: boolean) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: isError ?? false })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:815:      const module = await import('../context-server')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:823:          console.error('[context-server] Fatal error:', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:846:        registerAfterToolCallback: module.registerAfterToolCallback,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:856:        registeredProcessHandlers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:882:    it('T000c: registerAfterToolCallback(fn) exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:883:      expect(sourceCode).toMatch(/export\s+function\s+registerAfterToolCallback\(fn:\s*AfterToolCallback\):\s*void/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:901:      const { registerAfterToolCallback, dispatchToolMock, callToolHandler } = await loadRuntimeHarness()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:920:      registerAfterToolCallback(callbackSpy)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:923:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:940:      expect(callArgs[0]).toBe('memory_search')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:948:      const { registerAfterToolCallback, dispatchToolMock, callToolHandler } = await loadRuntimeHarness()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:954:      registerAfterToolCallback(async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:959:      registerAfterToolCallback(async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:977:      const { registerAfterToolCallback, dispatchToolMock, callToolHandler } = await loadRuntimeHarness()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:985:      registerAfterToolCallback(async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1050:              name: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1099:        memoryAwareTools: new Set<string>(['memory_search']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1109:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1127:        memoryAwareTools: new Set<string>(['memory_context']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1153:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1160:        memoryAwareTools: new Set<string>(['memory_context']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1173:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1375:    it('T000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1425:        String(call?.[0] ?? '').includes('[context-server] toolCache cleanup failed:')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1443:        String(call?.[0] ?? '').includes('[context-server] fileWatcher cleanup failed:')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1455:      // MCPResponse was moved to shared/types.ts and re-exported via 'export type'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1456:      { name: 'MCPResponse', requiredFields: ['content'], source: 'sharedTypes' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1531:    // T22: Error response is wrapped as an MCP error envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1533:      expect(sourceCode).toMatch(/wrapForMCP\(errorResponse\s+as\s+any,\s*true\)/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1536:    it('T22b: catch path wraps buildErrorResponse output with wrapForMCP', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1537:      expect(sourceCode).toMatch(/return\s+wrapForMCP\(errorResponse\s+as\s+any,\s*true\)/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1540:    it('T22c: catch path falls back to createMCPErrorResponse when envelope building fails', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1541:      expect(sourceCode).toMatch(/return\s+createMCPErrorResponse\(\{/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1544:    it('T22d: source logs fallback envelope-build failures before returning createMCPErrorResponse', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1545:      expect(sourceCode).toMatch(/Failed to build MCP error envelope/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1546:      expect(sourceCode).toMatch(/createMCPErrorResponse\(\{/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1559:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1577:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1610:    it('T28: L1 budget = 3500 (memory_context)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1615:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1618:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1623:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1907:    it('T35: Server name is "context-server"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1910:      expect(serverName![1]).toBe('context-server')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1934:    it('T39: SIGTERM handler registered', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1939:    it('T40: SIGINT handler registered', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1944:    it('T41: uncaughtException handler registered', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1949:    it('T42: unhandledRejection handler registered', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2080:      'memory_context': '[L1:Orchestration]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2081:      'memory_search': '[L2:Core]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2231:      { module: '@modelcontextprotocol/sdk/server/index.js', name: 'MCP SDK Server' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2232:      { module: '@modelcontextprotocol/sdk/server/stdio.js', name: 'MCP SDK Stdio' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2233:      { module: '@modelcontextprotocol/sdk/types.js', name: 'MCP SDK Types' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2235:      { module: './tool-schemas.js', name: 'Tool schemas (T303)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2275:    // Local replica of DynamicMemoryStats (mirrors context-server.ts interface)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2308:        `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2332:      expect(result).toContain('Spec Kit Memory MCP')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2338:      expect(result).toContain('memory_search')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:19:import { TOOL_DEFINITIONS } from '../tool-schemas';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:22:  it('throws ToolSchemaValidationError for an unregistered tool name', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:287:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:296:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:302:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:310:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:311:    expect(resp.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:318:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:328:  it('F7: Tool-specific hints included for memory_search + E001', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:330:    const resp = buildErrorResponse('memory_search', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:353:    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:470:    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:6:// Called by the coverage-graph MCP query handler.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:361:      'presentation stage formats results for the MCP response envelope.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:115:    it('initExitHandlers registers beforeExit, SIGTERM, SIGINT listeners', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:3:import { TOOL_DEFINITIONS } from '../tool-schemas';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:112:        memory_search: 'L2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:146:    it('every registered tool has a layer definition', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:179:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:180:        { tool: 'memory_search', expected: '[L2:Core]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:206:      const result = mod.enhanceDescription('memory_context', 'Some description text');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:212:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:237:        { tool: 'memory_context', expected: 3500 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:238:        { tool: 'memory_search', expected: 3500 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:255:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:265:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:272:      expect(info.tools).toContain('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:276:      const info1 = mod.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:277:      const info2 = mod.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:286:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:415:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:35:interface EnhancedMCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:127:function hybridSearchEnhanced(query: string, mode: string, flags: Record<string, boolean>): EnhancedMCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:272:  // ---- T10: Response structure matches EnhancedMCPResponse ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:2:title: "MCP Server Test Suite"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:3:description: "Vitest-based unit, integration, handler, eval, and regression coverage for the MCP server."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:10:# MCP Server Test Suite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:27:The `tests/` directory is the Vitest suite for the MCP server. As of this audit, the root inventory contains 329 `.vitest.ts` files plus the `fixtures/` support directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:33:- MCP handler dispatch, response envelopes, validation, and runtime startup behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:84:| Handler and protocol surface | `handler-memory-search.vitest.ts`, `handler-memory-save.vitest.ts`, `mcp-input-validation.vitest.ts`, `mcp-response-envelope.vitest.ts`, `startup-checks.vitest.ts` | MCP entrypoints and server-facing responses |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:108:- `context-server-error-envelope.vitest.ts`, `envelope.vitest.ts`, and `response-profile-formatters.vitest.ts` - serialized response and profile behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:5:// In MCP servers, stdout is reserved for JSON-RPC — diagnostic
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1058:    it('EXT-H12: response follows MCP envelope format', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:32:The utils module provides foundational utilities used throughout the MCP server. These include date formatting and path traversal security (re-exported from `@spec-kit/shared`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:68:| `logger.ts` | Structured logging utilities for MCP server operations |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:101:| Structured logging | Consistent log output for MCP server operations |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:40:// These return valid MCP response shapes so the strategy executors succeed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:828:    it('returns an error envelope when the routed strategy returns an MCP error response', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:5:// Active tests: directory structure, module line counts, context-server imports
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:13:const MCP_SERVER_PATH = path.join(__dirname, '..');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:21:  'context-server.js': 1450,        // actual: 1421 — Main entry point wiring for tools, hooks, startup lifecycle, startup root discovery, session priming, remediation hooks, and Phase 024 session recovery digest
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:90:      const dirPath = path.join(MCP_SERVER_PATH, dir);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:100:    'context-server.js',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:101:    'tool-schemas.js',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:128:      const filePath = path.join(MCP_SERVER_PATH, 'dist', mod);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:151:    { label: 'tool schemas', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/tool-schemas\.js['"]/ },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:155:    it(`Import: ${imp.label} found in context-server.js`, () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:156:      const contextServerPath = path.join(MCP_SERVER_PATH, 'dist', 'context-server.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md:32:The providers module handles embedding generation and retry logic for the Spec Kit Memory MCP server. It provides a unified abstraction layer for multiple embedding providers (Voyage AI, OpenAI) with exponential backoff retry management for reliable embedding generation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:293:| [../../README.md](../../README.md) | MCP server overview |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:341:    // Extract from MCPResponse envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/cleanup-helpers.ts:8:    console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/cleanup-helpers.ts:17:    console.error(`[context-server] ${label} cleanup failed:`, get_error_message(error));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:106:const _parsedMaxLen = parseInt(process.env.MCP_MAX_CONTENT_LENGTH || '250000', 10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:133:/** Parse the JSON envelope from an MCP response */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1741:   SUITE: MCP Response Envelope Structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1744:describe('MCP Response Envelope Structure', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:128:        'compiler optimization', 'register allocation', 'loop unrolling',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:4:// Tests for empty transcript, MCP unavailable, expired cache,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:750:      createMCPSuccessResponse: vi.fn((payload: unknown) => payload),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:751:      createMCPErrorResponse: vi.fn((payload: unknown) => payload),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:138:  it('rebinds all registered database consumers when the vector index swaps connections directly', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:8:import type { MCPResponse } from '../handlers/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:37:function parseResponsePayload(response: MCPResponse): SearchEnvelopePayload {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:7:/** Parse the JSON response text from an MCP response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:135:  it('T007b-H9: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:18:type MCPResult = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:66:  operation: Promise<MCPResult>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:4:// Tests for the MCP tool surface that exposes coverage graph
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:11: * Coverage Graph MCP Tool contract tests.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:14: * reducer and MCP server. The actual MCP tool handlers will be
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:83:      // Contract: MCP should reject and increment rejected count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:200:    it('priority 3: SQLite projection is MCP-maintained', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:202:      // MCP may not always be available
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:207:      // Contract: even without MCP, the reducer must produce
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:241:| [../../README.md](../../README.md) | MCP server overview |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:6:const MCP_SERVER_ROOT = path.join(__dirname, '..');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:7:const SKILL_ROOT = path.join(MCP_SERVER_ROOT, '..');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:18:  return path.join(MCP_SERVER_ROOT, relativePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:11:  wrapForMCP,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:106:    it('should wrap success response with isError=false in MCP format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:113:      const mcpResponse = wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:210:          actions: ['Verify VOYAGE_API_KEY is set', 'Restart MCP server'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:218:      expect(envelope.hints).toContain('Restart MCP server');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:393:    it('should preserve cacheHit through MCP wrapper', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:401:      const mcpResponse = wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:417:  describe('MCP wrapper integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:418:    it('should wrap envelope in MCP content format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:425:      const mcpResponse = wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:439:      const mcpResponse = wrapForMCP(errorEnvelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:451:      const mcpResponse = wrapForMCP(envelope, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:463:      const mcpResponse = wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:129:  it('T036: rule matching covers CLI and MCP tool aliases', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:32:The errors subsystem provides standardized error handling for the Spec Kit Memory MCP server. Every error includes a code and message paired with actionable recovery guidance to help agents self-diagnose and resolve issues across memory operations and document-aware indexing/search paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:184:| [../../context-server.ts](../../context-server.ts) | MCP server using error system |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:63:      createMCPResponse: vi.fn(({ data }: { data: Record<string, unknown> }) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:71:      createMCPErrorResponse: vi.fn(({ error }: { error: string }) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:26:  if (env.CLAUDE_CODE === '1' || env.CLAUDE_SESSION_ID || env.MCP_SERVER_NAME === 'context-server') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:5:const MCP_SERVER_ROOT = path.join(__dirname, '..');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:6:const SKILL_ROOT = path.join(MCP_SERVER_ROOT, '..');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:48: * Example: `SPECKIT_PARSER=regex node context-server.js`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:1:// TEST: MCP INPUT VALIDATION
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:183:describe('MCP Protocol Input Validation (T534) [deferred - requires DB test fixtures]', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:6:// 7-Layer MCP Architecture with Token Budgets
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:167:  // T205-C: Dispatch-Level Enforcement (context-server.ts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:172:        path.join(PROJECT_ROOT, 'context-server.ts'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:180:        path.join(PROJECT_ROOT, 'context-server.ts'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:190:        path.join(PROJECT_ROOT, 'context-server.ts'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:198:        path.join(PROJECT_ROOT, 'context-server.ts'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:56:- Purpose: Owns the 7-layer MCP architecture metadata and token-budget guidance used to group tools into orchestration, core, discovery, mutation, lifecycle, analysis, and maintenance layers. It is the canonical place for layer definitions and layer-to-tool lookup behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:189:  - `context-server.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:284:- Purpose: Owns the standard MCP response envelope used to make tool results predictable for agents and callers. It is the canonical place for `{summary, data, hints, meta}` shaping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:3:description: "7-layer MCP architecture with token budgets and document-aware routing."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:12:> 7-layer MCP architecture with token budgets and document-aware routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:32:The architecture module defines the 7-layer MCP tool organization (T060) that enables progressive disclosure from high-level orchestration to specialized operations. This layer model also frames document-aware behavior (spec documents, memory notes, constitutional files) used across indexing and retrieval.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:169:| `context-server.ts` | Uses layer definitions for tool organization |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:6:// for the MCP-maintained SQLite graph projection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:15: * MCP implementation will be wired in Phase 3; these tests
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:200:      'Verify the MCP server has access to the file location',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:239:      'Restart the MCP server to reinitialize connection'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:287:      'Restart the MCP server to reinitialize the database connection',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:660:      'If persistent, restart the MCP server'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:1:// TEST: MCP RESPONSE ENVELOPE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:9:import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:19:function parseEnvelope(response: MCPResponse): MCPEnvelope<SearchEnvelopeData> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:25:    throw new Error('Missing MCP content payload');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:30:    throw new Error('MCP content payload is not a JSON string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:33:  return JSON.parse(firstContent.text) as MCPEnvelope<SearchEnvelopeData>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:36:function getFirstResult(envelope: MCPEnvelope<SearchEnvelopeData>): MemoryResultEnvelope {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:80:describe('MCP Protocol Response Envelope (T536)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:81:  it('T536-1: returns MCP content envelope with parseable JSON payload', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:4:import type { MCPResponse } from '../handlers/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:9:import type { MCPEnvelope } from '../lib/response/envelope';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:19:function parseEnvelope(response: MCPResponse): MCPEnvelope<TriggerEnvelopeData> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:20:  return JSON.parse(response.content[0].text) as MCPEnvelope<TriggerEnvelopeData>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:98:    it('T527-6: Trigger handler is async (returns MCP envelope)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:105:    it('T527-7: Invalid input propagates as MCP error response', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:192:- Re-run the pipeline enforcement suite and the full MCP package test suite after changing the save contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:3:description: "Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:15:> Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:22:- **CocoIndex** (semantic, external MCP): finds relevant code by concept
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:24:- **Memory** (session, existing MCP): preserves decisions and context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:5:import type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:73:function parseErrorEnvelope(result: MCPResponse): Record<string, unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:88:function invokeMemoryContext(args: Record<string, unknown>): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:244:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:251:    const result: MCPResponse = await invokeMemoryContext({ input: null });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:257:    const result: MCPResponse = await handleMemoryContext({ input: '   ' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:263:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:269:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:275:    const result: MCPResponse = await handleMemoryContext({ input: '\n\n\n' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:281:    const result: MCPResponse = await handleMemoryContext({ input: '\t\t\t' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:291:    const result: MCPResponse = await invokeMemoryContext({ input: undefined });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:698:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:704:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:777:    const result: MCPResponse = await invokeMemoryContext({ input: 12345 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:783:    const result: MCPResponse = await invokeMemoryContext({ input: ['test', 'array'] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:789:    const result: MCPResponse = await invokeMemoryContext({ input: { nested: 'object' } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:795:    const result: MCPResponse = await invokeMemoryContext({ input: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:801:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:807:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:813:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:821:  it('T098: Response follows MCP format', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:822:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:828:    const result: MCPResponse = await handleMemoryContext({ input: '' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:833:    const result: MCPResponse = await invokeMemoryContext({});
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:888:    // Create a mock result that mimics the MCPResponse structure from strategy executors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:899:      meta: { tool: 'memory_search' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:32:The cache module provides in-memory caching for MCP tool outputs to reduce redundant operations and improve response times. It uses SHA-256 hashed keys for deterministic cache lookups and supports automatic TTL-based expiration. Cache invalidation is especially important for spec document indexing and document-aware retrieval flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:95:      "query": "what decisions shaped the architecture of the 7-layer MCP tool hierarchy",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:185:      "query": "Kubernetes deployment manifest for the MCP server",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:190:      "expectedResultDescription": "Should return NO relevant results. The MCP server is a Node.js local process; there is no Kubernetes or containerization setup.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:191:      "notes": "Hard negative — plausible-sounding query (it IS an MCP server!) but the deployment context does not exist. Tests whether surface-level term matches ('MCP server') cause false positives."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:210:      "expectedResultDescription": "Should return NO relevant results. The API is MCP (Model Context Protocol) over JSON-RPC, not GraphQL. No schema definition language files exist.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:265:      "query": "what rationale drove the token budget assignments per MCP layer",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:545:      "query": "what are the exact MCP tool names exposed by the spec kit memory server",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:550:      "expectedResultDescription": "Should surface tool-schemas.ts or SKILL.md section listing all 20+ memory_* tool names and their layer classification.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:551:      "notes": "Factual find_spec query about the public API surface of the MCP server."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:615:      "query": "spec kit memory MCP server initialization",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:620:      "expectedResultDescription": "Should surface server initialization documentation, SKILL.md sections about MCP server startup, and any init-related spec memories.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:730:      "expectedResultDescription": "Should surface tool comparison documentation in SKILL.md or tool-schemas.ts explaining L1 vs L2 routing.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1035:      "query": "Docker compose configuration for the spec kit memory MCP server",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1041:      "notes": "Hard negative — Docker is common infrastructure but absent here. \"MCP server\" surface match is a false positive risk."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:100:  createMCPSuccessResponse: (payload: unknown) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts:103:  createMCPErrorResponse: (payload: unknown) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:75:  delete process.env.MCP_SERVER_NAME;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:107:  delete process.env.MCP_SERVER_NAME;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:5:// Provides the code_graph_context MCP tool implementation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:2:title: "MCP Server Configuration Files"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:13:# MCP Server Configuration Files
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:28:This section provides an overview of the MCP Server Configuration Files directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md:54:Important: feature-flag and shared-memory enablement checks are resolved at runtime in helper functions such as `isSharedMemoryEnabled()` and the various `is*Enabled()` lookups under `lib/` and `handlers/`; do not treat this folder as a frozen startup snapshot of MCP behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:433: * Apply a profile to an MCP response envelope text (JSON string).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:443: * @param envelopeText - JSON string of the MCP response envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:14:> Operational entry points for maintenance tasks that run outside the normal MCP request lifecycle, such as forced full-reindex of embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:5:// from local code graph + hook state (no MCP round-trip).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:44:const envSchema = z.object({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:3:description: "Envelope helpers, MCP wrappers, and response-profile formatting for memory tool responses."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:24:`lib/response/` standardizes how MCP tool handlers build envelopes, wrap them for MCP transport, and optionally compress them into profile-shaped outputs for specific consumers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:32:| `envelope.ts` | Envelope factories, MCP wrappers, default hints, and serialized token-count synchronization |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:39:- `envelope.ts` exports `createResponse()`, `createSuccessResponse()`, `createEmptyResponse()`, `createErrorResponse()`, `wrapForMCP()`, `createMCPResponse()`, `createMCPSuccessResponse()`, `createMCPEmptyResponse()`, and `createMCPErrorResponse()`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:28: * Describes the MCPEnvelope shape.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:30:export interface MCPEnvelope<T = unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:83:// Re-export canonical MCPResponse from shared (REC-010)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:87:export type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:88:import type { MCPResponse } from '@spec-kit/shared/types';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:99:function serializeEnvelope<T>(envelope: MCPEnvelope<T>): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:116:export function syncEnvelopeTokenCount<T>(envelope: MCPEnvelope<T> | EnvelopeRecord): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:136:export function serializeEnvelopeWithTokenCount<T>(envelope: MCPEnvelope<T> | EnvelopeRecord): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:168:export function createResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:191:  const envelope: MCPEnvelope<T> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:205:export function createSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPEnvelope<T> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:215:export function createEmptyResponse(options: CreateEmptyResponseOptions): MCPEnvelope<{ count: number; results: never[]; [key: string]: unknown }> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:240:export function createErrorResponse(options: CreateErrorResponseOptions): MCPEnvelope<{ error: string; code: string; details: Record<string, unknown> }> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:278:// 4. MCP RESPONSE WRAPPER
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:282: * Provides the wrapForMCP helper.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:284:export function wrapForMCP<T>(envelope: MCPEnvelope<T>, isError: boolean = false): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:298: * Provides the createMCPResponse helper.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:300:export function createMCPResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:302:  return wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:306: * Provides the createMCPSuccessResponse helper.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:308:export function createMCPSuccessResponse<T = unknown>(options: CreateResponseOptions<T>): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:310:  return wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:314: * Provides the createMCPEmptyResponse helper.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:316:export function createMCPEmptyResponse(options: CreateEmptyResponseOptions): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:318:  return wrapForMCP(envelope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:322: * Provides the createMCPErrorResponse helper.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:324:export function createMCPErrorResponse(options: CreateErrorResponseOptions): MCPResponse {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:326:  return wrapForMCP(envelope, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:2:title: "MCP Server Library"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:10:# MCP Server Library
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:34:### What is the MCP Server Library?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:36:The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:218:│   ├── layer-definitions.ts    # 7-layer MCP architecture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:712:| [MCP Server README](../README.md) | Overview of the entire MCP server |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:713:| [Handlers Documentation](../handlers/README.md) | MCP tool handlers using lib modules |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:733:| [MCP Protocol](https://modelcontextprotocol.io/) | Model Context Protocol specification |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:61: * consumers (scoring layer, MCP output) can use it without risk of
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:338: * is set via `registerGlobalRefreshFn()` and defaults to a no-op.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:375:  logger.warn('Global graph refresh triggered but no refresh function registered.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:385:export function registerGlobalRefreshFn(fn: () => void): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:604: * Set via `registerLlmBackfillFn()` in application bootstrap.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:614:export function registerLlmBackfillFn(fn: (memoryId: number) => void): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:623: * @returns True when backfill was scheduled, false when no callback registered.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:661:  registerGlobalRefreshFn,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:662:  registerLlmBackfillFn,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:930:- `context-server.ts`: MCP integration and API endpoints
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:957:**Maintainer**: system-spec-kit MCP server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:7:// Warnings for the MCP markdown output layer.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:198: * Format an evidence-gap warning for MCP markdown output.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:201: * The markdown block-quote prefix (`> **`) allows the MCP layer to
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:44: * Dynamic startup instruction injection for the MCP server.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:9:import { registerDatabaseRebindListener } from '../../core/db-state.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:644:  registerDatabaseRebindListener(() => {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '842,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   861	  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
   862	  const { name } = requestParams;
   863	  const args: Record<string, unknown> = requestParams.arguments ?? {};
   864	  const callId = resolveToolCallId(request as { id?: unknown });
   865	  const sessionTrackingId = resolveSessionTrackingId(args, _extra);
   866	  if (sessionTrackingId) lastKnownSessionId = sessionTrackingId;
   867	
   868	  try {
   869	    // SEC-003: Validate input lengths before processing (CWE-400 mitigation)
   870	    validateInputLengths(args);
   871	    // T304: Zod validation is applied per-tool inside each dispatch module
   872	    // (tools/*.ts) to avoid double-validation overhead at the server layer.
   873	
   874	    // T018: Track last tool call timestamp for all tools except session_health.
   875	    if (name !== 'session_health') {
   876	      recordToolCall(sessionTrackingId);
   877	
   878	      // Phase 023: Record metric event for context quality tracking
   879	      recordMetricEvent({ kind: 'tool_call', toolName: name });
   880	    }
   881	    // Classify specific tool calls for finer-grained metrics
   882	    if (name === 'memory_context' && args.mode === 'resume') {
   883	      recordMetricEvent({ kind: 'memory_recovery' });
   884	    }
   885	    if (name.startsWith('code_graph_')) {
   886	      recordMetricEvent({ kind: 'code_graph_query' });
   887	    }
   888	    if (typeof args.specFolder === 'string' && args.specFolder) {
   889	      recordMetricEvent({ kind: 'spec_folder_change', specFolder: args.specFolder as string });
   890	    }
   891	
   892	    const dbReinitialized = await checkDatabaseUpdated();
   893	    if (dbReinitialized) {
   894	      await invalidateReinitializedDbCaches();
   895	    }
   896	
   897	    let sessionPrimeContext: AutoSurfaceResult | null = null;
   898	    try {
   899	      sessionPrimeContext = await primeSessionIfNeeded(
   900	        name,
   901	        args,
   902	        sessionTrackingId,
   903	      );
   904	    } catch (primeErr: unknown) {
   905	      const msg = primeErr instanceof Error ? primeErr.message : String(primeErr);
   906	      console.error(`[context-server] Session priming failed (non-fatal): ${msg}`);
   907	    }
   908	
   909	    // SK-004/TM-05: Auto-surface memories before dispatch (after validation)
   910	    let autoSurfacedContext: AutoSurfaceResult | null = null;
   911	    const isCompactionLifecycleCall =
   912	      name === 'memory_context' && args.mode === 'resume';
   913	
   914	    const autoSurfaceStart = Date.now();
   915	    if (MEMORY_AWARE_TOOLS.has(name)) {
   916	      const contextHint: string | null = extractContextHint(args);
   917	      if (contextHint) {
   918	        try {
   919	          if (isCompactionLifecycleCall) {
   920	            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
   921	          } else {
   922	            autoSurfacedContext = await autoSurfaceMemories(contextHint);
   923	          }
   924	        } catch (surfaceErr: unknown) {
   925	          const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
   926	          console.error(`[context-server] Auto-surface failed (non-fatal): ${msg}`);
   927	        }
   928	      }
   929	    } else {
   930	      try {
   931	        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
   932	      } catch (surfaceErr: unknown) {
   933	        const msg = surfaceErr instanceof Error ? surfaceErr.message : String(surfaceErr);
   934	        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
   935	      }
   936	    }
   937	    const autoSurfaceLatencyMs = Date.now() - autoSurfaceStart;
   938	    if (autoSurfaceLatencyMs > 250) {
   939	      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
   940	    }
   941	
   942	    // Ensure database is initialized (safe no-op if already done)
   943	    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
   944	    if (!dbInitialized) {
   945	      vectorIndex.initializeDb();
   946	      dbInitialized = true;
   947	    }
   948	
   949	    // T303: Dispatch to tool modules
   950	    const result = await dispatchTool(name, args) as ToolCallResponse | null;
   951	    if (!result) {
   952	      throw new Error(`Unknown tool: ${name}`);
   953	    }
   954	
   955	    let dispatchGraphContext: DispatchGraphContextMeta | null = null;
   956	    if (!result.isError) {
   957	      dispatchGraphContext = await resolveDispatchGraphContext(name, args);
   958	    }
   959	
   960	    runAfterToolCallbacks(name, callId, structuredClone(result));
   961	
   962	    // REQ-014: Log follow_on_tool_use when a non-search tool is called after a recent search
   963	    // Shadow-only: no ranking side effects. Fail-safe, never throws.
   964	    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
   965	      try {
   966	        const { logFollowOnToolUse } = await import('./lib/feedback/query-flow-tracker.js');
   967	        const { requireDb } = await import('./utils/index.js');
   968	        const db = (() => { try { return requireDb(); } catch { return null; } })();
   969	        const followOnSessionId = sessionTrackingId ?? lastKnownSessionId;
   970	        if (db && followOnSessionId) {
   971	          logFollowOnToolUse(db, followOnSessionId);
   972	        }
   973	      } catch { /* follow_on_tool_use logging must never break dispatch */ }
   974	    }
   975	
   976	    // Phase 024: Code-search redirect hint for memory tools
   977	    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
   978	      const queryStr = typeof args.query === 'string' ? args.query : typeof args.input === 'string' ? args.input : '';
   979	      const codeSearchPattern = /\b(find code|implementation of|function that|where is|how does .+ work|class that|method for)\b/i;
   980	      if (queryStr && codeSearchPattern.test(queryStr)) {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Tool Schemas
     3	// ───────────────────────────────────────────────────────────────
     4	// All MCP tool definitions (names, descriptions, input schemas).
     5	// Extracted from context-server.ts for maintainability (T303).
     6	import {
     7	  MAX_INGEST_PATHS,
     8	  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
     9	} from './schemas/tool-input-schemas.js';
    10	
    11	/**
    12	 * Re-export schema validation helpers used by the MCP tool entry points.
    13	 */
    14	export {
    15	  ToolSchemaValidationError,
    16	  formatZodError,
    17	  getToolSchema,
    18	  validateToolArgs,
    19	  getSchema,
    20	} from './schemas/tool-input-schemas.js';
    21	
    22	// ───────────────────────────────────────────────────────────────
    23	// 1. TYPES
    24	
    25	// ───────────────────────────────────────────────────────────────
    26	/**
    27	 * Normalized definition for a single MCP tool and its JSON schema.
    28	 */
    29	export interface ToolDefinition {
    30	  name: string;
    31	  description: string;
    32	  inputSchema: Record<string, unknown>;
    33	  outputSchema?: Record<string, unknown>;
    34	}
    35	
    36	// ───────────────────────────────────────────────────────────────
    37	// 2. TOOL DEFINITIONS
    38	
    39	// ───────────────────────────────────────────────────────────────
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ────────────────────────────────────────────────────────────────
     3	// MODULE: Cli
     4	// ────────────────────────────────────────────────────────────────
     5	// Standalone CLI for bulk database operations, runnable from any
     6	// Directory. Resolves its own modules via __dirname so
     7	// Better-sqlite3 and sqlite-vec load correctly regardless of cwd.
     8	//
     9	// Usage:
    10	//   Node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
    11	//   Node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
    12	//   Node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
    13	//   Node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
    14	import { createRequire } from 'node:module';
    15	
    16	const require = createRequire(import.meta.url);
    17	const { version: CLI_VERSION } = require('../package.json') as { version: string };
    18	
    19	type VectorIndexModule = Awaited<typeof import('./lib/search/vector-index.js')>;
    20	type CheckpointsModule = Awaited<typeof import('./lib/storage/checkpoints.js')>;
    21	type AccessTrackerModule = Awaited<typeof import('./lib/storage/access-tracker.js')>;
    22	type MutationLedgerModule = Awaited<typeof import('./lib/storage/mutation-ledger.js')>;
    23	type TriggerMatcherModule = Awaited<typeof import('./lib/parsing/trigger-matcher.js')>;
    24	type CoreIndexModule = Awaited<typeof import('./core/index.js')>;
    25	type StartupChecksModule = Awaited<typeof import('./startup-checks.js')>;
    26	type CausalEdgesModule = Awaited<typeof import('./lib/storage/causal-edges.js')>;
    27	type HistoryModule = Awaited<typeof import('./lib/storage/history.js')>;
    28	type SchemaDowngradeModule = Awaited<typeof import('./lib/storage/schema-downgrade.js')>;
    29	
    30	let _vector_index: VectorIndexModule | null = null;
    31	let _checkpoints: CheckpointsModule | null = null;
    32	let _access_tracker: AccessTrackerModule | null = null;
    33	let _mutation_ledger: MutationLedgerModule | null = null;
    34	let _trigger_matcher: TriggerMatcherModule | null = null;
    35	let _core_index: CoreIndexModule | null = null;
    36	let _startup_checks: StartupChecksModule | null = null;
    37	let _causal_edges: CausalEdgesModule | null = null;
    38	let _history: HistoryModule | null = null;
    39	let _schema_downgrade: SchemaDowngradeModule | null = null;
    40	
    41	async function getVectorIndex() {
    42	  return _vector_index ??= await import('./lib/search/vector-index.js');
    43	}
    44	
    45	async function getCheckpointsLib() {
    46	  return _checkpoints ??= await import('./lib/storage/checkpoints.js');
    47	}
    48	
    49	async function getAccessTracker() {
    50	  return _access_tracker ??= await import('./lib/storage/access-tracker.js');
    51	}
    52	
    53	async function getMutationLedger() {
    54	  return _mutation_ledger ??= await import('./lib/storage/mutation-ledger.js');
    55	}
    56	
    57	async function getTriggerMatcher() {
    58	  return _trigger_matcher ??= await import('./lib/parsing/trigger-matcher.js');
    59	}
    60	
    61	async function getCoreIndex() {
    62	  return _core_index ??= await import('./core/index.js');
    63	}
    64	
    65	async function getStartupChecks() {
    66	  return _startup_checks ??= await import('./startup-checks.js');
    67	}
    68	
    69	async function getCausalEdges() {
    70	  return _causal_edges ??= await import('./lib/storage/causal-edges.js');
    71	}
    72	
    73	async function getHistory() {
    74	  return _history ??= await import('./lib/storage/history.js');
    75	}
    76	
    77	async function getSchemaDowngrade() {
    78	  return _schema_downgrade ??= await import('./lib/storage/schema-downgrade.js');
    79	}
    80	
    81	async function getDatabasePath(): Promise<string> {
    82	  return (await getCoreIndex()).DATABASE_PATH;
    83	}
    84	
    85	/* ───────────────────────────────────────────────────────────────
    86	   1. ARGUMENT PARSING
    87	──────────────────────────────────────────────────────────────── */
    88	
    89	const args = process.argv.slice(2);
    90	const command = args[0];
    91	
    92	function getFlag(name: string): boolean {
    93	  return args.includes(`--${name}`);
    94	}
    95	
    96	function getOption(name: string): string | undefined {
    97	  const idx = args.indexOf(`--${name}`);
    98	  if (idx === -1 || idx + 1 >= args.length) return undefined;
    99	  return args[idx + 1];
   100	}
   101	
   102	function printUsage(): void {
   103	  console.log(`
   104	spec-kit-cli — Bulk database operations for Spec Kit Memory
   105	
   106	Usage:
   107	  spec-kit-cli <command> [options]
   108	
   109	Commands:
   110	  stats                          Show memory database statistics
   111	  bulk-delete --tier <tier>      Delete memories by importance tier
   112	    [--folder <spec-folder>]       Optional: scope to a spec folder
   113	    [--older-than <days>]          Optional: only delete older than N days
   114	    [--dry-run]                    Preview without deleting
   115	    [--skip-checkpoint]            Optional: skip pre-delete checkpoint (blocked for constitutional/critical)
   116	  reindex [--force] [--eager-warmup]
   117	                                 Re-index memory files (lazy model load by default)
   118	  schema-downgrade --to 15 --confirm
   119	                                 Downgrade schema from v16 to v15 (targeted, destructive)
   120	
   121	Options:
   122	  --help                         Show this help message
   123	  --version                      Show CLI version
   124	
   125	Examples:
   126	  spec-kit-cli stats
   127	  spec-kit-cli bulk-delete --tier deprecated
   128	  spec-kit-cli bulk-delete --tier temporary --older-than 30
   129	  spec-kit-cli bulk-delete --tier deprecated --folder system-spec-kit --dry-run
   130	  spec-kit-cli reindex
   131	  spec-kit-cli reindex --force
   132	  spec-kit-cli reindex --eager-warmup
   133	  spec-kit-cli schema-downgrade --to 15 --confirm
   134	`);
   135	}
   136	
   137	/* ───────────────────────────────────────────────────────────────
   138	   2. DATABASE INITIALIZATION (minimal — no MCP, no embeddings)
   139	──────────────────────────────────────────────────────────────── */
   140	
   141	async function initDatabase(): Promise<void> {
   142	  const [vectorIndex, checkpointsLib, accessTracker, coreIndex] = await Promise.all([
   143	    getVectorIndex(),
   144	    getCheckpointsLib(),
   145	    getAccessTracker(),
   146	    getCoreIndex(),
   147	  ]);
   148	
   149	  vectorIndex.initializeDb();
   150	  const db = vectorIndex.getDb();
   151	  const databasePath = await getDatabasePath();
   152	  if (!db) {
   153	    console.error(`ERROR: Failed to open database at ${databasePath}`);
   154	    process.exit(1);
   155	  }
   156	  // Keep CLI and MCP handlers aligned: handlers invoked from CLI rely on db-state wiring.
   157	  coreIndex.init({ vectorIndex, checkpoints: checkpointsLib, accessTracker });
   158	  checkpointsLib.init(db);
   159	  accessTracker.init(db);
   160	}
   161	
   162	/* ───────────────────────────────────────────────────────────────
   163	   3. STATS COMMAND
   164	──────────────────────────────────────────────────────────────── */
   165	
   166	async function runStats(): Promise<void> {
   167	  await initDatabase();
   168	  const vectorIndex = await getVectorIndex();
   169	  const databasePath = await getDatabasePath();
   170	  const db = vectorIndex.getDb()!;
   171	
   172	  // Total count
   173	  const totalRow = db.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
   174	  console.log(`\nMemory Database Statistics`);
   175	  console.log(`${'-'.repeat(50)}`);
   176	  console.log(`  Database:  ${databasePath}`);
   177	  console.log(`  Total:     ${totalRow.count} memories`);
   178	
   179	  // Tier distribution
   180	  const tiers = db.prepare(
   181	    'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier ORDER BY count DESC'
   182	  ).all() as Array<{ importance_tier: string; count: number }>;
   183	
   184	  console.log(`\n  Tier Distribution:`);
   185	  for (const tier of tiers) {
   186	    const bar = '█'.repeat(Math.min(Math.ceil(tier.count / Math.max(1, totalRow.count) * 30), 30));
   187	    console.log(`    ${(tier.importance_tier || 'null').padEnd(16)} ${bar} ${tier.count}`);
   188	  }
   189	
   190	  // Top folders
   191	  const folders = db.prepare(
   192	    'SELECT spec_folder, COUNT(*) as count FROM memory_index WHERE spec_folder IS NOT NULL GROUP BY spec_folder ORDER BY count DESC LIMIT 10'
   193	  ).all() as Array<{ spec_folder: string; count: number }>;
   194	
   195	  if (folders.length > 0) {
   196	    console.log(`\n  Top Folders:`);
   197	    for (const folder of folders) {
   198	      const bar = '█'.repeat(Math.min(Math.ceil(folder.count / Math.max(1, folders[0].count) * 20), 20));
   199	      console.log(`    ${folder.spec_folder.padEnd(40)} ${bar} ${folder.count}`);
   200	    }
   201	  }
   202	
   203	  // Schema version
   204	  try {
   205	    const versionRow = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
   206	    if (versionRow) {
   207	      console.log(`\n  Schema:    v${versionRow.version}`);
   208	    }
   209	  } catch {
   210	    // Schema_version table may not exist
   211	    try {
   212	      const legacyVersion = db.prepare("SELECT value FROM config WHERE key = 'schema_version'").get() as { value: string } | undefined;
   213	      if (legacyVersion) {
   214	        console.log(`\n  Schema:    v${legacyVersion.value}`);
   215	      }
   216	    } catch {
   217	      // No schema version metadata available
   218	    }
   219	  }
   220	
   221	  // Chunked memories (parent/child)
   222	  try {
   223	    const chunkedParents = db.prepare(
   224	      "SELECT COUNT(*) as count FROM memory_index WHERE embedding_status = 'partial'"
   225	    ).get() as { count: number };
   226	    const childChunks = db.prepare(
   227	      'SELECT COUNT(*) as count FROM memory_index WHERE parent_id IS NOT NULL'
   228	    ).get() as { count: number };
   229	    if (chunkedParents.count > 0 || childChunks.count > 0) {
   230	      console.log(`\n  Chunked:   ${chunkedParents.count} parent(s), ${childChunks.count} chunk(s)`);
   231	    }
   232	  } catch {
   233	    // Parent_id column may not exist yet
   234	  }
   235	
   236	  console.log('');
   237	}
   238	
   239	/* ───────────────────────────────────────────────────────────────
   240	   4. BULK DELETE COMMAND
   241	──────────────────────────────────────────────────────────────── */
   242	
   243	async function runBulkDelete(): Promise<void> {
   244	  const tier = getOption('tier');
   245	  if (!tier) {
   246	    console.error('ERROR: --tier is required. Example: spec-kit-cli bulk-delete --tier deprecated');
   247	    process.exit(1);
   248	  }
   249	
   250	  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
   251	  if (!validTiers.includes(tier)) {
   252	    console.error(`ERROR: Invalid tier "${tier}". Must be one of: ${validTiers.join(', ')}`);
   253	    process.exit(1);
   254	  }
   255	
   256	  const specFolder = getOption('folder');
   257	  const olderThanDays = getOption('older-than');
   258	  const dryRun = getFlag('dry-run');
   259	  const skipCheckpoint = getFlag('skip-checkpoint');
   260	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Index — Public API surface
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — Only export what external consumers (scripts/, other packages) need.
     5	// Internal mcp_server code should import from lib/ directly, not through this barrel.
     6	// ARCH-1: Consumer scripts import from '@spec-kit/mcp-server/api' instead of lib/.
     7	// Review note: Barrel is wide due to legitimate external consumers in scripts/evals,
     8	// scripts/core, scripts/spec-folder, and scripts/memory. Do not narrow without
     9	// auditing all consumers first (see review/review-report.md P2-MNT-02).
    10	
    11	export {
    12	  runAblation,
    13	  storeAblationResults,
    14	  formatAblationReport,
    15	  toHybridSearchFlags,
    16	  isAblationEnabled,
    17	  inspectGroundTruthAlignment,
    18	  assertGroundTruthAlignment,
    19	  ALL_CHANNELS,
    20	  type AblationChannel,
    21	  type AblationSearchFn,
    22	  type AblationReport,
    23	  type GroundTruthAlignmentSummary,
    24	  runBM25Baseline,
    25	  recordBaselineMetrics,
    26	  type BM25SearchFn,
    27	  type BM25SearchResult,
    28	  type BM25BaselineResult,
    29	  loadGroundTruth,
    30	  initEvalDb,
    31	} from './eval.js';
    32	
    33	export {
    34	  initializeIndexingRuntime,
    35	  warmEmbeddingModel,
    36	  runMemoryIndexScan,
    37	  closeIndexingRuntime,
    38	  type MemoryIndexScanArgs,
    39	} from './indexing.js';
    40	
    41	export {
    42	  initHybridSearch,
    43	  hybridSearchEnhanced,
    44	  type HybridSearchOptions,
    45	  type HybridSearchResult,
    46	  fts5Bm25Search,
    47	  isFts5Available,
    48	  vectorIndex,
    49	} from './search.js';
    50	
    51	export {
    52	  generateEmbedding,
    53	  generateQueryEmbedding,
    54	  getEmbeddingProfile,
    55	  retryManager,
    56	} from './providers.js';
    57	
    58	export {
    59	  initCheckpoints,
    60	  initAccessTracker,
    61	} from './storage.js';
    62	
    63	// --- Folder discovery (used by scripts/spec-folder, scripts/core) ---
    64	export {
    65	  generatePerFolderDescription,
    66	  savePerFolderDescription,
    67	  loadPerFolderDescription,
    68	  extractKeywords,
    69	  slugifyFolderName,
    70	} from '../lib/search/folder-discovery.js';
    71	export type { PerFolderDescription } from '../lib/search/folder-discovery.js';
    72	
    73	// --- Entity extraction (used by scripts/memory) ---
    74	export {
    75	  extractEntities,
    76	  rebuildAutoEntities,
    77	} from '../lib/extraction/entity-extractor.js';
    78	
    79	// --- Performance benchmarking support (used by scripts/evals) ---
    80	export * as sessionBoost from '../lib/search/session-boost.js';
    81	export * as causalBoost from '../lib/search/causal-boost.js';
    82	export * as workingMemory from '../lib/cognitive/working-memory.js';
    83	export {
    84	  initExtractionAdapter,
    85	  getExtractionMetrics,
    86	  resetExtractionMetrics,
    87	} from '../lib/extraction/extraction-adapter.js';
    88	export type { ExtractionMetrics } from '../lib/extraction/extraction-adapter.js';
    89	
    90	// --- Hybrid RAG Fusion rollout metadata and architecture surfaces ---
    91	export {
    92	  LAYER_DEFINITIONS,
    93	  TOOL_LAYER_MAP,
    94	  getLayerForTool,
    95	  getLayerTokenBudget,
    96	} from '../lib/architecture/layer-definitions.js';
    97	export type { LayerDefinition, LayerId } from '../lib/architecture/layer-definitions.js';
    98	
    99	export {
   100	  getSharedRolloutMetrics,
   101	  getSharedRolloutCohortSummary,
   102	} from '../lib/collab/shared-spaces.js';
   103	export type {
   104	  SharedMembership,
   105	  SharedRole,
   106	  SharedRolloutCohortSummary,
   107	  SharedRolloutMetrics,
   108	  SharedSpaceDefinition,
   109	  SharedSubjectType,
   110	} from '../lib/collab/shared-spaces.js';
   111	
   112	export {
   113	  getMemoryRoadmapCapabilityFlags,
   114	  getMemoryRoadmapDefaults,
   115	  getMemoryRoadmapPhase,
   116	} from '../lib/config/capability-flags.js';
   117	export type { MemoryRoadmapCapabilityFlags } from '../lib/config/capability-flags.js';

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import chalk from "chalk";
     2	import { spawnSync } from "node:child_process";
     3	import { createInterface } from "node:readline";
     4	import type { MexConfig, SyncTarget, DriftIssue } from "../types.js";
     5	import { runDriftCheck } from "../drift/index.js";
     6	import { buildSyncBrief, buildCombinedBrief } from "./brief-builder.js";
     7	
     8	function askUser(question: string): Promise<string> {
     9	  const rl = createInterface({ input: process.stdin, output: process.stdout });
    10	  return new Promise((resolve) => {
    11	    rl.question(question, (answer) => {
    12	      rl.close();
    13	      resolve(answer.trim());
    14	    });
    15	  });
    16	}
    17	
    18	function runClaudeInteractive(brief: string, cwd: string): boolean {
    19	  const result = spawnSync("claude", [brief], {
    20	    cwd,
    21	    stdio: "inherit",
    22	    timeout: 300_000,
    23	  });
    24	  return result.status === 0 || result.status === null;
    25	}
    26	
    27	type SyncMode = "interactive" | "prompts";
    28	
    29	/** Run targeted sync: detect → brief → AI → verify → ask → loop */
    30	export async function runSync(
    31	  config: MexConfig,
    32	  opts: { dryRun?: boolean; includeWarnings?: boolean }
    33	): Promise<void> {
    34	  let cycle = 0;
    35	  let mode: SyncMode | null = null;
    36	
    37	  while (true) {
    38	    cycle++;
    39	
    40	    // Step 1: Run drift check
    41	    if (cycle === 1) {
    42	      console.log(chalk.bold("Running drift check..."));
    43	    } else {
    44	      console.log(chalk.bold("\nRe-checking for remaining drift..."));
    45	    }
    46	
    47	    const report = await runDriftCheck(config);
    48	
    49	    if (report.issues.length === 0) {
    50	      console.log(chalk.green("✓ No drift detected. Everything is in sync."));
    51	      return;
    52	    }
    53	
    54	    console.log(
    55	      chalk.yellow(
    56	        `Found ${report.issues.length} issues (score: ${report.score}/100)`
    57	      )
    58	    );
    59	
    60	    // Step 2: Group issues by file
    61	    const relevantIssues = opts.includeWarnings
    62	      ? report.issues
    63	      : report.issues.filter((i) => {
    64	          const fileHasError = report.issues.some(
    65	            (other) => other.file === i.file && other.severity === "error"
    66	          );
    67	          return fileHasError;
    68	        });
    69	
    70	    if (relevantIssues.length === 0) {
    71	      console.log(
    72	        chalk.green(
    73	          "No errors found. Only warnings remain (use --warnings to include them)."
    74	        )
    75	      );
    76	      return;
    77	    }
    78	
    79	    const targets = groupIntoTargets(relevantIssues);
    80	
    81	    console.log(
    82	      chalk.bold(`\n${targets.length} file(s) need attention:\n`)
    83	    );
    84	
    85	    for (const target of targets) {
    86	      const errors = target.issues.filter(
    87	        (i) => i.severity === "error"
    88	      ).length;
    89	      const warnings = target.issues.filter(
    90	        (i) => i.severity === "warning"
    91	      ).length;
    92	      console.log(
    93	        `  ${target.file} — ${errors} errors, ${warnings} warnings`
    94	      );
    95	    }
    96	
    97	    // Dry run — show combined prompt and exit
    98	    if (opts.dryRun) {
    99	      console.log(
   100	        chalk.dim("\n--dry-run: showing prompt without executing\n")
   101	      );
   102	      const brief = await buildCombinedBrief(targets, config.projectRoot);
   103	      console.log(brief);
   104	      console.log();
   105	      return;
   106	    }
   107	
   108	    // Ask user for mode (only on first cycle)
   109	    if (mode === null) {
   110	      console.log(chalk.bold("\nHow should we fix these?"));
   111	      console.log();
   112	      console.log("  1) Interactive — Claude fixes with you watching (default)");
   113	      console.log("  2) Show prompts — I'll paste manually");
   114	      console.log("  3) Exit");
   115	      console.log();
   116	
   117	      const choice = await askUser("Choice [1-3] (default: 1): ");
   118	      const picked = choice || "1";
   119	
   120	      switch (picked) {
   121	        case "1":
   122	          mode = "interactive";
   123	          break;
   124	        case "2":
   125	          mode = "prompts";
   126	          break;
   127	        case "3":
   128	          console.log(chalk.dim("Exiting. Run mex sync again anytime."));
   129	          return;
   130	        default:
   131	          console.log(chalk.dim("Exiting."));
   132	          return;
   133	      }
   134	    }
   135	
   136	    // Show prompts mode — print combined prompt and exit
   137	    if (mode === "prompts") {
   138	      const brief = await buildCombinedBrief(targets, config.projectRoot);
   139	      console.log(brief);
   140	      console.log();
   141	      return;
   142	    }
   143	
   144	    // Step 3: Fix all files in one interactive session
   145	    console.log();
   146	    console.log(chalk.bold(`\nSending all ${targets.length} file(s) to Claude in one session...\n`));
   147	
   148	    const brief = await buildCombinedBrief(targets, config.projectRoot);
   149	    const ok = runClaudeInteractive(brief, config.projectRoot);
   150	
   151	    if (!ok) {
   152	      console.log(chalk.red("  ✗ Claude session failed"));
   153	    }
   154	
   155	    // Step 4: Verify
   156	    const postReport = await runDriftCheck(config);
   157	    const scoreDelta = postReport.score - report.score;
   158	    const deltaStr =
   159	      scoreDelta > 0
   160	        ? chalk.green(`+${scoreDelta}`)
   161	        : scoreDelta === 0
   162	          ? chalk.yellow("+0")
   163	          : chalk.red(`${scoreDelta}`);
   164	
   165	    console.log(
   166	      chalk.bold(
   167	        `\nDrift score: ${report.score} → ${postReport.score}/100 (${deltaStr})`
   168	      )
   169	    );
   170	
   171	    // Step 5: Check if we should continue
   172	    const remainingErrors = postReport.issues.filter(
   173	      (i) => i.severity === "error"
   174	    ).length;
   175	    const remainingWarnings = postReport.issues.filter(
   176	      (i) => i.severity === "warning"
   177	    ).length;
   178	
   179	    if (remainingErrors === 0 && !opts.includeWarnings) {
   180	      if (remainingWarnings > 0) {
   181	        console.log(
   182	          chalk.dim(
   183	            `${remainingWarnings} warning(s) remain (use --warnings to include them).`
   184	          )
   185	        );
   186	      } else {
   187	        console.log(chalk.green("✓ All issues resolved."));
   188	      }
   189	      return;
   190	    }
   191	
   192	    if (postReport.score === 100) {
   193	      console.log(chalk.green("✓ Perfect score. All issues resolved."));
   194	      return;
   195	    }
   196	
   197	    // Ask user whether to continue
   198	    const remaining = opts.includeWarnings
   199	      ? remainingErrors + remainingWarnings
   200	      : remainingErrors;
   201	
   202	    const answer = await askUser(
   203	      `\n${remaining} issue(s) remain. Run another cycle? [Y/n] `
   204	    );
   205	
   206	    if (answer.toLowerCase() === "n") {
   207	      console.log(chalk.dim("Stopped. Run mex sync again anytime."));
   208	      return;
   209	    }
   210	  }
   211	}
   212	
   213	function groupIntoTargets(issues: DriftIssue[]): SyncTarget[] {
   214	  const byFile = new Map<string, DriftIssue[]>();
   215	  for (const issue of issues) {
   216	    if (!byFile.has(issue.file)) byFile.set(issue.file, []);
   217	    byFile.get(issue.file)!.push(issue);
   218	  }
   219	
   220	  return Array.from(byFile.entries()).map(([file, issues]) => ({
   221	    file,
   222	    issues,
   223	    gitDiff: null,
   224	  }));
   225	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { join } from "node:path";
     2	import { existsSync, writeFileSync, appendFileSync, mkdirSync, readFileSync } from "node:fs";
     3	import chalk from "chalk";
     4	import type { MexConfig } from "../types.js";
     5	
     6	export async function runPatternAdd(config: MexConfig, name: string) {
     7	  if (!/^[a-z0-9-]+$/i.test(name)) {
     8	    throw new Error(`Invalid pattern name '${name}'. Use only letters, numbers, and hyphens.`);
     9	  }
    10	
    11	  const patternsDir = join(config.scaffoldRoot, "patterns");
    12	  const patternPath = join(patternsDir, `${name}.md`);
    13	  const indexPath = join(patternsDir, "INDEX.md");
    14	
    15	  if (existsSync(patternPath)) {
    16	    throw new Error(`Pattern '${name}' already exists at ${patternPath}`);
    17	  }
    18	
    19	  const today = new Date().toISOString().split("T")[0];
    20	
    21	  const template = `---
    22	name: ${name}
    23	description: [one line — what this pattern covers and when to use it]
    24	triggers:
    25	  - "[keyword that should trigger loading this file]"
    26	edges:
    27	  - target: "context/conventions.md"
    28	    condition: "when verifying this task"
    29	last_updated: ${today}
    30	---
    31	
    32	# ${name}
    33	
    34	## Context
    35	[What to load or know before starting this task type]
    36	
    37	## Steps
    38	[The workflow — what to do, in what order]
    39	
    40	## Gotchas
    41	[The things that go wrong. What to watch out for.]
    42	
    43	## Verify
    44	[Checklist to run after completing this task type]
    45	
    46	## Debug
    47	[What to check when this task type breaks]
    48	
    49	## Update Scaffold
    50	- [ ] Update \`ROUTER.md\` "Current Project State" if what's working/not built has changed
    51	- [ ] Update any \`context/\` files that are now out of date
    52	- [ ] If this is a new task type without a pattern, create one in \`patterns/\` and add to \`INDEX.md\`
    53	`;
    54	
    55	  mkdirSync(patternsDir, { recursive: true });
    56	  writeFileSync(patternPath, template, "utf8");
    57	
    58	  if (existsSync(indexPath)) {
    59	    const currentIndex = readFileSync(indexPath, "utf8");
    60	    const newlinePrefix = currentIndex.length === 0 || currentIndex.endsWith("\n") ? "" : "\n";
    61	    const entry = `${newlinePrefix}| [${name}.md](${name}.md) | [description] |\n`;
    62	    appendFileSync(indexPath, entry, "utf8");
    63	  }
    64	
    65	  console.log(chalk.green(`✓ Created pattern ${name}.md`));
    66	  console.log(chalk.dim(`  Added entry to patterns/INDEX.md`));
    67	  console.log(chalk.yellow(`! Remember to edit patterns/INDEX.md and replace [description] with a real use case.`));
    68	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    18	     Length: 3-7 items maximum. More than 7 means the list has not been prioritised.
    19	     Example:
    20	     - Never write database queries outside of the repository layer
    21	     - Never commit secrets or API keys
    22	     - Always handle errors explicitly — no silent failures -->
    23	
    24	## Commands
    25	<!-- The exact commands needed to work on this project.
    26	     Include: run dev server, run tests, run linter, build.
    27	     Use the actual commands from this codebase — not placeholders.
    28	     Example:
    29	     - Dev: `npm run dev`
    30	     - Test: `npm test`
    31	     - Lint: `npm run lint`
    32	     - Build: `npm run build` -->
    33	
    34	## After Every Task
    35	After completing any task: update `.mex/ROUTER.md` project state and any `.mex/` files that are now out of date. If no pattern existed for the task you just completed, create one in `.mex/patterns/`.
    36	
    37	## Navigation
    38	At the start of every session, read `.mex/ROUTER.md` before doing anything else.
    39	For full project context, patterns, and task guidance — everything is there.

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ── Shared Types ──
     2	
     3	// ── Config ──
     4	
     5	export interface MexConfig {
     6	  /** Absolute path to project root (where .git lives) */
     7	  projectRoot: string;
     8	  /** Absolute path to scaffold root (.mex/ directory) */
     9	  scaffoldRoot: string;
    10	}
    11	
    12	// ── Claims (extracted from markdown) ──
    13	
    14	export type ClaimKind = "path" | "command" | "dependency" | "version";
    15	
    16	export interface Claim {
    17	  kind: ClaimKind;
    18	  value: string;
    19	  /** Source file (relative to project root) */
    20	  source: string;
    21	  /** Line number in source file */
    22	  line: number;
    23	  /** Section heading the claim was found under */
    24	  section: string | null;
    25	  /** If true, this claim is negated (e.g. "does NOT use X") */
    26	  negated: boolean;
    27	}
    28	
    29	// ── Drift ──
    30	
    31	export type Severity = "error" | "warning" | "info";
    32	
    33	export type IssueCode =
    34	  | "STALE_FILE"
    35	  | "MISSING_PATH"
    36	  | "DEAD_COMMAND"
    37	  | "DEPENDENCY_MISSING"
    38	  | "VERSION_MISMATCH"
    39	  | "CROSS_FILE_CONFLICT"
    40	  | "DEAD_EDGE"
    41	  | "INDEX_MISSING_ENTRY"
    42	  | "INDEX_ORPHAN_ENTRY"
    43	  | "UNDOCUMENTED_SCRIPT";
    44	
    45	export interface DriftIssue {
    46	  code: IssueCode;
    47	  severity: Severity;
    48	  file: string;
    49	  line: number | null;
    50	  message: string;
    51	  /** The claim that triggered this issue, if any */
    52	  claim?: Claim;
    53	}
    54	
    55	export interface DriftReport {
    56	  score: number;
    57	  issues: DriftIssue[];
    58	  filesChecked: number;
    59	  timestamp: string;
    60	}
    61	
    62	// ── Frontmatter ──
    63	
    64	export interface ScaffoldFrontmatter {
    65	  name?: string;
    66	  description?: string;
    67	  edges?: FrontmatterEdge[];
    68	  last_updated?: string;
    69	  [key: string]: unknown;
    70	}
    71	
    72	export interface FrontmatterEdge {
    73	  target: string;
    74	  condition?: string;
    75	}
    76	
    77	// ── Scanner ──
    78	
    79	export interface ManifestInfo {
    80	  type: "package.json" | "pyproject.toml" | "go.mod" | "Cargo.toml";
    81	  name: string | null;
    82	  version: string | null;
    83	  dependencies: Record<string, string>;
    84	  devDependencies: Record<string, string>;
    85	  scripts: Record<string, string>;
    86	}
    87	
    88	export interface EntryPoint {
    89	  path: string;
    90	  type: "main" | "binary" | "test" | "config";
    91	}
    92	
    93	export interface FolderCategory {
    94	  name: string;
    95	  path: string;
    96	  fileCount: number;
    97	  category: "routes" | "models" | "services" | "tests" | "config" | "utils" | "views" | "other";
    98	}
    99	
   100	export interface ToolingInfo {
   101	  testRunner: string | null;
   102	  buildTool: string | null;
   103	  linter: string | null;
   104	  formatter: string | null;
   105	  packageManager: "npm" | "yarn" | "pnpm" | "bun" | null;
   106	}
   107	
   108	export interface ScannerBrief {
   109	  manifest: ManifestInfo | null;
   110	  entryPoints: EntryPoint[];
   111	  folderTree: FolderCategory[];
   112	  tooling: ToolingInfo;
   113	  readme: string | null;
   114	  timestamp: string;
   115	}
   116	
   117	// ── Sync ──
   118	
   119	export interface SyncTarget {
   120	  file: string;
   121	  issues: DriftIssue[];
   122	  gitDiff: string | null;
   123	}
   124	
   125	export interface SyncResult {
   126	  file: string;
   127	  action: "updated" | "skipped" | "failed";
   128	  reason?: string;
   129	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import simpleGit, { type SimpleGit, type LogResult } from "simple-git";
     2	
     3	let _git: SimpleGit | null = null;
     4	
     5	export function getGit(cwd?: string): SimpleGit {
     6	  if (!_git || cwd) {
     7	    _git = simpleGit(cwd ?? process.cwd());
     8	  }
     9	  return _git;
    10	}
    11	
    12	/** Get days since a file was last modified in git */
    13	export async function daysSinceLastChange(
    14	  filePath: string,
    15	  cwd?: string
    16	): Promise<number | null> {
    17	  try {
    18	    const git = getGit(cwd);
    19	    const log = await git.log({ file: filePath, maxCount: 1 });
    20	    if (!log.latest?.date) return null;
    21	    const lastDate = new Date(log.latest.date);
    22	    const now = new Date();
    23	    return Math.floor(
    24	      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    25	    );
    26	  } catch {
    27	    return null;
    28	  }
    29	}
    30	
    31	/** Get number of commits since a file was last modified */
    32	export async function commitsSinceLastChange(
    33	  filePath: string,
    34	  cwd?: string
    35	): Promise<number | null> {
    36	  try {
    37	    const git = getGit(cwd);
    38	    const fileLog = await git.log({ file: filePath, maxCount: 1 });
    39	    if (!fileLog.latest?.hash) return null;
    40	
    41	    const allLog = await git.log();
    42	    const totalCommits = allLog.all.length;
    43	    const fileIndex = allLog.all.findIndex(
    44	      (c) => c.hash === fileLog.latest!.hash
    45	    );
    46	    return fileIndex === -1 ? null : fileIndex;
    47	  } catch {
    48	    return null;
    49	  }
    50	}
    51	
    52	/** Get git diff for specific paths */
    53	export async function getGitDiff(
    54	  paths: string[],
    55	  cwd?: string
    56	): Promise<string> {
    57	  try {
    58	    const git = getGit(cwd);
    59	    return await git.diff(["HEAD~5", "HEAD", "--", ...paths]);
    60	  } catch {
    61	    return "";
    62	  }
    63	}
    64	
    65	/** Get full git log */
    66	export async function getLog(
    67	  cwd?: string,
    68	  maxCount = 50
    69	): Promise<LogResult> {
    70	  const git = getGit(cwd);
    71	  return git.log({ maxCount });
    72	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { readFileSync, existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import type { Claim, DriftIssue } from "../../types.js";
     4	
     5	/** Check that claimed npm/yarn/make commands actually exist */
     6	export function checkCommands(
     7	  claims: Claim[],
     8	  projectRoot: string
     9	): DriftIssue[] {
    10	  const issues: DriftIssue[] = [];
    11	  const commandClaims = claims.filter(
    12	    (c) => c.kind === "command" && !c.negated
    13	  );
    14	
    15	  const pkgScripts = loadPackageScripts(projectRoot);
    16	  const makeTargets = loadMakeTargets(projectRoot);
    17	
    18	  for (const claim of commandClaims) {
    19	    const cmd = claim.value.trim();
    20	
    21	    // npm run <script> / yarn <script> / pnpm <script>
    22	    const npmMatch = cmd.match(
    23	      /^(?:npm\s+run|yarn|pnpm|bun\s+run)\s+(\S+)/
    24	    );
    25	    if (npmMatch) {
    26	      const script = npmMatch[1];
    27	      if (pkgScripts && !pkgScripts.has(script)) {
    28	        issues.push({
    29	          code: "DEAD_COMMAND",
    30	          severity: "error",
    31	          file: claim.source,
    32	          line: claim.line,
    33	          message: `Script "${script}" not found in package.json scripts`,
    34	          claim,
    35	        });
    36	      }
    37	      continue;
    38	    }
    39	
    40	    // make <target>
    41	    const makeMatch = cmd.match(/^make\s+(\S+)/);
    42	    if (makeMatch) {
    43	      const target = makeMatch[1];
    44	      if (makeTargets && !makeTargets.has(target)) {
    45	        issues.push({
    46	          code: "DEAD_COMMAND",
    47	          severity: "error",
    48	          file: claim.source,
    49	          line: claim.line,
    50	          message: `Make target "${target}" not found in Makefile`,
    51	          claim,
    52	        });
    53	      }
    54	    }
    55	  }
    56	
    57	  return issues;
    58	}
    59	
    60	function loadPackageScripts(
    61	  projectRoot: string
    62	): Set<string> | null {
    63	  const pkgPath = resolve(projectRoot, "package.json");
    64	  if (!existsSync(pkgPath)) return null;
    65	  try {
    66	    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    67	    return new Set(Object.keys(pkg.scripts ?? {}));
    68	  } catch {
    69	    return null;
    70	  }
    71	}
    72	
    73	function loadMakeTargets(projectRoot: string): Set<string> | null {
    74	  const makePath = resolve(projectRoot, "Makefile");
    75	  if (!existsSync(makePath)) return null;
    76	  try {
    77	    const content = readFileSync(makePath, "utf-8");
    78	    const targets = new Set<string>();
    79	    for (const line of content.split("\n")) {
    80	      const match = line.match(/^(\w[\w-]*):/);
    81	      if (match) targets.add(match[1]);
    82	    }
    83	    return targets;
    84	  } catch {
    85	    return null;
    86	  }
    87	}

codex
I’ve got enough of Mex’s runtime shape to see the pattern: one Commander CLI, one git hook path, one AI-coupled sync loop, and one set of copied profile shims. I’m tightening the Spec Kit side now so the comparison is concrete on registration, public API breadth, and where profile/tool separation actually lives.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '560,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	// L7: Maintenance - Indexing and system operations (Token Budget: 1000)
   561	const memoryIndexScan: ToolDefinition = {
   562	  name: 'memory_index_scan',
   563	  description: '[L7:Maintenance] Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files. Token Budget: 1000.',
   564	  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
   565	};
   566	
   567	const memoryGetLearningHistory: ToolDefinition = {
   568	  name: 'memory_get_learning_history',
   569	  description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.',
   570	  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
   571	};
   572	
   573	const memoryIngestStart: ToolDefinition = {
   574	  name: 'memory_ingest_start',
   575	  description: '[L7:Maintenance] Start an async ingestion job for multiple markdown files. Returns immediately with a jobId, while files are processed sequentially in the background.',
   576	  inputSchema: {
   577	    type: 'object',
   578	    additionalProperties: false,
   579	    properties: {
   580	      paths: {
   581	        type: 'array',
   582	        items: { type: 'string', minLength: 1 },
   583	        minItems: 1,
   584	        maxItems: MAX_INGEST_PATHS,
   585	        description: `Absolute file paths to ingest (required, at least one, max ${MAX_INGEST_PATHS}).`,
   586	      },
   587	      specFolder: {
   588	        type: 'string',
   589	        description: 'Optional spec folder label attached to the ingest job.',
   590	      },
   591	    },
   592	    required: ['paths'],
   593	  },
   594	};
   595	
   596	const memoryIngestStatus: ToolDefinition = {
   597	  name: 'memory_ingest_status',
   598	  description: '[L7:Maintenance] Get current state and progress for an async ingestion job.',
   599	  inputSchema: {
   600	    type: 'object',
   601	    additionalProperties: false,
   602	    properties: {
   603	      jobId: { type: 'string', minLength: 1, description: 'Ingestion job identifier (required).' },
   604	    },
   605	    required: ['jobId'],
   606	  },
   607	};
   608	
   609	const memoryIngestCancel: ToolDefinition = {
   610	  name: 'memory_ingest_cancel',
   611	  description: '[L7:Maintenance] Cancel a running async ingestion job. Cancellation is checked between files.',
   612	  inputSchema: {
   613	    type: 'object',
   614	    additionalProperties: false,
   615	    properties: {
   616	      jobId: { type: 'string', minLength: 1, description: 'Ingestion job identifier (required).' },
   617	    },
   618	    required: ['jobId'],
   619	  },
   620	};
   621	
   622	// Code Graph - Structural code analysis tools
   623	const codeGraphScan: ToolDefinition = {
   624	  name: 'code_graph_scan',
   625	  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
   626	  inputSchema: {
   627	    type: 'object', additionalProperties: false,
   628	    properties: {
   629	      rootDir: { type: 'string', description: 'Root directory to scan (default: workspace root)' },
   630	      includeGlobs: { type: 'array', items: { type: 'string' }, description: 'Glob patterns for files to include' },
   631	      excludeGlobs: { type: 'array', items: { type: 'string' }, description: 'Additional glob patterns to exclude' },
   632	      incremental: { type: 'boolean', default: true, description: 'Skip unchanged files (default: true)' },
   633	    },
   634	    required: [],
   635	  },
   636	};
   637	
   638	const codeGraphQuery: ToolDefinition = {
   639	  name: 'code_graph_query',
   640	  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph), and blast_radius (reverse import impact). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
   641	  inputSchema: {
   642	    type: 'object', additionalProperties: false,
   643	    properties: {
   644	      operation: { type: 'string', enum: ['outline', 'calls_from', 'calls_to', 'imports_from', 'imports_to', 'blast_radius'], description: 'Query operation (required)' },
   645	      subject: { type: 'string', minLength: 1, description: 'File path, symbol name, or symbolId to query (required)' },
   646	      subjects: { type: 'array', items: { type: 'string' }, description: 'Optional additional file paths or symbols for blast-radius union mode' },
   647	      edgeType: { type: 'string', description: 'Filter by edge type (optional)' },
   648	      limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Max results' },
   649	      includeTransitive: { type: 'boolean', default: false, description: 'Enable multi-hop BFS traversal (follows edges transitively)' },
   650	      maxDepth: { type: 'number', minimum: 1, maximum: 10, default: 3, description: 'Max traversal depth when includeTransitive is true' },
   651	    },
   652	    required: ['operation', 'subject'],
   653	  },
   654	};
   655	
   656	const codeGraphStatus: ToolDefinition = {
   657	  name: 'code_graph_status',
   658	  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
   659	  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
   660	};
   661	
   662	const codeGraphContext: ToolDefinition = {
   663	  name: 'code_graph_context',
   664	  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
   665	  inputSchema: {
   666	    type: 'object', additionalProperties: false,
   667	    properties: {
   668	      input: { type: 'string', description: 'Natural language context query' },
   669	      queryMode: { type: 'string', enum: ['neighborhood', 'outline', 'impact'], default: 'neighborhood', description: 'Graph expansion mode' },
   670	      subject: { type: 'string', description: 'Symbol name, fqName, or symbolId' },
   671	      seeds: {
   672	        type: 'array',
   673	        items: {
   674	          type: 'object',
   675	          properties: {
   676	            filePath: { type: 'string' },
   677	            startLine: { type: 'number' },
   678	            endLine: { type: 'number' },
   679	            query: { type: 'string' },
   680	            provider: { type: 'string', enum: ['cocoindex', 'manual', 'graph'], description: 'Seed provider type' },
   681	            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
   682	            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
   683	            score: { type: 'number', description: 'CocoIndex relevance score' },
   684	            symbolName: { type: 'string', description: 'Manual seed symbol name' },
   685	            symbolId: { type: 'string', description: 'Graph seed symbol ID' },
   686	          },
   687	        },
   688	        description: 'Seeds from CocoIndex, manual input, or graph lookups',
   689	      },
   690	      budgetTokens: { type: 'number', minimum: 100, maximum: 4000, default: 1200, description: 'Token budget for response' },
   691	      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
   692	      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
   693	    },
   694	    required: [],
   695	  },
   696	};
   697	
   698	const cccStatus: ToolDefinition = {
   699	  name: 'ccc_status',
   700	  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
   701	  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
   702	};
   703	
   704	const cccReindex: ToolDefinition = {
   705	  name: 'ccc_reindex',
   706	  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
   707	  inputSchema: {
   708	    type: 'object', additionalProperties: false,
   709	    properties: {
   710	      full: { type: 'boolean', default: false, description: 'Full re-index (slower) vs incremental' },
   711	    },
   712	    required: [],
   713	  },
   714	};
   715	
   716	const cccFeedback: ToolDefinition = {
   717	  name: 'ccc_feedback',
   718	  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
   719	  inputSchema: {
   720	    type: 'object', additionalProperties: false,
   721	    properties: {
   722	      query: { type: 'string', description: 'The search query that was executed' },
   723	      resultFile: { type: 'string', description: 'File path from the result being rated' },
   724	      rating: { type: 'string', enum: ['helpful', 'not_helpful', 'partial'], description: 'Quality rating' },
   725	      comment: { type: 'string', description: 'Optional free-form feedback' },
   726	    },
   727	    required: ['query', 'rating'],
   728	  },
   729	};
   730	
   731	// T018: Session health diagnostic tool
   732	const sessionHealth: ToolDefinition = {
   733	  name: 'session_health',
   734	  description: '[L3:Discovery] Check session readiness: priming status, code graph freshness, time since last tool call. Call periodically during long sessions to check for context drift. Returns ok/warning/stale with actionable hints. No arguments required.',
   735	  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
   736	};
   737	
   738	// Phase 020: Composite session resume tool
   739	const sessionResume: ToolDefinition = {
   740	  name: 'session_resume',
   741	  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
   742	  inputSchema: {
   743	    type: 'object',
   744	    additionalProperties: false,
   745	    properties: {
   746	      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
   747	      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
   748	    },
   749	    required: [],
   750	  },
   751	};
   752	
   753	// Phase 024 / Item 7: Composite session bootstrap tool
   754	const sessionBootstrap: ToolDefinition = {
   755	  name: 'session_bootstrap',
   756	  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
   757	  inputSchema: {
   758	    type: 'object',
   759	    additionalProperties: false,
   760	    properties: {

exec
/bin/zsh -lc "rg -n \"TOOL_DEFINITIONS|export const TOOL_DEFINITIONS|name: 'memory_|name: 'session_|name: 'code_graph_|name: 'shared_|name: 'checkpoint_|name: 'task_|name: 'eval_|name: 'memory_quick_search|name: 'session_bootstrap\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
42:  name: 'memory_context',
49:  name: 'memory_search',
192:  name: 'memory_quick_search',
211:  name: 'memory_match_triggers',
218:  name: 'memory_save',
225:  name: 'memory_list',
231:  name: 'memory_stats',
237:  name: 'memory_health',
277:  name: 'memory_delete',
292:  name: 'memory_update',
298:  name: 'memory_validate',
320:  name: 'memory_bulk_delete',
327:  name: 'checkpoint_create',
346:  name: 'checkpoint_list',
363:  name: 'checkpoint_restore',
381:  name: 'checkpoint_delete',
403:  name: 'shared_space_upsert',
425:  name: 'shared_space_membership_set',
444:  name: 'shared_memory_status',
459:  name: 'shared_memory_enable',
471:  name: 'task_preflight',
477:  name: 'task_postflight',
484:  name: 'memory_drift_why',
491:  name: 'memory_causal_link',
497:  name: 'memory_causal_stats',
503:  name: 'memory_causal_unlink',
509:  name: 'eval_run_ablation',
544:  name: 'eval_reporting_dashboard',
562:  name: 'memory_index_scan',
568:  name: 'memory_get_learning_history',
574:  name: 'memory_ingest_start',
597:  name: 'memory_ingest_status',
610:  name: 'memory_ingest_cancel',
624:  name: 'code_graph_scan',
639:  name: 'code_graph_query',
657:  name: 'code_graph_status',
663:  name: 'code_graph_context',
733:  name: 'session_health',
740:  name: 'session_resume',
755:  name: 'session_bootstrap',
878:export const TOOL_DEFINITIONS: ToolDefinition[] = [

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Search
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — scripts should import from here, not lib/ internals.
     5	// ARCH-1 stable re-export surface for search functionality.
     6	// Consumer scripts import from here instead of reaching into lib/search/.
     7	
     8	export {
     9	  init as initHybridSearch,
    10	  hybridSearchEnhanced,
    11	  type HybridSearchOptions,
    12	  type HybridSearchResult,
    13	} from '../lib/search/hybrid-search.js';
    14	
    15	export {
    16	  fts5Bm25Search,
    17	  isFts5Available,
    18	} from '../lib/search/sqlite-fts.js';
    19	
    20	export * as vectorIndex from '../lib/search/vector-index.js';

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Indexing
     3	// ────────────────────────────────────────────────────────────────
     4	// @public — scripts should import from here, not core/ or handlers/ internals.
     5	// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
     6	// By reindex orchestration without widening the general public surface.
     7	
     8	import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';
     9	
    10	import { init as initDbState, setEmbeddingModelReady } from '../core/index.js';
    11	import { handleMemoryIndexScan } from '../handlers/index.js';
    12	
    13	import { generateEmbedding, getEmbeddingProfile } from './providers.js';
    14	import { initHybridSearch, vectorIndex } from './search.js';
    15	import { initAccessTracker, initCheckpoints } from './storage.js';
    16	
    17	/** Arguments for memory index scan requests. */
    18	export interface MemoryIndexScanArgs {
    19	  specFolder?: string | null;
    20	  force?: boolean;
    21	  includeConstitutional?: boolean;
    22	  includeSpecDocs?: boolean;
    23	  incremental?: boolean;
    24	}
    25	
    26	/** Initializes indexing runtime dependencies. */
    27	export function initializeIndexingRuntime(): void {
    28	  vectorIndex.initializeDb();
    29	
    30	  initDbState({
    31	    vectorIndex,
    32	    checkpoints: { init: initCheckpoints },
    33	    accessTracker: { init: initAccessTracker },
    34	    hybridSearch: { init: initHybridSearch },
    35	  });
    36	
    37	  const database = vectorIndex.getDb();
    38	  if (!database) {
    39	    throw new Error('Database not initialized after initializeDb(). Cannot proceed.');
    40	  }
    41	
    42	  initCheckpoints(database);
    43	  initAccessTracker(database);
    44	  initHybridSearch(database, vectorIndex.vectorSearch);
    45	}
    46	
    47	/** Warms the embedding model and marks it as ready. */
    48	export async function warmEmbeddingModel(input: string = 'warmup test'): Promise<EmbeddingProfile | null> {
    49	  await generateEmbedding(input);
    50	  setEmbeddingModelReady(true);
    51	  return getEmbeddingProfile() as EmbeddingProfile | null;
    52	}
    53	
    54	/** Runs a memory index scan with the provided arguments. */
    55	export async function runMemoryIndexScan(args: MemoryIndexScanArgs): Promise<MCPResponse> {
    56	  return handleMemoryIndexScan(args);
    57	}
    58	
    59	/** Closes indexing runtime database connections. */
    60	export function closeIndexingRuntime(): void {
    61	  vectorIndex.closeDb();
    62	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
     2	import { resolve, dirname, relative, join } from "node:path";
     3	import { fileURLToPath } from "node:url";
     4	import { createInterface } from "node:readline/promises";
     5	import { execSync, spawn } from "node:child_process";
     6	import { stdin, stdout } from "node:process";
     7	import { globSync } from "glob";
     8	import chalk from "chalk";
     9	import {
    10	  buildFreshPrompt,
    11	  buildExistingWithBriefPrompt,
    12	  buildExistingNoBriefPrompt,
    13	} from "./prompts.js";
    14	
    15	// ── Constants ──
    16	
    17	const __filename = fileURLToPath(import.meta.url);
    18	const __dirname = dirname(__filename);
    19	const TEMPLATES_DIR = resolve(__dirname, "../templates");
    20	
    21	const SOURCE_EXTENSIONS = [
    22	  "*.py", "*.js", "*.ts", "*.tsx", "*.jsx", "*.go", "*.rs", "*.java",
    23	  "*.kt", "*.swift", "*.rb", "*.php", "*.c", "*.cpp", "*.cs", "*.ex",
    24	  "*.exs", "*.zig", "*.lua", "*.dart", "*.scala", "*.clj", "*.erl",
    25	  "*.hs", "*.ml", "*.vue", "*.svelte",
    26	];
    27	
    28	const SCAFFOLD_FILES = [
    29	  "ROUTER.md",
    30	  "AGENTS.md",
    31	  "SETUP.md",
    32	  "SYNC.md",
    33	  "context/architecture.md",
    34	  "context/stack.md",
    35	  "context/conventions.md",
    36	  "context/decisions.md",
    37	  "context/setup.md",
    38	  "patterns/README.md",
    39	  "patterns/INDEX.md",
    40	];
    41	
    42	const TOOL_CONFIGS: Record<string, { src: string; dest: string }> = {
    43	  "1": { src: ".tool-configs/CLAUDE.md", dest: "CLAUDE.md" },
    44	  "2": { src: ".tool-configs/.cursorrules", dest: ".cursorrules" },
    45	  "3": { src: ".tool-configs/.windsurfrules", dest: ".windsurfrules" },
    46	  "4": { src: ".tool-configs/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
    47	  "5": { src: ".tool-configs/opencode.json", dest: ".opencode/opencode.json" },
    48	  "6": { src: ".tool-configs/CLAUDE.md", dest: "AGENTS.md" },  // Codex reads AGENTS.md at root
    49	};
    50	
    51	// ── Helpers ──
    52	
    53	const ok = (msg: string) => console.log(`${chalk.green("✓")} ${msg}`);
    54	const info = (msg: string) => console.log(`${chalk.blue("→")} ${msg}`);
    55	const warn = (msg: string) => console.log(`${chalk.yellow("!")} ${msg}`);
    56	const header = (msg: string) => console.log(`\n${chalk.bold(msg)}`);
    57	
    58	function findProjectRoot(): string {
    59	  let current = resolve(process.cwd());
    60	  while (true) {
    61	    if (existsSync(resolve(current, ".git"))) return current;
    62	    const parent = dirname(current);
    63	    if (parent === current) return process.cwd();
    64	    current = parent;
    65	  }
    66	}
    67	
    68	function isTemplateContent(content: string): boolean {
    69	  return content.includes("[Project Name]") || content.includes("[YYYY-MM-DD]");
    70	}
    71	
    72	function banner() {
    73	  const GRN = "\x1b[38;2;91;140;90m";
    74	  const DGR = "\x1b[38;2;74;122;73m";
    75	  const ORN = "\x1b[38;2;232;132;92m";
    76	  const DRK = "\x1b[38;2;61;61;61m";
    77	  const ROYAL = "\x1b[38;2;25;68;241m";
    78	  const NC = "\x1b[0m";
    79	  const BOLD = "\x1b[1m";
    80	
    81	  console.log();
    82	  console.log(`${GRN}     ████      ${ROYAL}███╗   ███╗███████╗██╗  ██╗${NC}`);
    83	  console.log(`${GRN}    █${DGR}█${GRN}██${DGR}█${GRN}█     ${ROYAL}████╗ ████║██╔════╝╚██╗██╔╝${NC}`);
    84	  console.log(`${ORN}  ██████████   ${ROYAL}██╔████╔██║█████╗   ╚███╔╝${NC}`);
    85	  console.log(`${ORN}█ ██${DRK}██${ORN}██${DRK}██${ORN}██ █ ${ROYAL}██║╚██╔╝██║██╔══╝   ██╔██╗${NC}`);
    86	  console.log(`${ORN}█ ██████████ █ ${ROYAL}██║ ╚═╝ ██║███████╗██╔╝ ██╗${NC}`);
    87	  console.log(`${ORN}   █ █  █ █    ${ROYAL}╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝${NC}`);
    88	  console.log();
    89	  console.log(`               ${BOLD}universal ai context scaffold${NC}`);
    90	}
    91	
    92	// ── Main ──
    93	
    94	type ProjectState = "existing" | "fresh" | "partial";
    95	
    96	export async function runSetup(opts: { dryRun?: boolean } = {}): Promise<void> {
    97	  const { dryRun = false } = opts;
    98	
    99	  banner();
   100	  console.log();
   101	
   102	  if (dryRun) {
   103	    warn("DRY RUN — no files will be created or modified");
   104	    console.log();
   105	  }
   106	
   107	  // Verify templates directory exists (sanity check for npm package integrity)
   108	  if (!existsSync(TEMPLATES_DIR)) {
   109	    throw new Error(
   110	      `Templates directory not found at ${TEMPLATES_DIR}. The promexeus package may be corrupted — try reinstalling.`
   111	    );
   112	  }
   113	
   114	  const projectRoot = findProjectRoot();
   115	  const mexDir = resolve(projectRoot, ".mex");
   116	
   117	  // Guard: don't run inside the mex repo itself
   118	  if (existsSync(resolve(projectRoot, "src", "setup", "index.ts"))) {
   119	    const pkg = resolve(projectRoot, "package.json");
   120	    if (existsSync(pkg)) {
   121	      const pkgContent = readFileSync(pkg, "utf-8");
   122	      if (pkgContent.includes('"promexeus"') || pkgContent.includes('"mex"')) {
   123	        throw new Error(
   124	          "You're inside the mex repository itself. Run this from your project root instead."
   125	        );
   126	      }
   127	    }
   128	  }
   129	
   130	  // ── Step 1: Detect project state ──
   131	
   132	  const state = detectProjectState(projectRoot, mexDir);
   133	
   134	  switch (state) {
   135	    case "existing":
   136	      info("Detected: existing codebase with source files");
   137	      info("Mode: populate scaffold from code");
   138	      break;
   139	    case "fresh":
   140	      info("Detected: fresh project (no source files yet)");
   141	      info("Mode: populate scaffold from intent");
   142	      break;
   143	    case "partial":
   144	      info("Detected: existing codebase with partially populated scaffold");
   145	      info("Mode: will populate empty slots, skip what's already filled");
   146	      break;
   147	  }
   148	  console.log();
   149	
   150	  // ── Step 2: Create .mex/ scaffold ──
   151	
   152	  header("Creating .mex/ scaffold...");
   153	  console.log();
   154	
   155	  for (const file of SCAFFOLD_FILES) {
   156	    const src = resolve(TEMPLATES_DIR, file);
   157	    const dest = resolve(mexDir, file);
   158	
   159	    if (existsSync(dest)) {
   160	      const existingContent = readFileSync(dest, "utf-8");
   161	      const templateContent = readFileSync(src, "utf-8");
   162	
   163	      // Skip if file has been populated (no longer matches template markers)
   164	      if (!isTemplateContent(existingContent) && existingContent !== templateContent) {
   165	        info(`Skipped .mex/${file} (already populated)`);
   166	        continue;
   167	      }
   168	    }
   169	
   170	    if (dryRun) {
   171	      ok(`(dry run) Would copy .mex/${file}`);
   172	    } else {
   173	      mkdirSync(dirname(dest), { recursive: true });
   174	      copyFileSync(src, dest);
   175	      ok(`Copied .mex/${file}`);
   176	    }
   177	  }
   178	  console.log();
   179	
   180	  // ── Step 3: Tool config selection ──
   181	
   182	  let selectedClaude = false;
   183	
   184	  const rl = createInterface({ input: stdin, output: stdout });
   185	  try {
   186	    selectedClaude = await selectToolConfig(rl, projectRoot, dryRun);
   187	  } finally {
   188	    rl.close();
   189	  }
   190	  console.log();
   191	
   192	  // ── Step 4: Run scanner (if not fresh) ──
   193	
   194	  let scannerBrief: string | null = null;
   195	
   196	  if (state !== "fresh") {
   197	    try {
   198	      info("Scanning codebase...");
   199	      const { runScan } = await import("../scanner/index.js");
   200	      const config = { projectRoot, scaffoldRoot: mexDir };
   201	      const result = await runScan(config, { jsonOnly: true });
   202	      scannerBrief = JSON.stringify(result, null, 2);
   203	      ok("Pre-analysis complete — AI will reason from brief instead of exploring");
   204	    } catch {
   205	      warn("Scanner failed — AI will explore the filesystem directly");
   206	    }
   207	  }
   208	
   209	  // ── Step 5: Build population prompt ──
   210	
   211	  let prompt: string;
   212	  if (state === "fresh") {
   213	    prompt = buildFreshPrompt();
   214	  } else if (scannerBrief) {
   215	    prompt = buildExistingWithBriefPrompt(scannerBrief);
   216	  } else {
   217	    prompt = buildExistingNoBriefPrompt();
   218	  }
   219	
   220	  // ── Step 6: Run or print ──
   221	
   222	  if (dryRun) {
   223	    header("Would run population prompt (dry run — skipping)");
   224	    console.log();
   225	    ok("Done (dry run).");
   226	    return;
   227	  }
   228	
   229	  const hasClaude = hasClaudeCli();
   230	
   231	  if (selectedClaude && hasClaude) {
   232	    header("Launching Claude Code to populate the scaffold...");
   233	    console.log();
   234	    info("An interactive Claude Code session will open with the population prompt.");
   235	    info("You'll see the agent working in real-time.");
   236	    console.log();
   237	
   238	    await launchClaude(prompt);
   239	
   240	    console.log();
   241	    ok("Setup complete.");
   242	    await promptGlobalInstall();
   243	    return;
   244	  } else {
   245	    header("Almost done. One more step — populate the scaffold.");
   246	    console.log();
   247	
   248	    if (hasClaude) {
   249	      info("You can run this directly with Claude Code:");
   250	      console.log();
   251	      console.log("  claude -p '<the prompt below>'");
   252	      console.log();
   253	      info("Or paste the prompt below into your AI tool.");
   254	    } else {
   255	      info("Paste the prompt below into your AI tool.");
   256	      info("The agent will read your codebase and fill every scaffold file.");
   257	    }
   258	
   259	    console.log();
   260	    console.log("─────────────────── COPY BELOW THIS LINE ───────────────────");
   261	    console.log();
   262	    console.log(prompt);
   263	    console.log();
   264	    console.log("─────────────────── COPY ABOVE THIS LINE ───────────────────");
   265	    console.log();
   266	    ok("Paste the prompt above into your agent to populate the scaffold.");
   267	  }
   268	
   269	  await promptGlobalInstall();
   270	}
   271	
   272	// ── Step functions ──
   273	
   274	function detectProjectState(projectRoot: string, mexDir: string): ProjectState {
   275	  // Check if scaffold is already partially populated
   276	  const agentsMd = resolve(mexDir, "AGENTS.md");
   277	  let scaffoldPopulated = false;
   278	  if (existsSync(agentsMd)) {
   279	    const content = readFileSync(agentsMd, "utf-8");
   280	    if (!content.includes("[Project Name]")) {

exec
/bin/zsh -lc 'rg -n "tool-config|CLAUDE.md|opencode.json|copilot|cursorrules|windsurfrules|AGENTS.md|ROUTER.md" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:29:  "ROUTER.md",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:30:  "AGENTS.md",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:43:  "1": { src: ".tool-configs/CLAUDE.md", dest: "CLAUDE.md" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:44:  "2": { src: ".tool-configs/.cursorrules", dest: ".cursorrules" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:45:  "3": { src: ".tool-configs/.windsurfrules", dest: ".windsurfrules" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:46:  "4": { src: ".tool-configs/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:47:  "5": { src: ".tool-configs/opencode.json", dest: ".opencode/opencode.json" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:48:  "6": { src: ".tool-configs/CLAUDE.md", dest: "AGENTS.md" },  // Codex reads AGENTS.md at root
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:276:  const agentsMd = resolve(mexDir, "AGENTS.md");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:373:      info("Skipped tool config — AGENTS.md in .mex/ works with any tool that can read files");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:451:  console.log('    "Read .mex/ROUTER.md and tell me what you know about this project."');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:36:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:76:After populating .mex/context/ files, update .mex/ROUTER.md:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:80:Update .mex/AGENTS.md:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:88:1. .mex/ROUTER.md — understand the scaffold structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:118:Update .mex/ROUTER.md current state to reflect that this is a new project.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:120:Update .mex/AGENTS.md with the project name, description, non-negotiables, and commands.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:138:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:158:1. .mex/ROUTER.md — understand the scaffold structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:184:1. .mex/ROUTER.md — understand the scaffold structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:48:6. ROUTER.md — update the "Current Project State" section
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:78:    "ROUTER.md",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:79:    "AGENTS.md",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:96:  // Also check project root for tool config files (CLAUDE.md, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:98:    for (const name of ["CLAUDE.md", ".cursorrules", ".windsurfrules"]) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:23:  if (existsSync(mexDir) && !existsSync(resolve(mexDir, "ROUTER.md"))) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:50:- [ ] Update \`ROUTER.md\` "Current Project State" if what's working/not built has changed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:29:  "ROUTER.md",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:30:  "AGENTS.md",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:43:  "1": { src: ".tool-configs/CLAUDE.md", dest: "CLAUDE.md" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:44:  "2": { src: ".tool-configs/.cursorrules", dest: ".cursorrules" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:45:  "3": { src: ".tool-configs/.windsurfrules", dest: ".windsurfrules" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:46:  "4": { src: ".tool-configs/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:47:  "5": { src: ".tool-configs/opencode.json", dest: ".opencode/opencode.json" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:48:  "6": { src: ".tool-configs/CLAUDE.md", dest: "AGENTS.md" },  // Codex reads AGENTS.md at root
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:276:  const agentsMd = resolve(mexDir, "AGENTS.md");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:373:      info("Skipped tool config — AGENTS.md in .mex/ works with any tool that can read files");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:451:  console.log('    "Read .mex/ROUTER.md and tell me what you know about this project."');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:36:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:76:After populating .mex/context/ files, update .mex/ROUTER.md:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:80:Update .mex/AGENTS.md:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:88:1. .mex/ROUTER.md — understand the scaffold structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:118:Update .mex/ROUTER.md current state to reflect that this is a new project.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:120:Update .mex/AGENTS.md with the project name, description, non-negotiables, and commands.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:138:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:158:1. .mex/ROUTER.md — understand the scaffold structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:184:1. .mex/ROUTER.md — understand the scaffold structure

2026-04-10T19:29:03.068812Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
p=Path('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts')
text=p.read_text()
count=text.count(\"name: '\")
print(count)
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
exec
/bin/zsh -lc "rg -n \"name: 'ccc_|name: 'session_|name: 'code_graph_|name: 'memory_\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | wc -l" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      31

exec
/bin/zsh -lc "rg -n \"name: '\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | wc -l" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '340,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      47

 succeeded in 0ms:
   340	      }
   341	      return;
   342	    }
   343	
   344	    if (existsSync(dest)) {
   345	      // Can't ask interactively here since we already have rl,
   346	      // so just warn and skip
   347	      warn(`${config.dest} already exists — skipped (delete it first to replace)`);
   348	      return;
   349	    }
   350	
   351	    mkdirSync(dirname(dest), { recursive: true });
   352	    copyFileSync(src, dest);
   353	    ok(`Copied ${config.dest}`);
   354	  };
   355	
   356	  switch (choice) {
   357	    case "1":
   358	    case "2":
   359	    case "3":
   360	    case "4":
   361	    case "5":
   362	    case "6":
   363	      copyConfig(choice);
   364	      break;
   365	    case "7": {
   366	      const multi = (await rl.question("Enter tool numbers separated by spaces (e.g. 1 2 5): ")).trim();
   367	      for (const c of multi.split(/\s+/)) {
   368	        copyConfig(c);
   369	      }
   370	      break;
   371	    }
   372	    case "8":
   373	      info("Skipped tool config — AGENTS.md in .mex/ works with any tool that can read files");
   374	      break;
   375	    default:
   376	      warn("Unknown choice, skipping tool config");
   377	      break;
   378	  }
   379	
   380	  return selectedClaude;
   381	}
   382	
   383	function hasClaudeCli(): boolean {
   384	  try {
   385	    execSync("which claude", { stdio: "ignore" });
   386	    return true;
   387	  } catch {
   388	    return false;
   389	  }
   390	}
   391	
   392	function launchClaude(prompt: string): Promise<void> {
   393	  return new Promise((resolve, reject) => {
   394	    const child = spawn("claude", [prompt], {
   395	      stdio: "inherit",
   396	      shell: false,
   397	    });
   398	
   399	    child.on("close", (code) => {
   400	      if (code === 0) resolve();
   401	      else reject(new Error(`Claude exited with code ${code}`));
   402	    });
   403	
   404	    child.on("error", (err) => {
   405	      reject(new Error(`Failed to launch Claude: ${err.message}`));
   406	    });
   407	  });
   408	}
   409	
   410	async function promptGlobalInstall(): Promise<void> {
   411	  const rl = createInterface({ input: stdin, output: stdout });
   412	  try {
   413	    header("One more thing");
   414	    console.log();
   415	    info("Install mex globally so `mex check` works anywhere?");
   416	    console.log();
   417	
   418	    const answer = (await rl.question("  Install mex globally? [Y/n] ")).trim().toLowerCase();
   419	
   420	    if (answer === "" || answer === "y" || answer === "yes") {
   421	      console.log();
   422	      info("Installing promexeus globally...");
   423	      try {
   424	        execSync("npm install -g promexeus", { stdio: "inherit" });
   425	        console.log();
   426	        ok("Installed globally. `mex check` and `mex sync` work from anywhere now.");
   427	        printNextSteps(true);
   428	      } catch {
   429	        console.log();
   430	        warn("Global install failed. You can retry manually:");
   431	        console.log("    npm install -g promexeus");
   432	        console.log();
   433	        printNextSteps(false);
   434	      }
   435	    } else {
   436	      console.log();
   437	      info("No problem. You can always install later:");
   438	      console.log("    npm install -g promexeus");
   439	      console.log();
   440	      printNextSteps(false);
   441	    }
   442	  } finally {
   443	    rl.close();
   444	  }
   445	}
   446	
   447	function printNextSteps(globalInstalled: boolean) {
   448	  header("What's next");
   449	  console.log();
   450	  info("Verify — start a fresh session and ask:");
   451	  console.log('    "Read .mex/ROUTER.md and tell me what you know about this project."');
   452	  console.log();
   453	
   454	  if (globalInstalled) {
   455	    info("Ongoing commands:");
   456	    console.log("    mex check              Drift score — are scaffold files still accurate?");
   457	    console.log("    mex check --quiet      One-liner drift score");
   458	    console.log("    mex sync               Fix drift — AI updates only what's broken");
   459	    console.log("    mex watch              Auto-check drift after every commit");
   460	  } else {
   461	    info("Ongoing commands (via npx):");
   462	    console.log("    npx promexeus check              Drift score — are scaffold files still accurate?");
   463	    console.log("    npx promexeus check --quiet      One-liner drift score");
   464	    console.log("    npx promexeus sync               Fix drift — AI updates only what's broken");
   465	    console.log("    npx promexeus watch              Auto-check drift after every commit");
   466	    console.log();
   467	    info("Or install globally to use the shorter `mex` command:");
   468	    console.log("    npm install -g promexeus");
   469	  }
   470	  console.log();

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	/**
     2	 * Population prompt templates for mex setup.
     3	 * Three variants based on project state:
     4	 *   - fresh: no source files, ask user questions
     5	 *   - existing with scanner brief: AI reasons from pre-analyzed data
     6	 *   - existing without brief: AI explores filesystem directly
     7	 */
     8	
     9	/** Shared pass 2+3 instructions appended to existing-project prompts */
    10	const EXISTING_PASSES_2_3 = `
    11	PASS 2 — Generate starter patterns:
    12	
    13	Read .mex/patterns/README.md for the format and categories.
    14	
    15	Generate 3-5 starter patterns for the most common and most dangerous task
    16	types in this project. Focus on:
    17	- The 1-2 tasks a developer does most often (e.g., add endpoint, add component)
    18	- The 1-2 integrations with the most non-obvious gotchas
    19	- 1 debug pattern for the most common failure boundary
    20	
    21	Each pattern should be specific to this project — real file paths, real gotchas,
    22	real verify steps derived from the code you read in Pass 1.
    23	Use the format in .mex/patterns/README.md. Name descriptively (e.g., add-endpoint.md).
    24	
    25	Do NOT try to generate a pattern for every possible task type. The scaffold
    26	grows incrementally — the behavioural contract (step 5: GROW) will create
    27	new patterns from real work as the project evolves. Setup just seeds the most
    28	critical ones.
    29	
    30	After generating patterns, update .mex/patterns/INDEX.md with a row for each
    31	pattern file you created. For multi-section patterns, add one row per task
    32	section using anchor links (see INDEX.md annotation for format).
    33	
    34	PASS 3 — Wire the web:
    35	
    36	Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
    37	For each file, add or update the edges array in the YAML frontmatter.
    38	Each edge should point to another scaffold file that is meaningfully related,
    39	with a condition explaining when an agent should follow that edge.
    40	
    41	Rules for edges:
    42	- Every context/ file should have at least 2 edges
    43	- Every pattern file should have at least 1 edge (usually to the relevant context file)
    44	- Edges should be bidirectional where it makes sense (if A links to B, consider B linking to A)
    45	- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
    46	- Pattern files can edge to other patterns (e.g., debug pattern → related task pattern)
    47	
    48	Important: only write content derived from the codebase.
    49	Do not include system-injected text (dates, reminders, etc.)
    50	in any scaffold file.
    51	
    52	When done, confirm which files were populated and flag any slots
    53	you could not fill with confidence.`;
    54	
    55	/** Shared pass 1 populate instructions for existing projects */
    56	const EXISTING_PASS_1 = `
    57	Populate each .mex/context/ file by replacing the annotation comments
    58	with real content from this codebase. Follow the annotation instructions exactly.
    59	For each slot:
    60	- Use the actual names, patterns, and structures from this codebase
    61	- Do not use generic examples
    62	- Do not leave any slot empty — if you cannot determine the answer,
    63	  write "[TO DETERMINE]" and explain what information is needed
    64	- Keep length within the guidance given in each annotation
    65	
    66	Then assess: does this project have domains complex enough that cramming
    67	them into architecture.md would make it too long or too shallow?
    68	If yes, create additional domain-specific context files in .mex/context/.
    69	Examples: a project with a complex auth system gets .mex/context/auth.md.
    70	A data pipeline gets .mex/context/ingestion.md. A project with Stripe gets
    71	.mex/context/payments.md. Use the same YAML frontmatter format (name,
    72	description, triggers, edges, last_updated). Only create these for
    73	domains that have real depth — not for simple integrations that fit
    74	in a few lines of architecture.md.
    75	
    76	After populating .mex/context/ files, update .mex/ROUTER.md:
    77	- Fill in the Current Project State section based on what you found
    78	- Add rows to the routing table for any domain-specific context files you created
    79	
    80	Update .mex/AGENTS.md:
    81	- Fill in the project name, one-line description, non-negotiables, and commands`;
    82	
    83	export function buildFreshPrompt(): string {
    84	  return `You are going to populate an AI context scaffold for a project that
    85	is just starting. Nothing is built yet.
    86	
    87	Read the following files in order before doing anything else:
    88	1. .mex/ROUTER.md — understand the scaffold structure
    89	2. All files in .mex/context/ — read the annotation comments in each
    90	
    91	Then ask me the following questions one section at a time.
    92	Wait for my answer before moving to the next section:
    93	
    94	1. What does this project do? (one sentence)
    95	2. What are the hard rules — things that must never happen in this codebase?
    96	3. What is the tech stack? (language, framework, database, key libraries)
    97	4. Why did you choose this stack over alternatives?
    98	5. How will the major pieces connect? Describe the flow of a typical request/action.
    99	6. What patterns do you want to enforce from day one?
   100	7. What are you deliberately NOT building or using?
   101	
   102	After I answer, populate the .mex/context/ files based on my answers.
   103	For any slot you cannot fill yet, write "[TO BE DETERMINED]" and note
   104	what needs to be decided before it can be filled.
   105	
   106	Then assess: based on my answers, does this project have domains complex
   107	enough that cramming them into architecture.md would make it too long
   108	or too shallow? If yes, create additional domain-specific context files
   109	in .mex/context/. Examples: a project with a complex auth system gets
   110	.mex/context/auth.md. A data pipeline gets .mex/context/ingestion.md.
   111	A project with Stripe gets .mex/context/payments.md. Use the same YAML
   112	frontmatter format (name, description, triggers, edges, last_updated).
   113	Only create these for domains that have real depth — not for simple
   114	integrations that fit in a few lines of architecture.md. For fresh
   115	projects, mark domain-specific unknowns with "[TO BE DETERMINED —
   116	populate after first implementation]".
   117	
   118	Update .mex/ROUTER.md current state to reflect that this is a new project.
   119	Add rows to the routing table for any domain-specific context files you created.
   120	Update .mex/AGENTS.md with the project name, description, non-negotiables, and commands.
   121	
   122	Read .mex/patterns/README.md for the format and categories.
   123	
   124	Generate 2-3 starter patterns for the most obvious task types you can
   125	anticipate for this stack. Focus on the tasks a developer will do first.
   126	Mark unknowns with "[VERIFY AFTER FIRST IMPLEMENTATION]".
   127	
   128	Do NOT try to anticipate every possible pattern. The scaffold grows
   129	incrementally — the behavioural contract (step 5: GROW) will create
   130	new patterns from real work as the project evolves. Setup just seeds
   131	the most critical ones.
   132	
   133	After generating patterns, update .mex/patterns/INDEX.md with a row for each
   134	pattern file you created.
   135	
   136	PASS 3 — Wire the web:
   137	
   138	Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
   139	For each file, add or update the edges array in the YAML frontmatter.
   140	Each edge should point to another scaffold file that is meaningfully related,
   141	with a condition explaining when an agent should follow that edge.
   142	
   143	Rules for edges:
   144	- Every context/ file should have at least 2 edges
   145	- Every pattern file should have at least 1 edge
   146	- Edges should be bidirectional where it makes sense
   147	- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
   148	
   149	Important: only write content derived from the codebase or from my answers.
   150	Do not include system-injected text (dates, reminders, etc.) in any scaffold file.`;
   151	}
   152	
   153	export function buildExistingWithBriefPrompt(briefJson: string): string {
   154	  return `You are going to populate an AI context scaffold for this project.
   155	The scaffold lives in the .mex/ directory.
   156	
   157	Read the following files in order before doing anything else:
   158	1. .mex/ROUTER.md — understand the scaffold structure
   159	2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
   160	3. .mex/context/stack.md — same
   161	4. .mex/context/conventions.md — same
   162	5. .mex/context/decisions.md — same
   163	6. .mex/context/setup.md — same
   164	
   165	Here is a pre-analyzed brief of the codebase — do NOT explore the filesystem
   166	yourself for basic structure. Reason from this brief for dependencies, entry
   167	points, tooling, and folder layout. You may still read specific files when
   168	you need to understand implementation details for patterns or architecture.
   169	
   170	<brief>
   171	${briefJson}
   172	</brief>
   173	
   174	PASS 1 — Populate knowledge files:
   175	${EXISTING_PASS_1}
   176	${EXISTING_PASSES_2_3}`;
   177	}
   178	
   179	export function buildExistingNoBriefPrompt(): string {
   180	  return `You are going to populate an AI context scaffold for this project.
   181	The scaffold lives in the .mex/ directory.
   182	
   183	Read the following files in order before doing anything else:
   184	1. .mex/ROUTER.md — understand the scaffold structure
   185	2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
   186	3. .mex/context/stack.md — same
   187	4. .mex/context/conventions.md — same
   188	5. .mex/context/decisions.md — same
   189	6. .mex/context/setup.md — same
   190	
   191	Then explore this codebase:
   192	- Read the main entry point(s)
   193	- Read the folder structure
   194	- Read 2-3 representative files from each major layer
   195	- Read any existing README or documentation
   196	
   197	PASS 1 — Populate knowledge files:
   198	${EXISTING_PASS_1}
   199	${EXISTING_PASSES_2_3}`;
   200	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import chalk from "chalk";
     2	import type { DriftReport, DriftIssue, Severity } from "./types.js";
     3	
     4	const severityColor: Record<Severity, (s: string) => string> = {
     5	  error: chalk.red,
     6	  warning: chalk.yellow,
     7	  info: chalk.blue,
     8	};
     9	
    10	const severityIcon: Record<Severity, string> = {
    11	  error: "✗",
    12	  warning: "⚠",
    13	  info: "ℹ",
    14	};
    15	
    16	export function reportConsole(report: DriftReport): void {
    17	  // Show score at top so it's visible before scrolling through issues
    18	  if (report.issues.length > 0) {
    19	    printSummary(report);
    20	    console.log();
    21	  }
    22	
    23	  const grouped = groupByFile(report.issues);
    24	
    25	  for (const [file, issues] of Object.entries(grouped)) {
    26	    console.log(chalk.bold.underline(file));
    27	    for (const issue of issues) {
    28	      const color = severityColor[issue.severity];
    29	      const icon = severityIcon[issue.severity];
    30	      const loc = issue.line ? `:${issue.line}` : "";
    31	      console.log(
    32	        `  ${color(`${icon} ${issue.code}`)}${loc} ${issue.message}`
    33	      );
    34	    }
    35	    console.log();
    36	  }
    37	
    38	  printSummary(report);
    39	}
    40	
    41	export function reportQuiet(report: DriftReport): void {
    42	  const errors = report.issues.filter((i) => i.severity === "error").length;
    43	  const warnings = report.issues.filter(
    44	    (i) => i.severity === "warning"
    45	  ).length;
    46	  const parts = [];
    47	  if (errors) parts.push(`${errors} error${errors > 1 ? "s" : ""}`);
    48	  if (warnings) parts.push(`${warnings} warning${warnings > 1 ? "s" : ""}`);
    49	  const detail = parts.length ? ` (${parts.join(", ")})` : "";
    50	  const color =
    51	    report.score >= 80
    52	      ? chalk.green
    53	      : report.score >= 50
    54	        ? chalk.yellow
    55	        : chalk.red;
    56	  console.log(`mex: drift score ${color(`${report.score}/100`)}${detail}`);
    57	}
    58	
    59	export function reportJSON(report: DriftReport): void {
    60	  console.log(JSON.stringify(report, null, 2));
    61	}
    62	
    63	function printSummary(report: DriftReport): void {
    64	  const errors = report.issues.filter((i) => i.severity === "error").length;
    65	  const warnings = report.issues.filter(
    66	    (i) => i.severity === "warning"
    67	  ).length;
    68	  const infos = report.issues.filter((i) => i.severity === "info").length;
    69	  const color =
    70	    report.score >= 80
    71	      ? chalk.green
    72	      : report.score >= 50
    73	        ? chalk.yellow
    74	        : chalk.red;
    75	
    76	  console.log(
    77	    chalk.bold(
    78	      `Drift score: ${color(`${report.score}/100`)} — ${errors} errors, ${warnings} warnings, ${infos} info`
    79	    )
    80	  );
    81	  console.log(chalk.dim(`${report.filesChecked} files checked`));
    82	}
    83	
    84	function groupByFile(
    85	  issues: DriftIssue[]
    86	): Record<string, DriftIssue[]> {
    87	  const grouped: Record<string, DriftIssue[]> = {};
    88	  for (const issue of issues) {
    89	    if (!grouped[issue.file]) grouped[issue.file] = [];
    90	    grouped[issue.file].push(issue);
    91	  }
    92	  return grouped;
    93	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '860,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   860	    type: 'object', additionalProperties: false,
   861	    properties: {
   862	      specFolder: { type: 'string', minLength: 1, description: 'Spec folder for namespace (required)' },
   863	      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
   864	      iteration: { type: 'number', description: 'Current iteration number (used for snapshot persistence)' },
   865	      persistSnapshot: { type: 'boolean', default: false, description: 'When true, persist a signal snapshot for this iteration' },
   866	    },
   867	    required: ['specFolder', 'loopType'],
   868	  },
   869	};
   870	
   871	// ───────────────────────────────────────────────────────────────
   872	// 3. AGGREGATED DEFINITIONS
   873	
   874	// ───────────────────────────────────────────────────────────────
   875	/**
   876	 * Canonical ordered list of MCP tool registrations exposed by this server.
   877	 */
   878	export const TOOL_DEFINITIONS: ToolDefinition[] = [
   879	  // L1: Orchestration
   880	  memoryContext,
   881	  sessionResume,
   882	  sessionBootstrap,
   883	  // L2: Core
   884	  memorySearch,
   885	  memoryQuickSearch,
   886	  memoryMatchTriggers,
   887	  memorySave,
   888	  // L3: Discovery
   889	  memoryList,
   890	  memoryStats,
   891	  memoryHealth,
   892	  sessionHealth,
   893	  // L4: Mutation
   894	  memoryDelete,
   895	  memoryUpdate,
   896	  memoryValidate,
   897	  memoryBulkDelete,
   898	  // L5: Lifecycle
   899	  checkpointCreate,
   900	  checkpointList,
   901	  checkpointRestore,
   902	  checkpointDelete,
   903	  sharedSpaceUpsert,
   904	  sharedSpaceMembershipSet,
   905	  sharedMemoryStatus,
   906	  sharedMemoryEnable,
   907	  // L6: Analysis
   908	  taskPreflight,
   909	  taskPostflight,
   910	  memoryDriftWhy,
   911	  memoryCausalLink,
   912	  memoryCausalStats,
   913	  memoryCausalUnlink,
   914	  evalRunAblation,
   915	  evalReportingDashboard,
   916	  // L7: Maintenance
   917	  memoryIndexScan,
   918	  memoryGetLearningHistory,
   919	  memoryIngestStart,
   920	  memoryIngestStatus,
   921	  memoryIngestCancel,
   922	  // L8: Code Graph
   923	  codeGraphScan,
   924	  codeGraphQuery,
   925	  codeGraphStatus,
   926	  codeGraphContext,
   927	  // L8: CocoIndex
   928	  cccStatus,
   929	  cccReindex,
   930	  cccFeedback,
   931	  // L9: Coverage Graph
   932	  deepLoopGraphUpsert,
   933	  deepLoopGraphQuery,
   934	  deepLoopGraphStatus,
   935	  deepLoopGraphConvergence,
   936	];

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1550,1615p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1550	    );
  1551	  }
  1552	
  1553	  console.error('[context-server] Initializing database...');
  1554	  vectorIndex.initializeDb();
  1555	  dbInitialized = true;
  1556	  console.error('[context-server] Database initialized');
  1557	  console.error('[context-server] Database path: ' + DATABASE_PATH);
  1558	
  1559	  // Initialize db-state module with dependencies
  1560	  // P4-12/P4-19 FIX: Pass sessionManager and incrementalIndex so db-state can
  1561	  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
  1562	  initDbState({
  1563	    vectorIndex,
  1564	    checkpoints: checkpointsLib,
  1565	    accessTracker,
  1566	    hybridSearch,
  1567	    sessionManager,
  1568	    incrementalIndex,
  1569	    dbConsumers: [
  1570	      sessionBoost,
  1571	      causalBoost,
  1572	      historyStore,
  1573	      workingMemory,
  1574	      attentionDecay,
  1575	      coActivation,
  1576	      archivalManager,
  1577	    ],
  1578	  });
  1579	
  1580	  // T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled
  1581	  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
  1582	  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
  1583	  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
  1584	  // Mark embedding as "ready" since it will self-initialize on first use
  1585	  setEmbeddingModelReady(true);
  1586	
  1587	  // Integrity check and module initialization
  1588	  try {
  1589	    const report = vectorIndex.verifyIntegrity();
  1590	    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
  1591	    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);
  1592	
  1593	    // Validate embedding dimension matches database
  1594	    const dimValidation = vectorIndex.validateEmbeddingDimension();
  1595	    if (!dimValidation.valid) {
  1596	      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
  1597	      console.error(`[context-server] ${dimValidation.warning}`);
  1598	      console.error(`[context-server] =========================================`);
  1599	      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
  1600	      throw new Error(dimValidation.warning ?? 'Embedding dimension mismatch between provider and database');
  1601	    } else if (dimValidation.stored) {
  1602	      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
  1603	    }
  1604	
  1605	    const database = vectorIndex.getDb();
  1606	    if (!database) {
  1607	      throw new Error('Database not initialized after initializeDb(). Cannot start server.');
  1608	    }
  1609	
  1610	    try {
  1611	      initScoringObservability(database);
  1612	      console.error('[context-server] Scoring observability initialized');
  1613	    } catch (scoringObsErr: unknown) {
  1614	      const message = scoringObsErr instanceof Error ? scoringObsErr.message : String(scoringObsErr);
  1615	      console.warn('[context-server] Scoring observability init failed (non-fatal):', message);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Spec Kit Memory - MCP Server"
     3	description: "Model Context Protocol server providing semantic memory, hybrid search and graph intelligence for AI-assisted development across sessions, models and tools."
     4	trigger_phrases:
     5	  - "MCP server"
     6	  - "spec kit memory"
     7	  - "hybrid search"
     8	  - "cognitive memory"
     9	  - "memory_context"
    10	  - "memory_search"
    11	  - "47 tools"
    12	  - "FSRS decay"
    13	---
    14	
    15	# Spec Kit Memory - MCP Server
    16	
    17	> AI memory that persists across sessions, models and tools without poisoning your context window.
    18	
    19	---
    20	
    21	<!-- ANCHOR:table-of-contents -->
    22	## TABLE OF CONTENTS
    23	
    24	- [1. OVERVIEW](#1--overview)
    25	- [2. QUICK START](#2--quick-start)
    26	- [3. FEATURES](#3--features)
    27	  - [3.1 HOW THE MEMORY SYSTEM WORKS](#31--how-the-memory-system-works)
    28	  - [3.2 TOOL REFERENCE](#32--tool-reference)
    29	- [4. STRUCTURE](#4--structure)
    30	- [5. CONFIGURATION](#5--configuration)
    31	- [6. USAGE EXAMPLES](#6--usage-examples)
    32	- [7. TROUBLESHOOTING](#7--troubleshooting)
    33	- [8. FAQ](#8--faq)
    34	- [9. RELATED DOCUMENTS](#9--related-documents)
    35	
    36	<!-- /ANCHOR:table-of-contents -->
    37	
    38	---
    39	
    40	<!-- ANCHOR:overview -->
    41	## 1. OVERVIEW
    42	
    43	### What This Is
    44	
    45	Your AI assistant has amnesia. Every conversation starts from scratch. You explain your project architecture on Monday and by Wednesday it is a blank slate. This server fixes that.
    46	
    47	Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.
    48	
    49	The server works across sessions, models and tools. Switch from Claude to GPT to Gemini and back. The memory stays the same because it lives in a database on your machine, not inside any AI's context window.
    50	
    51	### Key Numbers
    52	
    53	| What | Count | Details |
    54	|------|-------|---------|
    55	| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
    56	| **Search channels** | 5 core + CocoIndex bridge | Vector, FTS5, BM25, Causal Graph, Degree (+ CocoIndex semantic code search as external bridge) |
    57	| **Pipeline stages** | 4 | Gather (graph-first routing), Score, Rerank, Filter |
    58	| **Importance tiers** | 6 | constitutional, critical, important, normal, temporary, deprecated |
    59	| **Memory states** | 5 | HOT, WARM, COLD, DORMANT, ARCHIVED |
    60	| **Intent types** | 7 | add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |
    61	| **Causal relations** | 6 | caused, enabled, supersedes, contradicts, derived_from, supports |
    62	| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
    63	| **Embedding providers** | 3 | Voyage AI, OpenAI, HuggingFace local |
    64	
    65	### How This Compares to Basic RAG
    66	
    67	| Capability | Basic RAG | Spec Kit Memory |
    68	|------------|-----------|-----------------|
    69	| **Search** | Vector similarity only | 5 core channels + CocoIndex bridge, fused with Reciprocal Rank Fusion (K tuned per intent) |
    70	| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
    71	| **"Why" queries** | Not possible | Causal graph with 6 relationship types, community detection and depth signals |
    72	| **Forgetting curve** | None or exponential | FSRS power-law decay with classification-aware 2D matrix (context type x importance tier) |
    73	| **Query understanding** | Keyword match | Intent classification (7 types), complexity routing, query decomposition |
    74	| **Sessions** | Stateless | Working memory with attention decay, ~50% token savings via deduplication |
    75	| **Section retrieval** | Returns full documents | ANCHOR-based chunking with ~93% token savings |
    76	| **Duplicate handling** | Indexes everything | 4-outcome Prediction Error gating (create, reinforce, update, supersede) |
    77	| **Memory state** | Everything treated equally | 5-state cognitive lifecycle (HOT through ARCHIVED) with FSRS-driven transitions |
    78	| **Save quality** | Accept everything | 3-layer gate (structure, semantic sufficiency, duplicate) with dry-run preview |
    79	| **Explainability** | Black box | Confidence scoring (high/medium/low) + two-tier trace (basic and debug) |
    80	| **Access control** | None | Shared spaces with deny-by-default membership and kill switches |
    81	| **Evaluation** | Manual testing | Ablation studies, 12-metric computation (MRR, NDCG), synthetic ground truth corpus |
    82	
    83	### How You Use It
    84	
    85	The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
    86	
    87	| Command | What It Does | Tool Count |
    88	|---------|-------------|------------|
    89	| `/memory:search` | Search, retrieve and analyze knowledge | 13 tools |
    90	| `/memory:learn` | Create always-surface rules (constitutional memories) | 6 tools |
    91	| `/memory:manage` | Database maintenance, checkpoints, bulk ingestion, shared-memory spaces and memberships | 19 primary tools + 1 helper |
    92	| `/memory:save` | Save conversation context | 4 tools |
    93	| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
    94	
    95	### Requirements
    96	
    97	| Requirement | Minimum | Recommended |
    98	|-------------|---------|-------------|
    99	| Node.js | 18.x | 20.x LTS |
   100	| SQLite | Bundled | Bundled (better-sqlite3) |
   101	| Embedding API | None (HuggingFace local) | Voyage AI (`VOYAGE_API_KEY`) |
   102	| Memory | 512 MB | 1 GB+ |
   103	| Disk | 100 MB | 500 MB (grows with index size) |
   104	
   105	Module/runtime profile in this package:
   106	- `package.json` sets `"type": "module"` (ESM runtime output from `dist/`).
   107	- `tsconfig.json` uses `"module": "nodenext"` and `"moduleResolution": "nodenext"`.
   108	
   109	<!-- /ANCHOR:overview -->
   110	
   111	---
   112	
   113	<!-- ANCHOR:quick-start -->
   114	## 2. QUICK START
   115	
   116	This section covers the minimum steps to get running. For full installation with embedding providers, database migration and environment setup, see [INSTALL_GUIDE.md](./INSTALL_GUIDE.md).
   117	
   118	### 30-Second Setup
   119	
   120	```bash
   121	# 1. Install dependencies (from the mcp_server directory)
   122	cd .opencode/skill/system-spec-kit/mcp_server
   123	npm ci
   124	
   125	# 2. Build the TypeScript source
   126	npm run build
   127	
   128	# 3. Verify the server starts
   129	node dist/context-server.js --help
   130	```
   131	
   132	### Add to Your MCP Configuration
   133	
   134	Use the configuration shape that matches your client.
   135	
   136	**OpenCode (`opencode.json`)**
   137	
   138	```json
   139	{
   140	  "mcp": {
   141	    "spec_kit_memory": {
   142	      "type": "local",
   143	      "command": [
   144	        "node",
   145	        ".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"
   146	      ],
   147	      "environment": {
   148	        "EMBEDDINGS_PROVIDER": "auto",
   149	        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite"
   150	      }
   151	    }
   152	  }
   153	}
   154	```
   155	
   156	**Generic `mcpServers` clients (for example Claude Desktop)**
   157	
   158	```json
   159	{
   160	  "mcpServers": {
   161	    "spec-kit-memory": {
   162	      "command": "node",
   163	      "args": ["/absolute/path/to/.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
   164	      "env": {
   165	        "VOYAGE_API_KEY": "your-key-here"
   166	      }
   167	    }
   168	  }
   169	}
   170	```
   171	
   172	### Verify It Works
   173	
   174	After connecting your MCP client, call the health check:
   175	
   176	```json
   177	{
   178	  "tool": "memory_health",
   179	  "arguments": { "reportMode": "full" }
   180	}
   181	```
   182	
   183	You should get a JSON response with `status: "ok"` and database table counts.
   184	
   185	### Save Your First Memory
   186	
   187	```json
   188	{
   189	  "tool": "memory_save",
   190	  "arguments": {
   191	    "filePath": "/absolute/path/to/your/memory-file.md"
   192	  }
   193	}
   194	```
   195	
   196	### Run Your First Search
   197	
   198	```json
   199	{
   200	  "tool": "memory_context",
   201	  "arguments": {
   202	    "input": "how did we decide on the auth architecture?",
   203	    "mode": "auto"
   204	  }
   205	}
   206	```
   207	
   208	The system reads your question, figures out you are looking for a past decision and routes to the right search strategy automatically.
   209	
   210	<!-- /ANCHOR:quick-start -->
   211	
   212	---
   213	
   214	<!-- ANCHOR:features -->
   215	## 3. FEATURES
   216	
   217	### 3.1 HOW THE MEMORY SYSTEM WORKS
   218	
   219	This section explains the main ideas behind the memory system in plain language. For the full tool reference with parameters, skip to [3.2 Tool Reference](#32-tool-reference).
   220	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Spec Kit Memory MCP Server: Installation Guide
     2	
     3	> MCP Server v1.7.2 | 2026-03-15
     4	
     5	Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
     6	
     7	> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
     8	
     9	---
    10	
    11	## 1. AI-FIRST INSTALL GUIDE
    12	
    13	Copy and paste this prompt to your AI assistant to get installation help:
    14	
    15	```
    16	I want to install Spec Kit Memory MCP server from .opencode/skill/system-spec-kit/mcp_server
    17	
    18	Please help me:
    19	1. Verify I have Node.js >=18 and npm installed
    20	2. Install dependencies and build the MCP server
    21	3. Configure for my environment (I'm using: [OpenCode / Claude Code / Codex / Gemini / Copilot / Claude Desktop])
    22	4. Verify the installation with a test search query
    23	5. Handle any native module rebuild issues if they occur
    24	
    25	My project is located at: [your project path]
    26	
    27	Guide me through each step with the exact commands I need to run.
    28	```
    29	
    30	Your AI assistant will:
    31	- Verify Node.js and npm are available
    32	- Install Spec Kit Memory dependencies
    33	- Build the MCP server via `npm run build`
    34	- Configure the MCP server for your AI platform
    35	- Test semantic search with a sample query
    36	- Troubleshoot native module issues if needed
    37	
    38	**Expected setup time:** 3-5 minutes (clean install), 2-5 minutes (recovery)
    39	
    40	---
    41	
    42	## TABLE OF CONTENTS
    43	
    44	1. [AI-FIRST INSTALL GUIDE](#1-ai-first-install-guide)
    45	2. [OVERVIEW](#2-overview)
    46	3. [PREREQUISITES](#3-prerequisites)
    47	4. [INSTALLATION](#4-installation)
    48	5. [CONFIGURATION](#5-configuration)
    49	6. [VERIFICATION](#6-verification)
    50	7. [USAGE](#7-usage)
    51	8. [FEATURES](#8-features)
    52	9. [EXAMPLES](#9-examples)
    53	10. [TROUBLESHOOTING](#10-troubleshooting)
    54	11. [RESOURCES](#11-resources)
    55	
    56	---
    57	
    58	## 2. OVERVIEW
    59	
    60	Spec Kit Memory is an MCP (Model Context Protocol) server that gives AI assistants semantic memory and context retrieval. It indexes markdown documentation and conversation memories to surface relevant information during AI interactions.
    61	
    62	### Core Principle
    63	
    64	> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.
    65	
    66	### Architecture
    67	
    68	```
    69	┌─────────────────────────────────────────────────────────────────┐
    70	│        AI Clients (OpenCode, Claude Code, Codex, Gemini, Copilot) │
    71	└─────────────────────────────────┬───────────────────────────────┘
    72	                                  │ MCP stdio
    73	                                  ▼
    74	┌─────────────────────────────────────────────────────────────────┐
    75	│              Spec Kit Memory MCP Server (Node.js)               │
    76	│                                                                 │
    77	│  Context indexing    Semantic search    Trigger matching        │
    78	│  Causal lineage      Adaptive fusion    Extended telemetry      │
    79	│                                                                 │
    80	│  SQLite + sqlite-vec for vector storage                         │
    81	│  Canonical DBs:                                                 │
    82	│    mcp_server/database/context-index.sqlite (memory)            │
    83	│    mcp_server/database/code-graph.sqlite   (structural graph)   │
    84	└────────────────────┬────────────────────────────────────────────┘
    85	                     │
    86	          ┌──────────┼──────────┐
    87	          ▼          ▼          ▼
    88	┌──────────────┐ ┌──────────────────┐ ┌────────────────────────────┐
    89	│ Markdown     │ │ Causal Graph     │ │ Code Graph (structural)    │
    90	│ Docs         │ │ (memory lineage) │ │ code-graph.sqlite          │
    91	│ specs/**     │ │ Decision-chain   │ │ Tree-sitter AST indexing   │
    92	│ memory       │ │ relationships    │ │ Graph-first routing        │
    93	│ Constitutional│ │ Graph-aware     │ │ Callers, imports, hierarchy│
    94	│ Spec docs    │ │ reranking       │ │ web-tree-sitter (WASM)     │
    95	└──────────────┘ └──────────────────┘ └────────────────────────────┘
    96	```
    97	
    98	### What This Guide Covers
    99	
   100	This guide addresses the full installation lifecycle and common failures after major updates:
   101	
   102	- `Error: Cannot find module ...`
   103	- `Cannot find module '@spec-kit/shared/...'`
   104	- `ERR_DLOPEN_FAILED` or `NODE_MODULE_VERSION` mismatch
   105	- sqlite extension load issues (`sqlite-vec unavailable`)
   106	- Server starts but search returns empty or stale results
   107	
   108	### Current Runtime Paths (Canonical)
   109	
   110	| Path | Purpose |
   111	|---|---|
   112	| `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` | MCP entry script |
   113	| `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Default repo-local memory database used by the checked-in configs |
   114	| `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` | Default repo-local structural code-graph database used by the checked-in configs |
   115	
   116	The checked-in repo configs currently default to `mcp_server/database/`. Override `MEMORY_DB_PATH` or `SPEC_KIT_DB_DIR` only when you intentionally want the server to use a different writable database location.
   117	
   118	The Code Graph system uses a separate database stored alongside the memory index:
   119	
   120	- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
   121	- Tables: `code_files` (indexed source files), `code_nodes` (symbols), `code_edges` (relationships)
   122	- Edge types: `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`
   123	
   124	Current code-graph behavior is intentionally bounded:
   125	- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
   126	- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
   127	- empty or broadly stale graphs still require explicit `code_graph_scan`
   128	
   129	### Runtime Coverage Note (2026-04-04)
   130	
   131	The repo contains checked-in MCP wiring for OpenCode, Claude Code, Codex, Gemini, and VS Code / Copilot, but startup-context surfacing is not identical across those runtimes:
   132	
   133	| Runtime | Checked-in MCP config | Startup / recovery surface currently visible in repo |
   134	|---|---|---|
   135	| OpenCode | `opencode.json` | MCP wiring is checked in. A plugin-based startup digest implementation exists under `.opencode/plugins/`, but repo registration of that plugin is runtime-dependent and not shown in `opencode.json`. |
   136	| Claude Code | `.claude/mcp.json` | Checked-in SessionStart / PreCompact / Stop hooks in `.claude/settings.local.json`. |
   137	| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
   138	| Gemini | `.gemini/settings.json` | Checked-in MCP config plus SessionStart / PreCompress / BeforeAgent / SessionEnd hook wiring. |
   139	| Copilot | `.vscode/mcp.json` | Checked-in MCP wrapper config. Startup banner code and wrapper scripts exist, but tracked `.github/hooks/superset-notify.json` still points at the Superset hook path, so local startup-hook behavior must be verified per environment. |
   140	
   141	`Claude Desktop` remains documented here as a generic MCP configuration example, but it is outside the repo-checked runtime set above. Treat this table as repository configuration evidence, not as a blanket claim of live startup parity in every client.
   142	
   143	---
   144	
   145	## 3. PREREQUISITES
   146	
   147	Phase 1 verifies the required software on your machine.
   148	
   149	### Required Software
   150	
   151	1. **Node.js** (version 18 or higher)
   152	   ```bash
   153	   node --version
   154	   # Must show v18.0.0 or higher
   155	   ```
   156	
   157	2. **npm** (bundled with Node.js)
   158	   ```bash
   159	   npm --version
   160	   # Must show a version number
   161	   ```
   162	
   163	3. **MCP client**: OpenCode, Claude Code, Codex CLI, Gemini CLI, or Copilot MCP/VS Code integration
   164	
   165	`Claude Desktop` is also shown below as a generic MCP configuration example.
   166	
   167	No additional system dependencies are required beyond Node.js and npm. The Code Graph structural indexer uses `web-tree-sitter` (WASM-based tree-sitter) which is bundled as an npm dependency and does not require a native tree-sitter installation.
   168	
   169	### Validation: `phase_1_complete`
   170	
   171	```bash
   172	node --version    # v18.0.0 or higher
   173	npm --version     # 9.0.0 or higher
   174	```
   175	
   176	Checklist:
   177	- [ ] `node --version` returns v18 or higher
   178	- [ ] `npm --version` returns a version number
   179	
   180	❌ **STOP if validation fails.** Install Node.js from https://nodejs.org/ before continuing.
   181	
   182	---
   183	
   184	## 4. INSTALLATION
   185	
   186	This section covers Phase 2 (install) and Phase 3 (initialize).
   187	
   188	### Step 1: Navigate to the Skill Directory
   189	
   190	```bash
   191	cd .opencode/skill/system-spec-kit
   192	```
   193	
   194	### Step 2: Install Dependencies
   195	
   196	```bash
   197	npm install
   198	```
   199	
   200	This installs:
   201	- `better-sqlite3` (SQLite with native bindings)
   202	- `sqlite-vec` (vector extension for semantic search)
   203	- `web-tree-sitter` (WASM-based tree-sitter bindings, no native compilation)
   204	- `tree-sitter-wasms` (pre-compiled WASM grammar bundles for JS, TS, Python, Bash)
   205	- `@huggingface/transformers` (local embedding model)
   206	- `@modelcontextprotocol/sdk` (MCP protocol implementation)
   207	- `chokidar` (file watching for auto-indexing)
   208	- `onnxruntime-common` (ONNX model runtime)
   209	- `zod` (schema validation)
   210	
   211	Platform-specific optional packages installed automatically when the platform matches:
   212	- `sqlite-vec-darwin-arm64` (Apple Silicon vector extension, optional)
   213	
   214	### Step 3: Build the MCP Server
   215	
   216	```bash
   217	npm run build
   218	```
   219	
   220	If workspace type errors occur and you only need a runtime build, use:

codex
I’ve finished the source pass. The strongest new signal is that Mex’s “tool surface” is much thinner and more brittle than its README positioning suggests: it’s basically a Commander CLI plus copied instruction shims, and even that surface already has command drift. I’m packaging the findings now in the required iteration format with exact file evidence and direct comparison points to Spec Kit Memory.
Completed the memory pass, traced Mex’s CLI/setup/sync/watch/profile surfaces, and compared them with Spec Kit Memory’s MCP registry, public API barrel, install/runtime configs, and maintenance CLI.
  ✓ Quick memory pass for prior Mex and Spec Kit Memory context relevant to tool surfaces
  ✓ Inspect external Mex source for CLI, command routing, checker registration, sync surface, and profile separation
  ✓ Inspect Spec Kit Memory tool/API surface for comparison points
  ✓ Synthesize iteration-3 findings in required format with exact source references and constraints
codex
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings

### Finding 1: Mex exposes a CLI contract, not a tool protocol
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json#L2), [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L6), [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json#L1)
- **What it does**: Mex publishes a single `mex` binary from `dist/cli.js`, then hangs all user-facing behavior off Commander subcommands (`setup`, `check`, `init`, `sync`, `pattern add`, `watch`, `commands`). Its OpenCode config only points the agent at `.mex/AGENTS.md`; there is no MCP server, no JSON-schema tool registry, and no callable API endpoint layer in the external repo.
- **Why it matters for us**: This is a hard surface mismatch with Spec Kit Memory, where retrieval and maintenance are designed to be called as tools. Mex can complement our markdown surfaces, but it cannot replace `memory_search`, `memory_context`, `memory_match_triggers`, or the code-graph/CocoIndex bridge.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mex’s “profile separation” is instruction-file distribution, not capability separation
- **Source**: [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md#L1), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L42), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L1)
- **What it does**: Setup copies one of six wrapper files into tool-specific locations: `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.opencode/opencode.json`, or root `AGENTS.md` for Codex. They all route back to the same scaffold anchor rather than defining different runtime behaviors.
- **Why it matters for us**: Mex’s multi-tool story is really “same scaffold, different wrapper.” That is useful for distributing markdown instructions, but it does not solve transport, schema, permission, or startup differences. Public already needs real runtime separation, not just copied prompt files.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Mex’s repair loop is single-provider and interactive by construction
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L18), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L229)
- **What it does**: `mex sync` runs drift detection, groups issues by file, builds a combined brief, then either prints prompts or launches `claude` interactively with inherited stdio. `mex setup` has the same bias: if Claude CLI is available, it spawns Claude to populate the scaffold.
- **Why it matters for us**: The good idea here is the targeted brief, not the execution surface. As written, Mex’s “fix” path is not MCP-callable, not provider-neutral, and not automation-safe for the multi-runtime environment Public already supports.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Mex’s own command surface already drifts in code
- **Source**: [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L8), [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json#L2), [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L159), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L454)
- **What it does**: The post-commit hook fallback runs `npx mex check --quiet`, but the published package is `promexeus`, the CLI help says to replace `mex` with `npx promexeus`, and setup prints `npx promexeus` as the non-global path. So one part of the shipped surface points at a different invocation contract than the rest.
- **Why it matters for us**: This is exactly the class of surface drift we care about. It means Mex’s tool layer is already fragile before we even consider importing it, and it strengthens the case for static command-surface validation rather than trusting prose or one-off hooks.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mex’s registration model is small, explicit, and worth borrowing for a docs-drift subsystem
- **Source**: [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L13), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L45), [external/src/reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16)
- **What it does**: Mex keeps the surface compact and explicit: one CLI entrypoint, one drift runner, one issue model, and three output modes. The checker pipeline is just a direct composition list in `runDriftCheck()`, not a hidden plugin system.
- **Why it matters for us**: This is the reusable part. A Mex-like, source-of-truth validator for Public’s documentation and config surfaces would be cheap to reason about, cheap to test, and separate from the much heavier memory/retrieval stack.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Public already has the large, layered surface that most needs Mex-style static drift checks
- **Source**: [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L878), [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L851), [mcp_server/api/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L11), [mcp_server/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts#L102), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L55), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md#L5), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md#L131)
- **What it does**: Spec Kit Memory has a canonical 47-tool MCP registry, live `ListTools`/`CallTool` dispatch, a separate public API barrel for scripts, a separate maintenance CLI, and explicit runtime/client configuration guidance. But the surface is already drifting in docs: README says 47 tools while INSTALL_GUIDE still says 43.
- **Why it matters for us**: This is the cleanest “adopt now” target from Mex. We do not need Mex’s storage model, but we do need Mex-like static checks over tool counts, named tool lists, command examples, and runtime config snippets so docs stop drifting from `tool-schemas.ts` and `context-server.ts`.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts)
- [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts)
- [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts)
- [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md)
- [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [mcp_server/api/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts)
- [mcp_server/api/search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts)
- [mcp_server/api/indexing.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts)
- [mcp_server/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md)
- [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md)

## Assessment
- New information ratio: 0.86
- Questions addressed: Mex CLI topology, MCP presence/absence, command registration, repair execution surface, profile separation model, Spec Kit Memory registry layering, runtime/client separation, tool-surface drift risk
- Questions answered: Mex is CLI-only and wrapper-driven rather than tool-protocol-driven; Mex sync is Claude-bound; Spec Kit Memory already has a much richer MCP/API/CLI/runtime split; the most valuable Mex import is a small static validator for our documented tool/config surfaces

## Reflection
- What worked: comparing `package.json` + `cli.ts` + `watch.ts` + `setup/index.ts` exposed the real Mex surface quickly, and contrasting that with `tool-schemas.ts` + `context-server.ts` + `api/index.ts` made the complement-vs-replace boundary much sharper than README-level comparison
- What did not work: CocoIndex MCP search was unavailable in this pass, so I fell back to direct source tracing; the read-only sandbox also blocks here-doc temp files, which limited a few convenience commands but did not block the analysis

## Recommended Next Focus
Design the smallest Mex-style static surface checker for Public: validate tool counts, tool names, command examples, and runtime config snippets across [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md), and the checked-in client config files first. That is the highest-confidence “adopt now” slice from Mex for this repo.


hook: Stop
hook: Stop Completed
tokens used
186,767
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings

### Finding 1: Mex exposes a CLI contract, not a tool protocol
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json#L2), [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L6), [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json#L1)
- **What it does**: Mex publishes a single `mex` binary from `dist/cli.js`, then hangs all user-facing behavior off Commander subcommands (`setup`, `check`, `init`, `sync`, `pattern add`, `watch`, `commands`). Its OpenCode config only points the agent at `.mex/AGENTS.md`; there is no MCP server, no JSON-schema tool registry, and no callable API endpoint layer in the external repo.
- **Why it matters for us**: This is a hard surface mismatch with Spec Kit Memory, where retrieval and maintenance are designed to be called as tools. Mex can complement our markdown surfaces, but it cannot replace `memory_search`, `memory_context`, `memory_match_triggers`, or the code-graph/CocoIndex bridge.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mex’s “profile separation” is instruction-file distribution, not capability separation
- **Source**: [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md#L1), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L42), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L1)
- **What it does**: Setup copies one of six wrapper files into tool-specific locations: `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.opencode/opencode.json`, or root `AGENTS.md` for Codex. They all route back to the same scaffold anchor rather than defining different runtime behaviors.
- **Why it matters for us**: Mex’s multi-tool story is really “same scaffold, different wrapper.” That is useful for distributing markdown instructions, but it does not solve transport, schema, permission, or startup differences. Public already needs real runtime separation, not just copied prompt files.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Mex’s repair loop is single-provider and interactive by construction
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L18), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L229)
- **What it does**: `mex sync` runs drift detection, groups issues by file, builds a combined brief, then either prints prompts or launches `claude` interactively with inherited stdio. `mex setup` has the same bias: if Claude CLI is available, it spawns Claude to populate the scaffold.
- **Why it matters for us**: The good idea here is the targeted brief, not the execution surface. As written, Mex’s “fix” path is not MCP-callable, not provider-neutral, and not automation-safe for the multi-runtime environment Public already supports.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Mex’s own command surface already drifts in code
- **Source**: [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L8), [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json#L2), [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L159), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L454)
- **What it does**: The post-commit hook fallback runs `npx mex check --quiet`, but the published package is `promexeus`, the CLI help says to replace `mex` with `npx promexeus`, and setup prints `npx promexeus` as the non-global path. So one part of the shipped surface points at a different invocation contract than the rest.
- **Why it matters for us**: This is exactly the class of surface drift we care about. It means Mex’s tool layer is already fragile before we even consider importing it, and it strengthens the case for static command-surface validation rather than trusting prose or one-off hooks.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mex’s registration model is small, explicit, and worth borrowing for a docs-drift subsystem
- **Source**: [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L13), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L45), [external/src/reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16)
- **What it does**: Mex keeps the surface compact and explicit: one CLI entrypoint, one drift runner, one issue model, and three output modes. The checker pipeline is just a direct composition list in `runDriftCheck()`, not a hidden plugin system.
- **Why it matters for us**: This is the reusable part. A Mex-like, source-of-truth validator for Public’s documentation and config surfaces would be cheap to reason about, cheap to test, and separate from the much heavier memory/retrieval stack.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Public already has the large, layered surface that most needs Mex-style static drift checks
- **Source**: [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L878), [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L851), [mcp_server/api/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts#L11), [mcp_server/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts#L102), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L55), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md#L5), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md#L131)
- **What it does**: Spec Kit Memory has a canonical 47-tool MCP registry, live `ListTools`/`CallTool` dispatch, a separate public API barrel for scripts, a separate maintenance CLI, and explicit runtime/client configuration guidance. But the surface is already drifting in docs: README says 47 tools while INSTALL_GUIDE still says 43.
- **Why it matters for us**: This is the cleanest “adopt now” target from Mex. We do not need Mex’s storage model, but we do need Mex-like static checks over tool counts, named tool lists, command examples, and runtime config snippets so docs stop drifting from `tool-schemas.ts` and `context-server.ts`.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts)
- [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts)
- [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts)
- [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md)
- [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [mcp_server/api/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts)
- [mcp_server/api/search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts)
- [mcp_server/api/indexing.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts)
- [mcp_server/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md)
- [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md)

## Assessment
- New information ratio: 0.86
- Questions addressed: Mex CLI topology, MCP presence/absence, command registration, repair execution surface, profile separation model, Spec Kit Memory registry layering, runtime/client separation, tool-surface drift risk
- Questions answered: Mex is CLI-only and wrapper-driven rather than tool-protocol-driven; Mex sync is Claude-bound; Spec Kit Memory already has a much richer MCP/API/CLI/runtime split; the most valuable Mex import is a small static validator for our documented tool/config surfaces

## Reflection
- What worked: comparing `package.json` + `cli.ts` + `watch.ts` + `setup/index.ts` exposed the real Mex surface quickly, and contrasting that with `tool-schemas.ts` + `context-server.ts` + `api/index.ts` made the complement-vs-replace boundary much sharper than README-level comparison
- What did not work: CocoIndex MCP search was unavailable in this pass, so I fell back to direct source tracing; the read-only sandbox also blocks here-doc temp files, which limited a few convenience commands but did not block the analysis

## Recommended Next Focus
Design the smallest Mex-style static surface checker for Public: validate tool counts, tool names, command examples, and runtime config snippets across [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md), [mcp_server/INSTALL_GUIDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md), and the checked-in client config files first. That is the highest-confidence “adopt now” slice from Mex for this repo.
