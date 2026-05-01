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
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

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
I’m treating this as a read-only deep-research pass over the Mex source and our memory stack, focused specifically on hygiene gaps and overlaps around triggers, causal links, and health tooling. I’ll first do a lightweight memory pass for prior Mex context, then trace the actual implementation files in `external/` and the corresponding Spec Kit Memory surfaces before synthesizing only the new comparison findings.
exec
/bin/zsh -lc 'pwd && test -d /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && echo external_ok' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
external_ok

exec
/bin/zsh -lc 'rg -n "mex|causal|trigger|health|hygiene" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external -name AGENTS.md -o -name CLAUDE.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md

 succeeded in 0ms:
25:- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
165:- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]
173:- trigger phrase filtering should block short folder-like numeric shorthands while preserving longer numeric authored phrases like `014 code graph upgrades runtime` [Task 1]
174:- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
180:- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
181:- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
798:- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]
847:- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
851:- symptom: `session_health` remains `not_primed`; cause: no session id reached `recordToolCall()` for Codex flows; fix: derive tracking id via `resolveSessionTrackingId` with `CODEX_THREAD_ID` fallback [Task 2]
1203:- /spec_kit:deep-research --review, 20 iterations, evidenceGap, handler-memory-triggers.vitest.ts, FEATURE_CATALOG.md
1457:## Task 2: Restore/verify Phase 016 runtime/docs (dedup, projectPhase, trigger filter, retry health, contextType)
1503:- Phase 016 regression checks should include trigger filter export coverage, retry-health snapshot behavior, contextType passthrough, and pre-save dedup docs/tests [Task 2]
1577:scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
1590:## Task 2: Remove temp-root auto-delete from memory health autoRepair
1598:- memory_health autoRepair confirmed, temp_fixture_memory_cleanup, orphanedFiles warning, EXT-H15
1628:- checkDatabaseUpdated, E021, createMCPErrorResponse, memory_list, memory_stats, memory_health, requestId
1638:- clampStrength, isFiniteNumber, NaN/infinite rejection, memory_causal_link, causal edges
1652:- Pre-query guard failures should be wrapped in MCP envelope `E021` before handler query execution so transport contracts stay stable across `memory_list`, `memory_stats`, and `memory_health` [Task 5]
1653:- Use shared `clampStrength` + finite-number checks for causal-edge strength writes instead of ad-hoc `Math.max/Math.min` clamps [Task 6]
1859:- requireDbOrThrow, learning-stats-filters.vitest.ts, integration-causal-graph, memory_health autoRepair, verifyIntegrity autoClean, tmp orphan cleanup
1918:- `memory_health` cleanup runbook: back up DB first, clean temp-path rows/vector orphans transactionally, then re-run integrity checks and report post-clean stats [Task 2]

