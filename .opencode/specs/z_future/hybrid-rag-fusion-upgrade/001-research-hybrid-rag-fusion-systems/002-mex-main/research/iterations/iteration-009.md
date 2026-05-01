### Finding 3: Mex’s repair-time retrieval is issue-seeded, file-scoped, and more surgical than its general navigation model
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts` lines 40-149 and 155-210; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts` lines 7-24, 41-97, and 99-158; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts` lines 52-60
- **What it does**: after drift detection, Mex groups issues by file, embeds the current file contents, lists nearby filesystem reality for missing paths, and attaches a recent `HEAD~5..HEAD` diff for claimed paths. The AI is then asked to fix only those files and only those issues, followed by an immediate re-check loop.
- **Why it matters for us**: this is the most adoptable retrieval pattern in Mex. It is not broad search, but it is very good targeted evidence retrieval for doc repair. It would fit a Spec Kit drift/doc-hygiene runner well.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Mex’s `triggers` are scaffold metadata, not an executable recall mechanism
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts` lines 21-30 and 32-53; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts` lines 64-69; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts` lines 5-12; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` lines 184-460
- **What it does**: Mex scaffolds `triggers:` into markdown templates, but I found no runtime trigger-matching path in `external/src/` beyond template/prompt emission. By contrast, our `memory_match_triggers` validates scope, supports trusted sessions, applies decay, activates working memory, spreads co-activation, and returns tiered content.
- **Why it matters for us**: Mex’s trigger idea is authoring guidance, not retrieval. We should not simplify our trigger recall down to static frontmatter keywords.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Spec Kit Memory is a real hybrid retrieval engine; Mex is not in the same class
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` lines 482-530, 654-709, and 771-1040; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts` lines 62-71 and 138-163; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` lines 602-915; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` lines 930-1095; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` lines 973-1185
- **What it does**: our `memory_search` runs a true retrieval pipeline: intent detection, channel routing by query complexity, hybrid candidate generation, vector/FTS/BM25/graph/degree fusion, community fallback, session boost, causal boost, co-activation spreading, artifact routing, feedback signals, reranking, and progressive disclosure.
- **Why it matters for us**: this is the core comparison result. Mex retrieves author-maintained markdown context. We retrieve from indexed memory plus graph signals with runtime scoring and fallback behavior. Mex can inspire add-ons, but it should not be treated as an alternative retrieval engine for our current use case.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Our semantic-to-structural bridge is the sharpest retrieval advantage over Mex
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` lines 1129-1200; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts` lines 21-77 and 118-179; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` lines 182-201 and 205-258; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts` lines 4-5, 86-93, and 180-220; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts` lines 46-117 and 143-159
- **What it does**: our stack classifies queries as structural, semantic, or hybrid; routes structural work to code graph; advertises CocoIndex for semantic code search; and can resolve CocoIndex file-line seeds into graph anchors, then expand them into neighborhood/outline/impact context with next actions.
- **Why it matters for us**: Mex has no equivalent bridge between “find related code semantically” and “expand the structural neighborhood around it.” This is the clearest place where our retrieval model is more powerful than markdown scaffold routing.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts`, `src/scanner/*`, `src/sync/*`, `src/pattern/index.ts`, `src/types.ts`, `src/drift/frontmatter.ts`, `src/git.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`, `lib/search/pipeline/stage1-candidate-gen.ts`, `lib/search/pipeline/stage2-fusion.ts`, `lib/search/hybrid-search.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts`, `lib/code-graph/seed-resolver.ts`, `lib/code-graph/code-graph-context.ts`, `lib/session/session-snapshot.ts`, `context-server.ts`

## Assessment
- New information ratio: 0.76
- Questions addressed: whether Mex has a live retrieval engine, how Mex bootstrap retrieval works, how Mex repair-time retrieval works, whether Mex triggers are executable, how our memory_search differs in retrieval depth, how our CocoIndex and code-graph surfaces compose
- Questions answered: Mex has no ranked runtime retrieval surface; Mex’s best retrieval idea is file-scoped repair briefing; Mex’s scanner is a bounded bootstrap helper rather than semantic retrieval; Mex triggers are passive metadata; Spec Kit Memory remains substantially stronger for recall, ranking, session continuity, and code discovery; our CocoIndex-to-code-graph bridge is a meaningful differentiator

## Reflection
- What worked: tracing `cli.ts` into `scanner/index.ts`, `sync/brief-builder.ts`, and the runtime source search for `trigger` made the retrieval boundary very clear; pairing that with `memory-search.ts`, `memory-context.ts`, and the code-graph seed bridge gave a clean implementation-level comparison
- What did not work: the CocoIndex MCP search itself did not complete in this run, so I relied on direct source tracing for our side; `validate.sh --strict` passed for the phase folder, but it also emitted `cannot create temp file for here document: Operation not permitted`, which looks like a read-only sandbox side effect rather than a phase validation failure

