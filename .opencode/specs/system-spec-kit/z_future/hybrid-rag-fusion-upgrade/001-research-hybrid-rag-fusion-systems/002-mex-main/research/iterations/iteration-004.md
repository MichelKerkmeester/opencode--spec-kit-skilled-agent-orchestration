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
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

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
I’m treating this as a read-only deep-research pass focused specifically on session lifecycle and context survival. I’ll trace the external source code first, then contrast those mechanics with Spec Kit Memory’s session surfaces so the findings stay concrete and non-redundant.
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
/bin/zsh -lc 'rg -n "mex|session|sync|watch|generate-context|memory_context|memory_match_triggers|session_bootstrap|session_resume|task_preflight|task_postflight" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
9:- rollout_summaries/2026-04-09T15-19-09-O7Hp-026_fix_batch_review_findings.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T17-19-09-019d72d3-6266-79c3-a21a-c0016dec6fcf.jsonl, updated_at=2026-04-09T17:16:36+00:00, thread_id=019d72d3-6266-79c3-a21a-c0016dec6fcf, task-local focus=close P1 findings in phases 002/003/008/010/013/014 and rerun strict/typecheck/tests)
34:scope: per-phase deep-review packet execution under `026-graph-and-context-optimization/review/` with strict write-scope boundaries, shared-state synchronization, and continuation/extension handling
41:- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=011-014 packet generation + aggregate state bump to 8/13)
51:- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=resume check at 13/13 + consolidated report verification)
57:## Task 3: Extend Batch A (002-005) from 5 to 10 iterations and re-sync per-phase + batch artifacts, outcome success
61:- rollout_summaries/2026-04-09T14-19-21-dEbR-batch_a_review_extensions_026_graph_context.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-21-019d729c-a473-7082-989e-7b5a71cf2227.jsonl, updated_at=2026-04-09T15:02:18+00:00, thread_id=019d729c-a473-7082-989e-7b5a71cf2227, task-local focus=iteration-006..010 extension for 002-005 + consolidated totals update)
67:## Task 4: Extend Batch B (006-010) to 10 iterations and re-sync program totals to 108, outcome success
71:- rollout_summaries/2026-04-09T14-19-26-Ga5w-batch_b_review_10_iteration_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-26-019d729c-b7c1-72c1-90c2-e72c0eb0d52e.jsonl, updated_at=2026-04-09T15:12:27+00:00, thread_id=019d729c-b7c1-72c1-90c2-e72c0eb0d52e, task-local focus=006-010 iteration-006..010 extension + convergence/aggregate sync)
82:- when operator requested “extra stability passes,” extend each targeted phase from 5 to 10 iterations before closure and sync batch-level state/report immediately [Task 3][Task 4]
95:- symptom: stale or conflicting batch totals (for example per-phase files at 10 iterations but global files still at 5); cause: extending iterations without re-syncing shared tracker/consolidated report; fix: treat `batch-phase-review-state.json` and `batch-phase-review-consolidated.md` as mandatory final sync targets after every extension pass [Task 3]
106:- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=research group + 32 memory metadata anchor normalization)
116:- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-memory-quality) packet-local summary)
126:- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-runtime) and targeted validation on 002/014)
151:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
157:- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
170:- keep JSON payload overrides wired through normalizer/collector: `phase`, `status/sessionStatus`, and completion-percent aliases must map to `projectPhase`, `sessionStatus`, and `completionPercent` to prevent stale-default warnings [Task 1]
174:- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
181:- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]
185:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for follow-on edits to 014 graph/query/session payload logic in this checkout when regression-floor and strict doc validation must stay green
191:- rollout_summaries/2026-04-09T07-35-51-j53b-implement_014_code_graph_upgrades.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T09-35-51-019d712b-3824-7403-9e7e-a2a68ef35e61.jsonl, updated_at=2026-04-09T09:39:44+00:00, thread_id=019d712b-3824-7403-9e7e-a2a68ef35e61)
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
207:- doc closeout requires synchronized updates across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` with exact evidence pointers and explicit deferred-lane notes per ADR-003 [Task 1]
222:- rollout_summaries/2026-04-09T06-44-41-UMNL-sk_code_opencode_head10_style_check.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T08-44-41-019d70fc-632a-76c2-9b62-3f46d18aa9dd.jsonl, updated_at=2026-04-09T11:01:44+00:00, thread_id=019d70fc-632a-76c2-9b62-3f46d18aa9dd)
243:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for memory-redundancy follow-on work in this checkout when syncing implementation-summary/tasks language and answering Phase 6 plan questions from completed research
249:- rollout_summaries/2026-04-08T14-40-56-cqSE-memory_redundancy_doc_update_plan_phase6.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T16-40-56-019d6d8a-0a27-7223-be61-d5038a73d914.jsonl, updated_at=2026-04-08T15:47:45+00:00, thread_id=019d6d8a-0a27-7223-be61-d5038a73d914)
259:- rollout_summaries/2026-04-08T14-40-56-cqSE-memory_redundancy_doc_update_plan_phase6.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T16-40-56-019d6d8a-0a27-7223-be61-d5038a73d914.jsonl, updated_at=2026-04-08T15:47:45+00:00, thread_id=019d6d8a-0a27-7223-be61-d5038a73d914, task-local focus=Phase 6 authority summary)
289:- rollout_summaries/2026-04-08T06-49-08-WFmZ-mem_palace_phase_prompt.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-49-08-019d6bda-1819-7e43-99e3-158cdec78925.jsonl, updated_at=2026-04-08T06:56:04+00:00, thread_id=019d6bda-1819-7e43-99e3-158cdec78925)
299:- rollout_summaries/2026-04-08T06-55-41-FaWO-contextador_deep_research_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-41-019d6be0-1720-7040-8abd-586be20dce1e.jsonl, updated_at=2026-04-08T07:50:02+00:00, thread_id=019d6be0-1720-7040-8abd-586be20dce1e)
309:- rollout_summaries/2026-04-08T06-54-25-D2rK-claudest_continuation_root_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-54-25-019d6bde-f06d-7992-8c23-62eaead4b928.jsonl, updated_at=2026-04-08T07:59:19+00:00, thread_id=019d6bde-f06d-7992-8c23-62eaead4b928)
319:- rollout_summaries/2026-04-08T06-55-14-iMh2-graphify_translation_closeout_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-14-019d6bdf-ae9f-71d3-9b12-ee5c943b14d0.jsonl, updated_at=2026-04-08T08:12:09+00:00, thread_id=019d6bdf-ae9f-71d3-9b12-ee5c943b14d0)
323:- 004-graphify, F-CROSS-094..F-CROSS-098, payload bridge contract fit, session-prime compact-inject response-hints, local-file multimodal lane, Appendix D, leave v1 files untouched
329:- rollout_summaries/2026-04-08T06-56-02-48S0-spec_kit_deep_research_memory_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-56-02-019d6be0-6b03-7ea3-9035-9aa81613caa4.jsonl, updated_at=2026-04-08T08:54:40+00:00, thread_id=019d6be0-6b03-7ea3-9035-9aa81613caa4)
339:- rollout_summaries/2026-04-08T09-18-00-WHKH-update_cache_warning_and_close_normalized_analytics.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T11-18-00-019d6c62-646b-7423-8d05-2b4bfa1536db.jsonl, updated_at=2026-04-08T11:11:26+00:00, thread_id=019d6c62-646b-7423-8d05-2b4bfa1536db)
349:- rollout_summaries/2026-04-08T09-18-00-WHKH-update_cache_warning_and_close_normalized_analytics.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T11-18-00-019d6c62-646b-7423-8d05-2b4bfa1536db.jsonl, updated_at=2026-04-08T11:11:26+00:00, thread_id=019d6c62-646b-7423-8d05-2b4bfa1536db, task-local focus=031 closeout)
359:- rollout_summaries/2026-04-08T12-06-36-AZZJ-026_graph_follow_on_phases.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T14-06-36-019d6cfc-bd8a-7db3-af4f-bdf3ebaec677.jsonl, updated_at=2026-04-08T13:21:12+00:00, thread_id=019d6cfc-bd8a-7db3-af4f-bdf3ebaec677)
384:- Graphify closeout guidance is additive rather than replacement: enrich existing payload confidence/provenance and layered runtime hints (`session-prime`, `compact-inject`, `response-hints`), keep low-level invalidation as already covered by Public indexing, and defer clustering metadata to a later phase [Task 4]
411:- rollout_summaries/2026-04-04T15-43-31-Svpz-research_agentic_system_phase_prompts.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T17-43-31-019d5929-e78c-73c1-bd08-74488a2b61bd.jsonl, updated_at=2026-04-04T15:53:59+00:00, thread_id=019d5929-e78c-73c1-bd08-74488a2b61bd)
421:- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)
450:- rollout_summaries/2026-04-03T11-59-45-KehP-041_recursive_agent_loop_rename.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-59-45-019d5336-ad92-7812-9658-b4a1b290dbb9.jsonl, updated_at=2026-04-04T07:00:23+00:00, thread_id=019d5336-ad92-7812-9658-b4a1b290dbb9)
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
460:- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
470:- rollout_summaries/2026-04-03T10-45-55-qAti-rename_040_spec_references.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-45-55-019d52f3-14c7-7010-9b34-a491a18d8448.jsonl, updated_at=2026-04-03T11:27:03+00:00, thread_id=019d52f3-14c7-7010-9b34-a491a18d8448)
480:- rollout_summaries/2026-04-05T07-09-09-UzOl-specs_parent_index_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T09-09-09-019d5c79-58a8-76c2-b111-f738e245cffd.jsonl, updated_at=2026-04-05T09:42:28+00:00, thread_id=019d5c79-58a8-76c2-b111-f738e245cffd)
490:- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)
528:- rollout_summaries/2026-04-03T13-23-10-OyD8-feedback_pipeline_review_docs_build.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T15-23-10-019d5383-0b8b-7231-870f-833b48f05192.jsonl, updated_at=2026-04-03T13:50:36+00:00, thread_id=019d5383-0b8b-7231-870f-833b48f05192)
538:- rollout_summaries/2026-04-03T13-51-22-gNkZ-feedback_signal_runtime_check.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T15-51-22-019d539c-dc76-7bc1-b0f6-c2297641ecb9.jsonl, updated_at=2026-04-03T14:27:14+00:00, thread_id=019d539c-dc76-7bc1-b0f6-c2297641ecb9)
542:- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
546:- `follow_on_tool_use` depends on a session id that matches the in-memory search session cache; if a non-search tool call lacks/does not inherit that session id, the follow-on event will not emit [Task 2]
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
553:- symptom: only `search_shown` (or incomplete event set) appears despite code changes; cause: context-server still running old dist artifacts; fix: restart runtime after rebuild and rerun the same session-scoped event sequence [Task 1]
554:- symptom: `follow_on_tool_use` stays zero while other events emit; cause: non-search tool has no session-id propagation path; fix: choose a tool that accepts session id or add transport/schema-based session propagation before expecting this event [Task 2]
557:scope: expanded changelog style updates, nested per-packet/per-phase changelog generator integration, and runtime prompt mirror sync
558:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for changelog workflow changes in this checkout, keeping packet-local changelog outputs and shared command mirrors in sync
564:- rollout_summaries/2026-04-03T10-22-49-kxk6-nested_changelog_kit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-22-49-019d52dd-ed36-7121-b02d-1fe3be87fd42.jsonl, updated_at=2026-04-03T11:35:01+00:00, thread_id=019d52dd-ed36-7121-b02d-1fe3be87fd42)
570:## Task 2: Rewrite shared changelog docs/templates to short-heading style and sync runtime mirrors, outcome success
574:- rollout_summaries/2026-04-03T11-38-20-Mg7F-changelog_update_and_runtime_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-38-20-019d5323-1305-7d91-a2bc-5d3cb2983d3b.jsonl, updated_at=2026-04-03T12:24:53+00:00, thread_id=019d5323-1305-7d91-a2bc-5d3cb2983d3b)
589:- keep `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` docs and YAML assets in sync when changelog contract changes; runtime `.agents`/`.gemini` mirrors should be regenerated from shared command source [Task 2]
598:scope: remediation packet implementation for 024 review findings, context-prime alignment, and deterministic session-stop autosave retargeting
605:- rollout_summaries/2026-04-03T08-46-43-VFCx-review_029_remediation_context_prime.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-46-43-019d5285-f400-7d32-a55f-807015f4fbb1.jsonl, updated_at=2026-04-03T08:54:49+00:00, thread_id=019d5285-f400-7d32-a55f-807015f4fbb1)
615:- rollout_summaries/2026-04-03T09-08-07-SdtT-029_review_remediation_changelog.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T11-08-07-019d5299-8a15-7942-9b75-b4d286a47441.jsonl, updated_at=2026-04-03T09:49:09+00:00, thread_id=019d5299-8a15-7942-9b75-b4d286a47441)
619:- session-stop retarget, detectSpecFolder, lastSpecFolder, hook-session-stop.vitest.ts, changelog.md, 4 files / 20 tests
645:- rollout_summaries/2026-04-03T06-52-50-dog7-deep_research_90_iter_external_wave.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T08-52-50-019d521d-afbc-7da0-817d-675090a19d1f.jsonl, updated_at=2026-04-03T08:23:39+00:00, thread_id=019d521d-afbc-7da0-817d-675090a19d1f)
655:- rollout_summaries/2026-04-03T08-52-11-1f0W-deep_research_phase1_100pct.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-52-11-019d528a-f2bc-7053-9269-e85eded82c3e.jsonl, updated_at=2026-04-03T09:49:06+00:00, thread_id=019d528a-f2bc-7053-9269-e85eded82c3e)
665:- rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-53-06-019d528b-cc68-77b3-9b4d-8b5dc37b791e.jsonl, updated_at=2026-04-03T09:42:20+00:00, thread_id=019d528b-cc68-77b3-9b4d-8b5dc37b791e)
690:scope: deep-review closure, strict-validation remediation, changelog truth-sync, and README/recovery-contract doc parity for packet 023/024 work
697:- rollout_summaries/2026-04-02T05-48-08-5Tzh-deep_review_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T07-48-08-019d4cbc-18da-7772-8fa1-4eb40c6a021f.jsonl, updated_at=2026-04-02T09:30:47+00:00, thread_id=019d4cbc-18da-7772-8fa1-4eb40c6a021f)
707:- rollout_summaries/2026-04-02T05-48-55-ewoK-023_esm_module_compliance_deep_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T07-48-55-019d4cbc-d03a-7fb2-a2ea-7028e451483e.jsonl, updated_at=2026-04-02T09:39:16+00:00, thread_id=019d4cbc-d03a-7fb2-a2ea-7028e451483e)
717:- rollout_summaries/2026-04-02T12-39-09-CmJ7-specs_023_011_024_compact_graph_validation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T14-39-09-019d4e34-6449-7152-91b3-39a6dd9c3dc5.jsonl, updated_at=2026-04-02T15:00:40+00:00, thread_id=019d4e34-6449-7152-91b3-39a6dd9c3dc5)
723:## Task 4: Align session recovery contract + hook path docs across 023/024 + command docs, outcome success
727:- rollout_summaries/2026-04-02T15-19-14-ItVu-doc_parity_recovery_024_023.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-19-14-019d4ec6-f1fa-75d3-9091-3f77194ae5c0.jsonl, updated_at=2026-04-02T17:06:24+00:00, thread_id=019d4ec6-f1fa-75d3-9091-3f77194ae5c0)
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
733:## Task 5: Truth-sync changelog packet `023-esm-module-compliance` (add phase 013 + adjust 010-012 claims), outcome success
737:- rollout_summaries/2026-04-02T15-04-40-XOMQ-changelog_023_esm_module_compliance_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-04-40-019d4eb9-9c7f-7e91-a395-f537a58c3d74.jsonl, updated_at=2026-04-02T15:16:00+00:00, thread_id=019d4eb9-9c7f-7e91-a395-f537a58c3d74)
747:- rollout_summaries/2026-04-02T15-03-16-TyzB-changelog_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-03-16-019d4eb8-5687-7820-b943-28f8d97369cf.jsonl, updated_at=2026-04-02T15:17:25+00:00, thread_id=019d4eb8-5687-7820-b943-28f8d97369cf)
757:- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
767:- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
788:- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
801:scope: session-start injection debugging, codex runtime session-id fallback, and test-environment fixes for git-context-sensitive suites
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
804:## Task 1: Debug session-start injection, create phase 026, and stabilize test environment, outcome success
808:- rollout_summaries/2026-04-02T09-20-39-30Ww-compact_code_graph_session_start_injection_debug.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T11-20-39-019d4d7e-a9d9-7081-bf44-8615f401e064.jsonl, updated_at=2026-04-02T10:59:48+00:00, thread_id=019d4d7e-a9d9-7081-bf44-8615f401e064)
812:- code_graph_scan, 026-session-start-injection-debug, create.sh --phase, TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp, session-enrichment.vitest.ts, spec-affinity.vitest.ts
814:## Task 2: Fix Codex session priming fallback so non-hook sessions prime from `CODEX_THREAD_ID`, outcome success
818:- rollout_summaries/2026-04-02T13-39-48-Ptmg-codex_session_priming_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T15-39-48-019d4e6b-ec64-7e32-b2a6-39f0f4b21990.jsonl, updated_at=2026-04-02T14:10:48+00:00, thread_id=019d4e6b-ec64-7e32-b2a6-39f0f4b21990)
828:- rollout_summaries/2026-04-04T11-42-27-WVjh-codex_graph_readiness_verification.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T13-42-27-019d584d-3145-70e0-8b9b-13740fcf41cf.jsonl, updated_at=2026-04-04T11:45:20+00:00, thread_id=019d584d-3145-70e0-8b9b-13740fcf41cf)
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
842:- `primeSessionIfNeeded()` needs a session identifier; in Codex runtime the reliable fallback is `CODEX_THREAD_ID` when explicit `sessionId`/`session_id` are absent [Task 2]
845:- tests `session-enrichment` and `spec-affinity` require temp directories outside repo to avoid accidental git parent discovery [Task 1]
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
851:- symptom: `session_health` remains `not_primed`; cause: no session id reached `recordToolCall()` for Codex flows; fix: derive tracking id via `resolveSessionTrackingId` with `CODEX_THREAD_ID` fallback [Task 2]
852:- symptom: session-enrichment/spec-affinity false failures; cause: TMPDIR inside repository leaked git context into temp dirs; fix: rerun with `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp` [Task 1]
863:- rollout_summaries/2026-04-02T11-36-20-AJtm-convert_context_prime_to_toml.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T13-36-20-019d4dfa-e20e-70d1-b301-374d24a1d040.jsonl, updated_at=2026-04-02T11:39:38+00:00, thread_id=019d4dfa-e20e-70d1-b301-374d24a1d040)
873:- rollout_summaries/2026-04-04T14-34-19-2403-add_agent_descriptions.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T16-34-19-019d58ea-8c30-7bf2-9074-2b8983426353.jsonl, updated_at=2026-04-04T14:39:35+00:00, thread_id=019d58ea-8c30-7bf2-9074-2b8983426353)
883:- rollout_summaries/2026-04-08T06-48-52-EwmT-fix_agent_improver_description.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-48-52-019d6bd9-db76-7030-8fba-aef5e9172d4b.jsonl, updated_at=2026-04-08T06:51:38+00:00, thread_id=019d6bd9-db76-7030-8fba-aef5e9172d4b)
909:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development and /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.vscode; reuse_rule=reuse for local VS Code MCP sync work, but preserve wrapper shape exactly
915:- rollout_summaries/2026-04-02T11-42-04-t8Zx-update_vscode_mcp_config.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T13-42-04-019d4e00-205a-7ef1-a785-2c686da024df.jsonl, updated_at=2026-04-02T11:43:17+00:00, thread_id=019d4e00-205a-7ef1-a785-2c686da024df)
942:- rollout_summaries/2026-04-02T06-05-38-knzx-fix_spec_kit_prompts_symlink.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T08-05-38-019d4ccc-1e9c-7e23-b71a-a8a3f35f8e97.jsonl, updated_at=2026-04-02T06:15:27+00:00, thread_id=019d4ccc-1e9c-7e23-b71a-a8a3f35f8e97)
971:- rollout_summaries/2026-03-27T18-04-40-53Lh-memory_command_rename_and_spec_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-04-40-019d3078-3fa9-7371-baf5-21fe9bf66a67.jsonl, updated_at=2026-03-27T18:53:44+00:00, thread_id=019d3078-3fa9-7371-baf5-21fe9bf66a67)
977:## Task 2: Consolidate `/memory:continue` into `/spec_kit:resume` and sync Gemini wrappers
981:- rollout_summaries/2026-03-27T17-17-45-5IeP-smart_resume_consolidation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T18-17-45-019d304d-4d78-79c1-9197-fc752de12a5f.jsonl, updated_at=2026-03-27T17:42:15+00:00, thread_id=019d304d-4d78-79c1-9197-fc752de12a5f)
990:- when the user requested “PLEASE IMPLEMENT THIS PLAN: Remove `/memory:continue` and fold session recovery into `/spec_kit:resume`” -> keep `/spec_kit:resume` as the single recovery entry point [Task 2]
1012:- rollout_summaries/2026-03-27T18-28-19-O94p-warn_only_spec_doc_gates.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-28-19-019d308d-e699-7573-b5db-adc9a4879845.jsonl, updated_at=2026-03-27T18:57:56+00:00, thread_id=019d308d-e699-7573-b5db-adc9a4879845)
1022:- rollout_summaries/2026-03-27T18-09-43-X5xO-map_ground_truth_ids_implementation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-09-43-019d307c-e035-7a83-981b-92c79cbae57c.jsonl, updated_at=2026-03-27T18:27:05+00:00, thread_id=019d307c-e035-7a83-981b-92c79cbae57c)
1032:- rollout_summaries/2026-03-20T15-43-10-Fxg6-auto_repair_temp_root_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-10-019d0bea-319e-7432-8739-3b088f450742.jsonl, updated_at=2026-03-20T15:57:02+00:00, thread_id=019d0bea-319e-7432-8739-3b088f450742)
1033:- rollout_summaries/2026-03-20T15-42-58-lcys-fix_tier_override_and_spec_affinity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-42-58-019d0bea-0321-7352-8e66-c5d154da20e0.jsonl, updated_at=2026-03-20T16:00:39+00:00, thread_id=019d0bea-0321-7352-8e66-c5d154da20e0)
1043:- rollout_summaries/2026-03-12T13-18-14-Hnlx-spec_kit_memory_dimension_mismatch_codex_voyage_key.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T14-18-14-019ce232-9f8e-7d21-bc89-da101beb482b.jsonl, updated_at=2026-03-12T13:57:36+00:00, thread_id=019ce232-9f8e-7d21-bc89-da101beb482b)
1053:- rollout_summaries/2026-03-28T09-04-14-JFQ4-memory_mcp_connectivity_check.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-04-14-019d33af-d439-7ed2-a540-7723e929ea58.jsonl, updated_at=2026-03-28T09:05:05+00:00, thread_id=019d33af-d439-7ed2-a540-7723e929ea58)
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1059:## Task 6: Troubleshoot Desktop MCP surfacing with feature-gate and session-metadata checks
1063:- rollout_summaries/2026-03-28T08-07-16-1KIB-spec_kit_memory_mcp_troubleshoot.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-07-16-019d337b-ad27-7321-a2f9-0ad1f077698d.jsonl, updated_at=2026-03-28T08:52:27+00:00, thread_id=019d337b-ad27-7321-a2f9-0ad1f077698d)
1067:- codex features enable memories, codex features enable code_mode, ~/.codex/config.toml, session_meta.dynamic_tools, mcp_startup, handshake timeout
1073:- rollout_summaries/2026-03-28T09-47-16-BtZ6-ablation_benchmark_integrity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-47-16-019d33d7-38dc-7343-8b10-d28cc9573e58.jsonl, updated_at=2026-03-28T10:51:34+00:00, thread_id=019d33d7-38dc-7343-8b10-d28cc9573e58)
1074:- rollout_summaries/2026-03-28T08-25-17-MKwU-spec_kit_ablation_verif_docs_2026_03_28.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-25-17-019d338c-2aa0-7a83-b30f-2ddefd76e320.jsonl, updated_at=2026-03-28T09:44:06+00:00, thread_id=019d338c-2aa0-7a83-b30f-2ddefd76e320, partial outcome)
1086:- when user then said “just tried but no luck. investigate deeper,” continue beyond one fix attempt into session metadata/log evidence [Task 6]
1098:- Desktop `session_meta.dynamic_tools` plus absence of `mcp_startup` events is a stronger surfacing signal than standalone `node context-server.js` timeout probes [Task 6]
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1130:- rollout_summaries/2026-03-26T15-56-15-x1Km-rename_012_pre_release_remediation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/26/rollout-2026-03-26T16-56-15-019d2adc-5459-7ae3-8a42-6a827d88b516.jsonl, updated_at=2026-03-26T16:52:42+00:00, thread_id=019d2adc-5459-7ae3-8a42-6a827d88b516)
1140:- rollout_summaries/2026-03-26T14-27-03-elzQ-014_v8_p1_p2_remediation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/26/rollout-2026-03-26T15-27-03-019d2a8a-a91f-7891-b893-9466ce4bec32.jsonl, updated_at=2026-03-26T15:46:04+00:00, thread_id=019d2a8a-a91f-7891-b893-9466ce4bec32)
1150:- rollout_summaries/2026-03-28T09-46-45-wNy2-codex_memory_mcp_fix_closure.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-46-45-019d33d6-c35d-79e1-b110-527630e81272.jsonl, updated_at=2026-03-28T09:47:10+00:00, thread_id=019d33d6-c35d-79e1-b110-527630e81272)
1160:- rollout_summaries/2026-03-28T08-23-42-BSOO-om_2026_03_28_023_esm_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-23-42-019d338a-b98a-7992-bc8b-4f62cbfd1b6e.jsonl, updated_at=2026-03-28T10:57:23+00:00, thread_id=019d338a-b98a-7992-bc8b-4f62cbfd1b6e)
1171:- when syncing packet 023, user insisted docs must mirror completed research while “keep runtime migration pending” -> do truth-sync in packet docs without claiming implementation completion [Task 5]
1181:- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
1189:- symptom: packet docs drift from deep-research conclusions; cause: spec/plan/tasks/checklist/summary edited piecemeal; fix: run a single truth-sync pass across all packet docs with explicit references to `research/research.md` [Task 5]
1199:- rollout_summaries/2026-03-27T13-58-07-KxRC-hybrid_rag_fusion_deep_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T14-58-07-019d2f96-895d-7600-a315-cf9e5ee673c0.jsonl, updated_at=2026-03-27T17:15:58+00:00, thread_id=019d2f96-895d-7600-a315-cf9e5ee673c0)
1209:- rollout_summaries/2026-03-27T09-32-07-47h5-review_folder_remediation_and_changelog.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T10-32-07-019d2ea2-fe90-7173-8be7-f902f405e26f.jsonl, updated_at=2026-03-27T11:25:06+00:00, thread_id=019d2ea2-fe90-7173-8be7-f902f405e26f)
1219:- rollout_summaries/2026-03-25T08-49-42-gmab-release_readiness_007_review_shared_memory_checkpoint.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/25/rollout-2026-03-25T09-49-42-019d242f-72c3-7431-8662-efd7dc6abbef.jsonl, updated_at=2026-03-25T11:04:58+00:00, thread_id=019d242f-72c3-7431-8662-efd7dc6abbef)
1250:- rollout_summaries/2026-03-27T12-56-48-Q3YU-advisor_routing_docs_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T13-56-48-019d2f5e-65c4-7782-a36a-9db97f90df2c.jsonl, updated_at=2026-03-27T13:59:07+00:00, thread_id=019d2f5e-65c4-7782-a36a-9db97f90df2c)
1254:- skill_advisor.py, rsync -ainc, diff -qr, SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC, --dataset, .agents/workflows symlink
1260:- rollout_summaries/2026-03-27T12-56-48-Q3YU-advisor_routing_docs_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T13-56-48-019d2f5e-65c4-7782-a36a-9db97f90df2c.jsonl, updated_at=2026-03-27T13:59:07+00:00, thread_id=019d2f5e-65c4-7782-a36a-9db97f90df2c)
1273:- Parity audit pattern: run advisor analyzer first, then `rsync -ainc`/`diff -qr` with excludes [Task 1]
1288:- rollout_summaries/2026-03-27T11-00-57-QLkr-bulk_changelog_audit_and_readme_conversion.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T12-00-57-019d2ef4-534f-73e3-9e98-1f44500416af.jsonl, updated_at=2026-03-27T12:51:07+00:00, thread_id=019d2ef4-534f-73e3-9e98-1f44500416af)
1298:- rollout_summaries/2026-03-27T09-32-07-47h5-review_folder_remediation_and_changelog.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T10-32-07-019d2ea2-fe90-7173-8be7-f902f405e26f.jsonl, updated_at=2026-03-27T11:25:06+00:00, thread_id=019d2ea2-fe90-7173-8be7-f902f405e26f)
1327:- rollout_summaries/2026-03-27T18-08-19-6yjh-label_and_ds_variable_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-08-19-019d307b-9897-7dc0-83d9-615416fe06a3.jsonl, updated_at=2026-03-30T10:49:19+00:00, thread_id=019d307b-9897-7dc0-83d9-615416fe06a3)
1337:- rollout_summaries/2026-03-27T18-08-19-6yjh-label_and_ds_variable_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-08-19-019d307b-9897-7dc0-83d9-615416fe06a3.jsonl, updated_at=2026-03-30T10:49:19+00:00, thread_id=019d307b-9897-7dc0-83d9-615416fe06a3)
1353:- keep legacy CSS and TS exports synchronized in token names/order/structure; verify with `rg` across both artifacts and the flat token map before ticket updates [Task 2]
1368:- rollout_summaries/2026-03-23T14-21-16-rdRR-rewrite_cg_p2_task_pack.md (cwd=/Users/michelkerkmeester/MEGA/Development/AI Systems/Barter/2. Product Owner, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/23/rollout-2026-03-23T15-21-16-019d1b12-4784-7260-8699-fd7c3a83f487.jsonl, updated_at=2026-03-23T17:42:11+00:00, thread_id=019d1b12-4784-7260-8699-fd7c3a83f487)
1378:- rollout_summaries/2026-03-24T11-53-33-WIVq-barter_export_variables_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/24/rollout-2026-03-24T12-53-33-019d1fb1-687d-7d22-8ad0-9b050c48a798.jsonl, updated_at=2026-03-24T12:52:30+00:00, thread_id=019d1fb1-687d-7d22-8ad0-9b050c48a798)
1379:- rollout_summaries/2026-03-24T11-08-34-mbqq-variables_cg_p2_canonical_diff.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/24/rollout-2026-03-24T12-08-34-019d1f88-380b-7d21-8dc7-8869a09c0842.jsonl, updated_at=2026-03-24T11:50:39+00:00, thread_id=019d1f88-380b-7d21-8dc7-8869a09c0842)
1389:- rollout_summaries/2026-03-24T12-52-56-guOQ-update_variable_task_doc.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/24/rollout-2026-03-24T13-52-56-019d1fe7-c58b-7e52-860d-344a70168e38.jsonl, updated_at=2026-03-24T15:15:04+00:00, thread_id=019d1fe7-c58b-7e52-860d-344a70168e38)
1419:- rollout_summaries/2026-02-28T12-17-27-FIGI-attributes_utilities_update.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/02/28/rollout-2026-02-28T13-17-27-019ca42e-aba5-7183-a901-f11da62be480.jsonl, updated_at=2026-02-28T16:34:25+00:00, thread_id=019ca42e-aba5-7183-a901-f11da62be480)
1444:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for session-capture/json-mode remediations in this repo, but verify current phase numbering and default flag states before doc updates
1450:- rollout_summaries/2026-03-20T13-01-45-2Cl7-json_primary_session_capture_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T14-01-45-019d0b56-6868-7231-abf1-e6bc7369f5d5.jsonl, updated_at=2026-03-20T13:22:25+00:00, thread_id=019d0b56-6868-7231-abf1-e6bc7369f5d5)
1451:- rollout_summaries/2026-03-20T13-25-39-plA6-json_mode_hybrid_enrichment_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T14-25-39-019d0b6c-4b37-7893-95f2-4903cf5564fa.jsonl, updated_at=2026-03-20T14:12:18+00:00, thread_id=019d0b6c-4b37-7893-95f2-4903cf5564fa)
1455:- --recovery, RECOVERY_MODE_REQUIRED, allowRecovery, generate-context.ts, loadCollectedData, workflow.ts
1461:- rollout_summaries/2026-03-22T10-20-47-OmwP-phase_016_json_mode_contexttype_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T11-20-47-019d150f-c1c3-77a1-99d7-4085806c27cb.jsonl, updated_at=2026-03-22T12:13:09+00:00, thread_id=019d150f-c1c3-77a1-99d7-4085806c27cb)
1462:- rollout_summaries/2026-03-22T08-46-53-EZCT-phase_016_json_mode_review_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T09-46-53-019d14b9-caed-7de1-9985-8e18185cbdcf.jsonl, updated_at=2026-03-22T09:41:54+00:00, thread_id=019d14b9-caed-7de1-9985-8e18185cbdcf)
1463:- rollout_summaries/2026-03-22T07-51-55-kUit-phase_016_review_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T08-51-55-019d1487-7640-7f72-bafb-21d06f452099.jsonl, updated_at=2026-03-22T09:41:18+00:00, thread_id=019d1487-7640-7f72-bafb-21d06f452099)
1473:- rollout_summaries/2026-03-22T10-21-03-Dc6v-review_spec_011_hybrid_rag_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T11-21-03-019d150f-ff8f-7340-8845-e3d582e7f2cb.jsonl, updated_at=2026-03-22T12:12:08+00:00, thread_id=019d150f-ff8f-7340-8845-e3d582e7f2cb)
1474:- rollout_summaries/2026-03-22T07-03-12-KyXI-research_based_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T08-03-12-019d145a-de98-7470-8c51-669cd6ae4cbe.jsonl, updated_at=2026-03-22T09:44:58+00:00, thread_id=019d145a-de98-7470-8c51-669cd6ae4cbe)
1480:## Task 4: Cleanup stateless terminology to captured-session and align handler dedup tests
1484:- rollout_summaries/2026-03-21T16-05-01-Nzfa-captured_session_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T17-05-01-019d1124-8bd1-7430-9cd9-db1a32e7fe40.jsonl, updated_at=2026-03-21T16:34:05+00:00, thread_id=019d1124-8bd1-7430-9cd9-db1a32e7fe40)
1485:- rollout_summaries/2026-03-21T11-13-10-e1Oa-perfect_session_capturing_review_2026_03.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T12-13-10-019d1019-5c69-7c91-9faa-f9619a5417aa.jsonl, updated_at=2026-03-21T11:52:08+00:00, thread_id=019d1019-5c69-7c91-9faa-f9619a5417aa)
1486:- rollout_summaries/2026-03-20T11-41-58-2chj-perfect_session_capturing_spec_realignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T12-41-58-019d0b0d-5dbd-7583-bb7f-002f4a036391.jsonl, updated_at=2026-03-20T13:14:22+00:00, thread_id=019d0b0d-5dbd-7583-bb7f-002f4a036391)
1490:- captured-session, stateless-enrichment.vitest.ts, session-enrichment.vitest.ts, 1024-d embeddings
1513:scope: large-scale renumbering/sweep operations plus root packet normalization and command/agent/spec truth-sync
1520:- rollout_summaries/2026-03-21T06-57-15-o1j0-rename_skill_alignment_010.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T07-57-15-019d0f2f-0d9f-7201-8ea1-7e22b240177e.jsonl, updated_at=2026-03-21T07:00:39+00:00, thread_id=019d0f2f-0d9f-7201-8ea1-7e22b240177e)
1526:## Task 2: Rename/sweep parent packet to `009-perfect-session-capturing`
1530:- rollout_summaries/2026-03-21T06-57-32-a7He-rename_009_perfect_session_capturing.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T07-57-32-019d0f2f-5163-7fc3-9147-4255b20d8de4.jsonl, updated_at=2026-03-21T07:59:48+00:00, thread_id=019d0f2f-5163-7fc3-9147-4255b20d8de4)
1534:- 010-perfect-session-capturing, 009-perfect-session-capturing, recursive strict validation, memoryNameHistory
1540:- rollout_summaries/2026-03-21T13-00-24-DDYC-022_hybrid_rag_fusion_root_normalization.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T14-00-24-019d107b-868a-7b62-8c96-076460904ae2.jsonl, updated_at=2026-03-21T14:12:37+00:00, thread_id=019d107b-868a-7b62-8c96-076460904ae2)
1541:- rollout_summaries/2026-03-21T12-13-54-sLJV-022_spec_command_agent_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T13-13-54-019d1050-f5d4-7853-95d5-c1aba358638b.jsonl, updated_at=2026-03-21T13:00:01+00:00, thread_id=019d1050-f5d4-7853-95d5-c1aba358638b)
1551:- rollout_summaries/2026-03-21T11-13-41-ktLk-hybrid_rag_fusion_alignment_audit_2026_03_21.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T12-13-41-019d1019-d5aa-7be2-860a-ed8eaa45fe5a.jsonl, updated_at=2026-03-21T12:13:04+00:00, thread_id=019d1019-d5aa-7be2-860a-ed8eaa45fe5a)
1584:- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)
1594:- rollout_summaries/2026-03-20T15-43-10-Fxg6-auto_repair_temp_root_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-10-019d0bea-319e-7432-8739-3b088f450742.jsonl, updated_at=2026-03-20T17:13:04+00:00, thread_id=019d0bea-319e-7432-8739-3b088f450742)
1604:- rollout_summaries/2026-03-20T15-42-58-lcys-fix_tier_override_and_spec_affinity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-42-58-019d0bea-0321-7352-8e66-c5d154da20e0.jsonl, updated_at=2026-03-20T17:13:02+00:00, thread_id=019d0bea-0321-7352-8e66-c5d154da20e0)
1614:- rollout_summaries/2026-03-21T12-12-58-Tp5J-hybrid_rag_fusion_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T13-12-58-019d1050-19ec-7bd2-b5bd-7078f5a1dd6f.jsonl, updated_at=2026-03-21T12:59:53+00:00, thread_id=019d1050-19ec-7bd2-b5bd-7078f5a1dd6f)
1624:- rollout_summaries/2026-03-12T16-00-31-5hX0-discovery_prequery_e021_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-00-31-019ce2c7-3124-79e0-bf43-8908f4eb9dc6.jsonl, updated_at=2026-03-12T16:48:04+00:00, thread_id=019ce2c7-3124-79e0-bf43-8908f4eb9dc6)
1634:- rollout_summaries/2026-03-12T12-03-38-frta-graph_signal_activation_complete_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T13-03-38-019ce1ee-5339-7543-9230-14c6fb3ad2d4.jsonl, updated_at=2026-03-12T12:58:41+00:00, thread_id=019ce1ee-5339-7543-9230-14c6fb3ad2d4)
1643:- when user asked to “check all associated code and make sure everything works,” include runtime + doc truth-sync tests [Task 4]
1662:scope: architecture/check-pipeline doc truth-sync, sk-doc TOC/anchor compliance, and feature-catalog-style manual testing playbook packaging
1669:- rollout_summaries/2026-03-19T17-44-48-IZ58-architecture_doc_alignment_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/19/rollout-2026-03-19T18-44-48-019d0733-2f41-7283-934a-085ffe4aa9d2.jsonl, updated_at=2026-03-19T18:27:07+00:00, thread_id=019d0733-2f41-7283-934a-085ffe4aa9d2)
1679:- rollout_summaries/2026-03-18T18-37-31-sJBC-sk_deep_research_manual_playbook.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/18/rollout-2026-03-18T19-37-31-019d023d-18e1-7fd3-ad66-7947d2061ed0.jsonl, updated_at=2026-03-19T13:01:05+00:00, thread_id=019d023d-18e1-7fd3-ad66-7947d2061ed0)
1685:## Task 3: Sync session-capturing docs to renumbered phases and shipped safeguards
1689:- rollout_summaries/2026-03-20T17-39-18-fqar-doc_sync_session_capturing.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T18-39-18-019d0c54-839e-74c0-b7f5-df7696d34827.jsonl, updated_at=2026-03-20T18:02:45+00:00, thread_id=019d0c54-839e-74c0-b7f5-df7696d34827)
1719:- rollout_summaries/2026-03-25T06-45-32-Trfu-codex_agent_name_fields.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/25/rollout-2026-03-25T07-45-32-019d23bd-c679-7e60-a7db-044cfe70ae74.jsonl, updated_at=2026-03-25T06:52:18+00:00, thread_id=019d23bd-c679-7e60-a7db-044cfe70ae74)
1729:- rollout_summaries/2026-03-25T06-53-04-m1qs-deep_review_description_toml.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/25/rollout-2026-03-25T07-53-04-019d23c4-a9a0-71c3-a6d8-f9dc72cf0edc.jsonl, updated_at=2026-03-25T06:55:59+00:00, thread_id=019d23c4-a9a0-71c3-a6d8-f9dc72cf0edc)
1739:- rollout_summaries/2026-03-18T17-48-32-V1UN-fix_deep_research_toml.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/18/rollout-2026-03-18T18-48-32-019d0210-3ec6-7a41-9043-8ae0da5a3d6d.jsonl, updated_at=2026-03-18T17:52:31+00:00, thread_id=019d0210-3ec6-7a41-9043-8ae0da5a3d6d)
1768:- rollout_summaries/2026-03-13T12-28-39-Zo58-hydra_spec_plan.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T13-28-39-019ce72b-9628-7ec0-bcbc-33024754c3b6.jsonl, updated_at=2026-03-13T14:58:03+00:00, thread_id=019ce72b-9628-7ec0-bcbc-33024754c3b6)
1778:- rollout_summaries/2026-03-13T15-58-43-jdBc-hydra_db_baseline_phase1.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T16-58-43-019ce7eb-e782-71f3-96e4-b91399857f7e.jsonl, updated_at=2026-03-13T17:01:31+00:00, thread_id=019ce7eb-e782-71f3-96e4-b91399857f7e)
1782:- phase-1 baseline, deferred Phase 2-6 follow-up, check-completion.sh, generate-context.js, /tmp/save-context-data.json, telemetry README schema alignment
1788:- rollout_summaries/2026-03-13T18-02-17-1YXi-phase_015_governance_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T19-02-17-019ce85d-08e7-7411-b011-0414fe8fc054.jsonl, updated_at=2026-03-13T20:06:20+00:00, thread_id=019ce85d-08e7-7411-b011-0414fe8fc054)
1792:- filterRowsByScope, sessionId filtering, getAllowedSharedSpaceIds, assertSharedSpaceAccess, runRetentionSweep, tenant filtering
1798:- rollout_summaries/2026-03-13T19-22-18-0v7J-spec_kit_hydra_db_comment_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T20-22-18-019ce8a6-4c0d-7882-8bbd-ec7a9be5d66b.jsonl, updated_at=2026-03-13T20:27:00+00:00, thread_id=019ce8a6-4c0d-7882-8bbd-ec7a9be5d66b)
1808:- rollout_summaries/2026-03-13T17-01-18-nBzp-hydra_phase1_docs_review_and_commit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T18-01-18-019ce825-33d1-7383-a15e-bfb227167b2f.jsonl, updated_at=2026-03-13T18:11:29+00:00, thread_id=019ce825-33d1-7383-a15e-bfb227167b2f)
1825:- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
1832:- symptom: memory save / context generation aborts in manual runs; cause: missing JSON input and telemetry doc/schema mismatch; fix: provide `/tmp/save-context-data.json` and sync telemetry README to code fields first [Task 2]
1843:- rollout_summaries/2026-03-12T17-36-19-HiDG-lifecycle_code_audit_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T18-36-19-019ce31e-e7c6-70b0-b92d-b7d6b60c146c.jsonl, updated_at=2026-03-12T18:16:59+00:00, thread_id=019ce31e-e7c6-70b0-b92d-b7d6b60c146c)
1844:- rollout_summaries/2026-03-12T16-55-01-d1h1-governance_audit_remediation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-55-01-019ce2f9-1911-7543-b2cc-c948b8425ecb.jsonl, updated_at=2026-03-12T18:03:38+00:00, thread_id=019ce2f9-1911-7543-b2cc-c948b8425ecb)
1854:- rollout_summaries/2026-03-12T17-35-49-BqFE-spec_006_analysis_audit_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T18-35-49-019ce31e-7238-7b01-be4d-b04b4d27ebc6.jsonl, updated_at=2026-03-12T18:16:28+00:00, thread_id=019ce31e-7238-7b01-be4d-b04b4d27ebc6)
1855:- rollout_summaries/2026-03-13T11-17-06-8uZ8-orphan_remediation_hybrid_rag.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-17-06-019ce6ea-1692-7a91-913f-e70a7ef27206.jsonl, updated_at=2026-03-13T12:19:33+00:00, thread_id=019ce6ea-1692-7a91-913f-e70a7ef27206)
1865:- rollout_summaries/2026-03-13T11-17-08-0feG-ux_hooks_auto_review_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-17-08-019ce6ea-1d8c-74d2-8e3c-3aa526c1878a.jsonl, updated_at=2026-03-13T11:40:34+00:00, thread_id=019ce6ea-1d8c-74d2-8e3c-3aa526c1878a)
1866:- rollout_summaries/2026-03-13T11-16-35-Aczb-architecture_audit_009_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-16-35-019ce6e9-9b9f-7313-b4d8-9655dcb2e735.jsonl, updated_at=2026-03-13T11:39:58+00:00, thread_id=019ce6e9-9b9f-7313-b4d8-9655dcb2e735)
1867:- rollout_summaries/2026-03-13T11-02-43-qajT-010_spec_descriptions_review_and_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-02-43-019ce6dc-eb53-76e0-9af1-c470f4561179.jsonl, updated_at=2026-03-13T12:04:02+00:00, thread_id=019ce6dc-eb53-76e0-9af1-c470f4561179)
1868:- rollout_summaries/2026-03-13T11-01-44-AjOd-perfect_session_capturing_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0242-7571-b6af-d67f7a0eccf5.jsonl, updated_at=2026-03-13T11:56:00+00:00, thread_id=019ce6dc-0242-7571-b6af-d67f7a0eccf5)
1869:- rollout_summaries/2026-03-13T11-01-44-IBXE-outsourced_agent_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-01-44-019ce6dc-0509-7630-9874-db11f57a9e06.jsonl, updated_at=2026-03-13T11:21:38+00:00, thread_id=019ce6dc-0509-7630-9874-db11f57a9e06)
1879:- rollout_summaries/2026-03-13T11-17-10-UX2w-opencode_008_combined_bug_fixes_source_016_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-17-10-019ce6ea-23f4-7260-844a-d11862922bb8.jsonl, updated_at=2026-03-13T13:11:26+00:00, thread_id=019ce6ea-23f4-7260-844a-d11862922bb8)
1889:- rollout_summaries/2026-03-13T11-00-06-xhjk-opencode_feature_catalog_recount.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-00-06-019ce6da-8386-7483-ac03-524da1a5d95a.jsonl, updated_at=2026-03-13T12:07:22+00:00, thread_id=019ce6da-8386-7483-ac03-524da1a5d95a)
1890:- rollout_summaries/2026-03-13T11-00-52-SNjO-fix_f03_audit_closure.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T12-00-52-019ce6db-39cf-7060-9f29-b097b71759d0.jsonl, updated_at=2026-03-13T12:26:30+00:00, thread_id=019ce6db-39cf-7060-9f29-b097b71759d0)
1896:## Task 6: Re-run phase-wide 001-018 audit and sync shared docs/playbooks
1900:- rollout_summaries/2026-03-13T14-00-56-wEII-audit_hybrid_rag_fusion_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T15-00-56-019ce780-1534-78c0-aa0e-53e96b088204.jsonl, updated_at=2026-03-13T14:52:39+00:00, thread_id=019ce780-1534-78c0-aa0e-53e96b088204)
1920:- Session-capture behavior from 011 review: preserve live observations over `_synthetic` ones; direct CLI runs without JSON/OpenCode session can return `NO_DATA_AVAILABLE` and should be documented as pending-runtime evidence [Task 3]
1928:- symptom: context generation fails with `Spec folder not found` or `NO_DATA_AVAILABLE`; cause: passing long path/no JSON session context; fix: pass short slug (for example `017-governance`) and provide JSON-mode context when local sessions are absent [Task 1][Task 3]
1938:- rollout_summaries/2026-03-06T07-38-29-Raej-phase7_ci_boundary_doc_linkage.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/06/rollout-2026-03-06T08-38-29-019cc215-69a3-7cf0-9293-34c63e682b57.jsonl, updated_at=2026-03-06T11:32:31+00:00, thread_id=019cc215-69a3-7cf0-9293-34c63e682b57)
1948:- rollout_summaries/2026-03-12T16-38-55-KNKz-006_analysis_code_doc_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-38-55-019ce2ea-5a1e-72c2-80fe-86da284c4e6b.jsonl, updated_at=2026-03-12T17:02:32+00:00, thread_id=019ce2ea-5a1e-72c2-80fe-86da284c4e6b)
1949:- rollout_summaries/2026-03-12T17-35-18-3ZLY-hybrid_rag_spec_folder_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T18-35-18-019ce31d-f9c0-74d1-9f39-6de8573ff6aa.jsonl, updated_at=2026-03-12T18:01:53+00:00, thread_id=019ce31d-f9c0-74d1-9f39-6de8573ff6aa)
1950:- rollout_summaries/2026-03-12T16-55-38-kKxD-spec_016_tooling_and_scripts_code_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-55-38-019ce2f9-a752-7fd2-8f01-e3c838a97a3d.jsonl, updated_at=2026-03-12T17:02:46+00:00, thread_id=019ce2f9-a752-7fd2-8f01-e3c838a97a3d)
1960:- rollout_summaries/2026-03-12T16-54-20-kwyP-hybrid_rag_lifecycle_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-54-20-019ce2f8-78de-7020-b460-a2ad3d10009f.jsonl, updated_at=2026-03-12T18:05:20+00:00, thread_id=019ce2f8-78de-7020-b460-a2ad3d10009f)
1961:- rollout_summaries/2026-03-12T16-58-17-S6j2-ux_hooks_comprehensive_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T17-58-17-019ce2fc-1651-7ef3-bf8a-225e52ad5cd4.jsonl, updated_at=2026-03-12T18:24:29+00:00, thread_id=019ce2fc-1651-7ef3-bf8a-225e52ad5cd4)
1971:- rollout_summaries/2026-03-12T15-59-23-mxos-bug_fixes_data_integrity_doc_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T16-59-23-019ce2c6-2987-7a10-91fa-69237e4407b0.jsonl, updated_at=2026-03-12T16:32:33+00:00, thread_id=019ce2c6-2987-7a10-91fa-69237e4407b0)
1972:- rollout_summaries/2026-03-12T14-53-20-cJKI-maintenance_spec_code_doc_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T15-53-20-019ce289-b02a-7ef0-a6c0-242d3424fe54.jsonl, updated_at=2026-03-12T16:07:24+00:00, thread_id=019ce289-b02a-7ef0-a6c0-242d3424fe54)
1973:- rollout_summaries/2026-03-12T14-52-44-c5ai-pipeline_architecture_audit_summary.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T15-52-44-019ce289-2379-7a00-b600-cd18950433c2.jsonl, updated_at=2026-03-12T15:40:00+00:00, thread_id=019ce289-2379-7a00-b600-cd18950433c2)
1974:- rollout_summaries/2026-03-13T07-33-32-K7Wy-audit_phases_001_018.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T08-33-32-019ce61d-678e-7100-96c7-a2aa2f559b2a.jsonl, updated_at=2026-03-13T08:08:22+00:00, thread_id=019ce61d-678e-7100-96c7-a2aa2f559b2a)
1975:- rollout_summaries/2026-03-13T07-35-56-VaWc-hybrid_rag_retrieval_015_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T08-35-56-019ce61f-9983-79b0-92d9-268ec7dbeb98.jsonl, updated_at=2026-03-13T08:10:57+00:00, thread_id=019ce61f-9983-79b0-92d9-268ec7dbeb98)
1976:- rollout_summaries/2026-03-13T08-17-30-kIui-audit_followups_2026_03_13.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T09-17-30-019ce645-a91b-76e2-a6a3-9410ab285386.jsonl, updated_at=2026-03-13T10:05:27+00:00, thread_id=019ce645-a91b-76e2-a6a3-9410ab285386)
1977:- rollout_summaries/2026-03-13T10-13-38-N3Jj-audit_008_bug_fixes_and_data_integrity.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T11-13-38-019ce6af-f8b5-7540-ab2e-7f62beefb6fd.jsonl, updated_at=2026-03-13T11:01:38+00:00, thread_id=019ce6af-f8b5-7540-ab2e-7f62beefb6fd)
2015:- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)
2041:- rollout_summaries/2026-03-12T18-04-29-F5hI-codex_default_5_3_xhigh.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/12/rollout-2026-03-12T19-04-29-019ce338-b0e2-7453-8c10-151a82eed256.jsonl, updated_at=2026-03-12T18:07:04+00:00, thread_id=019ce338-b0e2-7453-8c10-151a82eed256)
2051:- rollout_summaries/2026-03-06T10-02-41-jRIT-codex_config_autocompact_profiles.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/06/rollout-2026-03-06T11-02-41-019cc299-7122-73a3-8a65-fd71a79f5afb.jsonl, updated_at=2026-03-06T10:11:16+00:00, thread_id=019cc299-7122-73a3-8a65-fd71a79f5afb)
2061:- rollout_summaries/2026-03-28T11-32-39-eeDS-install_latest_codex.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T12-32-39-019d3437-b5aa-7af2-add2-9d46049b1dc0.jsonl, updated_at=2026-03-28T11:34:10+00:00, thread_id=019d3437-b5aa-7af2-add2-9d46049b1dc0)
2092:- rollout_summaries/2026-03-13T08-58-37-KK2Y-opencode_section_chat_screen.md (cwd=/Users/michelkerkmeester/MEGA/Development/Apps/fe-creators-mobile, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T09-58-37-019ce66b-4e07-7da3-9860-78d7b292b8a0.jsonl, updated_at=2026-03-13T09:04:00+00:00, thread_id=019ce66b-4e07-7da3-9860-78d7b292b8a0)
2102:- rollout_summaries/2026-03-04T11-21-05-gBzD-barter_ios_chat_query_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Apps/fe-creators-mobile, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T12-21-05-019cb894-804b-7ed1-97d9-a72c30ad2f25.jsonl, updated_at=2026-03-04T12:56:54+00:00, thread_id=019cb894-804b-7ed1-97d9-a72c30ad2f25)

codex
I’ve confirmed the deep-research workflow guidance and I’m now tracing the external code around `init`, `watch`, `sync`, scanner brief generation, and scaffold files to see whether Mex actually has a session model or mainly simulates continuity through files. After that I’ll map the differences against our explicit session APIs and saved-memory flow.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '156,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && pwd && rg --files | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
CHANGELOG.md
CLAUDE.md
CODE_OF_CONDUCT.md
CONTRIBUTING.md
LICENSE
README.md
ROUTER.md
SECURITY.md
SETUP.md
SYNC.md
context/architecture.md
context/conventions.md
context/decisions.md
context/setup.md
context/stack.md
mascot/mex-mascot.svg
package-lock.json
patterns/INDEX.md
patterns/README.md
screenshots/mex-check.jpg
screenshots/mex-check1.jpg
screenshots/mex-sync.jpg
setup.sh
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
sync.sh
templates/AGENTS.md
templates/ROUTER.md
templates/SETUP.md
templates/SYNC.md
templates/context/architecture.md
templates/context/conventions.md
templates/context/decisions.md
templates/context/setup.md
templates/context/stack.md
templates/patterns/INDEX.md
templates/patterns/README.md
test/checkers.test.ts
test/claims.test.ts
test/config.test.ts
test/markdown.test.ts
test/pattern.test.ts
test/scanner.test.ts
test/scoring.test.ts
tsconfig.json
tsup.config.ts
update.sh
visualize.sh

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && rg -n "session|summary|summar|sync|watch|GROW|context|pattern add|brief|resume|continue|history|git log|appendFile|writeFile|AGENTS|ROUTER|SETUP|SYNC" src README.md AGENTS.md ROUTER.md SETUP.md SYNC.md .tool-configs -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
SYNC.md:3:## Recommended: Use sync.sh
SYNC.md:6:.mex/sync.sh
SYNC.md:10:1. **Targeted sync** — AI fixes only the flagged files (fastest, cheapest)
SYNC.md:11:2. **Full resync** — AI re-reads everything and updates all scaffold files
SYNC.md:20:mex sync --dry-run     # preview targeted fix prompts
SYNC.md:23:## Manual Resync
SYNC.md:29:**SYNC PROMPT — copy everything between the lines:**
SYNC.md:32:You are going to resync the AI context scaffold for this project.
SYNC.md:35:First, read all files in context/ to understand the current scaffold state.
SYNC.md:39:For each context/ file:
SYNC.md:49:  survive every sync. If you need to update edges, add or remove individual entries —
SYNC.md:51:- In context/decisions.md: NEVER delete existing decisions.
SYNC.md:56:- After updating each file, update ROUTER.md Current Project State
SETUP.md:3:This file contains the prompts to populate the scaffold. It is NOT the dev environment setup — for that, see `context/setup.md` after population.
SETUP.md:16:3. Pre-scans your codebase with `mex init` to build a structured brief (~5-8k tokens vs ~50k from AI exploration)
SETUP.md:35:**SETUP PROMPT — copy everything between the lines:**
SETUP.md:38:You are going to populate an AI context scaffold for this project.
SETUP.md:42:1. ROUTER.md — understand the scaffold structure
SETUP.md:43:2. context/architecture.md — read the annotation comments to understand what belongs there
SETUP.md:44:3. context/stack.md — same
SETUP.md:45:4. context/conventions.md — same
SETUP.md:46:5. context/decisions.md — same
SETUP.md:47:6. context/setup.md — same
SETUP.md:57:Populate each context/ file by replacing the annotation comments
SETUP.md:68:If yes, create additional domain-specific context files in context/.
SETUP.md:69:Examples: a project with a complex auth system gets context/auth.md.
SETUP.md:70:A data pipeline gets context/ingestion.md. A project with Stripe gets
SETUP.md:71:context/payments.md. Use the same YAML frontmatter format (name,
SETUP.md:76:After populating context/ files, update ROUTER.md:
SETUP.md:78:- Add rows to the routing table for any domain-specific context files you created
SETUP.md:80:Update AGENTS.md:
SETUP.md:98:grows incrementally — the behavioural contract (step 5: GROW) will create
SETUP.md:108:Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
SETUP.md:114:- Every context/ file should have at least 2 edges
SETUP.md:115:- Every pattern file should have at least 1 edge (usually to the relevant context file)
SETUP.md:117:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
SETUP.md:136:**SETUP PROMPT — copy everything between the lines:**
SETUP.md:139:You are going to populate an AI context scaffold for a project that
SETUP.md:143:1. ROUTER.md — understand the scaffold structure
SETUP.md:144:2. All files in context/ — read the annotation comments in each
SETUP.md:157:After I answer, populate the context/ files based on my answers.
SETUP.md:163:or too shallow? If yes, create additional domain-specific context files
SETUP.md:164:in context/. Examples: a project with a complex auth system gets
SETUP.md:165:context/auth.md. A data pipeline gets context/ingestion.md. A project
SETUP.md:166:with Stripe gets context/payments.md. Use the same YAML frontmatter
SETUP.md:173:Update ROUTER.md current state to reflect that this is a new project.
SETUP.md:174:Add rows to the routing table for any domain-specific context files you created.
SETUP.md:175:Update AGENTS.md with the project name, description, non-negotiables, and commands.
SETUP.md:184:incrementally — the behavioural contract (step 5: GROW) will create
SETUP.md:193:Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
SETUP.md:199:- Every context/ file should have at least 2 edges
SETUP.md:202:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
SETUP.md:213:**Verify** by starting a fresh session and asking your agent:
SETUP.md:214:"Read `.mex/ROUTER.md` and tell me what you now know about this project."
SETUP.md:227:- **`.mex/sync.sh`** — interactive drift check + targeted or full resync
SETUP.md:228:- **`mex watch`** — auto drift score after every commit
AGENTS.md:3:description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
AGENTS.md:38:After every task: if no pattern exists for the task type you just completed, create one. If a pattern or context file is now out of date, update it. The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.
AGENTS.md:41:At the start of every session, read `ROUTER.md` before doing anything else.
AGENTS.md:42:For full project context, patterns, and task guidance — everything is there.
ROUTER.md:3:description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
ROUTER.md:5:  - target: context/architecture.md
ROUTER.md:7:  - target: context/stack.md
ROUTER.md:9:  - target: context/conventions.md
ROUTER.md:11:  - target: context/decisions.md
ROUTER.md:13:  - target: context/setup.md
ROUTER.md:22:If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.
ROUTER.md:24:Then read this file fully before doing anything else in this session.
ROUTER.md:29:     This is the primary drift prevention mechanism — it re-grounds the agent every session.
ROUTER.md:33:     - User authentication and session management
ROUTER.md:45:Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.
ROUTER.md:49:| Understanding how the system works | `context/architecture.md` |
ROUTER.md:50:| Working with a specific technology | `context/stack.md` |
ROUTER.md:51:| Writing or reviewing code | `context/conventions.md` |
ROUTER.md:52:| Making a design decision | `context/decisions.md` |
ROUTER.md:53:| Setting up or running the project | `context/setup.md` |
ROUTER.md:60:1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it. Narrate what you load: "Loading architecture context..."
ROUTER.md:62:3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
ROUTER.md:64:5. **GROW** — After completing the task:
ROUTER.md:65:   - If no pattern exists for this task type, create one in `patterns/` using the format in `patterns/README.md`. Add it to `patterns/INDEX.md`. Flag it: "Created `patterns/<name>.md` from this session."
ROUTER.md:67:   - If any `context/` file is now out of date because of this work, update it surgically — do not rewrite entire files.
README.md:24:AI agents forget everything between sessions. mex gives them permanent, navigable project memory.
README.md:26:Every session starts cold:
README.md:32:Developers compensate by stuffing everything into CLAUDE.md — but that floods the context window, burns tokens, and degrades attention. Meanwhile, the project changes and nobody updates the docs. The agent's understanding drifts from reality.
README.md:40:[![Star History Chart](https://api.star-history.com/svg?repos=theDakshJaitly/mex&type=Timeline)](https://star-history.com/#theDakshJaitly/mex&Timeline)
README.md:56:mex sync         # fix drift
README.md:63:npx promexeus sync         # fix drift
README.md:80:| **index-sync** | `patterns/INDEX.md` out of sync with actual pattern files |
README.md:105:| `mex check --fix` | Check and jump straight to sync if errors found |
README.md:106:| `mex sync` | Detect drift → choose mode → AI fixes → verify → repeat |
README.md:107:| `mex sync --dry-run` | Preview targeted prompts without executing |
README.md:108:| `mex sync --warnings` | Include warning-only files in sync |
README.md:109:| `mex init` | Pre-scan codebase, build structured brief for AI |
README.md:110:| `mex init --json` | Raw scanner brief as JSON |
README.md:111:| `mex watch` | Install post-commit hook (silent on perfect score) |
README.md:112:| `mex watch --uninstall` | Remove the hook |
README.md:116:![mex sync output](screenshots/mex-sync.jpg)
README.md:118:Running check after drift is fixed by sync
README.md:172:| Multi-context query | ~3,300 tokens | ~1,650 tokens | 50% |
README.md:174:**~60% average token reduction per session.**
README.md:185:CLAUDE.md says "Read .mex/ROUTER.md before doing anything"
README.md:187:ROUTER.md routing table → loads relevant context file for this task
README.md:189:context file → points to pattern file if task-specific guidance exists
README.md:191:Agent executes with full project context, minimal token cost
README.md:193:After task: agent updates scaffold (GROW step)
README.md:198:CLAUDE.md stays at ~120 tokens. The agent navigates to only what it needs. After every task, the agent updates the scaffold — creating patterns from new task types, updating project state, fixing stale context. The scaffold compounds over time.
README.md:206:│   ├── ROUTER.md          ← routing table, session bootstrap
README.md:207:│   ├── AGENTS.md          ← always-loaded anchor (~150 tokens)
README.md:208:│   ├── context/
README.md:229:| Codex (OpenAI) | `AGENTS.md` |
README.md:231:Most config files embed the same instructions directly. OpenCode is the exception — `.opencode/opencode.json` references `.mex/AGENTS.md` instead of embedding content. `mex setup` asks which tool you use and creates the appropriate config.
README.md:239:See [CHANGELOG.md](CHANGELOG.md) for release history.
src/git.ts:13:export async function daysSinceLastChange(
src/git.ts:32:export async function commitsSinceLastChange(
src/git.ts:53:export async function getGitDiff(
src/git.ts:65:/** Get full git log */
src/git.ts:66:export async function getLog(
.tool-configs/CLAUDE.md:3:description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
.tool-configs/CLAUDE.md:35:After completing any task: update `.mex/ROUTER.md` project state and any `.mex/` files that are now out of date. If no pattern existed for the task you just completed, create one in `.mex/patterns/`.
.tool-configs/CLAUDE.md:38:At the start of every session, read `.mex/ROUTER.md` before doing anything else.
.tool-configs/CLAUDE.md:39:For full project context, patterns, and task guidance — everything is there.
.tool-configs/opencode.json:3:  "instructions": [".mex/AGENTS.md"]
src/scanner/readme.ts:13:        // Truncate to first 3000 chars to keep brief compact
.tool-configs/README.md:4:Most embed the same content — a pointer to `.mex/ROUTER.md`. OpenCode uses a JSON config that references `.mex/AGENTS.md` instead.
.tool-configs/README.md:15:| Codex (OpenAI) | Copy `CLAUDE.md` as `AGENTS.md` to project root |
.tool-configs/README.md:16:| Any other tool | Point agent to `.mex/AGENTS.md` |
.tool-configs/README.md:39:cp .tool-configs/CLAUDE.md ./AGENTS.md
.tool-configs/README.md:44:Add "Read .mex/ROUTER.md before starting any task" to your tool's system prompt
.tool-configs/README.md:45:or paste it at the start of each session. The scaffold works identically.
.tool-configs/README.md:49:Most files embed the Circle 1 anchor from `.mex/AGENTS.md`. OpenCode's `opencode.json` references it by path instead.
.tool-configs/README.md:50:`.mex/AGENTS.md` is the source of truth. If you update it, update your root tool config too.
src/scanner/index.ts:8:/** Run pre-analysis scan and return brief or prompt */
src/scanner/index.ts:9:export async function runScan(
src/scanner/index.ts:13:  const brief = buildBrief(config.projectRoot);
src/scanner/index.ts:15:  if (opts.jsonOnly) return brief;
src/scanner/index.ts:17:  return buildPrompt(brief);
src/scanner/index.ts:20:/** Build the scanner brief from codebase analysis */
src/scanner/index.ts:32:/** Build AI prompt with embedded brief */
src/scanner/index.ts:33:function buildPrompt(brief: ScannerBrief): string {
src/scanner/index.ts:34:  const briefJson = JSON.stringify(brief, null, 2);
src/scanner/index.ts:36:  return `Here is a pre-analyzed brief of the codebase — do NOT explore the filesystem yourself, reason from this brief:
src/scanner/index.ts:38:<brief>
src/scanner/index.ts:39:${briefJson}
src/scanner/index.ts:40:</brief>
src/scanner/index.ts:42:Using this brief, populate the mex scaffold files. Focus on:
src/scanner/index.ts:43:1. context/architecture.md — system components, data flow, integrations
src/scanner/index.ts:44:2. context/stack.md — technologies, versions, key libraries
src/scanner/index.ts:45:3. context/conventions.md — code patterns, naming, file organization
src/scanner/index.ts:46:4. context/decisions.md — architectural choices and their rationale
src/scanner/index.ts:47:5. context/setup.md — how to set up and run the project
src/scanner/index.ts:48:6. ROUTER.md — update the "Current Project State" section
src/scanner/index.ts:50:For each file, use the information from the brief rather than exploring the filesystem.
.tool-configs/copilot-instructions.md:3:description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
.tool-configs/copilot-instructions.md:35:After completing any task: update `.mex/ROUTER.md` project state and any `.mex/` files that are now out of date. If no pattern existed for the task you just completed, create one in `.mex/patterns/`.
.tool-configs/copilot-instructions.md:38:At the start of every session, read `.mex/ROUTER.md` before doing anything else.
.tool-configs/copilot-instructions.md:39:For full project context, patterns, and task guidance — everything is there.
src/scanner/manifest.ts:16:    if (!existsSync(path)) continue;
src/scanner/entry-points.ts:48:        if (seen.has(path)) continue;
src/scanner/folder-tree.ts:43:    if (entry.startsWith(".") && entry !== ".github") continue;
src/scanner/folder-tree.ts:44:    if (IGNORE_DIRS.has(entry)) continue;
src/scanner/folder-tree.ts:51:      continue;
src/scanner/folder-tree.ts:54:    if (!stat.isDirectory()) continue;
src/scanner/folder-tree.ts:72:    if (category === "other") continue;
src/scanner/folder-tree.ts:83:      if (entry.startsWith(".")) continue;
src/scanner/folder-tree.ts:84:      if (IGNORE_DIRS.has(entry)) continue;
src/scanner/folder-tree.ts:91:        continue;
src/drift/index.ts:10:import { checkIndexSync } from "./checkers/index-sync.js";
src/drift/index.ts:18:export async function runDriftCheck(config: MexConfig): Promise<DriftReport> {
src/drift/index.ts:76:    "context/*.md",
src/drift/index.ts:78:    "ROUTER.md",
src/drift/index.ts:79:    "AGENTS.md",
src/drift/index.ts:80:    "SETUP.md",
src/drift/index.ts:81:    "SYNC.md",
src/sync/index.ts:6:import { buildSyncBrief, buildCombinedBrief } from "./brief-builder.js";
src/sync/index.ts:18:function runClaudeInteractive(brief: string, cwd: string): boolean {
src/sync/index.ts:19:  const result = spawnSync("claude", [brief], {
src/sync/index.ts:29:/** Run targeted sync: detect → brief → AI → verify → ask → loop */
src/sync/index.ts:30:export async function runSync(
src/sync/index.ts:50:      console.log(chalk.green("✓ No drift detected. Everything is in sync."));
src/sync/index.ts:102:      const brief = await buildCombinedBrief(targets, config.projectRoot);
src/sync/index.ts:103:      console.log(brief);
src/sync/index.ts:112:      console.log("  1) Interactive — Claude fixes with you watching (default)");
src/sync/index.ts:128:          console.log(chalk.dim("Exiting. Run mex sync again anytime."));
src/sync/index.ts:138:      const brief = await buildCombinedBrief(targets, config.projectRoot);
src/sync/index.ts:139:      console.log(brief);
src/sync/index.ts:144:    // Step 3: Fix all files in one interactive session
src/sync/index.ts:146:    console.log(chalk.bold(`\nSending all ${targets.length} file(s) to Claude in one session...\n`));
src/sync/index.ts:148:    const brief = await buildCombinedBrief(targets, config.projectRoot);
src/sync/index.ts:149:    const ok = runClaudeInteractive(brief, config.projectRoot);
src/sync/index.ts:152:      console.log(chalk.red("  ✗ Claude session failed"));
src/sync/index.ts:171:    // Step 5: Check if we should continue
src/sync/index.ts:197:    // Ask user whether to continue
src/sync/index.ts:207:      console.log(chalk.dim("Stopped. Run mex sync again anytime."));
src/sync/brief-builder.ts:8:export async function buildCombinedBrief(
src/sync/brief-builder.ts:23:When a referenced path no longer exists, find the correct current path from the filesystem context above and update the reference.`;
src/sync/brief-builder.ts:27:export async function buildSyncBrief(
src/sync/brief-builder.ts:38:When a referenced path no longer exists, find the correct current path from the filesystem context above and update the reference.`;
src/sync/brief-builder.ts:42:async function buildFileSection(
src/sync/brief-builder.ts:83:**Filesystem context (what actually exists):**
src/config.ts:7: * then look for scaffold root (.mex/ or context/ directory).
src/config.ts:23:  if (existsSync(mexDir) && !existsSync(resolve(mexDir, "ROUTER.md"))) {
src/config.ts:60:  // Fall back to context/ directory (current mex layout)
src/config.ts:61:  const contextDir = resolve(projectRoot, "context");
src/config.ts:62:  if (existsSync(contextDir)) return projectRoot;
src/watch.ts:1:import { writeFileSync, readFileSync, existsSync, chmodSync, unlinkSync } from "node:fs";
src/watch.ts:17:# Auto-installed by mex watch — runs drift check after each commit
src/watch.ts:27:export async function manageHook(
src/watch.ts:53:    writeFileSync(hookPath, updated);
src/watch.ts:61:  writeFileSync(hookPath, hookContent);
src/watch.ts:88:      continue;
src/watch.ts:96:        continue;
src/watch.ts:110:    writeFileSync(hookPath, remaining + "\n");
src/markdown.ts:34:/** Get the current heading context for a given line position */
src/markdown.ts:42:    if (!node.position) continue;
src/drift/checkers/cross-file.ts:11:    if (!match) continue;
src/drift/checkers/cross-file.ts:19:    if (versionClaims.length < 2) continue;
src/drift/checkers/cross-file.ts:51:    if (cmdClaims.length < 2) continue;
src/drift/checkers/cross-file.ts:53:    if (!fromDifferentFiles) continue;
src/drift/checkers/path.ts:20:    if (pathExists(claim.value, projectRoot, scaffoldRoot)) continue;
src/drift/checkers/path.ts:45:  // Try scaffold root (e.g. context/architecture.md when scaffold is in .mex/)
src/drift/checkers/script-coverage.ts:49:    if (IGNORED_SCRIPTS.has(script)) continue;
src/drift/checkers/script-coverage.ts:56:      continue;
src/drift/checkers/script-coverage.ts:62:      if (scaffoldText.includes(base)) continue;
src/drift/checkers/staleness.ts:9:/** Check how stale a scaffold file is based on git history */
src/drift/checkers/staleness.ts:10:export async function checkStaleness(
src/pattern/index.ts:2:import { existsSync, writeFileSync, appendFileSync, mkdirSync, readFileSync } from "node:fs";
src/pattern/index.ts:6:export async function runPatternAdd(config: MexConfig, name: string) {
src/pattern/index.ts:27:  - target: "context/conventions.md"
src/pattern/index.ts:41:[The things that go wrong. What to watch out for.]
src/pattern/index.ts:50:- [ ] Update \`ROUTER.md\` "Current Project State" if what's working/not built has changed
src/pattern/index.ts:51:- [ ] Update any \`context/\` files that are now out of date
src/pattern/index.ts:56:  writeFileSync(patternPath, template, "utf8");
src/pattern/index.ts:62:    appendFileSync(indexPath, entry, "utf8");
src/cli.ts:10:  .description("CLI engine for mex scaffold — drift detection, pre-analysis, and targeted sync")
src/cli.ts:18:  .action(async (opts) => {
src/cli.ts:33:  .option("--quiet", "Single-line summary only")
src/cli.ts:34:  .option("--fix", "Run sync to fix any issues found")
src/cli.ts:35:  .action(async (opts) => {
src/cli.ts:49:      // If --fix and there are issues, jump to sync
src/cli.ts:52:        const { runSync } = await import("./sync/index.js");
src/cli.ts:67:  .description("Scan codebase and generate pre-analysis brief for AI")
src/cli.ts:68:  .option("--json", "Output scanner brief as JSON")
src/cli.ts:69:  .action(async (opts) => {
src/cli.ts:88:  .command("sync")
src/cli.ts:90:  .option("--dry-run", "Show what would be synced without executing")
src/cli.ts:91:  .option("--warnings", "Include warning-only files (by default only errors are synced)")
src/cli.ts:92:  .action(async (opts) => {
src/cli.ts:95:      const { runSync } = await import("./sync/index.js");
src/cli.ts:111:  .action(async (name) => {
src/cli.ts:124:  .command("watch")
src/cli.ts:127:  .action(async (opts) => {
src/cli.ts:130:      const { manageHook } = await import("./watch.js");
src/cli.ts:150:    console.log("  mex sync               Fix drift — Claude updates only what's broken");
src/cli.ts:151:    console.log("  mex sync --dry-run     Preview fix prompts without running them");
src/cli.ts:152:    console.log("  mex sync --warnings    Include warning-only files in sync");
src/cli.ts:153:    console.log("  mex init               Pre-scan codebase, build brief for AI");
src/cli.ts:154:    console.log("  mex init --json        Scanner brief as JSON");
src/cli.ts:155:    console.log("  mex pattern add <name> Create a new pattern file");
src/cli.ts:156:    console.log("  mex watch              Install post-commit hook for auto drift score");
src/cli.ts:157:    console.log("  mex watch --uninstall  Remove the post-commit hook");
src/drift/checkers/dependency.ts:58:    if (KNOWN_RUNTIMES.has(name)) continue;
src/drift/checkers/dependency.ts:79:    if (!match) continue;
src/drift/checkers/edges.ts:18:    if (!edge.target) continue;
src/drift/checkers/command.ts:37:      continue;
src/setup/index.ts:1:import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
src/setup/index.ts:29:  "ROUTER.md",
src/setup/index.ts:30:  "AGENTS.md",
src/setup/index.ts:31:  "SETUP.md",
src/setup/index.ts:32:  "SYNC.md",
src/setup/index.ts:33:  "context/architecture.md",
src/setup/index.ts:34:  "context/stack.md",
src/setup/index.ts:35:  "context/conventions.md",
src/setup/index.ts:36:  "context/decisions.md",
src/setup/index.ts:37:  "context/setup.md",
src/setup/index.ts:48:  "6": { src: ".tool-configs/CLAUDE.md", dest: "AGENTS.md" },  // Codex reads AGENTS.md at root
src/setup/index.ts:89:  console.log(`               ${BOLD}universal ai context scaffold${NC}`);
src/setup/index.ts:96:export async function runSetup(opts: { dryRun?: boolean } = {}): Promise<void> {
src/setup/index.ts:166:        continue;
src/setup/index.ts:203:      ok("Pre-analysis complete — AI will reason from brief instead of exploring");
src/setup/index.ts:234:    info("An interactive Claude Code session will open with the population prompt.");
src/setup/index.ts:276:  const agentsMd = resolve(mexDir, "AGENTS.md");
src/setup/index.ts:305:async function selectToolConfig(
src/setup/index.ts:373:      info("Skipped tool config — AGENTS.md in .mex/ works with any tool that can read files");
src/setup/index.ts:410:async function promptGlobalInstall(): Promise<void> {
src/setup/index.ts:426:        ok("Installed globally. `mex check` and `mex sync` work from anywhere now.");
src/setup/index.ts:450:  info("Verify — start a fresh session and ask:");
src/setup/index.ts:451:  console.log('    "Read .mex/ROUTER.md and tell me what you know about this project."');
src/setup/index.ts:458:    console.log("    mex sync               Fix drift — AI updates only what's broken");
src/setup/index.ts:459:    console.log("    mex watch              Auto-check drift after every commit");
src/setup/index.ts:464:    console.log("    npx promexeus sync               Fix drift — AI updates only what's broken");
src/setup/index.ts:465:    console.log("    npx promexeus watch              Auto-check drift after every commit");
src/setup/prompts.ts:5: *   - existing with scanner brief: AI reasons from pre-analyzed data
src/setup/prompts.ts:6: *   - existing without brief: AI explores filesystem directly
src/setup/prompts.ts:26:grows incrementally — the behavioural contract (step 5: GROW) will create
src/setup/prompts.ts:36:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
src/setup/prompts.ts:42:- Every context/ file should have at least 2 edges
src/setup/prompts.ts:43:- Every pattern file should have at least 1 edge (usually to the relevant context file)
src/setup/prompts.ts:45:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
src/setup/prompts.ts:57:Populate each .mex/context/ file by replacing the annotation comments
src/setup/prompts.ts:68:If yes, create additional domain-specific context files in .mex/context/.
src/setup/prompts.ts:69:Examples: a project with a complex auth system gets .mex/context/auth.md.
src/setup/prompts.ts:70:A data pipeline gets .mex/context/ingestion.md. A project with Stripe gets
src/setup/prompts.ts:71:.mex/context/payments.md. Use the same YAML frontmatter format (name,
src/setup/prompts.ts:76:After populating .mex/context/ files, update .mex/ROUTER.md:
src/setup/prompts.ts:78:- Add rows to the routing table for any domain-specific context files you created
src/setup/prompts.ts:80:Update .mex/AGENTS.md:
src/setup/prompts.ts:84:  return `You are going to populate an AI context scaffold for a project that
src/setup/prompts.ts:88:1. .mex/ROUTER.md — understand the scaffold structure
src/setup/prompts.ts:89:2. All files in .mex/context/ — read the annotation comments in each
src/setup/prompts.ts:102:After I answer, populate the .mex/context/ files based on my answers.
src/setup/prompts.ts:108:or too shallow? If yes, create additional domain-specific context files
src/setup/prompts.ts:109:in .mex/context/. Examples: a project with a complex auth system gets
src/setup/prompts.ts:110:.mex/context/auth.md. A data pipeline gets .mex/context/ingestion.md.
src/setup/prompts.ts:111:A project with Stripe gets .mex/context/payments.md. Use the same YAML
src/setup/prompts.ts:118:Update .mex/ROUTER.md current state to reflect that this is a new project.
src/setup/prompts.ts:119:Add rows to the routing table for any domain-specific context files you created.
src/setup/prompts.ts:120:Update .mex/AGENTS.md with the project name, description, non-negotiables, and commands.
src/setup/prompts.ts:129:incrementally — the behavioural contract (step 5: GROW) will create
src/setup/prompts.ts:138:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
src/setup/prompts.ts:144:- Every context/ file should have at least 2 edges
src/setup/prompts.ts:147:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
src/setup/prompts.ts:153:export function buildExistingWithBriefPrompt(briefJson: string): string {
src/setup/prompts.ts:154:  return `You are going to populate an AI context scaffold for this project.
src/setup/prompts.ts:158:1. .mex/ROUTER.md — understand the scaffold structure
src/setup/prompts.ts:159:2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
src/setup/prompts.ts:160:3. .mex/context/stack.md — same
src/setup/prompts.ts:161:4. .mex/context/conventions.md — same
src/setup/prompts.ts:162:5. .mex/context/decisions.md — same
src/setup/prompts.ts:163:6. .mex/context/setup.md — same
src/setup/prompts.ts:165:Here is a pre-analyzed brief of the codebase — do NOT explore the filesystem
src/setup/prompts.ts:166:yourself for basic structure. Reason from this brief for dependencies, entry
src/setup/prompts.ts:170:<brief>
src/setup/prompts.ts:171:${briefJson}
src/setup/prompts.ts:172:</brief>
src/setup/prompts.ts:180:  return `You are going to populate an AI context scaffold for this project.
src/setup/prompts.ts:184:1. .mex/ROUTER.md — understand the scaffold structure
src/setup/prompts.ts:185:2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
src/setup/prompts.ts:186:3. .mex/context/stack.md — same
src/setup/prompts.ts:187:4. .mex/context/conventions.md — same
src/setup/prompts.ts:188:5. .mex/context/decisions.md — same
src/setup/prompts.ts:189:6. .mex/context/setup.md — same

codex
The external repo structure is clear now: there isn’t an obvious long-lived runtime session store, so I’m drilling into the scaffold contract and the CLI/sync/watch code to see how Mex manufactures continuity out of files, hooks, and targeted repair loops instead. I’ll pull our `session_bootstrap`/`session_resume`/`generate-context` surfaces next so the comparison stays honest.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba README.md | sed -n '20,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba AGENTS.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba ROUTER.md | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba SETUP.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   221	
   222	## Keeping It Fresh
   223	
   224	Once the scaffold is populated, use these to keep it aligned with your codebase:
   225	
   226	- **`mex check`** — detect drift (zero tokens, zero AI)
   227	- **`.mex/sync.sh`** — interactive drift check + targeted or full resync
   228	- **`mex watch`** — auto drift score after every commit

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba SYNC.md | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/cli.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/config.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/watch.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/sync/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/sync/brief-builder.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/scanner/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/pattern/index.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/git.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "session_bootstrap|session_resume|memory_context|memory_match_triggers|generate-context|collect-session-data|session_id|task_preflight|task_postflight" .opencode/skill/system-spec-kit -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:365:    : typeof args.session_id === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:366:      ? args.session_id
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:174:  session_id: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:413:  task_preflight: taskPreflightSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414:  task_postflight: taskPostflightSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:108:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:189:    session_id: rawSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/templates/handover.md:35:- **From Session:** [YOUR_VALUE_HERE: session_id or date]
.opencode/skill/system-spec-kit/templates/handover.md:116:- Create new memory file via `generate-context.js` before handover
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/constitutional/README.md:672:**Symptom:** `memory_match_triggers()` doesn't return your memory
.opencode/skill/system-spec-kit/constitutional/README.md:705:memory_match_triggers({ prompt: "fix the bug" })
.opencode/skill/system-spec-kit/shared/embeddings/README.md:398:| [generate-context.js](../../scripts/dist/memory/generate-context.js) | Main script using embeddings |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:28:  - memory_context
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:47:| **Memory/context** (prior work, decisions) | `memory_search` / `memory_context` | `memory_match_triggers` |
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:117:      AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
.opencode/skill/system-spec-kit/ARCHITECTURE.md:174:`dist/` directories under `shared/`, `scripts/` and `mcp_server/` are generated build outputs produced from TypeScript sources via the build process (`tsc --build`). They can run at runtime, but they are not source-of-truth code or documentation and should not be committed to version control. Edit the authored `.ts` and `.md` files in package roots, then rebuild. Scripts or documentation that reference `dist/` files for execution (e.g., `node scripts/dist/memory/generate-context.js`) are referencing the generated runtime entry point, not canonical source.
.opencode/skill/system-spec-kit/ARCHITECTURE.md:458:        codex["Codex bootstrap parity<br/>session_bootstrap() MCP tool"]
.opencode/skill/system-spec-kit/ARCHITECTURE.md:561:| Startup or recovery state | Session surfaces | `session_bootstrap` / `session_resume` / startup surface |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:562:| Session continuity (prior work, decisions) | Memory | `memory_search` / `memory_context` |
.opencode/skill/system-spec-kit/templates/context_template.md:9:_sourceSessionId: "{{SOURCE_SESSION_ID}}"
.opencode/skill/system-spec-kit/templates/context_template.md:108:     - "Memory files MUST use generate-context.js script"
.opencode/skill/system-spec-kit/templates/context_template.md:126:| Session ID | {{SESSION_ID}} |
.opencode/skill/system-spec-kit/templates/context_template.md:328:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {{SPEC_FOLDER}} --force
.opencode/skill/system-spec-kit/templates/context_template.md:404:session_id: "{{SESSION_ID}}"
.opencode/skill/system-spec-kit/shared/README.md:38:- **CLI scripts** (`scripts/`) - `generate-context.ts` and other utilities
.opencode/skill/system-spec-kit/shared/README.md:369:// In scripts/memory/generate-context.ts or similar
.opencode/skill/system-spec-kit/shared/algorithms/README.md:124:- **Consumers**: MCP server retrieval pipeline, `memory_search` and `memory_match_triggers` endpoints
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:126:- [ ] Save context if significant progress: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:159:- [ ] Memory context saved: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:84:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:15:// Feature catalog: Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:113:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:135:    session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:167:  ON session_learning(spec_folder, task_id, session_id, phase, updated_at, id)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:175:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:300:/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:334:  const normalizedSessionId = normalizeSessionId(session_id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:344:       AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:352:      SET session_id = ?, pre_knowledge_score = ?, pre_uncertainty_score = ?, pre_context_score = ?, knowledge_gaps = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:370:        tool: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:399:    (spec_folder, task_id, phase, session_id, pre_knowledge_score, pre_uncertainty_score, pre_context_score, knowledge_gaps, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:420:      tool: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:442:          : `Call task_postflight with taskId: "${taskId}" after completing the task`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:457:/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:491:  const normalizedSessionId = normalizeSessionId(session_id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:501:    query += ' AND session_id = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:537:        ? `No preflight record found for spec_folder="${spec_folder}" and task_id="${taskId}". Call task_preflight first.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:538:        : `No preflight record found for spec_folder="${spec_folder}", task_id="${taskId}", session_id="${normalizedSessionId}". Call task_preflight first.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:607:      tool: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:686:    const normalizedSessionId = normalizeSessionId(session_id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:694:      sql += ' AND session_id = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:778:        summarySql += ' AND session_id = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:836:      hints.push('Call task_postflight to complete learning measurement');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:872:const handle_task_preflight = handleTaskPreflight;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:873:const handle_task_postflight = handleTaskPostflight;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:878:  handle_task_preflight,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:879:  handle_task_postflight,
.opencode/skill/system-spec-kit/shared/normalization.ts:51:  session_id: string | null;
.opencode/skill/system-spec-kit/shared/normalization.ts:146:    sessionId: row.session_id,
.opencode/skill/system-spec-kit/shared/normalization.ts:191:  if (memory.sessionId !== undefined) row.session_id = memory.sessionId;
.opencode/skill/system-spec-kit/shared/normalization.ts:236:  if (row.session_id !== undefined) mem.sessionId = row.session_id;
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:98:| 1    | Check CLI argument  | `node .opencode/.../scripts/dist/memory/generate-context.js data.json [spec-folder]` |
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:165:These thresholds are defined in `generate-context.ts`:
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:236:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "006-opencode/014-stateless-alignment"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:239:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-skill-standardization/002-api-refactor"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:248:   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context.json "014-stateless-alignment"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:341:AUTO_SAVE_MODE=true node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-specific-folder"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:510:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-feature/003-new-work"
.opencode/skill/system-spec-kit/templates/memory/README.md:7:  - "generate-context"
.opencode/skill/system-spec-kit/templates/memory/README.md:40:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder-or-json-input>
.opencode/skill/system-spec-kit/templates/memory/README.md:50:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/system-spec-kit
.opencode/skill/system-spec-kit/templates/memory/README.md:53:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 003-parent/001-child
.opencode/skill/system-spec-kit/templates/memory/README.md:56:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 001-child-name
.opencode/skill/system-spec-kit/templates/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json
.opencode/skill/system-spec-kit/templates/memory/README.md:80:- `../../scripts/dist/memory/generate-context.js`
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:202:<!-- ANCHOR:generate-context-js-integration -->
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:203:## 9. generate-context.js Integration
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:205:When using subfolder versioning, the memory save script (`generate-context.js`) fully supports nested paths.
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:236:<!-- /ANCHOR:generate-context-js-integration -->
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
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
.opencode/skill/system-spec-kit/SKILL.md:575:| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
.opencode/skill/system-spec-kit/SKILL.md:593:**memory_context() — Mode Routing:**
.opencode/skill/system-spec-kit/SKILL.md:619:**Epistemic Learning:** Use `task_preflight()` before and `task_postflight()` after implementation to measure knowledge gains. Learning Index: `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`. Review trends via `memory_get_learning_history()`. See [epistemic_vectors.md](./references/memory/epistemic_vectors.md).
.opencode/skill/system-spec-kit/SKILL.md:631:- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility
.opencode/skill/system-spec-kit/SKILL.md:755:**Cross-runtime handling:** Claude and Gemini use SessionStart hook scripts. OpenCode has a transport/plugin implementation, but operationally should still be treated as bootstrap-first when startup surfacing is unavailable. Codex remains bootstrap-based through its session-start agent bootstrap (not a native SessionStart hook). Copilot startup context depends on local hook configuration or wrapper wiring when present. Use `session_bootstrap()` for fresh start or after `/clear`, `session_resume()` for reconnect-style recovery when bootstrap is unnecessary, and `session_health()` only to re-check drift or readiness mid-session.
.opencode/skill/system-spec-kit/SKILL.md:784:**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.
.opencode/skill/system-spec-kit/SKILL.md:801:| `session_resume` | Combined memory + code graph + CocoIndex resume in one call |
.opencode/skill/system-spec-kit/SKILL.md:802:| `session_bootstrap` | Complete session bootstrap (resume + health) in one call |
.opencode/skill/system-spec-kit/SKILL.md:884:- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
.opencode/skill/system-spec-kit/SKILL.md:941:| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/` |
.opencode/skill/system-spec-kit/SKILL.md:969:| Memory gen        | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file creation              |
.opencode/skill/system-spec-kit/assets/template_mapping.md:179:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:201:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:223:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:245:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:322:**Generation:** Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/` to auto-generate properly formatted memory files.
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:48:  'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:49:  'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:69:    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(validateToolArgs('task_preflight', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:70:    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(validateToolArgs('task_postflight', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:63:| `context_template.md` | Mustache syntax (`{{VARIABLE}}`) | Programmatic generation via generate-context.js |
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:87:| `{{MUSTACHE}}` | Auto-generated (context_template.md only) | `{{SESSION_ID}}` |
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:298:export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:299:export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/references/templates/template_guide.md:600:Memory files in the `memory/` folder are NOT created from templates. They are auto-generated by the runtime save script: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:602:**Creation (JSON mode — preferred):** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/`
.opencode/skill/system-spec-kit/references/templates/template_guide.md:610:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature
.opencode/skill/system-spec-kit/references/templates/template_guide.md:621:- **NEVER create memory files manually** - always use `generate-context.js` via the runtime `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` entrypoint
.opencode/skill/system-spec-kit/references/templates/template_guide.md:626:**Note:** Never manually create memory files using Write/Edit tools. Always use the runtime `generate-context.js` script per AGENTS.md Memory Save Rule.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:1188:- `memory/` - Context preservation folder (files auto-generated via `generate-context.js`)
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:2:title: "Epistemic baseline capture (task_preflight)"
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:6:# Epistemic baseline capture (task_preflight)
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:35:| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `task_preflight` arguments |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:36:| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `task_preflight` |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:60:- Source feature title: Epistemic baseline capture (task_preflight)
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:182:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:502:**MANDATORY:** Use generate-context.js for memory save:
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:504:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/###-folder/
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:764:| `memory/` | Session context preservation | `generate-context.js` runtime script via `/memory:save` |
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:769:- Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:852:- `memory/` - Context preservation (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:159:**2. Trigger matching decay (turn-based):** Used by `memory_match_triggers()` within a single conversation session. Applies per-turn attention decay so earlier matches lose weight as the conversation progresses.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:471:**Symptom:** `memory_match_triggers()` returns no results even for relevant queries.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:282:      'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:297:      'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:342:    WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:443:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:447:    PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:452:  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:523:      WHERE session_id = ? AND memory_hash = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:565:      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:568:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:647:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:678:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:713:      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:723:      WHERE session_id = ? AND rowid IN (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:725:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:848:      DELETE FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:878:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:960:    session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1036:        session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1042:      ON CONFLICT(session_id) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1086:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1136:      SELECT session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1141:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1180:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1199:      SELECT session_id, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:32:    session_id: 'sess-abc123',
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:77:### generate-context.js runtime entrypoint
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:84:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:87:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:90:echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:220:The `generate-context.js` script orchestrates a 12-step workflow via `workflow.ts`:
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:2:title: "Post-task learning measurement (task_postflight)"
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:6:# Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:26:The handler also supports re-correction runs. It accepts both "preflight" and already-"complete" records, so you can call `task_postflight` again for the same task to recompute the deltas and overwrite the stored postflight values after refining your assessment.
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:40:| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `task_postflight` arguments |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:41:| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `task_postflight` |
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:64:- Source feature title: Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/references/config/environment_variables.md:108:| `DEBUG` | `false` | Enable debug logging in generate-context.ts |
.opencode/skill/system-spec-kit/references/config/environment_variables.md:133:node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/config/environment_variables.md:136:DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/config/environment_variables.md:276:| `SPECKIT_AUTO_RESUME` | ON | S7 | Auto-resume session detection in `memory_context()` |
.opencode/skill/system-spec-kit/references/config/hook_system.md:50:Hook-capable runtimes include Claude Code, Codex CLI, Copilot CLI, Gemini CLI, and OpenCode. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). If hook context is unavailable in any runtime for any reason, fall back to the tool-based recovery path: `session_bootstrap()` on fresh start or after `/clear`, then `session_resume()` only when a detailed follow-up recovery payload is needed.
.opencode/skill/system-spec-kit/references/config/hook_system.md:55:1. `memory_match_triggers(prompt)` — Fast turn-start context
.opencode/skill/system-spec-kit/references/config/hook_system.md:56:2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
.opencode/skill/system-spec-kit/references/config/hook_system.md:57:3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:115:session_id: "${titleSlug}-fixture"
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:73:- `memory_context` response metadata shows no pressure-mode override
.opencode/skill/system-spec-kit/scripts/extractors/index.ts:34:export * from './collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:49:      session_id TEXT,
.opencode/skill/system-spec-kit/references/memory/epistemic_vectors.md:399:1. **`task_preflight()`** — Captures epistemic baseline before work begins. Records uncertainty score (0-100), knowledge gaps, and context coverage.
.opencode/skill/system-spec-kit/references/memory/epistemic_vectors.md:400:2. **`task_postflight()`** — Measures post-task state. Computes Learning Index: `LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)`.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md:20:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:92:    claude_session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:93:    speckit_session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:117:    claude_session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:136:    UNIQUE(claude_session_id, transcript_path, byte_start)
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:160:    ON analytics_turns (claude_session_id, transcript_path, line_no);
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:167:  claude_session_id: string;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:168:  speckit_session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:192:  claude_session_id: string;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:393:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:422:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:453:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:480:      claude_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:481:      speckit_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:502:    ON CONFLICT(claude_session_id) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:503:      speckit_session_id = excluded.speckit_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:533:      claude_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:614:    ORDER BY claude_session_id ASC
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:625:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:269:      session_id: 'session-1',
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:84:The `memory_match_triggers` MCP tool provides fast trigger phrase matching without requiring embeddings:
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:88:const result = await spec_kit_memory_memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:119:1. AI calls `memory_match_triggers({ prompt: "user message" })`
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:127:const matches = await memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:158:These signals are detected during `memory_match_triggers()` processing and influence save-time arbitration (prediction-error scoring) and correction tracking.
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:174:- `memory_match_triggers()` now applies a relevance threshold before returning matches, reducing noise from weak partial matches
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:394:- [generate-context.ts](../../scripts/memory/generate-context.ts) - Context generation script
.opencode/skill/system-spec-kit/scripts/extractors/README.md:34:- `collect-session-data.ts` - Orchestrates session data collection across observations, files, decisions, and context
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md:22:- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:26:| Scripts | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file generation with ANCHOR format |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:48:- **Memory Files** — Session-specific context generated via `generate-context.js`. Subject to temporal decay.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:103:| L1: Orchestration | `memory_context()` | Unified entry point with intent-aware routing (7 intents) | START HERE for most memory operations |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:104:| L1: Orchestration | `session_resume()` | Resume memory, code graph, and CocoIndex state in one call | Detailed recovery payload after reconnect, or when you want direct merged resume state |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:105:| L1: Orchestration | `session_bootstrap()` | Composite bootstrap combining resume and health checks | Canonical first tool call in a fresh OpenCode-style session or after `/clear` |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:108:| L2: Core | `memory_match_triggers()` | Fast keyword matching (<50ms) with cognitive features | Gate enforcement |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:109:| L2: Core | `memory_save()` | Index a memory file. Re-generates embedding when **content hash** changes. Title-only changes do not trigger re-embedding. | After generate-context.js |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:126:| L6: Analysis | `task_preflight()` | Capture epistemic baseline before task execution | Start of implementation work |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:127:| L6: Analysis | `task_postflight()` | Capture epistemic state after task, calculate Learning Index | After completing implementation |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:688:- `scripts/dist/memory/generate-context.js` - Runtime memory-save entrypoint (compiled from `scripts/memory/generate-context.ts`)
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:20:  { tool: 'task_preflight', handler: 'handleTaskPreflight', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:21:  { tool: 'task_postflight', handler: 'handleTaskPostflight', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:46:  { camel: 'handleTaskPreflight', snake: 'handle_task_preflight' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:47:  { camel: 'handleTaskPostflight', snake: 'handle_task_postflight' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:105:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:114:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. The trace surface now also carries `sessionTransition` and bounded graph-walk diagnostics when those signals are active. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/024-post-task-learning-measurement-task-postflight.md:2:title: "EX-024 -- Post-task learning measurement (task_postflight)"
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/024-post-task-learning-measurement-task-postflight.md:3:description: "This scenario validates Post-task learning measurement (task_postflight) for `EX-024`. It focuses on Learning closeout."
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/024-post-task-learning-measurement-task-postflight.md:6:# EX-024 -- Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/024-post-task-learning-measurement-task-postflight.md:10:This scenario validates Post-task learning measurement (task_postflight) for `EX-024`. It focuses on Learning closeout.
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/024-post-task-learning-measurement-task-postflight.md:29:| EX-024 | Post-task learning measurement (task_postflight) | Learning closeout | `Complete postflight for pipeline-v2-audit. Capture the evidence needed to prove Delta/learning record saved. Return a concise user-facing pass/fail verdict with the main reason.` | `task_postflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)` | Delta/learning record saved | Postflight output | PASS if completion recorded | Verify taskId matches preflight |
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:21:Direct phase-folder targets are supported. If the explicit CLI target resolves to a policy-defined phase folder, `generate-context.js` preserves that target and writes memory files into the selected phase folder's `memory/` directory.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:63:│                    │ generate-context│                         │
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:150:3. AI agent creates structured JSON summary (any agent can invoke generate-context.js for memory — this is an exception to the @speckit exclusivity rule)
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:151:4. AI agent calls `generate-context.js` with JSON data
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:212:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:217:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:223:  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:245:| Script exists      | `test -f .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Check skill installation |
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:367:For retrieval, `memory_context()` routes queries across 7 intents (including `find_spec` and `find_decision`) and applies intent-aware weighting.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:562:After `generate-context.js` completes, it emits a **POST-SAVE QUALITY REVIEW** block. This review checks the saved memory file for common issues that degrade retrieval quality.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:628:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:617:        component: 'collect-session-data',
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1574:    SESSION_ID: sessionId,
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1594:    SOURCE_SESSION_ID: sourceSessionId,
.opencode/skill/system-spec-kit/templates/README.md:84:- Memory context is saved via `../scripts/dist/memory/generate-context.js`, never manual file creation.
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:28:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:56:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:60:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:64:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:69:      SELECT id, tenant_id, user_id, session_id
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:91:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:95:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, agent_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:100:      SELECT id, tenant_id, user_id, agent_id, session_id
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/023-epistemic-baseline-capture-task-preflight.md:2:title: "EX-023 -- Epistemic baseline capture (task_preflight)"
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/023-epistemic-baseline-capture-task-preflight.md:3:description: "This scenario validates Epistemic baseline capture (task_preflight) for `EX-023`. It focuses on Pre-task baseline logging."
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/023-epistemic-baseline-capture-task-preflight.md:6:# EX-023 -- Epistemic baseline capture (task_preflight)
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/023-epistemic-baseline-capture-task-preflight.md:10:This scenario validates Epistemic baseline capture (task_preflight) for `EX-023`. It focuses on Pre-task baseline logging.
.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/023-epistemic-baseline-capture-task-preflight.md:29:| EX-023 | Epistemic baseline capture (task_preflight) | Pre-task baseline logging | `Create preflight for pipeline-v2-audit. Capture the evidence needed to prove Baseline record created. Return a concise user-facing pass/fail verdict with the main reason.` | `task_preflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)` | Baseline record created | Preflight output | PASS if baseline persisted | Retry with complete fields |
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md:18:Instrumentation wiring is present in the retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:12:  delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:84:      delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:97:      delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:129:      delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:143:      delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/10-schema-compatibility-validation.md:18:`validateBackwardCompatibility()` performs a non-throwing readiness check against an already-open database connection. The helper treats `memory_index` and `schema_version` as hard requirements and validates that `memory_index` still exposes the core columns the current runtime expects (`id`, `spec_folder`, `file_path`, `importance_tier`, `context_type`, `session_id`, `created_at`, `updated_at`).
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:15:    session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:27:    session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:35:  const row = db.prepare('SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:93:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:98:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:104:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:112:        SELECT session_id
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:114:        ORDER BY session_id ASC
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:115:      `).all() as Array<{ session_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:116:      const remainingSessionIds = remainingRows.map(row => row.session_id);
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:3:description: "Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the shipped JSON-primary save path for `generate-context.js`, continued positional JSON file support on the same structured path, and the associated quality gates, sufficiency enforcement, and template-contract validation."
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:20:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`:
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:51:18. `generate-context.js` diagnostic scores now reflect insufficiency explicitly instead of letting thin memories look healthy.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:55:22. Structured JSON mode accepts both `generate-context.js --stdin` and `generate-context.js --json <string>` as the preferred AI-composed save paths.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:83:   - `collect-session-data.ts` guards SUMMARY derivation against error text in the `learning` field
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:108:- After normalization, `generate-context.js` evaluates one shared semantic sufficiency snapshot before writing or indexing.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:124:- `generate-context.js --stdin` reads structured JSON from stdin and routes it through the same workflow contract as file input.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:125:- `generate-context.js --json <string>` does the same for inline structured JSON payloads.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:176:| `scripts/memory/generate-context.ts` | CLI entrypoint; `--stdin`, `--json`, and positional JSON file input all resolve through the structured-input contract |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:180:| `shared/parsing/memory-sufficiency.ts` | Shared semantic sufficiency evaluator used by `generate-context.js` and `memory_save` |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:183:| `scripts/extractors/collect-session-data.ts` | Template-field assembly, completion-status recovery, and structured summary preservation |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:213:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage plus `--stdin`, `--json`, and positional JSON file-input structured-path behavior |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:227:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:232:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:263:9. `generate-context.js --stdin` with structured JSON, explicit CLI target precedence, and preserved `toolCalls` / `exchanges`.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:264:10. `generate-context.js --json <string>` with payload-target fallback when no explicit CLI override exists and file-backed JSON authority preserved.
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:75:    it('T209-5: setAttentionScore called with (session_id, match.memoryId, score)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:48:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:84:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:213:          if (normalizedSql === "UPDATE session_state SET status = 'completed', updated_at = ? WHERE session_id = ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:237:          if (normalizedSql === "UPDATE session_state SET status = 'active', updated_at = ? WHERE session_id = ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:256:          if (normalizedSql === 'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:261:          if (normalizedSql === 'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:265:          if (normalizedSql === 'SELECT session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, tenant_id, user_id, agent_id, created_at, updated_at FROM session_state WHERE session_id = ?') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:270:          if (normalizedSql === 'SELECT tenant_id, user_id, agent_id FROM session_state WHERE session_id = ? LIMIT 1') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:290:          if (normalizedSql === 'SELECT session_id, spec_folder, current_task, last_action, context_summary, pending_work, updated_at, tenant_id, user_id, agent_id FROM session_state WHERE status = \'interrupted\' ORDER BY updated_at DESC') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:295:                session_id: row.session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:424:        session_id: 'session-state-save',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:580:        'session_id',
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:252:### EX-001 | Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:258:Prompt: `Use memory_context in resume mode for: fix flaky index scan retry logic. Reuse a real sessionId with prompt-context history. Capture the evidence needed to prove Relevant bounded context returned; auto-resume systemPromptContext is injected before budget enforcement; final response stays within the advertised token budget. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:284:### EX-003 | Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:576:### EX-023 | Epistemic baseline capture (task_preflight)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:590:### EX-024 | Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1316:Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1318:description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2700:Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2703:Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2801:Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2854:Verify the structured JSON summary contract for `generate-context.js`, including `toolCalls`/`exchanges` fields, file-backed JSON authority, and Wave 2 hardening.
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2857:Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a concise user-facing pass/fail verdict.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2871:Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2885:Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3469:| EX-001 | Existing Features | Unified context retrieval (memory_context) | [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md) | [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3471:| EX-003 | Existing Features | Trigger phrase matching (memory_match_triggers) | [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md) | [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3491:| EX-023 | Existing Features | Epistemic baseline capture (task_preflight) | [EX-023](06--analysis/023-epistemic-baseline-capture-task-preflight.md) | [06--analysis/05-epistemic-baseline-capture-taskpreflight.md](../feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3492:| EX-024 | Existing Features | Post-task learning measurement (task_postflight) | [EX-024](06--analysis/024-post-task-learning-measurement-task-postflight.md) | [06--analysis/06-post-task-learning-measurement-taskpostflight.md](../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3747:| 264 | Context Preservation | Query-intent routing in memory_context | [264](22--context-preservation-and-code-graph/264-query-intent-routing.md) | [22--context-preservation-and-code-graph/19-query-intent-routing.md](../feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md) |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:19:Phase 017 established the JSON-primary deprecation posture for `generate-context.js`. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract, while positional JSON file input remains functional on the same structured-input path.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:30:2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented and preferred routine-save paths for AI-composed structured input.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:69:| `scripts/memory/generate-context.ts` | CLI argument parsing for `--json`, `--stdin`, and positional JSON file input |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:79:| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, explicit CLI target authority, and positional JSON file support |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:80:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Invalid inline JSON and missing-target failures for structured-input modes |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:87:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md:37:The other two advertised classes are only partially live today. `heal-session-ambiguity.sh` now exits immediately with a deprecation notice saying session ambiguity moved into the memory-save pipeline via `generate-context.js`. Its older deterministic implementation is still retained below the early exit for reference, but it is not reachable in normal execution. `heal-telemetry-drift.sh` still parses options and applies the shared retry contract, but the current main flow exits with an error saying the telemetry drift runner was removed and a supported schema-doc parity workflow must be wired back in before use.
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:11:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:17:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:49:      INSERT INTO working_memory (session_id, memory_id, attention_score)
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:74:      INSERT INTO working_memory (session_id, memory_id, attention_score)
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:3:description: "Structured JSON summary support for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening for decision confidence, truncated titles, git_changed_file_count stability, and template count preservation."
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:29:1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:139:| `scripts/extractors/collect-session-data.ts` | Wave 2 count, confidence, and outcome handling |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:148:| `scripts/memory/generate-context.ts` | CLI help text and structured-first save workflow documentation |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:156:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Structured-input precedence for `--stdin` and `--json` |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:174:- `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/generate-context-cli-authority.vitest.ts tests/input-normalizer-unit.vitest.ts tests/post-save-review.vitest.ts tests/project-phase-e2e.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/template-mustache-sections.vitest.ts tests/trigger-phrase-filter.vitest.ts tests/validation-v13-v14-v12.vitest.ts tests/workflow-e2e.vitest.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md:18:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`: auto-resume `systemPromptContext` items are injected before `enforceTokenBudget()` runs, so both `meta.tokenCount` and the delivered payload stay aligned with the final serialized envelope returned to callers.
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:2:// - T124 uses collect-session-data extractor
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:34:  const collectSessionDataPath = path.join(__dirname, '../../scripts/dist/extractors/collect-session-data.js');
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:871:        session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:914:        session_id: null,
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/028-1-search-pipeline-features-speckit.md:29:| EX-028 | 1. Search Pipeline Features (SPECKIT_*) | Flag catalog verification with inert and retired surface cleanup | `List SPECKIT search-pipeline flags as active, inert compatibility shims, or retired. Capture the evidence needed to prove active flags stay separated from inert compatibility shims such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING, and that retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not presented as active manual-test scenarios. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 })` -> `memory_context({ input: "Classify live search-pipeline flags versus inert compatibility shims and retired topics", mode: "deep", sessionId: "ex028" })` | Accurate active/inert/retired classification; retired topics absent from active manual-test guidance | Search/context outputs + catalog cross-check notes | PASS if classifications are internally consistent and retired topics are not framed as active checks | Validate against code/config docs; remove any manual-test wording that still treats retired topics as live search-pipeline behavior |
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:3:description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, while `memory_context` still carries a dead `profile` declaration."
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:10:Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring is still partial: `memory_search` applies them while `memory_context` still carries a dead `profile` declaration.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:12:Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, but the live integration is incomplete: `memory_search` can apply response profiles, while `memory_context` only declares `profile?: string` and never consumes it. When the flag is off, the original full response is returned unchanged.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:26:Runtime wiring is partial: `memory_search` applies the formatter, `memory_context` now accepts the same `profile` parameter at the schema level, but `memory_context` still declares `profile?: string` without using it. In practice, the context-side profile path remains dead code until the handler consumes it.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:42:| `mcp_server/tool-schemas.ts` | Schema | Public tool schemas now expose `profile` for `memory_context` and `memory_search` |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:40:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:41:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:42:      { id: 3, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:55:      { tenant_id: 'a', user_id: 'u1', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:56:      { tenant_id: 'b', user_id: 'u2', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:66:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:67:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:82:        session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:110:  it('persists session_id as a queryable governance post-insert column', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:125:      session_id: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:127:    expect(ALLOWED_POST_INSERT_COLUMNS.has('session_id')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:137:        session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:202:        session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:232:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:233:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:234:      { id: 3, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:235:      { id: 4, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:45:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:88:      SELECT session_id, memory_id, attention_score, source_tool, source_call_id, extraction_rule_id, redaction_applied
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/031-4-memory-and-storage.md:29:| EX-031 | 4. Memory and Storage | Storage precedence check | `Explain DB path precedence env vars. Capture the evidence needed to prove Precedence chain identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 })` -> `memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })` | Precedence chain identified | Search/context output | PASS if precedence is unambiguous | Cross-check shared config loader and vector-index store override path |
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:175:    SESSION_ID: sessionId,
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:242:    SOURCE_SESSION_ID: '',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:50:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:93:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:235:        SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:265:        SELECT session_id FROM session_sent_memories ORDER BY session_id
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:266:      `).all() as Array<{ session_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:268:      const sessions: Set<string> = new Set(entries.map((e) => e.session_id));
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:129:    session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:238:         total_results_shown, session_id, notes)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:281:             selected_rank, total_results_shown, session_id, notes,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:295:      session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:309:        sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:16:      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:23:      'SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:30:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:143:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(deleteSessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:148:        WHERE session_id = ? AND attention_score < ?
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md:20:The save-path dedup path is now hardened around the same canonicalization principle. Instead of a single `(canonical_file_path = ? OR file_path = ?)` lookup, same-path detection performs two direct probes and keeps the newest parent-memory match. The supporting schema now includes parent-only partial indexes for the hot save-path and content-hash checks: `idx_save_parent_canonical_path` on `(spec_folder, canonical_file_path, id DESC)` and `idx_save_parent_content_hash_scope` on `(spec_folder, content_hash, embedding_status, tenant_id, user_id, agent_id, session_id, shared_space_id, id DESC) WHERE parent_id IS NULL`. Together, they remove nullable OR predicates from the save path and keep dedup lookups targeted to top-level memory rows.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1100:      "expectedResultDescription": "Should surface the Learning Index formula (LI = KnowledgeDelta×0.4 + UncertaintyReduction×0.35 + ContextImprovement×0.25) from CLAUDE.md or memory_task_preflight tool documentation.",
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:123:      claude_session_id: 'analytics-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:124:      speckit_session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:59:    it('T531-3: session_id parameter accepted by triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:64:            session_id: 'dedup-session-003',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:70:        // Session_id should not be the cause of error
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:71:        expect(getErrorMessage(error)).not.toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:57:      WHERE session_id = 's1'
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:76:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:81:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:88:    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s2', 3) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:100:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:104:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:108:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:118:      WHERE session_id = 's5'
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:135:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:139:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:145:    const deleted = db.prepare('SELECT COUNT(*) AS count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 5) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:150:    const floored = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 6) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:161:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:167:    const wrapped = db.prepare('SELECT event_counter, mention_count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 7) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:175:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:181:    const decayed = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 8) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:193:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:207:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:214:    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s-disabled', 13) as {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:3:description: "Outsourced agent memory capture keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization."
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:10:Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:59:| `/memory:search` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:64:| `/spec_kit:resume` | Continue or recover prior work (primary chain uses 3 shared tools, with extra helpers behind the scenes) | `memory_context`, `memory_search`, `memory_list` plus `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and health, indexing, validation, checkpoint, and CocoIndex helpers in the wrapper |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:72:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:86:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:116:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:252:### Epistemic baseline capture (task_preflight)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:256:### Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:972:After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item. The same rule now applies when resume context is attached in `memory_context`: add the extra context first, then enforce the size limit.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:22:        session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:28:      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:32:      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:36:      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:53:      WHERE spec_folder = ? AND task_id = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:59:      WHERE spec_folder = ? AND task_id = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:143:      WHERE spec_folder = ? AND task_id = ? AND session_id = ? AND phase = 'complete'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:176:          'session_id: "atomic-save-fi"',
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:24:      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:31:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:145:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:159:        'SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:205:          session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:211:          UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:215:        INSERT INTO working_memory (session_id, memory_id, attention_score, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:229:        WHERE session_id = 'legacy-session' AND memory_id = 1
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:39:      session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:142:            session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:148:            UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:186:            session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:192:            UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:203:          INSERT INTO working_memory (session_id, memory_id, attention_score)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:213:          WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:331:    session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:389:        session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:397:      WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:460:        if (sql.includes('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ? AND memory_id = ?')) {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:491:        WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:533:        WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:132:    "SELECT COUNT(*) AS value FROM memory_index WHERE session_id IS NULL OR TRIM(session_id) = ''",
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md:29:| 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | Verify shadow-only implicit feedback event ledger records 5 event types | `Test the default-on SPECKIT_IMPLICIT_FEEDBACK_LOG behavior. Trigger all 5 feedback event types and verify confidence tier assignment. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_IMPLICIT_FEEDBACK_LOG` is unset or `true` 2) `memory_search({ query: "test query" })` — triggers search_shown 3) Cite a result — triggers result_cited 4) Reformulate query — triggers query_reformulated 5) Re-search same topic — triggers same_topic_requery 6) Use follow-on tool — triggers follow_on_tool_use 7) Query feedback ledger for recorded events 8) Verify shadow-only (no ranking changes) | isImplicitFeedbackLogEnabled() returns true; 5 event types stored with type/memory_id/query_id/confidence/timestamp/session_id; resolveConfidence() maps: result_cited→strong, follow_on_tool_use→strong, query_reformulated→medium, search_shown→weak, same_topic_requery→weak; shadow-only | Feedback ledger query results + event type/confidence pairs + ranking comparison (before/after) + test transcript | PASS if all 5 event types recorded with correct confidence tiers and no ranking side effects; FAIL if event types missing, confidence tiers wrong, or events influence rankings | Verify isImplicitFeedbackLogEnabled() → Confirm flag is not forced off → Check feedback-ledger.ts schema creation → Inspect resolveConfidence() tier mapping → Verify shadow-only constraint (no ranking integration) |
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:89:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:101:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:114:      session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:146:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:153:      session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:166:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:170:      PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:215:      session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:263:      session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:301:      id, session_id, memory_id, attention_score, added_at, last_focused, focus_count,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:323:      id, timestamp, mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:357:    INSERT INTO session_learning (id, session_id, memory_id, insight, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:363:      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:385:      session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:390:    INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md:81:| `scripts/memory/generate-context.ts` | Script | CLI entrypoint; delegates save workflow to `workflow.ts` |
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:25:  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:19:- Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:20:- Expected signals: description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:29:| 042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Corrupt description.json with invalid JSON and schema-invalid field types → run generateFolderDescriptions() and verify spec.md fallback plus repaired description.json 6) Verify missing description.json falls back to spec.md without forcing a write 7) Attempt generation against an out-of-base or prefix-bypass path → verify rejection and no file written 8) Use spec.md with large YAML frontmatter and CRLF-heavy line endings → verify extracted description comes from post-frontmatter content 9) Run memory_context query → verify short-circuit folder routing | description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files | description.json content + stale detection output + folder routing trace in memory_context + recovery evidence for corrupt/schema-invalid description.json files + missing-file fallback evidence + rejection evidence for traversal attempts + proof of valid regenerated JSON with no leftover temp files | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails | Verify create.sh generates description.json → Check stale detection mtime comparison → Inspect generateFolderDescriptions preference logic and repair path → Confirm missing-file fallback does not backfill unexpectedly → Verify realpath containment rejects traversal/prefix-bypass paths → Confirm frontmatter stripping happens before description extraction → Verify memory_context folder routing |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/22-implicit-feedback-log.md:26:`memory-search.ts` emits `search_shown` for returned hits, emits `result_cited` when `includeContent: true` embeds result content, and delegates query reformulation / same-topic requery detection to `query-flow-tracker.ts`. `context-server.ts` emits `follow_on_tool_use` after successful non-search tool dispatches that occur inside the follow-on window. Each event is stored with `type`, `memory_id`, `query_id`, `confidence`, `timestamp`, and optional `session_id`. The `resolveConfidence()` function infers the confidence tier from the event type when not explicitly provided.
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:113:          session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:33:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:33:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:44:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:106:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:116:    CREATE INDEX IF NOT EXISTS idx_consumption_log_session_id
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:117:      ON consumption_log (session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:148:         session_id, timestamp, latency_ms, spec_folder_filter, metadata)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:157:      event.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:197:    if (options.session_id) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:198:      conditions.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:199:      params.push(options.session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:239:    // Unique sessions (add session_id IS NOT NULL to existing conditions)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:240:    const sessionConditions = [...conditions, 'session_id IS NOT NULL'];
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:243:      SELECT COUNT(DISTINCT session_id) as cnt
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:407:        SELECT session_id, COUNT(*) as query_count
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:409:        WHERE session_id IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:410:        GROUP BY session_id
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:414:      `).all(exampleLimit) as Array<{ session_id: string; query_count: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:421:          const sid = r.session_id.length > 36 ? r.session_id.substring(0, 36) + '...' : r.session_id;
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md:22:The working-memory schema now adds two session-local performance indexes: `idx_wm_session_focus_lru` on `(session_id, last_focused ASC, id ASC)` for deterministic least-recently-focused eviction and `idx_wm_session_attention_focus` on `(session_id, attention_score DESC, last_focused DESC)` for attention-ordered reads. `upsertExtractedEntry()` also no longer performs a pre-upsert existence probe before writing. It relies on a single `INSERT ... ON CONFLICT(session_id, memory_id) DO UPDATE` statement, then checks the resulting row state to decide whether the capacity limiter should run only for newly inserted entries.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:18:Captured-session `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:15:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:21:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:78:        session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:84:        UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:120:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:125:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:148:      expect(entry.session_id).toBe('session-alpha');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:176:      expect(entry1.session_id).toBe('session-alpha');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:186:        INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:195:        "SELECT * FROM working_memory WHERE session_id = 'session-beta'"
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:57:| `/memory:search` | 13 | owns | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:62:| `/spec_kit:resume` | broader helper surface | shared | Primary recovery chain: `memory_context`, `memory_search`, `memory_list`; wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:70:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:78:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:136:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:146:A governed-scope pass now runs immediately after raw trigger matching. `memory_match_triggers` accepts optional `tenantId`, `userId`, `agentId`, and `sharedSpaceId` boundaries, then looks up each match in `memory_index` and drops out-of-scope rows before cognitive enrichment begins. That closes the trigger-phrase leak where another tenant or actor's memory could surface before normal retrieval filtering kicked in.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:288:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command reconstructs the most likely previous session state and routes the user to the best next step. It uses `memory_context` in resume mode as the primary interrupted-session recovery path, with a fallback chain through crash-recovery breadcrumbs, anchored memory search, and recent-candidate discovery.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:292:**SHIPPED.** `/spec_kit:resume` owns session recovery and continuation. Its primary recovery chain relies on 3 shared memory tools: `memory_context`, `memory_search`, and `memory_list`. `memory_stats` remains diagnostic/helper access, and the live wrapper also permits `memory_match_triggers`, `memory_delete`, `memory_update`, health, indexing, validation, checkpoint, and CocoIndex helpers that support the broader recovery workflow.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:294:The primary recovery path calls `memory_context` in `resume` mode with anchors targeting `state`, `next-steps`, `summary`, and `blockers`. Resume mode uses a 1200-token budget with `minState=WARM`, `includeContent=true`, dedup and decay both disabled.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:298:The recovery chain prioritizes: (1) fresh `handover.md` when present, (2) `memory_context` in resume mode, (3) `CONTINUE_SESSION.md` crash breadcrumb, (4) anchored `memory_search` for thin summaries, (5) `memory_list` for recent-candidate discovery, and (6) user confirmation as final fallback.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:881:### Epistemic baseline capture (task_preflight)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:901:### Post-task learning measurement (task_postflight)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1211:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1327:Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to rollout policy via `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1417:- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2516:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2822:Stateless `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2871:Enabled by default (graduated). Set `SPECKIT_IMPLICIT_FEEDBACK_LOG=false` to disable. The feedback ledger module records five event types with a three-tier confidence hierarchy: strong (result_cited, follow_on_tool_use), medium (query_reformulated), and weak (search_shown, same_topic_requery). Each event is stored with type, memory_id, query_id, confidence, timestamp, and optional session_id. Shadow-only: no ranking influence.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3765:Phase 016 added structured JSON summary support to `generate-context.js`, including `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3783:Phase 017 established the JSON-only save contract for `generate-context.js`. Dynamic session capture proved unreliable and has been removed. `--json` and `--stdin` are now the sole save paths.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3827:`validateBackwardCompatibility()` performs a non-throwing readiness check against an already-open database connection. The helper treats `memory_index` and `schema_version` as hard requirements and validates that `memory_index` still exposes the core columns the current runtime expects (`id`, `spec_folder`, `file_path`, `importance_tier`, `context_type`, `session_id`, `created_at`, `updated_at`).
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3879:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`: (1) Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits; (2) spec-folder and git context enrichment for JSON-mode saves; (3) numeric quality-score calibration so thin saves score lower than rich ones; (4) one shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing; (5) one shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index; (6) a fully refreshed canonical verification and manual-testing record; (7) JSON-only routine-save contract; (8) Wave 2 count/confidence hardening for decision confidence, truncated outcomes, and stable `git_changed_file_count` priority.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4188:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`, where auto-resume `systemPromptContext` injection happens before `enforceTokenBudget()`. This keeps `meta.tokenCount` and the delivered payload aligned with the exact serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4284:Four profiles are implemented: quick (topResult + oneLineWhy + omittedCount + tokenReduction), research (results + evidenceDigest + followUps), resume (state + nextSteps + blockers), and debug (full trace + tokenStats). Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON, set `SPECKIT_RESPONSE_PROFILE_V1=false` to disable. Runtime wiring is active on both `memory_search` and `memory_context`, with explicit profile selection and intent-to-profile auto-routing when a profile is not provided.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4478:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4486:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:46:        'handle_task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:47:        'handle_task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:154:          session_id TEXT,
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:27:  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:31:- Evidence: agent stdout with memory section + generate-context output + search result showing saved memory.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:33:- Fail triage: Check memory epilogue in prompt template → Verify generate-context.js JSON mode input → Inspect agent stdout for structured section → Verify index scan ran post-save.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:37:2. Run: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:42:2. Run generate-context.js with the JSON file
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:105:- `memory_match_triggers()` is unaffected by new code
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:179:      'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:180:      'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'task_preflight', 'task_postflight', 'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1127:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1153:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1160:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1173:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1610:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1615:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1712:    const nonAwareTools = ['memory_delete', 'checkpoint_create', 'task_preflight']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2080:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2094:      'task_preflight': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2095:      'task_postflight': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:26:When trace is enabled, result envelopes now expose richer bounded Markovian diagnostics without altering the non-trace contract: `trace.graphContribution` includes `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`, and requests forwarded from `memory_context` can also include `trace.sessionTransition`. Extended telemetry summarizes the same behavior through `transitionDiagnostics` and `graphWalkDiagnostics`.
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:8:// (no {{SESSION_ID}} or {{SPEC_FOLDER}} in anchor names)
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:92:    it('S01: NO anchor contains {{SESSION_ID}}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:97:        expect(anchor).not.toContain('{{SESSION_ID}}');
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md:18:The PreCompact hook runs as an external Node.js process triggered by Claude Code. It reads stdin JSON (session_id, transcript_path, trigger), tails the last 50 lines of the transcript JSONL, extracts file paths and spec folder references, builds a context string, truncates to COMPACTION_TOKEN_BUDGET (4000 tokens), and stores the payload in hook state at `${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json`. Stdout is NOT injected on PreCompact events — caching only.
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:129:        task_preflight: 'L6',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:130:        task_postflight: 'L6',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:179:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:206:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:214:        { tool: 'task_preflight', desc: 'Capture baseline', prefix: '[L6:Analysis]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:237:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:255:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:265:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:272:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:276:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:277:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:415:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:2:title: "Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:6:# Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:69:- Source feature title: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:204:session_id: "pipeline-enforcement-fixture"
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:10:This scenario validates the POST-SAVE QUALITY REVIEW hook that fires after a JSON mode `generate-context.js` save. It confirms that a fully-populated payload produces a PASSED review with 0 issues, that field-level mismatches (generic titles, path-fragment triggers, mismatched importance_tier, zero decision_count) are surfaced with severity-graded instructions, and that the AI can follow the emitted fix instructions to bring frontmatter into alignment with the payload.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:16:Operators invoke `generate-context.js --json` with controlled payloads and inspect the POST-SAVE QUALITY REVIEW block in stdout as well as the rendered frontmatter of the produced memory file.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:19:- Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:29:| 155 | Post-save quality review | JSON mode save with all fields populated correctly | `Run generate-context.js --json with a complete payload containing a meaningful sessionSummary, explicit triggerPhrases, at least 2 keyDecisions, importanceTier="important", and contextType="implementation". Confirm the POST-SAVE QUALITY REVIEW block reports PASSED with 0 issues.` | 1) Compose full JSON payload: `sessionSummary` = descriptive title, `triggerPhrases` = keyword array, `keyDecisions` = 2+ items, `importanceTier` = "important", `contextType` = "implementation" 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert status = PASSED and issues = 0 | `POST-SAVE QUALITY REVIEW -- PASSED` with 0 issues | CLI stdout REVIEW block | PASS if REVIEW shows PASSED and 0 issues; FAIL if any issue is reported for a fully valid payload | Check `scripts/core/post-save-review.ts` for false-positive conditions |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:30:| 155 | Post-save quality review | JSON mode save with generic title | `Run generate-context.js --json where the pipeline produces a generic title instead of a meaningful one. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] title issue with a fix instruction referencing the sessionSummary field.` | 1) Compose payload that would yield a generic title 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert a `[HIGH]` issue is reported for the title field 6) Assert a fix instruction is present | `[HIGH]` severity issue for title; fix instruction references `sessionSummary` | CLI stdout REVIEW block | PASS if HIGH title issue reported with fix; FAIL if no issue or wrong severity | Inspect title-quality check in `scripts/core/post-save-review.ts` and the generic-title detection list |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:31:| 155 | Post-save quality review | JSON mode save with path fragment triggers | `Run generate-context.js --json where triggerPhrases are provided but the pipeline generates path-fragment values instead. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] trigger_phrases issue with a fix instruction.` | 1) Compose payload with `triggerPhrases` = ["auth refactor"] but arrange for heuristic override 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Assert a `[HIGH]` issue for `trigger_phrases` containing path fragments | `[HIGH]` severity issue for trigger_phrases; fix instruction present | CLI stdout REVIEW block | PASS if HIGH trigger_phrases issue reported; FAIL if path fragments pass undetected | Check path-fragment detection regex in `scripts/core/post-save-review.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:32:| 155 | Post-save quality review | JSON mode save with mismatched importance_tier | `Run generate-context.js --json with importanceTier="important" in the payload but where the pipeline outputs "normal" in the rendered frontmatter. Confirm the POST-SAVE QUALITY REVIEW block reports a [MEDIUM] importance_tier mismatch.` | 1) Compose payload with `importanceTier` = "important" 2) Force or simulate a pipeline override to "normal" 3) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 4) Capture stdout 5) Assert a `[MEDIUM]` issue for `importance_tier` | `[MEDIUM]` severity issue for importance_tier; expected vs actual values shown | CLI stdout REVIEW block | PASS if MEDIUM importance_tier issue reported; FAIL if mismatch goes unreported | Inspect importance_tier comparison in `scripts/core/post-save-review.ts` and input-normalizer passthrough |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:33:| 155 | Post-save quality review | JSON mode save with 0 decisions when payload has keyDecisions | `Run generate-context.js --json with 2 keyDecisions in the payload but where the rendered memory metadata has decision_count=0. Confirm the POST-SAVE QUALITY REVIEW block reports a [MEDIUM] decision_count issue.` | 1) Compose payload with `keyDecisions` = ["Decision A", "Decision B"] 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Assert a `[MEDIUM]` issue for `decision_count` = 0 despite non-empty payload | `[MEDIUM]` severity issue for decision_count; notes expected count from payload | CLI stdout REVIEW block | PASS if MEDIUM decision_count issue reported; FAIL if zero count is not detected | Check decision counting in `scripts/extractors/collect-session-data.ts` and the metadata-block parser in `scripts/core/post-save-review.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:35:| 155-F | Post-save quality review | Score penalty advisory logging | `Run generate-context.js --json with a payload designed to trigger at least one HIGH post-save review issue. Confirm the CLI stdout includes a "Post-save review: quality_score penalty" log line with the computed penalty value.` | 1) Compose payload that produces a generic title (triggers HIGH issue) 2) Run generate-context.js --json 3) Capture stdout 4) Locate "Post-save review: quality_score penalty" log line 5) Assert penalty value is negative (e.g., -0.10) | "Post-save review: quality_score penalty" present in stdout with negative value | CLI stdout | PASS if penalty log line present with correct value; FAIL if no penalty log despite HIGH issue | Check computeReviewScorePenalty in post-save-review.ts and advisory logging in workflow.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:46:- CLI surface: `scripts/memory/generate-context.ts`
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:16:**SHIPPED.** `/spec_kit:resume` owns both standard continuation and interrupted-session recovery. Its primary recovery chain uses 3 shared memory tools, while the live wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:18:- **`memory_context`** (from `/memory:search`) -- Called in `resume` mode as the primary interrupted-session recovery path whenever no fresh `handover.md` already provides enough state. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:19:- **`memory_search`** (from `/memory:search`) -- Fallback for thin summaries when `memory_context` resolves the right folder but does not return enough state detail. Uses the same resume anchors.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:22:`memory_stats` remains diagnostic/helper access on the wrapper rather than part of the primary recovery chain. Additional helper access includes `memory_match_triggers()` for early session detection, `memory_delete`, `memory_update`, health, indexing, checkpoint, validation, and CocoIndex support surfaces.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:34:| 2 | `memory_context(mode: "resume")` | Primary interrupted-session recovery path |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:59:const MEMORY_CONTEXT_SOURCE = fs.readFileSync(
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:386:    expect(MEMORY_CONTEXT_SOURCE).toContain('options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:387:    expect(MEMORY_CONTEXT_SOURCE).not.toContain('sessionLifecycle.transition');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:429:    expect(MEMORY_CONTEXT_SOURCE).toMatch(/mode:\s*requested_mode\s*=\s*'auto'/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:430:    expect(MEMORY_CONTEXT_SOURCE).not.toMatch(/mode:\s*requested_mode\s*=\s*'quick'/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:653:    expect(MEMORY_CONTEXT_SOURCE).toMatch(/mode:\s*requested_mode\s*=\s*'auto'/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:654:    expect(MEMORY_CONTEXT_SOURCE).toContain('requestedMode: requested_mode');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:156:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:173:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:185:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:201:      session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:217:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:221:      PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:270:      session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:278:      session_id, status, spec_folder, current_task, tenant_id, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:291:  database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task-a', 'session-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:292:  database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task-b', 'session-b');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:623:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:628:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:632:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:647:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:651:      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task', 'session-test');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:652:      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('other-live-task', 'session-other');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:655:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:671:        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(1)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:672:      ).toEqual({ session_id: 'session-test', attention_score: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:674:        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(2)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:675:      ).toEqual({ session_id: 'session-other', attention_score: 8 });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:677:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-test')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:680:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-other')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:705:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:710:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:714:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:723:      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task', 'session-test');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:726:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:735:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:740:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:744:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:762:        (database.prepare('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:765:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-test')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:768:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-extra')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:774:        (database.prepare('SELECT COUNT(*) as cnt FROM session_sent_memories WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:888:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:891:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-b')
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:12:The memory-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:54:      session_id,
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:2:title: "Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:6:# Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:18:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:28:When `includeTrace` is enabled, `memory_context` also computes a trace-only `sessionTransition` payload and forwards it through the internal `memory_search` path. The contract is `trace.sessionTransition = { previousState, currentState, confidence, signalSources, reason? }`. Cold starts use `previousState: null`, the payload is omitted when trace is disabled, and this inference does not change retrieval routing beyond the existing mode-selection path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:76:- Source feature title: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:68:        session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:100:    database.prepare('INSERT INTO session_state (session_id, spec_folder) VALUES (?, ?)').run('session-1', staleSpecFolder);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:107:    const sessionRow = database.prepare('SELECT spec_folder FROM session_state WHERE session_id = ?').get('session-1') as { spec_folder: string };
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:150:        session_id TEXT,
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:3:description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:10:Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:12:The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:32:| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:33:        task_preflight: 1500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:34:        task_postflight: 1500,
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:82:    `INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at) VALUES (?, ?, ?, ?)`
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:228:        const remaining = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get('other-session') as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:407:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('save-1') as SessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:425:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('save-2') as SessionStateRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:445:        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('complete-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:469:        const row1 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:471:        const row2 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-2') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:514:        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('recover-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:702:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('cp-1') as SessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:725:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('cp-2') as SessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:754:          const count = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get(sid) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:771:          const count = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get(sid) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:797:          'SELECT memory_hash FROM session_sent_memories WHERE session_id = ? ORDER BY sent_at ASC'
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:90:    expect(names).toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:227:    expect(row.session_id).toBe('session-XYZ');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:230:  it('allows null session_id', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:234:    expect(events[0].session_id).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:334:    expect(forSess1[0].session_id).toBe('sess-1');
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:12:All runtimes now have hook or bootstrap-based startup injection. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the tool-based path starting with `session_bootstrap()` on fresh start or after `/clear`. Runtime detection identifies the active runtime and its current hook policy.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:337:      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:422:    clauses.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:538:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:556:    session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:104:    expect(events.every((event) => event.session_id === 'sess-e')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:125:    tool: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:131:    tool: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:65:      // Should not throw an input validation error about session_id/turnNumber.
.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:70:          session_id: 'sess-test-001',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:76:        expect(message).not.toMatch(/session_id/);
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:12:Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:14:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:389:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('old-session', 1, 0.5, '${oldTime}')`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:390:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('fresh-session', 2, 0.8, '${new Date().toISOString()}')`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:395:    const remaining = db.prepare('SELECT session_id, memory_id FROM working_memory').all() as WorkingMemoryRow[];
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:397:    expect(remaining[0].session_id).toBe('fresh-session');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:418:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', 1, 0.9)`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:437:      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, ${score})`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:457:        INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:464:    const remaining = db.prepare('SELECT memory_id FROM working_memory WHERE session_id = ? ORDER BY memory_id').all('s1') as Array<Pick<WorkingMemoryRow, 'memory_id'>>;
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:487:      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, 0.5)`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:489:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 1}, 0.5)`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:490:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 2}, 0.5)`);
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:40:    session_id: 'sess-001',
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:70:    expect(names).toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:82:    expect(entry.session_id).toBe('sess-001');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:180:      session_id: 'sess-merge-1',
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:190:    expect(entry.session_id).toBe('sess-merge-1');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:100:      'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:101:      'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:35:          session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:66:            session_id,
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:12:The memory-surface and response-hints hooks form a passive enrichment pipeline. On every tool call, constitutional memories and trigger-matched memories are surfaced and appended to the response envelope. Code graph status is included when available. Token estimation prevents oversized payloads. The enrichment is additive (appended to hints) and does not modify the primary tool response. This ensures AI runtimes always have access to critical context even when they do not explicitly call memory_context.
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:74:  delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:106:  delete process.env.CLAUDE_SESSION_ID;
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:33:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:50:       session_id, timestamp, latency_ms, spec_folder_filter, metadata)
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:59:    event.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:103:    expect(columnNames).toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:121:  it('T001-D: creates indexes on event_type, session_id, timestamp', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:129:    expect(indexNames).toContain('idx_consumption_log_session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:157:      session_id: 'session-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:169:    expect(row.session_id).toBe('session-abc');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:182:      session_id: 'session-xyz',
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:200:      session_id: 'session-triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:217:      session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:225:    expect(row.session_id).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:318:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-A', result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:319:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-A', result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:320:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-B', result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:423:      forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'heavy-session-001', query_text: `q${i}`, result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:425:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'light-session', query_text: 'only one', result_count: 3 });
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:26:  if (env.CLAUDE_CODE === '1' || env.CLAUDE_SESSION_ID || env.MCP_SERVER_NAME === 'context-server') {
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:3:description: "Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:10:Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:12:When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to CocoIndex for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:38:        session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:39:| 261d | MCP auto-priming | Session-scoped priming isolation | `Validate 261d session-scoped priming isolation` | Call `memory_context({ input: "prime A", sessionId: "prime-session-a" })`; then in a fresh second MCP session call `memory_context({ input: "prime B", sessionId: "prime-session-b" })` | Each session receives its own first-call PrimePackage because priming is tracked per explicit session identity | Two MCP response envelopes showing independent primePackage delivery for session A and session B | PASS if the second session receives its own PrimePackage independently of the first session | Check `hooks/memory-surface.ts` session-scoped priming set and session identity propagation |
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:254:        sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:283:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md:21:- **Prompt**: `Validate 253 Runtime detection behavior. Run the vitest suites for runtime-detection and cross-runtime fallback and confirm all 5 detection scenarios: (1) CLAUDE_CODE=1 or CLAUDE_SESSION_ID or MCP_SERVER_NAME=context-server yields runtime=claude-code, hookPolicy=enabled, (2) CODEX_CLI=1 or CODEX_SANDBOX yields runtime=codex-cli, hookPolicy=unavailable, (3) COPILOT_CLI=1 or GITHUB_COPILOT_TOKEN yields runtime=copilot-cli with hookPolicy=enabled when repo .github/hooks/*.json exposes sessionStart and disabled_by_scope when it does not, (4) GEMINI_CLI=1 or GOOGLE_GENAI_USE_VERTEXAI yields runtime=gemini-cli with hookPolicy driven by .gemini/settings.json, (5) no matching env vars yields runtime=unknown, hookPolicy=unknown.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md:40:| 253a | Runtime detection | Claude Code detected with hookPolicy=enabled and hooks available | `Validate 253a claude-code detection` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | `CLAUDE_CODE=1` yields `{ runtime: 'claude-code', hookPolicy: 'enabled' }`, `areHooksAvailable()` returns true, `getRecoveryApproach()` returns 'hooks' | Test output showing detection and helper results | PASS if claude-code identified with enabled hooks | Check env var checks: CLAUDE_CODE, CLAUDE_SESSION_ID, MCP_SERVER_NAME |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:3:description: "This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:10:This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:18:- Objective: Verify `memory_context` emits trace-only session transitions with no non-trace leakage
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:19:- Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:29:| 142 | Session transition trace contract | Verify `memory_context` emits trace-only session transitions with no non-trace leakage | `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true })` 2) Verify each result exposes `trace.sessionTransition.previousState`, `currentState`, `confidence`, and ordered `signalSources` 3) Repeat without `includeTrace` and verify `sessionTransition` is absent 4) Confirm the non-trace response does not expose transition data in top-level metadata | Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled | Two `memory_context` outputs with and without `includeTrace` + field-level comparison | PASS if trace-only gating holds and the contract fields are present only in the traced call | Inspect `handlers/memory-context.ts`, `handlers/memory-search.ts`, and `lib/search/session-transition.ts` if fields leak or ordering drifts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:27:- Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:37:| 154 | JSON-primary deprecation posture | Verify JSON-only save contract | `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` → expect non-zero exit with migration message | Path 1: exit 0, Path 2: non-zero with guidance | CLI exit codes and stdout/stderr output | PASS if both paths match documented behavior | Check generate-context.ts argument parsing and migration guidance text |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:20:- **Prompt**: `Validate 266 Context metrics. Make several tool calls and check quality scoring: (1) call memory_stats to register a tool_call event, (2) call session_health and verify recency factor is close to 1.0, (3) call memory_context with mode=resume to register memory_recovery, (4) call session_health and verify recovery factor is 1.0, (5) verify composite score maps to correct quality level.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:38:| 266b | Context preservation metrics | Memory recovery tracked and factor updated | `Validate 266b recovery tracking` | Call `memory_context({ mode: "resume" })` then `session_health({})` | recovery factor === 1.0 | session_health response qualityScore.factors.recovery | PASS if recovery factor is 1.0 after resume call | Check memory_recovery event recording and factor computation |
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:157:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:171:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:185:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:191:    UNIQUE(spec_folder, loop_type, session_id, iteration)
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:200:  CREATE INDEX IF NOT EXISTS idx_coverage_session ON coverage_nodes(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:206:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_session ON coverage_edges(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:207:  CREATE INDEX IF NOT EXISTS idx_coverage_snapshot_session ON coverage_snapshots(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:266:    parts.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:308:      id, spec_folder, loop_type, session_id, kind, name,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:382:      id, spec_folder, loop_type, session_id, source_id, target_id,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:454:      spec_folder, loop_type, session_id, iteration, metrics, node_count, edge_count
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:457:    ON CONFLICT(spec_folder, loop_type, session_id, iteration) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:474:      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:493:      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:605:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:621:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:636:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:2:title: "EX-003 -- Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:3:description: "This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:6:# EX-003 -- Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:10:This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path plus trigger-cache reload efficiency.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:29:| EX-003 | Trigger phrase matching (memory_match_triggers) | Fast recall path plus trigger-cache reload efficiency | `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment, trigger-cache reload reads from the partial index source (`idx_trigger_cache_source`), and repeated reloads on the same DB connection reuse the prepared loader statement. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` and capture the returned matches 2) In a debug harness or test shell on the same SQLite connection, call `refreshTriggerCache()` or clear+reload the trigger cache twice 3) Capture query-plan, schema, or instrumentation evidence that the reload source is constrained to successful rows with non-empty `trigger_phrases` and backed by `idx_trigger_cache_source` 4) Confirm the second reload on the same DB connection reuses the cached prepared loader statement instead of preparing a new one | Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse | Trigger output + cache-refresh logs or instrumentation + query-plan/schema evidence for `idx_trigger_cache_source` | PASS if matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection. FAIL if trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement. | Retry with higher-quality trigger phrase -> inspect trigger-cache clear/reload instrumentation -> verify `idx_trigger_cache_source` exists and the reload query still filters to successful rows with non-empty trigger phrases |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:32:| Governed shared writes | Shared memory does not have a separate write handler. The actual content write path is `memory_save`. When `sharedSpaceId` is supplied, `memory_save` first runs governed-ingest validation, then calls `assertSharedSpaceAccess(..., 'editor')`. If access passes, the new memory row is written normally and then patched with governance fields including `tenant_id`, `user_id` or `agent_id`, `session_id`, `shared_space_id`, provenance fields, retention policy, and serialized governance metadata. |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:54:| `memory_index` governance columns | Shared writes ultimately live in the normal memory index. Shared visibility depends on governed columns such as `tenant_id`, `user_id`, `agent_id`, `session_id`, `shared_space_id`, `retention_policy`, `delete_after`, and `governance_metadata`. |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:48:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:60:    UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:66:  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:67:  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:69:  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:70:  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:77:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:193:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:208:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:242:      'DELETE FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:262:    ) as Database.Statement).all(nowIso, timeoutSeconds) as Array<{ session_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:267:      sessionModeRegistry.delete(row.session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:286:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:306:      WHERE wm.session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:341:      WHERE wm.session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:395:      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:406:        WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:413:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:451:        session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:461:      ON CONFLICT(session_id, memory_id) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:488:      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:524:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:534:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:573:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:644:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:691:      WHERE session_id = ?
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:29:  - When no cached payload exists, fallback output instructs calling `memory_context({ mode: "resume" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:42:| 249c | SessionStart priming (compact) | Fallback when no cached payload exists | `Validate 249c compact fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout contains "Context Recovery" section instructing `memory_context({ mode: "resume" })` | Test output showing fallback message | PASS if fallback message appears when pendingCompactPrime is null | Verify test fixture simulates missing cache state |
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:497:    ?? (typeof toolArgs.session_id === 'string' ? toolArgs.session_id : null);
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:16:- **Objective**: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`), CocoIndex Code availability status, Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`), and resume instructions. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:21:- **Prompt**: `Validate 250 SessionStart priming (startup) behavior. Run the vitest suite for hook-session-start and confirm: (1) source=startup routes to handleStartup(), (2) stdout contains "Session Priming" section, (3) memory tools listed (memory_context, memory_match_triggers, memory_search), (4) CocoIndex availability checked via checkCocoIndexAvailable(), (5) Code Graph tools listed, (6) resume instructions present, (7) output within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:25:  - Body mentions `memory_context`, `memory_match_triggers`, `memory_search`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:28:  - Resume instruction: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:40:| 250a | SessionStart priming (startup) | Fresh startup outputs Spec Kit Memory tool overview | `Validate 250a startup tool listing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout "Session Priming" section lists `memory_context`, `memory_match_triggers`, `memory_search`, code graph tools | Test output showing tool names in stdout | PASS if all 7+ tools listed in session priming output | Check `session-prime.ts` handleStartup() for expected tool names |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:18:- Objective: Verify `/spec_kit:resume` uses `memory_context` in `resume` mode as the primary interrupted-session recovery path, falls back through `CONTINUE_SESSION.md`, anchored `memory_search()`, and `memory_list()` when needed, supports auto and confirm resume modes, and routes the user to the correct next step after recovery
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:19:- Prompt: `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:20:- Expected signals: `memory_context(mode: "resume")` is the first interrupted-session recovery path after any fresh handover; fallback behavior uses the documented resume anchors and recent-candidate discovery; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:29:| 190 | Session recovery via /spec_kit:resume | Verify `/spec_kit:resume` recovery chain, ambiguity handling, and post-recovery routing | `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/spec_kit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first calls `memory_context` in `resume` mode when fresh handover data is absent or insufficient 2) Confirm resume recovery uses the documented anchors `["state", "next-steps", "summary", "blockers"]`, include-content behavior, and bounded token-budget response 3) If auto-resume is enabled for a reusable working-memory session, verify injected `systemPromptContext` is applied before token-budget enforcement 4) If the primary summary is thin, verify fallback to `CONTINUE_SESSION.md` and then anchored `memory_search()` using the same resume anchors 5) If no clear candidate exists, verify recent-candidate discovery through `memory_list()` 6) Invoke confirm mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives 7) Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/spec_kit:resume` work or `/memory:search history <spec-folder>` depending on user need | `memory_context(mode: "resume")` is primary after fresh handover handling; fallback chain activates correctly; confirm mode shows alternatives when needed; final response contains actionable continuation state and next-step routing | Command transcript; tool invocation logs for resume, search, and list paths; evidence of crash breadcrumb use if present; final recovery summary showing state, next steps, and routing recommendation | PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips resume mode, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable | Verify `/spec_kit:resume` command routing against `.opencode/command/spec_kit/resume.md`; inspect `memory-context.ts` resume-mode wiring; confirm fallback search anchors and candidate-discovery list behavior; check session-manager breadcrumbs and reusable-session auto-resume settings |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/189-tool-result-extraction-to-working-memory.md:29:| 189 | Tool-result extraction to working memory | Verify automatic capture, session continuity, checkpoint preservation, attention decay, and optimized index/upsert behavior | `Validate tool-result extraction to working memory. Capture the evidence needed to prove salient tool outputs are automatically extracted into session-scoped working memory with provenance; follow-up turns can reuse that context; checkpoint restore preserves the extracted entries; attention decay follows the documented event-distance model with bounded mention boosts; the new indexes idx_wm_session_focus_lru and idx_wm_session_attention_focus support eviction and ordered reads; and upsertExtractedEntry() relies on INSERT ... ON CONFLICT without a pre-upsert existence probe. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start a reusable session such as `ex189-session` with the MCP server running so the extraction adapter is initialized through `context-server.ts` 2) Run an eligible retrieval tool call that returns salient results, for example `memory_search({ query: "checkpoint working memory", sessionId: "ex189-session" })`, and capture the tool output 3) Verify the extraction path runs after the tool response, including summary/redaction checks and an `upsertExtractedEntry()` insertion into working memory with provenance fields 4) Capture schema or query-plan evidence that `idx_wm_session_attention_focus` backs attention-ordered session reads and `idx_wm_session_focus_lru` backs least-recently-focused eviction ordering 5) Confirm the extraction write path uses a single `INSERT ... ON CONFLICT(session_id, memory_id) DO UPDATE` without a pre-upsert existence probe such as `SELECT COUNT(*)` 6) In the same session, ask a follow-up question such as `memory_context({ input: "What did the last retrieval find about checkpoint working memory?", mode: "focused", sessionId: "ex189-session" })` and confirm the prior extracted result is available without repeating the original search 7) Create and restore a checkpoint for the same session and verify the extracted working-memory entry remains available after restore 8) Advance several events and repeated mentions, then confirm the attention score follows the documented decay contract: 0.85 per elapsed event, floor 0.05 during decay updates, bounded `MENTION_BOOST_FACTOR = 0.05`, and eviction only once score drops below 0.01 | Automatic extraction runs after eligible tool responses; extracted entries carry provenance; follow-up context reuses the prior result; checkpoint restore retains the entry; attention scoring follows the documented decay, floor, mention boost, and eviction behavior; the new indexes back session reads and LRU eviction; extraction upsert executes without a pre-upsert existence probe | Tool outputs; working-memory or log evidence showing extraction/upsert; schema/query-plan evidence for `idx_wm_session_focus_lru` and `idx_wm_session_attention_focus`; follow-up retrieval transcript; checkpoint save/restore evidence; score traces or diagnostic logs showing decay behavior | PASS: Automatic extraction, cross-turn reuse, checkpoint preservation, attention-scoring behavior, index-backed reads/eviction, and direct `ON CONFLICT` upserts all align. FAIL: extracted entries are missing, unusable across turns, lost on restore, decay/boost behavior contradicts the documented contract, required indexes are absent, or the write path still performs a pre-upsert existence check. | Verify after-tool callback registration in `context-server.ts` -> inspect `extraction-adapter.ts` for summary or redaction gating -> confirm session IDs and memory IDs are stable -> inspect checkpoint restore flow -> review score-clamp and eviction handling in working-memory decay logic -> confirm no pre-upsert existence probe remains in `upsertExtractedEntry()` |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/265-gemini-hooks.md:16:- **Objective**: Verify that Gemini CLI hook scripts correctly handle lifecycle events. The session-prime hook must read Gemini-format JSON from stdin ({session_id, source, ...}) and output hookSpecificOutput.additionalContext for context injection. On source=startup, it must deliver session priming context. On source=compact (synthetic, via readAndClearCompactPrime), it must inject cached compact payload. The compact-inject hook must perform one-shot injection on BeforeAgent events. The shared module must correctly parse Gemini stdin and format output. Cache TTL (30 minutes) must be enforced for compact payloads.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/265-gemini-hooks.md:21:- **Prompt**: `Validate 265 Gemini hooks. Simulate a Gemini SessionStart event with source=startup. Confirm: (1) session-prime.ts reads JSON from stdin with session_id, (2) output is JSON with hookSpecificOutput.additionalContext containing session context, (3) compact-inject.ts performs one-shot injection on BeforeAgent, (4) shared.ts parseGeminiStdin correctly parses Gemini input format, (5) stale cache (>30 min) is rejected.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/265-gemini-hooks.md:37:| 265a | Gemini CLI hooks | Session-prime outputs additionalContext on startup | `Validate 265a session-prime startup` | `echo '{"session_id":"test","source":"startup","cwd":"."}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/session-prime.js` | JSON output with hookSpecificOutput.additionalContext string | Hook script stdout | PASS if valid JSON with additionalContext field containing context text | Check formatGeminiOutput() and session-prime handleStartup() |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/265-gemini-hooks.md:38:| 265b | Gemini CLI hooks | Compact-inject returns empty when no cached payload | `Validate 265b compact-inject no-op` | `echo '{"session_id":"test","hook_event_name":"BeforeAgent","prompt":"test"}' \| node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/compact-inject.js` | No output or empty JSON (no cached compact payload) | Hook script stdout | PASS if no additionalContext injected when no cache exists | Check readAndClearCompactPrime() returns null |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/265-gemini-hooks.md:39:| 265c | Gemini CLI hooks | Shared stdin parser handles Gemini format | `Validate 265c stdin parsing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/ --grep gemini` | parseGeminiStdin returns GeminiHookInput with session_id, source, cwd | Test output | PASS if all fields parsed correctly from Gemini JSON format | Check parseGeminiStdin() buffer concatenation and JSON.parse |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24:  1. `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` — primary recovery path
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:29:- Expected: Resume-ready state summary and next steps via `memory_context(mode:"resume")` as primary path.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:30:- Evidence: returned context + extracted next actions + recovery source identification (memory_context / continue_session / memory_search / user).
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:31:- Pass: `memory_context(mode:"resume")` is used as the primary recovery path; continuation context is actionable and specific.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:32:- Fail triage: verify `memory_context` resume mode routes correctly; broaden anchors on fallback search; verify spec folder path; check `CONTINUE_SESSION.md` presence.
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:3:description: "This scenario validates Session resume tool for 263. It focuses on verifying session_resume returns a detailed merged recovery payload, including structural readiness hints."
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:10:This scenario validates the detailed Session resume tool (`session_resume`). It focuses on the lower-level merged payload returned by the direct resume surface, while the higher-level bootstrap/recovery guidance is documented separately.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:16:- **Objective**: Verify that session_resume performs its recovery sub-calls (memory_context resume, code graph status, CocoIndex availability), appends the shared structural ready/stale/missing contract, and merges everything into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), structuralContext (`status`, `summary`, `recommendedAction`, `sourceSurface`, plus freshness guidance), and hints array.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:21:- **Prompt**: `Validate 263 Session resume. Call session_resume and confirm: (1) memory field contains resume context from memory_context, (2) codeGraph field has status (ok/empty/error), nodeCount, edgeCount, fileCount, lastScan, (3) cocoIndex field has available boolean and binaryPath, (4) structuralContext reports ready/stale/missing correctly and includes summary, recommendedAction, and sourceSurface, and (5) hints array includes session_bootstrap guidance when structural context is degraded.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:27:  - structuralContext.summary is a string, `recommendedAction` is a string, and `sourceSurface === "session_resume"`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:28:  - hints array present (may be empty if all subsystems healthy; should point to `session_bootstrap` when structure is degraded)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:39:| 263a | Session resume tool | Memory resume sub-call returns context | `Validate 263a memory resume` | Call `session_resume({})` via MCP | memory field is non-empty object with resume data or error + hint | session_resume response JSON memory field | PASS if memory field present with data or graceful error | Check handleMemoryContext() with mode=resume in session-resume.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:40:| 263b | Session resume tool | Code graph status sub-call returns counts | `Validate 263b code graph status` | Call `session_resume({})` via MCP | codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0 | session_resume response JSON codeGraph field | PASS if codeGraph field has all required fields with valid types | Check graphDb.getStats() and code-graph-db.ts query |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:41:| 263c | Session resume tool | CocoIndex availability check | `Validate 263c cocoindex status` | Call `session_resume({})` via MCP | cocoIndex.available is boolean, binaryPath is string | session_resume response JSON cocoIndex field | PASS if cocoIndex fields present with correct types | Check `cocoindex-path.ts` plus the availability probe used by session-resume.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:42:| 263d | Session resume tool | Structural readiness and recovery hinting | `Validate 263d structural context` | Call `session_resume({})` via MCP in both healthy and degraded graph states | structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap in hints | session_resume response JSON structuralContext + hints | PASS if structural contract fields are surfaced and degraded states recommend session_bootstrap; FAIL if required contract fields are missing or recovery hint is wrong | Check buildStructuralBootstrapContract() and degraded hint injection in session-resume.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/185-memory-search-command-routing.md:29:| 185 | /memory:search command routing | Verify `/memory:search` command routing logic covers no-args, retrieval, and analysis modes | `Validate /memory:search command routing across retrieval and analysis modes. Capture the evidence needed to prove No-args triggers interactive intent prompt; query text triggers retrieval mode with auto-detected intent and weighted anchors; analysis subcommands route to their respective tools. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:search` with no arguments and verify the interactive intent selection prompt appears (Add feature, Fix bug, Refactor, Security audit, Understand, Find spec, Find decision, Analysis tools) 2) Invoke `/memory:search "implement auth"` and verify retrieval mode activates with auto-detected `add_feature` intent and appropriate weight boosts (implementation 1.5x, architecture 1.3x, patterns 1.2x) 3) Invoke `/memory:search "auth bug" --intent:fix_bug` and verify the explicit intent override is respected 4) Invoke `/memory:search preflight specs/007-test T1` and verify `task_preflight()` is called 5) Invoke `/memory:search postflight specs/007-test T1` and verify `task_postflight()` is called 6) Invoke `/memory:search history specs/007-test` and verify `memory_get_learning_history()` is called 7) Invoke `/memory:search causal 42` and verify `memory_drift_why()` is called 8) Invoke `/memory:search ablation` and verify `eval_run_ablation()` is called 9) Invoke `/memory:search dashboard` and verify `eval_reporting_dashboard()` is called | No-args triggers interactive intent prompt; query text triggers retrieval mode with intent detection; analysis subcommands each route to the correct tool | Tool invocation logs for each subcommand; intent detection output for retrieval queries; interactive prompt display for no-args case | PASS: No-args prompts for intent, retrieval returns intent-weighted results, each analysis subcommand invokes its dedicated tool; FAIL: No-args proceeds without prompt, retrieval ignores intent, or an analysis subcommand routes to the wrong tool | Verify argument routing logic in Section 4 of search.md → Check intent detection keywords → Confirm analysis subcommand first-token matching → Inspect tool coverage matrix for correct tool-to-subcommand mapping |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:113:  input: Pick<HookInput, 'session_id'> & { specFolder?: string } = {},
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:216:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:2:title: "264 -- Query-intent routing in memory_context"
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:6:# 264 -- Query-intent routing in memory_context
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:10:This scenario validates Query-intent routing in memory_context.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:16:- **Objective**: Verify that memory_context auto-routes queries based on the query-intent classifier. Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend. Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline. Hybrid queries must trigger both backends and merge results. The classifier confidence score and matched keywords must be available in the response metadata.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:20:- **Prompt**: `Validate 264 Query-intent routing. Send three queries to memory_context: (1) a structural query like "what functions call handleMemoryContext", (2) a semantic query like "find examples of error handling patterns", (3) a hybrid query like "find all validation functions and explain their approach". Confirm: (1) structural query returns code graph results, (2) semantic query returns memory/CocoIndex results, (3) hybrid query returns merged results from both backends.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:35:| 264a | Query-intent routing | Structural query routes to code graph | `Validate 264a structural routing` | Call `memory_context({ input: "what functions call handleMemoryContext" })` | Response includes code graph data (symbols, edges), intent classified as 'structural' | memory_context response with code graph results | PASS if code graph results present and classifier shows structural intent | Check STRUCTURAL_KEYWORDS in query-intent-classifier.ts and memory_context integration |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:36:| 264b | Query-intent routing | Semantic query routes to memory pipeline | `Validate 264b semantic routing` | Call `memory_context({ input: "find examples of error handling patterns" })` | Response includes memory hits with similarity scores, intent classified as 'semantic' | memory_context response with memory results | PASS if memory/semantic results present and classifier shows semantic intent | Check SEMANTIC_KEYWORDS and memory_context fallback path |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:37:| 264c | Query-intent routing | Hybrid query merges both backends | `Validate 264c hybrid routing` | Call `memory_context({ input: "find all validation functions and explain their approach" })` | Response includes both code graph and memory results, intent classified as 'hybrid' | memory_context response with merged results | PASS if both backends contribute results | Check hybrid scoring threshold and merge logic |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:602:// entries = [{ id, session_id, memory_id, attention_score, added_at, last_focused, focus_count }]
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:29:| 187 | Quick search (memory_quick_search) | Verify `memory_quick_search` simplified query-only retrieval | `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Call `memory_quick_search({ query: "authentication" })` with no optional parameters and verify results are returned 2) Call `memory_quick_search({ query: "authentication", specFolder: "specs/<known-spec>" })` and verify results are scoped to the specified folder 3) Call `memory_quick_search({ query: "authentication", limit: 3 })` and verify at most 3 results are returned 4) Call `memory_quick_search({ query: "authentication", tenantId: "tenant-1" })` and verify governed retrieval boundary is respected 5) Compare `memory_quick_search` results with `memory_context` results for the same query to confirm quick_search provides a simplified fast-path alternative | Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately | Tool outputs for each call showing result count, specFolder scoping, limit adherence, and tenant filtering | PASS: Quick search returns relevant results, specFolder narrows scope, limit is respected, governed boundaries filter; FAIL: Quick search returns no results for a known query, specFolder is ignored, limit is exceeded, or governed boundaries do not filter | Verify `memory_quick_search` tool is listed in search.md allowed-tools → Check L2 layer routing → Confirm query parameter is required → Inspect optional parameter handling for specFolder, limit, tenantId, userId, agentId, sharedSpaceId |
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:55:  session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:126:    session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:136:  CREATE INDEX IF NOT EXISTS idx_feedback_session    ON feedback_events(session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:183:      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:258:      conditions.push('session_id = ?');
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/240-core-workflow-infrastructure.md:19:- Prompt: `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/240-core-workflow-infrastructure.md:29:| 240 | Core Workflow Infrastructure | Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests | `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts` | All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams | Vitest transcript showing passing suite counts and file names | PASS if the targeted suites pass together without failures; FAIL if any shared workflow seam regresses | Inspect `scripts/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails |
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:212:      // Count distinct sessions (null session_id treated as each own distinct pseudo-session)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:213:      const sessionKey = ev.session_id ?? `__null_${ev.id}`;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:14:  session_id?: string;
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:2:title: "EX-001 -- Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:3:description: "This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:6:# EX-001 -- Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:10:This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:19:- Prompt: `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:29:| EX-001 | Unified context retrieval (memory_context) | Intent-aware context pull | `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_match_triggers({ prompt: "fix flaky index scan retry logic", sessionId: "ex001" })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "auto", sessionId: "ex001" })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })` | Relevant bounded context returned; no empty response | Tool outputs + mode selection | PASS if relevant context returned in both calls | Check specFolder/intent mismatch, retry with explicit intent |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:240:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:378:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:3:description: "This scenario validates the structured JSON summary contract for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening."
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:18:This scenario validates the phase 016 structured JSON summary contract for `generate-context.js`. It covers acceptance of `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, snake_case field compatibility, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:27:- Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:37:| 153 | JSON mode structured summary hardening | Verify structured JSON summary contract | `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields (user_prompts, recent_context, trigger_phrases). Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.` | 1) Compose JSON payload with `toolCalls`, `exchanges`, `user_prompts`, `trigger_phrases` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Inspect rendered .md output for field preservation 4) Verify decision confidence matches input 5) Verify git_changed_file_count matches explicit count | All structured fields present in output, counts match, file-backed JSON stays on the structured path | Rendered memory file content, CLI exit code 0 | PASS if structured fields preserved and hardening fixes hold | Check input-normalizer mapping, collect-session-data count handling, and workflow routing for structured inputs |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:38:| 153-A | JSON mode structured summary hardening | Post-save quality review output verification | `Run generate-context.js --json with a fully-populated payload. Confirm the CLI prints a POST-SAVE QUALITY REVIEW block and that the block reports PASSED with 0 issues. Return a pass/fail verdict.` | 1) Compose a complete JSON payload with `sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture full stdout 4) Locate the `POST-SAVE QUALITY REVIEW` block 5) Verify it reads `PASSED` with 0 issues | `POST-SAVE QUALITY REVIEW -- PASSED` header visible in stdout, `issues: 0` or equivalent no-issue indicator | CLI stdout log showing REVIEW block | PASS if REVIEW block is present and reports 0 issues; FAIL if block is absent or reports any issues | Check `scripts/core/post-save-review.ts`, `scripts/core/workflow.ts`, and CLI response rendering in `scripts/memory/generate-context.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:39:| 153-B | JSON mode structured summary hardening | sessionSummary propagates to frontmatter title | `Run generate-context.js --json with sessionSummary set to a meaningful task title (not "Next Steps"). Confirm the rendered memory file's frontmatter title matches the sessionSummary and is not a generic fallback such as "Next Steps".` | 1) Set `sessionSummary` to a descriptive, non-generic string (e.g., "Refactor auth pipeline for token refresh") 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `title` field matches provided sessionSummary | Frontmatter `title` equals the sessionSummary value; no occurrence of "Next Steps" as the title | Rendered .md frontmatter | PASS if title matches sessionSummary; FAIL if title is "Next Steps" or any other fallback | Inspect input-normalizer title derivation and frontmatter assembly in workflow.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:40:| 153-C | JSON mode structured summary hardening | triggerPhrases propagate to frontmatter trigger_phrases | `Run generate-context.js --json with an explicit triggerPhrases array. Confirm the rendered memory file's frontmatter trigger_phrases matches the supplied array and contains no file-path fragments.` | 1) Set `triggerPhrases` to meaningful keyword phrases (e.g., ["auth refactor", "token refresh"]) 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `trigger_phrases` matches the provided array 5) Assert no entry looks like a file path (contains `/` or `.ts`) | Frontmatter `trigger_phrases` contains only the supplied keyword phrases; no path fragments present | Rendered .md frontmatter | PASS if trigger_phrases matches payload; FAIL if path fragments appear or array is replaced by heuristic output | Inspect trigger-extractor heuristic fallback and input-normalizer trigger_phrases passthrough |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:41:| 153-D | JSON mode structured summary hardening | keyDecisions propagate to non-zero decision_count | `Run generate-context.js --json with a keyDecisions array containing at least 2 items. Confirm the rendered memory metadata decision_count is greater than 0 and matches the number of supplied decisions.` | 1) Set `keyDecisions` to an array of 2+ decision strings 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md file, including the `## MEMORY METADATA` YAML block 4) Assert `decision_count` > 0 and equals `keyDecisions.length` | Memory metadata `decision_count` equals the number of items in the `keyDecisions` array | Rendered .md metadata block | PASS if decision_count > 0 and matches array length; FAIL if decision_count is 0 despite supplied decisions | Check collect-session-data decision counting, input-normalizer keyDecisions mapping, and metadata-block rendering |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:42:| 153-E | JSON mode structured summary hardening | importanceTier propagates to frontmatter importance_tier | `Run generate-context.js --json with importanceTier set to "important". Confirm the rendered memory file's frontmatter importance_tier matches "important" and is not overridden to "normal".` | 1) Set `importanceTier` to `"important"` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `importance_tier` equals `"important"` | Frontmatter `importance_tier` equals the payload value | Rendered .md frontmatter | PASS if importance_tier matches payload; FAIL if overridden to "normal" or another default | Inspect importance_tier assignment in workflow.ts and input-normalizer passthrough |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:43:| 153-F | JSON mode structured summary hardening | contextType propagates for the full documented valid enum | `Run generate-context.js --json with contextType set to documented valid values including "implementation", "review", "debugging", and "planning". Confirm each rendered memory file preserves the payload value in frontmatter context_type instead of falling back to heuristics.` | 1) Save separate JSON payloads using `contextType` values `"implementation"`, `"review"`, `"debugging"`, and `"planning"` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` for each case 3) Read each rendered .md frontmatter 4) Assert `context_type` matches the payload value every time | Frontmatter `context_type` equals the payload value for every documented valid test case | Rendered .md frontmatter across the saved files | PASS if every valid test case preserves its explicit context_type; FAIL if any valid value is rewritten or defaulted | Inspect contextType passthrough in input-normalizer, detectSessionCharacteristics in session-extractor, and frontmatter assembly in workflow.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:44:| 153-G | JSON mode structured summary hardening | Contamination filter cleans hedging in sessionSummary | `Run generate-context.js --json with sessionSummary containing "I think this might be important" and recentContext containing "As an AI, I should note". Confirm the saved memory does not contain these hedging/meta-commentary phrases.` | 1) Compose payload with hedging text in sessionSummary and meta-commentary in recentContext 2) Run generate-context.js --json 3) Read saved memory file 4) grep for "I think" and "As an AI" 5) Assert neither phrase appears | Saved memory free of hedging and meta-commentary phrases | grep output showing zero matches | PASS if hedging phrases absent from saved memory; FAIL if any contamination survives | Check contamination-filter.ts pattern list and workflow.ts cleaning call sites |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:45:| 153-H | JSON mode structured summary hardening | Fast-path filesModified to FILES conversion | `Run generate-context.js --json with userPrompts AND filesModified in the same payload. Confirm the saved memory contains a populated files section matching the filesModified entries.` | 1) Compose payload with userPrompts (triggers fast-path) and filesModified=["src/foo.ts"] 2) Run generate-context.js --json 3) Read saved memory 4) Assert FILES section contains src/foo.ts | FILES section populated with filesModified entries | Rendered memory file | PASS if FILES contains all filesModified entries; FAIL if FILES is empty or missing | Check input-normalizer.ts fast-path filesModified conversion |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:46:| 153-I | JSON mode structured summary hardening | Unknown field warning for typos | `Run generate-context.js --json with a deliberately misspelled field name "sesionSummary". Confirm a console warning is emitted naming the unknown field.` | 1) Compose payload with sesionSummary (missing 's') 2) Run generate-context.js --json 3) Capture stderr/stdout 4) Assert WARN message contains "sesionSummary" | Console WARN naming the unknown field | CLI stdout/stderr | PASS if warning emitted; FAIL if typo passes silently | Check KNOWN_RAW_INPUT_FIELDS in input-normalizer.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:47:| 153-J | JSON mode structured summary hardening | contextType enum rejection | `Run generate-context.js --json with contextType="bogus". Confirm validation rejects the payload with an error naming the invalid value and listing valid options.` | 1) Set contextType to "bogus" 2) Run generate-context.js --json 3) Assert validation error mentions "bogus" and lists valid values | Validation error with invalid value and valid options listed | CLI error output | PASS if validation error with enum list; FAIL if bogus value accepted silently | Check VALID_CONTEXT_TYPES in input-normalizer.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:48:| 153-K | JSON mode structured summary hardening | Quality score discriminates contaminated vs clean | `Run generate-context.js --json with two separate payloads: one containing AI hedging contamination, one with clean technical content. Confirm the contaminated save has quality_score below 0.80 and the clean save has quality_score above 0.80.` | 1) Save contaminated payload 2) Save clean payload 3) Compare quality_score in both files | Contaminated quality_score < 0.80; clean quality_score > 0.80 | Two saved memory files | PASS if contaminated < clean and contaminated < 0.80; FAIL if scores are indistinguishable | Check quality-scorer.ts bonus removal and penalty weights |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:49:| 153-L | JSON mode structured summary hardening | Trigger phrase filter removes path fragments | `Run generate-context.js --json with a spec folder that has a long path. Confirm the auto-extracted trigger phrases in the saved memory do not contain path separators (/) from the spec folder path.` | 1) Save memory for a deeply nested spec folder 2) Read saved memory trigger_phrases 3) Check for path separator characters | No trigger phrases containing "/" in auto-extracted set (manual phrases may contain them) | Saved memory frontmatter | PASS if no path-fragment trigger phrases in auto-extracted set; FAIL if path fragments survive filtering | Check filterTriggerPhrases in workflow.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:51:| 153-N | JSON mode structured summary hardening | Default-on pre-save overlap warning uses exact content match | `Run generate-context.js --json twice with the same payload while SPECKIT_PRE_SAVE_DEDUP is unset. Confirm the second run emits a PRE-SAVE OVERLAP warning before writing. Then repeat with SPECKIT_PRE_SAVE_DEDUP=false and confirm the warning is absent.` | 1) Save a JSON payload once 2) Save the exact same payload again with `SPECKIT_PRE_SAVE_DEDUP` unset 3) Capture stdout/stderr and confirm a PRE-SAVE OVERLAP warning 4) Repeat the second save with `SPECKIT_PRE_SAVE_DEDUP=false` 5) Confirm the warning is absent | Advisory overlap warning appears only when the flag is enabled/defaulted | CLI stdout/stderr from repeated saves | PASS if default-on behavior emits the warning and explicit disable suppresses it; FAIL if the warning never appears or cannot be disabled | Check `workflow.ts` SHA1 overlap check and env-flag gate |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:52:| 153-O | JSON mode structured summary hardening | projectPhase override propagates to frontmatter | `Run generate-context.js --json with projectPhase set to "IMPLEMENTATION". Confirm the rendered memory file's frontmatter PROJECT_PHASE matches "IMPLEMENTATION" and is not the default "RESEARCH".` | 1) Set projectPhase to "IMPLEMENTATION" in JSON payload 2) Run generate-context.js --json 3) Read frontmatter 4) Assert PROJECT_PHASE equals IMPLEMENTATION | PROJECT_PHASE: IMPLEMENTATION in frontmatter | Rendered .md frontmatter | PASS if PROJECT_PHASE matches; FAIL if shows RESEARCH | Check resolveProjectPhase() in session-extractor.ts and projectPhase propagation in input-normalizer.ts |
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:9:// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:68:    - `grep -n 'SYSTEM_SPEC_KIT_CAPTURE_SOURCE\|trigger_phrases' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts .opencode/skill/system-spec-kit/templates/context_template.md`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:72:    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/session-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:77:    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:86:    - `M-007a` Rich JSON-mode save: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <json-data-file> 009-perfect-session-capturing` with a populated synthetic or sandbox JSON file and verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:88:    - `M-007b` Thin JSON insufficiency: rerun `generate-context.js` with intentionally thin JSON input using the documented snake_case contract and verify it now fails `INSUFFICIENT_CONTEXT_ABORT` before file write, with a materially lower diagnostic score than `M-007a`.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:99:    - `M-007m` `--stdin` structured input: pipe valid structured JSON into `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <target-spec-folder>` and confirm the explicit CLI target wins over any payload `specFolder`, while `toolCalls` and `exchanges` survive into the generated output.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:100:    - `M-007n` `--json` structured input: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>'` and confirm the payload target is used when no explicit CLI target is provided, while file-backed JSON remains on the authoritative structured path instead of entering runtime-derived reconstruction.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:129:  - `generate-context.js` output or capture logs showing results for `M-007a` through `M-007j`.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:130:  - `generate-context.js` output or targeted Vitest evidence showing results for `M-007k` through `M-007q`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:98:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:9://   { session_id, transcript_path, cwd, hook_event_name, timestamp, source }
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:176:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:27:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:11:  session_id?: string;
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/149-rendered-memory-template-contract.md:19:- Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/149-rendered-memory-template-contract.md:29:| 149 | Rendered memory template contract | Confirm malformed rendered memories fail before write/index and valid rendered output remains validator-clean | `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a sandbox memory missing mandatory anchors or required frontmatter keys 2) `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details 3) `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing 4) Run `generate-context.js` with a valid rich JSON payload and verify the rendered output remains validator-clean | Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean | Dry-run/save rejection output + successful render validation evidence | PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean | Inspect `shared/parsing/memory-template-contract.ts`, `scripts/core/workflow.ts`, and `mcp_server/handlers/memory-save.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:74:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:129:    session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1449:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1461:      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1467:        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1765:  if (!column_names.includes('session_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1767:      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1768:      console.warn('[vector-index] Migration: Added session_id column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1773:      logDuplicateColumnMigrationSkip('session_id', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2190:    'UPDATE session_state SET spec_folder = ? WHERE session_id = ? AND spec_folder = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2194:    `SELECT session_id, spec_folder FROM session_state WHERE spec_folder IS NOT NULL`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2195:  ).all() as Array<{ session_id: string; spec_folder: string }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2202:      updateStmt.run(canonical, row.session_id, row.spec_folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2325:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2435:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2436:    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2461:      session_id,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:11:// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1409:    sessionId: capture.sessionId ?? (raw.session_id as string | undefined),
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:9:// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:471:  name: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:477:  name: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:60:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:136:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:175:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:8:      "name": "generate-context",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:9:      "path": "scripts/dist/memory/generate-context.js",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:458:      "memory": ["generate-context", "cleanup-orphaned-vectors", "test-embeddings-factory"],
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:682:| `session_id` | string | Session context for co-activation |
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:948:##### `task_preflight`
.opencode/skill/system-spec-kit/mcp_server/README.md:950:Capture your starting knowledge before a task. Records how well you understand the domain, how uncertain you are and how much relevant context you have. These scores get compared to `task_postflight` to measure what you learned.
.opencode/skill/system-spec-kit/mcp_server/README.md:964:##### `task_postflight`
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1459:  "tool": "task_preflight",
.opencode/skill/system-spec-kit/mcp_server/README.md:1475:  "tool": "task_postflight",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:39:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:60:  'session_id',
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:10:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:181:  sessionData: { SESSION_ID: string; SUMMARY: string },
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:207:    .update(`${sessionData.SESSION_ID}\n${memoryTitle}\n${sessionData.SUMMARY}`)
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:297:    const sessionId = parseStructuredValue(frontmatter, ['session_id'])
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:298:      || parseStructuredValue(content, ['session_id']);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:27:  session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:38:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:44:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:74:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:100:    session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:108:  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:150:    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:162:    entry.session_id ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:187:  if (opts.session_id) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:188:    conditions.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:189:    params.push(opts.session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:395:        session_id: input.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:431:      session_id: input.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:443:    || columns.has('session_id')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1109:        session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1121:        UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1332:    'session_id',
.opencode/skill/system-spec-kit/README.md:93:| **Startup / Recovery Surfaces** | Runtime-specific startup context delivery where available, with `session_bootstrap()` as the canonical non-hook recovery entry and `session_resume()` as the detailed follow-up surface                    |
.opencode/skill/system-spec-kit/README.md:95:| **Session Continuity**        | Context preserved across session boundaries via `generate-context.js` and semantic indexing                                                                                                                    |
.opencode/skill/system-spec-kit/README.md:109:| **Session**         | session_health, session_resume, session_bootstrap                        | Structural recovery, readiness checks, and startup/bootstrap state |
.opencode/skill/system-spec-kit/README.md:157:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/README.md:262:├── memory/                      # Session context files (via generate-context.js)
.opencode/skill/system-spec-kit/README.md:552:| `generate-context.ts`         | Source for the runtime memory-save entrypoint `scripts/dist/memory/generate-context.js` |
.opencode/skill/system-spec-kit/README.md:562:TypeScript sources compile to `scripts/dist/`. The runtime entry point for memory saves is `scripts/dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/README.md:630:| `scripts/dist/memory/generate-context.js`                                    | Primary workflow for saving session context to memory                                                |
.opencode/skill/system-spec-kit/README.md:639:The **memory system** is the librarian. When a session ends, `generate-context.js` writes a summary of what happened and files it in the spec folder's `memory/` directory. The MCP server indexes it into vector, FTS5, and BM25 surfaces, while graph and degree signals are computed at retrieval time. When a new session starts, runtime-specific startup integrations may auto-surface that context. If startup context is unavailable or the runtime is operating without hooks, begin with `session_bootstrap()`, which bundles resume context, health, and structural readiness into one recovery call before deeper `memory_context` work begins.
.opencode/skill/system-spec-kit/README.md:655:  └─► generate-context.js writes memory file
.opencode/skill/system-spec-kit/README.md:660:  └─► Startup surface auto-primes OR session_bootstrap() runs once
.opencode/skill/system-spec-kit/README.md:781:# Using the generate-context.js script directly
.opencode/skill/system-spec-kit/README.md:782:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/README.md:858:**What you see**: Calling `memory_match_triggers()` returns an error or the tool is not recognized.
.opencode/skill/system-spec-kit/README.md:878:**What you see**: `generate-context.js` runs but the output file is empty or the script exits with an error.
.opencode/skill/system-spec-kit/README.md:889:node scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/README.md:930:**What you see**: `memory_context()` returns irrelevant results or misses content you know exists.
.opencode/skill/system-spec-kit/README.md:944:# memory_context({ input: "find_decision: why did we choose JWT?", mode: "deep" })
.opencode/skill/system-spec-kit/README.md:951:| `generate-context.js` not found  | Run `npm run build` in `system-spec-kit/`                                       |
.opencode/skill/system-spec-kit/README.md:1005:A: Spec folders capture what happened in structured documentation. The memory system makes that documentation searchable across sessions. When a session ends, `generate-context.js` writes a summary to the spec folder's `memory/` directory. The MCP server indexes it. When the next session starts, runtime-specific startup integrations may auto-surface that context; otherwise the canonical recovery sequence is `session_bootstrap()` first, then `memory_context` or `memory_match_triggers` for deeper retrieval. One side captures, the recovery surfaces retrieve.
.opencode/skill/system-spec-kit/README.md:1011:A: The memory system can index any markdown file, beyond spec folder contents. But the spec folder workflow is the primary way context gets saved (via `generate-context.js`), so in practice they work together. You can save standalone memories using `memory_save`, but Gate 3 will still ask about a spec folder for file modifications.
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:207:    const sessionId = parseFrontmatterValue(frontmatter, 'session_id');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:37:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:212:    ['session', normalizeScopeValue(row.session_id)],
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:32:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Admits `includeTrace` for `memory_search` and `memory_context` input validation. |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:922:    session_id: existingRow.session_id,
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:23:    .replace(/^session_id:\s*".*"$/gm, 'session_id: "<normalized>"')
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:37:import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:38:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1426:      sessionId: sessionData.SESSION_ID,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1428:      sourceSessionId: sessionData.SOURCE_SESSION_ID,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1443:    sessionId: sessionData.SESSION_ID,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1614:        sessionId: sessionData.SOURCE_SESSION_ID,
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:20:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/scripts/types/README.md:137:| **Identity** | `TITLE`, `SESSION_ID`, `CHANNEL`, `SPEC_FOLDER` |
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:580:  SESSION_ID: string;
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:643:  SOURCE_SESSION_ID: string;
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:155:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:167:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:191:    INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, focus_count, last_focused)
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
.opencode/skill/system-spec-kit/scripts/setup/install.sh:351:    echo "  3. Use memory_search, memory_save, memory_context tools for context preservation"
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:1:// TEST: collect-session-data — basic unit tests for session status, completion, and collection
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:7:} from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:61:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:100:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:11:const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:10:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:64:    'session_id: "phase2-pr3-test"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:9:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:144:    'session_id: "phase4-pr9-inline"',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:127:    `_sourceSessionId: "${String(data.SOURCE_SESSION_ID ?? '')}"`,
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:170:    'session_id: "test-session"',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:286:    SESSION_ID: 'session-test',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:347:    SOURCE_SESSION_ID: '',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:938:    expect(sessionData.SOURCE_SESSION_ID).toBe('session-123');
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1084:          SOURCE_SESSION_ID: 'session-abc',
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/README.md:69:  - `collect-session-data.vitest.ts`
.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts:144:| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:55:    SESSION_ID: sessionId,
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:64:    SESSION_ID: 'session-render-fixture',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:125:    SOURCE_SESSION_ID: '',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:361:            SOURCE_SESSION_ID: 'session-xyz',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:419:        SOURCE_SESSION_ID: '',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:480:                'Tool: read File: scripts/extractors/collect-session-data.ts Result: inspected quick summary derivation',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:483:              files: ['scripts/extractors/collect-session-data.ts', 'scripts/tests/memory-render-fixture.vitest.ts'],
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:62:session_id: "planning-save-1"
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:74:session_id: "review-save-1"
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:3:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:989:    if (contextTemplate.includes('```yaml') && contextTemplate.includes('session_id:')) {
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:76:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:107:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:138:      liveBaselineResolution: 'memory_context_then_grep',
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:15:    const { collectSessionData } = await import('../extractors/collect-session-data');
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:24:        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed packet doc discovery.' },
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:35:    const { collectSessionData } = await import('../extractors/collect-session-data');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:13:import { collectSessionData, generateResumeContext, type CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:64:    SESSION_ID: 'phase6-extractor-fixture',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:93:    ACTIVE_FILE: '.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts',
.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:109:        session_id TEXT,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:8:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:113:    SESSION_ID: 'phase2-pr4-fixture',
.opencode/skill/system-spec-kit/scripts/tests/workflow-warning.vitest.ts:62:    SESSION_ID: 'session-workflow-warning',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:188:      title: 'Generate-Context Pipeline Quality',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts:56:  SESSION_ID: 'session-workflow-e2e',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts:122:  SOURCE_SESSION_ID: '',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:62:    SOURCE_SESSION_ID: '',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:88:    SESSION_ID: 'phase6-template-fixture',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:193:    'session_id: "phase6-mirror-drift"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:303:    'session_id: "phase6-dup-fixture"',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:21:vi.mock('../extractors/collect-session-data', () => ({
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:40:describe('generate-context CLI authority', () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:60:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:89:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:114:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:140:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:167:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:203:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:219:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:234:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:249:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:264:      await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:3:import { buildDistinctiveEvidence } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:18:        'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:24:      'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:9:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:87:        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:88:        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:92:        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed canonical discovery and counts.' },
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:104:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:123:    expect(evidence).toContain('scripts/extractors/collect-session-data.ts:1176');
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:124:    expect((evidence.match(/scripts\/extractors\/collect-session-data\.ts:1176/g) ?? []).length).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:9:import { deriveCanonicalDocPointers } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:6:// - collect-session-data.js (424 LOC) - P0
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:260:   4. COLLECT-SESSION-DATA TESTS (P0)
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:265:  log('\n=== COLLECT-SESSION-DATA.JS (P0) ===');
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:268:    const collectSessionData = require(path.join(EXTRACTORS_DIR, 'collect-session-data'));
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:8:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:11:const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1431:  log('\n🔬 EXTRACTORS: collect-session-data.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1434:    const { collectSessionData, shouldAutoSave } = require(path.join(SCRIPTS_DIR, 'extractors', 'collect-session-data'));
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2836:   23. MEDIUM PRIORITY: MEMORY/GENERATE-CONTEXT.JS TESTS
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:315:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:378:        const liveStartup = handleStartup({ session_id: sessionId, specFolder: VALID_SPEC_FOLDER });
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:384:        const cachedStartup = handleStartup({ session_id: sessionId, specFolder: VALID_SPEC_FOLDER });
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:69:    'session_id: "test-session"',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:49:    "session_id: \"phase4-pr9-d8\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:11:      "path": ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:24:        ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:32:        ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:47:      "path": ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:24:    "Replay the fixture through generate-context.js and confirm tier parity"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:53:    "session_id: \"phase4-pr9-d7\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:49:    "session_id: \"phase4-pr9-clean\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:53:    "session_id: \"phase4-pr9-d4\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-004b-last-clipping.json:9:        ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/ambiguity/memory/06-04-26_09-00__candidate-b.md:4:session_id: "ambiguous-b"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/memory/06-04-26_12-30__project-notes.md:4:session_id: "hit-unrelated-2"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/ambiguity/memory/06-04-26_09-00__candidate-a.md:4:session_id: "ambiguous-a"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/memory/06-04-26_12-05__deep-research-run-8.md:4:session_id: "hit-predecessor-1"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:53:    "session_id: \"phase4-pr9-d1\"",

codex
I’ve got the external lifecycle mechanics mapped: setup seeds the scaffold, `ROUTER.md` re-primes each fresh session, `watch` keeps nudging drift checks after commits, and `sync` is a human-in-the-loop repair loop rather than a persisted session engine. I’m narrowing onto our actual session code now so I can call out precisely where Spec Kit Memory is stronger and where Mex’s file-first model stays simpler.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '980,1145p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Resume Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 020: Composite MCP tool that merges memory resume context,
     5	// code graph status, and CocoIndex availability into a single call.
     6	
     7	import { createHash } from 'node:crypto';
     8	import { statSync } from 'node:fs';
     9	import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
    10	import { handleMemoryContext } from './memory-context.js';
    11	import * as graphDb from '../lib/code-graph/code-graph-db.js';
    12	import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
    13	import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
    14	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    15	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    16	import {
    17	  buildStructuralContextTrust,
    18	  createSharedPayloadEnvelope,
    19	  summarizeUnknown,
    20	  summarizeCertaintyContract,
    21	  trustStateFromStructuralStatus,
    22	  type SharedPayloadCertainty,
    23	  type SharedPayloadEnvelope,
    24	  type SharedPayloadSection,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  type OpenCodeTransportPlan,
    29	} from '../lib/context/opencode-transport.js';
    30	import {
    31	  buildCodeGraphOpsContract,
    32	  type CodeGraphOpsContract,
    33	} from '../lib/code-graph/ops-hardening.js';
    34	import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
    42	export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
    43	
    44	export interface CachedSessionSummaryCandidate {
    45	  schemaVersion: number;
    46	  lastSpecFolder: string | null;
    47	  summaryText: string | null;
    48	  extractedAt: string | null;
    49	  stateUpdatedAt: string | null;
    50	  producerMetadata: HookProducerMetadata | null;
    51	}
    52	
    53	export interface CachedSessionSummary {
    54	  schemaVersion: number;
    55	  lastSpecFolder: string;
    56	  summaryText: string;
    57	  extractedAt: string;
    58	  lastClaudeTurnAt: string;
    59	  transcriptPath: string;
    60	  transcriptFingerprint: string;
    61	  cacheCreationInputTokens: number;
    62	  cacheReadInputTokens: number;
    63	  continuityText: string;
    64	  startupHint: string;
    65	}
    66	
    67	export interface CachedSessionSummaryDecision {
    68	  status: 'accepted' | 'rejected';
    69	  category: 'accepted' | 'fidelity' | 'freshness';
    70	  reason:
    71	    | 'accepted'
    72	    | 'missing_state'
    73	    | 'schema_version_mismatch'
    74	    | 'missing_summary'
    75	    | 'missing_producer_metadata'
    76	    | 'missing_required_fields'
    77	    | 'transcript_unreadable'
    78	    | 'transcript_identity_mismatch'
    79	    | 'stale_summary'
    80	    | 'summary_precedes_producer_turn'
    81	    | 'scope_mismatch'
    82	    | 'unknown_scope';
    83	  detail: string;
    84	  cachedSummary: CachedSessionSummary | null;
    85	}
    86	
    87	interface SessionResumeArgs {
    88	  specFolder?: string;
    89	  sessionId?: string;
    90	  minimal?: boolean;
    91	}
    92	
    93	interface CodeGraphStatus {
    94	  status: 'fresh' | 'stale' | 'empty' | 'error';
    95	  lastScan: string | null;
    96	  nodeCount: number;
    97	  edgeCount: number;
    98	  fileCount: number;
    99	}
   100	
   101	interface CocoIndexStatus {
   102	  available: boolean;
   103	  binaryPath: string;
   104	}
   105	
   106	interface SessionResumeResult {
   107	  memory: Record<string, unknown>;
   108	  codeGraph: CodeGraphStatus;
   109	  cocoIndex: CocoIndexStatus;
   110	  cachedSummary?: CachedSessionSummaryDecision;
   111	  structuralContext?: StructuralBootstrapContract;
   112	  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
   113	  payloadContract?: SharedPayloadEnvelope;
   114	  opencodeTransport?: OpenCodeTransportPlan;
   115	  graphOps?: CodeGraphOpsContract;
   116	  hints: string[];
   117	}
   118	
   119	/* ───────────────────────────────────────────────────────────────
   120	   2. HELPERS
   121	──────────────────────────────────────────────────────────────── */
   122	
   123	function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
   124	  if (typeof specFolder !== 'string') {
   125	    return null;
   126	  }
   127	
   128	  const trimmed = specFolder.trim();
   129	  if (trimmed.length === 0) {
   130	    return null;
   131	  }
   132	
   133	  return trimmed.replace(/^\.opencode\//, '');
   134	}
   135	
   136	function parseIsoMs(value: string | null | undefined): number | null {
   137	  if (typeof value !== 'string' || value.trim().length === 0) {
   138	    return null;
   139	  }
   140	
   141	  const parsed = Date.parse(value);
   142	  return Number.isNaN(parsed) ? null : parsed;
   143	}
   144	
   145	function isFiniteNonNegativeNumber(value: unknown): value is number {
   146	  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
   147	}
   148	
   149	function buildTranscriptFingerprint(
   150	  transcriptPath: string,
   151	  sizeBytes: number,
   152	  modifiedAtMs: number,
   153	): string {
   154	  return createHash('sha256')
   155	    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
   156	    .digest('hex')
   157	    .slice(0, 16);
   158	}
   159	
   160	function rejectCachedSummary(
   161	  category: 'fidelity' | 'freshness',
   162	  reason: CachedSessionSummaryDecision['reason'],
   163	  detail: string,
   164	): CachedSessionSummaryDecision {
   165	  return {
   166	    status: 'rejected',
   167	    category,
   168	    reason,
   169	    detail,
   170	    cachedSummary: null,
   171	  };
   172	}
   173	
   174	export function buildCachedSessionSummaryCandidate(
   175	  state: HookState | null,
   176	): CachedSessionSummaryCandidate | null {
   177	  if (!state) {
   178	    return null;
   179	  }
   180	
   181	  return {
   182	    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
   183	    lastSpecFolder: state.lastSpecFolder,
   184	    summaryText: state.sessionSummary?.text ?? null,
   185	    extractedAt: state.sessionSummary?.extractedAt ?? null,
   186	    stateUpdatedAt: state.updatedAt,
   187	    producerMetadata: state.producerMetadata,
   188	  };
   189	}
   190	
   191	export function evaluateCachedSessionSummaryCandidate(
   192	  candidate: CachedSessionSummaryCandidate | null,
   193	  options: {
   194	    specFolder?: string;
   195	    nowMs?: number;
   196	    maxAgeMs?: number;
   197	  } = {},
   198	): CachedSessionSummaryDecision {
   199	  if (!candidate) {
   200	    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
   201	  }
   202	
   203	  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
   204	    return rejectCachedSummary(
   205	      'fidelity',
   206	      'schema_version_mismatch',
   207	      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
   208	    );
   209	  }
   210	
   211	  const summaryText = candidate.summaryText?.trim() ?? '';
   212	  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
   213	    return rejectCachedSummary(
   214	      'fidelity',
   215	      'missing_summary',
   216	      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
   217	    );
   218	  }
   219	
   220	  const producerMetadata = candidate.producerMetadata;
   221	  if (!producerMetadata) {
   222	    return rejectCachedSummary(
   223	      'fidelity',
   224	      'missing_producer_metadata',
   225	      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
   226	    );
   227	  }
   228	
   229	  const transcript = producerMetadata.transcript;
   230	  const cacheTokens = producerMetadata.cacheTokens;
   231	  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
   232	  if (
   233	    producerTurnMs === null
   234	    || !transcript
   235	    || typeof transcript.path !== 'string'
   236	    || transcript.path.trim().length === 0
   237	    || typeof transcript.fingerprint !== 'string'
   238	    || transcript.fingerprint.trim().length === 0
   239	    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
   240	    || parseIsoMs(transcript.modifiedAt) === null
   241	    || !cacheTokens
   242	    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
   243	    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
   244	  ) {
   245	    return rejectCachedSummary(
   246	      'fidelity',
   247	      'missing_required_fields',
   248	      'Producer metadata was missing required transcript identity or cache token fields.',
   249	    );
   250	  }
   251	
   252	  let transcriptStat: ReturnType<typeof statSync>;
   253	  try {
   254	    transcriptStat = statSync(transcript.path);
   255	  } catch (error: unknown) {
   256	    const message = error instanceof Error ? error.message : String(error);
   257	    return rejectCachedSummary(
   258	      'fidelity',
   259	      'transcript_unreadable',
   260	      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,
   261	    );
   262	  }
   263	
   264	  const expectedFingerprint = buildTranscriptFingerprint(
   265	    transcript.path,
   266	    transcriptStat.size,
   267	    transcriptStat.mtimeMs,
   268	  );
   269	  if (
   270	    transcript.sizeBytes !== transcriptStat.size
   271	    || transcript.modifiedAt !== transcriptStat.mtime.toISOString()
   272	    || transcript.fingerprint !== expectedFingerprint
   273	  ) {
   274	    return rejectCachedSummary(
   275	      'fidelity',
   276	      'transcript_identity_mismatch',
   277	      'Transcript path, fingerprint, or file stats no longer match the persisted producer identity.',
   278	    );
   279	  }
   280	
   281	  const extractedAtMs = parseIsoMs(candidate.extractedAt);
   282	  const nowMs = options.nowMs ?? Date.now();
   283	  const maxAgeMs = options.maxAgeMs ?? CACHED_SESSION_SUMMARY_MAX_AGE_MS;
   284	  if (extractedAtMs === null || nowMs - extractedAtMs > maxAgeMs) {
   285	    return rejectCachedSummary(
   286	      'freshness',
   287	      'stale_summary',
   288	      `Cached summary age exceeded the freshness window of ${maxAgeMs}ms.`,
   289	    );
   290	  }
   291	
   292	  if (extractedAtMs < producerTurnMs) {
   293	    return rejectCachedSummary(
   294	      'freshness',
   295	      'summary_precedes_producer_turn',
   296	      'Cached summary predates the latest producer turn metadata and is therefore invalidated.',
   297	    );
   298	  }
   299	
   300	  const expectedSpecFolder = normalizeSpecFolder(options.specFolder);
   301	  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
   302	  if (expectedSpecFolder) {
   303	    if (!cachedSpecFolder) {
   304	      return rejectCachedSummary(
   305	        'freshness',
   306	        'unknown_scope',
   307	        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
   308	      );
   309	    }
   310	
   311	    if (cachedSpecFolder !== expectedSpecFolder) {
   312	      return rejectCachedSummary(
   313	        'freshness',
   314	        'scope_mismatch',
   315	        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
   316	      );
   317	    }
   318	  } else if (!cachedSpecFolder) {
   319	    return rejectCachedSummary(
   320	      'freshness',

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1500,1605p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1500	      discoveredFolder,
  1501	      includeTrace: options.includeTrace === true,
  1502	      sessionTransition,
  1503	      structuralRoutingNudge,
  1504	    })
  1505	  });
  1506	
  1507	  // Consumption instrumentation — log context event (fail-safe, never throws)
  1508	  try {
  1509	    const db = vectorIndex.getDb();
  1510	    if (db) {
  1511	      initConsumptionLog(db);
  1512	      let resultIds: number[] = [];
  1513	      let resultCount = 0;
  1514	      try {
  1515	        if (_contextResponse?.content?.[0]?.text) {
  1516	          const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
  1517	          resultIds = innerResults.map(r => r.id as number).filter(id => typeof id === 'number');
  1518	          resultCount = innerResults.length;
  1519	        }
  1520	      } catch {
  1521	        // Intentional no-op — error deliberately discarded
  1522	      }
  1523	      logConsumptionEvent(db, {
  1524	        event_type: 'context',
  1525	        query_text: normalizedInput,
  1526	        intent: detectedIntent ?? null,
  1527	        mode: effectiveMode,
  1528	        result_count: resultCount,
  1529	        result_ids: resultIds,
  1530	        session_id: effectiveSessionId,
  1531	        latency_ms: Date.now() - _contextStartTime,
  1532	        spec_folder_filter: spec_folder ?? null,
  1533	      });
  1534	    }
  1535	  } catch {
  1536	    // Intentional no-op — error deliberately discarded
  1537	  }
  1538	
  1539	  // Eval logger — capture final context results at exit (fail-safe)
  1540	  try {
  1541	    if (_evalRunId && _evalQueryId) {
  1542	      let finalMemoryIds: number[] = [];
  1543	      let finalScores: number[] = [];
  1544	      try {
  1545	        if (_contextResponse?.content?.[0]?.text) {
  1546	          const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
  1547	          finalMemoryIds = innerResults.map(r => (r.id ?? r.memoryId) as number).filter(id => typeof id === 'number');
  1548	          finalScores = innerResults.map(r => (r.score ?? r.similarity ?? 0) as number);
  1549	        }
  1550	      } catch {
  1551	        // Intentional no-op — error deliberately discarded
  1552	      }
  1553	      logFinalResult({
  1554	        evalRunId: _evalRunId,
  1555	        queryId: _evalQueryId,
  1556	        resultMemoryIds: finalMemoryIds,
  1557	        scores: finalScores,
  1558	        fusionMethod: effectiveMode,
  1559	        latencyMs: Date.now() - _contextStartTime,
  1560	      });
  1561	
  1562	      const strategy = typeof budgetedResult?.strategy === 'string' && budgetedResult.strategy.length > 0
  1563	        ? budgetedResult.strategy
  1564	        : effectiveMode;
  1565	      logChannelResult({
  1566	        evalRunId: _evalRunId,
  1567	        queryId: _evalQueryId,
  1568	        channel: `context_${strategy}`,
  1569	        resultMemoryIds: finalMemoryIds,
  1570	        scores: finalScores,
  1571	        hitCount: finalMemoryIds.length,
  1572	        latencyMs: Date.now() - _contextStartTime,
  1573	      });
  1574	    }
  1575	  } catch {
  1576	    // Intentional no-op — error deliberately discarded
  1577	  }
  1578	
  1579	  return _contextResponse;
  1580	  } catch (error: unknown) {
  1581	    console.error(`[memory-context] Unexpected failure [requestId=${requestId}]:`, error);
  1582	    return createMCPErrorResponse({
  1583	      tool: 'memory_context',
  1584	      error: 'memory_context failed due to an internal error',
  1585	      code: 'E_INTERNAL',
  1586	      details: { requestId, layer: 'L1:Orchestration' },
  1587	      recovery: {
  1588	        hint: 'Retry the request. If the problem persists, inspect stderr logs for the full error details.',
  1589	      },
  1590	    });
  1591	  }
  1592	}
  1593	
  1594	/* ───────────────────────────────────────────────────────────────
  1595	   7. EXPORTS
  1596	──────────────────────────────────────────────────────────────── */
  1597	
  1598	export {
  1599	  handleMemoryContext,
  1600	  CONTEXT_MODES,
  1601	  INTENT_TO_MODE,
  1602	  enforceTokenBudget,
  1603	};
  1604	
  1605	// Backward-compatible aliases (snake_case)

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   241	  const startTime = Date.now();
   242	
   243	  // Eval logger — capture trigger query at entry (fail-safe)
   244	  let _evalQueryId = 0;
   245	  let _evalRunId = 0;
   246	  try {
   247	    const evalEntry = logSearchQuery({
   248	      query: prompt,
   249	      intent: 'trigger_match',
   250	      specFolder: null,
   251	    });
   252	    _evalQueryId = evalEntry.queryId;
   253	    _evalRunId = evalEntry.evalRunId;
   254	  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
   255	
   256	  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
   257	    try {
   258	      if (_evalRunId && _evalQueryId) {
   259	        logFinalResult({
   260	          evalRunId: _evalRunId,

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1400,1485p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1400	    warn(`   Warning: Pre-extraction of trigger phrases failed: ${errMsg}`);
  1401	  }
  1402	
  1403	  const keyFiles = buildKeyFiles(enhancedFiles, specFolder);
  1404	  const memoryClassification = buildMemoryClassificationContext(collectedData, sessionData);
  1405	  const sessionDedup = buildSessionDedupContext(collectedData, sessionData, memoryTitle);
  1406	  const currentSnakeCaseCausalLinks = (
  1407	    collectedData.causal_links
  1408	    && typeof collectedData.causal_links === 'object'
  1409	    && !Array.isArray(collectedData.causal_links)
  1410	  ) ? { ...(collectedData.causal_links as Record<string, unknown>) } : null;
  1411	  const currentCamelCaseCausalLinks = (
  1412	    collectedData.causalLinks
  1413	    && typeof collectedData.causalLinks === 'object'
  1414	    && !Array.isArray(collectedData.causalLinks)
  1415	  ) ? { ...(collectedData.causalLinks as Record<string, unknown>) } : null;
  1416	  const existingSupersedes = [currentSnakeCaseCausalLinks, currentCamelCaseCausalLinks]
  1417	    .flatMap((value) => (Array.isArray(value?.supersedes) ? value.supersedes : []))
  1418	    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  1419	    .map((value) => value.trim());
  1420	  if (existingSupersedes.length === 0 && collectedData.saveMode === SaveMode.Json) {
  1421	    const { findPredecessorMemory } = await import('./find-predecessor-memory');
  1422	    const predecessorSessionId = await findPredecessorMemory(specFolder, {
  1423	      title: memoryTitle,
  1424	      description: explicitMemoryText.description ?? memoryDescription,
  1425	      summary: sessionData.SUMMARY,
  1426	      sessionId: sessionData.SESSION_ID,
  1427	      filename: rawCtxFilename,
  1428	      sourceSessionId: sessionData.SOURCE_SESSION_ID,
  1429	      causal_links: currentSnakeCaseCausalLinks ?? undefined,
  1430	      causalLinks: currentCamelCaseCausalLinks ?? undefined,
  1431	    });
  1432	
  1433	    if (predecessorSessionId) {
  1434	      const nextCausalLinks = {
  1435	        ...(currentSnakeCaseCausalLinks ?? currentCamelCaseCausalLinks ?? {}),
  1436	        supersedes: [predecessorSessionId],
  1437	      };
  1438	      collectedData.causal_links = nextCausalLinks;
  1439	      collectedData.causalLinks = nextCausalLinks;
  1440	    }
  1441	  }
  1442	  const autoCausalLinks = autoPopulateCausalLinks(collectedData, specFolder, {
  1443	    sessionId: sessionData.SESSION_ID,
  1444	    contextType: sessionData.CONTEXT_TYPE,
  1445	  });
  1446	  const currentCausalLinkField = (...keys: string[]): unknown => {
  1447	    for (const source of [currentSnakeCaseCausalLinks, currentCamelCaseCausalLinks]) {
  1448	      if (!source) {
  1449	        continue;
  1450	      }
  1451	      for (const key of keys) {
  1452	        if (key in source) {
  1453	          return source[key];
  1454	        }
  1455	      }
  1456	    }
  1457	    return undefined;
  1458	  };
  1459	  const mergeCausalLinkList = (primary: unknown, fallback: string[]): string[] => {
  1460	    const seen = new Set<string>();
  1461	    const merged: string[] = [];
  1462	    for (const value of [
  1463	      ...(Array.isArray(primary) ? primary : []),
  1464	      ...fallback,
  1465	    ]) {
  1466	      if (typeof value !== 'string') {
  1467	        continue;
  1468	      }
  1469	      const trimmed = value.trim();
  1470	      if (!trimmed || seen.has(trimmed)) {
  1471	        continue;
  1472	      }
  1473	      seen.add(trimmed);
  1474	      merged.push(trimmed);
  1475	    }
  1476	    return merged;
  1477	  };
  1478	  collectedData.causal_links = {
  1479	    ...((currentSnakeCaseCausalLinks ?? currentCamelCaseCausalLinks ?? {}) as Record<string, unknown>),
  1480	    caused_by: mergeCausalLinkList(currentCausalLinkField('caused_by', 'causedBy'), autoCausalLinks.CAUSED_BY),
  1481	    supersedes: mergeCausalLinkList(currentCausalLinkField('supersedes'), autoCausalLinks.SUPERSEDES),
  1482	    derived_from: mergeCausalLinkList(currentCausalLinkField('derived_from', 'derivedFrom'), autoCausalLinks.DERIVED_FROM),
  1483	    blocks: mergeCausalLinkList(currentCausalLinkField('blocks'), autoCausalLinks.BLOCKS),
  1484	    related_to: mergeCausalLinkList(currentCausalLinkField('related_to', 'relatedTo'), autoCausalLinks.RELATED_TO),
  1485	  };

codex
I’ve now got the contrast point: Mex treats “session lifecycle” as a disciplined reread-and-update loop over markdown, while our system has explicit server-minted sessions, continuity payloads, and save-time lineage. I’m filling in a few last source gaps around scanner/setup and our schema surfaces so the final findings can call out where Mex is intentionally simpler versus where it’s missing session guarantees altogether.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/setup/index.ts | sed -n '180,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   281	      scaffoldPopulated = true;
   282	    }
   283	  }
   284	
   285	  // Count source files
   286	  const patterns = SOURCE_EXTENSIONS.map(
   287	    (ext) => `**/${ext}`
   288	  );
   289	  const sourceFiles = globSync(patterns, {
   290	    cwd: projectRoot,
   291	    ignore: ["**/node_modules/**", "**/.mex/**", "**/vendor/**", "**/.git/**"],
   292	    maxDepth: 4,
   293	    nodir: true,
   294	  });
   295	
   296	  if (scaffoldPopulated && sourceFiles.length > 0) {
   297	    return "partial";
   298	  } else if (sourceFiles.length > 3) {
   299	    return "existing";
   300	  } else {
   301	    return "fresh";
   302	  }
   303	}
   304	
   305	async function selectToolConfig(
   306	  rl: ReturnType<typeof createInterface>,
   307	  projectRoot: string,
   308	  dryRun: boolean,
   309	): Promise<boolean> {
   310	  header("Which AI tool do you use?");
   311	  console.log();
   312	  console.log("  1) Claude Code");
   313	  console.log("  2) Cursor");
   314	  console.log("  3) Windsurf");
   315	  console.log("  4) GitHub Copilot");
   316	  console.log("  5) OpenCode");
   317	  console.log("  6) Codex (OpenAI)");
   318	  console.log("  7) Multiple (select next)");
   319	  console.log("  8) None / skip");
   320	  console.log();
   321	
   322	  const choice = (await rl.question("Choice [1-8] (default: 1): ")).trim() || "1";
   323	
   324	  let selectedClaude = false;
   325	
   326	  const copyConfig = (key: string) => {
   327	    const config = TOOL_CONFIGS[key];
   328	    if (!config) return;
   329	
   330	    if (key === "1") selectedClaude = true;
   331	
   332	    const src = resolve(TEMPLATES_DIR, config.src);
   333	    const dest = resolve(projectRoot, config.dest);
   334	
   335	    if (dryRun) {
   336	      if (existsSync(dest)) {
   337	        warn(`(dry run) Would overwrite ${config.dest}`);
   338	      } else {
   339	        ok(`(dry run) Would copy ${config.dest}`);
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
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "session_bootstrap|session_resume|memory_context|memory_match_triggers|task_preflight|task_postflight" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:413:  task_preflight: taskPreflightSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414:  task_postflight: taskPostflightSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:471:  name: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:477:  name: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts | sed -n '440,505p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   440	    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
   441	    subjectType: z.enum(['user', 'agent']),
   442	    subjectId: z.string(),
   443	    role: z.enum(['owner', 'editor', 'viewer']),
   444	  }),
   445	  shared_memory_status: getSchema({
   446	    tenantId: z.string().optional(),
   447	    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
   448	    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
   449	  }),
   450	  shared_memory_enable: getSchema({}) as unknown as ToolInputSchema,
   451	  session_bootstrap: getSchema({
   452	    specFolder: optionalPathString(),
   453	  }) as unknown as ToolInputSchema,
   454	  session_health: getSchema({}) as unknown as ToolInputSchema,
   455	  session_resume: getSchema({
   456	    specFolder: optionalPathString(),
   457	    minimal: z.boolean().optional(),
   458	  }) as unknown as ToolInputSchema,
   459	};
   460	
   461	const ALLOWED_PARAMETERS: Record<string, string[]> = {
   462	  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
   463	  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
   464	  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
   465	  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
   466	  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
   467	  memory_list: ['limit', 'offset', 'specFolder', 'sortBy', 'includeChunks'],
   468	  memory_stats: ['folderRanking', 'excludePatterns', 'includeScores', 'includeArchived', 'limit'],
   469	  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
   470	  memory_delete: ['id', 'specFolder', 'confirm'],
   471	  memory_update: ['id', 'title', 'triggerPhrases', 'importanceWeight', 'importanceTier', 'allowPartialUpdate'],
   472	  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
   473	  memory_bulk_delete: ['tier', 'specFolder', 'confirm', 'olderThanDays', 'skipCheckpoint'],
   474	  checkpoint_create: ['name', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'metadata'],
   475	  checkpoint_list: ['specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit'],
   476	  checkpoint_restore: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'clearExisting'],
   477	  checkpoint_delete: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'confirmName'],
   478	  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
   479	  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
   480	  memory_drift_why: ['memoryId', 'maxDepth', 'direction', 'relations', 'includeMemoryDetails'],
   481	  memory_causal_link: ['sourceId', 'targetId', 'relation', 'strength', 'evidence'],
   482	  memory_causal_stats: [],
   483	  memory_causal_unlink: ['edgeId'],
   484	  eval_run_ablation: ['mode', 'channels', 'queries', 'groundTruthQueryIds', 'recallK', 'storeResults', 'includeFormattedReport'],
   485	  eval_reporting_dashboard: ['sprintFilter', 'channelFilter', 'metricFilter', 'limit', 'format'],
   486	  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental'],
   487	  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
   488	  memory_ingest_start: ['paths', 'specFolder'],
   489	  memory_ingest_status: ['jobId'],
   490	  memory_ingest_cancel: ['jobId'],
   491	  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
   492	  shared_space_membership_set: ['spaceId', 'tenantId', 'actorUserId', 'actorAgentId', 'subjectType', 'subjectId', 'role'],
   493	  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
   494	  shared_memory_enable: [],
   495	  session_bootstrap: ['specFolder'],
   496	  session_health: [],
   497	  session_resume: ['specFolder', 'minimal'],
   498	};
   499	
   500	/* ───────────────────────────────────────────────────────────────
   501	   7. VALIDATION
   502	──────────────────────────────────────────────────────────────── */
   503	
   504	export class ToolSchemaValidationError extends Error {
   505	  public readonly toolName: string;

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Generate Context
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. GENERATE CONTEXT
     7	// ───────────────────────────────────────────────────────────────
     8	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
     9	
    10	// Node stdlib
    11	import * as path from 'path';
    12	import * as fsSync from 'fs';
    13	
    14	// Internal modules
    15	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    16	import {
    17	  CONFIG,
    18	  findActiveSpecsDir,
    19	  getSpecsDirectories,
    20	  SPEC_FOLDER_PATTERN,
    21	  SPEC_FOLDER_BASIC_PATTERN,
    22	  CATEGORY_FOLDER_PATTERN,
    23	  findChildFolderSync,
    24	} from '../core';
    25	import { runWorkflow, releaseFilesystemLock } from '../core/workflow';
    26	import { loadCollectedData } from '../loaders';
    27	import { collectSessionData } from '../extractors/collect-session-data';
    28	
    29	type StructuredCollectedData = Record<string, unknown> & { _source: 'file' };
    30	
    31	interface ParsedCliArguments {
    32	  dataFile: string | null;
    33	  specFolderArg: string | null;
    34	  collectedData: StructuredCollectedData | null;
    35	  sessionId: string | null;
    36	}
    37	
    38	// ───────────────────────────────────────────────────────────────
    39	// 2. INTERFACES
    40	// ───────────────────────────────────────────────────────────────
    41	/** Result of validating a requested spec folder reference. */
    42	export interface SpecFolderValidation {
    43	  valid: boolean;
    44	  reason?: string;
    45	  warning?: string;
    46	}
    47	
    48	// ───────────────────────────────────────────────────────────────
    49	// 3. HELP TEXT
    50	// ───────────────────────────────────────────────────────────────
    51	const HELP_TEXT = `
    52	Usage: node generate-context.js [options] <input>
    53	
    54	Arguments:
    55	  <input>           A JSON data file path
    56	                    - JSON file mode: node generate-context.js data.json [spec-folder]
    57	
    58	Options:
    59	  --help, -h        Show this help message
    60	  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
    61	  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
    62	  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
    63	
    64	Examples:
    65	  node generate-context.js /tmp/context-data.json
    66	  node generate-context.js /tmp/context-data.json specs/001-feature/
    67	  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
    68	  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
    69	  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
    70	
    71	Output:
    72	  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
    73	  for indexing by the Spec Kit Memory system.
    74	
    75	Preferred save path (JSON-PRIMARY):
    76	  - ALWAYS use --stdin, --json, or a JSON temp file.
    77	  - The AI has strictly better information about its own session than any DB query can reconstruct.
    78	  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
    79	
    80	Direct CLI target rule:
    81	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    82	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    83	    but they must not reroute the save to another folder.
    84	
    85	JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
    86	  {
    87	    "user_prompts": [...],
    88	    "observations": [...],
    89	    "recent_context": [...],
    90	    "toolCalls": [
    91	      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
    92	      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    93	    ],
    94	    "exchanges": [
    95	      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    96	    ],
    97	    "preflight": {
    98	      "knowledgeScore": 40,
    99	      "uncertaintyScore": 60,
   100	      "contextScore": 50,
   101	      "timestamp": "ISO-8601",
   102	      "gaps": ["gap1", "gap2"],
   103	      "confidence": 45,
   104	      "readiness": "Needs research"
   105	    },
   106	    "postflight": {
   107	      "knowledgeScore": 75,
   108	      "uncertaintyScore": 25,
   109	      "contextScore": 80,
   110	      "gapsClosed": ["gap1"],
   111	      "newGaps": ["new-gap"]
   112	    }
   113	  }
   114	
   115	  Tool/Exchange enrichment fields (all optional — JSON-mode only):
   116	  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
   117	  - exchanges[]: Key user-assistant exchanges with timestamps
   118	  - These provide richer context than DB extraction since the AI filters noise at source
   119	
   120	  Learning Delta Calculation:
   121	  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
   122	  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
   123	  - Context Delta = postflight.contextScore - preflight.contextScore
   124	  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
   125	`;
   126	
   127	if (process.argv.includes('--help') || process.argv.includes('-h')) {
   128	  console.log(HELP_TEXT);
   129	  process.exit(0);
   130	}
   131	
   132	// 2.1 SIGNAL HANDLERS
   133	let signalHandlersInstalled = false;
   134	let shuttingDown = false;
   135	
   136	// Robustness: signal handler releases locks before reporting
   137	function handleSignalShutdown(signal: string): void {
   138	  if (shuttingDown) return; // prevent re-entrant handling
   139	  shuttingDown = true;
   140	
   141	  let lockReleaseFailed = false;
   142	  try {
   143	    releaseFilesystemLock();
   144	  } catch (_err: unknown) {
   145	    lockReleaseFailed = true;
   146	  }
   147	
   148	  console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
   149	  process.exit(lockReleaseFailed ? 1 : 0);
   150	}
   151	
   152	function installSignalHandlers(): void {
   153	  if (signalHandlersInstalled) {
   154	    return;
   155	  }
   156	
   157	  process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
   158	  process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
   159	
   160	  signalHandlersInstalled = true;
   161	}
   162	
   163	// ───────────────────────────────────────────────────────────────
   164	// 4. SPEC FOLDER VALIDATION
   165	// ───────────────────────────────────────────────────────────────
   166	function isUnderApprovedSpecsRoot(normalizedInput: string): boolean {
   167	  return validateFilePath(path.resolve(CONFIG.PROJECT_ROOT, normalizedInput), getSpecsDirectories()) !== null;
   168	}
   169	
   170	function isValidSpecFolder(folderPath: string): SpecFolderValidation {
   171	  const folderName = path.basename(folderPath);
   172	
   173	  // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
   174	  const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
   175	  // Extract the trailing portion that might be "parent/child"
   176	  const trailingSegments = normalizedInput.split('/');
   177	  // Check if the last two segments both match the spec folder pattern
   178	  if (trailingSegments.length >= 2) {
   179	    const lastTwo = trailingSegments.slice(-2);
   180	    if (SPEC_FOLDER_PATTERN.test(lastTwo[0]) && SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
   181	      // Both segments are valid spec folder names — valid nested spec folder
   182	      const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   183	
   184	      if (!hasSpecsParent) {
   185	        // Fallback: check if the path resolves to an existing directory under any specs root
   186	        for (const specsDir of getSpecsDirectories()) {
   187	          const candidate = path.join(specsDir, normalizedInput);
   188	          if (
   189	            !path.isAbsolute(normalizedInput) &&
   190	            fsSync.existsSync(candidate) &&
   191	            validateFilePath(candidate, getSpecsDirectories()) !== null
   192	          ) {
   193	            return { valid: true };
   194	          }
   195	        }
   196	        return {
   197	          valid: false,
   198	          reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   199	        };
   200	      }
   201	      return { valid: true };
   202	    }
   203	  }
   204	
   205	  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
   206	    if (/^\d{3}-/.test(folderName)) {
   207	      if (/[A-Z]/.test(folderName)) {
   208	        return { valid: false, reason: 'Spec folder name should be lowercase' };
   209	      }
   210	      if (/_/.test(folderName)) {
   211	        return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
   212	      }
   213	      if (!/^[a-z]/.test(folderName.slice(4))) {
   214	        return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
   215	      }
   216	    }
   217	    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
   218	  }
   219	
   220	  const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Collect Session Data
     3	// ───────────────────────────────────────────────────────────────
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. COLLECT SESSION DATA
     7	// ───────────────────────────────────────────────────────────────
     8	// Orchestrates session data collection — gathers observations, files, decisions, and context
     9	
    10	// Node stdlib
    11	import { execSync } from 'node:child_process';
    12	import * as path from 'path';
    13	import * as fsSync from 'fs';
    14	
    15	// Internal modules
    16	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../config';
    17	import { formatTimestamp } from '../utils/message-utils';
    18	import { pickBestContentName } from '../utils/slug-utils';
    19	import { structuredLog } from '../utils/logger';
    20	import { coerceFactsToText } from '../utils/fact-coercion';
    21	import { truncateOnWordBoundary } from '../lib/truncate-on-word-boundary';
    22	import { detectSpecFolder } from '../spec-folder';
    23	import { resolveSaveMode, SaveMode } from '../types/save-mode';
    24	
    25	import {
    26	  generateSessionId,
    27	  getChannel,
    28	  detectSessionCharacteristics,
    29	  buildProjectStateSnapshot,
    30	  calculateSessionDuration,
    31	  calculateExpiryEpoch,
    32	  detectRelatedDocs,
    33	} from './session-extractor';
    34	
    35	import {
    36	  detectObservationType,
    37	  extractFilesFromData,
    38	  buildObservationsWithAnchors,
    39	} from './file-extractor';
    40	
    41	import { buildImplementationGuideData } from './implementation-guide-extractor';
    42	import type { ImplementationGuideData } from './implementation-guide-extractor';
    43	
    44	import type {
    45	  CanonicalDocs,
    46	  CollectedDataBase,
    47	  ContextItem,
    48	  DistinguishingEvidenceItem,
    49	  FileChange,
    50	  FileEntry,
    51	  GapDescription,
    52	  Observation,
    53	  ObservationDetailed,
    54	  OutcomeEntry,
    55	  PendingTask,
    56	  PostflightData,
    57	  PreflightData,
    58	  RecentContextEntry,
    59	  SessionData,
    60	  SpecFileEntry,
    61	  ToolCounts,
    62	  UserPrompt,
    63	} from '../types/session-types';
    64	
    65	// Re-export canonical types for backward compatibility
    66	export type {
    67	  ContextItem,
    68	  GapDescription,
    69	  OutcomeEntry,
    70	  PendingTask,
    71	  PostflightData,
    72	  PreflightData,
    73	  SessionData,
    74	};
    75	
    76	/* ───────────────────────────────────────────────────────────────
    77	   1. INTERFACES
    78	------------------------------------------------------------------*/
    79	
    80	/** Aggregates preflight and postflight comparison results. */
    81	export interface PreflightPostflightResult {
    82	  HAS_PREFLIGHT_BASELINE: boolean;
    83	  HAS_POSTFLIGHT_DELTA: boolean;
    84	  PREFLIGHT_KNOW_SCORE: number | null;
    85	  PREFLIGHT_UNCERTAINTY_SCORE: number | null;
    86	  PREFLIGHT_CONTEXT_SCORE: number | null;
    87	  PREFLIGHT_KNOW_ASSESSMENT: string;
    88	  PREFLIGHT_UNCERTAINTY_ASSESSMENT: string;
    89	  PREFLIGHT_CONTEXT_ASSESSMENT: string;
    90	  PREFLIGHT_TIMESTAMP: string | null;
    91	  PREFLIGHT_GAPS: GapDescription[];
    92	  PREFLIGHT_CONFIDENCE: number | null;
    93	  PREFLIGHT_UNCERTAINTY_RAW: number | null;
    94	  PREFLIGHT_READINESS: string | null;
    95	  POSTFLIGHT_KNOW_SCORE: number | null;
    96	  POSTFLIGHT_UNCERTAINTY_SCORE: number | null;
    97	  POSTFLIGHT_CONTEXT_SCORE: number | null;
    98	  DELTA_KNOW_SCORE: string | null;
    99	  DELTA_UNCERTAINTY_SCORE: string | null;
   100	  DELTA_CONTEXT_SCORE: string | null;
   101	  DELTA_KNOW_TREND: string;
   102	  DELTA_UNCERTAINTY_TREND: string;
   103	  DELTA_CONTEXT_TREND: string;
   104	  LEARNING_INDEX: number | null;
   105	  LEARNING_SUMMARY: string;
   106	  GAPS_CLOSED: GapDescription[];
   107	  NEW_GAPS: GapDescription[];
   108	}
   109	
   110	/** Captures the synthesized data needed to continue a session. */
   111	export interface ContinueSessionData {
   112	  SESSION_STATUS: string;
   113	  COMPLETION_PERCENT: number;
   114	  LAST_ACTIVITY_TIMESTAMP: string;
   115	  SESSION_DURATION: string;
   116	  CONTINUATION_COUNT: number;
   117	  CONTEXT_SUMMARY: string;
   118	  PENDING_TASKS: PendingTask[];
   119	  NEXT_CONTINUATION_COUNT: number;
   120	  RESUME_CONTEXT: ContextItem[];
   121	}
   122	
   123	interface CanonicalSourceEntry {
   124	  ROLE: string;
   125	  FILE_NAME: string;
   126	  FILE_PATH: string;
   127	  DESCRIPTION: string;
   128	}
   129	
   130	/** Full collected session payload used by downstream extractors. */
   131	export interface CollectedDataFull extends CollectedDataBase {}
   132	
   133	/* ───────────────────────────────────────────────────────────────
   134	   2. PREFLIGHT/POSTFLIGHT UTILITIES
   135	------------------------------------------------------------------*/
   136	
   137	function getScoreAssessment(score: number | null | undefined, metric: string): string {
   138	  if (score === null || score === undefined || isNaN(score)) {
   139	    return '';
   140	  }
   141	  if (metric === 'uncertainty') {
   142	    if (score <= 20) return 'Very low uncertainty';
   143	    if (score <= 40) return 'Low uncertainty';
   144	    if (score <= 60) return 'Moderate uncertainty';
   145	    if (score <= 80) return 'High uncertainty';
   146	    return 'Very high uncertainty';
   147	  }
   148	  if (score >= 80) return 'Strong';
   149	  if (score >= 60) return 'Good';
   150	  if (score >= 40) return 'Moderate';
   151	  if (score >= 20) return 'Limited';
   152	  return 'Minimal';
   153	}
   154	
   155	function getTrendIndicator(delta: number | null | undefined, invertedBetter: boolean = false): string {
   156	  if (delta === null || delta === undefined || isNaN(delta)) {
   157	    return '\u2192';
   158	  }
   159	  if (invertedBetter) {
   160	    if (delta > 0) return '\u2193';
   161	    if (delta < 0) return '\u2191';
   162	    return '\u2192';
   163	  }
   164	  if (delta > 0) return '\u2191';
   165	  if (delta < 0) return '\u2193';
   166	  return '\u2192';
   167	}
   168	
   169	function calculateLearningIndex(
   170	  deltaKnow: number | null | undefined,
   171	  deltaUncert: number | null | undefined,
   172	  deltaContext: number | null | undefined
   173	): number {
   174	  const dk = deltaKnow ?? 0;
   175	  const du = deltaUncert ?? 0;
   176	  const dc = deltaContext ?? 0;
   177	  const index =
   178	    (dk * CONFIG.LEARNING_WEIGHTS.knowledge) +
   179	    (du * CONFIG.LEARNING_WEIGHTS.uncertainty) +
   180	    (dc * CONFIG.LEARNING_WEIGHTS.context);
   181	  return Math.round(Math.max(0, Math.min(100, index)));
   182	}
   183	
   184	function extractPreflightPostflightData(collectedData: CollectedDataFull | null): PreflightPostflightResult {
   185	  const preflight = collectedData?.preflight;
   186	  const postflight = collectedData?.postflight;
   187	  const hasPreflightBaseline = Boolean(
   188	    preflight && (
   189	      typeof preflight.knowledgeScore === 'number' ||
   190	      typeof preflight.uncertaintyScore === 'number' ||
   191	      typeof preflight.contextScore === 'number' ||
   192	      typeof preflight.timestamp === 'string' ||
   193	      (preflight.gaps?.length ?? 0) > 0 ||
   194	      typeof preflight.confidence === 'number' ||
   195	      typeof preflight.uncertaintyRaw === 'number' ||
   196	      typeof preflight.readiness === 'string'
   197	    )
   198	  );
   199	  const hasPostflightDelta = Boolean(
   200	    preflight && postflight &&
   201	    Number.isFinite(preflight.knowledgeScore) &&
   202	    Number.isFinite(postflight.knowledgeScore) &&
   203	    Number.isFinite(preflight.uncertaintyScore) &&
   204	    Number.isFinite(postflight.uncertaintyScore) &&
   205	    Number.isFinite(preflight.contextScore) &&
   206	    Number.isFinite(postflight.contextScore)
   207	  );
   208	
   209	  const DEFAULT_VALUE = null;
   210	
   211	  // F-35: Guard against NaN/Infinity — replace with null
   212	  const safeNum = (v: number | undefined | null): number | null =>
   213	    v !== undefined && v !== null && Number.isFinite(v) ? v : null;
   214	
   215	  const preflightData = {
   216	    PREFLIGHT_KNOW_SCORE: safeNum(preflight?.knowledgeScore),
   217	    PREFLIGHT_UNCERTAINTY_SCORE: safeNum(preflight?.uncertaintyScore),
   218	    PREFLIGHT_CONTEXT_SCORE: safeNum(preflight?.contextScore),
   219	    PREFLIGHT_KNOW_ASSESSMENT: getScoreAssessment(preflight?.knowledgeScore, 'knowledge'),
   220	    PREFLIGHT_UNCERTAINTY_ASSESSMENT: getScoreAssessment(preflight?.uncertaintyScore, 'uncertainty'),
   221	    PREFLIGHT_CONTEXT_ASSESSMENT: getScoreAssessment(preflight?.contextScore, 'context'),
   222	    PREFLIGHT_TIMESTAMP: preflight?.timestamp ?? DEFAULT_VALUE,
   223	    PREFLIGHT_GAPS: preflight?.gaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
   224	    PREFLIGHT_CONFIDENCE: safeNum(preflight?.confidence),
   225	    PREFLIGHT_UNCERTAINTY_RAW: safeNum(preflight?.uncertaintyRaw ?? preflight?.uncertaintyScore),
   226	    PREFLIGHT_READINESS: preflight?.readiness ?? DEFAULT_VALUE
   227	  };
   228	
   229	  const postflightData = {
   230	    POSTFLIGHT_KNOW_SCORE: safeNum(postflight?.knowledgeScore),
   231	    POSTFLIGHT_UNCERTAINTY_SCORE: safeNum(postflight?.uncertaintyScore),
   232	    POSTFLIGHT_CONTEXT_SCORE: safeNum(postflight?.contextScore)
   233	  };
   234	
   235	  let deltaData: {
   236	    DELTA_KNOW_SCORE: string | null;
   237	    DELTA_UNCERTAINTY_SCORE: string | null;
   238	    DELTA_CONTEXT_SCORE: string | null;
   239	    DELTA_KNOW_TREND: string;
   240	    DELTA_UNCERTAINTY_TREND: string;
   241	    DELTA_CONTEXT_TREND: string;
   242	    LEARNING_INDEX: number | null;
   243	    LEARNING_SUMMARY: string;
   244	  } = {
   245	    DELTA_KNOW_SCORE: DEFAULT_VALUE,
   246	    DELTA_UNCERTAINTY_SCORE: DEFAULT_VALUE,
   247	    DELTA_CONTEXT_SCORE: DEFAULT_VALUE,
   248	    DELTA_KNOW_TREND: '\u2192',
   249	    DELTA_UNCERTAINTY_TREND: '\u2192',
   250	    DELTA_CONTEXT_TREND: '\u2192',
   251	    LEARNING_INDEX: DEFAULT_VALUE,
   252	    LEARNING_SUMMARY: 'Learning metrics will be calculated when both preflight and postflight data are provided.'
   253	  };
   254	
   255	  if (hasPostflightDelta) {
   256	    const deltaKnow = (postflight?.knowledgeScore ?? 0) - (preflight?.knowledgeScore ?? 0);
   257	    const deltaUncert = (preflight?.uncertaintyScore ?? 0) - (postflight?.uncertaintyScore ?? 0);
   258	    const deltaContext = (postflight?.contextScore ?? 0) - (preflight?.contextScore ?? 0);
   259	
   260	    const learningIndex = calculateLearningIndex(deltaKnow, deltaUncert, deltaContext);

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "generateResumeContext|ContinueSessionData|SESSION_STATUS|COMPLETION_PERCENT|PENDING_TASKS|RESUME_CONTEXT|LAST_ACTIVITY_TIMESTAMP|CONTINUATION_COUNT" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
111:export interface ContinueSessionData {
112:  SESSION_STATUS: string;
113:  COMPLETION_PERCENT: number;
114:  LAST_ACTIVITY_TIMESTAMP: string;
116:  CONTINUATION_COUNT: number;
118:  PENDING_TASKS: PendingTask[];
119:  NEXT_CONTINUATION_COUNT: number;
120:  RESUME_CONTEXT: ContextItem[];
735:function generateResumeContext(
989:function buildContinueSessionData(params: ContinueSessionParams): ContinueSessionData {
1002:  const resumeContext = generateResumeContext(FILES, SPEC_FILES, observations);
1016:    SESSION_STATUS: sessionStatus,
1017:    COMPLETION_PERCENT: completionPercent,
1018:    LAST_ACTIVITY_TIMESTAMP: lastActivity,
1020:    CONTINUATION_COUNT: continuationCount,
1022:    PENDING_TASKS: pendingTasks,
1023:    NEXT_CONTINUATION_COUNT: continuationCount + 1,
1024:    RESUME_CONTEXT: resumeContext
1517:  const continueSessionData = buildContinueSessionData({
1619:  buildContinueSessionData,
1624:  generateResumeContext,

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '600,780p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   600	      let match: RegExpExecArray | null;
   601	      pattern.lastIndex = 0;
   602	      while ((match = pattern.exec(text)) !== null) {
   603	        const taskDesc = match[1].trim().substring(0, 100);
   604	        if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
   605	          seen.add(taskDesc.toLowerCase());
   606	          tasks.push({
   607	            TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
   608	            TASK_DESCRIPTION: taskDesc,
   609	            TASK_PRIORITY: 'P1'
   610	          });
   611	        }
   612	      }
   613	    }
   614	
   615	    if (obs.facts) {
   616	      const factTexts = coerceFactsToText(obs.facts, {
   617	        component: 'collect-session-data',
   618	        fieldPath: 'observations[].facts',
   619	      });
   620	      for (const factText of factTexts) {
   621	        for (const pattern of taskPatterns) {
   622	          let match: RegExpExecArray | null;
   623	          pattern.lastIndex = 0;
   624	          while ((match = pattern.exec(factText)) !== null) {
   625	            const taskDesc = match[1].trim().substring(0, 100);
   626	            if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
   627	              seen.add(taskDesc.toLowerCase());
   628	              tasks.push({
   629	                TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
   630	                TASK_DESCRIPTION: taskDesc,
   631	                TASK_PRIORITY: 'P2'
   632	              });
   633	            }
   634	          }
   635	        }
   636	      }
   637	    }
   638	  }
   639	
   640	  if (nextAction &&
   641	      nextAction !== 'Continue implementation' &&
   642	      !seen.has(nextAction.toLowerCase())) {
   643	    tasks.unshift({
   644	      TASK_ID: 'T000',
   645	      TASK_DESCRIPTION: nextAction,
   646	      TASK_PRIORITY: 'P0'
   647	    });
   648	  }
   649	
   650	  return tasks.slice(0, 10);
   651	}
   652	
   653	function generateContextSummary(
   654	  summary: string,
   655	  observations: Observation[],
   656	  projectPhase: string,
   657	  decisionCount: number
   658	): string {
   659	  const parts: string[] = [];
   660	
   661	  parts.push(`**Phase:** ${projectPhase}`);
   662	
   663	  if (observations.length > 0) {
   664	    const recentTitles = observations
   665	      .slice(-3)
   666	      .map((o) => o.title)
   667	      .filter((t): t is string => !!t && t.length > 5)
   668	      .join(', ');
   669	    if (recentTitles) {
   670	      parts.push(`**Recent:** ${recentTitles}`);
   671	    }
   672	  }
   673	
   674	  if (decisionCount > 0) {
   675	    parts.push(`**Decisions:** ${decisionCount} decision${decisionCount > 1 ? 's' : ''} recorded`);
   676	  }
   677	
   678	  return parts.join('\n\n');
   679	}
   680	
   681	function normalizeProposition(text: string): string {
   682	  return text
   683	    .toLowerCase()
   684	    .replace(/[^a-z0-9\s]+/g, ' ')
   685	    .replace(/\s+/g, ' ')
   686	    .trim();
   687	}
   688	
   689	function extractDecisionTitle(value: string | Record<string, unknown>): string {
   690	  const toText = (input: unknown): string => typeof input === 'string' ? input.trim() : '';
   691	  const decisionText = typeof value === 'string'
   692	    ? value.trim()
   693	    : toText(value.decision) || toText(value.title) || '';
   694	
   695	  if (!decisionText) {
   696	    return '';
   697	  }
   698	
   699	  const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
   700	  return titleMatch?.[1]?.trim() || decisionText;
   701	}
   702	
   703	function collectDecisionPropositions(
   704	  collectedData: CollectedDataFull,
   705	  observations: Observation[],
   706	): Set<string> {
   707	  const propositions = new Set<string>();
   708	  const rawDecisions = Array.isArray(collectedData._manualDecisions)
   709	    ? collectedData._manualDecisions as Array<string | Record<string, unknown>>
   710	    : Array.isArray(collectedData.keyDecisions)
   711	      ? collectedData.keyDecisions as Array<string | Record<string, unknown>>
   712	      : [];
   713	
   714	  for (const decision of rawDecisions) {
   715	    const normalized = normalizeProposition(extractDecisionTitle(decision));
   716	    if (normalized) {
   717	      propositions.add(normalized);
   718	    }
   719	  }
   720	
   721	  for (const observation of observations) {
   722	    if (detectObservationType(observation) !== 'decision') {
   723	      continue;
   724	    }
   725	
   726	    const normalized = normalizeProposition(observation.title || observation.narrative || '');
   727	    if (normalized) {
   728	      propositions.add(normalized);
   729	    }
   730	  }
   731	
   732	  return propositions;
   733	}
   734	
   735	function generateResumeContext(
   736	  files: FileChange[],
   737	  specFiles: SpecFileEntry[],
   738	  observations: Observation[]
   739	): ContextItem[] {
   740	  const items: ContextItem[] = [];
   741	
   742	  if (files.length > 0) {
   743	    const fileList = files.slice(0, 3).map((f) => f.FILE_PATH).join(', ');
   744	    items.push({ CONTEXT_ITEM: `Files modified: ${fileList}` });
   745	  }
   746	
   747	  const priorityDocs = ['tasks.md', 'checklist.md', 'plan.md'];
   748	  const relevantDocs = specFiles.filter((sf) => priorityDocs.includes(sf.FILE_NAME));
   749	  if (relevantDocs.length > 0) {
   750	    items.push({ CONTEXT_ITEM: `Check: ${relevantDocs.map((d) => d.FILE_NAME).join(', ')}` });
   751	  }
   752	
   753	  const lastMeaningful = [...observations].reverse().find((o) => o.narrative && o.narrative.length > 50);
   754	  if (lastMeaningful) {
   755	    const lastSource = [lastMeaningful.title, lastMeaningful.narrative]
   756	      .find((value): value is string => typeof value === 'string' && value.trim().length >= 20)
   757	      || lastMeaningful.narrative
   758	      || lastMeaningful.title
   759	      || '';
   760	    const lastTruncated = truncateOnWordBoundary(lastSource.trim(), 80, {
   761	      ellipsis: '…',
   762	      minBoundary: 20,
   763	    });
   764	    if (lastTruncated.replace(/…$/, '').trim().length >= 20) {
   765	      items.push({ CONTEXT_ITEM: `Last: ${lastTruncated}` });
   766	    }
   767	  }
   768	
   769	  return items.slice(0, 5);
   770	}
   771	
   772	// CanonicalDocs type lives in scripts/types/session-types.ts — imported above.
   773	
   774	function deriveCanonicalDocPointers(
   775	  specFiles: SpecFileEntry[],
   776	  options: {
   777	    contextType: string;
   778	    preferDecisionRecord: boolean;
   779	    preferImplementationSummary: boolean;
   780	    preferReviewReport: boolean;

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '730,780p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   761	      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
   762	    },
   763	    required: [],
   764	  },
   765	  outputSchema: {
   766	    type: 'object',
   767	    properties: {
   768	      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
   769	      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
   770	      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
   771	      hints: { type: 'array', items: { type: 'string' }, description: 'Aggregated hints from sub-calls' },
   772	      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
   773	    },
   774	    required: ['resume', 'health', 'hints', 'nextActions'],
   775	  },
   776	};
   777	
   778	// L9: Coverage Graph - Deep loop coverage analysis tools
   779	const deepLoopGraphUpsert: ToolDefinition = {
   780	  name: 'deep_loop_graph_upsert',

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '35,70p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '205,225p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"handleSessionResume|handleMemoryContext|loadMostRecentState|cachedSummary|minimal|memory_context\\(|sessionQuality|hints.push|CACHED_SESSION_SUMMARY_MAX_AGE_MS\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts -S" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
10:import { handleMemoryContext } from './memory-context.js';
34:import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
42:export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
84:  cachedSummary: CachedSessionSummary | null;
90:  minimal?: boolean;
110:  cachedSummary?: CachedSessionSummaryDecision;
112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
170:    cachedSummary: null,
283:  const maxAgeMs = options.maxAgeMs ?? CACHED_SESSION_SUMMARY_MAX_AGE_MS;
332:    cachedSummary: {
358:    options.state ?? loadMostRecentState({
372:): T & { cachedSummary?: CachedSessionSummary } {
373:  if (decision.status !== 'accepted' || !decision.cachedSummary) {
379:    cachedSummary: decision.cachedSummary,
401:export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
411:  if (args.minimal) {
412:    memoryResult = { skipped: true, reason: 'minimal mode' };
415:      const mcpResponse = await handleMemoryContext({
433:      hints.push('Memory resume failed. Try memory_context manually.');
459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
468:    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
480:  const cachedSummaryDecision = getCachedSessionSummaryDecision({
484:  if (cachedSummaryDecision.status === 'accepted') {
485:    hints.push('Cached continuity summary accepted as additive resume context.');
487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
490:  let sessionQuality: SessionResumeResult['sessionQuality'];
491:  if (args.minimal) {
493:      sessionQuality = computeQualityScore().level;
495:      sessionQuality = 'unknown';
499:  const memoryCertainty: SharedPayloadCertainty = args.minimal
504:  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
518:  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
523:        cachedSummaryDecision.cachedSummary.continuityText,
524:        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
525:        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
564:      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
587:    cachedSummary: cachedSummaryDecision,
595:    ...(sessionQuality ? { sessionQuality } : {}),
600:  if (!args.minimal) {

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	      'freshness',
   321	      'unknown_scope',
   322	      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
   323	    );
   324	  }
   325	
   326	  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
   327	  return {
   328	    status: 'accepted',
   329	    category: 'accepted',
   330	    reason: 'accepted',
   331	    detail: 'Cached summary passed fidelity and freshness gates and may be used additively.',
   332	    cachedSummary: {
   333	      schemaVersion: candidate.schemaVersion,
   334	      lastSpecFolder: cachedSpecFolder,
   335	      summaryText,
   336	      extractedAt: candidate.extractedAt!,
   337	      lastClaudeTurnAt: producerMetadata.lastClaudeTurnAt!,
   338	      transcriptPath: transcript.path,
   339	      transcriptFingerprint: transcript.fingerprint,
   340	      cacheCreationInputTokens: cacheTokens.cacheCreationInputTokens,
   341	      cacheReadInputTokens: cacheTokens.cacheReadInputTokens,
   342	      continuityText,
   343	      startupHint: continuityText,
   344	    },
   345	  };
   346	}
   347	
   348	export function getCachedSessionSummaryDecision(
   349	  options: {
   350	    specFolder?: string;
   351	    claudeSessionId?: string;
   352	    nowMs?: number;
   353	    maxAgeMs?: number;
   354	    state?: HookState | null;
   355	  } = {},
   356	): CachedSessionSummaryDecision {
   357	  const candidate = buildCachedSessionSummaryCandidate(
   358	    options.state ?? loadMostRecentState({
   359	      maxAgeMs: options.maxAgeMs,
   360	      scope: {
   361	        specFolder: options.specFolder,
   362	        claudeSessionId: options.claudeSessionId,
   363	      },
   364	    }),
   365	  );
   366	  return evaluateCachedSessionSummaryCandidate(candidate, options);
   367	}
   368	
   369	export function applyCachedSummaryAdditively<T extends Record<string, unknown>>(
   370	  baseline: T,
   371	  decision: CachedSessionSummaryDecision,
   372	): T & { cachedSummary?: CachedSessionSummary } {
   373	  if (decision.status !== 'accepted' || !decision.cachedSummary) {
   374	    return { ...baseline };
   375	  }
   376	
   377	  return {
   378	    ...baseline,
   379	    cachedSummary: decision.cachedSummary,
   380	  };
   381	}
   382	
   383	export function logCachedSummaryDecision(
   384	  surface: string,
   385	  decision: CachedSessionSummaryDecision,
   386	): void {
   387	  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
   388	    return;
   389	  }
   390	
   391	  console.error(
   392	    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
   393	  );
   394	}
   395	
   396	/* ───────────────────────────────────────────────────────────────
   397	   3. HANDLER
   398	──────────────────────────────────────────────────────────────── */
   399	
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '520,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   611	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   612	    }],
   613	  };
   614	}

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"effectiveSessionId|server-generated|resolveTrustedSession|sessionTransition|mode === 'resume'|profile: 'resume'|sessionId\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts -S" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
84:  sessionId?: string;
90:  sessionTransition?: SessionTransitionTrace;
96:  effectiveSessionId: string;
121:  sessionId?: string;
145:  effectiveSessionId: string;
186:  sessionTransition: SessionTransitionTrace;
709:    session_id: options.sessionId,
734:    sessionId: options.sessionId,
735:    sessionTransition: options.sessionTransition,
765:    sessionId: options.sessionId,
766:    sessionTransition: options.sessionTransition,
799:    sessionId: options.sessionId,
800:    sessionTransition: options.sessionTransition,
828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
836:      effectiveSessionId: '',
845:  const effectiveSessionId = trustedSession.effectiveSessionId;
848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
856:    effectiveSessionId,
1010:    sessionTransition,
1031:            includeTrace === true ? sessionTransition : undefined,
1223:    effectiveSessionId,
1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
1243:    effectiveSessionId,
1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
1286:    sessionId: effectiveSessionId,
1304:      effectiveSessionId,
1336:  const sessionTransition = buildSessionTransitionTrace({
1345:  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
1430:      sessionTransition,
1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
1502:      sessionTransition,
1530:        session_id: effectiveSessionId,

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,870p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   861	}
   862	
   863	function resolveEffectiveMode(
   864	  args: ContextArgs,
   865	  session: SessionLifecycleResolution,
   866	  pressurePolicy: {
   867	    level: string;
   868	    ratio: number | null;
   869	    source: string;
   870	    warning: string | null;

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1328,1365p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1328	        options.profile = autoProfile;
  1329	        console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
  1330	      }
  1331	    } catch (_autoProfileErr: unknown) {
  1332	      // Auto-profile is best-effort — never breaks context retrieval
  1333	    }
  1334	  }
  1335	
  1336	  const sessionTransition = buildSessionTransitionTrace({
  1337	    previousState,
  1338	    resumedSession,
  1339	    effectiveMode,
  1340	    requestedMode: requested_mode,
  1341	    detectedIntent: detectedIntent ?? null,
  1342	    pressureOverrideApplied,
  1343	    queryHeuristicApplied: resumeHeuristicApplied,
  1344	  });
  1345	  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
  1346	
  1347	  const discoveredFolder = maybeDiscoverSpecFolder(options, { ...args, input: normalizedInput });
  1348	  // FIX P0: Folder discovery sets options.folderBoost for scoring only.
  1349	  // Do NOT propagate as options.specFolder — that becomes an exact-match filter
  1350	  // in vector-index-queries.ts (m.spec_folder = ?) which silently drops all
  1351	  // results when the discovered path has no indexed memories.
  1352	  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
  1353	    specFolder: options.specFolder ?? discoveredFolder ?? spec_folder,
  1354	    tenantId: args.tenantId,
  1355	    userId: args.userId,
  1356	    agentId: args.agentId,
  1357	    currentTask: normalizedInput.slice(0, 500),
  1358	  });
  1359	  if (!sessionStateResult.success) {
  1360	    console.warn(
  1361	      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
  1362	    );
  1363	  }
  1364	
  1365	  let result: ContextResult;

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1428,1445p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts | sed -n '300,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
   301	async function handleTaskPreflight(args: PreflightArgs): Promise<MCPResponse> {
   302	  const {
   303	    specFolder: spec_folder,
   304	    taskId,
   305	    knowledgeScore: knowledge_score,
   306	    uncertaintyScore: uncertainty_score,
   307	    contextScore: context_score,
   308	    knowledgeGaps = [],
   309	    sessionId: session_id = null
   310	  } = args;
   311	
   312	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
   313	  if (!spec_folder) {
   314	    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'specFolder is required', { param: 'specFolder' });
   315	  }
   316	  if (!taskId) {
   317	    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'taskId is required', { param: 'taskId' });
   318	  }
   319	
   320	  // T304: Consolidated score validation
   321	  validateScores(knowledge_score, uncertainty_score, context_score);
   322	
   323	  await checkDatabaseUpdated();
   324	
   325	  const database: Database | null = vectorIndex.getDb();
   326	  if (!database) {
   327	    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Database not initialized. Server may still be starting up.', {});
   328	  }
   329	
   330	  ensureSchema(database);
   331	
   332	  const now = new Date().toISOString();
   333	  const gapsJson = JSON.stringify(knowledgeGaps);
   334	  const normalizedSessionId = normalizeSessionId(session_id);
   335	
   336	  // Re-record the current baseline when the same task is already open in the
   337	  // same session (or in the anonymous/null session bucket).
   338	  const existing = database.prepare(
   339	    `SELECT id, phase
   340	     FROM session_learning
   341	     WHERE spec_folder = ?
   342	       AND task_id = ?
   343	       AND phase = 'preflight'
   344	       AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
   345	     ORDER BY updated_at DESC, id DESC
   346	     LIMIT 1`
   347	  ).get(spec_folder, taskId, normalizedSessionId, normalizedSessionId) as { id: number; phase: string } | undefined;
   348	
   349	  if (existing) {
   350	    const updateStmt = database.prepare(`
   351	      UPDATE session_learning
   352	      SET session_id = ?, pre_knowledge_score = ?, pre_uncertainty_score = ?, pre_context_score = ?, knowledge_gaps = ?, updated_at = ?
   353	      WHERE id = ?
   354	    `);
   355	
   356	    try {
   357	      updateStmt.run(
   358	        normalizedSessionId,
   359	        knowledge_score,
   360	        uncertainty_score,
   361	        context_score,
   362	        gapsJson,
   363	        now,
   364	        existing.id
   365	      );
   366	
   367	      console.error(`[session-learning] Preflight updated (existing): spec=${spec_folder}, task=${taskId}, id=${existing.id}`);
   368	
   369	      return createMCPSuccessResponse({
   370	        tool: 'task_preflight',
   371	        summary: `Preflight baseline updated for ${taskId} (re-recorded)`,
   372	        data: {
   373	          success: true,
   374	          record: {
   375	            id: existing.id,
   376	            specFolder: spec_folder,
   377	            taskId: taskId,
   378	            sessionId: normalizedSessionId,
   379	            phase: 'preflight',
   380	            baseline: {
   381	              knowledge: knowledge_score,
   382	              uncertainty: uncertainty_score,
   383	              context: context_score
   384	            },
   385	            knowledgeGaps: knowledgeGaps,
   386	            timestamp: now
   387	          },
   388	          note: 'Existing preflight record was updated (not replaced)'
   389	        }
   390	      });
   391	    } catch (e: unknown) {
   392	      const message = toErrorMessage(e);
   393	      throw new MemoryError(ErrorCodes.DATABASE_ERROR, `Failed to update preflight record: ${message}`, {});
   394	    }
   395	  }
   396	
   397	  const stmt = database.prepare(`
   398	    INSERT INTO session_learning
   399	    (spec_folder, task_id, phase, session_id, pre_knowledge_score, pre_uncertainty_score, pre_context_score, knowledge_gaps, created_at, updated_at)
   400	    VALUES (?, ?, 'preflight', ?, ?, ?, ?, ?, ?, ?)
   401	  `);
   402	
   403	  try {
   404	    const result = stmt.run(
   405	      spec_folder,
   406	      taskId,
   407	      normalizedSessionId,
   408	      knowledge_score,
   409	      uncertainty_score,
   410	      context_score,
   411	      gapsJson,
   412	      now,
   413	      now
   414	    );
   415	
   416	    const recordId = result.lastInsertRowid;
   417	    console.error(`[session-learning] Preflight recorded: spec=${spec_folder}, task=${taskId}, id=${recordId}`);
   418	
   419	    return createMCPSuccessResponse({
   420	      tool: 'task_preflight',
   421	      summary: `Preflight baseline captured for ${taskId}`,
   422	      data: {
   423	        success: true,
   424	        record: {
   425	          id: Number(recordId),
   426	          specFolder: spec_folder,
   427	          taskId: taskId,
   428	          sessionId: normalizedSessionId,
   429	          phase: 'preflight',
   430	          baseline: {
   431	            knowledge: knowledge_score,
   432	            uncertainty: uncertainty_score,
   433	            context: context_score
   434	          },
   435	          knowledgeGaps: knowledgeGaps,
   436	          timestamp: now
   437	        }
   438	      },
   439	      hints: [
   440	        normalizedSessionId
   441	          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
   442	          : `Call task_postflight with taskId: "${taskId}" after completing the task`,
   443	        'Knowledge gaps can guide your exploration focus'
   444	      ]
   445	    });
   446	  } catch (err: unknown) {
   447	    const message = toErrorMessage(err);
   448	    console.error('[session-learning] Failed to insert preflight record:', message);
   449	    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to store preflight record', { originalError: message });
   450	  }
   451	}
   452	
   453	/* ───────────────────────────────────────────────────────────────
   454	   4. TASK POSTFLIGHT HANDLER
   455	──────────────────────────────────────────────────────────────── */
   456	
   457	/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
   458	async function handleTaskPostflight(args: PostflightArgs): Promise<MCPResponse> {
   459	  const {
   460	    specFolder: spec_folder,

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && rg -n "session|summary|continu|resume|state" src/types.ts src/reporter.ts src/drift/index.ts src/drift/scoring.ts -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
src/reporter.ts:19:    printSummary(report);
src/reporter.ts:38:  printSummary(report);
src/reporter.ts:63:function printSummary(report: DriftReport): void {

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/types.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/reporter.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/drift/index.ts | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/drift/scoring.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve got enough to see the core shape: Mex doesn’t really “resume a session” in the way our system does; it reconstructs continuity by forcing every new session to reread a maintained scaffold. I’m pulling the exact save/continue lines from our extractors now so the final writeup can make that gap explicit with source evidence instead of hand-waving.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '980,1035p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   980	  projectPhase: string;
   981	  lastAction: string;
   982	  nextAction: string;
   983	  blockers: string;
   984	  duration: string;
   985	  decisionCount: number;
   986	  collectedData?: CollectedDataFull | null;
   987	}
   988	
   989	function buildContinueSessionData(params: ContinueSessionParams): ContinueSessionData {
   990	  const {
   991	    observations, userPrompts, toolCounts, recentContext,
   992	    FILES, SPEC_FILES, summary, projectPhase, nextAction,
   993	    blockers, duration, decisionCount, collectedData
   994	  } = params;
   995	
   996	  const sessionStatus = determineSessionStatus(blockers, observations, userPrompts.length, collectedData);
   997	  const completionPercent = estimateCompletionPercent(
   998	    observations, userPrompts.length, toolCounts, sessionStatus, collectedData
   999	  );
  1000	  const pendingTasks = extractPendingTasks(observations, recentContext, nextAction);
  1001	  const contextSummary = generateContextSummary(summary, observations, projectPhase, decisionCount);
  1002	  const resumeContext = generateResumeContext(FILES, SPEC_FILES, observations);
  1003	  const continuationCount = recentContext?.[0]?.continuationCount ?? 1;
  1004	
  1005	  const lastPrompt = userPrompts[userPrompts.length - 1];
  1006	  // F-19 — Guard against invalid timestamps that cause RangeError on toISOString()
  1007	  let lastActivity: string;
  1008	  if (lastPrompt?.timestamp) {
  1009	    const d = new Date(lastPrompt.timestamp);
  1010	    lastActivity = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  1011	  } else {
  1012	    lastActivity = new Date().toISOString();
  1013	  }
  1014	
  1015	  return {
  1016	    SESSION_STATUS: sessionStatus,
  1017	    COMPLETION_PERCENT: completionPercent,
  1018	    LAST_ACTIVITY_TIMESTAMP: lastActivity,
  1019	    SESSION_DURATION: duration,
  1020	    CONTINUATION_COUNT: continuationCount,
  1021	    CONTEXT_SUMMARY: contextSummary,
  1022	    PENDING_TASKS: pendingTasks,
  1023	    NEXT_CONTINUATION_COUNT: continuationCount + 1,
  1024	    RESUME_CONTEXT: resumeContext
  1025	  };
  1026	}
  1027	
  1028	/* ───────────────────────────────────────────────────────────────
  1029	   4. LAZY-LOADED DEPENDENCIES
  1030	------------------------------------------------------------------*/
  1031	
  1032	import * as simFactoryModule from '../lib/simulation-factory';
  1033	function getSimFactory(): typeof import('../lib/simulation-factory') {
  1034	  return simFactoryModule;
  1035	}

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"runWorkflow\\(|collectSessionData\\(|loadCollectedData\\(|sessionId\" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts -S" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
35:  sessionId: string | null;
386:    sessionId: null,
398:  let sessionId: string | null = null;
406:      sessionId = candidate.trim();
415:    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
420:    return { ...structured, sessionId };
435:    sessionId,
562:    await runWorkflow({
568:        : () => loadCollectedData({}),
570:      sessionId: parsed.sessionId ?? undefined,

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '300,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	
   301	function extractPayloadSpecFolder(data: Record<string, unknown>): string | null {
   302	  for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
   303	    const value = data[key];
   304	    if (typeof value === 'string' && value.trim().length > 0) {
   305	      return value.trim();
   306	    }
   307	  }
   308	
   309	  return null;
   310	}
   311	
   312	async function readAllStdin(stdin: NodeJS.ReadStream = process.stdin): Promise<string> {
   313	  return await new Promise<string>((resolve, reject) => {
   314	    let buffer = '';
   315	    stdin.setEncoding('utf8');
   316	    stdin.on('data', (chunk: string) => {
   317	      buffer += chunk;
   318	    });
   319	    stdin.on('end', () => resolve(buffer));
   320	    stdin.on('error', reject);
   321	  });
   322	}
   323	
   324	function parseStructuredJson(rawJson: string, sourceLabel: '--stdin' | '--json'): Record<string, unknown> {
   325	  if (rawJson.trim().length === 0) {
   326	    throw new Error(`${sourceLabel} requires a non-empty JSON object`);
   327	  }
   328	
   329	  let parsed: unknown;
   330	  try {
   331	    parsed = JSON.parse(rawJson);
   332	  } catch (error: unknown) {
   333	    const errMsg = error instanceof Error ? error.message : String(error);
   334	    throw new Error(`Invalid JSON provided via ${sourceLabel}: ${errMsg}`);
   335	  }
   336	
   337	  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
   338	    throw new Error(`${sourceLabel} requires a JSON object payload`);
   339	  }
   340	
   341	  return parsed as Record<string, unknown>;
   342	}
   343	
   344	async function parseStructuredModeArguments(
   345	  mode: '--stdin' | '--json',
   346	  args: string[],
   347	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string>,
   348	): Promise<ParsedCliArguments> {
   349	  if (mode === '--stdin' && process.stdin.isTTY) {
   350	    console.error('--stdin requires piped input');
   351	    process.exit(1);
   352	  }
   353	
   354	  const rawJson = mode === '--stdin'
   355	    ? await stdinReader()
   356	    : args[1];
   357	
   358	  if (mode === '--json' && rawJson === undefined) {
   359	    throw new Error('--json requires an inline JSON string argument');
   360	  }
   361	
   362	  // Validation: empty --json is a user error, not a crash
   363	  if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
   364	    console.log(JSON.stringify({ error: 'VALIDATION_ERROR', message: 'Empty --json input' }));
   365	    process.exit(1);
   366	  }
   367	
   368	  const payload = parseStructuredJson(rawJson ?? '', mode);
   369	  const explicitSpecFolderArg = args[mode === '--stdin' ? 1 : 2];
   370	  const explicitTarget = explicitSpecFolderArg ? resolveCliSpecFolderReference(explicitSpecFolderArg) || explicitSpecFolderArg : null;
   371	  const payloadTargetRaw = extractPayloadSpecFolder(payload);
   372	  const payloadTarget = payloadTargetRaw ? (resolveCliSpecFolderReference(payloadTargetRaw) || payloadTargetRaw) : null;
   373	  const specFolderArg = explicitTarget || payloadTarget;
   374	
   375	  if (!specFolderArg) {
   376	    throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
   377	  }
   378	
   379	  return {
   380	    dataFile: null,
   381	    specFolderArg,
   382	    collectedData: {
   383	      ...payload,
   384	      _source: 'file',
   385	    },
   386	    sessionId: null,
   387	  };
   388	}
   389	
   390	// ───────────────────────────────────────────────────────────────
   391	// 5. CLI ARGUMENT PARSING
   392	// ───────────────────────────────────────────────────────────────
   393	async function parseArguments(
   394	  argv: string[] = process.argv.slice(2),
   395	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
   396	): Promise<ParsedCliArguments> {
   397	  // Extract --session-id <uuid> from argv before positional parsing
   398	  let sessionId: string | null = null;
   399	  const filteredArgv: string[] = [];
   400	  for (let i = 0; i < argv.length; i++) {
   401	    if (argv[i] === '--session-id') {
   402	      const candidate = argv[i + 1];
   403	      if (!candidate || candidate.startsWith('--') || candidate.trim().length === 0) {
   404	        throw new Error('--session-id requires a non-empty value');
   405	      }
   406	      sessionId = candidate.trim();
   407	      i++; // skip the value
   408	      continue;
   409	    }
   410	    filteredArgv.push(argv[i]);
   411	  }
   412	
   413	  const [primaryArg, secondaryArg] = filteredArgv;
   414	  if (!primaryArg) {
   415	    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
   416	  }
   417	
   418	  if (primaryArg === '--stdin' || primaryArg === '--json') {
   419	    const structured = await parseStructuredModeArguments(primaryArg, filteredArgv, stdinReader);
   420	    return { ...structured, sessionId };

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && rg -n "session|resume|summary|continuation|task_postflight|session_id|cache|history" README.md AGENTS.md ROUTER.md SETUP.md SYNC.md src -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
SETUP.md:213:**Verify** by starting a fresh session and asking your agent:
AGENTS.md:41:At the start of every session, read `ROUTER.md` before doing anything else.
ROUTER.md:3:description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
ROUTER.md:20:# Session Bootstrap
ROUTER.md:24:Then read this file fully before doing anything else in this session.
ROUTER.md:29:     This is the primary drift prevention mechanism — it re-grounds the agent every session.
ROUTER.md:33:     - User authentication and session management
ROUTER.md:45:Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.
ROUTER.md:65:   - If no pattern exists for this task type, create one in `patterns/` using the format in `patterns/README.md`. Add it to `patterns/INDEX.md`. Flag it: "Created `patterns/<name>.md` from this session."
README.md:24:AI agents forget everything between sessions. mex gives them permanent, navigable project memory.
README.md:26:Every session starts cold:
README.md:38:## Star History
README.md:40:[![Star History Chart](https://api.star-history.com/svg?repos=theDakshJaitly/mex&type=Timeline)](https://star-history.com/#theDakshJaitly/mex&Timeline)
README.md:174:**~60% average token reduction per session.**
README.md:181:Session starts
README.md:206:│   ├── ROUTER.md          ← routing table, session bootstrap
README.md:239:See [CHANGELOG.md](CHANGELOG.md) for release history.
src/scanner/folder-tree.ts:23:  "__pycache__",
src/sync/index.ts:144:    // Step 3: Fix all files in one interactive session
src/sync/index.ts:146:    console.log(chalk.bold(`\nSending all ${targets.length} file(s) to Claude in one session...\n`));
src/sync/index.ts:152:      console.log(chalk.red("  ✗ Claude session failed"));
src/reporter.ts:19:    printSummary(report);
src/reporter.ts:38:  printSummary(report);
src/reporter.ts:63:function printSummary(report: DriftReport): void {
src/drift/checkers/staleness.ts:9:/** Check how stale a scaffold file is based on git history */
src/cli.ts:33:  .option("--quiet", "Single-line summary only")
src/setup/index.ts:234:    info("An interactive Claude Code session will open with the population prompt.");
src/setup/index.ts:450:  info("Verify — start a fresh session and ask:");

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/drift/checkers/staleness.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && nl -ba src/drift/checkers/path.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '540,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	      console.error('[generate-context] Failed to list spec folders:', errMsg);
   541	    }
   542	  }
   543	  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
   544	  process.exit(1);
   545	}
   546	
   547	// ───────────────────────────────────────────────────────────────
   548	// 6. MAIN ENTRY POINT
   549	// ───────────────────────────────────────────────────────────────
   550	async function main(
   551	  argv: string[] = process.argv.slice(2),
   552	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
   553	): Promise<void> {
   554	  console.error('Starting memory skill...\n');
   555	
   556	  try {
   557	    const parsed = await parseArguments(argv, stdinReader);
   558	    CONFIG.DATA_FILE = parsed.dataFile;
   559	    CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
   560	    validateArguments();
   561	
   562	    await runWorkflow({
   563	      dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE ?? undefined,
   564	      specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
   565	      collectedData: parsed.collectedData ?? undefined,
   566	      loadDataFn: parsed.collectedData
   567	        ? undefined
   568	        : () => loadCollectedData({}),
   569	      collectSessionDataFn: collectSessionData,
   570	      sessionId: parsed.sessionId ?? undefined,
   571	    });
   572	  } catch (error: unknown) {
   573	    const errMsg = error instanceof Error ? error.message : String(error);
   574	    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);
   575	
   576	    if (isExpected) {
   577	      console.error(`\nError: ${errMsg}`);
   578	    } else {
   579	      console.error('Unexpected Error:', errMsg);
   580	      if (error instanceof Error) {
   581	        console.error(error.stack);
   582	      }
   583	    }
   584	    process.exit(1);
   585	  }
   586	}
   587	
   588	// ───────────────────────────────────────────────────────────────
   589	// 7. EXPORTS
   590	// ───────────────────────────────────────────────────────────────

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1510,1545p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1510	        ? (sessionData.CANONICAL_DOCS as unknown as Record<string, unknown>).CANONICAL_SOURCE_ENTRIES as Array<Record<string, string>>
  1511	        : [],
  1512	      DISTINGUISHING_EVIDENCE: sessionData.DISTINGUISHING_EVIDENCE || [],
  1513	      DECISION_HEADLINES: decisions.DECISIONS.slice(0, 2).map(d => d.TITLE),
  1514	      HAS_EXPANDED_DECISIONS: false,
  1515	      HAS_IMPLEMENTATION_GUIDE: sessionData.HAS_IMPLEMENTATION_GUIDE === true,
  1516	      // P1-4: Convert 0-1 confidence to 0-100 for template percentage rendering (kept for fallback mode)
  1517	      DECISIONS: [],
  1518	      HIGH_CONFIDENCE_COUNT: 0,
  1519	      MEDIUM_CONFIDENCE_COUNT: 0,
  1520	      LOW_CONFIDENCE_COUNT: 0,
  1521	      FOLLOWUP_COUNT: 0,
  1522	      HAS_AUTO_GENERATED: diagrams.HAS_AUTO_GENERATED,
  1523	      FLOW_TYPE: diagrams.FLOW_TYPE,
  1524	      AUTO_CONVERSATION_FLOWCHART: diagrams.AUTO_CONVERSATION_FLOWCHART,
  1525	      AUTO_DECISION_TREES: diagrams.AUTO_DECISION_TREES,
  1526	      DIAGRAMS: diagrams.DIAGRAMS,
  1527	      // Remove expanded implementation summary bindings (now in canonical docs)
  1528	      IMPLEMENTATION_SUMMARY: '',
  1529	      HAS_IMPLEMENTATION_SUMMARY: false,
  1530	      IMPL_TASK: '',
  1531	      IMPL_SOLUTION: '',
  1532	      IMPL_FILES_CREATED: [],
  1533	      IMPL_FILES_MODIFIED: [],
  1534	      IMPL_DECISIONS: [],
  1535	      IMPL_OUTCOMES: [],
  1536	      HAS_IMPL_FILES_CREATED: false,
  1537	      HAS_IMPL_FILES_MODIFIED: false,
  1538	      HAS_IMPL_DECISIONS: false,
  1539	      HAS_IMPL_OUTCOMES: false,
  1540	      TOPICS: keyTopics,
  1541	      HAS_KEY_TOPICS: keyTopics.length > 0,
  1542	      TRIGGER_PHRASES: preExtractedTriggers,
  1543	      TRIGGER_PHRASES_YAML: renderTriggerPhrasesYaml(preExtractedTriggers),
  1544	      KEY_FILES: [],
  1545	      ...memoryClassification,

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "buildContinueSessionData|SESSION_STATUS|CONTEXT_SUMMARY|RESUME_CONTEXT|SOURCE_SESSION_ID|SESSION_ID" .opencode/skill/system-spec-kit/scripts/core/workflow.ts -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
1426:      sessionId: sessionData.SESSION_ID,
1428:      sourceSessionId: sessionData.SOURCE_SESSION_ID,
1443:    sessionId: sessionData.SESSION_ID,
1614:        sessionId: sessionData.SOURCE_SESSION_ID,

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1368,1450p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1368	          const leafSegment = folderSegmentsForTriggers[folderSegmentsForTriggers.length - 1];
  1369	          const leafWords = leafSegment.split(/\s+/).filter(Boolean);
  1370	          if (leafWords.length !== 1) {
  1371	            return leafSegment;
  1372	          }
  1373	          const parentSegment = folderSegmentsForTriggers[folderSegmentsForTriggers.length - 2] || '';
  1374	          const parentLead = parentSegment.split(/\s+/).find((token) => token.length >= 3 && !FOLDER_STOPWORDS.has(token.toLowerCase()));
  1375	          return parentLead ? `${leafSegment} ${parentLead}` : leafSegment;
  1376	        })();
  1377	    const leafFolderAnchorKey = normalizeTriggerComparisonKey(leafFolderAnchor);
  1378	    const existingLower = new Set(preExtractedTriggers.map((phrase) => normalizeTriggerComparisonKey(phrase)));
  1379	    const leafAnchorIsInformative = leafFolderAnchorKey.length > 0
  1380	      && leafFolderAnchorKey.split(/\s+/).some((token) => !FOLDER_STOPWORDS.has(token));
  1381	    const leafAnchorAlreadyCovered = isAllowlistedShortProductName(leafFolderAnchor)
  1382	      || titleTriggerKey.includes(leafFolderAnchorKey)
  1383	      || Array.from(manualTriggerKeys).some((manualKey) => (
  1384	        manualKey.includes(leafFolderAnchorKey) || leafFolderAnchorKey.includes(manualKey)
  1385	      ));
  1386	    if (manualTriggerKeys.size === 0 && leafAnchorIsInformative && !leafAnchorAlreadyCovered && !existingLower.has(leafFolderAnchorKey)) {
  1387	      const sanitizedLeafAnchor = sanitizeTriggerPhrases([leafFolderAnchor], { source: 'extracted' })[0];
  1388	      if (sanitizedLeafAnchor) {
  1389	        const sanitizedLeafAnchorKey = normalizeTriggerComparisonKey(sanitizedLeafAnchor);
  1390	        if (!existingLower.has(sanitizedLeafAnchorKey)) {
  1391	          preExtractedTriggers.push(sanitizedLeafAnchor);
  1392	        }
  1393	      }
  1394	    }
  1395	
  1396	    preExtractedTriggers = ensureMinTriggerPhrases(preExtractedTriggers, effectiveFiles, specFolderName);
  1397	    log(`   Pre-extracted ${preExtractedTriggers.length} trigger phrases`);
  1398	  } catch (e: unknown) {
  1399	    const errMsg = e instanceof Error ? e.message : String(e);
  1400	    warn(`   Warning: Pre-extraction of trigger phrases failed: ${errMsg}`);
  1401	  }
  1402	
  1403	  const keyFiles = buildKeyFiles(enhancedFiles, specFolder);
  1404	  const memoryClassification = buildMemoryClassificationContext(collectedData, sessionData);
  1405	  const sessionDedup = buildSessionDedupContext(collectedData, sessionData, memoryTitle);
  1406	  const currentSnakeCaseCausalLinks = (
  1407	    collectedData.causal_links
  1408	    && typeof collectedData.causal_links === 'object'
  1409	    && !Array.isArray(collectedData.causal_links)
  1410	  ) ? { ...(collectedData.causal_links as Record<string, unknown>) } : null;
  1411	  const currentCamelCaseCausalLinks = (
  1412	    collectedData.causalLinks
  1413	    && typeof collectedData.causalLinks === 'object'
  1414	    && !Array.isArray(collectedData.causalLinks)
  1415	  ) ? { ...(collectedData.causalLinks as Record<string, unknown>) } : null;
  1416	  const existingSupersedes = [currentSnakeCaseCausalLinks, currentCamelCaseCausalLinks]
  1417	    .flatMap((value) => (Array.isArray(value?.supersedes) ? value.supersedes : []))
  1418	    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  1419	    .map((value) => value.trim());
  1420	  if (existingSupersedes.length === 0 && collectedData.saveMode === SaveMode.Json) {
  1421	    const { findPredecessorMemory } = await import('./find-predecessor-memory');
  1422	    const predecessorSessionId = await findPredecessorMemory(specFolder, {
  1423	      title: memoryTitle,
  1424	      description: explicitMemoryText.description ?? memoryDescription,
  1425	      summary: sessionData.SUMMARY,
  1426	      sessionId: sessionData.SESSION_ID,
  1427	      filename: rawCtxFilename,
  1428	      sourceSessionId: sessionData.SOURCE_SESSION_ID,
  1429	      causal_links: currentSnakeCaseCausalLinks ?? undefined,
  1430	      causalLinks: currentCamelCaseCausalLinks ?? undefined,
  1431	    });
  1432	
  1433	    if (predecessorSessionId) {
  1434	      const nextCausalLinks = {
  1435	        ...(currentSnakeCaseCausalLinks ?? currentCamelCaseCausalLinks ?? {}),
  1436	        supersedes: [predecessorSessionId],
  1437	      };
  1438	      collectedData.causal_links = nextCausalLinks;
  1439	      collectedData.causalLinks = nextCausalLinks;
  1440	    }
  1441	  }
  1442	  const autoCausalLinks = autoPopulateCausalLinks(collectedData, specFolder, {
  1443	    sessionId: sessionData.SESSION_ID,
  1444	    contextType: sessionData.CONTEXT_TYPE,
  1445	  });
  1446	  const currentCausalLinkField = (...keys: string[]): unknown => {
  1447	    for (const source of [currentSnakeCaseCausalLinks, currentCamelCaseCausalLinks]) {
  1448	      if (!source) {
  1449	        continue;
  1450	      }

codex
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings

### Finding 1: Mex creates continuity by installing a scaffold, not by minting a session
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L24), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L181), [src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L192), [src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L447), [src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts#L18)
- **What it does**: `mex setup` detects project state, optionally scans the repo into a brief, and launches or prints a population prompt. The next “fresh session” is verified by asking the agent to read `.mex/ROUTER.md`; there is no persisted session object, session ID, or bootstrap record created in setup.
- **Why it matters for us**: This is a lightweight cold-start bootstrap pattern, but it is not equivalent to Spec Kit Memory’s actual session layer. Mex starts from scaffold availability; we start from a recovery surface with real state.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Mex survives across sessions by forcing every cold start through `AGENTS.md` -> `ROUTER.md` -> targeted context files
- **Source**: [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L20), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L181), [src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L5)
- **What it does**: Mex’s “session bootstrap” is really a reading contract. Every session must re-read the always-loaded anchor and router, then follow markdown edges into `context/` and `patterns/`. The `GROW` step updates those files so the next cold start inherits the latest project state. I infer from the inspected runtime types that Mex has no separate session-state model beyond this scaffold.
- **Why it matters for us**: This is a strong navigational layer for stateless agents. It is also brittle: if the scaffold is not updated, session continuity degrades immediately because there is no fallback resume state.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex maintains context retrospectively with drift checks and repair loops, not live working memory
- **Source**: [src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L8), [src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L144), [src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L18)
- **What it does**: `mex watch` installs a post-commit hook that runs drift checks after each commit. Staleness is judged by both days and commit counts. `mex sync` groups drift by file, builds a repair brief with file contents, filesystem context, and recent git diffs, then sends all flagged files to Claude in one interactive repair session and re-checks afterward.
- **Why it matters for us**: This is not session memory in the conversational sense; it is a maintenance loop that keeps the scaffold trustworthy between sessions. That makes it a good complement to our system, especially for doc/config parity, but not a substitute for turn-to-turn continuity.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Mex has no explicit end-of-session summarizer, checkpoint, or trusted resume cache in the inspected runtime
- **Source**: [src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L13), [src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L138), [src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L117), [src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L146), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L98)
- **What it does**: The exposed lifecycle commands are `setup`, `check`, `init`, `sync`, `pattern add`, `watch`, and `commands`. Even `sync`’s “one session” is just a transient Claude subprocess for repair. I did not find source-level constructs for `session_id`, continuation counters, summary caches, or explicit closeout artifacts in the inspected external runtime.
- **Why it matters for us**: Mex can tell an agent where to look next, but it cannot natively answer “what did we do last session?” unless that answer was manually written into the scaffold. That is a hard limit for replacing Spec Kit Memory’s lifecycle features.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Spec Kit Memory already has the session primitives Mex is missing
- **Source**: [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L42), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L210), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L739), [handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L191), [handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207)
- **What it does**: Our system exposes `memory_context`, `memory_match_triggers`, `session_resume`, and `session_bootstrap` as first-class tools. `memory_context` resolves caller-provided session IDs through a trusted server-side session manager and persists session state; `memory_match_triggers` rejects untrusted session IDs; `session_resume` adds a freshness-gated cached summary only when transcript identity and scope checks pass; `session_bootstrap` wraps resume plus health into a canonical recovery surface.
- **Why it matters for us**: Mex’s markdown router can complement this, but it is operating at a lower level of fidelity. Spec Kit Memory already solves trusted resumption, health-aware recovery, and working-memory continuity in a way Mex does not attempt.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Spec Kit Memory also closes sessions explicitly through save-time summaries, continuation metadata, and learning records
- **Source**: [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L51), [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L562), [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L110), [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L735), [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L989), [handlers/session-learning.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts#L300), [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1420)
- **What it does**: `generate-context` runs the workflow with structured session data and optional session IDs. `collect-session-data` builds explicit continuation artifacts such as `SESSION_STATUS`, `COMPLETION_PERCENT`, `PENDING_TASKS`, `CONTEXT_SUMMARY`, and `RESUME_CONTEXT`. The workflow links saved memories to predecessor sessions through `supersedes`/auto-causal links, and `task_preflight`/`task_postflight` persist learning deltas across a task lifecycle.
- **Why it matters for us**: This is the piece Mex does not have at all: deliberate session ending and summarization. If we borrow from Mex, it should be for a thin markdown navigation layer over these richer saved artifacts, not for lifecycle management itself.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts)
- [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/schemas/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [mcp_server/handlers/session-learning.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
- [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
- [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)

## Assessment
- New information ratio: 0.79
- Questions addressed: Mex session creation surface, Mex maintenance loop, whether Mex has explicit resume/summary state, how context survives cold starts, where Spec Kit Memory already exceeds Mex on lifecycle guarantees
- Questions answered: Mex is scaffold-first rather than session-first; Mex maintenance is post-commit drift repair rather than live working memory; Mex lacks explicit end-of-session summary and trusted resume state in the inspected runtime; the reusable slice for us is a thin markdown bootstrap/current-state layer, not Mex’s lifecycle model wholesale

## Reflection
- What worked: searching the external source tree for `session`, `resume`, `sync`, `watch`, and `summary` quickly showed that most session language lives in scaffold docs and prompts, while the runtime concentrates on drift detection and repair. Pairing that with our `session_resume`, `memory_context`, and `generate-context` sources made the comparison much sharper than README-only reading.
- What did not work: there was no hidden session module to uncover in Mex, so part of the conclusion is absence-based inference from the inspected CLI, types, and runtime files rather than a single explicit “no sessions” source file.

## Recommended Next Focus
Design the smallest hybrid layer instead of importing Mex wholesale: auto-generate a lightweight ROUTER/current-state markdown surface from Spec Kit Memory’s saved session artifacts (`generate-context`, `buildContinueSessionData`, `session_bootstrap`) so cold starts get Mex-style navigability without giving up our trusted session IDs, cached continuity gating, and explicit closeout metadata.


hook: Stop
hook: Stop Completed
tokens used
185,442
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings

### Finding 1: Mex creates continuity by installing a scaffold, not by minting a session
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L24), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L181), [src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L192), [src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L447), [src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts#L18)
- **What it does**: `mex setup` detects project state, optionally scans the repo into a brief, and launches or prints a population prompt. The next “fresh session” is verified by asking the agent to read `.mex/ROUTER.md`; there is no persisted session object, session ID, or bootstrap record created in setup.
- **Why it matters for us**: This is a lightweight cold-start bootstrap pattern, but it is not equivalent to Spec Kit Memory’s actual session layer. Mex starts from scaffold availability; we start from a recovery surface with real state.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Mex survives across sessions by forcing every cold start through `AGENTS.md` -> `ROUTER.md` -> targeted context files
- **Source**: [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L20), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L181), [src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L5)
- **What it does**: Mex’s “session bootstrap” is really a reading contract. Every session must re-read the always-loaded anchor and router, then follow markdown edges into `context/` and `patterns/`. The `GROW` step updates those files so the next cold start inherits the latest project state. I infer from the inspected runtime types that Mex has no separate session-state model beyond this scaffold.
- **Why it matters for us**: This is a strong navigational layer for stateless agents. It is also brittle: if the scaffold is not updated, session continuity degrades immediately because there is no fallback resume state.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex maintains context retrospectively with drift checks and repair loops, not live working memory
- **Source**: [src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L8), [src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L144), [src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L18)
- **What it does**: `mex watch` installs a post-commit hook that runs drift checks after each commit. Staleness is judged by both days and commit counts. `mex sync` groups drift by file, builds a repair brief with file contents, filesystem context, and recent git diffs, then sends all flagged files to Claude in one interactive repair session and re-checks afterward.
- **Why it matters for us**: This is not session memory in the conversational sense; it is a maintenance loop that keeps the scaffold trustworthy between sessions. That makes it a good complement to our system, especially for doc/config parity, but not a substitute for turn-to-turn continuity.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Mex has no explicit end-of-session summarizer, checkpoint, or trusted resume cache in the inspected runtime
- **Source**: [src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L13), [src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L138), [src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts#L117), [src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L146), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L98)
- **What it does**: The exposed lifecycle commands are `setup`, `check`, `init`, `sync`, `pattern add`, `watch`, and `commands`. Even `sync`’s “one session” is just a transient Claude subprocess for repair. I did not find source-level constructs for `session_id`, continuation counters, summary caches, or explicit closeout artifacts in the inspected external runtime.
- **Why it matters for us**: Mex can tell an agent where to look next, but it cannot natively answer “what did we do last session?” unless that answer was manually written into the scaffold. That is a hard limit for replacing Spec Kit Memory’s lifecycle features.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Spec Kit Memory already has the session primitives Mex is missing
- **Source**: [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L42), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L210), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L739), [handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L191), [handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207)
- **What it does**: Our system exposes `memory_context`, `memory_match_triggers`, `session_resume`, and `session_bootstrap` as first-class tools. `memory_context` resolves caller-provided session IDs through a trusted server-side session manager and persists session state; `memory_match_triggers` rejects untrusted session IDs; `session_resume` adds a freshness-gated cached summary only when transcript identity and scope checks pass; `session_bootstrap` wraps resume plus health into a canonical recovery surface.
- **Why it matters for us**: Mex’s markdown router can complement this, but it is operating at a lower level of fidelity. Spec Kit Memory already solves trusted resumption, health-aware recovery, and working-memory continuity in a way Mex does not attempt.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Spec Kit Memory also closes sessions explicitly through save-time summaries, continuation metadata, and learning records
- **Source**: [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L51), [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L562), [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L110), [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L735), [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L989), [handlers/session-learning.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts#L300), [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1420)
- **What it does**: `generate-context` runs the workflow with structured session data and optional session IDs. `collect-session-data` builds explicit continuation artifacts such as `SESSION_STATUS`, `COMPLETION_PERCENT`, `PENDING_TASKS`, `CONTEXT_SUMMARY`, and `RESUME_CONTEXT`. The workflow links saved memories to predecessor sessions through `supersedes`/auto-causal links, and `task_preflight`/`task_postflight` persist learning deltas across a task lifecycle.
- **Why it matters for us**: This is the piece Mex does not have at all: deliberate session ending and summarization. If we borrow from Mex, it should be for a thin markdown navigation layer over these richer saved artifacts, not for lifecycle management itself.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts)
- [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/schemas/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [mcp_server/handlers/session-learning.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
- [scripts/extractors/collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
- [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)

## Assessment
- New information ratio: 0.79
- Questions addressed: Mex session creation surface, Mex maintenance loop, whether Mex has explicit resume/summary state, how context survives cold starts, where Spec Kit Memory already exceeds Mex on lifecycle guarantees
- Questions answered: Mex is scaffold-first rather than session-first; Mex maintenance is post-commit drift repair rather than live working memory; Mex lacks explicit end-of-session summary and trusted resume state in the inspected runtime; the reusable slice for us is a thin markdown bootstrap/current-state layer, not Mex’s lifecycle model wholesale

## Reflection
- What worked: searching the external source tree for `session`, `resume`, `sync`, `watch`, and `summary` quickly showed that most session language lives in scaffold docs and prompts, while the runtime concentrates on drift detection and repair. Pairing that with our `session_resume`, `memory_context`, and `generate-context` sources made the comparison much sharper than README-only reading.
- What did not work: there was no hidden session module to uncover in Mex, so part of the conclusion is absence-based inference from the inspected CLI, types, and runtime files rather than a single explicit “no sessions” source file.

## Recommended Next Focus
Design the smallest hybrid layer instead of importing Mex wholesale: auto-generate a lightweight ROUTER/current-state markdown surface from Spec Kit Memory’s saved session artifacts (`generate-context`, `buildContinueSessionData`, `session_bootstrap`) so cold starts get Mex-style navigability without giving up our trusted session IDs, cached continuity gating, and explicit closeout metadata.
