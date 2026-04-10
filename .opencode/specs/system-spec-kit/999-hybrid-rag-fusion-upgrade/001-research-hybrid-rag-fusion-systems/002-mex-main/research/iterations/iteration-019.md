### Finding 5: Auto-Growth Is Powerful, But In Spec Kit It Could Turn Partial Knowledge Into Durable Policy
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21)
- **What it does**: Mex’s contract says every task should update current state and grow patterns. Setup tries to constrain population through a pre-built scanner brief, and `pattern add` creates a template pattern plus a placeholder `[description]` index row immediately.
- **Why it matters for us**: In Spec Kit, docs and packet artifacts are treated as high-authority evidence surfaces. The risk of automatic growth is that incomplete scans, stub manifest parsing, or rushed task summaries become durable instructions that later validators and future sessions treat as truth. Once that happens, repair loops start preserving or propagating the contamination instead of correcting it.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Mex’s Single Drift Score Would Be Misleading If We Treated It As A Primary Health Signal
- **Source**: [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1023)
- **What it does**: Mex pools all issues into one score starting at `100`, subtracting `10` per error, `3` per warning, and `1` per info. Spec Kit instead exposes explicit blocking states, degraded/healthy modes, and certainty labels.
- **Why it matters for us**: The risk is overcompression. A repo can still look “healthy” numerically while one critical surface is untrustworthy, or look “bad” because of a cluster of low-value warnings. That is fine for a lightweight CLI summary, but it is the wrong abstraction for a system that already models `unknown`, `estimated`, `exact`, `REJECTED`, and `degraded`.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.76
- Questions addressed: what could go wrong if we adopt Mex-style static reference checks, freshness scoring, command/dependency/script parity, targeted repair briefs, scaffold auto-growth, and single-score reporting.
- Questions answered: the safest near-term adoption remains static reference integrity, but only with Spec-Kit-aware path semantics; freshness is useful only if git failure becomes an explicit degraded state; command/dependency/script parity is too Node-centric to ship broadly; repair briefing is reusable but the Mex sync loop is too optimistic; auto-growth and single-score health should not be imported as-is.
- Questions answered: the phase validation command returned `RESULT: PASSED` with `Errors: 0 Warnings: 0` in this run.

## Reflection
- What worked: tracing the source modules together with the checker tests made the real failure modes obvious, especially where README claims overstate multi-stack support.
- What did not work: the CocoIndex MCP search did not return usable results in this run, so the analysis relied on direct source tracing instead of semantic search.

