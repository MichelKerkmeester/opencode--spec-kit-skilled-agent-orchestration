# Iteration 034: PERFORMANCE IMPLICATIONS

## Focus
PERFORMANCE IMPLICATIONS: Analyze performance trade-offs of adopted patterns. Search latency, storage growth, indexing overhead, startup time impact.

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
upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
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
--
## Findings
### Finding 1: Static markdown reference integrity is the only clear adopt-now slice
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
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
I’m treating this as a read-only deep-research pass for iteration 034 focused on performance implications. I’ll do a quick memory pass, load the relevant research skill guidance, then inspect the external Mex sources plus our local Spec Kit Memory surfaces and synthesize the iteration in the exact format you asked for.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "mex-main|hybrid-rag-fusion|performance|startup|latency|indexing|code-graph|memory_search|memory_context|memory_match_triggers" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 014-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
23:- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
130:- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 014-code-graph-upgrades, description.json memory/metadata.json untouched
184:scope: adopt-now runtime lane + docs closeout for `014-code-graph-upgrades` with detector provenance, blast-radius constraints, and explicit verification gates
195:- 014-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
345:## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success
363:- 026-graph-and-context-optimization, 024-compact-code-graph, 026/005-009, 024/032-034, AI Execution Protocol, SECTION_COUNTS, PHASE_LINKS, SPEC_DOC_INTEGRITY, validate.sh --strict, --no-recursive, implement the plan
384:- Graphify closeout guidance is additive rather than replacement: enrich existing payload confidence/provenance and layered runtime hints (`session-prime`, `compact-inject`, `response-hints`), keep low-level invalidation as already covered by Public indexing, and defer clustering metadata to a later phase [Task 4]
391:- if memory indexing flags lineage/template mismatches during closeout, remove stale rows with `memory_delete`, rerun forced `memory_index_scan` after cooldown, and verify clean reindex before final sign-off [Task 7]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
599:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation; reuse_rule=reuse for this packet-family remediation flow in this checkout, keeping fixes packet-local and revalidated
693:## Task 1: Deep-review packet `024-compact-code-graph` with full parity gates, outcome success
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
743:## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
775:- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
778:- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
824:## Task 3: Verify startup/bootstrap quote surfaces and bounded inline reindex behavior in read-only mode, outcome success
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
838:- when the user said “Do not make code changes ... Be evidence-based and quote exact startup or bootstrap text and exact readiness output,” keep verification read-only and quote observed startup/readiness payload text verbatim [Task 3]
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
1028:## Task 3: Fix startup DB path/provider drift and auto-repair temp-root cleanup for `spec_kit_memory`
1039:## Task 4: Keep embeddings provider `auto` compatible while fixing startup dimension mismatches
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1067:- codex features enable memories, codex features enable code_mode, ~/.codex/config.toml, session_meta.dynamic_tools, mcp_startup, handshake timeout
1098:- Desktop `session_meta.dynamic_tools` plus absence of `mcp_startup` events is a stronger surfacing signal than standalone `node context-server.js` timeout probes [Task 6]
1100:- When startup background scan emits `contamination_audit` JSON on stdout, Codex MCP JSON-RPC can fail to handshake; redirect/silence that stream or delay MCP client init until scan completion [Task 7]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1278:- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1965:- cancelIngestJob retry, ALLOWED_BASE_PATHS startup recovery, MutationHookResult.errors, hooks-ux-feedback.vitest.ts, verify_alignment_drift.py
1981:- TMPDIR=.tmp/vitest-tmp, EX-035 startup scenario, F18-F21 implicit coverage, 19 pre-existing lint errors, index.lock, commit and push
1996:- lifecycle hardening patterns that held: collision-safe checkpoint restore skips, cancel-ingest retry/terminal handling, startup scan roots from `ALLOWED_BASE_PATHS` + `MEMORY_BASE_PATH`, and explicit `errors: []` in mutation hook payloads [Task 3]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "DEEP RESEARCH iteration 34 of 40 on an external memory system. Focus on performance implications: search latency, storage growth, indexing overhead, startup time impact. Compare external mex-main patterns with Spec Kit Memory, memory_search, memory_context, memory_match_triggers, causal links, generate-context.js, CocoIndex, and code-graph." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1526ms:
2026-04-10 23:27:54.650 xcodebuild[84380:38718039]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 23:27:54.749 xcodebuild[84380:38718037] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-OCLkJkcy' (errno=Operation not permitted)
2026-04-10 23:27:55.050 xcodebuild[84382:38718050]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 23:27:55.151 xcodebuild[84382:38718049] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !context, !context(multi), !intent:memory, !memory, !spec"
  },
  {
    "skill": "mcp-coco-index",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !cocoindex, !intent:semantic-code-search, cocoindex, code, embedding~"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep research(phrase), context, deep(name), external~, iteration"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: code, context, deep(name), external~, find~"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.89,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !external, code(name), context, external, memory_context~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.83,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), code(name), patterns, system"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create, kit(name), plan~, spec(name)"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.94,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, context, memory(name), memory_context~, memory_match_triggers~"
  }
]

codex
I’ve got the deep-research skill guidance loaded and I’m pulling prior repo context now. The skill-advisor run hit the usual macOS temp/cache noise in this sandbox, so I’m treating `sk-deep-research` as the explicit match from your request and proceeding with direct source inspection.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/README.md: No such file or directory

 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/AGENTS.md: No such file or directory

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/ROUTER.md: No such file or directory

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/SETUP.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/SETUP.md: No such file or directory

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main/SYNC.md: No such file or directory

codex
The external tree is slightly different from the brief: there isn’t an `external/mex-main/` subfolder here. I’m remapping to the actual `external/` layout now so the analysis stays faithful to the real checkout instead of guessing from the prompt.
exec
/bin/zsh -lc "rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '760,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1147ms:

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

web search: 
web search: 
codex
I’ve confirmed the external snapshot is flattened directly under `external/`, and validation is running in parallel. Next I’m tracing the performance-relevant paths in both Mex and Spec Kit Memory so the iteration stays anchored in concrete latency, storage, indexing, and startup behavior rather than high-level drift theory.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"memory_search|memory_context|memory_match_triggers|generate-context|code_graph_scan|session_bootstrap|SELECTIVE_REINDEX_THRESHOLD|feedback_events|causal\" . | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg --files . | rg \"(memory|context-server|code-graph|generate-context|session_bootstrap|session_resume|feedback|hooks|search)\" | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 169ms:
y-ingest.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/scratch/codex-gpt54-deep-research.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/description.json
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/README.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/implementation-summary.md
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/index.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
./.opencode/skill/sk-code-full-stack/assets/mobile/react-native/patterns/hooks_patterns.ts
./.opencode/specs/skilled-agent-orchestration/z_archive/003-sk-prompt-initial-creation/memory/04-03-26_09-15__initial-creation.md
./.opencode/specs/skilled-agent-orchestration/z_archive/003-sk-prompt-initial-creation/memory/metadata.json
./.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts
./.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/deep-research-strategy.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-004.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-005.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-001.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-002.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/deep-research-config.json
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/iteration-003.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/archive-research-v1/deep-research-state.jsonl
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/description.json
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/playbook-results-wave1.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/playbook-results-wave3.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/consistency-sweep-checks-1-4.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/playbook-results-wave2.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/scratch/consistency-sweep-checks-5-7.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/tasks.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/description.json
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/implementation-summary.md
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/memory/metadata.json
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/memory/24-03-26_18-33__deep-research-v2-improving-review-logic-in-sk.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/spec.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/plan.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/checklist.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/tasks.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md
./.opencode/skill/system-spec-kit/mcp_server/api/search.ts
./.opencode/specs/skilled-agent-orchestration/z_archive/017-cmd-create-prompt/memory/01-03-26_14-44__create-prompt-command.md
./.opencode/specs/skilled-agent-orchestration/z_archive/017-cmd-create-prompt/memory/metadata.json
./.opencode/skill/sk-code-full-stack/assets/frontend/react/patterns/hooks_patterns.ts
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/memory/10-04-26_14-14__comprehensive-deep-skills-optimization-session.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/memory/10-04-26_20-49__massive-implementation-session-5-phases-of-042.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/memory/metadata.json
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/memory/10-04-26_21-18__epic-implementation-session-6-phases-of-042-spec.md
./.opencode/specs/skilled-agent-orchestration/z_archive/011-sk-doc-template-folders/memory/metadata.json
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/plan.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/deep-research-strategy.md
./.opencode/specs/00--ai-systems/001-global-shared/003-hvr-refinement-repo-analysis/scratch/legacy-memory-quarantine/24-02-26_16-50__planning_session.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/scratch/codex-gpt54-deep-research.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/description.json
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/README.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-004.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-005.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-001.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-006.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-002.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-003.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-007.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/iterations/iteration-008.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/research.md
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/deep-research-config.json
./.opencode/specs/skilled-agent-orchestration/030-sk-deep-research-review-mode/research/deep-research-state.jsonl
./.opencode/specs/skilled-agent-orchestration/z_archive/007-cli-claude-code-creation/memory/metadata.json
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md
./.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts
./.opencode/specs/skilled-agent-orchestration/032-sk-doc-readme-hvr-improvements/memory/26-03-26_10-11__completed-planning-for-upgrading-three-sk-doc.md
./.opencode/specs/skilled-agent-orchestration/032-sk-doc-readme-hvr-improvements/memory/26-03-26_10-23__implemented-all-three-deliverables-for-sk-doc.md
./.opencode/specs/skilled-agent-orchestration/032-sk-doc-readme-hvr-improvements/memory/metadata.json
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/scratch/codex-gpt54-deep-research.md
./.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/tasks.md

 succeeded in 534ms:
ror handling patterns" to memory_context and verify semantic routing` | 1. `memory_context({ input: "find examples of error handling patterns in this codebase" })` | Intent classified as 'semantic', `queryIntentRouting.routedBackend` is `semantic` when present, no `graphContext` block | memory_context response showing routing metadata and semantic result shape | PASS if intent=semantic and no graph augmentation is injected; FAIL if structural routing or graphContext appears unexpectedly | Check SEMANTIC_KEYWORDS in query-intent-classifier.ts and graph augmentation guard in memory-context.ts |
./.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml:50:    tool: memory_search
./.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/scratch/improvement-proposals.md:104:| **Evidence** | autoresearch-opencode's worklog.md includes detailed observations explaining WHY each result occurred. Our iteration files capture findings and assessments but lack explicit causal analysis ("Why was this source informative?", "Why did this approach fail to yield new information?"). |
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/002-hybrid-query-merges-results.md:16:- Objective: Verify that hybrid queries (mixing structural keywords like "function", "calls" with semantic keywords like "explain", "examples") are classified as hybrid and append `graphContext` metadata to the normal `memory_context` response.
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/002-hybrid-query-merges-results.md:17:- Prompt: `Send a hybrid query like "find all validation functions and explain their error handling approach" to memory_context. Capture the evidence needed to prove: (1) query-intent classifier returns intent=hybrid, (2) routedBackend is hybrid or structural as appropriate, (3) graphContext is present when the graph has matching anchors, and (4) the base memory_context response still remains intact. Return a concise user-facing pass/fail verdict with the main reason.`
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/002-hybrid-query-merges-results.md:28:| INT-002 | Hybrid query result augmentation | Hybrid intent appends graphContext to the semantic response | `Send "find all validation functions and explain their error handling approach" to memory_context` | 1. `memory_context({ input: "find all validation functions and explain their error handling approach" })` | Intent classified as `hybrid`, `queryIntentRouting` present, `graphContext` appended when graph anchors resolve | memory_context response showing routing metadata plus graphContext | PASS if hybrid routing and graphContext augmentation are both present; FAIL if graph augmentation never appears when the graph has matching anchors | Check hybrid scoring threshold in query-intent-classifier.ts and graph augmentation path in memory-context.ts |
./.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:41:    tool: memory_context
./.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:575:        action: "Save memory context via generate-context.js"
./.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:576:        command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}"
./.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:581:        note: "generate-context.js is the supported save boundary for this workflow"
./.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:637:    - save_memory_context_after_synthesis
./.opencode/skill/sk-git/SKILL.md:430:memory_search({ query: "git workflow", specFolder: "007-feature-name" })
./.opencode/skill/sk-git/SKILL.md:433:memory_search({ query: "branch strategy decisions", includeContent: true })
./.opencode/skill/sk-git/SKILL.md:440:- Use `memory_search()` at session start to recover prior git context
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/003-session-resume-includes-cocoindex.md:3:description: "This scenario validates that session_bootstrap and session_resume expose CocoIndex availability in the integrated recovery flow."
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/003-session-resume-includes-cocoindex.md:10:This scenario validates that the integrated recovery flow exposes CocoIndex availability correctly. `session_bootstrap` is the canonical first-call recovery surface and should carry CocoIndex status inside `resume`. `session_resume` remains the detailed follow-up surface and should still expose the direct `cocoIndex` field alongside memory context and code graph status.
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/003-session-resume-includes-cocoindex.md:16:- Objective: Verify that `session_bootstrap` exposes CocoIndex status through `resume.cocoIndex`, that `session_resume` still exposes the direct `cocoIndex` field, and that both surfaces degrade gracefully when the CocoIndex binary is unavailable. `available` reflects whether the `ccc` binary exists at the expected install path, not whether the daemon is currently running. The `binaryPath` must point to the expected `ccc` binary location.
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/003-session-resume-includes-cocoindex.md:17:- Prompt: `Call session_bootstrap and session_resume, then examine the CocoIndex status fields. Capture the evidence needed to prove: (1) session_bootstrap.resume.cocoIndex contains available boolean and binaryPath, (2) session_resume.cocoIndex contains available boolean and binaryPath, (3) when the CocoIndex binary is installed at the expected path, available=true on both surfaces, (4) in an environment where the binary is absent, both calls still succeed with available=false, and (5) session_bootstrap also surfaces structuralContext for the first-call recovery path. Return a concise user-facing pass/fail verdict with the main reason.`
./.opencode/skill/mcp-coco-index/manual_testing_playbook/07--code-graph-integration/003-session-resume-includes-cocoindex.md:18:- Expected signals: `session_bootstrap.resume.cocoIndex.available` and `session_resume.cocoIndex.available` match binary presence on disk; both `binaryPath` values are non-empty strings; `session_bootstrap` includes `structuralContext`; both calls complete without error regardless of binary availability