codex
I’ve got the prior context and the external repo location confirmed. Next I’m tracing the hygiene-specific code paths on both sides: Mex’s drift/checker stack and our causal-link, trigger, and health handlers, so the comparison stays implementation-grounded rather than README-driven.
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
/bin/zsh -lc 'rg -n "memory_health|memory-causal|causal_link|memory_causal|trigger" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:26:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:93:  triggerCacheCleared: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:268:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:24:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:158:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:171:    console.warn('[memory-triggers] getTieredContent failed', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:243:  // Eval logger — capture trigger query at entry (fail-safe)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:249:      intent: 'trigger_match',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:263:          scores: memoryIds.map(() => 1.0), // trigger matches are binary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:264:          fusionMethod: 'trigger',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:269:      /* eval logging must never break triggers handler */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:288:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:289:  let results: TriggerMatch[] = triggerMatchResult.matches;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:329:  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:330:    ? triggerMatchResult.stats.signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:339:        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:450:        triggerPhrases: r.matchedPhrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:510:  const _triggersResponse = createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:514:      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:524:      triggerSignals: detectedSignals,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:529:  // Consumption instrumentation — log triggers event (fail-safe, never throws)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:536:        event_type: 'triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:546:  // Eval logger — capture final trigger results at exit (fail-safe)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:547:  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:548:  logFinalTriggerEval(triggerMemoryIds, latencyMs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:550:  return _triggersResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:160:| Layer 2 | Content Quality | Weighted signal density across 5 dimensions (title 0.25, triggers 0.20, length 0.20, anchors 0.15, metadata 0.20). Threshold: 0.4 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:175:| `scoreTriggerQuality(triggerPhrases)` | Layer 2 dimension: trigger phrase quality (0-1) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:258:  triggerPhrases: ['architecture', 'sqlite'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:185:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:200:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:271:          trigger_phrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:8:// - Layer 2: Content quality scoring (title, triggers, length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:38:  triggerQuality: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:82:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:123:  triggerQuality: 0.20,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:286: * If in-memory state is empty, first trigger the lazy DB load path. Only when no
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:487: * Score trigger phrase quality (0-1).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:489: * @param triggerPhrases - Array of trigger phrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:492:export function scoreTriggerQuality(triggerPhrases: string[]): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:493:  const count = triggerPhrases.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:552:  const hasTriggers = /^trigger[_-]?phrases?\s*:/m.test(frontmatter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:571:  trigger_phrases?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:580:  if ((Array.isArray(row.trigger_phrases) ? row.trigger_phrases.length : (row.trigger_phrases?.trim().length ?? 0)) > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:605:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:610:    triggerQuality: scoreTriggerQuality(params.triggerPhrases ?? []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:637:    if (dimensions.triggerQuality === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:638:      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:777:            triggerQuality: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:812:    triggerPhrases: params.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:59:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:138:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:147:      trigger_phrases: args.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:195:            triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:248:                  triggerPhrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:281:                      trigger_phrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:291:                      triggerPhrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:155:| `reasons` | `string[]` | Human-readable list of matched patterns that triggered a block |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:170:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:40:  trigger_phrases: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:139:    trigger_phrases: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:145:  const persistedTriggerPhrases = parseJsonStringArray(existing.trigger_phrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:146:  if (!areEquivalentStringArrays(persistedTriggerPhrases, parsed.triggerPhrases)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:235:      triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:300:        triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:168:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:321:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:335:    triggerPhrases: result.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:417:      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:29: * structured fields (title, trigger_phrases, context_type, etc.), so
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:42:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:66:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:23:  triggerId: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:50:/** Statistics about a trigger matching operation */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:146:    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:148:    console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:158:let triggerCache: TriggerCacheEntry[] | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:159:let triggerCandidateIndex: Map<string, Set<number>> | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:162:const triggerCacheLoaderStatementByConnection = new WeakMap<Database.Database, Database.Statement>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:177:  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:180:    AND trigger_phrases IS NOT NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:181:    AND trigger_phrases != '[]'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:182:    AND trigger_phrases != ''
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:187:  const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:193:  triggerCacheLoaderStatementByConnection.set(database, statement);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:272:  if (!triggerCandidateIndex) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:273:    triggerCandidateIndex = new Map();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:278:    const indexedIds = triggerCandidateIndex.get(key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:280:      indexedIds.add(entry.triggerId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:284:    triggerCandidateIndex.set(key, new Set([entry.triggerId]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:306:/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:342:  if (triggerCache && (now - cacheTimestamp) < CONFIG.CACHE_TTL_MS) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:343:    return triggerCache;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:349:    // Because trigger-matcher may be the first module to access the database in the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:357:      console.warn('[trigger-matcher] Database not initialized. Server may still be starting up.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:366:      trigger_phrases: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:371:    triggerCache = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:372:    triggerCandidateIndex = new Map();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:377:        phrases = JSON.parse(row.trigger_phrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:405:          triggerId: triggerCache.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:415:        triggerCache.push(entry);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:429:    return triggerCache;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:432:    console.warn(`[trigger-matcher] Cache load failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:443:/** Clear the trigger cache (useful for testing or after updates) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:445:  triggerCache = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:446:  triggerCandidateIndex = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:455:    size: triggerCache ? triggerCache.length : 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:683:  logExecutionTime('match_trigger_phrases', elapsed, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:732:  if (cache.length === 0 || !triggerCandidateIndex || triggerCandidateIndex.size === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:743:    const indexedIds = triggerCandidateIndex.get(key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:748:    for (const triggerId of indexedIds) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:749:      candidateIds.add(triggerId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:759:    .map((triggerId) => cache[triggerId])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:763:/** Get memories by trigger phrase */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:787:/** Refresh trigger cache (forces reload on next access) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:3:description: "Markdown parsing, trigger matching, and content normalization for memory and spec-document ingestion."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:6:  - "trigger matcher"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:24:`lib/parsing/` turns markdown files into structured inputs for save, search, and trigger flows. The directory contains three focused modules:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:27:- `trigger-matcher.ts` for cached phrase matching against surfaced memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:38:| `trigger-matcher.ts` | Fast cached trigger matching with Unicode normalization, stats, and debug hooks |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:46:- `trigger-matcher.ts` owns the trigger cache, cache stats, memory lookups by phrase, and word-boundary-aware matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:250:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:49:    triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:85:  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:155:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:159:            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:160:          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:208:          triggerPhrases: updateParams.triggerPhrases ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:249:      latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:51:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:253:  const triggerPhrases = extractTriggerPhrases(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:265:    triggerPhrases: triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:269:  // Extract causal_links for relationship tracking (CHK-231)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:276:    triggerPhrases: triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:543:  const triggers: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:547:  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:555:          triggers.push(cleaned);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:562:  if (triggers.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:567:      if (/^\s*(?:triggerPhrases|trigger_phrases):\s*$/i.test(line)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:579:          if (phrase.length > 0 && phrase.length < 100 && !/^-+$/.test(phrase) && !triggers.includes(phrase)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:580:            triggers.push(phrase);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:599:        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:600:          triggers.push(phrase);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:606:  return triggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:675: * Extract causal_links from memory content YAML metadata block (T126)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:686:  // Find the causal_links block in YAML metadata
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:66:type MemoryTriggersModule = typeof import('./memory-triggers.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:110:    memoryTriggersModule = loadHandlerModule<MemoryTriggersModule>('memory-triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:224:// Memory triggers handlers

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external && rg --files | rg '"'^(README|ROUTER|SETUP|SYNC|src/cli|src/drift|src/scanner|src/sync|src/pattern|src/types)'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server && rg --files handlers lib | rg '(memory-triggers|memory-crud|memory-parser|trigger-matcher|causal|health)'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
src/scanner/readme.ts
src/scanner/index.ts
src/scanner/manifest.ts
src/scanner/entry-points.ts
src/scanner/tooling.ts
src/scanner/folder-tree.ts
src/sync/index.ts
src/sync/brief-builder.ts
src/pattern/index.ts
src/types.ts
src/drift/frontmatter.ts
src/drift/index.ts
src/drift/scoring.ts
src/drift/claims.ts
src/drift/checkers/index-sync.ts
src/drift/checkers/command.ts
src/drift/checkers/script-coverage.ts
src/drift/checkers/edges.ts
src/drift/checkers/cross-file.ts
src/drift/checkers/dependency.ts
src/drift/checkers/path.ts
src/drift/checkers/staleness.ts
src/cli.ts
SYNC.md
README.md
ROUTER.md
SETUP.md

 succeeded in 0ms:
handlers/memory-crud-types.ts
handlers/memory-triggers.ts
handlers/memory-crud.ts
handlers/memory-crud-delete.ts
handlers/memory-crud-update.ts
handlers/memory-crud-list.ts
handlers/session-health.ts
handlers/memory-crud-health.ts
handlers/causal-links-processor.ts
handlers/causal-graph.ts
handlers/memory-crud-stats.ts
handlers/memory-crud-utils.ts
lib/parsing/trigger-matcher.ts
lib/parsing/memory-parser.ts
lib/storage/causal-edges.ts
lib/search/causal-boost.ts

codex
I’ve narrowed the comparison surface. The most promising angle so far is that Mex treats hygiene as a static “claims versus reality” problem, while our system treats it more as retrieval-state integrity and scoped runtime safety; I’m pulling the exact checker and handler logic now so we can separate those cleanly.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'for f in path edges index-sync staleness command dependency cross-file script-coverage; do echo "=== $f ==="; nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/$f.ts | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
=== path ===
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
=== edges ===
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
=== index-sync ===
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
=== staleness ===
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
=== command ===
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
=== dependency ===
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
=== cross-file ===
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
=== script-coverage ===
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '180,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   531	    const db = attentionDecay.getDb();
   532	    if (db) {
   533	      initConsumptionLog(db);
   534	      const resultIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
   535	      logConsumptionEvent(db, {
   536	        event_type: 'triggers',
   537	        query_text: prompt,
   538	        result_count: formattedResults.length,
   539	        result_ids: resultIds,
   540	        session_id: sessionId ?? null,
   541	        latency_ms: latencyMs,
   542	      });
   543	    }
   544	  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
   545	
   546	  // Eval logger — capture final trigger results at exit (fail-safe)
   547	  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
   548	  logFinalTriggerEval(triggerMemoryIds, latencyMs);
   549	
   550	  return _triggersResponse;
   551	}
   552	
   553	/* ───────────────────────────────────────────────────────────────
   554	   4. EXPORTS
   555	──────────────────────────────────────────────────────────────── */
   556	
   557	export {
   558	  handleMemoryMatchTriggers,
   559	};
   560	
   561	// Backward-compatible aliases (snake_case)
   562	const handle_memory_match_triggers = handleMemoryMatchTriggers;
   563	
   564	export {
   565	  handle_memory_match_triggers,
   566	};

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Causal Edges
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Causal edge creation (memory_causal_link)
     5	// Causal relationship graph for memory lineage
     6	import type Database from 'better-sqlite3';
     7	import { clearDegreeCacheForDb } from '../search/graph-search-fn.js';
     8	import { clearGraphSignalsCache } from '../graph/graph-signals.js';
     9	import { detectContradictions } from '../graph/contradiction-detection.js';
    10	import { ensureTemporalColumns } from '../graph/temporal-edges.js';
    11	import { isTemporalEdgesEnabled } from '../search/search-flags.js';
    12	import { runInTransaction } from './transaction-manager.js';
    13	
    14	/* ───────────────────────────────────────────────────────────────
    15	   1. CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	const RELATION_TYPES = Object.freeze({
    19	  CAUSED: 'caused',
    20	  ENABLED: 'enabled',
    21	  SUPERSEDES: 'supersedes',
    22	  CONTRADICTS: 'contradicts',
    23	  DERIVED_FROM: 'derived_from',
    24	  SUPPORTS: 'supports',
    25	} as const);
    26	
    27	type RelationType = typeof RELATION_TYPES[keyof typeof RELATION_TYPES];
    28	
    29	/**
    30	 * C138: Relation weight multipliers applied during traversal scoring.
    31	 * Higher values amplify the propagated strength; values < 1.0 dampen it.
    32	 */
    33	const RELATION_WEIGHTS: Record<string, number> = {
    34	  supersedes:   1.5,  // Strongest signal — new info replaces old
    35	  caused:       1.3,  // Strong causal link
    36	  enabled:      1.1,  // Weak causal link
    37	  supports:     1.0,  // Neutral / default
    38	  derived_from: 1.0,  // Neutral / default
    39	  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
    40	};
    41	
    42	const DEFAULT_MAX_DEPTH = 3;
    43	const MAX_EDGES_LIMIT = 100;
    44	
    45	// Edge bounds for the lightweight runtime path (NFR-R01, SC-005)
    46	const MAX_EDGES_PER_NODE = 20;
    47	const MAX_AUTO_STRENGTH = 0.5;
    48	const MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05;
    49	const STALENESS_THRESHOLD_DAYS = 90;
    50	const DECAY_STRENGTH_AMOUNT = 0.1;
    51	const DECAY_PERIOD_DAYS = 30;
    52	
    53	function isFiniteNumber(value: unknown): value is number {
    54	  return typeof value === 'number' && Number.isFinite(value);
    55	}
    56	
    57	function clampStrength(strength: number): number | null {
    58	  if (!Number.isFinite(strength)) return null;
    59	  return Math.max(0, Math.min(1, strength));
    60	}
    61	
    62	/* ───────────────────────────────────────────────────────────────
    63	   2. INTERFACES
    64	----------------------------------------------------------------*/
    65	
    66	interface CausalEdge {
    67	  id: number;
    68	  source_id: string;
    69	  target_id: string;
    70	  relation: RelationType;
    71	  strength: number;
    72	  evidence: string | null;
    73	  extracted_at: string;
    74	  created_by: string;
    75	  last_accessed: string | null;
    76	}
    77	
    78	type EdgeQueryResult = CausalEdge[] & {
    79	  truncated: boolean;
    80	  limit: number;
    81	};
    82	
    83	interface WeightHistoryEntry {
    84	  id: number;
    85	  edge_id: number;
    86	  old_strength: number;
    87	  new_strength: number;
    88	  changed_by: string;
    89	  changed_at: string;
    90	  reason: string | null;
    91	}
    92	
    93	interface GraphStats {
    94	  totalEdges: number;
    95	  byRelation: Record<string, number>;
    96	  avgStrength: number;
    97	  uniqueSources: number;
    98	  uniqueTargets: number;
    99	}
   100	
   101	interface CausalChainNode {
   102	  id: string;
   103	  edgeId?: number;          // T202: causal_edges.id for unlink workflow
   104	  depth: number;
   105	  relation: RelationType;
   106	  strength: number;
   107	  children: CausalChainNode[];
   108	  truncated?: boolean;
   109	  truncationLimit?: number | null;
   110	}
   111	
   112	/* ───────────────────────────────────────────────────────────────
   113	   3. MODULE STATE
   114	----------------------------------------------------------------*/
   115	
   116	let db: Database.Database | null = null;
   117	
   118	function invalidateDegreeCache(): void {
   119	  try {
   120	    // H1 FIX: Use db-specific cache invalidation instead of the no-op global version
   121	    if (db) {
   122	      clearDegreeCacheForDb(db);
   123	    }
   124	  } catch (_error: unknown) {
   125	    // Cache invalidation is best-effort; never block edge mutations
   126	  }
   127	  try {
   128	    clearGraphSignalsCache();
   129	  } catch (_error: unknown) {
   130	    // Graph signals cache invalidation is best-effort
   131	  }
   132	}
   133	
   134	/* ───────────────────────────────────────────────────────────────
   135	   4. INITIALIZATION
   136	----------------------------------------------------------------*/
   137	
   138	function init(database: Database.Database): void {
   139	  db = database;
   140	
   141	  // Defensive traversal indexes — the canonical creation lives in
   142	  // Vector-index-impl.ts migration v8 (CHK-062).  These IF NOT EXISTS guards
   143	  // Ensure the indexes are present even when the module is initialised outside
   144	  // The normal migration path (e.g. tests, standalone scripts).
   145	  try {
   146	    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
   147	    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
   148	    ensureTemporalColumns(database);
   149	  } catch (_e: unknown) {
   150	    // Best-effort: table may not exist yet during early startup sequencing
   151	  }
   152	}
   153	
   154	/* ───────────────────────────────────────────────────────────────
   155	   5. EDGE OPERATIONS
   156	----------------------------------------------------------------*/
   157	
   158	function insertEdge(
   159	  sourceId: string,
   160	  targetId: string,
   161	  relation: RelationType,
   162	  strength: number = 1.0,
   163	  evidence: string | null = null,
   164	  shouldInvalidateCache: boolean = true,
   165	  createdBy: string = 'manual',
   166	): number | null {
   167	  if (!db) {
   168	    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
   169	    return null;
   170	  }
   171	  const database = db;
   172	
   173	  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
   174	  const effectiveStrength = createdBy === 'auto'
   175	    ? Math.min(strength, MAX_AUTO_STRENGTH)
   176	    : strength;
   177	
   178	  // Prevent self-loops
   179	  if (sourceId === targetId) {
   180	    return null;
   181	  }
   182	
   183	  // Fix #26 (FK check) deferred — test environments use synthetic IDs not in memory_index.
   184	  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.
   185	
   186	  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
   187	  if (createdBy === 'auto') {
   188	    const edgeCount = countEdgesForNode(sourceId);
   189	    if (edgeCount >= MAX_EDGES_PER_NODE) {
   190	      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
   191	      return null;
   192	    }
   193	  }
   194	
   195	  try {
   196	    const clampedStrength = clampStrength(effectiveStrength);
   197	    if (clampedStrength === null) {
   198	      console.warn('[causal-edges] insertEdge rejected non-finite strength');
   199	      return null;
   200	    }
   201	
   202	    // Wrap SELECT + UPSERT + logWeightChange in a transaction for atomicity
   203	    const rowId = database.transaction(() => {
   204	      if (isTemporalEdgesEnabled()) {
   205	        detectContradictions(
   206	          database,
   207	          Number.parseInt(sourceId, 10),
   208	          Number.parseInt(targetId, 10),
   209	          relation,
   210	        );
   211	      }
   212	
   213	      // Check if edge exists (for weight_history logging on conflict update).
   214	      // This SELECT is intentional: we need the old strength to decide whether
   215	      // To write a weight_history row after the upsert. The subsequent INSERT
   216	      // Uses last_insert_rowid() to avoid a second post-upsert SELECT.
   217	      const existing = (database.prepare(`
   218	        SELECT id, strength FROM causal_edges
   219	        WHERE source_id = ? AND target_id = ? AND relation = ?
   220	      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number; strength: number } | undefined;
   221	
   222	      (database.prepare(`
   223	        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
   224	        VALUES (?, ?, ?, ?, ?, ?)
   225	        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
   226	          strength = excluded.strength,
   227	          evidence = COALESCE(excluded.evidence, causal_edges.evidence)
   228	      `) as Database.Statement).run(sourceId, targetId, relation, clampedStrength, evidence, createdBy);
   229	
   230	      const row = (database.prepare(`
   231	        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
   232	      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number } | undefined;
   233	      const rowId = row ? row.id : 0;
   234	
   235	      // T001d: Log weight change on conflict update
   236	      if (existing && rowId && isFiniteNumber(existing.strength) && existing.strength !== clampedStrength) {
   237	        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
   238	      }
   239	
   240	      return rowId;
   241	    })();
   242	
   243	    if (shouldInvalidateCache) {
   244	      invalidateDegreeCache();
   245	    }
   246	
   247	    return rowId || null;
   248	  } catch (error: unknown) {
   249	    const msg = error instanceof Error ? error.message : String(error);
   250	    console.warn(`[causal-edges] insertEdge error: ${msg}`);
   251	    if (/SQLITE_BUSY|SQLITE_LOCKED|database is locked/i.test(msg)) {
   252	      throw error;
   253	    }
   254	    return null;
   255	  }
   256	}
   257	
   258	function insertEdgesBatch(
   259	  edges: Array<{
   260	    sourceId: string;
   261	    targetId: string;
   262	    relation: RelationType;
   263	    strength?: number;
   264	    evidence?: string | null;
   265	    createdBy?: string;
   266	  }>
   267	): { inserted: number; failed: number } {
   268	  if (!db) return { inserted: 0, failed: edges.length };
   269	
   270	  let inserted = 0;
   271	  let failed = 0;
   272	
   273	  const insertTx = db.transaction(() => {
   274	    for (const edge of edges) {
   275	      const id = insertEdge(
   276	        edge.sourceId,
   277	        edge.targetId,
   278	        edge.relation,
   279	        edge.strength ?? 1.0,
   280	        edge.evidence ?? null,
   281	        false,
   282	        edge.createdBy ?? 'manual',
   283	      );
   284	      if (id !== null) inserted++;
   285	      else failed++;
   286	    }
   287	  });
   288	
   289	  try {
   290	    insertTx();
   291	    if (inserted > 0) {
   292	      invalidateDegreeCache();
   293	    }
   294	  } catch (error: unknown) {
   295	    const msg = error instanceof Error ? error.message : String(error);
   296	    console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
   297	  }
   298	
   299	  return { inserted, failed };
   300	}
   301	
   302	function bulkInsertEdges(edges: Array<Record<string, unknown>>): { inserted: number; failed: number } {
   303	  if (!db) return { inserted: 0, failed: edges.length };
   304	
   305	  const database = db;
   306	  let inserted = 0;
   307	  let failed = 0;
   308	
   309	  try {
   310	    const edgeColumns = (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
   311	      .map((column) => column.name)
   312	      .filter((name) => typeof name === 'string' && name.length > 0 && name !== 'id');
   313	
   314	    if (edgeColumns.length === 0) {
   315	      return { inserted: 0, failed: edges.length };
   316	    }
   317	
   318	    const insertEdgeStmt = database.prepare(`
   319	      INSERT OR IGNORE INTO causal_edges (${edgeColumns.join(', ')})
   320	      VALUES (${edgeColumns.map(() => '?').join(', ')})

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | sed -n '520,780p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	  const featureHeading = body.match(/^###\s+(?:FEATURE|BUGFIX|DECISION|IMPLEMENTATION|RESEARCH|OBSERVATION):\s+(.+)$/im);
   521	  contextualCandidates.push(normalizeExtractedTitle(featureHeading?.[1] || ''));
   522	
   523	  const summaryLine = body.match(/\*\*Summary:\*\*\s*(.+)$/im);
   524	  contextualCandidates.push(normalizeExtractedTitle(summaryLine?.[1] || ''));
   525	
   526	  const overviewSection = body.match(/##\s+\d+\.\s+OVERVIEW([\s\S]*?)(?:\n##\s+|\n<!--\s*\/ANCHOR:(?:summary|overview)\s*-->|$)/i);
   527	  contextualCandidates.push(getFirstMeaningfulLine(overviewSection?.[1] || ''));
   528	
   529	  const h2Match = body.match(/^##\s+(.+)$/m);
   530	  contextualCandidates.push(normalizeExtractedTitle(h2Match?.[1] || ''));
   531	
   532	  for (const candidate of contextualCandidates) {
   533	    if (candidate && !isGenericMemoryTitle(candidate)) {
   534	      return candidate;
   535	    }
   536	  }
   537	
   538	  return h1Title || null;
   539	}
   540	
   541	/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
   542	export function extractTriggerPhrases(content: string): string[] {
   543	  const triggers: string[] = [];
   544	  const frontmatter = extractFrontmatterBlock(content) ?? '';
   545	
   546	  // Method 1a: Check YAML frontmatter inline format
   547	  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
   548	  if (inlineMatch) {
   549	    const arrayContent = inlineMatch[1];
   550	    const phrases = arrayContent.match(/["']([^"']+)["']/g);
   551	    if (phrases) {
   552	      phrases.forEach((p: string) => {
   553	        const cleaned = p.replace(/^["']|["']$/g, '').trim();
   554	        if (cleaned.length > 0 && cleaned.length < 100) {
   555	          triggers.push(cleaned);
   556	        }
   557	      });
   558	    }
   559	  }
   560	
   561	  // Method 1b: Check YAML frontmatter multi-line format
   562	  if (triggers.length === 0) {
   563	    const lines = frontmatter.split('\n');
   564	    let inTriggerBlock = false;
   565	
   566	    for (const line of lines) {
   567	      if (/^\s*(?:triggerPhrases|trigger_phrases):\s*$/i.test(line)) {
   568	        inTriggerBlock = true;
   569	        continue;
   570	      }
   571	
   572	      if (inTriggerBlock) {
   573	        if (/^---\s*$/.test(line)) {
   574	          break;
   575	        }
   576	        const itemMatch = line.match(/^\s*-\s*["']?([^"'\n#]+?)["']?\s*(?:#.*)?$/);
   577	        if (itemMatch) {
   578	          const phrase = itemMatch[1].trim();
   579	          if (phrase.length > 0 && phrase.length < 100 && !/^-+$/.test(phrase) && !triggers.includes(phrase)) {
   580	            triggers.push(phrase);
   581	          }
   582	        } else if (!/^\s*$/.test(line) && !/^\s*#/.test(line) && !/^\s+-/.test(line)) {
   583	          break;
   584	        }
   585	      }
   586	    }
   587	  }
   588	
   589	  // Method 2: Find ## Trigger Phrases section (fallback/additional)
   590	  const sectionMatch = content.match(/##\s*Trigger\s*Phrases?\s*\n([\s\S]*?)(?=\n##|\n---|\n\n\n|$)/i);
   591	
   592	  if (sectionMatch) {
   593	    const sectionContent = sectionMatch[1];
   594	    const bullets = sectionContent.match(/^[\s]*[-*]\s+(.+)$/gm);
   595	
   596	    if (bullets) {
   597	      bullets.forEach((line: string) => {
   598	        const phrase = line.replace(/^[\s]*[-*]\s+/, '').trim();
   599	        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
   600	          triggers.push(phrase);
   601	        }
   602	      });
   603	    }
   604	  }
   605	
   606	  return triggers;
   607	}
   608	
   609	/** Extract context type from metadata block */
   610	export function extractContextType(content: string): ContextType {
   611	  // Look for > Session type: or > Context type:
   612	  const match = content.match(/>\s*(?:Session|Context)\s*type:\s*(\w+)/i);
   613	
   614	  if (match) {
   615	    const type = match[1].toLowerCase();
   616	    return CONTEXT_TYPE_MAP[type] || 'general';
   617	  }
   618	
   619	  // Check YAML metadata block
   620	  const frontmatter = extractFrontmatterBlock(content);
   621	  const yamlMatch = frontmatter?.match(/(?:contextType|context_type):\s*["']?(\w+)["']?/i);
   622	  if (yamlMatch) {
   623	    return CONTEXT_TYPE_MAP[yamlMatch[1].toLowerCase()] || 'general';
   624	  }
   625	
   626	  return 'general';
   627	}
   628	
   629	/** Extract importance tier from content or metadata */
   630	export function extractImportanceTier(content: string, options: ExtractImportanceTierOptions = {}): string {
   631	  const { documentType = null, fallbackTier = null } = options;
   632	
   633	  // Strip HTML comments to avoid matching instructional examples
   634	  // (e.g., template comments containing "importanceTier: 'constitutional'" as documentation)
   635	  const contentWithoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
   636	  const frontmatter = extractFrontmatterBlock(contentWithoutComments);
   637	
   638	  // Check YAML metadata block (only in non-comment content)
   639	  const yamlMatch = frontmatter?.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
   640	  if (yamlMatch) {
   641	    const tier = yamlMatch[1].toLowerCase();
   642	    if (isValidTier(tier)) {
   643	      return normalizeTier(tier);
   644	    }
   645	  }
   646	
   647	  // Check for tier markers in content (only in non-comment content)
   648	  if (contentWithoutComments.includes('[CONSTITUTIONAL]') || contentWithoutComments.includes('importance: constitutional')) {
   649	    return 'constitutional';
   650	  }
   651	  if (contentWithoutComments.includes('[CRITICAL]') || contentWithoutComments.includes('importance: critical')) {
   652	    return 'critical';
   653	  }
   654	  if (contentWithoutComments.includes('[IMPORTANT]') || contentWithoutComments.includes('importance: important')) {
   655	    return 'important';
   656	  }
   657	
   658	  if (fallbackTier && isValidTier(fallbackTier)) {
   659	    return normalizeTier(fallbackTier);
   660	  }
   661	
   662	  if (documentType) {
   663	    return getDefaultTierForDocumentType(documentType);
   664	  }
   665	
   666	  return 'normal';
   667	}
   668	
   669	/** Compute SHA-256 hash of content for change detection */
   670	export function computeContentHash(content: string): string {
   671	  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
   672	}
   673	
   674	/**
   675	 * Extract causal_links from memory content YAML metadata block (T126)
   676	 */
   677	export function extractCausalLinks(content: string): CausalLinks {
   678	  const causalLinks: CausalLinks = {
   679	    caused_by: [],
   680	    supersedes: [],
   681	    derived_from: [],
   682	    blocks: [],
   683	    related_to: []
   684	  };
   685	
   686	  // Find the causal_links block in YAML metadata
   687	  const causalBlockMatch = content.match(/(?:^|\n)\s*causalLinks:\s*\n((?:\s+[a-z_]+:[\s\S]*?)*)(?=\n[a-z_]+:|\n```|\n---|\n\n|\n#|$)/i);
   688	
   689	  if (!causalBlockMatch) {
   690	    return causalLinks;
   691	  }
   692	
   693	  const block = causalBlockMatch[1];
   694	  const lines = block.split('\n');
   695	
   696	  let currentKey: keyof CausalLinks | null = null;
   697	
   698	  for (const line of lines) {
   699	    // Check for sub-key (e.g., "  caused_by:")
   700	    const keyMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*$/);
   701	    if (keyMatch) {
   702	      currentKey = keyMatch[1] as keyof CausalLinks;
   703	      continue;
   704	    }
   705	
   706	    // Check for inline array format
   707	    const inlineMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*\[(.*)\]\s*$/);
   708	    if (inlineMatch) {
   709	      currentKey = inlineMatch[1] as keyof CausalLinks;
   710	      const arrayContent = inlineMatch[2].trim();
   711	      if (arrayContent) {
   712	        const values = arrayContent.match(/["']([^"']+)["']/g);
   713	        if (values) {
   714	          values.forEach((v: string) => {
   715	            const cleaned = v.replace(/^["']|["']$/g, '').trim();
   716	            if (cleaned && currentKey && !causalLinks[currentKey].includes(cleaned)) {
   717	              causalLinks[currentKey].push(cleaned);
   718	            }
   719	          });
   720	        }
   721	      }
   722	      currentKey = null;
   723	      continue;
   724	    }
   725	
   726	    // Check for list item
   727	    if (currentKey) {
   728	      const itemMatch = line.match(/^\s+-\s*["']?([^"'\n]+?)["']?\s*$/);
   729	      if (itemMatch) {
   730	        const value = itemMatch[1].trim();
   731	        if (value && value !== '[]' && !causalLinks[currentKey].includes(value)) {
   732	          causalLinks[currentKey].push(value);
   733	        }
   734	      } else if (line.trim() && !line.match(/^\s*#/) && !line.match(/^\s+-/)) {
   735	        currentKey = null;
   736	      }
   737	    }
   738	  }
   739	
   740	  return causalLinks;
   741	}
   742	
   743	/**
   744	 * Check if causalLinks has any non-empty arrays
   745	 */
   746	export function hasCausalLinks(causalLinks: CausalLinks | null | undefined): boolean {
   747	  if (!causalLinks) return false;
   748	  return Object.values(causalLinks).some((arr: string[]) => Array.isArray(arr) && arr.length > 0);
   749	}
   750	
   751	// ───────────────────────────────────────────────────────────────
   752	// 4. VALIDATION FUNCTIONS
   753	
   754	// ───────────────────────────────────────────────────────────────
   755	/** Constitutional markdown basenames intentionally excluded from indexing */
   756	const EXCLUDED_CONSTITUTIONAL_BASENAMES = new Set(['readme.md', 'readme.txt']);
   757	
   758	function isMarkdownOrTextFile(filePath: string): boolean {
   759	  return /\.(md|txt)$/i.test(filePath);
   760	}
   761	
   762	/** Check if a file path is a valid memory file */
   763	export function isMemoryFile(filePath: string): boolean {
   764	  const normalizedPath = filePath.replace(/\\/g, '/');
   765	
   766	  // Standard memory files in specs
   767	  const isSpecsMemory = (
   768	    isMarkdownOrTextFile(normalizedPath) &&
   769	    normalizedPath.includes('/memory/') &&
   770	    normalizedPath.includes('/specs/')
   771	  );
   772	
   773	  // Spec folder documents (spec.md, plan.md, tasks.md, etc.).
   774	  const isSpecDocument = (
   775	    normalizedPath.endsWith('.md') &&
   776	    canClassifyAsSpecDocument(normalizedPath) &&
   777	    !isWorkingArtifactPath(normalizedPath) &&
   778	    SPEC_DOCUMENT_FILENAMES_SET.has(path.basename(normalizedPath).toLowerCase()) &&
   779	    matchesSpecDocumentPath(normalizedPath, path.basename(normalizedPath).toLowerCase())
   780	  );

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '320,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "memory_causal_link|memory_causal_stats|cleanupOrphanedEdges|detectContradictions|contradict" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:4:// Lightweight graph maintenance: contradiction scan, Hebbian
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:53:  contradictions: ContradictionCluster[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:63:/** Cosine similarity threshold for contradiction candidates */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:69:/** Negation keywords for lightweight contradiction heuristic */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:81: * Find potential contradictions by:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:123: * Vector-based contradiction scan using sqlite-vec cosine similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:185: * Heuristic-only contradiction scan when vector similarity is unavailable.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:238: * Check if two texts contain negation patterns suggesting contradiction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:248:    // One has negation, the other doesn't → potential contradiction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:284: * Surface all members of a contradiction cluster.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:285: * When a contradiction pair is detected, find ALL related memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:440:  const contradictionPairs = scanContradictions(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:441:  const contradictions = buildContradictionClusters(database, contradictionPairs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:469:    contradictions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:4:// Feature catalog: Causal edge contradiction detection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:5:// Detects when a new edge contradicts an existing one and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:39:  ['supports', 'contradicts'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:40:  ['caused', 'contradicts'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:41:  ['enabled', 'contradicts'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:63: * Check if a new edge contradicts existing edges.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:66: * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:67: * Returns array of contradictions found and invalidated.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:69:export function detectContradictions(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:126:    console.warn(`[contradiction-detection] detectContradictions failed (fail-open): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:83:    : 'Prediction-error contradiction across different file paths';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:34:  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:4:// Feature catalog: Causal edge creation (memory_causal_link)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:9:import { detectContradictions } from '../graph/contradiction-detection.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:22:  CONTRADICTS: 'contradicts',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:39:  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:205:        detectContradictions(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:664:function cleanupOrphanedEdges(): { deleted: number } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:678:    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:903:  cleanupOrphanedEdges,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:501:  // cleanupOrphanedEdges was exported but
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:508:      const orphanResult = causalEdges.cleanupOrphanedEdges();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:25:// Feature catalog: Causal graph statistics (memory_causal_stats)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:50:  by_contradicts: FlatEdge[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:63:  contradicts: FlatEdge[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:142:    by_contradicts: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:187:      case 'contradicts': return result.by_contradicts;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:210:    by_contradicts: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:229:      case 'contradicts': merged.by_contradicts.push(edge); break;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:276:    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:294:    by_contradicts: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:309:    contradicts: chain.by_contradicts,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:326:  if (chain.by_contradicts.length > 0) parts.push(`${chain.by_contradicts.length} contradicts`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:490:          'Use memory_causal_link to create relationships',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:516:    if (combinedChain.by_contradicts.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:576:      tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:603:        tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:616:        tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:629:        tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639:      tool: 'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:647:        'Use memory_causal_stats() to check overall graph coverage'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653:      'memory_causal_link',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:667:/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:678:        tool: 'memory_causal_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:682:        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:735:      tool: 'memory_causal_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:755:      'memory_causal_stats',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:784:          'Use memory_causal_stats() to see graph overview'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:854:const handle_memory_causal_stats = handleMemoryCausalStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:859:  handle_memory_causal_link,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:860:  handle_memory_causal_stats,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:315:export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:420:    : 'Prediction-error contradiction across different file paths';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:205:/** Mark a memory as superseded (deprecated) when a newer contradicting version is saved */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:345:        contradiction_detected,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:354:      decision.contradiction?.detected ? 1 : 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:62:  contradictionDensity: 0.15, // max allowed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:201:    signal: 'contradictionDensity',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:202:    value: signals.contradictionDensity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:203:    threshold: t.contradictionDensity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:204:    passed: signals.contradictionDensity <= t.contradictionDensity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:255:  // Check for active contradictions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:256:  const contradictions = findContradictions(ns);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:257:  if (contradictions.length > 0 && signals.contradictionDensity > t.contradictionDensity) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:259:      type: 'high_contradiction_density',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:260:      description: `${contradictions.length} contradiction(s) detected with density above threshold`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:261:      count: contradictions.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:351:  // Check contradictions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:352:  const contradictions = findContradictions(ns);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:353:  if (contradictions.length > 0 && signals.findingStability < t.findingStability) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:356:      description: `${contradictions.length} contradiction(s) are lowering finding stability below threshold`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:357:      count: contradictions.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:23:  | 'contradictions'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:91:      case 'contradictions': {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:92:        const contradictions = findContradictions(ns);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:94:          queryType: 'contradictions',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:96:          contradictions: contradictions.slice(0, limit),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:97:          totalContradictions: contradictions.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:129:          `Unknown queryType: "${args.queryType}". Valid types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:17:// Feature catalog: Causal edge creation (memory_causal_link)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:49:| `consolidation.ts` | N3-lite contradiction, Hebbian, and stale-edge maintenance |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:3:description: "Community detection, graph signal scoring, temporal edges, contradiction detection, usage tracking, and community summaries for causal memory networks."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:33:The graph module operates on the `causal_edges` and `memory_index` tables to detect communities, compute scoring signals, manage temporal edge validity, detect contradictions, track usage, and generate community summaries. All features are independently gated behind `SPECKIT_*` feature flags.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:68:  contradiction-detection.ts  # Superseding/conflicting edge detection + auto-invalidation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:83:| `contradiction-detection.ts` | Detects superseding and conflicting edge relations, auto-invalidates old edges via `temporal-edges.ts` | `SPECKIT_TEMPORAL_EDGES` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:113:| `detectContradictions` | contradiction-detection.ts | Checks if new edge contradicts existing edges, auto-invalidates |

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '557,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   557	/** Handle memory_causal_link tool - creates a causal edge between two memories */
   558	async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
   559	  const {
   560	    sourceId,
   561	    targetId,
   562	    relation,
   563	    strength = 1.0,
   564	    evidence = null
   565	  } = args;
   566	
   567	  const startTime = Date.now();
   568	
   569	  if ((sourceId === undefined || sourceId === null) || (targetId === undefined || targetId === null) || !relation) {
   570	    const missing: string[] = [];
   571	    if (sourceId === undefined || sourceId === null) missing.push('sourceId');
   572	    if (targetId === undefined || targetId === null) missing.push('targetId');
   573	    if (!relation) missing.push('relation');
   574	
   575	    return createMCPErrorResponse({
   576	      tool: 'memory_causal_link',
   577	      error: `Missing required parameters: ${missing.join(', ')}`,
   578	      code: 'E031',
   579	      details: {
   580	        missingParams: missing,
   581	        validRelations: Object.values(causalEdges.RELATION_TYPES) as string[]
   582	      },
   583	      recovery: {
   584	        hint: 'Provide all required parameters to create a causal link',
   585	        actions: [
   586	          'sourceId: Memory ID that is the cause/source',
   587	          'targetId: Memory ID that is the effect/target',
   588	          `relation: One of ${Object.values(causalEdges.RELATION_TYPES).join(', ')}`
   589	        ],
   590	        severity: 'error'
   591	      },
   592	      startTime: startTime
   593	    });
   594	  }
   595	
   596	  try {
   597	    await checkDatabaseUpdated();
   598	
   599	    vectorIndex.initializeDb();
   600	    const db = vectorIndex.getDb();
   601	    if (!db) {
   602	      return createMCPErrorResponse({
   603	        tool: 'memory_causal_link',
   604	        error: 'Database not initialized. Server may still be starting up.',
   605	        code: 'E020',
   606	        details: {},
   607	        recovery: getRecoveryHint('memory_causal_link', 'E020'),
   608	        startTime: startTime
   609	      });
   610	    }
   611	    causalEdges.init(db);
   612	
   613	    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
   614	    if (!validRelations.includes(relation)) {
   615	      return createMCPErrorResponse({
   616	        tool: 'memory_causal_link',
   617	        error: `Invalid relation type: '${relation}'. Must be one of: ${validRelations.join(', ')}`,
   618	        code: ErrorCodes.CAUSAL_INVALID_RELATION,
   619	        details: { relation, validRelations },
   620	        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
   621	        startTime: startTime
   622	      });
   623	    }
   624	    const safeRelation = relation as causalEdges.RelationType;
   625	    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
   626	
   627	    if (!edge) {
   628	      return createMCPErrorResponse({
   629	        tool: 'memory_causal_link',
   630	        error: 'Causal link creation failed.',
   631	        code: ErrorCodes.CAUSAL_GRAPH_ERROR,
   632	        details: { sourceId, targetId, relation },
   633	        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
   634	        startTime: startTime
   635	      });
   636	    }
   637	
   638	    return createMCPSuccessResponse({
   639	      tool: 'memory_causal_link',
   640	      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
   641	      data: {
   642	        success: true,
   643	        edge
   644	      },
   645	      hints: [
   646	        `Use memory_drift_why({ memoryId: "${targetId}" }) to trace this relationship`,
   647	        'Use memory_causal_stats() to check overall graph coverage'
   648	      ],
   649	      startTime: startTime
   650	    });
   651	  } catch (error: unknown) {
   652	    return createSanitizedCausalError(
   653	      'memory_causal_link',
   654	      error,
   655	      ErrorCodes.CAUSAL_GRAPH_ERROR,
   656	      { sourceId, targetId, relation },
   657	      startTime,
   658	      'Causal link creation failed.',
   659	    );
   660	  }
   661	}
   662	
   663	/* ───────────────────────────────────────────────────────────────
   664	   4. CAUSAL GRAPH STATS HANDLER
   665	──────────────────────────────────────────────────────────────── */
   666	
   667	/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
   668	async function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse> {
   669	  const startTime = Date.now();
   670	
   671	  try {
   672	    await checkDatabaseUpdated();
   673	
   674	    vectorIndex.initializeDb();
   675	    const db = vectorIndex.getDb();
   676	    if (!db) {
   677	      return createMCPErrorResponse({
   678	        tool: 'memory_causal_stats',
   679	        error: 'Database not initialized. Server may still be starting up.',
   680	        code: 'E020',
   681	        details: {},
   682	        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
   683	        startTime: startTime
   684	      });
   685	    }
   686	    causalEdges.init(db);
   687	
   688	    const stats = causalEdges.getGraphStats();
   689	    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();
   690	
   691	    // Compute link coverage: unique memories linked / total memories
   692	    const totalMemories = (db.prepare('SELECT COUNT(*) as count FROM memory_index') as import('better-sqlite3').Statement).get() as { count: number };
   693	    const uniqueLinked = new Set<string>();
   694	
   695	    // Count unique memory IDs that appear as source or target
   696	    try {
   697	      const linkedRows = (db.prepare(
   698	        'SELECT DISTINCT source_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id) UNION SELECT DISTINCT target_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)'
   699	      ) as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
   700	      for (const row of linkedRows) {
   701	        uniqueLinked.add(row.source_id);
   702	      }
   703	    } catch (error: unknown) {
   704	      const message = toErrorMessage(error).toLowerCase();
   705	      if (message.includes('no such table') && message.includes('causal_edges')) {
   706	        // New/partially initialized DB where causal edges table is absent.
   707	        // Coverage remains 0 in this case.
   708	      } else {
   709	        throw error;
   710	      }
   711	    }
   712	
   713	    const safeTotalEdges = stats.totalEdges ?? 0;
   714	    const coveragePercent = totalMemories.count > 0
   715	      ? Math.round((uniqueLinked.size / totalMemories.count) * 10000) / 100
   716	      : 0;
   717	
   718	    const meetsTarget = coveragePercent >= 60;
   719	    const health = orphanedEdges.length === 0 ? 'healthy' : 'has_orphans';
   720	
   721	    const summary = `Causal graph: ${safeTotalEdges} edges, ${coveragePercent}% coverage (${health})`;
   722	
   723	    const hints: string[] = [];
   724	    if (!meetsTarget) {
   725	      hints.push(`Coverage ${coveragePercent}% below 60% target - add more causal links`);
   726	    }
   727	    if (orphanedEdges.length > 0) {
   728	      hints.push(`${orphanedEdges.length} orphaned edges detected - consider cleanup`);
   729	    }
   730	    if (stats.totalEdges === 0) {
   731	      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
   732	    }
   733	
   734	    return createMCPSuccessResponse({
   735	      tool: 'memory_causal_stats',
   736	      summary,
   737	      data: {
   738	        total_edges: safeTotalEdges,
   739	        by_relation: stats.byRelation,
   740	        avg_strength: stats.avgStrength,
   741	        unique_sources: stats.uniqueSources,
   742	        unique_targets: stats.uniqueTargets,
   743	        link_coverage_percent: coveragePercent + '%',
   744	        orphanedEdges: orphanedEdges.length,
   745	        health,
   746	        targetCoverage: '60%',
   747	        currentCoverage: coveragePercent + '%',
   748	        meetsTarget: meetsTarget
   749	      },
   750	      hints,
   751	      startTime: startTime
   752	    });
   753	  } catch (error: unknown) {
   754	    return createSanitizedCausalError(
   755	      'memory_causal_stats',
   756	      error,
   757	      ErrorCodes.CAUSAL_GRAPH_ERROR,
   758	      {},
   759	      startTime,
   760	      'Causal graph statistics failed.',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Contradiction Detection
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Causal edge contradiction detection
     5	// Detects when a new edge contradicts an existing one and
     6	// auto-invalidates the old edge via temporal-edges.
     7	// Feature-gated via SPECKIT_TEMPORAL_EDGES (shared gate).
     8	import type Database from 'better-sqlite3';
     9	
    10	import { isTemporalEdgesEnabled } from '../search/search-flags.js';
    11	import { ensureTemporalColumns, invalidateEdge } from './temporal-edges.js';
    12	
    13	// ───────────────────────────────────────────────────────────────
    14	// 1. TYPES
    15	// ───────────────────────────────────────────────────────────────
    16	
    17	export interface ContradictionResult {
    18	  oldEdge: {
    19	    sourceId: number;
    20	    targetId: number;
    21	    relation: string;
    22	  };
    23	  oldSourceId: number;
    24	  oldTargetId: number;
    25	  oldRelation: string;
    26	  reason: string;
    27	}
    28	
    29	// ───────────────────────────────────────────────────────────────
    30	// 2. CONFLICT RULES
    31	// ───────────────────────────────────────────────────────────────
    32	
    33	/**
    34	 * Relation pairs that are mutually exclusive on the same source+target.
    35	 * If a new edge has one relation and an existing edge has the other,
    36	 * the existing edge is invalidated.
    37	 */
    38	const CONFLICTING_RELATIONS: ReadonlyArray<[string, string]> = [
    39	  ['supports', 'contradicts'],
    40	  ['caused', 'contradicts'],
    41	  ['enabled', 'contradicts'],
    42	];
    43	
    44	/**
    45	 * Check whether two relations conflict according to the conflict rules.
    46	 */
    47	function relationsConflict(existingRelation: string, newRelation: string): boolean {
    48	  const existingLower = existingRelation.toLowerCase();
    49	  const newLower = newRelation.toLowerCase();
    50	  for (const [a, b] of CONFLICTING_RELATIONS) {
    51	    if ((existingLower === a && newLower === b) || (existingLower === b && newLower === a)) {
    52	      return true;
    53	    }
    54	  }
    55	  return false;
    56	}
    57	
    58	// ───────────────────────────────────────────────────────────────
    59	// 3. DETECTION + AUTO-INVALIDATION
    60	// ───────────────────────────────────────────────────────────────
    61	
    62	/**
    63	 * Check if a new edge contradicts existing edges.
    64	 * Contradiction rules:
    65	 * 1. Same source+target with relation 'supersedes' → invalidate old edge
    66	 * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
    67	 * Returns array of contradictions found and invalidated.
    68	 */
    69	export function detectContradictions(
    70	  db: Database.Database,
    71	  newSourceId: number,
    72	  newTargetId: number,
    73	  newRelation: string,
    74	): ContradictionResult[] {
    75	  if (!isTemporalEdgesEnabled()) {
    76	    return [];
    77	  }
    78	
    79	  const results: ContradictionResult[] = [];
    80	
    81	  try {
    82	    ensureTemporalColumns(db);
    83	
    84	    // Find existing valid edges between the same source and target
    85	    const rows = (db.prepare(`
    86	      SELECT source_id, target_id, relation
    87	      FROM causal_edges
    88	      WHERE source_id = ? AND target_id = ?
    89	        AND (invalid_at IS NULL OR invalid_at = '')
    90	    `) as Database.Statement).all(
    91	      String(newSourceId),
    92	      String(newTargetId),
    93	    ) as Array<{ source_id: string; target_id: string; relation: string }>;
    94	
    95	    for (const row of rows) {
    96	      const oldRelation = row.relation;
    97	      let reason: string | null = null;
    98	
    99	      // Rule 1: 'supersedes' replaces any existing edge on the same pair
   100	      if (newRelation.toLowerCase() === 'supersedes' && oldRelation.toLowerCase() !== 'supersedes') {
   101	        reason = `Superseded by new '${newRelation}' edge`;
   102	      }
   103	
   104	      // Rule 2: Conflicting relation pairs
   105	      if (!reason && relationsConflict(oldRelation, newRelation)) {
   106	        reason = `Conflicting relations: existing '${oldRelation}' vs new '${newRelation}'`;
   107	      }
   108	
   109	      if (reason) {
   110	        invalidateEdge(db, newSourceId, newTargetId, reason, oldRelation);
   111	        results.push({
   112	          oldEdge: {
   113	            sourceId: Number.parseInt(row.source_id, 10),
   114	            targetId: Number.parseInt(row.target_id, 10),
   115	            relation: oldRelation,
   116	          },
   117	          oldSourceId: Number.parseInt(row.source_id, 10),
   118	          oldTargetId: Number.parseInt(row.target_id, 10),
   119	          oldRelation,
   120	          reason,
   121	        });
   122	      }
   123	    }
   124	  } catch (error: unknown) {
   125	    const message = error instanceof Error ? error.message : String(error);
   126	    console.warn(`[contradiction-detection] detectContradictions failed (fail-open): ${message}`);
   127	  }
   128	
   129	  return results;
   130	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '330,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   330	  }
   331	
   332	  // Add to cache
   333	  regexLruCache.set(normalizedPhrase, regex);
   334	  return regex;
   335	}
   336	
   337	/** Load all trigger phrases from the index into memory */
   338	export function loadTriggerCache(): TriggerCacheEntry[] {
   339	  const now = Date.now();
   340	
   341	  // Return cached data if still valid
   342	  if (triggerCache && (now - cacheTimestamp) < CONFIG.CACHE_TTL_MS) {
   343	    return triggerCache;
   344	  }
   345	
   346	  try {
   347	    lastDegradedState = null;
   348	    // InitializeDb() is called on every cache-miss path (not just at startup)
   349	    // Because trigger-matcher may be the first module to access the database in the
   350	    // Process. The function is idempotent — repeated calls return immediately when the
   351	    // DB singleton is already initialised — so the side-effect is safe.
   352	    vectorIndex.initializeDb();
   353	    const db = vectorIndex.getDb();
   354	
   355	    // Null check for database
   356	    if (!db) {
   357	      console.warn('[trigger-matcher] Database not initialized. Server may still be starting up.');
   358	      return [];
   359	    }
   360	
   361	    const rows = getTriggerCacheLoaderStatement(db as Database.Database).all() as Array<{
   362	      id: number;
   363	      spec_folder: string;
   364	      file_path: string;
   365	      title: string | null;
   366	      trigger_phrases: string;
   367	      importance_weight: number | null;
   368	    }>;
   369	
   370	    // Build flat cache for fast iteration
   371	    triggerCache = [];
   372	    triggerCandidateIndex = new Map();
   373	    const failures: TriggerMatcherFailure[] = [];
   374	    for (const row of rows) {
   375	      let phrases: unknown;
   376	      try {
   377	        phrases = JSON.parse(row.trigger_phrases);
   378	      } catch (err: unknown) {
   379	        const message = err instanceof Error ? err.message : String(err);
   380	        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
   381	        failures.push({
   382	          code: 'E_TRIGGER_SOURCE_PARSE',
   383	          message,
   384	          memoryId: row.id,
   385	          filePath: row.file_path,
   386	        });
   387	        continue;
   388	      }
   389	
   390	      if (!Array.isArray(phrases)) {
   391	        continue;
   392	      }
   393	
   394	      for (const phrase of phrases) {
   395	        if (typeof phrase !== 'string') {
   396	          continue;
   397	        }
   398	
   399	        const normalizedPhrase = normalizeTriggerText(phrase);
   400	        if (!isSpecificTriggerPhrase(normalizedPhrase)) {
   401	          continue;
   402	        }
   403	
   404	        const entry: TriggerCacheEntry = {
   405	          triggerId: triggerCache.length,
   406	          phrase: normalizedPhrase,
   407	          regex: getCachedRegex(normalizedPhrase),
   408	          memoryId: row.id,
   409	          specFolder: row.spec_folder,
   410	          filePath: row.file_path,
   411	          title: row.title,
   412	          importanceWeight: row.importance_weight || 0.5,
   413	        };
   414	
   415	        triggerCache.push(entry);
   416	        indexTriggerEntry(entry);
   417	      }
   418	    }
   419	
   420	    lastDegradedState = failures.length > 0
   421	      ? {
   422	          code: 'E_TRIGGER_SOURCE_PARSE',
   423	          message: `Trigger cache loaded with ${failures.length} skipped source entries`,
   424	          failedEntries: failures.length,
   425	          failures,
   426	        }
   427	      : null;
   428	    cacheTimestamp = now;
   429	    return triggerCache;
   430	  } catch (error: unknown) {
   431	    const message = error instanceof Error ? error.message : String(error);
   432	    console.warn(`[trigger-matcher] Cache load failed: ${message}`);
   433	    lastDegradedState = {
   434	      code: 'E_TRIGGER_CACHE_LOAD',
   435	      message,
   436	      failedEntries: 1,
   437	      failures: [{ code: 'E_TRIGGER_CACHE_LOAD', message }],
   438	    };
   439	    return [];
   440	  }
   441	}
   442	
   443	/** Clear the trigger cache (useful for testing or after updates) */
   444	export function clearCache(): void {
   445	  triggerCache = null;
   446	  triggerCandidateIndex = null;
   447	  cacheTimestamp = 0;
   448	  lastDegradedState = null;
   449	  regexLruCache.clear();
   450	}
   451	
   452	/** Get cache statistics */
   453	export function getCacheStats(): CacheStats {
   454	  return {
   455	    size: triggerCache ? triggerCache.length : 0,
   456	    timestamp: cacheTimestamp,
   457	    ageMs: cacheTimestamp ? Date.now() - cacheTimestamp : null,
   458	    regexCacheSize: regexLruCache.size,
   459	    maxRegexCacheSize: CONFIG.MAX_REGEX_CACHE_SIZE,
   460	  };
   461	}
   462	
   463	/* --- 5. STRING MATCHING --- */
   464	
   465	/** Normalize string for Unicode-safe comparison */
   466	export function normalizeUnicode(str: string, stripAccents: boolean = false): string {
   467	  if (!str) {
   468	    return '';
   469	  }
   470	
   471	  // Step 1: NFC normalization (compose characters)
   472	  let normalized = str.normalize('NFC');
   473	
   474	  // Step 2: Optional accent stripping (NFKD + remove combining marks)
   475	  if (stripAccents) {
   476	    normalized = normalized
   477	      .normalize('NFKD')
   478	      .replace(/\p{M}/gu, '');
   479	  }
   480	
   481	  // Step 3: Case-fold (locale-independent lowercase)
   482	  normalized = normalized.toLowerCase();
   483	
   484	  return normalized;
   485	}
   486	
   487	/** Check if a phrase exists in text with word boundaries */
   488	export function matchPhraseWithBoundary(text: string, phrase: string, precompiledRegex: RegExp | null = null): boolean {
   489	  if (precompiledRegex) {
   490	    return precompiledRegex.test(text);
   491	  }
   492	
   493	  // Fallback for direct calls without pre-compiled regex
   494	  return buildBoundaryRegex(phrase).test(normalizeUnicode(text, false));
   495	}
   496	
   497	/* --- 6. SIGNAL VOCABULARY DETECTION (SPECKIT_SIGNAL_VOCAB) --- */
   498	
   499	/** Keywords for CORRECTION signals — user is correcting a prior statement */
   500	export const CORRECTION_KEYWORDS: string[] = [
   501	  'actually',
   502	  'wait',
   503	  'i was wrong',
   504	  'correction',
   505	  'not quite',
   506	  'let me rephrase',
   507	  "that's not right",
   508	];
   509	
   510	/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
   511	export const PREFERENCE_KEYWORDS: string[] = [
   512	  'prefer',
   513	  'like',
   514	  'want',
   515	  'always use',
   516	  'never use',
   517	  'i want',
   518	  'please use',
   519	];
   520	
   521	/** Keywords for REINFORCEMENT signals — user is confirming or praising a prior result */
   522	export const REINFORCEMENT_KEYWORDS: string[] = [
   523	  'that worked',
   524	  'perfect',
   525	  'exactly',
   526	  'great',
   527	  'yes',
   528	  'keep doing that',
   529	  'this is correct',
   530	];
   531	
   532	// Correction signals (0.2) weighted higher than preferences (0.1) and reinforcement (0.15) — corrections indicate stronger search intent
   533	/** Boost values per signal category */
   534	const SIGNAL_BOOSTS: Record<Exclude<SignalCategory, 'neutral'>, number> = {
   535	  correction: 0.2,
   536	  reinforcement: 0.15,
   537	  preference: 0.1,
   538	};
   539	
   540	/**
   541	 * Detect importance signals in a user prompt.
   542	 * Returns an array of detected SignalDetection entries.
   543	 * Only active when the SPECKIT_SIGNAL_VOCAB env var is set.
   544	 */
   545	export function detectSignals(prompt: string): SignalDetection[] {
   546	  if (!prompt) {
   547	    return [];
   548	  }
   549	
   550	  const normalized = normalizeUnicode(prompt, false);
   551	  const detected: SignalDetection[] = [];
   552	
   553	  // Check CORRECTION keywords
   554	  const correctionHits: string[] = [];
   555	  for (const kw of CORRECTION_KEYWORDS) {
   556	    if (matchPhraseWithBoundary(normalized, kw)) {
   557	      correctionHits.push(kw);
   558	    }
   559	  }
   560	  if (correctionHits.length > 0) {
   561	    detected.push({
   562	      category: 'correction',
   563	      keywords: correctionHits,
   564	      boost: SIGNAL_BOOSTS.correction,
   565	    });
   566	  }
   567	
   568	  // Check PREFERENCE keywords
   569	  const preferenceHits: string[] = [];
   570	  for (const kw of PREFERENCE_KEYWORDS) {
   571	    if (matchPhraseWithBoundary(normalized, kw)) {
   572	      preferenceHits.push(kw);
   573	    }
   574	  }
   575	  if (preferenceHits.length > 0) {
   576	    detected.push({
   577	      category: 'preference',
   578	      keywords: preferenceHits,
   579	      boost: SIGNAL_BOOSTS.preference,
   580	    });
   581	  }
   582	
   583	  // Check REINFORCEMENT keywords
   584	  const reinforcementHits: string[] = [];
   585	  for (const kw of REINFORCEMENT_KEYWORDS) {
   586	    if (matchPhraseWithBoundary(normalized, kw)) {
   587	      reinforcementHits.push(kw);
   588	    }
   589	  }
   590	  if (reinforcementHits.length > 0) {
   591	    detected.push({
   592	      category: 'reinforcement',
   593	      keywords: reinforcementHits,
   594	      boost: SIGNAL_BOOSTS.reinforcement,
   595	    });
   596	  }
   597	
   598	  return detected;
   599	}
   600	
   601	/**
   602	 * Apply signal boosts to matched results.
   603	 * Boosts are additive; importanceWeight is capped at 1.0.
   604	 * Only called when SPECKIT_SIGNAL_VOCAB is enabled.
   605	 */
   606	export function applySignalBoosts(matches: TriggerMatch[], signals: SignalDetection[]): TriggerMatch[] {
   607	  if (signals.length === 0) {
   608	    return matches;
   609	  }
   610	
   611	  const totalBoost = signals.reduce((sum, s) => sum + s.boost, 0);
   612	
   613	  return matches.map(m => ({
   614	    ...m,
   615	    importanceWeight: Math.min(1.0, m.importanceWeight + totalBoost),
   616	  }));
   617	}
   618	
   619	/* --- 7. MAIN MATCHING FUNCTION --- */
   620	
   621	/** Match user prompt against trigger phrases using exact string matching */
   622	export function matchTriggerPhrases(userPrompt: string, limit: number = CONFIG.DEFAULT_LIMIT): TriggerMatch[] {
   623	  const startTime = Date.now();
   624	
   625	  // Validation
   626	  if (!userPrompt || typeof userPrompt !== 'string') {
   627	    return [];
   628	  }
   629	
   630	  // Truncate very long prompts
   631	  const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
   632	    ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
   633	    : userPrompt;
   634	
   635	  const promptNormalized = normalizeUnicode(prompt, false);
   636	
   637	  // Load cache (fast if already loaded)
   638	  const cache = loadTriggerCache();
   639	
   640	  if (cache.length === 0) {
   641	    return [];
   642	  }
   643	
   644	  const candidateEntries = getTriggerCandidates(promptNormalized, cache);
   645	
   646	  // Match against all cached phrases
   647	  const matchesByMemory = new Map<number, TriggerMatch>();
   648	
   649	  for (const entry of candidateEntries) {
   650	    if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
   651	      const key = entry.memoryId;
   652	
   653	      let match = matchesByMemory.get(key);
   654	      if (!match) {
   655	        match = {
   656	          memoryId: entry.memoryId,
   657	          specFolder: entry.specFolder,
   658	          filePath: entry.filePath,
   659	          title: entry.title,
   660	          importanceWeight: entry.importanceWeight,
   661	          matchedPhrases: [],
   662	        };
   663	        matchesByMemory.set(key, match);
   664	      }
   665	
   666	      match.matchedPhrases.push(entry.phrase);
   667	    }
   668	  }
   669	
   670	  // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
   671	  const results = Array.from(matchesByMemory.values())
   672	    .sort((a, b) => {
   673	      const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
   674	      if (phraseDiff !== 0) {
   675	        return phraseDiff;
   676	      }
   677	      return b.importanceWeight - a.importanceWeight;
   678	    })
   679	    .slice(0, limit);
   680	
   681	  // Performance logging (CHK069)
   682	  const elapsed = Date.now() - startTime;
   683	  logExecutionTime('match_trigger_phrases', elapsed, {
   684	    promptLength: prompt.length,
   685	    cacheSize: cache.length,
   686	    candidateCount: candidateEntries.length,
   687	    matchCount: results.length,
   688	    totalPhrases: results.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
   689	  });
   690	
   691	  return results;
   692	}
   693	
   694	/** Match trigger phrases with additional stats */
   695	export function matchTriggerPhrasesWithStats(userPrompt: string, limit: number = CONFIG.DEFAULT_LIMIT): TriggerMatchWithStats {
   696	  const startTime = Date.now();
   697	  const cache = loadTriggerCache();
   698	  let matches = matchTriggerPhrases(userPrompt, limit);
   699	
   700	  // Signal vocabulary detection — graduated: default-ON. Set SPECKIT_SIGNAL_VOCAB=false to disable.
   701	  let signals: SignalDetection[] | undefined;
   702	  if (process.env.SPECKIT_SIGNAL_VOCAB?.toLowerCase() !== 'false') {
   703	    signals = detectSignals(userPrompt || '');
   704	    if (signals.length > 0) {
   705	      matches = applySignalBoosts(matches, signals);
   706	    }
   707	  }
   708	
   709	  const elapsed = Date.now() - startTime;
   710	
   711	  return {
   712	    matches,
   713	    stats: {
   714	      promptLength: (userPrompt || '').length,
   715	      cacheSize: cache.length,
   716	      matchCount: matches.length,
   717	      totalMatchedPhrases: matches.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
   718	      matchTimeMs: elapsed,
   719	      ...(signals !== undefined ? { signals } : {}),
   720	      ...(lastDegradedState ? { degraded: lastDegradedState } : {}),
   721	    },
   722	  };
   723	}
   724	
   725	/** Get all unique trigger phrases in the cache */
   726	export function getAllPhrases(): string[] {
   727	  const cache = loadTriggerCache();
   728	  return [...new Set(cache.map(e => e.phrase))];
   729	}
   730	
   731	export function getTriggerCandidates(userPrompt: string, cache: TriggerCacheEntry[] = loadTriggerCache()): TriggerCacheEntry[] {
   732	  if (cache.length === 0 || !triggerCandidateIndex || triggerCandidateIndex.size === 0) {
   733	    return cache;
   734	  }
   735	
   736	  const promptKeys = extractTriggerIndexKeys(userPrompt);
   737	  if (promptKeys.length === 0) {
   738	    return cache;
   739	  }
   740	
   741	  const candidateIds = new Set<number>();
   742	  for (const key of promptKeys) {
   743	    const indexedIds = triggerCandidateIndex.get(key);
   744	    if (!indexedIds) {
   745	      continue;
   746	    }
   747	
   748	    for (const triggerId of indexedIds) {
   749	      candidateIds.add(triggerId);
   750	    }
   751	  }
   752	
   753	  if (candidateIds.size === 0) {
   754	    return cache;
   755	  }
   756	
   757	  return [...candidateIds]
   758	    .sort((left, right) => left - right)
   759	    .map((triggerId) => cache[triggerId])
   760	    .filter((entry): entry is TriggerCacheEntry => Boolean(entry));
   761	}
   762	
   763	/** Get memories by trigger phrase */
   764	export function getMemoriesByPhrase(phrase: string): MemoryByPhrase[] {
   765	  const cache = loadTriggerCache();
   766	  const normalizedPhrase = normalizeTriggerText(phrase);
   767	
   768	  const memoryIds = new Set<number>();
   769	  const results: MemoryByPhrase[] = [];
   770	
   771	  for (const entry of cache) {
   772	    if (entry.phrase === normalizedPhrase && !memoryIds.has(entry.memoryId)) {
   773	      memoryIds.add(entry.memoryId);
   774	      results.push({
   775	        memoryId: entry.memoryId,
   776	        specFolder: entry.specFolder,
   777	        filePath: entry.filePath,
   778	        title: entry.title,
   779	        importanceWeight: entry.importanceWeight,
   780	      });
   781	    }
   782	  }
   783	
   784	  return results;
   785	}
   786	
   787	/** Refresh trigger cache (forces reload on next access) */
   788	export function refreshTriggerCache(): TriggerCacheEntry[] {
   789	  clearCache();
   790	  return loadTriggerCache();
   791	}

exec
/bin/zsh -lc 'rg -n "trigger phrase|trigger_phrases|causalLinks|quality review|post-save|PSR|quality gate" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:271:          trigger_phrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:209:  console.error(`[memory-save] Embedding cache STORE after quality gate for ${path.basename(filePath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:74:  causalLinks?: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:29: * structured fields (title, trigger_phrases, context_type, etc.), so
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:177:  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:180:    AND trigger_phrases IS NOT NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:181:    AND trigger_phrases != '[]'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:182:    AND trigger_phrases != ''
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:306:/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:366:      trigger_phrases: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:377:        phrases = JSON.parse(row.trigger_phrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:683:  logExecutionTime('match_trigger_phrases', elapsed, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:763:/** Get memories by trigger phrase */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:147:      trigger_phrases: args.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:281:                      trigger_phrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:40:  trigger_phrases: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:139:    trigger_phrases: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:145:  const persistedTriggerPhrases = parseJsonStringArray(existing.trigger_phrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:38:  causalLinks: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:46:  causalLinksResult: CausalLinksResult | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:70:    causalLinks: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:78:  let causalLinksResult: CausalLinksResult | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:79:  if (parsed.hasCausalLinks && parsed.causalLinks) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:81:      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:82:      enrichmentStatus.causalLinks = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:83:      if (causalLinksResult.inserted > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:84:        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      if (causalLinksResult.unresolved.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:87:        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:95:    enrichmentStatus.causalLinks = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:193:  return { causalLinksResult, enrichmentStatus };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:56:  causalLinksResult: CausalLinksResult | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:124:  causalLinksResult,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:224:  if (causalLinksResult) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:225:    result.causalLinks = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:226:      processed: causalLinksResult.processed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:227:      inserted: causalLinksResult.inserted,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:228:      resolved: causalLinksResult.resolved,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:229:      unresolved_count: causalLinksResult.unresolved.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:231:    if (causalLinksResult.errors.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:232:      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:423:  if (result.causalLinks) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:424:    response.causalLinks = result.causalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:425:    if ((result.causalLinks as Record<string, unknown>).inserted as number > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:426:      hints.push(`Created ${(result.causalLinks as Record<string, unknown>).inserted} causal graph edge(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:428:    if ((result.causalLinks as Record<string, unknown>).unresolved_count as number > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:429:      hints.push(`${(result.causalLinks as Record<string, unknown>).unresolved_count} causal link reference(s) could not be resolved`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:61:  causalLinks: CausalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:270:  const causalLinks = extractCausalLinks(content);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:288:    causalLinks: causalLinks,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:289:    hasCausalLinks: hasCausalLinks(causalLinks),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:547:  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:567:      if (/^\s*(?:triggerPhrases|trigger_phrases):\s*$/i.test(line)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:678:  const causalLinks: CausalLinks = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:687:  const causalBlockMatch = content.match(/(?:^|\n)\s*causalLinks:\s*\n((?:\s+[a-z_]+:[\s\S]*?)*)(?=\n[a-z_]+:|\n```|\n---|\n\n|\n#|$)/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:690:    return causalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:716:            if (cleaned && currentKey && !causalLinks[currentKey].includes(cleaned)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:717:              causalLinks[currentKey].push(cleaned);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:731:        if (value && value !== '[]' && !causalLinks[currentKey].includes(value)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:732:          causalLinks[currentKey].push(value);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:740:  return causalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:744: * Check if causalLinks has any non-empty arrays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:746:export function hasCausalLinks(causalLinks: CausalLinks | null | undefined): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:747:  if (!causalLinks) return false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:748:  return Object.values(causalLinks).some((arr: string[]) => Array.isArray(arr) && arr.length > 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/renderers/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:187:  /** Snake-case variant for raw JSON compatibility. Prefer causalLinks (camelCase) in new code. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:189:  causalLinks?: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts:301:  | 'missing_trigger_phrases'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/README.md:3:description: "Shell-based quality KPI reporter that scans memory files for placeholders, fallback content, AI contamination and missing trigger phrases."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/README.md:84:| Empty trigger phrases rate | YAML frontmatter block has zero `trigger_phrases` entries |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:149:      trigger_phrases TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:182:    INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:45:    if (!inBlock && /^trigger_phrases:\s*$/.test(line.trim())) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:6:// historical memory trigger_phrases using the live sanitizer plus bounded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:104:  --apply              Rewrite trigger_phrases in-place with atomic writes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:386:  const range = locateFrontmatterSectionRange(detection.rawBlock, 'trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:391:  const replacementLines = buildYamlArraySection('trigger_phrases', nextTriggers);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:408:  const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:485:  const triggers = parseFrontmatterArray(content, 'trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:41:- `validate-memory-quality.ts` - validates post-render memory quality against scoring thresholds before indexing/reporting; includes post-save quality gates (structure, semantic sufficiency, duplicate detection), heuristic calibration, and trigger sanitization
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:97:- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:109:- `trigger_phrases`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:129:  triggerPhrases: 10,    // >= 4 trigger phrases extracted
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:169:    qualityFlags.add('missing_trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:170:    warnings.push('No trigger phrases extracted — memory will not surface via trigger matching');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:331:    { id: 'trigger_phrases', score01: breakdown.triggerPhrases / 20, score100: breakdown.triggerPhrases, maxScore100: 20, passed: triggerPhrases.length > 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:237:  const camelCaseLinks = readNamedObject(collectedData, 'causalLinks');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:35:  causalLinks?: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:73:    || readSupersedes(currentSession.causalLinks).length > 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:109:      console.log(`   Using ${triggerPhrases.length} pre-extracted trigger phrases`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:112:      console.log(`   Extracted ${triggerPhrases.length} trigger phrases from content`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:124:      console.log(`   Total: ${triggerPhrases.length} trigger phrases (${manualPhrases.length} manual)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:135:      console.log(`   Using ${triggerPhrases.length} manual trigger phrases`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:4:// Frontmatter injection and trigger phrase rendering utilities.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:98:    return 'trigger_phrases: []';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:106:  return ['trigger_phrases:', ...escapedPhrases].join('\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:38:- `frontmatter-editor.ts` - frontmatter metadata injection and trigger phrase YAML rendering
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:41:- `post-save-review.ts` - Post-save quality review — compares saved frontmatter against JSON payload, emits machine-readable severity-graded findings (Step 10.5)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:76:- `post-save-review.ts` runs after writes in JSON-mode save flows to compare saved frontmatter against the input payload and surface severity-graded drift findings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:92:  trigger_phrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:113:  causalLinks?: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:143:  causalLinks?: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:373: * Builds a feature observation from a session summary string and optional trigger phrases.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:375: * @param triggerPhrases - Optional array of trigger phrases stored as observation facts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:635:  const explicitCausalLinks = normalizeCausalLinks(data.causalLinks ?? data.causal_links);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:653:    : Array.isArray(data.trigger_phrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:654:      ? data.trigger_phrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:754:      cloned.causalLinks = explicitCausalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:852:    normalized.causalLinks = explicitCausalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1054:  'triggerPhrases', 'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1064:  'causalLinks', 'causal_links',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1129:  if (Array.isArray(data.trigger_phrases)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1130:    for (let i = 0; i < data.trigger_phrases.length; i++) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1131:      if (typeof data.trigger_phrases[i] === 'string' && (data.trigger_phrases[i] as string).length > 200) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1132:        errors.push(`trigger_phrases[${i}] exceeds maximum length of 200 characters`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1151:  if (data.trigger_phrases !== undefined && !Array.isArray(data.trigger_phrases)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1152:    errors.push('trigger_phrases must be an array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1154:  if (data.causalLinks !== undefined && (!data.causalLinks || typeof data.causalLinks !== 'object' || Array.isArray(data.causalLinks))) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1155:    errors.push('causalLinks must be an object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:76:import { reviewPostSaveQuality, printPostSaveReview, computeReviewScorePenalty } from './post-save-review';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:537:      // Merge trigger phrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:672:        causalLinks: n.causalLinks ?? preloadedData.causalLinks,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1264:  // Pre-extract trigger phrases for template embedding AND later indexing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1299:    // RC2: Merge manual trigger phrases from JSON into frontmatter triggers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1354:    // CG-04: Domain-specific stopwords for single-word trigger phrases from folder names
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1397:    log(`   Pre-extracted ${preExtractedTriggers.length} trigger phrases`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1400:    warn(`   Warning: Pre-extraction of trigger phrases failed: ${errMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1412:    collectedData.causalLinks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1413:    && typeof collectedData.causalLinks === 'object'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1414:    && !Array.isArray(collectedData.causalLinks)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1415:  ) ? { ...(collectedData.causalLinks as Record<string, unknown>) } : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1430:      causalLinks: currentCamelCaseCausalLinks ?? undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1439:      collectedData.causalLinks = nextCausalLinks;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1486:  collectedData.causalLinks = collectedData.causal_links;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1487:  const causalLinks = buildCausalLinksContext(collectedData);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1547:      ...causalLinks,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1953:  // Step 10.5: Post-save quality review (JSON mode only)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2024:    // Phase 002 T035: Log post-save review score impact (advisory — does not patch saved file
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:36:  | 'PSR-1'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:37:  | 'PSR-2'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:38:  | 'PSR-3'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:39:  | 'PSR-4'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:40:  | 'PSR-5'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:41:  | 'PSR-6'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:362:  return extractYamlListEntries(extractMemoryMetadataYaml(content), 'trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:625:    const savedTriggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:632:    const metadataHasTriggerPhrases = /(^|\n)trigger_phrases:\s*/m.test(memoryMetadataYaml);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:656:        checkId: 'PSR-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:671:          checkId: 'PSR-2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:673:          field: 'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:685:          checkId: 'PSR-2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:687:          field: 'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:689:          fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:696:        checkId: 'PSR-3',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:711:          checkId: 'PSR-4',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:723:          checkId: 'PSR-5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:813:        field: 'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:814:        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:815:        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:853:          checkId: 'PSR-6',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:901:    // CHECK-D3: trigger phrase sanitization.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:912:        field: 'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:913:        message: `trigger_phrases contains unsanitized junk (${details})`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:914:        fix: 'Run trigger phrases through the Phase 3 sanitizer before render and persist only the kept phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:940:    // CHECK-D6: duplicate trigger phrases.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:958:          field: 'trigger_phrases',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:959:          message: `duplicate trigger phrases detected: ${JSON.stringify(Array.from(duplicates))}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:960:          fix: 'Deduplicate trigger_phrases before the saved frontmatter is rendered',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:183:    ...(Array.isArray(data.trigger_phrases) ? data.trigger_phrases : []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:184:    ...extractFrontmatterListItems(content, 'trigger_phrases'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/lib/semantic-signal-extractor.d.ts:34:    /** Extracts trigger phrases from text using balanced stopwords and ngram depth 2 by default. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/lib/semantic-signal-extractor.d.ts:36:    /** Extracts trigger phrases with extraction stats and breakdown metadata. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:7:// Post-render quality gate for generated memory files
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:89:    reason: 'Sparse trigger phrases are diagnostic, but not enough to reject an otherwise valid rendered memory.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:152:    reason: 'Memory content with zero topical overlap with spec trigger_phrases suggests off-target capture.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:764:  const triggerPhrases = parseYamlListFromContent(content, 'trigger_phrases');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:769:    message: sparseSemantic ? 'sparse semantic fields: trigger_phrases empty' : 'ok',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:899:          errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',

codex
I’m seeing an important split: Mex is very good at static scaffold drift, while our stack already has richer ingestion-time hygiene on trigger phrases and causal links. I’m pulling those save-path checks too, because they materially change the comparison and keep us from underselling what we already have.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | sed -n '620,970p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '740,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   620	    const memoryMetadataYaml = extractMemoryMetadataYaml(fileContent);
   621	    const memoryMetadata = parseMemoryMetadataBlock(fileContent);
   622	    const issues: ReviewIssue[] = [];
   623	
   624	    const savedTitle = normalizeScalarValue(frontmatter.title);
   625	    const savedTriggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
   626	    const metadataTriggers = extractMetadataTriggerPhrases(fileContent);
   627	    const savedTier = normalizeScalarValue(frontmatter.importance_tier);
   628	    const metadataTier = normalizeScalarValue(memoryMetadata.importance_tier);
   629	    const savedContextType = normalizeScalarValue(frontmatter.contextType || frontmatter.context_type);
   630	    const metadataContextType = normalizeScalarValue(memoryMetadata.context_type || memoryMetadata.contextType);
   631	    const metadataHasContextType = /(^|\n)context_type:\s*/m.test(memoryMetadataYaml) || /(^|\n)contextType:\s*/m.test(memoryMetadataYaml);
   632	    const metadataHasTriggerPhrases = /(^|\n)trigger_phrases:\s*/m.test(memoryMetadataYaml);
   633	    const overview = stripSectionScaffolding(extractSection(fileContent, 'OVERVIEW'));
   634	    const decisionsSection = stripSectionScaffolding(extractSection(fileContent, 'DECISIONS'));
   635	    const supersedes = extractSupersedesEntries(fileContent);
   636	    const anchorState = extractOverviewAnchorState(fileContent);
   637	    const closureCandidates = extractCompletedClosureCandidates(fileContent);
   638	    const lastContextLines = extractLastContextLines(fileContent);
   639	    const payloadSummary = (collectedData.sessionSummary || '').trim();
   640	    const payloadDecisions = Array.isArray(collectedData.keyDecisions) && collectedData.keyDecisions.length > 0
   641	      ? collectedData.keyDecisions
   642	      : Array.isArray(collectedData._manualDecisions)
   643	        ? collectedData._manualDecisions
   644	        : [];
   645	    const explicitTier = normalizeScalarValue(collectedData.importanceTier || collectedData.importance_tier);
   646	    const explicitContextType = normalizeScalarValue(collectedData.contextType || collectedData.context_type);
   647	    const savedDescription = normalizeScalarValue(frontmatter.description);
   648	    const continuationPattern = detectContinuationPattern(savedTitle) || detectContinuationPattern(savedDescription);
   649	    const manualTriggerKeys = buildManualTriggerKeySet(collectedData._manualTriggerPhrases);
   650	    const d3Counts = buildD3CountsWithSource(savedTriggers, manualTriggerKeys);
   651	    const provenanceExpected = collectedData.provenanceExpected === true;
   652	
   653	    // Baseline checks.
   654	    if (payloadSummary.length > 15 && isGenericTitle(savedTitle)) {
   655	      issues.push({
   656	        checkId: 'PSR-1',
   657	        severity: 'HIGH',
   658	        field: 'title',
   659	        message: `"${savedTitle}" — should reflect sessionSummary`,
   660	        fix: `Edit frontmatter title to: "${payloadSummary.substring(0, 80)}"`,
   661	      });
   662	    }
   663	
   664	    if (Array.isArray(collectedData._manualTriggerPhrases) && collectedData._manualTriggerPhrases.length > 0) {
   665	      const pathFragments = savedTriggers.filter((phrase) => (
   666	        !manualTriggerKeys.has(phrase.trim().toLowerCase())
   667	        && sanitizeTriggerPhrase(phrase).reason === 'path_fragment'
   668	      ));
   669	      if (pathFragments.length > 0) {
   670	        issues.push({
   671	          checkId: 'PSR-2',
   672	          severity: 'HIGH',
   673	          field: 'trigger_phrases',
   674	          message: `contains path fragments ${JSON.stringify(pathFragments)}`,
   675	          fix: `Replace with: ${JSON.stringify(collectedData._manualTriggerPhrases.slice(0, 5))}`,
   676	        });
   677	      }
   678	
   679	      const savedLower = new Set(savedTriggers.map((entry) => entry.toLowerCase()));
   680	      const missingPhrases = collectedData._manualTriggerPhrases.filter(
   681	        (phrase) => !savedLower.has(phrase.toLowerCase()),
   682	      );
   683	      if (missingPhrases.length > 0 && pathFragments.length === 0) {
   684	        issues.push({
   685	          checkId: 'PSR-2',
   686	          severity: 'MEDIUM',
   687	          field: 'trigger_phrases',
   688	          message: `missing manual phrases: ${JSON.stringify(missingPhrases.slice(0, 3))}`,
   689	          fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
   690	        });
   691	      }
   692	    }
   693	
   694	    if (explicitTier && savedTier && savedTier !== explicitTier) {
   695	      issues.push({
   696	        checkId: 'PSR-3',
   697	        severity: 'MEDIUM',
   698	        field: 'importance_tier',
   699	        message: `"${savedTier}" — payload specified "${explicitTier}"`,
   700	        fix: `Change to "${explicitTier}" in frontmatter`,
   701	      });
   702	    }
   703	
   704	    if (payloadDecisions.length > 0) {
   705	      const savedDecisionCount = parseInt(
   706	        frontmatter.decision_count || memoryMetadata.decision_count || '0',
   707	        10,
   708	      );
   709	      if (savedDecisionCount === 0) {
   710	        issues.push({
   711	          checkId: 'PSR-4',
   712	          severity: 'MEDIUM',
   713	          field: 'decision_count',
   714	          message: `0 — payload has ${payloadDecisions.length} keyDecisions`,
   715	          fix: `Verify decisions were propagated; expected decision_count >= ${payloadDecisions.length}`,
   716	        });
   717	      }
   718	    }
   719	
   720	    if (explicitContextType) {
   721	      if (savedContextType && savedContextType !== explicitContextType) {
   722	        issues.push({
   723	          checkId: 'PSR-5',
   724	          severity: 'LOW',
   725	          field: 'context_type',
   726	          message: `"${savedContextType}" — payload specified "${explicitContextType}"`,
   727	          fix: `Change to "${explicitContextType}" in frontmatter`,
   728	        });
   729	      }
   730	    }
   731	
   732	    const placeholderObservationCount = (fileContent.match(/^### OBSERVATION:\s*(?:Observation)?\s*$/gim) ?? []).length;
   733	    if (placeholderObservationCount >= 2) {
   734	      issues.push({
   735	        checkId: 'DUP1',
   736	        severity: 'MEDIUM',
   737	        field: 'observations',
   738	        message: `generic observation placeholder headings repeated ${placeholderObservationCount} times`,
   739	        fix: 'Suppress blank-title observation headings before the template renders them',
   740	      });
   741	    }
   742	
   743	    const normalizedOutcomePropositions = new Set(
   744	      extractOverviewOutcomes(overview)
   745	        .map(normalizeProposition)
   746	        .filter(Boolean),
   747	    );
   748	    const normalizedDecisionTitlePropositions = new Set(
   749	      extractDecisionTitles(decisionsSection)
   750	        .map(normalizeProposition)
   751	        .filter(Boolean),
   752	    );
   753	    const normalizedDecisionRationales = new Set(
   754	      extractDecisionRationales(decisionsSection)
   755	        .map(normalizeProposition)
   756	        .filter(Boolean),
   757	    );
   758	    const duplicatedDecisionPropositions = Array.from(normalizedOutcomePropositions).filter((proposition) => (
   759	      proposition.length > 0
   760	      && normalizedDecisionTitlePropositions.has(proposition)
   761	      && normalizedDecisionRationales.has(proposition)
   762	    ));
   763	    if (duplicatedDecisionPropositions.length > 0) {
   764	      issues.push({
   765	        checkId: 'DUP2',
   766	        severity: 'MEDIUM',
   767	        field: 'decisions',
   768	        message: `decision proposition is repeated across outcomes, title, and rationale: ${JSON.stringify(duplicatedDecisionPropositions.slice(0, 3))}`,
   769	        fix: 'Deduplicate repeated decision propositions across Key Outcomes, decision titles, and fallback rationale',
   770	      });
   771	    }
   772	
   773	    const closureSignals = closureCandidates.filter((candidate) => (
   774	      /(complete|completed|canonical|follow[- ]on|no pending|no immediate work|outside this memory|optional downstream)/i.test(candidate)
   775	    ));
   776	    if (closureSignals.length >= 3) {
   777	      issues.push({
   778	        checkId: 'DUP3',
   779	        severity: 'MEDIUM',
   780	        field: 'continuation',
   781	        message: `completed-session closure guidance is repeated across ${closureSignals.length} surfaces`,
   782	        fix: 'Keep completed-session closure guidance on the canonical Next Action surface only',
   783	      });
   784	    }
   785	
   786	    const clippedLastLine = lastContextLines.find((line) => !/[.?!…]$/.test(line) && !line.endsWith('...'));
   787	    if (clippedLastLine) {
   788	      issues.push({
   789	        checkId: 'DUP4',
   790	        severity: 'MEDIUM',
   791	        field: 'resume_context',
   792	        message: `Last context ends as a clipped fragment: "${clippedLastLine}"`,
   793	        fix: 'Trim Last resume context at a sentence or word boundary, or add an explicit ellipsis',
   794	      });
   795	    }
   796	
   797	    if (metadataHasContextType && (savedContextType || metadataContextType) && savedContextType !== metadataContextType) {
   798	      issues.push({
   799	        checkId: 'DUP5',
   800	        severity: 'MEDIUM',
   801	        field: 'context_type',
   802	        message: `frontmatter contextType is "${savedContextType || 'missing'}" but MEMORY METADATA is "${metadataContextType || 'missing'}"`,
   803	        fix: 'Render MEMORY METADATA context_type from the same resolved frontmatter contextType value',
   804	      });
   805	    }
   806	
   807	    const normalizedSavedTriggers = Array.from(new Set(savedTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
   808	    const normalizedMetadataTriggers = Array.from(new Set(metadataTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
   809	    if (metadataHasTriggerPhrases && JSON.stringify(normalizedSavedTriggers) !== JSON.stringify(normalizedMetadataTriggers)) {
   810	      issues.push({
   811	        checkId: 'DUP5',
   812	        severity: 'HIGH',
   813	        field: 'trigger_phrases',
   814	        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
   815	        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
   816	      });
   817	    }
   818	
   819	    const redundantSectionIdentityMatches = fileContent.match(/<!-- ANCHOR:[a-z0-9-]+ -->\s*\n<a id="[^"]+"><\/a>\s*\n(?:\s*\n)?##/gi) ?? [];
   820	    if (redundantSectionIdentityMatches.length > 0) {
   821	      issues.push({
   822	        checkId: 'DUP6',
   823	        severity: 'MEDIUM',
   824	        field: 'anchors',
   825	        message: `redundant section identity scaffolding detected in ${redundantSectionIdentityMatches.length} section opener(s)`,
   826	        fix: 'Keep markdown headers plus ANCHOR comments, and remove legacy HTML id scaffolding',
   827	      });
   828	    }
   829	
   830	    const inflatedFileRow = fileContent
   831	      .split('\n')
   832	      .map((line) => line.trim())
   833	      .find((line) => line.startsWith('| `') && countMergedFromClauses(line) >= 2);
   834	    if (inflatedFileRow) {
   835	      issues.push({
   836	        checkId: 'DUP7',
   837	        severity: 'MEDIUM',
   838	        field: 'files',
   839	        message: `FILES row description contains repeated merged provenance inflation: "${inflatedFileRow}"`,
   840	        fix: 'Move verbose merged provenance out of FILES descriptions and keep only one merged summary clause',
   841	      });
   842	    }
   843	
   844	    if (savedDescription) {
   845	      const genericDescriptions = [
   846	        'session focused on implementing and testing features',
   847	        'development session',
   848	        'context save',
   849	      ];
   850	      const isGenericDesc = genericDescriptions.some((entry) => savedDescription.toLowerCase().includes(entry));
   851	      if (isGenericDesc && payloadSummary.length > 20) {
   852	        issues.push({
   853	          checkId: 'PSR-6',
   854	          severity: 'LOW',
   855	          field: 'description',
   856	          message: 'Generic boilerplate description',
   857	          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
   858	        });
   859	      }
   860	    }
   861	
   862	    // CHECK-D1: overview truncation / ellipsis integrity.
   863	    if (payloadSummary.length > 0 && overview.length > 0) {
   864	    const trimmedOverview = overview.trimEnd();
   865	    const usesAsciiEllipsis = trimmedOverview.endsWith('...');
   866	    const usesUnicodeEllipsis = trimmedOverview.endsWith('…');
   867	    const overviewCore = (
   868	      usesAsciiEllipsis
   869	        ? trimmedOverview.slice(0, -3)
   870	        : usesUnicodeEllipsis
   871	          ? trimmedOverview.slice(0, -1)
   872	          : trimmedOverview
   873	    ).trimEnd();
   874	    const payloadOverflow = payloadSummary.length >= overviewCore.length + 40;
   875	    const nextChar = payloadSummary.charAt(overviewCore.length);
   876	    const coreEndsMidWord = /[A-Za-z0-9]$/.test(overviewCore) && /[A-Za-z0-9]/.test(nextChar);
   877	    const plainMidTokenEnding = !usesAsciiEllipsis && !usesUnicodeEllipsis && /[A-Za-z0-9]$/.test(trimmedOverview);
   878	
   879	      if (payloadOverflow && (usesAsciiEllipsis || coreEndsMidWord || plainMidTokenEnding)) {
   880	        issues.push({
   881	          checkId: 'D1',
   882	          severity: 'HIGH',
   883	          field: 'overview',
   884	          message: 'OVERVIEW appears truncated mid-token or with non-canonical ellipsis handling',
   885	          fix: 'Re-render the OVERVIEW from the full session summary using the boundary-safe truncation helper',
   886	        });
   887	      }
   888	    }
   889	
   890	    // CHECK-D2: lexical placeholder contamination.
   891	    if (payloadDecisions.length > 0 && DECISION_PLACEHOLDER_PATTERN.test(decisionsSection)) {
   892	      issues.push({
   893	        checkId: 'D2',
   894	        severity: 'HIGH',
   895	        field: 'decisions',
   896	        message: 'DECISIONS contains observation/user placeholder labels despite authored decisions in the payload',
   897	        fix: 'Preserve authored decision arrays before any lexical fallback branch runs',
   898	      });
   899	    }
   900	
   901	    // CHECK-D3: trigger phrase sanitization.
   902	    if (Object.values(d3Counts).some((count) => count > 0)) {
   903	      const details = [
   904	        d3Counts.path_fragment > 0 ? `path_fragment=${d3Counts.path_fragment}` : null,
   905	        d3Counts.standalone_stopword > 0 ? `stopword=${d3Counts.standalone_stopword}` : null,
   906	        d3Counts.synthetic_bigram > 0 ? `bigram=${d3Counts.synthetic_bigram}` : null,
   907	      ].filter(Boolean).join(', ');
   908	
   909	      issues.push({
   910	        checkId: 'D3',
   911	        severity: 'MEDIUM',
   912	        field: 'trigger_phrases',
   913	        message: `trigger_phrases contains unsanitized junk (${details})`,
   914	        fix: 'Run trigger phrases through the Phase 3 sanitizer before render and persist only the kept phrases',
   915	      });
   916	    }
   917	
   918	    // CHECK-D4: frontmatter vs metadata tier drift.
   919	    if (savedTier && metadataTier && savedTier !== metadataTier) {
   920	      issues.push({
   921	        checkId: 'D4',
   922	        severity: 'HIGH',
   923	        field: 'importance_tier',
   924	        message: `frontmatter is "${savedTier}" but MEMORY METADATA is "${metadataTier}"`,
   925	        fix: 'Render both importance_tier locations from the same resolved value',
   926	      });
   927	    }
   928	
   929	    // CHECK-D5: continuation signal without supersedes.
   930	    if (continuationPattern && supersedes.length === 0) {
   931	      issues.push({
   932	        checkId: 'D5',
   933	        severity: 'MEDIUM',
   934	        field: 'causal_links.supersedes',
   935	        message: `continuation signal matched "${continuationPattern}" but causal_links.supersedes is empty`,
   936	        fix: 'Populate causal_links.supersedes when a continuation save has a valid predecessor',
   937	      });
   938	    }
   939	
   940	    // CHECK-D6: duplicate trigger phrases.
   941	    if (savedTriggers.length > 0) {
   942	      const seen = new Set<string>();
   943	      const duplicates = new Set<string>();
   944	
   945	      for (const phrase of savedTriggers) {
   946	        const normalized = phrase.trim().toLowerCase();
   947	        if (seen.has(normalized)) {
   948	          duplicates.add(normalized);
   949	        } else {
   950	          seen.add(normalized);
   951	        }
   952	      }
   953	
   954	      if (duplicates.size > 0) {
   955	        issues.push({
   956	          checkId: 'D6',
   957	          severity: 'MEDIUM',
   958	          field: 'trigger_phrases',
   959	          message: `duplicate trigger phrases detected: ${JSON.stringify(Array.from(duplicates))}`,
   960	          fix: 'Deduplicate trigger_phrases before the saved frontmatter is rendered',
   961	        });
   962	      }
   963	    }
   964	
   965	    // CHECK-D7: provenance required but missing.
   966	    if (provenanceExpected) {
   967	      const headRef = normalizeScalarValue(memoryMetadata.head_ref || frontmatter.head_ref);
   968	      const commitRef = normalizeScalarValue(memoryMetadata.commit_ref || frontmatter.commit_ref);
   969	      const repositoryState = normalizeScalarValue(memoryMetadata.repository_state || frontmatter.repository_state);
   970	      const missingFields = [

 succeeded in 0ms:
   740	  ruleResults.push({
   741	    ruleId: 'V2',
   742	    passed: !(toolCount > 0 && hasNaPlaceholder),
   743	    message: toolCount > 0 && hasNaPlaceholder
   744	      ? 'placeholder leakage: [N/A] present with tool execution data'
   745	      : 'ok',
   746	  });
   747	
   748	  const malformedSpecFolder =
   749	    /\*\*|\*|\[/.test(specFolder) ||
   750	    /Before I proceed/i.test(specFolder);
   751	  ruleResults.push({
   752	    ruleId: 'V3',
   753	    passed: !malformedSpecFolder,
   754	    message: malformedSpecFolder ? 'malformed spec_folder' : 'ok',
   755	  });
   756	
   757	  const hasFallbackDecision = FALLBACK_DECISION_REGEX.test(content);
   758	  ruleResults.push({
   759	    ruleId: 'V4',
   760	    passed: !hasFallbackDecision,
   761	    message: hasFallbackDecision ? 'fallback decision text present' : 'ok',
   762	  });
   763	
   764	  const triggerPhrases = parseYamlListFromContent(content, 'trigger_phrases');
   765	  const sparseSemantic = toolCount >= 5 && triggerPhrases.length === 0;
   766	  ruleResults.push({
   767	    ruleId: 'V5',
   768	    passed: !sparseSemantic,
   769	    message: sparseSemantic ? 'sparse semantic fields: trigger_phrases empty' : 'ok',
   770	  });
   771	
   772	  const placeholderContent = stripCodeSegments(content);
   773	  const placeholderLeak = PLACEHOLDER_PATTERNS.find(({ pattern }) => pattern.test(placeholderContent));
   774	  ruleResults.push({
   775	    ruleId: 'V6',
   776	    passed: !placeholderLeak,
   777	    message: placeholderLeak ? `placeholder leakage: ${placeholderLeak.label}` : 'ok',
   778	  });
   779	
   780	  const contradictoryToolState = toolCount === 0 && hasExecutionSignals(content);
   781	  ruleResults.push({
   782	    ruleId: 'V7',
   783	    passed: !contradictoryToolState,
   784	    message: contradictoryToolState ? 'contradictory tool state: tool_count is 0 but execution artifacts are present' : 'ok',
   785	  });
   786	
   787	  const currentSpecId = extractCurrentSpecId(specFolder);
   788	  // CG-07c: Use the full set of allowed IDs (current + all ancestors in path).
   789	  // Child spec memory files legitimately reference parent spec IDs, so ancestor
   790	  // IDs must not be treated as foreign contamination.
   791	  const allowedSpecIds = extractAllowedSpecIds(specFolder);
   792	  const resolvedSpecFolder = resolveSpecFolderPath(specFolder);
   793	  if (resolvedSpecFolder) {
   794	    const specMdPath = path.resolve(resolvedSpecFolder, 'spec.md');
   795	    if (fs.existsSync(specMdPath)) {
   796	      try {
   797	        const specContent = fs.readFileSync(specMdPath, 'utf-8');
   798	        const relatedSpecs = parseYamlListFromContent(specContent, 'related_specs');
   799	        for (const relatedSpec of relatedSpecs) {
   800	          const relatedSpecMatches = extractSpecIdCandidates(relatedSpec);
   801	          if (relatedSpecMatches.length > 0) {
   802	            relatedSpecMatches.forEach((specId) => allowedSpecIds.add(specId));
   803	            continue;
   804	          }
   805	
   806	          if (/^\d{3}-/.test(relatedSpec)) {
   807	            allowedSpecIds.add(relatedSpec.trim());
   808	          }
   809	        }
   810	      } catch (error: unknown) {
   811	        const message = error instanceof Error ? error.message : String(error);
   812	        structuredLog('warn', 'Failed to read related_specs during V8 allowlist extraction', {
   813	          specFolder,
   814	          specMdPath,
   815	          error: message,
   816	        });
   817	      }
   818	    }
   819	  }
   820	  const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
   821	  const specIdCounts = countDistinctSpecIds(bodyContent);
   822	  const keyTopics = parseYamlListFromContent(content, 'key_topics');
   823	  const frontmatterSpecCounts = countSpecIdsInValues([...triggerPhrases, ...keyTopics]);
   824	  const foreignFrontmatterMentions = [...frontmatterSpecCounts.entries()]
   825	    .filter(([specId]) => !allowedSpecIds.has(specId))
   826	    .map(([specId, count]) => `${specId} x${count}`);
   827	  let dominatesForeignSpec = false;
   828	  let scatteredForeignSpec = false;
   829	  const scatteredForeignMentions: string[] = [];
   830	  if (specIdCounts.size > 0) {
   831	    const currentSpecMentions = currentSpecId ? (specIdCounts.get(currentSpecId) ?? 0) : 0;
   832	    let strongestForeignMentions = 0;
   833	    let totalForeignMentions = 0;
   834	    for (const [specId, count] of specIdCounts.entries()) {
   835	      if (!allowedSpecIds.has(specId)) {
   836	        totalForeignMentions += count;
   837	        if (count > strongestForeignMentions) {
   838	          strongestForeignMentions = count;
   839	        }
   840	        if (count <= 2) {
   841	          scatteredForeignMentions.push(`${specId} x${count}`);
   842	        }
   843	      }
   844	    }
   845	    dominatesForeignSpec = strongestForeignMentions >= 3 && strongestForeignMentions >= currentSpecMentions + 2;
   846	    scatteredForeignSpec = scatteredForeignMentions.length >= 2 && totalForeignMentions >= 2 && strongestForeignMentions <= 2;
   847	  }
   848	
   849	  const frontmatterForeignSpec = foreignFrontmatterMentions.length > 0;
   850	  const v8Matches = [
   851	    ...(frontmatterForeignSpec ? foreignFrontmatterMentions.map((match) => `frontmatter:${match}`) : []),
   852	    ...(dominatesForeignSpec ? ['body:foreign spec ids dominate rendered content'] : []),
   853	    ...(scatteredForeignSpec ? scatteredForeignMentions.map((match) => `body-scattered:${match}`) : []),
   854	  ];
   855	  ruleResults.push({
   856	    ruleId: 'V8',
   857	    passed: v8Matches.length === 0,
   858	    message: v8Matches.length > 0
   859	      ? `spec relevance mismatch: ${v8Matches.join(', ')}`
   860	      : 'ok',
   861	  });
   862	
   863	  const titleValue = extractYamlValueFromContent(content, 'title') || extractFirstHeading(content);
   864	  const titlePatternMatch = TITLE_CONTAMINATION_PATTERNS.find(({ pattern }) => pattern.test(titleValue));
   865	  ruleResults.push({
   866	    ruleId: 'V9',
   867	    passed: !titlePatternMatch,
   868	    message: titlePatternMatch ? `contaminated title: ${titlePatternMatch.label}` : 'ok',
   869	  });
   870	
   871	  const capturedFileCount = parseYamlIntegerFromContent(content, 'captured_file_count');
   872	  const filesystemFileCount = parseYamlIntegerFromContent(content, 'filesystem_file_count');
   873	  const divergentSessionSource = hasSignificantFileCountDivergence(filesystemFileCount, capturedFileCount);
   874	  ruleResults.push({
   875	    ruleId: 'V10',
   876	    passed: !divergentSessionSource,
   877	    message: divergentSessionSource
   878	      ? `session source mismatch: filesystem_file_count=${filesystemFileCount}, captured_file_count=${capturedFileCount}`
   879	      : 'ok',
   880	  });
   881	
   882	  // V11: API error content leakage — detect error-dominated memory content
   883	  const ERROR_VOCAB = /\b(?:error|api_error|request_id|req_\w+|500|503|429|overloaded|internal.server)\b/i;
   884	  const API_ERROR_PATTERN = /\bAPI\s+Error:\s*\d{3}\b/i;
   885	  const JSON_ERROR_PATTERN = /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error|rate_limit_error|server_error)/i;
   886	  const descriptionValue = extractYamlValueFromContent(content, 'description') || '';
   887	  const hasErrorDescription = API_ERROR_PATTERN.test(descriptionValue) || JSON_ERROR_PATTERN.test(descriptionValue);
   888	  const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
   889	  const errorTriggerCount = triggerPhrases.filter((tp) => ERROR_VOCAB.test(tp)).length;
   890	  const errorDominatedTriggers = triggerPhrases.length > 0 && (errorTriggerCount / triggerPhrases.length) > 0.5;
   891	  const v11Failed = hasErrorDescription || hasErrorTitle || errorDominatedTriggers;
   892	  ruleResults.push({
   893	    ruleId: 'V11',
   894	    passed: !v11Failed,
   895	    message: v11Failed
   896	      ? `error content leakage: ${[
   897	          hasErrorDescription ? 'description' : '',
   898	          hasErrorTitle ? 'title' : '',
   899	          errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',
   900	        ].filter(Boolean).join(', ')}`
   901	      : 'ok',
   902	  });
   903	
   904	  // V12: Topical coherence — check if memory content overlaps with spec's trigger_phrases
   905	  // Skip when:
   906	  // - File is in a */memory/ directory (already validated by save pipeline, may use different terms)
   907	  // - File is a spec doc (spec.md, plan.md, checklist.md, etc.) — these define the spec itself
   908	  // - filePath is provided and matches known spec doc patterns
   909	  const isMemoryDirFile = options?.filePath ? /[/\\]memory[/\\]/.test(options.filePath) : false;
   910	  const isSpecDoc = options?.filePath
   911	    ? /[/\\](?:spec|plan|checklist|tasks|decision-record|implementation-summary|research|handover)\.md$/i.test(options.filePath)
   912	    : false;
   913	  let v12Failed = false;
   914	  let v12Message = 'ok';
   915	  if (specFolder && !isMemoryDirFile && !isSpecDoc) {
   916	    // T023: Normalize specFolder to an absolute path before resolving spec.md.
   917	    // If specFolder is already absolute, use it as-is; otherwise resolve relative
   918	    // to the current working directory.
   919	    const resolvedSpecFolder = resolveSpecFolderPath(specFolder);
   920	
   921	    // Try to find and read the spec.md file
   922	    let specTriggerPhrases: string[] = [];
   923	    if (resolvedSpecFolder) {
   924	      const specMdCandidates = [
   925	        path.resolve(resolvedSpecFolder, 'spec.md'),
   926	        // specFolder might be just a relative path or short name
   927	      ];
   928	      for (const candidate of specMdCandidates) {
   929	        if (fs.existsSync(candidate)) {
   930	          try {
   931	            const specContent = fs.readFileSync(candidate, 'utf-8');
   932	            specTriggerPhrases = parseYamlListFromContent(specContent, 'trigger_phrases');
   933	          } catch (error: unknown) {
   934	            const message = error instanceof Error ? error.message : String(error);
   935	            structuredLog('warn', 'Failed to read spec.md during V12 topical coherence validation', {
   936	              candidate,
   937	              specFolder,
   938	              error: message,
   939	            });
   940	          }

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts | sed -n '70,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    70	    causalLinks: false,
    71	    entityExtraction: false,
    72	    summaries: false,
    73	    entityLinking: false,
    74	    graphLifecycle: false,
    75	  };
    76	
    77	  // CAUSAL LINKS PROCESSING
    78	  let causalLinksResult: CausalLinksResult | null = null;
    79	  if (parsed.hasCausalLinks && parsed.causalLinks) {
    80	    try {
    81	      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
    82	      enrichmentStatus.causalLinks = true;
    83	      if (causalLinksResult.inserted > 0) {
    84	        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
    85	      }
    86	      if (causalLinksResult.unresolved.length > 0) {
    87	        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
    88	      }
    89	    } catch (causal_err: unknown) {
    90	      const message = toErrorMessage(causal_err);
    91	      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    92	    }
    93	  } else {
    94	    // No causal links to process — not a failure
    95	    enrichmentStatus.causalLinks = true;
    96	  }
    97	
    98	  // -- Auto Entity Extraction --
    99	  if (isAutoEntitiesEnabled()) {
   100	    try {
   101	      const rawEntities = extractEntities(parsed.content);
   102	      const filtered = filterEntities(rawEntities);
   103	      // Data integrity: clean stale auto-entities before re-extraction on update
   104	      const entityResult = refreshAutoEntitiesForMemory(database, id, filtered);
   105	      if (entityResult.stored > 0) {
   106	        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
   107	      }
   108	      enrichmentStatus.entityExtraction = true;
   109	    } catch (entityErr: unknown) {
   110	      const message = toErrorMessage(entityErr);
   111	      console.warn(`[memory-save] R10 entity extraction failed: ${message}`);
   112	    }
   113	  } else {
   114	    // Feature disabled — not a failure
   115	    enrichmentStatus.entityExtraction = true;
   116	  }
   117	
   118	  // -- R8: Memory Summary Generation --
   119	  if (isMemorySummariesEnabled()) {
   120	    try {
   121	      const summaryResult = await generateAndStoreSummary(
   122	        database,
   123	        id,
   124	        parsed.content,
   125	        (text: string) => embeddings.generateQueryEmbedding(text)
   126	      );
   127	      if (summaryResult.stored) {
   128	        console.error(`[memory-summaries] Generated summary for memory #${id}`);
   129	      }
   130	      enrichmentStatus.summaries = true;
   131	    } catch (summaryErr: unknown) {
   132	      const message = toErrorMessage(summaryErr);
   133	      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
   134	    }
   135	  } else {
   136	    // Feature disabled — not a failure
   137	    enrichmentStatus.summaries = true;
   138	  }
   139	
   140	  // -- S5: Cross-Document Entity Linking --

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Trigger Matcher
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Trigger phrase matching (memory_match_triggers)
     5	import type Database from 'better-sqlite3';
     6	import * as vectorIndex from '../search/vector-index.js';
     7	import { escapeRegex } from '../utils/path-security.js';
     8	
     9	/* --- 1. TYPES --- */
    10	
    11	/** Signal category detected in user prompt */
    12	export type SignalCategory = 'correction' | 'preference' | 'reinforcement' | 'neutral';
    13	
    14	/** Result of signal detection for a prompt */
    15	export interface SignalDetection {
    16	  category: SignalCategory;
    17	  keywords: string[];
    18	  boost: number;
    19	}
    20	
    21	/** Trigger cache entry for a single phrase-to-memory mapping */
    22	export interface TriggerCacheEntry {
    23	  triggerId: number;
    24	  phrase: string;
    25	  regex: RegExp;
    26	  memoryId: number;
    27	  specFolder: string;
    28	  filePath: string;
    29	  title: string | null;
    30	  importanceWeight: number;
    31	}
    32	
    33	/** Match result grouped by memory */
    34	export interface TriggerMatch {
    35	  memoryId: number;
    36	  specFolder: string;
    37	  filePath: string;
    38	  title: string | null;
    39	  importanceWeight: number;
    40	  matchedPhrases: string[];
    41	  [key: string]: unknown;
    42	}
    43	
    44	/** Match result with additional statistics */
    45	export interface TriggerMatchWithStats {
    46	  matches: TriggerMatch[];
    47	  stats: TriggerMatchStats;
    48	}
    49	
    50	/** Statistics about a trigger matching operation */
    51	export interface TriggerMatchStats {
    52	  promptLength: number;
    53	  cacheSize: number;
    54	  matchCount: number;
    55	  totalMatchedPhrases: number;
    56	  matchTimeMs: number;
    57	  signals?: SignalDetection[];
    58	  degraded?: TriggerMatcherDegradedState;
    59	}
    60	
    61	/** Cache statistics */
    62	export interface CacheStats {
    63	  size: number;
    64	  timestamp: number;
    65	  ageMs: number | null;
    66	  regexCacheSize: number;
    67	  maxRegexCacheSize: number;
    68	}
    69	
    70	export interface TriggerMatcherFailure {
    71	  code: string;
    72	  message: string;
    73	  memoryId?: number;
    74	  filePath?: string;
    75	}
    76	
    77	export interface TriggerMatcherDegradedState {
    78	  code: string;
    79	  message: string;
    80	  failedEntries: number;
    81	  failures: TriggerMatcherFailure[];
    82	}
    83	
    84	/** Memory result from getMemoriesByPhrase */
    85	export interface MemoryByPhrase {
    86	  memoryId: number;
    87	  specFolder: string;
    88	  filePath: string;
    89	  title: string | null;
    90	  importanceWeight: number;
    91	}
    92	
    93	/** Execution time log entry */
    94	export interface ExecutionLogEntry {
    95	  timestamp: string;
    96	  operation: string;
    97	  durationMs: number;
    98	  target: string;
    99	  [key: string]: unknown;
   100	}
   101	
   102	/** Trigger matcher configuration */
   103	export interface TriggerMatcherConfig {
   104	  CACHE_TTL_MS: number;
   105	  DEFAULT_LIMIT: number;
   106	  MIN_PHRASE_LENGTH: number;
   107	  MAX_PROMPT_LENGTH: number;
   108	  WARN_THRESHOLD_MS: number;
   109	  LOG_EXECUTION_TIME: boolean;
   110	  MAX_REGEX_CACHE_SIZE: number;
   111	}
   112	
   113	/* --- 2. CONFIGURATION --- */
   114	
   115	/**
   116	 * Defines the CONFIG constant.
   117	 */
   118	export const CONFIG: TriggerMatcherConfig = {
   119	  CACHE_TTL_MS: 60000,
   120	  DEFAULT_LIMIT: 3,
   121	  MIN_PHRASE_LENGTH: 3,
   122	  MAX_PROMPT_LENGTH: 5000,
   123	  WARN_THRESHOLD_MS: 30,
   124	  LOG_EXECUTION_TIME: true,
   125	  MAX_REGEX_CACHE_SIZE: 100,
   126	};
   127	
   128	/* --- 3. EXECUTION TIME LOGGING --- */
   129	
   130	/** Log hook execution time for monitoring and debugging */
   131	export function logExecutionTime(operation: string, durationMs: number, details: Record<string, unknown> = {}): ExecutionLogEntry | undefined {
   132	  if (!CONFIG.LOG_EXECUTION_TIME) {
   133	    return;
   134	  }
   135	
   136	  const logEntry: ExecutionLogEntry = {
   137	    timestamp: new Date().toISOString(),
   138	    operation,
   139	    durationMs: durationMs,
   140	    target: durationMs < 50 ? 'PASS' : 'SLOW',
   141	    ...details,
   142	  };
   143	
   144	  // Log to console for debugging
   145	  if (durationMs >= CONFIG.WARN_THRESHOLD_MS) {
   146	    console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
   147	  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
   148	    console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
   149	  }
   150	
   151	  // Return the entry for test verification
   152	  return logEntry;
   153	}
   154	
   155	/* --- 4. TRIGGER CACHE --- */
   156	
   157	// In-memory cache of trigger phrases for fast matching
   158	let triggerCache: TriggerCacheEntry[] | null = null;
   159	let triggerCandidateIndex: Map<string, Set<number>> | null = null;
   160	let cacheTimestamp: number = 0;
   161	let lastDegradedState: TriggerMatcherDegradedState | null = null;
   162	const triggerCacheLoaderStatementByConnection = new WeakMap<Database.Database, Database.Statement>();
   163	
   164	// LRU cache for regex objects to prevent memory leaks
   165	const regexLruCache: Map<string, RegExp> = new Map();
   166	const UNICODE_WORD_CHAR_CLASS = '\\p{L}\\p{N}\\p{M}';
   167	const UNICODE_TOKEN_PATTERN = /[\p{L}\p{N}\p{M}]+/gu;
   168	const CJK_SCRIPT_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
   169	const MIN_INDEX_NGRAM_SIZE = 2;
   170	const MAX_INDEX_NGRAM_SIZE = 3;
   171	const COMMON_TRIGGER_STOPWORDS = new Set([
   172	  'a', 'an', 'the', 'and', 'or', 'but',
   173	  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
   174	  'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by',
   175	]);
   176	const TRIGGER_CACHE_LOADER_SQL = `
   177	  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
   178	  FROM memory_index
   179	  WHERE embedding_status = 'success'
   180	    AND trigger_phrases IS NOT NULL
   181	    AND trigger_phrases != '[]'
   182	    AND trigger_phrases != ''
   183	  ORDER BY id ASC
   184	`;
   185	
   186	function getTriggerCacheLoaderStatement(database: Database.Database): Database.Statement {
   187	  const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
   188	  if (cachedStatement) {
   189	    return cachedStatement;
   190	  }
   191	
   192	  const statement = database.prepare(TRIGGER_CACHE_LOADER_SQL) as Database.Statement;
   193	  triggerCacheLoaderStatementByConnection.set(database, statement);
   194	  return statement;
   195	}
   196	
   197	export function normalizeTriggerText(text: string): string {
   198	  return normalizeUnicode(text, false)
   199	    .trim()
   200	    .replace(/\s+/g, ' ');
   201	}
   202	
   203	function buildBoundaryRegex(phrase: string): RegExp {
   204	  const normalizedPhrase = normalizeTriggerText(phrase);
   205	  const escaped = escapeRegex(normalizedPhrase);
   206	
   207	  // CJK text often appears in continuous sentence flow without whitespace-delimited
   208	  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
   209	  // phrases are not rejected by boundary checks on neighboring CJK characters.
   210	  if (CJK_SCRIPT_PATTERN.test(normalizedPhrase) && !/\s/u.test(normalizedPhrase)) {
   211	    return new RegExp(escaped, 'iu');
   212	  }
   213	
   214	  return new RegExp(
   215	    `(?:^|[^${UNICODE_WORD_CHAR_CLASS}])${escaped}(?:[^${UNICODE_WORD_CHAR_CLASS}]|$)`,
   216	    'iu'
   217	  );
   218	}
   219	
   220	function getUnicodeTokens(text: string): string[] {
   221	  const normalized = normalizeTriggerText(text);
   222	  if (!normalized) {
   223	    return [];
   224	  }
   225	
   226	  return Array.from(normalized.matchAll(UNICODE_TOKEN_PATTERN), (match) => match[0]);
   227	}
   228	
   229	function isSignificantIndexToken(token: string): boolean {
   230	  if (!token) {
   231	    return false;
   232	  }
   233	
   234	  return token.length >= CONFIG.MIN_PHRASE_LENGTH && !COMMON_TRIGGER_STOPWORDS.has(token);
   235	}
   236	
   237	function extractTriggerIndexKeys(text: string): string[] {
   238	  const normalized = normalizeTriggerText(text);
   239	  if (!normalized) {
   240	    return [];
   241	  }
   242	
   243	  const rawTokens = getUnicodeTokens(normalized);
   244	  const tokens = rawTokens.filter(isSignificantIndexToken);
   245	  const basis = tokens.length > 0 ? tokens : rawTokens;
   246	  const keys = new Set<string>();
   247	
   248	  for (const token of basis) {
   249	    if (token) {
   250	      keys.add(token);
   251	    }
   252	  }
   253	
   254	  for (let size = MIN_INDEX_NGRAM_SIZE; size <= MAX_INDEX_NGRAM_SIZE; size += 1) {
   255	    if (basis.length < size) {
   256	      continue;
   257	    }
   258	
   259	    for (let index = 0; index <= basis.length - size; index += 1) {
   260	      keys.add(basis.slice(index, index + size).join(' '));

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '260,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	      keys.add(basis.slice(index, index + size).join(' '));
   261	    }
   262	  }
   263	
   264	  if (keys.size === 0) {
   265	    keys.add(normalized);
   266	  }
   267	
   268	  return [...keys];
   269	}
   270	
   271	function indexTriggerEntry(entry: TriggerCacheEntry): void {
   272	  if (!triggerCandidateIndex) {
   273	    triggerCandidateIndex = new Map();
   274	  }
   275	
   276	  const keys = extractTriggerIndexKeys(entry.phrase);
   277	  for (const key of keys) {
   278	    const indexedIds = triggerCandidateIndex.get(key);
   279	    if (indexedIds) {
   280	      indexedIds.add(entry.triggerId);
   281	      continue;
   282	    }
   283	
   284	    triggerCandidateIndex.set(key, new Set([entry.triggerId]));
   285	  }
   286	}
   287	
   288	function isSpecificTriggerPhrase(phrase: string): boolean {
   289	  const normalized = normalizeTriggerText(phrase);
   290	  if (normalized.length < CONFIG.MIN_PHRASE_LENGTH) {
   291	    return false;
   292	  }
   293	
   294	  const tokens = normalized.split(/\s+/).filter(Boolean);
   295	  if (tokens.length === 0) {
   296	    return false;
   297	  }
   298	
   299	  if (tokens.length === 1) {
   300	    return !COMMON_TRIGGER_STOPWORDS.has(tokens[0]);
   301	  }
   302	
   303	  return tokens.some((token) => token.length >= CONFIG.MIN_PHRASE_LENGTH);
   304	}
   305	
   306	/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
   307	export function getCachedRegex(phrase: string): RegExp {
   308	  const normalizedPhrase = normalizeTriggerText(phrase);
   309	
   310	  // Check if already in cache
   311	  if (regexLruCache.has(normalizedPhrase)) {
   312	    // Move to end (most recently used) by deleting and re-adding
   313	    const regex = regexLruCache.get(normalizedPhrase);
   314	    if (regex) {
   315	      regexLruCache.delete(normalizedPhrase);
   316	      regexLruCache.set(normalizedPhrase, regex);
   317	      return regex;
   318	    }
   319	  }
   320	
   321	  // Unicode-aware word boundary avoids false matches across non-Latin scripts.
   322	  const regex = buildBoundaryRegex(normalizedPhrase);
   323	
   324	  // Evict oldest entry if at capacity (T015: LRU eviction)
   325	  if (regexLruCache.size >= CONFIG.MAX_REGEX_CACHE_SIZE) {
   326	    const oldestKey = regexLruCache.keys().next().value;
   327	    if (oldestKey !== undefined) {
   328	      regexLruCache.delete(oldestKey);
   329	    }
   330	  }
   331	
   332	  // Add to cache
   333	  regexLruCache.set(normalizedPhrase, regex);
   334	  return regex;
   335	}
   336	
   337	/** Load all trigger phrases from the index into memory */
   338	export function loadTriggerCache(): TriggerCacheEntry[] {
   339	  const now = Date.now();
   340	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '170,182p;1594,1602p;1916,1920p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   170	- keep JSON payload overrides wired through normalizer/collector: `phase`, `status/sessionStatus`, and completion-percent aliases must map to `projectPhase`, `sessionStatus`, and `completionPercent` to prevent stale-default warnings [Task 1]
   171	- preserve authored `SUMMARY` text as full OVERVIEW when length is `<=800` chars via `renderOverviewSummary(..., truncateOnWordBoundary(...))`; only truncate longer payloads [Task 1]
   172	- reviewer OVERVIEW extraction is robust when heading/line-scanned between section boundaries, not regex-sliced; this prevents false D1 truncation flags on valid long summaries [Task 1]
   173	- trigger phrase filtering should block short folder-like numeric shorthands while preserving longer numeric authored phrases like `014 code graph upgrades runtime` [Task 1]
   174	- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
   175	- post-save quality warning language now keys on `input_completeness_score`; keep diagnostics terminology consistent with this field [Task 1]
   176	
   177	## Failures and how to do differently
   178	
   179	- symptom: D1 false positive for truncated OVERVIEW despite full saved paragraph; cause: regex extraction capped review window; fix: switch reviewer extraction to heading-based line scanning [Task 1]
   180	- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
   181	- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]
   182	
  1594	- rollout_summaries/2026-03-20T15-43-10-Fxg6-auto_repair_temp_root_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-10-019d0bea-319e-7432-8739-3b088f450742.jsonl, updated_at=2026-03-20T17:13:04+00:00, thread_id=019d0bea-319e-7432-8739-3b088f450742)
  1595	
  1596	### keywords
  1597	
  1598	- memory_health autoRepair confirmed, temp_fixture_memory_cleanup, orphanedFiles warning, EXT-H15
  1599	
  1600	## Task 3: Preserve importance-tier overrides and harden spec-affinity matching
  1601	
  1602	### rollout_summary_files
  1916	- Partial rollout policy behavior: malformed `SPECKIT_ROLLOUT_PERCENT` should fail back to 100; 1-99% rollout must fail-closed when identity is missing/blank [Task 1]
  1917	- DB-sensitive tests are more stable when guarded with explicit `requireDbOrThrow` helpers and targeted reruns before full-suite runs [Task 2]
  1918	- `memory_health` cleanup runbook: back up DB first, clean temp-path rows/vector orphans transactionally, then re-run integrity checks and report post-clean stats [Task 2]
  1919	- Spec-description reliability pattern: reserve filenames with `O_CREAT|O_EXCL`, switch to random fallback after collision thresholds, and repair stale `description.json` during discovery [Task 3]
  1920	- Session-capture behavior from 011 review: preserve live observations over `_synthetic` ones; direct CLI runs without JSON/OpenCode session can return `NO_DATA_AVAILABLE` and should be documented as pending-runtime evidence [Task 3]

exec
/bin/zsh -lc "rg -n \"triggers:|trigger\\b\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/*.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:24:triggers:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts:25:  - "[keyword that should trigger loading this file]"

exec
/bin/zsh -lc 'rg -n "STALENESS_THRESHOLD_DAYS|DECAY_STRENGTH_AMOUNT|DECAY_PERIOD_DAYS|decay" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
49:const STALENESS_THRESHOLD_DAYS = 90;
50:const DECAY_STRENGTH_AMOUNT = 0.1;
51:const DECAY_PERIOD_DAYS = 30;
858:function getStaleEdges(thresholdDays: number = STALENESS_THRESHOLD_DAYS): CausalEdge[] {
886:  STALENESS_THRESHOLD_DAYS,
887:  DECAY_STRENGTH_AMOUNT,
888:  DECAY_PERIOD_DAYS,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '840,890p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   840	      SELECT COUNT(*) as count FROM causal_edges
   841	      WHERE source_id = ? OR target_id = ?
   842	    `) as Database.Statement).get(nodeId, nodeId) as { count: number };
   843	    return row.count;
   844	  } catch (error: unknown) {
   845	    const msg = error instanceof Error ? error.message : String(error);
   846	    console.warn(`[causal-edges] countEdgesForNode error: ${msg}`);
   847	    return 0;
   848	  }
   849	}
   850	
   851	function touchEdgeAccess(edgeId: number): void {
   852	  if (!db) return;
   853	  (db.prepare(
   854	    "UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?"
   855	  ) as Database.Statement).run(edgeId);
   856	}
   857	
   858	function getStaleEdges(thresholdDays: number = STALENESS_THRESHOLD_DAYS): CausalEdge[] {
   859	  if (!db) return [];
   860	  try {
   861	    return (db.prepare(`
   862	      SELECT * FROM causal_edges
   863	      WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
   864	         OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
   865	      ORDER BY COALESCE(last_accessed, extracted_at) ASC
   866	    `) as Database.Statement).all(thresholdDays, thresholdDays) as CausalEdge[];
   867	  } catch (error: unknown) {
   868	    const msg = error instanceof Error ? error.message : String(error);
   869	    console.warn(`[causal-edges] getStaleEdges error: ${msg}`);
   870	    return [];
   871	  }
   872	}
   873	
   874	/* ───────────────────────────────────────────────────────────────
   875	   12. EXPORTS
   876	----------------------------------------------------------------*/
   877	
   878	export {
   879	  RELATION_TYPES,
   880	  RELATION_WEIGHTS,
   881	  DEFAULT_MAX_DEPTH,
   882	  MAX_EDGES_LIMIT,
   883	  MAX_EDGES_PER_NODE,
   884	  MAX_AUTO_STRENGTH,
   885	  MAX_STRENGTH_INCREASE_PER_CYCLE,
   886	  STALENESS_THRESHOLD_DAYS,
   887	  DECAY_STRENGTH_AMOUNT,
   888	  DECAY_PERIOD_DAYS,
   889	
   890	  init,

codex
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Mex has a cleaner single hygiene surface, but our hygiene logic is richer and fragmented
- **Source**: [src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L378), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L667), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L620), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L764)
- **What it does**: Mex runs all scaffold hygiene through one deterministic pass: collect claims, run eight checker families, then compute one score from severity costs. Our system spreads hygiene across multiple entry points: `memory_health` for DB/FTS/vector/alias integrity, `memory_causal_stats` for graph coverage/orphans, `post-save-review` for saved-metadata drift, and `validate-memory-quality` for rendered-memory quality.
- **Why it matters for us**: Mex is weaker semantically, but much easier to audit operationally. Today we have better hygiene rules, but no single “memory hygiene report” that tells an operator where the system is drifting overall.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 2: Mex does not have a real trigger system; our trigger stack is an actual scoped retrieval subsystem
- **Source**: [src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L176), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L288), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L337), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L291)
- **What it does**: In Mex, `triggers:` only appears in the pattern template and the router contract; there is no runtime loader, no trigger matcher, no trigger health report, and no scope-aware recall path. Our stack loads persisted `trigger_phrases`, normalizes them, drops non-specific phrases, builds a candidate index, exposes degraded-state stats, rejects untrusted session IDs, fail-closes on scope filtering, and can layer cognitive decay and signal boosts on top.
- **Why it matters for us**: Mex contributes almost nothing to trigger hygiene beyond authoring intent. Replacing our trigger path with Mex-style markdown triggers would be a major retrieval regression.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Our trigger hygiene is already stricter than Mex’s scaffold hygiene, but it is mostly hidden in save-time review code
- **Source**: [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L664), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L901), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L764)
- **What it does**: We already lint trigger hygiene aggressively after save: path-fragment detection, missing authored phrases, frontmatter-versus-metadata drift, unsanitized junk, duplicate phrases, empty trigger sets on dense saves, and error-dominated trigger leakage. Mex’s drift engine has no comparable checker for trigger quality or trigger/render parity.
- **Why it matters for us**: The hygiene gap is not “we need Mex-style trigger rules”; it is “we should expose our existing trigger rules in a recurring operator-facing audit instead of only during save flows.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Our causal-link hygiene is a true graph lifecycle; Mex frontmatter edges are only dead-link validation
- **Source**: [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L674), [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts#L77), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L18), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L173), [contradiction-detection.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts#L33), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L688), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L501)
- **What it does**: Mex checks whether YAML `edges.target` files exist. Our system parses `causalLinks` from saved memory, inserts typed relations, caps auto-edge fanout and strength, auto-invalidates contradictory relations, tracks coverage/orphans, and wires orphan-edge cleanup into `memory_health`.
- **Why it matters for us**: Mex is useful as a reminder that cheap dead-reference checks matter, but it has no equivalent to our lineage graph, contradiction handling, or graph maintenance. The reusable idea is lightweight broken-reference auditing, not the causal model itself.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex surfaces staleness much better than we do, even though our graph already has latent stale-edge primitives
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L49), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L858), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L382)
- **What it does**: Mex turns staleness into first-class hygiene: every scaffold file can error at 90 days or 200 commits, and warn at 30 days or 50 commits. Our stack already tracks stale causal edges via `last_accessed` and threshold constants, but `memory_health` does not surface stale memories, stale triggers, or stale causal edges as operator-visible hygiene signals.
- **Why it matters for us**: This is the clearest hygiene blind spot in our current stack. We are strong on correctness and repair, but weak on “this memory is still valid, yet probably old and should be reviewed.”
- **Recommendation**: prototype later
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/drift/checkers/](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts)
- [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts)
- [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
- [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [contradiction-detection.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts)
- [save/post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts)
- [scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [scripts/lib/validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.71
- Questions addressed: whether Mex contributes trigger hygiene, whether Mex adds anything meaningful to causal-link hygiene, how Mex health/drift reporting compares to `memory_health`, whether staleness is better surfaced in Mex than in our stack, whether our existing save-path quality logic already exceeds Mex on memory hygiene.
- Questions answered: Mex’s real hygiene advantage is unified static drift reporting, not trigger or causal semantics; Mex has no executable trigger subsystem; our trigger hygiene is already materially stricter but not surfaced as a recurring audit; our causal graph hygiene is substantially stronger than Mex’s frontmatter-edge model; staleness reporting is the biggest hygiene gap where Mex is ahead operationally.

## Reflection
- What worked: reading Mex from drift engine outward and then mapping the same hygiene axis onto `memory_health`, `memory_causal_stats`, trigger matching, and post-save review made the comparison much sharper than README-level feature matching.
- What did not work: Mex has almost no trigger implementation to trace, so part of the comparison is necessarily absence-based; I did not rerun phase-folder validators in this read-only iteration because the focus was source comparison rather than packet mutation or closeout.

## Recommended Next Focus
Design a single `memory_hygiene_report` surface that composes our existing trigger-review, causal-graph, integrity, alias-divergence, and stale-edge signals, then compare Modus Memory or Mnemosyne specifically on stale-memory scoring and operator-facing hygiene reporting.


hook: Stop
hook: Stop Completed
tokens used
115,504
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Mex has a cleaner single hygiene surface, but our hygiene logic is richer and fragmented
- **Source**: [src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L378), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L667), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L620), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L764)
- **What it does**: Mex runs all scaffold hygiene through one deterministic pass: collect claims, run eight checker families, then compute one score from severity costs. Our system spreads hygiene across multiple entry points: `memory_health` for DB/FTS/vector/alias integrity, `memory_causal_stats` for graph coverage/orphans, `post-save-review` for saved-metadata drift, and `validate-memory-quality` for rendered-memory quality.
- **Why it matters for us**: Mex is weaker semantically, but much easier to audit operationally. Today we have better hygiene rules, but no single “memory hygiene report” that tells an operator where the system is drifting overall.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 2: Mex does not have a real trigger system; our trigger stack is an actual scoped retrieval subsystem
- **Source**: [src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L21), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L43), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L176), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L288), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L337), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L291)
- **What it does**: In Mex, `triggers:` only appears in the pattern template and the router contract; there is no runtime loader, no trigger matcher, no trigger health report, and no scope-aware recall path. Our stack loads persisted `trigger_phrases`, normalizes them, drops non-specific phrases, builds a candidate index, exposes degraded-state stats, rejects untrusted session IDs, fail-closes on scope filtering, and can layer cognitive decay and signal boosts on top.
- **Why it matters for us**: Mex contributes almost nothing to trigger hygiene beyond authoring intent. Replacing our trigger path with Mex-style markdown triggers would be a major retrieval regression.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Our trigger hygiene is already stricter than Mex’s scaffold hygiene, but it is mostly hidden in save-time review code
- **Source**: [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L664), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L807), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L901), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L764)
- **What it does**: We already lint trigger hygiene aggressively after save: path-fragment detection, missing authored phrases, frontmatter-versus-metadata drift, unsanitized junk, duplicate phrases, empty trigger sets on dense saves, and error-dominated trigger leakage. Mex’s drift engine has no comparable checker for trigger quality or trigger/render parity.
- **Why it matters for us**: The hygiene gap is not “we need Mex-style trigger rules”; it is “we should expose our existing trigger rules in a recurring operator-facing audit instead of only during save flows.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Our causal-link hygiene is a true graph lifecycle; Mex frontmatter edges are only dead-link validation
- **Source**: [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L674), [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts#L77), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L18), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L173), [contradiction-detection.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts#L33), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L688), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L501)
- **What it does**: Mex checks whether YAML `edges.target` files exist. Our system parses `causalLinks` from saved memory, inserts typed relations, caps auto-edge fanout and strength, auto-invalidates contradictory relations, tracks coverage/orphans, and wires orphan-edge cleanup into `memory_health`.
- **Why it matters for us**: Mex is useful as a reminder that cheap dead-reference checks matter, but it has no equivalent to our lineage graph, contradiction handling, or graph maintenance. The reusable idea is lightweight broken-reference auditing, not the causal model itself.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex surfaces staleness much better than we do, even though our graph already has latent stale-edge primitives
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L49), [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts#L858), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L382)
- **What it does**: Mex turns staleness into first-class hygiene: every scaffold file can error at 90 days or 200 commits, and warn at 30 days or 50 commits. Our stack already tracks stale causal edges via `last_accessed` and threshold constants, but `memory_health` does not surface stale memories, stale triggers, or stale causal edges as operator-visible hygiene signals.
- **Why it matters for us**: This is the clearest hygiene blind spot in our current stack. We are strong on correctness and repair, but weak on “this memory is still valid, yet probably old and should be reviewed.”
- **Recommendation**: prototype later
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/drift/checkers/](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers)
- [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts)
- [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts)
- [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
- [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [contradiction-detection.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts)
- [save/post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts)
- [scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [scripts/lib/validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)

## Assessment
- New information ratio: 0.71
- Questions addressed: whether Mex contributes trigger hygiene, whether Mex adds anything meaningful to causal-link hygiene, how Mex health/drift reporting compares to `memory_health`, whether staleness is better surfaced in Mex than in our stack, whether our existing save-path quality logic already exceeds Mex on memory hygiene.
- Questions answered: Mex’s real hygiene advantage is unified static drift reporting, not trigger or causal semantics; Mex has no executable trigger subsystem; our trigger hygiene is already materially stricter but not surfaced as a recurring audit; our causal graph hygiene is substantially stronger than Mex’s frontmatter-edge model; staleness reporting is the biggest hygiene gap where Mex is ahead operationally.

## Reflection
- What worked: reading Mex from drift engine outward and then mapping the same hygiene axis onto `memory_health`, `memory_causal_stats`, trigger matching, and post-save review made the comparison much sharper than README-level feature matching.
- What did not work: Mex has almost no trigger implementation to trace, so part of the comparison is necessarily absence-based; I did not rerun phase-folder validators in this read-only iteration because the focus was source comparison rather than packet mutation or closeout.

## Recommended Next Focus
Design a single `memory_hygiene_report` surface that composes our existing trigger-review, causal-graph, integrity, alias-divergence, and stale-edge signals, then compare Modus Memory or Mnemosyne specifically on stale-memory scoring and operator-facing hygiene reporting.
