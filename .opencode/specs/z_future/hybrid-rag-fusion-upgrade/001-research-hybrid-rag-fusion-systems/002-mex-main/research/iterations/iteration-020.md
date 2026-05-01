### Finding 6: Mex’s single drift score should not become a primary health signal in Spec Kit [Rank 6: medium x high, negative]
- **Source**: [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L14), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L246), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1031)
- **What it does**: Mex starts at `100` and subtracts `10/3/1` for error/warning/info, regardless of whether the issue is a hard trust break or mild hygiene noise.
- **Why it matters for us**: Spec Kit already distinguishes blocked, degraded, exact, estimated, unknown, and rejected states. A single number would blur meaningful contract differences and could make a partially unsafe surface look “mostly fine.”
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md), [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md), [SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts), [sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts), [SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md)

## Assessment
- New information ratio: 0.77
- Questions addressed: impact-ranked subset selection; which Mex mechanisms survive contact with Spec Kit’s trust model; where false-positive risk becomes too high; what a realistic adoption sequence looks like.
- Questions answered: the only clear `adopt now` item is static reference integrity built on typed claim extraction. Freshness is the next best candidate, but only with explicit degraded/unknown semantics. Repair briefing is worth building as a new Spec Kit feature. Command/dependency/script parity needs a separate inventory abstraction first. Auto-growth and a single drift score should stay out.

## Reflection
- What worked: tracing source in execution order and pairing checker implementations with tests made the real boundaries obvious very quickly.
- What did not work: the CocoIndex semantic pass did not produce usable output in this run, so the final ranking stayed grounded in direct source tracing. The strict phase validation passed, but the script emitted a sandbox warning about creating a temp here-doc file before finishing with `Errors: 0 Warnings: 0 RESULT: PASSED`.

## Recommended Next Focus
1. Sprint 1: ship a narrow `validate.sh` or `memory_health` extension for packet-local `path`/`edge`/`index` integrity only, with severity-first reporting and no composite score.
2. Sprint 2: prototype freshness as a supplemental signal with `exact` vs `unknown/degraded` provenance, using both days and commit-count thresholds and explicit git-failure surfacing.
3. Sprint 3: build a provider-neutral repair-brief generator that consumes failed checks and emits auditable, packet-local fix briefs instead of launching an interactive CLI loop.
4. Defer until after those land: broader command/dependency/coverage audits, and only after a shared inventory model exists across npm, Python, shell, MCP commands, wrappers, and spec docs.
5. Keep rejected: automatic pattern/context growth from task completion, and any single-number health score as the primary truth surface.

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
# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.

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
I’m treating this as a read-only final synthesis pass: I’ll verify the relevant repo instructions, do a quick memory pass for prior context, then trace the external Mex source and our Spec Kit handlers side by side so the classifications are grounded in code rather than README claims.
exec
/bin/zsh -lc 'rg -n "mex|hybrid-rag-fusion|drift|staleness|pattern add|sync brief|script-coverage|index-sync" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "pwd && rg --files -g 'AGENTS.md' -g 'CLAUDE.md' . /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external /Users/michelkerkmeester/.codex/memories | sed 's#"'^./##'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 132ms:
CLAUDE.md
AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md

codex
I’ve confirmed the repo has both root and `external/` instruction files, and the memory registry only has broad hybrid-RAG drift references, not prior Mex-specific conclusions. Next I’m reading the scoped instructions plus the exact source files that implement the final classification surfaces.
exec
/bin/zsh -lc "sed -n '1,220p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work.  **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`** — NEVER manually create memory files.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **Code Search Decision Tree** (MANDATORY):
  - Semantic/concept search → `mcp__cocoindex_code__search` (CocoIndex). Skill: `.opencode/skill/mcp-coco-index/`
  - Structural queries (callers, imports, deps) → `code_graph_query` (Code Graph)
  - Exact text/regex → `Grep`

**GIT WORKFLOW:** 
Full details: `.opencode/skill/sk-git/`
- Worktree setup, conventional commits, PR creation, branch management
- Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | Semantic/concept → `CocoIndex search` · Structural (callers/imports/deps) → `code_graph_query` · Exact text → `Grep` · File paths → `Glob` · Read contents → `Read` |
| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume", specFolder })` → Review checklist → Continue |
| **Save context**          | `/memory:save` OR compose JSON → `generate-context.js --json '<data>' [spec-folder]` → Auto-indexed |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify                            |
| **Web code**              | sk-code-web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → `create.sh --phase` → Populate → Plan first child  |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init state → Loop (@deep-research iterations) → Convergence → Synthesize → Memory save                            |
| **Deep review**           | `/spec_kit:deep-review` → Init state → Loop (@deep-review iterations) → Convergence → Synthesize → Memory save                                |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                            |
| **Constitutional memory** | `/memory:learn` → Constitutional memory manager: create, list, edit, remove, budget                                               |
| **Shared memory**         | `/memory:manage shared` → Shared-memory lifecycle: create spaces, manage memberships, inspect rollout                                    |

## Context Recovery

These recovery steps are universal across Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI.

### After Context Compaction Or `/clear`

1. **FIRST ACTION** — call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
2. Review the recovered state: current task, spec folder, blockers, and next steps
3. Re-read the active runtime-specific instructions if they exist (`CODEX.md`, `GEMINI.md`, `.claude/CLAUDE.md`, runtime agent docs)
4. Present a concise recovered summary and WAIT for confirmation before proceeding

### Coding Analysis Lenses 

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

#### GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT] BLOCK
Trigger: EACH new user message (re-evaluate even in ongoing conversations)
1. Call `memory_match_triggers(prompt)` → Surface relevant context
2. Classify intent: Research or Implementation
3. Parse request → Check confidence AND uncertainty (see §4)
4. **Dual-threshold:** confidence ≥ 0.70 AND uncertainty ≤ 0.35 → PROCEED. Either fails → INVESTIGATE (max 3 iterations) → ESCALATE. Simple: <40% ASK | 40-69% CAUTION | ≥70% PASS

> Gate 1 is SOFT — if file modification detected, Gate 3 (HARD) takes precedence. Ask spec folder question BEFORE analysis.

####  GATE 2: SKILL ROUTING [REQUIRED for non-trivial tasks]
1. A) Run: `python3 .opencode/skill/scripts/skill_advisor.py "[request]" --threshold 0.8`
2. B) Cite user's explicit direction: "User specified: [exact quote]"
- Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed
- Output: `SKILL ROUTING: [result]` or `SKILL ROUTING: User directed → [name]`
- Skip: trivial queries only (greetings, single-line questions)

#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK — PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Triggers:** rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase — or any task resulting in file changes
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **DO NOT** use Read/Edit/Write/Bash (except Gate Actions) before asking. ASK FIRST, wait for response, THEN proceed
- **Phase boundary:** Gate 3 answers apply ONLY within current workflow phase. Plan→implement transition MUST re-evaluate. Exception: carry-over IS valid for Memory Save Rule

#### CONSOLIDATED QUESTION PROTOCOL
When multiple inputs are needed, consolidate into a SINGLE prompt — never split across messages. Include only applicable questions; omit when pre-determined.
- **Round-trip optimization** — Only 1 user interaction needed for setup
- **First Message Protocol** — ALL questions asked BEFORE any analysis or tool calls
- **Violation:** Multiple separate prompts → STOP, apologize, re-present as single prompt
- **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading; Level 1 tasks skip completion verification

