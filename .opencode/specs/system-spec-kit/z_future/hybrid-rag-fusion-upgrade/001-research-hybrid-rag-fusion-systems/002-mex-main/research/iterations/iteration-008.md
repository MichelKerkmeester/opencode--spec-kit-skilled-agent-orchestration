### Finding 6: Mex enforces repo-root and scaffold-root boundaries, but only at the project level
- **Source**: [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts) lines 9-38 and 53-64; [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts) lines 5-10 and 119-123; [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts) lines 114-128; [system-spec-kit/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts) lines 99-197
- **What it does**: `findConfig()` walks upward to the git root, refuses to run inside `.mex/`, errors when the scaffold is missing or incomplete, and reduces runtime state to `{ projectRoot, scaffoldRoot }`. Setup also refuses to run inside the Mex repository itself. This is a strong wrong-project guard, but not a multi-actor scope model.
- **Why it matters for us**: the cheap guardrail is valuable. Compared with our `tenantId`/`userId`/`agentId`/`sharedSpaceId` model, Mex only scopes to a repo and scaffold. We should not downgrade to that model, but repo-root assertions are still a good low-cost hardening idea for doc-hygiene tools and wrappers.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/patterns/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md), [external/patterns/INDEX.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md), [external/.tool-configs/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md), [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json)
- [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts), [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts), [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts), [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/scanner/entry-points.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts), [external/src/scanner/folder-tree.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts), [external/src/scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [external/src/scanner/readme.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts), [external/src/scanner/tooling.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts), [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [system-spec-kit/generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [system-spec-kit/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts), [system-spec-kit/mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts), [system-spec-kit/lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)

## Assessment
- New information ratio: 0.79
- Questions addressed: how Mex bootstraps different agent runtimes; whether Mex has passive capture beyond explicit scaffold edits; how much real multi-agent safety exists in sync/growth flows; how tightly setup/sync scope agent exploration; whether Mex has reusable file-scoped repair prompting; how Mex’s repo-level scoping compares to our governed multi-actor scope
- Questions answered: Mex’s best agent-integration idea is the thin adapter plus shared anchor model; Mex does narrow setup/sync scope with bounded briefs; Mex has a strong surgical repair prompt builder; Mex does not have durable multi-agent coordination primitives; Mex’s passive mechanism is a post-commit drift nudge rather than memory capture; Mex’s scope enforcement is repo-root/scaffold-root only, not actor-aware

## Reflection
- What worked: reading the tool-config adapters, setup prompt builder, scanner, sync brief builder, and watch hook together made the agent-integration story much clearer than the README alone; comparing those directly against our explicit JSON-primary save path and governed tool schemas made the limits obvious
- What did not work: CocoIndex was not usable in this run, so the semantic “find adjacent integration logic” pass had to be replaced with direct tracing; `validate.sh --strict` returned `PASSED`, but it also emitted a temp-file warning caused by sandboxed filesystem restrictions, and this environment is read-only so I could not update phase artifacts from this turn

## Recommended Next Focus
Design a narrow Spec Kit add-on instead of copying Mex wholesale: a file-scoped markdown claim-hygiene runner that emits surgical repair briefs, adds cheap repo-root guardrails, and optionally exposes a warn-only post-commit hook. Keep multi-agent coordination, session capture, lineage, and governance on the existing Spec Kit Memory side.

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
# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (memory_search, CocoIndex, code-graph).

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
I’m treating this as a read-only research pass over Mex’s retrieval surfaces and our own retrieval stack, then I’ll synthesize only the new comparison insights for iteration 8. I’m starting with a quick memory pass plus the external repo’s contract files and retrieval-related source so the comparison stays grounded in code, not README claims.
exec
/bin/zsh -lc 'rg -n "hybrid-rag|mex|retrieval|memory_search|CocoIndex|code-graph" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
130:- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 005-code-graph-upgrades, description.json memory/metadata.json untouched
184:scope: adopt-now runtime lane + docs closeout for `005-code-graph-upgrades` with detector provenance, blast-radius constraints, and explicit verification gates
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
345:## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success
363:- 026-graph-and-context-optimization, 024-compact-code-graph, 026/005-009, 024/032-034, AI Execution Protocol, SECTION_COUNTS, PHASE_LINKS, SPEC_DOC_INTEGRITY, validate.sh --strict, --no-recursive, implement the plan
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
753:## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
775:- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
778:- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1107:- symptom: context retrieval path blocks audit setup; cause: `spec_kit_memory` handshake failure (`connection closed: initialize response`); fix: switch immediately to direct `rg`/`sed` context gathering instead of retry loops [Task 6]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1577:scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
1580:## Task 1: Governed retrieval/shared-space admin hardening and graph ranking fix
1584:- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)
1648:- Governance scope must propagate across schemas/handlers so retrieval scope stays bounded [Task 1]
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1975:- rollout_summaries/2026-03-13T07-35-56-VaWc-hybrid_rag_retrieval_015_audit.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/13/rollout-2026-03-13T08-35-56-019ce61f-9983-79b0-92d9-268ec7dbeb98.jsonl, updated_at=2026-03-13T08:10:57+00:00, thread_id=019ce61f-9983-79b0-92d9-268ec7dbeb98)
2002:- symptom: context retrieval path blocks audit setup; cause: `spec_kit_memory` handshake failure (`connection closed: initialize response`); fix: switch immediately to direct `rg`/`sed` context gathering instead of retry loops [Task 2]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "pwd && printf '\\n---\\n' && rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external | sed 's#"'^#/#'"' | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/INDEX.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh

codex
I’ve got the file map and a lightweight memory hit list. Next I’m tracing the exact retrieval path in Mex itself, then I’ll line that up against `memory_search`, `memory_context`, CocoIndex, and code-graph so the differences are implementation-level rather than conceptual.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '748,766p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"memory_search|memory_context|memory_match_triggers|code_graph_query|code_graph_context|session_bootstrap|CocoIndex|cocoindex|mcp__cocoindex_code__search\" .opencode/skill/system-spec-kit -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
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
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:5:// code graph status, and CocoIndex availability into a single call.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:9:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:101:interface CocoIndexStatus {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:109:  cocoIndex: CocoIndexStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:462:  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:463:  const cocoIndex: CocoIndexStatus = {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:464:    available: isCocoIndexAvailable(),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:468:    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:540:      key: 'cocoindex-status',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:541:      title: 'CocoIndex Status',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:566:      { label: 'cocoindex', certainty: cocoIndexCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:575:      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
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
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:29:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:65:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/SKILL.md:355:**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`.
.opencode/skill/system-spec-kit/SKILL.md:572:| `memory_context()`              | L1    | Unified entry point — modes: auto, quick, deep, focused, resume |
.opencode/skill/system-spec-kit/SKILL.md:573:| `memory_search()`               | L2    | 5-channel hybrid retrieval with intent-aware routing, channel normalization, graph/degree signals, reranking, and filtered output |
.opencode/skill/system-spec-kit/SKILL.md:575:| `memory_match_triggers()`       | L2    | Trigger matching + cognitive (decay, tiers, co-activation) |
.opencode/skill/system-spec-kit/SKILL.md:593:**memory_context() — Mode Routing:**
.opencode/skill/system-spec-kit/SKILL.md:602:**memory_search() — Key Rules:**
.opencode/skill/system-spec-kit/SKILL.md:656:| `SPECKIT_ADAPTIVE_FUSION`     | on      | Enables intent-aware weighted RRF with 7 task-type profiles in `memory_search()` (set `false` to disable) |
.opencode/skill/system-spec-kit/SKILL.md:753:**Claude lifecycle flow:** PreCompact → cache → SessionStart(compact) → inject cached context. On startup, the shared startup snapshot covers memory continuity, code-graph state, CocoIndex availability, and an explicit note that later structural reads may differ if the repo state changed. On resume, the runtime loads prior session state.
.opencode/skill/system-spec-kit/SKILL.md:755:**Cross-runtime handling:** Claude and Gemini use SessionStart hook scripts. OpenCode has a transport/plugin implementation, but operationally should still be treated as bootstrap-first when startup surfacing is unavailable. Codex remains bootstrap-based through its session-start agent bootstrap (not a native SessionStart hook). Copilot startup context depends on local hook configuration or wrapper wiring when present. Use `session_bootstrap()` for fresh start or after `/clear`, `session_resume()` for reconnect-style recovery when bootstrap is unnecessary, and `session_health()` only to re-check drift or readiness mid-session.
.opencode/skill/system-spec-kit/SKILL.md:768:| `code_graph_query` | Query relationships: outline, calls_from/to, imports_from/to |
.opencode/skill/system-spec-kit/SKILL.md:770:| `code_graph_context` | LLM-oriented compact graph neighborhoods (neighborhood/outline/impact modes) |
.opencode/skill/system-spec-kit/SKILL.md:772:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this system) maps imports, calls, hierarchy. Memory (session, existing MCP) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/SKILL.md:784:**Query routing:** Structural queries (callers, imports, deps) -> `code_graph_query`. Semantic/concept queries -> CocoIndex (`mcp__cocoindex_code__search`). Session/memory queries -> `memory_context`.
.opencode/skill/system-spec-kit/SKILL.md:786:**CocoIndex seed bridge:** CocoIndex search results (file + line range) are accepted as seeds by `code_graph_context`, which resolves them to graph nodes and expands structurally. This combines "what resembles what" (CocoIndex) with "what connects to what" (Code Graph).
.opencode/skill/system-spec-kit/SKILL.md:788:**CCC tools** (CocoIndex lifecycle):
.opencode/skill/system-spec-kit/SKILL.md:792:| `ccc_status` | Check CocoIndex availability and index status |
.opencode/skill/system-spec-kit/SKILL.md:793:| `ccc_reindex` | Trigger incremental or full CocoIndex re-indexing |
.opencode/skill/system-spec-kit/SKILL.md:801:| `session_resume` | Combined memory + code graph + CocoIndex resume in one call |
.opencode/skill/system-spec-kit/SKILL.md:802:| `session_bootstrap` | Complete session bootstrap (resume + health) in one call |
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317:/** Handle code_graph_query tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:433:          }, readiness, `code_graph_query ${operation} payload`),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:559:          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
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
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/constitutional/README.md:42:The `constitutional/` directory contains memory files that are **always surfaced** at the top of every `memory_search()` result. These are operational rules, safety constraints and critical context that AI agents must always have access to, regardless of what they're searching for.
.opencode/skill/system-spec-kit/constitutional/README.md:60:| **Always Surfaces** | Included at top of every `memory_search` result by default |
.opencode/skill/system-spec-kit/constitutional/README.md:133:3. **Verify** with `memory_search({ query: "anything" })`. Check for `isConstitutional: true`
.opencode/skill/system-spec-kit/constitutional/README.md:148:├── gate-tool-routing.md   # Search and retrieval routing rules for memory, graph, and CocoIndex
.opencode/skill/system-spec-kit/constitutional/README.md:165:| `gate-tool-routing.md` | Recommended | Search and retrieval routing rules for memory, graph, and CocoIndex |
.opencode/skill/system-spec-kit/constitutional/README.md:178:Constitutional memories are **automatically included** at the top of every `memory_search()` result.
.opencode/skill/system-spec-kit/constitutional/README.md:184:memory_search({ query: "authentication flow" })
.opencode/skill/system-spec-kit/constitutional/README.md:196:memory_search({ 
.opencode/skill/system-spec-kit/constitutional/README.md:229:> **Implemented (v1.7.2):** ANCHOR tags are now fully indexed and support section-level retrieval. Use the `anchors` parameter in `memory_search()` to retrieve specific sections with 58-90% token savings.
.opencode/skill/system-spec-kit/constitutional/README.md:398:memory_search({ query: "test" })
.opencode/skill/system-spec-kit/constitutional/README.md:559:memory_search({ 
.opencode/skill/system-spec-kit/constitutional/README.md:672:**Symptom:** `memory_match_triggers()` doesn't return your memory
.opencode/skill/system-spec-kit/constitutional/README.md:705:memory_match_triggers({ prompt: "fix the bug" })
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:10:| `query.ts` | `code_graph_query` | Query structural relationships (outline, calls, imports) |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:12:| `context.ts` | `code_graph_context` | LLM-oriented compact graph neighborhoods |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:2:// MODULE: CocoIndex Re-index Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:26:            error: 'CocoIndex binary not found. Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh',
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:25:  - CocoIndex
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:27:  - memory_search
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:28:  - memory_context
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:39:| **Semantic/concept** (meaning-based) | `mcp__cocoindex_code__search` (CocoIndex) | `memory_search` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:40:| **Structural** (callers, imports, deps) | `code_graph_query` (Code Graph) | `Grep` / `Glob` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:47:| **Memory/context** (prior work, decisions) | `memory_search` / `memory_context` | `memory_match_triggers` |
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:48:| **Broad topic** (thematic overview) | `memory_search` with `retrievalLevel: "global"` | community search fallback |
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:4:// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:56:    filePath: seed.provider === 'cocoindex'
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:59:    startLine: seed.provider === 'cocoindex' ? seed.range?.start : seed.startLine,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:60:    endLine: seed.provider === 'cocoindex' ? seed.range?.end : seed.endLine,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:87:/** Handle code_graph_context tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:116:      if (seed.provider === 'cocoindex' && seed.file) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:118:          provider: 'cocoindex' as const,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:204:          error: 'code_graph_context failed',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:20:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:22:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:60:    case 'code_graph_query': {
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:69:    case 'code_graph_context':
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/ARCHITECTURE.md:29:- [10. HOOK + CODE GRAPH + COCOINDEX ARCHITECTURE](#10--hook--code-graph--cocoindex-architecture)
.opencode/skill/system-spec-kit/ARCHITECTURE.md:437:<!-- ANCHOR:hook-code-graph-cocoindex -->
.opencode/skill/system-spec-kit/ARCHITECTURE.md:442:Three subsystems collaborate to provide intelligent context across session boundaries: **startup/recovery surfaces** deliver runtime-specific startup context, **Code Graph** provides structural code intelligence, and **CocoIndex** enables semantic discovery. A **Compact Merger** still unifies structural, semantic, and memory-oriented signals for bounded payload construction, but startup delivery is now runtime-specific rather than Claude-only.
.opencode/skill/system-spec-kit/ARCHITECTURE.md:458:        codex["Codex bootstrap parity<br/>session_bootstrap() MCP tool"]
.opencode/skill/system-spec-kit/ARCHITECTURE.md:481:    subgraph COCOINDEX["CocoIndex Layer"]
.opencode/skill/system-spec-kit/ARCHITECTURE.md:483:        semantic["Semantic Search<br/>mcp__cocoindex_code__search"]
.opencode/skill/system-spec-kit/ARCHITECTURE.md:525:| `seed-resolver.ts` | `lib/code-graph/` | CocoIndex results to graph node resolution |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:539:    "CocoIndex (900)" : 900
.opencode/skill/system-spec-kit/ARCHITECTURE.md:548:| CocoIndex | 900 | Semantic search results, related code |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:559:| Semantic discovery (find by meaning/concept) | CocoIndex | `mcp__cocoindex_code__search` |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:560:| Structural navigation (call graph, dependencies) | Code Graph | `code_graph_query` / `code_graph_context` |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:561:| Startup or recovery state | Session surfaces | `session_bootstrap` / `session_resume` / startup surface |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:562:| Session continuity (prior work, decisions) | Memory | `memory_search` / `memory_context` |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:564:<!-- /ANCHOR:hook-code-graph-cocoindex -->
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:2:// MODULE: CocoIndex Feedback Handler
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:12:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:155:  // CocoIndex availability
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:158:    cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:185:    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
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
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:2:// MODULE: CocoIndex Status Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:4:// MCP tool handler for ccc_status — reports CocoIndex availability and stats.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:14:    const indexDir = resolve(projectRoot, '.cocoindex_code');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:36:              ? 'Install CocoIndex: bash .opencode/skill/mcp-coco-index/scripts/install.sh'
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:39:                : 'CocoIndex is ready. Use mcp__cocoindex_code__search for semantic queries.',
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:21:- Default create mode: qualify the proposed rule, structure a constitutional markdown file, check the shared `~2000` token budget, write the file, index it with `memory_save`, and verify retrieval with `memory_search`.
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:25:- **Creation path.** `/memory:learn` is the operator control plane for constitutional memory lifecycle management. Its create flow writes a markdown rule into `.opencode/skill/system-spec-kit/constitutional/`, then immediately calls `memory_save({ filePath, force: true })`, and finally verifies the rule by running `memory_search()` against one of the trigger phrases. The same command family also exposes `list`, `edit`, `remove`, and `budget` actions, and documents the constitutional tier as the always-surface, no-decay, 3.0x-boost tier.
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
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
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:45:- `code-graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:47:- `code-graph/context.ts` - `code_graph_context`: LLM-oriented compact graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:2:// MODULE: CocoIndex Path Helper
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:4:// F046/F051: Shared helper for resolving the CocoIndex binary path.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:12:/** Relative path from project root to the CocoIndex CLI binary. */
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:48: * Get the absolute path to the CocoIndex binary.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:51:export function getCocoIndexBinaryPath(): string {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:56: * Check whether the CocoIndex binary exists on disk.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:58:export function isCocoIndexAvailable(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:59:  return existsSync(getCocoIndexBinaryPath());
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md:18:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`: auto-resume `systemPromptContext` items are injected before `enforceTokenBudget()` runs, so both `meta.tokenCount` and the delivered payload stay aligned with the final serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:3:description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, while `memory_context` still carries a dead `profile` declaration."
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:10:Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring is still partial: `memory_search` applies them while `memory_context` still carries a dead `profile` declaration.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:12:Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, but the live integration is incomplete: `memory_search` can apply response profiles, while `memory_context` only declares `profile?: string` and never consumes it. When the flag is off, the original full response is returned unchanged.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:26:Runtime wiring is partial: `memory_search` applies the formatter, `memory_context` now accepts the same `profile` parameter at the schema level, but `memory_context` still declares `profile?: string` without using it. In practice, the context-side profile path remains dead code until the handler consumes it.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:42:| `mcp_server/tool-schemas.ts` | Schema | Public tool schemas now expose `profile` for `memory_context` and `memory_search` |
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:44:vi.mock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:45:  isCocoIndexAvailable: vi.fn(() => false),
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:52:import * as cocoIndexPath from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:72:    expect(brief.startupSurface).toContain('- CocoIndex: missing');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:114:  it('reports cocoindex as available when the binary exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:115:    vi.mocked(cocoIndexPath.isCocoIndexAvailable).mockReturnValueOnce(true);
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:118:    expect(brief.startupSurface).toContain('- CocoIndex: available');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:124:    expect(brief.graphOutline).toContain('CocoIndex');
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:100:| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | enum (`shadow`, `promoted`) | `mcp_server/lib/cognitive/adaptive-ranking.ts` | Active only when adaptive ranking is enabled. `shadow` is the default observe-only mode that records signals and persists bounded proposal payloads without changing returned search order. `promoted` marks proposals and persisted runs as `promoted` for evaluation and rollout drills, while the current `memory_search` path still attaches proposal metadata instead of reordering live results. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:105:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:107:| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:114:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. The trace surface now also carries `sessionTransition` and bounded graph-walk diagnostics when those signals are active. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:133:| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | `schemas/tool-input-schemas.ts` | **IMPLEMENTED (Sprint 019, later expanded by session/code-graph additions).** P0-1: Controls Zod schema enforcement mode for the schema-backed L1-L7 MCP tool surface. When `true`, `.strict()` rejects unexpected parameters with stderr logging (CHK-029). When `false`, `.passthrough()` allows undocumented parameters for backward compatibility. The L8 code-graph/CocoIndex dispatch helpers still use lighter required-field guards instead of the same `validateToolArgs` path. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:59:| `/memory:search` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:60:| `/memory:learn` | Create and manage always-surface rules (6 tools, borrowed) | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:61:| `/memory:manage` | Database maintenance, checkpoints, and bulk ingestion (19 primary tools plus `memory_search` helper access) | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:64:| `/spec_kit:resume` | Continue or recover prior work (primary chain uses 3 shared tools, with extra helpers behind the scenes) | `memory_context`, `memory_search`, `memory_list` plus `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and health, indexing, validation, checkpoint, and CocoIndex helpers in the wrapper |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:72:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:76:### Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:86:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:116:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:972:After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item. The same rule now applies when resume context is attached in `memory_context`: add the extra context first, then enforce the size limit.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/16-progressive-disclosure.md:12:The live handler preserves full `data.results`, adds `data.progressiveDisclosure`, and serves follow-up pages through `memory_search({ cursor })`. The summary tells you the quality distribution (e.g., "3 strong, 2 moderate, 1 weak") so you can decide whether to dig deeper, while pagination uses opaque cursor tokens with a time-to-live so the system can serve additional pages from a cached result set.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:55:| `mcp_server/tool-schemas.ts` | Core | memory_search schema exposes trackAccess/includeArchived/mode |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:82:| `mcp_server/tests/tool-input-schema.vitest.ts` | Public/runtime schema validation for memory_search args |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md:18:**IMPLEMENTED (Sprint 019, later expanded by session/code-graph additions).** The L1-L7 tool surface has Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). The L8 code-graph/CocoIndex dispatch helpers currently rely on lighter required-field guards rather than the same `validateToolArgs` path. Adds `zod` dependency.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:29:`constitutional/README.md` defines the behavior of the constitutional tier itself. It documents that constitutional memories always appear at the top of `memory_search()` results, receive a fixed `similarity: 100`, never decay, remain permanently available, and use fast trigger-phrase matching for proactive surfacing. It also documents the operational envelope around this pack, including the shared constitutional token budget, authoring template, and verification flow after adding or updating a constitutional memory.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:72:- `memory_search` response metadata shows no applied session/causal boosts
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:73:- `memory_context` response metadata shows no pressure-mode override
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
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
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:413:| **Memory Not Found** | Search returns no results | Check `memory_search({ specFolder: "..." })` |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:427:memory_search({
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:471:**Symptom:** `memory_match_triggers()` returns no results even for relevant queries.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:57:| `/memory:search` | 13 | owns | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:58:| `/memory:learn` | 6 | shared | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:59:| `/memory:manage` | 19 primary + 1 helper | owns + borrows | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
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
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:348:Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1211:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1327:Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to rollout policy via `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2101:Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2516:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4188:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`, where auto-resume `systemPromptContext` injection happens before `enforceTokenBudget()`. This keeps `meta.tokenCount` and the delivered payload aligned with the exact serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4284:Four profiles are implemented: quick (topResult + oneLineWhy + omittedCount + tokenReduction), research (results + evidenceDigest + followUps), resume (state + nextSteps + blockers), and debug (full trace + tokenStats). Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON, set `SPECKIT_RESPONSE_PROFILE_V1=false` to disable. Runtime wiring is active on both `memory_search` and `memory_context`, with explicit profile selection and intent-to-profile auto-routing when a profile is not provided.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4478:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4479:| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4486:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4503:| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | `schemas/tool-input-schemas.ts` | **IMPLEMENTED (Sprint 019, later expanded by session/code-graph additions).** P0-1: Controls Zod schema enforcement mode for the schema-backed L1-L7 MCP tool surface. When `true`, `.strict()` rejects unexpected parameters with stderr logging (CHK-029). When `false`, `.passthrough()` allows undocumented parameters for backward compatibility. The L8 code-graph/CocoIndex dispatch helpers still use lighter required-field guards instead of the same `validateToolArgs` path. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4686:This category tracks the compact-code-graph rollout: hook lifecycle capture, hookless priming, code-graph retrieval, CocoIndex bridging, and routing enforcement surfaces that preserve context across long-running sessions.
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:30:| `mcp_server/handlers/memory-context.ts` | Handler | Forwards `includeTrace` through internal `memory_search` calls so context responses can include provenance. |
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:32:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Admits `includeTrace` for `memory_search` and `memory_context` input validation. |
.opencode/skill/system-spec-kit/references/config/environment_variables.md:276:| `SPECKIT_AUTO_RESUME` | ON | S7 | Auto-resume session detection in `memory_context()` |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:12:| 1 | Community Summaries | SPECKIT_COMMUNITY_SUMMARIES | community-detection.vitest.ts | memory_search with global mode |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:16:| 5 | Dual-Level Retrieval | SPECKIT_DUAL_RETRIEVAL | community-search.vitest.ts | memory_search with retrievalLevel: global |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:29:1. Run `memory_search({ query: 'semantic search', retrievalLevel: 'global' })`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:37:1. Run `memory_search({ query: 'Semantic Search', includeTrace: true })`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:58:1. `memory_search({ query: 'search pipeline', retrievalLevel: 'local' })` - entity results only
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:59:2. `memory_search({ query: 'search pipeline', retrievalLevel: 'global' })` - community results
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:60:3. `memory_search({ query: 'search pipeline', retrievalLevel: 'auto' })` - local with fallback
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:71:1. Run `memory_search` with `includeTrace: true`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:105:- `memory_match_triggers()` is unaffected by new code
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/references/config/hook_system.md:50:Hook-capable runtimes include Claude Code, Codex CLI, Copilot CLI, Gemini CLI, and OpenCode. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). If hook context is unavailable in any runtime for any reason, fall back to the tool-based recovery path: `session_bootstrap()` on fresh start or after `/clear`, then `session_resume()` only when a detailed follow-up recovery payload is needed.
.opencode/skill/system-spec-kit/references/config/hook_system.md:55:1. `memory_match_triggers(prompt)` — Fast turn-start context
.opencode/skill/system-spec-kit/references/config/hook_system.md:56:2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
.opencode/skill/system-spec-kit/references/config/hook_system.md:57:3. `session_bootstrap()` / `session_resume()` — Session-oriented wrappers that layer health and structural context around resume retrieval
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:60:    it('increments codeGraphQueries on code_graph_query event', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:62:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md:3:description: "5-layer active enforcement system that routes AI tool selection: semantic queries to CocoIndex, structural queries to Code Graph, exact text to Grep — replacing passive CLAUDE.md instructions with MCP-level enforcement."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md:10:5-layer active enforcement system that routes AI tool selection: semantic queries to CocoIndex, structural queries to Code Graph, exact text to Grep — replacing passive CLAUDE.md instructions with MCP-level enforcement.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md:29:| `mcp_server/hooks/memory-surface.ts` | Hook | PrimePackage.routingRules with CocoIndex/Code Graph directives |
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:84:The `memory_match_triggers` MCP tool provides fast trigger phrase matching without requiring embeddings:
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:88:const result = await spec_kit_memory_memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:119:1. AI calls `memory_match_triggers({ prompt: "user message" })`
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:127:const matches = await memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:158:These signals are detected during `memory_match_triggers()` processing and influence save-time arbitration (prediction-error scoring) and correction tracking.
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:174:- `memory_match_triggers()` now applies a relevance threshold before returning matches, reducing noise from weak partial matches
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:2:title: "CocoIndex bridge and code_graph_context"
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:3:description: "CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:6:# CocoIndex bridge and code_graph_context
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:10:CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:12:Seed resolver normalizes CocoIndex file:line results to ArtifactRef via resolution chain: exact symbol, near-exact symbol, enclosing symbol, file anchor. `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop), outline (file symbols), and impact (reverse callers plus reverse imports). Budget-aware truncation.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:28:| `mcp_server/lib/code-graph/seed-resolver.ts` | Lib | Resolves CocoIndex file-range hits to graph anchors or file-level fallbacks |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:30:| `mcp_server/handlers/code-graph/context.ts` | Handler | Exposes `code_graph_context` over MCP |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:43:- Source feature title: CocoIndex bridge and code_graph_context
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:3:description: "Adds a retrievalLevel parameter (local|global|auto) to memory_search, where auto mode falls back to community search on weak results, enabling both fine-grained and topic-level retrieval in a single query, gated by the SPECKIT_DUAL_RETRIEVAL flag."
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:10:Adds a `retrievalLevel` parameter (`local`|`global`|`auto`) to `memory_search`, where auto mode falls back to community search on weak results. This enables callers to explicitly request fine-grained local retrieval, broad community-level global retrieval, or let the system decide based on result quality.
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:18:The `memory_search` handler accepts a `retrievalLevel` parameter with three modes: `local` runs standard retrieval channels only, `global` runs community-level search only, and `auto` (default) runs local retrieval first and falls back to community search when results are weak or empty. The flag and parameter are registered in `search-flags.ts`. Auto mode uses the same confidence thresholds as the empty-result recovery system to determine when fallback is needed.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:97:> **Note:** MCP tool names use plain names such as `memory_search`, `memory_save`, and `shared_memory_enable`.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:103:| L1: Orchestration | `memory_context()` | Unified entry point with intent-aware routing (7 intents) | START HERE for most memory operations |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:104:| L1: Orchestration | `session_resume()` | Resume memory, code graph, and CocoIndex state in one call | Detailed recovery payload after reconnect, or when you want direct merged resume state |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:105:| L1: Orchestration | `session_bootstrap()` | Composite bootstrap combining resume and health checks | Canonical first tool call in a fresh OpenCode-style session or after `/clear` |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:106:| L2: Core | `memory_search()` | Semantic search with vector similarity | Find prior decisions on auth |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:108:| L2: Core | `memory_match_triggers()` | Fast keyword matching (<50ms) with cognitive features | Gate enforcement |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:134:| L6: Analysis | `code_graph_query()` | Query structural relationships such as callers, imports, and outlines | Find what calls a symbol or which files import a module |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:135:| L6: Analysis | `code_graph_context()` | Expand CocoIndex or symbol seeds into compact graph neighborhoods | Pull structural context for an LLM prompt |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:143:| L7: Maintenance | `ccc_status()` | Report CocoIndex availability and index health | Confirm semantic code search is ready |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:144:| L7: Maintenance | `ccc_reindex()` | Trigger incremental or full CocoIndex re-indexing | Refresh semantic search after a refactor |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:145:| L7: Maintenance | `ccc_feedback()` | Submit search-quality feedback for CocoIndex results | Record whether semantic hits were helpful |
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
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:12:The memory-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:3:description: "Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:10:Category covering runtime hook automation, structural code graph (indexer, SQLite, MCP tools), CocoIndex bridge, and compaction working-set integration.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:12:This category documents the hybrid context injection system that preserves critical knowledge across context compaction events. It combines three complementary systems: hook-based lifecycle automation, structural code analysis (code graph), and semantic search (CocoIndex) — all merging under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md:36:| `mcp_server/handlers/session-resume.ts` | Handler | Composite resume (memory + graph + CocoIndex) |
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:367:For retrieval, `memory_context()` routes queries across 7 intents (including `find_spec` and `find_decision`) and applies intent-aware weighting.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:12:The memory-surface and response-hints hooks form a passive enrichment pipeline. On every tool call, constitutional memories and trigger-matched memories are surfaced and appended to the response envelope. Code graph status is included when available. Token estimation prevents oversized payloads. The enrichment is additive (appended to hints) and does not modify the primary tool response. This ensures AI runtimes always have access to critical context even when they do not explicitly call memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:3:description: "Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:10:Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:12:When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to CocoIndex for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:3:description: "Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a detailed recovery payload."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:10:Composite MCP tool (session_resume) that merges memory resume context, code graph status, CocoIndex availability, and structural bootstrap hints into a single recovery payload.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:12:The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md:12:Floors: constitutional 700, code graph 1200, CocoIndex 900, triggered 400, overflow pool 800. Empty sources release their floor to the overflow pool. Redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered. Total cap enforced with deterministic trim in reverse priority.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:12:All runtimes now have hook or bootstrap-based startup injection. Claude Code, Codex CLI, Copilot CLI, and Gemini CLI use shell-script `session-prime.ts` hooks. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` at `.opencode/plugins/spec-kit-compact-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the tool-based path starting with `session_bootstrap()` on fresh start or after `/clear`. Runtime detection identifies the active runtime and its current hook policy.
.opencode/skill/system-spec-kit/templates/context_template.md:307:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "{{SPEC_FOLDER}}" })` |
.opencode/skill/system-spec-kit/templates/context_template.md:319:memory_search({ specFolder: "{{SPEC_FOLDER}}", limit: 10 })
.opencode/skill/system-spec-kit/templates/context_template.md:325:memory_search({ query: "orphaned", anchors: ["state"] })
.opencode/skill/system-spec-kit/templates/context_template.md:338:2. **Load memory context** - Use memory_search to surface prior work
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:12:The ensure-ready module checks graph state (fresh/stale/empty) by comparing the current git HEAD against the last indexed HEAD and scanning for stale files. When the graph is empty, a full scan is triggered. When files are stale but below the selective reindex threshold (50 files), only changed files are reindexed. Above the threshold, a full rescan is performed. A 10-second timeout prevents blocking on large codebases. Shared by code_graph_context, code_graph_query, and code_graph_status handlers.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/12-compact-merger.md:3:description: "Compact merger combines context from Memory, Code Graph, and CocoIndex into a unified compact brief within the 4000-token budget."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/12-compact-merger.md:10:Compact merger combines context from Memory, Code Graph, and CocoIndex into a unified compact brief within the 4000-token budget.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:12:SQLite database (code-graph.sqlite) stores indexed files, symbol nodes, and relationship edges. 4 MCP tools: code_graph_scan (workspace indexing), code_graph_query (outline/calls/imports), code_graph_status (health), code_graph_context (LLM neighborhoods). WAL mode, foreign keys, directional indexes.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:30:| `mcp_server/handlers/code-graph/query.ts` | Handler | Implements `code_graph_query` for callers, imports, and outlines |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md:32:| `mcp_server/handlers/code-graph/context.ts` | Handler | Implements `code_graph_context` for compact structural neighborhoods |
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:3:description: "Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both)."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:10:Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both).
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:12:Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:47:Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:19:Shared memory is a mutation-plus-retrieval feature, not a standalone folder-based subsystem. The live flow starts with lifecycle tools that enable the feature and administer shared spaces, then continues through governed `memory_save` writes and `memory_search` scope filtering.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:33:| Query visibility | Shared search visibility is enforced in the retrieval pipeline, not by a dedicated shared-memory query service. `memory_search` accepts tenant/user/agent/session/shared-space scope values and passes them into pipeline config. Stage 1 candidate generation computes `allowedSharedSpaceIds` with `getAllowedSharedSpaceIds()` and filters every candidate set through `filterRowsByScope()`. For shared rows, visibility depends on tenant match plus membership in an allowed space; exact actor/session match is intentionally not required once the row belongs to an allowed shared space. That is what makes collaborator A's shared rows visible to collaborator B inside the same shared space. |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:33:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:899:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/scripts/setup/install.sh:351:    echo "  3. Use memory_search, memory_save, memory_context tools for context preservation"
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
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
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:3:description: "Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10)."
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:10:Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10).
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:12:When you want fast search results without configuring the full 31-parameter surface of `memory_search`, use `memory_quick_search` instead. You provide a natural language query and optionally a result limit or spec folder scope. The tool fills in sensible defaults and hands off to the full search pipeline. The results are identical to what `memory_search` would return with those same settings — this is purely a convenience layer, not a separate search path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:28:The constructed `SearchArgs` are passed directly to `handleMemorySearch()`, the same handler used by `memory_search`. There is no separate search path — `memory_quick_search` is a thin delegation layer only.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:41:| `mcp_server/handlers/memory-search.ts` | Handler | Search handler that executes the full pipeline (shared with `memory_search`) |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:2:title: "Semantic and lexical search (memory_search)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:6:# Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:26:When trace is enabled, result envelopes now expose richer bounded Markovian diagnostics without altering the non-trace contract: `trace.graphContribution` includes `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`, and requests forwarded from `memory_context` can also include `trace.sessionTransition`. Extended telemetry summarizes the same behavior through `transitionDiagnostics` and `graphWalkDiagnostics`.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:74:- Source feature title: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:20:Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:2:title: "Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:6:# Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:69:- Source feature title: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:27:  vi.doMock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:28:    isCocoIndexAvailable: vi.fn(() => false),
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:62:    expect(contract.recommendedAction).toContain('code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:16:**SHIPPED.** `/spec_kit:resume` owns both standard continuation and interrupted-session recovery. Its primary recovery chain uses 3 shared memory tools, while the live wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:18:- **`memory_context`** (from `/memory:search`) -- Called in `resume` mode as the primary interrupted-session recovery path whenever no fresh `handover.md` already provides enough state. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:19:- **`memory_search`** (from `/memory:search`) -- Fallback for thin summaries when `memory_context` resolves the right folder but does not return enough state detail. Uses the same resume anchors.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:22:`memory_stats` remains diagnostic/helper access on the wrapper rather than part of the primary recovery chain. Additional helper access includes `memory_match_triggers()` for early session detection, `memory_delete`, `memory_update`, health, indexing, checkpoint, validation, and CocoIndex support surfaces.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:34:| 2 | `memory_context(mode: "resume")` | Primary interrupted-session recovery path |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:36:| 4 | `memory_search()` with resume anchors | Fallback when the summary is thin |
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:105:      'code_graph_context'
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:25:        preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:140:        nextActions: ['Use code_graph_query'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:151:      preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:154:    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:295:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:2:title: "Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:6:# Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:18:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:28:When `includeTrace` is enabled, `memory_context` also computes a trace-only `sessionTransition` payload and forwards it through the internal `memory_search` path. The contract is `trace.sessionTransition = { previousState, currentState, confidence, signalSources, reason? }`. Cold starts use `previousState: null`, the payload is omitted when trace is disabled, and this inference does not change retrieval routing beyond the existing mode-selection path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:76:- Source feature title: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md:20:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:5:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:451:  // F046: CocoIndex availability via shared helper (no process.cwd())
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:452:  const cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:468:    toolRoutingRules.push('semantic/concept queries → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:12:| `seed-resolver.ts` | Resolves CocoIndex file:line results to graph nodes |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:22:- **CocoIndex** (semantic, external MCP): finds relevant code by concept
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:116:            'code_graph_query outline payload rejects collapsed scalar fields: trust.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:166:    vi.doMock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:167:      isCocoIndexAvailable: vi.fn(() => true),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:6:// (CocoIndex) vs hybrid (both).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:113: * (code graph) and semantic (CocoIndex) retrieval backends.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:98:    '- CocoIndex: unknown',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:34:      // CocoIndex and triggered are empty, their floors + overflow go to others
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md:18:Instrumentation wiring is present in the retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:4:// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:5:// Provides the code_graph_context MCP tool implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:158:  actions.push('Use `mcp__cocoindex_code__search` for semantic discovery of related code');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:784:    // cocoIndex and triggered were empty — their section sources ('cocoindex', 'memory') should not
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:10:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:124:    `- CocoIndex: ${args.cocoIndexAvailable ? 'available' : 'missing'}`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:199:  const cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md:196:Search works the same way it always has. When you run `memory_search`, the system checks which shared spaces you belong to and includes those memories in results alongside your private ones. Collaborator B can find memories that Collaborator A saved to a shared space without needing to be in the same session or conversation.
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:193:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:195:      'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:297:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:923:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:940:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1050:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1099:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1109:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1127:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1153:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1160:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1173:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1559:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1577:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1610:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1615:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1618:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1623:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2080:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2081:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2338:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:4:// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:18:  cocoIndex: string;         // Semantic neighbors (from CocoIndex)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:172:  pushSection(input.cocoIndex, 'cocoIndex', 'Semantic Neighbors', 'cocoindex');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:199:          : section.source === 'cocoindex'
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:6:// using the 3-source merge pipeline (Memory, Code Graph, CocoIndex)
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:146:  // Hint for AI to use CocoIndex for semantic neighbors after recovery
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:148:    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:224:    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:360:      ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer.vitest.ts:24:    expect(sanitizeTriggerPhrase('phase 7 cocoindex')).toEqual({ keep: false, reason: 'suspicious_prefix' });
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:35:    '- CocoIndex: unknown',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:4:// Resolves CocoIndex search results (file:line) to code graph nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:10:/** A seed from CocoIndex or other providers */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18:/** Native CocoIndex search result as a seed */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:19:export interface CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:20:  provider: 'cocoindex';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:43:export type AnySeed = CodeGraphSeed | CocoIndexSeed | ManualSeed | GraphSeed;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:66:function isCocoIndexSeed(seed: unknown): seed is CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:67:  return hasProvider(seed, 'cocoindex');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:86:/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:87:export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:268:  if (isCocoIndexSeed(seed)) return resolveCocoIndexSeed(seed);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:98:        '- CocoIndex: unknown',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:99:    vi.doMock('../lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:100:      isCocoIndexAvailable: vi.fn(() => true),
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:117:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:139:    expect(parsed.data.payloadContract.summary).toContain('cocoindex=exact');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:144:      'cocoindex-status': 'exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:218:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:663:  name: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:680:            provider: { type: 'string', enum: ['cocoindex', 'manual', 'graph'], description: 'Seed provider type' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:681:            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:682:            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:683:            score: { type: 'number', description: 'CocoIndex relevance score' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:688:        description: 'Seeds from CocoIndex, manual input, or graph lookups',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:700:  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:706:  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:718:  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:747:      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:927:  // L8: CocoIndex
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:26:        'R4 nudges structural follow-up toward code_graph_query when graph readiness is high.',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:45:      liveBaselineResolution: 'code_graph_query',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:76:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:107:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:138:      liveBaselineResolution: 'memory_context_then_grep',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:433:- `code_graph_query` (structural relationship queries)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:435:- `code_graph_context` (LLM-oriented graph neighborhoods)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:55:| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
.opencode/skill/system-spec-kit/mcp_server/README.md:56:| **Search channels** | 5 core + CocoIndex bridge | Vector, FTS5, BM25, Causal Graph, Degree (+ CocoIndex semantic code search as external bridge) |
.opencode/skill/system-spec-kit/mcp_server/README.md:69:| **Search** | Vector similarity only | 5 core channels + CocoIndex bridge, fused with Reciprocal Rank Fusion (K tuned per intent) |
.opencode/skill/system-spec-kit/mcp_server/README.md:70:| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:227:**Five core search channels** work together, with **CocoIndex** available as an external semantic code search bridge:
.opencode/skill/system-spec-kit/mcp_server/README.md:236:| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
.opencode/skill/system-spec-kit/mcp_server/README.md:238:**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/README.md:266:**Stage 1 -- Gather candidates** using graph-first routing: structural queries dispatch to Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline's active channels in parallel. Constitutional-tier memories are always injected regardless of score.
.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:606:| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:1060:##### `code_graph_query`
.opencode/skill/system-spec-kit/mcp_server/README.md:1075:##### `code_graph_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:1077:Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1084:| `seeds` | array | Seeds from CocoIndex, manual input or graph lookups |
.opencode/skill/system-spec-kit/mcp_server/README.md:1177:Check CocoIndex availability, binary path and index status.
.opencode/skill/system-spec-kit/mcp_server/README.md:1181:| _(none required)_ |  | Returns CocoIndex health |
.opencode/skill/system-spec-kit/mcp_server/README.md:1187:Trigger CocoIndex incremental or full re-indexing of the workspace.
.opencode/skill/system-spec-kit/mcp_server/README.md:1197:Submit quality feedback on CocoIndex search results to improve future searches.
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:287:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:296:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:302:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:310:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:311:    expect(resp.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:318:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:328:  it('F7: Tool-specific hints included for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:330:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:353:    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:470:    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts:144:| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:112:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:179:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:180:        { tool: 'memory_search', expected: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:206:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:212:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:237:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:238:        { tool: 'memory_search', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:255:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:265:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:272:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:276:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:277:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:286:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:415:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/shared/README.md:300:| Technical Terms | 2.5x  | "generateContext", "memory_search"    |
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:252:### EX-001 | Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:258:Prompt: `Use memory_context in resume mode for: fix flaky index scan retry logic. Reuse a real sessionId with prompt-context history. Capture the evidence needed to prove Relevant bounded context returned; auto-resume systemPromptContext is injected before budget enforcement; final response stays within the advertised token budget. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:266:### EX-002 | Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:276:Additional audit scenario: `Run memory_search against a fixture set that contains one expired memory, one live memory, and enough constitutional rows to overflow a tiny limit. Capture the evidence needed to prove multi-concept search excludes the expired row, constitutional injection never returns more than the requested limit, and malformed embeddings fail with a clear validation-style error instead of a raw sqlite-vec exception. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:284:### EX-003 | Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1316:Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1318:description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2700:Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2703:Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3067:Prompt: `Run a search returning > 5 results and verify the response preserves full data.results while adding data.progressiveDisclosure with summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor. Then use memory_search({ cursor }) to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove the additive disclosure contract. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3469:| EX-001 | Existing Features | Unified context retrieval (memory_context) | [EX-001](01--retrieval/001-unified-context-retrieval-memory-context.md) | [01--retrieval/01-unified-context-retrieval-memorycontext.md](../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3470:| EX-002 | Existing Features | Semantic and lexical search (memory_search) | [EX-002](01--retrieval/002-semantic-and-lexical-search-memory-search.md) | [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3471:| EX-003 | Existing Features | Trigger phrase matching (memory_match_triggers) | [EX-003](01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md) | [01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md](../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3738:| 255 | Context Preservation | CocoIndex code graph routing | [255](22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md) | [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md) |
.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3747:| 264 | Context Preservation | Query-intent routing in memory_context | [264](22--context-preservation-and-code-graph/264-query-intent-routing.md) | [22--context-preservation-and-code-graph/19-query-intent-routing.md](../feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/032-5-embedding-and-api.md:29:| EX-032 | 5. Embedding and API | Provider selection audit | `Retrieve embedding provider selection rules. Capture the evidence needed to prove Provider rules and key precedence shown. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20 })` | Provider rules and key precedence shown | Search output | PASS if provider routing is clear | Verify env in runtime |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/033-6-debug-and-telemetry.md:29:| EX-033 | 6. Debug and Telemetry | Observability toggle check | `List telemetry/debug vars and separate opt-in flags from inert flags. Capture the evidence needed to prove Debug/telemetry controls identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 })` | Debug/telemetry controls identified | Search output | PASS if opt-in vs inert controls are clearly separated | Check feature flag governance section |
.opencode/skill/system-spec-kit/shared/algorithms/README.md:124:- **Consumers**: MCP server retrieval pipeline, `memory_search` and `memory_match_triggers` endpoints
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/028-1-search-pipeline-features-speckit.md:29:| EX-028 | 1. Search Pipeline Features (SPECKIT_*) | Flag catalog verification with inert and retired surface cleanup | `List SPECKIT search-pipeline flags as active, inert compatibility shims, or retired. Capture the evidence needed to prove active flags stay separated from inert compatibility shims such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING, and that retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not presented as active manual-test scenarios. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 })` -> `memory_context({ input: "Classify live search-pipeline flags versus inert compatibility shims and retired topics", mode: "deep", sessionId: "ex028" })` | Accurate active/inert/retired classification; retired topics absent from active manual-test guidance | Search/context outputs + catalog cross-check notes | PASS if classifications are internally consistent and retired topics are not framed as active checks | Validate against code/config docs; remove any manual-test wording that still treats retired topics as live search-pipeline behavior |
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/034-7-ci-and-build-informational.md:29:| EX-034 | 7. CI and Build (informational) | Branch metadata source audit | `Find branch env vars used in checkpoint metadata. Capture the evidence needed to prove Branch source vars surfaced. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })` | Branch source vars surfaced | Search output | PASS if all listed vars are found | Search CI scripts and runtime helpers |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:3:description: "This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:10:This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:18:- Objective: Verify `memory_context` emits trace-only session transitions with no non-trace leakage
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:19:- Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/142-session-transition-trace-contract.md:29:| 142 | Session transition trace contract | Verify `memory_context` emits trace-only session transitions with no non-trace leakage | `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true })` 2) Verify each result exposes `trace.sessionTransition.previousState`, `currentState`, `confidence`, and ordered `signalSources` 3) Repeat without `includeTrace` and verify `sessionTransition` is absent 4) Confirm the non-trace response does not expose transition data in top-level metadata | Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled | Two `memory_context` outputs with and without `includeTrace` + field-level comparison | PASS if trace-only gating holds and the contract fields are present only in the traced call | Inspect `handlers/memory-context.ts`, `handlers/memory-search.ts`, and `lib/search/session-transition.ts` if fields leak or ordering drifts |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/031-4-memory-and-storage.md:29:| EX-031 | 4. Memory and Storage | Storage precedence check | `Explain DB path precedence env vars. Capture the evidence needed to prove Precedence chain identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 })` -> `memory_context({ input: "Explain DB path precedence env vars", mode: "focused", sessionId: "ex031" })` | Precedence chain identified | Search/context output | PASS if precedence is unambiguous | Cross-check shared config loader and vector-index store override path |
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/007-memory-metadata-update-memory-update.md:29:| EX-007 | Memory metadata update (memory_update) | Metadata + re-embed update | `Update memory title and triggers. Capture the evidence needed to prove Updated metadata reflected in retrieval. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_update(id,title,triggers)` -> `memory_search(new title)` | Updated metadata reflected in retrieval | Update output + search | PASS if updated title retrievable | Retry with allowPartialUpdate if embedding fails |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:2:title: "EX-002 -- Semantic and lexical search (memory_search)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:3:description: "This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:6:# EX-002 -- Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:10:This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-semantic-and-lexical-search-memory-search.md:29:| EX-002 | Semantic and lexical search (memory_search) | Hybrid precision check | `Search for checkpoint restore clearExisting transaction rollback. Capture the evidence needed to prove Relevant ranked results with hybrid signals. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 })` -> `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true })` | Relevant ranked results with hybrid signals | Search output snapshot | PASS if top results match query intent | Lower minState; disable cache and retry |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/029-2-session-and-cache.md:29:| EX-029 | 2. Session and Cache | Session policy audit | `Retrieve dedup/cache policy settings. Capture the evidence needed to prove Session/cache controls found. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 })` | Session/cache controls found | Search output | PASS if all required keys surfaced | Expand query terms |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:2:title: "EX-003 -- Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:3:description: "This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:6:# EX-003 -- Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:10:This scenario validates Trigger phrase matching (memory_match_triggers) for `EX-003`. It focuses on Fast recall path plus trigger-cache reload efficiency.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/003-trigger-phrase-matching-memory-match-triggers.md:29:| EX-003 | Trigger phrase matching (memory_match_triggers) | Fast recall path plus trigger-cache reload efficiency | `Run trigger matching for resume previous session blockers with cognitive=true. Capture the evidence needed to prove Fast trigger hits + cognitive enrichment, trigger-cache reload reads from the partial index source (`idx_trigger_cache_source`), and repeated reloads on the same DB connection reuse the prepared loader statement. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` and capture the returned matches 2) In a debug harness or test shell on the same SQLite connection, call `refreshTriggerCache()` or clear+reload the trigger cache twice 3) Capture query-plan, schema, or instrumentation evidence that the reload source is constrained to successful rows with non-empty `trigger_phrases` and backed by `idx_trigger_cache_source` 4) Confirm the second reload on the same DB connection reuses the cached prepared loader statement instead of preparing a new one | Fast trigger hits + cognitive enrichment + partial-index-backed trigger-cache reload + per-connection prepared-statement reuse | Trigger output + cache-refresh logs or instrumentation + query-plan/schema evidence for `idx_trigger_cache_source` | PASS if matched triggers return with cognitive fields and cache reload evidence shows the partial index source plus prepared-statement reuse on the same DB connection. FAIL if trigger hits are missing, cognitive enrichment is absent, reload falls back to a full-table source, or each reload recompiles the loader statement. | Retry with higher-quality trigger phrase -> inspect trigger-cache clear/reload instrumentation -> verify `idx_trigger_cache_source` exists and the reload query still filters to successful rows with non-empty trigger phrases |
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md:29:| EX-006 | Memory indexing (memory_save) | New memory ingestion | `Index memory file and report action. Capture the evidence needed to prove Save action reported; searchable result appears; no template-contract or insufficiency rejection. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_save(filePath)` -> `memory_stats()` -> `memory_search(title)` | Save action reported; searchable result appears; no template-contract or insufficiency rejection | Save output + follow-up search | PASS if indexed and retrievable and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure | Validate file path/type, rendered anchor/frontmatter shape, and content quality |
.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/096-provenance-rich-response-envelopes-p0-2.md:29:| 096 | Provenance-rich response envelopes (P0-2) | Confirm includeTrace opt-in exposes scores/source/trace | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior. Capture the evidence needed to prove Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before running the "absent" assertion (env var forces trace inclusion regardless of arg). 1) `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects in response 2) `memory_search({query:"test"})` (no includeTrace, env unset) → verify these objects are absent 3) set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear due to env override 4) inspect score fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention | Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields | Search outputs with/without includeTrace + env override | PASS if trace objects present when opt-in or env-forced and absent otherwise | Check `handlers/memory-search.ts` for includeTrace and env branching |
.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/145-contextual-tree-injection-p1-4.md:29:| 145 | Contextual tree injection (P1-4) | Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled | `Validate contextual tree injection header format and flag toggle. Capture the evidence needed to prove Enabled: results with spec-folder paths have [parent > child — description] headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 })` with `SPECKIT_CONTEXT_HEADERS=true` (default) 2) Verify results with spec-folder file paths have a `[parent > child — desc]` header prepended to content 3) Verify header is truncated at 100 characters 4) Restart with `SPECKIT_CONTEXT_HEADERS=false` and repeat search 5) Verify no contextual headers are prepended | Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged | Search outputs with and without flag + header format verification | PASS if enabled mode injects correctly formatted headers and disabled mode skips injection entirely | Inspect `lib/search/hybrid-search.ts` `injectContextualTree`, `lib/search/search-flags.ts` `isContextHeadersEnabled`, and description cache population |
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md:26:  - `memory_search({ query:"<unique phrase from sandbox memory>", specFolder:"<sandbox-spec>", includeContent:true, limit:5 })`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:18:- Objective: Verify `/spec_kit:resume` uses `memory_context` in `resume` mode as the primary interrupted-session recovery path, falls back through `CONTINUE_SESSION.md`, anchored `memory_search()`, and `memory_list()` when needed, supports auto and confirm resume modes, and routes the user to the correct next step after recovery
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:19:- Prompt: `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:20:- Expected signals: `memory_context(mode: "resume")` is the first interrupted-session recovery path after any fresh handover; fallback behavior uses the documented resume anchors and recent-candidate discovery; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/190-session-recovery-spec-kit-resume.md:29:| 190 | Session recovery via /spec_kit:resume | Verify `/spec_kit:resume` recovery chain, ambiguity handling, and post-recovery routing | `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove resume-mode memory_context is the primary interrupted-session recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/spec_kit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first calls `memory_context` in `resume` mode when fresh handover data is absent or insufficient 2) Confirm resume recovery uses the documented anchors `["state", "next-steps", "summary", "blockers"]`, include-content behavior, and bounded token-budget response 3) If auto-resume is enabled for a reusable working-memory session, verify injected `systemPromptContext` is applied before token-budget enforcement 4) If the primary summary is thin, verify fallback to `CONTINUE_SESSION.md` and then anchored `memory_search()` using the same resume anchors 5) If no clear candidate exists, verify recent-candidate discovery through `memory_list()` 6) Invoke confirm mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives 7) Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/spec_kit:resume` work or `/memory:search history <spec-folder>` depending on user need | `memory_context(mode: "resume")` is primary after fresh handover handling; fallback chain activates correctly; confirm mode shows alternatives when needed; final response contains actionable continuation state and next-step routing | Command transcript; tool invocation logs for resume, search, and list paths; evidence of crash breadcrumb use if present; final recovery summary showing state, next steps, and routing recommendation | PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips resume mode, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable | Verify `/spec_kit:resume` command routing against `.opencode/command/spec_kit/resume.md`; inspect `memory-context.ts` resume-mode wiring; confirm fallback search anchors and candidate-discovery list behavior; check session-manager breadcrumbs and reusable-session auto-resume settings |
.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/030-3-mcp-configuration.md:29:| EX-030 | 3. MCP Configuration | MCP limits audit | `Find MCP validation settings defaults. Capture the evidence needed to prove MCP guardrails returned. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 })` | MCP guardrails returned | Search output | PASS if defaults + keys identified | Verify in config files directly |
.opencode/skill/system-spec-kit/README.md:62:| **MCP Tools**               | 43                   | Across 7 layers (L1-L7), including code graph, CocoIndex lifecycle, and session bootstrap tools |
.opencode/skill/system-spec-kit/README.md:93:| **Startup / Recovery Surfaces** | Runtime-specific startup context delivery where available, with `session_bootstrap()` as the canonical non-hook recovery entry and `session_resume()` as the detailed follow-up surface                    |
.opencode/skill/system-spec-kit/README.md:107:| **Graph Query**     | code_graph_scan, code_graph_query, code_graph_status, code_graph_context | Index, query, and explore structural relationships                 |
.opencode/skill/system-spec-kit/README.md:108:| **CCC (CocoIndex)** | ccc_status, ccc_reindex, ccc_feedback                                    | Semantic-search lifecycle management and operator feedback         |
.opencode/skill/system-spec-kit/README.md:109:| **Session**         | session_health, session_resume, session_bootstrap                        | Structural recovery, readiness checks, and startup/bootstrap state |
.opencode/skill/system-spec-kit/README.md:111:CocoIndex (semantic search) finds code by concept. Code Graph (structural) maps what connects to what. Startup and recovery surfaces now report freshness-aware graph state, structural read paths return a `readiness` block, and lightly stale graphs may repair inline with bounded `selective_reindex` while empty or broadly stale graphs stay on the explicit `code_graph_scan` path.
.opencode/skill/system-spec-kit/README.md:639:The **memory system** is the librarian. When a session ends, `generate-context.js` writes a summary of what happened and files it in the spec folder's `memory/` directory. The MCP server indexes it into vector, FTS5, and BM25 surfaces, while graph and degree signals are computed at retrieval time. When a new session starts, runtime-specific startup integrations may auto-surface that context. If startup context is unavailable or the runtime is operating without hooks, begin with `session_bootstrap()`, which bundles resume context, health, and structural readiness into one recovery call before deeper `memory_context` work begins.
.opencode/skill/system-spec-kit/README.md:660:  └─► Startup surface auto-primes OR session_bootstrap() runs once
.opencode/skill/system-spec-kit/README.md:858:**What you see**: Calling `memory_match_triggers()` returns an error or the tool is not recognized.
.opencode/skill/system-spec-kit/README.md:930:**What you see**: `memory_context()` returns irrelevant results or misses content you know exists.
.opencode/skill/system-spec-kit/README.md:944:# memory_context({ input: "find_decision: why did we choose JWT?", mode: "deep" })
.opencode/skill/system-spec-kit/README.md:1005:A: Spec folders capture what happened in structured documentation. The memory system makes that documentation searchable across sessions. When a session ends, `generate-context.js` writes a summary to the spec folder's `memory/` directory. The MCP server indexes it. When the next session starts, runtime-specific startup integrations may auto-surface that context; otherwise the canonical recovery sequence is `session_bootstrap()` first, then `memory_context` or `memory_match_triggers` for deeper retrieval. One side captures, the recovery surfaces retrieve.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/189-tool-result-extraction-to-working-memory.md:29:| 189 | Tool-result extraction to working memory | Verify automatic capture, session continuity, checkpoint preservation, attention decay, and optimized index/upsert behavior | `Validate tool-result extraction to working memory. Capture the evidence needed to prove salient tool outputs are automatically extracted into session-scoped working memory with provenance; follow-up turns can reuse that context; checkpoint restore preserves the extracted entries; attention decay follows the documented event-distance model with bounded mention boosts; the new indexes idx_wm_session_focus_lru and idx_wm_session_attention_focus support eviction and ordered reads; and upsertExtractedEntry() relies on INSERT ... ON CONFLICT without a pre-upsert existence probe. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start a reusable session such as `ex189-session` with the MCP server running so the extraction adapter is initialized through `context-server.ts` 2) Run an eligible retrieval tool call that returns salient results, for example `memory_search({ query: "checkpoint working memory", sessionId: "ex189-session" })`, and capture the tool output 3) Verify the extraction path runs after the tool response, including summary/redaction checks and an `upsertExtractedEntry()` insertion into working memory with provenance fields 4) Capture schema or query-plan evidence that `idx_wm_session_attention_focus` backs attention-ordered session reads and `idx_wm_session_focus_lru` backs least-recently-focused eviction ordering 5) Confirm the extraction write path uses a single `INSERT ... ON CONFLICT(session_id, memory_id) DO UPDATE` without a pre-upsert existence probe such as `SELECT COUNT(*)` 6) In the same session, ask a follow-up question such as `memory_context({ input: "What did the last retrieval find about checkpoint working memory?", mode: "focused", sessionId: "ex189-session" })` and confirm the prior extracted result is available without repeating the original search 7) Create and restore a checkpoint for the same session and verify the extracted working-memory entry remains available after restore 8) Advance several events and repeated mentions, then confirm the attention score follows the documented decay contract: 0.85 per elapsed event, floor 0.05 during decay updates, bounded `MENTION_BOOST_FACTOR = 0.05`, and eviction only once score drops below 0.01 | Automatic extraction runs after eligible tool responses; extracted entries carry provenance; follow-up context reuses the prior result; checkpoint restore retains the entry; attention scoring follows the documented decay, floor, mention boost, and eviction behavior; the new indexes back session reads and LRU eviction; extraction upsert executes without a pre-upsert existence probe | Tool outputs; working-memory or log evidence showing extraction/upsert; schema/query-plan evidence for `idx_wm_session_focus_lru` and `idx_wm_session_attention_focus`; follow-up retrieval transcript; checkpoint save/restore evidence; score traces or diagnostic logs showing decay behavior | PASS: Automatic extraction, cross-turn reuse, checkpoint preservation, attention-scoring behavior, index-backed reads/eviction, and direct `ON CONFLICT` upserts all align. FAIL: extracted entries are missing, unusable across turns, lost on restore, decay/boost behavior contradicts the documented contract, required indexes are absent, or the write path still performs a pre-upsert existence check. | Verify after-tool callback registration in `context-server.ts` -> inspect `extraction-adapter.ts` for summary or redaction gating -> confirm session IDs and memory IDs are stable -> inspect checkpoint restore flow -> review score-clamp and eviction handling in working-memory decay logic -> confirm no pre-upsert existence probe remains in `upsertExtractedEntry()` |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:24:  1. `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` — primary recovery path
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:28:  5. If summary is still thin, run anchored fallback: `memory_search({ query: "session state next steps summary blockers", specFolder: "specs/<target-spec>", anchors: ["state","next-steps","summary","blockers"], includeContent: true, limit: 5 })`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:29:- Expected: Resume-ready state summary and next steps via `memory_context(mode:"resume")` as primary path.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:30:- Evidence: returned context + extracted next actions + recovery source identification (memory_context / continue_session / memory_search / user).
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:31:- Pass: `memory_context(mode:"resume")` is used as the primary recovery path; continuation context is actionable and specific.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-context-recovery-and-continuation.md:32:- Fail triage: verify `memory_context` resume mode routes correctly; broaden anchors on fallback search; verify spec folder path; check `CONTINUE_SESSION.md` presence.
.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/008-single-and-folder-delete-memory-delete.md:29:| EX-008 | Single and folder delete (memory_delete) | Atomic single delete | `Delete memory ID and verify removal. Capture the evidence needed to prove Deleted item absent from retrieval. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>")` -> `memory_delete(id)` -> `memory_search(old title)` | Deleted item absent from retrieval | Delete output + search | PASS if deleted item not found and checkpoint exists | Restore `pre-ex008-delete`; verify sandbox folder |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/004-hybrid-search-pipeline.md:29:| EX-004 | Hybrid search pipeline | Channel fusion sanity, caller-preserving fallback, and trace consistency | `Validate the hybrid search pipeline with trace enabled. Capture the evidence needed to prove multiple channels can contribute to the same query, score aliases stay aligned after boosts, explicit channel disables such as useGraph:false remain disabled even when fallback widens retrieval, and the lexical fallback path only uses allowed lexical channels with normalized query preparation. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true })` 2) `memory_search({ query:"graph rollout trace check", limit:10, includeTrace:true, bypassCache:true, useGraph:false })` 3) Compare the trace envelopes and confirm graph plus degree contributions disappear from the second run 4) Source-check `collectRawCandidates()` in `mcp_server/lib/search/hybrid-search.ts` if the trace does not make the fallback routing explicit | Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across exposed score aliases; `useGraph:false` suppresses graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels | Paired trace outputs plus source-backed fallback routing confirmation if needed | PASS if fusion evidence is coherent, explicit channel disables survive fallback, and no contradictory channel trace appears | Inspect `hybrid-search.ts` candidate routing and trace fields if graph or degree signals leak into the `useGraph:false` run |
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/121-adaptive-shadow-proposal-and-rollback-phase-4.md:29:| 121 | Adaptive shadow proposal and rollback (Phase 4) | Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly | `Validate Phase 4 adaptive shadow proposal flow. Capture the evidence needed to prove Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Set `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` and leave `SPECKIT_MEMORY_ADAPTIVE_MODE` unset 2) Trigger access/validation events for one memory 3) Run `memory_search({ query:"adaptive shadow check", includeTrace:true })` 4) Verify response includes `adaptiveShadow` proposal data while production ordering remains the live result order 5) Disable the flag and repeat | Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output | Search output with `adaptiveShadow` payload + before/after flag comparison + signal capture evidence from validation/access paths | PASS: Shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; FAIL: Live order changes under shadow mode or proposal persists after disable | Verify adaptive signals were recorded from access/validation → Inspect bounded delta cap → Confirm disable path clears proposal output without schema rollback |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/109-quality-aware-3-tier-search-fallback.md:29:| 109 | Quality-aware 3-tier search fallback | Confirm multi-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation in the Stage 1 pipeline. Capture evidence for quality-checked multi-tier fallback via collectRawCandidates and single-pass enrichment on the final merged tier.` | 1) Verify `collectRawCandidates()` in `hybrid-search.ts` calls `executeFallbackPlan(..., { stopAfterFusion: true })` when the fallback flag is enabled 2) Confirm Tier 1 runs at minSimilarity=0.3, `checkDegradation()` evaluates quality, and Tier 2 widens to minSimilarity=0.1 only inside `allowedChannels` 3) Verify `searchWithFallbackTiered()` merges Tier 1, Tier 2, and calibrated Tier 3 candidates before calling `enrichFusedResults()` once on the final stage execution context 4) Confirm enrichment-only stages such as reranking, co-activation, contextual headers, and `truncateToBudget()` live inside `enrichFusedResults()` rather than the per-tier collection path 5) When flag=false: verify two-pass adaptive (0.3→0.17) without quality-checked tiering 6) Verify `executePipeline()` in `memory_search` handler routes through Stage 1 which calls `collectRawCandidates()` | Tier 1 runs with minSimilarity=0.3; checkDegradation evaluates quality; Tier 2 widens within the allowed channel set; per-tier collection stops after fusion; enrichment runs once on the final merged candidate set; lexical structural fallback respects caller-disabled channels; flag=false switches to two-pass adaptive | Source code: `hybrid-search.ts` collectRawCandidates, `executeFallbackPlan()`, `searchWithFallbackTiered()`, `enrichFusedResults()`, plus `search-flags.ts` fallback gate | PASS if quality-checked multi-tier fallback triggers via collectRawCandidates, preserves explicit channel disables, and only performs enrichment after the final merged tier is selected | Inspect `collectRawCandidates()` stop-after-fusion behavior, `checkDegradation()` thresholds, `searchWithFallbackTiered()` merge order, and whether enrichment helpers are invoked once or per tier |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/005-4-stage-pipeline-architecture.md:29:| EX-005 | 4-stage pipeline architecture | Stage invariant verification | `Search Stage4Invariant score snapshot verifyScoreInvariant. Capture the evidence needed to prove No invariant errors; stable final scoring. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search(query,intent:understand)` | No invariant errors; stable final scoring | Output + logs | PASS if no score-mutation symptoms | Inspect stage metadata and flags |
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/174-graph-concept-routing-speckit-graph-concept-routing.md:29:| 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | Verify query-time alias matching activates graph channel for matched concepts | `Test the default-on SPECKIT_GRAPH_CONCEPT_ROUTING behavior. Run a query with indirect concept references and verify graph channel activation via alias matching. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_GRAPH_CONCEPT_ROUTING` is unset or `true` 2) `memory_search({ query: "how does memory decay work" })` 3) Inspect entity-linker output for noun phrase extraction 4) Verify alias table matching returns canonical concepts 5) Confirm graph channel activated for matched concepts in stage1-candidate-gen | isGraphConceptRoutingEnabled() returns true; noun phrases extracted from query; alias table consulted in SQLite; canonical concept names returned; graph channel activated for matched concepts | Entity linker output + concept matches + graph channel activation log + test transcript | PASS if indirect concept references activate graph channel via noun phrase extraction and alias matching; FAIL if noun phrases not extracted, alias table skipped, or graph channel not activated | Verify isGraphConceptRoutingEnabled() → Confirm flag is not forced off → Check entity-linker.ts noun phrase extraction → Inspect alias table in SQLite → Verify stage1-candidate-gen graph channel activation logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:29:| 187 | Quick search (memory_quick_search) | Verify `memory_quick_search` simplified query-only retrieval | `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Call `memory_quick_search({ query: "authentication" })` with no optional parameters and verify results are returned 2) Call `memory_quick_search({ query: "authentication", specFolder: "specs/<known-spec>" })` and verify results are scoped to the specified folder 3) Call `memory_quick_search({ query: "authentication", limit: 3 })` and verify at most 3 results are returned 4) Call `memory_quick_search({ query: "authentication", tenantId: "tenant-1" })` and verify governed retrieval boundary is respected 5) Compare `memory_quick_search` results with `memory_context` results for the same query to confirm quick_search provides a simplified fast-path alternative | Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately | Tool outputs for each call showing result count, specFolder scoping, limit adherence, and tenant filtering | PASS: Quick search returns relevant results, specFolder narrows scope, limit is respected, governed boundaries filter; FAIL: Quick search returns no results for a known query, specFolder is ignored, limit is exceeded, or governed boundaries do not filter | Verify `memory_quick_search` tool is listed in search.md allowed-tools → Check L2 layer routing → Confirm query parameter is required → Inspect optional parameter handling for specFolder, limit, tenantId, userId, agentId, sharedSpaceId |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:2:title: "EX-001 -- Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:3:description: "This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull."
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:6:# EX-001 -- Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:10:This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull.
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:19:- Prompt: `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md:29:| EX-001 | Unified context retrieval (memory_context) | Intent-aware context pull | `Use memory_context in auto mode for: fix flaky index scan retry logic. Capture the evidence needed to prove Relevant bounded context returned; no empty response. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_match_triggers({ prompt: "fix flaky index scan retry logic", sessionId: "ex001" })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "auto", sessionId: "ex001" })` -> `memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })` | Relevant bounded context returned; no empty response | Tool outputs + mode selection | PASS if relevant context returned in both calls | Check specFolder/intent mismatch, retry with explicit intent |
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/196-tool-level-ttl-cache.md:29:| 196 | Tool-level TTL cache | Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation | `Verify the tool-level TTL cache on a repeated expensive request. Run the same request twice within the active TTL window and confirm the second run is served from the per-tool cache using the same SHA-256 cache key. Then invalidate the relevant search path with a mutation or wait for TTL expiry and verify the next run recomputes instead of serving stale data. Capture hit, miss, eviction or invalidation evidence and return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm current cache settings, including active TTL window 2) Run a repeatable expensive request such as the same `memory_search` twice with identical inputs 3) Inspect cache stats or trace output to confirm miss then hit on the same tool/input key 4) Perform a relevant mutation such as `memory_save`, `memory_update`, or `memory_delete`, or wait past TTL expiry 5) Re-run the same request and confirm recomputation plus invalidation or expiry accounting | First run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data | Terminal transcript, cache stats or logs, repeated request output, and post-mutation or post-expiry rerun evidence | PASS: second identical run is a cache hit and the next run after invalidation or expiry recomputes cleanly; FAIL: repeated request misses inside TTL, stale results survive invalidation, or stats contradict the observed behavior | Verify TTL config and max-entry settings -> Confirm identical tool/input payloads were used -> Inspect cache-key hashing and per-tool scoping -> Check mutation hook invalidation path -> Review expiry cleanup timing and oldest-entry eviction behavior |
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/002-targeted-memory-lookup.md:24:  - `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/143-bounded-graph-walk-rollout-and-diagnostics.md:29:| 143 | Bounded graph-walk rollout and diagnostics | Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering | `Validate bounded graph-walk rollout states and trace diagnostics. Capture the evidence needed to prove Rollout states switch cleanly between trace_only, bounded_runtime, and off; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; off disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare a graph-connected sandbox corpus 2) Start runtime with `SPECKIT_GRAPH_WALK_ROLLOUT=trace_only` and run `memory_search({ query:"graph rollout trace check", includeTrace:true, limit:10 })` 3) Verify `trace.graphContribution.rolloutState` is `trace_only` and `appliedBonus` remains 0 while `raw`/`normalized` are still visible 4) Restart with `SPECKIT_GRAPH_WALK_ROLLOUT=bounded_runtime` and repeat 5) Verify `appliedBonus` is present, bounded at `<= 0.03`, and `capApplied` flips to `true` when the bounded runtime bonus saturates at the Stage 2 cap 6) Restart with `SPECKIT_GRAPH_WALK_ROLLOUT=off` and verify the graph-walk bonus disappears while the broader graph-signal path stays governed by `SPECKIT_GRAPH_SIGNALS` and repeated identical runs keep the same ordering | Rollout states switch cleanly between `trace_only`, `bounded_runtime`, and `off`; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; `off` disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering | Search outputs for all three rollout states + ordering comparison across repeated runs | PASS if rollout state, bounded bonus, cap saturation signaling, and ordering guarantees all match the documented ladder | Inspect `lib/search/search-flags.ts`, `lib/search/graph-flags.ts`, `lib/graph/graph-signals.ts`, and `lib/search/pipeline/ranking-contract.ts` if bonus or ordering contracts drift |
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:300:    vi.doMock('../../mcp_server/lib/utils/cocoindex-path.js', () => ({
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:301:      isCocoIndexAvailable: vi.fn(() => true),
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:314:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:315:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:341:          '- CocoIndex: available',
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/158-graph-calibration-profile-speckit-graph-calibration-profile.md:29:| 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | Verify graph weight cap and community score capping | `Test SPECKIT_GRAPH_CALIBRATION_PROFILE=true. Run a search with graph signals active and verify graph weight contribution is capped at 0.05 and community scoring boost is capped at 0.03. Capture the evidence needed to prove cap enforcement and Louvain threshold gating. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_GRAPH_CALIBRATION_PROFILE=true` 2) `memory_search({ query: "test calibration", mode: "deep" })` 3) Inspect Stage 2 graph weight contribution 4) `npx vitest run tests/graph-calibration.vitest.ts` | applyGraphWeightCap() clamps to [0, 0.05]; applyCommunityScoring() caps at 0.03; shouldActivateLouvain() respects thresholds; calibrateGraphWeight() enforces N2a/N2b caps | Test transcript with cap verification + scoring context before/after calibration | PASS if graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced; FAIL if any score exceeds its cap or Louvain activates below threshold | Verify isGraphCalibrationEnabled() → Check loadCalibrationProfile() env overrides → Inspect GRAPH_WEIGHT_CAP constant (0.05) → Verify COMMUNITY_SCORE_CAP constant (0.03) → Check Louvain minDensity (0.3) and minSize (10) |
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/163-query-surrogates-speckit-query-surrogates.md:29:| 163 | Query surrogates (SPECKIT_QUERY_SURROGATES) | Verify surrogates generated and matched | `Test SPECKIT_QUERY_SURROGATES=true. Save a memory, verify surrogates generated at index time, then search using alias terms and verify matching boost scores. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_QUERY_SURROGATES=true` 2) `memory_save({ ... })` with content containing abbreviations and headings 3) Inspect stored SurrogateMetadata 4) `memory_search({ query: "abbreviation term" })` 5) Verify SurrogateMatchResult 6) `npx vitest run tests/query-surrogates.vitest.ts` | SurrogateMetadata with aliases, headings, summary, surrogateQuestions; query matching returns score > MIN_MATCH_THRESHOLD; no LLM calls | SurrogateMetadata output + SurrogateMatchResult + test transcript | PASS if surrogates generated and matching returns boost scores; FAIL if surrogates empty or matching returns zero for known terms | Verify isQuerySurrogatesEnabled() → Check extractAliases() for parenthetical patterns → Inspect MAX_SURROGATE_QUESTIONS (5) → Verify MIN_MATCH_THRESHOLD (0.15) → Check MAX_SUMMARY_LENGTH (200) |
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md:29:| 171 | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | Verify calibrated bonus replaces flat convergence bonus in RRF fusion | `Test the default-on SPECKIT_CALIBRATED_OVERLAP_BONUS behavior. Run a multi-channel search producing overlapping results and verify calibrated bonus with beta=0.15 and cap=0.06 replaces the flat 0.10 bonus. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_CALIBRATED_OVERLAP_BONUS` is unset or `true` 2) `memory_search({ query: "query producing multi-channel overlap" })` 3) Inspect fuseResultsMulti() output for calibrated bonus values 4) Verify bonus <= 0.06 5) Set flag to `false`, re-run, verify flat 0.10 bonus applied | isCalibratedOverlapBonusEnabled() returns true; bonus uses beta=0.15 scaling with mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; falls back to CONVERGENCE_BONUS=0.10 when OFF | fuseResultsMulti() output scores + bonus breakdown + test transcript | PASS if calibrated bonus applied with correct beta=0.15 and cap=0.06 for overlapping results; FAIL if flat 0.10 bonus applied, bonus exceeds cap, or flag defaults OFF | Verify isCalibratedOverlapBonusEnabled() → Confirm flag is not forced off → Check CALIBRATED_OVERLAP_BETA=0.15 constant → Verify CALIBRATED_OVERLAP_MAX=0.06 cap → Inspect fuseResultsMulti() overlap detection logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/095-strict-zod-schema-validation-p0-1.md:29:| 095 | Strict Zod schema validation (P0-1) | Confirm schema enforcement rejects hallucinated params | `Validate SPECKIT_STRICT_SCHEMAS enforcement. Capture the evidence needed to prove Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer. Return a concise user-facing pass/fail verdict with the main reason.` | 1) call any MCP tool with an extra unknown parameter (e.g., `memory_search({query:"test", bogus:1})`) 2) verify Zod strict error is returned 3) set `SPECKIT_STRICT_SCHEMAS=false` and confirm `.passthrough()` allows the extra param 4) verify validation runs per-tool in handler, not duplicated at server dispatch | Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer | Tool outputs + Zod error messages | PASS if strict mode rejects unknown params and passthrough mode allows them | Inspect `tool-schemas.ts` for `.strict()` vs `.passthrough()` branching |
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/162-hyde-speckit-hyde.md:29:| 162 | HyDE (SPECKIT_HYDE) | Verify HyDE pseudo-document generated | `Test SPECKIT_HYDE=true with deep mode on low-confidence queries. Verify pseudo-document generation and active merge (default). Then set SPECKIT_HYDE_ACTIVE=false and verify shadow-only behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_HYDE=true` 2) `memory_search({ query: "obscure topic with few matches", mode: "deep" })` 3) Inspect HyDEResult for pseudoDocument + embedding 4) Verify active merge (default, SPECKIT_HYDE_ACTIVE is ON) 5) Set `SPECKIT_HYDE_ACTIVE=false`, verify shadow-only (logged, not merged) 6) Check LLM cache populated | HyDEResult with pseudoDocument and Float32Array embedding; low-confidence threshold at 0.45; active merge by default (SPECKIT_HYDE_ACTIVE ON); shadow-only when SPECKIT_HYDE_ACTIVE=false; LLM cache shared | HyDEResult output + merge verification + shadow log + cache key verification | PASS if pseudo-document generated for low-confidence query, merged by default, and shadow-only with SPECKIT_HYDE_ACTIVE=false; FAIL if no generation or merge behavior mismatches flag state | Verify isHyDEEnabled() → Check LOW_CONFIDENCE_THRESHOLD (0.45) → Inspect baseline result scores → Verify getLlmCache() key → Check HYDE_TIMEOUT_MS (8000) → Verify isHyDEActive() gate |
.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md:29:| 118 | Stage-2 score field synchronization (P0-8) | Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting | `Run a non-hybrid search with intent weighting and verify score fields stay synchronized. Capture the evidence needed to prove intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Memory database with varied content. 1) Call `memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true })` targeting non-hybrid flow 2) Inspect trace: verify `intentAdjustedScore` is set at Step 4 3) Verify subsequent artifact routing and feedback signals modify `score` 4) Verify final `intentAdjustedScore >= score` (Math.max sync applied) 5) Verify `resolveEffectiveScore()` returns the synchronized value | intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value | Search trace output showing score field progression through pipeline stages | PASS if intentAdjustedScore is synchronized with score via Math.max and resolveEffectiveScore returns the correct final value | Inspect stage-2 intent weighting logic; verify Math.max sync placement; check resolveEffectiveScore fallback chain for non-hybrid flow |
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/173-query-decomposition-speckit-query-decomposition.md:29:| 173 | Query decomposition (SPECKIT_QUERY_DECOMPOSITION) | Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries | `Test the default-on SPECKIT_QUERY_DECOMPOSITION behavior in deep mode. Run a multi-faceted query and verify decomposition into max 3 sub-queries. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true` 2) `memory_search({ query: "What is the memory save workflow and how does query expansion work?", mode: "deep" })` 3) Inspect decomposition output for sub-queries 4) Verify sub-query count <= 3 5) Run same query in non-deep mode, verify no decomposition | isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error | Decomposed sub-query list + retrieval results per facet + test transcript | PASS if multi-faceted query decomposes into <= 3 focused sub-queries in deep mode using rule-based heuristics; FAIL if > 3 sub-queries, runs outside deep mode, uses LLM, or fails without fallback | Verify isQueryDecompositionEnabled() → Confirm flag is not forced off → Check MAX_FACETS=3 constant → Inspect conjunction splitting regex → Verify deep-mode gate in stage1-candidate-gen → Check graceful fallback path |
.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/120-unified-graph-rollback-and-explainability-phase-3.md:29:| 120 | Unified graph rollback and explainability (Phase 3) | Confirm graph kill switch removes graph-side effects while traces still explain enabled runs | `Validate Phase 3 graph rollback and explainability. Capture the evidence needed to prove When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; the graph FTS query materializes matched rowids once in a CTE, expands via UNION ALL source/target edge lookups, and avoids JS-side dedup; when disabled, graph-side effects are absent and baseline ordering remains deterministic. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run `memory_search({ query:"graph rollout check", includeTrace:true })` with graph rollout enabled 2) Capture SQL/query-plan evidence that the graph FTS path uses a matched-memory CTE plus `UNION ALL` source/target edge lookups and SQL-side duplicate collapse 3) Repeat the enabled query to confirm deterministic ordering and cached FTS availability behavior 4) Set `SPECKIT_GRAPH_UNIFIED=false` 5) Repeat query 6) Verify graph contribution counters drop to zero and ordering stays stable | When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; graph FTS path uses a CTE with SQL-side dedup and cached FTS-table availability; when disabled, graph-side effects are absent and baseline ordering remains deterministic | Search output + trace payloads for enabled/disabled runs + SQL/query-plan evidence for the CTE path + repeated query ordering comparison | PASS: Enabled trace shows graph contributions, enabled query evidence shows the CTE/UNION ALL path with SQL-side dedup and cached FTS availability, disabled trace shows kill-switch baseline parity, repeated runs preserve exact ordering; FAIL: Graph effects remain after disable, CTE path regresses to OR-join or JS dedup, or repeated runs reorder ties | Verify `SPECKIT_GRAPH_UNIFIED` propagation into Stage 2 → Inspect `graphContribution` trace metadata → Inspect graph query shape for CTE materialization and SQL-side dedup → Re-run identical query to confirm tie-break stability and cached FTS availability |
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-happy-path.json:22:    "phase 7 cocoindex",
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/167-response-profile-v1-speckit-response-profile-v1.md:29:| 167 | Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) | Verify quick profile reduced response shape | `Test SPECKIT_RESPONSE_PROFILE_V1=true with profile=quick. Verify topResult, oneLineWhy, omittedCount, and tokenReduction shape. Test other profiles for expected shapes. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_RESPONSE_PROFILE_V1=true` 2) `memory_search({ query: "test profiles", profile: "quick" })` 3) Verify QuickProfile shape 4) Re-run with profile=research, verify ResearchProfile 5) Re-run with profile=resume, verify ResumeProfile | quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF | Response JSON per profile + token savings calculation | PASS if each profile shape correct and full response when flag OFF; FAIL if shape fields missing or token savings absent | Verify SPECKIT_RESPONSE_PROFILE_V1 env → Inspect profile-formatters.ts profile routing → Check estimateTokens() → Verify QuickProfile.tokenReduction.savingsPercent → Check fallback for unknown profile names |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:16:- **Objective**: Verify that the code graph SQLite storage (code-graph.sqlite) correctly indexes source files into `code_files`, `code_nodes`, and `code_edges` tables. The structural indexer must extract function declarations, class definitions, and import statements as nodes, and build call/import relationship edges. The 4 MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`) must return correct results. WAL mode and foreign keys must be enabled.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:22:- **Prompt**: `Validate 254 Code graph storage and query behavior. Run the vitest suite for code-graph-indexer and confirm: (1) code_graph_scan indexes files and produces code_files, code_nodes, code_edges rows, (2) function/class/import nodes extracted with correct types, (3) call and import edges built between nodes, (4) code_graph_query returns outline/calls/imports results, (5) code_graph_status returns health metrics (file count, node count, edge count), (6) SQLite WAL mode and foreign keys enabled.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:28:  - `code_graph_query` for outline mode returns symbol list for a given file
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:29:  - `code_graph_query` for calls mode returns callers/callees of a symbol
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:30:  - `code_graph_query` for imports mode returns import relationships
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:45:| 254c | Code graph storage and query | Query tools (outline, calls, imports, status) return correct results | `Validate 254c query tools` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | `code_graph_query` returns results for outline/calls/imports modes, `code_graph_status` returns file/node/edge counts | Test output showing query results | PASS if all 4 MCP tool operations return non-empty valid results | Check handler implementations in `handlers/code-graph/` |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:3:description: "This scenario validates CocoIndex bridge for 255. It focuses on CocoIndex used for semantic, code_graph for structural."
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:10:This scenario validates CocoIndex bridge.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16:- **Objective**: Verify that the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (`seed-resolver.ts`) normalizes CocoIndex file:line results to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop graph neighbors), outline (file symbol listing), and impact (reverse callers). Budget-aware truncation must apply to context output.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:18:  - Semantic: `mcp__cocoindex_code__search({ query: "memory search pipeline" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:19:  - Structural: `code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` (`operation` + `subject` are required)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:23:  - CocoIndex Code MCP server available (for semantic search), or mocked in tests
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:25:- **Prompt**: `Validate 255 CocoIndex bridge behavior. Confirm: (1) semantic queries route to mcp__cocoindex_code__search and return meaning-based results, (2) structural queries route to code_graph_query and return symbol/edge-based results, (3) seed resolver normalizes CocoIndex file:line to ArtifactRef (exact > enclosing > file anchor), (4) code_graph_context expands in neighborhood/outline/impact modes, (5) results from each system are qualitatively different and appropriate to the query type.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:27:  - Semantic query ("how does memory search work") returns conceptually related code files via CocoIndex embedding similarity
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:29:  - Seed resolver resolves CocoIndex results to graph nodes via: exact symbol match, then enclosing symbol fallback, then file-level anchor
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:30:  - `code_graph_context` neighborhood mode returns 1-hop connected symbols
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:31:  - `code_graph_context` outline mode returns all symbols in a file
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:32:  - `code_graph_context` impact mode returns reverse callers (who depends on this)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:36:  - FAIL: Semantic query returns structural results (or vice versa), seed resolver fails to resolve valid CocoIndex results, or context expansion returns empty for populated graph
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:44:| 255a | CocoIndex bridge | Semantic query routes to CocoIndex and returns meaning-based results | `How does the memory search pipeline work?` | `Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" })` | Results are semantically related files (e.g., search handler, query router) rather than exact string matches | CocoIndex search output listing relevant file paths with similarity scores | PASS if results are conceptually relevant to the query meaning | Verify CocoIndex MCP server is running and index is built |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:45:| 255b | CocoIndex bridge | Structural query routes to code_graph and returns edge-based results | `What functions call allocateBudget?` | `Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` | Returns exact caller functions with file paths and line numbers from code_edges table | Code graph query output showing caller/callee relationships | PASS if callers are exact function references from the graph database | Verify code graph is indexed and contains allocateBudget node |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:46:| 255c | CocoIndex bridge | code_graph_context expands in neighborhood, outline, and impact modes | `Validate 255c context expansion modes` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers | Test output showing each mode's distinct results | PASS if all 3 modes return non-empty, mode-appropriate results | Check `code-graph-context.ts` for mode handling logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:53:- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:62:- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/161-llm-reformulation-speckit-llm-reformulation.md:29:| 161 | LLM reformulation (SPECKIT_LLM_REFORMULATION) | Verify reformulation pipeline runs in deep mode | `Run a deep-mode search and verify step-back abstract and corpus-grounded variants are produced. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "complex multi-faceted query", mode: "deep" })` 2) Inspect reformulation output for abstract + variants 3) Verify cache populated 4) Re-run same query, verify cache hit | cheapSeedRetrieve() returns FTS5/BM25 seeds; abstract >= 5 chars; variants array max 2; LLM cache hit on repeat; no-op in non-deep mode | ReformulationResult output + cache hit log + test transcript | PASS if reformulation produces valid abstract + variants in deep mode and skips in non-deep; FAIL if abstract empty, variants > 2, or runs outside deep mode | Verify isLlmReformulationEnabled() → Check LLM_REFORMULATION_ENDPOINT configured → Inspect cheapSeedRetrieve() for FTS5 results → Verify normalizeQuery() cache key → Check REFORMULATION_TIMEOUT_MS (8000) |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:16:- **Objective**: Verify that the tool routing enforcement layer (Phase 025) correctly injects routing rules at all 3 MCP enforcement points (server instructions, session priming, response hints) and that all runtime instruction files and context-prime agents propagate routing directives. This ensures AI assistants across all CLIs use CocoIndex for semantic searches and Code Graph for structural queries instead of defaulting to Grep.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:22:- **Prompt**: `Validate 267 tool routing enforcement. Confirm: (1) buildServerInstructions() injects a Tool Routing section with CocoIndex and Code Graph rules, (2) first-call PrimePackage includes routingRules.toolRouting with SEARCH ROUTING directive, (3) response hints on code-search style memory queries recommend cocoindex_code__search, (4) all runtime instruction files contain active routing enforcement, and (5) all context-prime agent definitions include the routing decision table in their prime output format.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:26:  - Code-search-oriented tool responses include hints pointing to `mcp__cocoindex_code__search`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:27:  - All 4 runtime instruction files contain CocoIndex/semantic-search routing enforcement language
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:39:| 267a | Tool routing enforcement | Server instructions contain routing section | `Validate 267a server instruction routing section` | `cd .opencode/skill/system-spec-kit && rg -n "## Tool Routing|buildServerInstructions" mcp_server/context-server.ts && node -e "const fs=require('fs'); const p='mcp_server/context-server.ts'; const s=fs.readFileSync(p,'utf8'); console.log(s.includes('## Tool Routing'))"` | `buildServerInstructions()` source includes `## Tool Routing` section and routing-rule assembly mentioning CocoIndex and Code Graph | Source grep output and boolean confirmation from the script | PASS if the routing section is present in server instructions | Check `mcp_server/context-server.ts` around `buildServerInstructions()` and confirm routing rules are not gated off unexpectedly |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:41:| 267c | Tool routing enforcement | Tool response hints fire on code-search queries | `find function implementations` | `Manual: call memory_search({ query: "find function implementations" })` | Response hints suggest semantic code search via `mcp__cocoindex_code__search` | MCP response hints showing routing recommendation | PASS if a hint explicitly mentions `cocoindex_code__search` | Check `mcp_server/hooks/response-hints.ts` code-search detection patterns and confirm the query is classified as code-search intent |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:42:| 267d | Tool routing enforcement | All 4 runtime instruction files have routing tables | `Validate 267d runtime instruction routing tables` | `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "CocoIndex|semantic search|Tool Routing Enforcement|SEARCH ROUTING" CLAUDE.md .claude/CLAUDE.md .codex/CODEX.md .gemini/GEMINI.md` | All 4 runtime instruction files contain routing enforcement language for semantic vs structural queries | Grep output with matches from all 4 files | PASS if all 4 files contain routing enforcement | If one file is missing, compare it to the others and patch the runtime-specific instruction document that drifted |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md:43:| 267e | Tool routing enforcement | Context-prime agents include routing table in output | `Validate 267e context-prime routing table` | `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "## Tool Routing|Semantic/concept|code_graph_query|mcp__cocoindex_code__search" .opencode/agent/context-prime.md .claude/agents/context-prime.md .codex/agents/context-prime.md .gemini/agents/context-prime.md` | Context-prime agent files across runtimes include the routing decision table in the Prime Package output format | Grep output showing routing-table lines in all 4 agent files | PASS if routing directives are present in all context-prime agent files | Check for runtime drift between agent copies and restore the shared routing table if one copy fell behind |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/258-compact-merger-assembly.md:16:- **Objective**: Verify that the compact merger (`mergeCompactBrief()`) combines context from 3 sources (Memory, Code Graph, CocoIndex) plus session state and triggered memories into a unified compact brief. Must render up to 5 sections in priority order: "Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories". Uses the budget allocator for per-source token allocation. File-level deduplication removes duplicate file paths across sections (higher-priority source keeps its mentions). Output includes allocation metadata (`totalTokenEstimate`, `sourceCount`, `mergedAt`, `mergeDurationMs`, `deduplicatedFiles`). Total must stay within 4000 tokens.
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md:19:- Prompt: `Run a search returning > 5 results and verify the response preserves full data.results while adding data.progressiveDisclosure with summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor. Then use memory_search({ cursor }) to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove the additive disclosure contract. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md:29:| 168 | Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) | Verify additive disclosure payload and cursor pagination | `Search with > 5 results, verify full results remain present plus data.progressiveDisclosure, then use cursor for next page. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "broad query", limit: 20 })` 2) Verify full `data.results` remains present 3) Verify `data.progressiveDisclosure` shape 4) Extract continuation cursor 5) Re-request with `memory_search({ cursor })` for next page 6) `npx vitest run tests/progressive-disclosure.vitest.ts tests/memory-search-ux-hooks.vitest.ts` | full `data.results`; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min | Response JSON + pagination test with cursor + test transcript | PASS if full results are preserved and disclosure metadata + cursor pagination work; FAIL if results are replaced by snippets or disclosure metadata is missing | Verify SPECKIT_PROGRESSIVE_DISCLOSURE_V1 env → Check DEFAULT_PAGE_SIZE (5) → Inspect SNIPPET_MAX_LENGTH (100) → Verify hashQuery() cursor key → Check DEFAULT_CURSOR_TTL_MS (300000) → Inspect cursorStore map |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md:29:| 166 | Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) | Verify why.summary + topSignals in results | `Test SPECKIT_RESULT_EXPLAIN_V1=true. Run a search, verify why.summary and topSignals on each result. Test debug mode for channelContribution. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_RESULT_EXPLAIN_V1=true` 2) `memory_search({ query: "test explainability" })` 3) Inspect each result for why.summary + why.topSignals 4) Re-run with debug.enabled=true 5) Verify channelContribution present in debug mode | why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF | Result JSON with why field + debug channelContribution | PASS if slim tier present and debug tier includes channelContribution; FAIL if summary missing, topSignals empty, or channelContribution leaks in non-debug | Verify isResultExplainEnabled() → Inspect extractSignals() for PipelineRow → Check resolveEffectiveScore() → Verify channelAttribution detection → Check SignalLabel types |
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-suspicious-prefix.json:5:    "phase 7 cocoindex",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-suspicious-prefix.json:22:    "phase 7 cocoindex",
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:39:| 261d | MCP auto-priming | Session-scoped priming isolation | `Validate 261d session-scoped priming isolation` | Call `memory_context({ input: "prime A", sessionId: "prime-session-a" })`; then in a fresh second MCP session call `memory_context({ input: "prime B", sessionId: "prime-session-b" })` | Each session receives its own first-call PrimePackage because priming is tracked per explicit session identity | Two MCP response envelopes showing independent primePackage delivery for session A and session B | PASS if the second session receives its own PrimePackage independently of the first session | Check `hooks/memory-surface.ts` session-scoped priming set and session identity propagation |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md:29:| 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | Verify shadow-only implicit feedback event ledger records 5 event types | `Test the default-on SPECKIT_IMPLICIT_FEEDBACK_LOG behavior. Trigger all 5 feedback event types and verify confidence tier assignment. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_IMPLICIT_FEEDBACK_LOG` is unset or `true` 2) `memory_search({ query: "test query" })` — triggers search_shown 3) Cite a result — triggers result_cited 4) Reformulate query — triggers query_reformulated 5) Re-search same topic — triggers same_topic_requery 6) Use follow-on tool — triggers follow_on_tool_use 7) Query feedback ledger for recorded events 8) Verify shadow-only (no ranking changes) | isImplicitFeedbackLogEnabled() returns true; 5 event types stored with type/memory_id/query_id/confidence/timestamp/session_id; resolveConfidence() maps: result_cited→strong, follow_on_tool_use→strong, query_reformulated→medium, search_shown→weak, same_topic_requery→weak; shadow-only | Feedback ledger query results + event type/confidence pairs + ranking comparison (before/after) + test transcript | PASS if all 5 event types recorded with correct confidence tiers and no ranking side effects; FAIL if event types missing, confidence tiers wrong, or events influence rankings | Verify isImplicitFeedbackLogEnabled() → Confirm flag is not forced off → Check feedback-ledger.ts schema creation → Inspect resolveConfidence() tier mapping → Verify shadow-only constraint (no ranking integration) |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/169-session-retrieval-state-v1-speckit-session-retrieval-state-v1.md:29:| 169 | Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) | Verify additive session metadata on session-aware searches | `Run 2 searches in the same session, verify data.sessionState and data.goalRefinement are returned, and check follow-up behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] })` 2) Inspect `data.sessionState` and `data.goalRefinement` 3) `memory_search({ query: "related second search", sessionId: "test-session" })` 4) Verify session metadata persists and follow-up behavior is visible 5) `npx vitest run tests/session-state.vitest.ts tests/memory-search-ux-hooks.vitest.ts` | `data.sessionState` with activeGoal/seenResultIds/preferredAnchors; `data.goalRefinement` with activeGoal/applied; follow-up search can deprioritize seen results; session TTL 30 min; LRU at 100 sessions | Response JSON before/after follow-up + test transcript | PASS if session metadata is present and follow-up behavior is visible; FAIL if metadata is missing or session context is ignored | Verify isSessionRetrievalStateEnabled() → Check SessionStateManager.getOrCreate() → Inspect SEEN_DEDUP_FACTOR (0.3) → Verify seenResultIds tracking → Check SESSION_TTL_MS (1800000) → Verify MAX_SESSIONS (100) LRU |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:16:- **Objective**: Verify that the context-metrics module correctly tracks session events (tool_call, memory_recovery, code_graph_query, spec_folder_change) and computes QualityScore with 4 weighted factors. The recency factor must decay over time (1.0 for recent, lower as time passes). The recovery factor must be 1.0 after a memory_recovery event. The graphFreshness factor must reflect actual code graph state (1.0 fresh, 0.5 stale, 0.0 empty). The continuity factor must decrease on spec folder transitions. The composite score must map to quality levels: healthy (>= 0.7), degraded (>= 0.4), critical (< 0.4).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:20:- **Prompt**: `Validate 266 Context metrics. Make several tool calls and check quality scoring: (1) call memory_stats to register a tool_call event, (2) call session_health and verify recency factor is close to 1.0, (3) call memory_context with mode=resume to register memory_recovery, (4) call session_health and verify recovery factor is 1.0, (5) verify composite score maps to correct quality level.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:38:| 266b | Context preservation metrics | Memory recovery tracked and factor updated | `Validate 266b recovery tracking` | Call `memory_context({ mode: "resume" })` then `session_health({})` | recovery factor === 1.0 | session_health response qualityScore.factors.recovery | PASS if recovery factor is 1.0 after resume call | Check memory_recovery event recording and factor computation |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/179-empty-result-recovery-speckit-empty-result-recovery-v1.md:29:| 179 | Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1) | Verify structured recovery payloads for empty/weak search results | `Test the default-on SPECKIT_EMPTY_RESULT_RECOVERY_V1 behavior. Trigger all 3 recovery statuses and verify structured payloads. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_EMPTY_RESULT_RECOVERY_V1` is unset or `true` 2) `memory_search({ query: "completely nonexistent topic xyzzy" })` — triggers no_results 3) Search for vague/low-signal query — triggers low_confidence 4) Search with narrow specFolder filter — triggers partial 5) Inspect recovery payload for each: status, reason, actions, alternative queries | Recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3 | Recovery payload JSON per status + root cause + action list + alternative queries + test transcript | PASS if all 3 statuses produce structured payloads with reason, actions, and alternatives; FAIL if status missing, payload fields incomplete, or thresholds incorrect | Verify recovery-payload.ts module loaded → Confirm flag is not forced off → Check DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4 → Verify PARTIAL_RESULT_MIN=3 → Inspect reason inference logic → Check alternative query generation |
.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/180-result-confidence-speckit-result-confidence-v1.md:29:| 180 | Result confidence (SPECKIT_RESULT_CONFIDENCE_V1) | Verify per-result calibrated confidence with 4-factor weighting | `Test the default-on SPECKIT_RESULT_CONFIDENCE_V1 behavior. Run a search and verify 4-factor weighted confidence scoring with high/medium/low labels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_RESULT_CONFIDENCE_V1` is unset or `true` 2) `memory_search({ query: "well-covered topic with multiple memories" })` 3) Inspect per-result confidence scores and labels 4) Verify 4-factor weights: margin=0.35, channel_agreement=0.30, reranker=0.20, anchor_density=0.15 5) Check confidence drivers reported per result 6) Verify labels: score >= 0.7 → high, < 0.4 → low, else → medium 7) Confirm requestQuality label (good/weak/gap) | Per-result confidence score computed; 4 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM | Per-result confidence output + factor breakdown + label assignments + driver lists + requestQuality + test transcript | PASS if 4-factor weighted confidence produces correct scores, labels match thresholds, and drivers reported; FAIL if weights wrong, thresholds incorrect, labels missing, or LLM used | Verify confidence-scoring.ts module loaded → Confirm flag is not forced off → Check factor weights (0.35/0.30/0.20/0.15) → Inspect HIGH_THRESHOLD=0.7 and LOW_THRESHOLD=0.4 → Verify driver detection logic → Check requestQuality computation |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:26:  - Stdout contains `## Recovery Instructions` mentioning "3-source merge (Memory + Code Graph + CocoIndex)"
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:29:  - When no cached payload exists, fallback output instructs calling `memory_context({ mode: "resume" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:42:| 249c | SessionStart priming (compact) | Fallback when no cached payload exists | `Validate 249c compact fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout contains "Context Recovery" section instructing `memory_context({ mode: "resume" })` | Test output showing fallback message | PASS if fallback message appears when pendingCompactPrime is null | Verify test fixture simulates missing cache state |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:16:- **Objective**: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`), CocoIndex Code availability status, Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`), and resume instructions. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:21:- **Prompt**: `Validate 250 SessionStart priming (startup) behavior. Run the vitest suite for hook-session-start and confirm: (1) source=startup routes to handleStartup(), (2) stdout contains "Session Priming" section, (3) memory tools listed (memory_context, memory_match_triggers, memory_search), (4) CocoIndex availability checked via checkCocoIndexAvailable(), (5) Code Graph tools listed, (6) resume instructions present, (7) output within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:25:  - Body mentions `memory_context`, `memory_match_triggers`, `memory_search`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:26:  - Body mentions `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:27:  - CocoIndex status line shows either "available" or "not installed" based on `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` existence
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:28:  - Resume instruction: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:31:  - PASS: All tool references present in stdout, CocoIndex status accurate, output within budget
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:32:  - FAIL: Missing tool references, incorrect CocoIndex status, or output exceeds 2000 tokens
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:40:| 250a | SessionStart priming (startup) | Fresh startup outputs Spec Kit Memory tool overview | `Validate 250a startup tool listing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout "Session Priming" section lists `memory_context`, `memory_match_triggers`, `memory_search`, code graph tools | Test output showing tool names in stdout | PASS if all 7+ tools listed in session priming output | Check `session-prime.ts` handleStartup() for expected tool names |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md:41:| 250b | SessionStart priming (startup) | CocoIndex availability check returns correct status | `Validate 250b CocoIndex status` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | CocoIndex line shows "available" when binary exists or "not installed" when missing | Test output showing CocoIndex status line | PASS if CocoIndex status matches filesystem reality | Verify `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` path |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:19:- Prompt: `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:20:- Expected signals: description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:29:| 042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Corrupt description.json with invalid JSON and schema-invalid field types → run generateFolderDescriptions() and verify spec.md fallback plus repaired description.json 6) Verify missing description.json falls back to spec.md without forcing a write 7) Attempt generation against an out-of-base or prefix-bypass path → verify rejection and no file written 8) Use spec.md with large YAML frontmatter and CRLF-heavy line endings → verify extracted description comes from post-frontmatter content 9) Run memory_context query → verify short-circuit folder routing | description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files | description.json content + stale detection output + folder routing trace in memory_context + recovery evidence for corrupt/schema-invalid description.json files + missing-file fallback evidence + rejection evidence for traversal attempts + proof of valid regenerated JSON with no leftover temp files | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails | Verify create.sh generates description.json → Check stale detection mtime comparison → Inspect generateFolderDescriptions preference logic and repair path → Confirm missing-file fallback does not backfill unexpectedly → Verify realpath containment rejects traversal/prefix-bypass paths → Confirm frontmatter stripping happens before description extraction → Verify memory_context folder routing |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:16:- **Objective**: Verify that session_resume performs its recovery sub-calls (memory_context resume, code graph status, CocoIndex availability), appends the shared structural ready/stale/missing contract, and merges everything into a single SessionResumeResult. Each sub-call failure must be captured as an error entry with recovery hints rather than failing the entire call. The response must include memory (resume context), codeGraph (status/ok/empty/error with counts), cocoIndex (available boolean with binary path), structuralContext (`status`, `summary`, `recommendedAction`, `sourceSurface`, plus freshness guidance), and hints array.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:21:- **Prompt**: `Validate 263 Session resume. Call session_resume and confirm: (1) memory field contains resume context from memory_context, (2) codeGraph field has status (ok/empty/error), nodeCount, edgeCount, fileCount, lastScan, (3) cocoIndex field has available boolean and binaryPath, (4) structuralContext reports ready/stale/missing correctly and includes summary, recommendedAction, and sourceSurface, and (5) hints array includes session_bootstrap guidance when structural context is degraded.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:28:  - hints array present (may be empty if all subsystems healthy; should point to `session_bootstrap` when structure is degraded)
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:41:| 263c | Session resume tool | CocoIndex availability check | `Validate 263c cocoindex status` | Call `session_resume({})` via MCP | cocoIndex.available is boolean, binaryPath is string | session_resume response JSON cocoIndex field | PASS if cocoIndex fields present with correct types | Check `cocoindex-path.ts` plus the availability probe used by session-resume.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/263-session-resume.md:42:| 263d | Session resume tool | Structural readiness and recovery hinting | `Validate 263d structural context` | Call `session_resume({})` via MCP in both healthy and degraded graph states | structuralContext.status in [ready, stale, missing]; structuralContext.summary/recommendedAction/sourceSurface present; degraded states mention session_bootstrap in hints | session_resume response JSON structuralContext + hints | PASS if structural contract fields are surfaced and degraded states recommend session_bootstrap; FAIL if required contract fields are missing or recovery hint is wrong | Check buildStructuralBootstrapContract() and degraded hint injection in session-resume.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/006-session-enrichment-and-alignment-guardrails.md:24:  - `memory_search({ query: "session enrichment alignment", specFolder: "specs/<target-spec>" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:2:title: "264 -- Query-intent routing in memory_context"
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:3:description: "This scenario validates Query-intent routing for 264. It focuses on verifying structural queries route to code graph and semantic queries route to CocoIndex."
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:6:# 264 -- Query-intent routing in memory_context
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:10:This scenario validates Query-intent routing in memory_context.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:16:- **Objective**: Verify that memory_context auto-routes queries based on the query-intent classifier. Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend. Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline. Hybrid queries must trigger both backends and merge results. The classifier confidence score and matched keywords must be available in the response metadata.
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:20:- **Prompt**: `Validate 264 Query-intent routing. Send three queries to memory_context: (1) a structural query like "what functions call handleMemoryContext", (2) a semantic query like "find examples of error handling patterns", (3) a hybrid query like "find all validation functions and explain their approach". Confirm: (1) structural query returns code graph results, (2) semantic query returns memory/CocoIndex results, (3) hybrid query returns merged results from both backends.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:35:| 264a | Query-intent routing | Structural query routes to code graph | `Validate 264a structural routing` | Call `memory_context({ input: "what functions call handleMemoryContext" })` | Response includes code graph data (symbols, edges), intent classified as 'structural' | memory_context response with code graph results | PASS if code graph results present and classifier shows structural intent | Check STRUCTURAL_KEYWORDS in query-intent-classifier.ts and memory_context integration |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:36:| 264b | Query-intent routing | Semantic query routes to memory pipeline | `Validate 264b semantic routing` | Call `memory_context({ input: "find examples of error handling patterns" })` | Response includes memory hits with similarity scores, intent classified as 'semantic' | memory_context response with memory results | PASS if memory/semantic results present and classifier shows semantic intent | Check SEMANTIC_KEYWORDS and memory_context fallback path |
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/264-query-intent-routing.md:37:| 264c | Query-intent routing | Hybrid query merges both backends | `Validate 264c hybrid routing` | Call `memory_context({ input: "find all validation functions and explain their approach" })` | Response includes both code graph and memory results, intent classified as 'hybrid' | memory_context response with merged results | PASS if both backends contribute results | Check hybrid scoring threshold and merge logic |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md:29:| 133 | Dry-run preflight for memory_save | Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects | `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a rich sandbox memory file and a thin sandbox memory file 2) `memory_stats()` and capture baseline totals 3) `memory_save({filePath:"<thin-sandbox-file>", dryRun:true})` and verify preflight details, `qualityLoop`, `sufficiency`, and `rejectionCode:"INSUFFICIENT_CONTEXT_ABORT"` 4) `memory_stats()` and `memory_search({query:"<thin title>"})` to verify no new indexed record from dry-run 5) `memory_save({filePath:"<thin-sandbox-file>", force:true})` and verify it still rejects before indexing 6) `memory_save({filePath:"<rich-sandbox-file>", dryRun:true})` and verify `would_pass:true` with no side effects 7) `memory_save({filePath:"<rich-sandbox-file>", dryRun:false})` and verify the memory becomes searchable | Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file | Dry-run responses for thin and rich files + before/after stats + search outputs + non-dry-run save output | PASS if dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable | Inspect `handlers/memory-save.ts` dryRun and insufficiency branches, `shared/parsing/memory-sufficiency.ts`, `handlers/quality-loop.ts`, and `lib/validation/preflight.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md:29:  - `memory_search({ query: "<key term from agent session>", specFolder: "specs/<target-spec>" })`
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/111-deferred-lexical-only-indexing.md:29:| 111 | Deferred lexical-only indexing | Confirm embedding-failure fallback and BM25 searchability | `Validate deferred lexical-only indexing fallback. Capture the evidence needed to prove Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex. Return a concise user-facing pass/fail verdict with the main reason.` | 1) simulate embedding failure (e.g., set invalid `OPENAI_API_KEY`) 2) `memory_save(filePath)` → verify memory saved with `embedding_status='pending'` 3) `memory_search({query:"<title of saved memory>"})` → verify BM25/FTS5 retrieval works (lexical match) 4) restore valid API key 5) run `node cli.js reindex` → verify `embedding_status` transitions to `'success'` and `retry_count` increments 6) `memory_search({query:"<semantic query>"})` → verify vector search now works | Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex | Save output showing pending status + lexical search result + reindex output + post-reindex semantic search result | PASS if embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding | Verify embedding_status column exists in schema; check BM25/FTS5 index includes pending memories; inspect reindex retry logic and retry_count tracking |
.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/002-chunk-collapse-deduplication-g3.md:29:| 002 | Chunk collapse deduplication (G3) | Confirm dedup in default mode | `Validate chunk collapse deduplication (G3) in default search mode. Capture the evidence needed to prove No duplicate memory IDs in results; collapsed chunks yield unique parents only. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save multi-chunk overlap 2) `memory_search(includeContent:false)` 3) Verify no duplicates | No duplicate memory IDs in results; collapsed chunks yield unique parents only | Search output with result IDs + dedup count before/after collapse | PASS: Zero duplicate parent IDs in collapsed results; FAIL: Same parent ID appears >1 time in output | Check chunk parentId linkage → Verify dedup runs after collapse stage → Inspect includeContent flag behavior |
.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/118-error-response-credential-sanitization.md:29:| 118 | Error response credential sanitization | Verify credentials stripped from error responses | `Trigger a provider error by using an invalid API key, then inspect the error response for leaked credentials. Verify that sk-*, voy_*, Bearer tokens, and key= patterns are replaced with [REDACTED] in summary, data.error, and data.details (including nested objects and arrays). Return a concise pass/fail verdict.` | 1) Set invalid VOYAGE_API_KEY or OPENAI_API_KEY 2) Call memory_search to trigger provider error 3) Inspect response.summary, response.data.error, response.data.details | All credential patterns replaced with [REDACTED]; error codes and provider names preserved; nested objects sanitized | Error response JSON showing [REDACTED] replacements + preserved error codes | PASS if no credential patterns survive in any field of the error response envelope | Check sanitizeErrorField regex patterns; verify sanitizeDetails recursion depth; check for new credential formats not yet covered |

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1320ms:

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
The Mex side is already showing a clear pattern: retrieval is deterministic navigation plus static extraction, not ranked search. I’m pulling the matching sections from our own handlers now so the comparison stays apples-to-apples: Mex routing/briefing versus our scored retrieval, semantic code search, and structural graph queries.
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"function handleMemoryMatchTriggers|const handleMemoryMatchTriggers|co-activation|decay|trigger\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
8:// Feature catalog: BM25 trigger phrase re-index gate
24:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
26:import * as attentionDecay from '../lib/cognitive/attention-decay.js';
29:import * as coActivation from '../lib/cognitive/co-activation.js';
81:  decayedCount: number;
97:  decayApplied: number;
111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
122:/** Per-turn decay rate for attention scoring. */
150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
158:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
171:    console.warn('[memory-triggers] getTieredContent failed', {
184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
185:async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
197:      tool: 'memory_match_triggers',
218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
220:        tool: 'memory_match_triggers',
243:  // Eval logger — capture trigger query at entry (fail-safe)
249:      intent: 'trigger_match',
254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
263:          scores: memoryIds.map(() => 1.0), // trigger matches are binary
264:          fusionMethod: 'trigger',
269:      /* eval logging must never break triggers handler */
278:  let decayStats: DecayStats | null = null;
281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
284:      console.warn('[memory_match_triggers] Decay failed:', message);
288:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
289:  let results: TriggerMatch[] = triggerMatchResult.matches;
291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
329:  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
330:    ? triggerMatchResult.stats.signals
332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
336:      tool: 'memory_match_triggers',
337:      summary: 'No matching trigger phrases found',
339:        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
345:          decayApplied: decayStats ? decayStats.decayedCount : 0
349:        'Ensure memories have trigger phrases defined',
351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
417:          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
426:        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
432:      // Clamp to [0,1] — retrievability * decay or wmEntry scores
450:        triggerPhrases: r.matchedPhrases
471:      decayApplied: decayStats ? decayStats.decayedCount : 0,
491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
510:  const _triggersResponse = createMCPSuccessResponse({
511:    tool: 'memory_match_triggers',
514:      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
524:      triggerSignals: detectedSignals,
529:  // Consumption instrumentation — log triggers event (fail-safe, never throws)
536:        event_type: 'triggers',
544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
546:  // Eval logger — capture final trigger results at exit (fail-safe)
547:  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
548:  logFinalTriggerEval(triggerMemoryIds, latencyMs);
550:  return _triggersResponse;
562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
565:  handle_memory_match_triggers,

exec
/bin/zsh -lc "rg -n \"function handleMemorySearch|const handleMemorySearch|classifyQueryIntent|retrievalLevel|graphEvidence|weighted|RRF|hybrid|channel\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:34:// Eval channel tracking (extracted from this file)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:39:} from '../lib/telemetry/eval-channel-tracking.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:40:import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:173:// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:218:// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:429:// summarizeGraphWalkDiagnostics, buildEvalChannelPayloads — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1242:          channel: payload.channel,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:120:/** Layer 2 dimension weights for weighted average signal density */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:596: * Signal density is the weighted average of all dimension scores.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:616:  // Compute weighted average signal density
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:617:  let weightedSum = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:621:    weightedSum += score * weight;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:625:  const signalDensity = totalWeight > 0 ? weightedSum / totalWeight : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:532:// Correction signals (0.2) weighted higher than preferences (0.1) and reinforcement (0.15) — corrections indicate stronger search intent
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:138:| `fusionLatencyMs` | `number` | RRF fusion duration |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:148:| `selectedMode` | `string \| null` | Mode chosen for this run (e.g., `hybrid`, `auto`, `deep`) |
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:226:    searchType: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:200:    '  Priority  : HIGH — must be scheduled before Sprint 3 graph-channel work.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:211:    '  neutralising its contribution to hybrid search until R10 is complete.',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:5:// Utilities for collecting eval channel attribution, resolving
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:6:// scores, building per-channel payloads, and summarizing graph
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:14:  channel: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:57: * Collect all eval channel attributions from a result row.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:58: * Checks `sources` (array), `source` (string), and `channelAttribution` (array).
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:59: * Falls back to `['hybrid']` if no channels are found.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:62:  const channels = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:67:        channels.add(source.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:73:    channels.add(row.source.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:76:  if (Array.isArray(row.channelAttribution)) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:77:    for (const source of row.channelAttribution) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:79:        channels.add(source.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:84:  if (channels.size === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:85:    channels.add('hybrid');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:88:  return Array.from(channels);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:92: * Build per-channel eval payloads from an array of result rows.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:93: * Groups results by channel, deduplicates by memory ID (keeping highest score).
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:109:    const channels = collectEvalChannelsFromRow(row);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:111:    for (const channel of channels) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:112:      const bucket = byChannel.get(channel) ?? new Map<number, number>();
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:117:      byChannel.set(channel, bucket);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:121:  return Array.from(byChannel.entries()).map(([channel, idToScore]): EvalChannelPayload => {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:124:      channel,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:36:import { enforceChannelRepresentation } from './channel-enforcement.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:65:import type { EnforcementResult } from './channel-enforcement.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:97:   * enable all retrieval channels for this search call.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:102:   * When true, stop after channel collection and return pre-fusion candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:138:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:162:    channels: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:280: * Return current graph channel metrics for health check reporting.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:292:/** Reset all graph channel metrics counters to zero. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:445: * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:497:  // CanonicalResultId() prevents duplicate rows when one channel emits
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:570:    const channelCount = sources.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:574:      channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:576:      channelAttribution: sources,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:592:  const channelCount = sources.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:593:  const crossChannelBonus = Math.min(0.06, 0.02 * Math.max(0, channelCount - 1));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:602:    channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:607:    channelAttribution: sources,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:642:        channelAttribution: [list.source],
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:974: * All search channels use synchronous better-sqlite3; sequential execution
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1007:    // When enabled, classifies query complexity and restricts channels to a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1008:    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1013:      : new Set<ChannelName>(routeResult.channels);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1015:    // Respect explicit caller channel disables across both the primary route and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1018:    for (const channel of allPossibleChannels) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1019:      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1027:        channels: routeResult.channels,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1058:    // All channels use synchronous better-sqlite3; sequential execution
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1061:    // Vector channel — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1094:    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1114:    // Graph channel — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1118:        graphMetrics.totalQueries++; // counted only if channel executes
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1132:        // Non-critical — graph channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1137:    // Degree channel re-ranks based on causal-edge connectivity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1139:    // Degree channel — also gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1142:        // Collect all numeric IDs from existing channels
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1176:        // Non-critical — degree channel failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1181:    // Merge keyword results after all channels complete
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221:    // C138/T315: Build weighted fusion lists once from lightweight adaptive
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1342:  // Ensures every channel that returned results has at least one representative
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1343:  // In the top-k window. Prevents single-channel dominance in fusion output.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1346:    const channelResultSets = new Map<string, Array<{ id: number | string; score: number; [key: string]: unknown }>>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1348:      channelResultSets.set(list.source, list.results.map(r => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1361:      channelResultSets,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2144:  // TIER 2: Widen search — lower similarity, force all channels
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:8:// Spec: system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:6:// feedback-ledger.ts), computes confidence-weighted signal scores
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:46:/** Per-confidence-tier weights used in the weighted score formula. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:68:  /** Confidence-weighted composite score. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:69:  weightedScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:83:  weighted_score: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:142:    weighted_score  REAL NOT NULL DEFAULT 0.0,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:179: * a confidence-weighted score.  Does NOT apply min-support filtering
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:221:      const weightedScore =
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:229:      const normalizedScore = totalEvents > 0 ? weightedScore / totalEvents : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:238:        weightedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:243:    // Sort descending by weightedScore for deterministic output
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:244:    signals.sort((a, b) => b.weightedScore - a.weightedScore);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:366:        (memory_id, batch_run_at, session_count, weighted_score, computed_boost, shadow_rank_delta, promoted)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:372:      signal.weightedScore,
.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md:34:The former graph-authority helper was removed because the active retrieval pipeline uses typed-weighted degree scoring and graph signal helpers instead.
.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md:87:- `../search/graph-search-fn.ts` — typed-weighted degree scoring used by the live retrieval path.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:35:      "query": "what decisions led to using RRF instead of a weighted linear combination for search fusion",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:40:      "expectedResultDescription": "Decision records from hybrid-rag-fusion spec (spec 139) about fusion strategy selection. Should surface rationale for RRF over linear weighted sum.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:55:      "query": "what was recently discussed about the graph channel hit rate being zero",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:60:      "expectedResultDescription": "Should surface sprint-0 baseline measurement (T000a) which records graphHitRate=0, and any related spec memories about graph channel initialization or telemetry gaps.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:115:      "query": "which spec documents were added during the hybrid RAG fusion sprint",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:120:      "expectedResultDescription": "Should surface memories in spec folder system-spec-kit/022-hybrid-rag-fusion (89 memories) and 140-hybrid-rag-fusion-refinement. Lists spec documents created in those sprints.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:280:      "expectedResultDescription": "Deep investigation query. Should surface adaptive-fusion.ts, hybrid-search.ts, rrf-fusion.ts, and related spec memories spanning the search stack.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:295:      "query": "list all memories in the hybrid RAG fusion spec folder",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:300:      "expectedResultDescription": "Spec-scoped browse. Should surface memory titles and tiers from spec folder system-spec-kit/022-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:385:      "query": "how should I refactor the eval-logger to support per-channel metrics",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:390:      "expectedResultDescription": "Should surface eval-logger.ts, eval-db.ts schema (eval_channel_results table), and any spec decisions about the eval framework design.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:455:      "query": "how does RRF fusion combine vector and BM25 channel scores",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:460:      "expectedResultDescription": "Should surface rrf-fusion.ts, adaptive-fusion.ts channel weights, and the T000a baseline note about graphHitRate=0.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:461:      "notes": "Cross-document query spanning fusion implementation and channel weight configuration."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:605:      "query": "RRF reciprocal rank fusion channel weights",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:610:      "expectedResultDescription": "Should surface rrf-fusion.ts, adaptive-fusion.ts, and spec memories about channel weight configuration.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:611:      "notes": "Derived from \"reciprocal rank fusion\" trigger phrase in the hybrid search documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:821:      "notes": "Manual bug report for the graph channel — relates to known T000a baseline finding."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:855:      "query": "I want to add telemetry tracking to the hybrid search pipeline",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:905:      "query": "show me the checklist for the sprint 0 hybrid RAG fusion refinement",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:915:      "query": "is there a research document for the hybrid RAG fusion approach",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:920:      "expectedResultDescription": "Should surface research/research.md from the 139-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement spec folder if it exists.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960:      "expectedResultDescription": "Should surface trigger-matcher.ts, vector-index.ts, hybrid-search.ts, and any architectural decision about keeping the two paths separate.",
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:4:// Phase B T018: Community-level search as fallback channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:94: * score. Used as a fallback channel when primary search returns weak results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:7:// For results related to top seed results via weighted CTE.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:427:  // C138-P2: Relation-weighted CTE — accumulates score with multiplier
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:482:      // C138-P2: Combine hop-distance decay with relation-weighted walk score
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:158:  - `ablation-framework.ts` — controlled channel-ablation experimentation.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:206:- Purpose: Owns graph-derived retrieval signals and community detection over memory relationships. It is the canonical place for graph algorithms that operate over causal/community structure rather than primary retrieval channels.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:313:- Purpose: Owns the retrieval engine: candidate generation, vector/lexical channels, fusion, reranking, query intelligence, graph-aware retrieval, and schema/index helpers needed by the search path. This is the highest-churn and broadest domain module in `lib/`.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:315:  - `hybrid-search.ts` — main hybrid retrieval entry point across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:22:// Query weight: 0.7x (learned triggers weighted lower than organic triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:446: * the query terms. Returns matching memories with a weighted score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:450: * @returns Array of matching memories with 0.7x weighted scores
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:7:// Search path (disabling vector, graph, and trigger channels)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:85:  hybridMRR?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:86:  /** BM25/hybrid ratio (relative mode only). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:92: * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:100:  /** Source channel identifier. Expected: 'bm25' or 'fts'. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:118: * using ONLY the BM25/FTS5 channel (vector, graph, trigger disabled).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:119: * For production use, wire up the FTS5 path from hybrid-search with all
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:120: * other channels explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:137: *     justify the added complexity. Evaluate whether the multi-channel
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:141: *     BM25 is moderate — semantic/graph channels must demonstrably
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:142: *     improve over this baseline. Each additional channel needs
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:146: *     BM25 alone is weak — strong justification for multi-channel
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:147: *     retrieval. Proceed with hybrid search implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:161:        'Re-evaluate whether a multi-channel architecture is warranted before proceeding with ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:162:        'additional retrieval channels. Consider whether the marginal gain from vector/graph ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:174:        'BM25 is moderate — semantic/graph channels should demonstrably improve over this baseline. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:175:        'Each additional channel (vector, graph, trigger) must show a statistically meaningful ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:176:        'positive delta in MRR@5 before adoption. Track per-channel contribution carefully.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:186:      'BM25 alone is weak — strong justification for multi-channel retrieval. ' +
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
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:248:        'The multi-channel architecture adds marginal value over keyword search alone. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:256:      hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:262:        `BM25 achieves ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:263:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:264:        'Each additional channel must show a statistically meaningful positive delta ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:265:        'in MRR@5. Track per-channel contribution and justify retained complexity.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:271:    hybridMRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:277:      `BM25 achieves only ${(ratio * 100).toFixed(1)}% of hybrid MRR@5 ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:278:      `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:279:      'Multi-channel retrieval provides substantial improvement over keyword search. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:280:      'Proceed with hybrid search optimization.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:419: * Channel is recorded as 'bm25' to distinguish from multi-channel runs.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:434:      (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:438:  const channel = 'bm25';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:444:    insertSnapshot.run(evalRunId, 'mrr@5',       result.metrics.mrr5,      channel, queryCount, null, createdAt);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:445:    insertSnapshot.run(evalRunId, 'ndcg@10',      result.metrics.ndcg10,    channel, queryCount, null, createdAt);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:446:    insertSnapshot.run(evalRunId, 'recall@20',    result.metrics.recall20,  channel, queryCount, null, createdAt);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:447:    insertSnapshot.run(evalRunId, 'hit_rate@1',   result.metrics.hitRate1,  channel, queryCount, null, createdAt);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:455:      channel,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:474: * the BM25/FTS5 path ONLY — vector, graph, and trigger channels must be
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:529:    // Run BM25-only search (channels: bm25/fts only, no vector/graph/trigger)
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:243: * Community summary generation and search channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:251: * R8: Memory summary generation (TF-IDF extractive summaries as search channel).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:344: * activating the graph channel for matched concepts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:513: * REQ-D1-001: Calibrated overlap bonus for multi-channel convergence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:521: * REQ-D1-003: Experimental per-intent RRF K selection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:522: * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:525:  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:617: * When enabled, search results include graphEvidence with contributing edges,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:634: * Phase D T036: Usage-weighted ranking signal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:650: * Phase B T018: Community-level search as fallback channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:661: * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:6:// Pipeline position: after RRF fusion, before state filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:38:  /** Retrieval score for this chunk (e.g., RRF score, similarity). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:10:// additional retrieval channel.  This helps bridge the vocabulary
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:355: * This is the search channel activated when HyDE fires.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:528: * observability telemetry to an already-computed weighted composite score.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:533: * @param composite  Raw weighted-sum composite score (pre-multiplier)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:589: * Returns a single 0-1 score combining five weighted factors:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:600:  // Merging partial overrides. Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:633: * Returns a single 0-1 score combining six weighted factors:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:648:  // Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:5:// Aggregates metrics per sprint/eval-run, per-channel views,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:9:// Eval_channel_results table.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:35:  /** Filter to specific channels (e.g. 'vector', 'bm25', 'fts', 'graph', 'trigger'). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:36:  channelFilter?: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:52:/** Per-channel performance within a sprint. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:69:  /** Per-metric, per-channel summary statistics derived from channel-tagged snapshots. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:70:  channelMetrics: Record<string, Record<string, MetricSummary>>;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:71:  /** Per-channel performance data. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:72:  channels: Record<string, ChannelPerformance>;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:136:  channel: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:142:/** Aggregated per-run/per-channel row shape from eval_channel_results. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:145:  channel: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:191:  let sql = `SELECT id, eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:202:  if (config.channelFilter && config.channelFilter.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:203:    const placeholders = config.channelFilter.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:204:    sql += ` AND (channel IN (${placeholders}) OR channel IS NULL)`;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:205:    params.push(...config.channelFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:227: * Query grouped channel results for specific eval_run_ids.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:228: * Aggregating in SQL keeps channel coverage complete for the included runs
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:234:  channelFilter?: string[],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:241:               channel,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:245:             FROM eval_channel_results
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:249:  if (channelFilter && channelFilter.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:250:    const chPlaceholders = channelFilter.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:251:    sql += ` AND channel IN (${chPlaceholders})`;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:252:    params.push(...channelFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:255:  sql += ` GROUP BY eval_run_id, channel`;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:322: * Build a SprintReport from grouped snapshots and channel results.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:327:  channelRows: ChannelResultRow[],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:335:  const channelMetricGroups = new Map<string, Map<string, number[]>>();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:336:  const channelMetricLatest = new Map<string, Map<string, { value: number; time: string }>>();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:353:    if (snap.channel) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:354:      if (!channelMetricGroups.has(snap.metric_name)) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:355:        channelMetricGroups.set(snap.metric_name, new Map());
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:357:      if (!channelMetricLatest.has(snap.metric_name)) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:358:        channelMetricLatest.set(snap.metric_name, new Map());
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:361:      const perMetricGroups = channelMetricGroups.get(snap.metric_name)!;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:362:      const perMetricLatest = channelMetricLatest.get(snap.metric_name)!;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:363:      if (!perMetricGroups.has(snap.channel)) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:364:        perMetricGroups.set(snap.channel, []);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:366:      perMetricGroups.get(snap.channel)!.push(snap.metric_value);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:368:      const existingChannelMetric = perMetricLatest.get(snap.channel);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:370:        perMetricLatest.set(snap.channel, {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:385:  const channelMetrics: Record<string, Record<string, MetricSummary>> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:386:  for (const [metricName, perChannelGroups] of channelMetricGroups) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:387:    const perChannelLatest = channelMetricLatest.get(metricName) ?? new Map();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:388:    channelMetrics[metricName] = {};
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:389:    for (const [channelName, values] of perChannelGroups) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:390:      channelMetrics[metricName][channelName] = computeMetricSummary(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:392:        perChannelLatest.get(channelName)?.value ?? 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:397:  // Build channel performance
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:398:  const channels: Record<string, ChannelPerformance> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:399:  const runChannelRows = channelRows.filter(r => evalRunIds.includes(r.eval_run_id));
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:401:  const channelGroups = new Map<string, ChannelResultRow[]>();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:403:    if (!channelGroups.has(row.channel)) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:404:      channelGroups.set(row.channel, []);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:406:    // ChannelGroups.set(...) above ensures this channel bucket exists before push
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:407:    channelGroups.get(row.channel)!.push(row);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:410:  for (const [ch, rows] of channelGroups) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:417:          weightedLatency: acc.weightedLatency + (row.latency_ms * row.query_count),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:421:      { weightedLatency: 0, latencySamples: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:424:      ? Math.round((latencyTotals.weightedLatency / latencyTotals.latencySamples) * 100) / 100
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:427:    channels[ch] = {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:442:    channelMetrics,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:443:    channels,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:524:    const channelMetricCount = Object.values(latest.channelMetrics)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:526:    if (channelMetricCount > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:527:      lines.push(`Per-channel metric breakdowns: ${channelMetricCount}.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:529:    const channelNames = Object.keys(latest.channels);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:530:    if (channelNames.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:531:      lines.push(`Active channels: ${channelNames.join(', ')}.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:569: * Queries the eval database for metric snapshots and channel results,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:619:  // Query channel results only for included runs so row limits cannot starve kept groups.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:620:  const channelRows = queryChannelResults(db, includedRunIds, config.channelFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:623:    buildSprintReport(label, groupSnapshots, channelRows)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:684:    const channelMetricNames = Object.keys(sprint.channelMetrics).sort();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:685:    if (channelMetricNames.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:687:      for (const metricName of channelMetricNames) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:688:        const channelsForMetric = sprint.channelMetrics[metricName];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:689:        const metricChannelNames = Object.keys(channelsForMetric).sort();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:690:        for (const channelName of metricChannelNames) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:691:          const summary = channelsForMetric[channelName];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:693:            `    ${`${metricName} [${channelName}]`.padEnd(35)} latest=${summary.latest.toFixed(4)}  mean=${summary.mean.toFixed(4)}  range=[${summary.min.toFixed(4)}, ${summary.max.toFixed(4)}]  n=${summary.count}`
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:700:    const channelNames = Object.keys(sprint.channels).sort();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:701:    if (channelNames.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:703:      for (const ch of channelNames) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:704:        const c = sprint.channels[ch];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:4:// Feature catalog: RRF K-value sensitivity analysis
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:5:// Measures the impact of different RRF K-values on ranking stability.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:21:  /** Average RRF score across all fused results for this K-value. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:141: * 5. Computes average RRF score
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:303:    sensitivityCurve = 'Flat — average RRF score is stable across all tested K values. Ranking is insensitive to K.';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:351:  /** Pre-computed ranked lists for fusion (one per retrieval channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:352:  channels: RankedList[];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:385:  /** Whether SPECKIT_RRF_K_EXPERIMENTAL was enabled */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:598: * Default: ON (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:609: * @param queries - Judged queries with channels, labels, and relevantIds
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:610: * @param k - RRF smoothing constant to use for fusion
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:622:    const fused = fuseResultsMulti(q.channels, { k });
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:664: * Feature flag: SPECKIT_RRF_K_EXPERIMENTAL (default ON, graduated).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:713:  // Global best-K: argmax of weighted-average NDCG@10 across all intents
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147: * Execute a weighted BM25 FTS5 search against memory_fts.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:47:    channelContribution?: Record<string, number>;
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:151:| `fusion` | RRF score fusion |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:40:  /** Human-readable name for this shadow algorithm (e.g. "rrf-v2", "weighted-bm25"). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:52:  -- Per-channel results for each query evaluation
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:53:  CREATE TABLE IF NOT EXISTS eval_channel_results (
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:57:    channel TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:65:  -- Final fused results after RRF/fusion
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:95:    channel TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:104:  CREATE INDEX IF NOT EXISTS idx_channel_results_run
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:105:    ON eval_channel_results (eval_run_id, channel, query_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:5:// Causal graph search channel — uses FTS5 for node matching
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35:/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:54:/** Runtime fusion weight for the degree channel. Keep aligned with the boost cap. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:367: * Compute the raw typed-weighted degree for a single memory node.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:404: * @param rawDegree - The raw typed-weighted degree
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:691:  // Typed-degree computation (R4 5th RRF channel)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:4:// Feature catalog: Typed-weighted degree channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:15: * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:48:| **HVR Integration** | Human Validation Rate integration for confidence-weighted scoring (Spec 137) |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:125:HVR integration extends the confidence tracking system by incorporating human validation signals into composite scoring. The HVR score reflects how often users confirm a memory as useful versus not useful, creating a feedback-weighted confidence metric.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:183:| `mpab-aggregation.ts` | Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation; computes aggregated scores after RRF fusion, collapses and reassembles chunk results |
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:5:// Pipeline-ready wrapper around the channel min-representation check.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:10:// Delegates core logic to channel-representation.ts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:14:} from './channel-representation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:29:/** A raw result from a single retrieval channel. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:46:  /** Number of results promoted from under-represented channels. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:50:  /** Per-channel item count in the final result set. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:51:  channelCounts: Record<string, number>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:65: * Apply channel min-representation enforcement to a set of fused search results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:72: *    from any channel that returned results but is absent from that window.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:73: *  - Promoted items are appended, their raw per-channel scores are normalized
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:77: *    promotion; channels whose best result is below the floor are noted
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:81: * @param channelResultSets - Map of channel name → raw results from that channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:89:  channelResultSets: Map<string, Array<ChannelResult>>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:103:        channelCounts: computeChannelCounts(fusedResults),
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:112:  // ---- Delegate to core channel-representation logic ----
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:113:  const analysis = analyzeChannelRepresentation(window, channelResultSets);
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:117:    channelResultSets,
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:132:      channelCounts: computeChannelCounts(finalResults),
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:142: * Count how many items in a result array belong to each channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:143: * Uses the `source` field as the channel identifier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:155:  channelResultSets: Map<string, Array<ChannelResult>>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:168:    const channelScoreRange = computeScoreRange(channelResultSets.get(item.promotedFrom) ?? []);
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:169:    const normalizedWithinChannel = normalizeScoreWithinRange(item.promotedRawScore, channelScoreRange);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:52:        const channelMax = db.prepare('SELECT MAX(eval_run_id) as maxId FROM eval_channel_results').get() as { maxId: number | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:54:        const maxId = Math.max(channelMax?.maxId ?? 0, finalMax?.maxId ?? 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:86:  /** Eval run ID to pass to channel / final result loggers. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:94:  channel: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:95:  /** Memory IDs returned by this channel. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:99:  /** Wall-clock latency for this channel in milliseconds. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:138: * must be forwarded to channel / final result loggers.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:177: * Log the result set from a single retrieval channel.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:188:      INSERT INTO eval_channel_results
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:189:        (eval_run_id, query_id, channel, result_memory_ids, scores, latency_ms, hit_count)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:194:      params.channel ?? 'unknown',
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-ranking-signal.ts:4:// Feature catalog: Usage-weighted ranking boost
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:41:| `ablation-framework.ts` | Controlled channel ablation runs, formatting, and storage helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:45:| `eval-logger.ts` | Fail-safe query, channel, and final-result logging hooks |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:51:| `k-value-analysis.ts` | RRF K-value sweep helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:53:| `reporting-dashboard.ts` | Sprint/channel aggregation and formatted dashboard output |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:63:- `reporting-dashboard.ts` is the current reporting surface for sprint/channel aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:17:   * scores; use min-max normalization or RRF when combining with other methods.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:46: * C138: Field weight multipliers for weighted BM25 scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:403: * Recall@K but each relevant item is weighted by its tier:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:559:  // P1-7 fix: Multiplier values ARE the weighted grades (not factors to multiply
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:563:  const weightedGT: GroundTruthEntry[] = groundTruth.map(e => ({
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:568:  return computeNDCG(results, weightedGT, k);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:582: * @param params.intentType          Intent type for intent-weighted NDCG.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:15:| `working-set-tracker.ts` | Recency-weighted file/symbol access tracking |
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:32: * Summarises Z-score statistics for the RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:39:  /** Arithmetic mean of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:41:  /** Population standard deviation of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:144: * Detect evidence gaps in an RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:4:// Feature catalog: Typed-weighted degree channel
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:305:    const weightedReach = directHits + (secondHopHits.size * GRAPH_WALK_SECOND_HOP_WEIGHT);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:306:    const normalizedReach = clamp(weightedReach / candidateSpan, 0, 1);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:307:    scores.set(memoryId, { raw: weightedReach, normalized: normalizedReach });
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:10://   - debug (opt-in): adds channelContribution map
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:19://     "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:23:// The channelContribution map is only included when debug.enabled=true.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:43:/** Per-channel score contribution breakdown (debug tier). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:56:/** Full explainability payload — includes channelContribution when debug ON. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:58:  channelContribution?: ChannelContribution;
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:69:  /** Whether to include channelContribution (debug tier). Default: false. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:98:  // Lexical match: only present if the row came through FTS channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:99:  // We detect this via channelAttribution on the row (Stage 4 annotation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:100:  const channelAttribution = Array.isArray(row.channelAttribution)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:101:    ? row.channelAttribution as string[]
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:230: * Extract channel contribution scores from a PipelineRow.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:231: * Uses channelAttribution array and graphContribution.totalDelta to
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:232: * distribute the effective score across vector, fts, and graph channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:239:  // Prefer explicit channel scores when available
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:265:  const channelAttribution = Array.isArray(row.channelAttribution)
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:266:    ? row.channelAttribution as string[]
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:308: * When debugEnabled=true, channelContribution is also included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:327:    why.channelContribution = extractChannelContribution(row);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:50:  /** Get top N files by recency-weighted score */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:135:  /** Get top N symbols by recency-weighted score */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:4:// Feature catalog: Access count tracking for usage-weighted ranking
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:6:// Controlled ablation studies for search channel contribution analysis.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:7:// Selectively disables one search channel at a time, measures Recall@20
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:8:// Delta against a full-pipeline baseline, and attributes per-channel
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:51:/** Known search channels that can be ablated. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:54:/** All channels available for ablation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:66:  channels: AblationChannel[];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:103: * The runner passes channel disable flags; the function must respect them.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:106: * @param disabledChannels - Set of channel names to disable for this run.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:114:/** Result of ablating a single channel. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:116:  /** The channel that was disabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:117:  channel: AblationChannel;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:118:  /** Recall@K with all channels enabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:120:  /** Recall@K with this channel disabled. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:122:  /** ablatedRecall20 - baselineRecall20. Negative means channel contributes positively. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:126:  /** Number of queries where removing this channel decreased recall (channel was helpful). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:128:  /** Number of queries where removing this channel increased recall (channel was harmful). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:130:  /** Number of queries unaffected by removing this channel. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:145:/** All 9 metrics tracked per ablation channel. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:158:/** Failure captured for a single channel ablation run. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:161:  channel: AblationChannel;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:178:  /** Per-channel ablation results. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:181:  channelFailures?: AblationChannelFailure[];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:182:  /** Baseline Recall@K across all queries (all channels enabled). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:406: * @param nPositive - Number of queries where ablated < baseline (channel helped).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:407: * @param nNegative - Number of queries where ablated > baseline (channel hurt).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:540: * For each channel in config.channels:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:541: * 1. Run all queries with all channels enabled (baseline) — cached across channels
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:542: * 2. Run all queries with that one channel disabled (ablated)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:547: * the query text and a set of disabled channel names. When the set
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:548: * is empty, all channels should be active (baseline condition).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:550: * @param searchFn - Search function that respects channel disable flags.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:552: * @returns AblationReport with per-channel results, or null if ablation is disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:556:  config: AblationConfig = { channels: ALL_CHANNELS },
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:588:    // -- Step 1: Compute baseline (all channels enabled) --
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:610:    // -- Step 2: Ablate each channel --
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:612:    const channelFailures: AblationChannelFailure[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:614:    for (const channel of config.channels) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:615:      const disabledSet = new Set<AblationChannel>([channel]);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:636:        let queriesChannelHelped = 0;   // ablated < baseline (removing channel decreased quality — channel was helpful)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:637:        let queriesChannelHurt = 0;    // ablated > baseline (removing channel increased quality — channel was harmful)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:657:        // QueriesChannelHelped = channel was helping (removing it hurt quality)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:658:        // QueriesChannelHurt = channel was harmful (removing it helped quality)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:665:          channel,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:679:          channel,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:688:        channelFailures.push(failure);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:692:          `[ablation] Channel "${channel}" failed${querySuffix}; continuing with remaining channels:`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:703:      ...(channelFailures.length > 0 ? { channelFailures } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:726: * Inserts one row per channel with:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:728: * - metric_value: the delta (negative = channel contributes positively)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:729: * - channel: the ablated channel name
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:751:        (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:778:            channelFailures: report.channelFailures ?? [],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:783:      // Store per-channel deltas
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:789:          result.channel,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:803:        // Store all 9 multi-metric entries per channel
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:821:              result.channel,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:850: * Sorts channels by absolute delta (largest contribution first).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:894:      `| ${r.channel} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:907:  lines.push(`**Legend:** Delta = ablated - baseline. Negative delta = channel contributes positively.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:908:  lines.push(`Ch. Helped = queries where channel was helpful (removing it decreased recall). * = significant at p<0.05.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:911:  if (report.channelFailures && report.channelFailures.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:914:    for (const failure of report.channelFailures) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:916:      lines.push(`- \`${failure.channel}\`${queryInfo}: ${failure.error}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:933:        `| ${r.channel} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:945:    lines.push(`**Note:** Delta values shown (ablated - baseline). Negative = channel contributes positively to that metric.`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:957:    lines.push(`${i + 1}. **${r.channel}** — contribution: ${contribution >= 0 ? '+' : ''}${contribution.toFixed(4)} Recall@${recallK}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:966: * Generate a human-readable verdict for a channel ablation result.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:977:    // Removing the channel hurt quality — channel is valuable
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:982:    // Removing the channel helped quality — channel may be harmful
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:994: * Maps ablation channel names to the corresponding useXxx: false flags
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:995: * expected by the hybridSearch / hybridSearchEnhanced functions.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:997: * @param disabledChannels - Set of channels to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:397: * Phase C T026: Populate graphEvidence provenance on each result that received
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:496:  // Attach graphEvidence to each boosted result
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:520:      graphEvidence: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:593: * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:600: * weighted combination so all three dimensions operate on the same scale.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1173:  // -- 2d. Usage-weighted ranking (Phase D T034) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1185:  // Populate graphEvidence on results that received graph-based boosts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1215:      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1216:      results = weighted.map((result) =>
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1344:        '[stage2-fusion] Graph channel active (bounded_runtime) but zero contribution — causal_edges table may be sparse or candidates lack graph connectivity'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:6:// (CocoIndex) vs hybrid (both).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:11:export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:118:export function classifyQueryIntent(query: string): ClassificationResult {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:136:  // No signals at all → hybrid (run both)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:174:    intent: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:6:// Responsibility: Execute search channels and collect raw candidate results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:8:// Contiguity to raw vector-channel hits before later pipeline stages.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:9:// Results are collected from the appropriate search channel based on search type.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11:// Search channels handled:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:19:// Post-channel operations:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:269:    const channelAttribution = mergeStringLists(incoming.channelAttribution, sources);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:273:      channelAttribution: channelAttribution.length > 0 ? channelAttribution : incoming.channelAttribution,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:279:      channelCount: sources.length > 0 ? sources.length : incoming.channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:290:    existing.channelAttribution,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:291:    incoming.channelAttribution,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:310:    channelAttribution: mergedChannelAttribution.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:312:      : primary.channelAttribution,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:320:    channelCount: mergedSources.length > 0 ? mergedSources.length : primary.channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:356: * expansion and the additional search channels add latency without recall gain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:458: * Selects and runs the appropriate search channel(s) based on `config.searchType`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:459: * and `config.mode`, then applies vector-channel temporal contiguity when
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:463: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:467: * @returns Stage 1 output with raw candidate rows and channel metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:497:  let channelCount = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:503:  // matched, log them to the trace for downstream use (graph channel activation
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:504:  // is surfaced via trace metadata; actual graph channel is handled in Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:539:                  channel: 'd2-concept-expansion',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:555:            channel: 'd2-concept-routing',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:593:    channelCount = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:682:            channelCount = allQueries.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:690:              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:691:                channel: 'd2-query-decomposition',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:699:            // (jump to post-channel processing via the else-if chain)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:746:          channelCount = queryVariants.length;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:762:          channelCount = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:771:        channelCount = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:786:      // Hybrid search channel whose results are merged with the baseline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:807:          // Only run an extra channel if the expansion actually produced new terms
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:843:            channelCount = 2;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854:              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:855:                channel: 'r12-embedding-expansion',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:874:          channelCount = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:889:          channelCount = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:911:              channel: 'vector',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:929:    channelCount = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1145:            channelCount += allQueries.length - 1; // discount original (already counted)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1149:                channel: 'd2-llm-reformulation',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1199:        channelCount++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1203:            channel: 'd2-hyde',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1275:              channelCount++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1279:                  channel: 'r8-summary-embeddings',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1290:      console.warn(`[stage1-candidate-gen] R8 summary channel failed: ${r8Msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1357:              channel: 'd2-query-surrogates',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1378:      channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1384:        channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1393:  // and keyword channels are always active regardless of query variant count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1400:      channelCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:47:| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:61:      |  search channels, constitutional injection, quality filter
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:77:- Runs one or more search channels based on `searchType` and `mode`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:78:- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:79:- Optional R12 embedding expansion and R8 summary embedding channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:86:- G2 prevention: intent weights are applied only for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:8: * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:9: * threshold, causing channel-representation promotion to silently reject ALL RRF results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:11: * compatible with both raw RRF scores and normalized [0,1] scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:29:/** A promoted item – a TopKItem augmented with the channel name it was lifted from. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:39:/** A raw result from a single retrieval channel (no source field required). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:50: * - `promoted`               — items that were promoted from under-represented channels
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:51: * - `underRepresentedChannels` — channel names that had 0 results in topK but did return results
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:52: * - `channelCounts`          — per-channel result counts in the final (enhanced) topK
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:58:  channelCounts: Record<string, number>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:65: * enabled, promote the best-scoring result from every channel that
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:69: *  - Only checks channels that actually returned results (no phantom penalties).
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:70: *  - A channel is under-represented when it has 0 results in topK.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:73: *  - The `source` field of each topK item is the authoritative channel label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:74: *    Items that carry a `sources` array (multi-channel convergence) are counted
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:75: *    toward each channel listed in that array.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:78: * @param allChannelResults - Map of channel name → raw results for that channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:91:      channelCounts: computeChannelCounts(topK),
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:101:      channelCounts: {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:105:  // Compute which channels are represented in the current top-k.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:110:    // Also count any additional sources (multi-channel convergence)
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:118:  // Identify which channels that returned results are missing from top-k.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:120:  for (const [channelName, channelResults] of allChannelResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:121:    if (channelResults.length === 0) continue; // channel returned nothing — not penalised
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:122:    if (!representedChannels.has(channelName)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:123:      underRepresentedChannels.push(channelName);
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:133:      channelCounts: computeChannelCounts(topK),
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:137:  // Padding appends the best item from each missing channel to guarantee
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:138:  // Every contributing channel has at least one representative in the result set.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:142:  for (const channelName of underRepresentedChannels) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:143:    const results = allChannelResults.get(channelName) ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:154:    if (best === null) continue; // no qualifying result — skip channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:158:      source: channelName,
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:159:      promotedFrom: channelName,
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:171:    channelCounts: computeChannelCounts(enhancedTopK),
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:178: * Count how many items in an array belong to each channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:179: * Uses the `source` field as the channel identifier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:182: * @returns Record mapping channel name to item count.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:62:  'channel',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:138:      channel TEXT DEFAULT 'default',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:176:    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:248:  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:473: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:68:| `chunk-thinning.ts` | Scores chunks using a weighted composite of anchor presence and content density, then applies a configurable threshold (default 0.3) to filter low-quality chunks before indexing. Always retains at least one chunk. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:38: *                     use as a search query in downstream channels.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:10: * Adaptive feedback channels that influence shadow ranking proposals.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:65:  weightedSignalScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:542:  let weightedSignalScore = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:547:    weightedSignalScore += row.total * thresholds.signalWeights[row.signal_type];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:582:    weightedSignalScore,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:636:    && summary.weightedSignalScore >= 0.04
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:4:// Tier-to-channel-subset routing for query complexity
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:5:// Maps classifier tiers to channel subsets for selective pipeline execution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:26:/** Maps each complexity tier to the set of channels that should be executed. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:36:  channels: ChannelName[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:40:/** All available channels in execution order. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:43:/** Minimum required channels for safe routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:46:/** Fallback channels used to pad configs that violate the minimum invariant. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:63: * Default tier-to-channel mapping:
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64: * - simple:   2 channels (vector + fts) — fastest path
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:66: * - complex:  5 channels (all) — full pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:79: * Enforce the minimum 2-distinct-channel invariant on a channel list.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:81: * fallback channels (vector, fts) until the minimum is met.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:83:function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:84:  const result = [...new Set(channels)] as ChannelName[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:98: * Get the channel subset for a given complexity tier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:102: * @returns Array of channel names to execute, guaranteed minimum 2 channels
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:109:  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:110:  return enforceMinimumChannels([...channels]);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:128: * Classify a query's complexity and route it to the appropriate channel subset
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:131: * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:136: * @returns RouteResult with tier, channels, and full classification details
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:145:  // In that case, always return all channels (full pipeline — safe default).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:149:      channels: [...ALL_CHANNELS],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:154:  const channels = getChannelSubset(classification.tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:156:    ? enforceMinimumChannels([...channels, 'bm25'])
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:157:    : channels;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:161:    channels: adjustedChannels,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:68:/** Breakdown of each component's weighted contribution. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:164: *          weighted contributions, and a human-readable interpretation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:182:  // Compute raw (unweighted) component values in [0, 1]
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:194:  // Sum all weighted components and clamp to [0, 1]
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:47:  graphEvidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:109:  channelAttribution?: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:205:    channelCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:224: * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:288: * State filtering, session dedup, constitutional injection, channel attribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:90: *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:91: *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:433: * Matching channels (weighted):
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:86:    'retrieval.eval_channel_rows_total': safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:88:      'SELECT COUNT(*) AS value FROM eval_channel_results',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:90:    'retrieval.avg_channel_hit_count': safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:92:      'SELECT COALESCE(AVG(hit_count), 0) AS value FROM eval_channel_results',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:94:    'retrieval.avg_channel_latency_ms': safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:96:      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_channel_results',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:155:    INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:11:// table, returning the matched canonical concept names for graph channel routing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:89: * activate the graph channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:320: * Contains the matched concepts and the activation state for the graph channel.
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:188:Attention score = weighted combination of 5 factors:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:486:// score = weighted 5-factor composite (temporal, usage, importance, pattern, citation)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:994:4. Each hop applies `decayPerHop` (0.5) decay, weighted by similarity
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:6:  - "hybrid search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:43:- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:57:Parallel Search (5 channels)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:63:RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:89:Executes 5 search channels in parallel and collects raw candidates with no scoring modifications.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:96:| Graph | `graph-search-fn.ts` | Causal edge traversal + typed-weighted degree (R4) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:97:| Degree | `graph-search-fn.ts` | Structural graph discovery via typed-weighted degree |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:99:Post-channel: constitutional memory injection, quality score filtering, tier/contextType filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:109:6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:128:### Reciprocal Rank Fusion (RRF)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:132:**Why RRF?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:135:- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:139:- **1.5x Graph Weight**: Graph-exclusive discoveries weighted higher for novelty
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:140:- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:148:// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:250:| **TypeScript**       | `channel-representation.ts`, `channel-enforcement.ts`, `confidence-truncation.ts` (quality)   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:299:| `graph-search-fn.ts`       | -      | TypeScript | Graph-structure search channel with typed-weighted degree computation |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:301:| `query-router.ts`          | -      | TypeScript | Tier-to-channel-subset routing for selective pipeline execution (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:303:| `channel-representation.ts`| -      | TypeScript | Ensures minimum channel representation in top-k results (QUALITY_FLOOR=0.005) (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:304:| `channel-enforcement.ts`   | -      | TypeScript | Pipeline-ready wrapper around channel min-representation check (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:314:| `graph-flags.ts`           | -      | TypeScript | Legacy compatibility shim for graph channel gate (SPECKIT_GRAPH_UNIFIED) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:316:| `memory-summaries.ts`      | -      | TypeScript | Summary storage, embedding, and search channel for memory summaries (R8) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:335:| `graph-calibration.ts`     | -      | TypeScript | Calibrates graph-channel scoring inputs and weights |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:365:2. PARALLEL RETRIEVAL (5 channels)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:376:   adaptive-fusion.ts -> Intent-aware weighted fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:377:   hybrid-search.ts -> Orchestrate multi-source fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:419:| `SPECKIT_MEMORY_SUMMARIES`| `true`  | Enable memory summary generation and search channel (R8) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:430:**RRF Parameters** (hardcoded, REQ-011):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:510:// -> RRF + Adaptive Fusion -> MMR diversity -> Sorted by combined score
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:516:hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:521:- If RRF disabled: Vector-only with basic metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:523:- If no structural graph channel: Vector + Lexical + Co-activation (3-channel fallback)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:574:**Purpose**: Generate TF-IDF extractive summaries of memory content and expose them as a search channel. Gated via `SPECKIT_MEMORY_SUMMARIES`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:642:The 5th RRF channel computes degree centrality with per-edge-type weights:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:687:| 2. Content Quality | 5-dimension weighted signal density | Dimensions: title (0.25), triggers (0.20), length (0.20), anchors (0.15), metadata (0.20) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:737:Typed-degree ranking is cached per database connection and invalidated through `clearDegreeCache()` / `clearDegreeCacheForDb()` after causal-edge and mutation flows, so the degree channel stays in sync with recent graph writes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:770:import { init, unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:796:import { unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:877:- Quality floor corrected from 0.2 to 0.005 (D3) — aligns with RRF score range
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:934:- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:947:| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:948:| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:963:- Query pipeline additions: query complexity routing, channel representation, confidence truncation, dynamic token budgets, folder discovery
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1753:  if (!column_names.includes('channel')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1755:      database.exec(`ALTER TABLE memory_index ADD COLUMN channel TEXT DEFAULT 'default'`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1756:      console.warn('[vector-index] Migration: Added channel column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1761:      logDuplicateColumnMigrationSkip('channel', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2328:      channel TEXT DEFAULT 'default',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2437:    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1334:    'channel',
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:4:// Feature catalog: Memory summary search channel
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:54:| **Semantic Search** | Vector-based similarity search with SQLite vector index and hybrid keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:137:│   ├── hybrid-search.ts        # Combined semantic + keyword search + token budget
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:138:│   ├── rrf-fusion.ts           # Reciprocal Rank Fusion scoring (5 channels incl. degree)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:150:│   ├── graph-search-fn.ts      # Typed-weighted degree computation (Sprint 1)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:153:│   ├── channel-enforcement.ts  # Channel enforcement policies
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:154:│   ├── channel-representation.ts # Min-representation R2 (QUALITY_FLOOR=0.005)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:320:| `search/vector-index.ts` | Core vector similarity search with RRF fusion |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:341:| `search/graph-search-fn.ts` | Typed-weighted degree computation for RRF 5th channel |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:342:| `search/channel-representation.ts` | Min-representation R2 (QUALITY_FLOOR=0.005) |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:371:| **Usage** | `search.hybridSearch.search(query, options)` |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:372:| **Fusion** | Uses Reciprocal Rank Fusion (RRF) to merge results |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:578:import { hybridSearch } from './search/hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:581:const results = await hybridSearch('TODO authentication', queryEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:721:| [Search Modules](./search/) | Vector index, hybrid search, fusion algorithms |
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:4:// Feature catalog: Memory summary search channel
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:148: * Vector search on summary embeddings — parallel channel for stage1.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:204: * Used to determine if the summary search channel should be activated
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:387: * Context types that should never decay under the hybrid decay policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:408: * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:417: * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:440: * REQ-D4-002: Apply the hybrid decay policy to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:6:// PURPOSE: Combine margin, multi-channel agreement, reranker support,
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:17://     "drivers": ["large_margin", "multi_channel_agreement"]
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:68:  | 'multi_channel_agreement'
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:117:  /** Source channels that contributed this result. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:119:  /** Single source channel string (legacy). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:121:  /** Trace metadata containing channel attribution. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:132: * Count the number of unique channels that retrieved this result.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:136:  const channels = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:140:      if (typeof s === 'string' && s.trim().length > 0) channels.add(s.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:145:    channels.add(result.source.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:148:  // Check traceMetadata.attribution for richer channel data
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:152:    for (const [channel, memoryIds] of Object.entries(attribution as Record<string, unknown>)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:158:      if (matched && typeof channel === 'string' && channel.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:159:        channels.add(channel.trim());
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:164:  return channels.size;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:216: *   - Number of channels that contributed this result (30%)
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:233:    const channelCount = countChannels(result);
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:244:    const channelFactor = channelCount >= STRONG_CHANNEL_AGREEMENT_MIN
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:246:      : channelCount === 1
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:257:      WEIGHT_CHANNEL_AGREEMENT * channelFactor +
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:269:    if (channelCount >= STRONG_CHANNEL_AGREEMENT_MIN) drivers.push('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:478:      const weightedStrength = clampStrength(node.strength * edge.strength * weight) ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:485:        strength: weightedStrength,

exec
/bin/zsh -lc "rg -n \"function handleMemoryContext|const handleMemoryContext|mode === \\\"resume\\\"|query-intent|structural|semantic|hybrid|code_graph_query|memory_search\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:15:// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:16:import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:187:  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:611:      // JSON parse failed — fall through to structural truncation
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:657:  // Deep: Comprehensive semantic search with full context
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1011:    structuralRoutingNudge,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1069:    structuralRoutingNudge,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1082:async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1131:  // graph context for structural/hybrid queries. Entire block is
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1133:  // existing semantic logic.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1148:          ? 'structural'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1149:          : classification.intent === 'hybrid'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1150:            ? 'hybrid'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1151:            : 'semantic',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1169:      if (classification.intent === 'structural' && classification.confidence > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1182:          // Code graph unavailable — fall through to semantic
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1184:      } else if (classification.intent === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1197:          // Code graph unavailable — hybrid degrades to semantic-only
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1200:      // 'semantic' or low-confidence: no graph context, fall through
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1452:  // Phase 020: Attach graph context and query-intent routing metadata
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1460:  const structuralRoutingNudge = buildStructuralRoutingNudge(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1465:  if (structuralRoutingNudge) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1466:    responseData.structuralRoutingNudge = structuralRoutingNudge;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1480:      ...(structuralRoutingNudge ? [structuralRoutingNudge.message] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1503:      structuralRoutingNudge,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:35: * Single source of truth for structural context in startup/recovery flows.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:185:    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:206: * Phase 027: Build a structural bootstrap contract for a given surface.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:238:      summary = 'Code graph available (structural context ready)';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:245:      summary = 'Code graph data is stale — structural context may be outdated';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:248:    summary = 'No structural context available — code graph is empty or unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:228:  //   graphFreshness (0.20) — A stale code graph means structural queries return
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:11:// The quality of semantic embeddings and keyword retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:52:  // Opening and closing anchor tags — keep nothing (structural only)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:59: * This catches structural markers not covered by stripAnchors(), e.g.:
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:81: * tokens like "typescript" or "json" carry no semantic signal about
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:166: * numbering carries no semantic meaning for retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:201: *   2. Strip anchor markers        — structural noise
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:202: *   3. Strip remaining HTML comments — structural noise
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:209: * The result is a clean prose representation suitable for semantic
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:237: * BM25 benefits from the same structural noise removal as the
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:38:| Quality Gate Layers | 3 | Structural, content quality, semantic dedup |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:50:| **Save Quality Gate** | 3-layer pre-storage validation (structural, content quality scoring, semantic dedup). Behind `SPECKIT_SAVE_QUALITY_GATE` flag |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:60: save-quality-gate.ts # 3-layer pre-storage quality gate (structural, content, semantic dedup)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:173:| `validateStructural(params)` | Layer 1: structural validation |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:181:| `checkSemanticDedup(params)` | Layer 3: semantic dedup check |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:279:| Structural check | `validateStructural()` | Quick pre-save structural validation |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:97:    // Density denominator uses total memories for meaningful sparse-graph semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:211:    '  neutralising its contribution to hybrid search until R10 is complete.',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:70:    structural: StructuralValidationResult;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:72:    semanticDedup: SemanticDedupResult | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:106:/** Minimum content length for structural validation */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:116:/** Minimum number of structural signals required for short-critical exception. */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:308: * When enabled, decision documents with sufficient structural signals may bypass
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:319: * REQ-D4-003: Count structural signals present in a document.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:342: *   3. At least SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS (2) structural signals present
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:383: * Layer 1: Validate structural requirements for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:392: * context_type documents that have >= 2 structural signals (title + specFolder + anchor).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:686: * Layer 3: Check for semantic near-duplicates using vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:771:        structural: { pass: true, reasons: [] },
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:785:        semanticDedup: null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:799:  const structural = validateStructural({
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:806:  allReasons.push(...structural.reasons);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:818:  let semanticDedup: SemanticDedupResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:820:    semanticDedup = checkSemanticDedup(
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:825:    if (semanticDedup.reason) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:826:      allReasons.push(semanticDedup.reason);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:831:  const wouldReject = !structural.pass
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:833:    || (semanticDedup !== null && !semanticDedup.pass);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:850:      structural,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:852:      semanticDedup,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:63:  /** Spec 126: Document structural type (spec, plan, tasks, memory, etc.) */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:290:    // Document structural type.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:151:  semantic_threshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:259:  semantic_threshold: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:312:  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:468:  if (similarity >= PATTERN_ALIGNMENT_BONUSES.semantic_threshold) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:469:    score += (similarity - PATTERN_ALIGNMENT_BONUSES.semantic_threshold) * 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:567:        // Graduated flag — default ON. Use !== 'false' to match graduated semantics (BUG-4 fix).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:600:  // Merging partial overrides. Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:648:  // Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:95:  'semantic_divergence',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:77:    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:22:- [4. STRUCTURAL TRUST CONTRACT (006)](#4--structural-trust-contract-006)
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:170:<!-- ANCHOR:structural-trust-contract -->
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:172:Packet `006-structural-trust-axis-contract` adds a separate structural trust contract for structural payload sections. The contract lives in `lib/context/shared-payload.ts` and must be imported rather than redefined by follow-on packets.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:178:| `parserProvenance` | `ast`, `regex`, `heuristic`, `unknown` | Which parser or extraction family produced the structural signal |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:179:| `evidenceStatus` | `confirmed`, `probable`, `unverified`, `unknown` | How strong the structural evidence is |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:180:| `freshnessAuthority` | `live`, `cached`, `stale`, `unknown` | Whether the structural signal is current and authoritative |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:191:Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:193:<!-- /ANCHOR:structural-trust-contract -->
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:279:Packet `007-detector-provenance-and-regression-floor` treats frozen detector fixtures as a regression-integrity floor only. The acceptance criterion from research recommendation R6 is the governing boundary: Public must land frozen detector fixtures that fail on structural regressions, while follow-on task corpora for user-visible structural quality are defined separately.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:283:- Fixture success proves detector integrity for the covered regex or heuristic lanes only; it does not prove user-visible structural quality, routing quality, or graph-context usefulness.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:284:- Successor packets must keep floor tests separate from outcome evaluation. Do not cite detector-floor passes as evidence that broader structural context is now trustworthy.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:300:Packet `011-graph-payload-validator-and-trust-preservation` hardens emission boundaries that surface structural trust. The implementation remains additive to packet `006`: import `ParserProvenance`, `EvidenceStatus`, `FreshnessAuthority`, and the shared validation helpers from `lib/context/shared-payload.ts` instead of defining a graph-local contract.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:61:  critical: 'semantic',              // Core concepts, high persistence
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:141:    return 'semantic';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:40:      "expectedResultDescription": "Decision records from hybrid-rag-fusion spec (spec 139) about fusion strategy selection. Should surface rationale for RRF over linear weighted sum.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:50:      "expectedResultDescription": "Should surface adaptive-fusion.ts (FEATURE_FLAG constant, isFeatureEnabled check), search-flags.ts, and rollout-policy.ts. Tests understanding the opt-out semantics.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:115:      "query": "which spec documents were added during the hybrid RAG fusion sprint",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:120:      "expectedResultDescription": "Should surface memories in spec folder system-spec-kit/022-hybrid-rag-fusion (89 memories) and 140-hybrid-rag-fusion-refinement. Lists spec documents created in those sprints.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:280:      "expectedResultDescription": "Deep investigation query. Should surface adaptive-fusion.ts, hybrid-search.ts, rrf-fusion.ts, and related spec memories spanning the search stack.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:295:      "query": "list all memories in the hybrid RAG fusion spec folder",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:300:      "expectedResultDescription": "Spec-scoped browse. Should surface memory titles and tiers from spec folder system-spec-kit/022-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:611:      "notes": "Derived from \"reciprocal rank fusion\" trigger phrase in the hybrid search documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:751:      "notes": "Vague natural language query — tests whether broad semantic retrieval surfaces the right subsystems."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:855:      "query": "I want to add telemetry tracking to the hybrid search pipeline",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:905:      "query": "show me the checklist for the sprint 0 hybrid RAG fusion refinement",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:915:      "query": "is there a research document for the hybrid RAG fusion approach",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:920:      "expectedResultDescription": "Should surface research/research.md from the 139-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement spec folder if it exists.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960:      "expectedResultDescription": "Should surface trigger-matcher.ts, vector-index.ts, hybrid-search.ts, and any architectural decision about keeping the two paths separate.",
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:39: * Controls which parsing backend the structural indexer uses for code-graph
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:47: * Runtime: `lib/code-graph/structural-indexer.ts::getParser()`
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:79:- Purpose: Owns large-file chunk production and quality-based chunk thinning before indexing. It defines how anchor-tagged and structurally segmented content becomes retrieval-sized units.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:315:  - `hybrid-search.ts` — main hybrid retrieval entry point across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:401:  - `save-quality-gate.ts` — multi-layer structural/content/semantic quality gate.
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:146:  source: 'memory' | 'code-graph' | 'semantic' | 'session' | 'operational';
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:148:  structuralTrust?: StructuralTrust;
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:408:  structuralContext: { status: string },
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:410:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:418:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:438:  const structuralTrust = validateStructuralTrustPayload(trustPayload, options);
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:441:    ...structuralTrust,
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:557:      ...(section.structuralTrust
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:559:          structuralTrust: validateStructuralTrustPayload(section.structuralTrust, {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:560:            label: `Shared payload section "${section.key}" structuralTrust`,
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:74:| **semantic** | 180 days | Never | Core concepts: architecture, design principles |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:95:| critical | semantic | Core concepts, high persistence |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:109:| `architecture`, `adr-\d+` | semantic | `docs/adr-001.md` |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:170:  content: '---\nmemory_type: semantic\n---\n# Architecture Overview',
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:172:// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:36:  | 'semantic'
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:94:  semantic: {
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:124:  'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:180:  { pattern: /architecture/i, type: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:181:  { pattern: /design[-_]?doc/i, type: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:182:  { pattern: /adr[-_]?\d+/i, type: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:243:  'architecture': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:244:  'design': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:245:  'principle': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:246:  'concept': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:247:  'decision': 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:355:    semantic: 180,
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:391:  { filePattern: /(?:^|\/)spec\.md$/i,                    documentType: 'spec',                    memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:392:  { filePattern: /(?:^|\/)plan\.md$/i,                    documentType: 'plan',                    memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:395:  { filePattern: /(?:^|\/)decision-record\.md$/i,         documentType: 'decision_record',         memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:396:  { filePattern: /(?:^|\/)implementation-summary\.md$/i,  documentType: 'implementation_summary',  memoryType: 'semantic',    defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:397:  { filePattern: /(?:^|\/)(?:research\/research\.md|research\.md)$/i, documentType: 'research', memoryType: 'semantic', defaultImportanceTier: 'normal', defaultImportanceWeight: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:151:        CHECK(memory_type IN ('working', 'episodic', 'prospective', 'implicit', 'declarative', 'procedural', 'semantic', 'autobiographical', 'meta-cognitive')),
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:48: * @returns True when the document participates in spec-level semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:36:  conflictType: 'keyword_negation' | 'semantic_opposition';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:66:/** Consolidation cadence for runtime hook (weekly batch semantics) */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:85: * Returns pairs that are both semantically similar AND contain
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:995: * expected by the hybridSearch / hybridSearchEnhanced functions.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:252:/** Parse JavaScript/TypeScript source for structural symbols */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:472:/** Parse Python source for structural symbols */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:586:/** Parse Bash source for structural symbols */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:701:      console.warn(`[structural-indexer] Tree-sitter init failed, falling back to regex: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:996:/** Parse a single file and return structural analysis */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1105:            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:306: * @param graphFn - Optional graph search function for causal/structural retrieval.
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1053:    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1072:        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1077:        for (const result of semanticResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1087:        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1227:      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1228:    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1237:          return { ...list, weight: semanticWeight };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1390:  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1789: * PI-A2: Last-resort structural search against the memory_index table.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1794: * @returns Array of HybridSearchResult with source='structural'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1796:function structuralSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1847:      source: 'structural',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2007:/** Tier-3 structural results are capped at this fraction of the top existing score. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2110: * TIER 3: structuralSearch (pure SQL last-resort)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2176:  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2490:  structuralSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:11:// Keyword search achieves without any semantic, graph, or trigger
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:85:  hybridMRR?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:86:  /** BM25/hybrid ratio (relative mode only). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:92: * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:119: * For production use, wire up the FTS5 path from hybrid-search with all
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:136: *     BM25 alone is very strong — semantic/graph additions may not
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:141: *     BM25 is moderate — semantic/graph channels must demonstrably
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:147: *     retrieval. Proceed with hybrid search implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:160:        'BM25 alone is very strong — semantic/graph additions may not justify complexity. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:174:        'BM25 is moderate — semantic/graph channels should demonstrably improve over this baseline. ' +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:187:      'The low keyword-only baseline confirms that semantic and graph augmentation ' +
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
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:46:  kind: 'structural' | 'implementation' | 'verification';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:111:  structuralNudge: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:116:    structuralNudge: variant === 'R4_only' || variant === 'R2+R3+R4_combined',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:139:  if (scenario.followUp.kind === 'structural') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:140:    if (caps.structuralNudge && scenario.followUp.graphReady) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:157:  if (scenario.followUp.kind === 'structural') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:220:  if (scenario.followUp.kind === 'structural') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:221:    if (caps.structuralNudge && scenario.followUp.graphReady) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:613:        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:988: * Validate lineage chains and active projections for structural drift.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:610:      'See memory_causal_link() documentation for relation semantics'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:779:        'Configure an embedding provider for semantic search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:519:              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:77:  structuralTrust?: never;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:226:    searchType: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:148:| `selectedMode` | `string \| null` | Mode chosen for this run (e.g., `hybrid`, `auto`, `deep`) |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:222:**Purpose**: Summarize graph-walk rollout semantics and bounded contribution diagnostics for a retrieval run.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:142:  'semantic': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:143:  'semantics': 'search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:693: * Returns null if missing, corrupt, or structurally invalid (graceful degradation).
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:46: * kept intentionally structural (duck-typed) so the retrieval-directives module
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:11:// Rather than semantic broadening.
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:33: * - `expanded`      — Array of semantically related terms extracted from
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:65:/** Number of semantically similar memories to mine for expansion terms. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:74:/** Stop-words that carry no semantic signal for expansion. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:156: * Expand a query using embedding-based similarity to find semantically
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:212:    // Use the query embedding to find semantically similar memories.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:789:      // This preserves legacy "rollback to before next change" semantics for
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:10:// structural headings, extractive summaries, and heuristic questions that
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:147: * Extract markdown headings (## and ###) as structural surrogates.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:8:// Spec: system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:12:import { indexFiles } from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:59: * Falls back to `['hybrid']` if no channels are found.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:85:    channels.add('hybrid');
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:6:  - "hybrid search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:109:6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:190:The contract is intentionally narrow: preserve result-shape semantics, surface truthful lane metadata, and let later packets build on that truth instead of inferring capability from empty results or warning logs.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:310:| `fsrs.ts`                  | -      | TypeScript | Temporal-structural coherence: FSRS stability augmented with graph centrality |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:366:   vector-index.ts -> Vector search (semantic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:377:   hybrid-search.ts -> Orchestrate multi-source fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:506:// 1. Vector search (semantic similarity)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:509:// 4. Graph-structure search (structural discovery)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:516:hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:523:- If no structural graph channel: Vector + Lexical + Co-activation (3-channel fallback)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:662:The causal graph is condensed into strongly connected components, then longest-path depth is computed across the resulting DAG. Shortcut edges do not collapse deeper chains; cycle members share one bounded depth layer, and the final depth is normalized by the deepest reachable component chain (`maxDepth`). Score bonus: `normalizedDepth * 0.05` — rewards structurally deep nodes in the causal chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:770:import { init, unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:796:import { unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:947:| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:948:| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:23:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:232: * Intent priority lists may include upper-case semantic labels (e.g. 'CORRECTION').
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:5:export * from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:13:export * from './query-intent-classifier.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:128:// contract adopts appendOnly and canonicalFilePath semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:39:   * The semantic type extracted from the anchor ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:69: * Derive the semantic type from an anchor ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:91:| **Spreading Activation**     | Boost related memories (+0.15 on access)                                              | Maintains semantic coherence         |
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:9:   Common English words that carry no semantic signal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:387: * When enabled: decision context_type documents with >= 2 structural signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:6:/** Node types extracted by the structural indexer */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:18:/** Honest graph-local detector provenance classes for structural indexing lanes. */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:31:/** Languages supported by the structural indexer */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:34:/** A structural symbol node extracted from source code */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:73:/** Configuration for the structural indexer */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:113:      `(${describeLastScan(args.graphSummary.lastScan)}; first structural read may refresh inline)`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:125:    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:203:      key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:230:        ? `Startup brief with ${graph.graphState} structural context and ${sessionContinuity ? 'session continuity' : 'no continuity notes'}`
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:231:        : `Startup brief without structural highlights (${graph.graphState})`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:26: * Compute structural freshness by augmenting an FSRS stability score
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:30: *   structural_freshness = fsrs_stability * graph_centrality_normalized
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:10:| `structural-indexer.ts` | Regex-based parser for JS/TS/Python/Bash (tree-sitter planned) |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:22:- **CocoIndex** (semantic, external MCP): finds relevant code by concept
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:23:- **Code Graph** (structural, this library): maps imports, calls, hierarchy
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:5:// retrieval backend: structural (code graph) vs semantic
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:6:// (CocoIndex) vs hybrid (both).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:9:// routing between structural (code graph) and semantic backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:11:export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:16:  structuralScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:17:  semanticScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:71:  // F035: Narrowed — require semantic noun after opener to avoid matching structural queries
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:75:  // F035: Narrowed — require semantic noun after "what is/are/does"
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:112: * Classify a query's intent for routing between structural
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:113: * (code graph) and semantic (CocoIndex) retrieval backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:124:  const structuralHits = countKeywordHits(tokens, STRUCTURAL_KEYWORDS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:125:  const semanticHits = countKeywordHits(tokens, SEMANTIC_KEYWORDS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:126:  const structuralPatterns = countPatternHits(query, STRUCTURAL_PATTERNS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:127:  const semanticPatterns = countPatternHits(query, SEMANTIC_PATTERNS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:130:  const structuralScore = structuralHits.count + structuralPatterns * 2;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:131:  const semanticScore = semanticHits.count + semanticPatterns * 2;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:132:  const total = structuralScore + semanticScore;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:134:  const matchedKeywords = [...structuralHits.matched, ...semanticHits.matched];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:136:  // No signals at all → hybrid (run both)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:141:  const structuralRatio = structuralScore / total;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:142:  const semanticRatio = semanticScore / total;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:150:  // Clear structural signal (>65% structural)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:151:  if (structuralRatio > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:153:      intent: 'structural',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:154:      confidence: computeConfidence(structuralRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:155:      structuralScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:156:      semanticScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:161:  // Clear semantic signal (>65% semantic)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:162:  if (semanticRatio > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:164:      intent: 'semantic',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:165:      confidence: computeConfidence(semanticRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:166:      structuralScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:167:      semanticScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:174:    intent: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:175:    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:176:    structuralScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:177:    semanticScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:4:// SQLite storage for structural code graph (nodes + edges).
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:36:The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:54:| **Semantic Search** | Vector-based similarity search with SQLite vector index and hybrid keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:137:│   ├── hybrid-search.ts        # Combined semantic + keyword search + token budget
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:324:| `search/cross-encoder.ts` | Cross-encoder semantic reranking |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:362:| **Purpose** | Find memories by semantic meaning, not just keywords |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:366:**Hybrid Search**: Combines semantic and keyword search for better recall
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:370:| **Purpose** | Use both semantic understanding and exact keyword matches |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:371:| **Usage** | `search.hybridSearch.search(query, options)` |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:546:**Result**: Returns top 5 memories ranked by semantic similarity and importance
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:577:// Combine semantic and keyword search
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:578:import { hybridSearch } from './search/hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:581:const results = await hybridSearch('TODO authentication', queryEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:721:| [Search Modules](./search/) | Vector index, hybrid search, fusion algorithms |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:7:// structural-indexer.ts.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:15:import { detectorProvenanceFromParserBackend } from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:16:import { extractEdges, capturesToNodes, type RawCapture } from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:19:// F043: RawCapture is now imported from structural-indexer.ts (single source of truth)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:21:/** ParserAdapter interface — mirrors structural-indexer.ts:16-18 */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:602:// F043: capturesToNodes and RawCapture are now imported from structural-indexer.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:200:            ? 'semantic'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:322: * which may be semantically dissimilar but contextually important.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:366: * surfaces causally related but semantically dissimilar memories
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:158:  actions.push('Use `mcp__cocoindex_code__search` for semantic discovery of related code');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:68:    ? 'Code graph readiness is unified and structurally usable.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:70:      ? 'Code graph exists but needs refresh before structural trust is high.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:387: * Context types that should never decay under the hybrid decay policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:408: * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:417: * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:440: * REQ-D4-002: Apply the hybrid decay policy to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:509:  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:381:    // Cast through unknown: our local RerankDocument is structurally equivalent to
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:17://     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:18://     "topSignals": ["semantic_match", "anchor:decisions"],
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:32:  | 'semantic_match'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:95:    signals.push('semantic_match');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:173: * Prioritises: semantic/lexical first, then boosts, then meta.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:204:    if (signal === 'semantic_match') return 'semantic similarity';
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:23:  /** Weight for semantic (vector) search component, 0-1 */
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:24:  semanticWeight: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:55:    semanticWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:63:    semanticWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:71:    semanticWeight: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:79:    semanticWeight: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:87:    semanticWeight: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:95:    semanticWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:103:    semanticWeight: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:111:    semanticWeight: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:119:    semanticWeight: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:189:    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:47:| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:78:- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:86:- G2 prevention: intent weights are applied only for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:18:  semanticChunk,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:557: * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:25:/** Common English stop words for semantic complexity heuristic */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:131:| Depth bonus | `normalizedDepth * 0.05` | 0 to +0.05 | Rewards structurally deep nodes |

exec
/bin/zsh -lc "rg -n \"handleCodeGraphQuery|operation:|calls_from|imports_from|blast_radius|outline|impact|neighborhood|seed\" .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:4:// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:7:import type { CodeGraphSeed } from '../../lib/code-graph/seed-resolver.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:15:  seeds?: Array<{
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:52:  const normalizedSeeds: NormalizedSeedSource[] = (args.seeds ?? []).map((seed) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:53:    source: typeof seed.source === 'string' && seed.source.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:54:      ? seed.source
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:55:      : seed.provider,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:56:    filePath: seed.provider === 'cocoindex'
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:57:      ? (seed.file ?? seed.filePath ?? '')
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:58:      : (seed.filePath ?? seed.file ?? ''),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:59:    startLine: seed.provider === 'cocoindex' ? seed.range?.start : seed.startLine,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:60:    endLine: seed.provider === 'cocoindex' ? seed.range?.end : seed.endLine,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:61:    symbolId: seed.symbolId,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:62:    symbolName: seed.symbolName,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:65:  const match = normalizedSeeds.find((seed) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:66:    if (seed.symbolId && anchor.symbolId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:67:      return seed.symbolId === anchor.symbolId;
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:69:    if (seed.symbolName && anchor.fqName) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:70:      return seed.symbolName === anchor.fqName || anchor.fqName.endsWith(`.${seed.symbolName}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:72:    if (seed.filePath !== anchor.filePath) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:75:    if (typeof seed.startLine === 'number' && seed.startLine !== anchor.startLine) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:78:    if (typeof seed.endLine === 'number' && seed.endLine !== anchor.endLine) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:107:    const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:109:      : 'neighborhood');
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:111:    const seeds = (args.seeds ?? []).map((seed) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:112:      const source = typeof seed.source === 'string' && seed.source.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:113:        ? seed.source
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:114:        : seed.provider;
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:116:      if (seed.provider === 'cocoindex' && seed.file) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:119:          file: seed.file,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:120:          range: seed.range ?? { start: seed.startLine ?? 1, end: seed.endLine ?? seed.startLine ?? 1 },
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:121:          score: seed.score ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:122:          snippet: seed.snippet,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:127:      if (seed.provider === 'manual' && seed.symbolName) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:130:          symbolName: seed.symbolName,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:131:          filePath: seed.filePath,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:132:          kind: seed.kind,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:137:      if (seed.provider === 'graph' && seed.symbolId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:140:          nodeId: seed.nodeId ?? seed.symbolId,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:141:          symbolId: seed.symbolId,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:147:        filePath: seed.filePath ?? seed.file ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:148:        startLine: seed.startLine ?? seed.range?.start,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:149:        endLine: seed.endLine ?? seed.range?.end,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:150:        query: seed.query,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:161:      seeds,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:16:  operation: 'outline' | 'calls_from' | 'calls_to' | 'imports_from' | 'imports_to' | 'blast_radius';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:318:export async function handleCodeGraphQuery(args: QueryArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:340:  if (operation === 'outline') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:349:            operation: 'outline',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:367:  if (operation === 'blast_radius') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:441:    case 'calls_from': {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:495:    case 'imports_from': {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:548:      return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error: `Unknown operation: ${operation}` }) }] };
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:96:  operation: string;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:131:export function logExecutionTime(operation: string, durationMs: number, details: Record<string, unknown> = {}): ExecutionLogEntry | undefined {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:146:export function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:9:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:19:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:29:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:39:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:49:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:59:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:69:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:79:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:89:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:99:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:109:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:119:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:129:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:139:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:149:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:159:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:169:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:179:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:189:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:199:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:209:      "source": "seed",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:701:      "notes": "Derived from SPECKIT_PRESSURE_POLICY env var trigger phrase — overlaps with seed query 9 but phrased differently."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:5:// Measures the impact of different RRF K-values on ranking stability.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:880:  // Sort by absolute delta descending (most impactful first)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:27:export type QuerySource = 'manual' | 'trigger_derived' | 'pattern_derived' | 'seed';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:68:    seed: GROUND_TRUTH_QUERIES.filter(q => q.source === 'seed').length,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:95: * Uses Math.random() — no seeding, no state.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:131:async function withBusyRetry<T>(operation: () => T): Promise<T> {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:148:function withBusyRetrySync<T>(operation: () => T): T {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:187:async function withBusyRetry(operation: () => Promise<void>): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:262:    operation: () => Promise<void>,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:247:/** Number of top results used as seeds for co-activation spreading. */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:7:export * from './seed-resolver.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:44:  seedPair: ContradictionPair;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:298:    for (const seedId of [pair.memoryA.id, pair.memoryB.id]) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:304:        `) as Database.Statement).all(String(seedId), String(seedId)) as Array<{ neighbor_id: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:318:      seedPair: pair,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:532:// Spread activation from seed memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:534:  [42, 58],    // seedIds: number[]
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:991:1. Call `spreadActivation(seedIds)` with one or more seed memory IDs
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:992:2. For each seed, get `related_memories` from DB (JSON array of `{id, similarity}`)
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:53:| **DegradedModeContract** | Failure description with confidence impact, retry recommendation, and affected stages |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:131:| `confidence_impact` | `number` | Confidence factor (0 = total loss, 1 = no impact), clamped to [0, 1] |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:162:| `createDegradedContract(failure_mode, fallback_mode, confidence_impact, retry_recommendation, degradedStages)` | `DegradedModeContract` | New degraded-mode record with clamped confidence |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:236:console.log(`Failure: ${degraded.failure_mode}, confidence impact: ${degraded.confidence_impact}`);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:237:// Failure: timeout, confidence impact: 0.15
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:246:| Signal failure | `createDegradedContract(failure, fallback, impact, retry, stages)` | When a stage falls back or fails |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:12:| `seed-resolver.ts` | Resolves CocoIndex file:line results to graph nodes |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:13:| `code-graph-context.ts` | LLM-oriented graph neighborhoods (neighborhood/outline/impact modes) |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:310:function invalidateOnWrite(operation: string, _context: Record<string, unknown> = {}): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:365: * and causal_edges graph from seed memories. Merging both sources
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:370:  seedIds: number[],
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:374:  if (!db || seedIds.length === 0) return [];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:386:  const queue: QueueItem[] = seedIds.map(id => ({
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:184:  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:145:  seeded: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:595: * @param memoryId - Memory version to seed into lineage tables.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:599:export function seedLineageFromCurrentState(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:618:  const seedTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:646:  seedTx();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:706:          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:710:          if (seeded.logicalKey !== rowLogicalKey) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:712:              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:716:          logicalKey = seeded.logicalKey;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:717:          rootMemoryId = seeded.rootMemoryId;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:718:          versionNumber = seeded.versionNumber + 1;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1064: * @returns Backfill summary including scanned and seeded rows.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1093:  let seeded = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1120:        seeded += 1;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1131:      seeded,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1210:    seeded,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1321: * @returns Backfill summary including scanned and seeded rows.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:34:  'neighborhood', 'outline', 'impact', 'graph',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:65:  /(?:impact|blast\s+radius)\s+of/i,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:66:  /(?:outline|structure)\s+of/i,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:63:  seed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:82:/** Deterministic seed so weekly holdout selection is stable across restarts. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:347:  seed: number,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:357:  const holdoutQueryIds = selectHoldoutQueries(allQueryIds, { holdoutPercent, seed });
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:404:  const seed = options.seed ?? DEFAULT_SEED;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:428:    const replayed = await buildHoldoutReplayMap(db, queryRows, holdoutPercent, seed, searchLimit);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:444:        seed,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:13://   - Holdout queries are deterministically selected via seed
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:100:  seed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:108:  seed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:207: * Simple seeded PRNG (mulberry32).
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:210:export function seededRandom(seed: number): () => number {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:211:  let s = seed | 0;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:227: * Uses a seeded PRNG for deterministic selection. When intentClasses
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:240:  const seed = opts.seed ?? 42;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:250:    return stratifiedSample(queryIds, opts.intentClasses, targetCount, seed);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:253:  // Simple random sampling with deterministic seed
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:254:  const rng = seededRandom(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:267:  seed: number
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:269:  const rng = seededRandom(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:611:      seed: opts.seed,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:7:// For results related to top seed results via weighted CTE.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:14://   score = seedScore * edgePrior * hopDecay * freshness
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:27:/** Top fraction of result set used as graph walk seed nodes. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:29:/** Absolute cap on seed nodes regardless of result set size. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:282: * Formula: seedScore * edgePrior * hopDecay * freshness
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:284: * @param seedScore  - Base score of the seed node (0–1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:286: * @param hopDistance - Hop distance from seed (1 = direct neighbor)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:291:  seedScore: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:299:  return seedScore * edgePrior * hopDecay * freshness;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:342:  seedScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:349:  return params.seedScore *
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:410: * Walk causal edges up to maxHops from the given seed memory IDs,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:527: *   score = seedScore * edgePrior * hopDecay * freshness
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:557:  const seedLimit = Math.max(1, Math.min(MAX_SEED_RESULTS, Math.ceil(results.length * SEED_FRACTION)));
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:558:  const seedResults = results.slice(0, seedLimit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:559:  const seedIds = seedResults.map((item) => item.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:561:  const neighborBoosts = getNeighborBoosts(seedIds, effectiveMaxHops);
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:567:  // using the intent-aware traversal formula: seedScore * edgePrior * hopDecay * freshness.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:568:  // We use the average seed score as the seedScore proxy and the actual hop distance
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:573:    const avgSeedScore = seedResults.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:574:      ? seedResults.map((s) => resolveBaseScore(s)).reduce((a, b) => a + b, 0) / seedResults.length
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:580:      // so we use the seed's dominant relation by querying the first-hop edge from the DB.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:587:            WHERE source_id IN (${seedIds.map(() => '?').join(',')})
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:590:          `) as Database.Statement).get(...seedIds.map(String), String(neighborId)) as
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:683: * even when the causal boost has no seed results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:692:  /** Edge relation types connecting seeds to neighbors. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:701: * Unlike applyCausalBoost, this runs even when there are no seed results,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:728:    // Find seed memory IDs whose titles contain matched concept keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:732:    const seedRows = (database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:736:    if (seedRows.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:740:    const seedIds = seedRows.map((r) => String(r.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:741:    const seedPlaceholders = seedIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:747:          WHEN ce.source_id IN (${seedPlaceholders}) THEN CAST(ce.target_id AS INTEGER)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:752:      WHERE ce.source_id IN (${seedPlaceholders}) OR ce.target_id IN (${seedPlaceholders})
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:755:      ...seedIds,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:756:      ...seedIds,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:757:      ...seedIds,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:762:    const seedIdSet = new Set(seedRows.map((r) => r.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:765:      if (!seedIdSet.has(row.neighbor_id) && Number.isFinite(row.neighbor_id)) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:4:// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:9:import { resolveSeeds, type CodeGraphSeed, type ArtifactRef } from './seed-resolver.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:11:export type QueryMode = 'neighborhood' | 'outline' | 'impact';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:17:  seeds?: CodeGraphSeed[];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:48:  const queryMode = args.queryMode ?? 'neighborhood';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:50:  const seeds = args.seeds ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:51:  const resolvedAnchors = resolveSeeds(seeds);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:53:  // If no seeds but subject given, create seed from subject
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:59:  // Empty seeds + no subject → outline mode fallback
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:80:      // File anchor — get outline
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:81:      const outlineNodes = graphDb.queryOutline(anchor.filePath).slice(0, nodeLimit);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:84:        nodes: outlineNodes.map(n => ({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine })),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:87:      totalNodes += outlineNodes.length;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:119:/** Build fallback result when no seeds/subject resolve */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:126:    combinedSummary: 'Empty context — no seeds or subject resolved to graph nodes.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:146:  if (mode === 'neighborhood' && sections.some(s => s.edges.length > 5)) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:147:    actions.push('Use `queryMode: "impact"` to see who calls these symbols');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:149:  if (mode === 'impact') {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:150:    actions.push('Use `queryMode: "outline"` for file-level overview');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:156:    actions.push('Narrow with `seeds[]` for more specific context');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:190:    case 'neighborhood': {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:210:    case 'outline': {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:211:      const outlineNodes = graphDb.queryOutline(anchor.filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:212:      for (const n of outlineNodes) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:222:    case 'impact': {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:228:          console.warn(`[code-graph-context] impact query exceeded ${budgetMs}ms budget (${Math.round(elapsed)}ms elapsed), breaking early`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:279: * Never-drops guarantee: always includes top seed, root anchor, one boundary edge, one next action.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:203:    // Step 1: Find seed memory IDs whose titles contain matched concepts
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:207:    const seedRows = (db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:213:    if (seedRows.length === 0) return [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:215:    const seedIds = seedRows.map((r) => String(r.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:216:    const seedPlaceholdersSql = seedIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:218:    // Step 2: Walk 1-hop causal edges from seeds to find neighbor nodes
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:223:        (ce.source_id IN (${seedPlaceholdersSql}) AND mi.id = CAST(ce.target_id AS INTEGER))
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:225:        (ce.target_id IN (${seedPlaceholdersSql}) AND mi.id = CAST(ce.source_id AS INTEGER))
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:227:      WHERE mi.id NOT IN (${seedPlaceholdersSql})
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:230:      ...seedIds,
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:231:      ...seedIds,
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:232:      ...seedIds,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:400: * Step-back abstraction + corpus seed grounding. Deep-mode only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:608: * Runs concept routing + graph neighbor lookup even without seed results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:800:                operation: 'migration_v14_backfill',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:814:              operation: 'migration_v14_backfill',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2006:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2023:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2040:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2051:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2062:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2080:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2091:      operation: 'create_common_indexes',
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8:// Step-back abstraction combined with corpus seed grounding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:32:/** A single seed result used to ground the reformulation prompt. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:49:  /** Number of seed results to retrieve. Default: SEED_LIMIT. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:57:/** Number of seed results to retrieve for grounding. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:89: * Fast, low-cost seed retrieval for reformulation grounding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:100: * @returns Array of seed results (may be empty).
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:135: * Injects the original query and top-3 seed snippets so the LLM can
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:145: * @param seeds - Corpus seed results for grounding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:148:function buildReformulationPrompt(query: string, seeds: SeedResult[]): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:149:  const seedBlock = seeds.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:150:    ? seeds.map((s, i) => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:154:    : '(no corpus seeds available)';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:158:    'Your task: given an original query and corpus seed excerpts, produce:',
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:163:    '  - Stay strictly grounded in the provided seed content.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:164:    '  - Do NOT invent concepts, entities, or facts not present in the seeds.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:165:    '  - If seeds are unavailable, use only the original query as grounding.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:173:    'Corpus seeds:',
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:174:    seedBlock,
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:317: * Matches the call site pattern: `await llm.rewrite({ q, seeds, mode })`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:326:   *   3. Build grounded prompt using seeds.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:336:   * @param params.seeds - Seed results for corpus grounding.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:342:    seeds: SeedResult[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:345:    const { q, seeds } = params;
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:366:      const prompt = buildReformulationPrompt(q, seeds);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1260:      operation: 'get_memory_preview',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:326:  options: { seedCandidates?: PipelineRow[]; seedLabel?: string } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:329:  const seedLabel = options.seedLabel ?? '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:331:  for (const row of options.seedCandidates ?? []) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:333:    merged.set(key, mergeCandidateRows(merged.get(key), row, seedLabel));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1080:  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1090:      const seeds = cheapSeedRetrieve(query, { limit: 3 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1091:      const reform = await llm.rewrite({ q: query, seeds, mode: 'step_back+corpus' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1142:              seedCandidates: candidates,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1143:              seedLabel: query,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1196:          seedCandidates: candidates,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1197:          seedLabel: query,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:656:Top-ranked results seed a 2-hop BFS traversal over causal edges. Discovered neighbors receive a score boost with `SEED_FRACTION=0.25` strength. A `1/sqrt(neighbor_count)` fan-effect divisor (R17) prevents hub nodes from appearing in every co-activation result.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:414:/** Query: get file outline (nodes sorted by line) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:11:// Scoring impact.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:295: * Build one centroid vector per intent from seed phrases and keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:10:/** A seed from CocoIndex or other providers */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18:/** Native CocoIndex search result as a seed */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:27:/** Manual seed with symbol name (no file path required) */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:35:/** Pre-resolved graph node seed */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:42:/** Union type for all seed kinds */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:59:function hasProvider(seed: unknown, provider: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:60:  if (typeof seed !== 'object' || seed === null) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:63:  return (seed as { provider?: unknown }).provider === provider;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:66:function isCocoIndexSeed(seed: unknown): seed is CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:67:  return hasProvider(seed, 'cocoindex');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:70:function isManualSeed(seed: unknown): seed is ManualSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:71:  return hasProvider(seed, 'manual');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:74:function isGraphSeed(seed: unknown): seed is GraphSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:75:  return hasProvider(seed, 'graph');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:78:function throwResolutionError(operation: string, seed: unknown, err: unknown): never {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:80:  console.error(`[seed-resolver] ${operation} failed`, { seed, error: message });
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:81:  throw new Error(`[seed-resolver] ${operation} failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:86:/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:87:export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:89:    filePath: seed.file,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:90:    startLine: seed.range.start,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:91:    endLine: seed.range.end,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:96:export function resolveManualSeed(seed: ManualSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:101:    const params: unknown[] = [seed.symbolName];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:103:    if (seed.filePath) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:105:      params.push(seed.filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:107:    if (seed.kind) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:109:      params.push(seed.kind);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:128:    throwResolutionError('resolveManualSeed', seed, err);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:132:    filePath: seed.filePath ?? '<unknown>',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:137:    kind: seed.kind ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:144:export function resolveGraphSeed(seed: GraphSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:150:    ).get(seed.symbolId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:165:    throwResolutionError('resolveGraphSeed', seed, err);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:172:    symbolId: seed.symbolId,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:180:/** Resolve a single seed to an ArtifactRef */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:181:export function resolveSeed(seed: CodeGraphSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:186:    if (seed.startLine) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:192:      `).get(seed.filePath, seed.startLine) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:196:          filePath: seed.filePath,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:212:      `).get(seed.filePath, seed.startLine, seed.startLine) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:215:        const distance = Math.abs((nearExact.start_line as number) - seed.startLine);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:217:          filePath: seed.filePath,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:234:      `).get(seed.filePath, seed.startLine, seed.startLine) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:238:          filePath: seed.filePath,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:252:      filePath: seed.filePath,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:253:      startLine: seed.startLine ?? 1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:254:      endLine: seed.endLine ?? 1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:262:    throwResolutionError('resolveSeed', seed, err);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:266:/** Resolve any seed variant to an ArtifactRef */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:267:function resolveAnySeed(seed: AnySeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:268:  if (isCocoIndexSeed(seed)) return resolveCocoIndexSeed(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:269:  if (isManualSeed(seed)) return resolveManualSeed(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:270:  if (isGraphSeed(seed)) return resolveGraphSeed(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:271:  return resolveSeed(seed as CodeGraphSeed);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:274:/** Resolve multiple seeds, deduplicate overlapping refs */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:275:export function resolveSeeds(seeds: AnySeed[]): ArtifactRef[] {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:279:  for (const seed of seeds) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:280:    const ref = resolveAnySeed(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:25:// 2a. Co-activation spreading — spreading activation from top-N seeds
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:121:/** Number of top results used as seeds for co-activation spreading. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:933: *   2a. Co-activation      (spreading activation from top-N seeds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1055:  // Gated behind SPECKIT_COACTIVATION flag. Takes the top-N results as seeds,

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '780,810p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '482,1040p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   561	      });
   562	    }
   563	
   564	    const snippetResults = extractSnippets(resolved.results);
   565	    return createMCPSuccessResponse({
   566	      tool: 'memory_search',
   567	      summary: `Returned ${snippetResults.length} continuation results`,
   568	      data: {
   569	        count: snippetResults.length,
   570	        results: snippetResults,
   571	        continuation: resolved.continuation,
   572	      },
   573	      startTime: _searchStartTime,
   574	      cacheHit: false,
   575	    });
   576	  }
   577	
   578	  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
   579	
   580	  // Validate numeric limit parameter
   581	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   582	    ? Math.min(Math.floor(rawLimit), 100)
   583	    : 10;
   584	
   585	  // BUG-007: Validate query first with proper error handling
   586	  let normalizedQuery: string | null = null;
   587	  if (query !== undefined) {
   588	    try {
   589	      normalizedQuery = validateQuery(query);
   590	    } catch (validationError: unknown) {
   591	      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
   592	        const message = toErrorMessage(validationError);
   593	        return createMCPErrorResponse({
   594	          tool: 'memory_search',
   595	          error: message,
   596	          code: 'E_VALIDATION',
   597	          details: { parameter: 'query' },
   598	          recovery: {
   599	            hint: 'Provide a valid query string or use concepts array instead'
   600	          }
   601	        });
   602	      }
   603	      normalizedQuery = null;
   604	    }
   605	  }
   606	
   607	  const hasValidQuery = normalizedQuery !== null;
   608	  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
   609	  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
   610	
   611	  if (!hasValidQuery && !hasValidConcepts) {
   612	    return createMCPErrorResponse({
   613	      tool: 'memory_search',
   614	      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
   615	      code: 'E_VALIDATION',
   616	      details: { parameter: 'query' },
   617	      recovery: {
   618	        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
   619	      }
   620	    });
   621	  }
   622	
   623	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   624	    return createMCPErrorResponse({
   625	      tool: 'memory_search',
   626	      error: 'specFolder must be a string',
   627	      code: 'E_VALIDATION',
   628	      details: { parameter: 'specFolder' },
   629	      recovery: {
   630	        hint: 'Provide specFolder as a string path'
   631	      }
   632	    });
   633	  }
   634	
   635	  // Eval logger — capture query at pipeline entry (fail-safe)
   636	  let _evalQueryId = 0;
   637	  let _evalRunId = 0;
   638	  try {
   639	    const evalEntry = logSearchQuery({
   640	      query: effectiveQuery,
   641	      intent: explicitIntent ?? null,
   642	      specFolder: specFolder ?? null,
   643	    });
   644	    _evalQueryId = evalEntry.queryId;
   645	    _evalRunId = evalEntry.evalRunId;
   646	  } catch (_error: unknown) { /* eval logging must never break search */ }
   647	
   648	  const artifactRoutingQuery = resolveArtifactRoutingQuery(
   649	    normalizedQuery,
   650	    hasValidConcepts ? concepts : undefined
   651	  );
   652	  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
   653	
   654	  // Intent-aware retrieval
   655	  let detectedIntent: string | null = null;
   656	  let intentConfidence = 0;
   657	  let intentWeights: IntentWeights | null = null;
   658	
   659	  if (explicitIntent) {
   660	    if (intentClassifier.isValidIntent(explicitIntent)) {
   661	      detectedIntent = explicitIntent;
   662	      intentConfidence = 1.0;
   663	      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
   664	    } else {
   665	      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
   666	    }
   667	  }
   668	
   669	  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
   670	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
   671	    detectedIntent = classification.intent;
   672	    intentConfidence = classification.confidence;
   673	    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);
   674	
   675	    if (classification.fallback) {
   676	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
   677	    } else {
   678	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
   679	    }
   680	  }
   681	
   682	  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
   683	  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
   684	  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
   685	    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
   686	    detectedIntent = 'understand';
   687	    intentConfidence = 1.0;
   688	    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
   689	  }
   690	
   691	  // Phase C: Intent-to-profile auto-routing.
   692	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
   693	  let effectiveProfile: string | undefined = profile;
   694	  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
   695	    try {
   696	      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
   697	      if (autoProfile) {
   698	        effectiveProfile = autoProfile;
   699	        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
   700	      }
   701	    } catch (_autoProfileErr: unknown) {
   702	      // Auto-profile is best-effort — never breaks search
   703	    }
   704	  }
   705	
   706	  // Re-run artifact routing with detected intent for fallback coverage
   707	  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
   708	    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
   709	  }
   710	
   711	  // Create retrieval trace at pipeline entry
   712	  const trace = createTrace(
   713	    effectiveQuery,
   714	    sessionId,
   715	    detectedIntent || undefined
   716	  );
   717	
   718	  // Build cache key args
   719	  const cacheArgs = buildCacheArgs({
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
   861	    }
   862	
   863	    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
   864	    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
   865	      let boostedCount = 0;
   866	      for (const r of resultsForFormatting) {
   867	        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
   868	        if (filePath && filePath.includes(folderBoost.folder)) {
   869	          const raw = (r as Record<string, unknown>);
   870	          if (typeof raw.similarity === 'number') {
   871	            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
   872	            boostedCount++;
   873	          }
   874	        }
   875	      }
   876	      // Re-sort by similarity after boosting
   877	      if (boostedCount > 0) {
   878	        resultsForFormatting.sort((a, b) => {
   879	          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
   880	          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
   881	          return sb - sa;
   882	        });
   883	      }
   884	    }
   885	
   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
   887	      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
   888	      if (activeGoal) {
   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
   890	      }
   891	      if (Array.isArray(anchors) && anchors.length > 0) {
   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
   893	      }
   894	
   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
   896	      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
   897	      goalRefinementPayload = {
   898	        activeGoal: goalRefinement.metadata.activeGoal,
   899	        applied: goalRefinement.metadata.refined,
   900	        boostedCount: goalRefinement.metadata.boostedCount,
   901	      };
   902	    }
   903	
   904	    // Build extra data from pipeline metadata for response formatting
   905	    const lexicalCapability = getLastLexicalCapabilitySnapshot();
   906	    if (lexicalCapability) {
   907	      console.error(
   908	        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
   909	      );
   910	    }
   911	
   912	    const extraData: Record<string, unknown> = {
   913	      stateStats: pipelineResult.annotations.stateStats,
   914	      featureFlags: {
   915	        ...pipelineResult.annotations.featureFlags,
   916	      },
   917	      pipelineMetadata: pipelineResult.metadata,
   918	    };
   919	    if (lexicalCapability) {
   920	      extraData.lexicalPath = lexicalCapability.lexicalPath;
   921	      extraData.fallbackState = lexicalCapability.fallbackState;
   922	    }
   923	
   924	    if (pipelineResult.annotations.evidenceGapWarning) {
   925	      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
   926	    }
   927	
   928	    if (detectedIntent) {
   929	      extraData.intent = {
   930	        type: detectedIntent,
   931	        confidence: intentConfidence,
   932	        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
   933	        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
   934	      };
   935	    }
   936	
   937	    if (artifactRouting) {
   938	      extraData.artifactRouting = artifactRouting;
   939	      extraData.artifact_routing = artifactRouting;
   940	    }
   941	
   942	    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
   943	      extraData.feedbackSignals = { applied: true };
   944	      extraData.feedback_signals = { applied: true };
   945	    }
   946	
   947	    if (pipelineResult.metadata.stage2.graphContribution) {
   948	      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
   949	      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
   950	    }
   951	
   952	    if (pipelineResult.metadata.stage3.rerankApplied) {
   953	      extraData.rerankMetadata = {
   954	        reranking_enabled: true,
   955	        reranking_requested: true,
   956	        reranking_applied: true,
   957	      };
   958	    }
   959	
   960	    if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
   961	      extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   962	      extraData.chunk_reassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   963	    }
   964	
   965	    if (pipelineResult.trace) {
   966	      extraData.retrievalTrace = pipelineResult.trace;
   967	    }
   968	    try {
   969	      const adaptiveShadow = buildAdaptiveShadowProposal(
   970	        requireDb(),
   971	        effectiveQuery,
   972	        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
   973	      );
   974	      if (adaptiveShadow) {
   975	        extraData.adaptiveShadow = adaptiveShadow;
   976	        extraData.adaptive_shadow = adaptiveShadow;
   977	      }
   978	    } catch (_error: unknown) {
   979	      // Adaptive proposal logging is best-effort only
   980	    }
   981	
   982	    _evalChannelPayloads = buildEvalChannelPayloads(resultsForFormatting);
   983	
   984	    const appliedBoosts: Record<string, unknown> = {
   985	      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
   986	      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
   987	    };
   988	    if (folderBoost && folderBoost.folder) {
   989	      appliedBoosts.folder = { applied: true, folder: folderBoost.folder, factor: folderBoost.factor };
   990	    }
   991	    if (communityFallbackApplied) {
   992	      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
   993	    }
   994	    extraData.appliedBoosts = appliedBoosts;
   995	    extraData.applied_boosts = appliedBoosts;
   996	
   997	    let formatted = await formatSearchResults(
   998	      resultsForFormatting as RawSearchResult[],
   999	      pipelineConfig.searchType,
  1000	      includeContent,
  1001	      anchors,
  1002	      null,
  1003	      null,
  1004	      extraData,
  1005	      includeTrace,
  1006	      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
  1007	      specFolder ?? null // REQ-D5-001: pass specFolder for recovery narrowing detection
  1008	    );
  1009	
  1010	    // Prepend evidence gap warning if present
  1011	    if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
  1012	      try {
  1013	        const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
  1014	        if (typeof parsed.summary === 'string') {
  1015	          parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
  1016	          formatted.content[0].text = JSON.stringify(parsed, null, 2);
  1017	        }
  1018	      } catch (_error: unknown) {
  1019	        // Non-fatal
  1020	      }
  1021	    }
  1022	
  1023	    if (isProgressiveDisclosureEnabled()) {
  1024	      const parsedFormatted = parseResponseEnvelope(formatted);
  1025	      if (parsedFormatted) {
  1026	        const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
  1027	          ? parsedFormatted.envelope.data as Record<string, unknown>
  1028	          : {};
  1029	        data.progressiveDisclosure = buildProgressiveResponse(
  1030	          resultsForFormatting,
  1031	          undefined,
  1032	          effectiveQuery,
  1033	          { scopeKey: progressiveScopeKey },
  1034	        );
  1035	        parsedFormatted.envelope.data = data;
  1036	        formatted = replaceResponseEnvelope(formatted, parsedFormatted.firstEntry, parsedFormatted.envelope);
  1037	      }
  1038	    }
  1039	
  1040	    formatted = applyPublicationGateToResponse(formatted);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1082,1210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts | sed -n '318,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   318	export async function handleCodeGraphQuery(args: QueryArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
   319	  let readiness: ReadyResult = {
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
   421	      content: [{
   422	        type: 'text',
   423	        text: JSON.stringify({
   424	          status: 'ok',
   425	          data: buildGraphQueryPayload({
   426	            operation,
   427	            symbolId,
   428	            edgeType: requestedEdgeType,
   429	            transitive: true,
   430	            maxDepth,
   431	            readiness,
   432	            nodes: transitive,
   433	          }, readiness, `code_graph_query ${operation} payload`),
   434	        }, null, 2),
   435	      }],
   436	    };
   437	  }
   438	
   439	  let result;
   440	  switch (operation) {
   441	    case 'calls_from': {
   442	      const edges = graphDb.queryEdgesFrom(symbolId, requestedEdgeType).slice(0, limit);
   443	      result = {
   444	        operation,
   445	        symbolId,
   446	        edgeType: requestedEdgeType,
   447	        edges: edges.map((entry) => ({
   448	          target: entry.targetNode?.fqName ?? entry.edge.targetId,
   449	          file: entry.targetNode?.filePath,
   450	          line: entry.targetNode?.startLine,
   451	          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   452	          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   453	          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
   454	          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
   455	          edgeEvidenceClass: classifyEdgeEvidenceClass(
   456	            entry.edge.edgeType,
   457	            entry.edge.metadata as Record<string, unknown> | undefined,
   458	          ),
   459	        })),
   460	        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
   461	          edges
   462	            .map((entry) => entry.targetNode?.filePath)
   463	            .filter((value): value is string => typeof value === 'string'),
   464	        ),
   465	      };
   466	      break;
   467	    }
   468	    case 'calls_to': {
   469	      const edges = graphDb.queryEdgesTo(symbolId, requestedEdgeType).slice(0, limit);
   470	      result = {
   471	        operation,
   472	        symbolId,
   473	        edgeType: requestedEdgeType,
   474	        edges: edges.map((entry) => ({
   475	          source: entry.sourceNode?.fqName ?? entry.edge.sourceId,
   476	          file: entry.sourceNode?.filePath,
   477	          line: entry.sourceNode?.startLine,
   478	          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   479	          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   480	          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
   481	          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
   482	          edgeEvidenceClass: classifyEdgeEvidenceClass(
   483	            entry.edge.edgeType,
   484	            entry.edge.metadata as Record<string, unknown> | undefined,
   485	          ),
   486	        })),
   487	        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
   488	          edges
   489	            .map((entry) => entry.sourceNode?.filePath)
   490	            .filter((value): value is string => typeof value === 'string'),
   491	        ),
   492	      };
   493	      break;
   494	    }
   495	    case 'imports_from': {
   496	      const edges = graphDb.queryEdgesFrom(symbolId, requestedEdgeType).slice(0, limit);
   497	      result = {
   498	        operation,
   499	        symbolId,
   500	        edgeType: requestedEdgeType,
   501	        edges: edges.map((entry) => ({
   502	          target: entry.targetNode?.fqName ?? entry.edge.targetId,
   503	          file: entry.targetNode?.filePath,
   504	          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   505	          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   506	          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
   507	          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
   508	          edgeEvidenceClass: classifyEdgeEvidenceClass(
   509	            entry.edge.edgeType,
   510	            entry.edge.metadata as Record<string, unknown> | undefined,
   511	          ),
   512	        })),
   513	        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
   514	          edges
   515	            .map((entry) => entry.targetNode?.filePath)
   516	            .filter((value): value is string => typeof value === 'string'),
   517	        ),
   518	      };
   519	      break;
   520	    }
   521	    case 'imports_to': {
   522	      const edges = graphDb.queryEdgesTo(symbolId, requestedEdgeType).slice(0, limit);
   523	      result = {
   524	        operation,
   525	        symbolId,
   526	        edgeType: requestedEdgeType,
   527	        edges: edges.map((entry) => ({
   528	          source: entry.sourceNode?.fqName ?? entry.edge.sourceId,
   529	          file: entry.sourceNode?.filePath,
   530	          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   531	          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
   532	          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
   533	          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
   534	          edgeEvidenceClass: classifyEdgeEvidenceClass(
   535	            entry.edge.edgeType,
   536	            entry.edge.metadata as Record<string, unknown> | undefined,
   537	          ),
   538	        })),
   539	        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
   540	          edges
   541	            .map((entry) => entry.sourceNode?.filePath)
   542	            .filter((value): value is string => typeof value === 'string'),
   543	        ),
   544	      };
   545	      break;
   546	    }
   547	    default:
   548	      return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error: `Unknown operation: ${operation}` }) }] };
   549	  }
   550	
   551	  return {
   552	    content: [{
   553	      type: 'text',
   554	        text: JSON.stringify({
   555	          status: 'ok',
   556	          data: buildGraphQueryPayload({
   557	            ...result,
   558	            readiness,
   559	          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
   560	            ? {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Context Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
     5	
     6	import { buildContext, type ContextArgs, type QueryMode } from '../../lib/code-graph/code-graph-context.js';
     7	import type { CodeGraphSeed } from '../../lib/code-graph/seed-resolver.js';
     8	import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
     9	import { getLastDetectorProvenance } from '../../lib/code-graph/code-graph-db.js';
    10	
    11	export interface ContextHandlerArgs {
    12	  input?: string;
    13	  queryMode?: string;
    14	  subject?: string;
    15	  seeds?: Array<{
    16	    filePath?: string;
    17	    startLine?: number;
    18	    endLine?: number;
    19	    query?: string;
    20	    provider?: string;
    21	    source?: string;
    22	    file?: string;
    23	    range?: { start: number; end: number };
    24	    score?: number;
    25	    snippet?: string;
    26	    symbolName?: string;
    27	    kind?: string;
    28	    nodeId?: string;
    29	    symbolId?: string;
    30	  }>;
    31	  budgetTokens?: number;
    32	  profile?: string;
    33	  includeTrace?: boolean;
    34	}
    35	
    36	interface NormalizedSeedSource {
    37	  source?: string;
    38	  filePath: string;
    39	  startLine?: number;
    40	  endLine?: number;
    41	  symbolId?: string;
    42	  symbolName?: string;
    43	}
    44	
    45	function resolveSeedSource(args: ContextHandlerArgs, anchor: {
    46	  filePath: string;
    47	  startLine: number;
    48	  endLine: number;
    49	  symbolId: string | null;
    50	  fqName: string | null;
    51	}): string | undefined {
    52	  const normalizedSeeds: NormalizedSeedSource[] = (args.seeds ?? []).map((seed) => ({
    53	    source: typeof seed.source === 'string' && seed.source.trim().length > 0
    54	      ? seed.source
    55	      : seed.provider,
    56	    filePath: seed.provider === 'cocoindex'
    57	      ? (seed.file ?? seed.filePath ?? '')
    58	      : (seed.filePath ?? seed.file ?? ''),
    59	    startLine: seed.provider === 'cocoindex' ? seed.range?.start : seed.startLine,
    60	    endLine: seed.provider === 'cocoindex' ? seed.range?.end : seed.endLine,
    61	    symbolId: seed.symbolId,
    62	    symbolName: seed.symbolName,
    63	  }));
    64	
    65	  const match = normalizedSeeds.find((seed) => {
    66	    if (seed.symbolId && anchor.symbolId) {
    67	      return seed.symbolId === anchor.symbolId;
    68	    }
    69	    if (seed.symbolName && anchor.fqName) {
    70	      return seed.symbolName === anchor.fqName || anchor.fqName.endsWith(`.${seed.symbolName}`);
    71	    }
    72	    if (seed.filePath !== anchor.filePath) {
    73	      return false;
    74	    }
    75	    if (typeof seed.startLine === 'number' && seed.startLine !== anchor.startLine) {
    76	      return false;
    77	    }
    78	    if (typeof seed.endLine === 'number' && seed.endLine !== anchor.endLine) {
    79	      return false;
    80	    }
    81	    return true;
    82	  });
    83	
    84	  return match?.source;
    85	}
    86	
    87	/** Handle code_graph_context tool call */
    88	export async function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    89	  let readiness: ReadyResult = {
    90	    freshness: 'empty' as const,
    91	    action: 'none' as const,
    92	    inlineIndexPerformed: false,
    93	    reason: 'readiness check not run',
    94	  };
    95	
    96	  try {
    97	    // Auto-trigger: ensure graph is fresh before querying
    98	    try {
    99	      readiness = await ensureCodeGraphReady(process.cwd(), {
   100	        allowInlineIndex: true,
   101	        allowInlineFullScan: false,
   102	      });
   103	    } catch {
   104	      // Non-blocking: continue with potentially stale data
   105	    }
   106	
   107	    const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
   108	      ? args.queryMode as QueryMode
   109	      : 'neighborhood');
   110	
   111	    const seeds = (args.seeds ?? []).map((seed) => {
   112	      const source = typeof seed.source === 'string' && seed.source.trim().length > 0
   113	        ? seed.source
   114	        : seed.provider;
   115	
   116	      if (seed.provider === 'cocoindex' && seed.file) {
   117	        return {
   118	          provider: 'cocoindex' as const,
   119	          file: seed.file,
   120	          range: seed.range ?? { start: seed.startLine ?? 1, end: seed.endLine ?? seed.startLine ?? 1 },
   121	          score: seed.score ?? 0,
   122	          snippet: seed.snippet,
   123	          source,
   124	        };
   125	      }
   126	
   127	      if (seed.provider === 'manual' && seed.symbolName) {
   128	        return {
   129	          provider: 'manual' as const,
   130	          symbolName: seed.symbolName,
   131	          filePath: seed.filePath,
   132	          kind: seed.kind,
   133	          source,
   134	        };
   135	      }
   136	
   137	      if (seed.provider === 'graph' && seed.symbolId) {
   138	        return {
   139	          provider: 'graph' as const,
   140	          nodeId: seed.nodeId ?? seed.symbolId,
   141	          symbolId: seed.symbolId,
   142	          source,
   143	        };
   144	      }
   145	
   146	      return {
   147	        filePath: seed.filePath ?? seed.file ?? '',
   148	        startLine: seed.startLine ?? seed.range?.start,
   149	        endLine: seed.endLine ?? seed.range?.end,
   150	        query: seed.query,
   151	        source,
   152	      };
   153	    }) as unknown as CodeGraphSeed[];
   154	
   155	    const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];
   156	
   157	    const contextArgs: ContextArgs = {
   158	      input: args.input,
   159	      queryMode,
   160	      subject: args.subject,
   161	      seeds,
   162	      budgetTokens: args.budgetTokens ?? 1200,
   163	      profile,
   164	      includeTrace: args.includeTrace,
   165	    };
   166	
   167	    const result = buildContext(contextArgs);
   168	
   169	    return {
   170	      content: [{
   171	        type: 'text',
   172	        text: JSON.stringify({
   173	          status: 'ok',
   174	          data: {
   175	            queryMode: result.queryMode,
   176	            combinedSummary: result.combinedSummary,
   177	            nextActions: result.nextActions,
   178	            readiness,
   179	            anchors: result.resolvedAnchors.map(a => ({
   180	              file: a.filePath,
   181	              line: a.startLine,
   182	              symbol: a.fqName,
   183	              resolution: a.resolution,
   184	              confidence: a.confidence,
   185	              source: resolveSeedSource(args, a),
   186	            })),
   187	            graphContext: result.graphContext,
   188	            textBrief: result.textBrief,
   189	            metadata: result.metadata,
   190	            graphMetadata: {
   191	              detectorProvenance: getLastDetectorProvenance() ?? 'unknown',
   192	            },
   193	          },
   194	        }, null, 2),
   195	      }],
   196	    };
   197	  } catch (err: unknown) {
   198	    console.error('[code-graph-context] Unexpected failure:', err);
   199	    return {
   200	      content: [{
   201	        type: 'text',
   202	        text: JSON.stringify({
   203	          status: 'error',
   204	          error: 'code_graph_context failed',
   205	        }),
   206	      }],
   207	    };
   208	  }
   209	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   181	
   182	  // Functions
   183	  getChannelSubset,
   184	  routeQuery,
   185	
   186	  // Internal helpers (exported for testing)
   187	  enforceMinimumChannels,
   188	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '600,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   600	  }
   601	
   602	  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
   603	  //
   604	  else if (searchType === 'hybrid') {
   605	    // Resolve the query embedding — either pre-computed in config or generate now
   606	    // Fix #16 — Cache this embedding for reuse in constitutional injection path
   607	    // To avoid a duplicate generateQueryEmbedding() call.
   608	    const effectiveEmbedding: Float32Array | number[] | null =
   609	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   610	    cachedEmbedding = effectiveEmbedding;
   611	
   612	    if (!effectiveEmbedding) {
   613	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
   614	    }
   615	
   616	    // Deep mode: expand query into variants and run hybrid for each, then dedup
   617	    if (mode === 'deep' && isMultiQueryEnabled()) {
   618	      // -- D2 REQ-D2-001: Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) ---
   619	      //
   620	      // When enabled and the query is multi-faceted, decompose into up to 3
   621	      // sub-query facets and run hybrid search per facet. Results are merged
   622	      // by facet coverage (items appearing in multiple facets rank higher).
   623	      //
   624	      // This block takes the place of the synonym-expansion path below when
   625	      // decomposition fires. If decomposition is disabled, not applicable, or
   626	      // fails, execution falls through to the existing expansion logic.
   627	
   628	      if (isQueryDecompositionEnabled() && isMultiFacet(query)) {
   629	        try {
   630	          const normalizedQuery = normalizeFacetText(query);
   631	          let facets: string[] = [];
   632	
   633	          try {
   634	            facets = buildQueryDecompositionPool(query, mode)
   635	              .filter((facet) => facet !== normalizedQuery)
   636	              .map(normalizeFacetText)
   637	              .filter((facet) => facet.length > 0);
   638	          } catch (facetErr: unknown) {
   639	            const facetMsg = facetErr instanceof Error ? facetErr.message : String(facetErr);
   640	            console.warn(
   641	              `[stage1-candidate-gen] D2 faceted query decomposition failed, falling back to basic decomposition: ${facetMsg}`
   642	            );
   643	          }
   644	
   645	          if (facets.length === 0) {
   646	            facets = decompose(query)
   647	              .map(normalizeFacetText)
   648	              .filter((facet) => facet.length > 0 && facet !== normalizedQuery);
   649	          }
   650	
   651	          facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
   652	
   653	          if (facets.length > 0) {
   654	            // Run hybrid for the original query plus each facet, in parallel
   655	            const allQueries = [query, ...facets];
   656	            // FIX #7: Use Promise.allSettled so one failing facet branch
   657	            // does not discard results from all other branches.
   658	            const facetSettledResults = await withTimeout(
   659	              Promise.allSettled(
   660	                allQueries.map(async (q): Promise<PipelineRow[]> => {
   661	                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
   662	                  if (!facetEmbedding) {
   663	                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
   664	                    return [];
   665	                  }
   666	                  return hybridSearch.collectRawCandidates(
   667	                    q,
   668	                    facetEmbedding,
   669	                    { limit, specFolder, includeArchived }
   670	                  ) as Promise<PipelineRow[]>;
   671	                })
   672	              ),
   673	              DECOMPOSITION_TIMEOUT_MS,
   674	              'D2 facet decomposition',
   675	            );
   676	            const facetResultSets = facetSettledResults.map((result, idx) => {
   677	              if (result.status === 'fulfilled') return result.value;
   678	              console.warn(`[stage1-candidate-gen] D2 facet branch ${idx} rejected: ${result.reason}`);
   679	              return [] as PipelineRow[];
   680	            });
   681	
   682	            channelCount = allQueries.length;
   683	            const pools = allQueries.map((q, i) => ({
   684	              query: q,
   685	              results: facetResultSets[i] ?? [],
   686	            }));
   687	            candidates = mergeFacetCoveragePools(pools);
   688	
   689	            if (trace) {
   690	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   691	                channel: 'd2-query-decomposition',
   692	                originalQuery: query,
   693	                facets,
   694	                facetCount: facets.length,
   695	              });
   696	            }
   697	
   698	            // Skip the standard deep-mode expansion path below
   699	            // (jump to post-channel processing via the else-if chain)
   700	          }
   701	        } catch (decompErr: unknown) {
   702	          const decompMsg = decompErr instanceof Error ? decompErr.message : String(decompErr);
   703	          console.warn(
   704	            `[stage1-candidate-gen] D2 query decomposition failed, falling through to expansion: ${decompMsg}`
   705	          );
   706	          // Fall through to standard deep expansion path below (candidates is empty)
   707	        }
   708	      }
   709	
   710	      // Only run existing expansion logic when decomposition did not produce results
   711	      if (candidates.length === 0) {
   712	
   713	      const queryVariants = await buildDeepQueryVariants(query);
   714	
   715	      if (queryVariants.length > 1) {
   716	        try {
   717	          // F1: Wrap parallel variant searches with latency budget.
   718	          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
   719	          // FIX #7: Use Promise.allSettled so one failing variant does not
   720	          // discard results from all other variant branches.
   721	          const variantSettledResults = await withTimeout(
   722	            Promise.allSettled(
   723	              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
   724	                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
   725	                if (!variantEmbedding) {
   726	                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
   727	                  return [];
   728	                }
   729	                const variantResults = await hybridSearch.collectRawCandidates(
   730	                  variant,
   731	                  variantEmbedding,
   732	                  { limit, specFolder, includeArchived }
   733	                );
   734	                return variantResults as PipelineRow[];
   735	              })
   736	            ),
   737	            DEEP_EXPANSION_TIMEOUT_MS,
   738	            'Deep-mode query expansion',
   739	          );
   740	          const variantResultSets: PipelineRow[][] = variantSettledResults.map((result, idx) => {
   741	            if (result.status === 'fulfilled') return result.value;
   742	            console.warn(`[stage1-candidate-gen] Deep variant branch ${idx} rejected: ${result.reason}`);
   743	            return [] as PipelineRow[];
   744	          });
   745	
   746	          channelCount = queryVariants.length;
   747	
   748	          // Merge variant results, deduplicate by id, preserve first-occurrence order
   749	          candidates = mergeCandidateBatches(
   750	            variantResultSets.map((rows, index) => ({
   751	              label: queryVariants[index] ?? `deep-variant-${index}`,
   752	              rows,
   753	            })),
   754	          );
   755	        } catch (expandErr: unknown) {
   756	          const expandMsg =
   757	            expandErr instanceof Error ? expandErr.message : String(expandErr);
   758	          console.warn(
   759	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
   760	          );
   761	          // Fall through to single hybrid search below
   762	          channelCount = 1;
   763	          candidates = (await hybridSearch.collectRawCandidates(
   764	            query,
   765	            effectiveEmbedding,
   766	            { limit, specFolder, includeArchived }
   767	          )) as PipelineRow[];
   768	        }
   769	      } else {
   770	        // ExpandQuery returned only the original; treat as standard hybrid
   771	        channelCount = 1;
   772	        candidates = (await hybridSearch.collectRawCandidates(
   773	          query,
   774	          effectiveEmbedding,
   775	          { limit, specFolder, includeArchived }
   776	        )) as PipelineRow[];
   777	      }
   778	
   779	      } // end: if (candidates.length === 0)
   780	    } else {
   781	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
   782	      //
   783	      // When R12 is enabled and R15 does not classify the query as "simple",
   784	      // We expand the query using embedding similarity to find related terms
   785	      // From the memory index. The expanded query is used as an additional
   786	      // Hybrid search channel whose results are merged with the baseline.
   787	      //
   788	      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
   789	      // The query as "simple", suppressing expansion with zero added latency.
   790	
   791	      let r12ExpansionApplied = false;
   792	
   793	      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
   794	        try {
   795	          // ExpandQueryWithEmbeddings requires a Float32Array; the effective
   796	          // Embedding may be a number[] when generated by some providers, so
   797	          // Convert if necessary before passing it in.
   798	          const expansionEmbedding: Float32Array =
   799	            effectiveEmbedding instanceof Float32Array
   800	              ? effectiveEmbedding
   801	              : Float32Array.from(effectiveEmbedding as number[]);
   802	
   803	          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
   804	            limit: DEFAULT_EXPANSION_CANDIDATE_LIMIT,
   805	          });
   806	
   807	          // Only run an extra channel if the expansion actually produced new terms
   808	          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
   809	            // Run the baseline and the expanded query in parallel
   810	            const [baselineResults, expansionResults] = await Promise.all([
   811	              hybridSearch.collectRawCandidates(
   812	                query,
   813	                effectiveEmbedding,
   814	                { limit, specFolder, includeArchived }
   815	              ).catch((err: unknown): PipelineRow[] => {
   816	                console.warn(
   817	                  '[stage1-candidate-gen] Baseline candidate collection failed:',
   818	                  err instanceof Error ? err.message : String(err)
   819	                );
   820	                return [];
   821	              }),
   822	              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
   823	                async (expandedEmb): Promise<PipelineRow[]> => {
   824	                  if (!expandedEmb) {
   825	                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
   826	                    return [];
   827	                  }
   828	                  return hybridSearch.collectRawCandidates(
   829	                    expanded.combinedQuery,
   830	                    expandedEmb,
   831	                    { limit, specFolder, includeArchived }
   832	                  ) as Promise<PipelineRow[]>;
   833	                }
   834	              ).catch((err: unknown): PipelineRow[] => {
   835	                console.warn(
   836	                  '[stage1-candidate-gen] Expansion candidate collection failed:',
   837	                  err instanceof Error ? err.message : String(err)
   838	                );
   839	                return [];
   840	              }),
   841	            ]);
   842	
   843	            channelCount = 2;
   844	            r12ExpansionApplied = true;
   845	
   846	            // Merge both result sets, deduplicate by id, baseline-first ordering
   847	            // So baseline scores dominate when the same memory appears in both.
   848	            candidates = mergeCandidateBatches([
   849	              { label: query, rows: baselineResults as PipelineRow[] },
   850	              { label: expanded.combinedQuery, rows: expansionResults as PipelineRow[] },
   851	            ]);
   852	
   853	            if (trace) {
   854	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   855	                channel: 'r12-embedding-expansion',
   856	                expandedTerms: expanded.expanded,
   857	                combinedQuery: expanded.combinedQuery,
   858	              });
   859	            }
   860	          }
   861	        } catch (r12Err: unknown) {
   862	          const r12Msg = r12Err instanceof Error ? r12Err.message : String(r12Err);
   863	          console.warn(
   864	            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
   865	          );
   866	        }
   867	      }
   868	
   869	      // Standard hybrid search — runs when R12 is off, suppressed by R15,
   870	      // Or produced no results (candidates still empty from the try block above).
   871	      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
   872	      if (!r12ExpansionApplied) {
   873	        try {
   874	          channelCount = 1;
   875	          const hybridResults = (await hybridSearch.collectRawCandidates(
   876	            effectiveQuery,
   877	            effectiveEmbedding,
   878	            { limit, specFolder, includeArchived }
   879	          )) as PipelineRow[];
   880	          candidates = hybridResults;
   881	        } catch (hybridErr: unknown) {
   882	          const hybridMsg =
   883	            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
   884	          console.warn(
   885	            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
   886	          );
   887	
   888	          // Fallback: pure vector search
   889	          channelCount = 1;
   890	          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   891	            limit,
   892	            specFolder,
   893	            tier,
   894	            contextType,
   895	            includeConstitutional: false, // Constitutional managed separately below
   896	            includeArchived,
   897	          }) as PipelineRow[];
   898	          if (isTemporalContiguityEnabled()) {
   899	            vectorResults = (
   900	              vectorSearchWithContiguity(
   901	                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   902	                3600,
   903	              ) as PipelineRow[] | null
   904	            ) ?? vectorResults;
   905	          }
   906	          candidates = vectorResults;
   907	
   908	          if (trace) {
   909	            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
   910	              reason: hybridMsg,
   911	              channel: 'vector',
   912	            });
   913	          }
   914	        }
   915	      }
   916	    }
   917	  }
   918	
   919	  // -- Channel: Vector ---------------------------------------------------------
   920	
   921	  else if (searchType === 'vector') {
   922	    const effectiveEmbedding: Float32Array | number[] | null =
   923	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   924	
   925	    if (!effectiveEmbedding) {
   926	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
   927	    }
   928	
   929	    channelCount = 1;
   930	    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '180,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '930,1095p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   930	 *   1.  Session boost      (hybrid only — working memory attention)
   931	 *   1a. Recency fusion     (all types — time-decay bonus)
   932	 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
   933	 *   2a. Co-activation      (spreading activation from top-N seeds)
   934	 *   2b. Community boost    (N2c — inject co-members)
   935	 *   2c. Graph signals      (N2a+N2b — momentum + depth)
   936	 *   3.  Testing effect     (all types, when trackAccess = true)
   937	 *   4.  Intent weights     (non-hybrid only — G2 prevention)
   938	 *   5.  Artifact routing   (all types, when routing confidence > 0)
   939	 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
   940	 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
   941	 *   8.  Anchor metadata    (annotation — no score mutation)
   942	 *   9.  Validation metadata (spec quality signals + quality scoring)
   943	 *
   944	 * @param input - Stage 2 input containing candidates and pipeline config
   945	 * @returns Stage 2 output with scored results and per-signal metadata
   946	 */
   947	export async function executeStage2(input: Stage2Input): Promise<Stage2Output> {
   948	  const { candidates, config } = input;
   949	  const start = Date.now();
   950	
   951	  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
   952	    sessionBoostApplied: 'off',
   953	    causalBoostApplied: 'off',
   954	    intentWeightsApplied: 'off',
   955	    artifactRoutingApplied: 'off',
   956	    feedbackSignalsApplied: 'off',
   957	    graphContribution: {
   958	      killSwitchActive: !isGraphUnifiedEnabled(),
   959	      causalBoosted: 0,
   960	      coActivationBoosted: 0,
   961	      communityInjected: 0,
   962	      graphSignalsBoosted: 0,
   963	      totalGraphInjected: 0,
   964	      rolloutState: resolveGraphWalkRolloutState(),
   965	    },
   966	    qualityFiltered: 0,
   967	    durationMs: 0,
   968	  };
   969	
   970	  // FIX #3: Deep clone candidates so in-place mutations (e.g., syncScoreAliasesInPlace)
   971	  // cannot corrupt the original Stage 1 output. A shallow copy ([...candidates]) shares
   972	  // the same row objects, creating a race condition if the orchestrator's timeout fallback
   973	  // uses the original Stage 1 candidates array.
   974	  let results: PipelineRow[] = candidates.map(row => ({ ...row }));
   975	  const isHybrid = config.searchType === 'hybrid';
   976	
   977	  // -- 1. Session boost --
   978	  // Only for hybrid search type — session attention signals are most meaningful
   979	  // When the full hybrid result set is available for ordering.
   980	  if (isHybrid && config.enableSessionBoost && config.sessionId) {
   981	    try {
   982	      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
   983	        results,
   984	        config.sessionId
   985	      );
   986	      results = boosted as PipelineRow[];
   987	      // FIX #4: Sync aliases immediately after session boost score mutations
   988	      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
   989	      syncScoreAliasesInPlace(results);
   990	      metadata.sessionBoostApplied = sbMeta.applied ? 'applied' : 'enabled';
   991	    } catch (err: unknown) {
   992	      const message = err instanceof Error ? err.message : String(err);
   993	      console.warn(`[stage2-fusion] session boost failed: ${message}`);
   994	      metadata.sessionBoostApplied = 'failed';
   995	    }
   996	  }
   997	
   998	  // -- 1a. Recency fusion --
   999	  // Applies a time-decay bonus to each candidate based on its created_at timestamp.
  1000	  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
  1001	  // Bonus is capped at RECENCY_FUSION_CAP and clamped to keep score in [0, 1].
  1002	  try {
  1003	    let recencyBoostedCount = 0;
  1004	    results = results.map((row) => {
  1005	      const recencyTimestamp = (row.created_at as string | undefined) ?? '';
  1006	      const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
  1007	      if (!recencyTimestamp) return row;
  1008	
  1009	      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
  1010	      const bonus = Math.min(RECENCY_FUSION_CAP, recencyScore * RECENCY_FUSION_WEIGHT);
  1011	      if (bonus <= 0) return row;
  1012	
  1013	      const baseScore = resolveBaseScore(row);
  1014	      const boostedScore = Math.min(1.0, baseScore + bonus);
  1015	      if (boostedScore === baseScore) return row;
  1016	
  1017	      recencyBoostedCount++;
  1018	      return withSyncedScoreAliases(row, boostedScore);
  1019	    });
  1020	    if (recencyBoostedCount > 0) {
  1021	      syncScoreAliasesInPlace(results);
  1022	      (metadata as Record<string, unknown>).recencyFusionApplied = true;
  1023	      (metadata as Record<string, unknown>).recencyFusionBoosted = recencyBoostedCount;
  1024	    }
  1025	  } catch (err: unknown) {
  1026	    const message = err instanceof Error ? err.message : String(err);
  1027	    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
  1028	  }
  1029	
  1030	  // -- 2. Causal boost --
  1031	  // Only for hybrid search type — causal graph traversal is seeded from the
  1032	  // Top results after session boost has re-ordered them.
  1033	  if (isHybrid && config.enableCausalBoost && isGraphUnifiedEnabled()) {
  1034	    try {
  1035	      const beforeScores = new Map(results.map((row) => [row.id, resolveBaseScore(row)]));
  1036	      const { results: boosted, metadata: cbMeta } = causalBoost.applyCausalBoost(results);
  1037	      results = (boosted as PipelineRow[]).map((row) => {
  1038	        const previous = beforeScores.get(row.id) ?? resolveBaseScore(row);
  1039	        const next = resolveBaseScore(row);
  1040	        return next !== previous
  1041	          ? withGraphContribution(row, 'causalDelta', next - previous, 'causal', row.injectedByCausalBoost === true)
  1042	          : row;
  1043	      });
  1044	      // FIX #4: Sync aliases immediately after causal boost score mutations.
  1045	      syncScoreAliasesInPlace(results);
  1046	      metadata.causalBoostApplied = cbMeta.applied ? 'applied' : 'enabled';
  1047	    } catch (err: unknown) {
  1048	      const message = err instanceof Error ? err.message : String(err);
  1049	      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
  1050	      metadata.causalBoostApplied = 'failed';
  1051	    }
  1052	  }
  1053	
  1054	  // -- 2a. Co-activation spreading --
  1055	  // Gated behind SPECKIT_COACTIVATION flag. Takes the top-N results as seeds,
  1056	  // Performs spreading activation traversal, and boosts scores of results that
  1057	  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
  1058	  if (isCoActivationEnabled() && isGraphUnifiedEnabled()) {
  1059	    try {
  1060	      const topIds = results
  1061	        .slice(0, SPREAD_ACTIVATION_TOP_N)
  1062	        .map(r => r.id)
  1063	        .filter((id): id is number => typeof id === 'number');
  1064	
  1065	      if (topIds.length > 0) {
  1066	        const spreadResults: SpreadResult[] = spreadActivation(topIds);
  1067	        if (spreadResults.length > 0) {
  1068	          const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
  1069	          const relatedCounts = getRelatedMemoryCounts([...new Set(spreadResults.map((result) => result.id))]);
  1070	          results = results.map((row) => {
  1071	            const boost = spreadMap.get(row.id);
  1072	            if (boost !== undefined) {
  1073	              const baseScore = resolveBaseScore(row);
  1074	              // R17 fan-effect divisor: dampen hub nodes proportionally to their
  1075	              // fan-out degree so no single hub dominates the top-N results.
  1076	              // Uses the same sqrt scaling as co-activation.ts boostScore().
  1077	              const relatedCount = typeof row.id === 'number' ? (relatedCounts.get(row.id) ?? 0) : 0;
  1078	              const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
  1079	              const updated = withSyncedScoreAliases(row, baseScore + (boost * resolveCoActivationBoostFactor()) / fanDivisor);
  1080	              return withGraphContribution(updated, 'coActivationDelta', resolveBaseScore(updated) - baseScore, 'co-activation');
  1081	            }
  1082	            return row;
  1083	          });
  1084	          // Re-sort after co-activation boost to ensure boosted results
  1085	          // Are promoted to their correct position in the ranking
  1086	          results = sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
  1087	          (metadata as Record<string, unknown>).coActivationApplied = true;
  1088	        }
  1089	      }
  1090	    } catch (err: unknown) {
  1091	      // Non-critical enrichment — co-activation failure does not affect core ranking
  1092	      const message = err instanceof Error ? err.message : String(err);
  1093	      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
  1094	    }
  1095	  }

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

2026-04-10T19:51:01.553362Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 67
codex
I’ve got the main retrieval mechanics mapped now. One more pass is on the exact tradeoff surface: where Mex does bounded file discovery and targeted repair context, versus where our stack does actual ranked retrieval, session-aware recall, and graph expansion.
exec
/bin/zsh -lc 'rg -n "triggers|ROUTER|patterns/INDEX|context/|AGENTS.md|sync brief|buildPrompt|buildCombinedBrief|buildFileContext" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md:3:description: Always-loaded project anchor. Read this first. Contains project identity, non-negotiables, commands, and pointer to ROUTER.md for full context.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md:38:After every task: if no pattern exists for the task type you just completed, create one. If a pattern or context file is now out of date, update it. The scaffold grows from real work, not just setup. See the GROW step in `ROUTER.md` for details.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md:41:At the start of every session, read `ROUTER.md` before doing anything else.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:17:  return buildPrompt(brief);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:33:function buildPrompt(brief: ScannerBrief): string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:43:1. context/architecture.md — system components, data flow, integrations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:44:2. context/stack.md — technologies, versions, key libraries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:45:3. context/conventions.md — code patterns, naming, file organization
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:46:4. context/decisions.md — architectural choices and their rationale
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:47:5. context/setup.md — how to set up and run the project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:48:6. ROUTER.md — update the "Current Project State" section
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md:35:First, read all files in context/ to understand the current scaffold state.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md:39:For each context/ file:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md:48:  Edit individual fields only. The edges, triggers, name, and description fields must
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md:51:- In context/decisions.md: NEVER delete existing decisions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md:56:- After updating each file, update ROUTER.md Current Project State
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:5:  - target: context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:7:  - target: context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:9:  - target: context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:11:  - target: context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:13:  - target: context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:15:  - target: patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:22:If you haven't already read `AGENTS.md`, read it now — it contains the project identity, non-negotiables, and commands.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:45:Load the relevant file based on the current task. Always load `context/architecture.md` first if not already in context this session.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:49:| Understanding how the system works | `context/architecture.md` |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:50:| Working with a specific technology | `context/stack.md` |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:51:| Writing or reviewing code | `context/conventions.md` |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:52:| Making a design decision | `context/decisions.md` |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:53:| Setting up or running the project | `context/setup.md` |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:54:| Any specific task | Check `patterns/INDEX.md` for a matching pattern |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:60:1. **CONTEXT** — Load the relevant context file(s) from the routing table above. Check `patterns/INDEX.md` for a matching pattern. If one exists, follow it. Narrate what you load: "Loading architecture context..."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:62:3. **VERIFY** — Load `context/conventions.md` and run the Verify Checklist item by item. State each item and whether the output passes. Do not summarise — enumerate explicitly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:63:4. **DEBUG** — If verification fails or something breaks, check `patterns/INDEX.md` for a debug pattern. Follow it. Fix the issue and re-run VERIFY.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:65:   - If no pattern exists for this task type, create one in `patterns/` using the format in `patterns/README.md`. Add it to `patterns/INDEX.md`. Flag it: "Created `patterns/<name>.md` from this session."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md:67:   - If any `context/` file is now out of date because of this work, update it surgically — do not rewrite entire files.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:3:This file contains the prompts to populate the scaffold. It is NOT the dev environment setup — for that, see `context/setup.md` after population.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:42:1. ROUTER.md — understand the scaffold structure
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:43:2. context/architecture.md — read the annotation comments to understand what belongs there
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:44:3. context/stack.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:45:4. context/conventions.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:46:5. context/decisions.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:47:6. context/setup.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:57:Populate each context/ file by replacing the annotation comments
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:68:If yes, create additional domain-specific context files in context/.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:69:Examples: a project with a complex auth system gets context/auth.md.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:70:A data pipeline gets context/ingestion.md. A project with Stripe gets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:71:context/payments.md. Use the same YAML frontmatter format (name,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:72:description, triggers, edges, last_updated). Only create these for
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:76:After populating context/ files, update ROUTER.md:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:80:Update AGENTS.md:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:102:After generating patterns, update patterns/INDEX.md with a row for each
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:108:Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:114:- Every context/ file should have at least 2 edges
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:117:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:143:1. ROUTER.md — understand the scaffold structure
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:144:2. All files in context/ — read the annotation comments in each
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:157:After I answer, populate the context/ files based on my answers.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:164:in context/. Examples: a project with a complex auth system gets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:165:context/auth.md. A data pipeline gets context/ingestion.md. A project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:166:with Stripe gets context/payments.md. Use the same YAML frontmatter
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:167:format (name, description, triggers, edges, last_updated). Only create
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:173:Update ROUTER.md current state to reflect that this is a new project.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:175:Update AGENTS.md with the project name, description, non-negotiables, and commands.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:188:After generating patterns, update patterns/INDEX.md with a row for each
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:193:Re-read every file you just wrote (context/ files, pattern files, ROUTER.md).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:199:- Every context/ file should have at least 2 edges
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:202:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md:214:"Read `.mex/ROUTER.md` and tell me what you now know about this project."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:6:import { buildSyncBrief, buildCombinedBrief } from "./brief-builder.js";
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:102:      const brief = await buildCombinedBrief(targets, config.projectRoot);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:138:      const brief = await buildCombinedBrief(targets, config.projectRoot);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:148:    const brief = await buildCombinedBrief(targets, config.projectRoot);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:8:export async function buildCombinedBrief(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:68:  const fileContext = buildFileContext(target, projectRoot);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:100:function buildFileContext(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:7: * then look for scaffold root (.mex/ or context/ directory).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:23:  if (existsSync(mexDir) && !existsSync(resolve(mexDir, "ROUTER.md"))) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:60:  // Fall back to context/ directory (current mex layout)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:7:**During setup:** After the context/ files are populated, the agent generates starter patterns based on the project's actual stack, architecture, and conventions. These are stack-specific — a Flask API project gets different patterns than a React SPA or a CLI tool.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:22:- The exact same guidance is already in `context/conventions.md` with concrete examples
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:35:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:38:  - target: "[related file path, e.g. context/conventions.md]"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:61:- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:62:- [ ] Update any `.mex/context/` files that are now out of date
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:75:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:105:- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:106:- [ ] Update any `.mex/context/` files that are now out of date
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:132:Derive from: `context/architecture.md` (what are the major components?) and
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:133:`context/conventions.md` (what patterns exist for extending them?)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:146:Every entry in `context/stack.md` "Key Libraries" or `context/architecture.md`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md:167:Only generate if `context/setup.md` reveals non-trivial deployment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:24:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:27:  - target: "context/conventions.md"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:50:- [ ] Update \`ROUTER.md\` "Current Project State" if what's working/not built has changed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:51:- [ ] Update any \`context/\` files that are now out of date
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:66:  console.log(chalk.dim(`  Added entry to patterns/INDEX.md`));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:67:  console.log(chalk.yellow(`! Remember to edit patterns/INDEX.md and replace [description] with a real use case.`));
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md:4:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md:11:  - target: context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md:13:  - target: context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md:4:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md:11:  - target: context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md:13:  - target: context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md:4:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md:12:  - target: context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md:14:  - target: context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md:55:<!-- The commands used daily. Already in AGENTS.md but repeated here with more detail.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md:4:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md:11:  - target: context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md:13:  - target: context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:76:    "context/*.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:78:    "ROUTER.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:79:    "AGENTS.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md:4:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md:12:  - target: context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:29:  "ROUTER.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:30:  "AGENTS.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:33:  "context/architecture.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:34:  "context/stack.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:35:  "context/conventions.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:36:  "context/decisions.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:37:  "context/setup.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:39:  "patterns/INDEX.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:48:  "6": { src: ".tool-configs/CLAUDE.md", dest: "AGENTS.md" },  // Codex reads AGENTS.md at root
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:276:  const agentsMd = resolve(mexDir, "AGENTS.md");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:373:      info("Skipped tool config — AGENTS.md in .mex/ works with any tool that can read files");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:451:  console.log('    "Read .mex/ROUTER.md and tell me what you know about this project."');
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:30:After generating patterns, update .mex/patterns/INDEX.md with a row for each
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:36:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:42:- Every context/ file should have at least 2 edges
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:45:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:57:Populate each .mex/context/ file by replacing the annotation comments
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:68:If yes, create additional domain-specific context files in .mex/context/.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:69:Examples: a project with a complex auth system gets .mex/context/auth.md.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:70:A data pipeline gets .mex/context/ingestion.md. A project with Stripe gets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:71:.mex/context/payments.md. Use the same YAML frontmatter format (name,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:72:description, triggers, edges, last_updated). Only create these for
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:76:After populating .mex/context/ files, update .mex/ROUTER.md:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:80:Update .mex/AGENTS.md:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:88:1. .mex/ROUTER.md — understand the scaffold structure
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:89:2. All files in .mex/context/ — read the annotation comments in each
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:102:After I answer, populate the .mex/context/ files based on my answers.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:109:in .mex/context/. Examples: a project with a complex auth system gets
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:110:.mex/context/auth.md. A data pipeline gets .mex/context/ingestion.md.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:111:A project with Stripe gets .mex/context/payments.md. Use the same YAML
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:112:frontmatter format (name, description, triggers, edges, last_updated).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:118:Update .mex/ROUTER.md current state to reflect that this is a new project.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:120:Update .mex/AGENTS.md with the project name, description, non-negotiables, and commands.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:133:After generating patterns, update .mex/patterns/INDEX.md with a row for each
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:138:Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:144:- Every context/ file should have at least 2 edges
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:147:- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:158:1. .mex/ROUTER.md — understand the scaffold structure
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:159:2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:160:3. .mex/context/stack.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:161:4. .mex/context/conventions.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:162:5. .mex/context/decisions.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:163:6. .mex/context/setup.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:184:1. .mex/ROUTER.md — understand the scaffold structure
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:185:2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:186:3. .mex/context/stack.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:187:4. .mex/context/conventions.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:188:5. .mex/context/decisions.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:189:6. .mex/context/setup.md — same
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:6:/** Cross-reference patterns/INDEX.md with actual pattern files */
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:47:        file: "patterns/INDEX.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts:61:        file: "patterns/INDEX.md",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts:45:  // Try scaffold root (e.g. context/architecture.md when scaffold is in .mex/)

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "trigger" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:24:triggers:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:25:  - "[keyword that should trigger loading this file]"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts:51:  /** The claim that triggered this issue, if any */
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:72:description, triggers, edges, last_updated). Only create these for
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts:112:frontmatter format (name, description, triggers, edges, last_updated).

codex
One useful contrast surfaced cleanly: Mex stores `triggers:` in templates, but I’m not finding a runtime trigger-matching path in `src/`; in our stack that capability is explicit and stateful. I’m pulling the last bridge piece now, which is our CocoIndex-to-code-graph seed handoff, because that’s the sharpest retrieval capability gap between the two systems.
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Context
     3	// ───────────────────────────────────────────────────────────────
     4	// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
     5	// Provides the code_graph_context MCP tool implementation.
     6	
     7	import { performance } from 'node:perf_hooks';
     8	import * as graphDb from './code-graph-db.js';
     9	import { resolveSeeds, type CodeGraphSeed, type ArtifactRef } from './seed-resolver.js';
    10	
    11	export type QueryMode = 'neighborhood' | 'outline' | 'impact';
    12	
    13	export interface ContextArgs {
    14	  input?: string;
    15	  queryMode?: QueryMode;
    16	  subject?: string;
    17	  seeds?: CodeGraphSeed[];
    18	  budgetTokens?: number;
    19	  deadlineMs?: number;
    20	  profile?: 'quick' | 'research' | 'debug';
    21	  includeTrace?: boolean;
    22	}
    23	
    24	export interface ContextResult {
    25	  queryMode: QueryMode;
    26	  resolvedAnchors: ArtifactRef[];
    27	  graphContext: GraphContextSection[];
    28	  textBrief: string;
    29	  combinedSummary: string;
    30	  nextActions: string[];
    31	  metadata: {
    32	    totalNodes: number;
    33	    totalEdges: number;
    34	    budgetUsed: number;
    35	    budgetLimit: number;
    36	    freshness: { lastScanAt: string | null; staleness: 'fresh' | 'recent' | 'stale' | 'unknown' };
    37	  };
    38	}
    39	
    40	interface GraphContextSection {
    41	  anchor: string;
    42	  nodes: { name: string; kind: string; file: string; line: number }[];
    43	  edges: { from: string; to: string; type: string }[];
    44	}
    45	
    46	/** Build context from resolved anchors using specified query mode */
    47	export function buildContext(args: ContextArgs): ContextResult {
    48	  const queryMode = args.queryMode ?? 'neighborhood';
    49	  const budgetTokens = args.budgetTokens ?? 1200;
    50	  const seeds = args.seeds ?? [];
    51	  const resolvedAnchors = resolveSeeds(seeds);
    52	
    53	  // If no seeds but subject given, create seed from subject
    54	  if (resolvedAnchors.length === 0 && args.subject) {
    55	    const subjectRef = resolveSubjectToRef(args.subject);
    56	    if (subjectRef) resolvedAnchors.push(subjectRef);
    57	  }
    58	
    59	  // Empty seeds + no subject → outline mode fallback
    60	  if (resolvedAnchors.length === 0) {
    61	    return buildEmptyFallback(queryMode, budgetTokens);
    62	  }
    63	
    64	  const sections: GraphContextSection[] = [];
    65	  let totalNodes = 0;
    66	  let totalEdges = 0;
    67	
    68	  // Profile-based limits
    69	  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;
    70	
    71	  const contextStart = performance.now();
    72	
    73	  for (const anchor of resolvedAnchors) {
    74	    // Deadline check: stop processing further anchors if over budget
    75	    if (args.deadlineMs && performance.now() - contextStart > args.deadlineMs) {
    76	      break;
    77	    }
    78	
    79	    if (!anchor.symbolId) {
    80	      // File anchor — get outline
    81	      const outlineNodes = graphDb.queryOutline(anchor.filePath).slice(0, nodeLimit);
    82	      sections.push({
    83	        anchor: `${anchor.filePath}:${anchor.startLine}`,
    84	        nodes: outlineNodes.map(n => ({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine })),
    85	        edges: [],
    86	      });
    87	      totalNodes += outlineNodes.length;
    88	      continue;
    89	    }
    90	
    91	    const section = expandAnchor(anchor, queryMode, args.deadlineMs ? args.deadlineMs - (performance.now() - contextStart) : undefined);
    92	    sections.push(section);
    93	    totalNodes += section.nodes.length;
    94	    totalEdges += section.edges.length;
    95	  }
    96	
    97	  const textBrief = formatTextBrief(sections, budgetTokens, resolvedAnchors);
    98	  const combinedSummary = buildCombinedSummary(resolvedAnchors, sections);
    99	  const nextActions = suggestNextActions(resolvedAnchors, sections, queryMode);
   100	  const freshness = computeFreshness();
   101	
   102	  return {
   103	    queryMode,
   104	    resolvedAnchors,
   105	    graphContext: sections,
   106	    textBrief,
   107	    combinedSummary,
   108	    nextActions,
   109	    metadata: {
   110	      totalNodes,
   111	      totalEdges,
   112	      budgetUsed: Math.ceil(textBrief.length / 4),
   113	      budgetLimit: budgetTokens,
   114	      freshness,
   115	    },
   116	  };
   117	}
   118	
   119	/** Build fallback result when no seeds/subject resolve */
   120	function buildEmptyFallback(queryMode: QueryMode, budgetTokens: number): ContextResult {
   121	  return {
   122	    queryMode,
   123	    resolvedAnchors: [],
   124	    graphContext: [],
   125	    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
   126	    combinedSummary: 'Empty context — no seeds or subject resolved to graph nodes.',
   127	    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
   128	    metadata: { totalNodes: 0, totalEdges: 0, budgetUsed: 0, budgetLimit: budgetTokens, freshness: computeFreshness() },
   129	  };
   130	}
   131	
   132	/** Generate a one-line summary of the resolved context */
   133	function buildCombinedSummary(anchors: ArtifactRef[], sections: GraphContextSection[]): string {
   134	  if (anchors.length === 0) return 'No anchors resolved.';
   135	  const totalNodes = sections.reduce((sum, s) => sum + s.nodes.length, 0);
   136	  const totalEdges = sections.reduce((sum, s) => sum + s.edges.length, 0);
   137	  const files = new Set(anchors.map(a => a.filePath));
   138	  const topAnchor = anchors[0];
   139	  const topName = topAnchor.fqName ?? topAnchor.filePath.split('/').pop() ?? 'unknown';
   140	  return `${anchors.length} anchor(s) across ${files.size} file(s): ${topName} + ${totalNodes} symbols, ${totalEdges} relationships`;
   141	}
   142	
   143	/** Suggest relevant follow-up operations */
   144	function suggestNextActions(anchors: ArtifactRef[], sections: GraphContextSection[], mode: QueryMode): string[] {
   145	  const actions: string[] = [];
   146	  if (mode === 'neighborhood' && sections.some(s => s.edges.length > 5)) {
   147	    actions.push('Use `queryMode: "impact"` to see who calls these symbols');
   148	  }
   149	  if (mode === 'impact') {
   150	    actions.push('Use `queryMode: "outline"` for file-level overview');
   151	  }
   152	  if (anchors.some(a => a.resolution === 'file_anchor')) {
   153	    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
   154	  }
   155	  if (sections.some(s => s.nodes.length >= 15)) {
   156	    actions.push('Narrow with `seeds[]` for more specific context');
   157	  }
   158	  actions.push('Use `mcp__cocoindex_code__search` for semantic discovery of related code');
   159	  return actions.slice(0, 4);
   160	}
   161	
   162	/** Compute freshness metadata from DB scan timestamps */
   163	function computeFreshness(): { lastScanAt: string | null; staleness: 'fresh' | 'recent' | 'stale' | 'unknown' } {
   164	  try {
   165	    const d = graphDb.getDb();
   166	    const row = d.prepare('SELECT MAX(indexed_at) as last FROM code_files').get() as { last: string | null } | undefined;
   167	    const lastScanAt = row?.last ?? null;
   168	    if (!lastScanAt) return { lastScanAt: null, staleness: 'unknown' };
   169	
   170	    const ageMs = Date.now() - new Date(lastScanAt).getTime();
   171	    const staleness = ageMs < 300_000 ? 'fresh' : ageMs < 3_600_000 ? 'recent' : 'stale';
   172	    return { lastScanAt, staleness };
   173	  } catch {
   174	    return { lastScanAt: null, staleness: 'unknown' };
   175	  }
   176	}
   177	
   178	/** Expand a single anchor into a context section */
   179	function expandAnchor(anchor: ArtifactRef, mode: QueryMode, remainingMs?: number): GraphContextSection {
   180	  const startTime = performance.now();
   181	  const budgetMs = remainingMs ?? 400; // 400ms default latency budget
   182	  const nodes: { name: string; kind: string; file: string; line: number }[] = [];
   183	  const edges: { from: string; to: string; type: string }[] = [];
   184	
   185	  if (!anchor.symbolId) {
   186	    return { anchor: anchor.filePath, nodes, edges };
   187	  }
   188	
   189	  switch (mode) {
   190	    case 'neighborhood': {
   191	      // 1-hop: CALLS + IMPORTS + CONTAINS from anchor
   192	      for (const edgeType of ['CALLS', 'IMPORTS', 'CONTAINS'] as const) {
   193	        const outgoing = graphDb.queryEdgesFrom(anchor.symbolId, edgeType);
   194	        for (const { edge, targetNode } of outgoing) {
   195	          edges.push({ from: anchor.fqName ?? anchor.symbolId, to: targetNode?.fqName ?? edge.targetId, type: edge.edgeType });
   196	          if (targetNode) {
   197	            nodes.push({ name: targetNode.fqName, kind: targetNode.kind, file: targetNode.filePath, line: targetNode.startLine });
   198	          }
   199	        }
   200	        const incoming = graphDb.queryEdgesTo(anchor.symbolId, edgeType);
   201	        for (const { edge, sourceNode } of incoming) {
   202	          edges.push({ from: sourceNode?.fqName ?? edge.sourceId, to: anchor.fqName ?? anchor.symbolId, type: edge.edgeType });
   203	          if (sourceNode) {
   204	            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
   205	          }
   206	        }
   207	      }
   208	      break;
   209	    }
   210	    case 'outline': {
   211	      const outlineNodes = graphDb.queryOutline(anchor.filePath);
   212	      for (const n of outlineNodes) {
   213	        nodes.push({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine });
   214	      }
   215	      // CONTAINS + EXPORTS from file symbols
   216	      const fileExports = graphDb.queryEdgesFrom(anchor.symbolId, 'EXPORTS');
   217	      for (const { edge, targetNode } of fileExports) {
   218	        edges.push({ from: anchor.fqName ?? anchor.symbolId, to: targetNode?.fqName ?? edge.targetId, type: 'EXPORTS' });
   219	      }
   220	      break;
   221	    }
   222	    case 'impact': {
   223	      // Reverse: who calls this? who imports this?
   224	      // Latency guard: break early if queries exceed budget (400ms default)
   225	      for (const edgeType of ['CALLS', 'IMPORTS'] as const) {
   226	        const elapsed = performance.now() - startTime;
   227	        if (elapsed > budgetMs) {
   228	          console.warn(`[code-graph-context] impact query exceeded ${budgetMs}ms budget (${Math.round(elapsed)}ms elapsed), breaking early`);
   229	          break;
   230	        }
   231	        const incoming = graphDb.queryEdgesTo(anchor.symbolId, edgeType);
   232	        for (const { edge, sourceNode } of incoming) {
   233	          edges.push({ from: sourceNode?.fqName ?? edge.sourceId, to: anchor.fqName ?? anchor.symbolId, type: edge.edgeType });
   234	          if (sourceNode) {
   235	            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
   236	          }
   237	        }
   238	      }
   239	      break;
   240	    }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '973,1185p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1121	          specFolder: options.specFolder,
  1122	          intent: options.intent,
  1123	        });
  1124	        if (graphResults.length > 0) {
  1125	          graphMetrics.graphHits++;
  1126	          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
  1127	            ...r,
  1128	            id: r.id as number | string,
  1129	          })), weight: 0.5 });
  1130	        }
  1131	      } catch (_err: unknown) {
  1132	        // Non-critical — graph channel failure does not block pipeline
  1133	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1134	      }
  1135	    }
  1136	
  1137	    // Degree channel re-ranks based on causal-edge connectivity.
  1138	    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
  1139	    // Degree channel — also gated by query-complexity routing
  1140	    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
  1141	      try {
  1142	        // Collect all numeric IDs from existing channels
  1143	        const allResultIds = new Set<number>();
  1144	        for (const list of lists) {
  1145	          for (const r of list.results) {
  1146	            const id = r.id;
  1147	            if (typeof id === 'number') allResultIds.add(id);
  1148	          }
  1149	        }
  1150	
  1151	        if (allResultIds.size > 0) {
  1152	          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
  1153	
  1154	          // Build a ranked list sorted by degree score (highest first)
  1155	          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
  1156	          for (const [idStr, score] of degreeScores) {
  1157	            const numId = Number(idStr);
  1158	            if (score > 0 && !isNaN(numId)) {
  1159	              degreeItems.push({ id: numId, degreeScore: score });
  1160	            }
  1161	          }
  1162	          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);
  1163	
  1164	          if (degreeItems.length > 0) {
  1165	            lists.push({
  1166	              source: 'degree',
  1167	              results: degreeItems.map(item => ({
  1168	                id: item.id,
  1169	                degreeScore: item.degreeScore,
  1170	              })),
  1171	              weight: DEGREE_CHANNEL_WEIGHT,
  1172	            });
  1173	          }
  1174	        }
  1175	      } catch (_err: unknown) {
  1176	        // Non-critical — degree channel failure does not block pipeline
  1177	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1178	      }
  1179	    }
  1180	
  1181	    // Merge keyword results after all channels complete
  1182	    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
  1183	      ...ftsChannelResults,
  1184	      ...bm25ChannelResults,
  1185	    ];

codex
# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (memory_search, CocoIndex, code-graph).

## Findings
### Finding 1: Mex does not implement live ranked retrieval; it implements deterministic scaffold navigation
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md` lines 178-198 and 200-216; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md` lines 43-68; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts` lines 88-161
- **What it does**: Mex tells the agent to read `AGENTS.md`, then `ROUTER.md`, then load fixed `context/*.md` or `patterns/INDEX.md` by task type. The CLI exposes `check`, `sync`, `init`, `pattern`, `watch`, and `commands`, but no queryable retrieval/search command over scaffold knowledge.
- **Why it matters for us**: this is not equivalent to `memory_search`, `memory_context`, CocoIndex, or code-graph. Mex retrieval is a navigation protocol over markdown files, not a scored recall system. Replacing our retrieval stack with this would be a capability downgrade.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mex’s strongest bootstrap retrieval idea is the bounded scanner brief, but it is shallow and heuristic
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts` lines 20-51; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts` lines 12-45 and 48-88; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts` lines 35-61; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts` lines 31-68 and 78-98; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts` lines 5-76; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts` lines 4-24; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts` lines 196-205
- **What it does**: `mex init` builds a compact brief from manifest metadata, guessed entry points, top-level folder categories, tooling detection, and a truncated README, then explicitly tells the AI not to explore the filesystem and to reason from the brief.
- **Why it matters for us**: this is useful as a low-token pre-brief for scaffold/doc generation, but it is not semantic retrieval. It misses deep symbol relationships, intent-based ranking, and any session-aware recall. The non-`package.json` manifest parsers are also stubs.
- **Recommendation**: prototype later
- **Impact**: medium

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


hook: Stop
hook: Stop Completed
tokens used
157,140
# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (memory_search, CocoIndex, code-graph).

## Findings
### Finding 1: Mex does not implement live ranked retrieval; it implements deterministic scaffold navigation
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md` lines 178-198 and 200-216; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md` lines 43-68; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts` lines 88-161
- **What it does**: Mex tells the agent to read `AGENTS.md`, then `ROUTER.md`, then load fixed `context/*.md` or `patterns/INDEX.md` by task type. The CLI exposes `check`, `sync`, `init`, `pattern`, `watch`, and `commands`, but no queryable retrieval/search command over scaffold knowledge.
- **Why it matters for us**: this is not equivalent to `memory_search`, `memory_context`, CocoIndex, or code-graph. Mex retrieval is a navigation protocol over markdown files, not a scored recall system. Replacing our retrieval stack with this would be a capability downgrade.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mex’s strongest bootstrap retrieval idea is the bounded scanner brief, but it is shallow and heuristic
- **Source**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts` lines 20-51; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts` lines 12-45 and 48-88; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts` lines 35-61; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts` lines 31-68 and 78-98; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts` lines 5-76; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts` lines 4-24; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts` lines 196-205
- **What it does**: `mex init` builds a compact brief from manifest metadata, guessed entry points, top-level folder categories, tooling detection, and a truncated README, then explicitly tells the AI not to explore the filesystem and to reason from the brief.
- **Why it matters for us**: this is useful as a low-token pre-brief for scaffold/doc generation, but it is not semantic retrieval. It misses deep symbol relationships, intent-based ranking, and any session-aware recall. The non-`package.json` manifest parsers are also stubs.
- **Recommendation**: prototype later
- **Impact**: medium

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
