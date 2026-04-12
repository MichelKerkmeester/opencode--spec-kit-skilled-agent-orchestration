### Finding 5: Spec Kit Memory also has real concurrent-write and conflict controls that Mex does not
- **Source**: [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1632), [spec-folder-mutex.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts#L1), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1513), [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L135), [shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L678), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1503)
- **What it does**: The server forces SQLite WAL mode, `memory_save` serializes writes with a per-spec-folder mutex, uses unique pending-file suffixes to avoid pending-file races, logs shared-space conflicts into `shared_space_conflicts`, and escalates repeat or high-risk collisions from `append_version` to `manual_merge`.
- **Why it matters**: This is a genuine concurrency and merge-conflict story: serialize same-scope saves, preserve data, and retain an auditable record when shared writes collide. That is materially stronger than Mex’s “repair after drift” approach.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Checkpoint restore adds another safety boundary by blocking saves and rolling back failed merge restores
- **Source**: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1080), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L1097), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts#L1855)
- **What it does**: `memory_save` refuses writes while checkpoint restore maintenance is active, and merge-mode restore uses savepoints so reinsertion failures roll back instead of leaving partially restored scoped data behind.
- **Why it matters**: This is important multi-agent safety during maintenance windows. It prevents a restore from interleaving with live writes and turning scoped memories or shared-space state into mixed snapshots.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.48

## Recommended Next Focus
Compare these backend safeguards against the user-facing surface. The next high-value pass is: how should `memory_search`, `memory_context`, and `/spec_kit:resume` expose shared-space conflicts, degraded trust, or `manual_merge` requirements so multi-agent collisions become visible workflow state instead of remaining mostly internal audit data.
--- Iteration 26 ---
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
- **Why it matters**: The right architecture is not “semantic vs lexical” as a winner-take-all choice. It is “semantic for discovery, lexical for anchoring, graph for structure, temporal and session signals for ranking.” That is the real hybrid advantage.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex is strong lexical truth maintenance, not a competing semantic retrieval engine
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L36)
- **What it does**: Mex extracts lexical claims from markdown: paths, commands, dependencies, versions, frontmatter edges, and pattern index membership. Its drift engine runs static checks across the scaffold and scores integrity issues without embeddings or vector search.
- **Why it matters**: Mex will beat semantic retrieval on “is this markdown claim still true?” because that is a static lexical verification problem. But it does not replace semantic memory search for conceptual recall.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Mex’s scanner and targeted sync show the right complement: lexical or structural grounding first, AI repair second
- **Source**: [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L37)
- **What it does**: Mex first builds a structured brief from manifests, entry points, folder tree, tooling, and README, then tells AI to reason from that brief. During sync it only feeds flagged files, file-local issues, nearby filesystem context, and recent git diff.
- **Why it matters**: The transferable pattern is not “replace search with markdown.” It is “use lexical or structural evidence to narrow the surface, then let AI update only the broken slice.” That is an ideal companion to Spec Kit’s hybrid retrieval stack.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: The missing contract is explicit lane arbitration and user-visible attribution
- **Source**: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1684), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L28)
- **What it does**: Raw candidate collection already falls back from hybrid execution to FTS and then BM25. The lexical subsystem also tracks `lexicalPath` and failure states such as `missing_table` or `no_such_module_fts5`.
- **Why it matters**: We already have the mechanics of lane degradation, but not a strong outward contract explaining which lane dominated, which failed, and why a result should be trusted. That makes hybrid behavior harder to debug and tune.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.44

## Recommended Next Focus
Design a concrete retrieval policy matrix for Spec Kit Memory with four explicit outcomes: `lexical-first`, `semantic-first`, `hybrid-balanced`, and `graph-first`. Tie each mode to query classes, required result attribution, degradation behavior, and eval queries so we can prove when BM25/FTS should dominate, when embeddings should dominate, and when Mex-style static drift checks should run as a separate integrity layer rather than inside the recall stack.

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
# Iteration 027: DEVELOPER EXPERIENCE

## Focus
DEVELOPER EXPERIENCE: How easy is this system to set up, configure, debug, and maintain? What DX patterns should we steal for our memory system?

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
I’m treating this as a read-only research pass for iteration 27, focused specifically on Mex’s developer experience and what we should steal for Spec Kit Memory. I’ll do a quick memory pass for prior context, then inspect the external Mex files and our corresponding DX surfaces to extract only new, evidence-backed findings.
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
/bin/zsh -lc 'rg -n "mex|hybrid-rag-fusion|developer experience|DX|drift" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve loaded the deep-research protocol and found only light prior memory on this Mex packet, so I’m moving into primary-source reading now. Next I’m mapping the external repo’s DX surfaces alongside our own setup/debug surfaces so the findings stay concrete and new relative to iterations 1 through 26.
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I have the main Mex DX surfaces now: install/setup flow, command surface, reporting, hook behavior, and scaffold contract. I’m drilling one layer deeper into how it builds prompts and recovery/debug context, then I’ll compare those patterns against our `session_bootstrap`, `memory_health`, README, and save/index flows.
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|memory_health|memory_search|memory_context|memory_match_triggers|generate-context|troubleshoot|health|resume|bootstrap|shared memory|checkpoint|code graph|CocoIndex" .opencode/skill/system-spec-kit/mcp_server/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
9:  - "memory_context"
10:  - "memory_search"
32:- [7. TROUBLESHOOTING](#7--troubleshooting)
55:| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
56:| **Search channels** | 5 core + CocoIndex bridge | Vector, FTS5, BM25, Causal Graph, Degree (+ CocoIndex semantic code search as external bridge) |
62:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
69:| **Search** | Vector similarity only | 5 core channels + CocoIndex bridge, fused with Reciprocal Rank Fusion (K tuned per intent) |
70:| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
91:| `/memory:manage` | Database maintenance, checkpoints, bulk ingestion, shared-memory spaces and memberships | 19 primary tools + 1 helper |
93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
174:After connecting your MCP client, call the health check:
178:  "tool": "memory_health",
200:  "tool": "memory_context",
227:**Five core search channels** work together, with **CocoIndex** available as an external semantic code search bridge:
236:| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
238:**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
266:**Stage 1 -- Gather candidates** using graph-first routing: structural queries dispatch to Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline's active channels in parallel. Constitutional-tier memories are always injected regardless of score.
443:For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).
533:The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.
535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
563:##### `memory_context`
570:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
587:  "tool": "memory_context",
599:##### `session_resume`
601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
605:| `specFolder` | string | Scope resume to a specific spec folder |
606:| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
610:##### `session_bootstrap`
612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
616:| `specFolder` | string | Scope bootstrap to a specific spec folder |
622:##### `memory_search`
624:The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."
646:  "tool": "memory_search",
674:##### `memory_match_triggers`
688:  "tool": "memory_match_triggers",
763:##### `memory_health`
765:Run a health check. This is the diagnostic tool for when search quality degrades or something feels off. It checks for stale indexes, divergent aliases, broken embeddings and other issues. It can also attempt automatic repairs.
777:##### `session_health`
779:Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.
783:| _(none required)_ |  | Returns health status with hints |
832:The cleanup tool for large-scale housekeeping. Delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection. A safety checkpoint is created first so you can restore if needed.
840:| `skipCheckpoint` | boolean | Skip automatic checkpoint (not recommended) |
846:##### `checkpoint_create`
854:| `metadata` | object | Optional metadata to store with the checkpoint |
858:##### `checkpoint_list`
860:See all available checkpoints.
865:| `limit` | number | Max checkpoints to return |
869:##### `checkpoint_restore`
871:Go back in time by restoring from a named checkpoint. Replaces the current index with the snapshot.
880:##### `checkpoint_delete`
882:Delete a checkpoint. Requires you to type the name twice as a safety measure so you do not accidentally delete the wrong one.
926:Check the state of shared memory. See which spaces exist, who has access and whether the kill switch is active. Use this to verify your setup after making changes.
1077:Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
1084:| `seeds` | array | Seeds from CocoIndex, manual input or graph lookups |
1154:Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash. Use this explicitly when the graph is empty, when a read path reports `full_scan`, or when you want to rebuild more than the bounded inline refresh path will repair.
1167:Report code graph index health: file count, node and edge counts by type, parse health summary, last scan timestamp, DB file size and schema version.
1171:| _(none required)_ |  | Returns health report |
1177:Check CocoIndex availability, binary path and index status.
1181:| _(none required)_ |  | Returns CocoIndex health |
1187:Trigger CocoIndex incremental or full re-indexing of the workspace.
1197:Submit quality feedback on CocoIndex search results to improve future searches.
1217:├── context-server.ts          # MCP entry point and runtime bootstrap
1244:| `context-server.ts` | Starts the MCP listener, performs runtime bootstrap, and registers all 47 tools. |
1260:| L3 | Discovery | 4 | 800 | Browse what is stored, check system health |
1326:  "tool": "memory_context",
1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
1391:  "tool": "checkpoint_create",
1417:  "tool": "checkpoint_restore",
1527:For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).
1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
1537:| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
1549:<!-- ANCHOR:troubleshooting -->
1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
1560:**Fix**: Run a health check with auto-repair, then retry with a higher quality floor:
1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
1609:**Fix**: Check if a checkpoint was created before the operation:
1612:{ "tool": "checkpoint_list", "arguments": {} }
1618:{ "tool": "checkpoint_restore", "arguments": { "name": "the-checkpoint-name" } }
1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
1666:<!-- /ANCHOR:troubleshooting -->
1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
1743:| [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) | Complete shared memory guide: setup, use cases, roles, kill switch, troubleshooting |

exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|memory_health|memory_search|memory_context|memory_match_triggers|deep_loop|shared_memory|checkpoint" .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
77:import * as checkpointsLib from './lib/storage/checkpoints.js';
257:  preservesAuthority: 'session_bootstrap';
323:    preservesAuthority: 'session_bootstrap',
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
882:    if (name === 'memory_context' && args.mode === 'resume') {
912:      name === 'memory_context' && args.mode === 'resume';
964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
1564:    checkpoints: checkpointsLib,
1667:    checkpointsLib.init(database);

exec
/bin/zsh -lc "rg -n \"export async function .*session_bootstrap|export async function .*session_resume|export async function .*memory_health|export async function .*memory_search|export async function .*memory_context|export async function .*memory_match_triggers\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg -n \"generate-context|POST-SAVE QUALITY REVIEW|memory save|quality review|title|trigger_phrases|importance_tier\" .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/skill/system-spec-kit/scripts -g '*'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:142:      qualityFlags.add('has_contaminated_title');
.opencode/skill/system-spec-kit/scripts/loaders/README.md:2:title: "Data Loaders"
.opencode/skill/system-spec-kit/scripts/loaders/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:62:function dedupeFallbackRationale(title: string, rationaleCandidate: string, authoredRationale: string): string {
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:67:  if (normalizeProposition(rationaleCandidate) === normalizeProposition(title)) {
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:85:  const title = readDecisionText(record.title);
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:86:  if (decision.length === 0 && title.length === 0) {
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:90:  return `${decision} ${title}`.trim().length <= MAX_AUTHORED_DECISION_TEXT_LENGTH;
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:180:  title: string;
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:187:    title: string;
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:201:      title: `${source} decision ${index + 1}`,
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:209:    addCandidate(observation.narrative || observation.title || '', 'observation', index);
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:264:          decisionText = toText(manualObj.decision) || toText(manualObj.title);
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:269:        // Fix 1: Split string-form decisions at first separator to extract title vs rationale
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:270:        const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:271:        const title: string = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:272:        const fallbackRationale: string = titleMatch?.[2]?.trim() || '';
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:298:              const optionLabel = toText(optionObj.label) || toText(optionObj.title) || toText(optionObj.name) || `Option ${optionIndex + 1}`;
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:329:            DESCRIPTION: !manualObj ? '' : (title.length > 200 ? title.substring(0, 197) + '...' : title),
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:337:        const rationale: string = dedupeFallbackRationale(title, rationaleCandidate, rationaleFromInput);
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:388:          ? `${title} — ${truncateOnWordBoundary(rationaleFromInput, 120)}`
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:389:          : title;
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:394:          TITLE: title,
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:508:    const RATIONALE: string = dedupeFallbackRationale(obs.title || narrative, rationaleCandidate, '');
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:594:      TITLE: obs.title || `Decision ${index + 1}`,
.opencode/skill/system-spec-kit/scripts/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json:1:{"version":"4.0.18","results":[[":tests/task-enrichment.vitest.ts",{"duration":3721.023625,"failed":false}],[":tests/import-policy-rules.vitest.ts",{"duration":2.07350000000001,"failed":false}],[":tests/memory-render-fixture.vitest.ts",{"duration":0,"failed":false}],[":tests/generate-context-cli-authority.vitest.ts",{"duration":39.283833000000016,"failed":false}],[":tests/progressive-validation.vitest.ts",{"duration":104443.710666,"failed":false}],[":tests/tree-thinning.vitest.ts",{"duration":5.051583000000008,"failed":false}],[":tests/runtime-memory-inputs.vitest.ts",{"duration":1179.463959,"failed":false}],[":tests/slug-uniqueness.vitest.ts",{"duration":44.24137499999999,"failed":false}],[":tests/architecture-boundary-enforcement.vitest.ts",{"duration":439.068958,"failed":false}],[":tests/stateless-enrichment.vitest.ts",{"duration":2148.6485,"failed":false}],[":tests/memory-learn-command-docs.vitest.ts",{"duration":3.4485829999999993,"failed":false}],[":tests/claude-code-capture.vitest.ts",{"duration":560.6047919999999,"failed":false}],[":tests/quality-scorer-calibration.vitest.ts",{"duration":2.725999999999999,"failed":false}],[":tests/copilot-cli-capture.vitest.ts",{"duration":142.51012499999996,"failed":false}],[":tests/codex-cli-capture.vitest.ts",{"duration":530.625708,"failed":false}],[":tests/gemini-cli-capture.vitest.ts",{"duration":144.06766699999997,"failed":false}],[":tests/alignment-drift-fixture-preservation.vitest.ts",{"duration":61.86708300000001,"failed":false}],[":tests/workspace-identity.vitest.ts",{"duration":5.6456249999999955,"failed":false}],[":tests/spec-affinity.vitest.ts",{"duration":8.090292000000005,"failed":false}],[":tests/memory-sufficiency.vitest.ts",{"duration":4.3359999999999985,"failed":false}],[":tests/historical-memory-remediation.vitest.ts",{"duration":82.25087499999998,"failed":false}],[":tests/memory-template-contract.vitest.ts",{"duration":5.070624999999993,"failed":false}],[":tests/decision-confidence.vitest.ts",{"duration":5.001500000000007,"failed":false}],[":tests/description-enrichment.vitest.ts",{"duration":5.807291000000006,"failed":false}],[":tests/semantic-signal-golden.vitest.ts",{"duration":11.462625000000003,"failed":false}],[":tests/phase-classification.vitest.ts",{"duration":20.530292000000003,"failed":false}],[":tests/memory-indexer-weighting.vitest.ts",{"duration":6.473709000000014,"failed":false}],[":tests/test-integration.vitest.ts",{"duration":5358.835416,"failed":false}],[":tests/workflow-e2e.vitest.ts",{"duration":0,"failed":false}],[":tests/template-structure.vitest.ts",{"duration":9.337332999999987,"failed":false}],[":tests/outsourced-agent-handback-docs.vitest.ts",{"duration":2.731833999999992,"failed":false}],[":tests/auto-detection-fixes.vitest.ts",{"duration":0,"failed":false}],[":tests/content-filter-parity.vitest.ts",{"duration":3.858000000000004,"failed":false}],[":tests/opencode-capture.vitest.ts",{"duration":6565.4814160000005,"failed":false}],[":tests/contamination-filter.vitest.ts",{"duration":4.250416999999999,"failed":false}],[":tests/tool-sanitizer.vitest.ts",{"duration":6.2548340000000024,"failed":false}],[":tests/validation-rule-metadata.vitest.ts",{"duration":8.121292000000011,"failed":false}],[":tests/input-normalizer-unit.vitest.ts",{"duration":7.571291000000002,"failed":false}],[":tests/collect-session-data.vitest.ts",{"duration":3.6773749999999836,"failed":false}],[":tests/utils-regressions.vitest.ts",{"duration":3.574457999999993,"failed":false}],[":tests/workflow-warning.vitest.ts",{"duration":0,"failed":false}],[":tests/backfill-frontmatter.vitest.ts",{"duration":4.885750000000002,"failed":false}],[":tests/ascii-boxes.vitest.ts",{"duration":1.6262920000000065,"failed":false}],[":tests/memory-pipeline-regressions.vitest.ts",{"duration":103.00512499999996,"failed":false}],[":tests/session-enrichment.vitest.ts",{"duration":1659.6574580000001,"failed":false}],[":tests/post-save-review.vitest.ts",{"duration":7.135207999999992,"failed":false}],[":tests/validate-memory-quality.vitest.ts",{"duration":11.845458000000008,"failed":false}],[":tests/template-mustache-sections.vitest.ts",{"duration":2.146583000000007,"failed":false}],[":tests/validation-v13-v14-v12.vitest.ts",{"duration":13.966583999999997,"failed":false}],[":tests/project-phase-e2e.vitest.ts",{"duration":2.9768749999999926,"failed":false}],[":tests/trigger-phrase-filter.vitest.ts",{"duration":2.7874999999999943,"failed":false}],[":tests/workflow-session-id.vitest.ts",{"duration":0,"failed":false}],[":tests/deep-review-contract-parity.vitest.ts",{"duration":4.952833999999996,"failed":false}],[":tests/deep-review-reducer-schema.vitest.ts",{"duration":6.017708999999996,"failed":false}],[":tests/deep-research-reducer.vitest.ts",{"duration":11.902167000000006,"failed":false}],[":tests/deep-research-contract-parity.vitest.ts",{"duration":4.104624999999999,"failed":false}],[":tests/nested-changelog.vitest.ts",{"duration":8.951540999999992,"failed":false}],[":tests/truncate-on-word-boundary.vitest.ts",{"duration":3.0917080000000112,"failed":false}],[":tests/memory-quality-phase1.vitest.ts",{"duration":4.649042000000009,"failed":false}],[":tests/memory-quality-phase2-pr3.test.ts",{"duration":34.39741599999999,"failed":false}],[":tests/memory-quality-phase2-pr4.test.ts",{"duration":0,"failed":false}],[":tests/memory-quality-phase3-pr6.vitest.ts",{"duration":6.0858340000000055,"failed":false}],[":tests/memory-quality-phase3-pr5.vitest.ts",{"duration":8324.530334000001,"failed":false}],[":tests/trigger-phrase-sanitizer.vitest.ts",{"duration":3.2274170000000026,"failed":false}],[":tests/memory-quality-phase4-pr7.test.ts",{"duration":1785.2562910000001,"failed":false}],[":tests/memory-quality-phase4-pr9.test.ts",{"duration":11292.949958000001,"failed":false}],[":tests/memory-quality-phase6-trigger.test.ts",{"duration":15784.889916,"failed":false}],[":tests/memory-quality-phase6-migration.test.ts",{"duration":22.469125000000005,"failed":false}],[":tests/memory-quality-phase6-extractors.test.ts",{"duration":0,"failed":false}],[":tests/memory-quality-phase6-template.test.ts",{"duration":0,"failed":false}],[":tests/detector-regression-floor.vitest.ts.test.ts",{"duration":2.3494579999999985,"failed":false}],[":tests/session-cached-consumer.vitest.ts.test.ts",{"duration":41.66779199999996,"failed":false}],[":tests/warm-start-bundle-benchmark.vitest.ts.test.ts",{"duration":3.004374999999996,"failed":false}],[":tests/graph-upgrades-regression-floor.vitest.ts.test.ts",{"duration":8.53958399999999,"failed":false}],[":tests/title-builder-no-filename-suffix.vitest.ts",{"duration":1.404083,"failed":false}],[":tests/causal-links-auto-populate.vitest.ts",{"duration":19222.669583,"failed":false}],[":tests/parent-spec-resolver.vitest.ts",{"duration":2.8945420000000013,"failed":false}],[":tests/distinguishing-evidence-dedup.vitest.ts",{"duration":1.9157090000000068,"failed":false}],[":tests/trigger-phrase-no-prose-bigrams.vitest.ts",{"duration":2500.716792,"failed":false}],[":tests/file-capture-structured-mode.vitest.ts",{"duration":43.31995900000001,"failed":false}],[":tests/post-save-render-round-trip.vitest.ts",{"duration":31265.156917,"failed":false}],[":tests/canonical-sources-auto-discovery.vitest.ts",{"duration":22.136375000000015,"failed":false}],[":tests/phase-status-from-payload.vitest.ts",{"duration":385.11299999999994,"failed":false}],[":tests/quality-scorer-disambiguation.vitest.ts",{"duration":2.6033749999999998,"failed":false}],[":tests/overview-boundary-safe-truncation.vitest.ts",{"duration":409.92999999999995,"failed":false}],[":tests/memory-save-d5-continuation-and-causal-links.vitest.ts",{"duration":23001.531832999997,"failed":false}],[":tests/memory-save-title-description-override.vitest.ts",{"duration":27686.461084,"failed":false}],[":tests/validate-memory-quality-v8-regex-narrow.vitest.ts",{"duration":9.813291000000007,"failed":false}],[":tests/validate-memory-quality-v12-normalization.vitest.ts",{"duration":19.502959000000004,"failed":false}],[":tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts",{"duration":2.276332999999994,"failed":false}],[":tests/deep-review-behavioral.vitest.ts",{"duration":3.47175,"failed":false}],[":tests/deep-research-behavioral.vitest.ts",{"duration":6.690291000000002,"failed":false}],[":tests/coverage-graph-convergence.vitest.ts",{"duration":6.243124999999992,"failed":true}],[":tests/coverage-graph-core.vitest.ts",{"duration":4.352542,"failed":false}],[":tests/coverage-graph-signals.vitest.ts",{"duration":3.4984579999999994,"failed":false}],[":tests/optimizer-replay-runner.vitest.ts",{"duration":3.9926249999999897,"failed":false}],[":tests/optimizer-replay-corpus.vitest.ts",{"duration":5.6733329999999995,"failed":false}],[":tests/optimizer-promote.vitest.ts",{"duration":4.054167000000007,"failed":false}],[":tests/optimizer-search.vitest.ts",{"duration":7.103207999999995,"failed":false}],[":tests/optimizer-rubric.vitest.ts",{"duration":3.810582999999994,"failed":false}],[":tests/deep-loop-wave-executor.vitest.ts",{"duration":4.258250000000004,"failed":false}],[":tests/deep-loop-wave-planner.vitest.ts",{"duration":10.907374999999988,"failed":false}],[":tests/deep-loop-wave-resume.vitest.ts",{"duration":3.687584000000001,"failed":false}],[":tests/deep-loop-wave-merge.vitest.ts",{"duration":10.03887499999999,"failed":false}],[":tests/coverage-graph-cross-layer.vitest.ts",{"duration":26.17741699999999,"failed":false}],[":tests/coverage-graph-integration.vitest.ts",{"duration":5.079166999999998,"failed":false}],[":tests/coverage-graph-stress.vitest.ts",{"duration":24.975625000000008,"failed":false}]]}
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:64:  title?: string;
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:135:  title?: string;
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:169:  importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:301:  | 'missing_trigger_phrases'
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:304:  | 'generic_title'
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:314:  | 'has_contaminated_title'
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:573:  /** RC1: Raw sessionSummary from JSON payload, used as preferred title candidate */
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:8:// Shared helpers for memory task title enrichment decisions
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:16:/** Normalizes a spec title for reuse in memory task enrichment. */
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:17:export function normalizeSpecTitleForMemory(title: string): string {
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:18:  return normalizeMemoryNameCandidate(title);
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:21:/** Returns whether the spec title should enrich the stored memory task. */
.opencode/skill/system-spec-kit/scripts/ops/README.md:2:title: "Ops Self-Healing Scripts"
.opencode/skill/system-spec-kit/scripts/ops/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/types/README.md:2:title: "Types"
.opencode/skill/system-spec-kit/scripts/types/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/utils/README.md:2:title: "System Spec Kit Utilities"
.opencode/skill/system-spec-kit/scripts/utils/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/utils/README.md:143:├── task-enrichment.ts         # Task title enrichment from spec titles and memory context
.opencode/skill/system-spec-kit/scripts/utils/README.md:197:| `task-enrichment.ts` | Task title enrichment from spec titles and memory context for higher-quality memory naming |
.opencode/skill/system-spec-kit/scripts/utils/README.md:329:| [Memory System](../../references/memory/memory_system.md) | Uses input-normalizer for memory save data |
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:43:  title: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:75:  title?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:92:  trigger_phrases?: string[];
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:94:  importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:123:  title?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:141:  title?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:245:  title?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:293:    if (typeof obj.title === 'string') return obj.title;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:317:    decisionText = decisionItem.decision || decisionItem.title || 'Unknown decision';
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:334:  const titleMatch = decisionText.match(/^([^.!?]+[.!?]?)/);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:335:  const title: string = titleMatch
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:336:    ? titleMatch[1].substring(0, 200).trim()
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:339:  const finalChosenApproach: string = chosenApproach || title;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:358:    title: title,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:374: * @param summary - The session summary text to use as title and narrative.
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:387:    title: summaryTitle,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:405:    title: 'Technical Implementation Details',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:448:    return { type: 'followup', title: 'Next Steps', narrative: '', facts: [] };
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:455:    title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:518:        title: buildObservationTitleFromNarrative(entry),
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:562:    const toolTitle = String(tool.title || tool.action || '').trim();
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566:        title: `Tool: ${toolName}`,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:633:  const explicitTitle = normalizeOptionalText(data.title);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:653:    : Array.isArray(data.trigger_phrases)
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:654:      ? data.trigger_phrases
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:748:      cloned.title = explicitTitle;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:762:    const fastPathTier = data.importanceTier || data.importance_tier;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:846:    normalized.title = explicitTitle;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:986:  const slowPathTier = data.importanceTier || data.importance_tier;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1047:  'title', 'description',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1054:  'triggerPhrases', 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1055:  'importanceTier', 'importance_tier',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1116:  if (data.title !== undefined && typeof data.title !== 'string') {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1117:    errors.push('title must be a string');
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1129:  if (Array.isArray(data.trigger_phrases)) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1130:    for (let i = 0; i < data.trigger_phrases.length; i++) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1131:      if (typeof data.trigger_phrases[i] === 'string' && (data.trigger_phrases[i] as string).length > 200) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1132:        errors.push(`trigger_phrases[${i}] exceeds maximum length of 200 characters`);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1151:  if (data.trigger_phrases !== undefined && !Array.isArray(data.trigger_phrases)) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1152:    errors.push('trigger_phrases must be an array');
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1208:  if (data.importance_tier !== undefined && !validTiers.includes(data.importance_tier)) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1209:    errors.push(`Invalid importance_tier: ${data.importance_tier}. Valid values: ${validTiers.join(', ')}`);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1248: * Build a descriptive observation title from a tool call.
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1249: * Uses the tool's file path, pattern, or command to create a meaningful title
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1256:  // Prefer the tool's own title if it's descriptive (not just a tool name)
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1257:  if (tool.title && tool.title.length > 10 && !/^Tool:\s/i.test(tool.title)) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1258:    return tool.title.substring(0, 80);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1408:    sessionTitle: capture.sessionTitle ?? (raw.session_title as string | undefined),
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1463:      title: tool.title || '',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1594:          title: ex.assistantResponse.substring(0, 80),
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1608:      title: toolTitle,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1609:      narrative: tool.title || `Executed ${tool.tool}`,
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1693:          DESCRIPTION: tool.title || `${tool.tool === 'write' ? 'Created' : 'Edited'} via ${tool.tool} tool`,
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/scripts/spec/README.md:2:title: "Spec Scripts"
.opencode/skill/system-spec-kit/scripts/spec/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:8:// Extracts session metadata — ID, title, duration, key topics, and learning delta
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:532: * @param decisions - Array of decision objects whose titles, rationales, and choices are weighted.
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:598:    obs.type === 'decision' || obs.title?.toLowerCase().includes('decision')
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:626:    lastAction: behavioralObservations.slice(-1)[0]?.title || 'Context save initiated',
.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh:45:        # (frontmatter with trigger_phrases arrays can exceed 10 lines)
.opencode/skill/system-spec-kit/scripts/package.json:6:  "main": "dist/memory/generate-context.js",
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:163:        TITLE: obs.title || 'Detected Diagram',
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:168:        HAS_DESCRIPTION: !!obs.title,
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:169:        DESCRIPTION: obs.title || 'Diagram found in conversation',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:56:  title: string;
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:75:  title?: string | null;
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:78:  importance_tier?: string | null;
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:184:        SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier, m.document_type,
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:197:          title: r.title || '',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:200:          importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:219:        SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier, m.document_type,
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:233:          title: r.title || '',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:236:          importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:254:        SELECT id, title, spec_folder, file_path, importance_tier, document_type
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:264:          title: r.title || '',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:267:          importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:312:        SELECT id, title, spec_folder, file_path, importance_tier, document_type
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:317:        ORDER BY importance_tier = 'critical' DESC,
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:318:                 importance_tier = 'important' DESC,
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:327:          title: r.title || '',
.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:330:          importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:25:title: Meaningful implementation session
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:27:importance_tier: important
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:29:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:63:      { severity: 'HIGH', field: 'title', message: 'bad', fix: 'fix' },
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:64:      { severity: 'HIGH', field: 'trigger_phrases', message: 'bad', fix: 'fix' },
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:66:      { severity: 'MEDIUM', field: 'importance_tier', message: 'bad', fix: 'fix' },
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:26:    title: string;
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:38:  decisions: Array<{ title: string; rationale: string; chosen: string; _provenance: 'spec-folder' }>;
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:183:    ...(Array.isArray(data.trigger_phrases) ? data.trigger_phrases : []),
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:184:    ...extractFrontmatterListItems(content, 'trigger_phrases'),
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:203:      title: `${id}: ${cleanText(requirement)}`,
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:276:    const title = cleanText(section.split('\n')[0] || 'Decision');
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:280:    return title && chosen ? { title, rationale, chosen, _provenance: 'spec-folder' as const } : null;
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:318:    String(description.title || description.name || ''),
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:325:    ...((description.id || description.title || description.status) ? [{
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:327:      title: 'Spec folder metadata',
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:330:        String(description.title || ''),
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:339:        `title=${String(description.title || '')}`,
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:351:      title: 'Task completion status',
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:361:      title: 'Checklist verification status',
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:243:  titleCandidates: string[];
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:251:      titleCandidates: [],
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:265:      if (typeof parsed.title === 'string') {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:266:        descriptionTitle = parsed.title;
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:279:  const frontmatterTitles = parseFrontmatterValue(specDoc, 'title');
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:280:  const triggerPhrases = parseFrontmatterValue(specDoc, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:284:    titleCandidates: uniqueStrings([descriptionTitle, ...frontmatterTitles]),
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:337:        titleCandidates: [],
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:347:      ...metadata.titleCandidates,
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:372:      ...metadata.titleCandidates,
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:455:    if (typeof observation?.title === 'string') {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:456:      texts.push(observation.title);
.opencode/skill/system-spec-kit/scripts/README.md:2:title: "System-Spec-Kit Scripts"
.opencode/skill/system-spec-kit/scripts/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/README.md:7:  - "memory save script"
.opencode/skill/system-spec-kit/scripts/README.md:27:This directory contains the shell and TypeScript tooling that powers spec creation, upgrades, validation, memory save, context indexing, and targeted Vitest regressions around hardened script behavior.
.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:250:# Normalize_template_title_suffix()
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:251:# Rewrite frontmatter title suffix to composed output path:
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:255:normalize_template_title_suffix() {
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:276:            title_done = 0;
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:292:            if (in_frontmatter == 1 && title_done == 0 && $0 ~ /^[[:space:]]*title:[[:space:]]*/) {
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:294:                sub(/^[[:space:]]*title:[[:space:]]*/, "", line);
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:316:                print "title: \"" line "\"";
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:317:                title_done = 1;
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:708:    content=$(normalize_template_title_suffix "$filepath" "$content")
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:191:    // may not form. Accept either 'signal extractor' (from decision title) or 'signal extraction'.
.opencode/skill/system-spec-kit/scripts/evals/README.md:2:title: "Eval Scripts"
.opencode/skill/system-spec-kit/scripts/evals/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/extractors/README.md:2:title: "Data Extractors"
.opencode/skill/system-spec-kit/scripts/extractors/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/rules/README.md:2:title: "Validation Rules"
.opencode/skill/system-spec-kit/scripts/rules/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/rules/README.md:383:- Optional: validates expected fields (title, description, etc.)
.opencode/skill/system-spec-kit/scripts/kpi/README.md:2:title: "KPI Scripts"
.opencode/skill/system-spec-kit/scripts/kpi/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/kpi/README.md:84:| Empty trigger phrases rate | YAML frontmatter block has zero `trigger_phrases` entries |
.opencode/skill/system-spec-kit/scripts/templates/README.md:2:title: "SpecKit Template Composer"
.opencode/skill/system-spec-kit/scripts/templates/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:19:  title?: string;
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:28:  lines.push(`title: "${opts.title ?? 'Test Memory Document'}"`);
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:33:    lines.push('trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:69:    'title: "Test Spec"',
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:70:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:99:      const content = makeRawMemory("title: 'unclosed value", LONG_BODY);
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:108:      const content = makeRawMemory('title: "unclosed value', LONG_BODY);
.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts:150:        `title: "Big FM"\n${hugeFrontmatter}`,
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:84:  if (implObs && implObs.title) {
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:85:    const baseTitle = implObs.title
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:89:    return topicSlug || createTopicFallback(baseTitle || implObs.title);
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:107:    let featureName: string = obs.title || 'Implementation';
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:316:    .map((o) => `${o.title || ''} ${o.narrative || ''}`)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:426:    .map((obs) => `${obs.title || ''} ${obs.narrative || ''}`.trim())
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:435:    // Fix 2: Also check observations for "Next Steps" title (normalizer may consume the field)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:437:      || observations.some(obs => /^next\s*steps?\b/i.test(obs.title || ''));
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:446:        && observations.some(obs => /^next\s*steps?\b/i.test(obs.title || ''))
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:463:      const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:469:        const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:480:        const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:506:        .filter((obs) => !/^next\s*steps?\b/i.test(obs.title || ''))
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:507:        .map((obs) => `${obs.title || ''} ${obs.narrative || ''}`.trim())
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:598:    const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:666:      .map((o) => o.title)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:693:    : toText(value.decision) || toText(value.title) || '';
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:699:  const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:700:  return titleMatch?.[1]?.trim() || decisionText;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:726:    const normalized = normalizeProposition(observation.title || observation.narrative || '');
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:755:    const lastSource = [lastMeaningful.title, lastMeaningful.narrative]
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:758:      || lastMeaningful.title
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:946:    const text = obs.title || obs.narrative || '';
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1310:    const outcomeText = (observation.title || observation.narrative?.substring(0, 300) || '').trim();
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1346:    .map((observation) => observation.title)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1349:    || observations.slice(0, 3).map((o) => o.title).filter(Boolean).join('; ');
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1360:    : (typeof data.importance_tier === 'string' ? data.importance_tier : null);
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1407:    ...observations.map((observation) => observation.title || ''),
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1413:    || observations[0]?.title
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1535:    // Rec 3: Derive title from sessionSummary when available (up to 80 chars, sentence boundary)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1561:    // RC1: Pass through raw sessionSummary from JSON payload for title candidate
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:75:function normalizeObservationTitle(title: string | undefined): string {
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:76:  return typeof title === 'string'
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:77:    ? title.trim().toLowerCase()
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:86:  const normalizedTitle = normalizeObservationTitle(obs.title);
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:97:  const text = ((obs.title || '') + ' ' + (obs.narrative || '')).toLowerCase();
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:393:      const title = (obs.title || '').trim() || 'Observation';
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:399:        title,
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:404:        title,
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:413:        TITLE: title,
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:427: * Merges consecutive observations with identical titles into a single entry with
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:437:    const title = (obs.title || '').trim();
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:438:    // Skip empty titles
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:439:    if (!title) {
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:444:    // Create a dedup key from normalized title + file list
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:446:    const dedupKey = `${title.toLowerCase()}::${filesKey}`;
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:468:        existing.obs.narrative = `${existing.obs.narrative || title} (repeated ${existing.count} times)`;
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:470:        existing.obs.narrative = (existing.obs.narrative || title).replace(
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:45:    if (!inBlock && /^trigger_phrases:\s*$/.test(line.trim())) {
.opencode/skill/system-spec-kit/scripts/dist/loaders/data-loader.js:29:            'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]');
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:147:      title TEXT,
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:148:      importance_tier TEXT,
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:149:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:182:    INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:68:  // F-10: Tool titles with path arguments (Read/Edit/Write/Grep/Glob/Bash) — high severity
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:69:  { label: 'tool title with path', pattern: /\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+tool\s+(?:on\s+)?[\/\.][^\s]+/gi, severity: 'high' },
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:136:  if (entry.label === 'tool title with path' && sourceCapabilities.toolTitleWithPathExpected) {
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:373:  const title = finding.title || finding.summary || '';
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:374:  return `${file}:${line}::${title}`.toLowerCase().replace(/\s+/g, '_');
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:56:  title: string;
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:686:    title: mode === 'root'
.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:712:    TITLE: data.title,
.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:50:    title: string;
.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:455:      title: `Uncommitted ${entry.action}: ${entry.filePath}`,
.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:467:        title: commit.subject,
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:92:      : (decision as Record<string, unknown>)?.decision || (decision as Record<string, unknown>)?.title || '';
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:341:        CONTENT: `Key decisions: ${keyDecisions.map((d: Record<string, unknown>) => typeof d === 'string' ? d : d?.title || JSON.stringify(d)).join('; ')}`,
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:109:      'title: "Auto-Detection Fixes"',
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:152:        title: 'Phase 013 workflow coverage',
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:242:            title: 'Read phase spec',
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:249:            title: 'Patch phase tasks',
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:283:      observations: manualTitles.map((title) => ({
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:285:        title,
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:286:        narrative: `Observation duplicate of: ${title}`,
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:305:          title: 'Use in-memory cache for git status.',
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:311:          title: 'Narrow TOOL_READ_SET scope.',
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:41:function normalizeObservationTitle(title) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:42:    return typeof title === 'string'
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:43:        ? title.trim().toLowerCase()
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:50:    const normalizedTitle = normalizeObservationTitle(obs.title);
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:59:    const text = ((obs.title || '') + ' ' + (obs.narrative || '')).toLowerCase();
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:312:        const title = (obs.title || '').trim() || 'Observation';
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:317:        const category = (0, anchor_generator_1.categorizeSection)(title, obs.narrative || '');
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:318:        let anchorId = (0, anchor_generator_1.generateAnchorId)(title, category, specNumber);
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:323:                TITLE: title,
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:336: * Merges consecutive observations with identical titles into a single entry with
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:345:        const title = (obs.title || '').trim();
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:346:        // Skip empty titles
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:347:        if (!title) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:351:        // Create a dedup key from normalized title + file list
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:353:        const dedupKey = `${title.toLowerCase()}::${filesKey}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:372:                existing.obs.narrative = `${existing.obs.narrative || title} (repeated ${existing.count} times)`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.js:375:                existing.obs.narrative = (existing.obs.narrative || title).replace(/\(repeated \d+ times\)/, `(repeated ${existing.count} times)`);
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:385: * Keys by findingId if present, otherwise by file:line + title.
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:396:  const title = finding.title || finding.summary || '';
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:397:  return `${file}:${line}::${title}`.toLowerCase().replace(/\s+/g, '_');
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:45:function dedupeFallbackRationale(title, rationaleCandidate, authoredRationale) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:49:    if (normalizeProposition(rationaleCandidate) === normalizeProposition(title)) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:63:    const title = readDecisionText(record.title);
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:64:    if (decision.length === 0 && title.length === 0) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:67:    return `${decision} ${title}`.trim().length <= MAX_AUTHORED_DECISION_TEXT_LENGTH;
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:139:            title: `${source} decision ${index + 1}`,
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:146:        addCandidate(observation.narrative || observation.title || '', 'observation', index);
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:189:                decisionText = toText(manualObj.decision) || toText(manualObj.title);
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:194:            // Fix 1: Split string-form decisions at first separator to extract title vs rationale
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:195:            const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:196:            const title = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:197:            const fallbackRationale = titleMatch?.[2]?.trim() || '';
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:220:                        const optionLabel = toText(optionObj.label) || toText(optionObj.title) || toText(optionObj.name) || `Option ${optionIndex + 1}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:249:                        DESCRIPTION: !manualObj ? '' : (title.length > 200 ? title.substring(0, 197) + '...' : title),
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:256:            const rationale = dedupeFallbackRationale(title, rationaleCandidate, rationaleFromInput);
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:302:                ? `${title} — ${(0, truncate_on_word_boundary_1.truncateOnWordBoundary)(rationaleFromInput, 120)}`
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:303:                : title;
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:307:                TITLE: title,
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:406:        const RATIONALE = dedupeFallbackRationale(obs.title || narrative, rationaleCandidate, '');
.opencode/skill/system-spec-kit/scripts/dist/extractors/decision-extractor.js:482:            TITLE: obs.title || `Decision ${index + 1}`,
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:90:            : decision?.decision || decision?.title || '';
.opencode/skill/system-spec-kit/scripts/dist/extractors/conversation-extractor.js:302:                CONTENT: `Key decisions: ${keyDecisions.map((d) => typeof d === 'string' ? d : d?.title || JSON.stringify(d)).join('; ')}`,
.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:7:import { buildMemoryDashboardTitle } from '../core/title-builder';
.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:10:const FIXTURE_PATH = path.join(TEST_DIR, 'fixtures', 'post-save-render', 'title-fixture.json');
.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12:describe('title builder render fix', () => {
.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:13:  it('keeps the dashboard title free of filename suffix garbage', () => {
.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts:325:      if (obs.title) {
.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts:326:        const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts:343:    if (obs.title) {
.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts:344:      const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts:345:      titleWords.forEach((w) => keywords.add(w.toLowerCase()));
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:2:title: "Spec Folder Utilities"
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:128:    { title: 'Auth token validation error' }
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:243:| Need phase-folder memory save  | Pass the exact phase-folder CLI target; memory writes stay in that selected phase folder |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:385:            title: `Uncommitted ${entry.action}: ${entry.filePath}`,
.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js:396:                title: commit.subject,
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:53:  title?: string;
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:341:  const title: string = config.title || 'Simulated Decision Example';
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:348:      TITLE: title,
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:416:  const title: string = config.title || 'Example Workflow';
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:437:        TITLE: title,
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:149:        ...(Array.isArray(data.trigger_phrases) ? data.trigger_phrases : []),
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:150:        ...extractFrontmatterListItems(content, 'trigger_phrases'),
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:169:            title: `${id}: ${cleanText(requirement)}`,
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:237:        const title = cleanText(section.split('\n')[0] || 'Decision');
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:241:        return title && chosen ? { title, rationale, chosen, _provenance: 'spec-folder' } : null;
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:280:        String(description.title || description.name || ''),
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:286:        ...((description.id || description.title || description.status) ? [{
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:288:                title: 'Spec folder metadata',
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:291:                    String(description.title || ''),
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:300:                    `title=${String(description.title || '')}`,
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:312:                title: 'Task completion status',
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.js:322:                title: 'Checklist verification status',
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:323:        .map((obs) => `${obs.title || ''} ${obs.narrative || ''}`.trim())
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:331:        // Fix 2: Also check observations for "Next Steps" title (normalizer may consume the field)
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:333:            || observations.some(obs => /^next\s*steps?\b/i.test(obs.title || ''));
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:340:                && observations.some(obs => /^next\s*steps?\b/i.test(obs.title || '')));
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:354:            const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:360:                const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:372:                const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:395:            .filter((obs) => !/^next\s*steps?\b/i.test(obs.title || ''))
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:396:            .map((obs) => `${obs.title || ''} ${obs.narrative || ''}`.trim())
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:460:        const text = `${obs.title || ''} ${obs.narrative || ''}`;
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:517:            .map((o) => o.title)
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:540:        : toText(value.decision) || toText(value.title) || '';
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:544:    const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:545:    return titleMatch?.[1]?.trim() || decisionText;
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:564:        const normalized = normalizeProposition(observation.title || observation.narrative || '');
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:584:        const lastSource = [lastMeaningful.title, lastMeaningful.narrative]
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:587:            || lastMeaningful.title
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:742:        const text = obs.title || obs.narrative || '';
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1023:        const outcomeText = (observation.title || observation.narrative?.substring(0, 300) || '').trim();
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1056:        .map((observation) => observation.title)
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1059:        || observations.slice(0, 3).map((o) => o.title).filter(Boolean).join('; ');
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1069:        : (typeof data.importance_tier === 'string' ? data.importance_tier : null);
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1107:        ...observations.map((observation) => observation.title || ''),
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1113:        || observations[0]?.title
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1221:        // Rec 3: Derive title from sessionSummary when available (up to 80 chars, sentence boundary)
.opencode/skill/system-spec-kit/scripts/dist/extractors/collect-session-data.js:1247:        // RC1: Pass through raw sessionSummary from JSON payload for title candidate
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:43:title: "Memory save verification"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:45:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:46:  - "memory save verification"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:63:title: "Foreign contamination fixture"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:65:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:120:    name: 'title-contamination',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:125:    reason: 'A contaminated title undermines retrieval quality and saved-memory truthfulness.',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:152:    reason: 'Memory content with zero topical overlap with spec trigger_phrases suggests off-target capture.',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:200:  { pattern: /(^title:\s*"|^#\s+)To promote a memory to constitutional tier/im, label: 'template instructional banner leakage' },
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:214:  { pattern: /^\[[^\]]+\]$/i, label: 'placeholder bracket title' },
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:215:  { pattern: /^(untitled|draft|todo|tbd)(?:\s+(memory|session|summary|document|notes?))?$/i, label: 'generic stub title' },
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:216:  { pattern: /^\d{3}(?:-[a-z0-9][a-z0-9-]*)?$/i, label: 'spec-id-only title' },
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:764:  const triggerPhrases = parseYamlListFromContent(content, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:769:    message: sparseSemantic ? 'sparse semantic fields: trigger_phrases empty' : 'ok',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:863:  const titleValue = extractYamlValueFromContent(content, 'title') || extractFirstHeading(content);
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:864:  const titlePatternMatch = TITLE_CONTAMINATION_PATTERNS.find(({ pattern }) => pattern.test(titleValue));
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:867:    passed: !titlePatternMatch,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:868:    message: titlePatternMatch ? `contaminated title: ${titlePatternMatch.label}` : 'ok',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:888:  const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:898:          hasErrorTitle ? 'title' : '',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:899:          errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:904:  // V12: Topical coherence — check if memory content overlaps with spec's trigger_phrases
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:932:            specTriggerPhrases = parseYamlListFromContent(specContent, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:952:        v12Message = `V12_TOPICAL_MISMATCH: zero of ${specTriggerPhrases.length} spec trigger_phrases found in memory content`;
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1016:      'frontmatter:trigger_phrases',
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1020:      ...TITLE_CONTAMINATION_PATTERNS.map(({ label }) => `title:${label}`),
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1024:      ...(titlePatternMatch ? [`title:${titlePatternMatch.label}`] : []),
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1031:      `trigger_phrases:${triggerPhrases.length}`,
.opencode/skill/system-spec-kit/scripts/renderers/README.md:2:title: "Template Renderers"
.opencode/skill/system-spec-kit/scripts/renderers/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.d.ts:147: * @param decisions - Array of decision objects whose titles, rationales, and choices are weighted.
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:52:function generateSemanticSlug(title: string, maxWords: number = 4): string {
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:53:  if (!title || typeof title !== 'string') return 'unnamed';
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:54:  return title
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:83:  // Remove redundant category prefix from title
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:84:  let cleanTitle: string = sectionTitle || 'Untitled';
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:103:  const title: string = sectionTitle.toLowerCase();
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:105:  if (/decision|choice|selected|approach|alternative|option/i.test(title)) return 'decision';
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:107:  if (/how to|extend|add new|guide|steps|instructions|tutorial/i.test(title)) return 'guide';
.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:108:  if (/architecture|design|system|structure|flow|model|schema/i.test(title)) return 'architecture';
.opencode/skill/system-spec-kit/scripts/dist/extractors/contamination-filter.js:50:    // F-10: Tool titles with path arguments (Read/Edit/Write/Grep/Glob/Bash) — high severity
.opencode/skill/system-spec-kit/scripts/dist/extractors/contamination-filter.js:51:    { label: 'tool title with path', pattern: /\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+tool\s+(?:on\s+)?[\/\.][^\s]+/gi, severity: 'high' },
.opencode/skill/system-spec-kit/scripts/dist/extractors/contamination-filter.js:100:    if (entry.label === 'tool title with path' && sourceCapabilities.toolTitleWithPathExpected) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/file-extractor.d.ts:16: * Merges consecutive observations with identical titles into a single entry with
.opencode/skill/system-spec-kit/scripts/dist/extractors/implementation-guide-extractor.js:43:    if (implObs && implObs.title) {
.opencode/skill/system-spec-kit/scripts/dist/extractors/implementation-guide-extractor.js:44:        const baseTitle = implObs.title
.opencode/skill/system-spec-kit/scripts/dist/extractors/implementation-guide-extractor.js:48:        return topicSlug || createTopicFallback(baseTitle || implObs.title);
.opencode/skill/system-spec-kit/scripts/dist/extractors/implementation-guide-extractor.js:62:        let featureName = obs.title || 'Implementation';
.opencode/skill/system-spec-kit/scripts/dist/extractors/implementation-guide-extractor.js:221:        .map((o) => `${o.title || ''} ${o.narrative || ''}`)
.opencode/skill/system-spec-kit/scripts/test-fixtures/060-checklist-chk-format-invalid/checklist.md:2:title: "Verification Checklist: Template Fixture [template:level_2/checklist.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/060-checklist-chk-format-invalid/checklist.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/060-checklist-chk-format-invalid/checklist.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.d.ts:4:        title: string;
.opencode/skill/system-spec-kit/scripts/dist/extractors/spec-folder-extractor.d.ts:25:        title: string;
.opencode/skill/system-spec-kit/scripts/dist/extractors/diagram-extractor.js:143:                TITLE: obs.title || 'Detected Diagram',
.opencode/skill/system-spec-kit/scripts/dist/extractors/diagram-extractor.js:148:                HAS_DESCRIPTION: !!obs.title,
.opencode/skill/system-spec-kit/scripts/dist/extractors/diagram-extractor.js:149:                DESCRIPTION: obs.title || 'Diagram found in conversation',
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/plan.md:2:title: "Implementation Plan: Template Fixture [template:level_2/plan.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/plan.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:194:    title: finding.title || finding.summary || '',
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:384:  const title = finding.title || finding.summary || '';
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:385:  const hash = simpleHash(`${file}:${line}::${title}`);
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/checklist.md:2:title: "Verification Checklist: Template Fixture [template:level_2/checklist.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/checklist.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/checklist.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:85:  it('downgrades tool title with path severity for sources whose capabilities expect transcript-style tool titles', () => {
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:94:    expect(result.matchedPatterns).toContain('tool title with path');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:97:  it('preserves high severity for sources whose capabilities do not expect transcript-style tool titles', () => {
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:106:    expect(result.matchedPatterns).toContain('tool title with path');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:118:    expect(result.matchedPatterns).toContain('tool title with path');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:126:    expect(result.matchedPatterns).toContain('tool title with path');
.opencode/skill/system-spec-kit/scripts/tests/workflow-session-id.vitest.ts:99:        ['---', 'title: "Spec: Workflow Session Id Regression"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/tasks.md:2:title: "Tasks: Template Fixture [template:level_2/tasks.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/tasks.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:60:// Extracts session metadata — ID, title, duration, key topics, and learning delta
.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:476: * @param decisions - Array of decision objects whose titles, rationales, and choices are weighted.
.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:528:    const decisionCount = observations.filter((obs) => obs.type === 'decision' || obs.title?.toLowerCase().includes('decision')).length;
.opencode/skill/system-spec-kit/scripts/dist/extractors/session-extractor.js:548:        lastAction: behavioralObservations.slice(-1)[0]?.title || 'Context save initiated',
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/implementation-summary.md:2:title: "Implementation Summary [template:level_2/implementation-summary.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/implementation-summary.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/implementation-summary.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/lib/README.md:2:title: "Scripts Library"
.opencode/skill/system-spec-kit/scripts/lib/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.d.ts:7:        title: string;
.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js:93:            qualityFlags.add('has_contaminated_title');
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:170:    if (typeof observation.title === 'string') {
.opencode/skill/system-spec-kit/scripts/lib/session-activity-signal.ts:171:      texts.push(observation.title);
.opencode/skill/system-spec-kit/scripts/dist/lib/decision-tree-generator.js:20:        const title = decisionData;
.opencode/skill/system-spec-kit/scripts/dist/lib/decision-tree-generator.js:22:            return (0, ascii_boxes_1.formatDecisionHeader)(title, '', 75, new Date().toISOString());
.opencode/skill/system-spec-kit/scripts/dist/lib/decision-tree-generator.js:27:\u2502  ${pad(title, 18)}  \u2502
.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts:56:    const title: string = decisionData;
.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts:58:      return formatDecisionHeader(title, '', 75, new Date().toISOString());
.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts:64:\u2502  ${pad(title, 18)}  \u2502
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:97:        if (typeof obj.title === 'string')
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:98:            return obj.title;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:122:        decisionText = decisionItem.decision || decisionItem.title || 'Unknown decision';
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:138:    const titleMatch = decisionText.match(/^([^.!?]+[.!?]?)/);
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:139:    const title = titleMatch
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:140:        ? titleMatch[1].substring(0, 200).trim()
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:142:    const finalChosenApproach = chosenApproach || title;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:158:        title: title,
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:173: * @param summary - The session summary text to use as title and narrative.
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:184:        title: summaryTitle,
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:200:        title: 'Technical Implementation Details',
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:236:        return { type: 'followup', title: 'Next Steps', narrative: '', facts: [] };
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:241:        title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:295:                title: buildObservationTitleFromNarrative(entry),
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:333:        const toolTitle = String(tool.title || tool.action || '').trim();
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:337:                title: `Tool: ${toolName}`,
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:395:    const explicitTitle = normalizeOptionalText(data.title);
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:415:        : Array.isArray(data.trigger_phrases)
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:416:            ? data.trigger_phrases
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:514:            cloned.title = explicitTitle;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:528:        const fastPathTier = data.importanceTier || data.importance_tier;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:601:        normalized.title = explicitTitle;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:729:    const slowPathTier = data.importanceTier || data.importance_tier;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:781:    'title', 'description',
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:788:    'triggerPhrases', 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:789:    'importanceTier', 'importance_tier',
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:843:    if (data.title !== undefined && typeof data.title !== 'string') {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:844:        errors.push('title must be a string');
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:856:    if (Array.isArray(data.trigger_phrases)) {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:857:        for (let i = 0; i < data.trigger_phrases.length; i++) {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:858:            if (typeof data.trigger_phrases[i] === 'string' && data.trigger_phrases[i].length > 200) {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:859:                errors.push(`trigger_phrases[${i}] exceeds maximum length of 200 characters`);
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:877:    if (data.trigger_phrases !== undefined && !Array.isArray(data.trigger_phrases)) {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:878:        errors.push('trigger_phrases must be an array');
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:928:    if (data.importance_tier !== undefined && !validTiers.includes(data.importance_tier)) {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:929:        errors.push(`Invalid importance_tier: ${data.importance_tier}. Valid values: ${validTiers.join(', ')}`);
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:965: * Build a descriptive observation title from a tool call.
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:966: * Uses the tool's file path, pattern, or command to create a meaningful title
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:972:    // Prefer the tool's own title if it's descriptive (not just a tool name)
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:973:    if (tool.title && tool.title.length > 10 && !/^Tool:\s/i.test(tool.title)) {
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:974:        return tool.title.substring(0, 80);
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:1104:        sessionTitle: capture.sessionTitle ?? raw.session_title,
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:1148:            title: tool.title || '',
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:1263:                    title: ex.assistantResponse.substring(0, 80),
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:1276:            title: toolTitle,
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:1277:            narrative: tool.title || `Executed ${tool.tool}`,
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.js:1353:                    DESCRIPTION: tool.title || `${tool.tool === 'write' ? 'Created' : 'Edited'} via ${tool.tool} tool`,
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:87:export function sanitizeMemoryFrontmatterTitle(title?: string | null): string {
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:88:  if (!title) {
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:92:  return stripMarkdownNoise(title)
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:100:  title?: string | null;
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:105:    options.title,
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:125:  title?: string | null;
.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:141:    sanitizeMemoryFrontmatterTitle(options.title),
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:60:    const input = `---\ntitle: "Old Title"\ncustom_meta: "keep-me"\ntriggerPhrases:\n  - "legacy"\n---\n\n# Spec Header\n\nContent body.\n`;
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:76:  // T-FMB-003: Long titles keep disambiguating suffix and max length.
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:78:    const longTitle = '# This is an intentionally very long heading designed to exceed the normal dashboard title width for suffix retention tests\n\nBody.';
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:85:    const titleMatch = result.content.match(/^title:\s*"(.+)"/m);
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:86:    const title = titleMatch ? titleMatch[1] : '';
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:87:    const suffixOk = title.endsWith('[007-frontmatter-test/spec]');
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:88:    const lengthOk = title.length <= 120;
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:91:      pass('T-FMB-003: Truncated title keeps suffix', `length=${title.length}`);
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:93:      fail('T-FMB-003: Truncated title keeps suffix', `suffixOk=${suffixOk}, lengthOk=${lengthOk}, title="${title}"`);
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:96:    fail('T-FMB-003: Truncated title keeps suffix', error.message);
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:117:      '<!-- header -->\n\n---\nimportance_tier: normal\ncontextType: general\n---\n\n# SESSION SUMMARY\n\n| **Meta Data** | **Value** |\n|:--------------|:----------|\n| Importance Tier | normal |\n| Context Type | general |\n',
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:165:    const hasCanonical = result.content.includes('trigger_phrases:') &&
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:166:      result.content.includes('importance_tier: "important"') &&
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:214:    const malformedInput = '---\ntitle: "Unclosed frontmatter"\ncontextType: implementation\n# Missing closing delimiter on purpose\n';
.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:285:title: "Malformed List"
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.js:80:function sanitizeMemoryFrontmatterTitle(title) {
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.js:81:    if (!title) {
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.js:84:    return stripMarkdownNoise(title)
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.js:92:        options.title,
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.js:115:        sanitizeMemoryFrontmatterTitle(options.title),
.opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts:94:  title: string,
.opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts:123:\u2502  DECISION: ${padText(title, innerWidth - 10)}  \u2502
.opencode/skill/system-spec-kit/scripts/dist/tsconfig.tsbuildinfo:1:{"fileNames":["../../node_modules/typescript/lib/lib.es5.d.ts","../../node_modules/typescript/lib/lib.es2015.d.ts","../../node_modules/typescript/lib/lib.es2016.d.ts","../../node_modules/typescript/lib/lib.es2017.d.ts","../../node_modules/typescript/lib/lib.es2018.d.ts","../../node_modules/typescript/lib/lib.es2019.d.ts","../../node_modules/typescript/lib/lib.es2020.d.ts","../../node_modules/typescript/lib/lib.es2021.d.ts","../../node_modules/typescript/lib/lib.es2022.d.ts","../../node_modules/typescript/lib/lib.dom.d.ts","../../node_modules/typescript/lib/lib.dom.iterable.d.ts","../../node_modules/typescript/lib/lib.dom.asynciterable.d.ts","../../node_modules/typescript/lib/lib.webworker.importscripts.d.ts","../../node_modules/typescript/lib/lib.scripthost.d.ts","../../node_modules/typescript/lib/lib.es2015.core.d.ts","../../node_modules/typescript/lib/lib.es2015.collection.d.ts","../../node_modules/typescript/lib/lib.es2015.generator.d.ts","../../node_modules/typescript/lib/lib.es2015.iterable.d.ts","../../node_modules/typescript/lib/lib.es2015.promise.d.ts","../../node_modules/typescript/lib/lib.es2015.proxy.d.ts","../../node_modules/typescript/lib/lib.es2015.reflect.d.ts","../../node_modules/typescript/lib/lib.es2015.symbol.d.ts","../../node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts","../../node_modules/typescript/lib/lib.es2016.array.include.d.ts","../../node_modules/typescript/lib/lib.es2016.intl.d.ts","../../node_modules/typescript/lib/lib.es2017.arraybuffer.d.ts","../../node_modules/typescript/lib/lib.es2017.date.d.ts","../../node_modules/typescript/lib/lib.es2017.object.d.ts","../../node_modules/typescript/lib/lib.es2017.sharedmemory.d.ts","../../node_modules/typescript/lib/lib.es2017.string.d.ts","../../node_modules/typescript/lib/lib.es2017.intl.d.ts","../../node_modules/typescript/lib/lib.es2017.typedarrays.d.ts","../../node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts","../../node_modules/typescript/lib/lib.es2018.asynciterable.d.ts","../../node_modules/typescript/lib/lib.es2018.intl.d.ts","../../node_modules/typescript/lib/lib.es2018.promise.d.ts","../../node_modules/typescript/lib/lib.es2018.regexp.d.ts","../../node_modules/typescript/lib/lib.es2019.array.d.ts","../../node_modules/typescript/lib/lib.es2019.object.d.ts","../../node_modules/typescript/lib/lib.es2019.string.d.ts","../../node_modules/typescript/lib/lib.es2019.symbol.d.ts","../../node_modules/typescript/lib/lib.es2019.intl.d.ts","../../node_modules/typescript/lib/lib.es2020.bigint.d.ts","../../node_modules/typescript/lib/lib.es2020.date.d.ts","../../node_modules/typescript/lib/lib.es2020.promise.d.ts","../../node_modules/typescript/lib/lib.es2020.sharedmemory.d.ts","../../node_modules/typescript/lib/lib.es2020.string.d.ts","../../node_modules/typescript/lib/lib.es2020.symbol.wellknown.d.ts","../../node_modules/typescript/lib/lib.es2020.intl.d.ts","../../node_modules/typescript/lib/lib.es2020.number.d.ts","../../node_modules/typescript/lib/lib.es2021.promise.d.ts","../../node_modules/typescript/lib/lib.es2021.string.d.ts","../../node_modules/typescript/lib/lib.es2021.weakref.d.ts","../../node_modules/typescript/lib/lib.es2021.intl.d.ts","../../node_modules/typescript/lib/lib.es2022.array.d.ts","../../node_modules/typescript/lib/lib.es2022.error.d.ts","../../node_modules/typescript/lib/lib.es2022.intl.d.ts","../../node_modules/typescript/lib/lib.es2022.object.d.ts","../../node_modules/typescript/lib/lib.es2022.string.d.ts","../../node_modules/typescript/lib/lib.es2022.regexp.d.ts","../../node_modules/typescript/lib/lib.esnext.disposable.d.ts","../../node_modules/typescript/lib/lib.esnext.float16.d.ts","../../node_modules/typescript/lib/lib.decorators.d.ts","../../node_modules/typescript/lib/lib.decorators.legacy.d.ts","../../node_modules/typescript/lib/lib.es2022.full.d.ts","../migrate-deep-research-paths.ts","../lib/anchor-generator.ts","../wrap-all-templates.ts","../../shared/dist/utils/jsonc-strip.d.ts","../utils/logger.ts","../core/config.ts","../config/index.ts","../utils/file-helpers.ts","../extractors/spec-folder-extractor.ts","../../shared/dist/utils/path-security.d.ts","../types/save-mode.ts","../types/session-types.ts","../core/workflow-path-utils.ts","../core/workflow-accessors.ts","../../shared/dist/utils/token-estimate.d.ts","../core/tree-thinning.ts","../core/alignment-validator.ts","../core/content-cleaner.ts","../utils/validation-utils.ts","../core/file-writer.ts","../core/find-predecessor-memory.ts","../../shared/dist/parsing/spec-doc-health.d.ts","../lib/trigger-phrase-sanitizer.ts","../core/frontmatter-editor.ts","../core/subfolder-utils.ts","../core/index.ts","../utils/path-utils.ts","../utils/workspace-identity.ts","../utils/spec-affinity.ts","../utils/data-validator.ts","../lib/truncate-on-word-boundary.ts","../utils/input-normalizer.ts","../utils/fact-coercion.ts","../utils/prompt-utils.ts","../../shared/dist/normalization.d.ts","../../shared/dist/types.d.ts","../../shared/dist/trigger-extractor.d.ts","../lib/topic-keywords.ts","../lib/semantic-signal-extractor.ts","../lib/phase-classifier.ts","../utils/tool-detection.ts","../utils/message-utils.ts","../utils/tool-sanitizer.ts","../utils/slug-utils.ts","../utils/source-capabilities.ts","../utils/index.ts","../../shared/dist/embeddings/factory.d.ts","../../shared/dist/chunking.d.ts","../../shared/dist/embeddings.d.ts","../lib/embeddings.ts","../../mcp_server/dist/lib/search/search-types.d.ts","../../mcp_server/dist/lib/search/query-classifier.d.ts","../../mcp_server/dist/lib/search/query-router.d.ts","../../mcp_server/dist/lib/search/search-flags.d.ts","../../mcp_server/dist/lib/search/dynamic-token-budget.d.ts","../../node_modules/@types/node/compatibility/iterators.d.ts","../../node_modules/@types/node/globals.typedarray.d.ts","../../node_modules/@types/node/buffer.buffer.d.ts","../../node_modules/@types/node/globals.d.ts","../../node_modules/@types/node/web-globals/abortcontroller.d.ts","../../node_modules/@types/node/web-globals/blob.d.ts","../../node_modules/@types/node/web-globals/console.d.ts","../../node_modules/@types/node/web-globals/crypto.d.ts","../../node_modules/@types/node/web-globals/domexception.d.ts","../../node_modules/@types/node/web-globals/encoding.d.ts","../../node_modules/@types/node/web-globals/events.d.ts","../../node_modules/@types/node/node_modules/undici-types/utility.d.ts","../../node_modules/@types/node/node_modules/undici-types/header.d.ts","../../node_modules/@types/node/node_modules/undici-types/readable.d.ts","../../node_modules/@types/node/node_modules/undici-types/fetch.d.ts","../../node_modules/@types/node/node_modules/undici-types/formdata.d.ts","../../node_modules/@types/node/node_modules/undici-types/connector.d.ts","../../node_modules/@types/node/node_modules/undici-types/client-stats.d.ts","../../node_modules/@types/node/node_modules/undici-types/client.d.ts","../../node_modules/@types/node/node_modules/undici-types/errors.d.ts","../../node_modules/@types/node/node_modules/undici-types/dispatcher.d.ts","../../node_modules/@types/node/node_modules/undici-types/global-dispatcher.d.ts","../../node_modules/@types/node/node_modules/undici-types/global-origin.d.ts","../../node_modules/@types/node/node_modules/undici-types/pool-stats.d.ts","../../node_modules/@types/node/node_modules/undici-types/pool.d.ts","../../node_modules/@types/node/node_modules/undici-types/handlers.d.ts","../../node_modules/@types/node/node_modules/undici-types/balanced-pool.d.ts","../../node_modules/@types/node/node_modules/undici-types/h2c-client.d.ts","../../node_modules/@types/node/node_modules/undici-types/agent.d.ts","../../node_modules/@types/node/node_modules/undici-types/mock-interceptor.d.ts","../../node_modules/@types/node/node_modules/undici-types/mock-call-history.d.ts","../../node_modules/@types/node/node_modules/undici-types/mock-agent.d.ts","../../node_modules/@types/node/node_modules/undici-types/mock-client.d.ts","../../node_modules/@types/node/node_modules/undici-types/mock-pool.d.ts","../../node_modules/@types/node/node_modules/undici-types/snapshot-agent.d.ts","../../node_modules/@types/node/node_modules/undici-types/mock-errors.d.ts","../../node_modules/@types/node/node_modules/undici-types/proxy-agent.d.ts","../../node_modules/@types/node/node_modules/undici-types/env-http-proxy-agent.d.ts","../../node_modules/@types/node/node_modules/undici-types/retry-handler.d.ts","../../node_modules/@types/node/node_modules/undici-types/retry-agent.d.ts","../../node_modules/@types/node/node_modules/undici-types/api.d.ts","../../node_modules/@types/node/node_modules/undici-types/cache-interceptor.d.ts","../../node_modules/@types/node/node_modules/undici-types/interceptors.d.ts","../../node_modules/@types/node/node_modules/undici-types/util.d.ts","../../node_modules/@types/node/node_modules/undici-types/cookies.d.ts","../../node_modules/@types/node/node_modules/undici-types/patch.d.ts","../../node_modules/@types/node/node_modules/undici-types/websocket.d.ts","../../node_modules/@types/node/node_modules/undici-types/eventsource.d.ts","../../node_modules/@types/node/node_modules/undici-types/diagnostics-channel.d.ts","../../node_modules/@types/node/node_modules/undici-types/content-type.d.ts","../../node_modules/@types/node/node_modules/undici-types/cache.d.ts","../../node_modules/@types/node/node_modules/undici-types/index.d.ts","../../node_modules/@types/node/web-globals/fetch.d.ts","../../node_modules/@types/node/web-globals/importmeta.d.ts","../../node_modules/@types/node/web-globals/messaging.d.ts","../../node_modules/@types/node/web-globals/navigator.d.ts","../../node_modules/@types/node/web-globals/performance.d.ts","../../node_modules/@types/node/web-globals/storage.d.ts","../../node_modules/@types/node/web-globals/streams.d.ts","../../node_modules/@types/node/web-globals/timers.d.ts","../../node_modules/@types/node/web-globals/url.d.ts","../../node_modules/@types/node/assert.d.ts","../../node_modules/@types/node/assert/strict.d.ts","../../node_modules/@types/node/async_hooks.d.ts","../../node_modules/@types/node/buffer.d.ts","../../node_modules/@types/node/child_process.d.ts","../../node_modules/@types/node/cluster.d.ts","../../node_modules/@types/node/console.d.ts","../../node_modules/@types/node/constants.d.ts","../../node_modules/@types/node/crypto.d.ts","../../node_modules/@types/node/dgram.d.ts","../../node_modules/@types/node/diagnostics_channel.d.ts","../../node_modules/@types/node/dns.d.ts","../../node_modules/@types/node/dns/promises.d.ts","../../node_modules/@types/node/domain.d.ts","../../node_modules/@types/node/events.d.ts","../../node_modules/@types/node/fs.d.ts","../../node_modules/@types/node/fs/promises.d.ts","../../node_modules/@types/node/http.d.ts","../../node_modules/@types/node/http2.d.ts","../../node_modules/@types/node/https.d.ts","../../node_modules/@types/node/inspector.d.ts","../../node_modules/@types/node/inspector.generated.d.ts","../../node_modules/@types/node/inspector/promises.d.ts","../../node_modules/@types/node/module.d.ts","../../node_modules/@types/node/net.d.ts","../../node_modules/@types/node/os.d.ts","../../node_modules/@types/node/path.d.ts","../../node_modules/@types/node/path/posix.d.ts","../../node_modules/@types/node/path/win32.d.ts","../../node_modules/@types/node/perf_hooks.d.ts","../../node_modules/@types/node/process.d.ts","../../node_modules/@types/node/punycode.d.ts","../../node_modules/@types/node/querystring.d.ts","../../node_modules/@types/node/quic.d.ts","../../node_modules/@types/node/readline.d.ts","../../node_modules/@types/node/readline/promises.d.ts","../../node_modules/@types/node/repl.d.ts","../../node_modules/@types/node/sea.d.ts","../../node_modules/@types/node/sqlite.d.ts","../../node_modules/@types/node/stream.d.ts","../../node_modules/@types/node/stream/consumers.d.ts","../../node_modules/@types/node/stream/promises.d.ts","../../node_modules/@types/node/stream/web.d.ts","../../node_modules/@types/node/string_decoder.d.ts","../../node_modules/@types/node/test.d.ts","../../node_modules/@types/node/test/reporters.d.ts","../../node_modules/@types/node/timers.d.ts","../../node_modules/@types/node/timers/promises.d.ts","../../node_modules/@types/node/tls.d.ts","../../node_modules/@types/node/trace_events.d.ts","../../node_modules/@types/node/tty.d.ts","../../node_modules/@types/node/url.d.ts","../../node_modules/@types/node/util.d.ts","../../node_modules/@types/node/util/types.d.ts","../../node_modules/@types/node/v8.d.ts","../../node_modules/@types/node/vm.d.ts","../../node_modules/@types/node/wasi.d.ts","../../node_modules/@types/node/worker_threads.d.ts","../../node_modules/@types/node/zlib.d.ts","../../node_modules/@types/node/index.d.ts","../../node_modules/@types/better-sqlite3/index.d.ts","../../mcp_server/dist/lib/search/hybrid-search.d.ts","../../mcp_server/dist/lib/search/bm25-index.d.ts","../../mcp_server/dist/lib/search/sqlite-fts.d.ts","../../mcp_server/dist/lib/search/vector-index-types.d.ts","../../mcp_server/dist/lib/search/vector-index-schema.d.ts","../../mcp_server/dist/lib/search/vector-index-mutations.d.ts","../../mcp_server/dist/lib/search/vector-index-queries.d.ts","../../mcp_server/dist/lib/search/vector-index-aliases.d.ts","../../mcp_server/dist/lib/interfaces/vector-store.d.ts","../../mcp_server/dist/lib/search/vector-index-store.d.ts","../../mcp_server/dist/lib/search/vector-index.d.ts","../../mcp_server/dist/api/search.d.ts","../../shared/dist/config.d.ts","../lib/trigger-extractor.ts","../../shared/dist/paths.d.ts","../spec-folder/alignment-validator.ts","../lib/session-activity-signal.ts","../spec-folder/folder-detector.ts","../spec-folder/directory-setup.ts","../spec-folder/nested-changelog.ts","../spec-folder/index.ts","../extractors/session-extractor.ts","../extractors/file-extractor.ts","../extractors/implementation-guide-extractor.ts","../lib/simulation-factory.ts","../extractors/collect-session-data.ts","../../shared/dist/parsing/quality-extractors.d.ts","../../shared/dist/context-types.d.ts","../../shared/dist/embeddings/profile.d.ts","../../shared/dist/algorithms/rrf-fusion.d.ts","../../shared/dist/algorithms/adaptive-fusion.d.ts","../../shared/dist/algorithms/mmr-reranker.d.ts","../../shared/dist/algorithms/index.d.ts","../../shared/dist/contracts/retrieval-trace.d.ts","../../shared/dist/utils/retry.d.ts","../../shared/dist/scoring/folder-scoring.d.ts","../../shared/dist/ranking/matrix-math.d.ts","../../shared/dist/ranking/learned-combiner.d.ts","../../shared/dist/index.d.ts","../core/memory-indexer.ts","../../shared/dist/parsing/memory-sufficiency.d.ts","../core/memory-metadata.ts","../lib/memory-telemetry.ts","../core/post-save-review.ts","../lib/content-filter.ts","../lib/validate-memory-quality.ts","../core/quality-gates.ts","../extractors/contamination-filter.ts","../core/quality-scorer.ts","../utils/task-enrichment.ts","../core/title-builder.ts","../core/topic-extractor.ts","../lib/flowchart-generator.ts","../lib/ascii-boxes.ts","../lib/decision-tree-generator.ts","../extractors/diagram-extractor.ts","../extractors/conversation-extractor.ts","../extractors/decision-extractor.ts","../extractors/quality-scorer.ts","../extractors/git-context-extractor.ts","../extractors/index.ts","../renderers/template-renderer.ts","../renderers/index.ts","../lib/memory-frontmatter.ts","../lib/semantic-summarizer.ts","../../shared/dist/parsing/memory-template-contract.d.ts","../loaders/data-loader.ts","../../mcp_server/dist/lib/providers/embeddings.d.ts","../../mcp_server/dist/lib/providers/retry-manager.d.ts","../../mcp_server/dist/api/providers.d.ts","../core/workflow.ts","../evals/check-allowlist-expiry.ts","../../node_modules/typescript/lib/typescript.d.ts","../evals/check-architecture-boundaries.ts","../evals/check-handler-cycles-ast.ts","../evals/import-policy-rules.ts","../evals/check-no-mcp-lib-imports-ast.ts","../evals/check-no-mcp-lib-imports.ts","../evals/check-source-dist-alignment.ts","../evals/collect-redaction-calibration-inputs.ts","../evals/map-ground-truth-ids.ts","../../mcp_server/dist/lib/eval/eval-metrics.d.ts","../../mcp_server/dist/lib/eval/ablation-framework.d.ts","../../mcp_server/dist/lib/eval/bm25-baseline.d.ts","../../mcp_server/dist/lib/eval/ground-truth-data.d.ts","../../mcp_server/dist/lib/eval/ground-truth-generator.d.ts","../../mcp_server/dist/lib/eval/eval-db.d.ts","../../mcp_server/dist/api/eval.d.ts","../../mcp_server/dist/api/indexing.d.ts","../../mcp_server/dist/lib/governance/scope-governance.d.ts","../../mcp_server/dist/lib/storage/checkpoints.d.ts","../../mcp_server/dist/lib/storage/access-tracker.d.ts","../../mcp_server/dist/api/storage.d.ts","../../mcp_server/dist/lib/search/folder-discovery.d.ts","../../mcp_server/dist/lib/search/entity-linker.d.ts","../../mcp_server/dist/lib/extraction/entity-extractor.d.ts","../../mcp_server/dist/lib/search/session-boost.d.ts","../../mcp_server/dist/lib/search/causal-boost.d.ts","../../mcp_server/dist/lib/cognitive/working-memory.d.ts","../../mcp_server/dist/lib/extraction/extraction-adapter.d.ts","../../mcp_server/dist/lib/architecture/layer-definitions.d.ts","../../mcp_server/dist/lib/collab/shared-spaces.d.ts","../../mcp_server/dist/lib/config/capability-flags.d.ts","../../mcp_server/dist/api/index.d.ts","../evals/run-ablation.ts","../evals/run-bm25-baseline.ts","../evals/run-performance-benchmarks.ts","../evals/run-redaction-calibration.ts","../extractors/session-activity-signal.ts","../lib/cli-capture-shared.ts","../lib/frontmatter-migration.ts","../loaders/index.ts","../../shared/dist/lib/structure-aware-chunker.d.ts","../memory/ast-parser.ts","../memory/backfill-frontmatter.ts","../node_modules/sqlite-vec/index.d.ts","../memory/cleanup-orphaned-vectors.ts","../memory/generate-context.ts","../memory/migrate-historical-json-mode-memories.ts","../memory/migrate-trigger-phrase-residual.ts","../memory/rank-memories.ts","../memory/rebuild-auto-entities.ts","../memory/reindex-embeddings.ts","../memory/validate-memory-quality.ts","../spec-folder/generate-description.ts","../utils/memory-frontmatter.ts","../utils/phase-classifier.ts"],"fileIdsList":[[123,185,193,197,200,202,203,204,216,325,326,328,329],[123,185,193,197,200,202,203,204,216,254,312,330,331,335,336,338,339,340,341,342,343,344,345],[101,123,185,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,310,311],[123,185,193,197,200,202,203,204,216,243,245,253],[123,185,193,197,200,202,203,204,216,333,334],[123,185,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,242],[123,185,193,197,200,202,203,204,216,242,332],[123,185,193,197,200,202,203,204,216,242,324],[123,185,193,197,200,202,203,204,216,242,327],[123,185,193,197,200,202,203,204,216,242,337],[114,123,185,193,197,200,202,203,204,216],[117,119,123,185,193,197,200,202,203,204,216],[116,118,120,123,185,193,197,200,202,203,204,216,242],[117,123,185,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,242,244],[123,185,193,197,200,202,203,204,216,242,246],[123,185,193,197,200,202,203,204,216,242,246,251],[123,185,193,197,200,202,203,204,216,246,247,248,249,250,252],[123,185,193,197,200,202,203,204,216,241],[123,182,183,185,193,197,200,202,203,204,216],[123,184,185,193,197,200,202,203,204,216],[185,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,224],[123,185,186,191,193,196,197,200,202,203,204,206,216,221,233],[123,185,186,187,193,196,197,200,202,203,204,216],[123,185,188,193,197,200,202,203,204,216,234],[123,185,189,190,193,197,200,202,203,204,207,216],[123,185,190,193,197,200,202,203,204,216,221,230],[123,185,191,193,196,197,200,202,203,204,206,216],[123,184,185,192,193,197,200,202,203,204,216],[123,185,193,194,197,200,202,203,204,216],[123,185,193,195,196,197,200,202,203,204,216],[123,184,185,193,196,197,200,202,203,204,216],[123,185,193,196,197,198,200,202,203,204,216,221,233],[123,185,193,196,197,198,200,202,203,204,216,221,224],[123,172,185,193,196,197,199,200,202,203,204,206,216,221,233],[123,185,193,196,197,199,200,202,203,204,206,216,221,230,233],[123,185,193,197,199,200,201,202,203,204,216,221,230,233],[121,122,123,124,125,126,127,128,129,130,131,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240],[123,185,193,196,197,200,202,203,204,216],[123,185,193,197,200,202,204,216],[123,185,193,197,200,202,203,204,205,216,233],[123,185,193,196,197,200,202,203,204,206,216,221],[123,138,141,144,145,185,193,197,200,202,203,204,216,233],[123,141,185,193,197,200,202,203,204,216,221,233],[123,141,145,185,193,197,200,202,203,204,216,233],[123,185,193,197,200,202,203,204,216,221],[123,135,185,193,197,200,202,203,204,216],[123,139,185,193,197,200,202,203,204,216],[123,137,138,141,185,193,197,200,202,203,204,216,233],[123,185,193,197,200,202,203,204,206,216,230],[123,135,185,193,197,200,202,203,204,216,241],[123,137,141,185,193,197,200,202,203,204,206,216,233],[123,132,133,134,136,140,185,193,196,197,200,202,203,204,216,221,233],[123,141,149,157,185,193,197,200,202,203,204,216],[123,133,139,185,193,197,200,202,203,204,216],[123,141,166,167,185,193,197,200,202,203,204,216],[123,133,136,141,185,193,197,200,202,203,204,216,224,233,241],[123,141,185,193,197,200,202,203,204,216],[123,137,141,185,193,197,200,202,203,204,216,233],[123,132,185,193,197,200,202,203,204,216],[123,135,136,137,139,140,141,142,143,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,167,168,169,170,171,185,193,197,200,202,203,204,216],[123,141,159,162,185,193,197,200,202,203,204,216],[123,141,149,150,151,185,193,197,200,202,203,204,216],[123,139,141,150,152,185,193,197,200,202,203,204,216],[123,140,185,193,197,200,202,203,204,216],[123,133,135,141,185,193,197,200,202,203,204,216],[123,141,145,150,152,185,193,197,200,202,203,204,216],[123,145,185,193,197,200,202,203,204,216],[123,139,141,144,185,193,197,200,202,203,204,216,233],[123,133,137,141,149,185,193,197,200,202,203,204,216],[123,141,159,185,193,197,200,202,203,204,216],[123,152,185,193,197,200,202,203,204,216],[123,135,141,166,185,193,197,200,202,203,204,216,224,239,241],[123,185,193,197,200,202,203,204,207,216],[123,185,193,197,200,202,203,204,208,216],[123,185,193,196,197,200,202,203,204,211,216],[123,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240],[123,185,193,197,200,202,203,204,213,216],[123,185,193,197,200,202,203,204,214,216],[123,185,190,193,197,200,202,203,204,206,216,224],[123,185,193,196,197,200,202,203,204,216,217],[123,185,193,197,200,202,203,204,216,218,234,237],[123,185,193,196,197,200,202,203,204,216,221,223,224],[123,185,193,197,200,202,203,204,216,222,224],[123,185,193,197,200,202,203,204,216,224,234],[123,185,193,197,200,202,203,204,216,225],[123,182,185,193,197,200,202,203,204,216,221,227,233],[123,185,193,197,200,202,203,204,216,221,226],[123,185,193,196,197,200,202,203,204,216,228,229],[123,185,193,197,200,202,203,204,216,228,229],[123,185,190,193,197,200,202,203,204,206,216,221,230],[123,185,193,197,200,202,203,204,216,231],[123,185,193,197,200,202,203,204,206,216,232],[123,185,193,197,199,200,202,203,204,214,216,233],[123,185,193,197,200,202,203,204,216,234,235],[123,185,190,193,197,200,202,203,204,216,235],[123,185,193,197,200,202,203,204,216,221,236],[123,185,193,197,200,202,203,204,205,216,237],[123,185,193,197,200,202,203,204,216,238],[123,185,188,193,197,200,202,203,204,216],[123,185,190,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,234],[123,172,185,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,233],[123,185,193,197,200,202,203,204,216,239],[123,185,193,197,200,202,203,204,211,216],[123,185,193,197,200,202,203,204,216,229],[123,172,185,193,196,197,198,200,202,203,204,211,216,221,224,233,236,237,239],[123,185,193,197,200,202,203,204,216,221,240],[71,123,185,193,197,200,202,203,204,216],[74,77,78,79,81,123,185,193,197,200,202,203,204,208,216],[69,70,123,185,193,197,200,202,203,204,208,216],[84,123,185,190,193,197,198,200,202,203,204,208,216],[123,185,193,197,198,200,202,203,204,208,216],[77,87,88,123,185,193,197,200,202,203,204,208,216],[71,90,123,185,193,197,200,202,203,204,216],[111,115,123,185,193,197,198,200,202,203,204,208,216,254,255,256,268,269,281],[77,79,123,185,190,193,197,200,202,203,204,208,216,268,283],[70,76,86,88,123,185,193,197,200,202,203,204,216,285],[123,185,193,197,200,202,203,204,216,283,288],[73,77,109,123,185,193,197,200,202,203,204,216,283,290],[71,123,185,193,197,198,200,202,203,204,208,216],[109,123,185,193,197,200,202,203,204,208,216,292],[104,123,185,193,197,200,202,203,204,216],[80,123,185,193,197,200,202,203,204,216],[75,77,123,185,193,197,200,202,203,204,208,216],[70,71,74,76,77,78,79,81,82,83,85,86,87,88,89,94,97,109,110,115,123,185,190,193,197,200,202,203,204,208,216,256,263,265,267,268,282,283,284,285,286,287,288,289,290,292,293,294,295,301,302,303,305,306,307,308,309,312],[123,185,193,197,200,202,203,204,208,216,315],[123,185,193,197,200,202,203,204,208,216,315,318],[123,185,193,197,200,202,203,204,208,216,318],[123,185,186,193,197,200,202,203,204,208,216],[123,185,193,197,200,202,203,204,208,216,242],[123,185,193,197,200,202,203,204,208,216,346],[123,185,193,197,200,202,203,204,208,216,242,346],[123,185,193,197,200,202,203,204,208,211,216,242,346],[70,72,76,77,96,98,107,109,123,185,186,193,197,200,202,203,204,208,216,263,264,265,266,267],[97,110,123,185,193,197,200,202,203,204,216],[72,77,98,105,106,107,123,185,193,197,200,202,203,204,216,265,295],[67,77,95,96,98,107,123,185,193,197,200,202,203,204,216,297],[77,95,98,106,123,185,193,197,200,202,203,204,216,267,295,297],[67,72,73,77,92,98,123,185,193,197,200,202,203,204,216],[74,77,123,185,186,193,197,200,202,203,204,208,216],[77,109,123,185,190,193,197,200,202,203,204,216,265],[74,123,185,193,197,200,202,203,204,216,259,264,265,266,268,290,298,299,300,301,302],[77,123,185,193,197,200,202,203,204,216,288,290],[123,185,193,197,200,202,203,204,216,259],[72,77,104,123,185,186,190,193,197,198,200,202,203,204,208,216],[72,73,123,185,193,197,200,202,203,204,208,216],[97,123,185,193,197,198,200,202,203,204,216],[69,70,123,185,190,193,197,200,202,203,204,208,216],[77,123,185,193,197,200,202,203,204,216,296],[123,185,193,197,200,202,203,204,208,216,264,270],[123,185,193,197,200,202,203,204,216,256],[70,123,185,193,197,200,202,203,204,216],[77,104,123,185,193,197,200,202,203,204,216],[88,101,102,103,123,185,193,197,200,202,203,204,216],[73,91,104,123,185,193,197,200,202,203,204,207,216,281],[77,123,185,193,197,200,202,203,204,216],[77,123,185,190,193,197,200,202,203,204,216],[101,102,104,123,185,193,197,200,202,203,204,216],[70,97,110,123,185,193,197,200,202,203,204,208,216,287],[91,97,111,123,185,193,197,198,200,202,203,204,207,208,216],[123,185,193,197,200,202,203,204,216,309],[123,185,193,197,200,202,203,204,216,355],[123,185,193,197,200,202,203,204,208,216,353],[123,185,193,197,200,202,203,204,216,242,257,358],[75,91,123,185,193,197,200,202,203,204,208,216,268,313,354],[88,123,185,193,197,200,202,203,204,208,216],[88,123,185,190,193,197,200,202,203,204,207,208,216,353],[123,185,193,197,200,202,203,204,208,216,278],[123,185,193,197,200,202,203,204,216,242,257],[101,123,185,193,197,200,202,203,204,216,331],[123,185,193,197,200,202,203,204,208,216,288],[123,185,193,197,200,202,203,204,216,304],[70,91,123,185,193,197,198,200,202,203,204,208,216],[77,99,123,185,193,197,198,200,202,203,204,208,216],[91,111,123,185,193,197,198,200,202,203,204,208,216],[75,91,99,123,185,186,193,197,198,200,202,203,204,208,216,242,257,258,259],[123,185,193,197,200,202,203,204,216,258,260,261,262],[75,91,123,185,193,197,200,202,203,204,208,216],[76,123,185,193,197,200,202,203,204,216],[70,73,84,92,93,94,95,97,98,99,106,107,108,109,110,123,185,193,197,200,202,203,204,216],[70,76,77,94,96,123,185,193,197,200,202,203,204,216],[123,185,193,197,200,202,203,204,216,306],[70,77,91,123,185,193,197,200,202,203,204,216],[70,123,185,193,197,200,202,203,204,208,216],[105,123,185,193,197,200,202,203,204,216],[123,185,190,193,197,200,202,203,204,208,216],[97,123,185,193,197,200,202,203,204,216],[77,123,185,193,197,200,202,203,204,208,216],[109,123,185,193,197,200,202,203,204,216],[77,105,123,185,193,197,200,202,203,204,216],[93,123,185,193,197,200,202,203,204,216],[67,123,185,193,197,200,202,203,204,208,216],[123,185,193,197,200,202,203,204,216,272],[123,185,193,197,200,202,203,204,216,272,273,274],[101,112,113,123,185,193,197,200,202,203,204,216],[69,75,101,102,112,113,114,123,185,193,197,200,202,203,204,216,255,257,270,271,275,276,277,278,280],[123,185,193,197,200,202,203,204,216,279],[100,123,185,193,197,200,202,203,204,216]],"fileInfos":[{"version":"c430d44666289dae81f30fa7b2edebf186ecc91a2d4c71266ea6ae76388792e1","affectsGlobalScope":true,"impliedFormat":1},{"version":"45b7ab580deca34ae9729e97c13cfd999df04416a79116c3bfb483804f85ded4","impliedFormat":1},{"version":"3facaf05f0c5fc569c5649dd359892c98a85557e3e0c847964caeb67076f4d75","impliedFormat":1},{"version":"e44bb8bbac7f10ecc786703fe0a6a4b952189f908707980ba8f3c8975a760962","impliedFormat":1},{"version":"5e1c4c362065a6b95ff952c0eab010f04dcd2c3494e813b493ecfd4fcb9fc0d8","impliedFormat":1},{"version":"68d73b4a11549f9c0b7d352d10e91e5dca8faa3322bfb77b661839c42b1ddec7","impliedFormat":1},{"version":"5efce4fc3c29ea84e8928f97adec086e3dc876365e0982cc8479a07954a3efd4","impliedFormat":1},{"version":"feecb1be483ed332fad555aff858affd90a48ab19ba7272ee084704eb7167569","impliedFormat":1},{"version":"ee7bad0c15b58988daa84371e0b89d313b762ab83cb5b31b8a2d1162e8eb41c2","impliedFormat":1},{"version":"080941d9f9ff9307f7e27a83bcd888b7c8270716c39af943532438932ec1d0b9","affectsGlobalScope":true,"impliedFormat":1},{"version":"2e80ee7a49e8ac312cc11b77f1475804bee36b3b2bc896bead8b6e1266befb43","affectsGlobalScope":true,"impliedFormat":1},{"version":"d7a3c8b952931daebdfc7a2897c53c0a1c73624593fa070e46bd537e64dcd20a","affectsGlobalScope":true,"impliedFormat":1},{"version":"80e18897e5884b6723488d4f5652167e7bb5024f946743134ecc4aa4ee731f89","affectsGlobalScope":true,"impliedFormat":1},{"version":"cd034f499c6cdca722b60c04b5b1b78e058487a7085a8e0d6fb50809947ee573","affectsGlobalScope":true,"impliedFormat":1},{"version":"c57796738e7f83dbc4b8e65132f11a377649c00dd3eee333f672b8f0a6bea671","affectsGlobalScope":true,"impliedFormat":1},{"version":"dc2df20b1bcdc8c2d34af4926e2c3ab15ffe1160a63e58b7e09833f616efff44","affectsGlobalScope":true,"impliedFormat":1},{"version":"515d0b7b9bea2e31ea4ec968e9edd2c39d3eebf4a2d5cbd04e88639819ae3b71","affectsGlobalScope":true,"impliedFormat":1},{"version":"0559b1f683ac7505ae451f9a96ce4c3c92bdc71411651ca6ddb0e88baaaad6a3","affectsGlobalScope":true,"impliedFormat":1},{"version":"0dc1e7ceda9b8b9b455c3a2d67b0412feab00bd2f66656cd8850e8831b08b537","affectsGlobalScope":true,"impliedFormat":1},{"version":"ce691fb9e5c64efb9547083e4a34091bcbe5bdb41027e310ebba8f7d96a98671","affectsGlobalScope":true,"impliedFormat":1},{"version":"8d697a2a929a5fcb38b7a65594020fcef05ec1630804a33748829c5ff53640d0","affectsGlobalScope":true,"impliedFormat":1},{"version":"4ff2a353abf8a80ee399af572debb8faab2d33ad38c4b4474cff7f26e7653b8d","affectsGlobalScope":true,"impliedFormat":1},{"version":"fb0f136d372979348d59b3f5020b4cdb81b5504192b1cacff5d1fbba29378aa1","affectsGlobalScope":true,"impliedFormat":1},{"version":"d15bea3d62cbbdb9797079416b8ac375ae99162a7fba5de2c6c505446486ac0a","affectsGlobalScope":true,"impliedFormat":1},{"version":"68d18b664c9d32a7336a70235958b8997ebc1c3b8505f4f1ae2b7e7753b87618","affectsGlobalScope":true,"impliedFormat":1},{"version":"eb3d66c8327153d8fa7dd03f9c58d351107fe824c79e9b56b462935176cdf12a","affectsGlobalScope":true,"impliedFormat":1},{"version":"38f0219c9e23c915ef9790ab1d680440d95419ad264816fa15009a8851e79119","affectsGlobalScope":true,"impliedFormat":1},{"version":"69ab18c3b76cd9b1be3d188eaf8bba06112ebbe2f47f6c322b5105a6fbc45a2e","affectsGlobalScope":true,"impliedFormat":1},{"version":"a680117f487a4d2f30ea46f1b4b7f58bef1480456e18ba53ee85c2746eeca012","affectsGlobalScope":true,"impliedFormat":1},{"version":"2f11ff796926e0832f9ae148008138ad583bd181899ab7dd768a2666700b1893","affectsGlobalScope":true,"impliedFormat":1},{"version":"4de680d5bb41c17f7f68e0419412ca23c98d5749dcaaea1896172f06435891fc","affectsGlobalScope":true,"impliedFormat":1},{"version":"954296b30da6d508a104a3a0b5d96b76495c709785c1d11610908e63481ee667","affectsGlobalScope":true,"impliedFormat":1},{"version":"ac9538681b19688c8eae65811b329d3744af679e0bdfa5d842d0e32524c73e1c","affectsGlobalScope":true,"impliedFormat":1},{"version":"0a969edff4bd52585473d24995c5ef223f6652d6ef46193309b3921d65dd4376","affectsGlobalScope":true,"impliedFormat":1},{"version":"9e9fbd7030c440b33d021da145d3232984c8bb7916f277e8ffd3dc2e3eae2bdb","affectsGlobalScope":true,"impliedFormat":1},{"version":"811ec78f7fefcabbda4bfa93b3eb67d9ae166ef95f9bff989d964061cbf81a0c","affectsGlobalScope":true,"impliedFormat":1},{"version":"717937616a17072082152a2ef351cb51f98802fb4b2fdabd32399843875974ca","affectsGlobalScope":true,"impliedFormat":1},{"version":"d7e7d9b7b50e5f22c915b525acc5a49a7a6584cf8f62d0569e557c5cfc4b2ac2","affectsGlobalScope":true,"impliedFormat":1},{"version":"71c37f4c9543f31dfced6c7840e068c5a5aacb7b89111a4364b1d5276b852557","affectsGlobalScope":true,"impliedFormat":1},{"version":"576711e016cf4f1804676043e6a0a5414252560eb57de9faceee34d79798c850","affectsGlobalScope":true,"impliedFormat":1},{"version":"89c1b1281ba7b8a96efc676b11b264de7a8374c5ea1e6617f11880a13fc56dc6","affectsGlobalScope":true,"impliedFormat":1},{"version":"74f7fa2d027d5b33eb0471c8e82a6c87216223181ec31247c357a3e8e2fddc5b","affectsGlobalScope":true,"impliedFormat":1},{"version":"d6d7ae4d1f1f3772e2a3cde568ed08991a8ae34a080ff1151af28b7f798e22ca","affectsGlobalScope":true,"impliedFormat":1},{"version":"063600664504610fe3e99b717a1223f8b1900087fab0b4cad1496a114744f8df","affectsGlobalScope":true,"impliedFormat":1},{"version":"934019d7e3c81950f9a8426d093458b65d5aff2c7c1511233c0fd5b941e608ab","affectsGlobalScope":true,"impliedFormat":1},{"version":"52ada8e0b6e0482b728070b7639ee42e83a9b1c22d205992756fe020fd9f4a47","affectsGlobalScope":true,"impliedFormat":1},{"version":"3bdefe1bfd4d6dee0e26f928f93ccc128f1b64d5d501ff4a8cf3c6371200e5e6","affectsGlobalScope":true,"impliedFormat":1},{"version":"59fb2c069260b4ba00b5643b907ef5d5341b167e7d1dbf58dfd895658bda2867","affectsGlobalScope":true,"impliedFormat":1},{"version":"639e512c0dfc3fad96a84caad71b8834d66329a1f28dc95e3946c9b58176c73a","affectsGlobalScope":true,"impliedFormat":1},{"version":"368af93f74c9c932edd84c58883e736c9e3d53cec1fe24c0b0ff451f529ceab1","affectsGlobalScope":true,"impliedFormat":1},{"version":"af3dd424cf267428f30ccfc376f47a2c0114546b55c44d8c0f1d57d841e28d74","affectsGlobalScope":true,"impliedFormat":1},{"version":"995c005ab91a498455ea8dfb63aa9f83fa2ea793c3d8aa344be4a1678d06d399","affectsGlobalScope":true,"impliedFormat":1},{"version":"959d36cddf5e7d572a65045b876f2956c973a586da58e5d26cde519184fd9b8a","affectsGlobalScope":true,"impliedFormat":1},{"version":"965f36eae237dd74e6cca203a43e9ca801ce38824ead814728a2807b1910117d","affectsGlobalScope":true,"impliedFormat":1},{"version":"3925a6c820dcb1a06506c90b1577db1fdbf7705d65b62b99dce4be75c637e26b","affectsGlobalScope":true,"impliedFormat":1},{"version":"0a3d63ef2b853447ec4f749d3f368ce642264246e02911fcb1590d8c161b8005","affectsGlobalScope":true,"impliedFormat":1},{"version":"8cdf8847677ac7d20486e54dd3fcf09eda95812ac8ace44b4418da1bbbab6eb8","affectsGlobalScope":true,"impliedFormat":1},{"version":"8444af78980e3b20b49324f4a16ba35024fef3ee069a0eb67616ea6ca821c47a","affectsGlobalScope":true,"impliedFormat":1},{"version":"3287d9d085fbd618c3971944b65b4be57859f5415f495b33a6adc994edd2f004","affectsGlobalScope":true,"impliedFormat":1},{"version":"b4b67b1a91182421f5df999988c690f14d813b9850b40acd06ed44691f6727ad","affectsGlobalScope":true,"impliedFormat":1},{"version":"51ad4c928303041605b4d7ae32e0c1ee387d43a24cd6f1ebf4a2699e1076d4fa","affectsGlobalScope":true,"impliedFormat":1},{"version":"196cb558a13d4533a5163286f30b0509ce0210e4b316c56c38d4c0fd2fb38405","affectsGlobalScope":true,"impliedFormat":1},{"version":"8e7f8264d0fb4c5339605a15daadb037bf238c10b654bb3eee14208f860a32ea","affectsGlobalScope":true,"impliedFormat":1},{"version":"782dec38049b92d4e85c1585fbea5474a219c6984a35b004963b00beb1aab538","affectsGlobalScope":true,"impliedFormat":1},{"version":"3cbad9a1ba4453443026ed38e4b8be018abb26565fa7c944376463ad9df07c41","impliedFormat":1},{"version":"db173462cabd53f426f57bd39768c1eb73b8b11e249a3c5e9246d93a91a3d5c1","signature":"43e818adf60173644896298637f47b01d5819b17eda46eaa32d0c7d64724d012"},{"version":"c0671b562ed1ebe5c80a1f6ed380520ff563bd32b7900d64b30ada1433e65118","signature":"bdfeca5ceee1485f94d69929384a211223f3e4d20f5d36e1f47e5b167f1416f4"},{"version":"8e948b49e4912c7a6eeb656e7380731833aebadd9944f1509bcffb101c61336c","signature":"01b4eeb1c81594f7d63998456cd7214d8a8d46500d27d96f39c200c6a2feb725"},"be6da6ec20c92cb3bbdf300e60f742ac964b92a1455fc6e093eb1cef2394dd07",{"version":"f2f0def77fa9d23b6a5b45dafb40fd348cb2ed340ed4bd02568751e3dadd18b8","signature":"5d7e79342e10637f9600baba1c366d4383c6ed88723c9c6db76b82c2302ae47c"},{"version":"08ac98cd60c5d4936360d2c6041d836170c2f86d3d2006651ecfd4f99f2964d4","signature":"fa0abc2381b0956b3ab22c9c8255ddaae7085ec27274263b7d6fbc4d7e37cdc3"},{"version":"ea08b6f4e40409b1cc36f522cc72028e5151d97116b6b726f14a8568ef74dd04","signature":"12976e46cd2ab53ddc5bcdcd7fe0b9d53a9a6dafe1c8076a3b72eb9a80aa0a09"},{"version":"3ec45c7de4bb5f1824ef37a5d02c5d2e7eb5a470c273bdbda33d933e35f494af","signature":"ce5c3a76afb1acdd261cf180a96988ebb148d6ad30e1c2a7a35ff0ae946fa998"},{"version":"41e7a4812918a63b1fed9d71def8d8694d9805c53e70a769829d91898846bf97","signature":"d9013049b2dd27d4a9272f20ec13a25ad91fefff5a7b54425923801f479d1252"},"30f266c9bd1151a03be5b5fd2aab3e6a7e22e41de320013fa28932ea43031e55",{"version":"349492eef23cbf2bd3b823140f34f081c8a0e469f8bece722763ce150be7420f","signature":"d5dbbfc3414b7b4c775d1435d5921a0abe276ce0eb21aaa330db7eeac2a369ee"},{"version":"00fde5f9fbaae0b0891f7a360b5714aae5855ad58860f9e766c55c9b27221b30","signature":"f101a3a418efb7f49fa9df5c0837d9ad22ed356164cdc81ed04d0403323e522b"},{"version":"a06ce21017870af3f9cd3f579218bb60a2a7d503ace83b8ee690d9988d605d79","signature":"c8fe34af3c906a191d4f44422ac1dac718281a23a5e681f21caaffb38fb7712e"},{"version":"1c08e3adf66e2273adec897f5e862827726cb44060fff1602dc98f63c6d41b8b","signature":"9090dd74e3e5f265e61364c1788fd254edd163dcaf7f77afa7c0557685fb170a"},"bbcb4db7945f2c853d49f322ce3969f4cd6bd22994e47ce4d22a6633013b483d",{"version":"b61a9ba5232fdff3bbef9014782f6faf7fd5589ab79e6f1cc1182b65275a4d49","signature":"384b7fda62395ce6890b90d961ce4235c12ed5c3237d952db1ec7b1095bc6c2e"},{"version":"6a268a7a9c7bfe4a1dacc58f47b33d02c585be033c29ececea96626872797ffe","signature":"de4e61fcc5967a24e0dfd869dfb25085b1927a171805152b5f5e63dee2267414"},{"version":"e27ec3e2f459fdeabe87c09f4540b70f43fd59952d25defc2e397c2afdc26492","signature":"cd2f3f3909f7ee18ce4a8c0b3deab2165a01a5163a502278623d066ba6b7d7c9"},{"version":"b21bc57ecd7faad863f7b3f0ed1ef15de7c3999226392ad12a7ec6f11ad40d75","signature":"55446dfd97412c716ced2cc7211ee85069113c8d8d8419ca270fdbe1a0cbf1a1"},{"version":"f8665840998eaf2cb9ae0ce9c723080678876a94f5230c0528c14ce6f2f76662","signature":"e59dd6ab00de8446966f9f6f51206ecab1eaad7e92881f10814ad49e6e3f0d30"},{"version":"9749dc980614eeb7cb10e6b37a3592c41b6aa0589d16f63a3ac384f1964421a1","signature":"fc2915fcf94d2446009cf4b79c07eeac2899fcfd149535341d368b1bd043e9ac"},"55bd0809e448e2b35cb4aae81e689cb882b143875fe8d2e4d5894583dc18fb06",{"version":"b2850da75a247250e3c35d9b2b6eb5449a2201fcae139a06567cb000cea6d254","signature":"9d8accadaab3814c22d20dac33cfed6b46becfaf9e9839a6d701b5fc003a116c"},{"version":"bc46fd9cd7c5ab252eb96c03ca3fbe8ee215ba06e4da34f035c746723a42e122","signature":"3f5c04745f9b67a356f52f4b77bd284264428fcbbaabcb1eb21f91b696c288fa"},{"version":"4a190f623f37eeddf5842c7ce102d5bed191d692eddd73ed10de4b6119e4835b","signature":"83b5f3005c7d3a7a47ab9ecbc9f175fe537dc5bc0fa5deb5293de211775b14b0"},{"version":"a2d9c1336bebf17dff38c725b5f2b9ab02d5ed1715bc983710739f501a609a1a","signature":"51177a8749c8593df62440baa8b1a0fbbd670a3263eedaa398d912155702bbd3"},{"version":"7cc1d1803d621959a7f7a62c439b449eeb135d89c9154474557daaf80d9f040e","signature":"4a869d6adbd20bf93cf6abe96707dfe7a8efb1aeae6d4fddb195071721216dd0"},{"version":"0491c2cff3f7246a48f1fc0a87429c1da1e87da1fc292f4d3b212f4cd462dad7","signature":"8b933738eea5f67088bd93926bc542e291a08a4c6761f66d76f842808f2b8f6a"},{"version":"234ef11579ec90a344db5b8b69b39857f3b45b33e812d41b7cc3f796f68ae78f","signature":"9ac962e60edcb39b8b498025e7c2f35fbab6c32090be43c90353a0adef9fad94"},{"version":"73d7dbbe3f0d1dc678d132f50d056ceda99645c23089a2fefd71fec7119758a5","signature":"c90a68e34b0a22121492f59cdf64ab7868b1b399eabbc38775685596db66b756"},{"version":"88ce79f87ff602dcad6c64aa61ed642b75fe9b3f4cf0e31f59fc6d9cf8ab2938","signature":"82c65b1d838eb767c61a7f1f389d233ac0c3685249b9b907ffc6a1b8233d95de"},{"version":"91c59122358e00416c3380edefa84ea29dcf7c69872986af875ba79c4354d1ad","signature":"2e1aa6bc6f9d4b211e1a07c56130f882d77d37650856bb31bebc290a5971bc41"},{"version":"5362117ce2a7812c8c9ccf155734d350282135104f4bd83369f172025ab7693e","signature":"86e86a954fa5e163d271edb265ae1e3b51e8eb70accd5d6d1cdb90b18aab62f1"},{"version":"f584cb158cf54f822dda3f8856f166e8bfbdb6bcd45d857359bab0cd0cba38f9","signature":"8e64ae0effb3dc53035f4e3d46618871f02c034c0664b65f46ace2ee4a3d3aeb"},"a8ee51bc7008fb58b561048a2827aa6a6ac4b0f9b5c71e3561ff472bc9beaa14","40666c03dfc433ae7f1e8ac306a2c8cf2ebfc11447de3e7a89e7622a3ad27fde","a13ad8e77292c557a6dabf1f8f059fae04130897b70901daff89396048b0a953",{"version":"1831edce21ca83ab3f74698d2ee9c447096f679ca5dca9d1fa4bf86887a00dd6","signature":"6be605b59f5cf5f7a42731b383534e841ee8ac35940c6a5e269d43a3d2b1bb64"},{"version":"7948a76767b3de52e5aa84b4e0e25f6be7c9a2530d725619597c67f17cf35bab","signature":"66b8fe05648fdc8142e95d54d521894d67c18ce36d9ec21987a4ca2fa35e0d4a"},{"version":"71cf9b2524c03bf57375f64c2dac4bd78d89e7ac1f36148f9a03339b6a442799","signature":"0056f190f7fa6ee88403fdb95647795bc54204a35dee5644f48db8ea5b8413c5"},{"version":"6a535718f131ef5f471231640ef1f0ab9a349ace39391736205d71d1249f722f","signature":"33650d65cfde622ed51136d923bdb709a201f96ecc565eb391b050b6deec6011"},{"version":"c0517bfbf9ff149b7011791e7a8ca30f513c0d788601a336a87738bc9c6c95a9","signature":"4b1589afca287dae6c5a69072616ed355813893a582538df63d80b18bc3c734b"},{"version":"ceebd7c3ccf16f12457edff5f7c1e1d3d6c88b167277b1504914b200c9eb63d7","signature":"594c59ba8d0bd9ca9763a590aa113547497eba83cc244ff732dc720f9df44e4d"},{"version":"054eb5dbd88be5a20c01ed6d127372c3b8b06acc741b96786ce7e77d3dbda0bc","signature":"3b639a7974c572e01d4ab8c2863073a8f88e327dc78e3e152d2b284bcee55536"},{"version":"46cee52f4a90ee9de1721e9a39ec28df22cdcd747a2bc1abf2770ba51eb79e36","signature":"968858e632a545da7b010feac1d53298600deb7c7a2c72946fed51c4ce5f98f2"},{"version":"6a0b9196ab18fd17cbb529085867226504acf604529f8d25fb6b3179634e5e99","signature":"92e268fd0dffcabfc1d42e718d357b4654e49174b2fee36925a786d88ea3299b"},"c30eab5bb670254286d90407bbed0562609183e0aa596add35c77669748119b0","6231bda35e652a183691804f424e557039d773c926f65d7f84cbe30908ccb611","7e44a2046837c1f3e8b6fb4e5d79dee1dfd426162eefaf37554317e1d8805499",{"version":"99810aaa0c89de812d301657145a0ab8d83c933ba0a37eb3d4d61ccf6564e13c","signature":"b5bcf2fe6a4dcbb8eafe0e3927a314797a294442aff0a78e9823124e7e059497"},"89ea5e4185bc734979329ec85a53d49d24712d247f73a9f89d1e4ce85758573b","898c1fa8fc85ba5e9b3a7fc32756634ce8e200b19b24fbebbaa1cc52bce338e0","4bf211a50c7b76abdc339914825eca386f48c130a3ae531c742e0d39919ae299","f5a648a0c4ae6445830af2e79dcb25770aa0a8c4a295095ec00bdb82a4299033","fed87f4ae43acff0c672f7bcbaa3eb533e6901391a7ebc12fae7e6a21effc1f3",{"version":"d153a11543fd884b596587ccd97aebbeed950b26933ee000f94009f1ab142848","affectsGlobalScope":true,"impliedFormat":1},{"version":"0ccdaa19852d25ecd84eec365c3bfa16e7859cadecf6e9ca6d0dbbbee439743f","affectsGlobalScope":true,"impliedFormat":1},{"version":"438b41419b1df9f1fbe33b5e1b18f5853432be205991d1b19f5b7f351675541e","affectsGlobalScope":true,"impliedFormat":1},{"version":"096116f8fedc1765d5bd6ef360c257b4a9048e5415054b3bf3c41b07f8951b0b","affectsGlobalScope":true,"impliedFormat":1},{"version":"e5e01375c9e124a83b52ee4b3244ed1a4d214a6cfb54ac73e164a823a4a7860a","affectsGlobalScope":true,"impliedFormat":1},{"version":"f90ae2bbce1505e67f2f6502392e318f5714bae82d2d969185c4a6cecc8af2fc","affectsGlobalScope":true,"impliedFormat":1},{"version":"4b58e207b93a8f1c88bbf2a95ddc686ac83962b13830fe8ad3f404ffc7051fb4","affectsGlobalScope":true,"impliedFormat":1},{"version":"1fefabcb2b06736a66d2904074d56268753654805e829989a46a0161cd8412c5","affectsGlobalScope":true,"impliedFormat":1},{"version":"9798340ffb0d067d69b1ae5b32faa17ab31b82466a3fc00d8f2f2df0c8554aaa","affectsGlobalScope":true,"impliedFormat":1},{"version":"c18a99f01eb788d849ad032b31cafd49de0b19e083fe775370834c5675d7df8e","affectsGlobalScope":true,"impliedFormat":1},{"version":"5247874c2a23b9a62d178ae84f2db6a1d54e6c9a2e7e057e178cc5eea13757fc","affectsGlobalScope":true,"impliedFormat":1},{"version":"cdcf9ea426ad970f96ac930cd176d5c69c6c24eebd9fc580e1572d6c6a88f62c","impliedFormat":1},{"version":"23cd712e2ce083d68afe69224587438e5914b457b8acf87073c22494d706a3d0","impliedFormat":1},{"version":"487b694c3de27ddf4ad107d4007ad304d29effccf9800c8ae23c2093638d906a","impliedFormat":1},{"version":"3a80bc85f38526ca3b08007ee80712e7bb0601df178b23fbf0bf87036fce40ce","impliedFormat":1},{"version":"ccf4552357ce3c159ef75f0f0114e80401702228f1898bdc9402214c9499e8c0","impliedFormat":1},{"version":"c6fd2c5a395f2432786c9cb8deb870b9b0e8ff7e22c029954fabdd692bff6195","impliedFormat":1},{"version":"68834d631c8838c715f225509cfc3927913b9cc7a4870460b5b60c8dbdb99baf","impliedFormat":1},{"version":"2931540c47ee0ff8a62860e61782eb17b155615db61e36986e54645ec67f67c2","impliedFormat":1},{"version":"ccab02f3920fc75c01174c47fcf67882a11daf16baf9e81701d0a94636e94556","impliedFormat":1},{"version":"f6faf5f74e4c4cc309a6c6a6c4da02dbb840be5d3e92905a23dcd7b2b0bd1986","impliedFormat":1},{"version":"ea6bc8de8b59f90a7a3960005fd01988f98fd0784e14bc6922dde2e93305ec7d","impliedFormat":1},{"version":"36107995674b29284a115e21a0618c4c2751b32a8766dd4cb3ba740308b16d59","impliedFormat":1},{"version":"914a0ae30d96d71915fc519ccb4efbf2b62c0ddfb3a3fc6129151076bc01dc60","impliedFormat":1},{"version":"33e981bf6376e939f99bd7f89abec757c64897d33c005036b9a10d9587d80187","impliedFormat":1},{"version":"7fd1b31fd35876b0aa650811c25ec2c97a3c6387e5473eb18004bed86cdd76b6","impliedFormat":1},{"version":"b41767d372275c154c7ea6c9d5449d9a741b8ce080f640155cc88ba1763e35b3","impliedFormat":1},{"version":"3bacf516d686d08682751a3bd2519ea3b8041a164bfb4f1d35728993e70a2426","impliedFormat":1},{"version":"7fb266686238369442bd1719bc0d7edd0199da4fb8540354e1ff7f16669b4323","impliedFormat":1},{"version":"0a60a292b89ca7218b8616f78e5bbd1c96b87e048849469cccb4355e98af959a","impliedFormat":1},{"version":"0b6e25234b4eec6ed96ab138d96eb70b135690d7dd01f3dd8a8ab291c35a683a","impliedFormat":1},{"version":"9666f2f84b985b62400d2e5ab0adae9ff44de9b2a34803c2c5bd3c8325b17dc0","impliedFormat":1},{"version":"40cd35c95e9cf22cfa5bd84e96408b6fcbca55295f4ff822390abb11afbc3dca","impliedFormat":1},{"version":"b1616b8959bf557feb16369c6124a97a0e74ed6f49d1df73bb4b9ddf68acf3f3","impliedFormat":1},{"version":"5b03a034c72146b61573aab280f295b015b9168470f2df05f6080a2122f9b4df","impliedFormat":1},{"version":"40b463c6766ca1b689bfcc46d26b5e295954f32ad43e37ee6953c0a677e4ae2b","impliedFormat":1},{"version":"249b9cab7f5d628b71308c7d9bb0a808b50b091e640ba3ed6e2d0516f4a8d91d","impliedFormat":1},{"version":"80aae6afc67faa5ac0b32b5b8bc8cc9f7fa299cff15cf09cc2e11fd28c6ae29e","impliedFormat":1},{"version":"f473cd2288991ff3221165dcf73cd5d24da30391f87e85b3dd4d0450c787a391","impliedFormat":1},{"version":"499e5b055a5aba1e1998f7311a6c441a369831c70905cc565ceac93c28083d53","impliedFormat":1},{"version":"54c3e2371e3d016469ad959697fd257e5621e16296fa67082c2575d0bf8eced0","impliedFormat":1},{"version":"beb8233b2c220cfa0feea31fbe9218d89fa02faa81ef744be8dce5acb89bb1fd","impliedFormat":1},{"version":"c183b931b68ad184bc8e8372bf663f3d33304772fb482f29fb91b3c391031f3e","impliedFormat":1},{"version":"5d0375ca7310efb77e3ef18d068d53784faf62705e0ad04569597ae0e755c401","impliedFormat":1},{"version":"59af37caec41ecf7b2e76059c9672a49e682c1a2aa6f9d7dc78878f53aa284d6","impliedFormat":1},{"version":"addf417b9eb3f938fddf8d81e96393a165e4be0d4a8b6402292f9c634b1cb00d","impliedFormat":1},{"version":"48cc3ec153b50985fb95153258a710782b25975b10dd4ac8a4f3920632d10790","impliedFormat":1},{"version":"adf27937dba6af9f08a68c5b1d3fce0ca7d4b960c57e6d6c844e7d1a8e53adae","impliedFormat":1},{"version":"e1528ca65ac90f6fa0e4a247eb656b4263c470bb22d9033e466463e13395e599","impliedFormat":1},{"version":"2e85db9e6fd73cfa3d7f28e0ab6b55417ea18931423bd47b409a96e4a169e8e6","impliedFormat":1},{"version":"c46e079fe54c76f95c67fb89081b3e399da2c7d109e7dca8e4b58d83e332e605","impliedFormat":1},{"version":"866078923a56d026e39243b4392e282c1c63159723996fa89243140e1388a98d","impliedFormat":1},{"version":"c3f5289820990ab66b70c7fb5b63cb674001009ff84b13de40619619a9c8175f","affectsGlobalScope":true,"impliedFormat":1},{"version":"b3275d55fac10b799c9546804126239baf020d220136163f763b55a74e50e750","affectsGlobalScope":true,"impliedFormat":1},{"version":"fa68a0a3b7cb32c00e39ee3cd31f8f15b80cac97dce51b6ee7fc14a1e8deb30b","affectsGlobalScope":true,"impliedFormat":1},{"version":"1cf059eaf468efcc649f8cf6075d3cb98e9a35a0fe9c44419ec3d2f5428d7123","affectsGlobalScope":true,"impliedFormat":1},{"version":"6c36e755bced82df7fb6ce8169265d0a7bb046ab4e2cb6d0da0cb72b22033e89","affectsGlobalScope":true,"impliedFormat":1},{"version":"e7721c4f69f93c91360c26a0a84ee885997d748237ef78ef665b153e622b36c1","affectsGlobalScope":true,"impliedFormat":1},{"version":"7a93de4ff8a63bafe62ba86b89af1df0ccb5e40bb85b0c67d6bbcfdcf96bf3d4","affectsGlobalScope":true,"impliedFormat":1},{"version":"90e85f9bc549dfe2b5749b45fe734144e96cd5d04b38eae244028794e142a77e","affectsGlobalScope":true,"impliedFormat":1},{"version":"e0a5deeb610b2a50a6350bd23df6490036a1773a8a71d70f2f9549ab009e67ee","affectsGlobalScope":true,"impliedFormat":1},{"version":"435b3711465425770ed2ee2f1cf00ce071835265e0851a7dc4600ab4b007550e","impliedFormat":1},{"version":"7e49f52a159435fc8df4de9dc377ef5860732ca2dc9efec1640531d3cf5da7a3","impliedFormat":1},{"version":"204640b4a7aa28ee74252137d1ad57fabdb072fea53043ef5c8ba16c3fc05705","impliedFormat":1},{"version":"4d4e879009a84a47c05350b8dca823036ba3a29a3038efed1be76c9f81e45edf","affectsGlobalScope":true,"impliedFormat":1},{"version":"237ba5ac2a95702a114a309e39c53a5bddff5f6333b325db9764df9b34f3502b","impliedFormat":1},{"version":"9ba13b47cb450a438e3076c4a3f6afb9dc85e17eae50f26d4b2d72c0688c9251","impliedFormat":1},{"version":"b64cd4401633ea4ecadfd700ddc8323a13b63b106ac7127c1d2726f32424622c","impliedFormat":1},{"version":"37c6e5fe5715814412b43cc9b50b24c67a63c4e04e753e0d1305970d65417a60","impliedFormat":1},{"version":"1d024184fb57c58c5c91823f9d10b4915a4867b7934e89115fd0d861a9df27c8","impliedFormat":1},{"version":"ee0e4946247f842c6dd483cbb60a5e6b484fee07996e3a7bc7343dfb68a04c5d","impliedFormat":1},{"version":"ef051f42b7e0ef5ca04552f54c4552eac84099d64b6c5ad0ef4033574b6035b8","impliedFormat":1},{"version":"853a43154f1d01b0173d9cbd74063507ece57170bad7a3b68f3fa1229ad0a92f","impliedFormat":1},{"version":"56231e3c39a031bfb0afb797690b20ed4537670c93c0318b72d5180833d98b72","impliedFormat":1},{"version":"5cc7c39031bfd8b00ad58f32143d59eb6ffc24f5d41a20931269011dccd36c5e","impliedFormat":1},{"version":"fe451b9d71a11a884c00db8969478b83a428f9bd2ddb15a2f77bdb4c2897a339","affectsGlobalScope":true,"impliedFormat":1},{"version":"6cd1ef1612767e4a1141bbb59a18bd073e834f0b1d29293c2822da6d2c0bb8bc","impliedFormat":1},{"version":"cc25940cfb27aa538e60d465f98bb5068d4d7d33131861ace43f04fe6947d68f","impliedFormat":1},{"version":"97a050d61a1a73cafa82631c16f74abdd87e4e8b45cd86a177c2746a13b30699","impliedFormat":1},{"version":"01ff95aa1443e3f7248974e5a771f513cb2ac158c8898f470a1792f817bee497","impliedFormat":1},{"version":"757227c8b345c57d76f7f0e3bbad7a91ffca23f1b2547cbed9e10025816c9cb7","impliedFormat":1},{"version":"42a05d8f239f74587d4926aba8cc54792eed8e8a442c7adc9b38b516642aadfe","impliedFormat":1},{"version":"685f9b34ad745e6c3e96156174c30fe28f5585d6623089c1115698c061355475","impliedFormat":1},{"version":"101f482fd48cb4c7c0468dcc6d62c843d842977aea6235644b1edd05e81fbf22","impliedFormat":1},{"version":"ae6757460f37078884b1571a3de3ebaf724d827d7e1d53626c02b3c2a408ac63","affectsGlobalScope":true,"impliedFormat":1},{"version":"9451a46a89ed209e2e08329e6cac59f89356eae79a7230f916d8cc38725407c7","impliedFormat":1},{"version":"3ef397f12387eff17f550bc484ea7c27d21d43816bbe609d495107f44b97e933","impliedFormat":1},{"version":"1023282e2ba810bc07905d3668349fbd37a26411f0c8f94a70ef3c05fe523fcf","impliedFormat":1},{"version":"b214ebcf76c51b115453f69729ee8aa7b7f8eccdae2a922b568a45c2d7ff52f7","impliedFormat":1},{"version":"429c9cdfa7d126255779efd7e6d9057ced2d69c81859bbab32073bad52e9ba76","impliedFormat":1},{"version":"e236b5eba291f51bdf32c231673e6cab81b5410850e61f51a7a524dddadc0f95","impliedFormat":1},{"version":"f7ba0e839daa0702e3ff1a1a871c0d8ea2d586ce684dd8a72c786c36a680b1d9","affectsGlobalScope":true,"impliedFormat":1},{"version":"7f2c62938251b45715fd2a9887060ec4fbc8724727029d1cbce373747252bdd7","impliedFormat":1},{"version":"e3ace08b6bbd84655d41e244677b474fd995923ffef7149ddb68af8848b60b05","impliedFormat":1},{"version":"132580b0e86c48fab152bab850fc57a4b74fe915c8958d2ccb052b809a44b61c","impliedFormat":1},{"version":"af4ab0aa8908fc9a655bb833d3bc28e117c4f0e1038c5a891546158beb25accb","impliedFormat":1},{"version":"69c9a5a9392e8564bd81116e1ed93b13205201fb44cb35a7fde8c9f9e21c4b23","impliedFormat":1},{"version":"5f8fc37f8434691ffac1bfd8fc2634647da2c0e84253ab5d2dd19a7718915b35","impliedFormat":1},{"version":"5981c2340fd8b076cae8efbae818d42c11ffc615994cb060b1cd390795f1be2b","impliedFormat":1},{"version":"f64deb26664af64dc274637343bde8d82f930c77af05a412c7d310b77207a448","impliedFormat":1},{"version":"dd056bc72652fad5fc479b0d9858e3994c709cb3276b53ffa05b4a3a1d09b16a","affectsGlobalScope":true,"impliedFormat":1},{"version":"0250da3eb85c99624f974e77ef355cdf86f43980251bc371475c2b397ba55bcd","impliedFormat":1},{"version":"f1c93e046fb3d9b7f8249629f4b63dc068dd839b824dd0aa39a5e68476dc9420","impliedFormat":1},{"version":"3d3a5f27ffbc06c885dd4d5f9ee20de61faf877fe2c3a7051c4825903d9a7fdc","impliedFormat":1},{"version":"12806f9f085598ef930edaf2467a5fa1789a878fba077cd27e85dc5851e11834","impliedFormat":1},{"version":"bce309f4d9b67c18d4eeff5bba6cf3e67b2b0aead9f03f75d6060c553974d7ba","impliedFormat":1},{"version":"a43fe41c33d0a192a0ecaf9b92e87bef3709c9972e6d53c42c49251ccb962d69","impliedFormat":1},{"version":"a177959203c017fad3ecc4f3d96c8757a840957a4959a3ae00dab9d35961ca6c","affectsGlobalScope":true,"impliedFormat":1},{"version":"6fc727ccf9b36e257ff982ea0badeffbfc2c151802f741bddff00c6af3b784cf","impliedFormat":1},{"version":"2a00d005e3af99cd1cfa75220e60c61b04bfb6be7ca7453bfe2ef6cca37cc03c","impliedFormat":1},{"version":"4844a4c9b4b1e812b257676ed8a80b3f3be0e29bf05e742cc2ea9c3c6865e6c6","impliedFormat":1},{"version":"064878a60367e0407c42fb7ba02a2ea4d83257357dc20088e549bd4d89433e9c","impliedFormat":1},{"version":"14d4bd22d1b05824971b98f7e91b2484c90f1a684805c330476641417c3d9735","impliedFormat":1},{"version":"c3877fef8a43cd434f9728f25a97575b0eb73d92f38b5c87c840daccc3e21d97","impliedFormat":1},{"version":"b484ec11ba00e3a2235562a41898d55372ccabe607986c6fa4f4aba72093749f","impliedFormat":1},{"version":"1dbd83860e7634f9c236647f45dbc5d3c4f9eba8827d87209d6e9826fdf4dbd5","impliedFormat":1},{"version":"41ef7992c555671a8fe54db302788adefa191ded810a50329b79d20a6772d14c","impliedFormat":1},{"version":"041a7781b9127ab568d2cdcce62c58fdea7c7407f40b8c50045d7866a2727130","impliedFormat":1},{"version":"c6ec09989ea4d037483303eca3b7a47ed4259206f6282a8e2c19d9577692a4d4","impliedFormat":1},{"version":"e1cb68f3ef3a8dd7b2a9dfb3de482ed6c0f1586ba0db4e7d73c1d2147b6ffc51","impliedFormat":1},{"version":"55cdbeebe76a1fa18bbd7e7bf73350a2173926bd3085bb050cf5a5397025ee4e","impliedFormat":1},{"version":"c2a6a737189ced24ffe0634e9239b087e4c26378d0490f95141b9b9b042b746c","impliedFormat":1},"e1d3aa5a72bc4c4894266e6832f695d85ecd0671c9f3bb466d2d43419ac58a14","09ccab62c19ce8d1a3a447314957fd73e73f423378e983553ed83f82a032de81","abe48ac2ace663e3ac26f23550d58f1d7f835343a2e2852deced70c6c25e78f4","8f7403839cbf60307036719bc7a4ac207f2176eab84991f6092895444d17d186","698963476179a0f41067bb2e75d95684a04ddf7a870c5f1501542b606a0ce110","4224f41ac35c18ff999205df887fd3310e30b3ec138720952b500307fe4026c4","9fd3235a90086a118a81a12bc1e0284f251bb8fcae226b6266f50cd06e76bcc6","f2eef2bdf6238a7579d0075ba4cf29d044a9d1432e4c6410d3a1550eb4eead48","dfdc46fd6ac51bcfcc80aa38f0029bc1ce336d4e144dc23e854c5a440fa805c6","0d39b9884c76452c0bc19f10d351f86a0172e8008434cecf3c7d539da84e4a27","c0b4c0ff00522b24ddc3884c86b7208195cc2a0cb37aca526fae0e665cd9fdf7","14748bc7b68d0e1cc2897cdb11d5ea6d5ae0c07c3d7223ce29cc735b1f0e0a49","68353ae96f308596c7e6a9fdfca7dcf755f152f046fef873e82843ced7318f17",{"version":"babac068561fae8252f366079fa0d2f8aba40498fb3c08498d307d6b7092de19","signature":"06bb3ec3cea93e0e08bb34911dd4d6bef29e332d1f9c5d36449a3e61f97ddee1"},"5c8f2651837e25b559061825e6c827855ad2d65f421e1f7638bcc96e0e2b377a",{"version":"a285e8ac2aab35515cf7b1831a07603bdc48b6bf98851edf97d3caf9e40f4c92","signature":"278f4d8edbbeaaeaf677a7506f454d3a1995a05399eb8313b1f91a0d22d66e31"},{"version":"ec1051557d8ba10e6e074b50e54e99d3b50a9b910f683867f507b95d25f47ca7","signature":"888d94e7718709ef90858b113d7c229e9fbc1d6f902b4da60a8e6db2c761e0f8"},{"version":"d0f81e4cfd9c581373e0321ea531b2056785c76c8341ddfa91082edb32949ce9","signature":"a4314e160a35294fb185494ccc32cc4608ee82d0a2c3a4ade86ca39f278139b4"},{"version":"aa2beb16a2f6fe0b4dc44321b73ddb7c417495334344f5b33f5b2716036c8910","signature":"de4fed720bfe12d801cc86cdd77a811e3a845108a02e1af55bf89df8314845a9"},{"version":"352bb774c452de87ebb26b18377a5ac2658bc10109a99c1dfe6ee16a5e7fcda6","signature":"952c893ad7a045e7703f1b450e9ce3f5b5b3f5b9852b55fa314e853d2b8a57bd"},{"version":"b98c7e56b2489f0e77b41cb78b21136d7eb9f4b34e8fff033181d199ef79ce66","signature":"3d9cae7e2ce88696d5397161d7118919b003b16aafd3c601bbf54dc4e2b5b05e"},{"version":"912b60c76cdafd84b8241de62c84546d1ef9ba9ae940f54289addd595d6e6174","signature":"2946303219b2a80bb0edb10f4db1c3bba14f057dbe8e1d14d2d5aed3d4218f5e"},{"version":"ffb9c880f989e65ca78c0782e764f09105c8f9c9faac70182323d04c7094321f","signature":"44c9e6de4458256ef232f54e6944d5cec81d811a5b93c35e2432bdddc3b1f4d1"},{"version":"fe4483b74acdedc6b81e8e781d6247c648597ae311b37325009ef42f7cd6ff13","signature":"fa94b5994ad644a4a9524897e691655bb6fed8a5f9e76933b74566f5f62156ff"},{"version":"401eb2cd26449838847e980ce3b0303130fc5ecb133b3fe59ffcd3efa50abc19","signature":"ebf956f41e23ffcbd5d4515fb49555d6f988f960341269e8d106cf1d1632dbe2"},{"version":"abbc1b9cc522e346a33663329cb0483a2a4c9340789cf94d419c615926a5b37a","signature":"9bb60f8afae30986565b6a843e3e71c56349f696515ee38153ceaad4f2410d55"},"9fbcb01989cc6621cc1963d458d77ee7ca9492b441fca12c3e5f91a5a8c6574a","5557d3f52c158bd8b78bc00046bef87e900b73a8f6b111caf4e01c59caa0d023","1e798ca662500e46f380e473e6f419fb8ee8c430203a7a82535eb50faa5fc4b2","23a8a1fe7303fd698f4618ee0812a18226285483285802355adc1ccbc430f759","dbd1d1c03597165552841186f26cc93025ab4bd13ed503bdd23395aa63244515","ecb623dea93e3a3a42ec2249862d7969d9e45b3943997007806e74b37e9f9171","ec24a00b1c58f1d924f19205d82ba0f06c9733f5fccacf4ec1b981653778f8bb","96aeb62433c0c3f576283ff8734070aa6fe5f31c9f3400eddc3f8bbcb9f90f01","422afc4b785c2772b4482bac95a53d7972260021b9d6ab6620c90468eca5a363","e4ec111c299330db373fd27501344bbe7f15dba4c7507fc2f1576d60c00ad236","e134474099b13ee4c866bcdd99103b51398317f80041aa42b85d394cd9e49bae","7d20dcc78cc3ad5e141a45af68edc9985a86428d4db75c61142118e0f3ca972d","47695303769d41f04d7fb67ecae1176328ce6326797b8622bf92291b37388cf2",{"version":"ddbfdea6957d825595ae6c5398adb0fe1edc51a8671252dabf522b076d5fd8a2","signature":"011f1d9a86489f5cdbda771931df08e20a21ee4493ffc186d3a3d8c20746b564"},"f7ecdbb806ced9f85bb7a06e8fa2919eee2c035906b7f05e9c8a8a8baff7df21",{"version":"466689b0993755442380a1f09c0b06766515c9181dc759d9f0466d72bdce08c7","signature":"85a3ef93285b04be6917822bdd908708a7760314b05e95860bb704e26a75c814"},{"version":"92d959ec02bf0cd9e835ed666b6742e1f9da815519a6087847584b1667503d21","signature":"6df1f218313ffa98d9ce0aa764774f06d5bf908ede1d5741402fa48d6d27203f"},{"version":"d60473451ab752744bca59310593a6d48c29b876ac8974b23e572663ddd19aef","signature":"c3d0f46e804b325626d1f1fe59f46003d9d4225cec0c5c01844a3c08174368f9"},{"version":"4bf2ebce7fcc3a8d2cb2a5216a2e0ed3424d9b3ce5351cf719d482b2ac2ea55b","signature":"0864ac8f73aaca34ef1c077c616f353a0f6bd5aa99adabb19dd03b02a7c79abd"},{"version":"62c2d6d6e38087841e8de4c651c5d584df109b46354226d956a7e69205856a86","signature":"43941a67e804417c9f5860e80ae7e4ed215eccc94678b6c650347c584d41565a"},{"version":"93f40fcfbd4a2089ea03d9f31022c3af297a864cc5dd0df2a7b55ca3c23e459b","signature":"76e8e088eece23314a1fc91687f30979c164306110c533cd33488eb674761106"},{"version":"868eab053a77fa4c6dc65ea0f485a90e29dec03a1d730e87ed43ddcbb50a26ca","signature":"d911c1826515a01b95cacb4f5b770b5193bb4a72ede9b62761ead77fb847c3fa"},{"version":"157bda536c1008409960159a66591e6c4096ef1f9b6ae85ce9293aef885ac085","signature":"3d83ab3bfa7568f2f463246a041edf63db1a8ee50cc618fc9ad518e7477bf7f0"},{"version":"ee573e9de4fa9eca5cee327700f3f23b2fae776986748329ac91a3d4ad24ae7c","signature":"194c60a2f55ba2c6d50c6a2b41df57514afea5a49af56517c9164d7c78f40e7d"},{"version":"d070175db682b234256ad45a43a2919d5471e67cad3e27cdd45069505397c509","signature":"6fc76216e37dc111fc6556e639a58eee6d14a2934e162be1fac5db0f0e6e7d3f"},{"version":"df5a74a95078e795bd472d9655b92264c47ea9bd1007fa4f7ef29623c1754951","signature":"712865b88ee9859c9d2af9b16cc9903522236114933b154a734ac384bf8a14fe"},{"version":"7967c93b5b0c7b6548d5a6b79949c90a062ec4959cb09168b907ce321844c209","signature":"966bee828df95d93e310230fc0a635954293349b5f8a2321987f1244af1130ed"},{"version":"97bbd3a8fcd781e03bf5f22fc224823269fd121a675ea81283cc7989eccbdc2c","signature":"af39a6c003c66894b24db0c9c9f80199b5b04c8a4652c56a1c1fce492e465e18"},{"version":"aaac67ecac9b9f74d3a8c5a728197366630cff04aaaf5a8f1c2e50214d5973cc","signature":"0c774bcd52f2f4f726a3f91cdef0f11de98a55bb8be2e0b61b7a13933a84d545"},{"version":"4b781103ec67f2e7e0558a1470f305c299ae9e62f1930e532ee5c8130748eae0","signature":"efe36ccfae91fad85e84a4dbe3b0026de761828048c2acfb3e7b112117f24cd8"},{"version":"b37a4506bcaf5795ff7559961f3aee36af04f016c949fdb24610a0e4454897ad","signature":"1d00e80cbd97e07684fd01d2e9535381e370b9f94f55b117cd38edb771b95fe7"},{"version":"c7abd3af0e9e0cf10b469e9332c696ffcdbb0ae11cdf453ba0e5c35996269d57","signature":"fa5b251b63e2bf608b06f9a02254df72a2b5b8d21d89719806be1d06da27cbe5"},{"version":"4de267286eb6bbfec3f4bd1eb7554444fa91e0683c2e56072ce6c74d1aee22b4","signature":"c3547575330e79a8799fa244ebaa07e71b4689925094cadc7c05a6610b14ed7e"},{"version":"f0eac7a688a77bc77d114617f16c1a2936bda97dfb2703eaee98e78557eaf921","signature":"37fbfa579bf45272952b05cf4eacee91ee0859d2ea764223997a5285f697a174"},{"version":"501d9dcb4a04b0d5df035af5a994903b0b3fd37c6ef46aadf8d46591f4cd83ec","signature":"0a8e8155d23fffa74c027bfdc11caf5d5f258e43ea46ab80c1c27dd5853630e0"},{"version":"0d7a4a3a12a4d1374a4bfbfefde6a8ee6a546268403ad6b14680bb8c8fa3f010","signature":"adc0ae6738fbfa5ddbe1a8d9368590c978cc0dab89687dd28194e8e805c4eaed"},{"version":"03548f1c7f523f23362645b734ffdf3c3c2341c5aeabc7c08a3746c66ea5e1be","signature":"9b3263fce4d69181286c979a91b83c973c232f43dd0f1ac0268c13ce6d9d1bb0"},{"version":"c0e1f8e38276b59592e19bf074ee3a9cbc96a4da1ac159dbe767e31c4fc70b53","signature":"e81e0427c90a96488c54e9a3fd8eab191e4d59e4d5a272a293b0276687e9f36e"},{"version":"a5b231df69c55d90e429c8ba2f311daeb41efb43a21f3993786bd94edbcb9e13","signature":"a1894ddbdc84fe9b63eabc05bcf5510612fea6ec48c6419b138143319d08508b"},"cd44192078b2ef2fbdf0f8439707871fdbe4ea5e24e5dc4be4182e2a4a8c58e0",{"version":"2f782ffe7e53d5d1f48f23a21ff6402a91d9af44d28e480fae8bdead6e8ee981","signature":"7d68decebe795afaf2bf4d38f0f64481dad06185cce158f0e1d7ed2c22f1e14a"},"0c59a1c4d8d96946ff4acea7a03d708b5f9a494675b08de827828eeac065da28","3be532b23408cc204739b35d5b2230d13d03cbfe03104bc99a9c26a78a055362","2413a6af2190f0d7e794ded219335617c0b867b908ab249793698944a78ceed9",{"version":"40da7224f3e9ba960cf1512990aca6e8e05b71738cb3404380f4c26132b7d450","signature":"90edd7f5a709e5d3bd1348fa247cdd583463c4ad2790c0d9015a011ad7cc94eb"},{"version":"521d5fbfec7727faa324f4690c508418b62d951ba8358d146ba7c01423cbfe1a","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"e134052a6b1ded61693b4037f615dc72f14e2881e79c1ddbff6c514c8a516b05","impliedFormat":1},{"version":"d46eacd1b9ac292e61d349bd41a4921bd165e4f900d3666325ec6b14941d8b24","signature":"7c40d19c6d4eb9c35c86dcd881d8c2a87f8ab0c05972d2c60545258410cd8113"},{"version":"fb2dda740df5954d76637265adf6532785e3a5a940f63b626b21e85554efeaa2","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"7537906545c582dcfe9908e30b79606070bc964a660918404a7b71b4d133ca77","signature":"19f405959d22f3f25c95e6dc9705cd17b0cead2dfd73d99a29ad14808be3f55c"},{"version":"e48840dbf94e1de9ec39170e855ef92e0c0b6e1f97d0c12b52e478d027d3d7a1","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"2eaa19dace7a1d874be2ce131978d833eac863fbd0cf67e338e496e8a58ada54","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"5ec3fe3897040f8ff3d43121767f51d2afb5aba403ce30f161a78974d6001491","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"6b829e1dfa8c4a428b75f13dcb3d0aec28230e61ad0b21a3f235ab2d214b9d2b","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"3103a0c1460ce7b313d179d4987de501cc303a4cfc3350c9eaa3063a4dbbdbc2","signature":"d429dbc4ce978f94d2eba688a900486f0d91864cb629d148d6f76596fe3754b2"},"648f60ce2d545dda679d3ab830d59cb0a0657b84bd990bfc1f93314eb990e4ea","ca3ec9b6e49e13d3f8cf449b3f84ea215c0e2e166ba794aecd3de3ca808d3e24","dbee50d53073cd803fb5b0a563a4aedcaa4e903b882ea6dafb7e93544d6d92cc","26767ee936a93a784d7a34135f8d9c3e5e6eef99a7fe3fc84e9c9e0bc48a972c","066e4851a072c95f2bdebe742cc189d49e97fa1ac96fcfdf7726fab3f9386449","b73c38fb9880045f254293b7919f28b7d6781644418799f5197831331f49a90a","dfe51f603c4794873bf102be85d6ef79368c80d7fd2f1ee11a15f25abc173433","e71321c25cbab951df1f74e3bf3ae940120b9e2eae74105920fc98bcc19ef1b6","ad3ced95432c9e1344fcd6a3492a2cf95657d9bc0b6e881ab8b5e7c25f3a3875","6ea0df20c3ef08ec47ff1291c391a34962582e19d3621657d65109b0245ea863","f81e0c288e3b1aef47a60a5f751c0ec448f723c36fb8ec7a3d7dc09b5d985a39","d44556a58fd08d16e969740bb602d4735e66abed8798ebab5224263f23e2c5a7","83272ee8bbffa5441995dd53f524cff711bf9658d24ac12d03533ce966030677","c305515d28356f30ce7845a1080d1ec38f00c0f5d792c36c89d5b051c02d94ef","abe2238869cf25ced0a9a598bb9eb3d303940bece33dcb0ee3da17dc312aeb62","d27717b32024b674757683e01217397e89cb4286acd290b5c01fd36010f9d002","6e31a86b8ae6c70df6a85b651bad393dd2f82caf43eb8420d6a3ef82559ae3cd","a39562d3f2feec0d2d847212e84ac00fa8110138ac953517930c7168dc5fe93a","9d55ff59ca078401eb748a705c8ddb0641b5dc352ad02328b7041fdd4332f2b4","ccc50c93a451093baa6967d6a48f7aee4f9d6ee596e1cc51793e870a53000785","bb2cf20320734cd4fa74f4cebe808612edfbd82238f0fe1b0297be01978da200","27e0b5d4aab0a7208f986bb3845c46db44f1d5ddf955063a62a50ceb323fac4e","bc4303075e9ea31d50ec1ba4132232dcffc923f7b321c2ac20cae98392a846ed",{"version":"9924298d0fcc36fef93ac79f6b3a5811010bd99778a3cb3a9734b098e6f55790","signature":"d429dbc4ce978f94d2eba688a900486f0d91864cb629d148d6f76596fe3754b2"},{"version":"aa4396eb549b20d03ef132e84b88ad6a09b50fcc4ac48231c3f84bcdf09eb3a3","signature":"d429dbc4ce978f94d2eba688a900486f0d91864cb629d148d6f76596fe3754b2"},{"version":"c714471d98c2c9c7754174a1fb60fc90469250b5891f69c1b789c68554bfb1d1","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"3c98eadab04cfcc073cedff9545f5307f9b41fedc033af5e587d35c4fc0ad514","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"25f14ecfdd949f51173ed9850bc2028786f36e94f814537f3e7701f08b517964","signature":"98d79f9ffffeae2639bef6d923daa5f6e81ff3f0bba731f2201b8e945e8c6ba6"},{"version":"fe3057944d8316673f6e7aa79fc2a03b5b2683b46ed7dcecc82defff3e05675c","signature":"488ed502f9e61a246d9ef6f1c9f9cd1110d194dce56a31ab0fd2228d5401ef04"},{"version":"7d7caeb7f7e6bb959059c7af2cf591fd6d1ad053e2004634d9f15fd4499949a5","signature":"483a17e08a708aa93066c95bf80956304ebaf1aba87310c369854ca93b2b22d5"},{"version":"9ed9e941db241b2de27dbdc2dd69873b93226401e818acd951b63898f0c418ce","signature":"82264ff06de22504cfdc8b8faf27a36f08c974b7995b4ed4c05d0b3c7cbc4494"},"5ec3771bcafa61bcb650464007d2f5a1b4d3ffd9677a42fd5862a4dab337ba43",{"version":"cef575ebf33ed2681200deb79c3feb02dcd66c3b3a377935adb578a642475ad8","signature":"bb858c0a6682f78fa0b9b3932ab97962644b787fd52c298a75f79e207e7fa916"},{"version":"1fd6c761c16196f4e277732208194d709956dde99913974f90bdd325ac89c8d9","signature":"83fda7b00b30fdace9df3abadedf9d81f8d72e7c497c84cc1282a33bb595f652"},{"version":"2983e0b3ad2c298e55955d3d005191c8251de4b08dce02283eda764ba3d2fd3d","impliedFormat":1},{"version":"691f7a4f6af35b22b2c49675b42a64e30a6fe6660170d73a0f7ed98d975f6936","signature":"63e74ffffa6677bf9f3143589ea311614741e634a8aea79aca85fbfac3d81508"},{"version":"76c620d1dc8784b05b8e98e7aaf84ff020121ef4a22577dabd70d23e4834206d","signature":"dd36887b9a7c551be20e48c917e94a6234dd121e55c72caff7eec15b12173aae"},{"version":"bafb14058c2c74df30cc568df143b61ebdf197f1b9004249dcfee768f1ffde0e","signature":"43e818adf60173644896298637f47b01d5819b17eda46eaa32d0c7d64724d012"},{"version":"bff6bdcf93bdba7f472ae5c4990643fdbf36d04b325c47fab469de5718d8b3c9","signature":"03a562ce8665dfcd2894dc736e23d621f74f7970ef021e3f333a4ddc057204a6"},{"version":"8ecc449c0e396e51b02afa32fa75dc1dc848ad2d5ad341d6bf26d6ca777bcbd4","signature":"bcafc59face92927537eddd5a1f2fe9c3a090966fc644098f663aace78b4ca46"},{"version":"40479fa98ac4e7c1e329194fe26c772d61666980886d05a82784fc5cc3e4e9e7","signature":"63e74ffffa6677bf9f3143589ea311614741e634a8aea79aca85fbfac3d81508"},{"version":"2e92df60c21ee0bcb2aa75a39c54b8e3c602f68eebf7e43b003460cdeb6e0be4","signature":"6f8a9548b84d634dc19ab294b899b756da5c46ff9b1651451d937ae171ec0338"},{"version":"52c82b00ca8bbd41e94a22fd5bca69121847f43a1867a4b41b5eefc79e4c59a2","signature":"5bbb328e293ffe203887f4a39c82309c1890e4a49ef4528a53adfed4de79b2bc"},{"version":"0ab8063263511e7f2b7f333761229eaf6a1b5a72067bd0d78a4c1cae480f8c4e","signature":"8e609bb71c20b858c77f0e9f90bb1319db8477b13f9f965f1a1e18524bf50881"},{"version":"f413188523f07b0d01bc062ed1ce7673ada9afb3b6017ee5c58de07218e1278c","signature":"a0b4578179b566b421a0a9ce06e41cbab5fa63340901a747cc70d211c78dee7c"},{"version":"a47701709ca662d9e535f3fb10658b601780996c3e42da6dadfdfcc1f8890ec3","signature":"810f851333cdf8b6e65a85fe59cde1924c27fd43baa46091f290dff8394e870b"}],"root":[[66,68],[70,74],[76,79],[81,86],[88,99],[103,111],115,256,[258,268],282,[284,307],309,313,314,[316,323],[347,354],356,357,[359,369]],"options":{"composite":true,"declaration":true,"declarationMap":true,"esModuleInterop":true,"module":1,"outDir":"./","rootDir":"..","skipLibCheck":true,"sourceMap":true,"strict":true,"target":9},"referencedMap":[[330,1],[346,2],[331,3],[312,4],[254,5],[335,6],[343,7],[341,8],[344,9],[345,7],[325,10],[326,8],[329,8],[324,7],[327,7],[328,11],[338,12],[342,8],[332,8],[251,3],[310,13],[311,3],[244,8],[340,8],[120,14],[337,8],[336,7],[243,15],[117,7],[118,16],[119,7],[116,7],[339,8],[245,17],[250,8],[248,18],[249,18],[247,8],[252,19],[246,7],[253,20],[334,8],[333,9],[242,21],[182,22],[183,22],[184,23],[123,24],[185,25],[186,26],[187,27],[121,7],[188,28],[189,29],[190,30],[191,31],[192,32],[193,33],[194,33],[195,34],[196,35],[197,36],[198,37],[124,7],[122,7],[199,38],[200,39],[201,40],[241,41],[202,42],[203,43],[204,42],[205,44],[206,45],[149,46],[161,47],[147,48],[162,49],[171,50],[138,51],[139,52],[137,53],[170,21],[165,54],[169,55],[141,56],[158,57],[140,58],[168,59],[135,60],[136,54],[142,61],[143,7],[148,62],[146,61],[133,63],[172,64],[163,65],[152,66],[151,61],[153,67],[156,68],[150,69],[154,70],[166,21],[144,71],[145,72],[157,73],[134,49],[160,74],[159,61],[155,75],[164,7],[132,7],[167,76],[207,77],[208,78],[209,78],[210,78],[211,79],[212,80],[213,81],[214,82],[215,83],[216,84],[217,84],[218,85],[219,7],[220,7],[221,86],[222,87],[223,86],[224,88],[225,89],[226,90],[227,91],[228,92],[229,93],[230,94],[231,95],[232,96],[233,97],[234,98],[235,99],[236,100],[237,101],[238,102],[125,42],[126,7],[127,103],[128,104],[129,7],[130,105],[131,7],[173,106],[174,107],[175,108],[176,108],[177,109],[178,7],[179,25],[180,110],[181,107],[239,111],[240,112],[63,7],[64,7],[12,7],[10,7],[11,7],[16,7],[15,7],[2,7],[17,7],[18,7],[19,7],[20,7],[21,7],[22,7],[23,7],[24,7],[3,7],[25,7],[26,7],[4,7],[27,7],[31,7],[28,7],[29,7],[30,7],[32,7],[33,7],[34,7],[5,7],[35,7],[36,7],[37,7],[38,7],[6,7],[42,7],[39,7],[40,7],[41,7],[43,7],[7,7],[44,7],[49,7],[50,7],[45,7],[46,7],[47,7],[48,7],[8,7],[54,7],[51,7],[52,7],[53,7],[55,7],[9,7],[56,7],[65,7],[57,7],[58,7],[60,7],[59,7],[1,7],[61,7],[62,7],[14,7],[13,7],[315,7],[72,113],[82,114],[71,115],[83,7],[85,116],[86,117],[89,118],[91,119],[282,120],[284,121],[286,122],[289,123],[291,124],[90,125],[293,126],[294,127],[81,128],[79,7],[78,129],[313,130],[314,78],[316,131],[317,131],[319,132],[320,133],[321,78],[322,134],[318,78],[323,135],[347,136],[348,137],[349,138],[350,78],[268,139],[290,140],[299,141],[300,142],[298,143],[265,144],[302,145],[266,146],[303,147],[301,148],[351,149],[264,150],[74,151],[67,104],[296,7],[352,152],[287,153],[297,154],[115,13],[295,7],[353,155],[306,156],[285,157],[105,158],[104,159],[307,160],[259,161],[267,162],[103,7],[256,163],[88,7],[96,7],[288,164],[309,165],[354,166],[356,167],[357,168],[359,169],[360,170],[361,171],[362,172],[363,173],[364,174],[365,175],[366,176],[66,78],[358,7],[305,177],[304,178],[258,179],[261,180],[260,181],[367,136],[263,182],[262,183],[76,7],[77,184],[95,7],[98,157],[73,78],[111,185],[97,186],[70,7],[368,187],[107,188],[92,189],[369,190],[99,7],[109,191],[110,192],[94,193],[292,194],[106,195],[108,196],[84,7],[93,78],[68,197],[273,198],[275,199],[274,7],[272,7],[113,7],[255,7],[270,7],[276,7],[114,200],[112,3],[271,3],[281,201],[355,7],[100,7],[283,7],[308,7],[269,7],[87,7],[257,7],[280,202],[279,7],[278,3],[102,3],[101,203],[69,7],[75,7],[277,3],[80,7]],"latestChangedDtsFile":"./core/workflow.d.ts","version":"5.9.3"}
.opencode/skill/system-spec-kit/scripts/dist/lib/ascii-boxes.js:45:function formatDecisionHeader(title, context, confidence, timestamp, choiceConfidence, rationaleConfidence) {
.opencode/skill/system-spec-kit/scripts/dist/lib/ascii-boxes.js:64:\u2502  DECISION: ${padText(title, innerWidth - 10)}  \u2502
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:10:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:36:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:53:    trigger_phrases?: string[];
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:55:    importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:83:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:103:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:124:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/utils/input-normalizer.d.ts:169: * @param summary - The session summary text to use as title and narrative.
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:56:  title: string;
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:58:  trigger_phrases?: string[];
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:59:  importance_tier: string;
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:91:  'untitled',
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:212:  let normalizedBase = normalizeTitleCandidate(base) || 'Untitled';
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:218:    ) || 'Untitled';
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:785: * that may contain both `importance_tier` (static default) and `importanceTier`
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:790:  const importanceKeys = new Set(['importance_tier', 'importancetier']);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:913:  return normalizeTitleCandidate(text) || 'Untitled';
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:967:  title: string,
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:980:  const titleNoSuffix = title.replace(/\s*\[[^\]]+\]\s*$/, '').trim();
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:981:  const titleTokens = tokenize(titleNoSuffix).slice(0, 5);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:982:  generated.push(...titleTokens);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1093:  return normalizeImportanceTier(extractMemoryMetadataScalar(content, ['importance_tier']));
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1160:    upsertTopLevelYamlField(yamlBody, 'importance_tier', [`importance_tier: "${importanceTier}"`])
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1173:    : extractMemoryMetadataStringArray(content, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1175:    ? ['trigger_phrases:', ...resolvedTriggerPhrases.map((triggerPhrase) => `  - "${triggerPhrase}"`)]
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1176:    : ['trigger_phrases: []'];
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1179:    upsertTopLevelYamlField(yamlBody, 'trigger_phrases', replacementLines)
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1218:  const trigger_phrases = existingTriggers.length > 0
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1223:    title: '{{MEMORY_DASHBOARD_TITLE}}',
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1225:    trigger_phrases,
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1226:    importance_tier: '{{IMPORTANCE_TIER}}',
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1238:  const existingTitleValue = sectionValueByKeys(sections, ['title']);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1240:  const existingTriggersValue = sectionValueByKeys(sections, ['trigger_phrases', 'triggerPhrases']);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1274:  const titleBase = inferTitleBase(content, existingTitle, classification);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1275:  const title = truncateWithSuffix(titleBase, classification.suffix, maxTitleLength);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1278:  const trigger_phrases = inferTriggerPhrases(title, existingTriggers, classification);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1280:  const importance_tier = resolveManagedImportanceTier(
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1288:    title,
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1290:    trigger_phrases,
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1291:    importance_tier,
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1301:  'title',
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1303:  'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1305:  'importance_tier',
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1324:  lines.push(...sectionToLines('title', managed.title));
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1330:  if (managed.trigger_phrases && managed.trigger_phrases.length > 0) {
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1331:    lines.push(...sectionToLines('trigger_phrases', managed.trigger_phrases));
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1334:  lines.push(...sectionToLines('importance_tier', managed.importance_tier));
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1394:    content = syncMemoryMetadataImportanceTier(content, managed.importance_tier);
.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1396:    content = syncMemoryMetadataTriggerPhrases(content, managed.trigger_phrases);
.opencode/skill/system-spec-kit/scripts/test-fixtures/057-template-missing-anchor/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/057-template-missing-anchor/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/057-template-missing-anchor/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md:2:title: "Feature Specification: Broken Links Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/lib/cli-capture-shared.ts:182: * Builds a human-readable session title from the first non-empty
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/plan.md:2:title: "Implementation Plan: Broken Links Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/plan.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:238:            titleCandidates: [],
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:250:            if (typeof parsed.title === 'string') {
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:251:                descriptionTitle = parsed.title;
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:264:    const frontmatterTitles = parseFrontmatterValue(specDoc, 'title');
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:265:    const triggerPhrases = parseFrontmatterValue(specDoc, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:268:        titleCandidates: uniqueStrings([descriptionTitle, ...frontmatterTitles]),
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:313:            titleCandidates: [],
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:321:        ...metadata.titleCandidates,
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:342:            ...metadata.titleCandidates,
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:402:        if (typeof observation?.title === 'string') {
.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js:403:            texts.push(observation.title);
.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:61:export const extract_trigger_phrases = extractTriggerPhrases;
.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:62:export const extract_trigger_phrases_with_stats = extractTriggerPhrasesWithStats;
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2228:        // collect groups by titles
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2229:        let title_group_map = {}
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2231:            if (group.title in title_group_map) {
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2233:                throw new TypeError(sub(msg, group.title))
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2235:            title_group_map[group.title] = group
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2242:            // if a group with the title exists, use that, otherwise
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2244:            if (!(group.title in title_group_map)) {
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2245:                title_group_map[group.title] = this.add_argument_group({
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2246:                    title: group.title,
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2254:                group_map.set(action, title_group_map[group.title])
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2259:        // NOTE: if add_mutually_exclusive_group ever gains title= and
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2425:            title,
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2430:            title: undefined,
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2442:        this.title = title
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2697:        if ('title' in kwargs || 'description' in kwargs) {
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2698:            let title = getattr(kwargs, 'title', 'subcommands')
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2700:            delete kwargs.title
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:2702:            this._subparsers = this.add_argument_group(title, description)
.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml/node_modules/argparse/argparse.js:3593:            formatter.start_section(action_group.title)
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/tasks.md:2:title: "Tasks: Broken Links Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/tasks.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/spec.md:2:title: "Feature Specification: Implementation Phase (Broken)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/spec.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.d.ts:3:type RemovalReason = 'empty_or_invalid' | 'sanitizer' | 'canonical_duplicate' | 'title_overlap';
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.d.ts:18:    title: string;
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/plan.md:2:title: "Implementation Plan: Implementation Phase (Broken)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/plan.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:670:  const titleMatch = markdown.match(/^#\s+(.+)$/m);
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:671:  return titleMatch ? titleMatch[1].trim() : '';
.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:753:    title: extractMarkdownTitle(markdown) || summary.task,
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:27:    console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:30:    console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:43:        console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:70:        console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/decision-record.md:2:title: "Decision Record: Level 3 Fixture [template:level_3/decision-record.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/decision-record.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/decision-record.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/session-activity-signal.js:125:        if (typeof observation.title === 'string') {
.opencode/skill/system-spec-kit/scripts/dist/lib/session-activity-signal.js:126:            texts.push(observation.title);
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/spec.md:2:title: "Feature Specification: Level 3 Fixture [template:level_3/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/tasks.md:2:title: "Tasks: Implementation Phase (Broken)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/002-implement/tasks.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/056-template-reordered-header/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/056-template-reordered-header/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/056-template-reordered-header/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.d.ts:5:    title: string | null;
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/plan.md:2:title: "Implementation Plan: Level 3 Fixture [template:level_3/plan.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/plan.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/spec.md:2:title: "Feature Specification: Design Phase (Broken)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/spec.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md:2:title: "Verification Checklist: Level 3 Fixture [template:level_3/checklist.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.d.ts:34:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.d.ts:36:    trigger_phrases?: string[];
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.d.ts:37:    importance_tier: string;
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/plan.md:2:title: "Implementation Plan: Design Phase (Broken)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/plan.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/tasks.md:2:title: "Tasks: Level 3 Fixture [template:level_3/tasks.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/tasks.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md:2:title: "Implementation Summary [template:level_3/implementation-summary.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/implementation-summary.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/tasks.md:2:title: "Tasks: Design Phase (Broken)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/001-design/tasks.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts:23://# sourceMappingURL=generate-context.d.ts.map
.opencode/skill/system-spec-kit/scripts/dist/lib/simulation-factory.d.ts:13:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:458:                    title: result.managed.title,
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/spec.md:2:title: "Feature Specification: Valid Phase Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/spec.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/sqlite3/sqlite3.c:27785:  u8 nTitle;                          /* Bytes of title; includes '\0' */
.opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/sqlite3/sqlite3.c:27830:  char zTitle[100];  /* The title text */
.opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/sqlite3/sqlite3.c:28176:** Set the title string for subsequent allocations.
.opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/sqlite3/sqlite3.c:28178:SQLITE_PRIVATE void sqlite3MemdebugSettitle(const char *zTitle){
.opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/sqlite3/sqlite3.c:231333:** comment titled "RECORD FORMAT" above).
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/plan.md:2:title: "Implementation Plan: Valid Phase Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/plan.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/semantic-summarizer.js:530:    const titleMatch = markdown.match(/^#\s+(.+)$/m);
.opencode/skill/system-spec-kit/scripts/dist/lib/semantic-summarizer.js:531:    return titleMatch ? titleMatch[1].trim() : '';
.opencode/skill/system-spec-kit/scripts/dist/lib/semantic-summarizer.js:599:        title: extractMarkdownTitle(markdown) || summary.task,
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.d.ts:1:/** Normalizes a spec title for reuse in memory task enrichment. */
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.d.ts:2:export declare function normalizeSpecTitleForMemory(title: string): string;
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.d.ts:3:/** Returns whether the spec title should enrich the stored memory task. */
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/tasks.md:2:title: "Tasks: Valid Phase Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/tasks.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:98:        title: m.title ?? 'Untitled',
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:119:        title: m.title,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:167:        title: m.title,
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.d.ts:6:export declare function sanitizeMemoryFrontmatterTitle(title?: string | null): string;
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.d.ts:10:    title?: string | null;
.opencode/skill/system-spec-kit/scripts/dist/lib/memory-frontmatter.d.ts:13:    title?: string | null;
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/spec.md:2:title: "Feature Specification: Implementation Phase"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/spec.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/trigger-extractor.d.ts:5:export declare const extract_trigger_phrases: typeof extractTriggerPhrases;
.opencode/skill/system-spec-kit/scripts/dist/lib/trigger-extractor.d.ts:6:export declare const extract_trigger_phrases_with_stats: typeof extractTriggerPhrasesWithStats;
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/plan.md:2:title: "Implementation Plan: Implementation Phase"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/plan.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js.map:1:{"version":3,"file":"generate-context.js","sourceRoot":"","sources":["../../memory/generate-context.ts"],"names":[],"mappings":";AAAA,kEAAkE;AAClE,2BAA2B;AAC3B,kEAAkE;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAylBhE,oBAAI;AACJ,oCAAY;AACZ,wCAAc;AACd,8CAAiB;AACjB,8CAAiB;AACjB,4DAAwB;AA5lB1B,kEAAkE;AAClE,sBAAsB;AACtB,kEAAkE;AAClE,2FAA2F;AAE3F,cAAc;AACd,2CAA6B;AAC7B,2CAA6B;AAE7B,mBAAmB;AACnB,wEAAwE;AACxE,kCAQiB;AACjB,+CAAsE;AACtE,wCAA+C;AAC/C,6EAAwE;AAqBxE,kEAAkE;AAClE,eAAe;AACf,kEAAkE;AAClE,MAAM,SAAS,GAAG;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CA0EjB,CAAC;AAEF,IAAI,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC,IAAI,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,EAAE,CAAC;IACnE,OAAO,CAAC,GAAG,CAAC,SAAS,CAAC,CAAC;IACvB,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;AAClB,CAAC;AAED,sBAAsB;AACtB,IAAI,uBAAuB,GAAG,KAAK,CAAC;AACpC,IAAI,YAAY,GAAG,KAAK,CAAC;AAEzB,6DAA6D;AAC7D,SAAS,oBAAoB,CAAC,MAAc;IAC1C,IAAI,YAAY;QAAE,OAAO,CAAC,8BAA8B;IACxD,YAAY,GAAG,IAAI,CAAC;IAEpB,IAAI,iBAAiB,GAAG,KAAK,CAAC;IAC9B,IAAI,CAAC;QACH,IAAA,gCAAqB,GAAE,CAAC;IAC1B,CAAC;IAAC,OAAO,IAAa,EAAE,CAAC;QACvB,iBAAiB,GAAG,IAAI,CAAC;IAC3B,CAAC;IAED,OAAO,CAAC,KAAK,CAAC,uBAAuB,MAAM,sCAAsC,CAAC,CAAC;IACnF,OAAO,CAAC,IAAI,CAAC,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AAC1C,CAAC;AAED,SAAS,qBAAqB;IAC5B,IAAI,uBAAuB,EAAE,CAAC;QAC5B,OAAO;IACT,CAAC;IAED,OAAO,CAAC,EAAE,CAAC,SAAS,EAAE,GAAG,EAAE,CAAC,oBAAoB,CAAC,SAAS,CAAC,CAAC,CAAC;IAC7D,OAAO,CAAC,EAAE,CAAC,QAAQ,EAAE,GAAG,EAAE,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,CAAC;IAE3D,uBAAuB,GAAG,IAAI,CAAC;AACjC,CAAC;AAED,kEAAkE;AAClE,4BAA4B;AAC5B,kEAAkE;AAClE,SAAS,wBAAwB,CAAC,eAAuB;IACvD,OAAO,IAAA,gCAAgB,EAAC,IAAI,CAAC,OAAO,CAAC,aAAM,CAAC,YAAY,EAAE,eAAe,CAAC,EAAE,IAAA,0BAAmB,GAAE,CAAC,KAAK,IAAI,CAAC;AAC9G,CAAC;AAED,SAAS,iBAAiB,CAAC,UAAkB;IAC3C,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,UAAU,CAAC,CAAC;IAE7C,kHAAkH;IAClH,MAAM,eAAe,GAAG,UAAU,CAAC,OAAO,CAAC,KAAK,EAAE,GAAG,CAAC,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC;IAC3E,4DAA4D;IAC5D,MAAM,gBAAgB,GAAG,eAAe,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC;IACpD,oEAAoE;IACpE,IAAI,gBAAgB,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC;QACjC,MAAM,OAAO,GAAG,gBAAgB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC;QAC3C,IAAI,0BAAmB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC;YACjF,uEAAuE;YACvE,MAAM,cAAc,GAAG,wBAAwB,CAAC,eAAe,CAAC,CAAC;YAEjE,IAAI,CAAC,cAAc,EAAE,CAAC;gBACpB,qFAAqF;gBACrF,KAAK,MAAM,QAAQ,IAAI,IAAA,0BAAmB,GAAE,EAAE,CAAC;oBAC7C,MAAM,SAAS,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,eAAe,CAAC,CAAC;oBACvD,IACE,CAAC,IAAI,CAAC,UAAU,CAAC,eAAe,CAAC;wBACjC,MAAM,CAAC,UAAU,CAAC,SAAS,CAAC;wBAC5B,IAAA,gCAAgB,EAAC,SAAS,EAAE,IAAA,0BAAmB,GAAE,CAAC,KAAK,IAAI,EAC3D,CAAC;wBACD,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;oBACzB,CAAC;gBACH,CAAC;gBACD,OAAO;oBACL,KAAK,EAAE,KAAK;oBACZ,MAAM,EAAE,yDAAyD,UAAU,EAAE;iBAC9E,CAAC;YACJ,CAAC;YACD,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;QACzB,CAAC;IACH,CAAC;IAED,IAAI,CAAC,0BAAmB,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;QAC1C,IAAI,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;YAC/B,IAAI,OAAO,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;gBAC7B,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,sCAAsC,EAAE,CAAC;YAC1E,CAAC;YACD,IAAI,GAAG,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;gBACzB,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,sDAAsD,EAAE,CAAC;YAC1F,CAAC;YACD,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC;gBACxC,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,mEAAmE,EAAE,CAAC;YACvG,CAAC;QACH,CAAC;QACD,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,wDAAwD,EAAE,CAAC;IAC5F,CAAC;IAED,MAAM,cAAc,GAAG,wBAAwB,CAAC,eAAe,CAAC,CAAC;IAEjE,IAAI,CAAC,cAAc,EAAE,CAAC;QACpB,0EAA0E;QAC1E,yFAAyF;QACzF,OAAO;YACL,KAAK,EAAE,KAAK;YACZ,MAAM,EAAE,yDAAyD,UAAU,EAAE;SAC9E,CAAC;IACJ,CAAC;IAED,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;AACzB,CAAC;AAED,SAAS,6BAA6B,CAAC,MAAc;IACnD,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC;IACzC,MAAM,yBAAyB,GAAG,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,IAAI,CAC7D,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC;QAC3B,MAAM,CAAC,UAAU,CAAC,kBAAkB,CAAC,CACtC;QACC,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,aAAM,CAAC,YAAY,EAAE,MAAM,CAAC;QACxC,CAAC,CAAC,IAAI,CAAC;IAET,IAAI,kBAAkB,GAAkB,IAAI,CAAC;IAC7C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,EAAE,CAAC;QAC9B,IAAI,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,EAAE,CAAC;YAC5B,MAAM,gBAAgB,GAAG,MAAM,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,CAAC;YACnF,MAAM,WAAW,GAAG,gBAAgB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;YAC5C,MAAM,aAAa,GAAG,gBAAgB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;YAE9C,IACE,CAAC,WAAW,IAAI,0BAAmB,CAAC,IAAI,CAAC,WAAW,CAAC,CAAC;gBACtD,CAAC,aAAa,IAAI,WAAW,IAAI,0BAAmB,CAAC,IAAI,CAAC,aAAa,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,WAAW,CAAC,CAAC,EAClH,CAAC;gBACD,kBAAkB,GAAG,MAAM,CAAC;YAC9B,CAAC;QACH,CAAC;QAED,IAAI,OAAO,GAAG,MAAM,CAAC;QACrB,IAAI,OAAO,CAAC,UAAU,CAAC,kBAAkB,CAAC,EAAE,CAAC;YAC3C,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,kBAAkB,CAAC,MAAM,CAAC,CAAC;QACrD,CAAC;aAAM,IAAI,OAAO,CAAC,UAAU,CAAC,QAAQ,CAAC,EAAE,CAAC;YACxC,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC;QAC3C,CAAC;QACD,OAAO,GAAG,OAAO,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC;QAEtC,IAAI,CAAC,kBAAkB,IAAI,yBAAyB,IAAI,MAAM,CAAC,UAAU,CAAC,yBAAyB,CAAC,EAAE,CAAC;YACrG,kBAAkB,GAAG,yBAAyB,CAAC;QACjD,CAAC;QAED,MAAM,QAAQ,GAAG,OAAO,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC;QACpC,IAAI,CAAC,kBAAkB,IAAI,QAAQ,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC;YAChD,KAAK,MAAM,QAAQ,IAAI,IAAA,0BAAmB,GAAE,EAAE,CAAC;gBAC7C,MAAM,SAAS,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,GAAG,QAAQ,CAAC,CAAC;gBACnD,IAAI,MAAM,CAAC,UAAU,CAAC,SAAS,CAAC,EAAE,CAAC;oBACjC,kBAAkB,GAAG,SAAS,CAAC;oBAC/B,MAAM;gBACR,CAAC;YACH,CAAC;YACD,IAAI,CAAC,kBAAkB,IAAI,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC;gBACnF,MAAM,SAAS,GAAG,IAAA,yBAAkB,GAAE,CAAC;gBACvC,IAAI,SAAS,EAAE,CAAC;oBACd,kBAAkB,GAAG,IAAI,CAAC,IAAI,CAAC,SAAS,EAAE,GAAG,QAAQ,CAAC,CAAC;gBACzD,CAAC;YACH,CAAC;QACH,CAAC;IACH,CAAC;IAED,IAAI,kBAAkB,EAAE,CAAC;QACvB,OAAO,kBAAkB,CAAC;IAC5B,CAAC;IAED,MAAM,gBAAgB,GAAG,CACvB,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC;QAC3B,MAAM,CAAC,UAAU,CAAC,kBAAkB,CAAC;QACrC,gCAAyB,CAAC,IAAI,CAAC,UAAU,CAAC,CAC3C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC;IAE/B,OAAO,gBAAgB,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,IAAI,CAAC;AAC1C,CAAC;AAED,SAAS,wBAAwB,CAAC,IAA6B;IAC7D,KAAK,MAAM,GAAG,IAAI,CAAC,YAAY,EAAE,aAAa,EAAE,aAAa,CAAC,EAAE,CAAC;QAC/D,MAAM,KAAK,GAAG,IAAI,CAAC,GAAG,CAAC,CAAC;QACxB,IAAI,OAAO,KAAK,KAAK,QAAQ,IAAI,KAAK,CAAC,IAAI,EAAE,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;YACzD,OAAO,KAAK,CAAC,IAAI,EAAE,CAAC;QACtB,CAAC;IACH,CAAC;IAED,OAAO,IAAI,CAAC;AACd,CAAC;AAED,KAAK,UAAU,YAAY,CAAC,QAA2B,OAAO,CAAC,KAAK;IAClE,OAAO,MAAM,IAAI,OAAO,CAAS,CAAC,OAAO,EAAE,MAAM,EAAE,EAAE;QACnD,IAAI,MAAM,GAAG,EAAE,CAAC;QAChB,KAAK,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAC1B,KAAK,CAAC,EAAE,CAAC,MAAM,EAAE,CAAC,KAAa,EAAE,EAAE;YACjC,MAAM,IAAI,KAAK,CAAC;QAClB,CAAC,CAAC,CAAC;QACH,KAAK,CAAC,EAAE,CAAC,KAAK,EAAE,GAAG,EAAE,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC;QACvC,KAAK,CAAC,EAAE,CAAC,OAAO,EAAE,MAAM,CAAC,CAAC;IAC5B,CAAC,CAAC,CAAC;AACL,CAAC;AAED,SAAS,mBAAmB,CAAC,OAAe,EAAE,WAAiC;IAC7E,IAAI,OAAO,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,EAAE,CAAC;QAChC,MAAM,IAAI,KAAK,CAAC,GAAG,WAAW,mCAAmC,CAAC,CAAC;IACrE,CAAC;IAED,IAAI,MAAe,CAAC;IACpB,IAAI,CAAC;QACH,MAAM,GAAG,IAAI,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC;IAC/B,CAAC;IAAC,OAAO,KAAc,EAAE,CAAC;QACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,MAAM,IAAI,KAAK,CAAC,6BAA6B,WAAW,KAAK,MAAM,EAAE,CAAC,CAAC;IACzE,CAAC;IAED,IAAI,OAAO,MAAM,KAAK,QAAQ,IAAI,MAAM,KAAK,IAAI,IAAI,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,EAAE,CAAC;QAC3E,MAAM,IAAI,KAAK,CAAC,GAAG,WAAW,iCAAiC,CAAC,CAAC;IACnE,CAAC;IAED,OAAO,MAAiC,CAAC;AAC3C,CAAC;AAED,KAAK,UAAU,4BAA4B,CACzC,IAA0B,EAC1B,IAAc,EACd,WAA2D;IAE3D,IAAI,IAAI,KAAK,SAAS,IAAI,OAAO,CAAC,KAAK,CAAC,KAAK,EAAE,CAAC;QAC9C,OAAO,CAAC,KAAK,CAAC,8BAA8B,CAAC,CAAC;QAC9C,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;IAED,MAAM,OAAO,GAAG,IAAI,KAAK,SAAS;QAChC,CAAC,CAAC,MAAM,WAAW,EAAE;QACrB,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAEZ,IAAI,IAAI,KAAK,QAAQ,IAAI,OAAO,KAAK,SAAS,EAAE,CAAC;QAC/C,MAAM,IAAI,KAAK,CAAC,gDAAgD,CAAC,CAAC;IACpE,CAAC;IAED,wDAAwD;IACxD,IAAI,IAAI,KAAK,QAAQ,IAAI,CAAC,OAAO,KAAK,SAAS,IAAI,OAAO,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,CAAC,EAAE,CAAC;QAChF,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,SAAS,CAAC,EAAE,KAAK,EAAE,kBAAkB,EAAE,OAAO,EAAE,oBAAoB,EAAE,CAAC,CAAC,CAAC;QAC1F,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;IAED,MAAM,OAAO,GAAG,mBAAmB,CAAC,OAAO,IAAI,EAAE,EAAE,IAAI,CAAC,CAAC;IACzD,MAAM,qBAAqB,GAAG,IAAI,CAAC,IAAI,KAAK,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;IAC/D,MAAM,cAAc,GAAG,qBAAqB,CAAC,CAAC,CAAC,6BAA6B,CAAC,qBAAqB,CAAC,IAAI,qBAAqB,CAAC,CAAC,CAAC,IAAI,CAAC;IACpI,MAAM,gBAAgB,GAAG,wBAAwB,CAAC,OAAO,CAAC,CAAC;IAC3D,MAAM,aAAa,GAAG,gBAAgB,CAAC,CAAC,CAAC,CAAC,6BAA6B,CAAC,gBAAgB,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC;IACtH,MAAM,aAAa,GAAG,cAAc,IAAI,aAAa,CAAC;IAEtD,IAAI,CAAC,aAAa,EAAE,CAAC;QACnB,MAAM,IAAI,KAAK,CAAC,GAAG,IAAI,mFAAmF,CAAC,CAAC;IAC9G,CAAC;IAED,OAAO;QACL,QAAQ,EAAE,IAAI;QACd,aAAa;QACb,aAAa,EAAE;YACb,GAAG,OAAO;YACV,OAAO,EAAE,MAAM;SAChB;QACD,SAAS,EAAE,IAAI;KAChB,CAAC;AACJ,CAAC;AAED,kEAAkE;AAClE,0BAA0B;AAC1B,kEAAkE;AAClE,KAAK,UAAU,cAAc,CAC3B,OAAiB,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,EACtC,cAA8D,YAAY;IAE1E,kEAAkE;IAClE,IAAI,SAAS,GAAkB,IAAI,CAAC;IACpC,MAAM,YAAY,GAAa,EAAE,CAAC;IAClC,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,IAAI,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE,CAAC;QACrC,IAAI,IAAI,CAAC,CAAC,CAAC,KAAK,cAAc,EAAE,CAAC;YAC/B,MAAM,SAAS,GAAG,IAAI,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC;YAC9B,IAAI,CAAC,SAAS,IAAI,SAAS,CAAC,UAAU,CAAC,IAAI,CAAC,IAAI,SAAS,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,EAAE,CAAC;gBAC9E,MAAM,IAAI,KAAK,CAAC,yCAAyC,CAAC,CAAC;YAC7D,CAAC;YACD,SAAS,GAAG,SAAS,CAAC,IAAI,EAAE,CAAC;YAC7B,CAAC,EAAE,CAAC,CAAC,iBAAiB;YACtB,SAAS;QACX,CAAC;QACD,YAAY,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC;IAC7B,CAAC;IAED,MAAM,CAAC,UAAU,EAAE,YAAY,CAAC,GAAG,YAAY,CAAC;IAChD,IAAI,CAAC,UAAU,EAAE,CAAC;QAChB,OAAO,EAAE,QAAQ,EAAE,IAAI,EAAE,aAAa,EAAE,IAAI,EAAE,aAAa,EAAE,IAAI,EAAE,SAAS,EAAE,CAAC;IACjF,CAAC;IAED,IAAI,UAAU,KAAK,SAAS,IAAI,UAAU,KAAK,QAAQ,EAAE,CAAC;QACxD,MAAM,UAAU,GAAG,MAAM,4BAA4B,CAAC,UAAU,EAAE,YAAY,EAAE,WAAW,CAAC,CAAC;QAC7F,OAAO,EAAE,GAAG,UAAU,EAAE,SAAS,EAAE,CAAC;IACtC,CAAC;IAED,MAAM,kBAAkB,GAAG,6BAA6B,CAAC,UAAU,CAAC,CAAC;IACrE,IAAI,kBAAkB,EAAE,CAAC;QACvB,MAAM,IAAI,KAAK,CACb,kDAAkD;YAClD,+DAA+D,CAChE,CAAC;IACJ,CAAC;IAED,OAAO;QACL,QAAQ,EAAE,UAAU;QACpB,aAAa,EAAE,YAAY,IAAI,IAAI;QACnC,aAAa,EAAE,IAAI;QACnB,SAAS;KACV,CAAC;AACJ,CAAC;AAED,SAAS,iBAAiB;IACxB,MAAM,aAAa,GAAG,aAAM,CAAC,eAAe,CAAC;IAC7C,IAAI,CAAC,aAAa;QAAE,OAAO;IAE3B,MAAM,UAAU,GAAG,iBAAiB,CAAC,aAAa,CAAC,CAAC;IAEpD,IAAI,UAAU,CAAC,OAAO,EAAE,CAAC;QACvB,OAAO,CAAC,IAAI,CAAC,eAAe,UAAU,CAAC,OAAO,EAAE,CAAC,CAAC;IACpD,CAAC;IAED,IAAI,UAAU,CAAC,KAAK;QAAE,OAAO;IAE7B,+EAA+E;IAC/E,MAAM,aAAa,GAAG,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC;IACnD,IAAI,0BAAmB,CAAC,IAAI,CAAC,aAAa,CAAC,EAAE,CAAC;QAC5C,2EAA2E;QAC3E,sDAAsD;QACtD,MAAM,QAAQ,GAAG,IAAA,0BAAmB,EAAC,aAAa,CAAC,CAAC;QACpD,IAAI,QAAQ,EAAE,CAAC;YACb,OAAO,CAAC,KAAK,CAAC,6BAA6B,aAAa,OAAO,QAAQ,EAAE,CAAC,CAAC;YAC3E,aAAM,CAAC,eAAe,GAAG,QAAQ,CAAC;YAClC,OAAO;QACT,CAAC;QACD,2DAA2D;IAC7D,CAAC;IAED,OAAO,CAAC,KAAK,CAAC,wCAAwC,aAAa,EAAE,CAAC,CAAC;IACvE,OAAO,CAAC,KAAK,CAAC,cAAc,UAAU,CAAC,MAAM,EAAE,CAAC,CAAC;IACjD,OAAO,CAAC,KAAK,CAAC,yEAAyE,CAAC,CAAC;IAEzF,MAAM,QAAQ,GAAG,IAAA,yBAAkB,GAAE,IAAI,IAAI,CAAC,IAAI,CAAC,aAAM,CAAC,YAAY,EAAE,OAAO,CAAC,CAAC;IACjF,IAAI,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC,EAAE,CAAC;QAChC,IAAI,CAAC;YACH,MAAM,SAAS,GAAG,MAAM,CAAC,WAAW,CAAC,QAAQ,CAAC,CAAC;YAC/C,MAAM,OAAO,GAAG,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC;YAEjH,IAAI,OAAO,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;gBACvB,OAAO,CAAC,KAAK,CAAC,eAAe,CAAC,CAAC;gBAC/B,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;YACpD,CAAC;iBAAM,CAAC;gBACN,+DAA+D;gBAC/D,IAAI,WAAW,GAAa,EAAE,CAAC;gBAC/B,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC;gBAEhD,KAAK,MAAM,QAAQ,IAAI,SAAS,EAAE,CAAC;oBACjC,MAAM,MAAM,GAAG,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;oBAClD,MAAM,UAAU,GAAG,8BAAuB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;oBAC1D,IAAI,CAAC,MAAM,IAAI,CAAC,UAAU;wBAAE,SAAS;oBACrC,MAAM,OAAO,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,QAAQ,CAAC,CAAC;oBAC9C,IAAI,CAAC;wBACH,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC,WAAW,EAAE;4BAAE,SAAS;wBACtD,MAAM,WAAW,GAAG,MAAM,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC;wBAChD,kDAAkD;wBAClD,MAAM,YAAY,GAAG,WAAW,CAAC,MAAM,CACrC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAC7D,CAAC;wBACF,KAAK,MAAM,KAAK,IAAI,YAAY,EAAE,CAAC;4BACjC,WAAW,CAAC,IAAI,CAAC,GAAG,QAAQ,IAAI,KAAK,EAAE,CAAC,CAAC;wBAC3C,CAAC;wBACD,0EAA0E;wBAC1E,IAAI,UAAU,EAAE,CAAC;4BACf,KAAK,MAAM,QAAQ,IAAI,WAAW,EAAE,CAAC;gCACnC,IAAI,CAAC,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC;oCAAE,SAAS;gCAClD,MAAM,OAAO,GAAG,IAAI,CAAC,IAAI,CAAC,OAAO,EAAE,QAAQ,CAAC,CAAC;gCAC7C,IAAI,CAAC;oCACH,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC,WAAW,EAAE;wCAAE,SAAS;oCACtD,MAAM,aAAa,GAAG,MAAM,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC;oCAClD,MAAM,SAAS,GAAG,aAAa,CAAC,MAAM,CACpC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAC7D,CAAC;oCACF,KAAK,MAAM,EAAE,IAAI,SAAS,EAAE,CAAC;wCAC3B,WAAW,CAAC,IAAI,CAAC,GAAG,QAAQ,IAAI,QAAQ,IAAI,EAAE,EAAE,CAAC,CAAC;oCACpD,CAAC;gCACH,CAAC;gCAAC,OAAO,MAAe,EAAE,CAAC;oCACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;wCAC5B,0BAA0B;oCAC5B,CAAC;gCACH,CAAC;4BACH,CAAC;wBACH,CAAC;oBACH,CAAC;oBAAC,OAAO,MAAe,EAAE,CAAC;wBACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;4BAC5B,0BAA0B;wBAC5B,CAAC;oBACH,CAAC;gBACH,CAAC;gBAED,IAAI,WAAW,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;oBAC3B,OAAO,CAAC,KAAK,CAAC,+BAA+B,CAAC,CAAC;oBAC/C,WAAW,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;gBACxD,CAAC;qBAAM,CAAC;oBACN,MAAM,QAAQ,GAAG,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,cAAc,CAAC,CAAC;yBACtE,IAAI,EAAE,CAAC,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC;oBACxD,IAAI,QAAQ,CAAC,MAAM,EAAE,CAAC;wBACpB,OAAO,CAAC,KAAK,CAAC,yBAAyB,CAAC,CAAC;wBACzC,QAAQ,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;oBACrD,CAAC;gBACH,CAAC;YACH,CAAC;QACH,CAAC;QAAC,OAAO,KAAc,EAAE,CAAC;YACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;YACtE,OAAO,CAAC,KAAK,CAAC,iDAAiD,EAAE,MAAM,CAAC,CAAC;QAC3E,CAAC;IACH,CAAC;IACD,OAAO,CAAC,KAAK,CAAC,sIAAsI,CAAC,CAAC;IACtJ,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;AAClB,CAAC;AAED,kEAAkE;AAClE,sBAAsB;AACtB,kEAAkE;AAClE,KAAK,UAAU,IAAI,CACjB,OAAiB,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,EACtC,cAA8D,YAAY;IAE1E,OAAO,CAAC,KAAK,CAAC,4BAA4B,CAAC,CAAC;IAE5C,IAAI,CAAC;QACH,MAAM,MAAM,GAAG,MAAM,cAAc,CAAC,IAAI,EAAE,WAAW,CAAC,CAAC;QACvD,aAAM,CAAC,SAAS,GAAG,MAAM,CAAC,QAAQ,CAAC;QACnC,aAAM,CAAC,eAAe,GAAG,MAAM,CAAC,aAAa,CAAC;QAC9C,iBAAiB,EAAE,CAAC;QAEpB,MAAM,IAAA,sBAAW,EAAC;YAChB,QAAQ,EAAE,MAAM,CAAC,aAAa,CAAC,CAAC,CAAC,SAAS,CAAC,CAAC,CAAC,aAAM,CAAC,SAAS,IAAI,SAAS;YAC1E,aAAa,EAAE,aAAM,CAAC,eAAe,IAAI,SAAS;YAClD,aAAa,EAAE,MAAM,CAAC,aAAa,IAAI,SAAS;YAChD,UAAU,EAAE,MAAM,CAAC,aAAa;gBAC9B,CAAC,CAAC,SAAS;gBACX,CAAC,CAAC,GAAG,EAAE,CAAC,IAAA,2BAAiB,EAAC,EAAE,CAAC;YAC/B,oBAAoB,EAAE,yCAAkB;YACxC,SAAS,EAAE,MAAM,CAAC,SAAS,IAAI,SAAS;SACzC,CAAC,CAAC;IACL,CAAC;IAAC,OAAO,KAAc,EAAE,CAAC;QACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,MAAM,UAAU,GAAG,iQAAiQ,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;QAElS,IAAI,UAAU,EAAE,CAAC;YACf,OAAO,CAAC,KAAK,CAAC,YAAY,MAAM,EAAE,CAAC,CAAC;QACtC,CAAC;aAAM,CAAC;YACN,OAAO,CAAC,KAAK,CAAC,mBAAmB,EAAE,MAAM,CAAC,CAAC;YAC3C,IAAI,KAAK,YAAY,KAAK,EAAE,CAAC;gBAC3B,OAAO,CAAC,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC;YAC7B,CAAC;QACH,CAAC;QACD,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;AACH,CAAC;AAED,kEAAkE;AAClE,aAAa;AACb,kEAAkE;AAClE,IAAI,OAAO,CAAC,IAAI,KAAK,MAAM,EAAE,CAAC;IAC5B,qBAAqB,EAAE,CAAC;IACxB,IAAI,EAAE,CAAC,KAAK,CAAC,CAAC,KAAc,EAAE,EAAE;QAC9B,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,OAAO,CAAC,KAAK,CAAC,gBAAgB,MAAM,EAAE,CAAC,CAAC;QACxC,IAAI,KAAK,YAAY,KAAK,EAAE,CAAC;YAC3B,OAAO,CAAC,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC;QAC7B,CAAC;QACD,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC,CAAC,CAAC;AACL,CAAC"}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/tasks.md:2:title: "Tasks: Implementation Phase"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/002-implement/tasks.md:7:importance_tier: "normal"
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
.opencode/skill/system-spec-kit/scripts/dist/utils/validation-utils.js:71:        console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:63:    'untitled',
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:166:    let normalizedBase = normalizeTitleCandidate(base) || 'Untitled';
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:169:        normalizedBase = normalizeTitleCandidate(normalizedBase.slice(0, normalizedBase.length - normalizedSuffix.length).trim()) || 'Untitled';
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:642: * that may contain both `importance_tier` (static default) and `importanceTier`
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:647:    const importanceKeys = new Set(['importance_tier', 'importancetier']);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:743:    return normalizeTitleCandidate(text) || 'Untitled';
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:778:function inferTriggerPhrases(title, existingTriggers, classification) {
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:786:    const titleNoSuffix = title.replace(/\s*\[[^\]]+\]\s*$/, '').trim();
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:787:    const titleTokens = tokenize(titleNoSuffix).slice(0, 5);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:788:    generated.push(...titleTokens);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:875:    return normalizeImportanceTier(extractMemoryMetadataScalar(content, ['importance_tier']));
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:922:    return mutateMemoryMetadataBlock(content, (yamlBody) => (upsertTopLevelYamlField(yamlBody, 'importance_tier', [`importance_tier: "${importanceTier}"`])));
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:930:        : extractMemoryMetadataStringArray(content, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:932:        ? ['trigger_phrases:', ...resolvedTriggerPhrases.map((triggerPhrase) => `  - "${triggerPhrase}"`)]
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:933:        : ['trigger_phrases: []'];
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:934:    return mutateMemoryMetadataBlock(content, (yamlBody) => (upsertTopLevelYamlField(yamlBody, 'trigger_phrases', replacementLines)));
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:957:    const trigger_phrases = existingTriggers.length > 0
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:961:        title: '{{MEMORY_DASHBOARD_TITLE}}',
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:963:        trigger_phrases,
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:964:        importance_tier: '{{IMPORTANCE_TIER}}',
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:970:    const existingTitleValue = sectionValueByKeys(sections, ['title']);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:972:    const existingTriggersValue = sectionValueByKeys(sections, ['trigger_phrases', 'triggerPhrases']);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:992:    const titleBase = inferTitleBase(content, existingTitle, classification);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:993:    const title = truncateWithSuffix(titleBase, classification.suffix, maxTitleLength);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:995:    const trigger_phrases = inferTriggerPhrases(title, existingTriggers, classification);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:997:    const importance_tier = resolveManagedImportanceTier(content, existingTier, classification, contextType);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:999:        title,
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1001:        trigger_phrases,
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1002:        importance_tier,
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1010:    'title',
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1012:    'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1014:    'importance_tier',
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1026:    lines.push(...sectionToLines('title', managed.title));
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1030:    if (managed.trigger_phrases && managed.trigger_phrases.length > 0) {
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1031:        lines.push(...sectionToLines('trigger_phrases', managed.trigger_phrases));
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1033:    lines.push(...sectionToLines('importance_tier', managed.importance_tier));
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1074:        content = syncMemoryMetadataImportanceTier(content, managed.importance_tier);
.opencode/skill/system-spec-kit/scripts/dist/lib/frontmatter-migration.js:1076:        content = syncMemoryMetadataTriggerPhrases(content, managed.trigger_phrases);
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js:34:            title: block.type === 'heading' ? extractHeadingTitle(block.content) : null,
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/spec.md:2:title: "Feature Specification: Design Phase"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/spec.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.js:12:// Shared helpers for memory task title enrichment decisions
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.js:17:/** Normalizes a spec title for reuse in memory task enrichment. */
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.js:18:function normalizeSpecTitleForMemory(title) {
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.js:19:    return (0, slug_utils_1.normalizeMemoryNameCandidate)(title);
.opencode/skill/system-spec-kit/scripts/dist/utils/task-enrichment.js:21:/** Returns whether the spec title should enrich the stored memory task. */
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/plan.md:2:title: "Implementation Plan: Design Phase"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/plan.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/cli-capture-shared.js:194: * Builds a human-readable session title from the first non-empty
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/tasks.md:2:title: "Tasks: Design Phase"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase/001-design/tasks.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/trigger-extractor.js:6:exports.STOP_WORDS_ENGLISH = exports.CONFIG = exports.extract_trigger_phrases_with_stats = exports.extract_trigger_phrases = void 0;
.opencode/skill/system-spec-kit/scripts/dist/lib/trigger-extractor.js:57:exports.extract_trigger_phrases = extractTriggerPhrases;
.opencode/skill/system-spec-kit/scripts/dist/lib/trigger-extractor.js:58:exports.extract_trigger_phrases_with_stats = extractTriggerPhrasesWithStats;
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:7:// historical memory trigger_phrases using the live sanitizer plus bounded
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:59:  --apply              Rewrite trigger_phrases in-place with atomic writes
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:104:function canonicalizeTitleKey(title) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:105:    return canonicalizePhraseKey(title).replace(/\b\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:289:    const range = locateFrontmatterSectionRange(detection.rawBlock, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:293:    const replacementLines = buildYamlArraySection('trigger_phrases', nextTriggers);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:306:    const titleSection = detection.sections.find((section) => section.key === 'title');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:307:    const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:308:    const titleValue = titleSection ? (0, frontmatter_migration_1.parseSectionValue)(titleSection) : undefined;
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:310:    const title = typeof titleValue === 'string' ? titleValue : '';
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:315:        title,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:320:function resolveTriggerPhrases(triggerPhrases, title) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:321:    const titleKey = canonicalizeTitleKey(title);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:354:        const titleOverlap = titleKey.length > 0
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:356:            && new RegExp(`(?:^| )${escapeRegex(canonicalKey)}(?:$| )`, 'i').test(titleKey);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:357:        if (titleOverlap) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:360:                reason: 'title_overlap',
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:399:        title_overlap: 0,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:405:            const resolution = resolveTriggerPhrases(parsed.triggerPhrases, parsed.title);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:419:                title: parsed.title,
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/spec.md:2:title: "Feature Specification: Missing Child Docs Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/spec.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/plan.md:2:title: "Implementation Plan: Missing Child Docs Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/plan.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:367:function detectContinuationPattern(title) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:369:        if (candidate.pattern.test(title)) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:378:    const title = normalizeScalarValue(frontmatter.title);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:379:    const triggers = parseFrontmatterArray(content, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:387:        title,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:424:        continuationPattern: detectContinuationPattern(parsed.title),
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:446:    const frontmatterTier = normalizeScalarValue(frontmatter.importance_tier);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:447:    const metadataTier = normalizeScalarValue(metadata.importance_tier);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/tasks.md:2:title: "Tasks: Missing Child Docs Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/tasks.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts.map:1:{"version":3,"file":"generate-context.d.ts","sourceRoot":"","sources":["../../memory/generate-context.ts"],"names":[],"mappings":"AA4BA,KAAK,uBAAuB,GAAG,MAAM,CAAC,MAAM,EAAE,OAAO,CAAC,GAAG;IAAE,OAAO,EAAE,MAAM,CAAA;CAAE,CAAC;AAE7E,UAAU,kBAAkB;IAC1B,QAAQ,EAAE,MAAM,GAAG,IAAI,CAAC;IACxB,aAAa,EAAE,MAAM,GAAG,IAAI,CAAC;IAC7B,aAAa,EAAE,uBAAuB,GAAG,IAAI,CAAC;IAC9C,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC1B;AAKD,8DAA8D;AAC9D,MAAM,WAAW,oBAAoB;IACnC,KAAK,EAAE,OAAO,CAAC;IACf,MAAM,CAAC,EAAE,MAAM,CAAC;IAChB,OAAO,CAAC,EAAE,MAAM,CAAC;CAClB;AA4HD,iBAAS,iBAAiB,CAAC,UAAU,EAAE,MAAM,GAAG,oBAAoB,CA8DnE;AAqED,iBAAS,wBAAwB,CAAC,IAAI,EAAE,MAAM,CAAC,MAAM,EAAE,OAAO,CAAC,GAAG,MAAM,GAAG,IAAI,CAS9E;AAED,iBAAe,YAAY,CAAC,KAAK,GAAE,MAAM,CAAC,UAA0B,GAAG,OAAO,CAAC,MAAM,CAAC,CAUrF;AAuED,iBAAe,cAAc,CAC3B,IAAI,GAAE,MAAM,EAA0B,EACtC,WAAW,GAAE,CAAC,KAAK,CAAC,EAAE,MAAM,CAAC,UAAU,KAAK,OAAO,CAAC,MAAM,CAAgB,GACzE,OAAO,CAAC,kBAAkB,CAAC,CAyC7B;AAED,iBAAS,iBAAiB,IAAI,IAAI,CA0GjC;AAKD,iBAAe,IAAI,CACjB,IAAI,GAAE,MAAM,EAA0B,EACtC,WAAW,GAAE,CAAC,KAAK,CAAC,EAAE,MAAM,CAAC,UAAU,KAAK,OAAO,CAAC,MAAM,CAAgB,GACzE,OAAO,CAAC,IAAI,CAAC,CAiCf;AAiBD,OAAO,EACL,IAAI,EACJ,YAAY,EACZ,cAAc,EACd,iBAAiB,EACjB,iBAAiB,EACjB,wBAAwB,GACzB,CAAC"}
.opencode/skill/system-spec-kit/scripts/dist/lib/cli-capture-shared.d.ts:57: * Builds a human-readable session title from the first non-empty
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/spec.md:2:title: "Feature Specification: Design Phase (Missing Docs)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/spec.md:7:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/tasks.md:2:title: "Tasks: Design Phase (Missing Docs)"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/missing-child-docs/001-design/tasks.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:121:    `title: "${String(data.MEMORY_TITLE ?? 'Test Memory')}"`,
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:123:    String(data.TRIGGER_PHRASES_YAML ?? 'trigger_phrases: []'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:124:    'importance_tier: "normal"',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:454:  it('detects leaked template and instructional titles', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:478:  it('strips spec-style prefixes and template suffixes from frontmatter titles', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:504:  it('normalizes spec-prefixed frontmatter titles before slug generation', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:528:  it('uses enriched spec title for stateless implementation-and-updates', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:543:  it('strips literal mustache tokens from candidate titles before slug generation', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:550:  it('picks the best specific memory task from task, spec title, and folder base', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:558:  it('prefers specific session semantics over folder fallback when task and spec title are unusable', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:567:  it('skips spec title fallback in file-backed mode and preserves other specific candidates', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:598:    title?: string;
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:613:      `title: "${overrides.title ?? 'Memory Audit Naming Fix'}"`,
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:649:      'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:674:        'The old banner phrase was discussed in prose, but it did not render as the memory title or heading.',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:744:          'title: "Child Phase"',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:757:          'Validated the 001-child phase memory save path during the follow-up audit.',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:769:  it('fails when template instructional text leaks into the title', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:771:      title: 'To promote a memory to constitutional tier (always surfaced)',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:778:  it('fails when a generic stub title survives into the rendered output', () => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:780:      title: 'Draft',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:785:    expect(result.contaminationAudit.matchesFound).toContain('title:generic stub title');
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:881:          title: 'Implementation and updates',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:950:      ['---', 'title: "Spec: To promote a memory to constitutional tier (always surfaced)"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:996:      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1013:              title: 'Implementation and updates',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1046:      ['---', 'title: "Spec: Session Source Validation"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1133:          title: 'Workflow hardening',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1191:          title: 'Prepare media editor flow',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1233:      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1288:      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1324:              title: 'Threshold coverage',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1349:      ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1360:      'title: "Broken render"',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1362:      'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1364:      'importance_tier: "normal"',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1385:              title: 'Contract proof',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1415:      ['---', 'title: "Spec: Generic Memory Filename Fix in Stateless Mode"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1475:      ['---', 'title: "Spec: Generic Memory Filename Fix in Stateless Mode"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1555:      ['---', 'title: "Spec: To promote a memory to constitutional tier (always surfaced)"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1569:          title: 'Implementation and updates',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1570:          narrative: 'Generic observation title should not force a folder slug fallback.',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1607:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1625:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1646:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1670:      '<svg><title>vector</title><text>drop the svg payload</text></svg>',
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:8:function buildContent(title: string): string {
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:11:    `title: "${title}"`,
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:14:    `# ${title}`,
.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:80:          title: 'Observed follow-up work',
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/dist/lib/simulation-factory.js:270:    const title = config.title || 'Simulated Decision Example';
.opencode/skill/system-spec-kit/scripts/dist/lib/simulation-factory.js:276:            TITLE: title,
.opencode/skill/system-spec-kit/scripts/dist/lib/simulation-factory.js:342:    const title = config.title || 'Example Workflow';
.opencode/skill/system-spec-kit/scripts/dist/lib/simulation-factory.js:361:                TITLE: title,
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/spec.md:2:title: "Feature Specification: No Children Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/spec.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:23:  importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:35:  const match = content.match(/^importance_tier:\s*"?(.*?)"?$/m);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:40:  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml[\s\S]*?^importance_tier:\s*"?(.*?)"?$/m);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:47:    'title: "Phase 2 PR-3 drift fixture"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:49:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:51:    `importance_tier: "${frontmatterTier}"`,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:65:    `importance_tier: "${metadataTier}"`,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:88:  it('keeps both serialized importance_tier locations aligned after the managed-frontmatter rewrite', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:120:      field: 'importance_tier',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:128:      'title: "Phase 2 PR-3 parity fixture"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:130:      'importance_tier: "important"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:139:      'importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:154:    expect(result.issues.some((issue) => issue.field === 'importance_tier')).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/plan.md:2:title: "Implementation Plan: No Children Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/plan.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/058-template-reordered-anchor/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/058-template-reordered-anchor/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/058-template-reordered-anchor/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.mjs:15:`}}a(Xr,"L");function Qr(t){const e=t.help||{};if("usage"in e)return e.usage?{id:"usage",type:"section",data:{title:"Usage:",body:Array.isArray(e.usage)?e.usage.join(`
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.mjs:16:`):e.usage}}:void 0;if(t.name){const u=[],s=[Gu(t)];if(t.flags&&Object.keys(t.flags).length>0&&s.push("[flags...]"),t.parameters&&t.parameters.length>0){const{parameters:n}=t,r=n.indexOf("--"),i=r>-1&&n.slice(r+1).some(D=>D.startsWith("<"));s.push(n.map(D=>D!=="--"?D:i?"--":"[--]").join(" "))}if(s.length>1&&u.push(s.join(" ")),"commands"in t&&t.commands?.length&&u.push(`${t.name} <command>`),u.length>0)return{id:"usage",type:"section",data:{title:"Usage:",body:u.join(`
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.mjs:17:`)}}}}a(Qr,"T");function Zr(t){return!("commands"in t)||!t.commands?.length?void 0:{id:"commands",type:"section",data:{title:"Commands:",body:{type:"table",data:{tableData:t.commands.map(e=>[e.options.name,e.options.help?e.options.help.description:""]),tableOptions:[{width:"content-width",paddingLeft:2,paddingRight:8}]}},indentBody:0}}}a(Zr,"_");function Jr(t){if(!(!t.flags||Object.keys(t.flags).length===0))return{id:"flags",type:"section",data:{title:"Flags:",body:Yr(t.flags),indentBody:0}}}a(Jr,"k");function ei(t){const{help:e}=t;if(!e||!e.examples||e.examples.length===0)return;let{examples:u}=e;if(Array.isArray(u)&&(u=u.join(`
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.mjs:18:`)),u)return{id:"examples",type:"section",data:{title:"Examples:",body:u}}}a(ei,"F");function ti(t){if(!("alias"in t)||!t.alias)return;const{alias:e}=t;return{id:"aliases",type:"section",data:{title:"Aliases:",body:Array.isArray(e)?e.join(", "):e}}}a(ti,"H");const ui=a(t=>[qr,Xr,Qr,Zr,Jr,ei,ti].map(e=>e(t)).filter(Boolean),"U"),si=bn.WriteStream.prototype.hasColors();class ni{static{a(this,"M")}text(e){return e}bold(e){return si?`\x1B[1m${e}\x1B[22m`:e.toLocaleUpperCase()}indentText({text:e,spaces:u}){return e.replace(/^/gm," ".repeat(u))}heading(e){return this.bold(e)}section({title:e,body:u,indentBody:s=2}){return`${(e?`${this.heading(e)}
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/tasks.md:2:title: "Tasks: No Children Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/no-children/tasks.md:8:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/lib/ascii-boxes.d.ts:49:declare function formatDecisionHeader(title: string, context: string, confidence: number, timestamp: string, choiceConfidence?: number, rationaleConfidence?: number): string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:6:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:18:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:32:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:50:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:75:function generateSemanticSlug(title, maxWords = 4) {
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:76:    if (!title || typeof title !== 'string')
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:78:    return title
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:99:    // Remove redundant category prefix from title
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:100:    let cleanTitle = sectionTitle || 'Untitled';
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:117:    const title = sectionTitle.toLowerCase();
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:118:    if (/decision|choice|selected|approach|alternative|option/i.test(title))
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:122:    if (/how to|extend|add new|guide|steps|instructions|tutorial/i.test(title))
.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js:124:    if (/architecture|design|system|structure|flow|model|schema/i.test(title))
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:107:        name: 'title-contamination',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:112:        reason: 'A contaminated title undermines retrieval quality and saved-memory truthfulness.',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:139:        reason: 'Memory content with zero topical overlap with spec trigger_phrases suggests off-target capture.',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:173:    { pattern: /(^title:\s*"|^#\s+)To promote a memory to constitutional tier/im, label: 'template instructional banner leakage' },
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:187:    { pattern: /^\[[^\]]+\]$/i, label: 'placeholder bracket title' },
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:188:    { pattern: /^(untitled|draft|todo|tbd)(?:\s+(memory|session|summary|document|notes?))?$/i, label: 'generic stub title' },
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:189:    { pattern: /^\d{3}(?:-[a-z0-9][a-z0-9-]*)?$/i, label: 'spec-id-only title' },
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:651:    const triggerPhrases = parseYamlListFromContent(content, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:656:        message: sparseSemantic ? 'sparse semantic fields: trigger_phrases empty' : 'ok',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:745:    const titleValue = extractYamlValueFromContent(content, 'title') || extractFirstHeading(content);
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:746:    const titlePatternMatch = TITLE_CONTAMINATION_PATTERNS.find(({ pattern }) => pattern.test(titleValue));
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:749:        passed: !titlePatternMatch,
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:750:        message: titlePatternMatch ? `contaminated title: ${titlePatternMatch.label}` : 'ok',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:768:    const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:778:                hasErrorTitle ? 'title' : '',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:779:                errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:783:    // V12: Topical coherence — check if memory content overlaps with spec's trigger_phrases
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:810:                        specTriggerPhrases = parseYamlListFromContent(specContent, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:829:                v12Message = `V12_TOPICAL_MISMATCH: zero of ${specTriggerPhrases.length} spec trigger_phrases found in memory content`;
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:888:            'frontmatter:trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:892:            ...TITLE_CONTAMINATION_PATTERNS.map(({ label }) => `title:${label}`),
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:896:            ...(titlePatternMatch ? [`title:${titlePatternMatch.label}`] : []),
.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js:903:            `trigger_phrases:${triggerPhrases.length}`,
.opencode/skill/system-spec-kit/scripts/test-fixtures/061-template-optional-absent/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/061-template-optional-absent/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/061-template-optional-absent/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:73:  it('triggers V12 when memory content has zero overlap with spec trigger_phrases', () => {
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:74:    // Build a memory file whose content has no overlap with the spec's trigger_phrases.
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:75:    // V12 requires a spec_folder that points to a spec.md with trigger_phrases, and then
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:83:      'title: "Unrelated Topic"',
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:86:      'trigger_phrases: []',
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:96:    // V12 passes when no spec.md is found on disk (no trigger_phrases to compare against).
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:97:    // The rule only fires when it can read a spec.md with trigger_phrases and finds zero overlap.
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:113:  it('limits transcript-style tool-title downgrades to the capable source set', () => {
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:117:    expect(getSourceCapabilities('copilot-cli-capture').toolTitleWithPathExpected).toBe(true); // O4-13: Copilot CLI uses Claude models that produce tool titles
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/spec.md:2:title: "Feature Specification: Level 1 Fixture [template:level_1/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.cjs:14:`}}a(Gs,"L");function Ws(t){const e=t.help||{};if("usage"in e)return e.usage?{id:"usage",type:"section",data:{title:"Usage:",body:Array.isArray(e.usage)?e.usage.join(`
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.cjs:15:`):e.usage}}:void 0;if(t.name){const u=[],r=[Wu(t)];if(t.flags&&Object.keys(t.flags).length>0&&r.push("[flags...]"),t.parameters&&t.parameters.length>0){const{parameters:n}=t,s=n.indexOf("--"),i=s>-1&&n.slice(s+1).some(D=>D.startsWith("<"));r.push(n.map(D=>D!=="--"?D:i?"--":"[--]").join(" "))}if(r.length>1&&u.push(r.join(" ")),"commands"in t&&t.commands?.length&&u.push(`${t.name} <command>`),u.length>0)return{id:"usage",type:"section",data:{title:"Usage:",body:u.join(`
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.cjs:16:`)}}}}a(Ws,"T");function js(t){return!("commands"in t)||!t.commands?.length?void 0:{id:"commands",type:"section",data:{title:"Commands:",body:{type:"table",data:{tableData:t.commands.map(e=>[e.options.name,e.options.help?e.options.help.description:""]),tableOptions:[{width:"content-width",paddingLeft:2,paddingRight:8}]}},indentBody:0}}}a(js,"_");function Us(t){if(!(!t.flags||Object.keys(t.flags).length===0))return{id:"flags",type:"section",data:{title:"Flags:",body:ks(t.flags),indentBody:0}}}a(Us,"k");function Ks(t){const{help:e}=t;if(!e||!e.examples||e.examples.length===0)return;let{examples:u}=e;if(Array.isArray(u)&&(u=u.join(`
.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/cli.cjs:17:`)),u)return{id:"examples",type:"section",data:{title:"Examples:",body:u}}}a(Ks,"F");function Vs(t){if(!("alias"in t)||!t.alias)return;const{alias:e}=t;return{id:"aliases",type:"section",data:{title:"Aliases:",body:Array.isArray(e)?e.join(", "):e}}}a(Vs,"H");const zs=a(t=>[Ms,Gs,Ws,js,Us,Ks,Vs].map(e=>e(t)).filter(Boolean),"U"),Ys=vn.WriteStream.prototype.hasColors();class qs{static{a(this,"M")}text(e){return e}bold(e){return Ys?`\x1B[1m${e}\x1B[22m`:e.toLocaleUpperCase()}indentText({text:e,spaces:u}){return e.replace(/^/gm," ".repeat(u))}heading(e){return this.bold(e)}section({title:e,body:u,indentBody:r=2}){return`${(e?`${this.heading(e)}
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/plan.md:2:title: "Implementation Plan: Level 1 Fixture [template:level_1/plan.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/plan.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/plan.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:88:  title?: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:113:    `title: "${options.title ?? 'Healthy Phase 4 Reviewer Fixture'}"`,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:115:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:117:    'importance_tier: "important"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:149:    `importance_tier: "${options.metadataTier ?? 'important'}"`,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:299:  it('triggers CHECK-D5 MEDIUM on continuation titles without supersedes and emits M5 + M8', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:301:      title: 'Extended Deep Research Round 2',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:392:      title: 'Extended Deep Research Round 2',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:430:      ['---', 'title: "Spec: Phase 4 PR-9 Workflow Fixture"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:483:    expect(stdout).toContain('POST-SAVE QUALITY REVIEW');
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.d.ts:30:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.d.ts:62:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.d.ts:71:    title: string;
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/tasks.md:2:title: "Tasks: Level 1 Fixture [template:level_1/tasks.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/tasks.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/tasks.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-003-title-overlap.md:2:title: "Codesight Trigger Phrase Migration"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-003-title-overlap.md:3:description: "Fixture with title-derived phrases that should now be removed."
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-003-title-overlap.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-003-title-overlap.md:9:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-003-title-overlap.md:17:Used to prove title-overlap cleanup during migration.
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:46:        DESCRIPTION: 'Verified spec-title enrichment drives the rendered memory filename and heading.',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:78:    LAST_ACTION: 'Rendered a fixture memory from a spec-derived title.',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:96:    PREFLIGHT_GAPS: [{ GAP_DESCRIPTION: 'Confirm rendered title stays free of template contamination.' }],
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:113:    GAPS_CLOSED: [{ GAP_DESCRIPTION: 'Verified the rendered output title and slug are specific.' }],
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:123:    RESUME_CONTEXT: [{ CONTEXT_ITEM: 'Review the generated memory heading and metadata title.' }],
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:170:  it.skip('renders a specific filename and non-contaminated title that passes the quality gate', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:184:          'title: "Spec: Memory Generator Naming Guardrail"',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:206:            narrative: 'Verified rendered memory titles stay specific after template changes.',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:226:      const frontmatterTitle = rendered.match(/^title:\s*"([^"]+)"$/m)?.[1] ?? '';
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:241:      expect(frontmatter).toContain('trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:244:      expect(frontmatter.match(/trigger_phrases:/g)?.length ?? 0).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:245:      expect(frontmatter).toMatch(/trigger_phrases:\n  - "/);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:259:  it('falls back to the folder-base slug when prompt and spec title are contaminated or generic', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:273:          'title: "Spec: To promote a memory to constitutional tier (always surfaced)"',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:311:      const frontmatterTitle = rendered.match(/^title:\s*"([^"]+)"$/m)?.[1] ?? '';
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:343:        ['---', 'title: "Spec: Session Source Validation"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:402:        TRIGGER_PHRASES_YAML: 'trigger_phrases: []',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:433:      expect(frontmatter).toContain('trigger_phrases: []');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:435:      expect(frontmatter.match(/trigger_phrases:/g)?.length ?? 0).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:477:              title: 'Direct save render quality closure for hybrid rag',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:478:              narrative: 'Specific title should survive the direct preloaded collector path and keep the indexed save non-generic.',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:520:        ['---', 'title: "Spec: Perfect Session Capturing"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:540:              title: 'Escaped anchor example in captured prompt',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:580:          'title: "Spec: Stateless Tool Evidence Guardrail"',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:610:              title: 'Read loader state',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:617:              title: 'Run verification command',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:668:        ['---', 'title: "Spec: Git Provenance Render"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:688:              title: 'Git provenance render validation',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:736:        ['---', 'title: "Spec: No Git Context"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:756:              title: 'No git context render validation',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:805:          'title: "Spec: Decision Confidence Render"',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:829:            title: 'Choose database',
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/implementation-summary.md:2:title: "Implementation Summary [template:level_1/implementation-summary.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/implementation-summary.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1/implementation-summary.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-002-clean.md:2:title: "Already Clean Trigger Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-002-clean.md:3:description: "Fixture whose trigger_phrases should remain unchanged."
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-002-clean.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-002-clean.md:8:importance_tier: "important"
.opencode/skill/system-spec-kit/scripts/test-fixtures/055-template-missing-header/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/055-template-missing-header/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/055-template-missing-header/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-001-junk-residual.md:2:title: "Residual Trigger Cleanup Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-001-junk-residual.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/migration/F-MIG-001-junk-residual.md:13:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header/spec.md:2:title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header/spec.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header/spec.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.d.ts.map:1:{"version":3,"file":"title-builder.d.ts","sourceRoot":"","sources":["../../core/title-builder.ts"],"names":[],"mappings":"AAeA,wBAAgB,6BAA6B,CAAC,GAAG,EAAE,MAAM,GAAG,MAAM,CAKjE;AAED,wBAAgB,mBAAmB,CAAC,KAAK,EAAE,MAAM,EAAE,SAAS,GAAE,MAAY,GAAG,MAAM,CAUlF;AAED,wBAAgB,WAAW,CAAC,IAAI,EAAE,MAAM,GAAG,MAAM,CAOhD;AAED,wBAAgB,gBAAgB,CAAC,mBAAmB,EAAE,MAAM,EAAE,eAAe,EAAE,MAAM,EAAE,KAAK,EAAE,MAAM,EAAE,WAAW,CAAC,EAAE,MAAM,GAAG,MAAM,CAelI;AAED,wBAAgB,yBAAyB,CAAC,WAAW,EAAE,MAAM,EAAE,cAAc,EAAE,MAAM,EAAE,eAAe,EAAE,MAAM,GAAG,MAAM,CAItH;AAED,wBAAgB,gBAAgB,CAAC,cAAc,EAAE,MAAM,GAAG,MAAM,CAe/D"}
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:21:      title: 'Warm-start validation bundle remains conditional',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:53:      title: 'Consumer stays additive and compact',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:84:      title: 'Benchmark packet records real matrix evidence',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:115:      title: 'Fail closed when cached continuity no longer matches scope',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:160:      expect(scenario.wrapper.title.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:155:    const fixture = readFixture<RawInputData>('F-DUP-002a-blank-observation-titles.json');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:184:  it.skip('F002.2 deduplicates proposition restatement across outcomes, decision titles, and fallback rationale while preserving authored rationale', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:258:    const sourceText = (fixture.observations ?? [])[0]?.title ?? '';
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:148:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:149:        { segmentId: 'seg-2', findings: [{ findingId: 'f2', title: 'Bug B', severity: 'P0' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:158:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:159:        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:169:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:170:        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:180:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:181:        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:247:    it('buildFindingKey builds from file:line:title', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:248:      const key = lifecycle.buildFindingKey({ file: 'src/a.ts', line: 42, title: 'Bug Here' });
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-004b-last-clipping.json:6:      "title": "Documentation cleanup plan for duplication review alignment across resume context handling surfaces",
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:33:  const triggerIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:81:          triggerPhrases: ['014 code graph upgrades runtime', 'render quality', 'canonical sources', 'memory save'],
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:83:            { path: 'scripts/core/workflow.ts', description: 'Stopped prose bigrams from entering trigger_phrases.' },
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:92:      expect(triggerPhrases).toEqual(['014 code graph upgrades runtime', 'render quality', 'canonical sources', 'memory save']);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:17:    "title: \"Broken D7 Reviewer Fixture\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:19:    "trigger_phrases:",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:22:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:58:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js.map:1:{"version":3,"file":"title-builder.js","sourceRoot":"","sources":["../../core/title-builder.ts"],"names":[],"mappings":";AAAA,kEAAkE;AAClE,wBAAwB;AACxB,kEAAkE;AAClE,yDAAyD;AACzD,oDAAoD;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAWpD,sEAKC;AAED,kDAUC;AAED,kCAOC;AAED,4CAeC;AAED,8DAIC;AAED,4CAeC;AA3ED,gDAAkC;AAClC,gDAAkC;AAClC,oDAA0D;AAC1D,8DAAuE;AAEvE,kEAAkE;AAClE,eAAe;AACf,kEAAkE;AAElE,SAAgB,6BAA6B,CAAC,GAAW;IACvD,OAAO,GAAG;SACP,OAAO,CAAC,MAAM,EAAE,GAAG,CAAC;SACpB,IAAI,EAAE;SACN,OAAO,CAAC,aAAa,EAAE,EAAE,CAAC,CAAC;AAChC,CAAC;AAED,SAAgB,mBAAmB,CAAC,KAAa,EAAE,YAAoB,GAAG;IACxE,IAAI,KAAK,CAAC,MAAM,IAAI,SAAS,EAAE,CAAC;QAC9B,OAAO,KAAK,CAAC;IACf,CAAC;IAED,MAAM,SAAS,GAAG,KAAK,CAAC,KAAK,CAAC,CAAC,EAAE,SAAS,CAAC,CAAC,IAAI,EAAE,CAAC;IACnD,MAAM,SAAS,GAAG,SAAS,CAAC,WAAW,CAAC,GAAG,CAAC,CAAC;IAC7C,MAAM,YAAY,GAAG,SAAS,GAAG,CAAC,CAAC,CAAC,CAAC,SAAS,CAAC,KAAK,CAAC,CAAC,EAAE,SAAS,CAAC,CAAC,IAAI,EAAE,CAAC,CAAC,CAAC,SAAS,CAAC;IAEtF,OAAO,GAAG,YAAY,KAAK,CAAC;AAC9B,CAAC;AAED,SAAgB,WAAW,CAAC,IAAY;IACtC,OAAO,IAAI;SACR,OAAO,CAAC,iBAAiB,EAAE,MAAM,CAAC,CAAG,sDAAsD;SAC3F,OAAO,CAAC,IAAI,EAAE,GAAG,CAAC;SAClB,OAAO,CAAC,OAAO,EAAE,GAAG,CAAC,CAAiB,8BAA8B;SACpE,OAAO,CAAC,SAAS,EAAE,GAAG,CAAC,CAAc,8BAA8B;SACnE,OAAO,CAAC,OAAO,EAAE,CAAC,EAAE,EAAE,EAAE,CAAC,EAAE,CAAC,WAAW,EAAE,CAAC,CAAC;AAChD,CAAC;AAED,SAAgB,gBAAgB,CAAC,mBAA2B,EAAE,eAAuB,EAAE,KAAa,EAAE,WAAoB;IACxH,IAAI,WAAW,IAAI,WAAW,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;QAC1C,OAAO,mBAAmB,CAAC,WAAW,CAAC,WAAW,CAAC,CAAC,CAAC;IACvD,CAAC;IAED,+EAA+E;IAC/E,MAAM,cAAc,GAAG,IAAA,gCAAmB,EAAC,CAAC,mBAAmB,CAAC,CAAC,CAAC;IAClE,IAAI,cAAc,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;QAC9B,OAAO,mBAAmB,CAAC,6BAA6B,CAAC,cAAc,CAAC,CAAC,CAAC;IAC5E,CAAC;IAED,MAAM,UAAU,GAAG,eAAe,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,CAAC,GAAG,EAAE,IAAI,eAAe,CAAC;IACvF,MAAM,cAAc,GAAG,6BAA6B,CAAC,UAAU,CAAC,OAAO,CAAC,OAAO,EAAE,EAAE,CAAC,CAAC,OAAO,CAAC,IAAI,EAAE,GAAG,CAAC,CAAC,CAAC;IACzG,MAAM,QAAQ,GAAG,cAAc,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,CAAC,GAAG,cAAc,YAAY,KAAK,EAAE,CAAC,CAAC,CAAC,WAAW,KAAK,EAAE,CAAC;IACvG,OAAO,mBAAmB,CAAC,QAAQ,CAAC,CAAC;AACvC,CAAC;AAED,SAAgB,yBAAyB,CAAC,WAAmB,EAAE,cAAsB,EAAE,eAAuB;IAC5G,KAAK,cAAc,CAAC;IACpB,KAAK,eAAe,CAAC;IACrB,OAAO,WAAW,CAAC,IAAI,EAAE,CAAC;AAC5B,CAAC;AAED,SAAgB,gBAAgB,CAAC,cAAsB;IACrD,IAAI,CAAC;QACH,MAAM,QAAQ,GAAG,IAAI,CAAC,IAAI,CAAC,cAAc,EAAE,SAAS,CAAC,CAAC;QACtD,MAAM,OAAO,GAAG,MAAM,CAAC,YAAY,CAAC,QAAQ,EAAE,OAAO,CAAC,CAAC;QACvD,MAAM,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,0BAA0B,CAAC,CAAC;QAC1D,IAAI,CAAC,OAAO;YAAE,OAAO,EAAE,CAAC;QACxB,MAAM,UAAU,GAAG,OAAO,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,gCAAgC,CAAC,CAAC;QACtE,IAAI,CAAC,UAAU,IAAI,CAAC,UAAU,CAAC,CAAC,CAAC;YAAE,OAAO,EAAE,CAAC;QAC7C,OAAO,IAAA,6CAA2B,EAAC,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC;IACpD,CAAC;IAAC,OAAO,MAAe,EAAE,CAAC;QACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;YAC5B,KAAK,MAAM,CAAC,OAAO,CAAC;QACtB,CAAC;QACD,OAAO,EAAE,CAAC;IACZ,CAAC;AACH,CAAC"}
.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:150:  rendered = rendered.replace(/\[NAME\]/g, data.name || 'Untitled');
.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:1078:          skip(`TC-801-${level_name}: Example spec has concrete name`, 'Different title format');
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/miss/spec.md:2:title: "F-AC5 Miss Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/miss/memory/06-04-26_09-00__orphan-notes.md:2:title: "Orphan Notes"
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:10:  'title: "Claude Capture Fallback Hardening"',
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:22:  'title: "Development session"',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/ambiguity/spec.md:2:title: "F-AC5 Ambiguity Fixture"
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.d.ts:6:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.d.ts:24: * source-session match, an explicit continuation marker, or >=50% title-family
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.d.ts:25: * overlap after normalizing filename/title content words.
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:82:      title TEXT DEFAULT '',
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:90:      importance_tier TEXT DEFAULT 'normal',
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:92:      trigger_phrases TEXT DEFAULT '[]',
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:115:    title: 'Test Memory',
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:127:    INSERT INTO memory_index (file_path, spec_folder, title, embedding_status,
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:133:    row.file_path, row.spec_folder, row.title, row.embedding_status,
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:650:      title: 'Old',
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:655:      title: 'New',
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:659:    if (ordered.length === 2 && ordered[0].title === 'New') {
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:661:        `First: "${ordered[0].title}", Second: "${ordered[1].title}"`);
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:664:        `Order: ${ordered.map(r => r.title).join(', ')}`);
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:1172:    // In our mock DB, the column is trigger_phrases (snake_case), but SELECT *
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:1177:    // Since the actual DB stores trigger_phrases, and getRetryQueue does SELECT *,
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/ambiguity/memory/06-04-26_09-00__candidate-b.md:2:title: "Research Candidate B"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/ambiguity/memory/06-04-26_09-00__candidate-a.md:2:title: "Research Candidate A"
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.d.ts:32:        importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/spec.md:2:title: "F-AC5 Hit Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/memory/06-04-26_12-30__project-notes.md:2:title: "Project Notes"
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:89:const title_builder_1 = require("./title-builder");
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:482:                title: n.title ?? preloadedData.title,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:626:                    title: observation.title ? cleanContaminationText(observation.title) : observation.title,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:642:            // Phase 002 T010: Clean _JSON_SESSION_SUMMARY (raw sessionSummary title candidate)
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:805:                '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData');
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:961:        const specTitle = (0, title_builder_1.extractSpecTitle)(specFolder);
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:990:        const memoryTitle = explicitMemoryText.title
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:991:            ?? (0, title_builder_1.buildMemoryTitle)(preferredMemoryTask, specFolderName, sessionData.DATE, contentSlug);
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:992:        // Keep dashboard titles stable across duplicate-save retries so content dedup
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:994:        const memoryDashboardTitle = (0, title_builder_1.buildMemoryDashboardTitle)(memoryTitle, specFolderName, rawCtxFilename);
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:998:                title: memoryTitle,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1036:            const titleTriggerKey = normalizeTriggerComparisonKey(memoryTitle);
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1069:                        && titleTriggerKey.includes(loweredPhrase)) {
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1115:                || titleTriggerKey.includes(leafFolderAnchorKey)
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1149:                title: memoryTitle,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1401:            title: memoryTitle,
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1436:            // Non-blocking — health annotation failure must not prevent memory save
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1659:        // Step 10.5: Post-save quality review (JSON mode only)
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC5-lineage/hit/memory/06-04-26_12-05__deep-research-run-8.md:2:title: "Deep Research Run 8"
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:18:    title: 'Test observation',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:146:          title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:167:          title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:17:    "title: \"Broken D1 Reviewer Fixture\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:19:    "trigger_phrases:",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:22:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:58:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:113:      'title: "Perfect Session Capturing - Integration Testing"',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:114:      'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:154:    trigger_phrases: [
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:173:        title: 'Workflow save pipeline evidence',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:515:          title: 'First same-minute save',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:528:          title: 'Second same-minute save',
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:568:      trigger_phrases: ['integration testing', 'sufficiency'],
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:624:      trigger_phrases: ['tree thinning', 'workflow integration', 'memory sequence'],
.opencode/skill/system-spec-kit/scripts/test-fixtures/059-checklist-h1-invalid/checklist.md:2:title: "Verification Checklist: Template Fixture [template:level_2/checklist.md]"
.opencode/skill/system-spec-kit/scripts/test-fixtures/059-checklist-h1-invalid/checklist.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/test-fixtures/059-checklist-h1-invalid/checklist.md:6:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:3:  "session_summary": "Observation-title filtering fixture for Phase 6 extractor coverage.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:13:      "title": "",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:14:      "narrative": "Blank observation title should never create a generic heading.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:21:      "title": "Observation",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:22:      "narrative": "Generic placeholder titles should be suppressed before the template renders headings.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:29:      "title": "   ",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:30:      "narrative": "Whitespace-only observation titles should also be suppressed.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:37:      "title": "Real extractor signal",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:38:      "narrative": "A substantive observation title should still render normally after the generic-title filter lands.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:47:      "changes_summary": "Filter generic non-decision observation titles before rendering."
.opencode/skill/system-spec-kit/scripts/setup/README.md:2:title: "Setup Scripts"
.opencode/skill/system-spec-kit/scripts/setup/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/setup/README.md:227:.opencode/skill/system-spec-kit/scripts/spec/create.sh "<feature-title>" --level 1
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:172:  it('propagates importance_tier (snake_case) through slow path', () => {
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:175:      importance_tier: 'temporary',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:183:      observations: [{ type: 'feature', title: 'test', narrative: 'test', facts: [] }],
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:199:  it('preserves explicit title, description, and causalLinks through the slow path', () => {
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:202:      title: 'Authored slow-path title',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:210:    expect(result.title).toBe('Authored slow-path title');
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:223:  it('preserves explicit title, description, and causal_links through the fast path', () => {
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:226:      observations: [{ type: 'implementation', title: 'Existing observation', narrative: 'Existing narrative', facts: [] }],
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:228:      title: 'Authored fast-path title',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:236:    expect(result.title).toBe('Authored fast-path title');
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:263:    expect(result.observations[0].title).toBe('Fast-path observations should survive.');
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:278:      observations: [{ type: 'feature', title: 'Existing observation', narrative: 'Existing narrative', facts: [] }],
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:284:      toolCalls: [{ tool: 'Bash', title: 'npm run build' }],
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:285:      exchanges: [{ userInput: 'Can you fix the broken memory save?', assistantResponse: 'Yes.' }],
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:296:    expect(result.userPrompts.map((prompt) => prompt.prompt)).toContain('Can you fix the broken memory save?');
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:298:    expect(result.observations.some((observation) => observation.title === 'Tool: Bash' && observation.narrative === 'npm run build')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:299:    expect(result.observations.some((observation) => observation.title === 'Next Steps')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:310:        { type: 'feature', title: 'First', narrative: 'same narrative', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:311:        { type: 'feature', title: 'Second', narrative: 'same narrative', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:316:    expect(result.observations[0].title).toBe('First');
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:323:      observations: [{ type: 'feature', title: 'test', narrative: 'test', facts: [] }],
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:17:    "title: \"Healthy Phase 4 Reviewer Fixture\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:19:    "trigger_phrases:",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:22:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:54:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:2:title: "SpecKit Validation Test Fixtures"
.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC6-provenance.json:7:      "title": "JSON-mode provenance branch",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC2-degraded-fallback.json:7:      "title": "Fallback regression probe",
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:31:      title: 'Perfect Session Capturing',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:38:        'title: "Perfect Session Capturing"',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:39:        'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:97:        'title: "Perfect Session Capturing"',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:114:          title: 'Prepare media editor flow',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:138:        'title: "Generic Processing"',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:139:        'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:165:        'title: "Processing Task"',
.opencode/skill/system-spec-kit/scripts/tests/spec-affinity.vitest.ts:166:        'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:129:      title TEXT,
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:133:      importance_tier TEXT DEFAULT 'normal'
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:171:function insertMemory(db, { specFolder = 'test-spec', filePath = '/test/file.md', title = 'Test' } = {}) {
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:173:    INSERT INTO memory_index (spec_folder, file_path, title)
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:175:  `).run(specFolder, filePath, title);
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:373:    const validMemId = insertMemory(db, { title: 'Valid' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:376:    const toDeleteId = insertMemory(db, { title: 'ToDelete' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:399:    const toDeleteId = insertMemory(db, { title: 'ToDelete' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:494:      const id = insertMemory(db, { title: `Memory ${i}` });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:545:      const id = insertMemory(db, { title: `Batch ${i}` });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:592:    const mem1 = insertMemory(db, { title: 'Kept 1' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:593:    const mem2 = insertMemory(db, { title: 'Kept 2' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:626:    const kept1 = insertMemory(db, { title: 'Kept' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:627:    const kept2 = insertMemory(db, { title: 'Also Kept' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:628:    const toDelete = insertMemory(db, { title: 'ToDelete' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:764:    insertMemory(db, { title: 'Solo memory' });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:863:    db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`).run(
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:909:      const id = insertMemory(db, { title: `Valid Memory ${i}` });
.opencode/skill/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js:918:      const id = insertMemory(db, { title: `Orphan Source ${i}` });
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts:15:      'DR-014-I001-P1-001 title description rejection',
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
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:8:      title: 'Perfect Session Capturing Sufficiency Hardening',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:19:      triggerPhrases: ['perfect session capturing', 'memory sufficiency', 'memory save', 'alignment block'],
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:29:          title: 'Tool: bash validate save flow',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:51:      title: 'Perfect Session Capturing',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:75:      title: 'Perfect Session Capturing',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:94:  it('fails long content when the memory title stays generic', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:96:      title: 'Development session',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:109:          title: 'Tool: bash verify dry-run output',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:120:    expect(result.reasons).toContain('Memory title is too generic to stand alone later.');
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:127:      title: 'Perfect Session Capturing',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:147:      title: 'Memory Save Insufficiency Dry-Run Contract',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:158:          title: 'Tool: bash memory_save dry run',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:4:  "importance_tier": "important",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:9:      "description": "Managed-frontmatter rewrite now synchronizes frontmatter and MEMORY METADATA importance_tier from a single resolved value"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:24:    "Replay the fixture through generate-context.js and confirm tier parity"
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:93:          title: 'Continuation verification packet',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:96:          observations: [{ type: 'implementation', title: 'Explicit lineage', narrative: 'Keep authored supersedes.', facts: [] }],
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:114:          title: 'Continuation verification packet',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:129:  it('auto-populates a predecessor for continuation titles when there is one clear candidate', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:133:      title: 'Extended Deep Research Phase 003',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:143:  it('uses description-aware continuation fallback when the title is generic', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:147:      title: 'Implementation session',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:148:      description: 'Continuation run for the lineage fixture with a weak title.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:162:title: Regular implementation session
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:164:importance_tier: important
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:166:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:217:          title: 'Continuation Deep Research Run',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:219:          observations: [{ type: 'implementation', title: 'Continuation proof', narrative: 'This save should warn when lineage is ambiguous.', facts: [] }],
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:233:          title: 'Continuation Deep Research Run',
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:24:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:50:  assert(v5.failedRules.includes('V5'), 'V5 should fail empty trigger_phrases with >=5 tools');
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:54:      'trigger_phrases:\n  - "memory"\n  - "quality"',
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:55:      'trigger_phrases: ["memory", "quality"]'
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:58:  assert(inlineTriggerPhrases.valid === true, 'inline trigger_phrases list should count as populated');
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:71:  const clean2 = contamination.filterContamination('I needled this case in a test title.');
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:258:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:275:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:295:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:370:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:71:        { segmentId: 'seg-1', status: 'completed', findings: [{ findingId: 'f1', title: 'A', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:72:        { segmentId: 'seg-2', status: 'completed', findings: [{ findingId: 'f2', title: 'B', severity: 'P2' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:80:        { segmentId: 'seg-3', status: 'completed', findings: [{ findingId: 'f3', title: 'C', severity: 'P0' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:110:      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1', segment: 'seg-1' }];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:113:      s2.findings = [{ findingId: 'f2', title: 'Issue', severity: 'P2', segment: 'seg-2' }];
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:110:      title: 'Embedding optimization memory',
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:131:      title: 'raw markdown content',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:17:    "title: \"Broken D4 Reviewer Fixture\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:19:    "trigger_phrases:",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:22:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:58:    "importance_tier: \"normal\"",
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts:11:        title: 'Choose database',
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts:31:        title: 'Choose database',
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts:52:        title: 'Choose database',
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts:74:        title: 'Choose database',
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts:98:        title: 'Choose repair strategy',
.opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts:119:        title: 'Choose migration strategy',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:45:describe('memory save title/description overrides', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:46:  it('renders explicit title and description verbatim with no unknown-field warnings', { timeout: 60000 }, async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:47:    const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'speckit-title-override-'));
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:56:      '100-title-description-override-fixture',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:67:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:73:          title: 'Authored Memory Save Title That Must Survive',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:85:    expect(parseFrontmatterValue(rendered, 'title')).toBe('Authored Memory Save Title That Must Survive');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:90:    expect(rendered).toMatch(/## MEMORY METADATA[\s\S]*title:\s*"?Authored Memory Save Title That Must Survive"?/);
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:91:    expect(warnSpy.mock.calls.flat().join('\n')).not.toContain('Unknown field in input data: "title"');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:95:  it('keeps auto-generated title behavior when no explicit title is provided', { timeout: 60000 }, async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:96:    const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'speckit-title-fallback-'));
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:105:      '101-title-fallback-fixture',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:115:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:120:          sessionSummary: 'Implemented a fallback save path for the title builder when explicit title is absent.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:121:          description: 'Fallback description is still explicit here, but the title should be auto-generated.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:122:          triggerPhrases: ['title fallback verification'],
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:131:    const generatedTitle = parseFrontmatterValue(rendered, 'title');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:57:      'title: "Spec: Phase 6 trigger fixture"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:58:      'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:71:  const triggerIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:90:function hasWeakTitleSignal(title) {
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:91:    const tokens = buildTitleFamilyTokens(title);
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:95:    if (detectContinuationPattern(currentSession.title)) {
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:106:        && (hasWeakTitleSignal(currentSession.title) || value !== currentSession.title)
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:158:        || candidate.titleFamilyOverlap >= TITLE_FAMILY_OVERLAP_THRESHOLD;
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:178:        const title = parseFrontmatterValue(frontmatter, 'title');
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:179:        if (sessionId.length === 0 || title.length === 0) {
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:184:            title,
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:200:    if (candidate.titleFamilyOverlap !== incumbent.titleFamilyOverlap) {
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:201:        return candidate.titleFamilyOverlap > incumbent.titleFamilyOverlap ? 'better' : 'worse';
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:217: * source-session match, an explicit continuation marker, or >=50% title-family
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:218: * overlap after normalizing filename/title content words.
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:236:        return filenameTokens.length > 0 ? filenameTokens : buildTitleFamilyTokens(currentSession.title);
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:267:            titleFamilyOverlap: computeTitleFamilyOverlap(currentTitleFamilyTokens, (() => {
.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js:269:                return filenameTokens.length > 0 ? filenameTokens : buildTitleFamilyTokens(candidateHeader.title);
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:24:title: "Spec: V12 normalization fixture"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:25:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:27:  - "memory save heuristic calibration"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:45:title: "Slug form memory"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:47:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:64:title: "Prose form memory"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:66:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:73:This body talks about 026 graph and context optimization and memory save heuristic calibration
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:83:title: "Unrelated memory"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:85:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:103:title: "File path fallback memory"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:105:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:50:          title: 'Use the shared truncation helper',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:17:    "title: \"Broken D8 Reviewer Fixture\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:19:    "trigger_phrases:",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:22:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:54:    "importance_tier: \"important\"",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:13:      "title": "Adopt deterministic regression fixtures",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:21:      "title": "Keep canonical evidence snapshots",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:22:      "narrative": "Outcome bullet also repeats the decision title and should not survive beside the authored decision record.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:29:      "title": "Collect audit evidence separately",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:52:      "changes_summary": "Suppress fallback rationale when it exactly repeats the decision title."
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:3:import { truncateMemoryTitle } from '../core/title-builder';
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:33:  it('truncates memory titles at the last whole word', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:41:        content: 'Completed: Implemented deterministic outcome trimming for memory titles and key outcomes across summarizer boundary handling safely.',
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:46:      'Implemented deterministic outcome trimming for memory titles and key outcomes',
.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:52:      'Manual testing per spec phase validated deterministic trigger extraction for embeddings provider selection and memory title truncation.',
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:8:title: "Broken title
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:10:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:27:title: "Valid memory"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:29:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:48:title: "Implementation session for phase 009"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:50:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:82:title: "Feature flag graduation notes"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:84:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:105:title: "Plan for ESM module compliance"
.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts:107:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:144:        title: expect.stringMatching(/bash|workflow\.ts|sed -n/i),
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:188:      title: 'Generate-Context Pipeline Quality',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:197:        'title: "Feature Specification: Improve Stateless Mode Quality"',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:198:        'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:230:      title: 'Perfect Session Capturing',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:238:        'title: "Perfect Session Capturing"',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:239:        'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:271:      title: 'Sparse Spec Folder',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:278:        title: 'Task completion status',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:284:        title: 'DR-001 Keep alignment guard scope narrow',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:290:      expect.objectContaining({ title: 'Spec folder metadata' }),
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:308:      title: 'Absolute Path Guardrails',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:400:        title: 'feat: add workflow alignment fix',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:467:        title: 'Uncommitted add: scripts/core/workflow.ts',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:561:        title: 'docs: add target spec shell',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:578:          title: 'Adjusted workflow alignment logic',
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:584:          title: 'feat: add workflow alignment fix',
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:40:    const titleMatch = content.match(/^title:\s*"([^"]+)"$/m);
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:41:    return titleMatch?.[1]?.trim() || '';
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:48:    const titleCandidate = (0, slug_utils_1.pickBestContentName)([
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:52:    return titleCandidate.length >= 8;
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:54:function hasMeaningfulObservationTitle(title) {
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:55:    if (!title) {
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:58:    const normalized = (0, slug_utils_1.normalizeMemoryNameCandidate)(title);
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:78:    contentLength: 8, // >= 20 lines with specific title
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:107:        qualityFlags.add('missing_trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:153:        qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:155:        warnings.push('Primary memory title is generic — long output still lacks specificity');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:158:        qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:160:        warnings.push('Primary memory title is generic — medium-length output lacks specificity');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:163:        qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:165:        warnings.push('Primary memory title is generic — short output lacks specificity');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:192:    // Repeated titles usually indicate low-information duplication.
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:199:        const titles = observations
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:201:            .filter((title) => title.length > 0);
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:202:        const uniqueTitles = new Set(titles);
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:203:        const dedupRatio = titles.length > 0 ? uniqueTitles.size / titles.length : 1;
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:204:        const meaningfulTitles = titles.filter((title) => hasMeaningfulObservationTitle(title));
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:205:        const meaningfulRatio = titles.length > 0 ? meaningfulTitles.length / titles.length : 0;
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:209:            warnings.push(`High observation duplication: ${titles.length - uniqueTitles.size} duplicate titles`);
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:213:            warnings.push('Observation titles remain too generic — semantic diversity reduced');
.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js:270:        { id: 'trigger_phrases', score01: breakdown.triggerPhrases / 20, score100: breakdown.triggerPhrases, maxScore100: 20, passed: triggerPhrases.length > 0 },
.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts:121:  it('supports dynamic decision-record contracts without hardcoding a single ADR title', () => {
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:117:      trigger_phrases: ['perfect session capturing', 'render quality', 'trigger phrases'],
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:189:  it('marks CLI-derived FILES with tool provenance and titles Copilot view as Read', () => {
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:212:          title: 'Apply parity hardening to the input normalizer.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:227:        title: 'Read loaders/data-loader.ts',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:246:        title: 'Test payload',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:297:        title: 'Test payload',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:326:      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:335:        request: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:336:        learning: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:341:      title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:350:    expect(sessionData.SUMMARY).toBe('Stabilized delegated memory save runtime behavior.');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:359:        title: 'Structured payload',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:378:      title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:397:      observation.title === 'Next Steps'
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:410:    const nextStepObs = normalized.observations.filter((obs) => obs.title === 'Next Steps');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:424:      title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:438:      title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:459:  it('honors explicit importance_tier through collectSessionData for temporary memories', async () => {
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:463:      importance_tier: 'temporary',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:498:        title: 'Deployment completed',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:526:        title: 'Long action test',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:557:        { type: 'implementation', title: 'Obs 1', narrative: 'First observation', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:558:        { type: 'implementation', title: 'Obs 2', narrative: 'Second observation', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:559:        { type: 'feature', title: 'Obs 3', narrative: 'Third observation', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:560:        { type: 'bugfix', title: 'Obs 4', narrative: 'Fourth observation', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:582:      title: 'Next Steps',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:599:        { type: 'implementation', title: 'Impl 1', narrative: 'Implementation work', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:600:        { type: 'feature', title: 'Feature 1', narrative: 'Feature work', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:601:        { type: 'bugfix', title: 'Bugfix 1', narrative: 'Bug fix work', facts: [] },
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:602:        { type: 'implementation', title: 'Impl 2', narrative: 'More implementation', facts: [] },
.opencode/skill/system-spec-kit/scripts/dist/core/frontmatter-editor.js:122:        return 'trigger_phrases: []';
.opencode/skill/system-spec-kit/scripts/dist/core/frontmatter-editor.js:128:    return ['trigger_phrases:', ...escapedPhrases].join('\n');
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:3:title: "This is Phase 2 of the Test Feature"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:13:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:42:title: "Feature Specification: [NAME] [template:level_1/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:44:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/spec.md:50:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts:29:  title: string;
.opencode/skill/system-spec-kit/scripts/tests/project-phase-e2e.vitest.ts:50:    title: 'Test observation',
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js:181:    const title = (0, workflow_accessors_1.readString)(collectedData, '', 'title').trim();
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js:184:        ...(title.length > 0 ? { title } : {}),
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js:282:    const { title, content, triggerPhrases, files, observations, decisions, outcomes, nextAction, blockers, recentContext, } = params;
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js:289:        title,
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js:298:            title: typeof observation.TITLE === 'string'
.opencode/skill/system-spec-kit/scripts/dist/core/memory-metadata.js:300:                : (typeof observation.title === 'string' ? observation.title : ''),
.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:79:title: Fixture Strategy
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/plan.md:3:title: "Implementation Plan: [NAME] [template:level_1/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/README.md:2:title: "System Spec Kit Test Suite"
.opencode/skill/system-spec-kit/scripts/tests/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
.opencode/skill/system-spec-kit/scripts/tests/README.md:162:- Subfolder resolution coverage for memory save and folder matching behavior.
.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/tasks.md:3:title: "Tasks: [NAME] [template:level_1/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/002-phase-2/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:53:title: "Shipped The 014 Code Graph Upgrades Runtime Lane"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:3:title: "Feature Specification: [NAME] [template:level_2/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:177:title: "phase parent section [template:addendum/phase/phase-parent-section.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:179:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:185:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:8:    'title: "Memory Template Contract Proof"',
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:11:      'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:15:    'importance_tier: "normal"',
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:94:  it('rejects malformed trigger_phrases frontmatter shapes', () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:96:      buildValidMemory({ triggerBlock: 'trigger_phrases: "session summary"' })
.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts:100:    expect(result.violations.some((violation) => violation.code === 'invalid_trigger_phrases')).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/plan.md:3:title: "Implementation Plan: [NAME] [template:level_2/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:24:  const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:48:    if (match[1] === 'trigger_phrases') {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:83:    'F-MIG-003-title-overlap.md',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:102:  it('flags junk residuals in dry-run mode, preserves useful anchors, and rewrites only trigger_phrases in apply mode', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:132:    const overlapEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-003-title-overlap.md'));
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:134:      expect.objectContaining({ phrase: 'codesight', reason: 'title_overlap' }),
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:135:      expect.objectContaining({ phrase: 'trigger phrase migration', reason: 'title_overlap' }),
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-migration.test.ts:151:    const overlapAfter = await fsp.readFile(path.join(tempDir, 'F-MIG-003-title-overlap.md'), 'utf8');
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/checklist.md:3:title: "Verification Checklist: [NAME] [template:level_2/checklist.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/checklist.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/checklist.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js:82:        title: contextFilename.replace('.md', ''),
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js:105:    const titleMatch = content.match(/^#\s+(.+)$/m);
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js:106:    const title = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js:151:    if (!title || title.trim().length === 0) {
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js:152:        console.warn('[memory-indexer] Skipping index: empty title');
.opencode/skill/system-spec-kit/scripts/dist/core/memory-indexer.js:167:            title: title,
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:73:        { segmentId: 'seg-1', status: 'completed', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:83:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1', evidence: 'e1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:84:        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1', evidence: 'e1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:93:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2', evidence: 'e1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:94:        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0', evidence: 'e2' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:106:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'A', severity: 'P1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:107:        { segmentId: 'seg-2', findings: [{ findingId: 'f2', title: 'B', severity: 'P2' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:123:        { findingId: 'f1', title: 'Bug', severity: 'P1' },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:137:      const r1 = board.buildFindingRecord({ title: 'Bug', file: 'a.ts', line: 10 }, 'seg-1', b);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:138:      const r2 = board.buildFindingRecord({ title: 'Bug', file: 'a.ts', line: 10 }, 'seg-1', b);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:154:        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2', evidence: 'e1' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:155:        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0', evidence: 'e2' }] },
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:227:      s1.findings = [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:230:      s2.findings = [{ findingId: 'f2', title: 'Bug B', severity: 'P2' }];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:239:      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1' }];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:242:      s2.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1' }];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:251:      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P2' }];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:254:      s2.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P0' }];
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/tasks.md:3:title: "Tasks: [NAME] [template:level_2/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/test-ast-parser.js:58:    sections.some((section) => section.type === 'heading' && section.title === 'Top Heading'),
.opencode/skill/system-spec-kit/scripts/tests/test-ast-parser.js:59:    'extracts heading titles',
.opencode/skill/system-spec-kit/scripts/tests/workflow-warning.vitest.ts:103:        ['---', 'title: "Spec: Metadata Persistence Warning"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:3:title: "This is Phase 1 of the Test Feature"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:13:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:42:title: "Feature Specification: [NAME] [template:level_1/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:44:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/spec.md:50:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.d.ts:2:export declare function truncateMemoryTitle(title: string, maxLength?: number): string;
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.d.ts:7://# sourceMappingURL=title-builder.d.ts.map
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/plan.md:3:title: "Implementation Plan: [NAME] [template:level_1/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:161:    title: 'Implemented OAuth authentication',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:169:    title: 'Choose PostgreSQL over MongoDB',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:184:    title: 'Fixed memory leak in event handler',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:192:    title: 'Investigated caching strategies',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:245:    { decision: 'Redis for session cache', title: 'Caching Strategy' }
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:364:        title: 'Pending follow-up',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:401:        title: `Observation ${index + 1}`,
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:706:        title: 'Preserve enriched manual decision',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:734:        title: 'Choose database',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:763:        title: 'Use batched repair path',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:877:      { title: 'Test', narrative: 'First' },
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:878:      { title: 'Test', narrative: 'Second' },
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:879:      { title: 'Test', narrative: 'Third' }
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:887:    const obsWithNulls = [null, { title: 'Valid' }, undefined, { title: 'Also Valid' }];
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:906:      title: 'Object fact rendering',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:988:        title: 'Object fact tool activity',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1091:      { type: 'feature', title: 'OAuth Auth', narrative: 'Added OAuth' },
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1092:      { type: 'feature', title: 'OAuth Auth', narrative: 'Updated OAuth' }
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1210:        title: 'Flow Diagram',
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:1419:    const type2 = detectObservationType({ title: null, narrative: undefined });
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:18:    title?: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:33:  it('F-AC2: preserves authored raw keyDecisions and emits no lexical placeholder titles', async () => {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:43:    const titles = result.DECISIONS.map((decision) => decision.TITLE);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:47:    expect(titles).toEqual([
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:55:    expect(titles.join('\n')).not.toMatch(/(?:observation|user) decision \d+/i);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:90:    const titles = result.DECISIONS.map((decision) => decision.TITLE);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:93:    expect(titles).toEqual(
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/tasks.md:3:title: "Tasks: [NAME] [template:level_1/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/001-phase-1/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md:3:title: "Decision Record: [NAME] [template:level_3/decision-record.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:43:// 1. POST-SAVE QUALITY REVIEW
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:254:    return extractYamlListEntries(extractMemoryMetadataYaml(content), 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:297:function isGenericTitle(title) {
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:298:    const normalized = title.trim().toLowerCase().replace(/['"]/g, '');
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:468:        const savedTitle = normalizeScalarValue(frontmatter.title);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:469:        const savedTriggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:471:        const savedTier = normalizeScalarValue(frontmatter.importance_tier);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:472:        const metadataTier = normalizeScalarValue(memoryMetadata.importance_tier);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:476:        const metadataHasTriggerPhrases = /(^|\n)trigger_phrases:\s*/m.test(memoryMetadataYaml);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:489:        const explicitTier = normalizeScalarValue(collectedData.importanceTier || collectedData.importance_tier);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:501:                field: 'title',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:503:                fix: `Edit frontmatter title to: "${payloadSummary.substring(0, 80)}"`,
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:513:                    field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:524:                    field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:526:                    fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:534:                field: 'importance_tier',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:569:                fix: 'Suppress blank-title observation headings before the template renders them',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:589:                message: `decision proposition is repeated across outcomes, title, and rationale: ${JSON.stringify(duplicatedDecisionPropositions.slice(0, 3))}`,
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:590:                fix: 'Deduplicate repeated decision propositions across Key Outcomes, decision titles, and fallback rationale',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:628:                field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:629:                message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:630:                fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:717:                field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:718:                message: `trigger_phrases contains unsanitized junk (${details})`,
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:727:                field: 'importance_tier',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:729:                fix: 'Render both importance_tier locations from the same resolved value',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:759:                    field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:761:                    fix: 'Deduplicate trigger_phrases before the saved frontmatter is rendered',
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:880:        console.log(`\nPOST-SAVE QUALITY REVIEW -- SKIPPED (${result.skipReason})\n`);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:885:        console.log(`\nPOST-SAVE QUALITY REVIEW -- REVIEWER ERROR (${result.reviewerError || 'unknown reviewer error'})\n`);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:890:        console.log('\nPOST-SAVE QUALITY REVIEW -- PASSED (0 issues)\n');
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:897:        console.log(`\nPOST-SAVE QUALITY REVIEW -- REJECTED (${result.blockerReason})\n`);
.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:900:        console.log(`\nPOST-SAVE QUALITY REVIEW -- ${result.issues.length} issues found\n`);
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:933:    const dec = createDecisionData({ title: 'Test Decision' });
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:996:      observations: [{ title: 'OAuth implementation', narrative: 'Added authentication' }]
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1202:    const bugObs = { type: 'observation', title: 'Fixed authentication bug', narrative: 'Error was caused by...' };
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1211:    const featureObs = { type: 'observation', title: 'Implemented new feature', narrative: 'Added OAuth support' };
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1220:    const explicitObs = { type: 'decision', title: 'Any title' };
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1249:    const observations = [{ title: 'Test observation', narrative: 'Test narrative' }];
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1285:        { title: 'Test observation', timestamp: '2024-01-15T10:00:01Z', facts: [] }
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1584:    const obsWithTopic = [{ type: 'implementation', title: 'Implemented user profile system' }];
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1598:      { type: 'feature', title: 'Created authentication module', narrative: 'Handles user login.' },
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1599:      { type: 'implementation', title: 'Built API endpoints', narrative: 'REST API for user data.' }
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1609:    const noImplObs = [{ type: 'observation', title: 'Reviewed code' }];
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1654:    const patternObs = [{ title: 'Added validation', narrative: 'Input validation for user data' }];
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1834:      observations: [{ title: 'Updated file' }],
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2471:    // Test 2: extract_trigger_phrases is also exported (snake_case alias)
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2472:    assertType(triggerModule.extractTriggerPhrases, 'function', 'T-037b: extract_trigger_phrases is exported');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2605:      observations: [{ title: 'OAuth handler created' }]
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2617:        { title: 'Authentication implementation', narrative: 'Added JWT token support' }
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2727:        { title: 'Flow diagram', narrative: 'Test' }
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2767:      pass('T-041b: generateDecisionTree handles legacy format', 'Has title and box chars');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2788:      pass('T-041c: generateDecisionTree handles object format', 'Has title and DECISION');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:3002:      { id: 1, title: 'Test', specFolder: '042-test', importanceTier: 'normal', createdAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:3003:      { id: 2, title: 'Constitutional', specFolder: '001-core', importanceTier: 'constitutional', createdAt: new Date().toISOString() }
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:3:title: "Feature Specification: [NAME] [template:level_3/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:225:title: "phase parent section [template:addendum/phase/phase-parent-section.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:227:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:233:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:5:// Memory title construction and normalization utilities.
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:60:function truncateMemoryTitle(title, maxLength = 110) {
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:61:    if (title.length <= maxLength) {
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:62:        return title;
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:64:    const truncated = title.slice(0, maxLength).trim();
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:103:        const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:104:        if (!titleMatch || !titleMatch[1])
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:106:        return (0, task_enrichment_1.normalizeSpecTitleForMemory)(titleMatch[1]);
.opencode/skill/system-spec-kit/scripts/dist/core/title-builder.js:115://# sourceMappingURL=title-builder.js.map
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:31:  const startIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:61:  it('writes a fresh memory save that satisfies the wrapper render contract', { timeout: 60000 }, async () => {
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:80:      triggerPhrases: ['canonical sources', 'render quality', 'memory save'],
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:110:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:134:    expect(parseTriggerPhrases(frontmatter)).toEqual(['canonical sources', 'render quality', 'memory save']);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/plan.md:3:title: "Implementation Plan: [NAME] [template:level_3/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:227:        const hasTitle = frontmatter.includes('title:');
.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:231:          pass('T-FC-002: five_checks.md has valid frontmatter', 'title and description found');
.opencode/skill/system-spec-kit/scripts/tests/test-five-checks.js:233:          fail('T-FC-002: five_checks.md has valid frontmatter', `title:${hasTitle}, description:${hasDescription}`);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:61:      'title: "Spec: Phase 3 PR-5 Fixture"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:62:      'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:76:  const triggerIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/checklist.md:3:title: "Verification Checklist: [NAME] [template:level_3/checklist.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/checklist.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/checklist.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:140:function hasSessionContinuity(sections: Array<{ title: string }>): boolean {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:141:  return sections.some((section) => section.title === 'Session Continuity');
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/tasks.md:3:title: "Tasks: [NAME] [template:level_3/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/core/file-writer.js:53:        .replace(/^(title:\s*".*?) \[[^"\]]+\]"$/gm, '$1"')
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:256:      title: 'Test Memory',
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:260:      importance_tier: 'normal',
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:305:describe('memory save workflow parity', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:25:        title: 'Stubbed git observation',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:173:      ['---', 'title: "Spec: Phase 2 PR-4 Provenance Fixture"', '---', '# Spec'].join('\n'),
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:58:    TRIGGER_PHRASES_YAML: 'trigger_phrases:\n  - "phase 6 template fixture"\n  - "memory duplication reduction"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:180:    'title: "Phase 6 mirror drift fixture"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:182:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:184:    'importance_tier: "important"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:194:    'importance_tier: "important"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:196:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:243:    'title: "Phase 6 DUP review fixture"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:245:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:247:    'importance_tier: "important"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:308:    'importance_tier: "important"',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:310:    'trigger_phrases:',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:424:      field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:452:      { fixture: 'F-CHECK-DUP5-trigger.json', checkId: 'DUP5', severity: 'HIGH', field: 'trigger_phrases' },
.opencode/skill/system-spec-kit/scripts/dist/core/topic-extractor.js:25:        const title = decision.TITLE || '';
.opencode/skill/system-spec-kit/scripts/dist/core/topic-extractor.js:27:        if (title && !title.includes(SIMULATION_MARKER)) {
.opencode/skill/system-spec-kit/scripts/dist/core/topic-extractor.js:28:            weightedSegments.push(title, title);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:3:title: "This is Phase 3 of the Complex Feature"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:13:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:42:title: "Feature Specification: [NAME] [template:level_1/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:44:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/spec.md:50:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:69:      title: 'Extended Deep Research Phase 003',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:83:      title: 'Continuation Deep Research Run',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:96:      title: 'Continuation Deep Research Run',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:140:              title: 'Lineage continuation proof',
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/plan.md:3:title: "Implementation Plan: [NAME] [template:level_1/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:55:title: "Planning Save"
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:67:title: "Review Save"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/tasks.md:3:title: "Tasks: [NAME] [template:level_1/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/003-verify/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:22:        { path: 'scripts/core/title-builder.ts', description: 'Removed filename suffix output.' },
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:3:title: "This is Phase 1 of the Complex Feature"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:13:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:42:title: "Feature Specification: [NAME] [template:level_1/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:44:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/spec.md:50:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/plan.md:3:title: "Implementation Plan: [NAME] [template:level_1/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/dist/types/session-types.d.ts:45:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/types/session-types.d.ts:109:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/types/session-types.d.ts:147:    importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/dist/types/session-types.d.ts:254:export type QualityFlag = 'has_contamination' | 'has_insufficient_context' | 'missing_trigger_phrases' | 'missing_key_topics' | 'missing_file_context' | 'generic_title' | 'short_content' | 'leaked_html' | 'duplicate_observations' | 'has_placeholders' | 'has_fallback_decision' | 'sparse_semantic_fields' | 'has_tool_state_mismatch' | 'has_session_source_mismatch' | 'has_spec_relevance_mismatch' | 'has_contaminated_title' | 'has_error_content' | 'insufficient_capture' | 'has_malformed_spec_folder' | 'has_topical_mismatch';
.opencode/skill/system-spec-kit/scripts/dist/types/session-types.d.ts:486:    /** RC1: Raw sessionSummary from JSON payload, used as preferred title candidate */
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/tasks.md:3:title: "Tasks: [NAME] [template:level_1/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/001-design/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:3:title: "This is Phase 2 of the Complex Feature"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:13:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:42:title: "Feature Specification: [NAME] [template:level_1/spec.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:44:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/spec.md:50:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/decision-record.md:2:title: "Decision Record: Post-Save Render Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/plan.md:3:title: "Implementation Plan: [NAME] [template:level_1/plan.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/plan.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/plan.md:11:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/spec.md:2:title: "Feature Specification: Post-Save Render Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/tasks.md:3:title: "Tasks: [NAME] [template:level_1/tasks.md]"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/tasks.md:5:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/002-build/tasks.md:10:importance_tier: "normal"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/plan.md:2:title: "Implementation Plan: Post-Save Render Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/plan.md:7:1. Generate a real memory save.
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/tasks.md:2:title: "Task List: Post-Save Render Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/implementation-summary.md:2:title: "Implementation Summary: Post-Save Render Fixture"
.opencode/skill/system-spec-kit/scripts/tests/fixtures/post-save-render/test-packet/implementation-summary.md:7:This fixture exists to verify canonical source auto-discovery during memory saves.
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/@vitest/expect/node_modules/chai/README.md:2:  <a href="http://chaijs.com" title="Chai Documentation">
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:149:        SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier, m.document_type,
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:161:                    title: r.title || '',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:164:                    importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:183:        SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier, m.document_type,
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:196:                    title: r.title || '',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:199:                    importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:217:        SELECT id, title, spec_folder, file_path, importance_tier, document_type
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:226:                    title: r.title || '',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:229:                    importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:272:        SELECT id, title, spec_folder, file_path, importance_tier, document_type
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:277:        ORDER BY importance_tier = 'critical' DESC,
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:278:                 importance_tier = 'important' DESC,
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:286:                    title: r.title || '',
.opencode/skill/system-spec-kit/scripts/dist/evals/map-ground-truth-ids.js:289:                    importanceTier: r.importance_tier || 'normal',
.opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js:88:      title TEXT,
.opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js:89:      importance_tier TEXT,
.opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js:90:      trigger_phrases TEXT,
.opencode/skill/system-spec-kit/scripts/dist/evals/run-performance-benchmarks.js:122:    INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/expect-type/README.md:557:function greetFormal(this: {title: string; name: string}, message: string) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/expect-type/README.md:558:  return `Dear ${this.title} ${this.name}, here's your message: ${message}`
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:6:// historical memory trigger_phrases using the live sanitizer plus bounded
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:24:type RemovalReason = 'empty_or_invalid' | 'sanitizer' | 'canonical_duplicate' | 'title_overlap';
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:42:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:84:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:104:  --apply              Rewrite trigger_phrases in-place with atomic writes
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:164:function canonicalizeTitleKey(title: string): string {
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:165:  return canonicalizePhraseKey(title).replace(/\b\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:386:  const range = locateFrontmatterSectionRange(detection.rawBlock, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:391:  const replacementLines = buildYamlArraySection('trigger_phrases', nextTriggers);
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:407:  const titleSection = detection.sections.find((section) => section.key === 'title');
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:408:  const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:409:  const titleValue = titleSection ? parseSectionValue(titleSection) : undefined;
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:411:  const title = typeof titleValue === 'string' ? titleValue : '';
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:417:    title,
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:423:function resolveTriggerPhrases(triggerPhrases: string[], title: string): TriggerResolution {
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:424:  const titleKey = canonicalizeTitleKey(title);
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:462:    const titleOverlap = titleKey.length > 0
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:464:      && new RegExp(`(?:^| )${escapeRegex(canonicalKey)}(?:$| )`, 'i').test(titleKey);
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:465:    if (titleOverlap) {
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:468:        reason: 'title_overlap',
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:517:    title_overlap: 0,
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:524:      const resolution = resolveTriggerPhrases(parsed.triggerPhrases, parsed.title);
.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:541:        title: parsed.title,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts:13:  title: string | null;
.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts:39:      title: block.type === 'heading' ? extractHeadingTitle(block.content) : null,
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/alignment-validator.js:262:            if (obs.title) {
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/alignment-validator.js:263:                const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/alignment-validator.js:275:        if (obs.title) {
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/alignment-validator.js:276:            const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/alignment-validator.js:277:            titleWords.forEach((w) => keywords.add(w.toLowerCase()));
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:6://   2. Convert slug to title case
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:7://   3. Replace existing H1 (or insert one if missing) with the title-cased slug
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:54:  const title = slugToTitle(slug);
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:71:  const newBody = `\n\n# ${title}\n\n${body}`;
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:83:  return { path: filePath, status: 'fixed', title };
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:99:    console.log(`  FIXED: ${path.relative(SPECS_ROOT, result.path)} → # ${result.title}`);
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.d.ts:27:    title: string;
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:78:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:472:function detectContinuationPattern(title: string): string | null {
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:474:    if (candidate.pattern.test(title)) {
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:484:  const title = normalizeScalarValue(frontmatter.title);
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:485:  const triggers = parseFrontmatterArray(content, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:494:    title,
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:536:    continuationPattern: detectContinuationPattern(parsed.title),
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:564:  const frontmatterTier = normalizeScalarValue(frontmatter.importance_tier);
.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:565:  const metadataTier = normalizeScalarValue(metadata.importance_tier);
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:39:  title?: string;
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:52:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:67:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:87:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:162:    title: m.title ?? 'Untitled',
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:191:      title: m.title,
.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts:246:      title: m.title,
.opencode/skill/system-spec-kit/scripts/memory/README.md:2:title: "Memory Scripts"
.opencode/skill/system-spec-kit/scripts/memory/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/scripts/memory/README.md:96:- Writes `MEMORY_DASHBOARD_TITLE` into context template frontmatter so dashboard titles stay disambiguated.
.opencode/skill/system-spec-kit/scripts/memory/README.md:98:- Retroactive title refresh for existing memories: run `memory_index_scan({ force: true })` after parser/template updates.
.opencode/skill/system-spec-kit/scripts/memory/README.md:107:- `title`
.opencode/skill/system-spec-kit/scripts/memory/README.md:109:- `trigger_phrases`
.opencode/skill/system-spec-kit/scripts/memory/README.md:110:- `importance_tier`
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js:1012:            console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:37:  title: string;
.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts:556:          title: result.managed.title,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:87:  const titleMatch = content.match(/^title:\s*"([^"]+)"$/m);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:88:  return titleMatch?.[1]?.trim() || '';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:97:  const titleCandidate = pickBestContentName([
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:102:  return titleCandidate.length >= 8;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:105:function hasMeaningfulObservationTitle(title?: string): boolean {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:106:  if (!title) {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:110:  const normalized = normalizeMemoryNameCandidate(title);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:132:  contentLength: 8,      // >= 20 lines with specific title
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:169:    qualityFlags.add('missing_trigger_phrases');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:211:    qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:213:    warnings.push('Primary memory title is generic — long output still lacks specificity');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:215:    qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:217:    warnings.push('Primary memory title is generic — medium-length output lacks specificity');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:219:    qualityFlags.add('generic_title');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:221:    warnings.push('Primary memory title is generic — short output lacks specificity');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:247:  // Repeated titles usually indicate low-information duplication.
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:253:    const titles = observations
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:255:      .filter((title) => title.length > 0);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:256:    const uniqueTitles = new Set(titles);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:257:    const dedupRatio = titles.length > 0 ? uniqueTitles.size / titles.length : 1;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:258:    const meaningfulTitles = titles.filter((title) => hasMeaningfulObservationTitle(title));
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:259:    const meaningfulRatio = titles.length > 0 ? meaningfulTitles.length / titles.length : 0;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:263:      warnings.push(`High observation duplication: ${titles.length - uniqueTitles.size} duplicate titles`);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:267:      warnings.push('Observation titles remain too generic — semantic diversity reduced');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:331:    { id: 'trigger_phrases', score01: breakdown.triggerPhrases / 20, score100: breakdown.triggerPhrases, maxScore100: 20, passed: triggerPhrases.length > 0 },
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:8:      "name": "generate-context",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:9:      "path": "scripts/dist/memory/generate-context.js",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:458:      "memory": ["generate-context", "cleanup-orphaned-vectors", "test-embeddings-factory"],
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:51:  title?: string;
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:264:  title?: string;
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:267:  const title = readString(collectedData, '', 'title').trim();
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:271:    ...(title.length > 0 ? { title } : {}),
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:390:  title: string;
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:402:    title,
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:421:    title,
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:430:      title: typeof observation.TITLE === 'string'
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:432:        : (typeof observation.title === 'string' ? observation.title : ''),
.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:98:    return 'trigger_phrases: []';
.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:106:  return ['trigger_phrases:', ...escapedPhrases].join('\n');
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js:557:        title: mode === 'root'
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js:577:        TITLE: data.title,
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:23:  title: string;
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:40:  title: string;
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:48:  titleFamilyOverlap: number;
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:91:function hasWeakTitleSignal(title: string): boolean {
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:92:  const tokens = buildTitleFamilyTokens(title);
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:97:  if (detectContinuationPattern(currentSession.title)) {
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:111:    && (hasWeakTitleSignal(currentSession.title) || value !== currentSession.title)
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:183:    || candidate.titleFamilyOverlap >= TITLE_FAMILY_OVERLAP_THRESHOLD;
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:208:    const title = parseFrontmatterValue(frontmatter, 'title');
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:209:    if (sessionId.length === 0 || title.length === 0) {
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:215:      title,
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:233:  if (candidate.titleFamilyOverlap !== incumbent.titleFamilyOverlap) {
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:234:    return candidate.titleFamilyOverlap > incumbent.titleFamilyOverlap ? 'better' : 'worse';
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:254: * source-session match, an explicit continuation marker, or >=50% title-family
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:255: * overlap after normalizing filename/title content words.
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:277:    return filenameTokens.length > 0 ? filenameTokens : buildTitleFamilyTokens(currentSession.title);
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:316:      titleFamilyOverlap: computeTitleFamilyOverlap(
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:320:          return filenameTokens.length > 0 ? filenameTokens : buildTitleFamilyTokens(candidateHeader.title);
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:4:// Memory title construction and normalization utilities.
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:23:export function truncateMemoryTitle(title: string, maxLength: number = 110): string {
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:24:  if (title.length <= maxLength) {
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:25:    return title;
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:28:  const truncated = title.slice(0, maxLength).trim();
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:73:    const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:74:    if (!titleMatch || !titleMatch[1]) return '';
.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:75:    return normalizeSpecTitleForMemory(titleMatch[1]);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:6:// 1. POST-SAVE QUALITY REVIEW
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:87:    importance_tier?: string;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:362:  return extractYamlListEntries(extractMemoryMetadataYaml(content), 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:414:function isGenericTitle(title: string): boolean {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:415:  const normalized = title.trim().toLowerCase().replace(/['"]/g, '');
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:624:    const savedTitle = normalizeScalarValue(frontmatter.title);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:625:    const savedTriggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:627:    const savedTier = normalizeScalarValue(frontmatter.importance_tier);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:628:    const metadataTier = normalizeScalarValue(memoryMetadata.importance_tier);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:632:    const metadataHasTriggerPhrases = /(^|\n)trigger_phrases:\s*/m.test(memoryMetadataYaml);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:645:    const explicitTier = normalizeScalarValue(collectedData.importanceTier || collectedData.importance_tier);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:658:        field: 'title',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:660:        fix: `Edit frontmatter title to: "${payloadSummary.substring(0, 80)}"`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:673:          field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:687:          field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:689:          fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:698:        field: 'importance_tier',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:739:        fix: 'Suppress blank-title observation headings before the template renders them',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:768:        message: `decision proposition is repeated across outcomes, title, and rationale: ${JSON.stringify(duplicatedDecisionPropositions.slice(0, 3))}`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:769:        fix: 'Deduplicate repeated decision propositions across Key Outcomes, decision titles, and fallback rationale',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:813:        field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:814:        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:815:        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:912:        field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:913:        message: `trigger_phrases contains unsanitized junk (${details})`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:923:        field: 'importance_tier',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:925:        fix: 'Render both importance_tier locations from the same resolved value',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:958:          field: 'trigger_phrases',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:960:          fix: 'Deduplicate trigger_phrases before the saved frontmatter is rendered',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1096:    console.log(`\nPOST-SAVE QUALITY REVIEW -- SKIPPED (${result.skipReason})\n`);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1102:    console.log(`\nPOST-SAVE QUALITY REVIEW -- REVIEWER ERROR (${result.reviewerError || 'unknown reviewer error'})\n`);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1108:    console.log('\nPOST-SAVE QUALITY REVIEW -- PASSED (0 issues)\n');
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1117:    console.log(`\nPOST-SAVE QUALITY REVIEW -- REJECTED (${result.blockerReason})\n`);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1119:    console.log(`\nPOST-SAVE QUALITY REVIEW -- ${result.issues.length} issues found\n`);
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:21:    .replace(/^(title:\s*".*?) \[[^"\]]+\]"$/gm, '$1"')
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:38:    const title = decision.TITLE || '';
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:41:    if (title && !title.includes(SIMULATION_MARKER)) {
.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:42:      weightedSegments.push(title, title);
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:75:      title: contextFilename.replace('.md', ''),
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:101:  const titleMatch = content.match(/^#\s+(.+)$/m);
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:102:  const title: string = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:149:  if (!title || title.trim().length === 0) {
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:150:    console.warn('[memory-indexer] Skipping index: empty title');
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:166:      title: title,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:97:} from './title-builder';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:670:        title: n.title ?? preloadedData.title,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:830:          title: observation.title ? cleanContaminationText(observation.title) : observation.title,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:849:      // Phase 002 T010: Clean _JSON_SESSION_SUMMARY (raw sessionSummary title candidate)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1253:  const memoryTitle = explicitMemoryText.title
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1255:  // Keep dashboard titles stable across duplicate-save retries so content dedup
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1261:      title: memoryTitle,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1297:    const titleTriggerKey = normalizeTriggerComparisonKey(memoryTitle);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1333:          && titleTriggerKey.includes(loweredPhrase)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382:      || titleTriggerKey.includes(leafFolderAnchorKey)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1423:      title: memoryTitle,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1676:    title: memoryTitle,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1711:    // Non-blocking — health annotation failure must not prevent memory save
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1953:  // Step 10.5: Post-save quality review (JSON mode only)
.opencode/skill/system-spec-kit/scripts/core/README.md:2:title: "Core System Scripts"
.opencode/skill/system-spec-kit/scripts/core/README.md:4:trigger_phrases:
.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/scripts/core/README.md:41:- `post-save-review.ts` - Post-save quality review — compares saved frontmatter against JSON payload, emits machine-readable severity-graded findings (Step 10.5)
.opencode/skill/system-spec-kit/scripts/core/README.md:45:- `title-builder.ts` - memory title construction, normalization, and dashboard suffix helpers
.opencode/skill/system-spec-kit/scripts/core/README.md:74:- `subfolder-utils.ts` supports subfolder-aware operations used by memory save flows.
.opencode/skill/system-spec-kit/scripts/core/README.md:77:- `workflow.ts` updates per-folder `description.json` after each memory save (increments `memorySequence`, appends to `memoryNameHistory`). This tracking is best-effort — failures are non-fatal.
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:349:			title: provider,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:378:			title: "vanilla",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:383:			title: "vue",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:388:			title: "svelte",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:393:			title: "react",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:398:			title: "lit",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:403:			title: "preact",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:408:			title: "solid",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:413:			title: "marko",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:418:			title: "qwik",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:452:		title: "TypeScript",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:456:		title: "JavaScript",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/creator.DgVhQm5q.js:617:			title: browser,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.CEzQDJGb.js:194:			let title = `\n ${getStateSymbol(testTask.task)} ${formatProjectName(testTask.project)}${getFullName(testTask.task, separator)}`;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.CEzQDJGb.js:195:			if (duration != null && duration > this.ctx.config.slowTestThreshold) title += c.yellow(` ${Math.round(duration)}${c.dim("ms")}`);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.CEzQDJGb.js:196:			this.log(title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2182:		let title = this.getStateSymbol(entity);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2183:		if (entity.project.name) title += ` ${formatProjectName(entity.project, "")}`;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2184:		if (entity.meta().typecheck) title += ` ${c.bgBlue(c.bold(" TS "))}`;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2185:		return title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2287:			const title = index === 0 ? "Snapshots" : "";
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2288:			this.log(`${padSummaryTitle(title)} ${snapshot}`);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2408:		let title = "";
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2409:		if (pathDisplay.length > slicedPath.length) title += "...";
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2410:		if (nested) title = ` ${F_DOWN_RIGHT} ${title}`;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2411:		title += slicedPath;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:2412:		return color(title.padEnd(50));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3484:				...type && { title: type }
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3497:			title: "Unhandled error",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3505:				const title = getFullName(task, " > ");
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3508:					title: project.name ? `[${project.name}] ${title}` : title,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3515:		for (const { project, title, error, file } of projectErrors) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3526:					title,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:3772:					title: t.name,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4173:		let title = ` ${this.getEntityPrefix(test)} `;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4174:		title += test.module.task.name;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4175:		if (test.location) title += c.dim(`:${test.location.line}:${test.location.column}`);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4176:		title += separator;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4177:		title += getTestName(test.task, separator);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4178:		title += this.getTestCaseSuffix(test);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.DXMFO5MJ.js:4179:		this.log(title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/reporters.d.DVUYHHhe.d.ts:2219:	title: string;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/reporters.d.DVUYHHhe.d.ts:2741:	* Be careful when using, it as some options may crash worker, e.g. --prof, --title. See https://github.com/nodejs/node/issues/41103
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/reporters.d.DVUYHHhe.d.ts:3153:	* By default, Vitest automatically intercepts console logging during tests for extra formatting of test file, test title, etc...
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:338:      title: "Usage",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:345:        title: "Commands",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:351:        title: `For more info, run any command with the \`--help\` flag`,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:362:        title: "Options",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:370:        title: "Examples",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:383:      return section.title ? `${section.title}:
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:2197:		const helpSection = info.find((current) => current.title?.startsWith("For more info, run any command"));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/cac.CWGDZnXT.js:2199:		const options = info.find((current) => current.title === "Options");
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/cli.js:311:			title: "Usage",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/cli.js:317:				title: "Commands",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/cli.js:322:				title: `For more info, run any command with the \`--help\` flag`,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/cli.js:331:				title: "Options",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/cli.js:338:			title: "Examples",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/cli.js:346:			return section.title ? `${section.title}:\n${section.body}` : section.body;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:945:	        title: ch,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:949:	        title: ch && (ch.title || ch.value || ch),
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:1050:	    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)].join(' '); // Print choices
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:1056:	        let title,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:1070:	          title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:1073:	          title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:1079:	            if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:1088:	        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2167:	        title: ch,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2171:	        title: ch && (ch.title || ch.value || ch),
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2318:	    let title, desc;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2321:	      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2323:	      title = cursor === i ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2328:	        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2337:	    return prefix + title + color.gray(desc || '');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2379:	      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2440:	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2442:	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2445:	  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2453:	 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2499:	      title: this._fb
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2502:	      title: this.i18n.noMatches
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2521:	        title: getTitle(arr, i),
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2665:	    let title = hovered ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2671:	      if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2679:	    return prefix + ' ' + title + color.gray(desc || '');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2691:	    this.outputText = [style.symbol(this.done, this.aborted, this.exited), color.bold(this.msg), style.delimiter(this.completing), this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(' ');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2695:	      this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2801:	        if (typeof v.title === 'string') {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2802:	          if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2874:	    let title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2875:	    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);else title = cursor === i ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2876:	    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:2881:	      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:3195:		 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:3209:		 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:3242:		const byTitle = (input, choices) => Promise.resolve(choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:3246:		 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:3247:		 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4050:	        ch = {title: ch, value: idx};
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4052:	        title: ch && (ch.title || ch.value || ch),
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4155:	      this.done ? this.selection.title : this.selection.disabled
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4163:	        let title, prefix, desc = '', v = this.choices[i];
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4175:	          title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4178:	          title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4182:	            if (prefix.length + title.length + desc.length >= this.out.columns
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:4189:	        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5174:	        ch = {title: ch, value: idx};
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5176:	        title: ch && (ch.title || ch.value || ch),
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5321:	    let title, desc;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5324:	      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5326:	      title = cursor === i ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5329:	        if (prefix.length + title.length + desc.length >= this.out.columns
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5336:	    return prefix + title + color.gray(desc || '');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5374:	        .map(v => v.title)
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5425:	const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5426:	const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5428:	  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5437:	 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5483:	      choice = { title: this._fb };
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5484:	    return choice || this._fb || { title: this.i18n.noMatches };
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5501:	      .map((s, i, arr) => ({ title: getTitle(arr, i), value: getVal(arr, i), description: s.description }));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5637:	    let title = hovered ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5641:	      if (prefix.length + title.length + desc.length >= this.out.columns
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5646:	    return prefix + ' ' + title + color.gray(desc || '');
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5662:	        ? this.suggestions[this.select].title
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5674:	      this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5768:	          if (typeof v.title === 'string') {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5769:	            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5836:	    let title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5837:	    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5838:	    else title = cursor === i ? color.cyan().underline(v.title) : v.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5839:	    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:5846:	        .map(v => v.title)
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:6153:		 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:6166:		 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:6194:		  choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase())
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:6200:		 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/dist/chunks/index.og1WyBLx.js:6201:		 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/dist.js:843:	TAG_NAMES["TITLE"] = "title";
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/dist.js:4015:	["xlink:title", {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/dist.js:4017:		name: "title",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:5109:            <title>Error</title>
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:5801:		return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>" + escapeHtml(message).replace(NEWLINE_REGEXP, "<br>").replace(DOUBLE_SPACE_REGEXP, " &nbsp;") + "</pre>\n</body>\n</html>\n";
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:11602:const titleize = (string) => string.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (x) => x.toUpperCase());
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:11619:			name: titleize(id.replace(/.desktop$/, "").replace("-", " ")),
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/dist/node/chunks/node.js:22663:	"title",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:314:			title: "Usage",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:320:				title: "Commands",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:325:				title: `For more info, run any command with the \`--help\` flag`,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:334:				title: "Options",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:341:			title: "Examples",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:349:			return section.title ? `${section.title}:\n${section.body}` : section.body;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1085:		title: "Bundle with a config file `rolldown.config.mjs`",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1089:		title: "Bundle the `src/main.ts` to `dist` with `cjs` format",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1093:		title: "Bundle the `src/main.ts` and handle the `.png` assets to Data URL",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1097:		title: "Bundle the `src/main.tsx` and minify the output with sourcemap",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1101:		title: "Create self-executing IIFE using external jQuery as `$` and `_`",
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1133:	examples.forEach(({ title, command }, ord) => {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/cli.mjs:1134:		lines.push(`  ${ord + 1}. ${title}:`);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/postcss/node_modules/source-map-js/package.json:60:    "toc": "doctoc --title '## Table of Contents' README.md && doctoc --title '## Table of Contents' CONTRIBUTING.md"
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2428:			logObj.title && logObj.title,
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2610:	const width = Math.max(...textLines.map((line) => stripAnsi$1(line).length), opts.title ? stripAnsi$1(opts.title).length : 0) + paddingOffset;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2614:	if (opts.title) {
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2615:		const title = _color ? _color(opts.title) : opts.title;
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2616:		const left = borderStyle.h.repeat(Math.floor((width - stripAnsi$1(opts.title).length) / 2));
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2617:		const right = borderStyle.h.repeat(width - stripAnsi$1(opts.title).length - stripAnsi$1(left).length + paddingOffset);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2618:		boxLines.push(`${leftSpace}${borderStyle.tl}${left}${title}${right}${borderStyle.tr}`);
.opencode/skill/system-spec-kit/scripts/node_modules/vitest/node_modules/vite/node_modules/rolldown/dist/shared/rolldown-build-CPrIX9V6.mjs:2898:			title: logObj.title ? characterFormat(logObj.title) : void 0,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '540,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   711	| `deleteAfter` | string | ISO date for automatic deletion |
   712	| `sessionId` | string | Session attribution |
   713	| `tenantId` | string | Governance: tenant scope |
   714	| `userId` | string | Governance: user attribution |
   715	| `agentId` | string | Governance: agent attribution |
   716	| `sharedSpaceId` | string | Governance: shared-space target |
   717	| `provenanceSource` | string | Audit source label |
   718	| `provenanceActor` | string | Audit actor label |
   719	| `governedAt` | string | ISO timestamp for governed ingest audit |
   720	
   721	```json
   722	{
   723	  "tool": "memory_save",
   724	  "arguments": {
   725	    "filePath": "/absolute/path/to/memory-file.md",
   726	    "dryRun": true
   727	  }
   728	}
   729	```
   730	
   731	---
   732	
   733	#### L3: Discovery (4 tools)
   734	
   735	##### `memory_list`
   736	
   737	Browse what is stored. Like opening a filing cabinet and looking at the folder labels. Use this to discover what is in the index and find IDs for delete or update operations.
   738	
   739	| Parameter | Type | Notes |
   740	|-----------|------|-------|
   741	| `limit` | number | Max 100 per page |
   742	| `offset` | number | Pagination offset |
   743	| `specFolder` | string | Scope to a folder |
   744	| `sortBy` | string | `created_at`, `updated_at` or `importance_weight` |
   745	| `includeChunks` | boolean | Include chunk-level detail |
   746	
   747	---
   748	
   749	##### `memory_stats`
   750	
   751	Get the big picture. How many memories are stored, when they were last updated, which folders have the most content and how the importance tiers are distributed. Think of it like a dashboard for your knowledge base.
   752	
   753	| Parameter | Type | Notes |
   754	|-----------|------|-------|
   755	| `folderRanking` | string | `count`, `recency`, `importance` or `composite` |
   756	| `excludePatterns` | string[] | Glob patterns to exclude |
   757	| `includeScores` | boolean | Include composite quality scores |
   758	| `includeArchived` | boolean | Include ARCHIVED state memories in counts |
   759	| `limit` | number | Max folders to return |
   760	
   761	---
   762	
   763	##### `memory_health`
   764	
   765	Run a health check. This is the diagnostic tool for when search quality degrades or something feels off. It checks for stale indexes, divergent aliases, broken embeddings and other issues. It can also attempt automatic repairs.
   766	
   767	| Parameter | Type | Notes |
   768	|-----------|------|-------|
   769	| `reportMode` | string | `full` (default) or `divergent_aliases` |
   770	| `limit` | number | Max items to report |
   771	| `specFolder` | string | Scope to a folder |
   772	| `autoRepair` | boolean | Attempt automatic repairs |
   773	| `confirmed` | boolean | Confirm destructive repair operations |
   774	
   775	---
   776	
   777	##### `session_health`
   778	
   779	Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.
   780	
   781	| Parameter | Type | Notes |
   782	|-----------|------|-------|
   783	| _(none required)_ |  | Returns health status with hints |
   784	
   785	---
   786	
   787	#### L4: Mutation (4 tools)
   788	
   789	##### `memory_delete`
   790	
   791	Remove a memory by ID, or clear an entire folder at once. Before a big deletion, the system can take a snapshot so you can undo it. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes.
   792	
   793	| Parameter | Type | Notes |
   794	|-----------|------|-------|
   795	| `id` | number | Memory ID to delete (use OR with specFolder) |
   796	| `specFolder` | string | Delete all memories in folder (requires `confirm: true`) |
   797	| `confirm` | boolean | **Required when using specFolder** |
   798	
   799	---
   800	
   801	##### `memory_update`
   802	
   803	Change a memory's title, keywords or importance without deleting and re-creating it. When you change the title, the search index updates automatically. If the update fails partway through, everything rolls back to the way it was before.
   804	
   805	| Parameter | Type | Notes |
   806	|-----------|------|-------|
   807	| `id` | number | **Required.** Memory ID to update |
   808	| `title` | string | Updated title |
   809	| `triggerPhrases` | string[] | Updated trigger phrases |
   810	| `importanceWeight` | number | Updated weight (0.0-1.0) |
   811	| `importanceTier` | string | `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
   812	| `allowPartialUpdate` | boolean | Update only provided fields (default false) |
   813	
   814	---
   815	
   816	##### `memory_validate`
   817	
   818	Tell the system whether a search result was helpful. Helpful results get a confidence boost so they show up more often. Unhelpful results get demoted. Over time, the system learns which memories are genuinely useful, like training a recommendation engine with thumbs-up and thumbs-down.
   819	
   820	| Parameter | Type | Notes |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '1528,1670p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1528	
  1529	---
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
  1566	```json
  1567	{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
  1568	```
  1569	
  1570	---
  1571	
  1572	### Save Rejected by Quality Gate
  1573	
  1574	**What you see**: Error like `PREFLIGHT_FAILED`, `INSUFFICIENT_CONTEXT_ABORT` or `Template contract validation failed`.
  1575	
  1576	**Common causes**: Too little real content, missing required structure (headings, metadata) or semantic duplicate.
  1577	
  1578	**Fix**: Preview what would happen with a dry run:
  1579	
  1580	```json
  1581	{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
  1582	```
  1583	
  1584	If it shows `INSUFFICIENT_CONTEXT_ABORT`, add more real evidence. If it shows a template-contract failure, fix the markdown structure. Do not lower quality thresholds to bypass legitimate rejections.
  1585	
  1586	---
  1587	
  1588	### Embeddings Fail or Return Zeros
  1589	
  1590	**What you see**: Saved memories have zero vector scores. Semantic search returns nothing.
  1591	
  1592	**Cause**: Missing or invalid API key for the configured embedding provider.
  1593	
  1594	**Fix**: Check your environment:
  1595	
  1596	```bash
  1597	echo $EMBEDDING_PROVIDER
  1598	echo $VOYAGE_API_KEY
  1599	```
  1600	
  1601	Switch to local HuggingFace if no API key is available: `EMBEDDING_PROVIDER=huggingface`
  1602	
  1603	---
  1604	
  1605	### Memory Count Wrong After Bulk Operations
  1606	
  1607	**What you see**: `memory_stats` shows fewer memories than expected.
  1608	
  1609	**Fix**: Check if a checkpoint was created before the operation:
  1610	
  1611	```json
  1612	{ "tool": "checkpoint_list", "arguments": {} }
  1613	```
  1614	
  1615	Restore if needed:
  1616	
  1617	```json
  1618	{ "tool": "checkpoint_restore", "arguments": { "name": "the-checkpoint-name" } }
  1619	```
  1620	
  1621	---
  1622	
  1623	### Server Fails to Start
  1624	
  1625	**What you see**: `node dist/context-server.js` exits with a module error or `MEMORY_DB_PATH`/database-path error.
  1626	
  1627	**Fix**: Rebuild and check the database path:
  1628	
  1629	```bash
  1630	cd .opencode/skill/system-spec-kit/mcp_server
  1631	npm run build
  1632	node --input-type=module -e "await import('./dist/context-server.js')" 2>&1 | head -20
  1633	```
  1634	
  1635	---
  1636	
  1637	### Quick Fixes
  1638	
  1639	| Problem | Fix |
  1640	|---------|-----|
  1641	| Search returning empty | Run `memory_index_scan` to re-index |
  1642	| Tools not appearing in MCP client | Restart the MCP client after config changes |
  1643	| BM25 index stale | Set `ENABLE_BM25=false` to fall back to FTS5 |
  1644	| Slow responses on large index | Set `ENABLE_TOOL_CACHE=true` and review cache + trace settings before enabling heavier debug output |
  1645	| Embedding API rate limit | Set `SPECKIT_EMBEDDING_RETRY_DELAY_MS=1000` |
  1646	| Shared memory not working | Call `shared_memory_enable` first, then create a space with an actor identity |
  1647	
  1648	### Diagnostic Commands
  1649	
  1650	```bash
  1651	# Run full test suite
  1652	cd .opencode/skill/system-spec-kit/mcp_server
  1653	npx vitest run
  1654	
  1655	# Check database tables
  1656	sqlite3 database/context-index.sqlite ".tables"
  1657	
  1658	# Count indexed memories
  1659	sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"
  1660	```
  1661	
  1662	```json
  1663	{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
  1664	```
  1665	
  1666	<!-- /ANCHOR:troubleshooting -->
  1667	
  1668	---
  1669	
  1670	<!-- ANCHOR:faq -->

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '748,792p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   748	  if (bm25Index.isBm25Enabled()) channels.push('bm25');
   749	  if (isGraphUnifiedEnabled()) channels.push('graph');
   750	  if (isDegreeBoostEnabled()) channels.push('degree');
   751	  const staleWarning = stats.staleCount > 10
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '60,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

web search: 
web search: 
web search: 
web search: 
codex
I’ve got enough file-level evidence to start comparing ergonomics, but I also want one semantic pass so I don’t miss scattered DX hooks or troubleshooting surfaces. I’m using CocoIndex now to sweep both Mex and Spec Kit for setup/debug patterns that exact grep may not surface cleanly.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'ccc search "developer experience setup debugging troubleshooting command surface watch hook dry-run json prompt export health diagnostics" --path .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external --limit 8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
2026-04-10T21:03:06.860525Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc 'ccc search "developer experience setup debugging troubleshooting command surface watch hook dry-run json prompt export health diagnostics" --path .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external --limit 8'`: SandboxDenied { message: "Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'\n", output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: "", truncated_after_lines: None }, stderr: StreamOutput { text: "Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'\n", truncated_after_lines: None }, aggregated_output: StreamOutput { text: "Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'\n", truncated_after_lines: None }, duration: 0ns, timed_out: false } }
 exited 1 in 473ms:
Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'

exec
/bin/zsh -lc 'rg -n "promptGlobalInstall|selectToolConfig|hasClaudeCli|launchClaude|corrupted|inside the mex repository|dry run|Scanning codebase|Pre-analysis complete|paste the prompt" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "POST-SAVE QUALITY REVIEW|quality review|dryRun|dry run|autoRepair|recommended next actions|hints|readiness|includeTrace|graphEvidence|retrieval trace" .opencode/skill/system-spec-kit/mcp_server/README.md .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
110:      `Templates directory not found at ${TEMPLATES_DIR}. The promexeus package may be corrupted — try reinstalling.`
124:          "You're inside the mex repository itself. Run this from your project root instead."
171:      ok(`(dry run) Would copy .mex/${file}`);
186:    selectedClaude = await selectToolConfig(rl, projectRoot, dryRun);
198:      info("Scanning codebase...");
203:      ok("Pre-analysis complete — AI will reason from brief instead of exploring");
223:    header("Would run population prompt (dry run — skipping)");
225:    ok("Done (dry run).");
229:  const hasClaude = hasClaudeCli();
238:    await launchClaude(prompt);
242:    await promptGlobalInstall();
253:      info("Or paste the prompt below into your AI tool.");
269:  await promptGlobalInstall();
305:async function selectToolConfig(
337:        warn(`(dry run) Would overwrite ${config.dest}`);
339:        ok(`(dry run) Would copy ${config.dest}`);
383:function hasClaudeCli(): boolean {
392:function launchClaude(prompt: string): Promise<void> {
410:async function promptGlobalInstall(): Promise<void> {

 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:114:      "readiness": "Needs research"
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:201:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:253:  readiness: 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:319:    readiness: 'ready',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:324:    surface: options.surface ?? 'response-hints',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:332:  const hints = Array.isArray(envelope.hints)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:333:    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:335:  envelope.hints = hints;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:336:  if (!hints.includes(nudge.message)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:337:    hints.push(nudge.message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:671:  const hints = Array.isArray(envelope.hints)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:672:    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:674:  envelope.hints = hints;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:684:  hints.push(
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:688:  // T018: Include Prime Package hints for non-hook CLIs
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:692:      hints.push(`Active spec folder: ${pkg.specFolder}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:696:      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:984:            const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:986:            envelope.hints = existingHints;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1007:                surface: 'response-hints',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1026:        if (!enrichment.skipped && enrichment.hints.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1030:              const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1031:              envelope.hints = [...existingHints, ...enrichment.hints];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1045:    // SK-004: Inject auto-surface hints before token-budget enforcement so
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1098:              if (Array.isArray(envelope.hints)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1099:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1106:              if (Array.isArray(envelope.hints)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1107:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1120:    // REQ-004: Include recovery hints in all error responses
.opencode/skill/system-spec-kit/mcp_server/README.md:455:If a file fails any gate, the system rejects it with a clear explanation. Preview all checks without saving using `dryRun: true`.
.opencode/skill/system-spec-kit/mcp_server/README.md:465:**Mode-aware response profiles** -- formats results differently by situation. Quick lookup returns top answer only. Research returns full results with evidence. Resume returns state plus next-steps. Debug returns the full retrieval trace.
.opencode/skill/system-spec-kit/mcp_server/README.md:489:**Provenance-rich response envelopes** (when `includeTrace` is enabled) -- show exactly how each result was found: which channels contributed, how scores were calculated and where the information originated.
.opencode/skill/system-spec-kit/mcp_server/README.md:543:**Read-path readiness:** `ensureCodeGraphReady()` runs automatically inside `code_graph_query` and `code_graph_context`. It checks graph freshness, returns a `readiness` block, and performs bounded inline selective reindex only when the stale set is small enough to repair safely on the read path. Empty graphs, large stale sets, and other full-scan cases remain explicit `code_graph_scan` work.
.opencode/skill/system-spec-kit/mcp_server/README.md:583:| `includeTrace` | boolean | Include retrieval trace for debugging |
.opencode/skill/system-spec-kit/mcp_server/README.md:606:| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:707:| `dryRun` | boolean | Preview validation without saving |
.opencode/skill/system-spec-kit/mcp_server/README.md:726:    "dryRun": true
.opencode/skill/system-spec-kit/mcp_server/README.md:772:| `autoRepair` | boolean | Attempt automatic repairs |
.opencode/skill/system-spec-kit/mcp_server/README.md:779:Check session readiness: priming status, code graph freshness and time since last tool call. Returns `ok`, `warning` or `stale` with actionable hints. Call periodically during long sessions to detect context drift.
.opencode/skill/system-spec-kit/mcp_server/README.md:783:| _(none required)_ |  | Returns health status with hints |
.opencode/skill/system-spec-kit/mcp_server/README.md:1062:Query structural code relationships: `outline` (file symbols), `calls_from` and `calls_to` (call graph), `imports_from` and `imports_to` (dependency graph). Use this instead of Grep for structural queries. Supports multi-hop BFS traversal. Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1077:Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1087:| `includeTrace` | boolean | Include trace metadata for debugging |
.opencode/skill/system-spec-kit/mcp_server/README.md:1537:| Repair an empty or broadly stale code graph | `code_graph_scan` | Use when readiness reports `full_scan` or the graph is missing |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1578:**Fix**: Preview what would happen with a dry run:
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/README.md:1723:A dry run validates the file against the quality gate, estimates the token budget, checks for duplicates and returns a report, all without writing anything to the database. Use it to verify a file will pass before committing.

exec
/bin/zsh -lc 'rg -n "askUser|Interactive|Show prompts|dry-run|score:|Run another cycle|include warning|only errors" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
8:function askUser(question: string): Promise<string> {
18:function runClaudeInteractive(brief: string, cwd: string): boolean {
56:        `Found ${report.issues.length} issues (score: ${report.score}/100)`
100:        chalk.dim("\n--dry-run: showing prompt without executing\n")
112:      console.log("  1) Interactive — Claude fixes with you watching (default)");
113:      console.log("  2) Show prompts — I'll paste manually");
117:      const choice = await askUser("Choice [1-3] (default: 1): ");
136:    // Show prompts mode — print combined prompt and exit
149:    const ok = runClaudeInteractive(brief, config.projectRoot);
167:        `\nDrift score: ${report.score} → ${postReport.score}/100 (${deltaStr})`
202:    const answer = await askUser(
203:      `\n${remaining} issue(s) remain. Run another cycle? [Y/n] `

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '676,706p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   676	  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
   677	    ? sessionPrimeContext.constitutional.length
   678	    : 0;
   679	  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
   680	  const codeGraphState = codeGraphStatus?.status === 'ok'
   681	    ? 'loaded code graph status'
   682	    : 'code graph status unavailable';
   683	
   684	  hints.push(
   685	    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
   686	  );
   687	
   688	  // T018: Include Prime Package hints for non-hook CLIs
   689	  const pkg = sessionPrimeContext.primePackage;
   690	  if (pkg) {
   691	    if (pkg.specFolder) {
   692	      hints.push(`Active spec folder: ${pkg.specFolder}`);
   693	    }
   694	    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
   695	    if (pkg.recommendedCalls.length > 0) {
   696	      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
   697	    }
   698	  }
   699	
   700	  meta.sessionPriming = sessionPrimeContext;
   701	}
   702	
   703	async function getMemoryStats(): Promise<DynamicMemoryStats> {
   704	  try {
   705	    const response = await handleMemoryStats({
   706	      folderRanking: 'count',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '448,500p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   448	
   449	Not everything deserves to be stored. Before a new memory enters the system, it goes through three layered checks:
   450	
   451	1. **Structure gate** -- does the file have the required format, headings and metadata?
   452	2. **Semantic sufficiency gate** -- is there enough real content to be useful?
   453	3. **Duplicate gate** -- does this already exist? If so, run Prediction Error arbitration (create, reinforce, update or supersede)
   454	
   455	If a file fails any gate, the system rejects it with a clear explanation. Preview all checks without saving using `dryRun: true`.
   456	
   457	The system also learns from how you use search results:
   458	
   459	**Learned relevance feedback** -- watches when you mark results as useful or not. Helpful results get a boost in future queries. 10 safeguards prevent noise: denylist, rate limits, 30-day decay, per-cycle caps, minimum session thresholds, one-week trial period before boosts go live.
   460	
   461	**Result confidence scoring** -- tags each result as high, medium or low confidence using fast heuristics (no LLM needed). Checks: top-K separation, multi-channel agreement, quality score and source document structure.
   462	
   463	**Two-tier explainability** -- basic mode shows a plain-language reason ("matched strongly on meaning, boosted by causal graph connection"). Debug mode shows exact channel contributions and weights.
   464	
   465	**Mode-aware response profiles** -- formats results differently by situation. Quick lookup returns top answer only. Research returns full results with evidence. Resume returns state plus next-steps. Debug returns the full retrieval trace.
   466	
   467	**Empty result recovery** -- diagnoses why a search came back empty (too narrow filter, unclear question, missing knowledge) and suggests next steps.
   468	
   469	---
   470	
   471	#### 3.1.10 RETRIEVAL ENHANCEMENTS
   472	
   473	Beyond the core search pipeline, several enhancements make retrieval smarter at finding what you actually need.
   474	
   475	**Constitutional memory as expert knowledge injection** -- tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Constitutional injections obey global scope enforcement so the wrong tenant's rules never leak.
   476	
   477	**Spec folder hierarchy search** -- uses your project folder organization as a retrieval signal. If you are looking at a child folder, the system also checks parent and sibling folders for related information.
   478	
   479	**Dual-scope memory auto-surface** -- watches for tool use and context compression events and automatically brings up important memories without being asked.
   480	
   481	**Cross-document entity linking** -- connects memories across folders when they reference the same concept, even if the surrounding text is completely different.
   482	
   483	**Memory summary search channel** -- creates a short summary of each memory when saved and searches against those summaries. Like reading the back-cover blurb of a book.
   484	
   485	**Contextual tree injection** -- labels each result with its position in the project hierarchy ("Project > Feature > Detail") so you always know where it belongs.
   486	
   487	**ANCHOR-based section retrieval** -- memory files can include `<!-- ANCHOR:name -->` markers. The search system indexes individual sections separately, allowing retrieval of just "decisions" or "next-steps" from a large document (~93% token savings). Files above 50K characters are always chunk-split.
   488	
   489	**Provenance-rich response envelopes** (when `includeTrace` is enabled) -- show exactly how each result was found: which channels contributed, how scores were calculated and where the information originated.
   490	
   491	---
   492	
   493	#### 3.1.11 INDEXING AND INFRASTRUCTURE
   494	
   495	The system keeps the index accurate and performant as your project evolves.
   496	
   497	**Real-time filesystem watching** (chokidar) -- monitors your project folder continuously. When you save, rename or delete a file, the index updates automatically.
   498	
   499	**Incremental indexing with content hashing** -- tracks SHA-256 hashes of every indexed file. Unchanged files get skipped instantly during scans.
   500	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '456,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "cat .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CONTRIBUTING.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
     1	# Contributing to mex
     2	
     3	Thanks for your interest in contributing! Here's how to get started.
     4	
     5	## Setup
     6	
     7	```bash
     8	git clone https://github.com/theDakshJaitly/mex.git
     9	cd mex
    10	npm install
    11	npm run build
    12	```
    13	
    14	## Development
    15	
    16	```bash
    17	npm run dev          # watch mode — rebuilds on changes
    18	npm run test:watch   # run tests in watch mode
    19	npm run typecheck    # type check without emitting
    20	```
    21	
    22	## Before submitting a PR
    23	
    24	1. Run the full check suite:
    25	   ```bash
    26	   npm run typecheck && npm run test && npm run build
    27	   ```
    28	2. Keep changes focused — one fix or feature per PR.
    29	3. Add tests for new checkers or bug fixes when possible.
    30	4. Don't refactor surrounding code unless that's the point of the PR.
    31	
    32	## Project structure
    33	
    34	```
    35	src/
    36	  cli.ts              # CLI entry point (commander)
    37	  config.ts           # Project/scaffold root detection
    38	  drift/
    39	    claims.ts         # Extract claims from markdown files
    40	    checkers/         # Individual drift checkers
    41	    scoring.ts        # Score computation
    42	    index.ts          # Orchestrates drift check
    43	  scanner/            # Codebase pre-scanner (used by mex init)
    44	  sync/               # AI-targeted sync (brief builder + interactive loop)
    45	  reporter.ts         # Terminal output formatting
    46	test/                 # Vitest tests
    47	```
    48	
    49	## Reporting bugs
    50	
    51	Open an issue using the bug report template. Include the output of `mex check --json` if relevant.
    52	
    53	## License
    54	
    55	By contributing, you agree that your contributions will be licensed under the MIT License.

exec
/bin/zsh -lc "cat .opencode/skill/system-spec-kit/mcp_server/package.json | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "name": "@spec-kit/mcp-server",
  "version": "1.8.0",
  "description": "Semantic Memory MCP Server - provides 33 tools for semantic search, memory management, validation, checkpoints, causal graphs, session learning, and auto-indexing",
  "type": "module",
  "main": "dist/api/index.js",
  "exports": {
    ".": "./dist/api/index.js",
    "./server": "./dist/context-server.js",
    "./api": "./dist/api/index.js",
    "./api/*": "./dist/api/*.js"
  },
  "bin": {
    "context-server": "./dist/context-server.js",
    "spec-kit-cli": "./dist/cli.js"
  },
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit --composite false -p tsconfig.json",
    "start": "node dist/context-server.js",
    "check": "npm run lint && npx tsc --noEmit",
    "check:full": "npm run check && npm run test",
    "lint": "eslint . --ext .ts",
    "test": "npm run test:core && npm run test:file-watcher",
    "test:core": "vitest run --exclude tests/file-watcher.vitest.ts",
    "test:file-watcher": "vitest run tests/file-watcher.vitest.ts",
    "test:task-enrichment": "echo 'Task-enrichment tests run in @spec-kit/scripts workspace'",
    "test:hydra:phase1": "vitest run tests/memory-roadmap-flags.vitest.ts tests/memory-state-baseline.vitest.ts tests/migration-checkpoint-scripts.vitest.ts tests/vector-index-schema-compatibility.vitest.ts",
    "test:watch": "vitest"
  },
  "keywords": [
    "mcp",
    "claude",
    "semantic-memory",
    "vector-search",
    "auto-indexing"
  ],
  "author": "Michel Kerkmeester",
  "license": "MIT",
  "engines": {
    "node": ">=20.11.0"
  },
  "dependencies": {
    "@huggingface/transformers": "^3.8.1",
    "@modelcontextprotocol/sdk": "^1.24.3",
    "@spec-kit/shared": "file:../shared",
    "better-sqlite3": "^12.6.2",
    "chokidar": "^4.0.3",
    "onnxruntime-common": "^1.21.0",
    "sqlite-vec": "^0.1.7-alpha.2",
    "tree-sitter-wasms": "^0.1.13",
    "web-tree-sitter": "^0.24.7",
    "zod": "^4.1.12"
  },
  "optionalDependencies": {
    "node-llama-cpp": "^3.15.1",
    "sqlite-vec-darwin-arm64": "^0.1.7-alpha.2"
  },
  "devDependencies": {
    "@vitest/coverage-v8": "^4.1.2",
    "eslint": "^9.39.1",
    "globals": "^16.4.0",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.46.3",
    "vitest": "^4.0.18"
  }
}

codex
# Iteration 027: DEVELOPER EXPERIENCE

## Focus
DEVELOPER EXPERIENCE: How easy is this system to set up, configure, debug, and maintain? What DX patterns should we steal for our memory system?

## Findings
### Finding 1: Mex has a much better first-run bootstrap story than Spec Kit Memory
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L42), [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L7), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L96)
- **What it does**: `npx promexeus setup` is a guided wizard. It detects whether the repo is fresh, existing, or partial; copies scaffold templates; asks which AI tool the developer uses; pre-scans the repo to build a structured brief; then either launches Claude directly or prints a copy-paste prompt. It also supports `--dry-run`, detects corrupted package installs, and stops users who run it from the wrong repo.
- **Why it matters**: Spec Kit Memory has stronger runtime recovery once you are already inside the system, but setup is more fragmented across docs, MCP tools, server startup, `generate-context.js`, indexing, code-graph readiness, and CocoIndex health. Mex’s onboarding lowers activation energy by collapsing all of that into one “do the right thing” flow.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Mex makes automation failures debuggable because every major workflow has a manual fallback
- **Source**: [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md#L9), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L32)
- **What it does**: Setup and sync both support prompt export and dry-run preview. Sync briefs include the flagged file’s current content, issue list, nearby filesystem reality, and recent git diff. If the CLI path fails, the user still gets the exact prompt bundle needed to continue manually.
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


hook: Stop
hook: Stop Completed
tokens used
75,219
# Iteration 027: DEVELOPER EXPERIENCE

## Focus
DEVELOPER EXPERIENCE: How easy is this system to set up, configure, debug, and maintain? What DX patterns should we steal for our memory system?

## Findings
### Finding 1: Mex has a much better first-run bootstrap story than Spec Kit Memory
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L42), [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L7), [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts#L96)
- **What it does**: `npx promexeus setup` is a guided wizard. It detects whether the repo is fresh, existing, or partial; copies scaffold templates; asks which AI tool the developer uses; pre-scans the repo to build a structured brief; then either launches Claude directly or prints a copy-paste prompt. It also supports `--dry-run`, detects corrupted package installs, and stops users who run it from the wrong repo.
- **Why it matters**: Spec Kit Memory has stronger runtime recovery once you are already inside the system, but setup is more fragmented across docs, MCP tools, server startup, `generate-context.js`, indexing, code-graph readiness, and CocoIndex health. Mex’s onboarding lowers activation energy by collapsing all of that into one “do the right thing” flow.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Mex makes automation failures debuggable because every major workflow has a manual fallback
- **Source**: [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md#L9), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L32)
- **What it does**: Setup and sync both support prompt export and dry-run preview. Sync briefs include the flagged file’s current content, issue list, nearby filesystem reality, and recent git diff. If the CLI path fails, the user still gets the exact prompt bundle needed to continue manually.
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
