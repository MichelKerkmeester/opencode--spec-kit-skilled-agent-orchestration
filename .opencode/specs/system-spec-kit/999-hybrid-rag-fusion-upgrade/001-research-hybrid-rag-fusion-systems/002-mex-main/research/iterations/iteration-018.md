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
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

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
I’m treating this as a read-only deep research pass over the external Mex source and our corresponding Spec Kit surfaces, with the goal of stress-testing the previously recommended patterns from a risk angle. I’ll validate the phase folder, trace the relevant implementations in source, and then synthesize what could go wrong if we adopt each pattern.
Deep research iteration focused on adoption risks for previously recommended Mex patterns versus current Spec Kit Memory capabilities.
  → Load lightweight prior memory context and relevant skill instructions
  • Validate phase folder and inspect targeted Mex source files plus matching Spec Kit files
  • Assess adoption risks for each candidate pattern and map likely failure modes
  • Deliver iteration report in the requested format with exact file references
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
/bin/zsh -lc 'rg -n "mex|drift|staleness|command parity|repair brief|002-mex-main|hybrid-rag-fusion" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
218:## Task 1: Verify/fix sk-code-opencode drift on 87 in-scope TS files, outcome partial (halted after required suite failures)
226:- git diff --name-only HEAD~10 HEAD | grep -E '\\.(ts|tsx|mts)$' | sort -u, 87 files, verify_alignment_drift.py, TS-MODULE-HEADER publication-gate.ts replay-harness.ts, style-only stop rule, revert on failing required suites
230:- when user scope is “every TypeScript file changed in HEAD~10..HEAD,” regenerate the exact scope with `git diff --name-only HEAD~10 HEAD | grep -E '\\.(ts|tsx|mts)$' | sort -u`; if file count/location drifts (expected 87 under system-spec-kit roots), halt before edits [Task 1]
235:- scoped verifier baseline showed 0 errors and only two in-scope warnings (`TS-MODULE-HEADER` on `publication-gate.ts` and `test/hooks/replay-harness.ts`); this is the operative drift set for that HEAD~10 window [Task 1]
275:- Task sheet drift note: `003/.../006-memory-duplication-reduction/tasks.md` still reflects the older research wave; treat PR-12 implementation as primary and PR-13 migration as optional only if wrapper rollout is evidence-justified [Task 2]
399:- symptom: large multi-file memory patch fails to apply cleanly; cause: generated memory snapshots drift from expected formatting; fix: use smaller per-file patches on the latest packet snapshots and revalidate after each batch [Task 5]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
685:- symptom: deep-review reducer-schema tests fail during closeout; cause: config metadata drift (`metrics` missing, `.deep-review-pause` mutability mismatch); fix: align config/docs with test schema before rerunning suites [Task 3]
686:- symptom: recommendation docs drift from requested basis; cause: docs written from partial wave context; fix: verify ledger count/`synthesis_complete` and explicitly tie recommendations to the full 90-iteration synthesis [Task 1]
935:scope: restoring `/spec_kit:*`, `/memory:*`, and `/create:*` command discovery when prompt links drift between workspace and global Codex prompt directories
1028:## Task 3: Fix startup DB path/provider drift and auto-repair temp-root cleanup for `spec_kit_memory`
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1169:- when packet identity drifted, user signaled to keep canonical naming and lineage truthful at the same time [Task 2]
1178:- Use Level-3 scaffold scripts for follow-on packets to reduce template drift [Task 3]
1189:- symptom: packet docs drift from deep-research conclusions; cause: spec/plan/tasks/checklist/summary edited piecemeal; fix: run a single truth-sync pass across all packet docs with explicit references to `research/research.md` [Task 5]
1358:- symptom: subtle parity drift after branch split; cause: edits validated in one surface only; fix: enforce dual-surface CSS+TS token checks before editing ticket outputs [Task 2]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1833:- symptom: recursive validator reports template/AI-protocol/evidence warnings; cause: packet docs drifted from required structure; fix: iterate with validator until warnings/errors are zero [Task 1][Task 5]
1965:- cancelIngestJob retry, ALLOWED_BASE_PATHS startup recovery, MutationHookResult.errors, hooks-ux-feedback.vitest.ts, verify_alignment_drift.py
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2011:## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
2027:- high-signal recurring findings in this packet family included completion-claim drift, duplicate checklist IDs, metadata parent-folder drift, and unresolved `[Criteria TBD]` placeholders; keep these as explicit audit checks [Task 1]
2121:- symptom: structure refactor introduces formatting/style drift; cause: large-file manual reshaping; fix: always run targeted Prettier and ESLint on the edited screen before closeout [Task 1]