## Recommended Next Focus
Design the smallest Spec Kit-native contracts for the two surviving candidates: packet-aware reference-integrity checks and a freshness supplement that reports `exact` versus `unknown/degraded` instead of silently skipping git failures. After that, compare Modus Memory and Mnemosyne specifically on whether they provide stronger degraded-state semantics and broader inventory coverage than Mex without importing Mex’s heuristic noise.

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
# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

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
I’m treating this as a read-only deep-research pass over the Mex source plus the matching Spec Kit surfaces, with the goal of turning the earlier findings into a ranked adoption roadmap. First I’m validating the phase folder and mapping the actual external repo structure so the ranking stays tied to source evidence rather than README claims.
exec
/bin/zsh -lc 'rg -n "mex|hybrid-rag-fusion|002-mex-main|drift detection|staleness" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg --files "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/INDEX.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1403ms:

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
The phase folder is being validated now, and the external repo layout is confirmed: the files live directly under `external/`, not `external/mex-main`. Next I’m tracing the CLI and checker implementations in the requested order so the ranking reflects actual behavior, thresholds, and failure modes.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The top-level contract is consistent with the earlier concern: Mex’s value lives in the scaffold routing and focused drift checks, but it also bakes in mandatory auto-growth after every task. I’m moving into `SETUP`, `SYNC`, `cli.ts`, and the drift engine now to separate the reusable low-cost integrity pieces from the riskier policy-writing loop.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1337ms:

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
The drift engine confirms the earlier risk split pretty cleanly: the low-cost part is real and narrow, while the scoring layer is intentionally compressive and the scaffold scope is broader than README marketing suggests. I’m drilling into each checker and the Spec Kit comparison files now so the final ranking can be tied to concrete adoption cost and false-positive risk.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { readFileSync, existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import type { ManifestInfo } from "../types.js";
     4	
     5	const MANIFEST_FILES = [
     6	  "package.json",
     7	  "pyproject.toml",
     8	  "go.mod",
     9	  "Cargo.toml",
    10	] as const;
    11	
    12	/** Detect and parse the project manifest */
    13	export function scanManifest(projectRoot: string): ManifestInfo | null {
    14	  for (const file of MANIFEST_FILES) {
    15	    const path = resolve(projectRoot, file);
    16	    if (!existsSync(path)) continue;
    17	
    18	    switch (file) {
    19	      case "package.json":
    20	        return parsePackageJson(path);
    21	      case "pyproject.toml":
    22	        return parsePyprojectStub(path);
    23	      case "go.mod":
    24	        return parseGoModStub(path);
    25	      case "Cargo.toml":
    26	        return parseCargoStub(path);
    27	    }
    28	  }
    29	  return null;
    30	}
    31	
    32	function parsePackageJson(path: string): ManifestInfo | null {
    33	  try {
    34	    const raw = JSON.parse(readFileSync(path, "utf-8"));
    35	    return {
    36	      type: "package.json",
    37	      name: raw.name ?? null,
    38	      version: raw.version ?? null,
    39	      dependencies: raw.dependencies ?? {},
    40	      devDependencies: raw.devDependencies ?? {},
    41	      scripts: raw.scripts ?? {},
    42	    };
    43	  } catch {
    44	    return null;
    45	  }
    46	}
    47	
    48	// Stub parsers for other manifests — extend later
    49	function parsePyprojectStub(path: string): ManifestInfo {
    50	  const content = readFileSync(path, "utf-8");
    51	  const nameMatch = content.match(/^name\s*=\s*"(.+)"/m);
    52	  const versionMatch = content.match(/^version\s*=\s*"(.+)"/m);
    53	  return {
    54	    type: "pyproject.toml",
    55	    name: nameMatch?.[1] ?? null,
    56	    version: versionMatch?.[1] ?? null,
    57	    dependencies: {},
    58	    devDependencies: {},
    59	    scripts: {},
    60	  };
    61	}
    62	
    63	function parseGoModStub(path: string): ManifestInfo {
    64	  const content = readFileSync(path, "utf-8");
    65	  const moduleMatch = content.match(/^module\s+(.+)/m);
    66	  return {
    67	    type: "go.mod",
    68	    name: moduleMatch?.[1] ?? null,
    69	    version: null,
    70	    dependencies: {},
    71	    devDependencies: {},
    72	    scripts: {},
    73	  };
    74	}
    75	
    76	function parseCargoStub(path: string): ManifestInfo {
    77	  const content = readFileSync(path, "utf-8");
    78	  const nameMatch = content.match(/^name\s*=\s*"(.+)"/m);
    79	  const versionMatch = content.match(/^version\s*=\s*"(.+)"/m);
    80	  return {
    81	    type: "Cargo.toml",
    82	    name: nameMatch?.[1] ?? null,
    83	    version: versionMatch?.[1] ?? null,
    84	    dependencies: {},
    85	    devDependencies: {},
    86	    scripts: {},
    87	  };
    88	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts | sed -n '320,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '200,310p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Crud Health
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	/* ───────────────────────────────────────────────────────────────
     6	   IMPORTS
     7	──────────────────────────────────────────────────────────────── */
     8	
     9	import { randomUUID } from 'node:crypto';
    10	import { existsSync, readFileSync } from 'node:fs';
    11	import { resolve } from 'node:path';
    12	
    13	import { checkDatabaseUpdated } from '../core/index.js';
    14	import * as vectorIndex from '../lib/search/vector-index.js';
    15	import * as embeddings from '../lib/providers/embeddings.js';
    16	import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
    17	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
    18	import { toErrorMessage } from '../utils/index.js';
    19	
    20	import { isEmbeddingModelReady } from '../core/index.js';
    21	import { summarizeAliasConflicts } from './memory-index.js';
    22	import * as causalEdges from '../lib/storage/causal-edges.js';
    23	import { getEmbeddingRetryStats } from '../lib/providers/retry-manager.js';
    24	
    25	import type { MCPResponse, EmbeddingProfile } from './types.js';
    26	import type { HealthArgs, PartialProviderMetadata } from './memory-crud-types.js';
    27	
    28	// Feature catalog: Health diagnostics (memory_health)
    29	// Feature catalog: Validation feedback (memory_validate)
    30	// Feature catalog: Memory health autoRepair metadata
    31	
    32	
    33	/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
    34	function sanitizeErrorForHint(msg: string): string {
    35	  return msg
    36	    .replace(/(^|[\s(])\/(?:[^/\n]+\/)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    37	    .replace(/(^|[\s(])[A-Za-z]:\\(?:[^\\\n]+\\)*[^:\n)"'\]]+/g, (_match, prefix: string) => `${prefix}[path]`)
    38	    .replace(/^[ \t]*at .+$/gm, '')            // strip stack trace lines
    39	    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
    40	    .trim()
    41	    .slice(0, 200);
    42	}
    43	
    44	/** Redact absolute paths: keep only project-relative portion or basename. */
    45	function redactPath(absolutePath: string): string {
    46	  const normalizedPath = toNormalizedPath(absolutePath);
    47	  if (normalizedPath.startsWith('.opencode/')) return normalizedPath;
    48	  if (normalizedPath.startsWith('specs/')) return normalizedPath;
    49	  const opencodeIdx = normalizedPath.indexOf('/.opencode/');
    50	  const specsIdx = normalizedPath.indexOf('/specs/');
    51	  if (opencodeIdx !== -1) return normalizedPath.slice(opencodeIdx + 1);
    52	  if (specsIdx !== -1) return normalizedPath.slice(specsIdx + 1);
    53	  // Fallback: basename only
    54	  const lastSlash = normalizedPath.lastIndexOf('/');
    55	  return lastSlash !== -1 ? normalizedPath.slice(lastSlash + 1) : normalizedPath;
    56	}
    57	
    58	/* ───────────────────────────────────────────────────────────────
    59	   CONSTANTS
    60	──────────────────────────────────────────────────────────────── */
    61	
    62	// Read version from package.json at module load time using ESM-relative paths.
    63	// WHY try-catch: if package.json is missing or malformed, the server should still start
    64	const SERVER_VERSION: string = (() => {
    65	  const packageCandidates = [
    66	    resolve(import.meta.dirname, '../package.json'),
    67	    resolve(import.meta.dirname, '../../package.json'),
    68	  ];
    69	
    70	  try {
    71	    for (const candidate of packageCandidates) {
    72	      if (!existsSync(candidate)) {
    73	        continue;
    74	      }
    75	      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
    76	      if (pkg?.version) {
    77	        return pkg.version;
    78	      }
    79	    }
    80	    return 'unknown';
    81	  } catch (_error: unknown) {
    82	    return 'unknown';
    83	  }
    84	})();
    85	
    86	const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
    87	const DEFAULT_DIVERGENT_ALIAS_LIMIT = 20;
    88	const MAX_DIVERGENT_ALIAS_LIMIT = 200;
    89	const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
    90	const SPECS_SEGMENT = '/specs/';
    91	
    92	interface AliasConflictDbRow {
    93	  file_path: string;
    94	  content_hash: string | null;
    95	  spec_folder?: string | null;
    96	}
    97	
    98	interface DivergentAliasVariant {
    99	  filePath: string;
   100	  contentHash: string | null;
   101	}
   102	
   103	interface DivergentAliasGroup {
   104	  normalizedPath: string;
   105	  specFolders: string[];
   106	  distinctHashCount: number;
   107	  variants: DivergentAliasVariant[];
   108	}
   109	
   110	interface DivergentAliasBucket {
   111	  hasDotOpencodeVariant: boolean;
   112	  hasSpecsVariant: boolean;
   113	  variants: Map<string, string | null>;
   114	  hashes: Set<string>;
   115	  specFolders: Set<string>;
   116	}
   117	
   118	function toNormalizedPath(filePath: string): string {
   119	  return filePath.replace(/\\/g, '/');
   120	}
   121	
   122	function toSpecAliasKey(filePath: string): string {
   123	  const normalizedPath = toNormalizedPath(filePath);
   124	  return normalizedPath
   125	    .replace(/\/\.opencode\/specs\//g, '/specs/')
   126	    .replace(/^\.opencode\/specs\//, 'specs/');
   127	}
   128	
   129	function isSpecsAliasPath(filePath: string): boolean {
   130	  const normalizedPath = toNormalizedPath(filePath);
   131	  return (
   132	    normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) ||
   133	    normalizedPath.includes(SPECS_SEGMENT) ||
   134	    normalizedPath.startsWith('.opencode/specs/') ||
   135	    normalizedPath.startsWith('specs/')
   136	  );
   137	}
   138	
   139	function isDotOpencodeVariantPath(normalizedPath: string): boolean {
   140	  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
   141	}
   142	
   143	function isSpecsVariantPath(normalizedPath: string): boolean {
   144	  if (isDotOpencodeVariantPath(normalizedPath)) {
   145	    return false;
   146	  }
   147	  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
   148	}
   149	
   150	function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
   151	  if (!rows.length) {
   152	    return [];
   153	  }
   154	
   155	  const buckets = new Map<string, DivergentAliasBucket>();
   156	
   157	  for (const row of rows) {
   158	    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
   159	      continue;
   160	    }
   161	
   162	    const normalizedPath = toNormalizedPath(row.file_path);
   163	    const aliasKey = toSpecAliasKey(normalizedPath);
   164	    let bucket = buckets.get(aliasKey);
   165	    if (!bucket) {
   166	      bucket = {
   167	        hasDotOpencodeVariant: false,
   168	        hasSpecsVariant: false,
   169	        variants: new Map<string, string | null>(),
   170	        hashes: new Set<string>(),
   171	        specFolders: new Set<string>(),
   172	      };
   173	      buckets.set(aliasKey, bucket);
   174	    }
   175	
   176	    if (isDotOpencodeVariantPath(normalizedPath)) {
   177	      bucket.hasDotOpencodeVariant = true;
   178	    }
   179	    if (isSpecsVariantPath(normalizedPath)) {
   180	      bucket.hasSpecsVariant = true;
   181	    }
   182	
   183	    bucket.variants.set(normalizedPath, row.content_hash ?? null);
   184	    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
   185	      bucket.hashes.add(row.content_hash.trim());
   186	    }
   187	    if (typeof row.spec_folder === 'string' && row.spec_folder.length > 0) {
   188	      bucket.specFolders.add(row.spec_folder);
   189	    }
   190	  }
   191	
   192	  const groups: DivergentAliasGroup[] = [];
   193	  for (const [normalizedPath, bucket] of buckets.entries()) {
   194	    if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
   195	      continue;
   196	    }
   197	    if (bucket.variants.size < 2 || bucket.hashes.size < 2) {
   198	      continue;
   199	    }
   200	
   201	    const variants: DivergentAliasVariant[] = Array.from(bucket.variants.entries())
   202	      .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
   203	      .map(([filePath, contentHash]) => ({ filePath: redactPath(filePath), contentHash }));
   204	
   205	    groups.push({
   206	      normalizedPath: redactPath(normalizedPath),
   207	      // Fix F21 — redact specFolders to prevent path disclosure.
   208	      specFolders: Array.from(bucket.specFolders).sort().map(sf => redactPath(sf)),
   209	      distinctHashCount: bucket.hashes.size,
   210	      variants,
   211	    });
   212	  }
   213	
   214	  groups.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
   215	  return groups.slice(0, limit);
   216	}
   217	
   218	/* ───────────────────────────────────────────────────────────────
   219	   CORE LOGIC
   220	──────────────────────────────────────────────────────────────── */
   221	
   222	/** Handle memory_health tool -- returns system health status and diagnostics. */
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | sed -n '1000,1085p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1000	      issues.push({
  1001	        checkId: 'D8',
  1002	        severity: 'MEDIUM',
  1003	        field: 'anchors',
  1004	        message: `OVERVIEW anchor mismatch (toc=${anchorState.tocTarget ?? 'missing'}, comment=${anchorState.comment ?? 'missing'}, closing=${anchorState.closingComment ?? 'missing'})`,
  1005	        fix: 'Keep the OVERVIEW TOC target and comment anchors aligned on "overview"',
  1006	      });
  1007	    }
  1008	
  1009	    emitGuardrailTelemetry(issues, {
  1010	      inputMode: normalizedInputMode,
  1011	      saveMode,
  1012	      provenanceExpected,
  1013	      overviewLength: overview.length,
  1014	      d3Counts,
  1015	      continuationPattern,
  1016	      anchorViolationCount: issues.some((issue) => issue.checkId === 'D8') ? 1 : 0,
  1017	    }, anchorState);
  1018	
  1019	    const highCount = issues.filter((issue) => issue.severity === 'HIGH').length;
  1020	    const mediumCount = issues.filter((issue) => issue.severity === 'MEDIUM').length;
  1021	    const lowCount = issues.filter((issue) => issue.severity === 'LOW').length;
  1022	
  1023	    if (issues.length === 0) {
  1024	      return {
  1025	        status: 'PASSED',
  1026	        issues: [],
  1027	        ...scoreSummary,
  1028	      };
  1029	    }
  1030	
  1031	    const guardrailCounts = countGuardrailSeverities(issues);
  1032	    const blocking = guardrailCounts.high >= 2 || (guardrailCounts.high >= 1 && guardrailCounts.medium >= 2);
  1033	    const blockerReason = blocking
  1034	      ? `Composite blocker fired (${guardrailCounts.high} HIGH, ${guardrailCounts.medium} MEDIUM guardrail findings; DUP=${guardrailCounts.dupHigh} HIGH/${guardrailCounts.dupMedium} MEDIUM)`
  1035	      : undefined;
  1036	
  1037	    return {
  1038	      status: blocking ? 'REJECTED' : 'ISSUES_FOUND',
  1039	      issues,
  1040	      blocking,
  1041	      blockerReason,
  1042	      highCount,
  1043	      mediumCount,
  1044	      lowCount,
  1045	      ...scoreSummary,
  1046	    };
  1047	  } catch (error: unknown) {
  1048	    const reviewerError = `Unexpected reviewer failure for ${savedFilePath}: ${error instanceof Error ? error.message : String(error)}`;
  1049	    return {
  1050	      status: 'REVIEWER_ERROR',
  1051	      issues: [],
  1052	      reviewerError,
  1053	      ...scoreSummary,
  1054	    };
  1055	  }
  1056	}
  1057	
  1058	/* ───────────────────────────────────────────────────────────────
  1059	   5. SCORE FEEDBACK FROM REVIEW FINDINGS
  1060	------------------------------------------------------------------*/
  1061	
  1062	const REVIEW_SEVERITY_PENALTIES: Record<IssueSeverity, number> = {
  1063	  HIGH: -0.10,
  1064	  MEDIUM: -0.05,
  1065	  LOW: -0.02,
  1066	};
  1067	
  1068	export function computeReviewScorePenalty(issues: ReviewIssue[]): number {
  1069	  let penalty = 0;
  1070	  for (const issue of issues) {
  1071	    penalty += REVIEW_SEVERITY_PENALTIES[issue.severity] || 0;
  1072	  }
  1073	  return Math.max(penalty, -0.30);
  1074	}
  1075	
  1076	/* ───────────────────────────────────────────────────────────────
  1077	   6. OUTPUT FORMATTING
  1078	------------------------------------------------------------------*/
  1079	
  1080	export function printPostSaveReview(result: PostSaveReviewResult): void {
  1081	  const scorePenalty = result.issues.length > 0 ? computeReviewScorePenalty(result.issues) : 0;
  1082	  const payload = {
  1083	    status: result.status,
  1084	    issues: result.issues,
  1085	    // Two scores intentionally coexist:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Validate Memory Quality
     3	// ---------------------------------------------------------------
     4	// ---------------------------------------------------------------
     5	// 1. VALIDATE MEMORY QUALITY
     6	// ---------------------------------------------------------------
     7	// Post-render quality gate for generated memory files
     8	//
     9	// Canonical location: lib/validate-memory-quality.ts
    10	// This module contains pure validation logic with no memory/ dependencies.
    11	// The memory/validate-memory-quality.ts file re-exports from here for
    12	// backward compatibility (CLI entry point + existing importers).
    13	
    14	import fs from 'fs';
    15	import path from 'path';
    16	// eslint-disable-next-line @typescript-eslint/no-require-imports
    17	const { load: loadYaml } = require('js-yaml') as { load: (input: string) => unknown };
    18	import { structuredLog } from '../utils/logger';
    19	import type { ContaminationAuditRecord } from './content-filter';
    20	import type { DataSource } from '../utils/input-normalizer';
    21	import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';
    22	
    23	type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14';
    24	
    25	type ValidationRuleSeverity = 'low' | 'medium' | 'high';
    26	type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
    27	
    28	interface ValidationRuleMetadata {
    29	  ruleId: QualityRuleId;
    30	  name: string;
    31	  severity: ValidationRuleSeverity;
    32	  blockOnWrite: boolean;
    33	  blockOnIndex: boolean;
    34	  appliesToSources: 'all' | readonly KnownDataSource[];
    35	  reason: string;
    36	}
    37	
    38	interface ValidationDispositionResult {
    39	  disposition: ValidationDisposition;
    40	  blockingRuleIds: QualityRuleId[];
    41	  indexBlockingRuleIds: QualityRuleId[];
    42	  softRuleIds: QualityRuleId[];
    43	}
    44	
    45	const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata> = {
    46	  V1: {
    47	    ruleId: 'V1',
    48	    name: 'placeholder-leakage-required-fields',
    49	    severity: 'high',
    50	    blockOnWrite: true,
    51	    blockOnIndex: true,
    52	    appliesToSources: 'all',
    53	    reason: 'Placeholder leakage in required durable-memory fields corrupts the saved output contract.',
    54	  },
    55	  V2: {
    56	    ruleId: 'V2',
    57	    name: 'placeholder-leakage-with-tools',
    58	    severity: 'medium',
    59	    blockOnWrite: false,
    60	    blockOnIndex: true,
    61	    appliesToSources: 'all',
    62	    reason: 'Structured content can be saved for inspection, but placeholder leakage with real tool evidence should not reach the semantic index.',
    63	  },
    64	  V3: {
    65	    ruleId: 'V3',
    66	    name: 'malformed-spec-folder',
    67	    severity: 'high',
    68	    blockOnWrite: true,
    69	    blockOnIndex: true,
    70	    appliesToSources: 'all',
    71	    reason: 'Malformed spec_folder routing metadata invalidates the saved memory target.',
    72	  },
    73	  V4: {
    74	    ruleId: 'V4',
    75	    name: 'fallback-decision-text',
    76	    severity: 'low',
    77	    blockOnWrite: false,
    78	    blockOnIndex: false,
    79	    appliesToSources: 'all',
    80	    reason: 'Fallback-decision phrasing is a soft signal and should not block durable indexing on otherwise strong memories.',
    81	  },
    82	  V5: {
    83	    ruleId: 'V5',
    84	    name: 'sparse-semantic-fields',
    85	    severity: 'low',
    86	    blockOnWrite: false,
    87	    blockOnIndex: false,
    88	    appliesToSources: 'all',
    89	    reason: 'Sparse trigger phrases are diagnostic, but not enough to reject an otherwise valid rendered memory.',
    90	  },
    91	  V6: {
    92	    ruleId: 'V6',
    93	    name: 'template-placeholder-remnants',
    94	    severity: 'low',
    95	    blockOnWrite: false,
    96	    blockOnIndex: false,
    97	    appliesToSources: 'all',
    98	    reason: 'Template placeholder remnants are tracked as soft diagnostics when upstream template-contract validation already passed.',
    99	  },
   100	  V7: {
   101	    ruleId: 'V7',
   102	    name: 'contradictory-tool-state',
   103	    severity: 'low',
   104	    blockOnWrite: false,
   105	    blockOnIndex: false,
   106	    appliesToSources: 'all',
   107	    reason: 'Tool-count contradictions are useful diagnostics, but not durable-index blockers on their own.',
   108	  },
   109	  V8: {
   110	    ruleId: 'V8',
   111	    name: 'cross-spec-contamination',
   112	    severity: 'high',
   113	    blockOnWrite: true,
   114	    blockOnIndex: true,
   115	    appliesToSources: 'all',
   116	    reason: 'Foreign-spec contamination would corrupt both the saved memory and the semantic index.',
   117	  },
   118	  V9: {
   119	    ruleId: 'V9',
   120	    name: 'title-contamination',
   121	    severity: 'high',
   122	    blockOnWrite: true,
   123	    blockOnIndex: true,
   124	    appliesToSources: 'all',
   125	    reason: 'A contaminated title undermines retrieval quality and saved-memory truthfulness.',
   126	  },
   127	  V10: {
   128	    ruleId: 'V10',
   129	    name: 'session-source-mismatch',
   130	    severity: 'low',
   131	    blockOnWrite: false,
   132	    blockOnIndex: false,
   133	    appliesToSources: 'all',
   134	    reason: 'Session-source mismatch is diagnostic and should remain visible without forcing write-only saves.',
   135	  },
   136	  V11: {
   137	    ruleId: 'V11',
   138	    name: 'api-error-content-leakage',
   139	    severity: 'high',
   140	    blockOnWrite: true,
   141	    blockOnIndex: true,
   142	    appliesToSources: 'all',
   143	    reason: 'API-error-dominated content is not a trustworthy memory surface.',
   144	  },
   145	  V12: {
   146	    ruleId: 'V12',
   147	    name: 'topical-coherence-mismatch',
   148	    severity: 'medium',
   149	    blockOnWrite: false,
   150	    blockOnIndex: true,
   151	    appliesToSources: 'all',
   152	    reason: 'Memory content with zero topical overlap with spec trigger_phrases suggests off-target capture.',
   153	  },
   154	  V13: {
   155	    ruleId: 'V13',
   156	    name: 'malformed-frontmatter',
   157	    severity: 'high',
   158	    blockOnWrite: true,
   159	    blockOnIndex: true,
   160	    appliesToSources: 'all',
   161	    reason: 'Malformed frontmatter YAML or near-empty body content renders the memory unindexable and untrustworthy.',
   162	  },
   163	  V14: {
   164	    ruleId: 'V14',
   165	    name: 'status-percentage-contradiction',
   166	    severity: 'low',
   167	    blockOnWrite: false,
   168	    blockOnIndex: false,
   169	    appliesToSources: 'all',
   170	    reason: 'A status/percentage contradiction (status=complete but percentage<100) is a soft diagnostic signal.',
   171	  },
   172	};
   173	
   174	const HARD_BLOCK_RULES: readonly QualityRuleId[] = Object.values(VALIDATION_RULE_METADATA)
   175	  .filter((metadata) => metadata.blockOnWrite)
   176	  .map((metadata) => metadata.ruleId);
   177	
   178	interface RuleResult {
   179	  ruleId: QualityRuleId;
   180	  name?: string;
   181	  passed: boolean;
   182	  message: string;
   183	}
   184	
   185	interface ValidationResult {
   186	  valid: boolean;
   187	  failedRules: QualityRuleId[];
   188	  ruleResults: RuleResult[];
   189	  contaminationAudit: ContaminationAuditRecord;
   190	}
   191	
   192	const FALLBACK_DECISION_REGEX = /No (specific )?decisions were made/i;
   193	const NON_OPTIONAL_FIELDS = ['decisions', 'next_actions', 'blockers', 'readiness'];
   194	const PLACEHOLDER_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
   195	  { pattern: /(^|\|)\s*\/100\b/m, label: 'dangling score denominator' },
   196	  { pattern: /Confidence:\s*%/i, label: 'empty confidence percent' },
   197	  { pattern: /\|\s*(Knowledge|Uncertainty|Context) Score\s*\|\s*\/100\s*\|/i, label: 'empty preflight score' },
   198	  { pattern: /\|\s*Timestamp\s*\|\s*\|\s*Session start\s*\|/i, label: 'empty preflight timestamp' },
   199	  { pattern: /-\s*Readiness:\s*$/im, label: 'empty readiness value' },
   200	  { pattern: /(^title:\s*"|^#\s+)To promote a memory to constitutional tier/im, label: 'template instructional banner leakage' },
   201	  { pattern: /^<!--\s*Template Configuration Comments/im, label: 'template configuration leakage' },
   202	  { pattern: /^<!--\s*SESSION CONTEXT DOCUMENTATION v/im, label: 'template footer leakage' },
   203	];
   204	const EXECUTION_SIGNAL_PATTERNS = [
   205	  /\*\*Tool:\s+/i,                         // actual tool invocation
   206	  /\|\s*Tool Executions\s*\|\s*[1-9]/i,    // table says non-zero tools
   207	  /\btool_calls?\b/i,                      // explicit tool_call reference
   208	];
   209	const SPEC_ID_REGEX = /\b\d{3}-[a-z][a-z0-9-]*(?=[\s,.)/:"'`]|$)/gi;
   210	const FINDING_ID_SPEC_FALSE_POSITIVE_REGEX = /^\d{3}-i\d{3}-p\d-\d{3}$/i;
   211	const NUMERIC_RANGE_SPEC_FALSE_POSITIVE_REGEX = /^\d{3}-\d+(?:-\d+)*$/;
   212	const TITLE_CONTAMINATION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
   213	  { pattern: /^(to promote a memory|epistemic state captured at session start|table of contents)\b/i, label: 'template instructional heading' },
   214	  { pattern: /^\[[^\]]+\]$/i, label: 'placeholder bracket title' },
   215	  { pattern: /^(untitled|draft|todo|tbd)(?:\s+(memory|session|summary|document|notes?))?$/i, label: 'generic stub title' },
   216	  { pattern: /^\d{3}(?:-[a-z0-9][a-z0-9-]*)?$/i, label: 'spec-id-only title' },
   217	];
   218	
   219	function isYamlMapping(value: unknown): value is Record<string, unknown> {
   220	  return typeof value === 'object' && value !== null && !Array.isArray(value);
   221	}
   222	
   223	function describeYamlParseError(error: unknown): string {
   224	  if (!(error instanceof Error)) {
   225	    return String(error);
   226	  }
   227	
   228	  const mark = error as Error & { mark?: { line?: number; column?: number } };
   229	  if (typeof mark.mark?.line === 'number') {
   230	    const line = mark.mark.line + 1;
   231	    const column = typeof mark.mark.column === 'number' ? `, column ${mark.mark.column + 1}` : '';
   232	    return `line ${line}${column}: ${error.message}`;
   233	  }
   234	
   235	  return error.message;
   236	}
   237	
   238	function loadYamlValue(raw: string): unknown {
   239	  return loadYaml(raw);
   240	}
   241	
   242	function parseYamlMapping(raw: string): Record<string, unknown> | null {
   243	  if (raw.trim().length === 0) {
   244	    return null;
   245	  }
   246	
   247	  try {
   248	    const parsed = loadYamlValue(raw);
   249	    return isYamlMapping(parsed) ? parsed : null;
   250	  } catch (_error: unknown) {
   251	    return null;
   252	  }
   253	}
   254	
   255	function validateFrontMatterSyntax(raw: string): string | null {
   256	  try {
   257	    const parsed = loadYamlValue(raw);
   258	    if (parsed !== null && !isYamlMapping(parsed)) {
   259	      return 'frontmatter root must be a YAML mapping';
   260	    }

exec
/bin/zsh -lc "rg -n \"memory_context|memory_search|memory_match_triggers|causal|generate-context|code_graph|cocoindex|degraded|exact|unknown|estimated|REJECTED\" .opencode/skill/system-spec-kit -g '*.ts' -g '*.js' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:86:import * as causalBoost from './lib/search/causal-boost.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:140:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:148:  results: unknown[];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:162:  constitutional: unknown[];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:163:  triggered: unknown[];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:166:    data?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:186:  structuredContent?: unknown;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:187:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:197:type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:329:  envelope: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:341:    ? envelope.meta as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:347:function resolveToolCallId(request: { id?: unknown }): string {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:357:  args: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:358:  extra: unknown,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:382:function runAfterToolCallbacks(tool: string, callId: string, result: unknown): void {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:389:      void callback(tool, callId, result).catch((error: unknown) => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:397:function isRecord(value: unknown): value is Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:455:function extractFilePathsFromToolArgs(args: unknown): string[] {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:459:  const visit = (value: unknown, keyHint?: string): void => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:604:  args: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:634:      } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:667:  envelope: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:668:  meta: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:715:    const parsed = JSON.parse(payload) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:716:    const data = (parsed.data ?? {}) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:717:    const byStatus = (data.byStatus ?? {}) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:733:  } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:768:    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:827:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:845:const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:860:server.setRequestHandler(CallToolRequestSchema, async (request, _extra: unknown): Promise<any> => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:861:  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:863:  const args: Record<string, unknown> = requestParams.arguments ?? {};
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:864:  const callId = resolveToolCallId(request as { id?: unknown });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:904:    } catch (primeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:924:        } catch (surfaceErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:932:      } catch (surfaceErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:982:          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:996:          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:999:              ? envelope.meta as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1028:            const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1038:      } catch (enrichErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1055:        const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1059:            ? metaValue as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1063:            ? dataValue as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1113:      } catch (_parseErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1119:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1126:    } catch (wrapError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1169:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1223:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1276:      } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1295:      } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1317:      } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1327:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1425:  } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1442:        } catch (_histErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1452:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1469:process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1538:    } catch (validationError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1571:      causalBoost,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1613:    } catch (scoringObsErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1623:      } catch (learnedErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1674:    causalBoost.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1689:      } catch (graphRefreshErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1702:      } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1715:    } catch (cognitiveErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1723:    } catch (extractionErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1738:    } catch (archivalErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1755:    } catch (retryErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1770:    } catch (shadowEvalErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1784:    } catch (batchErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1809:    } catch (sessionErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1824:    } catch (ingestInitErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1849:                } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1862:      } catch (watchErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1867:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1880:    } catch (instructionErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1897:  main().catch((err: unknown) => { console.error('[context-server] Fatal error:', err); process.exit(1); });
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:110:          hint: 'Configure exactly one of SPECKIT_SHARED_MEMORY_ADMIN_USER_ID or SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID on the MCP server.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:164:        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:190:        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:287:    metadata?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:376:  error: unknown,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:615:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:682:        } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:732:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:779:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:800:export async function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:825:    } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:860:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:885:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:85:  decisionMeta: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:78:function mapJobForResponse(job: IngestJob): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:79:  let forecast: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:81:    forecast = getIngestForecast(job) as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:82:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:93:  let telemetryPayload: Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:119:    forecast: forecast as unknown as Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:117:  const countParams: unknown[] = [tier];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:169:    } catch (cpErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183:  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:185:  const selectParams: unknown[] = [tier];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:208:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:223:        } catch (_histErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:229:        // Clean up causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:231:        // Previously errors were caught and logged, leaving orphan causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:233:        causalEdges.deleteEdgesForMemory(String(memory.id));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:265:    } catch (hookError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:293:  const data: Record<string, unknown> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:57:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:77:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:148:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:170:  } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:268:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:282:    } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:314:          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:324:    } catch (scopeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:340:        degradedMatching: degradedTriggerMatching,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:372:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:388:        } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:517:      degradedMatching: degradedTriggerMatching,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:525:      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:16: * Accepts either exact name `pre-reconsolidation` or prefixed variants.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:36:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:10:const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:15:    .catch((error: unknown) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:12:import * as causalEdges from '../../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:38:  causalSupersedesMemoryId: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:49:      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:59:      causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:66:    causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:80:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:84:  causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:87:    causalEdges.RELATION_TYPES.SUPERSEDES,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:238:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:261:      lineageRouting.causalSupersedesMemoryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:274:      } catch (bm25_err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:294:    } catch (_histErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:176:    } catch (embedding_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:26:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:54:export interface IndexResult extends Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:74:  causalLinks?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:87:    layers: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:154:  } catch (repairErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:209:              const scopeFiltered = results.filter((r: Record<string, unknown>) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:216:              return scopeFiltered.map((r: Record<string, unknown>) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:284:                  } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:358:    } catch (reconErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:385:        const top = candidateResults[0] as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:413:          } catch (mergeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:439:    } catch (assistiveErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:113:    const parsed = JSON.parse(raw) as unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:12:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:17:// Feature catalog: Causal edge creation (memory_causal_link)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:18:// Feature catalog: Causal edge deletion (memory_causal_unlink)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:26:  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67:  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:68:  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:69:  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:70:  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:71:  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:132:function buildInClause(values: readonly unknown[]): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:141:/** Resolve many memory references in batch (exact first, fuzzy fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:196:  // 2) Batch exact path matches via canonical_file_path/file_path equality
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:253:  // 3) Batch exact title matches
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:340:/** Process causal link declarations from a memory file and insert edges into the graph */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:341:function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:350:  if (!causalLinks || typeof causalLinks !== 'object') {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:354:  // Initialize causal-edges module with database connection
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:355:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:359:  for (const references of Object.values(causalLinks)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:366:  for (const [link_type, references] of Object.entries(causalLinks)) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '320,530p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
   321	          return true;
   322	        });
   323	      }
   324	    } catch (scopeErr: unknown) {
   325	      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
   326	      results = [];
   327	    }
   328	  }
   329	  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
   330	    ? triggerMatchResult.stats.signals
   331	    : [];
   332	  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
   333	
   334	  if (!results || results.length === 0) {
   335	    const noMatchResponse = createMCPEmptyResponse({
   336	      tool: 'memory_match_triggers',
   337	      summary: 'No matching trigger phrases found',
   338	      data: {
   339	        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
   340	        degradedMatching: degradedTriggerMatching,
   341	        cognitive: useCognitive ? {
   342	          enabled: true,
   343	          sessionId,
   344	          turnNumber: turnNumber,
   345	          decayApplied: decayStats ? decayStats.decayedCount : 0
   346	        } : null
   347	      },
   348	      hints: [
   349	        'Ensure memories have trigger phrases defined',
   350	        'Try a different prompt or check memory content',
   351	        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
   352	      ],
   353	      startTime: startTime
   354	    });
   355	
   356	    logFinalTriggerEval([], Date.now() - startTime);
   357	    return noMatchResponse;
   358	  }
   359	
   360	  let formattedResults: FormattedResult[];
   361	  let cognitiveStats: CognitiveStats | null = null;
   362	
   363	  if (useCognitive) {
   364	    // Step 3: ACTIVATE (T209)
   365	    const activatedMemories: number[] = [];
   366	    for (const match of results) {
   367	      try {
   368	        attentionDecay.activateMemory(match.memoryId);
   369	        // T209: Persist max attention boost for matched memories.
   370	        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
   371	        activatedMemories.push(match.memoryId);
   372	      } catch (err: unknown) {
   373	        const message = toErrorMessage(err);
   374	        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
   375	      }
   376	    }
   377	
   378	    // Step 4: CO-ACTIVATE
   379	    const coActivatedMemories: CoActivatedMemory[] = [];
   380	    if (coActivation.isEnabled()) {
   381	      for (const memoryId of activatedMemories) {
   382	        try {
   383	          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
   384	            .map(r => ({ memoryId: r.id }));
   385	          if (boosted && Array.isArray(boosted)) {
   386	            coActivatedMemories.push(...boosted);
   387	          }
   388	        } catch (err: unknown) {
   389	          const message = toErrorMessage(err);
   390	          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
   391	        }
   392	      }
   393	    }
   394	
   395	    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
   396	    const fullRecords = fetchMemoryRecords(matchedIds);
   397	
   398	    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
   399	      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));
   400	
   401	    const turnDecayFactor = turnNumber > 1
   402	      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
   403	      : 1.0;
   404	
   405	    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
   406	      const fullRecord = fullRecords.get(match.memoryId);
   407	      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);
   408	
   409	      let attentionScore: number;
   410	      let tier: string;
   411	
   412	      if (fullRecord) {
   413	        const classification = tierClassifier.classifyTier(fullRecord);
   414	        let effectiveRetrievability = classification.retrievability;
   415	
   416	        if (wmEntry) {
   417	          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
   418	          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
   419	        } else {
   420	          effectiveRetrievability *= turnDecayFactor;
   421	        }
   422	
   423	        attentionScore = effectiveRetrievability;
   424	        tier = tierClassifier.classifyState(effectiveRetrievability);
   425	      } else {
   426	        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
   427	        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
   428	        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
   429	        tier = tierClassifier.classifyState(attentionScore);
   430	      }
   431	
   432	      // Clamp to [0,1] — retrievability * decay or wmEntry scores
   433	      // Can drift outside the valid range due to floating-point arithmetic.
   434	      attentionScore = Math.max(0, Math.min(1, attentionScore));
   435	
   436	      return {
   437	        ...match,
   438	        attentionScore: attentionScore,
   439	        tier,
   440	        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
   441	      };
   442	    });
   443	
   444	    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);
   445	
   446	    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
   447	      const content: string = await getTieredContent({
   448	        filePath: r.filePath,
   449	        title: r.title,
   450	        triggerPhrases: r.matchedPhrases
   451	      }, r.tier);
   452	
   453	      return {
   454	        memoryId: r.memoryId,
   455	        specFolder: r.specFolder,
   456	        filePath: r.filePath,
   457	        title: r.title,
   458	        matchedPhrases: r.matchedPhrases,
   459	        importanceWeight: r.importanceWeight,
   460	        tier: r.tier,
   461	        attentionScore: r.attentionScore,
   462	        content: content,
   463	        coActivated: r.coActivated || false
   464	      };
   465	    }));
   466	
   467	    cognitiveStats = {
   468	      enabled: true,
   469	      sessionId: sessionId!,
   470	      turnNumber: turnNumber,
   471	      decayApplied: decayStats ? decayStats.decayedCount : 0,
   472	      memoriesActivated: activatedMemories.length,
   473	      coActivations: coActivatedMemories.length,
   474	      tierDistribution: tierClassifier.getStateStats(enrichedResults),
   475	      tokenMetrics: calculateTokenMetrics(results, formattedResults)
   476	    };
   477	
   478	  } else {
   479	    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
   480	      memoryId: r.memoryId,
   481	      specFolder: r.specFolder,
   482	      filePath: r.filePath,
   483	      title: r.title,
   484	      matchedPhrases: r.matchedPhrases,
   485	      importanceWeight: r.importanceWeight
   486	    }));
   487	  }
   488	
   489	  const latencyMs = Date.now() - startTime;
   490	  if (latencyMs > 100) {
   491	    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
   492	  }
   493	
   494	  const summary = useCognitive
   495	    ? `Matched ${formattedResults.length} memories with cognitive features`
   496	    : `Matched ${formattedResults.length} memories via trigger phrases`;
   497	
   498	  const hints: string[] = [];
   499	  if (!useCognitive && sessionId) {
   500	    hints.push('Enable cognitive features with include_cognitive: true');
   501	  }
   502	  const coldCount = cognitiveStats?.tierDistribution?.COLD;
   503	  if (coldCount !== undefined && coldCount > 0) {
   504	    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
   505	  }
   506	  if (detectedSignals.length > 0) {
   507	    hints.push(`Signal vocabulary applied (${detectedSignals.length} category matches)`);
   508	  }
   509	
   510	  const _triggersResponse = createMCPSuccessResponse({
   511	    tool: 'memory_match_triggers',
   512	    summary,
   513	    data: {
   514	      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
   515	      count: formattedResults.length,
   516	      results: formattedResults,
   517	      degradedMatching: degradedTriggerMatching,
   518	      cognitive: cognitiveStats
   519	    },
   520	    hints,
   521	    startTime: startTime,
   522	    extraMeta: {
   523	      latencyMs: latencyMs,
   524	      triggerSignals: detectedSignals,
   525	      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
   526	    }
   527	  });
   528	
   529	  // Consumption instrumentation — log triggers event (fail-safe, never throws)
   530	  try {

exec
/bin/zsh -lc "rg -n \"function handleMemoryContext|const handle_memory_context|mode === 'resume'|certainty|degraded|unknown|estimated|exact\" .opencode/skill/system-spec-kit/mcp_server/handlers -g 'memory-context*.ts' -g '*context*.ts' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:102:interface ContextResult extends Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:193:  details: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:218:function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:220:    const parsed = JSON.parse(responseText) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:221:    const outerData = parsed?.data as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:224:      ? outerData.results as Array<Record<string, unknown>>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:238:    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:239:    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:241:      ? nestedData.results as Array<Record<string, unknown>>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:249:  if ((result as Record<string, unknown>).isError !== true) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:253:  const content = Array.isArray((result as Record<string, unknown>).content)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:254:    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:272:        details?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:304:  graphContextResult: Record<string, unknown> | null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:314:  const metadata = graphContextResult?.metadata as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:374:    const fallbackContent = Array.isArray((fallbackResult as Record<string, unknown>).content)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:375:      ? ((fallbackResult as Record<string, unknown>).content as Array<Record<string, unknown>>)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:378:    const candidateInnerStates: Array<Record<string, unknown>> = [
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:410:      const meta = candidateInnerStates[0].meta as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:417:        (fallbackResult as Record<string, unknown>).content = contentClone;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:419:        (fallbackResult as Record<string, unknown>).content = [
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:440:    innerEnvelope: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:441:    currentResults: Array<Record<string, unknown>>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:476:          ...((innerEnvelope.data as Record<string, unknown>) ?? {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:511:  const contentArr = (truncatedResult as Record<string, unknown>).content as Array<{ type: string; text: string }> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:550:          const metadataOnly = droppedResults.map((r: Record<string, unknown>) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:574:        (truncatedResult as Record<string, unknown>).content = contentArr;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:957:      (options as Record<string, unknown>).folderBoost = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:963:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:995:function buildResponseMeta(params: BuildResponseMetaParams): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1034:        } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1082:async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1089:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1140:  let graphContextResult: Record<string, unknown> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1289:    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1331:    } catch (_autoProfileErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1349:  // Do NOT propagate as options.specFolder — that becomes an exact-match filter
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1372:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1416:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1444:      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1453:  const responseData: ContextResult & Record<string, unknown> = { ...tracedResult };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1580:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:153:    }) as unknown as CodeGraphSeed[];
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:191:              detectorProvenance: getLastDetectorProvenance() ?? 'unknown',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:197:  } catch (err: unknown) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts | sed -n '340,450p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	/** Process causal link declarations from a memory file and insert edges into the graph */
   341	function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
   342	  const result: CausalLinksResult = {
   343	    processed: 0,
   344	    inserted: 0,
   345	    resolved: 0,
   346	    unresolved: [],
   347	    errors: []
   348	  };
   349	
   350	  if (!causalLinks || typeof causalLinks !== 'object') {
   351	    return result;
   352	  }
   353	
   354	  // Initialize causal-edges module with database connection
   355	  causalEdges.init(database);
   356	
   357	  const memoryIdStr = String(memoryId);
   358	  const allReferences: string[] = [];
   359	  for (const references of Object.values(causalLinks)) {
   360	    if (Array.isArray(references)) {
   361	      allReferences.push(...references);
   362	    }
   363	  }
   364	  const resolvedReferenceMap = resolveMemoryReferencesBatch(database, allReferences);
   365	
   366	  for (const [link_type, references] of Object.entries(causalLinks)) {
   367	    if (!Array.isArray(references) || references.length === 0) {
   368	      continue;
   369	    }
   370	
   371	    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
   372	    if (!mapping) {
   373	      console.warn(`[causal-links] Unknown link type: ${link_type}`);
   374	      continue;
   375	    }
   376	
   377	    for (const reference of references) {
   378	      result.processed++;
   379	
   380	      let resolvedId: number | null;
   381	      try {
   382	        const candidate = resolvedReferenceMap.get(reference);
   383	        resolvedId = typeof candidate === 'number' ? candidate : null;
   384	      } catch (err: unknown) {
   385	        const message = toErrorMessage(err);
   386	        result.errors.push({ type: link_type, reference, error: `Resolution failed: ${message}` });
   387	        console.warn(`[causal-links] Failed to resolve reference "${reference}": ${message}`);
   388	        continue;
   389	      }
   390	
   391	      if (!resolvedId) {
   392	        result.unresolved.push({ type: link_type, reference });
   393	        continue;
   394	      }
   395	
   396	      result.resolved++;
   397	
   398	      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
   399	      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);
   400	
   401	      try {
   402	        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
   403	        result.inserted++;
   404	        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
   405	      } catch (err: unknown) {
   406	        const message = toErrorMessage(err);
   407	        if (message.includes('UNIQUE constraint')) {
   408	          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
   409	        } else {
   410	          result.errors.push({ type: link_type, reference, error: message });
   411	          console.warn(`[causal-links] Failed to insert edge: ${message}`);
   412	        }
   413	      }
   414	    }
   415	  }
   416	
   417	  return result;
   418	}
   419	
   420	// ───────────────────────────────────────────────────────────────────
   421	// 6. EXPORTS
   422	// ───────────────────────────────────────────────────────────────────
   423	
   424	export {
   425	  processCausalLinks,
   426	  resolveMemoryReference,
   427	  resolveMemoryReferencesBatch,
   428	  CAUSAL_LINK_MAPPINGS,
   429	};
   430	
   431	// Re-export from handler-utils for backward compatibility
   432	export { detectSpecLevelFromParsed } from './handler-utils.js';
   433	
   434	export type {
   435	  CausalLinkMapping,
   436	  CausalLinksResult,
   437	};

