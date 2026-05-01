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
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

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
Researching the external Mex repo directly in the pre-approved phase scope. I’m starting by validating the phase folder, doing a quick memory pass for prior drift-detection context, then reading the requested scaffold and source files in the order you specified.
exec
/bin/zsh -lc 'pwd && test -f /Users/michelkerkmeester/.codex/memories/MEMORY.md && rg -n "mex|drift|markdown scaffold|hybrid-rag-fusion|002-mex-main|staleness|codebase-knowledge synchronization" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1864ms:

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
The phase validation is still running, and I already have one useful prior-memory signal: earlier work in this repo emphasized truth-sync passes when packet docs drift from research findings. While that finishes, I’m loading the deep-research workflow guidance and the external repo structure so the architecture scan stays source-first.
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
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main -maxdepth 3 \\( -type d -o -type f \\) | sort | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
find: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mex-main: No such file or directory

codex
The phase validator didn’t return cleanly through the first poll, so I’m re-checking it with a plain command and locating the exact external repo path before going deeper. The missing path looks like a repo layout mismatch rather than a research blocker.
exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main -maxdepth 4 \\( -type d -o -type f \\) | sort | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE/bug_report.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/ISSUE_TEMPLATE/feature_request.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/pull_request_template.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/workflows
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.github/workflows/ci.yml
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.tool-configs
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/mascot/mex-mascot.svg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-check1.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/screenshots/mex-sync.jpg
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/.tool-configs
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/architecture.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/conventions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/decisions.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/setup.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/context/stack.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/INDEX.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/patterns/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/test
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/memory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/memory/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1630ms:

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
Validation passed on April 10, 2026, though the validator emitted a read-only sandbox warning about creating a temp here-doc before still reporting `RESULT: PASSED`. I’ve confirmed the external repo root is `.../002-mex-main/external`, so I’m now reading the scaffold contract and source entry points in the requested order.
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md && printf '\\n===== ROUTER =====\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md && printf '\\n===== SETUP =====\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md && printf '\\n===== SYNC =====\\n' && sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== ROUTER =====
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

===== SETUP =====
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

===== SYNC =====
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
The scaffold contract is clear now: `AGENTS.md` is a tiny always-loaded anchor, `ROUTER.md` is the real session bootstrap plus GROW loop, `SETUP.md` seeds the scaffold from a structured brief, and `SYNC.md` pushes surgical repair instead of full rewrites. Next I’m tracing the CLI and the internal module layout so the architecture map is grounded in actual entry points, not template prose.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json && printf '\\n===== CLI =====\\n' && sed -n '1,320p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== CLI =====
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
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/architecture.md && printf '\\n===== STACK =====\\n' && sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/context/stack.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
---
name: architecture
description: How the major pieces of this project connect and flow. Load when working on system design, integrations, or understanding how components interact.
triggers:
  - "architecture"
  - "system design"
  - "how does X connect to Y"
  - "integration"
  - "flow"
edges:
  - target: context/stack.md
    condition: when specific technology details are needed
  - target: context/decisions.md
    condition: when understanding why the architecture is structured this way
last_updated: [YYYY-MM-DD]
---

# Architecture

## System Overview
<!-- Describe how the major pieces connect.
     Focus on FLOW not technology — how does a request/action move through the system?
     Use the actual names of components, services, and modules from this codebase.
     Format: a simple text flow diagram or short prose description.
     Length: 5-15 lines. Minimum 5 lines. Should be readable in 30 seconds.
     Example:
     "Request comes in via Express router → validated by middleware →
     passed to service layer → service calls repository for data →
     repository queries PostgreSQL → result returned up the chain →
     formatted by serializer → sent as JSON response." -->

## Key Components
<!-- List the major components, modules, or services in this project.
     For each: name, what it does, what it depends on.
     Only include components that are non-obvious or have important constraints.
     Minimum 3 components. If you cannot identify 3, write "[TO DETERMINE]" as a placeholder.
     Length: 1-2 lines per component.
     Example:
     - **AuthService** — handles all authentication logic, depends on UserRepository and JWTLib
     - **EventBus** — async communication between services, all side effects go through here -->

## External Dependencies
<!-- Third-party services, APIs, or databases this project connects to.
     For each: what it is, what we use it for, any important constraints.
     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]" as a placeholder.
     Length: 1-2 lines per dependency.
     Example:
     - **PostgreSQL** — primary database, all writes go through the repository layer only
     - **SendGrid** — transactional email, use the EmailService wrapper, never call directly -->

## What Does NOT Exist Here
<!-- Explicit boundaries — what is deliberately outside this system.
     This prevents the agent from building things that belong elsewhere or making wrong assumptions.
     Minimum 2 items. If you cannot find 2, write "[TO DETERMINE]" as a placeholder.
     Length: 2-5 items.
     Example:
     - No background job processing — that lives in the worker service (separate repo)
     - No file storage — we use S3 directly, no abstraction layer -->

===== STACK =====
---
name: stack
description: Technology stack, library choices, and the reasoning behind them. Load when working with specific technologies or making decisions about libraries and tools.
triggers:
  - "library"
  - "package"
  - "dependency"
  - "which tool"
  - "technology"
edges:
  - target: context/decisions.md
    condition: when the reasoning behind a tech choice is needed
  - target: context/conventions.md
    condition: when understanding how to use a technology in this codebase
last_updated: [YYYY-MM-DD]
---

# Stack

## Core Technologies
<!-- List the primary language, framework, and runtime.
     For each: version if it matters, any important configuration.
     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]".
     Length: 3-7 items.
     Example:
     - **Python 3.11** — primary language
     - **FastAPI** — web framework, async by default
     - **PostgreSQL 15** — primary database -->

## Key Libraries
<!-- Libraries that are central to how this project works.
     Only include libraries where the agent needs to know: we use THIS, not the alternative.
     Include the reason over alternatives where it matters.
     Minimum 3 items. If you cannot find 3, write "[TO DETERMINE]".
     Length: 3-10 items.
     Example:
     - **SQLAlchemy** (not raw psycopg2) — ORM for all database access
     - **Pydantic v2** — data validation and serialisation, used everywhere
     - **pytest** (not unittest) — all tests use pytest style -->

## What We Deliberately Do NOT Use
<!-- Technologies or patterns explicitly avoided in this project, and why.
     This prevents the agent from introducing unwanted dependencies.
     Minimum 2 items. If you cannot find 2, write "[TO DETERMINE]".
     Length: 2-5 items.
     Example:
     - No ORM for raw analytics queries — use psycopg2 directly for performance
     - No Redux — state management is local, context API only
     - No class components — hooks only -->

## Version Constraints
<!-- Only fill this if there are important version-specific things to know.
     Leave empty if there are no meaningful version constraints.
     Example: "We are on React 17, not 18 — concurrent features are not available." -->

codex
I’ve got the top-level shape: `cli.ts` is a thin commander shell, and the real system fans into setup, scanner, drift, sync, patterns, and watch modules under `src/`. I’m switching to line-numbered reads now so the final findings can point to exact implementation paths instead of broad file summaries.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts | sed -n '1,220p' && printf '\\n===== TYPES =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== TYPES =====
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
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers -type f | sort | xargs -I{} sh -c 'echo \"===== {} =====\"; nl -ba \"{}\" | sed -n \"1,220p\"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
xargs: command line cannot be assembled, too long

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts | sed -n '1,260p' && printf '\\n===== CLAIMS =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts | sed -n '1,260p' && printf '\\n===== FRONTMATTER =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts | sed -n '1,260p' && printf '\\n===== SCORING =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== CLAIMS =====
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

===== FRONTMATTER =====
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

===== SCORING =====
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
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts

codex
I’ve finished the core drift runner and claim model. The key architectural point so far is that Mex separates three stages cleanly: extract markdown claims, run static checkers, then compute a simple score, which makes the sync layer downstream much more targeted.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts | sed -n '1,240p' && printf '\\n===== EDGES =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts | sed -n '1,240p' && printf '\\n===== INDEX-SYNC =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== EDGES =====
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

===== INDEX-SYNC =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts | sed -n '1,240p' && printf '\\n===== SCRIPT-COVERAGE =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== SCRIPT-COVERAGE =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts | sed -n '1,260p' && printf '\\n===== COMMAND =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts | sed -n '1,260p' && printf '\\n===== DEPENDENCY =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== COMMAND =====
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