---

### 🔒 POST-EXECUTION RULES

#### MEMORY SAVE RULE [HARD] BLOCK
Trigger: "save context", "save memory", `/memory:save`, memory file creation
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Script:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - AI composes structured JSON with session context, writes to `/tmp/save-context-data.json`, passes as first arg. Alternatively use `--json '<inline-json>'` or `--stdin`. The AI has strictly better information about its own session than any DB extraction.
  - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents)
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()`
- **Violation:** Write tool on `memory/` path → DELETE and re-run via script
- **Post-Save Review:** After `generate-context.js` completes, check the POST-SAVE QUALITY REVIEW output.
  - **HIGH** issues: MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)
  - **MEDIUM** issues: patch when practical
  - **PASSED/SKIPPED**: no action needed

#### COMPLETION VERIFICATION RULE [HARD] BLOCK
Trigger: Claiming "done", "complete", "finished", "works"
1. Validation runs automatically on spec folder (if exists)
2. Load `checklist.md` → Verify ALL items → Mark `[x]` with evidence
- Skip: Level 1 tasks (no checklist.md required) | Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix)

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT

#### Self-Check (before ANY tool-using response):
- [ ] File modification? Asked spec folder question?
- [ ] Skill routing verified?
- [ ] Saving memory? Using `generate-context.js` (not Write tool)?
- [ ] Aligned with ORIGINAL request? No scope drift?
- [ ] Claiming completion? `checklist.md` verified?

---

## 3. 📝 CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details:** system-spec-kit SKILL.md (§1 When to Use, §3 How it Works, §4 Rules)

### Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500           | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

> **Note:** `implementation-summary.md` is REQUIRED for all levels but created **after implementation completes**, not at spec folder creation time. See SKILL.md §4 Rule 13.

**Rules:** When in doubt → higher level. LOC is soft guidance (risk/complexity can override). Single typo/whitespace fixes (<5 characters in one file) are exempt.

**Spec folder path:** `specs/[###-short-name]/` | **Templates:** `.opencode/skill/system-spec-kit/templates/`

**For details on:** folder structure, `scratch/` vs `memory/` usage, sub-folder versioning, checklist verification (P0/P1/P2), and completion workflow — see system-spec-kit SKILL.md §3.

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

**Core Principle:** If confidence < 80%, pause and ask for clarification with multiple-choice options.

| Confidence   | Action                                       |
| ------------ | -------------------------------------------- |
| **≥80%**     | Proceed with citable source                  |
| **40-79%**   | Proceed with caveats                         |
| **<40%**     | Ask for clarification or mark "UNKNOWN"      |
| **Override** | Blockers/conflicts → ask regardless of score |

**Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?"

**Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step.

---

## 5. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK


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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '450,490p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- rollout_summaries/2026-04-03T11-59-45-KehP-041_recursive_agent_loop_rename.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-59-45-019d5336-ad92-7812-9658-b4a1b290dbb9.jsonl, updated_at=2026-04-04T07:00:23+00:00, thread_id=019d5336-ad92-7812-9658-b4a1b290dbb9)

### keywords

- 041-sk-recursive-agent-loop, packet-rename, descriptions.json, validate.sh --strict, historical research memory rewrite, skip spec folder

## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)

### keywords

- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog

## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T10-45-55-qAti-rename_040_spec_references.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-45-55-019d52f3-14c7-7010-9b34-a491a18d8448.jsonl, updated_at=2026-04-03T11:27:03+00:00, thread_id=019d52f3-14c7-7010-9b34-a491a18d8448)

### keywords

- 040-sk-auto-deep-research-review-improvement, ensureDescriptionCache, descriptions.json, E_LINEAGE, skip spec folder, perl -0pi

## Task 4: Rename parent spec folders and rebuild `.opencode/specs/descriptions.json` with full-surface path sweeps, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-05T07-09-09-UzOl-specs_parent_index_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T09-09-09-019d5c79-58a8-76c2-b111-f738e245cffd.jsonl, updated_at=2026-04-05T09:42:28+00:00, thread_id=019d5c79-58a8-76c2-b111-f738e245cffd)

### keywords

- 01--anobel.com to 00--anobel.com, drop numeric prefixes, .opencode/specs/descriptions.json, ensureDescriptionCache, git rm -r --cached, skip spec folder

## Task 5: Stage, commit, and push rename/cleanup waves directly to `main` with explicit branch-rule warning reporting, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)

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
I’ve got the instruction surfaces. The external scaffold docs are template-like, so the real signal is going to come from the TypeScript flow and checker implementations; I’m validating the phase folder and then tracing CLI, drift, scanner, sync, and checker code with line numbers for the final synthesis.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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


exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md && printf '\\n---SETUP---\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md && printf '\\n---SYNC---\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---SETUP---
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

---SYNC---
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
 succeeded in 1824ms:

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


2026-04-10T20:38:53.533065Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 67
codex
The phase validator is still running, and the first semantic search attempt didn’t return usable output in this session. I’m continuing with direct source tracing so the synthesis doesn’t depend on the index, and I’ll poll the validator result alongside that.
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,260p' && printf '\\n---CLAIMS---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,260p' && printf '\\n---FRONTMATTER---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,220p' && printf '\\n---SCORING---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---CLAIMS---
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

---FRONTMATTER---
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

---SCORING---
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
The validator passed with the same temp-file warning pattern the brief mentioned: `cannot create temp file for here document: Operation not permitted`, but it still reported `Errors: 0  Warnings: 0  RESULT: PASSED`. I’ve now confirmed the CLI and drift engine split pretty cleanly into setup, static checks, targeted repair, and scaffold growth, so I’m drilling into the individual checker logic and our current Spec Kit surfaces for a strict comparison.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,260p' && printf '\\n---MANIFEST---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---MANIFEST---
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,280p' && printf '\\n---BRIEF BUILDER---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,320p' && printf '\\n---PATTERN---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---BRIEF BUILDER---
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

---PATTERN---
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
/bin/zsh -lc 'for f in path edges index-sync staleness command dependency cross-file script-coverage; do echo "---$f---"; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/$f.ts | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---path---
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
---edges---
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
---index-sync---
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
---staleness---
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
---command---
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
---dependency---
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
---cross-file---
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
---script-coverage---
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,320p' && printf '\\n---TRIGGERS---\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---TRIGGERS---
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '1,360p' && printf '\\n---CAUSAL---\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---CAUSAL---
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Causal Links Processor
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	// ───────────────────────────────────────────────────────────────────
     6	// 1. IMPORTS
     7	// ───────────────────────────────────────────────────────────────────
     8	
     9	import type BetterSqlite3 from 'better-sqlite3';
    10	
    11	import type { CausalLinks } from '../lib/parsing/memory-parser.js';
    12	import * as causalEdges from '../lib/storage/causal-edges.js';
    13	import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
    14	import { toErrorMessage } from '../utils/index.js';
    15	import { escapeLikePattern } from './handler-utils.js';
    16	
    17	// Feature catalog: Causal edge creation (memory_causal_link)
    18	// Feature catalog: Causal edge deletion (memory_causal_unlink)
    19	// Feature catalog: Memory indexing (memory_save)
    20	
    21	// ───────────────────────────────────────────────────────────────────
    22	// 2. TYPES
    23	// ───────────────────────────────────────────────────────────────────
    24	
    25	interface CausalLinkMapping {
    26	  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
    27	  reverse: boolean;
    28	}
    29	
    30	interface CausalLinksResult {
    31	  processed: number;
    32	  inserted: number;
    33	  resolved: number;
    34	  unresolved: { type: string; reference: string }[];
    35	  errors: { type: string; reference: string; error: string }[];
    36	}
    37	
    38	interface MemoryIdRow {
    39	  id: number;
    40	}
    41	
    42	interface PathLookupRow extends MemoryIdRow {
    43	  canonical_file_path: string | null;
    44	  file_path: string | null;
    45	}
    46	
    47	interface TitleLookupRow extends MemoryIdRow {
    48	  title: string | null;
    49	}
    50	
    51	interface PreparedReference {
    52	  original: string;
    53	  trimmed: string;
    54	  normalizedReference: string;
    55	  normalizedLower: string;
    56	  escapedLike: string;
    57	  numericId: number | null;
    58	  isSessionLike: boolean;
    59	  isPathLike: boolean;
    60	}
    61	
    62	// ───────────────────────────────────────────────────────────────────
    63	// 3. CONSTANTS
    64	// ───────────────────────────────────────────────────────────────────
    65	
    66	const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
    67	  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
    68	  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
    69	  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
    70	  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
    71	  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
    72	};
    73	
    74	// ───────────────────────────────────────────────────────────────────
    75	// 4. HELPERS
    76	// ───────────────────────────────────────────────────────────────────
    77	
    78	/** Resolve a memory reference (ID, path, or title) to a numeric memory ID */
    79	function resolveMemoryReference(database: BetterSqlite3.Database, reference: string): number | null {
    80	  const resolved = resolveMemoryReferencesBatch(database, [reference]).get(reference);
    81	  return typeof resolved === 'number' ? resolved : null;
    82	}
    83	
    84	function buildPreparedReference(reference: string): PreparedReference | null {
    85	  if (!reference || typeof reference !== 'string') {
    86	    return null;
    87	  }
    88	
    89	  const trimmed = reference.trim();
    90	  if (!trimmed) {
    91	    return null;
    92	  }
    93	
    94	  const normalizedReference = trimmed.replace(/\\/g, '/');
    95	  const normalizedLower = normalizedReference.toLowerCase();
    96	  const numericId = /^\d+$/.test(trimmed) ? Number.parseInt(trimmed, 10) : null;
    97	
    98	  return {
    99	    original: reference,
   100	    trimmed,
   101	    normalizedReference,
   102	    normalizedLower,
   103	    escapedLike: escapeLikePattern(normalizedReference),
   104	    numericId: Number.isFinite(numericId) ? numericId : null,
   105	    isSessionLike: normalizedLower.includes('session') || /^\d{4}-\d{2}-\d{2}/.test(normalizedReference),
   106	    isPathLike:
   107	      normalizedLower.includes('specs/')
   108	      || normalizedLower.includes('memory/')
   109	      || normalizedReference.includes('/'),
   110	  };
   111	}
   112	
   113	function buildPathExactCandidates(normalizedReference: string): string[] {
   114	  const candidates = new Set<string>();
   115	
   116	  const canonical = getCanonicalPathKey(normalizedReference);
   117	  const trimmedLeadingSlash = normalizedReference.replace(/^\/+/, '');
   118	
   119	  candidates.add(normalizedReference);
   120	  candidates.add(canonical);
   121	  candidates.add(trimmedLeadingSlash);
   122	  if (!normalizedReference.startsWith('/')) {
   123	    candidates.add(`/${normalizedReference}`);
   124	  }
   125	  if (!canonical.startsWith('/')) {
   126	    candidates.add(`/${canonical}`);
   127	  }
   128	
   129	  return Array.from(candidates).filter((candidate) => candidate.length > 0);
   130	}
   131	
   132	function buildInClause(values: readonly unknown[]): string {
   133	  return values.map(() => '?').join(', ');
   134	}
   135	
   136	function getMemoryIndexColumns(database: BetterSqlite3.Database): Set<string> {
   137	  const rows = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name?: string }>;
   138	  return new Set(rows.map((row) => row.name).filter((name): name is string => typeof name === 'string'));
   139	}
   140	
   141	/** Resolve many memory references in batch (exact first, fuzzy fallback). */
   142	function resolveMemoryReferencesBatch(
   143	  database: BetterSqlite3.Database,
   144	  references: readonly string[],
   145	): Map<string, number | null> {
   146	  const resolved = new Map<string, number | null>();
   147	  const preparedRefs: PreparedReference[] = [];
   148	  const memoryIndexColumns = getMemoryIndexColumns(database);
   149	  const hasCanonicalFilePath = memoryIndexColumns.has('canonical_file_path');
   150	
   151	  for (const reference of references) {
   152	    const prepared = buildPreparedReference(reference);
   153	    if (!prepared) {
   154	      resolved.set(reference, null);
   155	      continue;
   156	    }
   157	    preparedRefs.push(prepared);
   158	    resolved.set(reference, null);
   159	  }
   160	
   161	  if (preparedRefs.length === 0) {
   162	    return resolved;
   163	  }
   164	
   165	  const unresolved = (reference: PreparedReference): boolean => {
   166	    return !resolved.has(reference.original) || resolved.get(reference.original) == null;
   167	  };
   168	
   169	  const setResolved = (reference: PreparedReference, id: number | null): void => {
   170	    if (typeof id === 'number' && Number.isFinite(id)) {
   171	      resolved.set(reference.original, id);
   172	    }
   173	  };
   174	
   175	  // 1) Batch numeric IDs
   176	  const numericIds = Array.from(
   177	    new Set(preparedRefs.map((ref) => ref.numericId).filter((id): id is number => typeof id === 'number')),
   178	  );
   179	  if (numericIds.length > 0) {
   180	    const numericRows = database.prepare(`
   181	      SELECT id
   182	      FROM memory_index
   183	      WHERE id IN (${buildInClause(numericIds)})
   184	    `).all(...numericIds) as MemoryIdRow[];
   185	    const foundIds = new Set(numericRows.map((row) => row.id));
   186	    for (const ref of preparedRefs) {
   187	      if (!unresolved(ref) || ref.numericId == null) {
   188	        continue;
   189	      }
   190	      if (foundIds.has(ref.numericId)) {
   191	        setResolved(ref, ref.numericId);
   192	      }
   193	    }
   194	  }
   195	
   196	  // 2) Batch exact path matches via canonical_file_path/file_path equality
   197	  const pathCandidates = new Set<string>();
   198	  const pathCandidateRefs = new Map<string, PreparedReference[]>();
   199	  for (const ref of preparedRefs) {
   200	    if (!unresolved(ref) || (!ref.isPathLike && !ref.isSessionLike)) {
   201	      continue;
   202	    }
   203	
   204	    for (const candidate of buildPathExactCandidates(ref.normalizedReference)) {
   205	      pathCandidates.add(candidate);
   206	      const current = pathCandidateRefs.get(candidate) ?? [];
   207	      current.push(ref);
   208	      pathCandidateRefs.set(candidate, current);
   209	    }
   210	  }
   211	
   212	  if (pathCandidates.size > 0) {
   213	    const values = Array.from(pathCandidates);
   214	    const inClause = buildInClause(values);
   215	    const pathRows = hasCanonicalFilePath
   216	      ? database.prepare(`
   217	        SELECT id, canonical_file_path, file_path
   218	        FROM memory_index
   219	        WHERE canonical_file_path IN (${inClause})
   220	           OR file_path IN (${inClause})
   221	        ORDER BY id DESC
   222	      `).all(...values, ...values) as PathLookupRow[]
   223	      : database.prepare(`
   224	        SELECT id, NULL AS canonical_file_path, file_path
   225	        FROM memory_index
   226	        WHERE file_path IN (${inClause})
   227	        ORDER BY id DESC
   228	      `).all(...values) as PathLookupRow[];
   229	
   230	    const idByCandidate = new Map<string, number>();
   231	    for (const row of pathRows) {
   232	      const rowKeys = [row.canonical_file_path, row.file_path].filter((value): value is string => typeof value === 'string');
   233	      for (const rowKey of rowKeys) {
   234	        if (!idByCandidate.has(rowKey)) {
   235	          idByCandidate.set(rowKey, row.id);
   236	        }
   237	      }
   238	    }
   239	
   240	    for (const [candidate, refs] of pathCandidateRefs.entries()) {
   241	      const id = idByCandidate.get(candidate);
   242	      if (typeof id !== 'number') {
   243	        continue;
   244	      }
   245	      for (const ref of refs) {
   246	        if (unresolved(ref)) {
   247	          setResolved(ref, id);
   248	        }
   249	      }
   250	    }
   251	  }
   252	
   253	  // 3) Batch exact title matches
   254	  const titleCandidates = Array.from(new Set(
   255	    preparedRefs
   256	      .filter((ref) => unresolved(ref))
   257	      .map((ref) => ref.trimmed),
   258	  ));
   259	
   260	  if (titleCandidates.length > 0) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts | sed -n '980,1085p' && printf '\\n---QUALITY---\\n' && nl -ba .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   980	          field: 'git_provenance',
   981	          message: `expected git provenance fields are missing: ${missingFields.join(', ')}`,
   982	          fix: 'Keep JSON-mode provenance extraction authoritative and pass provenanceExpected into the reviewer contract',
   983	        });
   984	      }
   985	    }
   986	
   987	    // CHECK-D8: overview TOC / comment anchor consistency.
   988	    const overviewAnchorSurfacePresent = overview.length > 0
   989	      || anchorState.tocTarget !== null
   990	      || anchorState.comment !== null
   991	      || anchorState.closingComment !== null;
   992	    if (
   993	      overviewAnchorSurfacePresent &&
   994	      (
   995	        anchorState.tocTarget !== 'overview'
   996	        || anchorState.comment !== 'overview'
   997	        || anchorState.closingComment !== 'overview'
   998	      )
   999	    ) {
  1000	      issues.push({
  1001	        checkId: 'D8',
  1002	        severity: 'MEDIUM',
  1003	        field: 'anchors',
  1004	        message: `OVERVIEW anchor mismatch (toc=${anchorState.tocTarget ?? 'missing'}, comment=${anchorState.comment ?? 'missing'}, closing=${anchorState.closingComment ?? 'missing'})`,
  1005	        fix: 'Keep the OVERVIEW TOC target and comment anchors aligned on "overview"',
  1006	      });
  1007	    }
  1008	
  1009	    emitGuardrailTelemetry(issues, {
  1010	      inputMode: normalizedInputMode,
  1011	      saveMode,
  1012	      provenanceExpected,
  1013	      overviewLength: overview.length,
  1014	      d3Counts,
  1015	      continuationPattern,
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

---QUALITY---
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
   281	 * is detected. The parse error is meant to be surfaced as a V13 rule failure,
   282	 * not thrown as an exception (T018).
   283	 */
   284	function extractAndValidateFrontMatter(content: string): { raw: string; parseError: string | null } {
   285	  const raw = extractFrontMatter(content);
   286	  if (!raw) {
   287	    return { raw: '', parseError: null };
   288	  }
   289	  try {
   290	    const parseError = validateFrontMatterSyntax(raw);
   291	    return { raw, parseError };
   292	  } catch (err: unknown) {
   293	    // Convert any unexpected exception into a structured failure (T018)
   294	    const parseError = `unexpected parse error: ${err instanceof Error ? err.message : String(err)}`;
   295	    return { raw, parseError };
   296	  }
   297	}
   298	
   299	function stripCodeSegments(content: string): string {
   300	  return content
   301	    .replace(/```[\s\S]*?```/g, '\n')
   302	    .replace(/`[^`\n]+`/g, ' ');
   303	}
   304	
   305	function extractYamlValue(frontMatter: string, key: string): string | null {
   306	  const parsedFrontMatter = parseYamlMapping(frontMatter);
   307	  const parsedValue = parsedFrontMatter?.[key];
   308	  if (typeof parsedValue === 'string' || typeof parsedValue === 'number' || typeof parsedValue === 'boolean') {
   309	    return String(parsedValue);
   310	  }
   311	
   312	  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   313	  const match = frontMatter.match(new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm'));
   314	  return match ? match[1].trim() : null;
   315	}
   316	
   317	function extractYamlValueFromContent(content: string, key: string): string | null {
   318	  const frontMatter = extractFrontMatter(content);
   319	  const direct = extractYamlValue(frontMatter, key);
   320	  if (direct) {

codex
I’ve got the core comparison surfaces now. Mex is strongest where it statically checks markdown claims against the filesystem and manifest layer; our system is stronger where trust, certainty, and blocked/degraded semantics matter. I’m pulling the remaining files that decide edge cases: git freshness behavior, checker tests, and the save-path tooling that makes our current trust model more granular.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,240p' && printf '\\n---CHECKER TESTS---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---CHECKER TESTS---
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
   281	  it("passes when INDEX and files match", () => {
   282	    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
   283	    writeFileSync(
   284	      join(tmpDir, "patterns/INDEX.md"),
   285	      "| [auth.md](auth.md) | Auth pattern |"
   286	    );
   287	    writeFileSync(join(tmpDir, "patterns/auth.md"), "# Auth");
   288	    const issues = checkIndexSync(tmpDir, tmpDir);
   289	    expect(issues).toHaveLength(0);
   290	  });
   291	
   292	  it("ignores references inside HTML comments", () => {
   293	    mkdirSync(join(tmpDir, "patterns"), { recursive: true });
   294	    writeFileSync(
   295	      join(tmpDir, "patterns/INDEX.md"),
   296	      "<!-- [example.md](example.md) is a template -->\n\n| Pattern | Use when |\n|---|---|"
   297	    );
   298	    const issues = checkIndexSync(tmpDir, tmpDir);
   299	    expect(issues).toHaveLength(0);
   300	  });
   301	});

exec
/bin/zsh -lc "rg -n \"exact|degraded|unknown|rejected|defaulted|estimated|blocking|REJECTED|ISSUES_FOUND\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:17:const { load: loadYaml } = require('js-yaml') as { load: (input: string) => unknown };
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:40:  blockingRuleIds: QualityRuleId[];
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:219:function isYamlMapping(value: unknown): value is Record<string, unknown> {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:223:function describeYamlParseError(error: unknown): string {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:238:function loadYamlValue(raw: string): unknown {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:242:function parseYamlMapping(raw: string): Record<string, unknown> | null {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:250:  } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:263:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:292:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:365:    } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:558:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:613:      } catch (_siblingError: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:617:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:677:  const blockingRuleIds = failedRules.filter((ruleId) => shouldBlockWrite(ruleId, source));
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:678:  if (blockingRuleIds.length > 0) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:681:      blockingRuleIds,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:682:      indexBlockingRuleIds: blockingRuleIds,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:683:      softRuleIds: failedRules.filter((ruleId) => !blockingRuleIds.includes(ruleId)),
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:691:      blockingRuleIds: [],
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:699:    blockingRuleIds: [],
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:716:  // the spec_folder frontmatter field — without it, V8 sees current_spec as unknown
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:810:      } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:933:          } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1030:      `current_spec:${currentSpecId ?? 'unknown'}`,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1033:      `captured_file_count:${capturedFileCount ?? 'unknown'}`,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1034:      `filesystem_file_count:${filesystemFileCount ?? 'unknown'}`,
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:1051:  } catch (e: unknown) {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:17:  METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:34:export type ReviewStatus = 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED' | 'REJECTED' | 'REVIEWER_ERROR';
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:71:  blocking?: boolean;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:90:    keyDecisions?: unknown[];
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:91:    _manualDecisions?: unknown[];
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:497:    emitMemoryMetric(METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL, counts.path_fragment, {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:503:    emitMemoryMetric(METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL, counts.standalone_stopword, {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:509:    emitMemoryMetric(METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL, counts.synthetic_bigram, {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:568:      structuredLog('warn', 'memory_save_git_provenance_degraded', {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1032:    const blocking = guardrailCounts.high >= 2 || (guardrailCounts.high >= 1 && guardrailCounts.medium >= 2);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1033:    const blockerReason = blocking
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1038:      status: blocking ? 'REJECTED' : 'ISSUES_FOUND',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1040:      blocking,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1047:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1091:    blocking: result.blocking ?? false,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1102:    console.log(`\nPOST-SAVE QUALITY REVIEW -- REVIEWER ERROR (${result.reviewerError || 'unknown reviewer error'})\n`);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1116:  if (result.status === 'REJECTED') {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1117:    console.log(`\nPOST-SAVE QUALITY REVIEW -- REJECTED (${result.blockerReason})\n`);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1128:  if (result.status === 'REJECTED') {
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1129:    console.log('The save is REJECTED because the composite blocker fired.\n');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:110:          hint: 'Configure exactly one of SPECKIT_SHARED_MEMORY_ADMIN_USER_ID or SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID on the MCP server.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:164:        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:190:        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:287:    metadata?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:376:  error: unknown,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:615:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:682:        } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:732:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:779:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:800:export async function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:825:    } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:860:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:885:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:85:  decisionMeta: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:78:function mapJobForResponse(job: IngestJob): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:79:  let forecast: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:81:    forecast = getIngestForecast(job) as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:82:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:93:  let telemetryPayload: Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:119:    forecast: forecast as unknown as Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:215:      error: `Invalid path(s) rejected: ${invalidPaths.map((entry) => `"${entry.input}" (${entry.reason})`).join(', ')}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:220:        rejectedCount: invalidPaths.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263:      rejectedPathCount: overlengthPaths.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:265:      ...(overlengthPaths.length > 0 ? { rejectedPaths: overlengthPaths } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:274:        ? ['Some input paths were rejected before queueing; inspect rejectedPaths for details']
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:117:  const countParams: unknown[] = [tier];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:169:    } catch (cpErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:185:  const selectParams: unknown[] = [tier];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:223:        } catch (_histErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:265:    } catch (hookError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:293:  const data: Record<string, unknown> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:57:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:77:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:148:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:170:  } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:268:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:282:    } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:314:          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:324:    } catch (scopeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:340:        degradedMatching: degradedTriggerMatching,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:372:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:388:        } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:517:      degradedMatching: degradedTriggerMatching,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:525:      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:16: * Accepts either exact name `pre-reconsolidation` or prefixed variants.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:36:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:10:const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:15:    .catch((error: unknown) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:238:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:274:      } catch (bm25_err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:294:    } catch (_histErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:176:    } catch (embedding_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:26:  [key: string]: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:54:export interface IndexResult extends Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:74:  causalLinks?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:87:    layers: unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:130:  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:154:  } catch (repairErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:209:              const scopeFiltered = results.filter((r: Record<string, unknown>) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:216:              return scopeFiltered.map((r: Record<string, unknown>) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:284:                  } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:358:    } catch (reconErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:385:        const top = candidateResults[0] as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:413:          } catch (mergeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:439:    } catch (assistiveErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:113:    const parsed = JSON.parse(raw) as unknown;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:132:function buildInClause(values: readonly unknown[]): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:141:/** Resolve many memory references in batch (exact first, fuzzy fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:196:  // 2) Batch exact path matches via canonical_file_path/file_path equality
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:253:  // 3) Batch exact title matches
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:384:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:405:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:89:    } catch (causal_err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:109:    } catch (entityErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:131:    } catch (summaryErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:150:          : 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:153:          : 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:157:    } catch (linkErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:184:    } catch (glErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:110:interface PreflightRecord extends Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:231:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:259:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:391:    } catch (e: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:446:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:498:  const params: unknown[] = [spec_folder, taskId];
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:602:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:648:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:691:    const params: unknown[] = [spec_folder];
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:705:    const rows = database.prepare(sql).all(...params) as Record<string, unknown>[];
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:707:    const learningHistory: LearningHistoryRow[] = rows.map((row: Record<string, unknown>) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:712:      try { knowledgeGaps = row.knowledge_gaps ? JSON.parse(row.knowledge_gaps as string) : []; } catch (_error: unknown) { /* ignore */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:713:      try { gapsClosed = row.gaps_closed ? JSON.parse(row.gaps_closed as string) : []; } catch (_error: unknown) { /* ignore */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:714:      try { newGapsDiscovered = row.new_gaps_discovered ? JSON.parse(row.new_gaps_discovered as string) : []; } catch (_error: unknown) { /* ignore */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:775:      const summaryParams: unknown[] = [spec_folder];
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:786:      const stats = database.prepare(summarySql).get(...summaryParams) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:853:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:256:    } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:284:          (row as Record<string, unknown>).parentMemoryId ?? row.id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:89:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:153:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:156:  } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:182:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:187:  } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:114: * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:116:interface MemorySearchRow extends Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:145:  dedupStats: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:150:  data: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:154:type SessionAwareResult = Record<string, unknown> & {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:222:  telemetryPayload: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:230:    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:232:      ? envelope.meta as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:243:  } catch (error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:250:function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:257:    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:259:      ? envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:262:      ? data.results as Array<Record<string, unknown>>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:276:    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:279:      ? envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:297:): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:306:      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:316:  envelope: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:359:    ? parsed.envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:373:function hasPublicationContractFields(result: Record<string, unknown>): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:390:    ? parsed.envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:393:    ? data.results as Array<Record<string, unknown>>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:410:      multiplierAuthorityFields: result.multiplierAuthorityFields as Record<string, unknown> | null | undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:590:    } catch (validationError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:646:  } catch (_error: unknown) { /* eval logging must never break search */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:701:    } catch (_autoProfileErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:707:  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:758:  let goalRefinementPayload: Record<string, unknown> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:805:      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:810:    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:837:            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:848:              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:851:                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:856:        } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:867:        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:869:          const raw = (r as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:879:          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:880:          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:912:    const extraData: Record<string, unknown> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:972:        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:978:    } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:984:    const appliedBoosts: Record<string, unknown> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1013:        const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1018:      } catch (_error: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1027:          ? parsedFormatted.envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1057:      ? parsedResponse.envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1073:    let resultsData: Record<string, unknown> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1076:        resultsData = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1077:      } catch (err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1083:      resultsData = responseToReturn as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1090:      ? resultsData.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1132:        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1149:      ? parsedResponse.envelope.data as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1151:    const existingResults = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1188:    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1195:          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1196:          const data = parsed?.data as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1197:          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1199:          resultCount = Array.isArray(data?.results) ? (data.results as unknown[]).length : 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1201:      } catch (_error: unknown) { /* ignore parse errors */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1213:  } catch (_error: unknown) { /* instrumentation must never cause search to fail */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1222:          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1223:          const data = parsed?.data as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1224:          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1228:      } catch (_error: unknown) { /* ignore parse errors */ }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '300,360p' && printf '\\n---SEARCH---\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '680,760p' && printf '\\n---RESPONSE CONTRACTS---\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