exec
/bin/zsh -lc "rg -n \"generate-context\\.js|memory_search|memory_context|memory_match_triggers|code_graph_query|cocoindex\" .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/SKILL.md:67:  - `memory/` → uses generate-context.js script
.opencode/skill/system-spec-kit/SKILL.md:355:**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`.
.opencode/skill/system-spec-kit/SKILL.md:511:- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
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
.opencode/skill/system-spec-kit/SKILL.md:768:| `code_graph_query` | Query relationships: outline, calls_from/to, imports_from/to |
.opencode/skill/system-spec-kit/SKILL.md:784:**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.
.opencode/skill/system-spec-kit/SKILL.md:884:- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
.opencode/skill/system-spec-kit/SKILL.md:941:| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/` |
.opencode/skill/system-spec-kit/SKILL.md:969:| Memory gen        | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file creation              |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '752,804p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/SKILL.md | sed -n '508,540p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   508	
   509	**Manual context save (MANDATORY workflow):**
   510	- Trigger: `/memory:save`, "save context", or "save memory"
   511	- **MUST use:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
   512	- **NEVER:** Create memory files manually via Write/Edit (AGENTS.md Memory Save Rule)
   513	- **JSON mode (PREFERRED):** AI composes structured JSON → pass via `--json`, `--stdin`, or temp file. The AI has strictly better information about its own session than any DB query.
   514	- **Structured JSON fields:** The JSON payload supports optional structured summary fields that improve memory quality:
   515	  - `toolCalls[]` — AI-composed tool call records (`tool`, `inputSummary`, `outputSummary`, `status`)
   516	  - `exchanges[]` — Key conversation turns (`userInput`, `assistantResponse`, `timestamp`)
   517	  - `preflight` / `postflight` — Epistemic baseline snapshots (`knowledgeScore`, `uncertaintyScore`, `contextScore`, `gaps[]`, `confidence`)
   518	  - `sessionSummary` — Free-text session narrative (used for conversation synthesis when conversation prompts are sparse)
   519	  - The AI has strictly better information about its own session than any DB extraction; these fields provide richer context at source.
   520	- Location: `specs/###-folder/memory/`
   521	- Filename: `DD-MM-YY_HH-MM__topic.md` (auto-generated by script)
   522	- Content includes: PROJECT STATE SNAPSHOT with Phase, Last Action, Next Action, Blockers
   523	
   524	**Subfolder Support:**
   525	
   526	The generate-context script supports nested spec folder paths (parent/child format):
   527	
   528	```bash
   529	# Full nested path (parent/child)
   530	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit/121-script-audit","sessionSummary":"..."}' system-spec-kit/121-script-audit
   531	
   532	# Bare child name (auto-searches all parents for unique match)
   533	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"121-script-audit","sessionSummary":"..."}' 121-script-audit
   534	
   535	# With specs/ prefix
   536	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"specs/system-spec-kit/121-script-audit","sessionSummary":"..."}' specs/system-spec-kit/121-script-audit
   537	
   538	# Flat folder
   539	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit","sessionSummary":"..."}' system-spec-kit
   540	```

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/SKILL.md | sed -n '568,606p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   568	**MCP Tools (18 most-used of 47 total — see [memory_system.md](./references/memory/memory_system.md) for full reference):**
   569	
   570	| Tool                            | Layer | Purpose                                           |
   571	| ------------------------------- | ----- | ------------------------------------------------- |
   572	| `memory_context()`              | L1    | Unified entry point — modes: auto, quick, deep, focused, resume |
   573	| `memory_search()`               | L2    | 5-channel hybrid retrieval with intent-aware routing, channel normalization, graph/degree signals, reranking, and filtered output |
   574	| `memory_quick_search()`         | L2    | Simplified search (query + optional spec folder)  |
   575	| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
   576	| `memory_save()`                 | L2    | Index a memory file with pre-flight validation    |
   577	| `memory_list()`                 | L3    | Browse stored memories with pagination (parent rows by default) |
   578	| `memory_delete()`               | L4    | Delete memories by ID or spec folder              |
   579	| `checkpoint_create()`           | L5    | Create gzip-compressed checkpoint snapshot        |
   580	| `checkpoint_restore()`          | L5    | Transaction-wrapped restore with rollback         |
   581	| `memory_stats()`                | L3    | System statistics and memory counts                |
   582	| `memory_health()`              | L3    | Diagnostics: orphan detection, index consistency   |
   583	| `shared_memory_status()`        | L5    | Shared-memory subsystem status check               |
   584	| `memory_index_scan()`          | L7    | Workspace scanning and re-indexing                 |
   585	| `checkpoint_list()`            | L5    | List available checkpoint snapshots                |
   586	| `checkpoint_delete()`          | L5    | Delete checkpoint by name (with confirmName safety)|
   587	| `shared_memory_enable()`        | L5    | Enable shared-memory collaboration subsystem       |
   588	| `shared_space_upsert()`         | L5    | Create or update shared collaboration space        |
   589	| `shared_space_membership_set()` | L5    | Set membership for shared collaboration space      |
   590	
   591	> **Search architecture:** The search pipeline uses a 4-stage architecture (candidate generation → fusion → reranking → filtering). Current retrieval uses five channels, normalizes fallback thresholds correctly, keeps disabled channels disabled through fallback, defers irreversible confidence truncation until after reranking, and enforces token budgets using actual post-truncation counts. See [search/README.md](./mcp_server/lib/search/README.md) for pipeline details, scoring algorithms, and graph signal features.
   592	
   593	**memory_context() — Mode Routing:**
   594	
   595	| Mode | Token Budget | When `mode=auto`: Intent Routing |
   596	| --- | --- | --- |
   597	| `quick` | 800 | — |
   598	| `deep` | 3500 | `add_feature`, `refactor`, `security_audit` |
   599	| `focused` | 3000 | `fix_bug`, `understand` |
   600	| `resume` | 1200 | — |
   601	
   602	**memory_search() — Key Rules:**
   603	- **REQUIRED:** `query` (string) OR `concepts` (2-5 strings). `specFolder` alone causes E040 error.
   604	- Use `anchors` with `includeContent: true` for token-efficient section retrieval (~90% savings).
   605	- Intent weights auto-adjust scoring: `fix_bug` boosts recency, `security_audit` boosts importance, `refactor`/`understand` boost similarity.
   606	- **Full parameter reference:** See [memory_system.md](./references/memory/memory_system.md)

