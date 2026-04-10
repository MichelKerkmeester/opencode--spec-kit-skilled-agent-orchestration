## Assessment
- New information ratio: 0.43

## Recommended Next Focus
Spec one Public-native “memory integrity and continuity facade” packet with four bounded slices: 1. packet-local markdown path/edge/index drift checks, 2. compaction-time memory action card, 3. thin lifecycle/doctor aliases over existing MCP authority, 4. provider-neutral repair briefs generated from failed integrity checks.
--- Iteration 22 ---
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
- **Function signatures**: `extractReferenceClaims(filePath: string, content: string): ReferenceClaim[]`; `runReferenceIntegrityScan(args: { specFolder: string; projectRoot: string; includeMemoryDocs?: boolean; includeSpecDocs?: boolean }): Promise<ReferenceIntegrityReport>`; `handleMemoryHealth(args: HealthArgs & { reportMode?: 'reference_integrity'; includeWarnings?: boolean }): Promise<MCPResponse>`.
- **Migration steps**: 1. Ship a regex-first v1 extractor for markdown links, backticked file paths, YAML `edges`, and local `INDEX.md` references. 2. Reuse existing placeholder/contamination heuristics from [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts) so template examples downgrade to warnings instead of hard errors. 3. Add `memory_health({ reportMode: 'reference_integrity', specFolder })` with severity-first output and no composite score. 4. Gate `validate.sh --strict` on integrity errors only, leaving warning-only drift visible but non-blocking.

