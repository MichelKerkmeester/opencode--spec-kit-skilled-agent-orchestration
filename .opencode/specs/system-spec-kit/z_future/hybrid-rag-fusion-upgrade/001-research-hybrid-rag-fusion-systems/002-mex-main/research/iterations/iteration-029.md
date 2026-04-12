## Assessment
- New information ratio: 0.44

## Recommended Next Focus
Design a concrete retrieval policy matrix for Spec Kit Memory with four explicit outcomes: `lexical-first`, `semantic-first`, `hybrid-balanced`, and `graph-first`. Tie each mode to query classes, required result attribution, degradation behavior, and eval queries so we can prove when BM25/FTS should dominate, when embeddings should dominate, and when Mex-style static drift checks should run as a separate integrity layer rather than inside the recall stack.
--- Iteration 27 ---
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
- **Why it matters**: This is excellent DX because the tool never traps the developer inside opaque automation. Spec Kit already has rich traces and dry-run save validation, but it lacks a similarly unified “show me the exact repair bundle” experience for memory repair, readiness recovery, or save troubleshooting.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex’s detect-fix-verify loop is a stronger maintenance workflow than our current toolbox-style repair model
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L102), [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [external/src/reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L763)
- **What it does**: `mex sync` runs drift detection, narrows to the right files, offers interactive or prompt mode, executes a repair pass, reruns drift detection, prints score delta, and loops until the user stops or the score reaches the target. The workflow is centered on closure, not just diagnosis.
- **Why it matters**: Spec Kit has the ingredients, not the same developer flow. We expose `memory_health`, `memory_index_scan`, `code_graph_scan`, `session_bootstrap`, save dry-runs, and traces, but developers still need to know which tool to call next and in what order. Mex’s loop is the DX pattern to steal: a guided “doctor/repair” command that owns diagnosis, repair suggestions, rerun, and stop conditions.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mex’s low-noise post-commit hook is a good hygiene pattern because it only interrupts on failure
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L111), [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L8), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L497)
- **What it does**: `mex watch` installs a post-commit hook that runs `check --quiet` and prints nothing on a perfect score. The hook is additive, marker-based, and removable without clobbering unrelated hook logic.
- **Why it matters**: Spec Kit already has filesystem watching for index maintenance, but that is infrastructure behavior, not developer-facing feedback. Mex shows a better DX pattern for background hygiene: silent when healthy, visible only when action is needed. That would fit nicely for optional local reminders about stale graph state, broken save quality, or degraded memory health.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Mex wins on command discoverability because it exposes a tiny, memorable verb set with sharp error messages
- **Source**: [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L8), [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts#L9), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L557), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L1531), [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684)
- **What it does**: Mex keeps the public surface to a few verbs: `setup`, `check`, `sync`, `init`, `pattern add`, `watch`, `commands`. It also fails crisply when you are inside `.mex`, when the scaffold is incomplete, or when there is no git repo. The `commands` subcommand doubles as a built-in cheat sheet.
- **Why it matters**: Spec Kit is more powerful, but its DX cost is real: 47 tools, multiple recovery surfaces, several maintenance tools, and separate scripts. We already partially compensate with `memory_context`, `session_bootstrap`, common-pattern docs, troubleshooting, and response hints, but Mex’s smaller surface is easier to teach, remember, and debug.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.42

## Recommended Next Focus
Define a concrete `spec-kit doctor` DX surface that maps existing capabilities into one guided flow: `bootstrap -> diagnose -> repair suggestion -> optional auto-repair -> recheck -> next call hints`. The highest-value follow-up is to design that command contract around current tools we already have: `session_bootstrap`, `memory_health`, `memory_save(dryRun)`, `code_graph_scan`, `memory_index_scan`, and trace-enabled retrieval responses.
--- Iteration 28 ---
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
# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

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
I’m treating this as a read-only research pass on the pre-approved `002-mex-main` phase folder, with no edits outside that scope. I’ll do a lightweight memory/context check first, then read Mex’s README, scaffold docs, CLI, drift engine, and checker implementations to turn the architecture into an ADR-style adopt/reject set.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "mex|002-mex-main|hybrid-rag-fusion" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I’ve confirmed the deep-research skill shape and there isn’t any obviously useful prior memory on this specific Mex phase, so I’m staying grounded in the source tree itself. Next I’m validating the phase folder and reading the canonical Mex contract files in the exact order the brief asks for so the ADR is evidence-first rather than inferred.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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


exec
/bin/zsh -lc "rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1564ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
The source layout is confirmed: this external copy is rooted directly under `external/`, not `external/mex-main`, so I’m following the same reading order against the real paths. I’m also checking the phase validator now so the final ADR can say whether the packet is actually in a clean strict state.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve got the scaffold contract and the validator result. Now I’m tracing the executable architecture: public CLI verbs, drift claim extraction and scoring, the sync brief pipeline, and the checker implementations so the final recommendations are tied to actual control flow rather than README marketing.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts | sed -n '1,240p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts | sed -n '1,220p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,280p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,280p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,220p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
     1	import { readFileSync } from "node:fs";
     2	import { extractFrontmatter } from "../markdown.js";
     3	import type { ScaffoldFrontmatter } from "../types.js";
     4	
     5	/** Read a scaffold file and extract its YAML frontmatter */
     6	export function parseFrontmatter(
     7	  filePath: string
     8	): ScaffoldFrontmatter | null {
     9	  try {
    10	    const content = readFileSync(filePath, "utf-8");
    11	    return extractFrontmatter(content);
    12	  } catch {
    13	    return null;
    14	  }
    15	}
     1	import type { DriftIssue, Severity } from "../types.js";
     2	
     3	const SEVERITY_COST: Record<Severity, number> = {
     4	  error: 10,
     5	  warning: 3,
     6	  info: 1,
     7	};
     8	
     9	/** Compute drift score from 0-100. Starts at 100, deducts per issue. */
    10	export function computeScore(issues: DriftIssue[]): number {
    11	  let score = 100;
    12	  for (const issue of issues) {
    13	    score -= SEVERITY_COST[issue.severity];
    14	  }
    15	  return Math.max(0, Math.min(100, score));
    16	}

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts | sed -n '1,280p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts | sed -n '1,240p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts | sed -n '1,240p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
     1	import { existsSync } from "node:fs";
     2	import { resolve, dirname } from "node:path";
     3	import type { DriftIssue, ScaffoldFrontmatter } from "../../types.js";
     4	
     5	/** Check that all YAML frontmatter edge targets exist */
     6	export function checkEdges(
     7	  frontmatter: ScaffoldFrontmatter | null,
     8	  filePath: string,
     9	  source: string,
    10	  projectRoot: string,
    11	  scaffoldRoot: string
    12	): DriftIssue[] {
    13	  if (!frontmatter?.edges) return [];
    14	
    15	  const issues: DriftIssue[] = [];
    16	
    17	  for (const edge of frontmatter.edges) {
    18	    if (!edge.target) continue;
    19	
    20	    // Try project root, then scaffold root
    21	    const fromProject = resolve(projectRoot, edge.target);
    22	    const fromScaffold = resolve(scaffoldRoot, edge.target);
    23	    if (!existsSync(fromProject) && !existsSync(fromScaffold)) {
    24	      issues.push({
    25	        code: "DEAD_EDGE",
    26	        severity: "error",
    27	        file: source,
    28	        line: null,
    29	        message: `Frontmatter edge target does not exist: ${edge.target}`,
    30	      });
    31	    }
    32	  }
    33	
    34	  return issues;
    35	}
     1	import { readFileSync, existsSync } from "node:fs";
     2	import { resolve, basename } from "node:path";
     3	import { globSync } from "glob";
     4	import type { DriftIssue } from "../../types.js";
     5	
     6	/** Cross-reference patterns/INDEX.md with actual pattern files */
     7	export function checkIndexSync(projectRoot: string, scaffoldRoot: string): DriftIssue[] {
     8	  // Try scaffold root first (deployed as .mex/), then project root
     9	  let patternsDir = resolve(scaffoldRoot, "patterns");
    10	  if (!existsSync(patternsDir)) {
    11	    patternsDir = resolve(projectRoot, "patterns");
    12	  }
    13	  const indexPath = resolve(patternsDir, "INDEX.md");
    14	
    15	  if (!existsSync(indexPath)) return [];
    16	  if (!existsSync(patternsDir)) return [];
    17	
    18	  const issues: DriftIssue[] = [];
    19	
    20	  // Get actual pattern files (exclude INDEX.md and README.md)
    21	  const patternFiles = globSync("*.md", { cwd: patternsDir, ignore: ["node_modules/**"] })
    22	    .filter((f) => f !== "INDEX.md" && f !== "README.md");
    23	
    24	  // Parse INDEX.md for referenced files (strip HTML comments first)
    25	  const rawContent = readFileSync(indexPath, "utf-8");
    26	  const indexContent = rawContent.replace(/<!--[\s\S]*?-->/g, "");
    27	  const referencedFiles = new Set<string>();
    28	  const linkPattern = /\[.*?\]\((.+?\.md(?:#[\w-]+)?)\)/g;
    29	  let match;
    30	  while ((match = linkPattern.exec(indexContent)) !== null) {
    31	    // Strip anchor fragments for file existence checks
    32	    referencedFiles.add(match[1].replace(/#.*$/, ""));
    33	  }
    34	
    35	  // Also match bare backtick references
    36	  const backtickPattern = /`([\w-]+\.md)`/g;
    37	  while ((match = backtickPattern.exec(indexContent)) !== null) {
    38	    referencedFiles.add(match[1]);
    39	  }
    40	
    41	  // Check: pattern files not in INDEX
    42	  for (const file of patternFiles) {
    43	    if (!referencedFiles.has(file)) {
    44	      issues.push({
    45	        code: "INDEX_MISSING_ENTRY",
    46	        severity: "warning",
    47	        file: "patterns/INDEX.md",
    48	        line: null,
    49	        message: `Pattern file patterns/${file} exists but is not referenced in INDEX.md`,
    50	      });
    51	    }
    52	  }
    53	
    54	  // Check: INDEX references that don't exist as files
    55	  for (const ref of referencedFiles) {
    56	    const refPath = resolve(patternsDir, ref);
    57	    if (!existsSync(refPath)) {
    58	      issues.push({
    59	        code: "INDEX_ORPHAN_ENTRY",
    60	        severity: "warning",
    61	        file: "patterns/INDEX.md",
    62	        line: null,
    63	        message: `INDEX.md references ${ref} but the file does not exist`,
    64	      });
    65	    }
    66	  }
    67	
    68	  return issues;
    69	}

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import type { Claim, DriftIssue } from "../../types.js";
     2	
     3	/** Detect contradictions across scaffold files */
     4	export function checkCrossFile(claims: Claim[]): DriftIssue[] {
     5	  const issues: DriftIssue[] = [];
     6	
     7	  // Group version claims by dependency name
     8	  const versionsByDep = new Map<string, Claim[]>();
     9	  for (const claim of claims.filter((c) => c.kind === "version" && !c.negated)) {
    10	    const match = claim.value.match(/^(.+?)\s+v?(\d[\d.]*\S*)$/);
    11	    if (!match) continue;
    12	    const depName = match[1].trim().toLowerCase();
    13	    if (!versionsByDep.has(depName)) versionsByDep.set(depName, []);
    14	    versionsByDep.get(depName)!.push(claim);
    15	  }
    16	
    17	  // Check for conflicting versions across different files
    18	  for (const [dep, versionClaims] of versionsByDep) {
    19	    if (versionClaims.length < 2) continue;
    20	
    21	    const uniqueVersions = new Set(versionClaims.map((c) => c.value));
    22	    if (uniqueVersions.size > 1) {
    23	      const sources = versionClaims
    24	        .map((c) => `${c.source}:${c.line} says "${c.value}"`)
    25	        .join(", ");
    26	      issues.push({
    27	        code: "CROSS_FILE_CONFLICT",
    28	        severity: "error",
    29	        file: versionClaims[0].source,
    30	        line: versionClaims[0].line,
    31	        message: `Conflicting versions for "${dep}": ${sources}`,
    32	      });
    33	    }
    34	  }
    35	
    36	  // Group command claims that reference the same script
    37	  const commandsByScript = new Map<string, Claim[]>();
    38	  for (const claim of claims.filter((c) => c.kind === "command" && !c.negated)) {
    39	    const npmMatch = claim.value.match(
    40	      /^(?:npm\s+run|yarn|pnpm|bun\s+run)\s+(\S+)/
    41	    );
    42	    if (npmMatch) {
    43	      const script = npmMatch[1];
    44	      if (!commandsByScript.has(script)) commandsByScript.set(script, []);
    45	      commandsByScript.get(script)!.push(claim);
    46	    }
    47	  }
    48	
    49	  // Check for same script referenced with different package managers
    50	  for (const [script, cmdClaims] of commandsByScript) {
    51	    if (cmdClaims.length < 2) continue;
    52	    const fromDifferentFiles = new Set(cmdClaims.map((c) => c.source)).size > 1;
    53	    if (!fromDifferentFiles) continue;
    54	
    55	    const managers = new Set(
    56	      cmdClaims.map((c) => c.value.split(/\s/)[0])
    57	    );
    58	    if (managers.size > 1) {
    59	      issues.push({
    60	        code: "CROSS_FILE_CONFLICT",
    61	        severity: "warning",
    62	        file: cmdClaims[0].source,
    63	        line: cmdClaims[0].line,
    64	        message: `Script "${script}" referenced with different package managers across files: ${[...managers].join(", ")}`,
    65	      });
    66	    }
    67	  }
    68	
    69	  return issues;
    70	}
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
     1	import { describe, it, expect, beforeEach, afterEach } from "vitest";
     2	import {
     3	  mkdtempSync,
     4	  writeFileSync,
     5	  mkdirSync,
     6	  rmSync,
     7	} from "node:fs";
     8	import { join } from "node:path";
     9	import { tmpdir } from "node:os";
    10	import { checkPaths } from "../src/drift/checkers/path.js";
    11	import { checkEdges } from "../src/drift/checkers/edges.js";
    12	import { checkCommands } from "../src/drift/checkers/command.js";
    13	import { checkDependencies } from "../src/drift/checkers/dependency.js";
    14	import { checkCrossFile } from "../src/drift/checkers/cross-file.js";
    15	import { checkIndexSync } from "../src/drift/checkers/index-sync.js";
    16	import type { Claim, ScaffoldFrontmatter } from "../src/types.js";
    17	
    18	let tmpDir: string;
    19	
    20	beforeEach(() => {
    21	  tmpDir = mkdtempSync(join(tmpdir(), "mex-checker-"));
    22	});
    23	
    24	afterEach(() => {
    25	  rmSync(tmpDir, { recursive: true, force: true });
    26	});
    27	
    28	function claim(overrides: Partial<Claim> & { kind: Claim["kind"]; value: string }): Claim {
    29	  return {
    30	    source: "test.md",
    31	    line: 1,
    32	    section: null,
    33	    negated: false,
    34	    ...overrides,
    35	  };
    36	}
    37	
    38	// ── Path Checker ──
    39	
    40	describe("checkPaths", () => {
    41	  it("reports missing paths", () => {
    42	    const claims = [claim({ kind: "path", value: "src/missing.ts" })];
    43	    const issues = checkPaths(claims, tmpDir, tmpDir);
    44	    expect(issues).toHaveLength(1);
    45	    expect(issues[0].code).toBe("MISSING_PATH");
    46	  });
    47	
    48	  it("passes for existing paths", () => {
    49	    mkdirSync(join(tmpDir, "src"), { recursive: true });
    50	    writeFileSync(join(tmpDir, "src/index.ts"), "");
    51	    const claims = [claim({ kind: "path", value: "src/index.ts" })];
    52	    const issues = checkPaths(claims, tmpDir, tmpDir);
    53	    expect(issues).toHaveLength(0);
    54	  });
    55	
    56	  it("skips negated claims", () => {
    57	    const claims = [
    58	      claim({ kind: "path", value: "src/missing.ts", negated: true }),
    59	    ];
    60	    const issues = checkPaths(claims, tmpDir, tmpDir);
    61	    expect(issues).toHaveLength(0);
    62	  });
    63	
    64	  it("resolves .mex/ prefixed paths to root", () => {
    65	    writeFileSync(join(tmpDir, "ROUTER.md"), "# Router");
    66	    const claims = [claim({ kind: "path", value: ".mex/ROUTER.md" })];
    67	    const issues = checkPaths(claims, tmpDir, tmpDir);
    68	    expect(issues).toHaveLength(0);
    69	  });
    70	
    71	  it("resolves paths relative to scaffoldRoot when deployed as .mex/", () => {
    72	    const mexDir = join(tmpDir, ".mex");
    73	    mkdirSync(join(mexDir, "context"), { recursive: true });
    74	    writeFileSync(join(mexDir, "context/architecture.md"), "# Arch");
    75	    const claims = [claim({ kind: "path", value: "context/architecture.md" })];
    76	    const issues = checkPaths(claims, tmpDir, mexDir);
    77	    expect(issues).toHaveLength(0);
    78	  });
    79	
    80	  it("downgrades to warning for paths from pattern files", () => {
    81	    const claims = [claim({ kind: "path", value: "src/missing.ts", source: "patterns/add-feature.md" })];
    82	    const issues = checkPaths(claims, tmpDir, tmpDir);
    83	    expect(issues).toHaveLength(1);
    84	    expect(issues[0].severity).toBe("warning");
    85	  });
    86	
    87	  it("downgrades to warning for paths with placeholder words", () => {
    88	    const claims = [
    89	      claim({ kind: "path", value: "api_clients/new_service_client.py" }),
    90	      claim({ kind: "path", value: "src/example_module.ts" }),
    91	      claim({ kind: "path", value: "lib/your_config.json" }),
    92	    ];
    93	    const issues = checkPaths(claims, tmpDir, tmpDir);
    94	    expect(issues).toHaveLength(3);
    95	    for (const issue of issues) {
    96	      expect(issue.severity).toBe("warning");
    97	    }
    98	  });
    99	
   100	  it("reports error for bare filenames not found anywhere", () => {
   101	    const claims = [
   102	      claim({ kind: "path", value: "conversation_state.py", source: "context/architecture.md" }),
   103	      claim({ kind: "path", value: "server.py", source: "context/architecture.md" }),
   104	    ];
   105	    const issues = checkPaths(claims, tmpDir, tmpDir);
   106	    expect(issues).toHaveLength(2);
   107	    for (const issue of issues) {
   108	      expect(issue.severity).toBe("error");
   109	    }
   110	  });
   111	
   112	  it("keeps error severity for real missing paths with directories", () => {
   113	    const claims = [claim({ kind: "path", value: "src/auth/handler.ts", source: "context/architecture.md" })];
   114	    const issues = checkPaths(claims, tmpDir, tmpDir);
   115	    expect(issues).toHaveLength(1);
   116	    expect(issues[0].severity).toBe("error");
   117	  });
   118	});
   119	
   120	// ── Edges Checker ──
   121	
   122	describe("checkEdges", () => {
   123	  it("reports dead edge targets", () => {
   124	    const fm: ScaffoldFrontmatter = {
   125	      edges: [{ target: "context/missing.md" }],
   126	    };
   127	    const issues = checkEdges(fm, "router.md", "ROUTER.md", tmpDir, tmpDir);
   128	    expect(issues).toHaveLength(1);
   129	    expect(issues[0].code).toBe("DEAD_EDGE");
   130	  });
   131	
   132	  it("passes for existing edge targets", () => {
   133	    mkdirSync(join(tmpDir, "context"), { recursive: true });
   134	    writeFileSync(join(tmpDir, "context/arch.md"), "");
   135	    const fm: ScaffoldFrontmatter = {
   136	      edges: [{ target: "context/arch.md" }],
   137	    };
   138	    const issues = checkEdges(fm, "router.md", "ROUTER.md", tmpDir, tmpDir);
   139	    expect(issues).toHaveLength(0);
   140	  });
   141	
   142	  it("resolves edge targets relative to scaffoldRoot", () => {
   143	    const mexDir = join(tmpDir, ".mex");
   144	    mkdirSync(join(mexDir, "context"), { recursive: true });
   145	    writeFileSync(join(mexDir, "context/stack.md"), "");
   146	    const fm: ScaffoldFrontmatter = {
   147	      edges: [{ target: "context/stack.md" }],
   148	    };
   149	    const issues = checkEdges(fm, "router.md", "ROUTER.md", tmpDir, mexDir);
   150	    expect(issues).toHaveLength(0);
   151	  });
   152	
   153	  it("returns empty for no frontmatter", () => {
   154	    expect(checkEdges(null, "f", "f", tmpDir, tmpDir)).toEqual([]);
   155	  });
   156	
   157	  it("returns empty for no edges", () => {
   158	    expect(checkEdges({ name: "test" }, "f", "f", tmpDir, tmpDir)).toEqual([]);
   159	  });
   160	});
   161	
   162	// ── Command Checker ──
   163	
   164	describe("checkCommands", () => {
   165	  it("reports dead npm scripts", () => {
   166	    writeFileSync(
   167	      join(tmpDir, "package.json"),
   168	      JSON.stringify({ scripts: { build: "tsc" } })
   169	    );
   170	    const claims = [claim({ kind: "command", value: "npm run test" })];
   171	    const issues = checkCommands(claims, tmpDir);
   172	    expect(issues).toHaveLength(1);
   173	    expect(issues[0].code).toBe("DEAD_COMMAND");
   174	  });
   175	
   176	  it("passes for existing npm scripts", () => {
   177	    writeFileSync(
   178	      join(tmpDir, "package.json"),
   179	      JSON.stringify({ scripts: { build: "tsc", test: "vitest" } })
   180	    );
   181	    const claims = [
   182	      claim({ kind: "command", value: "npm run build" }),
   183	      claim({ kind: "command", value: "npm run test" }),
   184	    ];
   185	    const issues = checkCommands(claims, tmpDir);
   186	    expect(issues).toHaveLength(0);
   187	  });
   188	
   189	  it("reports dead make targets", () => {
   190	    writeFileSync(join(tmpDir, "Makefile"), "build:\n\tgcc main.c\n");
   191	    const claims = [claim({ kind: "command", value: "make deploy" })];
   192	    const issues = checkCommands(claims, tmpDir);
   193	    expect(issues).toHaveLength(1);
   194	    expect(issues[0].code).toBe("DEAD_COMMAND");
   195	  });
   196	
   197	  it("skips when no manifest exists", () => {
   198	    const claims = [claim({ kind: "command", value: "npm run build" })];
   199	    const issues = checkCommands(claims, tmpDir);
   200	    expect(issues).toHaveLength(0);
   201	  });
   202	});
   203	
   204	// ── Dependency Checker ──
   205	
   206	describe("checkDependencies", () => {
   207	  it("reports missing dependencies", () => {
   208	    writeFileSync(
   209	      join(tmpDir, "package.json"),
   210	      JSON.stringify({ dependencies: { express: "^4.18.0" } })
   211	    );
   212	    const claims = [claim({ kind: "dependency", value: "Prisma" })];
   213	    const issues = checkDependencies(claims, tmpDir);
   214	    expect(issues).toHaveLength(1);
   215	    expect(issues[0].code).toBe("DEPENDENCY_MISSING");
   216	  });
   217	
   218	  it("passes for existing dependencies (case-insensitive)", () => {
   219	    writeFileSync(
   220	      join(tmpDir, "package.json"),
   221	      JSON.stringify({ dependencies: { express: "^4.18.0" } })
   222	    );
   223	    const claims = [claim({ kind: "dependency", value: "Express" })];
   224	    const issues = checkDependencies(claims, tmpDir);
   225	    expect(issues).toHaveLength(0);
   226	  });
   227	
   228	  it("returns empty when no manifest exists", () => {
   229	    const claims = [claim({ kind: "dependency", value: "Express" })];
   230	    const issues = checkDependencies(claims, tmpDir);
   231	    expect(issues).toHaveLength(0);
   232	  });
   233	});
   234	
   235	// ── Cross-file Checker ──
   236	
   237	describe("checkCrossFile", () => {
   238	  it("detects conflicting versions across files", () => {
   239	    const claims = [
   240	      claim({ kind: "version", value: "React 18", source: "stack.md" }),
   241	      claim({ kind: "version", value: "React 17", source: "arch.md" }),
   242	    ];
   243	    const issues = checkCrossFile(claims);
   244	    expect(issues).toHaveLength(1);
   245	    expect(issues[0].code).toBe("CROSS_FILE_CONFLICT");
   246	  });
   247	
   248	  it("no conflict for same version across files", () => {
   249	    const claims = [
   250	      claim({ kind: "version", value: "React 18", source: "stack.md" }),
   251	      claim({ kind: "version", value: "React 18", source: "arch.md" }),
   252	    ];
   253	    const issues = checkCrossFile(claims);
   254	    expect(issues).toHaveLength(0);
   255	  });
   256	});
   257	
   258	// ── Index Sync Checker ──
   259	
   260	describe("checkIndexSync", () => {
   261	  it("reports orphan entries in INDEX.md", () => {
   262	    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
   263	    writeFileSync(
   264	      join(tmpDir, "patterns/INDEX.md"),
   265	      "| [missing.md](missing.md) | A pattern |"
   266	    );
   267	    const issues = checkIndexSync(tmpDir, tmpDir);
   268	    expect(issues).toHaveLength(1);
   269	    expect(issues[0].code).toBe("INDEX_ORPHAN_ENTRY");
   270	  });
   271	
   272	  it("reports pattern files missing from INDEX", () => {
   273	    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
   274	    writeFileSync(join(tmpDir, "patterns/INDEX.md"), "# Index\n\nEmpty.");
   275	    writeFileSync(join(tmpDir, "patterns/auth.md"), "# Auth pattern");
   276	    const issues = checkIndexSync(tmpDir, tmpDir);
   277	    expect(issues).toHaveLength(1);
   278	    expect(issues[0].code).toBe("INDEX_MISSING_ENTRY");
   279	  });
   280	
   281	  it("passes when INDEX and files match", () => {
   282	    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
   283	    writeFileSync(
   284	      join(tmpDir, "patterns/INDEX.md"),
   285	      "| [auth.md](auth.md) | Auth pattern |"
   286	    );
   287	    writeFileSync(join(tmpDir, "patterns/auth.md"), "# Auth");
   288	    const issues = checkIndexSync(tmpDir, tmpDir);
   289	    expect(issues).toHaveLength(0);
   290	  });
   291	
   292	  it("ignores references inside HTML comments", () => {
   293	    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
   294	    writeFileSync(
   295	      join(tmpDir, "patterns/INDEX.md"),
   296	      "<!-- [example.md](example.md) is a template -->\n\n| Pattern | Use when |\n|---|---|"
   297	    );
   298	    const issues = checkIndexSync(tmpDir, tmpDir);
   299	    expect(issues).toHaveLength(0);
   300	  });
   301	});

codex
The checker layer is clear now: Mex really is two different systems glued together, a zero-token static integrity pass and a separate AI repair loop. I’m pulling the matching Spec Kit Memory evidence next so the accept/reject calls are anchored in what we already have instead of hand-wavy overlap claims.
exec
/bin/zsh -lc 'rg -n "memory_context|memory_search|memory_match_triggers|memory_causal_link|code_graph_query|session_bootstrap|generate-context" .opencode/skill/system-spec-kit/mcp_server/README.md .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/skill/system-spec-kit/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/SKILL.md:67:  - `memory/` → uses generate-context.js script
.opencode/skill/system-spec-kit/SKILL.md:355:**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`.
.opencode/skill/system-spec-kit/SKILL.md:487:- Tracking: Saves pass the target spec folder alongside structured JSON via the generate-context script
.opencode/skill/system-spec-kit/SKILL.md:511:- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
.opencode/skill/system-spec-kit/SKILL.md:526:The generate-context script supports nested spec folder paths (parent/child format):
.opencode/skill/system-spec-kit/SKILL.md:530:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit/121-script-audit","sessionSummary":"..."}' system-spec-kit/121-script-audit
.opencode/skill/system-spec-kit/SKILL.md:533:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"121-script-audit","sessionSummary":"..."}' 121-script-audit
.opencode/skill/system-spec-kit/SKILL.md:536:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"specs/system-spec-kit/121-script-audit","sessionSummary":"..."}' specs/system-spec-kit/121-script-audit
.opencode/skill/system-spec-kit/SKILL.md:539:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit","sessionSummary":"..."}' system-spec-kit
.opencode/skill/system-spec-kit/SKILL.md:572:| `memory_context()`              | L1    | Unified entry point — modes: auto, quick, deep, focused, resume |
.opencode/skill/system-spec-kit/SKILL.md:573:| `memory_search()`               | L2    | 5-channel hybrid retrieval with intent-aware routing, channel normalization, graph/degree signals, reranking, and filtered output |
.opencode/skill/system-spec-kit/SKILL.md:575:| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
.opencode/skill/system-spec-kit/SKILL.md:593:**memory_context() — Mode Routing:**
.opencode/skill/system-spec-kit/SKILL.md:602:**memory_search() — Key Rules:**
.opencode/skill/system-spec-kit/SKILL.md:631:- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility
.opencode/skill/system-spec-kit/SKILL.md:656:| `SPECKIT_ADAPTIVE_FUSION`     | on      | Enables intent-aware weighted RRF with 7 task-type profiles in `memory_search()` (set `false` to disable) |
.opencode/skill/system-spec-kit/SKILL.md:755:**Cross-runtime handling:** Claude and Gemini use SessionStart hook scripts. OpenCode has a transport/plugin implementation, but operationally should still be treated as bootstrap-first when startup surfacing is unavailable. Codex remains bootstrap-based through its session-start agent bootstrap (not a native SessionStart hook). Copilot startup context depends on local hook configuration or wrapper wiring when present. Use `session_bootstrap()` for fresh start or after `/clear`, `session_resume()` for reconnect-style recovery when bootstrap is unnecessary, and `session_health()` only to re-check drift or readiness mid-session.
.opencode/skill/system-spec-kit/SKILL.md:768:| `code_graph_query` | Query relationships: outline, calls_from/to, imports_from/to |
.opencode/skill/system-spec-kit/SKILL.md:784:**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.
.opencode/skill/system-spec-kit/SKILL.md:802:| `session_bootstrap` | Complete session bootstrap (resume + health) in one call |
.opencode/skill/system-spec-kit/SKILL.md:884:- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
.opencode/skill/system-spec-kit/SKILL.md:941:| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/` |
.opencode/skill/system-spec-kit/SKILL.md:969:| Memory gen        | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file creation              |
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:62:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:75:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:76:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:546://# sourceMappingURL=generate-context.js.map
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:996:##### `memory_causal_link`
.opencode/skill/system-spec-kit/mcp_server/README.md:1060:##### `code_graph_query`
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '1,260p'
nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   221	---
   222	
   223	#### 3.1.1 HYBRID SEARCH
   224	
   225	When you search for something, the system checks several sources at once. Think of a librarian who checks the card catalog, the shelf labels, the reading room sign-out sheet and the recommendation board all at the same time.
   226	
   227	**Five core search channels** work together, with **CocoIndex** available as an external semantic code search bridge:
   228	
   229	| Channel | How It Works | Good For |
   230	|---------|-------------|----------|
   231	| **Vector** | Compares the meaning of your query against stored embeddings | Finding related content even when the words are different |
   232	| **FTS5** | Full-text search on exact words and phrases | Looking up specific terms or error messages |
   233	| **BM25** | Keyword relevance scoring (like a search engine) | Ranking results when you know roughly what you want |
   234	| **Causal Graph** | Follows causal links between memories | "Why did we choose this?" questions |
   235	| **Degree** | Scores memories by graph connectivity, weighted by edge type (`caused`=1.0, `enabled`=0.75, `supports`=0.5) | Finding important hub memories (capped to prevent over-influence) |
   236	| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
   237	
   238	**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
   239	
   240	**Reciprocal Rank Fusion (RRF)** combines all channel results using the formula `1/(K + rank)`. The K parameter is tuned per query intent through sensitivity analysis across K values {10, 20, 40, 60, 80, 100, 120}. A memory that scores well in multiple channels rises to the top because RRF gives exponential weight to high-ranking items while still including lower-ranked contributions.
   241	
   242	**Channel min-representation** guarantees every active channel gets at least one result in the final set, preventing a single dominant channel from drowning out useful evidence.
   243	
   244	**Quality-aware 3-tier fallback** activates when graph and semantic channels miss:
   245	
   246	| Fallback Tier | Channel | When It Kicks In |
   247	|---------------|---------|------------------|
   248	| Tier 1 | FTS5 full-text search | Graph and semantic channels return weak results |
   249	| Tier 2 | BM25 keyword scoring | FTS5 results below confidence floor |
   250	| Tier 3 | Grep/Glob filesystem search | Still poor results after BM25 |
   251	
   252	**Confidence truncation** cuts off results at 2x the median score gap so you never get a long tail of irrelevant items.
   253	
   254	**Evidence gap detection** (TRM Z-score) flags when retrieved memories do not adequately cover the query and suggests broadening the search.
   255	
   256	**Calibrated overlap bonus** rewards memories found by multiple channels at once. The bonus scales based on how many channels found the result and how confidently they scored it, rather than applying a flat bonus.
   257	
   258	**Tool-level TTL cache** remembers recent results for 60 seconds. When you save, update or delete a memory, the cache for affected searches clears automatically. You never see stale results.
   259	
   260	---
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Generate Context
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
    21	var __importStar = (this && this.__importStar) || (function () {
    22	    var ownKeys = function(o) {
    23	        ownKeys = Object.getOwnPropertyNames || function (o) {
    24	            var ar = [];
    25	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    26	            return ar;
    27	        };
    28	        return ownKeys(o);
    29	    };
    30	    return function (mod) {
    31	        if (mod && mod.__esModule) return mod;
    32	        var result = {};
    33	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    34	        __setModuleDefault(result, mod);
    35	        return result;
    36	    };
    37	})();
    38	Object.defineProperty(exports, "__esModule", { value: true });
    39	exports.main = main;
    40	exports.readAllStdin = readAllStdin;
    41	exports.parseArguments = parseArguments;
    42	exports.validateArguments = validateArguments;
    43	exports.isValidSpecFolder = isValidSpecFolder;
    44	exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
    45	// ───────────────────────────────────────────────────────────────
    46	// 1. GENERATE CONTEXT
    47	// ───────────────────────────────────────────────────────────────
    48	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
    49	// Node stdlib
    50	const path = __importStar(require("path"));
    51	const fsSync = __importStar(require("fs"));
    52	// Internal modules
    53	const path_security_1 = require("@spec-kit/shared/utils/path-security");
    54	const core_1 = require("../core");
    55	const workflow_1 = require("../core/workflow");
    56	const loaders_1 = require("../loaders");
    57	const collect_session_data_1 = require("../extractors/collect-session-data");
    58	// ───────────────────────────────────────────────────────────────
    59	// 3. HELP TEXT
    60	// ───────────────────────────────────────────────────────────────
    61	const HELP_TEXT = `
    62	Usage: node generate-context.js [options] <input>
    63	
    64	Arguments:
    65	  <input>           A JSON data file path
    66	                    - JSON file mode: node generate-context.js data.json [spec-folder]
    67	
    68	Options:
    69	  --help, -h        Show this help message
    70	  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
    71	  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
    72	  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
    73	
    74	Examples:
    75	  node generate-context.js /tmp/context-data.json
    76	  node generate-context.js /tmp/context-data.json specs/001-feature/
    77	  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
    78	  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
    79	  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
    80	
    81	Output:
    82	  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
    83	  for indexing by the Spec Kit Memory system.
    84	
    85	Preferred save path (JSON-PRIMARY):
    86	  - ALWAYS use --stdin, --json, or a JSON temp file.
    87	  - The AI has strictly better information about its own session than any DB query can reconstruct.
    88	  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
    89	
    90	Direct CLI target rule:
    91	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    92	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    93	    but they must not reroute the save to another folder.
    94	
    95	JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
    96	  {
    97	    "user_prompts": [...],
    98	    "observations": [...],
    99	    "recent_context": [...],
   100	    "toolCalls": [
   101	      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
   102	      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
   103	    ],
   104	    "exchanges": [
   105	      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
   106	    ],
   107	    "preflight": {
   108	      "knowledgeScore": 40,
   109	      "uncertaintyScore": 60,
   110	      "contextScore": 50,
   111	      "timestamp": "ISO-8601",
   112	      "gaps": ["gap1", "gap2"],
   113	      "confidence": 45,
   114	      "readiness": "Needs research"
   115	    },
   116	    "postflight": {
   117	      "knowledgeScore": 75,
   118	      "uncertaintyScore": 25,
   119	      "contextScore": 80,
   120	      "gapsClosed": ["gap1"],
   121	      "newGaps": ["new-gap"]
   122	    }
   123	  }
   124	
   125	  Tool/Exchange enrichment fields (all optional — JSON-mode only):
   126	  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
   127	  - exchanges[]: Key user-assistant exchanges with timestamps
   128	  - These provide richer context than DB extraction since the AI filters noise at source
   129	
   130	  Learning Delta Calculation:
   131	  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
   132	  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
   133	  - Context Delta = postflight.contextScore - preflight.contextScore
   134	  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
   135	`;
   136	if (process.argv.includes('--help') || process.argv.includes('-h')) {
   137	    console.log(HELP_TEXT);
   138	    process.exit(0);
   139	}
   140	// 2.1 SIGNAL HANDLERS
   141	let signalHandlersInstalled = false;
   142	let shuttingDown = false;
   143	// Robustness: signal handler releases locks before reporting
   144	function handleSignalShutdown(signal) {
   145	    if (shuttingDown)
   146	        return; // prevent re-entrant handling
   147	    shuttingDown = true;
   148	    let lockReleaseFailed = false;
   149	    try {
   150	        (0, workflow_1.releaseFilesystemLock)();
   151	    }
   152	    catch (_err) {
   153	        lockReleaseFailed = true;
   154	    }
   155	    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
   156	    process.exit(lockReleaseFailed ? 1 : 0);
   157	}
   158	function installSignalHandlers() {
   159	    if (signalHandlersInstalled) {
   160	        return;
   161	    }
   162	    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
   163	    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
   164	    signalHandlersInstalled = true;
   165	}
   166	// ───────────────────────────────────────────────────────────────
   167	// 4. SPEC FOLDER VALIDATION
   168	// ───────────────────────────────────────────────────────────────
   169	function isUnderApprovedSpecsRoot(normalizedInput) {
   170	    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
   171	}
   172	function isValidSpecFolder(folderPath) {
   173	    const folderName = path.basename(folderPath);
   174	    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
   175	    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
   176	    // Extract the trailing portion that might be "parent/child"
   177	    const trailingSegments = normalizedInput.split('/');
   178	    // Check if the last two segments both match the spec folder pattern
   179	    if (trailingSegments.length >= 2) {
   180	        const lastTwo = trailingSegments.slice(-2);
   181	        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
   182	            // Both segments are valid spec folder names — valid nested spec folder
   183	            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   184	            if (!hasSpecsParent) {
   185	                // Fallback: check if the path resolves to an existing directory under any specs root
   186	                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
   187	                    const candidate = path.join(specsDir, normalizedInput);
   188	                    if (!path.isAbsolute(normalizedInput) &&
   189	                        fsSync.existsSync(candidate) &&
   190	                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
   191	                        return { valid: true };
   192	                    }
   193	                }
   194	                return {
   195	                    valid: false,
   196	                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   197	                };
   198	            }
   199	            return { valid: true };
   200	        }
   201	    }
   202	    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
   203	        if (/^\d{3}-/.test(folderName)) {
   204	            if (/[A-Z]/.test(folderName)) {
   205	                return { valid: false, reason: 'Spec folder name should be lowercase' };
   206	            }
   207	            if (/_/.test(folderName)) {
   208	                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
   209	            }
   210	            if (!/^[a-z]/.test(folderName.slice(4))) {
   211	                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
   212	            }
   213	        }
   214	        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
   215	    }
   216	    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   217	    if (!hasSpecsParent) {
   218	        // Fallback: check if bare name can be resolved via recursive child search
   219	        // (findChildFolderSync in validateArguments handles this, so just report the error here)
   220	        return {
   221	            valid: false,
   222	            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   223	        };
   224	    }
   225	    return { valid: true };
   226	}
   227	function resolveCliSpecFolderReference(rawArg) {
   228	    const folderName = path.basename(rawArg);
   229	    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
   230	        rawArg.startsWith('.opencode/specs/'))
   231	        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
   232	        : null;
   233	    let resolvedNestedPath = null;
   234	    if (!rawArg.endsWith('.json')) {
   235	        if (path.isAbsolute(rawArg)) {
   236	            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
   237	            const lastSegment = absoluteSegments.at(-1);
   238	            const parentSegment = absoluteSegments.at(-2);
   239	            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
   240	                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
   241	                resolvedNestedPath = rawArg;
   242	            }
   243	        }
   244	        let cleaned = rawArg;
   245	        if (cleaned.startsWith('.opencode/specs/')) {
   246	            cleaned = cleaned.slice('.opencode/specs/'.length);
   247	        }
   248	        else if (cleaned.startsWith('specs/')) {
   249	            cleaned = cleaned.slice('specs/'.length);
   250	        }
   251	        cleaned = cleaned.replace(/\/+$/, '');
   252	        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
   253	            resolvedNestedPath = explicitProjectScopedPath;
   254	        }
   255	        const segments = cleaned.split('/');
   256	        if (!resolvedNestedPath && segments.length >= 2) {
   257	            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
   258	                const candidate = path.join(specsDir, ...segments);
   259	                if (fsSync.existsSync(candidate)) {
   260	                    resolvedNestedPath = candidate;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/SKILL.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: system-spec-kit
     3	description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
     4	allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
     5	version: 3.2.0.0
     6	---
     7	
     8	<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->
     9	
    10	# Spec Kit - Mandatory Conversation Documentation
    11	
    12	Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.
    13	
    14	
    15	<!-- ANCHOR:when-to-use -->
    16	## 1. WHEN TO USE
    17	
    18	### What is a Spec Folder?
    19	
    20	A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:
    21	
    22	Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).
    23	
    24	- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
    25	- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
    26	- **Contents**: Markdown files (spec.md, plan.md, tasks.md) plus optional memory/ and scratch/ subdirectories
    27	
    28	Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.
    29	
    30	### Activation Triggers
    31	
    32	**MANDATORY for ALL file modifications:**
    33	- Code files: JS, TS, Python, CSS, HTML
    34	- Documentation: Markdown, README, guides
    35	- Configuration: JSON, YAML, TOML, env templates
    36	- Templates, knowledge base, build/tooling files
    37	
    38	**Request patterns that trigger activation:**
    39	- "Add/implement/create [feature]"
    40	- "Fix/update/refactor [code]"
    41	- "Modify/change [configuration]"
    42	- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze, phase
    43	
    44	**Example triggers:**
    45	- "Add email validation to the signup form" → Level 1-2
    46	- "Refactor the authentication module" → Level 2-3
    47	- "Fix the button alignment bug" → Level 1
    48	- "Implement user dashboard with analytics" → Level 3
    49	
    50	### When NOT to Use
    51	
    52	- Pure exploration/reading (no file modifications)
    53	- Single typo fixes (<5 characters in one file)
    54	- Whitespace-only changes
    55	- Auto-generated file updates (package-lock.json)
    56	- User explicitly selects Option D (skip documentation)
    57	
    58	**Rule of thumb:** If modifying ANY file content → Activate this skill.
    59	Status: ✅ This requirement applies immediately once file edits are requested.
    60	
    61	### Agent Exclusivity
    62	
    63	**⛔ CRITICAL:** `@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files).
    64	
    65	- **Requires @speckit:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other *.md in spec folders
    66	- **Exceptions:**
    67	  - `memory/` → uses generate-context.js script
    68	  - `scratch/` → temporary workspace, any agent
    69	  - `handover.md` → @handover agent only
    70	  - `research/research.md` → @deep-research agent only
    71	  - `debug-delegation.md` → @debug agent only
    72	
    73	Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`
    74	
    75	### Utility Template Triggers
    76	
    77	| Template              | Trigger Keywords                                                                                                              | Action                    |
    78	| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
    79	| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
    80	| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |
    81	
    82	**Rule:** When detected, proactively suggest the appropriate action.
    83	
    84	---
    85	
    86	<!-- /ANCHOR:when-to-use -->
    87	<!-- ANCHOR:smart-routing -->
    88	## 2. SMART ROUTING
    89	
    90	### Resource Domains
    91	
    92	The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.
    93	
    94	- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
    95	- `references/templates/` for level selection, template composition, and structure guides.
    96	- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
    97	- `references/structure/` for folder organization and sub-folder versioning.
    98	- `references/workflows/` for command workflows and worked examples.
    99	- `references/debugging/` for troubleshooting and root-cause methodology.
   100	- `references/config/` for runtime environment configuration.
   101	
   102	### Template and Script Sources of Truth
   103	
   104	- Level definitions and template size guidance: [level_specifications.md](./references/templates/level_specifications.md)
   105	- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
   106	- Use `templates/level_N/` for operational templates; `core/` and `addendum/` remain composition inputs.
   107	- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
   108	- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
   109	- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
   110	- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)
   111	
   112	Primary operational scripts:
   113	- `spec/validate.sh`
   114	- `spec/create.sh`
   115	- `spec/archive.sh`
   116	- `spec/check-completion.sh`
   117	- `spec/recommend-level.sh`
   118	- `templates/compose.sh`
   119	
   120	### Resource Loading Levels
   121	
   122	| Level       | When to Load               | Resources                    |
   123	| ----------- | -------------------------- | ---------------------------- |
   124	| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
   125	| CONDITIONAL | If intent signals match   | Intent-mapped references     |
   126	| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |
   127	
   128	`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, and use this file only to point readers to it rather than duplicating the full matrix.
   129	
   130	### Smart Router Pseudocode
   131	
   132	The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.
   133	
   134	```python
   135	from pathlib import Path
   136	
   137	SKILL_ROOT = Path(__file__).resolve().parent
   138	RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
   139	DEFAULT_RESOURCE = "references/workflows/quick_reference.md"
   140	
   141	INTENT_SIGNALS = {
   142	    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
   143	    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
   144	    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
   145	    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
   146	    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
   147	    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
   148	    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
   149	    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
   150	    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
   151	    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
   152	    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
   153	    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
   154	    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "shared memory", "tenant", "retention", "audit"]},
   155	}
   156	
   157	RESOURCE_MAP = {
   158	    "PLAN": [
   159	        "references/templates/level_specifications.md",
   160	        "references/templates/template_guide.md",
   161	        "references/validation/template_compliance_contract.md",
   162	    ],
   163	    "RESEARCH": [
   164	        "references/workflows/quick_reference.md",
   165	        "references/workflows/worked_examples.md",
   166	        "references/memory/epistemic_vectors.md",
   167	    ],
   168	    "IMPLEMENT": [
   169	        "references/validation/validation_rules.md",
   170	        "references/validation/template_compliance_contract.md",
   171	        "references/templates/template_guide.md",
   172	    ],
   173	    "DEBUG": [
   174	        "references/debugging/troubleshooting.md",
   175	        "references/workflows/quick_reference.md",
   176	        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
   177	    ],
   178	    "COMPLETE": [
   179	        "references/validation/validation_rules.md",
   180	        "references/workflows/nested_changelog.md",
   181	    ],
   182	    "MEMORY": [
   183	        "references/memory/memory_system.md",
   184	        "references/memory/save_workflow.md",
   185	        "references/memory/trigger_config.md",
   186	    ],
   187	    "HANDOVER": [
   188	        "references/workflows/quick_reference.md",
   189	    ],
   190	    "PHASE": [
   191	        "references/structure/phase_definitions.md",
   192	        "references/structure/sub_folder_versioning.md",
   193	        "references/validation/phase_checklists.md",
   194	    ],
   195	    "RETRIEVAL_TUNING": [
   196	        "references/memory/embedding_resilience.md",
   197	        "references/memory/trigger_config.md",
   198	    ],
   199	    "EVALUATION": [
   200	        "references/memory/epistemic_vectors.md",
   201	        "references/config/environment_variables.md",
   202	        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
   203	    ],
   204	    "SCORING_CALIBRATION": [
   205	        "references/config/environment_variables.md",
   206	    ],
   207	    "ROLLOUT_FLAGS": [
   208	        "references/config/environment_variables.md",
   209	        "feature_catalog/19--feature-flag-reference/",
   210	    ],
   211	    "GOVERNANCE": [
   212	        "references/config/environment_variables.md",
   213	    ],
   214	}
   215	
   216	COMMAND_BOOSTS = {
   217	    "/spec_kit:plan": "PLAN",
   218	    "/spec_kit:implement": "IMPLEMENT",
   219	    "/spec_kit:debug": "DEBUG",
   220	    "/spec_kit:complete": "COMPLETE",
   221	    "/spec_kit:handover": "HANDOVER",
   222	    "/spec_kit:plan :with-phases": "PHASE",
   223	    "/memory:search": "MEMORY",
   224	    "/memory:save": "MEMORY",
   225	    "/memory:manage": "MEMORY",
   226	    "/memory:learn": "MEMORY",
   227	    "/spec_kit:resume": "MEMORY",
   228	    "/memory:manage shared": "GOVERNANCE",
   229	}
   230	
   231	LOADING_LEVELS = {
   232	    "ALWAYS": [DEFAULT_RESOURCE],
   233	    "ON_DEMAND_KEYWORDS": ["deep dive", "full validation", "full checklist", "full template"],
   234	    "ON_DEMAND": [
   235	        "references/validation/phase_checklists.md",
   236	        "references/templates/template_guide.md",
   237	    ],
   238	}
   239	
   240	def _task_text(task) -> str:
   241	    parts = [
   242	        str(getattr(task, "query", "")),
   243	        str(getattr(task, "text", "")),
   244	        " ".join(getattr(task, "keywords", []) or []),
   245	        str(getattr(task, "command", "")),
   246	    ]
   247	    return " ".join(parts).lower()
   248	
   249	def _guard_in_skill(relative_path: str) -> str:
   250	    """Allow markdown loads only within this skill folder."""
   251	    resolved = (SKILL_ROOT / relative_path).resolve()
   252	    resolved.relative_to(SKILL_ROOT)
   253	    if resolved.suffix.lower() != ".md":
   254	        raise ValueError(f"Only markdown resources are routable: {relative_path}")
   255	    return resolved.relative_to(SKILL_ROOT).as_posix()
   256	
   257	def discover_markdown_resources() -> set[str]:
   258	    """Recursively discover routable markdown docs for this skill only."""
   259	    docs = []
   260	    for base in RESOURCE_BASES:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '540,710p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	
   541	**Edge types:** `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `DECORATES`, `OVERRIDES`, `TYPE_OF`.
   542	
   543	**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
   544	
   545	**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
   546	
   547	**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
   548	
   549	**Budget allocator floors:** constitutional 700, codeGraph 1200, cocoIndex 900, triggered 400, overflow pool 800 = 4000 total.
   550	
   551	---
   552	
   553	### 3.2 TOOL REFERENCE
   554	
   555	All 47 tools listed by architecture layer. Each entry has a plain-language description and a parameter table. For full Zod schemas with types and defaults, see `tool-schemas.ts`.
   556	
   557	**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
   558	
   559	---
   560	
   561	#### L1: Orchestration (3 tools)
   562	
   563	##### `memory_context`
   564	
   565	The smart entry point. You describe what you need and it figures out the best way to find it. It reads your query, detects whether you are looking for a decision, debugging context or general knowledge, picks the right search mode and returns the most relevant results. Start here for almost everything.
   566	
   567	| Parameter | Type | Notes |
   568	|-----------|------|-------|
   569	| `input` | string | **Required.** Your question or task description |
   570	| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
   571	| `intent` | string | Override detected intent: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision` |
   572	| `specFolder` | string | Narrow results to a specific spec folder |
   573	| `tenantId` | string | Tenant boundary for governed retrieval |
   574	| `userId` | string | User boundary for governed retrieval |
   575	| `agentId` | string | Agent boundary for governed retrieval |
   576	| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
   577	| `limit` | number | Max results to return (default varies by mode) |
   578	| `sessionId` | string | Session ID for deduplication across turns |
   579	| `anchors` | string[] | Pull specific sections: `["state", "next-steps"]` |
   580	| `tokenUsage` | number | Current token budget fraction (0.0-1.0) for adaptive depth |
   581	| `enableDedup` | boolean | Skip memories already seen this session |
   582	| `includeContent` | boolean | Include full memory content in response |
   583	| `includeTrace` | boolean | Include retrieval trace for debugging |
   584	
   585	```json
   586	{
   587	  "tool": "memory_context",
   588	  "arguments": {
   589	    "input": "implement JWT refresh token rotation",
   590	    "intent": "add_feature",
   591	    "specFolder": "specs/005-auth",
   592	    "anchors": ["decisions", "next-steps"]
   593	  }
   594	}
   595	```
   596	
   597	---
   598	
   599	##### `session_resume`
   600	
   601	Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
   602	
   603	| Parameter | Type | Notes |
   604	|-----------|------|-------|
   605	| `specFolder` | string | Scope resume to a specific spec folder |
   606	| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
   607	
   608	---
   609	
   610	##### `session_bootstrap`
   611	
   612	Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
   613	
   614	| Parameter | Type | Notes |
   615	|-----------|------|-------|
   616	| `specFolder` | string | Scope bootstrap to a specific spec folder |
   617	
   618	---
   619	
   620	#### L2: Core (4 tools)
   621	
   622	##### `memory_search`
   623	
   624	The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."
   625	
   626	| Parameter | Type | Notes |
   627	|-----------|------|-------|
   628	| `query` | string | Free-text search (use `query` OR `concepts`, not both) |
   629	| `concepts` | string[] | AND search: 2-5 strings that must all match |
   630	| `specFolder` | string | Scope to a folder |
   631	| `tenantId` | string | Tenant boundary |
   632	| `userId` | string | User boundary |
   633	| `agentId` | string | Agent boundary |
   634	| `sharedSpaceId` | string | Shared-memory boundary |
   635	| `limit` | number | 1-100 results (default 10) |
   636	| `tier` | string | Filter by importance tier |
   637	| `minState` | string | Minimum state: `HOT`, `WARM`, `COLD`, `DORMANT`, `ARCHIVED` |
   638	| `rerank` | boolean | Apply cross-encoder reranking |
   639	| `useDecay` | boolean | Apply FSRS decay to scores |
   640	| `intent` | string | Adjust channel weights for task type |
   641	| `mode` | string | `auto` or `deep` |
   642	| `min_quality_score` | number | Filter out low-quality results |
   643	
   644	```json
   645	{
   646	  "tool": "memory_search",
   647	  "arguments": {
   648	    "query": "database migration strategy",
   649	    "specFolder": "specs/010-db-refactor",
   650	    "rerank": true,
   651	    "limit": 5
   652	  }
   653	}
   654	```
   655	
   656	---
   657	
   658	##### `memory_quick_search`
   659	
   660	The lightweight search option. Works like a preset: you provide a query and optional scope boundaries and it forwards to the full search tool with sensible defaults. Use this when you want fast results without setting lots of parameters.
   661	
   662	| Parameter | Type | Notes |
   663	|-----------|------|-------|
   664	| `query` | string | **Required.** Free-text search query |
   665	| `specFolder` | string | Scope to a folder |
   666	| `tenantId` | string | Tenant boundary |
   667	| `userId` | string | User boundary |
   668	| `agentId` | string | Agent boundary |
   669	| `sharedSpaceId` | string | Shared-memory boundary |
   670	| `limit` | number | 1-100 results (default 10) |
   671	
   672	---
   673	
   674	##### `memory_match_triggers`
   675	
   676	The speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases against a list of known keywords, like a phone's autocomplete. Results come back almost instantly. Frequently used memories show up with full details. Older ones appear as lightweight pointers.
   677	
   678	| Parameter | Type | Notes |
   679	|-----------|------|-------|
   680	| `prompt` | string | **Required.** The user's current prompt text |
   681	| `limit` | number | Max matches to return |
   682	| `session_id` | string | Session context for co-activation |
   683	| `turnNumber` | number | Current conversation turn for attention decay |
   684	| `include_cognitive` | boolean | Include HOT/WARM tiered content injection |
   685	
   686	```json
   687	{
   688	  "tool": "memory_match_triggers",
   689	  "arguments": {
   690	    "prompt": "fix the token refresh bug in auth service",
   691	    "turnNumber": 3,
   692	    "include_cognitive": true
   693	  }
   694	}
   695	```
   696	
   697	---
   698	
   699	##### `memory_save`
   700	
   701	This is how you add new knowledge to the system. Point it at a markdown file and it reads, validates, embeds and stores the content so it becomes searchable. Before storing, it checks whether the information already exists and decides whether to add it fresh, update an older version or skip it. Quality gates catch low-value content before it clutters the knowledge base.
   702	
   703	| Parameter | Type | Notes |
   704	|-----------|------|-------|
   705	| `filePath` | string | **Required.** Absolute path to the `.md` file to index |
   706	| `force` | boolean | Overwrite if already indexed |
   707	| `dryRun` | boolean | Preview validation without saving |
   708	| `skipPreflight` | boolean | Bypass quality gate (not recommended) |
   709	| `asyncEmbedding` | boolean | Return immediately, generate embedding in background |
   710	| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '990,1088p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   990	| `direction` | string | `outgoing`, `incoming` or `both` |
   991	| `relations` | string[] | Filter to specific relationship types |
   992	| `includeMemoryDetails` | boolean | Include full memory content |
   993	
   994	---
   995	
   996	##### `memory_causal_link`
   997	
   998	Connect two memories with a causal relationship. Use this to build decision lineage ("this refactor was caused by that bug report").
   999	
  1000	| Parameter | Type | Notes |
  1001	|-----------|------|-------|
  1002	| `sourceId` | string | **Required.** Cause memory ID |
  1003	| `targetId` | string | **Required.** Effect memory ID |
  1004	| `relation` | string | **Required.** `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` or `supports` |
  1005	| `strength` | number | Edge weight (0.0-1.0, default 1.0) |
  1006	| `evidence` | string | Free-text evidence supporting this link |
  1007	
  1008	---
  1009	
  1010	##### `memory_causal_stats`
  1011	
  1012	Get statistics about the causal graph: total edges, coverage percentage and breakdown by relationship type. Target coverage is 60% of memories linked.
  1013	
  1014	| Parameter | Type | Notes |
  1015	|-----------|------|-------|
  1016	| _(none required)_ | | Returns global stats |
  1017	
  1018	---
  1019	
  1020	##### `memory_causal_unlink`
  1021	
  1022	Remove a causal relationship by edge ID.
  1023	
  1024	| Parameter | Type | Notes |
  1025	|-----------|------|-------|
  1026	| `edgeId` | string | **Required.** Edge ID from `memory_drift_why` results |
  1027	
  1028	---
  1029	
  1030	##### `eval_run_ablation`
  1031	
  1032	Run a controlled experiment to test which search channels contribute most to finding the right results. Like a scientist removing one ingredient at a time to see which ones matter. Requires `SPECKIT_ABLATION=true` environment variable.
  1033	
  1034	| Parameter | Type | Notes |
  1035	|-----------|------|-------|
  1036	| `channels` | string[] | Channels to test: `vector`, `bm25`, `fts5`, `graph`, `trigger` |
  1037	| `groundTruthQueryIds` | string[] | Query IDs with known-correct results |
  1038	| `recallK` | number | K value for Recall@K metric |
  1039	| `storeResults` | boolean | Persist results to eval database |
  1040	| `includeFormattedReport` | boolean | Return human-readable report |
  1041	
  1042	The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
  1043	
  1044	---
  1045	
  1046	##### `eval_reporting_dashboard`
  1047	
  1048	Generate a report showing search performance trends over time. Aggregates metrics by sprint and channel.
  1049	
  1050	| Parameter | Type | Notes |
  1051	|-----------|------|-------|
  1052	| `sprintFilter` | string | Filter by sprint ID |
  1053	| `channelFilter` | string | Filter by channel name |
  1054	| `metricFilter` | string | Filter by metric type |
  1055	| `limit` | number | Max records to include |
  1056	| `format` | string | `text` (default) or `json` |
  1057	
  1058	---
  1059	
  1060	##### `code_graph_query`
  1061	
  1062	Query structural code relationships: `outline` (file symbols), `calls_from` and `calls_to` (call graph), `imports_from` and `imports_to` (dependency graph). Use this instead of Grep for structural queries. Supports multi-hop BFS traversal. Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
  1063	
  1064	| Parameter | Type | Notes |
  1065	|-----------|------|-------|
  1066	| `operation` | string | **Required.** `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to` |
  1067	| `subject` | string | **Required.** File path, symbol name or `symbolId` |
  1068	| `edgeType` | string | Filter by edge type |
  1069	| `limit` | number | Max results (1-200, default 50) |
  1070	| `includeTransitive` | boolean | Enable multi-hop BFS traversal |
  1071	| `maxDepth` | number | Max traversal depth (1-10, default 3) |
  1072	
  1073	---
  1074	
  1075	##### `code_graph_context`
  1076	
  1077	Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
  1078	
  1079	| Parameter | Type | Notes |
  1080	|-----------|------|-------|
  1081	| `input` | string | Natural language context query |
  1082	| `queryMode` | string | `neighborhood` (default), `outline` or `impact` |
  1083	| `subject` | string | Symbol name, fqName or `symbolId` |
  1084	| `seeds` | array | Seeds from CocoIndex, manual input or graph lookups |
  1085	| `budgetTokens` | number | Token budget for response (100-4000, default 1200) |
  1086	| `profile` | string | Output density: `quick`, `research` or `debug` |
  1087	| `includeTrace` | boolean | Include trace metadata for debugging |
  1088	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '1530,1565p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1530	
  1531	### Common Patterns
  1532	
  1533	| What You Want To Do | Tool | How |
  1534	|---------------------|------|-----|
  1535	| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
  1536	| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
  1537	| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
  1538	| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
  1539	| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
  1540	| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
  1541	| See what is indexed | `memory_list` + `memory_stats` | Browse and count |
  1542	| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
  1543	| Test a save without committing | `memory_save` | Set `dryRun: true` |
  1544	
  1545	<!-- /ANCHOR:usage-examples -->
  1546	
  1547	---
  1548	
  1549	<!-- ANCHOR:troubleshooting -->
  1550	## 7. TROUBLESHOOTING
  1551	
  1552	For the feature flag rollback procedure, see `../references/workflows/rollback_runbook.md`.
  1553	
  1554	### Search Returns Low-Quality Results
  1555	
  1556	**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
  1557	
  1558	**Common causes**: Stale BM25 index, divergent aliases in FTS5 or memories with low quality scores surfacing.
  1559	
  1560	**Fix**: Run a health check with auto-repair, then retry with a higher quality floor:
  1561	
  1562	```json
  1563	{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
  1564	```
  1565	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md | sed -n '1,240p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: architecture
     3	description: How the major pieces of this project connect and flow. Load when working on system design, integrations, or understanding how components interact.
     4	triggers:
     5	  - "architecture"
     6	  - "system design"
     7	  - "how does X connect to Y"
     8	  - "integration"
     9	  - "flow"
    10	edges:
    11	  - target: context/stack.md
    12	    condition: when specific technology details are needed
    13	  - target: context/decisions.md
    14	    condition: when understanding why the architecture is structured this way
    15	last_updated: [YYYY-MM-DD]
    16	---
    17	
    18	# Architecture
    19	
    20	## System Overview
    21	<!-- Describe how the major pieces connect.
    22	     Focus on FLOW not technology — how does a request/action move through the system?
    23	     Use the actual names of components, services, and modules from this codebase.
    24	     Format: a simple text flow diagram or short prose description.
    25	     Length: 5-15 lines. Minimum 5 lines. Should be readable in 30 seconds.
    26	     Example:
    27	     "Request comes in via Express router → validated by middleware →
    28	     passed to service layer → service calls repository for data →
    29	     repository queries PostgreSQL → result returned up the chain →
    30	     formatted by serializer → sent as JSON response." -->
    31	
    32	## Key Components
    33	<!-- List the major components, modules, or services in this project.
    34	     For each: name, what it does, what it depends on.
    35	     Only include components that are non-obvious or have important constraints.
    36	     Minimum 3 components. If you cannot identify 3, write "[TO DETERMINE]" as a placeholder.
    37	     Length: 1-2 lines per component.
    38	     Example:
    39	     - **AuthService** — handles all authentication logic, depends on UserRepository and JWTLib
    40	     - **EventBus** — async communication between services, all side effects go through here -->
    41	
    42	## External Dependencies
    43	<!-- Third-party services, APIs, or databases this project connects to.
    44	     For each: what it is, what we use it for, any important constraints.
    45	     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]" as a placeholder.
    46	     Length: 1-2 lines per dependency.
    47	     Example:
    48	     - **PostgreSQL** — primary database, all writes go through the repository layer only
    49	     - **SendGrid** — transactional email, use the EmailService wrapper, never call directly -->
    50	
    51	## What Does NOT Exist Here
    52	<!-- Explicit boundaries — what is deliberately outside this system.
    53	     This prevents the agent from building things that belong elsewhere or making wrong assumptions.
    54	     Minimum 2 items. If you cannot find 2, write "[TO DETERMINE]" as a placeholder.
    55	     Length: 2-5 items.
    56	     Example:
    57	     - No background job processing — that lives in the worker service (separate repo)
    58	     - No file storage — we use S3 directly, no abstraction layer -->
     1	---
     2	name: stack
     3	description: Technology stack, library choices, and the reasoning behind them. Load when working with specific technologies or making decisions about libraries and tools.
     4	triggers:
     5	  - "library"
     6	  - "package"
     7	  - "dependency"
     8	  - "which tool"
     9	  - "technology"
    10	edges:
    11	  - target: context/decisions.md
    12	    condition: when the reasoning behind a tech choice is needed
    13	  - target: context/conventions.md
    14	    condition: when understanding how to use a technology in this codebase
    15	last_updated: [YYYY-MM-DD]
    16	---
    17	
    18	# Stack
    19	
    20	## Core Technologies
    21	<!-- List the primary language, framework, and runtime.
    22	     For each: version if it matters, any important configuration.
    23	     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]".
    24	     Length: 3-7 items.
    25	     Example:
    26	     - **Python 3.11** — primary language
    27	     - **FastAPI** — web framework, async by default
    28	     - **PostgreSQL 15** — primary database -->
    29	
    30	## Key Libraries
    31	<!-- Libraries that are central to how this project works.
    32	     Only include libraries where the agent needs to know: we use THIS, not the alternative.
    33	     Include the reason over alternatives where it matters.
    34	     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]".
    35	     Length: 3-10 items.
    36	     Example:
    37	     - **SQLAlchemy** (not raw psycopg2) — ORM for all database access
    38	     - **Pydantic v2** — data validation and serialisation, used everywhere
    39	     - **pytest** (not unittest) — all tests use pytest style -->
    40	
    41	## What We Deliberately Do NOT Use
    42	<!-- Technologies or patterns explicitly avoided in this project, and why.
    43	     This prevents the agent from introducing unwanted dependencies.
    44	     Minimum 2 items. If you cannot find 2, write "[TO DETERMINE]".
    45	     Length: 2-5 items.
    46	     Example:
    47	     - No ORM for raw analytics queries — use psycopg2 directly for performance
    48	     - No Redux — state management is local, context API only
    49	     - No class components — hooks only -->
    50	
    51	## Version Constraints
    52	<!-- Only fill this if there are important version-specific things to know.
    53	     Leave empty if there are no meaningful version constraints.
    54	     Example: "We are on React 17, not 18 — concurrent features are not available." -->

 succeeded in 0ms:
     1	---
     2	name: decisions
     3	description: Key architectural and technical decisions with reasoning. Load when making design choices or understanding why something is built a certain way.
     4	triggers:
     5	  - "why do we"
     6	  - "why is it"
     7	  - "decision"
     8	  - "alternative"
     9	  - "we chose"
    10	edges:
    11	  - target: context/architecture.md
    12	    condition: when a decision relates to system structure
    13	  - target: context/stack.md
    14	    condition: when a decision relates to technology choice
    15	last_updated: [YYYY-MM-DD]
    16	---
    17	
    18	# Decisions
    19	
    20	<!-- HOW TO USE THIS FILE:
    21	     Each decision follows the format below.
    22	     When a decision changes: DO NOT delete the old entry.
    23	     Mark it as superseded, add the new entry above it.
    24	     The history must be preserved — this is the event clock. -->
    25	
    26	## Decision Log
    27	
    28	<!-- Document key decisions using the format below.
    29	     Include decisions that: are non-obvious, have important constraints,
    30	     or where the reasoning prevents future mistakes.
    31	     Do not document every decision — only ones where "why" matters.
    32	     Minimum 3 decision entries during initial population. If you cannot identify 3,
    33	     write placeholder entries with "[TO DETERMINE]" and explain what decision is pending.
    34	
    35	     Format for each entry:
    36	
    37	     ### [Decision Title]
    38	     **Date:** YYYY-MM-DD (check git history for real dates when possible)
    39	     **Status:** Active | Superseded by [title]
    40	     **Decision:** [What was decided, in one sentence]
    41	     **Reasoning:** [Why this was chosen]
    42	     **Alternatives considered:** [What else was considered and why it was rejected]
    43	     **Consequences:** [What this means for the codebase going forward]
    44	
    45	     Example:
    46	
    47	     ### Use PostgreSQL for all persistent storage
    48	     **Date:** 2024-03-01
    49	     **Status:** Active
    50	     **Decision:** All persistent data lives in PostgreSQL, no secondary databases.
    51	     **Reasoning:** Simplicity — one database to operate, backup, and reason about.
    52	     **Alternatives considered:** Redis for sessions (rejected — adds operational complexity for minimal gain), MongoDB for user preferences (rejected — relational model fits our data).
    53	     **Consequences:** No caching layer at database level. Application-level caching if needed.
    54	
    55	     Example of a superseded entry:
    56	
    57	     ### Use Redis for session storage
    58	     **Date:** 2024-02-15
    59	     **Status:** Superseded by "Use PostgreSQL for all persistent storage"
    60	     **Decision:** Store user sessions in Redis.
    61	     **Reasoning:** Fast read/write for session data.
    62	     **Alternatives considered:** PostgreSQL (chosen later due to operational simplicity).
    63	     **Consequences:** ~~Requires Redis infrastructure alongside PostgreSQL.~~
    64	     **Superseded because:** Maintaining two data stores added operational complexity
    65	     without meaningful performance benefit for our scale. -->
     1	---
     2	name: conventions
     3	description: How code is written in this project — naming, structure, patterns, and style. Load when writing new code or reviewing existing code.
     4	triggers:
     5	  - "convention"
     6	  - "pattern"
     7	  - "naming"
     8	  - "style"
     9	  - "how should I"
    10	  - "what's the right way"
    11	edges:
    12	  - target: context/architecture.md
    13	    condition: when a convention depends on understanding the system structure
    14	last_updated: [YYYY-MM-DD]
    15	---
    16	
    17	# Conventions
    18	
    19	## Naming
    20	<!-- How things are named in this codebase.
    21	     Cover: files, functions, variables, classes, database tables/columns — whichever are non-obvious.
    22	     Only include conventions that are actually enforced, not aspirational.
    23	     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]" — do not pad with generic advice.
    24	     Length: 3-7 items.
    25	     Example:
    26	     - Files: kebab-case (`user-profile.ts`, not `UserProfile.ts`)
    27	     - Functions: camelCase, verb-first (`getUserById`, not `userById`)
    28	     - Database columns: snake_case (`created_at`, not `createdAt`) -->
    29	
    30	## Structure
    31	<!-- How code is organised within files and across the codebase.
    32	     Cover the things the agent is most likely to get wrong.
    33	     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]" — do not pad with generic advice.
    34	     Length: 3-7 items.
    35	     Example:
    36	     - Business logic lives in services/, never in route handlers
    37	     - Each service file exports a single class
    38	     - Tests live next to the file they test (`user.service.ts` → `user.service.test.ts`) -->
    39	
    40	## Patterns
    41	<!-- Recurring code patterns that must be followed consistently.
    42	     Include concrete before/after examples for the most important ones.
    43	     Minimum 2 patterns. If you cannot find 2, write "[TO DETERMINE]".
    44	     Length: 2-5 patterns with examples.
    45	     Example:
    46	     Always use the Result type for error handling — never throw from the service layer:
    47	     ```
    48	     // Correct
    49	     return { success: true, data: user }
    50	     return { success: false, error: 'User not found' }
    51	
    52	     // Wrong
    53	     throw new Error('User not found')
    54	     ``` -->
    55	
    56	## Verify Checklist
    57	<!-- A short checklist the agent runs against any code it writes in this project.
    58	     These are the things most likely to go wrong based on this specific codebase.
    59	     The agent should explicitly check each item before presenting output.
    60	     Minimum 4 items. If you cannot find 4, write "[TO DETERMINE]".
    61	     Length: 4-8 items.
    62	     Example:
    63	     Before presenting any code:
    64	     - [ ] Business logic is not in route handlers
    65	     - [ ] All database access goes through the repository layer
    66	     - [ ] Error handling uses the Result type, not exceptions
    67	     - [ ] New files follow the naming convention above -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md | sed -n '1,220p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Pattern Index
     2	
     3	Lookup table for all pattern files in this directory. Check here before starting any task — if a pattern exists, follow it.
     4	
     5	<!-- This file is populated during setup (Pass 2) and updated whenever patterns are added.
     6	     Each row maps a pattern file (or section) to its trigger — when should the agent load it?
     7	
     8	     Format — simple (one task per file):
     9	     | [filename.md](filename.md) | One-line description of when to use this pattern |
    10	
    11	     Format — anchored (multi-section file, one row per task):
    12	     | [filename.md#task-first-task](filename.md#task-first-task) | When doing the first task |
    13	     | [filename.md#task-second-task](filename.md#task-second-task) | When doing the second task |
    14	
    15	     Example (from a Flask API project):
    16	     | [add-api-client.md](add-api-client.md) | Adding a new external service integration |
    17	     | [debug-pipeline.md](debug-pipeline.md) | Diagnosing failures in the request pipeline |
    18	     | [crud-operations.md#task-add-endpoint](crud-operations.md#task-add-endpoint) | Adding a new API route with validation |
    19	     | [crud-operations.md#task-add-model](crud-operations.md#task-add-model) | Adding a new database model |
    20	
    21	     Keep this table sorted alphabetically. One row per task (not per file).
    22	     If you create a new pattern, add it here. If you delete one, remove it. -->
    23	
    24	| Pattern | Use when |
    25	|---------|----------|
     1	# Patterns
     2	
     3	This folder contains task-specific guidance — the things you would tell your agent if you were sitting next to it. Not generic instructions. Project-specific accumulated wisdom.
     4	
     5	## How patterns get created
     6	
     7	**During setup:** After the context/ files are populated, the agent generates starter patterns based on the project's actual stack, architecture, and conventions. These are stack-specific — a Flask API project gets different patterns than a React SPA or a CLI tool.
     8	
     9	**Over time:** You or your agent add patterns as they emerge from real work — when something breaks, when a task has a non-obvious gotcha, when you've explained the same thing twice.
    10	
    11	## What belongs here
    12	
    13	A pattern file is worth creating when:
    14	- A task type is common in this project and has a repeatable workflow
    15	- There are integration gotchas between components that aren't obvious from code
    16	- Something broke and you want to prevent it from breaking the same way again
    17	- A verify checklist specific to one type of task would catch mistakes early
    18	
    19	## When to skip a pattern
    20	
    21	Default to generating a pattern. Only skip if:
    22	- The exact same guidance is already in `context/conventions.md` with concrete examples
    23	- The task truly has no project-specific gotchas (e.g. "how to write a for loop")
    24	
    25	If in doubt, generate the pattern. A pattern that turns out to be obvious costs nothing. A missing pattern costs a broken codebase.
    26	
    27	## Format
    28	
    29	### Single-task pattern (one file = one task)
    30	
    31	```markdown
    32	---
    33	name: [pattern-name]
    34	description: [one line — what this pattern covers and when to use it]
    35	triggers:
    36	  - "[keyword that should trigger loading this file]"
    37	edges:
    38	  - target: "[related file path, e.g. context/conventions.md]"
    39	    condition: "[when to follow this edge]"
    40	last_updated: [YYYY-MM-DD]
    41	---
    42	
    43	# [Pattern Name]
    44	
    45	## Context
    46	[What to load or know before starting this task type]
    47	
    48	## Steps
    49	[The workflow — what to do, in what order]
    50	
    51	## Gotchas
    52	[The things that go wrong. What to watch out for.]
    53	
    54	## Verify
    55	[Checklist to run after completing this task type]
    56	
    57	## Debug
    58	[What to check when this task type breaks]
    59	
    60	## Update Scaffold
    61	- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
    62	- [ ] Update any `.mex/context/` files that are now out of date
    63	- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
    64	```
    65	
    66	### Multi-section pattern (one file = multiple related tasks)
    67	
    68	Use this when tasks share context but differ in steps. Each task gets its own
    69	`## Task: ...` heading with sub-sections. The Context section is shared at the top.
    70	
    71	```markdown
    72	---
    73	name: [pattern-name]
    74	description: [one line — what this pattern file covers]
    75	triggers:
    76	  - "[keyword]"
    77	edges:
    78	  - target: "[related file path]"
    79	    condition: "[when to follow this edge]"
    80	last_updated: [YYYY-MM-DD]
    81	---
    82	
    83	# [Pattern Name]
    84	
    85	## Context
    86	[Shared context for all tasks in this file]
    87	
    88	## Task: [First Task Name]
    89	
    90	### Steps
    91	[...]
    92	
    93	### Gotchas
    94	[...]
    95	
    96	### Verify
    97	[...]
    98	
    99	## Task: [Second Task Name]
   100	
   101	### Steps
   102	[...]
   103	
   104	## Update Scaffold
   105	- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
   106	- [ ] Update any `.mex/context/` files that are now out of date
   107	- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
   108	```
   109	
   110	Do NOT combine unrelated tasks into one file just to reduce file count.
   111	Only group tasks that genuinely share context.
   112	
   113	## How many patterns to generate
   114	
   115	Do not use a fixed number. Generate one pattern per:
   116	- Each major task type a developer does repeatedly in this project
   117	- Each external dependency with non-obvious integration gotchas
   118	- Each major failure boundary in the architecture flow
   119	
   120	For a simple project this may be 3-4 files. For a complex project this may be 10-15.
   121	Do not cap based on a number — cap based on whether the pattern adds real value.
   122	
   123	## Pattern categories
   124	
   125	Walk through each category below. For each one, check the relevant context files
   126	and generate patterns for everything that applies to this project.
   127	
   128	### Category 1 — Common task patterns
   129	
   130	The repeatable tasks in this project. What does a developer do most often?
   131	
   132	Derive from: `context/architecture.md` (what are the major components?) and
   133	`context/conventions.md` (what patterns exist for extending them?)
   134	
   135	Examples by project type:
   136	- API: "add new endpoint", "add new model/entity", "add auth to a route"
   137	- Frontend: "add new page/route", "add new component", "add form with validation"
   138	- CLI: "add new command", "add new flag/option"
   139	- Pipeline: "add new pipeline stage", "add new data source"
   140	- SaaS: "add payment flow", "add user-facing feature", "add admin operation"
   141	
   142	### Category 2 — Integration patterns
   143	
   144	How to work with the external dependencies in this project.
   145	
   146	Every entry in `context/stack.md` "Key Libraries" or `context/architecture.md`
   147	"External Dependencies" that has non-obvious setup, gotchas, or failure modes
   148	deserves a pattern. These are the most dangerous areas — the agent will
   149	confidently write integration code that looks right but misses project-specific
   150	configuration, error handling, or rate limiting.
   151	
   152	Examples: "calling the payments API", "running database migrations",
   153	"adding a new third-party service client", "configuring auth provider"
   154	
   155	### Category 3 — Debug/diagnosis patterns
   156	
   157	When something breaks, where do you look?
   158	
   159	Derive from the architecture flow — each boundary between components is a
   160	potential failure point. One debug pattern per major boundary.
   161	
   162	Examples: "debug webhook failures", "debug pipeline stage failures",
   163	"diagnose auth/permission issues", "debug background job failures"
   164	
   165	### Category 4 — Deploy/release patterns
   166	
   167	Only generate if `context/setup.md` reveals non-trivial deployment.
   168	
   169	Examples: "deploy to staging", "rollback a release", "update environment config",
   170	"run database migration in production"

codex
One useful twist is becoming obvious: several of Mex’s “architectural decisions” are really workflow decisions, not storage decisions. I’m reading the git/staleness helpers and a couple of supporting tests now to separate durable design choices from narrow implementation heuristics before I lock the ADR recommendations.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { describe, it, expect, beforeEach, afterEach } from "vitest";
     2	import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
     3	import { join } from "node:path";
     4	import { tmpdir } from "node:os";
     5	import { runPatternAdd } from "../src/pattern/index.js";
     6	
     7	let tmpDir: string;
     8	
     9	beforeEach(() => {
    10	  tmpDir = mkdtempSync(join(tmpdir(), "mex-pattern-"));
    11	  mkdirSync(join(tmpDir, "patterns"));
    12	});
    13	
    14	afterEach(() => {
    15	  rmSync(tmpDir, { recursive: true, force: true });
    16	});
    17	
    18	describe("runPatternAdd", () => {
    19	  it("creates a new pattern file and index entry", async () => {
    20	    writeFileSync(join(tmpDir, "patterns", "INDEX.md"), "| Pattern | Use when |\n|---|---|\n", "utf8");
    21	
    22	    await runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my-pattern");
    23	
    24	    const patternContent = readFileSync(join(tmpDir, "patterns", "my-pattern.md"), "utf8");
    25	    expect(patternContent).toContain("name: my-pattern");
    26	    expect(patternContent).toContain("# my-pattern");
    27	    expect(patternContent).toContain("## Verify");
    28	
    29	    const indexContent = readFileSync(join(tmpDir, "patterns", "INDEX.md"), "utf8");
    30	    expect(indexContent).toContain("| [my-pattern.md](my-pattern.md) |");
    31	  });
    32	
    33	  it("throws an error if pattern already exists", async () => {
    34	    writeFileSync(join(tmpDir, "patterns", "my-pattern.md"), "existing content", "utf8");
    35	
    36	    await expect(
    37	      runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my-pattern")
    38	    ).rejects.toThrow("already exists");
    39	  });
    40	
    41	  it("creates pattern even if INDEX.md is missing", async () => {
    42	    await runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my-pattern");
    43	
    44	    const patternContent = readFileSync(join(tmpDir, "patterns", "my-pattern.md"), "utf8");
    45	    expect(patternContent).toContain("name: my-pattern");
    46	  });
    47	
    48	  it("throws an error for invalid pattern names", async () => {
    49	    await expect(
    50	      runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my pattern")
    51	    ).rejects.toThrow("Invalid pattern name");
    52	
    53	    await expect(
    54	      runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "pattern!")
    55	    ).rejects.toThrow("Invalid pattern name");
    56	  });
    57	
    58	  it("appends to INDEX.md with a newline if it does not end with one", async () => {
    59	    writeFileSync(join(tmpDir, "patterns", "INDEX.md"), "| Pattern | Use when |", "utf8");
    60	
    61	    await runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "newline-pattern");
    62	
    63	    const indexContent = readFileSync(join(tmpDir, "patterns", "INDEX.md"), "utf8");
    64	    expect(indexContent).toBe("| Pattern | Use when |\n| [newline-pattern.md](newline-pattern.md) | [description] |\n");
    65	  });
    66	});

 succeeded in 0ms:
     1	import { describe, it, expect, beforeEach, afterEach } from "vitest";
     2	import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
     3	import { join } from "node:path";
     4	import { tmpdir } from "node:os";
     5	import { extractClaims } from "../src/drift/claims.js";
     6	
     7	let tmpDir: string;
     8	
     9	beforeEach(() => {
    10	  tmpDir = mkdtempSync(join(tmpdir(), "mex-test-"));
    11	});
    12	
    13	afterEach(() => {
    14	  rmSync(tmpDir, { recursive: true, force: true });
    15	});
    16	
    17	function writeFixture(name: string, content: string): string {
    18	  const path = join(tmpDir, name);
    19	  writeFileSync(path, content);
    20	  return path;
    21	}
    22	
    23	describe("extractClaims — paths", () => {
    24	  it("extracts inline code paths with slashes", () => {
    25	    const path = writeFixture(
    26	      "test.md",
    27	      "# Setup\n\nRun from `src/index.ts` to start."
    28	    );
    29	    const claims = extractClaims(path, "test.md");
    30	    const paths = claims.filter((c) => c.kind === "path");
    31	    expect(paths).toHaveLength(1);
    32	    expect(paths[0].value).toBe("src/index.ts");
    33	  });
    34	
    35	  it("extracts paths with directory + known extension", () => {
    36	    const path = writeFixture(
    37	      "test.md",
    38	      "# Files\n\nSee `src/config.json` and `lib/app.py`."
    39	    );
    40	    const claims = extractClaims(path, "test.md");
    41	    const paths = claims.filter((c) => c.kind === "path");
    42	    expect(paths).toHaveLength(2);
    43	    expect(paths.map((p) => p.value)).toContain("src/config.json");
    44	    expect(paths.map((p) => p.value)).toContain("lib/app.py");
    45	  });
    46	
    47	  it("skips template placeholders with angle brackets", () => {
    48	    const path = writeFixture(
    49	      "test.md",
    50	      "# Patterns\n\nCreate `patterns/<name>.md` for each task."
    51	    );
    52	    const claims = extractClaims(path, "test.md");
    53	    const paths = claims.filter((c) => c.kind === "path");
    54	    expect(paths).toHaveLength(0);
    55	  });
    56	
    57	  it("skips template placeholders with square brackets", () => {
    58	    const path = writeFixture(
    59	      "test.md",
    60	      "# Files\n\nSee `src/[slug].tsx` for dynamic routes."
    61	    );
    62	    const claims = extractClaims(path, "test.md");
    63	    const paths = claims.filter((c) => c.kind === "path");
    64	    expect(paths).toHaveLength(0);
    65	  });
    66	
    67	  it("skips URL routes without file extensions", () => {
    68	    const path = writeFixture(
    69	      "test.md",
    70	      "# Routes\n\nEndpoints: `/voice/incoming`, `/voice/process`, `/api/users`."
    71	    );
    72	    const claims = extractClaims(path, "test.md");
    73	    const paths = claims.filter((c) => c.kind === "path");
    74	    expect(paths).toHaveLength(0);
    75	  });
    76	
    77	  it("skips code snippets with parentheses or equals", () => {
    78	    const path = writeFixture(
    79	      "test.md",
    80	      "# Code\n\nUse `response.redirect(\"/next\")` and `base_url: str = os.getenv(\"FOO\")`."
    81	    );
    82	    const claims = extractClaims(path, "test.md");
    83	    const paths = claims.filter((c) => c.kind === "path");
    84	    expect(paths).toHaveLength(0);
    85	  });
    86	
    87	  it("skips wildcard patterns like *_client.py", () => {
    88	    const path = writeFixture(
    89	      "test.md",
    90	      "# Clients\n\nAll files matching `*_streaming_client.py`."
    91	    );
    92	    const claims = extractClaims(path, "test.md");
    93	    const paths = claims.filter((c) => c.kind === "path");
    94	    expect(paths).toHaveLength(0);
    95	  });
    96	
    97	  it("extracts bare filenames as path claims", () => {
    98	    const path = writeFixture(
    99	      "test.md",
   100	      "# Files\n\nSee `pipeline.py` and `server.py` for details."
   101	    );
   102	    const claims = extractClaims(path, "test.md");
   103	    const paths = claims.filter((c) => c.kind === "path");
   104	    expect(paths).toHaveLength(2);
   105	    expect(paths.map((p) => p.value)).toContain("pipeline.py");
   106	    expect(paths.map((p) => p.value)).toContain("server.py");
   107	  });
   108	
   109	  it("still extracts paths with directory separators", () => {
   110	    const path = writeFixture(
   111	      "test.md",
   112	      "# Files\n\nSee `api_clients/groq_client.py` for the implementation."
   113	    );
   114	    const claims = extractClaims(path, "test.md");
   115	    const paths = claims.filter((c) => c.kind === "path");
   116	    expect(paths).toHaveLength(1);
   117	    expect(paths[0].value).toBe("api_clients/groq_client.py");
   118	  });
   119	
   120	  it("marks paths under negated sections", () => {
   121	    const path = writeFixture(
   122	      "test.md",
   123	      "# What Does NOT Exist\n\nWe don't have `src/admin/` yet."
   124	    );
   125	    const claims = extractClaims(path, "test.md");
   126	    const paths = claims.filter((c) => c.kind === "path");
   127	    expect(paths).toHaveLength(1);
   128	    expect(paths[0].negated).toBe(true);
   129	  });
   130	});
   131	
   132	describe("extractClaims — commands", () => {
   133	  it("extracts npm run commands from inline code", () => {
   134	    const path = writeFixture(
   135	      "test.md",
   136	      "# Setup\n\nRun `npm run build` to compile."
   137	    );
   138	    const claims = extractClaims(path, "test.md");
   139	    const cmds = claims.filter((c) => c.kind === "command");
   140	    expect(cmds).toHaveLength(1);
   141	    expect(cmds[0].value).toBe("npm run build");
   142	  });
   143	
   144	  it("extracts commands from code blocks", () => {
   145	    const path = writeFixture(
   146	      "test.md",
   147	      "# Setup\n\n```sh\nnpm install\nnpm run dev\n```"
   148	    );
   149	    const claims = extractClaims(path, "test.md");
   150	    const cmds = claims.filter((c) => c.kind === "command");
   151	    expect(cmds).toHaveLength(2);
   152	    expect(cmds.map((c) => c.value)).toContain("npm install");
   153	    expect(cmds.map((c) => c.value)).toContain("npm run dev");
   154	  });
   155	
   156	  it("extracts yarn and pnpm commands", () => {
   157	    const path = writeFixture(
   158	      "test.md",
   159	      "# Run\n\nUse `yarn test` or `pnpm build`."
   160	    );
   161	    const claims = extractClaims(path, "test.md");
   162	    const cmds = claims.filter((c) => c.kind === "command");
   163	    expect(cmds).toHaveLength(2);
   164	  });
   165	
   166	  it("extracts make commands", () => {
   167	    const path = writeFixture(
   168	      "test.md",
   169	      "# Build\n\nRun `make deploy` to deploy."
   170	    );
   171	    const claims = extractClaims(path, "test.md");
   172	    const cmds = claims.filter((c) => c.kind === "command");
   173	    expect(cmds).toHaveLength(1);
   174	    expect(cmds[0].value).toBe("make deploy");
   175	  });
   176	});
   177	
   178	describe("extractClaims — dependencies", () => {
   179	  it("extracts bold dependency names under relevant sections", () => {
   180	    const path = writeFixture(
   181	      "test.md",
   182	      "# Key Libraries\n\n- **Express** — web framework\n- **Prisma** — ORM"
   183	    );
   184	    const claims = extractClaims(path, "test.md");
   185	    const deps = claims.filter((c) => c.kind === "dependency");
   186	    expect(deps).toHaveLength(2);
   187	    expect(deps.map((d) => d.value)).toContain("Express");
   188	    expect(deps.map((d) => d.value)).toContain("Prisma");
   189	  });
   190	
   191	  it("extracts version claims from bold patterns", () => {
   192	    const path = writeFixture(
   193	      "test.md",
   194	      "# Core Technologies\n\n- **React 18** — UI\n- **Node v20** — runtime"
   195	    );
   196	    const claims = extractClaims(path, "test.md");
   197	    const versions = claims.filter((c) => c.kind === "version");
   198	    expect(versions).toHaveLength(2);
   199	    expect(versions.map((v) => v.value)).toContain("React 18");
   200	    expect(versions.map((v) => v.value)).toContain("Node v20");
   201	  });
   202	
   203	  it("ignores bold text outside dependency sections", () => {
   204	    const path = writeFixture(
   205	      "test.md",
   206	      "# Architecture\n\n**Important note** about the system."
   207	    );
   208	    const claims = extractClaims(path, "test.md");
   209	    const deps = claims.filter((c) => c.kind === "dependency");
   210	    expect(deps).toHaveLength(0);
   211	  });
   212	});
   213	
   214	describe("extractClaims — returns empty for missing file", () => {
   215	  it("returns empty array for nonexistent file", () => {
   216	    const claims = extractClaims("/nonexistent/file.md", "missing.md");
   217	    expect(claims).toEqual([]);
   218	  });
   219	});

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
     1	import { describe, it, expect } from "vitest";
     2	import { computeScore } from "../src/drift/scoring.js";
     3	import type { DriftIssue } from "../src/types.js";
     4	
     5	function issue(severity: DriftIssue["severity"]): DriftIssue {
     6	  return {
     7	    code: "MISSING_PATH",
     8	    severity,
     9	    file: "test.md",
    10	    line: 1,
    11	    message: "test",
    12	  };
    13	}
    14	
    15	describe("computeScore", () => {
    16	  it("returns 100 for no issues", () => {
    17	    expect(computeScore([])).toBe(100);
    18	  });
    19	
    20	  it("deducts 10 per error", () => {
    21	    expect(computeScore([issue("error")])).toBe(90);
    22	    expect(computeScore([issue("error"), issue("error")])).toBe(80);
    23	  });
    24	
    25	  it("deducts 3 per warning", () => {
    26	    expect(computeScore([issue("warning")])).toBe(97);
    27	  });
    28	
    29	  it("deducts 1 per info", () => {
    30	    expect(computeScore([issue("info")])).toBe(99);
    31	  });
    32	
    33	  it("combines severities correctly", () => {
    34	    const issues = [issue("error"), issue("warning"), issue("info")];
    35	    expect(computeScore(issues)).toBe(86); // 100 - 10 - 3 - 1
    36	  });
    37	
    38	  it("clamps to 0 minimum", () => {
    39	    const many = Array.from({ length: 15 }, () => issue("error"));
    40	    expect(computeScore(many)).toBe(0);
    41	  });
    42	});

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I have enough of the core design now, but I want precise README line anchors for the high-level architecture claims before I finalize the ADR. I’m grabbing those last line-numbered references so each recommendation can point to the public contract and the implementing source together.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   221	
   222	| Tool | Config file |
   223	|------|------------|
   224	| Claude Code | `CLAUDE.md` |
   225	| Cursor | `.cursorrules` |
   226	| Windsurf | `.windsurfrules` |
   227	| GitHub Copilot | `.github/copilot-instructions.md` |
   228	| OpenCode | `.opencode/opencode.json` |
   229	| Codex (OpenAI) | `AGENTS.md` |
   230	
   231	Most config files embed the same instructions directly. OpenCode is the exception — `.opencode/opencode.json` references `.mex/AGENTS.md` instead of embedding content. `mex setup` asks which tool you use and creates the appropriate config.
   232	
   233	## Contributing
   234	
   235	Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.
   236	
   237	## Changelog
   238	
   239	See [CHANGELOG.md](CHANGELOG.md) for release history.
   240	
   241	## License
   242	
   243	[MIT](LICENSE)
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md | sed -n '1,220p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,240p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md | sed -n '1,220p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
     1	# Setup — Populate This Scaffold
     2	
     3	This file contains the prompts to populate the scaffold. It is NOT the dev environment setup — for that, see `context/setup.md` after population.
     4	
     5	This scaffold is currently empty. Follow the steps below to populate it for your project.
     6	
     7	## Recommended: Use setup.sh
     8	
     9	```bash
    10	.mex/setup.sh
    11	```
    12	
    13	The script handles everything automatically:
    14	1. Detects your project state (existing codebase, fresh project, or partial)
    15	2. Asks which AI tool you use and copies the right config file
    16	3. Pre-scans your codebase with `mex init` to build a structured brief (~5-8k tokens vs ~50k from AI exploration)
    17	4. Builds and runs the population prompt — or prints it for manual paste
    18	
    19	If you want to populate manually instead, use the prompts below.
    20	
    21	## Detecting Your State
    22	
    23	**Existing codebase?** Follow Option A.
    24	**Fresh project, nothing built yet?** Follow Option B.
    25	**Partially built?** Follow Option A — the agent will flag empty slots it cannot fill yet.
    26	
    27	---
    28	
    29	## Option A — Existing Codebase
    30	
    31	Paste the following prompt into your agent:
    32	
    33	---
    34	
    35	**SETUP PROMPT — copy everything between the lines:**
    36	
    37	```
    38	You are going to populate an AI context scaffold for this project.
    39	The scaffold lives in the root of this repository.
    40	
    41	Read the following files in order before doing anything else:
    42	1. ROUTER.md — understand the scaffold structure
    43	2. context/architecture.md — read the annotation comments to understand what belongs there
    44	3. context/stack.md — same
    45	4. context/conventions.md — same
    46	5. context/decisions.md — same
    47	6. context/setup.md — same
    48	
    49	Then explore this codebase:
    50	- Read the main entry point(s)
    51	- Read the folder structure
    52	- Read 2-3 representative files from each major layer
    53	- Read any existing README or documentation
    54	
    55	PASS 1 — Populate knowledge files:
    56	
    57	Populate each context/ file by replacing the annotation comments
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
    68	If yes, create additional domain-specific context files in context/.
    69	Examples: a project with a complex auth system gets context/auth.md.
    70	A data pipeline gets context/ingestion.md. A project with Stripe gets
    71	context/payments.md. Use the same YAML frontmatter format (name,
    72	description, triggers, edges, last_updated). Only create these for
    73	domains that have real depth — not for simple integrations that fit
    74	in a few lines of architecture.md.
    75	
    76	After populating context/ files, update ROUTER.md:
    77	- Fill in the Current Project State section based on what you found
    78	- Add rows to the routing table for any domain-specific context files you created
    79	
    80	Update AGENTS.md:
    81	- Fill in the project name, one-line description, non-negotiables, and commands
    82	
    83	PASS 2 — Generate starter patterns:
    84	
    85	Read patterns/README.md for the format and categories.
    86	
    87	Generate 3-5 starter patterns for the most common and most dangerous task
    88	types in this project. Focus on:
    89	- The 1-2 tasks a developer does most often (e.g., add endpoint, add component)
    90	- The 1-2 integrations with the most non-obvious gotchas
    91	- 1 debug pattern for the most common failure boundary
    92	
    93	Each pattern should be specific to this project — real file paths, real gotchas,
    94	real verify steps derived from the code you read in Pass 1.
    95	Use the format in patterns/README.md. Name descriptively (e.g., add-endpoint.md).
    96	
    97	Do NOT try to generate a pattern for every possible task type. The scaffold
    98	grows incrementally — the behavioural contract (step 5: GROW) will create
    99	new patterns from real work as the project evolves. Setup just seeds the most
   100	critical ones.
   101	
   102	After generating patterns, update patterns/INDEX.md with a row for each
   103	pattern file you created. For multi-section patterns, add one row per task
   104	section using anchor links (see INDEX.md annotation for format).
   105	
   106	PASS 3 — Wire the web:
   107	
   108	Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
   109	For each file, add or update the `edges` array in the YAML frontmatter.
   110	Each edge should point to another scaffold file that is meaningfully related,
   111	with a `condition` explaining when an agent should follow that edge.
   112	
   113	Rules for edges:
   114	- Every context/ file should have at least 2 edges
   115	- Every pattern file should have at least 1 edge (usually to the relevant context file)
   116	- Edges should be bidirectional where it makes sense (if A links to B, consider B linking to A)
   117	- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
   118	- Pattern files can edge to other patterns (e.g., debug pattern → related task pattern)
   119	
   120	Important: only write content derived from the codebase.
   121	Do not include system-injected text (dates, reminders, etc.)
   122	in any scaffold file.
   123	
   124	When done, confirm which files were populated and flag any slots
   125	you could not fill with confidence.
   126	```
   127	
   128	---
   129	
   130	## Option B — Fresh Project
   131	
   132	Paste the following prompt into your agent:
   133	
   134	---
   135	
   136	**SETUP PROMPT — copy everything between the lines:**
   137	
   138	```
   139	You are going to populate an AI context scaffold for a project that
   140	is just starting. Nothing is built yet.
   141	
   142	Read the following files in order before doing anything else:
   143	1. ROUTER.md — understand the scaffold structure
   144	2. All files in context/ — read the annotation comments in each
   145	
   146	Then ask me the following questions one section at a time.
   147	Wait for my answer before moving to the next section:
   148	
   149	1. What does this project do? (one sentence)
   150	2. What are the hard rules — things that must never happen in this codebase?
   151	3. What is the tech stack? (language, framework, database, key libraries)
   152	4. Why did you choose this stack over alternatives?
   153	5. How will the major pieces connect? Describe the flow of a typical request/action.
   154	6. What patterns do you want to enforce from day one?
   155	7. What are you deliberately NOT building or using?
   156	
   157	After I answer, populate the context/ files based on my answers.
   158	For any slot you cannot fill yet, write "[TO BE DETERMINED]" and note
   159	what needs to be decided before it can be filled.
   160	
   161	Then assess: based on my answers, does this project have domains complex
   162	enough that cramming them into architecture.md would make it too long
   163	or too shallow? If yes, create additional domain-specific context files
   164	in context/. Examples: a project with a complex auth system gets
   165	context/auth.md. A data pipeline gets context/ingestion.md. A project
   166	with Stripe gets context/payments.md. Use the same YAML frontmatter
   167	format (name, description, triggers, edges, last_updated). Only create
   168	these for domains that have real depth — not for simple integrations
   169	that fit in a few lines of architecture.md. For fresh projects, mark
   170	domain-specific unknowns with "[TO BE DETERMINED — populate after first
   171	implementation]".
   172	
   173	Update ROUTER.md current state to reflect that this is a new project.
   174	Add rows to the routing table for any domain-specific context files you created.
   175	Update AGENTS.md with the project name, description, non-negotiables, and commands.
   176	
   177	Read patterns/README.md for the format and categories.
   178	
   179	Generate 2-3 starter patterns for the most obvious task types you can
   180	anticipate for this stack. Focus on the tasks a developer will do first.
   181	Mark unknowns with "[VERIFY AFTER FIRST IMPLEMENTATION]".
   182	
   183	Do NOT try to anticipate every possible pattern. The scaffold grows
   184	incrementally — the behavioural contract (step 5: GROW) will create
   185	new patterns from real work as the project evolves. Setup just seeds
   186	the most critical ones.
   187	
   188	After generating patterns, update patterns/INDEX.md with a row for each
   189	pattern file you created.
   190	
   191	PASS 3 — Wire the web:
   192	
   193	Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
   194	For each file, add or update the `edges` array in the YAML frontmatter.
   195	Each edge should point to another scaffold file that is meaningfully related,
   196	with a `condition` explaining when an agent should follow that edge.
   197	
   198	Rules for edges:
   199	- Every context/ file should have at least 2 edges
   200	- Every pattern file should have at least 1 edge
   201	- Edges should be bidirectional where it makes sense
   202	- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
   203	
   204	Important: only write content derived from your answers.
   205	Do not include system-injected text (dates, reminders, etc.)
   206	in any scaffold file.
   207	```
   208	
   209	---
   210	
   211	## After Setup
   212	
   213	**Verify** by starting a fresh session and asking your agent:
   214	"Read `.mex/ROUTER.md` and tell me what you now know about this project."
   215	
   216	A well-populated scaffold should give the agent enough to:
   217	- Describe the architecture without looking at code
   218	- Name the non-negotiable conventions
   219	- Know which files to load for any given task type
   220	- Know which patterns exist for common task types
     1	# Sync — Realign This Scaffold
     2	
     3	## Recommended: Use sync.sh
     4	
     5	```bash
     6	.mex/sync.sh
     7	```
     8	
     9	The script runs drift detection first, shows you exactly what's wrong, then offers:
    10	1. **Targeted sync** — AI fixes only the flagged files (fastest, cheapest)
    11	2. **Full resync** — AI re-reads everything and updates all scaffold files
    12	3. **Prompt export** — shows the prompts for manual paste
    13	4. **Exit** — fix it yourself
    14	
    15	## Quick Check
    16	
    17	```bash
    18	mex check              # full drift report
    19	mex check --quiet      # one-liner: "drift score 85/100 (1 error)"
    20	mex sync --dry-run     # preview targeted fix prompts
    21	```
    22	
    23	## Manual Resync
    24	
    25	If you prefer to paste a prompt manually, or don't have the CLI built:
    26	
    27	---
    28	
    29	**SYNC PROMPT — copy everything between the lines:**
    30	
    31	```
    32	You are going to resync the AI context scaffold for this project.
    33	The scaffold may be out of date — the codebase has changed since it was last populated.
    34	
    35	First, read all files in context/ to understand the current scaffold state.
    36	Then explore what has changed in the codebase since the scaffold was last updated.
    37	Check the last_updated dates in the YAML frontmatter of each file.
    38	
    39	For each context/ file:
    40	1. Compare the current scaffold content to the actual codebase
    41	2. Identify what has changed, been added, or been removed
    42	3. Update the file to reflect the current state
    43	
    44	Critical rules for updating:
    45	- Use surgical, targeted edits — NOT full file rewrites. Read the existing content,
    46	  identify what changed, and update only those sections.
    47	- PRESERVE YAML frontmatter structure. Never delete or rewrite the entire frontmatter block.
    48	  Edit individual fields only. The edges, triggers, name, and description fields must
    49	  survive every sync. If you need to update edges, add or remove individual entries —
    50	  do not replace the entire array.
    51	- In context/decisions.md: NEVER delete existing decisions.
    52	  If a decision has changed, mark the old entry as "Superseded by [new decision title]"
    53	  and add the new decision above it with today's date.
    54	- In all other files: update content to reflect current reality
    55	- Update last_updated in the YAML frontmatter of every file you change
    56	- After updating each file, update ROUTER.md Current Project State
    57	
    58	When done, report:
    59	- Which files were updated and what changed
    60	- Any decisions that were superseded
    61	- Any slots that could not be filled with confidence
    62	```

codex
# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

## Findings
### Finding 1: Mex chose a tiny always-loaded anchor plus explicit routing into modular markdown context
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L178), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43)
- **What it does**: Mex keeps the root prompt tiny, then routes sessions into `context/*` and `patterns/*`, with a fixed `CONTEXT -> BUILD -> VERIFY -> DEBUG -> GROW` behavior loop.
- **Why it matters**: This is a strong human-auditable documentation pattern, but for us it fits best as a companion docs layer, not as a replacement for `memory_context`, `session_bootstrap`, CocoIndex, or code-graph routing.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Mex deliberately separates zero-token integrity checks from AI repair
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: `runDriftCheck()` extracts claims and frontmatter from scaffold files, runs static checkers, and computes integrity issues before any AI fix step is considered.
- **Why it matters**: This is the cleanest adopt-now decision. Spec Kit Memory already has strong retrieval and graph readiness, but it still lacks a separate markdown integrity layer for dead paths, dead edges, and pattern-index drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex uses markdown files as the primary persistence substrate for project memory
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L24), [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L200), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L45), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L223), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L996), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L1060)
- **What it does**: Mex treats navigable markdown as the long-lived memory store, with CLI tooling keeping those files aligned to the repo.
- **Why it matters**: We should reject this as a core replacement for Spec Kit Memory. It would be a regression versus our database-backed hybrid retrieval, causal links, session dedup, and structural code-graph queries.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Mex builds a structured scanner brief before asking AI to populate or reason about the scaffold
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L50), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L8)
- **What it does**: `mex init` scans manifests, entry points, folder tree, tooling, and README, then tells the AI to populate from that brief instead of freeform repo exploration.
- **Why it matters**: This is a good pattern for our spec/changelog/doc generation workflows because it makes AI inputs smaller and auditable, but it is not a recall-path improvement by itself.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Mex’s core maintenance loop is detect -> build file-scoped repair brief -> fix -> recheck -> repeat
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L96), [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md#L9), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L18)
- **What it does**: Mex groups issues by file, includes current file content plus filesystem and git context, runs one repair session, then measures score delta and optionally loops again.
- **Why it matters**: This is the strongest reusable DX decision. Spec Kit has the primitives already, but not a single guided “doctor/repair” loop that owns diagnosis, suggested fix path, rerun, and stop conditions.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: Mex grows its knowledge base from completed work through patterns and append-only decisions
- **Source**: [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L64), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L6), [context/decisions.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md#L20)
- **What it does**: After work, Mex wants new task patterns added, stale context surgically updated, and old decisions preserved instead of overwritten.
- **Why it matters**: We already preserve session context and can model causal lineage, but we do not yet have an equally explicit project-pattern growth loop. That is useful, especially for repeatable operational playbooks, but it should remain secondary to indexed memory.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Mex collapses scaffold health into a single score with fixed penalty weights and hardcoded staleness thresholds
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L81), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12), [reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16)
- **What it does**: Health is `100 - 10/error - 3/warning - 1/info`, with staleness thresholds of 30/90 days and 50/200 commits, then rendered as a single drift score.
- **Why it matters**: This is good UX for a small scaffold, but it is too lossy for Spec Kit Memory. Our system needs subsystem-specific evidence and eval-backed thresholds, not one blended score that hides whether the problem is retrieval quality, graph freshness, or markdown integrity.
- **Recommendation**: reject
- **Impact**: medium