---SEARCH---
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

---RESPONSE CONTRACTS---
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Shared Payload Contract
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 030 / Phase 1: common payload and provenance envelope
     5	// shared by startup, recovery, and compaction surfaces.
     6	
     7	export type SharedPayloadKind =
     8	  | 'startup'
     9	  | 'resume'
    10	  | 'health'
    11	  | 'bootstrap'
    12	  | 'compaction';
    13	
    14	export type SharedPayloadTrustState =
    15	  | 'live'
    16	  | 'cached'
    17	  | 'stale'
    18	  | 'imported'
    19	  | 'rebuilt'
    20	  | 'rehomed';
    21	
    22	export const SHARED_PAYLOAD_CERTAINTY_VALUES = [
    23	  'exact',
    24	  'estimated',
    25	  'defaulted',
    26	  'unknown',
    27	] as const;
    28	
    29	export type SharedPayloadCertainty = (typeof SHARED_PAYLOAD_CERTAINTY_VALUES)[number];
    30	
    31	export const DETECTOR_PROVENANCE_VALUES = [
    32	  'ast',
    33	  'structured',
    34	  'regex',
    35	  'heuristic',
    36	] as const;
    37	
    38	export type DetectorProvenance = (typeof DETECTOR_PROVENANCE_VALUES)[number];
    39	
    40	export const PARSER_PROVENANCE_VALUES = [
    41	  'ast',
    42	  'regex',
    43	  'heuristic',
    44	  'unknown',
    45	] as const;
    46	
    47	export type ParserProvenance = (typeof PARSER_PROVENANCE_VALUES)[number];
    48	
    49	export const EVIDENCE_STATUS_VALUES = [
    50	  'confirmed',
    51	  'probable',
    52	  'unverified',
    53	  'unknown',
    54	] as const;
    55	
    56	export type EvidenceStatus = (typeof EVIDENCE_STATUS_VALUES)[number];
    57	
    58	export const FRESHNESS_AUTHORITY_VALUES = [
    59	  'live',
    60	  'cached',
    61	  'stale',
    62	  'unknown',
    63	] as const;
    64	
    65	export type FreshnessAuthority = (typeof FRESHNESS_AUTHORITY_VALUES)[number];
    66	
    67	export const MEASUREMENT_AUTHORITY_VALUES = [
    68	  'provider_counted',
    69	  'estimated',
    70	  'defaulted',
    71	  'unknown',
    72	] as const;
    73	
    74	export type MeasurementAuthority = (typeof MEASUREMENT_AUTHORITY_VALUES)[number];
    75	
    76	export const PUBLICATION_METHODOLOGY_STATUSES = [
    77	  'provisional',
    78	  'published',
    79	] as const;
    80	
    81	export type PublicationMethodologyStatus = (typeof PUBLICATION_METHODOLOGY_STATUSES)[number];
    82	
    83	export const MULTIPLIER_REQUIRED_FIELDS = [
    84	  'promptTokens',
    85	  'completionTokens',
    86	  'cacheReadTokens',
    87	  'cacheWriteTokens',
    88	] as const;
    89	
    90	export type MultiplierRequiredField = (typeof MULTIPLIER_REQUIRED_FIELDS)[number];
    91	
    92	export interface PublicationMethodologyMetadata {
    93	  schemaVersion: string;
    94	  methodologyStatus: PublicationMethodologyStatus;
    95	  provenance: string[];
    96	}
    97	
    98	export interface PublishableMetricField<T = unknown> {
    99	  key: string;
   100	  value: T;
   101	  certainty: SharedPayloadCertainty;
   102	  authority: MeasurementAuthority;
   103	  methodology: PublicationMethodologyMetadata;
   104	}
   105	
   106	export interface StructuralTrust {
   107	  parserProvenance: ParserProvenance;
   108	  evidenceStatus: EvidenceStatus;
   109	  freshnessAuthority: FreshnessAuthority;
   110	}
   111	
   112	export interface HotFileBreadcrumb {
   113	  degree: number;
   114	  changeCarefullyReason: string;
   115	}
   116	
   117	export const EDGE_EVIDENCE_CLASS_VALUES = [
   118	  'direct_call',
   119	  'import',
   120	  'type_reference',
   121	  'inferred_heuristic',
   122	  'test_coverage',
   123	] as const;
   124	
   125	export type EdgeEvidenceClass = (typeof EDGE_EVIDENCE_CLASS_VALUES)[number];
   126	
   127	export interface GraphEdgeEnrichment {
   128	  edgeEvidenceClass: EdgeEvidenceClass;
   129	  numericConfidence: number;
   130	}
   131	
   132	export type StructuralTrustCarrier<T extends object = Record<string, unknown>> =
   133	  T & StructuralTrust;
   134	
   135	export type GraphEdgeEnrichmentCarrier<T extends object = Record<string, unknown>> =
   136	  T & GraphEdgeEnrichment;
   137	
   138	export type MultiplierAuthorityField = Pick<PublishableMetricField<number>, 'certainty' | 'authority'>;
   139	
   140	export type MultiplierAuthorityFields = Partial<Record<MultiplierRequiredField, MultiplierAuthorityField | null>>;
   141	
   142	export interface SharedPayloadSection {
   143	  key: string;
   144	  title: string;
   145	  content: string;
   146	  source: 'memory' | 'code-graph' | 'semantic' | 'session' | 'operational';
   147	  certainty?: SharedPayloadCertainty;
   148	  structuralTrust?: StructuralTrust;
   149	  graphEdgeEnrichment?: GraphEdgeEnrichment;
   150	  hotFileBreadcrumb?: HotFileBreadcrumb;
   151	}
   152	
   153	export interface SharedPayloadProvenance {
   154	  producer:
   155	    | 'startup_brief'
   156	    | 'session_snapshot'
   157	    | 'session_resume'
   158	    | 'session_health'
   159	    | 'session_bootstrap'
   160	    | 'compact_merger'
   161	    | 'hook_cache';
   162	  sourceSurface: string;
   163	  trustState: SharedPayloadTrustState;
   164	  generatedAt: string;
   165	  lastUpdated: string | null;
   166	  sourceRefs: string[];
   167	}
   168	
   169	export interface PreMergeSelectionMetadata {
   170	  strategy: 'pre-merge';
   171	  selectedFrom: string[];
   172	  fileCount: number;
   173	  topicCount: number;
   174	  attentionSignalCount: number;
   175	  notes: string[];
   176	  antiFeedbackGuards: string[];
   177	}
   178	
   179	export interface SharedPayloadEnvelope {
   180	  kind: SharedPayloadKind;
   181	  summary: string;
   182	  sections: SharedPayloadSection[];
   183	  provenance: SharedPayloadProvenance;
   184	  selection?: PreMergeSelectionMetadata;
   185	}
   186	
   187	const SUMMARY_MAX_CHARS = 220;
   188	const STRUCTURAL_TRUST_REQUIRED_FIELDS = [
   189	  'parserProvenance',
   190	  'evidenceStatus',
   191	  'freshnessAuthority',
   192	] as const;
   193	const PROHIBITED_STRUCTURAL_TRUST_KEYS = [
   194	  'trust',
   195	  'trustScore',
   196	  'confidence',
   197	  'confidenceScore',
   198	  'authorityScore',
   199	] as const;
   200	
   201	export class StructuralTrustPayloadError extends Error {
   202	  readonly code = 'STRUCTURAL_TRUST_PAYLOAD_INVALID';
   203	
   204	  constructor(message: string) {
   205	    super(message);
   206	    this.name = 'StructuralTrustPayloadError';
   207	  }
   208	}
   209	
   210	function isNonEmptyString(value: unknown): value is string {
   211	  return typeof value === 'string' && value.trim().length > 0;
   212	}
   213	
   214	export function isSharedPayloadCertainty(value: unknown): value is SharedPayloadCertainty {
   215	  return typeof value === 'string'
   216	    && SHARED_PAYLOAD_CERTAINTY_VALUES.includes(value as SharedPayloadCertainty);
   217	}
   218	
   219	export function isParserProvenance(value: unknown): value is ParserProvenance {
   220	  return typeof value === 'string'

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

codex
I’ve reached the synthesis point. One last pass is to pin exact line numbers in the scaffold contract files so the final classifications cite both the declared contract and the implementation that enforces or undermines it.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md | sed -n '1,140p' && printf '\\n---SETUP---\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---SETUP---
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

codex
# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: Classify every major Mex mechanism as `adopt now`, `prototype later`, `NEW FEATURE`, or `reject`.

Executive summary: Mex is strongest as a thin markdown-integrity layer, not as a replacement for Spec Kit Memory. The clear win is narrow static reference integrity for markdown surfaces. Freshness is worth prototyping only if we preserve Spec Kit’s explicit `exact` / `estimated` / `unknown` / blocked semantics. Targeted repair briefs are worth building as a new feature. Inventory-heavy parity checks need a broader abstraction first. Auto-growth and score-first health should stay out.

## Findings
### Finding 1: Static markdown reference integrity is the only clear adopt-now slice
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: Mex extracts typed markdown claims from inline code, code blocks, and dependency headings, then runs zero-token checks for missing paths, dead frontmatter edges, and `patterns/INDEX.md` drift. It already distinguishes real missing references from pattern/template placeholders by downgrading some path misses to warnings.
- **Why it matters for us**: This cleanly maps to our real gap. Spec Kit already has semantic retrieval, trigger recall, causal links, and health tooling, but it does not statically verify that markdown references still point to real files or that pattern indexes stay in sync.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Dual freshness signals are useful, but only as supplemental trust metadata
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12), [shared-payload.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts#L22), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L329)
- **What it does**: Mex emits separate stale-file issues from both elapsed days (`30`/`90`) and commits since last change (`50`/`200`). If git history cannot answer, `git.ts` returns `null`, so the checker silently emits nothing.
- **Why it matters for us**: The days-plus-commits idea is strong, but silent `null` is too weak for Spec Kit. Our current surfaces already distinguish `exact`, `estimated`, `defaulted`, `unknown`, and degraded matching; freshness should plug into that trust model instead of pretending “no signal” means “healthy.”
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Mex’s repair brief flow is worth building as a provider-neutral Spec Kit feature
- **Source**: [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7)
- **What it does**: `mex sync` groups issues by file, builds one combined brief, includes the current markdown, issue list, nearby filesystem listings for missing paths, and `HEAD~5..HEAD` diffs for referenced paths, then runs an interactive repair loop and re-checks drift after each cycle.
- **Why it matters for us**: This is the best “AI-assisted” idea in Mex. It converts static failures into bounded, auditable repair work instead of re-running broad doc rewrites. That fits Spec Kit’s packet-local remediation style very well.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Command, dependency, cross-file, and script-coverage audits are good ideas, but Mex’s implementation is too Node-centric for direct adoption
- **Source**: [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts#L3), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex validates npm/bun/yarn/pnpm scripts and Make targets, checks package dependencies and versions against `package.json`, flags version contradictions across docs, and warns if package scripts never appear in scaffold text. Non-Node manifests are mostly stubbed.
- **Why it matters for us**: We do need broader wrapper/config/doc parity checks, but our truth surfaces span shell commands, MCP tools, Python, TS, generated docs, and spec packets. Mex’s current inventory model is too narrow to trust in our repo.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 5: Scanner-first setup briefs are useful for bootstrapping, but not for durable truth maintenance
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L50), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L12)
- **What it does**: `mex init` builds a structured brief from manifest, entry points, folder tree, tooling, and README, then tells the AI to populate scaffold files from that brief rather than from raw browsing.
- **Why it matters for us**: This is good for first-pass scaffold seeding or packet bootstrap because it reduces exploratory noise. It is not good enough to become an authority layer for Spec Kit memory or documentation parity, especially with shallow non-Node support and no richer trust contract.
- **Recommendation**: prototype later
- **Impact**: low