codex
I’ve loaded the prior workspace memory note and the deep-research skill entrypoint. Next I’m validating the phase folder and reading the Mex source paths that matter for the recommended patterns, especially where adoption risk comes from matcher quality, failure handling, and prompt/repair boundaries.
exec
/bin/zsh -lc "sed -n '1,120p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Task Group: 026 Batch Review Findings Remediation (002/003/008/010/013/014)
scope: remediation pass that closes active P1 findings documented in parent `review/review-report.md` without rerunning deep-review iterations
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for follow-up “fix findings” runs in 026 when the request is to patch documented review findings and verify closure across targeted packets

## Task 1: Fix all active findings from synthesized 026 review report across six phases with targeted verification, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T15-19-09-O7Hp-026_fix_batch_review_findings.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T17-19-09-019d72d3-6266-79c3-a21a-c0016dec6fcf.jsonl, updated_at=2026-04-09T17:16:36+00:00, thread_id=019d72d3-6266-79c3-a21a-c0016dec6fcf, task-local focus=close P1 findings in phases 002/003/008/010/013/014 and rerun strict/typecheck/tests)

### keywords

- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict

## User preferences

- when the user requested “Fix all findings and recommendations documented in … review-report.md from all review iterations,” treat it as a remediation pass over the documented findings only; do not start new review iterations unless explicitly asked [Task 1]

## Reusable knowledge

- packet 002 status/traceability must reflect real downstream readiness; once the 010 validator exists, document 002 as “Implemented — predecessor verified” instead of blocked to avoid traceability P1 findings [Task 1]
- packet 003 review references must point to real local review artifacts (for example `../review/003-memory-quality-issues/review-report.md`) so strict validator integrity checks pass [Task 1]
- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
- packet 014 enrichment claims must stay graph-local; remove wording that implies resume/bootstrap carriage and keep ownership with packet 011 payload validators [Task 1]
- verification pattern that closed the set: `npm run typecheck`, focused Vitest for `graph-first-routing-nudge` + `sqlite-fts` + `handler-memory-search`, then strict validate over phases 002/003/008/010/013/014 [Task 1]

## Failures and how to do differently

- symptom: strict validation fails on packet 003 with missing parent review references; cause: spec/docs pointed to non-existent review paths; fix: use explicit relative links to local review artifacts under `../review/003-memory-quality-issues/` before rerunning strict validation [Task 1]

# Task Group: 026 Batch-Phase Deep Review State Tracking, Continuations, and Iteration Extensions
scope: per-phase deep-review packet execution under `026-graph-and-context-optimization/review/` with strict write-scope boundaries, shared-state synchronization, and continuation/extension handling
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 026 batch-review runs in this checkout when asked to run, continue, or extend phase review iterations without touching runtime implementation files

## Task 1: Execute Batch C deep reviews for phases 011-014 with scoped writes and state updates, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=011-014 packet generation + aggregate state bump to 8/13)

### keywords

- batch-phase-review-state.json, 026-graph-and-context-optimization/review/<phase-slug>, deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-dashboard.md, iteration-NNN.md, review-report.md, phasesCompleted 8/13

## Task 2: Handle continuation command by validating completion state and consolidated report presence, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=resume check at 13/13 + consolidated report verification)

### keywords

- continue, phasesCompleted == totalPhases, status complete, batch-phase-review-consolidated.md, overall verdict FAIL, aggregate findings 0 P0 7 P1 0 P2

## Task 3: Extend Batch A (002-005) from 5 to 10 iterations and re-sync per-phase + batch artifacts, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-21-dEbR-batch_a_review_extensions_026_graph_context.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-21-019d729c-a473-7082-989e-7b5a71cf2227.jsonl, updated_at=2026-04-09T15:02:18+00:00, thread_id=019d729c-a473-7082-989e-7b5a71cf2227, task-local focus=iteration-006..010 extension for 002-005 + consolidated totals update)

### keywords

- extra stability passes, iteration-006..010, deep-review-state.jsonl append, deep-review-dashboard.md 10/10, deep-review-strategy.md max-iteration update, batch-phase-review-consolidated.md total iterations 83, no new findings

## Task 4: Extend Batch B (006-010) to 10 iterations and re-sync program totals to 108, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-26-Ga5w-batch_b_review_10_iteration_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-26-019d729c-b7c1-72c1-90c2-e72c0eb0d52e.jsonl, updated_at=2026-04-09T15:12:27+00:00, thread_id=019d729c-b7c1-72c1-90c2-e72c0eb0d52e, task-local focus=006-010 iteration-006..010 extension + convergence/aggregate sync)

### keywords

- batch-b, 006-010, deep-review-config.json maxIterations 10, deep-review-state.jsonl, iteration-006..010, deep-review-findings-registry.json convergenceScore 1.0, batch-phase-review-state.json, batch-phase-review-consolidated.md, total iterations 108

## User preferences

