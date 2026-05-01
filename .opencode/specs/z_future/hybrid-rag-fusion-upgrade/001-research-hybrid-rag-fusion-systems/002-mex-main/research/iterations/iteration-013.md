## Assessment
- New information ratio: 0.78
- Questions addressed: whether Mex implies a refactor of our health architecture, whether its freshness model should replace or extend ours, whether its repair loop changes how our diagnostics should emit outputs, whether its claim-extraction approach is safe for us to copy, whether its lightweight pattern creation should influence a future task-pattern layer, whether a numeric score is worth adopting.
- Questions answered: the strongest refactor is to separate storage integrity from knowledge drift; repo-activity freshness should become a new axis rather than replacing current session/code-graph freshness; repair context should become structured and target-specific; Mex’s heuristic prose-mining should not become our primary authority model; any future pattern layer should be stricter than Mex’s placeholder-first approach; a score is useful only after the audit model is cleaned up.

## Reflection
- What worked: reading Mex as a three-layer system, scanner plus drift engine plus sync loop, then comparing that to our own split across bootstrap, health, save review, and quality validation made the architectural gaps much clearer than checker-by-checker parity alone.
- What did not work: CocoIndex was not available for this pass, so I had to do the source tracing manually; the prompt’s `external/mex-main` path also did not match the checked-in snapshot, which actually lives directly under `external/`.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne specifically on authority boundaries: which parts are structured versus heuristic, whether they separate storage health from knowledge truth, and whether either system has a stronger provenance model for reusable task guidance than Mex’s placeholder-first pattern scaffolding.

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
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

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
I’m treating this as a read-only research pass over the Mex snapshot and a comparison against our current memory stack. I’ll trace the implementation layers the brief calls out, extract the paradigm shifts that matter architecturally, and then synthesize only the delta beyond the prior findings you already supplied.
exec
/bin/zsh -lc 'rg -n "mex|hybrid-rag-fusion|drift detection|markdown scaffold" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external | sed 's#"'^#/##'"' | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
sed: 1: "s#^#/##
": bad flag in substitute command: '#'

codex
I’ve done the quick memory pass and there isn’t a reusable Mex-specific prior run hiding in memory; the useful context is mostly that earlier work in this repo values findings-first, file-backed evidence, and tight scope. Next I’m reading the Mex snapshot itself and tracing the drift, scanner, sync, and pattern layers in source rather than leaning on the README summary.
exec
/bin/zsh -lc 'rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1472ms:

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
The Mex snapshot is present directly under `external/`, which matches the previous note that the prompt’s `external/mex-main` wording is stale. I’m validating the phase folder in parallel and reading the contract plus source layers in the sequence the brief asked for so the final output can stay grounded in actual code paths.
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'for f in AGENTS.md ROUTER.md SETUP.md SYNC.md; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== AGENTS.md =====
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
===== ROUTER.md =====
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
===== SETUP.md =====
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
===== SYNC.md =====
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
The contract files are confirming the shape that mattered in the earlier pass: Mex treats memory as a navigable markdown web with an explicit post-task GROW loop, not just a retrieval store. I’m in the core engine now to pin down where that becomes a real architectural shift versus just a documentation style.
exec
/bin/zsh -lc 'for f in src/sync/index.ts src/sync/brief-builder.ts src/pattern/index.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,280p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'for f in src/drift/index.ts src/drift/claims.ts src/drift/frontmatter.ts src/drift/scoring.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== src/sync/index.ts =====
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
===== src/sync/brief-builder.ts =====
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
===== src/pattern/index.ts =====
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

 succeeded in 0ms:
===== src/drift/index.ts =====
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
===== src/drift/claims.ts =====
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
===== src/drift/frontmatter.ts =====
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
===== src/drift/scoring.ts =====
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

exec
/bin/zsh -lc 'for f in src/scanner/index.ts src/scanner/manifest.ts src/scanner/entry-points.ts src/scanner/tooling.ts src/scanner/folder-tree.ts src/scanner/readme.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== src/scanner/index.ts =====
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
===== src/scanner/manifest.ts =====
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
===== src/scanner/entry-points.ts =====
     1	import { globSync } from "glob";
     2	import type { EntryPoint } from "../types.js";
     3	
     4	const MAIN_PATTERNS = [
     5	  "src/index.{ts,js,tsx,jsx}",
     6	  "src/main.{ts,js,tsx,jsx}",
     7	  "src/app.{ts,js,tsx,jsx}",
     8	  "app.{py,rb}",
     9	  "main.{go,py,rs}",
    10	  "index.{ts,js}",
    11	  "server.{ts,js,py}",
    12	  "src/cli.{ts,js}",
    13	  "cmd/*/main.go",
    14	];
    15	
    16	const TEST_PATTERNS = [
    17	  "src/**/*.test.{ts,js,tsx,jsx}",
    18	  "src/**/*.spec.{ts,js,tsx,jsx}",
    19	  "tests/**/*.{ts,js,py}",
    20	  "test/**/*.{ts,js,py}",
    21	  "**/*_test.go",
    22	];
    23	
    24	const CONFIG_PATTERNS = [
    25	  "tsconfig.json",
    26	  "vite.config.{ts,js}",
    27	  "next.config.{ts,js,mjs}",
    28	  "webpack.config.{ts,js}",
    29	  "jest.config.{ts,js}",
    30	  "vitest.config.{ts,js}",
    31	  ".eslintrc.{js,json,yml}",
    32	  "eslint.config.{js,mjs}",
    33	];
    34	
    35	/** Find main entry points, test files, and config files */
    36	export function scanEntryPoints(projectRoot: string): EntryPoint[] {
    37	  const entries: EntryPoint[] = [];
    38	  const seen = new Set<string>();
    39	
    40	  const add = (patterns: string[], type: EntryPoint["type"], limit?: number) => {
    41	    let count = 0;
    42	    for (const pattern of patterns) {
    43	      const matches = globSync(pattern, {
    44	        cwd: projectRoot,
    45	        ignore: ["node_modules/**", "dist/**", "build/**", ".git/**"],
    46	      });
    47	      for (const path of matches) {
    48	        if (seen.has(path)) continue;
    49	        seen.add(path);
    50	        entries.push({ path, type });
    51	        count++;
    52	        if (limit && count >= limit) return;
    53	      }
    54	    }
    55	  };
    56	
    57	  add(MAIN_PATTERNS, "main");
    58	  add(TEST_PATTERNS, "test", 10); // Cap test files
    59	  add(CONFIG_PATTERNS, "config");
    60	
    61	  return entries;
    62	}
===== src/scanner/tooling.ts =====
     1	import { existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	import type { ToolingInfo } from "../types.js";
     4	
     5	/** Detect project tooling from config files */
     6	export function scanTooling(projectRoot: string): ToolingInfo {
     7	  return {
     8	    testRunner: detectTestRunner(projectRoot),
     9	    buildTool: detectBuildTool(projectRoot),
    10	    linter: detectLinter(projectRoot),
    11	    formatter: detectFormatter(projectRoot),
    12	    packageManager: detectPackageManager(projectRoot),
    13	  };
    14	}
    15	
    16	function exists(root: string, ...files: string[]): boolean {
    17	  return files.some((f) => existsSync(resolve(root, f)));
    18	}
    19	
    20	function detectTestRunner(root: string): string | null {
    21	  if (exists(root, "vitest.config.ts", "vitest.config.js")) return "vitest";
    22	  if (exists(root, "jest.config.ts", "jest.config.js", "jest.config.json"))
    23	    return "jest";
    24	  if (exists(root, "pytest.ini", "pyproject.toml")) return "pytest";
    25	  if (exists(root, ".mocharc.yml", ".mocharc.json")) return "mocha";
    26	  return null;
    27	}
    28	
    29	function detectBuildTool(root: string): string | null {
    30	  if (exists(root, "tsup.config.ts", "tsup.config.js")) return "tsup";
    31	  if (exists(root, "vite.config.ts", "vite.config.js")) return "vite";
    32	  if (exists(root, "next.config.ts", "next.config.js", "next.config.mjs"))
    33	    return "next";
    34	  if (exists(root, "webpack.config.ts", "webpack.config.js")) return "webpack";
    35	  if (exists(root, "rollup.config.ts", "rollup.config.js")) return "rollup";
    36	  if (exists(root, "esbuild.config.ts")) return "esbuild";
    37	  if (exists(root, "Makefile")) return "make";
    38	  return null;
    39	}
    40	
    41	function detectLinter(root: string): string | null {
    42	  if (
    43	    exists(
    44	      root,
    45	      "eslint.config.js",
    46	      "eslint.config.mjs",
    47	      ".eslintrc.js",
    48	      ".eslintrc.json",
    49	      ".eslintrc.yml"
    50	    )
    51	  )
    52	    return "eslint";
    53	  if (exists(root, ".pylintrc", "pylintrc")) return "pylint";
    54	  if (exists(root, ".flake8")) return "flake8";
    55	  if (exists(root, ".golangci.yml")) return "golangci-lint";
    56	  return null;
    57	}
    58	
    59	function detectFormatter(root: string): string | null {
    60	  if (exists(root, ".prettierrc", ".prettierrc.json", ".prettierrc.js", "prettier.config.js"))
    61	    return "prettier";
    62	  if (exists(root, "biome.json")) return "biome";
    63	  if (exists(root, ".editorconfig")) return "editorconfig";
    64	  return null;
    65	}
    66	
    67	function detectPackageManager(
    68	  root: string
    69	): ToolingInfo["packageManager"] {
    70	  if (exists(root, "bun.lockb", "bun.lock")) return "bun";
    71	  if (exists(root, "pnpm-lock.yaml")) return "pnpm";
    72	  if (exists(root, "yarn.lock")) return "yarn";
    73	  if (exists(root, "package-lock.json")) return "npm";
    74	  if (exists(root, "package.json")) return "npm"; // default
    75	  return null;
    76	}
===== src/scanner/folder-tree.ts =====
     1	import { readdirSync, statSync } from "node:fs";
     2	import { resolve, basename } from "node:path";
     3	import type { FolderCategory } from "../types.js";
     4	
     5	const CATEGORY_PATTERNS: Record<FolderCategory["category"], RegExp> = {
     6	  routes: /^(routes?|pages?|api|endpoints?)/i,
     7	  models: /^(models?|entities|schemas?|types?)/i,
     8	  services: /^(services?|providers?|handlers?|controllers?|actions?)/i,
     9	  tests: /^(tests?|__tests__|spec|__spec__)/i,
    10	  config: /^(config|configs?|settings?)/i,
    11	  utils: /^(utils?|helpers?|lib|shared|common)/i,
    12	  views: /^(views?|components?|templates?|layouts?|ui)/i,
    13	  other: /./,
    14	};
    15	
    16	const IGNORE_DIRS = new Set([
    17	  "node_modules",
    18	  ".git",
    19	  "dist",
    20	  "build",
    21	  ".next",
    22	  ".nuxt",
    23	  "__pycache__",
    24	  ".venv",
    25	  "venv",
    26	  "target",
    27	  "vendor",
    28	  ".mex",
    29	]);
    30	
    31	/** Scan top-level directories and categorize them */
    32	export function scanFolderTree(projectRoot: string): FolderCategory[] {
    33	  const categories: FolderCategory[] = [];
    34	
    35	  let entries: string[];
    36	  try {
    37	    entries = readdirSync(projectRoot);
    38	  } catch {
    39	    return categories;
    40	  }
    41	
    42	  for (const entry of entries) {
    43	    if (entry.startsWith(".") && entry !== ".github") continue;
    44	    if (IGNORE_DIRS.has(entry)) continue;
    45	
    46	    const fullPath = resolve(projectRoot, entry);
    47	    let stat;
    48	    try {
    49	      stat = statSync(fullPath);
    50	    } catch {
    51	      continue;
    52	    }
    53	
    54	    if (!stat.isDirectory()) continue;
    55	
    56	    const fileCount = countFiles(fullPath);
    57	    const category = categorize(entry);
    58	
    59	    categories.push({
    60	      name: entry,
    61	      path: entry,
    62	      fileCount,
    63	      category,
    64	    });
    65	  }
    66	
    67	  return categories.sort((a, b) => b.fileCount - a.fileCount);
    68	}
    69	
    70	function categorize(dirName: string): FolderCategory["category"] {
    71	  for (const [category, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    72	    if (category === "other") continue;
    73	    if (pattern.test(dirName)) return category as FolderCategory["category"];
    74	  }
    75	  return "other";
    76	}
    77	
    78	function countFiles(dir: string, depth = 0): number {
    79	  if (depth > 3) return 0; // Don't recurse too deep
    80	  let count = 0;
    81	  try {
    82	    for (const entry of readdirSync(dir)) {
    83	      if (entry.startsWith(".")) continue;
    84	      if (IGNORE_DIRS.has(entry)) continue;
    85	      const fullPath = resolve(dir, entry);
    86	      try {
    87	        const stat = statSync(fullPath);
    88	        if (stat.isFile()) count++;
    89	        else if (stat.isDirectory()) count += countFiles(fullPath, depth + 1);
    90	      } catch {
    91	        continue;
    92	      }
    93	    }
    94	  } catch {
    95	    // skip
    96	  }
    97	  return count;
    98	}
===== src/scanner/readme.ts =====
     1	import { readFileSync, existsSync } from "node:fs";
     2	import { resolve } from "node:path";
     3	
     4	/** Read README content if it exists */
     5	export function scanReadme(projectRoot: string): string | null {
     6	  const candidates = ["README.md", "readme.md", "Readme.md", "README"];
     7	
     8	  for (const name of candidates) {
     9	    const path = resolve(projectRoot, name);
    10	    if (existsSync(path)) {
    11	      try {
    12	        const content = readFileSync(path, "utf-8");
    13	        // Truncate to first 3000 chars to keep brief compact
    14	        return content.length > 3000
    15	          ? content.slice(0, 3000) + "\n... (truncated)"
    16	          : content;
    17	      } catch {
    18	        return null;
    19	      }
    20	    }
    21	  }
    22	
    23	  return null;
    24	}

codex
The source makes the architecture clearer: `init` is a pre-analysis brief builder, `check` is a static audit pass, `sync` is a repair orchestrator, and `pattern add` is explicit scaffold growth. I’m drilling into the checkers and a couple of support files now, because the paradigm shift question really hinges on what Mex treats as “truth” and how it turns audit results into targeted repair context.
exec
/bin/zsh -lc 'for f in src/types.ts src/reporter.ts src/git.ts src/markdown.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== src/types.ts =====
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
===== src/reporter.ts =====
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
===== src/git.ts =====
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
===== src/markdown.ts =====
     1	import { unified } from "unified";
     2	import remarkParse from "remark-parse";
     3	import remarkFrontmatter from "remark-frontmatter";
     4	import { visit } from "unist-util-visit";
     5	import YAML from "yaml";
     6	import type { ScaffoldFrontmatter } from "./types.js";
     7	import type { Root, Content } from "mdast";
     8	
     9	const parser = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]);
    10	
    11	/** Parse markdown string into AST */
    12	export function parseMarkdown(content: string): Root {
    13	  return parser.parse(content);
    14	}
    15	
    16	/** Extract YAML frontmatter from markdown content */
    17	export function extractFrontmatter(
    18	  content: string
    19	): ScaffoldFrontmatter | null {
    20	  const tree = parseMarkdown(content);
    21	  let frontmatter: ScaffoldFrontmatter | null = null;
    22	
    23	  visit(tree, "yaml", (node: { value: string }) => {
    24	    try {
    25	      frontmatter = YAML.parse(node.value) as ScaffoldFrontmatter;
    26	    } catch {
    27	      // Invalid YAML — skip
    28	    }
    29	  });
    30	
    31	  return frontmatter;
    32	}
    33	
    34	/** Get the current heading context for a given line position */
    35	export function getHeadingAtLine(
    36	  tree: Root,
    37	  line: number
    38	): string | null {
    39	  let currentHeading: string | null = null;
    40	
    41	  for (const node of tree.children) {
    42	    if (!node.position) continue;
    43	    if (node.position.start.line > line) break;
    44	    if (node.type === "heading") {
    45	      currentHeading = getTextContent(node);
    46	    }
    47	  }
    48	
    49	  return currentHeading;
    50	}
    51	
    52	/** Extract plain text from an AST node */
    53	export function getTextContent(node: Content | Root): string {
    54	  if ("value" in node && typeof node.value === "string") {
    55	    return node.value;
    56	  }
    57	  if ("children" in node) {
    58	    return (node.children as Content[]).map(getTextContent).join("");
    59	  }
    60	  return "";
    61	}
    62	
    63	/** Check if a heading or its ancestors suggest negation */
    64	export function isNegatedSection(heading: string | null): boolean {
    65	  if (!heading) return false;
    66	  const lower = heading.toLowerCase();
    67	  return (
    68	    lower.includes("not exist") ||
    69	    lower.includes("not use") ||
    70	    lower.includes("deliberately not") ||
    71	    lower.includes("excluded") ||
    72	    lower.includes("removed") ||
    73	    lower.includes("deprecated")
    74	  );
    75	}