codex
I’ve got enough source evidence to separate “adoptable integrity checks” from “don’t import the whole scaffold contract,” so I’m doing one semantic pass as a sanity check before I rank everything. If CocoIndex adds anything real, I’ll fold it in; if not, I’ll keep the final call grounded in the traced source and tests.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1082,1165p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1450,1535p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1082	async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
  1083	  const _contextStartTime = Date.now();
  1084	  const requestId = randomUUID();
  1085	
  1086	  try {
  1087	  try {
  1088	    await checkDatabaseUpdated();
  1089	  } catch (error: unknown) {
  1090	    const message = error instanceof Error ? error.message : String(error);
  1091	    return createMCPErrorResponse({
  1092	      tool: 'memory_context',
  1093	      error: `Database state check failed: ${message}`,
  1094	      code: 'E_INTERNAL',
  1095	      details: { requestId, layer: 'L1:Orchestration' },
  1096	      recovery: {
  1097	        hint: 'The memory database may be unavailable. Retry or check database connectivity.',
  1098	      },
  1099	    });
  1100	  }
  1101	
  1102	  const {
  1103	    input,
  1104	    mode: requested_mode = 'auto',
  1105	    intent: explicit_intent,
  1106	    specFolder: spec_folder,
  1107	    limit,
  1108	    enableDedup: enableDedup = true,
  1109	    includeContent: include_content = false,
  1110	    tokenUsage,
  1111	    anchors
  1112	  } = args;
  1113	
  1114	  // Validate input
  1115	  if (!input || typeof input !== 'string' || input.trim().length === 0) {
  1116	    return createMCPErrorResponse({
  1117	      tool: 'memory_context',
  1118	      error: 'Input is required and must be a non-empty string',
  1119	      code: 'E_VALIDATION',
  1120	      details: { requestId, layer: 'L1:Orchestration' },
  1121	      recovery: {
  1122	        hint: 'Provide a query, prompt, or context description'
  1123	      }
  1124	    });
  1125	  }
  1126	
  1127	  const normalizedInput = input.trim();
  1128	
  1129	  // ── Phase 020: Query-Intent Routing ──────────────────────────
  1130	  // Classify query intent and optionally augment response with code
  1131	  // graph context for structural/hybrid queries. Entire block is
  1132	  // wrapped in try/catch — any failure silently falls through to
  1133	  // existing semantic logic.
  1134	  let queryIntentMetadata: {
  1135	    queryIntent: string;
  1136	    routedBackend: string;
  1137	    confidence: number;
  1138	    matchedKeywords?: string[];
  1139	  } | null = null;
  1140	  let graphContextResult: Record<string, unknown> | null = null;
  1141	
  1142	  if (requested_mode !== 'resume') {
  1143	    try {
  1144	      const classification = classifyQueryIntent(normalizedInput);
  1145	      queryIntentMetadata = {
  1146	        queryIntent: classification.intent,
  1147	        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
  1148	          ? 'structural'
  1149	          : classification.intent === 'hybrid'
  1150	            ? 'hybrid'
  1151	            : 'semantic',
  1152	        confidence: classification.confidence,
  1153	        matchedKeywords: classification.matchedKeywords,
  1154	      };
  1155	
  1156	      // F050: Extract a symbol-like token from the query instead of passing
  1157	      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
  1158	      // against code_nodes.name / fq_name, so prose never resolves.
  1159	      // Heuristic: pick the first token that looks like a code identifier
  1160	      // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
  1161	      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
  1162	      const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
  1163	      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
  1164	      const extractedSubject =
  1165	        inputTokens.find(t => codeIdentifierPattern.test(t)) ??

 succeeded in 0ms:
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
  1466	    responseData.structuralRoutingNudge = structuralRoutingNudge;
  1467	  }
  1468	
  1469	  // Build response with layer metadata
  1470	  const _contextResponse = createMCPResponse({
  1471	    tool: 'memory_context',
  1472	    summary: enforcement.truncated
  1473	      ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
  1474	      : `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy)`,
  1475	    data: responseData,
  1476	    hints: [
  1477	      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
  1478	      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
  1479	      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
  1480	      ...(structuralRoutingNudge ? [structuralRoutingNudge.message] : []),
  1481	      ...(pressureWarning ? [pressureWarning] : [])
  1482	    ],
  1483	    extraMeta: buildResponseMeta({
  1484	      effectiveMode,
  1485	      requestedMode: requested_mode,
  1486	      tracedResult,
  1487	      pressurePolicy,
  1488	      pressureOverrideApplied,
  1489	      pressureOverrideTargetMode,
  1490	      pressureWarning,
  1491	      sessionLifecycle,
  1492	      effectiveBudget,
  1493	      enforcement,
  1494	      intentClassification: {
  1495	        detectedIntent,
  1496	        intentConfidence,
  1497	        resumeHeuristicApplied,
  1498	        source: intentSource,
  1499	      },
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '30,130p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve traced the core modules and tests. To make sure this iteration truly ranks the full body of work instead of only today’s slice, I’m checking the phase’s existing research artifacts for the already-recorded findings and then I’ll merge them into one ordered roadmap.
exec
/bin/zsh -lc 'rg -n "''^### Finding|''^## Findings|Recommendation:|Impact:" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research -g '"'*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:1:### Finding 3: Mex has a strong repair lifecycle loop even though it lacks a true session subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:8:### Finding 4: Spec Kit Memory has a trusted, scoped session model; Mex effectively has none
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:15:### Finding 5: `generate-context.js` is a real session-capture pipeline; Mex’s GROW model is authoring discipline, not structured capture
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:245:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:247:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6411:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6412:### Finding 1: Mex has a cleaner single hygiene surface, but our hygiene logic is richer and fragmented
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6419:### Finding 2: Mex does not have a real trigger system; our trigger stack is an actual scoped retrieval subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6426:### Finding 3: Our trigger hygiene is already stricter than Mex’s scaffold hygiene, but it is mostly hidden in save-time review code
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6433:### Finding 4: Our causal-link hygiene is a true graph lifecycle; Mex frontmatter edges are only dead-link validation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6440:### Finding 5: Mex surfaces staleness much better than we do, even though our graph already has latent stale-edge primitives
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6494:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6495:### Finding 1: Mex has a cleaner single hygiene surface, but our hygiene logic is richer and fragmented
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6502:### Finding 2: Mex does not have a real trigger system; our trigger stack is an actual scoped retrieval subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6509:### Finding 3: Our trigger hygiene is already stricter than Mex’s scaffold hygiene, but it is mostly hidden in save-time review code
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6516:### Finding 4: Our causal-link hygiene is a true graph lifecycle; Mex frontmatter edges are only dead-link validation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md:6523:### Finding 5: Mex surfaces staleness much better than we do, even though our graph already has latent stale-edge primitives
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:1:### Finding 5: Mex’s registration model is small, explicit, and worth borrowing for a docs-drift subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8:### Finding 6: Public already has the large, layered surface that most needs Mex-style static drift checks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:239:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:241:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8000:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8002:### Finding 1: Mex creates continuity by installing a scaffold, not by minting a session
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8009:### Finding 2: Mex survives across sessions by forcing every cold start through `AGENTS.md` -> `ROUTER.md` -> targeted context files
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8016:### Finding 3: Mex maintains context retrospectively with drift checks and repair loops, not live working memory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8023:### Finding 4: Mex has no explicit end-of-session summarizer, checkpoint, or trusted resume cache in the inspected runtime
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8030:### Finding 5: Spec Kit Memory already has the session primitives Mex is missing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8037:### Finding 6: Spec Kit Memory also closes sessions explicitly through save-time summaries, continuation metadata, and learning records
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8094:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8096:### Finding 1: Mex creates continuity by installing a scaffold, not by minting a session
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8103:### Finding 2: Mex survives across sessions by forcing every cold start through `AGENTS.md` -> `ROUTER.md` -> targeted context files
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8110:### Finding 3: Mex maintains context retrospectively with drift checks and repair loops, not live working memory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8117:### Finding 4: Mex has no explicit end-of-session summarizer, checkpoint, or trusted resume cache in the inspected runtime
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8124:### Finding 5: Spec Kit Memory already has the session primitives Mex is missing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md:8131:### Finding 6: Spec Kit Memory also closes sessions explicitly through save-time summaries, continuation metadata, and learning records
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:209:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:211:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:4782:  routingRecommendation: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9221:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9222:### Finding 1: Mex’s real innovation is a separate knowledge control plane, not markdown storage alone
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9229:### Finding 2: The hinge is claim extraction: Mex converts prose into typed, checkable assertions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9236:### Finding 3: Targeted sync is the strongest adoptable pattern because it repairs only the broken knowledge surface
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9243:### Finding 4: Mex’s freshness model is useful because it measures both elapsed time and repo churn
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9250:### Finding 5: Mex also checks omissions, not just false statements, via reality-to-scaffold coverage
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9288:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9289:### Finding 1: Mex’s real innovation is a separate knowledge control plane, not markdown storage alone
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9296:### Finding 2: The hinge is claim extraction: Mex converts prose into typed, checkable assertions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9303:### Finding 3: Targeted sync is the strongest adoptable pattern because it repairs only the broken knowledge surface
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9310:### Finding 4: Mex’s freshness model is useful because it measures both elapsed time and repo churn
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md:9317:### Finding 5: Mex also checks omissions, not just false statements, via reality-to-scaffold coverage
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:1:### Finding 6: Mex enforces repo-root and scaffold-root boundaries, but only at the project level
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:217:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:219:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9249:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9250:### Finding 1: Mex does not implement live ranked retrieval; it implements deterministic scaffold navigation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9257:### Finding 2: Mex’s strongest bootstrap retrieval idea is the bounded scanner brief, but it is shallow and heuristic
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9264:### Finding 3: Mex’s repair-time retrieval is issue-seeded, file-scoped, and more surgical than its general navigation model
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9271:### Finding 4: Mex’s `triggers` are scaffold metadata, not an executable recall mechanism
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9278:### Finding 5: Spec Kit Memory is a real hybrid retrieval engine; Mex is not in the same class
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9285:### Finding 6: Our semantic-to-structural bridge is the sharpest retrieval advantage over Mex
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9329:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9330:### Finding 1: Mex does not implement live ranked retrieval; it implements deterministic scaffold navigation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9337:### Finding 2: Mex’s strongest bootstrap retrieval idea is the bounded scanner brief, but it is shallow and heuristic
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9344:### Finding 3: Mex’s repair-time retrieval is issue-seeded, file-scoped, and more surgical than its general navigation model
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9351:### Finding 4: Mex’s `triggers` are scaffold metadata, not an executable recall mechanism
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9358:### Finding 5: Spec Kit Memory is a real hybrid retrieval engine; Mex is not in the same class
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md:9365:### Finding 6: Our semantic-to-structural bridge is the sharpest retrieval advantage over Mex
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:209:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:211:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5287:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5288:### Finding 1: Mex preserves issue locality from drift detection into repair
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5295:### Finding 2: The sync brief is bounded on purpose and only adds evidence needed to repair the flagged file
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5302:### Finding 3: Mex’s repair loop is severity-gated and iterative, which limits churn
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5309:### Finding 4: Claim extraction is the prerequisite for targeted sync, but the heuristic layer is shallow by design
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5316:### Finding 5: Spec Kit has adjacent diagnostics, but not a repair control plane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5323:### Finding 6: Mex’s bounded sync is useful, but its evidence model has clear limits we should not copy blindly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5372:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5373:### Finding 1: Mex preserves issue locality from drift detection into repair
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5380:### Finding 2: The sync brief is bounded on purpose and only adds evidence needed to repair the flagged file
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5387:### Finding 3: Mex’s repair loop is severity-gated and iterative, which limits churn
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5394:### Finding 4: Claim extraction is the prerequisite for targeted sync, but the heuristic layer is shallow by design
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5401:### Finding 5: Spec Kit has adjacent diagnostics, but not a repair control plane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md:5408:### Finding 6: Mex’s bounded sync is useful, but its evidence model has clear limits we should not copy blindly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:187:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:189:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5910:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5911:### Finding 1: Mex uses a router-first markdown scaffold as its control plane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5918:### Finding 2: The CLI is a thin orchestrator over distinct setup, drift, scan, sync, pattern, and hook subsystems
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5925:### Finding 3: Mex front-loads static scanning so AI writes from a structured brief instead of raw repo exploration
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5932:### Finding 4: The drift engine is a clean static-analysis pipeline, not an AI validator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5939:### Finding 5: Mex’s repair layer is issue-scoped and surgical, with filesystem and git evidence bundled into the prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5980:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5981:### Finding 1: Mex uses a router-first markdown scaffold as its control plane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5988:### Finding 2: The CLI is a thin orchestrator over distinct setup, drift, scan, sync, pattern, and hook subsystems
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:5995:### Finding 3: Mex front-loads static scanning so AI writes from a structured brief instead of raw repo exploration
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:6002:### Finding 4: The drift engine is a clean static-analysis pipeline, not an AI validator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md:6009:### Finding 5: Mex’s repair layer is issue-scoped and surgical, with filesystem and git evidence bundled into the prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:200:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:202:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:4500:    30	  routingRecommendation: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:5936:    30	  routingRecommendation: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8499:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8500:### Finding 1: Split “memory health” into storage integrity vs knowledge-truth drift
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8507:### Finding 2: Freshness should include repository-activity drift, not just session and graph readiness
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8514:### Finding 3: Repair should be turned into bounded, file-scoped remediation packets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8521:### Finding 4: Durable project knowledge wants a doc-native routing scaffold beside indexed memory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8528:### Finding 5: Pattern growth is worth keeping, but only with a higher authority bar than Mex uses
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8566:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8567:### Finding 1: Split “memory health” into storage integrity vs knowledge-truth drift
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8574:### Finding 2: Freshness should include repository-activity drift, not just session and graph readiness
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8581:### Finding 3: Repair should be turned into bounded, file-scoped remediation packets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8588:### Finding 4: Durable project knowledge wants a doc-native routing scaffold beside indexed memory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md:8595:### Finding 5: Pattern growth is worth keeping, but only with a higher authority bar than Mex uses
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:1:### Finding 6: Spec Kit Memory already implements the lifecycle primitives Mex is missing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:243:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:245:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8673:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8674:### Finding 1: Mex standardizes agent onboarding around one shared scaffold anchor
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8681:### Finding 2: Mex narrows agent scope during setup by forcing a synthesized brief before broad exploration
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8688:### Finding 3: Mex’s sync flow is a surgical repair generator, not a generic “rewrite docs” loop
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8695:### Finding 4: Mex has almost no real multi-agent safety beyond prompts telling one agent to behave
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8702:### Finding 5: Mex’s “passive capture” is really passive drift nudging, not passive knowledge capture
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8709:### Finding 6: Mex enforces repo-root and scaffold-root boundaries, but only at the project level
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8748:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8749:### Finding 1: Mex standardizes agent onboarding around one shared scaffold anchor
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8756:### Finding 2: Mex narrows agent scope during setup by forcing a synthesized brief before broad exploration
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8763:### Finding 3: Mex’s sync flow is a surgical repair generator, not a generic “rewrite docs” loop
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8770:### Finding 4: Mex has almost no real multi-agent safety beyond prompts telling one agent to behave
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8777:### Finding 5: Mex’s “passive capture” is really passive drift nudging, not passive knowledge capture
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md:8784:### Finding 6: Mex enforces repo-root and scaffold-root boundaries, but only at the project level
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:1:### Finding 4: Claim extraction is the prerequisite for targeted sync, but the heuristic layer is shallow by design
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:8:### Finding 5: Spec Kit has adjacent diagnostics, but not a repair control plane
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:15:### Finding 6: Mex’s bounded sync is useful, but its evidence model has clear limits we should not copy blindly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:243:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:245:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9136:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9137:### Finding 1: Mex fails open when git- or manifest-backed evidence disappears, so checks quietly lose authority instead of reporting degraded state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9144:### Finding 2: Frontmatter corruption is tolerated by omission, which prevents crashes but also suppresses edge validation entirely
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9151:### Finding 3: The repair loop is robust after AI execution, but its process-status semantics are ambiguous under timeout or interrupted sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9158:### Finding 4: Mex’s advertised multi-language breadth is real in scanner setup, but not in drift validation or repair evidence
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9165:### Finding 5: Scaling is controlled with hard caps and shallow searches, which stabilizes prompts but creates predictable blind spots in larger repos
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9172:### Finding 6: Setup and migration rely on heuristics that preserve user edits, but they can also preserve stale scaffolds and misclassify repo maturity
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9245:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9246:### Finding 1: Mex fails open when git- or manifest-backed evidence disappears, so checks quietly lose authority instead of reporting degraded state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9253:### Finding 2: Frontmatter corruption is tolerated by omission, which prevents crashes but also suppresses edge validation entirely
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9260:### Finding 3: The repair loop is robust after AI execution, but its process-status semantics are ambiguous under timeout or interrupted sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9267:### Finding 4: Mex’s advertised multi-language breadth is real in scanner setup, but not in drift validation or repair evidence
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9274:### Finding 5: Scaling is controlled with hard caps and shallow searches, which stabilizes prompts but creates predictable blind spots in larger repos
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md:9281:### Finding 6: Setup and migration rely on heuristics that preserve user edits, but they can also preserve stale scaffolds and misclassify repo maturity
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:1:### Finding 4: Command And Dependency Parity Checks Need A Broader Inventory Model Than Mex Has
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:8:### Finding 5: Drift-To-Repair Briefing Is Promising, But It Should Become A Spec Kit Repair Surface, Not A Mex-Style CLI Loop
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:239:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:241:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7214:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7215:### Finding 1: Static Reference Integrity Is Worth Adopting, But Mex’s Path Semantics Are Too Shallow To Port Directly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7222:### Finding 2: Git-Based Freshness Helps, But Silent Nulls And Dual Thresholds Could Distort The Signal
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7229:### Finding 3: Command, Dependency, And Script Parity Would Break Down Quickly In A Multi-Surface Repo
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7236:### Finding 4: Drift-To-Repair Briefing Is Reusable, But Mex’s Sync Loop Is Too Optimistic For Spec Kit
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7243:### Finding 5: Auto-Growth Is Powerful, But In Spec Kit It Could Turn Partial Knowledge Into Durable Policy
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7250:### Finding 6: Mex’s Single Drift Score Would Be Misleading If We Treated It As A Primary Health Signal
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7289:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7290:### Finding 1: Static Reference Integrity Is Worth Adopting, But Mex’s Path Semantics Are Too Shallow To Port Directly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7297:### Finding 2: Git-Based Freshness Helps, But Silent Nulls And Dual Thresholds Could Distort The Signal
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7304:### Finding 3: Command, Dependency, And Script Parity Would Break Down Quickly In A Multi-Surface Repo
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7311:### Finding 4: Drift-To-Repair Briefing Is Reusable, But Mex’s Sync Loop Is Too Optimistic For Spec Kit
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7318:### Finding 5: Auto-Growth Is Powerful, But In Spec Kit It Could Turn Partial Knowledge Into Durable Policy
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md:7325:### Finding 6: Mex’s Single Drift Score Would Be Misleading If We Treated It As A Primary Health Signal
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:1:### Finding 6: Spec Kit Memory is structurally in a different class, so Mex should complement it rather than replace it
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:213:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:215:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6499:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6501:### Finding 1: Mex exposes a CLI contract, not a tool protocol
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6508:### Finding 2: Mex’s “profile separation” is instruction-file distribution, not capability separation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6515:### Finding 3: Mex’s repair loop is single-provider and interactive by construction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6522:### Finding 4: Mex’s own command surface already drifts in code
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6529:### Finding 5: Mex’s registration model is small, explicit, and worth borrowing for a docs-drift subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6536:### Finding 6: Public already has the large, layered surface that most needs Mex-style static drift checks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6590:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6592:### Finding 1: Mex exposes a CLI contract, not a tool protocol
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6599:### Finding 2: Mex’s “profile separation” is instruction-file distribution, not capability separation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6606:### Finding 3: Mex’s repair loop is single-provider and interactive by construction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6613:### Finding 4: Mex’s own command surface already drifts in code
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6620:### Finding 5: Mex’s registration model is small, explicit, and worth borrowing for a docs-drift subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md:6627:### Finding 6: Public already has the large, layered surface that most needs Mex-style static drift checks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:1:### Finding 3: Mex’s repair-time retrieval is issue-seeded, file-scoped, and more surgical than its general navigation model
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:8:### Finding 4: Mex’s `triggers` are scaffold metadata, not an executable recall mechanism
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:15:### Finding 5: Spec Kit Memory is a real hybrid retrieval engine; Mex is not in the same class
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:22:### Finding 6: Our semantic-to-structural bridge is the sharpest retrieval advantage over Mex
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:243:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:245:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:5558:    30	  routingRecommendation: string;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9276:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9278:### Finding 1: Mex’s “session bootstrap” is a static reading ritual, not an executable recovery surface
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9285:### Finding 2: Mex’s `init`/`setup` flow creates a cold-start brief, but it is not continuity state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9292:### Finding 3: Mex has a strong repair lifecycle loop even though it lacks a true session subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9299:### Finding 4: Spec Kit Memory has a trusted, scoped session model; Mex effectively has none
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9306:### Finding 5: `generate-context.js` is a real session-capture pipeline; Mex’s GROW model is authoring discipline, not structured capture
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9359:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9361:### Finding 1: Mex’s “session bootstrap” is a static reading ritual, not an executable recovery surface
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9368:### Finding 2: Mex’s `init`/`setup` flow creates a cold-start brief, but it is not continuity state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9375:### Finding 3: Mex has a strong repair lifecycle loop even though it lacks a true session subsystem
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9382:### Finding 4: Spec Kit Memory has a trusted, scoped session model; Mex effectively has none
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md:9389:### Finding 5: `generate-context.js` is a real session-capture pipeline; Mex’s GROW model is authoring discipline, not structured capture
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:1:### Finding 5: We should add reverse coverage audits that detect live repo knowledge missing from memory/spec surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:243:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:245:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9410:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9411:### Finding 1: We should split our current “health” surface into storage health and knowledge-drift health
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9418:### Finding 2: We should add a separate repo-activity freshness signal instead of overloading session/code-graph freshness
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9425:### Finding 3: Our repair architecture should emit structured issue bundles, not just hints plus internal auto-repair actions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9432:### Finding 4: We should reject Mex’s heuristic markdown-claim extraction as a primary authority model
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9439:### Finding 5: If we add a pattern layer, it must be provenance-backed and quality-gated from creation time
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9446:### Finding 6: A single numeric “knowledge health score” could help operators, but only as a secondary surface
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9510:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9511:### Finding 1: We should split our current “health” surface into storage health and knowledge-drift health
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9518:### Finding 2: We should add a separate repo-activity freshness signal instead of overloading session/code-graph freshness
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9525:### Finding 3: Our repair architecture should emit structured issue bundles, not just hints plus internal auto-repair actions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9532:### Finding 4: We should reject Mex’s heuristic markdown-claim extraction as a primary authority model
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9539:### Finding 5: If we add a pattern layer, it must be provenance-backed and quality-gated from creation time
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md:9546:### Finding 6: A single numeric “knowledge health score” could help operators, but only as a secondary surface
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:244:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:246:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8045:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8046:### Finding 1: Static Reference Integrity Is The Cleanest Near-Term Fit
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8053:### Finding 2: Registry And Index Parity Would Help, But Only If Scoped Narrowly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8060:### Finding 3: Git-Based Freshness Signals Would Integrate Cleanly With Existing Health UX
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8067:### Finding 4: Command And Dependency Parity Checks Need A Broader Inventory Model Than Mex Has
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8074:### Finding 5: Drift-To-Repair Briefing Is Promising, But It Should Become A Spec Kit Repair Surface, Not A Mex-Style CLI Loop
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8128:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8129:### Finding 1: Static Reference Integrity Is The Cleanest Near-Term Fit
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8136:### Finding 2: Registry And Index Parity Would Help, But Only If Scoped Narrowly
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8143:### Finding 3: Git-Based Freshness Signals Would Integrate Cleanly With Existing Health UX
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8150:### Finding 4: Command And Dependency Parity Checks Need A Broader Inventory Model Than Mex Has
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md:8157:### Finding 5: Drift-To-Repair Briefing Is Promising, But It Should Become A Spec Kit Repair Surface, Not A Mex-Style CLI Loop
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:1:### Finding 5: Spec Kit Memory already has the session primitives Mex is missing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:8:### Finding 6: Spec Kit Memory also closes sessions explicitly through save-time summaries, continuation metadata, and learning records
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:242:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:244:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13776:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13777:### Finding 1: Mex does not implement an actual FTS, vector, or hybrid retrieval engine
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13784:### Finding 2: Mex query processing is claim extraction from markdown, not user-query retrieval
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13791:### Finding 3: Mex’s only search shortcuts are static routing and fuzzy filesystem rescue
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13798:### Finding 4: Mex scoring ranks scaffold health, not retrieval relevance
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13805:### Finding 5: Spec Kit Memory already has the real search stack Mex lacks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13861:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13862:### Finding 1: Mex does not implement an actual FTS, vector, or hybrid retrieval engine
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13869:### Finding 2: Mex query processing is claim extraction from markdown, not user-query retrieval
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13876:### Finding 3: Mex’s only search shortcuts are static routing and fuzzy filesystem rescue
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13883:### Finding 4: Mex scoring ranks scaffold health, not retrieval relevance
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md:13890:### Finding 5: Spec Kit Memory already has the real search stack Mex lacks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:1:### Finding 4: Mex scoring ranks scaffold health, not retrieval relevance
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:8:### Finding 5: Spec Kit Memory already has the real search stack Mex lacks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:241:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:243:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:14102:   371	  let assistiveRecommendation: AssistiveRecommendation | null = null;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:17047:   371	  let assistiveRecommendation: AssistiveRecommendation | null = null;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18100:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18101:### Finding 1: Mex has no stable topic key beyond file paths and pattern filenames
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18108:### Finding 2: Mex revision tracking is policy text for the agent, not enforced state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18115:### Finding 3: Mex does not implement soft delete or garbage collection; it only surfaces staleness and manual cleanup points
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18122:### Finding 4: Mex deduplication is structural and file-oriented, not content-oriented
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18129:### Finding 5: Mex’s contradiction hygiene is useful, but bounded to extracted markdown claims
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18136:### Finding 6: Spec Kit Memory already implements the lifecycle primitives Mex is missing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18201:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18202:### Finding 1: Mex has no stable topic key beyond file paths and pattern filenames
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18209:### Finding 2: Mex revision tracking is policy text for the agent, not enforced state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18216:### Finding 3: Mex does not implement soft delete or garbage collection; it only surfaces staleness and manual cleanup points
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18223:### Finding 4: Mex deduplication is structural and file-oriented, not content-oriented
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18230:### Finding 5: Mex’s contradiction hygiene is useful, but bounded to extracted markdown claims
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md:18237:### Finding 6: Spec Kit Memory already implements the lifecycle primitives Mex is missing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:1:### Finding 4: The drift engine is a clean static-analysis pipeline, not an AI validator
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:8:### Finding 5: Mex’s repair layer is issue-scoped and surgical, with filesystem and git evidence bundled into the prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:226:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:228:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14770:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14771:### Finding 1: Mex’s durable store is the scaffold itself, not a separate database
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14778:### Finding 2: Mex’s actual schema is intentionally tiny and mostly transient
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14785:### Finding 3: Mex’s indexing strategy is explicit filesystem discovery plus human-readable registries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14792:### Finding 4: The real ingestion layer is AST-to-claim extraction, not the markdown files alone
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14799:### Finding 5: Mex’s manifest-backed storage is shallow and JavaScript-first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14806:### Finding 6: Spec Kit Memory is structurally in a different class, so Mex should complement it rather than replace it
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14841:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14842:### Finding 1: Mex’s durable store is the scaffold itself, not a separate database
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14849:### Finding 2: Mex’s actual schema is intentionally tiny and mostly transient
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14856:### Finding 3: Mex’s indexing strategy is explicit filesystem discovery plus human-readable registries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14863:### Finding 4: The real ingestion layer is AST-to-claim extraction, not the markdown files alone
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14870:### Finding 5: Mex’s manifest-backed storage is shallow and JavaScript-first
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md:14877:### Finding 6: Spec Kit Memory is structurally in a different class, so Mex should complement it rather than replace it
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:1:### Finding 3: Our trigger hygiene is already stricter than Mex’s scaffold hygiene, but it is mostly hidden in save-time review code
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:8:### Finding 4: Our causal-link hygiene is a true graph lifecycle; Mex frontmatter edges are only dead-link validation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:15:### Finding 5: Mex surfaces staleness much better than we do, even though our graph already has latent stale-edge primitives
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:246:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:248:### Finding N: [Title]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6009:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6010:### Finding 1: We should build a first-class `memory_sync_packet` workflow that turns drift findings into repair-ready briefs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6017:### Finding 2: We should add a durable project router surface with explicit “Working / Not Built / Known Issues” state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6024:### Finding 3: We should create a first-class task-pattern registry instead of only storing episodic memories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6031:### Finding 4: We should build a repo bootstrap brief generator for cold-start onboarding and scaffold seeding
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6038:### Finding 5: We should add reverse coverage audits that detect live repo knowledge missing from memory/spec surfaces
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6103:## Findings
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6104:### Finding 1: We should build a first-class `memory_sync_packet` workflow that turns drift findings into repair-ready briefs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6111:### Finding 2: We should add a durable project router surface with explicit “Working / Not Built / Known Issues” state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6118:### Finding 3: We should create a first-class task-pattern registry instead of only storing episodic memories
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6125:### Finding 4: We should build a repo bootstrap brief generator for cold-start onboarding and scaffold seeding
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md:6132:### Finding 5: We should add reverse coverage audits that detect live repo knowledge missing from memory/spec surfaces

exec
/bin/zsh -lc 'rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-010.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-005.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-011.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-006.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-016.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-012.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-013.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-007.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-008.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-009.md

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-017.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md)
- [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts)
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
- [external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts)
- [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [external/src/markdown.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/src/reporter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts)
- [external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts)
- [external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts)
- [external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts)
- [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/test/checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [external/test/claims.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts)
- [external/test/config.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts)
- [external/test/markdown.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts)
- [external/test/pattern.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts)
- [external/test/scanner.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts)
- [external/test/scoring.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)

## Assessment
- New information ratio: 0.82
- Questions addressed: failure handling when git/scanner/manifest evidence is missing; corruption behavior for malformed frontmatter; sync-loop behavior under tool timeout or interrupted sessions; migration portability across non-Node repos; scaling limits in search/diff/scanner breadth; how these differ from current Spec Kit safeguards.
- Questions answered: Mex’s dominant edge-case pattern is graceful degradation, but often without explicit degraded-state reporting; malformed frontmatter suppresses checks instead of becoming a first-class issue; the sync loop’s strongest safeguard is re-verification, not child-process status handling; multi-language support is broad in setup/scanning but narrow in validation; scaling is intentionally lossy via fixed caps and shallow windows.

## Reflection
- What worked: tracing helper return semantics (`null`, `""`, skipped checks) was more valuable than reading checker names alone; pairing Mex sources with current Spec Kit health/save-quality code made the design tradeoff very clear.
- What did not work: there is no dedicated behavior test coverage for `sync`, `watch`, or interactive `setup`, so those findings come from source tracing rather than executable proof; the repo’s generic scaffold templates (`AGENTS.md`/`CLAUDE.md`) do not add much implementation truth beyond confirming intended workflow shape.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne specifically on three axes Mex is weak on: explicit degraded-state reporting, corruption handling that produces named failures instead of silent skips, and scale-aware evidence retrieval that can widen beyond fixed caps. The most valuable next question is not “who stores memory best,” but “who has the clearest contract when evidence is partial, stale, or structurally broken.”

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

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-018.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### Finding 4: Command And Dependency Parity Checks Need A Broader Inventory Model Than Mex Has
- **Source**: [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [validate.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh)
- **What it does**: Mex validates `npm run`, `yarn`, `pnpm`, `bun run`, and `make` claims against `package.json` or `Makefile`; checks dependency claims only against `package.json` deps/devDeps; and flags undocumented scripts by substring-searching scaffold text. Its non-Node manifest handling is scanner-only stub logic, not real parity validation.
- **Why it matters for us**: This addresses a real Public pain point because command-surface drift keeps recurring across docs and wrappers. But integration difficulty is **high**: Spec Kit spans TypeScript, Python, shell, MCP commands, wrapper commands, and spec docs, so we would need a shared command/dependency inventory layer and better text matching than Mex’s substring heuristics to avoid noisy false positives.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Drift-To-Repair Briefing Is Promising, But It Should Become A Spec Kit Repair Surface, Not A Mex-Style CLI Loop
- **Source**: [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- **What it does**: Mex groups drift issues by file, embeds current file content, nearby filesystem listings, and `HEAD~5..HEAD` diffs into a repair prompt, then reruns drift checks after an interactive Claude session. The briefing logic is good, but failure/degraded-state handling is shallow compared with Spec Kit’s explicit MCP error envelopes, certainty fields, and post-save review gates.
- **Why it matters for us**: The transferable part is the prompt builder, not the interactive loop. Integration difficulty is **medium-high** because Spec Kit should emit packet-local, auditable repair briefs and route them through existing spec workflows, health surfaces, and certainty contracts rather than shelling out to a provider-specific CLI and treating `status === null` as success.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [markdown.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.79
- Questions addressed: which Mex subsystems have the cleanest insertion points into `memory_health` or `validate.sh`; which candidates are blocked by Spec Kit’s multi-surface docs and multi-language command inventory; how Mex’s silent-skip behavior changes migration cost; whether Mex’s sync loop or prompt builder is the reusable layer.
- Questions answered: the best near-term fits are static reference integrity and git-based freshness; index parity is useful but needs a narrow pilot; command/dependency/script parity is valuable but requires a broader inventory abstraction than Mex has; drift-to-repair should be adopted as a Spec Kit repair brief, not as a provider-specific CLI loop; strict validation for the phase folder returned `RESULT: PASSED` in this run.

## Reflection
- What worked: reading the checker implementations and tests together made the integration boundaries obvious; comparing Mex’s failure handling against `session_bootstrap`, `memory_health`, and V13 frontmatter validation exposed where Spec Kit is already stricter.
- What did not work: Mex’s non-Node portability is overstated in the scanner layer because manifest parsing outside `package.json` is mostly stubbed; `sync` and `watch` still rely more on source tracing than behavior tests for confidence.

## Recommended Next Focus
Take the two `adopt now` candidates and design the smallest Spec Kit-native shape for each: `memory_health(reportMode="doc_drift")` for static reference integrity, and a per-file freshness supplement for `memory_health` or `session_bootstrap`. After that, test Modus Memory and Mnemosyne specifically on whether they outperform Mex on explicit degraded-state reporting and scale-aware evidence retrieval.

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

exec
/bin/zsh -lc "sed -n '1,120p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-015.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts), [external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts), [external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts), [external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts), [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts), [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [external/test/checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts), [external/test/claims.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts), [external/test/scanner.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts), [external/test/scoring.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts), [external/test/pattern.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.81
- Questions addressed: whether Mex implies a separate knowledge-audit plane; whether repo-activity freshness should extend our freshness model; whether targeted sync changes our remediation architecture; whether Mex suggests a doc-native routing scaffold beside indexed memory; whether its growth loop should influence a future task-pattern layer.
- Questions answered: yes, the strongest shift is a separate knowledge-truth audit surface; yes, repo-activity freshness should be added as a new axis rather than replacing session/code-graph freshness; yes, targeted repair briefs are a real missing capability for us; yes, Mex suggests a compact doc-native control surface that complements retrieval; yes, pattern growth is valuable, but Mex’s placeholder-first authoring is too weak to copy directly.

## Reflection
- What worked: tracing Mex as four cooperating layers, scaffold contract, scanner brief, static drift audit, and targeted sync, made the architectural deltas much clearer than checker-by-checker parity alone. Comparing those layers directly against `memory_health`, `session_resume`, `memory_context`, and post-save quality gates exposed where we are stronger and where the gap really is.
- What did not work: the snapshot path is still `external/`, not `external/mex-main`, so the prompt’s path wording is stale. The strict validation command passed, but it also emitted a temp-file warning from the sandboxed environment, so its pass signal was usable but slightly noisy.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne for the same control-plane question: do they offer a distinct authority surface for durable project truth, or are they still retrieval/storage systems? The next useful cut is provenance and trust boundaries for reusable task guidance, especially whether either system has a stronger answer than Mex for evidence-backed pattern growth.

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

 succeeded in 0ms:
## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts), [external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts), [external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts), [external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts)
- [external/test/checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts), [external/test/claims.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts), [external/test/scanner.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts), [external/test/scoring.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts), [external/test/pattern.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.74
- Questions addressed: strongest end-to-end pattern; how Mex turns markdown into auditable claims; whether targeted sync is meaningfully different from our current health/save surfaces; whether repo-activity freshness is a distinct signal; whether omission detection adds value beyond structural validation.
- Questions answered: the strongest pattern is a separate doc-truth control plane; targeted sync is the highest-value missing capability for us; claim extraction is the technical hinge that makes the plane possible; dual-signal freshness is worth adding as a new axis; omission checks are useful, but Mex’s exact heuristics should be treated as prototypes, not copied wholesale.

## Reflection
- What worked: tracing the loop in execution order, `ROUTER.md` contract -> `cli.ts` surfaces -> `claims.ts` extraction -> checker family -> `sync/brief-builder.ts` repair packet -> recheck, made the actual innovation much clearer than reading checker summaries in isolation.
- What did not work: the prompt’s `external/mex-main` path is stale in this checkout, the real snapshot is `external/`; the strict validator passed, but it still emitted `cannot create temp file for here document: Operation not permitted`, so the pass signal was clean but noisy.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne against this same control-plane question: do either of them provide a durable truth-audit surface with bounded remediation, or are they still primarily storage and retrieval systems? The sharpest next cut is provenance and trust: which system, if any, has a stronger answer than Mex for evidence-backed reusable guidance without placeholder-first drift.

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

codex
I’ve now reconciled this pass with the phase’s prior iteration artifacts. The ranking is stable: there’s a small set of high-value imports, a couple of medium-cost prototypes, and several Mex behaviors that should stay out of Spec Kit entirely.
exec
/bin/zsh -lc "sed -n '2004,2024p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 4]
- symptom: docs report stale test/playbook counts after fixes; cause: checklist/plan/summary not updated with latest command outputs; fix: update packet docs and evidence logs in the same pass as code/test changes [Task 2][Task 4]

# Task Group: 023 Hybrid-RAG Refinement Forensic Review
scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings

## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings

### rollout_summary_files

- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)

### keywords

- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]

## User preferences

- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]


codex
# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

## Findings
### Finding 1: Typed claim extraction plus packet-local reference integrity is the best immediate import [Rank 1: high x high]
- **Source**: [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L43), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L9), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L6), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L7), [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts#L40)
- **What it does**: Mex turns markdown into typed `path`/`command`/`dependency`/`version` claims, then applies deterministic checks for missing paths, dead frontmatter edges, and `patterns/INDEX.md` parity. The path checker already handles scaffold-root vs project-root resolution and downgrades placeholders/pattern examples instead of hard-failing them.
- **Why it matters for us**: This is the cleanest match to the gap in Public: we already have rich memory/search/health surfaces, but we still lack a cheap docs-to-filesystem integrity layer for spec docs, memory docs, and packet-local registries.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Dual-signal freshness is worth adding only if it fails explicitly, not silently [Rank 2: high x medium]
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L13), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L332)
- **What it does**: Mex flags files by both elapsed days and commits since last change, but its git helpers return `null` on failure and the checker simply emits nothing in that case.
- **Why it matters for us**: The signal is strong; the failure contract is weak. Spec Kit already models `exact`, `estimated`, `unknown`, `defaulted`, `REJECTED`, and degraded matching, so a freshness feature should plug into that certainty system instead of quietly disappearing when git evidence is missing.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Drift-to-repair briefing should become a Spec Kit repair surface, not a Mex-style CLI loop [Rank 3: medium x medium]
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1023), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1470)
- **What it does**: Mex groups issues by file and builds repair briefs with the current file, issue list, nearby filesystem inventory, and `HEAD~5..HEAD` diffs. The surrounding sync loop is provider-bound to `claude` and treats exit `0` or `null` as success before re-checking.
- **Why it matters for us**: The brief builder is reusable; the trust model is not. We should preserve the file-scoped, evidence-rich prompt construction and route it through packet-local, auditable Spec Kit workflows with existing review/health gates.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 4: Command, dependency, and coverage parity are valuable, but Mex is too Node-centric to copy directly [Rank 4: medium x low]
- **Source**: [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex validates `package.json` scripts, Makefile targets, `package.json` dependencies, and scaffold mentions of npm scripts. Its Python/Go/Cargo handling in the scanner is stub-level metadata only, not real parity validation.
- **Why it matters for us**: Public absolutely has command-surface drift, but a direct port would under-model our TypeScript/Python/shell/MCP/spec-doc mix and generate noisy false positives from substring matching.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Auto-growth and pattern seeding are too permissive for Spec Kit’s evidence model [Rank 5: medium x high, negative]
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L83), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21), [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex’s contract says every task should update current state and create new patterns when needed; `pattern add` immediately appends a placeholder `[description]` entry to the index.
- **Why it matters for us**: In Spec Kit, partial or guessed documentation becomes durable policy very quickly. Mex’s growth loop is excellent for momentum, but it is too easy for stub knowledge, shallow scans, or rushed summaries to become “official” and then survive future repair loops.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Mex’s single drift score should not become a primary health signal in Spec Kit [Rank 6: medium x high, negative]
- **Source**: [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L14), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L246), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1031)
- **What it does**: Mex starts at `100` and subtracts `10/3/1` for error/warning/info, regardless of whether the issue is a hard trust break or mild hygiene noise.
- **Why it matters for us**: Spec Kit already distinguishes blocked, degraded, exact, estimated, unknown, and rejected states. A single number would blur meaningful contract differences and could make a partially unsafe surface look “mostly fine.”
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts), [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md)