### Finding 6: Mex’s GROW loop and `pattern add` workflow should not become part of Spec Kit’s default documentation lifecycle
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L178), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L6)
- **What it does**: The contract requires post-task scaffold growth, and `pattern add` immediately creates a task-pattern template plus a placeholder `[description]` row in `patterns/INDEX.md`.
- **Why it matters for us**: In Spec Kit, partially formed docs become durable retrieval material quickly. Mex’s loop optimizes for compounding coverage, but it does so before truth is secured. That is the wrong default for a trust-sensitive memory system.
- **Recommendation**: reject
- **Impact**: medium

### Finding 7: Mex’s single drift score should not be promoted into Spec Kit’s primary health surface
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L87), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1019), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L45), [shared-payload.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts#L22)
- **What it does**: Mex starts at `100` and subtracts fixed costs per issue. That makes score the headline surface even though the underlying findings have very different trust implications.
- **Why it matters for us**: Spec Kit already has richer truth states: block-on-write rules, `REJECTED` post-save outcomes, and certainty/provenance fields. A single score would compress those distinctions and make unsafe or unknown states look deceptively acceptable.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts)
- [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts)
- [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts)
- [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.46
- Questions addressed: markdown-first scaffold tradeoffs; checker composition and blind spots; freshness thresholds and git failure semantics; claim extraction behavior; targeted sync design; post-task scaffold growth; overlap with current Spec Kit validation and trust surfaces
- Questions answered: adopt only static reference integrity now; prototype freshness only with explicit trust semantics; build repair briefs as a new feature; defer inventory-backed parity until a cross-surface model exists; reject auto-growth defaults and reject score-first health

## Reflection
- What worked: tracing Mex in execution order, then comparing each mechanism to current Spec Kit trust and health contracts, made the keep/defer/reject boundaries much clearer than the README alone.
- What did not work: the semantic code search path did not produce usable output in this run, so the synthesis stayed grounded in direct source reads. The validator also emitted the expected sandbox warning about temp-file creation, although it still finished `PASSED`.

## Recommended Next Focus
1. Implement a narrow markdown drift pass for Spec Kit that checks packet-local paths, frontmatter edges, and index/list coherence with severity-first reporting only.
2. Design a freshness prototype that reports `exact` versus `unknown/degraded` authority instead of silently passing when git data is unavailable.
3. Spec a provider-neutral repair-brief tool that converts failed validations into packet-local remediation prompts with file context and recent diffs.
4. Delay broader command/dependency/script parity until there is a shared inventory model across npm, shell, Python, MCP, wrappers, and spec docs.


hook: Stop
hook: Stop Completed
tokens used
167,683
# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: Classify every major Mex mechanism as `adopt now`, `prototype later`, `NEW FEATURE`, or `reject`.

Executive summary: Mex is strongest as a thin markdown-integrity layer, not as a replacement for Spec Kit Memory. The clear win is narrow static reference integrity for markdown surfaces. Freshness is worth prototyping only if we preserve Spec Kit’s explicit `exact` / `estimated` / `unknown` / blocked semantics. Targeted repair briefs are worth building as a new feature. Inventory-heavy parity checks need a broader abstraction first. Auto-growth and score-first health should stay out.

## Findings
### Finding 1: Static markdown reference integrity is the only clear adopt-now slice
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L72), [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts#L48), [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts#L17), [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts#L8), [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts#L5), [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts#L6)
- **What it does**: Mex extracts typed markdown claims from inline code, code blocks, and dependency headings, then runs zero-token checks for missing paths, dead frontmatter edges, and `patterns/INDEX.md` drift. It already distinguishes real missing references from pattern/template placeholders by downgrading some path misses to warnings.
- **Why it matters for us**: This cleanly maps to our real gap. Spec Kit already has semantic retrieval, trigger recall, causal links, and health tooling, but it does not statically verify that markdown references still point to real files or that pattern indexes stay in sync.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Dual freshness signals are useful, but only as supplemental trust metadata
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12), [shared-payload.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts#L22), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L219), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L329)
- **What it does**: Mex emits separate stale-file issues from both elapsed days (`30`/`90`) and commits since last change (`50`/`200`). If git history cannot answer, `git.ts` returns `null`, so the checker silently emits nothing.
- **Why it matters for us**: The days-plus-commits idea is strong, but silent `null` is too weak for Spec Kit. Our current surfaces already distinguish `exact`, `estimated`, `defaulted`, `unknown`, and degraded matching; freshness should plug into that trust model instead of pretending “no signal” means “healthy.”
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Mex’s repair brief flow is worth building as a provider-neutral Spec Kit feature
- **Source**: [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7)
- **What it does**: `mex sync` groups issues by file, builds one combined brief, includes the current markdown, issue list, nearby filesystem listings for missing paths, and `HEAD~5..HEAD` diffs for referenced paths, then runs an interactive repair loop and re-checks drift after each cycle.
- **Why it matters for us**: This is the best “AI-assisted” idea in Mex. It converts static failures into bounded, auditable repair work instead of re-running broad doc rewrites. That fits Spec Kit’s packet-local remediation style very well.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Command, dependency, cross-file, and script-coverage audits are good ideas, but Mex’s implementation is too Node-centric for direct adoption
- **Source**: [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts#L5), [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts#L38), [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts#L3), [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts#L26), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L48)
- **What it does**: Mex validates npm/bun/yarn/pnpm scripts and Make targets, checks package dependencies and versions against `package.json`, flags version contradictions across docs, and warns if package scripts never appear in scaffold text. Non-Node manifests are mostly stubbed.
- **Why it matters for us**: We do need broader wrapper/config/doc parity checks, but our truth surfaces span shell commands, MCP tools, Python, TS, generated docs, and spec packets. Mex’s current inventory model is too narrow to trust in our repo.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 5: Scanner-first setup briefs are useful for bootstrapping, but not for durable truth maintenance
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L50), [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md#L13), [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts#L20), [manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts#L12)
- **What it does**: `mex init` builds a structured brief from manifest, entry points, folder tree, tooling, and README, then tells the AI to populate scaffold files from that brief rather than from raw browsing.
- **Why it matters for us**: This is good for first-pass scaffold seeding or packet bootstrap because it reduces exploratory noise. It is not good enough to become an authority layer for Spec Kit memory or documentation parity, especially with shallow non-Node support and no richer trust contract.
- **Recommendation**: prototype later
- **Impact**: low

### Finding 6: Mex’s GROW loop and `pattern add` workflow should not become part of Spec Kit’s default documentation lifecycle
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L56), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L178), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L6)
- **What it does**: The contract requires post-task scaffold growth, and `pattern add` immediately creates a task-pattern template plus a placeholder `[description]` row in `patterns/INDEX.md`.
- **Why it matters for us**: In Spec Kit, partially formed docs become durable retrieval material quickly. Mex’s loop optimizes for compounding coverage, but it does so before truth is secured. That is the wrong default for a trust-sensitive memory system.
- **Recommendation**: reject
- **Impact**: medium