codex
The strict validator didn’t stream a normal result back through the first call, so I’m polling that shell session directly. In parallel I’ve already mapped the exact external file layout and the main local memory/code-graph entrypoints I need for the performance comparison.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Context Server
     3	// ───────────────────────────────────────────────────────────────
     4	// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
     5	// Logic in tools/*.ts. This file retains server init, startup,
     6	// Shutdown, and main orchestration only.
     7	import fs from 'fs';
     8	import path from 'path';
     9	
    10	/* ───────────────────────────────────────────────────────────────
    11	   1. MODULE IMPORTS
    12	──────────────────────────────────────────────────────────────── */
    13	
    14	// MCP SDK
    15	import { Server } from '@modelcontextprotocol/sdk/server/index.js';
    16	import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
    17	import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
    18	
    19	// Core modules
    20	import {
    21	  DEFAULT_BASE_PATH,
    22	  ALLOWED_BASE_PATHS,
    23	  DATABASE_PATH,
    24	  checkDatabaseUpdated,
    25	  setEmbeddingModelReady, waitForEmbeddingModel,
    26	  init as initDbState
    27	} from './core/index.js';
    28	
    29	// T303: Tool schemas and dispatch
    30	import { TOOL_DEFINITIONS } from './tool-schemas.js';
    31	import { dispatchTool } from './tools/index.js';
    32	
    33	// Handler modules (only indexSingleFile needed directly for startup scan)
    34	import {
    35	  indexSingleFile,
    36	  handleMemoryStats,
    37	} from './handlers/index.js';
    38	import * as memoryIndexDiscovery from './handlers/memory-index-discovery.js';
    39	import { runPostMutationHooks } from './handlers/mutation-hooks.js';
    40	
    41	// Utils
    42	import { validateInputLengths } from './utils/index.js';
    43	
    44	// History (audit trail for file-watcher deletes)
    45	import { recordHistory } from './lib/storage/history.js';
    46	import * as historyStore from './lib/storage/history.js';
    47	
    48	// Hooks
    49	import {
    50	  MEMORY_AWARE_TOOLS,
    51	  extractContextHint,
    52	  autoSurfaceMemories,
    53	  autoSurfaceAtToolDispatch,
    54	  autoSurfaceAtCompaction,
    55	  appendAutoSurfaceHints,
    56	  syncEnvelopeTokenCount,
    57	  serializeEnvelopeWithTokenCount,
    58	  recordToolCall,
    59	} from './hooks/index.js';
    60	import { primeSessionIfNeeded } from './hooks/memory-surface.js';
    61	
    62	// Architecture
    63	import { getTokenBudget } from './lib/architecture/layer-definitions.js';
    64	import { createMCPErrorResponse, wrapForMCP } from './lib/response/envelope.js';
    65	
    66	// T303: Startup checks (extracted from this file)
    67	import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
    68	import {
    69	  getStartupEmbeddingDimension,
    70	  resolveStartupEmbeddingConfig,
    71	  validateConfiguredEmbeddingsProvider,
    72	} from '@spec-kit/shared/embeddings/factory';
    73	
    74	// Lib modules (for initialization only)
    75	import * as vectorIndex from './lib/search/vector-index.js';
    76	import * as _embeddings from './lib/providers/embeddings.js';
    77	import * as checkpointsLib from './lib/storage/checkpoints.js';
    78	import * as accessTracker from './lib/storage/access-tracker.js';
    79	import { runLineageBackfill } from './lib/storage/lineage-state.js';
    80	import * as hybridSearch from './lib/search/hybrid-search.js';
    81	import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn.js';
    82	import { isGraphUnifiedEnabled } from './lib/search/graph-flags.js';
    83	import * as graphDb from './lib/code-graph/code-graph-db.js';
    84	import { detectRuntime, type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
    85	import * as sessionBoost from './lib/search/session-boost.js';
    86	import * as causalBoost from './lib/search/causal-boost.js';
    87	import * as bm25Index from './lib/search/bm25-index.js';
    88	import * as memoryParser from './lib/parsing/memory-parser.js';
    89	import { getSpecsBasePaths } from './lib/search/folder-discovery.js';
    90	import {
    91	  registerGlobalRefreshFn,
    92	  getDirtyNodes,
    93	  clearDirtyNodes,
    94	  recomputeLocal,
    95	} from './lib/search/graph-lifecycle.js';
    96	import {
    97	  isDegreeBoostEnabled,
    98	  isDynamicInitEnabled,
    99	  isFileWatcherEnabled,
   100	} from './lib/search/search-flags.js';
   101	import { runCleanupStep, runAsyncCleanupStep } from './lib/utils/cleanup-helpers.js';
   102	import { disposeLocalReranker } from './lib/search/local-reranker.js';
   103	import * as workingMemory from './lib/cognitive/working-memory.js';
   104	import * as attentionDecay from './lib/cognitive/attention-decay.js';
   105	import * as coActivation from './lib/cognitive/co-activation.js';
   106	import { initScoringObservability } from './lib/telemetry/scoring-observability.js';
   107	// T059: Archival manager for automatic archival of ARCHIVED state memories
   108	import * as archivalManager from './lib/cognitive/archival-manager.js';
   109	// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
   110	import * as retryManager from './lib/providers/retry-manager.js';
   111	import { buildErrorResponse, getDefaultErrorCodeForTool, getRecoveryHint } from './lib/errors.js';
   112	// T001-T004: Session deduplication
   113	import * as sessionManager from './lib/session/session-manager.js';
   114	import * as shadowEvaluationRuntime from './lib/feedback/shadow-evaluation-runtime.js';
   115	// Phase 023: Context metrics — lightweight session quality tracking
   116	import { recordMetricEvent } from './lib/session/context-metrics.js';
   117	
   118	// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
   119	import * as incrementalIndex from './lib/storage/incremental-index.js';
   120	// T107: Transaction manager for pending file recovery on startup (REQ-033)
   121	import * as transactionManager from './lib/storage/transaction-manager.js';
   122	// KL-4: Tool cache cleanup on shutdown
   123	import * as toolCache from './lib/cache/tool-cache.js';
   124	import { initExtractionAdapter } from './lib/extraction/extraction-adapter.js';
   125	import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
   126	import { isLearnedFeedbackEnabled } from './lib/search/learned-feedback.js';
   127	import { initIngestJobQueue } from './lib/ops/job-queue.js';
   128	import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher.js';
   129	import { getCanonicalPathKey } from './lib/utils/canonical-path.js';
   130	import { runBatchLearning } from './lib/feedback/batch-learning.js';
   131	import { getSessionSnapshot } from './lib/session/session-snapshot.js';
   132	
   133	/* ───────────────────────────────────────────────────────────────
   134	   2. TYPES
   135	──────────────────────────────────────────────────────────────── */
   136	
   137	interface IndexResult {
   138	  status: string;
   139	  error?: string;
   140	  [key: string]: unknown;
   141	}
   142	
   143	interface PendingRecoveryResult {
   144	  found: number;
   145	  processed: number;
   146	  recovered: number;
   147	  failed: number;
   148	  results: unknown[];
   149	}
   150	
   151	interface ApiKeyValidation {
   152	  valid: boolean;
   153	  provider?: string;
   154	  error?: string;
   155	  errorCode?: string;
   156	  warning?: string;
   157	  actions?: string[];
   158	  networkError?: boolean;
   159	}
   160	
   161	interface AutoSurfaceResult {
   162	  constitutional: unknown[];
   163	  triggered: unknown[];
   164	  codeGraphStatus?: {
   165	    status: 'ok' | 'error';
   166	    data?: Record<string, unknown>;
   167	    error?: string;
   168	  };
   169	  sessionPrimed?: boolean;
   170	  primedTool?: string;
   171	  /** T018: Structured Prime Package for non-hook CLI auto-priming */
   172	  primePackage?: {
   173	    specFolder: string | null;
   174	    currentTask: string | null;
   175	    codeGraphStatus: 'fresh' | 'stale' | 'empty';
   176	    cocoIndexAvailable: boolean;
   177	    recommendedCalls: string[];
   178	  };
   179	  surfaced_at?: string;
   180	  latencyMs?: number;
   181	}
   182	
   183	interface ToolCallResponse {
   184	  content: Array<{ type: string; text: string }>;
   185	  isError?: boolean;
   186	  structuredContent?: unknown;
   187	  [key: string]: unknown;
   188	}
   189	
   190	interface DynamicMemoryStats {
   191	  totalMemories: number;
   192	  specFolderCount: number;
   193	  activeCount: number;
   194	  staleCount: number;
   195	}
   196	
   197	type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;
   198	
   199	const afterToolCallbacks: Array<AfterToolCallback> = [];
   200	
   201	/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
   202	const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;
   203	
   204	/** Timeout (ms) for API key validation during startup. */
   205	const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;
   206	
   207	const GRAPH_ENRICHMENT_TIMEOUT_MS = 250;
   208	const GRAPH_ENRICHMENT_OUTLINE_LIMIT = 6;
   209	const GRAPH_ENRICHMENT_NEIGHBOR_LIMIT = 6;
   210	const GRAPH_ENRICHMENT_SYMBOL_LIMIT = 4;
   211	const GRAPH_CONTEXT_EXCLUDED_TOOLS = new Set<string>([
   212	  ...MEMORY_AWARE_TOOLS,
   213	  'code_graph_query',
   214	  'code_graph_context',
   215	  'code_graph_scan',
   216	  'code_graph_status',
   217	]);
   218	
   219	interface GraphContextNeighborSummary {
   220	  filePath: string;
   221	  relationTypes: string[];
   222	  symbols: Array<{
   223	    name: string;
   224	    kind: string;
   225	    line: number;
   226	    direction: 'incoming' | 'outgoing';
   227	    relation: string;
   228	  }>;
   229	}
   230	
   231	interface GraphContextFileSummary {
   232	  filePath: string;
   233	  outline: Array<{
   234	    name: string;
   235	    kind: string;
   236	    line: number;
   237	  }>;
   238	  neighbors: GraphContextNeighborSummary[];
   239	}
   240	
   241	interface DispatchGraphContextMeta {
   242	  status: 'ok' | 'timeout' | 'unavailable';
   243	  source: 'tool-dispatch';
   244	  fileCount: number;
   245	  filePaths: string[];
   246	  latencyMs: number;
   247	  files?: GraphContextFileSummary[];
   248	  error?: string;
   249	}
   250	
   251	export interface StructuralRoutingNudge {
   252	  advisory: true;
   253	  readiness: 'ready';
   254	  preferredTool: 'code_graph_query';
   255	  secondaryTool: 'code_graph_context';
   256	  message: string;
   257	  preservesAuthority: 'session_bootstrap';
   258	  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
   259	}
   260	
   261	const STRUCTURAL_MISFIRE_PATTERNS = [
   262	  /\b(?:who|what)\s+calls?\b/i,
   263	  /\bcallers?\s+of\b/i,
   264	  /\b(?:who|what)\s+imports?\b/i,
   265	  /\bimports?\s+of\b/i,
   266	  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
   267	  /\boutline\s+of\b/i,
   268	  /\bdependenc(?:y|ies)\b/i,
   269	  /\bdependents?\b/i,
   270	  /\bwhat\s+extends\b/i,
   271	];
   272	
   273	const NON_STRUCTURAL_SUPPRESS_PATTERNS = [
   274	  /\bfind code\b/i,
   275	  /\bimplementation of\b/i,
   276	  /\bsimilar code\b/i,
   277	  /\bexplain\b/i,
   278	  /\bpurpose of\b/i,
   279	];
   280	

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Search
     3	// ───────────────────────────────────────────────────────────────
     4	/* ───────────────────────────────────────────────────────────────
     5	   1. DEPENDENCIES
     6	──────────────────────────────────────────────────────────────── */
     7	
     8	import * as toolCache from '../lib/cache/tool-cache.js';
     9	import * as sessionManager from '../lib/session/session-manager.js';
    10	import * as intentClassifier from '../lib/search/intent-classifier.js';
    11	// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
    12	import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
    13	import { searchCommunities } from '../lib/search/community-search.js';
    14	// 4-stage pipeline architecture
    15	import { executePipeline } from '../lib/search/pipeline/index.js';
    16	import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
    17	import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
    18	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    19	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    20	// Artifact-class routing (spec/plan/tasks/checklist/memory)
    21	import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
    22	// Chunk reassembly (extracted from this file)
    23	import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
    24	// Search utilities (extracted from this file)
    25	import {
    26	  filterByMinQualityScore,
    27	  resolveQualityThreshold,
    28	  buildCacheArgs,
    29	  resolveRowContextType,
    30	  resolveArtifactRoutingQuery,
    31	  applyArtifactRouting,
    32	} from '../lib/search/search-utils.js';
    33	// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
    34	// Eval channel tracking (extracted from this file)
    35	import {
    36	  collectEvalChannelsFromRow,
    37	  buildEvalChannelPayloads,
    38	  summarizeGraphWalkDiagnostics,
    39	} from '../lib/telemetry/eval-channel-tracking.js';
    40	import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';
    41	
    42	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    43	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    44	import {
    45	  logFeedbackEvents,
    46	  isImplicitFeedbackLogEnabled,
    47	} from '../lib/feedback/feedback-ledger.js';
    48	import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
    49	import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';
    50	
    51	// Core utilities
    52	import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
    53	import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';
    54	
    55	// Response envelope + formatters
    56	import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
    57	import { formatSearchResults } from '../formatters/index.js';
    58	
    59	// Shared handler types
    60	import type { MCPResponse, IntentClassification } from './types.js';
    61	
    62	// Retrieval trace contracts (C136-08)
    63	import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
    64	import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
    65	import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
    66	import {
    67	  attachSessionTransitionTrace,
    68	  type SessionTransitionTrace,
    69	} from '../lib/search/session-transition.js';
    70	
    71	// REQ-D5-003: Mode-Aware Response Shape
    72	import {
    73	  applyProfileToEnvelope,
    74	  isResponseProfileEnabled,
    75	} from '../lib/response/profile-formatters.js';
    76	import {
    77	  buildProgressiveResponse,
    78	  extractSnippets,
    79	  isProgressiveDisclosureEnabled,
    80	  resolveCursor,
    81	} from '../lib/search/progressive-disclosure.js';
    82	import {
    83	  getLastLexicalCapabilitySnapshot,
    84	  resetLastLexicalCapabilitySnapshot,
    85	} from '../lib/search/sqlite-fts.js';
    86	import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
    87	import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
    88	import {
    89	  deduplicateResults as deduplicateWithSessionState,
    90	  isSessionRetrievalStateEnabled,
    91	  manager as retrievalSessionStateManager,
    92	  refineForGoal,
    93	} from '../lib/search/session-state.js';
    94	
    95	// Type imports for casting
    96	import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
    97	import type { RawSearchResult } from '../formatters/index.js';
    98	// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts
    99	
   100	// Feature catalog: Semantic and lexical search (memory_search)
   101	// Feature catalog: Hybrid search pipeline
   102	// Feature catalog: 4-stage pipeline architecture
   103	// Feature catalog: Quality-aware 3-tier search fallback
   104	
   105	
   106	/* ───────────────────────────────────────────────────────────────
   107	   2. TYPES
   108	──────────────────────────────────────────────────────────────── */
   109	
   110	/**
   111	 * Internal search result row — enriched DB row used within this handler.
   112	 * NOT the same as the canonical SearchResult in shared/types.ts.
   113	 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
   114	 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
   115	 */
   116	interface MemorySearchRow extends Record<string, unknown> {
   117	  id: number;
   118	  similarity?: number;
   119	  importance_tier?: string;
   120	  contextType?: string;
   121	  context_type?: string;
   122	  attentionScore?: number;
   123	  retrievability?: number;
   124	  stability?: number;
   125	  last_review?: string | null;
   126	  created_at?: string;
   127	  last_accessed?: number;
   128	  content?: string;
   129	  memoryState?: string;
   130	  file_path?: string;
   131	  parent_id?: number | null;
   132	  chunk_index?: number | null;
   133	  chunk_label?: string | null;
   134	  isChunk?: boolean;
   135	  parentId?: number | null;
   136	  chunkIndex?: number | null;
   137	  chunkLabel?: string | null;
   138	  chunkCount?: number | null;
   139	  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
   140	  precomputedContent?: string;
   141	}
   142	
   143	interface DedupResult {
   144	  results: MemorySearchRow[];
   145	  dedupStats: Record<string, unknown>;
   146	}
   147	
   148	interface SearchCachePayload {
   149	  summary: string;
   150	  data: Record<string, unknown>;
   151	  hints: string[];
   152	}
   153	
   154	type SessionAwareResult = Record<string, unknown> & {
   155	  id: number | string;
   156	  score?: number;
   157	  content?: string;
   158	};
   159	
   160	// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts
   161	
   162	type IntentWeights = IntentClassifierWeights;
   163	
   164	function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
   165	  if (!weights) return null;
   166	  return {
   167	    similarity: weights.similarity,
   168	    importance: weights.importance,
   169	    recency: weights.recency,
   170	  };
   171	}
   172	
   173	// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts
   174	
   175	interface SearchArgs {
   176	  cursor?: string;
   177	  query?: string;
   178	  concepts?: string[];
   179	  specFolder?: string;
   180	  folderBoost?: { folder: string; factor: number };
   181	  tenantId?: string;
   182	  userId?: string;
   183	  agentId?: string;
   184	  sharedSpaceId?: string;
   185	  limit?: number;
   186	  tier?: string;
   187	  contextType?: string;
   188	  useDecay?: boolean;
   189	  includeContiguity?: boolean;
   190	  includeConstitutional?: boolean;
   191	  includeContent?: boolean;
   192	  anchors?: string[];
   193	  bypassCache?: boolean;
   194	  sessionId?: string;
   195	  enableDedup?: boolean;
   196	  intent?: string;
   197	  autoDetectIntent?: boolean;
   198	  minState?: string;
   199	  applyStateLimits?: boolean;
   200	  rerank?: boolean;
   201	  applyLengthPenalty?: boolean;
   202	  trackAccess?: boolean; // opt-in access tracking (default false)
   203	  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
   204	  enableSessionBoost?: boolean;
   205	  enableCausalBoost?: boolean;
   206	  minQualityScore?: number;
   207	  min_quality_score?: number;
   208	  mode?: string; // "deep" mode enables query expansion for multi-query RAG
   209	  includeTrace?: boolean;
   210	  sessionTransition?: SessionTransitionTrace;
   211	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   212	  profile?: string;
   213	  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
   214	  retrievalLevel?: 'local' | 'global' | 'auto';
   215	}
   216	
   217	// resolveRowContextType — now imported from lib/search/search-utils.ts
   218	// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
   219	
   220	function attachTelemetryMeta(
   221	  response: MCPResponse,
   222	  telemetryPayload: Record<string, unknown>,
   223	): MCPResponse {
   224	  const firstEntry = response?.content?.[0];
   225	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   226	    return response;
   227	  }
   228	
   229	  try {
   230	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   231	    const meta = envelope.meta && typeof envelope.meta === 'object'
   232	      ? envelope.meta as Record<string, unknown>
   233	      : {};
   234	    envelope.meta = {
   235	      ...meta,
   236	      _telemetry: telemetryPayload,
   237	    };
   238	
   239	    return {
   240	      ...response,
   241	      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
   242	    };
   243	  } catch (error: unknown) {
   244	    const message = toErrorMessage(error);
   245	    console.warn('[memory-search] Failed to attach telemetry payload:', message);
   246	    return response;
   247	  }
   248	}
   249	
   250	function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
   251	  const firstEntry = response?.content?.[0];
   252	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   253	    return [];
   254	  }
   255	
   256	  try {
   257	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   258	    const data = envelope.data && typeof envelope.data === 'object'
   259	      ? envelope.data as Record<string, unknown>
   260	      : null;
   261	    return Array.isArray(data?.results)
   262	      ? data.results as Array<Record<string, unknown>>
   263	      : [];
   264	  } catch {
   265	    return [];
   266	  }
   267	}
   268	
   269	function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
   270	  const firstEntry = response?.content?.[0];
   271	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   272	    return null;
   273	  }
   274	
   275	  try {
   276	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   277	    const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
   278	    const data = envelope.data && typeof envelope.data === 'object'
   279	      ? envelope.data as Record<string, unknown>
   280	      : null;
   281	    const hints = Array.isArray(envelope.hints)
   282	      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
   283	      : [];
   284	
   285	    if (!summary || !data) {
   286	      return null;
   287	    }
   288	
   289	    return { summary, data, hints };
   290	  } catch {
   291	    return null;
   292	  }
   293	}
   294	
   295	function parseResponseEnvelope(
   296	  response: MCPResponse,
   297	): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
   298	  const firstEntry = response?.content?.[0];
   299	  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
   300	    return null;
   301	  }
   302	
   303	  try {
   304	    return {
   305	      firstEntry,
   306	      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
   307	    };
   308	  } catch {
   309	    return null;
   310	  }
   311	}
   312	
   313	function replaceResponseEnvelope(
   314	  response: MCPResponse,
   315	  firstEntry: { type: 'text'; text: string },
   316	  envelope: Record<string, unknown>,
   317	): MCPResponse {
   318	  return {
   319	    ...response,
   320	    content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   321	    advisory: true,
   322	    readiness: 'ready',
   323	    preferredTool: 'code_graph_query',
   324	    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
   325	    preservesAuthority: 'session_bootstrap',
   326	  };
   327	}
   328	
   329	/* ───────────────────────────────────────────────────────────────
   330	   2. TOKEN BUDGET ENFORCEMENT (T205)
   331	   
   332	   Enforces per-layer/per-mode token budgets by estimating the
   333	   token count of strategy results and truncating when exceeded.
   334	   Uses character-based estimation: 1 token ≈ 4 chars.
   335	──────────────────────────────────────────────────────────────── */
   336	
   337	/**
   338	 * T205: Enforce token budget on strategy results.
   339	 * 
   340	 * Estimates the token count of the serialized result. If over budget,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Triggers
     3	// ───────────────────────────────────────────────────────────────
     4	// Shared packages
     5	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
     6	
     7	// Feature catalog: Trigger phrase matching (memory_match_triggers)
     8	// Feature catalog: BM25 trigger phrase re-index gate
     9	
    10	
    11	/* ───────────────────────────────────────────────────────────────
    12	   1. DEPENDENCIES
    13	──────────────────────────────────────────────────────────────── */
    14	
    15	// Core utilities
    16	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
    17	import { toErrorMessage } from '../utils/index.js';
    18	import { createFilePathValidator } from '../utils/validators.js';
    19	
    20	// Formatters
    21	import { calculateTokenMetrics, type TokenMetrics } from '../formatters/index.js';
    22	
    23	// Lib modules
    24	import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
    25	import * as workingMemory from '../lib/cognitive/working-memory.js';
    26	import * as attentionDecay from '../lib/cognitive/attention-decay.js';
    27	import * as tierClassifier from '../lib/cognitive/tier-classifier.js';
    28	import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier.js';
    29	import * as coActivation from '../lib/cognitive/co-activation.js';
    30	
    31	// REQ-019: Standardized Response Structure
    32	import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
    33	// T004: Consumption instrumentation
    34	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    35	
    36	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    37	import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger.js';
    38	
    39	// Shared handler types
    40	import type { MCPResponse } from './types.js';
    41	// C2 FIX: Import DB access for scope filtering
    42	import { initialize_db } from '../lib/search/vector-index-store.js';
    43	// T73: Import session manager for trusted session validation (IDOR prevention)
    44	import * as sessionManager from '../lib/session/session-manager.js';
    45	
    46	/* ───────────────────────────────────────────────────────────────
    47	   2. TYPES
    48	──────────────────────────────────────────────────────────────── */
    49	
    50	interface TriggerMatch {
    51	  memoryId: number;
    52	  specFolder: string;
    53	  filePath: string;
    54	  title: string | null;
    55	  matchedPhrases: string[];
    56	  importanceWeight: number;
    57	  [key: string]: unknown;
    58	}
    59	
    60	interface EnrichedTriggerMatch extends TriggerMatch {
    61	  attentionScore: number;
    62	  tier: string;
    63	  coActivated: boolean;
    64	}
    65	
    66	interface FormattedResult {
    67	  memoryId: number;
    68	  specFolder: string;
    69	  filePath: string;
    70	  title: string | null;
    71	  matchedPhrases: string[];
    72	  importanceWeight: number;
    73	  tier?: string;
    74	  attentionScore?: number;
    75	  content?: string;
    76	  coActivated?: boolean;
    77	  [key: string]: unknown;
    78	}
    79	
    80	interface DecayStats {
    81	  decayedCount: number;
    82	}
    83	
    84	interface CoActivatedMemory {
    85	  memoryId: number;
    86	}
    87	
    88	interface WorkingMemoryEntry {
    89	  memoryId: number;
    90	  attentionScore: number;
    91	}
    92	
    93	interface CognitiveStats {
    94	  enabled: boolean;
    95	  sessionId: string;
    96	  turnNumber: number;
    97	  decayApplied: number;
    98	  memoriesActivated: number;
    99	  coActivations: number;
   100	  tierDistribution: StateStats;
   101	  tokenMetrics: TokenMetrics;
   102	}
   103	
   104	interface TriggerArgs {
   105	  prompt: string;
   106	  specFolder?: string;
   107	  limit?: number;
   108	  session_id?: string;
   109	  turnNumber?: number;
   110	  include_cognitive?: boolean;
   111	  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
   112	  tenantId?: string;
   113	  userId?: string;
   114	  agentId?: string;
   115	  sharedSpaceId?: string;
   116	}
   117	
   118	/* ───────────────────────────────────────────────────────────────
   119	   2b. CONSTANTS
   120	──────────────────────────────────────────────────────────────── */
   121	
   122	/** Per-turn decay rate for attention scoring. */
   123	const TURN_DECAY_RATE = 0.98;
   124	const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
   125	
   126	/* ───────────────────────────────────────────────────────────────
   127	   2c. HELPER FUNCTIONS
   128	──────────────────────────────────────────────────────────────── */
   129	
   130	/** Fetch full memory records required for FSRS tier classification. */
   131	function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
   132	  const records = new Map<number, TierInput>();
   133	  if (memoryIds.length === 0) return records;
   134	
   135	  const db = attentionDecay.getDb();
   136	  if (!db) return records;
   137	
   138	  try {
   139	    const stmt = db.prepare(
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Scan Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// MCP tool handler for code_graph_scan — indexes workspace files.
     5	
     6	import { execSync } from 'node:child_process';
     7	import { existsSync, realpathSync } from 'node:fs';
     8	import { resolve, sep } from 'node:path';
     9	import { getDefaultConfig, type DetectorProvenance, type CodeEdge } from '../../lib/code-graph/indexer-types.js';
    10	import { indexFiles } from '../../lib/code-graph/structural-indexer.js';
    11	import * as graphDb from '../../lib/code-graph/code-graph-db.js';
    12	
    13	export interface ScanArgs {
    14	  rootDir?: string;
    15	  includeGlobs?: string[];
    16	  excludeGlobs?: string[];
    17	  incremental?: boolean;
    18	}
    19	
    20	export interface ScanResult {
    21	  filesScanned: number;
    22	  filesIndexed: number;
    23	  filesSkipped: number;
    24	  totalNodes: number;
    25	  totalEdges: number;
    26	  errors: string[];
    27	  durationMs: number;
    28	  fullReindexTriggered?: boolean;
    29	  currentGitHead?: string | null;
    30	  previousGitHead?: string | null;
    31	  detectorProvenanceSummary?: graphDb.DetectorProvenanceSummary;
    32	  graphEdgeEnrichmentSummary?: graphDb.GraphEdgeEnrichmentSummary | null;
    33	}
    34	
    35	function summarizeDetectorProvenance(
    36	  results: Array<{ detectorProvenance?: DetectorProvenance }>,
    37	): graphDb.DetectorProvenanceSummary {
    38	  const counts: Partial<Record<DetectorProvenance, number>> = {};
    39	  let dominant: DetectorProvenance | 'unknown' = 'unknown';
    40	  let dominantCount = 0;
    41	
    42	  for (const result of results) {
    43	    if (!result.detectorProvenance) {
    44	      continue;
    45	    }
    46	    const nextCount = (counts[result.detectorProvenance] ?? 0) + 1;
    47	    counts[result.detectorProvenance] = nextCount;
    48	    if (nextCount > dominantCount) {
    49	      dominantCount = nextCount;
    50	      dominant = result.detectorProvenance;
    51	    }
    52	  }
    53	
    54	  return { dominant, counts };
    55	}
    56	
    57	function summarizeGraphEdgeEnrichment(
    58	  results: Array<{ edges: CodeEdge[] }>,
    59	): graphDb.GraphEdgeEnrichmentSummary | null {
    60	  let best: graphDb.GraphEdgeEnrichmentSummary | null = null;
    61	
    62	  for (const result of results) {
    63	    for (const edge of result.edges) {
    64	      const metadata = edge.metadata;
    65	      if (!metadata || typeof metadata.confidence !== 'number') {
    66	        continue;
    67	      }
    68	
    69	      const edgeEvidenceClass = (() => {
    70	        switch (edge.edgeType) {
    71	          case 'IMPORTS':
    72	          case 'EXPORTS':
    73	            return 'import' as const;
    74	          case 'EXTENDS':
    75	          case 'IMPLEMENTS':
    76	          case 'TYPE_OF':
    77	            return 'type_reference' as const;
    78	          case 'TESTED_BY':
    79	            return 'test_coverage' as const;
    80	          default:
    81	            return metadata.detectorProvenance === 'heuristic' || metadata.evidenceClass === 'INFERRED'
    82	              ? 'inferred_heuristic' as const
    83	              : 'direct_call' as const;
    84	        }
    85	      })();
    86	
    87	      if (!best || metadata.confidence > best.numericConfidence) {
    88	        best = {
    89	          edgeEvidenceClass,
    90	          numericConfidence: metadata.confidence,
    91	        };
    92	      }
    93	    }
    94	  }
    95	
    96	  return best;
    97	}
    98	
    99	function getCurrentGitHead(rootDir: string): string | null {
   100	  try {
   101	    return execSync('git rev-parse HEAD', {
   102	      cwd: rootDir,
   103	      encoding: 'utf-8',
   104	      stdio: ['ignore', 'pipe', 'pipe'],
   105	    }).trim();
   106	  } catch (err: unknown) {
   107	    const message = err instanceof Error ? err.message : String(err);
   108	    console.error(`[code-graph-scan] Failed to read git HEAD for ${rootDir}: ${message}`);
   109	    return null;
   110	  }
   111	}
   112	
   113	function cleanupMissingTrackedFiles(filePaths: string[]): void {
   114	  for (const filePath of filePaths) {
   115	    if (existsSync(filePath)) {
   116	      continue;
   117	    }
   118	
   119	    graphDb.removeFile(filePath);
   120	  }
   121	}
   122	
   123	/** Handle code_graph_scan tool call */
   124	export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
   125	  const startTime = Date.now();
   126	  const rootDir = args.rootDir ?? process.cwd();
   127	  const incremental = args.incremental !== false;
   128	  const workspaceRoot = resolve(process.cwd());
   129	  const resolvedRootDir = resolve(rootDir);
   130	
   131	  // SECURITY: Canonicalize paths via realpathSync() to prevent symlink bypass.
   132	  // A symlink inside the workspace pointing outside it would pass a lexical
   133	  // startsWith() check on the resolved (but not canonicalized) path.
   134	  let canonicalWorkspace: string;
   135	  let canonicalRootDir: string;
   136	  try {
   137	    canonicalWorkspace = realpathSync(workspaceRoot);
   138	    canonicalRootDir = realpathSync(resolvedRootDir);
   139	  } catch {
   140	    // Broken symlink or non-existent path — reject immediately
   141	    return {
   142	      content: [{
   143	        type: 'text',
   144	        text: JSON.stringify({
   145	          status: 'error',
   146	          error: `rootDir path is invalid or contains a broken symlink: ${resolvedRootDir}`,
   147	        }),
   148	      }],
   149	    };
   150	  }
   151	
   152	  const workspacePrefix = canonicalWorkspace.endsWith(sep) ? canonicalWorkspace : `${canonicalWorkspace}${sep}`;
   153	
   154	  if (canonicalRootDir !== canonicalWorkspace && !canonicalRootDir.startsWith(workspacePrefix)) {
   155	    return {
   156	      content: [{
   157	        type: 'text',
   158	        text: JSON.stringify({
   159	          status: 'error',
   160	          error: `rootDir must stay within the workspace root: ${canonicalWorkspace}`,
   161	        }),
   162	      }],
   163	    };
   164	  }
   165	
   166	  const config = getDefaultConfig(resolvedRootDir);
   167	  if (args.includeGlobs) config.includeGlobs = args.includeGlobs;
   168	  if (args.excludeGlobs) config.excludeGlobs = [...config.excludeGlobs, ...args.excludeGlobs];
   169	
   170	  const previousGitHead = graphDb.getLastGitHead();
   171	  const currentGitHead = getCurrentGitHead(resolvedRootDir);
   172	  const fullReindexTriggered = incremental
   173	    && previousGitHead !== null
   174	    && currentGitHead !== null
   175	    && previousGitHead !== currentGitHead;
   176	  const effectiveIncremental = incremental && !fullReindexTriggered;
   177	
   178	  if (fullReindexTriggered) {
   179	    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); forcing full reindex`);
   180	  }
   181	
   182	  const results = await indexFiles(config);
   183	  const detectorProvenanceSummary = summarizeDetectorProvenance(results);
   184	  const graphEdgeEnrichmentSummary = summarizeGraphEdgeEnrichment(results);
   185	
   186	  let filesIndexed = 0;
   187	  let filesSkipped = 0;
   188	  let totalNodes = 0;
   189	  let totalEdges = 0;
   190	  const errors: string[] = [];
   191	
   192	  if (effectiveIncremental) {
   193	    cleanupMissingTrackedFiles(graphDb.getTrackedFiles());
   194	  } else {
   195	    const indexedPaths = new Set(results.map((result) => result.filePath));
   196	    for (const filePath of graphDb.getTrackedFiles()) {
   197	      if (!indexedPaths.has(filePath)) {
   198	        graphDb.removeFile(filePath);
   199	      }
   200	    }
   201	  }
   202	
   203	  for (const result of results) {
   204	    // Skip unchanged files in incremental mode
   205	    if (effectiveIncremental && !graphDb.isFileStale(result.filePath)) {
   206	      filesSkipped++;
   207	      continue;
   208	    }
   209	
   210	    try {
   211	      const fileId = graphDb.upsertFile(
   212	        result.filePath, result.language, result.contentHash,
   213	        result.nodes.length, result.edges.length,
   214	        result.parseHealth, result.parseDurationMs,
   215	      );
   216	      graphDb.replaceNodes(fileId, result.nodes);
   217	      const sourceIds = result.nodes.map(n => n.symbolId);
   218	      graphDb.replaceEdges(sourceIds, result.edges);
   219	
   220	      filesIndexed++;
   221	      totalNodes += result.nodes.length;
   222	      totalEdges += result.edges.length;
   223	    } catch (err: unknown) {
   224	      errors.push(`${result.filePath}: ${err instanceof Error ? err.message : String(err)}`);
   225	    }
   226	
   227	    if (result.parseErrors.length > 0) {
   228	      errors.push(...result.parseErrors.map(e => `${result.filePath}: ${e}`));
   229	    }
   230	  }
   231	
   232	  if (filesIndexed > 0 && results.length > 0) {
   233	    graphDb.setLastDetectorProvenance(results[0].detectorProvenance);
   234	  }
   235	
   236	  if (currentGitHead) {
   237	    graphDb.setLastGitHead(currentGitHead);
   238	  }
   239	  if (detectorProvenanceSummary.dominant !== 'unknown') {
   240	    graphDb.setLastDetectorProvenance(detectorProvenanceSummary.dominant);
   241	  }
   242	  graphDb.setLastDetectorProvenanceSummary(detectorProvenanceSummary);
   243	  if (graphEdgeEnrichmentSummary) {
   244	    graphDb.setLastGraphEdgeEnrichmentSummary(graphEdgeEnrichmentSummary);
   245	  }
   246	
   247	  const scanResult: ScanResult = {
   248	    filesScanned: results.length,
   249	    filesIndexed,
   250	    filesSkipped,
   251	    totalNodes,
   252	    totalEdges,
   253	    errors: errors.slice(0, 10),
   254	    durationMs: Date.now() - startTime,
   255	    fullReindexTriggered,
   256	    currentGitHead,
   257	    previousGitHead,
   258	    detectorProvenanceSummary,
   259	    graphEdgeEnrichmentSummary,
   260	  };
   261	
   262	  return {
   263	    content: [{
   264	      type: 'text',
   265	      text: JSON.stringify({ status: 'ok', data: scanResult }, null, 2),
   266	    }],
   267	  };
   268	}

exec
/bin/zsh -lc "rg -n \"startup scan|file watcher|startFileWatcher|non-blocking|SELECTIVE_REINDEX_THRESHOLD|ensureCodeGraphReady|session_bootstrap|recomputeLocal|dirtyNodes|Embedding model|waitForEmbeddingModel|runBatchLearning|runLineageBackfill|initIngestJobQueue\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/*.ts .opencode/skill/system-spec-kit/mcp_server/handlers/*.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:7:import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:328:    readiness = await ensureCodeGraphReady(process.cwd(), {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:8:import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:99:      readiness = await ensureCodeGraphReady(process.cwd(), {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:25:  setEmbeddingModelReady, waitForEmbeddingModel,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:33:// Handler modules (only indexSingleFile needed directly for startup scan)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:79:import { runLineageBackfill } from './lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:94:  recomputeLocal,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:127:import { initIngestJobQueue } from './lib/ops/job-queue.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:128:import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:130:import { runBatchLearning } from './lib/feedback/batch-learning.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:201:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1239:    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1318:        // Non-fatal: startup scan must continue even if invalidation hooks fail.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1481:  // Node version mismatch detection (non-blocking)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1655:      const result = runLineageBackfill(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1682:        const updatedEdges = recomputeLocal(database, dirtyNodeIds);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1778:      const batchResult = runBatchLearning(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1816:      const ingestInit = initIngestJobQueue({
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1834:          fileWatcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1890:  // Background startup scan
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:446:    hints.push('Embedding model not ready - some operations may fail');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:52:import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:765:      const modelReady = await waitForEmbeddingModel(30000);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:767:        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   261	                    break;
   262	                }
   263	            }
   264	            if (!resolvedNestedPath && core_1.SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
   265	                const activeDir = (0, core_1.findActiveSpecsDir)();
   266	                if (activeDir) {
   267	                    resolvedNestedPath = path.join(activeDir, ...segments);
   268	                }
   269	            }
   270	        }
   271	    }
   272	    if (resolvedNestedPath) {
   273	        return resolvedNestedPath;
   274	    }
   275	    const isSpecFolderPath = (rawArg.startsWith('specs/') ||
   276	        rawArg.startsWith('.opencode/specs/') ||
   277	        core_1.SPEC_FOLDER_BASIC_PATTERN.test(folderName)) && !rawArg.endsWith('.json');
   278	    return isSpecFolderPath ? rawArg : null;
   279	}
   280	function extractPayloadSpecFolder(data) {

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1810,1915p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1210,1338p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1210	      processed: found,
  1211	      recovered,
  1212	      failed,
  1213	      results: rawResults,
  1214	    };
  1215	
  1216	    if (recoveryResult.found > 0) {
  1217	      console.error(`[context-server] Pending file recovery: ${recoveryResult.recovered} recovered, ${recoveryResult.failed} failed (${recoveryResult.found} total)`);
  1218	    } else {
  1219	      console.error('[context-server] No pending memory files found');
  1220	    }
  1221	
  1222	    return recoveryResult;
  1223	  } catch (error: unknown) {
  1224	    const message = error instanceof Error ? error.message : String(error);
  1225	    console.error(`[context-server] Pending file recovery error: ${message}`);
  1226	    return { found: 0, processed: 0, recovered: 0, failed: 0, results: [] };
  1227	  }
  1228	}
  1229	
  1230	async function startupScan(basePath: string): Promise<void> {
  1231	  if (startupScanInProgress) {
  1232	    console.error('[context-server] Startup scan already in progress, skipping');
  1233	    return;
  1234	  }
  1235	
  1236	  startupScanInProgress = true;
  1237	  try {
  1238	    console.error('[context-server] Waiting for embedding model to be ready...');
  1239	    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
  1240	
  1241	    if (!modelReady) {
  1242	      console.error('[context-server] Startup scan skipped: embedding model not ready');
  1243	      console.error('[context-server] Run memory_index_scan manually after model loads');
  1244	      return;
  1245	    }
  1246	
  1247	    // T107: Recover any pending files from previous failed index operations
  1248	    await recoverPendingFiles(basePath);
  1249	
  1250	    console.error('[context-server] Starting background scan for new memory files...');
  1251	    const scanRoots = Array.from(
  1252	      new Set(
  1253	        [basePath, ...ALLOWED_BASE_PATHS]
  1254	          .filter((root): root is string => typeof root === 'string' && root.trim().length > 0)
  1255	          .map((root) => path.resolve(root))
  1256	      )
  1257	    );
  1258	    const allFiles: string[] = [];
  1259	    const seen = new Set<string>();
  1260	
  1261	    for (const root of scanRoots) {
  1262	      try {
  1263	        const rootFiles = [
  1264	          ...memoryParser.findMemoryFiles(root),
  1265	          ...memoryIndexDiscovery.findConstitutionalFiles(root),
  1266	          ...memoryIndexDiscovery.findSpecDocuments(root),
  1267	        ];
  1268	
  1269	        for (const filePath of rootFiles) {
  1270	          const resolved = path.resolve(filePath);
  1271	          if (!seen.has(resolved)) {
  1272	            seen.add(resolved);
  1273	            allFiles.push(filePath);
  1274	          }
  1275	        }
  1276	      } catch (_error: unknown) {
  1277	        // Non-fatal: skip inaccessible startup roots.
  1278	      }
  1279	    }
  1280	
  1281	    if (allFiles.length === 0) {
  1282	      console.error('[context-server] No memory files found in workspace');
  1283	      return;
  1284	    }
  1285	
  1286	    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
  1287	    let indexed = 0, updated = 0, unchanged = 0, failed = 0;
  1288	
  1289	    for (const filePath of allFiles) {
  1290	      try {
  1291	        const result: IndexResult = await indexSingleFile(filePath, false);
  1292	        if (result.status === 'indexed') indexed++;
  1293	        else if (result.status === 'updated') updated++;
  1294	        else unchanged++;
  1295	      } catch (error: unknown) {
  1296	        failed++;
  1297	        const message = error instanceof Error ? error.message : String(error);
  1298	        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
  1299	      }
  1300	    }
  1301	
  1302	    if (indexed > 0 || updated > 0) {
  1303	      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
  1304	    } else {
  1305	      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
  1306	    }
  1307	
  1308	    if (indexed > 0 || updated > 0) {
  1309	      try {
  1310	        runPostMutationHooks('scan', {
  1311	          indexed,
  1312	          updated,
  1313	          staleDeleted: 0,
  1314	          staleDeleteFailed: 0,
  1315	          operation: 'startup-scan',
  1316	        });
  1317	      } catch (_error: unknown) {
  1318	        // Non-fatal: startup scan must continue even if invalidation hooks fail.
  1319	      }
  1320	    }
  1321	
  1322	    // Log atomicity metrics for monitoring (CHK-190)
  1323	    const metrics = transactionManager.getMetrics();
  1324	    if (metrics.totalRecoveries > 0 || metrics.totalErrors > 0) {
  1325	      console.error(`[context-server] Atomicity metrics: ${metrics.totalAtomicWrites} successful, ${metrics.totalErrors} failed, ${metrics.totalRecoveries} recovered`);
  1326	    }
  1327	  } catch (error: unknown) {
  1328	    const message = error instanceof Error ? error.message : String(error);
  1329	    console.error(`[context-server] Startup scan error: ${message}`);
  1330	  } finally {
  1331	    startupScanInProgress = false;
  1332	  }
  1333	}
  1334	
  1335	/* ───────────────────────────────────────────────────────────────
  1336	   7. GRACEFUL SHUTDOWN
  1337	──────────────────────────────────────────────────────────────── */
  1338	

 succeeded in 0ms:
  1810	      const message = sessionErr instanceof Error ? sessionErr.message : String(sessionErr);
  1811	      console.warn('[context-server] Session manager failed:', message);
  1812	    }
  1813	
  1814	    // P0-3: Async ingestion job queue initialization + crash recovery reset.
  1815	    try {
  1816	      const ingestInit = initIngestJobQueue({
  1817	        processFile: async (filePath: string) => {
  1818	          await indexSingleFile(filePath, false);
  1819	        },
  1820	      });
  1821	      if (ingestInit.resetCount > 0) {
  1822	        console.error(`[context-server] Ingest crash recovery reset ${ingestInit.resetCount} incomplete job(s) to queued`);
  1823	      }
  1824	    } catch (ingestInitErr: unknown) {
  1825	      const message = ingestInitErr instanceof Error ? ingestInitErr.message : String(ingestInitErr);
  1826	      console.warn('[context-server] Ingest queue init failed:', message);
  1827	    }
  1828	
  1829	    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
  1830	    if (isFileWatcherEnabled()) {
  1831	      try {
  1832	        const watchPaths = getSpecsBasePaths(DEFAULT_BASE_PATH);
  1833	        if (watchPaths.length > 0) {
  1834	          fileWatcher = startFileWatcher({
  1835	            paths: watchPaths,
  1836	            reindexFn: async (filePath: string) => {
  1837	              const result = await indexSingleFile(filePath, false);
  1838	              if (isMutationStatus(result.status)) {
  1839	                try {
  1840	                  runPostMutationHooks('scan', {
  1841	                    indexed: result.status === 'indexed' || result.status === 'deferred' ? 1 : 0,
  1842	                    updated: result.status === 'updated' || result.status === 'reinforced' ? 1 : 0,
  1843	                    staleDeleted: 0,
  1844	                    staleDeleteFailed: 0,
  1845	                    operation: 'file-watcher-reindex',
  1846	                    filePath,
  1847	                    status: result.status,
  1848	                  });
  1849	                } catch (_error: unknown) {
  1850	                  // Non-fatal by design for file-watcher callback path.
  1851	                }
  1852	              }
  1853	            },
  1854	            removeFn: async (filePath: string) => {
  1855	              await removeIndexedMemoriesForFile(filePath);
  1856	            },
  1857	          });
  1858	          console.error(`[context-server] File watcher started for ${watchPaths.length} path(s)`);
  1859	        } else {
  1860	          console.warn('[context-server] File watcher enabled, but no spec directories were found');
  1861	        }
  1862	      } catch (watchErr: unknown) {
  1863	        const message = watchErr instanceof Error ? watchErr.message : String(watchErr);
  1864	        console.warn('[context-server] File watcher startup failed:', message);
  1865	      }
  1866	    }
  1867	  } catch (err: unknown) {
  1868	    const message = err instanceof Error ? err.message : String(err);
  1869	    console.error('[context-server] Integrity check failed:', message);
  1870	    throw err instanceof Error ? err : new Error(message);
  1871	  }
  1872	
  1873	  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
  1874	  if (isDynamicInitEnabled()) {
  1875	    try {
  1876	      const dynamicInstructions = await buildServerInstructions();
  1877	      if (dynamicInstructions.length > 0) {
  1878	        serverWithInstructions.setInstructions?.(dynamicInstructions);
  1879	      }
  1880	    } catch (instructionErr: unknown) {
  1881	      const message = instructionErr instanceof Error ? instructionErr.message : String(instructionErr);
  1882	      console.warn('[context-server] Dynamic instructions init failed (non-fatal):', message);
  1883	    }
  1884	  }
  1885	
  1886	  transport = new StdioServerTransport();
  1887	  await server.connect(transport);
  1888	  console.error('[context-server] Context MCP server running on stdio');
  1889	
  1890	  // Background startup scan
  1891	  setImmediate(() => startupScan(DEFAULT_BASE_PATH));
  1892	}
  1893	
  1894	const isMain = process.argv[1] && decodeURIComponent(import.meta.url).endsWith(process.argv[1].replace(/\\/g, '/'));
  1895	
  1896	if (isMain) {
  1897	  main().catch((err: unknown) => { console.error('[context-server] Fatal error:', err); process.exit(1); });
  1898	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '160,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts | sed -n '320,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	    freshness: 'empty' as const,
   321	    action: 'none' as const,
   322	    inlineIndexPerformed: false,
   323	    reason: 'readiness check not run',
   324	  };
   325	
   326	  // Auto-trigger: ensure graph is fresh before querying
   327	  try {
   328	    readiness = await ensureCodeGraphReady(process.cwd(), {
   329	      allowInlineIndex: true,
   330	      allowInlineFullScan: false,
   331	    });
   332	  } catch {
   333	    // Non-blocking: continue with potentially stale data
   334	  }
   335	
   336	  const { operation, subject, limit = 50 } = args;
   337	  const requestedEdgeType = resolveRequestedEdgeType(args);
   338	  const maxDepth = args.maxDepth ?? 3;
   339	
   340	  if (operation === 'outline') {
   341	    const nodes = graphDb.queryOutline(subject);
   342	    const limited = nodes.slice(0, limit);
   343	    return {
   344	      content: [{
   345	        type: 'text',
   346	        text: JSON.stringify({
   347	          status: 'ok',
   348	          data: buildGraphQueryPayload({
   349	            operation: 'outline',
   350	            filePath: subject,
   351	            readiness,
   352	            nodeCount: limited.length,
   353	            nodes: limited.map(n => ({
   354	              name: n.name,
   355	              kind: n.kind,
   356	              fqName: n.fqName,
   357	              line: n.startLine,
   358	              signature: n.signature,
   359	              symbolId: n.symbolId,
   360	            })),
   361	          }, readiness, 'code_graph_query outline payload'),
   362	        }, null, 2),
   363	      }],
   364	    };
   365	  }
   366	
   367	  if (operation === 'blast_radius') {
   368	    const rawSubjects = args.unionMode === 'multi'
   369	      ? [subject, ...(args.subjects ?? [])]
   370	      : [subject];
   371	    const sourceFiles = rawSubjects
   372	      .map((candidate) => graphDb.resolveSubjectFilePath(candidate) ?? candidate)
   373	      .filter((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0);
   374	
   375	    if (sourceFiles.length === 0) {
   376	      return {
   377	        content: [{
   378	          type: 'text',
   379	          text: JSON.stringify({ status: 'error', error: `Could not resolve blast-radius sources: ${rawSubjects.join(', ')}` }),
   380	        }],
   381	      };
   382	    }
   383	
   384	    const blastRadius = computeBlastRadius(sourceFiles, maxDepth, limit);
   385	    return {
   386	      content: [{
   387	        type: 'text',
   388	        text: JSON.stringify({
   389	          status: 'ok',
   390	          data: buildGraphQueryPayload({
   391	            operation,
   392	            sourceFiles: blastRadius.sourceFiles,
   393	            nodes: blastRadius.nodes,
   394	            multiFileUnion: args.unionMode === 'multi' && blastRadius.sourceFiles.length > 1,
   395	            unionMode: args.unionMode ?? 'single',
   396	            maxDepth: Math.max(0, maxDepth),
   397	            readiness,
   398	            affectedFiles: blastRadius.affectedFiles,
   399	            hotFileBreadcrumbs: blastRadius.hotFileBreadcrumbs,
   400	          }, readiness, 'code_graph_query blast_radius payload'),
   401	        }, null, 2),
   402	      }],
   403	    };
   404	  }
   405	
   406	  const symbolId = resolveSubject(subject);
   407	  if (!symbolId) {
   408	    return {
   409	      content: [{
   410	        type: 'text',
   411	        text: JSON.stringify({ status: 'error', error: `Could not resolve subject: ${subject}` }),
   412	      }],
   413	    };
   414	  }
   415	
   416	  // If includeTransitive, use BFS traversal instead of 1-hop
   417	  if (args.includeTransitive) {
   418	    const direction = operation.endsWith('from') ? 'from' : 'to';
   419	    const transitive = transitiveTraversal(symbolId, requestedEdgeType ?? 'CALLS', direction, maxDepth, limit);
   420	    return {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got the key contrast emerging: Mex’s hot path is mostly markdown/file-system scans plus git probes, while Spec Kit Memory’s hot path layers embeddings, telemetry, session state, and graph readiness around retrieval and startup. I’m drilling into the individual checkers and local startup/retrieval code now so the trade-offs are backed by exact call sites and thresholds.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Save Handler
     3	// ───────────────────────────────────────────────────────────────
     4	/* --- 1. DEPENDENCIES --- */
     5	
     6	// Node built-ins
     7	import { randomUUID } from 'node:crypto';
     8	import * as fs from 'node:fs';
     9	import path from 'path';
    10	
    11	// Shared packages
    12	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    13	import {
    14	  evaluateMemorySufficiency,
    15	  MEMORY_SUFFICIENCY_REJECTION_CODE,
    16	  type MemorySufficiencyResult,
    17	} from '@spec-kit/shared/parsing/memory-sufficiency';
    18	import {
    19	  validateMemoryTemplateContract,
    20	  type MemoryTemplateContractResult,
    21	} from '@spec-kit/shared/parsing/memory-template-contract';
    22	import {
    23	  evaluateSpecDocHealth,
    24	  type SpecDocHealthResult,
    25	} from '@spec-kit/shared/parsing/spec-doc-health';
    26	
    27	// Internal modules
    28	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
    29	import { createFilePathValidator } from '../utils/validators.js';
    30	import * as memoryParser from '../lib/parsing/memory-parser.js';
    31	import * as transactionManager from '../lib/storage/transaction-manager.js';
    32	import * as checkpoints from '../lib/storage/checkpoints.js';
    33	import * as preflight from '../lib/validation/preflight.js';
    34	import { requireDb } from '../utils/index.js';
    35	import type { MCPResponse } from './types.js';
    36	import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
    37	import * as causalEdges from '../lib/storage/causal-edges.js';
    38	
    39	import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
    40	import { isSaveQualityGateEnabled } from '../lib/search/search-flags.js';
    41	
    42	import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
    43	import { findSimilarMemories } from './pe-gating.js';
    44	import { runPostMutationHooks } from './mutation-hooks.js';
    45	import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
    46	import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator.js';
    47	import { applyPostInsertMetadata } from './save/db-helpers.js';
    48	import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
    49	import {
    50	  buildGovernancePostInsertFields,
    51	  ensureGovernanceRuntime,
    52	  recordGovernanceAudit,
    53	  validateGovernedIngest,
    54	} from '../lib/governance/scope-governance.js';
    55	import {
    56	  assertSharedSpaceAccess,
    57	  recordSharedConflict,
    58	} from '../lib/collab/shared-spaces.js';
    59	import { delete_memory_from_database } from '../lib/search/vector-index-mutations.js';
    60	import {
    61	  runQualityLoop,
    62	} from './quality-loop.js';
    63	import type {
    64	  QualityLoopResult,
    65	} from './quality-loop.js';
    66	
    67	// O2-5/O2-12: V-rule validation (previously only in workflow path)
    68	import {
    69	  validateMemoryQualityContent,
    70	  determineValidationDisposition,
    71	} from './v-rule-bridge.js';
    72	
    73	// Save pipeline modules (CR-P2-4 decomposition)
    74	import type {
    75	  IndexResult,
    76	  SaveArgs,
    77	  AtomicSaveParams,
    78	  AtomicSaveOptions,
    79	  AtomicSaveResult,
    80	} from './save/index.js';
    81	import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
    82	import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
    83	import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
    84	import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
    85	import { runPostInsertEnrichment } from './save/post-insert.js';
    86	import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
    87	import { createMCPErrorResponse } from '../lib/response/envelope.js';
    88	
    89	// Extracted sub-modules
    90	import { withSpecFolderLock } from './save/spec-folder-mutex.js';
    91	import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
    92	import {
    93	  applyInsufficiencyMetadata,
    94	  buildInsufficiencyRejectionResult,
    95	  buildTemplateContractRejectionResult,
    96	  buildDryRunSummary,
    97	} from './save/validation-responses.js';
    98	
    99	import { markMemorySuperseded } from './pe-gating.js';
   100	import { resolveMemoryReference } from './causal-links-processor.js';
   101	import { refreshAutoEntitiesForMemory } from '../lib/extraction/entity-extractor.js';
   102	
   103	// Feature catalog: Memory indexing (memory_save)
   104	// Feature catalog: Verify-fix-verify memory quality loop
   105	// Feature catalog: Dry-run preflight for memory_save
   106	// Feature catalog: Prediction-error save arbitration
   107	
   108	
   109	// Create local path validator
   110	const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
   111	const MANUAL_FALLBACK_SOURCE_CLASSIFICATION = 'manual-fallback' as const;
   112	
   113	interface PreparedParsedMemory {
   114	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
   115	  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
   116	  qualityLoopResult: QualityLoopResult;
   117	  sufficiencyResult: MemorySufficiencyResult;
   118	  templateContract: MemoryTemplateContractResult;
   119	  specDocHealth: SpecDocHealthResult | null;
   120	  finalizedFileContent: string | null;
   121	  sourceClassification: 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
   122	}
   123	
   124	type ParsedMemoryWithIndexHints = ReturnType<typeof memoryParser.parseMemoryFile> & {
   125	  _skipIndex?: boolean;
   126	  _vRuleIndexBlockIds?: string[];
   127	};
   128	
   129	const STANDARD_MEMORY_TEMPLATE_MARKERS = [
   130	  '## continue session',
   131	  '## recovery hints',
   132	  '<!-- memory metadata -->',
   133	];
   134	
   135	class VRuleUnavailableError extends Error {
   136	  constructor(message: string) {
   137	    super(message);
   138	    this.name = 'VRuleUnavailableError';
   139	  }
   140	}
   141	
   142	function isVRuleUnavailableResult(value: unknown): value is {
   143	  passed: false;
   144	  status: 'error' | 'warning';
   145	  message: string;
   146	  _unavailable: true;
   147	} {
   148	  return typeof value === 'object'
   149	    && value !== null
   150	    && 'passed' in value
   151	    && (value as { passed?: unknown }).passed === false
   152	    && 'status' in value
   153	    && typeof (value as { status?: unknown }).status === 'string'
   154	    && 'message' in value
   155	    && typeof (value as { message?: unknown }).message === 'string';
   156	}
   157	
   158	function classifyMemorySaveSource(
   159	  content: string,
   160	): 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION {
   161	  const normalizedContent = content.toLowerCase();
   162	  const hasAnyStandardMarker = STANDARD_MEMORY_TEMPLATE_MARKERS.some((marker) => normalizedContent.includes(marker));
   163	  return hasAnyStandardMarker ? 'template-generated' : MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
   164	}
   165	
   166	function shouldBypassTemplateContract(
   167	  sourceClassification: PreparedParsedMemory['sourceClassification'],
   168	  sufficiencyResult: MemorySufficiencyResult,
   169	  templateContract: MemoryTemplateContractResult,
   170	): boolean {
   171	  return sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION
   172	    && sufficiencyResult.pass
   173	    && sufficiencyResult.evidenceCounts.primary === 0
   174	    && sufficiencyResult.evidenceCounts.support >= 3
   175	    && sufficiencyResult.evidenceCounts.anchors >= 1
   176	    && !templateContract.valid;
   177	}
   178	
   179	function buildQualityLoopMetadata(
   180	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   181	  database: ReturnType<typeof requireDb>,
   182	): Record<string, unknown> {
   183	  return {
   184	    title: parsed.title ?? '',
   185	    triggerPhrases: parsed.triggerPhrases,
   186	    specFolder: parsed.specFolder,
   187	    contextType: parsed.contextType,
   188	    importanceTier: parsed.importanceTier,
   189	    causalLinks: parsed.causalLinks,
   190	    filePath: parsed.filePath,
   191	    lastModified: parsed.lastModified,
   192	    resolveReference: (reference: string) => resolveMemoryReference(database, reference) !== null,
   193	  };
   194	}
   195	
   196	function prepareParsedMemoryForIndexing(
   197	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   198	  database: ReturnType<typeof requireDb>,
   199	  options: {
   200	    emitEvalMetrics?: boolean;
   201	  } = {},
   202	): PreparedParsedMemory {
   203	  const validation = memoryParser.validateParsedMemory(parsed);
   204	  if (validation.warnings && validation.warnings.length > 0) {
   205	    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
   206	    validation.warnings.forEach((warning: string) => console.warn(`[memory]   - ${warning}`));
   207	  }
   208	
   209	  // O2-5/O2-12: Run V-rule validation (previously only in workflow path)
   210	  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
   211	  if (isVRuleUnavailableResult(vRuleResult) && vRuleResult.status === 'error') {
   212	    throw new VRuleUnavailableError(vRuleResult.message);
   213	  }
   214	  if (vRuleResult && '_unavailable' in vRuleResult) {
   215	    validation.warnings.push('V-rule validator module unavailable — quality gate bypassed. Save proceeds without V-rule enforcement.');
   216	  }
   217	  if (vRuleResult && !isVRuleUnavailableResult(vRuleResult) && !vRuleResult.valid) {
   218	    const vRuleDisposition = determineValidationDisposition(
   219	      vRuleResult.failedRules,
   220	      parsed.memoryTypeSource || null,
   221	    );
   222	    if (vRuleDisposition && vRuleDisposition.disposition === 'abort_write') {
   223	      const failedRuleIds = vRuleDisposition.blockingRuleIds;
   224	      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
   225	      // Return early with a rejected quality loop result so callers see the block
   226	      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
   227	      return {
   228	        parsed,
   229	        validation,
   230	        qualityLoopResult: {
   231	          passed: false,
   232	          score: rejectScore,
   233	          attempts: 0,
   234	          fixes: [],
   235	          rejected: true,
   236	          rejectionReason: `V-rule hard block: ${failedRuleIds.join(', ')}`,
   237	        },
   238	        sufficiencyResult: {
   239	          pass: false,
   240	          rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
   241	          score: 0,
   242	          reasons: [`V-rule hard block: ${failedRuleIds.join(', ')}`],
   243	          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
   244	        },
   245	        templateContract: { valid: false, violations: [], missingAnchors: [], unexpectedTemplateArtifacts: [] } as MemoryTemplateContractResult,
   246	        specDocHealth: null,
   247	        finalizedFileContent: null,
   248	        sourceClassification: 'template-generated',
   249	      };
   250	    }
   251	    if (vRuleDisposition && vRuleDisposition.disposition === 'write_skip_index') {
   252	      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
   253	      validation.warnings.push(`V-rule index block: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
   254	      // F07-002: Flag to skip indexing for write_skip_index disposition
   255	      const parsedWithIndexHints = parsed as ParsedMemoryWithIndexHints;
   256	      parsedWithIndexHints._skipIndex = true;
   257	      parsedWithIndexHints._vRuleIndexBlockIds = vRuleDisposition.indexBlockingRuleIds;
   258	    }
   259	  }
   260	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Index
     3	// ───────────────────────────────────────────────────────────────
     4	import path from 'path';
     5	
     6	/* ───────────────────────────────────────────────────────────────
     7	   1. CORE AND UTILS IMPORTS
     8	──────────────────────────────────────────────────────────────── */
     9	
    10	import { checkDatabaseUpdated } from '../core/index.js';
    11	import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config.js';
    12	import { acquireIndexScanLease, completeIndexScanLease } from '../core/db-state.js';
    13	import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils/index.js';
    14	import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
    15	
    16	/* ───────────────────────────────────────────────────────────────
    17	   2. LIB MODULE IMPORTS
    18	──────────────────────────────────────────────────────────────── */
    19	
    20	import { recordHistory } from '../lib/storage/history.js';
    21	import * as checkpoints from '../lib/storage/checkpoints.js';
    22	import * as memoryParser from '../lib/parsing/memory-parser.js';
    23	import * as embeddings from '../lib/providers/embeddings.js';
    24	import * as incrementalIndex from '../lib/storage/incremental-index.js';
    25	import * as vectorIndex from '../lib/search/vector-index.js';
    26	import { runPostMutationHooks } from './mutation-hooks.js';
    27	import {
    28	  findConstitutionalFiles,
    29	  findSpecDocuments,
    30	  detectSpecLevel,
    31	} from './memory-index-discovery.js';
    32	import {
    33	  EMPTY_ALIAS_CONFLICT_SUMMARY,
    34	  createDefaultDivergenceReconcileSummary,
    35	  detectAliasConflictsFromIndex,
    36	  summarizeAliasConflicts,
    37	  runDivergenceReconcileHooks,
    38	  type AliasConflictSummary,
    39	  type DivergenceReconcileSummary,
    40	} from './memory-index-alias.js';
    41	
    42	// REQ-019: Standardized Response Structure
    43	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
    44	
    45	// Shared handler types
    46	import type { MCPResponse, EmbeddingProfile } from './types.js';
    47	
    48	// Feature catalog: Workspace scanning and indexing (memory_index_scan)
    49	// Feature catalog: Async ingestion job lifecycle
    50	
    51	
    52	/* ───────────────────────────────────────────────────────────────
    53	   4. TYPES
    54	──────────────────────────────────────────────────────────────── */
    55	
    56	interface IndexResult {
    57	  status: string;
    58	  id?: number;
    59	  specFolder?: string;
    60	  title?: string | null;
    61	  error?: string;
    62	  errorDetail?: string;
    63	  [key: string]: unknown;
    64	}
    65	
    66	/** Type guard: distinguishes IndexResult from RetryErrorResult via the 'status' property */
    67	function isIndexResult(result: IndexResult | RetryErrorResult): result is IndexResult {
    68	  return (
    69	    typeof result === 'object' &&
    70	    result !== null &&
    71	    typeof (result as { status?: unknown }).status === 'string' &&
    72	    !('retries_failed' in result)
    73	  );
    74	}
    75	
    76	/** Individual file result from a memory index scan. */
    77	interface ScanFileEntry {
    78	  file: string;
    79	  filePath?: string;
    80	  status?: string;
    81	  specFolder?: string;
    82	  id?: number;
    83	  isConstitutional?: boolean;
    84	  error?: string;
    85	  errorDetail?: string;
    86	}
    87	
    88	interface ScanResults {
    89	  scanned: number;
    90	  indexed: number;
    91	  updated: number;
    92	  unchanged: number;
    93	  failed: number;
    94	  skipped_mtime: number;
    95	  mtimeUpdates: number;
    96	  staleDeleted: number;
    97	  staleDeleteFailed: number;
    98	  files: ScanFileEntry[];
    99	  constitutional: {
   100	    found: number;
   101	    indexed: number;
   102	    alreadyIndexed: number;
   103	  };
   104	  incremental: {
   105	    enabled: boolean;
   106	    fast_path_skips: number;
   107	    mtime_changed: number;
   108	  };
   109	  dedup: {
   110	    inputTotal: number;
   111	    uniqueTotal: number;
   112	    duplicatesSkipped: number;
   113	  };
   114	  aliasConflicts: AliasConflictSummary;
   115	  divergenceReconcile: DivergenceReconcileSummary;
   116	}
   117	
   118	interface CategorizedFiles {
   119	  toIndex: string[];
   120	  toUpdate: string[];
   121	  toSkip: string[];
   122	  toDelete: string[];
   123	}
   124	
   125	interface ScanArgs {
   126	  specFolder?: string | null;
   127	  force?: boolean;
   128	  includeConstitutional?: boolean;
   129	  includeSpecDocs?: boolean;
   130	  incremental?: boolean;
   131	}
   132	
   133	/* ───────────────────────────────────────────────────────────────
   134	   5. SHARED INDEXING LOGIC
   135	──────────────────────────────────────────────────────────────── */
   136	
   137	import { indexMemoryFile } from './memory-save.js';
   138	
   139	/** Index a single memory file, delegating to the shared indexMemoryFile logic */
   140	async function indexSingleFile(filePath: string, force: boolean = false, options?: { qualityGateMode?: 'enforce' | 'warn-only' }): Promise<IndexResult> {
   141	  return indexMemoryFile(filePath, { force, qualityGateMode: options?.qualityGateMode });
   142	}
   143	
   144	/* ───────────────────────────────────────────────────────────────
   145	   6. MEMORY INDEX SCAN HANDLER
   146	──────────────────────────────────────────────────────────────── */
   147	
   148	/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
   149	async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
   150	  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
   151	  if (restoreBarrier) {
   152	    return createMCPErrorResponse({
   153	      tool: 'memory_index_scan',
   154	      error: restoreBarrier.message,
   155	      code: restoreBarrier.code,
   156	      recovery: {
   157	        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
   158	        actions: ['Wait for the restore to finish', 'Retry the index scan'],
   159	        severity: 'warning',
   160	      },
   161	    });
   162	  }
   163	
   164	  const {
   165	    specFolder: spec_folder = null,
   166	    force = false,
   167	    includeConstitutional: include_constitutional = true,
   168	    includeSpecDocs: include_spec_docs = true,
   169	    incremental = true
   170	  } = args;
   171	
   172	  // Pre-flight dimension check
   173	  try {
   174	    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
   175	    if (profile) {
   176	      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
   177	    }
   178	  } catch (dimCheckError: unknown) {
   179	    const message = toErrorMessage(dimCheckError);
   180	    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
   181	  }
   182	
   183	  await checkDatabaseUpdated();
   184	
   185	  // L15/T303: Atomic scan lease check.
   186	  // Reserve scan_started_at up front to avoid check-then-set race windows.
   187	  const now = Date.now();
   188	  const lease = await acquireIndexScanLease({
   189	    now,
   190	    cooldownMs: INDEX_SCAN_COOLDOWN,
   191	  });
   192	  if (!lease.acquired) {
   193	    const waitTime = Math.max(lease.waitSeconds, 1);
   194	    return createMCPErrorResponse({
   195	      tool: 'memory_index_scan',
   196	      error: 'Rate limited',
   197	      code: 'E429',
   198	      details: {
   199	        waitSeconds: waitTime,
   200	        reason: lease.reason,
   201	      },
   202	      recovery: {
   203	        hint: `Please wait ${waitTime} seconds before scanning again`,
   204	        actions: ['Wait for cooldown period', 'Consider using incremental=true for faster subsequent scans'],
   205	        severity: 'warning'
   206	      }
   207	    });
   208	  }
   209	
   210	  const workspacePath: string = DEFAULT_BASE_PATH;
   211	
   212	  const specFiles: string[] = memoryParser.findMemoryFiles(workspacePath, { specFolder: spec_folder });
   213	  const constitutionalFiles: string[] = include_constitutional ? findConstitutionalFiles(workspacePath) : [];
   214	  const specDocFiles: string[] = include_spec_docs ? findSpecDocuments(workspacePath, { specFolder: spec_folder }) : [];
   215	
   216	  const canonicalKeyCache = new Map<string, string>();
   217	  const getCachedKey = (filePath: string): string => {
   218	    const cached = canonicalKeyCache.get(filePath);
   219	    if (cached) {
   220	      return cached;
   221	    }
   222	
   223	    const canonicalKey = getCanonicalPathKey(filePath);
   224	    canonicalKeyCache.set(filePath, canonicalKey);
   225	    return canonicalKey;
   226	  };
   227	
   228	  const mergedFiles = [...specFiles, ...constitutionalFiles, ...specDocFiles];
   229	  const specDocKeySet = new Set(specDocFiles.map((f) => getCachedKey(f)));
   230	  const seenCanonicalFiles = new Set<string>();
   231	  const files: string[] = [];
   232	
   233	  for (const filePath of mergedFiles) {
   234	    const canonicalKey = getCachedKey(filePath);
   235	    if (seenCanonicalFiles.has(canonicalKey)) {
   236	      continue;
   237	    }
   238	    seenCanonicalFiles.add(canonicalKey);
   239	    files.push(filePath);
   240	  }
   241	
   242	  const dedupDuplicatesSkipped = mergedFiles.length - files.length;
   243	  if (dedupDuplicatesSkipped > 0) {
   244	    console.error(`[memory-index-scan] Canonical dedup skipped ${dedupDuplicatesSkipped} alias path(s) (${mergedFiles.length} -> ${files.length})`);
   245	  }
   246	
   247	  const deleteStaleIndexedRecords = (paths: string[]): { deleted: number; failed: number } => {
   248	    if (paths.length === 0) {
   249	      return { deleted: 0, failed: 0 };
   250	    }
   251	
   252	    const staleRecordIds = incrementalIndex.listIndexedRecordIdsForDeletedPaths(paths);
   253	    let deleted = 0;
   254	    let failed = 0;
   255	
   256	    for (const staleRecordId of staleRecordIds) {
   257	      try {
   258	        const staleSnapshot = vectorIndex.getDb()?.prepare(
   259	          'SELECT spec_folder, file_path FROM memory_index WHERE id = ?'
   260	        ).get(staleRecordId) as { spec_folder?: string | null; file_path?: string | null } | undefined;
   261	
   262	        if (vectorIndex.deleteMemory(staleRecordId)) {
   263	          deleted++;
   264	          // Record DELETE history only after confirmed deletion.
   265	          try {
   266	            recordHistory(
   267	              staleRecordId,
   268	              'DELETE',
   269	              staleSnapshot?.file_path ?? null,
   270	              null,
   271	              'mcp:memory_index_scan',
   272	              staleSnapshot?.spec_folder ?? null,
   273	            );
   274	          } catch (_histErr: unknown) {
   275	            // History recording is best-effort
   276	          }
   277	        } else {
   278	          failed++;
   279	        }
   280	      } catch (_error: unknown) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '720,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.js: No such file or directory

 succeeded in 0ms:
   720	    normalizedQuery,
   721	    hasValidConcepts,
   722	    concepts,
   723	    specFolder,
   724	    tenantId: normalizedScope.tenantId,
   725	    userId: normalizedScope.userId,
   726	    agentId: normalizedScope.agentId,
   727	    sharedSpaceId: normalizedScope.sharedSpaceId,
   728	    limit,
   729	    mode,
   730	    tier,
   731	    contextType,
   732	    useDecay,
   733	    includeArchived,
   734	    qualityThreshold,
   735	    applyStateLimits,
   736	    includeContiguity,
   737	    includeConstitutional,
   738	    includeContent,
   739	    anchors,
   740	    detectedIntent,
   741	    minState: minState ?? '',
   742	    rerank,
   743	    applyLengthPenalty,
   744	    sessionId,
   745	    enableSessionBoost,
   746	    enableCausalBoost,
   747	    includeTrace,
   748	  });
   749	
   750	  let _evalChannelPayloads: EvalChannelPayload[] = [];
   751	  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
   752	  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
   753	  const cachedPayload = cacheEnabled
   754	    ? toolCache.get<SearchCachePayload>(cacheKey)
   755	    : null;
   756	
   757	  let responseToReturn: MCPResponse;
   758	  let goalRefinementPayload: Record<string, unknown> | null = null;
   759	
   760	  if (cachedPayload) {
   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
   762	  } else {
   763	    // Wait for embedding model only on cache miss
   764	    if (!isEmbeddingModelReady()) {
   765	      const modelReady = await waitForEmbeddingModel(30000);
   766	      if (!modelReady) {
   767	        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
   768	      }
   769	    }
   770	
   771	    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
   772	    const pipelineConfig: PipelineConfig = {
   773	      query: effectiveQuery,
   774	      concepts: hasValidConcepts ? concepts : undefined,
   775	      searchType: (hasValidConcepts && concepts!.length >= 2)
   776	        ? 'multi-concept'
   777	        : 'hybrid',
   778	      mode,
   779	      limit,
   780	      specFolder,
   781	      tenantId: normalizedScope.tenantId,
   782	      userId: normalizedScope.userId,
   783	      agentId: normalizedScope.agentId,
   784	      sharedSpaceId: normalizedScope.sharedSpaceId,
   785	      tier,
   786	      contextType,
   787	      includeArchived,
   788	      includeConstitutional,
   789	      includeContent,
   790	      anchors,
   791	      qualityThreshold,
   792	      minState: minState ?? '',
   793	      applyStateLimits,
   794	      useDecay,
   795	      rerank,
   796	      applyLengthPenalty,
   797	      sessionId,
   798	      enableDedup,
   799	      enableSessionBoost,
   800	      enableCausalBoost,
   801	      trackAccess,
   802	      detectedIntent,
   803	      intentConfidence,
   804	      intentWeights: toIntentWeightsConfig(intentWeights),
   805	      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
   806	      trace,
   807	    };
   808	
   809	    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
   810	    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
   811	
   812	    // Phase B T018/T019: Community search fallback — inject community members on weak results
   813	    let communityFallbackApplied = false;
   814	    const shouldRunCommunitySearch = (
   815	      isDualRetrievalEnabled() &&
   816	      isCommunitySearchFallbackEnabled() &&
   817	      effectiveQuery.length > 0 &&
   818	      (retrievalLevel === 'global' || retrievalLevel === 'auto')
   819	    );
   820	    if (shouldRunCommunitySearch) {
   821	      const isWeakResult = resultsForFormatting.length === 0 ||
   822	        (retrievalLevel === 'global') ||
   823	        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
   824	      if (isWeakResult) {
   825	        try {
   826	          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
   827	          if (communityResults.totalMemberIds.length > 0) {
   828	            // Fetch the actual memory rows for community member IDs
   829	            const memberIds = communityResults.totalMemberIds.slice(0, 20);
   830	            const placeholders = memberIds.map(() => '?').join(', ');
   831	            const db = requireDb();
   832	            const memberRows = db.prepare(`
   833	              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
   834	                     quality_score, created_at
   835	              FROM memory_index
   836	              WHERE id IN (${placeholders})
   837	            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
   838	
   839	            if (memberRows.length > 0) {
   840	              // Mark community-sourced results and assign a base score
   841	              const communityRows = memberRows.map((row) => ({
   842	                ...row,
   843	                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
   844	                score: 0.45,
   845	                _communityFallback: true,
   846	              }));
   847	              // Merge: append community results not already in pipeline results
   848	              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
   849	              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
   850	              if (newRows.length > 0) {
   851	                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
   852	                communityFallbackApplied = true;
   853	              }
   854	            }
   855	          }
   856	        } catch (err: unknown) {
   857	          const msg = err instanceof Error ? err.message : String(err);
   858	          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
   859	        }
   860	      }

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"embedding_cache|persistent embedding cache|FTS5|BM25|RRF|RSF|quality floor|4-stage pipeline|vector\" .opencode/README.md README.md .opencode/skill/system-spec-kit/mcp_server/lib/search -g '"'!**/*.map'"' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/README.md:45:1. **Memory Engine**: 47 MCP tools across 7 layers, with graph-first structural routing (Code Graph before semantic), 3-tier FTS fallback, 3-source indexing, 7-intent retrieval routing, schema v15 metadata (`document_type`, `spec_level`), document-type scoring, causal lineage tracking, typed-weighted degree channel, persistent embedding cache, query complexity routing, RSF fusion, confidence truncation, post-save quality gates with heuristic calibration, and CocoIndex semantic code search bridge
.opencode/README.md:138:| `mcp-coco-index` | Semantic code search via vector embeddings for concept-first code discovery (v1.0) |
.opencode/README.md:248:- **Retrieval:** Graph-first routing (structural Code Graph before semantic CocoIndex), hybrid search across vector, BM25, FTS5, trigger matching and typed-weighted degree channels with RRF + RSF (Reciprocal Similarity Fusion) fusion, 3-tier FTS fallback (FTS5 full-text -> BM25 keyword scoring -> Grep/Glob filesystem search when graph and semantic channels miss), cross-encoder reranking, query complexity routing (simple/moderate/complex), confidence truncation (2x median gap), persistent embedding cache and interference scoring
.opencode/README.md:252:- **Features:** Constitutional tier, session deduplication, causal lineage tracking, temporal decay, learning analytics, typed retrieval contracts, artifact-class routing, adaptive fusion, append-only mutation ledger, extended retrieval telemetry, session-cognitive automation (attention-based decay, tiered content injection, co-activation of related memories), persistent embedding cache (SQLite `embedding_cache` table), interference scoring (TM-01 penalty), classification-based decay (TM-03 context-type + importance-tier multipliers), query complexity routing (simple/moderate/complex tier dispatch), RSF fusion (single-pair, multi-list, cross-variant alternatives to RRF), channel min-representation (QUALITY_FLOOR=0.2), confidence truncation (2x median gap, min 3 results), dynamic token budget (1500/2500/4000 by tier), cold-start N4 boost, min-max score normalization, co-activation fan-effect (sqrt divisor), CORRECTION/PREFERENCE signal categories, pre-flight token budget estimation, verify-fix-verify quality loop, spec folder description discovery, post-save quality gates (structure/semantic/duplicate with heuristic calibration and trigger sanitization), graph-first structural routing (Code Graph -> CocoIndex -> Memory), 3-tier FTS fallback chain (PI-A2), CocoIndex semantic code search bridge, and ~14 `SPECKIT_*` feature flags
.opencode/README.md:253:- **Hardening (Spec126):** import-path fixes, `specFolder` filtering, metadata preservation, vector metadata plumbing and stable causal edge semantics
README.md:65:| **🔍 CocoIndex Code** | Semantic code search via vector embeddings — natural-language discovery across 28+ languages |
README.md:103:         │  BM25, FTS5, Causal Graph, Degree        │
README.md:105:         │  FSRS decay ─ RRF fusion ─ query intel   │
README.md:282:- **`reindex-embeddings.ts`** - Rebuild embedding vectors for stored memories
README.md:283:- **`cleanup-orphaned-vectors.ts`** - Remove vector entries with no matching memory
README.md:346:The Memory Engine is a local-first cognitive memory system built as an MCP server. Memory files are created via `generate-context.js` and stored in spec folders. The MCP server indexes them with vector embeddings, BM25 and FTS5 full-text search. When you start a session, `memory_match_triggers()` surfaces relevant prior context automatically.
README.md:374:- **FTS5** - Full-text search on exact words and phrases.
README.md:375:- **BM25** - Keyword relevance scoring.
README.md:379:**Reciprocal Rank Fusion (RRF)** combines results across channels so memories scoring well in multiple channels rise to the top. **Graph-first routing** dispatches structural queries to the Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline. A **3-tier FTS fallback** activates when graph and semantic channels miss: FTS5 full-text, BM25 keyword scoring, then Grep/Glob filesystem search. The system truncates weak results and ensures every active channel is represented.
README.md:387:- **Fusion** - RRF-based scoring with post-fusion signals such as co-activation, FSRS decay, interference control, intent weights, and graph/session boosts when enabled.
README.md:695:- Database admin: stats (memory counts, index health), health checks, cleanup (orphaned vectors)
README.md:834:- Semantic code search via vector embeddings (Voyage Code 3 and All-MiniLM-L6-v2 models)
README.md:903:| `cocoindex_code` | 1 | Semantic code search via vector embeddings |
README.md:987:The runtime centers on a SQLite `memory_index` table with 56 columns plus companion FTS5/vector, lineage, checkpoint, working-memory, shared-memory, and eval tables.
README.md:990:- **Search companions** - FTS5 and vector tables support lexical and embedding retrieval alongside BM25 rebuild/index data.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// Combines vector, FTS, and BM25 search with fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:138:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:216: * Absolute quality floor for degradation checks.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:236:/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:238:/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:let vectorSearchFn: VectorSearchFn | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:310:  vectorFn: VectorSearchFn | null = null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:314:  vectorSearchFn = vectorFn;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:318:// 8. BM25 SEARCH
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:321: * Search the BM25 index with optional spec folder filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:341:    // BM25 document IDs are stringified
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:347:    // resolution returns [] rather than leaking unscoped BM25 candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:352:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:370:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:379:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:404: * Check whether the BM25 index is populated and available for search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:405: * @returns True if the BM25 index exists and contains at least one document.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:424: * Check whether the FTS5 full-text search table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:445: * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:484: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:682:  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:688:  if (options.useVector === false) allowed.delete('vector');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:707:    useVector: allowedChannels.has('vector'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:742:  vectorEmbeddingCache: Map<number, Float32Array>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:881:      for (const r of vectorResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:886:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:901:  // BM25 search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1056:    const vectorEmbeddingCache = new Map<number, Float32Array>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1072:        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1075:          source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1084:            vectorEmbeddingCache.set(result.id, embeddingCandidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1087:        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1109:        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1195:        vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1236:        if (list.source === 'vector') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1273:      vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1296:    vectorEmbeddingCache,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1459:              source: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1776:  // Fallback to BM25 only
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:8:// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:11:// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:329:    // Apply learned triggers (Safeguard #1 -- separate column, NOT FTS5)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:348: * NEVER to the FTS5 index (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:399:    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445: * Searches the learned_triggers column (NOT FTS5) for matches against
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:31:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:61:  /** Embedding vector of the pseudo-document (Float32Array). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:353: * Run a vector-only search using the HyDE pseudo-document embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:366:export function vectorOnly(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:4:// SCHEMA_VERSION is now canonical in vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:8:/** Supported embedding input shapes for vector search and mutation operations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:11:/** Stable error codes emitted by vector-index modules. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:23:/** Structured error used by vector-index query, mutation, and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:75:/** Represents a vector-search memory row shared by query and store helpers. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:132:/** Controls vector search filtering and ranking behavior. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:232:// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:32: * Summarises Z-score statistics for the RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:39:  /** Arithmetic mean of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:41:  /** Population standard deviation of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:144: * Detect evidence gaps in an RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:20:import * as vectorIndex from './vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:164: *   3. Embedding vector is invalid (zero-length or non-finite values).
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:168: *   a. Run a vector similarity search using the provided embedding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:282: * @returns Normalized Float32Array embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:295: * Build one centroid vector per intent from seed phrases and keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:297: * @returns Map of intent types to their centroid embedding vectors
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:332: * L2-normalize a vector in place.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:334: * @param vec - Float32Array vector to normalize
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:335: * @returns The same vector, normalized to unit length
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:351: * Dot product similarity for normalized vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:353: * @param a - First vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:354: * @param b - Second vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:355: * @returns Dot product (cosine similarity for unit vectors)
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:26: * Compute cosine similarity between two vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:95: * @param embeddingFn - Async function to compute embedding vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:157: * @param queryEmbedding - Query vector to compare against stored summaries
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:90: *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:91: *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:6:// TypeScript port of the vector index implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:26:import { IVectorStore } from '../interfaces/vector-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:35:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:39:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:46:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:82:/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:100:let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:101:let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:102:let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:105:  return _cached_queries ??= await import('./vector-index-queries.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:109:  return _cached_mutations ??= await import('./vector-index-mutations.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:113:  return _cached_aliases ??= await import('./vector-index-aliases.js');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:120:/** Default embedding dimension used by the vector index. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:145:  console.warn('[vector-index] Using default dimension 768 after timeout');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:222:    reason: 'No stored vector dimension found for existing schema',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:248:      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:252:      console.error(`[vector-index] WARNING: ${warning}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:258:    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:264: * Validates that stored vector dimensions match the provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:280:/** Default path for the vector-index database file. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:327:      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:360:        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:367:    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:413:        console.warn(`[vector-index] Database connection listener failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:425:    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:499:    console.warn('[vector-index] Cache validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:728:    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:737: * Initializes the vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:773:      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:774:      console.error(`[vector-index] ${errMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:775:      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:780:          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:785:      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:786:      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787:      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:798:    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:814:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:825:    console.error(`[vector-index] FATAL: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:843: * Closes the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:860: * Gets the active vector-index database path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:868: * Gets the shared vector-index database connection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:878: * @returns True when vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:880:export function is_vector_search_available(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:888:/** Implements the vector-store interface on top of SQLite. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:945:    const { vector_search } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:946:    return vector_search(embedding, search_options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1084:    const { vector_search_enriched } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1085:    return vector_search_enriched(embedding, undefined, options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1114:    cleaned?: { vectors: number; chunks: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1137:export { is_vector_search_available as isVectorSearchAvailable };
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:47:const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48:const BM25_PRESERVING_ARTIFACTS = new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64: * - simple:   2 channels (vector + fts) — fastest path
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:69:  simple: ['vector', 'fts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:81: * fallback channels (vector, fts) until the minimum is met.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:120:  return BM25_PRESERVING_ARTIFACTS.has(artifact);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:46:  embedding: ['vector', 'representation'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:7:  - "vector search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:43:- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:59:|---> BM25 (Pure JS)            -> Keyword matches
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:63:RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:75:`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:93:| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:94:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:119:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:128:### Reciprocal Rank Fusion (RRF)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:132:**Why RRF?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:135:- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:140:- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:147:// Vector rank: 2, BM25 rank: 5, Graph rank: 1
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:148:// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:153:### BM25 (Best Matching 25)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:167:**Why BM25?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:184:| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185:| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:186:| `missing_table` | FTS5 support is present, but `memory_fts` is missing at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:187:| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:188:| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:247:| **TypeScript**       | `vector-index.ts` (typed export surface) + `vector-index-impl.ts` (14-line compatibility shim) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:253:### Facade Pattern: vector-index
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:259:vector-index.ts          (166 LOC)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:262:    - vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:263:    - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:264:    - vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:265:    - vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:266:    - vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:267:    - vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:270:vector-index-impl.ts     (14 LOC)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:272:  - Re-exports from './vector-index'
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:276:**NOTE**: Most vector-index logic now lives in the split `vector-index-*` modules. `vector-index-impl.ts` is only a compatibility adapter, so runtime changes should be made in `vector-index.ts` or the underlying split modules.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:282:| `vector-index.ts`          | 166    | TypeScript | Typed export surface re-exporting the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:283:| `vector-index-impl.ts`     | 14     | TypeScript | Backward-compatibility shim that re-exports `vector-index.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:284:| `vector-index-types.ts`    | -      | TypeScript | Shared type definitions for vector index modules    |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:285:| `vector-index-schema.ts`   | -      | TypeScript | Schema creation and migration logic                 |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:286:| `vector-index-mutations.ts`| -      | TypeScript | Insert, update, and delete operations for vector index |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:287:| `vector-index-queries.ts`  | -      | TypeScript | Query builders and search operations for vector index |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:288:| `vector-index-aliases.ts`  | -      | TypeScript | Re-export aliases for backward-compatible imports   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:289:| `vector-index-store.ts`    | -      | TypeScript | Low-level storage operations and reconsolidation helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:294:| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:323:| `embedding-expansion.ts`   | -      | TypeScript | Embedding-based query expansion for R12 multi-vector retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:366:   vector-index.ts -> Vector search (semantic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:367:   bm25-index.ts -> BM25 search (keyword)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:413:| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:430:**RRF Parameters** (hardcoded, REQ-011):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:437:**BM25 Parameters** (hardcoded, tuned):

codex
I’ve got enough source evidence to start shaping the four trade-off buckets: Mex’s checker loop is cheap but broad, our retrieval loop is richer but deeper, our startup path already pays background indexing costs Mex avoids, and our storage/indexing footprint grows faster because we persist more than markdown. I’m pulling a few final exact line references for storage and retrieval architecture so the iteration can be precise about where that overhead comes from.
exec
/bin/zsh -lc "nl -ba README.md | sed -n '340,390p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	
   341	
   342	---
   343	
   344	### 🧠 Memory Engine
   345	
   346	The Memory Engine is a local-first cognitive memory system built as an MCP server. Memory files are created via `generate-context.js` and stored in spec folders. The MCP server indexes them with vector embeddings, BM25 and FTS5 full-text search. When you start a session, `memory_match_triggers()` surfaces relevant prior context automatically.
   347	
   348	The memory engine now includes the packet-024 compact code graph and session lifecycle surfaces alongside hybrid retrieval. The full 47-tool API reference is in the [MCP Server README](.opencode/skill/system-spec-kit/mcp_server/README.md).
   349	
   350	
   351	#### 47 Tools Across 7 Layers
   352	
   353	The MCP tools are organized into a layered architecture. Each layer has a token budget that controls how much context it consumes:
   354	
   355	| Layer | Name | Tools | Token Budget | Purpose |
   356	|-------|------|-------|-------------|---------|
   357	| **L1** | Orchestration | 3 | 2,000 | Unified context, resume, and bootstrap entry points |
   358	| **L2** | Core | 4 | 1,500 | Search, quick search, trigger matching, save |
   359	| **L3** | Discovery | 4 | 800 | List, stats, health checks, and session readiness |
   360	| **L4** | Mutation | 4 | 500 | Delete, update, validate, bulk cleanup |
   361	| **L5** | Lifecycle | 8 | 600 | Checkpoints, shared spaces, and lifecycle state |
   362	| **L6** | Analysis | 10 | 1,200 | Causal graph, epistemic baselines, evaluations, and dashboards |
   363	| **L7** | Maintenance | 10 | 1,000 | Index scans, async ingest, learning history, and graph/CocoIndex maintenance |
   364	| | **Total** | **47** | **7,600** | |
   365	
   366	Lower layers load only when needed. L1 is always available. L2 loads for any search. L3-L7 load based on the specific command being used.
   367	
   368	
   369	#### HYBRID SEARCH
   370	
   371	Every search checks five core channels at once, with CocoIndex available as a semantic code search bridge:
   372	
   373	- **Vector** - Semantic similarity via embeddings. Finds related content when words differ.
   374	- **FTS5** - Full-text search on exact words and phrases.
   375	- **BM25** - Keyword relevance scoring.
   376	- **Causal Graph** - Follows cause-and-effect links between memories.
   377	- **Degree** - Scores by graph connectivity, weighted by edge type.
   378	
   379	**Reciprocal Rank Fusion (RRF)** combines results across channels so memories scoring well in multiple channels rise to the top. **Graph-first routing** dispatches structural queries to the Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline. A **3-tier FTS fallback** activates when graph and semantic channels miss: FTS5 full-text, BM25 keyword scoring, then Grep/Glob filesystem search. The system truncates weak results and ensures every active channel is represented.
   380	
   381	
   382	#### SEARCH PIPELINE
   383	
   384	Every search passes through 4 stages:
   385	
   386	- **Candidate generation** - Parallel retrieval from the active channels plus constitutional injection where applicable.
   387	- **Fusion** - RRF-based scoring with post-fusion signals such as co-activation, FSRS decay, interference control, intent weights, and graph/session boosts when enabled.
   388	- **Rerank** - Cross-encoder reranking with chunk reassembly; if the reranker is unavailable, Stage 2 order is preserved with degraded metadata.
   389	- **Filtering** - State/quality filtering, confidence annotation, token-budget enforcement, and final response shaping without mutating post-rerank scores.
   390	

exec
/bin/zsh -lc "nl -ba README.md | sed -n '520,550p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	The Compact Code Graph is a SQLite-backed structural index that ships as part of the Spec Kit MCP server (`context-server.ts`). It is available to **every supported CLI** — Claude Code, Codex CLI, Gemini CLI, and GitHub Copilot — because each runtime connects to the same MCP server via its own config (`.claude/mcp.json`, `.mcp.json`, `.codex/config.toml`, `.agents/mcp.json`).
   521	
   522	**Startup injection.** When the MCP server starts, it initializes the `code-graph.sqlite` database, runs a non-blocking startup scan, and activates a file watcher. Runtimes with SessionStart hooks (Claude Code, Gemini CLI) inject a startup brief into the conversation's first turn with a one-line health summary (e.g., "Code Graph: healthy — 42 files, 8.3K nodes, 15.2K edges"). Codex CLI achieves equivalent startup via `session_bootstrap()` MCP tool. Copilot hook behavior varies by environment.
   523	
   524	**Auto-indexing.** The graph stays current through three mechanisms:
   525	1. **Startup scan** — indexes on server boot (async, non-blocking)
   526	2. **File watcher** — Chokidar monitors spec and source folders with a 2-second debounce, reindexing changed files in real time
   527	3. **Lazy refresh** — `code_graph_query` calls `ensureCodeGraphReady()` which detects staleness and triggers a bounded inline refresh before returning results
   528	
   529	The indexer uses tree-sitter to parse source files and extract functions, classes, imports, and call relationships. It tracks per-file content hashes to skip unchanged files, making incremental scans fast.
   530	
   531	#### What Each System Does
   532	
   533	| System | Best for | Primary surface |
   534	|-------|----------|-----------------|
   535	| **CocoIndex** | Concept search, similar implementations, unfamiliar modules | `mcp__cocoindex_code__search` |
   536	| **Compact Code Graph** | Callers, imports, symbol outlines, impact analysis, neighborhood expansion | `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context` |
   537	| **Session bridge tools** | Session bootstrap, resume, and health checks around graph availability | `session_bootstrap`, `session_resume`, `session_health` |
   538	| **CCC utilities** | CocoIndex availability, reindexing, result feedback | `ccc_status`, `ccc_reindex`, `ccc_feedback` |
   539	
   540	#### How Query Routing Works (Graph-First)
   541	
   542	The default routing order is: **Code Graph** (structural) -> **CocoIndex** (semantic code) -> **Memory** (session/decision context). This graph-first approach tries structural resolution before semantic similarity, with a 3-tier FTS fallback when earlier stages miss.
   543	
   544	- Use the **Compact Code Graph** first for structural questions: callers, callees, imports, hierarchy, file outlines, and reverse impact.
   545	- Use **CocoIndex** for semantic and intent-based questions: "find code that validates memory quality", "show similar routing patterns", "where is the logic for X?"
   546	- Use **session tools** when recovering or checking environment readiness: `session_bootstrap()` on fresh start or after `/clear`, `session_resume()` for reconnect-style follow-up, and `session_health()` to re-check stale or missing structural context.
   547	- Use **Memory** when the question is about prior decisions, spec history, handovers, or task continuity.
   548	
   549	#### Why It Matters
   550	

exec
/bin/zsh -lc "nl -ba README.md | sed -n '980,995p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   980	- **Embedding/API** - Startup provider resolution, fail-fast dimension checks, structured fallback metadata for effective vs requested provider.
   981	- **Evaluation/Debug** - Trace mode, eval logging, ablation/reporting guardrails, shadow-feedback evaluation, and adaptive-shadow diagnostics that observe proposals without reordering live results.
   982	
   983	For the complete flag reference with per-flag defaults, see [MCP Server README Section 5](.opencode/skill/system-spec-kit/mcp_server/README.md#5-configuration).
   984	
   985	### Database Schema
   986	
   987	The runtime centers on a SQLite `memory_index` table with 56 columns plus companion FTS5/vector, lineage, checkpoint, working-memory, shared-memory, and eval tables.
   988	
   989	- **Primary store** - `memory_index` holds the searchable memory rows plus governance, quality, chunking, and retrieval metadata.
   990	- **Search companions** - FTS5 and vector tables support lexical and embedding retrieval alongside BM25 rebuild/index data.
   991	- **Graph/lifecycle** - Causal edges, lineage projection, checkpoints, working memory, and access tracking support decision tracing and session continuity.
   992	- **Evaluation** - Separate eval tables persist ablation/reporting metrics, with guards for missing query IDs and synthetic token-usage markers.
   993	- **Paths** - The checked-in configs default to `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`. If a runtime cannot write inside the repo, override `MEMORY_DB_PATH` (and, when relevant, `SPEC_KIT_DB_DIR`) to a writable location.
   994	
   995	### opencode.json Structure

exec
/bin/zsh -lc "nl -ba .opencode/README.md | sed -n '240,255p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	
   241	## 7. MEMORY SYSTEM
   242	<!-- ANCHOR:memory-system -->
   243	
   244	The Spec Kit Memory MCP provides persistent context across sessions:
   245	
   246	- **Storage:** Memory files in `specs/[###-name]/memory/` using ANCHOR format for structured retrieval
   247	- **Engine:** SQLite + `sqlite-vec` with provider auto-detection (Voyage, OpenAI, HF Local)
   248	- **Retrieval:** Graph-first routing (structural Code Graph before semantic CocoIndex), hybrid search across vector, BM25, FTS5, trigger matching and typed-weighted degree channels with RRF + RSF (Reciprocal Similarity Fusion) fusion, 3-tier FTS fallback (FTS5 full-text -> BM25 keyword scoring -> Grep/Glob filesystem search when graph and semantic channels miss), cross-encoder reranking, query complexity routing (simple/moderate/complex), confidence truncation (2x median gap), persistent embedding cache and interference scoring
   249	- **Architecture:** 7-layer tool hierarchy (L1 Orchestration to L7 Maintenance)
   250	- **Indexing:** 3 sources (spec memories, constitutional files, spec documents) with `includeSpecDocs: true` default
   251	- **Schema:** v15 adds `document_type` and `spec_level` columns for document-type scoring and filtering
   252	- **Features:** Constitutional tier, session deduplication, causal lineage tracking, temporal decay, learning analytics, typed retrieval contracts, artifact-class routing, adaptive fusion, append-only mutation ledger, extended retrieval telemetry, session-cognitive automation (attention-based decay, tiered content injection, co-activation of related memories), persistent embedding cache (SQLite `embedding_cache` table), interference scoring (TM-01 penalty), classification-based decay (TM-03 context-type + importance-tier multipliers), query complexity routing (simple/moderate/complex tier dispatch), RSF fusion (single-pair, multi-list, cross-variant alternatives to RRF), channel min-representation (QUALITY_FLOOR=0.2), confidence truncation (2x median gap, min 3 results), dynamic token budget (1500/2500/4000 by tier), cold-start N4 boost, min-max score normalization, co-activation fan-effect (sqrt divisor), CORRECTION/PREFERENCE signal categories, pre-flight token budget estimation, verify-fix-verify quality loop, spec folder description discovery, post-save quality gates (structure/semantic/duplicate with heuristic calibration and trigger sanitization), graph-first structural routing (Code Graph -> CocoIndex -> Memory), 3-tier FTS fallback chain (PI-A2), CocoIndex semantic code search bridge, and ~14 `SPECKIT_*` feature flags
   253	- **Hardening (Spec126):** import-path fixes, `specFolder` filtering, metadata preservation, vector metadata plumbing and stable causal edge semantics
   254	
   255	**Spec Kit workflow features:** `upgrade-level.sh`, auto-populate workflow, `check-placeholders.sh` and anchor tags.

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '820,850p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   820	### keywords
   821	
   822	- primeSessionIfNeeded, resolveSessionTrackingId, CODEX_THREAD_ID, runtime-detection.ts, CODEX_TUI_RECORD_SESSION, context-server.vitest.ts
   823	
   824	## Task 3: Verify startup/bootstrap quote surfaces and bounded inline reindex behavior in read-only mode, outcome success
   825	
   826	### rollout_summary_files
   827	
   828	- rollout_summaries/2026-04-04T11-42-27-WVjh-codex_graph_readiness_verification.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T13-42-27-019d584d-3145-70e0-8b9b-13740fcf41cf.jsonl, updated_at=2026-04-04T11:45:20+00:00, thread_id=019d584d-3145-70e0-8b9b-13740fcf41cf)
   829	
   830	### keywords
   831	
   832	- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
   833	
   834	## User preferences
   835	
   836	- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
   837	- when git-context-sensitive tests fail, the proven steering pattern is environmental first (set `TMPDIR` outside repo) before touching runtime logic [Task 1]
   838	- when the user said “Do not make code changes ... Be evidence-based and quote exact startup or bootstrap text and exact readiness output,” keep verification read-only and quote observed startup/readiness payload text verbatim [Task 3]
   839	
   840	## Reusable knowledge
   841	
   842	- `primeSessionIfNeeded()` needs a session identifier; in Codex runtime the reliable fallback is `CODEX_THREAD_ID` when explicit `sessionId`/`session_id` are absent [Task 2]
   843	- runtime detection for Codex should recognize env markers beyond CODEX_CLI (`CODEX_THREAD_ID`, `CODEX_TUI_RECORD_SESSION`, `CODEX_TUI_SESSION_LOG_PATH`) so non-hook behavior is consistent [Task 2]
   844	- graph scan can complete with per-file UNIQUE constraint noise; use final scan stats (`totalNodes`, `totalEdges`, `lastScanAt`) plus `errors[]` triage instead of treating it as hard failure [Task 1]
   845	- tests `session-enrichment` and `spec-affinity` require temp directories outside repo to avoid accidental git parent discovery [Task 1]
   846	- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
   847	- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
   848	
   849	## Failures and how to do differently
   850	

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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '968,1120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   968	    .sort((a, b) => b.score - a.score)
   969	    .slice(0, limit);
   970	}
   971	
   972	/**
   973	 * Enhanced hybrid search with RRF fusion.
   974	 * All search channels use synchronous better-sqlite3; sequential execution
   975	 * is correct — Promise.all would add overhead without achieving parallelism.
   976	 */
   977	async function hybridSearchEnhanced(
   978	  query: string,
   979	  embedding: Float32Array | number[] | null,
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
  1061	    // Vector channel — gated by query-complexity routing
  1062	    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
  1063	      try {
  1064	        const vectorResults = vectorSearchFn(embedding, {
  1065	          limit: options.limit || DEFAULT_LIMIT,
  1066	          specFolder: options.specFolder,
  1067	          minSimilarity: options.minSimilarity || 0,
  1068	          includeConstitutional: false,
  1069	          includeArchived: options.includeArchived || false,
  1070	          includeEmbeddings: true,
  1071	        });
  1072	        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
  1073	          ...r,
  1074	          id: r.id as number | string,
  1075	          source: 'vector',
  1076	        }));
  1077	        for (const result of semanticResults) {
  1078	          if (typeof result.id !== 'number') continue;
  1079	          const embeddingCandidate = toEmbeddingBufferView(
  1080	            (result as Record<string, unknown>).embedding
  1081	            ?? (result as Record<string, unknown>).embeddingBuffer
  1082	          );
  1083	          if (embeddingCandidate) {
  1084	            vectorEmbeddingCache.set(result.id, embeddingCandidate);
  1085	          }
  1086	        }
  1087	        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
  1088	      } catch (_err: unknown) {
  1089	        // Non-critical — vector channel failure does not block pipeline
  1090	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1091	      }
  1092	    }
  1093	
  1094	    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
  1095	    if (activeChannels.has('fts')) {
  1096	      ftsChannelResults = ftsSearch(query, options);
  1097	      if (ftsChannelResults.length > 0) {
  1098	        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
  1099	        // flooding top-K with noisy lexical matches despite its exact-match value.
  1100	        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
  1101	      }
  1102	    }
  1103	
  1104	    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
  1105	    if (activeChannels.has('bm25')) {
  1106	      bm25ChannelResults = bm25Search(query, options);
  1107	      if (bm25ChannelResults.length > 0) {
  1108	        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
  1109	        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
  1110	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
  1111	      }
  1112	    }
  1113	
  1114	    // Graph channel — gated by query-complexity routing
  1115	    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
  1116	    if (useGraph && graphSearchFn) {
  1117	      try {
  1118	        graphMetrics.totalQueries++; // counted only if channel executes
  1119	        const graphResults = graphSearchFn(query, {
  1120	          limit: options.limit || DEFAULT_LIMIT,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '120,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	/** Default embedding dimension used by the vector index. */
   121	export const EMBEDDING_DIM = 768;
   122	
   123	/**
   124	 * Gets the active embedding dimension for the current provider.
   125	 * @returns The embedding dimension.
   126	 */
   127	export function get_embedding_dim(): number {
   128	  return getStartupEmbeddingDimension();
   129	}
   130	
   131	/**
   132	 * Waits for the embedding provider to report a stable dimension.
   133	 * @param timeout_ms - The maximum time to wait in milliseconds.
   134	 * @returns A promise that resolves to the confirmed embedding dimension.
   135	 */
   136	export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
   137	  const start = Date.now();
   138	  while (Date.now() - start < timeout_ms) {
   139	    const dim = get_embedding_dim();
   140	    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
   141	      return dim;
   142	    }
   143	    await new Promise(resolve => setTimeout(resolve, 100));
   144	  }
   145	  console.warn('[vector-index] Using default dimension 768 after timeout');
   146	  return 768;
   147	}
   148	
   149	type EmbeddingDimensionValidation = {
   150	  valid: boolean;
   151	  stored: number | null;
   152	  current: number | null;
   153	  reason?: string;
   154	  warning?: string;
   155	};
   156	
   157	type StoredEmbeddingDimension = {
   158	  existing_db: boolean;
   159	  stored_dim: number | null;
   160	  source: 'vec_metadata' | 'vec_memories' | null;
   161	  reason?: string;
   162	};
   163	
   164	function get_existing_embedding_dimension(
   165	  database: Database.Database,
   166	): StoredEmbeddingDimension {
   167	  const schema_row = database.prepare(`
   168	    SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'
   169	  `).get();
   170	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '790,815p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   790	  }
   791	
   792	  let vec_available = true;
   793	  try {
   794	    sqliteVec.load(new_db);
   795	  } catch (vec_error: unknown) {
   796	    vec_available = false;
   797	    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
   798	    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
   799	    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
   800	  }
   801	
   802	  new_db.pragma('journal_mode = WAL');
   803	  new_db.pragma('busy_timeout = 10000');
   804	  new_db.pragma('foreign_keys = ON');
   805	  new_db.pragma('cache_size = -64000');
   806	  new_db.pragma('mmap_size = 268435456');
   807	  new_db.pragma('synchronous = NORMAL');
   808	  new_db.pragma('temp_store = MEMORY');
   809	
   810	  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
   811	  if (!preBootstrapDimCheck.valid && preBootstrapDimCheck.stored != null) {
   812	    const msg = preBootstrapDimCheck.warning ||
   813	      `Embedding dimension mismatch: DB=${preBootstrapDimCheck.stored}, provider=${preBootstrapDimCheck.current}`;
   814	    console.error(`[vector-index] FATAL: ${msg}`);
   815	    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '30,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '140,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts | sed -n '280,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts | sed -n '280,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	      } catch (_error: unknown) {
   281	        failed++;
   282	      }
   283	    }
   284	
   285	    return { deleted, failed };
   286	  };
   287	
   288	  const runScanInvalidationHooks = (context: Record<string, unknown>): void => {
   289	    try {
   290	      runPostMutationHooks('scan', context);
   291	    } catch (error: unknown) {
   292	      console.warn('[memory-index-scan] Post-mutation invalidation failed:', toErrorMessage(error));
   293	    }
   294	  };
   295	
   296	  if (files.length === 0) {
   297	    let staleDeleted = 0;
   298	    let staleDeleteFailed = 0;
   299	
   300	    if (incremental && !force) {
   301	      const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing([]);
   302	      const staleDeleteResult = deleteStaleIndexedRecords(categorized.toDelete);
   303	      staleDeleted = staleDeleteResult.deleted;
   304	      staleDeleteFailed = staleDeleteResult.failed;
   305	      if (staleDeleted > 0) {
   306	        runScanInvalidationHooks({ staleDeleted, staleDeleteFailed, operation: 'stale-delete' });
   307	      }
   308	    }
   309	
   310	    await completeIndexScanLease(Date.now());
   311	    return createMCPSuccessResponse({
   312	      tool: 'memory_index_scan',
   313	      summary: 'No memory files found',
   314	      data: {
   315	        status: 'complete',
   316	        scanned: 0,
   317	        indexed: 0,
   318	        updated: 0,
   319	        unchanged: 0,
   320	        failed: 0,
   321	        staleDeleted,
   322	        staleDeleteFailed,
   323	      },
   324	      hints: [
   325	        ...(staleDeleted > 0 ? [`Removed ${staleDeleted} stale index record(s) for deleted files`] : []),
   326	        'Memory files should be in specs/**/memory/ directories',
   327	        'Constitutional files go in .opencode/skill/*/constitutional/'
   328	      ]
   329	    });
   330	  }
   331	
   332	  const constitutionalSet = new Set(constitutionalFiles.map((filePath) => getCachedKey(filePath)));
   333	
   334	  const results: ScanResults = {
   335	    scanned: files.length,
   336	    indexed: 0,
   337	    updated: 0,
   338	    unchanged: 0,
   339	    failed: 0,
   340	    skipped_mtime: 0,
   341	    mtimeUpdates: 0,
   342	    staleDeleted: 0,
   343	    staleDeleteFailed: 0,
   344	    files: [],
   345	    constitutional: {
   346	      found: constitutionalFiles.length,
   347	      indexed: 0,
   348	      alreadyIndexed: 0
   349	    },
   350	    incremental: {
   351	      enabled: incremental && !force,
   352	      fast_path_skips: 0,
   353	      mtime_changed: 0
   354	    },
   355	    dedup: {
   356	      inputTotal: mergedFiles.length,
   357	      uniqueTotal: files.length,
   358	      duplicatesSkipped: dedupDuplicatesSkipped,
   359	    },
   360	    aliasConflicts: { ...EMPTY_ALIAS_CONFLICT_SUMMARY },
   361	    divergenceReconcile: createDefaultDivergenceReconcileSummary(),
   362	  };
   363	
   364	  let filesToIndex: string[] = files;
   365	  let filesToDelete: string[] = [];
   366	
   367	  if (incremental && !force) {
   368	    const startCategorize = Date.now();
   369	    const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing(files);
   370	
   371	    filesToIndex = [...categorized.toIndex, ...categorized.toUpdate];
   372	    filesToDelete = categorized.toDelete;
   373	
   374	    results.unchanged = categorized.toSkip.length;
   375	    results.skipped_mtime = categorized.toSkip.length;
   376	    results.incremental.fast_path_skips = categorized.toSkip.length;
   377	    results.incremental.mtime_changed = categorized.toUpdate.length;
   378	
   379	    for (const unchangedPath of categorized.toSkip) {
   380	      if (constitutionalSet.has(getCachedKey(unchangedPath))) {
   381	        results.constitutional.alreadyIndexed++;
   382	      }
   383	    }
   384	
   385	    const categorizeTime = Date.now() - startCategorize;
   386	    console.error(`[memory-index-scan] Incremental mode: ${filesToIndex.length}/${files.length} files need indexing (categorized in ${categorizeTime}ms)`);
   387	    console.error(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Mtime changed: ${results.incremental.mtime_changed}`);
   388	  }
   389	
   390	  // T106/P0-09: Track successfully indexed files for post-indexing mtime update.
   391	  // SAFETY INVARIANT: mtime markers are updated ONLY after indexing succeeds.
   392	  // Failed files keep their old mtime so shouldReindex() returns 'modified'
   393	  // Or 'new' on the next scan, ensuring automatic retry. Moving this update
   394	  // Before indexing would cause silent data loss — a failed file would be
   395	  // Marked "already indexed" and permanently skipped.
   396	  const successfullyIndexedFiles: string[] = [];
   397	
   398	  if (filesToIndex.length > 0) {
   399	    const batchResults = await processBatches(filesToIndex, async (filePath: string) => {
   400	      const isSpecDoc = specDocKeySet.has(getCachedKey(filePath));
   401	      // During force reindex, use warn-only for all files — the goal is to index
   402	      // everything that has valid frontmatter, not to enforce template contracts on
   403	      // older files created before current templates were established.
   404	      const useWarnOnly = force || isSpecDoc;
   405	      return await indexSingleFile(filePath, force, useWarnOnly ? { qualityGateMode: 'warn-only' } : undefined);
   406	    });
   407	
   408	    for (let i = 0; i < batchResults.length; i++) {
   409	      const result = batchResults[i];
   410	      const filePath = filesToIndex[i];
   411	      const isConstitutional = constitutionalSet.has(getCachedKey(filePath));
   412	
   413	      if (result.error) {
   414	        results.failed++;
   415	        results.files.push({
   416	          file: path.basename(filePath),
   417	          filePath,
   418	          status: 'failed',
   419	          error: result.error,
   420	          errorDetail: result.errorDetail

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '260,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	
   261	  const qualityLoopResult = runQualityLoop(parsed.content, buildQualityLoopMetadata(parsed, database), {
   262	    emitEvalMetrics: options.emitEvalMetrics,
   263	  });
   264	  parsed.qualityScore = qualityLoopResult.score.total;
   265	  parsed.qualityFlags = qualityLoopResult.score.issues;
   266	  if (qualityLoopResult.fixedTriggerPhrases) {
   267	    parsed.triggerPhrases = qualityLoopResult.fixedTriggerPhrases;
   268	  }
   269	  const finalizedFileContent = qualityLoopResult.fixedContent
   270	    && qualityLoopResult.passed
   271	    ? qualityLoopResult.fixedContent
   272	    : null;
   273	  if (finalizedFileContent) {
   274	    parsed.content = finalizedFileContent;
   275	    parsed.contentHash = memoryParser.computeContentHash(parsed.content);
   276	  }
   277	
   278	  const sourceClassification = classifyMemorySaveSource(parsed.content);
   279	  if (sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION) {
   280	    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
   281	    console.warn(`[memory-save] ${warning} ${path.basename(parsed.filePath)}`);
   282	    validation.warnings.push(warning);
   283	  }
   284	
   285	  const sufficiencyResult = evaluateMemorySufficiency(
   286	    {
   287	      ...buildParsedMemoryEvidenceSnapshot(parsed),
   288	      sourceClassification,
   289	    },
   290	  );
   291	  applyInsufficiencyMetadata(parsed, sufficiencyResult);
   292	  const templateContract = validateMemoryTemplateContract(parsed.content);
   293	
   294	  // Non-blocking spec doc health annotation
   295	  // parsed.specFolder is a relative key (e.g., "system-spec-kit/100-feature"),
   296	  // so resolve the absolute spec folder by walking up from the memory file path.
   297	  let specDocHealth: SpecDocHealthResult | null = null;
   298	  if (parsed.specFolder && parsed.filePath) {
   299	    try {
   300	      const absFilePath = path.resolve(parsed.filePath);
   301	      // Memory files live at .../NNN-name/memory/*.md — walk up to the spec folder
   302	      const memoryDir = path.dirname(absFilePath);
   303	      const parentDir = path.dirname(memoryDir);
   304	      // Verify this is actually a spec folder (has spec.md)
   305	      const specMdPath = path.join(parentDir, 'spec.md');
   306	      if (fs.existsSync(specMdPath)) {
   307	        specDocHealth = evaluateSpecDocHealth(parentDir);
   308	      }
   309	    } catch (error: unknown) {
   310	      const message = error instanceof Error ? error.message : String(error);
   311	      console.warn(
   312	        `[memory-save] spec-doc-health annotation skipped for ${path.basename(parsed.filePath)}: ${message}`
   313	      );
   314	    }
   315	  }
   316	
   317	  return {
   318	    parsed,
   319	    validation,
   320	    qualityLoopResult,
   321	    sufficiencyResult,
   322	    templateContract,
   323	    specDocHealth,
   324	    finalizedFileContent,
   325	    sourceClassification,
   326	  };
   327	}
   328	
   329	async function finalizeMemoryFileContent(
   330	  filePath: string,
   331	  content: string,
   332	): Promise<void> {
   333	  const backupPath = `${filePath}.${randomUUID().slice(0, 8)}.bak`;
   334	  const tempPath = `${filePath}.${randomUUID().slice(0, 8)}.tmp`;
   335	  let backupCreated = false;
   336	  let tempCreated = false;
   337	
   338	  try {
   339	    try {
   340	      await fs.promises.copyFile(filePath, backupPath);
   341	      backupCreated = true;
   342	    } catch (backupErr: unknown) {
   343	      const errCode = typeof backupErr === 'object' && backupErr !== null && 'code' in backupErr
   344	        ? String((backupErr as NodeJS.ErrnoException).code)
   345	        : '';
   346	      if (errCode !== 'ENOENT') {
   347	        throw backupErr;
   348	      }
   349	    }
   350	
   351	    await fs.promises.writeFile(tempPath, content, 'utf-8');
   352	    tempCreated = true;
   353	    await fs.promises.rename(tempPath, filePath);
   354	    tempCreated = false;
   355	  } catch (writeErr: unknown) {
   356	    if (tempCreated) {
   357	      try {
   358	        await fs.promises.unlink(tempPath);
   359	      } catch {
   360	        // Best-effort cleanup only.
   361	      }
   362	    }
   363	    if (backupCreated) {
   364	      try {
   365	        await fs.promises.copyFile(backupPath, filePath);
   366	      } catch (restoreErr: unknown) {
   367	        console.warn(
   368	          '[memory-save] Auto-fix file restore failed after finalize error:',
   369	          restoreErr instanceof Error ? restoreErr.message : String(restoreErr),
   370	        );
   371	      }
   372	    }
   373	    throw writeErr;
   374	  } finally {
   375	    if (tempCreated) {
   376	      try {
   377	        await fs.promises.unlink(tempPath);
   378	      } catch {
   379	        // Best-effort cleanup only.
   380	      }
   381	    }
   382	    if (backupCreated) {
   383	      try {
   384	        await fs.promises.unlink(backupPath);
   385	      } catch {
   386	        // Best-effort cleanup only.
   387	      }
   388	    }
   389	  }
   390	}
   391	
   392	function appendResultWarning<T extends Record<string, unknown>>(result: T, warning: string | null): T {
   393	  if (!warning) {
   394	    return result;
   395	  }
   396	
   397	  const r = result as Record<string, unknown>;
   398	  const warnings = Array.isArray(r.warnings)
   399	    ? [...(r.warnings as string[])]
   400	    : [];
   401	  warnings.push(warning);
   402	  r.warnings = warnings;
   403	  return result;
   404	}
   405	
   406	function recordCrossPathPeSupersedes(
   407	  database: ReturnType<typeof requireDb>,
   408	  memoryId: number,
   409	  supersededMemoryId: number | null,
   410	  samePathMemoryId: number | null,
   411	  reason: string | null | undefined,
   412	): void {
   413	  if (supersededMemoryId == null || supersededMemoryId === samePathMemoryId) {
   414	    return;
   415	  }
   416	
   417	  causalEdges.init(database);
   418	  const evidence = reason && reason.trim().length > 0
   419	    ? reason.trim()
   420	    : 'Prediction-error contradiction across different file paths';

codex
I’m doing one narrow CocoIndex pass as well, mainly to sanity-check that the files I’ve been reading are the right performance hotspots instead of just the most obvious ones. If it returns cleanly, I’ll use it as a cross-check; if not, the direct file evidence I already have is still enough for a solid iteration write-up.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
# Iteration 034: PERFORMANCE IMPLICATIONS

## Focus
PERFORMANCE IMPLICATIONS: Analyze performance trade-offs of adopted patterns. Search latency, storage growth, indexing overhead, startup time impact.

## Findings

### Finding 1: Mex’s static integrity lane is cheap enough to transplant because it stays out of the retrieval stack
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: `runDriftCheck()` walks scaffold markdown once, extracts claims, and runs path, edge, index, command, dependency, cross-file, and script-coverage checks without embeddings, MCP startup state, or AI calls.
- **Why it matters**: This is the performance-safe slice for Public. It can catch broken references and scaffold drift before we ever pay `memory_search`’s embedding wait, multi-channel fusion, or graph-readiness overhead.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Mex’s staleness model is useful, but it is too git-heavy for startup or read-path injection
- **Source**: [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L33), [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L1), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12)
- **What it does**: For every scaffold file, Mex performs two git-history lookups: days since last change and commits since last change, with warning/error thresholds at `30/90` days and `50/200` commits.
- **Why it matters**: The signal is strong, but the cost scales with scaffold file count and repo history depth. If we copied this into `session_bootstrap`, `memory_context`, or server startup, we would add repeated git latency to already-expensive flows.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 3: Mex’s pre-scan and targeted sync reduce AI repair cost, not system query latency
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L34), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L50), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L8), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7)
- **What it does**: `mex init` builds a compact brief first, and `buildSyncBrief()` only packages the flagged file, the issue list, nearby filesystem context, and recent git diff for repair.
- **Why it matters**: This is a good operator/DX optimization for Public: smaller repair prompts, less re-reading, faster repair loops. But it does not make `memory_search` itself faster; it belongs in a maintenance/doctor lane, not the live retrieval path.
- **Recommendation**: NEW FEATURE
- **Impact**: medium
- **Source strength**: primary

### Finding 4: Spec Kit Memory already spends latency budget on richer retrieval, and it deliberately contains that cost with routing, cache, and bounded fallbacks
- **Source**: [handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L751), [lib/search/query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [lib/search/hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L973), [lib/search/sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L92), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md#L369)
- **What it does**: On cache miss, `memory_search` can wait up to 30s for embeddings, then run a routed hybrid pipeline. Simple queries use `vector + fts`; moderate adds BM25; complex uses all five channels. Hybrid fusion stays sequential because the underlying SQLite work is synchronous.
- **Why it matters**: Public’s search latency is intentionally elastic: fast path when possible, full pipeline when necessary. That argues against bolting Mex-style checker work onto interactive retrieval. Integrity checks should stay separate so search latency remains query-driven, not maintenance-driven.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 5: Startup and storage are already the expensive surfaces in Public, so any Mex adoption should avoid those paths
- **Source**: [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1230), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1814), [lib/code-graph/ensure-ready.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts#L41), [handlers/memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts#L212), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md#L522), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md#L987), [.opencode/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md#L244)
- **What it does**: Startup waits for the embedding model, runs a background memory scan, initializes ingest recovery, starts a file watcher, and separately bootstraps a code-graph startup scan plus lazy `ensureCodeGraphReady()` refresh with a 10s timeout and a `SELECTIVE_REINDEX_THRESHOLD` of 50. Storage is SQLite-backed with `memory_index`, FTS5/vector, lineage, checkpoint, working-memory, shared-memory, eval, and embedding-cache data.
- **Why it matters**: Mex’s markdown-only model grows mostly in files; Public’s growth compounds in files, tables, embeddings, and graph state. That makes startup time and storage growth the wrong place to add another always-on checker suite. The right insertion point is explicit maintenance or post-commit.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L34)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L1)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L1)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L1)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md#L1)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L28)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17)
- [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L1)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L8)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7)
- [handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L763)
- [handlers/memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts#L148)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1230)
- [lib/code-graph/ensure-ready.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts#L41)

## Assessment
- **New information ratio**: 0.18
- **Questions addressed**: search latency, storage growth, indexing overhead, startup-time impact, where Mex-style checks belong in Public
- **Questions answered**: static integrity checks are cheap enough to adopt; git-based freshness should stay off startup/read paths; targeted sync is a repair-loop optimization, not a search optimization; Public’s interactive latency is already bounded by routing/cache/timeout logic; startup and storage are the highest-risk insertion points
- **Novelty justification**: prior iterations identified what to adopt, but this pass adds the missing placement rule: which patterns are performance-safe on interactive paths versus only safe in maintenance lanes.

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


hook: Stop
hook: Stop Completed
tokens used
327,168
# Iteration 034: PERFORMANCE IMPLICATIONS

## Focus
PERFORMANCE IMPLICATIONS: Analyze performance trade-offs of adopted patterns. Search latency, storage growth, indexing overhead, startup time impact.

## Findings

### Finding 1: Mex’s static integrity lane is cheap enough to transplant because it stays out of the retrieval stack
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: `runDriftCheck()` walks scaffold markdown once, extracts claims, and runs path, edge, index, command, dependency, cross-file, and script-coverage checks without embeddings, MCP startup state, or AI calls.
- **Why it matters**: This is the performance-safe slice for Public. It can catch broken references and scaffold drift before we ever pay `memory_search`’s embedding wait, multi-channel fusion, or graph-readiness overhead.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Mex’s staleness model is useful, but it is too git-heavy for startup or read-path injection
- **Source**: [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L33), [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L1), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12)
- **What it does**: For every scaffold file, Mex performs two git-history lookups: days since last change and commits since last change, with warning/error thresholds at `30/90` days and `50/200` commits.
- **Why it matters**: The signal is strong, but the cost scales with scaffold file count and repo history depth. If we copied this into `session_bootstrap`, `memory_context`, or server startup, we would add repeated git latency to already-expensive flows.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 3: Mex’s pre-scan and targeted sync reduce AI repair cost, not system query latency
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L34), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L50), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L8), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7)
- **What it does**: `mex init` builds a compact brief first, and `buildSyncBrief()` only packages the flagged file, the issue list, nearby filesystem context, and recent git diff for repair.
- **Why it matters**: This is a good operator/DX optimization for Public: smaller repair prompts, less re-reading, faster repair loops. But it does not make `memory_search` itself faster; it belongs in a maintenance/doctor lane, not the live retrieval path.
- **Recommendation**: NEW FEATURE
- **Impact**: medium
- **Source strength**: primary

### Finding 4: Spec Kit Memory already spends latency budget on richer retrieval, and it deliberately contains that cost with routing, cache, and bounded fallbacks
- **Source**: [handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L751), [lib/search/query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [lib/search/hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L973), [lib/search/sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L92), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md#L369)
- **What it does**: On cache miss, `memory_search` can wait up to 30s for embeddings, then run a routed hybrid pipeline. Simple queries use `vector + fts`; moderate adds BM25; complex uses all five channels. Hybrid fusion stays sequential because the underlying SQLite work is synchronous.
- **Why it matters**: Public’s search latency is intentionally elastic: fast path when possible, full pipeline when necessary. That argues against bolting Mex-style checker work onto interactive retrieval. Integrity checks should stay separate so search latency remains query-driven, not maintenance-driven.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 5: Startup and storage are already the expensive surfaces in Public, so any Mex adoption should avoid those paths
- **Source**: [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1230), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1814), [lib/code-graph/ensure-ready.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts#L41), [handlers/memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts#L212), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md#L522), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md#L987), [.opencode/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/README.md#L244)
- **What it does**: Startup waits for the embedding model, runs a background memory scan, initializes ingest recovery, starts a file watcher, and separately bootstraps a code-graph startup scan plus lazy `ensureCodeGraphReady()` refresh with a 10s timeout and a `SELECTIVE_REINDEX_THRESHOLD` of 50. Storage is SQLite-backed with `memory_index`, FTS5/vector, lineage, checkpoint, working-memory, shared-memory, eval, and embedding-cache data.
- **Why it matters**: Mex’s markdown-only model grows mostly in files; Public’s growth compounds in files, tables, embeddings, and graph state. That makes startup time and storage growth the wrong place to add another always-on checker suite. The right insertion point is explicit maintenance or post-commit.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L34)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L1)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L1)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L1)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md#L1)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts#L28)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17)
- [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L1)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L8)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7)
- [handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L763)
- [handlers/memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts#L148)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1230)
- [lib/code-graph/ensure-ready.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts#L41)

## Assessment
- **New information ratio**: 0.18
- **Questions addressed**: search latency, storage growth, indexing overhead, startup-time impact, where Mex-style checks belong in Public
- **Questions answered**: static integrity checks are cheap enough to adopt; git-based freshness should stay off startup/read paths; targeted sync is a repair-loop optimization, not a search optimization; Public’s interactive latency is already bounded by routing/cache/timeout logic; startup and storage are the highest-risk insertion points
- **Novelty justification**: prior iterations identified what to adopt, but this pass adds the missing placement rule: which patterns are performance-safe on interactive paths versus only safe in maintenance lanes.

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