## Assessment
- New information ratio: 0.77
- Questions addressed: impact-ranked subset selection; which Mex mechanisms survive contact with Spec Kit’s trust model; where false-positive risk becomes too high; what a realistic adoption sequence looks like.
- Questions answered: the only clear `adopt now` item is static reference integrity built on typed claim extraction. Freshness is the next best candidate, but only with explicit degraded/unknown semantics. Repair briefing is worth building as a new Spec Kit feature. Command/dependency/script parity needs a separate inventory abstraction first. Auto-growth and a single drift score should stay out.

## Reflection
- What worked: tracing source in execution order and pairing checker implementations with tests made the real boundaries obvious very quickly.
- What did not work: the CocoIndex semantic pass did not produce usable output in this run, so the final ranking stayed grounded in direct source tracing. The strict phase validation passed, but the script emitted a sandbox warning about creating a temp here-doc file before finishing with `Errors: 0 Warnings: 0 RESULT: PASSED`.

## Recommended Next Focus
1. Sprint 1: ship a narrow `validate.sh` or `memory_health` extension for packet-local `path`/`edge`/`index` integrity only, with severity-first reporting and no composite score.
2. Sprint 2: prototype freshness as a supplemental signal with `exact` vs `unknown/degraded` provenance, using both days and commit-count thresholds and explicit git-failure surfacing.
3. Sprint 3: build a provider-neutral repair-brief generator that consumes failed checks and emits auditable, packet-local fix briefs instead of launching an interactive CLI loop.
4. Defer until after those land: broader command/dependency/coverage audits, and only after a shared inventory model exists across npm, Python, shell, MCP commands, wrappers, and spec docs.
5. Keep rejected: automatic pattern/context growth from task completion, and any single-number health score as the primary truth surface.