- when running 026 batch deep review, the user-required scope was explicit: writes limited to `026/review/<phase-slug>/*`, the shared state file, and optionally the consolidated report; keep review targets read-only and do not edit parent/runtime artifacts [Task 1]
- when instructions include “write consolidated report only if all 13 phases are complete,” gate report creation on `phasesCompleted == totalPhases` and otherwise emit only the batch result summary [Task 1]
- when the user replied “continue,” expected behavior was resume-aware verification (re-read state and artifacts) instead of restarting all phase reviews from scratch [Task 2]
- when operator requested “extra stability passes,” extend each targeted phase from 5 to 10 iterations before closure and sync batch-level state/report immediately [Task 3][Task 4]

## Reusable knowledge

- authoritative tracker path is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-state.json`; every phase completion should update `phasesCompleted`, `phasesRemaining`, `phaseResults`, `aggregateFindings`, and `lastUpdated` in one pass [Task 1][Task 3][Task 4]
- required per-phase packet set under `review/<phase-slug>/`: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `review-report.md` [Task 1][Task 3][Task 4]
- continuation stop rule: if state already shows `13/13 complete` and `batch-phase-review-consolidated.md` exists, do not rerun phase loops; verify report/state alignment and close [Task 2]
- extension workflow for confidence runs: add `iteration-006` through `iteration-010`, append JSONL rows, raise dashboard counters/convergence, refresh strategy + review report, then mirror new totals in batch state and consolidated report [Task 3][Task 4]
- if `batch-phase-review-state.json` is missing, initialize the full 13-phase tracker first so later batch extension runs can update `iterationsCompleted` and aggregate counts deterministically [Task 4]
- after extension passes, run a quick Python integrity check to confirm each phase packet has 10 iteration files and `deep-review-findings-registry.json` reports `convergenceScore: 1.0` before finalizing shared-state/consolidated totals [Task 4]

## Failures and how to do differently

- symptom: stale or conflicting batch totals (for example per-phase files at 10 iterations but global files still at 5); cause: extending iterations without re-syncing shared tracker/consolidated report; fix: treat `batch-phase-review-state.json` and `batch-phase-review-consolidated.md` as mandatory final sync targets after every extension pass [Task 3]
- symptom: batch extension cannot be applied cleanly because tracker metadata is absent; cause: missing `batch-phase-review-state.json`; fix: seed the tracker with the canonical 13-phase structure before per-phase review updates [Task 4]

# Task Group: 026 Packet Docs/Memory Alignment Audit and Commit-Split Discipline
scope: strict Level 1-3+ doc and memory alignment under `026-graph-and-context-optimization` with metadata-only memory fixes and packet-group commit splits
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 026 audit/alignment runs in this checkout when user asks for strict validation across packet folders without runtime code edits

## Task 1: Align Level-3 parent + research packet docs/memory with strict-clean validation, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=research group + 32 memory metadata anchor normalization)

### keywords

- 026-graph-and-context-optimization, validate.sh --strict, metadata anchor closure, canonical-docs postflight evidence blocks, 32 memory files, docs(026-research), minimum edits required

## Task 2: Align `003-memory-quality-issues` docs/memory with standalone packet commit, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-memory-quality) packet-local summary)

### keywords

- 003-memory-quality-issues, docs(026-memory-quality), packet commit split, validate.sh --strict, 9 phases 0 errors 0 warnings, metadata trailer restoration

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CODE_OF_CONDUCT.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/ROUTER.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/SYNC.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/claims.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/config.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/markdown.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/pattern.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scanner.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/scoring.test.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1399ms:

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
The phase validation command launched in an interactive session, so I’m polling its real output now before I rely on it. After that I’ll fan out across the checker implementations and matching Spec Kit handlers to isolate concrete adoption risks instead of repeating the earlier benefit summary.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I’ve confirmed the phase validator outcome and the external tree shape. I’m now reading the scaffold contract and source modules in batches so I can tie each risk to the exact implementation choices instead of to README claims alone.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in git scanner/index.ts scanner/manifest.ts sync/brief-builder.ts sync/index.ts pattern/index.ts; do echo "===== $f ====="; sed -n '"'1,260p' \".opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/"'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts; do echo "===== $f ====="; sed -n '"'1,260p' \""'$f"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== git =====
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git: No such file or directory

===== scanner/index.ts =====
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

===== scanner/manifest.ts =====
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

===== sync/brief-builder.ts =====
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

===== sync/index.ts =====
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

===== pattern/index.ts =====
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


 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts =====
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

===== .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts =====
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

===== .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts =====
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      }
      break;
    }

    if (!inFrontmatter) continue;

    if (line.startsWith(`${fieldName}:`)) {
      foundField = true;
      const inlineMatch = line.match(/:\s*\[(.+)\]/);
      if (inlineMatch) {
        return inlineMatch[1]
          .split(',')
          .map((entry) => entry.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
      continue;
    }

    if (foundField) {
      if (line.match(/^\s+-\s+/)) {
        const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
        if (value) {
          result.push(value);
        }
      } else {
        break;
      }
    }
  }

  return result;
}


===== .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts =====
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

function parseYamlMapping(raw: string): Record<string, unknown> | null {
  if (raw.trim().length === 0) {
    return null;
  }

  try {
    const parsed = loadYamlValue(raw);
    return isYamlMapping(parsed) ? parsed : null;
  } catch (_error: unknown) {
    return null;
  }
}

function validateFrontMatterSyntax(raw: string): string | null {
  try {
    const parsed = loadYamlValue(raw);
    if (parsed !== null && !isYamlMapping(parsed)) {
      return 'frontmatter root must be a YAML mapping';
    }


exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in path edges index-sync staleness command dependency cross-file script-coverage; do echo "===== $f ====="; sed -n '"'1,240p' \".opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/"'$f.ts"; echo; done' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== path =====
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

===== edges =====
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

===== index-sync =====
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

===== staleness =====
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

===== command =====
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

===== dependency =====
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

===== cross-file =====
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

===== script-coverage =====
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && sed -n '261,520p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
The first source pass is enough to see the risk contours already: Mex’s useful ideas are real, but several of them rely on deliberately shallow heuristics or optimistic success criteria. I’m tightening the evidence now with line-level checks around the high-risk areas, especially `status === null` success in sync, manifest/script coverage limits, and how much of “multi-stack” support is actually stubbed.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"reportMode|divergent_aliases|memory_health|code_graph_scan|status === 'stale'|status === 'missing'|Structural context is|certainty|payloadContract|No errors found\\. Only warnings remain|Drift score\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:197:  { pattern: /\|\s*(Knowledge|Uncertainty|Context) Score\s*\|\s*\/100\s*\|/i, label: 'empty preflight score' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:57:  payloadContract?: SharedPayloadEnvelope;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:115:  } else if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:196:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:225:  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:265:      certainty: cachedCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:274:      certainty: healthCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:283:      certainty: structuralCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:291:      certainty: nextActionsCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:295:  const payloadContract = createSharedPayloadEnvelope({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:300:      { label: 'health', certainty: healthCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:301:      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:302:      { label: 'structural', certainty: structuralCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:303:      { label: 'nextActions', certainty: nextActionsCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:317:      : structuralContext.status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:329:    payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:331:      bootstrapPayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86:const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:242:    reportMode = 'full',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:249:  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:252:      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343:  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:349:      hints.push('autoRepair is only applied in reportMode="full"');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:362:        reportMode,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:432:        reportMode,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:580:      reportMode: 'full',

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in staleness command dependency script-coverage path edges index-sync cross-file; do echo "===== $f ====="; nl -ba ".opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/$f.ts" | sed -n '"'1,220p'; echo; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== staleness =====
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

===== command =====
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

===== dependency =====
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

===== script-coverage =====
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

===== path =====
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

===== edges =====
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

===== index-sync =====
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

===== cross-file =====
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '222,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '90,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n "V13|malformed-frontmatter|blockOnWrite|blockOnIndex|ISSUES_FOUND|HIGH|MEDIUM|LOW|PSR-2|blocking" .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:23:type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14';
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:32:  blockOnWrite: boolean;
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:33:  blockOnIndex: boolean;
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:40:  blockingRuleIds: QualityRuleId[];
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:50:    blockOnWrite: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:51:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:59:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:60:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:68:    blockOnWrite: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:69:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:77:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:78:    blockOnIndex: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:86:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:87:    blockOnIndex: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:95:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:96:    blockOnIndex: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:104:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:105:    blockOnIndex: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:113:    blockOnWrite: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:114:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:122:    blockOnWrite: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:123:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:131:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:132:    blockOnIndex: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:140:    blockOnWrite: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:141:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:149:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:150:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:154:  V13: {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:155:    ruleId: 'V13',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:156:    name: 'malformed-frontmatter',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:158:    blockOnWrite: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:159:    blockOnIndex: true,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:167:    blockOnWrite: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:168:    blockOnIndex: false,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:175:  .filter((metadata) => metadata.blockOnWrite)
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:281: * is detected. The parse error is meant to be surfaced as a V13 rule failure,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:665:  return metadata.blockOnWrite && ruleAppliesToSource(metadata, source);
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:670:  return metadata.blockOnIndex && ruleAppliesToSource(metadata, source);
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:677:  const blockingRuleIds = failedRules.filter((ruleId) => shouldBlockWrite(ruleId, source));
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:678:  if (blockingRuleIds.length > 0) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:681:      blockingRuleIds,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:682:      indexBlockingRuleIds: blockingRuleIds,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:683:      softRuleIds: failedRules.filter((ruleId) => !blockingRuleIds.includes(ruleId)),
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:691:      blockingRuleIds: [],
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:699:    blockingRuleIds: [],
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:962:  // V13: Frontmatter YAML integrity and content density
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:980:    ruleId: 'V13',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:986:  // Emitted as a soft warning (blockOnWrite: false, blockOnIndex: false)
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:33:export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:34:export type ReviewStatus = 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED' | 'REJECTED' | 'REVIEWER_ERROR';
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:37:  | 'PSR-2'
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:71:  blocking?: boolean;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:139:const HIGH_GUARDRAIL_CHECKS = new Set<ReviewCheckId>(['D1', 'D2', 'D4', 'D7']);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:480:    if (issue.severity === 'HIGH') {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:485:    } else if (issue.severity === 'MEDIUM') {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:657:        severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:671:          checkId: 'PSR-2',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:672:          severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:685:          checkId: 'PSR-2',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:686:          severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:697:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:712:          severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:724:          severity: 'LOW',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:736:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:766:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:779:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:790:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:800:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:812:        severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:823:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:837:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:854:          severity: 'LOW',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:882:          severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:894:        severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:911:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:922:        severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:933:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:957:          severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:979:          severity: 'HIGH',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1002:        severity: 'MEDIUM',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1019:    const highCount = issues.filter((issue) => issue.severity === 'HIGH').length;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1020:    const mediumCount = issues.filter((issue) => issue.severity === 'MEDIUM').length;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1021:    const lowCount = issues.filter((issue) => issue.severity === 'LOW').length;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1032:    const blocking = guardrailCounts.high >= 2 || (guardrailCounts.high >= 1 && guardrailCounts.medium >= 2);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1033:    const blockerReason = blocking
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1034:      ? `Composite blocker fired (${guardrailCounts.high} HIGH, ${guardrailCounts.medium} MEDIUM guardrail findings; DUP=${guardrailCounts.dupHigh} HIGH/${guardrailCounts.dupMedium} MEDIUM)`
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1038:      status: blocking ? 'REJECTED' : 'ISSUES_FOUND',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1040:      blocking,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1063:  HIGH: -0.10,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1064:  MEDIUM: -0.05,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1065:  LOW: -0.02,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1091:    blocking: result.blocking ?? false,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1113:  const highCount = result.highCount ?? result.issues.filter((issue) => issue.severity === 'HIGH').length;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1114:  const mediumCount = result.mediumCount ?? result.issues.filter((issue) => issue.severity === 'MEDIUM').length;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1131:    console.log('The AI MUST manually patch HIGH severity fields before continuing.\n');
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1133:    console.log('MEDIUM issues should be patched when practical.\n');

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | sed -n '1016,1140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1086	    // - renderQualityScore: rendered wrapper quality after template/output validation
  1087	    // - inputCompletenessScore: input-data completeness before render
  1088	    renderQualityScore: result.renderQualityScore ?? null,
  1089	    inputCompletenessScore: result.inputCompletenessScore ?? null,
  1090	    scorePenalty,
  1091	    blocking: result.blocking ?? false,
  1092	    blockerReason: result.blockerReason,
  1093	  };
  1094	
  1095	  if (result.status === 'SKIPPED') {
  1096	    console.log(`\nPOST-SAVE QUALITY REVIEW -- SKIPPED (${result.skipReason})\n`);
  1097	    console.log(JSON.stringify(payload, null, 2));
  1098	    return;
  1099	  }
  1100	
  1101	  if (result.status === 'REVIEWER_ERROR') {
  1102	    console.log(`\nPOST-SAVE QUALITY REVIEW -- REVIEWER ERROR (${result.reviewerError || 'unknown reviewer error'})\n`);
  1103	    console.log(JSON.stringify(payload, null, 2));
  1104	    return;
  1105	  }
  1106	
  1107	  if (result.status === 'PASSED') {
  1108	    console.log('\nPOST-SAVE QUALITY REVIEW -- PASSED (0 issues)\n');
  1109	    console.log(JSON.stringify(payload, null, 2));
  1110	    return;
  1111	  }
  1112	
  1113	  const highCount = result.highCount ?? result.issues.filter((issue) => issue.severity === 'HIGH').length;
  1114	  const mediumCount = result.mediumCount ?? result.issues.filter((issue) => issue.severity === 'MEDIUM').length;
  1115	
  1116	  if (result.status === 'REJECTED') {
  1117	    console.log(`\nPOST-SAVE QUALITY REVIEW -- REJECTED (${result.blockerReason})\n`);
  1118	  } else {
  1119	    console.log(`\nPOST-SAVE QUALITY REVIEW -- ${result.issues.length} issues found\n`);
  1120	  }
  1121	
  1122	  for (const issue of result.issues) {
  1123	    const checkLabel = issue.checkId ? `${issue.checkId} ` : '';
  1124	    console.log(`[${issue.severity}] ${checkLabel}${issue.field}: ${issue.message}`);
  1125	    console.log(`  Fix: ${issue.fix}\n`);
  1126	  }
  1127	
  1128	  if (result.status === 'REJECTED') {
  1129	    console.log('The save is REJECTED because the composite blocker fired.\n');
  1130	  } else if (highCount > 0) {
  1131	    console.log('The AI MUST manually patch HIGH severity fields before continuing.\n');
  1132	  } else if (mediumCount > 0) {
  1133	    console.log('MEDIUM issues should be patched when practical.\n');
  1134	  }
  1135	
  1136	  console.log(JSON.stringify(payload, null, 2));
  1137	}

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '148,170p;962,990p;672,704p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   672	
   673	function determineValidationDisposition(
   674	  failedRules: readonly QualityRuleId[],
   675	  source?: DataSource | string | null,
   676	): ValidationDispositionResult {
   677	  const blockingRuleIds = failedRules.filter((ruleId) => shouldBlockWrite(ruleId, source));
   678	  if (blockingRuleIds.length > 0) {
   679	    return {
   680	      disposition: 'abort_write',
   681	      blockingRuleIds,
   682	      indexBlockingRuleIds: blockingRuleIds,
   683	      softRuleIds: failedRules.filter((ruleId) => !blockingRuleIds.includes(ruleId)),
   684	    };
   685	  }
   686	
   687	  const indexBlockingRuleIds = failedRules.filter((ruleId) => shouldBlockIndex(ruleId, source));
   688	  if (indexBlockingRuleIds.length > 0) {
   689	    return {
   690	      disposition: 'write_skip_index',
   691	      blockingRuleIds: [],
   692	      indexBlockingRuleIds,
   693	      softRuleIds: failedRules.filter((ruleId) => !indexBlockingRuleIds.includes(ruleId)),
   694	    };
   695	  }
   696	
   697	  return {
   698	    disposition: 'write_and_index',
   699	    blockingRuleIds: [],
   700	    indexBlockingRuleIds: [],
   701	    softRuleIds: [...failedRules],
   702	  };
   703	}
   704	
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

codex
I’ve got the higher-signal comparison points now. One theme is consistent: Mex gets leverage from small, cheap checks, but several adoption candidates would become dangerous in Spec Kit if we copied the heuristics without also copying stricter trust, scope, and blocking semantics.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '20,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1110,1192p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- symptom: docs report stale test/playbook counts after fixes; cause: checklist/plan/summary not updated with latest command outputs; fix: update packet docs and evidence logs in the same pass as code/test changes [Task 1][Task 6][Task 7]

# Task Group: Hybrid RAG Spec Packet Maintenance and Slug/Identity Remediation
scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits

## Task 1: Rename internal references after move to `020-pre-release-remediation`

### rollout_summary_files

- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)

### keywords

- 020-pre-release-remediation, old slug sweep, rg, jq empty, current_spec

## Task 2: Rewrite merged packet identity so `012-pre-release-remediation` is canonical

### rollout_summary_files

- rollout_summaries/2026-03-26T15-56-15-x1Km-rename_012_pre_release_remediation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/26/rollout-2026-03-26T16-56-15-019d2adc-5459-7ae3-8a42-6a827d88b516.jsonl, updated_at=2026-03-26T16:52:42+00:00, thread_id=019d2adc-5459-7ae3-8a42-6a827d88b516)

### keywords

- 012-pre-release-remediation, lineage, review-report, spec.md, plan.md, checklist.md

## Task 3: Create `014-v8-p1-p2-remediation` follow-on phase for unresolved findings

### rollout_summary_files

- rollout_summaries/2026-03-26T14-27-03-elzQ-014_v8_p1_p2_remediation.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/26/rollout-2026-03-26T15-27-03-019d2a8a-a91f-7891-b893-9466ce4bec32.jsonl, updated_at=2026-03-26T15:46:04+00:00, thread_id=019d2a8a-a91f-7891-b893-9466ce4bec32)

### keywords

- create.sh --level 3, 014-v8-p1-p2-remediation, template compliance, metadata anchor

## Task 4: Close `024-codex-memory-mcp-fix` as documentation-complete and route broader runtime work to follow-on recommendations

### rollout_summary_files

- rollout_summaries/2026-03-28T09-46-45-wNy2-codex_memory_mcp_fix_closure.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T10-46-45-019d33d6-c35d-79e1-b110-527630e81272.jsonl, updated_at=2026-03-28T09:47:10+00:00, thread_id=019d33d6-c35d-79e1-b110-527630e81272)

### keywords

- 024-codex-memory-mcp-fix, Status: Complete, follow-on recommendations, T020-T032, validate.sh --no-recursive, 12. OPEN QUESTIONS, TEMPLATE_HEADERS

## Task 5: Sync `023-esm-module-compliance` docs to 20-iteration research conclusions while keeping runtime migration pending

### rollout_summary_files

- rollout_summaries/2026-03-28T08-23-42-BSOO-om_2026_03_28_023_esm_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/28/rollout-2026-03-28T09-23-42-019d338a-b98a-7992-bc8b-4f62cbfd1b6e.jsonl, updated_at=2026-03-28T10:57:23+00:00, thread_id=019d338a-b98a-7992-bc8b-4f62cbfd1b6e)

### keywords

- 023-esm-module-compliance, research/research.md, shared + mcp_server, scripts CommonJS interop, dual-build fallback-only, validate.sh --strict

## User preferences

- when recursive validation still failed, user asked to make a new numbered phase spec folder -> open follow-on packet for unresolved findings [Task 3]
- when packet identity drifted, user signaled to keep canonical naming and lineage truthful at the same time [Task 2]
- when finishing packet 024, user insisted “Make sure all tasks / checklists in spec folder are 100% complete” -> close packet docs fully but keep broader runtime work as explicit follow-on recommendations [Task 4]
- when syncing packet 023, user insisted docs must mirror completed research while “keep runtime migration pending” -> do truth-sync in packet docs without claiming implementation completion [Task 5]

## Reusable knowledge

- Slug migration sequence: enumerate old patterns, replace in one sweep, verify via `rg` + `jq empty` on touched JSON [Task 1]
- Related skill: skills/spec-folder-slug-rename-sweep/SKILL.md [Task 1]
- Canonical packet rewrite should retitle live docs to active slug and keep predecessor names in explicit historical notes [Task 2]
- Use Level-3 scaffold scripts for follow-on packets to reduce template drift [Task 3]
- For documentation-only closure packets, keep `Status: Complete` and route non-executed runtime work into clearly labeled follow-on recommendations, linked to the canonical broader packet instead of pretending completion [Task 4]
- Level-3 specs still require the literal `12. OPEN QUESTIONS` header even when content is repurposed into routing notes [Task 4]
- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
- Keep standards-doc updates deferred until runtime verification passes; strict packet validation can be green while runtime migration remains intentionally pending [Task 5]

## Failures and how to do differently

- symptom: JSON parse breaks after lineage edits; cause: trailing comma; fix: run `jq empty` immediately after list-item deletion [Task 1]
- symptom: validator flags metadata anchor/phase headers; cause: template divergence during manual edits; fix: restore template sections before content edits [Task 3]
- symptom: `TEMPLATE_HEADERS` validation fails during packet closeout; cause: missing literal `12. OPEN QUESTIONS` header; fix: restore the required heading and rerun `validate.sh --no-recursive` [Task 4]
- symptom: packet docs drift from deep-research conclusions; cause: spec/plan/tasks/checklist/summary edited piecemeal; fix: run a single truth-sync pass across all packet docs with explicit references to `research/research.md` [Task 5]

# Task Group: Deep-Research Review Workflow and Release Readiness Controls
scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,180p'; echo '===== scoring ====='; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
===== scoring =====
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
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings
### Finding 1: Static Reference Integrity Is Worth Adopting, But Mex’s Path Semantics Are Too Shallow To Port Directly
- **Source**: [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: Mex extracts path claims mostly from inline code and code-like strings, checks existence against `projectRoot` and `scaffoldRoot`, special-cases `.mex/`, does a recursive bare-filename search only to depth 5, treats pattern-file and placeholder paths as warnings, and checks `patterns/INDEX.md` only against top-level `patterns/*.md`.
- **Why it matters for us**: This is still the cleanest `adopt now` idea, but the risk is false confidence. Spec Kit has deep packet trees, packet-local relative links, memory files, scratch artifacts, and cross-folder references that are more complex than Mex’s flat scaffold. A naive port would miss valid deep links, mis-handle file-relative edges, and downgrade real breakage when placeholders or pattern-like paths are involved.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Git-Based Freshness Helps, But Silent Nulls And Dual Thresholds Could Distort The Signal
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L194)
- **What it does**: Mex emits separate staleness issues for elapsed days and commits since last touch, with `30/90` day and `50/200` commit thresholds. Its git helpers catch failures and return `null`, which suppresses the signal entirely. Commit-based freshness also walks the repo log and derives staleness from commit position.
- **Why it matters for us**: The main risk is not just noise, it is mixed noise plus silence. Spec files that are intentionally append-only or low-churn will over-flag, while missing git history or shallow clones will under-flag with no degraded-state notice. If we adopt this without explicit `unknown/degraded` reporting, operators could read “no freshness issue” as “fresh”, which is not true.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Command, Dependency, And Script Parity Would Break Down Quickly In A Multi-Surface Repo
- **Source**: [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L7), [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex infers commands from inline/code blocks, infers dependencies only from bold text under matching headings, validates commands only against `package.json` scripts or `Makefile`, validates dependencies only against `package.json` deps/devDeps, treats non-Node manifests mostly as name/version stubs, and checks script coverage with raw substring matching.
- **Why it matters for us**: This is the highest false-positive and false-negative risk in the set. Public has shell commands, MCP tool surfaces, wrapper commands, Python utilities, spec-kit commands, and docs that discuss commands conceptually rather than literally. Direct adoption would miss real drift outside Node, misread prose as inventory, and create a validator that looks broad but only truly understands one stack.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Drift-To-Repair Briefing Is Reusable, But Mex’s Sync Loop Is Too Optimistic For Spec Kit
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L18), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L52), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1031), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L154)
- **What it does**: Mex builds a repair prompt that embeds current file content, issue lists, nearby directory contents, all files with the same extension when the list is short, and `HEAD~5..HEAD` diffs. Its interactive execution is hard-wired to `claude`, and `runClaudeInteractive()` treats exit code `0` or `null` as success before relying on a post-check rerun.
- **Why it matters for us**: The prompt-builder is the good part. The risk is the surrounding contract. In Spec Kit, a repair surface that includes broad file inventories and optimistic process-success semantics would clash with packet-local auditability, provider neutrality, and existing hard blockers for malformed or low-quality outputs. If we copy Mex too literally, we get a handy brief generator wrapped in a trust model that is too permissive.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

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


hook: Stop
hook: Stop Completed
tokens used
162,400
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings
### Finding 1: Static Reference Integrity Is Worth Adopting, But Mex’s Path Semantics Are Too Shallow To Port Directly
- **Source**: [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: Mex extracts path claims mostly from inline code and code-like strings, checks existence against `projectRoot` and `scaffoldRoot`, special-cases `.mex/`, does a recursive bare-filename search only to depth 5, treats pattern-file and placeholder paths as warnings, and checks `patterns/INDEX.md` only against top-level `patterns/*.md`.
- **Why it matters for us**: This is still the cleanest `adopt now` idea, but the risk is false confidence. Spec Kit has deep packet trees, packet-local relative links, memory files, scratch artifacts, and cross-folder references that are more complex than Mex’s flat scaffold. A naive port would miss valid deep links, mis-handle file-relative edges, and downgrade real breakage when placeholders or pattern-like paths are involved.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Git-Based Freshness Helps, But Silent Nulls And Dual Thresholds Could Distort The Signal
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L194)
- **What it does**: Mex emits separate staleness issues for elapsed days and commits since last touch, with `30/90` day and `50/200` commit thresholds. Its git helpers catch failures and return `null`, which suppresses the signal entirely. Commit-based freshness also walks the repo log and derives staleness from commit position.
- **Why it matters for us**: The main risk is not just noise, it is mixed noise plus silence. Spec files that are intentionally append-only or low-churn will over-flag, while missing git history or shallow clones will under-flag with no degraded-state notice. If we adopt this without explicit `unknown/degraded` reporting, operators could read “no freshness issue” as “fresh”, which is not true.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Command, Dependency, And Script Parity Would Break Down Quickly In A Multi-Surface Repo
- **Source**: [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L7), [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex infers commands from inline/code blocks, infers dependencies only from bold text under matching headings, validates commands only against `package.json` scripts or `Makefile`, validates dependencies only against `package.json` deps/devDeps, treats non-Node manifests mostly as name/version stubs, and checks script coverage with raw substring matching.
- **Why it matters for us**: This is the highest false-positive and false-negative risk in the set. Public has shell commands, MCP tool surfaces, wrapper commands, Python utilities, spec-kit commands, and docs that discuss commands conceptually rather than literally. Direct adoption would miss real drift outside Node, misread prose as inventory, and create a validator that looks broad but only truly understands one stack.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Drift-To-Repair Briefing Is Reusable, But Mex’s Sync Loop Is Too Optimistic For Spec Kit
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L18), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L52), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1031), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L154)
- **What it does**: Mex builds a repair prompt that embeds current file content, issue lists, nearby directory contents, all files with the same extension when the list is short, and `HEAD~5..HEAD` diffs. Its interactive execution is hard-wired to `claude`, and `runClaudeInteractive()` treats exit code `0` or `null` as success before relying on a post-check rerun.
- **Why it matters for us**: The prompt-builder is the good part. The risk is the surrounding contract. In Spec Kit, a repair surface that includes broad file inventories and optimistic process-success semantics would clash with packet-local auditability, provider neutrality, and existing hard blockers for malformed or low-quality outputs. If we copy Mex too literally, we get a handy brief generator wrapped in a trust model that is too permissive.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

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
