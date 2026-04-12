### Finding 4: Claim extraction is the prerequisite for targeted sync, but the heuristic layer is shallow by design
- **Source**: [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:7)
- **What it does**: Mex extracts path claims from inline code that looks path-like, command claims from inline code and fenced blocks, and dependency/version claims from bold text inside dependency-like headings. It explicitly filters routes, HTTP methods, code-like snippets, quoted assignments, and template placeholders.
- **Why it matters for us**: a Spec Kit sync loop would need the same “claim envelope” concept, but probably not Mex’s exact markdown heuristics. Our corpus has stronger structure than generic scaffold markdown: frontmatter, anchors, spec-doc sections, memory metadata blocks, checklist semantics, and command surfaces. The transferable idea is typed claim extraction, not Mex’s literal regex set.
- **Recommendation**: `prototype later`
- **Impact**: medium

### Finding 5: Spec Kit has adjacent diagnostics, but not a repair control plane
- **Source**: [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:19), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:8), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222)
- **What it does**: `memory_context` routes retrieval; `session_bootstrap` merges resume plus health hints; `post-save-review` compares rendered memory markdown against original collected data after save; `validate-memory-quality` blocks or downgrades bad memory writes/indexing; `memory_health` reports diagnostics and guarded auto-repair metadata. These are real safeguards, but they are retrieval-time, save-time, or system-health-time safeguards.
- **Why it matters for us**: this clarifies the exact gap. We are stronger than Mex on durable-memory validation and retrieval orchestration, but weaker on turning documentation/spec drift into a bounded remediation loop. Mex’s second pattern is not a better memory store; it is a missing repair layer between “validator found drift” and “human manually fixes docs.”
- **Recommendation**: `NEW FEATURE`
- **Impact**: high

### Finding 6: Mex’s bounded sync is useful, but its evidence model has clear limits we should not copy blindly
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:144), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:137), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:57)
- **What it does**: Mex still sends all current targets into one Claude session, uses a shallow extension search for missing-path hints, and limits diff context to `HEAD~5..HEAD`. That keeps prompts small, but it can miss older renames, deeper moves, or semantically related repo changes outside the claimed paths.
- **Why it matters for us**: if we build this in Spec Kit, the core loop is worth copying, but the evidence retrieval should probably use our stronger search surfaces: code graph for structural doc claims, CocoIndex for semantic recovery, and spec-local metadata rather than extension-only filesystem scans.
- **Recommendation**: `prototype later`
- **Impact**: medium

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/test/checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [external/test/scanner.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)

## Assessment
- New information ratio: 0.79
- Questions addressed: how Mex turns drift output into bounded repair work; whether targeted sync is distinct from our current retrieval/save-health surfaces; what data structures make sync possible; what guardrails reduce sync churn; what parts of Mex’s repair evidence are reusable versus shallow.
- Questions answered: the second most impactful Mex pattern is the targeted sync control loop, not any single checker; its key innovation is preserving file-local issue identity into the repair prompt; Spec Kit does not currently have an equivalent repair plane; the loop is reusable, but Mex’s exact path-fuzzy and `HEAD~5` evidence heuristics should not be copied verbatim.

## Reflection
- What worked: tracing the flow as `Claim -> DriftIssue -> SyncTarget -> brief-builder -> recheck` made the pattern much clearer than reviewing drift checkers in isolation, and comparing that loop directly against `memory_context`, `session_bootstrap`, `post-save-review`, and `validate-memory-quality` exposed the actual gap cleanly.
- What did not work: there is no dedicated sync test coverage in the snapshot, so confidence comes from implementation reading rather than behavior tests; the phase validator still passes with the noisy `cannot create temp file for here document: Operation not permitted` message; the brief still references `external/mex-main`, but this checkout’s usable snapshot is `external/`.

## Recommended Next Focus
Compare Modus Memory and Mnemosyne against this exact repair-plane question: do they have any equivalent to “diagnose drift, bound the broken surface, construct a minimal repair packet, recheck,” or are they still retrieval/storage systems only. The highest-value next cut is provenance and trust: which system has the strongest answer for evidence-backed correction loops, not just evidence-backed recall.

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
# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

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
I’m treating this as a read-only source-tracing pass focused on Mex failure handling, corruption resistance, migration surfaces, and scaling behavior, then comparing those patterns against Spec Kit Memory without repeating the earlier sync-loop findings. First I’m doing a quick memory pass and then I’ll trace the relevant `external/src` paths and any tests or config that reveal edge-case behavior.
exec
/bin/zsh -lc 'rg -n "mex|002-mex-main|hybrid-rag-fusion|drift|sync" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
34:scope: per-phase deep-review packet execution under `026-graph-and-context-optimization/review/` with strict write-scope boundaries, shared-state synchronization, and continuation/extension handling
57:## Task 3: Extend Batch A (002-005) from 5 to 10 iterations and re-sync per-phase + batch artifacts, outcome success
67:## Task 4: Extend Batch B (006-010) to 10 iterations and re-sync program totals to 108, outcome success
71:- rollout_summaries/2026-04-09T14-19-26-Ga5w-batch_b_review_10_iteration_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-26-019d729c-b7c1-72c1-90c2-e72c0eb0d52e.jsonl, updated_at=2026-04-09T15:12:27+00:00, thread_id=019d729c-b7c1-72c1-90c2-e72c0eb0d52e, task-local focus=006-010 iteration-006..010 extension + convergence/aggregate sync)
82:- when operator requested “extra stability passes,” extend each targeted phase from 5 to 10 iterations before closure and sync batch-level state/report immediately [Task 3][Task 4]
95:- symptom: stale or conflicting batch totals (for example per-phase files at 10 iterations but global files still at 5); cause: extending iterations without re-syncing shared tracker/consolidated report; fix: treat `batch-phase-review-state.json` and `batch-phase-review-consolidated.md` as mandatory final sync targets after every extension pass [Task 3]
207:- doc closeout requires synchronized updates across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` with exact evidence pointers and explicit deferred-lane notes per ADR-003 [Task 1]
218:## Task 1: Verify/fix sk-code-opencode drift on 87 in-scope TS files, outcome partial (halted after required suite failures)
226:- git diff --name-only HEAD~10 HEAD | grep -E '\\.(ts|tsx|mts)$' | sort -u, 87 files, verify_alignment_drift.py, TS-MODULE-HEADER publication-gate.ts replay-harness.ts, style-only stop rule, revert on failing required suites
230:- when user scope is “every TypeScript file changed in HEAD~10..HEAD,” regenerate the exact scope with `git diff --name-only HEAD~10 HEAD | grep -E '\\.(ts|tsx|mts)$' | sort -u`; if file count/location drifts (expected 87 under system-spec-kit roots), halt before edits [Task 1]
235:- scoped verifier baseline showed 0 errors and only two in-scope warnings (`TS-MODULE-HEADER` on `publication-gate.ts` and `test/hooks/replay-harness.ts`); this is the operative drift set for that HEAD~10 window [Task 1]
243:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for memory-redundancy follow-on work in this checkout when syncing implementation-summary/tasks language and answering Phase 6 plan questions from completed research
275:- Task sheet drift note: `003/.../006-memory-duplication-reduction/tasks.md` still reflects the older research wave; treat PR-12 implementation as primary and PR-13 migration as optional only if wrapper rollout is evidence-justified [Task 2]
309:- rollout_summaries/2026-04-08T06-54-25-D2rK-claudest_continuation_root_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-54-25-019d6bde-f06d-7992-8c23-62eaead4b928.jsonl, updated_at=2026-04-08T07:59:19+00:00, thread_id=019d6bde-f06d-7992-8c23-62eaead4b928)
319:- rollout_summaries/2026-04-08T06-55-14-iMh2-graphify_translation_closeout_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-14-019d6bdf-ae9f-71d3-9b12-ee5c943b14d0.jsonl, updated_at=2026-04-08T08:12:09+00:00, thread_id=019d6bdf-ae9f-71d3-9b12-ee5c943b14d0)
399:- symptom: large multi-file memory patch fails to apply cleanly; cause: generated memory snapshots drift from expected formatting; fix: use smaller per-file patches on the latest packet snapshots and revalidate after each batch [Task 5]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
557:scope: expanded changelog style updates, nested per-packet/per-phase changelog generator integration, and runtime prompt mirror sync
558:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for changelog workflow changes in this checkout, keeping packet-local changelog outputs and shared command mirrors in sync
570:## Task 2: Rewrite shared changelog docs/templates to short-heading style and sync runtime mirrors, outcome success
574:- rollout_summaries/2026-04-03T11-38-20-Mg7F-changelog_update_and_runtime_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-38-20-019d5323-1305-7d91-a2bc-5d3cb2983d3b.jsonl, updated_at=2026-04-03T12:24:53+00:00, thread_id=019d5323-1305-7d91-a2bc-5d3cb2983d3b)
589:- keep `/create:changelog`, `/spec_kit:implement`, and `/spec_kit:complete` docs and YAML assets in sync when changelog contract changes; runtime `.agents`/`.gemini` mirrors should be regenerated from shared command source [Task 2]
685:- symptom: deep-review reducer-schema tests fail during closeout; cause: config metadata drift (`metrics` missing, `.deep-review-pause` mutability mismatch); fix: align config/docs with test schema before rerunning suites [Task 3]
686:- symptom: recommendation docs drift from requested basis; cause: docs written from partial wave context; fix: verify ledger count/`synthesis_complete` and explicitly tie recommendations to the full 90-iteration synthesis [Task 1]
690:scope: deep-review closure, strict-validation remediation, changelog truth-sync, and README/recovery-contract doc parity for packet 023/024 work
733:## Task 5: Truth-sync changelog packet `023-esm-module-compliance` (add phase 013 + adjust 010-012 claims), outcome success
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
767:- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)
788:- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
909:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development and /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.vscode; reuse_rule=reuse for local VS Code MCP sync work, but preserve wrapper shape exactly
935:scope: restoring `/spec_kit:*`, `/memory:*`, and `/create:*` command discovery when prompt links drift between workspace and global Codex prompt directories
977:## Task 2: Consolidate `/memory:continue` into `/spec_kit:resume` and sync Gemini wrappers
1028:## Task 3: Fix startup DB path/provider drift and auto-repair temp-root cleanup for `spec_kit_memory`
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1160:- rollout_summaries/2026-03-28T08-23-42-BSOO-om_2026_03_28_023_esm_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-23-42-019d338a-b98a-7992-bc8b-4f62cbfd1b6e.jsonl, updated_at=2026-03-28T10:57:23+00:00, thread_id=019d338a-b98a-7992-bc8b-4f62cbfd1b6e)
1169:- when packet identity drifted, user signaled to keep canonical naming and lineage truthful at the same time [Task 2]
1171:- when syncing packet 023, user insisted docs must mirror completed research while “keep runtime migration pending” -> do truth-sync in packet docs without claiming implementation completion [Task 5]
1178:- Use Level-3 scaffold scripts for follow-on packets to reduce template drift [Task 3]
1181:- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
1189:- symptom: packet docs drift from deep-research conclusions; cause: spec/plan/tasks/checklist/summary edited piecemeal; fix: run a single truth-sync pass across all packet docs with explicit references to `research/research.md` [Task 5]
1254:- skill_advisor.py, rsync -ainc, diff -qr, SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC, --dataset, .agents/workflows symlink
1273:- Parity audit pattern: run advisor analyzer first, then `rsync -ainc`/`diff -qr` with excludes [Task 1]
1353:- keep legacy CSS and TS exports synchronized in token names/order/structure; verify with `rg` across both artifacts and the flat token map before ticket updates [Task 2]
1358:- symptom: subtle parity drift after branch split; cause: edits validated in one surface only; fix: enforce dual-surface CSS+TS token checks before editing ticket outputs [Task 2]
1513:scope: large-scale renumbering/sweep operations plus root packet normalization and command/agent/spec truth-sync
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1643:- when user asked to “check all associated code and make sure everything works,” include runtime + doc truth-sync tests [Task 4]
1662:scope: architecture/check-pipeline doc truth-sync, sk-doc TOC/anchor compliance, and feature-catalog-style manual testing playbook packaging
1689:- rollout_summaries/2026-03-20T17-39-18-fqar-doc_sync_session_capturing.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T18-39-18-019d0c54-839e-74c0-b7f5-df7696d34827.jsonl, updated_at=2026-03-20T18:02:45+00:00, thread_id=019d0c54-839e-74c0-b7f5-df7696d34827)
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1832:- symptom: memory save / context generation aborts in manual runs; cause: missing JSON input and telemetry doc/schema mismatch; fix: provide `/tmp/save-context-data.json` and sync telemetry README to code fields first [Task 2]
1833:- symptom: recursive validator reports template/AI-protocol/evidence warnings; cause: packet docs drifted from required structure; fix: iterate with validator until warnings/errors are zero [Task 1][Task 5]
1896:## Task 6: Re-run phase-wide 001-018 audit and sync shared docs/playbooks
1965:- cancelIngestJob retry, ALLOWED_BASE_PATHS startup recovery, MutationHookResult.errors, hooks-ux-feedback.vitest.ts, verify_alignment_drift.py
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2011:## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
2027:- high-signal recurring findings in this packet family included completion-claim drift, duplicate checklist IDs, metadata parent-folder drift, and unresolved `[Criteria TBD]` placeholders; keep these as explicit audit checks [Task 1]
2121:- symptom: structure refactor introduces formatting/style drift; cause: large-file manual reshaping; fix: always run targeted Prettier and ESLint on the edited screen before closeout [Task 1]

exec
/bin/zsh -lc 'rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md

codex
I’ve confirmed the usable snapshot is `external/` and there’s no prior memory entry specific to this Mex phase, so I’m staying grounded in the source tree itself. Next I’m reading the external repo’s local instructions and then tracing the code paths that govern config loading, scanner/bootstrap, drift execution, sync, watch mode, and tests for failure behavior.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { MexConfig } from "./types.js";

/**
 * Walk up from startDir looking for .git to find project root,
 * then look for scaffold root (.mex/ or context/ directory).
 */
export function findConfig(startDir?: string): MexConfig {
  const dir = startDir ?? process.cwd();

  if (dir.split(/[\\/]/).includes(".mex")) {
    throw new Error(
      "You're inside the .mex/ directory. Run mex commands from your project root instead."
    );
  }

  // Try git root first, fall back to cwd if no git repo
  const gitRoot = findProjectRoot(dir);
  const projectRoot = gitRoot ?? dir;

  const mexDir = resolve(projectRoot, ".mex");
  if (existsSync(mexDir) && !existsSync(resolve(mexDir, "ROUTER.md"))) {
    throw new Error("Scaffold directory exists but looks incomplete. Run: mex setup");
  }

  const scaffoldRoot = findScaffoldRoot(projectRoot);
  if (!scaffoldRoot) {
    if (!gitRoot) {
      throw new Error("No git repository found. Initialize one first: git init");
    }

    throw new Error(
      "No .mex/ scaffold found. Run: mex setup"
    );
  }

  return { projectRoot, scaffoldRoot };
}

function findProjectRoot(dir: string): string | null {
  let current = resolve(dir);
  while (true) {
    if (existsSync(resolve(current, ".git"))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function findScaffoldRoot(projectRoot: string): string | null {
  // Prefer .mex/ directory
  const mexDir = resolve(projectRoot, ".mex");
  if (existsSync(mexDir)) {
    return mexDir;
  }

  // Fall back to context/ directory (current mex layout)
  const contextDir = resolve(projectRoot, "context");
  if (existsSync(contextDir)) return projectRoot;

  return null;
}

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { writeFileSync, readFileSync, existsSync, chmodSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import chalk from "chalk";
import type { MexConfig } from "./types.js";

const HOOK_MARKER = "# mex-drift-check";

function buildHookContent(config: MexConfig): string {
  const cliPath = resolve(config.scaffoldRoot, "dist", "cli.js");
  // Use local CLI if built, otherwise fall back to npx
  const cmd = existsSync(cliPath)
    ? `node "${cliPath}" check --quiet`
    : "npx mex check --quiet";

  return `#!/bin/sh