## Recommended Next Focus
Design a Spec Kit doc-drift retrieval lane that keeps our current retrieval stack intact but borrows Mex’s best repair-time idea: detect specific doc/memory drift, then build a file-scoped repair brief with current file content, nearby filesystem reality, and small git diffs. If you want iteration 9 to stay on retrieval, the most valuable next comparison is whether Modus or Mnemosyne have a similarly strong “semantic seed -> structural expansion -> surgical repair context” chain, or whether Mex is still unique on the repair-brief side.

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
# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our memory_context, generate-context.js, session bootstrap.

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
I’m treating this as a read-only research pass focused on lifecycle/session-state comparisons. First I’m pulling the relevant prior memory context, then I’ll trace the external Mex source and our memory/session code side by side so the findings stay implementation-grounded rather than README-level.
exec
/bin/zsh -lc 'rg -n "mex|memory_context|generate-context|session bootstrap|session_bootstrap|session_resume|memory save|generate-context.js" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
151:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
245:## Task 1: Align 002/003 closeout docs so memory saves are compact wrappers and canonical docs remain narrative owners, outcome success
542:- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
798:- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1455:- --recovery, RECOVERY_MODE_REQUIRED, allowRecovery, generate-context.ts, loadCollectedData, workflow.ts
1782:- phase-1 baseline, deferred Phase 2-6 follow-up, check-completion.sh, generate-context.js, /tmp/save-context-data.json, telemetry README schema alignment
1825:- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
1832:- symptom: memory save / context generation aborts in manual runs; cause: missing JSON input and telemetry doc/schema mismatch; fix: provide `/tmp/save-context-data.json` and sync telemetry README to code fields first [Task 2]

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got the prior memory anchors and the repo-level deep-research workflow loaded. Next I’m tracing Mex’s bootstrap/resync/session state surfaces from the scaffold files into the CLI and sync code, then I’ll line that up against our `memory_context`, `session_bootstrap`, `session_resume`, and `generate-context.js` flow.
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
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && find . -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
./.github/ISSUE_TEMPLATE/bug_report.md
./.github/ISSUE_TEMPLATE/feature_request.md
./.github/pull_request_template.md
./.github/workflows/ci.yml
./.gitignore
./.tool-configs/.cursorrules
./.tool-configs/.windsurfrules
./.tool-configs/CLAUDE.md
./.tool-configs/README.md
./.tool-configs/copilot-instructions.md
./.tool-configs/opencode.json
./AGENTS.md
./CHANGELOG.md
./CLAUDE.md
./CODE_OF_CONDUCT.md
./CONTRIBUTING.md
./LICENSE
./README.md
./ROUTER.md
./SECURITY.md
./SETUP.md
./SYNC.md
./context/architecture.md
./context/conventions.md
./context/decisions.md
./context/setup.md
./context/stack.md
./mascot/mex-mascot.svg
./package-lock.json
./package.json
./patterns/INDEX.md
./patterns/README.md
./screenshots/mex-check.jpg
./screenshots/mex-check1.jpg
./screenshots/mex-sync.jpg
./setup.sh
./src/cli.ts
./src/config.ts
./src/drift/claims.ts
./src/drift/frontmatter.ts
./src/drift/index.ts
./src/drift/scoring.ts
./src/git.ts
./src/markdown.ts
./src/pattern/index.ts
./src/reporter.ts
./src/scanner/entry-points.ts
./src/scanner/folder-tree.ts
./src/scanner/index.ts
./src/scanner/manifest.ts
./src/scanner/readme.ts
./src/scanner/tooling.ts
./src/setup/index.ts
./src/setup/prompts.ts
./src/sync/brief-builder.ts
./src/sync/index.ts
./src/types.ts
./src/watch.ts
./sync.sh
./templates/.tool-configs/.cursorrules
./templates/.tool-configs/.windsurfrules
./templates/.tool-configs/CLAUDE.md
./templates/.tool-configs/README.md
./templates/.tool-configs/copilot-instructions.md
./templates/.tool-configs/opencode.json
./templates/AGENTS.md
./templates/ROUTER.md
./templates/SETUP.md
./templates/SYNC.md
./templates/context/architecture.md
./templates/context/conventions.md
./templates/context/decisions.md
./templates/context/setup.md
./templates/context/stack.md
./templates/patterns/INDEX.md
./templates/patterns/README.md
./test/checkers.test.ts
./test/claims.test.ts
./test/config.test.ts
./test/markdown.test.ts
./test/pattern.test.ts
./test/scanner.test.ts
./test/scoring.test.ts
./tsconfig.json
./tsup.config.ts
./update.sh
./visualize.sh

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The external side is looking very lightweight on lifecycle so far: static scaffold bootstrap, one-shot setup prompts, and a sync loop without persistent runtime session state. I’m pulling our lifecycle implementation now so the comparison can stay concrete at the code-path level rather than become a generic “ours is richer” claim.
exec
/bin/zsh -lc "rg -n \"generate-context|collect-session-data|save-context-data|sessionSummary|recent_context|toolCalls|decisions\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts -g '*.*'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|memory_context|generate-context|sessionId|resume|bootstrap|working memory|snapshot\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:8:      "name": "generate-context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:9:      "path": "scripts/dist/memory/generate-context.js",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:458:      "memory": ["generate-context", "cleanup-orphaned-vectors", "test-embeddings-factory"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:196:  // Prior bonuses (+0.05 messages, +0.05 tools, +0.10 decisions) masked up to 5 simultaneous
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:141:  const decisions = collectedData.observations?.filter((o) => o.type === 'decision') || [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:18:const fallbackRegex = /No (specific )?decisions were made/i;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:243:  // F-12: Return empty decisions for null input instead of synthetic simulation data
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:248:  // F-12: Process manual decisions, then merge with observation-extracted decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:269:        // Fix 1: Split string-form decisions at first separator to extract title vs rationale
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:421:    // F-12: Don't return early — fall through to merge with observation-extracted decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:429:  // REQ-002: suppress ALL observation-type decisions when manual decisions exist,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:430:  // since observation decisions are auto-extracted from the same session and manual
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:431:  // decisions should take full precedence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:436:  // P0-3: Also suppress lexical extraction when manual decisions exist,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:437:  // since those observations were already built from the same manual decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:449:  const decisions: DecisionRecord[] = allDecisionObservations.map((obs, index) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:625:  // F-12: Merge manual decisions with observation-extracted decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:626:  const allDecisions = [...processedManualDecisions, ...decisions];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:637:  const decisionsWithAnchors: DecisionRecord[] = allDecisions.map((decision) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:661:    DECISIONS: decisionsWithAnchors.map((d) => validateDataStructure(d) as DecisionRecord),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:38:  decisions: Array<{ title: string; rationale: string; chosen: string; _provenance: 'spec-folder' }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:247:function parseDecisionDoc(content: string | null): SpecFolderExtraction['decisions'] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:281:  }).filter((entry): entry is SpecFolderExtraction['decisions'][number] => Boolean(entry));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:315:  const decisions = parseDecisionDoc(readDoc(specFolderPath, 'decision-record.md'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:391:    decisions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/index.ts:8:// Barrel export for all extractor modules (files, diagrams, conversations, decisions, sessions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/index.ts:34:export * from './collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:8:// Orchestrates session data collection — gathers observations, files, decisions, and context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:360:function renderOverviewSummary(sessionSummary: string, boundarySafeSummary: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361:  const trimmedSummary = sessionSummary.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:432:    const hasSessionSummary = !!collectedData.sessionSummary;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:449:    // If explicit JSON data has summary + decisions + next steps, session is complete
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:493:  const toolCallCount = Array.isArray(collectedData?.toolCalls)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:494:    ? collectedData.toolCalls.length
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:502:  const summaryText = collectedData?.sessionSummary || '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:557:  // CG-03: JSON-mode explicit data with sessionSummary → high completion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:560:    const hasSessionSummary = !!collectedData.sessionSummary;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:617:        component: 'collect-session-data',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:820:      DESCRIPTION: 'Architectural decisions and rationale',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:938:  // Add distinctive observations (skip decisions, those live in decision-record.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1350:  // Rec 3: Prefer explicit sessionSummary from JSON over transcript-derived learning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1351:  const SUMMARY: string = (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 20)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1352:    ? renderOverviewSummary(data.sessionSummary, truncateOnWordBoundary(data.sessionSummary, 500))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1535:    // Rec 3: Derive title from sessionSummary when available (up to 80 chars, sentence boundary)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1537:      const summary = typeof data.sessionSummary === 'string' ? data.sessionSummary : '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1561:    // RC1: Pass through raw sessionSummary from JSON payload for title candidate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1562:    _JSON_SESSION_SUMMARY: typeof data.sessionSummary === 'string' ? data.sessionSummary : null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:63:  decisions: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:201:        decisions: 0.20,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:427:    uniqueness: 0.30, density: 0.30, fileRefs: 0.20, decisions: 0.20,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:474:    (decisionScore * factors.decisions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/README.md:34:- `collect-session-data.ts` - Orchestrates session data collection across observations, files, decisions, and context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/README.md:55:- Processing: extraction and enrichment across conversation, files, decisions, and session context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:10:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:395:  decisions: WorkflowDecisionEvidence[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:407:    decisions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:443:    decisions: decisions.map((decision) => (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/README.md:82:| Fallback rate | Contains phrases like "No specific decisions were made" |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:122:  // In JSON mode tool counts are always 0, so decisions were never checked.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:466:    { name: 'decision-record.md', role: 'Architectural decisions and rationale' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:528: * - Processes TITLE, RATIONALE, and CHOSEN from decisions (topic-extractor only uses TITLE/RATIONALE)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:532: * @param decisions - Array of decision objects whose titles, rationales, and choices are weighted.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:535:function extractKeyTopics(summary: string | undefined, decisions: DecisionForTopics[] = []): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:548:  if (Array.isArray(decisions)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:549:    for (const dec of decisions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:53: * userPrompts are available. Creates User+Assistant exchange pairs from sessionSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:59:  collectedData: CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:63:  const sessionSummary = String(collectedData.sessionSummary || '');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:69:    : sessionSummary.split(/[.!?\n]/)[0]?.trim() || 'Session context save';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:77:  // Assistant message from full sessionSummary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:78:  if (sessionSummary.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:82:      CONTENT: sessionSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:131:  collectedData: CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'> | null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:168:  // Rec 2: When userPrompts are empty but JSON has sessionSummary, build messages from structured data
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:170:  if (userPrompts.length === 0 && collectedData.sessionSummary) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:219:    const toolCalls: ToolCallEntry[] = relatedObs.flatMap(({ obs }) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:270:        toolCalls,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:280:          TOOL_CALLS: toolCalls.slice(0, 10),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:295:      toolNames: toolCalls.map((toolCall) => toolCall.TOOL_NAME),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:328:  if (!jsonModeHandled && userPrompts.length <= 1 && collectedData.sessionSummary) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:333:      CONTENT: String(collectedData.sessionSummary),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:341:        CONTENT: `Key decisions: ${keyDecisions.map((d: Record<string, unknown>) => typeof d === 'string' ? d : d?.title || JSON.stringify(d)).join('; ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:63:  decisions: DecisionData;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:345:  const decisions: DecisionRecord[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:403:    DECISIONS: decisions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:518:    decisions: createDecisionData(config),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:24:// - Processes TITLE/RATIONALE from decisions with higher weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:28:  decisions: DecisionForTopics[] = [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:35:  // actual session content (summary, decisions).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:37:  for (const decision of decisions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:27:  sessionSummary?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:104:    currentSession.sessionSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:8:// evaluation, segment pruning logic, and promotion decisions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:8:// Shared helpers for memory task title enrichment decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:192:const FALLBACK_DECISION_REGEX = /No (specific )?decisions were made/i;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:193:const NON_OPTIONAL_FIELDS = ['decisions', 'next_actions', 'blockers', 'readiness'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:84:    sessionSummary?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:389:function extractDecisionTitles(decisionsSection: string): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:390:  return Array.from(decisionsSection.matchAll(/^###\s+Decision\s+\d+:\s+(.+)$/gim), (match) => match[1].trim()).filter(Boolean);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:393:function extractDecisionRationales(decisionsSection: string): string[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:394:  return Array.from(decisionsSection.matchAll(/^\*\*Rationale\*\*:\s+(.+)$/gim), (match) => match[1].trim()).filter(Boolean);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:634:    const decisionsSection = stripSectionScaffolding(extractSection(fileContent, 'DECISIONS'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:639:    const payloadSummary = (collectedData.sessionSummary || '').trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:659:        message: `"${savedTitle}" — should reflect sessionSummary`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:715:          fix: `Verify decisions were propagated; expected decision_count >= ${payloadDecisions.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:749:      extractDecisionTitles(decisionsSection)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:754:      extractDecisionRationales(decisionsSection)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:767:        field: 'decisions',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:857:          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:891:    if (payloadDecisions.length > 0 && DECISION_PLACEHOLDER_PATTERN.test(decisionsSection)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:895:        field: 'decisions',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:896:        message: 'DECISIONS contains observation/user placeholder labels despite authored decisions in the payload',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:80:  decisionsSection: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:488:  const decisionsSection = stripSectionScaffolding(extractSection(content, 'DECISIONS'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:496:    decisionsSection,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:527:  if (DECISION_PLACEHOLDER_PATTERN.test(parsed.decisionsSection)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:615:  if (DECISION_PLACEHOLDER_PATTERN.test(parsed.decisionsSection)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:27:import { collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:89:    "recent_context": [...],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:90:    "toolCalls": [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:116:  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:524:export function classifyConversationPhase(toolCalls: Array<{ tool?: string }>, messageContent: string): ConversationPhaseLabel {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts:532:    toolNames: toolCalls.map((toolCall) => toolCall.tool || '').filter(Boolean),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:20:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:84:  sessionSummary?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:87:  key_decisions?: Array<string | DecisionItemObject>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:112:  recent_context?: Array<RecentContext | string>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:260:  toolCalls?: CaptureToolCall[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:539:function buildPromotedExchangePrompts(exchanges: unknown[], sessionSummary: string): NormalizedUserPrompt[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:540:  const sessionSummaryLower = sessionSummary.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:548:    if (inputStr.length > 10 && !sessionSummaryLower.includes(inputStr.toLowerCase().slice(0, 50))) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:556:function buildToolCallObservations(toolCalls: unknown[]): Observation[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:559:  for (const tc of toolCalls.slice(0, 10)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:648:    : Array.isArray(data.recent_context)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:649:      ? data.recent_context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:658:  if (data.userPrompts || data.user_prompts || data.observations || data.recentContext || data.recent_context) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:670:    const sessionSummary = typeof data.sessionSummary === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:671:      ? data.sessionSummary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:732:    if (sessionSummary) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:733:      cloned.observations.push(buildSessionSummaryObservation(sessionSummary, triggerPhrases));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:738:    if (Array.isArray(data.toolCalls)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:739:      cloned.observations.push(...buildToolCallObservations(data.toolCalls));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:801:      : Array.isArray(data.key_decisions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:802:        ? data.key_decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:819:      const promotedPrompts = buildPromotedExchangePrompts(data.exchanges, sessionSummary);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:922:  const sessionSummary = typeof data.sessionSummary === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:923:    ? data.sessionSummary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:926:  if (sessionSummary) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:927:    observations.push(buildSessionSummaryObservation(sessionSummary, triggerPhrases));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:932:    : Array.isArray(data.key_decisions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:933:      ? data.key_decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:959:    ? buildPromotedExchangePrompts(data.exchanges, sessionSummary || '')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:962:  // T09b: Promote toolCalls to implementation observations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:963:  if (Array.isArray(data.toolCalls)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:964:    normalized.observations.push(...buildToolCallObservations(data.toolCalls));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:967:  // T09b: Use promoted exchange prompts alongside sessionSummary fallback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:969:    ? [...promotedPrompts, { prompt: sessionSummary || 'Manual context save', timestamp: new Date().toISOString() }]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:970:    : [{ prompt: sessionSummary || 'Manual context save', timestamp: new Date().toISOString() }];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:973:    request: sessionSummary || 'Manual context save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:974:    learning: sessionSummary || ''
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1050:  'sessionSummary', 'session_summary',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1051:  'keyDecisions', 'key_decisions',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1060:  'toolCalls', 'exchanges',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1063:  'recentContext', 'recent_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1096:    if (!data.userPrompts && !data.user_prompts && !data.observations && !data.recentContext && !data.recent_context) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1110:  if (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 50000) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1111:    errors.push(`sessionSummary exceeds maximum length of 50000 characters (got ${data.sessionSummary.length})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1164:  if (data.key_decisions !== undefined && !Array.isArray(data.key_decisions)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1165:    errors.push('key_decisions must be an array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1186:  if (Array.isArray(data.key_decisions) && data.key_decisions.length > ARRAY_LENGTH_CAP) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1187:    errors.push(`key_decisions exceeds maximum length of ${ARRAY_LENGTH_CAP} (got ${data.key_decisions.length})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1235:  if (data.recent_context !== undefined && !Array.isArray(data.recent_context)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1236:    errors.push('recent_context must be an array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1406:    toolCalls: Array.isArray(capture.toolCalls) ? capture.toolCalls : [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1413:  const { exchanges, toolCalls, metadata, sessionTitle } = normalizedCapture;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1484:    ? (toolCalls || []).filter(isToolRelevant)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1485:    : (toolCalls || []);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts:140: * Apply tree-thinning decisions to the semantic file-change list that feeds
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/common.sh:153:    printf 'DECISIONS_DIR=%q\n' "$feature_dir/decisions"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:45:  // Phase 004: toolCalls/exchanges compact strings — empty when no data present
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:147:  toolCalls?: ToolCallSummary[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:151:  sessionSummary?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:573:  /** RC1: Raw sessionSummary from JSON payload, used as preferred title candidate */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:29:  toolCalls?: Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:86:  decisions: ExtractedDecision[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:425:  const decisions: ExtractedDecision[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:451:          decisions.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:462:  return decisions;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:471:  const decisions: ExtractedDecision[] = extractDecisions(messages);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:601:    decisions: decisions.slice(0, 5),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:609:      decision: decisions.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:636:  if (summary.decisions.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:638:    for (const decision of summary.decisions) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:732:  const decisionSection = extractMarkdownSection(markdown, ['decisions']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:736:  const summaryDecisions = summary.decisions.map((decision) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:754:    decisions: summaryDecisions.length > 0 ? summaryDecisions : markdownDecisions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh:143:[[ -d "$DECISIONS_DIR" && -n "$(ls -A "$DECISIONS_DIR" 2>/dev/null)" ]] && docs+=("decisions/")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh:169:    check_dir "$DECISIONS_DIR" "decisions/"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:124:  recent_context: [{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/README.md:50:| **Docs Discovery** | Reports available docs (`research/research.md`, `checklists/`, `decisions/`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/README.md:156:  "AVAILABLE_DOCS": ["research/research.md", "checklists/", "decisions/"]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/install.sh:7:# decisions, and session memories. Enables context preservation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/install.sh:272:decisions, and session memories. It enables context preservation across
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/create.sh:17:#   L3: +Architecture decisions - decision-record.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/create.sh:233:            echo "  Level 3 (Core + Verify + Arch): +Architecture decisions"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/create.sh:1204:               echo "      (Architecture decisions - adds ~150 LOC)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/create.sh:1216:    [[ "${DOC_LEVEL/+/}" -ge 3 ]] && echo "    5. Document decisions in decision-record.md"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts:101:function classifyConversationPhase(toolCalls: ToolCallRecord[], messageContent: string): ConversationPhase {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts:102:  return classifyPhaseViaSignals(toolCalls, messageContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:37:import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:38:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:345:    /** Number of decisions extracted. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:545:      // Merge decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:546:      if (specContext.decisions.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:549:          ...specContext.decisions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:654:      // Rec 1: Normalize JSON-derived preloaded data so sessionSummary → userPrompts,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:849:      // Phase 002 T010: Clean _JSON_SESSION_SUMMARY (raw sessionSummary title candidate)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1051:      // extractors (decisions, diagrams, conversations) see the authoritative value
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1066:    const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1080:      log('   Extracting decisions...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1082:      log(`   Found ${result.DECISIONS.length} decisions`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1182:                   implSummary.decisions.length > 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1184:  log(`   Generated summary: ${implSummary.filesCreated.length} created, ${implSummary.filesModified.length} modified, ${implSummary.decisions.length} decisions\n`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1230:      sessionData._JSON_SESSION_SUMMARY || '',  // RC1: raw JSON sessionSummary as first candidate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1251:  const keyTopicsInitial: string[] = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS, specFolderName);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1272:    decisions.DECISIONS.forEach((d: DecisionForTopics & { CONTEXT?: string; CHOSEN?: string }) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1488:  const effectiveDecisionCount = Math.max(sessionData.DECISION_COUNT, decisions.DECISIONS.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1507:      // Compact wrapper mode: pass canonical docs and evidence instead of full decisions/conversation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1513:      DECISION_HEADLINES: decisions.DECISIONS.slice(0, 2).map(d => d.TITLE),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1559:      // Phase 004 T020: Bind toolCalls and exchanges from CollectedDataBase to template context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1560:      hasToolCalls: Array.isArray((collectedData as Record<string, unknown>).toolCalls) &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1561:        ((collectedData as Record<string, unknown>).toolCalls as unknown[]).length > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1562:      TOOL_CALLS_COMPACT: Array.isArray((collectedData as Record<string, unknown>).toolCalls)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1563:        ? ((collectedData as Record<string, unknown>).toolCalls as Array<Record<string, unknown>>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1585:      decisionCount: decisions.DECISIONS.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1603:        decisions: implSummary.decisions.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1681:    decisions: decisions.DECISIONS,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1744:  // Unified quality scoring: use v2 scorer for all decisions (abort, index, metadata)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1949:  log(`  - ${effectiveDecisionCount} key decisions documented`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1966:          sessionSummary: collectedData.sessionSummary || jsonSessionSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2166:          decisionCount: decisions.DECISIONS.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:29:  toolCalls?: ToolCall[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:151:function summarizeExchange(userMessage: string, assistantResponse: string, toolCalls: ToolCallEntry[] = []): ExchangeArtifactSummary {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:160:  const mainTools: string = toolCalls.slice(0, 3).map((t: ToolCallEntry) => t.TOOL_NAME).join(', ');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:161:  const toolSummary: string = toolCalls.length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/message-utils.ts:162:    ? ` Used tools: ${mainTools}${toolCalls.length > 3 ? ` and ${toolCalls.length - 3} more` : ''}.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:186:| `input-normalizer.ts` | Normalizes diverse input formats (strings, objects, arrays) into consistent structures. Transforms key decisions |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:48:        sessionSummary: 'Meaningful implementation session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:93:      sessionSummary: 'Completed runtime hardening.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:124:      recent_context: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:127:          learning: 'The documented user_prompts and recent_context fields must survive normalization.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:198:      toolCalls: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:326:      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:406:      sessionSummary: 'Session with no next steps.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:417:      sessionSummary: 'Both fields present.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:432:      sessionSummary: 'Edge case: empty first step.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:446:      sessionSummary: 'Critical save should keep the caller-provided tier.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:462:      sessionSummary: 'Temporary save should retain the snake_case override.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:478:      sessionSummary: 'Architecture work should still auto-detect as critical.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/implementation-summary.md:44:<!-- ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/implementation-summary.md:50:<!-- /ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:151:    '<!-- ANCHOR:decisions -->',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:154:    'No decisions recorded.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:221:    decisions: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:80:          sessionSummary: 'Implemented the detector provenance taxonomy with additive edge evidence and bounded metadata cleanup.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:1002:    // Check for decisions section
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:1004:      pass('TC-700g: context_template has decisions section', 'Decisions section found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:1006:      fail('TC-700g: context_template has decisions section', 'Decisions section missing');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:1029:      contextTemplate.includes('[DECISIONS](#decisions)') &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:10:import { collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:22:  sessionSummary: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:112:        sessionSummary: 'Importance-tier drift should be detected after save.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:149:        sessionSummary: 'Matching tiers with inline comments should still pass.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:579:<!-- ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:582:<!-- /ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:621:<!-- ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:624:<!-- /ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:166:    const decisions = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:174:    const workflowTopics = extractWorkflowTopics(summaryText, decisions, '008-signal-extraction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:175:    const sessionTopics = extractSessionTopics(summaryText, decisions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:9:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:78:    sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:125:    '- [DECISIONS](#decisions)',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:257:        sessionSummary: 'Placeholder contamination should be caught.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:258:        keyDecisions: [{ decision: 'Use authored decisions first' }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:278:        sessionSummary: 'Unsanitized trigger phrases should be caught.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:309:        sessionSummary: 'Continuation saves should carry supersedes lineage.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:329:        sessionSummary: 'Duplicate trigger phrases should be caught.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:381:        sessionSummary: 'This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:403:        sessionSummary: 'Composite blocker should reject one HIGH plus two MEDIUM findings.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:442:        sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:480:                'Tool: read File: scripts/extractors/collect-session-data.ts Result: inspected quick summary derivation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:483:              files: ['scripts/extractors/collect-session-data.ts', 'scripts/tests/memory-render-fixture.vitest.ts'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md:107:- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: ADR-001 present]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:290:      sessionSummary: 'Test session summary',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:340:      toolCalls: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:932:    // Test 3: create_decision_data creates decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:935:      pass('T-013c: create_decision_data creates decisions', `${dec.DECISION_COUNT} decisions`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:937:      fail('T-013c: create_decision_data creates decisions', 'No decisions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:982:    // Test 2: extractConversationTopics extracts from recent_context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1312:      pass('T-021b: extractDecisions returns simulation for null', `${simResult.DECISION_COUNT} decisions`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1317:    // Test 3: extractDecisions processes manual decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1324:      pass('T-021c: extractDecisions processes manual decisions', manualResult.DECISIONS[0].TITLE);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1326:      fail('T-021c: extractDecisions processes manual decisions', `Got ${manualResult.DECISIONS.length} decisions`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1431:  log('\n🔬 EXTRACTORS: collect-session-data.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1434:    const { collectSessionData, shouldAutoSave } = require(path.join(SCRIPTS_DIR, 'extractors', 'collect-session-data'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1961:    // Test 1: extract_decisions is a function
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1962:    assertType(extractDecisions, 'function', 'T-031a: extract_decisions is a function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1964:    // Test 2: extract_decisions finds explicit choice
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1969:    const decisions1 = extractDecisions(messagesWithChoice);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1970:    if (Array.isArray(decisions1) && decisions1.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1971:      pass('T-031b: extract_decisions finds explicit choice', `Found ${decisions1.length} decision(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1973:      fail('T-031b: extract_decisions finds explicit choice', 'No decisions found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1976:    // Test 3: extract_decisions captures question context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1977:    if (decisions1.length > 0 && decisions1[0].question) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1978:      pass('T-031c: extract_decisions captures question context', decisions1[0].question);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1980:      skip('T-031c: extract_decisions captures question context', 'No question captured');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1983:    // Test 4: extract_decisions handles option letter format
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1988:    const decisions2 = extractDecisions(messagesWithLetter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1989:    if (decisions2.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1990:      pass('T-031d: extract_decisions handles option letter format', `Choice: ${decisions2[0].choice}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1992:      fail('T-031d: extract_decisions handles option letter format', 'No decision found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1995:    // Test 5: extract_decisions returns empty array for no decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1998:      { prompt: 'With no decisions at all' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2000:    const decisions3 = extractDecisions(messagesNoDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2001:    if (Array.isArray(decisions3) && decisions3.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2002:      pass('T-031e: extract_decisions returns empty for no decisions', 'Empty array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2004:      fail('T-031e: extract_decisions returns empty for no decisions', `Found ${decisions3.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2007:    // Test 6: extract_decisions handles empty input
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2008:    const decisions4 = extractDecisions([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2009:    if (Array.isArray(decisions4) && decisions4.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2010:      pass('T-031f: extract_decisions handles empty input', 'Empty array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2012:      fail('T-031f: extract_decisions handles empty input', `Got ${decisions4.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2015:    // Test 7: extract_decisions handles "chose" pattern with explicit prefix
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2020:    const decisions5 = extractDecisions(messagesChose);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2021:    if (decisions5.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2022:      pass('T-031g: extract_decisions handles "chose" pattern', 'Found decision');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2024:      // The function requires specific classification patterns to detect decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2026:      skip('T-031g: extract_decisions handles "chose" pattern', 'Requires specific format');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2029:    // Test 8: extract_decisions handles "user chose" pattern
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2034:    const decisions6 = extractDecisions(messagesUserChose);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2035:    if (decisions6.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2036:      pass('T-031h: extract_decisions handles "user chose" pattern', 'Found decision');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2038:      fail('T-031h: extract_decisions handles "user chose" pattern', 'No decision found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:77:      sessionSummary: 'Implemented the render-layer fixes for canonical sources, trigger phrases, evidence bullets, phase capture, and score naming.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:87:        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:88:        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:92:        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed canonical discovery and counts.' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:104:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:123:    expect(evidence).toContain('scripts/extractors/collect-session-data.ts:1176');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:124:    expect((evidence.match(/scripts\/extractors\/collect-session-data\.ts:1176/g) ?? []).length).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:55:      toolCalls: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:81:      toolCalls: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:103:      toolCalls: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:124:      toolCalls: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:163:      toolCalls: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:226:  it('extracts task progress and decisions from spec-folder docs without crashing on sparse inputs', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:282:    expect(extracted.decisions).toEqual(expect.arrayContaining([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:272:  // Covers: F-12 (Return empty decisions for null input; merge manual + observation decisions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:273:  it('suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:292:    // SC-002: 4 manual decisions produce exactly 4 records, not 8
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:297:  // Covers: F-12 (Merge manual decisions with observation-extracted decisions)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:298:  it('preserves observation decisions when no manual decisions exist', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:319:    // No manual decisions → observation decisions are preserved
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:1:// TEST: collect-session-data — basic unit tests for session status, completion, and collection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:7:} from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:125:        sessionSummary: 'Verified final output and captured the final session summary.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:126:        toolCalls: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:153:        sessionSummary: 'Wrapped up the current implementation pass.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:174:        sessionSummary: 'Wrapped up the release work and recorded the final follow-through items.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:188:    recent_context: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:206:    key_decisions: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:571:      key_decisions: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md:48:<!-- ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md:56:<!-- /ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:13:import { collectSessionData, generateResumeContext, type CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:93:    ACTIVE_FILE: '.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:3:import { buildDistinctiveEvidence } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:18:        'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:24:      'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:61:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:66:        sessionSummary: 'Patched the structured memory-save schema so explicit authored metadata wins.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:100:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:105:        sessionSummary: 'Implemented a fallback save path for the title builder when explicit title is absent.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:11:const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:16:  sessionSummary: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:26:    const result = truncateOnWordBoundary(fixture.sessionSummary, 500);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:28:    const nextChar = fixture.sessionSummary.charAt(keptText.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:31:    expect(fixture.sessionSummary.length).toBeGreaterThan(600);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:34:    expect(fixture.sessionSummary.startsWith(keptText)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:36:    expect(collectSessionDataSource).toContain('truncateOnWordBoundary(data.sessionSummary, 500)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:21:vi.mock('../extractors/collect-session-data', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:40:describe('generate-context CLI authority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:56:    const dataFile = '/tmp/save-context-data.json';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:60:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:77:    const dataFile = '/tmp/save-context-data.json';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:89:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:111:      sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:114:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:123:        sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:137:      sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:140:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:149:        sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:163:      sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:167:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:182:        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:191:        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:203:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:219:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:231:      sessionSummary: 'Missing target should fail before workflow execution.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:234:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:246:      sessionSummary: 'Invalid target should fail validation before workflow execution.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:249:    const { main } = await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:264:      await import('../memory/generate-context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:34:      decisions: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:40:      anchors: ['summary', 'decisions'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:80:        'This rendered file contains a long scaffolded summary block, several headings, and anchored metadata, but no real files, observations, decisions, or outcomes from the session.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:114:      decisions: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:12:    sessionSummary: 'Test session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:166:      sessionSummary: 'Test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:174:      sessionSummary: 'Test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:192:      sessionSummary: 'Test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:201:      sessionSummary: 'Slow-path metadata propagation test.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:255:      recent_context: ['Investigated the failing save path'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:280:      sessionSummary: 'Patched the fast-path normalizer and verified the save flow end to end.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:284:      toolCalls: [{ tool: 'Bash', title: 'npm run build' }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:36:  sessionSummary: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:37:  const v1 = validator.validateMemoryQualityContent(validContent.replace('Decision: adopt deterministic scoring.', 'decisions: [TBD]'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:46:  const v4 = validator.validateMemoryQualityContent(validContent + '\nNo specific decisions were made during this session.\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:92:  assert(result.DECISION_COUNT >= 4, 'decision lexical cues should produce concrete decisions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:388:          'decisions: [TBD]'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts:66:          decisions: 0.20,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:92:          sessionSummary: 'Continuation verification for explicit causal links.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:113:          sessionSummary: 'Continuation verification for explicit causal links.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:186:        sessionSummary: 'Regular implementation summary with no lineage signal.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:216:          sessionSummary: 'Continuation request with two equally recent predecessors.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:232:          sessionSummary: 'Continuation request with two equally recent predecessors.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:102:    sessionSummary: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:111:      decisions: ['Use weighted document input'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:9:import { deriveCanonicalDocPointers } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/004-valid-level3/plan.md:28:- decision-record.md: Architectural decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts:34:      expect(content, `${docPath} should mention snake_case support`).toContain('recent_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts:54:      expect(content, `${docPath} should mention snake_case support`).toContain('recent_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts:2:// TEST: Mustache Conditional Sections for toolCalls and exchanges
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts:27:describe('Mustache conditional sections for toolCalls and exchanges', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts:102:    it('renders only toolCalls when exchanges is empty', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:3:import { collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:10:      sessionSummary: 'Completed the render-layer fixes and verified the final save output.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:43:      sessionSummary: 'The packet still has working-tree edits to finish.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:69:  - `collect-session-data.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:6:// - collect-session-data.js (424 LOC) - P0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:268:    const collectSessionData = require(path.join(EXTRACTORS_DIR, 'collect-session-data'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:492:    assertEqual(detectContextType({ Read: 5 }, 2), 'planning', 'EXT-Session-023: With decisions = planning');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:681:    // Test manual decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:683:    assertEqual(manualResult.DECISION_COUNT, 3, 'EXT-Decision-022: Manual decisions count correct');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:701:    assertEqual(emptyResult.DECISION_COUNT, 0, 'EXT-Decision-026: Empty observations = 0 decisions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1438:    // Test decision extractor with malformed decisions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1491:    const decisions = await extractors.extractDecisions({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1500:    if (decisions.DECISIONS && diagrams.DIAGRAMS) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1501:      pass('INT-002: Decisions and diagrams extracted together', `${decisions.DECISION_COUNT} decisions`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:37:    '- `decision-record.md` — Architectural decisions',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:53:    '- Removed project-state-snapshot, decisions, conversation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:202:    it('allows memory without old decisions section (no longer mandatory)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:207:      expect(result.missingAnchors).not.toContain('decisions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/package.json:6:  "main": "dist/memory/generate-context.js",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:8:import { collectSessionData } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:11:const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:15:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:18:      sessionSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:22:    expect(sessionSummary.length).toBeGreaterThan(500);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:23:    expect(sessionSummary.length).toBeLessThan(800);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:24:    expect(sessionData.SUMMARY).toBe(sessionSummary);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:33:      sessionSummary: longSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:42:    expect(source).toContain('renderOverviewSummary(data.sessionSummary, truncateOnWordBoundary(data.sessionSummary, 500))');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:51:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:59:${sessionSummary}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:74:        sessionSummary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:37:  sessionSummary: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/007-valid-anchors/memory/context.md:3:<!-- ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/007-valid-anchors/memory/context.md:11:<!-- /ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:255:    '- [DECISIONS](#decisions)',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:412:        sessionSummary: 'Phase 6 mirror drift reviewer fixture.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:434:        sessionSummary: 'Phase 6 clean mirror reviewer fixture.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:449:      { fixture: 'F-CHECK-DUP2-trigger.json', checkId: 'DUP2', severity: 'MEDIUM', field: 'decisions' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:466:          sessionSummary: `Trigger fixture for ${expectation.checkId}.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:487:        sessionSummary: 'Clean Phase 6 duplication reviewer fixture.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:9:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:130:          sessionSummary: 'Extended continuation run for the lineage fixture.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:8:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:73:  sessionSummary: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:222:      expect(rendered).toContain(fixture.sessionSummary);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:564:    // Test: Architectural decisions trigger documented
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:565:    if (fiveChecksDoc.includes('Architectural decisions') || fiveChecksDoc.includes('architectural')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:566:      pass('T-LA-006: Architectural decisions trigger documented', 'Architectural trigger found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:568:      fail('T-LA-006: Architectural decisions trigger documented', 'Architectural trigger not documented');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:15:    const { collectSessionData } = await import('../extractors/collect-session-data');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:19:      sessionSummary: 'Verified structured file capture counts.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:24:        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed packet doc discovery.' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:35:    const { collectSessionData } = await import('../extractors/collect-session-data');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:39:      sessionSummary: 'Verified fallback git capture counts.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:14:  sessionSummary?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:34:    const fixture = readFixture('F-AC2-authored-decisions.json');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:81:  it('keeps degraded lexical fallback alive when authored decisions are absent', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:92:          sessionSummary: 'Implemented the follow-on runtime after the planning save.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/implementation-summary.md:57:<!-- ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/implementation-summary.md:63:<!-- /ANCHOR:decisions -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-path-fragment.json:3:  "sessionSummary": "Phase 3 replay verifies that reusable trigger sanitization strips folder leaks before persistence while preserving the intended memory pipeline phrasing for retrieval.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC6-provenance.json:3:  "sessionSummary": "Phase 2 PR-4 adds JSON-mode git provenance without changing the authored memory narrative.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC6-provenance.json:10:        "The save path should preserve the authored summary and decisions."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC6-provenance.json:27:      "rationale": "Avoid leaking captured-session summary, observations, trigger phrases, and decisions into structured JSON saves."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-suspicious-prefix.json:3:  "sessionSummary": "Phase 3 replay keeps meaningful indexing terms while removing numbered and identifier-shaped junk that previously polluted saved trigger phrases.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-005a-anchor-scaffolding.json:30:    "decisions",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:5:    "sessionSummary": "This healthy overview proves the reviewer catches tier drift without introducing unrelated findings.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:30:    "- [DECISIONS](#decisions)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:42:    "<a id=\"decisions\"></a>",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC2-degraded-fallback.json:3:  "sessionSummary": "Degraded payload with no authored decisions but decision-like prose that should still produce lexical placeholders.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:5:    "sessionSummary": "This healthy overview proves the reviewer catches anchor drift without introducing unrelated findings.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:30:    "- [DECISIONS](#decisions)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-004b-last-clipping.json:9:        ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-003-canonical-trigger.json:3:  "sessionSummary": "Codex-cli-compact audit for tree-sitter and implementation-summary coverage across api cli mcp entry points.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:22:- Architecture decisions need formal documentation (ADRs)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-001-trigger-cluster.json:3:  "sessionSummary": "Investigated sibling-memory trigger duplication while keeping the claude optimization settings continuation discoverable for Phase 6.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:6:      "prompt": "Deduplicate repeated propositions across outcomes and decisions without dropping authored rationale.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:24:        ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:32:        ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:36:  "key_decisions": [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:47:      "path": ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:5:    "sessionSummary": "This healthy overview proves the reviewer catches missing provenance without introducing unrelated findings.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:30:    "- [DECISIONS](#decisions)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:42:    "<a id=\"decisions\"></a>",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC2-authored-decisions.json:3:  "sessionSummary": "Short neutral session summary for decision precedence testing.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-happy-path.json:3:  "sessionSummary": "Phase 3 replay preserves spec kit retrieval language, semantic search adjacency, and the mcp integration topic without introducing junk trigger phrases.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-synthetic-bigrams.json:3:  "sessionSummary": "We reject across 4 prioritization tiers and the full Level 3 spec set while the spec kit validator stays green for adjacent topic extraction.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:3:  "sessionSummary": "Phase 2 PR-3 validation keeps the importance-tier resolver authoritative while the managed-frontmatter rewrite re-emits both serialized tier locations from the same resolved value. This fixture models the historical drift case where an explicit important-tier save could later be normalized back to a default-looking frontmatter tier if migration treated the serializer as a second authority.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:24:    "Replay the fixture through generate-context.js and confirm tier parity"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-standalone-stopwords.json:3:  "sessionSummary": "Phase 3 replay proves standalone trigger junk no longer survives the save path when the packet context includes graph and issues language next to a valid mcp surface.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-standalone-stopwords.json:17:      "description": "Centralizes standalone stopword and allowlist decisions"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/checklist.md:115:- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:5:    "sessionSummary": "This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:30:    "- [DECISIONS](#decisions)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:42:    "<a id=\"decisions\"></a>",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:5:    "sessionSummary": "This healthy overview proves the reviewer stays quiet when the saved artifact remains internally consistent and the telemetry contract is satisfied end to end.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:30:    "- [DECISIONS](#decisions)",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:3:  "sessionSummary": "Phase 1 foundation work focused on two narrow repairs that improve memory quality without widening the remediation packet into unrelated metadata or reviewer behavior. The first repair aligned the OVERVIEW anchor identity so the table of contents, the HTML anchor, and the internal comment marker all point to the same destination. The second repair extracted a shared truncation helper so long session summaries stop at a clean word boundary and carry the canonical Unicode ellipsis instead of drifting between punctuation styles. The fixture describes a realistic verification pass where the helper was reused by the observation summary path, the OVERVIEW owner adopted the same contract, the compiled CLI replay was exercised with explicit JSON input, and the temporary replay artifacts were removed immediately after the check so the packet memory store stayed clean for the real documentation workflow.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:11:      "path": ".opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json:3:  "sessionSummary": "Phase 1 foundation work aligned the OVERVIEW anchor names across the template.",

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:131:import { getSessionSnapshot } from './lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:764:  // Phase 024 / Item 4: Session recovery digest from session-snapshot
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:766:    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:780:  } catch { /* session-snapshot not available — skip digest */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:792:    const { getSessionSnapshot: getSnap } = await import('./lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:809:  } catch { /* tool routing snapshot unavailable — skip */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1001:            const snapshot = getSessionSnapshot();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1005:                graphReady: snapshot.graphFreshness === 'fresh',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1006:                activationScaffoldReady: snapshot.primed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:208:  // manager to prevent IDOR. Callers cannot read/write working memory for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:210:  let sessionId: string | undefined = rawSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:274:    sessionId &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:343:          sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:469:      sessionId: sessionId!,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:499:  if (!useCognitive && sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:105:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:131:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:132:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:134:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:180:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:60:    sessionId: normalizeScopeMatchValue(scope.sessionId),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:157:        // Non-fatal — bulk delete proceeds without per-memory hash snapshots; ledger entries will lack prior hashes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:197:            const snapshot = hashById.get(memory.id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:201:              snapshot?.file_path ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:204:              snapshot?.spec_folder ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:217:        const snapshot = hashById.get(deletedId) ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:221:          priorHash: snapshot?.content_hash ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:230:            filePath: snapshot?.file_path ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:14:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:15:import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:405:  // Phase 024: Record bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:575:      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:599:  // Phase 024 / Item 9: Record bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:81:type SessionBootstrapModule = typeof import('./session-bootstrap.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:215:    sessionBootstrapModule = loadHandlerModule<SessionBootstrapModule>('session-bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:334:// Session bootstrap handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:11:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:12:import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194:  // Phase 027: Structural bootstrap contract
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:214:  // Record bootstrap telemetry once for the composite call.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:279:      // This section carries trust derived from the local structural snapshot,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:296:    kind: 'bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:331:      bootstrapPayload: payloadContract,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:351:  snapshot: LexicalCapabilitySnapshot | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:365:  if (typeof data.fallbackState !== 'string' && snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:366:    data.fallbackState = snapshot.fallbackState;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:312:/** Handle checkpoint_create tool — snapshots the current memory state for rollback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:661:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:741:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:15:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:16:import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:85:    const snapshot = getCodeGraphStatusSnapshot();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:86:    if (snapshot.status === 'ok' && snapshot.data) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:87:      const totalFiles = snapshot.data.totalFiles ?? 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:88:      const lastScan = snapshot.data.lastScanAt;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:101:  // Phase 027: Structural bootstrap contract for health surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:165:      sourceRefs: ['memory-surface', 'context-metrics', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:68:  sessionId: string = 'replay-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:99:        const statePath = getStatePath(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:101:        const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:30:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:41:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:46:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:68:  sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:378:            sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:428:          sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:518:      `Multiple open preflight records found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to disambiguate postflight.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:526:      `Multiple completed learning cycles found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to update the intended record.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:539:      { specFolder: spec_folder, taskId: taskId, sessionId: normalizedSessionId }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:75:      sessionId: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:82:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:312:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:473:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:479:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:510:  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:536:      storeResults: { type: 'boolean', default: true, description: 'Persist ablation metrics to eval_metric_snapshots (default: true).' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:738:// Phase 020: Composite session resume tool
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753:// Phase 024 / Item 7: Composite session bootstrap tool
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:781:  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:787:      sessionId: { type: 'string', minLength: 1, description: 'Session identifier for namespace isolation (required)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:821:    required: ['specFolder', 'loopType', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:835:      sessionId: { type: 'string', description: 'Optional session filter' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:845:  description: '[L9:CoverageGraph] Report deep-loop coverage graph health: node/edge counts grouped by kind and relation, current convergence signal values, momentum (signal deltas between snapshots), last iteration, schema version, and DB file size. Suitable for dashboards and synthesis surfaces.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:864:      iteration: { type: 'number', description: 'Current iteration number (used for snapshot persistence)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:865:      persistSnapshot: { type: 'boolean', default: false, description: 'When true, persist a signal snapshot for this iteration' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:113:    // Persist snapshot if requested
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:33:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:58:      sessionId: args.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:5:// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:312:    const expected = ['auto', 'quick', 'deep', 'focused', 'resume'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:353:  it('resume tokenBudget is 2000', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:355:    expect(memoryContext.CONTEXT_MODES.resume.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:101:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:109:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:128:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:152:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:190:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:227:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:309:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:320:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:373:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:28:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:79:    if (!args.sessionId || typeof args.sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:80:      return errorResponse('sessionId is required and must be a string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:112:        sessionId: args.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:172:              sessionId: args.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:13:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:16:import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:71:  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:116:function recordToolCall(sessionId?: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:118:  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:119:    lastActiveSessionId = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132:function isSessionPrimed(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:133:  return primedSessionIds.has(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:137:function markSessionPrimed(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:138:  primedSessionIds.add(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:139:  lastActiveSessionId = sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:303: * Phase C: Get top-N attention-weighted memory IDs from working memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:308: * @returns Set of memory IDs with high attention in working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:331:    // Graceful degradation — working memory boost is optional
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:338: * in the attention-weighted working memory set. Re-sorts results by
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:342: * @param attentionIds - Set of memory IDs from working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:343: * @returns Re-sorted trigger matches with working memory boost applied
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:354:  // Apply 1.3x multiplier when memory is in working memory set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:380:    // also appear in the working memory active set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:475:  // Phase 027: Structural bootstrap contract for auto-prime surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:492:  sessionId?: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:494:  // Derive a session key from explicit sessionId or tool args.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:495:  const effectiveSessionId = sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:496:    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:522:    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:560: * Reset priming state. When called with a sessionId, clears only that session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:563:function resetSessionPrimed(sessionId?: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:564:  if (sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:565:    primedSessionIds.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:6:// based on the session source (compact, startup, resume, clear).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18:import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:43:function handleCompact(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:45:  const pendingCompactPrime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120:    claudeSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:176:/** Handle source=resume: load resume context for continued session */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:177:function handleResume(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:178:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:216:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218:  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:225:      sections = handleCompact(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:232:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:233:      sections = handleResume(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:262:    clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:223:      mod.recordHistory(9, 'ADD', null, 'snapshot-added', 'system');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:229:        '/tmp/specs/001-test/memory/deleted-snapshot.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:34:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:40:  profile?: 'quick' | 'research' | 'resume' | 'debug';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:62:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:145:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:159:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:204:/** Arguments for session resume requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:210:/** Arguments for session bootstrap requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:264:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:276:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:282:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:221:            provenance: ['eval_metric_snapshots'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:227:            provenance: ['eval_metric_snapshots'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:234:            provenance: ['eval_metric_snapshots'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:248:            provenance: ['eval_metric_snapshots'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:255:            provenance: ['eval_metric_snapshots'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:852:    // Immediately clear working memory for cleared session (GAP 2).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1090:    // Immediately clear working memory for completed session (GAP 2).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1260:  const resumeCommand = specFolder
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1261:    ? `/spec_kit:resume ${specFolder}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1304:${resumeCommand}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:66:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:128:    claudeSessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:691: * Log quality metrics to the eval infrastructure (eval_metric_snapshots table).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:717:      INSERT INTO eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:29:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:46:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:69:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:92:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:114:      sessionId: 'session-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:147:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:156:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:164:      sessionId: 'session-9',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:185:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:211:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:242:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:249:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:255:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:4:// Phase 024: Lightweight read-only snapshot of session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:6:// single object for buildServerInstructions() and agent bootstrap.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:135:/** Build a read-only snapshot of the current session state. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:206: * Phase 027: Build a structural bootstrap contract for a given surface.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:269:      producer: 'session_snapshot',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:283:      sourceRefs: ['code-graph-db', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:68:export function getStatePath(sessionId: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:69:  const safe = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:83:export function loadState(sessionId: string): HookState | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:85:    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:170:export function saveState(sessionId: string, state: HookState): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:171:  const filePath = getStatePath(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:185:export function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:186:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:191:export function clearCompactPrime(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:192:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:202:  if (!saveState(sessionId, nextState)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:203:    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:212:export function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:213:  const prime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:215:    clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:221:export function updateState(sessionId: string, patch: Partial<HookState>): HookState {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:222:  const existing = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:225:    claudeSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:237:  if (!saveState(sessionId, state)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:238:    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:323:        ? (stored ? 'Ablation metrics stored to eval_metric_snapshots' : 'Ablation metrics storage failed')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:77:    sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:107:    scope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:15:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:44:  | 'bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:66:const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:76:const bootstrapRecords: BootstrapRecord[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:84:// Matches the session-snapshot graph staleness threshold.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:115:    case 'bootstrap':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:121:/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:127:  bootstrapRecords.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:135:/** Get all bootstrap records for diagnostics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:137:  return bootstrapRecords;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:144:/** Return a read-only snapshot of current session metrics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:147:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:338:      input: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:353:      input: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:354:      profile: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:380:      prompt: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:72:    sessionId: 'sess-abc123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9:/** Token budget for session priming (startup/resume) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | 'compact';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1109:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1140:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1156:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1169:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1179:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1269:    sessionId: governanceDecision.normalized.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1468:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:366:        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:376:    input.config.sessionId = 'test-001';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:408:    input.config.sessionId = 'test-001';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:6:// token usage, stores a snapshot, and updates lightweight session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60:function runContextAutosave(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:61:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:78:    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:120:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:124:  updateState(sessionId, patch);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:125:  touchedPaths.add(getStatePath(sessionId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:175:/** Store a token snapshot in the hook state (lightweight alternative to SQLite) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:177:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:181:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:184:  updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:192:  hookLog('info', 'session-stop', `Token snapshot: ${usage.totalTokens} total (${usage.model ?? 'unknown'}), est. $${cost}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:240:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:241:  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:244:  const stateBeforeStop = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:257:        storeTokenSnapshot(sessionId, usage, cost);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:261:        recordStateUpdate(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:283:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:288:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:302:    recordStateUpdate(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:309:    runContextAutosave(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:312:  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:24:/** Retrieve a memory's hash snapshot from the database. Returns null if unavailable. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:378:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:379:  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:393:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:408:    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:416:  updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:424:  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:88:        sessionId: 'sess-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:141:        sessionId: 'sess-456',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:155:      expect(sel.context.sessionId).toBe('sess-456');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:24:  it('sessionStart wrapper emits the startup banner and snapshot note', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:32:    expect(output).toContain('Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:9:  const sessionId = 'test-snapshot-store';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:15:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:18:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:26:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:29:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:32:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:39:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:42:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:26:/** Rollout defaults snapshot for telemetry and migration checkpoints. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:133:/** Returns the full capability snapshot for memory roadmap controls. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:53:      const sessionId = 'ses/sion/../bad';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:54:      const path = getStatePath(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:57:      expect(path).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:149:    || scope.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:143:  it('auto-bootstraps the creator as owner when creating a shared space', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:167:  it('treats stale create conflicts as updates and bootstraps only one owner', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:240:  it('rolls back shared-space creation when owner bootstrap fails', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:315:      prompt: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:34:function countSessionEntries(db: Database.Database, sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:36:    .get(sessionId) as CountRow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:50:      const sessionId = 'stress-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:63:          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:66:          const currentCount = countSessionEntries(db, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:71:      const finalCount = countSessionEntries(db, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:19:      producer: kind === 'bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:21:        : kind === 'resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:35:    const bootstrap = makePayload('bootstrap', 'bootstrap summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:36:    const resume = makePayload('resume', 'resume summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:40:      bootstrapPayload: bootstrap,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:41:      resumePayload: resume,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:50:    expect(plan.systemTransform?.content).toContain('startup snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:57:    const payload = makePayload('resume', 'resume summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:58:    expect(coerceSharedPayloadEnvelope(payload)?.kind).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:20:    { name: 'handleSessionBootstrap', kind: 'function', filePath: 'mcp_server/handlers/session-bootstrap.ts', callCount: 5 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:34:      text: 'Aligned structural bootstrap contract across auto-prime and session_* handlers.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:73:    expect(brief.startupSurface).toContain('- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:110:    expect(brief.startupSurface).toContain('startup snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:151:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:3:vi.mock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:7:      text: JSON.stringify({ status: 'ok', data: { memory: { resumed: true }, hints: ['resume ok'] } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:25:vi.mock('../lib/session/session-snapshot.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:34:import { handleSessionBootstrap } from '../handlers/session-bootstrap.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:35:import { handleSessionResume } from '../handlers/session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:37:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:40:describe('session-bootstrap handler', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:45:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:51:    expect(parsed.data.resume.memory).toEqual({ resumed: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:53:    expect(parsed.data.payloadContract.kind).toBe('bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:58:      resume: expect.any(Object),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:63:    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:71:  it('adds a structural hint when the bootstrap contract is stale', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:80:  getSessionState: (sessionId: string) => MockSessionStateRow | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:155:            for (const [sessionId, row] of sessionState.entries()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:157:                sessionState.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:166:              sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:193:            const existing = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:209:            sessionState.set(sessionId, nextRow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:214:            const [updatedAt, sessionId] = args as [string, string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:215:            const row = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:238:            const [updatedAt, sessionId] = args as [string, string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:239:            const row = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:257:            const [sessionId] = args as [string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:258:            return sessionState.has(sessionId) ? { 1: 1 } : undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:266:            const [sessionId] = args as [string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:267:            return cloneRow(sessionState.get(sessionId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:271:            const [sessionId] = args as [string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:272:            const row = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:335:    getSessionState: (sessionId: string) => cloneRow(sessionState.get(sessionId)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:472:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['list-a', 'list-b']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:480:        currentTask: 'resume crash recovery verification',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:504:        sessionId: 'session-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:508:        contextSummary: 'Need to resume from the saved recovery packet.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:518:      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:523:        sessionId: 'session-with-data',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:705:        sessionId: 'recover-fields',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:788:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['recoverable-a', 'recoverable-b']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:798:      expect(result.sessions.some((session) => session.sessionId === 'exclude-completed')).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:812:      const session = result.sessions.find((entry) => entry.sessionId === 'field-check');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:815:        sessionId: 'field-check',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:129:  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:158:  updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:184:  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:137:        snapshotSize: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:166:        snapshotSize: 123,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:276:          snapshotSize: 50,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:285:          snapshotSize: 50,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:409:        memory_snapshot: Buffer.from(''),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:410:        file_snapshot: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:518:        memory_snapshot: Buffer.from(''),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:519:        file_snapshot: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:10://   source: "startup" | "resume" | "clear"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:44:function handleCompact(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:45:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:46:  const pendingCompactPrime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:48:    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:142:/** Handle source=resume: load resume context */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:143:function handleResume(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:144:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:176:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:178:  hookLog('info', 'gemini:session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:187:      sections = handleCompact(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:194:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:195:      sections = handleResume(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:214:    clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:175:      const sessionId: string = 'test-session-T003';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:177:      const shouldSend: boolean = sessionManager.shouldSendMemory(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:182:      const sessionId: string = 'test-session-T003';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:183:      const shouldSend2: boolean = sessionManager.shouldSendMemory(sessionId, 999);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:195:      const sessionId: string = 'test-session-T004';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:198:      const firstCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:201:      const markResult: MarkResult = sessionManager.markMemorySent(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:204:      const secondCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:216:      const sessionId: string = 'test-session-T005';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:224:        const result: MarkResult = sessionManager.markMemorySent(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:231:        expect(sessionManager.shouldSendMemory(sessionId, memory)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:236:      `).get(sessionId) as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:280:      const sessionId: string = 'test-session-T007';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:290:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:291:      sessionManager.markMemorySent(sessionId, searchResults[3]); // 504
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:293:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:308:      const sessionId: string = 'test-session-T007b';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:314:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:337:      const sessionId: string = 'test-session-T008';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:346:      sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:347:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:348:      sessionManager.markMemorySent(sessionId, searchResults[2]); // 603
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:350:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:359:      const sessionId: string = 'test-session-T008-zero';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:366:      const { dedupStats: noSavingsStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:14:  function setScoreDirectly(sessionId: string, memoryId: number, score: number) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:18:    `).run(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:21:  function getScoreDirectly(sessionId: string, memoryId: number): number | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:24:    ).get(sessionId, memoryId) as { attention_score: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:28:  function countEntries(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:31:    ).get(sessionId) as { count: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:79:    const sessionId = 'decay-floor-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:88:      setScoreDirectly(sessionId, 1, 0.06);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:89:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:91:      const scoreAfter1 = getScoreDirectly(sessionId, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:100:        wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:103:      const scoreAfterMany = getScoreDirectly(sessionId, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:109:      const count = countEntries(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:115:    const sessionId = 'delete-threshold-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:122:      setScoreDirectly(sessionId, 2, 0.05);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:123:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:125:      const scoreAtFloor = getScoreDirectly(sessionId, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:130:      setScoreDirectly(sessionId, 3, 0.005);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:131:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:133:      const scoreClamped = getScoreDirectly(sessionId, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:142:      const deleteSessionId = sessionId + '-delete-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:163:      setScoreDirectly(sessionId, 4, 0.15);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:166:        wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:169:      const finalScore = getScoreDirectly(sessionId, 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:195:    const sessionId = 'mixed-scores-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:202:      setScoreDirectly(sessionId, 5, 0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:203:      setScoreDirectly(sessionId, 6, 0.05);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:204:      setScoreDirectly(sessionId, 7, 0.005);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:205:      setScoreDirectly(sessionId, 8, 0.03);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:207:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:209:      const s5 = getScoreDirectly(sessionId, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:215:      const s6 = getScoreDirectly(sessionId, 6);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:220:      const s7 = getScoreDirectly(sessionId, 7);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:228:      const s8 = getScoreDirectly(sessionId, 8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:88:  // SUITE: Summary stats respect sessionId filter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:89:  describe('T503: Summary stats respect sessionId filter', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:90:    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:103:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:120:        sessionId: sessB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:130:      // Query with sessionId = sessA
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:133:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:143:    it('T503-01b: sessionId records filter consistent', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:157:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:173:        sessionId: sessB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:185:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:192:      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:197:    it('T503-01c: sessionId filter normalizes whitespace to match stored records', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:200:      const sessionId = uniqueId('sess-trimmed');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:209:        sessionId: `  ${sessionId}  `,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:217:        sessionId: `  ${sessionId}  `,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:222:        sessionId: `  ${sessionId}  `,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:228:      expect(data.learningHistory[0].sessionId).toBe(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:292:  // SUITE: Combined sessionId + onlyComplete filters
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:293:  describe('T503: Combined sessionId + onlyComplete filters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:306:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:323:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:329:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:353:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:369:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:374:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:30:      sessionId: 'sess-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:38:      sessionId: 'sess-b',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:47:      sessionId: 'sess-b',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:76:  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:83:      sessionId: 'sess-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:91:      sessionId: 'sess-b',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:101:      message: expect.stringContaining('Provide sessionId'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:112:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:120:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:129:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:137:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:16:  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:164:        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:165:        data?: { sessionId?: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:171:      const fromMeta = parsed?.meta?.sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:175:      const fromData = parsed?.data?.sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:265:  const sessionId = resolveSessionId(result);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:267:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:18:    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:111:        memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:112:        file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:365:      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(corruptBlob, 'rollback-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:391:      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(corruptBlob, 'rollback-errors-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:416:      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(corruptBlob, 'rollback-counter-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:430:          snapshot: ['memory_index', 'working_memory'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:466:      testDb.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:651:    it('EXT-S16: clearExisting restore reinstates checkpoint vector snapshot', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:699:      const snapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:704:      const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(snapshot)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:707:        testDb.prepare(`INSERT OR REPLACE INTO checkpoints (name, created_at, memory_snapshot, metadata) VALUES (?, ?, ?, ?)`).run(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:210:  it('getDirtyNodes returns snapshot of current dirty set', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:212:    const snapshot = getDirtyNodes();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:213:    expect(snapshot.nodeIds.has('10')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:214:    expect(snapshot.nodeIds.has('20')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:220:    const snapshot = getDirtyNodes();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:221:    expect(snapshot.nodeIds.size).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:232:    const snapshot = getDirtyNodes();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:233:    expect(snapshot.markedAt).toBeGreaterThanOrEqual(before);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:39:import { handleSessionResume } from '../handlers/session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:45:describe('session-resume handler', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:65:    expect(parsed.data.payloadContract.kind).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:108:    expect(parsed.data.hints.some((h: string) => h.includes('Memory resume failed'))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:126:  it('skips bootstrap telemetry and includes sessionQuality in minimal mode', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:142:          '<!-- ANCHOR:project-state-snapshot -->',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:143:          '<a id="project-state-snapshot"></a>',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1241:          sessionId: 'session-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1254:          sessionId: 'session-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1310:          sessionId: 'session-p',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1327:          sessionId: 'session-p',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:362:    it('T015-DW6: traversal uses one transaction-backed snapshot for related memory details', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:367:      const snapshotRows: Record<string, Record<string, unknown>> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:373:        '10': snapshotRows['10']!,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:374:        '11': snapshotRows['11']!,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:389:            const rows = transactionActive ? snapshotRows : liveRows;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:34:    expect(trace.sessionId).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:38:  it('createTrace includes optional sessionId and intent', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:41:    expect(trace.sessionId).toBe('sess-123');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:236:      sessionId: 'session-id',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:263:    expect(sanitizedRecord.sessionId).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:13://   resume   — state + nextSteps + blockers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:29:export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86:/** Output of the `resume` profile formatter. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:111:  | { profile: 'resume'; data: ResumeProfile }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:352: * Format results as the `resume` profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:423:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:424:      return { profile: 'resume', data: formatResume(safeInput) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:908:  it('storeAblationResults() writes to eval_metric_snapshots table', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:917:      `SELECT * FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' ORDER BY id`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:962:    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:968:      `SELECT eval_run_id FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' LIMIT 1`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:977:    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:993:       FROM eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1008:    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1020:       FROM eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1282:        `SELECT metric_name, channel FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' ORDER BY id`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:704:      (a: string) => a.includes('/spec_kit:resume') || a.includes('recovery')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:25:/** Complete transport-only plan derived from shared startup/resume payloads. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:77:    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:83:  bootstrapPayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:85:  resumePayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:91:    args.bootstrapPayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:93:    args.resumePayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:17:import { snapshotDegrees, applyGraphSignals, clearGraphSignalsCache } from '../lib/graph/graph-signals';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:75:    CREATE TABLE degree_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:79:      snapshot_date TEXT NOT NULL DEFAULT (date('now')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:80:      UNIQUE(memory_id, snapshot_date)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:336:    it('snapshotDegrees captures current graph state', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:338:      const result = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:339:      expect(result.snapshotted).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:341:      const snapshots = db.prepare('SELECT * FROM degree_snapshots').all();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:342:      expect(snapshots.length).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:9:  | 'resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:11:  | 'bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:156:    | 'session_snapshot'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:4:// Feature catalog: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:23:  sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:36:function isEnabled(_sessionId?: string | null): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:44:function normalizeSessionId(sessionId: string | null | undefined): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:45:  if (typeof sessionId !== 'string') return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:46:  const trimmed = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:81:function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:83:  if (!isEnabled(sessionId) || !db) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:87:  const normalizedSessionId = normalizeSessionId(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:139:  sessionId: string | null | undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:141:  const normalizedSessionId = normalizeSessionId(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:145:    sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:94:  hookLog('info', 'gemini:session-stop', `SessionEnd hook fired for session ${sessionId} (reason: ${input.reason ?? 'unknown'})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:100:      updateState(sessionId, { lastSpecFolder: detectedSpec });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:108:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:114:  hookLog('info', 'gemini:session-stop', `Session ${sessionId} stop processing complete`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:431:    ).run(0, 'bootstrap', '[]', Date.now() - 8 * 24 * 60 * 60 * 1000, 'test-setup', 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:479:    // Force shadow mode by replacing the bootstrap entry with a recent timestamp.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:483:    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:558:    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:133:    sessionId: undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:8:describe('hook-state session resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:14:  it('recovers session state for resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:15:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:32:  it('preserves compact prime across resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:33:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:37:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:45:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:46:    expect(state!.claudeSessionId).toBe(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:37:  const pendingCompactPrime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:57:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:75:  clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:77:  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:45:  CREATE TABLE IF NOT EXISTS eval_metric_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:93:    INSERT INTO eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:398:      // Clear channel_results but keep snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:517:      testDb.exec('DELETE FROM eval_metric_snapshots');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:573:      expect(text).toContain('Total metric snapshots: 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:277:    const snapshot = setAdaptiveThresholdOverrides({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:287:    expect(snapshot).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:12:type MemorySnapshotRow = { memory_snapshot: Buffer };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:71:        memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:72:        file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:112:    try { mod.deleteCheckpoint('t213-snapshot-test'); } catch {}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:115:  describe('Working memory included in checkpoint snapshot', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:116:    it('T213-01: Checkpoint created with working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:129:      const checkpoint = expectDefined(mod.createCheckpoint({ name: 't213-snapshot-test' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:132:      expect(checkpoint.name).toBe('t213-snapshot-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:135:    it('T213-02: Snapshot contains correct working memory data', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:137:        .prepare<unknown[], MemorySnapshotRow>('SELECT memory_snapshot FROM checkpoints WHERE name = ?')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:138:        .get('t213-snapshot-test'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:139:      expect(raw.memory_snapshot).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:141:      const decompressed = zlib.gunzipSync(raw.memory_snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:142:      const snapshot = JSON.parse(decompressed.toString()) as SnapshotPayload;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:144:      expect(Array.isArray(snapshot.workingMemory)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:145:      expect(snapshot.workingMemory.length).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:147:      const entry = expectDefined(snapshot.workingMemory.find(entry => entry.memory_id === 1));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:162:      const result = mod.restoreCheckpoint('t213-snapshot-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:182:  describe('clearExisting clears and restores working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:183:    it('T213-06: clearExisting removed non-checkpoint working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:190:      const result = mod.restoreCheckpoint('t213-snapshot-test', true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:204:      const result = mod.restoreCheckpoint('t213-snapshot-test', true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:211:      const result = mod.restoreCheckpoint('t213-snapshot-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:217:  describe('Checkpoint with empty working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:15:// Session/working memory   → Linear decay (working-memory.ts) — separate domain
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:360:        memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:361:        file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:386:  function getExtractedRow(database: TestDatabase, sessionId: string, memoryId: number): ExtractedRow | undefined {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:398:    `).get(sessionId, memoryId) as ExtractedRow | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:422:      const sessionId = 'wm-provenance-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:427:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:438:      const row = getExtractedRow(database, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:454:      const sessionId = 'wm-no-count-probe';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:467:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:476:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:492:      `).get(sessionId, memoryId) as { cnt: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:504:      const sessionId = 'wm-provenance-update';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:509:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:520:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:534:      `).get(sessionId, memoryId) as { cnt: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:537:      const row = getExtractedRow(database, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:555:      const sessionId = 'wm-provenance-checkpoint';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:560:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:574:      const removed = workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:581:      const restoredRow = getExtractedRow(database, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:111:      input: 'resume quickly',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:458:describe('Eval run counter bootstrap across tables', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:459:  async function bootstrapAndGenerateNextId(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:465:      `eval-logger-bootstrap-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:516:    const id = await bootstrapAndGenerateNextId(7, 12);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:521:    const id = await bootstrapAndGenerateNextId(15, 9);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:526:    const id = await bootstrapAndGenerateNextId(null, null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:527:    // Counter bootstraps to 0, then returns incremented first run ID.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:15:// Feature catalog: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:92:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:102:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:110:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:227:function getOrCreateSession(sessionId: string | null = null): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:228:  if (sessionId) return sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:236:function clearSession(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:243:    ) as Database.Statement).run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:244:    sessionModeRegistry.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:279:function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:289:    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:308:    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:316:function sessionExists(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:317:  return getLatestSessionEventCounter(sessionId) !== null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:320:function getSessionEventCounter(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:321:  const current = getLatestSessionEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:346:    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:354:function getSessionInferredMode(sessionId: string): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:355:  const mode = sessionModeRegistry.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:359:function setSessionInferredMode(sessionId: string, mode: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:360:  const normalizedSessionId = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:379: * Set or update the attention score for a memory in working memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:382:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:392:    const currentEventCounter = nextEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:396:    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:407:      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:410:      enforceMemoryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:415:      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:431:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:440:  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:447:    const currentEventCounter = nextEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:475:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:489:    ) as Database.Statement).get(sessionId, memoryId) as { focus_count?: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:491:      enforceMemoryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:502:function nextEventCounter(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:505:  const current = getLatestSessionEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:514: * Enforce working memory capacity limit by LRU eviction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:519:function enforceMemoryLimit(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:525:    ) as Database.Statement).get(sessionId) as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:539:    `) as Database.Statement).run(sessionId, excess);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:560:function batchUpdateScores(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:564:  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:569:    const currentEventCounter = getCurrentEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:575:    `) as Database.Statement).all(sessionId) as Array<{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:628:function getCurrentEventCounter(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:629:  const current = getLatestSessionEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:637:function getLatestSessionEventCounter(sessionId: string): number | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:648:    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:678:function getSessionStats(sessionId: string): SessionStats | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:693:    `) as Database.Statement).get(sessionId) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:704:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:67:    sessionId: 'sess-A',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:218:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:219:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:220:      makeEvent({ memoryId: 'mem-B', sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:271:      makeEvent({ timestamp: 1000, sessionId: 'sess-in' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:272:      makeEvent({ timestamp: 5000, sessionId: 'sess-out' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:278:  it('treats distinct sessionIds as distinct sessions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:281:      makeEvent({ sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:282:      makeEvent({ sessionId: 'sess-1' }), // same session, not counted twice
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:283:      makeEvent({ sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:532:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-A', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:533:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-B', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:534:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-C', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:554:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-1', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:555:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-2', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:574:      makeEvent({ memoryId: 'mem-ok', sessionId: 's1', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:575:      makeEvent({ memoryId: 'mem-ok', sessionId: 's2', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:576:      makeEvent({ memoryId: 'mem-ok', sessionId: 's3', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:578:      makeEvent({ memoryId: 'mem-skip', sessionId: 's4', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:593:      makeEvent({ sessionId: 'sess-1', timestamp: BASE_TS - 10_000 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:594:      makeEvent({ sessionId: 'sess-2', timestamp: BASE_TS - 10_000 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:595:      makeEvent({ sessionId: 'sess-3', timestamp: BASE_TS - 10_000 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:613:      makeEvent({ sessionId: 'sX', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:614:      makeEvent({ sessionId: 'sY', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:615:      makeEvent({ sessionId: 'sZ', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:632:      makeEvent({ sessionId: 's1', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:633:      makeEvent({ sessionId: 's2', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:634:      makeEvent({ sessionId: 's3', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:52:    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:64:    expect(contract.provenance?.producer).toBe('session_snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:79:    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:102:    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:122:    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:138:    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:163:    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:170:/** Return a snapshot of the current dirty-node set (read-only). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:380: * Called by the application bootstrap to wire in the actual refresh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:604: * Set via `registerLlmBackfillFn()` in application bootstrap.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:68:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:223:  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:224:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:231:              memory: { resumed: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:232:              hints: ['resume ok'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:234:                kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:254:                  sourceRefs: ['session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:276:    vi.doMock('../lib/session/session-snapshot.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:285:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:24:    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:43:    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:467:      'Start a new session with fresh sessionId',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:478:      'Omit sessionId to disable session deduplication'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:486:      'Start fresh with new sessionId',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:37:      kind: 'bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:52:        sourceRefs: ['session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:51:/** Immutable snapshot of bounded thresholds and signal weights governing adaptive ranking. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:77:/** Result of an adaptive threshold tuning pass with before/after snapshots. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:420: * Clear adaptive signal history and shadow-run snapshots for rollback drills.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:447: * @returns Effective adaptive threshold snapshot after the update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:492: * @returns Default adaptive threshold snapshot.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:592: * @returns Previous and next threshold snapshots plus the summary that drove the tuning.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:37:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:247:      selectionContext.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:309:        sessionId: row.session_id ?? undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:14:      sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:50:      sessionId: 'normalized-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:58:      sessionId: 'normalized-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:63:      sessionId: '  normalized-session  ',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:71:      sessionId: 'normalized-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:420:// V19: degree_snapshots + community_assignments (N2 graph centrality)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:968:          CREATE TABLE IF NOT EXISTS degree_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:972:            snapshot_date TEXT NOT NULL DEFAULT (date('now')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:973:            UNIQUE(memory_id, snapshot_date)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:976:        database.exec('CREATE INDEX IF NOT EXISTS idx_degree_snapshots_memory ON degree_snapshots(memory_id)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:977:        database.exec('CREATE INDEX IF NOT EXISTS idx_degree_snapshots_date ON degree_snapshots(snapshot_date DESC)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:978:        logger.info('Migration v19: Created degree_snapshots table (N2a)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:981:          console.warn('[VectorIndex] Migration v19 warning (degree_snapshots):', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2154:      memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2155:      file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2287:        'Existing schema is not fully backward-compatible after bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:90:    const snapshot = captureScoreSnapshot(testResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:91:    expect(snapshot).toHaveLength(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:92:    expect(snapshot[0]).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:99:    expect(snapshot[2]).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'session_health', 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:724:          sessionId: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:938:      // structuredClone snapshot: callback receives a deep clone before post-dispatch mutations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1051:              arguments: { query: 'recent issues', sessionId: 'sess-sticky-1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1127:        memoryAwareTools: new Set<string>(['memory_context']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1132:        triggered: [{ memory_id: 11, matched_phrases: ['resume'] }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1146:      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledWith('session resume context')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1153:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1160:        memoryAwareTools: new Set<string>(['memory_context']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1173:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1610:    it('T28: L1 budget = 3500 (memory_context)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1615:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2080:      'memory_context': '[L1:Orchestration]',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:31:  'project-state-snapshot',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:133:        // Some anchors have 3 segments (e.g., 'project-state-snapshot').
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:131:describe('session bootstrap trust preservation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:151:            data: { resumed: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:185:    vi.doMock('../lib/session/session-snapshot.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:195:    const { handleSessionResume } = await import('../handlers/session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:196:    const resumeResult = await handleSessionResume({ specFolder: 'specs/026-root' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:197:    const parsedResume = JSON.parse(resumeResult.content[0].text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198:    const resumeStructuralSection = parsedResume.data.payloadContract.sections.find(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:202:    expect(resumeStructuralSection?.structuralTrust).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:208:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:215:    expect(parsed.data.resume).toMatchObject({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:7:// the export surface without bootstrapping a real database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:31:  'hooks/memory-surface.js': 520,   // actual: 503 — Memory surface hooks with constitutional cache, auto-surface, attention-enriched hints, priming, session snapshots, and Phase 024 bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:66:  /** Per-query MRR@5 values for bootstrap CI computation. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:69:  bootstrapCI?: BootstrapCIResult;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:287:   Uses bootstrap resampling to compute 95% CI for MRR@5.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:290:/** Result of bootstrap confidence interval computation. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:300:  /** Number of bootstrap iterations. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:314: * Uses percentile bootstrap with 10,000 iterations (default).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:319: * @param iterations - Number of bootstrap iterations (default: 10000).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:328:  // Filter out NaN/Infinity values to prevent poisoning bootstrap means
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:361:  const bootstrapMeans: number[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:367:    bootstrapMeans.push(sum / n);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:371:  bootstrapMeans.sort((a, b) => a - b);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:376:  const ciLower = bootstrapMeans[lowerIdx];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:377:  const ciUpper = bootstrapMeans[upperIdx];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:414: * Record BM25 baseline metrics to the eval DB (eval_metric_snapshots table).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:433:    INSERT INTO eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:525:  // Collect per-query MRR for bootstrap CI (REQ-S0-004)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:566:  // Compute bootstrap 95% CI for statistical significance (REQ-S0-004: p<0.05)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:567:  const bootstrapCI = computeBootstrapCI(perQueryMRR);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:575:    bootstrapCI,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:29:    sessionId?: unknown;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:395:      sessionId: 'session-secret',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:419:    expect(tracePayload.sessionId).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:8:// Uses: eval-db.ts singleton, eval_metric_snapshots table,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:69:  /** Per-metric, per-channel summary statistics derived from channel-tagged snapshots. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:105:  /** Total metric snapshots included in this report after filters/limit. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:130:/** Row shape from eval_metric_snapshots. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:185: * Query all metric snapshots, optionally filtered.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:192:             FROM eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:265: * Group snapshots by sprint label. Sprint label is derived from:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:270:  snapshots: SnapshotRow[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:275:  for (const snap of snapshots) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:295:function getSprintTimeBounds(snapshots: SnapshotRow[]): { firstSeen: string; lastSeen: string } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:296:  const timestamps = snapshots.map((snapshot) => snapshot.created_at).filter(Boolean).sort();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:322: * Build a SprintReport from grouped snapshots and channel results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:326:  snapshots: SnapshotRow[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:330:  const evalRunIds = [...new Set(snapshots.map(s => s.eval_run_id))];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:332:  // Group snapshots by metric name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:338:  for (const snap of snapshots) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:435:  const { firstSeen, lastSeen } = getSprintTimeBounds(snapshots);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:569: * Queries the eval database for metric snapshots and channel results,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:581:  // Query snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:582:  const snapshots = queryMetricSnapshots(db, config);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:585:  const sprintGroups = groupBySprint(snapshots, config.sprintFilter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:611:    limitedSprintEntries.flatMap(({ groupSnapshots }) => groupSnapshots.map((snapshot) => snapshot.eval_run_id))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:656:  lines.push(`Total metric snapshots: ${report.totalSnapshots}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:44:describe('Memory state baseline snapshots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:63:    const snapshot = captureMemoryStateBaselineSnapshot({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:70:    expect(snapshot.evalRunId).toBe(42);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:71:    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:72:    expect(snapshot.metrics['isolation.distinct_spec_folders']).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:73:    expect(snapshot.metrics['isolation.unscoped_rows']).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:74:    expect(snapshot.metrics['isolation.missing_session_scope_rows']).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:75:    expect(snapshot.metrics['isolation.unknown_context_type_rows']).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:76:    expect(snapshot.metrics['schema.version']).toBe(21);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:77:    expect(snapshot.persistedRows).toBe(Object.keys(snapshot.metrics).length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:86:        FROM eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:89:      expect(row.total).toBe(Object.keys(snapshot.metrics).length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:96:    const snapshot = captureMemoryStateBaselineSnapshot({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:101:    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:102:    expect(snapshot.metrics['isolation.distinct_spec_folders']).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:103:    expect(snapshot.metrics['schema.version']).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:104:    expect(snapshot.persistedRows).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:36:    sessionId: 'sess-abc',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:217:      sessionId: 'session-XYZ',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:232:    logFeedbackEvent(db, makeEvent({ sessionId: null }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:327:  it('filters by sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:329:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-1' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:330:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-2' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:332:    const forSess1 = getFeedbackEvents(db, { sessionId: 'sess-1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:216:      expect(modes.resume.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:226:    it('T205-D3: Budget ordering is logical (quick < resume < focused < deep)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:231:      const resumeBudget = modes.resume.tokenBudget;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:235:      expect(resumeBudget).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:238:      if (quickBudget === undefined || resumeBudget === undefined || focusedBudget === undefined || deepBudget === undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:241:      expect(quickBudget).toBeLessThan(resumeBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:242:      expect(resumeBudget).toBeLessThan(focusedBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:32:    it('returns a valid SessionMetrics snapshot', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:34:      expect(metrics.sessionId).toMatch(/^sess_/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:127:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:160:      sessionId: undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:22:  function insertWorkingMemory(sessionId: string, memoryId: number, score: number = 0.8) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:26:    `).run(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:29:  function countWorkingMemory(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:32:    ).get(sessionId) as { count: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:74:    // Init working memory module first (creates working_memory table)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:103:  describe('T302-GAP2a: completeSession() clears working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:104:    it('T302-04 to T302-06: completeSession() clears working memory entries', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:105:      const sessionId = 'complete-test-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:107:      // Setup: seed working memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:108:      insertWorkingMemory(sessionId, 1, 0.9);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:109:      insertWorkingMemory(sessionId, 2, 0.7);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:110:      insertWorkingMemory(sessionId, 3, 0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:112:      const countBefore = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:118:      // Call completeSession — should clear working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:119:      const result = sm.completeSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:122:      // Verify working memory entries are gone
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:123:      const countAfter = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:132:  describe('T302-GAP2b: clearSession() clears working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:133:    it('T302-07 to T302-10: clearSession() clears both working memory and sent_memories', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:134:      const sessionId = 'clear-test-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:136:      // Seed working memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:137:      insertWorkingMemory(sessionId, 4, 0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:138:      insertWorkingMemory(sessionId, 5, 0.6);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:140:      const countBefore = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:147:      `).run(sessionId, 'test-hash-123', 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:149:      // Call clearSession — should clear both sent_memories AND working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:150:      const result = sm.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:153:      // Verify working memory entries are gone
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:154:      const countAfter = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:160:      ).get(sessionId) as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:326:  it('T008.6: writes exactly 5 rows to eval_metric_snapshots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:331:      `SELECT * FROM eval_metric_snapshots WHERE channel = 'bm25'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:343:      `SELECT metadata FROM eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:362:      `SELECT metric_name FROM eval_metric_snapshots WHERE channel = 'bm25'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:377:      `SELECT metric_value FROM eval_metric_snapshots WHERE metric_name = 'mrr@5'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:89:  -- Metric snapshots for tracking over time
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:90:  CREATE TABLE IF NOT EXISTS eval_metric_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:101:  CREATE INDEX IF NOT EXISTS idx_metric_snapshots_run
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:102:    ON eval_metric_snapshots (eval_run_id, metric_name, created_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:179:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:206:      const result = mod.enhanceDescription('memory_context', 'Some description text');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:237:        { tool: 'memory_context', expected: 3500 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:255:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:265:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:272:      expect(info.tools).toContain('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:276:      const info1 = mod.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:277:      const info2 = mod.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:415:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:14:    snapshot?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:50:  'degree_snapshots',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:451:  expect(checkpoint?.memory_snapshot).toBeTruthy();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:452:  const payload = zlib.gunzipSync(checkpoint!.memory_snapshot!);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:491:      INSERT INTO checkpoints (id, name, created_at, spec_folder, git_branch, memory_snapshot, file_snapshot, metadata)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:499:      sourceCheckpoint!.memory_snapshot,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:500:      sourceCheckpoint!.file_snapshot,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:519:    const degreeCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM degree_snapshots').get() as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:536:  it('stores the manifest and omits skip tables from snapshot payloads', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:541:    expect(payload.manifest?.snapshot).toEqual([...AUTHORITATIVE_TABLES]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:544:    const snapshottedTables = Object.keys(payload.tables ?? {}).sort();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:545:    expect(snapshottedTables).toEqual([...AUTHORITATIVE_TABLES].sort());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:548:      expect(snapshottedTables).not.toContain(tableName);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:50:        memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:51:        file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:71:  it('surfaces certainty fields in the shared resume payload', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:113:    vi.doMock('../lib/session/session-snapshot.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:123:    const { handleSessionResume } = await import('../handlers/session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:142:      'memory-resume': 'estimated',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:161:  it('surfaces certainty fields in the shared bootstrap payload', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:162:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:169:              memory: { resumed: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:170:              hints: ['resume ok'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:172:                kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:192:                  sourceRefs: ['session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:214:    vi.doMock('../lib/session/session-snapshot.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:224:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:238:    expect(parsed.data.payloadContract.summary).toContain('resume=estimated');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:243:      'resume-surface': 'estimated',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager-health.vitest.ts:8:  it('returns a zero-state snapshot without touching the DB accessor', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:4:// Feature catalog: Memory roadmap baseline snapshot
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:6:// Can optionally persist snapshots into eval_metric_snapshots.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:147: * Persist a captured baseline snapshot into eval metric history.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:149: * @param snapshot - Baseline snapshot to persist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:150: * @param evalDb - Eval database that stores metric snapshots.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:151: * @returns Number of rows written to `eval_metric_snapshots`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:153:function persistMemoryStateBaselineSnapshot(snapshot: MemoryStateBaselineSnapshot, evalDb: Database.Database): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:155:    INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:159:  const metadata = JSON.stringify(snapshot.metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:162:  for (const [metricName, metricValue] of Object.entries(snapshot.metrics)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:163:    insert.run(snapshot.evalRunId, metricName, metricValue, 'memory-state-baseline', null, metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:174: * @returns Baseline snapshot for the current eval and context databases.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:194:    const snapshot: MemoryStateBaselineSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:210:      snapshot.persistedRows = persistMemoryStateBaselineSnapshot(snapshot, evalDb);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:213:    return snapshot;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:144:      if (sql.includes('FROM degree_snapshots')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:68:      memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:69:      file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:166:      memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:167:      file_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:239:  mutate: (snapshot: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:244:    'SELECT memory_snapshot FROM checkpoints WHERE name = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:245:  ).get(checkpointName) as { memory_snapshot: Buffer } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:247:  const snapshot = JSON.parse(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:248:    zlib.gunzipSync(requireValue(row).memory_snapshot).toString('utf-8')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:252:  mutate(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:253:  database.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:254:    zlib.gzipSync(Buffer.from(JSON.stringify(snapshot))),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:281:    'session-a', 'active', 'tenant-spec', 'snapshot-task-a', 'tenant-a', now, now,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:282:    'session-b', 'active', 'tenant-spec', 'snapshot-task-b', 'tenant-b', now, now,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:333:      expect(typeof first.snapshotSize).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:345:      // The operation is valid as long as no fatal "not found / invalid snapshot" errors occur.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:347:        error.includes('Checkpoint not found') || error.includes('Invalid snapshot format')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:446:          spec_folder TEXT, git_branch TEXT, memory_snapshot BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:447:          file_snapshot BLOB, metadata TEXT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:484:  describe('Scoped causal edge snapshots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:485:    it('T503-11: spec-folder checkpoint snapshots only in-folder causal edges', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:487:        name: 'scoped-edge-snapshot',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:493:        'SELECT memory_snapshot FROM checkpoints WHERE name = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:494:      ).get('scoped-edge-snapshot') as { memory_snapshot: Buffer } | undefined);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:495:      const snapshot = JSON.parse(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:496:        zlib.gunzipSync(stored.memory_snapshot).toString('utf-8')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:499:      expect(snapshot.causalEdges).toEqual([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:504:      mod.deleteCheckpoint('scoped-edge-snapshot');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:630:      `).run('session-test', 'active', 'test-spec', 'snapshot-task', now, now, 'session-other', 'active', 'other-spec', 'other-snapshot-task', now, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:634:      `).run('session-test', 'hash-test-snapshot', 1, now, 'session-other', 'hash-other-snapshot', 2, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:678:      ).toEqual({ current_task: 'snapshot-task' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:684:      ).toEqual({ memory_hash: 'hash-test-snapshot' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:687:      ).toEqual({ memory_hash: 'hash-other-snapshot', sent_at: 'other-live-sent' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:690:    it('T503-15: unscoped merge restore preserves auxiliary rows outside the checkpoint snapshot', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:712:      `).run('session-test', 'active', 'test-spec', 'snapshot-task', now, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:716:      `).run('session-test', 'hash-test-snapshot', 1, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:766:      ).toEqual({ current_task: 'snapshot-task' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:772:      ).toEqual({ memory_hash: 'hash-test-snapshot' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:799:      updateCheckpointSnapshot(database, 'scoped-rollback-restore', (snapshot) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:800:        const table = snapshot.tables?.shared_spaces;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:889:      ).toEqual({ current_task: 'snapshot-task-a' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:892:      ).toEqual({ current_task: 'snapshot-task-b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-delete-cascade.vitest.ts:43:    db.prepare(`INSERT INTO degree_snapshots (memory_id, degree_count, snapshot_date) VALUES (?, ?, datetime('now'))`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-delete-cascade.vitest.ts:56:    expect(db.prepare('SELECT COUNT(*) AS count FROM degree_snapshots WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-delete-cascade.vitest.ts:76:    db.prepare(`INSERT INTO degree_snapshots (memory_id, degree_count, snapshot_date) VALUES (?, ?, datetime('now'))`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-delete-cascade.vitest.ts:89:    expect(db.prepare('SELECT COUNT(*) AS count FROM degree_snapshots WHERE memory_id = ?').get(rootId)).toEqual({ count: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:61:    'DELETE FROM degree_snapshots WHERE memory_id = ?',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:9:  provenance: ['eval_metric_snapshots', 'normalized_reader'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:500:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:512:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:520:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:529:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:536:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:545:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:552:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:561:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:568:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:577:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:584:    // Build snapshot with long word descriptions that exceed 250 chars
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:586:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:597:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:607:    // Build snapshot with many distinct words
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:609:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:618:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:627:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:639:    const result = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:876:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:884:    const suffResult = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:894:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:906:    const suffResult = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1039:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1047:    const suffResult = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1074:    const snapshot: MemoryEvidenceSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1082:    const suffResult = evaluateMemorySufficiency(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:23:          trackedPayloadKinds: ['resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:29:          payloadKind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:30:          dedupeKey: 'system:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:31:          content: 'Summary: resume summary',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:36:          payloadKind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:37:          dedupeKey: 'messages:resume:0',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:43:          payloadKind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:126:        specKitCompactCodeGraph: 'messages:resume:0',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:203:    expect(status).toContain('resume_mode=minimal');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:139:    it('T004-10: eval_metric_snapshots table exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:140:      expect(tableExists('eval_metric_snapshots')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:203:    it('T004-15: eval_metric_snapshots has required columns', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:204:      const cols = getColumns('eval_metric_snapshots');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:272:    it('T004-21: Can insert into eval_metric_snapshots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:275:        INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:181:  it('T017-02: Handles minimal session state (only sessionId)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:185:  it('T017-03: Handles undefined sessionId gracefully', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:200:  it('T018-02: Displays sessionId in code format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:244:describe('T020: Quick resume command (DB-dependent)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:246:  it('T020-01: Generates /spec_kit:resume command when specFolder is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:49:  it('resume session continues event_counter and preserves working memory items', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:52:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:53:    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:55:    expect(workingMemory.sessionExists('resume-session')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:56:    expect(workingMemory.getSessionEventCounter('resume-session')).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:58:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:59:    expect(workingMemory.getSessionEventCounter('resume-session')).toBeGreaterThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:61:    const rows = workingMemory.getWorkingMemory('resume-session');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:62:    const resumedRow = rows.find((row) => row.memory_id === 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:63:    expect(resumedRow?.event_counter).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:26:import { snapshotDegrees } from '../graph/graph-signals.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:66:  snapshot: [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:94:    'degree_snapshots',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:151:  memory_snapshot: Buffer | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:152:  file_snapshot: Buffer | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:162:  snapshotSize: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:195:  snapshot: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:318:  'active_memory_projection', 'auto_entities', 'community_assignments', 'degree_snapshots',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:592:function snapshotCausalEdgesForMemoryIds(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:692:      return snapshotCausalEdgesForMemoryIds(database, memoryIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:830:    snapshot: [...CHECKPOINT_MANIFEST.snapshot],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:836:function buildLegacyTableSnapshots(snapshot: CheckpointSnapshot): Record<string, TableSnapshot> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:839:  if (Array.isArray(snapshot.memories)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:841:      columns: Object.keys(snapshot.memories[0] ?? {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:842:      rows: snapshot.memories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:846:  if (Array.isArray(snapshot.workingMemory)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:848:      columns: Object.keys(snapshot.workingMemory[0] ?? {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:849:      rows: snapshot.workingMemory,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:853:  if (Array.isArray(snapshot.vectors)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:856:      rows: snapshot.vectors.map((row) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:863:  if (Array.isArray(snapshot.causalEdges)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:865:      columns: Object.keys(snapshot.causalEdges[0] ?? {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:866:      rows: snapshot.causalEdges,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:873:function getSnapshotTables(snapshot: CheckpointSnapshot): Record<string, TableSnapshot> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:874:  const legacyTables = buildLegacyTableSnapshots(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:877:    ...(snapshot.tables ?? {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1203:      name: 'degree-snapshots',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1205:      run: () => snapshotDegrees(database),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1209:      deps: ['degree-snapshots'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1300:  const snapshotColumns = new Set<string>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1304:        snapshotColumns.add(key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1355:  const ordered = preferredOrder.filter((column) => snapshotColumns.has(column));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1356:  const extras = Array.from(snapshotColumns)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1366:   loss from corrupt/malformed checkpoint snapshots.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1370: * Validates a single memory row from a checkpoint snapshot.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1420:    // Wrap snapshot SELECTs + INSERT + overflow DELETE in a transaction for atomicity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1434:      for (const tableName of CHECKPOINT_MANIFEST.snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1460:      const snapshot: CheckpointSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1470:      const snapshotJson = JSON.stringify(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1471:      const compressed = zlib.gzipSync(Buffer.from(snapshotJson));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1477:        INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1517:        snapshotSize: compressed.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1529:    console.error(`[checkpoints] Created checkpoint "${name}" (${checkpointInfo.snapshotSize} bytes compressed)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1552:      SELECT id, name, created_at, spec_folder, git_branch, LENGTH(memory_snapshot) as snapshot_size, metadata
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1566:      snapshotSize: (row.snapshot_size as number) || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1615:    if (!checkpoint || !checkpoint.memory_snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1620:    // Decompress snapshot
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1621:    const decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1622:    const snapshot = JSON.parse(decompressed.toString()) as CheckpointSnapshot;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1623:    const tableSnapshots = getSnapshotTables(snapshot);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1625:    const memoryRows = memorySnapshot?.rows ?? snapshot.memories;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1628:      result.errors.push('Invalid snapshot format');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1633:    const snapshotMemoryIds = getMemoryIds(memoryRows);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1639:      new Set([...currentScopedMemoryIds, ...snapshotMemoryIds])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1780:            // If the snapshot ID already exists for a different logical identity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1825:          // Apply the snapshot values without triggering CASCADE deletes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1908:    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:104:    expect(modes).toContain('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:132:  it('T006: resume mode has resume strategy and 2000 token budget', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:133:    const resumeMode: ContextMode = CONTEXT_MODES.resume;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:134:    expect(resumeMode.strategy).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:135:    expect(resumeMode.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:226:  it('T020: No intent maps to quick or resume by default', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:229:      expect(mode).not.toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:301:      resumedSession: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:320:  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:321:    const resumed = buildSessionTransitionTrace({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:323:      resumedSession: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:324:      effectiveMode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:330:    expect(resumed.signalSources).toEqual([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:331:      'session-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:335:    expect(resumed.confidence).toBe(0.95);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:336:    expect(resumed.reason).toBe('resumed session inferred resume mode');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:340:      resumedSession: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:372:      resumedSession: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:571:  it('T061: Resume mode strategy is resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:572:    expect(CONTEXT_MODES.resume.strategy).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:576:    expect(CONTEXT_MODES.resume.name).toBe('Resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:580:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:582:      desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:587:    expect(CONTEXT_MODES.resume.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:591:    const resumeBudget: number = CONTEXT_MODES.resume.tokenBudget!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:593:    expect(resumeBudget).toBeLessThan(deepBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:598:    expect(mappedModes).not.toContain('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:603:    const resumeCount: number = strategies.filter((s: string) => s === 'resume').length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:604:    expect(resumeCount).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:608:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:615:    expect(CONTEXT_MODES.resume.description.length).toBeGreaterThan(10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:619:    const resume: ContextMode = CONTEXT_MODES.resume;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:620:    expect(resume.name).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:621:    expect(resume.description).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:622:    expect(resume.strategy).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:623:    expect(resume.tokenBudget).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:668:    // And via keyword detection, can route to resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:728:    const resume: number = CONTEXT_MODES.resume.tokenBudget!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:732:    expect(quick).toBeLessThan(resume);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:733:    expect(resume).toBeLessThan(focused);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:849:    expect(Object.keys(CONTEXT_MODES).sort()).toEqual(['auto', 'deep', 'focused', 'quick', 'resume']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:1002:      resume: 2000
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:49:  checkpoint: ['snapshot', 'backup'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:81:  snapshot: MemoryIndexRow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:113:  snapshot: MemoryIndexRow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:349:  // D1: All fields are serialized for archival — only `.snapshot` is read back
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:358:    snapshot: row,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:396:    snapshot: metadata?.snapshot ?? getMemoryRow(database, row.memory_id),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:842: * @returns Ordered lineage snapshots from oldest to newest version.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:933: * Resolve the currently active lineage snapshot for a memory logical key.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:937: * @returns Active lineage snapshot when one exists.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:960: * Resolve the lineage snapshot visible at a specific point in time.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1289: * Compatibility wrapper that resolves the active snapshot for a memory target.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1292: * @param target - Memory identifier used to resolve the active snapshot.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1293: * @returns Active lineage snapshot when one exists.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1303: * Compatibility wrapper that resolves the snapshot visible at a given time.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:826:  snapshot: { contentHash: string | null; updatedAt: string | null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:829:  return snapshot.contentHash !== (getOptionalString(currentRow, 'content_hash') ?? null)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:830:    || snapshot.updatedAt !== (getOptionalString(currentRow, 'updated_at') ?? null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:52:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:135:  sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:164:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:32:    sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:69:    params.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:140:    expect(activeSnapshot?.snapshot.id).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:142:    expect(directAsOfSnapshot?.snapshot.id).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:146:    expect(chain[0]?.snapshot.id).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:391:    expect(activeSnapshot?.snapshot.id).toBe(93);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:393:    expect(asOfSnapshot?.snapshot.id).toBe(92);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:16:// - Results storage in eval_metric_snapshots table
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:724: * Store ablation results in the eval_metric_snapshots table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:750:      INSERT INTO eval_metric_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:2:// Covers: snapshotDegrees, computeMomentum,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:8:  snapshotDegrees,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:48:    CREATE TABLE degree_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:52:      snapshot_date TEXT NOT NULL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:53:      UNIQUE(memory_id, snapshot_date)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:85:/** Insert a degree snapshot for a specific date. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:90:  snapshotDate: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:93:    INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:95:  `).run(memoryId, degreeCount, snapshotDate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:133:  // 1. snapshotDegrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:134:  describe('snapshotDegrees', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:135:    it('returns 0 snapshotted for an empty graph', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:136:      const result = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:137:      expect(result).toEqual({ snapshotted: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:140:    it('snapshots 2 nodes for a single edge', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:143:      const result = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:144:      expect(result.snapshotted).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:146:      // Verify snapshots were written
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:147:      const rows = db.prepare('SELECT * FROM degree_snapshots ORDER BY memory_id').all() as Array<{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:158:    it('snapshots correct degree counts for multiple edges', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:164:      const result = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:165:      expect(result.snapshotted).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:167:      const rows = db.prepare('SELECT * FROM degree_snapshots ORDER BY memory_id').all() as Array<{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:180:    it('re-snapshot same day uses INSERT OR REPLACE (idempotent)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:183:      const result1 = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:184:      expect(result1.snapshotted).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:186:      // Add another edge and re-snapshot
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:188:      const result2 = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:189:      expect(result2.snapshotted).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:191:      // Verify no duplicate rows — only one row per (memory_id, snapshot_date)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:192:      const rows = db.prepare('SELECT * FROM degree_snapshots').all();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:202:      const result = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:205:      // Only node 2 is finite, so snapshotted = 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:206:      expect(result.snapshotted).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:249:    it('returns 0 when no historical snapshot exists', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:253:      // No snapshot at -7 days -> pastDegree = null -> momentum = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:274:      // No historical snapshots for any node -> momentum is 0 for all
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:408:      // Node 1 has no historical snapshot -> momentum = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:415:      // MomentumBonus = 0 (no historical snapshot)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:432:      // Momentum for 30: no historical snapshot -> momentum = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:450:      // Node 2 has no historical snapshot -> momentum = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:468:      // Node 1 has no historical snapshot -> momentum = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:488:      // Momentum for 3: no historical snapshot -> momentum 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:502:      // Momentum = 0 (no historical snapshot)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:906:      const snapshot = snapshotDegrees(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:907:      expect(snapshot.snapshotted).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:909:        'SELECT degree_count FROM degree_snapshots WHERE memory_id = 1'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:918:      // Momentum: no historical snapshot -> 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:940:      expect(() => snapshotDegrees(db)).not.toThrow();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:965:    it('getPastDegree returns snapshot from 7 days ago', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:974:    it('getPastDegree returns null when no snapshot at -7 days', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:975:      // Insert snapshot for a different date (not 7 days ago)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:139:  'snapshot': 'checkpoint',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:140:  'snapshots': 'checkpoint',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:23:    it('T531-1: sessionId parameter accepted by search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:28:            sessionId: 'dedup-session-001',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:35:        expect(getErrorMessage(error)).not.toContain('sessionId');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:44:            sessionId: 'dedup-session-002',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:75:    it('T531-4: Search without sessionId accepted (no dedup)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:80:            // No sessionId — dedup should not activate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:94:    it('T531-5: Default dedup behavior with sessionId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:99:            sessionId: 'dedup-session-default',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:115:            sessionId: 'dedup-session-disabled',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:97:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:139:      sessionId: 'sess-ux-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:190:    const resumed = await handleMemorySearch({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:195:    const resumedEnvelope = parseEnvelope(resumed);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:196:    const resumedData = resumedEnvelope.data as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:80:function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:83:  ).run(sessionId, hash, memoryId, sentAt);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:232:    it('returns failure for empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:264:    it('empty sessionId returns zeros', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:334:    it('generates a server session when caller omits sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:430:    it('rejects empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:449:    it('fails for empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:506:        expect(state.sessionId).toBe('recover-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:539:    it('rejects empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:560:        const ids = r.sessions.map((s: InterruptedSession) => s.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:564:        const s1 = r.sessions.find((s: InterruptedSession) => s.sessionId === 'int-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:577:      const ids = r.sessions.map((session: InterruptedSession) => session.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:598:        sessionId: 'gen-md-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:615:      expect(md).toContain('/spec_kit:resume specs/005');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:619:      // Minimal input (only sessionId required)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:620:      const md = sm.generateContinueSessionMd({ sessionId: 'gen-md-2' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:213:    const snapshotSpecFolder = `specs/${checkpointName('t011-c7c-snapshot-folder')}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:214:    const snapshotPath = `${snapshotSpecFolder}/memory/snapshot.md`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:223:      snapshotSpecFolder,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:224:      snapshotPath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:225:      'snapshot-title',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints-edge.vitest.ts:230:    await createCheckpointExpectSuccess(checkpoint, snapshotSpecFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:316:      'Checkpoint snapshots preserve database state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:196:    it('namespace matches sessionId format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/db-dimension-integrity.vitest.ts:161:      expect(() => initializeDb(dbPath)).toThrow(/EMBEDDING DIMENSION MISMATCH|Refusing to bootstrap/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:63:      console.warn('[eval-logger] generateEvalRunId bootstrap warning:', msg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:64:      // Keep _evalRunCounterInitialized=false so next call can retry bootstrap.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:424:Contenu en francais: cafe, resume, naive, cliche.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:976:  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:202:            sessionId: 'sess-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:214:        expect(message.includes('sessionId')).not.toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:44:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:63:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:191:      event.sessionId ?? null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:257:    if (opts.sessionId !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:259:      params.push(opts.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:671: * (quick, research, resume, debug) when no explicit profile is specified by the caller.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:34: * Score snapshot helpers for Stage 4 invariants.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:59:    trackQueryAndDetect(db, 'sess-b', 'memory context resume', 'q1', ['mem-9']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:61:    const detection = trackQueryAndDetect(db, 'sess-b', 'resume memory context', 'q2', ['mem-10']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:62: * in at least one causal edge. Writes into the `degree_snapshots` table
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:65: * @returns The number of nodes snapshotted.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:67:export function snapshotDegrees(db: Database.Database): { snapshotted: number } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:84:      return { snapshotted: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:88:      INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:103:    const snapshotted = insertMany(rows);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:104:    return { snapshotted };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:107:    console.warn(`[graph-signals] snapshotDegrees failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:108:    return { snapshotted: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:135: * degree_snapshots table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:141:      FROM degree_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:142:      WHERE memory_id = ? AND snapshot_date = date('now', '-7 days')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:148:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:377: * Take a snapshot of score fields for later invariant verification.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:393: * Throws if any score differs between before and after snapshots.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:4:// Feature catalog: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:7:  'session-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:26:  resumedSession: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:49:    case 'session-resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:50:      return `resumed session inferred ${effectiveMode} mode`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:71:  if (args.resumedSession) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:72:    activeSignals.push('session-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:89:    if (!args.resumedSession && !args.pressureOverrideApplied && args.requestedMode === 'auto' && !args.queryHeuristicApplied) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:55:function evictStale(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:56:  const entries = sessionQueries.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:61:    sessionQueries.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:64:    sessionQueries.set(sessionId, fresh.slice(-MAX_QUERIES_PER_SESSION));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:101:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:105:  const entries = sessionQueries.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:151: * @param sessionId - Session identifier (null = skip tracking)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:159:  sessionId: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:165:  if (!sessionId) return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:172:  evictStale(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:175:  const detection = detectFlow(sessionId, tokens, timestamp);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:178:  const entries = sessionQueries.get(sessionId) ?? [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:180:  sessionQueries.set(sessionId, entries.slice(-MAX_QUERIES_PER_SESSION));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:192:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:207:  sessionId: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:222:      sessionId: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:233:  sessionId: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:236:  if (!sessionId) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:238:  const entries = sessionQueries.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:255:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:263:export function clearSession(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:264:  sessionQueries.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:270:export function getSessionQueryCount(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:271:  return sessionQueries.get(sessionId)?.length ?? 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:254:        sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:283:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:130:      expect(['startup', 'resume', 'compact', 'clear']).toContain(source);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:140:describe('session bootstrap fail-closed trust handling', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:151:  it('keeps structural snapshot trust off the errored resume payload while preserving it on structural context', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:152:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:154:        throw new Error('synthetic resume failure');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:171:    vi.doMock('../lib/session/session-snapshot.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:174:        summary: 'Structural snapshot ready',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:181:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:188:    expect(parsed.data.resume.error).toContain('synthetic resume failure');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:189:    expect(parsed.data.resume).not.toHaveProperty('parserProvenance');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:190:    expect(parsed.data.resume).not.toHaveProperty('evidenceStatus');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:191:    expect(parsed.data.resume).not.toHaveProperty('freshnessAuthority');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:4:// Server-side signal computation and snapshot generation for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:438: * Create a signal snapshot for a given iteration.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:446:  const snapshot: SignalSnapshot = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:468:  return snapshot;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:476: * Compute momentum (change rate) between the latest and previous snapshots.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:480:  const snapshots = d.prepare(`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:481:    SELECT metrics FROM coverage_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:486:  if (snapshots.length < 2) return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:488:  const latest = JSON.parse(snapshots[0].metrics) as Record<string, number>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:489:  const previous = JSON.parse(snapshots[1].metrics) as Record<string, number>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:36:/** In-memory-only snapshot of embedding retry health — no DB access. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:537: * Return a lightweight in-memory snapshot of embedding retry health.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:980:  if (isHybrid && config.enableSessionBoost && config.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:984:        config.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:82: *   logger.warn('Cleanup failed', { sessionId: 'abc', elapsed: 42 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:83: *   // stderr: 'WARN  [session-manager] Cleanup failed {"sessionId":"abc","elapsed":42}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:44:  snapshot: LexicalCapabilitySnapshot | null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:46:  return snapshot ? { ...snapshot } : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:49:function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:50:  lastLexicalCapabilitySnapshot = { ...snapshot };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:88:    expect(session.sessionId).toBe('sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:502:    expect(session.sessionId).toBe('singleton-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:85:      resumed?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:87:      resumedContextCount?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:109:function mockTrustedSession(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:111:    requestedSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:112:    effectiveSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:137:    it('T524-1: Auto mode routes "resume" to resume strategy', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:140:          input: 'resume where I left off on the authentication module',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:156:      expect(mode).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:181:    it('routes auto mode to resume when a caller session already exists without resume keywords', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:182:      mockTrustedSession('session-auto-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:191:        'auto-resume-session-context'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:195:      expect(parsed.meta.mode).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:291:          input: 'resume session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:292:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:299:        'scope-forward-resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:319:        resume: 2000,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:515:  describe('Session lifecycle metadata and resume context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:534:    it('T027ka: rejects caller sessionId when it is not server-managed', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:540:          sessionId: 'session-new',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:557:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:561:    it('T027l/T027m: caller session resume reports counter and injects top-5 context', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:577:          sessionId: 'session-abc',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:578:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:581:        'T027l-resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:588:      expect(parsed.meta.sessionLifecycle.resumed).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:590:      expect(parsed.meta.sessionLifecycle.resumedContextCount).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:625:          input: 'resume prior work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:626:          sessionId: 'session-trace',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:627:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:639:          currentState: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:641:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:642:          reason: 'resumed session inferred resume mode',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:647:    it('uses the last inferred mode as previousState when a traced caller session resumes', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:656:          sessionId: 'session-known',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:657:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:667:          currentState: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:668:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:673:    it('default-on contract: auto-resume injection runs when SPECKIT_AUTO_RESUME is unset', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:682:          title: 'Auto resume memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:683:          filePath: '/tmp/auto-resume.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:690:          input: 'resume prior work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:691:          sessionId: 'session-default-on',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:692:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:695:        'auto-resume-default-on'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:713:          title: 'Disabled auto-resume memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:714:          filePath: '/tmp/disabled-auto-resume.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:721:          input: 'resume prior work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:722:          sessionId: 'session-opt-out',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:723:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:726:        'auto-resume-opt-out'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:28:// 1. Capture score snapshot BEFORE any operations (runtime invariant)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:246:  // -- Step 1: Capture score snapshot (runtime invariant) --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:248:  // This snapshot is the source-of-truth for the "no score changes" assertion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:250:  // Are subsequently filtered out are still in the before-snapshot. The
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:4:// SQLite storage for deep-loop coverage graphs (nodes + edges + snapshots).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:57:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:72:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:81:/** A coverage snapshot (per-iteration metrics) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:86:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:98:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:181:  CREATE TABLE IF NOT EXISTS coverage_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:207:  CREATE INDEX IF NOT EXISTS idx_coverage_snapshot_session ON coverage_snapshots(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:265:  if (ns.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:267:    params.push(ns.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:313:    node.id, node.specFolder, node.loopType, node.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:387:    edge.id, edge.specFolder, edge.loopType, edge.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:447:/** Create a coverage snapshot for a given iteration */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:448:export function createSnapshot(snapshot: CoverageSnapshot): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:450:  const metricsStr = JSON.stringify(snapshot.metrics);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:453:    INSERT INTO coverage_snapshots (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:462:    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:463:    metricsStr, snapshot.nodeCount, snapshot.edgeCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:468:/** Get the latest snapshot for a namespace */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:469:export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:471:  if (sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:473:      SELECT * FROM coverage_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:476:    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:480:    SELECT * FROM coverage_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:487:/** Get all snapshots for a namespace (ordered by iteration) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:488:export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:490:  if (sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:492:      SELECT * FROM coverage_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:495:    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:499:    SELECT * FROM coverage_snapshots
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:543:    'SELECT MAX(iteration) as max_iter FROM coverage_snapshots WHERE spec_folder = ? AND loop_type = ?',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:605:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:621:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:636:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:34:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:80:   * @param sessionId - Unique session identifier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:83:  getOrCreate(sessionId: string): SessionState {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:86:    const existing = this.sessions.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:99:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:108:    this.sessions.set(sessionId, session);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:115:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:118:  updateGoal(sessionId: string, goal: string | null): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:119:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:127:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:130:  markSeen(sessionId: string, resultIds: Array<number | string>): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:131:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:141:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:144:  addQuestion(sessionId: string, question: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:145:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:153:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:156:  setAnchors(sessionId: string, anchors: string[]): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:157:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:165:   * @param sessionId - Session to remove.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:167:  clear(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:168:    this.sessions.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:238: * @param sessionId - Session ID for seen-result lookup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:243:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:255:  const session = manager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:328: * @param sessionId - Session ID for goal lookup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:333:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:345:  const session = manager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:575:        sessionId: normalizedScope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:6:// session-resume.ts, and other consumers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:25:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:48:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:163:    sessionId: normalizeId(input.sessionId),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:238:        sessionId: scope.sessionId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:251:  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272:      sessionId: scope.sessionId ?? '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:305:      sessionId: decision.normalized.sessionId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:348:    scope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372:    || scope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:421:  if (normalized.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:423:    params.push(normalized.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:444:    || normalized.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:57:    // Table may not exist on older DB snapshots; treat as no negatives.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:280: * Stage 2 integration hook: handlers can surface this snapshot in telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:96:    : 'startup summary only (resume on demand)';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:125:    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"mode === 'resume'|profile === 'resume'|effectiveSessionId|server-generated session|generate a new session|resume mode\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
96:  effectiveSessionId: string;
145:  effectiveSessionId: string;
836:      effectiveSessionId: '',
845:  const effectiveSessionId = trustedSession.effectiveSessionId;
848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
856:    effectiveSessionId,
1223:    effectiveSessionId,
1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
1243:    effectiveSessionId,
1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
1286:    sessionId: effectiveSessionId,
1304:      effectiveSessionId,
1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
1530:        session_id: effectiveSessionId,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts -path '*generate-context.ts' -o -path '*generate-context.js' | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1310,1605p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1310	    const outcomeText = (observation.title || observation.narrative?.substring(0, 300) || '').trim();
  1311	    if (!outcomeText) {
  1312	      continue;
  1313	    }
  1314	
  1315	    const normalizedOutcome = normalizeProposition(outcomeText);
  1316	    if (!normalizedOutcome || seenOutcomePropositions.has(normalizedOutcome) || decisionPropositions.has(normalizedOutcome)) {
  1317	      continue;
  1318	    }
  1319	
  1320	    seenOutcomePropositions.add(normalizedOutcome);
  1321	    OUTCOMES.push({
  1322	      OUTCOME: outcomeText,
  1323	      TYPE: detectObservationType(observation),
  1324	    });
  1325	
  1326	    if (OUTCOMES.length >= 10) {
  1327	      break;
  1328	    }
  1329	  }
  1330	
  1331	  const rawLearning = (sessionInfo as RecentContextEntry).learning || '';
  1332	  const isErrorContent = /\bAPI\s+Error:\s*\d{3}\b/i.test(rawLearning)
  1333	    || /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error)/i.test(rawLearning)
  1334	    || /internal server error/i.test(rawLearning);
  1335	  // P3-7: Check if rawLearning is topically related to the spec folder before using it as SUMMARY.
  1336	  // Prevents a random last exchange from becoming the memory's entire description.
  1337	  const learningIsTopical = (() => {
  1338	    if (!folderName || rawLearning.length === 0) return rawLearning.length > 0;
  1339	    const segments = folderName.split('/').map(s => s.replace(/^\d+--?/, '').trim().toLowerCase()).filter(s => s.length > 2);
  1340	    const lowerLearning = rawLearning.toLowerCase();
  1341	    return segments.some(segment => lowerLearning.includes(segment));
  1342	  })();
  1343	  const nonFollowupObservationTitles = observations
  1344	    .filter((observation) => observation.type !== 'followup')
  1345	    .slice(0, 3)
  1346	    .map((observation) => observation.title)
  1347	    .filter(Boolean);
  1348	  const observationFallback = nonFollowupObservationTitles.join('; ')
  1349	    || observations.slice(0, 3).map((o) => o.title).filter(Boolean).join('; ');
  1350	  // Rec 3: Prefer explicit sessionSummary from JSON over transcript-derived learning
  1351	  const SUMMARY: string = (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 20)
  1352	    ? renderOverviewSummary(data.sessionSummary, truncateOnWordBoundary(data.sessionSummary, 500))
  1353	    : (!isErrorContent && learningIsTopical && rawLearning.length > 0)
  1354	      ? rawLearning
  1355	      : observationFallback
  1356	      || 'Session focused on implementing and testing features.';
  1357	
  1358	  const explicitImportanceTier = typeof data.importanceTier === 'string'
  1359	    ? data.importanceTier
  1360	    : (typeof data.importance_tier === 'string' ? data.importance_tier : null);
  1361	  // RC5: Extract explicit contextType from JSON payload
  1362	  const explicitContextType = typeof data.contextType === 'string'
  1363	    ? data.contextType
  1364	    : (typeof data.context_type === 'string' ? data.context_type : null);
  1365	  // RC5-ext: Extract explicit projectPhase from JSON payload
  1366	  let explicitProjectPhase = typeof data.projectPhase === 'string'
  1367	    ? data.projectPhase
  1368	    : (typeof data.project_phase === 'string'
  1369	      ? data.project_phase
  1370	      : (typeof (data as Record<string, unknown>).phase === 'string'
  1371	        ? (data as Record<string, unknown>).phase as string
  1372	        : null));
  1373	  const { contextType, importanceTier, decisionCount, toolCounts } =
  1374	    detectSessionCharacteristics(
  1375	      observations,
  1376	      userPrompts,
  1377	      FILES as FileEntry[],
  1378	      explicitImportanceTier,
  1379	      explicitContextType
  1380	    );
  1381	  // RC5-ext: When no explicit projectPhase and tool counts are 0 (JSON mode),
  1382	  // infer phase from contextType to avoid RESEARCH default.
  1383	  if (!explicitProjectPhase && contextType !== 'general') {
  1384	    const CONTEXT_TO_PHASE: Record<string, string> = {
  1385	      implementation: 'IMPLEMENTATION',
  1386	      research: 'RESEARCH',
  1387	      debugging: 'DEBUGGING',
  1388	      review: 'REVIEW',
  1389	      decision: 'PLANNING',
  1390	      planning: 'PLANNING',
  1391	      discovery: 'RESEARCH',
  1392	    };
  1393	    if (CONTEXT_TO_PHASE[contextType]) {
  1394	      explicitProjectPhase = CONTEXT_TO_PHASE[contextType];
  1395	    }
  1396	  }
  1397	  const manualDecisionCount = Array.isArray(data._manualDecisions)
  1398	    ? data._manualDecisions.length
  1399	    : (Array.isArray(data.keyDecisions) ? data.keyDecisions.length : 0);
  1400	  const effectiveDecisionCount = Math.max(decisionCount, manualDecisionCount);
  1401	
  1402	  const TOOL_COUNT: number = Object.values(toolCounts).reduce((sum, count) => sum + count, 0);
  1403	
  1404	  const firstPrompt = userPrompts[0]?.prompt || '';
  1405	  const taskFromPrompt = firstPrompt.match(/^(.{20,100}?)(?:[.!?\n]|$)/)?.[1];
  1406	  const quickSummaryCandidates = [
  1407	    ...observations.map((observation) => observation.title || ''),
  1408	    (sessionInfo as RecentContextEntry).request || '',
  1409	    (sessionInfo as RecentContextEntry).learning || '',
  1410	    taskFromPrompt?.trim() || '',
  1411	  ];
  1412	  const quickSummary = pickBestContentName(quickSummaryCandidates)
  1413	    || observations[0]?.title
  1414	    || (sessionInfo as RecentContextEntry).request
  1415	    || (sessionInfo as RecentContextEntry).learning
  1416	    || taskFromPrompt?.trim()
  1417	    || 'Development session';
  1418	
  1419	  const OBSERVATIONS_DETAILED: ObservationDetailed[] = buildObservationsWithAnchors(
  1420	    observations,
  1421	    data.SPEC_FOLDER || folderName
  1422	  );
  1423	
  1424	  const createdAtEpoch: number = Math.floor(Date.now() / 1000);
  1425	
  1426	  let SPEC_FILES: SpecFileEntry[] = [];
  1427	  // CODEX2-004: Reuse the specs root that phase 1 matched instead of re-calling
  1428	  // findActiveSpecsDir(), which always prefers PROJECT_ROOT/specs and can point
  1429	  // at the wrong tree when specs exist in both locations.
  1430	  const activeSpecsDir = resolvedSpecsRoot
  1431	    || findActiveSpecsDir()
  1432	    || path.join(CONFIG.PROJECT_ROOT, 'specs');
  1433	  // Backfill SPEC_FOLDER from CLI-known folder name
  1434	  if (!data.SPEC_FOLDER && folderName) {
  1435	    data.SPEC_FOLDER = folderName;
  1436	  }
  1437	  // F-03: Path traversal guard with canonical path resolution
  1438	  let specFolderPath: string | null = null;
  1439	  if (data.SPEC_FOLDER) {
  1440	    const candidate = path.resolve(activeSpecsDir, data.SPEC_FOLDER);
  1441	    const boundary = path.resolve(activeSpecsDir);
  1442	    try {
  1443	      const realCandidate = fsSync.realpathSync(candidate);
  1444	      const realBoundary = fsSync.realpathSync(boundary);
  1445	      if (realCandidate === realBoundary || realCandidate.startsWith(realBoundary + path.sep)) {
  1446	        specFolderPath = candidate;
  1447	      }
  1448	    } catch {
  1449	      // Directory doesn't exist yet — fall back to resolved path check
  1450	      if (candidate === boundary || candidate.startsWith(boundary + path.sep)) {
  1451	        specFolderPath = candidate;
  1452	      }
  1453	    }
  1454	  }
  1455	
  1456	  if (specFolderPath) {
  1457	    try {
  1458	      SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[];
  1459	    } catch (docError: unknown) {
  1460	      const errMsg = docError instanceof Error ? docError.message : String(docError);
  1461	      console.warn(`   Warning: Could not detect related docs: ${errMsg}`);
  1462	      SPEC_FILES = [];
  1463	    }
  1464	  }
  1465	
  1466	  // Derive canonical doc pointers from SPEC_FILES
  1467	  const CANONICAL_DOCS = deriveCanonicalDocPointers(SPEC_FILES, {
  1468	    contextType,
  1469	    preferDecisionRecord: true,
  1470	    preferImplementationSummary: true,
  1471	    preferReviewReport: contextType === 'review',
  1472	    preferResearchReport: contextType === 'research',
  1473	  });
  1474	
  1475	  // Project state snapshot must run BEFORE distinguishing-evidence because
  1476	  // nextAction and blockers come from here.
  1477	  const { projectPhase, activeFile, lastAction, nextAction, blockers, fileProgress } =
  1478	    buildProjectStateSnapshot({
  1479	      toolCounts,
  1480	      observations,
  1481	      messageCount,
  1482	      FILES: FILES as FileEntry[],
  1483	      SPEC_FILES,
  1484	      specFolderPath,
  1485	      recentContext: data.recentContext,
  1486	      explicitProjectPhase,
  1487	    });
  1488	
  1489	  // Build compact distinguishing evidence (limit to 4 items)
  1490	  const DISTINGUISHING_EVIDENCE = buildDistinctiveEvidence({
  1491	    observations,
  1492	    files: FILES,
  1493	    outcomes: OUTCOMES,
  1494	    nextAction,
  1495	    blockers,
  1496	    limit: 5,
  1497	    explicitEvidence: (data as Record<string, unknown>).evidenceBullets as unknown[] | undefined,
  1498	    keyDecisions: data.keyDecisions,
  1499	  });
  1500	
  1501	  // Only build implementation guide if no canonical implementation-summary.md exists
  1502	  const implementationGuide: ImplementationGuideData = CANONICAL_DOCS.hasImplementationSummary
  1503	    ? {
  1504	        HAS_IMPLEMENTATION_GUIDE: false,
  1505	        TOPIC: '',
  1506	        IMPLEMENTATIONS: [],
  1507	        IMPL_KEY_FILES: [],
  1508	        EXTENSION_GUIDES: [],
  1509	        PATTERNS: [],
  1510	      }
  1511	    : buildImplementationGuideData(observations, FILES, folderName);
  1512	
  1513	  const expiresAtEpoch: number = calculateExpiryEpoch(importanceTier, createdAtEpoch);
  1514	
  1515	  const preflightPostflightData = extractPreflightPostflightData(data);
  1516	
  1517	  const continueSessionData = buildContinueSessionData({
  1518	    observations,
  1519	    userPrompts,
  1520	    toolCounts,
  1521	    recentContext: data.recentContext,
  1522	    FILES,
  1523	    SPEC_FILES,
  1524	    summary: SUMMARY,
  1525	    projectPhase,
  1526	    lastAction,
  1527	    nextAction,
  1528	    blockers,
  1529	    duration,
  1530	    decisionCount: effectiveDecisionCount,
  1531	    collectedData: data
  1532	  });
  1533	
  1534	  return {
  1535	    // Rec 3: Derive title from sessionSummary when available (up to 80 chars, sentence boundary)
  1536	    TITLE: (() => {
  1537	      const summary = typeof data.sessionSummary === 'string' ? data.sessionSummary : '';
  1538	      if (summary.length > 10) {
  1539	        // Find first sentence or clause boundary within 80 chars
  1540	        const truncated = summary.substring(0, 80);
  1541	        const boundary = truncated.match(/^(.{20,}?)[.!?,;:\n]/);
  1542	        return boundary ? boundary[1].trim() : truncated.replace(/\s+\S*$/, '').trim();
  1543	      }
  1544	      return path.basename(folderName).replace(/^\d{3}-/, '').replace(/-/g, ' ');
  1545	    })(),
  1546	    DATE: dateOnly,
  1547	    TIME: timeOnly,
  1548	    SPEC_FOLDER: folderName,
  1549	    DURATION: duration,
  1550	    SUMMARY,
  1551	    FILES: FILES.length > 0 ? FILES : [],
  1552	    HAS_FILES: FILES.length > 0,
  1553	    FILE_COUNT: filesystemFileCount,
  1554	    CAPTURED_FILE_COUNT: capturedFileCount,
  1555	    FILESYSTEM_FILE_COUNT: filesystemFileCount,
  1556	    GIT_CHANGED_FILE_COUNT: gitChangedFileCount,
  1557	    OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress', TYPE: 'status' }],
  1558	    TOOL_COUNT,
  1559	    MESSAGE_COUNT: messageCount,
  1560	    QUICK_SUMMARY: quickSummary,
  1561	    // RC1: Pass through raw sessionSummary from JSON payload for title candidate
  1562	    _JSON_SESSION_SUMMARY: typeof data.sessionSummary === 'string' ? data.sessionSummary : null,
  1563	    SKILL_VERSION: CONFIG.SKILL_VERSION,
  1564	    OBSERVATIONS: OBSERVATIONS_DETAILED,
  1565	    HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
  1566	    // Q3: Pass through structured technicalContext for dedicated template section
  1567	    TECHNICAL_CONTEXT: Array.isArray(data.TECHNICAL_CONTEXT) ? data.TECHNICAL_CONTEXT as Array<{ KEY: string; VALUE: string }> : [],
  1568	    HAS_TECHNICAL_CONTEXT: Array.isArray(data.TECHNICAL_CONTEXT) && data.TECHNICAL_CONTEXT.length > 0,
  1569	    SPEC_FILES,
  1570	    HAS_SPEC_FILES: SPEC_FILES.length > 0,
  1571	    CANONICAL_DOCS,
  1572	    DISTINGUISHING_EVIDENCE,
  1573	    ...implementationGuide,
  1574	    SESSION_ID: sessionId,
  1575	    CHANNEL: channel,
  1576	    IMPORTANCE_TIER: importanceTier,
  1577	    CONTEXT_TYPE: contextType,
  1578	    CREATED_AT_EPOCH: createdAtEpoch,
  1579	    LAST_ACCESSED_EPOCH: createdAtEpoch,
  1580	    EXPIRES_AT_EPOCH: expiresAtEpoch,
  1581	    TOOL_COUNTS: toolCounts,
  1582	    DECISION_COUNT: effectiveDecisionCount,
  1583	    ACCESS_COUNT: 1,
  1584	    LAST_SEARCH_QUERY: '',
  1585	    RELEVANCE_BOOST: 1.0,
  1586	    PROJECT_PHASE: projectPhase,
  1587	    ACTIVE_FILE: activeFile,
  1588	    LAST_ACTION: lastAction,
  1589	    NEXT_ACTION: nextAction,
  1590	    BLOCKERS: blockers,
  1591	    FILE_PROGRESS: fileProgress,
  1592	    HAS_FILE_PROGRESS: fileProgress.length > 0,
  1593	    SOURCE_TRANSCRIPT_PATH: sourceTranscriptPath,
  1594	    SOURCE_SESSION_ID: sourceSessionId,
  1595	    SOURCE_SESSION_CREATED: sourceSessionCreated,
  1596	    SOURCE_SESSION_UPDATED: sourceSessionUpdated,
  1597	    // Git provenance metadata (M-007d) — surfaced from captured-session enrichment
  1598	    HEAD_REF: typeof data.headRef === 'string' ? data.headRef : null,
  1599	    COMMIT_REF: typeof data.commitRef === 'string' ? data.commitRef : null,
  1600	    REPOSITORY_STATE: typeof data.repositoryState === 'string' ? data.repositoryState : 'unavailable',
  1601	    IS_DETACHED_HEAD: data.isDetachedHead === true,
  1602	    ...preflightPostflightData,
  1603	    ...continueSessionData
  1604	  };
  1605	}

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
   221	
   222	  if (!hasSpecsParent) {
   223	    // Fallback: check if bare name can be resolved via recursive child search
   224	    // (findChildFolderSync in validateArguments handles this, so just report the error here)
   225	    return {
   226	      valid: false,
   227	      reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   228	    };
   229	  }
   230	
   231	  return { valid: true };
   232	}
   233	
   234	function resolveCliSpecFolderReference(rawArg: string): string | null {
   235	  const folderName = path.basename(rawArg);
   236	  const explicitProjectScopedPath = !rawArg.endsWith('.json') && (
   237	    rawArg.startsWith('specs/') ||
   238	    rawArg.startsWith('.opencode/specs/')
   239	  )
   240	    ? path.join(CONFIG.PROJECT_ROOT, rawArg)
   241	    : null;
   242	
   243	  let resolvedNestedPath: string | null = null;
   244	  if (!rawArg.endsWith('.json')) {
   245	    if (path.isAbsolute(rawArg)) {
   246	      const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
   247	      const lastSegment = absoluteSegments.at(-1);
   248	      const parentSegment = absoluteSegments.at(-2);
   249	
   250	      if (
   251	        (lastSegment && SPEC_FOLDER_PATTERN.test(lastSegment)) ||
   252	        (parentSegment && lastSegment && SPEC_FOLDER_PATTERN.test(parentSegment) && SPEC_FOLDER_PATTERN.test(lastSegment))
   253	      ) {
   254	        resolvedNestedPath = rawArg;
   255	      }
   256	    }
   257	
   258	    let cleaned = rawArg;
   259	    if (cleaned.startsWith('.opencode/specs/')) {
   260	      cleaned = cleaned.slice('.opencode/specs/'.length);
   261	    } else if (cleaned.startsWith('specs/')) {
   262	      cleaned = cleaned.slice('specs/'.length);
   263	    }
   264	    cleaned = cleaned.replace(/\/+$/, '');
   265	
   266	    if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
   267	      resolvedNestedPath = explicitProjectScopedPath;
   268	    }
   269	
   270	    const segments = cleaned.split('/');
   271	    if (!resolvedNestedPath && segments.length >= 2) {
   272	      for (const specsDir of getSpecsDirectories()) {
   273	        const candidate = path.join(specsDir, ...segments);
   274	        if (fsSync.existsSync(candidate)) {
   275	          resolvedNestedPath = candidate;
   276	          break;
   277	        }
   278	      }
   279	      if (!resolvedNestedPath && SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
   280	        const activeDir = findActiveSpecsDir();
   281	        if (activeDir) {
   282	          resolvedNestedPath = path.join(activeDir, ...segments);
   283	        }
   284	      }
   285	    }
   286	  }
   287	
   288	  if (resolvedNestedPath) {
   289	    return resolvedNestedPath;
   290	  }
   291	
   292	  const isSpecFolderPath = (
   293	    rawArg.startsWith('specs/') ||
   294	    rawArg.startsWith('.opencode/specs/') ||
   295	    SPEC_FOLDER_BASIC_PATTERN.test(folderName)
   296	  ) && !rawArg.endsWith('.json');
   297	
   298	  return isSpecFolderPath ? rawArg : null;
   299	}
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '780,910p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   871	  },
   872	): EffectiveModeResolution {
   873	  const requestedMode = args.mode ?? 'auto';
   874	  const explicitIntent = args.intent;
   875	  const normalizedInput = args.input.trim();
   876	
   877	  let effectiveMode = requestedMode;
   878	  let detectedIntent = explicitIntent;
   879	  let intentConfidence = explicitIntent ? 1.0 : 0;
   880	  let pressureOverrideTargetMode: PressureOverrideTargetMode = null;
   881	  let pressureOverrideApplied = false;
   882	  let pressureWarning: string | null = null;
   883	  let resumeHeuristicApplied = false;
   884	
   885	  if (!detectedIntent && requestedMode !== 'quick') {
   886	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
   887	    detectedIntent = classification.intent;
   888	    intentConfidence = classification.confidence;
   889	  }
   890	
   891	  if (requestedMode === 'auto') {
   892	    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';
   893	
   894	    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
   895	      effectiveMode = 'focused';
   896	    }
   897	
   898	    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
   899	    const hasResumeContext =
   900	      session.resumed ||
   901	      session.priorMode === 'resume' ||
   902	      (
   903	        Boolean(args.specFolder) &&
   904	        normalizedInput.length <= 120 &&
   905	        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
   906	      );
   907	
   908	    if (hasResumeKeywords || hasResumeContext) {
   909	      effectiveMode = 'resume';
   910	      resumeHeuristicApplied = true;

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1210,1455p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1210	    const evalEntry = logSearchQuery({
  1211	      query: normalizedInput,
  1212	      intent: explicit_intent ?? null,
  1213	      specFolder: spec_folder ?? null,
  1214	    });
  1215	    _evalQueryId = evalEntry.queryId;
  1216	    _evalRunId = evalEntry.evalRunId;
  1217	  } catch {
  1218	    // Intentional no-op — error deliberately discarded
  1219	  }
  1220	
  1221	  const {
  1222	    requestedSessionId,
  1223	    effectiveSessionId,
  1224	    resumed: resumedSession,
  1225	    priorMode: previousState,
  1226	    counter: eventCounterStart,
  1227	    error: sessionScopeError,
  1228	  } = resolveSessionLifecycle(args, null);
  1229	  if (sessionScopeError) {
  1230	    return createMCPErrorResponse({
  1231	      tool: 'memory_context',
  1232	      error: sessionScopeError,
  1233	      code: 'E_SESSION_SCOPE',
  1234	      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
  1235	      recovery: {
  1236	        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
  1237	      },
  1238	    });
  1239	  }
  1240	  const sessionLifecycle: SessionLifecycleMetadata = {
  1241	    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
  1242	    requestedSessionId,
  1243	    effectiveSessionId,
  1244	    resumed: resumedSession,
  1245	    eventCounterStart,
  1246	    resumedContextCount: 0,
  1247	  };
  1248	
  1249	  // Get layer info for response metadata
  1250	  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
  1251	  const tokenBudget = layerInfo?.tokenBudget ?? 2000;
  1252	
  1253	  const runtimeContextStats: RuntimeContextStats = {
  1254	    tokenBudget,
  1255	  };
  1256	  try {
  1257	    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
  1258	  } catch {
  1259	    runtimeContextStats.tokenCount = undefined;
  1260	  }
  1261	
  1262	  // Resolve token pressure (caller -> estimator -> unavailable)
  1263	  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
  1264	  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
  1265	
  1266	  const pressurePolicy = pressurePolicyEnabled
  1267	    ? getPressureLevel(tokenUsage, runtimeContextStats)
  1268	    : {
  1269	        level: 'none' as const,
  1270	        ratio: null,
  1271	        source: 'unavailable' as const,
  1272	        warning: null,
  1273	      };
  1274	  if (pressurePolicy.warning) {
  1275	    console.warn(pressurePolicy.warning);
  1276	  }
  1277	
  1278	  // Build options object for strategy executors
  1279	  const options: ContextOptions = {
  1280	    specFolder: spec_folder,
  1281	    tenantId: args.tenantId,
  1282	    userId: args.userId,
  1283	    agentId: args.agentId,
  1284	    sharedSpaceId: args.sharedSpaceId,
  1285	    limit,
  1286	    sessionId: effectiveSessionId,
  1287	    enableDedup: enableDedup,
  1288	    includeContent: include_content,
  1289	    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
  1290	    anchors,
  1291	    profile: args.profile,
  1292	  };
  1293	
  1294	  const {
  1295	    effectiveMode,
  1296	    pressureOverrideApplied,
  1297	    pressureOverrideTargetMode,
  1298	    pressureWarning,
  1299	    intentClassification,
  1300	  } = resolveEffectiveMode(
  1301	    { ...args, input: normalizedInput },
  1302	    {
  1303	      requestedSessionId,
  1304	      effectiveSessionId,
  1305	      resumed: resumedSession,
  1306	      priorMode: previousState,
  1307	      counter: eventCounterStart,
  1308	    },
  1309	    pressurePolicy,
  1310	  );
  1311	  const {
  1312	    detectedIntent,
  1313	    intentConfidence,
  1314	    resumeHeuristicApplied,
  1315	    source: intentSource,
  1316	  } = intentClassification;
  1317	
  1318	  // Phase C: Intent-to-profile auto-routing for memory_context.
  1319	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  1320	  // Skip for 'quick' mode: quick routes through handleMemoryMatchTriggers which does not
  1321	  // support profile formatting — setting a profile there would be a no-op.
  1322	  if (!options.profile && detectedIntent && effectiveMode !== 'quick' && isIntentAutoProfileEnabled()) {
  1323	    try {
  1324	      const autoProfile = intentClassifier.getProfileForIntent(
  1325	        detectedIntent as import('../lib/search/intent-classifier.js').IntentType
  1326	      );
  1327	      if (autoProfile) {
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
  1366	  try {
  1367	    result = await executeStrategy(effectiveMode, options, {
  1368	      ...args,
  1369	      input: normalizedInput,
  1370	      intent: detectedIntent,
  1371	    });
  1372	  } catch (error: unknown) {
  1373	    console.error(`[memory-context] Strategy execution failed [requestId=${requestId}]:`, toErrorMessage(error));
  1374	    return createMCPErrorResponse({
  1375	      tool: 'memory_context',
  1376	      error: toErrorMessage(error),
  1377	      code: 'E_STRATEGY',
  1378	      details: {
  1379	        requestId,
  1380	        layer: 'L1:Orchestration',
  1381	        mode: effectiveMode,
  1382	        alternativeLayers: layerDefs.getRecommendedLayers('search')
  1383	      },
  1384	      recovery: {
  1385	        hint: 'Try a different mode or check your input'
  1386	      }
  1387	    });
  1388	  }
  1389	
  1390	  const strategyError = extractStrategyError(result);
  1391	  if (strategyError) {
  1392	    return createMCPErrorResponse({
  1393	      tool: 'memory_context',
  1394	      error: strategyError.error,
  1395	      code: strategyError.code,
  1396	      details: {
  1397	        requestId,
  1398	        layer: 'L1:Orchestration',
  1399	        mode: effectiveMode,
  1400	        upstream: strategyError.details,
  1401	      },
  1402	      recovery: {
  1403	        hint: strategyError.hints[0] ?? 'Try a different mode or check your input',
  1404	        actions: strategyError.hints.slice(1),
  1405	        severity: strategyError.severity ?? 'error',
  1406	      },
  1407	    });
  1408	  }
  1409	
  1410	  // FIX RC1-A (superseded by P0 fix): Folder discovery no longer promotes to
  1411	  // options.specFolder, so the recovery retry is no longer needed. The folder
  1412	  // boost still applies via options.folderBoost for scoring prioritization.
  1413	
  1414	  try {
  1415	    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
  1416	  } catch (error: unknown) {
  1417	    void error;
  1418	    // Best-effort session state write — do not fail the handler
  1419	  }
  1420	
  1421	  // T205: Determine effective token budget from mode or layer definitions
  1422	  const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
  1423	  const effectiveBudget = modeTokenBudget || tokenBudget;
  1424	
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1455,1545p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve got the main lifecycle handlers, but I want one more layer of evidence on how our session IDs and working memory are actually persisted and reused. That should make the comparison sharper than just “bootstrap exists” versus “doesn’t exist.”
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session State
     3	// ───────────────────────────────────────────────────────────────
     4	// REQ-D5-006: Retrieval session state for cross-turn context
     5	//
     6	// PURPOSE: Track per-session retrieval state to enable:
     7	// 1. Cross-turn deduplication — deprioritize already-seen results
     8	// 2. Goal-aware refinement — boost results aligned with session goal
     9	// 3. Stateful session tracking — questions, anchors, seen items
    10	//
    11	// FEATURE FLAG: SPECKIT_SESSION_RETRIEVAL_STATE_V1 (default ON, graduated; set false to disable)
    12	//
    13	// STORAGE: In-memory only (ephemeral by design, no SQLite persistence).
    14	// Sessions expire after 30 minutes of inactivity, LRU eviction at 100 capacity.
    15	
    16	// -- Constants --
    17	
    18	/** Session inactivity TTL in milliseconds (30 minutes). */
    19	const SESSION_TTL_MS = 30 * 60 * 1000;
    20	
    21	/** Maximum concurrent sessions before LRU eviction. */
    22	const MAX_SESSIONS = 100;
    23	
    24	/** Score multiplier for seen results (deprioritize, don't remove). */
    25	const SEEN_DEDUP_FACTOR = 0.3;
    26	
    27	/** Maximum goal alignment boost factor. */
    28	const GOAL_BOOST_MAX = 1.2;
    29	
    30	// -- Types --
    31	
    32	/** Session state for a single retrieval session. */
    33	interface SessionState {
    34	  sessionId: string;
    35	  activeGoal: string | null;
    36	  seenResultIds: Set<string>;
    37	  openQuestions: string[];
    38	  preferredAnchors: string[];
    39	  createdAt: number;
    40	  updatedAt: number;
    41	}
    42	
    43	/** Minimal result shape for session operations. */
    44	interface SessionResult {
    45	  id: number | string;
    46	  content?: string;
    47	  score?: number;
    48	  [key: string]: unknown;
    49	}
    50	
    51	/** Metadata attached to deduplication results. */
    52	interface DedupMetadata {
    53	  deduplicated: boolean;
    54	  seenCount: number;
    55	  deprioritizedCount: number;
    56	}
    57	
    58	/** Result of goal-aware refinement. */
    59	interface GoalRefinementMetadata {
    60	  refined: boolean;
    61	  activeGoal: string | null;
    62	  boostedCount: number;
    63	}
    64	
    65	// -- Session State Manager --
    66	
    67	/**
    68	 * In-memory session state manager with TTL-based cleanup and LRU eviction.
    69	 *
    70	 * Sessions are ephemeral — they exist only in process memory and are not
    71	 * persisted to disk or database. This is intentional: session state is
    72	 * transient retrieval context, not durable memory.
    73	 */
    74	class SessionStateManager {
    75	  private sessions: Map<string, SessionState> = new Map();
    76	
    77	  /**
    78	   * Get an existing session or create a new one.
    79	   *
    80	   * @param sessionId - Unique session identifier.
    81	   * @returns The session state (existing or newly created).
    82	   */
    83	  getOrCreate(sessionId: string): SessionState {
    84	    this.evictExpired();
    85	
    86	    const existing = this.sessions.get(sessionId);
    87	    if (existing) {
    88	      existing.updatedAt = Date.now();
    89	      return existing;
    90	    }
    91	
    92	    // LRU eviction if at capacity
    93	    if (this.sessions.size >= MAX_SESSIONS) {
    94	      this.evictLRU();
    95	    }
    96	
    97	    const now = Date.now();
    98	    const session: SessionState = {
    99	      sessionId,
   100	      activeGoal: null,
   101	      seenResultIds: new Set(),
   102	      openQuestions: [],
   103	      preferredAnchors: [],
   104	      createdAt: now,
   105	      updatedAt: now,
   106	    };
   107	
   108	    this.sessions.set(sessionId, session);
   109	    return session;
   110	  }
   111	
   112	  /**
   113	   * Update the active retrieval goal for a session.
   114	   *
   115	   * @param sessionId - Session to update.
   116	   * @param goal - The new active goal (or null to clear).
   117	   */
   118	  updateGoal(sessionId: string, goal: string | null): void {
   119	    const session = this.getOrCreate(sessionId);
   120	    session.activeGoal = goal;
   121	    session.updatedAt = Date.now();
   122	  }
   123	
   124	  /**
   125	   * Mark result IDs as seen in a session (accumulates across calls).
   126	   *
   127	   * @param sessionId - Session to update.
   128	   * @param resultIds - Result IDs to mark as seen.
   129	   */
   130	  markSeen(sessionId: string, resultIds: Array<number | string>): void {
   131	    const session = this.getOrCreate(sessionId);
   132	    for (const id of resultIds) {
   133	      session.seenResultIds.add(String(id));
   134	    }
   135	    session.updatedAt = Date.now();
   136	  }
   137	
   138	  /**
   139	   * Add an unresolved question to the session.
   140	   *
   141	   * @param sessionId - Session to update.
   142	   * @param question - The question to track.
   143	   */
   144	  addQuestion(sessionId: string, question: string): void {
   145	    const session = this.getOrCreate(sessionId);
   146	    session.openQuestions.push(question);
   147	    session.updatedAt = Date.now();
   148	  }
   149	
   150	  /**
   151	   * Set preferred anchors for the session.
   152	   *
   153	   * @param sessionId - Session to update.
   154	   * @param anchors - Array of preferred anchor names.
   155	   */
   156	  setAnchors(sessionId: string, anchors: string[]): void {
   157	    const session = this.getOrCreate(sessionId);
   158	    session.preferredAnchors = [...anchors];
   159	    session.updatedAt = Date.now();
   160	  }
   161	
   162	  /**
   163	   * Remove a session entirely.
   164	   *
   165	   * @param sessionId - Session to remove.
   166	   */
   167	  clear(sessionId: string): void {
   168	    this.sessions.delete(sessionId);
   169	  }
   170	
   171	  /**
   172	   * Get the current number of active sessions.
   173	   * Useful for monitoring and testing.
   174	   */
   175	  get size(): number {
   176	    return this.sessions.size;
   177	  }
   178	
   179	  /**
   180	   * Clear all sessions. Useful for testing.
   181	   */
   182	  clearAll(): void {
   183	    this.sessions.clear();
   184	  }
   185	
   186	  // -- Internal Helpers --
   187	
   188	  /**
   189	   * Evict sessions that have exceeded the inactivity TTL.
   190	   */
   191	  private evictExpired(): void {
   192	    const now = Date.now();
   193	    for (const [id, session] of this.sessions) {
   194	      if (now - session.updatedAt > SESSION_TTL_MS) {
   195	        this.sessions.delete(id);
   196	      }
   197	    }
   198	  }
   199	
   200	  /**
   201	   * Evict the least-recently-updated session (LRU).
   202	   * Called when session count reaches MAX_SESSIONS.
   203	   */
   204	  private evictLRU(): void {
   205	    let oldestId: string | null = null;
   206	    let oldestTime = Infinity;
   207	
   208	    for (const [id, session] of this.sessions) {
   209	      if (session.updatedAt < oldestTime) {
   210	        oldestTime = session.updatedAt;
   211	        oldestId = id;
   212	      }
   213	    }
   214	
   215	    if (oldestId !== null) {
   216	      this.sessions.delete(oldestId);
   217	    }
   218	  }
   219	}
   220	
   221	// -- Singleton Manager --
   222	
   223	const manager = new SessionStateManager();
   224	
   225	// -- Feature Flag --
   226	
   227	// Session retrieval state gate — canonical implementation in search-flags.ts.
   228	// Default: TRUE (graduated). Set SPECKIT_SESSION_RETRIEVAL_STATE_V1=false to disable.
   229	import { isSessionRetrievalStateEnabled } from './search-flags.js';
   230	
   231	// -- Cross-Turn Deduplication --
   232	
   233	/**
   234	 * Deprioritize results whose IDs appear in the session's seenResultIds set.
   235	 * Does NOT remove results — just multiplies their score by SEEN_DEDUP_FACTOR (0.3).
   236	 *
   237	 * @param results - Result set to deduplicate.
   238	 * @param sessionId - Session ID for seen-result lookup.
   239	 * @returns Modified result set with dedup metadata.
   240	 */
   241	function deduplicateResults(
   242	  results: SessionResult[],
   243	  sessionId: string,
   244	): { results: SessionResult[]; metadata: DedupMetadata } {
   245	  const defaultMeta: DedupMetadata = { deduplicated: false, seenCount: 0, deprioritizedCount: 0 };
   246	
   247	  if (!Array.isArray(results) || results.length === 0) {
   248	    return { results, metadata: defaultMeta };
   249	  }
   250	
   251	  if (!isSessionRetrievalStateEnabled()) {
   252	    return { results, metadata: defaultMeta };
   253	  }
   254	
   255	  const session = manager.getOrCreate(sessionId);
   256	  if (session.seenResultIds.size === 0) {
   257	    return { results, metadata: { ...defaultMeta, seenCount: 0 } };
   258	  }
   259	
   260	  let deprioritizedCount = 0;

exec
/bin/zsh -lc "rg -n \"resolveTrustedSession|saveSessionState|trusted session|mint|effectiveSessionId|session manager\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:167:  effectiveSessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385:function resolveTrustedSession(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:396:      effectiveSessionId: crypto.randomUUID(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:404:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:414:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:424:      effectiveSessionId: '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:432:    effectiveSessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1413:  resolveTrustedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1421:  saveSessionState,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:164:        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:167:      const fromLifecycle = parsed?.meta?.sessionLifecycle?.effectiveSessionId;

exec
/bin/zsh -lc "rg -n \"getSessionPromptContext|setAttentionScore|getSessionMemories|DECAY_FLOOR|co-activation|spread\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:105:import * as coActivation from './lib/cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:29:import * as coActivation from '../lib/cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:383:          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:8:import { clearRelatedCache } from '../lib/cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:327:    `).all(workingMemory.DECAY_FLOOR, oneHourAgo, limit) as Array<{ memory_id: number }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:422:        // Always spread caller-provided extraData (pipeline trace, timing, evidence gaps, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:701:  // Always spread caller-provided extraData (pipeline trace, timing, evidence gaps, etc.).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:346:      expect(result[0]).toBe(row); // same reference — no unnecessary spread
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:31:vi.mock('../lib/cognitive/co-activation', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:33:  spreadActivation: mockSpreadActivation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:312:  it('precomputes co-activation neighbor counts once per boosted batch', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:6:import * as coActivation from '../lib/cognitive/co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:998:    const spreadSpy = vi.spyOn(coActivation, 'spreadActivation').mockReturnValue([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1016:      expect(spreadSpy).toHaveBeenCalledTimes(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1018:      spreadSpy.mockRestore();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1274:  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:25:  spreadActivation: vi.fn(() => []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:69:vi.mock('../lib/cognitive/co-activation', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:71:  spreadActivation: provenanceMocks.spreadActivation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:371:        { type: 'co-activation', delta: 0.03 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:63:          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:7:import { DECAY_FLOOR, DELETE_THRESHOLD } from '../lib/cognitive/working-memory';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:86:      const decayFloor = DECAY_FLOOR;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:97:      const decayFloor = DECAY_FLOOR;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:178:      const decayFloor = DECAY_FLOOR;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:188:      const decayFloor = DECAY_FLOOR;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:10:describe('T209: Wire setAttentionScore for Trigger Matches', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:12:  // SUITE: T209 — setAttentionScore export and signature
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:13:  describe('setAttentionScore export and signature', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:14:    it('T209-1: setAttentionScore is exported from working-memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:15:      expect(typeof workingMemory.setAttentionScore).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:18:    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:19:      const result = workingMemory.setAttentionScore('test-session', 999, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:25:  // SUITE: T209 — Handler source includes setAttentionScore call
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:26:  describe('Handler wires setAttentionScore', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:50:    it('T209-3: Handler source calls setAttentionScore', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:52:        expect(handlerSource).toContain('workingMemory.setAttentionScore');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:54:        expect(handlerJs).toContain('setAttentionScore');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:60:    it('T209-4: setAttentionScore called within Step 3 ACTIVATE block', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:65:      const setAttnIndex = handlerSource.indexOf('workingMemory.setAttentionScore');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:75:    it('T209-5: setAttentionScore called with (session_id, match.memoryId, score)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:90:      const boostPattern = /workingMemory\.setAttentionScore\([^)]*,\s*1\.0\s*\)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:2:// Converted from: co-activation.test.ts (custom runner)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:3:// Aligned with production co-activation.ts named exports
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:5:import * as coActivation from '../lib/cognitive/co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:10:  '../lib/cognitive/co-activation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:11:  '../lib/cognitive/co-activation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:32:    // BoostScore, getRelatedMemories, populateRelatedMemories, spreadActivation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:36:      'spreadActivation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:271:     spreadActivation() without DB
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:274:  describe('spreadActivation() without DB', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:275:    // Production signature: spreadActivation(seedIds: number[], maxHops?, limit?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:279:      const result = coActivation.spreadActivation([1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:285:      const result = coActivation.spreadActivation([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:337:    it('C138-T1: spreadActivation export is a function', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:338:      expect(typeof coActivation.spreadActivation).toBe('function');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:45:vi.mock('../lib/cognitive/co-activation.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:47:  spreadActivation: mockSpreadActivation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:251:    it('getSessionMemories returns [] without DB', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:252:      const sm = workingMemory.getSessionMemories('test-session');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:257:    it('setAttentionScore returns false without DB', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:258:      expect(workingMemory.setAttentionScore('test', 1, 0.5)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:281:      'getSessionMemories',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:283:      'setAttentionScore',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:50:    expect(wm.setAttentionScore('s1', 1, 0.8)).toBe(true); // counter 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:51:    expect(wm.setAttentionScore('s1', 2, 0.7)).toBe(true); // counter 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:52:    expect(wm.setAttentionScore('s1', 1, 0.9)).toBe(true); // counter 2, mention +1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:153:    expect(floored.attention_score).toBe(wm.DECAY_FLOOR);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:165:    expect(wm.setAttentionScore('s4', 7, 0.9)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:311:  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:11:import * as coActivation from '../lib/cognitive/co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:240:    vi.spyOn(workingMemory, 'setAttentionScore').mockImplementation(() => false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:241:    vi.spyOn(workingMemory, 'getSessionMemories').mockReturnValue([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:73:function spreadActivation(results: SearchResult[]): SearchResult[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:142:  results = spreadActivation(results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:295:  // Sensitivity curve: compare score spread across the grid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:299:  const spread = maxAvg - minAvg;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:302:  if (spread < 0.001) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:4:// T002 (degree as 5th RRF channel) + T003a (co-activation boost)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:356:  // The co-activation module reads env vars at import time,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:361:      const mod = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:367:      const mod = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:380:      const mod = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:399:      const { boostScore } = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:404:      const { boostScore } = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:420:    it('spreadActivation applies decay per hop', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:421:      const mod = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:422:      // The spread activation function uses decayPerHop = 0.5
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:428:      const { boostScore } = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:443:      const mod = await import('../lib/cognitive/co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hooks-mutation-wiring.vitest.ts:44:vi.mock('../lib/cognitive/co-activation', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:291:    // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:214:    it('co-activation config fetches 2*maxRelated (not maxRelated+1)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:221:        '../lib/cognitive/co-activation.ts'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:399:      '../lib/cognitive/co-activation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:702:      vi.doMock('../lib/cognitive/co-activation', () => ({ init: vi.fn(), isEnabled: vi.fn(() => false) }))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2252:      { module: './lib/cognitive/co-activation.js', name: 'Co-activation' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:74:// Mock co-activation spreading so it never touches the DB.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:75:vi.mock('../lib/cognitive/co-activation', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:76:  spreadActivation: vi.fn(() => []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:61:    it('T-TM-04: spread preserves all properties', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:64:      const spread = { ...metrics };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:66:      expect(typeof spread.totalAtomicWrites).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:67:      expect(typeof spread.totalDeletes).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:68:      expect(typeof spread.totalRecoveries).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:69:      expect(typeof spread.totalErrors).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:70:      expect(spread.lastOperationTime === null || typeof spread.lastOperationTime === 'string').toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:71:      expect(spread).toEqual(metrics);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-transaction-metrics-types.vitest.ts:74:    it('T-TM-05: spread creates independent copy', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:34:} from '../lib/cognitive/co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:650:describe('Cross-feature: degree + co-activation interaction', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:653:  it('CF.1 — degree ranking and co-activation boost compound to promote well-connected memories', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:670:    // Now apply co-activation boost on top of a hypothetical base score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:565:      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:679:      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:710:      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:95:      getSessionPromptContext: vi.fn(() => []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:96:      DECAY_FLOOR: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:432:      // Original fields preserved (access via Record cast since spread extras aren't tracked)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:65:} from '../lib/cognitive/co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:231:      // S1 features: co-activation, RRF (on by default)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:8:import * as coActivation from '../lib/cognitive/co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mutation-hooks.vitest.ts:40:vi.mock('../lib/cognitive/co-activation', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:42:    expect(workingMemory.setAttentionScore('new-session', 1, 0.8)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:52:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:53:    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:58:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:506:  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:35:const DECAY_FLOOR = 0.05;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:311:    console.warn(`[working-memory] getSessionMemories error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:349:    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:381:function setAttentionScore(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:421:    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:612:        // Clamp to [DECAY_FLOOR, 1.0].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:614:        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:736:  getSessionMemories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:739:  getSessionPromptContext,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:743:  setAttentionScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:747:  DECAY_FLOOR,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:12:import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:61:import type { SpreadResult } from '../cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:247:/** Number of top results used as seeds for co-activation spreading. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474:  // C138: Co-activation spreading — enrich with temporal neighbors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1481:      const spreadResults: SpreadResult[] = spreadActivation(topIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1482:      // Boost scores of results that appear in co-activation graph
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1483:      if (spreadResults.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1484:        const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1486:          const boost = spreadMap.get(result.id as number);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1496:      // P1-2 FIX: Re-sort after co-activation boost to ensure boosted results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1500:      // Non-critical enrichment — co-activation failure does not affect core ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:15: * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:164: * Boost a search result's score based on co-activation with related memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:187: * repeated DB round-trips when spreadActivation() traverses multiple hops.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:194:    console.warn('[co-activation] Database not initialized. Server may still be starting up.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:232:    console.warn(`[co-activation] getRelatedMemories error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:291:      console.warn(`[co-activation] Invalid embedding size (${uint8.byteLength} bytes) for memory ${memoryId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:314:    console.warn(`[co-activation] populateRelatedMemories error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:358:    console.warn(`[co-activation] getCausalNeighbors error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:369:function spreadActivation(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:461:  spreadActivation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:617:  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:206:    if (signal === 'graph_boosted') return 'graph co-activation';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:38: * 2x median is the elbow heuristic — a gap twice the typical spread signals a relevance cliff. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:224: * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:149:  // Use reduce-based max to avoid RangeError when scored is large (spread exceeds call-stack limit)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:25:// 2a. Co-activation spreading — spreading activation from top-N seeds
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:59:  spreadActivation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:62:} from '../../cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:63:import type { SpreadResult } from '../../cognitive/co-activation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:121:/** Number of top results used as seeds for co-activation spreading. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:398: * a graph-based boost. Extracts contributing causal edges, co-activation edges,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:514:    if (coActivationDelta !== 0) boostFactors.push({ type: 'co-activation', delta: coActivationDelta });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:933: *   2a. Co-activation      (spreading activation from top-N seeds)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1054:  // -- 2a. Co-activation spreading --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1056:  // Performs spreading activation traversal, and boosts scores of results that
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1066:        const spreadResults: SpreadResult[] = spreadActivation(topIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1067:        if (spreadResults.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1068:          const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1069:          const relatedCounts = getRelatedMemoryCounts([...new Set(spreadResults.map((result) => result.id))]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1071:            const boost = spreadMap.get(row.id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1076:              // Uses the same sqrt scaling as co-activation.ts boostScore().
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1080:              return withGraphContribution(updated, 'coActivationDelta', resolveBaseScore(updated) - baseScore, 'co-activation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1084:          // Re-sort after co-activation boost to ensure boosted results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1091:      // Non-critical enrichment — co-activation failure does not affect core ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1093:      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:179:  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1000,1065p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '360,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1000	
  1001	  try {
  1002	    db.exec(SESSION_STATE_SCHEMA_SQL);
  1003	    const existingColumns = getTableColumns('session_state');
  1004	    for (const migration of SESSION_STATE_MIGRATIONS) {
  1005	      if (!existingColumns.has(migration.column)) {
  1006	        db.exec(migration.sql);
  1007	      }
  1008	    }
  1009	    for (const indexSql of SESSION_STATE_INDEX_SQL) {
  1010	      db.exec(indexSql);
  1011	    }
  1012	    return { success: true };
  1013	  } catch (error: unknown) {
  1014	    const message = error instanceof Error ? error.message : String(error);
  1015	    console.error(`[session-manager] Session state schema creation failed: ${message}`);
  1016	    return { success: false, error: message };
  1017	  }
  1018	}
  1019	
  1020	function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
  1021	  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  1022	  if (!sessionId || typeof sessionId !== 'string') {
  1023	    return { success: false, error: 'Valid sessionId is required' };
  1024	  }
  1025	
  1026	  try {
  1027	    ensureSessionStateSchema();
  1028	    const now = new Date().toISOString();
  1029	    const stateData = state.data ? JSON.stringify(state.data) : null;
  1030	    const tenantId = normalizeIdentityValue(state.tenantId);
  1031	    const userId = normalizeIdentityValue(state.userId);
  1032	    const agentId = normalizeIdentityValue(state.agentId);
  1033	
  1034	    const stmt = db.prepare(`
  1035	      INSERT INTO session_state (
  1036	        session_id, status, spec_folder, current_task, last_action,
  1037	        context_summary, pending_work, state_data,
  1038	        tenant_id, user_id, agent_id,
  1039	        created_at, updated_at
  1040	      )
  1041	      VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  1042	      ON CONFLICT(session_id) DO UPDATE SET
  1043	        status = 'active',
  1044	        spec_folder = COALESCE(excluded.spec_folder, session_state.spec_folder),
  1045	        current_task = COALESCE(excluded.current_task, session_state.current_task),
  1046	        last_action = COALESCE(excluded.last_action, session_state.last_action),
  1047	        context_summary = COALESCE(excluded.context_summary, session_state.context_summary),
  1048	        pending_work = COALESCE(excluded.pending_work, session_state.pending_work),
  1049	        state_data = COALESCE(excluded.state_data, session_state.state_data),
  1050	        tenant_id = COALESCE(excluded.tenant_id, session_state.tenant_id),
  1051	        user_id = COALESCE(excluded.user_id, session_state.user_id),
  1052	        agent_id = COALESCE(excluded.agent_id, session_state.agent_id),
  1053	        updated_at = excluded.updated_at
  1054	    `);
  1055	
  1056	    stmt.run(
  1057	      sessionId,
  1058	      state.specFolder || null,
  1059	      state.currentTask || null,
  1060	      state.lastAction || null,
  1061	      state.contextSummary || null,
  1062	      state.pendingWork || null,
  1063	      stateData,
  1064	      tenantId,
  1065	      userId,

 succeeded in 0ms:
   360	): string | null {
   361	  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
   362	  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
   363	    return 'tenantId';
   364	  }
   365	
   366	  const requestedUserId = normalizeIdentityValue(scope.userId);
   367	  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
   368	    return 'userId';
   369	  }
   370	
   371	  const requestedAgentId = normalizeIdentityValue(scope.agentId);
   372	  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
   373	    return 'agentId';
   374	  }
   375	
   376	  return null;
   377	}
   378	
   379	function hasCorroboratedIdentity(
   380	  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
   381	): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
   382	  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
   383	}
   384	
   385	function resolveTrustedSession(
   386	  requestedSessionId: string | null = null,
   387	  scope: SessionIdentityScope = {},
   388	): TrustedSessionResolution {
   389	  const normalizedSessionId = typeof requestedSessionId === 'string' && requestedSessionId.trim().length > 0
   390	    ? requestedSessionId.trim()
   391	    : null;
   392	
   393	  if (!normalizedSessionId) {
   394	    return {
   395	      requestedSessionId: null,
   396	      effectiveSessionId: crypto.randomUUID(),
   397	      trusted: false,
   398	    };
   399	  }
   400	
   401	  if (!isTrackedSession(normalizedSessionId)) {
   402	    return {
   403	      requestedSessionId: normalizedSessionId,
   404	      effectiveSessionId: '',
   405	      trusted: false,
   406	      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   407	    };
   408	  }
   409	
   410	  const storedIdentity = getSessionIdentityRecord(normalizedSessionId);
   411	  if (!hasCorroboratedIdentity(storedIdentity)) {
   412	    return {
   413	      requestedSessionId: normalizedSessionId,
   414	      effectiveSessionId: '',
   415	      trusted: false,
   416	      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   417	    };
   418	  }
   419	
   420	  const mismatch = getIdentityMismatch(storedIdentity, scope);
   421	  if (mismatch) {
   422	    return {
   423	      requestedSessionId: normalizedSessionId,
   424	      effectiveSessionId: '',
   425	      trusted: false,
   426	      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   427	    };
   428	  }
   429	
   430	  return {
   431	    requestedSessionId: normalizedSessionId,
   432	    effectiveSessionId: normalizedSessionId,
   433	    trusted: true,
   434	  };
   435	}
   436	
   437	/* ───────────────────────────────────────────────────────────────
   438	   4. SCHEMA MANAGEMENT
   439	──────────────────────────────────────────────────────────────── */
   440	
   441	const SCHEMA_SQL = `
   442	  CREATE TABLE IF NOT EXISTS session_sent_memories (
   443	    session_id TEXT NOT NULL,
   444	    memory_hash TEXT NOT NULL,
   445	    memory_id INTEGER,
   446	    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
   447	    PRIMARY KEY (session_id, memory_hash)
   448	  );
   449	`;
   450	
   451	const INDEX_SQL: string[] = [
   452	  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
   453	  'CREATE INDEX IF NOT EXISTS idx_session_sent_time ON session_sent_memories(sent_at);',
   454	];
   455	
   456	function ensureSchema(): InitResult {
   457	  if (!db) {
   458	    return { success: false, error: 'Database not initialized. Server may still be starting up.' };
   459	  }
   460	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '325,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   325	function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
   326	  if (!db) return [];
   327	  ensureSchema();
   328	
   329	  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
   330	  const safeFloor = Math.max(0, Math.min(1, floor));
   331	
   332	  try {
   333	    return (db.prepare(`
   334	      SELECT
   335	        wm.memory_id AS memoryId,
   336	        COALESCE(m.title, '') AS title,
   337	        COALESCE(m.file_path, '') AS filePath,
   338	        wm.attention_score AS attentionScore
   339	      FROM working_memory wm
   340	      LEFT JOIN memory_index m ON wm.memory_id = m.id
   341	      WHERE wm.session_id = ?
   342	        AND wm.memory_id IS NOT NULL
   343	        AND wm.attention_score > ?
   344	      ORDER BY wm.attention_score DESC, wm.last_focused DESC
   345	      LIMIT ?
   346	    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
   347	  } catch (error: unknown) {
   348	    const msg = error instanceof Error ? error.message : String(error);
   349	    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
   350	    return [];
   351	  }
   352	}
   353	
   354	function getSessionInferredMode(sessionId: string): string | null {
   355	  const mode = sessionModeRegistry.get(sessionId);
   356	  return typeof mode === 'string' && mode.length > 0 ? mode : null;
   357	}
   358	
   359	function setSessionInferredMode(sessionId: string, mode: string): void {
   360	  const normalizedSessionId = sessionId.trim();
   361	  const normalizedMode = mode.trim();
   362	  if (normalizedSessionId.length === 0 || normalizedMode.length === 0) {
   363	    return;
   364	  }
   365	  sessionModeRegistry.set(normalizedSessionId, normalizedMode);
   366	}
   367	
   368	/**
   369	 * Calculate attention tier for an entry.
   370	 */
   371	function calculateTier(attentionScore: number): string {
   372	  if (attentionScore >= 0.8) return 'focused';
   373	  if (attentionScore >= 0.5) return 'active';
   374	  if (attentionScore >= 0.2) return 'peripheral';
   375	  return 'fading';
   376	}
   377	
   378	/**
   379	 * Set or update the attention score for a memory in working memory.
   380	 */
   381	function setAttentionScore(
   382	  sessionId: string,
   383	  memoryId: number,
   384	  score: number
   385	): boolean {
   386	  if (!db) return false;
   387	  ensureSchema();
   388	
   389	  const clampedScore = Math.max(0, Math.min(1, score));
   390	
   391	  try {
   392	    const currentEventCounter = nextEventCounter(sessionId);
   393	
   394	    const existing = (db.prepare(
   395	      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
   396	    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;
   397	
   398	    if (existing) {
   399	      (db.prepare(`
   400	        UPDATE working_memory
   401	        SET attention_score = ?,
   402	            last_focused = CURRENT_TIMESTAMP,
   403	            focus_count = focus_count + 1,
   404	            mention_count = MIN(mention_count + 1, ${MAX_MENTION_COUNT}),
   405	            event_counter = ?
   406	        WHERE session_id = ? AND memory_id = ?
   407	      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
   408	    } else {
   409	      // Check capacity
   410	      enforceMemoryLimit(sessionId);
   411	
   412	      (db.prepare(`
   413	        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
   414	        VALUES (?, ?, ?, ?, 0)
   415	      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
   416	    }
   417	
   418	    return true;
   419	  } catch (error: unknown) {
   420	    const msg = error instanceof Error ? error.message : String(error);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '207,405p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   261	          queryId: _evalQueryId,
   262	          resultMemoryIds: memoryIds,
   263	          scores: memoryIds.map(() => 1.0), // trigger matches are binary
   264	          fusionMethod: 'trigger',
   265	          latencyMs,
   266	        });
   267	      }
   268	    } catch (_error: unknown) {
   269	      /* eval logging must never break triggers handler */
   270	    }
   271	  };
   272	
   273	  const useCognitive = includeCognitive &&
   274	    sessionId &&
   275	    workingMemory.isEnabled() &&
   276	    attentionDecay.getDb();
   277	
   278	  let decayStats: DecayStats | null = null;
   279	  if (useCognitive) {
   280	    try {
   281	      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
   282	    } catch (err: unknown) {
   283	      const message = toErrorMessage(err);
   284	      console.warn('[memory_match_triggers] Decay failed:', message);
   285	    }
   286	  }
   287	
   288	  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
   289	  let results: TriggerMatch[] = triggerMatchResult.matches;
   290	
   291	  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
   292	  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
   293	  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
   294	    try {
   295	      const database = initialize_db();
   296	      const memoryIds = results.map(r => r.memoryId);
   297	      if (memoryIds.length > 0) {
   298	        const placeholders = memoryIds.map(() => '?').join(',');
   299	        const scopeRows = database.prepare(`
   300	          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
   301	          FROM memory_index WHERE id IN (${placeholders})
   302	        `).all(...memoryIds) as Array<{
   303	          id: number;
   304	          spec_folder?: string;
   305	          tenant_id?: string;
   306	          user_id?: string;
   307	          agent_id?: string;
   308	          shared_space_id?: string;
   309	        }>;
   310	        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
   311	        results = results.filter(match => {
   312	          const row = scopeMap.get(match.memoryId);
   313	          if (!row) return false;
   314	          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
   315	          // when the caller specifies a scope, not silently passed through.
   316	          if (specFolder && row.spec_folder !== specFolder) return false;
   317	          if (tenantId && row.tenant_id !== tenantId) return false;
   318	          if (userId && row.user_id !== userId) return false;
   319	          if (agentId && row.agent_id !== agentId) return false;
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

codex
The shape of the comparison is clearer now: Mex has lifecycle conventions, but not a lifecycle subsystem. I’m doing one last sweep across the external repo for any real session/state machinery so I can say “absent” based on code evidence, not just by inference from the main files.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "session|state|resume|bootstrap|continu|summary|last_updated|current project state|GROW" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/*.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md:35:First, read all files in context/ to understand the current scaffold state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md:37:Check the last_updated dates in the YAML frontmatter of each file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md:42:3. Update the file to reflect the current state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md:55:- Update last_updated in the YAML frontmatter of every file you change
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:3:description: Session bootstrap and navigation hub. Read at the start of every session before any task. Contains project state, routing table, and behavioural contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:17:last_updated: [YYYY-MM-DD]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:24:Then read this file fully before doing anything else in this session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:29:     This is the primary drift prevention mechanism — it re-grounds the agent every session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:33:     - User authentication and session management
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:45:Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:61:2. **BUILD** — Do the work. If a pattern exists, follow its Steps. If you are about to deviate from an established pattern, say so before writing any code — state the deviation and why.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:64:5. **GROW** — After completing the task:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:65:   - If no pattern exists for this task type, create one in `patterns/` using the format in `patterns/README.md`. Add it to `patterns/INDEX.md`. Flag it: "Created `patterns/<name>.md` from this session."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:14:1. Detects your project state (existing codebase, fresh project, or partial)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:72:description, triggers, edges, last_updated). Only create these for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:98:grows incrementally — the behavioural contract (step 5: GROW) will create
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:167:format (name, description, triggers, edges, last_updated). Only create
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:173:Update ROUTER.md current state to reflect that this is a new project.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:184:incrementally — the behavioural contract (step 5: GROW) will create
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md:213:**Verify** by starting a fresh session and asking your agent:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:24:AI agents forget everything between sessions. mex gives them permanent, navigable project memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:26:Every session starts cold:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:34:mex is a structured markdown scaffold with a CLI that keeps it honest. The scaffold gives agents persistent project knowledge through navigable files — architecture, conventions, decisions, patterns. The CLI detects when those files drift from the actual codebase, and targets AI to fix only what's broken. The scaffold grows automatically — after every task, the agent updates project state and creates patterns from real work.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:174:**~60% average token reduction per session.**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:193:After task: agent updates scaffold (GROW step)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:195:New patterns, updated project state — scaffold grows from real work
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:198:CLAUDE.md stays at ~120 tokens. The agent navigates to only what it needs. After every task, the agent updates the scaffold — creating patterns from new task types, updating project state, fixing stale context. The scaffold compounds over time.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:206:│   ├── ROUTER.md          ← routing table, session bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md:4:last_updated: [YYYY-MM-DD]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md:35:After completing any task: update `.mex/ROUTER.md` project state and any `.mex/` files that are now out of date. If no pattern existed for the task you just completed, create one in `.mex/patterns/`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md:38:At the start of every session, read `.mex/ROUTER.md` before doing anything else.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md:88:**Consequence**: A warning with consequences for continued behavior. No
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md:21:- Project state detection: fresh, existing, or partial scaffold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md:31:- Sync now sends all drift issues to Claude in a single session instead of one session per file — reduces token usage and eliminates repeated session restarts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md:4:last_updated: [YYYY-MM-DD]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md:38:After every task: if no pattern exists for the task type you just completed, create one. If a pattern or context file is now out of date, update it. The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md:41:At the start of every session, read `ROUTER.md` before doing anything else.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:16:    if (!existsSync(path)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:48:        if (seen.has(path)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:43:    if (entry.startsWith(".") && entry !== ".github") continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:44:    if (IGNORE_DIRS.has(entry)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:51:      continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:54:    if (!stat.isDirectory()) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:72:    if (category === "other") continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:83:      if (entry.startsWith(".")) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:84:      if (IGNORE_DIRS.has(entry)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts:91:        continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:144:    // Step 3: Fix all files in one interactive session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:146:    console.log(chalk.bold(`\nSending all ${targets.length} file(s) to Claude in one session...\n`));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:152:      console.log(chalk.red("  ✗ Claude session failed"));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:171:    // Step 5: Check if we should continue
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:197:    // Ask user whether to continue
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:29:last_updated: ${today}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts:68:  last_updated?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts:37:      continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:49:    if (IGNORED_SCRIPTS.has(script)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:56:      continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts:62:      if (scaffoldText.includes(base)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts:33:  .option("--quiet", "Single-line summary only")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts:18:    if (!edge.target) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts:11:    if (!match) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts:19:    if (versionClaims.length < 2) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts:51:    if (cmdClaims.length < 2) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts:53:    if (!fromDifferentFiles) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:32:  "bootstrap", "sass", "less", "postcss",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:58:    if (KNOWN_RUNTIMES.has(name)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts:79:    if (!match) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts:88:      continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts:96:        continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:20:    if (pathExists(claim.value, projectRoot, scaffoldRoot)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:130:  // ── Step 1: Detect project state ──
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:132:  const state = detectProjectState(projectRoot, mexDir);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:134:  switch (state) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:166:        continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:196:  if (state !== "fresh") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:212:  if (state === "fresh") {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:234:    info("An interactive Claude Code session will open with the population prompt.");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:450:  info("Verify — start a fresh session and ask:");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts:42:    if (!node.position) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:3: * Three variants based on project state:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:26:grows incrementally — the behavioural contract (step 5: GROW) will create
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:72:description, triggers, edges, last_updated). Only create these for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:112:frontmatter format (name, description, triggers, edges, last_updated).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:118:Update .mex/ROUTER.md current state to reflect that this is a new project.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:129:incrementally — the behavioural contract (step 5: GROW) will create

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '340,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"cachedSummary|handleMemoryContext\\(|memory_context\\(|minimal|structuralContext|sessionQuality|hints.push|loadMostRecentState|buildCachedSessionSummaryCandidate|evaluateCachedSessionSummaryCandidate\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
34:import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
84:  cachedSummary: CachedSessionSummary | null;
90:  minimal?: boolean;
110:  cachedSummary?: CachedSessionSummaryDecision;
111:  structuralContext?: StructuralBootstrapContract;
112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
170:    cachedSummary: null,
174:export function buildCachedSessionSummaryCandidate(
191:export function evaluateCachedSessionSummaryCandidate(
332:    cachedSummary: {
357:  const candidate = buildCachedSessionSummaryCandidate(
358:    options.state ?? loadMostRecentState({
366:  return evaluateCachedSessionSummaryCandidate(candidate, options);
372:): T & { cachedSummary?: CachedSessionSummary } {
373:  if (decision.status !== 'accepted' || !decision.cachedSummary) {
379:    cachedSummary: decision.cachedSummary,
409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
411:  if (args.minimal) {
412:    memoryResult = { skipped: true, reason: 'minimal mode' };
415:      const mcpResponse = await handleMemoryContext({
433:      hints.push('Memory resume failed. Try memory_context manually.');
459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
468:    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
473:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
477:  const structuralTrust = buildStructuralContextTrust(structuralContext);
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
551:      content: structuralContext.summary,
564:      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
572:      trustState: trustStateFromStructuralStatus(structuralContext.status),
574:      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
587:    cachedSummary: cachedSummaryDecision,
588:    structuralContext,
595:    ...(sessionQuality ? { sessionQuality } : {}),
600:  if (!args.minimal) {

 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '620,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
codex
I have enough code evidence for the comparison itself. I’m doing the phase-folder validation pass the brief asked for, mainly to see whether the environment lets it run cleanly in this read-only session and to capture any constraints that affect the iteration.
exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1470ms:

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


exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '20,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '720,810p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   720	
   721	- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
   722	
   723	## Task 4: Align session recovery contract + hook path docs across 023/024 + command docs, outcome success
   724	
   725	### rollout_summary_files
   726	
   727	- rollout_summaries/2026-04-02T15-19-14-ItVu-doc_parity_recovery_024_023.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-19-14-019d4ec6-f1fa-75d3-9091-3f77194ae5c0.jsonl, updated_at=2026-04-02T17:06:24+00:00, thread_id=019d4ec6-f1fa-75d3-9091-3f77194ae5c0)
   728	
   729	### keywords
   730	
   731	- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
   732	
   733	## Task 5: Truth-sync changelog packet `023-esm-module-compliance` (add phase 013 + adjust 010-012 claims), outcome success
   734	
   735	### rollout_summary_files
   736	
   737	- rollout_summaries/2026-04-02T15-04-40-XOMQ-changelog_023_esm_module_compliance_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-04-40-019d4eb9-9c7f-7e91-a395-f537a58c3d74.jsonl, updated_at=2026-04-02T15:16:00+00:00, thread_id=019d4eb9-9c7f-7e91-a395-f537a58c3d74)
   738	
   739	### keywords
   740	
   741	- changelog-root-esm-module-compliance.md, changelog-013-fts5-fix-and-search-dashboard.md, v1.1.0, 13 phases, validate.sh --recursive --strict
   742	
   743	## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
   744	
   745	### rollout_summary_files
   746	
   747	- rollout_summaries/2026-04-02T15-03-16-TyzB-changelog_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-03-16-019d4eb8-5687-7820-b943-28f8d97369cf.jsonl, updated_at=2026-04-02T15:17:25+00:00, thread_id=019d4eb8-5687-7820-b943-28f8d97369cf)
   748	
   749	### keywords
   750	
   751	- scratch/changelog-024-root.md, changelog-024-<phase>.md, use max sub agents, packet-local scratch, implementation-summary, review report
   752	
   753	## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
   754	
   755	### rollout_summary_files
   756	
   757	- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
   758	
   759	### keywords
   760	
   761	- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
   762	
   763	## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
   764	
   765	### rollout_summary_files
   766	
   767	- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)
   768	
   769	### keywords
   770	
   771	- current reality, no longer wording removal, bounded selective_reindex, full_scan guidance, v3.3.0.0, gate-tool-routing.md, constitutional/README.md
   772	
   773	## User preferences
   774	
   775	- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
   776	- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
   777	- when user asked to “use max sub agents” for packet changelog synthesis, parallelize phase evidence gathering but keep output scoped to the requested packet `scratch/` folder [Task 6]
   778	- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
   779	- when refining README wording, the user asked for “current reality” language, plain English, and no “no longer” phrasing or internal spec-folder references in runtime-state descriptions [Task 8]
   780	- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
   781	
   782	## Reusable knowledge
   783	
   784	- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
   785	- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
   787	- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
   788	- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
   789	- for packet changelog generation at this scale, first mirror prior packet changelog structure, then gather evidence from implementation summaries/checklists/review docs before drafting per-phase files [Task 6]
   790	- README formatting in this repo is partially hand-formatted; if `npx prettier --check README.md` fails but `git diff --check` is clean, keep scoped edits and avoid whole-file reflow [Task 7]
   791	- constitutional README parity check should enumerate both `gate-enforcement.md` and `gate-tool-routing.md` as required files so operators see the full always-surfaced ruleset [Task 8]
   792	
   793	## Failures and how to do differently
   794	
   795	- symptom: tests not found when running Vitest with file filters from repo root; cause: package-scoped configs were bypassed; fix: run from the owning package roots (`scripts`, `mcp_server`) [Task 4]
   796	- symptom: strict validation keeps failing on packet docs despite correct intent; cause: missing acceptance scenarios, protocol sections, or template anchors; fix: align to SPECKIT template headings first, then rerun validator [Task 2][Task 3]
   797	- symptom: bulk patching changelog files accidentally removes or rewrites wrong sections; cause: oversized patch scope; fix: restore from HEAD and apply smaller file-local patches [Task 5]
   798	- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]
   799	
   800	# Task Group: Compact Code Graph Session-Start Injection and Codex Priming Diagnostics
   801	scope: session-start injection debugging, codex runtime session-id fallback, and test-environment fixes for git-context-sensitive suites
   802	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
   803	
   804	## Task 1: Debug session-start injection, create phase 026, and stabilize test environment, outcome success
   805	
   806	### rollout_summary_files
   807	
   808	- rollout_summaries/2026-04-02T09-20-39-30Ww-compact_code_graph_session_start_injection_debug.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T11-20-39-019d4d7e-a9d9-7081-bf44-8615f401e064.jsonl, updated_at=2026-04-02T10:59:48+00:00, thread_id=019d4d7e-a9d9-7081-bf44-8615f401e064)
   809	
   810	### keywords

codex
# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our `memory_context`, `generate-context.js`, `session_bootstrap`.

## Findings

### Finding 1: Mex’s “session bootstrap” is a static reading ritual, not an executable recovery surface
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md` lines 178-198; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md` lines 20-68; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` lines 163-244; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` lines 205-285
- **What it does**: Mex defines bootstrap as “read `AGENTS.md`, then `ROUTER.md`, then the routed context files,” with `Current Project State` in markdown acting as the grounding mechanism. Our `session_bootstrap()` is executable: it calls `session_resume`, calls `session_health`, builds a structural readiness contract, emits hints/next actions, and attaches trust metadata to the payload.
- **Why it matters for us**: Mex has a useful human-readable anchor, but it cannot answer “is resume context stale?”, “is the code graph missing?”, or “what recovery action should I take next?” at runtime. Our bootstrap layer is materially stronger for non-hook recovery and operational safety.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Mex’s `init`/`setup` flow creates a cold-start brief, but it is not continuity state
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts` lines 192-218 and 229-269; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts` lines 20-52; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md` lines 13-18 and 211-228; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` lines 348-366 and 409-489
- **What it does**: Mex scans once, serializes a compact brief, and either launches Claude with that prompt or prints it for manual paste. Verification is “start a fresh session and ask the agent what it knows.” Our resume path instead reconstitutes live state each time through `memory_context(mode:"resume")`, then optionally appends a cached continuity summary only if transcript identity, freshness window, and scope checks all pass.
- **Why it matters for us**: Mex’s scanner is a good bootstrap compression tool, but it is setup-time scaffolding, not session continuity. It does not persist or validate ongoing conversational state the way our resume stack does.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Mex has a strong repair lifecycle loop even though it lacks a true session subsystem
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts` lines 29-210; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts` lines 7-97; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md` lines 9-13 and 35-62
- **What it does**: Mex runs a tight lifecycle: drift check, filter/group issues, build one combined repair brief, run one Claude session, re-check, compute score delta, and ask whether to continue. The state is not durable, but the operational loop is disciplined and verification-first.
- **Why it matters for us**: This is the most reusable lifecycle idea in Mex. It fits our doc/memory drift work well: keep `session_bootstrap`, `memory_context`, and `generate-context.js` as the continuity backbone, but wrap drift remediation in a Mex-style “fix only the broken files, then re-verify immediately” loop.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Spec Kit Memory has a trusted, scoped session model; Mex effectively has none
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` lines 385-435 and 1020-1065; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` lines 821-910 and 1221-1450; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts` lines 4-15 and 67-159; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` lines 207-230 and 273-399; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts` lines 5-123
- **What it does**: Our stack mints server-managed session IDs, rejects untrusted caller IDs, binds sessions to tenant/user/agent scope, persists `session_state`, keeps ephemeral retrieval-state for seen results/open questions/anchors, and injects working-memory prompt context during resume. Mex’s code has config, drift, scanner, sync, and scaffold types, but no comparable runtime session identity, scope validation, or cross-turn retrieval state.
- **Why it matters for us**: This is the biggest lifecycle gap. Mex can preserve project knowledge in markdown, but it cannot preserve trusted per-session retrieval state or safely resume scoped working context across turns.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: `generate-context.js` is a real session-capture pipeline; Mex’s GROW model is authoring discipline, not structured capture
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` lines 51-84 and 85-125; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` lines 1350-1603; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md` lines 34 and 193-198; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md` lines 64-68; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md` lines 35-56
- **What it does**: Our save path accepts structured JSON/stdin, treats explicit CLI spec-folder targets as authoritative, and materializes durable artifacts containing summary, outcomes, blockers, next action, canonical-doc awareness, session ID, git provenance, and context typing. Mex’s equivalent is “after task, update `ROUTER.md`, update context files, create/update patterns, and bump `last_updated`.”
- **Why it matters for us**: Mex’s GROW step is valuable for maintaining a human-readable scaffold, but it is not a substitute for structured session capture. Replacing `generate-context.js` with Mex-style manual scaffold mutation would be a lifecycle regression.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`

## Assessment
- New information ratio: 0.74
- Questions addressed: whether Mex has a real bootstrap/recovery surface; whether Mex persists resumable session state; how Mex setup/init differs from our resume path; whether Mex sync has reusable lifecycle control patterns; how Mex’s GROW model compares to `generate-context.js`; whether Mex has any analogue to trusted session IDs, scoped session state, or working-memory injection
- Questions answered: Mex’s lifecycle is scaffold-driven and mostly manual; Mex has no executable session recovery contract comparable to `session_bootstrap`; Mex has no trusted session/state subsystem comparable to `memory_context` + session manager + working memory; Mex’s strongest lifecycle idea is the verify-and-repeat repair loop in `sync`; `generate-context.js` remains substantially stronger than Mex’s manual scaffold-growth model for authoritative session capture

## Reflection
- What worked: tracing the lifecycle surfaces in order from markdown contract (`README`/`ROUTER`/`SETUP`/`SYNC`) into `src/setup/index.ts`, `src/scanner/index.ts`, and `src/sync/index.ts` made it easy to separate “scaffold ritual” from “runtime state”; on our side, pairing `session-bootstrap.ts`, `session-resume.ts`, `memory-context.ts`, `session-manager.ts`, and `generate-context.ts` exposed the full continuity stack clearly
- What did not work: there is no hidden Mex session subsystem to compare against, so some conclusions are absence-based and had to be validated by repo-wide source search rather than a single implementation file; `validate.sh --strict` passed for the phase folder, but it also emitted `cannot create temp file for here document: Operation not permitted`, which is consistent with the read-only sandbox rather than a packet problem

## Recommended Next Focus
Compare Modus Memory or Mnemosyne on the same lifecycle axis: trusted session identity, resumable state, save-path authority, and whether they have anything comparable to our additive cached-summary gates. The other practical next step is design work: keep `generate-context.js` authoritative, but prototype a Mex-style human-readable “Current Project State” projection generated from saved session artifacts rather than maintained manually.


hook: Stop
hook: Stop Completed
tokens used
244,636
# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our `memory_context`, `generate-context.js`, `session_bootstrap`.

## Findings

### Finding 1: Mex’s “session bootstrap” is a static reading ritual, not an executable recovery surface
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md` lines 178-198; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md` lines 20-68; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` lines 163-244; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` lines 205-285
- **What it does**: Mex defines bootstrap as “read `AGENTS.md`, then `ROUTER.md`, then the routed context files,” with `Current Project State` in markdown acting as the grounding mechanism. Our `session_bootstrap()` is executable: it calls `session_resume`, calls `session_health`, builds a structural readiness contract, emits hints/next actions, and attaches trust metadata to the payload.
- **Why it matters for us**: Mex has a useful human-readable anchor, but it cannot answer “is resume context stale?”, “is the code graph missing?”, or “what recovery action should I take next?” at runtime. Our bootstrap layer is materially stronger for non-hook recovery and operational safety.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Mex’s `init`/`setup` flow creates a cold-start brief, but it is not continuity state
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts` lines 192-218 and 229-269; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts` lines 20-52; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md` lines 13-18 and 211-228; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` lines 348-366 and 409-489
- **What it does**: Mex scans once, serializes a compact brief, and either launches Claude with that prompt or prints it for manual paste. Verification is “start a fresh session and ask the agent what it knows.” Our resume path instead reconstitutes live state each time through `memory_context(mode:"resume")`, then optionally appends a cached continuity summary only if transcript identity, freshness window, and scope checks all pass.
- **Why it matters for us**: Mex’s scanner is a good bootstrap compression tool, but it is setup-time scaffolding, not session continuity. It does not persist or validate ongoing conversational state the way our resume stack does.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Mex has a strong repair lifecycle loop even though it lacks a true session subsystem
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts` lines 29-210; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts` lines 7-97; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md` lines 9-13 and 35-62
- **What it does**: Mex runs a tight lifecycle: drift check, filter/group issues, build one combined repair brief, run one Claude session, re-check, compute score delta, and ask whether to continue. The state is not durable, but the operational loop is disciplined and verification-first.
- **Why it matters for us**: This is the most reusable lifecycle idea in Mex. It fits our doc/memory drift work well: keep `session_bootstrap`, `memory_context`, and `generate-context.js` as the continuity backbone, but wrap drift remediation in a Mex-style “fix only the broken files, then re-verify immediately” loop.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Spec Kit Memory has a trusted, scoped session model; Mex effectively has none
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts` lines 385-435 and 1020-1065; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` lines 821-910 and 1221-1450; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts` lines 4-15 and 67-159; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` lines 207-230 and 273-399; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts` lines 5-123
- **What it does**: Our stack mints server-managed session IDs, rejects untrusted caller IDs, binds sessions to tenant/user/agent scope, persists `session_state`, keeps ephemeral retrieval-state for seen results/open questions/anchors, and injects working-memory prompt context during resume. Mex’s code has config, drift, scanner, sync, and scaffold types, but no comparable runtime session identity, scope validation, or cross-turn retrieval state.
- **Why it matters for us**: This is the biggest lifecycle gap. Mex can preserve project knowledge in markdown, but it cannot preserve trusted per-session retrieval state or safely resume scoped working context across turns.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: `generate-context.js` is a real session-capture pipeline; Mex’s GROW model is authoring discipline, not structured capture
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` lines 51-84 and 85-125; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` lines 1350-1603; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md` lines 34 and 193-198; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md` lines 64-68; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md` lines 35-56
- **What it does**: Our save path accepts structured JSON/stdin, treats explicit CLI spec-folder targets as authoritative, and materializes durable artifacts containing summary, outcomes, blockers, next action, canonical-doc awareness, session ID, git provenance, and context typing. Mex’s equivalent is “after task, update `ROUTER.md`, update context files, create/update patterns, and bump `last_updated`.”
- **Why it matters for us**: Mex’s GROW step is valuable for maintaining a human-readable scaffold, but it is not a substitute for structured session capture. Replacing `generate-context.js` with Mex-style manual scaffold mutation would be a lifecycle regression.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`

## Assessment
- New information ratio: 0.74
- Questions addressed: whether Mex has a real bootstrap/recovery surface; whether Mex persists resumable session state; how Mex setup/init differs from our resume path; whether Mex sync has reusable lifecycle control patterns; how Mex’s GROW model compares to `generate-context.js`; whether Mex has any analogue to trusted session IDs, scoped session state, or working-memory injection
- Questions answered: Mex’s lifecycle is scaffold-driven and mostly manual; Mex has no executable session recovery contract comparable to `session_bootstrap`; Mex has no trusted session/state subsystem comparable to `memory_context` + session manager + working memory; Mex’s strongest lifecycle idea is the verify-and-repeat repair loop in `sync`; `generate-context.js` remains substantially stronger than Mex’s manual scaffold-growth model for authoritative session capture

## Reflection
- What worked: tracing the lifecycle surfaces in order from markdown contract (`README`/`ROUTER`/`SETUP`/`SYNC`) into `src/setup/index.ts`, `src/scanner/index.ts`, and `src/sync/index.ts` made it easy to separate “scaffold ritual” from “runtime state”; on our side, pairing `session-bootstrap.ts`, `session-resume.ts`, `memory-context.ts`, `session-manager.ts`, and `generate-context.ts` exposed the full continuity stack clearly
- What did not work: there is no hidden Mex session subsystem to compare against, so some conclusions are absence-based and had to be validated by repo-wide source search rather than a single implementation file; `validate.sh --strict` passed for the phase folder, but it also emitted `cannot create temp file for here document: Operation not permitted`, which is consistent with the read-only sandbox rather than a packet problem

## Recommended Next Focus
Compare Modus Memory or Mnemosyne on the same lifecycle axis: trusted session identity, resumable state, save-path authority, and whether they have anything comparable to our additive cached-summary gates. The other practical next step is design work: keep `generate-context.js` authoritative, but prototype a Mex-style human-readable “Current Project State” projection generated from saved session artifacts rather than maintained manually.