## Assessment
- New information ratio: 0.36

## Recommended Next Focus
Design the Spec Kit policy split explicitly: keep Mex-style static drift as a separate integrity layer, not part of recall, then define the retrieval policy matrix with four outcomes: `lexical-first`, `semantic-first`, `hybrid-balanced`, and `graph-first`, plus when a future `spec-kit doctor` facade should invoke each path.
hook: Stop
hook: Stop Completed
tokens used
285,669
# Iteration 029: ARCHITECTURE DECISION RECORD

## Focus
ARCHITECTURE DECISION RECORD: Document the key architectural decisions this system made and why. Which decisions should we adopt and which should we reject?

## Findings
### Finding 1: Mex chose a tiny always-loaded anchor plus explicit routing into modular markdown context
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L178), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43)
- **What it does**: Mex keeps the root prompt tiny, then routes sessions into `context/*` and `patterns/*`, with a fixed `CONTEXT -> BUILD -> VERIFY -> DEBUG -> GROW` behavior loop.
- **Why it matters**: This is a strong human-auditable documentation pattern, but for us it fits best as a companion docs layer, not as a replacement for `memory_context`, `session_bootstrap`, CocoIndex, or code-graph routing.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Mex deliberately separates zero-token integrity checks from AI repair
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: `runDriftCheck()` extracts claims and frontmatter from scaffold files, runs static checkers, and computes integrity issues before any AI fix step is considered.
- **Why it matters**: This is the cleanest adopt-now decision. Spec Kit Memory already has strong retrieval and graph readiness, but it still lacks a separate markdown integrity layer for dead paths, dead edges, and pattern-index drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex uses markdown files as the primary persistence substrate for project memory
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L24), [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L200), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L45), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L223), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L996), [Spec Kit README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L1060)
- **What it does**: Mex treats navigable markdown as the long-lived memory store, with CLI tooling keeping those files aligned to the repo.
- **Why it matters**: We should reject this as a core replacement for Spec Kit Memory. It would be a regression versus our database-backed hybrid retrieval, causal links, session dedup, and structural code-graph queries.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Mex builds a structured scanner brief before asking AI to populate or reason about the scaffold
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L50), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L8)
- **What it does**: `mex init` scans manifests, entry points, folder tree, tooling, and README, then tells the AI to populate from that brief instead of freeform repo exploration.
- **Why it matters**: This is a good pattern for our spec/changelog/doc generation workflows because it makes AI inputs smaller and auditable, but it is not a recall-path improvement by itself.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Mex’s core maintenance loop is detect -> build file-scoped repair brief -> fix -> recheck -> repeat
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L96), [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md#L9), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L18)
- **What it does**: Mex groups issues by file, includes current file content plus filesystem and git context, runs one repair session, then measures score delta and optionally loops again.
- **Why it matters**: This is the strongest reusable DX decision. Spec Kit has the primitives already, but not a single guided “doctor/repair” loop that owns diagnosis, suggested fix path, rerun, and stop conditions.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: Mex grows its knowledge base from completed work through patterns and append-only decisions
- **Source**: [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L64), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L6), [context/decisions.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md#L20)
- **What it does**: After work, Mex wants new task patterns added, stale context surgically updated, and old decisions preserved instead of overwritten.
- **Why it matters**: We already preserve session context and can model causal lineage, but we do not yet have an equally explicit project-pattern growth loop. That is useful, especially for repeatable operational playbooks, but it should remain secondary to indexed memory.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Mex collapses scaffold health into a single score with fixed penalty weights and hardcoded staleness thresholds
- **Source**: [mex README](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L81), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12), [reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16)
- **What it does**: Health is `100 - 10/error - 3/warning - 1/info`, with staleness thresholds of 30/90 days and 50/200 commits, then rendered as a single drift score.
- **Why it matters**: This is good UX for a small scaffold, but it is too lossy for Spec Kit Memory. Our system needs subsystem-specific evidence and eval-backed thresholds, not one blended score that hides whether the problem is retrieval quality, graph freshness, or markdown integrity.
- **Recommendation**: reject
- **Impact**: medium

## Assessment
- New information ratio: 0.36

## Recommended Next Focus
Design the Spec Kit policy split explicitly: keep Mex-style static drift as a separate integrity layer, not part of recall, then define the retrieval policy matrix with four outcomes: `lexical-first`, `semantic-first`, `hybrid-balanced`, and `graph-first`, plus when a future `spec-kit doctor` facade should invoke each path.
