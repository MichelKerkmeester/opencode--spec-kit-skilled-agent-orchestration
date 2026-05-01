### Finding 5: We should add reverse coverage audits that detect live repo knowledge missing from memory/spec surfaces
- **Source**: [external/src/drift/checkers/script-coverage.ts:26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [external/src/drift/checkers/command.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [external/src/drift/checkers/dependency.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [post-save-review.ts:807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [validate-memory-quality.ts:873](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L873), [memory-crud-health.ts:382](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L382)
- **What it does**: Mex checks the opposite direction from most doc lint: not just “does the scaffold claim something false,” but also “does the live repo expose scripts/commands/dependencies that the scaffold never mentions.” Our current quality checks are strong on saved-memory metadata, trigger drift, alias divergence, and DB integrity, but not on repo-to-knowledge coverage.
- **Why it matters for us**: This would catch silent knowledge debt: new operational commands, dependencies, or repo affordances that exist in reality but never become retrievable memory or documentation. That gap is operationally expensive because nothing looks broken until someone needs the missing knowledge.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts)
- [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts)
- [external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts)
- [external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts)
- [external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/patterns/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [startup-brief.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.84
- Questions addressed: which Mex capabilities are genuinely absent from Spec Kit Memory, whether Mex adds operator workflows beyond drift linting, whether we lack a durable router/state layer, whether we lack reusable task-pattern artifacts, whether we lack a cold-start repo brief, whether we lack reality-to-knowledge coverage audits.
- Questions answered: the main missed opportunities are not new retrieval channels but new operator products around retrieval: repair packets, a project router/current-state board, a reusable task-pattern registry, a repo bootstrap brief generator, and reverse coverage audits for commands/dependencies/scripts.

## Reflection
- What worked: tracing Mex from `sync` and `scanner` inward, then mapping each operator-facing loop against our `memory_health`, startup, and save-path surfaces, made the missing-feature set much clearer than checker-by-checker parity alone.
- What did not work: the semantic code-search pass did not complete, so the absence claims had to be verified manually through direct source reads; I also did not broaden into non-memory Spec Kit validators because this iteration was specifically about the external memory system comparison.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne specifically for two things: whether either system has an equivalent to Mex’s reusable task-pattern layer, and whether either one already turns drift/health findings into operator-facing repair packets. If neither does, these five features are likely original follow-on product directions for Spec Kit Memory.

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
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

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
I’m treating this as a read-only deep research pass over the Mex source, with the goal of finding where our current memory stack should be refactored or redirected rather than just extended. I’ll first do a quick memory pass for prior Mex-specific context, then trace the external implementation and map it against our current handlers and validators.
exec
/bin/zsh -lc 'rg -n "mex|hybrid-rag-fusion|drift detection|script-coverage|repair packet|router" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "find .. -name AGENTS.md -o -name CLAUDE.md | sed 's#"'^#/#'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
946:- ~/.codex/prompts, readlink ~/.codex/prompts, .codex/prompts, spec_kit-plan.md, memory-save.md, create-component.md, agent_router.md, .opencode/command
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

 succeeded in 0ms:
/../external/.tool-configs/CLAUDE.md
/../external/templates/.tool-configs/CLAUDE.md
/../external/templates/AGENTS.md
/../external/AGENTS.md
/../external/CLAUDE.md

codex
The memory pass didn’t surface prior Mex findings beyond packet context, so I’m treating this mostly as fresh source analysis. Next I’m reading the governing docs inside `external/` and the Mex source entrypoints so the refactor recommendations stay tied to the actual implementation rather than README summaries.
exec
/bin/zsh -lc "sed -n '1,220p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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

exec
/bin/zsh -lc "sed -n '1,260p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
exec
/bin/zsh -lc "pwd && printf '\\n== external root ==\\n' && ls -la . && printf '\\n== mex-main ==\\n' && ls -la mex-main" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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
     Length: 3-7 items maximum. More than 7 means the list has not been prioritised.
     Example:
     - Never write database queries outside of the repository layer
     - Never commit secrets or API keys
     - Always handle errors explicitly — no silent failures -->

## Commands
<!-- The exact commands needed to work on this project.
     Include: run dev server, run tests, run linter, build.
     Use the actual commands from this codebase — not placeholders.
     Example:
     - Dev: `npm run dev`
     - Test: `npm test`
     - Lint: `npm run lint`
     - Build: `npm run build` -->

## After Every Task
After completing any task: update `.mex/ROUTER.md` project state and any `.mex/` files that are now out of date. If no pattern existed for the task you just completed, create one in `.mex/patterns/`.

## Navigation
At the start of every session, read `.mex/ROUTER.md` before doing anything else.
For full project context, patterns, and task guidance — everything is there.

 exited 1 in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external

== external root ==
total 600
drwxr-xr-x  31 michelkerkmeester  staff     992 Apr 10 21:19 .
drwxr-xr-x   6 michelkerkmeester  staff     192 Apr 10 21:18 ..
drwxr-xr-x   5 michelkerkmeester  staff     160 Apr 10 21:18 .github
-rw-r--r--   1 michelkerkmeester  staff      69 Apr 10 21:18 .gitignore
drwxr-xr-x   8 michelkerkmeester  staff     256 Apr 10 21:18 .tool-configs
-rw-r--r--   1 michelkerkmeester  staff    1899 Apr 10 21:18 AGENTS.md
-rw-r--r--   1 michelkerkmeester  staff    2103 Apr 10 21:18 CHANGELOG.md
-rw-r--r--   1 michelkerkmeester  staff    1647 Apr 10 21:18 CLAUDE.md
-rw-r--r--   1 michelkerkmeester  staff    5226 Apr 10 21:18 CODE_OF_CONDUCT.md
-rw-r--r--   1 michelkerkmeester  staff    1501 Apr 10 21:18 CONTRIBUTING.md
-rw-r--r--   1 michelkerkmeester  staff    1069 Apr 10 21:18 LICENSE
-rw-r--r--   1 michelkerkmeester  staff    9456 Apr 10 21:18 README.md
-rw-r--r--   1 michelkerkmeester  staff    3763 Apr 10 21:18 ROUTER.md
-rw-r--r--   1 michelkerkmeester  staff    1019 Apr 10 21:18 SECURITY.md
-rw-r--r--   1 michelkerkmeester  staff    9360 Apr 10 21:18 SETUP.md
-rw-r--r--   1 michelkerkmeester  staff    2383 Apr 10 21:18 SYNC.md
drwxr-xr-x   7 michelkerkmeester  staff     224 Apr 10 21:18 context
drwxr-xr-x   3 michelkerkmeester  staff      96 Apr 10 21:18 mascot
-rw-r--r--   1 michelkerkmeester  staff  109374 Apr 10 21:18 package-lock.json
-rw-r--r--   1 michelkerkmeester  staff    1255 Apr 10 21:18 package.json
drwxr-xr-x   4 michelkerkmeester  staff     128 Apr 10 21:18 patterns
drwxr-xr-x   5 michelkerkmeester  staff     160 Apr 10 21:18 screenshots
-rwxr-xr-x   1 michelkerkmeester  staff   24704 Apr 10 21:18 setup.sh
drwxr-xr-x  14 michelkerkmeester  staff     448 Apr 10 21:18 src
-rwxr-xr-x   1 michelkerkmeester  staff   12362 Apr 10 21:18 sync.sh
drwxr-xr-x   9 michelkerkmeester  staff     288 Apr 10 21:18 templates
drwxr-xr-x   9 michelkerkmeester  staff     288 Apr 10 21:18 test
-rw-r--r--   1 michelkerkmeester  staff     418 Apr 10 21:18 tsconfig.json
-rw-r--r--   1 michelkerkmeester  staff     270 Apr 10 21:18 tsup.config.ts
-rwxr-xr-x   1 michelkerkmeester  staff    9030 Apr 10 21:18 update.sh
-rwxr-xr-x   1 michelkerkmeester  staff   56464 Apr 10 21:18 visualize.sh

== mex-main ==
ls: mex-main: No such file or directory

codex
I found one structural discrepancy early: the repo snapshot is rooted directly at `external/`, not `external/mex-main/`. I’m continuing against the actual paths on disk and will call out any places where the prompt’s path assumptions differ from the checked-in source.
exec
/bin/zsh -lc "sed -n '1,260p' ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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
/bin/zsh -lc "sed -n '1,260p' README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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

| Tool | Config file |
|------|------------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenCode | `.opencode/opencode.json` |
| Codex (OpenAI) | `AGENTS.md` |

Most config files embed the same instructions directly. OpenCode is the exception — `.opencode/opencode.json` references `.mex/AGENTS.md` instead of embedding content. `mex setup` asks which tool you use and creates the appropriate config.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[MIT](LICENSE)
exec
/bin/zsh -lc "sed -n '1,260p' SETUP.md && printf '\\n---SYNC---\\n' && sed -n '1,260p' SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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

## Keeping It Fresh

Once the scaffold is populated, use these to keep it aligned with your codebase:

- **`mex check`** — detect drift (zero tokens, zero AI)
- **`.mex/sync.sh`** — interactive drift check + targeted or full resync
- **`mex watch`** — auto drift score after every commit

---SYNC---
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
The semantic search path wasn’t available here, so I’m staying with direct source tracing. I’m now reading the CLI and drift engine modules together so I can distinguish “new feature opportunity” from “we should actually restructure something we already have.”
exec
/bin/zsh -lc "sed -n '1,260p' src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
exec
/bin/zsh -lc 'find src -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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
src/cli.ts
src/config.ts
src/drift/checkers/command.ts
src/drift/checkers/cross-file.ts
src/drift/checkers/dependency.ts
src/drift/checkers/edges.ts
src/drift/checkers/index-sync.ts
src/drift/checkers/path.ts
src/drift/checkers/script-coverage.ts
src/drift/checkers/staleness.ts
src/drift/claims.ts
src/drift/frontmatter.ts
src/drift/index.ts
src/drift/scoring.ts
src/git.ts
src/markdown.ts
src/pattern/index.ts
src/reporter.ts
src/scanner/entry-points.ts
src/scanner/folder-tree.ts
src/scanner/index.ts
src/scanner/manifest.ts
src/scanner/readme.ts
src/scanner/tooling.ts
src/setup/index.ts
src/setup/prompts.ts
src/sync/brief-builder.ts
src/sync/index.ts
src/types.ts
src/watch.ts

exec
/bin/zsh -lc 'for f in src/drift/index.ts src/drift/claims.ts src/drift/frontmatter.ts src/drift/scoring.ts; do echo "--- $f ---"; sed -n '"'1,260p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
 succeeded in 0ms:
--- src/drift/index.ts ---
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

--- src/drift/claims.ts ---
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

--- src/drift/frontmatter.ts ---
import { readFileSync } from "node:fs";
import { extractFrontmatter } from "../markdown.js";
import type { ScaffoldFrontmatter } from "../types.js";

/** Read a scaffold file and extract its YAML frontmatter */
export function parseFrontmatter(
  filePath: string
): ScaffoldFrontmatter | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return extractFrontmatter(content);
  } catch {
    return null;
  }
}

--- src/drift/scoring.ts ---
import type { DriftIssue, Severity } from "../types.js";

const SEVERITY_COST: Record<Severity, number> = {
  error: 10,
  warning: 3,
  info: 1,
};

/** Compute drift score from 0-100. Starts at 100, deducts per issue. */
export function computeScore(issues: DriftIssue[]): number {
  let score = 100;
  for (const issue of issues) {
    score -= SEVERITY_COST[issue.severity];
  }
  return Math.max(0, Math.min(100, score));
}


exec
/bin/zsh -lc 'for f in src/drift/checkers/command.ts src/drift/checkers/dependency.ts src/drift/checkers/cross-file.ts src/drift/checkers/script-coverage.ts; do echo "--- $f ---"; sed -n '"'1,260p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
exec
/bin/zsh -lc 'for f in src/drift/checkers/path.ts src/drift/checkers/edges.ts src/drift/checkers/index-sync.ts src/drift/checkers/staleness.ts; do echo "--- $f ---"; sed -n '"'1,260p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
 succeeded in 0ms:
--- src/drift/checkers/command.ts ---
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Claim, DriftIssue } from "../../types.js";

/** Check that claimed npm/yarn/make commands actually exist */
export function checkCommands(
  claims: Claim[],
  projectRoot: string
): DriftIssue[] {
  const issues: DriftIssue[] = [];
  const commandClaims = claims.filter(
    (c) => c.kind === "command" && !c.negated
  );

  const pkgScripts = loadPackageScripts(projectRoot);
  const makeTargets = loadMakeTargets(projectRoot);

  for (const claim of commandClaims) {
    const cmd = claim.value.trim();

    // npm run <script> / yarn <script> / pnpm <script>
    const npmMatch = cmd.match(
      /^(?:npm\s+run|yarn|pnpm|bun\s+run)\s+(\S+)/
    );
    if (npmMatch) {
      const script = npmMatch[1];
      if (pkgScripts && !pkgScripts.has(script)) {
        issues.push({
          code: "DEAD_COMMAND",
          severity: "error",
          file: claim.source,
          line: claim.line,
          message: `Script "${script}" not found in package.json scripts`,
          claim,
        });
      }
      continue;
    }

    // make <target>
    const makeMatch = cmd.match(/^make\s+(\S+)/);
    if (makeMatch) {
      const target = makeMatch[1];
      if (makeTargets && !makeTargets.has(target)) {
        issues.push({
          code: "DEAD_COMMAND",
          severity: "error",
          file: claim.source,
          line: claim.line,
          message: `Make target "${target}" not found in Makefile`,
          claim,
        });
      }
    }
  }

  return issues;
}

function loadPackageScripts(
  projectRoot: string
): Set<string> | null {
  const pkgPath = resolve(projectRoot, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return new Set(Object.keys(pkg.scripts ?? {}));
  } catch {
    return null;
  }
}

function loadMakeTargets(projectRoot: string): Set<string> | null {
  const makePath = resolve(projectRoot, "Makefile");
  if (!existsSync(makePath)) return null;
  try {
    const content = readFileSync(makePath, "utf-8");
    const targets = new Set<string>();
    for (const line of content.split("\n")) {
      const match = line.match(/^(\w[\w-]*):/);
      if (match) targets.add(match[1]);
    }
    return targets;
  } catch {
    return null;
  }
}

--- src/drift/checkers/dependency.ts ---
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Claim, DriftIssue } from "../../types.js";

/** Runtimes, platforms, databases, protocols, and architectural terms that appear in stack docs but aren't installable packages */
const KNOWN_RUNTIMES = new Set([
  "node.js", "node", "nodejs",
  "python", "cpython",
  "go", "golang",
  "rust",
  "ruby",
  "java", "jdk", "jre",
  "deno", "bun",
  "swift", "kotlin", "elixir", "erlang", "php",
  ".net", "dotnet", "c#", "csharp",
  "sqlite", "sqlite3",
  "postgresql", "postgres",
  "mysql", "mariadb",
  "mongodb", "mongo",
  "redis",
  "elasticsearch",
  "dynamodb", "cassandra", "neo4j", "supabase", "neon",
  "docker",
  "kubernetes", "k8s",
  "vercel", "netlify", "railway", "fly.io", "render",
  "aws", "gcp", "azure", "cloudflare",
  "s3", "ec2", "lambda", "ecs", "fargate",
  "rest", "rest api", "graphql", "grpc", "websocket", "websockets",
  "oauth", "oauth2", "jwt", "saml", "oidc",
  "http", "https", "tcp", "udp",
  "tailwind", "tailwind css", "tailwindcss",
  "bootstrap", "sass", "less", "postcss",
  "webpack", "vite", "esbuild", "turbopack", "rollup", "parcel",
  "git", "github", "gitlab", "ci/cd", "nginx", "apache", "caddy",
  "linux", "macos", "windows", "wasm", "webassembly",
]);

/** Check that claimed dependencies exist in manifests */
export function checkDependencies(
  claims: Claim[],
  projectRoot: string
): DriftIssue[] {
  const issues: DriftIssue[] = [];
  const deps = loadAllDependencies(projectRoot);
  if (!deps) return issues;

  const depClaims = claims.filter(
    (c) => c.kind === "dependency" && !c.negated
  );
  const versionClaims = claims.filter(
    (c) => c.kind === "version" && !c.negated
  );

  for (const claim of depClaims) {
    const name = claim.value.toLowerCase();

    // Skip known runtimes/platforms — they won't be in package.json
    if (KNOWN_RUNTIMES.has(name)) continue;

    // Fuzzy match: "React" → "react", "Express" → "express"
    const found = deps.find(
      (d) => d.name.toLowerCase() === name
    );
    if (!found) {
      issues.push({
        code: "DEPENDENCY_MISSING",
        severity: "warning",
        file: claim.source,
        line: claim.line,
        message: `Claimed dependency "${claim.value}" not found in any manifest`,
        claim,
      });
    }
  }

  for (const claim of versionClaims) {
    // Parse "React 18" or "Node v20"
    const match = claim.value.match(/^(.+?)\s+v?(\d[\d.]*\S*)$/);
    if (!match) continue;

    const name = match[1].trim().toLowerCase();
    const claimedVersion = match[2];
    const found = deps.find(
      (d) => d.name.toLowerCase() === name
    );

    if (found && !found.version.includes(claimedVersion)) {
      issues.push({
        code: "VERSION_MISMATCH",
        severity: "warning",
        file: claim.source,
        line: claim.line,
        message: `Claimed "${claim.value}" but manifest has version "${found.version}"`,
        claim,
      });
    }
  }

  return issues;
}

interface DepEntry {
  name: string;
  version: string;
}

function loadAllDependencies(projectRoot: string): DepEntry[] | null {
  const entries: DepEntry[] = [];

  // package.json
  const pkgPath = resolve(projectRoot, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
        entries.push({ name, version: String(version) });
      }
      for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
        entries.push({ name, version: String(version) });
      }
    } catch {
      // skip
    }
  }

  return entries.length ? entries : null;
}

--- src/drift/checkers/cross-file.ts ---
import type { Claim, DriftIssue } from "../../types.js";

/** Detect contradictions across scaffold files */
export function checkCrossFile(claims: Claim[]): DriftIssue[] {
  const issues: DriftIssue[] = [];

  // Group version claims by dependency name
  const versionsByDep = new Map<string, Claim[]>();
  for (const claim of claims.filter((c) => c.kind === "version" && !c.negated)) {
    const match = claim.value.match(/^(.+?)\s+v?(\d[\d.]*\S*)$/);
    if (!match) continue;
    const depName = match[1].trim().toLowerCase();
    if (!versionsByDep.has(depName)) versionsByDep.set(depName, []);
    versionsByDep.get(depName)!.push(claim);
  }

  // Check for conflicting versions across different files
  for (const [dep, versionClaims] of versionsByDep) {
    if (versionClaims.length < 2) continue;

    const uniqueVersions = new Set(versionClaims.map((c) => c.value));
    if (uniqueVersions.size > 1) {
      const sources = versionClaims
        .map((c) => `${c.source}:${c.line} says "${c.value}"`)
        .join(", ");
      issues.push({
        code: "CROSS_FILE_CONFLICT",
        severity: "error",
        file: versionClaims[0].source,
        line: versionClaims[0].line,
        message: `Conflicting versions for "${dep}": ${sources}`,
      });
    }
  }

  // Group command claims that reference the same script
  const commandsByScript = new Map<string, Claim[]>();
  for (const claim of claims.filter((c) => c.kind === "command" && !c.negated)) {
    const npmMatch = claim.value.match(
      /^(?:npm\s+run|yarn|pnpm|bun\s+run)\s+(\S+)/
    );
    if (npmMatch) {
      const script = npmMatch[1];
      if (!commandsByScript.has(script)) commandsByScript.set(script, []);
      commandsByScript.get(script)!.push(claim);
    }
  }

  // Check for same script referenced with different package managers
  for (const [script, cmdClaims] of commandsByScript) {
    if (cmdClaims.length < 2) continue;
    const fromDifferentFiles = new Set(cmdClaims.map((c) => c.source)).size > 1;
    if (!fromDifferentFiles) continue;

    const managers = new Set(
      cmdClaims.map((c) => c.value.split(/\s/)[0])
    );
    if (managers.size > 1) {
      issues.push({
        code: "CROSS_FILE_CONFLICT",
        severity: "warning",
        file: cmdClaims[0].source,
        line: cmdClaims[0].line,
        message: `Script "${script}" referenced with different package managers across files: ${[...managers].join(", ")}`,
      });
    }
  }

  return issues;
}

--- src/drift/checkers/script-coverage.ts ---
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { DriftIssue } from "../../types.js";

/** npm lifecycle hooks and internal scripts that don't need documentation */
const IGNORED_SCRIPTS = new Set([
  "preinstall",
  "install",
  "postinstall",
  "preuninstall",
  "uninstall",
  "postuninstall",
  "prepublish",
  "prepublishOnly",
  "publish",
  "postpublish",
  "prepack",
  "pack",
  "postpack",
  "prepare",
  "preshrinkwrap",
  "shrinkwrap",
  "postshrinkwrap",
]);

/** Check that package.json scripts are mentioned somewhere in the scaffold */
export function checkScriptCoverage(
  scaffoldFiles: string[],
  projectRoot: string
): DriftIssue[] {
  const scripts = loadPackageScripts(projectRoot);
  if (!scripts) return [];

  // Collect all scaffold text to search against
  const scaffoldText = scaffoldFiles
    .map((f) => {
      try {
        return readFileSync(f, "utf-8");
      } catch {
        return "";
      }
    })
    .join("\n");

  const issues: DriftIssue[] = [];

  for (const script of scripts) {
    // Skip lifecycle hooks
    if (IGNORED_SCRIPTS.has(script)) continue;

    // Skip pre/post variants of other scripts (e.g. pretest, postbuild)
    if (
      (script.startsWith("pre") && scripts.has(script.slice(3))) ||
      (script.startsWith("post") && scripts.has(script.slice(4)))
    ) {
      continue;
    }

    // Skip colon variants if the base script is documented (e.g. dev:debug when dev exists)
    if (script.includes(":")) {
      const base = script.split(":")[0];
      if (scaffoldText.includes(base)) continue;
    }

    // Check if the script name appears anywhere in scaffold files
    if (!scaffoldText.includes(script)) {
      issues.push({
        code: "UNDOCUMENTED_SCRIPT",
        severity: "warning",
        file: "package.json",
        line: null,
        message: `Script "${script}" exists in package.json but is not mentioned in any scaffold file`,
      });
    }
  }

  return issues;
}

function loadPackageScripts(projectRoot: string): Set<string> | null {
  const pkgPath = resolve(projectRoot, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const scripts = pkg.scripts ?? {};
    return Object.keys(scripts).length ? new Set(Object.keys(scripts)) : null;
  } catch {
    return null;
  }
}


 succeeded in 0ms:
--- src/drift/checkers/path.ts ---
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { globSync } from "glob";
import type { Claim, DriftIssue } from "../../types.js";

const PLACEHOLDER_WORDS = /(?:^|[/_-])(?:new|example|your|sample|my|foo|bar|placeholder|template)(?:[/_.-]|$)/i;

/** Check that all claimed paths exist on disk */
export function checkPaths(
  claims: Claim[],
  projectRoot: string,
  scaffoldRoot: string
): DriftIssue[] {
  const issues: DriftIssue[] = [];
  const pathClaims = claims.filter(
    (c) => c.kind === "path" && !c.negated
  );

  for (const claim of pathClaims) {
    if (pathExists(claim.value, projectRoot, scaffoldRoot)) continue;

    // Downgrade to warning if: from a pattern file or path contains placeholder words.
    // Bare filenames that aren't found even after recursive search are genuinely missing.
    const isPattern = claim.source.includes("patterns/");
    const isPlaceholder = PLACEHOLDER_WORDS.test(claim.value);
    const severity = isPattern || isPlaceholder ? "warning" : "error";

    issues.push({
      code: "MISSING_PATH",
      severity,
      file: claim.source,
      line: claim.line,
      message: `Referenced path does not exist: ${claim.value}`,
      claim,
    });
  }

  return issues;
}

function pathExists(value: string, projectRoot: string, scaffoldRoot: string): boolean {
  // Try project root first (e.g. src/index.ts)
  if (existsSync(resolve(projectRoot, value))) return true;

  // Try scaffold root (e.g. context/architecture.md when scaffold is in .mex/)
  if (scaffoldRoot !== projectRoot) {
    if (existsSync(resolve(scaffoldRoot, value))) return true;
  }

  // If path starts with .mex/, also check without that prefix
  // (handles the case where this repo IS the scaffold, not deployed inside .mex/)
  if (value.startsWith(".mex/")) {
    const withoutPrefix = value.slice(".mex/".length);
    if (existsSync(resolve(projectRoot, withoutPrefix))) return true;
  }

  // Bare filenames: search recursively — the file may exist in a subdirectory
  if (!value.includes("/")) {
    const matches = globSync(`**/${value}`, {
      cwd: projectRoot,
      ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
      maxDepth: 5,
    });
    if (matches.length > 0) return true;
  }

  return false;
}

--- src/drift/checkers/edges.ts ---
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { DriftIssue, ScaffoldFrontmatter } from "../../types.js";

/** Check that all YAML frontmatter edge targets exist */
export function checkEdges(
  frontmatter: ScaffoldFrontmatter | null,
  filePath: string,
  source: string,
  projectRoot: string,
  scaffoldRoot: string
): DriftIssue[] {
  if (!frontmatter?.edges) return [];

  const issues: DriftIssue[] = [];

  for (const edge of frontmatter.edges) {
    if (!edge.target) continue;

    // Try project root, then scaffold root
    const fromProject = resolve(projectRoot, edge.target);
    const fromScaffold = resolve(scaffoldRoot, edge.target);
    if (!existsSync(fromProject) && !existsSync(fromScaffold)) {
      issues.push({
        code: "DEAD_EDGE",
        severity: "error",
        file: source,
        line: null,
        message: `Frontmatter edge target does not exist: ${edge.target}`,
      });
    }
  }

  return issues;
}

--- src/drift/checkers/index-sync.ts ---
import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { globSync } from "glob";
import type { DriftIssue } from "../../types.js";