exec
/bin/zsh -lc 'for f in src/drift/checkers/path.ts src/drift/checkers/edges.ts src/drift/checkers/index-sync.ts src/drift/checkers/staleness.ts src/drift/checkers/command.ts src/drift/checkers/dependency.ts src/drift/checkers/cross-file.ts src/drift/checkers/script-coverage.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts; do echo "===== $f ====="; nl -ba $f | sed -n '"'1,280p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== src/drift/checkers/path.ts =====
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
===== src/drift/checkers/edges.ts =====
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
===== src/drift/checkers/index-sync.ts =====
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
===== src/drift/checkers/staleness.ts =====
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
===== src/drift/checkers/command.ts =====
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
===== src/drift/checkers/dependency.ts =====
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
===== src/drift/checkers/cross-file.ts =====
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
===== src/drift/checkers/script-coverage.ts =====
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

 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts =====
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
===== .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts =====
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
===== .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts =====
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
===== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts =====
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Context
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	import { randomUUID } from 'crypto';
     6	
     7	// Layer definitions
     8	import * as layerDefs from '../lib/architecture/layer-definitions.js';
     9	import { checkDatabaseUpdated } from '../core/index.js';
    10	import { toErrorMessage } from '../utils/index.js';
    11	
    12	// Intent classifier
    13	import * as intentClassifier from '../lib/search/intent-classifier.js';
    14	
    15	// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
    16	import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
    17	import { buildContext } from '../lib/code-graph/code-graph-context.js';
    18	
    19	// Core handlers for routing
    20	import { handleMemorySearch } from './memory-search.js';
    21	import { handleMemoryMatchTriggers } from './memory-triggers.js';
    22	
    23	// Response envelope
    24	import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';
    25	
    26	// Token estimation
    27	import { estimateTokens } from '../formatters/token-metrics.js';
    28	import {
    29	  getPressureLevel,
    30	  type RuntimeContextStats,
    31	} from '../lib/cognitive/pressure-monitor.js';
    32	import * as workingMemory from '../lib/cognitive/working-memory.js';
    33	import * as sessionManager from '../lib/session/session-manager.js';
    34	
    35	// Telemetry
    36	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    37	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    38	import {
    39	  attachSessionTransitionTrace,
    40	  buildSessionTransitionTrace,
    41	  type SessionTransitionTrace,
    42	} from '../lib/search/session-transition.js';
    43	
    44	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    45	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    46	import * as vectorIndex from '../lib/search/vector-index.js';
    47	
    48	// Shared handler types
    49	import type { MCPResponse, IntentClassification } from './types.js';
    50	
    51	// PI-B3: Folder discovery integration
    52	import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
    53	import {
    54	  isAutoResumeEnabled,
    55	  isFolderDiscoveryEnabled,
    56	  isPressurePolicyEnabled,
    57	  isIntentAutoProfileEnabled,
    58	} from '../lib/search/search-flags.js';
    59	
    60	// Feature catalog: Unified context retrieval (memory_context)
    61	// Feature catalog: Dual-scope memory auto-surface
    62	// Feature catalog: Provenance-rich response envelopes
    63	
    64	
    65	/* ───────────────────────────────────────────────────────────────
    66	   1. TYPES
    67	──────────────────────────────────────────────────────────────── */
    68	
    69	interface ContextMode {
    70	  readonly name: string;
    71	  readonly description: string;
    72	  readonly strategy: string;
    73	  readonly tokenBudget?: number;
    74	}
    75	
    76	interface ContextOptions {
    77	  specFolder?: string;
    78	  folderBoost?: { folder: string; factor: number };
    79	  tenantId?: string;
    80	  userId?: string;
    81	  agentId?: string;
    82	  sharedSpaceId?: string;
    83	  limit?: number;
    84	  sessionId?: string;
    85	  enableDedup?: boolean;
    86	  includeContent?: boolean;
    87	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
    88	  anchors?: string[];
    89	  profile?: string;
    90	  sessionTransition?: SessionTransitionTrace;
    91	}
    92	
    93	interface SessionLifecycleMetadata {
    94	  sessionScope: 'caller' | 'ephemeral';
    95	  requestedSessionId: string | null;
    96	  effectiveSessionId: string;
    97	  resumed: boolean;
    98	  eventCounterStart: number;
    99	  resumedContextCount: number;
   100	}
   101	
   102	interface ContextResult extends Record<string, unknown> {
   103	  strategy: string;
   104	  mode: string;
   105	}
   106	
   107	interface LayerInfo {
   108	  tokenBudget?: number;
   109	}
   110	
   111	interface ContextArgs {
   112	  input: string;
   113	  mode?: string;
   114	  intent?: string;
   115	  specFolder?: string;
   116	  tenantId?: string;
   117	  userId?: string;
   118	  agentId?: string;
   119	  sharedSpaceId?: string;
   120	  limit?: number;
   121	  sessionId?: string;
   122	  enableDedup?: boolean;
   123	  includeContent?: boolean;
   124	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
   125	  tokenUsage?: number;
   126	  anchors?: string[];
   127	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   128	  profile?: string;
   129	}
   130	
   131	/** T205: Token budget enforcement metadata */
   132	interface TokenBudgetEnforcement {
   133	  budgetTokens: number;
   134	  actualTokens: number;
   135	  enforced: boolean;
   136	  truncated: boolean;
   137	  originalResultCount?: number;
   138	  returnedResultCount?: number;
   139	}
   140	
   141	type PressureOverrideTargetMode = 'quick' | 'focused' | null;
   142	
   143	interface SessionLifecycleResolution {
   144	  requestedSessionId: string | null;
   145	  effectiveSessionId: string;
   146	  resumed: boolean;
   147	  priorMode: string | null;
   148	  counter: number;
   149	  error?: string;
   150	}
   151	
   152	interface EffectiveModeIntentClassification {
   153	  detectedIntent?: string;
   154	  intentConfidence: number;
   155	  resumeHeuristicApplied: boolean;
   156	  source: 'explicit' | 'auto-detected';
   157	}
   158	
   159	interface EffectiveModeResolution {
   160	  effectiveMode: string;
   161	  pressureOverrideApplied: boolean;
   162	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   163	  pressureWarning: string | null;
   164	  intentClassification: EffectiveModeIntentClassification;
   165	}
   166	
   167	interface BuildResponseMetaParams {
   168	  effectiveMode: string;
   169	  requestedMode: string;
   170	  tracedResult: ContextResult;
   171	  pressurePolicy: {
   172	    level: string;
   173	    ratio: number | null;
   174	    source: string;
   175	    warning: string | null;
   176	  };
   177	  pressureOverrideApplied: boolean;
   178	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   179	  pressureWarning: string | null;
   180	  sessionLifecycle: SessionLifecycleMetadata;
   181	  effectiveBudget: number;
   182	  enforcement: TokenBudgetEnforcement;
   183	  intentClassification: EffectiveModeIntentClassification;
   184	  discoveredFolder?: string;
   185	  includeTrace: boolean;
   186	  sessionTransition: SessionTransitionTrace;
   187	  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
   188	}
   189	
   190	interface StrategyErrorPayload {
   191	  error: string;
   192	  code: string;
   193	  details: Record<string, unknown>;
   194	  hints: string[];
   195	  severity: string | null;
   196	}
   197	
   198	interface StructuralRoutingNudgeMeta {
   199	  advisory: true;
   200	  readiness: 'ready';
   201	  preferredTool: 'code_graph_query';
   202	  message: string;
   203	  preservesAuthority: 'session_bootstrap';
   204	}
   205	
   206	const STRUCTURAL_ROUTING_PATTERNS = [
   207	  /\b(?:who|what)\s+calls?\b/i,
   208	  /\bcallers?\s+of\b/i,
   209	  /\b(?:who|what)\s+imports?\b/i,
   210	  /\bimports?\s+of\b/i,
   211	  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
   212	  /\boutline\s+of\b/i,
   213	  /\bdependenc(?:y|ies)\b/i,
   214	  /\bdependents?\b/i,
   215	  /\bwhat\s+extends\b/i,
   216	];
   217	
   218	function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
   219	  try {
   220	    const parsed = JSON.parse(responseText) as Record<string, unknown>;
   221	    const outerData = parsed?.data as Record<string, unknown> | undefined;
   222	
   223	    const directRows = Array.isArray(outerData?.results)
   224	      ? outerData.results as Array<Record<string, unknown>>
   225	      : null;
   226	    if (directRows) {
   227	      return directRows;
   228	    }
   229	
   230	    const nestedContent = Array.isArray(outerData?.content)
   231	      ? outerData.content as Array<{ type?: string; text?: string }>
   232	      : [];
   233	    const nestedText = nestedContent[0]?.text;
   234	    if (typeof nestedText !== 'string' || nestedText.length === 0) {
   235	      return [];
   236	    }
   237	
   238	    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
   239	    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
   240	    return Array.isArray(nestedData?.results)
   241	      ? nestedData.results as Array<Record<string, unknown>>
   242	      : [];
   243	  } catch {
   244	    return [];
   245	  }
   246	}
   247	
   248	function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
   249	  if ((result as Record<string, unknown>).isError !== true) {
   250	    return null;
   251	  }
   252	
   253	  const content = Array.isArray((result as Record<string, unknown>).content)
   254	    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
   255	    : [];
   256	  const responseText = content[0]?.text;
   257	  if (typeof responseText !== 'string' || responseText.length === 0) {
   258	    return {
   259	      error: 'Context strategy failed',
   260	      code: 'E_STRATEGY',
   261	      details: {},
   262	      hints: [],
   263	      severity: null,
   264	    };
   265	  }
   266	
   267	  try {
   268	    const parsed = JSON.parse(responseText) as {
   269	      data?: {
   270	        error?: string;
   271	        code?: string;
   272	        details?: Record<string, unknown>;
   273	      };
   274	      hints?: string[];
   275	      meta?: {
   276	        severity?: string;
   277	      };
   278	    };
   279	
   280	    return {
===== .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Snapshot
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 024: Lightweight read-only snapshot of session state.
     5	// Aggregates metrics, graph freshness, and priming status into a
     6	// single object for buildServerInstructions() and agent bootstrap.
     7	
     8	import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
     9	import { isSessionPrimed, getLastActiveSessionId } from '../../hooks/memory-surface.js';
    10	import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';
    11	import { getGraphFreshness } from '../code-graph/ensure-ready.js';
    12	import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
    13	import {
    14	  trustStateFromStructuralStatus,
    15	  type SharedPayloadProvenance,
    16	} from '../context/shared-payload.js';
    17	
    18	/* ───────────────────────────────────────────────────────────────
    19	   1. TYPES
    20	──────────────────────────────────────────────────────────────── */
    21	
    22	export interface SessionSnapshot {
    23	  specFolder: string | null;
    24	  currentTask: string | null;
    25	  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
    26	  cocoIndexAvailable: boolean;
    27	  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
    28	  lastToolCallAgoMs: number | null;
    29	  primed: boolean;
    30	  routingRecommendation: string;
    31	}
    32	
    33	/**
    34	 * Phase 027: Structural Bootstrap Contract — shared by all non-hook surfaces.
    35	 * Single source of truth for structural context in startup/recovery flows.
    36	 * Token budget: 250-400 tokens (hard ceiling 500 including guidance).
    37	 */
    38	export interface StructuralBootstrapContract {
    39	  status: 'ready' | 'stale' | 'missing';
    40	  summary: string;
    41	  highlights?: string[];
    42	  recommendedAction: string;
    43	  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
    44	  provenance?: SharedPayloadProvenance;
    45	}
    46	
    47	/* ───────────────────────────────────────────────────────────────
    48	   2. CONSTANTS
    49	──────────────────────────────────────────────────────────────── */
    50	
    51	const STRUCTURAL_CONTRACT_MAX_TOKENS = 500;
    52	
    53	/* ───────────────────────────────────────────────────────────────
    54	   3. HELPERS
    55	──────────────────────────────────────────────────────────────── */
    56	
    57	function resolveGraphFreshness(): SessionSnapshot['graphFreshness'] {
    58	  try {
    59	    return getGraphFreshness(process.cwd());
    60	  } catch {
    61	    return 'error';
    62	  }
    63	}
    64	
    65	function estimateTextTokens(text: string): number {
    66	  return Math.ceil(text.length / 4);
    67	}
    68	
    69	function truncateTextToTokenBudget(text: string, maxTokens: number): string {
    70	  if (maxTokens <= 0) {
    71	    return '';
    72	  }
    73	
    74	  if (estimateTextTokens(text) <= maxTokens) {
    75	    return text;
    76	  }
    77	
    78	  const maxChars = Math.max(0, (maxTokens * 4) - 3);
    79	  return `${text.slice(0, maxChars).trimEnd()}...`;
    80	}
    81	
    82	function estimateStructuralContractTokens(
    83	  summary: string,
    84	  highlights: string[] | undefined,
    85	  recommendedAction: string,
    86	): number {
    87	  return estimateTextTokens([
    88	    summary,
    89	    ...(highlights ?? []),
    90	    recommendedAction,
    91	  ].join('\n'));
    92	}
    93	
    94	function fitStructuralContractBudget(
    95	  summary: string,
    96	  highlights: string[] | undefined,
    97	  recommendedAction: string,
    98	): {
    99	  summary: string;
   100	  highlights: string[] | undefined;
   101	  recommendedAction: string;
   102	} {
   103	  let fittedSummary = summary;
   104	  let fittedHighlights = highlights ? [...highlights] : undefined;
   105	  let fittedRecommendedAction = recommendedAction;
   106	
   107	  while (fittedHighlights && fittedHighlights.length > 0
   108	    && estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   109	    fittedHighlights = fittedHighlights.slice(0, -1);
   110	  }
   111	
   112	  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   113	    const reservedTokens = estimateStructuralContractTokens('', fittedHighlights, fittedRecommendedAction);
   114	    const summaryBudget = Math.max(40, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
   115	    fittedSummary = truncateTextToTokenBudget(fittedSummary, summaryBudget);
   116	  }
   117	
   118	  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   119	    const reservedTokens = estimateStructuralContractTokens(fittedSummary, fittedHighlights, '');
   120	    const actionBudget = Math.max(20, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
   121	    fittedRecommendedAction = truncateTextToTokenBudget(fittedRecommendedAction, actionBudget);
   122	  }
   123	
   124	  return {
   125	    summary: fittedSummary,
   126	    highlights: fittedHighlights,
   127	    recommendedAction: fittedRecommendedAction,
   128	  };
   129	}
   130	
   131	/* ───────────────────────────────────────────────────────────────
   132	   4. PUBLIC API
   133	──────────────────────────────────────────────────────────────── */
   134	
   135	/** Build a read-only snapshot of the current session state. */
   136	export function getSessionSnapshot(): SessionSnapshot {
   137	  const now = Date.now();
   138	
   139	  // Metrics (safe — in-memory only)
   140	  let specFolder: string | null = null;
   141	  let currentTask: string | null = null;
   142	  try {
   143	    const metrics = getSessionMetrics() as ReturnType<typeof getSessionMetrics> & {
   144	      currentTask?: unknown;
   145	    };
   146	    specFolder = metrics.currentSpecFolder;
   147	    if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
   148	      currentTask = metrics.currentTask;
   149	    }
   150	  } catch { /* metrics unavailable */ }
   151	
   152	  // Graph freshness
   153	  const graphFreshness = resolveGraphFreshness();
   154	
   155	  // CocoIndex availability
   156	  let cocoIndexAvailable = false;
   157	  try {
   158	    cocoIndexAvailable = isCocoIndexAvailable();
   159	  } catch { /* unavailable */ }
   160	
   161	  // Quality score
   162	  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
   163	  try {
   164	    const qs = computeQualityScore();
   165	    sessionQuality = qs.level;
   166	  } catch { /* unknown */ }
   167	
   168	  // Last tool call
   169	  let lastToolCallAgoMs: number | null = null;
   170	  try {
   171	    const last = getLastToolCallAt();
   172	    if (last !== null) lastToolCallAgoMs = now - last;
   173	  } catch { /* null */ }
   174	
   175	  // Priming status
   176	  let primed = false;
   177	  try {
   178	    const primingSessionId = getLastActiveSessionId();
   179	    primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
   180	  } catch { /* not primed */ }
   181	
   182	  // Build routing recommendation
   183	  const routingParts: string[] = [];
   184	  if (cocoIndexAvailable) {
   185	    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
   186	  }
   187	  if (graphFreshness === 'fresh') {
   188	    routingParts.push('structural queries (callers, deps) → code_graph_query');
   189	  }
   190	  routingParts.push('exact text/regex → Grep');
   191	  const routingRecommendation = routingParts.join(' | ');
   192	
   193	  return {
   194	    specFolder,
   195	    currentTask,
   196	    graphFreshness,
   197	    cocoIndexAvailable,
   198	    sessionQuality,
   199	    lastToolCallAgoMs,
   200	    primed,
   201	    routingRecommendation,
   202	  };
   203	}
   204	
   205	/**
   206	 * Phase 027: Build a structural bootstrap contract for a given surface.
   207	 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
   208	 * Keeps output compact (targets 250-400 tokens, ceiling 500).
   209	 */
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
===== .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts =====
     1	// ---------------------------------------------------------------
     2	// MODULE: Post-Save Quality Review
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. POST-SAVE QUALITY REVIEW
     7	// ───────────────────────────────────────────────────────────────
     8	// After writing a memory file, read it back and compare the rendered
     9	// markdown against the original JSON payload to detect silent drift.
    10	
    11	import * as fs from 'node:fs';
    12	
    13	import {
    14	  emitMemoryMetric,
    15	  METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM,
    16	  METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL,
    17	  METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL,
    18	  METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL,
    19	  METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL,
    20	  METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL,
    21	  METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL,
    22	  METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL,
    23	} from '../lib/memory-telemetry';
    24	import { sanitizeTriggerPhrase, type TriggerPhraseSanitizeReason } from '../lib/trigger-phrase-sanitizer';
    25	import { resolveSaveMode, SaveMode, type SaveModeInput } from '../types/save-mode';
    26	import { structuredLog } from '../utils/logger';
    27	import { detectContinuationPattern } from './find-predecessor-memory';
    28	
    29	/* ───────────────────────────────────────────────────────────────
    30	   1. TYPES
    31	------------------------------------------------------------------*/
    32	
    33	export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
    34	export type ReviewStatus = 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED' | 'REJECTED' | 'REVIEWER_ERROR';
    35	export type ReviewCheckId =
    36	  | 'PSR-1'
    37	  | 'PSR-2'
    38	  | 'PSR-3'
    39	  | 'PSR-4'
    40	  | 'PSR-5'
    41	  | 'PSR-6'
    42	  | 'D1'
    43	  | 'D2'
    44	  | 'D3'
    45	  | 'D4'
    46	  | 'D5'
    47	  | 'D6'
    48	  | 'D7'
    49	  | 'D8'
    50	  | 'DUP1'
    51	  | 'DUP2'
    52	  | 'DUP3'
    53	  | 'DUP4'
    54	  | 'DUP5'
    55	  | 'DUP6'
    56	  | 'DUP7';
    57	
    58	export interface ReviewIssue {
    59	  checkId?: ReviewCheckId;
    60	  severity: IssueSeverity;
    61	  field: string;
    62	  message: string;
    63	  fix: string;
    64	}
    65	
    66	export interface PostSaveReviewResult {
    67	  status: ReviewStatus;
    68	  issues: ReviewIssue[];
    69	  skipReason?: string;
    70	  reviewerError?: string;
    71	  blocking?: boolean;
    72	  blockerReason?: string;
    73	  highCount?: number;
    74	  mediumCount?: number;
    75	  lowCount?: number;
    76	  renderQualityScore?: number | null;
    77	  inputCompletenessScore?: number | null;
    78	}
    79	
    80	export interface PostSaveReviewInput {
    81	  savedFilePath: string;
    82	  content?: string;
    83	  collectedData: ({
    84	    sessionSummary?: string;
    85	    _manualTriggerPhrases?: string[];
    86	    importanceTier?: string;
    87	    importance_tier?: string;
    88	    contextType?: string;
    89	    context_type?: string;
    90	    keyDecisions?: unknown[];
    91	    _manualDecisions?: unknown[];
    92	    _source?: string;
    93	    headRef?: string | null;
    94	    commitRef?: string | null;
    95	    repositoryState?: string | null;
    96	    isDetachedHead?: boolean | null;
    97	    provenanceExpected?: boolean;
    98	    renderQualityScore?: number | null;
    99	    inputCompletenessScore?: number | null;
   100	  } & SaveModeInput) | null;
   101	  inputMode?: string;
   102	}
   103	
   104	type D3Reason = Extract<TriggerPhraseSanitizeReason, 'path_fragment' | 'standalone_stopword' | 'synthetic_bigram'>;
   105	
   106	type AnchorState = {
   107	  comment: string | null;
   108	  closingComment: string | null;
   109	  htmlId: string | null;
   110	  tocTarget: string | null;
   111	};
   112	
   113	type GuardrailTelemetryContext = {
   114	  inputMode: string;
   115	  saveMode: SaveMode;
   116	  provenanceExpected: boolean;
   117	  overviewLength: number;
   118	  d3Counts: Record<D3Reason, number>;
   119	  continuationPattern: string | null;
   120	  anchorViolationCount: number;
   121	};
   122	
   123	/* ───────────────────────────────────────────────────────────────
   124	   2. CONSTANTS
   125	------------------------------------------------------------------*/
   126	
   127	const GENERIC_TITLES = new Set([
   128	  'next steps',
   129	  'session summary',
   130	  'context save',
   131	  'manual context save',
   132	  'development session',
   133	  'session in progress',
   134	  'continue implementation',
   135	  'implementation session',
   136	]);
   137	
   138	const DECISION_PLACEHOLDER_PATTERN = /\b(?:observation|user)\s+decision\s+\d+\b/i;
   139	const HIGH_GUARDRAIL_CHECKS = new Set<ReviewCheckId>(['D1', 'D2', 'D4', 'D7']);
   140	
   141	/* ───────────────────────────────────────────────────────────────
   142	   3. PARSING HELPERS
   143	------------------------------------------------------------------*/
   144	
   145	function normalizeInputMode(inputMode: string | undefined, saveMode: SaveMode): string {
   146	  if (typeof inputMode === 'string' && inputMode.trim().length > 0) {
   147	    return inputMode.trim().toLowerCase();
   148	  }
   149	  return saveMode;
   150	}
   151	
   152	function parseFrontmatter(content: string): Record<string, string> {
   153	  const lines = content.split('\n');
   154	  const result: Record<string, string> = {};
   155	
   156	  if (lines[0]?.trim() !== '---') return result;
   157	
   158	  for (let i = 1; i < lines.length; i++) {
   159	    const line = lines[i];
   160	    if (line.trim() === '---') break;
   161	
   162	    const colonIdx = line.indexOf(':');
   163	    if (colonIdx > 0) {
   164	      const key = line.substring(0, colonIdx).trim();
   165	      const value = line.substring(colonIdx + 1).trim();
   166	      result[key] = value;
   167	    }
   168	  }
   169	
   170	  return result;
   171	}
   172	
   173	function extractMemoryMetadataYaml(content: string): string {
   174	  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml\s*([\s\S]*?)```/);
   175	  return match?.[1] ?? '';
   176	}
   177	
   178	function parseMemoryMetadataBlock(content: string): Record<string, string> {
   179	  const yamlBlock = extractMemoryMetadataYaml(content);
   180	  if (!yamlBlock) {
   181	    return {};
   182	  }
   183	
   184	  const result: Record<string, string> = {};
   185	  for (const rawLine of yamlBlock.split('\n')) {
   186	    const line = rawLine.trim();
   187	    if (line.length === 0 || line.startsWith('#') || line.endsWith(':')) {
   188	      continue;
   189	    }
   190	
   191	    const colonIdx = line.indexOf(':');
   192	    if (colonIdx <= 0) {
   193	      continue;
   194	    }
   195	
   196	    const key = line.substring(0, colonIdx).trim();
   197	    const value = line.substring(colonIdx + 1).trim();
   198	    if (key.length > 0 && value.length > 0) {
   199	      result[key] = value;
   200	    }
   201	  }
   202	
   203	  return result;
   204	}
   205	
   206	function normalizeScalarValue(value: string | undefined): string {
   207	  return (value || '')
   208	    .trim()
   209	    .replace(/\s+#.*$/u, '')
   210	    .trim()
   211	    .replace(/^['"]|['"]$/g, '');
   212	}
   213	
   214	function parseFrontmatterArray(content: string, fieldName: string): string[] {
   215	  const lines = content.split('\n');
   216	  const result: string[] = [];
   217	
   218	  let inFrontmatter = false;
   219	  let foundField = false;
   220	
   221	  for (let i = 0; i < lines.length; i++) {
   222	    const line = lines[i];
   223	
   224	    if (line.trim() === '---') {
   225	      if (!inFrontmatter) {
   226	        inFrontmatter = true;
   227	        continue;
   228	      }
   229	      break;
   230	    }
   231	
   232	    if (!inFrontmatter) continue;
   233	
   234	    if (line.startsWith(`${fieldName}:`)) {
   235	      foundField = true;
   236	      const inlineMatch = line.match(/:\s*\[(.+)\]/);
   237	      if (inlineMatch) {
   238	        return inlineMatch[1]
   239	          .split(',')
   240	          .map((entry) => entry.trim().replace(/^["']|["']$/g, ''))
   241	          .filter(Boolean);
   242	      }
   243	      continue;
   244	    }
   245	
   246	    if (foundField) {
   247	      if (line.match(/^\s+-\s+/)) {
   248	        const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
   249	        if (value) {
   250	          result.push(value);
   251	        }
   252	      } else {
   253	        break;
   254	      }
   255	    }
   256	  }
   257	
   258	  return result;
   259	}
   260	
   261	function extractYamlListEntries(yamlBlock: string, fieldName: string): string[] {
   262	  if (!yamlBlock) {
   263	    return [];
   264	  }
   265	
   266	  const lines = yamlBlock.split('\n');
   267	  const fieldIndex = lines.findIndex((line) => line.trim() === `${fieldName}:`);
   268	  if (fieldIndex === -1) {
   269	    return [];
   270	  }
   271	
   272	  const entries: string[] = [];
   273	  for (let index = fieldIndex + 1; index < lines.length; index += 1) {
   274	    const line = lines[index];
   275	    const trimmed = line.trim();
   276	
   277	    if (trimmed.length === 0) {
   278	      continue;
   279	    }
   280	    if (trimmed === '[]') {
===== .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts =====
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
   261	
   262	    return null;
   263	  } catch (err: unknown) {
   264	    return describeYamlParseError(err);
   265	  }
   266	}
   267	
   268	function extractFrontMatter(content: string): string {
   269	  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
   270	  if (frontMatterMatch) {
   271	    return frontMatterMatch[1];
   272	  }
   273	
   274	  const fencedYamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/i);
   275	  return fencedYamlMatch ? fencedYamlMatch[1] : '';
   276	}
   277	
   278	/**
   279	 * Extract frontmatter and validate its YAML syntax in a single pass.
   280	 * Returns { raw, parseError } where parseError is non-null when malformed YAML

codex
The comparison side is underway too: I’ve pulled the relevant Spec Kit handlers so I can compare Mex’s drift model against our actual health, resume, and post-save quality gates instead of talking about our system abstractly. I’m checking the validation command result now and then I’ll synthesize the paradigm-shift deltas rather than enumerating checker parity.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Context
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	import { randomUUID } from 'crypto';
     6	
     7	// Layer definitions
     8	import * as layerDefs from '../lib/architecture/layer-definitions.js';
     9	import { checkDatabaseUpdated } from '../core/index.js';
    10	import { toErrorMessage } from '../utils/index.js';
    11	
    12	// Intent classifier
    13	import * as intentClassifier from '../lib/search/intent-classifier.js';
    14	
    15	// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
    16	import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
    17	import { buildContext } from '../lib/code-graph/code-graph-context.js';
    18	
    19	// Core handlers for routing
    20	import { handleMemorySearch } from './memory-search.js';
    21	import { handleMemoryMatchTriggers } from './memory-triggers.js';
    22	
    23	// Response envelope
    24	import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';
    25	
    26	// Token estimation
    27	import { estimateTokens } from '../formatters/token-metrics.js';
    28	import {
    29	  getPressureLevel,
    30	  type RuntimeContextStats,
    31	} from '../lib/cognitive/pressure-monitor.js';
    32	import * as workingMemory from '../lib/cognitive/working-memory.js';
    33	import * as sessionManager from '../lib/session/session-manager.js';
    34	
    35	// Telemetry
    36	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    37	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    38	import {
    39	  attachSessionTransitionTrace,
    40	  buildSessionTransitionTrace,
    41	  type SessionTransitionTrace,
    42	} from '../lib/search/session-transition.js';
    43	
    44	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    45	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    46	import * as vectorIndex from '../lib/search/vector-index.js';
    47	
    48	// Shared handler types
    49	import type { MCPResponse, IntentClassification } from './types.js';
    50	
    51	// PI-B3: Folder discovery integration
    52	import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
    53	import {
    54	  isAutoResumeEnabled,
    55	  isFolderDiscoveryEnabled,
    56	  isPressurePolicyEnabled,
    57	  isIntentAutoProfileEnabled,
    58	} from '../lib/search/search-flags.js';
    59	
    60	// Feature catalog: Unified context retrieval (memory_context)
    61	// Feature catalog: Dual-scope memory auto-surface
    62	// Feature catalog: Provenance-rich response envelopes
    63	
    64	
    65	/* ───────────────────────────────────────────────────────────────
    66	   1. TYPES
    67	──────────────────────────────────────────────────────────────── */
    68	
    69	interface ContextMode {
    70	  readonly name: string;
    71	  readonly description: string;
    72	  readonly strategy: string;
    73	  readonly tokenBudget?: number;
    74	}
    75	
    76	interface ContextOptions {
    77	  specFolder?: string;
    78	  folderBoost?: { folder: string; factor: number };
    79	  tenantId?: string;
    80	  userId?: string;
    81	  agentId?: string;
    82	  sharedSpaceId?: string;
    83	  limit?: number;
    84	  sessionId?: string;
    85	  enableDedup?: boolean;
    86	  includeContent?: boolean;
    87	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
    88	  anchors?: string[];
    89	  profile?: string;
    90	  sessionTransition?: SessionTransitionTrace;
    91	}
    92	
    93	interface SessionLifecycleMetadata {
    94	  sessionScope: 'caller' | 'ephemeral';
    95	  requestedSessionId: string | null;
    96	  effectiveSessionId: string;
    97	  resumed: boolean;
    98	  eventCounterStart: number;
    99	  resumedContextCount: number;
   100	}
   101	
   102	interface ContextResult extends Record<string, unknown> {
   103	  strategy: string;
   104	  mode: string;
   105	}
   106	
   107	interface LayerInfo {
   108	  tokenBudget?: number;
   109	}
   110	
   111	interface ContextArgs {
   112	  input: string;
   113	  mode?: string;
   114	  intent?: string;
   115	  specFolder?: string;
   116	  tenantId?: string;
   117	  userId?: string;
   118	  agentId?: string;
   119	  sharedSpaceId?: string;
   120	  limit?: number;
   121	  sessionId?: string;
   122	  enableDedup?: boolean;
   123	  includeContent?: boolean;
   124	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
   125	  tokenUsage?: number;
   126	  anchors?: string[];
   127	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   128	  profile?: string;
   129	}
   130	
   131	/** T205: Token budget enforcement metadata */
   132	interface TokenBudgetEnforcement {
   133	  budgetTokens: number;
   134	  actualTokens: number;
   135	  enforced: boolean;
   136	  truncated: boolean;
   137	  originalResultCount?: number;
   138	  returnedResultCount?: number;
   139	}
   140	
   141	type PressureOverrideTargetMode = 'quick' | 'focused' | null;
   142	
   143	interface SessionLifecycleResolution {
   144	  requestedSessionId: string | null;
   145	  effectiveSessionId: string;
   146	  resumed: boolean;
   147	  priorMode: string | null;
   148	  counter: number;
   149	  error?: string;
   150	}
   151	
   152	interface EffectiveModeIntentClassification {
   153	  detectedIntent?: string;
   154	  intentConfidence: number;
   155	  resumeHeuristicApplied: boolean;
   156	  source: 'explicit' | 'auto-detected';
   157	}
   158	
   159	interface EffectiveModeResolution {
   160	  effectiveMode: string;
   161	  pressureOverrideApplied: boolean;
   162	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   163	  pressureWarning: string | null;
   164	  intentClassification: EffectiveModeIntentClassification;
   165	}
   166	
   167	interface BuildResponseMetaParams {
   168	  effectiveMode: string;
   169	  requestedMode: string;
   170	  tracedResult: ContextResult;
   171	  pressurePolicy: {
   172	    level: string;
   173	    ratio: number | null;
   174	    source: string;
   175	    warning: string | null;
   176	  };
   177	  pressureOverrideApplied: boolean;
   178	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   179	  pressureWarning: string | null;
   180	  sessionLifecycle: SessionLifecycleMetadata;
   181	  effectiveBudget: number;
   182	  enforcement: TokenBudgetEnforcement;
   183	  intentClassification: EffectiveModeIntentClassification;
   184	  discoveredFolder?: string;
   185	  includeTrace: boolean;
   186	  sessionTransition: SessionTransitionTrace;
   187	  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
   188	}
   189	
   190	interface StrategyErrorPayload {
   191	  error: string;
   192	  code: string;
   193	  details: Record<string, unknown>;
   194	  hints: string[];
   195	  severity: string | null;
   196	}
   197	
   198	interface StructuralRoutingNudgeMeta {
   199	  advisory: true;
   200	  readiness: 'ready';
   201	  preferredTool: 'code_graph_query';
   202	  message: string;
   203	  preservesAuthority: 'session_bootstrap';
   204	}
   205	
   206	const STRUCTURAL_ROUTING_PATTERNS = [
   207	  /\b(?:who|what)\s+calls?\b/i,
   208	  /\bcallers?\s+of\b/i,
   209	  /\b(?:who|what)\s+imports?\b/i,
   210	  /\bimports?\s+of\b/i,
   211	  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
   212	  /\boutline\s+of\b/i,
   213	  /\bdependenc(?:y|ies)\b/i,
   214	  /\bdependents?\b/i,
   215	  /\bwhat\s+extends\b/i,
   216	];
   217	
   218	function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
   219	  try {
   220	    const parsed = JSON.parse(responseText) as Record<string, unknown>;
   221	    const outerData = parsed?.data as Record<string, unknown> | undefined;
   222	
   223	    const directRows = Array.isArray(outerData?.results)
   224	      ? outerData.results as Array<Record<string, unknown>>
   225	      : null;
   226	    if (directRows) {
   227	      return directRows;
   228	    }
   229	
   230	    const nestedContent = Array.isArray(outerData?.content)
   231	      ? outerData.content as Array<{ type?: string; text?: string }>
   232	      : [];
   233	    const nestedText = nestedContent[0]?.text;
   234	    if (typeof nestedText !== 'string' || nestedText.length === 0) {
   235	      return [];
   236	    }
   237	
   238	    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
   239	    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
   240	    return Array.isArray(nestedData?.results)
   241	      ? nestedData.results as Array<Record<string, unknown>>
   242	      : [];
   243	  } catch {
   244	    return [];
   245	  }
   246	}
   247	
   248	function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
   249	  if ((result as Record<string, unknown>).isError !== true) {
   250	    return null;
   251	  }
   252	
   253	  const content = Array.isArray((result as Record<string, unknown>).content)
   254	    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
   255	    : [];
   256	  const responseText = content[0]?.text;
   257	  if (typeof responseText !== 'string' || responseText.length === 0) {
   258	    return {
   259	      error: 'Context strategy failed',
   260	      code: 'E_STRATEGY',
   261	      details: {},
   262	      hints: [],
   263	      severity: null,
   264	    };
   265	  }
   266	
   267	  try {
   268	    const parsed = JSON.parse(responseText) as {
   269	      data?: {
   270	        error?: string;
   271	        code?: string;
   272	        details?: Record<string, unknown>;
   273	      };
   274	      hints?: string[];
   275	      meta?: {
   276	        severity?: string;
   277	      };
   278	    };
   279	
   280	    return {
   281	      error: parsed.data?.error ?? 'Context strategy failed',
   282	      code: parsed.data?.code ?? 'E_STRATEGY',
   283	      details: parsed.data?.details ?? {},
   284	      hints: Array.isArray(parsed.hints) ? parsed.hints : [],
   285	      severity: parsed.meta?.severity ?? null,
   286	    };
   287	  } catch {
   288	    return {
   289	      error: 'Context strategy failed',
   290	      code: 'E_STRATEGY',
   291	      details: {},
   292	      hints: [],
   293	      severity: null,
   294	    };
   295	  }
   296	}
   297	
   298	function buildStructuralRoutingNudge(
   299	  input: string,
   300	  queryIntentMetadata: {
   301	    queryIntent: string;
   302	    confidence: number;
   303	  } | null,
   304	  graphContextResult: Record<string, unknown> | null,
   305	): StructuralRoutingNudgeMeta | null {
   306	  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
   307	    return null;
   308	  }
   309	
   310	  if (!STRUCTURAL_ROUTING_PATTERNS.some((pattern) => pattern.test(input))) {
   311	    return null;
   312	  }
   313	
   314	  const metadata = graphContextResult?.metadata as Record<string, unknown> | undefined;
   315	  const totalNodes = typeof metadata?.totalNodes === 'number' ? metadata.totalNodes : 0;
   316	  if (totalNodes <= 0) {
   317	    return null;
   318	  }
   319	
   320	  return {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Snapshot
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 024: Lightweight read-only snapshot of session state.
     5	// Aggregates metrics, graph freshness, and priming status into a
     6	// single object for buildServerInstructions() and agent bootstrap.
     7	
     8	import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
     9	import { isSessionPrimed, getLastActiveSessionId } from '../../hooks/memory-surface.js';
    10	import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';
    11	import { getGraphFreshness } from '../code-graph/ensure-ready.js';
    12	import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
    13	import {
    14	  trustStateFromStructuralStatus,
    15	  type SharedPayloadProvenance,
    16	} from '../context/shared-payload.js';
    17	
    18	/* ───────────────────────────────────────────────────────────────
    19	   1. TYPES
    20	──────────────────────────────────────────────────────────────── */
    21	
    22	export interface SessionSnapshot {
    23	  specFolder: string | null;
    24	  currentTask: string | null;
    25	  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
    26	  cocoIndexAvailable: boolean;
    27	  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
    28	  lastToolCallAgoMs: number | null;
    29	  primed: boolean;
    30	  routingRecommendation: string;
    31	}
    32	
    33	/**
    34	 * Phase 027: Structural Bootstrap Contract — shared by all non-hook surfaces.
    35	 * Single source of truth for structural context in startup/recovery flows.
    36	 * Token budget: 250-400 tokens (hard ceiling 500 including guidance).
    37	 */
    38	export interface StructuralBootstrapContract {
    39	  status: 'ready' | 'stale' | 'missing';
    40	  summary: string;
    41	  highlights?: string[];
    42	  recommendedAction: string;
    43	  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
    44	  provenance?: SharedPayloadProvenance;
    45	}
    46	
    47	/* ───────────────────────────────────────────────────────────────
    48	   2. CONSTANTS
    49	──────────────────────────────────────────────────────────────── */
    50	
    51	const STRUCTURAL_CONTRACT_MAX_TOKENS = 500;
    52	
    53	/* ───────────────────────────────────────────────────────────────
    54	   3. HELPERS
    55	──────────────────────────────────────────────────────────────── */
    56	
    57	function resolveGraphFreshness(): SessionSnapshot['graphFreshness'] {
    58	  try {
    59	    return getGraphFreshness(process.cwd());
    60	  } catch {
    61	    return 'error';
    62	  }
    63	}
    64	
    65	function estimateTextTokens(text: string): number {
    66	  return Math.ceil(text.length / 4);
    67	}
    68	
    69	function truncateTextToTokenBudget(text: string, maxTokens: number): string {
    70	  if (maxTokens <= 0) {
    71	    return '';
    72	  }
    73	
    74	  if (estimateTextTokens(text) <= maxTokens) {
    75	    return text;
    76	  }
    77	
    78	  const maxChars = Math.max(0, (maxTokens * 4) - 3);
    79	  return `${text.slice(0, maxChars).trimEnd()}...`;
    80	}
    81	
    82	function estimateStructuralContractTokens(
    83	  summary: string,
    84	  highlights: string[] | undefined,
    85	  recommendedAction: string,
    86	): number {
    87	  return estimateTextTokens([
    88	    summary,
    89	    ...(highlights ?? []),
    90	    recommendedAction,
    91	  ].join('\n'));
    92	}
    93	
    94	function fitStructuralContractBudget(
    95	  summary: string,
    96	  highlights: string[] | undefined,
    97	  recommendedAction: string,
    98	): {
    99	  summary: string;
   100	  highlights: string[] | undefined;
   101	  recommendedAction: string;
   102	} {
   103	  let fittedSummary = summary;
   104	  let fittedHighlights = highlights ? [...highlights] : undefined;
   105	  let fittedRecommendedAction = recommendedAction;
   106	
   107	  while (fittedHighlights && fittedHighlights.length > 0
   108	    && estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   109	    fittedHighlights = fittedHighlights.slice(0, -1);
   110	  }
   111	
   112	  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   113	    const reservedTokens = estimateStructuralContractTokens('', fittedHighlights, fittedRecommendedAction);
   114	    const summaryBudget = Math.max(40, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
   115	    fittedSummary = truncateTextToTokenBudget(fittedSummary, summaryBudget);
   116	  }
   117	
   118	  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
   119	    const reservedTokens = estimateStructuralContractTokens(fittedSummary, fittedHighlights, '');
   120	    const actionBudget = Math.max(20, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
   121	    fittedRecommendedAction = truncateTextToTokenBudget(fittedRecommendedAction, actionBudget);
   122	  }
   123	
   124	  return {
   125	    summary: fittedSummary,
   126	    highlights: fittedHighlights,
   127	    recommendedAction: fittedRecommendedAction,
   128	  };
   129	}
   130	
   131	/* ───────────────────────────────────────────────────────────────
   132	   4. PUBLIC API
   133	──────────────────────────────────────────────────────────────── */
   134	
   135	/** Build a read-only snapshot of the current session state. */
   136	export function getSessionSnapshot(): SessionSnapshot {
   137	  const now = Date.now();
   138	
   139	  // Metrics (safe — in-memory only)
   140	  let specFolder: string | null = null;
   141	  let currentTask: string | null = null;
   142	  try {
   143	    const metrics = getSessionMetrics() as ReturnType<typeof getSessionMetrics> & {
   144	      currentTask?: unknown;
   145	    };
   146	    specFolder = metrics.currentSpecFolder;
   147	    if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
   148	      currentTask = metrics.currentTask;
   149	    }
   150	  } catch { /* metrics unavailable */ }
   151	
   152	  // Graph freshness
   153	  const graphFreshness = resolveGraphFreshness();
   154	
   155	  // CocoIndex availability
   156	  let cocoIndexAvailable = false;
   157	  try {
   158	    cocoIndexAvailable = isCocoIndexAvailable();
   159	  } catch { /* unavailable */ }
   160	
   161	  // Quality score
   162	  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
   163	  try {
   164	    const qs = computeQualityScore();
   165	    sessionQuality = qs.level;
   166	  } catch { /* unknown */ }
   167	
   168	  // Last tool call
   169	  let lastToolCallAgoMs: number | null = null;
   170	  try {
   171	    const last = getLastToolCallAt();
   172	    if (last !== null) lastToolCallAgoMs = now - last;
   173	  } catch { /* null */ }
   174	
   175	  // Priming status
   176	  let primed = false;
   177	  try {
   178	    const primingSessionId = getLastActiveSessionId();
   179	    primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
   180	  } catch { /* not primed */ }
   181	
   182	  // Build routing recommendation
   183	  const routingParts: string[] = [];
   184	  if (cocoIndexAvailable) {
   185	    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
   186	  }
   187	  if (graphFreshness === 'fresh') {
   188	    routingParts.push('structural queries (callers, deps) → code_graph_query');
   189	  }
   190	  routingParts.push('exact text/regex → Grep');
   191	  const routingRecommendation = routingParts.join(' | ');
   192	
   193	  return {
   194	    specFolder,
   195	    currentTask,
   196	    graphFreshness,
   197	    cocoIndexAvailable,
   198	    sessionQuality,
   199	    lastToolCallAgoMs,
   200	    primed,
   201	    routingRecommendation,
   202	  };
   203	}
   204	
   205	/**
   206	 * Phase 027: Build a structural bootstrap contract for a given surface.
   207	 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
   208	 * Keeps output compact (targets 250-400 tokens, ceiling 500).
   209	 */
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
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts; do echo "===== $f ====="; rg -n "structural|health|score|status|repair|repair|autoRepair|provider|diagnostic|hints|graph|stale|quality|drift" $f; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts =====
5:// code graph status, and CocoIndex availability into a single call.
11:import * as graphDb from '../lib/code-graph/code-graph-db.js';
12:import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
33:} from '../lib/code-graph/ops-hardening.js';
68:  status: 'accepted' | 'rejected';
79:    | 'stale_summary'
94:  status: 'fresh' | 'stale' | 'empty' | 'error';
111:  structuralContext?: StructuralBootstrapContract;
112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
115:  graphOps?: CodeGraphOpsContract;
116:  hints: string[];
166:    status: 'rejected',
287:      'stale_summary',
328:    status: 'accepted',
373:  if (decision.status !== 'accepted' || !decision.cachedSummary) {
387:  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
407:  const hints: string[] = [];
433:      hints.push('Memory resume failed. Try memory_context manually.');
437:  // ── Sub-call 2: Code graph status ───────────────────────────
439:    status: 'error',
446:    const stats = graphDb.getStats();
449:      status: freshness,
455:    // Graph status hints deferred to structural contract (Phase 027)
456:    // — structural context hints at lines 128-130 provide preferred recovery path
458:    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
468:    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
473:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
477:  const structuralTrust = buildStructuralContextTrust(structuralContext);
484:  if (cachedSummaryDecision.status === 'accepted') {
485:    hints.push('Cached continuity summary accepted as additive resume context.');
504:  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
505:  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
507:  const structuralCertainty: SharedPayloadCertainty = 'exact';
518:  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
533:      key: 'code-graph-status',
535:      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
536:      source: 'code-graph',
540:      key: 'cocoindex-status',
549:      key: 'structural-context',
551:      content: structuralContext.summary,
552:      source: 'code-graph',
553:      certainty: structuralCertainty,
554:      structuralTrust,
564:      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
565:      { label: 'graph', certainty: codeGraphCertainty },
567:      { label: 'structural', certainty: structuralCertainty },
568:    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
572:      trustState: trustStateFromStructuralStatus(structuralContext.status),
574:      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
575:      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
578:  const graphOps = buildCodeGraphOpsContract({
579:    graphFreshness: codeGraph.status as GraphFreshness,
588:    structuralContext,
594:    graphOps,
596:    hints,
611:      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
===== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts =====
15:import * as embeddings from '../lib/providers/embeddings.js';
23:import { getEmbeddingRetryStats } from '../lib/providers/retry-manager.js';
28:// Feature catalog: Health diagnostics (memory_health)
30:// Feature catalog: Memory health autoRepair metadata
33:/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
222:/** Handle memory_health tool -- returns system health status and diagnostics. */
231:    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
233:      tool: 'memory_health',
234:      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
245:    autoRepair = false,
251:      tool: 'memory_health',
260:      tool: 'memory_health',
267:  if (typeof autoRepair !== 'boolean') {
269:      tool: 'memory_health',
270:      error: 'autoRepair must be a boolean',
278:      tool: 'memory_health',
287:      tool: 'memory_health',
331:      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
333:        tool: 'memory_health',
340:    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
344:    const hints: string[] = [];
346:      hints.push('Database not connected - restart MCP server');
348:    if (autoRepair) {
349:      hints.push('autoRepair is only applied in reportMode="full"');
352:      hints.push('No divergent alias groups detected');
355:      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
359:      tool: 'memory_health',
363:        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
373:      hints,
378:  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
380:  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
382:  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
383:  const hints: string[] = [];
384:  const repair = {
385:    requested: autoRepair,
387:    repaired: false,
397:    repair.attempted = true;
407:      // Resolve the lazy profile so health reflects the active runtime provider
410:      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
412:      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
416:  const providerName = profile?.provider ?? providerMetadata.provider;
417:  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
418:  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
419:  const repairActions = [
426:  if (autoRepair && !confirmed) {
428:      tool: 'memory_health',
429:      summary: 'Confirmation required before auto-repair actions are executed',
431:        status,
433:        autoRepairRequested: true,
435:        actions: repairActions,
438:      hints: [
439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
446:    hints.push('Embedding model not ready - some operations may fail');
449:    hints.push('Database not connected - restart MCP server');
452:    hints.push('Vector search unavailable - fallback to BM25');
460:        hints.push(
465:        if (autoRepair) {
468:            repair.actions.push('fts_rebuild');
471:            repair.actions.push('trigger_cache_refresh');
473:            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
474:            if (memoryCountRow.count === repairedFtsCountRow.count) {
476:              repair.actions.push('fts_consistency_verified');
477:              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
480:              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
481:              repair.warnings.push(warning);
482:              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
484:          } catch (repairError: unknown) {
485:            const message = toErrorMessage(repairError);
487:            repair.errors.push(sanitizeErrorForHint(message));
488:            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
494:      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
495:      if (autoRepair) {
497:        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
502:  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
503:  // (referencing deleted memories) are cleaned up during health checks.
504:  if (autoRepair && database) {
511:        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
512:        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
516:      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
520:  if (autoRepair && database) {
528:        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
529:        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
534:        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
535:        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
545:        repair.warnings.push(
546:          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
553:      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
557:  if (repair.attempted) {
558:    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
559:    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
563:    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
566:    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
570:    tool: 'memory_health',
573:      status,
582:      repair,
584:        provider: providerName,
585:        model: providerModel,
586:        dimension: providerDimension,
587:        healthy: providerMetadata.healthy !== false,
592:    hints,

exec
/bin/zsh -lc 'for f in src/setup/index.ts src/setup/prompts.ts src/watch.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,280p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== src/setup/index.ts =====
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
===== src/setup/prompts.ts =====
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
===== src/watch.ts =====
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
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts; do echo "===== $f ====="; rg -n "HIGH|MEDIUM|LOW|blockOnWrite|blockOnIndex|placeholder|contamination|quality|review|valid|disposition|frontmatter|title" $f | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts =====
33:export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
70:  reviewerError?: string;
139:const HIGH_GUARDRAIL_CHECKS = new Set<ReviewCheckId>(['D1', 'D2', 'D4', 'D7']);
414:function isGenericTitle(title: string): boolean {
415:  const normalized = title.trim().toLowerCase().replace(/['"]/g, '');
480:    if (issue.severity === 'HIGH') {
485:    } else if (issue.severity === 'MEDIUM') {
550:    structuredLog('warn', 'memory_save_review_violation', {
591:export function reviewPostSaveQuality(input: PostSaveReviewInput): PostSaveReviewResult {
599:    // SKIPPED is intentional-only now: missing payload means there is nothing valid to compare.
610:    // JSON-mode saves are the only ones with a reviewer contract today.
615:    // Follow-up: the reviewer still does multiple focused string parses, but they
619:    const frontmatter = parseFrontmatter(fileContent);
624:    const savedTitle = normalizeScalarValue(frontmatter.title);
627:    const savedTier = normalizeScalarValue(frontmatter.importance_tier);
629:    const savedContextType = normalizeScalarValue(frontmatter.contextType || frontmatter.context_type);
647:    const savedDescription = normalizeScalarValue(frontmatter.description);
657:        severity: 'HIGH',
658:        field: 'title',
660:        fix: `Edit frontmatter title to: "${payloadSummary.substring(0, 80)}"`,
672:          severity: 'HIGH',
686:          severity: 'MEDIUM',
697:        severity: 'MEDIUM',
700:        fix: `Change to "${explicitTier}" in frontmatter`,
706:        frontmatter.decision_count || memoryMetadata.decision_count || '0',
712:          severity: 'MEDIUM',
724:          severity: 'LOW',
727:          fix: `Change to "${explicitContextType}" in frontmatter`,
732:    const placeholderObservationCount = (fileContent.match(/^### OBSERVATION:\s*(?:Observation)?\s*$/gim) ?? []).length;
733:    if (placeholderObservationCount >= 2) {
736:        severity: 'MEDIUM',
738:        message: `generic observation placeholder headings repeated ${placeholderObservationCount} times`,
739:        fix: 'Suppress blank-title observation headings before the template renders them',
766:        severity: 'MEDIUM',
768:        message: `decision proposition is repeated across outcomes, title, and rationale: ${JSON.stringify(duplicatedDecisionPropositions.slice(0, 3))}`,
769:        fix: 'Deduplicate repeated decision propositions across Key Outcomes, decision titles, and fallback rationale',
779:        severity: 'MEDIUM',
790:        severity: 'MEDIUM',
800:        severity: 'MEDIUM',
802:        message: `frontmatter contextType is "${savedContextType || 'missing'}" but MEMORY METADATA is "${metadataContextType || 'missing'}"`,
803:        fix: 'Render MEMORY METADATA context_type from the same resolved frontmatter contextType value',
812:        severity: 'HIGH',
814:        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
815:        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
823:        severity: 'MEDIUM',
837:        severity: 'MEDIUM',
854:          severity: 'LOW',
882:          severity: 'HIGH',
890:    // CHECK-D2: lexical placeholder contamination.
894:        severity: 'HIGH',
896:        message: 'DECISIONS contains observation/user placeholder labels despite authored decisions in the payload',
911:        severity: 'MEDIUM',
918:    // CHECK-D4: frontmatter vs metadata tier drift.
922:        severity: 'HIGH',
924:        message: `frontmatter is "${savedTier}" but MEMORY METADATA is "${metadataTier}"`,
933:        severity: 'MEDIUM',
936:        fix: 'Populate causal_links.supersedes when a continuation save has a valid predecessor',
957:          severity: 'MEDIUM',
960:          fix: 'Deduplicate trigger_phrases before the saved frontmatter is rendered',
967:      const headRef = normalizeScalarValue(memoryMetadata.head_ref || frontmatter.head_ref);
968:      const commitRef = normalizeScalarValue(memoryMetadata.commit_ref || frontmatter.commit_ref);
969:      const repositoryState = normalizeScalarValue(memoryMetadata.repository_state || frontmatter.repository_state);
979:          severity: 'HIGH',
982:          fix: 'Keep JSON-mode provenance extraction authoritative and pass provenanceExpected into the reviewer contract',
1002:        severity: 'MEDIUM',
1019:    const highCount = issues.filter((issue) => issue.severity === 'HIGH').length;
1020:    const mediumCount = issues.filter((issue) => issue.severity === 'MEDIUM').length;
1021:    const lowCount = issues.filter((issue) => issue.severity === 'LOW').length;
1034:      ? `Composite blocker fired (${guardrailCounts.high} HIGH, ${guardrailCounts.medium} MEDIUM guardrail findings; DUP=${guardrailCounts.dupHigh} HIGH/${guardrailCounts.dupMedium} MEDIUM)`
1048:    const reviewerError = `Unexpected reviewer failure for ${savedFilePath}: ${error instanceof Error ? error.message : String(error)}`;
1052:      reviewerError,
1063:  HIGH: -0.10,
1064:  MEDIUM: -0.05,
1065:  LOW: -0.02,
1086:    // - renderQualityScore: rendered wrapper quality after template/output validation
1102:    console.log(`\nPOST-SAVE QUALITY REVIEW -- REVIEWER ERROR (${result.reviewerError || 'unknown reviewer error'})\n`);
1113:  const highCount = result.highCount ?? result.issues.filter((issue) => issue.severity === 'HIGH').length;
1114:  const mediumCount = result.mediumCount ?? result.issues.filter((issue) => issue.severity === 'MEDIUM').length;
1131:    console.log('The AI MUST manually patch HIGH severity fields before continuing.\n');
1133:    console.log('MEDIUM issues should be patched when practical.\n');
===== .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts =====
7:// Post-render quality gate for generated memory files
9:// Canonical location: lib/validate-memory-quality.ts
10:// This module contains pure validation logic with no memory/ dependencies.
11:// The memory/validate-memory-quality.ts file re-exports from here for
32:  blockOnWrite: boolean;
33:  blockOnIndex: boolean;
39:  disposition: ValidationDisposition;
48:    name: 'placeholder-leakage-required-fields',
50:    blockOnWrite: true,
51:    blockOnIndex: true,
57:    name: 'placeholder-leakage-with-tools',
59:    blockOnWrite: false,
60:    blockOnIndex: true,
62:    reason: 'Structured content can be saved for inspection, but placeholder leakage with real tool evidence should not reach the semantic index.',
68:    blockOnWrite: true,
69:    blockOnIndex: true,
71:    reason: 'Malformed spec_folder routing metadata invalidates the saved memory target.',
77:    blockOnWrite: false,
78:    blockOnIndex: false,
86:    blockOnWrite: false,
87:    blockOnIndex: false,
89:    reason: 'Sparse trigger phrases are diagnostic, but not enough to reject an otherwise valid rendered memory.',
93:    name: 'template-placeholder-remnants',
95:    blockOnWrite: false,
96:    blockOnIndex: false,
98:    reason: 'Template placeholder remnants are tracked as soft diagnostics when upstream template-contract validation already passed.',
104:    blockOnWrite: false,
105:    blockOnIndex: false,
111:    name: 'cross-spec-contamination',
113:    blockOnWrite: true,
114:    blockOnIndex: true,
116:    reason: 'Foreign-spec contamination would corrupt both the saved memory and the semantic index.',
120:    name: 'title-contamination',
122:    blockOnWrite: true,
123:    blockOnIndex: true,
125:    reason: 'A contaminated title undermines retrieval quality and saved-memory truthfulness.',
131:    blockOnWrite: false,
132:    blockOnIndex: false,
140:    blockOnWrite: true,
141:    blockOnIndex: true,
149:    blockOnWrite: false,
150:    blockOnIndex: true,
156:    name: 'malformed-frontmatter',
158:    blockOnWrite: true,
159:    blockOnIndex: true,
161:    reason: 'Malformed frontmatter YAML or near-empty body content renders the memory unindexable and untrustworthy.',
167:    blockOnWrite: false,
168:    blockOnIndex: false,
175:  .filter((metadata) => metadata.blockOnWrite)
186:  valid: boolean;
189:  contaminationAudit: ContaminationAuditRecord;
200:  { pattern: /(^title:\s*"|^#\s+)To promote a memory to constitutional tier/im, label: 'template instructional banner leakage' },
214:  { pattern: /^\[[^\]]+\]$/i, label: 'placeholder bracket title' },
215:  { pattern: /^(untitled|draft|todo|tbd)(?:\s+(memory|session|summary|document|notes?))?$/i, label: 'generic stub title' },
216:  { pattern: /^\d{3}(?:-[a-z0-9][a-z0-9-]*)?$/i, label: 'spec-id-only title' },
255:function validateFrontMatterSyntax(raw: string): string | null {
259:      return 'frontmatter root must be a YAML mapping';
279: * Extract frontmatter and validate its YAML syntax in a single pass.
290:    const parseError = validateFrontMatterSyntax(raw);
596:    // When saving memory for "023/012-memory-save-quality-pipeline",
607:          // Also allow the display name without numeric prefix (e.g., "memory-save-quality-pipeline")
665:  return metadata.blockOnWrite && ruleAppliesToSource(metadata, source);
670:  return metadata.blockOnIndex && ruleAppliesToSource(metadata, source);
680:      disposition: 'abort_write',
690:      disposition: 'write_skip_index',
698:    disposition: 'write_and_index',
709:function validateMemoryQualityContent(content: string, options?: { filePath?: string; source?: DataSource | string | null }): ValidationResult {
714:  // Fallback: extract spec folder from file path when frontmatter doesn't have it.
716:  // the spec_folder frontmatter field — without it, V8 sees current_spec as unknown
717:  // and treats all cross-references as foreign contamination.
735:      ? `placeholder leakage: field=${v1FailedField}`
744:      ? 'placeholder leakage: [N/A] present with tool execution data'
772:  const placeholderContent = stripCodeSegments(content);
773:  const placeholderLeak = PLACEHOLDER_PATTERNS.find(({ pattern }) => pattern.test(placeholderContent));
776:    passed: !placeholderLeak,
777:    message: placeholderLeak ? `placeholder leakage: ${placeholderLeak.label}` : 'ok',
790:  // IDs must not be treated as foreign contamination.
823:  const frontmatterSpecCounts = countSpecIdsInValues([...triggerPhrases, ...keyTopics]);
824:  const foreignFrontmatterMentions = [...frontmatterSpecCounts.entries()]
849:  const frontmatterForeignSpec = foreignFrontmatterMentions.length > 0;
851:    ...(frontmatterForeignSpec ? foreignFrontmatterMentions.map((match) => `frontmatter:${match}`) : []),
863:  const titleValue = extractYamlValueFromContent(content, 'title') || extractFirstHeading(content);
864:  const titlePatternMatch = TITLE_CONTAMINATION_PATTERNS.find(({ pattern }) => pattern.test(titleValue));
867:    passed: !titlePatternMatch,
868:    message: titlePatternMatch ? `contaminated title: ${titlePatternMatch.label}` : 'ok',
888:  const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
898:          hasErrorTitle ? 'title' : '',
906:  // - File is in a */memory/ directory (already validated by save pipeline, may use different terms)
935:            structuredLog('warn', 'Failed to read spec.md during V12 topical coherence validation', {
963:  // Sub-check 1: YAML syntax errors in frontmatter (T017-T018)
964:  // Sub-check 2: Content density — strip frontmatter block, count non-whitespace chars (T020)
969:    v13Message = `malformed frontmatter YAML: ${frontMatterParseError}`;
971:    // Content density check: strip the leading frontmatter block then count non-whitespace chars
986:  // Emitted as a soft warning (blockOnWrite: false, blockOnIndex: false)
1012:  const contaminationAudit: ContaminationAuditRecord = {
1016:      'frontmatter:trigger_phrases',
1017:      'frontmatter:key_topics',
1020:      ...TITLE_CONTAMINATION_PATTERNS.map(({ label }) => `title:${label}`),
1024:      ...(titlePatternMatch ? [`title:${titlePatternMatch.label}`] : []),
1037:  structuredLog('info', 'contamination_audit', contaminationAudit);
1040:    valid: failedRules.length === 0,
1043:    contaminationAudit,
1047:function validateMemoryQualityFile(filePath: string): ValidationResult {
1055:      valid: false,
1058:      contaminationAudit: {
1068:  return validateMemoryQualityContent(content, { filePath });
1078:  validateMemoryQualityContent,
1079:  validateMemoryQualityFile,

codex
I’ve got enough raw implementation coverage to move from “what Mex has” to “what it implies.” I’m doing one last targeted pass through tests and a couple of comparison hotspots so the final findings can call out not just intended behavior, but the practical boundaries and blind spots that shape whether an idea is worth adopting.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '360,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   611	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   612	    }],
   613	  };
   614	}

 succeeded in 0ms:
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
   591	    },
   592	    hints,
   593	    startTime,
   594	  });
   595	}
   596	
   597	/* ───────────────────────────────────────────────────────────────
   598	   EXPORTS
   599	──────────────────────────────────────────────────────────────── */
   600	
   601	export { handleMemoryHealth };

exec
/bin/zsh -lc 'for f in test/checkers.test.ts test/claims.test.ts test/scanner.test.ts test/scoring.test.ts test/pattern.test.ts; do echo "===== $f ====="; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/$f | sed -n '"'1,280p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== test/checkers.test.ts =====
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
===== test/claims.test.ts =====
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
===== test/scanner.test.ts =====
     1	import { describe, it, expect, beforeEach, afterEach } from "vitest";
     2	import {
     3	  mkdtempSync,
     4	  writeFileSync,
     5	  mkdirSync,
     6	  rmSync,
     7	} from "node:fs";
     8	import { join } from "node:path";
     9	import { tmpdir } from "node:os";
    10	import { scanManifest } from "../src/scanner/manifest.js";
    11	import { scanEntryPoints } from "../src/scanner/entry-points.js";
    12	import { scanFolderTree } from "../src/scanner/folder-tree.js";
    13	import { scanTooling } from "../src/scanner/tooling.js";
    14	import { scanReadme } from "../src/scanner/readme.js";
    15	
    16	let tmpDir: string;
    17	
    18	beforeEach(() => {
    19	  tmpDir = mkdtempSync(join(tmpdir(), "mex-scan-"));
    20	});
    21	
    22	afterEach(() => {
    23	  rmSync(tmpDir, { recursive: true, force: true });
    24	});
    25	
    26	describe("scanManifest", () => {
    27	  it("parses package.json", () => {
    28	    writeFileSync(
    29	      join(tmpDir, "package.json"),
    30	      JSON.stringify({
    31	        name: "my-app",
    32	        version: "1.0.0",
    33	        dependencies: { express: "^4.18.0" },
    34	        devDependencies: { vitest: "^3.0.0" },
    35	        scripts: { build: "tsc", test: "vitest" },
    36	      })
    37	    );
    38	    const result = scanManifest(tmpDir);
    39	    expect(result).not.toBeNull();
    40	    expect(result!.type).toBe("package.json");
    41	    expect(result!.name).toBe("my-app");
    42	    expect(result!.dependencies).toHaveProperty("express");
    43	    expect(result!.scripts).toHaveProperty("build");
    44	  });
    45	
    46	  it("returns null when no manifest exists", () => {
    47	    expect(scanManifest(tmpDir)).toBeNull();
    48	  });
    49	});
    50	
    51	describe("scanEntryPoints", () => {
    52	  it("finds src/index.ts as main entry", () => {
    53	    mkdirSync(join(tmpDir, "src"), { recursive: true });
    54	    writeFileSync(join(tmpDir, "src/index.ts"), "");
    55	    const entries = scanEntryPoints(tmpDir);
    56	    expect(entries.some((e) => e.path === "src/index.ts" && e.type === "main")).toBe(true);
    57	  });
    58	
    59	  it("finds config files", () => {
    60	    writeFileSync(join(tmpDir, "tsconfig.json"), "{}");
    61	    const entries = scanEntryPoints(tmpDir);
    62	    expect(entries.some((e) => e.path === "tsconfig.json" && e.type === "config")).toBe(true);
    63	  });
    64	
    65	  it("returns empty for empty project", () => {
    66	    expect(scanEntryPoints(tmpDir)).toEqual([]);
    67	  });
    68	});
    69	
    70	describe("scanFolderTree", () => {
    71	  it("categorizes known directory names", () => {
    72	    mkdirSync(join(tmpDir, "routes"));
    73	    mkdirSync(join(tmpDir, "models"));
    74	    mkdirSync(join(tmpDir, "tests"));
    75	    mkdirSync(join(tmpDir, "utils"));
    76	
    77	    const tree = scanFolderTree(tmpDir);
    78	    const names = tree.map((t) => t.category);
    79	    expect(names).toContain("routes");
    80	    expect(names).toContain("models");
    81	    expect(names).toContain("tests");
    82	    expect(names).toContain("utils");
    83	  });
    84	
    85	  it("ignores node_modules and .git", () => {
    86	    mkdirSync(join(tmpDir, "node_modules"));
    87	    mkdirSync(join(tmpDir, ".git"));
    88	    mkdirSync(join(tmpDir, "src"));
    89	
    90	    const tree = scanFolderTree(tmpDir);
    91	    const names = tree.map((t) => t.name);
    92	    expect(names).not.toContain("node_modules");
    93	    expect(names).not.toContain(".git");
    94	    expect(names).toContain("src");
    95	  });
    96	});
    97	
    98	describe("scanTooling", () => {
    99	  it("detects vitest", () => {
   100	    writeFileSync(join(tmpDir, "vitest.config.ts"), "");
   101	    const tooling = scanTooling(tmpDir);
   102	    expect(tooling.testRunner).toBe("vitest");
   103	  });
   104	
   105	  it("detects eslint", () => {
   106	    writeFileSync(join(tmpDir, "eslint.config.js"), "");
   107	    const tooling = scanTooling(tmpDir);
   108	    expect(tooling.linter).toBe("eslint");
   109	  });
   110	
   111	  it("detects package manager from lock files", () => {
   112	    writeFileSync(join(tmpDir, "pnpm-lock.yaml"), "");
   113	    const tooling = scanTooling(tmpDir);
   114	    expect(tooling.packageManager).toBe("pnpm");
   115	  });
   116	
   117	  it("returns nulls for empty project", () => {
   118	    const tooling = scanTooling(tmpDir);
   119	    expect(tooling.testRunner).toBeNull();
   120	    expect(tooling.buildTool).toBeNull();
   121	    expect(tooling.linter).toBeNull();
   122	    expect(tooling.packageManager).toBeNull();
   123	  });
   124	});
   125	
   126	describe("scanReadme", () => {
   127	  it("reads README.md content", () => {
   128	    writeFileSync(join(tmpDir, "README.md"), "# My Project\n\nHello world");
   129	    const result = scanReadme(tmpDir);
   130	    expect(result).toContain("# My Project");
   131	  });
   132	
   133	  it("truncates long READMEs", () => {
   134	    writeFileSync(join(tmpDir, "README.md"), "x".repeat(5000));
   135	    const result = scanReadme(tmpDir);
   136	    expect(result!.length).toBeLessThan(5000);
   137	    expect(result).toContain("(truncated)");
   138	  });
   139	
   140	  it("returns null when no README exists", () => {
   141	    expect(scanReadme(tmpDir)).toBeNull();
   142	  });
   143	});
===== test/scoring.test.ts =====
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
===== test/pattern.test.ts =====
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

codex
I’ve finished the source pass. What’s standing out is that Mex isn’t really proposing “better retrieval” so much as a different control plane: a claim-audited knowledge scaffold that sits beside runtime memory, with targeted repair and post-task growth as first-class loops. I’m turning that into concrete paradigm-shift findings now and keeping the comparison explicit about where our current system is already stronger.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1998,2026p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1998	
  1999	## Failures and how to do differently
  2000	
  2001	- symptom: CLI audit flow stalls or fails fast; cause: unsupported `codex exec --ask-for-approval`; fix: use supported codex flags only and keep single-hop depth constraints in prompt text [Task 2]
  2002	- symptom: context retrieval path blocks audit setup; cause: `spec_kit_memory` handshake failure (`connection closed: initialize response`); fix: switch immediately to direct `rg`/`sed` context gathering instead of retry loops [Task 2]
  2003	- symptom: verification commands fail with filesystem permission errors under `/var/folders`; cause: default temp dir restrictions; fix: set `TMPDIR` to repo-owned `.tmp` before Vitest runs [Task 4]
  2004	- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 4]
  2005	- symptom: docs report stale test/playbook counts after fixes; cause: checklist/plan/summary not updated with latest command outputs; fix: update packet docs and evidence logs in the same pass as code/test changes [Task 2][Task 4]
  2006	
  2007	# Task Group: 023 Hybrid-RAG Refinement Forensic Review
  2008	scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
  2009	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
  2010	
  2011	## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings
  2012	
  2013	### rollout_summary_files
  2014	
  2015	- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)
  2016	
  2017	### keywords
  2018	
  2019	- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
  2020	
  2021	## User preferences
  2022	
  2023	- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
  2024	
  2025	## Reusable knowledge
  2026	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '450,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   450	- rollout_summaries/2026-04-03T11-59-45-KehP-041_recursive_agent_loop_rename.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-59-45-019d5336-ad92-7812-9658-b4a1b290dbb9.jsonl, updated_at=2026-04-04T07:00:23+00:00, thread_id=019d5336-ad92-7812-9658-b4a1b290dbb9)
   451	
   452	### keywords
   453	
   454	- 041-sk-recursive-agent-loop, packet-rename, descriptions.json, validate.sh --strict, historical research memory rewrite, skip spec folder
   455	
   456	## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
   457	
   458	### rollout_summary_files
   459	
   460	- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
   461	
   462	### keywords
   463	
   464	- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
   465	
   466	## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success
   467	
   468	### rollout_summary_files
   469	
   470	- rollout_summaries/2026-04-03T10-45-55-qAti-rename_040_spec_references.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-45-55-019d52f3-14c7-7010-9b34-a491a18d8448.jsonl, updated_at=2026-04-03T11:27:03+00:00, thread_id=019d52f3-14c7-7010-9b34-a491a18d8448)
   471	
   472	### keywords
   473	
   474	- 040-sk-auto-deep-research-review-improvement, ensureDescriptionCache, descriptions.json, E_LINEAGE, skip spec folder, perl -0pi
   475	
   476	## Task 4: Rename parent spec folders and rebuild `.opencode/specs/descriptions.json` with full-surface path sweeps, outcome success
   477	
   478	### rollout_summary_files
   479	
   480	- rollout_summaries/2026-04-05T07-09-09-UzOl-specs_parent_index_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T09-09-09-019d5c79-58a8-76c2-b111-f738e245cffd.jsonl, updated_at=2026-04-05T09:42:28+00:00, thread_id=019d5c79-58a8-76c2-b111-f738e245cffd)
   481	
   482	### keywords
   483	
   484	- 01--anobel.com to 00--anobel.com, drop numeric prefixes, .opencode/specs/descriptions.json, ensureDescriptionCache, git rm -r --cached, skip spec folder
   485	
   486	## Task 5: Stage, commit, and push rename/cleanup waves directly to `main` with explicit branch-rule warning reporting, outcome success
   487	
   488	### rollout_summary_files
   489	
   490	- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)
   491	
   492	### keywords
   493	
   494	- git add -A, git diff --cached --name-status -M, git push origin HEAD:main, Everything up-to-date, bypass branch rules, PR CodeScan signature warnings
   495	
   496	## User preferences
   497	
   498	- when the user said “skip spec folder,” they wanted direct reference/path updates without re-running packet scaffolding flows [Task 1][Task 3][Task 4]
   499	- when the user asked to “update ALL path references ... inside every file ... and inside .opencode/changelog,” treat rename tasks as full-surface sweeps, not selective doc edits [Task 2][Task 4]
   500	- when the user asked “double check and re-index,” finish rename work with residual-old-slug sweeps plus `memory_index_scan`/`memory_quick_search` verification [Task 2][Task 3]
   501	- when the user asked to “commit and push all unstaged changes to main,” stage the whole requested rename/cleanup set, commit with explicit scope, and push with `HEAD:main` if plain `git push origin main` reports “Everything up-to-date” [Task 5]
   502	
   503	## Reusable knowledge
   504	
   505	- stable rename pipeline here: rewrite old slug variants (`.opencode/specs/...`, `specs/...`, short `02--.../slug`) across the packet, patch metadata fields (`Parent Spec`, `Spec Folder`, parent chains/specFolder JSON), rename folder, then run residual `rg` sweeps [Task 1][Task 2]
   506	- regenerate `.opencode/specs/descriptions.json` with `ensureDescriptionCache([...])` after rename sweeps so search/discovery surfaces the new slug immediately [Task 2][Task 3][Task 4]
   507	- rename cleanup can include targeted historical wording updates in packet `research/` and `memory/` artifacts when explicitly requested, while keeping evidence structure unchanged [Task 1]
   508	- release-note updates should be line-scoped: patch `> Spec folder(s): ...` lines in affected `.opencode/changelog` versions instead of rewriting narrative blocks [Task 2]
   509	- parent-folder rename cleanup includes untracking excluded folders via `git rm -r --cached <folder>` and verifying with `git ls-files <folder> | wc -l` before push [Task 4]
   510	- for large rename waves, verify staged rename mapping with `git diff --cached --name-status -M` before commit/push [Task 5]
   511	
   512	## Failures and how to do differently
   513	
   514	- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
   515	- symptom: rename appears complete but stale entries persist in generated indices; cause: descriptions cache/memory index not rebuilt; fix: rerun `ensureDescriptionCache` and forced `memory_index_scan` on packet + parent scope [Task 2][Task 3]
   516	- symptom: scans report old slug hits in branch/memory history; cause: intentional historical references; fix: classify as history and avoid destructive rewriting unless user explicitly asks [Task 2]
   517	- symptom: sweep script aborts with regex/lookaround errors; cause: bad quoting in broad replacement patterns; fix: validate regex quoting on a narrow sample before running repo-wide rewrites [Task 4]
   518	- symptom: `git push origin main` reports “Everything up-to-date” after local commits; cause: wrong refspec path for current HEAD push; fix: retry with `git push origin HEAD:main` and verify `git status -sb` is clean [Task 5]
   519	
   520	# Task Group: Feedback Signal Pipeline Runtime Verification and Follow-On Event Gap

codex
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Split “memory health” into storage integrity vs knowledge-truth drift
- **Source**: [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- **What it does**: Mex runs a separate static audit plane: it finds scaffold markdown files, extracts a narrow claim taxonomy (`path`, `command`, `dependency`, `version`), runs eight zero-token checkers, and emits a drift report independent of runtime state. Our `memory_health` focuses on DB/index/provider integrity, FTS5 consistency, orphan cleanup, and repair metadata, not whether durable guidance files make false claims about the repo.
- **Why it matters for us**: The big shift is not “replace memory_health,” but add a second health surface for durable knowledge truth. Our current architecture is strong on retrieval/storage correctness; Mex shows we need a distinct control plane for doc/memory drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Freshness should include repository-activity drift, not just session and graph readiness
- **Source**: [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- **What it does**: Mex flags each scaffold file by both elapsed days and commits since last change, with warning/error thresholds at `30/90` days and `50/200` commits. Our freshness model is currently about session continuity, cached-summary age, and code-graph freshness.
- **Why it matters for us**: Mex suggests a new freshness axis: “the repo moved, but the durable guidance did not.” That should extend our current freshness model, not replace it. Session freshness answers “can I resume safely?”; repo-activity freshness answers “is this durable guidance still believable?”
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Repair should be turned into bounded, file-scoped remediation packets
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- **What it does**: Mex groups issues by file, then builds a repair brief that carries the current file content, exact issue list, nearby filesystem reality, and recent git diff before re-running drift check in a loop. Our current quality gates are strong at detection and blocking, but they mostly emit hints and severity findings rather than packaging a ready-made repair context for stale knowledge surfaces.
- **Why it matters for us**: This is a strong architecture pattern for doc/memory remediation. Instead of “health says degraded” or “post-save review failed,” we could produce a bounded fix packet for the exact file or memory surface that drifted.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Durable project knowledge wants a doc-native routing scaffold beside indexed memory
- **Source**: [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- **What it does**: Mex assumes a tiny root anchor plus a router plus context/pattern files, then uses scanner-built briefs to populate those files from structured repo evidence. That is different from retrieval-first systems: it gives humans and agents a stable, navigable control surface before search starts.
- **Why it matters for us**: Spec Kit Memory is already better at semantic retrieval, session continuity, and structural routing. The gap is a lightweight doc-native authority layer for stable project truths and task routing. Mex suggests this should complement indexed memory, not replace it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Pattern growth is worth keeping, but only with a higher authority bar than Mex uses
- **Source**: [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [external/test/pattern.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts), [external/test/claims.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts)
- **What it does**: Mex treats post-task scaffold growth as a first-class loop and offers `pattern add` to create reusable task guides fast. But the default authoring contract is placeholder-first: new pattern files start with `[description]`, generic sections, and only minimal structural guarantees.
- **Why it matters for us**: The paradigm shift is valid: reusable task guidance should compound from real work. But Mex’s implementation is too loose for our authority model. If we add a task-pattern layer, it should require evidence-backed creation, validation, and stronger metadata than Mex’s starter scaffolding.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

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


hook: Stop
hook: Stop Completed
tokens used
117,527
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Split “memory health” into storage integrity vs knowledge-truth drift
- **Source**: [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- **What it does**: Mex runs a separate static audit plane: it finds scaffold markdown files, extracts a narrow claim taxonomy (`path`, `command`, `dependency`, `version`), runs eight zero-token checkers, and emits a drift report independent of runtime state. Our `memory_health` focuses on DB/index/provider integrity, FTS5 consistency, orphan cleanup, and repair metadata, not whether durable guidance files make false claims about the repo.
- **Why it matters for us**: The big shift is not “replace memory_health,” but add a second health surface for durable knowledge truth. Our current architecture is strong on retrieval/storage correctness; Mex shows we need a distinct control plane for doc/memory drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Freshness should include repository-activity drift, not just session and graph readiness
- **Source**: [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- **What it does**: Mex flags each scaffold file by both elapsed days and commits since last change, with warning/error thresholds at `30/90` days and `50/200` commits. Our freshness model is currently about session continuity, cached-summary age, and code-graph freshness.
- **Why it matters for us**: Mex suggests a new freshness axis: “the repo moved, but the durable guidance did not.” That should extend our current freshness model, not replace it. Session freshness answers “can I resume safely?”; repo-activity freshness answers “is this durable guidance still believable?”
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Repair should be turned into bounded, file-scoped remediation packets
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- **What it does**: Mex groups issues by file, then builds a repair brief that carries the current file content, exact issue list, nearby filesystem reality, and recent git diff before re-running drift check in a loop. Our current quality gates are strong at detection and blocking, but they mostly emit hints and severity findings rather than packaging a ready-made repair context for stale knowledge surfaces.
- **Why it matters for us**: This is a strong architecture pattern for doc/memory remediation. Instead of “health says degraded” or “post-save review failed,” we could produce a bounded fix packet for the exact file or memory surface that drifted.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Durable project knowledge wants a doc-native routing scaffold beside indexed memory
- **Source**: [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- **What it does**: Mex assumes a tiny root anchor plus a router plus context/pattern files, then uses scanner-built briefs to populate those files from structured repo evidence. That is different from retrieval-first systems: it gives humans and agents a stable, navigable control surface before search starts.
- **Why it matters for us**: Spec Kit Memory is already better at semantic retrieval, session continuity, and structural routing. The gap is a lightweight doc-native authority layer for stable project truths and task routing. Mex suggests this should complement indexed memory, not replace it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Pattern growth is worth keeping, but only with a higher authority bar than Mex uses
- **Source**: [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [external/test/pattern.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts), [external/test/claims.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts)
- **What it does**: Mex treats post-task scaffold growth as a first-class loop and offers `pattern add` to create reusable task guides fast. But the default authoring contract is placeholder-first: new pattern files start with `[description]`, generic sections, and only minimal structural guarantees.
- **Why it matters for us**: The paradigm shift is valid: reusable task guidance should compound from real work. But Mex’s implementation is too loose for our authority model. If we add a task-pattern layer, it should require evidence-backed creation, validation, and stronger metadata than Mex’s starter scaffolding.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

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