hook: Stop
hook: Stop Completed
tokens used
126,613
# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

## Findings
### Finding 1: Typed claim extraction plus packet-local reference integrity is the best immediate import [Rank 1: high x high]
- **Source**: [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L43), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L9), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L6), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L7), [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts#L40)
- **What it does**: Mex turns markdown into typed `path`/`command`/`dependency`/`version` claims, then applies deterministic checks for missing paths, dead frontmatter edges, and `patterns/INDEX.md` parity. The path checker already handles scaffold-root vs project-root resolution and downgrades placeholders/pattern examples instead of hard-failing them.
- **Why it matters for us**: This is the cleanest match to the gap in Public: we already have rich memory/search/health surfaces, but we still lack a cheap docs-to-filesystem integrity layer for spec docs, memory docs, and packet-local registries.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Dual-signal freshness is worth adding only if it fails explicitly, not silently [Rank 2: high x medium]
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L13), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L332)
- **What it does**: Mex flags files by both elapsed days and commits since last change, but its git helpers return `null` on failure and the checker simply emits nothing in that case.
- **Why it matters for us**: The signal is strong; the failure contract is weak. Spec Kit already models `exact`, `estimated`, `unknown`, `defaulted`, `REJECTED`, and degraded matching, so a freshness feature should plug into that certainty system instead of quietly disappearing when git evidence is missing.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Drift-to-repair briefing should become a Spec Kit repair surface, not a Mex-style CLI loop [Rank 3: medium x medium]
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1023), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1470)
- **What it does**: Mex groups issues by file and builds repair briefs with the current file, issue list, nearby filesystem inventory, and `HEAD~5..HEAD` diffs. The surrounding sync loop is provider-bound to `claude` and treats exit `0` or `null` as success before re-checking.
- **Why it matters for us**: The brief builder is reusable; the trust model is not. We should preserve the file-scoped, evidence-rich prompt construction and route it through packet-local, auditable Spec Kit workflows with existing review/health gates.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 4: Command, dependency, and coverage parity are valuable, but Mex is too Node-centric to copy directly [Rank 4: medium x low]
- **Source**: [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex validates `package.json` scripts, Makefile targets, `package.json` dependencies, and scaffold mentions of npm scripts. Its Python/Go/Cargo handling in the scanner is stub-level metadata only, not real parity validation.
- **Why it matters for us**: Public absolutely has command-surface drift, but a direct port would under-model our TypeScript/Python/shell/MCP/spec-doc mix and generate noisy false positives from substring matching.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Auto-growth and pattern seeding are too permissive for Spec Kit’s evidence model [Rank 5: medium x high, negative]
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L83), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21), [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex’s contract says every task should update current state and create new patterns when needed; `pattern add` immediately appends a placeholder `[description]` entry to the index.
- **Why it matters for us**: In Spec Kit, partial or guessed documentation becomes durable policy very quickly. Mex’s growth loop is excellent for momentum, but it is too easy for stub knowledge, shallow scans, or rushed summaries to become “official” and then survive future repair loops.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Mex’s single drift score should not become a primary health signal in Spec Kit [Rank 6: medium x high, negative]
- **Source**: [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L14), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L246), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1031)
- **What it does**: Mex starts at `100` and subtracts `10/3/1` for error/warning/info, regardless of whether the issue is a hard trust break or mild hygiene noise.
- **Why it matters for us**: Spec Kit already distinguishes blocked, degraded, exact, estimated, unknown, and rejected states. A single number would blur meaningful contract differences and could make a partially unsafe surface look “mostly fine.”
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts), [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md)