/** Cross-reference patterns/INDEX.md with actual pattern files */
export function checkIndexSync(projectRoot: string, scaffoldRoot: string): DriftIssue[] {
  // Try scaffold root first (deployed as .mex/), then project root
  let patternsDir = resolve(scaffoldRoot, "patterns");
  if (!existsSync(patternsDir)) {
    patternsDir = resolve(projectRoot, "patterns");
  }
  const indexPath = resolve(patternsDir, "INDEX.md");

  if (!existsSync(indexPath)) return [];
  if (!existsSync(patternsDir)) return [];

  const issues: DriftIssue[] = [];

  // Get actual pattern files (exclude INDEX.md and README.md)
  const patternFiles = globSync("*.md", { cwd: patternsDir, ignore: ["node_modules/**"] })
    .filter((f) => f !== "INDEX.md" && f !== "README.md");

  // Parse INDEX.md for referenced files (strip HTML comments first)
  const rawContent = readFileSync(indexPath, "utf-8");
  const indexContent = rawContent.replace(/<!--[\s\S]*?-->/g, "");
  const referencedFiles = new Set<string>();
  const linkPattern = /\[.*?\]\((.+?\.md(?:#[\w-]+)?)\)/g;
  let match;
  while ((match = linkPattern.exec(indexContent)) !== null) {
    // Strip anchor fragments for file existence checks
    referencedFiles.add(match[1].replace(/#.*$/, ""));
  }

  // Also match bare backtick references
  const backtickPattern = /`([\w-]+\.md)`/g;
  while ((match = backtickPattern.exec(indexContent)) !== null) {
    referencedFiles.add(match[1]);
  }

  // Check: pattern files not in INDEX
  for (const file of patternFiles) {
    if (!referencedFiles.has(file)) {
      issues.push({
        code: "INDEX_MISSING_ENTRY",
        severity: "warning",
        file: "patterns/INDEX.md",
        line: null,
        message: `Pattern file patterns/${file} exists but is not referenced in INDEX.md`,
      });
    }
  }

  // Check: INDEX references that don't exist as files
  for (const ref of referencedFiles) {
    const refPath = resolve(patternsDir, ref);
    if (!existsSync(refPath)) {
      issues.push({
        code: "INDEX_ORPHAN_ENTRY",
        severity: "warning",
        file: "patterns/INDEX.md",
        line: null,
        message: `INDEX.md references ${ref} but the file does not exist`,
      });
    }
  }

  return issues;
}

--- src/drift/checkers/staleness.ts ---
import { daysSinceLastChange, commitsSinceLastChange } from "../../git.js";
import type { DriftIssue } from "../../types.js";

const WARN_DAYS = 30;
const ERROR_DAYS = 90;
const WARN_COMMITS = 50;
const ERROR_COMMITS = 200;

/** Check how stale a scaffold file is based on git history */
export async function checkStaleness(
  filePath: string,
  source: string,
  cwd: string
): Promise<DriftIssue[]> {
  const issues: DriftIssue[] = [];

  const days = await daysSinceLastChange(filePath, cwd);
  const commits = await commitsSinceLastChange(filePath, cwd);

  if (days !== null && days >= ERROR_DAYS) {
    issues.push({
      code: "STALE_FILE",
      severity: "error",
      file: source,
      line: null,
      message: `File hasn't been updated in ${days} days (threshold: ${ERROR_DAYS}d)`,
    });
  } else if (days !== null && days >= WARN_DAYS) {
    issues.push({
      code: "STALE_FILE",
      severity: "warning",
      file: source,
      line: null,
      message: `File hasn't been updated in ${days} days (threshold: ${WARN_DAYS}d)`,
    });
  }

  if (commits !== null && commits >= ERROR_COMMITS) {
    issues.push({
      code: "STALE_FILE",
      severity: "error",
      file: source,
      line: null,
      message: `${commits} commits since file was last updated (threshold: ${ERROR_COMMITS})`,
    });
  } else if (commits !== null && commits >= WARN_COMMITS) {
    issues.push({
      code: "STALE_FILE",
      severity: "warning",
      file: source,
      line: null,
      message: `${commits} commits since file was last updated (threshold: ${WARN_COMMITS})`,
    });
  }

  return issues;
}


exec
/bin/zsh -lc 'for f in src/scanner/index.ts src/scanner/manifest.ts src/scanner/entry-points.ts src/scanner/tooling.ts src/scanner/folder-tree.ts src/scanner/readme.ts src/sync/brief-builder.ts src/sync/index.ts src/pattern/index.ts; do echo "--- $f ---"; sed -n '"'1,260p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
 succeeded in 0ms:
--- src/scanner/index.ts ---
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

--- src/scanner/manifest.ts ---
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { ManifestInfo } from "../types.js";

const MANIFEST_FILES = [
  "package.json",
  "pyproject.toml",
  "go.mod",
  "Cargo.toml",
] as const;

/** Detect and parse the project manifest */
export function scanManifest(projectRoot: string): ManifestInfo | null {
  for (const file of MANIFEST_FILES) {
    const path = resolve(projectRoot, file);
    if (!existsSync(path)) continue;

    switch (file) {
      case "package.json":
        return parsePackageJson(path);
      case "pyproject.toml":
        return parsePyprojectStub(path);
      case "go.mod":
        return parseGoModStub(path);
      case "Cargo.toml":
        return parseCargoStub(path);
    }
  }
  return null;
}

function parsePackageJson(path: string): ManifestInfo | null {
  try {
    const raw = JSON.parse(readFileSync(path, "utf-8"));
    return {
      type: "package.json",
      name: raw.name ?? null,
      version: raw.version ?? null,
      dependencies: raw.dependencies ?? {},
      devDependencies: raw.devDependencies ?? {},
      scripts: raw.scripts ?? {},
    };
  } catch {
    return null;
  }
}

// Stub parsers for other manifests — extend later
function parsePyprojectStub(path: string): ManifestInfo {
  const content = readFileSync(path, "utf-8");
  const nameMatch = content.match(/^name\s*=\s*"(.+)"/m);
  const versionMatch = content.match(/^version\s*=\s*"(.+)"/m);
  return {
    type: "pyproject.toml",
    name: nameMatch?.[1] ?? null,
    version: versionMatch?.[1] ?? null,
    dependencies: {},
    devDependencies: {},
    scripts: {},
  };
}

function parseGoModStub(path: string): ManifestInfo {
  const content = readFileSync(path, "utf-8");
  const moduleMatch = content.match(/^module\s+(.+)/m);
  return {
    type: "go.mod",
    name: moduleMatch?.[1] ?? null,
    version: null,
    dependencies: {},
    devDependencies: {},
    scripts: {},
  };
}

function parseCargoStub(path: string): ManifestInfo {
  const content = readFileSync(path, "utf-8");
  const nameMatch = content.match(/^name\s*=\s*"(.+)"/m);
  const versionMatch = content.match(/^version\s*=\s*"(.+)"/m);
  return {
    type: "Cargo.toml",
    name: nameMatch?.[1] ?? null,
    version: versionMatch?.[1] ?? null,
    dependencies: {},
    devDependencies: {},
    scripts: {},
  };
}

--- src/scanner/entry-points.ts ---
import { globSync } from "glob";
import type { EntryPoint } from "../types.js";

const MAIN_PATTERNS = [
  "src/index.{ts,js,tsx,jsx}",
  "src/main.{ts,js,tsx,jsx}",
  "src/app.{ts,js,tsx,jsx}",
  "app.{py,rb}",
  "main.{go,py,rs}",
  "index.{ts,js}",
  "server.{ts,js,py}",
  "src/cli.{ts,js}",
  "cmd/*/main.go",
];

const TEST_PATTERNS = [
  "src/**/*.test.{ts,js,tsx,jsx}",
  "src/**/*.spec.{ts,js,tsx,jsx}",
  "tests/**/*.{ts,js,py}",
  "test/**/*.{ts,js,py}",
  "**/*_test.go",
];

const CONFIG_PATTERNS = [
  "tsconfig.json",
  "vite.config.{ts,js}",
  "next.config.{ts,js,mjs}",
  "webpack.config.{ts,js}",
  "jest.config.{ts,js}",
  "vitest.config.{ts,js}",
  ".eslintrc.{js,json,yml}",
  "eslint.config.{js,mjs}",
];

/** Find main entry points, test files, and config files */
export function scanEntryPoints(projectRoot: string): EntryPoint[] {
  const entries: EntryPoint[] = [];
  const seen = new Set<string>();

  const add = (patterns: string[], type: EntryPoint["type"], limit?: number) => {
    let count = 0;
    for (const pattern of patterns) {
      const matches = globSync(pattern, {
        cwd: projectRoot,
        ignore: ["node_modules/**", "dist/**", "build/**", ".git/**"],
      });
      for (const path of matches) {
        if (seen.has(path)) continue;
        seen.add(path);
        entries.push({ path, type });
        count++;
        if (limit && count >= limit) return;
      }
    }
  };

  add(MAIN_PATTERNS, "main");
  add(TEST_PATTERNS, "test", 10); // Cap test files
  add(CONFIG_PATTERNS, "config");

  return entries;
}

--- src/scanner/tooling.ts ---
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { ToolingInfo } from "../types.js";

/** Detect project tooling from config files */
export function scanTooling(projectRoot: string): ToolingInfo {
  return {
    testRunner: detectTestRunner(projectRoot),
    buildTool: detectBuildTool(projectRoot),
    linter: detectLinter(projectRoot),
    formatter: detectFormatter(projectRoot),
    packageManager: detectPackageManager(projectRoot),
  };
}

function exists(root: string, ...files: string[]): boolean {
  return files.some((f) => existsSync(resolve(root, f)));
}

function detectTestRunner(root: string): string | null {
  if (exists(root, "vitest.config.ts", "vitest.config.js")) return "vitest";
  if (exists(root, "jest.config.ts", "jest.config.js", "jest.config.json"))
    return "jest";
  if (exists(root, "pytest.ini", "pyproject.toml")) return "pytest";
  if (exists(root, ".mocharc.yml", ".mocharc.json")) return "mocha";
  return null;
}

function detectBuildTool(root: string): string | null {
  if (exists(root, "tsup.config.ts", "tsup.config.js")) return "tsup";
  if (exists(root, "vite.config.ts", "vite.config.js")) return "vite";
  if (exists(root, "next.config.ts", "next.config.js", "next.config.mjs"))
    return "next";
  if (exists(root, "webpack.config.ts", "webpack.config.js")) return "webpack";
  if (exists(root, "rollup.config.ts", "rollup.config.js")) return "rollup";
  if (exists(root, "esbuild.config.ts")) return "esbuild";
  if (exists(root, "Makefile")) return "make";
  return null;
}

function detectLinter(root: string): string | null {
  if (
    exists(
      root,
      "eslint.config.js",
      "eslint.config.mjs",
      ".eslintrc.js",
      ".eslintrc.json",
      ".eslintrc.yml"
    )
  )
    return "eslint";
  if (exists(root, ".pylintrc", "pylintrc")) return "pylint";
  if (exists(root, ".flake8")) return "flake8";
  if (exists(root, ".golangci.yml")) return "golangci-lint";
  return null;
}

function detectFormatter(root: string): string | null {
  if (exists(root, ".prettierrc", ".prettierrc.json", ".prettierrc.js", "prettier.config.js"))
    return "prettier";
  if (exists(root, "biome.json")) return "biome";
  if (exists(root, ".editorconfig")) return "editorconfig";
  return null;
}

function detectPackageManager(
  root: string
): ToolingInfo["packageManager"] {
  if (exists(root, "bun.lockb", "bun.lock")) return "bun";
  if (exists(root, "pnpm-lock.yaml")) return "pnpm";
  if (exists(root, "yarn.lock")) return "yarn";
  if (exists(root, "package-lock.json")) return "npm";
  if (exists(root, "package.json")) return "npm"; // default
  return null;
}

--- src/scanner/folder-tree.ts ---
import { readdirSync, statSync } from "node:fs";
import { resolve, basename } from "node:path";
import type { FolderCategory } from "../types.js";

const CATEGORY_PATTERNS: Record<FolderCategory["category"], RegExp> = {
  routes: /^(routes?|pages?|api|endpoints?)/i,
  models: /^(models?|entities|schemas?|types?)/i,
  services: /^(services?|providers?|handlers?|controllers?|actions?)/i,
  tests: /^(tests?|__tests__|spec|__spec__)/i,
  config: /^(config|configs?|settings?)/i,
  utils: /^(utils?|helpers?|lib|shared|common)/i,
  views: /^(views?|components?|templates?|layouts?|ui)/i,
  other: /./,
};

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "__pycache__",
  ".venv",
  "venv",
  "target",
  "vendor",
  ".mex",
]);

/** Scan top-level directories and categorize them */
export function scanFolderTree(projectRoot: string): FolderCategory[] {
  const categories: FolderCategory[] = [];

  let entries: string[];
  try {
    entries = readdirSync(projectRoot);
  } catch {
    return categories;
  }

  for (const entry of entries) {
    if (entry.startsWith(".") && entry !== ".github") continue;
    if (IGNORE_DIRS.has(entry)) continue;

    const fullPath = resolve(projectRoot, entry);
    let stat;
    try {
      stat = statSync(fullPath);
    } catch {
      continue;
    }

    if (!stat.isDirectory()) continue;

    const fileCount = countFiles(fullPath);
    const category = categorize(entry);

    categories.push({
      name: entry,
      path: entry,
      fileCount,
      category,
    });
  }

  return categories.sort((a, b) => b.fileCount - a.fileCount);
}

function categorize(dirName: string): FolderCategory["category"] {
  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    if (category === "other") continue;
    if (pattern.test(dirName)) return category as FolderCategory["category"];
  }
  return "other";
}

function countFiles(dir: string, depth = 0): number {
  if (depth > 3) return 0; // Don't recurse too deep
  let count = 0;
  try {
    for (const entry of readdirSync(dir)) {
      if (entry.startsWith(".")) continue;
      if (IGNORE_DIRS.has(entry)) continue;
      const fullPath = resolve(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isFile()) count++;
        else if (stat.isDirectory()) count += countFiles(fullPath, depth + 1);
      } catch {
        continue;
      }
    }
  } catch {
    // skip
  }
  return count;
}

--- src/scanner/readme.ts ---
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Read README content if it exists */
export function scanReadme(projectRoot: string): string | null {
  const candidates = ["README.md", "readme.md", "Readme.md", "README"];

  for (const name of candidates) {
    const path = resolve(projectRoot, name);
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, "utf-8");
        // Truncate to first 3000 chars to keep brief compact
        return content.length > 3000
          ? content.slice(0, 3000) + "\n... (truncated)"
          : content;
      } catch {
        return null;
      }
    }
  }

  return null;
}

--- src/sync/brief-builder.ts ---
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

--- src/sync/index.ts ---
import chalk from "chalk";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import type { MexConfig, SyncTarget, DriftIssue } from "../types.js";
import { runDriftCheck } from "../drift/index.js";
import { buildSyncBrief, buildCombinedBrief } from "./brief-builder.js";

