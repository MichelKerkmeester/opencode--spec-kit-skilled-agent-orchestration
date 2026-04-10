# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
- Novelty justification: [1-sentence explanation]

## Ruled Out
- [approaches eliminated and why]

## Reflection
- What worked: [approach + causal explanation]
- What did not work: [approach + root cause]
- What I would do differently: [specific adjustment]

## Recommended Next Focus
[What to investigate next]

ACCUMULATED FINDINGS SUMMARY:
rnal/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **Source**: [README.md:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [scoring.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts), [reporter.ts:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts)
- **What it does**: Mex compresses all issues into `100 - 10/error - 3/warning - 1/info` and surfaces that as the main health signal.
- **Why it matters**: Public needs evidence by subsystem. A single number hides whether the real problem is markdown integrity, retrieval quality, stale graph context, or save/index health.
- **Recommendation**: reject
- **Priority**: 7
- **Effort score**: 2/10
- **Impact**: medium
- **Impact score**: 7/10

## Assessment
- **New information ratio**: 0.10
- **Updated classification**: `adopt now` = static markdown integrity lane, simplified guided maintenance surface; `prototype later` = dual freshness metadata, optional scaffold-growth companion; `reject` = markdown-first memory replacement, score-first health; `NEW FEATURE` = `spec-kit doctor`
- **Definitive recommendation**: do not import Mex wholesale. Transplant only the lexical integrity layer and the repair-loop DX, while keeping retrieval, graph, and durable memory authority inside Spec Kit Memory.
- **Validation status**: strict validation for the phase folder passed with `Errors: 0  Warnings: 0`, though the script emitted a sandbox temp-file warning during execution.
- **Write status**: this session is read-only, so I could not update [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/research.md), create `implementation-summary.md`, or persist the final synthesis into the phase folder.

## Recommended Next Focus
1. Specify a narrow integrity phase: `path`, `edge`, and `index-sync` checks only, reported by severity and kept separate from recall scoring.
2. Design `spec-kit doctor` around existing primitives: `session_bootstrap -> memory_health -> memory_save(dryRun) -> optional repair brief -> recheck -> next hints`.
3. Revisit broader command/dependency/script audits only after a provider-neutral inventory model exists for npm, shell, Python, MCP commands, wrappers, and spec docs.
--- Iteration 31 ---
## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
--
## Findings
For EACH finding:
### Finding N: [Title]

## Assessment
- New information ratio: 0.16
- Questions addressed: quarter sequencing, dependency ordering, where `spec-kit doctor` fits, whether freshness precedes or follows integrity, when scaffold growth becomes safe
- Questions answered: Q1 = integrity lane plus small maintenance surface; Q2 = `spec-kit doctor` plus advisory freshness metadata; Q3 = optional scaffold-growth companion after integrity and doctor exist
- Novelty justification: the mechanisms were already known by iteration 030, but this pass adds the missing dependency graph and milestone timing
- Dependency chain: `integrity lane -> guided maintenance surface -> spec-kit doctor -> advisory freshness -> optional scaffold-growth companion`

## Ruled Out
- markdown-first memory replacement, because prior synthesis concluded it would regress hybrid retrieval and causal/context tooling
- single blended drift score as the main health surface, because subsystem evidence matters more than one aggregate number
- Q1 adoption of command/dependency/script-coverage audits, because iteration 030 already recommended waiting for a provider-neutral inventory model

## Reflection
- What worked: using the final synthesis in [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/research.md#L268592) as the roadmap anchor, then validating each quarter against primary Mex source files
- What did not work: the phase artifacts are noisy and partially duplicated, CocoIndex calls canceled during this pass, and the read-only sandbox prevented persisting this iteration into the phase folder
- What I would do differently: turn the Q1 dependency contract into a small acceptance matrix first, so later iterations can validate execution readiness instead of re-deriving sequencing

## Recommended Next Focus
Convert Q1 into implementation-ready slices: define the markdown-integrity issue schema, the operator-facing command/hint surface, and the explicit handoff contract that `spec-kit doctor` will consume in Q2.
--- Iteration 32 ---
## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
--
## Findings
### Finding 1: Static markdown reference integrity is the only clear adopt-now slice
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
## Assessment
- New information ratio: 0.18
- Questions addressed: what breaks if the integrity lane is introduced; what breaks if the maintenance UX is simplified; which flags and rollback boundaries make both safe; whether `spec-kit doctor` belongs in the same migration slice
- Questions answered: the integrity lane is safe only as opt-in advisory scope; the guided maintenance surface is safe only as a thin wrapper over existing authority; `spec-kit doctor` should remain a later orchestration layer, not part of the first adoption wave
- Novelty justification: prior iterations picked the adopt-now patterns; this pass adds the missing migration hazard model, flag topology, and rollback sequencing needed to implement them safely
- Validation note: strict phase validation passed on April 10, 2026 with `Errors: 0  Warnings: 0`, although the validator emitted a read-only temp-file warning during execution

## Ruled Out
- Shipping the integrity lane as a blocking validator on day one, because false-positive calibration is the main migration risk
- Folding integrity findings into the same top-level health score as retrieval/index state, because that would blur subsystem ownership
- Making the simplified maintenance surface auto-repair by default, because it would bypass or obscure current confirmation semantics
- Bundling `spec-kit doctor` into the same release as the first two adopt-now slices, because it compounds routing and repair risk

## Reflection
- What worked: anchoring on the locked iteration-030 synthesis, then re-reading the exact Mex drift/sync code and the current Spec Kit handler contracts, made the risk matrix specific instead of speculative
- What did not work: the semantic CocoIndex pass cancelled, so this iteration relied on direct source inspection rather than an additional semantic discovery sweep
- What I would do differently: convert the feature-flag proposals into a concrete acceptance matrix next, with one testable success/failure criterion per flag and per migration slice

## Recommended Next Focus
Define the phased rollout contract for the first implementation wave: scope whitelist, advisory-to-blocking promotion criteria, wrapper telemetry fields, and the exact acceptance tests that must pass before `spec-kit doctor` is allowed to move from planner-only to execution-enabled.
--- Iteration 33 ---
## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
--
## Findings
For EACH finding:
### Finding N: [Title]
- What worked: reading the external and local test suites directly was the fastest route, because the testing strategy is encoded more clearly in tests than in README prose
- What did not work: the CocoIndex search attempt was canceled, so this iteration relied on direct file inspection only
- What I would do differently: next pass, map the proposed integrity fixtures to exact handler filenames before implementation so the first test PR can be scoped mechanically

## Recommended Next Focus
Implement the test plan in three lanes.

1. `integrity-unit`
Create fixture-driven suites for claim extraction and the adopt-now checkers.
Pass bar: every seeded placeholder, negated section, comment, scaffold-root, and orphan/missing case returns the expected issue code and severity.

2. `contract-integration`
Add or extend tests around `generate-context` authority, `memory_save` dry-run/write/no-op UX, `memory_health` confirmation-only behavior, `memory_context` routing, and `code_graph_scan` stale/full-reindex transitions.
Pass bar: exact response envelopes are stable, and non-mutating flows do not write.

3. `quality-regression`
Keep a fixed benchmark lane for `memory_search`, `memory_context`, and trigger retrieval using ablation, per-channel eval logging, and learned-feedback safeguards.
Pass bar: no unintended drop beyond agreed thresholds such as `Recall@20` or `MRR`, and channel-attribution logs remain complete.

Read-only note: strict phase validation passed for `002-mex-main` with `Errors: 0  Warnings: 0`, but I could not persist `iteration-033.md`, update `research.md`, create `implementation-summary.md`, or run `generate-context.js` in this sandbox.
--- Iteration 34 ---
## Findings
### Finding N: [Title]
- **Source**: file path(s) [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
--
## Findings
For EACH finding:
### Finding N: [Title]
## Ruled Out
- Running Mex-style git staleness checks inside `session_bootstrap`, `memory_context`, or MCP startup, because that would add repeated git-history cost to the most latency-sensitive surfaces.
- Folding static integrity checks into `memory_search`, because Public already uses routing, cache, fusion, rerank, and graph readiness there; mixing maintenance work into retrieval would blur latency ownership.
- Replacing Public’s hybrid SQLite/graph/embedding system with markdown-first persistence, because the storage savings would come at the cost of retrieval quality, session continuity, and graph-assisted recovery.

## Reflection
- **What worked**: Comparing Mex’s explicit command path (`check`/`sync`) against Public’s startup and retrieval paths made the performance boundary obvious: Mex pays on maintenance commands, Public pays during startup and search.
- **What did not work**: CocoIndex semantic cross-checks cancelled again in this environment, so this iteration relied on direct source inspection instead of a second semantic sweep.
- **What I would do differently**: Next pass, pair this source analysis with measured cold-start and warm-cache timings for `session_bootstrap`, `memory_search`, `memory_index_scan`, and a prototype integrity command so the trade-offs are quantified.

## Recommended Next Focus
Benchmark an isolated `spec-kit doctor` prototype that runs:
1. static integrity checks only,
2. optional git-freshness checks only on explicit request,
3. no embedding/model wait,
4. no startup injection.

Success bar: prove it improves repair-loop efficiency without increasing `session_bootstrap`, `memory_context`, or `memory_search` latency.

Read-only note: strict validation for `002-mex-main` passed with `Errors: 0  Warnings: 0`, but the validator emitted a temp-file warning due the sandbox, and I could not persist this iteration into the phase folder.

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
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
Using the pre-approved research path and keeping this read-only. I’m pulling the existing memory context, validating the phase folder state, and then I’ll trace the Mex sources against our Spec Kit Memory, CocoIndex, code-graph, and MCP surfaces for iteration 035.
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
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
/bin/zsh -lc "pwd && rg --files -g 'AGENTS.md' -g 'CLAUDE.md' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main: No such file or directory (os error 2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1168ms:

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
I found the external repo is mounted directly under `external/`, not `external/mex-main`, so I’m following the same analysis order against the actual paths. Next I’m reading the local external instructions plus the core Mex files, then I’ll compare them directly to our memory, code-graph, and MCP runtime surfaces.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "mex|002-mex-main|compatibility|cocoindex|code-graph|mcp" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 014-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
130:- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 014-code-graph-upgrades, description.json memory/metadata.json untouched
184:scope: adopt-now runtime lane + docs closeout for `014-code-graph-upgrades` with detector provenance, blast-radius constraints, and explicit verification gates
195:- 014-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
239:- symptom: full `mcp_server` and `scripts` Vitest gates failed in many unrelated suites during a minimal header-only pass; cause: pre-existing workspace-wide failures outside scoped style edits; fix: report and halt per stop rule (or baseline these failures before edit) rather than forcing broader remediation in a style-only task [Task 1]
345:## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success
363:- 026-graph-and-context-optimization, 024-compact-code-graph, 026/005-009, 024/032-034, AI Execution Protocol, SECTION_COUNTS, PHASE_LINKS, SPEC_DOC_INTEGRITY, validate.sh --strict, --no-recursive, implement the plan
522:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server; reuse_rule=reuse for feedback-event runtime checks in this checkout, but verify live process restart state before concluding
599:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation; reuse_rule=reuse for this packet-family remediation flow in this checkout, keeping fixes packet-local and revalidated
635:- symptom: strict-link validation reports external wiki issues during packet checks; cause: unrelated global `mcp-figma` wikilink debt; fix: mark as out-of-scope noise unless packet directly touches those resources [Task 1]
673:- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
693:## Task 1: Deep-review packet `024-compact-code-graph` with full parity gates, outcome success
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
743:## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
757:- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
775:- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
778:- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
787:- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
795:- symptom: tests not found when running Vitest with file filters from repo root; cause: package-scoped configs were bypassed; fix: run from the owning package roots (`scripts`, `mcp_server`) [Task 4]
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
908:scope: keep `.vscode/mcp.json` aligned with richer `.mcp.json`/`.claude/mcp.json` surfaces without breaking VS Code schema compatibility
911:## Task 1: Sync `.vscode/mcp.json` to richer MCP definitions while preserving VS Code format, outcome success
915:- rollout_summaries/2026-04-02T11-42-04-t8Zx-update_vscode_mcp_config.md (cwd=/Users/michelkerkmeester/MEGA/Development, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T13-42-04-019d4e00-205a-7ef1-a785-2c686da024df.jsonl, updated_at=2026-04-02T11:43:17+00:00, thread_id=019d4e00-205a-7ef1-a785-2c686da024df)
919:- .vscode/mcp.json, .mcp.json, .claude/mcp.json, inputs + servers, mcpServers, SPECKIT_SESSION_BOOST, SPECKIT_CAUSAL_BOOST, cocoindex_code, jq empty
923:- when user asked “Update ... .vscode/mcp.json to match, but keep vscode compatible format,” mirror richer entries but keep the `inputs` + `servers` wrapper unchanged [Task 1]
927:- `.vscode/mcp.json` remains VS Code wrapper-style (`inputs` + `servers`) while sibling files may use `mcpServers`; copy content parity without reshaping top-level schema [Task 1]
928:- richer flags/notes and `cocoindex_code` definitions can be sourced from `.mcp.json`/`.claude/mcp.json` and then validated with `jq empty` [Task 1]
938:## Task 1: Restore `spec_kit` slash-command prompt discovery by fixing `~/.codex/prompts` target and flat compatibility links, outcome success
955:- Some builds/autocomplete paths still expect flat files like `spec_kit-plan.md` and `memory-save.md`; keep compatibility symlinks from `.codex/prompts/<group>-<command>.md` to `.opencode/command/<group>/<command>.md` [Task 1]
956:- If slash commands vanish, verify both `readlink ~/.codex/prompts` and presence of `spec_kit-*.md`/`memory-*.md` compatibility files before restarting Codex [Task 1]
961:- symptom: command autocomplete remains partial after symlink fix; cause: only directory-level links exist and flat `group-command.md` files are missing; fix: recreate flat compatibility symlinks (for example `spec_kit-plan.md`, `memory-save.md`) [Task 1]
1053:- rollout_summaries/2026-03-28T09-04-14-JFQ4-memory_mcp_connectivity_check.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-04-14-019d33af-d439-7ed2-a540-7723e929ea58.jsonl, updated_at=2026-03-28T09:05:05+00:00, thread_id=019d33af-d439-7ed2-a540-7723e929ea58)
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1063:- rollout_summaries/2026-03-28T08-07-16-1KIB-spec_kit_memory_mcp_troubleshoot.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-07-16-019d337b-ad27-7321-a2f9-0ad1f077698d.jsonl, updated_at=2026-03-28T08:52:27+00:00, thread_id=019d337b-ad27-7321-a2f9-0ad1f077698d)
1067:- codex features enable memories, codex features enable code_mode, ~/.codex/config.toml, session_meta.dynamic_tools, mcp_startup, handshake timeout
1097:- If `list_mcp_resources`/`list_mcp_resource_templates` are empty, treat `spec_kit_memory` as configured-but-not-exposed and verify config + handler presence before assuming tool absence in code [Task 5]
1098:- Desktop `session_meta.dynamic_tools` plus absence of `mcp_startup` events is a stronger surfacing signal than standalone `node context-server.js` timeout probes [Task 6]
1146:## Task 4: Close `024-codex-memory-mcp-fix` as documentation-complete and route broader runtime work to follow-on recommendations
1150:- rollout_summaries/2026-03-28T09-46-45-wNy2-codex_memory_mcp_fix_closure.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-46-45-019d33d6-c35d-79e1-b110-527630e81272.jsonl, updated_at=2026-03-28T09:47:10+00:00, thread_id=019d33d6-c35d-79e1-b110-527630e81272)
1154:- 024-codex-memory-mcp-fix, Status: Complete, follow-on recommendations, T020-T032, validate.sh --no-recursive, 12. OPEN QUESTIONS, TEMPLATE_HEADERS
1164:- 023-esm-module-compliance, research/research.md, shared + mcp_server, scripts CommonJS interop, dual-build fallback-only, validate.sh --strict
1181:- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
1942:- npm ci, npx tsc -b shared/tsconfig.json mcp_server/tsconfig.json, check --workspace=scripts, validate_document.py one file at a time