### Finding 2: Add a supplemental freshness contract with explicit `exact`, `degraded`, and `unknown` provenance
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [git-context-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- **What it does**: Mex uses dual thresholds on days and commits, but silently collapses git failures to `null`. Spec Kit already has a better trust precedent in `session_resume`: freshness is surfaced as an explicit contract, not hidden behind a score. The right transplant is a supplemental signal, not a ranker.
- **Why it matters**: We already persist `headRef`, `commitRef`, `repositoryState`, and reviewer guardrails for missing provenance. That gives us the substrate to expose freshness honestly without pretending every result is equally current.
- **Recommendation**: adopt now
- **Impact**: high
- **Blueprint files**: create `scripts/lib/memory-freshness.ts`; edit [git-context-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [session-types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), and [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts).
- **Function signatures**: `computeFreshnessSignal(args: { filePath: string; projectRoot: string; headRef?: string | null; commitRef?: string | null; repositoryState?: string | null }): Promise<FreshnessSignal>`; `type FreshnessSignal = { provenance: 'exact' | 'degraded' | 'unknown'; ageState: 'fresh' | 'warning' | 'stale' | 'unavailable'; daysSinceChange: number | null; commitsSinceChange: number | null; reason?: string }`; `attachFreshnessTrace(result: Record<string, unknown>, freshness: FreshnessSignal): Record<string, unknown>`.
- **Migration steps**: 1. Compute freshness only when saved git provenance exists; otherwise emit `degraded` or `unknown` with a concrete reason. 2. Reuse Mex’s initial thresholds (`30/90` days, `50/200` commits) but expose them as trace metadata, not ranking weights. 3. Add a reviewer rule that flags missing freshness metadata only when provenance was expected. 4. Surface the signal first in `memory_health` and trace/debug paths, then decide later whether default `memory_context` and `memory_search` responses should show it.

### Finding 3: Generate provider-neutral repair briefs from integrity failures instead of launching a sync loop
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
- **What it does**: Mex groups issues by file, includes current content, nearby filesystem context, and recent diffs, then emits a bounded repair brief. The reusable part is the brief artifact, not the interactive CLI loop.
- **Why it matters**: This matches Spec Kit’s packet-local remediation style. We need an auditable handoff surface that says “these are the broken references and the likely replacements,” without auto-mutating documentation or introducing a separate operator UX.
- **Recommendation**: adopt now
- **Impact**: medium
- **Blueprint files**: create `mcp_server/lib/reference-integrity/build-repair-brief.ts` and `scripts/spec/generate-repair-brief.ts`; edit [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) and [progressive-validate.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh).
- **Function signatures**: `buildIntegrityRepairBrief(args: { specFolder: string; issues: ReferenceIntegrityIssue[]; projectRoot: string; includeGitDiff?: boolean }): Promise<{ markdown: string; targets: IntegrityRepairTarget[] }>`; `type IntegrityRepairTarget = { filePath: string; issues: ReferenceIntegrityIssue[]; nearbyFiles: string[]; recentDiff: string | null }`; `main(argv: string[]): Promise<number>`.
- **Migration steps**: 1. Consume the report schema from Finding 1 and group issues by file. 2. Add bounded context only: current file body, sibling-directory listings, and short recent git diffs. 3. Emit a markdown brief plus JSON payload under `scratch/repair/` inside the target spec folder, rather than editing docs directly. 4. Optionally let `memory_health({ reportMode: 'reference_integrity' })` return a brief preview, but keep the write path explicit and packet-local.

## Assessment
- New information ratio: 0.35

Workspace access was read-only in this session, so I returned the blueprints directly instead of updating the phase-folder research artifacts.

## Recommended Next Focus
Implement Finding 1 first as a narrow `memory_health` plus `validate.sh` slice, then add Finding 2 as trace-only freshness metadata with explicit degraded/unknown semantics, and only then layer Finding 3 on top of the shared issue schema so repair briefs are generated from real integrity findings rather than a parallel analyzer.

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
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

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
I’m treating this as a read-only research pass focused on Mex’s temporal behavior and what it implies for long-lived memory design in Spec Kit Memory. I’ll first pull the most relevant prior memory context, load the deep-research skill guidance, and then trace the exact external files that govern staleness, sync, scaffold growth, and any forgetting or retention behavior.
2026-04-10T20:49:15.291258Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
p=Path('/Users/michelkerkmeester/.codex/memories/MEMORY.md')
text=p.read_text()
for kw in ['staleness', 'FSRS', 'decay', 'retention', 'Modus Memory', 'hybrid-rag fusion', 'mex', 'forgetting']:
    print(f'--- {kw} ---')
    for i,line in enumerate(text.splitlines(),1):
        if kw.lower() in line.lower():
            start=max(1,i-2); end=min(len(text.splitlines()),i+2)
            for j in range(start,end+1):
                print(f'{j}:{text.splitlines()[j-1]}')
            print()
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-10T20:49:15.291256Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
p=Path('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md')
print(p.read_text())
PY"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg --files -g 'CLAUDE.md' -g 'AGENTS.md' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main external .opencode/skill/system-spec-kit .opencode/skill/sk-deep-research" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: external: No such file or directory (os error 2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md

codex
I hit a sandbox quirk with here-doc shell syntax, so I’m switching to direct `python3 -c` and plain file reads. I also found a deeper `CLAUDE.md` and `AGENTS.md` inside the external research tree, so I’m checking those before I trace the staleness and retention logic.
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; print(Path('/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md').read_text())\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; lines=Path('/Users/michelkerkmeester/.codex/memories/MEMORY.md').read_text().splitlines(); kws=['staleness','FSRS','decay','retention','Modus Memory','hybrid-rag fusion','mex','forgetting'];
for kw in kws:
 print('--- '+kw+' ---');
 hits=[i for i,l in enumerate(lines,1) if kw.lower() in l.lower()];
 [print('\\n'.join(f'{j}:{lines[j-1]}' for j in range(max(1,i-2), min(len(lines), i+2)+1))+'\\n') for i in hits[:6]]\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; paths=['/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md','/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md'];
for p in paths:
 print('===== '+p+' =====');
 print(Path(p).read_text())\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1841ms:
2026-04-10 22:49:24.373 xcodebuild[61469:38305448]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:49:24.530 xcodebuild[61469:38305430] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-uH5MW3LP' (errno=Operation not permitted)
2026-04-10 22:49:25.051 xcodebuild[61848:38306075]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:49:25.195 xcodebuild[61848:38306065] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
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
| **Progressive synthesis** | `progressiveSynthesis` defaults to `true`; the agent may update `research/research.md` incrementally, and the orchestrator always performs the final consolidation pass |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. **Read state first** -- Agent must read JSONL and strategy.md before any research action
2. **One focus per iteration** -- Pick ONE research sub-topic from strategy.md "Next Focus"
3. **Externalize findings** -- Write to iteration-NNN.md, not held in agent context
4. **Update strategy** -- Append to "What Worked"/"What Failed", update "Next Focus"
5. **Report newInfoRatio** -- Every iteration JSONL record must include newInfoRatio
6. **Respect exhausted approaches** -- Never retry approaches in the "Exhausted" list
7. **Cite sources** -- Every finding must cite `[SOURCE: url]` or `[SOURCE: file:line]`
8. **Use generate-context.js for memory saves** -- Never manually create memory files
9. **Treat research/research.md as workflow-owned** -- Iteration findings feed synthesis; the workflow owns the canonical `research/research.md`
10. **Document ruled-out directions per iteration** -- Every iteration must include what was tried and failed
11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
13. **Respect reducer ownership** -- The workflow reducer, not the agent, is the source of truth for strategy machine-owned sections, dashboard metrics, and findings registry updates
14. **Use canonical packet names only** -- Write `deep-research-*` artifacts and `research/.deep-research-pause`; legacy names are read-only migration aliases

### NEVER

1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
2. **Hold findings in context** -- Write everything to files
3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
4. **Ask the user** -- Autonomous execution; make best-judgment decisions
5. **Skip convergence checks** -- Every iteration must be evaluated
6. **Modify config after init** -- Config is read-only after initialization
7. **Overwrite prior findings** -- Append to research/research.md, never replace

### Iteration Status Enum

`complete | timeout | error | stuck | insight | thought`

- `insight`: Low newInfoRatio but important conceptual breakthrough
- `thought`: Analytical-only iteration, no evidence gathering

### EXPERIMENTAL / REFERENCE-ONLY FEATURES

These concepts remain documented for future design work, but they are not part of the live executable contract for `/spec_kit:deep-research`:
1. **Wave orchestration** -- parallel question fan-out, pruning, and breakthrough logic
2. **Checkpoint commits** -- per-iteration git commits
3. **Wave orchestration on the same lineage** -- parallel fan-out remains reference-only
4. **Alternate CLI dispatch** -- process-isolated `claude -p` or similar dispatch modes

### ESCALATE IF

1. **3+ consecutive timeouts** -- Infrastructure issue, not research problem
2. **State file corruption unrecoverable** -- Cannot reconstruct from JSONL or iteration files
3. **All approaches exhausted with questions remaining** -- Research may need human guidance
4. **Security concern in findings** -- Proprietary code or credentials discovered
5. **All recovery tiers exhausted** -- No automatic recovery path remaining

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:references -->
## 5. REFERENCES

### Core Documentation

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [loop_protocol.md](references/loop_protocol.md) | Loop lifecycle (4 phases) | Init, iterate, synthesize, save |
| [state_format.md](references/state_format.md) | State file schemas | JSONL + strategy.md + config.json |
| [convergence.md](references/convergence.md) | Stop condition algorithms | shouldContinue(), stuck recovery |
| [quick_reference.md](references/quick_reference.md) | One-page cheat sheet | Commands, tuning, troubleshooting |

### Templates

| Template | Purpose | Usage |
|----------|---------|-------|
| [deep_research_config.json](assets/deep_research_config.json) | Loop configuration | Copied to `research/` during research init |
| [deep_research_strategy.md](assets/deep_research_strategy.md) | Strategy file | Copied to `research/` during research init |
| [deep_research_dashboard.md](assets/deep_research_dashboard.md) | Dashboard template | Auto-generated each iteration |

---

<!-- /ANCHOR:references -->
<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

### Loop Completion
- Research loop ran to convergence or max iterations
- All state files present and consistent (config, JSONL, strategy)
- research/research.md produced with findings from all iterations
- Memory context saved via generate-context.js

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-loop** | Config valid, strategy initialized, state log created | Yes |
| **Per-iteration** | iteration-NNN.md written, JSONL appended, reducer refreshes strategy/dashboard/registry | Yes |
| **Post-loop** | research/research.md exists with content, convergence report generated | Yes |
| **Quality guards** | Source diversity (>=2), focus alignment, no single-weak-source | Yes |
| **Memory save** | memory/*.md created via generate-context.js | No |

### Convergence Report

Every completed loop produces a convergence report:
- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
- Total iterations completed
- Questions answered ratio
- Average newInfoRatio trend

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in CLAUDE.md.

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: autoresearch, deep research)
- **Gate 3**: File modifications require spec folder question per CLAUDE.md Gate 3
- **Memory**: Context preserved via Spec Kit Memory MCP (generate-context.js)
- **Orchestrator**: @orchestrate dispatches @deep-research as LEAF agent

### Memory Integration

```
Before research:
  memory_context({ input: topic, mode: "deep", intent: "understand" })
  --> Loads prior research into strategy.md "Known Context"

During research (each iteration):
  Agent writes research/iterations/iteration-NNN.md
  Agent appends research/deep-research-state.jsonl
  Workflow reducer updates research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
  Runtime capability lookups resolve through assets/runtime_capabilities.json plus scripts/runtime-capabilities.cjs

After research:
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]
  # No additional indexing step is part of the live workflow contract.
```

### Command Integration

| Command | Relationship |
|---------|-------------|
| `/spec_kit:deep-research` | Primary invocation point |
| `/spec_kit:plan` | Next step after deep research completes |
| `/memory:save` | Manual memory save (deep research auto-saves) |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Worked Examples

**Deep Research on Unknown Topic**:
1. `/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"`
2. Init creates config, strategy with 5 key questions
3. Iterations 1-3: Broad survey, official docs, codebase patterns
4. Iterations 4-6: Deep dive into specific strategies, edge cases
5. Iteration 7: Convergence detected after recent newInfoRatio values stay below the configured threshold
6. Synthesis produces 17-section research/research.md
7. Memory saved via generate-context.js

**Narrow Research with Early Convergence**:
1. `/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?"`
2. Init creates config with 2 key questions
3. Iteration 1: Finds definitive answer from official specs
4. All questions answered after iteration 1
5. Loop stops cleanly, research/research.md produced

**Stuck Recovery Example**:
1. Iterations 4-6 all have newInfoRatio below the configured threshold
2. Stuck recovery triggers at iteration 7
3. Recovery widens focus to least-explored question
4. Iteration 7 finds new angle, newInfoRatio jumps to 0.4
5. Loop continues productively

### Design Origins

| Innovation | Source | Our Adaptation |
|------------|--------|----------------|
| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch = fresh context |
| STRATEGY.md persistent brain | AGR | deep-research-strategy.md |
| JSONL state | pi-autoresearch | deep-research-state.jsonl |
| Stuck detection | AGR | 3-consecutive-no-progress recovery |
| Context injection | autoresearch-opencode | Strategy file as agent context |

### Agents

| Agent | Purpose |
|-------|---------|
| `@deep-research` | Single iteration executor (LEAF) |
| `@orchestrate` | Loop coordination (when dispatched externally) |

### Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:deep-research` | Full loop workflow |
| `/memory:save` | Manual context preservation |

**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)

For code review capabilities, see `sk-deep-review`.
<!-- /ANCHOR:related-resources -->


 succeeded in 1824ms:
2026-04-10 22:49:24.384 xcodebuild[61488:38305477]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:49:24.542 xcodebuild[61488:38305455] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-FfE9ZHhG' (errno=Operation not permitted)
2026-04-10 22:49:25.051 xcodebuild[61847:38306072]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:49:25.195 xcodebuild[61847:38306064] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
===== /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md =====
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

===== /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md =====
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


 succeeded in 1828ms:
2026-04-10 22:49:24.384 xcodebuild[61487:38305475]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:49:24.542 xcodebuild[61487:38305454] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-2VgqiTxx' (errno=Operation not permitted)
2026-04-10 22:49:25.051 xcodebuild[61846:38306071]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 22:49:25.195 xcodebuild[61846:38306062] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
--- staleness ---
--- FSRS ---
--- decay ---
--- retention ---
1782:- phase-1 baseline, deferred Phase 2-6 follow-up, check-completion.sh, generate-context.js, /tmp/save-context-data.json, telemetry README schema alignment
1783:
1784:## Task 3: Refine Phase-015 governance/collaboration boundaries and retention scope
1785:
1786:### rollout_summary_files

1790:### keywords
1791:
1792:- filterRowsByScope, sessionId filtering, getAllowedSharedSpaceIds, assertSharedSpaceAccess, runRetentionSweep, tenant filtering
1793:
1794:## Task 4: Apply TSDoc and reference-comment cleanup across Hydra runtime modules

1824:- For phase-sliced completion, convert future-phase rows into explicit deferrals (`[deferred: Phase N follow-up]`) so Phase-1 can close without pretending later phases shipped [Task 2]
1825:- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
1827:- Hydra comment quality standard: exported interfaces/functions must carry purposeful TSDoc plus traceable reference tags (`T###`, `REQ-###`, `BUG-###`, `CHK-###`) [Task 4]
1828:

--- Modus Memory ---
--- hybrid-rag fusion ---
--- mex ---
--- forgetting ---

codex
The first reads got swallowed by platform noise from macOS tooling, but the files are there. I’m polling the live sessions now and then moving into the actual Mex source path sequence the brief specifies.
codex
I’ve got the research protocol loaded and confirmed the external repo’s own anchor docs mostly point back to `ROUTER.md`. Next I’m reading the exact scaffold and source files in the brief’s order, plus one semantic pass to catch any temporal behavior that isn’t obvious from filenames alone.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,240p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md =====
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

codex
The scaffold contract is clear now: Mex doesn’t “forget” by deleting knowledge; it treats aging as drift pressure on markdown and uses resync plus pattern growth as its continuity loop. I’m moving into the implementation files now to see whether the code actually matches that story, and then I’ll line it up against Spec Kit’s own decay, archival, and freshness surfaces.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts =====
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts =====
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
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"useDecay|trackAccess|FSRS|retention|archive|DORMANT|ARCHIVED|freshness|stale|decay|forget|last_accessed|access_count|runRetentionSweep|memory_search|memory_context|memory_match_triggers|causal|generate-context\" .opencode/skill/system-spec-kit -g '*.ts' -g '*.js' -g '*.md' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:86:import * as causalBoost from './lib/search/causal-boost.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:104:import * as attentionDecay from './lib/cognitive/attention-decay.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:118:// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:175:    codeGraphStatus: 'fresh' | 'stale' | 'empty';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:194:  staleCount: number;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379:// Safe for stdio (single client). TTL in query-flow-tracker bounds staleness.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:712:      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:731:      staleCount: pending + failed + retry,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:751:  const staleWarning = stats.staleCount > 10
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:757:    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:761:    staleWarning.trim(),
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:798:    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1191:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1313:          staleDeleted: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1314:          staleDeleteFailed: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1561:  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1571:      causalBoost,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1674:    causalBoost.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1843:                    staleDeleted: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1844:                    staleDeleteFailed: 0,
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:133:| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | Classification-aware decay in FSRS scheduling and composite scoring. Graduated ON. | `lib/cognitive/fsrs-scheduler.ts`, `lib/scoring/composite-scoring.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:174:| `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | Graph momentum scoring and causal depth signals (N2a+N2b). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:189:| `SPECKIT_TEMPORAL_EDGES` | `true` | boolean | Temporal validity tracking for causal edges (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:223:| `SPECKIT_ARCHIVAL` | `true` | boolean | Archival manager for aging out stale memories (90-day max age). Graduated ON. | `lib/cognitive/archival-manager.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:224:| `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | Type-aware no-decay for permanent artifacts (decision/constitutional types get Infinity stability). Graduated ON. | `lib/cognitive/fsrs-scheduler.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:227:| `SPECKIT_CONSOLIDATION` | `true` | boolean | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection (N3-lite). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:232:| `SPECKIT_RECENCY_DECAY_DAYS` | (internal) | number | Number of days for recency decay calculation in access tracking. | `lib/storage/access-tracker.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:233:| `SPECKIT_EVENT_DECAY` | `true` | boolean | Event decay processing in working memory. Graduated ON. | `lib/cognitive/working-memory.ts` (via tests) |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183:  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:208:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:229:        // Clean up causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:231:        // Previously errors were caught and logged, leaving orphan causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:233:        causalEdges.deleteEdgesForMemory(String(memory.id));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:26:import * as attentionDecay from '../lib/cognitive/attention-decay.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:81:  decayedCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:97:  decayApplied: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:122:/** Per-turn decay rate for attention scoring. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:130:/** Fetch full memory records required for FSRS tier classification. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:161:  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:278:  let decayStats: DecayStats | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:345:          decayApplied: decayStats ? decayStats.decayedCount : 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:417:          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:426:        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:432:      // Clamp to [0,1] — retrievability * decay or wmEntry scores
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:471:      decayApplied: decayStats ? decayStats.decayedCount : 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:12:import * as causalEdges from '../../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:38:  causalSupersedesMemoryId: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:49:      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:59:      causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:66:    causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:80:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:84:  causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:87:    causalEdges.RELATION_TYPES.SUPERSEDES,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:261:      lineageRouting.causalSupersedesMemoryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:74:  causalLinks?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:45:| `post-insert.ts`            | Post-insert enrichment pipeline. Runs causal links processing, R10 entity extraction, R8 summary generation and S5 cross-document entity linking. Each step is feature-flag gated and independently error-guarded. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:60:8. post-insert    -- Enrich with entities, summaries, causal links
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:81:- `../../lib/cognitive/fsrs-scheduler.ts` -- FSRS stability/difficulty defaults
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:396:          // Auto-merge: archive the older memory record (shadow operation —
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:397:          // we mark is_archived so it is excluded from future search results
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:8:import { processCausalLinks } from '../causal-links-processor.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:38:  causalLinks: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:46:  causalLinksResult: CausalLinksResult | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:53: * Sequentially executes: causal links processing, entity extraction (R10),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:61: * @returns PostInsertEnrichmentResult with causal links outcome.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:70:    causalLinks: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:78:  let causalLinksResult: CausalLinksResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:79:  if (parsed.hasCausalLinks && parsed.causalLinks) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:81:      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:82:      enrichmentStatus.causalLinks = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:83:      if (causalLinksResult.inserted > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:84:        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      if (causalLinksResult.unresolved.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:87:        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:89:    } catch (causal_err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:90:      const message = toErrorMessage(causal_err);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:94:    // No causal links to process — not a failure
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:95:    enrichmentStatus.causalLinks = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:103:      // Data integrity: clean stale auto-entities before re-extraction on update
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:193:  return { causalLinksResult, enrichmentStatus };
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:56:  causalLinksResult: CausalLinksResult | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:124:  causalLinksResult,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:224:  if (causalLinksResult) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:225:    result.causalLinks = {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:226:      processed: causalLinksResult.processed,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:227:      inserted: causalLinksResult.inserted,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:228:      resolved: causalLinksResult.resolved,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:229:      unresolved_count: causalLinksResult.unresolved.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:231:    if (causalLinksResult.errors.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:232:      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:423:  if (result.causalLinks) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:424:    response.causalLinks = result.causalLinks;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:425:    if ((result.causalLinks as Record<string, unknown>).inserted as number > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:426:      hints.push(`Created ${(result.causalLinks as Record<string, unknown>).inserted} causal graph edge(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:428:    if ((result.causalLinks as Record<string, unknown>).unresolved_count as number > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:429:      hints.push(`${(result.causalLinks as Record<string, unknown>).unresolved_count} causal link reference(s) could not be resolved`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:453:        `-${consolidation.hebbian.decayed} decayed, ${consolidation.stale.flagged} stale flagged`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:13:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:94:    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:115:        causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:116:        causalEdges.deleteEdgesForMemory(String(numericId));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:191:    causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:211:          causalEdges.deleteEdgesForMemory(String(memory.id));
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:106:- Server starts but search returns empty or stale results
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:125:- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:127:- empty or broadly stale graphs still require explicit `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:447:- the startup or bootstrap response reports freshness-aware graph status
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:449:- if the graph is only lightly stale, the read path may refresh inline before returning results
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:555:- `minState`: Minimum memory state (HOT, WARM, COLD, DORMANT, ARCHIVED)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:620:Routes retrieval requests through per-type strategies based on the artifact being queried. Supports 8 artifact types: `spec`, `plan`, `checklist`, `decision-record`, `memory`, `implementation-summary`, `research` and `handover`. Each type applies its own indexing and ranking rules (for example, `memory` uses recency-weighted scoring while `decision-record` boosts causal edges).
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:786:| `Cannot find module '@spec-kit/shared/...'` | Workspace dependency state is incomplete or stale | Run `npm install && npm run build` from the skill root |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:793:| Database appears stale after restore | Client still uses old MCP process with in-memory state | Fully restart OpenCode or Claude Code |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:12:import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:25:// Feature catalog: Causal graph statistics (memory_causal_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:35:  id: number;               // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338:/** Handle memory_drift_why tool - traces causal relationships for a given memory */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:378:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:381:      const validRelations: string[] = Object.values(causalEdges.RELATION_TYPES) as string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:408:        const forwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:409:        const backwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:413:        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:416:        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:484:        summary: `No causal relationships found for memory ${memoryId}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:490:          'Use memory_causal_link to create relationships',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:504:      ? `Found ${combinedChain.total_edges} causal relationships (${relationSummary.join('; ')})`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:505:      : `Found ${combinedChain.total_edges} causal relationships`;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:513:        `Traversal truncated after ${combinedChain.truncation_limit ?? causalEdges.MAX_EDGES_LIMIT} edges per node - results may be incomplete`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:576:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:581:        validRelations: Object.values(causalEdges.RELATION_TYPES) as string[]
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:584:        hint: 'Provide all required parameters to create a causal link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:588:          `relation: One of ${Object.values(causalEdges.RELATION_TYPES).join(', ')}`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:603:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:611:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:613:    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:616:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:624:    const safeRelation = relation as causalEdges.RelationType;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:625:    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:629:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:640:      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:647:        'Use memory_causal_stats() to check overall graph coverage'
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653:      'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:667:/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:678:        tool: 'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:682:        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:686:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:688:    const stats = causalEdges.getGraphStats();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:689:    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:698:        'SELECT DISTINCT source_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id) UNION SELECT DISTINCT target_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)'
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:705:      if (message.includes('no such table') && message.includes('causal_edges')) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:706:        // New/partially initialized DB where causal edges table is absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:725:      hints.push(`Coverage ${coveragePercent}% below 60% target - add more causal links`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:735:      tool: 'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:755:      'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:769:/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:776:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:784:          'Use memory_causal_stats() to see graph overview'
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:799:        tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:803:        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:807:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:809:    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:812:      ? `Deleted causal edge ${edgeId}`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:821:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:829:      'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:854:const handle_memory_causal_stats = handleMemoryCausalStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:855:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:859:  handle_memory_causal_link,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:860:  handle_memory_causal_stats,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:861:  handle_memory_causal_unlink,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:5:// readiness, code graph freshness, and priming status.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:33:type SessionStatus = 'ok' | 'warning' | 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:38:  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:76:  // Determine graph freshness
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:92:        graphFreshness = 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:110:    status = 'stale';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:111:  } else if (graphFreshness === 'stale' || graphFreshness === 'empty' || lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:122:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:76:type CausalGraphModule = typeof import('./causal-graph.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:94:let causalGraphModule: Promise<CausalGraphModule> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:179:  if (!causalGraphModule) {
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:180:    causalGraphModule = loadHandlerModule<CausalGraphModule>('causal-graph');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:182:  return causalGraphModule;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:315:export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:316:export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');

codex
I’ve now confirmed Mex’s code matches the high-level story: no forgetting mechanism, just static drift checks, stale-file thresholds, targeted repair prompts, and scaffold growth. I’m reading the Spec Kit sources that actually implement decay, archival, and access-based relevance so I can turn this into a real comparison instead of just a Mex summary.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/search/consolidation-engine.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts' \\
'.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,280p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Working Memory
     3	// ───────────────────────────────────────────────────────────────
     4	// Session-based attention management
     5	// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
     6	// Only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
     7	// The working_memory table, NOT memory_index. This is intentionally
     8	// Independent of FSRS long-term decay — different time scale, different
     9	// Domain (ephemeral session attention vs persistent memory scoring).
    10	// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
    11	// Ensures stable resting state and explicit low-score eviction.
    12	import type Database from 'better-sqlite3';
    13	import { isFeatureEnabled } from './rollout-policy.js';
    14	
    15	// Feature catalog: Tool-result extraction to working memory
    16	// Feature catalog: Working Memory Session Cleanup Timestamp Fix
    17	
    18	
    19	/* --- 1. CONFIGURATION --- */
    20	
    21	interface WorkingMemoryConfigType {
    22	  enabled: boolean;
    23	  maxCapacity: number;
    24	  sessionTimeoutMs: number;
    25	}
    26	
    27	const WORKING_MEMORY_CONFIG: WorkingMemoryConfigType = {
    28	  enabled: process.env.SPECKIT_WORKING_MEMORY !== 'false',
    29	  maxCapacity: 7, // Miller's Law: 7 +/- 2
    30	  sessionTimeoutMs: 1800000, // 30 minutes
    31	};
    32	
    33	const EVENT_DECAY_FACTOR = 0.85;
    34	const MENTION_BOOST_FACTOR = 0.05;
    35	const DECAY_FLOOR = 0.05;
    36	const DELETE_THRESHOLD = 0.01;
    37	const EVENT_COUNTER_MODULUS = 2 ** 31;
    38	// Cap mention_count to prevent unbounded integer growth in long-lived
    39	// Sessions. The mention boost formula (mention_count * MENTION_BOOST_FACTOR)
    40	// Would produce unreasonably large scores without a ceiling.
    41	const MAX_MENTION_COUNT = 100;
    42	
    43	/* --- 2. SCHEMA SQL --- */
    44	
    45	const SCHEMA_SQL = `
    46	  CREATE TABLE IF NOT EXISTS working_memory (
    47	    id INTEGER PRIMARY KEY AUTOINCREMENT,
    48	    session_id TEXT NOT NULL,
    49	    memory_id INTEGER,
    50	    attention_score REAL DEFAULT 1.0,
    51	    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    52	    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
    53	    focus_count INTEGER DEFAULT 1,
    54	    event_counter INTEGER NOT NULL DEFAULT 0,
    55	    mention_count INTEGER NOT NULL DEFAULT 0,
    56	    source_tool TEXT,
    57	    source_call_id TEXT,
    58	    extraction_rule_id TEXT,
    59	    redaction_applied INTEGER NOT NULL DEFAULT 0,
    60	    UNIQUE(session_id, memory_id),
    61	    FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
    62	  )
    63	`;
    64	
    65	const INDEX_SQL = `
    66	  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
    67	  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
    68	  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);
    69	  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
    70	  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
    71	`;
    72	
    73	/* --- 3. INTERFACES --- */
    74	
    75	interface WorkingMemoryEntry {
    76	  id: number;
    77	  session_id: string;
    78	  memory_id: number;
    79	  attention_score: number;
    80	  added_at: string;
    81	  last_focused: string;
    82	  focus_count: number;
    83	  event_counter: number;
    84	  mention_count: number;
    85	  source_tool?: string | null;
    86	  source_call_id?: string | null;
    87	  extraction_rule_id?: string | null;
    88	  redaction_applied?: number;
    89	}
    90	
    91	interface ExtractedEntryInput {
    92	  sessionId: string;
    93	  memoryId: number;
    94	  attentionScore: number;
    95	  sourceTool: string;
    96	  sourceCallId: string;
    97	  extractionRuleId: string;
    98	  redactionApplied: boolean;
    99	}
   100	
   101	interface SessionInfo {
   102	  sessionId: string;
   103	  memoryCount: number;
   104	  avgAttention: number;
   105	  createdAt: string;
   106	  lastActivity: string;
   107	}
   108	
   109	interface SessionStats {
   110	  sessionId: string;
   111	  totalEntries: number;
   112	  avgAttention: number;
   113	  maxAttention: number;
   114	  minAttention: number;
   115	  totalFocusEvents: number;
   116	}
   117	
   118	interface SessionPromptContextEntry {
   119	  memoryId: number;
   120	  title: string;
   121	  filePath: string;
   122	  attentionScore: number;
   123	}
   124	
   125	/* --- 4. MODULE STATE --- */
   126	
   127	let db: Database.Database | null = null;
   128	let schemaEnsured = false;
   129	const sessionModeRegistry = new Map<string, string>();
   130	
   131	/* --- 5. INITIALIZATION --- */
   132	
   133	function init(database: Database.Database): void {
   134	  db = database;
   135	  schemaEnsured = false;
   136	  ensureSchema();
   137	}
   138	
   139	function ensureSchema(): void {
   140	  if (!db || schemaEnsured) return;
   141	
   142	  try {
   143	    db.exec(SCHEMA_SQL);
   144	    const wmColumns = (db.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
   145	      .map(column => column.name);
   146	
   147	    if (!wmColumns.includes('event_counter')) {
   148	      db.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
   149	    }
   150	    if (!wmColumns.includes('mention_count')) {
   151	      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
   152	    }
   153	    if (!wmColumns.includes('source_tool')) {
   154	      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
   155	    }
   156	    if (!wmColumns.includes('source_call_id')) {
   157	      db.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
   158	    }
   159	    if (!wmColumns.includes('extraction_rule_id')) {
   160	      db.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
   161	    }
   162	    if (!wmColumns.includes('redaction_applied')) {
   163	      db.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
   164	    }
   165	
   166	    migrateLegacyWorkingMemorySchema();
   167	    db.exec(INDEX_SQL);
   168	    schemaEnsured = true;
   169	  } catch (error: unknown) {
   170	    const msg = error instanceof Error ? error.message : String(error);
   171	    console.warn(`[working-memory] Schema creation failed: ${msg}`);
   172	  }
   173	}
   174	
   175	function migrateLegacyWorkingMemorySchema(): void {
   176	  if (!db) return;
   177	
   178	  const tableInfo = db.prepare(
   179	    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
   180	  ).get() as { sql?: string | null } | undefined;
   181	  const tableSql = tableInfo?.sql ?? '';
   182	  const needsMigration = tableSql.includes('ON DELETE CASCADE') || tableSql.includes('memory_id INTEGER NOT NULL');
   183	
   184	  if (!needsMigration) {
   185	    return;
   186	  }
   187	
   188	  db.exec(`
   189	    ALTER TABLE working_memory RENAME TO working_memory_old;
   190	    ${SCHEMA_SQL};
   191	    INSERT INTO working_memory (
   192	      id,
   193	      session_id,
   194	      memory_id,
   195	      attention_score,
   196	      added_at,
   197	      last_focused,
   198	      focus_count,
   199	      event_counter,
   200	      mention_count,
   201	      source_tool,
   202	      source_call_id,
   203	      extraction_rule_id,
   204	      redaction_applied
   205	    )
   206	    SELECT
   207	      id,
   208	      session_id,
   209	      memory_id,
   210	      attention_score,
   211	      added_at,
   212	      last_focused,
   213	      focus_count,
   214	      COALESCE(event_counter, 0),
   215	      COALESCE(mention_count, 0),
   216	      source_tool,
   217	      source_call_id,
   218	      extraction_rule_id,
   219	      COALESCE(redaction_applied, 0)
   220	    FROM working_memory_old;
   221	    DROP TABLE working_memory_old;
   222	  `);
   223	}
   224	
   225	/* --- 6. SESSION MANAGEMENT --- */
   226	
   227	function getOrCreateSession(sessionId: string | null = null): string {
   228	  if (sessionId) return sessionId;
   229	
   230	  // Generate a new session ID
   231	  const timestamp = Date.now().toString(36);
   232	  const random = Math.random().toString(36).substring(2, 8);
   233	  return `wm-${timestamp}-${random}`;
   234	}
   235	
   236	function clearSession(sessionId: string): number {
   237	  if (!db) return 0;
   238	  ensureSchema();
   239	
   240	  try {
   241	    const result = (db.prepare(
   242	      'DELETE FROM working_memory WHERE session_id = ?'
   243	    ) as Database.Statement).run(sessionId);
   244	    sessionModeRegistry.delete(sessionId);
   245	    return (result as { changes: number }).changes;
   246	  } catch (error: unknown) {
   247	    const msg = error instanceof Error ? error.message : String(error);
   248	    console.warn(`[working-memory] clearSession error: ${msg}`);
   249	    return 0;
   250	  }
   251	}
   252	
   253	function cleanupOldSessions(): number {
   254	  if (!db) return 0;
   255	  ensureSchema();
   256	
   257	  try {
   258	    const timeoutSeconds = Math.floor(WORKING_MEMORY_CONFIG.sessionTimeoutMs / 1000);
   259	    const nowIso = new Date(Date.now()).toISOString();
   260	    const staleSessionIds = (db.prepare(
   261	      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   262	    ) as Database.Statement).all(nowIso, timeoutSeconds) as Array<{ session_id: string }>;
   263	    const result = (db.prepare(
   264	      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   265	    ) as Database.Statement).run(nowIso, timeoutSeconds);
   266	    for (const row of staleSessionIds) {
   267	      sessionModeRegistry.delete(row.session_id);
   268	    }
   269	    return (result as { changes: number }).changes;
   270	  } catch (error: unknown) {
   271	    const msg = error instanceof Error ? error.message : String(error);
   272	    console.warn(`[working-memory] cleanupOldSessions error: ${msg}`);
   273	    return 0;
   274	  }
   275	}
   276	
   277	/* --- 7. WORKING MEMORY OPERATIONS --- */
   278	
   279	function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
   280	  if (!db) return [];
===== .opencode/skill/system-spec-kit/mcp_server/lib/search/consolidation-engine.ts =====
nl: .opencode/skill/system-spec-kit/mcp_server/lib/search/consolidation-engine.ts: No such file or directory
===== .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Response Builder
     3	// ───────────────────────────────────────────────────────────────
     4	import type BetterSqlite3 from 'better-sqlite3';
     5	import type * as memoryParser from '../../lib/parsing/memory-parser.js';
     6	
     7	import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
     8	import * as retryManager from '../../lib/providers/retry-manager.js';
     9	import { runConsolidationCycleIfEnabled } from '../../lib/storage/consolidation.js';
    10	import { createMCPErrorResponse, createMCPSuccessResponse } from '../../lib/response/envelope.js';
    11	import { requireDb, toErrorMessage } from '../../utils/index.js';
    12	
    13	import { appendMutationLedgerSafe } from '../memory-crud-utils.js';
    14	import { runPostMutationHooks } from '../mutation-hooks.js';
    15	import type { MCPResponse } from '../types.js';
    16	import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
    17	import type {
    18	  AssistiveRecommendation,
    19	  IndexResult,
    20	  PeDecision,
    21	  ReconWarningList,
    22	} from './types.js';
    23	import type { EnrichmentStatus } from './post-insert.js';
    24	import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
    25	
    26	// Feature catalog: Mutation response UX payload exposure
    27	// Feature catalog: Duplicate-save no-op feedback hardening
    28	// Feature catalog: Atomic-save parity and partial-indexing hints
    29	
    30	
    31	interface ValidationResult {
    32	  valid: boolean;
    33	  errors: string[];
    34	  warnings: string[];
    35	}
    36	
    37	interface CausalLinksResult {
    38	  processed: number;
    39	  inserted: number;
    40	  resolved: number;
    41	  unresolved: { type: string; reference: string }[];
    42	  errors: { type: string; reference: string; error: string }[];
    43	}
    44	
    45	interface BuildIndexResultParams {
    46	  database: BetterSqlite3.Database;
    47	  existing: { id: number; content_hash: string } | undefined;
    48	  embeddingStatus: string;
    49	  id: number;
    50	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
    51	  validation: ValidationResult;
    52	  reconWarnings: ReconWarningList;
    53	  peDecision: PeDecision;
    54	  embeddingFailureReason: string | null;
    55	  asyncEmbedding: boolean;
    56	  causalLinksResult: CausalLinksResult | null;
    57	  enrichmentStatus?: EnrichmentStatus;
    58	  filePath: string;
    59	}
    60	
    61	interface BuildSaveResponseParams {
    62	  result: IndexResult;
    63	  filePath: string;
    64	  asyncEmbedding: boolean;
    65	  requestId: string;
    66	}
    67	
    68	function buildAssistiveReviewDescription(
    69	  recommendation: Pick<
    70	    AssistiveRecommendation,
    71	    'classification' | 'olderMemoryId' | 'newerMemoryId' | 'similarity'
    72	  >,
    73	): string {
    74	  const newerLabel = recommendation.newerMemoryId != null
    75	    ? `saved memory #${recommendation.newerMemoryId}`
    76	    : 'the pending save';
    77	  return (
    78	    `Review borderline similarity ${recommendation.similarity.toFixed(3)} between ` +
    79	    `${newerLabel} and existing memory #${recommendation.olderMemoryId}; ` +
    80	    `heuristic suggests ${recommendation.classification}.`
    81	  );
    82	}
    83	
    84	function finalizeAssistiveRecommendation(
    85	  reconWarnings: ReconWarningList,
    86	  savedMemoryId: number,
    87	): AssistiveRecommendation | undefined {
    88	  const rawRecommendation = reconWarnings.assistiveRecommendation;
    89	  if (!rawRecommendation) return undefined;
    90	
    91	  const candidateMemoryIds = Array.from(
    92	    new Set([
    93	      ...rawRecommendation.candidateMemoryIds,
    94	      rawRecommendation.olderMemoryId,
    95	      savedMemoryId,
    96	    ].filter((memoryId) => Number.isInteger(memoryId) && memoryId > 0)),
    97	  );
    98	
    99	  const newerMemoryId = rawRecommendation.newerMemoryId ?? savedMemoryId;
   100	  return {
   101	    ...rawRecommendation,
   102	    newerMemoryId,
   103	    candidateMemoryIds,
   104	    description: buildAssistiveReviewDescription({
   105	      classification: rawRecommendation.classification,
   106	      olderMemoryId: rawRecommendation.olderMemoryId,
   107	      newerMemoryId,
   108	      similarity: rawRecommendation.similarity,
   109	    }),
   110	  };
   111	}
   112	
   113	export function buildIndexResult({
   114	  database,
   115	  existing,
   116	  embeddingStatus,
   117	  id,
   118	  parsed,
   119	  validation,
   120	  reconWarnings,
   121	  peDecision,
   122	  embeddingFailureReason,
   123	  asyncEmbedding,
   124	  causalLinksResult,
   125	  enrichmentStatus,
   126	  filePath,
   127	}: BuildIndexResultParams): IndexResult {
   128	  let resultStatus: string;
   129	  if (existing) {
   130	    resultStatus = 'updated';
   131	  } else if (embeddingStatus !== 'success') {
   132	    resultStatus = 'deferred';
   133	  } else {
   134	    resultStatus = 'indexed';
   135	  }
   136	
   137	  const linkedMemoryIds = [
   138	    id,
   139	    ...(peDecision.existingMemoryId != null ? [peDecision.existingMemoryId] : []),
   140	  ];
   141	  const ledgerRecorded = appendMutationLedgerSafe(database, {
   142	    mutationType: existing ? 'update' : 'create',
   143	    reason: existing
   144	      ? 'memory_save: updated indexed memory entry'
   145	      : 'memory_save: created new indexed memory entry',
   146	    priorHash: existing?.content_hash ?? null,
   147	    newHash: parsed.contentHash,
   148	    linkedMemoryIds,
   149	    decisionMeta: {
   150	      tool: 'memory_save',
   151	      status: resultStatus,
   152	      action: peDecision.action,
   153	      similarity: peDecision.similarity,
   154	      specFolder: parsed.specFolder,
   155	      filePath,
   156	      embeddingStatus,
   157	      qualityScore: parsed.qualityScore ?? 0,
   158	      documentType: parsed.documentType || 'memory',
   159	    },
   160	    actor: 'mcp:memory_save',
   161	  });
   162	
   163	  const result: IndexResult = {
   164	    status: resultStatus,
   165	    id,
   166	    specFolder: parsed.specFolder,
   167	    title: parsed.title ?? '',
   168	    triggerPhrases: parsed.triggerPhrases,
   169	    contextType: parsed.contextType,
   170	    importanceTier: parsed.importanceTier,
   171	    memoryType: parsed.memoryType,
   172	    memoryTypeSource: parsed.memoryTypeSource,
   173	    embeddingStatus,
   174	    warnings: [...validation.warnings, ...reconWarnings],
   175	    qualityScore: parsed.qualityScore,
   176	    qualityFlags: parsed.qualityFlags,
   177	  };
   178	  if (!ledgerRecorded) {
   179	    result.warnings = result.warnings || [];
   180	    result.warnings.push('Mutation ledger append failed; audit trail may be incomplete.');
   181	  }
   182	
   183	  const assistiveRecommendation = finalizeAssistiveRecommendation(reconWarnings, id);
   184	  if (assistiveRecommendation) {
   185	    result.assistiveRecommendation = assistiveRecommendation;
   186	  }
   187	
   188	  if (peDecision.action !== predictionErrorGate.ACTION.CREATE) {
   189	    result.pe_action = peDecision.action;
   190	    result.pe_reason = peDecision.reason;
   191	  }
   192	
   193	  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
   194	    result.superseded_id = peDecision.existingMemoryId;
   195	  }
   196	
   197	  if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
   198	    result.related_ids = [peDecision.existingMemoryId];
   199	  }
   200	
   201	  if (embeddingStatus === 'pending' && embeddingFailureReason) {
   202	    // Security: raw provider errors sanitized before persistence/response
   203	    result.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(embeddingFailureReason) ?? undefined;
   204	    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
   205	  }
   206	
   207	  if (asyncEmbedding && embeddingStatus === 'pending') {
   208	    const memoryId = id;
   209	    const memoryContent = parsed.content;
   210	    setImmediate(() => {
   211	      retryManager.claimAndRetryEmbedding(memoryId, memoryContent, 'pending')
   212	        .then((retryResult) => {
   213	          if (retryResult && !retryResult.success && retryResult.error) {
   214	            console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${retryResult.error}`);
   215	          }
   216	        })
   217	        .catch((err: unknown) => {
   218	          const message = toErrorMessage(err);
   219	          console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
   220	        });
   221	    });
   222	  }
   223	
   224	  if (causalLinksResult) {
   225	    result.causalLinks = {
   226	      processed: causalLinksResult.processed,
   227	      inserted: causalLinksResult.inserted,
   228	      resolved: causalLinksResult.resolved,
   229	      unresolved_count: causalLinksResult.unresolved.length,
   230	    };
   231	    if (causalLinksResult.errors.length > 0) {
   232	      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
   233	    }
   234	  }
   235	
   236	  // C5-6: Surface enrichment gaps when any step failed
   237	  if (enrichmentStatus && Object.values(enrichmentStatus).some(v => !v)) {
   238	    const failed = Object.entries(enrichmentStatus)
   239	      .filter(([, v]) => !v)
   240	      .map(([k]) => k);
   241	    result.warnings = result.warnings || [];
   242	    result.warnings.push(`Partial enrichment: ${failed.join(', ')} failed`);
   243	  }
   244	
   245	  return result;
   246	}
   247	
   248	export function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse {
   249	  if (result.status === 'unchanged') {
   250	    return createMCPSuccessResponse({
   251	      tool: 'memory_save',
   252	      summary: 'Memory already indexed with same content',
   253	      data: {
   254	        status: 'unchanged',
   255	        id: result.id,
   256	        specFolder: result.specFolder,
   257	        title: result.title,
   258	      },
   259	      hints: ['Use force: true to re-index anyway'],
   260	    });
   261	  }
   262	
   263	  if (result.status === 'error') {
   264	    const errorMessage = typeof result.error === 'string' && result.error.length > 0
   265	      ? result.error
   266	      : (typeof result.message === 'string' && result.message.length > 0 ? result.message : 'Memory save failed');
   267	
   268	    return createMCPErrorResponse({
   269	      tool: 'memory_save',
   270	      error: errorMessage,
   271	      code: 'E081',
   272	      details: {
   273	        status: result.status,
   274	        id: result.id,
   275	        specFolder: result.specFolder,
   276	        title: result.title,
   277	        ...(typeof result.superseded === 'boolean' ? { superseded: result.superseded } : {}),
   278	      },
   279	    });
   280	  }
===== .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Types
     3	// ───────────────────────────────────────────────────────────────
     4	import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
     5	import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
     6	import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
     7	
     8	// Feature catalog: Memory indexing (memory_save)
     9	// Feature catalog: Validation feedback (memory_validate)
    10	// Feature catalog: Dry-run preflight for memory_save
    11	
    12	
    13	export interface ValidationResult {
    14	  valid: boolean;
    15	  errors: string[];
    16	  warnings: string[];
    17	}
    18	
    19	export interface SimilarMemory {
    20	  id: number;
    21	  similarity: number;
    22	  content: string;
    23	  stability: number;
    24	  difficulty: number;
    25	  file_path: string;
    26	  [key: string]: unknown;
    27	}
    28	
    29	export interface PeDecision {
    30	  action: string;
    31	  similarity: number;
    32	  existingMemoryId?: number | null;
    33	  reason?: string;
    34	  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
    35	}
    36	
    37	export type AssistiveClassification = 'supersede' | 'complement' | 'keep_separate';
    38	
    39	export interface AssistiveRecommendation {
    40	  action: 'review';
    41	  similarity: number;
    42	  candidateMemoryIds: number[];
    43	  description: string;
    44	  olderMemoryId: number;
    45	  newerMemoryId: number | null;
    46	  classification: AssistiveClassification;
    47	  recommendedAt: number;
    48	}
    49	
    50	export type ReconWarningList = string[] & {
    51	  assistiveRecommendation?: AssistiveRecommendation | null;
    52	};
    53	
    54	export interface IndexResult extends Record<string, unknown> {
    55	  status: string;
    56	  id: number;
    57	  specFolder: string;
    58	  title: string | null;
    59	  triggerPhrases?: string[];
    60	  contextType?: string;
    61	  importanceTier?: string;
    62	  memoryType?: string;
    63	  memoryTypeSource?: string;
    64	  embeddingStatus?: string;
    65	  embeddingFailureReason?: string;
    66	  warnings?: string[];
    67	  pe_action?: string;
    68	  pe_reason?: string;
    69	  superseded_id?: number;
    70	  related_ids?: number[];
    71	  previous_stability?: number;
    72	  newStability?: number;
    73	  retrievability?: number;
    74	  causalLinks?: Record<string, unknown>;
    75	  message?: string;
    76	  success?: boolean;
    77	  error?: string;
    78	  qualityScore?: number;
    79	  qualityFlags?: string[];
    80	  rejectionReason?: string;
    81	  rejectionCode?: string;
    82	  sufficiency?: MemorySufficiencyResult;
    83	  assistiveRecommendation?: AssistiveRecommendation;
    84	  qualityGate?: {
    85	    pass: boolean;
    86	    reasons: string[];
    87	    layers: unknown;
    88	  };
    89	}
    90	
    91	export interface CausalLinksResult {
    92	  processed: number;
    93	  inserted: number;
    94	  resolved: number;
    95	  unresolved: { type: string; reference: string }[];
    96	  errors: { type: string; reference: string; error: string }[];
    97	}
    98	
    99	export interface AtomicSaveParams {
   100	  file_path: string;
   101	  content: string;
   102	}
   103	
   104	export interface AtomicSaveOptions {
   105	  force?: boolean;
   106	}
   107	
   108	export interface AtomicSaveResult {
   109	  success: boolean;
   110	  filePath: string;
   111	  error?: string;
   112	  errorMetadata?: Record<string, string>;
   113	  dbCommitted?: boolean;
   114	  status?: string;
   115	  id?: number;
   116	  specFolder?: string;
   117	  title?: string | null;
   118	  summary?: string;
   119	  message?: string;
   120	  embeddingStatus?: string;
   121	  postMutationHooks?: ReturnType<typeof buildMutationHookFeedback>['data'];
   122	  hints?: string[];
   123	}
   124	
   125	export interface SaveArgs {
   126	  filePath: string;
   127	  force?: boolean;
   128	  dryRun?: boolean;
   129	  skipPreflight?: boolean;
   130	  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
   131	  tenantId?: string;
   132	  userId?: string;
   133	  agentId?: string;
   134	  sessionId?: string;
   135	  sharedSpaceId?: string;
   136	  provenanceSource?: string;
   137	  provenanceActor?: string;
   138	  governedAt?: string;
   139	  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
   140	  deleteAfter?: string;
   141	}
   142	
   143	export interface PostInsertMetadataFields {
   144	  content_hash?: string;
   145	  context_type?: string;
   146	  importance_tier?: string;
   147	  memory_type?: string;
   148	  type_inference_source?: string;
   149	  stability?: number;
   150	  difficulty?: number;
   151	  review_count?: number;
   152	  file_mtime_ms?: number | null;
   153	  embedding_status?: string;
   154	  encoding_intent?: string | null;
   155	  document_type?: string;
   156	  spec_level?: number | null;
   157	  quality_score?: number;
   158	  quality_flags?: string; // pre-stringified JSON
   159	  parent_id?: number;
   160	  chunk_index?: number;
   161	  chunk_label?: string;
   162	  tenant_id?: string;
   163	  user_id?: string;
   164	  agent_id?: string;
   165	  shared_space_id?: string;
   166	  provenance_source?: string;
   167	  provenance_actor?: string;
   168	  governed_at?: string;
   169	  retention_policy?: string;
   170	  delete_after?: string | null;
   171	  governance_metadata?: string;
   172	}
   173	
   174	export type { ParsedMemory };
   175	
   176	export interface MemoryScopeMatch {
   177	  tenantId?: string | null;
   178	  userId?: string | null;
   179	  agentId?: string | null;
   180	  sessionId?: string | null;
   181	  sharedSpaceId?: string | null;
   182	}
   183	
   184	export function normalizeScopeMatchValue(value?: string | null): string | null {
   185	  if (typeof value !== 'string') return null;
   186	  const normalized = value.trim();
   187	  return normalized.length > 0 ? normalized : null;
   188	}
===== .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts =====
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.js' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,280p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.js =====
nl: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.js: No such file or directory
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs Scheduler
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// CANONICAL FSRS CONSTANTS & ALGORITHM
     6	// Free Spaced Repetition Scheduler v4 algorithm implementation
     7	//
     8	// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
     9	// Long-term memory (this file):
    10	// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
    11	// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
    12	// All long-term decay consumers MUST import constants from this file.
    13	//
    14	// Working memory (working-memory.ts — separate system, intentionally decoupled):
    15	// Linear multiplicative: score * 0.95 per tick
    16	// Timescale: minutes. Operates on session-scoped attention scores only.
    17	//
    18	// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
    19	// Algorithm. All temporal decay for persistent memories should route
    20	// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
    21	// Where t = elapsed days, S = stability (grows with successful reviews).
    22	//
    23	// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
    24	// Factor), tier-classifier.ts (state classification),
    25	// Vector-index-impl.js (SQL search ranking).
    26	
    27	import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';
    28	
    29	/* --- 1. CONSTANTS --- */
    30	
    31	/** FSRS v4 algorithm constants */
    32	const FSRS_FACTOR = 19 / 81;
    33	const FSRS_DECAY = -0.5;
    34	
    35	// Derived constant for half-life ↔ stability conversion.
    36	// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
    37	const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819
    38	
    39	/** Grade constants for review scoring */
    40	const GRADE_AGAIN = 1;
    41	const GRADE_HARD = 2;
    42	const GRADE_GOOD = 3;
    43	const GRADE_EASY = 4;
    44	
    45	/** Default initial parameters */
    46	const DEFAULT_INITIAL_STABILITY = 1.0;
    47	const DEFAULT_INITIAL_DIFFICULTY = 5.0;
    48	
    49	/** Difficulty bounds */
    50	const MIN_DIFFICULTY = 1.0;
    51	const MAX_DIFFICULTY = 10.0;
    52	
    53	/** Stability bounds */
    54	const MIN_STABILITY = 0.1;
    55	
    56	/* --- 2. INTERFACES --- */
    57	
    58	interface FsrsParams {
    59	  stability: number;
    60	  difficulty: number;
    61	  lastReview: string | null;
    62	  reviewCount: number;
    63	}
    64	
    65	interface ReviewResult {
    66	  stability: number;
    67	  difficulty: number;
    68	  lastReview: string;
    69	  reviewCount: number;
    70	  nextReviewDate: string;
    71	  retrievability: number;
    72	}
    73	
    74	/* --- 3. CORE FUNCTIONS --- */
    75	
    76	/**
    77	 * Calculate retrievability (probability of recall) using FSRS v4 formula.
    78	 * R(t) = (1 + FACTOR * t / S)^DECAY
    79	 */
    80	function calculateRetrievability(stability: number, elapsedDays: number): number {
    81	  if (stability <= 0 || elapsedDays < 0) {
    82	    return 0;
    83	  }
    84	
    85	  const retrievability = Math.pow(
    86	    1 + FSRS_FACTOR * (elapsedDays / stability),
    87	    FSRS_DECAY
    88	  );
    89	
    90	  return Math.max(0, Math.min(1, retrievability));
    91	}
    92	
    93	/**
    94	 * Update stability based on review grade.
    95	 * Uses simplified FSRS v4 update rules.
    96	 */
    97	function updateStability(
    98	  currentStability: number,
    99	  difficulty: number,
   100	  grade: number,
   101	  retrievability: number
   102	): number {
   103	  const safeStability = Math.max(0, currentStability);
   104	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
   105	
   106	  if (grade === GRADE_AGAIN) {
   107	    // Lapse: stability decreases significantly
   108	    return Math.max(MIN_STABILITY, safeStability * 0.2);
   109	  }
   110	
   111	  // Success: stability increases based on grade and difficulty
   112	  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
   113	  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
   114	  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;
   115	
   116	  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;
   117	
   118	  return Math.max(MIN_STABILITY, newStability);
   119	}
   120	
   121	/**
   122	 * Calculate optimal review interval from stability.
   123	 * The interval where retrievability = 0.9 (desired retention).
   124	 */
   125	function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
   126	  const safeStability = Math.max(0, stability);
   127	
   128	  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
   129	    return 0;
   130	  }
   131	
   132	  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
   133	
   134	  return Math.max(0, Math.round(Math.max(0, interval)));
   135	}
   136	
   137	/**
   138	 * Update difficulty based on review grade.
   139	 */
   140	function updateDifficulty(currentDifficulty: number, grade: number): number {
   141	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty));
   142	  let newDifficulty: number;
   143	
   144	  if (grade === GRADE_AGAIN) {
   145	    newDifficulty = safeDifficulty + 1.0;
   146	  } else if (grade === GRADE_HARD) {
   147	    newDifficulty = safeDifficulty + 0.5;
   148	  } else if (grade === GRADE_GOOD) {
   149	    newDifficulty = safeDifficulty;
   150	  } else {
   151	    // EASY
   152	    newDifficulty = safeDifficulty - 0.5;
   153	  }
   154	
   155	  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
   156	}
   157	
   158	/**
   159	 * Calculate elapsed days since last review.
   160	 */
   161	function calculateElapsedDays(lastReview: string | null): number {
   162	  if (!lastReview) {
   163	    return 0;
   164	  }
   165	
   166	  const lastDate = new Date(lastReview);
   167	  if (isNaN(lastDate.getTime())) return 0;
   168	  const now = new Date();
   169	  const diffMs = now.getTime() - lastDate.getTime();
   170	
   171	  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
   172	}
   173	
   174	/**
   175	 * Get next review date based on stability and desired retention.
   176	 */
   177	function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
   178	  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
   179	  const nextDate = new Date();
   180	  nextDate.setDate(nextDate.getDate() + intervalDays);
   181	
   182	  return nextDate.toISOString();
   183	}
   184	
   185	/**
   186	 * Create initial FSRS parameters for a new memory.
   187	 */
   188	function createInitialParams(): FsrsParams {
   189	  return {
   190	    stability: DEFAULT_INITIAL_STABILITY,
   191	    difficulty: DEFAULT_INITIAL_DIFFICULTY,
   192	    lastReview: null,
   193	    reviewCount: 0,
   194	  };
   195	}
   196	
   197	/**
   198	 * Process a review and return updated parameters.
   199	 */
   200	function processReview(params: FsrsParams, grade: number): ReviewResult {
   201	  const elapsedDays = calculateElapsedDays(params.lastReview);
   202	  const retrievability = calculateRetrievability(params.stability, elapsedDays);
   203	
   204	  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
   205	  const newDifficulty = updateDifficulty(params.difficulty, grade);
   206	  const now = new Date().toISOString();
   207	  const nextReviewDate = getNextReviewDate(newStability);
   208	
   209	  return {
   210	    stability: newStability,
   211	    difficulty: newDifficulty,
   212	    lastReview: now,
   213	    reviewCount: params.reviewCount + 1,
   214	    nextReviewDate,
   215	    retrievability,
   216	  };
   217	}
   218	
   219	/* --- 4. EXPORTS --- */
   220	
   221	/** Bundled constants object for test/external consumption */
   222	const FSRS_CONSTANTS = {
   223	  FSRS_FACTOR,
   224	  FSRS_DECAY,
   225	  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
   226	  GRADE_AGAIN,
   227	  GRADE_HARD,
   228	  GRADE_GOOD,
   229	  GRADE_EASY,
   230	  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
   231	  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
   232	  MIN_DIFFICULTY,
   233	  MAX_DIFFICULTY,
   234	  MIN_STABILITY,
   235	} as const;
   236	
   237	/**
   238	 * C138: Tier-based decay multipliers for long-term memory stability.
   239	 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
   240	 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
   241	 *
   242	 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
   243	 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
   244	 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
   245	 * parameter directly. Do NOT apply both to the same memory — use one or the other:
   246	 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
   247	 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
   248	 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
   249	 */
   250	const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
   251	  constitutional: 0.1,
   252	  critical: 0.3,
   253	  important: 0.5,
   254	  normal: 1.0,
   255	  temporary: 2.0,
   256	  scratch: 3.0,
   257	} as const;
   258	
   259	/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   260	   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   261	   Multiplies FSRS stability so that:
   262	     - Infinity stability → R(t) = 1.0 always (no decay)
   263	     - >1.0 stability multiplier → slower decay
   264	     - <1.0 stability multiplier → faster decay */
   265	
   266	/**
   267	 * TM-03: Context-type stability multipliers.
   268	 * Applied to the FSRS stability parameter before computing retrievability.
   269	 * Infinity = no decay (retrievability always 1.0).
   270	 * 2.0 = stability doubled → slower decay.
   271	 * 1.0 = standard FSRS schedule.
   272	 */
   273	const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
   274	  planning: Infinity,    // no decay — planning/decisions are permanent
   275	  research: 2.0,         // 2x stability — research context decays slower
   276	  implementation: 1.0,   // standard decay
   277	  general: 1.0,          // standard decay
   278	  // P1-3: Legacy aliases inherit their canonical type's multiplier
   279	  ...Object.fromEntries(
   280	    Object.entries(LEGACY_CONTEXT_TYPE_ALIASES).map(
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Archival Manager
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Automatic archival subsystem
     5	// Background archival job for dormant/archived memories
     6	import type Database from 'better-sqlite3';
     7	import { clearDegreeCache } from '../search/graph-search-fn.js';
     8	import { clearGraphSignalsCache } from '../graph/graph-signals.js';
     9	
    10	/* ───────────────────────────────────────────────────────────────
    11	   1. DEPENDENCIES (lazy-loaded)
    12	----------------------------------------------------------------*/
    13	
    14	// Lazy-load tier-classifier to avoid circular dependencies
    15	let tierClassifierModule: Record<string, unknown> | null = null;
    16	let tierClassifierModulePromise: Promise<Record<string, unknown> | null> | null = null;
    17	
    18	async function loadTierClassifierModule(): Promise<Record<string, unknown> | null> {
    19	  if (tierClassifierModule !== null) {
    20	    return tierClassifierModule;
    21	  }
    22	  if (tierClassifierModulePromise !== null) {
    23	    return tierClassifierModulePromise;
    24	  }
    25	
    26	  const loadPromise = (async (): Promise<Record<string, unknown> | null> => {
    27	    try {
    28	      tierClassifierModule = await import('./tier-classifier.js');
    29	      return tierClassifierModule;
    30	    } catch (error: unknown) {
    31	      const message = error instanceof Error ? error.message : String(error);
    32	      console.warn(`[archival-manager] tier-classifier module unavailable: ${message}`);
    33	      return null;
    34	    }
    35	  })();
    36	
    37	  tierClassifierModulePromise = loadPromise;
    38	  try {
    39	    return await loadPromise;
    40	  } finally {
    41	    if (tierClassifierModulePromise === loadPromise) {
    42	      tierClassifierModulePromise = null;
    43	    }
    44	  }
    45	}
    46	
    47	function getTierClassifier(): Record<string, unknown> | null {
    48	  if (tierClassifierModule !== null) return tierClassifierModule;
    49	  if (tierClassifierModulePromise === null) {
    50	    void loadTierClassifierModule();
    51	  }
    52	  return null;
    53	}
    54	
    55	interface Bm25IndexModule {
    56	  isBm25Enabled: () => boolean;
    57	  buildBm25DocumentText: (row: Record<string, unknown>) => string;
    58	  getIndex: () => {
    59	    removeDocument: (id: string) => boolean;
    60	    addDocument: (id: string, text: string) => void;
    61	  };
    62	}
    63	
    64	let bm25IndexModule: Bm25IndexModule | null = null;
    65	let bm25IndexModulePromise: Promise<Bm25IndexModule | null> | null = null;
    66	
    67	async function loadBm25IndexModule(): Promise<Bm25IndexModule | null> {
    68	  if (bm25IndexModule !== null) {
    69	    return bm25IndexModule;
    70	  }
    71	  if (bm25IndexModulePromise !== null) {
    72	    return bm25IndexModulePromise;
    73	  }
    74	
    75	  const primaryModulePath = '../search/bm25-index.js';
    76	  const fallbackModulePath = '../../search/bm25-index.js';
    77	
    78	  const loadPromise = (async (): Promise<Bm25IndexModule | null> => {
    79	    try {
    80	      bm25IndexModule = await import(primaryModulePath) as Bm25IndexModule;
    81	      return bm25IndexModule;
    82	    } catch (error: unknown) {
    83	      const primaryError = error instanceof Error ? error.message : String(error);
    84	      try {
    85	        // Support cognitive symlink import path in some runtime setups.
    86	        bm25IndexModule = await import(fallbackModulePath) as Bm25IndexModule;
    87	        return bm25IndexModule;
    88	      } catch (fallbackError: unknown) {
    89	        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
    90	        console.warn(
    91	          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
    92	        );
    93	        return null;
    94	      }
    95	    }
    96	  })();
    97	
    98	  bm25IndexModulePromise = loadPromise;
    99	  try {
   100	    return await loadPromise;
   101	  } finally {
   102	    if (bm25IndexModulePromise === loadPromise) {
   103	      bm25IndexModulePromise = null;
   104	    }
   105	  }
   106	}
   107	
   108	function getBm25Index(): Bm25IndexModule | null {
   109	  if (bm25IndexModule !== null) return bm25IndexModule;
   110	  if (bm25IndexModulePromise === null) {
   111	    void loadBm25IndexModule();
   112	  }
   113	  return null;
   114	}
   115	
   116	interface EmbeddingModule {
   117	  generateDocumentEmbedding: (content: string) => Promise<Float32Array | null>;
   118	}
   119	
   120	let embeddingsModule: EmbeddingModule | null = null;
   121	let embeddingsModulePromise: Promise<EmbeddingModule | null> | null = null;
   122	
   123	async function loadEmbeddingsModule(): Promise<EmbeddingModule | null> {
   124	  if (embeddingsModule !== null) {
   125	    return embeddingsModule;
   126	  }
   127	  if (embeddingsModulePromise !== null) {
   128	    return embeddingsModulePromise;
   129	  }
   130	
   131	  const primaryModulePath = '../providers/embeddings.js';
   132	  const fallbackModulePath = '../../providers/embeddings.js';
   133	
   134	  const loadPromise = (async (): Promise<EmbeddingModule | null> => {
   135	    try {
   136	      embeddingsModule = await import(primaryModulePath) as EmbeddingModule;
   137	      return embeddingsModule;
   138	    } catch (error: unknown) {
   139	      const primaryError = error instanceof Error ? error.message : String(error);
   140	      try {
   141	        // Support cognitive symlink import path in some runtime setups.
   142	        embeddingsModule = await import(fallbackModulePath) as EmbeddingModule;
   143	        return embeddingsModule;
   144	      } catch (fallbackError: unknown) {
   145	        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
   146	        console.warn(
   147	          `[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
   148	        );
   149	        return null;
   150	      }
   151	    }
   152	  })();
   153	
   154	  embeddingsModulePromise = loadPromise;
   155	  try {
   156	    return await loadPromise;
   157	  } finally {
   158	    if (embeddingsModulePromise === loadPromise) {
   159	      embeddingsModulePromise = null;
   160	    }
   161	  }
   162	}
   163	
   164	function _getEmbeddings(): EmbeddingModule | null {
   165	  if (embeddingsModule !== null) return embeddingsModule;
   166	  if (embeddingsModulePromise === null) {
   167	    void loadEmbeddingsModule();
   168	  }
   169	  return null;
   170	}
   171	
   172	function __setEmbeddingsModuleForTests(module: EmbeddingModule | null): void {
   173	  embeddingsModule = module;
   174	  embeddingsModulePromise = null;
   175	}
   176	
   177	/* ───────────────────────────────────────────────────────────────
   178	   2. CONFIGURATION
   179	----------------------------------------------------------------*/
   180	
   181	interface ArchivalConfigType {
   182	  enabled: boolean;
   183	  scanIntervalMs: number;
   184	  batchSize: number;
   185	  maxAgeDays: number;
   186	  maxAccessCount: number;
   187	  maxConfidence: number;
   188	  protectedTiers: string[];
   189	  backgroundJobIntervalMs: number;
   190	}
   191	
   192	const ARCHIVAL_CONFIG: ArchivalConfigType = {
   193	  enabled: process.env.SPECKIT_ARCHIVAL !== 'false',
   194	  scanIntervalMs: 3600000, // 1 hour
   195	  batchSize: 50,
   196	  maxAgeDays: 90,
   197	  maxAccessCount: 2,
   198	  maxConfidence: 0.4,
   199	  protectedTiers: ['constitutional', 'critical'],
   200	  backgroundJobIntervalMs: 7200000, // 2 hours
   201	};
   202	
   203	/* ───────────────────────────────────────────────────────────────
   204	   3. INTERFACES
   205	----------------------------------------------------------------*/
   206	
   207	interface ArchivalCandidate {
   208	  id: number;
   209	  title: string | null;
   210	  spec_folder: string;
   211	  file_path: string;
   212	  created_at: string;
   213	  importance_tier: string;
   214	  access_count: number;
   215	  confidence: number;
   216	  reason: string;
   217	}
   218	
   219	interface ArchivalStats {
   220	  totalScanned: number;
   221	  totalArchived: number;
   222	  totalUnarchived: number;
   223	  lastScanTime: string | null;
   224	  errors: string[];
   225	}
   226	
   227	/* ───────────────────────────────────────────────────────────────
   228	   4. MODULE STATE
   229	----------------------------------------------------------------*/
   230	
   231	let db: Database.Database | null = null;
   232	let backgroundJob: ReturnType<typeof setInterval> | null = null;
   233	
   234	const archivalStats: ArchivalStats = {
   235	  totalScanned: 0,
   236	  totalArchived: 0,
   237	  totalUnarchived: 0,
   238	  lastScanTime: null,
   239	  errors: [],
   240	};
   241	
   242	/* ───────────────────────────────────────────────────────────────
   243	   5. INITIALIZATION
   244	----------------------------------------------------------------*/
   245	
   246	function init(database: Database.Database): void {
   247	  db = database;
   248	  ensureArchivedColumn();
   249	  ensureArchivalStatsTable();
   250	  loadArchivalStats();
   251	}
   252	
   253	function ensureArchivedColumn(): void {
   254	  if (!db) return;
   255	
   256	  try {
   257	    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
   258	    const hasArchived = columns.some(c => c.name === 'is_archived');
   259	
   260	    if (!hasArchived) {
   261	      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
   262	      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
   263	      console.error('[archival-manager] Added is_archived column');
   264	    }
   265	  } catch (error: unknown) {
   266	    const msg = error instanceof Error ? error.message : String(error);
   267	    if (!msg.includes('duplicate column')) {
   268	      console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
   269	    }
   270	  }
   271	}
   272	
   273	/**
   274	 * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
   275	 */
   276	function ensureArchivalStatsTable(): void {
   277	  if (!db) return;
   278	
   279	  try {
   280	    db.exec(`
===== .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Access Tracker
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Access-driven popularity scoring
     5	// Batched access tracking with accumulator
     6	import type Database from 'better-sqlite3';
     7	import { recordAdaptiveSignal } from '../cognitive/adaptive-ranking.js';
     8	
     9	/* ───────────────────────────────────────────────────────────────
    10	   1. CONSTANTS
    11	----------------------------------------------------------------*/
    12	
    13	const ACCUMULATOR_THRESHOLD = 0.5;
    14	const INCREMENT_VALUE = 0.1;
    15	const FLUSH_INTERVAL_MS = 30_000;
    16	const DEFAULT_RECENCY_DECAY_DAYS = 90;
    17	const MAX_USAGE_BOOST = 3.0;
    18	// P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
    19	const MAX_ACCUMULATOR_SIZE = 10000;
    20	
    21	function getRecencyDecayDays(): number {
    22	  const configuredDays = process.env.SPECKIT_RECENCY_DECAY_DAYS;
    23	  if (!configuredDays) {
    24	    return DEFAULT_RECENCY_DECAY_DAYS;
    25	  }
    26	
    27	  const parsedDays = Number.parseFloat(configuredDays);
    28	  return Number.isFinite(parsedDays) && parsedDays > 0
    29	    ? parsedDays
    30	    : DEFAULT_RECENCY_DECAY_DAYS;
    31	}
    32	
    33	function clampUsageBoost(boost: number): number {
    34	  return Math.min(boost, MAX_USAGE_BOOST);
    35	}
    36	
    37	function normalizeAccessCount(accessCount: number): number {
    38	  return Number.isFinite(accessCount) && accessCount > 0 ? accessCount : 0;
    39	}
    40	
    41	/* ───────────────────────────────────────────────────────────────
    42	   2. INTERFACES
    43	----------------------------------------------------------------*/
    44	
    45	interface AccumulatorState {
    46	  memoryId: number;
    47	  accumulated: number;
    48	}
    49	
    50	/* ───────────────────────────────────────────────────────────────
    51	   3. MODULE STATE
    52	----------------------------------------------------------------*/
    53	
    54	let db: Database.Database | null = null;
    55	const accumulators = new Map<number, number>();
    56	let exitHandlersInstalled = false;
    57	let flushInterval: ReturnType<typeof setInterval> | null = null;
    58	
    59	/* ───────────────────────────────────────────────────────────────
    60	   4. INITIALIZATION
    61	----------------------------------------------------------------*/
    62	
    63	function init(database: Database.Database): void {
    64	  if (db && db !== database) {
    65	    // A DB swap starts a new accounting context. Pending accumulator state
    66	    // must not bleed into the newly active database.
    67	    accumulators.clear();
    68	  }
    69	  db = database;
    70	  initExitHandlers();
    71	  if (!flushInterval) {
    72	    flushInterval = setInterval(() => {
    73	      reset();
    74	    }, FLUSH_INTERVAL_MS);
    75	    flushInterval.unref?.();
    76	  }
    77	}
    78	
    79	/* ───────────────────────────────────────────────────────────────
    80	   5. CORE FUNCTIONS
    81	----------------------------------------------------------------*/
    82	
    83	/**
    84	 * Track a memory access, accumulating until threshold is reached.
    85	 */
    86	function trackAccess(memoryId: number): boolean {
    87	  // P4-14 FIX: If accumulator map exceeds max size, flush all and clear
    88	  // To prevent unbounded memory growth.
    89	  if (accumulators.size > MAX_ACCUMULATOR_SIZE) {
    90	    console.warn(`[access-tracker] Accumulator map exceeded ${MAX_ACCUMULATOR_SIZE} entries, flushing all`);
    91	    if (db) {
    92	      for (const [id] of accumulators) {
    93	        flushAccessCounts(id);
    94	      }
    95	    }
    96	    accumulators.clear();
    97	  }
    98	
    99	  const current = accumulators.get(memoryId) || 0;
   100	  const newValue = current + INCREMENT_VALUE;
   101	
   102	  if (newValue >= ACCUMULATOR_THRESHOLD) {
   103	    // Flush to database
   104	    const success = flushAccessCounts(memoryId);
   105	    if (success) {
   106	      accumulators.delete(memoryId);
   107	    } else {
   108	      accumulators.set(memoryId, newValue);
   109	    }
   110	    return success;
   111	  }
   112	
   113	  accumulators.set(memoryId, newValue);
   114	  return true;
   115	}
   116	
   117	/**
   118	 * Track multiple accesses at once.
   119	 */
   120	function trackMultipleAccesses(memoryIds: number[]): { tracked: number; flushed: number } {
   121	  let tracked = 0;
   122	  let flushed = 0;
   123	
   124	  for (const id of memoryIds) {
   125	    const current = accumulators.get(id) || 0;
   126	    const newValue = current + INCREMENT_VALUE;
   127	
   128	    if (newValue >= ACCUMULATOR_THRESHOLD) {
   129	      const success = flushAccessCounts(id);
   130	      if (success) {
   131	        flushed++;
   132	        accumulators.delete(id);
   133	      } else {
   134	        accumulators.set(id, newValue);
   135	      }
   136	    } else {
   137	      accumulators.set(id, newValue);
   138	    }
   139	    tracked++;
   140	  }
   141	
   142	  return { tracked, flushed };
   143	}
   144	
   145	/**
   146	 * Flush accumulated access count to database.
   147	 */
   148	function flushAccessCounts(memoryId: number): boolean {
   149	  if (!db) {
   150	    console.warn('[access-tracker] Database not initialized. Server may still be starting up.');
   151	    return false;
   152	  }
   153	
   154	  try {
   155	    const now = Date.now();
   156	    const result = (db.prepare(`
   157	      UPDATE memory_index
   158	      SET access_count = access_count + 1,
   159	          last_accessed = ?
   160	      WHERE id = ?
   161	    `) as Database.Statement).run(now, memoryId);
   162	
   163	    if ((result as { changes: number }).changes > 0) {
   164	      try {
   165	        recordAdaptiveSignal(db, {
   166	          memoryId,
   167	          signalType: 'access',
   168	          signalValue: 1,
   169	          actor: 'access-tracker',
   170	        });
   171	      } catch (_error: unknown) {
   172	        // Adaptive signal capture must never block core access tracking
   173	      }
   174	    }
   175	
   176	    return (result as { changes: number }).changes > 0;
   177	  } catch (error: unknown) {
   178	    const msg = error instanceof Error ? error.message : String(error);
   179	    console.warn(`[access-tracker] flushAccessCounts error: ${msg}`);
   180	    return false;
   181	  }
   182	}
   183	
   184	/**
   185	 * Get accumulator state for a memory.
   186	 */
   187	function getAccumulatorState(memoryId: number): AccumulatorState {
   188	  return {
   189	    memoryId,
   190	    accumulated: accumulators.get(memoryId) || 0,
   191	  };
   192	}
   193	
   194	/**
   195	 * Calculate popularity score based on access patterns.
   196	 *
   197	 * @returns Popularity score in the range [0, 1].
   198	 */
   199	function calculatePopularityScore(
   200	  accessCount: number,
   201	  lastAccessed: number | null,
   202	  _createdAt: string | null
   203	): number {
   204	  const safeAccessCount = normalizeAccessCount(accessCount);
   205	  if (safeAccessCount === 0) return 0;
   206	
   207	  // Access frequency component
   208	  const freqScore = Math.min(1.0, Math.log2(safeAccessCount + 1) / 5);
   209	
   210	  // Recency component
   211	  let recencyScore = 0;
   212	  if (lastAccessed) {
   213	    const ageMs = Date.now() - lastAccessed;
   214	    const ageDays = ageMs / (1000 * 60 * 60 * 24);
   215	    const decayDays = getRecencyDecayDays();
   216	    recencyScore = Math.max(0, Math.min(1, 1 - (ageDays / decayDays)));
   217	  }
   218	
   219	  return (freqScore * 0.6) + (recencyScore * 0.4);
   220	}
   221	
   222	/**
   223	 * Calculate usage boost for search ranking.
   224	 *
   225	 * @returns Usage boost in the range [0, 3.0].
   226	 */
   227	function calculateUsageBoost(accessCount: number, lastAccessed: number | null): number {
   228	  const safeAccessCount = normalizeAccessCount(accessCount);
   229	  if (safeAccessCount === 0) return 0;
   230	
   231	  const boost = Math.min(0.2, safeAccessCount * 0.02);
   232	
   233	  // Extra boost for recently accessed
   234	  if (lastAccessed) {
   235	    const ageMs = Date.now() - lastAccessed;
   236	    const ageHours = ageMs / (1000 * 60 * 60);
   237	    if (ageHours < 1) return clampUsageBoost(boost * 2);
   238	    if (ageHours < 24) return clampUsageBoost(boost * 1.5);
   239	  }
   240	
   241	  return clampUsageBoost(boost);
   242	}
   243	
   244	/**
   245	 * Reset all accumulators.
   246	 */
   247	function reset(): void {
   248	  // Flush remaining accumulators before reset
   249	  if (db) {
   250	    for (const [id] of accumulators) {
   251	      flushAccessCounts(id);
   252	    }
   253	  }
   254	  accumulators.clear();
   255	}
   256	
   257	/* ───────────────────────────────────────────────────────────────
   258	   6. EXIT HANDLERS
   259	----------------------------------------------------------------*/
   260	
   261	// Store handler refs for process.removeListener()
   262	let _exitFlushHandler: (() => void) | null = null;
   263	
   264	function initExitHandlers(): void {
   265	  if (exitHandlersInstalled) return;
   266	
   267	  const flush = (): void => {
   268	    // P4-15 FIX: Defensive check — during shutdown the DB handle may
   269	    // Already be closed. Wrap the entire flush in try/catch and verify
   270	    // Db is still usable before attempting writes.
   271	    try {
   272	      if (!db || !accumulators.size) return;
   273	      // Quick liveness check: attempt a no-op query to detect closed handle
   274	      try {
   275	        db.prepare('SELECT 1').get();
   276	      } catch {
   277	        // DB is closed/unusable — skip flush silently
   278	        accumulators.clear();
   279	        return;
   280	      }
===== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts =====
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
===== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts =====
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

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"retentionPolicy|retention_policy|ARCHIVED|DORMANT|COLD|WARM|HOT|useDecay|trackAccess|recency-weighted|freshness|stability|difficulty|archival|stale flagged|Hebbian|decayed\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts' -g '*.js' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:108:import * as archivalManager from './lib/cognitive/archival-manager.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1363:  runCleanupStep('archivalManager', () => archivalManager.cleanup());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1576:      archivalManager,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1583:  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1730:      archivalManager.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1731:      // Start background archival job (scans every hour by default)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1732:      archivalManager.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1733:      if (archivalManager.isBackgroundJobRunning()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1738:    } catch (archivalErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1739:      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:81:  decayedCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156:/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:161:  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:167:    if (tier === 'HOT') return content;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:168:    // WARM tier returns truncated summary
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:345:          decayApplied: decayStats ? decayStats.decayedCount : 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:426:        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:471:      decayApplied: decayStats ? decayStats.decayedCount : 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:502:  const coldCount = cognitiveStats?.tierDistribution?.COLD;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:504:    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:65:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:66:  difficulty?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:95:  'type_inference_source', 'stability', 'difficulty', 'review_count',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:246:        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:247:        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:347:          stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:348:          difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:221:      stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:222:      difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1114:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1145:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:23:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:24:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:71:  previous_stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:149:  stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:150:  difficulty?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:265:                  stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:266:                  difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:132:  useDecay: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:145:  minState: z.enum(['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:148:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:195:  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:40:  stability: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:41:  difficulty: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:56:  previous_stability?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:111:          stability: (r.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:112:          difficulty: (r.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:142:/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:148:      SELECT id, stability, difficulty, last_review, review_count, title
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:158:    const currentStability = (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:159:    const currentDifficulty = (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:175:      SET stability = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:194:      previous_stability: currentStability,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:364:  if (result.previous_stability !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:365:    response.previous_stability = result.previous_stability;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:453:        `-${consolidation.hebbian.decayed} decayed, ${consolidation.stale.flagged} stale flagged`
.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:46:    return sum + (r.tier === 'WARM' ? estimateTokens(r.content as string) * 3 : estimateTokens(r.content as string));
.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:55:  const hotCount = returnedResults.filter(r => r.tier === 'HOT').length;
.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:56:  const warmCount = returnedResults.filter(r => r.tier === 'WARM').length;
.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:61:    .filter(r => r.tier === 'HOT')
.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:66:    .filter(r => r.tier === 'WARM')
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:56:  useDecay?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:73:  minState?: 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:164:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:62:  if (readiness.freshness === 'fresh') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:66:      freshnessAuthority: 'live',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:70:  if (readiness.freshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:74:      freshnessAuthority: 'stale',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:81:    freshnessAuthority: 'unknown',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:320:    freshness: 'empty' as const,
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:25:                  freshnessAuthority: 'live',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:740:    useDecay: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:771:    useDecay: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:805:    useDecay: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:90:    freshness: 'empty' as const,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:69:  category: 'accepted' | 'fidelity' | 'freshness';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:161:  category: 'fidelity' | 'freshness',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:286:      'freshness',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:288:      `Cached summary age exceeded the freshness window of ${maxAgeMs}ms.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:294:      'freshness',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:305:        'freshness',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:313:        'freshness',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:320:      'freshness',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:331:    detail: 'Cached summary passed fidelity and freshness gates and may be used additively.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:447:    const freshness = getGraphFreshness(process.cwd());
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:449:      status: freshness,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:437:  // Code graph freshness
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:5:// readiness, code graph freshness, and priming status.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:76:  // Determine graph freshness
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:73:    { id: 905, content: 'Memory archival operations and retention policies for old sessions. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:2:// 1. TEST — COLD START (Score Cap)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:5:// Aggregates metrics, graph freshness, and priming status into a
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:152:  // Graph freshness
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:83:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:84:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:146:      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:269:          id, spec_folder, file_path, canonical_file_path, title, content, content_hash, stability, difficulty
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:621:            id, spec_folder, file_path, title, content_text, content_hash, stability, difficulty, review_count
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:144:        queries: ['graph retrieval regression', 'rrf fusion stability'],
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:249:  it('computeIntentTraversalScore: formula = seedScore * edgePrior * hopDecay * freshness', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:251:    // fix_bug, supersedes (CORRECTION tier 0 → edgePrior=1.0), 1-hop (decay=1.0), freshness=0.8
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:259:    // add_feature, supports (tier 2 → edgePrior=0.5), 2-hop (decay=0.5), freshness=1.0
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:265:  it('computeIntentTraversalScore: freshness=0 yields 0', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:13:    const freshness = getGraphFreshness(process.cwd());
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:24:            freshness,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:44:      stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:476:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:500:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:530:      stability: 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:553:      stability: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:141:   5. METRICS SNAPSHOT
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:178:/** Compute graph freshness: 1.0 fresh, 0.5 stale, 0.0 empty/error. */
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:306:      state: 'WARM',
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:55:        stability REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:56:        difficulty REAL DEFAULT 5.0,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:155:  describe('Floor stability over repeated cycles', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:43:  it('T018: Higher stability = slower decay', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:53:  it('T019: Success grade increases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:56:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:59:    const newStability = fsrsScheduler.updateStability(initialStability, difficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:63:  it('T020: Failure grade decreases stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:66:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:69:    const newStability = fsrsScheduler.updateStability(initialStability, difficulty, grade, retrievability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:108:  it('Handles zero/negative stability gracefully', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:229:    const rHigh = fsrsScheduler.calculateRetrievability(10.0, 1);  // High stability, recent
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:230:    const rLow = fsrsScheduler.calculateRetrievability(1.0, 10);   // Low stability, old
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:234:  it('T049: Accessed memories show increased stability (testing effect)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:237:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:240:    const newStability = fsrsScheduler.updateStability(initial, difficulty, grade, r);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:244:  it('T050: Low R memories get larger boost (desirable difficulty)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:247:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:249:    const boostHighR = fsrsScheduler.updateStability(initial, difficulty, grade, 0.9) - initial;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:250:    const boostLowR = fsrsScheduler.updateStability(initial, difficulty, grade, 0.4) - initial;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:251:    // Some FSRS implementations may not have desirable difficulty built-in
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:255:    // If desirable difficulty is implemented, low R boost should be larger
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:327:  it('R with very high stability (100+) decays very slowly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:333:    // High stability should retain much more after 30 days
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:335:    // Should be at least double the normal stability retention
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:339:  it('R with very low stability (0.1) decays very fast', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:345:    // Low stability should decay much faster
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:354:  it('Grade 1 (fail) with high difficulty reduces stability significantly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:364:  it('Grade 4 (success) with low difficulty increases stability maximally', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:374:    // Compare with high difficulty
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:380:  it('Multiple consecutive successes compound stability growth', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:382:    let stability = 1.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:383:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:386:    const stabilityHistory = [stability];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:390:        ? fsrsScheduler.calculateRetrievability(stability, 1)
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:392:      stability = fsrsScheduler.updateStability(stability, difficulty, grade, r);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:393:      stabilityHistory.push(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:396:    // Each iteration should increase stability
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:397:    for (let i = 1; i < stabilityHistory.length; i++) {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:398:      expect(stabilityHistory[i]).toBeGreaterThan(stabilityHistory[i - 1]);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:401:    // Final stability should be significantly higher
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:402:    const growthFactor = stability / stabilityHistory[0];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:406:  it('Multiple consecutive failures compound stability decline', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:408:    let stability = 10.0; // Start high
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:409:    const difficulty = 5.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:412:    const stabilityHistory = [stability];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:417:        ? fsrsScheduler.calculateRetrievability(stability, 1)
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:419:      stability = fsrsScheduler.updateStability(stability, difficulty, grade, r);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:420:      stabilityHistory.push(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:423:    // Each iteration should decrease or be at stability floor
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:424:    for (let i = 1; i < stabilityHistory.length; i++) {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:425:      const atFloor = stabilityHistory[i] <= MIN_STABILITY_FLOOR + 0.001;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:426:      const decreased = stabilityHistory[i] < stabilityHistory[i - 1];
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:430:    // Final stability should be lower than initial
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:431:    expect(stability).toBeLessThan(stabilityHistory[0]);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:450:  it('Grade 1 increases difficulty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:457:  it('Grade 4 decreases difficulty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:479:  it('Grades have ordered effects on difficulty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:503:  it('Target R=0.5 intervals increase with stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:511:    // Higher stability should give longer intervals for same target R
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:519:    const stability = 1.0;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:520:    const intervalR90 = calcInterval(stability, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:521:    const intervalR50 = calcInterval(stability, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:522:    const intervalR20 = calcInterval(stability, 0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:523:    const intervalR10 = calcInterval(stability, 0.1);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:534:  it('Interval increases with stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:545:    // Intervals should be increasing with stability
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:609:  it('C138-T4: tier decay formula produces expected stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:624:  it('C138-T5: constitutional memory retains stability over 30 days', () => {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:31:    const stability = halfLifeToStability(60);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:32:    const r = calculateRetrievability(stability, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:38:    const stability = halfLifeToStability(halfLife);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:39:    const r = calculateRetrievability(stability, halfLife);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:47:    const stability = halfLifeToStability(60);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:49:    const rValues = timePoints.map(t => calculateRetrievability(stability, t));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:57:  it('T006: Very old memories (365+ days, low stability) have retrievability near 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:58:    const stability = halfLifeToStability(7); // short half-life
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:59:    const r365 = calculateRetrievability(stability, 365);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:60:    const r730 = calculateRetrievability(stability, 730);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:18:       - null/undefined: returns 'DORMANT'
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:19:     Thresholds: HOT >= 0.80, WARM >= 0.25, COLD >= 0.05, else DORMANT
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:20:     ARCHIVED: > 90 days AND r < 0.02
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:26:    it('T201: R=0.95 => HOT', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:27:      expect(tierClassifier.classifyState(0.95, 0)).toBe('HOT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:30:    it('T202: R=0.80 (boundary) => HOT', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:31:      expect(tierClassifier.classifyState(0.80, 0)).toBe('HOT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:34:    it('T203: R=0.79 => WARM', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:35:      expect(tierClassifier.classifyState(0.79, 0)).toBe('WARM');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:38:    it('T204: R=0.50 => WARM', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:39:      expect(tierClassifier.classifyState(0.50, 0)).toBe('WARM');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:42:    it('T205: R=0.25 (boundary) => WARM', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:43:      expect(tierClassifier.classifyState(0.25, 0)).toBe('WARM');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:46:    it('T206: R=0.24 => COLD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:47:      expect(tierClassifier.classifyState(0.24, 0)).toBe('COLD');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:50:    it('T207: R=0.10 => COLD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:51:      expect(tierClassifier.classifyState(0.10, 0)).toBe('COLD');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:54:    it('T208: R=0.05 (boundary) => COLD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:55:      expect(tierClassifier.classifyState(0.05, 0)).toBe('COLD');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:58:    it('T209: R=0.04 => DORMANT', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:59:      expect(tierClassifier.classifyState(0.04, 0)).toBe('DORMANT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:62:    it('T210: R=0.01 => DORMANT', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:63:      expect(tierClassifier.classifyState(0.01, 0)).toBe('DORMANT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:69:     ARCHIVED: days > 90 AND r < 0.02
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:74:      expect(tierClassifier.classifyState(0.01, 89)).not.toBe('ARCHIVED');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:77:    it('T212: 91 days + R=0.01 => ARCHIVED', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:78:      expect(tierClassifier.classifyState(0.01, 91)).toBe('ARCHIVED');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:81:    it('T213: 100 days + R=0.01 => ARCHIVED', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:82:      expect(tierClassifier.classifyState(0.01, 100)).toBe('ARCHIVED');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:85:    it('T214: 91 days + R=0.80 => HOT (R overrides)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:86:      expect(tierClassifier.classifyState(0.80, 91)).toBe('HOT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:89:    it('T215: null => DORMANT', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:90:      expect(tierClassifier.classifyState(null)).toBe('DORMANT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:96:     Production: calculateRetrievability(stability: number, elapsedDays: number): number
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:113:    it('T218: High stability (S=100, t=10) => very high R', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:118:    it('T219: Low stability (S=1, t=10) => lower R', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:135:    it('T221: Constitutional => HOT with R=1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:136:      const r = tierClassifier.classifyTier({ id: 1, importance_tier: 'constitutional', stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:137:      expect(r.state).toBe('HOT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:141:    it('T222: Pinned memory => HOT', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:142:      const r = tierClassifier.classifyTier({ id: 2, is_pinned: 1, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:143:      expect(r.state).toBe('HOT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:146:    it('T223: Critical => HOT, null halfLife', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:147:      const r = tierClassifier.classifyTier({ id: 3, importance_tier: 'critical', stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:148:      expect(r.state).toBe('HOT');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:153:      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:160:      const r = tierClassifier.classifyTier({ id: 4, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:172:      expect(tierClassifier.shouldArchive({ id: 1, importance_tier: 'constitutional', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:176:      expect(tierClassifier.shouldArchive({ id: 2, importance_tier: 'critical', stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:180:      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:183:    it('T229: Old low-stability normal => should archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:184:      expect(tierClassifier.shouldArchive({ id: 4, importance_tier: 'normal', stability: 0.01, half_life_days: 0.001, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:187:    it('T230: Recent high-stability => should NOT archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:188:      expect(tierClassifier.shouldArchive({ id: 5, importance_tier: 'normal', stability: 100, created_at: new Date().toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:194:     Production: getStateStats(memories) returns { HOT, WARM, COLD, DORMANT, ARCHIVED, total }

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg 'attention-decay|tier-classifier|access-tracker|consolidation|composite-scoring'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '180,420p' && printf '\\n===== NEXT =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '420,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   180	
   181	interface ArchivalConfigType {
   182	  enabled: boolean;
   183	  scanIntervalMs: number;
   184	  batchSize: number;
   185	  maxAgeDays: number;
   186	  maxAccessCount: number;
   187	  maxConfidence: number;
   188	  protectedTiers: string[];
   189	  backgroundJobIntervalMs: number;
   190	}
   191	
   192	const ARCHIVAL_CONFIG: ArchivalConfigType = {
   193	  enabled: process.env.SPECKIT_ARCHIVAL !== 'false',
   194	  scanIntervalMs: 3600000, // 1 hour
   195	  batchSize: 50,
   196	  maxAgeDays: 90,
   197	  maxAccessCount: 2,
   198	  maxConfidence: 0.4,
   199	  protectedTiers: ['constitutional', 'critical'],
   200	  backgroundJobIntervalMs: 7200000, // 2 hours
   201	};
   202	
   203	/* ───────────────────────────────────────────────────────────────
   204	   3. INTERFACES
   205	----------------------------------------------------------------*/
   206	
   207	interface ArchivalCandidate {
   208	  id: number;
   209	  title: string | null;
   210	  spec_folder: string;
   211	  file_path: string;
   212	  created_at: string;
   213	  importance_tier: string;
   214	  access_count: number;
   215	  confidence: number;
   216	  reason: string;
   217	}
   218	
   219	interface ArchivalStats {
   220	  totalScanned: number;
   221	  totalArchived: number;
   222	  totalUnarchived: number;
   223	  lastScanTime: string | null;
   224	  errors: string[];
   225	}
   226	
   227	/* ───────────────────────────────────────────────────────────────
   228	   4. MODULE STATE
   229	----------------------------------------------------------------*/
   230	
   231	let db: Database.Database | null = null;
   232	let backgroundJob: ReturnType<typeof setInterval> | null = null;
   233	
   234	const archivalStats: ArchivalStats = {
   235	  totalScanned: 0,
   236	  totalArchived: 0,
   237	  totalUnarchived: 0,
   238	  lastScanTime: null,
   239	  errors: [],
   240	};
   241	
   242	/* ───────────────────────────────────────────────────────────────
   243	   5. INITIALIZATION
   244	----------------------------------------------------------------*/
   245	
   246	function init(database: Database.Database): void {
   247	  db = database;
   248	  ensureArchivedColumn();
   249	  ensureArchivalStatsTable();
   250	  loadArchivalStats();
   251	}
   252	
   253	function ensureArchivedColumn(): void {
   254	  if (!db) return;
   255	
   256	  try {
   257	    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
   258	    const hasArchived = columns.some(c => c.name === 'is_archived');
   259	
   260	    if (!hasArchived) {
   261	      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
   262	      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
   263	      console.error('[archival-manager] Added is_archived column');
   264	    }
   265	  } catch (error: unknown) {
   266	    const msg = error instanceof Error ? error.message : String(error);
   267	    if (!msg.includes('duplicate column')) {
   268	      console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
   269	    }
   270	  }
   271	}
   272	
   273	/**
   274	 * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
   275	 */
   276	function ensureArchivalStatsTable(): void {
   277	  if (!db) return;
   278	
   279	  try {
   280	    db.exec(`
   281	      CREATE TABLE IF NOT EXISTS archival_stats (
   282	        key TEXT PRIMARY KEY,
   283	        value TEXT NOT NULL,
   284	        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   285	      )
   286	    `);
   287	  } catch (error: unknown) {
   288	    const msg = error instanceof Error ? error.message : String(error);
   289	    console.warn(`[archival-manager] ensureArchivalStatsTable error: ${msg}`);
   290	  }
   291	}
   292	
   293	/**
   294	 * Load archival stats from the database on startup (P5-06).
   295	 */
   296	function loadArchivalStats(): void {
   297	  if (!db) return;
   298	
   299	  try {
   300	    const rows = (db.prepare(
   301	      'SELECT key, value FROM archival_stats'
   302	    ) as Database.Statement).all() as Array<{ key: string; value: string }>;
   303	
   304	    for (const row of rows) {
   305	      switch (row.key) {
   306	        case 'totalScanned':
   307	          archivalStats.totalScanned = parseInt(row.value, 10) || 0;
   308	          break;
   309	        case 'totalArchived':
   310	          archivalStats.totalArchived = parseInt(row.value, 10) || 0;
   311	          break;
   312	        case 'totalUnarchived':
   313	          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
   314	          break;
   315	        case 'lastScanTime':
   316	          archivalStats.lastScanTime = row.value === '' ? null : row.value || null;
   317	          break;
   318	      }
   319	    }
   320	  } catch (error: unknown) {
   321	    const msg = error instanceof Error ? error.message : String(error);
   322	    console.warn(`[archival-manager] loadArchivalStats error: ${msg}`);
   323	  }
   324	}
   325	
   326	/**
   327	 * Persist archival stats to the database (P5-06).
   328	 */
   329	function saveArchivalStats(): void {
   330	  if (!db) return;
   331	
   332	  try {
   333	    const upsert = db.prepare(`
   334	      INSERT INTO archival_stats (key, value, updated_at)
   335	      VALUES (?, ?, datetime('now'))
   336	      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
   337	    `) as Database.Statement;
   338	
   339	    const saveAll = db.transaction(() => {
   340	      upsert.run('totalScanned', String(archivalStats.totalScanned));
   341	      upsert.run('totalArchived', String(archivalStats.totalArchived));
   342	      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
   343	      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
   344	    });
   345	
   346	    saveAll();
   347	  } catch (error: unknown) {
   348	    const msg = error instanceof Error ? error.message : String(error);
   349	    console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
   350	  }
   351	}
   352	
   353	/* ───────────────────────────────────────────────────────────────
   354	   6. ARCHIVAL FUNCTIONS
   355	----------------------------------------------------------------*/
   356	
   357	/**
   358	 * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
   359	 * as the authoritative decision.
   360	 *
   361	 * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
   362	 * The FSRS-based tier classifier then determines which should actually be archived.
   363	 * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
   364	 */
   365	function getArchivalCandidates(limit: number = ARCHIVAL_CONFIG.batchSize): ArchivalCandidate[] {
   366	  if (!db) return [];
   367	
   368	  try {
   369	    const protectedList = ARCHIVAL_CONFIG.protectedTiers.map(() => '?').join(',');
   370	
   371	    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
   372	    const rows = (db.prepare(`
   373	      SELECT *
   374	      FROM memory_index
   375	      WHERE (is_archived IS NULL OR is_archived = 0)
   376	        AND importance_tier NOT IN (${protectedList})
   377	        AND is_pinned = 0
   378	      ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
   379	      LIMIT ?
   380	    `) as Database.Statement).all(
   381	      ...ARCHIVAL_CONFIG.protectedTiers,
   382	      limit * 3  // Fetch extra since FSRS will filter further
   383	    ) as Array<Record<string, unknown>>;
   384	
   385	    // Use FSRS-based tier classifier as authoritative archival decision
   386	    const classifier = getTierClassifier();
   387	    const cutoffDate = new Date();
   388	    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVAL_CONFIG.maxAgeDays);
   389	
   390	    const candidates: ArchivalCandidate[] = [];
   391	
   392	    for (const row of rows) {
   393	      let shouldArchiveRow = false;
   394	
   395	      if (classifier && typeof classifier.shouldArchive === 'function') {
   396	        // Primary: FSRS-based decision
   397	        shouldArchiveRow = classifier.shouldArchive(row) as boolean;
   398	      } else {
   399	        // Fallback: SQL-based criteria only when FSRS is unavailable
   400	        shouldArchiveRow = (
   401	          row.created_at != null &&
   402	          new Date(row.created_at as string) < cutoffDate &&
   403	          ((row.access_count as number) || 0) <= ARCHIVAL_CONFIG.maxAccessCount &&
   404	          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
   405	        );
   406	      }
   407	
   408	      if (shouldArchiveRow) {
   409	        candidates.push({
   410	          id: row.id as number,
   411	          title: row.title as string | null,
   412	          spec_folder: row.spec_folder as string,
   413	          file_path: row.file_path as string,
   414	          created_at: row.created_at as string,
   415	          importance_tier: row.importance_tier as string,
   416	          access_count: (row.access_count as number) || 0,
   417	          confidence: (row.confidence as number) || 0.5,
   418	          reason: determineArchivalReason(row, cutoffDate),
   419	        });
   420	

===== NEXT =====
   420	
   421	        if (candidates.length >= limit) break;
   422	      }
   423	    }
   424	
   425	    return candidates;
   426	  } catch (error: unknown) {
   427	    const msg = error instanceof Error ? error.message : String(error);
   428	    console.warn(`[archival-manager] getArchivalCandidates error: ${msg}`);
   429	    return [];
   430	  }
   431	}
   432	
   433	function determineArchivalReason(row: Record<string, unknown>, cutoffDate: Date): string {
   434	  const reasons: string[] = [];
   435	  if (row.created_at && new Date(row.created_at as string) < cutoffDate) {
   436	    reasons.push('aged');
   437	  }
   438	  if ((row.access_count as number) <= ARCHIVAL_CONFIG.maxAccessCount) {
   439	    reasons.push('low-access');
   440	  }
   441	  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
   442	    reasons.push('low-confidence');
   443	  }
   444	  return reasons.join(', ') || 'candidate';
   445	}
   446	
   447	function checkMemoryArchivalStatus(memoryId: number): {
   448	  isArchived: boolean;
   449	  shouldArchive: boolean;
   450	} {
   451	  if (!db) return { isArchived: false, shouldArchive: false };
   452	
   453	  try {
   454	    const memory = (db.prepare(
   455	      'SELECT * FROM memory_index WHERE id = ?'
   456	    ) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
   457	
   458	    if (!memory) return { isArchived: false, shouldArchive: false };
   459	
   460	    const isArchived = (memory.is_archived as number) === 1;
   461	
   462	    // Check with tier classifier if available
   463	    const classifier = getTierClassifier();
   464	    let shouldArchive = false;
   465	    if (classifier && typeof classifier.shouldArchive === 'function') {
   466	      shouldArchive = classifier.shouldArchive(memory) as boolean;
   467	    }
   468	
   469	    return { isArchived, shouldArchive };
   470	  } catch (error: unknown) {
   471	    const msg = error instanceof Error ? error.message : String(error);
   472	    console.warn(`[archival-manager] checkMemoryArchivalStatus error: ${msg}`);
   473	    return { isArchived: false, shouldArchive: false };
   474	  }
   475	}
   476	
   477	function getMemoryIndexColumns(): Set<string> {
   478	  if (!db) return new Set();
   479	
   480	  try {
   481	    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
   482	    return new Set(columns.map(column => column.name));
   483	  } catch (error: unknown) {
   484	    const message = error instanceof Error ? error.message : String(error);
   485	    console.warn(`[archival-manager] getMemoryIndexColumns failed: ${message}`);
   486	    return new Set();
   487	  }
   488	}
   489	
   490	function syncBm25OnArchive(memoryId: number): void {
   491	  const bm25 = getBm25Index();
   492	  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
   493	
   494	  try {
   495	    bm25.getIndex().removeDocument(String(memoryId));
   496	  } catch (error: unknown) {
   497	    const msg = error instanceof Error ? error.message : String(error);
   498	    console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
   499	  }
   500	}
   501	
   502	// Vector-only deletion — removes the vec_memories embedding row without
   503	// Touching memory_index or ancillary tables. This preserves the archived row
   504	// (is_archived=1) so unarchive can still find and restore it.
   505	function syncVectorOnArchive(memoryId: number): void {
   506	  if (!db) return;
   507	
   508	  try {
   509	    db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(memoryId));
   510	  } catch (error: unknown) {
   511	    // Expected to fail when sqlite-vec is not loaded or vec_memories doesn't exist
   512	    const msg = error instanceof Error ? error.message : String(error);
   513	    if (!msg.includes('no such table')) {
   514	      console.warn(`[archival-manager] Vector archive sync failed: ${msg}`);
   515	    }
   516	  }
   517	}
   518	
   519	function syncBm25OnUnarchive(memoryId: number): void {
   520	  const bm25 = getBm25Index();
   521	  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
   522	
   523	  try {
   524	    const columns = getMemoryIndexColumns();
   525	    const availableColumns = ['title', 'content_text', 'trigger_phrases', 'file_path']
   526	      .filter(column => columns.has(column));
   527	
   528	    if (availableColumns.length === 0) return;
   529	
   530	    const query = `SELECT ${availableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
   531	    const row = (db.prepare(query) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
   532	    if (!row) return;
   533	
   534	    const text = bm25.buildBm25DocumentText(row);
   535	    if (!text) return;
   536	    bm25.getIndex().addDocument(String(memoryId), text);
   537	  } catch (error: unknown) {
   538	    const msg = error instanceof Error ? error.message : String(error);
   539	    console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
   540	  }
   541	}
   542	
   543	/**
   544	 * Defer vector re-embedding to the next index scan rather than rebuilding immediately.
   545	 *
   546	 * The playbook contract (scenario 124) requires that unarchive does NOT recreate the
   547	 * vec_memories row inline — instead it logs a deferred-rebuild notice so the next
   548	 * `memory_index_scan` picks up the gap and re-embeds the memory. This avoids blocking
   549	 * the unarchive call on an async embedding generation round-trip and keeps the
   550	 * archive/unarchive path lightweight.
   551	 */
   552	function syncVectorOnUnarchive(memoryId: number): void {
   553	  console.error(
   554	    `[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`
   555	  );
   556	}
   557	
   558	function archiveMemory(memoryId: number): boolean {
   559	  if (!db) return false;
   560	
   561	  try {
   562	    const result = (db.prepare(`
   563	      UPDATE memory_index
   564	      SET is_archived = 1,
   565	          updated_at = datetime('now')
   566	      WHERE id = ?
   567	        AND (is_archived IS NULL OR is_archived = 0)
   568	    `) as Database.Statement).run(memoryId);
   569	
   570	    const success = (result as { changes: number }).changes > 0;
   571	    if (success) {
   572	      archivalStats.totalArchived++;
   573	      syncBm25OnArchive(memoryId);
   574	      syncVectorOnArchive(memoryId);
   575	      clearDegreeCache();
   576	      clearGraphSignalsCache();
   577	      saveArchivalStats();
   578	    }
   579	    return success;
   580	  } catch (error: unknown) {
   581	    const msg = error instanceof Error ? error.message : String(error);
   582	    const MAX_ERROR_LOG = 100;
   583	    archivalStats.errors.push(msg);
   584	    if (archivalStats.errors.length > MAX_ERROR_LOG) {
   585	      archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
   586	    }
   587	    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
   588	    return false;
   589	  }
   590	}
   591	
   592	function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
   593	  if (!db) return { archived: 0, failed: memoryIds.length };
   594	
   595	  let archived = 0;
   596	  let failed = 0;
   597	
   598	  const batchTransaction = db.transaction(() => {
   599	    for (const id of memoryIds) {
   600	      try {
   601	        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
   602	        const result = (db!.prepare(`
   603	          UPDATE memory_index
   604	          SET is_archived = 1,
   605	              updated_at = datetime('now')
   606	          WHERE id = ?
   607	            AND (is_archived IS NULL OR is_archived = 0)
   608	        `) as Database.Statement).run(id);
   609	
   610	        const success = (result as { changes: number }).changes > 0;
   611	        if (success) {
   612	          archivalStats.totalArchived++;
   613	          syncBm25OnArchive(id);
   614	          syncVectorOnArchive(id);
   615	          archived++;
   616	        } else {
   617	          failed++;
   618	        }
   619	      } catch (error: unknown) {
   620	        const msg = error instanceof Error ? error.message : String(error);
   621	        const MAX_ERROR_LOG = 100;
   622	        archivalStats.errors.push(msg);
   623	        if (archivalStats.errors.length > MAX_ERROR_LOG) {
   624	          archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
   625	        }
   626	        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
   627	        failed++;
   628	      }
   629	    }
   630	  });
   631	
   632	  batchTransaction();
   633	  saveArchivalStats();
   634	
   635	  return { archived, failed };
   636	}
   637	
   638	function unarchiveMemory(memoryId: number): boolean {
   639	  if (!db) return false;
   640	
   641	  try {
   642	    const result = (db.prepare(`
   643	      UPDATE memory_index
   644	      SET is_archived = 0,
   645	          updated_at = datetime('now')
   646	      WHERE id = ? AND is_archived = 1
   647	    `) as Database.Statement).run(memoryId);
   648	
   649	    const success = (result as { changes: number }).changes > 0;
   650	    if (success) {
   651	      archivalStats.totalUnarchived++;
   652	      syncBm25OnUnarchive(memoryId);
   653	      syncVectorOnUnarchive(memoryId);
   654	      clearDegreeCache();
   655	      clearGraphSignalsCache();
   656	      saveArchivalStats();
   657	    }
   658	    return success;
   659	  } catch (error: unknown) {
   660	    const msg = error instanceof Error ? error.message : String(error);
   661	    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
   662	    return false;
   663	  }
   664	}
   665	
   666	/* ───────────────────────────────────────────────────────────────
   667	   7. SCANNING & BACKGROUND JOBS
   668	----------------------------------------------------------------*/
   669	
   670	function runArchivalScan(): { scanned: number; archived: number } {
   671	  const candidates = getArchivalCandidates();
   672	  archivalStats.totalScanned += candidates.length;
   673	  archivalStats.lastScanTime = new Date().toISOString();
   674	
   675	  const result = archiveBatch(candidates.map(c => c.id));
   676	
   677	  // Persist updated stats (P5-06)
   678	  saveArchivalStats();
   679	
   680	  console.error(
   681	    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
   682	  );
   683	
   684	  return { scanned: candidates.length, archived: result.archived };
   685	}
   686	
   687	function startBackgroundJob(intervalMs: number = ARCHIVAL_CONFIG.backgroundJobIntervalMs): void {
   688	  if (!ARCHIVAL_CONFIG.enabled) {
   689	    return;
   690	  }
   691	
   692	  if (backgroundJob) {
   693	    clearInterval(backgroundJob);
   694	  }
   695	
   696	  backgroundJob = setInterval(() => {
   697	    try {
   698	      runArchivalScan();
   699	    } catch (error: unknown) {
   700	      const msg = error instanceof Error ? error.message : String(error);
   701	      console.warn(`[archival-manager] Background job error: ${msg}`);
   702	    }
   703	  }, intervalMs);
   704	
   705	  if (backgroundJob.unref) {
   706	    backgroundJob.unref();
   707	  }
   708	
   709	  console.error(`[archival-manager] Background job started (interval: ${intervalMs / 1000}s)`);
   710	}
   711	
   712	function stopBackgroundJob(): void {
   713	  if (backgroundJob) {
   714	    clearInterval(backgroundJob);
   715	    backgroundJob = null;
   716	    console.error('[archival-manager] Background job stopped');
   717	  }
   718	}
   719	
   720	function isBackgroundJobRunning(): boolean {
   721	  return backgroundJob !== null;
   722	}
   723	
   724	/* ───────────────────────────────────────────────────────────────
   725	   8. STATS & CLEANUP
   726	----------------------------------------------------------------*/
   727	
   728	function getStats(): ArchivalStats {
   729	  return { ...archivalStats };
   730	}
   731	
   732	function getRecentErrors(limit: number = 10): string[] {
   733	  return archivalStats.errors.slice(-limit);
   734	}
   735	
   736	function resetStats(): void {
   737	  archivalStats.totalScanned = 0;
   738	  archivalStats.totalArchived = 0;
   739	  archivalStats.totalUnarchived = 0;
   740	  archivalStats.lastScanTime = null;
   741	  archivalStats.errors = [];
   742	  saveArchivalStats();
   743	}
   744	
   745	function cleanup(): void {
   746	  stopBackgroundJob();
   747	  db = null;
   748	}
   749	
   750	/* ───────────────────────────────────────────────────────────────
   751	   9. EXPORTS
   752	----------------------------------------------------------------*/
   753	
   754	export {
   755	  ARCHIVAL_CONFIG,
   756	
   757	  // Initialization
   758	  init,
   759	  ensureArchivedColumn,
   760	

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.js' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,320p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.js =====
nl: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.js: No such file or directory
===== .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Access Tracker
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Access-driven popularity scoring
     5	// Batched access tracking with accumulator
     6	import type Database from 'better-sqlite3';
     7	import { recordAdaptiveSignal } from '../cognitive/adaptive-ranking.js';
     8	
     9	/* ───────────────────────────────────────────────────────────────
    10	   1. CONSTANTS
    11	----------------------------------------------------------------*/
    12	
    13	const ACCUMULATOR_THRESHOLD = 0.5;
    14	const INCREMENT_VALUE = 0.1;
    15	const FLUSH_INTERVAL_MS = 30_000;
    16	const DEFAULT_RECENCY_DECAY_DAYS = 90;
    17	const MAX_USAGE_BOOST = 3.0;
    18	// P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
    19	const MAX_ACCUMULATOR_SIZE = 10000;
    20	
    21	function getRecencyDecayDays(): number {
    22	  const configuredDays = process.env.SPECKIT_RECENCY_DECAY_DAYS;
    23	  if (!configuredDays) {
    24	    return DEFAULT_RECENCY_DECAY_DAYS;
    25	  }
    26	
    27	  const parsedDays = Number.parseFloat(configuredDays);
    28	  return Number.isFinite(parsedDays) && parsedDays > 0
    29	    ? parsedDays
    30	    : DEFAULT_RECENCY_DECAY_DAYS;
    31	}
    32	
    33	function clampUsageBoost(boost: number): number {
    34	  return Math.min(boost, MAX_USAGE_BOOST);
    35	}
    36	
    37	function normalizeAccessCount(accessCount: number): number {
    38	  return Number.isFinite(accessCount) && accessCount > 0 ? accessCount : 0;
    39	}
    40	
    41	/* ───────────────────────────────────────────────────────────────
    42	   2. INTERFACES
    43	----------------------------------------------------------------*/
    44	
    45	interface AccumulatorState {
    46	  memoryId: number;
    47	  accumulated: number;
    48	}
    49	
    50	/* ───────────────────────────────────────────────────────────────
    51	   3. MODULE STATE
    52	----------------------------------------------------------------*/
    53	
    54	let db: Database.Database | null = null;
    55	const accumulators = new Map<number, number>();
    56	let exitHandlersInstalled = false;
    57	let flushInterval: ReturnType<typeof setInterval> | null = null;
    58	
    59	/* ───────────────────────────────────────────────────────────────
    60	   4. INITIALIZATION
    61	----------------------------------------------------------------*/
    62	
    63	function init(database: Database.Database): void {
    64	  if (db && db !== database) {
    65	    // A DB swap starts a new accounting context. Pending accumulator state
    66	    // must not bleed into the newly active database.
    67	    accumulators.clear();
    68	  }
    69	  db = database;
    70	  initExitHandlers();
    71	  if (!flushInterval) {
    72	    flushInterval = setInterval(() => {
    73	      reset();
    74	    }, FLUSH_INTERVAL_MS);
    75	    flushInterval.unref?.();
    76	  }
    77	}
    78	
    79	/* ───────────────────────────────────────────────────────────────
    80	   5. CORE FUNCTIONS
    81	----------------------------------------------------------------*/
    82	
    83	/**
    84	 * Track a memory access, accumulating until threshold is reached.
    85	 */
    86	function trackAccess(memoryId: number): boolean {
    87	  // P4-14 FIX: If accumulator map exceeds max size, flush all and clear
    88	  // To prevent unbounded memory growth.
    89	  if (accumulators.size > MAX_ACCUMULATOR_SIZE) {
    90	    console.warn(`[access-tracker] Accumulator map exceeded ${MAX_ACCUMULATOR_SIZE} entries, flushing all`);
    91	    if (db) {
    92	      for (const [id] of accumulators) {
    93	        flushAccessCounts(id);
    94	      }
    95	    }
    96	    accumulators.clear();
    97	  }
    98	
    99	  const current = accumulators.get(memoryId) || 0;
   100	  const newValue = current + INCREMENT_VALUE;
   101	
   102	  if (newValue >= ACCUMULATOR_THRESHOLD) {
   103	    // Flush to database
   104	    const success = flushAccessCounts(memoryId);
   105	    if (success) {
   106	      accumulators.delete(memoryId);
   107	    } else {
   108	      accumulators.set(memoryId, newValue);
   109	    }
   110	    return success;
   111	  }
   112	
   113	  accumulators.set(memoryId, newValue);
   114	  return true;
   115	}
   116	
   117	/**
   118	 * Track multiple accesses at once.
   119	 */
   120	function trackMultipleAccesses(memoryIds: number[]): { tracked: number; flushed: number } {
   121	  let tracked = 0;
   122	  let flushed = 0;
   123	
   124	  for (const id of memoryIds) {
   125	    const current = accumulators.get(id) || 0;
   126	    const newValue = current + INCREMENT_VALUE;
   127	
   128	    if (newValue >= ACCUMULATOR_THRESHOLD) {
   129	      const success = flushAccessCounts(id);
   130	      if (success) {
   131	        flushed++;
   132	        accumulators.delete(id);
   133	      } else {
   134	        accumulators.set(id, newValue);
   135	      }
   136	    } else {
   137	      accumulators.set(id, newValue);
   138	    }
   139	    tracked++;
   140	  }
   141	
   142	  return { tracked, flushed };
   143	}
   144	
   145	/**
   146	 * Flush accumulated access count to database.
   147	 */
   148	function flushAccessCounts(memoryId: number): boolean {
   149	  if (!db) {
   150	    console.warn('[access-tracker] Database not initialized. Server may still be starting up.');
   151	    return false;
   152	  }
   153	
   154	  try {
   155	    const now = Date.now();
   156	    const result = (db.prepare(`
   157	      UPDATE memory_index
   158	      SET access_count = access_count + 1,
   159	          last_accessed = ?
   160	      WHERE id = ?
   161	    `) as Database.Statement).run(now, memoryId);
   162	
   163	    if ((result as { changes: number }).changes > 0) {
   164	      try {
   165	        recordAdaptiveSignal(db, {
   166	          memoryId,
   167	          signalType: 'access',
   168	          signalValue: 1,
   169	          actor: 'access-tracker',
   170	        });
   171	      } catch (_error: unknown) {
   172	        // Adaptive signal capture must never block core access tracking
   173	      }
   174	    }
   175	
   176	    return (result as { changes: number }).changes > 0;
   177	  } catch (error: unknown) {
   178	    const msg = error instanceof Error ? error.message : String(error);
   179	    console.warn(`[access-tracker] flushAccessCounts error: ${msg}`);
   180	    return false;
   181	  }
   182	}
   183	
   184	/**
   185	 * Get accumulator state for a memory.
   186	 */
   187	function getAccumulatorState(memoryId: number): AccumulatorState {
   188	  return {
   189	    memoryId,
   190	    accumulated: accumulators.get(memoryId) || 0,
   191	  };
   192	}
   193	
   194	/**
   195	 * Calculate popularity score based on access patterns.
   196	 *
   197	 * @returns Popularity score in the range [0, 1].
   198	 */
   199	function calculatePopularityScore(
   200	  accessCount: number,
   201	  lastAccessed: number | null,
   202	  _createdAt: string | null
   203	): number {
   204	  const safeAccessCount = normalizeAccessCount(accessCount);
   205	  if (safeAccessCount === 0) return 0;
   206	
   207	  // Access frequency component
   208	  const freqScore = Math.min(1.0, Math.log2(safeAccessCount + 1) / 5);
   209	
   210	  // Recency component
   211	  let recencyScore = 0;
   212	  if (lastAccessed) {
   213	    const ageMs = Date.now() - lastAccessed;
   214	    const ageDays = ageMs / (1000 * 60 * 60 * 24);
   215	    const decayDays = getRecencyDecayDays();
   216	    recencyScore = Math.max(0, Math.min(1, 1 - (ageDays / decayDays)));
   217	  }
   218	
   219	  return (freqScore * 0.6) + (recencyScore * 0.4);
   220	}
   221	
   222	/**
   223	 * Calculate usage boost for search ranking.
   224	 *
   225	 * @returns Usage boost in the range [0, 3.0].
   226	 */
   227	function calculateUsageBoost(accessCount: number, lastAccessed: number | null): number {
   228	  const safeAccessCount = normalizeAccessCount(accessCount);
   229	  if (safeAccessCount === 0) return 0;
   230	
   231	  const boost = Math.min(0.2, safeAccessCount * 0.02);
   232	
   233	  // Extra boost for recently accessed
   234	  if (lastAccessed) {
   235	    const ageMs = Date.now() - lastAccessed;
   236	    const ageHours = ageMs / (1000 * 60 * 60);
   237	    if (ageHours < 1) return clampUsageBoost(boost * 2);
   238	    if (ageHours < 24) return clampUsageBoost(boost * 1.5);
   239	  }
   240	
   241	  return clampUsageBoost(boost);
   242	}
   243	
   244	/**
   245	 * Reset all accumulators.
   246	 */
   247	function reset(): void {
   248	  // Flush remaining accumulators before reset
   249	  if (db) {
   250	    for (const [id] of accumulators) {
   251	      flushAccessCounts(id);
   252	    }
   253	  }
   254	  accumulators.clear();
   255	}
   256	
   257	/* ───────────────────────────────────────────────────────────────
   258	   6. EXIT HANDLERS
   259	----------------------------------------------------------------*/
   260	
   261	// Store handler refs for process.removeListener()
   262	let _exitFlushHandler: (() => void) | null = null;
   263	
   264	function initExitHandlers(): void {
   265	  if (exitHandlersInstalled) return;
   266	
   267	  const flush = (): void => {
   268	    // P4-15 FIX: Defensive check — during shutdown the DB handle may
   269	    // Already be closed. Wrap the entire flush in try/catch and verify
   270	    // Db is still usable before attempting writes.
   271	    try {
   272	      if (!db || !accumulators.size) return;
   273	      // Quick liveness check: attempt a no-op query to detect closed handle
   274	      try {
   275	        db.prepare('SELECT 1').get();
   276	      } catch {
   277	        // DB is closed/unusable — skip flush silently
   278	        accumulators.clear();
   279	        return;
   280	      }
   281	      for (const [id] of accumulators) {
   282	        try { flushAccessCounts(id); } catch { /* ignore during shutdown */ }
   283	      }
   284	      accumulators.clear();
   285	    } catch {
   286	      // Ignore all errors during shutdown flush
   287	    }
   288	  };
   289	
   290	  _exitFlushHandler = flush;
   291	  process.on('beforeExit', flush);
   292	  process.on('SIGTERM', flush);
   293	  process.on('SIGINT', flush);
   294	
   295	  exitHandlersInstalled = true;
   296	}
   297	
   298	function cleanupExitHandlers(): void {
   299	  if (_exitFlushHandler) {
   300	    process.removeListener('beforeExit', _exitFlushHandler);
   301	    process.removeListener('SIGTERM', _exitFlushHandler);
   302	    process.removeListener('SIGINT', _exitFlushHandler);
   303	    _exitFlushHandler = null;
   304	  }
   305	  exitHandlersInstalled = false;
   306	}
   307	
   308	function dispose(): void {
   309	  if (flushInterval) {
   310	    clearInterval(flushInterval);
   311	    flushInterval = null;
   312	  }
   313	  cleanupExitHandlers();
   314	  reset();
   315	  db = null;
   316	}
   317	
   318	/* ───────────────────────────────────────────────────────────────
   319	   7. EXPORTS
   320	----------------------------------------------------------------*/
===== .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Composite Scoring
     3	// ───────────────────────────────────────────────────────────────
     4	import { getTierConfig } from './importance-tiers.js';
     5	import { calculatePopularityScore } from '../storage/access-tracker.js';
     6	// HIGH-003 FIX: Import unified recency scoring from folder-scoring
     7	import { computeRecencyScore, DECAY_RATE } from './folder-scoring.js';
     8	// Interference scoring penalty
     9	import { applyInterferencePenalty, INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';
    10	// Scoring observability (N4 + TM-01 logging, 5% sampled)
    11	import { shouldSample, logScoringObservation } from '../telemetry/scoring-observability.js';
    12	
    13	import type { MemoryDbRow } from '@spec-kit/shared/types';
    14	
    15	// Feature catalog: Score normalization
    16	// Feature catalog: Interference scoring
    17	// Feature catalog: Negative feedback confidence signal
    18	
    19	
    20	/**
    21	 * Loose input type for scoring functions.
    22	 * Accepts any partial DB row plus arbitrary extra fields (camelCase
    23	 * fallbacks, search-enriched properties like similarity, etc.).
    24	 */
    25	export type ScoringInput = Partial<MemoryDbRow> & Record<string, unknown>;
    26	
    27	// COGNITIVE-079: FSRS Scheduler for retrievability calculations
    28	// Try to import, fallback to inline calculation if not yet available
    29	interface FsrsSchedulerModule {
    30	  calculateRetrievability: (stability: number, elapsedDays: number) => number;
    31	  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
    32	  FSRS_FACTOR: number;
    33	  FSRS_DECAY: number;
    34	  TIER_MULTIPLIER?: Readonly<Record<string, number>>;
    35	}
    36	
    37	let fsrsScheduler: FsrsSchedulerModule | null = null;
    38	let fsrsSchedulerPromise: Promise<FsrsSchedulerModule | null> | null = null;
    39	let fsrsSchedulerLoadError: string | null = null;
    40	
    41	async function loadFsrsScheduler(): Promise<FsrsSchedulerModule | null> {
    42	  if (fsrsScheduler !== null) {
    43	    return fsrsScheduler;
    44	  }
    45	  if (fsrsSchedulerPromise !== null) {
    46	    return fsrsSchedulerPromise;
    47	  }
    48	
    49	  const loadPromise = (async (): Promise<FsrsSchedulerModule | null> => {
    50	    try {
    51	      fsrsScheduler = await import('../cognitive/fsrs-scheduler.js') as FsrsSchedulerModule;
    52	      fsrsSchedulerLoadError = null;
    53	      return fsrsScheduler;
    54	    } catch (error: unknown) {
    55	      const msg = error instanceof Error ? error.message : String(error);
    56	      fsrsSchedulerLoadError = msg;
    57	      console.warn('[composite-scoring] FSRS scheduler lazy import failed:', msg);
    58	      return null;
    59	    }
    60	  })();
    61	
    62	  fsrsSchedulerPromise = loadPromise;
    63	  try {
    64	    return await loadPromise;
    65	  } finally {
    66	    if (fsrsSchedulerPromise === loadPromise) {
    67	      fsrsSchedulerPromise = null;
    68	    }
    69	  }
    70	}
    71	
    72	function getFsrsScheduler(): FsrsSchedulerModule | null {
    73	  if (fsrsScheduler !== null) {
    74	    return fsrsScheduler;
    75	  }
    76	  if (fsrsSchedulerLoadError) {
    77	    console.warn(`[composite-scoring] fsrs-scheduler unavailable; using inline fallback: ${fsrsSchedulerLoadError}`);
    78	    fsrsSchedulerLoadError = null;
    79	  }
    80	  if (fsrsSchedulerPromise === null) {
    81	    void loadFsrsScheduler();
    82	  }
    83	  return null;
    84	}
    85	
    86	// ───────────────────────────────────────────────────────────────
    87	// 1. TYPES
    88	
    89	// ───────────────────────────────────────────────────────────────
    90	export interface FiveFactorWeights {
    91	  temporal: number;
    92	  usage: number;
    93	  importance: number;
    94	  pattern: number;
    95	  citation: number;
    96	}
    97	
    98	export interface LegacyWeights {
    99	  similarity: number;
   100	  importance: number;
   101	  recency: number;
   102	  popularity: number;
   103	  tierBoost: number;
   104	  retrievability: number;
   105	}
   106	
   107	// ScoringInput is defined above; deprecated MemoryRow was removed.
   108	
   109	export interface ScoringOptions {
   110	  weights?: Partial<FiveFactorWeights> | Partial<LegacyWeights>;
   111	  query?: string;
   112	  anchors?: string | string[];
   113	  use_five_factor_model?: boolean;
   114	}
   115	
   116	export interface FactorDetail {
   117	  value: number;
   118	  weight: number;
   119	  contribution: number;
   120	  description?: string;
   121	}
   122	
   123	export interface FiveFactorBreakdown {
   124	  factors: {
   125	    temporal: FactorDetail;
   126	    usage: FactorDetail;
   127	    importance: FactorDetail;
   128	    pattern: FactorDetail;
   129	    citation: FactorDetail;
   130	  };
   131	  total: number;
   132	  model: '5-factor';
   133	}
   134	
   135	export interface LegacyScoreBreakdown {
   136	  factors: {
   137	    similarity: FactorDetail;
   138	    importance: FactorDetail;
   139	    recency: FactorDetail;
   140	    popularity: FactorDetail;
   141	    tierBoost: FactorDetail;
   142	    retrievability: FactorDetail;
   143	  };
   144	  total: number;
   145	  model: '6-factor-legacy';
   146	}
   147	
   148	export interface PatternAlignmentBonuses {
   149	  exact_match: number;
   150	  partial_match: number;
   151	  semantic_threshold: number;
   152	  anchor_match: number;
   153	  type_match: number;
   154	}
   155	
   156	// ───────────────────────────────────────────────────────────────
   157	// 2. CONFIGURATION
   158	
   159	// ───────────────────────────────────────────────────────────────
   160	// 5-Factor Decay Composite weights
   161	export const FIVE_FACTOR_WEIGHTS: FiveFactorWeights = {
   162	  temporal: 0.25,
   163	  usage: 0.15,
   164	  importance: 0.25,
   165	  pattern: 0.20,
   166	  citation: 0.15,
   167	};
   168	
   169	// Legacy 6-factor weights for backward compatibility
   170	export const DEFAULT_WEIGHTS: LegacyWeights = {
   171	  similarity: 0.30,
   172	  importance: 0.25,
   173	  recency: 0.10,
   174	  popularity: 0.15,
   175	  tierBoost: 0.05,
   176	  retrievability: 0.15,
   177	};
   178	
   179	// HIGH-003 FIX: Re-export DECAY_RATE for backward compatibility
   180	export const RECENCY_SCALE_DAYS: number = 1 / DECAY_RATE;
   181	
   182	// T301: FSRS constants imported from canonical source (fsrs-scheduler.ts)
   183	// Re-exported for backward compatibility — consumers may import from here
   184	export const FSRS_FACTOR: number = 19 / 81;
   185	export const FSRS_DECAY: number = -0.5;
   186	
   187	const RETRIEVABILITY_TIER_MULTIPLIER: Readonly<Record<string, number>> = {
   188	  constitutional: 0.1,
   189	  critical: 0.3,
   190	  important: 0.5,
   191	  normal: 1.0,
   192	  temporary: 2.0,
   193	  scratch: 3.0,
   194	};
   195	
   196	const CLASSIFICATION_CONTEXT_STABILITY_MULTIPLIER: Readonly<Record<string, number>> = {
   197	  decision: Infinity,
   198	  research: 2.0,
   199	  implementation: 1.0,
   200	  discovery: 1.0,
   201	  general: 1.0,
   202	};
   203	
   204	const CLASSIFICATION_TIER_STABILITY_MULTIPLIER: Readonly<Record<string, number>> = {
   205	  constitutional: Infinity,
   206	  critical: Infinity,
   207	  important: 1.5,
   208	  normal: 1.0,
   209	  scratch: 0.5,
   210	  temporary: 0.5,
   211	  deprecated: 0.25,
   212	};
   213	
   214	function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
   215	  const contextMult = CLASSIFICATION_CONTEXT_STABILITY_MULTIPLIER[contextType] ?? 1.0;
   216	  const tierMult = CLASSIFICATION_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
   217	
   218	  if (!isFinite(contextMult) || !isFinite(tierMult)) {
   219	    return Infinity;
   220	  }
   221	
   222	  return stability * contextMult * tierMult;
   223	}
   224	
   225	// Importance weight multipliers
   226	export const IMPORTANCE_MULTIPLIERS: Readonly<Record<string, number>> = {
   227	  constitutional: 2.0,
   228	  critical: 1.5,
   229	  important: 1.3,
   230	  normal: 1.0,
   231	  temporary: 0.6,
   232	  deprecated: 0.1,
   233	};
   234	
   235	// Citation recency decay constants
   236	export const CITATION_DECAY_RATE: number = 0.1;
   237	export const CITATION_MAX_DAYS: number = 90;
   238	
   239	// Document type scoring multipliers.
   240	// Applied as a final multiplier to composite scores so spec documents
   241	// Rank higher than regular memory files for relevant queries.
   242	export const DOCUMENT_TYPE_MULTIPLIERS: Readonly<Record<string, number>> = {
   243	  spec: 1.4,
   244	  decision_record: 1.4,
   245	  plan: 1.3,
   246	  tasks: 1.1,
   247	  implementation_summary: 1.1,
   248	  checklist: 1.0,
   249	  handover: 1.0,
   250	  memory: 1.0,
   251	  constitutional: 2.0,
   252	  scratch: 0.6,
   253	};
   254	
   255	// Pattern alignment bonus configuration
   256	export const PATTERN_ALIGNMENT_BONUSES: PatternAlignmentBonuses = {
   257	  exact_match: 0.3,
   258	  partial_match: 0.15,
   259	  semantic_threshold: 0.8,
   260	  anchor_match: 0.25,
   261	  type_match: 0.2,
   262	};
   263	
   264	// TM-01: Re-export interference penalty coefficient for test access
   265	export { INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';
   266	
   267	// ───────────────────────────────────────────────────────────────
   268	// 3. SCORE CALCULATIONS
   269	
   270	// ───────────────────────────────────────────────────────────────
   271	/**
   272	 * Parse last_accessed value that may be:
   273	 * - An ISO date string (new format from access-tracker)
   274	 * - A millisecond epoch number (legacy format)
   275	 * - null/undefined
   276	 * Returns epoch milliseconds or null.
   277	 */
   278	function parseLastAccessed(value: number | string | undefined | null): number | null {
   279	  if (value == null) return null;
   280	
   281	  // If it's already a number, treat as epoch ms directly
   282	  if (typeof value === 'number') return value;
   283	
   284	  // Try ISO string parse first
   285	  const parsed = Date.parse(value);
   286	  if (!isNaN(parsed)) return parsed;
   287	
   288	  // Maybe it's a stringified epoch number (legacy data)
   289	  const asNum = Number(value);
   290	  if (!isNaN(asNum) && asNum > 1e12) return asNum; // Reasonable ms epoch (after ~2001)
   291	
   292	  return null;
   293	}
   294	
   295	/**
   296	 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
   297	 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
   298	 */
   299	export function calculateRetrievabilityScore(row: ScoringInput): number {
   300	  const scheduler = getFsrsScheduler();
   301	  let stability = (row.stability as number | undefined) || 1.0;
   302	  if (!isFinite(stability)) stability = 1.0;
   303	  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
   304	  const contextType = typeof row.context_type === 'string'
   305	    ? row.context_type.toLowerCase()
   306	    : typeof row.contextType === 'string'
   307	      ? row.contextType.toLowerCase()
   308	      : 'general';
   309	  const tier = typeof row.importance_tier === 'string'
   310	    ? row.importance_tier.toLowerCase()
   311	    : 'normal';
   312	  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
   313	  // Aligned with fsrs-scheduler.ts:337 which uses the same !== 'false' convention.
   314	  const classificationDecayEnabled = process.env.SPECKIT_CLASSIFICATION_DECAY !== 'false';
   315	
   316	  // Return neutral 0.5 when no timestamp — prevents NaN propagation
   317	  if (!lastReview) {
   318	    return 0.5;
   319	  }
   320	
===== .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: N3-Lite Consolidation Engine
     3	// ───────────────────────────────────────────────────────────────
     4	// Lightweight graph maintenance: contradiction scan, Hebbian
     5	// Strengthening, staleness detection, edge bounds enforcement.
     6	// Behind SPECKIT_CONSOLIDATION flag.
     7	import type Database from 'better-sqlite3';
     8	import { isConsolidationEnabled } from '../search/search-flags.js';
     9	import {
    10	  updateEdge,
    11	  getStaleEdges,
    12	  countEdgesForNode,
    13	  MAX_EDGES_PER_NODE,
    14	  MAX_AUTO_STRENGTH,
    15	  MAX_STRENGTH_INCREASE_PER_CYCLE,
    16	  STALENESS_THRESHOLD_DAYS,
    17	  DECAY_STRENGTH_AMOUNT,
    18	  DECAY_PERIOD_DAYS,
    19	} from './causal-edges.js';
    20	import type { CausalEdge } from './causal-edges.js';
    21	
    22	// Feature catalog: Lightweight consolidation
    23	
    24	
    25	/* ───────────────────────────────────────────────────────────────
    26	   1. TYPES
    27	----------------------------------------------------------------*/
    28	
    29	/**
    30	 * Describes the ContradictionPair shape.
    31	 */
    32	export interface ContradictionPair {
    33	  memoryA: { id: number; title: string | null; content: string | null };
    34	  memoryB: { id: number; title: string | null; content: string | null };
    35	  similarity: number;
    36	  conflictType: 'keyword_negation' | 'semantic_opposition';
    37	}
    38	
    39	/**
    40	 * Describes the ContradictionCluster shape.
    41	 */
    42	export interface ContradictionCluster {
    43	  /** The initially detected pair */
    44	  seedPair: ContradictionPair;
    45	  /** All cluster members (IDs of related memories) */
    46	  members: number[];
    47	}
    48	
    49	/**
    50	 * Describes the ConsolidationResult shape.
    51	 */
    52	export interface ConsolidationResult {
    53	  contradictions: ContradictionCluster[];
    54	  hebbian: { strengthened: number; decayed: number };
    55	  stale: { flagged: number };
    56	  edgeBounds: { rejected: number };
    57	}
    58	
    59	/* ───────────────────────────────────────────────────────────────
    60	   2. CONSTANTS
    61	----------------------------------------------------------------*/
    62	
    63	/** Cosine similarity threshold for contradiction candidates */
    64	const CONTRADICTION_SIMILARITY_THRESHOLD = 0.85;
    65	
    66	/** Consolidation cadence for runtime hook (weekly batch semantics) */
    67	const CONSOLIDATION_INTERVAL_DAYS = 7;
    68	
    69	/** Negation keywords for lightweight contradiction heuristic */
    70	const NEGATION_KEYWORDS = [
    71	  'not', 'never', 'no longer', 'instead', 'removed', 'deprecated',
    72	  'replaced', 'incorrect', 'wrong', 'outdated', 'contrary', 'opposite',
    73	  "don't", "doesn't", "shouldn't", "won't", "can't", "isn't", "aren't",
    74	];
    75	
    76	/* ───────────────────────────────────────────────────────────────
    77	   3. T002a: CONTRADICTION SCAN
    78	----------------------------------------------------------------*/
    79	
    80	/**
    81	 * Find potential contradictions by:
    82	 * 1. Candidate generation — high cosine similarity pairs (>0.85)
    83	 * 2. Conflict check — keyword negation heuristic
    84	 *
    85	 * Returns pairs that are both semantically similar AND contain
    86	 * negation patterns suggesting conflicting information.
    87	 */
    88	export function scanContradictions(
    89	  database: Database.Database,
    90	): ContradictionPair[] {
    91	  const pairs: ContradictionPair[] = [];
    92	
    93	  try {
    94	    // Query high-similarity pairs from vec_memories using sqlite-vec
    95	    // Fall back to content-based comparison if vec not available
    96	    const hasSqliteVec = checkSqliteVecAvailable(database);
    97	
    98	    if (hasSqliteVec) {
    99	      pairs.push(...scanContradictionsVector(database));
   100	    } else {
   101	      pairs.push(...scanContradictionsHeuristic(database));
   102	    }
   103	  } catch (error: unknown) {
   104	    const msg = error instanceof Error ? error.message : String(error);
   105	    console.warn(`[consolidation] scanContradictions error: ${msg}`);
   106	  }
   107	
   108	  return pairs;
   109	}
   110	
   111	function checkSqliteVecAvailable(database: Database.Database): boolean {
   112	  try {
   113	    const result = (database.prepare(
   114	      "SELECT name FROM sqlite_master WHERE type='table' AND name='vec_memories'"
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	    return !!result;
   117	  } catch (_error: unknown) {
   118	    return false;
   119	  }
   120	}
   121	
   122	/**
   123	 * Vector-based contradiction scan using sqlite-vec cosine similarity.
   124	 */
   125	function scanContradictionsVector(
   126	  database: Database.Database,
   127	): ContradictionPair[] {
   128	  const pairs: ContradictionPair[] = [];
   129	
   130	  // Get all non-deprecated, non-chunk memories with embeddings
   131	  const memories = (database.prepare(`
   132	    SELECT m.id, m.title, m.content_text, v.embedding
   133	    FROM memory_index m
   134	    JOIN vec_memories v ON v.rowid = m.id
   135	    WHERE m.importance_tier != 'deprecated'
   136	      AND m.parent_id IS NULL
   137	      AND m.content_text IS NOT NULL
   138	      AND length(m.content_text) > 50
   139	    ORDER BY m.id
   140	    LIMIT 500
   141	  `) as Database.Statement).all() as Array<{
   142	    id: number;
   143	    title: string | null;
   144	    content_text: string | null;
   145	    embedding: Buffer;
   146	  }>;
   147	
   148	  // O(n^2) pairwise scan capped at 500 memories (up to 124,750 pairs).
   149	  // A 5-second deadline prevents runaway CPU when embeddings are large or the
   150	  // Machine is slow, keeping the consolidation cycle non-blocking.
   151	  const deadline = Date.now() + 5000;
   152	
   153	  // Pairwise similarity check (O(n^2) but capped at 500 memories)
   154	  for (let i = 0; i < memories.length; i++) {
   155	    for (let j = i + 1; j < memories.length; j++) {
   156	      if (Date.now() > deadline) {
   157	        console.warn('[consolidation] Contradiction scan timed out after 5s');
   158	        return pairs;
   159	      }
   160	      const similarity = computeCosineSimilarity(
   161	        new Float32Array(memories[i].embedding.buffer, memories[i].embedding.byteOffset, memories[i].embedding.byteLength / 4),
   162	        new Float32Array(memories[j].embedding.buffer, memories[j].embedding.byteOffset, memories[j].embedding.byteLength / 4),
   163	      );
   164	
   165	      if (similarity >= CONTRADICTION_SIMILARITY_THRESHOLD) {
   166	        const contentA = memories[i].content_text || '';
   167	        const contentB = memories[j].content_text || '';
   168	
   169	        if (hasNegationConflict(contentA, contentB)) {
   170	          pairs.push({
   171	            memoryA: { id: memories[i].id, title: memories[i].title, content: contentA },
   172	            memoryB: { id: memories[j].id, title: memories[j].title, content: contentB },
   173	            similarity,
   174	            conflictType: 'keyword_negation',
   175	          });
   176	        }
   177	      }
   178	    }
   179	  }
   180	
   181	  return pairs;
   182	}
   183	
   184	/**
   185	 * Heuristic-only contradiction scan when vector similarity is unavailable.
   186	 * Uses title and content text comparison.
   187	 */
   188	function scanContradictionsHeuristic(
   189	  database: Database.Database,
   190	): ContradictionPair[] {
   191	  const pairs: ContradictionPair[] = [];
   192	
   193	  const memories = (database.prepare(`
   194	    SELECT id, title, content_text
   195	    FROM memory_index
   196	    WHERE importance_tier != 'deprecated'
   197	      AND parent_id IS NULL
   198	      AND content_text IS NOT NULL
   199	      AND length(content_text) > 50
   200	    ORDER BY id
   201	    LIMIT 200
   202	  `) as Database.Statement).all() as Array<{
   203	    id: number;
   204	    title: string | null;
   205	    content_text: string | null;
   206	  }>;
   207	
   208	  // Same 5-second timeout guard as the vector-based scan to prevent
   209	  // Unbounded CPU usage in the heuristic O(n^2) fallback path.
   210	  const deadline = Date.now() + 5000;
   211	
   212	  // Simple word-overlap heuristic for candidate generation
   213	  for (let i = 0; i < memories.length; i++) {
   214	    for (let j = i + 1; j < memories.length; j++) {
   215	      if (Date.now() > deadline) {
   216	        console.warn('[consolidation] Contradiction scan (heuristic) timed out after 5s');
   217	        return pairs;
   218	      }
   219	      const contentA = memories[i].content_text || '';
   220	      const contentB = memories[j].content_text || '';
   221	
   222	      const overlap = computeWordOverlap(contentA, contentB);
   223	      if (overlap >= CONTRADICTION_SIMILARITY_THRESHOLD && hasNegationConflict(contentA, contentB)) {
   224	        pairs.push({
   225	          memoryA: { id: memories[i].id, title: memories[i].title, content: contentA },
   226	          memoryB: { id: memories[j].id, title: memories[j].title, content: contentB },
   227	          similarity: overlap,
   228	          conflictType: 'keyword_negation',
   229	        });
   230	      }
   231	    }
   232	  }
   233	
   234	  return pairs;
   235	}
   236	
   237	/**
   238	 * Check if two texts contain negation patterns suggesting contradiction.
   239	 */
   240	export function hasNegationConflict(textA: string, textB: string): boolean {
   241	  const lowerA = textA.toLowerCase();
   242	  const lowerB = textB.toLowerCase();
   243	
   244	  for (const keyword of NEGATION_KEYWORDS) {
   245	    const inA = lowerA.includes(keyword);
   246	    const inB = lowerB.includes(keyword);
   247	
   248	    // One has negation, the other doesn't → potential contradiction
   249	    if (inA !== inB) return true;
   250	  }
   251	
   252	  return false;
   253	}
   254	
   255	function computeCosineSimilarity(a: Float32Array, b: Float32Array): number {
   256	  if (a.length !== b.length || a.length === 0) return 0;
   257	  let dot = 0, normA = 0, normB = 0;
   258	  for (let i = 0; i < a.length; i++) {
   259	    dot += a[i] * b[i];
   260	    normA += a[i] * a[i];
   261	    normB += b[i] * b[i];
   262	  }
   263	  const denom = Math.sqrt(normA) * Math.sqrt(normB);
   264	  return denom > 0 ? dot / denom : 0;
   265	}
   266	
   267	function computeWordOverlap(textA: string, textB: string): number {
   268	  const wordsA = new Set(textA.toLowerCase().split(/\s+/).filter(w => w.length > 3));
   269	  const wordsB = new Set(textB.toLowerCase().split(/\s+/).filter(w => w.length > 3));
   270	  if (wordsA.size === 0 || wordsB.size === 0) return 0;
   271	
   272	  let overlap = 0;
   273	  for (const w of wordsA) {
   274	    if (wordsB.has(w)) overlap++;
   275	  }
   276	  return overlap / Math.max(wordsA.size, wordsB.size);
   277	}
   278	
   279	/* ───────────────────────────────────────────────────────────────
   280	   4. T002e: CONTRADICTION CLUSTER SURFACING
   281	----------------------------------------------------------------*/
   282	
   283	/**
   284	 * Surface all members of a contradiction cluster.
   285	 * When a contradiction pair is detected, find ALL related memories
   286	 * (via causal edges) to surface the full context for resolution.
   287	 */
   288	export function buildContradictionClusters(
   289	  database: Database.Database,
   290	  pairs: ContradictionPair[],
   291	): ContradictionCluster[] {
   292	  const clusters: ContradictionCluster[] = [];
   293	
   294	  for (const pair of pairs) {
   295	    const memberIds = new Set<number>([pair.memoryA.id, pair.memoryB.id]);
   296	
   297	    // Expand cluster via causal edges (1-hop neighbors)
   298	    for (const seedId of [pair.memoryA.id, pair.memoryB.id]) {
   299	      try {
   300	        const neighbors = (database.prepare(`
   301	          SELECT CAST(target_id AS INTEGER) as neighbor_id FROM causal_edges WHERE source_id = ?
   302	          UNION
   303	          SELECT CAST(source_id AS INTEGER) as neighbor_id FROM causal_edges WHERE target_id = ?
   304	        `) as Database.Statement).all(String(seedId), String(seedId)) as Array<{ neighbor_id: number }>;
   305	
   306	        for (const n of neighbors) {
   307	          if (!isNaN(n.neighbor_id)) {
   308	            memberIds.add(n.neighbor_id);
   309	          }
   310	        }
   311	      } catch (err: unknown) {
   312	        const message = err instanceof Error ? err.message : String(err);
   313	        console.warn('[consolidation] cluster expansion error:', message);
   314	      }
   315	    }
   316	
   317	    clusters.push({
   318	      seedPair: pair,
   319	      members: Array.from(memberIds),
   320	    });

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts' \\
'.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,320p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Tier Classifier
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// Fs and path removed — unused in this module
     6	
     7	// Import FSRS constants and canonical retrievability function.
     8	import {
     9	  FSRS_HALF_LIFE_FACTOR,
    10	  calculateRetrievability as calculateFsrsRetrievability
    11	} from './fsrs-scheduler.js';
    12	import type { MemoryDbRow } from '@spec-kit/shared/types';
    13	
    14	/**
    15	 * Loose input type for tier classification functions.
    16	 * Accepts any partial DB row plus arbitrary extra fields (camelCase
    17	 * fallbacks, search-enriched properties, etc.).
    18	 */
    19	type TierInput = Partial<MemoryDbRow> & Record<string, unknown>;
    20	
    21	/* ───────────────────────────────────────────────────────────────
    22	   1. CONFIGURATION
    23	----------------------------------------------------------------*/
    24	
    25	/** Parse threshold from env var with validation */
    26	function parseThreshold(envVar: string, defaultVal: number): number {
    27	  const parsed = parseFloat(process.env[envVar] || '');
    28	  return !isNaN(parsed) && parsed >= 0 && parsed <= 1 ? parsed : defaultVal;
    29	}
    30	
    31	/** Parse integer limit from env var with validation */
    32	function parseLimit(envVar: string, defaultVal: number): number {
    33	  const parsed = parseInt(process.env[envVar] || '', 10);
    34	  return !isNaN(parsed) && parsed > 0 ? parsed : defaultVal;
    35	}
    36	
    37	// 5-State Model thresholds based on FSRS retrievability R = (1 + FACTOR * t / S)^DECAY
    38	const STATE_THRESHOLDS = {
    39	  HOT: 0.80,
    40	  WARM: 0.25,
    41	  COLD: 0.05,
    42	  DORMANT: 0.02,
    43	} as const;
    44	
    45	const ARCHIVED_DAYS_THRESHOLD = 90;
    46	
    47	interface TierConfigType {
    48	  hotThreshold: number;
    49	  warmThreshold: number;
    50	  coldThreshold: number;
    51	  archivedDaysThreshold: number;
    52	  maxHotMemories: number;
    53	  maxWarmMemories: number;
    54	  maxColdMemories: number;
    55	  maxDormantMemories: number;
    56	  maxArchivedMemories: number;
    57	  summaryFallbackLength: number;
    58	}
    59	
    60	const TIER_CONFIG: TierConfigType = {
    61	  hotThreshold: parseThreshold('HOT_THRESHOLD', STATE_THRESHOLDS.HOT),
    62	  warmThreshold: parseThreshold('WARM_THRESHOLD', STATE_THRESHOLDS.WARM),
    63	  coldThreshold: parseThreshold('COLD_THRESHOLD', STATE_THRESHOLDS.COLD),
    64	  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
    65	  maxHotMemories: parseLimit('MAX_HOT_MEMORIES', 5),
    66	  maxWarmMemories: parseLimit('MAX_WARM_MEMORIES', 10),
    67	  maxColdMemories: parseLimit('MAX_COLD_MEMORIES', 3),
    68	  maxDormantMemories: parseLimit('MAX_DORMANT_MEMORIES', 2),
    69	  maxArchivedMemories: parseLimit('MAX_ARCHIVED_MEMORIES', 1),
    70	  summaryFallbackLength: 150,
    71	};
    72	
    73	// Validate threshold ordering (HOT > WARM > COLD)
    74	if (TIER_CONFIG.hotThreshold <= TIER_CONFIG.warmThreshold) {
    75	  console.warn('[tier-classifier] Invalid thresholds: HOT must be > WARM. Using defaults.');
    76	  TIER_CONFIG.hotThreshold = STATE_THRESHOLDS.HOT;
    77	  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
    78	}
    79	if (TIER_CONFIG.warmThreshold <= TIER_CONFIG.coldThreshold) {
    80	  console.warn('[tier-classifier] Invalid thresholds: WARM must be > COLD. Using defaults.');
    81	  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
    82	  TIER_CONFIG.coldThreshold = STATE_THRESHOLDS.COLD;
    83	}
    84	
    85	/* ───────────────────────────────────────────────────────────────
    86	   1.5 TYPE-SPECIFIC HALF-LIVES (REQ-002, T008)
    87	----------------------------------------------------------------*/
    88	
    89	type TierState = 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
    90	
    91	// TierInput derived from MemoryDbRow (shared/normalization.ts)
    92	
    93	interface StateContent {
    94	  state: TierState;
    95	  memories: TierInput[];
    96	  count: number;
    97	}
    98	
    99	interface StateStats {
   100	  HOT: number;
   101	  WARM: number;
   102	  COLD: number;
   103	  DORMANT: number;
   104	  ARCHIVED: number;
   105	  total: number;
   106	}
   107	
   108	// Lazy-load memory types to avoid circular dependencies
   109	let memoryTypesModule: Record<string, unknown> | false | null = null;
   110	let memoryTypesModulePromise: Promise<Record<string, unknown> | false> | null = null;
   111	
   112	async function loadMemoryTypesModule(): Promise<Record<string, unknown> | false> {
   113	  if (memoryTypesModule !== null) {
   114	    return memoryTypesModule;
   115	  }
   116	  if (memoryTypesModulePromise !== null) {
   117	    return memoryTypesModulePromise;
   118	  }
   119	
   120	  const loadPromise = (async (): Promise<Record<string, unknown> | false> => {
   121	    try {
   122	      memoryTypesModule = await import('../config/memory-types.js');
   123	      return memoryTypesModule;
   124	    } catch (error: unknown) {
   125	      const msg = error instanceof Error ? error.message : String(error);
   126	      console.warn('[tier-classifier] memory-types module not available:', msg);
   127	      memoryTypesModule = false;
   128	      return false;
   129	    }
   130	  })();
   131	
   132	  memoryTypesModulePromise = loadPromise;
   133	  try {
   134	    return await loadPromise;
   135	  } finally {
   136	    if (memoryTypesModulePromise === loadPromise) {
   137	      memoryTypesModulePromise = null;
   138	    }
   139	  }
   140	}
   141	
   142	/** Get memory types module (lazy loaded) */
   143	function getMemoryTypesModule(): Record<string, unknown> | null {
   144	  if (memoryTypesModule !== null) {
   145	    return memoryTypesModule || null;
   146	  }
   147	  if (memoryTypesModulePromise === null) {
   148	    void loadMemoryTypesModule();
   149	  }
   150	  return null;
   151	}
   152	
   153	/**
   154	 * Get effective half-life for a memory based on its type (REQ-002, CHK-017)
   155	 * Priority: explicit half_life_days > memory_type lookup > default
   156	 */
   157	function getEffectiveHalfLife(memory: TierInput | null | undefined): number | null {
   158	  if (!memory || typeof memory !== 'object') {
   159	    return 60; // Default to declarative half-life
   160	  }
   161	
   162	  // Priority 1: Explicit half_life_days override
   163	  if (typeof memory.half_life_days === 'number' && memory.half_life_days > 0) {
   164	    return memory.half_life_days;
   165	  }
   166	  if (typeof memory.halfLifeDays === 'number' && memory.halfLifeDays > 0) {
   167	    return memory.halfLifeDays;
   168	  }
   169	
   170	  // Priority 2: Look up by memory_type
   171	  const memoryType = memory.memory_type;
   172	  if (memoryType && typeof memoryType === 'string') {
   173	    const typesModule = getMemoryTypesModule();
   174	    if (typesModule && typeof typesModule === 'object') {
   175	      const getHalfLife = (typesModule as Record<string, unknown>).getHalfLifeForType;
   176	      if (typeof getHalfLife === 'function') {
   177	        const halfLife = getHalfLife(memoryType);
   178	        if (typeof halfLife === 'number' && Number.isFinite(halfLife) && halfLife > 0) {
   179	          return halfLife;
   180	        }
   181	      }
   182	    }
   183	  }
   184	
   185	  // Priority 3: Default based on importance tier
   186	  const tier = memory.importance_tier;
   187	  if (tier === 'constitutional' || tier === 'critical') {
   188	    return null; // No decay for constitutional/critical
   189	  }
   190	
   191	  return 60; // Default declarative half-life
   192	}
   193	
   194	/**
   195	 * Convert half-life in days to FSRS stability value.
   196	 *
   197	 * FSRS v4 retrievability: R(t) = (1 + FACTOR * t / S)^DECAY
   198	 * where FACTOR = 19/81, DECAY = -0.5.
   199	 *
   200	 * Half-life means R(h) = 0.5:
   201	 *   0.5 = (1 + (19/81) * h / S)^(-0.5)
   202	 *   => S = FSRS_HALF_LIFE_FACTOR * h  (= 19/243 * h)
   203	 *
   204	 * NOTE: The old formula (h / ln(2)) assumed exponential decay R = e^(-t/S),
   205	 * which yielded stability ~18.5x too high for the FSRS power-law model.
   206	 */
   207	function halfLifeToStability(halfLifeDays: number | null): number {
   208	  if (halfLifeDays === null || halfLifeDays <= 0) {
   209	    return 999999; // Effectively infinite stability (no decay)
   210	  }
   211	  // Use canonical FSRS_HALF_LIFE_FACTOR from fsrs-scheduler.ts
   212	  // S = FSRS_HALF_LIFE_FACTOR * halfLife  (derived from FSRS power-law half-life equation)
   213	  return FSRS_HALF_LIFE_FACTOR * halfLifeDays;
   214	}
   215	
   216	/* ───────────────────────────────────────────────────────────────
   217	   2. CORE CLASSIFICATION FUNCTIONS
   218	----------------------------------------------------------------*/
   219	
   220	/**
   221	 * Calculate retrievability using FSRS formula.
   222	 * R = (1 + FACTOR * t / S)^DECAY
   223	 */
   224	function calculateRetrievability(stability: number, elapsedDays: number): number {
   225	  if (stability <= 0 || elapsedDays < 0) return 0;
   226	  return calculateFsrsRetrievability(stability, elapsedDays);
   227	}
   228	
   229	/**
   230	 * Classify memory into 5-state model based on retrievability.
   231	 *
   232	 * Accepts either:
   233	 *   - Two numbers: classifyState(retrievability, elapsedDays)
   234	 *   - A memory object: classifyState(memoryOrObj) where R is extracted from
   235	 *     retrievability, attentionScore, or defaults to 0
   236	 *   - null/undefined: returns 'DORMANT'
   237	 */
   238	function classifyState(
   239	  retrievabilityOrMemory: number | TierInput | null | undefined,
   240	  elapsedDays?: number,
   241	): TierState {
   242	  let r: number;
   243	  let days: number;
   244	
   245	  if (retrievabilityOrMemory === null || retrievabilityOrMemory === undefined) {
   246	    return 'DORMANT';
   247	  }
   248	
   249	  if (typeof retrievabilityOrMemory === 'number') {
   250	    // Direct numeric call: classifyState(0.95, 5)
   251	    r = retrievabilityOrMemory;
   252	    days = typeof elapsedDays === 'number' ? elapsedDays : 0;
   253	  } else if (typeof retrievabilityOrMemory === 'object') {
   254	    // Memory object call: classifyState(memoryObj)
   255	    const mem = retrievabilityOrMemory as Record<string, unknown>;
   256	    if (typeof mem.retrievability === 'number') {
   257	      r = mem.retrievability;
   258	    } else if (typeof mem.attentionScore === 'number') {
   259	      r = mem.attentionScore;
   260	    } else {
   261	      r = 0;
   262	    }
   263	    // Extract elapsed days from lastAccess or created_at
   264	    const timestamp = mem.lastAccess || mem.last_accessed || mem.lastReview || mem.last_review || mem.created_at;
   265	    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
   266	      const lastDate = new Date(timestamp as string | number);
   267	      const now = new Date();
   268	      days = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
   269	    } else {
   270	      days = 0;
   271	    }
   272	  } else {
   273	    return 'DORMANT';
   274	  }
   275	
   276	  // ARCHIVED requires BOTH conditions: old age AND very low retrievability
   277	  // (days > 90 AND r < 0.02). Using || here would incorrectly archive
   278	  // Recent memories with low R, or old memories with high R.
   279	  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
   280	    return 'ARCHIVED';
   281	  }
   282	  if (r >= TIER_CONFIG.hotThreshold) return 'HOT';
   283	  if (r >= TIER_CONFIG.warmThreshold) return 'WARM';
   284	  if (r >= TIER_CONFIG.coldThreshold) return 'COLD';
   285	  return 'DORMANT';
   286	}
   287	
   288	/**
   289	 * Classify a memory's importance tier based on its properties.
   290	 */
   291	function classifyTier(memory: TierInput): {
   292	  state: TierState;
   293	  retrievability: number;
   294	  effectiveHalfLife: number | null;
   295	} {
   296	  const stability = memory.stability ?? 1.0;
   297	  const lastReview = memory.last_review || memory.created_at;
   298	  const effectiveHalfLife = getEffectiveHalfLife(memory);
   299	
   300	  // If no decay (constitutional/critical), always HOT
   301	  if (effectiveHalfLife === null) {
   302	    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
   303	  }
   304	
   305	  // Pinned memories are always HOT
   306	  if (memory.is_pinned === 1) {
   307	    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
   308	  }
   309	
   310	  // Calculate elapsed days
   311	  let elapsedDays = 0;
   312	  if (lastReview) {
   313	    const lastDate = new Date(lastReview);
   314	    const now = new Date();
   315	    elapsedDays = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
   316	  }
   317	
   318	  // Use effective stability from half-life.
   319	  // Math.max ensures new memories (default stability=1.0) benefit from their
   320	  // Type's configured half-life, while well-reviewed memories keep their
===== .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts =====
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Attention Decay
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// DECAY STRATEGY (ADR-004): This module is the FACADE for all long-term
     6	// Memory decay. It exposes FSRS-based decay as the canonical path
     7	// (via composite-scoring.ts and fsrs-scheduler.ts).
     8	// Legacy exponential functions (calculateDecayedScore, applyDecay) were
     9	// Removed from the runtime API after callers migrated to applyFsrsDecay.
    10	// Or calculateCompositeAttention.
    11	//
    12	// Decay ownership map:
    13	// Long-term memory scoring → FSRS v4 (fsrs-scheduler.ts)
    14	// Composite attention      → 5-factor model (composite-scoring.ts) using FSRS temporal
    15	// Session/working memory   → Linear decay (working-memory.ts) — separate domain
    16	// Search-time ranking      → FSRS-preferred SQL (vector-index-impl.js)
    17	// External packages
    18	import type Database from 'better-sqlite3';
    19	
    20	/* --- 1. DEPENDENCIES --- */
    21	
    22	// Internal modules
    23	import * as fsrsScheduler from './fsrs-scheduler.js';
    24	import type { ReviewResult } from './fsrs-scheduler.js';
    25	import {
    26	  calculateFiveFactorScore,
    27	  calculateTemporalScore,
    28	  calculateUsageScore,
    29	  calculateImportanceScore,
    30	  calculatePatternScore,
    31	  calculateCitationScore,
    32	  FIVE_FACTOR_WEIGHTS,
    33	} from '../scoring/composite-scoring.js';
    34	import type { FiveFactorWeights } from '../scoring/composite-scoring.js';
    35	
    36	/* --- 2. CONFIGURATION --- */
    37	
    38	interface DecayRateByTier {
    39	  constitutional: number;
    40	  critical: number;
    41	  important: number;
    42	  normal: number;
    43	  temporary: number;
    44	  deprecated: number;
    45	  [key: string]: number;
    46	}
    47	
    48	interface DecayConfigType {
    49	  defaultDecayRate: number;
    50	  decayRateByTier: DecayRateByTier;
    51	  minScoreThreshold: number;
    52	}
    53	
    54	// ADR-061: Decay rates aligned with importance-tiers.js (1.0 = no decay)
    55	const DECAY_CONFIG: DecayConfigType = {
    56	  defaultDecayRate: 0.80,
    57	  decayRateByTier: {
    58	    constitutional: 1.0,
    59	    critical: 1.0,
    60	    important: 1.0,
    61	    normal: 0.80,
    62	    temporary: 0.60,
    63	    deprecated: 1.0,
    64	  },
    65	  minScoreThreshold: 0.001,
    66	};
    67	
    68	/* --- 3. STATE --- */
    69	
    70	let db: Database.Database | null = null;
    71	
    72	/* --- 4. INITIALIZATION --- */
    73	
    74	function init(database: Database.Database): void {
    75	  if (!database) {
    76	    throw new Error('[attention-decay] Database reference is required');
    77	  }
    78	  db = database;
    79	}
    80	
    81	function getDb(): Database.Database | null {
    82	  return db;
    83	}
    84	
    85	/* --- 5. DECAY RATE FUNCTIONS --- */
    86	
    87	function getDecayRate(importanceTier: string | null | undefined): number {
    88	  if (!importanceTier || typeof importanceTier !== 'string') {
    89	    return DECAY_CONFIG.defaultDecayRate;
    90	  }
    91	
    92	  const rate = DECAY_CONFIG.decayRateByTier[importanceTier];
    93	  return rate !== undefined ? rate : DECAY_CONFIG.defaultDecayRate;
    94	}
    95	
    96	// calculateDecayedScore was removed; use calculateRetrievabilityDecay or applyFsrsDecay.
    97	
    98	/**
    99	 * Calculate retrievability-based decay using FSRS formula.
   100	 */
   101	function calculateRetrievabilityDecay(stability: number, elapsedDays: number): number {
   102	  if (typeof fsrsScheduler.calculateRetrievability === 'function') {
   103	    return fsrsScheduler.calculateRetrievability(stability, elapsedDays);
   104	  }
   105	  // Inline fallback uses canonical constants from fsrs-scheduler.ts
   106	  if (stability <= 0 || elapsedDays < 0) return 0;
   107	  return Math.pow(1 + fsrsScheduler.FSRS_FACTOR * (elapsedDays / stability), fsrsScheduler.FSRS_DECAY);
   108	}
   109	
   110	// applyDecay was removed; use applyFsrsDecay.
   111	
   112	/**
   113	 * Apply FSRS-based decay to a memory.
   114	 */
   115	function applyFsrsDecay(
   116	  memory: Record<string, unknown>,
   117	  baseScore: number = 1.0
   118	): number {
   119	  const stability = (memory.stability as number) || 1.0;
   120	  const lastReview = (memory.last_review || memory.created_at) as string | undefined;
   121	
   122	  if (!lastReview) return baseScore;
   123	
   124	  const parsedTime = new Date(lastReview).getTime();
   125	  if (!Number.isFinite(parsedTime)) return baseScore;
   126	
   127	  const elapsedMs = Date.now() - parsedTime;
   128	  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
   129	
   130	  const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);
   131	  return baseScore * retrievability;
   132	}
   133	
   134	/**
   135	 * Activate a memory (boost its decay score via access recording).
   136	 */
   137	function activateMemory(memoryId: number): boolean {
   138	  if (!db) {
   139	    console.warn('[attention-decay] Database not initialized. Server may still be starting up.');
   140	    return false;
   141	  }
   142	
   143	  try {
   144	    const result = (db.prepare(`
   145	      UPDATE memory_index
   146	      SET access_count = access_count + 1,
   147	          last_accessed = ?,
   148	          updated_at = datetime('now')
   149	      WHERE id = ?
   150	    `) as Database.Statement).run(Date.now(), memoryId);
   151	    return (result as { changes: number }).changes > 0;
   152	  } catch (error: unknown) {
   153	    const msg = error instanceof Error ? error.message : String(error);
   154	    console.warn(`[attention-decay] activateMemory error: ${msg}`);
   155	    return false;
   156	  }
   157	}
   158	
   159	/**
   160	 * Activate memory with FSRS review update.
   161	 */
   162	function activateMemoryWithFsrs(memoryId: number, grade: number = 3): boolean {
   163	  if (!db) return false;
   164	
   165	  try {
   166	    const memory = (db.prepare('SELECT stability, difficulty, last_review, review_count FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
   167	    if (!memory) return false;
   168	
   169	    const params = {
   170	      stability: (memory.stability as number) || 1.0,
   171	      difficulty: (memory.difficulty as number) || 5.0,
   172	      lastReview: (memory.last_review as string) || null,
   173	      reviewCount: (memory.review_count as number) || 0,
   174	    };
   175	
   176	    let result: ReviewResult;
   177	    if (typeof fsrsScheduler.processReview === 'function') {
   178	      result = fsrsScheduler.processReview(params, grade);
   179	    } else {
   180	      // Basic update if FSRS not available
   181	      result = {
   182	        stability: params.stability * 1.1,
   183	        difficulty: params.difficulty,
   184	        lastReview: new Date().toISOString(),
   185	        reviewCount: params.reviewCount + 1,
   186	        nextReviewDate: new Date().toISOString(),
   187	        retrievability: 1.0,
   188	      };
   189	    }
   190	
   191	    (db.prepare(`
   192	      UPDATE memory_index
   193	      SET stability = ?,
   194	          difficulty = ?,
   195	          last_review = ?,
   196	          review_count = ?,
   197	          access_count = access_count + 1,
   198	          last_accessed = ?
   199	      WHERE id = ?
   200	    `) as Database.Statement).run(
   201	      result.stability,
   202	      result.difficulty,
   203	      result.lastReview,
   204	      result.reviewCount,
   205	      Date.now(),
   206	      memoryId
   207	    );
   208	
   209	    return true;
   210	  } catch (error: unknown) {
   211	    const msg = error instanceof Error ? error.message : String(error);
   212	    console.warn(`[attention-decay] activateMemoryWithFsrs error: ${msg}`);
   213	    return false;
   214	  }
   215	}
   216	
   217	/* --- 6. COMPOSITE ATTENTION SCORING --- */
   218	
   219	interface AttentionBreakdown {
   220	  temporal: number;
   221	  usage: number;
   222	  importance: number;
   223	  pattern: number;
   224	  citation: number;
   225	  composite: number;
   226	  weights: FiveFactorWeights;
   227	}
   228	
   229	/**
   230	 * Calculate composite attention score using 5-factor model.
   231	 */
   232	function calculateCompositeAttention(
   233	  memory: Record<string, unknown>,
   234	  options: { weights?: Record<string, number> } = {}
   235	): number {
   236	  return calculateFiveFactorScore(memory, options) as number;
   237	}
   238	
   239	/**
   240	 * Get detailed attention breakdown for a memory.
   241	 */
   242	function getAttentionBreakdown(memory: Record<string, unknown>): AttentionBreakdown {
   243	  const temporal = calculateTemporalScore(memory) as number;
   244	  const usage = calculateUsageScore((memory.access_count as number) || 0) as number;
   245	  const importance = calculateImportanceScore(
   246	    String(memory.importance_tier || memory.importanceTier || 'normal'),
   247	    memory.importance_weight as number | undefined
   248	  ) as number;
   249	  const pattern = calculatePatternScore(memory) as number;
   250	  const citation = calculateCitationScore(memory) as number;
   251	
   252	  const weights = FIVE_FACTOR_WEIGHTS || {
   253	    temporal: 0.25,
   254	    usage: 0.20,
   255	    importance: 0.25,
   256	    pattern: 0.15,
   257	    citation: 0.15,
   258	  };
   259	
   260	  const composite = (
   261	    temporal * (weights.temporal || 0.25) +
   262	    usage * (weights.usage || 0.20) +
   263	    importance * (weights.importance || 0.25) +
   264	    pattern * (weights.pattern || 0.15) +
   265	    citation * (weights.citation || 0.15)
   266	  );
   267	
   268	  return {
   269	    temporal,
   270	    usage,
   271	    importance,
   272	    pattern,
   273	    citation,
   274	    composite: Math.round(composite * 1000) / 1000,
   275	    weights: weights,
   276	  };
   277	}
   278	
   279	/**
   280	 * Apply composite decay to a list of memories and return sorted by score.
   281	 */
   282	function applyCompositeDecay(
   283	  memories: Array<Record<string, unknown>>
   284	): Array<Record<string, unknown> & { attentionScore: number }> {
   285	  return memories
   286	    .map(m => ({
   287	      ...m,
   288	      attentionScore: calculateCompositeAttention(m),
   289	    }))
   290	    .sort((a, b) => b.attentionScore - a.attentionScore);
   291	}
   292	
   293	/**
   294	 * Get active memories sorted by attention score.
   295	 */
   296	function getActiveMemories(
   297	  limit: number = 20
   298	): Array<Record<string, unknown>> {
   299	  if (!db) {
   300	    console.warn('[attention-decay] Database not initialized. Server may still be starting up.');
   301	    return [];
   302	  }
   303	
   304	  try {
   305	    const rows = (db.prepare(`
   306	      SELECT * FROM memory_index
   307	      WHERE embedding_status = 'success'
   308	        AND (importance_tier IS NULL OR importance_tier NOT IN ('deprecated'))
   309	      ORDER BY last_accessed DESC, importance_weight DESC
   310	      LIMIT ?
   311	    `) as Database.Statement).all(limit) as Array<Record<string, unknown>>;
   312	
   313	    return applyCompositeDecay(rows);
   314	  } catch (error: unknown) {
   315	    const msg = error instanceof Error ? error.message : String(error);
   316	    console.warn(`[attention-decay] getActiveMemories error: ${msg}`);
   317	    return [];
   318	  }
   319	}
   320	

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '295,480p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   295	/**
   296	 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
   297	 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
   298	 */
   299	export function calculateRetrievabilityScore(row: ScoringInput): number {
   300	  const scheduler = getFsrsScheduler();
   301	  let stability = (row.stability as number | undefined) || 1.0;
   302	  if (!isFinite(stability)) stability = 1.0;
   303	  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
   304	  const contextType = typeof row.context_type === 'string'
   305	    ? row.context_type.toLowerCase()
   306	    : typeof row.contextType === 'string'
   307	      ? row.contextType.toLowerCase()
   308	      : 'general';
   309	  const tier = typeof row.importance_tier === 'string'
   310	    ? row.importance_tier.toLowerCase()
   311	    : 'normal';
   312	  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
   313	  // Aligned with fsrs-scheduler.ts:337 which uses the same !== 'false' convention.
   314	  const classificationDecayEnabled = process.env.SPECKIT_CLASSIFICATION_DECAY !== 'false';
   315	
   316	  // Return neutral 0.5 when no timestamp — prevents NaN propagation
   317	  if (!lastReview) {
   318	    return 0.5;
   319	  }
   320	
   321	  const timestamp = new Date(lastReview).getTime();
   322	  if (isNaN(timestamp)) return 0.5; // Neutral score for invalid dates
   323	
   324	  const elapsedMs = Date.now() - timestamp;
   325	  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
   326	
   327	  // TM-03: Classification decay applies at stability-level; when enabled do not
   328	  // Additionally apply elapsed-time tier multipliers to avoid double decay.
   329	  let adjustedStability = stability;
   330	  if (classificationDecayEnabled) {
   331	    if (scheduler?.applyClassificationDecay) {
   332	      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
   333	    } else {
   334	      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
   335	    }
   336	    if (!isFinite(adjustedStability)) {
   337	      return 1;
   338	    }
   339	  }
   340	
   341	  let adjustedElapsedDays = elapsedDays;
   342	  if (!classificationDecayEnabled) {
   343	    const tierMultiplier = scheduler?.TIER_MULTIPLIER?.[tier]
   344	      ?? RETRIEVABILITY_TIER_MULTIPLIER[tier]
   345	      ?? RETRIEVABILITY_TIER_MULTIPLIER.normal;
   346	    adjustedElapsedDays = elapsedDays * tierMultiplier;
   347	  }
   348	
   349	  adjustedStability = Math.max(0.001, adjustedStability);
   350	
   351	  if (scheduler && typeof scheduler.calculateRetrievability === 'function') {
   352	    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
   353	    return Number.isFinite(score) ? score : 0;
   354	  }
   355	
   356	  // Inline FSRS power-law formula used when fsrs-scheduler module unavailable
   357	  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);
   358	  const score = Math.max(0, Math.min(1, retrievability));
   359	  return Number.isFinite(score) ? score : 0;
   360	}
   361	
   362	export const calculateTemporalScore = calculateRetrievabilityScore;
   363	
   364	/**
   365	 * T032: Calculate usage score (REQ-017 Factor 2)
   366	 * Formula: min(1.5, 1.0 + accessCount * 0.05)
   367	 * Normalized to 0-1 range for composite scoring
   368	 */
   369	export function calculateUsageScore(accessCount: number): number {
   370	  accessCount = Math.max(0, accessCount);
   371	  const count = accessCount || 0;
   372	  const usageBoost = Math.min(1.5, 1.0 + count * 0.05);
   373	  return (usageBoost - 1.0) / 0.5;
   374	}
   375	
   376	/**
   377	 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
   378	 */
   379	export function calculateImportanceScore(tier: string, baseWeight: number | undefined): number {
   380	  const tierLower = (tier || 'normal').toLowerCase();
   381	  const multiplier = IMPORTANCE_MULTIPLIERS[tierLower] || IMPORTANCE_MULTIPLIERS.normal;
   382	  const base = baseWeight ?? 0.5;
   383	
   384	  return Math.min(1, (base * multiplier) / 2.0);
   385	}
   386	
   387	/**
   388	 * T033: Calculate citation recency score (REQ-017 Factor 5)
   389	 */
   390	export function calculateCitationScore(row: ScoringInput): number {
   391	  // C2 FIX: Only use actual citation data (lastCited / last_cited).
   392	  // Never fall back to last_accessed or updated_at — those conflate
   393	  // General recency with citation recency. Uncited memories score 0.
   394	  const lastCited = (row.lastCited as string | undefined)
   395	    || (row.last_cited as string | undefined);
   396	
   397	  if (!lastCited) {
   398	    return 0;
   399	  }
   400	
   401	  const timestamp = new Date(lastCited).getTime();
   402	  if (isNaN(timestamp)) return 0; // No valid citation date → score 0
   403	
   404	  const elapsedMs = Date.now() - timestamp;
   405	  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
   406	
   407	  if (elapsedDays >= CITATION_MAX_DAYS) {
   408	    return 0;
   409	  }
   410	
   411	  return 1 / (1 + elapsedDays * CITATION_DECAY_RATE);
   412	}
   413	
   414	/**
   415	 * T034: Calculate pattern alignment score (REQ-017 Factor 4)
   416	 */
   417	export function calculatePatternScore(row: ScoringInput, options: ScoringOptions = {}): number {
   418	  let score = 0;
   419	  const query = options.query || '';
   420	  const queryLower = query.toLowerCase();
   421	
   422	  const similarity = (Number(row.similarity ?? 0) || 0) / 100;
   423	  score = similarity * 0.5;
   424	
   425	  if (row.title && typeof row.title === 'string' && queryLower) {
   426	    const titleLower = row.title.toLowerCase();
   427	    if (titleLower.includes(queryLower) || queryLower.includes(titleLower)) {
   428	      score += PATTERN_ALIGNMENT_BONUSES.exact_match;
   429	    } else {
   430	      // Partial match: check for word overlap
   431	      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
   432	      const titleWords = titleLower.split(/\s+/);
   433	      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
   434	      if (matches.length > 0 && queryWords.length > 0) {
   435	        score += PATTERN_ALIGNMENT_BONUSES.partial_match * (matches.length / queryWords.length);
   436	      }
   437	    }
   438	  }
   439	
   440	  if (row.anchors && options.anchors) {
   441	    const rowAnchors: string[] = Array.isArray(row.anchors)
   442	      ? (row.anchors as unknown[]).filter((a): a is string => typeof a === 'string')
   443	      : typeof row.anchors === 'string' ? [row.anchors] : [];
   444	    const queryAnchors: string[] = Array.isArray(options.anchors) ? options.anchors : [options.anchors];
   445	    const anchorMatches = queryAnchors.filter(qa =>
   446	      rowAnchors.some(ra => ra && qa && ra.toLowerCase().includes(qa.toLowerCase()))
   447	    );
   448	    if (anchorMatches.length > 0 && queryAnchors.length > 0) {
   449	      score += PATTERN_ALIGNMENT_BONUSES.anchor_match * (anchorMatches.length / queryAnchors.length);
   450	    }
   451	  }
   452	
   453	  if (row.memory_type && queryLower) {
   454	    const typeMap: Record<string, string[]> = {
   455	      'decision': ['why', 'decided', 'chose', 'reason'],
   456	      'blocker': ['stuck', 'blocked', 'issue', 'problem'],
   457	      'context': ['context', 'background', 'overview'],
   458	      'next-step': ['next', 'todo', 'action', 'plan'],
   459	      'insight': ['learned', 'insight', 'discovery', 'found'],
   460	    };
   461	    const intentKeywords = typeMap[row.memory_type as string] || [];
   462	    const hasTypeMatch = intentKeywords.some(kw => queryLower.includes(kw));
   463	    if (hasTypeMatch) {
   464	      score += PATTERN_ALIGNMENT_BONUSES.type_match;
   465	    }
   466	  }
   467	
   468	  if (similarity >= PATTERN_ALIGNMENT_BONUSES.semantic_threshold) {
   469	    score += (similarity - PATTERN_ALIGNMENT_BONUSES.semantic_threshold) * 0.5;
   470	  }
   471	
   472	  // Document-type pattern alignment bonus.
   473	  // Boost score when query keywords match the document type
   474	  if (queryLower && row.document_type) {
   475	    const docType = row.document_type as string;
   476	    const DOC_TYPE_QUERY_MAP: Record<string, string[]> = {
   477	      'spec': ['spec', 'specification', 'requirements', 'scope', 'what'],
   478	      'decision_record': ['decision', 'why', 'rationale', 'chose', 'alternative'],
   479	      'plan': ['plan', 'approach', 'how', 'strategy', 'phase'],
   480	      'tasks': ['task', 'todo', 'work', 'remaining', 'progress'],

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n \"trackAccess\\(|useDecay|trackAccess|calculatePopularityScore|calculateRetrievabilityScore|minState|includeArchived|is_archived\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search -g '*.ts' -g '*.js' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:188:  useDecay?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:198:  minState?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:505:    useDecay: useDecay = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:515:    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:732:    useDecay,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:733:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:741:    minState: minState ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:787:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:792:      minState: minState ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:794:      useDecay,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:83:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:447: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:452:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:459:  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:486: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:491:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:866:    includeArchived = false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:879:        includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1069:          includeArchived: options.includeArchived || false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1811:      `(is_archived IS NULL OR is_archived = 0)`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:137:  useDecay?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:141:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:461:  includeArchived: boolean,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:464:  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:606: * @param includeArchived - Whether archived memories should be included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:612:  includeArchived = false
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:615:  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:637:        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:715:         AND COALESCE(m.is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:938:      useDecay: options.useDecay !== false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:942:      includeArchived: options.includeArchived === true
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1096:    options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:40:  useDecay: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:41:  includeArchived: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:49:  minState: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:123:  useDecay,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:124:  includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:132:  minState,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:152:    useDecay,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:153:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:161:    minState,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2345:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:25:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:155: * @param options - Search options (limit, specFolder, includeArchived)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:167:  const { limit = 20, specFolder, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183:  const archivalFilter = !includeArchived
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:184:    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:383:           AND COALESCE(is_archived, 0) = 0`
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:431:         WHERE COALESCE(is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:183:    useDecay = true,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:187:    includeArchived = false
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:203:  const decay_expr = useDecay
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:218:    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:226:  if (!includeArchived) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:227:    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:292:  options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:295:  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:297:  let results = get_constitutional_memories(database, specFolder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:321:  options: { limit?: number; specFolder?: string | null; minSimilarity?: number; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:346:  const { limit = 10, specFolder = null, minSimilarity = 50, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:360:  const archival_filter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:618:  options: { limit?: number; specFolder?: string | null; includeArchived?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:621:  const { limit = 20, specFolder = null, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:642:  if (!includeArchived) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:643:    where_clause += ' AND (is_archived IS NULL OR is_archived = 0)';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:135:  includeArchived: boolean
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:137:  if (includeArchived) return results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139:    const archived = row.is_archived ?? row.isArchived;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:490:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:598:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:669:                    { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:732:                  { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:766:            { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:775:          { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:814:                { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:831:                    { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:878:            { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:896:            includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:936:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1037:            useDecay: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1112:                { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1259:            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:28:// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:843: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:936: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1195:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1198:  if (config.trackAccess) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:134:  includeArchived: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:141:  minState: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:143:  useDecay: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:152:  trackAccess: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:19://     - final contains only rows at or above config.minState priority
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:24:// 1. memoryState priority filter — rows below minState are removed
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:129: * Remove rows whose `memoryState` falls below `minState` priority and,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:137: * @param minState       - Minimum acceptable state (e.g. "WARM").
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:143:  minState: string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:146:  const normalizedMinState = normalizeStateValue(minState);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:257:    config.minState,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:293:    minState: config.minState,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:334:        minState: config.minState,

codex
I’ve got enough now to separate the two systems cleanly: Mex ages documentation by drift thresholds, while Spec Kit ages memories through multiple temporal layers: FSRS retrievability, session attention decay, state transitions, and archival. I’m pulling the last few ranking and write-back details so the recommendations are grounded in the exact runtime behavior.
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '180,260p' && printf '\\n===== NEXT =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '840,980p' && printf '\\n===== NEXT =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1188,1238p' && printf '\\n===== NEXT =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts | sed -n '129,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   180	    limit = 10,
   181	    specFolder = null,
   182	    minSimilarity = 0,
   183	    useDecay = true,
   184	    tier = null,
   185	    contextType = null,
   186	    includeConstitutional = true,
   187	    includeArchived = false
   188	  } = options;
   189	
   190	  // M9 FIX: Validate embedding dimension before querying
   191	  const expected_dim = get_embedding_dim();
   192	  if (!query_embedding || query_embedding.length !== expected_dim) {
   193	    throw new VectorIndexError(
   194	      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
   195	      VectorIndexErrorCode.EMBEDDING_VALIDATION,
   196	    );
   197	  }
   198	
   199	  const query_buffer = to_embedding_buffer(query_embedding);
   200	  const max_distance = 2 * (1 - minSimilarity / 100);
   201	
   202	  // ADR-004: FSRS-preferred decay with half-life fallback
   203	  const decay_expr = useDecay
   204	    ? `CASE
   205	         WHEN m.is_pinned = 1 THEN m.importance_weight
   206	         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
   207	           m.importance_weight * POWER(
   208	             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
   209	             -0.5
   210	           )
   211	         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
   212	       END`
   213	    : 'm.importance_weight';
   214	
   215	  let constitutional_results: MemoryRow[] = [];
   216	
   217	  if (includeConstitutional && tier !== 'constitutional') {
   218	    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
   219	  }
   220	
   221	  const where_clauses = ['m.embedding_status = \'success\''];
   222	  const params: unknown[] = [query_buffer];
   223	
   224	  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');
   225	
   226	  if (!includeArchived) {
   227	    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
   228	  }
   229	  if (tier === 'deprecated') {
   230	    where_clauses.push('m.importance_tier = ?');
   231	    params.push('deprecated');
   232	  } else if (tier === 'constitutional') {
   233	    where_clauses.push('m.importance_tier = ?');
   234	    params.push('constitutional');
   235	  } else if (tier) {
   236	    where_clauses.push('m.importance_tier = ?');
   237	    params.push(tier);
   238	  } else {
   239	    where_clauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
   240	  }
   241	
   242	  if (specFolder) {
   243	    where_clauses.push('m.spec_folder = ?');
   244	    params.push(specFolder);
   245	  }
   246	
   247	  if (contextType) {
   248	    where_clauses.push('m.context_type = ?');
   249	    params.push(contextType);
   250	  }
   251	
   252	  // M8 FIX: If constitutional results already satisfy limit, return them directly
   253	  if (constitutional_results.length >= limit) {
   254	    return constitutional_results.slice(0, limit);
   255	  }
   256	  const adjusted_limit = Math.max(1, limit - constitutional_results.length);
   257	  params.push(max_distance, adjusted_limit);
   258	
   259	  const sql = `
   260	    SELECT sub.*,

===== NEXT =====
   840	/**
   841	 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
   842	 *
   843	 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
   844	 * unintended write side-effects during read-only searches).
   845	 *
   846	 * For each result, the current retrievability R(t) is computed from the stored
   847	 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
   848	 * GRADE_GOOD update — increasing stability proportional to how much the memory
   849	 * needed the review.
   850	 *
   851	 * Errors per-row are caught and logged; they do not abort the full set.
   852	 *
   853	 * @param db      - Active SQLite database connection
   854	 * @param results - Pipeline rows that were accessed
   855	 */
   856	function applyTestingEffect(
   857	  db: Database.Database,
   858	  results: PipelineRow[]
   859	): void {
   860	  if (!db || !Array.isArray(results) || results.length === 0) return;
   861	
   862	  for (const row of results) {
   863	    try {
   864	      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
   865	      if (!lastReview) continue;
   866	
   867	      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
   868	        ? row.stability
   869	        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;
   870	
   871	      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
   872	      const currentR = fsrsScheduler.calculateRetrievability(
   873	        stability,
   874	        Math.max(0, elapsedDays)
   875	      );
   876	
   877	      strengthenOnAccess(db, row.id, currentR);
   878	    } catch (err: unknown) {
   879	      const message = err instanceof Error ? err.message : String(err);
   880	      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
   881	    }
   882	  }
   883	}
   884	
   885	function recordAdaptiveAccessSignals(
   886	  db: Database.Database,
   887	  results: PipelineRow[],
   888	  query: string | undefined
   889	): void {
   890	  if (!db || !Array.isArray(results) || results.length === 0) return;
   891	
   892	  if (getAdaptiveMode() === 'disabled') return;
   893	
   894	  ensureAdaptiveTables(db);
   895	  const insertAdaptiveSignal = db.prepare(`
   896	    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
   897	    VALUES (?, ?, ?, ?, ?, ?)
   898	  `);
   899	  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
   900	    for (const result of accessedResults) {
   901	      insertAdaptiveSignal.run(
   902	        result.id,
   903	        'access',
   904	        1.0,
   905	        query || '',
   906	        '',
   907	        '{}',
   908	      );
   909	    }
   910	  });
   911	
   912	  try {
   913	    writeAdaptiveSignals(results);
   914	  } catch (err: unknown) {
   915	    // Adaptive signal capture must never block the core search pipeline.
   916	    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
   917	  }
   918	}
   919	
   920	// -- Main Stage 2 entry point --
   921	
   922	/**
   923	 * Execute Stage 2: Fusion + Signal Integration.
   924	 *
   925	 * This is the SINGLE authoritative point where all scoring signals are
   926	 * applied. The ordering is fixed and must not be changed without updating
   927	 * the architectural documentation (see types.ts Stage2 comment block).
   928	 *
   929	 * Signal application order (13 steps):
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

===== NEXT =====
  1188	    results = populateGraphEvidence(results);
  1189	  } catch (err: unknown) {
  1190	    const message = err instanceof Error ? err.message : String(err);
  1191	    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
  1192	  }
  1193	
  1194	  // -- 3. Testing effect (FSRS write-back) --
  1195	  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  1196	  // Write-back is fire-and-forget; errors per-row are swallowed inside
  1197	  // ApplyTestingEffect so they never abort the pipeline.
  1198	  if (config.trackAccess) {
  1199	    try {
  1200	      const db = requireDb();
  1201	      applyTestingEffect(db, results);
  1202	      recordAdaptiveAccessSignals(db, results, config.query);
  1203	    } catch (err: unknown) {
  1204	      const message = err instanceof Error ? err.message : String(err);
  1205	      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
  1206	    }
  1207	  }
  1208	
  1209	  // -- 4. Intent weights --
  1210	  // G2 PREVENTION: Only apply for non-hybrid search types.
  1211	  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  1212	  // Applying it again here would double-count, causing the G2 bug.
  1213	  if (!isHybrid && config.intentWeights) {
  1214	    try {
  1215	      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
  1216	      results = weighted.map((result) =>
  1217	        typeof result.intentAdjustedScore === 'number'
  1218	          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
  1219	          : result
  1220	      );
  1221	      metadata.intentWeightsApplied = 'applied';
  1222	    } catch (err: unknown) {
  1223	      const message = err instanceof Error ? err.message : String(err);
  1224	      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
  1225	      metadata.intentWeightsApplied = 'failed';
  1226	    }
  1227	  }
  1228	
  1229	  // -- 5. Artifact routing weights --
  1230	  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
  1231	    try {
  1232	      const routed = applyArtifactRouting(results, config.artifactRouting);
  1233	      results = routed;
  1234	      metadata.artifactRoutingApplied = 'applied';
  1235	    } catch (err: unknown) {
  1236	      const message = err instanceof Error ? err.message : String(err);
  1237	      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
  1238	      metadata.artifactRoutingApplied = 'failed';

===== NEXT =====
   129	 * Remove rows whose `memoryState` falls below `minState` priority and,
   130	 * optionally, enforce per-tier result limits via `STATE_LIMITS`.
   131	 *
   132	 * IMPORTANT: This function ONLY removes items — it never reorders or
   133	 * modifies score fields. The original ordering from Stage 3 is preserved
   134	 * for all rows that survive.
   135	 *
   136	 * @param results        - Read-only rows from Stage 3 output.
   137	 * @param minState       - Minimum acceptable state (e.g. "WARM").
   138	 * @param applyStateLimits - When true, cap each tier to STATE_LIMITS[tier].
   139	 * @returns FilterResult with the surviving rows and before/after stats.
   140	 */
   141	export function filterByMemoryState(
   142	  results: Stage4ReadonlyRow[],
   143	  minState: string,
   144	  applyStateLimits: boolean,
   145	): FilterResult {
   146	  const normalizedMinState = normalizeStateValue(minState);
   147	  const minPriority = STATE_PRIORITY[normalizedMinState ?? ''] ?? UNKNOWN_STATE_PRIORITY;
   148	
   149	  // -- 3a. Tally states before filtering --
   150	  const statsBefore: StateStats = {};
   151	  for (const row of results) {
   152	    const state = normalizeStateValue(row.memoryState) ?? 'UNKNOWN';
   153	    statsBefore[state] = (statsBefore[state] ?? 0) + 1;
   154	  }
   155	
   156	  // -- 3b. State-priority filter --
   157	  let passing = results.filter(row => {
   158	    const state = resolveStateForFiltering(row);
   159	    const priority = STATE_PRIORITY[state] ?? UNKNOWN_STATE_PRIORITY;
   160	    return priority >= minPriority;
   161	  });
   162	
   163	  // -- 3c. Per-tier limits (optional) --
   164	  if (applyStateLimits) {
   165	    const tierCounters: Record<string, number> = {};
   166	    const limitPassing: Stage4ReadonlyRow[] = [];
   167	
   168	    for (const row of passing) {
   169	      const state = resolveStateForFiltering(row);
   170	      const limit = STATE_LIMITS[state] ?? Infinity;
   171	      const count = tierCounters[state] ?? 0;
   172	
   173	      if (count < limit) {
   174	        tierCounters[state] = count + 1;
   175	        limitPassing.push(row);
   176	      }
   177	      // Rows exceeding the per-tier limit are silently dropped (no score change).
   178	    }
   179	
   180	    passing = limitPassing;
   181	  }
   182	
   183	  // -- 3d. Tally states after filtering --
   184	  const statsAfter: StateStats = {};
   185	  for (const row of passing) {
   186	    const state = resolveStateForFiltering(row);
   187	    statsAfter[state] = (statsAfter[state] ?? 0) + 1;
   188	  }
   189	
   190	  return {
   191	    filtered: passing,
   192	    statsBefore,
   193	    statsAfter,
   194	    removedCount: results.length - passing.length,
   195	  };
   196	}
   197	
   198	/* ───────────────────────────────────────────────────────────────
   199	   4. INTERNAL: extractScoringValues
   200	   ──────────────────────────────────────────────────────────────── */
   201	
   202	/**
   203	 * Extract the best available numeric score from a row for evidence-gap
   204	 * analysis. Delegates to resolveEffectiveScore (canonical chain in types.ts)
   205	 * so scoring, sorting, and filtering all agree on precedence and normalization.
   206	 *
   207	 * A1 FIX: Previously used a different precedence order (rrfScore first) and
   208	 * did NOT divide similarity by 100, causing a 100x scale mismatch on rows
   209	 * that only had the similarity field set.
   210	 *
   211	 * @param row - A Stage4ReadonlyRow to inspect.
   212	 * @returns The best available numeric score clamped to [0,1], or 0.
   213	 */
   214	export function extractScoringValue(row: Stage4ReadonlyRow): number {
   215	  return resolveEffectiveScore(row as unknown as PipelineRow);
   216	}
   217	
   218	/* ───────────────────────────────────────────────────────────────
   219	   5. MAIN: executeStage4
   220	   ──────────────────────────────────────────────────────────────── */
   221	
   222	/**
   223	 * Execute Stage 4 of the 4-stage retrieval pipeline: Filter + Annotate.
   224	 *
   225	 * Stage 4 is the final pipeline stage. It removes results that fall below
   226	 * the configured minimum memory state, runs the Transparent Reasoning Module
   227	 * (TRM) evidence-gap check, attaches annotation metadata, and verifies the
   228	 * score invariant before returning.
   229	 *
   230	 * **Score invariant:** No score fields are modified in Stage 4. The compile-time
   231	 * guarantee is enforced via Stage4ReadonlyRow readonly fields; the runtime check
   232	 * via captureScoreSnapshot / verifyScoreInvariant provides defence-in-depth. If
   233	 * verifyScoreInvariant throws, it indicates a Stage 4 implementation bug.
   234	 *
   235	 * **Session dedup:** Session deduplication is intentionally NOT performed here.
   236	 * It happens after the cache layer in the main handler to avoid cache pollution.
   237	 *
   238	 * @param input - Stage4Input containing read-only results and pipeline config.
   239	 * @returns Stage4Output with filtered/annotated results and metadata.
   240	 * @throws Error if verifyScoreInvariant detects any score mutation (Stage 4 bug).

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '720,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   720	async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   721	  const result = await handleMemorySearch({
   722	    query: input,
   723	    specFolder: options.specFolder,
   724	    folderBoost: options.folderBoost,
   725	    tenantId: options.tenantId,
   726	    userId: options.userId,
   727	    agentId: options.agentId,
   728	    sharedSpaceId: options.sharedSpaceId,
   729	    limit: options.limit || 10,
   730	    includeConstitutional: true,
   731	    includeContent: options.includeContent || false,
   732	    includeTrace: options.includeTrace || false, // CHK-040
   733	    anchors: options.anchors,
   734	    sessionId: options.sessionId,
   735	    sessionTransition: options.sessionTransition,
   736	    enableDedup: options.enableDedup !== false,
   737	    profile: options.profile,
   738	    intent: intent ?? undefined,
   739	    autoDetectIntent: intent ? false : true,
   740	    useDecay: true,
   741	    // minState omitted — memoryState column not yet in schema
   742	  });
   743	
   744	  return {
   745	    strategy: 'deep',
   746	    mode: 'deep',
   747	    ...result
   748	  };
   749	}
   750	
   751	async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   752	  const result = await handleMemorySearch({
   753	    query: input,
   754	    specFolder: options.specFolder,
   755	    folderBoost: options.folderBoost,
   756	    tenantId: options.tenantId,
   757	    userId: options.userId,
   758	    agentId: options.agentId,
   759	    sharedSpaceId: options.sharedSpaceId,
   760	    limit: options.limit || 8,
   761	    includeConstitutional: true,
   762	    includeContent: options.includeContent || false,
   763	    includeTrace: options.includeTrace || false, // CHK-040
   764	    anchors: options.anchors,
   765	    sessionId: options.sessionId,
   766	    sessionTransition: options.sessionTransition,
   767	    enableDedup: options.enableDedup !== false,
   768	    profile: options.profile,
   769	    intent: intent ?? undefined,
   770	    autoDetectIntent: intent ? false : true,
   771	    useDecay: true,
   772	    // minState omitted — memoryState column not yet in schema
   773	  });
   774	
   775	  return {
   776	    strategy: 'focused',
   777	    mode: 'focused',
   778	    intent: intent,
   779	    ...result
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts | sed -n '318,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   318	  // Use effective stability from half-life.
   319	  // Math.max ensures new memories (default stability=1.0) benefit from their
   320	  // Type's configured half-life, while well-reviewed memories keep their
   321	  // Earned FSRS stability if it exceeds the type baseline.
   322	  const effectiveStability = halfLifeToStability(effectiveHalfLife);
   323	  const finalStability = Math.max(stability, effectiveStability);
   324	
   325	  const retrievability = calculateRetrievability(finalStability, elapsedDays);
   326	  const state = classifyState(retrievability, elapsedDays);
   327	
   328	  return { state, retrievability, effectiveHalfLife };
   329	}
   330	
   331	/* ───────────────────────────────────────────────────────────────
   332	   3. QUERY FUNCTIONS
   333	----------------------------------------------------------------*/
   334	
   335	/**
   336	 * Get memories filtered and classified by state.
   337	 */
   338	function getStateContent(
   339	  memories: TierInput[],
   340	  targetState: TierState,
   341	  limit: number = 20
   342	): StateContent {
   343	  const filtered = memories
   344	    .map(m => ({
   345	      ...m,
   346	      _classification: classifyTier(m),
   347	    }))
   348	    .filter(m => m._classification.state === targetState)
   349	    .slice(0, limit);
   350	
   351	  return {
   352	    state: targetState,
   353	    memories: filtered,
   354	    count: filtered.length,
   355	  };
   356	}
   357	
   358	/**
   359	 * T210: Per-tier limit map used by filterAndLimitByState.
   360	 * When applyStateLimits is true, each tier is capped to its max count.
   361	 * If a tier has fewer results than its limit, the surplus slots are
   362	 * redistributed to other tiers that have overflow (in priority order).
   363	 */
   364	const PER_TIER_LIMITS: Record<TierState, number> = {
   365	  HOT: TIER_CONFIG.maxHotMemories,
   366	  WARM: TIER_CONFIG.maxWarmMemories,
   367	  COLD: TIER_CONFIG.maxColdMemories,
   368	  DORMANT: TIER_CONFIG.maxDormantMemories,
   369	  ARCHIVED: TIER_CONFIG.maxArchivedMemories,
   370	};
   371	
   372	/** Priority order for tier overflow redistribution (highest priority first) */
   373	const TIER_PRIORITY: TierState[] = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];
   374	
   375	/**
   376	 * Filter memories by state and apply limits.
   377	 * Generic over any type assignable to TierInput so callers preserve their
   378	 * concrete element type without double-casting.
   379	 *
   380	 * T210: When no targetState is specified, enforces per-tier quantity limits
   381	 * (HOT: 5, WARM: 10, COLD: 3, DORMANT: 2, ARCHIVED: 1 by default).
   382	 * If a tier has fewer results than its limit, surplus slots are redistributed
   383	 * to other tiers in priority order to maximize total result count.
   384	 */
   385	function filterAndLimitByState<T extends TierInput>(
   386	  memories: T[],
   387	  targetState: TierState | null = null,
   388	  limit: number = 20
   389	): T[] {
   390	  type ClassifiedEntry = {
   391	    memory: T;
   392	    classification: ReturnType<typeof classifyTier>;
   393	  };
   394	  let classified: ClassifiedEntry[] = memories.map((memory) => ({
   395	    memory,
   396	    classification: classifyTier(memory),
   397	  }));
   398	
   399	  if (targetState) {
   400	    classified = classified.filter((entry) => entry.classification.state === targetState);
   401	  }
   402	
   403	  // Apply per-tier limits with overflow redistribution
   404	  if (!targetState) {
   405	    // Group by tier
   406	    const byTier: Record<TierState, typeof classified> = {
   407	      HOT: [], WARM: [], COLD: [], DORMANT: [], ARCHIVED: [],
   408	    };
   409	    for (const entry of classified) {
   410	      const state = entry.classification.state;
   411	      byTier[state].push(entry);
   412	    }
   413	
   414	    // Calculate surplus slots from under-filled tiers
   415	    let surplusSlots = 0;
   416	    for (const tier of TIER_PRIORITY) {
   417	      const tierLimit = PER_TIER_LIMITS[tier];
   418	      const available = byTier[tier].length;
   419	      if (available < tierLimit) {
   420	        surplusSlots += tierLimit - available;
   421	      }
   422	    }
   423	
   424	    // Apply limits, distributing surplus to over-filled tiers in priority order
   425	    const result: typeof classified = [];
   426	    for (const tier of TIER_PRIORITY) {
   427	      const tierLimit = PER_TIER_LIMITS[tier];
   428	      const available = byTier[tier].length;
   429	      const overflow = Math.max(0, available - tierLimit);
   430	

exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '496,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I want one more source before I synthesize: the project’s own memory index, not just the summary file. I’m querying Spec Kit Memory for any prior notes on FSRS decay, retention, or long-lived memory behavior so the recommendation lines up with earlier research rather than drifting from it.
mcp: spec_kit_memory/memory_context started
mcp: spec_kit_memory/memory_context (failed)
user cancelled MCP tool call
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && for f in \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts' \\
'.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts'; do echo \"===== "'$f ====="; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1100,1160p' && printf '\\n===== NEXT =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1450,1495p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1100	  const {
  1101	    filePath: file_path,
  1102	    force = false,
  1103	    dryRun = false,
  1104	    skipPreflight = false,
  1105	    asyncEmbedding = false,
  1106	    tenantId,
  1107	    userId,
  1108	    agentId,
  1109	    sessionId,
  1110	    sharedSpaceId,
  1111	    provenanceSource,
  1112	    provenanceActor,
  1113	    governedAt,
  1114	    retentionPolicy,
  1115	    deleteAfter,
  1116	  } = args;
  1117	
  1118	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  1119	  if (!file_path || typeof file_path !== 'string') {
  1120	    throw new Error('filePath is required and must be a string');
  1121	  }
  1122	
  1123	  await checkDatabaseUpdated();
  1124	
  1125	  const validatedPath: string = validateFilePathLocal(file_path);
  1126	  const database = requireDb();
  1127	
  1128	  if (!memoryParser.isMemoryFile(validatedPath)) {
  1129	    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
  1130	  }
  1131	
  1132	  if (typeof database.exec === 'function') {
  1133	    ensureGovernanceRuntime(database);
  1134	  }
  1135	
  1136	  const governanceDecision = validateGovernedIngest({
  1137	    tenantId,
  1138	    userId,
  1139	    agentId,
  1140	    sessionId,
  1141	    sharedSpaceId,
  1142	    provenanceSource,
  1143	    provenanceActor,
  1144	    governedAt,
  1145	    retentionPolicy,
  1146	    deleteAfter,
  1147	  });
  1148	
  1149	  if (!governanceDecision.allowed) {
  1150	    recordGovernanceAudit(database, {
  1151	      action: 'memory_save',
  1152	      decision: 'deny',
  1153	      tenantId,
  1154	      userId,
  1155	      agentId,
  1156	      sessionId,
  1157	      sharedSpaceId,
  1158	      reason: governanceDecision.reason ?? 'governance_rejected',
  1159	      metadata: { issues: governanceDecision.issues },
  1160	    });

===== NEXT =====
  1450	      });
  1451	    }
  1452	    throw error;
  1453	  }
  1454	
  1455	  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
  1456	    // B13 + H5 FIX: Wrap governance metadata in a transaction with rollback on failure.
  1457	    // If governance application fails, delete the orphaned memory row to prevent
  1458	    // persisted rows without tenant/shared-space/retention metadata.
  1459	    const applyGovernanceTx = database.transaction(() => {
  1460	      applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision));
  1461	      recordGovernanceAudit(database, {
  1462	        action: 'memory_save',
  1463	        decision: 'allow',
  1464	        memoryId: result.id,
  1465	        tenantId,
  1466	        userId,
  1467	        agentId,
  1468	        sessionId,
  1469	        sharedSpaceId,
  1470	        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
  1471	        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
  1472	      });
  1473	
  1474	      if (sharedSpaceId) {
  1475	        const existing = database.prepare(`
  1476	          SELECT id
  1477	          FROM memory_index
  1478	          WHERE shared_space_id = ?
  1479	            AND file_path = ?
  1480	            AND id != ?
  1481	          ORDER BY id DESC
  1482	          LIMIT 1
  1483	        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
  1484	        if (existing?.id) {
  1485	          recordSharedConflict(database, {
  1486	            spaceId: sharedSpaceId,
  1487	            logicalKey: `${result.specFolder || ''}::${validatedPath}`,
  1488	            existingMemoryId: existing.id,
  1489	            incomingMemoryId: result.id,
  1490	            actor: provenanceActor ?? 'mcp:memory_save',
  1491	            metadata: { filePath: validatedPath },
  1492	          });
  1493	        }
  1494	      }
  1495	    });

 succeeded in 0ms:
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts =====
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
===== .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts =====
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

codex
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Mex handles aging as freshness drift, not as forgetting or retention
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L24), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L15)
- **What it does**: Mex never archives, suppresses, or deletes stale scaffold knowledge. It only flags markdown files as stale, lowers the drift score, and pushes the operator into `mex sync` or post-commit drift review.
- **Why it matters**: Mex is a documentation freshness system, not a memory forgetting system. Its temporal model answers “is this file likely outdated?” rather than “should this memory decay, hide, or be retired?”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: The useful Mex temporal primitive is dual-axis freshness, but only as an explicit audit signal
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12)
- **What it does**: Mex combines elapsed days and commits-since-change with thresholds of `30/90` days and `50/200` commits. But git failures collapse to `null`, so missing provenance silently removes the warning instead of surfacing uncertainty.
- **Why it matters**: For long-lived memory systems, freshness should be separate from relevance. The right transplant is a visible freshness contract like `exact`, `degraded`, `unknown`, not a hidden rank penalty and not silent omission on git failure.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex turns stale knowledge into repair briefs instead of automatic rewriting
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L52), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L144)
- **What it does**: When drift is detected, Mex builds bounded repair context from the current file body, issue list, nearby filesystem contents, and recent `HEAD~5` diffs for referenced paths. The temporal signal becomes a repair trigger, not a retrieval weight.
- **Why it matters**: For persistent memory, stale items should trigger verification or repair workflows before they regain authority. “Repair before trust” is more defensible than merely decaying an outdated memory’s score.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mex’s continuity strategy is maintenance cadence, not retention policy
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L58), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L27), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L19), [watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L15)
- **What it does**: Mex relies on the GROW loop after each task plus post-commit drift checks to keep the scaffold current. New patterns are stamped with `last_updated`, but there is no deeper lifecycle beyond “update it when real work proves it changed.”
- **Why it matters**: This is a good temporal strategy for low-volume, human-readable scaffolds. It is not enough for a dense memory store where recall, hiding, strengthening, and archival need their own rules.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: Spec Kit already has the multi-layer temporal model Mex lacks, so the gap is freshness provenance rather than decay
- **Source**: [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L8), [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L5), [tier-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L37), [archival-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L192), [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L299), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L840)
- **What it does**: Spec Kit already separates time into four lanes: FSRS long-term retrievability, session-scoped working-memory decay, HOT/WARM/COLD/DORMANT/ARCHIVED state transitions, and background archival for old low-value memories. It even disables decay for resume flows and makes FSRS strengthening opt-in with `trackAccess`.
- **Why it matters**: The main missing piece is not forgetting. It is an honest freshness layer for file-backed knowledge and saved memories. Mex is useful as a freshness/check-and-repair overlay, not as a replacement for Spec Kit’s temporal engine.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.30

## Recommended Next Focus
Compare this freshness-only Mex model against Phase 003’s true FSRS-style memory lifecycle, then spec one Public-native temporal contract with four separate lanes: `freshness provenance`, `retrieval decay`, `session attention decay`, and `archival or repair`. That will keep us from collapsing “old,” “irrelevant,” and “possibly wrong” into one score.


hook: Stop
hook: Stop Completed
tokens used
206,130
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Mex handles aging as freshness drift, not as forgetting or retention
- **Source**: [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md#L24), [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L29), [watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L15)
- **What it does**: Mex never archives, suppresses, or deletes stale scaffold knowledge. It only flags markdown files as stale, lowers the drift score, and pushes the operator into `mex sync` or post-commit drift review.
- **Why it matters**: Mex is a documentation freshness system, not a memory forgetting system. Its temporal model answers “is this file likely outdated?” rather than “should this memory decay, hide, or be retired?”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: The useful Mex temporal primitive is dual-axis freshness, but only as an explicit audit signal
- **Source**: [staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts#L4), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L12)
- **What it does**: Mex combines elapsed days and commits-since-change with thresholds of `30/90` days and `50/200` commits. But git failures collapse to `null`, so missing provenance silently removes the warning instead of surfacing uncertainty.
- **Why it matters**: For long-lived memory systems, freshness should be separate from relevance. The right transplant is a visible freshness contract like `exact`, `degraded`, `unknown`, not a hidden rank penalty and not silent omission on git failure.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mex turns stale knowledge into repair briefs instead of automatic rewriting
- **Source**: [brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts#L7), [git.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts#L52), [sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts#L144)
- **What it does**: When drift is detected, Mex builds bounded repair context from the current file body, issue list, nearby filesystem contents, and recent `HEAD~5` diffs for referenced paths. The temporal signal becomes a repair trigger, not a retrieval weight.
- **Why it matters**: For persistent memory, stale items should trigger verification or repair workflows before they regain authority. “Repair before trust” is more defensible than merely decaying an outdated memory’s score.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mex’s continuity strategy is maintenance cadence, not retention policy
- **Source**: [ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md#L58), [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md#L27), [pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts#L19), [watch.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts#L15)
- **What it does**: Mex relies on the GROW loop after each task plus post-commit drift checks to keep the scaffold current. New patterns are stamped with `last_updated`, but there is no deeper lifecycle beyond “update it when real work proves it changed.”
- **Why it matters**: This is a good temporal strategy for low-volume, human-readable scaffolds. It is not enough for a dense memory store where recall, hiding, strengthening, and archival need their own rules.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: Spec Kit already has the multi-layer temporal model Mex lacks, so the gap is freshness provenance rather than decay
- **Source**: [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L8), [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L5), [tier-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L37), [archival-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L192), [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L299), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L783), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L840)
- **What it does**: Spec Kit already separates time into four lanes: FSRS long-term retrievability, session-scoped working-memory decay, HOT/WARM/COLD/DORMANT/ARCHIVED state transitions, and background archival for old low-value memories. It even disables decay for resume flows and makes FSRS strengthening opt-in with `trackAccess`.
- **Why it matters**: The main missing piece is not forgetting. It is an honest freshness layer for file-backed knowledge and saved memories. Mex is useful as a freshness/check-and-repair overlay, not as a replacement for Spec Kit’s temporal engine.
- **Recommendation**: adopt now
- **Impact**: high

## Assessment
- New information ratio: 0.30

## Recommended Next Focus
Compare this freshness-only Mex model against Phase 003’s true FSRS-style memory lifecycle, then spec one Public-native temporal contract with four separate lanes: `freshness provenance`, `retrieval decay`, `session attention decay`, and `archival or repair`. That will keep us from collapsing “old,” “irrelevant,” and “possibly wrong” into one score.