function askUser(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function runClaudeInteractive(brief: string, cwd: string): boolean {
  const result = spawnSync("claude", [brief], {
    cwd,
    stdio: "inherit",
    timeout: 300_000,
  });
  return result.status === 0 || result.status === null;
}

type SyncMode = "interactive" | "prompts";

/** Run targeted sync: detect → brief → AI → verify → ask → loop */
export async function runSync(
  config: MexConfig,
  opts: { dryRun?: boolean; includeWarnings?: boolean }
): Promise<void> {
  let cycle = 0;
  let mode: SyncMode | null = null;

  while (true) {
    cycle++;

    // Step 1: Run drift check
    if (cycle === 1) {
      console.log(chalk.bold("Running drift check..."));
    } else {
      console.log(chalk.bold("\nRe-checking for remaining drift..."));
    }

    const report = await runDriftCheck(config);

    if (report.issues.length === 0) {
      console.log(chalk.green("✓ No drift detected. Everything is in sync."));
      return;
    }

    console.log(
      chalk.yellow(
        `Found ${report.issues.length} issues (score: ${report.score}/100)`
      )
    );

    // Step 2: Group issues by file
    const relevantIssues = opts.includeWarnings
      ? report.issues
      : report.issues.filter((i) => {
          const fileHasError = report.issues.some(
            (other) => other.file === i.file && other.severity === "error"
          );
          return fileHasError;
        });

    if (relevantIssues.length === 0) {
      console.log(
        chalk.green(
          "No errors found. Only warnings remain (use --warnings to include them)."
        )
      );
      return;
    }

    const targets = groupIntoTargets(relevantIssues);

    console.log(
      chalk.bold(`\n${targets.length} file(s) need attention:\n`)
    );

    for (const target of targets) {
      const errors = target.issues.filter(
        (i) => i.severity === "error"
      ).length;
      const warnings = target.issues.filter(
        (i) => i.severity === "warning"
      ).length;
      console.log(
        `  ${target.file} — ${errors} errors, ${warnings} warnings`
      );
    }

    // Dry run — show combined prompt and exit
    if (opts.dryRun) {
      console.log(
        chalk.dim("\n--dry-run: showing prompt without executing\n")
      );
      const brief = await buildCombinedBrief(targets, config.projectRoot);
      console.log(brief);
      console.log();
      return;
    }

    // Ask user for mode (only on first cycle)
    if (mode === null) {
      console.log(chalk.bold("\nHow should we fix these?"));
      console.log();
      console.log("  1) Interactive — Claude fixes with you watching (default)");
      console.log("  2) Show prompts — I'll paste manually");
      console.log("  3) Exit");
      console.log();

      const choice = await askUser("Choice [1-3] (default: 1): ");
      const picked = choice || "1";

      switch (picked) {
        case "1":
          mode = "interactive";
          break;
        case "2":
          mode = "prompts";
          break;
        case "3":
          console.log(chalk.dim("Exiting. Run mex sync again anytime."));
          return;
        default:
          console.log(chalk.dim("Exiting."));
          return;
      }
    }

    // Show prompts mode — print combined prompt and exit
    if (mode === "prompts") {
      const brief = await buildCombinedBrief(targets, config.projectRoot);
      console.log(brief);
      console.log();
      return;
    }

    // Step 3: Fix all files in one interactive session
    console.log();
    console.log(chalk.bold(`\nSending all ${targets.length} file(s) to Claude in one session...\n`));

    const brief = await buildCombinedBrief(targets, config.projectRoot);
    const ok = runClaudeInteractive(brief, config.projectRoot);

    if (!ok) {
      console.log(chalk.red("  ✗ Claude session failed"));
    }

    // Step 4: Verify
    const postReport = await runDriftCheck(config);
    const scoreDelta = postReport.score - report.score;
    const deltaStr =
      scoreDelta > 0
        ? chalk.green(`+${scoreDelta}`)
        : scoreDelta === 0
          ? chalk.yellow("+0")
          : chalk.red(`${scoreDelta}`);

    console.log(
      chalk.bold(
        `\nDrift score: ${report.score} → ${postReport.score}/100 (${deltaStr})`
      )
    );

    // Step 5: Check if we should continue
    const remainingErrors = postReport.issues.filter(
      (i) => i.severity === "error"
    ).length;
    const remainingWarnings = postReport.issues.filter(
      (i) => i.severity === "warning"
    ).length;

    if (remainingErrors === 0 && !opts.includeWarnings) {
      if (remainingWarnings > 0) {
        console.log(
          chalk.dim(
            `${remainingWarnings} warning(s) remain (use --warnings to include them).`
          )
        );
      } else {
        console.log(chalk.green("✓ All issues resolved."));
      }
      return;
    }

    if (postReport.score === 100) {
      console.log(chalk.green("✓ Perfect score. All issues resolved."));
      return;
    }

    // Ask user whether to continue
    const remaining = opts.includeWarnings
      ? remainingErrors + remainingWarnings
      : remainingErrors;

    const answer = await askUser(
      `\n${remaining} issue(s) remain. Run another cycle? [Y/n] `
    );

    if (answer.toLowerCase() === "n") {
      console.log(chalk.dim("Stopped. Run mex sync again anytime."));
      return;
    }
  }
}

function groupIntoTargets(issues: DriftIssue[]): SyncTarget[] {
  const byFile = new Map<string, DriftIssue[]>();
  for (const issue of issues) {
    if (!byFile.has(issue.file)) byFile.set(issue.file, []);
    byFile.get(issue.file)!.push(issue);
  }

  return Array.from(byFile.entries()).map(([file, issues]) => ({
    file,
    issues,
    gitDiff: null,
  }));
}

--- src/pattern/index.ts ---
import { join } from "node:path";
import { existsSync, writeFileSync, appendFileSync, mkdirSync, readFileSync } from "node:fs";
import chalk from "chalk";
import type { MexConfig } from "../types.js";

export async function runPatternAdd(config: MexConfig, name: string) {
  if (!/^[a-z0-9-]+$/i.test(name)) {
    throw new Error(`Invalid pattern name '${name}'. Use only letters, numbers, and hyphens.`);
  }

  const patternsDir = join(config.scaffoldRoot, "patterns");
  const patternPath = join(patternsDir, `${name}.md`);
  const indexPath = join(patternsDir, "INDEX.md");

  if (existsSync(patternPath)) {
    throw new Error(`Pattern '${name}' already exists at ${patternPath}`);
  }

  const today = new Date().toISOString().split("T")[0];

  const template = `---
name: ${name}
description: [one line — what this pattern covers and when to use it]
triggers:
  - "[keyword that should trigger loading this file]"
edges:
  - target: "context/conventions.md"
    condition: "when verifying this task"
last_updated: ${today}
---

# ${name}

## Context
[What to load or know before starting this task type]

## Steps
[The workflow — what to do, in what order]

## Gotchas
[The things that go wrong. What to watch out for.]

## Verify
[Checklist to run after completing this task type]

## Debug
[What to check when this task type breaks]

## Update Scaffold
- [ ] Update \`ROUTER.md\` "Current Project State" if what's working/not built has changed
- [ ] Update any \`context/\` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in \`patterns/\` and add to \`INDEX.md\`
`;

  mkdirSync(patternsDir, { recursive: true });
  writeFileSync(patternPath, template, "utf8");

  if (existsSync(indexPath)) {
    const currentIndex = readFileSync(indexPath, "utf8");
    const newlinePrefix = currentIndex.length === 0 || currentIndex.endsWith("\n") ? "" : "\n";
    const entry = `${newlinePrefix}| [${name}.md](${name}.md) | [description] |\n`;
    appendFileSync(indexPath, entry, "utf8");
  }

  console.log(chalk.green(`✓ Created pattern ${name}.md`));
  console.log(chalk.dim(`  Added entry to patterns/INDEX.md`));
  console.log(chalk.yellow(`! Remember to edit patterns/INDEX.md and replace [description] with a real use case.`));
}


codex
I’ve got the Mex execution model mapped now: scanner brief, static drift pass, grouped repair briefs, and manual pattern growth. Next I’m reading our own memory and startup surfaces to see where we already overlap and where the right move is actually a refactor of existing workflows instead of adding another standalone feature.
exec
/bin/zsh -lc "rg -n \"function |export async function|export function|class |const .* = async|const .* = \\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:219:function isYamlMapping(value: unknown): value is Record<string, unknown> {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:223:function describeYamlParseError(error: unknown): string {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:238:function loadYamlValue(raw: string): unknown {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:242:function parseYamlMapping(raw: string): Record<string, unknown> | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:255:function validateFrontMatterSyntax(raw: string): string | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:268:function extractFrontMatter(content: string): string {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:284:function extractAndValidateFrontMatter(content: string): { raw: string; parseError: string | null } {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:299:function stripCodeSegments(content: string): string {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:305:function extractYamlValue(frontMatter: string, key: string): string | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:317:function extractYamlValueFromContent(content: string, key: string): string | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:336:function parseYamlList(frontMatter: string, key: string): string[] {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:410:function parseYamlListFromContent(content: string, key: string): string[] {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:429:function parseToolCount(content: string): number {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:444:function parseYamlIntegerFromContent(content: string, key: string): number | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:454:function hasSignificantFileCountDivergence(
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:480:function isValidSpecIdCandidate(candidate: string): boolean {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:507:export function extractSpecIdCandidates(content: string): string[] {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:511:function countDistinctSpecIds(content: string): Map<string, number> {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:522:function countSpecIdsInValues(values: string[]): Map<string, number> {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:526:function extractCurrentSpecId(specFolder: string): string | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:531:function resolveSpecFolderPath(specFolder: string): string | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:573:function extractAllowedSpecIds(specFolder: string): Set<string> {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:629:function extractFirstHeading(content: string): string {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:634:function ruleAppliesToSource(
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:646:function buildTopicalMatchVariants(phrase: string): string[] {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:659:function getRuleMetadata(ruleId: QualityRuleId): ValidationRuleMetadata {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:663:function shouldBlockWrite(ruleId: QualityRuleId, source?: DataSource | string | null): boolean {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:668:function shouldBlockIndex(ruleId: QualityRuleId, source?: DataSource | string | null): boolean {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:673:function determineValidationDisposition(
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:705:function hasExecutionSignals(content: string): boolean {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:709:function validateMemoryQualityContent(content: string, options?: { filePath?: string; source?: DataSource | string | null }): ValidationResult {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:973:    const nonWhitespaceCount = (bodyText.match(/\S/g) ?? []).length;
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1047:function validateMemoryQualityFile(filePath: string): ValidationResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:53:function isFiniteNumber(value: unknown): value is number {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:57:function clampStrength(strength: number): number | null {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:118:function invalidateDegreeCache(): void {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:138:function init(database: Database.Database): void {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:158:function insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:217:      const existing = (database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:230:      const row = (database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:258:function insertEdgesBatch(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:302:function bulkInsertEdges(edges: Array<Record<string, unknown>>): { inserted: number; failed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:310:    const edgeColumns = (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:357:function createEdgeQueryResult(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:368:function getEdgesFrom(sourceId: string, limit: number = MAX_EDGES_LIMIT): EdgeQueryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:372:    const rows = (db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:393:function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): EdgeQueryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:397:    const rows = (db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:418:function getAllEdges(limit: number = MAX_EDGES_LIMIT): EdgeQueryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:422:    const rows = (db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:441:function getCausalChain(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:459:  function traverse(node: CausalChainNode, depth: number, path: Set<string>): void {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:504:function updateEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:542:        const existing = (database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:550:      const result = (database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:554:      const changed = (result as { changes: number }).changes > 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:578:function deleteEdge(edgeId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:582:    const result = (db.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:599:function deleteEdgesForMemory(memoryId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:602:  const result = (db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:616:function getGraphStats(): GraphStats {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:622:    const total = (db.prepare('SELECT COUNT(*) as count FROM causal_edges') as Database.Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:623:    const byRelation = (db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation') as Database.Statement).all() as Array<{ relation: string; count: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:624:    const avgStrength = (db.prepare('SELECT AVG(strength) as avg FROM causal_edges') as Database.Statement).get() as { avg: number | null };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:625:    const sources = (db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:626:    const targets = (db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:647:function findOrphanedEdges(): CausalEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:664:function cleanupOrphanedEdges(): { deleted: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:694:function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:738:function logWeightChange(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:752:function getWeightHistory(edgeId: number, limit: number = 50): WeightHistoryEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:768:function rollbackWeights(edgeId: number, toTimestamp: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:775:      const current = (database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:810:      const result = (database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:836:function countEdgesForNode(nodeId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:839:    const row = (db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:851:function touchEdgeAccess(edgeId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:858:function getStaleEdges(thresholdDays: number = STALENESS_THRESHOLD_DAYS): CausalEdge[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:145:function normalizeInputMode(inputMode: string | undefined, saveMode: SaveMode): string {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:152:function parseFrontmatter(content: string): Record<string, string> {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:173:function extractMemoryMetadataYaml(content: string): string {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:178:function parseMemoryMetadataBlock(content: string): Record<string, string> {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:206:function normalizeScalarValue(value: string | undefined): string {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:214:function parseFrontmatterArray(content: string, fieldName: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:261:function extractYamlListEntries(yamlBlock: string, fieldName: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:295:function extractSection(content: string, sectionName: string): string {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:319:function stripSectionScaffolding(sectionContent: string): string {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:327:function extractOverviewAnchorState(content: string): AnchorState {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:341:function extractSupersedesEntries(content: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:361:function extractMetadataTriggerPhrases(content: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:365:function normalizeProposition(text: string): string {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:375:function extractOverviewOutcomes(overviewSection: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:389:function extractDecisionTitles(decisionsSection: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:393:function extractDecisionRationales(decisionsSection: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:397:function extractCompletedClosureCandidates(content: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:406:function extractLastContextLines(content: string): string[] {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:410:function countMergedFromClauses(text: string): number {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:414:function isGenericTitle(title: string): boolean {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:419:function buildD3Counts(triggerPhrases: string[]): Record<D3Reason, number> {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:437:function buildManualTriggerKeySet(triggerPhrases: string[] | undefined): Set<string> {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:446:function buildD3CountsWithSource(
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:468:function countGuardrailSeverities(issues: ReviewIssue[]): {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:495:function emitD3Metrics(counts: Record<D3Reason, number>, labels: Record<string, string>): void {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:516:function emitGuardrailTelemetry(
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:591:export function reviewPostSaveQuality(input: PostSaveReviewInput): PostSaveReviewResult {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:639:    const payloadSummary = (collectedData.sessionSummary || '').trim();
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:732:    const placeholderObservationCount = (fileContent.match(/^### OBSERVATION:\s*(?:Observation)?\s*$/gim) ?? []).length;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:867:    const overviewCore = (
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1068:export function computeReviewScorePenalty(issues: ReviewIssue[]): number {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1080:export function printPostSaveReview(result: PostSaveReviewResult): void {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:68:function extractData(response: MCPResponse): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:79:function extractHints(data: Record<string, unknown>): string[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:84:function extractCachedSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94:function buildNextActions(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:129:function extractStructuralTrustFromPayload(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143:function buildStructuralRoutingNudge(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:164:export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:39:function truncateInline(text: string, maxChars: number): string {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47:function compactPath(filePath: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:55:function formatHighlight(highlight: StartupHighlight): string {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:60:function formatCompactNumber(value: number): string {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:67:function describeLastScan(lastScan: string | null): string {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:88:function buildStartupSurface(args: {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:131:function buildGraphOutline(highlightCount: number = 5): Pick<StartupBriefResult, 'graphOutline' | 'graphSummary' | 'graphState'> {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:179:function buildSessionContinuity(): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:196:export function buildStartupBrief(highlightCount?: number): StartupBriefResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:34:function sanitizeErrorForHint(msg: string): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:45:function redactPath(absolutePath: string): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:64:const SERVER_VERSION: string = (() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:118:function toNormalizedPath(filePath: string): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:122:function toSpecAliasKey(filePath: string): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:129:function isSpecsAliasPath(filePath: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:139:function isDotOpencodeVariantPath(normalizedPath: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:143:function isSpecsVariantPath(normalizedPath: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:150:function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:223:async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:396:  const trackRepairOutcome = (succeeded: boolean): void => {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:21:var __importStar = (this && this.__importStar) || (function () {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:23:        ownKeys = Object.getOwnPropertyNames || function (o) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:30:    return function (mod) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:144:function handleSignalShutdown(signal) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:158:function installSignalHandlers() {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:169:function isUnderApprovedSpecsRoot(normalizedInput) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:172:function isValidSpecFolder(folderPath) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:227:function resolveCliSpecFolderReference(rawArg) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:265:                const activeDir = (0, core_1.findActiveSpecsDir)();
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:275:    const isSpecFolderPath = (rawArg.startsWith('specs/') ||
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:280:function extractPayloadSpecFolder(data) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:289:async function readAllStdin(stdin = process.stdin) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:300:function parseStructuredJson(rawJson, sourceLabel) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:317:async function parseStructuredModeArguments(mode, args, stdinReader) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:355:async function parseArguments(argv = process.argv.slice(2), stdinReader = readAllStdin) {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:391:function validateArguments() {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:406:        const resolved = (0, core_1.findChildFolderSync)(inputBaseName);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:417:    const specsDir = (0, core_1.findActiveSpecsDir)() || path.join(core_1.CONFIG.PROJECT_ROOT, 'specs');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:499:async function main(argv = process.argv.slice(2), stdinReader = readAllStdin) {

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts && printf '\\n---startup---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts && printf '\\n---bootstrap---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Health
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { isEmbeddingModelReady } from '../core/index.js';
import { summarizeAliasConflicts } from './memory-index.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import { getEmbeddingRetryStats } from '../lib/providers/retry-manager.js';

import type { MCPResponse, EmbeddingProfile } from './types.js';
import type { HealthArgs, PartialProviderMetadata } from './memory-crud-types.js';

// Feature catalog: Health diagnostics (memory_health)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Memory health autoRepair metadata


/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
function sanitizeErrorForHint(msg: string): string {
  return msg
    .replace(/(^|[\s(])\/(?:[^/\n]+\/)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    .replace(/(^|[\s(])[A-Za-z]:\\(?:[^\\\n]+\\)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    .replace(/^[ \t]*at .+$/gm, '')            // strip stack trace lines
    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
    .trim()
    .slice(0, 200);
}

/** Redact absolute paths: keep only project-relative portion or basename. */
function redactPath(absolutePath: string): string {
  const normalizedPath = toNormalizedPath(absolutePath);
  if (normalizedPath.startsWith('.opencode/')) return normalizedPath;
  if (normalizedPath.startsWith('specs/')) return normalizedPath;
  const opencodeIdx = normalizedPath.indexOf('/.opencode/');
  const specsIdx = normalizedPath.indexOf('/specs/');
  if (opencodeIdx !== -1) return normalizedPath.slice(opencodeIdx + 1);
  if (specsIdx !== -1) return normalizedPath.slice(specsIdx + 1);
  // Fallback: basename only
  const lastSlash = normalizedPath.lastIndexOf('/');
  return lastSlash !== -1 ? normalizedPath.slice(lastSlash + 1) : normalizedPath;
}

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────────────────────── */

// Read version from package.json at module load time using ESM-relative paths.
// WHY try-catch: if package.json is missing or malformed, the server should still start
const SERVER_VERSION: string = (() => {
  const packageCandidates = [
    resolve(import.meta.dirname, '../package.json'),
    resolve(import.meta.dirname, '../../package.json'),
  ];

  try {
    for (const candidate of packageCandidates) {
      if (!existsSync(candidate)) {
        continue;
      }
      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
      if (pkg?.version) {
        return pkg.version;
      }
    }
    return 'unknown';
  } catch (_error: unknown) {
    return 'unknown';
  }
})();

const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
const DEFAULT_DIVERGENT_ALIAS_LIMIT = 20;
const MAX_DIVERGENT_ALIAS_LIMIT = 200;
const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
const SPECS_SEGMENT = '/specs/';

interface AliasConflictDbRow {
  file_path: string;
  content_hash: string | null;
  spec_folder?: string | null;
}

interface DivergentAliasVariant {
  filePath: string;
  contentHash: string | null;
}

interface DivergentAliasGroup {
  normalizedPath: string;
  specFolders: string[];
  distinctHashCount: number;
  variants: DivergentAliasVariant[];
}

interface DivergentAliasBucket {
  hasDotOpencodeVariant: boolean;
  hasSpecsVariant: boolean;
  variants: Map<string, string | null>;
  hashes: Set<string>;
  specFolders: Set<string>;
}

function toNormalizedPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function toSpecAliasKey(filePath: string): string {
  const normalizedPath = toNormalizedPath(filePath);
  return normalizedPath
    .replace(/\/\.opencode\/specs\//g, '/specs/')
    .replace(/^\.opencode\/specs\//, 'specs/');
}

function isSpecsAliasPath(filePath: string): boolean {
  const normalizedPath = toNormalizedPath(filePath);
  return (
    normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) ||
    normalizedPath.includes(SPECS_SEGMENT) ||
    normalizedPath.startsWith('.opencode/specs/') ||
    normalizedPath.startsWith('specs/')
  );
}

function isDotOpencodeVariantPath(normalizedPath: string): boolean {
  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
}

function isSpecsVariantPath(normalizedPath: string): boolean {
  if (isDotOpencodeVariantPath(normalizedPath)) {
    return false;
  }
  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
}

function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
  if (!rows.length) {
    return [];
  }

  const buckets = new Map<string, DivergentAliasBucket>();

  for (const row of rows) {
    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
      continue;
    }

    const normalizedPath = toNormalizedPath(row.file_path);
    const aliasKey = toSpecAliasKey(normalizedPath);
    let bucket = buckets.get(aliasKey);
    if (!bucket) {
      bucket = {
        hasDotOpencodeVariant: false,
        hasSpecsVariant: false,
        variants: new Map<string, string | null>(),
        hashes: new Set<string>(),
        specFolders: new Set<string>(),
      };
      buckets.set(aliasKey, bucket);
    }

    if (isDotOpencodeVariantPath(normalizedPath)) {
      bucket.hasDotOpencodeVariant = true;
    }
    if (isSpecsVariantPath(normalizedPath)) {
      bucket.hasSpecsVariant = true;
    }

    bucket.variants.set(normalizedPath, row.content_hash ?? null);
    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
      bucket.hashes.add(row.content_hash.trim());
    }
    if (typeof row.spec_folder === 'string' && row.spec_folder.length > 0) {
      bucket.specFolders.add(row.spec_folder);
    }
  }

  const groups: DivergentAliasGroup[] = [];
  for (const [normalizedPath, bucket] of buckets.entries()) {
    if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
      continue;
    }
    if (bucket.variants.size < 2 || bucket.hashes.size < 2) {
      continue;
    }

    const variants: DivergentAliasVariant[] = Array.from(bucket.variants.entries())
      .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
      .map(([filePath, contentHash]) => ({ filePath: redactPath(filePath), contentHash }));

    groups.push({
      normalizedPath: redactPath(normalizedPath),
      // Fix F21 — redact specFolders to prevent path disclosure.
      specFolders: Array.from(bucket.specFolders).sort().map(sf => redactPath(sf)),
      distinctHashCount: bucket.hashes.size,
      variants,
    });
  }

  groups.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
  return groups.slice(0, limit);
}

/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_health tool -- returns system health status and diagnostics. */
async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const {
    reportMode = 'full',
    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
    specFolder,
    autoRepair = false,
    confirmed = false,
  } = args ?? {};

  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_health',

---startup---
// ───────────────────────────────────────────────────────────────
// MODULE: Startup Brief Builder
// ───────────────────────────────────────────────────────────────
// Phase 026: Build a compact startup brief for hook-capable runtimes
// from local code graph + hook state (no MCP round-trip).

import { getStats, queryStartupHighlights, type StartupHighlight } from './code-graph-db.js';
import { getGraphFreshness } from './ensure-ready.js';
import { loadMostRecentState } from '../../hooks/claude/hook-state.js';
import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
import {
  createSharedPayloadEnvelope,
  trustStateFromGraphState,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
} from '../context/shared-payload.js';

/** Compact startup summary for the locally indexed code graph. */
export interface StartupGraphSummary {
  files: number;
  nodes: number;
  edges: number;
  lastScan: string | null;
}

/** Startup brief payload returned to hook-capable runtimes at session start. */
export interface StartupBriefResult {
  graphOutline: string | null;
  sessionContinuity: string | null;
  graphSummary: StartupGraphSummary | null;
  graphState: 'ready' | 'stale' | 'empty' | 'missing';
  cocoIndexAvailable: boolean;
  startupSurface: string;
  sharedPayload: SharedPayloadEnvelope | null;
}

const SUMMARY_MAX_CHARS = 240;

function truncateInline(text: string, maxChars: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return normalized.slice(0, maxChars - 3).trimEnd() + '...';
}

function compactPath(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/').filter(Boolean);
  if (parts.length <= 3) {
    return parts.join('/');
  }
  return parts.slice(-3).join('/');
}

function formatHighlight(highlight: StartupHighlight): string {
  const callSuffix = highlight.callCount > 0 ? ` [calls: ${highlight.callCount}]` : '';
  return `- ${highlight.name} (${highlight.kind}) - ${compactPath(highlight.filePath)}${callSuffix}`;
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function describeLastScan(lastScan: string | null): string {
  if (!lastScan) {
    return 'last scan unknown';
  }

  const scanDate = new Date(lastScan);
  if (Number.isNaN(scanDate.getTime())) {
    return 'last scan unknown';
  }

  const now = new Date();
  const sameDay = scanDate.getFullYear() === now.getFullYear()
    && scanDate.getMonth() === now.getMonth()
    && scanDate.getDate() === now.getDate();
  if (sameDay) {
    return 'scanned today';
  }

  return `last scan ${scanDate.toISOString().slice(0, 10)}`;
}

function buildStartupSurface(args: {
  sessionContinuity: string | null;
  graphSummary: StartupGraphSummary | null;
  graphState: StartupBriefResult['graphState'];
  cocoIndexAvailable: boolean;
}): string {
  const memoryLine = args.sessionContinuity
    ? 'session continuity available'
    : 'startup summary only (resume on demand)';

  let codeGraphLine = 'unavailable';
  if (args.graphState === 'ready' && args.graphSummary) {
    codeGraphLine = [
      'healthy',
      `${args.graphSummary.files.toLocaleString('en-US')} files`,
      `${formatCompactNumber(args.graphSummary.nodes)} nodes`,
      `${formatCompactNumber(args.graphSummary.edges)} edges`,
      `(${describeLastScan(args.graphSummary.lastScan)})`,
    ].join(' -- ').replace(' -- (', ' (');
  } else if (args.graphState === 'stale' && args.graphSummary) {
    codeGraphLine = [
      'stale',
      `${args.graphSummary.files.toLocaleString('en-US')} files`,
      `${formatCompactNumber(args.graphSummary.nodes)} nodes`,
      `${formatCompactNumber(args.graphSummary.edges)} edges`,
      `(${describeLastScan(args.graphSummary.lastScan)}; first structural read may refresh inline)`,
    ].join(' -- ').replace(' -- (', ' (');
  } else if (args.graphState === 'empty') {
    codeGraphLine = 'empty -- run `code_graph_scan`';
  }

  return [
    'Session context received. Current state:',
    '',
    `- Memory: ${memoryLine}`,
    `- Code Graph: ${codeGraphLine}`,
    `- CocoIndex: ${args.cocoIndexAvailable ? 'available' : 'missing'}`,
    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
    '',
    'What would you like to work on?',
  ].join('\n');
}

function buildGraphOutline(highlightCount: number = 5): Pick<StartupBriefResult, 'graphOutline' | 'graphSummary' | 'graphState'> {
  try {
    const stats = getStats();
    const freshness = getGraphFreshness(process.cwd());
    const graphSummary: StartupGraphSummary = {
      files: stats.totalFiles,
      nodes: stats.totalNodes,
      edges: stats.totalEdges,
      lastScan: stats.lastScanTimestamp,
    };

    if (stats.totalFiles <= 0 || stats.totalNodes <= 0) {
      return {
        graphOutline: null,
        graphSummary,
        graphState: 'empty',
      };
    }

    // Keep startup highlights small by default so graph context stays useful without crowding the token budget.
    const highlights = queryStartupHighlights(highlightCount);
    const lines: string[] = [
      `${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges.`,
      `Last scan: ${stats.lastScanTimestamp ?? 'unknown'}`,
    ];
    if (freshness === 'stale') {
      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
    }
    if (highlights.length > 0) {
      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
      lines.push('Highlights:');
      lines.push(...highlights.map(formatHighlight));
    }

    return {
      graphOutline: lines.join('\n'),
      graphSummary,
      graphState: freshness === 'stale' ? 'stale' : 'ready',
    };
  } catch {
    return {
      graphOutline: null,
      graphSummary: null,
      graphState: 'missing',
    };
  }
}

function buildSessionContinuity(): string | null {
  const state = loadMostRecentState();
  if (!state) {
    return null;
  }

  const parts: string[] = [];
  if (state.lastSpecFolder) {
    parts.push(`Last session worked on: ${state.lastSpecFolder}`);
  }
  if (state.sessionSummary?.text) {
    parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);
  }
  return parts.length > 0 ? parts.join('\n') : null;
}

/** Build the startup brief used by runtime hooks and transport startup digests. */
export function buildStartupBrief(highlightCount?: number): StartupBriefResult {
  const graph = buildGraphOutline(highlightCount);
  const sessionContinuity = buildSessionContinuity();
  const cocoIndexAvailable = isCocoIndexAvailable();
  const sections: SharedPayloadSection[] = [];
  if (graph.graphOutline) {
    sections.push({
      key: 'structural-context',
      title: 'Structural Context',
      content: graph.graphOutline,
      source: 'code-graph',
    });
  }
  if (sessionContinuity) {
    sections.push({
      key: 'session-continuity',
      title: 'Session Continuity',
      content: sessionContinuity,
      source: 'session',
    });
  }

  const startupSurface = buildStartupSurface({
    sessionContinuity,
    graphSummary: graph.graphSummary,
    graphState: graph.graphState,
    cocoIndexAvailable,
  });

  const sharedPayload = sections.length > 0
    ? createSharedPayloadEnvelope({
      kind: 'startup',
      sections,
      summary: graph.graphOutline
        ? `Startup brief with ${graph.graphState} structural context and ${sessionContinuity ? 'session continuity' : 'no continuity notes'}`
        : `Startup brief without structural highlights (${graph.graphState})`,
      provenance: {
        producer: 'startup_brief',
        sourceSurface: 'session_start',
        trustState: trustStateFromGraphState(graph.graphState),
        generatedAt: new Date().toISOString(),
        lastUpdated: graph.graphSummary?.lastScan ?? null,
        sourceRefs: ['code-graph-db', 'hook-state'],
      },
    })
    : null;

  return {
    graphOutline: graph.graphOutline,
    sessionContinuity,
    graphSummary: graph.graphSummary,
    graphState: graph.graphState,
    cocoIndexAvailable,
    startupSurface,
    sharedPayload,
  };
}

---bootstrap---
// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.

import { handleSessionResume } from './session-resume.js';
import type { CachedSessionSummaryDecision } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  attachStructuralTrustFields,
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  StructuralTrustPayloadError,
  type StructuralTrust,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionBootstrapArgs {
  specFolder?: string;
}

interface SessionBootstrapResult {
  resume: Record<string, unknown>;
  health: Record<string, unknown>;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract & StructuralTrust;
  structuralRoutingNudge?: {
    advisory: true;
    readiness: 'ready';
    preferredTool: 'code_graph_query';
    message: string;
    preservesAuthority: 'session_bootstrap';
  };
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
  nextActions: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function extractData(response: MCPResponse): Record<string, unknown> {
  try {
    const text = response?.content?.[0]?.text;
    if (typeof text === 'string') {
      const parsed = JSON.parse(text);
      return parsed?.data ?? parsed ?? {};
    }
  } catch { /* parse failed */ }
  return {};
}

function extractHints(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.hints)) return data.hints as string[];
  return [];
}

function extractCachedSummary(
  data: Record<string, unknown>,
): CachedSessionSummaryDecision | null {
  const candidate = data.cachedSummary;
  if (candidate && typeof candidate === 'object') {
    return candidate as CachedSessionSummaryDecision;
  }
  return null;
}

function buildNextActions(
  resumeData: Record<string, unknown>,
  healthData: Record<string, unknown>,
  structuralContext: StructuralBootstrapContract,
): string[] {
  const nextActions = new Set<string>();

  if (resumeData.error) {
    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
  }

  if (healthData.error) {
    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
  }

  if (structuralContext.recommendedAction) {
    nextActions.add(structuralContext.recommendedAction);
  }

  if (structuralContext.status === 'ready') {
    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
  } else if (structuralContext.status === 'stale') {
    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
  } else {
    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
  }

  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
  if (healthStatus === 'warning' || healthStatus === 'stale') {
    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
  }

  return [...nextActions].slice(0, 3);
}

function extractStructuralTrustFromPayload(
  payload: SharedPayloadEnvelope | null,
): StructuralTrust | null {
  if (!payload) {
    return null;
  }

  const structuralSection = payload.sections.find((section) =>
    section.key === 'structural-context' && section.structuralTrust,
  );

  return structuralSection?.structuralTrust ?? null;
}

function buildStructuralRoutingNudge(
  structuralContext: StructuralBootstrapContract,
): SessionBootstrapResult['structuralRoutingNudge'] | null {
  if (structuralContext.status !== 'ready') {
    return null;
  }

  return {
    advisory: true,
    readiness: 'ready',
    preferredTool: 'code_graph_query',
    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
    preservesAuthority: 'session_bootstrap',
  };
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
  const startMs = Date.now();
  const allHints: string[] = [];

  // Sub-call 1: session_resume with full resume payload
  let resumeData: Record<string, unknown> = {};
  try {
    const resumeResponse = await handleSessionResume({
      specFolder: args.specFolder,
    });
    resumeData = extractData(resumeResponse);
    allHints.push(...extractHints(resumeData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    resumeData = { error: message };
    allHints.push('session_resume failed. Try calling it manually.');
  }

  // Sub-call 2: session_health
  let healthData: Record<string, unknown> = {};
  try {
    const healthResponse = await handleSessionHealth();
    healthData = extractData(healthResponse);
    allHints.push(...extractHints(healthData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    healthData = { error: message };
    allHints.push('session_health failed. Try calling it manually.');
  }

  // Phase 027: Structural bootstrap contract
  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    allHints.push(
      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
    );
  }

  const cachedSummary = extractCachedSummary(resumeData);
  if (cachedSummary?.status === 'accepted') {
    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
  }
  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
  if (structuralRoutingNudge) {
    allHints.push(structuralRoutingNudge.message);
  }

  // Deduplicate hints
  const uniqueHints = [...new Set(allHints)];

  // Record bootstrap telemetry once for the composite call.
  const durationMs = Date.now() - startMs;
  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
  recordBootstrapEvent('tool', durationMs, completeness);

  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
  const structuralCertainty: SharedPayloadCertainty = 'exact';
  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
  if (!resumeData.error && !resumeStructuralTrust) {
    throw new StructuralTrustPayloadError(
      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
    );
  }
  const structuralContextWithTrust = attachStructuralTrustFields(
    structuralContext,
    structuralSnapshotTrust,
    { label: 'session_bootstrap structural context payload' },
  );
  const resumeWithTrust = resumeData.error
    ? resumeData
    : attachStructuralTrustFields(
      resumeData,
      resumeStructuralTrust,
      { label: 'session_bootstrap resume payload' },
    );

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'resume-surface',
      title: 'Resume Surface',
      content: summarizeUnknown(resumeData),
      source: 'memory',
      certainty: resumeCertainty,
    },
  ];
  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummary.cachedSummary.continuityText,

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts && printf '\\n---post-save---\\n' && sed -n '760,940p' .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts && printf '\\n---validate---\\n' && sed -n '820,980p' .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts && printf '\\n---generate---\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Causal Edges
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal edge creation (memory_causal_link)
// Causal relationship graph for memory lineage
import type Database from 'better-sqlite3';
import { clearDegreeCacheForDb } from '../search/graph-search-fn.js';
import { clearGraphSignalsCache } from '../graph/graph-signals.js';
import { detectContradictions } from '../graph/contradiction-detection.js';
import { ensureTemporalColumns } from '../graph/temporal-edges.js';
import { isTemporalEdgesEnabled } from '../search/search-flags.js';
import { runInTransaction } from './transaction-manager.js';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
} as const);

type RelationType = typeof RELATION_TYPES[keyof typeof RELATION_TYPES];

/**
 * C138: Relation weight multipliers applied during traversal scoring.
 * Higher values amplify the propagated strength; values < 1.0 dampen it.
 */
const RELATION_WEIGHTS: Record<string, number> = {
  supersedes:   1.5,  // Strongest signal — new info replaces old
  caused:       1.3,  // Strong causal link
  enabled:      1.1,  // Weak causal link
  supports:     1.0,  // Neutral / default
  derived_from: 1.0,  // Neutral / default
  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
};

const DEFAULT_MAX_DEPTH = 3;
const MAX_EDGES_LIMIT = 100;

// Edge bounds for the lightweight runtime path (NFR-R01, SC-005)
const MAX_EDGES_PER_NODE = 20;
const MAX_AUTO_STRENGTH = 0.5;
const MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05;
const STALENESS_THRESHOLD_DAYS = 90;
const DECAY_STRENGTH_AMOUNT = 0.1;
const DECAY_PERIOD_DAYS = 30;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function clampStrength(strength: number): number | null {
  if (!Number.isFinite(strength)) return null;
  return Math.max(0, Math.min(1, strength));
}

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface CausalEdge {
  id: number;
  source_id: string;
  target_id: string;
  relation: RelationType;
  strength: number;
  evidence: string | null;
  extracted_at: string;
  created_by: string;
  last_accessed: string | null;
}

type EdgeQueryResult = CausalEdge[] & {
  truncated: boolean;
  limit: number;
};

interface WeightHistoryEntry {
  id: number;
  edge_id: number;
  old_strength: number;
  new_strength: number;
  changed_by: string;
  changed_at: string;
  reason: string | null;
}

interface GraphStats {
  totalEdges: number;
  byRelation: Record<string, number>;
  avgStrength: number;
  uniqueSources: number;
  uniqueTargets: number;
}

interface CausalChainNode {
  id: string;
  edgeId?: number;          // T202: causal_edges.id for unlink workflow
  depth: number;
  relation: RelationType;
  strength: number;
  children: CausalChainNode[];
  truncated?: boolean;
  truncationLimit?: number | null;
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

function invalidateDegreeCache(): void {
  try {
    // H1 FIX: Use db-specific cache invalidation instead of the no-op global version
    if (db) {
      clearDegreeCacheForDb(db);
    }
  } catch (_error: unknown) {
    // Cache invalidation is best-effort; never block edge mutations
  }
  try {
    clearGraphSignalsCache();
  } catch (_error: unknown) {
    // Graph signals cache invalidation is best-effort
  }
}

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;

  // Defensive traversal indexes — the canonical creation lives in
  // Vector-index-impl.ts migration v8 (CHK-062).  These IF NOT EXISTS guards
  // Ensure the indexes are present even when the module is initialised outside
  // The normal migration path (e.g. tests, standalone scripts).
  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
    ensureTemporalColumns(database);
  } catch (_e: unknown) {
    // Best-effort: table may not exist yet during early startup sequencing
  }
}

/* ───────────────────────────────────────────────────────────────
   5. EDGE OPERATIONS
----------------------------------------------------------------*/

function insertEdge(
  sourceId: string,
  targetId: string,
  relation: RelationType,
  strength: number = 1.0,
  evidence: string | null = null,
  shouldInvalidateCache: boolean = true,
  createdBy: string = 'manual',
): number | null {
  if (!db) {
    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
    return null;
  }
  const database = db;

  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
  const effectiveStrength = createdBy === 'auto'
    ? Math.min(strength, MAX_AUTO_STRENGTH)
    : strength;

  // Prevent self-loops
  if (sourceId === targetId) {
    return null;
  }

  // Fix #26 (FK check) deferred — test environments use synthetic IDs not in memory_index.
  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.

  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
  if (createdBy === 'auto') {
    const edgeCount = countEdgesForNode(sourceId);
    if (edgeCount >= MAX_EDGES_PER_NODE) {
      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
      return null;
    }
  }

  try {
    const clampedStrength = clampStrength(effectiveStrength);
    if (clampedStrength === null) {
      console.warn('[causal-edges] insertEdge rejected non-finite strength');
      return null;
    }

    // Wrap SELECT + UPSERT + logWeightChange in a transaction for atomicity
    const rowId = database.transaction(() => {
      if (isTemporalEdgesEnabled()) {
        detectContradictions(
          database,
          Number.parseInt(sourceId, 10),
          Number.parseInt(targetId, 10),
          relation,
        );
      }

      // Check if edge exists (for weight_history logging on conflict update).
      // This SELECT is intentional: we need the old strength to decide whether
      // To write a weight_history row after the upsert. The subsequent INSERT
      // Uses last_insert_rowid() to avoid a second post-upsert SELECT.
      const existing = (database.prepare(`
        SELECT id, strength FROM causal_edges
        WHERE source_id = ? AND target_id = ? AND relation = ?
      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number; strength: number } | undefined;

      (database.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
          strength = excluded.strength,
          evidence = COALESCE(excluded.evidence, causal_edges.evidence)
      `) as Database.Statement).run(sourceId, targetId, relation, clampedStrength, evidence, createdBy);

      const row = (database.prepare(`
        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number } | undefined;
      const rowId = row ? row.id : 0;

      // T001d: Log weight change on conflict update
      if (existing && rowId && isFiniteNumber(existing.strength) && existing.strength !== clampedStrength) {
        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
      }

      return rowId;
    })();

    if (shouldInvalidateCache) {
      invalidateDegreeCache();
    }

    return rowId || null;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] insertEdge error: ${msg}`);
    if (/SQLITE_BUSY|SQLITE_LOCKED|database is locked/i.test(msg)) {
      throw error;
    }
    return null;
  }
}

function insertEdgesBatch(
  edges: Array<{
    sourceId: string;

---post-save---
      && normalizedDecisionTitlePropositions.has(proposition)
      && normalizedDecisionRationales.has(proposition)
    ));
    if (duplicatedDecisionPropositions.length > 0) {
      issues.push({
        checkId: 'DUP2',
        severity: 'MEDIUM',
        field: 'decisions',
        message: `decision proposition is repeated across outcomes, title, and rationale: ${JSON.stringify(duplicatedDecisionPropositions.slice(0, 3))}`,
        fix: 'Deduplicate repeated decision propositions across Key Outcomes, decision titles, and fallback rationale',
      });
    }

    const closureSignals = closureCandidates.filter((candidate) => (
      /(complete|completed|canonical|follow[- ]on|no pending|no immediate work|outside this memory|optional downstream)/i.test(candidate)
    ));
    if (closureSignals.length >= 3) {
      issues.push({
        checkId: 'DUP3',
        severity: 'MEDIUM',
        field: 'continuation',
        message: `completed-session closure guidance is repeated across ${closureSignals.length} surfaces`,
        fix: 'Keep completed-session closure guidance on the canonical Next Action surface only',
      });
    }

    const clippedLastLine = lastContextLines.find((line) => !/[.?!…]$/.test(line) && !line.endsWith('...'));
    if (clippedLastLine) {
      issues.push({
        checkId: 'DUP4',
        severity: 'MEDIUM',
        field: 'resume_context',
        message: `Last context ends as a clipped fragment: "${clippedLastLine}"`,
        fix: 'Trim Last resume context at a sentence or word boundary, or add an explicit ellipsis',
      });
    }

    if (metadataHasContextType && (savedContextType || metadataContextType) && savedContextType !== metadataContextType) {
      issues.push({
        checkId: 'DUP5',
        severity: 'MEDIUM',
        field: 'context_type',
        message: `frontmatter contextType is "${savedContextType || 'missing'}" but MEMORY METADATA is "${metadataContextType || 'missing'}"`,
        fix: 'Render MEMORY METADATA context_type from the same resolved frontmatter contextType value',
      });
    }

    const normalizedSavedTriggers = Array.from(new Set(savedTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
    const normalizedMetadataTriggers = Array.from(new Set(metadataTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
    if (metadataHasTriggerPhrases && JSON.stringify(normalizedSavedTriggers) !== JSON.stringify(normalizedMetadataTriggers)) {
      issues.push({
        checkId: 'DUP5',
        severity: 'HIGH',
        field: 'trigger_phrases',
        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
      });
    }

    const redundantSectionIdentityMatches = fileContent.match(/<!-- ANCHOR:[a-z0-9-]+ -->\s*\n<a id="[^"]+"><\/a>\s*\n(?:\s*\n)?##/gi) ?? [];
    if (redundantSectionIdentityMatches.length > 0) {
      issues.push({
        checkId: 'DUP6',
        severity: 'MEDIUM',
        field: 'anchors',
        message: `redundant section identity scaffolding detected in ${redundantSectionIdentityMatches.length} section opener(s)`,
        fix: 'Keep markdown headers plus ANCHOR comments, and remove legacy HTML id scaffolding',
      });
    }

    const inflatedFileRow = fileContent
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.startsWith('| `') && countMergedFromClauses(line) >= 2);
    if (inflatedFileRow) {
      issues.push({
        checkId: 'DUP7',
        severity: 'MEDIUM',
        field: 'files',
        message: `FILES row description contains repeated merged provenance inflation: "${inflatedFileRow}"`,
        fix: 'Move verbose merged provenance out of FILES descriptions and keep only one merged summary clause',
      });
    }

    if (savedDescription) {
      const genericDescriptions = [
        'session focused on implementing and testing features',
        'development session',
        'context save',
      ];
      const isGenericDesc = genericDescriptions.some((entry) => savedDescription.toLowerCase().includes(entry));
      if (isGenericDesc && payloadSummary.length > 20) {
        issues.push({
          checkId: 'PSR-6',
          severity: 'LOW',
          field: 'description',
          message: 'Generic boilerplate description',
          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
        });
      }
    }

    // CHECK-D1: overview truncation / ellipsis integrity.
    if (payloadSummary.length > 0 && overview.length > 0) {
    const trimmedOverview = overview.trimEnd();
    const usesAsciiEllipsis = trimmedOverview.endsWith('...');
    const usesUnicodeEllipsis = trimmedOverview.endsWith('…');
    const overviewCore = (
      usesAsciiEllipsis
        ? trimmedOverview.slice(0, -3)
        : usesUnicodeEllipsis
          ? trimmedOverview.slice(0, -1)
          : trimmedOverview
    ).trimEnd();
    const payloadOverflow = payloadSummary.length >= overviewCore.length + 40;
    const nextChar = payloadSummary.charAt(overviewCore.length);
    const coreEndsMidWord = /[A-Za-z0-9]$/.test(overviewCore) && /[A-Za-z0-9]/.test(nextChar);
    const plainMidTokenEnding = !usesAsciiEllipsis && !usesUnicodeEllipsis && /[A-Za-z0-9]$/.test(trimmedOverview);

      if (payloadOverflow && (usesAsciiEllipsis || coreEndsMidWord || plainMidTokenEnding)) {
        issues.push({
          checkId: 'D1',
          severity: 'HIGH',
          field: 'overview',
          message: 'OVERVIEW appears truncated mid-token or with non-canonical ellipsis handling',
          fix: 'Re-render the OVERVIEW from the full session summary using the boundary-safe truncation helper',
        });
      }
    }

    // CHECK-D2: lexical placeholder contamination.
    if (payloadDecisions.length > 0 && DECISION_PLACEHOLDER_PATTERN.test(decisionsSection)) {
      issues.push({
        checkId: 'D2',
        severity: 'HIGH',
        field: 'decisions',
        message: 'DECISIONS contains observation/user placeholder labels despite authored decisions in the payload',
        fix: 'Preserve authored decision arrays before any lexical fallback branch runs',
      });
    }

    // CHECK-D3: trigger phrase sanitization.
    if (Object.values(d3Counts).some((count) => count > 0)) {
      const details = [
        d3Counts.path_fragment > 0 ? `path_fragment=${d3Counts.path_fragment}` : null,
        d3Counts.standalone_stopword > 0 ? `stopword=${d3Counts.standalone_stopword}` : null,
        d3Counts.synthetic_bigram > 0 ? `bigram=${d3Counts.synthetic_bigram}` : null,
      ].filter(Boolean).join(', ');

      issues.push({
        checkId: 'D3',
        severity: 'MEDIUM',
        field: 'trigger_phrases',
        message: `trigger_phrases contains unsanitized junk (${details})`,
        fix: 'Run trigger phrases through the Phase 3 sanitizer before render and persist only the kept phrases',
      });
    }

    // CHECK-D4: frontmatter vs metadata tier drift.
    if (savedTier && metadataTier && savedTier !== metadataTier) {
      issues.push({
        checkId: 'D4',
        severity: 'HIGH',
        field: 'importance_tier',
        message: `frontmatter is "${savedTier}" but MEMORY METADATA is "${metadataTier}"`,
        fix: 'Render both importance_tier locations from the same resolved value',
      });
    }

    // CHECK-D5: continuation signal without supersedes.
    if (continuationPattern && supersedes.length === 0) {
      issues.push({
        checkId: 'D5',
        severity: 'MEDIUM',
        field: 'causal_links.supersedes',
        message: `continuation signal matched "${continuationPattern}" but causal_links.supersedes is empty`,
        fix: 'Populate causal_links.supersedes when a continuation save has a valid predecessor',
      });
    }

    // CHECK-D6: duplicate trigger phrases.

---validate---
  const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const specIdCounts = countDistinctSpecIds(bodyContent);
  const keyTopics = parseYamlListFromContent(content, 'key_topics');
  const frontmatterSpecCounts = countSpecIdsInValues([...triggerPhrases, ...keyTopics]);
  const foreignFrontmatterMentions = [...frontmatterSpecCounts.entries()]
    .filter(([specId]) => !allowedSpecIds.has(specId))
    .map(([specId, count]) => `${specId} x${count}`);
  let dominatesForeignSpec = false;
  let scatteredForeignSpec = false;
  const scatteredForeignMentions: string[] = [];
  if (specIdCounts.size > 0) {
    const currentSpecMentions = currentSpecId ? (specIdCounts.get(currentSpecId) ?? 0) : 0;
    let strongestForeignMentions = 0;
    let totalForeignMentions = 0;
    for (const [specId, count] of specIdCounts.entries()) {
      if (!allowedSpecIds.has(specId)) {
        totalForeignMentions += count;
        if (count > strongestForeignMentions) {
          strongestForeignMentions = count;
        }
        if (count <= 2) {
          scatteredForeignMentions.push(`${specId} x${count}`);
        }
      }
    }
    dominatesForeignSpec = strongestForeignMentions >= 3 && strongestForeignMentions >= currentSpecMentions + 2;
    scatteredForeignSpec = scatteredForeignMentions.length >= 2 && totalForeignMentions >= 2 && strongestForeignMentions <= 2;
  }

  const frontmatterForeignSpec = foreignFrontmatterMentions.length > 0;
  const v8Matches = [
    ...(frontmatterForeignSpec ? foreignFrontmatterMentions.map((match) => `frontmatter:${match}`) : []),
    ...(dominatesForeignSpec ? ['body:foreign spec ids dominate rendered content'] : []),
    ...(scatteredForeignSpec ? scatteredForeignMentions.map((match) => `body-scattered:${match}`) : []),
  ];
  ruleResults.push({
    ruleId: 'V8',
    passed: v8Matches.length === 0,
    message: v8Matches.length > 0
      ? `spec relevance mismatch: ${v8Matches.join(', ')}`
      : 'ok',
  });

  const titleValue = extractYamlValueFromContent(content, 'title') || extractFirstHeading(content);
  const titlePatternMatch = TITLE_CONTAMINATION_PATTERNS.find(({ pattern }) => pattern.test(titleValue));
  ruleResults.push({
    ruleId: 'V9',
    passed: !titlePatternMatch,
    message: titlePatternMatch ? `contaminated title: ${titlePatternMatch.label}` : 'ok',
  });

  const capturedFileCount = parseYamlIntegerFromContent(content, 'captured_file_count');
  const filesystemFileCount = parseYamlIntegerFromContent(content, 'filesystem_file_count');
  const divergentSessionSource = hasSignificantFileCountDivergence(filesystemFileCount, capturedFileCount);
  ruleResults.push({
    ruleId: 'V10',
    passed: !divergentSessionSource,
    message: divergentSessionSource
      ? `session source mismatch: filesystem_file_count=${filesystemFileCount}, captured_file_count=${capturedFileCount}`
      : 'ok',
  });

  // V11: API error content leakage — detect error-dominated memory content
  const ERROR_VOCAB = /\b(?:error|api_error|request_id|req_\w+|500|503|429|overloaded|internal.server)\b/i;
  const API_ERROR_PATTERN = /\bAPI\s+Error:\s*\d{3}\b/i;
  const JSON_ERROR_PATTERN = /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error|rate_limit_error|server_error)/i;
  const descriptionValue = extractYamlValueFromContent(content, 'description') || '';
  const hasErrorDescription = API_ERROR_PATTERN.test(descriptionValue) || JSON_ERROR_PATTERN.test(descriptionValue);
  const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
  const errorTriggerCount = triggerPhrases.filter((tp) => ERROR_VOCAB.test(tp)).length;
  const errorDominatedTriggers = triggerPhrases.length > 0 && (errorTriggerCount / triggerPhrases.length) > 0.5;
  const v11Failed = hasErrorDescription || hasErrorTitle || errorDominatedTriggers;
  ruleResults.push({
    ruleId: 'V11',
    passed: !v11Failed,
    message: v11Failed
      ? `error content leakage: ${[
          hasErrorDescription ? 'description' : '',
          hasErrorTitle ? 'title' : '',
          errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',
        ].filter(Boolean).join(', ')}`
      : 'ok',
  });

  // V12: Topical coherence — check if memory content overlaps with spec's trigger_phrases
  // Skip when:
  // - File is in a */memory/ directory (already validated by save pipeline, may use different terms)
  // - File is a spec doc (spec.md, plan.md, checklist.md, etc.) — these define the spec itself
  // - filePath is provided and matches known spec doc patterns
  const isMemoryDirFile = options?.filePath ? /[/\\]memory[/\\]/.test(options.filePath) : false;
  const isSpecDoc = options?.filePath
    ? /[/\\](?:spec|plan|checklist|tasks|decision-record|implementation-summary|research|handover)\.md$/i.test(options.filePath)
    : false;
  let v12Failed = false;
  let v12Message = 'ok';
  if (specFolder && !isMemoryDirFile && !isSpecDoc) {
    // T023: Normalize specFolder to an absolute path before resolving spec.md.
    // If specFolder is already absolute, use it as-is; otherwise resolve relative
    // to the current working directory.
    const resolvedSpecFolder = resolveSpecFolderPath(specFolder);

    // Try to find and read the spec.md file
    let specTriggerPhrases: string[] = [];
    if (resolvedSpecFolder) {
      const specMdCandidates = [
        path.resolve(resolvedSpecFolder, 'spec.md'),
        // specFolder might be just a relative path or short name
      ];
      for (const candidate of specMdCandidates) {
        if (fs.existsSync(candidate)) {
          try {
            const specContent = fs.readFileSync(candidate, 'utf-8');
            specTriggerPhrases = parseYamlListFromContent(specContent, 'trigger_phrases');
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            structuredLog('warn', 'Failed to read spec.md during V12 topical coherence validation', {
              candidate,
              specFolder,
              error: message,
            });
          }
          break;
        }
      }
    }
    if (specTriggerPhrases.length > 0) {
      const lowerContent = content.toLowerCase();
      const hasOverlap = specTriggerPhrases.some((phrase) => (
        buildTopicalMatchVariants(phrase).some((variant) => lowerContent.includes(variant))
      ));
      if (!hasOverlap) {
        v12Failed = true;
        v12Message = `V12_TOPICAL_MISMATCH: zero of ${specTriggerPhrases.length} spec trigger_phrases found in memory content`;
      }
    }
  }
  ruleResults.push({
    ruleId: 'V12',
    passed: !v12Failed,
    message: v12Message,
  });

  // V13: Frontmatter YAML integrity and content density
  // Sub-check 1: YAML syntax errors in frontmatter (T017-T018)
  // Sub-check 2: Content density — strip frontmatter block, count non-whitespace chars (T020)
  let v13Failed = false;
  let v13Message = 'ok';
  if (frontMatterParseError) {
    v13Failed = true;
    v13Message = `malformed frontmatter YAML: ${frontMatterParseError}`;
  } else {
    // Content density check: strip the leading frontmatter block then count non-whitespace chars
    const bodyText = content.replace(/^---\n[\s\S]*?\n---\n?/, '').replace(/```yaml\n[\s\S]*?\n```/gi, '');
    const nonWhitespaceCount = (bodyText.match(/\S/g) ?? []).length;
    if (nonWhitespaceCount < 50) {
      v13Failed = true;
      v13Message = `content density too low: ${nonWhitespaceCount} non-whitespace characters in body (minimum 50)`;
    }
  }
  ruleResults.push({
    ruleId: 'V13',

---generate---
"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.readAllStdin = readAllStdin;
exports.parseArguments = parseArguments;
exports.validateArguments = validateArguments;
exports.isValidSpecFolder = isValidSpecFolder;
exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const core_1 = require("../core");
const workflow_1 = require("../core/workflow");
const loaders_1 = require("../loaders");
const collect_session_data_1 = require("../extractors/collect-session-data");
// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
}
// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;
// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal) {
    if (shuttingDown)
        return; // prevent re-entrant handling
    shuttingDown = true;
    let lockReleaseFailed = false;
    try {
        (0, workflow_1.releaseFilesystemLock)();
    }
    catch (_err) {
        lockReleaseFailed = true;
    }
    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
    process.exit(lockReleaseFailed ? 1 : 0);
}
function installSignalHandlers() {
    if (signalHandlersInstalled) {
        return;
    }
    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
    signalHandlersInstalled = true;
}
// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput) {
    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
}
function isValidSpecFolder(folderPath) {
    const folderName = path.basename(folderPath);
    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    // Extract the trailing portion that might be "parent/child"
    const trailingSegments = normalizedInput.split('/');
    // Check if the last two segments both match the spec folder pattern
    if (trailingSegments.length >= 2) {
        const lastTwo = trailingSegments.slice(-2);
        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
            // Both segments are valid spec folder names — valid nested spec folder
            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
            if (!hasSpecsParent) {
                // Fallback: check if the path resolves to an existing directory under any specs root
                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                    const candidate = path.join(specsDir, normalizedInput);
                    if (!path.isAbsolute(normalizedInput) &&
                        fsSync.existsSync(candidate) &&
                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
                        return { valid: true };
                    }
                }
                return {
                    valid: false,
                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
                };
            }
            return { valid: true };
        }
    }
    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
        if (/^\d{3}-/.test(folderName)) {
            if (/[A-Z]/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should be lowercase' };
            }
            if (/_/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
            }
            if (!/^[a-z]/.test(folderName.slice(4))) {
                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
            }
        }
        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
    }
    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
    if (!hasSpecsParent) {
        // Fallback: check if bare name can be resolved via recursive child search
        // (findChildFolderSync in validateArguments handles this, so just report the error here)
        return {
            valid: false,
            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
    }
    return { valid: true };
}
function resolveCliSpecFolderReference(rawArg) {
    const folderName = path.basename(rawArg);
    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/'))
        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
        : null;
    let resolvedNestedPath = null;
    if (!rawArg.endsWith('.json')) {
        if (path.isAbsolute(rawArg)) {
            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
            const lastSegment = absoluteSegments.at(-1);
            const parentSegment = absoluteSegments.at(-2);
            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
                resolvedNestedPath = rawArg;
            }
        }
        let cleaned = rawArg;
        if (cleaned.startsWith('.opencode/specs/')) {
            cleaned = cleaned.slice('.opencode/specs/'.length);
        }
        else if (cleaned.startsWith('specs/')) {
            cleaned = cleaned.slice('specs/'.length);
        }
        cleaned = cleaned.replace(/\/+$/, '');
        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
            resolvedNestedPath = explicitProjectScopedPath;
        }
        const segments = cleaned.split('/');
        if (!resolvedNestedPath && segments.length >= 2) {
            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                const candidate = path.join(specsDir, ...segments);
                if (fsSync.existsSync(candidate)) {
                    resolvedNestedPath = candidate;

exec
/bin/zsh -lc "sed -n '223,470p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
        cachedSummary.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
      ].join(' | '),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'health-surface',
      title: 'Health Surface',
      content: summarizeUnknown(healthData),
      source: 'operational',
      certainty: healthCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      // This section carries trust derived from the local structural snapshot,
      // which remains valid even when the remote resume surface fails closed.
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust: structuralSnapshotTrust,
    },
    {
      key: 'next-actions',
      title: 'Next Actions',
      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
      source: 'session',
      certainty: nextActionsCertainty,
    },
  );

  const payloadContract = createSharedPayloadEnvelope({
    kind: 'bootstrap',
    sections: payloadSections,
    summary: `Bootstrap payload: ${summarizeCertaintyContract([
      { label: 'resume', certainty: resumeCertainty },
      { label: 'health', certainty: healthCertainty },
      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
      { label: 'structural', certainty: structuralCertainty },
      { label: 'nextActions', certainty: nextActionsCertainty },
    ])}; structuralStatus=${structuralContext.status}`,
    provenance: {
      producer: 'session_bootstrap',
      sourceSurface: 'session_bootstrap',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: structuralContext.status === 'ready'
      ? 'fresh'
      : structuralContext.status === 'stale'
        ? 'stale'
        : 'empty',
    sourceSurface: 'session_bootstrap',
  });

  const result: SessionBootstrapResult = {
    resume: resumeWithTrust,
    health: healthData,
    ...(cachedSummary ? { cachedSummary } : {}),
    structuralContext: structuralContextWithTrust,
    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      bootstrapPayload: payloadContract,
      resumePayload,
      healthPayload,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    hints: uniqueHints,
    // Keep advisory routing guidance out of nextActions so bootstrap and resume
    // remain the authoritative recovery owners for startup and deep resume flows.
    nextActions: buildNextActions(resumeData, healthData, structuralContext),
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
    structuredContent: result,
  };
}

 succeeded in 0ms:
async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const {
    reportMode = 'full',
    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
    specFolder,
    autoRepair = false,
    confirmed = false,
  } = args ?? {};

  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'specFolder must be a string',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof autoRepair !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'autoRepair must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof confirmed !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'confirmed must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'limit must be a positive number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));

  const database = vectorIndex.getDb();
  let memoryCount = 0;
  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
  let aliasRows: AliasConflictDbRow[] = [];
  let divergentAliasGroups: DivergentAliasGroup[] = [];
  const embeddingRetry = getEmbeddingRetryStats();
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number> | undefined;
      memoryCount = countResult?.count ?? 0;

      const whereParts: string[] = [
        'parent_id IS NULL',
      ];
      const params: unknown[] = [];
      if (specFolder) {
        whereParts.push('spec_folder = ?');
        params.push(specFolder);
      }

      const aliasSql = `
        SELECT file_path, content_hash, spec_folder
        FROM memory_index
        WHERE ${whereParts.join(' AND ')}
      `;

      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
      aliasConflicts = summarizeAliasConflicts(aliasRows);
      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        details: { requestId },
        startTime,
      });
    }
    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
  }

  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
    const hints: string[] = [];
    if (!database) {
      hints.push('Database not connected - restart MCP server');
    }
    if (autoRepair) {
      hints.push('autoRepair is only applied in reportMode="full"');
    }
    if (aliasConflicts.divergentHashGroups === 0) {
      hints.push('No divergent alias groups detected');
    }
    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
    }

    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
      data: {
        reportMode,
        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
        databaseConnected: !!database,
        embeddingRetry,
        specFolder: specFolder ?? null,
        limit: safeLimit,
        totalRowsScanned: aliasRows.length,
        totalDivergentGroups: aliasConflicts.divergentHashGroups,
        returnedGroups: divergentAliasGroups.length,
        groups: divergentAliasGroups,
      },
      hints,
      startTime,
    });
  }

  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  const repair = {
    requested: autoRepair,
    attempted: false,
    repaired: false,
    partialSuccess: false,
    actions: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  let successfulRepairCount = 0;
  let failedRepairCount = 0;

  const trackRepairOutcome = (succeeded: boolean): void => {
    repair.attempted = true;
    if (succeeded) {
      successfulRepairCount += 1;
      return;
    }
    failedRepairCount += 1;
  };

  if (!profile) {
    try {
      // Resolve the lazy profile so health reflects the active runtime provider
      // Rather than the legacy sync fallback defaults.
      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
    } catch (profileError: unknown) {
      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
    }
  }

  const providerName = profile?.provider ?? providerMetadata.provider;
  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
  const repairActions = [
    'fts_rebuild',
    'trigger_cache_refresh',
    'orphan_edges_cleanup',
    'orphan_vector_cleanup',
  ];

  if (autoRepair && !confirmed) {
    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: 'Confirmation required before auto-repair actions are executed',
      data: {
        status,
        reportMode,
        autoRepairRequested: true,
        needsConfirmation: true,
        actions: repairActions,
        embeddingRetry,
      },
      hints: [
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ],
      startTime,
    });
  }

  if (!isEmbeddingModelReady()) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }
  // FTS5 consistency check
  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      if (memoryCountRow.count !== ftsCountRow.count) {
        hints.push(
          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
          `Run memory_index_scan with force:true to rebuild FTS5 index.`
        );

        if (autoRepair) {
          try {
            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
            repair.actions.push('fts_rebuild');

            triggerMatcher.refreshTriggerCache();

exec
/bin/zsh -lc "rg -n \"export async function handleSessionResume|buildStructuralBootstrapContract|memory_context\\(|memory_search\\(|session_resume|resume\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-retrieve.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-retrieve.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:210:export function buildStructuralBootstrapContract(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:14:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:401:export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,

exec
/bin/zsh -lc "sed -n '400,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
  // F052: Record memory recovery metric for session_resume
  recordMetricEvent({ kind: 'memory_recovery' });

  // Phase 024: Record bootstrap telemetry
  const startMs = Date.now();
  const hints: string[] = [];

  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
  let memoryResult: Record<string, unknown> = {};
  if (args.minimal) {
    memoryResult = { skipped: true, reason: 'minimal mode' };
  } else {
    try {
      const mcpResponse = await handleMemoryContext({
        input: 'resume previous work continue session',
        mode: 'resume',
        profile: 'resume',
        specFolder: args.specFolder,
      });
      // Extract data from MCP envelope
      if (mcpResponse?.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(mcpResponse.content[0].text);
          memoryResult = parsed?.data ?? parsed ?? {};
        } catch {
          memoryResult = { raw: mcpResponse.content[0].text };
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      memoryResult = { error: message };
      hints.push('Memory resume failed. Try memory_context manually.');
    }
  }

  // ── Sub-call 2: Code graph status ───────────────────────────
  let codeGraph: CodeGraphStatus = {
    status: 'error',
    lastScan: null,
    nodeCount: 0,
    edgeCount: 0,
    fileCount: 0,
  };
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());
    codeGraph = {
      status: freshness,
      lastScan: stats.lastScanTimestamp,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      fileCount: stats.totalFiles,
    };
    // Graph status hints deferred to structural contract (Phase 027)
    // — structural context hints at lines 128-130 provide preferred recovery path
  } catch {
    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
  }

  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
  const cocoIndex: CocoIndexStatus = {
    available: isCocoIndexAvailable(),
    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
  };
  if (!cocoIndex.available) {
    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
  }

  // Phase 027: Structural bootstrap contract for resume surface
  const structuralContext = buildStructuralBootstrapContract('session_resume');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
  }

  const structuralTrust = buildStructuralContextTrust(structuralContext);

  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
  const cachedSummaryDecision = getCachedSessionSummaryDecision({
    specFolder: args.specFolder,
    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
  });
  if (cachedSummaryDecision.status === 'accepted') {
    hints.push('Cached continuity summary accepted as additive resume context.');
  } else {
    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
  }

  let sessionQuality: SessionResumeResult['sessionQuality'];
  if (args.minimal) {
    try {
      sessionQuality = computeQualityScore().level;
    } catch {
      sessionQuality = 'unknown';
    }
  }

  const memoryCertainty: SharedPayloadCertainty = args.minimal
    ? 'defaulted'
    : memoryResult.error
      ? 'unknown'
      : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
  const structuralCertainty: SharedPayloadCertainty = 'exact';

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'memory-resume',
      title: 'Memory Resume',
      content: summarizeUnknown(memoryResult),
      source: 'memory',
      certainty: memoryCertainty,
    },
  ];
  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummaryDecision.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
      ].join('\n'),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'code-graph-status',
      title: 'Code Graph Status',
      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
      source: 'code-graph',
      certainty: codeGraphCertainty,
    },
    {
      key: 'cocoindex-status',
      title: 'CocoIndex Status',
      content: cocoIndex.available
        ? `available at ${cocoIndex.binaryPath}`
        : `unavailable; expected at ${cocoIndex.binaryPath}`,
      source: 'semantic',
      certainty: cocoIndexCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust,
    },
  );

  // ── Build composite result ──────────────────────────────────
  const payloadContract = createSharedPayloadEnvelope({
    kind: 'resume',
    sections: payloadSections,
    summary: `Resume payload: ${summarizeCertaintyContract([
      { label: 'memory', certainty: memoryCertainty },
      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
      { label: 'graph', certainty: codeGraphCertainty },
      { label: 'cocoindex', certainty: cocoIndexCertainty },
      { label: 'structural', certainty: structuralCertainty },
    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: codeGraph.status as GraphFreshness,
    sourceSurface: 'session_resume',
  });

  const result: SessionResumeResult = {
    memory: memoryResult,
    codeGraph,
    cocoIndex,
    cachedSummary: cachedSummaryDecision,
    structuralContext,
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      resumePayload: payloadContract,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    ...(sessionQuality ? { sessionQuality } : {}),
    hints,
  };

  // Phase 024 / Item 9: Record bootstrap telemetry
  if (!args.minimal) {
    recordBootstrapEvent(
      'tool',
      Date.now() - startMs,
      'full',
    );
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}

exec
/bin/zsh -lc "sed -n '210,320p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '760,860p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts && printf '\\n---\\n' && sed -n '1420,1465p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
export function buildStructuralBootstrapContract(
  sourceSurface: StructuralBootstrapContract['sourceSurface']
): StructuralBootstrapContract {
  const graphFreshness = resolveGraphFreshness();

  let status: StructuralBootstrapContract['status'];
  if (graphFreshness === 'fresh') {
    status = 'ready';
  } else if (graphFreshness === 'stale') {
    status = 'stale';
  } else {
    status = 'missing';
  }

  let summary: string;
  let highlights: string[] | undefined;

  if (status === 'ready') {
    try {
      const stats = getGraphStats();
      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
      const topKinds = Object.entries(stats.nodesByKind)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      if (topKinds.length > 0) {
        highlights = topKinds.map(([kind, count]) => `${kind}: ${count}`);
      }
    } catch {
      summary = 'Code graph available (structural context ready)';
    }
  } else if (status === 'stale') {
    try {
      const stats = getGraphStats();
      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
    } catch {
      summary = 'Code graph data is stale — structural context may be outdated';
    }
  } else {
    summary = 'No structural context available — code graph is empty or unavailable';
  }

  let recommendedAction: string;
  if (status === 'ready') {
    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
  } else if (status === 'stale') {
    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
  } else {
    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
  }

  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);

  return {
    status,
    summary: fittedContract.summary,
    highlights: fittedContract.highlights,
    recommendedAction: fittedContract.recommendedAction,
    sourceSurface,
    provenance: {
      producer: 'session_snapshot',
      sourceSurface,
      trustState: trustStateFromStructuralStatus(status),
      generatedAt: new Date().toISOString(),
      lastUpdated: status === 'ready' || status === 'stale'
        ? (() => {
          try {
            const stats = getGraphStats();
            return stats.lastScanTimestamp ?? null;
          } catch {
            return null;
          }
        })()
        : null,
      sourceRefs: ['code-graph-db', 'session-snapshot'],
    },
  };
}

 succeeded in 0ms:
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

---

  // T205: Determine effective token budget from mode or layer definitions
  const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
  const effectiveBudget = modeTokenBudget || tokenBudget;

  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
  // so the final response respects the advertised token budget.
  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
    ? attachSessionTransitionTrace(
      result as ContextResult & { content?: Array<{ text?: string; type?: string }> },
      sessionTransition,
    ) as ContextResult
    : result;

  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
    if (resumeContextItems.length > 0) {
      sessionLifecycle.resumedContextCount = resumeContextItems.length;
      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
        memoryId: item.memoryId,
        title: item.title,
        filePath: item.filePath,
        attentionScore: item.attentionScore,
      }));
      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
    }
  }

  // T205: Enforce token budget AFTER all context injection
  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
  const tracedResult = budgetedResult;

  // Phase 020: Attach graph context and query-intent routing metadata
  const responseData: ContextResult & Record<string, unknown> = { ...tracedResult };
  if (graphContextResult) {
    responseData.graphContext = graphContextResult;
  }
  if (queryIntentMetadata) {
    responseData.queryIntentRouting = queryIntentMetadata;
  }
  const structuralRoutingNudge = buildStructuralRoutingNudge(
    normalizedInput,
    queryIntentMetadata,
    graphContextResult,
  );
  if (structuralRoutingNudge) {

codex
A clearer pattern is emerging: Mex’s strongest value is not just more checks, it’s that the checks are organized into an operator loop with authoritative markdown surfaces at the center. I’m checking our freshness and repair paths now, because the likely recommendation is a shift in architecture around health/bootstrapping rather than a pile of isolated new validators.
exec
/bin/zsh -lc "rg -n \"stale|staleness|freshness|last_updated|git history|commits since|days since|drift score|repair|autoRepair|checklist\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:118:// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:175:    codeGraphStatus: 'fresh' | 'stale' | 'empty';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:194:  staleCount: number;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379:// Safe for stdio (single client). TTL in query-flow-tracker bounds staleness.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:712:      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:731:      staleCount: pending + failed + retry,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:751:  const staleWarning = stats.staleCount > 10
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:757:    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:761:    staleWarning.trim(),
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:798:    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1191:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1313:          staleDeleted: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1314:          staleDeleteFailed: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1561:  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1843:                    staleDeleted: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1844:                    staleDeleteFailed: 0,
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:223:| `SPECKIT_ARCHIVAL` | `true` | boolean | Archival manager for aging out stale memories (90-day max age). Graduated ON. | `lib/cognitive/archival-manager.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:227:| `SPECKIT_CONSOLIDATION` | `true` | boolean | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection (N3-lite). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh:23:  for template in spec.md plan.md tasks.md checklist.md decision-record.md implementation-summary.md; do
.opencode/skill/system-spec-kit/scripts/common.sh:152:    printf 'CHECKLISTS_DIR=%q\n' "$feature_dir/checklists"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:55:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:115:  } else if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:122:  if (healthStatus === 'warning' || healthStatus === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:196:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:317:      : structuralContext.status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:318:        ? 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:70:- `memory-index.ts` and `mutation-hooks.ts` work together so index, update, and stale-delete flows clear trigger, constitutional, graph, co-activation, and degree caches.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:80:- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:632:  // Otherwise stale trigger/tool-cache entries persist until next non-chunked save.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:37: * Finds spec.md, plan.md, tasks.md, checklist.md, decision-record.md,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:148:      const hasChecklist = siblings.includes('checklist.md');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:197:// Track stale session cleanup interval (runs hourly)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:198:let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:234:  // Run stale session cleanup on startup and set up hourly interval
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:239:    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:242:  if (staleCleanupInterval) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:243:    clearInterval(staleCleanupInterval);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:245:  staleCleanupInterval = setInterval(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:250:      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:253:  if (staleCleanupInterval && typeof staleCleanupInterval === 'object' && 'unref' in staleCleanupInterval) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:254:    staleCleanupInterval.unref();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:758: * T302: Clean up stale sessions across all session-related tables.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:782:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:795:  // 2. Clean stale session_sent_memories entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1382:  if (staleCleanupInterval) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1383:    clearInterval(staleCleanupInterval);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1384:    staleCleanupInterval = null;
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:31:  --repair-failures <n>          Fail repair step n times before success
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:53:            --repair-failures)
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:54:                [[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:86:    ops_require_uint "repair_failures" "$REPAIR_FAILURES"
.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:101:        "node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay" || exit 1
.opencode/skill/system-spec-kit/scripts/utils/README.md:57:| **Validation Utilities** | Path-scoped rule validation and checklist verification |
.opencode/skill/system-spec-kit/scripts/utils/README.md:147:├── validation-utils.ts        # Path-scoped validation and checklist verification
.opencode/skill/system-spec-kit/scripts/utils/README.md:200:| `validation-utils.ts` | Validates spec folders against path-scoped rules. Verifies checklist completeness |
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:471:    { name: 'checklist.md', role: 'QA checklist' },
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:6:# against the current template version. Reports stale folders.
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:9:#   check-template-staleness.sh [--json] [--auto-upgrade] [--root <path>]
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:13:#   1 - stale folders found
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:42:check-template-staleness.sh — Detect spec folders with outdated template versions
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:44:Usage: check-template-staleness.sh [--json] [--auto-upgrade] [--root <path>]
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:48:  --auto-upgrade   Apply safe auto-fixes to stale folders (update version comment)
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:124:    local current_count=0 stale_count=0 none_count=0 missing_count=0
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:125:    local stale_folders=()
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:154:            "none") ((none_count++)) || true; stale_folders+=("$folder_name ($version)") ;;
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:156:            *) ((stale_count++)) || true; stale_folders+=("$folder_name ($version)")
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:164:                           spec.md|plan.md|tasks.md|checklist.md|decision-record.md|implementation-summary.md)
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:179:        local stale_json="["
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:181:        for s in "${stale_folders[@]+"${stale_folders[@]}"}"; do
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:182:            $first && first=false || stale_json+=","
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:183:            stale_json+="\"$s\""
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:185:        stale_json+="]"
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:198:{"current_version":"$current_version","total":$total,"current":$current_count,"stale":$stale_count,"no_version":$none_count,"missing_spec":$missing_count,"versions":$versions_json,"stale_folders":$stale_json}
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:220:        if [[ ${#stale_folders[@]} -gt 0 ]]; then
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:222:            for s in "${stale_folders[@]}"; do
.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh:234:    [[ $stale_count -gt 0 || $none_count -gt 0 ]] && exit 1
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:992:    // Data integrity: clean stale auto-entities before re-extraction on update
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:998:        console.error(`[memory-save] Cleaned stale auto-entities for superseded memory #${existing.id}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1007:        console.error(`[memory-save] Cleaned stale auto-entities for PE-superseded memory #${peResult.supersededId}`);
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:124:count_checklist_items() {
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:125:    local checklist_file="$1"
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:201:    done < "$checklist_file"
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:322:        echo -e "    ${GREEN}✓${NC} Priority context present for all checklist items"
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:357:            echo -e "  Missing priority context on checklist items. Add P0/P1/P2 headers or inline tags." >&2
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:375:    local checklist_file="$FOLDER_PATH/checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:377:    if [[ ! -f "$checklist_file" ]]; then
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:379:            echo '{"error": "checklist.md not found", "folder": "'"$FOLDER_PATH"'"}'
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:381:            echo -e "${YELLOW}⚠${NC} No checklist.md found in $FOLDER_PATH"
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:382:            echo "  This may be a Level 1 spec (checklist not required)."
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:383:            echo "  Create checklist.md for Level 2+ enforcement."
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:388:    count_checklist_items "$checklist_file"
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:5:// Aggregates metrics, graph freshness, and priming status into a
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:25:  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:39:  status: 'ready' | 'stale' | 'missing';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:152:  // Graph freshness
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:218:  } else if (graphFreshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:219:    status = 'stale';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:240:  } else if (status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:245:      summary = 'Code graph data is stale — structural context may be outdated';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:254:  } else if (status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:273:      lastUpdated: status === 'ready' || status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:5:// readiness, code graph freshness, and priming status.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:33:type SessionStatus = 'ok' | 'warning' | 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:38:  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:76:  // Determine graph freshness
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:92:        graphFreshness = 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:110:    status = 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:111:  } else if (graphFreshness === 'stale' || graphFreshness === 'empty' || lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:122:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:31:  --repair-failures <n>          Fail repair step n times before success
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:57:            --repair-failures)
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:58:                [[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }
.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh:90:    ops_require_uint "repair_failures" "$REPAIR_FAILURES"
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:288:function determineSessionPhase(taskStats: TaskStats, checklistStats: ChecklistStats, planPhase: string, status: string): string {
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:290:  if (taskStats?.percent === 100 && (!checklistStats || checklistStats.passed === checklistStats.total)) return 'complete';
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:291:  if ((checklistStats && checklistStats.total > 0 && checklistStats.passed < checklistStats.total) || taskStats?.percent === 100) return 'testing';
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:314:  const checklist = parseChecklistDoc(readDoc(specFolderPath, 'checklist.md'));
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:359:    ...(checklist ? [{
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:362:      narrative: `Checklist progress P0 ${checklist.p0}, P1 ${checklist.p1}, P2 ${checklist.p2}.`,
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:364:      facts: [`passed=${checklist.passed}`, `total=${checklist.total}`],
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:370:  const structuralTypes = ['progress', 'checklist', 'phase', 'status'];
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:392:    sessionPhase: determineSessionPhase(tasks, checklist, plan.phaseTitle, String(description.status || '')),
.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh:29:  'checklist.md'
.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh:118:    checklist) echo "$MIN_WORDS_CHECKLIST" ;;
.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh:159:    checklist) required_sections=("\- \[ \]") ;;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:34:    graphFreshness: number; // 1.0 fresh, 0.5 stale, 0.0 empty
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:84:// Matches the session-snapshot graph staleness threshold.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:178:/** Compute graph freshness: 1.0 fresh, 0.5 stale, 0.0 empty/error. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:217:  //   recency (0.35)       — Highest weight because stale sessions are the primary
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:228:  //   graphFreshness (0.20) — A stale code graph means structural queries return
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:30:// Feature catalog: Memory health autoRepair metadata
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:245:    autoRepair = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:267:  if (typeof autoRepair !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:270:      error: 'autoRepair must be a boolean',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:348:    if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:349:      hints.push('autoRepair is only applied in reportMode="full"');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:384:  const repair = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:385:    requested: autoRepair,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:387:    repaired: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:397:    repair.attempted = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:419:  const repairActions = [
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426:  if (autoRepair && !confirmed) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:429:      summary: 'Confirmation required before auto-repair actions are executed',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:433:        autoRepairRequested: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:435:        actions: repairActions,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:465:        if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:468:            repair.actions.push('fts_rebuild');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:471:            repair.actions.push('trigger_cache_refresh');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:473:            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:474:            if (memoryCountRow.count === repairedFtsCountRow.count) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:476:              repair.actions.push('fts_consistency_verified');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:477:              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:480:              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:481:              repair.warnings.push(warning);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:482:              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:484:          } catch (repairError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:485:            const message = toErrorMessage(repairError);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:487:            repair.errors.push(sanitizeErrorForHint(message));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:488:            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:495:      if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:497:        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:502:  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:504:  if (autoRepair && database) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:511:        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:512:        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:516:      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:520:  if (autoRepair && database) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:528:        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:529:        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:534:        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:535:        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:545:        repair.warnings.push(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:546:          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:553:      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:557:  if (repair.attempted) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:558:    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:559:    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:582:      repair,
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:38:  --repair-failures <n>          Fail repair step n times before success
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:60:            --repair-failures)
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:61:                [[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:93:    ops_require_uint "repair_failures" "$REPAIR_FAILURES"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:9:#   L1 → L2:  Add checklist.md, NFR/Edge/Complexity sections to spec.md, plan.md sections
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:11:#   L3 → L3+: Add governance sections to spec.md, plan.md, checklist.md
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:114:  L1 → L2:   Adds checklist.md, NFR/Edge/Complexity sections, effort estimation
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:116:  L3 → L3+:  Adds governance sections, extended checklist, AI execution framework
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:241:    [[ -f "$folder/checklist.md" ]] && { CURRENT_LEVEL=2; LEVEL_METHOD="inferred"; return; }
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:619:upgrade_checklist() {
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:625:        verbose "No checklist extension needed for L${from_level} → L${to_level}"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:629:    local checklist_file="$SPEC_FOLDER/checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:630:    local fragment_path="${ADDENDUM_L3PLUS}/checklist-extended.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:632:    if [[ ! -f "$checklist_file" ]]; then
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:633:        warn "checklist.md not found in $SPEC_FOLDER — skipping checklist upgrade"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:643:    if grep -qF "## L3+: ARCHITECTURE VERIFICATION" "$checklist_file" 2>/dev/null; then
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:644:        info "checklist.md already contains L3+ sections — skipping"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:649:        info "DRY RUN: Would append checklist-extended.md to checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:653:    verbose "Appending extended checklist sections to checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:665:    local tmp_file="${checklist_file}.tmp"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:667:    insert_before_line=$(find_insert_point "$checklist_file")
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:672:            head -n $((insert_before_line - 1)) "$checklist_file"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:674:            tail -n +"${insert_before_line}" "$checklist_file"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:677:        verbose "Appending to end of checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:679:            cat "$checklist_file"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:684:    mv "$tmp_file" "$checklist_file"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:685:    MODIFIED_FILES+=("checklist.md")
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:686:    verbose "checklist.md upgraded successfully"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:700:            # L1→L2: Create checklist.md from full template
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:701:            local checklist_src="${ADDENDUM_L2}/checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:702:            local checklist_dest="$SPEC_FOLDER/checklist.md"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:704:            if [[ -f "$checklist_dest" ]]; then
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:705:                info "checklist.md already exists — skipping creation"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:709:            if [[ ! -f "$checklist_src" ]]; then
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:710:                warn "Checklist template not found: $checklist_src"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:715:                info "DRY RUN: Would create checklist.md from template"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:719:            verbose "Creating checklist.md from template"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:720:            cp "$checklist_src" "$checklist_dest"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:721:            CREATED_FILES+=("checklist.md")
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1398:    # Step 1: Create new files (checklist.md for L1→L2, decision-record.md for L2→L3)
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1419:    # Step 4: Upgrade checklist.md (only meaningful for L3→L3+)
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1420:    verbose "Step 4/5: Upgrading checklist.md for L${from_level} → L${to_level}"
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1421:    if ! upgrade_checklist "$from_level" "$to_level"; then
.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1422:        warn "checklist.md upgrade failed for L${from_level} → L${to_level}"
.opencode/skill/system-spec-kit/scripts/ops/README.md:137:- `--repair-failures <n>`
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:134:function repairBm25Document(args: {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:154:  } catch (repairErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:155:    const repairMessage = toErrorMessage(repairErr);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:156:    console.warn(`[memory-save] Immediate BM25 repair failed (${args.contextLabel}): ${repairMessage}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:157:    return `BM25 repair failed after ${args.contextLabel} for memory ${args.memoryId}: ${repairMessage}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:287:                    const bm25Warning = repairBm25Document({
.opencode/skill/system-spec-kit/scripts/extractors/README.md:40:- `git-context-extractor.ts` - Mines git history for captured-session enrichment (spec 013)
.opencode/skill/system-spec-kit/scripts/spec/create.sh:16:#   L2: +Quality gates, verification - checklist.md
.opencode/skill/system-spec-kit/scripts/spec/create.sh:231:            echo "    Adds: checklist.md, NFRs, edge cases, effort estimation"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1195:           echo "    ✓ +Verify: checklist.md, NFRs, edge cases, effort estimation"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1198:           echo "    ✓ +Verify: checklist.md, NFRs, edge cases"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1215:    [[ "${DOC_LEVEL/+/}" -ge 2 ]] && echo "    4. Add verification items to checklist.md"
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:131:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh:31:  --repair-failures <n>          Fail repair step n times before success
.opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh:53:            --repair-failures)
.opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh:54:                [[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }
.opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh:86:    ops_require_uint "repair_failures" "$REPAIR_FAILURES"
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:103:      // Data integrity: clean stale auto-entities before re-extraction on update
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:20:// Artifact-class routing (spec/plan/tasks/checklist/memory)
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:62:  if (readiness.freshness === 'fresh') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:66:      freshnessAuthority: 'live',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:70:  if (readiness.freshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:74:      freshnessAuthority: 'stale',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:81:    freshnessAuthority: 'unknown',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:320:    freshness: 'empty' as const,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:333:    // Non-blocking: continue with potentially stale data
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:453:        `-${consolidation.hebbian.decayed} decayed, ${consolidation.stale.flagged} stale flagged`
.opencode/skill/system-spec-kit/scripts/spec/README.md:40:- `calculate-completeness.sh` - compute checklist completion metrics
.opencode/skill/system-spec-kit/scripts/spec/README.md:42:- `archive.sh` - archive completed or stale specs

exec
/bin/zsh -lc "rg -n \"pattern|patterns/|INDEX.md|Current Project State|router|ROUTER.md|AGENTS.md\" .opencode/skill/system-spec-kit .opencode/command .codex/agents .opencode/agent | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.codex/agents/debug.toml:130:3. Identify related patterns in codebase
.codex/agents/debug.toml:257:| Find similar patterns    | `Grep`                | Glob + Read         |
.codex/agents/debug.toml:270:    ├─► Find working examples → Grep(similar pattern)
.opencode/agent/orchestrate.md:93:| 1        | ALL codebase exploration, file search, pattern discovery, context loading | `@context`             | LEAF | Memory tools, Glob, Grep, Read                                                    | `"general"`   |
.opencode/agent/orchestrate.md:235:| **low**    | Single file, < 50 LOC, no dependencies, well-understood pattern | FAST PATH: Skip ceremony, minimal tool calls, direct output |
.opencode/agent/orchestrate.md:236:| **medium** | 2-5 files, 50-300 LOC, some dependencies, standard patterns     | Normal workflow with all steps                              |
.opencode/agent/orchestrate.md:237:| **high**   | 6+ files, 300+ LOC, cross-cutting concerns, novel patterns      | Full process with PDR, verification, evidence               |
.opencode/agent/orchestrate.md:312:├─ Scope: Build new system using patterns from Task #1
.opencode/agent/orchestrate.md:326:**Action:** MUST delegate to `@context` first to gather context and patterns.
.opencode/agent/orchestrate.md:333:   - Spec folder path matches `specs/[###-name]/` or `.opencode/specs/[###-name]/` pattern
.opencode/agent/orchestrate.md:343:4. If none exists (or user selected Option B), delegate to `@context` to discover patterns for the new spec.
.opencode/agent/orchestrate.md:352:**Trigger:** Any task requiring codebase exploration, file search, or pattern discovery.
.opencode/agent/orchestrate.md:524:2. Re-read AGENTS.md and any project configuration files
.opencode/agent/orchestrate.md:581:| **Agent dispatches** | **5+**          | **Enforce CWB (§8), use collection patterns (§8)** |
.opencode/agent/orchestrate.md:657:| Grep search       | 1          | `Grep("pattern")`           |
.opencode/agent/orchestrate.md:705:| System overhead           | ~25K tokens      | System prompt, AGENTS.md, etc.              |
.opencode/agent/orchestrate.md:761:- Lost context leads to incorrect assumptions. Stop, re-read AGENTS.md, summarize state, and wait for confirmation before proceeding. See §6 Session Recovery Protocol.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:309:  if (NON_STRUCTURAL_SUPPRESS_PATTERNS.some((pattern) => pattern.test(normalizedTask))) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:313:  if (!STRUCTURAL_MISFIRE_PATTERNS.some((pattern) => pattern.test(normalizedTask))) {
.codex/agents/write.toml:117:- ALL H2 headers match pattern `## N. [emoji] TITLE` with sequential numbering
.codex/agents/write.toml:197:| **3: ASCII Flowcharts**   | Creating diagrams                 | 7 patterns (linear, decision, parallel, nested, approval, loop, pipeline) → Validate with validate_flowchart.sh | N/A             |
.codex/agents/write.toml:290:**SELF-VALIDATION**: Re-read all created files before reporting. Compare H2 headers against template (emoji verification). Scan for placeholders: `Grep({ pattern: "\[INSERT|\[TODO|TBD|Coming soon", path: "/path/to/file.md" })`.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:218:| `SPECKIT_COACTIVATION` | `true` | boolean | Co-activation pattern matching for related memory surfacing. Graduated ON. | `lib/cognitive/co-activation.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:220:| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | (built-in) | string | Custom regex pattern for co-activation matching. Validated for safety. | `configs/cognitive.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:221:| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | (built-in) | string | Regex flags for the co-activation pattern (e.g., `gi`). Validated. | `configs/cognitive.ts` |
.opencode/agent/review.md:3:description: Code review specialist with pattern validation, quality scoring, and standards enforcement for PRs and code changes
.opencode/agent/review.md:24:Read-only code review specialist providing quality scoring, pattern validation, security assessment, and standards enforcement for PRs and code changes across any codebase.
.opencode/agent/review.md:49:   - Content search: Use `Grep` to find patterns and keywords
.opencode/agent/review.md:50:   - File discovery: Use `Glob` to locate files by pattern
.opencode/agent/review.md:52:   - Manual security review: Check for common vulnerability patterns
.opencode/agent/review.md:85:| `Grep` | Pattern search      | Find code patterns, keywords, TODOs  |
.opencode/agent/review.md:86:| `Glob` | File discovery      | Locate files by extension or pattern |
.opencode/agent/review.md:106:| **2: Pre-Commit**      | Local changes (git diff, uncommitted) | Quick validation, pattern compliance, P0 blocker identification          | Commit Readiness Report |
.opencode/agent/review.md:120:| **Patterns**        | 20     | Project pattern compliance, style guide adherence |
.opencode/agent/review.md:138:| **P1**   | REQUIRED   | Logic error, pattern violation         | Must fix to pass |
.opencode/agent/review.md:146:| **Security** (25)        | No vulnerabilities, follows patterns      | Minor exposure, mitigatable | Moderate vulnerabilities                     | Critical (injection, auth bypass)    |
.opencode/agent/review.md:174:[ ] Follows project initialization patterns
.opencode/agent/review.md:178:[ ] Event handling follows project patterns
.opencode/agent/review.md:188:[ ] No N+1 query patterns
.opencode/agent/review.md:220:After loading `sk-code` baseline, load one overlay skill and apply project-specific patterns:
.opencode/agent/review.md:224:[ ] Code follows project initialization patterns
.opencode/agent/review.md:228:[ ] State management follows established patterns
.opencode/agent/review.md:243:**Output**: pass (bool), score (0-100), breakdown (correctness/security/patterns/maintainability/performance), blockers (P0), required (P1), suggestions (P2), revision_guidance, confidence (HIGH/MEDIUM/LOW)
.opencode/agent/review.md:249:| **pre_execution**  | Before task starts | Scope validation, pattern check   |
.opencode/agent/review.md:256:- Report pattern to orchestrator
.opencode/agent/review.md:291:- Adapt to project-specific patterns when discoverable
.opencode/agent/review.md:300:- Ignore project patterns in favor of general best practices (when patterns exist)
.opencode/agent/review.md:309:- Pattern compliance unclear (request pattern documentation)
.opencode/agent/review.md:323:- Pattern violations cite actual project patterns (not generic claims)
.opencode/agent/review.md:331:| **P1**   | File:line + pattern reference              |
.opencode/agent/review.md:376:- Ask: "Is this a project pattern, not a bug?", "Is severity inflated?", "Am I seeing phantom issues?"
.opencode/agent/review.md:418:- Project patterns override general best practices
.opencode/agent/review.md:420:- Ask for pattern documentation if unclear
.opencode/agent/review.md:455:│  ├─► Read-only quality, security, and pattern review                    │
.opencode/agent/review.md:466:│  ├─► 2. Analyze code, risks, and pattern compliance                     │
.codex/agents/orchestrate.toml:100:| 1        | LEAF-only retrieval agent for all codebase exploration, file search, pattern discovery, and context loading | `@context`             | LEAF | Memory tools, Glob, Grep, Read                                       | `"general"`   |
.codex/agents/orchestrate.toml:175:| @context     | `.codex/agents/context.toml`     | LEAF-only retrieval agent for all codebase exploration, file search, pattern discovery, and context loading |
.codex/agents/orchestrate.toml:242:| **low**    | Single file, < 50 LOC, no dependencies, well-understood pattern | FAST PATH: Skip ceremony, minimal tool calls, direct output |
.codex/agents/orchestrate.toml:243:| **medium** | 2-5 files, 50-300 LOC, some dependencies, standard patterns     | Normal workflow with all steps                              |
.codex/agents/orchestrate.toml:244:| **high**   | 6+ files, 300+ LOC, cross-cutting concerns, novel patterns      | Full process with PDR, verification, evidence               |
.codex/agents/orchestrate.toml:319:├─ Scope: Build new system using patterns from Task #1
.codex/agents/orchestrate.toml:333:**Action:** MUST delegate to `@context` first to gather context and patterns.
.codex/agents/orchestrate.toml:340:   - Spec folder path matches `specs/[###-name]/` or `.opencode/specs/[###-name]/` pattern
.codex/agents/orchestrate.toml:350:4. If none exists (or user selected Option B), delegate to `@context` to discover patterns for the new spec.
.codex/agents/orchestrate.toml:359:**Trigger:** Any task requiring codebase exploration, file search, or pattern discovery.
.codex/agents/orchestrate.toml:426:The @context agent runs on Haiku for speed (~2x faster than Sonnet). Based on spec 012 testing, be aware of these Haiku-specific patterns when evaluating Context Package returns:
.codex/agents/orchestrate.toml:434:> These are tendencies, not guarantees. Haiku scores 4.0+/5 on average quality. Only the missing-sections pattern warrants automatic retry.
.codex/agents/orchestrate.toml:545:2. Re-read AGENTS.md and any project configuration files
.codex/agents/orchestrate.toml:602:| **Agent dispatches** | **7+**          | **Enforce CWB (§8), use collection patterns (§8)** |
.codex/agents/orchestrate.toml:678:| Grep search       | 1          | `Grep("pattern")`           |
.codex/agents/orchestrate.toml:726:| System overhead           | ~25K tokens      | System prompt, AGENTS.md, etc.              |
.codex/agents/orchestrate.toml:785:- Lost context leads to incorrect assumptions. Stop, re-read AGENTS.md, summarize state, and wait for confirmation before proceeding. See §6 Session Recovery Protocol.
.opencode/agent/deep-research.md:105:| Grep | Find code patterns in codebase | Search for implementation examples |
.opencode/agent/deep-research.md:227:| Grep | Code pattern search | 1-2 calls |
.codex/agents/deep-research.toml:92:| Grep | Find code patterns in codebase | Search for implementation examples |
.codex/agents/deep-research.toml:214:| Grep | Code pattern search | 1-2 calls |
.codex/agents/review.toml:11:Read-only code review specialist providing quality scoring, pattern validation, security assessment, and standards enforcement for PRs and code changes across any codebase.
.codex/agents/review.toml:36:   - Content search: Use `Grep` to find patterns and keywords
.codex/agents/review.toml:37:   - File discovery: Use `Glob` to locate files by pattern
.codex/agents/review.toml:39:   - Manual security review: Check for common vulnerability patterns
.codex/agents/review.toml:74:| `Grep` | Pattern search      | Find code patterns, keywords, TODOs  |
.codex/agents/review.toml:75:| `Glob` | File discovery      | Locate files by extension or pattern |
.codex/agents/review.toml:95:| **2: Pre-Commit**      | Local changes (git diff, uncommitted) | Quick validation, pattern compliance, P0 blocker identification          | Commit Readiness Report |
.codex/agents/review.toml:109:| **Patterns**        | 20     | Project pattern compliance, style guide adherence |
.codex/agents/review.toml:127:| **P1**   | REQUIRED   | Logic error, pattern violation         | Must fix to pass |
.codex/agents/review.toml:135:| **Security** (25)        | No vulnerabilities, follows patterns      | Minor exposure, mitigatable | Moderate vulnerabilities                     | Critical (injection, auth bypass)    |
.codex/agents/review.toml:163:[ ] Follows project initialization patterns
.codex/agents/review.toml:167:[ ] Event handling follows project patterns
.codex/agents/review.toml:177:[ ] No N+1 query patterns
.codex/agents/review.toml:209:After loading `sk-code` baseline, load one overlay skill and apply project-specific patterns:
.codex/agents/review.toml:213:[ ] Code follows project initialization patterns
.codex/agents/review.toml:217:[ ] State management follows established patterns
.codex/agents/review.toml:232:**Output**: pass (bool), score (0-100), breakdown (correctness/security/patterns/maintainability/performance), blockers (P0), required (P1), suggestions (P2), revision_guidance, confidence (HIGH/MEDIUM/LOW)
.codex/agents/review.toml:238:| **pre_execution**  | Before task starts | Scope validation, pattern check   |
.codex/agents/review.toml:245:- Report pattern to orchestrator
.codex/agents/review.toml:280:- Adapt to project-specific patterns when discoverable
.codex/agents/review.toml:289:- Ignore project patterns in favor of general best practices (when patterns exist)
.codex/agents/review.toml:298:- Pattern compliance unclear (request pattern documentation)
.codex/agents/review.toml:312:- Pattern violations cite actual project patterns (not generic claims)
.codex/agents/review.toml:320:| **P1**   | File:line + pattern reference              |
.codex/agents/review.toml:365:- Ask: "Is this a project pattern, not a bug?", "Is severity inflated?", "Am I seeing phantom issues?"
.codex/agents/review.toml:406:- Project patterns override general best practices
.codex/agents/review.toml:408:- Ask for pattern documentation if unclear
.codex/agents/review.toml:443:│  ├─► Read-only quality, security, and pattern review                    │
.codex/agents/review.toml:454:│  ├─► 2. Analyze code, risks, and pattern compliance                     │
.opencode/agent/debug.md:143:3. Identify related patterns in codebase
.opencode/agent/debug.md:270:| Find similar patterns    | `Grep`                | Glob + Read         |
.opencode/agent/debug.md:283:    ├─► Find working examples → Grep(similar pattern)
.codex/agents/deep-review.toml:90:| Grep | Find patterns indicating issues | Search for auth patterns, error handling |
.codex/agents/deep-review.toml:96:- **Correctness**: Read logic flows, grep for error handling patterns, and test edge cases against observable intent.
.codex/agents/deep-review.toml:97:- **Security**: Grep for auth patterns, input validation, data exposure, and sensitive state transitions.
.codex/agents/deep-review.toml:99:- **Maintainability**: Read for pattern drift, documentation clarity, and ease of safe follow-on changes.
.codex/agents/deep-review.toml:396:- Ask: "Is this a project pattern, not a bug?", "Is severity inflated?", "Am I seeing phantom issues?"
.codex/agents/speckit.toml:36:This agent is typically invoked from **Gate 3 Option B** ("Create new spec folder") or **Gate 3 Option E** ("Phase folder") in AGENTS.md.
.codex/agents/speckit.toml:54:- Spec folder path doesn't match `specs/[###-name]/` or `.opencode/specs/[###-name]/` pattern
.opencode/agent/speckit.md:48:This agent is typically invoked from **Gate 3 Option B** ("Create new spec folder") or **Gate 3 Option E** ("Phase folder") in AGENTS.md.
.opencode/agent/speckit.md:66:- Spec folder path doesn't match `specs/[###-name]/` or `.opencode/specs/[###-name]/` pattern
.opencode/agent/ultra-think.md:80:| `Grep`                  | Pattern search                 | Finding relevant code patterns         |
.opencode/agent/ultra-think.md:85:| `memory_search`         | Hybrid memory search           | Finding prior decisions and patterns   |
.opencode/agent/ultra-think.md:229:| Integration  | 15%    | Fits existing codebase patterns          | 15=seamless, 10=compatible, 5=minor friction, 0=conflicts |
.opencode/agent/ultra-think.md:293:- Run identical subagent attempts (the Multi-Think anti-pattern)
.opencode/agent/ultra-think.md:456:| **Subjective Picking**       | Bias toward familiar patterns, ignores scoring            | Apply the 5-dimension rubric to ALL strategies     |
.opencode/agent/context.md:27:Read-only context retrieval agent. The **exclusive entry point for ALL exploration tasks** — every codebase search, file discovery, pattern analysis, and context retrieval routes through this agent. Gathers structured Context Packages before implementation begins. Executes retrieval directly and NEVER performs nested delegation. NEVER writes, edits, creates, or deletes files.
.opencode/agent/context.md:63:| `Glob`                  | Codebase    | File discovery by pattern | Find files matching name/extension   |
.opencode/agent/context.md:64:| `Grep`                  | Codebase    | Text/code pattern search  | Find keywords, function calls, usage |
.opencode/agent/context.md:83:    │   └─► Glob → find files by pattern
.opencode/agent/context.md:86:    │   └─► Grep → search for text patterns
.opencode/agent/context.md:121:**Tool Sequence**: `memory_match_triggers` → `memory_context(deep)` → `code_graph_status()` → `memory_search(includeContent)` → `code_graph_query/context` for structural questions → `CocoIndex search` (1-3 concept queries) → `Glob` (5-10 patterns) → `Grep` (3-5 patterns) → `Read` (5-8 key files) → spec folder analysis → `memory_list(specFolder)`
.opencode/agent/context.md:123:**Returns**: Full memory context (prior decisions, patterns, session history), comprehensive file map with dependency relationships, detailed code pattern analysis, spec folder status (documentation state, task completion), related spec folders, cross-references between memory and codebase findings.
.opencode/agent/context.md:137:**Why First**: Costs almost nothing (~2 tool calls, <5 seconds). Immediately surfaces prior decisions, saved patterns, session context from previous work, and constitutional rules.
.opencode/agent/context.md:151:- **CocoIndex** — Semantic search for concept-based discovery. Use 1-3 short queries (3-5 words). Examples: `ccc search "authentication middleware"`, `ccc search "error handling patterns"`. Set `refresh_index=false` after first query.
.opencode/agent/context.md:152:- **Glob** — Cast a wide net for file discovery. Use 5-10 patterns. Examples: `src/**/*auth*`, `**/*.config.*`, `*.md`
.opencode/agent/context.md:156:**Output**: File map, pattern locations, and summarized key file contents.
.opencode/agent/context.md:209:[File locations, patterns found, code structure]
.opencode/agent/context.md:210:- `path/to/file.ext` — [Purpose/relevance, key patterns at lines X-Y]
.opencode/agent/context.md:212:- Pattern: [Convention or architecture pattern detected]
.opencode/agent/context.md:215:[Conventions detected, architecture patterns, naming schemes]
.opencode/agent/context.md:217:- Architecture: [e.g., "middleware pattern, service layer separation"]
.opencode/agent/context.md:266:| Rule 2: Spec Folder       | New spec folder needed          | Discover patterns for new spec       |
.opencode/agent/context.md:274:Explore everything related to the authentication system — codebase patterns,
.opencode/agent/context.md:307:| NEVER claim patterns/findings without a cited source                       | HARD BLOCK  |
.opencode/agent/context.md:349:| **Implementation Advice**    | Report what exists: "Current pattern uses X at file:line"                             |
.opencode/agent/context.md:361:When the query intent is semantic (find code by concept, understand implementations, discover patterns), ALWAYS try CocoIndex FIRST before falling back to Grep/Glob:
.opencode/agent/context.md:434:│  ├─► 3. Discover files/patterns and read key sources                     │
.opencode/command/create/assets/changelog_template.md:82:**Problem:** {Same pattern...}
.opencode/command/create/assets/changelog_template.md:84:**Fix:** {Same pattern...}
.opencode/command/create/assets/create_sk_skill_auto.yaml:43:  principle: "One entrypoint, one router, one quality contract"
.opencode/command/create/assets/create_sk_skill_auto.yaml:73:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_sk_skill_auto.yaml:125:operation_router:
.opencode/command/create/assets/create_sk_skill_auto.yaml:148:    - patterns
.opencode/command/create/assets/create_sk_skill_auto.yaml:326:          workflow: { filename_pattern: "[topic]_workflow.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:327:          patterns: { filename_pattern: "[topic]_patterns.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:328:          debugging: { filename_pattern: "[topic]_debugging.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:329:          tools: { filename_pattern: "[tool]_guide.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:330:          quick_ref: { filename_pattern: "quick_reference.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:341:          template: { filename_pattern: "[topic]_templates.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:342:          lookup: { filename_pattern: "[topic]_lookup.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:343:          example: { filename_pattern: "[topic]_examples.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:344:          guide: { filename_pattern: "[topic]_guide.md" }
.opencode/command/create/assets/create_sk_skill_auto.yaml:434:    - "Re-run operation router"
.opencode/command/create/assets/create_sk_skill_auto.yaml:485:  - "Use canonical operation router"
.opencode/command/create/folder_readme.md:447:- **README operation**: AI-optimized README.md with proper structure, table of contents, and comprehensive documentation following the patterns from SpecKit, Memory System, and Code Environment READMEs.
.opencode/command/create/folder_readme.md:484:- `.opencode/skill/system-spec-kit/README.md` (SpecKit + Memory pattern)
.codex/agents/context.toml:11:Read-only context retrieval agent. The **exclusive entry point for ALL exploration tasks** — every codebase search, file discovery, pattern analysis, and context retrieval routes through this agent. Gathers structured Context Packages before implementation begins. Executes retrieval directly and NEVER performs nested delegation. NEVER writes, edits, creates, or deletes files.
.codex/agents/context.toml:31:3. **CODEBASE SCAN** → Glob (5-10 patterns) → Grep (3-5 patterns) → Read (5-8 key files)
.codex/agents/context.toml:46:| `Glob`                  | Codebase    | File discovery by pattern | Find files matching name/extension   |
.codex/agents/context.toml:47:| `Grep`                  | Codebase    | Text/code pattern search  | Find keywords, function calls, usage |
.codex/agents/context.toml:63:    │   └─► Glob → find files by pattern
.codex/agents/context.toml:66:    │   └─► Grep → search for text patterns
.codex/agents/context.toml:96:**Tool Sequence (default)**: `memory_match_triggers` → `memory_context(focused/deep)` → `CocoIndex search` (1-3 concept queries) → `Glob` (3-8 patterns) → `Grep` (2-4 patterns) → `Read` (3-6 key files) → conditional `memory_search`
.codex/agents/context.toml:98:**Returns**: Full memory context (prior decisions, patterns, session history), comprehensive file map with dependency relationships, detailed code pattern analysis, spec folder status (documentation state, task completion), related spec folders, cross-references between memory and codebase findings.
.codex/agents/context.toml:112:**Why First**: Costs almost nothing (~2 tool calls, <5 seconds). Immediately surfaces prior decisions, saved patterns, session context from previous work, and constitutional rules.
.codex/agents/context.toml:125:- **CocoIndex** — Semantic search for concept-based discovery. Use 1-3 short queries (3-5 words). Examples: `ccc search "authentication middleware"`, `ccc search "error handling patterns"`. Set `refresh_index=false` after first query.
.codex/agents/context.toml:126:- **Glob** — Cast a wide net for file discovery. Use 5-10 patterns. Examples: `src/**/*auth*`, `**/*.config.*`, `*.md`
.codex/agents/context.toml:130:**Output**: File map, pattern locations, and summarized key file contents.
.codex/agents/context.toml:183:[File locations, patterns found, code structure]
.codex/agents/context.toml:184:- `path/to/file.ext` — [Purpose/relevance, key patterns at lines X-Y]
.codex/agents/context.toml:186:- Pattern: [Convention or architecture pattern detected]
.codex/agents/context.toml:189:[Conventions detected, architecture patterns, naming schemes]
.codex/agents/context.toml:191:- Architecture: [e.g., "middleware pattern, service layer separation"]
.codex/agents/context.toml:242:| Rule 2: Spec Folder       | New spec folder needed          | Discover patterns for new spec       |
.codex/agents/context.toml:250:Explore everything related to the authentication system — codebase patterns,
.codex/agents/context.toml:283:| NEVER claim patterns/findings without a cited source                       | HARD BLOCK  |
.codex/agents/context.toml:325:| **Implementation Advice**    | Report what exists: "Current pattern uses X at file:line"                             |
.codex/agents/context.toml:337:When the query intent is semantic (find code by concept, understand implementations, discover patterns), ALWAYS try CocoIndex FIRST before falling back to Grep/Glob:
.codex/agents/context.toml:410:│  ├─► 3. Discover files/patterns and read key sources                     │
.opencode/command/create/assets/create_testing_playbook_auto.yaml:70:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_testing_playbook_auto.yaml:132:operation_router:
.opencode/command/create/assets/create_agent_confirm.yaml:81:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_agent_confirm.yaml:86:  - "Validate Choice: Follow patterns, maintainable"
.opencode/command/create/assets/create_agent_confirm.yaml:297:      rule_reference: "AGENTS.md Rule 4 — exploration"
.opencode/command/create/assets/create_agent_confirm.yaml:304:    - "Context Package returns: similar agents, reusable patterns, duplicates"
.opencode/command/create/assets/create_agent_confirm.yaml:310:    - reusable_patterns: patterns_to_consider
.opencode/command/create/assets/create_agent_confirm.yaml:334:    - "Dispatch @speckit for spec.md and plan.md creation (AGENTS.md Rule 5)"
.opencode/command/create/assets/create_agent_confirm.yaml:337:      rule_reference: "AGENTS.md Rule 5 — spec folder docs"
.opencode/command/create/assets/create_agent_confirm.yaml:602:      rule_reference: "AGENTS.md §3 — sk-doc template alignment and quality validation"
.opencode/command/create/assets/create_agent_confirm.yaml:674:      pattern: "[context-type]-[keywords]-[spec-number]"
.opencode/command/create/assets/create_agent_confirm.yaml:707:      rationale: "Agent creation captures significant patterns and decisions for future reference"
.opencode/agent/deep-review.md:101:| Grep | Find patterns indicating issues | Search for auth patterns, error handling |
.opencode/agent/deep-review.md:107:- **Correctness**: Read logic flows, grep for error handling patterns, and test edge cases against observable intent.
.opencode/agent/deep-review.md:108:- **Security**: Grep for auth patterns, input validation, data exposure, and sensitive state transitions.
.opencode/agent/deep-review.md:110:- **Maintainability**: Read for pattern drift, documentation clarity, and ease of safe follow-on changes.
.opencode/agent/deep-review.md:402:- Ask: "Is this a project pattern, not a bug?", "Is severity inflated?", "Am I seeing phantom issues?"
.opencode/command/create/assets/create_folder_readme_auto.yaml:118:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_folder_readme_auto.yaml:123:  - "Validate Choice: Follow patterns, maintainable"
.opencode/command/create/assets/create_folder_readme_auto.yaml:443:# Points to readme_template.md sections for patterns not embedded here.
.opencode/command/create/assets/create_folder_readme_auto.yaml:448:  writing_patterns: "readme_template.md §6 (Writing Patterns)"
.opencode/command/create/assets/create_folder_readme_auto.yaml:452:  before_after_patterns: "readme_template.md §6.4 (Before/After)"
.opencode/command/create/assets/create_folder_readme_auto.yaml:527:    core_pattern:
.opencode/command/create/assets/create_folder_readme_auto.yaml:616:      rule_reference: "AGENTS.md §3 — sk-doc template alignment and quality validation"
.opencode/command/create/assets/create_folder_readme_auto.yaml:669:      pattern: "[context-type]-[keywords]-[spec-number]"
.opencode/command/create/assets/create_folder_readme_auto.yaml:1071:      rule_reference: "AGENTS.md §3 — sk-doc template alignment and quality validation"
.opencode/command/create/assets/create_folder_readme_auto.yaml:1126:      pattern: "[context-type]-[keywords]-[spec-number]"
.opencode/agent/write.md:130:- ALL H2 headers match pattern `## N. [emoji] TITLE` with sequential numbering
.opencode/agent/write.md:210:| **3: ASCII Flowcharts**   | Creating diagrams                 | 7 patterns (linear, decision, parallel, nested, approval, loop, pipeline) → Validate with validate_flowchart.sh | N/A             |
.opencode/agent/write.md:303:**SELF-VALIDATION**: Re-read all created files before reporting. Compare H2 headers against template (emoji verification). Scan for placeholders: `Grep({ pattern: "\[INSERT|\[TODO|TBD|Coming soon", path: "/path/to/file.md" })`.
.codex/agents/ultra-think.toml:74:| `Grep`                  | Pattern search                 | Finding relevant code patterns         |
.codex/agents/ultra-think.toml:79:| `memory_search`         | Hybrid memory search           | Finding prior decisions and patterns   |
.codex/agents/ultra-think.toml:223:| Integration  | 15%    | Fits existing codebase patterns          | 15=seamless, 10=compatible, 5=minor friction, 0=conflicts |
.codex/agents/ultra-think.toml:287:- Run identical subagent attempts (the Multi-Think anti-pattern)
.codex/agents/ultra-think.toml:451:| **Subjective Picking**       | Bias toward familiar patterns, ignores scoring            | Apply the 5-dimension rubric to ALL strategies     |
.opencode/command/create/assets/create_feature_catalog_confirm.yaml:70:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_feature_catalog_confirm.yaml:146:operation_router:
.opencode/command/create/assets/create_agent_auto.yaml:80:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_agent_auto.yaml:85:  - "Validate Choice: Follow patterns, maintainable"
.opencode/command/create/assets/create_agent_auto.yaml:273:      rule_reference: "AGENTS.md Rule 4 — exploration"
.opencode/command/create/assets/create_agent_auto.yaml:280:    - "Context Package returns: similar agents, reusable patterns, duplicates"
.opencode/command/create/assets/create_agent_auto.yaml:286:    - reusable_patterns: patterns_to_consider
.opencode/command/create/assets/create_agent_auto.yaml:301:    - "Dispatch @speckit for spec.md and plan.md creation (AGENTS.md Rule 5)"
.opencode/command/create/assets/create_agent_auto.yaml:304:      rule_reference: "AGENTS.md Rule 5 — spec folder docs"
.opencode/command/create/assets/create_agent_auto.yaml:530:      rule_reference: "AGENTS.md §3 — sk-doc template alignment and quality validation"
.opencode/command/create/assets/create_agent_auto.yaml:586:      pattern: "[context-type]-[keywords]-[spec-number]"
.opencode/command/create/assets/create_agent_auto.yaml:619:      rationale: "Agent creation captures significant patterns and decisions for future reference"
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:24:/** Escape special SQL LIKE pattern characters (% and _) for safe queries */
.opencode/command/create/testing-playbook.md:185:**Status patterns:**
.opencode/command/create/testing-playbook.md:370:Recovery loop pattern:
.opencode/command/create/assets/create_feature_catalog_auto.yaml:70:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_feature_catalog_auto.yaml:132:operation_router:
.opencode/command/create/assets/create_sk_skill_confirm.yaml:73:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_sk_skill_confirm.yaml:149:operation_router:
.opencode/command/create/assets/create_sk_skill_confirm.yaml:162:      - patterns
.opencode/command/create/assets/create_sk_skill_confirm.yaml:343:          workflow: { filename_pattern: "[topic]_workflow.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:344:          patterns: { filename_pattern: "[topic]_patterns.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:345:          debugging: { filename_pattern: "[topic]_debugging.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:346:          tools: { filename_pattern: "[tool]_guide.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:347:          quick_ref: { filename_pattern: "quick_reference.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:358:          template: { filename_pattern: "[topic]_templates.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:359:          lookup: { filename_pattern: "[topic]_lookup.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:360:          example: { filename_pattern: "[topic]_examples.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:361:          guide: { filename_pattern: "[topic]_guide.md" }
.opencode/command/create/assets/create_sk_skill_confirm.yaml:480:      - "Re-run operation router"
.opencode/command/create/assets/create_sk_skill_confirm.yaml:533:    - "Use canonical operation router"
.opencode/command/create/assets/create_testing_playbook_confirm.yaml:70:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_testing_playbook_confirm.yaml:146:operation_router:
.opencode/command/create/assets/create_changelog_auto.yaml:81:  code_search_note: "Use CocoIndex (mcp__cocoindex_code__search) for discovering existing patterns before creating. Use Grep only for exact known tokens."
.opencode/command/create/assets/create_changelog_auto.yaml:167:# Maps file path patterns to changelog component folders.
.opencode/command/create/assets/create_changelog_auto.yaml:169:# When a changed file matches multiple patterns, use the FIRST match.
.opencode/command/create/assets/create_changelog_auto.yaml:197:    folder_pattern: "^(\\d+)--(.*)"
.opencode/command/create/assets/create_changelog_auto.yaml:380:          Run: git log --oneline --since="7 days ago" -- {component_file_patterns}
.opencode/command/create/assets/create_changelog_auto.yaml:412:          Parse folder names using NN--component-name pattern

codex
I’m at the point where the interesting questions are mostly about boundaries and trust: what Mex treats as authoritative, what it only heuristically infers, and where our current system mixes those layers together. I’m pulling exact line references now so the recommendations stay concrete and don’t drift back into generic “we should add X” territory.
exec
/bin/zsh -lc "sed -n '1,220p' src/git.ts && printf '\\n---types---\\n' && sed -n '1,260p' src/types.ts && printf '\\n---reporter---\\n' && sed -n '1,220p' src/reporter.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
 succeeded in 0ms:
import simpleGit, { type SimpleGit, type LogResult } from "simple-git";

let _git: SimpleGit | null = null;

export function getGit(cwd?: string): SimpleGit {
  if (!_git || cwd) {
    _git = simpleGit(cwd ?? process.cwd());
  }
  return _git;
}

/** Get days since a file was last modified in git */
export async function daysSinceLastChange(
  filePath: string,
  cwd?: string
): Promise<number | null> {
  try {
    const git = getGit(cwd);
    const log = await git.log({ file: filePath, maxCount: 1 });
    if (!log.latest?.date) return null;
    const lastDate = new Date(log.latest.date);
    const now = new Date();
    return Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  } catch {
    return null;
  }
}

/** Get number of commits since a file was last modified */
export async function commitsSinceLastChange(
  filePath: string,
  cwd?: string
): Promise<number | null> {
  try {
    const git = getGit(cwd);
    const fileLog = await git.log({ file: filePath, maxCount: 1 });
    if (!fileLog.latest?.hash) return null;

    const allLog = await git.log();
    const totalCommits = allLog.all.length;
    const fileIndex = allLog.all.findIndex(
      (c) => c.hash === fileLog.latest!.hash
    );
    return fileIndex === -1 ? null : fileIndex;
  } catch {
    return null;
  }
}

/** Get git diff for specific paths */
export async function getGitDiff(
  paths: string[],
  cwd?: string
): Promise<string> {
  try {
    const git = getGit(cwd);
    return await git.diff(["HEAD~5", "HEAD", "--", ...paths]);
  } catch {
    return "";
  }
}

/** Get full git log */
export async function getLog(
  cwd?: string,
  maxCount = 50
): Promise<LogResult> {
  const git = getGit(cwd);
  return git.log({ maxCount });
}

---types---
// ── Shared Types ──

// ── Config ──

export interface MexConfig {
  /** Absolute path to project root (where .git lives) */
  projectRoot: string;
  /** Absolute path to scaffold root (.mex/ directory) */
  scaffoldRoot: string;
}

// ── Claims (extracted from markdown) ──

export type ClaimKind = "path" | "command" | "dependency" | "version";

export interface Claim {
  kind: ClaimKind;
  value: string;
  /** Source file (relative to project root) */
  source: string;
  /** Line number in source file */
  line: number;
  /** Section heading the claim was found under */
  section: string | null;
  /** If true, this claim is negated (e.g. "does NOT use X") */
  negated: boolean;
}

// ── Drift ──

export type Severity = "error" | "warning" | "info";

export type IssueCode =
  | "STALE_FILE"
  | "MISSING_PATH"
  | "DEAD_COMMAND"
  | "DEPENDENCY_MISSING"
  | "VERSION_MISMATCH"
  | "CROSS_FILE_CONFLICT"
  | "DEAD_EDGE"
  | "INDEX_MISSING_ENTRY"
  | "INDEX_ORPHAN_ENTRY"
  | "UNDOCUMENTED_SCRIPT";

export interface DriftIssue {
  code: IssueCode;
  severity: Severity;
  file: string;
  line: number | null;
  message: string;
  /** The claim that triggered this issue, if any */
  claim?: Claim;
}

export interface DriftReport {
  score: number;
  issues: DriftIssue[];
  filesChecked: number;
  timestamp: string;
}

// ── Frontmatter ──

export interface ScaffoldFrontmatter {
  name?: string;
  description?: string;
  edges?: FrontmatterEdge[];
  last_updated?: string;
  [key: string]: unknown;
}

export interface FrontmatterEdge {
  target: string;
  condition?: string;
}

// ── Scanner ──

export interface ManifestInfo {
  type: "package.json" | "pyproject.toml" | "go.mod" | "Cargo.toml";
  name: string | null;
  version: string | null;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export interface EntryPoint {
  path: string;
  type: "main" | "binary" | "test" | "config";
}

export interface FolderCategory {
  name: string;
  path: string;
  fileCount: number;
  category: "routes" | "models" | "services" | "tests" | "config" | "utils" | "views" | "other";
}

export interface ToolingInfo {
  testRunner: string | null;
  buildTool: string | null;
  linter: string | null;
  formatter: string | null;
  packageManager: "npm" | "yarn" | "pnpm" | "bun" | null;
}

export interface ScannerBrief {
  manifest: ManifestInfo | null;
  entryPoints: EntryPoint[];
  folderTree: FolderCategory[];
  tooling: ToolingInfo;
  readme: string | null;
  timestamp: string;
}

// ── Sync ──

export interface SyncTarget {
  file: string;
  issues: DriftIssue[];
  gitDiff: string | null;
}

export interface SyncResult {
  file: string;
  action: "updated" | "skipped" | "failed";
  reason?: string;
}

---reporter---
import chalk from "chalk";
import type { DriftReport, DriftIssue, Severity } from "./types.js";

const severityColor: Record<Severity, (s: string) => string> = {
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
};

const severityIcon: Record<Severity, string> = {
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

export function reportConsole(report: DriftReport): void {
  // Show score at top so it's visible before scrolling through issues
  if (report.issues.length > 0) {
    printSummary(report);
    console.log();
  }

  const grouped = groupByFile(report.issues);

  for (const [file, issues] of Object.entries(grouped)) {
    console.log(chalk.bold.underline(file));
    for (const issue of issues) {
      const color = severityColor[issue.severity];
      const icon = severityIcon[issue.severity];
      const loc = issue.line ? `:${issue.line}` : "";
      console.log(
        `  ${color(`${icon} ${issue.code}`)}${loc} ${issue.message}`
      );
    }
    console.log();
  }

  printSummary(report);
}

export function reportQuiet(report: DriftReport): void {
  const errors = report.issues.filter((i) => i.severity === "error").length;
  const warnings = report.issues.filter(
    (i) => i.severity === "warning"
  ).length;
  const parts = [];
  if (errors) parts.push(`${errors} error${errors > 1 ? "s" : ""}`);
  if (warnings) parts.push(`${warnings} warning${warnings > 1 ? "s" : ""}`);
  const detail = parts.length ? ` (${parts.join(", ")})` : "";
  const color =
    report.score >= 80
      ? chalk.green
      : report.score >= 50
        ? chalk.yellow
        : chalk.red;
  console.log(`mex: drift score ${color(`${report.score}/100`)}${detail}`);
}

export function reportJSON(report: DriftReport): void {
  console.log(JSON.stringify(report, null, 2));
}

function printSummary(report: DriftReport): void {
  const errors = report.issues.filter((i) => i.severity === "error").length;
  const warnings = report.issues.filter(
    (i) => i.severity === "warning"
  ).length;
  const infos = report.issues.filter((i) => i.severity === "info").length;
  const color =
    report.score >= 80
      ? chalk.green
      : report.score >= 50
        ? chalk.yellow
        : chalk.red;

  console.log(
    chalk.bold(
      `Drift score: ${color(`${report.score}/100`)} — ${errors} errors, ${warnings} warnings, ${infos} info`
    )
  );
  console.log(chalk.dim(`${report.filesChecked} files checked`));
}

function groupByFile(
  issues: DriftIssue[]
): Record<string, DriftIssue[]> {
  const grouped: Record<string, DriftIssue[]> = {};
  for (const issue of issues) {
    if (!grouped[issue.file]) grouped[issue.file] = [];
    grouped[issue.file].push(issue);
  }
  return grouped;
}

exec
/bin/zsh -lc "nl -ba src/scanner/index.ts | sed -n '1,220p'; printf '\\n---\\n'; nl -ba src/pattern/index.ts | sed -n '1,220p'; printf '\\n---\\n'; nl -ba ROUTER.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
exec
/bin/zsh -lc "nl -ba src/drift/claims.ts | sed -n '1,220p'; printf '\\n---\\n'; nl -ba src/drift/checkers/staleness.ts | sed -n '1,220p'; printf '\\n---\\n'; nl -ba src/sync/brief-builder.ts | sed -n '1,260p'; printf '\\n---\\n'; nl -ba src/sync/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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

---
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

---
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

---
     1	import { daysSinceLastChange, commitsSinceLastChange } from "../../git.js";
     2	import type { DriftIssue } from "../../types.js";
     3	
     4	const WARN_DAYS = 30;
     5	const ERROR_DAYS = 90;
     6	const WARN_COMMITS = 50;
     7	const ERROR_COMMITS = 200;
     8	
     9	/** Check how stale a scaffold file is based on git history */
    10	export async function checkStaleness(
    11	  filePath: string,
    12	  source: string,
    13	  cwd: string
    14	): Promise<DriftIssue[]> {
    15	  const issues: DriftIssue[] = [];
    16	
    17	  const days = await daysSinceLastChange(filePath, cwd);
    18	  const commits = await commitsSinceLastChange(filePath, cwd);
    19	
    20	  if (days !== null && days >= ERROR_DAYS) {
    21	    issues.push({
    22	      code: "STALE_FILE",
    23	      severity: "error",
    24	      file: source,
    25	      line: null,
    26	      message: `File hasn't been updated in ${days} days (threshold: ${ERROR_DAYS}d)`,
    27	    });
    28	  } else if (days !== null && days >= WARN_DAYS) {
    29	    issues.push({
    30	      code: "STALE_FILE",
    31	      severity: "warning",
    32	      file: source,
    33	      line: null,
    34	      message: `File hasn't been updated in ${days} days (threshold: ${WARN_DAYS}d)`,
    35	    });
    36	  }
    37	
    38	  if (commits !== null && commits >= ERROR_COMMITS) {
    39	    issues.push({
    40	      code: "STALE_FILE",
    41	      severity: "error",
    42	      file: source,
    43	      line: null,
    44	      message: `${commits} commits since file was last updated (threshold: ${ERROR_COMMITS})`,
    45	    });
    46	  } else if (commits !== null && commits >= WARN_COMMITS) {
    47	    issues.push({
    48	      code: "STALE_FILE",
    49	      severity: "warning",
    50	      file: source,
    51	      line: null,
    52	      message: `${commits} commits since file was last updated (threshold: ${WARN_COMMITS})`,
    53	    });
    54	  }
    55	
    56	  return issues;
    57	}

---
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

---
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '223,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   223	async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
   224	  const startTime = Date.now();
   225	  // A7-P2-1: Generate requestId for incident correlation in error responses
   226	  const requestId = randomUUID();
   227	  try {
   228	    await checkDatabaseUpdated();
   229	  } catch (dbStateErr: unknown) {
   230	    const message = toErrorMessage(dbStateErr);
   231	    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
   232	    return createMCPErrorResponse({
   233	      tool: 'memory_health',
   234	      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
   235	      code: 'E021',
   236	      details: { requestId },
   237	      startTime,
   238	    });
   239	  }
   240	
   241	  const {
   242	    reportMode = 'full',
   243	    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
   244	    specFolder,
   245	    autoRepair = false,
   246	    confirmed = false,
   247	  } = args ?? {};
   248	
   249	  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
   250	    return createMCPErrorResponse({
   251	      tool: 'memory_health',
   252	      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
   253	      code: 'E_INVALID_INPUT',
   254	      details: { requestId },
   255	      startTime,
   256	    });
   257	  }
   258	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   259	    return createMCPErrorResponse({
   260	      tool: 'memory_health',
   261	      error: 'specFolder must be a string',
   262	      code: 'E_INVALID_INPUT',
   263	      details: { requestId },
   264	      startTime,
   265	    });
   266	  }
   267	  if (typeof autoRepair !== 'boolean') {
   268	    return createMCPErrorResponse({
   269	      tool: 'memory_health',
   270	      error: 'autoRepair must be a boolean',
   271	      code: 'E_INVALID_INPUT',
   272	      details: { requestId },
   273	      startTime,
   274	    });
   275	  }
   276	  if (typeof confirmed !== 'boolean') {
   277	    return createMCPErrorResponse({
   278	      tool: 'memory_health',
   279	      error: 'confirmed must be a boolean',
   280	      code: 'E_INVALID_INPUT',
   281	      details: { requestId },
   282	      startTime,
   283	    });
   284	  }
   285	  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
   286	    return createMCPErrorResponse({
   287	      tool: 'memory_health',
   288	      error: 'limit must be a positive number',
   289	      code: 'E_INVALID_INPUT',
   290	      details: { requestId },
   291	      startTime,
   292	    });
   293	  }
   294	  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));
   295	
   296	  const database = vectorIndex.getDb();
   297	  let memoryCount = 0;
   298	  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
   299	  let aliasRows: AliasConflictDbRow[] = [];
   300	  let divergentAliasGroups: DivergentAliasGroup[] = [];
   301	  const embeddingRetry = getEmbeddingRetryStats();
   302	  try {
   303	    if (database) {
   304	      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
   305	        .get() as Record<string, number> | undefined;
   306	      memoryCount = countResult?.count ?? 0;
   307	
   308	      const whereParts: string[] = [
   309	        'parent_id IS NULL',
   310	      ];
   311	      const params: unknown[] = [];
   312	      if (specFolder) {
   313	        whereParts.push('spec_folder = ?');
   314	        params.push(specFolder);
   315	      }
   316	
   317	      const aliasSql = `
   318	        SELECT file_path, content_hash, spec_folder
   319	        FROM memory_index
   320	        WHERE ${whereParts.join(' AND ')}
   321	      `;
   322	
   323	      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
   324	        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
   325	      aliasConflicts = summarizeAliasConflicts(aliasRows);
   326	      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
   327	    }
   328	  } catch (err: unknown) {
   329	    const message = toErrorMessage(err);
   330	    if (message.includes('no such table')) {
   331	      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
   332	      return createMCPErrorResponse({
   333	        tool: 'memory_health',
   334	        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
   335	        code: 'E_SCHEMA_MISSING',
   336	        details: { requestId },
   337	        startTime,
   338	      });
   339	    }
   340	    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
   341	  }
   342	
   343	  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
   344	    const hints: string[] = [];
   345	    if (!database) {
   346	      hints.push('Database not connected - restart MCP server');
   347	    }
   348	    if (autoRepair) {
   349	      hints.push('autoRepair is only applied in reportMode="full"');
   350	    }
   351	    if (aliasConflicts.divergentHashGroups === 0) {
   352	      hints.push('No divergent alias groups detected');
   353	    }
   354	    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
   355	      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
   356	    }
   357	
   358	    return createMCPSuccessResponse({
   359	      tool: 'memory_health',
   360	      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
   361	      data: {
   362	        reportMode,
   363	        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
   364	        databaseConnected: !!database,
   365	        embeddingRetry,
   366	        specFolder: specFolder ?? null,
   367	        limit: safeLimit,
   368	        totalRowsScanned: aliasRows.length,
   369	        totalDivergentGroups: aliasConflicts.divergentHashGroups,
   370	        returnedGroups: divergentAliasGroups.length,
   371	        groups: divergentAliasGroups,
   372	      },
   373	      hints,
   374	      startTime,
   375	    });
   376	  }
   377	
   378	  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   379	  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
   380	  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
   381	
   382	  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
   383	  const hints: string[] = [];
   384	  const repair = {
   385	    requested: autoRepair,
   386	    attempted: false,
   387	    repaired: false,
   388	    partialSuccess: false,
   389	    actions: [] as string[],
   390	    warnings: [] as string[],
   391	    errors: [] as string[],
   392	  };
   393	  let successfulRepairCount = 0;
   394	  let failedRepairCount = 0;
   395	
   396	  const trackRepairOutcome = (succeeded: boolean): void => {
   397	    repair.attempted = true;
   398	    if (succeeded) {
   399	      successfulRepairCount += 1;
   400	      return;
   401	    }
   402	    failedRepairCount += 1;
   403	  };
   404	
   405	  if (!profile) {
   406	    try {
   407	      // Resolve the lazy profile so health reflects the active runtime provider
   408	      // Rather than the legacy sync fallback defaults.
   409	      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
   410	      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   411	    } catch (profileError: unknown) {
   412	      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
   413	    }
   414	  }
   415	
   416	  const providerName = profile?.provider ?? providerMetadata.provider;
   417	  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
   418	  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
   419	  const repairActions = [
   420	    'fts_rebuild',
   421	    'trigger_cache_refresh',
   422	    'orphan_edges_cleanup',
   423	    'orphan_vector_cleanup',
   424	  ];
   425	
   426	  if (autoRepair && !confirmed) {
   427	    return createMCPSuccessResponse({
   428	      tool: 'memory_health',
   429	      summary: 'Confirmation required before auto-repair actions are executed',
   430	      data: {
   431	        status,
   432	        reportMode,
   433	        autoRepairRequested: true,
   434	        needsConfirmation: true,
   435	        actions: repairActions,
   436	        embeddingRetry,
   437	      },
   438	      hints: [
   439	        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
   440	      ],
   441	      startTime,
   442	    });
   443	  }
   444	
   445	  if (!isEmbeddingModelReady()) {
   446	    hints.push('Embedding model not ready - some operations may fail');
   447	  }
   448	  if (!database) {
   449	    hints.push('Database not connected - restart MCP server');
   450	  }
   451	  if (!vectorIndex.isVectorSearchAvailable()) {
   452	    hints.push('Vector search unavailable - fallback to BM25');
   453	  }
   454	  // FTS5 consistency check
   455	  if (database) {
   456	    try {
   457	      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
   458	      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
   459	      if (memoryCountRow.count !== ftsCountRow.count) {
   460	        hints.push(
   461	          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
   462	          `Run memory_index_scan with force:true to rebuild FTS5 index.`
   463	        );
   464	
   465	        if (autoRepair) {
   466	          try {
   467	            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
   468	            repair.actions.push('fts_rebuild');
   469	
   470	            triggerMatcher.refreshTriggerCache();
   471	            repair.actions.push('trigger_cache_refresh');
   472	
   473	            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
   474	            if (memoryCountRow.count === repairedFtsCountRow.count) {
   475	              trackRepairOutcome(true);
   476	              repair.actions.push('fts_consistency_verified');
   477	              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
   478	            } else {
   479	              trackRepairOutcome(false);
   480	              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
   481	              repair.warnings.push(warning);
   482	              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
   483	            }
   484	          } catch (repairError: unknown) {
   485	            const message = toErrorMessage(repairError);
   486	            trackRepairOutcome(false);
   487	            repair.errors.push(sanitizeErrorForHint(message));
   488	            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
   489	          }
   490	        }
   491	      }
   492	    } catch (e: unknown) {
   493	      const message = toErrorMessage(e);
   494	      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
   495	      if (autoRepair) {
   496	        trackRepairOutcome(false);
   497	        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
   498	      }
   499	    }
   500	  }
   501	  // cleanupOrphanedEdges was exported but
   502	  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
   503	  // (referencing deleted memories) are cleaned up during health checks.
   504	  if (autoRepair && database) {
   505	    try {
   506	      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
   507	      causalEdges.init(database);
   508	      const orphanResult = causalEdges.cleanupOrphanedEdges();
   509	      if (orphanResult.deleted > 0) {
   510	        trackRepairOutcome(true);
   511	        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
   512	        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
   513	      }
   514	    } catch (orphanError: unknown) {
   515	      trackRepairOutcome(false);
   516	      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
   517	    }
   518	  }
   519	
   520	  if (autoRepair && database) {
   521	    try {
   522	      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: true });
   523	      const cleanedVectors = integrityReport.cleaned?.vectors ?? 0;
   524	      const cleanedChunks = integrityReport.cleaned?.chunks ?? 0;
   525	
   526	      if (cleanedVectors > 0) {
   527	        trackRepairOutcome(true);
   528	        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
   529	        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
   530	      }
   531	
   532	      if (cleanedChunks > 0) {
   533	        trackRepairOutcome(true);
   534	        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
   535	        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
   536	      }
   537	
   538	      const postRepairReport = vectorIndex.verifyIntegrity({ autoClean: false });
   539	      if (
   540	        postRepairReport.orphanedVectors > 0 ||
   541	        postRepairReport.missingVectors > 0 ||
   542	        postRepairReport.orphanedFiles.length > 0 ||
   543	        postRepairReport.orphanedChunks > 0
   544	      ) {
   545	        repair.warnings.push(
   546	          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
   547	          `missingVectors=${postRepairReport.missingVectors}, orphanedFiles=${postRepairReport.orphanedFiles.length}, ` +
   548	          `orphanedChunks=${postRepairReport.orphanedChunks}`
   549	        );
   550	      }
   551	    } catch (integrityError: unknown) {
   552	      trackRepairOutcome(false);
   553	      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
   554	    }
   555	  }
   556	
   557	  if (repair.attempted) {
   558	    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
   559	    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
   560	  }
   561	
   562	  if (aliasConflicts.groups > 0) {
   563	    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
   564	  }
   565	  if (aliasConflicts.divergentHashGroups > 0) {
   566	    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
   567	  }
   568	
   569	  return createMCPSuccessResponse({
   570	    tool: 'memory_health',
   571	    summary,
   572	    data: {
   573	      status,
   574	      embeddingModelReady: isEmbeddingModelReady(),
   575	      databaseConnected: !!database,
   576	      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
   577	      memoryCount,
   578	      uptime: process.uptime(),
   579	      version: SERVER_VERSION,
   580	      reportMode: 'full',
   581	      aliasConflicts,
   582	      repair,
   583	      embeddingProvider: {
   584	        provider: providerName,
   585	        model: providerModel,
   586	        dimension: providerDimension,
   587	        healthy: providerMetadata.healthy !== false,
   588	        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
   589	      },
   590	      embeddingRetry,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,610p'; printf '\\n---\\n'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '94,360p'; printf '\\n---\\n'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '210,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
   401	export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
   402	  // F052: Record memory recovery metric for session_resume
   403	  recordMetricEvent({ kind: 'memory_recovery' });
   404	
   405	  // Phase 024: Record bootstrap telemetry
   406	  const startMs = Date.now();
   407	  const hints: string[] = [];
   408	
   409	  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
   410	  let memoryResult: Record<string, unknown> = {};
   411	  if (args.minimal) {
   412	    memoryResult = { skipped: true, reason: 'minimal mode' };
   413	  } else {
   414	    try {
   415	      const mcpResponse = await handleMemoryContext({
   416	        input: 'resume previous work continue session',
   417	        mode: 'resume',
   418	        profile: 'resume',
   419	        specFolder: args.specFolder,
   420	      });
   421	      // Extract data from MCP envelope
   422	      if (mcpResponse?.content?.[0]?.text) {
   423	        try {
   424	          const parsed = JSON.parse(mcpResponse.content[0].text);
   425	          memoryResult = parsed?.data ?? parsed ?? {};
   426	        } catch {
   427	          memoryResult = { raw: mcpResponse.content[0].text };
   428	        }
   429	      }
   430	    } catch (error: unknown) {
   431	      const message = error instanceof Error ? error.message : String(error);
   432	      memoryResult = { error: message };
   433	      hints.push('Memory resume failed. Try memory_context manually.');
   434	    }
   435	  }
   436	
   437	  // ── Sub-call 2: Code graph status ───────────────────────────
   438	  let codeGraph: CodeGraphStatus = {
   439	    status: 'error',
   440	    lastScan: null,
   441	    nodeCount: 0,
   442	    edgeCount: 0,
   443	    fileCount: 0,
   444	  };
   445	  try {
   446	    const stats = graphDb.getStats();
   447	    const freshness = getGraphFreshness(process.cwd());
   448	    codeGraph = {
   449	      status: freshness,
   450	      lastScan: stats.lastScanTimestamp,
   451	      nodeCount: stats.totalNodes,
   452	      edgeCount: stats.totalEdges,
   453	      fileCount: stats.totalFiles,
   454	    };
   455	    // Graph status hints deferred to structural contract (Phase 027)
   456	    // — structural context hints at lines 128-130 provide preferred recovery path
   457	  } catch {
   458	    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
   459	    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
   460	  }
   461	
   462	  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
   463	  const cocoIndex: CocoIndexStatus = {
   464	    available: isCocoIndexAvailable(),
   465	    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
   466	  };
   467	  if (!cocoIndex.available) {
   468	    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
   469	  }
   470	
   471	  // Phase 027: Structural bootstrap contract for resume surface
   472	  const structuralContext = buildStructuralBootstrapContract('session_resume');
   473	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   474	    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
   475	  }
   476	
   477	  const structuralTrust = buildStructuralContextTrust(structuralContext);
   478	
   479	  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
   480	  const cachedSummaryDecision = getCachedSessionSummaryDecision({
   481	    specFolder: args.specFolder,
   482	    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
   483	  });
   484	  if (cachedSummaryDecision.status === 'accepted') {
   485	    hints.push('Cached continuity summary accepted as additive resume context.');
   486	  } else {
   487	    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
   488	  }
   489	
   490	  let sessionQuality: SessionResumeResult['sessionQuality'];
   491	  if (args.minimal) {
   492	    try {
   493	      sessionQuality = computeQualityScore().level;
   494	    } catch {
   495	      sessionQuality = 'unknown';
   496	    }
   497	  }
   498	
   499	  const memoryCertainty: SharedPayloadCertainty = args.minimal
   500	    ? 'defaulted'
   501	    : memoryResult.error
   502	      ? 'unknown'
   503	      : 'estimated';
   504	  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
   505	  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
   506	  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
   507	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   508	
   509	  const payloadSections: SharedPayloadSection[] = [
   510	    {
   511	      key: 'memory-resume',
   512	      title: 'Memory Resume',
   513	      content: summarizeUnknown(memoryResult),
   514	      source: 'memory',
   515	      certainty: memoryCertainty,
   516	    },
   517	  ];
   518	  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
   519	    payloadSections.push({
   520	      key: 'cached-continuity',
   521	      title: 'Cached Continuity',
   522	      content: [
   523	        cachedSummaryDecision.cachedSummary.continuityText,
   524	        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
   525	        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
   526	      ].join('\n'),
   527	      source: 'session',
   528	      certainty: cachedCertainty,
   529	    });
   530	  }
   531	  payloadSections.push(
   532	    {
   533	      key: 'code-graph-status',
   534	      title: 'Code Graph Status',
   535	      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
   536	      source: 'code-graph',
   537	      certainty: codeGraphCertainty,
   538	    },
   539	    {
   540	      key: 'cocoindex-status',
   541	      title: 'CocoIndex Status',
   542	      content: cocoIndex.available
   543	        ? `available at ${cocoIndex.binaryPath}`
   544	        : `unavailable; expected at ${cocoIndex.binaryPath}`,
   545	      source: 'semantic',
   546	      certainty: cocoIndexCertainty,
   547	    },
   548	    {
   549	      key: 'structural-context',
   550	      title: 'Structural Context',
   551	      content: structuralContext.summary,
   552	      source: 'code-graph',
   553	      certainty: structuralCertainty,
   554	      structuralTrust,
   555	    },
   556	  );
   557	
   558	  // ── Build composite result ──────────────────────────────────
   559	  const payloadContract = createSharedPayloadEnvelope({
   560	    kind: 'resume',
   561	    sections: payloadSections,
   562	    summary: `Resume payload: ${summarizeCertaintyContract([
   563	      { label: 'memory', certainty: memoryCertainty },
   564	      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   565	      { label: 'graph', certainty: codeGraphCertainty },
   566	      { label: 'cocoindex', certainty: cocoIndexCertainty },
   567	      { label: 'structural', certainty: structuralCertainty },
   568	    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
   569	    provenance: {
   570	      producer: 'session_resume',
   571	      sourceSurface: 'session_resume',
   572	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   573	      generatedAt: new Date().toISOString(),
   574	      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
   575	      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
   576	    },
   577	  });
   578	  const graphOps = buildCodeGraphOpsContract({
   579	    graphFreshness: codeGraph.status as GraphFreshness,
   580	    sourceSurface: 'session_resume',
   581	  });
   582	
   583	  const result: SessionResumeResult = {
   584	    memory: memoryResult,
   585	    codeGraph,
   586	    cocoIndex,
   587	    cachedSummary: cachedSummaryDecision,
   588	    structuralContext,
   589	    payloadContract,
   590	    opencodeTransport: buildOpenCodeTransportPlan({
   591	      resumePayload: payloadContract,
   592	      specFolder: args.specFolder ?? null,
   593	    }),
   594	    graphOps,
   595	    ...(sessionQuality ? { sessionQuality } : {}),
   596	    hints,
   597	  };
   598	
   599	  // Phase 024 / Item 9: Record bootstrap telemetry
   600	  if (!args.minimal) {
   601	    recordBootstrapEvent(
   602	      'tool',
   603	      Date.now() - startMs,
   604	      'full',
   605	    );
   606	  }
   607	
   608	  return {
   609	    content: [{
   610	      type: 'text',

---
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
   221	  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
   222	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   223	  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
   224	  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
   225	  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
   226	  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
   227	  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
   228	  if (!resumeData.error && !resumeStructuralTrust) {
   229	    throw new StructuralTrustPayloadError(
   230	      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
   231	    );
   232	  }
   233	  const structuralContextWithTrust = attachStructuralTrustFields(
   234	    structuralContext,
   235	    structuralSnapshotTrust,
   236	    { label: 'session_bootstrap structural context payload' },
   237	  );
   238	  const resumeWithTrust = resumeData.error
   239	    ? resumeData
   240	    : attachStructuralTrustFields(
   241	      resumeData,
   242	      resumeStructuralTrust,
   243	      { label: 'session_bootstrap resume payload' },
   244	    );
   245	
   246	  const payloadSections: SharedPayloadSection[] = [
   247	    {
   248	      key: 'resume-surface',
   249	      title: 'Resume Surface',
   250	      content: summarizeUnknown(resumeData),
   251	      source: 'memory',
   252	      certainty: resumeCertainty,
   253	    },
   254	  ];
   255	  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
   256	    payloadSections.push({
   257	      key: 'cached-continuity',
   258	      title: 'Cached Continuity',
   259	      content: [
   260	        cachedSummary.cachedSummary.continuityText,
   261	        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
   262	        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
   263	      ].join(' | '),
   264	      source: 'session',
   265	      certainty: cachedCertainty,
   266	    });
   267	  }
   268	  payloadSections.push(
   269	    {
   270	      key: 'health-surface',
   271	      title: 'Health Surface',
   272	      content: summarizeUnknown(healthData),
   273	      source: 'operational',
   274	      certainty: healthCertainty,
   275	    },
   276	    {
   277	      key: 'structural-context',
   278	      title: 'Structural Context',
   279	      // This section carries trust derived from the local structural snapshot,
   280	      // which remains valid even when the remote resume surface fails closed.
   281	      content: structuralContext.summary,
   282	      source: 'code-graph',
   283	      certainty: structuralCertainty,
   284	      structuralTrust: structuralSnapshotTrust,
   285	    },
   286	    {
   287	      key: 'next-actions',
   288	      title: 'Next Actions',
   289	      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
   290	      source: 'session',
   291	      certainty: nextActionsCertainty,
   292	    },
   293	  );
   294	
   295	  const payloadContract = createSharedPayloadEnvelope({
   296	    kind: 'bootstrap',
   297	    sections: payloadSections,
   298	    summary: `Bootstrap payload: ${summarizeCertaintyContract([
   299	      { label: 'resume', certainty: resumeCertainty },
   300	      { label: 'health', certainty: healthCertainty },
   301	      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   302	      { label: 'structural', certainty: structuralCertainty },
   303	      { label: 'nextActions', certainty: nextActionsCertainty },
   304	    ])}; structuralStatus=${structuralContext.status}`,
   305	    provenance: {
   306	      producer: 'session_bootstrap',
   307	      sourceSurface: 'session_bootstrap',
   308	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   309	      generatedAt: new Date().toISOString(),
   310	      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
   311	      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
   312	    },
   313	  });
   314	  const graphOps = buildCodeGraphOpsContract({
   315	    graphFreshness: structuralContext.status === 'ready'
   316	      ? 'fresh'
   317	      : structuralContext.status === 'stale'
   318	        ? 'stale'
   319	        : 'empty',
   320	    sourceSurface: 'session_bootstrap',
   321	  });
   322	
   323	  const result: SessionBootstrapResult = {
   324	    resume: resumeWithTrust,
   325	    health: healthData,
   326	    ...(cachedSummary ? { cachedSummary } : {}),
   327	    structuralContext: structuralContextWithTrust,
   328	    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
   329	    payloadContract,
   330	    opencodeTransport: buildOpenCodeTransportPlan({
   331	      bootstrapPayload: payloadContract,
   332	      resumePayload,
   333	      healthPayload,
   334	      specFolder: args.specFolder ?? null,
   335	    }),
   336	    graphOps,
   337	    hints: uniqueHints,
   338	    // Keep advisory routing guidance out of nextActions so bootstrap and resume
   339	    // remain the authoritative recovery owners for startup and deep resume flows.
   340	    nextActions: buildNextActions(resumeData, healthData, structuralContext),
   341	  };
   342	
   343	  return {
   344	    content: [{
   345	      type: 'text',
   346	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   347	    }],
   348	    structuredContent: result,
   349	  };
   350	}

---
   210	export function buildStructuralBootstrapContract(
   211	  sourceSurface: StructuralBootstrapContract['sourceSurface']
   212	): StructuralBootstrapContract {
   213	  const graphFreshness = resolveGraphFreshness();
   214	
   215	  let status: StructuralBootstrapContract['status'];
   216	  if (graphFreshness === 'fresh') {
   217	    status = 'ready';
   218	  } else if (graphFreshness === 'stale') {
   219	    status = 'stale';
   220	  } else {
   221	    status = 'missing';
   222	  }
   223	
   224	  let summary: string;
   225	  let highlights: string[] | undefined;
   226	
   227	  if (status === 'ready') {
   228	    try {
   229	      const stats = getGraphStats();
   230	      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
   231	      const topKinds = Object.entries(stats.nodesByKind)
   232	        .sort((a, b) => b[1] - a[1])
   233	        .slice(0, 5);
   234	      if (topKinds.length > 0) {
   235	        highlights = topKinds.map(([kind, count]) => `${kind}: ${count}`);
   236	      }
   237	    } catch {
   238	      summary = 'Code graph available (structural context ready)';
   239	    }
   240	  } else if (status === 'stale') {
   241	    try {
   242	      const stats = getGraphStats();
   243	      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
   244	    } catch {
   245	      summary = 'Code graph data is stale — structural context may be outdated';
   246	    }
   247	  } else {
   248	    summary = 'No structural context available — code graph is empty or unavailable';
   249	  }
   250	
   251	  let recommendedAction: string;
   252	  if (status === 'ready') {
   253	    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
   254	  } else if (status === 'stale') {
   255	    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
   256	  } else {
   257	    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
   258	  }
   259	
   260	  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);
   261	
   262	  return {
   263	    status,
   264	    summary: fittedContract.summary,
   265	    highlights: fittedContract.highlights,
   266	    recommendedAction: fittedContract.recommendedAction,
   267	    sourceSurface,
   268	    provenance: {
   269	      producer: 'session_snapshot',
   270	      sourceSurface,
   271	      trustState: trustStateFromStructuralStatus(status),
   272	      generatedAt: new Date().toISOString(),
   273	      lastUpdated: status === 'ready' || status === 'stale'
   274	        ? (() => {
   275	          try {
   276	            const stats = getGraphStats();
   277	            return stats.lastScanTimestamp ?? null;
   278	          } catch {
   279	            return null;
   280	          }
   281	        })()
   282	        : null,
   283	      sourceRefs: ['code-graph-db', 'session-snapshot'],
   284	    },
   285	  };
   286	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '784,835p'; printf '\\n---\\n'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1425,1465p'; printf '\\n---\\n'; nl -ba .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | sed -n '800,930p'; printf '\\n---\\n'; nl -ba .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '873,1015p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

---
  1425	  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
  1426	  // so the final response respects the advertised token budget.
  1427	  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
  1428	    ? attachSessionTransitionTrace(
  1429	      result as ContextResult & { content?: Array<{ text?: string; type?: string }> },
  1430	      sessionTransition,
  1431	    ) as ContextResult
  1432	    : result;
  1433	
  1434	  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
  1435	    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
  1436	    if (resumeContextItems.length > 0) {
  1437	      sessionLifecycle.resumedContextCount = resumeContextItems.length;
  1438	      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
  1439	        memoryId: item.memoryId,
  1440	        title: item.title,
  1441	        filePath: item.filePath,
  1442	        attentionScore: item.attentionScore,
  1443	      }));
  1444	      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
  1445	    }
  1446	  }
  1447	
  1448	  // T205: Enforce token budget AFTER all context injection
  1449	  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
  1450	  const tracedResult = budgetedResult;
  1451	
  1452	  // Phase 020: Attach graph context and query-intent routing metadata
  1453	  const responseData: ContextResult & Record<string, unknown> = { ...tracedResult };
  1454	  if (graphContextResult) {
  1455	    responseData.graphContext = graphContextResult;
  1456	  }
  1457	  if (queryIntentMetadata) {
  1458	    responseData.queryIntentRouting = queryIntentMetadata;
  1459	  }
  1460	  const structuralRoutingNudge = buildStructuralRoutingNudge(
  1461	    normalizedInput,
  1462	    queryIntentMetadata,
  1463	    graphContextResult,
  1464	  );
  1465	  if (structuralRoutingNudge) {

---
   800	        severity: 'MEDIUM',
   801	        field: 'context_type',
   802	        message: `frontmatter contextType is "${savedContextType || 'missing'}" but MEMORY METADATA is "${metadataContextType || 'missing'}"`,
   803	        fix: 'Render MEMORY METADATA context_type from the same resolved frontmatter contextType value',
   804	      });
   805	    }
   806	
   807	    const normalizedSavedTriggers = Array.from(new Set(savedTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
   808	    const normalizedMetadataTriggers = Array.from(new Set(metadataTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
   809	    if (metadataHasTriggerPhrases && JSON.stringify(normalizedSavedTriggers) !== JSON.stringify(normalizedMetadataTriggers)) {
   810	      issues.push({
   811	        checkId: 'DUP5',
   812	        severity: 'HIGH',
   813	        field: 'trigger_phrases',
   814	        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
   815	        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
   816	      });
   817	    }
   818	
   819	    const redundantSectionIdentityMatches = fileContent.match(/<!-- ANCHOR:[a-z0-9-]+ -->\s*\n<a id="[^"]+"><\/a>\s*\n(?:\s*\n)?##/gi) ?? [];
   820	    if (redundantSectionIdentityMatches.length > 0) {
   821	      issues.push({
   822	        checkId: 'DUP6',
   823	        severity: 'MEDIUM',
   824	        field: 'anchors',
   825	        message: `redundant section identity scaffolding detected in ${redundantSectionIdentityMatches.length} section opener(s)`,
   826	        fix: 'Keep markdown headers plus ANCHOR comments, and remove legacy HTML id scaffolding',
   827	      });
   828	    }
   829	
   830	    const inflatedFileRow = fileContent
   831	      .split('\n')
   832	      .map((line) => line.trim())
   833	      .find((line) => line.startsWith('| `') && countMergedFromClauses(line) >= 2);
   834	    if (inflatedFileRow) {
   835	      issues.push({
   836	        checkId: 'DUP7',
   837	        severity: 'MEDIUM',
   838	        field: 'files',
   839	        message: `FILES row description contains repeated merged provenance inflation: "${inflatedFileRow}"`,
   840	        fix: 'Move verbose merged provenance out of FILES descriptions and keep only one merged summary clause',
   841	      });
   842	    }
   843	
   844	    if (savedDescription) {
   845	      const genericDescriptions = [
   846	        'session focused on implementing and testing features',
   847	        'development session',
   848	        'context save',
   849	      ];
   850	      const isGenericDesc = genericDescriptions.some((entry) => savedDescription.toLowerCase().includes(entry));
   851	      if (isGenericDesc && payloadSummary.length > 20) {
   852	        issues.push({
   853	          checkId: 'PSR-6',
   854	          severity: 'LOW',
   855	          field: 'description',
   856	          message: 'Generic boilerplate description',
   857	          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
   858	        });
   859	      }
   860	    }
   861	
   862	    // CHECK-D1: overview truncation / ellipsis integrity.
   863	    if (payloadSummary.length > 0 && overview.length > 0) {
   864	    const trimmedOverview = overview.trimEnd();
   865	    const usesAsciiEllipsis = trimmedOverview.endsWith('...');
   866	    const usesUnicodeEllipsis = trimmedOverview.endsWith('…');
   867	    const overviewCore = (
   868	      usesAsciiEllipsis
   869	        ? trimmedOverview.slice(0, -3)
   870	        : usesUnicodeEllipsis
   871	          ? trimmedOverview.slice(0, -1)
   872	          : trimmedOverview
   873	    ).trimEnd();
   874	    const payloadOverflow = payloadSummary.length >= overviewCore.length + 40;
   875	    const nextChar = payloadSummary.charAt(overviewCore.length);
   876	    const coreEndsMidWord = /[A-Za-z0-9]$/.test(overviewCore) && /[A-Za-z0-9]/.test(nextChar);
   877	    const plainMidTokenEnding = !usesAsciiEllipsis && !usesUnicodeEllipsis && /[A-Za-z0-9]$/.test(trimmedOverview);
   878	
   879	      if (payloadOverflow && (usesAsciiEllipsis || coreEndsMidWord || plainMidTokenEnding)) {
   880	        issues.push({
   881	          checkId: 'D1',
   882	          severity: 'HIGH',
   883	          field: 'overview',
   884	          message: 'OVERVIEW appears truncated mid-token or with non-canonical ellipsis handling',
   885	          fix: 'Re-render the OVERVIEW from the full session summary using the boundary-safe truncation helper',
   886	        });
   887	      }
   888	    }
   889	
   890	    // CHECK-D2: lexical placeholder contamination.
   891	    if (payloadDecisions.length > 0 && DECISION_PLACEHOLDER_PATTERN.test(decisionsSection)) {
   892	      issues.push({
   893	        checkId: 'D2',
   894	        severity: 'HIGH',
   895	        field: 'decisions',
   896	        message: 'DECISIONS contains observation/user placeholder labels despite authored decisions in the payload',
   897	        fix: 'Preserve authored decision arrays before any lexical fallback branch runs',
   898	      });
   899	    }
   900	
   901	    // CHECK-D3: trigger phrase sanitization.
   902	    if (Object.values(d3Counts).some((count) => count > 0)) {
   903	      const details = [
   904	        d3Counts.path_fragment > 0 ? `path_fragment=${d3Counts.path_fragment}` : null,
   905	        d3Counts.standalone_stopword > 0 ? `stopword=${d3Counts.standalone_stopword}` : null,
   906	        d3Counts.synthetic_bigram > 0 ? `bigram=${d3Counts.synthetic_bigram}` : null,
   907	      ].filter(Boolean).join(', ');
   908	
   909	      issues.push({
   910	        checkId: 'D3',
   911	        severity: 'MEDIUM',
   912	        field: 'trigger_phrases',
   913	        message: `trigger_phrases contains unsanitized junk (${details})`,
   914	        fix: 'Run trigger phrases through the Phase 3 sanitizer before render and persist only the kept phrases',
   915	      });
   916	    }
   917	
   918	    // CHECK-D4: frontmatter vs metadata tier drift.
   919	    if (savedTier && metadataTier && savedTier !== metadataTier) {
   920	      issues.push({
   921	        checkId: 'D4',
   922	        severity: 'HIGH',
   923	        field: 'importance_tier',
   924	        message: `frontmatter is "${savedTier}" but MEMORY METADATA is "${metadataTier}"`,
   925	        fix: 'Render both importance_tier locations from the same resolved value',
   926	      });
   927	    }
   928	
   929	    // CHECK-D5: continuation signal without supersedes.
   930	    if (continuationPattern && supersedes.length === 0) {

---
   873	  const divergentSessionSource = hasSignificantFileCountDivergence(filesystemFileCount, capturedFileCount);
   874	  ruleResults.push({
   875	    ruleId: 'V10',
   876	    passed: !divergentSessionSource,
   877	    message: divergentSessionSource
   878	      ? `session source mismatch: filesystem_file_count=${filesystemFileCount}, captured_file_count=${capturedFileCount}`
   879	      : 'ok',
   880	  });
   881	
   882	  // V11: API error content leakage — detect error-dominated memory content
   883	  const ERROR_VOCAB = /\b(?:error|api_error|request_id|req_\w+|500|503|429|overloaded|internal.server)\b/i;
   884	  const API_ERROR_PATTERN = /\bAPI\s+Error:\s*\d{3}\b/i;
   885	  const JSON_ERROR_PATTERN = /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error|rate_limit_error|server_error)/i;
   886	  const descriptionValue = extractYamlValueFromContent(content, 'description') || '';
   887	  const hasErrorDescription = API_ERROR_PATTERN.test(descriptionValue) || JSON_ERROR_PATTERN.test(descriptionValue);
   888	  const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
   889	  const errorTriggerCount = triggerPhrases.filter((tp) => ERROR_VOCAB.test(tp)).length;
   890	  const errorDominatedTriggers = triggerPhrases.length > 0 && (errorTriggerCount / triggerPhrases.length) > 0.5;
   891	  const v11Failed = hasErrorDescription || hasErrorTitle || errorDominatedTriggers;
   892	  ruleResults.push({
   893	    ruleId: 'V11',
   894	    passed: !v11Failed,
   895	    message: v11Failed
   896	      ? `error content leakage: ${[
   897	          hasErrorDescription ? 'description' : '',
   898	          hasErrorTitle ? 'title' : '',
   899	          errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',
   900	        ].filter(Boolean).join(', ')}`
   901	      : 'ok',
   902	  });
   903	
   904	  // V12: Topical coherence — check if memory content overlaps with spec's trigger_phrases
   905	  // Skip when:
   906	  // - File is in a */memory/ directory (already validated by save pipeline, may use different terms)
   907	  // - File is a spec doc (spec.md, plan.md, checklist.md, etc.) — these define the spec itself
   908	  // - filePath is provided and matches known spec doc patterns
   909	  const isMemoryDirFile = options?.filePath ? /[/\\]memory[/\\]/.test(options.filePath) : false;
   910	  const isSpecDoc = options?.filePath
   911	    ? /[/\\](?:spec|plan|checklist|tasks|decision-record|implementation-summary|research|handover)\.md$/i.test(options.filePath)
   912	    : false;
   913	  let v12Failed = false;
   914	  let v12Message = 'ok';
   915	  if (specFolder && !isMemoryDirFile && !isSpecDoc) {
   916	    // T023: Normalize specFolder to an absolute path before resolving spec.md.
   917	    // If specFolder is already absolute, use it as-is; otherwise resolve relative
   918	    // to the current working directory.
   919	    const resolvedSpecFolder = resolveSpecFolderPath(specFolder);
   920	
   921	    // Try to find and read the spec.md file
   922	    let specTriggerPhrases: string[] = [];
   923	    if (resolvedSpecFolder) {
   924	      const specMdCandidates = [
   925	        path.resolve(resolvedSpecFolder, 'spec.md'),
   926	        // specFolder might be just a relative path or short name
   927	      ];
   928	      for (const candidate of specMdCandidates) {
   929	        if (fs.existsSync(candidate)) {
   930	          try {
   931	            const specContent = fs.readFileSync(candidate, 'utf-8');
   932	            specTriggerPhrases = parseYamlListFromContent(specContent, 'trigger_phrases');
   933	          } catch (error: unknown) {
   934	            const message = error instanceof Error ? error.message : String(error);
   935	            structuredLog('warn', 'Failed to read spec.md during V12 topical coherence validation', {
   936	              candidate,
   937	              specFolder,
   938	              error: message,
   939	            });
   940	          }
   941	          break;
   942	        }
   943	      }
   944	    }
   945	    if (specTriggerPhrases.length > 0) {
   946	      const lowerContent = content.toLowerCase();
   947	      const hasOverlap = specTriggerPhrases.some((phrase) => (
   948	        buildTopicalMatchVariants(phrase).some((variant) => lowerContent.includes(variant))
   949	      ));
   950	      if (!hasOverlap) {
   951	        v12Failed = true;
   952	        v12Message = `V12_TOPICAL_MISMATCH: zero of ${specTriggerPhrases.length} spec trigger_phrases found in memory content`;
   953	      }
   954	    }
   955	  }
   956	  ruleResults.push({
   957	    ruleId: 'V12',
   958	    passed: !v12Failed,
   959	    message: v12Message,
   960	  });
   961	
   962	  // V13: Frontmatter YAML integrity and content density
   963	  // Sub-check 1: YAML syntax errors in frontmatter (T017-T018)
   964	  // Sub-check 2: Content density — strip frontmatter block, count non-whitespace chars (T020)
   965	  let v13Failed = false;
   966	  let v13Message = 'ok';
   967	  if (frontMatterParseError) {
   968	    v13Failed = true;
   969	    v13Message = `malformed frontmatter YAML: ${frontMatterParseError}`;
   970	  } else {
   971	    // Content density check: strip the leading frontmatter block then count non-whitespace chars
   972	    const bodyText = content.replace(/^---\n[\s\S]*?\n---\n?/, '').replace(/```yaml\n[\s\S]*?\n```/gi, '');
   973	    const nonWhitespaceCount = (bodyText.match(/\S/g) ?? []).length;
   974	    if (nonWhitespaceCount < 50) {
   975	      v13Failed = true;
   976	      v13Message = `content density too low: ${nonWhitespaceCount} non-whitespace characters in body (minimum 50)`;
   977	    }
   978	  }
   979	  ruleResults.push({
   980	    ruleId: 'V13',
   981	    passed: !v13Failed,
   982	    message: v13Message,
   983	  });
   984	
   985	  // V14: Status/percentage contradiction — status=complete but percentage < 100 (T025)
   986	  // Emitted as a soft warning (blockOnWrite: false, blockOnIndex: false)
   987	  let v14Failed = false;
   988	  let v14Message = 'ok';
   989	  const statusValue = extractYamlValueFromContent(content, 'status');
   990	  const percentageValue = parseYamlIntegerFromContent(content, 'percentage');
   991	  if (
   992	    statusValue !== null &&
   993	    statusValue.toLowerCase() === 'complete' &&
   994	    percentageValue !== null &&
   995	    percentageValue < 100
   996	  ) {
   997	    v14Failed = true;
   998	    v14Message = `status/percentage contradiction: status=complete but percentage=${percentageValue}`;
   999	  }
  1000	  ruleResults.push({
  1001	    ruleId: 'V14',
  1002	    passed: !v14Failed,
  1003	    message: v14Message,
  1004	  });
  1005	
  1006	  // Enrich rule results with descriptive names from metadata for log output
  1007	  for (const result of ruleResults) {
  1008	    result.name = VALIDATION_RULE_METADATA[result.ruleId]?.name;
  1009	  }
  1010	
  1011	  const failedRules = ruleResults.filter((rule) => !rule.passed).map((rule) => rule.ruleId);
  1012	  const contaminationAudit: ContaminationAuditRecord = {
  1013	    stage: 'post-render',
  1014	    timestamp: new Date().toISOString(),
  1015	    patternsChecked: [

codex
I have enough to separate “missing feature” from “wrong layer.” I’m pulling a few final line-specific citations for Mex’s drift orchestration and score/reporting, then I’ll synthesize the recommendations around which existing features we should refactor versus keep as-is.
exec
/bin/zsh -lc "nl -ba src/drift/index.ts | sed -n '1,220p'; printf '\\n---\\n'; nl -ba src/types.ts | sed -n '1,180p'; printf '\\n---\\n'; nl -ba src/reporter.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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

---
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

---
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
/bin/zsh -lc "nl -ba src/drift/checkers/command.ts | sed -n '1,220p'; printf '\\n---\\n'; nl -ba src/drift/checkers/dependency.ts | sed -n '1,260p'; printf '\\n---\\n'; nl -ba src/drift/checkers/script-coverage.ts | sed -n '1,240p'; printf '\\n---\\n'; nl -ba src/drift/checkers/path.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
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

---
     1	import { readFileSync, existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import type { Claim, DriftIssue } from "../../types.js";
     4	
     5	/** Runtimes, platforms, databases, protocols, and architectural terms that appear in stack docs but aren't installable packages */
     6	const KNOWN_RUNTIMES = new Set([
     7	  "node.js", "node", "nodejs",
     8	  "python", "cpython",
     9	  "go", "golang",
    10	  "rust",
    11	  "ruby",
    12	  "java", "jdk", "jre",
    13	  "deno", "bun",
    14	  "swift", "kotlin", "elixir", "erlang", "php",
    15	  ".net", "dotnet", "c#", "csharp",
    16	  "sqlite", "sqlite3",
    17	  "postgresql", "postgres",
    18	  "mysql", "mariadb",
    19	  "mongodb", "mongo",
    20	  "redis",
    21	  "elasticsearch",
    22	  "dynamodb", "cassandra", "neo4j", "supabase", "neon",
    23	  "docker",
    24	  "kubernetes", "k8s",
    25	  "vercel", "netlify", "railway", "fly.io", "render",
    26	  "aws", "gcp", "azure", "cloudflare",
    27	  "s3", "ec2", "lambda", "ecs", "fargate",
    28	  "rest", "rest api", "graphql", "grpc", "websocket", "websockets",
    29	  "oauth", "oauth2", "jwt", "saml", "oidc",
    30	  "http", "https", "tcp", "udp",
    31	  "tailwind", "tailwind css", "tailwindcss",
    32	  "bootstrap", "sass", "less", "postcss",
    33	  "webpack", "vite", "esbuild", "turbopack", "rollup", "parcel",
    34	  "git", "github", "gitlab", "ci/cd", "nginx", "apache", "caddy",
    35	  "linux", "macos", "windows", "wasm", "webassembly",
    36	]);
    37	
    38	/** Check that claimed dependencies exist in manifests */
    39	export function checkDependencies(
    40	  claims: Claim[],
    41	  projectRoot: string
    42	): DriftIssue[] {
    43	  const issues: DriftIssue[] = [];
    44	  const deps = loadAllDependencies(projectRoot);
    45	  if (!deps) return issues;
    46	
    47	  const depClaims = claims.filter(
    48	    (c) => c.kind === "dependency" && !c.negated
    49	  );
    50	  const versionClaims = claims.filter(
    51	    (c) => c.kind === "version" && !c.negated
    52	  );
    53	
    54	  for (const claim of depClaims) {
    55	    const name = claim.value.toLowerCase();
    56	
    57	    // Skip known runtimes/platforms — they won't be in package.json
    58	    if (KNOWN_RUNTIMES.has(name)) continue;
    59	
    60	    // Fuzzy match: "React" → "react", "Express" → "express"
    61	    const found = deps.find(
    62	      (d) => d.name.toLowerCase() === name
    63	    );
    64	    if (!found) {
    65	      issues.push({
    66	        code: "DEPENDENCY_MISSING",
    67	        severity: "warning",
    68	        file: claim.source,
    69	        line: claim.line,
    70	        message: `Claimed dependency "${claim.value}" not found in any manifest`,
    71	        claim,
    72	      });
    73	    }
    74	  }
    75	
    76	  for (const claim of versionClaims) {
    77	    // Parse "React 18" or "Node v20"
    78	    const match = claim.value.match(/^(.+?)\s+v?(\d[\d.]*\S*)$/);
    79	    if (!match) continue;
    80	
    81	    const name = match[1].trim().toLowerCase();
    82	    const claimedVersion = match[2];
    83	    const found = deps.find(
    84	      (d) => d.name.toLowerCase() === name
    85	    );
    86	
    87	    if (found && !found.version.includes(claimedVersion)) {
    88	      issues.push({
    89	        code: "VERSION_MISMATCH",
    90	        severity: "warning",
    91	        file: claim.source,
    92	        line: claim.line,
    93	        message: `Claimed "${claim.value}" but manifest has version "${found.version}"`,
    94	        claim,
    95	      });
    96	    }
    97	  }
    98	
    99	  return issues;
   100	}
   101	
   102	interface DepEntry {
   103	  name: string;
   104	  version: string;
   105	}
   106	
   107	function loadAllDependencies(projectRoot: string): DepEntry[] | null {
   108	  const entries: DepEntry[] = [];
   109	
   110	  // package.json
   111	  const pkgPath = resolve(projectRoot, "package.json");
   112	  if (existsSync(pkgPath)) {
   113	    try {
   114	      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
   115	      for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
   116	        entries.push({ name, version: String(version) });
   117	      }
   118	      for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
   119	        entries.push({ name, version: String(version) });
   120	      }
   121	    } catch {
   122	      // skip
   123	    }
   124	  }
   125	
   126	  return entries.length ? entries : null;
   127	}

---
     1	import { readFileSync, existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import type { DriftIssue } from "../../types.js";
     4	
     5	/** npm lifecycle hooks and internal scripts that don't need documentation */
     6	const IGNORED_SCRIPTS = new Set([
     7	  "preinstall",
     8	  "install",
     9	  "postinstall",
    10	  "preuninstall",
    11	  "uninstall",
    12	  "postuninstall",
    13	  "prepublish",
    14	  "prepublishOnly",
    15	  "publish",
    16	  "postpublish",
    17	  "prepack",
    18	  "pack",
    19	  "postpack",
    20	  "prepare",
    21	  "preshrinkwrap",
    22	  "shrinkwrap",
    23	  "postshrinkwrap",
    24	]);
    25	
    26	/** Check that package.json scripts are mentioned somewhere in the scaffold */
    27	export function checkScriptCoverage(
    28	  scaffoldFiles: string[],
    29	  projectRoot: string
    30	): DriftIssue[] {
    31	  const scripts = loadPackageScripts(projectRoot);
    32	  if (!scripts) return [];
    33	
    34	  // Collect all scaffold text to search against
    35	  const scaffoldText = scaffoldFiles
    36	    .map((f) => {
    37	      try {
    38	        return readFileSync(f, "utf-8");
    39	      } catch {
    40	        return "";
    41	      }
    42	    })
    43	    .join("\n");
    44	
    45	  const issues: DriftIssue[] = [];
    46	
    47	  for (const script of scripts) {
    48	    // Skip lifecycle hooks
    49	    if (IGNORED_SCRIPTS.has(script)) continue;
    50	
    51	    // Skip pre/post variants of other scripts (e.g. pretest, postbuild)
    52	    if (
    53	      (script.startsWith("pre") && scripts.has(script.slice(3))) ||
    54	      (script.startsWith("post") && scripts.has(script.slice(4)))
    55	    ) {
    56	      continue;
    57	    }
    58	
    59	    // Skip colon variants if the base script is documented (e.g. dev:debug when dev exists)
    60	    if (script.includes(":")) {
    61	      const base = script.split(":")[0];
    62	      if (scaffoldText.includes(base)) continue;
    63	    }
    64	
    65	    // Check if the script name appears anywhere in scaffold files
    66	    if (!scaffoldText.includes(script)) {
    67	      issues.push({
    68	        code: "UNDOCUMENTED_SCRIPT",
    69	        severity: "warning",
    70	        file: "package.json",
    71	        line: null,
    72	        message: `Script "${script}" exists in package.json but is not mentioned in any scaffold file`,
    73	      });
    74	    }
    75	  }
    76	
    77	  return issues;
    78	}
    79	
    80	function loadPackageScripts(projectRoot: string): Set<string> | null {
    81	  const pkgPath = resolve(projectRoot, "package.json");
    82	  if (!existsSync(pkgPath)) return null;
    83	  try {
    84	    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    85	    const scripts = pkg.scripts ?? {};
    86	    return Object.keys(scripts).length ? new Set(Object.keys(scripts)) : null;
    87	  } catch {
    88	    return null;
    89	  }
    90	}

---
     1	import { existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import { globSync } from "glob";
     4	import type { Claim, DriftIssue } from "../../types.js";
     5	
     6	const PLACEHOLDER_WORDS = /(?:^|[/_-])(?:new|example|your|sample|my|foo|bar|placeholder|template)(?:[/_.-]|$)/i;
     7	
     8	/** Check that all claimed paths exist on disk */
     9	export function checkPaths(
    10	  claims: Claim[],
    11	  projectRoot: string,
    12	  scaffoldRoot: string
    13	): DriftIssue[] {
    14	  const issues: DriftIssue[] = [];
    15	  const pathClaims = claims.filter(
    16	    (c) => c.kind === "path" && !c.negated
    17	  );
    18	
    19	  for (const claim of pathClaims) {
    20	    if (pathExists(claim.value, projectRoot, scaffoldRoot)) continue;
    21	
    22	    // Downgrade to warning if: from a pattern file or path contains placeholder words.
    23	    // Bare filenames that aren't found even after recursive search are genuinely missing.
    24	    const isPattern = claim.source.includes("patterns/");
    25	    const isPlaceholder = PLACEHOLDER_WORDS.test(claim.value);
    26	    const severity = isPattern || isPlaceholder ? "warning" : "error";
    27	
    28	    issues.push({
    29	      code: "MISSING_PATH",
    30	      severity,
    31	      file: claim.source,
    32	      line: claim.line,
    33	      message: `Referenced path does not exist: ${claim.value}`,
    34	      claim,
    35	    });
    36	  }
    37	
    38	  return issues;
    39	}
    40	
    41	function pathExists(value: string, projectRoot: string, scaffoldRoot: string): boolean {
    42	  // Try project root first (e.g. src/index.ts)
    43	  if (existsSync(resolve(projectRoot, value))) return true;
    44	
    45	  // Try scaffold root (e.g. context/architecture.md when scaffold is in .mex/)
    46	  if (scaffoldRoot !== projectRoot) {
    47	    if (existsSync(resolve(scaffoldRoot, value))) return true;
    48	  }
    49	
    50	  // If path starts with .mex/, also check without that prefix
    51	  // (handles the case where this repo IS the scaffold, not deployed inside .mex/)
    52	  if (value.startsWith(".mex/")) {
    53	    const withoutPrefix = value.slice(".mex/".length);
    54	    if (existsSync(resolve(projectRoot, withoutPrefix))) return true;
    55	  }
    56	
    57	  // Bare filenames: search recursively — the file may exist in a subdirectory
    58	  if (!value.includes("/")) {
    59	    const matches = globSync(`**/${value}`, {
    60	      cwd: projectRoot,
    61	      ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
    62	      maxDepth: 5,
    63	    });
    64	    if (matches.length > 0) return true;
    65	  }
    66	
    67	  return false;
    68	}

codex
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: We should split our current “health” surface into storage health and knowledge-drift health
- **Source**: [external/src/drift/index.ts#L17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [external/src/types.ts#L31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L31), [memory-crud-health.ts#L223](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L223), [memory-crud-health.ts#L382](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L382), [post-save-review.ts#L807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [validate-memory-quality.ts#L873](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L873)
- **What it does**: Mex runs one explicit drift pipeline: discover scaffold files, extract typed claims, run per-file and cross-file checkers, then emit a single issue set with codes and severities. Our current architecture is split three ways: `memory_health` checks DB/provider/index integrity and auto-repair actions; `post-save-review` checks rendered-memory self-consistency; `validate-memory-quality` checks contamination and quality rules. Those are valuable, but they are not one coherent “knowledge truth” audit plane.
- **Why it matters for us**: Right now a repo can be “healthy” at the storage layer while still having stale or incomplete operational knowledge. Mex’s strongest architectural lesson is not any single checker, but the separation of “is the store healthy?” from “is the knowledge still true?” We should stop stretching `memory_health` to imply both.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: We should add a separate repo-activity freshness signal instead of overloading session/code-graph freshness
- **Source**: [external/src/drift/checkers/staleness.ts#L4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [external/src/git.ts#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L10), [session-resume.ts#L437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L437), [session-snapshot.ts#L210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L210), [memory-context.ts#L784](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L784), [memory-context.ts#L1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1434)
- **What it does**: Mex marks scaffold files stale on two axes: elapsed days and commits since last change. Our freshness story today is different: `session_resume` and `session_bootstrap` reason about code-graph freshness, availability, and resume context, while `memory_context` resume mode pulls memory search plus working-memory prompt context. None of those signals answer “has repo reality changed materially since this knowledge artifact was last touched?”
- **Why it matters for us**: This is a genuine refactor opportunity for our existing freshness model. Code-graph freshness is about structural index currency; session freshness is about conversational continuity. Neither should be treated as a proxy for documentation or memory freshness relative to repo churn.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Our repair architecture should emit structured issue bundles, not just hints plus internal auto-repair actions
- **Source**: [external/src/sync/brief-builder.ts#L7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [external/src/sync/brief-builder.ts#L41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L41), [external/src/sync/index.ts#L29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [memory-crud-health.ts#L419](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L419), [memory-crud-health.ts#L454](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L454), [session-bootstrap.ts#L94](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L94)
- **What it does**: Mex does not stop at “warning” strings. It groups issues by target file, includes the current file content, the issue list, nearby filesystem evidence, and optional git diff context, then re-runs verification after repair. Our existing repair surfaces are mostly storage-oriented actions like FTS rebuild, trigger cache refresh, orphan cleanup, and generic next-step hints.
- **Why it matters for us**: This is the deeper architectural version of the earlier repair-packet idea. The refactor is to make our diagnostics produce machine-usable repair context for knowledge surfaces, while keeping low-level auto-repair for storage problems. That would let bootstrap/health tools escalate from “here are hints” to “here is the bounded repair contract.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: We should reject Mex’s heuristic markdown-claim extraction as a primary authority model
- **Source**: [external/src/drift/claims.ts#L7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L7), [external/src/drift/claims.ts#L48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [external/src/drift/checkers/command.ts#L21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L21), [external/src/drift/checkers/dependency.ts#L38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [external/src/drift/checkers/script-coverage.ts#L26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [post-save-review.ts#L862](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L862), [validate-memory-quality.ts#L904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L904)
- **What it does**: Mex infers paths from inline code, commands from inline/code blocks, and dependencies from bold text under matching headings. That is clever and cheap, but it is still heuristic parsing of prose. Our current system already has more structured authorities: frontmatter, anchors, spec-folder linkage, and explicit rendered metadata checks.
- **Why it matters for us**: If we copy Mex’s architecture too literally, we would move our strongest validation surfaces from structured metadata toward prose mining. That would be a step backward for a system that already depends on exact anchors, spec IDs, and render-path consistency.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: If we add a pattern layer, it must be provenance-backed and quality-gated from creation time
- **Source**: [external/src/pattern/index.ts#L6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L6), [external/src/pattern/index.ts#L21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21), [external/src/pattern/index.ts#L58](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L58), [external/ROUTER.md#L64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L64), [post-save-review.ts#L807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [validate-memory-quality.ts#L962](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L962)
- **What it does**: Mex’s `pattern add` creates a pattern file with placeholders, appends an `INDEX.md` row with `[description]`, and relies on later human/AI cleanup. That matches Mex’s lightweight scaffold philosophy, but it also means the system can knowingly create incomplete artifacts that immediately need another pass.
- **Why it matters for us**: Earlier iterations already pointed toward a reusable task-pattern layer for Spec Kit Memory. The deeper conclusion here is that we should not copy Mex’s placeholder-first creation model. Our system already has stronger save-time and validation expectations, so any pattern subsystem should inherit those guarantees instead of bypassing them.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: A single numeric “knowledge health score” could help operators, but only as a secondary surface
- **Source**: [external/src/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scoring.ts), [external/src/reporter.ts#L16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16), [external/src/reporter.ts#L41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L41), [session-resume.ts#L499](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L499), [session-bootstrap.ts#L219](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219)
- **What it does**: Mex reduces heterogeneous drift into a top-line score and then still shows grouped issues by file. Our current system is richer on certainty labeling (`exact`, `estimated`, `defaulted`, `unknown`) and operational hints, but it lacks one fast “how bad is it?” number for knowledge drift.
- **Why it matters for us**: This is worth considering, but only after the health split above. A score without a clean issue taxonomy would be noisy. Once storage health and knowledge health are separate, a score could help triage large audits or CI summaries.
- **Recommendation**: prototype later
- **Impact**: low

## Sources Consulted
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.78
- Questions addressed: whether Mex implies a refactor of our health architecture, whether its freshness model should replace or extend ours, whether its repair loop changes how our diagnostics should emit outputs, whether its claim-extraction approach is safe for us to copy, whether its lightweight pattern creation should influence a future task-pattern layer, whether a numeric score is worth adopting.
- Questions answered: the strongest refactor is to separate storage integrity from knowledge drift; repo-activity freshness should become a new axis rather than replacing current session/code-graph freshness; repair context should become structured and target-specific; Mex’s heuristic prose-mining should not become our primary authority model; any future pattern layer should be stricter than Mex’s placeholder-first approach; a score is useful only after the audit model is cleaned up.

## Reflection
- What worked: reading Mex as a three-layer system, scanner plus drift engine plus sync loop, then comparing that to our own split across bootstrap, health, save review, and quality validation made the architectural gaps much clearer than checker-by-checker parity alone.
- What did not work: CocoIndex was not available for this pass, so I had to do the source tracing manually; the prompt’s `external/mex-main` path also did not match the checked-in snapshot, which actually lives directly under `external/`.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne specifically on authority boundaries: which parts are structured versus heuristic, whether they separate storage health from knowledge truth, and whether either system has a stronger provenance model for reusable task guidance than Mex’s placeholder-first pattern scaffolding.
hook: Stop
hook: Stop Completed
tokens used
134,030
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: We should split our current “health” surface into storage health and knowledge-drift health
- **Source**: [external/src/drift/index.ts#L17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [external/src/types.ts#L31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L31), [memory-crud-health.ts#L223](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L223), [memory-crud-health.ts#L382](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L382), [post-save-review.ts#L807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [validate-memory-quality.ts#L873](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L873)
- **What it does**: Mex runs one explicit drift pipeline: discover scaffold files, extract typed claims, run per-file and cross-file checkers, then emit a single issue set with codes and severities. Our current architecture is split three ways: `memory_health` checks DB/provider/index integrity and auto-repair actions; `post-save-review` checks rendered-memory self-consistency; `validate-memory-quality` checks contamination and quality rules. Those are valuable, but they are not one coherent “knowledge truth” audit plane.
- **Why it matters for us**: Right now a repo can be “healthy” at the storage layer while still having stale or incomplete operational knowledge. Mex’s strongest architectural lesson is not any single checker, but the separation of “is the store healthy?” from “is the knowledge still true?” We should stop stretching `memory_health` to imply both.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: We should add a separate repo-activity freshness signal instead of overloading session/code-graph freshness
- **Source**: [external/src/drift/checkers/staleness.ts#L4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [external/src/git.ts#L10](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L10), [session-resume.ts#L437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L437), [session-snapshot.ts#L210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L210), [memory-context.ts#L784](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L784), [memory-context.ts#L1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1434)
- **What it does**: Mex marks scaffold files stale on two axes: elapsed days and commits since last change. Our freshness story today is different: `session_resume` and `session_bootstrap` reason about code-graph freshness, availability, and resume context, while `memory_context` resume mode pulls memory search plus working-memory prompt context. None of those signals answer “has repo reality changed materially since this knowledge artifact was last touched?”
- **Why it matters for us**: This is a genuine refactor opportunity for our existing freshness model. Code-graph freshness is about structural index currency; session freshness is about conversational continuity. Neither should be treated as a proxy for documentation or memory freshness relative to repo churn.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Our repair architecture should emit structured issue bundles, not just hints plus internal auto-repair actions
- **Source**: [external/src/sync/brief-builder.ts#L7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [external/src/sync/brief-builder.ts#L41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L41), [external/src/sync/index.ts#L29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [memory-crud-health.ts#L419](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L419), [memory-crud-health.ts#L454](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L454), [session-bootstrap.ts#L94](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L94)
- **What it does**: Mex does not stop at “warning” strings. It groups issues by target file, includes the current file content, the issue list, nearby filesystem evidence, and optional git diff context, then re-runs verification after repair. Our existing repair surfaces are mostly storage-oriented actions like FTS rebuild, trigger cache refresh, orphan cleanup, and generic next-step hints.
- **Why it matters for us**: This is the deeper architectural version of the earlier repair-packet idea. The refactor is to make our diagnostics produce machine-usable repair context for knowledge surfaces, while keeping low-level auto-repair for storage problems. That would let bootstrap/health tools escalate from “here are hints” to “here is the bounded repair contract.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: We should reject Mex’s heuristic markdown-claim extraction as a primary authority model
- **Source**: [external/src/drift/claims.ts#L7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L7), [external/src/drift/claims.ts#L48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [external/src/drift/checkers/command.ts#L21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L21), [external/src/drift/checkers/dependency.ts#L38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [external/src/drift/checkers/script-coverage.ts#L26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [post-save-review.ts#L862](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L862), [validate-memory-quality.ts#L904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L904)
- **What it does**: Mex infers paths from inline code, commands from inline/code blocks, and dependencies from bold text under matching headings. That is clever and cheap, but it is still heuristic parsing of prose. Our current system already has more structured authorities: frontmatter, anchors, spec-folder linkage, and explicit rendered metadata checks.
- **Why it matters for us**: If we copy Mex’s architecture too literally, we would move our strongest validation surfaces from structured metadata toward prose mining. That would be a step backward for a system that already depends on exact anchors, spec IDs, and render-path consistency.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: If we add a pattern layer, it must be provenance-backed and quality-gated from creation time
- **Source**: [external/src/pattern/index.ts#L6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L6), [external/src/pattern/index.ts#L21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21), [external/src/pattern/index.ts#L58](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L58), [external/ROUTER.md#L64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L64), [post-save-review.ts#L807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [validate-memory-quality.ts#L962](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L962)
- **What it does**: Mex’s `pattern add` creates a pattern file with placeholders, appends an `INDEX.md` row with `[description]`, and relies on later human/AI cleanup. That matches Mex’s lightweight scaffold philosophy, but it also means the system can knowingly create incomplete artifacts that immediately need another pass.
- **Why it matters for us**: Earlier iterations already pointed toward a reusable task-pattern layer for Spec Kit Memory. The deeper conclusion here is that we should not copy Mex’s placeholder-first creation model. Our system already has stronger save-time and validation expectations, so any pattern subsystem should inherit those guarantees instead of bypassing them.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: A single numeric “knowledge health score” could help operators, but only as a secondary surface
- **Source**: [external/src/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scoring.ts), [external/src/reporter.ts#L16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16), [external/src/reporter.ts#L41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L41), [session-resume.ts#L499](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L499), [session-bootstrap.ts#L219](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219)
- **What it does**: Mex reduces heterogeneous drift into a top-line score and then still shows grouped issues by file. Our current system is richer on certainty labeling (`exact`, `estimated`, `defaulted`, `unknown`) and operational hints, but it lacks one fast “how bad is it?” number for knowledge drift.
- **Why it matters for us**: This is worth considering, but only after the health split above. A score without a clean issue taxonomy would be noisy. Once storage health and knowledge health are separate, a score could help triage large audits or CI summaries.
- **Recommendation**: prototype later
- **Impact**: low

## Sources Consulted
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.78
- Questions addressed: whether Mex implies a refactor of our health architecture, whether its freshness model should replace or extend ours, whether its repair loop changes how our diagnostics should emit outputs, whether its claim-extraction approach is safe for us to copy, whether its lightweight pattern creation should influence a future task-pattern layer, whether a numeric score is worth adopting.
- Questions answered: the strongest refactor is to separate storage integrity from knowledge drift; repo-activity freshness should become a new axis rather than replacing current session/code-graph freshness; repair context should become structured and target-specific; Mex’s heuristic prose-mining should not become our primary authority model; any future pattern layer should be stricter than Mex’s placeholder-first approach; a score is useful only after the audit model is cleaned up.

## Reflection
- What worked: reading Mex as a three-layer system, scanner plus drift engine plus sync loop, then comparing that to our own split across bootstrap, health, save review, and quality validation made the architectural gaps much clearer than checker-by-checker parity alone.
- What did not work: CocoIndex was not available for this pass, so I had to do the source tracing manually; the prompt’s `external/mex-main` path also did not match the checked-in snapshot, which actually lives directly under `external/`.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne specifically on authority boundaries: which parts are structured versus heuristic, whether they separate storage health from knowledge truth, and whether either system has a stronger provenance model for reusable task guidance than Mex’s placeholder-first pattern scaffolding.