## Assessment
- New information ratio: 0.77
- Questions addressed: impact-ranked subset selection; which Mex mechanisms survive contact with Spec Kit’s trust model; where false-positive risk becomes too high; what a realistic adoption sequence looks like.
- Questions answered: the only clear `adopt now` item is static reference integrity built on typed claim extraction. Freshness is the next best candidate, but only with explicit degraded/unknown semantics. Repair briefing is worth building as a new Spec Kit feature. Command/dependency/script parity needs a separate inventory abstraction first. Auto-growth and a single drift score should stay out.

## Reflection
- What worked: tracing source in execution order and pairing checker implementations with tests made the real boundaries obvious very quickly.
- What did not work: the CocoIndex semantic pass did not produce usable output in this run, so the final ranking stayed grounded in direct source tracing. The strict phase validation passed, but the script emitted a sandbox warning about creating a temp here-doc file before finishing with `Errors: 0 Warnings: 0 RESULT: PASSED`.

## Recommended Next Focus
1. Sprint 1: ship a narrow `validate.sh` or `memory_health` extension for packet-local `path`/`edge`/`index` integrity only, with severity-first reporting and no composite score.
2. Sprint 2: prototype freshness as a supplemental signal with `exact` vs `unknown/degraded` provenance, using both days and commit-count thresholds and explicit git-failure surfacing.
3. Sprint 3: build a provider-neutral repair-brief generator that consumes failed checks and emits auditable, packet-local fix briefs instead of launching an interactive CLI loop.
4. Defer until after those land: broader command/dependency/coverage audits, and only after a shared inventory model exists across npm, Python, shell, MCP commands, wrappers, and spec docs.
5. Keep rejected: automatic pattern/context growth from task completion, and any single-number health score as the primary truth surface.