===== DEPENDENCY =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts | sed -n '1,280p' && printf '\\n===== ENTRY-POINTS =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts | sed -n '1,240p' && printf '\\n===== FOLDER-TREE =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/folder-tree.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== ENTRY-POINTS =====
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

===== FOLDER-TREE =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts | sed -n '1,260p' && printf '\\n===== README-SCANNER =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/readme.ts | sed -n '1,220p' && printf '\\n===== TOOLING =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/tooling.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== README-SCANNER =====
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

===== TOOLING =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts | sed -n '1,320p' && printf '\\n===== SYNC INDEX =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts | sed -n '1,340p' && printf '\\n===== PATTERN =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== SYNC INDEX =====
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

===== PATTERN =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts | sed -n '1,260p' && printf '\\n===== MARKDOWN =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== MARKDOWN =====
     1	import { unified } from "unified";
     2	import remarkParse from "remark-parse";
     3	import remarkFrontmatter from "remark-frontmatter";
     4	import { visit } from "unist-util-visit";
     5	import YAML from "yaml";
     6	import type { ScaffoldFrontmatter } from "./types.js";
     7	import type { Root, Content } from "mdast";
     8	
     9	const parser = unified().use(remarkParse).use(remarkFrontmatter, ["yaml"]);
    10	
    11	/** Parse markdown string into AST */
    12	export function parseMarkdown(content: string): Root {
    13	  return parser.parse(content);
    14	}
    15	
    16	/** Extract YAML frontmatter from markdown content */
    17	export function extractFrontmatter(
    18	  content: string
    19	): ScaffoldFrontmatter | null {
    20	  const tree = parseMarkdown(content);
    21	  let frontmatter: ScaffoldFrontmatter | null = null;
    22	
    23	  visit(tree, "yaml", (node: { value: string }) => {
    24	    try {
    25	      frontmatter = YAML.parse(node.value) as ScaffoldFrontmatter;
    26	    } catch {
    27	      // Invalid YAML — skip
    28	    }
    29	  });
    30	
    31	  return frontmatter;
    32	}
    33	
    34	/** Get the current heading context for a given line position */
    35	export function getHeadingAtLine(
    36	  tree: Root,
    37	  line: number
    38	): string | null {
    39	  let currentHeading: string | null = null;
    40	
    41	  for (const node of tree.children) {
    42	    if (!node.position) continue;
    43	    if (node.position.start.line > line) break;
    44	    if (node.type === "heading") {
    45	      currentHeading = getTextContent(node);
    46	    }
    47	  }
    48	
    49	  return currentHeading;
    50	}
    51	
    52	/** Extract plain text from an AST node */
    53	export function getTextContent(node: Content | Root): string {
    54	  if ("value" in node && typeof node.value === "string") {
    55	    return node.value;
    56	  }
    57	  if ("children" in node) {
    58	    return (node.children as Content[]).map(getTextContent).join("");
    59	  }
    60	  return "";
    61	}
    62	
    63	/** Check if a heading or its ancestors suggest negation */
    64	export function isNegatedSection(heading: string | null): boolean {
    65	  if (!heading) return false;
    66	  const lower = heading.toLowerCase();
    67	  return (
    68	    lower.includes("not exist") ||
    69	    lower.includes("not use") ||
    70	    lower.includes("deliberately not") ||
    71	    lower.includes("excluded") ||
    72	    lower.includes("removed") ||
    73	    lower.includes("deprecated")
    74	  );
    75	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts | sed -n '1,320p' && printf '\\n===== SETUP PROMPTS =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/prompts.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== SETUP PROMPTS =====
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts | sed -n '1,280p' && printf '\\n===== REPORTER =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/reporter.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== REPORTER =====
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

codex
Mex’s internal flow is consistent end to end now: setup and init generate scaffold content from a compact scanner brief, drift turns scaffold text into typed claims plus issues, and sync consumes those issues to build file-scoped repair prompts with filesystem and git context. I’m doing one last pass on our own Public repo surfaces so the comparison section is evidence-backed instead of relying on prior knowledge.
exec
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/.gitignore
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/sync.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/tsup.config.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/update.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/visualize.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/memory/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/.gitkeep

exec
/bin/zsh -lc "rg -n \"memory_search|memory_context|memory_match_triggers|generate-context|code_graph|validate\\.sh|Spec Kit Memory|memory_index_scan|CocoIndex\" .opencode/skill/system-spec-kit .opencode/packages .opencode/src .opencode/commands .opencode/agent 2>/dev/null | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/agent/orchestrate.md:361:- `memory/` subdirectory → generated via `generate-context.js` script (never manual Write)
.opencode/agent/orchestrate.md:381:| **No Validation**             | @speckit completion claim without `validate.sh` output                                                          | REJECT → Run validation        |
.opencode/agent/orchestrate.md:390:   - Verify `validate.sh` was run (exit code in output)
.opencode/agent/orchestrate.md:571:After complex multi-agent workflows, save orchestration context via JSON mode: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-folder","sessionSummary":"..."}' specs/###-folder/`
.opencode/agent/orchestrate.md:807:If hook-injected context is present at the start of a session (injected by Claude Code SessionStart hook), use it directly as the baseline context. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information.
.opencode/agent/orchestrate.md:810:1. `memory_context({ mode: "resume", profile: "resume" })` for session recovery
.opencode/agent/orchestrate.md:811:2. `memory_match_triggers()` for constitutional/triggered context
.opencode/agent/orchestrate.md:819:| "Find code that..." / semantic discovery | CocoIndex | `mcp__cocoindex_code__search` |
.opencode/agent/orchestrate.md:820:| "What calls/imports/extends..." / structural | Code Graph | `code_graph_query`, `code_graph_context` |
.opencode/agent/orchestrate.md:821:| "Show file structure/outline" | Code Graph | `code_graph_query` (operation: outline) |
.opencode/agent/orchestrate.md:822:| Session continuity / prior decisions | Memory | `memory_search`, `memory_context` |
.opencode/agent/review.md:64:**If dispatched with a Context Package** (from @context or orchestrator): Skip Layer 1 memory checks (memory_match_triggers, memory_context, memory_search). Use provided context instead.
.opencode/agent/deep-research.md:55:3. EXECUTE RESEARCH ─> 3-5 research actions (WebFetch, Grep, Read, memory_search)
.opencode/agent/deep-research.md:108:| memory_search | Check prior research findings | Find related spec folder work |
.opencode/agent/deep-research.md:235:| `memory_search` | Find prior research in memory system |
.opencode/agent/deep-research.md:236:| `memory_context` | Load context for the research topic |
.opencode/agent/deep-research.md:440:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/agent/deep-research.md:442:Route queries by intent: CocoIndex (`mcp__cocoindex_code__search`) for semantic discovery, Code Graph (`code_graph_query`/`code_graph_context`) for structural navigation, Memory (`memory_search`/`memory_context`) for session continuity.
.opencode/agent/ultra-think.md:53:2. **PREPARE** → Load context via memory (`memory_match_triggers` → `memory_context`) and gather required file context. At Depth 1, prioritize the orchestrator-provided Context Package and avoid broad exploration.
.opencode/agent/ultra-think.md:83:| `memory_match_triggers` | Memory triggers                | Quick context surfacing in PREPARE     |
.opencode/agent/ultra-think.md:84:| `memory_context`        | Unified memory retrieval       | Deep context loading in PREPARE        |
.opencode/agent/ultra-think.md:85:| `memory_search`         | Hybrid memory search           | Finding prior decisions and patterns   |
.opencode/agent/ultra-think.md:286:- Preserve context via `memory_context` before dispatching strategies
.opencode/agent/write.md:87:**If dispatched with a Context Package** (from @context or orchestrator): Skip Layer 1 memory checks (memory_match_triggers, memory_context, memory_search). Use provided context instead.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:756:    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1243:      console.error('[context-server] Run memory_index_scan manually after model loads');
.opencode/agent/deep-review.md:104:| memory_search | Check prior research findings | Find related spec folder work |
.opencode/agent/deep-review.md:285:| `memory_search` | Find prior research in memory system |
.opencode/agent/deep-review.md:286:| `memory_context` | Load context for the review topic |
.opencode/agent/deep-review.md:570:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/agent/deep-review.md:572:Route queries by intent: CocoIndex (`mcp__cocoindex_code__search`) for semantic discovery, Code Graph (`code_graph_query`/`code_graph_context`) for structural navigation, Memory (`memory_search`/`memory_context`) for session continuity.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:3:description: All SPECKIT_* environment variables used by the Spec Kit Memory MCP server, organized by subsystem with defaults, types and source file references.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:8:> All `SPECKIT_*` environment variables for the Spec Kit Memory MCP server.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/agent/speckit.md:28:> ⛔ **EXCLUSIVITY:** @speckit is the ONLY agent permitted to create or substantively write documentation (*.md) inside spec folders. Other agents (@general, @write, etc.) MUST NOT write spec folder documentation. Exceptions: `@handover` may write `handover.md`, `@deep-research` may write `research/research.md`. Files in `memory/` (uses generate-context.js) and `scratch/` (any agent) are also excepted.
.opencode/agent/speckit.md:75:6. **VALIDATE** → Run `scripts/spec/validate.sh` to verify completeness
.opencode/agent/speckit.md:101:5. **Validate** with `validate.sh --recursive` for the entire phase tree
.opencode/agent/speckit.md:113:  ↓  (Run validate.sh --strict AFTER EACH FILE WRITE. Fix errors before proceeding to the next file.)
.opencode/agent/speckit.md:123:**If dispatched with a Context Package** (from @context or orchestrator): Skip Layer 1 memory checks (memory_match_triggers, memory_context, memory_search). Use provided context instead.
.opencode/agent/speckit.md:140:| `scripts/spec/validate.sh`               | Validate completeness   | Before claiming completion           |
.opencode/agent/speckit.md:162:| L1    | `memory_context`                                                                   | Unified entry point   |
.opencode/agent/speckit.md:163:| L2    | `memory_search`, `memory_match_triggers`, `memory_save`                            | Core operations       |
.opencode/agent/speckit.md:168:| L7    | `memory_index_scan`, `memory_get_learning_history`                                 | Maintenance           |
.opencode/agent/speckit.md:170:> **memory_context modes:** `auto` (default, detects intent), `quick` (trigger-based), `deep` (comprehensive), `focused` (intent-optimized), `resume` (session recovery).
.opencode/agent/speckit.md:240:- Run `validate.sh` before claiming completion
.opencode/agent/speckit.md:241:- Run `scripts/spec/validate.sh [SPEC_FOLDER] --strict` immediately after each spec-doc write or update; if it fails, repair template drift before continuing
.opencode/agent/speckit.md:328:4. Run `scripts/spec/validate.sh [SPEC_FOLDER] --strict` before moving to the next workflow step.
.opencode/agent/speckit.md:417:- `validate.sh` exit code: [0|1|2]
.opencode/agent/speckit.md:471:□ validate.sh --strict run after each file write (exit code 0 or 1 to proceed)
.opencode/agent/speckit.md:491:2. Run verification checks (Glob + validate.sh)
.opencode/agent/speckit.md:500:2. **Validation output** — `validate.sh` exit code + error/warning counts
.opencode/agent/speckit.md:511:- **Validation:** `validate.sh` exit code [0|1|2], [actual output summary]
.opencode/agent/speckit.md:524:❌ **Never skip validation** — Run `validate.sh` before ANY completion claim. Validation catches missing files and incomplete sections.
.opencode/agent/speckit.md:539:1. Run: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER> --strict`
.opencode/agent/speckit.md:585:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/agent/speckit.md:587:Route queries by intent: CocoIndex (`mcp__cocoindex_code__search`) for semantic discovery, Code Graph (`code_graph_query`/`code_graph_context`) for structural navigation, Memory (`memory_search`/`memory_context`) for session continuity.
.opencode/agent/context.md:46:2. **MEMORY FIRST** → Check memory before codebase (memory_match_triggers → memory_context → memory_search)
.opencode/agent/context.md:47:3. **GRAPH HEALTH** → Call `code_graph_status()` once per session before structural exploration so the agent knows whether code graph tools are usable or whether CocoIndex/filesystem fallbacks are required
.opencode/agent/context.md:48:4. **CODEBASE SCAN** → Prefer `code_graph_query` / `code_graph_context` for structural questions, then CocoIndex, Glob, Grep, and Read as needed
.opencode/agent/context.md:65:| `CocoIndex search`      | Semantic    | Concept-based code discovery | Find code by intent, not exact text |
.opencode/agent/context.md:68:| `memory_match_triggers` | Memory (L2) | Trigger phrase matching   | Quick context surfacing (Layer 1)    |
.opencode/agent/context.md:69:| `memory_context`        | Memory (L1) | Unified context retrieval | Intent-aware routing (Layer 1/3)     |
.opencode/agent/context.md:70:| `memory_search`         | Memory (L2) | 3-channel hybrid search (Vector, BM25, FTS5) with RRF fusion | Deep memory retrieval (Layer 3) |
.opencode/agent/context.md:71:| `code_graph_status`     | Structure   | Code graph health check   | First session probe before structural retrieval |
.opencode/agent/context.md:72:| `code_graph_query`      | Structure   | Graph traversal           | Structural questions: calls, imports, impact |
.opencode/agent/context.md:73:| `code_graph_context`    | Structure   | Compact graph context     | Neighborhood/outline context around structural seeds |
.opencode/agent/context.md:89:    │   └─► CocoIndex search → find code by meaning
.opencode/agent/context.md:95:    │   └─► memory_match_triggers → memory_search
.opencode/agent/context.md:98:    │   └─► memory_context → unified retrieval
.opencode/agent/context.md:121:**Tool Sequence**: `memory_match_triggers` → `memory_context(deep)` → `code_graph_status()` → `memory_search(includeContent)` → `code_graph_query/context` for structural questions → `CocoIndex search` (1-3 concept queries) → `Glob` (5-10 patterns) → `Grep` (3-5 patterns) → `Read` (5-8 key files) → spec folder analysis → `memory_list(specFolder)`
.opencode/agent/context.md:135:**Tools**: `memory_match_triggers`, `memory_context`
.opencode/agent/context.md:140:- Run `memory_match_triggers(prompt)` — match user's request against stored trigger phrases, returns matching memories with relevance scores
.opencode/agent/context.md:141:- Run `memory_context({ input: topic, mode: "deep" })` — intent-aware context retrieval, returns relevant context ranked by importance
.opencode/agent/context.md:147:**Tools**: `code_graph_status`, `code_graph_query`, `code_graph_context`, `Glob`, `Grep`, `Read`
.opencode/agent/context.md:150:- **Code graph** — Run `code_graph_status()` once per session, then use `code_graph_query` / `code_graph_context` for structural questions when the index is healthy.
.opencode/agent/context.md:151:- **CocoIndex** — Semantic search for concept-based discovery. Use 1-3 short queries (3-5 words). Examples: `ccc search "authentication middleware"`, `ccc search "error handling patterns"`. Set `refresh_index=false` after first query.
.opencode/agent/context.md:160:**Tools**: `memory_search`, `memory_context (deep)`, `memory_list`
.opencode/agent/context.md:163:- `memory_search({ query: topic, includeContent: true })` — 3-channel hybrid search (Vector, BM25, FTS5) with RRF fusion across all memories with full content
.opencode/agent/context.md:164:- `memory_context({ input: topic, mode: "deep" })` — comprehensive retrieval with full analysis, ranked intent-aware results
.opencode/agent/context.md:361:When the query intent is semantic (find code by concept, understand implementations, discover patterns), ALWAYS try CocoIndex FIRST before falling back to Grep/Glob:
.opencode/agent/context.md:364:2. Only if CocoIndex unavailable or returns no results → fall back to Grep/Glob
.opencode/agent/context.md:365:3. **Structural queries** ("what calls...", "what imports...") → `code_graph_query` / `code_graph_context`
.opencode/agent/context.md:387:### Memory Tools (Spec Kit Memory MCP)
.opencode/agent/context.md:391:| `memory_context`        | L1    | Unified entry point for context retrieval |
.opencode/agent/context.md:392:| `memory_match_triggers` | L2    | Fast trigger phrase matching              |
.opencode/agent/context.md:393:| `memory_search`         | L2    | 3-channel hybrid search (Vector, BM25, FTS5) with RRF fusion |
.opencode/agent/context.md:408:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/agent/context.md:410:Route queries by intent: CocoIndex (`mcp__cocoindex_code__search`) for semantic discovery, Code Graph (`code_graph_query`/`code_graph_context`) for structural navigation, Memory (`memory_search`/`memory_context`) for session continuity.
.opencode/agent/context.md:427:│  ├─► Layer 1: memory_match_triggers and memory_context                  │
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/agent/debug.md:99:**If dispatched with a Context Package** (from @context or orchestrator): Skip Layer 1 memory checks (memory_match_triggers, memory_context, memory_search). Use provided context instead.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:30:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:108:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:291:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:421:  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:486:  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental'],
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
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562:  name: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:624:  name: 'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:657:  name: 'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:663:  name: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:681:            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:682:            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:683:            score: { type: 'number', description: 'CocoIndex relevance score' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:688:        description: 'Seeds from CocoIndex, manual input, or graph lookups',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:700:  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:706:  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:718:  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:747:      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:927:  // L8: CocoIndex
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/cli.ts:104:spec-kit-cli — Bulk database operations for Spec Kit Memory
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1:# Spec Kit Memory MCP Server: Installation Guide
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:16:I want to install Spec Kit Memory MCP server from .opencode/skill/system-spec-kit/mcp_server
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:32:- Install Spec Kit Memory dependencies
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:60:Spec Kit Memory is an MCP (Model Context Protocol) server that gives AI assistants semantic memory and context retrieval. It indexes markdown documentation and conversation memories to surface relevant information during AI interactions.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:75:│              Spec Kit Memory MCP Server (Node.js)               │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120:- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:126:- `code_graph_query` and `code_graph_context` may repair small stale deltas inline
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:127:- empty or broadly stale graphs still require explicit `code_graph_scan`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:273:Phase 4 connects Spec Kit Memory to your AI assistant.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:430:- `memory_index_scan` (bulk indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:432:- `code_graph_scan` (structural code indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:433:- `code_graph_query` (structural relationship queries)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:434:- `code_graph_status` (graph health check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:435:- `code_graph_context` (LLM-oriented graph neighborhoods)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:490:# This calls memory_index_scan() internally
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:524:The server supports phase folders for multi-phase spec work. Phase folders follow the pattern `specs/NNN-name/001-phase/`. Use the `--recursive` flag in `validate.sh` to validate all phases in a spec folder at once. The `recommend-level.sh` script applies phase detection scoring automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:567:### memory_index_scan: Bulk Indexing
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:569:`memory_index_scan()` scans the workspace for new or changed memory files and indexes them.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:706:1. AI calls `memory_index_scan({ force: false })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:774:bash .opencode/skill/system-spec-kit/scripts/validate.sh \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:790:| Server starts but returns no memories | No indexed memories yet, or embeddings are pending | Run `memory_index_scan({ force: true })` via your AI |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:863:Recovery: ask your AI "Index all memory files" (calls `memory_index_scan({ force: true })`). Restart your MCP client after manual database operations.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:970:This calls `memory_index_scan({ force: true })` to repopulate the search index from the restored database.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:987:| `.opencode/skill/system-spec-kit/scripts/validate.sh` | Spec folder validator (supports --recursive) |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1027:bash .opencode/skill/system-spec-kit/scripts/validate.sh specs/NNN-name --recursive
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1040:PHASE VALID:  bash scripts/validate.sh specs/NNN-name --recursive
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:29:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:65:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:88:    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/assets/template_mapping.md:179:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:201:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:223:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:245:    └── *.md                     (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/assets/template_mapping.md:322:**Generation:** Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/` to auto-generate properly formatted memory files.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:48:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148:/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:153:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:157:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:180:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:195:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:271:              'mcp:memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:312:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:631:    tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:671:const handle_memory_index_scan = handleMemoryIndexScan;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:680:  handle_memory_index_scan,
.opencode/skill/system-spec-kit/mcp_server/README.md:2:title: "Spec Kit Memory - MCP Server"
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:15:# Spec Kit Memory - MCP Server
.opencode/skill/system-spec-kit/mcp_server/README.md:47:Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.
.opencode/skill/system-spec-kit/mcp_server/README.md:55:| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
.opencode/skill/system-spec-kit/mcp_server/README.md:56:| **Search channels** | 5 core + CocoIndex bridge | Vector, FTS5, BM25, Causal Graph, Degree (+ CocoIndex semantic code search as external bridge) |
.opencode/skill/system-spec-kit/mcp_server/README.md:67:| Capability | Basic RAG | Spec Kit Memory |
.opencode/skill/system-spec-kit/mcp_server/README.md:69:| **Search** | Vector similarity only | 5 core channels + CocoIndex bridge, fused with Reciprocal Rank Fusion (K tuned per intent) |
.opencode/skill/system-spec-kit/mcp_server/README.md:70:| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:227:**Five core search channels** work together, with **CocoIndex** available as an external semantic code search bridge:
.opencode/skill/system-spec-kit/mcp_server/README.md:236:| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
.opencode/skill/system-spec-kit/mcp_server/README.md:238:**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/README.md:266:**Stage 1 -- Gather candidates** using graph-first routing: structural queries dispatch to Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline's active channels in parallel. Constitutional-tier memories are always injected regardless of score.
.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/README.md:539:**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '45,90p' && printf '\\n===== MCP README SEARCH =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '227,280p' && printf '\\n===== MCP README ARCH =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '530,545p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    45	Your AI assistant has amnesia. Every conversation starts from scratch. You explain your project architecture on Monday and by Wednesday it is a blank slate. This server fixes that.
    46	
    47	Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.
    48	
    49	The server works across sessions, models and tools. Switch from Claude to GPT to Gemini and back. The memory stays the same because it lives in a database on your machine, not inside any AI's context window.
    50	
    51	### Key Numbers
    52	
    53	| What | Count | Details |
    54	|------|-------|---------|
    55	| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
    56	| **Search channels** | 5 core + CocoIndex bridge | Vector, FTS5, BM25, Causal Graph, Degree (+ CocoIndex semantic code search as external bridge) |
    57	| **Pipeline stages** | 4 | Gather (graph-first routing), Score, Rerank, Filter |
    58	| **Importance tiers** | 6 | constitutional, critical, important, normal, temporary, deprecated |
    59	| **Memory states** | 5 | HOT, WARM, COLD, DORMANT, ARCHIVED |
    60	| **Intent types** | 7 | add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |
    61	| **Causal relations** | 6 | caused, enabled, supersedes, contradicts, derived_from, supports |
    62	| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
    63	| **Embedding providers** | 3 | Voyage AI, OpenAI, HuggingFace local |
    64	
    65	### How This Compares to Basic RAG
    66	
    67	| Capability | Basic RAG | Spec Kit Memory |
    68	|------------|-----------|-----------------|
    69	| **Search** | Vector similarity only | 5 core channels + CocoIndex bridge, fused with Reciprocal Rank Fusion (K tuned per intent) |
    70	| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
    71	| **"Why" queries** | Not possible | Causal graph with 6 relationship types, community detection and depth signals |
    72	| **Forgetting curve** | None or exponential | FSRS power-law decay with classification-aware 2D matrix (context type x importance tier) |
    73	| **Query understanding** | Keyword match | Intent classification (7 types), complexity routing, query decomposition |
    74	| **Sessions** | Stateless | Working memory with attention decay, ~50% token savings via deduplication |
    75	| **Section retrieval** | Returns full documents | ANCHOR-based chunking with ~93% token savings |
    76	| **Duplicate handling** | Indexes everything | 4-outcome Prediction Error gating (create, reinforce, update, supersede) |
    77	| **Memory state** | Everything treated equally | 5-state cognitive lifecycle (HOT through ARCHIVED) with FSRS-driven transitions |
    78	| **Save quality** | Accept everything | 3-layer gate (structure, semantic sufficiency, duplicate) with dry-run preview |
    79	| **Explainability** | Black box | Confidence scoring (high/medium/low) + two-tier trace (basic and debug) |
    80	| **Access control** | None | Shared spaces with deny-by-default membership and kill switches |
    81	| **Evaluation** | Manual testing | Ablation studies, 12-metric computation (MRR, NDCG), synthetic ground truth corpus |
    82	
    83	### How You Use It
    84	
    85	The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
    86	
    87	| Command | What It Does | Tool Count |
    88	|---------|-------------|------------|
    89	| `/memory:search` | Search, retrieve and analyze knowledge | 13 tools |
    90	| `/memory:learn` | Create always-surface rules (constitutional memories) | 6 tools |

===== MCP README SEARCH =====
   227	**Five core search channels** work together, with **CocoIndex** available as an external semantic code search bridge:
   228	
   229	| Channel | How It Works | Good For |
   230	|---------|-------------|----------|
   231	| **Vector** | Compares the meaning of your query against stored embeddings | Finding related content even when the words are different |
   232	| **FTS5** | Full-text search on exact words and phrases | Looking up specific terms or error messages |
   233	| **BM25** | Keyword relevance scoring (like a search engine) | Ranking results when you know roughly what you want |
   234	| **Causal Graph** | Follows causal links between memories | "Why did we choose this?" questions |
   235	| **Degree** | Scores memories by graph connectivity, weighted by edge type (`caused`=1.0, `enabled`=0.75, `supports`=0.5) | Finding important hub memories (capped to prevent over-influence) |
   236	| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
   237	
   238	**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
   239	
   240	**Reciprocal Rank Fusion (RRF)** combines all channel results using the formula `1/(K + rank)`. The K parameter is tuned per query intent through sensitivity analysis across K values {10, 20, 40, 60, 80, 100, 120}. A memory that scores well in multiple channels rises to the top because RRF gives exponential weight to high-ranking items while still including lower-ranked contributions.
   241	
   242	**Channel min-representation** guarantees every active channel gets at least one result in the final set, preventing a single dominant channel from drowning out useful evidence.
   243	
   244	**Quality-aware 3-tier fallback** activates when graph and semantic channels miss:
   245	
   246	| Fallback Tier | Channel | When It Kicks In |
   247	|---------------|---------|------------------|
   248	| Tier 1 | FTS5 full-text search | Graph and semantic channels return weak results |
   249	| Tier 2 | BM25 keyword scoring | FTS5 results below confidence floor |
   250	| Tier 3 | Grep/Glob filesystem search | Still poor results after BM25 |
   251	
   252	**Confidence truncation** cuts off results at 2x the median score gap so you never get a long tail of irrelevant items.
   253	
   254	**Evidence gap detection** (TRM Z-score) flags when retrieved memories do not adequately cover the query and suggests broadening the search.
   255	
   256	**Calibrated overlap bonus** rewards memories found by multiple channels at once. The bonus scales based on how many channels found the result and how confidently they scored it, rather than applying a flat bonus.
   257	
   258	**Tool-level TTL cache** remembers recent results for 60 seconds. When you save, update or delete a memory, the cache for affected searches clears automatically. You never see stale results.
   259	
   260	---
   261	
   262	#### 3.1.2 SEARCH PIPELINE
   263	
   264	Every search goes through four stages. Each stage has one clear job and cannot change results from earlier stages.
   265	
   266	**Stage 1 -- Gather candidates** using graph-first routing: structural queries dispatch to Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline's active channels in parallel. Constitutional-tier memories are always injected regardless of score.
   267	
   268	**Stage 2 -- Score and fuse** using RRF plus eight post-fusion scoring signals:
   269	
   270	| Signal | What It Does | Magnitude |
   271	|--------|-------------|-----------|
   272	| Co-activation boost | Memories co-occurring with matched results get a lift. Fan-effect divisor `1/sqrt(neighbors)` prevents hubs from dominating | +0.25 |
   273	| FSRS decay | Adjusts score by memory retrievability `R(t,S)`. Recently accessed memories score higher | multiplicative |
   274	| Interference penalty | Suppresses clusters of near-identical memories (>0.75 Jaccard similarity) | -0.08 per neighbor |
   275	| Cold-start boost | Fresh memories (<48h) get `0.15 * exp(-elapsed/12)`, 12h half-life, capped at 0.95 | +0.15 max |
   276	| Session recency | Memories accessed in the current session get a recency bump | cap 0.20 |
   277	| Causal 2-hop | Memories 1-2 hops from retrieved causal neighbors get a contextual boost | variable |
   278	| Intent weights | Each of the 7 task intents has its own channel weight profile | variable |
   279	| Channel min-rep | Floor ensures each active channel has at least one result in the fused set | 0.005 |
   280	

===== MCP README ARCH =====
   530	
   531	#### 3.1.13 CODE GRAPH
   532	
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,220p' && printf '\\n===== VALIDATE =====\\n' && nl -ba .opencode/skill/system-spec-kit/scripts/spec/validate.sh | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== VALIDATE =====
     1	#!/usr/bin/env bash
     2	# ───────────────────────────────────────────────────────────────
     3	# COMPONENT: Validate Spec
     4	# ───────────────────────────────────────────────────────────────
     5	# Spec Folder Validation Orchestrator - Bash 3.2+ compatible
     6	
     7	# Strict mode with guarded dynamic expansions.
     8	set -euo pipefail
     9	
    10	# ───────────────────────────────────────────────────────────────
    11	# 1. CONFIGURATION
    12	# ───────────────────────────────────────────────────────────────
    13	
    14	# Feature flag: Skip validation if SPECKIT_SKIP_VALIDATION is set
    15	if [[ -n "${SPECKIT_SKIP_VALIDATION:-}" ]]; then
    16	    echo "Validation skipped (SPECKIT_SKIP_VALIDATION=${SPECKIT_SKIP_VALIDATION})" >&2
    17	    exit 0
    18	fi
    19	
    20	SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    21	readonly RULES_DIR="$SCRIPT_DIR/../rules"
    22	readonly VERSION="2.0.0"
    23	
    24	# Source shared libraries
    25	source "${SCRIPT_DIR}/../lib/shell-common.sh"
    26	
    27	# ───────────────────────────────────────────────────────────────
    28	# 2. STATE & GLOBALS
    29	# ───────────────────────────────────────────────────────────────
    30	
    31	# State
    32	FOLDER_PATH="" DETECTED_LEVEL=1 LEVEL_METHOD="inferred" CONFIG_FILE_PATH=""
    33	JSON_MODE=false STRICT_MODE=false VERBOSE=false QUIET_MODE=false RECURSIVE=false RECURSIVE_OPT_OUT=false
    34	ERRORS=0 WARNINGS=0 INFOS=0 RESULTS=""
    35	PHASE_RESULTS="" PHASE_COUNT=0
    36	
    37	# Rule execution order (empty = alphabetical)
    38	RULE_ORDER=()
    39	
    40	# ───────────────────────────────────────────────────────────────
    41	# 3. UTILITY FUNCTIONS
    42	# ───────────────────────────────────────────────────────────────
    43	
    44	# Timing helper - get current time in milliseconds
    45	get_time_ms() {
    46	    # Try nanoseconds first (Linux), then Python, then seconds only (macOS fallback)
    47	    # P1-01 FIX: macOS date +%s%N outputs literal "N" (e.g. "1234567890N") instead of erroring.
    48	    # Must verify the output contains only digits AND is long enough to be nanoseconds.
    49	    local ns
    50	    ns=$(date +%s%N 2>/dev/null)
    51	    if [[ "$ns" =~ ^[0-9]+$ ]] && [[ ${#ns} -gt 10 ]]; then
    52	        echo $(( ns / 1000000 ))
    53	    elif command -v python3 >/dev/null 2>&1; then
    54	        python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || echo $(( $(date +%s) * 1000 ))
    55	    else
    56	        echo $(( $(date +%s) * 1000 ))
    57	    fi
    58	}
    59	
    60	# Colors (disabled for non-TTY)
    61	if [[ -t 1 ]]; then
    62	    RED='\033[0;31m' GREEN='\033[0;32m' YELLOW='\033[1;33m' BLUE='\033[0;34m' BOLD='\033[1m' NC='\033[0m'
    63	else
    64	    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
    65	fi
    66	
    67	# Rule severity defaults (bash 3.2 compatible)
    68	RULE_SEVERITY_FILE_EXISTS="error" RULE_SEVERITY_FILES="error"
    69	RULE_SEVERITY_PLACEHOLDER_FILLED="error" RULE_SEVERITY_PLACEHOLDERS="error"
    70	RULE_SEVERITY_SECTIONS_PRESENT="warn" RULE_SEVERITY_SECTIONS="warn"
    71	RULE_SEVERITY_LEVEL_DECLARED="info" RULE_SEVERITY_LEVEL="info"
    72	RULE_SEVERITY_PRIORITY_TAGS="warn" RULE_SEVERITY_EVIDENCE_CITED="warn"
    73	RULE_SEVERITY_ANCHORS_VALID="error" RULE_SEVERITY_ANCHORS="error"
    74	RULE_SEVERITY_EVIDENCE="warn" RULE_SEVERITY_PRIORITY="warn"
    75	
    76	# ───────────────────────────────────────────────────────────────
    77	# 4. HELP & ARGUMENT PARSING
    78	# ───────────────────────────────────────────────────────────────
    79	
    80	show_help() { cat << 'EOF'
    81	validate-spec.sh - Spec Folder Validation Orchestrator (v2.0)
    82	
    83	USAGE: ./validate-spec.sh <folder-path> [OPTIONS]
    84	
    85	OPTIONS:
    86	    --help, -h     Show help     --version, -v  Show version
    87	    --json         JSON output   --strict       Warnings as errors
    88	    --verbose      Detailed      --quiet, -q    Results only
    89	    --recursive    Validate parent + all [0-9][0-9][0-9]-*/ child phase folders
    90	    --no-recursive Disable auto-recursive validation when phase children exist
    91	
    92	EXIT CODES: 0=pass, 1=warnings, 2=errors
    93	
    94	RULES: FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, LEVEL_DECLARED,
    95	       PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID, TOC_POLICY, PHASE_LINKS,
    96	       SPEC_DOC_INTEGRITY
    97	
    98	LEVELS: 1=spec+plan+tasks+impl-summary*, 2=+checklist, 3=+decision-record
    99	        *impl-summary required after tasks completed
   100	EOF
   101	exit 0; }
   102	
   103	parse_args() {
   104	    while [[ $# -gt 0 ]]; do
   105	        case "$1" in
   106	            --help|-h) show_help ;;
   107	            --version|-v) echo "validate-spec.sh version $VERSION"; exit 0 ;;
   108	            --json) JSON_MODE=true; shift ;;
   109	            --strict) STRICT_MODE=true; shift ;;
   110	            --verbose) VERBOSE=true; shift ;;
   111	            --quiet|-q) QUIET_MODE=true; shift ;;
   112	            --recursive) RECURSIVE=true; shift ;;
   113	            --no-recursive) RECURSIVE=false; RECURSIVE_OPT_OUT=true; shift ;;
   114	            -*) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;
   115	            *) [[ -z "$FOLDER_PATH" ]] && FOLDER_PATH="$1" || { echo "ERROR: Multiple paths" >&2; exit 2; }; shift ;;
   116	        esac
   117	    done
   118	    [[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }
   119	    FOLDER_PATH="${FOLDER_PATH%/}"
   120	    [[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }
   121	    return 0
   122	}
   123	
   124	# ───────────────────────────────────────────────────────────────
   125	# 5. CONFIGURATION LOADING
   126	# ───────────────────────────────────────────────────────────────
   127	
   128	has_phase_children() {
   129	    local parent_folder="$1"
   130	    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
   131	        if [[ -d "$phase_dir" ]]; then
   132	            return 0
   133	        fi
   134	    done
   135	    return 1
   136	}
   137	
   138	apply_env_overrides() {
   139	    [[ "${SPECKIT_VALIDATION:-}" == "false" ]] && { echo "Validation disabled"; exit 0; }
   140	    [[ "${SPECKIT_STRICT:-}" == "true" ]] && STRICT_MODE=true
   141	    [[ "${SPECKIT_VERBOSE:-}" == "true" ]] && VERBOSE=true
   142	    [[ "${SPECKIT_JSON:-}" == "true" ]] && JSON_MODE=true
   143	    [[ "${SPECKIT_QUIET:-}" == "true" ]] && QUIET_MODE=true
   144	    # SPECKIT_RULES: comma-separated rule subset (e.g., "FILE_EXISTS,LEVEL_DECLARED")
   145	    # Used by pre-commit hook for fast 6-rule validation
   146	    if [[ -n "${SPECKIT_RULES:-}" ]]; then
   147	        RULE_ORDER=()
   148	        IFS=',' read -ra _rules <<< "$SPECKIT_RULES"
   149	        for _r in "${_rules[@]}"; do
   150	            local _canonical
   151	            _canonical=$(canonicalize_rule_name "$_r")
   152	            if [[ -n "$_canonical" ]]; then
   153	                RULE_ORDER+=("$_canonical")
   154	            else
   155	                echo "Warning: Unrecognized SPECKIT_RULES entry: '$_r'" >&2
   156	            fi
   157	        done
   158	        unset _rules _r _canonical
   159	    fi
   160	    return 0
   161	}
   162	
   163	load_config() {
   164	    local folder="${1:-.}"
   165	    [[ -f "$folder/.speckit.yaml" ]] && { CONFIG_FILE_PATH="$folder/.speckit.yaml"; }
   166	    if [[ -z "$CONFIG_FILE_PATH" ]]; then
   167	        local root; root=$(git rev-parse --show-toplevel 2>/dev/null) || root="$(pwd)"
   168	        [[ -f "$root/.speckit.yaml" ]] && CONFIG_FILE_PATH="$root/.speckit.yaml"
   169	    fi
   170	    # Parse rule order if config exists
   171	    if [[ -n "$CONFIG_FILE_PATH" && -f "$CONFIG_FILE_PATH" ]]; then
   172	        local rule_order_str=""
   173	        if command -v yq >/dev/null 2>&1; then
   174	            rule_order_str=$(yq -r '.validation.rule_order[]? // empty' "$CONFIG_FILE_PATH" 2>/dev/null || true)
   175	            [[ -z "$rule_order_str" ]] && rule_order_str=$(yq -r '.rule_order[]? // empty' "$CONFIG_FILE_PATH" 2>/dev/null || true)
   176	        else
   177	            # Fallback: simple grep for rule_order entries
   178	            local in_order=false
   179	            while IFS= read -r line; do
   180	                if [[ "$line" =~ ^[[:space:]]*rule_order: ]]; then
   181	                    in_order=true; continue
   182	                elif $in_order && [[ "$line" =~ ^[[:space:]]*[A-Za-z0-9_]+: ]]; then
   183	                    break
   184	                fi
   185	                if $in_order && [[ "$line" =~ ^[[:space:]]+-[[:space:]]+([A-Za-z0-9_-]+) ]]; then
   186	                    rule_order_str+="${BASH_REMATCH[1]}"$'\n'
   187	                fi
   188	            done < "$CONFIG_FILE_PATH"
   189	        fi
   190	        if [[ -n "$rule_order_str" ]]; then
   191	            RULE_ORDER=()
   192	            while IFS= read -r rule; do
   193	                local canonical_rule
   194	                canonical_rule=$(canonicalize_rule_name "$rule")
   195	                [[ -n "$canonical_rule" ]] && RULE_ORDER+=("$canonical_rule")
   196	            done <<< "$rule_order_str"
   197	        fi
   198	    fi
   199	    return 0
   200	}
   201	
   202	# Template hash validation - checks if spec files match original templates
   203	# This is informational only; modifications are expected and not failures
   204	validate_template_hashes() {
   205	    local folder="$1"
   206	    local hash_file="$SCRIPT_DIR/../../templates/.hashes"
   207	    
   208	    # No hash file means skip validation
   209	    [[ ! -f "$hash_file" ]] && return 0
   210	    
   211	    while IFS='=' read -r template expected_hash; do
   212	        # Skip empty lines and comments
   213	        [[ -z "$template" || "$template" =~ ^# ]] && continue
   214	        
   215	        local actual_file="$folder/$template"
   216	        if [[ -f "$actual_file" ]]; then
   217	            # Calculate hash (macOS uses md5, Linux uses md5sum)
   218	            local actual_hash
   219	            if command -v md5 >/dev/null 2>&1; then
   220	                actual_hash=$(md5 -q "$actual_file" 2>/dev/null)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '42,65p' && printf '\\n===== QUICK SEARCH =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '190,215p' && printf '\\n===== MATCH TRIGGERS =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '211,235p' && printf '\\n===== CODE GRAPH =====\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '624,668p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    42	  name: 'memory_context',
    43	  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    44	  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
    45	};
    46	
    47	// L2: Core - Primary operations (Token Budget: 3500)
    48	const memorySearch: ToolDefinition = {
    49	  name: 'memory_search',
    50	  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    51	  inputSchema: {
    52	    type: 'object',
    53	    additionalProperties: false,
    54	    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    55	    properties: {
    56	      cursor: {
    57	        type: 'string',
    58	        minLength: 1,
    59	        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
    60	      },
    61	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
    62	      concepts: {
    63	        type: 'array',
    64	        items: { type: 'string', minLength: 1 },
    65	        minItems: 2,

===== QUICK SEARCH =====
   190	// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
   191	const memoryQuickSearch: ToolDefinition = {
   192	  name: 'memory_quick_search',
   193	  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
   194	  inputSchema: {
   195	    type: 'object',
   196	    additionalProperties: false,
   197	    properties: {
   198	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
   199	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
   200	      specFolder: { type: 'string', description: 'Restrict to spec folder' },
   201	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
   202	      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
   203	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
   204	      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
   205	    },
   206	    required: ['query'],
   207	  },
   208	};
   209	
   210	const memoryMatchTriggers: ToolDefinition = {
   211	  name: 'memory_match_triggers',
   212	  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
   213	  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
   214	};
   215	

===== MATCH TRIGGERS =====
   211	  name: 'memory_match_triggers',
   212	  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
   213	  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
   214	};
   215	
   216	// T306: Added asyncEmbedding parameter for non-blocking embedding generation
   217	const memorySave: ToolDefinition = {
   218	  name: 'memory_save',
   219	  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
   220	  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
   221	};
   222	
   223	// L3: Discovery - Browse and explore (Token Budget: 800)
   224	const memoryList: ToolDefinition = {
   225	  name: 'memory_list',
   226	  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
   227	  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
   228	};
   229	
   230	const memoryStats: ToolDefinition = {
   231	  name: 'memory_stats',
   232	  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
   233	  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
   234	};
   235	

===== CODE GRAPH =====
   624	  name: 'code_graph_scan',
   625	  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
   626	  inputSchema: {
   627	    type: 'object', additionalProperties: false,
   628	    properties: {
   629	      rootDir: { type: 'string', description: 'Root directory to scan (default: workspace root)' },
   630	      includeGlobs: { type: 'array', items: { type: 'string' }, description: 'Glob patterns for files to include' },
   631	      excludeGlobs: { type: 'array', items: { type: 'string' }, description: 'Additional glob patterns to exclude' },
   632	      incremental: { type: 'boolean', default: true, description: 'Skip unchanged files (default: true)' },
   633	    },
   634	    required: [],
   635	  },
   636	};
   637	
   638	const codeGraphQuery: ToolDefinition = {
   639	  name: 'code_graph_query',
   640	  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph), and blast_radius (reverse import impact). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
   641	  inputSchema: {
   642	    type: 'object', additionalProperties: false,
   643	    properties: {
   644	      operation: { type: 'string', enum: ['outline', 'calls_from', 'calls_to', 'imports_from', 'imports_to', 'blast_radius'], description: 'Query operation (required)' },
   645	      subject: { type: 'string', minLength: 1, description: 'File path, symbol name, or symbolId to query (required)' },
   646	      subjects: { type: 'array', items: { type: 'string' }, description: 'Optional additional file paths or symbols for blast-radius union mode' },
   647	      edgeType: { type: 'string', description: 'Filter by edge type (optional)' },
   648	      limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Max results' },
   649	      includeTransitive: { type: 'boolean', default: false, description: 'Enable multi-hop BFS traversal (follows edges transitively)' },
   650	      maxDepth: { type: 'number', minimum: 1, maximum: 10, default: 3, description: 'Max traversal depth when includeTransitive is true' },
   651	    },
   652	    required: ['operation', 'subject'],
   653	  },
   654	};
   655	
   656	const codeGraphStatus: ToolDefinition = {
   657	  name: 'code_graph_status',
   658	  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
   659	  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
   660	};
   661	
   662	const codeGraphContext: ToolDefinition = {
   663	  name: 'code_graph_context',
   664	  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
   665	  inputSchema: {
   666	    type: 'object', additionalProperties: false,
   667	    properties: {
   668	      input: { type: 'string', description: 'Natural language context query' },

codex
I have enough to draft the architecture map now. I’m doing one small cleanup pass on the memory note I used and on a couple of exact repo lines so the report and citation block are precise rather than approximate.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1176,1192p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1176	- Related skill: skills/spec-folder-slug-rename-sweep/SKILL.md [Task 1]
  1177	- Canonical packet rewrite should retitle live docs to active slug and keep predecessor names in explicit historical notes [Task 2]
  1178	- Use Level-3 scaffold scripts for follow-on packets to reduce template drift [Task 3]
  1179	- For documentation-only closure packets, keep `Status: Complete` and route non-executed runtime work into clearly labeled follow-on recommendations, linked to the canonical broader packet instead of pretending completion [Task 4]
  1180	- Level-3 specs still require the literal `12. OPEN QUESTIONS` header even when content is repurposed into routing notes [Task 4]
  1181	- For `023-esm-module-compliance`, keep `research/research.md` immutable as canonical evidence and sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the same strategy language (shared + mcp_server ESM, scripts CommonJS interop, dual-build fallback-only) [Task 5]
  1182	- Keep standards-doc updates deferred until runtime verification passes; strict packet validation can be green while runtime migration remains intentionally pending [Task 5]
  1183	
  1184	## Failures and how to do differently
  1185	
  1186	- symptom: JSON parse breaks after lineage edits; cause: trailing comma; fix: run `jq empty` immediately after list-item deletion [Task 1]
  1187	- symptom: validator flags metadata anchor/phase headers; cause: template divergence during manual edits; fix: restore template sections before content edits [Task 3]
  1188	- symptom: `TEMPLATE_HEADERS` validation fails during packet closeout; cause: missing literal `12. OPEN QUESTIONS` header; fix: restore the required heading and rerun `validate.sh --no-recursive` [Task 4]
  1189	- symptom: packet docs drift from deep-research conclusions; cause: spec/plan/tasks/checklist/summary edited piecemeal; fix: run a single truth-sync pass across all packet docs with explicit references to `research/research.md` [Task 5]
  1190	
  1191	# Task Group: Deep-Research Review Workflow and Release Readiness Controls
  1192	scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '20,140p' && printf '\\n===== README HOW IT WORKS =====\\n' && nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md | sed -n '140,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

===== README HOW IT WORKS =====
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

codex
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings
### Finding 1: Mex uses a router-first markdown scaffold as its control plane
- **Source**: [external/README.md:178](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:178), [external/README.md:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:200), [external/ROUTER.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:20), [external/AGENTS.md:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md:1)
- **What it does**: Mex keeps the always-loaded file tiny, then routes the agent through `ROUTER.md` into `context/*.md` and `patterns/*.md`. The `GROW` step feeds completed work back into the scaffold by updating current state or adding new patterns.
- **Why it matters for us**: This is a different layer than Spec Kit Memory. Our system is strong at retrieval and session continuity, but Mex adds a very explicit, human-readable navigation contract for project knowledge.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: The CLI is a thin orchestrator over distinct setup, drift, scan, sync, pattern, and hook subsystems
- **Source**: [external/src/cli.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts:1), [external/src/config.ts:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:9), [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json:1)
- **What it does**: `cli.ts` wires `mex setup`, `check`, `init`, `sync`, `pattern add`, `watch`, and `commands` to focused modules. `findConfig()` enforces project-root execution, locates `.git`, and resolves either `.mex/` or root-layout scaffolds.
- **Why it matters for us**: Mex’s architecture is easy to slice. We would not need to import the whole product to reuse the drift-checking or targeted-sync parts as a Public-side docs-drift command.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 3: Mex front-loads static scanning so AI writes from a structured brief instead of raw repo exploration
- **Source**: [external/src/scanner/index.ts:8](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:8), [external/src/scanner/manifest.ts:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:12), [external/src/scanner/entry-points.ts:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:35), [external/src/setup/index.ts:192](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:192)
- **What it does**: `mex init` builds a `ScannerBrief` from manifest data, entry points, folder categories, tooling detection, and truncated README content, then embeds that brief into population prompts with explicit instructions not to do broad filesystem exploration.
- **Why it matters for us**: Public already has strong retrieval at runtime, but not an equivalent “static brief first” path for initializing or resyncing markdown knowledge surfaces. This could reduce token spend and make scaffold generation less noisy.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: The drift engine is a clean static-analysis pipeline, not an AI validator
- **Source**: [external/src/drift/index.ts:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:17), [external/src/drift/claims.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:36), [external/src/markdown.ts:11](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts:11), [external/src/drift/scoring.ts:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts:9)
- **What it does**: Mex parses markdown into ASTs, extracts typed claims (`path`, `command`, `dependency`, `version`), parses frontmatter edges, runs checker modules, and computes a simple 0-100 score by severity. This is fully static and zero-token.
- **Why it matters for us**: This is the biggest capability gap versus `Code_Environment/Public`. Our [`validate.sh`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh:1) validates spec structure/completeness, while Spec Kit Memory focuses on retrieval, not whether docs now contradict the live filesystem or manifests.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex’s repair layer is issue-scoped and surgical, with filesystem and git evidence bundled into the prompt
- **Source**: [external/src/sync/brief-builder.ts:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:7), [external/src/sync/index.ts:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:29), [external/src/git.ts:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:12), [external/src/watch.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts:27)
- **What it does**: Sync groups issues by file, injects the current file content, issue list, nearby filesystem reality, and recent git diffs into a repair brief, then loops until the score improves. `watch` can surface drift after commits.
- **Why it matters for us**: This is a practical bridge between static detection and AI repair. Public could borrow the brief-building pattern without inheriting the Claude-specific interactive loop. That would fit our existing validator, memory, and code-graph stack better than a full Mex-style workflow.
- **Recommendation**: prototype later
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts), [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md), [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [validate.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh)

## Assessment
- New information ratio: 0.82
- Questions addressed: scaffold structure, CLI/module boundaries, scanner-first setup, static drift detection vs AI repair, overlap with Spec Kit Memory and `validate.sh`
- Questions answered: Mex is a markdown control plane rather than a DB memory system; its strongest reusable value for Public is static documentation-to-code drift detection; its scanner and sync layers are complementary to our memory/code-graph stack, not replacements for it

## Reflection
- What worked: reading the scaffold contract first, then tracing `cli.ts` into `scanner`, `drift`, `sync`, and `pattern` modules produced a clean architecture map with direct source evidence
- What did not work: the external repo path in the prompt was slightly off (`external/mex-main` vs actual `external/`), and this session is read-only, so I could not create `research/research.md`, update `checklist.md`, write `implementation-summary.md`, or run `generate-context.js`; the phase validator also emitted an `Operation not permitted` temp-file warning before still reporting `RESULT: PASSED`

## Recommended Next Focus
Deep-dive the eight drift checkers as a capability matrix against `Code_Environment/Public`: exact false-positive behavior, placeholder/negation handling, staleness thresholds, and which checker subset should become a Public-side docs-drift guard first.


hook: Stop
hook: Stop Completed
tokens used
161,703
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings
### Finding 1: Mex uses a router-first markdown scaffold as its control plane
- **Source**: [external/README.md:178](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:178), [external/README.md:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md:200), [external/ROUTER.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md:20), [external/AGENTS.md:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md:1)
- **What it does**: Mex keeps the always-loaded file tiny, then routes the agent through `ROUTER.md` into `context/*.md` and `patterns/*.md`. The `GROW` step feeds completed work back into the scaffold by updating current state or adding new patterns.
- **Why it matters for us**: This is a different layer than Spec Kit Memory. Our system is strong at retrieval and session continuity, but Mex adds a very explicit, human-readable navigation contract for project knowledge.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: The CLI is a thin orchestrator over distinct setup, drift, scan, sync, pattern, and hook subsystems
- **Source**: [external/src/cli.ts:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts:1), [external/src/config.ts:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts:9), [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/package.json:1)
- **What it does**: `cli.ts` wires `mex setup`, `check`, `init`, `sync`, `pattern add`, `watch`, and `commands` to focused modules. `findConfig()` enforces project-root execution, locates `.git`, and resolves either `.mex/` or root-layout scaffolds.
- **Why it matters for us**: Mex’s architecture is easy to slice. We would not need to import the whole product to reuse the drift-checking or targeted-sync parts as a Public-side docs-drift command.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 3: Mex front-loads static scanning so AI writes from a structured brief instead of raw repo exploration
- **Source**: [external/src/scanner/index.ts:8](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts:8), [external/src/scanner/manifest.ts:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/manifest.ts:12), [external/src/scanner/entry-points.ts:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/entry-points.ts:35), [external/src/setup/index.ts:192](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/setup/index.ts:192)
- **What it does**: `mex init` builds a `ScannerBrief` from manifest data, entry points, folder categories, tooling detection, and truncated README content, then embeds that brief into population prompts with explicit instructions not to do broad filesystem exploration.
- **Why it matters for us**: Public already has strong retrieval at runtime, but not an equivalent “static brief first” path for initializing or resyncing markdown knowledge surfaces. This could reduce token spend and make scaffold generation less noisy.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: The drift engine is a clean static-analysis pipeline, not an AI validator
- **Source**: [external/src/drift/index.ts:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts:17), [external/src/drift/claims.ts:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts:36), [external/src/markdown.ts:11](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/markdown.ts:11), [external/src/drift/scoring.ts:9](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts:9)
- **What it does**: Mex parses markdown into ASTs, extracts typed claims (`path`, `command`, `dependency`, `version`), parses frontmatter edges, runs checker modules, and computes a simple 0-100 score by severity. This is fully static and zero-token.
- **Why it matters for us**: This is the biggest capability gap versus `Code_Environment/Public`. Our [`validate.sh`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh:1) validates spec structure/completeness, while Spec Kit Memory focuses on retrieval, not whether docs now contradict the live filesystem or manifests.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mex’s repair layer is issue-scoped and surgical, with filesystem and git evidence bundled into the prompt
- **Source**: [external/src/sync/brief-builder.ts:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts:7), [external/src/sync/index.ts:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts:29), [external/src/git.ts:12](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/git.ts:12), [external/src/watch.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/watch.ts:27)
- **What it does**: Sync groups issues by file, injects the current file content, issue list, nearby filesystem reality, and recent git diffs into a repair brief, then loops until the score improves. `watch` can surface drift after commits.
- **Why it matters for us**: This is a practical bridge between static detection and AI repair. Public could borrow the brief-building pattern without inheriting the Claude-specific interactive loop. That would fit our existing validator, memory, and code-graph stack better than a full Mex-style workflow.
- **Recommendation**: prototype later
- **Impact**: high

## Sources Consulted
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/README.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md)
- [external/ROUTER.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/ROUTER.md)
- [external/SETUP.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SETUP.md)
- [external/SYNC.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/SYNC.md)
- [external/src/cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/cli.ts), [external/src/config.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/config.ts), [external/src/types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/types.ts)
- [external/src/drift/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/index.ts), [external/src/drift/claims.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/claims.ts), [external/src/drift/frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/frontmatter.ts), [external/src/drift/scoring.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/scoring.ts)
- [external/src/drift/checkers/path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/path.ts), [external/src/drift/checkers/edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/edges.ts), [external/src/drift/checkers/index-sync.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/index-sync.ts), [external/src/drift/checkers/staleness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/staleness.ts), [external/src/drift/checkers/command.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/command.ts), [external/src/drift/checkers/dependency.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/dependency.ts), [external/src/drift/checkers/cross-file.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/cross-file.ts), [external/src/drift/checkers/script-coverage.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/drift/checkers/script-coverage.ts)
- [external/src/scanner/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/scanner/index.ts), [external/src/sync/brief-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/brief-builder.ts), [external/src/sync/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/sync/index.ts), [external/src/pattern/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/src/pattern/index.ts)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md), [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [validate.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh)

## Assessment
- New information ratio: 0.82
- Questions addressed: scaffold structure, CLI/module boundaries, scanner-first setup, static drift detection vs AI repair, overlap with Spec Kit Memory and `validate.sh`
- Questions answered: Mex is a markdown control plane rather than a DB memory system; its strongest reusable value for Public is static documentation-to-code drift detection; its scanner and sync layers are complementary to our memory/code-graph stack, not replacements for it

## Reflection
- What worked: reading the scaffold contract first, then tracing `cli.ts` into `scanner`, `drift`, `sync`, and `pattern` modules produced a clean architecture map with direct source evidence
- What did not work: the external repo path in the prompt was slightly off (`external/mex-main` vs actual `external/`), and this session is read-only, so I could not create `research/research.md`, update `checklist.md`, write `implementation-summary.md`, or run `generate-context.js`; the phase validator also emitted an `Operation not permitted` temp-file warning before still reporting `RESULT: PASSED`

## Recommended Next Focus
Deep-dive the eight drift checkers as a capability matrix against `Code_Environment/Public`: exact false-positive behavior, placeholder/negation handling, staleness thresholds, and which checker subset should become a Public-side docs-drift guard first.