### Finding 7: Mex’s single drift score should not be promoted into Spec Kit’s primary health surface
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L87), [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts#L3), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L1019), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts#L45), [shared-payload.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts#L22)
- **What it does**: Mex starts at `100` and subtracts fixed costs per issue. That makes score the headline surface even though the underlying findings have very different trust implications.
- **Why it matters for us**: Spec Kit already has richer truth states: block-on-write rules, `REJECTED` post-save outcomes, and certainty/provenance fields. A single score would compress those distinctions and make unsafe or unknown states look deceptively acceptable.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts)
- [drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts)
- [claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts)
- [frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts)
- [scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts)
- [edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts)
- [index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts)
- [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts)
- [command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts)
- [dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts)
- [cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts)
- [script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts)
- [scanner/manifest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts)
- [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts)
- [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts)
- [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts)
- [checkers.test.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test/checkers.test.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts)
- [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.46
- Questions addressed: markdown-first scaffold tradeoffs; checker composition and blind spots; freshness thresholds and git failure semantics; claim extraction behavior; targeted sync design; post-task scaffold growth; overlap with current Spec Kit validation and trust surfaces
- Questions answered: adopt only static reference integrity now; prototype freshness only with explicit trust semantics; build repair briefs as a new feature; defer inventory-backed parity until a cross-surface model exists; reject auto-growth defaults and reject score-first health

## Reflection
- What worked: tracing Mex in execution order, then comparing each mechanism to current Spec Kit trust and health contracts, made the keep/defer/reject boundaries much clearer than the README alone.
- What did not work: the semantic code search path did not produce usable output in this run, so the synthesis stayed grounded in direct source reads. The validator also emitted the expected sandbox warning about temp-file creation, although it still finished `PASSED`.

## Recommended Next Focus
1. Implement a narrow markdown drift pass for Spec Kit that checks packet-local paths, frontmatter edges, and index/list coherence with severity-first reporting only.
2. Design a freshness prototype that reports `exact` versus `unknown/degraded` authority instead of silently passing when git data is unavailable.
3. Spec a provider-neutral repair-brief tool that converts failed validations into packet-local remediation prompts with file context and recent diffs.
4. Delay broader command/dependency/script parity until there is a shared inventory model across npm, shell, Python, MCP, wrappers, and spec docs.