${HOOK_MARKER}
# Auto-installed by mex watch — runs drift check after each commit
SCORE=$(${cmd} 2>&1) || true
# Only show output if there are issues (not a perfect score)
case "$SCORE" in
  *"100/100"*) ;;
  *) echo "$SCORE" ;;
esac
`;
}

export async function manageHook(
  config: MexConfig,
  opts: { uninstall?: boolean }
): Promise<void> {
  const hookPath = resolve(config.projectRoot, ".git", "hooks", "post-commit");

  if (opts.uninstall) {
    uninstallHook(hookPath);
    return;
  }

  installHook(hookPath, config);
}

function installHook(hookPath: string, config: MexConfig): void {
  const hookContent = buildHookContent(config);

  if (existsSync(hookPath)) {
    const existing = readFileSync(hookPath, "utf-8");
    if (existing.includes(HOOK_MARKER)) {
      console.log(chalk.yellow("mex post-commit hook is already installed."));
      return;
    }

    // Append to existing hook
    const updated = existing.trimEnd() + "\n\n" + hookContent;
    writeFileSync(hookPath, updated);
    chmodSync(hookPath, 0o755);
    console.log(
      chalk.green("Added mex drift check to existing post-commit hook.")
    );
    return;
  }

  writeFileSync(hookPath, hookContent);
  chmodSync(hookPath, 0o755);
  console.log(chalk.green("Installed mex post-commit hook."));
}

function uninstallHook(hookPath: string): void {
  if (!existsSync(hookPath)) {
    console.log(chalk.yellow("No post-commit hook found."));
    return;
  }

  const content = readFileSync(hookPath, "utf-8");
  if (!content.includes(HOOK_MARKER)) {
    console.log(
      chalk.yellow("post-commit hook exists but was not installed by mex.")
    );
    return;
  }

  // Remove mex section (everything between marker and next non-mex line)
  const lines = content.split("\n");
  const filtered: string[] = [];
  let inMexBlock = false;

  for (const line of lines) {
    if (line.includes(HOOK_MARKER)) {
      inMexBlock = true;
      continue;
    }
    if (inMexBlock) {
      // Skip lines that are part of the mex hook block
      if (line.startsWith("#") || line.startsWith("SCORE=") ||
          line.startsWith("case") || line.startsWith("  *") ||
          line.startsWith("esac") || line.startsWith("npx mex") ||
          line.startsWith("node ") || line.trim() === "") {
        continue;
      }
      // Non-mex line found — stop skipping
      inMexBlock = false;
    }
    filtered.push(line);
  }

  const remaining = filtered.join("\n").trim();
  if (remaining === "#!/bin/sh" || remaining === "") {
    // Only shebang left — remove the file
    unlinkSync(hookPath);
    console.log(chalk.green("Removed mex post-commit hook."));
  } else {
    writeFileSync(hookPath, remaining + "\n");
    chmodSync(hookPath, 0o755);
    console.log(
      chalk.green("Removed mex section from post-commit hook.")
    );
  }
}

codex
The first concrete failure surfaces are already showing up in config and watch mode: Mex is strict about root/scaffold detection, but its hook uninstall logic is string-shape-based and looks fragile if a user customizes the generated block. I’m pulling the core drift and sync code now so the final findings stay source-backed and focused on non-obvious failure modes rather than README claims.
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"throw new Error|catch \\(|process\\.exit|existsSync|unlinkSync|writeFileSync|readFileSync|parse|JSON|yaml|frontmatter|warning|error|stale|HEAD~|globSync|execSync|spawn|git\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/{sync,drift,scanner,setup}/*.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/{sync,drift/checkers,scanner,setup}/*.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:1:import { readFileSync, readdirSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:3:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:4:import { getGitDiff } from "../git.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:49:    fileContent = readFileSync(filePath, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:58:  // Get git diff for paths referenced by this file's claims
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:65:    : target.gitDiff ?? "";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:90:**Recent git changes in referenced paths:**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:123:      if (existsSync(absDir)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:141:      const matches = globSync(`**/*.${ext}`, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:143:        ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:2:import { spawnSync } from "node:child_process";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:19:  const result = spawnSync("claude", [brief], {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:65:            (other) => other.file === i.file && other.severity === "error"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:73:          "No errors found. Only warnings remain (use --warnings to include them)."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:86:      const errors = target.issues.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:87:        (i) => i.severity === "error"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:89:      const warnings = target.issues.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:90:        (i) => i.severity === "warning"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:93:        `  ${target.file} — ${errors} errors, ${warnings} warnings`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:173:      (i) => i.severity === "error"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:176:      (i) => i.severity === "warning"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:183:            `${remainingWarnings} warning(s) remain (use --warnings to include them).`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:223:    gitDiff: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:1:import { readFileSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:3:import { parseMarkdown, getHeadingAtLine, isNegatedSection } from "../markdown.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:7:const KNOWN_EXTENSIONS = /\.(ts|js|tsx|jsx|py|go|rs|rb|java|json|yaml|yml|toml|md|css|scss|html|vue|svelte|sh)$/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:40:    content = readFileSync(filePath, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:45:  const tree = parseMarkdown(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:1:import { readFileSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:3:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:6:import { parseFrontmatter } from "./frontmatter.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:11:import { checkStaleness } from "./checkers/staleness.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:38:    const frontmatter = parseFrontmatter(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:40:      ...checkEdges(frontmatter, filePath, source, projectRoot, scaffoldRoot)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:44:    const stalenessIssues = await checkStaleness(source, source, projectRoot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:45:    allIssues.push(...stalenessIssues);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:88:    const matches = globSync(pattern, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:99:      const matches = globSync(name, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:18:  ".git",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:43:    if (entry.startsWith(".") && entry !== ".github") continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:1:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:43:      const matches = globSync(pattern, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:45:        ignore: ["node_modules/**", "dist/**", "build/**", ".git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:34:  const briefJson = JSON.stringify(brief, null, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts:1:import { existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts:17:  return files.some((f) => existsSync(resolve(root, f)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts:71:  if (exists(root, "pnpm-lock.yaml")) return "pnpm";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts:4:  error: 10,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts:5:  warning: 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:12:/** Detect and parse the project manifest */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:16:    if (!existsSync(path)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:20:        return parsePackageJson(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:22:        return parsePyprojectStub(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:24:        return parseGoModStub(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:26:        return parseCargoStub(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:32:function parsePackageJson(path: string): ManifestInfo | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:34:    const raw = JSON.parse(readFileSync(path, "utf-8"));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:48:// Stub parsers for other manifests — extend later
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:49:function parsePyprojectStub(path: string): ManifestInfo {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:50:  const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:63:function parseGoModStub(path: string): ManifestInfo {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:64:  const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:76:function parseCargoStub(path: string): ManifestInfo {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:77:  const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:10:    if (existsSync(path)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:12:        const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts:1:import { readFileSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts:5:/** Read a scaffold file and extract its YAML frontmatter */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts:6:export function parseFrontmatter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts:10:    const content = readFileSync(filePath, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:1:import { readFileSync, readdirSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:3:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:4:import { getGitDiff } from "../git.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:49:    fileContent = readFileSync(filePath, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:58:  // Get git diff for paths referenced by this file's claims
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:65:    : target.gitDiff ?? "";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:90:**Recent git changes in referenced paths:**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:123:      if (existsSync(absDir)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:141:      const matches = globSync(`**/*.${ext}`, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:143:        ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:34:  const briefJson = JSON.stringify(brief, null, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:2:import { spawnSync } from "node:child_process";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:19:  const result = spawnSync("claude", [brief], {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:65:            (other) => other.file === i.file && other.severity === "error"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:73:          "No errors found. Only warnings remain (use --warnings to include them)."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:86:      const errors = target.issues.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:87:        (i) => i.severity === "error"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:89:      const warnings = target.issues.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:90:        (i) => i.severity === "warning"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:93:        `  ${target.file} — ${errors} errors, ${warnings} warnings`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:173:      (i) => i.severity === "error"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:176:      (i) => i.severity === "warning"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:183:            `${remainingWarnings} warning(s) remain (use --warnings to include them).`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:223:    gitDiff: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:30:          severity: "error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:47:          severity: "error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:64:  if (!existsSync(pkgPath)) return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:66:    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:75:  if (!existsSync(makePath)) return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:77:    const content = readFileSync(makePath, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:37:For each file, add or update the edges array in the YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:71:.mex/context/payments.md. Use the same YAML frontmatter format (name,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:112:frontmatter format (name, description, triggers, edges, last_updated).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:139:For each file, add or update the edges array in the YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:3:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:10:  if (!existsSync(patternsDir)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:15:  if (!existsSync(indexPath)) return [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:16:  if (!existsSync(patternsDir)) return [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:21:  const patternFiles = globSync("*.md", { cwd: patternsDir, ignore: ["node_modules/**"] })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:25:  const rawContent = readFileSync(indexPath, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:46:        severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:57:    if (!existsSync(refPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:60:        severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:1:import { existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:5:/** Check that all YAML frontmatter edge targets exist */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:7:  frontmatter: ScaffoldFrontmatter | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:13:  if (!frontmatter?.edges) return [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:17:  for (const edge of frontmatter.edges) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:23:    if (!existsSync(fromProject) && !existsSync(fromScaffold)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:26:        severity: "error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts:1:import { daysSinceLastChange, commitsSinceLastChange } from "../../git.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts:9:/** Check how stale a scaffold file is based on git history */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts:23:      severity: "error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts:31:      severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts:41:      severity: "error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts:49:      severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:1:import { existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:3:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:22:    // Downgrade to warning if: from a pattern file or path contains placeholder words.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:26:    const severity = isPattern || isPlaceholder ? "warning" : "error";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:43:  if (existsSync(resolve(projectRoot, value))) return true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:47:    if (existsSync(resolve(scaffoldRoot, value))) return true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:54:    if (existsSync(resolve(projectRoot, withoutPrefix))) return true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:59:    const matches = globSync(`**/${value}`, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:61:      ignore: ["node_modules/**", ".mex/**", "dist/**", ".git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:18:  ".git",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:43:    if (entry.startsWith(".") && entry !== ".github") continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:10:    if (existsSync(path)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:12:        const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:1:import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:5:import { execSync, spawn } from "node:child_process";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:7:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:46:  "4": { src: ".tool-configs/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:61:    if (existsSync(resolve(current, ".git"))) return current;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:108:  if (!existsSync(TEMPLATES_DIR)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:109:    throw new Error(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:118:  if (existsSync(resolve(projectRoot, "src", "setup", "index.ts"))) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:120:    if (existsSync(pkg)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:121:      const pkgContent = readFileSync(pkg, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:123:        throw new Error(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:159:    if (existsSync(dest)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:160:      const existingContent = readFileSync(dest, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:161:      const templateContent = readFileSync(src, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:202:      scannerBrief = JSON.stringify(result, null, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:278:  if (existsSync(agentsMd)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:279:    const content = readFileSync(agentsMd, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:289:  const sourceFiles = globSync(patterns, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:291:    ignore: ["**/node_modules/**", "**/.mex/**", "**/vendor/**", "**/.git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:336:      if (existsSync(dest)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:344:    if (existsSync(dest)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:385:    execSync("which claude", { stdio: "ignore" });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:394:    const child = spawn("claude", [prompt], {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:404:    child.on("error", (err) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:424:        execSync("npm install -g promexeus", { stdio: "inherit" });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:12:/** Detect and parse the project manifest */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:16:    if (!existsSync(path)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:20:        return parsePackageJson(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:22:        return parsePyprojectStub(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:24:        return parseGoModStub(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:26:        return parseCargoStub(path);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:32:function parsePackageJson(path: string): ManifestInfo | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:34:    const raw = JSON.parse(readFileSync(path, "utf-8"));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:48:// Stub parsers for other manifests — extend later
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:49:function parsePyprojectStub(path: string): ManifestInfo {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:50:  const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:63:function parseGoModStub(path: string): ManifestInfo {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:64:  const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:76:function parseCargoStub(path: string): ManifestInfo {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:77:  const content = readFileSync(path, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:34:  "git", "github", "gitlab", "ci/cd", "nginx", "apache", "caddy",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:67:        severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:90:        severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:112:  if (existsSync(pkgPath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:114:      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:1:import { readFileSync, existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:38:        return readFileSync(f, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:69:        severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:82:  if (!existsSync(pkgPath)) return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:84:    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts:28:        severity: "error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts:61:        severity: "warning",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:37:For each file, add or update the edges array in the YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:71:.mex/context/payments.md. Use the same YAML frontmatter format (name,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:112:frontmatter format (name, description, triggers, edges, last_updated).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:139:For each file, add or update the edges array in the YAML frontmatter.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:1:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:43:      const matches = globSync(pattern, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:45:        ignore: ["node_modules/**", "dist/**", "build/**", ".git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts:1:import { existsSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts:17:  return files.some((f) => existsSync(resolve(root, f)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts:71:  if (exists(root, "pnpm-lock.yaml")) return "pnpm";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:1:import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:5:import { execSync, spawn } from "node:child_process";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:7:import { globSync } from "glob";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:46:  "4": { src: ".tool-configs/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:61:    if (existsSync(resolve(current, ".git"))) return current;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:108:  if (!existsSync(TEMPLATES_DIR)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:109:    throw new Error(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:118:  if (existsSync(resolve(projectRoot, "src", "setup", "index.ts"))) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:120:    if (existsSync(pkg)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:121:      const pkgContent = readFileSync(pkg, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:123:        throw new Error(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:159:    if (existsSync(dest)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:160:      const existingContent = readFileSync(dest, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:161:      const templateContent = readFileSync(src, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:202:      scannerBrief = JSON.stringify(result, null, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:278:  if (existsSync(agentsMd)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:279:    const content = readFileSync(agentsMd, "utf-8");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:289:  const sourceFiles = globSync(patterns, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:291:    ignore: ["**/node_modules/**", "**/.mex/**", "**/vendor/**", "**/.git/**"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:336:      if (existsSync(dest)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:344:    if (existsSync(dest)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:385:    execSync("which claude", { stdio: "ignore" });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:394:    const child = spawn("claude", [prompt], {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:404:    child.on("error", (err) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:424:        execSync("npm install -g promexeus", { stdio: "inherit" });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:1:import simpleGit, { type SimpleGit, type LogResult } from "simple-git";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:3:let _git: SimpleGit | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:6:  if (!_git || cwd) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:7:    _git = simpleGit(cwd ?? process.cwd());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:9:  return _git;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:12:/** Get days since a file was last modified in git */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:18:    const git = getGit(cwd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:19:    const log = await git.log({ file: filePath, maxCount: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:37:    const git = getGit(cwd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:38:    const fileLog = await git.log({ file: filePath, maxCount: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:41:    const allLog = await git.log();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:52:/** Get git diff for specific paths */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:58:    const git = getGit(cwd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:59:    return await git.diff(["HEAD~5", "HEAD", "--", ...paths]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:65:/** Get full git log */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:70:  const git = getGit(cwd);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:71:  return git.log({ maxCount });

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The sync path confirms two distinct classes of risk: several git/process failures are intentionally swallowed into “best effort” context, while the main repair loop treats a timed-out Claude run as potentially successful because `status === null` is accepted. I’m drilling into the checker implementations and parser code now, since that’s where corruption tolerance and false-positive boundaries are defined.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import { visit } from "unist-util-visit";
import YAML from "yaml";
import type { ScaffoldFrontmatter } from "./types.js";
import type { Root, Content } from "mdast";

const parser = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]);

/** Parse markdown string into AST */
export function parseMarkdown(content: string): Root {
  return parser.parse(content);
}

/** Extract YAML frontmatter from markdown content */
export function extractFrontmatter(
  content: string
): ScaffoldFrontmatter | null {
  const tree = parseMarkdown(content);
  let frontmatter: ScaffoldFrontmatter | null = null;

  visit(tree, "yaml", (node: { value: string }) => {
    try {
      frontmatter = YAML.parse(node.value) as ScaffoldFrontmatter;
    } catch {
      // Invalid YAML — skip
    }
  });

  return frontmatter;
}

/** Get the current heading context for a given line position */
export function getHeadingAtLine(
  tree: Root,
  line: number
): string | null {
  let currentHeading: string | null = null;

  for (const node of tree.children) {
    if (!node.position) continue;
    if (node.position.start.line > line) break;
    if (node.type === "heading") {
      currentHeading = getTextContent(node);
    }
  }

  return currentHeading;
}

/** Extract plain text from an AST node */
export function getTextContent(node: Content | Root): string {
  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }
  if ("children" in node) {
    return (node.children as Content[]).map(getTextContent).join("");
  }
  return "";
}

/** Check if a heading or its ancestors suggest negation */
export function isNegatedSection(heading: string | null): boolean {
  if (!heading) return false;
  const lower = heading.toLowerCase();
  return (
    lower.includes("not exist") ||
    lower.includes("not use") ||
    lower.includes("deliberately not") ||
    lower.includes("excluded") ||
    lower.includes("removed") ||
    lower.includes("deprecated")
  );
}

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "sed -n '1,280p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,280p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,280p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,280p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '261,520p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    console.log();
    console.log(prompt);
    console.log();
    console.log("─────────────────── COPY ABOVE THIS LINE ───────────────────");
    console.log();
    ok("Paste the prompt above into your agent to populate the scaffold.");
  }

  await promptGlobalInstall();
}

// ── Step functions ──

function detectProjectState(projectRoot: string, mexDir: string): ProjectState {
  // Check if scaffold is already partially populated
  const agentsMd = resolve(mexDir, "AGENTS.md");
  let scaffoldPopulated = false;
  if (existsSync(agentsMd)) {
    const content = readFileSync(agentsMd, "utf-8");
    if (!content.includes("[Project Name]")) {
      scaffoldPopulated = true;
    }
  }

  // Count source files
  const patterns = SOURCE_EXTENSIONS.map(
    (ext) => `**/${ext}`
  );
  const sourceFiles = globSync(patterns, {
    cwd: projectRoot,
    ignore: ["**/node_modules/**", "**/.mex/**", "**/vendor/**", "**/.git/**"],
    maxDepth: 4,
    nodir: true,
  });

  if (scaffoldPopulated && sourceFiles.length > 0) {
    return "partial";
  } else if (sourceFiles.length > 3) {
    return "existing";
  } else {
    return "fresh";
  }
}

async function selectToolConfig(
  rl: ReturnType<typeof createInterface>,
  projectRoot: string,
  dryRun: boolean,
): Promise<boolean> {
  header("Which AI tool do you use?");
  console.log();
  console.log("  1) Claude Code");
  console.log("  2) Cursor");
  console.log("  3) Windsurf");
  console.log("  4) GitHub Copilot");
  console.log("  5) OpenCode");
  console.log("  6) Codex (OpenAI)");
  console.log("  7) Multiple (select next)");
  console.log("  8) None / skip");
  console.log();

  const choice = (await rl.question("Choice [1-8] (default: 1): ")).trim() || "1";

  let selectedClaude = false;

  const copyConfig = (key: string) => {
    const config = TOOL_CONFIGS[key];
    if (!config) return;

    if (key === "1") selectedClaude = true;

    const src = resolve(TEMPLATES_DIR, config.src);
    const dest = resolve(projectRoot, config.dest);

    if (dryRun) {
      if (existsSync(dest)) {
        warn(`(dry run) Would overwrite ${config.dest}`);
      } else {
        ok(`(dry run) Would copy ${config.dest}`);
      }
      return;
    }

    if (existsSync(dest)) {
      // Can't ask interactively here since we already have rl,
      // so just warn and skip
      warn(`${config.dest} already exists — skipped (delete it first to replace)`);
      return;
    }

    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    ok(`Copied ${config.dest}`);
  };

  switch (choice) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
      copyConfig(choice);
      break;
    case "7": {
      const multi = (await rl.question("Enter tool numbers separated by spaces (e.g. 1 2 5): ")).trim();
      for (const c of multi.split(/\s+/)) {
        copyConfig(c);
      }
      break;
    }
    case "8":
      info("Skipped tool config — AGENTS.md in .mex/ works with any tool that can read files");
      break;
    default:
      warn("Unknown choice, skipping tool config");
      break;
  }

  return selectedClaude;
}

function hasClaudeCli(): boolean {
  try {
    execSync("which claude", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function launchClaude(prompt: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("claude", [prompt], {
      stdio: "inherit",
      shell: false,
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Claude exited with code ${code}`));
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to launch Claude: ${err.message}`));
    });
  });
}

async function promptGlobalInstall(): Promise<void> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    header("One more thing");
    console.log();
    info("Install mex globally so `mex check` works anywhere?");
    console.log();

    const answer = (await rl.question("  Install mex globally? [Y/n] ")).trim().toLowerCase();

    if (answer === "" || answer === "y" || answer === "yes") {
      console.log();
      info("Installing promexeus globally...");
      try {
        execSync("npm install -g promexeus", { stdio: "inherit" });
        console.log();
        ok("Installed globally. `mex check` and `mex sync` work from anywhere now.");
        printNextSteps(true);
      } catch {
        console.log();
        warn("Global install failed. You can retry manually:");
        console.log("    npm install -g promexeus");
        console.log();
        printNextSteps(false);
      }
    } else {
      console.log();
      info("No problem. You can always install later:");
      console.log("    npm install -g promexeus");
      console.log();
      printNextSteps(false);
    }
  } finally {
    rl.close();
  }
}

function printNextSteps(globalInstalled: boolean) {
  header("What's next");
  console.log();
  info("Verify — start a fresh session and ask:");
  console.log('    "Read .mex/ROUTER.md and tell me what you know about this project."');
  console.log();

  if (globalInstalled) {
    info("Ongoing commands:");
    console.log("    mex check              Drift score — are scaffold files still accurate?");
    console.log("    mex check --quiet      One-liner drift score");
    console.log("    mex sync               Fix drift — AI updates only what's broken");
    console.log("    mex watch              Auto-check drift after every commit");
  } else {
    info("Ongoing commands (via npx):");
    console.log("    npx promexeus check              Drift score — are scaffold files still accurate?");
    console.log("    npx promexeus check --quiet      One-liner drift score");
    console.log("    npx promexeus sync               Fix drift — AI updates only what's broken");
    console.log("    npx promexeus watch              Auto-check drift after every commit");
    console.log();
    info("Or install globally to use the shorter `mex` command:");
    console.log("    npm install -g promexeus");
  }
  console.log();
}

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { execSync, spawn } from "node:child_process";
import { stdin, stdout } from "node:process";
import { globSync } from "glob";
import chalk from "chalk";
import {
  buildFreshPrompt,
  buildExistingWithBriefPrompt,
  buildExistingNoBriefPrompt,
} from "./prompts.js";

// ── Constants ──

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = resolve(__dirname, "../templates");

const SOURCE_EXTENSIONS = [
  "*.py", "*.js", "*.ts", "*.tsx", "*.jsx", "*.go", "*.rs", "*.java",
  "*.kt", "*.swift", "*.rb", "*.php", "*.c", "*.cpp", "*.cs", "*.ex",
  "*.exs", "*.zig", "*.lua", "*.dart", "*.scala", "*.clj", "*.erl",
  "*.hs", "*.ml", "*.vue", "*.svelte",
];

const SCAFFOLD_FILES = [
  "ROUTER.md",
  "AGENTS.md",
  "SETUP.md",
  "SYNC.md",
  "context/architecture.md",
  "context/stack.md",
  "context/conventions.md",
  "context/decisions.md",
  "context/setup.md",
  "patterns/README.md",
  "patterns/INDEX.md",
];

const TOOL_CONFIGS: Record<string, { src: string; dest: string }> = {
  "1": { src: ".tool-configs/CLAUDE.md", dest: "CLAUDE.md" },
  "2": { src: ".tool-configs/.cursorrules", dest: ".cursorrules" },
  "3": { src: ".tool-configs/.windsurfrules", dest: ".windsurfrules" },
  "4": { src: ".tool-configs/copilot-instructions.md", dest: ".github/copilot-instructions.md" },
  "5": { src: ".tool-configs/opencode.json", dest: ".opencode/opencode.json" },
  "6": { src: ".tool-configs/CLAUDE.md", dest: "AGENTS.md" },  // Codex reads AGENTS.md at root
};

// ── Helpers ──

const ok = (msg: string) => console.log(`${chalk.green("✓")} ${msg}`);
const info = (msg: string) => console.log(`${chalk.blue("→")} ${msg}`);
const warn = (msg: string) => console.log(`${chalk.yellow("!")} ${msg}`);
const header = (msg: string) => console.log(`\n${chalk.bold(msg)}`);

function findProjectRoot(): string {
  let current = resolve(process.cwd());
  while (true) {
    if (existsSync(resolve(current, ".git"))) return current;
    const parent = dirname(current);
    if (parent === current) return process.cwd();
    current = parent;
  }
}

function isTemplateContent(content: string): boolean {
  return content.includes("[Project Name]") || content.includes("[YYYY-MM-DD]");
}

function banner() {
  const GRN = "\x1b[38;2;91;140;90m";
  const DGR = "\x1b[38;2;74;122;73m";
  const ORN = "\x1b[38;2;232;132;92m";
  const DRK = "\x1b[38;2;61;61;61m";
  const ROYAL = "\x1b[38;2;25;68;241m";
  const NC = "\x1b[0m";
  const BOLD = "\x1b[1m";

  console.log();
  console.log(`${GRN}     ████      ${ROYAL}███╗   ███╗███████╗██╗  ██╗${NC}`);
  console.log(`${GRN}    █${DGR}█${GRN}██${DGR}█${GRN}█     ${ROYAL}████╗ ████║██╔════╝╚██╗██╔╝${NC}`);
  console.log(`${ORN}  ██████████   ${ROYAL}██╔████╔██║█████╗   ╚███╔╝${NC}`);
  console.log(`${ORN}█ ██${DRK}██${ORN}██${DRK}██${ORN}██ █ ${ROYAL}██║╚██╔╝██║██╔══╝   ██╔██╗${NC}`);
  console.log(`${ORN}█ ██████████ █ ${ROYAL}██║ ╚═╝ ██║███████╗██╔╝ ██╗${NC}`);
  console.log(`${ORN}   █ █  █ █    ${ROYAL}╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝${NC}`);
  console.log();
  console.log(`               ${BOLD}universal ai context scaffold${NC}`);
}

// ── Main ──

type ProjectState = "existing" | "fresh" | "partial";

export async function runSetup(opts: { dryRun?: boolean } = {}): Promise<void> {
  const { dryRun = false } = opts;

  banner();
  console.log();

  if (dryRun) {
    warn("DRY RUN — no files will be created or modified");
    console.log();
  }

  // Verify templates directory exists (sanity check for npm package integrity)
  if (!existsSync(TEMPLATES_DIR)) {
    throw new Error(
      `Templates directory not found at ${TEMPLATES_DIR}. The promexeus package may be corrupted — try reinstalling.`
    );
  }

  const projectRoot = findProjectRoot();
  const mexDir = resolve(projectRoot, ".mex");

  // Guard: don't run inside the mex repo itself
  if (existsSync(resolve(projectRoot, "src", "setup", "index.ts"))) {
    const pkg = resolve(projectRoot, "package.json");
    if (existsSync(pkg)) {
      const pkgContent = readFileSync(pkg, "utf-8");
      if (pkgContent.includes('"promexeus"') || pkgContent.includes('"mex"')) {
        throw new Error(
          "You're inside the mex repository itself. Run this from your project root instead."
        );
      }
    }
  }

  // ── Step 1: Detect project state ──

  const state = detectProjectState(projectRoot, mexDir);

  switch (state) {
    case "existing":
      info("Detected: existing codebase with source files");
      info("Mode: populate scaffold from code");
      break;
    case "fresh":
      info("Detected: fresh project (no source files yet)");
      info("Mode: populate scaffold from intent");
      break;
    case "partial":
      info("Detected: existing codebase with partially populated scaffold");
      info("Mode: will populate empty slots, skip what's already filled");
      break;
  }
  console.log();

  // ── Step 2: Create .mex/ scaffold ──

  header("Creating .mex/ scaffold...");
  console.log();

  for (const file of SCAFFOLD_FILES) {
    const src = resolve(TEMPLATES_DIR, file);
    const dest = resolve(mexDir, file);

    if (existsSync(dest)) {
      const existingContent = readFileSync(dest, "utf-8");
      const templateContent = readFileSync(src, "utf-8");

      // Skip if file has been populated (no longer matches template markers)
      if (!isTemplateContent(existingContent) && existingContent !== templateContent) {
        info(`Skipped .mex/${file} (already populated)`);
        continue;
      }
    }

    if (dryRun) {
      ok(`(dry run) Would copy .mex/${file}`);
    } else {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(src, dest);
      ok(`Copied .mex/${file}`);
    }
  }
  console.log();

  // ── Step 3: Tool config selection ──

  let selectedClaude = false;

  const rl = createInterface({ input: stdin, output: stdout });
  try {
    selectedClaude = await selectToolConfig(rl, projectRoot, dryRun);
  } finally {
    rl.close();
  }
  console.log();

  // ── Step 4: Run scanner (if not fresh) ──

  let scannerBrief: string | null = null;

  if (state !== "fresh") {
    try {
      info("Scanning codebase...");
      const { runScan } = await import("../scanner/index.js");
      const config = { projectRoot, scaffoldRoot: mexDir };
      const result = await runScan(config, { jsonOnly: true });
      scannerBrief = JSON.stringify(result, null, 2);
      ok("Pre-analysis complete — AI will reason from brief instead of exploring");
    } catch {
      warn("Scanner failed — AI will explore the filesystem directly");
    }
  }

  // ── Step 5: Build population prompt ──

  let prompt: string;
  if (state === "fresh") {
    prompt = buildFreshPrompt();
  } else if (scannerBrief) {
    prompt = buildExistingWithBriefPrompt(scannerBrief);
  } else {
    prompt = buildExistingNoBriefPrompt();
  }

  // ── Step 6: Run or print ──

  if (dryRun) {
    header("Would run population prompt (dry run — skipping)");
    console.log();
    ok("Done (dry run).");
    return;
  }

  const hasClaude = hasClaudeCli();

  if (selectedClaude && hasClaude) {
    header("Launching Claude Code to populate the scaffold...");
    console.log();
    info("An interactive Claude Code session will open with the population prompt.");
    info("You'll see the agent working in real-time.");
    console.log();

    await launchClaude(prompt);

    console.log();
    ok("Setup complete.");
    await promptGlobalInstall();
    return;
  } else {
    header("Almost done. One more step — populate the scaffold.");
    console.log();

    if (hasClaude) {
      info("You can run this directly with Claude Code:");
      console.log();
      console.log("  claude -p '<the prompt below>'");
      console.log();
      info("Or paste the prompt below into your AI tool.");
    } else {
      info("Paste the prompt below into your AI tool.");
      info("The agent will read your codebase and fill every scaffold file.");
    }

    console.log();
    console.log("─────────────────── COPY BELOW THIS LINE ───────────────────");

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  mkdtempSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { checkPaths } from "../src/drift/checkers/path.js";
import { checkEdges } from "../src/drift/checkers/edges.js";
import { checkCommands } from "../src/drift/checkers/command.js";
import { checkDependencies } from "../src/drift/checkers/dependency.js";
import { checkCrossFile } from "../src/drift/checkers/cross-file.js";
import { checkIndexSync } from "../src/drift/checkers/index-sync.js";
import type { Claim, ScaffoldFrontmatter } from "../src/types.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "mex-checker-"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function claim(overrides: Partial<Claim> & { kind: Claim["kind"]; value: string }): Claim {
  return {
    source: "test.md",
    line: 1,
    section: null,
    negated: false,
    ...overrides,
  };
}

// ── Path Checker ──

describe("checkPaths", () => {
  it("reports missing paths", () => {
    const claims = [claim({ kind: "path", value: "src/missing.ts" })];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("MISSING_PATH");
  });

  it("passes for existing paths", () => {
    mkdirSync(join(tmpDir, "src"), { recursive: true });
    writeFileSync(join(tmpDir, "src/index.ts"), "");
    const claims = [claim({ kind: "path", value: "src/index.ts" })];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("skips negated claims", () => {
    const claims = [
      claim({ kind: "path", value: "src/missing.ts", negated: true }),
    ];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("resolves .mex/ prefixed paths to root", () => {
    writeFileSync(join(tmpDir, "ROUTER.md"), "# Router");
    const claims = [claim({ kind: "path", value: ".mex/ROUTER.md" })];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("resolves paths relative to scaffoldRoot when deployed as .mex/", () => {
    const mexDir = join(tmpDir, ".mex");
    mkdirSync(join(mexDir, "context"), { recursive: true });
    writeFileSync(join(mexDir, "context/architecture.md"), "# Arch");
    const claims = [claim({ kind: "path", value: "context/architecture.md" })];
    const issues = checkPaths(claims, tmpDir, mexDir);
    expect(issues).toHaveLength(0);
  });

  it("downgrades to warning for paths from pattern files", () => {
    const claims = [claim({ kind: "path", value: "src/missing.ts", source: "patterns/add-feature.md" })];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe("warning");
  });

  it("downgrades to warning for paths with placeholder words", () => {
    const claims = [
      claim({ kind: "path", value: "api_clients/new_service_client.py" }),
      claim({ kind: "path", value: "src/example_module.ts" }),
      claim({ kind: "path", value: "lib/your_config.json" }),
    ];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(3);
    for (const issue of issues) {
      expect(issue.severity).toBe("warning");
    }
  });

  it("reports error for bare filenames not found anywhere", () => {
    const claims = [
      claim({ kind: "path", value: "conversation_state.py", source: "context/architecture.md" }),
      claim({ kind: "path", value: "server.py", source: "context/architecture.md" }),
    ];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(2);
    for (const issue of issues) {
      expect(issue.severity).toBe("error");
    }
  });

  it("keeps error severity for real missing paths with directories", () => {
    const claims = [claim({ kind: "path", value: "src/auth/handler.ts", source: "context/architecture.md" })];
    const issues = checkPaths(claims, tmpDir, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe("error");
  });
});

// ── Edges Checker ──

describe("checkEdges", () => {
  it("reports dead edge targets", () => {
    const fm: ScaffoldFrontmatter = {
      edges: [{ target: "context/missing.md" }],
    };
    const issues = checkEdges(fm, "router.md", "ROUTER.md", tmpDir, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("DEAD_EDGE");
  });

  it("passes for existing edge targets", () => {
    mkdirSync(join(tmpDir, "context"), { recursive: true });
    writeFileSync(join(tmpDir, "context/arch.md"), "");
    const fm: ScaffoldFrontmatter = {
      edges: [{ target: "context/arch.md" }],
    };
    const issues = checkEdges(fm, "router.md", "ROUTER.md", tmpDir, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("resolves edge targets relative to scaffoldRoot", () => {
    const mexDir = join(tmpDir, ".mex");
    mkdirSync(join(mexDir, "context"), { recursive: true });
    writeFileSync(join(mexDir, "context/stack.md"), "");
    const fm: ScaffoldFrontmatter = {
      edges: [{ target: "context/stack.md" }],
    };
    const issues = checkEdges(fm, "router.md", "ROUTER.md", tmpDir, mexDir);
    expect(issues).toHaveLength(0);
  });

  it("returns empty for no frontmatter", () => {
    expect(checkEdges(null, "f", "f", tmpDir, tmpDir)).toEqual([]);
  });

  it("returns empty for no edges", () => {
    expect(checkEdges({ name: "test" }, "f", "f", tmpDir, tmpDir)).toEqual([]);
  });
});

// ── Command Checker ──

describe("checkCommands", () => {
  it("reports dead npm scripts", () => {
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({ scripts: { build: "tsc" } })
    );
    const claims = [claim({ kind: "command", value: "npm run test" })];
    const issues = checkCommands(claims, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("DEAD_COMMAND");
  });

  it("passes for existing npm scripts", () => {
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({ scripts: { build: "tsc", test: "vitest" } })
    );
    const claims = [
      claim({ kind: "command", value: "npm run build" }),
      claim({ kind: "command", value: "npm run test" }),
    ];
    const issues = checkCommands(claims, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("reports dead make targets", () => {
    writeFileSync(join(tmpDir, "Makefile"), "build:\n\tgcc main.c\n");
    const claims = [claim({ kind: "command", value: "make deploy" })];
    const issues = checkCommands(claims, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("DEAD_COMMAND");
  });

  it("skips when no manifest exists", () => {
    const claims = [claim({ kind: "command", value: "npm run build" })];
    const issues = checkCommands(claims, tmpDir);
    expect(issues).toHaveLength(0);
  });
});

// ── Dependency Checker ──

describe("checkDependencies", () => {
  it("reports missing dependencies", () => {
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { express: "^4.18.0" } })
    );
    const claims = [claim({ kind: "dependency", value: "Prisma" })];
    const issues = checkDependencies(claims, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("DEPENDENCY_MISSING");
  });

  it("passes for existing dependencies (case-insensitive)", () => {
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { express: "^4.18.0" } })
    );
    const claims = [claim({ kind: "dependency", value: "Express" })];
    const issues = checkDependencies(claims, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("returns empty when no manifest exists", () => {
    const claims = [claim({ kind: "dependency", value: "Express" })];
    const issues = checkDependencies(claims, tmpDir);
    expect(issues).toHaveLength(0);
  });
});

// ── Cross-file Checker ──

describe("checkCrossFile", () => {
  it("detects conflicting versions across files", () => {
    const claims = [
      claim({ kind: "version", value: "React 18", source: "stack.md" }),
      claim({ kind: "version", value: "React 17", source: "arch.md" }),
    ];
    const issues = checkCrossFile(claims);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("CROSS_FILE_CONFLICT");
  });

  it("no conflict for same version across files", () => {
    const claims = [
      claim({ kind: "version", value: "React 18", source: "stack.md" }),
      claim({ kind: "version", value: "React 18", source: "arch.md" }),
    ];
    const issues = checkCrossFile(claims);
    expect(issues).toHaveLength(0);
  });
});

// ── Index Sync Checker ──

describe("checkIndexSync", () => {

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { findConfig } from "../src/config.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "mex-config-"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("findConfig", () => {
  it("throws when you run it from inside the .mex/ folder", () => {
    const mexPath = join(tmpDir, ".mex");
    mkdirSync(mexPath);
    expect(() => findConfig(mexPath)).toThrow("You're inside the .mex/ directory");
  });

  it("throws when no git repository is found", () => {
    expect(() => findConfig(tmpDir)).toThrow("No git repository found");
  });

  it("throws when scaffold directory exists but looks incomplete", () => {
    mkdirSync(join(tmpDir, ".git"));
    mkdirSync(join(tmpDir, ".mex"));
    expect(() => findConfig(tmpDir)).toThrow("Scaffold directory exists but looks incomplete");
  });

  it("throws when no .mex/ scaffold found at all", () => {
    mkdirSync(join(tmpDir, ".git"));
    expect(() => findConfig(tmpDir)).toThrow("No .mex/ scaffold found. Run: mex setup");
  });

  it("works without .git if a complete scaffold exists", () => {
    const mexPath = join(tmpDir, ".mex");
    mkdirSync(mexPath);
    writeFileSync(join(mexPath, "ROUTER.md"), "");
    
    const config = findConfig(tmpDir);
    expect(config.projectRoot).toBe(tmpDir);
    expect(config.scaffoldRoot).toBe(mexPath);
  });

  it("finds scaffold with context/ directory", () => {
    mkdirSync(join(tmpDir, ".git"));
    mkdirSync(join(tmpDir, "context"));
    const config = findConfig(tmpDir);
    expect(config.projectRoot).toBe(tmpDir);
    expect(config.scaffoldRoot).toBe(tmpDir);
  });

  it("prefers .mex/ over context/", () => {
    mkdirSync(join(tmpDir, ".git"));
    const mexPath = join(tmpDir, ".mex");
    mkdirSync(mexPath);
    writeFileSync(join(mexPath, "ROUTER.md"), "");
    mkdirSync(join(tmpDir, "context"));
    const config = findConfig(tmpDir);
    expect(config.scaffoldRoot).toBe(mexPath);
  });
});

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { extractClaims } from "../src/drift/claims.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "mex-test-"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function writeFixture(name: string, content: string): string {
  const path = join(tmpDir, name);
  writeFileSync(path, content);
  return path;
}

describe("extractClaims — paths", () => {
  it("extracts inline code paths with slashes", () => {
    const path = writeFixture(
      "test.md",
      "# Setup\n\nRun from `src/index.ts` to start."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(1);
    expect(paths[0].value).toBe("src/index.ts");
  });

  it("extracts paths with directory + known extension", () => {
    const path = writeFixture(
      "test.md",
      "# Files\n\nSee `src/config.json` and `lib/app.py`."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(2);
    expect(paths.map((p) => p.value)).toContain("src/config.json");
    expect(paths.map((p) => p.value)).toContain("lib/app.py");
  });

  it("skips template placeholders with angle brackets", () => {
    const path = writeFixture(
      "test.md",
      "# Patterns\n\nCreate `patterns/<name>.md` for each task."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(0);
  });

  it("skips template placeholders with square brackets", () => {
    const path = writeFixture(
      "test.md",
      "# Files\n\nSee `src/[slug].tsx` for dynamic routes."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(0);
  });

  it("skips URL routes without file extensions", () => {
    const path = writeFixture(
      "test.md",
      "# Routes\n\nEndpoints: `/voice/incoming`, `/voice/process`, `/api/users`."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(0);
  });

  it("skips code snippets with parentheses or equals", () => {
    const path = writeFixture(
      "test.md",
      "# Code\n\nUse `response.redirect(\"/next\")` and `base_url: str = os.getenv(\"FOO\")`."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(0);
  });

  it("skips wildcard patterns like *_client.py", () => {
    const path = writeFixture(
      "test.md",
      "# Clients\n\nAll files matching `*_streaming_client.py`."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(0);
  });

  it("extracts bare filenames as path claims", () => {
    const path = writeFixture(
      "test.md",
      "# Files\n\nSee `pipeline.py` and `server.py` for details."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(2);
    expect(paths.map((p) => p.value)).toContain("pipeline.py");
    expect(paths.map((p) => p.value)).toContain("server.py");
  });

  it("still extracts paths with directory separators", () => {
    const path = writeFixture(
      "test.md",
      "# Files\n\nSee `api_clients/groq_client.py` for the implementation."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(1);
    expect(paths[0].value).toBe("api_clients/groq_client.py");
  });

  it("marks paths under negated sections", () => {
    const path = writeFixture(
      "test.md",
      "# What Does NOT Exist\n\nWe don't have `src/admin/` yet."
    );
    const claims = extractClaims(path, "test.md");
    const paths = claims.filter((c) => c.kind === "path");
    expect(paths).toHaveLength(1);
    expect(paths[0].negated).toBe(true);
  });
});

describe("extractClaims — commands", () => {
  it("extracts npm run commands from inline code", () => {
    const path = writeFixture(
      "test.md",
      "# Setup\n\nRun `npm run build` to compile."
    );
    const claims = extractClaims(path, "test.md");
    const cmds = claims.filter((c) => c.kind === "command");
    expect(cmds).toHaveLength(1);
    expect(cmds[0].value).toBe("npm run build");
  });

  it("extracts commands from code blocks", () => {
    const path = writeFixture(
      "test.md",
      "# Setup\n\n```sh\nnpm install\nnpm run dev\n```"
    );
    const claims = extractClaims(path, "test.md");
    const cmds = claims.filter((c) => c.kind === "command");
    expect(cmds).toHaveLength(2);
    expect(cmds.map((c) => c.value)).toContain("npm install");
    expect(cmds.map((c) => c.value)).toContain("npm run dev");
  });

  it("extracts yarn and pnpm commands", () => {
    const path = writeFixture(
      "test.md",
      "# Run\n\nUse `yarn test` or `pnpm build`."
    );
    const claims = extractClaims(path, "test.md");
    const cmds = claims.filter((c) => c.kind === "command");
    expect(cmds).toHaveLength(2);
  });

  it("extracts make commands", () => {
    const path = writeFixture(
      "test.md",
      "# Build\n\nRun `make deploy` to deploy."
    );
    const claims = extractClaims(path, "test.md");
    const cmds = claims.filter((c) => c.kind === "command");
    expect(cmds).toHaveLength(1);
    expect(cmds[0].value).toBe("make deploy");
  });
});

describe("extractClaims — dependencies", () => {
  it("extracts bold dependency names under relevant sections", () => {
    const path = writeFixture(
      "test.md",
      "# Key Libraries\n\n- **Express** — web framework\n- **Prisma** — ORM"
    );
    const claims = extractClaims(path, "test.md");
    const deps = claims.filter((c) => c.kind === "dependency");
    expect(deps).toHaveLength(2);
    expect(deps.map((d) => d.value)).toContain("Express");
    expect(deps.map((d) => d.value)).toContain("Prisma");
  });

  it("extracts version claims from bold patterns", () => {
    const path = writeFixture(
      "test.md",
      "# Core Technologies\n\n- **React 18** — UI\n- **Node v20** — runtime"
    );
    const claims = extractClaims(path, "test.md");
    const versions = claims.filter((c) => c.kind === "version");
    expect(versions).toHaveLength(2);
    expect(versions.map((v) => v.value)).toContain("React 18");
    expect(versions.map((v) => v.value)).toContain("Node v20");
  });

  it("ignores bold text outside dependency sections", () => {
    const path = writeFixture(
      "test.md",
      "# Architecture\n\n**Important note** about the system."
    );
    const claims = extractClaims(path, "test.md");
    const deps = claims.filter((c) => c.kind === "dependency");
    expect(deps).toHaveLength(0);
  });
});

describe("extractClaims — returns empty for missing file", () => {
  it("returns empty array for nonexistent file", () => {
    const claims = extractClaims("/nonexistent/file.md", "missing.md");
    expect(claims).toEqual([]);
  });
});

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  mkdtempSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scanManifest } from "../src/scanner/manifest.js";
import { scanEntryPoints } from "../src/scanner/entry-points.js";
import { scanFolderTree } from "../src/scanner/folder-tree.js";
import { scanTooling } from "../src/scanner/tooling.js";
import { scanReadme } from "../src/scanner/readme.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "mex-scan-"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("scanManifest", () => {
  it("parses package.json", () => {
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({
        name: "my-app",
        version: "1.0.0",
        dependencies: { express: "^4.18.0" },
        devDependencies: { vitest: "^3.0.0" },
        scripts: { build: "tsc", test: "vitest" },
      })
    );
    const result = scanManifest(tmpDir);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("package.json");
    expect(result!.name).toBe("my-app");
    expect(result!.dependencies).toHaveProperty("express");
    expect(result!.scripts).toHaveProperty("build");
  });

  it("returns null when no manifest exists", () => {
    expect(scanManifest(tmpDir)).toBeNull();
  });
});

describe("scanEntryPoints", () => {
  it("finds src/index.ts as main entry", () => {
    mkdirSync(join(tmpDir, "src"), { recursive: true });
    writeFileSync(join(tmpDir, "src/index.ts"), "");
    const entries = scanEntryPoints(tmpDir);
    expect(entries.some((e) => e.path === "src/index.ts" && e.type === "main")).toBe(true);
  });

  it("finds config files", () => {
    writeFileSync(join(tmpDir, "tsconfig.json"), "{}");
    const entries = scanEntryPoints(tmpDir);
    expect(entries.some((e) => e.path === "tsconfig.json" && e.type === "config")).toBe(true);
  });

  it("returns empty for empty project", () => {
    expect(scanEntryPoints(tmpDir)).toEqual([]);
  });
});

describe("scanFolderTree", () => {
  it("categorizes known directory names", () => {
    mkdirSync(join(tmpDir, "routes"));
    mkdirSync(join(tmpDir, "models"));
    mkdirSync(join(tmpDir, "tests"));
    mkdirSync(join(tmpDir, "utils"));

    const tree = scanFolderTree(tmpDir);
    const names = tree.map((t) => t.category);
    expect(names).toContain("routes");
    expect(names).toContain("models");
    expect(names).toContain("tests");
    expect(names).toContain("utils");
  });

  it("ignores node_modules and .git", () => {
    mkdirSync(join(tmpDir, "node_modules"));
    mkdirSync(join(tmpDir, ".git"));
    mkdirSync(join(tmpDir, "src"));

    const tree = scanFolderTree(tmpDir);
    const names = tree.map((t) => t.name);
    expect(names).not.toContain("node_modules");
    expect(names).not.toContain(".git");
    expect(names).toContain("src");
  });
});

describe("scanTooling", () => {
  it("detects vitest", () => {
    writeFileSync(join(tmpDir, "vitest.config.ts"), "");
    const tooling = scanTooling(tmpDir);
    expect(tooling.testRunner).toBe("vitest");
  });

  it("detects eslint", () => {
    writeFileSync(join(tmpDir, "eslint.config.js"), "");
    const tooling = scanTooling(tmpDir);
    expect(tooling.linter).toBe("eslint");
  });

  it("detects package manager from lock files", () => {
    writeFileSync(join(tmpDir, "pnpm-lock.yaml"), "");
    const tooling = scanTooling(tmpDir);
    expect(tooling.packageManager).toBe("pnpm");
  });

  it("returns nulls for empty project", () => {
    const tooling = scanTooling(tmpDir);
    expect(tooling.testRunner).toBeNull();
    expect(tooling.buildTool).toBeNull();
    expect(tooling.linter).toBeNull();
    expect(tooling.packageManager).toBeNull();
  });
});

describe("scanReadme", () => {
  it("reads README.md content", () => {
    writeFileSync(join(tmpDir, "README.md"), "# My Project\n\nHello world");
    const result = scanReadme(tmpDir);
    expect(result).toContain("# My Project");
  });

  it("truncates long READMEs", () => {
    writeFileSync(join(tmpDir, "README.md"), "x".repeat(5000));
    const result = scanReadme(tmpDir);
    expect(result!.length).toBeLessThan(5000);
    expect(result).toContain("(truncated)");
  });

  it("returns null when no README exists", () => {
    expect(scanReadme(tmpDir)).toBeNull();
  });
});

 succeeded in 0ms:
import { describe, it, expect } from "vitest";
import { computeScore } from "../src/drift/scoring.js";
import type { DriftIssue } from "../src/types.js";

function issue(severity: DriftIssue["severity"]): DriftIssue {
  return {
    code: "MISSING_PATH",
    severity,
    file: "test.md",
    line: 1,
    message: "test",
  };
}

describe("computeScore", () => {
  it("returns 100 for no issues", () => {
    expect(computeScore([])).toBe(100);
  });

  it("deducts 10 per error", () => {
    expect(computeScore([issue("error")])).toBe(90);
    expect(computeScore([issue("error"), issue("error")])).toBe(80);
  });

  it("deducts 3 per warning", () => {
    expect(computeScore([issue("warning")])).toBe(97);
  });

  it("deducts 1 per info", () => {
    expect(computeScore([issue("info")])).toBe(99);
  });

  it("combines severities correctly", () => {
    const issues = [issue("error"), issue("warning"), issue("info")];
    expect(computeScore(issues)).toBe(86); // 100 - 10 - 3 - 1
  });

  it("clamps to 0 minimum", () => {
    const many = Array.from({ length: 15 }, () => issue("error"));
    expect(computeScore(many)).toBe(0);
  });
});

codex
I’ve got enough of the outer control flow now to see a recurring design choice: Mex prefers graceful degradation over explicit “scanner invalid” or “git unavailable” states, which keeps the CLI moving but also hides when its evidence model has silently narrowed. I’m grabbing line-numbered slices for the specific claims, parser, setup, and hook behaviors that look most relevant to corruption, migration, and scaling so the final write-up stays precise.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '220,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "name": "promexeus",
  "version": "0.3.1",
  "description": "CLI engine for mex scaffold — drift detection, pre-analysis, and targeted sync",
  "type": "module",
  "bin": {
    "mex": "./dist/cli.js"
  },
  "files": [
    "dist",
    "templates",
    "LICENSE",
    "README.md"
  ],
  "keywords": [
    "ai",
    "agents",
    "scaffold",
    "drift-detection",
    "documentation",
    "cli",
    "claude",
    "cursor",
    "copilot"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/theDakshJaitly/mex.git"
  },
  "author": "Daksh Jaitly",
  "license": "MIT",
  "homepage": "https://github.com/theDakshJaitly/mex#readme",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "chalk": "^5.4.1",
    "commander": "^13.1.0",
    "glob": "^11.0.1",
    "remark-frontmatter": "^5.0.0",
    "remark-parse": "^11.0.0",
    "simple-git": "^3.27.0",
    "unified": "^11.0.5",
    "unist-util-visit": "^5.0.0",
    "yaml": "^2.7.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsup": "^8.4.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}

 succeeded in 0ms:
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

codex
A bigger pattern is emerging around scale and portability: several surfaces advertise multi-language or generic scaffold support, but the actual validation and coverage logic still bottoms out in `package.json`, `Makefile`, shallow globbing, and small git windows. I’m checking the scanner modules next to separate “intended breadth” from the code’s real operating envelope.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,120p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '260,420p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
describe("checkIndexSync", () => {
  it("reports orphan entries in INDEX.md", () => {
    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
    writeFileSync(
      join(tmpDir, "patterns/INDEX.md"),
      "| [missing.md](missing.md) | A pattern |"
    );
    const issues = checkIndexSync(tmpDir, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("INDEX_ORPHAN_ENTRY");
  });

  it("reports pattern files missing from INDEX", () => {
    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
    writeFileSync(join(tmpDir, "patterns/INDEX.md"), "# Index\n\nEmpty.");
    writeFileSync(join(tmpDir, "patterns/auth.md"), "# Auth pattern");
    const issues = checkIndexSync(tmpDir, tmpDir);
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("INDEX_MISSING_ENTRY");
  });

  it("passes when INDEX and files match", () => {
    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
    writeFileSync(
      join(tmpDir, "patterns/INDEX.md"),
      "| [auth.md](auth.md) | Auth pattern |"
    );
    writeFileSync(join(tmpDir, "patterns/auth.md"), "# Auth");
    const issues = checkIndexSync(tmpDir, tmpDir);
    expect(issues).toHaveLength(0);
  });

  it("ignores references inside HTML comments", () => {
    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
    writeFileSync(
      join(tmpDir, "patterns/INDEX.md"),
      "<!-- [example.md](example.md) is a template -->\n\n| Pattern | Use when |\n|---|---|"
    );
    const issues = checkIndexSync(tmpDir, tmpDir);
    expect(issues).toHaveLength(0);
  });
});

web search: 
web search: 
codex
The test surface is reinforcing the same story: there’s decent coverage for claim extraction and checker heuristics, but I haven’t found equivalent tests around `sync`, `watch`, or the interactive setup/install path yet. I’m confirming that gap directly before I finalize the iteration report, because it changes how much trust we should place in the repair-plane ergonomics under failure.
exec
/bin/zsh -lc "rg -n \"describe\\(|it\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/*.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:40:describe("checkPaths", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:41:  it("reports missing paths", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:48:  it("passes for existing paths", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:56:  it("skips negated claims", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:64:  it("resolves .mex/ prefixed paths to root", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:71:  it("resolves paths relative to scaffoldRoot when deployed as .mex/", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:80:  it("downgrades to warning for paths from pattern files", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:87:  it("downgrades to warning for paths with placeholder words", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:100:  it("reports error for bare filenames not found anywhere", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:112:  it("keeps error severity for real missing paths with directories", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:122:describe("checkEdges", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:123:  it("reports dead edge targets", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:132:  it("passes for existing edge targets", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:142:  it("resolves edge targets relative to scaffoldRoot", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:153:  it("returns empty for no frontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:157:  it("returns empty for no edges", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:164:describe("checkCommands", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:165:  it("reports dead npm scripts", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:176:  it("passes for existing npm scripts", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:189:  it("reports dead make targets", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:197:  it("skips when no manifest exists", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:206:describe("checkDependencies", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:207:  it("reports missing dependencies", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:218:  it("passes for existing dependencies (case-insensitive)", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:228:  it("returns empty when no manifest exists", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:237:describe("checkCrossFile", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:238:  it("detects conflicting versions across files", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:248:  it("no conflict for same version across files", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:260:describe("checkIndexSync", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:261:  it("reports orphan entries in INDEX.md", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:272:  it("reports pattern files missing from INDEX", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:281:  it("passes when INDEX and files match", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:292:  it("ignores references inside HTML comments", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:23:describe("extractClaims — paths", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:24:  it("extracts inline code paths with slashes", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:35:  it("extracts paths with directory + known extension", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:47:  it("skips template placeholders with angle brackets", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:57:  it("skips template placeholders with square brackets", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:67:  it("skips URL routes without file extensions", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:77:  it("skips code snippets with parentheses or equals", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:87:  it("skips wildcard patterns like *_client.py", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:97:  it("extracts bare filenames as path claims", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:109:  it("still extracts paths with directory separators", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:120:  it("marks paths under negated sections", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:132:describe("extractClaims — commands", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:133:  it("extracts npm run commands from inline code", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:144:  it("extracts commands from code blocks", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:156:  it("extracts yarn and pnpm commands", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:166:  it("extracts make commands", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:178:describe("extractClaims — dependencies", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:179:  it("extracts bold dependency names under relevant sections", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:191:  it("extracts version claims from bold patterns", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:203:  it("ignores bold text outside dependency sections", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:214:describe("extractClaims — returns empty for missing file", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts:215:  it("returns empty array for nonexistent file", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:18:describe("runPatternAdd", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:19:  it("creates a new pattern file and index entry", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:33:  it("throws an error if pattern already exists", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:41:  it("creates pattern even if INDEX.md is missing", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:48:  it("throws an error for invalid pattern names", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:58:  it("appends to INDEX.md with a newline if it does not end with one", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:26:describe("scanManifest", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:27:  it("parses package.json", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:46:  it("returns null when no manifest exists", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:51:describe("scanEntryPoints", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:52:  it("finds src/index.ts as main entry", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:59:  it("finds config files", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:65:  it("returns empty for empty project", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:70:describe("scanFolderTree", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:71:  it("categorizes known directory names", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:85:  it("ignores node_modules and .git", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:98:describe("scanTooling", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:99:  it("detects vitest", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:105:  it("detects eslint", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:111:  it("detects package manager from lock files", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:117:  it("returns nulls for empty project", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:126:describe("scanReadme", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:127:  it("reads README.md content", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:133:  it("truncates long READMEs", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:140:  it("returns null when no README exists", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:9:describe("parseMarkdown", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:10:  it("parses basic markdown into AST", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:18:describe("extractFrontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:19:  it("extracts YAML frontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:37:  it("returns null for no frontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:41:  it("returns null for invalid YAML", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:49:describe("getHeadingAtLine", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:50:  it("returns the heading active at a given line", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:65:  it("returns null before any heading", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:71:describe("isNegatedSection", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:72:  it("detects negated headings", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:80:  it("does not flag normal headings", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:17:describe("findConfig", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:18:  it("throws when you run it from inside the .mex/ folder", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:24:  it("throws when no git repository is found", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:28:  it("throws when scaffold directory exists but looks incomplete", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:34:  it("throws when no .mex/ scaffold found at all", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:39:  it("works without .git if a complete scaffold exists", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:49:  it("finds scaffold with context/ directory", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:57:  it("prefers .mex/ over context/", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:15:describe("computeScore", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:16:  it("returns 100 for no issues", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:20:  it("deducts 10 per error", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:25:  it("deducts 3 per warning", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:29:  it("deducts 1 per info", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:33:  it("combines severities correctly", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts:38:  it("clamps to 0 minimum", () => {

exec
/bin/zsh -lc 'rg -n "watch|sync|setup|launchClaude|promptGlobalInstall|manageHook|runSync" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"describe\\(|it\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts:36:    expect(() => findConfig(tmpDir)).toThrow("No .mex/ scaffold found. Run: mex setup");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:15:import { checkIndexSync } from "../src/drift/checkers/index-sync.js";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:19:  it("creates a new pattern file and index entry", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:33:  it("throws an error if pattern already exists", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:41:  it("creates pattern even if INDEX.md is missing", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:48:  it("throws an error for invalid pattern names", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:58:  it("appends to INDEX.md with a newline if it does not end with one", async () => {

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:18:describe("runPatternAdd", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:19:  it("creates a new pattern file and index entry", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:33:  it("throws an error if pattern already exists", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:41:  it("creates pattern even if INDEX.md is missing", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:48:  it("throws an error for invalid pattern names", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts:58:  it("appends to INDEX.md with a newline if it does not end with one", async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:9:describe("parseMarkdown", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:10:  it("parses basic markdown into AST", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:18:describe("extractFrontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:19:  it("extracts YAML frontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:37:  it("returns null for no frontmatter", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:41:  it("returns null for invalid YAML", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:49:describe("getHeadingAtLine", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:50:  it("returns the heading active at a given line", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:65:  it("returns null before any heading", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:71:describe("isNegatedSection", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:72:  it("detects negated headings", () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:80:  it("does not flag normal headings", () => {

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runPatternAdd } from "../src/pattern/index.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "mex-pattern-"));
  mkdirSync(join(tmpDir, "patterns"));
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("runPatternAdd", () => {
  it("creates a new pattern file and index entry", async () => {
    writeFileSync(join(tmpDir, "patterns", "INDEX.md"), "| Pattern | Use when |\n|---|---|\n", "utf8");

    await runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my-pattern");

    const patternContent = readFileSync(join(tmpDir, "patterns", "my-pattern.md"), "utf8");
    expect(patternContent).toContain("name: my-pattern");
    expect(patternContent).toContain("# my-pattern");
    expect(patternContent).toContain("## Verify");

    const indexContent = readFileSync(join(tmpDir, "patterns", "INDEX.md"), "utf8");
    expect(indexContent).toContain("| [my-pattern.md](my-pattern.md) |");
  });

  it("throws an error if pattern already exists", async () => {
    writeFileSync(join(tmpDir, "patterns", "my-pattern.md"), "existing content", "utf8");

    await expect(
      runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my-pattern")
    ).rejects.toThrow("already exists");
  });

  it("creates pattern even if INDEX.md is missing", async () => {
    await runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my-pattern");

    const patternContent = readFileSync(join(tmpDir, "patterns", "my-pattern.md"), "utf8");
    expect(patternContent).toContain("name: my-pattern");
  });

  it("throws an error for invalid pattern names", async () => {
    await expect(
      runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "my pattern")
    ).rejects.toThrow("Invalid pattern name");

    await expect(
      runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "pattern!")
    ).rejects.toThrow("Invalid pattern name");
  });

  it("appends to INDEX.md with a newline if it does not end with one", async () => {
    writeFileSync(join(tmpDir, "patterns", "INDEX.md"), "| Pattern | Use when |", "utf8");

    await runPatternAdd({ projectRoot: tmpDir, scaffoldRoot: tmpDir }, "newline-pattern");

    const indexContent = readFileSync(join(tmpDir, "patterns", "INDEX.md"), "utf8");
    expect(indexContent).toBe("| Pattern | Use when |\n| [newline-pattern.md](newline-pattern.md) | [description] |\n");
  });
});

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
import { describe, it, expect } from "vitest";
import {
  parseMarkdown,
  extractFrontmatter,
  getHeadingAtLine,
  isNegatedSection,
} from "../src/markdown.js";

describe("parseMarkdown", () => {
  it("parses basic markdown into AST", () => {
    const tree = parseMarkdown("# Hello\n\nSome text");
    expect(tree.type).toBe("root");
    expect(tree.children.length).toBeGreaterThan(0);
    expect(tree.children[0].type).toBe("heading");
  });
});

describe("extractFrontmatter", () => {
  it("extracts YAML frontmatter", () => {
    const md = `---
name: test
description: a test file
edges:
  - target: context/foo.md
    condition: when doing foo
---

# Content`;
    const fm = extractFrontmatter(md);
    expect(fm).not.toBeNull();
    expect(fm!.name).toBe("test");
    expect(fm!.description).toBe("a test file");
    expect(fm!.edges).toHaveLength(1);
    expect(fm!.edges![0].target).toBe("context/foo.md");
  });

  it("returns null for no frontmatter", () => {
    expect(extractFrontmatter("# Just a heading")).toBeNull();
  });

  it("returns null for invalid YAML", () => {
    const md = `---
: broken: yaml: [
---`;
    expect(extractFrontmatter(md)).toBeNull();
  });
});

describe("getHeadingAtLine", () => {
  it("returns the heading active at a given line", () => {
    const tree = parseMarkdown(`# First

Some text

## Second

More text
`);
    expect(getHeadingAtLine(tree, 1)).toBe("First");
    expect(getHeadingAtLine(tree, 3)).toBe("First");
    expect(getHeadingAtLine(tree, 5)).toBe("Second");
    expect(getHeadingAtLine(tree, 7)).toBe("Second");
  });

  it("returns null before any heading", () => {
    const tree = parseMarkdown("No heading here\n\n# Late heading");
    expect(getHeadingAtLine(tree, 1)).toBeNull();
  });
});

describe("isNegatedSection", () => {
  it("detects negated headings", () => {
    expect(isNegatedSection("What Does NOT Exist")).toBe(true);
    expect(isNegatedSection("Deliberately NOT Use")).toBe(true);
    expect(isNegatedSection("Excluded Libraries")).toBe(true);
    expect(isNegatedSection("Removed Features")).toBe(true);
    expect(isNegatedSection("Deprecated APIs")).toBe(true);
  });

  it("does not flag normal headings", () => {
    expect(isNegatedSection("Key Libraries")).toBe(false);
    expect(isNegatedSection("Architecture")).toBe(false);
    expect(isNegatedSection(null)).toBe(false);
  });
});

codex
I’ve confirmed there are no tests for `sync`, `watch`, or the interactive `setup` flow in this snapshot, which matters because most of the interesting failure behavior lives there rather than in the pure checkers. I’m doing one short pass over our own `system-spec-kit` handlers now so the “lessons for us” section is anchored in current Spec Kit safeguards, not just memory of prior iterations.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier.js';

// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
import { buildContext } from '../lib/code-graph/code-graph-context.js';

// Core handlers for routing
import { handleMemorySearch } from './memory-search.js';
import { handleMemoryMatchTriggers } from './memory-triggers.js';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';

// Token estimation
import { estimateTokens } from '../formatters/token-metrics.js';
import {
  getPressureLevel,
  type RuntimeContextStats,
} from '../lib/cognitive/pressure-monitor.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as sessionManager from '../lib/session/session-manager.js';

// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import {
  attachSessionTransitionTrace,
  buildSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import * as vectorIndex from '../lib/search/vector-index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// PI-B3: Folder discovery integration
import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
import {
  isAutoResumeEnabled,
  isFolderDiscoveryEnabled,
  isPressurePolicyEnabled,
  isIntentAutoProfileEnabled,
} from '../lib/search/search-flags.js';

// Feature catalog: Unified context retrieval (memory_context)
// Feature catalog: Dual-scope memory auto-surface
// Feature catalog: Provenance-rich response envelopes


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface ContextMode {
  readonly name: string;
  readonly description: string;
  readonly strategy: string;
  readonly tokenBudget?: number;
}

interface ContextOptions {
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  anchors?: string[];
  profile?: string;
  sessionTransition?: SessionTransitionTrace;
}

interface SessionLifecycleMetadata {
  sessionScope: 'caller' | 'ephemeral';
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  eventCounterStart: number;
  resumedContextCount: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

interface LayerInfo {
  tokenBudget?: number;
}

interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  tokenUsage?: number;
  anchors?: string[];
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
}

/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
  budgetTokens: number;
  actualTokens: number;
  enforced: boolean;
  truncated: boolean;
  originalResultCount?: number;
  returnedResultCount?: number;
}

type PressureOverrideTargetMode = 'quick' | 'focused' | null;

interface SessionLifecycleResolution {
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  priorMode: string | null;
  counter: number;
  error?: string;
}

interface EffectiveModeIntentClassification {
  detectedIntent?: string;
  intentConfidence: number;
  resumeHeuristicApplied: boolean;
  source: 'explicit' | 'auto-detected';
}

interface EffectiveModeResolution {
  effectiveMode: string;
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  intentClassification: EffectiveModeIntentClassification;
}

interface BuildResponseMetaParams {
  effectiveMode: string;
  requestedMode: string;
  tracedResult: ContextResult;
  pressurePolicy: {
    level: string;
    ratio: number | null;
    source: string;
    warning: string | null;
  };
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  sessionLifecycle: SessionLifecycleMetadata;
  effectiveBudget: number;
  enforcement: TokenBudgetEnforcement;
  intentClassification: EffectiveModeIntentClassification;
  discoveredFolder?: string;
  includeTrace: boolean;
  sessionTransition: SessionTransitionTrace;
  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
}

interface StrategyErrorPayload {
  error: string;
  code: string;
  details: Record<string, unknown>;
  hints: string[];
  severity: string | null;
}

interface StructuralRoutingNudgeMeta {
  advisory: true;
  readiness: 'ready';
  preferredTool: 'code_graph_query';
  message: string;
  preservesAuthority: 'session_bootstrap';
}

const STRUCTURAL_ROUTING_PATTERNS = [
  /\b(?:who|what)\s+calls?\b/i,
  /\bcallers?\s+of\b/i,
  /\b(?:who|what)\s+imports?\b/i,
  /\bimports?\s+of\b/i,
  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
  /\boutline\s+of\b/i,
  /\bdependenc(?:y|ies)\b/i,
  /\bdependents?\b/i,
  /\bwhat\s+extends\b/i,
];

function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const outerData = parsed?.data as Record<string, unknown> | undefined;

    const directRows = Array.isArray(outerData?.results)
      ? outerData.results as Array<Record<string, unknown>>
      : null;
    if (directRows) {
      return directRows;
    }

    const nestedContent = Array.isArray(outerData?.content)
      ? outerData.content as Array<{ type?: string; text?: string }>
      : [];
    const nestedText = nestedContent[0]?.text;
    if (typeof nestedText !== 'string' || nestedText.length === 0) {
      return [];
    }

    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
    return Array.isArray(nestedData?.results)
      ? nestedData.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
  if ((result as Record<string, unknown>).isError !== true) {
    return null;
  }

  const content = Array.isArray((result as Record<string, unknown>).content)
    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
    : [];
  const responseText = content[0]?.text;
  if (typeof responseText !== 'string' || responseText.length === 0) {
    return {
      error: 'Context strategy failed',
      code: 'E_STRATEGY',

exec
/bin/zsh -lc "sed -n '140,280p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Post-Save Quality Review
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. POST-SAVE QUALITY REVIEW
// ───────────────────────────────────────────────────────────────
// After writing a memory file, read it back and compare the rendered
// markdown against the original JSON payload to detect silent drift.

import * as fs from 'node:fs';

import {
  emitMemoryMetric,
  METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM,
  METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL,
  METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL,
  METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL,
  METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL,
  METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL,
  METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL,
  METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL,
} from '../lib/memory-telemetry';
import { sanitizeTriggerPhrase, type TriggerPhraseSanitizeReason } from '../lib/trigger-phrase-sanitizer';
import { resolveSaveMode, SaveMode, type SaveModeInput } from '../types/save-mode';
import { structuredLog } from '../utils/logger';
import { detectContinuationPattern } from './find-predecessor-memory';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
------------------------------------------------------------------*/

export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ReviewStatus = 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED' | 'REJECTED' | 'REVIEWER_ERROR';
export type ReviewCheckId =
  | 'PSR-1'
  | 'PSR-2'
  | 'PSR-3'
  | 'PSR-4'
  | 'PSR-5'
  | 'PSR-6'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D6'
  | 'D7'
  | 'D8'
  | 'DUP1'
  | 'DUP2'
  | 'DUP3'
  | 'DUP4'
  | 'DUP5'
  | 'DUP6'
  | 'DUP7';

export interface ReviewIssue {
  checkId?: ReviewCheckId;
  severity: IssueSeverity;
  field: string;
  message: string;
  fix: string;
}

export interface PostSaveReviewResult {
  status: ReviewStatus;
  issues: ReviewIssue[];
  skipReason?: string;
  reviewerError?: string;
  blocking?: boolean;
  blockerReason?: string;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  renderQualityScore?: number | null;
  inputCompletenessScore?: number | null;
}

export interface PostSaveReviewInput {
  savedFilePath: string;
  content?: string;
  collectedData: ({
    sessionSummary?: string;
    _manualTriggerPhrases?: string[];
    importanceTier?: string;
    importance_tier?: string;
    contextType?: string;
    context_type?: string;
    keyDecisions?: unknown[];
    _manualDecisions?: unknown[];
    _source?: string;
    headRef?: string | null;
    commitRef?: string | null;
    repositoryState?: string | null;
    isDetachedHead?: boolean | null;
    provenanceExpected?: boolean;
    renderQualityScore?: number | null;
    inputCompletenessScore?: number | null;
  } & SaveModeInput) | null;
  inputMode?: string;
}

type D3Reason = Extract<TriggerPhraseSanitizeReason, 'path_fragment' | 'standalone_stopword' | 'synthetic_bigram'>;

type AnchorState = {
  comment: string | null;
  closingComment: string | null;
  htmlId: string | null;
  tocTarget: string | null;
};

type GuardrailTelemetryContext = {
  inputMode: string;
  saveMode: SaveMode;
  provenanceExpected: boolean;
  overviewLength: number;
  d3Counts: Record<D3Reason, number>;
  continuationPattern: string | null;
  anchorViolationCount: number;
};

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
------------------------------------------------------------------*/

const GENERIC_TITLES = new Set([
  'next steps',
  'session summary',
  'context save',
  'manual context save',
  'development session',
  'session in progress',
  'continue implementation',
  'implementation session',
]);

const DECISION_PLACEHOLDER_PATTERN = /\b(?:observation|user)\s+decision\s+\d+\b/i;
const HIGH_GUARDRAIL_CHECKS = new Set<ReviewCheckId>(['D1', 'D2', 'D4', 'D7']);

/* ───────────────────────────────────────────────────────────────
   3. PARSING HELPERS
------------------------------------------------------------------*/

function normalizeInputMode(inputMode: string | undefined, saveMode: SaveMode): string {
  if (typeof inputMode === 'string' && inputMode.trim().length > 0) {
    return inputMode.trim().toLowerCase();
  }
  return saveMode;
}

function parseFrontmatter(content: string): Record<string, string> {
  const lines = content.split('\n');
  const result: Record<string, string> = {};

  if (lines[0]?.trim() !== '---') return result;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') break;

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      const value = line.substring(colonIdx + 1).trim();
      result[key] = value;
    }
  }

  return result;
}

function extractMemoryMetadataYaml(content: string): string {
  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml\s*([\s\S]*?)```/);
  return match?.[1] ?? '';
}

function parseMemoryMetadataBlock(content: string): Record<string, string> {
  const yamlBlock = extractMemoryMetadataYaml(content);
  if (!yamlBlock) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const rawLine of yamlBlock.split('\n')) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#') || line.endsWith(':')) {
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx <= 0) {
      continue;
    }

    const key = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 1).trim();
    if (key.length > 0 && value.length > 0) {
      result[key] = value;
    }
  }

  return result;
}

function normalizeScalarValue(value: string | undefined): string {
  return (value || '')
    .trim()
    .replace(/\s+#.*$/u, '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

function parseFrontmatterArray(content: string, fieldName: string): string[] {
  const lines = content.split('\n');
  const result: string[] = [];

  let inFrontmatter = false;
  let foundField = false;


 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// 1. VALIDATE MEMORY QUALITY
// ---------------------------------------------------------------
// Post-render quality gate for generated memory files
//
// Canonical location: lib/validate-memory-quality.ts
// This module contains pure validation logic with no memory/ dependencies.
// The memory/validate-memory-quality.ts file re-exports from here for
// backward compatibility (CLI entry point + existing importers).

import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { load: loadYaml } = require('js-yaml') as { load: (input: string) => unknown };
import { structuredLog } from '../utils/logger';
import type { ContaminationAuditRecord } from './content-filter';
import type { DataSource } from '../utils/input-normalizer';
import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14';

type ValidationRuleSeverity = 'low' | 'medium' | 'high';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';

interface ValidationRuleMetadata {
  ruleId: QualityRuleId;
  name: string;
  severity: ValidationRuleSeverity;
  blockOnWrite: boolean;
  blockOnIndex: boolean;
  appliesToSources: 'all' | readonly KnownDataSource[];
  reason: string;
}

interface ValidationDispositionResult {
  disposition: ValidationDisposition;
  blockingRuleIds: QualityRuleId[];
  indexBlockingRuleIds: QualityRuleId[];
  softRuleIds: QualityRuleId[];
}

const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata> = {
  V1: {
    ruleId: 'V1',
    name: 'placeholder-leakage-required-fields',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Placeholder leakage in required durable-memory fields corrupts the saved output contract.',
  },
  V2: {
    ruleId: 'V2',
    name: 'placeholder-leakage-with-tools',
    severity: 'medium',
    blockOnWrite: false,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Structured content can be saved for inspection, but placeholder leakage with real tool evidence should not reach the semantic index.',
  },
  V3: {
    ruleId: 'V3',
    name: 'malformed-spec-folder',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Malformed spec_folder routing metadata invalidates the saved memory target.',
  },
  V4: {
    ruleId: 'V4',
    name: 'fallback-decision-text',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Fallback-decision phrasing is a soft signal and should not block durable indexing on otherwise strong memories.',
  },
  V5: {
    ruleId: 'V5',
    name: 'sparse-semantic-fields',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Sparse trigger phrases are diagnostic, but not enough to reject an otherwise valid rendered memory.',
  },
  V6: {
    ruleId: 'V6',
    name: 'template-placeholder-remnants',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Template placeholder remnants are tracked as soft diagnostics when upstream template-contract validation already passed.',
  },
  V7: {
    ruleId: 'V7',
    name: 'contradictory-tool-state',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Tool-count contradictions are useful diagnostics, but not durable-index blockers on their own.',
  },
  V8: {
    ruleId: 'V8',
    name: 'cross-spec-contamination',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Foreign-spec contamination would corrupt both the saved memory and the semantic index.',
  },
  V9: {
    ruleId: 'V9',
    name: 'title-contamination',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'A contaminated title undermines retrieval quality and saved-memory truthfulness.',
  },
  V10: {
    ruleId: 'V10',
    name: 'session-source-mismatch',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Session-source mismatch is diagnostic and should remain visible without forcing write-only saves.',
  },
  V11: {
    ruleId: 'V11',
    name: 'api-error-content-leakage',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'API-error-dominated content is not a trustworthy memory surface.',
  },
  V12: {
    ruleId: 'V12',
    name: 'topical-coherence-mismatch',
    severity: 'medium',
    blockOnWrite: false,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Memory content with zero topical overlap with spec trigger_phrases suggests off-target capture.',
  },
  V13: {
    ruleId: 'V13',
    name: 'malformed-frontmatter',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Malformed frontmatter YAML or near-empty body content renders the memory unindexable and untrustworthy.',
  },
  V14: {
    ruleId: 'V14',
    name: 'status-percentage-contradiction',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'A status/percentage contradiction (status=complete but percentage<100) is a soft diagnostic signal.',
  },
};

const HARD_BLOCK_RULES: readonly QualityRuleId[] = Object.values(VALIDATION_RULE_METADATA)
  .filter((metadata) => metadata.blockOnWrite)
  .map((metadata) => metadata.ruleId);

interface RuleResult {
  ruleId: QualityRuleId;
  name?: string;
  passed: boolean;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  failedRules: QualityRuleId[];
  ruleResults: RuleResult[];
  contaminationAudit: ContaminationAuditRecord;
}

const FALLBACK_DECISION_REGEX = /No (specific )?decisions were made/i;
const NON_OPTIONAL_FIELDS = ['decisions', 'next_actions', 'blockers', 'readiness'];
const PLACEHOLDER_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /(^|\|)\s*\/100\b/m, label: 'dangling score denominator' },
  { pattern: /Confidence:\s*%/i, label: 'empty confidence percent' },
  { pattern: /\|\s*(Knowledge|Uncertainty|Context) Score\s*\|\s*\/100\s*\|/i, label: 'empty preflight score' },
  { pattern: /\|\s*Timestamp\s*\|\s*\|\s*Session start\s*\|/i, label: 'empty preflight timestamp' },
  { pattern: /-\s*Readiness:\s*$/im, label: 'empty readiness value' },
  { pattern: /(^title:\s*"|^#\s+)To promote a memory to constitutional tier/im, label: 'template instructional banner leakage' },
  { pattern: /^<!--\s*Template Configuration Comments/im, label: 'template configuration leakage' },
  { pattern: /^<!--\s*SESSION CONTEXT DOCUMENTATION v/im, label: 'template footer leakage' },
];
const EXECUTION_SIGNAL_PATTERNS = [
  /\*\*Tool:\s+/i,                         // actual tool invocation
  /\|\s*Tool Executions\s*\|\s*[1-9]/i,    // table says non-zero tools
  /\btool_calls?\b/i,                      // explicit tool_call reference
];
const SPEC_ID_REGEX = /\b\d{3}-[a-z][a-z0-9-]*(?=[\s,.)/:"'`]|$)/gi;
const FINDING_ID_SPEC_FALSE_POSITIVE_REGEX = /^\d{3}-i\d{3}-p\d-\d{3}$/i;
const NUMERIC_RANGE_SPEC_FALSE_POSITIVE_REGEX = /^\d{3}-\d+(?:-\d+)*$/;
const TITLE_CONTAMINATION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /^(to promote a memory|epistemic state captured at session start|table of contents)\b/i, label: 'template instructional heading' },
  { pattern: /^\[[^\]]+\]$/i, label: 'placeholder bracket title' },
  { pattern: /^(untitled|draft|todo|tbd)(?:\s+(memory|session|summary|document|notes?))?$/i, label: 'generic stub title' },
  { pattern: /^\d{3}(?:-[a-z0-9][a-z0-9-]*)?$/i, label: 'spec-id-only title' },
];

function isYamlMapping(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function describeYamlParseError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const mark = error as Error & { mark?: { line?: number; column?: number } };
  if (typeof mark.mark?.line === 'number') {
    const line = mark.mark.line + 1;
    const column = typeof mark.mark.column === 'number' ? `, column ${mark.mark.column + 1}` : '';
    return `line ${line}${column}: ${error.message}`;
  }

  return error.message;
}

function loadYamlValue(raw: string): unknown {
  return loadYaml(raw);
}

exec
/bin/zsh -lc "sed -n '200,340p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '160,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '218,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '240,250p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	
   241	# Task Group: Memory Redundancy Contracts and Phase 6 Plan Anchoring (026/003)
   242	scope: redundancy-driven doc updates in `002-implement-cache-warning-hooks` and `003-memory-quality-issues`, plus Phase 6 plan recall tied to completed research authority
   243	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for memory-redundancy follow-on work in this checkout when syncing implementation-summary/tasks language and answering Phase 6 plan questions from completed research
   244	
   245	## Task 1: Align 002/003 closeout docs so memory saves are compact wrappers and canonical docs remain narrative owners, outcome success
   246	
   247	### rollout_summary_files
   248	
   249	- rollout_summaries/2026-04-08T14-40-56-cqSE-memory_redundancy_doc_update_plan_phase6.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T16-40-56-019d6d8a-0a27-7223-be61-d5038a73d914.jsonl, updated_at=2026-04-08T15:47:45+00:00, thread_id=019d6d8a-0a27-7223-be61-d5038a73d914)
   250	

codex
# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

## Findings
### Finding 1: Mex fails open when git- or manifest-backed evidence disappears, so checks quietly lose authority instead of reporting degraded state
- **Source**: [external/src/git.ts:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:12), [external/src/drift/checkers/command.ts:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:60), [external/src/drift/checkers/dependency.ts:107](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:107), [external/src/setup/index.ts:196](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:196)
- **What it does**: git freshness and diff helpers return `null` or `""` on failure, command/dependency loaders return `null` on parse failure, and setup falls back from scanner-brief mode to raw filesystem exploration with only a warning. Mex keeps running, but several checks simply stop contributing evidence.
- **Why it matters for us**: this is the opposite of how Spec Kit Memory already treats operational uncertainty: our health/bootstrap surfaces emit explicit error payloads, request IDs, and stale/missing hints instead of silently narrowing authority ([memory-crud-health.ts:222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163)). If we add a repair plane, the lesson is “degrade visibly,” not “skip checks quietly.”
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Frontmatter corruption is tolerated by omission, which prevents crashes but also suppresses edge validation entirely
- **Source**: [external/src/markdown.ts:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts:16), [external/src/drift/frontmatter.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts:5), [external/src/drift/checkers/edges.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:5), [external/test/markdown.test.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:18)
- **What it does**: invalid YAML frontmatter is parsed as `null`; `parseFrontmatter()` also returns `null` on read failure; `checkEdges()` treats missing frontmatter as “no edges,” so corrupted metadata removes one whole checker surface rather than generating a corruption issue.
- **Why it matters for us**: Mex is resilient against malformed markdown, but it conflates “no frontmatter” with “broken frontmatter.” Spec Kit’s current memory pipeline is stronger here because malformed frontmatter is a named hard-blocking quality rule rather than a silent skip ([validate-memory-quality.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45)).
- **Recommendation**: reject
- **Impact**: high

### Finding 3: The repair loop is robust after AI execution, but its process-status semantics are ambiguous under timeout or interrupted sessions
- **Source**: [external/src/sync/index.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:18), [external/src/sync/index.ts:155](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:155), [external/test/checkers.test.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:1), [external/test/scanner.test.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:1)
- **What it does**: `runClaudeInteractive()` treats `status === 0` and `status === null` as success, so a timed-out or otherwise nonstandard child result can be accepted as okay; the safety net is that Mex always reruns drift detection afterward and shows the score delta before asking to continue. In this snapshot, tests cover checkers/parsing/scanner/config/patterns, but there are no dedicated `sync`, `watch`, or interactive `setup` suites under `external/test/`.
- **Why it matters for us**: the transferable part is the immediate re-verification step, not the exit handling. If Spec Kit ever adds bounded AI repair, we should keep “verify after every cycle,” but model result states as `success / failed / indeterminate` rather than treating null exit as acceptable.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mex’s advertised multi-language breadth is real in scanner setup, but not in drift validation or repair evidence
- **Source**: [external/src/scanner/manifest.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:5), [external/src/drift/checkers/dependency.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:38), [external/src/drift/checkers/command.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:5), [external/src/drift/checkers/script-coverage.ts:26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:26)
- **What it does**: the scanner can detect `package.json`, `pyproject.toml`, `go.mod`, and `Cargo.toml`, but only `package.json` gets full dependency/script parsing; non-Node manifests are stubbed for name/version only, and runtime drift checks still center on npm scripts, Make targets, and package.json dependencies.
- **Why it matters for us**: this is a migration trap. Mex looks repo-agnostic at the scaffold level, but the enforcement/control plane is mostly Node-centric. For Spec Kit, any doc-drift layer should either be explicitly JS-first or split into pluggable validators per ecosystem; otherwise we’ll inherit silent under-validation across mixed-language packets.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Scaling is controlled with hard caps and shallow searches, which stabilizes prompts but creates predictable blind spots in larger repos
- **Source**: [external/src/git.ts:52](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:52), [external/src/sync/brief-builder.ts:137](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:137), [external/src/drift/checkers/path.ts:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:57), [external/src/scanner/folder-tree.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:78), [external/src/scanner/entry-points.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:36), [external/src/scanner/readme.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:4)
- **What it does**: recent diff context is limited to `HEAD~5..HEAD`, fuzzy extension search stops at depth 5, recursive folder counts stop at depth 3, test entry points are capped at 10, and README context is truncated at 3000 characters.
- **Why it matters for us**: Mex is clearly optimized for “small enough prompt, fast enough loop,” not exhaustive truth. That tradeoff is reasonable, but it means scaling behavior is lossy by design. If we add a Spec Kit repair plane, our stronger retrieval stack should decide when to stay bounded and when to escalate to CocoIndex/code-graph rather than relying on fixed caps alone.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Setup and migration rely on heuristics that preserve user edits, but they can also preserve stale scaffolds and misclassify repo maturity
- **Source**: [external/src/config.ts:22](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:22), [external/src/setup/index.ts:107](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:107), [external/src/setup/index.ts:159](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:159), [external/src/setup/index.ts:274](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:274), [external/src/setup/index.ts:344](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:344)
- **What it does**: config loading blocks obviously incomplete `.mex/` scaffolds, but setup decides `fresh/existing/partial` from placeholder text plus a shallow source-file count; populated scaffold files are skipped if they no longer look templated; existing tool-config destinations are warned-and-skipped rather than reconciled.
- **Why it matters for us**: this is safe for avoiding overwrite damage, but weak for migration correctness. It protects user edits better than it proves scaffold consistency. Spec Kit is already more explicit about follow-up health/repair loops and packet validation, so the lesson is to keep preservation guards while pairing them with a first-class “migration drift” report instead of heuristic skipping alone.
- **Recommendation**: prototype later
- **Impact**: medium

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


hook: Stop
hook: Stop Completed
tokens used
191,265
# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

## Findings
### Finding 1: Mex fails open when git- or manifest-backed evidence disappears, so checks quietly lose authority instead of reporting degraded state
- **Source**: [external/src/git.ts:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:12), [external/src/drift/checkers/command.ts:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:60), [external/src/drift/checkers/dependency.ts:107](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:107), [external/src/setup/index.ts:196](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:196)
- **What it does**: git freshness and diff helpers return `null` or `""` on failure, command/dependency loaders return `null` on parse failure, and setup falls back from scanner-brief mode to raw filesystem exploration with only a warning. Mex keeps running, but several checks simply stop contributing evidence.
- **Why it matters for us**: this is the opposite of how Spec Kit Memory already treats operational uncertainty: our health/bootstrap surfaces emit explicit error payloads, request IDs, and stale/missing hints instead of silently narrowing authority ([memory-crud-health.ts:222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163)). If we add a repair plane, the lesson is “degrade visibly,” not “skip checks quietly.”
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Frontmatter corruption is tolerated by omission, which prevents crashes but also suppresses edge validation entirely
- **Source**: [external/src/markdown.ts:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts:16), [external/src/drift/frontmatter.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts:5), [external/src/drift/checkers/edges.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:5), [external/test/markdown.test.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts:18)
- **What it does**: invalid YAML frontmatter is parsed as `null`; `parseFrontmatter()` also returns `null` on read failure; `checkEdges()` treats missing frontmatter as “no edges,” so corrupted metadata removes one whole checker surface rather than generating a corruption issue.
- **Why it matters for us**: Mex is resilient against malformed markdown, but it conflates “no frontmatter” with “broken frontmatter.” Spec Kit’s current memory pipeline is stronger here because malformed frontmatter is a named hard-blocking quality rule rather than a silent skip ([validate-memory-quality.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45)).
- **Recommendation**: reject
- **Impact**: high

### Finding 3: The repair loop is robust after AI execution, but its process-status semantics are ambiguous under timeout or interrupted sessions
- **Source**: [external/src/sync/index.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:18), [external/src/sync/index.ts:155](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:155), [external/test/checkers.test.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts:1), [external/test/scanner.test.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts:1)
- **What it does**: `runClaudeInteractive()` treats `status === 0` and `status === null` as success, so a timed-out or otherwise nonstandard child result can be accepted as okay; the safety net is that Mex always reruns drift detection afterward and shows the score delta before asking to continue. In this snapshot, tests cover checkers/parsing/scanner/config/patterns, but there are no dedicated `sync`, `watch`, or interactive `setup` suites under `external/test/`.
- **Why it matters for us**: the transferable part is the immediate re-verification step, not the exit handling. If Spec Kit ever adds bounded AI repair, we should keep “verify after every cycle,” but model result states as `success / failed / indeterminate` rather than treating null exit as acceptable.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mex’s advertised multi-language breadth is real in scanner setup, but not in drift validation or repair evidence
- **Source**: [external/src/scanner/manifest.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:5), [external/src/drift/checkers/dependency.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:38), [external/src/drift/checkers/command.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:5), [external/src/drift/checkers/script-coverage.ts:26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:26)
- **What it does**: the scanner can detect `package.json`, `pyproject.toml`, `go.mod`, and `Cargo.toml`, but only `package.json` gets full dependency/script parsing; non-Node manifests are stubbed for name/version only, and runtime drift checks still center on npm scripts, Make targets, and package.json dependencies.
- **Why it matters for us**: this is a migration trap. Mex looks repo-agnostic at the scaffold level, but the enforcement/control plane is mostly Node-centric. For Spec Kit, any doc-drift layer should either be explicitly JS-first or split into pluggable validators per ecosystem; otherwise we’ll inherit silent under-validation across mixed-language packets.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Scaling is controlled with hard caps and shallow searches, which stabilizes prompts but creates predictable blind spots in larger repos
- **Source**: [external/src/git.ts:52](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:52), [external/src/sync/brief-builder.ts:137](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:137), [external/src/drift/checkers/path.ts:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:57), [external/src/scanner/folder-tree.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:78), [external/src/scanner/entry-points.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:36), [external/src/scanner/readme.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts:4)
- **What it does**: recent diff context is limited to `HEAD~5..HEAD`, fuzzy extension search stops at depth 5, recursive folder counts stop at depth 3, test entry points are capped at 10, and README context is truncated at 3000 characters.
- **Why it matters for us**: Mex is clearly optimized for “small enough prompt, fast enough loop,” not exhaustive truth. That tradeoff is reasonable, but it means scaling behavior is lossy by design. If we add a Spec Kit repair plane, our stronger retrieval stack should decide when to stay bounded and when to escalate to CocoIndex/code-graph rather than relying on fixed caps alone.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Setup and migration rely on heuristics that preserve user edits, but they can also preserve stale scaffolds and misclassify repo maturity
- **Source**: [external/src/config.ts:22](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:22), [external/src/setup/index.ts:107](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:107), [external/src/setup/index.ts:159](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:159), [external/src/setup/index.ts:274](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:274), [external/src/setup/index.ts:344](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:344)
- **What it does**: config loading blocks obviously incomplete `.mex/` scaffolds, but setup decides `fresh/existing/partial` from placeholder text plus a shallow source-file count; populated scaffold files are skipped if they no longer look templated; existing tool-config destinations are warned-and-skipped rather than reconciled.
- **Why it matters for us**: this is safe for avoiding overwrite damage, but weak for migration correctness. It protects user edits better than it proves scaffold consistency. Spec Kit is already more explicit about follow-up health/repair loops and packet validation, so the lesson is to keep preservation guards while pairing them with a first-class “migration drift” report instead of heuristic skipping alone.
- **Recommendation**: prototype later
- **Impact**: medium

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