codex
The external scaffold instructions are template-like rather than project-filled, so I’m weighting the actual TypeScript implementation more heavily than the markdown contract prose. I’m now tracing the Mex README, router flow, CLI, drift engine, and checkers in parallel with semantic lookups of our own memory and graph handlers.
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

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md && printf '\\n---SPLIT---\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---SPLIT---
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 1162ms:

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
I have the validation result and the external contract loaded. The next step is narrowing this to the concrete conflict surfaces: where Mex wants markdown to be the authority, versus where our stack already treats memory DB state, graph indexes, and MCP orchestration as the runtime authority.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '35,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"mcp__cocoindex_code__search|cocoindex|code graph|code_graph\" .opencode/skill/system-spec-kit -g '*.ts' -g '*.js' -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:681:    ? 'loaded code graph status'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:682:    : 'code graph status unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1020:    // F057: Passive context enrichment pipeline — adds code graph symbols
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120:- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:127:- empty or broadly stale graphs still require explicit `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:432:- `code_graph_scan` (structural code indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:433:- `code_graph_query` (structural relationship queries)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:434:- `code_graph_status` (graph health check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:435:- `code_graph_context` (LLM-oriented graph neighborhoods)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:443:Run session bootstrap, then query the code graph for symbols in .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/README.md:533:The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.
.opencode/skill/system-spec-kit/mcp_server/README.md:539:**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:606:| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:779:Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.
.opencode/skill/system-spec-kit/mcp_server/README.md:1060:##### `code_graph_query`
.opencode/skill/system-spec-kit/mcp_server/README.md:1075:##### `code_graph_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:1152:##### `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/README.md:1154:Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash. Use this explicitly when the graph is empty, when a read path reports `full_scan`, or when you want to rebuild more than the bounded inline refresh path will repair.
.opencode/skill/system-spec-kit/mcp_server/README.md:1165:##### `code_graph_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:1167:Report code graph index health: file count, node and edge counts by type, parse health summary, last scan timestamp, DB file size and schema version.
.opencode/skill/system-spec-kit/mcp_server/README.md:1537:| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:5:// readiness, code graph freshness, and priming status.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:44:- `code-graph/scan.ts` - `code_graph_scan`: index workspace files, build structural graph.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:45:- `code-graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:46:- `code-graph/status.ts` - `code_graph_status`: report graph health and statistics.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:47:- `code-graph/context.ts` - `code_graph_context`: LLM-oriented compact graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:12:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:185:    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:248:    summary = 'No structural context available — code graph is empty or unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:5:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:457:    recommendedCalls.push('code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:468:    toolRoutingRules.push('semantic/concept queries → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123:/** Handle code_graph_scan tool call */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:155:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9:/** Handle code_graph_status tool call */
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:44:vi.mock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:52:import * as cocoIndexPath from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:97:    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:114:  it('reports cocoindex as available when the binary exists', () => {
.opencode/skill/system-spec-kit/mcp_server/database/README.md:3:description: "Runtime SQLite storage for memory, structural code graph, vectors, FTS, and coordination files."
.opencode/skill/system-spec-kit/mcp_server/database/README.md:43:- Structural code-graph persistence lives in the separate `code-graph.sqlite` database with `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:74:- Empty or broadly stale structural states still require explicit `code_graph_scan` to rebuild the graph database.
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:4:// Dispatch for code graph MCP tools: scan, query, status, context.
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:19:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:20:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:21:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:22:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:58:    case 'code_graph_scan':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:60:    case 'code_graph_query': {
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:67:    case 'code_graph_status':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:69:    case 'code_graph_context':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:228:  //   graphFreshness (0.20) — A stale code graph means structural queries return
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317:/** Handle code_graph_query tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:433:          }, readiness, `code_graph_query ${operation} payload`),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:559:          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:14:    const indexDir = resolve(projectRoot, '.cocoindex_code');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:39:                : 'CocoIndex is ready. Use mcp__cocoindex_code__search for semantic queries.',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:3:MCP tool handlers for the structural code graph system.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:9:| `scan.ts` | `code_graph_scan` | Index workspace files, build structural graph |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:10:| `query.ts` | `code_graph_query` | Query structural relationships (outline, calls, imports) |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:11:| `status.ts` | `code_graph_status` | Report graph health and statistics |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:12:| `context.ts` | `code_graph_context` | LLM-oriented compact graph neighborhoods |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:4:// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:56:    filePath: seed.provider === 'cocoindex'
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:59:    startLine: seed.provider === 'cocoindex' ? seed.range?.start : seed.startLine,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:60:    endLine: seed.provider === 'cocoindex' ? seed.range?.end : seed.endLine,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:87:/** Handle code_graph_context tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:116:      if (seed.provider === 'cocoindex' && seed.file) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:118:          provider: 'cocoindex' as const,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:204:          error: 'code_graph_context failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:5:// code graph status, and CocoIndex availability into a single call.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:9:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540:      key: 'cocoindex-status',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:566:      { label: 'cocoindex', certainty: cocoIndexCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:575:      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:63:    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
.opencode/skill/system-spec-kit/SKILL.md:767:| `code_graph_scan` | Index workspace files, build structural graph |
.opencode/skill/system-spec-kit/SKILL.md:768:| `code_graph_query` | Query relationships: outline, calls_from/to, imports_from/to |
.opencode/skill/system-spec-kit/SKILL.md:769:| `code_graph_status` | Report graph health and statistics |
.opencode/skill/system-spec-kit/SKILL.md:770:| `code_graph_context` | LLM-oriented compact graph neighborhoods (neighborhood/outline/impact modes) |
.opencode/skill/system-spec-kit/SKILL.md:782:**Read-path freshness:** Startup and bootstrap surfaces report graph freshness without mutating the index. Bounded inline refresh happens on structural read paths when stale sets are small; otherwise callers receive `readiness` guidance to run `code_graph_scan`.
.opencode/skill/system-spec-kit/SKILL.md:784:**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.
.opencode/skill/system-spec-kit/SKILL.md:786:**CocoIndex seed bridge:** CocoIndex search results (file + line range) are accepted as seeds by `code_graph_context`, which resolves them to graph nodes and expands structurally. This combines "what resembles what" (CocoIndex) with "what connects to what" (Code Graph).
.opencode/skill/system-spec-kit/SKILL.md:801:| `session_resume` | Combined memory + code graph + CocoIndex resume in one call |
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:121:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/README.md:62:| **MCP Tools**               | 43                   | Across 7 layers (L1-L7), including code graph, CocoIndex lifecycle, and session bootstrap tools |
.opencode/skill/system-spec-kit/README.md:107:| **Graph Query**     | code_graph_scan, code_graph_query, code_graph_status, code_graph_context | Index, query, and explore structural relationships                 |
.opencode/skill/system-spec-kit/README.md:111:CocoIndex (semantic search) finds code by concept. Code Graph (structural) maps what connects to what. Startup and recovery surfaces now report freshness-aware graph state, structural read paths return a `readiness` block, and lightly stale graphs may repair inline with bounded `selective_reindex` while empty or broadly stale graphs stay on the explicit `code_graph_scan` path.
.opencode/skill/system-spec-kit/README.md:1017:A: This README covers the whole skill: spec folders, documentation levels, commands, templates, scripts and a high-level summary of the memory system. The MCP server README (`mcp_server/README.md`) goes deep on the memory system: the 43-tool API reference, 5-channel hybrid retrieval, code graph and session lifecycle tooling, runtime-resolved rollout behavior, save pipeline, causal graph, query intelligence and evaluation infrastructure. When you need to understand how a specific MCP tool works or how the search pipeline makes decisions, go to the MCP server README.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:624:  name: 'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625:  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:657:  name: 'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:658:  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:663:  name: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:680:            provider: { type: 'string', enum: ['cocoindex', 'manual', 'graph'], description: 'Seed provider type' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:681:            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:734:  description: '[L3:Discovery] Check session readiness: priming status, code graph freshness, time since last tool call. Call periodically during long sessions to check for context drift. Returns ok/warning/stale with actionable hints. No arguments required.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:64:    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:148:    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:224:    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:360:      ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:60:    it('increments codeGraphQueries on code_graph_query event', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:62:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/ARCHITECTURE.md:29:- [10. HOOK + CODE GRAPH + COCOINDEX ARCHITECTURE](#10--hook--code-graph--cocoindex-architecture)
.opencode/skill/system-spec-kit/ARCHITECTURE.md:437:<!-- ANCHOR:hook-code-graph-cocoindex -->
.opencode/skill/system-spec-kit/ARCHITECTURE.md:483:        semantic["Semantic Search<br/>mcp__cocoindex_code__search"]
.opencode/skill/system-spec-kit/ARCHITECTURE.md:559:| Semantic discovery (find by meaning/concept) | CocoIndex | `mcp__cocoindex_code__search` |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:560:| Structural navigation (call graph, dependencies) | Code Graph | `code_graph_query` / `code_graph_context` |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:564:<!-- /ANCHOR:hook-code-graph-cocoindex -->
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:39:| **Semantic/concept** (meaning-based) | `mcp__cocoindex_code__search` (CocoIndex) | `memory_search` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:40:| **Structural** (callers, imports, deps) | `code_graph_query` (Code Graph) | `Grep` / `Glob` |
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:105:      'code_graph_context'
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:115:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:5:// retrieval backend: structural (code graph) vs semantic
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:9:// routing between structural (code graph) and semantic backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:113: * (code graph) and semantic (CocoIndex) retrieval backends.
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:61:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:97:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:120:    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:5:// Provides the code_graph_context MCP tool implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:127:    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:153:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:158:  actions.push('Use `mcp__cocoindex_code__search` for semantic discovery of related code');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:5:// from local code graph + hook state (no MCP round-trip).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:10:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:18:/** Compact startup summary for the locally indexed code graph. */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:116:    codeGraphLine = 'empty -- run `code_graph_scan`';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:172:  pushSection(input.cocoIndex, 'cocoIndex', 'Semantic Neighbors', 'cocoindex');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:199:          : section.source === 'cocoindex'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:26:        'R4 nudges structural follow-up toward code_graph_query when graph readiness is high.',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:45:      liveBaselineResolution: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:4:// SQLite storage for structural code graph (nodes + edges).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:53:/** SQL schema for code graph tables */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:99:  CREATE TABLE IF NOT EXISTS code_graph_metadata (
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:136:    CREATE TABLE IF NOT EXISTS code_graph_metadata (
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:145:/** Initialize (or get) the code graph database */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:191:  const row = d.prepare('SELECT value FROM code_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:199:    INSERT INTO code_graph_metadata (key, value, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:4:// Resolves CocoIndex search results (file:line) to code graph nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:20:  provider: 'cocoindex';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:45:/** A resolved reference into the code graph */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:67:  return hasProvider(seed, 'cocoindex');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:8:describe('code graph ops hardening', () => {
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:81:          triggerPhrases: ['014 code graph upgrades runtime', 'render quality', 'canonical sources', 'memory save'],
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:92:      expect(triggerPhrases).toEqual(['014 code graph upgrades runtime', 'render quality', 'canonical sources', 'memory save']);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:4:// Checks if the code graph needs reindexing before a query and
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:228: * Check whether the code graph is ready and, if not, perform
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:73: * Enrich with code graph symbols near mentioned files.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer.vitest.ts:24:    expect(sanitizeTriggerPhrase('phase 7 cocoindex')).toEqual({ keep: false, reason: 'suspicious_prefix' });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:35:describe('code graph query trust emission', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:116:            'code_graph_query outline payload rejects collapsed scalar fields: trust.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:166:    vi.doMock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:15:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:51:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:784:    // cocoIndex and triggered were empty — their section sources ('cocoindex', 'memory') should not
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:942:  it('stores code graph metadata for git HEAD tracking and creates the file-line index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:68:describe('Spec Kit compact code graph plugin', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:199:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:227:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:15:describe('code graph seed resolver', () => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:300:    vi.doMock('../../mcp_server/lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:314:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:79:  it('adds hint when code graph has zero nodes (empty)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:111:  it('handles code graph error gracefully', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:27:  vi.doMock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:62:    expect(contract.recommendedAction).toContain('code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:99:    vi.doMock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:117:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:139:    expect(parsed.data.payloadContract.summary).toContain('cocoindex=exact');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:144:      'cocoindex-status': 'exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:218:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:25:        preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:140:        nextActions: ['Use code_graph_query'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:151:      preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:154:    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:295:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3738:| 255 | Context Preservation | CocoIndex code graph routing | [255](22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md) | [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md) |
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:192:      'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:193:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:194:      'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:195:      'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:16:- **Objective**: Verify that the memory-surface hook delivers a PrimePackage on the first MCP tool call of a session. The package must contain constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. Subsequent tool calls must NOT re-deliver the prime package (one-shot behavior). The priming status must be reflected in session_health as 'primed' after the first call.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:21:- **Prompt**: `Validate 261 MCP auto-priming. Make a tool call (e.g., memory_stats) to the MCP server on a fresh session. Confirm: (1) response hints include a PrimePackage with constitutional memories, (2) code graph status is included in the package, (3) make a second tool call and confirm NO prime package in hints (one-shot), (4) call session_health and confirm primingStatus === 'primed'.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:16:- **Objective**: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`), CocoIndex Code availability status, Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`), and resume instructions. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:26:  - Body mentions `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:40:| 250a | SessionStart priming (startup) | Fresh startup outputs Spec Kit Memory tool overview | `Validate 250a startup tool listing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout "Session Priming" section lists `memory_context`, `memory_match_triggers`, `memory_search`, code graph tools | Test output showing tool names in stdout | PASS if all 7+ tools listed in session priming output | Check `session-prime.ts` handleStartup() for expected tool names |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:16:- **Objective**: Verify that the code graph SQLite storage (code-graph.sqlite) correctly indexes source files into `code_files`, `code_nodes`, and `code_edges` tables. The structural indexer must extract function declarations, class definitions, and import statements as nodes, and build call/import relationship edges. The 4 MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`) must return correct results. WAL mode and foreign keys must be enabled.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:22:- **Prompt**: `Validate 254 Code graph storage and query behavior. Run the vitest suite for code-graph-indexer and confirm: (1) code_graph_scan indexes files and produces code_files, code_nodes, code_edges rows, (2) function/class/import nodes extracted with correct types, (3) call and import edges built between nodes, (4) code_graph_query returns outline/calls/imports results, (5) code_graph_status returns health metrics (file count, node count, edge count), (6) SQLite WAL mode and foreign keys enabled.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:25:  - `code_graph_scan` populates `code_files` table with indexed file paths and hashes
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:28:  - `code_graph_query` for outline mode returns symbol list for a given file
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:29:  - `code_graph_query` for calls mode returns callers/callees of a symbol
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:30:  - `code_graph_query` for imports mode returns import relationships
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:31:  - `code_graph_status` returns counts (files indexed, nodes, edges)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:45:| 254c | Code graph storage and query | Query tools (outline, calls, imports, status) return correct results | `Validate 254c query tools` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | `code_graph_query` returns results for outline/calls/imports modes, `code_graph_status` returns file/node/edge counts | Test output showing query results | PASS if all 4 MCP tool operations return non-empty valid results | Check handler implementations in `handlers/code-graph/` |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:47:| 254e | Code graph storage and query | Symlink boundary validation | `Validate 254e symlink boundary enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/unit-path-security.vitest.ts tests/code-graph-scan.vitest.ts` | `code_graph_scan` canonicalizes `rootDir`, rejects broken or escaping symlinks, and does not index files outside the project root | Vitest output showing symlink escape rejection and scan boundary enforcement | PASS if symlinked external files are NOT indexed and escaping paths are rejected | Check `handlers/code-graph/scan.ts` realpath-based boundary check and `tests/unit-path-security.vitest.ts` for escape scenarios |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:16:- **Objective**: Verify that session_resume performs its recovery sub-calls (memory_context resume, code graph status, CocoIndex availability), appends the shared structural ready/stale/missing contract, and merges everything into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), structuralContext (`status`, `summary`, `recommendedAction`, `sourceSurface`, plus freshness guidance), and hints array.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:40:| 263b | Session resume tool | Code graph status sub-call returns counts | `Validate 263b code graph status` | Call `session_resume({})` via MCP | codeGraph.status in [ok, empty, error], nodeCount/edgeCount/fileCount are integers >= 0 | session_resume response JSON codeGraph field | PASS if codeGraph field has all required fields with valid types | Check graphDb.getStats() and code-graph-db.ts query |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:41:| 263c | Session resume tool | CocoIndex availability check | `Validate 263c cocoindex status` | Call `session_resume({})` via MCP | cocoIndex.available is boolean, binaryPath is string | session_resume response JSON cocoIndex field | PASS if cocoIndex fields present with correct types | Check `cocoindex-path.ts` plus the availability probe used by session-resume.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:16:- **Objective**: Verify that the context-metrics module correctly tracks session events (tool_call, memory_recovery, code_graph_query, spec_folder_change) and computes QualityScore with 4 weighted factors. The recency factor must decay over time (1.0 for recent, lower as time passes). The recovery factor must be 1.0 after a memory_recovery event. The graphFreshness factor must reflect actual code graph state (1.0 fresh, 0.5 stale, 0.0 empty). The continuity factor must decrease on spec folder transitions. The composite score must map to quality levels: healthy (>= 0.7), degraded (>= 0.4), critical (< 0.4).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:24:  - graphFreshness factor matches code graph state
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md:21:- **Prompt**: `Validate 260 Code graph auto-trigger. Query code_graph_status on a fresh install with empty database. Confirm: (1) ensureCodeGraphReady() detects empty graph and returns action=full_scan, (2) after full scan, graph has nodes and edges, (3) modify a source file and query again — verify action=selective_reindex, (4) verify 10-second timeout aborts gracefully on very large codebases.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:3:description: "This scenario validates Query-intent routing for 264. It focuses on verifying structural queries route to code graph and semantic queries route to CocoIndex."
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:16:- **Objective**: Verify that memory_context auto-routes queries based on the query-intent classifier. Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend. Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline. Hybrid queries must trigger both backends and merge results. The classifier confidence score and matched keywords must be available in the response metadata.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:18:  - MCP server running with code graph populated (at least one scan)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:20:- **Prompt**: `Validate 264 Query-intent routing. Send three queries to memory_context: (1) a structural query like "what functions call handleMemoryContext", (2) a semantic query like "find examples of error handling patterns", (3) a hybrid query like "find all validation functions and explain their approach". Confirm: (1) structural query returns code graph results, (2) semantic query returns memory/CocoIndex results, (3) hybrid query returns merged results from both backends.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:22:  - Structural query: response includes code graph symbols/edges, classifier intent === 'structural'
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:24:  - Hybrid query: response includes both code graph and memory results, classifier intent === 'hybrid'
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:27:  - FAIL: Structural query returns only memory results, semantic query hits code graph, or hybrid missing one backend
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:35:| 264a | Query-intent routing | Structural query routes to code graph | `Validate 264a structural routing` | Call `memory_context({ input: "what functions call handleMemoryContext" })` | Response includes code graph data (symbols, edges), intent classified as 'structural' | memory_context response with code graph results | PASS if code graph results present and classifier shows structural intent | Check STRUCTURAL_KEYWORDS in query-intent-classifier.ts and memory_context integration |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:37:| 264c | Query-intent routing | Hybrid query merges both backends | `Validate 264c hybrid routing` | Call `memory_context({ input: "find all validation functions and explain their approach" })` | Response includes both code graph and memory results, intent classified as 'hybrid' | memory_context response with merged results | PASS if both backends contribute results | Check hybrid scoring threshold and merge logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:22:- **Prompt**: `Validate 267 tool routing enforcement. Confirm: (1) buildServerInstructions() injects a Tool Routing section with CocoIndex and Code Graph rules, (2) first-call PrimePackage includes routingRules.toolRouting with SEARCH ROUTING directive, (3) response hints on code-search style memory queries recommend cocoindex_code__search, (4) all runtime instruction files contain active routing enforcement, and (5) all context-prime agent definitions include the routing decision table in their prime output format.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:26:  - Code-search-oriented tool responses include hints pointing to `mcp__cocoindex_code__search`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:41:| 267c | Tool routing enforcement | Tool response hints fire on code-search queries | `find function implementations` | `Manual: call memory_search({ query: "find function implementations" })` | Response hints suggest semantic code search via `mcp__cocoindex_code__search` | MCP response hints showing routing recommendation | PASS if a hint explicitly mentions `cocoindex_code__search` | Check `mcp_server/hooks/response-hints.ts` code-search detection patterns and confirm the query is classified as code-search intent |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:43:| 267e | Tool routing enforcement | Context-prime agents include routing table in output | `Validate 267e context-prime routing table` | `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "## Tool Routing|Semantic/concept|code_graph_query|mcp__cocoindex_code__search" .opencode/agent/context-prime.md .claude/agents/context-prime.md .codex/agents/context-prime.md .gemini/agents/context-prime.md` | Context-prime agent files across runtimes include the routing decision table in the Prime Package output format | Grep output showing routing-table lines in all 4 agent files | PASS if routing directives are present in all context-prime agent files | Check for runtime drift between agent copies and restore the shared routing table if one copy fell behind |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:3:description: "This scenario validates CocoIndex bridge for 255. It focuses on CocoIndex used for semantic, code_graph for structural."
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16:- **Objective**: Verify that the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (`seed-resolver.ts`) normalizes CocoIndex file:line results to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop graph neighbors), outline (file symbol listing), and impact (reverse callers). Budget-aware truncation must apply to context output.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:18:  - Semantic: `mcp__cocoindex_code__search({ query: "memory search pipeline" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:19:  - Structural: `code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` (`operation` + `subject` are required)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:25:- **Prompt**: `Validate 255 CocoIndex bridge behavior. Confirm: (1) semantic queries route to mcp__cocoindex_code__search and return meaning-based results, (2) structural queries route to code_graph_query and return symbol/edge-based results, (3) seed resolver normalizes CocoIndex file:line to ArtifactRef (exact > enclosing > file anchor), (4) code_graph_context expands in neighborhood/outline/impact modes, (5) results from each system are qualitatively different and appropriate to the query type.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:28:  - Structural query ("what calls allocateBudget") returns exact callers/callees from code graph edges
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:30:  - `code_graph_context` neighborhood mode returns 1-hop connected symbols
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:31:  - `code_graph_context` outline mode returns all symbols in a file
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:32:  - `code_graph_context` impact mode returns reverse callers (who depends on this)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:44:| 255a | CocoIndex bridge | Semantic query routes to CocoIndex and returns meaning-based results | `How does the memory search pipeline work?` | `Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" })` | Results are semantically related files (e.g., search handler, query router) rather than exact string matches | CocoIndex search output listing relevant file paths with similarity scores | PASS if results are conceptually relevant to the query meaning | Verify CocoIndex MCP server is running and index is built |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:45:| 255b | CocoIndex bridge | Structural query routes to code_graph and returns edge-based results | `What functions call allocateBudget?` | `Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` | Returns exact caller functions with file paths and line numbers from code_edges table | Code graph query output showing caller/callee relationships | PASS if callers are exact function references from the graph database | Verify code graph is indexed and contains allocateBudget node |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:46:| 255c | CocoIndex bridge | code_graph_context expands in neighborhood, outline, and impact modes | `Validate 255c context expansion modes` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers | Test output showing each mode's distinct results | PASS if all 3 modes return non-empty, mode-appropriate results | Check `code-graph-context.ts` for mode handling logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:53:- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:62:- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:2:title: "CocoIndex bridge and code_graph_context"
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:3:description: "CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:6:# CocoIndex bridge and code_graph_context
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:10:CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:12:Seed resolver normalizes CocoIndex file:line results to ArtifactRef via resolution chain: exact symbol, near-exact symbol, enclosing symbol, file anchor. `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop), outline (file symbols), and impact (reverse callers plus reverse imports). Budget-aware truncation.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:30:| `mcp_server/handlers/code-graph/context.ts` | Handler | Exposes `code_graph_context` over MCP |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:43:- Source feature title: CocoIndex bridge and code_graph_context
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:3:description: "First-call session context injection that delivers a Prime Package containing constitutional memories, code graph status, and triggered context on the first MCP tool call."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:10:First-call session context injection that delivers a Prime Package containing constitutional memories, code graph status, and triggered context on the first MCP tool call.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:12:The memory-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:3:description: "Server-side auto-enrichment pipeline that injects constitutional memories, triggered memories, and code graph status into every MCP response without explicit user action."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:10:Server-side auto-enrichment pipeline that injects constitutional memories, triggered memories, and code graph status into every MCP response without explicit user action.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:28:| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface constitutional + triggered memories + code graph status |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/17-session-health-tool.md:3:description: "MCP tool (session_health) that reports session readiness with ok/warning/stale status, code graph freshness, priming status, and quality score."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/17-session-health-tool.md:10:MCP tool (session_health) that reports session readiness with ok/warning/stale status, code graph freshness, priming status, and quality score.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/22-context-preservation-metrics.md:12:The context-metrics module maintains lightweight in-memory state for the current session: tool call count, memory recovery calls, code graph queries, spec folder transitions, and priming status. It computes a QualityScore (0.0-1.0) with 4 weighted factors: recency (time since last tool call, decays over time), recovery (1.0 if memory recovered this session), graphFreshness (1.0 fresh, 0.5 stale, 0.0 empty), and continuity (1.0 if spec folder stable, lower on transitions). Quality levels map to healthy (score >= 0.7), degraded (>= 0.4), or critical (< 0.4). No database persistence; state resets on server restart.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:3:description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:10:Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:12:The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md:12:Floors: constitutional 700, code graph 1200, CocoIndex 900, triggered 400, overflow pool 800. Empty sources release their floor to the overflow pool. Redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered. Total cap enforced with deterministic trim in reverse priority.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:3:description: "Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both)."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:10:Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both).
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:12:Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:3:description: "Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:10:Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:12:When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to CocoIndex for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:30:| `mcp_server/handlers/code-graph/` | Handler | Structural backend (code graph query) |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:2:title: "Context preservation and code graph"
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:3:description: "Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:6:# Context preservation and code graph
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:10:Category covering runtime hook automation, structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:12:This category documents the hybrid context injection system that preserves critical knowledge across context compaction events. It combines three complementary systems: hook-based lifecycle automation, structural code analysis (code graph), and semantic search (CocoIndex) — all merging under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:18:Implemented across spec 024-compact-code-graph phases 001-028. The shipped surface now includes hook scripts, code graph modules, MCP tools, budget allocator, tree-sitter parser with regex fallback, query-intent routing, auto-trigger, session health/resume/bootstrap tools, the structural ready/stale/missing contract, Gemini hooks, and startup-brief follow-ons.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:29:| `mcp_server/lib/code-graph/` | Lib | 12 code graph library modules |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:31:| `mcp_server/tools/code-graph-tools.ts` | Dispatch | Tool dispatch for code graph tools |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:47:- Source feature title: Context preservation and code graph
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:12:The ensure-ready module checks graph state (fresh/stale/empty) by comparing the current git HEAD against the last indexed HEAD and scanning for stale files. When the graph is empty, a full scan is triggered. When files are stale but below the selective reindex threshold (50 files), only changed files are reindexed. Above the threshold, a full rescan is performed. A 10-second timeout prevents blocking on large codebases. Shared by code_graph_context, code_graph_query, and code_graph_status handlers.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:12:SQLite database (code-graph.sqlite) stores indexed files, symbol nodes, and relationship edges. 4 MCP tools: code_graph_scan (workspace indexing), code_graph_query (outline/calls/imports), code_graph_status (health), code_graph_context (LLM neighborhoods). WAL mode, foreign keys, directional indexes.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:29:| `mcp_server/handlers/code-graph/scan.ts` | Handler | Implements `code_graph_scan` for structural indexing |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:30:| `mcp_server/handlers/code-graph/query.ts` | Handler | Implements `code_graph_query` for callers, imports, and outlines |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:31:| `mcp_server/handlers/code-graph/status.ts` | Handler | Implements `code_graph_status` for readiness and health checks |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:32:| `mcp_server/handlers/code-graph/context.ts` | Handler | Implements `code_graph_context` for compact structural neighborhoods |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:104:| L1: Orchestration | `session_resume()` | Resume memory, code graph, and CocoIndex state in one call | Detailed recovery payload after reconnect, or when you want direct merged resume state |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:134:| L6: Analysis | `code_graph_query()` | Query structural relationships such as callers, imports, and outlines | Find what calls a symbol or which files import a module |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:135:| L6: Analysis | `code_graph_context()` | Expand CocoIndex or symbol seeds into compact graph neighborhoods | Pull structural context for an LLM prompt |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:141:| L7: Maintenance | `code_graph_scan()` | Build or refresh the structural code graph index | Re-index after branch switches or large code changes |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:142:| L7: Maintenance | `code_graph_status()` | Report code graph freshness and node/edge counts | Check whether the structural index is usable |
.opencode/skill/system-spec-kit/references/config/environment_variables.md:209:| `SPECKIT_PARSER` | `treesitter` | R-024 | Structural parser backend for code graph indexing: `treesitter` (default WASM AST parser) or `regex` (lightweight fallback) |

exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|memory_context|memory_search|memory_match_triggers|code_graph_scan|code_graph_query|memory_health|memory_save|generate-context\" .opencode/skill/system-spec-kit -g '*.ts' -g '*.js' -g '*.mjs' -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120:- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:127:- empty or broadly stale graphs still require explicit `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:429:- `memory_save` (index new memories)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:432:- `code_graph_scan` (structural code indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:433:- `code_graph_query` (structural relationship queries)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:563:### memory_save: Index a Memory File
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/templates/handover.md:116:- Create new memory file via `generate-context.js` before handover
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/assets/template_mapping.md:179:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:201:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:223:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:245:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:322:**Generation:** Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/` to auto-generate properly formatted memory files.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:1060:##### `code_graph_query`
.opencode/skill/system-spec-kit/mcp_server/README.md:1152:##### `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1537:| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317:/** Handle code_graph_query tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:433:          }, readiness, `code_graph_query ${operation} payload`),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:559:          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:74:- Empty or broadly stale structural states still require explicit `code_graph_scan` to rebuild the graph database.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
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
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:401:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:9:| `scan.ts` | `code_graph_scan` | Index workspace files, build structural graph |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:10:| `query.ts` | `code_graph_query` | Query structural relationships (outline, calls, imports) |
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:19:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:20:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:58:    case 'code_graph_scan':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:60:    case 'code_graph_query': {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:307:      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:314:      expect(entry!.actor).toBe('mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:353:      'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123:/** Handle code_graph_scan tool call */
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:47:description: "Durable regression fixture for memory_save UX contract coverage."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:248:  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:624:  name: 'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1151:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1310:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1345:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1441:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1462:        action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490:            actor: provenanceActor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:240:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:243:describe('memory_search limit contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:246:      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:252:      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:258:      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:264:      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:270:      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:276:      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:282:      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:288:      validateToolArgs('memory_search', { concepts: ['solo'] });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:292:  it('public schema rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:294:      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:300:      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:304:  it('runtime rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:306:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:312:      validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:457:    recommendedCalls.push('code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:155:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:97:    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/shared/embeddings/README.md:368:# Check active provider (via MCP tool memory_health)
.opencode/skill/system-spec-kit/shared/embeddings/README.md:398:| [generate-context.js](../../scripts/dist/memory/generate-context.js) | Main script using embeddings |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:9:  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:35:  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:88:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:103:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:143:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:152:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:170:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:176:    expect(review.summary.byAction).toEqual({ memory_save: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:181:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:189:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:207:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:44:- `code-graph/scan.ts` - `code_graph_scan`: index workspace files, build structural graph.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:45:- `code-graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:61:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:97:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:120:    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/shared/algorithms/README.md:124:- **Consumers**: MCP server retrieval pipeline, `memory_search` and `memory_match_triggers` endpoints
.opencode/skill/system-spec-kit/shared/README.md:38:- **CLI scripts** (`scripts/`) - `generate-context.ts` and other utilities
.opencode/skill/system-spec-kit/shared/README.md:300:| Technical Terms | 2.5x  | "generateContext", "memory_search"    |
.opencode/skill/system-spec-kit/shared/README.md:369:// In scripts/memory/generate-context.ts or similar
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:121:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:3:description: "Documents the confirmed repair path behind `memory_health`, including FTS rebuilds, trigger-cache refreshes, and orphan cleanup for causal edges, vectors, and chunks."
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:17:Documents the confirmed repair path behind `memory_health`, including FTS rebuilds, trigger-cache refreshes, and orphan cleanup for causal edges, vectors, and chunks.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:19:This remediation flow turns `memory_health` from a read-only diagnostic into a guarded repair entry point. It does not silently mutate the database: callers must opt in with `autoRepair: true` and explicitly confirm the action before any repair step runs.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:25:`memory_health` exposes auto-repair only in full-report mode. If a caller sets `autoRepair: true` without `confirmed: true`, the handler returns a confirmation-required success envelope with the planned actions (`fts_rebuild`, `trigger_cache_refresh`, `orphan_edges_cleanup`, `orphan_vector_cleanup`) and performs no mutation.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:41:| `mcp_server/handlers/memory-crud-health.ts` | Handler | Implements `memory_health`, confirmation gating, FTS rebuild, trigger-cache refresh, repair bookkeeping, and health response metadata |
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:51:| `mcp_server/tests/tool-input-schema.vitest.ts` | Schema | Confirms `memory_health` accepts the `autoRepair` plus `confirmed` payload shape |
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:96:      const key2 = generateCacheKey('memory_save', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:354:      const key3 = generateCacheKey('memory_save', { query: 'test3' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:357:      set(key3, 'value3', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:367:      const key2 = generateCacheKey('memory_save', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:370:      set(key2, 'value2', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:381:      const key2 = generateCacheKey('memory_save', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:384:      set(key2, 'value2', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:394:      const searchKey = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:17:This category captures the runtime remediation surface that now exists across the MCP server rather than inside one isolated "repair" module. In practice, remediation happens in several layers: `memory_save` can preview failures in `dryRun`, reject hard validation problems before mutation, auto-fix some recoverable formatting issues, and stop or downgrade later indexing when stronger validation says the memory is unsafe. Save-time revalidation is split across `preflight.ts`, the V-rule bridge, the quality loop, and the pre-storage quality gate.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:19:Operator remediation lives in `memory_health`, which can diagnose inconsistencies and, with explicit confirmation, perform bounded repair actions. Human-in-the-loop revalidation lives in `memory_validate`, which feeds confidence, promotion, negative feedback, and learned-feedback pipelines after results are used, while checkpoints provide the rollback safety net around destructive or high-risk remediation work. This means audit phase `021-remediation-revalidation` is now a real runtime category: the system both blocks bad writes and exposes targeted repair and revalidation paths after data has already been indexed.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:25:- `memory_save` is the orchestration layer. It parses the file, optionally runs `runPreflight()`, exposes dry-run summaries, executes V-rule disposition checks, runs the quality-loop auto-fix pass, evaluates semantic sufficiency and template-contract gates, applies the pre-storage quality gate, and then either persists, skips indexing, or rejects the save.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:29:- The quality loop can return improved content even on rejection. `memory_save` uses that to surface diagnostics and, on successful downstream clearance, persist rewritten content safely. If the loop rejects, the handler returns `status: 'rejected'`, and the atomic save path treats that as a rollback and cleanup case rather than retrying through persistence.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:32:- `memory_health` is the operator-facing remediation tool. In `reportMode: "full"` it inspects database connectivity, vector search readiness, FTS consistency, alias divergence, and general integrity. With `autoRepair:true`, it never executes immediately; the caller must repeat the request with `confirmed:true`.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:33:- Confirmed `memory_health` auto-repair is intentionally bounded. It can rebuild `memory_fts`, refresh the trigger cache, clean orphaned causal edges, and auto-clean orphaned vectors and chunks. The response tracks `repair.requested`, `attempted`, `repaired`, `partialSuccess`, `actions`, `warnings`, and `errors`, so mixed outcomes stay visible instead of being collapsed into a single success flag.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md:34:- `memory_health` also keeps a diagnostics-only lane. `reportMode: "divergent_aliases"` surfaces conflicting `.opencode/specs` versus `specs/` alias groups, but auto-repair is disabled there and the handler returns guidance instead of mutation.
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:26:Checkpoint restore now acquires a module-level maintenance barrier before restore mutations begin and keeps it active through the post-restore rebuild sequence. While that barrier is active, concurrent `checkpoint_restore` calls and mutation traffic from `memory_save`, `memory_index_scan` and `memory_bulk_delete` fail fast with `E_RESTORE_IN_PROGRESS` instead of racing the restore lifecycle.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:40:| `mcp_server/handlers/memory-save.ts` | Mutation handler: fail-fast barrier check blocks `memory_save` during active checkpoint restore maintenance |
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/templates/memory/README.md:7:  - "generate-context"
.opencode/skill/system-spec-kit/templates/memory/README.md:40:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder-or-json-input>
.opencode/skill/system-spec-kit/templates/memory/README.md:50:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/system-spec-kit
.opencode/skill/system-spec-kit/templates/memory/README.md:53:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 003-parent/001-child
.opencode/skill/system-spec-kit/templates/memory/README.md:56:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 001-child-name
.opencode/skill/system-spec-kit/templates/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json
.opencode/skill/system-spec-kit/templates/memory/README.md:63:- run MCP `memory_save()` or `memory_index_scan()` after generation.
.opencode/skill/system-spec-kit/templates/memory/README.md:80:- `../../scripts/dist/memory/generate-context.js`
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:18:**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:135:    expect(matchRule('memory_save', 'git commit -m "x"')).not.toBeNull();
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:18:On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path and increments `totalRecoveries` in the transaction metrics.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:25:- **Creation path.** `/memory:learn` is the operator control plane for constitutional memory lifecycle management. Its create flow writes a markdown rule into `.opencode/skill/system-spec-kit/constitutional/`, then immediately calls `memory_save({ filePath, force: true })`, and finally verifies the rule by running `memory_search()` against one of the trigger phrases. The same command family also exposes `list`, `edit`, `remove`, and `budget` actions, and documents the constitutional tier as the always-surface, no-decay, 3.0x-boost tier.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:27:- **Parser tier inference.** `memory_save` explicitly accepts constitutional markdown files under `.opencode/skill/*/constitutional/`. Once accepted, `memory-parser.ts` classifies those files as `documentType = constitutional`, extracts title, trigger phrases, context type, importance tier, content hash, quality score, quality flags, and causal links, then runs `inferMemoryType()` to populate `memoryType`, `memoryTypeSource`, and confidence. Tier resolution prefers explicit frontmatter, then inline markers, then falls back to the document-type default tier. That means a constitutional file can still land in the constitutional tier even when the tier is being inferred rather than restated manually in every downstream step.
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:62:    expect(contract.recommendedAction).toContain('code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:191:  it('T024: memory_save has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:192:    expect(TOOL_SPECIFIC_HINTS.memory_save).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:193:    expect(typeof TOOL_SPECIFIC_HINTS.memory_save).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:229:  it('T030: memory_save FILE_NOT_FOUND has contextual guidance', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:231:      TOOL_SPECIFIC_HINTS.memory_save?.[ERROR_CODES.FILE_NOT_FOUND];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:292:    const fullHint = getRecoveryHint('memory_save', ERROR_CODES.VALIDATION_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:299:    const saveEmbedHint = getRecoveryHint('memory_save', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:39:        'handle_memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:680:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:687:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:25:        preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:140:        nextActions: ['Use code_graph_query'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:151:      preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:154:    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:295:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/templates/README.md:84:- Memory context is saved via `../scripts/dist/memory/generate-context.js`, never manual file creation.
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/templates/context_template.md:108:     - "Memory files MUST use generate-context.js script"
.opencode/skill/system-spec-kit/templates/context_template.md:307:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "{{SPEC_FOLDER}}" })` |
.opencode/skill/system-spec-kit/templates/context_template.md:319:memory_search({ specFolder: "{{SPEC_FOLDER}}", limit: 10 })
.opencode/skill/system-spec-kit/templates/context_template.md:325:memory_search({ query: "orphaned", anchors: ["state"] })
.opencode/skill/system-spec-kit/templates/context_template.md:328:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {{SPEC_FOLDER}} --force
.opencode/skill/system-spec-kit/templates/context_template.md:338:2. **Load memory context** - Use memory_search to surface prior work
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:163:      'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:192:      'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:193:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:927:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:944:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1054:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1103:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1113:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1131:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1164:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1177:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1563:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1581:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1614:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1619:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1622:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1627:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2087:      'memory_save': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2343:      expect(result).toContain('memory_save')
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:60:    it('increments codeGraphQueries on code_graph_query event', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:62:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
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
.opencode/skill/system-spec-kit/SKILL.md:576:| `memory_save()`                 | L2    | Index a memory file with pre-flight validation    |
.opencode/skill/system-spec-kit/SKILL.md:582:| `memory_health()`              | L3    | Diagnostics: orphan detection, index consistency   |
.opencode/skill/system-spec-kit/SKILL.md:593:**memory_context() — Mode Routing:**
.opencode/skill/system-spec-kit/SKILL.md:602:**memory_search() — Key Rules:**
.opencode/skill/system-spec-kit/SKILL.md:608:**memory_save() — Save-Time Processing:**
.opencode/skill/system-spec-kit/SKILL.md:626:- **Metadata preservation** — `memory_save` update/reinforce paths preserve `document_type` and `spec_level` with synchronized vector-index metadata
.opencode/skill/system-spec-kit/SKILL.md:629:- **Real-time sync** — Use `memory_save` or `memory_index_scan` after creating files
.opencode/skill/system-spec-kit/SKILL.md:631:- **Indexing persistence** — After `generate-context.js`, call `memory_index_scan()` or `memory_save()` for immediate MCP visibility
.opencode/skill/system-spec-kit/SKILL.md:656:| `SPECKIT_ADAPTIVE_FUSION`     | on      | Enables intent-aware weighted RRF with 7 task-type profiles in `memory_search()` (set `false` to disable) |
.opencode/skill/system-spec-kit/SKILL.md:755:**Cross-runtime handling:** Claude and Gemini use SessionStart hook scripts. OpenCode has a transport/plugin implementation, but operationally should still be treated as bootstrap-first when startup surfacing is unavailable. Codex remains bootstrap-based through its session-start agent bootstrap (not a native SessionStart hook). Copilot startup context depends on local hook configuration or wrapper wiring when present. Use `session_bootstrap()` for fresh start or after `/clear`, `session_resume()` for reconnect-style recovery when bootstrap is unnecessary, and `session_health()` only to re-check drift or readiness mid-session.
.opencode/skill/system-spec-kit/SKILL.md:767:| `code_graph_scan` | Index workspace files, build structural graph |
.opencode/skill/system-spec-kit/SKILL.md:768:| `code_graph_query` | Query relationships: outline, calls_from/to, imports_from/to |
.opencode/skill/system-spec-kit/SKILL.md:782:**Read-path freshness:** Startup and bootstrap surfaces report graph freshness without mutating the index. Bounded inline refresh happens on structural read paths when stale sets are small; otherwise callers receive `readiness` guidance to run `code_graph_scan`.
.opencode/skill/system-spec-kit/SKILL.md:784:**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.
.opencode/skill/system-spec-kit/SKILL.md:801:| `session_resume` | Combined memory + code graph + CocoIndex resume in one call |
.opencode/skill/system-spec-kit/SKILL.md:802:| `session_bootstrap` | Complete session bootstrap (resume + health) in one call |
.opencode/skill/system-spec-kit/SKILL.md:884:- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
.opencode/skill/system-spec-kit/SKILL.md:941:| Save context | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/` |
.opencode/skill/system-spec-kit/SKILL.md:969:| Memory gen        | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file creation              |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:208:// After memory_save operation
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:49:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:178:  { tool: 'memory_save', handler: 'handleMemorySave' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:119:        memory_save: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:194:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:195:        { tool: 'memory_search', expected: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:221:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:242:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:253:        { tool: 'memory_search', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:280:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:291:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:292:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:301:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:20:        memory_save: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:117:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:218:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:57:  memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:100:| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | enum (`shadow`, `promoted`) | `mcp_server/lib/cognitive/adaptive-ranking.ts` | Active only when adaptive ranking is enabled. `shadow` is the default observe-only mode that records signals and persists bounded proposal payloads without changing returned search order. `promoted` marks proposals and persisted runs as `promoted` for evaluation and rollout drills, while the current `memory_search` path still attaches proposal metadata instead of reordering live results. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:105:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:107:| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:108:| `SPECKIT_QUALITY_LOOP` | `false` | boolean | `lib/search/search-flags.ts` | **Default OFF.** Enables the verify-fix-verify loop for `memory_save`. When enabled, low-quality saves get an initial evaluation plus up to 2 immediate auto-fix retries by default; rejected saves return `status: 'rejected'`, and atomic save rolls the file back instead of retrying indexing again. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:114:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. The trace surface now also carries `sessionTransition` and bounded graph-walk diagnostics when those signals are active. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:158:  'memory_save'
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:287:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:296:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:302:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:310:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:311:    expect(resp.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:318:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:328:  it('F7: Tool-specific hints included for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:330:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:353:    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:470:    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:472:    expect('memory_save' in TOOL_SPECIFIC_HINTS).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:147:  it('returns null for memory_save', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:148:    const result = await autoSurfaceAtToolDispatch('memory_save', { filePath: '/some/path.md' });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:286:      'Run memory_health() to check database status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:291:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:316:      'Use memory_health() to see current system limits'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:742:  memory_save: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:747:        'Create the memory file before calling memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:91:    expect(getDefaultErrorCodeForTool('memory_save')).toBe('E081');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:46:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:51:      expect(envelope.meta.tool).toBe('memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:176:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:196:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:116:            'code_graph_query outline payload rejects collapsed scalar fields: trust.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:99:    recordHistory(1, 'ADD', null, 'Version 1', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:103:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:113:    recordHistory(2, 'ADD', null, 'Version 2', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:118:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:115:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:127:    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:153:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:116:    codeGraphLine = 'empty -- run `code_graph_scan`';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:29:`constitutional/README.md` defines the behavior of the constitutional tier itself. It documents that constitutional memories always appear at the top of `memory_search()` results, receive a fixed `similarity: 100`, never decay, remain permanently available, and use fast trigger-phrase matching for proactive surfacing. It also documents the operational envelope around this pack, including the shared constitutional token budget, authoring template, and verification flow after adding or updating a constitutional memory.
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:2:title: "Memory indexing (memory_save)"
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:6:# Memory indexing (memory_save)
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:18:`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:33:That means `memory_save` no longer treats a merely parseable file as good enough. It must be both semantically durable and structurally compliant before the pre-storage quality gate runs.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:47:Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:86:- Source feature title: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:30:| `mcp_server/handlers/memory-context.ts` | Handler | Forwards `includeTrace` through internal `memory_search` calls so context responses can include provenance. |
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:32:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Admits `includeTrace` for `memory_search` and `memory_context` input validation. |
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md:22:All weight modifications are logged to the `weight_history` table. The runtime hook is invoked after every successful `memory_save`, but execution is rate-limited to a weekly cadence (`CONSOLIDATION_INTERVAL_DAYS = 7`) when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:7:export const METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM = 'memory_save_overview_length_histogram';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:8:export const METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL = 'memory_save_decision_fallback_used_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:9:export const METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL = 'memory_save_trigger_phrase_rejected_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:10:export const METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL = 'memory_save_frontmatter_tier_drift_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:11:export const METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL = 'memory_save_continuation_signal_hit_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:12:export const METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL = 'memory_save_git_provenance_missing_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:13:export const METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL = 'memory_save_template_anchor_violations_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:14:export const METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL = 'memory_save_review_violation_total';
.opencode/skill/system-spec-kit/scripts/lib/memory-telemetry.ts:15:export const METRIC_M9_MEMORY_SAVE_DURATION_SECONDS = 'memory_save_duration_seconds';
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:39:- **Checkpoint restore maintenance barrier (T300):** `restoreCheckpoint()` now flips a module-level restore-in-progress flag before restore mutations begin and holds it through post-restore rebuilds. Concurrent `checkpoint_restore` calls plus mutation traffic from `memory_save`, `memory_index_scan` and `memory_bulk_delete` fail fast with `E_RESTORE_IN_PROGRESS` instead of racing restore-side rebuilds. The barrier is cleared in a `finally` path, so both successful and failed restores reopen mutation traffic.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:55:| `mcp_server/tool-schemas.ts` | Core | memory_search schema exposes trackAccess/includeArchived/mode |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:82:| `mcp_server/tests/tool-input-schema.vitest.ts` | Public/runtime schema validation for memory_search args |
.opencode/skill/system-spec-kit/constitutional/README.md:42:The `constitutional/` directory contains memory files that are **always surfaced** at the top of every `memory_search()` result. These are operational rules, safety constraints and critical context that AI agents must always have access to, regardless of what they're searching for.
.opencode/skill/system-spec-kit/constitutional/README.md:60:| **Always Surfaces** | Included at top of every `memory_search` result by default |
.opencode/skill/system-spec-kit/constitutional/README.md:133:3. **Verify** with `memory_search({ query: "anything" })`. Check for `isConstitutional: true`
.opencode/skill/system-spec-kit/constitutional/README.md:178:Constitutional memories are **automatically included** at the top of every `memory_search()` result.
.opencode/skill/system-spec-kit/constitutional/README.md:184:memory_search({ query: "authentication flow" })
.opencode/skill/system-spec-kit/constitutional/README.md:196:memory_search({ 
.opencode/skill/system-spec-kit/constitutional/README.md:229:> **Implemented (v1.7.2):** ANCHOR tags are now fully indexed and support section-level retrieval. Use the `anchors` parameter in `memory_search()` to retrieve specific sections with 58-90% token savings.
.opencode/skill/system-spec-kit/constitutional/README.md:391:memory_save({ filePath: ".opencode/skill/system-spec-kit/constitutional/<rule-name>.md" })
.opencode/skill/system-spec-kit/constitutional/README.md:398:memory_search({ query: "test" })
.opencode/skill/system-spec-kit/constitutional/README.md:501:memory_save({ 
.opencode/skill/system-spec-kit/constitutional/README.md:559:memory_search({ 
.opencode/skill/system-spec-kit/constitutional/README.md:672:**Symptom:** `memory_match_triggers()` doesn't return your memory
.opencode/skill/system-spec-kit/constitutional/README.md:705:memory_match_triggers({ prompt: "fix the bug" })
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:3:description: "Adds a retrievalLevel parameter (local|global|auto) to memory_search, where auto mode falls back to community search on weak results, enabling both fine-grained and topic-level retrieval in a single query, gated by the SPECKIT_DUAL_RETRIEVAL flag."
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:10:Adds a `retrievalLevel` parameter (`local`|`global`|`auto`) to `memory_search`, where auto mode falls back to community search on weak results. This enables callers to explicitly request fine-grained local retrieval, broad community-level global retrieval, or let the system decide based on result quality.
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:18:The `memory_search` handler accepts a `retrievalLevel` parameter with three modes: `local` runs standard retrieval channels only, `global` runs community-level search only, and `auto` (default) runs local retrieval first and falls back to community search when results are weak or empty. The flag and parameter are registered in `search-flags.ts`. Auto mode uses the same confidence thresholds as the empty-result recovery system to determine when fallback is needed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:57:| `/memory:search` | 13 | owns | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:58:| `/memory:learn` | 6 | shared | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:59:| `/memory:manage` | 19 primary + 1 helper | owns + borrows | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:60:| `/memory:save` | 4 | shared | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:62:| `/spec_kit:resume` | broader helper surface | shared | Primary recovery chain: `memory_context`, `memory_search`, `memory_list`; wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:70:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:78:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:96:### Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:128:`memory_quick_search` is a live MCP tool, not just a README alias. The dispatcher in `tools/memory-tools.ts` validates the tool's narrowed input schema and forwards the call to `memory_search` with a fixed profile: `autoDetectIntent=true`, `enableDedup=true`, `includeContent=true`, `includeConstitutional=true`, and `rerank=true`. The public arguments are intentionally narrow: `query`, `limit`, `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`. That makes it useful for fast governed retrieval while keeping the heavyweight search configuration surface on `memory_search`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:136:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:146:A governed-scope pass now runs immediately after raw trigger matching. `memory_match_triggers` accepts optional `tenantId`, `userId`, `agentId`, and `sharedSpaceId` boundaries, then looks up each match in `memory_index` and drops out-of-scope rows before cognitive enrichment begins. That closes the trigger-phrase leak where another tenant or actor's memory could surface before normal retrieval filtering kicked in.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:288:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command reconstructs the most likely previous session state and routes the user to the best next step. It uses `memory_context` in resume mode as the primary interrupted-session recovery path, with a fallback chain through crash-recovery breadcrumbs, anchored memory search, and recent-candidate discovery.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:292:**SHIPPED.** `/spec_kit:resume` owns session recovery and continuation. Its primary recovery chain relies on 3 shared memory tools: `memory_context`, `memory_search`, and `memory_list`. `memory_stats` remains diagnostic/helper access, and the live wrapper also permits `memory_match_triggers`, `memory_delete`, `memory_update`, health, indexing, validation, checkpoint, and CocoIndex helpers that support the broader recovery workflow.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:294:The primary recovery path calls `memory_context` in `resume` mode with anchors targeting `state`, `next-steps`, `summary`, and `blockers`. Resume mode uses a 1200-token budget with `minState=WARM`, `includeContent=true`, dedup and decay both disabled.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:298:The recovery chain prioritizes: (1) fresh `handover.md` when present, (2) `memory_context` in resume mode, (3) `CONTINUE_SESSION.md` crash breadcrumb, (4) anchored `memory_search` for thin summaries, (5) `memory_list` for recent-candidate discovery, and (6) user confirmation as final fallback.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:316:### Memory indexing (memory_save)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:324:`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:348:Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:535:The history log is written by mutation handlers (`memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`) and lower-level mutation helpers (`delete_memories`, `delete_memory_by_path`). `lib/storage/history.ts` owns schema-safe initialization/migration and read/write helpers, while `vector-index-schema.ts` ensures initialization runs at DB startup. The orphan cleanup script removes orphaned history rows when parent memories are missing.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:591:### Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:599:`memory_health` has two report modes. `full` returns system diagnostics: database connectivity, embedding model readiness, vector-search availability, memory count, uptime, server version, alias-conflict summary, repair metadata and embedding provider details. `divergent_aliases` returns a compact triage payload that focuses only on alias groups whose `` and `.opencode/specs/` variants have different content hashes.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:625:Spec documents are still indexed by default. During scan they flow through `memory_save` with `qualityGateMode: 'warn-only'`, so template, sufficiency, and quality issues surface as warnings instead of silently bypassing retrieval.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:631:Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:749:**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:765:On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path and increments `totalRecoveries` in the transaction metrics.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1211:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1327:Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to rollout policy via `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2101:Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2485:This validation runs in `memory_save` pre-flight before any embedding generation or database writes. It protects ingestion cost and save-time limits. It does not control search-result truncation.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2516:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2769:### Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2777:The `memory_save` tool accepts a `dryRun` parameter that runs preflight validation only (content size, anchor validation, token budget estimation and exact duplicate checks) without indexing, database mutation, or file writes. In dry-run mode, handler responses are returned from the preflight result (`would_pass`, validation errors/warnings/details) and can also preview later save-path rejection reasons such as semantic insufficiency or rendered-template-contract failure.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2822:Stateless `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3284:The `memory_save` handler offers an atomic write-then-index mode where file writing is atomic (pending file + rename), while indexing runs asynchronously after the write succeeds. The transaction manager writes memory content to a `_pending` file and renames it to the final path. The `dbOperation` callback in this path is intentionally a no-op. `indexMemoryFile(...)` executes afterward and can retry once on transient failures.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3302:The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3440:All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3713:`/memory:learn` is now a constitutional-only workflow. The no-argument form shows an overview dashboard; natural-language input enters guided create mode; and `list`, `edit`, `remove`, and `budget` provide the rest of the lifecycle. New and edited files are written to `.opencode/skill/system-spec-kit/constitutional/`, indexed with `memory_save`, and checked against the shared `~2000` token budget for the constitutional tier.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3765:Phase 016 added structured JSON summary support to `generate-context.js`, including `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3783:Phase 017 established the JSON-only save contract for `generate-context.js`. Dynamic session capture proved unreliable and has been removed. `--json` and `--stdin` are now the sole save paths.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3879:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`: (1) Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits; (2) spec-folder and git context enrichment for JSON-mode saves; (3) numeric quality-score calibration so thin saves score lower than rich ones; (4) one shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing; (5) one shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index; (6) a fully refreshed canonical verification and manual-testing record; (7) JSON-only routine-save contract; (8) Wave 2 count/confidence hardening for decision confidence, truncated outcomes, and stable `git_changed_file_count` priority.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4037:`memory_health` accepts optional `autoRepair` execution only in `reportMode: "full"` and returns structured repair metadata. If `autoRepair:true` is sent without `confirmed:true`, the handler returns a confirmation-only response that lists the repair actions it would attempt.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4188:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`, where auto-resume `systemPromptContext` injection happens before `enforceTokenBudget()`. This keeps `meta.tokenCount` and the delivered payload aligned with the exact serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4284:Four profiles are implemented: quick (topResult + oneLineWhy + omittedCount + tokenReduction), research (results + evidenceDigest + followUps), resume (state + nextSteps + blockers), and debug (full trace + tokenStats). Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON, set `SPECKIT_RESPONSE_PROFILE_V1=false` to disable. Runtime wiring is active on both `memory_search` and `memory_context`, with explicit profile selection and intent-to-profile auto-routing when a profile is not provided.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4478:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4479:| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4480:| `SPECKIT_QUALITY_LOOP` | `false` | boolean | `lib/search/search-flags.ts` | **Default OFF.** Enables the verify-fix-verify loop for `memory_save`. When enabled, low-quality saves get an initial evaluation plus up to 2 immediate auto-fix retries by default; rejected saves return `status: 'rejected'`, and atomic save rolls the file back instead of retrying indexing again. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4486:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4582:| `MEMORY_ALLOWED_PATHS` | _(cwd)_ | string | `tests/regression-010-index-large-files.vitest.ts` | Colon-separated list of filesystem paths that are allowlisted for memory file access. Used in path security validation to restrict which directories `memory_save` can read from. Defaults to `cwd` if not set. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:27:  - memory_search
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:28:  - memory_context
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:39:| **Semantic/concept** (meaning-based) | `mcp__cocoindex_code__search` (CocoIndex) | `memory_search` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:40:| **Structural** (callers, imports, deps) | `code_graph_query` (Code Graph) | `Grep` / `Glob` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:47:| **Memory/context** (prior work, decisions) | `memory_search` / `memory_context` | `memory_match_triggers` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:48:| **Broad topic** (thematic overview) | `memory_search` with `retrievalLevel: "global"` | community search fallback |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:174:`dist/` directories under `shared/`, `scripts/` and `mcp_server/` are generated build outputs produced from TypeScript sources via the build process (`tsc --build`). They can run at runtime, but they are not source-of-truth code or documentation and should not be committed to version control. Edit the authored `.ts` and `.md` files in package roots, then rebuild. Scripts or documentation that reference `dist/` files for execution (e.g., `node scripts/dist/memory/generate-context.js`) are referencing the generated runtime entry point, not canonical source.
.opencode/skill/system-spec-kit/ARCHITECTURE.md:458:        codex["Codex bootstrap parity<br/>session_bootstrap() MCP tool"]
.opencode/skill/system-spec-kit/ARCHITECTURE.md:560:| Structural navigation (call graph, dependencies) | Code Graph | `code_graph_query` / `code_graph_context` |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:561:| Startup or recovery state | Session surfaces | `session_bootstrap` / `session_resume` / startup surface |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:562:| Session continuity (prior work, decisions) | Memory | `memory_search` / `memory_context` |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:12:| 1 | Community Summaries | SPECKIT_COMMUNITY_SUMMARIES | community-detection.vitest.ts | memory_search with global mode |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:16:| 5 | Dual-Level Retrieval | SPECKIT_DUAL_RETRIEVAL | community-search.vitest.ts | memory_search with retrievalLevel: global |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:29:1. Run `memory_search({ query: 'semantic search', retrievalLevel: 'global' })`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:37:1. Run `memory_search({ query: 'Semantic Search', includeTrace: true })`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:58:1. `memory_search({ query: 'search pipeline', retrievalLevel: 'local' })` - entity results only
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:59:2. `memory_search({ query: 'search pipeline', retrievalLevel: 'global' })` - community results
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:60:3. `memory_search({ query: 'search pipeline', retrievalLevel: 'auto' })` - local with fallback
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:71:1. Run `memory_search` with `includeTrace: true`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:104:- `memory_health()` returns healthy status
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:105:- `memory_match_triggers()` is unaffected by new code
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:63:| `context_template.md` | Mustache syntax (`{{VARIABLE}}`) | Programmatic generation via generate-context.js |
.opencode/skill/system-spec-kit/references/templates/template_guide.md:600:Memory files in the `memory/` folder are NOT created from templates. They are auto-generated by the runtime save script: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:602:**Creation (JSON mode — preferred):** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/`
.opencode/skill/system-spec-kit/references/templates/template_guide.md:610:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature
.opencode/skill/system-spec-kit/references/templates/template_guide.md:621:- **NEVER create memory files manually** - always use `generate-context.js` via the runtime `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` entrypoint
.opencode/skill/system-spec-kit/references/templates/template_guide.md:626:**Note:** Never manually create memory files using Write/Edit tools. Always use the runtime `generate-context.js` script per AGENTS.md Memory Save Rule.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:1188:- `memory/` - Context preservation folder (files auto-generated via `generate-context.js`)
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:19:Shared memory is a mutation-plus-retrieval feature, not a standalone folder-based subsystem. The live flow starts with lifecycle tools that enable the feature and administer shared spaces, then continues through governed `memory_save` writes and `memory_search` scope filtering.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:32:| Governed shared writes | Shared memory does not have a separate write handler. The actual content write path is `memory_save`. When `sharedSpaceId` is supplied, `memory_save` first runs governed-ingest validation, then calls `assertSharedSpaceAccess(..., 'editor')`. If access passes, the new memory row is written normally and then patched with governance fields including `tenant_id`, `user_id` or `agent_id`, `session_id`, `shared_space_id`, provenance fields, retention policy, and serialized governance metadata. |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:33:| Query visibility | Shared search visibility is enforced in the retrieval pipeline, not by a dedicated shared-memory query service. `memory_search` accepts tenant/user/agent/session/shared-space scope values and passes them into pipeline config. Stage 1 candidate generation computes `allowedSharedSpaceIds` with `getAllowedSharedSpaceIds()` and filters every candidate set through `filterRowsByScope()`. For shared rows, visibility depends on tenant match plus membership in an allowed space; exact actor/session match is intentionally not required once the row belongs to an allowed shared space. That is what makes collaborator A's shared rows visible to collaborator B inside the same shared space. |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:35:| Conflict handling | Conflict recording happens after a successful shared `memory_save`, not during space administration. Once the new row exists and governance metadata is applied, `memory_save` looks for another row in the same `shared_space_id` with the same `file_path` and a different ID. If found, it calls `recordSharedConflict()`, which writes an append-only row into `shared_space_conflicts` and also records a `shared_conflict` governance audit event. Strategy resolution defaults to `append_version`, but escalates to `manual_merge` for repeat conflicts or high-risk conflict kinds such as `destructive_edit`, `schema_mismatch`, and `semantic_divergence`. Explicit metadata can request another strategy, but only if it matches the validated strategy union. |
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:764:| `memory/` | Session context preservation | `generate-context.js` runtime script via `/memory:save` |
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:769:- Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:852:- `memory/` - Context preservation (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md:20:The history log is written by mutation handlers (`memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`) and lower-level mutation helpers (`delete_memories`, `delete_memory_by_path`). `lib/storage/history.ts` owns schema-safe initialization/migration and read/write helpers, while `vector-index-schema.ts` ensures initialization runs at DB startup. The orphan cleanup script removes orphaned history rows when parent memories are missing.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md:18:The `memory_save` handler now owns the atomic save flow directly. It computes a unique pending path, writes the memory content to that pending file, runs async indexing against the target file path before promotion, retries indexing once on transient failure, and only then renames the pending file into place. If validation, rejection, or indexing fails, the handler deletes the pending file so the original file remains untouched.
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:182:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:502:**MANDATORY:** Use generate-context.js for memory save:
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:504:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/###-folder/
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:12:The memory-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:673:Processing steps applied during `memory_save` before a memory is persisted.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md:18:The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:77:### generate-context.js runtime entrypoint
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:84:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:87:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:90:echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:220:The `generate-context.js` script orchestrates a 12-step workflow via `workflow.ts`:
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:12:The memory-surface and response-hints hooks form a passive enrichment pipeline. On every tool call, constitutional memories and trigger-matched memories are surfaced and appended to the response envelope. Code graph status is included when available. Token estimation prevents oversized payloads. The enrichment is additive (appended to hints) and does not modify the primary tool response. This ensures AI runtimes always have access to critical context even when they do not explicitly call memory_context.
.opencode/skill/system-spec-kit/references/config/environment_variables.md:108:| `DEBUG` | `false` | Enable debug logging in generate-context.ts |
.opencode/skill/system-spec-kit/references/config/environment_variables.md:133:node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/config/environment_variables.md:136:DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/config/environment_variables.md:276:| `SPECKIT_AUTO_RESUME` | ON | S7 | Auto-resume session detection in `memory_context()` |
.opencode/skill/system-spec-kit/references/config/environment_variables.md:308:| `SPECKIT_QUALITY_LOOP` | OFF | S7 | Verify-fix-verify quality loop for `memory_save` (opt-in) |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:59:| `/memory:search` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:60:| `/memory:learn` | Create and manage always-surface rules (6 tools, borrowed) | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:61:| `/memory:manage` | Database maintenance, checkpoints, and bulk ingestion (19 primary tools plus `memory_search` helper access) | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:62:| `/memory:save` | Save conversation context (4 tools, borrowed) | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:64:| `/spec_kit:resume` | Continue or recover prior work (primary chain uses 3 shared tools, with extra helpers behind the scenes) | `memory_context`, `memory_search`, `memory_list` plus `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and health, indexing, validation, checkpoint, and CocoIndex helpers in the wrapper |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:72:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:76:### Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:86:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:116:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:122:### Memory indexing (memory_save)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:182:### Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:662:### Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:972:After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item. The same rule now applies when resume context is attached in `memory_context`: add the extra context first, then enforce the size limit.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:3:description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:10:Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:12:The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:32:| `mcp_server/tools/lifecycle-tools.ts` | Dispatch | Tool dispatch registration for session_resume |
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:126:- [ ] Save context if significant progress: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:159:- [ ] Memory context saved: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/config/hook_system.md:50:Hook-capable runtimes include Claude Code, Codex CLI, Copilot CLI, Gemini CLI, and OpenCode. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). If hook context is unavailable in any runtime for any reason, fall back to the tool-based recovery path: `session_bootstrap()` on fresh start or after `/clear`, then `session_resume()` only when a detailed follow-up recovery payload is needed.
.opencode/skill/system-spec-kit/references/config/hook_system.md:55:1. `memory_match_triggers(prompt)` — Fast turn-start context
.opencode/skill/system-spec-kit/references/config/hook_system.md:56:2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
.opencode/skill/system-spec-kit/references/config/hook_system.md:57:3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:3:description: "Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:10:Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:12:When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to CocoIndex for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:12:All runtimes now have hook or bootstrap-based startup injection. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the tool-based path starting with `session_bootstrap()` on fresh start or after `/clear`. Runtime detection identifies the active runtime and its current hook policy.
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:84:The `memory_match_triggers` MCP tool provides fast trigger phrase matching without requiring embeddings:
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:88:const result = await spec_kit_memory_memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:119:1. AI calls `memory_match_triggers({ prompt: "user message" })`
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:127:const matches = await memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:158:These signals are detected during `memory_match_triggers()` processing and influence save-time arbitration (prediction-error scoring) and correction tracking.
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:174:- `memory_match_triggers()` now applies a relevance threshold before returning matches, reducing noise from weak partial matches
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:394:- [generate-context.ts](../../scripts/memory/generate-context.ts) - Context generation script
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:54:| Vector search empty | No results from `memory_search()` | Run `memory_stats()` to check index health |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:66:memory_search({ query: "auth", specFolder: "122" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:72:memory_search({ query: "auth", specFolder: "122-skill-standardization" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:78:call_tool_chain(`spec_kit_memory.memory_search({ query: "test" })`)
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:84:memory_search({ query: "test" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:108:| `Invalid tool name` | Wrong call syntax | Use native MCP syntax: `memory_search()`, `memory_list()`, etc. |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:123:| **Anchor not found** | `Anchor not found: X` | Use `memory_search()` to find available anchors |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:149:**1. Long-term memory decay (FSRS day-based):** Used by `memory_search()` for ranking stored memories. Uses FSRS v4 spaced-repetition algorithm based on elapsed calendar days since last review.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:159:**2. Trigger matching decay (turn-based):** Used by `memory_match_triggers()` within a single conversation session. Applies per-turn attention decay so earlier matches lose weight as the conversation progresses.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:170:**Important:** Long-term decay uses calendar days (FSRS). Trigger matching uses conversation turns. The `useDecay` parameter in `memory_search()` controls the FSRS day-based decay.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:215:# Use: memory_search({ query: "test", limit: 3 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:241:memory_search({ query: "recent work", limit: 5 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:260:memory_search({ query: "test" })  // Should return results
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:315:memory_search({ 
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:341:const results = await memory_search({ specFolder: "###-correct-folder", limit: 3 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:413:| **Memory Not Found** | Search returns no results | Check `memory_search({ specFolder: "..." })` |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:427:memory_search({
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:471:**Symptom:** `memory_match_triggers()` returns no results even for relevant queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:12:The ensure-ready module checks graph state (fresh/stale/empty) by comparing the current git HEAD against the last indexed HEAD and scanning for stale files. When the graph is empty, a full scan is triggered. When files are stale but below the selective reindex threshold (50 files), only changed files are reindexed. Above the threshold, a full rescan is performed. A 10-second timeout prevents blocking on large codebases. Shared by code_graph_context, code_graph_query, and code_graph_status handlers.
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:72:- `memory_search` response metadata shows no applied session/causal boosts
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:73:- `memory_context` response metadata shows no pressure-mode override
.opencode/skill/system-spec-kit/references/memory/memory_system.md:26:| Scripts | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file generation with ANCHOR format |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:48:- **Memory Files** — Session-specific context generated via `generate-context.js`. Subject to temporal decay.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:97:> **Note:** MCP tool names use plain names such as `memory_search`, `memory_save`, and `shared_memory_enable`.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:103:| L1: Orchestration | `memory_context()` | Unified entry point with intent-aware routing (7 intents) | START HERE for most memory operations |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:104:| L1: Orchestration | `session_resume()` | Resume memory, code graph, and CocoIndex state in one call | Detailed recovery payload after reconnect, or when you want direct merged resume state |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:105:| L1: Orchestration | `session_bootstrap()` | Composite bootstrap combining resume and health checks | Canonical first tool call in a fresh OpenCode-style session or after `/clear` |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:106:| L2: Core | `memory_search()` | Semantic search with vector similarity | Find prior decisions on auth |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:108:| L2: Core | `memory_match_triggers()` | Fast keyword matching (<50ms) with cognitive features | Gate enforcement |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:109:| L2: Core | `memory_save()` | Index a memory file. Re-generates embedding when **content hash** changes. Title-only changes do not trigger re-embedding. | After generate-context.js |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:112:| L3: Discovery | `memory_health()` | Check health status of memory system | Diagnose issues |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:134:| L6: Analysis | `code_graph_query()` | Query structural relationships such as callers, imports, and outlines | Find what calls a symbol or which files import a module |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:141:| L7: Maintenance | `code_graph_scan()` | Build or refresh the structural code graph index | Re-index after branch switches or large code changes |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:165:> **IMPORTANT:** You MUST provide either `query` OR `concepts` parameter. Calling `memory_search({ specFolder: "..." })` without a search parameter will cause an E040 error.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:233:memory_search({ query: "authentication decisions" })
.opencode/skill/system-spec-kit/references/memory/memory_system.md:236:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:243:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:249:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:255:// memory_search({ specFolder: "007-auth" })  // ERROR: E040
.opencode/skill/system-spec-kit/references/memory/memory_system.md:284:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:290:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:297:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:303:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:359:- `memory_search`: Exact match (SQL `=` operator)
.opencode/skill/system-spec-kit/references/memory/memory_system.md:426:memory_search({ 
.opencode/skill/system-spec-kit/references/memory/memory_system.md:446:1. **Single file:** Use `memory_save` tool to index a specific file
.opencode/skill/system-spec-kit/references/memory/memory_system.md:448:   memory_save({ filePath: "specs/007-auth/memory/session.md" })
.opencode/skill/system-spec-kit/references/memory/memory_system.md:461:Real-time file watching is optional rather than always-on. By default, use `memory_save()` or `memory_index_scan()` to index new or modified files. Enable `SPECKIT_FILE_WATCHER=true` when you want automatic markdown re-indexing after startup.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:533:This hash is stored as `content_hash` in the database and used by `memory_save()` to detect whether a file has changed — if the hash matches, re-embedding is skipped.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:688:- `scripts/dist/memory/generate-context.js` - Runtime memory-save entrypoint (compiled from `scripts/memory/generate-context.ts`)
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:98:| 1    | Check CLI argument  | `node .opencode/.../scripts/dist/memory/generate-context.js data.json [spec-folder]` |
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:165:These thresholds are defined in `generate-context.ts`:
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:236:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "006-opencode/014-stateless-alignment"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:239:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-skill-standardization/002-api-refactor"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:248:   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context.json "014-stateless-alignment"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:341:AUTO_SAVE_MODE=true node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-specific-folder"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:510:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-feature/003-new-work"
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:2:title: "Health diagnostics (memory_health)"
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:6:# Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:18:`memory_health` has two report modes. `full` returns system diagnostics: database connectivity, embedding model readiness, vector-search availability, memory count, uptime, server version, alias-conflict summary, repair metadata, embedding provider details, and an `embeddingRetry` snapshot. `divergent_aliases` returns a compact triage payload that focuses only on alias groups whose `specs/` and `.opencode/specs/` variants have different content hashes, and it also includes the same top-level `embeddingRetry` field.
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:40:| `mcp_server/schemas/tool-input-schemas.ts` | Runtime Zod schema for public `memory_health` arguments, including `confirmed` |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:41:| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_health` arguments |
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:59:- Source feature title: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:20:Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:20:Spec documents are still indexed by default. When a scan touches `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, or `handover.md`, it routes that save through `memory_save` in warn-only quality mode so validation problems remain visible without dropping the document out of retrieval.
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:28:Each file that passes through to indexing is handed off to `memory_save` for the save pipeline, so content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture still apply automatically. The `memory_save` sub-modules are documented in that feature's own catalog entry rather than duplicated here. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.
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
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:202:<!-- ANCHOR:generate-context-js-integration -->
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:203:## 9. generate-context.js Integration
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:205:When using subfolder versioning, the memory save script (`generate-context.js`) fully supports nested paths.
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:236:<!-- /ANCHOR:generate-context-js-integration -->
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md:18:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`: auto-resume `systemPromptContext` items are injected before `enforceTokenBudget()` runs, so both `meta.tokenCount` and the delivered payload stay aligned with the final serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:3:description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, while `memory_context` still carries a dead `profile` declaration."
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:10:Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring is still partial: `memory_search` applies them while `memory_context` still carries a dead `profile` declaration.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:12:Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, but the live integration is incomplete: `memory_search` can apply response profiles, while `memory_context` only declares `profile?: string` and never consumes it. When the flag is off, the original full response is returned unchanged.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:26:Runtime wiring is partial: `memory_search` applies the formatter, `memory_context` now accepts the same `profile` parameter at the schema level, but `memory_context` still declares `profile?: string` without using it. In practice, the context-side profile path remains dead code until the handler consumes it.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:42:| `mcp_server/tool-schemas.ts` | Schema | Public tool schemas now expose `profile` for `memory_context` and `memory_search` |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:2:title: "Dry-run preflight for memory_save"
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:3:description: "The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes."
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:6:# Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:10:The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:18:The `memory_save` tool accepts a `dryRun` parameter that still performs preflight validation without indexing, database mutation, or file writes, but dry-run no longer stops at preflight-only reporting.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:69:- Source feature title: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md:20:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:12:SQLite database (code-graph.sqlite) stores indexed files, symbol nodes, and relationship edges. 4 MCP tools: code_graph_scan (workspace indexing), code_graph_query (outline/calls/imports), code_graph_status (health), code_graph_context (LLM neighborhoods). WAL mode, foreign keys, directional indexes.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:29:| `mcp_server/handlers/code-graph/scan.ts` | Handler | Implements `code_graph_scan` for structural indexing |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:30:| `mcp_server/handlers/code-graph/query.ts` | Handler | Implements `code_graph_query` for callers, imports, and outlines |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:12:Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md:40:| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | `memory_save success response exposes postMutationHooks contract fields and types` | Verifies successful `memory_save` responses include `data.postMutationHooks` with `latencyMs`, cache-clear booleans and `toolCacheInvalidated` typed as the UX payload contract requires. |
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md:37:The other two advertised classes are only partially live today. `heal-session-ambiguity.sh` now exits immediately with a deprecation notice saying session ambiguity moved into the memory-save pipeline via `generate-context.js`. Its older deterministic implementation is still retained below the early exit for reference, but it is not reachable in normal execution. `heal-telemetry-drift.sh` still parses options and applies the shared retry contract, but the current main flow exits with an error saying the telemetry drift runner was removed and a supported schema-doc parity workflow must be wired back in before use.
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md:18:Instrumentation wiring is present in the retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:3:description: "Structured JSON summary support for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening for decision confidence, truncated titles, git_changed_file_count stability, and template count preservation."
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:29:1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:116:- `embeddingRetry` block in `memory_health` MCP response with: `pending`, `failed`, `retryAttempts`, `circuitBreakerOpen`, `lastRun`, `queueDepth`.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:148:| `scripts/memory/generate-context.ts` | CLI help text and structured-first save workflow documentation |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:150:| `mcp_server/handlers/memory-crud-health.ts` | `embeddingRetry` block in `memory_health` MCP response |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:156:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Structured-input precedence for `--stdin` and `--json` |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:174:- `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/generate-context-cli-authority.vitest.ts tests/input-normalizer-unit.vitest.ts tests/post-save-review.vitest.ts tests/project-phase-e2e.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/template-mustache-sections.vitest.ts tests/trigger-phrase-filter.vitest.ts tests/validation-v13-v14-v12.vitest.ts tests/workflow-e2e.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:3:description: "Outsourced agent memory capture keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization."
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:10:Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:22:`runMemoryIndexScan(args)` is a thin delegate to `handleMemoryIndexScan(args)`, so the real runtime behavior comes from the handler pipeline. The handler logs the active embedding profile when available, checks for external database updates through `checkDatabaseUpdated()`, enforces the persisted `INDEX_SCAN_COOLDOWN`, collects memory files plus optional constitutional and spec-document files, deduplicates them by canonical path, and in incremental mode categorizes files into index, update, skip, and stale-delete buckets. It batch-processes remaining files through `indexMemoryFile()`, updates stored mtimes only after successful indexing outcomes, optionally creates causal chains for changed spec documents, runs post-mutation invalidation hooks, records the last scan time, and returns standardized MCP success or error envelopes. Spec documents remain part of that scan by default, and the handler passes them through `memory_save` in warn-only quality mode rather than bypassing indexing.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/16-progressive-disclosure.md:12:The live handler preserves full `data.results`, adds `data.progressiveDisclosure`, and serves follow-up pages through `memory_search({ cursor })`. The summary tells you the quality distribution (e.g., "3 strong, 2 moderate, 1 weak") so you can decide whether to dig deeper, while pagination uses opaque cursor tokens with a time-to-live so the system can serve additional pages from a cached result set.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:3:description: "Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10)."
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:10:Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10).
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:12:When you want fast search results without configuring the full 31-parameter surface of `memory_search`, use `memory_quick_search` instead. You provide a natural language query and optionally a result limit or spec folder scope. The tool fills in sensible defaults and hands off to the full search pipeline. The results are identical to what `memory_search` would return with those same settings — this is purely a convenience layer, not a separate search path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:28:The constructed `SearchArgs` are passed directly to `handleMemorySearch()`, the same handler used by `memory_search`. There is no separate search path — `memory_quick_search` is a thin delegation layer only.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:41:| `mcp_server/handlers/memory-search.ts` | Handler | Search handler that executes the full pipeline (shared with `memory_search`) |
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md:18:`memory_health` accepts optional `autoRepair` execution only in `reportMode: "full"` and returns structured repair metadata. If `autoRepair:true` is sent without `confirmed:true`, the handler returns a confirmation-only response that lists the repair actions it would attempt.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:33:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md:81:| `scripts/memory/generate-context.ts` | Script | CLI entrypoint; delegates save workflow to `workflow.ts` |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:18:Captured-session `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:2:title: "Semantic and lexical search (memory_search)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:6:# Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:26:When trace is enabled, result envelopes now expose richer bounded Markovian diagnostics without altering the non-trace contract: `trace.graphContribution` includes `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`, and requests forwarded from `memory_context` can also include `trace.sessionTransition`. Extended telemetry summarizes the same behavior through `transitionDiagnostics` and `graphWalkDiagnostics`.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:74:- Source feature title: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:16:**SHIPPED.** `/spec_kit:resume` owns both standard continuation and interrupted-session recovery. Its primary recovery chain uses 3 shared memory tools, while the live wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:18:- **`memory_context`** (from `/memory:search`) -- Called in `resume` mode as the primary interrupted-session recovery path whenever no fresh `handover.md` already provides enough state. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:19:- **`memory_search`** (from `/memory:search`) -- Fallback for thin summaries when `memory_context` resolves the right folder but does not return enough state detail. Uses the same resume anchors.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:22:`memory_stats` remains diagnostic/helper access on the wrapper rather than part of the primary recovery chain. Additional helper access includes `memory_match_triggers()` for early session detection, `memory_delete`, `memory_update`, health, indexing, checkpoint, validation, and CocoIndex support surfaces.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:34:| 2 | `memory_context(mode: "resume")` | Primary interrupted-session recovery path |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:36:| 4 | `memory_search()` with resume anchors | Fallback when the summary is thin |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md:22:This validation runs in `memory_save` pre-flight before any embedding generation or database writes. It protects ingestion cost and save-time limits. It does not control search-result truncation.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:2:title: "Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:6:# Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:18:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:28:When `includeTrace` is enabled, `memory_context` also computes a trace-only `sessionTransition` payload and forwards it through the internal `memory_search` path. The contract is `trace.sessionTransition = { previousState, currentState, confidence, signalSources, reason? }`. Cold starts use `previousState: null`, the payload is omitted when trace is disabled, and this inference does not change retrieval routing beyond the existing mode-selection path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:76:- Source feature title: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:2:title: "Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:6:# Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:69:- Source feature title: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
.opencode/skill/system-spec-kit/README.md:93:| **Startup / Recovery Surfaces** | Runtime-specific startup context delivery where available, with `session_bootstrap()` as the canonical non-hook recovery entry and `session_resume()` as the detailed follow-up surface                    |
.opencode/skill/system-spec-kit/README.md:95:| **Session Continuity**        | Context preserved across session boundaries via `generate-context.js` and semantic indexing                                                                                                                    |
.opencode/skill/system-spec-kit/README.md:107:| **Graph Query**     | code_graph_scan, code_graph_query, code_graph_status, code_graph_context | Index, query, and explore structural relationships                 |
.opencode/skill/system-spec-kit/README.md:109:| **Session**         | session_health, session_resume, session_bootstrap                        | Structural recovery, readiness checks, and startup/bootstrap state |
.opencode/skill/system-spec-kit/README.md:111:CocoIndex (semantic search) finds code by concept. Code Graph (structural) maps what connects to what. Startup and recovery surfaces now report freshness-aware graph state, structural read paths return a `readiness` block, and lightly stale graphs may repair inline with bounded `selective_reindex` while empty or broadly stale graphs stay on the explicit `code_graph_scan` path.
.opencode/skill/system-spec-kit/README.md:157:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/README.md:206:  "tool": "memory_health",
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
.opencode/skill/system-spec-kit/README.md:901:**Fix**: Add more detail to the session summary. Use `dryRun: true` in the `memory_save` tool call to preview gate results without saving. Check the post-save quality review output for specific issues.
.opencode/skill/system-spec-kit/README.md:930:**What you see**: `memory_context()` returns irrelevant results or misses content you know exists.
.opencode/skill/system-spec-kit/README.md:941:# memory_health({ reportMode: "full" })
.opencode/skill/system-spec-kit/README.md:944:# memory_context({ input: "find_decision: why did we choose JWT?", mode: "deep" })
.opencode/skill/system-spec-kit/README.md:951:| `generate-context.js` not found  | Run `npm run build` in `system-spec-kit/`                                       |
.opencode/skill/system-spec-kit/README.md:974:# memory_health({ reportMode: "full" })
.opencode/skill/system-spec-kit/README.md:1005:A: Spec folders capture what happened in structured documentation. The memory system makes that documentation searchable across sessions. When a session ends, `generate-context.js` writes a summary to the spec folder's `memory/` directory. The MCP server indexes it. When the next session starts, runtime-specific startup integrations may auto-surface that context; otherwise the canonical recovery sequence is `session_bootstrap()` first, then `memory_context` or `memory_match_triggers` for deeper retrieval. One side captures, the recovery surfaces retrieve.
.opencode/skill/system-spec-kit/README.md:1011:A: The memory system can index any markdown file, beyond spec folder contents. But the spec folder workflow is the primary way context gets saved (via `generate-context.js`), so in practice they work together. You can save standalone memories using `memory_save`, but Gate 3 will still ask about a spec folder for file modifications.
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md:196:Search works the same way it always has. When you run `memory_search`, the system checks which shared spaces you belong to and includes those memories in results alongside your private ones. Collaborator B can find memories that Collaborator A saved to a shared space without needing to be in the same session or conversation.
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:3:description: "This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently."
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:10:This scenario validates Memory health auto-repair for `226`. It focuses on Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently.
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:18:- Objective: Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:19:- Prompt: `Validate memory_health auto-repair behavior for the Spec Kit Memory MCP server. Capture the evidence needed to prove autoRepair requires explicit confirmation before mutation, that confirmed repair can rebuild FTS, refresh trigger caches, and clean orphaned edges or vector data, and that the response preserves requested, attempted, repaired, warnings, errors, and partialSuccess metadata. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:29:| 226 | Memory health auto-repair | Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently | `Validate memory_health auto-repair behavior for the Spec Kit Memory MCP server. Capture the evidence needed to prove autoRepair requires explicit confirmation before mutation, that confirmed repair can rebuild FTS, refresh trigger caches, and clean orphaned edges or vector data, and that the response preserves requested, attempted, repaired, warnings, errors, and partialSuccess metadata. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts` 2) inspect assertions covering `memory_health` with `autoRepair: true` and missing `confirmed: true` to verify confirmation-required behavior 3) inspect assertions covering confirmed FTS rebuild, trigger-cache refresh, orphan-edge cleanup, and vector or chunk cleanup 4) inspect assertions covering `repair.requested`, `repair.attempted`, `repair.repaired`, `repair.partialSuccess`, `repair.warnings`, and `repair.errors` in success and partial-success paths | Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings | Test transcript + key assertion output for confirmation gating, staged repair actions, and repair metadata | PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths | Inspect `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/lib/parsing/trigger-matcher.ts`, `mcp_server/lib/search/vector-index.ts`, and `mcp_server/lib/storage/causal-edges.ts` if repair staging, metadata, or cleanup coverage regresses |
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/225-remediation-runtime-surface.md:19:- Prompt: `Validate the runtime remediation surface for the Spec Kit Memory MCP server. Capture the evidence needed to prove save-time remediation enforces preflight, V-rule, quality-loop, and pre-storage quality gates, that the V-rule bridge resolves the compiled validate-memory-quality runtime at the documented ../../../ path, that operator-facing repair stays confirmation-gated inside memory_health, and that checkpoint plus memory_validate paths still preserve rollback-aware revalidation signals. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/225-remediation-runtime-surface.md:29:| 225 | Runtime remediation, revalidation, and auto-repair workflows | Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals | `Validate the runtime remediation surface for the Spec Kit Memory MCP server. Capture the evidence needed to prove save-time remediation enforces preflight, V-rule, quality-loop, and pre-storage quality gates, that the V-rule bridge resolves the compiled validate-memory-quality runtime at the documented ../../../ path, that operator-facing repair stays confirmation-gated inside memory_health, and that checkpoint plus memory_validate paths still preserve rollback-aware revalidation signals. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts` 2) `cd .opencode/skill/system-spec-kit/mcp_server && node -e "const fs=require('fs'); const path=require('path'); const p=path.resolve(process.cwd(),'handlers','../../../scripts/dist/memory/validate-memory-quality.js'); console.log(p); console.log(fs.existsSync(p) ? 'exists' : 'missing')"` 3) inspect assertions covering `memory_save` preflight, V-rule disposition handling, quality-loop rejection or repair, and downstream save-quality-gate outcomes 4) inspect assertions covering `memory_health` confirmation-required auto-repair and bounded repair metadata 5) inspect assertions covering `memory_validate` and checkpoint pathways that preserve revalidation or rollback signals | Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence | Test transcript + load-path check output + key assertion output for save-time guards, confirmation gating, repair metadata, and checkpoint or validation signals | PASS if the targeted suites pass, the compiled validator path resolves, and the evidence confirms the remediation surface enforces save-time guards, bounded operator repair, and rollback-aware revalidation behavior end to end | Inspect `mcp_server/handlers/memory-save.ts`, `mcp_server/lib/validation/preflight.ts`, `mcp_server/handlers/v-rule-bridge.ts`, `mcp_server/handlers/quality-loop.ts`, `mcp_server/lib/validation/save-quality-gate.ts`, `mcp_server/handlers/checkpoints.ts`, and `mcp_server/handlers/memory-crud-health.ts` if any remediation-stage signal is missing or contradictory |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:21:- Default create mode: qualify the proposed rule, structure a constitutional markdown file, check the shared `~2000` token budget, write the file, index it with `memory_save`, and verify retrieval with `memory_search`.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:3:description: "This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:10:This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:18:- Objective: Verify `memory_context` emits trace-only session transitions with no non-trace leakage
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:19:- Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:29:| 142 | Session transition trace contract | Verify `memory_context` emits trace-only session transitions with no non-trace leakage | `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true })` 2) Verify each result exposes `trace.sessionTransition.previousState`, `currentState`, `confidence`, and ordered `signalSources` 3) Repeat without `includeTrace` and verify `sessionTransition` is absent 4) Confirm the non-trace response does not expose transition data in top-level metadata | Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled | Two `memory_context` outputs with and without `includeTrace` + field-level comparison | PASS if trace-only gating holds and the contract fields are present only in the traced call | Inspect `handlers/memory-context.ts`, `handlers/memory-search.ts`, and `lib/search/session-transition.ts` if fields leak or ordering drifts |
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:2:title: "EX-002 -- Semantic and lexical search (memory_search)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:3:description: "This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:6:# EX-002 -- Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:10:This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:29:| EX-002 | Semantic and lexical search (memory_search) | Hybrid precision check | `Search for checkpoint restore clearExisting transaction rollback. Capture the evidence needed to prove Relevant ranked results with hybrid signals. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 })` -> `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true })` | Relevant ranked results with hybrid signals | Search output snapshot | PASS if top results match query intent | Lower minState; disable cache and retry |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:3:description: "Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the shipped JSON-primary save path for `generate-context.js`, continued positional JSON file support on the same structured path, and the associated quality gates, sufficiency enforcement, and template-contract validation."
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:20:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`:
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:51:18. `generate-context.js` diagnostic scores now reflect insufficiency explicitly instead of letting thin memories look healthy.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:55:22. Structured JSON mode accepts both `generate-context.js --stdin` and `generate-context.js --json <string>` as the preferred AI-composed save paths.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:108:- After normalization, `generate-context.js` evaluates one shared semantic sufficiency snapshot before writing or indexing.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:124:- `generate-context.js --stdin` reads structured JSON from stdin and routes it through the same workflow contract as file input.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:125:- `generate-context.js --json <string>` does the same for inline structured JSON payloads.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:176:| `scripts/memory/generate-context.ts` | CLI entrypoint; `--stdin`, `--json`, and positional JSON file input all resolve through the structured-input contract |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:180:| `shared/parsing/memory-sufficiency.ts` | Shared semantic sufficiency evaluator used by `generate-context.js` and `memory_save` |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:213:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage plus `--stdin`, `--json`, and positional JSON file-input structured-path behavior |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:227:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:232:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:245:- The current supported MCP baseline for this feature is the targeted `memory_save` quality lanes plus the package-level `npm run check`.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:259:5. Cross-reference to `133` for MCP `memory_save` dry-run and insufficiency verification.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:263:9. `generate-context.js --stdin` with structured JSON, explicit CLI target precedence, and preserved `toolCalls` / `exchanges`.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:264:10. `generate-context.js --json <string>` with payload-target fallback when no explicit CLI override exists and file-backed JSON authority preserved.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:2:title: "EX-003 -- Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:3:description: "This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:6:# EX-003 -- Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:10:This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path plus trigger-cache reload efficiency.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:29:| EX-003 | Trigger phrase matching (memory_match_triggers) | Fast recall path plus trigger-cache reload efficiency | `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment, trigger-cache reload reads from the partial index source (`idx_trigger_cache_source`), and repeated reloads on the same DB connection reuse the prepared loader statement. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` and capture the returned matches 2) In a debug harness or test shell on the same SQLite connection, call `refreshTriggerCache()` or clear+reload the trigger cache twice 3) Capture query-plan, schema, or instrumentation evidence that the reload source is constrained to successful rows with non-empty `trigger_phrases` and backed by `idx_trigger_cache_source` 4) Confirm the second reload on the same DB connection reuses the cached prepared loader statement instead of preparing a new one | Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse | Trigger output + cache-refresh logs or instrumentation + query-plan/schema evidence for `idx_trigger_cache_source` | PASS if matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection. FAIL if trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement. | Retry with higher-quality trigger phrase -> inspect trigger-cache clear/reload instrumentation -> verify `idx_trigger_cache_source` exists and the reload query still filters to successful rows with non-empty trigger phrases |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:18:- Objective: Verify `/spec_kit:resume` uses `memory_context` in `resume` mode as the primary interrupted-session recovery path, falls back through `CONTINUE_SESSION.md`, anchored `memory_search()`, and `memory_list()` when needed, supports auto and confirm resume modes, and routes the user to the correct next step after recovery
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:19:- Prompt: `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:20:- Expected signals: `memory_context(mode: "resume")` is the first interrupted-session recovery path after any fresh handover; fallback behavior uses the documented resume anchors and recent-candidate discovery; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:29:| 190 | Session recovery via /spec_kit:resume | Verify `/spec_kit:resume` recovery chain, ambiguity handling, and post-recovery routing | `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/spec_kit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first calls `memory_context` in `resume` mode when fresh handover data is absent or insufficient 2) Confirm resume recovery uses the documented anchors `["state", "next-steps", "summary", "blockers"]`, include-content behavior, and bounded token-budget response 3) If auto-resume is enabled for a reusable working-memory session, verify injected `systemPromptContext` is applied before token-budget enforcement 4) If the primary summary is thin, verify fallback to `CONTINUE_SESSION.md` and then anchored `memory_search()` using the same resume anchors 5) If no clear candidate exists, verify recent-candidate discovery through `memory_list()` 6) Invoke confirm mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives 7) Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/spec_kit:resume` work or `/memory:search history <spec-folder>` depending on user need | `memory_context(mode: "resume")` is primary after fresh handover handling; fallback chain activates correctly; confirm mode shows alternatives when needed; final response contains actionable continuation state and next-step routing | Command transcript; tool invocation logs for resume, search, and list paths; evidence of crash breadcrumb use if present; final recovery summary showing state, next steps, and routing recommendation | PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips resume mode, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable | Verify `/spec_kit:resume` command routing against `.opencode/command/spec_kit/resume.md`; inspect `memory-context.ts` resume-mode wiring; confirm fallback search anchors and candidate-discovery list behavior; check session-manager breadcrumbs and reusable-session auto-resume settings |
.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/189-tool-result-extraction-to-working-memory.md:29:| 189 | Tool-result extraction to working memory | Verify automatic capture, session continuity, checkpoint preservation, attention decay, and optimized index/upsert behavior | `Validate tool-result extraction to working memory. Capture the evidence needed to prove salient tool outputs are automatically extracted into session-scoped working memory with provenance; follow-up turns can reuse that context; checkpoint restore preserves the extracted entries; attention decay follows the documented event-distance model with bounded mention boosts; the new indexes idx_wm_session_focus_lru and idx_wm_session_attention_focus support eviction and ordered reads; and upsertExtractedEntry() relies on INSERT ... ON CONFLICT without a pre-upsert existence probe. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start a reusable session such as `ex189-session` with the MCP server running so the extraction adapter is initialized through `context-server.ts` 2) Run an eligible retrieval tool call that returns salient results, for example `memory_search({ query: "checkpoint working memory", sessionId: "ex189-session" })`, and capture the tool output 3) Verify the extraction path runs after the tool response, including summary/redaction checks and an `upsertExtractedEntry()` insertion into working memory with provenance fields 4) Capture schema or query-plan evidence that `idx_wm_session_attention_focus` backs attention-ordered session reads and `idx_wm_session_focus_lru` backs least-recently-focused eviction ordering 5) Confirm the extraction write path uses a single `INSERT ... ON CONFLICT(session_id, memory_id) DO UPDATE` without a pre-upsert existence probe such as `SELECT COUNT(*)` 6) In the same session, ask a follow-up question such as `memory_context({ input: "What did the last retrieval find about checkpoint working memory?", mode: "focused", sessionId: "ex189-session" })` and confirm the prior extracted result is available without repeating the original search 7) Create and restore a checkpoint for the same session and verify the extracted working-memory entry remains available after restore 8) Advance several events and repeated mentions, then confirm the attention score follows the documented decay contract: 0.85 per elapsed event, floor 0.05 during decay updates, bounded `MENTION_BOOST_FACTOR = 0.05`, and eviction only once score drops below 0.01 | Automatic extraction runs after eligible tool responses; extracted entries carry provenance; follow-up context reuses the prior result; checkpoint restore retains the entry; attention scoring follows the documented decay, floor, mention boost, and eviction behavior; the new indexes back session reads and LRU eviction; extraction upsert executes without a pre-upsert existence probe | Tool outputs; working-memory or log evidence showing extraction/upsert; schema/query-plan evidence for `idx_wm_session_focus_lru` and `idx_wm_session_attention_focus`; follow-up retrieval transcript; checkpoint save/restore evidence; score traces or diagnostic logs showing decay behavior | PASS: Automatic extraction, cross-turn reuse, checkpoint preservation, attention-scoring behavior, index-backed reads/eviction, and direct `ON CONFLICT` upserts all align. FAIL: extracted entries are missing, unusable across turns, lost on restore, decay/boost behavior contradicts the documented contract, required indexes are absent, or the write path still performs a pre-upsert existence check. | Verify after-tool callback registration in `context-server.ts` -> inspect `extraction-adapter.ts` for summary or redaction gating -> confirm session IDs and memory IDs are stable -> inspect checkpoint restore flow -> review score-clamp and eviction handling in working-memory decay logic -> confirm no pre-upsert existence probe remains in `upsertExtractedEntry()` |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24:  1. `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` — primary recovery path
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:28:  5. If summary is still thin, run anchored fallback: `memory_search({ query: "session state next steps summary blockers", specFolder: "specs/<target-spec>", anchors: ["state","next-steps","summary","blockers"], includeContent: true, limit: 5 })`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:29:- Expected: Resume-ready state summary and next steps via `memory_context(mode:"resume")` as primary path.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:30:- Evidence: returned context + extracted next actions + recovery source identification (memory_context / continue_session / memory_search / user).
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:31:- Pass: `memory_context(mode:"resume")` is used as the primary recovery path; continuation context is actionable and specific.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:32:- Fail triage: verify `memory_context` resume mode routes correctly; broaden anchors on fallback search; verify spec folder path; check `CONTINUE_SESSION.md` presence.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:19:Phase 017 established the JSON-primary deprecation posture for `generate-context.js`. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract, while positional JSON file input remains functional on the same structured-input path.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:30:2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented and preferred routine-save paths for AI-composed structured input.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:69:| `scripts/memory/generate-context.ts` | CLI argument parsing for `--json`, `--stdin`, and positional JSON file input |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:79:| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, explicit CLI target authority, and positional JSON file support |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:80:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Invalid inline JSON and missing-target failures for structured-input modes |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:87:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:29:| 187 | Quick search (memory_quick_search) | Verify `memory_quick_search` simplified query-only retrieval | `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Call `memory_quick_search({ query: "authentication" })` with no optional parameters and verify results are returned 2) Call `memory_quick_search({ query: "authentication", specFolder: "specs/<known-spec>" })` and verify results are scoped to the specified folder 3) Call `memory_quick_search({ query: "authentication", limit: 3 })` and verify at most 3 results are returned 4) Call `memory_quick_search({ query: "authentication", tenantId: "tenant-1" })` and verify governed retrieval boundary is respected 5) Compare `memory_quick_search` results with `memory_context` results for the same query to confirm quick_search provides a simplified fast-path alternative | Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately | Tool outputs for each call showing result count, specFolder scoping, limit adherence, and tenant filtering | PASS: Quick search returns relevant results, specFolder narrows scope, limit is respected, governed boundaries filter; FAIL: Quick search returns no results for a known query, specFolder is ignored, limit is exceeded, or governed boundaries do not filter | Verify `memory_quick_search` tool is listed in search.md allowed-tools → Check L2 layer routing → Confirm query parameter is required → Inspect optional parameter handling for specFolder, limit, tenantId, userId, agentId, sharedSpaceId |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/005-4-stage-pipeline-architecture.md:29:| EX-005 | 4-stage pipeline architecture | Stage invariant verification | `Search Stage4Invariant score snapshot verifyScoreInvariant. Capture the evidence needed to prove No invariant errors; stable final scoring. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search(query,intent:understand)` | No invariant errors; stable final scoring | Output + logs | PASS if no score-mutation symptoms | Inspect stage metadata and flags |
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/017-checkpoint-restore-checkpoint-restore.md:30:| EX-017 | Checkpoint restore (checkpoint_restore) | Rollback restore drill | `Restore checkpoint with merge mode. Capture the evidence needed to prove Restored data + healthy state. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_restore(name,clearExisting:false)` -> `memory_health()` | Restored data + healthy state | Restore output + search proof | PASS if known record restored | Retry with clearExisting based on conflict |
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/017-checkpoint-restore-checkpoint-restore.md:31:| EX-017 | Checkpoint restore (checkpoint_restore) | Maintenance barrier blocks mutation traffic | `Start a checkpoint restore and, while the restore maintenance window is still active, attempt memory_save, memory_index_scan, and memory_bulk_delete. Capture the evidence that each mutation fails fast with E_RESTORE_IN_PROGRESS and return a concise user-facing pass/fail verdict with the main reason.` | `1) Session A: start checkpoint_restore(name,clearExisting:false) and hold it in the active restore window using the restore test harness or barrier hook` -> `2) Session B: memory_save(filePath)` -> `3) Session B: memory_index_scan(specFolder)` -> `4) Session B: memory_bulk_delete(tier:\"temporary\",confirm:true,specFolder)` -> `5) capture the error envelopes from all three mutation calls` | All three mutation calls fail fast with `E_RESTORE_IN_PROGRESS` while restore maintenance is active | Restore-in-progress evidence + three mutation error envelopes | PASS if `memory_save`, `memory_index_scan`, and `memory_bulk_delete` each return `E_RESTORE_IN_PROGRESS` before the restore exits | If any mutation proceeds, inspect `getRestoreBarrierStatus()` wiring in the mutation handlers and confirm the restore is still inside the maintenance window |
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/017-checkpoint-restore-checkpoint-restore.md:32:| EX-017 | Checkpoint restore (checkpoint_restore) | Maintenance barrier clears after restore exit | `Prove the checkpoint restore maintenance barrier clears after restore exit. Trigger a blocked mutation during restore, let the restore complete or fail, then retry the same mutation and capture the evidence that E_RESTORE_IN_PROGRESS no longer appears. Return a concise user-facing pass/fail verdict with the main reason.` | `1) Start checkpoint_restore(name,clearExisting:false) and hold it long enough to observe a blocked mutation` -> `2) Attempt memory_index_scan(specFolder) and capture E_RESTORE_IN_PROGRESS` -> `3) Allow checkpoint_restore to complete successfully or fail` -> `4) Retry memory_index_scan(specFolder) or memory_save(filePath)` -> `5) confirm the retry no longer returns E_RESTORE_IN_PROGRESS` | Mutation is blocked during restore, then unblocked after restore exit even when the restore fails | Before/after mutation responses + restore completion or failure output | PASS if the retry after restore exit no longer returns `E_RESTORE_IN_PROGRESS` | If the barrier remains latched, inspect the `restoreCheckpoint()` `finally` path that releases restore maintenance |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/109-quality-aware-3-tier-search-fallback.md:29:| 109 | Quality-aware 3-tier search fallback | Confirm multi-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation in the Stage 1 pipeline. Capture evidence for quality-checked multi-tier fallback via collectRawCandidates and single-pass enrichment on the final merged tier.` | 1) Verify `collectRawCandidates()` in `hybrid-search.ts` calls `executeFallbackPlan(..., { stopAfterFusion: true })` when the fallback flag is enabled 2) Confirm Tier 1 runs at minSimilarity=0.3, `checkDegradation()` evaluates quality, and Tier 2 widens to minSimilarity=0.1 only inside `allowedChannels` 3) Verify `searchWithFallbackTiered()` merges Tier 1, Tier 2, and calibrated Tier 3 candidates before calling `enrichFusedResults()` once on the final stage execution context 4) Confirm enrichment-only stages such as reranking, co-activation, contextual headers, and `truncateToBudget()` live inside `enrichFusedResults()` rather than the per-tier collection path 5) When flag=false: verify two-pass adaptive (0.3→0.17) without quality-checked tiering 6) Verify `executePipeline()` in `memory_search` handler routes through Stage 1 which calls `collectRawCandidates()` | Tier 1 runs with minSimilarity=0.3; checkDegradation evaluates quality; Tier 2 widens within the allowed channel set; per-tier collection stops after fusion; enrichment runs once on the final merged candidate set; lexical structural fallback respects caller-disabled channels; flag=false switches to two-pass adaptive | Source code: `hybrid-search.ts` collectRawCandidates, `executeFallbackPlan()`, `searchWithFallbackTiered()`, `enrichFusedResults()`, plus `search-flags.ts` fallback gate | PASS if quality-checked multi-tier fallback triggers via collectRawCandidates, preserves explicit channel disables, and only performs enrichment after the final merged tier is selected | Inspect `collectRawCandidates()` stop-after-fusion behavior, `checkDegradation()` thresholds, `searchWithFallbackTiered()` merge order, and whether enrichment helpers are invoked once or per tier |
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1975:    structuredLog('info', 'memory_save_started', {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2001:      'memory_save_review_completed',
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2015:      structuredLog('warn', 'memory_save_review_failure', {
.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts:150:| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:2:title: "EX-001 -- Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:3:description: "This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:6:# EX-001 -- Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:10:This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:19:- Prompt: `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:29:| EX-001 | Unified context retrieval (memory_context) | Intent-aware context pull | `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_match_triggers({ prompt: "fix flaky index scan retry logic", sessionId: "ex001" })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "auto", sessionId: "ex001" })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })` | Relevant bounded context returned; no empty response | Tool outputs + mode selection | PASS if relevant context returned in both calls | Check specFolder/intent mismatch, retry with explicit intent |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-targeted-memory-lookup.md:24:  - `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:550:    structuredLog('warn', 'memory_save_review_violation', {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:568:      structuredLog('warn', 'memory_save_git_provenance_degraded', {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:577:      structuredLog('warn', 'memory_save_template_contract_violation', {
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/143-bounded-graph-walk-rollout-and-diagnostics.md:29:| 143 | Bounded graph-walk rollout and diagnostics | Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering | `Validate bounded graph-walk rollout states and trace diagnostics. Capture the evidence needed to prove Rollout states switch cleanly between trace_only, bounded_runtime, and off; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; off disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare a graph-connected sandbox corpus 2) Start runtime with `SPECKIT_GRAPH_WALK_ROLLOUT=trace_only` and run `memory_search({ query:"graph rollout trace check", includeTrace:true, limit:10 })` 3) Verify `trace.graphContribution.rolloutState` is `trace_only` and `appliedBonus` remains 0 while `raw`/`normalized` are still visible 4) Restart with `SPECKIT_GRAPH_WALK_ROLLOUT=bounded_runtime` and repeat 5) Verify `appliedBonus` is present, bounded at `<= 0.03`, and `capApplied` flips to `true` when the bounded runtime bonus saturates at the Stage 2 cap 6) Restart with `SPECKIT_GRAPH_WALK_ROLLOUT=off` and verify the graph-walk bonus disappears while the broader graph-signal path stays governed by `SPECKIT_GRAPH_SIGNALS` and repeated identical runs keep the same ordering | Rollout states switch cleanly between `trace_only`, `bounded_runtime`, and `off`; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; `off` disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering | Search outputs for all three rollout states + ordering comparison across repeated runs | PASS if rollout state, bounded bonus, cap saturation signaling, and ordering guarantees all match the documented ladder | Inspect `lib/search/search-flags.ts`, `lib/search/graph-flags.ts`, `lib/graph/graph-signals.ts`, and `lib/search/pipeline/ranking-contract.ts` if bonus or ordering contracts drift |
.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/004-hybrid-search-pipeline.md:29:| EX-004 | Hybrid search pipeline | Channel fusion sanity, caller-preserving fallback, and trace consistency | `Validate the hybrid search pipeline with trace enabled. Capture the evidence needed to prove multiple channels can contribute to the same query, score aliases stay aligned after boosts, explicit channel disables such as useGraph:false remain disabled even when fallback widens retrieval, and the lexical fallback path only uses allowed lexical channels with normalized query preparation. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true })` 2) `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true, useGraph:false })` 3) Compare the trace envelopes and confirm graph plus degree contributions disappear from the second run 4) Source-check `collectRawCandidates()` in `mcp_server/lib/search/hybrid-search.ts` if the trace does not make the fallback routing explicit | Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across exposed score aliases; `useGraph:false` suppresses graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels | Paired trace outputs plus source-backed fallback routing confirmation if needed | PASS if fusion evidence is coherent, explicit channel disables survive fallback, and no contradictory channel trace appears | Inspect `hybrid-search.ts` candidate routing and trace fields if graph or degree signals leak into the `useGraph:false` run |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:252:### EX-001 | Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:258:Prompt: `Use memory_context in resume mode for: fix flaky index scan retry logic. Reuse a real sessionId with prompt-context history. Capture the evidence needed to prove Relevant bounded context returned; auto-resume systemPromptContext is injected before budget enforcement; final response stays within the advertised token budget. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:266:### EX-002 | Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:276:Additional audit scenario: `Run memory_search against a fixture set that contains one expired memory, one live memory, and enough constitutional rows to overflow a tiny limit. Capture the evidence needed to prove multi-concept search excludes the expired row, constitutional injection never returns more than the requested limit, and malformed embeddings fail with a clear validation-style error instead of a raw sqlite-vec exception. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:284:### EX-003 | Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:326:### EX-006 | Memory indexing (memory_save)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:436:### EX-013 | Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1316:Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1318:description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2595:### 133 | Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2601:Prompt: `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2700:Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2703:Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2801:Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2854:Verify the structured JSON summary contract for `generate-context.js`, including `toolCalls`/`exchanges` fields, file-backed JSON authority, and Wave 2 hardening.
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2857:Prompt: `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields. Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a concise user-facing pass/fail verdict.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2871:Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2885:Prompt: `Run generate-context.js --json with varied payloads to exercise the post-save quality review hook. For each scenario confirm whether the review reports PASSED, SKIPPED, or specific issues at the correct severity. Return a pass/fail verdict for each scenario.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3067:Prompt: `Run a search returning > 5 results and verify the response preserves full data.results while adding data.progressiveDisclosure with summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor. Then use memory_search({ cursor }) to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove the additive disclosure contract. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3469:| EX-001 | Existing Features | Unified context retrieval (memory_context) | [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md) | [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3470:| EX-002 | Existing Features | Semantic and lexical search (memory_search) | [EX-002](01--retrieval/002-semantic-and-lexical-search-memory-search.md) | [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3471:| EX-003 | Existing Features | Trigger phrase matching (memory_match_triggers) | [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md) | [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3474:| EX-006 | Existing Features | Memory indexing (memory_save) | [EX-006](02--mutation/006-memory-indexing-memory-save.md) | [02--mutation/01-memory-indexing-memorysave.md](../feature_catalog/02--mutation/01-memory-indexing-memorysave.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3481:| EX-013 | Existing Features | Health diagnostics (memory_health) | [EX-013](03--discovery/013-health-diagnostics-memory-health.md) | [03--discovery/03-health-diagnostics-memoryhealth.md](../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3634:| 133 | Features | Dry-run preflight for memory_save | [133](13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md) | [13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md](../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3747:| 264 | Context Preservation | Query-intent routing in memory_context | [264](22--context-preservation-and-code-graph/264-query-intent-routing.md) | [22--context-preservation-and-code-graph/19-query-intent-routing.md](../feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md) |
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:365:    expect(events.some((event) => event.message === 'memory_save_review_violation')).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:465:    expect(events.some((event) => event.message === 'memory_save_started')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:466:    expect(events.some((event) => event.message === 'memory_save_review_completed')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:468:    expect(stdout).not.toContain('"message":"memory_save_started"');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:469:    expect(stdout).not.toContain('"message":"memory_save_review_completed"');
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/032-5-embedding-and-api.md:29:| EX-032 | 5. Embedding and API | Provider selection audit | `Retrieve embedding provider selection rules. Capture the evidence needed to prove Provider rules and key precedence shown. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })` | Provider rules and key precedence shown | Search output | PASS if provider routing is clear | Verify env in runtime |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/030-3-mcp-configuration.md:29:| EX-030 | 3. MCP Configuration | MCP limits audit | `Find MCP validation settings defaults. Capture the evidence needed to prove MCP guardrails returned. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })` | MCP guardrails returned | Search output | PASS if defaults + keys identified | Verify in config files directly |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/033-6-debug-and-telemetry.md:29:| EX-033 | 6. Debug and Telemetry | Observability toggle check | `List telemetry/debug vars and separate opt-in flags from inert flags. Capture the evidence needed to prove Debug/telemetry controls identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 })` | Debug/telemetry controls identified | Search output | PASS if opt-in vs inert controls are clearly separated | Check feature flag governance section |
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:26:        'R4 nudges structural follow-up toward code_graph_query when graph readiness is high.',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:45:      liveBaselineResolution: 'code_graph_query',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:76:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:107:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:138:      liveBaselineResolution: 'memory_context_then_grep',
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/028-1-search-pipeline-features-speckit.md:29:| EX-028 | 1. Search Pipeline Features (SPECKIT_*) | Flag catalog verification with inert and retired surface cleanup | `List SPECKIT search-pipeline flags as active, inert compatibility shims, or retired. Capture the evidence needed to prove active flags stay separated from inert compatibility shims such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING, and that retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not presented as active manual-test scenarios. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 })` -> `memory_context({ input: "Classify live search-pipeline flags versus inert compatibility shims and retired topics", mode: "deep", sessionId: "ex028" })` | Accurate active/inert/retired classification; retired topics absent from active manual-test guidance | Search/context outputs + catalog cross-check notes | PASS if classifications are internally consistent and retired topics are not framed as active checks | Validate against code/config docs; remove any manual-test wording that still treats retired topics as live search-pipeline behavior |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/034-7-ci-and-build-informational.md:29:| EX-034 | 7. CI and Build (informational) | Branch metadata source audit | `Find branch env vars used in checkpoint metadata. Capture the evidence needed to prove Branch source vars surfaced. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })` | Branch source vars surfaced | Search output | PASS if all listed vars are found | Search CI scripts and runtime helpers |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/031-4-memory-and-storage.md:29:| EX-031 | 4. Memory and Storage | Storage precedence check | `Explain DB path precedence env vars. Capture the evidence needed to prove Precedence chain identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 })` -> `memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })` | Precedence chain identified | Search/context output | PASS if precedence is unambiguous | Cross-check shared config loader and vector-index store override path |
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/080-pipeline-and-mutation-hardening.md:22:- Additional focus: checkpoint restore maintenance blocks `memory_save`, `memory_index_scan`, and `memory_bulk_delete` with `E_RESTORE_IN_PROGRESS` until the restore lifecycle exits
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/080-pipeline-and-mutation-hardening.md:31:| 080 | Pipeline and mutation hardening | Checkpoint restore barrier blocks mutation traffic | `Validate the T300 checkpoint restore barrier by holding checkpoint_restore open and proving memory_save, memory_index_scan, and memory_bulk_delete fail fast with E_RESTORE_IN_PROGRESS. Capture the evidence and return a concise user-facing pass/fail verdict with the main reason.` | `1) Session A: start checkpoint_restore(name,clearExisting:false) and hold it in the active restore window using the restore test harness or barrier hook` -> `2) Session B: memory_save(filePath)` -> `3) Session B: memory_index_scan(specFolder)` -> `4) Session B: memory_bulk_delete(tier:\"temporary\",confirm:true,specFolder)` -> `5) capture the barrier errors from all three mutation calls` | All guarded mutation paths return `E_RESTORE_IN_PROGRESS` while restore maintenance is active | Restore-in-progress evidence + three mutation error envelopes | PASS if each guarded mutation path fails fast with `E_RESTORE_IN_PROGRESS` before restore exit | If any call slips through, inspect restore barrier reads in `memory-save`, `memory-index`, and `memory-bulk-delete` handlers |
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/080-pipeline-and-mutation-hardening.md:32:| 080 | Pipeline and mutation hardening | Checkpoint restore barrier clears after restore exit | `Validate that the checkpoint restore barrier clears after restore success or failure. Capture one blocked mutation during restore, let the restore exit, retry the mutation, and prove E_RESTORE_IN_PROGRESS no longer appears. Return a concise user-facing pass/fail verdict with the main reason.` | `1) Start checkpoint_restore(name,clearExisting:false) and keep it active long enough to observe a blocked mutation` -> `2) Attempt memory_save(filePath) or memory_index_scan(specFolder) and capture E_RESTORE_IN_PROGRESS` -> `3) Let checkpoint_restore complete successfully or fail` -> `4) Retry the same mutation call` -> `5) confirm the retry no longer returns E_RESTORE_IN_PROGRESS` | Mutation is blocked only during restore maintenance and becomes available again after restore exit | Before/after mutation responses + restore completion or failure output | PASS if the post-restore retry no longer returns `E_RESTORE_IN_PROGRESS` | If the retry still reports restore-in-progress, inspect the `restoreCheckpoint()` barrier release in the storage layer `finally` path |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/029-2-session-and-cache.md:29:| EX-029 | 2. Session and Cache | Session policy audit | `Retrieve dedup/cache policy settings. Capture the evidence needed to prove Session/cache controls found. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })` | Session/cache controls found | Search output | PASS if all required keys surfaced | Expand query terms |
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:110:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
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
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:50:| 153-M | JSON mode structured summary hardening | Embedding retry stats visible in memory_health | `Call memory_health and confirm the response includes an embeddingRetry block with pending, failed, retryAttempts, circuitBreakerOpen, lastRun, and queueDepth fields.` | 1) Call memory_health MCP tool 2) Inspect response for embeddingRetry block 3) Verify all 6 fields present | embeddingRetry block present with all fields | memory_health MCP response | PASS if embeddingRetry block present with all fields; FAIL if missing or incomplete | Check retry-manager.ts getEmbeddingRetryStats() and memory-crud-health.ts handler |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:51:| 153-N | JSON mode structured summary hardening | Default-on pre-save overlap warning uses exact content match | `Run generate-context.js --json twice with the same payload while SPECKIT_PRE_SAVE_DEDUP is unset. Confirm the second run emits a PRE-SAVE OVERLAP warning before writing. Then repeat with SPECKIT_PRE_SAVE_DEDUP=false and confirm the warning is absent.` | 1) Save a JSON payload once 2) Save the exact same payload again with `SPECKIT_PRE_SAVE_DEDUP` unset 3) Capture stdout/stderr and confirm a PRE-SAVE OVERLAP warning 4) Repeat the second save with `SPECKIT_PRE_SAVE_DEDUP=false` 5) Confirm the warning is absent | Advisory overlap warning appears only when the flag is enabled/defaulted | CLI stdout/stderr from repeated saves | PASS if default-on behavior emits the warning and explicit disable suppresses it; FAIL if the warning never appears or cannot be disabled | Check `workflow.ts` SHA1 overlap check and env-flag gate |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:52:| 153-O | JSON mode structured summary hardening | projectPhase override propagates to frontmatter | `Run generate-context.js --json with projectPhase set to "IMPLEMENTATION". Confirm the rendered memory file's frontmatter PROJECT_PHASE matches "IMPLEMENTATION" and is not the default "RESEARCH".` | 1) Set projectPhase to "IMPLEMENTATION" in JSON payload 2) Run generate-context.js --json 3) Read frontmatter 4) Assert PROJECT_PHASE equals IMPLEMENTATION | PROJECT_PHASE: IMPLEMENTATION in frontmatter | Rendered .md frontmatter | PASS if PROJECT_PHASE matches; FAIL if shows RESEARCH | Check resolveProjectPhase() in session-extractor.ts and projectPhase propagation in input-normalizer.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/186-memory-manage-command-routing.md:20:- Expected signals: No-args shows stats dashboard via `memory_stats()` + `memory_list()`; scan routes to `memory_index_scan()`; health routes to `memory_health()`; checkpoint subcommands route to checkpoint tools; ingest subcommands route to ingest tools; unrecognized mode returns STATUS=FAIL
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/186-memory-manage-command-routing.md:29:| 186 | /memory:manage command routing | Verify `/memory:manage` default stats dashboard and subcommand routing | `Validate /memory:manage command routing across the currently supported management modes. Capture the evidence needed to prove No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns error. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:manage` with no arguments and verify the stats dashboard appears showing total, size, indexed date, tier distribution, and top folders via `memory_stats()` + `memory_list({ limit: 10, sortBy: "updated_at" })` 2) Invoke `/memory:manage scan` and verify `memory_index_scan()` is called 3) Invoke `/memory:manage scan --force` and verify force re-index is triggered 4) Invoke `/memory:manage health` and verify `memory_health()` is called 5) Invoke `/memory:manage checkpoint list` and verify `checkpoint_list()` is called 6) Invoke `/memory:manage checkpoint create test-snap` and verify `checkpoint_create()` is called 7) Invoke `/memory:manage ingest status abc-123` and verify `memory_ingest_status()` is called 8) Invoke `/memory:manage delete 42` and verify confirmation prompt appears before `memory_delete()` 9) Invoke `/memory:manage bulk-delete temporary --older-than 30` and verify confirmation prompt appears before `memory_bulk_delete()` 10) Invoke `/memory:manage invalid-mode` and verify `STATUS=FAIL ERROR="Unknown mode"` is returned | No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns STATUS=FAIL error | Tool invocation logs for each subcommand; stats dashboard output for default mode; error output for unrecognized mode | PASS: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly; FAIL: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error | Verify argument routing logic in Section 4 of manage.md → Check mode parsing in mandatory first action → Confirm tool-to-mode mapping → Inspect confirmation gates on destructive operations (delete, bulk-delete, checkpoint restore) |
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/204-embedding-retry-orchestrator.md:29:| 204 | Embedding retry orchestrator | Verify failed embeddings fall back to pending lexical-only storage and are later repaired by the background retry manager with retry/backoff tracking | "Validate the embedding retry orchestrator. Capture the evidence needed to prove a save or index operation can persist a memory with `embedding_status='pending'` when the provider is unavailable; the retry manager later picks up pending items in batch; cache dedup avoids redundant embedding calls where possible; retry counts/backoff state advance on repeated failures; and a successful retry refreshes the stored vector/index state. Return a concise user-facing pass/fail verdict with the main reason." | 1) Simulate embedding-provider unavailability during `memory_save` or `memory_index_scan` 2) Confirm the memory is still saved and marked pending without vectors, with lexical-only fallback intact 3) Restore provider availability and run or wait for the retry manager batch job 4) Confirm pending items are retried, retry counters/backoff metadata update appropriately, and cache reuse is visible when content was embedded before 5) Verify successful retry clears the pending state and refreshes vector/index rows for the affected memory | Provider outage yields saved memory with pending embedding status and lexical-only fallback; retry manager scans and processes pending items; embedding cache participates in deduplication; retry count/progressive backoff state changes across failures; successful retry updates memory index and vector storage | Save/index transcript during outage + pending status evidence + retry-manager run output + cache/retry stats + final vector/index state after recovery | PASS if pending memories remain searchable lexically during outage and are later upgraded with vectors by retry orchestration; FAIL if failed embeddings are dropped, pending items are never retried, or success does not refresh index/vector state | Inspect retry-manager batch selection and backoff logic; verify embedding cache reuse; check pending-status persistence during fallback; confirm retry success path clears stale vector rows and writes refreshed embeddings |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:27:- Prompt: `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:37:| 154 | JSON-primary deprecation posture | Verify JSON-only save contract | `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` → expect non-zero exit with migration message | Path 1: exit 0, Path 2: non-zero with guidance | CLI exit codes and stdout/stderr output | PASS if both paths match documented behavior | Check generate-context.ts argument parsing and migration guidance text |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:53:  - `133` cross-reference for MCP `memory_save` dry-run and insufficiency preview
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:68:    - `grep -n 'SYSTEM_SPEC_KIT_CAPTURE_SOURCE\|trigger_phrases' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts .opencode/skill/system-spec-kit/templates/context_template.md`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:72:    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/session-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:77:    - `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:86:    - `M-007a` Rich JSON-mode save: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <json-data-file> 009-perfect-session-capturing` with a populated synthetic or sandbox JSON file and verify `qualityValidation.valid === true`, indexing succeeds, and a memory ID is returned.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:88:    - `M-007b` Thin JSON insufficiency: rerun `generate-context.js` with intentionally thin JSON input using the documented snake_case contract and verify it now fails `INSUFFICIENT_CONTEXT_ABORT` before file write, with a materially lower diagnostic score than `M-007a`.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:99:    - `M-007m` `--stdin` structured input: pipe valid structured JSON into `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <target-spec-folder>` and confirm the explicit CLI target wins over any payload `specFolder`, while `toolCalls` and `exchanges` survive into the generated output.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:100:    - `M-007n` `--json` structured input: run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>'` and confirm the payload target is used when no explicit CLI target is provided, while file-backed JSON remains on the authoritative structured path instead of entering runtime-derived reconstruction.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:129:  - `generate-context.js` output or capture logs showing results for `M-007a` through `M-007j`.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capturing-pipeline-quality.md:130:  - `generate-context.js` output or targeted Vitest evidence showing results for `M-007k` through `M-007q`.
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/149-rendered-memory-template-contract.md:19:- Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/149-rendered-memory-template-contract.md:29:| 149 | Rendered memory template contract | Confirm malformed rendered memories fail before write/index and valid rendered output remains validator-clean | `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a sandbox memory missing mandatory anchors or required frontmatter keys 2) `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details 3) `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing 4) Run `generate-context.js` with a valid rich JSON payload and verify the rendered output remains validator-clean | Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean | Dry-run/save rejection output + successful render validation evidence | PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean | Inspect `shared/parsing/memory-template-contract.ts`, `scripts/core/workflow.ts`, and `mcp_server/handlers/memory-save.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/112-cross-process-db-hot-rebinding.md:29:| 112 | Cross-process DB hot rebinding | Confirm marker-file triggers DB reinitialization | `Validate cross-process DB hot rebinding via marker file. Capture the evidence needed to prove Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind. Return a concise user-facing pass/fail verdict with the main reason.` | 1) start MCP server 2) create a test memory via MCP: `memory_save(filePath)` and note its title 3) from a separate terminal, run `node cli.js bulk-delete --tier scratch --folder specs/test-sandbox` (non-dry-run — this mutates the DB and writes the `DB_UPDATED_FILE` marker) 4) immediately call `memory_stats()` via MCP → verify server detects marker and reinitializes DB 5) verify no stale data from pre-rebind state 6) run `memory_health()` → verify healthy status post-rebind | Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind | memory_stats output post-rebind + memory_health output + marker file detection evidence | PASS if server detects marker file, reinitializes DB, returns current (non-stale) data, and health is healthy | Inspect DB_UPDATED_FILE marker path and detection logic; verify DB reinitialization clears caches; check for stale connection handles |
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:13:        'Implemented a shared insufficiency gate across workflow and memory_save so thin saves fail explicitly.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:38:        'Rerun the memory_save dry-run coverage after wiring the new rejection payload.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:152:        '### Tool: bash memory_save dry run',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:155:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'evidence counts'],
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:158:          title: 'Tool: bash memory_save dry run',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:159:          narrative: 'Executed memory_save with dryRun=true and confirmed the insufficiency payload is explicit and non-mutating.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:67:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:115:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/121-adaptive-shadow-proposal-and-rollback-phase-4.md:29:| 121 | Adaptive shadow proposal and rollback (Phase 4) | Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly | `Validate Phase 4 adaptive shadow proposal flow. Capture the evidence needed to prove Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Set `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` and leave `SPECKIT_MEMORY_ADAPTIVE_MODE` unset 2) Trigger access/validation events for one memory 3) Run `memory_search({ query:"adaptive shadow check", includeTrace:true })` 4) Verify response includes `adaptiveShadow` proposal data while production ordering remains the live result order 5) Disable the flag and repeat | Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output | Search output with `adaptiveShadow` payload + before/after flag comparison + signal capture evidence from validation/access paths | PASS: Shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; FAIL: Live order changes under shadow mode or proposal persists after disable | Verify adaptive signals were recorded from access/validation → Inspect bounded delta cap → Confirm disable path clears proposal output without schema rollback |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/210-memory-health-autorepair-metadata.md:19:- Prompt: `Validate memory_health autoRepair metadata in full report mode. Capture the evidence needed to prove unconfirmed autoRepair requests return a confirmation-only payload, confirmed repairs return structured repair actions, and mixed outcomes set repaired and partialSuccess exactly as documented. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/210-memory-health-autorepair-metadata.md:29:| 210 | Memory health autoRepair metadata | Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting | `Validate memory_health autoRepair metadata in full report mode. Capture the evidence needed to prove unconfirmed autoRepair requests return a confirmation-only payload, confirmed repairs return structured repair actions, and mixed outcomes set repaired and partialSuccess exactly as documented. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts` 2) inspect assertions covering confirmation-only responses for `autoRepair:true` without `confirmed:true` 3) inspect assertions covering FTS rebuild, orphan cleanup, and partial-success repair metadata | The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds | Test transcript + highlighted assertion names or output snippets for confirmation-only and partial-success cases | PASS if the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics | Inspect `handlers/memory-crud-health.ts`, `handlers/memory-crud-types.ts`, and response-envelope shaping for `repair` payload regressions |
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/196-tool-level-ttl-cache.md:29:| 196 | Tool-level TTL cache | Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation | `Verify the tool-level TTL cache on a repeated expensive request. Run the same request twice within the active TTL window and confirm the second run is served from the per-tool cache using the same SHA-256 cache key. Then invalidate the relevant search path with a mutation or wait for TTL expiry and verify the next run recomputes instead of serving stale data. Capture hit, miss, eviction or invalidation evidence and return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm current cache settings, including active TTL window 2) Run a repeatable expensive request such as the same `memory_search` twice with identical inputs 3) Inspect cache stats or trace output to confirm miss then hit on the same tool/input key 4) Perform a relevant mutation such as `memory_save`, `memory_update`, or `memory_delete`, or wait past TTL expiry 5) Re-run the same request and confirm recomputation plus invalidation or expiry accounting | First run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data | Terminal transcript, cache stats or logs, repeated request output, and post-mutation or post-expiry rerun evidence | PASS: second identical run is a cache hit and the next run after invalidation or expiry recomputes cleanly; FAIL: repeated request misses inside TTL, stale results survive invalidation, or stats contradict the observed behavior | Verify TTL config and max-entry settings -> Confirm identical tool/input payloads were used -> Inspect cache-key hashing and per-tool scoping -> Check mutation hook invalidation path -> Review expiry cleanup timing and oldest-entry eviction behavior |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/240-core-workflow-infrastructure.md:19:- Prompt: `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/240-core-workflow-infrastructure.md:29:| 240 | Core Workflow Infrastructure | Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests | `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts` | All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams | Vitest transcript showing passing suite counts and file names | PASS if the targeted suites pass together without failures; FAIL if any shared workflow seam regresses | Inspect `scripts/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails |
.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/095-strict-zod-schema-validation-p0-1.md:29:| 095 | Strict Zod schema validation (P0-1) | Confirm schema enforcement rejects hallucinated params | `Validate SPECKIT_STRICT_SCHEMAS enforcement. Capture the evidence needed to prove Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise user-facing pass/fail verdict with the main reason.` | 1) call any MCP tool with an extra unknown parameter (e.g., `memory_search({query:"test", bogus:1})`) 2) verify Zod strict error is returned 3) set `SPECKIT_STRICT_SCHEMAS=false` and confirm `.passthrough()` allows the extra param 4) verify validation runs per-tool in handler, not duplicated at server dispatch | Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer | Tool outputs + Zod error messages | PASS if strict mode rejects unknown params and passthrough mode allows them | Inspect `tool-schemas.ts` for `.strict()` vs `.passthrough()` branching |
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md:29:| 171 | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | Verify calibrated bonus replaces flat convergence bonus in RRF fusion | `Test the default-on SPECKIT_CALIBRATED_OVERLAP_BONUS behavior. Run a multi-channel search producing overlapping results and verify calibrated bonus with beta=0.15 and cap=0.06 replaces the flat 0.10 bonus. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_CALIBRATED_OVERLAP_BONUS` is unset or `true` 2) `memory_search({ query: "query producing multi-channel overlap" })` 3) Inspect fuseResultsMulti() output for calibrated bonus values 4) Verify bonus <= 0.06 5) Set flag to `false`, re-run, verify flat 0.10 bonus applied | isCalibratedOverlapBonusEnabled() returns true; bonus uses beta=0.15 scaling with mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; falls back to CONVERGENCE_BONUS=0.10 when OFF | fuseResultsMulti() output scores + bonus breakdown + test transcript | PASS if calibrated bonus applied with correct beta=0.15 and cap=0.06 for overlapping results; FAIL if flat 0.10 bonus applied, bonus exceeds cap, or flag defaults OFF | Verify isCalibratedOverlapBonusEnabled() → Confirm flag is not forced off → Check CALIBRATED_OVERLAP_BETA=0.15 constant → Verify CALIBRATED_OVERLAP_MAX=0.06 cap → Inspect fuseResultsMulti() overlap detection logic |
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/116-chunking-safe-swap-atomicity-p0-6.md:29:| 116 | Chunking safe swap atomicity (P0-6) | Verify re-chunking stages replacements before delete, cleans staged replacements on finalize failure, and preserves old state on rollback | `"Re-chunk a parent memory and verify safe-swap finalization stays atomic." Capture the evidence needed to prove New chunks index in staged state before old deletion; finalization moves parent attach + old-child unlink/delete into one transaction; failed finalization cleans the staged chunk tree; all-chunks-failed rollback preserves old children and the old parent BM25 state. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Create a parent memory with child chunks via `memory_save()`. 1) Trigger re-chunk on the parent 2) Verify new chunks are staged with `parent_id IS NULL` before finalize 3) Verify finalize links new chunks, updates the parent, nulls old-child `parent_id`, and deletes old children in one transaction 4) Inject finalize failure and verify staged replacement chunks are deleted while old children keep the original parent link 5) Simulate all-chunks-failed indexing and verify the old parent BM25 document remains in place | New chunks indexed in staged state before old deletion; old children keep original linkage on finalize failure; staged replacement chunks are cleaned on finalize failure; all-chunks-failed rollback preserves old parent BM25 state; handler returns error status on failure | Re-chunk output + staged chunk evidence + old-child linkage snapshot + staged chunk cleanup evidence + BM25 parent verification after forced failure | PASS if new chunks are staged before deletion, finalize failure leaves no staged residue, old children survive both finalize failure and all-chunks-failed rollback, and parent BM25 is unchanged until finalize completes | Inspect chunking orchestrator finalize transaction; verify `parent_id` unlink happens inside the transaction; check rollback/cleanup path for staged chunks; verify parent BM25 mutation happens after chunk success/finalize only |
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md:29:| 118 | Stage-2 score field synchronization (P0-8) | Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting | `Run a non-hybrid search with intent weighting and verify score fields stay synchronized. Capture the evidence needed to prove intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Memory database with varied content. 1) Call `memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true })` targeting non-hybrid flow 2) Inspect trace: verify `intentAdjustedScore` is set at Step 4 3) Verify subsequent artifact routing and feedback signals modify `score` 4) Verify final `intentAdjustedScore >= score` (Math.max sync applied) 5) Verify `resolveEffectiveScore()` returns the synchronized value | intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value | Search trace output showing score field progression through pipeline stages | PASS if intentAdjustedScore is synchronized with score via Math.max and resolveEffectiveScore returns the correct final value | Inspect stage-2 intent weighting logic; verify Math.max sync placement; check resolveEffectiveScore fallback chain for non-hybrid flow |
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:314:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:315:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/163-query-surrogates-speckit-query-surrogates.md:29:| 163 | Query surrogates (SPECKIT_QUERY_SURROGATES) | Verify surrogates generated and matched | `Test SPECKIT_QUERY_SURROGATES=true. Save a memory, verify surrogates generated at index time, then search using alias terms and verify matching boost scores. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_QUERY_SURROGATES=true` 2) `memory_save({ ... })` with content containing abbreviations and headings 3) Inspect stored SurrogateMetadata 4) `memory_search({ query: "abbreviation term" })` 5) Verify SurrogateMatchResult 6) `npx vitest run tests/query-surrogates.vitest.ts` | SurrogateMetadata with aliases, headings, summary, surrogateQuestions; query matching returns score > MIN_MATCH_THRESHOLD; no LLM calls | SurrogateMetadata output + SurrogateMatchResult + test transcript | PASS if surrogates generated and matching returns boost scores; FAIL if surrogates empty or matching returns zero for known terms | Verify isQuerySurrogatesEnabled() → Check extractAliases() for parenthetical patterns → Inspect MAX_SURROGATE_QUESTIONS (5) → Verify MIN_MATCH_THRESHOLD (0.15) → Check MAX_SUMMARY_LENGTH (200) |
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/162-hyde-speckit-hyde.md:29:| 162 | HyDE (SPECKIT_HYDE) | Verify HyDE pseudo-document generated | `Test SPECKIT_HYDE=true with deep mode on low-confidence queries. Verify pseudo-document generation and active merge (default). Then set SPECKIT_HYDE_ACTIVE=false and verify shadow-only behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_HYDE=true` 2) `memory_search({ query: "obscure topic with few matches", mode: "deep" })` 3) Inspect HyDEResult for pseudoDocument + embedding 4) Verify active merge (default, SPECKIT_HYDE_ACTIVE is ON) 5) Set `SPECKIT_HYDE_ACTIVE=false`, verify shadow-only (logged, not merged) 6) Check LLM cache populated | HyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared | HyDEResult output + merge verification + shadow log + cache key verification | PASS if pseudo-document generated for low-confidence query, merged by default, and shadow-only with SPECKIT_HYDE_ACTIVE=false; FAIL if no generation or merge behavior mismatches flag state | Verify isHyDEEnabled() → Check LOW_CONFIDENCE_THRESHOLD (0.45) → Inspect baseline result scores → Verify getLlmCache() key → Check HYDE_TIMEOUT_MS (8000) → Verify isHyDEActive() gate |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md:29:| 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | Verify shadow-only implicit feedback event ledger records 5 event types | `Test the default-on SPECKIT_IMPLICIT_FEEDBACK_LOG behavior. Trigger all 5 feedback event types and verify confidence tier assignment. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_IMPLICIT_FEEDBACK_LOG` is unset or `true` 2) `memory_search({ query: "test query" })` — triggers search_shown 3) Cite a result — triggers result_cited 4) Reformulate query — triggers query_reformulated 5) Re-search same topic — triggers same_topic_requery 6) Use follow-on tool — triggers follow_on_tool_use 7) Query feedback ledger for recorded events 8) Verify shadow-only (no ranking changes) | isImplicitFeedbackLogEnabled() returns true; 5 event types stored with type/memory_id/query_id/confidence/timestamp/session_id; resolveConfidence() maps: result_cited→strong, follow_on_tool_use→strong, query_reformulated→medium, search_shown→weak, same_topic_requery→weak; shadow-only | Feedback ledger query results + event type/confidence pairs + ranking comparison (before/after) + test transcript | PASS if all 5 event types recorded with correct confidence tiers and no ranking side effects; FAIL if event types missing, confidence tiers wrong, or events influence rankings | Verify isImplicitFeedbackLogEnabled() → Confirm flag is not forced off → Check feedback-ledger.ts schema creation → Inspect resolveConfidence() tier mapping → Verify shadow-only constraint (no ranking integration) |
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
.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/118-error-response-credential-sanitization.md:29:| 118 | Error response credential sanitization | Verify credentials stripped from error responses | `Trigger a provider error by using an invalid API key, then inspect the error response for leaked credentials. Verify that sk-*, voy_*, Bearer tokens, and key= patterns are replaced with [REDACTED] in summary, data.error, and data.details (including nested objects and arrays). Return a concise pass/fail verdict.` | 1) Set invalid VOYAGE_API_KEY or OPENAI_API_KEY 2) Call memory_search to trigger provider error 3) Inspect response.summary, response.data.error, response.data.details | All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects sanitized | Error response JSON showing [REDACTED] replacements + preserved error codes | PASS if no credential patterns survive in any field of the error response envelope | Check sanitizeErrorField regex patterns; verify sanitizeDetails recursion depth; check for new credential formats not yet covered |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/179-empty-result-recovery-speckit-empty-result-recovery-v1.md:29:| 179 | Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) | Verify structured recovery payloads for empty/weak search results | `Test the default-on SPECKIT_EMPTY_RESULT_RECOVERY_V1 behavior. Trigger all 3 recovery statuses and verify structured payloads. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_EMPTY_RESULT_RECOVERY_V1` is unset or `true` 2) `memory_search({ query: "completely nonexistent topic xyzzy" })` — triggers no_results 3) Search for vague/low-signal query — triggers low_confidence 4) Search with narrow specFolder filter — triggers partial 5) Inspect recovery payload for each: status, reason, actions, alternative queries | Recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3 | Recovery payload JSON per status + root cause + action list + alternative queries + test transcript | PASS if all 3 statuses produce structured payloads with reason, actions, and alternatives; FAIL if status missing, payload fields incomplete, or thresholds incorrect | Verify recovery-payload.ts module loaded → Confirm flag is not forced off → Check DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4 → Verify PARTIAL_RESULT_MIN=3 → Inspect reason inference logic → Check alternative query generation |
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/173-query-decomposition-speckit-query-decomposition.md:29:| 173 | Query decomposition (SPECKIT_QUERY_DECOMPOSITION) | Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries | `Test the default-on SPECKIT_QUERY_DECOMPOSITION behavior in deep mode. Run a multi-faceted query and verify decomposition into max 3 sub-queries. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true` 2) `memory_search({ query: "What is the memory save workflow and how does query expansion work?", mode: "deep" })` 3) Inspect decomposition output for sub-queries 4) Verify sub-query count <= 3 5) Run same query in non-deep mode, verify no decomposition | isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error | Decomposed sub-query list + retrieval results per facet + test transcript | PASS if multi-faceted query decomposes into <= 3 focused sub-queries in deep mode using rule-based heuristics; FAIL if > 3 sub-queries, runs outside deep mode, uses LLM, or fails without fallback | Verify isQueryDecompositionEnabled() → Confirm flag is not forced off → Check MAX_FACETS=3 constant → Inspect conjunction splitting regex → Verify deep-mode gate in stage1-candidate-gen → Check graceful fallback path |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/167-response-profile-v1-speckit-response-profile-v1.md:29:| 167 | Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) | Verify quick profile reduced response shape | `Test SPECKIT_RESPONSE_PROFILE_V1=true with profile=quick. Verify topResult, oneLineWhy, omittedCount, and tokenReduction shape. Test other profiles for expected shapes. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_RESPONSE_PROFILE_V1=true` 2) `memory_search({ query: "test profiles", profile: "quick" })` 3) Verify QuickProfile shape 4) Re-run with profile=research, verify ResearchProfile 5) Re-run with profile=resume, verify ResumeProfile | quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF | Response JSON per profile + token savings calculation | PASS if each profile shape correct and full response when flag OFF; FAIL if shape fields missing or token savings absent | Verify SPECKIT_RESPONSE_PROFILE_V1 env → Inspect profile-formatters.ts profile routing → Check estimateTokens() → Verify QuickProfile.tokenReduction.savingsPercent → Check fallback for unknown profile names |
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/174-graph-concept-routing-speckit-graph-concept-routing.md:29:| 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | Verify query-time alias matching activates graph channel for matched concepts | `Test the default-on SPECKIT_GRAPH_CONCEPT_ROUTING behavior. Run a query with indirect concept references and verify graph channel activation via alias matching. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_GRAPH_CONCEPT_ROUTING` is unset or `true` 2) `memory_search({ query: "how does memory decay work" })` 3) Inspect entity-linker output for noun phrase extraction 4) Verify alias table matching returns canonical concepts 5) Confirm graph channel activated for matched concepts in stage1-candidate-gen | isGraphConceptRoutingEnabled() returns true; noun phrases extracted from query; alias table consulted in SQLite; canonical concept names returned; graph channel activated for matched concepts | Entity linker output + concept matches + graph channel activation log + test transcript | PASS if indirect concept references activate graph channel via noun phrase extraction and alias matching; FAIL if noun phrases not extracted, alias table skipped, or graph channel not activated | Verify isGraphConceptRoutingEnabled() → Confirm flag is not forced off → Check entity-linker.ts noun phrase extraction → Inspect alias table in SQLite → Verify stage1-candidate-gen graph channel activation logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/002-chunk-collapse-deduplication-g3.md:29:| 002 | Chunk collapse deduplication (G3) | Confirm dedup in default mode | `Validate chunk collapse deduplication (G3) in default search mode. Capture the evidence needed to prove No duplicate memory IDs in results; collapsed chunks yield unique parents only. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save multi-chunk overlap 2) `memory_search(includeContent:false)` 3) Verify no duplicates | No duplicate memory IDs in results; collapsed chunks yield unique parents only | Search output with result IDs + dedup count before/after collapse | PASS: Zero duplicate parent IDs in collapsed results; FAIL: Same parent ID appears >1 time in output | Check chunk parentId linkage → Verify dedup runs after collapse stage → Inspect includeContent flag behavior |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:25:  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/169-session-retrieval-state-v1-speckit-session-retrieval-state-v1.md:29:| 169 | Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) | Verify additive session metadata on session-aware searches | `Run 2 searches in the same session, verify data.sessionState and data.goalRefinement are returned, and check follow-up behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] })` 2) Inspect `data.sessionState` and `data.goalRefinement` 3) `memory_search({ query: "related second search", sessionId: "test-session" })` 4) Verify session metadata persists and follow-up behavior is visible 5) `npx vitest run tests/session-state.vitest.ts tests/memory-search-ux-hooks.vitest.ts` | `data.sessionState` with activeGoal/seenResultIds/preferredAnchors; `data.goalRefinement` with activeGoal/applied; follow-up search can deprioritize seen results; session TTL 30 min; LRU at 100 sessions | Response JSON before/after follow-up + test transcript | PASS if session metadata is present and follow-up behavior is visible; FAIL if metadata is missing or session context is ignored | Verify isSessionRetrievalStateEnabled() → Check SessionStateManager.getOrCreate() → Inspect SEEN_DEDUP_FACTOR (0.3) → Verify seenResultIds tracking → Check SESSION_TTL_MS (1800000) → Verify MAX_SESSIONS (100) LRU |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/111-deferred-lexical-only-indexing.md:29:| 111 | Deferred lexical-only indexing | Confirm embedding-failure fallback and BM25 searchability | `Validate deferred lexical-only indexing fallback. Capture the evidence needed to prove Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex. Return a concise user-facing pass/fail verdict with the main reason.` | 1) simulate embedding failure (e.g., set invalid `OPENAI_API_KEY`) 2) `memory_save(filePath)` → verify memory saved with `embedding_status='pending'` 3) `memory_search({query:"<title of saved memory>"})` → verify BM25/FTS5 retrieval works (lexical match) 4) restore valid API key 5) run `node cli.js reindex` → verify `embedding_status` transitions to `'success'` and `retry_count` increments 6) `memory_search({query:"<semantic query>"})` → verify vector search now works | Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex | Save output showing pending status + lexical search result + reindex output + post-reindex semantic search result | PASS if embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding | Verify embedding_status column exists in schema; check BM25/FTS5 index includes pending memories; inspect reindex retry logic and retry_count tracking |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/213-mutation-response-ux-payload-exposure.md:29:| 213 | Mutation response UX payload exposure | Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata | `Validate mutation response UX payload exposure on successful save paths. Capture the evidence needed to prove standard and atomic save success responses expose typed postMutationHooks fields, while duplicate or unchanged no-op paths omit false hook metadata and report caches-left-unchanged guidance instead. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts` 2) inspect assertions covering successful `memory_save` and `atomicSaveMemory` responses with typed `postMutationHooks` fields 3) inspect assertions covering duplicate-content and unchanged/no-op suppression of false UX payloads | Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance | Test transcript + highlighted assertion names or output snippets showing success-payload and no-op suppression coverage | PASS if the save-path suite passes and the assertions prove success responses expose the UX payload contract while no-op responses suppress false hook metadata | Inspect `handlers/save/response-builder.ts`, `hooks/mutation-feedback.ts`, and response-envelope formatting if payload fields drift |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:19:- Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:20:- Expected signals: description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:29:| 042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Corrupt description.json with invalid JSON and schema-invalid field types → run generateFolderDescriptions() and verify spec.md fallback plus repaired description.json 6) Verify missing description.json falls back to spec.md without forcing a write 7) Attempt generation against an out-of-base or prefix-bypass path → verify rejection and no file written 8) Use spec.md with large YAML frontmatter and CRLF-heavy line endings → verify extracted description comes from post-frontmatter content 9) Run memory_context query → verify short-circuit folder routing | description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files | description.json content + stale detection output + folder routing trace in memory_context + recovery evidence for corrupt/schema-invalid description.json files + missing-file fallback evidence + rejection evidence for traversal attempts + proof of valid regenerated JSON with no leftover temp files | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails | Verify create.sh generates description.json → Check stale detection mtime comparison → Inspect generateFolderDescriptions preference logic and repair path → Confirm missing-file fallback does not backfill unexpectedly → Verify realpath containment rejects traversal/prefix-bypass paths → Confirm frontmatter stripping happens before description extraction → Verify memory_context folder routing |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/180-result-confidence-speckit-result-confidence-v1.md:29:| 180 | Result confidence (SPECKIT_RESULT_CONFIDENCE_V1) | Verify per-result calibrated confidence with 4-factor weighting | `Test the default-on SPECKIT_RESULT_CONFIDENCE_V1 behavior. Run a search and verify 4-factor weighted confidence scoring with high/medium/low labels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_RESULT_CONFIDENCE_V1` is unset or `true` 2) `memory_search({ query: "well-covered topic with multiple memories" })` 3) Inspect per-result confidence scores and labels 4) Verify 4-factor weights: margin=0.35, channel_agreement=0.30, reranker=0.20, anchor_density=0.15 5) Check confidence drivers reported per result 6) Verify labels: score >= 0.7 → high, < 0.4 → low, else → medium 7) Confirm requestQuality label (good/weak/gap) | Per-result confidence score computed; 4 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM | Per-result confidence output + factor breakdown + label assignments + driver lists + requestQuality + test transcript | PASS if 4-factor weighted confidence produces correct scores, labels match thresholds, and drivers reported; FAIL if weights wrong, thresholds incorrect, labels missing, or LLM used | Verify confidence-scoring.ts module loaded → Confirm flag is not forced off → Check factor weights (0.35/0.30/0.20/0.15) → Inspect HIGH_THRESHOLD=0.7 and LOW_THRESHOLD=0.4 → Verify driver detection logic → Check requestQuality computation |
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/161-llm-reformulation-speckit-llm-reformulation.md:29:| 161 | LLM reformulation (SPECKIT_LLM_REFORMULATION) | Verify reformulation pipeline runs in deep mode | `Run a deep-mode search and verify step-back abstract and corpus-grounded variants are produced. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "complex multi-faceted query", mode: "deep" })` 2) Inspect reformulation output for abstract + variants 3) Verify cache populated 4) Re-run same query, verify cache hit | cheapSeedRetrieve() returns FTS5/BM25 seeds; abstract >= 5 chars; variants array max 2; LLM cache hit on repeat; no-op in non-deep mode | ReformulationResult output + cache hit log + test transcript | PASS if reformulation produces valid abstract + variants in deep mode and skips in non-deep; FAIL if abstract empty, variants > 2, or runs outside deep mode | Verify isLlmReformulationEnabled() → Check LLM_REFORMULATION_ENDPOINT configured → Inspect cheapSeedRetrieve() for FTS5 results → Verify normalizeQuery() cache key → Check REFORMULATION_TIMEOUT_MS (8000) |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/006-session-enrichment-and-alignment-guardrails.md:24:  - `memory_search({ query: "session enrichment alignment", specFolder: "specs/<target-spec>" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md:19:- Prompt: `Run a search returning > 5 results and verify the response preserves full data.results while adding data.progressiveDisclosure with summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor. Then use memory_search({ cursor }) to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove the additive disclosure contract. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md:29:| 168 | Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) | Verify additive disclosure payload and cursor pagination | `Search with > 5 results, verify full results remain present plus data.progressiveDisclosure, then use cursor for next page. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "broad query", limit: 20 })` 2) Verify full `data.results` remains present 3) Verify `data.progressiveDisclosure` shape 4) Extract continuation cursor 5) Re-request with `memory_search({ cursor })` for next page 6) `npx vitest run tests/progressive-disclosure.vitest.ts tests/memory-search-ux-hooks.vitest.ts` | full `data.results`; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min | Response JSON + pagination test with cursor + test transcript | PASS if full results are preserved and disclosure metadata + cursor pagination work; FAIL if results are replaced by snippets or disclosure metadata is missing | Verify SPECKIT_PROGRESSIVE_DISCLOSURE_V1 env → Check DEFAULT_PAGE_SIZE (5) → Inspect SNIPPET_MAX_LENGTH (100) → Verify hashQuery() cursor key → Check DEFAULT_CURSOR_TTL_MS (300000) → Inspect cursorStore map |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md:29:| 041 | Pre-flight token budget validation (PI-A3) | Confirm save-time preflight warn/fail behavior | `Verify pre-flight token budget validation (PI-A3). Capture the evidence needed to prove Token estimate is computed before embedding/database writes; near-limit input emits PF021 warning; over-limit input emits PF020 failure; behavior follows MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, and MCP_TOKEN_WARNING_THRESHOLD. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare memory files near and over the save-time token limit 2) Run `memory_save({filePath:"<sandbox-file>", dryRun:true})` or the equivalent save preflight path 3) Verify warning/failure payloads from `preflight.ts` | Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD` | Preflight response payloads showing estimated tokens, warning/failure codes, and env-sensitive thresholds | PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior | Verify `preflight.ts` token counting math → Check `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD` wiring → Inspect dry-run/save preflight behavior |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/178-save-quality-gate-exceptions-speckit-save-quality-gate-exceptions.md:29:| 178 | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) | Verify short-critical quality gate exception for decision documents with structural signals | `Test the default-on SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS behavior. Save a short decision document and verify it bypasses the 50-char minimum. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` is unset or `true` 2) `memory_save({ title: "Chose SQLite over PostgreSQL", content: "Embedded deployment decision", context_type: "decision", anchors: ["architecture", "database"] })` 3) Verify save succeeds despite content < 50 chars 4) Save same content with context_type=general, verify rejection 5) Save decision with only 1 structural signal, verify rejection | isSaveQualityGateExceptionsEnabled() returns true; decision + >= 2 structural signals → bypass MIN_CONTENT_LENGTH=50; non-decision types rejected; < 2 signals rejected; Layer 1/2/3 validation still runs for other checks | Save result (pass/warn/reject) + structural signal count + quality gate layer outputs + test transcript | PASS if short decision with >= 2 structural signals bypasses length check; FAIL if decision rejected despite signals, non-decision bypasses, or < 2 signals allow bypass | Verify isSaveQualityGateExceptionsEnabled() → Confirm flag is not forced off → Check SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS=2 → Inspect structural signal detection logic → Verify MIN_CONTENT_LENGTH=50 bypass path → Check Layer 1 exception routing |
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/158-graph-calibration-profile-speckit-graph-calibration-profile.md:29:| 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | Verify graph weight cap and community score capping | `Test SPECKIT_GRAPH_CALIBRATION_PROFILE=true. Run a search with graph signals active and verify graph weight contribution is capped at 0.05 and community scoring boost is capped at 0.03. Capture the evidence needed to prove cap enforcement and Louvain threshold gating. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_GRAPH_CALIBRATION_PROFILE=true` 2) `memory_search({ query: "test calibration", mode: "deep" })` 3) Inspect Stage 2 graph weight contribution 4) `npx vitest run tests/graph-calibration.vitest.ts` | applyGraphWeightCap() clamps to [0, 0.05]; applyCommunityScoring() caps at 0.03; shouldActivateLouvain() respects thresholds; calibrateGraphWeight() enforces N2a/N2b caps | Test transcript with cap verification + scoring context before/after calibration | PASS if graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced; FAIL if any score exceeds its cap or Louvain activates below threshold | Verify isGraphCalibrationEnabled() → Check loadCalibrationProfile() env overrides → Inspect GRAPH_WEIGHT_CAP constant (0.05) → Verify COMMUNITY_SCORE_CAP constant (0.03) → Check Louvain minDensity (0.3) and minSize (10) |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md:29:| 166 | Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) | Verify why.summary + topSignals in results | `Test SPECKIT_RESULT_EXPLAIN_V1=true. Run a search, verify why.summary and topSignals on each result. Test debug mode for channelContribution. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_RESULT_EXPLAIN_V1=true` 2) `memory_search({ query: "test explainability" })` 3) Inspect each result for why.summary + why.topSignals 4) Re-run with debug.enabled=true 5) Verify channelContribution present in debug mode | why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF | Result JSON with why field + debug channelContribution | PASS if slim tier present and debug tier includes channelContribution; FAIL if summary missing, topSignals empty, or channelContribution leaks in non-debug | Verify isResultExplainEnabled() → Inspect extractSignals() for PipelineRow → Check resolveEffectiveScore() → Verify channelAttribution detection → Check SignalLabel types |
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/120-unified-graph-rollback-and-explainability-phase-3.md:29:| 120 | Unified graph rollback and explainability (Phase 3) | Confirm graph kill switch removes graph-side effects while traces still explain enabled runs | `Validate Phase 3 graph rollback and explainability. Capture the evidence needed to prove When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; the graph FTS query materializes matched rowids once in a CTE, expands via UNION ALL source/target edge lookups, and avoids JS-side dedup; when disabled, graph-side effects are absent and baseline ordering remains deterministic. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_search({ query:"graph rollout check", includeTrace:true })` with graph rollout enabled 2) Capture SQL/query-plan evidence that the graph FTS path uses a matched-memory CTE plus `UNION ALL` source/target edge lookups and SQL-side duplicate collapse 3) Repeat the enabled query to confirm deterministic ordering and cached FTS availability behavior 4) Set `SPECKIT_GRAPH_UNIFIED=false` 5) Repeat query 6) Verify graph contribution counters drop to zero and ordering stays stable | When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; graph FTS path uses a CTE with SQL-side dedup and cached FTS-table availability; when disabled, graph-side effects are absent and baseline ordering remains deterministic | Search output + trace payloads for enabled/disabled runs + SQL/query-plan evidence for the CTE path + repeated query ordering comparison | PASS: Enabled trace shows graph contributions, enabled query evidence shows the CTE/UNION ALL path with SQL-side dedup and cached FTS availability, disabled trace shows kill-switch baseline parity, repeated runs preserve exact ordering; FAIL: Graph effects remain after disable, CTE path regresses to OR-join or JS dedup, or repeated runs reorder ties | Verify `SPECKIT_GRAPH_UNIFIED` propagation into Stage 2 → Inspect `graphContribution` trace metadata → Inspect graph query shape for CTE materialization and SQL-side dedup → Re-run identical query to confirm tie-break stability and cached FTS availability |
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
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:2:title: "133 -- Dry-run preflight for memory_save"
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:3:description: "This scenario validates Dry-run preflight for memory_save for `133`. It focuses on Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects."
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:6:# 133 -- Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:10:This scenario validates Dry-run preflight for memory_save for `133`. It focuses on Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:19:- Prompt: `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:29:| 133 | Dry-run preflight for memory_save | Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects | `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a rich sandbox memory file and a thin sandbox memory file 2) `memory_stats()` and capture baseline totals 3) `memory_save({filePath:"<thin-sandbox-file>", dryRun:true})` and verify preflight details, `qualityLoop`, `sufficiency`, and `rejectionCode:"INSUFFICIENT_CONTEXT_ABORT"` 4) `memory_stats()` and `memory_search({query:"<thin title>"})` to verify no new indexed record from dry-run 5) `memory_save({filePath:"<thin-sandbox-file>", force:true})` and verify it still rejects before indexing 6) `memory_save({filePath:"<rich-sandbox-file>", dryRun:true})` and verify `would_pass:true` with no side effects 7) `memory_save({filePath:"<rich-sandbox-file>", dryRun:false})` and verify the memory becomes searchable | Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file | Dry-run responses for thin and rich files + before/after stats + search outputs + non-dry-run save output | PASS if dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable | Inspect `handlers/memory-save.ts` dryRun and insufficiency branches, `shared/parsing/memory-sufficiency.ts`, `handlers/quality-loop.ts`, and `lib/validation/preflight.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/122-governed-ingest-and-scope-isolation-phase-5.md:29:| 122 | Governed ingest and scope isolation (Phase 5) | Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage | `Validate Phase 5 governed ingest and retrieval isolation. Capture the evidence needed to prove agentId,sessionId,provenanceSource,provenanceActor} metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review governance_audit rows. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Attempt `memory_save()` with `tenantId/sessionId` but missing provenance fields and verify rejection 2) Save with full `{tenantId,userId | agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows | Missing provenance rejects governed ingest; successful governed ingest persists scope metadata; mismatched scope cannot retrieve the memory; allow/deny decisions are written to `governance_audit` | Save/search outputs + DB query of scoped columns + audit rows showing allow/deny decisions | PASS: Missing provenance rejected, valid governed save succeeds, cross-scope retrieval returns no hit, and audit rows exist; FAIL: Ungoverned save slips through or cross-scope retrieval leaks data |
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/156-graph-refresh-mode-speckit-graph-refresh-mode.md:29:| 156 | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) | Verify dirty-node tracking fires in write_local mode | `Test SPECKIT_GRAPH_REFRESH_MODE=write_local. Save a memory with entity edges, then verify dirty-node tracking and local recompute execute. Capture the evidence needed to prove markDirty() populates the dirty-node set and recomputeLocal() runs for small components. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_GRAPH_REFRESH_MODE=write_local` 2) `memory_save({ ... })` with content containing entity relationships 3) Verify `onWrite()` return shape 4) `npx vitest run tests/graph-lifecycle.vitest.ts` | markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute | GraphRefreshResult output with mode='write_local', dirtyNodes >= 1, localRecomputed=true + test transcript | PASS if onWrite() returns mode='write_local', localRecomputed=true, dirtyNodes >= 1, and skipped=false; FAIL if dirty-node set remains empty or localRecomputed=false | Check resolveGraphRefreshMode() → Verify SPECKIT_GRAPH_REFRESH_MODE env is set → Inspect markDirty() input nodeIds → Check estimateComponentSize() threshold (default 50) |
.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md:2:title: "EX-013 -- Health diagnostics (memory_health)"
.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md:3:description: "This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check."
.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md:6:# EX-013 -- Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md:10:This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check.
.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md:29:| EX-013 | Health diagnostics (memory_health) | Index/FTS integrity check | `Run full health and divergent_aliases. Capture the evidence needed to prove healthy/degraded status and diagnostics. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_health(reportMode:full)` -> `memory_health(reportMode:divergent_aliases)` | healthy/degraded status and diagnostics | Health outputs | PASS if report completes with actionable diagnostics | Run index_scan(force) if FTS mismatch |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:27:  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:29:  - `memory_search({ query: "<key term from agent session>", specFolder: "specs/<target-spec>" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:31:- Evidence: agent stdout with memory section + generate-context output + search result showing saved memory.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:33:- Fail triage: Check memory epilogue in prompt template → Verify generate-context.js JSON mode input → Inspect agent stdout for structured section → Verify index scan ran post-save.
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:37:2. Run: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:42:2. Run generate-context.js with the JSON file
.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/145-contextual-tree-injection-p1-4.md:29:| 145 | Contextual tree injection (P1-4) | Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled | `Validate contextual tree injection header format and flag toggle. Capture the evidence needed to prove Enabled: results with spec-folder paths have [parent > child — description] headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 })` with `SPECKIT_CONTEXT_HEADERS=true` (default) 2) Verify results with spec-folder file paths have a `[parent > child — desc]` header prepended to content 3) Verify header is truncated at 100 characters 4) Restart with `SPECKIT_CONTEXT_HEADERS=false` and repeat search 5) Verify no contextual headers are prepended | Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged | Search outputs with and without flag + header format verification | PASS if enabled mode injects correctly formatted headers and disabled mode skips injection entirely | Inspect `lib/search/hybrid-search.ts` `injectContextualTree`, `lib/search/search-flags.ts` `isContextHeadersEnabled`, and description cache population |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:29:  - When no cached payload exists, fallback output instructs calling `memory_context({ mode: "resume" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:42:| 249c | SessionStart priming (compact) | Fallback when no cached payload exists | `Validate 249c compact fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout contains "Context Recovery" section instructing `memory_context({ mode: "resume" })` | Test output showing fallback message | PASS if fallback message appears when pendingCompactPrime is null | Verify test fixture simulates missing cache state |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:16:- **Objective**: Verify that the context-metrics module correctly tracks session events (tool_call, memory_recovery, code_graph_query, spec_folder_change) and computes QualityScore with 4 weighted factors. The recency factor must decay over time (1.0 for recent, lower as time passes). The recovery factor must be 1.0 after a memory_recovery event. The graphFreshness factor must reflect actual code graph state (1.0 fresh, 0.5 stale, 0.0 empty). The continuity factor must decrease on spec folder transitions. The composite score must map to quality levels: healthy (>= 0.7), degraded (>= 0.4), critical (< 0.4).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:20:- **Prompt**: `Validate 266 Context metrics. Make several tool calls and check quality scoring: (1) call memory_stats to register a tool_call event, (2) call session_health and verify recency factor is close to 1.0, (3) call memory_context with mode=resume to register memory_recovery, (4) call session_health and verify recovery factor is 1.0, (5) verify composite score maps to correct quality level.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:38:| 266b | Context preservation metrics | Memory recovery tracked and factor updated | `Validate 266b recovery tracking` | Call `memory_context({ mode: "resume" })` then `session_health({})` | recovery factor === 1.0 | session_health response qualityScore.factors.recovery | PASS if recovery factor is 1.0 after resume call | Check memory_recovery event recording and factor computation |
.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/096-provenance-rich-response-envelopes-p0-2.md:29:| 096 | Provenance-rich response envelopes (P0-2) | Confirm includeTrace opt-in exposes scores/source/trace | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior. Capture the evidence needed to prove Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before running the "absent" assertion (env var forces trace inclusion regardless of arg). 1) `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects in response 2) `memory_search({query:"test"})` (no includeTrace, env unset) → verify these objects are absent 3) set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear due to env override 4) inspect score fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention | Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields | Search outputs with/without includeTrace + env override | PASS if trace objects present when opt-in or env-forced and absent otherwise | Check `handlers/memory-search.ts` for includeTrace and env branching |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:2:title: "264 -- Query-intent routing in memory_context"
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:6:# 264 -- Query-intent routing in memory_context
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:10:This scenario validates Query-intent routing in memory_context.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:16:- **Objective**: Verify that memory_context auto-routes queries based on the query-intent classifier. Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend. Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline. Hybrid queries must trigger both backends and merge results. The classifier confidence score and matched keywords must be available in the response metadata.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:20:- **Prompt**: `Validate 264 Query-intent routing. Send three queries to memory_context: (1) a structural query like "what functions call handleMemoryContext", (2) a semantic query like "find examples of error handling patterns", (3) a hybrid query like "find all validation functions and explain their approach". Confirm: (1) structural query returns code graph results, (2) semantic query returns memory/CocoIndex results, (3) hybrid query returns merged results from both backends.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:35:| 264a | Query-intent routing | Structural query routes to code graph | `Validate 264a structural routing` | Call `memory_context({ input: "what functions call handleMemoryContext" })` | Response includes code graph data (symbols, edges), intent classified as 'structural' | memory_context response with code graph results | PASS if code graph results present and classifier shows structural intent | Check STRUCTURAL_KEYWORDS in query-intent-classifier.ts and memory_context integration |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:36:| 264b | Query-intent routing | Semantic query routes to memory pipeline | `Validate 264b semantic routing` | Call `memory_context({ input: "find examples of error handling patterns" })` | Response includes memory hits with similarity scores, intent classified as 'semantic' | memory_context response with memory results | PASS if memory/semantic results present and classifier shows semantic intent | Check SEMANTIC_KEYWORDS and memory_context fallback path |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:37:| 264c | Query-intent routing | Hybrid query merges both backends | `Validate 264c hybrid routing` | Call `memory_context({ input: "find all validation functions and explain their approach" })` | Response includes both code graph and memory results, intent classified as 'hybrid' | memory_context response with merged results | PASS if both backends contribute results | Check hybrid scoring threshold and merge logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:39:| 261d | MCP auto-priming | Session-scoped priming isolation | `Validate 261d session-scoped priming isolation` | Call `memory_context({ input: "prime A", sessionId: "prime-session-a" })`; then in a fresh second MCP session call `memory_context({ input: "prime B", sessionId: "prime-session-b" })` | Each session receives its own first-call PrimePackage because priming is tracked per explicit session identity | Two MCP response envelopes showing independent primePackage delivery for session A and session B | PASS if the second session receives its own PrimePackage independently of the first session | Check `hooks/memory-surface.ts` session-scoped priming set and session identity propagation |
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
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:16:- **Objective**: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`), CocoIndex Code availability status, Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`), and resume instructions. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:21:- **Prompt**: `Validate 250 SessionStart priming (startup) behavior. Run the vitest suite for hook-session-start and confirm: (1) source=startup routes to handleStartup(), (2) stdout contains "Session Priming" section, (3) memory tools listed (memory_context, memory_match_triggers, memory_search), (4) CocoIndex availability checked via checkCocoIndexAvailable(), (5) Code Graph tools listed, (6) resume instructions present, (7) output within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:25:  - Body mentions `memory_context`, `memory_match_triggers`, `memory_search`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:26:  - Body mentions `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:28:  - Resume instruction: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:40:| 250a | SessionStart priming (startup) | Fresh startup outputs Spec Kit Memory tool overview | `Validate 250a startup tool listing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout "Session Priming" section lists `memory_context`, `memory_match_triggers`, `memory_search`, code graph tools | Test output showing tool names in stdout | PASS if all 7+ tools listed in session priming output | Check `session-prime.ts` handleStartup() for expected tool names |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:41:| 267c | Tool routing enforcement | Tool response hints fire on code-search queries | `find function implementations` | `Manual: call memory_search({ query: "find function implementations" })` | Response hints suggest semantic code search via `mcp__cocoindex_code__search` | MCP response hints showing routing recommendation | PASS if a hint explicitly mentions `cocoindex_code__search` | Check `mcp_server/hooks/response-hints.ts` code-search detection patterns and confirm the query is classified as code-search intent |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:43:| 267e | Tool routing enforcement | Context-prime agents include routing table in output | `Validate 267e context-prime routing table` | `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "## Tool Routing|Semantic/concept|code_graph_query|mcp__cocoindex_code__search" .opencode/agent/context-prime.md .claude/agents/context-prime.md .codex/agents/context-prime.md .gemini/agents/context-prime.md` | Context-prime agent files across runtimes include the routing decision table in the Prime Package output format | Grep output showing routing-table lines in all 4 agent files | PASS if routing directives are present in all context-prime agent files | Check for runtime drift between agent copies and restore the shared routing table if one copy fell behind |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:16:- **Objective**: Verify that the code graph SQLite storage (code-graph.sqlite) correctly indexes source files into `code_files`, `code_nodes`, and `code_edges` tables. The structural indexer must extract function declarations, class definitions, and import statements as nodes, and build call/import relationship edges. The 4 MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`) must return correct results. WAL mode and foreign keys must be enabled.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:22:- **Prompt**: `Validate 254 Code graph storage and query behavior. Run the vitest suite for code-graph-indexer and confirm: (1) code_graph_scan indexes files and produces code_files, code_nodes, code_edges rows, (2) function/class/import nodes extracted with correct types, (3) call and import edges built between nodes, (4) code_graph_query returns outline/calls/imports results, (5) code_graph_status returns health metrics (file count, node count, edge count), (6) SQLite WAL mode and foreign keys enabled.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:25:  - `code_graph_scan` populates `code_files` table with indexed file paths and hashes
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:28:  - `code_graph_query` for outline mode returns symbol list for a given file
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:29:  - `code_graph_query` for calls mode returns callers/callees of a symbol
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:30:  - `code_graph_query` for imports mode returns import relationships
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:45:| 254c | Code graph storage and query | Query tools (outline, calls, imports, status) return correct results | `Validate 254c query tools` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | `code_graph_query` returns results for outline/calls/imports modes, `code_graph_status` returns file/node/edge counts | Test output showing query results | PASS if all 4 MCP tool operations return non-empty valid results | Check handler implementations in `handlers/code-graph/` |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:47:| 254e | Code graph storage and query | Symlink boundary validation | `Validate 254e symlink boundary enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/unit-path-security.vitest.ts tests/code-graph-scan.vitest.ts` | `code_graph_scan` canonicalizes `rootDir`, rejects broken or escaping symlinks, and does not index files outside the project root | Vitest output showing symlink escape rejection and scan boundary enforcement | PASS if symlinked external files are NOT indexed and escaping paths are rejected | Check `handlers/code-graph/scan.ts` realpath-based boundary check and `tests/unit-path-security.vitest.ts` for escape scenarios |
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/007-memory-metadata-update-memory-update.md:29:| EX-007 | Memory metadata update (memory_update) | Metadata + re-embed update | `Update memory title and triggers. Capture the evidence needed to prove Updated metadata reflected in retrieval. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_update(id,title,triggers)` -> `memory_search(new title)` | Updated metadata reflected in retrieval | Update output + search | PASS if updated title retrievable | Retry with allowPartialUpdate if embedding fails |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:19:  - Structural: `code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` (`operation` + `subject` are required)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:25:- **Prompt**: `Validate 255 CocoIndex bridge behavior. Confirm: (1) semantic queries route to mcp__cocoindex_code__search and return meaning-based results, (2) structural queries route to code_graph_query and return symbol/edge-based results, (3) seed resolver normalizes CocoIndex file:line to ArtifactRef (exact > enclosing > file anchor), (4) code_graph_context expands in neighborhood/outline/impact modes, (5) results from each system are qualitatively different and appropriate to the query type.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:45:| 255b | CocoIndex bridge | Structural query routes to code_graph and returns edge-based results | `What functions call allocateBudget?` | `Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` | Returns exact caller functions with file paths and line numbers from code_edges table | Code graph query output showing caller/callee relationships | PASS if callers are exact function references from the graph database | Verify code graph is indexed and contains allocateBudget node |
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/008-single-and-folder-delete-memory-delete.md:29:| EX-008 | Single and folder delete (memory_delete) | Atomic single delete | `Delete memory ID and verify removal. Capture the evidence needed to prove Deleted item absent from retrieval. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>")` -> `memory_delete(id)` -> `memory_search(old title)` | Deleted item absent from retrieval | Delete output + search | PASS if deleted item not found and checkpoint exists | Restore `pre-ex008-delete`; verify sandbox folder |
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md:24:  - `memory_save({ filePath:"<sandbox-memory-file>", force:true })`
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md:25:  - `memory_save({ filePath:"<sandbox-memory-file>", force:true })`
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md:26:  - `memory_search({ query:"<unique phrase from sandbox memory>", specFolder:"<sandbox-spec>", includeContent:true, limit:5 })`
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md:2:title: "EX-006 -- Memory indexing (memory_save)"
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md:3:description: "This scenario validates Memory indexing (memory_save) for `EX-006`. It focuses on New memory ingestion."
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md:6:# EX-006 -- Memory indexing (memory_save)
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md:10:This scenario validates Memory indexing (memory_save) for `EX-006`. It focuses on New memory ingestion.
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md:29:| EX-006 | Memory indexing (memory_save) | New memory ingestion | `Index memory file and report action. Capture the evidence needed to prove Save action reported; searchable result appears; no template-contract or insufficiency rejection. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_save(filePath)` -> `memory_stats()` -> `memory_search(title)` | Save action reported; searchable result appears; no template-contract or insufficiency rejection | Save output + follow-up search | PASS if indexed and retrievable and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure | Validate file path/type, rendered anchor/frontmatter shape, and content quality |

web search: 
web search: 
codex
I’ve got the main Mex contract and command flow. I’m drilling into the actual drift and sync implementations now, plus the exact local routing contracts for `memory_context`, `session_bootstrap`, `code_graph_query`, and the CocoIndex bridge so the compatibility findings stay source-backed instead of speculative.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '533,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   533	The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.
   534	
   535	**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
   536	
   537	**Parser:** Tree-sitter WASM is the default parser (JS/TS/Python/Shell). Set `SPECKIT_PARSER=regex` for regex fallback.
   538	
   539	**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '760,1010p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   981	        try {
   982	          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
   983	          if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
   984	            const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
   985	            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
   986	            envelope.hints = existingHints;
   987	            result.content[0].text = JSON.stringify(envelope, null, 2);
   988	          }
   989	        } catch {
   990	          // Response is not JSON envelope — skip hint injection
   991	        }
   992	      }
   993	
   994	      if (queryStr) {
   995	        try {
   996	          const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
   997	          if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
   998	            const meta = typeof envelope.meta === 'object' && envelope.meta !== null && !Array.isArray(envelope.meta)
   999	              ? envelope.meta as Record<string, unknown>
  1000	              : {};
  1001	            const snapshot = getSessionSnapshot();
  1002	            const nudge = meta.structuralRoutingNudge
  1003	              ? null
  1004	              : maybeStructuralNudge(queryStr, {
  1005	                graphReady: snapshot.graphFreshness === 'fresh',
  1006	                activationScaffoldReady: snapshot.primed,
  1007	                surface: 'response-hints',
  1008	              });
  1009	            if (nudge) {
  1010	              injectStructuralRoutingNudge(envelope, nudge);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '160,270p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'for f in path edges index-sync staleness command dependency cross-file script-coverage; do echo "--- $f ---"; nl -ba ".opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/$f.ts" | sed -n '"'1,240p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
--- path ---
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
--- edges ---
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
--- index-sync ---
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
--- staleness ---
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
--- command ---
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
--- dependency ---
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
--- cross-file ---
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
--- script-coverage ---
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
/bin/zsh -lc "rg -n \"query-intent|CocoIndex|code_graph_query|hybrid\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:12:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:155:  // CocoIndex availability
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:158:    cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:5:// code graph status, and CocoIndex availability into a single call.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:9:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:101:interface CocoIndexStatus {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:109:  cocoIndex: CocoIndexStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:462:  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:463:  const cocoIndex: CocoIndexStatus = {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:464:    available: isCocoIndexAvailable(),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:468:    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:541:      title: 'CocoIndex Status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:226:    searchType: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:59: * Falls back to `['hybrid']` if no channels are found.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:85:    channels.add('hybrid');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:8:// Spec: system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:211:    '  neutralising its contribution to hybrid search until R10 is complete.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:15:// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:16:import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1131:  // graph context for structural/hybrid queries. Entire block is
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1149:          : classification.intent === 'hybrid'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1150:            ? 'hybrid'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1184:      } else if (classification.intent === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1197:          // Code graph unavailable — hybrid degrades to semantic-only
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1452:  // Phase 020: Attach graph context and query-intent routing metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849: * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:853:async function hybridSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:891:      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:921:      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:995: * expected by the hybridSearch / hybridSearchEnhanced functions.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317:/** Handle code_graph_query tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:433:          }, readiness, `code_graph_query ${operation} payload`),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:559:          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:2:// MODULE: CocoIndex Status Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:4:// MCP tool handler for ccc_status — reports CocoIndex availability and stats.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:36:              ? 'Install CocoIndex: bash .opencode/skill/mcp-coco-index/scripts/install.sh'
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:39:                : 'CocoIndex is ready. Use mcp__cocoindex_code__search for semantic queries.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:85:  hybridMRR?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:86:  /** BM25/hybrid ratio (relative mode only). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:92: * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:119: * For production use, wire up the FTS5 path from hybrid-search with all
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:147: *     retrieval. Proceed with hybrid search implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:188:      'adds meaningful value. Proceed with hybrid search implementation.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:194:   Compares BM25 MRR@5 as a percentage of hybrid MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:195:   Spec: "BM25 >= 80% of hybrid MRR@5" → PAUSE.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:199: * Evaluate BM25 performance relative to hybrid MRR@5 (spec-compliant).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:202: *   ratio = bm25MRR / hybridMRR
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:205: *     BM25 achieves ≥80% of hybrid — multi-channel adds little value.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:208: *     BM25 achieves 50-79% of hybrid — channels need per-channel evidence.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:211: *     BM25 achieves <50% of hybrid — multi-channel clearly justified.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:214: * @param hybridMRR - Hybrid/multi-channel MRR@5 (must be in (0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:219:  hybridMRR: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:221:  if (!Number.isFinite(bm25MRR) || !Number.isFinite(hybridMRR) || hybridMRR <= 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:224:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:231:        'Defaulting to PROCEED until hybrid baseline is established.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:235:  const ratio = bm25MRR / hybridMRR;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:240:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:246:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:247:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:256:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:262:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:263:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:271:    hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:277:      `BM25 achieves only ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:278:      `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:280:      'Proceed with hybrid search optimization.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:11:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:14:} from '../lib/search/hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:281:      const results = await hybridSearchEnhanced(query, embedding, searchOptions);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:332:  'hybrid search fusion',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:341: * 1. Runs hybridSearchEnhanced for each representative query
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:2:// MODULE: CocoIndex Feedback Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:2:// MODULE: CocoIndex Re-index Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:26:            error: 'CocoIndex binary not found. Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh',
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:2:// MODULE: CocoIndex Path Helper
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:4:// F046/F051: Shared helper for resolving the CocoIndex binary path.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:12:/** Relative path from project root to the CocoIndex CLI binary. */
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:48: * Get the absolute path to the CocoIndex binary.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:51:export function getCocoIndexBinaryPath(): string {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:56: * Check whether the CocoIndex binary exists on disk.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:58:export function isCocoIndexAvailable(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:59:  return existsSync(getCocoIndexBinaryPath());
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:16:import { getGraphMetrics } from '../lib/search/hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:13:export * from './query-intent-classifier.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:387: * Context types that should never decay under the hybrid decay policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:408: * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:417: * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:440: * REQ-D4-002: Apply the hybrid decay policy to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:10:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:124:    `- CocoIndex: ${args.cocoIndexAvailable ? 'available' : 'missing'}`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:199:  const cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:6:// (CocoIndex) vs hybrid (both).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:11:export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:113: * (code graph) and semantic (CocoIndex) retrieval backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:136:  // No signals at all → hybrid (run both)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:174:    intent: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:4:// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:4:// Resolves CocoIndex search results (file:line) to code graph nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:10:/** A seed from CocoIndex or other providers */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18:/** Native CocoIndex search result as a seed */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:19:export interface CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:43:export type AnySeed = CodeGraphSeed | CocoIndexSeed | ManualSeed | GraphSeed;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:66:function isCocoIndexSeed(seed: unknown): seed is CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:86:/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:87:export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:268:  if (isCocoIndexSeed(seed)) return resolveCocoIndexSeed(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:4:// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:18:  cocoIndex: string;         // Semantic neighbors (from CocoIndex)

exec
/bin/zsh -lc "rg -n \"ensureCodeGraphReady|selective reindex|full_scan|inline\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts' -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:449:- if the graph is only lightly stale, the read path may refresh inline before returning results
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:7:import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:322:    inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:328:    readiness = await ensureCodeGraphReady(process.cwd(), {
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:125: * Intentionally declared inline to preserve the public interface contract
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:1062:Query structural code relationships: `outline` (file symbols), `calls_from` and `calls_to` (call graph), `imports_from` and `imports_to` (dependency graph). Use this instead of Grep for structural queries. Supports multi-hop BFS traversal. Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1077:Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1154:Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash. Use this explicitly when the graph is empty, when a read path reports `full_scan`, or when you want to rebuild more than the bounded inline refresh path will repair.
.opencode/skill/system-spec-kit/mcp_server/README.md:1537:| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:8:import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:92:    inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:99:      readiness = await ensureCodeGraphReady(process.cwd(), {
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:391:    // This test documents the comparison protocol inline.
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:103:  it('S1-C-01: removes a simple inline HTML comment', () => {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:106:| **Pattern Source** | Regex-based, inline pattern list (no external dependency) |
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:85:    expect(contract.recommendedAction).toContain('bounded inline refresh');
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:260:  // (e.g. preserving backtick inline code, adding stemming hints)
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:109:    expect(brief.startupSurface).toContain('first structural read may refresh inline');
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:30: * content read to succeed). We build the content inline.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:546:  // Method 1a: Check YAML frontmatter inline format
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:547:  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:548:  if (inlineMatch) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:549:    const arrayContent = inlineMatch[1];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:706:    // Check for inline array format
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:707:    const inlineMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*\[(.*)\]\s*$/);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:708:    if (inlineMatch) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:709:      currentKey = inlineMatch[1] as keyof CausalLinks;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:710:      const arrayContent = inlineMatch[2].trim();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:241:    it('parses YAML inline array tags', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:468:    it('T29: extracts inline array causal links', () => {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:6:  ensureCodeGraphReady: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:9:    inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:19:  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:48:  it('uses bounded inline refresh settings and returns readiness metadata', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:55:    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts:62:      inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:275:   The formula lives inline in hybrid-search.ts (line ~971).
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:281:   * Replicates the inline formula from hybrid-search.ts:
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:21:export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:28:  inlineIndexPerformed: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:109:    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'graph is empty (0 nodes)' };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:123:    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:132:        action: 'full_scan',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:158:      action: 'full_scan',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:239:export async function ensureCodeGraphReady(rootDir: string, options: EnsureReadyOptions = {}): Promise<ReadyResult> {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:256:      inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:267:      inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:268:      reason: appendCleanupReason(`${state.reason}; inline auto-index skipped for read path`, removedDeletedCount),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:273:  if (state.action === 'full_scan' && !allowInlineFullScan) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:277:      inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:278:      reason: appendCleanupReason(`${state.reason}; inline full scan skipped for read path`, removedDeletedCount),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:284:    if (state.action === 'full_scan') {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:294:        action: 'full_scan',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:295:        inlineIndexPerformed: true,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:315:        inlineIndexPerformed: true,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:327:      inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:336:    inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:547: * vec_memories row inline — instead it logs a deferred-rebuild notice so the next
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:61:- `eval-quality-proxy.ts` is a pure calculation module with no DB writes, making it safe for inline quality scoring and tests.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:113:      `(${describeLastScan(args.graphSummary.lastScan)}; first structural read may refresh inline)`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:12:  ensureCodeGraphReady: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:15:    inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:32:  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:74:    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:82:      inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:96:      const actions: ReadyAction[] = ['none', 'full_scan', 'selective_reindex'];
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:109:        inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:122:        inlineIndexPerformed: true,
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:129:  describe('ensureCodeGraphReady', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:130:    it('returns a ReadyResult with full_scan when graph is empty', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:131:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:132:      const result = await ensureCodeGraphReady('/tmp/test-root');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:137:      expect(typeof result.inlineIndexPerformed).toBe('boolean');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:146:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:147:      const result = await ensureCodeGraphReady('/tmp/test-root');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:151:      expect(result.inlineIndexPerformed).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:157:    it('reports stale work without indexing when read paths disable inline indexing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:162:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:163:      const result = await ensureCodeGraphReady('/tmp/test-root', { allowInlineIndex: false });
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:167:      expect(result.inlineIndexPerformed).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:169:      expect(result.reason).toContain('inline auto-index skipped for read path');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:173:    it('performs selective inline reindex for small stale sets when allowed', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:178:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:179:      const result = await ensureCodeGraphReady('/tmp/test-root', {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:186:      expect(result.inlineIndexPerformed).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:192:    it('allows selective inline reindex after git HEAD changes when the stale set is small', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:200:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:201:      const result = await ensureCodeGraphReady('/tmp/test-root', {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:208:      expect(result.inlineIndexPerformed).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:224:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:225:      const result = await ensureCodeGraphReady('/tmp/test-root', {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:230:      expect(result.action).toBe('full_scan');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:232:      expect(result.inlineIndexPerformed).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:235:      expect(result.reason).toContain('inline full scan skipped for read path');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:239:    it('refuses inline full scan for read paths even when inline selective refresh is enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:245:      const { ensureCodeGraphReady } = await import('../lib/code-graph/ensure-ready.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:246:      const result = await ensureCodeGraphReady('/tmp/test-root', {
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:251:      expect(result.action).toBe('full_scan');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:253:      expect(result.inlineIndexPerformed).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:254:      expect(result.reason).toContain('inline full scan skipped for read path');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:137:    it('T500-05b: Tier precedence uses YAML over inline markers and defaults', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:151:    it('T500-05c: Invalid YAML tier falls back to inline marker', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:36: * bold/italic markers, inline code, and image syntax.
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:45:    .replace(/`{1,3}[^`]*`{1,3}/g, '')    // inline code
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:280:  // Reuse library stripYamlFrontmatter() instead of inline regex — single source
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:28:// Try to import, fallback to inline calculation if not yet available
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:77:    console.warn(`[composite-scoring] fsrs-scheduler unavailable; using inline fallback: ${fsrsSchedulerLoadError}`);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:50:      ensureCodeGraphReady: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:53:        inlineIndexPerformed: false,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:90:      ensureCodeGraphReady: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:93:        inlineIndexPerformed: false,

exec
/bin/zsh -lc "rg -n \"generate-context\\.js|memory_save\\(|dryRun|confirmation-only|memory_health|memory_match_triggers\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts -g '*.ts' -g '*.js' -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/cli.ts:258:  const dryRun = getFlag('dry-run');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:320:  if (dryRun) {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:182:  dryRun: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:59:  const dryRun: boolean = process.argv.includes('--dry-run');
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:62:    if (dryRun) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:113:    if (dryRun) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:171:    console.log(`\nTotal cleaned: ${totalCleaned}${dryRun ? ' (dry-run, nothing actually deleted)' : ''}`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:174:    console.log(`\nCleanup ${dryRun ? 'preview' : 'completed'} successfully`);
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:153:  dryRun?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:587:    const result = rebuildAutoEntities(db, { specFolder: 'specs/001-test', dryRun: true });
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:590:    expect(result.dryRun).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:619:    expect(result.dryRun).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:65:    it('T526-6: dryRun flag accepted as parameter', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:68:        await saveHandler.handleMemorySave({ filePath: fakePath, dryRun: true });
.opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts:71:        expect(getErrorMessage(error)).not.toMatch(/dryRun/);
.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:10:  dryRun: boolean;
.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:15:  dryRun: boolean;
.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:53:  const dryRun = argv.includes('--dry-run');
.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:65:  return { dryRun, specFolder };
.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:75:    console.log(args.dryRun ? '=== DRY-RUN MODE — no changes were made ===' : '=== AUTO ENTITIES REBUILT ===');
.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts:83:    if (!args.dryRun) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:18:  dryRun: boolean;
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:153:    dryRun: true,
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:168:      options.dryRun = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:24:  dryRun: boolean;
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:127:  let dryRun = true;
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:144:      dryRun = true;
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:151:      dryRun = false;
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:210:    dryRun,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:52:  dryRun?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:628:      expect(report.dryRun).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:103:    const dryRun = runLineageBackfill(database, { dryRun: true });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:104:    expect(dryRun.dryRun).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:105:    expect(dryRun.totalGroups).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:106:    expect(dryRun.scanned).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:107:    expect(dryRun.seeded).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:108:    expect(dryRun.skipped).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:117:    expect(executed.dryRun).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:128:  dryRun?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:677:  it('T088: MEMORY_SAVE_FAILED mentions dryRun validation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:680:      a.includes('dryRun')
.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1656:        dryRun: true,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1668:    it('returns dry-run response without indexing when dryRun and skipPreflight are both true', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1679:        dryRun: true,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1697:        dryRun: true,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1715:        dryRun: true,
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:455:If a file fails any gate, the system rejects it with a clear explanation. Preview all checks without saving using `dryRun: true`.
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:707:| `dryRun` | boolean | Preview validation without saving |
.opencode/skill/system-spec-kit/mcp_server/README.md:726:    "dryRun": true
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:306:            'Use dryRun: true to inspect insufficiency reasons and evidence counts without writing',
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2090:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:116:  it('T007b-H8b: autoRepair without confirmed returns confirmation-only payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:844:    it('T-PB2-08d: --json dry-run report has dryRun:true', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:856:      expect(parsed.dryRun).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:939:        'dryRun',
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1103:    dryRun = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1188:  if (dryRun && skipPreflight) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1200:    const dryRunSummary = shouldBypassTemplateContract(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1214:      summary: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1240:        message: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1291:        dry_run: dryRun,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1301:    if (dryRun) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1330:      const dryRunSummary = !preflightResult.dry_run_would_pass
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1346:        summary: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1372:          message: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:123:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:159:          narrative: 'Executed memory_save with dryRun=true and confirmed the insufficiency payload is explicit and non-mutating.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:111:    const dryRunReportPath = path.join(tempDir, 'dry-run-report.json');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:112:    const dryRunReport = await runTriggerPhraseResidualMigration({
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:115:      reportPath: dryRunReportPath,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:118:    expect(fs.existsSync(dryRunReportPath)).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:119:    const dryRunJson = JSON.parse(await fsp.readFile(dryRunReportPath, 'utf8')) as TriggerPhraseMigrationReport;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:120:    expect(dryRunJson.summary.scannedFiles).toBe(3);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:121:    expect(dryRunJson.summary.changedFiles).toBe(2);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:123:    const junkEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-001-junk-residual.md'));
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:128:    const cleanEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-002-clean.md'));
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:132:    const overlapEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-003-title-overlap.md'));
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js:701:        (0, vitest_1.it)('T-PB2-08d: --json dry-run report has dryRun:true', () => {
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js:711:            (0, vitest_1.expect)(parsed.dryRun).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js:782:                'dryRun',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:31:  dryRun?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:35:  dryRun: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:408:  const dryRun = options.dryRun === true;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:437:  if (dryRun) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:439:      dryRun: true,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:478:    dryRun: false,
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:286:      'Run memory_health() to check database status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:291:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:316:      'Use memory_health() to see current system limits'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:765:        'Run with dryRun=true to see detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:143:  dryRun: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1068:  options: { dryRun?: boolean; actor?: string } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1072:  const dryRun = options.dryRun === true;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1127:  if (dryRun) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1129:      dryRun: true,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1208:    dryRun: false,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1325:  options: { dryRun?: boolean; actor?: string } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',

codex
I’ve isolated the main compatibility seams. Now I’m pulling the exact local source lines for query-intent routing, graph readiness, bootstrap payloads, and repair tooling so the final assessment can separate “integrity overlay” ideas from anything that would fight our existing authority model.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1120,1215p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1166	        (classification.matchedKeywords?.[0]) ??
  1167	        normalizedInput;
  1168	
  1169	      if (classification.intent === 'structural' && classification.confidence > 0.65) {
  1170	        try {
  1171	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1172	          if (cgResult.metadata.totalNodes > 0) {
  1173	            graphContextResult = {
  1174	              graphContext: cgResult.graphContext,
  1175	              textBrief: cgResult.textBrief,
  1176	              combinedSummary: cgResult.combinedSummary,
  1177	              nextActions: cgResult.nextActions,
  1178	              metadata: cgResult.metadata,
  1179	            };
  1180	          }
  1181	        } catch {
  1182	          // Code graph unavailable — fall through to semantic
  1183	        }
  1184	      } else if (classification.intent === 'hybrid') {
  1185	        try {
  1186	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1187	          if (cgResult.metadata.totalNodes > 0) {
  1188	            graphContextResult = {
  1189	              graphContext: cgResult.graphContext,
  1190	              textBrief: cgResult.textBrief,
  1191	              combinedSummary: cgResult.combinedSummary,
  1192	              nextActions: cgResult.nextActions,
  1193	              metadata: cgResult.metadata,
  1194	            };
  1195	          }
  1196	        } catch {
  1197	          // Code graph unavailable — hybrid degrades to semantic-only
  1198	        }
  1199	      }
  1200	      // 'semantic' or low-confidence: no graph context, fall through
  1201	    } catch {
  1202	      // Classification failed — fall through to existing logic entirely
  1203	    }
  1204	  }
  1205	
  1206	  // Eval logger — capture context query at entry (fail-safe)
  1207	  let _evalQueryId = 0;
  1208	  let _evalRunId = 0;
  1209	  try {
  1210	    const evalEntry = logSearchQuery({
  1211	      query: normalizedInput,
  1212	      intent: explicit_intent ?? null,
  1213	      specFolder: spec_folder ?? null,
  1214	    });
  1215	    _evalQueryId = evalEntry.queryId;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Query Intent Classifier
     3	// ───────────────────────────────────────────────────────────────
     4	// Heuristic pre-classifier that routes queries to the optimal
     5	// retrieval backend: structural (code graph) vs semantic
     6	// (CocoIndex) vs hybrid (both).
     7	//
     8	// Phase 020: Integrated into memory_context handler for query-intent
     9	// routing between structural (code graph) and semantic backends.
    10	
    11	export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
    12	
    13	export interface ClassificationResult {
    14	  intent: QueryIntent;
    15	  confidence: number;
    16	  structuralScore: number;
    17	  semanticScore: number;
    18	  matchedKeywords: string[];
    19	}
    20	
    21	// ── Keyword dictionaries ───────────────────────────────────────
    22	
    23	const STRUCTURAL_KEYWORDS = new Set([
    24	  // Relationship queries
    25	  'calls', 'imports', 'exports', 'extends', 'implements',
    26	  'contains', 'overrides', 'decorates', 'inherits',
    27	  // Symbol queries
    28	  'function', 'class', 'method', 'interface', 'type',
    29	  'enum', 'variable', 'parameter', 'module',
    30	  // Navigation
    31	  'callers', 'callees', 'dependencies', 'dependents',
    32	  'references', 'definition', 'declaration', 'signature',
    33	  // Graph operations
    34	  'neighborhood', 'outline', 'impact', 'graph',
    35	  'edges', 'nodes', 'symbols', 'hierarchy',
    36	  // Structural patterns
    37	  'inheritance', 'call chain', 'import tree', 'export map',
    38	  // F038: Missing inflections
    39	  'import', 'export', 'caller', 'callee', 'decorator',
    40	  'type_alias', 'defined', 'inherit', 'override',
    41	  'superclass', 'subclass',
    42	]);
    43	
    44	const SEMANTIC_KEYWORDS = new Set([
    45	  // Similarity
    46	  'similar', 'like', 'related', 'resembles', 'comparable',
    47	  // Conceptual
    48	  'example', 'pattern', 'usage', 'how to', 'approach',
    49	  'technique', 'strategy', 'idiom', 'convention',
    50	  // Discovery
    51	  'find', 'search', 'discover', 'locate', 'where',
    52	  // Understanding
    53	  'explain', 'understand', 'what does', 'purpose', 'why',
    54	  'meaning', 'context', 'concept', 'intent',
    55	  // Content-oriented
    56	  'error handling', 'logging', 'validation', 'configuration',
    57	  'authentication', 'middleware', 'utility', 'helper',
    58	]);
    59	
    60	const STRUCTURAL_PATTERNS = [
    61	  /who\s+calls/i,
    62	  /what\s+(?:calls|imports|exports|extends|implements)/i,
    63	  /(?:show|list|get)\s+(?:callers|callees|dependencies|imports|exports)/i,
    64	  /(?:class|function|method)\s+(?:hierarchy|tree)/i,
    65	  /(?:impact|blast\s+radius)\s+of/i,
    66	  /(?:outline|structure)\s+of/i,
    67	];
    68	
    69	const SEMANTIC_PATTERNS = [
    70	  /similar\s+to/i,
    71	  // F035: Narrowed — require semantic noun after opener to avoid matching structural queries
    72	  /(?:how|where)\s+(?:is|are|do|does|to)\s+(?:similar|pattern|approach|example|concept|usage|technique|strategy)/i,
    73	  /(?:find|search)\s+(?:code|files|implementations)\s+(?:that|for|about|related)/i,
    74	  /(?:examples?|patterns?|usage)\s+of/i,
    75	  // F035: Narrowed — require semantic noun after "what is/are/does"
    76	  /what\s+(?:is|are|does)\s+(?:the\s+)?(?:pattern|approach|concept|purpose|meaning|intent|strategy)/i,
    77	];
    78	
    79	// ── Classification logic ───────────────────────────────────────
    80	
    81	function tokenize(query: string): string[] {
    82	  return query.toLowerCase().split(/[\s,;:.()\[\]{}'"]+/).filter(Boolean);
    83	}
    84	
    85	function countKeywordHits(tokens: string[], keywords: Set<string>): { count: number; matched: string[] } {
    86	  const matched: string[] = [];
    87	  for (const token of tokens) {
    88	    if (keywords.has(token)) matched.push(token);
    89	  }
    90	  // F036: Multi-word phrases with word-boundary matching to avoid false positives
    91	  const lowerQuery = tokens.join(' ');
    92	  for (const kw of keywords) {
    93	    if (kw.includes(' ')) {
    94	      const pattern = new RegExp('\\b' + kw.replace(/\s+/g, '\\s+') + '\\b', 'i');
    95	      if (pattern.test(lowerQuery)) {
    96	        matched.push(kw);
    97	      }
    98	    }
    99	  }
   100	  return { count: matched.length, matched };
   101	}
   102	
   103	function countPatternHits(query: string, patterns: RegExp[]): number {
   104	  let count = 0;
   105	  for (const pattern of patterns) {
   106	    if (pattern.test(query)) count++;
   107	  }
   108	  return count;
   109	}
   110	
   111	/**
   112	 * Classify a query's intent for routing between structural
   113	 * (code graph) and semantic (CocoIndex) retrieval backends.
   114	 *
   115	 * Returns intent + confidence score. Hybrid intent means
   116	 * both backends should be queried and results merged.
   117	 */
   118	export function classifyQueryIntent(query: string): ClassificationResult {
   119	  if (!query?.trim()) {
   120	    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
   121	  }
   122	
   123	  const tokens = tokenize(query);
   124	  const structuralHits = countKeywordHits(tokens, STRUCTURAL_KEYWORDS);
   125	  const semanticHits = countKeywordHits(tokens, SEMANTIC_KEYWORDS);
   126	  const structuralPatterns = countPatternHits(query, STRUCTURAL_PATTERNS);
   127	  const semanticPatterns = countPatternHits(query, SEMANTIC_PATTERNS);
   128	
   129	  // Weighted scoring: keywords count 1x, patterns count 2x
   130	  const structuralScore = structuralHits.count + structuralPatterns * 2;
   131	  const semanticScore = semanticHits.count + semanticPatterns * 2;
   132	  const total = structuralScore + semanticScore;
   133	
   134	  const matchedKeywords = [...structuralHits.matched, ...semanticHits.matched];
   135	
   136	  // No signals at all → hybrid (run both)
   137	  if (total === 0) {
   138	    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
   139	  }
   140	
   141	  const structuralRatio = structuralScore / total;
   142	  const semanticRatio = semanticScore / total;
   143	
   144	  // F037: Confidence depends on BOTH ratio AND absolute count.
   145	  // Single-hit max ~0.60, requires multiple signals to reach 0.95.
   146	  // Formula: 0.5 + ratio * 0.25 + min(total, 5) * 0.05
   147	  const computeConfidence = (ratio: number): number =>
   148	    Math.min(0.95, 0.5 + ratio * 0.25 + Math.min(total, 5) * 0.05);
   149	
   150	  // Clear structural signal (>65% structural)
   151	  if (structuralRatio > 0.65) {
   152	    return {
   153	      intent: 'structural',
   154	      confidence: computeConfidence(structuralRatio),
   155	      structuralScore,
   156	      semanticScore,
   157	      matchedKeywords,
   158	    };
   159	  }
   160	
   161	  // Clear semantic signal (>65% semantic)
   162	  if (semanticRatio > 0.65) {
   163	    return {
   164	      intent: 'semantic',
   165	      confidence: computeConfidence(semanticRatio),
   166	      structuralScore,
   167	      semanticScore,
   168	      matchedKeywords,
   169	    };
   170	  }
   171	
   172	  // Ambiguous → hybrid with moderate confidence
   173	  return {
   174	    intent: 'hybrid',
   175	    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
   176	    structuralScore,
   177	    semanticScore,
   178	    matchedKeywords,
   179	  };
   180	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Auto-Trigger (Ensure Ready)
     3	// ───────────────────────────────────────────────────────────────
     4	// Checks if the code graph needs reindexing before a query and
     5	// performs the reindex automatically. Shared helper for context,
     6	// query, and status handlers.
     7	
     8	import { execSync } from 'node:child_process';
     9	import { existsSync } from 'node:fs';
    10	import { relative } from 'node:path';
    11	import { getDb, getLastGitHead, setLastGitHead, ensureFreshFiles } from './code-graph-db.js';
    12	import { indexFiles } from './structural-indexer.js';
    13	import { getDefaultConfig } from './indexer-types.js';
    14	import type { IndexerConfig } from './indexer-types.js';
    15	import * as graphDb from './code-graph-db.js';
    16	
    17	// ───────────────────────────────────────────────────────────────
    18	// Types
    19	// ───────────────────────────────────────────────────────────────
    20	
    21	export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
    22	export type GraphFreshness = 'fresh' | 'stale' | 'empty';
    23	
    24	export interface ReadyResult {
    25	  freshness: GraphFreshness;
    26	  action: ReadyAction;
    27	  files?: string[];
    28	  inlineIndexPerformed: boolean;
    29	  reason: string;
    30	}
    31	
    32	export interface EnsureReadyOptions {
    33	  allowInlineIndex?: boolean;
    34	  allowInlineFullScan?: boolean;
    35	}
    36	
    37	// ───────────────────────────────────────────────────────────────
    38	// Constants
    39	// ───────────────────────────────────────────────────────────────
    40	
    41	/** Maximum time (ms) before auto-indexing is aborted */
    42	const AUTO_INDEX_TIMEOUT_MS = 10_000;
    43	
    44	/** Maximum stale files before we switch from selective to full reindex */
    45	const SELECTIVE_REINDEX_THRESHOLD = 50;
    46	
    47	// ───────────────────────────────────────────────────────────────
    48	// Internal helpers
    49	// ───────────────────────────────────────────────────────────────
    50	
    51	function getCurrentGitHead(rootDir: string): string | null {
    52	  try {
    53	    return execSync('git rev-parse HEAD', {
    54	      cwd: rootDir,
    55	      encoding: 'utf-8',
    56	      timeout: 5_000,
    57	      stdio: ['ignore', 'pipe', 'pipe'],
    58	    }).trim();
    59	  } catch {
    60	    return null;
    61	  }
    62	}
    63	
    64	function partitionTrackedFiles(filePaths: string[]): { existingFiles: string[]; deletedFiles: string[] } {
    65	  const existingFiles: string[] = [];
    66	  const deletedFiles: string[] = [];
    67	
    68	  for (const filePath of filePaths) {
    69	    if (existsSync(filePath)) {
    70	      existingFiles.push(filePath);
    71	      continue;
    72	    }
    73	
    74	    deletedFiles.push(filePath);
    75	  }
    76	
    77	  return { existingFiles, deletedFiles };
    78	}
    79	
    80	function cleanupDeletedTrackedFiles(filePaths: string[]): number {
    81	  for (const filePath of filePaths) {
    82	    graphDb.removeFile(filePath);
    83	  }
    84	
    85	  return filePaths.length;
    86	}
    87	
    88	function appendCleanupReason(reason: string, removedDeletedCount: number): string {
    89	  if (removedDeletedCount === 0) {
    90	    return reason;
    91	  }
    92	
    93	  return `${reason}; removed ${removedDeletedCount} deleted tracked file(s)`;
    94	}
    95	
    96	/** Detect graph state without triggering any reindex */
    97	function detectState(rootDir: string): {
    98	  freshness: GraphFreshness;
    99	  action: ReadyAction;
   100	  staleFiles: string[];
   101	  deletedFiles: string[];
   102	  reason: string;
   103	} {
   104	  const d = getDb();
   105	
   106	  // Condition (a): Graph is empty
   107	  const nodeCount = (d.prepare('SELECT COUNT(*) as c FROM code_nodes').get() as { c: number }).c;
   108	  if (nodeCount === 0) {
   109	    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'graph is empty (0 nodes)' };
   110	  }
   111	
   112	  // Condition (b): Git HEAD changed
   113	  const currentHead = getCurrentGitHead(rootDir);
   114	  const storedHead = getLastGitHead();
   115	  const headChanged = Boolean(currentHead && storedHead && currentHead !== storedHead);
   116	  const headChangedReason = headChanged
   117	    ? `git HEAD changed: ${storedHead!.slice(0, 8)} -> ${currentHead!.slice(0, 8)}`
   118	    : null;
   119	
   120	  // Condition (c): Check file mtime drift on tracked files
   121	  const trackedFiles = graphDb.getTrackedFiles();
   122	  if (trackedFiles.length === 0) {
   123	    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
   124	  }
   125	
   126	  const { existingFiles, deletedFiles } = partitionTrackedFiles(trackedFiles);
   127	  const { stale } = ensureFreshFiles(existingFiles);
   128	  if (stale.length === 0) {
   129	    if (headChanged) {
   130	      return {
   131	        freshness: 'stale',
   132	        action: 'full_scan',
   133	        staleFiles: [],
   134	        deletedFiles,
   135	        reason: deletedFiles.length > 0
   136	          ? `${headChangedReason}; tracked files appear up-to-date on disk; ${deletedFiles.length} tracked file(s) no longer exist on disk`
   137	          : `${headChangedReason}; tracked files appear up-to-date on disk`,
   138	      };
   139	    }
   140	
   141	    if (deletedFiles.length > 0) {
   142	      return {
   143	        freshness: 'stale',
   144	        action: 'none',
   145	        staleFiles: [],
   146	        deletedFiles,
   147	        reason: `${deletedFiles.length} tracked file(s) no longer exist on disk`,
   148	      };
   149	    }
   150	
   151	    return { freshness: 'fresh', action: 'none', staleFiles: [], deletedFiles: [], reason: 'all tracked files are up-to-date' };
   152	  }
   153	
   154	  // Too many stale files => full scan is more efficient
   155	  if (stale.length > SELECTIVE_REINDEX_THRESHOLD) {
   156	    return {
   157	      freshness: 'stale',
   158	      action: 'full_scan',
   159	      staleFiles: stale,
   160	      deletedFiles,
   161	      reason: [
   162	        headChangedReason,
   163	        `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD})`,
   164	        deletedFiles.length > 0 ? `${deletedFiles.length} tracked file(s) no longer exist on disk` : null,
   165	      ].filter(Boolean).join('; '),
   166	    };
   167	  }
   168	
   169	  return {
   170	    freshness: 'stale',
   171	    action: 'selective_reindex',
   172	    staleFiles: stale,
   173	    deletedFiles,
   174	    reason: [
   175	      headChangedReason,
   176	      `${stale.length} file(s) have newer mtime than indexed_at`,
   177	      deletedFiles.length > 0 ? `${deletedFiles.length} tracked file(s) no longer exist on disk` : null,
   178	    ].filter(Boolean).join('; '),
   179	  };
   180	}
   181	
   182	/** Run indexFiles with a timeout guard */
   183	async function indexWithTimeout(config: IndexerConfig, timeoutMs: number): Promise<void> {
   184	  const controller = new AbortController();
   185	  const timer = setTimeout(() => controller.abort(), timeoutMs);
   186	
   187	  try {
   188	    const results = await Promise.race([
   189	      indexFiles(config),
   190	      new Promise<never>((_, reject) => {
   191	        controller.signal.addEventListener('abort', () =>
   192	          reject(new Error(`Auto-indexing timed out after ${timeoutMs}ms`)),
   193	        );
   194	      }),
   195	    ]);
   196	
   197	    // Persist results to DB
   198	    let persistedDetectorProvenance: ReturnType<typeof graphDb.getLastDetectorProvenance> = null;
   199	    for (const result of results) {
   200	      try {
   201	        const fileId = graphDb.upsertFile(
   202	          result.filePath, result.language, result.contentHash,
   203	          result.nodes.length, result.edges.length,
   204	          result.parseHealth, result.parseDurationMs,
   205	        );
   206	        graphDb.replaceNodes(fileId, result.nodes);
   207	        const sourceIds = result.nodes.map(n => n.symbolId);
   208	        graphDb.replaceEdges(sourceIds, result.edges);
   209	        persistedDetectorProvenance ??= result.detectorProvenance;
   210	      } catch {
   211	        // Best-effort: skip files that fail to persist
   212	      }
   213	    }
   214	
   215	    if (persistedDetectorProvenance) {
   216	      graphDb.setLastDetectorProvenance(persistedDetectorProvenance);
   217	    }
   218	  } finally {
   219	    clearTimeout(timer);
   220	  }
   221	}
   222	
   223	// ───────────────────────────────────────────────────────────────
   224	// Public API
   225	// ───────────────────────────────────────────────────────────────
   226	
   227	/**
   228	 * Check whether the code graph is ready and, if not, perform
   229	 * the minimum necessary reindexing before returning.
   230	 *
   231	 * Has a 10-second timeout guard so auto-indexing never blocks
   232	 * queries forever.
   233	 */
   234	/** Debounce: skip re-check if last check was within this window */
   235	const DEBOUNCE_MS = 5_000;
   236	let lastCheckAt = 0;
   237	let lastCheckResult: ReadyResult | null = null;
   238	
   239	export async function ensureCodeGraphReady(rootDir: string, options: EnsureReadyOptions = {}): Promise<ReadyResult> {
   240	  // Debounce: skip if checked recently (prevents redundant work on rapid queries)
   241	  const now = Date.now();
   242	  if (lastCheckResult && (now - lastCheckAt) < DEBOUNCE_MS) {
   243	    return lastCheckResult;
   244	  }
   245	  lastCheckAt = now;
   246	  const allowInlineIndex = options.allowInlineIndex ?? true;
   247	  const allowInlineFullScan = options.allowInlineFullScan ?? allowInlineIndex;
   248	
   249	  const state = detectState(rootDir);
   250	  const removedDeletedCount = cleanupDeletedTrackedFiles(state.deletedFiles);
   251	
   252	  if (state.action === 'none') {
   253	    lastCheckResult = {
   254	      freshness: state.freshness,
   255	      action: 'none',
   256	      inlineIndexPerformed: false,
   257	      reason: appendCleanupReason(state.reason, removedDeletedCount),
   258	    };
   259	    return lastCheckResult;
   260	  }
   261	
   262	  if (state.action === 'selective_reindex' && !allowInlineIndex) {
   263	    lastCheckResult = {
   264	      freshness: state.freshness,
   265	      action: state.action,
   266	      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
   267	      inlineIndexPerformed: false,
   268	      reason: appendCleanupReason(`${state.reason}; inline auto-index skipped for read path`, removedDeletedCount),
   269	    };
   270	    return lastCheckResult;
   271	  }
   272	
   273	  if (state.action === 'full_scan' && !allowInlineFullScan) {
   274	    lastCheckResult = {
   275	      freshness: state.freshness,
   276	      action: state.action,
   277	      inlineIndexPerformed: false,
   278	      reason: appendCleanupReason(`${state.reason}; inline full scan skipped for read path`, removedDeletedCount),
   279	    };
   280	    return lastCheckResult;
   281	  }
   282	
   283	  try {
   284	    if (state.action === 'full_scan') {
   285	      const config = getDefaultConfig(rootDir);
   286	      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);
   287	
   288	      // Update stored git HEAD after full scan
   289	      const head = getCurrentGitHead(rootDir);
   290	      if (head) setLastGitHead(head);
   291	
   292	      lastCheckResult = {
   293	        freshness: state.freshness,
   294	        action: 'full_scan',
   295	        inlineIndexPerformed: true,
   296	        reason: appendCleanupReason(state.reason, removedDeletedCount),
   297	      };
   298	      return lastCheckResult;
   299	    }
   300	
   301	    // selective_reindex: only re-parse stale files
   302	    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
   303	      const config = getDefaultConfig(rootDir);
   304	      // F048: Convert absolute stale file paths to rootDir-relative globs
   305	      config.includeGlobs = state.staleFiles.map(f => relative(rootDir, f));
   306	      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);
   307	
   308	      const head = getCurrentGitHead(rootDir);
   309	      if (head) setLastGitHead(head);
   310	
   311	      lastCheckResult = {
   312	        freshness: state.freshness,
   313	        action: 'selective_reindex',
   314	        files: state.staleFiles,
   315	        inlineIndexPerformed: true,
   316	        reason: appendCleanupReason(state.reason, removedDeletedCount),
   317	      };
   318	      return lastCheckResult;
   319	    }
   320	  } catch (err: unknown) {
   321	    const msg = err instanceof Error ? err.message : String(err);
   322	    console.error(`[ensure-ready] Auto-index failed: ${msg}`);
   323	    lastCheckResult = {
   324	      freshness: state.freshness,
   325	      action: state.action,
   326	      files: state.staleFiles,
   327	      inlineIndexPerformed: false,
   328	      reason: appendCleanupReason(`${state.reason} (auto-index failed: ${msg})`, removedDeletedCount),
   329	    };
   330	    return lastCheckResult;
   331	  }
   332	
   333	  lastCheckResult = {
   334	    freshness: state.freshness,
   335	    action: 'none',
   336	    inlineIndexPerformed: false,
   337	    reason: appendCleanupReason(state.reason, removedDeletedCount),
   338	  };
   339	  return lastCheckResult;
   340	}
   341	
   342	/**
   343	 * Non-mutating freshness check for status display.
   344	 * Does NOT trigger reindexing.
   345	 */
   346	export function getGraphFreshness(rootDir: string): GraphFreshness {
   347	  try {
   348	    const state = detectState(rootDir);
   349	    return state.freshness;
   350	  } catch {
   351	    return 'empty';
   352	  }
   353	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '430,490p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Ops Hardening
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 030 / Phase 3: shared runtime hardening contract for
     5	// readiness, repair, export/import, path identity, and previews.
     6	
     7	export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
     8	export type StructuralReadiness = 'ready' | 'stale' | 'missing';
     9	
    10	export interface MetadataOnlyPreview {
    11	  mode: 'metadata-only';
    12	  path: string;
    13	  fileName: string;
    14	  kind: 'text' | 'binary' | 'unknown';
    15	  sizeBytes: number | null;
    16	  mimeType: string | null;
    17	  lastModified: string | null;
    18	  rawContentIncluded: false;
    19	}
    20	
    21	export interface CodeGraphOpsContract {
    22	  readiness: {
    23	    canonical: StructuralReadiness;
    24	    graphFreshness: GraphFreshness;
    25	    sourceSurface: string;
    26	    summary: string;
    27	    recommendedAction: string;
    28	  };
    29	  doctor: {
    30	    supported: true;
    31	    surface: 'memory_health';
    32	    checks: string[];
    33	    repairModes: string[];
    34	    recommendedAction: string;
    35	  };
    36	  exportImport: {
    37	    rawDbDumpAllowed: false;
    38	    portableIdentityRequired: true;
    39	    postImportRepairRequired: true;
    40	    workspaceBoundRelativePaths: true;
    41	    absolutePaths: 'allowed-for-import-only';
    42	    recommendedAction: string;
    43	  };
    44	  previewPolicy: {
    45	    mode: 'metadata-only';
    46	    rawBinaryAllowed: false;
    47	    recommendedFields: string[];
    48	    recommendedAction: string;
    49	  };
    50	}
    51	
    52	export function normalizeStructuralReadiness(graphFreshness: GraphFreshness): StructuralReadiness {
    53	  if (graphFreshness === 'fresh') {
    54	    return 'ready';
    55	  }
    56	  if (graphFreshness === 'stale') {
    57	    return 'stale';
    58	  }
    59	  return 'missing';
    60	}
    61	
    62	export function buildCodeGraphOpsContract(args: {
    63	  graphFreshness: GraphFreshness;
    64	  sourceSurface: string;
    65	}): CodeGraphOpsContract {
    66	  const canonical = normalizeStructuralReadiness(args.graphFreshness);
    67	  const readinessSummary = canonical === 'ready'
    68	    ? 'Code graph readiness is unified and structurally usable.'
    69	    : canonical === 'stale'
    70	      ? 'Code graph exists but needs refresh before structural trust is high.'
    71	      : 'Code graph is missing or unusable; fallback and repair flows should be used.';
    72	  const readinessAction = canonical === 'ready'
    73	    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
    74	    : canonical === 'stale'
    75	      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
    76	      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
    77	
    78	  return {
    79	    readiness: {
    80	      canonical,
    81	      graphFreshness: args.graphFreshness,
    82	      sourceSurface: args.sourceSurface,
    83	      summary: readinessSummary,
    84	      recommendedAction: readinessAction,
    85	    },
    86	    doctor: {
    87	      supported: true,
    88	      surface: 'memory_health',
    89	      checks: [
    90	        'fts_consistency',
    91	        'trigger_cache_refresh',
    92	        'orphan_edges',
    93	        'orphan_vectors',
    94	        'orphan_chunks',
    95	      ],
    96	      repairModes: [
    97	        'confirmation-gated autoRepair',
    98	        'best-effort partial success reporting',
    99	      ],
   100	      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
   101	    },
   102	    exportImport: {
   103	      rawDbDumpAllowed: false,
   104	      portableIdentityRequired: true,
   105	      postImportRepairRequired: true,
   106	      workspaceBoundRelativePaths: true,
   107	      absolutePaths: 'allowed-for-import-only',
   108	      recommendedAction: 'Treat export/import as a portable identity flow with post-import repair, never as a raw DB dump.',
   109	    },
   110	    previewPolicy: {
   111	      mode: 'metadata-only',
   112	      rawBinaryAllowed: false,
   113	      recommendedFields: ['path', 'fileName', 'kind', 'sizeBytes', 'mimeType', 'lastModified'],
   114	      recommendedAction: 'Expose metadata-only previews for non-text artifacts and avoid raw binary content in runtime context surfaces.',
   115	    },
   116	  };
   117	}
   118	
   119	export function createMetadataOnlyPreview(input: {
   120	  path: string;
   121	  sizeBytes?: number | null;
   122	  mimeType?: string | null;
   123	  lastModified?: string | null;
   124	}): MetadataOnlyPreview {
   125	  const normalizedPath = input.path.replace(/\\/g, '/');
   126	  const fileName = normalizedPath.split('/').filter(Boolean).pop() ?? normalizedPath;
   127	  const kind = input.mimeType?.startsWith('text/')
   128	    ? 'text'
   129	    : input.mimeType
   130	      ? 'binary'
   131	      : 'unknown';
   132	
   133	  return {
   134	    mode: 'metadata-only',
   135	    path: normalizedPath,
   136	    fileName,
   137	    kind,
   138	    sizeBytes: input.sizeBytes ?? null,
   139	    mimeType: input.mimeType ?? null,
   140	    lastModified: input.lastModified ?? null,
   141	    rawContentIncluded: false,
   142	  };
   143	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '52,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"dryRun|dry-run|confirmation-only|confirmed|autoRepair\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:30:// Feature catalog: Memory health autoRepair metadata
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:245:    autoRepair = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:246:    confirmed = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:267:  if (typeof autoRepair !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:270:      error: 'autoRepair must be a boolean',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:276:  if (typeof confirmed !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:279:      error: 'confirmed must be a boolean',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:348:    if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:349:      hints.push('autoRepair is only applied in reportMode="full"');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:385:    requested: autoRepair,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426:  if (autoRepair && !confirmed) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:433:        autoRepairRequested: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:465:        if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:495:      if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:502:  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:504:  if (autoRepair && database) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:520:  if (autoRepair && database) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:128:  dryRun?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:306:            'Use dryRun: true to inspect insufficiency reasons and evidence counts without writing',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:4:// Pure builder functions that construct rejection/dry-run results

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts | sed -n '292,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '420,455p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   292	        qualityScore: result.qualityScore,
   293	        qualityFlags: result.qualityFlags,
   294	        ...(result.rejectionCode ? { rejectionCode: result.rejectionCode } : {}),
   295	        rejectionReason: result.rejectionReason ?? result.message,
   296	        ...(result.sufficiency ? { sufficiency: result.sufficiency } : {}),
   297	        ...(result.qualityGate ? { qualityGate: result.qualityGate } : {}),
   298	        ...(result.warnings ? { warnings: result.warnings } : {}),
   299	        message: result.message ?? result.rejectionReason ?? 'Memory save rejected',
   300	      },
   301	      hints: isInsufficientContext
   302	        ? [
   303	            'Rejected saves do not mutate the memory index',
   304	            'Not enough context was available to save a durable memory',
   305	            'Add at least one concrete file, tool result, decision, blocker, next action, or outcome and retry',
   306	            'Use dryRun: true to inspect insufficiency reasons and evidence counts without writing',
   307	          ]
   308	        : ['Rejected saves do not mutate the memory index', 'Review quality issues and retry the save'],
   309	    });
   310	  }
   311	
   312	  const shouldEmitPostMutationFeedback = result.status !== 'duplicate' && result.status !== 'unchanged';
   313	  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
   314	  if (shouldEmitPostMutationFeedback) {
   315	    let postMutationHooks: import('../mutation-hooks.js').MutationHookResult;
   316	    try {
   317	      postMutationHooks = runPostMutationHooks('save', { specFolder: result.specFolder, filePath });
   318	    } catch (hookError: unknown) {
   319	      const msg = hookError instanceof Error ? hookError.message : String(hookError);
   320	      postMutationHooks = {

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '100,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Seed Resolver
     3	// ───────────────────────────────────────────────────────────────
     4	// Resolves CocoIndex search results (file:line) to code graph nodes.
     5	// Resolution chain: exact symbol → near-exact symbol → enclosing symbol → file anchor.
     6	
     7	import * as graphDb from './code-graph-db.js';
     8	import type { SymbolKind } from './indexer-types.js';
     9	
    10	/** A seed from CocoIndex or other providers */
    11	export interface CodeGraphSeed {
    12	  filePath: string;
    13	  startLine?: number;
    14	  endLine?: number;
    15	  query?: string;
    16	}
    17	
    18	/** Native CocoIndex search result as a seed */
    19	export interface CocoIndexSeed {
    20	  provider: 'cocoindex';
    21	  file: string;
    22	  range: { start: number; end: number };
    23	  score: number;
    24	  snippet?: string;
    25	}
    26	
    27	/** Manual seed with symbol name (no file path required) */
    28	export interface ManualSeed {
    29	  provider: 'manual';
    30	  symbolName: string;
    31	  filePath?: string;
    32	  kind?: SymbolKind;
    33	}
    34	
    35	/** Pre-resolved graph node seed */
    36	export interface GraphSeed {
    37	  provider: 'graph';
    38	  nodeId: string;
    39	  symbolId: string;
    40	}
    41	
    42	/** Union type for all seed kinds */
    43	export type AnySeed = CodeGraphSeed | CocoIndexSeed | ManualSeed | GraphSeed;
    44	
    45	/** A resolved reference into the code graph */
    46	export interface ArtifactRef {
    47	  filePath: string;
    48	  startLine: number;
    49	  endLine: number;
    50	  symbolId: string | null;
    51	  fqName: string | null;
    52	  kind: string | null;
    53	  confidence: number; // 0.0 - 1.0
    54	  resolution: 'exact' | 'near_exact' | 'enclosing' | 'file_anchor';
    55	}
    56	
    57	// ── Type guards ──────────────────────────────────────────────
    58	
    59	function hasProvider(seed: unknown, provider: string): boolean {
    60	  if (typeof seed !== 'object' || seed === null) {
    61	    return false;
    62	  }
    63	  return (seed as { provider?: unknown }).provider === provider;
    64	}
    65	
    66	function isCocoIndexSeed(seed: unknown): seed is CocoIndexSeed {
    67	  return hasProvider(seed, 'cocoindex');
    68	}
    69	
    70	function isManualSeed(seed: unknown): seed is ManualSeed {
    71	  return hasProvider(seed, 'manual');
    72	}
    73	
    74	function isGraphSeed(seed: unknown): seed is GraphSeed {
    75	  return hasProvider(seed, 'graph');
    76	}
    77	
    78	function throwResolutionError(operation: string, seed: unknown, err: unknown): never {
    79	  const message = err instanceof Error ? err.message : String(err);
    80	  console.error(`[seed-resolver] ${operation} failed`, { seed, error: message });
    81	  throw new Error(`[seed-resolver] ${operation} failed: ${message}`);
    82	}
    83	
    84	// ── Seed resolvers ───────────────────────────────────────────
    85	
    86	/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
    87	export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
    88	  return resolveSeed({
    89	    filePath: seed.file,
    90	    startLine: seed.range.start,
    91	    endLine: seed.range.end,
    92	  });
    93	}
    94	
    95	/** Resolve a ManualSeed by looking up the symbol name in the DB */
    96	export function resolveManualSeed(seed: ManualSeed): ArtifactRef {
    97	  try {
    98	    const d = graphDb.getDb();
    99	
   100	    let query = 'SELECT * FROM code_nodes WHERE name = ?';
   101	    const params: unknown[] = [seed.symbolName];
   102	
   103	    if (seed.filePath) {
   104	      query += ' AND file_path = ?';
   105	      params.push(seed.filePath);
   106	    }
   107	    if (seed.kind) {
   108	      query += ' AND kind = ?';
   109	      params.push(seed.kind);
   110	    }
   111	    query += ' LIMIT 1';
   112	
   113	    const row = d.prepare(query).get(...params) as Record<string, unknown> | undefined;
   114	
   115	    if (row) {
   116	      return {
   117	        filePath: row.file_path as string,
   118	        startLine: row.start_line as number,
   119	        endLine: row.end_line as number,
   120	        symbolId: row.symbol_id as string,
   121	        fqName: row.fq_name as string,
   122	        kind: row.kind as string,
   123	        confidence: 0.9,
   124	        resolution: 'exact',
   125	      };
   126	    }
   127	  } catch (err: unknown) {
   128	    throwResolutionError('resolveManualSeed', seed, err);
   129	  }
   130	
   131	  return {
   132	    filePath: seed.filePath ?? '<unknown>',
   133	    startLine: 1,
   134	    endLine: 1,
   135	    symbolId: null,
   136	    fqName: null,
   137	    kind: seed.kind ?? null,
   138	    confidence: 0.1,
   139	    resolution: 'file_anchor',
   140	  };
   141	}
   142	
   143	/** Resolve a GraphSeed by looking up the node by symbolId in the DB */
   144	export function resolveGraphSeed(seed: GraphSeed): ArtifactRef {
   145	  try {
   146	    const d = graphDb.getDb();
   147	
   148	    const row = d.prepare(
   149	      'SELECT * FROM code_nodes WHERE symbol_id = ? LIMIT 1'
   150	    ).get(seed.symbolId) as Record<string, unknown> | undefined;
   151	
   152	    if (row) {
   153	      return {
   154	        filePath: row.file_path as string,
   155	        startLine: row.start_line as number,
   156	        endLine: row.end_line as number,
   157	        symbolId: row.symbol_id as string,
   158	        fqName: row.fq_name as string,
   159	        kind: row.kind as string,
   160	        confidence: 1.0,
   161	        resolution: 'exact',
   162	      };
   163	    }
   164	  } catch (err: unknown) {
   165	    throwResolutionError('resolveGraphSeed', seed, err);
   166	  }
   167	
   168	  return {
   169	    filePath: '<unknown>',
   170	    startLine: 1,
   171	    endLine: 1,
   172	    symbolId: seed.symbolId,
   173	    fqName: null,
   174	    kind: null,
   175	    confidence: 0.1,
   176	    resolution: 'file_anchor',
   177	  };
   178	}
   179	
   180	/** Resolve a single seed to an ArtifactRef */
   181	export function resolveSeed(seed: CodeGraphSeed): ArtifactRef {
   182	  try {
   183	    const d = graphDb.getDb();
   184	
   185	    // Try exact symbol match at line
   186	    if (seed.startLine) {
   187	      const exact = d.prepare(`
   188	        SELECT * FROM code_nodes
   189	        WHERE file_path = ? AND start_line = ?
   190	        ORDER BY kind != 'function' -- prefer functions
   191	        LIMIT 1
   192	      `).get(seed.filePath, seed.startLine) as Record<string, unknown> | undefined;
   193	
   194	      if (exact) {
   195	        return {
   196	          filePath: seed.filePath,
   197	          startLine: exact.start_line as number,
   198	          endLine: exact.end_line as number,
   199	          symbolId: exact.symbol_id as string,
   200	          fqName: exact.fq_name as string,
   201	          kind: exact.kind as string,
   202	          confidence: 1.0,
   203	          resolution: 'exact',
   204	        };
   205	      }
   206	
   207	      const nearExact = d.prepare(`
   208	        SELECT * FROM code_nodes
   209	        WHERE file_path = ? AND ABS(start_line - ?) <= 5
   210	        ORDER BY ABS(start_line - ?) ASC, kind != 'function', start_line ASC
   211	        LIMIT 1
   212	      `).get(seed.filePath, seed.startLine, seed.startLine) as Record<string, unknown> | undefined;
   213	
   214	      if (nearExact) {
   215	        const distance = Math.abs((nearExact.start_line as number) - seed.startLine);
   216	        return {
   217	          filePath: seed.filePath,
   218	          startLine: nearExact.start_line as number,
   219	          endLine: nearExact.end_line as number,
   220	          symbolId: nearExact.symbol_id as string,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '470,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1720,1805p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1736	 * @param query - The search query string.
  1737	 * @param embedding - Optional embedding vector for semantic search.
  1738	 * @param options - Hybrid search configuration options.
  1739	 * @returns Results from the first non-empty stage.
  1740	 */
  1741	async function searchWithFallback(
  1742	  query: string,
  1743	  embedding: Float32Array | number[] | null,
  1744	  options: HybridSearchOptions = {}
  1745	): Promise<HybridSearchResult[]> {
  1746	  // PI-A2: Delegate to tiered fallback when flag is enabled
  1747	  if (isSearchFallbackEnabled()) {
  1748	    return searchWithFallbackTiered(query, embedding, options);
  1749	  }
  1750	
  1751	  // Primary 30 filters noise; fallback 17 widens recall for sparse corpora
  1752	  // Where no result exceeds the primary threshold — chosen empirically via eval.
  1753	  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
  1754	  // The naive hybridSearch that merges raw scores
  1755	  const { allowedChannels, stages } = await executeFallbackPlan(
  1756	    query,
  1757	    embedding,
  1758	    options,
  1759	    'adaptive'
  1760	  );
  1761	  const primaryStage = stages[0];
  1762	  const retryStage = stages[1];
  1763	  const finalStage = retryStage?.results.length ? retryStage : primaryStage;
  1764	  if (finalStage?.results.length) {
  1765	    return finalStage.execution
  1766	      ? enrichFusedResults(query, finalStage.execution, finalStage.options, finalStage.results)
  1767	      : finalStage.results;
  1768	  }
  1769	
  1770	  // Fallback to FTS only
  1771	  if (allowedChannels.has('fts')) {
  1772	    const ftsResults = ftsSearch(query, options);
  1773	    if (ftsResults.length > 0) return ftsResults;
  1774	  }
  1775	
  1776	  // Fallback to BM25 only
  1777	  if (allowedChannels.has('bm25')) {
  1778	    const bm25Results = bm25Search(query, options);
  1779	    if (bm25Results.length > 0) return bm25Results;
  1780	  }
  1781	
  1782	  console.warn('[hybrid-search] All search methods returned empty results');
  1783	  return [];
  1784	}
  1785	
  1786	// 12. STRUCTURAL SEARCH (PI-A2 TIER 3)
  1787	
  1788	/**
  1789	 * PI-A2: Last-resort structural search against the memory_index table.
  1790	 * Retrieves memories ordered by importance tier and weight, without
  1791	 * requiring embeddings or text similarity. Pure SQL fallback.
  1792	 *
  1793	 * @param options - Search options (specFolder for filtering, limit for cap).
  1794	 * @returns Array of HybridSearchResult with source='structural'.
  1795	 */
  1796	function structuralSearch(
  1797	  options: Pick<HybridSearchOptions, 'specFolder' | 'limit'> = {}
  1798	): HybridSearchResult[] {
  1799	  if (!db) {
  1800	    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
  1801	    return [];
  1802	  }
  1803	
  1804	  const limit = options.limit ?? DEFAULT_LIMIT;
  1805	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '665,685p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   665	- rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-53-06-019d528b-cc68-77b3-9b4d-8b5dc37b791e.jsonl, updated_at=2026-04-03T09:42:20+00:00, thread_id=019d528b-cc68-77b3-9b4d-8b5dc37b791e)
   666	
   667	### keywords
   668	
   669	- deep-review-reducer-schema.vitest.ts, release-blocking, .deep-review-pause, scratch/changelog, create:changelog gated
   670	
   671	## User preferences
   672	
   673	- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
   674	- when the user asked to “run /create:changelog ... in the phase folder used,” place changelog files under packet-local `scratch/changelog/` and include files-changed scope [Task 2][Task 3]
   675	- when the user added “also include files changed in it,” changelog drafts should list full touched-file scope rather than short samples [Task 2][Task 3]
   676	
   677	## Reusable knowledge
   678	
   679	- wave labeling that proved useful: 061-070 (Auto-Deep-Research-main portability/handoff), 071-080 (AutoAgent-main capability gating/workflow generation), 081-090 (autoresearch-master small mutable surface discipline) [Task 1]
   680	- packet 028 closeout now expects parity across docs/assets/workflows/runtime mirrors/helper scripts/tests, plus strict validation and parser checks before marking tasks complete [Task 2][Task 3]
   681	- `/create:changelog` may be write-agent gated in this repo; manual fallback is acceptable when documented and kept in the active phase folder [Task 3]
   682	
   683	## Failures and how to do differently
   684	
   685	- symptom: deep-review reducer-schema tests fail during closeout; cause: config metadata drift (`metrics` missing, `.deep-review-pause` mutability mismatch); fix: align config/docs with test schema before rerunning suites [Task 3]

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '190,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"buildContext\\(|code graph unavailable|hybrid degrades|queryIntentMetadata|graphContextResult\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts -n" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
300:  queryIntentMetadata: {
304:  graphContextResult: Record<string, unknown> | null,
306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
314:  const metadata = graphContextResult?.metadata as Record<string, unknown> | undefined;
1134:  let queryIntentMetadata: {
1140:  let graphContextResult: Record<string, unknown> | null = null;
1145:      queryIntentMetadata = {
1157:      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
1171:          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
1173:            graphContextResult = {
1186:          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
1188:            graphContextResult = {
1197:          // Code graph unavailable — hybrid degrades to semantic-only
1454:  if (graphContextResult) {
1455:    responseData.graphContext = graphContextResult;
1457:  if (queryIntentMetadata) {
1458:    responseData.queryIntentRouting = queryIntentMetadata;
1462:    queryIntentMetadata,
1463:    graphContextResult,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1448,1466p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1466	    responseData.structuralRoutingNudge = structuralRoutingNudge;

codex
# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

## Findings
### Finding 1: Mex’s integrity checks are compatible only as an explicit maintenance lane
- **Source**: [SOURCE: external/src/drift/index.ts:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [SOURCE: external/src/drift/checkers/path.ts:8](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [SOURCE: external/src/drift/checkers/edges.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [SOURCE: mcp_server/README.md:543](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L543), [SOURCE: mcp_server/context-server.ts:782](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782)
- **What it does**: Mex runs filesystem and git-backed drift checks over scaffold markdown; our runtime keeps startup and retrieval surfaces freshness-aware but non-mutating, with structural repair deferred to `code_graph_query`/`code_graph_context` or explicit `code_graph_scan`.
- **Why it matters**: The static integrity layer is additive if it stays outside `session_bootstrap`, `memory_context`, and `memory_search`. Putting Mex-style audits inside those latency-sensitive MCP paths would conflict with current routing and readiness boundaries.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Mex’s markdown-first authority conflicts with Spec Kit Memory’s hybrid runtime authority
- **Source**: [SOURCE: external/README.md:178](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L178), [SOURCE: external/src/scanner/index.ts:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [SOURCE: scripts/memory/generate-context.ts:71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L71), [SOURCE: mcp_server/handlers/memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [SOURCE: mcp_server/handlers/session-resume.ts:437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L437)
- **What it does**: Mex treats scaffold markdown as the durable project-memory surface and repairs it from codebase reality; our system treats JSON-primary saved memories, indexed retrieval, code-graph state, and CocoIndex availability as separate runtime authorities.
- **Why it matters**: Replacing current authority with Mex-style scaffold truth would fight `generate-context.js`, indexed memory retrieval, and session bootstrap semantics rather than complement them.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 3: Mex’s targeted sync briefs map well to a bounded `spec-kit doctor` surface
- **Source**: [SOURCE: external/src/sync/brief-builder.ts:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [SOURCE: external/src/sync/brief-builder.ts:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L54), [SOURCE: mcp_server/lib/code-graph/ops-hardening.ts:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts#L21), [SOURCE: mcp_server/handlers/memory-crud-health.ts:426](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L426), [SOURCE: mcp_server/handlers/save/response-builder.ts:301](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts#L301)
- **What it does**: Mex builds repair briefs from issue lists, current file content, nearby filesystem context, and recent git diffs. Our stack already has confirmation-gated repair primitives in `memory_health` and non-mutating inspection via `memory_save({ dryRun: true })`.
- **Why it matters**: The UX pattern is compatible if implemented as orchestration over existing MCP tools, not as a new autonomous document authority.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 4: Mex’s lexical claim extraction can feed CocoIndex/code-graph workflows, but cannot replace them
- **Source**: [SOURCE: external/src/drift/claims.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36), [SOURCE: mcp_server/lib/code-graph/query-intent-classifier.ts:111](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts#L111), [SOURCE: mcp_server/handlers/memory-context.ts:1129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1129), [SOURCE: mcp_server/lib/code-graph/seed-resolver.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts#L4), [SOURCE: mcp_server/README.md:547](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L547)
- **What it does**: Mex extracts path, command, dependency, and version claims from markdown. Our system classifies query intent across semantic/structural/hybrid, routes accordingly, and can turn CocoIndex hits into graph seeds.
- **Why it matters**: Mex can contribute integrity findings or seed data for repair workflows, but it has no native concept of semantic similarity, graph traversal, or structural readiness. As a routing or discovery substitute, it would regress capability.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

### Finding 5: Mex’s single drift score conflicts with our subsystem-specific readiness model
- **Source**: [SOURCE: external/src/drift/scoring.ts:3](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [SOURCE: external/src/reporter.ts:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16), [SOURCE: external/README.md:74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L74), [SOURCE: mcp_server/lib/session/session-snapshot.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L210), [SOURCE: mcp_server/README.md:599](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L599)
- **What it does**: Mex collapses all drift into one `0-100` score and severity totals. Our stack exposes separate signals for memory recovery, code-graph freshness/readiness, CocoIndex availability, and repair recommendations.
- **Why it matters**: A single score hides whether the actual problem is documentation integrity, missing semantic search, stale structural context, or save/index health. That would make MCP recovery and operator triage worse.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- [external/README.md:72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72)
- [external/ROUTER.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L31)
- [external/src/cli.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L28)
- [external/src/drift/index.ts:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17)
- [external/src/drift/claims.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36)
- [external/src/sync/brief-builder.ts:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L41)
- [mcp_server/handlers/memory-context.ts:1129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1129)
- [mcp_server/lib/code-graph/ensure-ready.ts:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts#L41)
- [mcp_server/handlers/session-resume.ts:437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L437)
- [scripts/memory/generate-context.ts:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L75)

## Assessment
- New information ratio: 0.12
- Questions addressed: compatibility with CocoIndex routing, compatibility with code-graph readiness/repair, compatibility with MCP bootstrap/recovery surfaces, whether Mex sync can map onto current repair tooling, whether Mex scoring fits our operational model
- Questions answered: integrity checks fit as an explicit advisory lane; markdown-first authority does not fit; targeted sync maps well to a new doctor/orchestrator surface; lexical claim extraction can feed but not replace semantic/structural systems; score-first health should stay rejected
- Novelty justification: prior iterations established what Mex is; this pass pins down the authority boundaries and exact conflict points between Mex’s scaffold model and our current hybrid MCP runtime
- Validation status: strict validation passed on April 10, 2026 with `Errors: 0  Warnings: 0`; the validator also emitted `cannot create temp file for here document: Operation not permitted` because this sandbox is read-only
- Write status: I could not update [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/research.md), create [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/implementation-summary.md), or save memory from this environment

## Ruled Out
- Running Mex-style drift scans inside `session_bootstrap`, `session_resume`, or `memory_context`
- Treating Mex scaffold markdown as the runtime source of truth for Spec Kit Memory, code graph, or CocoIndex state
- Using Mex’s drift score as the primary operator health signal for our MCP stack
- Treating Mex’s “multi-tool compatibility” table as a real MCP integration model rather than config-file scaffolding

## Reflection
- What worked: comparing Mex’s drift/sync code directly against `memory_context`, `session_resume`, `ensureCodeGraphReady`, and `generate-context.js` made the compatibility boundary obvious very quickly
- What did not work: semantic CocoIndex MCP searches repeatedly cancelled in this environment, so I relied on direct source inspection and local exact-match tracing instead of a second semantic discovery pass
- What I would do differently: next pass, define a concrete issue schema that maps Mex-style integrity findings onto `memory_health`/`memory_save({ dryRun: true })` outputs before debating UI or command wording

## Recommended Next Focus
Define the `spec-kit doctor` compatibility contract: subsystem-tagged issue types, non-mutating inspection path, confirmation-gated repair path, and explicit routing rules that keep semantic search, structural search, and durable memory authority separate.


hook: Stop
hook: Stop Completed
tokens used
173,385
# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

## Findings
### Finding 1: Mex’s integrity checks are compatible only as an explicit maintenance lane
- **Source**: [SOURCE: external/src/drift/index.ts:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [SOURCE: external/src/drift/checkers/path.ts:8](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [SOURCE: external/src/drift/checkers/edges.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [SOURCE: mcp_server/README.md:543](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L543), [SOURCE: mcp_server/context-server.ts:782](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782)
- **What it does**: Mex runs filesystem and git-backed drift checks over scaffold markdown; our runtime keeps startup and retrieval surfaces freshness-aware but non-mutating, with structural repair deferred to `code_graph_query`/`code_graph_context` or explicit `code_graph_scan`.
- **Why it matters**: The static integrity layer is additive if it stays outside `session_bootstrap`, `memory_context`, and `memory_search`. Putting Mex-style audits inside those latency-sensitive MCP paths would conflict with current routing and readiness boundaries.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Mex’s markdown-first authority conflicts with Spec Kit Memory’s hybrid runtime authority
- **Source**: [SOURCE: external/README.md:178](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L178), [SOURCE: external/src/scanner/index.ts:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [SOURCE: scripts/memory/generate-context.ts:71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L71), [SOURCE: mcp_server/handlers/memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [SOURCE: mcp_server/handlers/session-resume.ts:437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L437)
- **What it does**: Mex treats scaffold markdown as the durable project-memory surface and repairs it from codebase reality; our system treats JSON-primary saved memories, indexed retrieval, code-graph state, and CocoIndex availability as separate runtime authorities.
- **Why it matters**: Replacing current authority with Mex-style scaffold truth would fight `generate-context.js`, indexed memory retrieval, and session bootstrap semantics rather than complement them.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 3: Mex’s targeted sync briefs map well to a bounded `spec-kit doctor` surface
- **Source**: [SOURCE: external/src/sync/brief-builder.ts:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [SOURCE: external/src/sync/brief-builder.ts:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L54), [SOURCE: mcp_server/lib/code-graph/ops-hardening.ts:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts#L21), [SOURCE: mcp_server/handlers/memory-crud-health.ts:426](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L426), [SOURCE: mcp_server/handlers/save/response-builder.ts:301](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts#L301)
- **What it does**: Mex builds repair briefs from issue lists, current file content, nearby filesystem context, and recent git diffs. Our stack already has confirmation-gated repair primitives in `memory_health` and non-mutating inspection via `memory_save({ dryRun: true })`.
- **Why it matters**: The UX pattern is compatible if implemented as orchestration over existing MCP tools, not as a new autonomous document authority.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 4: Mex’s lexical claim extraction can feed CocoIndex/code-graph workflows, but cannot replace them
- **Source**: [SOURCE: external/src/drift/claims.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36), [SOURCE: mcp_server/lib/code-graph/query-intent-classifier.ts:111](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts#L111), [SOURCE: mcp_server/handlers/memory-context.ts:1129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1129), [SOURCE: mcp_server/lib/code-graph/seed-resolver.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts#L4), [SOURCE: mcp_server/README.md:547](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L547)
- **What it does**: Mex extracts path, command, dependency, and version claims from markdown. Our system classifies query intent across semantic/structural/hybrid, routes accordingly, and can turn CocoIndex hits into graph seeds.
- **Why it matters**: Mex can contribute integrity findings or seed data for repair workflows, but it has no native concept of semantic similarity, graph traversal, or structural readiness. As a routing or discovery substitute, it would regress capability.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

### Finding 5: Mex’s single drift score conflicts with our subsystem-specific readiness model
- **Source**: [SOURCE: external/src/drift/scoring.ts:3](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [SOURCE: external/src/reporter.ts:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts#L16), [SOURCE: external/README.md:74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L74), [SOURCE: mcp_server/lib/session/session-snapshot.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L210), [SOURCE: mcp_server/README.md:599](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L599)
- **What it does**: Mex collapses all drift into one `0-100` score and severity totals. Our stack exposes separate signals for memory recovery, code-graph freshness/readiness, CocoIndex availability, and repair recommendations.
- **Why it matters**: A single score hides whether the actual problem is documentation integrity, missing semantic search, stale structural context, or save/index health. That would make MCP recovery and operator triage worse.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- [external/README.md:72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72)
- [external/ROUTER.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L31)
- [external/src/cli.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L28)
- [external/src/drift/index.ts:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17)
- [external/src/drift/claims.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36)
- [external/src/sync/brief-builder.ts:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L41)
- [mcp_server/handlers/memory-context.ts:1129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1129)
- [mcp_server/lib/code-graph/ensure-ready.ts:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts#L41)
- [mcp_server/handlers/session-resume.ts:437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L437)
- [scripts/memory/generate-context.ts:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L75)

## Assessment
- New information ratio: 0.12
- Questions addressed: compatibility with CocoIndex routing, compatibility with code-graph readiness/repair, compatibility with MCP bootstrap/recovery surfaces, whether Mex sync can map onto current repair tooling, whether Mex scoring fits our operational model
- Questions answered: integrity checks fit as an explicit advisory lane; markdown-first authority does not fit; targeted sync maps well to a new doctor/orchestrator surface; lexical claim extraction can feed but not replace semantic/structural systems; score-first health should stay rejected
- Novelty justification: prior iterations established what Mex is; this pass pins down the authority boundaries and exact conflict points between Mex’s scaffold model and our current hybrid MCP runtime
- Validation status: strict validation passed on April 10, 2026 with `Errors: 0  Warnings: 0`; the validator also emitted `cannot create temp file for here document: Operation not permitted` because this sandbox is read-only
- Write status: I could not update [research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/research.md), create [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/implementation-summary.md), or save memory from this environment

## Ruled Out
- Running Mex-style drift scans inside `session_bootstrap`, `session_resume`, or `memory_context`
- Treating Mex scaffold markdown as the runtime source of truth for Spec Kit Memory, code graph, or CocoIndex state
- Using Mex’s drift score as the primary operator health signal for our MCP stack
- Treating Mex’s “multi-tool compatibility” table as a real MCP integration model rather than config-file scaffolding

## Reflection
- What worked: comparing Mex’s drift/sync code directly against `memory_context`, `session_resume`, `ensureCodeGraphReady`, and `generate-context.js` made the compatibility boundary obvious very quickly
- What did not work: semantic CocoIndex MCP searches repeatedly cancelled in this environment, so I relied on direct source inspection and local exact-match tracing instead of a second semantic discovery pass
- What I would do differently: next pass, define a concrete issue schema that maps Mex-style integrity findings onto `memory_health`/`memory_save({ dryRun: true })` outputs before debating UI or command wording

## Recommended Next Focus
Define the `spec-kit doctor` compatibility contract: subsystem-tagged issue types, non-mutating inspection path, confirmation-gated repair path, and explicit routing rules that keep semantic search, structural search, and durable memory authority separate.
