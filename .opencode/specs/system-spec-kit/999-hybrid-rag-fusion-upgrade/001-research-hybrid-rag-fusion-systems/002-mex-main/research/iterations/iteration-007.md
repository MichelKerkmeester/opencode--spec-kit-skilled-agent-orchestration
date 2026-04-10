### Finding 6: Spec Kit Memory already implements the lifecycle primitives Mex is missing
- **Source**: [memory-save dedup.ts:229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L229), [response-builder.ts:248](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts#L248), [canonical-path.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts#L18), [mutation-ledger.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts#L5), [lineage-state.ts:407](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L407), [lineage-state.ts:666](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L666), [reconsolidation-bridge.ts:395](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L395), [archival-manager.ts:192](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L192), [tool-input-schemas.ts:179](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L179)
- **What it does**: our system already has canonical path keys, unchanged-save short-circuits, duplicate content-hash rejection, append-only mutation ledger with DB triggers, lineage versions with logical keys and active projection upserts, soft archive via `is_archived`, and retention metadata like `retentionPolicy` and `deleteAfter`.
- **Why it matters for us**: Mex is not a hygiene upgrade for the memory store itself. The reusable slice is a cheap static markdown-claim checker, not the mutation model.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/patterns/INDEX.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md)
- [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts)
- [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts)
- [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [system-spec-kit/memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [system-spec-kit/save/dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
- [system-spec-kit/save/create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
- [system-spec-kit/save/reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts)
- [system-spec-kit/save/response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts)
- [system-spec-kit/canonical-path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts)
- [system-spec-kit/mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts)
- [system-spec-kit/lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [system-spec-kit/reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
- [system-spec-kit/archival-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts)
- [system-spec-kit/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)

## Assessment
- New information ratio: 0.84
- Questions addressed: whether Mex has real dedup or upsert logic, whether it tracks revisions durably, whether it supports soft delete or garbage collection, how stable its topic identity is under path changes, and which hygiene ideas are actually reusable for Spec Kit Memory
- Questions answered: Mex is file-scaffold hygiene rather than memory-store hygiene; its revision behavior is mostly prompt-enforced; its dedup is structural rather than content-based; it has no soft-delete/retention lifecycle; the reusable piece is a cheap static claim-contradiction lane, not the lifecycle model

## Reflection
- What worked: reading `SYNC.md`, `pattern/index.ts`, `types.ts`, `sync/index.ts`, and the drift checkers side by side with our save/lineage/archival code made the boundary between scaffold maintenance and actual memory lifecycle very clear
- What did not work: semantic search was not usable in this run, so hidden cross-cutting discovery had to be done with direct file tracing instead of CocoIndex

## Recommended Next Focus
Investigate a narrowly scoped static “claim hygiene” lane for Spec Kit Memory: extract dependency/version/command/path claims from markdown memory/spec docs, run cheap contradiction and drift checks against manifests/filesystem, and surface that as advisory hygiene without replacing our canonical-path, dedup, lineage, archive, or retention machinery.

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
# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

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
I’m treating this as a read-only deep-research pass over the Mex source, centered on agent integration and project-scoped capture patterns. I’m first pulling the most relevant prior memory context, then validating the phase folder and tracing the implementation files the brief calls out before I synthesize new findings.
exec
/bin/zsh -lc 'rg -n "mex|hybrid-rag-fusion|drift detection|002-mex-main|external memory system|markdown scaffold" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 1317ms:

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
The phase-folder validator is still running, and I’ve confirmed there isn’t already a directly relevant prior memory note about Mex itself, so this pass needs to come from live source tracing. Next I’m reading the scaffold contract, CLI flow, sync path, and the agent-facing pieces to isolate genuinely new integration patterns instead of rehashing the drift findings you already have.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

| Tool | Config file |
|------|------------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenCode | `.opencode/opencode.json` |
| Codex (OpenAI) | `AGENTS.md` |

Most config files embed the same instructions directly. OpenCode is the exception — `.opencode/opencode.json` references `.mex/AGENTS.md` instead of embedding content. `mex setup` asks which tool you use and creates the appropriate config.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

[MIT](LICENSE)
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The contract files make the agent model clearer now: Mex is less “memory store” and more “navigation scaffold plus repair loop.” I’m moving from the prose layer into the actual CLI and sync implementation so I can pin down where passive capture, project scoping, and multi-agent safety are enforced in code versus only described in markdown.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE/bug_report.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE/feature_request.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/pull_request_template.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/workflows/ci.yml
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/.cursorrules
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/.windsurfrules
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/copilot-instructions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/.cursorrules
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/.windsurfrules
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/copilot-instructions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/opencode.json
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
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Pattern Index

Lookup table for all pattern files in this directory. Check here before starting any task — if a pattern exists, follow it.

<!-- This file is populated during setup (Pass 2) and updated whenever patterns are added.
     Each row maps a pattern file (or section) to its trigger — when should the agent load it?

     Format — simple (one task per file):
     | [filename.md](filename.md) | One-line description of when to use this pattern |

     Format — anchored (multi-section file, one row per task):
     | [filename.md#task-first-task](filename.md#task-first-task) | When doing the first task |
     | [filename.md#task-second-task](filename.md#task-second-task) | When doing the second task |

     Example (from a Flask API project):
     | [add-api-client.md](add-api-client.md) | Adding a new external service integration |
     | [debug-pipeline.md](debug-pipeline.md) | Diagnosing failures in the request pipeline |
     | [crud-operations.md#task-add-endpoint](crud-operations.md#task-add-endpoint) | Adding a new API route with validation |
     | [crud-operations.md#task-add-model](crud-operations.md#task-add-model) | Adding a new database model |

     Keep this table sorted alphabetically. One row per task (not per file).
     If you create a new pattern, add it here. If you delete one, remove it. -->

| Pattern | Use when |
|---------|----------|

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,320p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,360p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,320p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,320p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,320p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/**
 * Population prompt templates for mex setup.
 * Three variants based on project state:
 *   - fresh: no source files, ask user questions
 *   - existing with scanner brief: AI reasons from pre-analyzed data
 *   - existing without brief: AI explores filesystem directly
 */

/** Shared pass 2+3 instructions appended to existing-project prompts */
const EXISTING_PASSES_2_3 = `
PASS 2 — Generate starter patterns:

Read .mex/patterns/README.md for the format and categories.

Generate 3-5 starter patterns for the most common and most dangerous task
types in this project. Focus on:
- The 1-2 tasks a developer does most often (e.g., add endpoint, add component)
- The 1-2 integrations with the most non-obvious gotchas
- 1 debug pattern for the most common failure boundary

Each pattern should be specific to this project — real file paths, real gotchas,
real verify steps derived from the code you read in Pass 1.
Use the format in .mex/patterns/README.md. Name descriptively (e.g., add-endpoint.md).

Do NOT try to generate a pattern for every possible task type. The scaffold
grows incrementally — the behavioural contract (step 5: GROW) will create
new patterns from real work as the project evolves. Setup just seeds the most
critical ones.

After generating patterns, update .mex/patterns/INDEX.md with a row for each
pattern file you created. For multi-section patterns, add one row per task
section using anchor links (see INDEX.md annotation for format).

PASS 3 — Wire the web:

Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
For each file, add or update the edges array in the YAML frontmatter.
Each edge should point to another scaffold file that is meaningfully related,
with a condition explaining when an agent should follow that edge.

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
you could not fill with confidence.`;

/** Shared pass 1 populate instructions for existing projects */
const EXISTING_PASS_1 = `
Populate each .mex/context/ file by replacing the annotation comments
with real content from this codebase. Follow the annotation instructions exactly.
For each slot:
- Use the actual names, patterns, and structures from this codebase
- Do not use generic examples
- Do not leave any slot empty — if you cannot determine the answer,
  write "[TO DETERMINE]" and explain what information is needed
- Keep length within the guidance given in each annotation

Then assess: does this project have domains complex enough that cramming
them into architecture.md would make it too long or too shallow?
If yes, create additional domain-specific context files in .mex/context/.
Examples: a project with a complex auth system gets .mex/context/auth.md.
A data pipeline gets .mex/context/ingestion.md. A project with Stripe gets
.mex/context/payments.md. Use the same YAML frontmatter format (name,
description, triggers, edges, last_updated). Only create these for
domains that have real depth — not for simple integrations that fit
in a few lines of architecture.md.

After populating .mex/context/ files, update .mex/ROUTER.md:
- Fill in the Current Project State section based on what you found
- Add rows to the routing table for any domain-specific context files you created

Update .mex/AGENTS.md:
- Fill in the project name, one-line description, non-negotiables, and commands`;

export function buildFreshPrompt(): string {
  return `You are going to populate an AI context scaffold for a project that
is just starting. Nothing is built yet.

Read the following files in order before doing anything else:
1. .mex/ROUTER.md — understand the scaffold structure
2. All files in .mex/context/ — read the annotation comments in each

Then ask me the following questions one section at a time.
Wait for my answer before moving to the next section:

1. What does this project do? (one sentence)
2. What are the hard rules — things that must never happen in this codebase?
3. What is the tech stack? (language, framework, database, key libraries)
4. Why did you choose this stack over alternatives?
5. How will the major pieces connect? Describe the flow of a typical request/action.
6. What patterns do you want to enforce from day one?
7. What are you deliberately NOT building or using?

After I answer, populate the .mex/context/ files based on my answers.
For any slot you cannot fill yet, write "[TO BE DETERMINED]" and note
what needs to be decided before it can be filled.

Then assess: based on my answers, does this project have domains complex
enough that cramming them into architecture.md would make it too long
or too shallow? If yes, create additional domain-specific context files
in .mex/context/. Examples: a project with a complex auth system gets
.mex/context/auth.md. A data pipeline gets .mex/context/ingestion.md.
A project with Stripe gets .mex/context/payments.md. Use the same YAML
frontmatter format (name, description, triggers, edges, last_updated).
Only create these for domains that have real depth — not for simple
integrations that fit in a few lines of architecture.md. For fresh
projects, mark domain-specific unknowns with "[TO BE DETERMINED —
populate after first implementation]".

Update .mex/ROUTER.md current state to reflect that this is a new project.
Add rows to the routing table for any domain-specific context files you created.
Update .mex/AGENTS.md with the project name, description, non-negotiables, and commands.

Read .mex/patterns/README.md for the format and categories.

Generate 2-3 starter patterns for the most obvious task types you can
anticipate for this stack. Focus on the tasks a developer will do first.
Mark unknowns with "[VERIFY AFTER FIRST IMPLEMENTATION]".

Do NOT try to anticipate every possible pattern. The scaffold grows
incrementally — the behavioural contract (step 5: GROW) will create
new patterns from real work as the project evolves. Setup just seeds
the most critical ones.

After generating patterns, update .mex/patterns/INDEX.md with a row for each
pattern file you created.

PASS 3 — Wire the web:

Re-read every file you just wrote (.mex/context/ files, pattern files, .mex/ROUTER.md).
For each file, add or update the edges array in the YAML frontmatter.
Each edge should point to another scaffold file that is meaningfully related,
with a condition explaining when an agent should follow that edge.

Rules for edges:
- Every context/ file should have at least 2 edges
- Every pattern file should have at least 1 edge
- Edges should be bidirectional where it makes sense
- Use relative paths (e.g., context/stack.md, patterns/add-endpoint.md)

Important: only write content derived from the codebase or from my answers.
Do not include system-injected text (dates, reminders, etc.) in any scaffold file.`;
}

export function buildExistingWithBriefPrompt(briefJson: string): string {
  return `You are going to populate an AI context scaffold for this project.
The scaffold lives in the .mex/ directory.

Read the following files in order before doing anything else:
1. .mex/ROUTER.md — understand the scaffold structure
2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
3. .mex/context/stack.md — same
4. .mex/context/conventions.md — same
5. .mex/context/decisions.md — same
6. .mex/context/setup.md — same

Here is a pre-analyzed brief of the codebase — do NOT explore the filesystem
yourself for basic structure. Reason from this brief for dependencies, entry
points, tooling, and folder layout. You may still read specific files when
you need to understand implementation details for patterns or architecture.

<brief>
${briefJson}
</brief>

PASS 1 — Populate knowledge files:
${EXISTING_PASS_1}
${EXISTING_PASSES_2_3}`;
}

export function buildExistingNoBriefPrompt(): string {
  return `You are going to populate an AI context scaffold for this project.
The scaffold lives in the .mex/ directory.

Read the following files in order before doing anything else:
1. .mex/ROUTER.md — understand the scaffold structure
2. .mex/context/architecture.md — read the annotation comments to understand what belongs there
3. .mex/context/stack.md — same
4. .mex/context/conventions.md — same
5. .mex/context/decisions.md — same
6. .mex/context/setup.md — same

Then explore this codebase:
- Read the main entry point(s)
- Read the folder structure
- Read 2-3 representative files from each major layer
- Read any existing README or documentation

PASS 1 — Populate knowledge files:
${EXISTING_PASS_1}
${EXISTING_PASSES_2_3}`;
}

codex
I’ve reached the code paths where Mex actually constrains agent behavior. The strongest signals so far are that it narrows setup/sync through prebuilt briefs and file-targeted prompts, but it still assumes a single interactive agent session rather than providing hard multi-agent coordination or passive event capture primitives.
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
/bin/zsh -lc "sed -n '1,280p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Tool Configuration Files

These files make the scaffold work with specific AI coding tools.
Most embed the same content — a pointer to `.mex/ROUTER.md`. OpenCode uses a JSON config that references `.mex/AGENTS.md` instead.

## Which file does your tool use?

| Tool | File to use |
|------|-------------|
| Claude Code | `CLAUDE.md` → copy or symlink to project root |
| Cursor | `.cursorrules` → copy or symlink to project root |
| Windsurf | `.windsurfrules` → copy or symlink to project root |
| GitHub Copilot | `copilot-instructions.md` → copy to `.github/` in project root |
| OpenCode | `opencode.json` → copy to `.opencode/` in project root |
| Codex (OpenAI) | Copy `CLAUDE.md` as `AGENTS.md` to project root |
| Any other tool | Point agent to `.mex/AGENTS.md` |

## Setup

Copy the relevant file to the correct location in your project root:

```bash
# Claude Code
cp .tool-configs/CLAUDE.md ./CLAUDE.md

# Cursor
cp .tool-configs/.cursorrules ./.cursorrules

# Windsurf
cp .tool-configs/.windsurfrules ./.windsurfrules

# Copilot
mkdir -p .github && cp .tool-configs/copilot-instructions.md ./.github/copilot-instructions.md

# OpenCode
mkdir -p .opencode && cp .tool-configs/opencode.json ./.opencode/opencode.json

# Codex (OpenAI)
cp .tool-configs/CLAUDE.md ./AGENTS.md
```

## If your tool is not listed

Add "Read .mex/ROUTER.md before starting any task" to your tool's system prompt
or paste it at the start of each session. The scaffold works identically.

## Content

Most files embed the Circle 1 anchor from `.mex/AGENTS.md`. OpenCode's `opencode.json` references it by path instead.
`.mex/AGENTS.md` is the source of truth. If you update it, update your root tool config too.

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".mex/AGENTS.md"]
}

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The next pass is precision work: I’ve got the candidate patterns, and now I’m pulling exact line ranges for the files that support or weaken each one. That lets me separate “Mex supports this structurally” from “Mex only says this in prompts,” which matters a lot for the multi-agent and passive-capture questions.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Tool Configuration Files
     2	
     3	These files make the scaffold work with specific AI coding tools.
     4	Most embed the same content — a pointer to `.mex/ROUTER.md`. OpenCode uses a JSON config that references `.mex/AGENTS.md` instead.
     5	
     6	## Which file does your tool use?
     7	
     8	| Tool | File to use |
     9	|------|-------------|
    10	| Claude Code | `CLAUDE.md` → copy or symlink to project root |
    11	| Cursor | `.cursorrules` → copy or symlink to project root |
    12	| Windsurf | `.windsurfrules` → copy or symlink to project root |
    13	| GitHub Copilot | `copilot-instructions.md` → copy to `.github/` in project root |
    14	| OpenCode | `opencode.json` → copy to `.opencode/` in project root |
    15	| Codex (OpenAI) | Copy `CLAUDE.md` as `AGENTS.md` to project root |
    16	| Any other tool | Point agent to `.mex/AGENTS.md` |
    17	
    18	## Setup
    19	
    20	Copy the relevant file to the correct location in your project root:
    21	
    22	```bash
    23	# Claude Code
    24	cp .tool-configs/CLAUDE.md ./CLAUDE.md
    25	
    26	# Cursor
    27	cp .tool-configs/.cursorrules ./.cursorrules
    28	
    29	# Windsurf
    30	cp .tool-configs/.windsurfrules ./.windsurfrules
    31	
    32	# Copilot
    33	mkdir -p .github && cp .tool-configs/copilot-instructions.md ./.github/copilot-instructions.md
    34	
    35	# OpenCode
    36	mkdir -p .opencode && cp .tool-configs/opencode.json ./.opencode/opencode.json
    37	
    38	# Codex (OpenAI)
    39	cp .tool-configs/CLAUDE.md ./AGENTS.md
    40	```
    41	
    42	## If your tool is not listed
    43	
    44	Add "Read .mex/ROUTER.md before starting any task" to your tool's system prompt
    45	or paste it at the start of each session. The scaffold works identically.
    46	
    47	## Content
    48	
    49	Most files embed the Circle 1 anchor from `.mex/AGENTS.md`. OpenCode's `opencode.json` references it by path instead.
    50	`.mex/AGENTS.md` is the source of truth. If you update it, update your root tool config too.

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "$schema": "https://opencode.ai/config.json",
     3	  "instructions": [".mex/AGENTS.md"]
     4	}

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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.readAllStdin = readAllStdin;
exports.parseArguments = parseArguments;
exports.validateArguments = validateArguments;
exports.isValidSpecFolder = isValidSpecFolder;
exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const core_1 = require("../core");
const workflow_1 = require("../core/workflow");
const loaders_1 = require("../loaders");
const collect_session_data_1 = require("../extractors/collect-session-data");
// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
}
// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;
// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal) {
    if (shuttingDown)
        return; // prevent re-entrant handling
    shuttingDown = true;
    let lockReleaseFailed = false;
    try {
        (0, workflow_1.releaseFilesystemLock)();
    }
    catch (_err) {
        lockReleaseFailed = true;
    }
    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
    process.exit(lockReleaseFailed ? 1 : 0);
}
function installSignalHandlers() {
    if (signalHandlersInstalled) {
        return;
    }
    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
    signalHandlersInstalled = true;
}
// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput) {
    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
}
function isValidSpecFolder(folderPath) {
    const folderName = path.basename(folderPath);
    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    // Extract the trailing portion that might be "parent/child"
    const trailingSegments = normalizedInput.split('/');
    // Check if the last two segments both match the spec folder pattern
    if (trailingSegments.length >= 2) {
        const lastTwo = trailingSegments.slice(-2);
        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
            // Both segments are valid spec folder names — valid nested spec folder
            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
            if (!hasSpecsParent) {
                // Fallback: check if the path resolves to an existing directory under any specs root
                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                    const candidate = path.join(specsDir, normalizedInput);
                    if (!path.isAbsolute(normalizedInput) &&
                        fsSync.existsSync(candidate) &&
                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
                        return { valid: true };
                    }
                }
                return {
                    valid: false,
                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
                };
            }
            return { valid: true };
        }
    }
    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
        if (/^\d{3}-/.test(folderName)) {
            if (/[A-Z]/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should be lowercase' };
            }
            if (/_/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
            }
            if (!/^[a-z]/.test(folderName.slice(4))) {
                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
            }
        }
        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
    }
    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
    if (!hasSpecsParent) {
        // Fallback: check if bare name can be resolved via recursive child search
        // (findChildFolderSync in validateArguments handles this, so just report the error here)
        return {
            valid: false,
            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
    }
    return { valid: true };
}
function resolveCliSpecFolderReference(rawArg) {
    const folderName = path.basename(rawArg);
    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/'))
        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
        : null;
    let resolvedNestedPath = null;
    if (!rawArg.endsWith('.json')) {
        if (path.isAbsolute(rawArg)) {
            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
            const lastSegment = absoluteSegments.at(-1);
            const parentSegment = absoluteSegments.at(-2);
            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
                resolvedNestedPath = rawArg;
            }
        }
        let cleaned = rawArg;
        if (cleaned.startsWith('.opencode/specs/')) {
            cleaned = cleaned.slice('.opencode/specs/'.length);
        }
        else if (cleaned.startsWith('specs/')) {
            cleaned = cleaned.slice('specs/'.length);
        }
        cleaned = cleaned.replace(/\/+$/, '');
        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
            resolvedNestedPath = explicitProjectScopedPath;
        }
        const segments = cleaned.split('/');
        if (!resolvedNestedPath && segments.length >= 2) {
            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                const candidate = path.join(specsDir, ...segments);
                if (fsSync.existsSync(candidate)) {
                    resolvedNestedPath = candidate;

exec
/bin/zsh -lc 'rg -n "session_bootstrap|memory_context|memory_match_triggers|generate-context|mutation-ledger|lineage-state|agentId|sharedSpaceId|tenantId|userId" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:79:import { runLineageBackfill } from './lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:262:  tenantId: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:263:  sharedSpaceId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:266:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:267:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:268:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:271:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:272:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:273:    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:274:    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:282:    tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:294:    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:408:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:416:    ? tenantId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:464:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:485:            buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:493:              tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:514:          tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:533:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:573:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:606:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:655:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:660:        buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:669:            tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:704:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:724:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:773:        userId: actor.subjectType === 'user' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:774:        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:10:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:114:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:      agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:318:          if (userId && row.user_id !== userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:319:          if (agentId && row.agent_id !== agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:36:import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1108:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1137:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1138:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1139:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1141:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1154:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1155:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1164:  if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1167:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1168:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1170:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1171:    }, sharedSpaceId, 'editor');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1176:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1177:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1178:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1180:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1267:    userId: governanceDecision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1268:    agentId: governanceDecision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1285:        tenantId: saveScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1286:        userId: saveScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1287:        agentId: saveScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1288:        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1466:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1467:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1469:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1474:      if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1486:            spaceId: sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:9:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:8:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:16:import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102:  const tenantId = normalizeScopeMatchValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:103:  const userId = normalizeScopeMatchValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:104:  const agentId = normalizeScopeMatchValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:125:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:126:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:127:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:128:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:129:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:130:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:8:import { recordLineageTransition } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:98:        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:99:        if (!matchesScopedValue(userId, r.user_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:100:        if (!matchesScopedValue(agentId, r.agent_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:132:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:133:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:178:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:179:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:12:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:17:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:  ['tenant_id', 'tenantId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:20:  ['user_id', 'userId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:  ['agent_id', 'agentId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:57:    tenantId: normalizeScopeMatchValue(scope.tenantId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:58:    userId: normalizeScopeMatchValue(scope.userId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:59:    agentId: normalizeScopeMatchValue(scope.agentId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:46:      userId: scope?.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:47:      agentId: scope?.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:211:                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:212:                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:573:| `tenantId` | string | Tenant boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:574:| `userId` | string | User boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:575:| `agentId` | string | Agent boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:576:| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:631:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:632:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:633:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:634:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:666:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:667:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:668:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:669:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:713:| `tenantId` | string | Governance: tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:714:| `userId` | string | Governance: user attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:715:| `agentId` | string | Governance: agent attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:716:| `sharedSpaceId` | string | Governance: shared-space target |
.opencode/skill/system-spec-kit/mcp_server/README.md:898:| `tenantId` | string | **Required.** Tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:915:| `tenantId` | string | **Required.** Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:930:| `tenantId` | string | Filter by tenant |
.opencode/skill/system-spec-kit/mcp_server/README.md:931:| `userId` | string | Filter by user |
.opencode/skill/system-spec-kit/mcp_server/README.md:932:| `agentId` | string | Filter by agent |
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1504:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1518:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
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
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:104:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:105:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:106:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:107:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:123:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:124:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:125:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:126:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:161:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:162:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:163:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:169:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:170:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:171:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:172:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:187:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:188:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:189:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:191:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:268:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:269:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:270:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:271:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:277:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:278:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:280:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:286:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:287:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:288:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:289:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:295:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:296:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:297:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:298:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:428:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:438:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:    tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464:  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:474:  checkpoint_create: ['name', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'metadata'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:475:  checkpoint_list: ['specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:476:  checkpoint_restore: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'clearExisting'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:477:  checkpoint_delete: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'confirmName'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:491:  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492:  shared_space_membership_set: ['spaceId', 'tenantId', 'actorUserId', 'actorAgentId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:22:type MutationLedgerModule = Awaited<typeof import('./lib/storage/mutation-ledger.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:54:  return _mutation_ledger ??= await import('./lib/storage/mutation-ledger.js');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:93:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:94:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:102:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:103:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:104:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:159:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:160:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:331:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:332:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:333:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:351:    tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:352:    userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:353:    agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:358:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361:  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:362:  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:363:    return 'tenantId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:366:  const requestedUserId = normalizeIdentityValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:367:  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:368:    return 'userId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:371:  const requestedAgentId = normalizeIdentityValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:372:  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:373:    return 'agentId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:380:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:381:): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:382:  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1030:    const tenantId = normalizeIdentityValue(state.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1031:    const userId = normalizeIdentityValue(state.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1032:    const agentId = normalizeIdentityValue(state.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1064:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1065:      userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1066:      agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1150:      tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1151:      userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1152:      agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1167:      tenantId: storedIdentity.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1168:      userId: storedIdentity.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1169:      agentId: storedIdentity.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1209:        tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1210:        userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1211:        agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:42:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:43:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:44:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:45:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:51:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:52:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:53:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:54:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:60:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:61:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:62:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:63:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:70:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:71:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:72:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:77:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:78:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:79:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:80:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:204:  const userId = validateValue(args.userId, 'userId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:205:  const agentId = validateValue(args.agentId, 'agentId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:206:  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:208:    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:212:    && tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:213:    && tenantId.trim().length === 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:215:    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:219:    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:220:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:221:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:222:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:230:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:237:    scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:238:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:250:    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:251:    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:268:    matchesScopeField('tenantId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:269:    matchesScopeField('userId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:270:    matchesScopeField('agentId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:271:    matchesScopeField('sharedSpaceId')
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:280:  if (scope.userId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:281:    details.userId = scope.userId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:  if (scope.agentId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:284:    details.agentId = scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:297:    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:29:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:30:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:31:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:32:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:49:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:50:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:51:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:52:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:156:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:157:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:158:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:160:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:179:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:190:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:199:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:219:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:220:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:221:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:222:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:229:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:230:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:231:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:232:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:239:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:240:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:241:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:242:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:249:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:250:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:251:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:252:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:69:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:70:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:71:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:72:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:103:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:104:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:105:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:106:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:124:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:125:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:126:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:127:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:200:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:201:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:202:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:203:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:425:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:426:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:427:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:428:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:453:    tenantId: normalizeScopeValue(tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:454:    userId: normalizeScopeValue(userId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:455:    agentId: normalizeScopeValue(agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:456:    sharedSpaceId: normalizeScopeValue(sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:460:    ['tenant_id', requestedScope.tenantId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:461:    ['user_id', requestedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:462:    ['agent_id', requestedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:463:    ['shared_space_id', requestedScope.sharedSpaceId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:478:      userId: duplicate.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:479:      agentId: duplicate.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:483:      existingScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:484:      existingScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:485:      existingScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:486:      existingScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:572:        tenantId: requestedScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:573:        userId: requestedScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:574:        agentId: requestedScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:575:        sharedSpaceId: requestedScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:759:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:760:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:761:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:762:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:853:      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:32:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:33:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:34:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:35:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:115:  tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:116:  userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:117:  agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:118:  sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:144:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:145:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:146:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:147:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:86:        tenantId: validated.tenantId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:87:        userId: validated.userId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:88:        agentId: validated.agentId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:89:        sharedSpaceId: validated.sharedSpaceId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:70:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:71:      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:72:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:73:      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:201:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:202:      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:203:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:204:      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:335:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:336:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:337:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:338:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:353:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:354:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:355:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:356:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:370:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:371:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:372:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:373:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:388:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:389:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:390:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:391:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:410:      tenantId: { type: 'string', description: 'Owning tenant for the shared space.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:420:    required: ['spaceId', 'tenantId', 'name'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:432:      tenantId: { type: 'string', description: 'Tenant boundary for the membership mutation.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:439:    required: ['spaceId', 'tenantId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:450:      tenantId: { type: 'string', description: 'Optional tenant filter applied to the authenticated caller scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:315:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:316:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:317:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:339:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:340:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:341:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:342:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:367:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:368:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:369:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:382:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:383:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:384:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:385:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:413:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:457:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:39:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:45:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:46:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:58:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:59:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:63:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:64:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:74:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:85:    expect(getAllowedSharedSpaceIds(db, { userId: 'user-1' })).toEqual(new Set());
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:94:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:106:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:117:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:129:      tenantId: 'tenant-B',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:130:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:139:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:140:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:164:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:182:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:183:      userId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:190:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:191:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:203:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:222:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:223:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:228:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:229:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:230:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:253:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:260:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:261:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:294:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:301:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:322:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:343:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:349:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:350:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:378:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:379:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:385:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:392:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:393:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:399:    expect(Array.from(getAllowedSharedSpaceIds(db, { userId: 'user-2' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:408:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:421:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:422:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:427:    expect(Array.from(getAllowedSharedSpaceIds(db, { agentId: 'agent-1' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:435:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:437:    })).toThrow('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:453:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:459:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:477:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:478:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:482:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:483:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:496:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:544:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:644:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:651:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:658:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:665:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:720:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:753:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:68:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:75:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:76:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:106:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:110:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:111:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:22:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:23:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:24:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:26:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:45:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:46:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:47:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:49:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:160:    tenantId: normalizeId(input.tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:161:    userId: normalizeId(input.userId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:162:    agentId: normalizeId(input.agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:164:    sharedSpaceId: normalizeId(input.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:173: * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:235:        tenantId: scope.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:236:        userId: scope.userId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:237:        agentId: scope.agentId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:239:        sharedSpaceId: scope.sharedSpaceId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:250:  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:252:  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:269:      tenantId: scope.tenantId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:270:      userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:271:      agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:273:      sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:291:    tenant_id: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:292:    user_id: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:293:    agent_id: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:295:    shared_space_id: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:302:      tenantId: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:303:      userId: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:304:      agentId: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:306:      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:345:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:346:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:347:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:349:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:368:    scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:369:    || scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:370:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:371:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:409:  if (normalized.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:411:    params.push(normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:413:  if (normalized.userId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:415:    params.push(normalized.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:417:  if (normalized.agentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:419:    params.push(normalized.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:425:  if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:427:    params.push(normalized.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:441:    || normalized.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:442:    || normalized.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:443:    || normalized.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:445:    || normalized.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:472:      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:478:    } else if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:486:      return matchesExactScope(row.tenant_id, normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:489:    return matchesExactScope(row.tenant_id, normalized.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:490:      && matchesExactScope(row.user_id, normalized.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:491:      && matchesExactScope(row.agent_id, normalized.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:606:      tenantId: row.tenant_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:607:      userId: row.user_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:608:      agentId: row.agent_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:610:      sharedSpaceId: row.shared_space_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:479:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:480:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:481:      sharedSpaceId: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:484:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:485:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:486:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:487:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:980:    tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:981:    || userId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:982:    || agentId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:983:    || sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:987:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:988:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:989:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:990:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:169:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:170:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:171:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:179:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:180:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:181:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:182:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:189:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:190:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:191:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:192:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:195:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:196:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:197:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:198:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:209:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:216:    it('T521-C9: whitespace-only tenantId is rejected when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:219:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:220:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:221:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:277:          metadata: { userId: 'user-1', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:286:          metadata: { userId: 'user-2', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:291:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:292:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:293:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:300:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:301:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:302:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:310:      const response = await handler.handleCheckpointList({ userId: 'user-1' });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:411:        metadata: JSON.stringify({ userId: 'user-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:417:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:418:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:433:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:520:        metadata: JSON.stringify({ sharedSpaceId: 'space-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:527:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:528:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:544:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:6:import { recordLineageVersion } from '../lib/storage/lineage-state';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:28:import { runLineageBackfill } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:432:    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:433:    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:434:    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:525:  if (normalizedScope.userId && columns.has('user_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:    params.push(normalizedScope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:529:  if (normalizedScope.agentId && columns.has('agent_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:531:    params.push(normalizedScope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:535:    params.push(normalizedScope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:648:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:700:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:704:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:716:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:720:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:747:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:751:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:810:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:908:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:917:    sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:958:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:963:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:968:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:969:      deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:997:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:998:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1012:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1013:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1070:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1428:      const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1442:          sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1488:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1489:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1490:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1521:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1522:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1523:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1646:    const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1728:                sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1860:              sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:35:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:61:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:235: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:238:export function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:240:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:277:    tenantId: normalizedTenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:292: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:297:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:300:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:397:  if (!definition.spaceId?.trim() || !definition.tenantId?.trim()) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:398:    throw new Error('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:436:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:469:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:514:  if (!normalizedScope.tenantId) return new Set();
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:518:    ['user', normalizedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:519:    ['agent', normalizedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:536:      normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:572:        tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:573:        userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:574:        agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:576:        sharedSpaceId: spaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:615:  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:620:  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:656:  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:713:      sharedSpaceId: args.spaceId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:318:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:319:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:320:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:321:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:116:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:131:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:146:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:170:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:191:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:229:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:271:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:277:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:286:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:299:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:305:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:314:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:336:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:351:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:386:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:401:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:415:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:452:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:471:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:511:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:518:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:537:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:584:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:590:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:599:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:618:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:637:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:650:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:657:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:664:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:672:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:679:    expect(envelope.data.userId).toBe('user-other');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:680:    expect(envelope.data.agentId).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:54:| `lineage-state.ts` | Append-first lineage transitions, active projection reads, backfill, and as-of resolution |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:55:| `mutation-ledger.ts` | SQLite-backed mutation audit ledger with hash-chain support |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:68:- `lineage-state.ts` owns append-first version transitions, active projections, integrity validation, and backfill helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:69:- `mutation-ledger.ts` and `history.ts` provide complementary audit trails: the former is low-level mutation provenance, the latter is higher-level history/event reporting.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:191:│   ├── mutation-ledger.ts      # Append-only audit trail with SQLite triggers
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:262:      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:128:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:129:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:130:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:131:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:173:              tenantId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:174:              userId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:175:              agentId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:203:              tenant_id: tenantId ?? existing?.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:204:              user_id: userId ?? existing?.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:205:              agent_id: agentId ?? existing?.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:414:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:415:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:416:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:607:        tenantId: 'tenant-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:608:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:609:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:694:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:695:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:696:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:712:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:713:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:714:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:24:import { recordLineageTransition } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:28:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:33:    expect(decision.issues).toContain('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:90:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:91:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:112:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:113:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:145:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:146:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:154:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:155:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:162:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:163:      userId: 'user-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:169:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:184:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:209:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:210:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:241:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:247:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:248:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:253:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:254:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:74:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:75:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:76:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:78:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:104:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:105:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:106:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:108:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:246:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:255:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:271:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:280:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:371:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:400:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:616:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:643:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:650:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:146:    scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:147:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:148:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:150:    || scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:158:    const tenantMatches = !scope.tenantId || row.tenant_id === scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:159:    const userMatches = !scope.userId || row.user_id === scope.userId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:160:    const agentMatches = !scope.agentId || row.agent_id === scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:162:    const sharedMatches = !scope.sharedSpaceId || (
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:163:      row.shared_space_id === scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:504:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:505:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:550:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:551:        sharedSpaceId: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:597:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:598:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:630:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:631:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1082:    it('EXT-H13: handleCheckpointList rejects whitespace tenantId when sharedSpaceId is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1084:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1085:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1086:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:77:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:90:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:93:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:94:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:105:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:117:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:118:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:124:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:125:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:134:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:151:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:152:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:87:vi.mock('../lib/storage/mutation-ledger', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:152:  mutationLedgerMod = await import('../lib/storage/mutation-ledger');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:574:  it('EXT-D7: Single delete surfaces mutation-ledger append warnings', async (ctx) => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:756:  it('EXT-U3b: Update surfaces mutation-ledger append warnings', async (ctx) => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:515:        { content: testContent, database: mockDatabase, tenantId: 'tenant-a', userId: 'user-a' } as unknown as DuplicateParams,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:575:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:623:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:624:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:310:      const lineageStateModule = await import('../lib/storage/lineage-state');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:544:      vi.doMock('../lib/storage/lineage-state', async (importOriginal) => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:545:        const actual = await importOriginal<typeof import('../lib/storage/lineage-state')>();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1238:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1239:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1240:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1242:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1251:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1252:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1253:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1255:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1307:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1308:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1309:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1311:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1324:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1325:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1326:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1328:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:8:import { runLineageBackfill, summarizeLineageInspection } from '../lib/storage/lineage-state';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
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
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2080:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:179:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:206:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:237:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:255:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:265:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:272:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:276:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:277:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:415:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:833:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:840:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:904:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:911:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:743:    vi.doMock('../lib/storage/mutation-ledger', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:51:  path.join(SKILL_ROOT, 'feature_catalog', '14--pipeline-architecture', '22-lineage-state-active-projection-and-asof-resolution.md'),
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:46:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:47:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:53:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:54:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:55:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:56:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:18:} from '../lib/storage/lineage-state';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:29:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:30:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:31:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:33:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:66:    params.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:67:    params.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:68:    params.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:70:    params.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:171:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:179:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:213:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:214:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:222:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:223:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:18:} from '../lib/storage/mutation-ledger';
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:19:import type { AppendEntryInput } from '../lib/storage/mutation-ledger';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:275:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:300:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:301:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:304:      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:307:      expect(result.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:318:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:319:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:323:      expect(result.error).toContain('different userId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:400:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:401:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:402:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:493:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:509:        expect(state.tenantId).toBe('tenant-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:529:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:530:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:533:      const r = sm.recoverState('recover-bound', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:536:      expect(r.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:576:      const r = sm.getInterruptedSessions({ tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:184:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:192:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:193:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:345:  - `lib/storage/lineage-state.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:661:- `storage/lineage-state.ts -> handlers/*`
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:31: * @param identity - Unique identity string (e.g., flagName, userId)
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:270:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:271:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:272:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:273:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:281:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:282:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:283:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:284:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:293:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:294:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:295:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:296:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:303:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:304:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:305:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:306:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Tool Input Schemas
// ───────────────────────────────────────────────────────────────
// Centralized strict Zod validation schemas for MCP tool inputs.
// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { z, ZodError, type ZodType } from 'zod';

// Feature catalog: Strict Zod schema validation

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
  const base = z.object(shape);
  return strict ? base.strict() : base.passthrough();
};

/* ───────────────────────────────────────────────────────────────
   4. CONSTANTS
──────────────────────────────────────────────────────────────── */

// Guard against safeNumericPreprocess.pipe(z.number()) coercing "", null, and false to 0.
// Use a safe preprocessor that only accepts actual numbers or numeric strings.
const safeNumericPreprocess = z.preprocess((val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim().length > 0) {
    const parsed = Number(val);
    return Number.isFinite(parsed) ? parsed : val;
  }
  return val;
}, z.number());

const positiveInt = safeNumericPreprocess.pipe(z.number().int().positive());
const positiveIntMax = (max: number) => safeNumericPreprocess.pipe(z.number().int().min(1).max(max));
const boundedNumber = (min: number, max: number) => safeNumericPreprocess.pipe(z.number().min(min).max(max));
const optionalStringArray = z.array(z.string()).optional();

const PATH_TRAVERSAL_MESSAGE = 'Path must not contain traversal sequences';
const isSafePath = (value: string): boolean => !value.includes('..') && !value.includes('\0');
const pathString = (minLength = 0) => {
  let schema = z.string();
  if (minLength > 0) {
    schema = schema.min(minLength);
  }
  return schema.refine(isSafePath, { message: PATH_TRAVERSAL_MESSAGE });
};
const optionalPathString = (minLength = 0) => pathString(minLength).optional();

/** Shared max paths constant — used by both schema and handler. */
export const MAX_INGEST_PATHS = 50;
export const MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS = 1;

const intentEnum = z.enum([
  'add_feature',
  'fix_bug',
  'refactor',
  'security_audit',
  'understand',
  'find_spec',
  'find_decision',
]);

const importanceTierEnum = z.enum([
  'constitutional',
  'critical',
  'important',
  'normal',
  'temporary',
  'deprecated',
]);

const relationEnum = z.enum([
  'caused',
  'enabled',
  'supersedes',
  'contradicts',
  'derived_from',
  'supports',
]);

/* ───────────────────────────────────────────────────────────────
   5. SCHEMA DEFINITIONS
──────────────────────────────────────────────────────────────── */

const memoryContextSchema = getSchema({
  input: z.string().min(1),
  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
  intent: intentEnum.optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
  tokenUsage: boundedNumber(0, 1).optional(),
  anchors: optionalStringArray,
  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
});

const memorySearchSchema = getSchema({
  cursor: z.string().min(1).optional(),
  query: z.string().min(2).max(1000).optional(),
  concepts: z.array(z.string().min(1)).min(2).max(5).optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  sessionId: z.string().optional(),
  enableDedup: z.boolean().optional(),
  tier: importanceTierEnum.optional(),
  contextType: z.string().optional(),
  useDecay: z.boolean().optional(),
  includeContiguity: z.boolean().optional(),
  includeConstitutional: z.boolean().optional(),
  enableSessionBoost: z.boolean().optional(),
  enableCausalBoost: z.boolean().optional(),
  includeContent: z.boolean().optional(),
  anchors: optionalStringArray,
  min_quality_score: boundedNumber(0, 1).optional(),
  minQualityScore: boundedNumber(0, 1).optional(),
  bypassCache: z.boolean().optional(),
  rerank: z.boolean().optional(),
  applyLengthPenalty: z.boolean().optional(),
  applyStateLimits: z.boolean().optional(),
  minState: z.enum(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']).optional(),
  intent: intentEnum.optional(),
  autoDetectIntent: z.boolean().optional(),
  trackAccess: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
  mode: z.enum(['auto', 'deep']).optional(),
  includeTrace: z.boolean().optional(),
  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
});

// E3: Simplified search schema — 3 params only
const memoryQuickSearchSchema = getSchema({
  query: z.string().min(2).max(1000),
  limit: positiveIntMax(100).optional(),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
});

const memoryMatchTriggersSchema = getSchema({
  prompt: z.string().min(1),
  specFolder: optionalPathString(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  limit: positiveIntMax(100).optional(),
  session_id: z.string().optional(),
  turnNumber: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  include_cognitive: z.boolean().optional(),
});

const memorySaveSchema = getSchema({
  filePath: pathString(1),
  force: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  skipPreflight: z.boolean().optional(),
  asyncEmbedding: z.boolean().optional(),
  // Governance args — accepted by tool-schemas.ts tool definition and
  // validated at runtime by scope-governance.ts (F3.04 fix).
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  agentId: z.string().optional(),
  sessionId: z.string().optional(),
  sharedSpaceId: z.string().optional(),
  provenanceSource: z.string().optional(),
  provenanceActor: z.string().optional(),
  governedAt: z.string().optional(),
  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
  deleteAfter: z.string().optional(),
});

// Discriminated delete: branch 1 requires `id` (single-record delete).
// Branch 2 requires `specFolder` + `confirm: true` (bulk folder delete).
// Codex fix: `confirm` accepts only `true` (not `false`) in both branches
// To prevent semantically meaningless `confirm: false` from passing validation.
const memoryDeleteSchema = getSchema({
  id: positiveInt.optional().describe('Memory ID to delete (required unless specFolder + confirm provided for bulk)'),
  specFolder: optionalPathString().describe('Spec folder scope for bulk delete (requires confirm: true)'),
  confirm: z.boolean().optional().describe('Must be true for spec-folder bulk delete'),
});

const memoryUpdateSchema = getSchema({
  id: positiveInt,
  title: z.string().optional(),
  triggerPhrases: optionalStringArray,
  importanceWeight: boundedNumber(0, 1).optional(),
  importanceTier: importanceTierEnum.optional(),
  allowPartialUpdate: z.boolean().optional(),
});

const memoryValidateSchema = getSchema({
  id: positiveInt,
  wasUseful: z.boolean(),
  queryId: z.string().optional(),
  queryTerms: optionalStringArray,
  resultRank: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  totalResultsShown: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
  searchMode: z.string().optional(),
  intent: z.string().optional(),
  sessionId: z.string().optional(),
  notes: z.string().optional(),
});

export const memoryBulkDeleteSchema = getSchema({
  tier: importanceTierEnum,
  specFolder: optionalPathString(),
  confirm: z.literal(true),
  olderThanDays: safeNumericPreprocess
    .pipe(z.number().int().min(MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS))
    .optional(),
  skipCheckpoint: z.boolean().optional(),
});

const memoryListSchema = getSchema({
  limit: positiveIntMax(100).optional(),
  offset: safeNumericPreprocess.pipe(z.number().int().min(0)).optional(),
  specFolder: optionalPathString(),
  sortBy: z.enum(['created_at', 'updated_at', 'importance_weight']).optional(),
  includeChunks: z.boolean().optional(),
});

const memoryStatsSchema = getSchema({
  folderRanking: z.enum(['count', 'recency', 'importance', 'composite']).optional(),
  excludePatterns: optionalStringArray,
  includeScores: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
  limit: positiveIntMax(100).optional(),
});

const memoryHealthSchema = getSchema({
  reportMode: z.enum(['full', 'divergent_aliases']).optional(),
  limit: positiveIntMax(200).optional(),
  specFolder: optionalPathString(),

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Mutation Ledger
// ───────────────────────────────────────────────────────────────
// Feature catalog: Transaction wrappers on mutation handlers
// Append-only audit trail for all memory mutations
// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
import { createHash } from 'crypto';
import type Database from 'better-sqlite3';
import { runInTransaction } from './transaction-manager.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

interface MutationLedgerEntry {
  id: number;
  timestamp: string;
  mutation_type: MutationType;
  reason: string;
  prior_hash: string | null;
  new_hash: string;
  linked_memory_ids: string; // JSON array
  decision_meta: string;     // JSON object
  actor: string;
  session_id: string | null;
}

interface AppendEntryInput {
  mutation_type: MutationType;
  reason: string;
  prior_hash: string | null;
  new_hash: string;
  linked_memory_ids: number[];
  decision_meta: Record<string, unknown>;
  actor: string;
  session_id?: string | null;
}

interface GetEntriesOptions {
  mutation_type?: MutationType;
  actor?: string;
  session_id?: string;
  since?: string;    // ISO timestamp
  until?: string;    // ISO timestamp
  limit?: number;
  offset?: number;
}

interface DivergenceReconcilePolicy {
  normalizedPath: string;
  attemptsSoFar: number;
  nextAttempt: number;
  maxRetries: number;
  shouldRetry: boolean;
  exhausted: boolean;
}

interface DivergenceEscalationPayload {
  code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED';
  normalizedPath: string;
  attempts: number;
  maxRetries: number;
  recommendation: 'manual_triage_required';
  reason: string;
  variants: string[];
}

interface RecordDivergenceReconcileInput {
  normalizedPath: string;
  variants?: string[];
  actor?: string;
  session_id?: string | null;
  maxRetries?: number;
}

interface RecordDivergenceReconcileResult {
  policy: DivergenceReconcilePolicy;
  retryEntryId: number | null;
  escalationEntryId: number | null;
  escalation: DivergenceEscalationPayload | null;
}

/* ───────────────────────────────────────────────────────────────
   2. SCHEMA SQL
----------------------------------------------------------------*/

const LEDGER_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS mutation_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
    reason TEXT NOT NULL,
    prior_hash TEXT,
    new_hash TEXT NOT NULL,
    linked_memory_ids TEXT NOT NULL DEFAULT '[]',
    decision_meta TEXT NOT NULL DEFAULT '{}',
    actor TEXT NOT NULL,
    session_id TEXT
  )
`;

const LEDGER_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_ledger_type ON mutation_ledger(mutation_type);
  CREATE INDEX IF NOT EXISTS idx_ledger_actor ON mutation_ledger(actor);
  CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON mutation_ledger(timestamp);
  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);
  CREATE INDEX IF NOT EXISTS idx_ledger_memory_type_created_at ON mutation_ledger(
    CAST(json_extract(linked_memory_ids, '$[0]') AS INTEGER),
    mutation_type,
    timestamp
  )
`;

const LEDGER_TRIGGER_SQL = `
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
`;

/* ───────────────────────────────────────────────────────────────
   3. INITIALIZATION
----------------------------------------------------------------*/

function initLedger(db: Database.Database): void {
  db.exec(LEDGER_SCHEMA_SQL);
  db.exec(LEDGER_INDEX_SQL);
  db.exec(LEDGER_TRIGGER_SQL);
}

/* ───────────────────────────────────────────────────────────────
   4. HASH COMPUTATION
----------------------------------------------------------------*/

function computeHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/* ───────────────────────────────────────────────────────────────
   5. APPEND ENTRY
----------------------------------------------------------------*/

function appendEntry(db: Database.Database, entry: AppendEntryInput): MutationLedgerEntry {
  const linkedJson = JSON.stringify(entry.linked_memory_ids);
  const metaJson = JSON.stringify(entry.decision_meta);

  const stmt = db.prepare(`
    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    entry.mutation_type,
    entry.reason,
    entry.prior_hash,
    entry.new_hash,
    linkedJson,
    metaJson,
    entry.actor,
    entry.session_id ?? null
  );

  const id = (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;

  const row = db.prepare('SELECT * FROM mutation_ledger WHERE id = ?').get(id) as MutationLedgerEntry;
  return row;
}

/* ───────────────────────────────────────────────────────────────
   6. QUERY ENTRIES
----------------------------------------------------------------*/

function getEntries(db: Database.Database, opts: GetEntriesOptions = {}): MutationLedgerEntry[] {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (opts.mutation_type) {
    conditions.push('mutation_type = ?');
    params.push(opts.mutation_type);
  }
  if (opts.actor) {
    conditions.push('actor = ?');
    params.push(opts.actor);
  }
  if (opts.session_id) {
    conditions.push('session_id = ?');
    params.push(opts.session_id);
  }
  if (opts.since) {
    conditions.push('timestamp >= ?');
    params.push(opts.since);
  }
  if (opts.until) {
    conditions.push('timestamp <= ?');
    params.push(opts.until);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  // String interpolation in LIMIT/OFFSET is safe here because both values
  // Are coerced to non-negative integers via Math.floor + Math.max before use —
  // Math.floor guarantees no decimal component, Math.max(1,…)/Math.max(0,…)
  // Guarantees no negative value. No user-supplied string reaches the SQL directly.
  const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
  // F-13 — OFFSET without LIMIT is invalid SQLite syntax.
  // When offset is set but limit is not, emit LIMIT -1 (all rows) before OFFSET.
  const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
  const effectiveLimit = !limit && offset ? 'LIMIT -1' : limit;

  // String interpolation constructs IN(?,?,?) placeholder list only —
  // All user values are parameterized. Accepted exception per audit H-08.
  const sql = `SELECT * FROM mutation_ledger ${where} ORDER BY id ASC ${effectiveLimit} ${offset}`;
  return db.prepare(sql).all(...params) as MutationLedgerEntry[];
}

function getEntryCount(db: Database.Database): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM mutation_ledger').get() as { count: number };
  return row.count;
}

/* ───────────────────────────────────────────────────────────────
   7. LINKED ENTRIES LOOKUP
----------------------------------------------------------------*/

function getLinkedEntries(db: Database.Database, memoryId: number): MutationLedgerEntry[] {
  // SQLite json_each can expand JSON arrays for matching
  const sql = `
    SELECT ml.* FROM mutation_ledger ml, json_each(ml.linked_memory_ids) je
    WHERE je.value = ?
    ORDER BY ml.id ASC
  `;
  return db.prepare(sql).all(memoryId) as MutationLedgerEntry[];
}

/* ───────────────────────────────────────────────────────────────
   8. APPEND-ONLY VERIFICATION
----------------------------------------------------------------*/

/**

exec
/bin/zsh -lc "sed -n '380,760p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  }
}

function resolveSnapshotFromLineageRow(
  database: Database.Database,
  row: MemoryLineageRow,
): ResolvedLineageSnapshot {
  const metadata = parseMetadata(row);
  return {
    logicalKey: row.logical_key,
    memoryId: row.memory_id,
    versionNumber: row.version_number,
    rootMemoryId: row.root_memory_id,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    transitionEvent: row.transition_event,
    snapshot: metadata?.snapshot ?? getMemoryRow(database, row.memory_id),
  };
}

function upsertActiveProjection(
  database: Database.Database,
  logicalKey: string,
  rootMemoryId: number,
  activeMemoryId: number,
  updatedAt: string,
): void {
  // Evict any stale projection row that maps a *different* logical_key to the
  // same active_memory_id — prevents UNIQUE constraint violation on re-index
  // when the logical_key changes (e.g. anchor or path normalization drift).
  database.prepare(
    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
  ).run(activeMemoryId, logicalKey);
  database.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(logical_key) DO UPDATE SET
      root_memory_id = excluded.root_memory_id,
      active_memory_id = excluded.active_memory_id,
      updated_at = excluded.updated_at
  `).run(logicalKey, rootMemoryId, activeMemoryId, updatedAt);
}

function bindHistory(database: Database.Database): void {
  if (typeof (database as Database.Database & { exec?: unknown }).exec === 'function') {
    initHistory(database);
  }
}

function markHistoricalPredecessor(database: Database.Database, memoryId: number, updatedAt: string): void {
  database.prepare(`
    UPDATE memory_index
    SET importance_tier = CASE
          WHEN importance_tier = 'constitutional' THEN importance_tier
          ELSE 'deprecated'
        END,
        updated_at = ?
    WHERE id = ?
  `).run(updatedAt, memoryId);
}

function insertAppendOnlyMemoryIndexRow(params: CreateAppendOnlyMemoryRecordParams): number {
  const { database, parsed, filePath, embedding, embeddingFailureReason } = params;
  const now = new Date().toISOString();
  const canonicalFilePath = getCanonicalPathKey(filePath);
  const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  const embeddingStatus = embedding
    ? (sqlite_vec_available() ? 'success' : 'pending')
    : 'pending';

  const result = database.prepare(`
    INSERT INTO memory_index (
      spec_folder,
      file_path,
      canonical_file_path,
      title,
      trigger_phrases,
      importance_weight,
      created_at,
      updated_at,
      embedding_model,
      embedding_generated_at,
      embedding_status,
      failure_reason,
      encoding_intent,
      document_type,
      spec_level,
      content_text,
      quality_score,
      quality_flags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    parsed.specFolder,
    filePath,
    canonicalFilePath,
    parsed.title,
    JSON.stringify(parsed.triggerPhrases),
    importanceWeight,
    now,
    now,
    embeddingsProvider.getModelName(),
    embedding ? now : null,
    embeddingStatus,
    embeddingFailureReason,
    encodingIntent ?? 'document',
    parsed.documentType || 'memory',
    specLevel,
    parsed.content,
    parsed.qualityScore ?? 0,
    JSON.stringify(parsed.qualityFlags ?? []),
  );

  const memoryId = Number(result.lastInsertRowid);
  applyPostInsertMetadata(database, memoryId, {
    content_hash: parsed.contentHash,
    context_type: parsed.contextType,
    importance_tier: parsed.importanceTier,
    memory_type: parsed.memoryType,
    type_inference_source: parsed.memoryTypeSource,
    encoding_intent: encodingIntent,
    document_type: parsed.documentType || 'memory',
    spec_level: specLevel,
    quality_score: parsed.qualityScore ?? 0,
    quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
  });

  if (embedding && sqlite_vec_available()) {
    const expectedDim = get_embedding_dim();
    if (embedding.length !== expectedDim) {
      throw new Error(`Embedding must be ${expectedDim} dimensions, got ${embedding.length}`);
    }

    database.prepare(`
      INSERT INTO vec_memories (rowid, embedding)
      VALUES (?, ?)
    `).run(BigInt(memoryId), to_embedding_buffer(embedding));
  }

  if (bm25Index.isBm25Enabled()) {
    try {
      bm25Index.getIndex().addDocument(String(memoryId), bm25Index.buildBm25DocumentText({
        title: parsed.title,
        content_text: parsed.content,
        trigger_phrases: parsed.triggerPhrases,
        file_path: filePath,
      }));
    } catch (error: unknown) {
      logger.warn(`BM25 index update failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
  } catch (error: unknown) {
    logger.warn(`History record failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
  }

  refresh_interference_scores_for_folder(database, parsed.specFolder);
  return memoryId;
}

// R1: Shared early-return helper for lineage functions.
function getExistingLineageTransition(
  database: Database.Database,
  memoryId: number,
): RecordedLineageTransition | null {
  const existing = getLineageRow(database, memoryId);
  if (existing) {
    return {
      logicalKey: existing.logical_key,
      versionNumber: existing.version_number,
      rootMemoryId: existing.root_memory_id,
      activeMemoryId: existing.memory_id,
      predecessorMemoryId: existing.predecessor_memory_id,
      transitionEvent: existing.transition_event,
    };
  }
  return null;
}

/**
 * Validates transition input combinations before persisting.
 * Rejects invalid event/predecessor pairings and backwards timestamps.
 */
function validateTransitionInput(
  transitionEvent: string,
  predecessorMemoryId: number | null,
  validFrom: string,
  predecessor: LineageRow | null,
): void {
  if (transitionEvent === 'CREATE' && predecessorMemoryId != null) {
    throw new Error(`E_LINEAGE: CREATE transition must not specify a predecessor (got ${predecessorMemoryId})`);
  }
  if (transitionEvent === 'SUPERSEDE' && predecessorMemoryId == null) {
    throw new Error('E_LINEAGE: SUPERSEDE transition requires a predecessor');
  }
  // M6 FIX: Compare timestamps as numeric epoch values, not raw strings,
  // to handle non-ISO strings and timezone-offset variants correctly.
  if (predecessor && new Date(validFrom).getTime() < new Date(predecessor.valid_from).getTime()) {
    throw new Error(
      `E_LINEAGE: valid_from (${validFrom}) is earlier than predecessor valid_from (${predecessor.valid_from})`,
    );
  }
}

/**
 * Seed lineage state from an existing memory row when no lineage entry exists yet.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version to seed into lineage tables.
 * @param options - Optional actor, timestamps, and transition metadata.
 * @returns Seeded lineage state for the requested memory version.
 */
export function seedLineageFromCurrentState(
  database: Database.Database,
  memoryId: number,
  options: RecordLineageTransitionOptions = {},
): RecordedLineageTransition {
  bindHistory(database);
  ensureLineageTables(database);

  const cached = getExistingLineageTransition(database, memoryId);
  if (cached) return cached;

  const row = getMemoryRow(database, memoryId);
  const logicalKey = buildLogicalKey(row);
  const actor = options.actor ?? 'system';
  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
  const validFrom = options.validFrom
    ?? historyEvents[0]?.timestamp
    ?? normalizeTimestamp(row.created_at ?? row.updated_at);

  const seedTx = database.transaction(() => {
    database.prepare(`
      INSERT INTO memory_lineage (
        memory_id,
        logical_key,
        version_number,
        root_memory_id,
        predecessor_memory_id,
        superseded_by_memory_id,
        valid_from,
        valid_to,
        transition_event,
        actor,
        metadata
      ) VALUES (?, ?, 1, ?, NULL, NULL, ?, NULL, ?, ?, ?)
    `).run(
      memoryId,
      logicalKey,
      memoryId,
      validFrom,
      options.transitionEvent ?? 'BACKFILL',
      actor,
      buildMetadata(row, actor, historyEvents),
    );

    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
  });

  seedTx();

  return {
    logicalKey,
    versionNumber: 1,
    rootMemoryId: memoryId,
    activeMemoryId: memoryId,
    predecessorMemoryId: null,
    transitionEvent: options.transitionEvent ?? 'BACKFILL',
  };
}

/**
 * Seed or append a lineage transition for a memory version.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version being recorded.
 * @param options - Transition details such as predecessor and actor.
 * @returns Recorded lineage state for the requested memory version.
 */
export function recordLineageTransition(
  database: Database.Database,
  memoryId: number,
  options: RecordLineageTransitionOptions = {},
): RecordedLineageTransition {
  bindHistory(database);
  ensureLineageTables(database);

  const cached = getExistingLineageTransition(database, memoryId);
  if (cached) return cached;

  for (let attempt = 0; attempt <= MAX_LINEAGE_VERSION_RETRIES; attempt += 1) {
    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
    const recordTransitionTx = database.transaction(() => {
      const row = getMemoryRow(database, memoryId);
      const rowLogicalKey = buildLogicalKey(row);
      const actor = options.actor ?? 'system';
      const transitionEvent = options.transitionEvent ?? 'CREATE';
      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
      const predecessorMemoryId = options.predecessorMemoryId ?? null;
      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);

      let logicalKey = rowLogicalKey;
      let rootMemoryId = memoryId;
      let versionNumber = 1;
      let predecessor: LineageRow | null = null;

      if (predecessorMemoryId != null) {
        predecessor = getLineageRow(database, predecessorMemoryId);
        if (predecessor) {
          if (predecessor.logical_key !== rowLogicalKey) {
            throw new Error(
              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
            );
          }
          logicalKey = predecessor.logical_key;
          rootMemoryId = predecessor.root_memory_id;
          versionNumber = predecessor.version_number + 1;
        } else {
          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
            actor,
            transitionEvent: 'BACKFILL',
          });
          if (seeded.logicalKey !== rowLogicalKey) {
            throw new Error(
              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
            );
          }
          logicalKey = seeded.logicalKey;
          rootMemoryId = seeded.rootMemoryId;
          versionNumber = seeded.versionNumber + 1;
          predecessor = getLineageRow(database, predecessorMemoryId);
        }
      }

      if (attempt > 0) {
        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
        if (latest) {
          rootMemoryId = latest.root_memory_id;
          versionNumber = latest.version_number + 1;
        }
      }

      validateTransitionInput(transitionEvent, predecessorMemoryId, validFrom, predecessor);

      if (predecessorMemoryId != null) {
        if (predecessor && predecessor.valid_to) {
          logger.warn(
            `Predecessor ${predecessorMemoryId} already superseded (valid_to: ${predecessor.valid_to}). ` +
            'COALESCE will preserve the existing valid_to.',
          );
        }
        database.prepare(`
          UPDATE memory_lineage
          SET valid_to = COALESCE(valid_to, ?),
              superseded_by_memory_id = COALESCE(superseded_by_memory_id, ?)
          WHERE memory_id = ?
        `).run(validFrom, memoryId, predecessorMemoryId);
        markHistoricalPredecessor(database, predecessorMemoryId, validFrom);
      }

      database.prepare(`
        INSERT INTO memory_lineage (
          memory_id,
          logical_key,
          version_number,
          root_memory_id,
          predecessor_memory_id,
          superseded_by_memory_id,
          valid_from,
          valid_to,
          transition_event,
          actor,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '60,130p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts | sed -n '80,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    80	  'important',
    81	  'normal',
    82	  'temporary',
    83	  'deprecated',
    84	]);
    85	
    86	const relationEnum = z.enum([
    87	  'caused',
    88	  'enabled',
    89	  'supersedes',
    90	  'contradicts',
    91	  'derived_from',
    92	  'supports',
    93	]);
    94	
    95	/* ───────────────────────────────────────────────────────────────
    96	   5. SCHEMA DEFINITIONS
    97	──────────────────────────────────────────────────────────────── */
    98	
    99	const memoryContextSchema = getSchema({
   100	  input: z.string().min(1),
   101	  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
   102	  intent: intentEnum.optional(),
   103	  specFolder: optionalPathString(),
   104	  tenantId: z.string().optional(),
   105	  userId: z.string().optional(),
   106	  agentId: z.string().optional(),
   107	  sharedSpaceId: z.string().optional(),
   108	  limit: positiveIntMax(100).optional(),
   109	  sessionId: z.string().optional(),
   110	  enableDedup: z.boolean().optional(),
   111	  includeContent: z.boolean().optional(),
   112	  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
   113	  tokenUsage: boundedNumber(0, 1).optional(),
   114	  anchors: optionalStringArray,
   115	  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
   116	});
   117	
   118	const memorySearchSchema = getSchema({
   119	  cursor: z.string().min(1).optional(),
   120	  query: z.string().min(2).max(1000).optional(),
   121	  concepts: z.array(z.string().min(1)).min(2).max(5).optional(),
   122	  specFolder: optionalPathString(),
   123	  tenantId: z.string().optional(),
   124	  userId: z.string().optional(),
   125	  agentId: z.string().optional(),
   126	  sharedSpaceId: z.string().optional(),
   127	  limit: positiveIntMax(100).optional(),
   128	  sessionId: z.string().optional(),
   129	  enableDedup: z.boolean().optional(),
   130	  tier: importanceTierEnum.optional(),
   131	  contextType: z.string().optional(),
   132	  useDecay: z.boolean().optional(),
   133	  includeContiguity: z.boolean().optional(),
   134	  includeConstitutional: z.boolean().optional(),
   135	  enableSessionBoost: z.boolean().optional(),
   136	  enableCausalBoost: z.boolean().optional(),
   137	  includeContent: z.boolean().optional(),
   138	  anchors: optionalStringArray,
   139	  min_quality_score: boundedNumber(0, 1).optional(),
   140	  minQualityScore: boundedNumber(0, 1).optional(),
   141	  bypassCache: z.boolean().optional(),
   142	  rerank: z.boolean().optional(),
   143	  applyLengthPenalty: z.boolean().optional(),
   144	  applyStateLimits: z.boolean().optional(),
   145	  minState: z.enum(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']).optional(),
   146	  intent: intentEnum.optional(),
   147	  autoDetectIntent: z.boolean().optional(),
   148	  trackAccess: z.boolean().optional(),
   149	  includeArchived: z.boolean().optional(),
   150	  mode: z.enum(['auto', 'deep']).optional(),
   151	  includeTrace: z.boolean().optional(),
   152	  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
   153	});
   154	
   155	// E3: Simplified search schema — 3 params only
   156	const memoryQuickSearchSchema = getSchema({
   157	  query: z.string().min(2).max(1000),
   158	  limit: positiveIntMax(100).optional(),
   159	  specFolder: optionalPathString(),
   160	  tenantId: z.string().optional(),
   161	  userId: z.string().optional(),
   162	  agentId: z.string().optional(),
   163	  sharedSpaceId: z.string().optional(),
   164	});
   165	
   166	const memoryMatchTriggersSchema = getSchema({
   167	  prompt: z.string().min(1),
   168	  specFolder: optionalPathString(),
   169	  tenantId: z.string().optional(),
   170	  userId: z.string().optional(),
   171	  agentId: z.string().optional(),
   172	  sharedSpaceId: z.string().optional(),
   173	  limit: positiveIntMax(100).optional(),
   174	  session_id: z.string().optional(),
   175	  turnNumber: safeNumericPreprocess.pipe(z.number().int().min(1)).optional(),
   176	  include_cognitive: z.boolean().optional(),
   177	});
   178	
   179	const memorySaveSchema = getSchema({
   180	  filePath: pathString(1),
   181	  force: z.boolean().optional(),
   182	  dryRun: z.boolean().optional(),
   183	  skipPreflight: z.boolean().optional(),
   184	  asyncEmbedding: z.boolean().optional(),
   185	  // Governance args — accepted by tool-schemas.ts tool definition and
   186	  // validated at runtime by scope-governance.ts (F3.04 fix).
   187	  tenantId: z.string().optional(),
   188	  userId: z.string().optional(),
   189	  agentId: z.string().optional(),
   190	  sessionId: z.string().optional(),
   191	  sharedSpaceId: z.string().optional(),
   192	  provenanceSource: z.string().optional(),
   193	  provenanceActor: z.string().optional(),
   194	  governedAt: z.string().optional(),
   195	  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
   196	  deleteAfter: z.string().optional(),
   197	});
   198	
   199	// Discriminated delete: branch 1 requires `id` (single-record delete).
   200	// Branch 2 requires `specFolder` + `confirm: true` (bulk folder delete).
   201	// Codex fix: `confirm` accepts only `true` (not `false`) in both branches
   202	// To prevent semantically meaningless `confirm: false` from passing validation.
   203	const memoryDeleteSchema = getSchema({
   204	  id: positiveInt.optional().describe('Memory ID to delete (required unless specFolder + confirm provided for bulk)'),
   205	  specFolder: optionalPathString().describe('Spec folder scope for bulk delete (requires confirm: true)'),
   206	  confirm: z.boolean().optional().describe('Must be true for spec-folder bulk delete'),
   207	});
   208	
   209	const memoryUpdateSchema = getSchema({
   210	  id: positiveInt,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Mutation Ledger
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Transaction wrappers on mutation handlers
     5	// Append-only audit trail for all memory mutations
     6	// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
     7	import { createHash } from 'crypto';
     8	import type Database from 'better-sqlite3';
     9	import { runInTransaction } from './transaction-manager.js';
    10	
    11	/* ───────────────────────────────────────────────────────────────
    12	   1. TYPES
    13	----------------------------------------------------------------*/
    14	
    15	type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
    16	
    17	interface MutationLedgerEntry {
    18	  id: number;
    19	  timestamp: string;
    20	  mutation_type: MutationType;
    21	  reason: string;
    22	  prior_hash: string | null;
    23	  new_hash: string;
    24	  linked_memory_ids: string; // JSON array
    25	  decision_meta: string;     // JSON object
    26	  actor: string;
    27	  session_id: string | null;
    28	}
    29	
    30	interface AppendEntryInput {
    31	  mutation_type: MutationType;
    32	  reason: string;
    33	  prior_hash: string | null;
    34	  new_hash: string;
    35	  linked_memory_ids: number[];
    36	  decision_meta: Record<string, unknown>;
    37	  actor: string;
    38	  session_id?: string | null;
    39	}
    40	
    41	interface GetEntriesOptions {
    42	  mutation_type?: MutationType;
    43	  actor?: string;
    44	  session_id?: string;
    45	  since?: string;    // ISO timestamp
    46	  until?: string;    // ISO timestamp
    47	  limit?: number;
    48	  offset?: number;
    49	}
    50	
    51	interface DivergenceReconcilePolicy {
    52	  normalizedPath: string;
    53	  attemptsSoFar: number;
    54	  nextAttempt: number;
    55	  maxRetries: number;
    56	  shouldRetry: boolean;
    57	  exhausted: boolean;
    58	}
    59	
    60	interface DivergenceEscalationPayload {
    61	  code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED';
    62	  normalizedPath: string;
    63	  attempts: number;
    64	  maxRetries: number;
    65	  recommendation: 'manual_triage_required';
    66	  reason: string;
    67	  variants: string[];
    68	}
    69	
    70	interface RecordDivergenceReconcileInput {
    71	  normalizedPath: string;
    72	  variants?: string[];
    73	  actor?: string;
    74	  session_id?: string | null;
    75	  maxRetries?: number;
    76	}
    77	
    78	interface RecordDivergenceReconcileResult {
    79	  policy: DivergenceReconcilePolicy;
    80	  retryEntryId: number | null;
    81	  escalationEntryId: number | null;
    82	  escalation: DivergenceEscalationPayload | null;
    83	}
    84	
    85	/* ───────────────────────────────────────────────────────────────
    86	   2. SCHEMA SQL
    87	----------------------------------------------------------------*/
    88	
    89	const LEDGER_SCHEMA_SQL = `
    90	  CREATE TABLE IF NOT EXISTS mutation_ledger (
    91	    id INTEGER PRIMARY KEY AUTOINCREMENT,
    92	    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    93	    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
    94	    reason TEXT NOT NULL,
    95	    prior_hash TEXT,
    96	    new_hash TEXT NOT NULL,
    97	    linked_memory_ids TEXT NOT NULL DEFAULT '[]',
    98	    decision_meta TEXT NOT NULL DEFAULT '{}',
    99	    actor TEXT NOT NULL,
   100	    session_id TEXT
   101	  )
   102	`;
   103	
   104	const LEDGER_INDEX_SQL = `
   105	  CREATE INDEX IF NOT EXISTS idx_ledger_type ON mutation_ledger(mutation_type);
   106	  CREATE INDEX IF NOT EXISTS idx_ledger_actor ON mutation_ledger(actor);
   107	  CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON mutation_ledger(timestamp);
   108	  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);
   109	  CREATE INDEX IF NOT EXISTS idx_ledger_memory_type_created_at ON mutation_ledger(
   110	    CAST(json_extract(linked_memory_ids, '$[0]') AS INTEGER),
   111	    mutation_type,
   112	    timestamp
   113	  )
   114	`;
   115	
   116	const LEDGER_TRIGGER_SQL = `
   117	  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
   118	  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
   119	  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
   120	  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
   121	`;
   122	
   123	/* ───────────────────────────────────────────────────────────────
   124	   3. INITIALIZATION
   125	----------------------------------------------------------------*/
   126	
   127	function initLedger(db: Database.Database): void {
   128	  db.exec(LEDGER_SCHEMA_SQL);
   129	  db.exec(LEDGER_INDEX_SQL);
   130	  db.exec(LEDGER_TRIGGER_SQL);
   131	}
   132	
   133	/* ───────────────────────────────────────────────────────────────
   134	   4. HASH COMPUTATION
   135	----------------------------------------------------------------*/
   136	
   137	function computeHash(content: string): string {
   138	  return createHash('sha256').update(content, 'utf8').digest('hex');
   139	}
   140	
   141	/* ───────────────────────────────────────────────────────────────
   142	   5. APPEND ENTRY
   143	----------------------------------------------------------------*/
   144	
   145	function appendEntry(db: Database.Database, entry: AppendEntryInput): MutationLedgerEntry {
   146	  const linkedJson = JSON.stringify(entry.linked_memory_ids);
   147	  const metaJson = JSON.stringify(entry.decision_meta);
   148	
   149	  const stmt = db.prepare(`
   150	    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
   151	    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
   152	  `);
   153	
   154	  const result = stmt.run(
   155	    entry.mutation_type,
   156	    entry.reason,
   157	    entry.prior_hash,
   158	    entry.new_hash,
   159	    linkedJson,
   160	    metaJson,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '400,740p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	function upsertActiveProjection(
   401	  database: Database.Database,
   402	  logicalKey: string,
   403	  rootMemoryId: number,
   404	  activeMemoryId: number,
   405	  updatedAt: string,
   406	): void {
   407	  // Evict any stale projection row that maps a *different* logical_key to the
   408	  // same active_memory_id — prevents UNIQUE constraint violation on re-index
   409	  // when the logical_key changes (e.g. anchor or path normalization drift).
   410	  database.prepare(
   411	    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
   412	  ).run(activeMemoryId, logicalKey);
   413	  database.prepare(`
   414	    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
   415	    VALUES (?, ?, ?, ?)
   416	    ON CONFLICT(logical_key) DO UPDATE SET
   417	      root_memory_id = excluded.root_memory_id,
   418	      active_memory_id = excluded.active_memory_id,
   419	      updated_at = excluded.updated_at
   420	  `).run(logicalKey, rootMemoryId, activeMemoryId, updatedAt);
   421	}
   422	
   423	function bindHistory(database: Database.Database): void {
   424	  if (typeof (database as Database.Database & { exec?: unknown }).exec === 'function') {
   425	    initHistory(database);
   426	  }
   427	}
   428	
   429	function markHistoricalPredecessor(database: Database.Database, memoryId: number, updatedAt: string): void {
   430	  database.prepare(`
   431	    UPDATE memory_index
   432	    SET importance_tier = CASE
   433	          WHEN importance_tier = 'constitutional' THEN importance_tier
   434	          ELSE 'deprecated'
   435	        END,
   436	        updated_at = ?
   437	    WHERE id = ?
   438	  `).run(updatedAt, memoryId);
   439	}
   440	
   441	function insertAppendOnlyMemoryIndexRow(params: CreateAppendOnlyMemoryRecordParams): number {
   442	  const { database, parsed, filePath, embedding, embeddingFailureReason } = params;
   443	  const now = new Date().toISOString();
   444	  const canonicalFilePath = getCanonicalPathKey(filePath);
   445	  const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
   446	  const specLevel = isSpecDocumentType(parsed.documentType)
   447	    ? detectSpecLevelFromParsed(filePath)
   448	    : null;
   449	  const encodingIntent = isEncodingIntentEnabled()
   450	    ? classifyEncodingIntent(parsed.content)
   451	    : undefined;
   452	  const embeddingStatus = embedding
   453	    ? (sqlite_vec_available() ? 'success' : 'pending')
   454	    : 'pending';
   455	
   456	  const result = database.prepare(`
   457	    INSERT INTO memory_index (
   458	      spec_folder,
   459	      file_path,
   460	      canonical_file_path,
   461	      title,
   462	      trigger_phrases,
   463	      importance_weight,
   464	      created_at,
   465	      updated_at,
   466	      embedding_model,
   467	      embedding_generated_at,
   468	      embedding_status,
   469	      failure_reason,
   470	      encoding_intent,
   471	      document_type,
   472	      spec_level,
   473	      content_text,
   474	      quality_score,
   475	      quality_flags
   476	    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   477	  `).run(
   478	    parsed.specFolder,
   479	    filePath,
   480	    canonicalFilePath,
   481	    parsed.title,
   482	    JSON.stringify(parsed.triggerPhrases),
   483	    importanceWeight,
   484	    now,
   485	    now,
   486	    embeddingsProvider.getModelName(),
   487	    embedding ? now : null,
   488	    embeddingStatus,
   489	    embeddingFailureReason,
   490	    encodingIntent ?? 'document',
   491	    parsed.documentType || 'memory',
   492	    specLevel,
   493	    parsed.content,
   494	    parsed.qualityScore ?? 0,
   495	    JSON.stringify(parsed.qualityFlags ?? []),
   496	  );
   497	
   498	  const memoryId = Number(result.lastInsertRowid);
   499	  applyPostInsertMetadata(database, memoryId, {
   500	    content_hash: parsed.contentHash,
   501	    context_type: parsed.contextType,
   502	    importance_tier: parsed.importanceTier,
   503	    memory_type: parsed.memoryType,
   504	    type_inference_source: parsed.memoryTypeSource,
   505	    encoding_intent: encodingIntent,
   506	    document_type: parsed.documentType || 'memory',
   507	    spec_level: specLevel,
   508	    quality_score: parsed.qualityScore ?? 0,
   509	    quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
   510	  });
   511	
   512	  if (embedding && sqlite_vec_available()) {
   513	    const expectedDim = get_embedding_dim();
   514	    if (embedding.length !== expectedDim) {
   515	      throw new Error(`Embedding must be ${expectedDim} dimensions, got ${embedding.length}`);
   516	    }
   517	
   518	    database.prepare(`
   519	      INSERT INTO vec_memories (rowid, embedding)
   520	      VALUES (?, ?)
   521	    `).run(BigInt(memoryId), to_embedding_buffer(embedding));
   522	  }
   523	
   524	  if (bm25Index.isBm25Enabled()) {
   525	    try {
   526	      bm25Index.getIndex().addDocument(String(memoryId), bm25Index.buildBm25DocumentText({
   527	        title: parsed.title,
   528	        content_text: parsed.content,
   529	        trigger_phrases: parsed.triggerPhrases,
   530	        file_path: filePath,
   531	      }));
   532	    } catch (error: unknown) {
   533	      logger.warn(`BM25 index update failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
   534	    }
   535	  }
   536	
   537	  try {
   538	    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
   539	  } catch (error: unknown) {
   540	    logger.warn(`History record failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
   541	  }
   542	
   543	  refresh_interference_scores_for_folder(database, parsed.specFolder);
   544	  return memoryId;
   545	}
   546	
   547	// R1: Shared early-return helper for lineage functions.
   548	function getExistingLineageTransition(
   549	  database: Database.Database,
   550	  memoryId: number,
   551	): RecordedLineageTransition | null {
   552	  const existing = getLineageRow(database, memoryId);
   553	  if (existing) {
   554	    return {
   555	      logicalKey: existing.logical_key,
   556	      versionNumber: existing.version_number,
   557	      rootMemoryId: existing.root_memory_id,
   558	      activeMemoryId: existing.memory_id,
   559	      predecessorMemoryId: existing.predecessor_memory_id,
   560	      transitionEvent: existing.transition_event,
   561	    };
   562	  }
   563	  return null;
   564	}
   565	
   566	/**
   567	 * Validates transition input combinations before persisting.
   568	 * Rejects invalid event/predecessor pairings and backwards timestamps.
   569	 */
   570	function validateTransitionInput(
   571	  transitionEvent: string,
   572	  predecessorMemoryId: number | null,
   573	  validFrom: string,
   574	  predecessor: LineageRow | null,
   575	): void {
   576	  if (transitionEvent === 'CREATE' && predecessorMemoryId != null) {
   577	    throw new Error(`E_LINEAGE: CREATE transition must not specify a predecessor (got ${predecessorMemoryId})`);
   578	  }
   579	  if (transitionEvent === 'SUPERSEDE' && predecessorMemoryId == null) {
   580	    throw new Error('E_LINEAGE: SUPERSEDE transition requires a predecessor');
   581	  }
   582	  // M6 FIX: Compare timestamps as numeric epoch values, not raw strings,
   583	  // to handle non-ISO strings and timezone-offset variants correctly.
   584	  if (predecessor && new Date(validFrom).getTime() < new Date(predecessor.valid_from).getTime()) {
   585	    throw new Error(
   586	      `E_LINEAGE: valid_from (${validFrom}) is earlier than predecessor valid_from (${predecessor.valid_from})`,
   587	    );
   588	  }
   589	}
   590	
   591	/**
   592	 * Seed lineage state from an existing memory row when no lineage entry exists yet.
   593	 *
   594	 * @param database - Database connection that stores lineage state.
   595	 * @param memoryId - Memory version to seed into lineage tables.
   596	 * @param options - Optional actor, timestamps, and transition metadata.
   597	 * @returns Seeded lineage state for the requested memory version.
   598	 */
   599	export function seedLineageFromCurrentState(
   600	  database: Database.Database,
   601	  memoryId: number,
   602	  options: RecordLineageTransitionOptions = {},
   603	): RecordedLineageTransition {
   604	  bindHistory(database);
   605	  ensureLineageTables(database);
   606	
   607	  const cached = getExistingLineageTransition(database, memoryId);
   608	  if (cached) return cached;
   609	
   610	  const row = getMemoryRow(database, memoryId);
   611	  const logicalKey = buildLogicalKey(row);
   612	  const actor = options.actor ?? 'system';
   613	  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
   614	  const validFrom = options.validFrom
   615	    ?? historyEvents[0]?.timestamp
   616	    ?? normalizeTimestamp(row.created_at ?? row.updated_at);
   617	
   618	  const seedTx = database.transaction(() => {
   619	    database.prepare(`
   620	      INSERT INTO memory_lineage (
   621	        memory_id,
   622	        logical_key,
   623	        version_number,
   624	        root_memory_id,
   625	        predecessor_memory_id,
   626	        superseded_by_memory_id,
   627	        valid_from,
   628	        valid_to,
   629	        transition_event,
   630	        actor,
   631	        metadata
   632	      ) VALUES (?, ?, 1, ?, NULL, NULL, ?, NULL, ?, ?, ?)
   633	    `).run(
   634	      memoryId,
   635	      logicalKey,
   636	      memoryId,
   637	      validFrom,
   638	      options.transitionEvent ?? 'BACKFILL',
   639	      actor,
   640	      buildMetadata(row, actor, historyEvents),
   641	    );
   642	
   643	    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
   644	  });
   645	
   646	  seedTx();
   647	
   648	  return {
   649	    logicalKey,
   650	    versionNumber: 1,
   651	    rootMemoryId: memoryId,
   652	    activeMemoryId: memoryId,
   653	    predecessorMemoryId: null,
   654	    transitionEvent: options.transitionEvent ?? 'BACKFILL',
   655	  };
   656	}
   657	
   658	/**
   659	 * Seed or append a lineage transition for a memory version.
   660	 *
   661	 * @param database - Database connection that stores lineage state.
   662	 * @param memoryId - Memory version being recorded.
   663	 * @param options - Transition details such as predecessor and actor.
   664	 * @returns Recorded lineage state for the requested memory version.
   665	 */
   666	export function recordLineageTransition(
   667	  database: Database.Database,
   668	  memoryId: number,
   669	  options: RecordLineageTransitionOptions = {},
   670	): RecordedLineageTransition {
   671	  bindHistory(database);
   672	  ensureLineageTables(database);
   673	
   674	  const cached = getExistingLineageTransition(database, memoryId);
   675	  if (cached) return cached;
   676	
   677	  for (let attempt = 0; attempt <= MAX_LINEAGE_VERSION_RETRIES; attempt += 1) {
   678	    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
   679	    const recordTransitionTx = database.transaction(() => {
   680	      const row = getMemoryRow(database, memoryId);
   681	      const rowLogicalKey = buildLogicalKey(row);
   682	      const actor = options.actor ?? 'system';
   683	      const transitionEvent = options.transitionEvent ?? 'CREATE';
   684	      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
   685	      const predecessorMemoryId = options.predecessorMemoryId ?? null;
   686	      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);
   687	
   688	      let logicalKey = rowLogicalKey;
   689	      let rootMemoryId = memoryId;
   690	      let versionNumber = 1;
   691	      let predecessor: LineageRow | null = null;
   692	
   693	      if (predecessorMemoryId != null) {
   694	        predecessor = getLineageRow(database, predecessorMemoryId);
   695	        if (predecessor) {
   696	          if (predecessor.logical_key !== rowLogicalKey) {
   697	            throw new Error(
   698	              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
   699	              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
   700	            );
   701	          }
   702	          logicalKey = predecessor.logical_key;
   703	          rootMemoryId = predecessor.root_memory_id;
   704	          versionNumber = predecessor.version_number + 1;
   705	        } else {
   706	          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
   707	            actor,
   708	            transitionEvent: 'BACKFILL',
   709	          });
   710	          if (seeded.logicalKey !== rowLogicalKey) {
   711	            throw new Error(
   712	              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
   713	              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
   714	            );
   715	          }
   716	          logicalKey = seeded.logicalKey;
   717	          rootMemoryId = seeded.rootMemoryId;
   718	          versionNumber = seeded.versionNumber + 1;
   719	          predecessor = getLineageRow(database, predecessorMemoryId);
   720	        }
   721	      }
   722	
   723	      if (attempt > 0) {
   724	        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
   725	        if (latest) {
   726	          rootMemoryId = latest.root_memory_id;
   727	          versionNumber = latest.version_number + 1;
   728	        }
   729	      }
   730	
   731	      validateTransitionInput(transitionEvent, predecessorMemoryId, validFrom, predecessor);
   732	
   733	      if (predecessorMemoryId != null) {
   734	        if (predecessor && predecessor.valid_to) {
   735	          logger.warn(
   736	            `Predecessor ${predecessorMemoryId} already superseded (valid_to: ${predecessor.valid_to}). ` +
   737	            'COALESCE will preserve the existing valid_to.',
   738	          );
   739	        }
   740	        database.prepare(`

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Patterns

This folder contains task-specific guidance — the things you would tell your agent if you were sitting next to it. Not generic instructions. Project-specific accumulated wisdom.

## How patterns get created

**During setup:** After the context/ files are populated, the agent generates starter patterns based on the project's actual stack, architecture, and conventions. These are stack-specific — a Flask API project gets different patterns than a React SPA or a CLI tool.

**Over time:** You or your agent add patterns as they emerge from real work — when something breaks, when a task has a non-obvious gotcha, when you've explained the same thing twice.

## What belongs here

A pattern file is worth creating when:
- A task type is common in this project and has a repeatable workflow
- There are integration gotchas between components that aren't obvious from code
- Something broke and you want to prevent it from breaking the same way again
- A verify checklist specific to one type of task would catch mistakes early

## When to skip a pattern

Default to generating a pattern. Only skip if:
- The exact same guidance is already in `context/conventions.md` with concrete examples
- The task truly has no project-specific gotchas (e.g. "how to write a for loop")

If in doubt, generate the pattern. A pattern that turns out to be obvious costs nothing. A missing pattern costs a broken codebase.

## Format

### Single-task pattern (one file = one task)

```markdown
---
name: [pattern-name]
description: [one line — what this pattern covers and when to use it]
triggers:
  - "[keyword that should trigger loading this file]"
edges:
  - target: "[related file path, e.g. context/conventions.md]"
    condition: "[when to follow this edge]"
last_updated: [YYYY-MM-DD]
---

# [Pattern Name]

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
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
```

### Multi-section pattern (one file = multiple related tasks)

Use this when tasks share context but differ in steps. Each task gets its own
`## Task: ...` heading with sub-sections. The Context section is shared at the top.

```markdown
---
name: [pattern-name]
description: [one line — what this pattern file covers]
triggers:
  - "[keyword]"
edges:
  - target: "[related file path]"
    condition: "[when to follow this edge]"
last_updated: [YYYY-MM-DD]
---

# [Pattern Name]

## Context
[Shared context for all tasks in this file]

## Task: [First Task Name]

### Steps
[...]

### Gotchas
[...]

### Verify
[...]

## Task: [Second Task Name]

### Steps
[...]

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
- [ ] Update any `.mex/context/` files that are now out of date
- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
```

Do NOT combine unrelated tasks into one file just to reduce file count.
Only group tasks that genuinely share context.

## How many patterns to generate

Do not use a fixed number. Generate one pattern per:
- Each major task type a developer does repeatedly in this project
- Each external dependency with non-obvious integration gotchas
- Each major failure boundary in the architecture flow

For a simple project this may be 3-4 files. For a complex project this may be 10-15.
Do not cap based on a number — cap based on whether the pattern adds real value.

## Pattern categories

Walk through each category below. For each one, check the relevant context files
and generate patterns for everything that applies to this project.

### Category 1 — Common task patterns

The repeatable tasks in this project. What does a developer do most often?

Derive from: `context/architecture.md` (what are the major components?) and
`context/conventions.md` (what patterns exist for extending them?)

Examples by project type:
- API: "add new endpoint", "add new model/entity", "add auth to a route"
- Frontend: "add new page/route", "add new component", "add form with validation"
- CLI: "add new command", "add new flag/option"
- Pipeline: "add new pipeline stage", "add new data source"
- SaaS: "add payment flow", "add user-facing feature", "add admin operation"

### Category 2 — Integration patterns

How to work with the external dependencies in this project.

Every entry in `context/stack.md` "Key Libraries" or `context/architecture.md`
"External Dependencies" that has non-obvious setup, gotchas, or failure modes
deserves a pattern. These are the most dangerous areas — the agent will
confidently write integration code that looks right but misses project-specific
configuration, error handling, or rate limiting.

Examples: "calling the payments API", "running database migrations",
"adding a new third-party service client", "configuring auth provider"

### Category 3 — Debug/diagnosis patterns

When something breaks, where do you look?

Derive from the architecture flow — each boundary between components is a
potential failure point. One debug pattern per major boundary.

Examples: "debug webhook failures", "debug pipeline stage failures",
"diagnose auth/permission issues", "debug background job failures"

### Category 4 — Deploy/release patterns

Only generate if `context/setup.md` reveals non-trivial deployment.

Examples: "deploy to staging", "rollback a release", "update environment config",
"run database migration in production"

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Patterns
     2	
     3	This folder contains task-specific guidance — the things you would tell your agent if you were sitting next to it. Not generic instructions. Project-specific accumulated wisdom.
     4	
     5	## How patterns get created
     6	
     7	**During setup:** After the context/ files are populated, the agent generates starter patterns based on the project's actual stack, architecture, and conventions. These are stack-specific — a Flask API project gets different patterns than a React SPA or a CLI tool.
     8	
     9	**Over time:** You or your agent add patterns as they emerge from real work — when something breaks, when a task has a non-obvious gotcha, when you've explained the same thing twice.
    10	
    11	## What belongs here
    12	
    13	A pattern file is worth creating when:
    14	- A task type is common in this project and has a repeatable workflow
    15	- There are integration gotchas between components that aren't obvious from code
    16	- Something broke and you want to prevent it from breaking the same way again
    17	- A verify checklist specific to one type of task would catch mistakes early
    18	
    19	## When to skip a pattern
    20	
    21	Default to generating a pattern. Only skip if:
    22	- The exact same guidance is already in `context/conventions.md` with concrete examples
    23	- The task truly has no project-specific gotchas (e.g. "how to write a for loop")
    24	
    25	If in doubt, generate the pattern. A pattern that turns out to be obvious costs nothing. A missing pattern costs a broken codebase.
    26	
    27	## Format
    28	
    29	### Single-task pattern (one file = one task)
    30	
    31	```markdown
    32	---
    33	name: [pattern-name]
    34	description: [one line — what this pattern covers and when to use it]
    35	triggers:
    36	  - "[keyword that should trigger loading this file]"
    37	edges:
    38	  - target: "[related file path, e.g. context/conventions.md]"
    39	    condition: "[when to follow this edge]"
    40	last_updated: [YYYY-MM-DD]
    41	---
    42	
    43	# [Pattern Name]
    44	
    45	## Context
    46	[What to load or know before starting this task type]
    47	
    48	## Steps
    49	[The workflow — what to do, in what order]
    50	
    51	## Gotchas
    52	[The things that go wrong. What to watch out for.]
    53	
    54	## Verify
    55	[Checklist to run after completing this task type]
    56	
    57	## Debug
    58	[What to check when this task type breaks]
    59	
    60	## Update Scaffold
    61	- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
    62	- [ ] Update any `.mex/context/` files that are now out of date
    63	- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
    64	```
    65	
    66	### Multi-section pattern (one file = multiple related tasks)
    67	
    68	Use this when tasks share context but differ in steps. Each task gets its own
    69	`## Task: ...` heading with sub-sections. The Context section is shared at the top.
    70	
    71	```markdown
    72	---
    73	name: [pattern-name]
    74	description: [one line — what this pattern file covers]
    75	triggers:
    76	  - "[keyword]"
    77	edges:
    78	  - target: "[related file path]"
    79	    condition: "[when to follow this edge]"
    80	last_updated: [YYYY-MM-DD]
    81	---
    82	
    83	# [Pattern Name]
    84	
    85	## Context
    86	[Shared context for all tasks in this file]
    87	
    88	## Task: [First Task Name]
    89	
    90	### Steps
    91	[...]
    92	
    93	### Gotchas
    94	[...]
    95	
    96	### Verify
    97	[...]
    98	
    99	## Task: [Second Task Name]
   100	
   101	### Steps
   102	[...]
   103	
   104	## Update Scaffold
   105	- [ ] Update `.mex/ROUTER.md` "Current Project State" if what's working/not built has changed
   106	- [ ] Update any `.mex/context/` files that are now out of date
   107	- [ ] If this is a new task type without a pattern, create one in `.mex/patterns/` and add to `INDEX.md`
   108	```
   109	
   110	Do NOT combine unrelated tasks into one file just to reduce file count.
   111	Only group tasks that genuinely share context.
   112	
   113	## How many patterns to generate
   114	
   115	Do not use a fixed number. Generate one pattern per:
   116	- Each major task type a developer does repeatedly in this project
   117	- Each external dependency with non-obvious integration gotchas
   118	- Each major failure boundary in the architecture flow
   119	
   120	For a simple project this may be 3-4 files. For a complex project this may be 10-15.
   121	Do not cap based on a number — cap based on whether the pattern adds real value.
   122	
   123	## Pattern categories
   124	
   125	Walk through each category below. For each one, check the relevant context files
   126	and generate patterns for everything that applies to this project.
   127	
   128	### Category 1 — Common task patterns
   129	
   130	The repeatable tasks in this project. What does a developer do most often?
   131	
   132	Derive from: `context/architecture.md` (what are the major components?) and
   133	`context/conventions.md` (what patterns exist for extending them?)
   134	
   135	Examples by project type:
   136	- API: "add new endpoint", "add new model/entity", "add auth to a route"
   137	- Frontend: "add new page/route", "add new component", "add form with validation"
   138	- CLI: "add new command", "add new flag/option"
   139	- Pipeline: "add new pipeline stage", "add new data source"
   140	- SaaS: "add payment flow", "add user-facing feature", "add admin operation"
   141	
   142	### Category 2 — Integration patterns
   143	
   144	How to work with the external dependencies in this project.
   145	
   146	Every entry in `context/stack.md` "Key Libraries" or `context/architecture.md`
   147	"External Dependencies" that has non-obvious setup, gotchas, or failure modes
   148	deserves a pattern. These are the most dangerous areas — the agent will
   149	confidently write integration code that looks right but misses project-specific
   150	configuration, error handling, or rate limiting.
   151	
   152	Examples: "calling the payments API", "running database migrations",
   153	"adding a new third-party service client", "configuring auth provider"
   154	
   155	### Category 3 — Debug/diagnosis patterns
   156	
   157	When something breaks, where do you look?
   158	
   159	Derive from the architecture flow — each boundary between components is a
   160	potential failure point. One debug pattern per major boundary.
   161	
   162	Examples: "debug webhook failures", "debug pipeline stage failures",
   163	"diagnose auth/permission issues", "debug background job failures"
   164	
   165	### Category 4 — Deploy/release patterns
   166	
   167	Only generate if `context/setup.md` reveals non-trivial deployment.
   168	
   169	Examples: "deploy to staging", "rollback a release", "update environment config",
   170	"run database migration in production"

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

codex
I’ve finished the direct file tracing and I’m doing one semantic pass now to catch any adjacent source I might have missed around agent routing and safety. If it turns up anything real, I’ll fold it in; otherwise the report will stay grounded in the files already traced.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1998,2026p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

## Failures and how to do differently

- symptom: CLI audit flow stalls or fails fast; cause: unsupported `codex exec --ask-for-approval`; fix: use supported codex flags only and keep single-hop depth constraints in prompt text [Task 2]
- symptom: context retrieval path blocks audit setup; cause: `spec_kit_memory` handshake failure (`connection closed: initialize response`); fix: switch immediately to direct `rg`/`sed` context gathering instead of retry loops [Task 2]
- symptom: verification commands fail with filesystem permission errors under `/var/folders`; cause: default temp dir restrictions; fix: set `TMPDIR` to repo-owned `.tmp` before Vitest runs [Task 4]
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

## Reusable knowledge


codex
# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

## Findings
### Finding 1: Mex standardizes agent onboarding around one shared scaffold anchor
- **Source**: [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md) lines 3-16 and 44-50; [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts) lines 42-49; [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json) lines 1-4; [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md) lines 20-24 and 45-68
- **What it does**: Mex’s setup maps multiple tools to thin root-level adapters, but they all converge on the same scaffold contract. `TOOL_CONFIGS` routes Claude/Cursor/Windsurf/Copilot/OpenCode/Codex to small bootstrap files, while the actual behavior still comes from `.mex/AGENTS.md` and then `.mex/ROUTER.md`. OpenCode is the cleanest example: its config is just `{"instructions":[".mex/AGENTS.md"]}`.
- **Why it matters for us**: this is the strongest agent-agnostic integration pattern in Mex. It does not solve retrieval, but it does reduce prompt duplication across runtimes and keeps the “what every agent must load first” rule centralized. Compared with our current richer runtime-specific surfaces, Mex’s reusable idea is a thin adapter layer, not a better memory core.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Mex narrows agent scope during setup by forcing a synthesized brief before broad exploration
- **Source**: [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts) lines 196-217; [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts) lines 20-51; [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts) lines 153-176
- **What it does**: for non-fresh projects, setup runs a scanner that builds a compact `ScannerBrief` from manifest, entry points, folder tree, tooling, and README, then passes a prompt telling the agent not to explore the filesystem for basic structure and to reason from the brief instead. It only permits targeted file reads when implementation detail is needed.
- **Why it matters for us**: this is a useful project-scoping pattern for agent work. It turns “figure out the repo” into “start from a bounded evidence packet,” which is exactly where our `memory_context` plus code-graph/CocoIndex stack is already stronger. The Mex contribution is the discipline of making the brief authoritative for first-pass orientation.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Mex’s sync flow is a surgical repair generator, not a generic “rewrite docs” loop
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts) lines 60-106 and 136-149; [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts) lines 18-23, 41-97, and 99-157; [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts) lines 45-52
- **What it does**: Mex groups drift issues by file, excludes warning-only files unless requested, then builds a per-file brief containing the issue list, current file contents, nearby filesystem listings for missing paths, and a small git diff over claimed paths. The generated prompt repeatedly tells the agent to change only what is necessary.
- **Why it matters for us**: this is the clearest reusable pattern from the agent-integration angle. We do not currently have a comparable file-targeted repair brief for doc/memory hygiene. For Spec Kit Memory, this would fit as an advisory “claim-hygiene sync” surface around markdown/spec drift, without touching retrieval or lineage.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mex has almost no real multi-agent safety beyond prompts telling one agent to behave
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts) lines 18-25 and 144-149; [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md) lines 58-68; [external/patterns/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md) lines 7-10; [system-spec-kit/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts) lines 99-197; [system-spec-kit/mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts) lines 4-6 and 89-121; [system-spec-kit/lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts) lines 400-420 and 666-740
- **What it does**: Mex sync spawns one interactive `claude` session and sends all target files in one pass. Its coordination model is prompt-level: ROUTER says “follow this loop,” patterns say “update scaffold,” but there is no ownership model, lock, actor identity, or append-only mutation record for concurrent edits.
- **Why it matters for us**: this is where Mex is materially weaker than Spec Kit Memory. Our system already has actor/session/governance fields, append-only mutation logging, and lineage/projection state. Mex is useful for static drift detection, but its coordination model should not be imported into our multi-agent workflows.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mex’s “passive capture” is really passive drift nudging, not passive knowledge capture
- **Source**: [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts) lines 8-24 and 41-63; [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md) lines 64-68; [system-spec-kit/generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js) lines 68-128
- **What it does**: `mex watch` installs a post-commit hook that runs `check --quiet` and only prints output when the drift score is imperfect. That is passive health feedback. It does not capture tool calls, user exchanges, pre/postflight learning, or task outcomes; Mex still relies on the agent to update scaffold files after the task.
- **Why it matters for us**: this is an important boundary. Mex does not offer passive memory ingestion comparable to our JSON-primary `generate-context.js` path. The reusable slice is a warn-only commit-time documentation hygiene nudge, not a replacement for explicit session capture.
- **Recommendation**: prototype later
- **Impact**: medium

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


hook: Stop
hook: Stop Completed
tokens used
227,107
# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

## Findings
### Finding 1: Mex standardizes agent onboarding around one shared scaffold anchor
- **Source**: [external/.tool-configs/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/README.md) lines 3-16 and 44-50; [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts) lines 42-49; [external/.tool-configs/opencode.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/opencode.json) lines 1-4; [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md) lines 20-24 and 45-68
- **What it does**: Mex’s setup maps multiple tools to thin root-level adapters, but they all converge on the same scaffold contract. `TOOL_CONFIGS` routes Claude/Cursor/Windsurf/Copilot/OpenCode/Codex to small bootstrap files, while the actual behavior still comes from `.mex/AGENTS.md` and then `.mex/ROUTER.md`. OpenCode is the cleanest example: its config is just `{"instructions":[".mex/AGENTS.md"]}`.
- **Why it matters for us**: this is the strongest agent-agnostic integration pattern in Mex. It does not solve retrieval, but it does reduce prompt duplication across runtimes and keeps the “what every agent must load first” rule centralized. Compared with our current richer runtime-specific surfaces, Mex’s reusable idea is a thin adapter layer, not a better memory core.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Mex narrows agent scope during setup by forcing a synthesized brief before broad exploration
- **Source**: [external/src/setup/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts) lines 196-217; [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts) lines 20-51; [external/src/setup/prompts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts) lines 153-176
- **What it does**: for non-fresh projects, setup runs a scanner that builds a compact `ScannerBrief` from manifest, entry points, folder tree, tooling, and README, then passes a prompt telling the agent not to explore the filesystem for basic structure and to reason from the brief instead. It only permits targeted file reads when implementation detail is needed.
- **Why it matters for us**: this is a useful project-scoping pattern for agent work. It turns “figure out the repo” into “start from a bounded evidence packet,” which is exactly where our `memory_context` plus code-graph/CocoIndex stack is already stronger. The Mex contribution is the discipline of making the brief authoritative for first-pass orientation.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Mex’s sync flow is a surgical repair generator, not a generic “rewrite docs” loop
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts) lines 60-106 and 136-149; [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts) lines 18-23, 41-97, and 99-157; [external/src/git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts) lines 45-52
- **What it does**: Mex groups drift issues by file, excludes warning-only files unless requested, then builds a per-file brief containing the issue list, current file contents, nearby filesystem listings for missing paths, and a small git diff over claimed paths. The generated prompt repeatedly tells the agent to change only what is necessary.
- **Why it matters for us**: this is the clearest reusable pattern from the agent-integration angle. We do not currently have a comparable file-targeted repair brief for doc/memory hygiene. For Spec Kit Memory, this would fit as an advisory “claim-hygiene sync” surface around markdown/spec drift, without touching retrieval or lineage.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mex has almost no real multi-agent safety beyond prompts telling one agent to behave
- **Source**: [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts) lines 18-25 and 144-149; [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md) lines 58-68; [external/patterns/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md) lines 7-10; [system-spec-kit/tool-input-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts) lines 99-197; [system-spec-kit/mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts) lines 4-6 and 89-121; [system-spec-kit/lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts) lines 400-420 and 666-740
- **What it does**: Mex sync spawns one interactive `claude` session and sends all target files in one pass. Its coordination model is prompt-level: ROUTER says “follow this loop,” patterns say “update scaffold,” but there is no ownership model, lock, actor identity, or append-only mutation record for concurrent edits.
- **Why it matters for us**: this is where Mex is materially weaker than Spec Kit Memory. Our system already has actor/session/governance fields, append-only mutation logging, and lineage/projection state. Mex is useful for static drift detection, but its coordination model should not be imported into our multi-agent workflows.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mex’s “passive capture” is really passive drift nudging, not passive knowledge capture
- **Source**: [external/src/watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts) lines 8-24 and 41-63; [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md) lines 64-68; [system-spec-kit/generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js) lines 68-128
- **What it does**: `mex watch` installs a post-commit hook that runs `check --quiet` and only prints output when the drift score is imperfect. That is passive health feedback. It does not capture tool calls, user exchanges, pre/postflight learning, or task outcomes; Mex still relies on the agent to update scaffold files after the task.
- **Why it matters for us**: this is an important boundary. Mex does not offer passive memory ingestion comparable to our JSON-primary `generate-context.js` path. The reusable slice is a warn-only commit-time documentation hygiene nudge, not a replacement for explicit session capture.
- **Recommendation**: prototype later
- **Impact**: medium

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
