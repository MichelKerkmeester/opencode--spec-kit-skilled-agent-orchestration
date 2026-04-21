# PHASE 2 — Create + patch all spec docs (autopilot)

You are **GitHub Copilot CLI** (`gpt-5.4` / reasoning effort `high`), running phase 2 of 3. Phase 1 produced a comprehensive audit. **Now execute it.**

## Charter

This is the second phase of a spec-documentation perfection task. Phase 1 audited 6 folders against Level 3 templates. Phase 2 creates the 7 missing PARENT spec docs and patches 15 drift items in sub-folders. Phase 3 will validate.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

Hereafter `<PARENT>`. User chose **Level 3** for the parent.

## Phase 1 audit (READ THIS FIRST — it has the file-by-file plan)

`<PARENT>/scratch/spec-doc-audit.md`

This document contains:
- The complete templates inventory with required sections
- Per-folder per-file drift listings with specific issues
- Concrete file-by-file plan for phase 2 (use it as your work order)
- N/A guidance for research-only sections
- Description.json schema source: `mcp_server/lib/search/folder-discovery.ts`

**Before doing any file work, read the audit fully.** Then execute its plan.

## Source content for the 7 PARENT spec docs

The PARENT is a research-only initiative. Its content lives in `<PARENT>/research/`:

- `research/research-v2.md` — master synthesis (8576 words, 13 sections; the "what we found" content)
- `research/findings-registry-v2.json` — 88 findings with evidence
- `research/recommendations-v2.md` — top 10 ranked recommendations with KEEP/DOWNGRADE/REPLACE verdicts
- `research/cross-phase-matrix.md` — 9 capability rubric
- `research/iterations/v1-v2-diff-iter-18.md` — v1 → v2 changelog
- `research/deep-research-strategy.md` — charter recap and folder layout
- `research/iterations/q-d-adoption-sequencing.md` — phase P0/P1/P2/P3 sequencing (use for plan.md and tasks.md)
- `research/iterations/q-f-killer-combos.md` — top combos (use for adoption decisions in decision-record.md)

For research-only initiatives like this:
- `spec.md` requirements should be **evidence + evaluation + adoption-decision** requirements, NOT product feature requirements
- `plan.md` rollback should be **packet rollback or recommendation rollback**, NOT runtime rollback
- `tasks.md` should be **executable doc + adoption tasks** (e.g. "open spec folder for R1", "draft trust-axis contract proposal"), NOT a restatement of findings
- `checklist.md` should focus on **evidence traceability, cross-link integrity, convergence completeness, recommendation readiness**. Deployment checks → mark N/A with rationale.
- `decision-record.md` should capture the **packet's adoption decisions** (one ADR per major area: token honesty rule, P0 fast wins, R10 replacement, Combo 3 falsification, etc.)
- `implementation-summary.md` should summarize **how the packet was produced** (8 codex iters + 10 rigor lane iters, ~3.45M tokens, v1→v2 evolution), what remains for downstream implementation
- `description.json` should follow the **repo-native schema** from `folder-discovery.ts`: `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`

---

## Mission

### Part A — Create the 7 PARENT spec docs (Level 3)

Create these files in `<PARENT>/` root:

1. `<PARENT>/spec.md`
2. `<PARENT>/plan.md`
3. `<PARENT>/tasks.md`
4. `<PARENT>/checklist.md`
5. `<PARENT>/decision-record.md`
6. `<PARENT>/implementation-summary.md`
7. `<PARENT>/description.json`

For each, follow the audit's "Files needed" table and source-content mapping. Use the level_3 templates as the structural skeleton, then fill them with content sourced from the research/ deliverables.

**Do NOT include placeholder text** — every section must be filled with real content from the research deliverables. If a section is genuinely N/A for a research-only initiative, write "N/A — <one-sentence rationale>" rather than leaving template placeholder text.

### Part B — Add `<PARENT>/002-codesight/description.json`

Use the same repo-native schema as the other folders. Use `<PARENT>/001-claude-optimization-settings/description.json` as a structural reference.

### Part C — Patch the 15 drift items per the audit

For each sub-folder (001, 002, 003, 004, 005), apply the drift fixes the audit identified. Specifically (from the audit's TL;DR):

- **001-claude-optimization-settings/spec.md**: fix the broken link to `phase-research-prompt.md` (wrong path)
- **001-claude-optimization-settings/tasks.md**: fold non-template `## AI Execution Protocol` and `## Phase 2b: Convergence and Synthesis (Analyst-only)` sections into template sections (or mark them as extension sections clearly)
- **003-contextador**: fix similar broken link to `phase-research-prompt.md`
- **003-contextador/implementation-summary.md**: REMOVE the `### Files Changed` table per Level 3 core summary guidance
- **002-codesight/spec.md, 003-contextador/spec.md, 004-graphify/spec.md, 005-claudest/spec.md**: add the missing `metadata` anchor pairs per the Level 3 spec.md template
- **002-codesight/plan.md, 005-claudest/plan.md**: add missing Level 3 sections `L2: ENHANCED ROLLBACK`, `L3: CRITICAL PATH`, `L3: MILESTONES`

For any other drift item the audit lists per-folder, apply that fix too.

### Part D — Produce a phase-2 summary report

Write `<PARENT>/scratch/spec-doc-phase-2-summary.md` listing every file created/patched, with line counts before/after, and any drift items that proved harder to fix than expected (with explanation).

---

## Output paths summary

| Path | Action | Source |
|---|---|---|
| `<PARENT>/spec.md` | create | `research-v2.md` §1+§2+§11+§13 + `recommendations-v2.md` |
| `<PARENT>/plan.md` | create | `research-v2.md` §5.4+§8 + `q-d-adoption-sequencing.md` |
| `<PARENT>/tasks.md` | create | `research-v2.md` §8 + `recommendations-v2.md` (top 10) |
| `<PARENT>/checklist.md` | create | level_3 checklist + `deep-research-strategy.md` charter §5 |
| `<PARENT>/decision-record.md` | create | `research-v2.md` §5+§8+§11+§13 + `v1-v2-diff-iter-18.md` |
| `<PARENT>/implementation-summary.md` | create | session chronology (8+10 iters) + research deliverables |
| `<PARENT>/description.json` | create | `folder-discovery.ts` schema |
| `<PARENT>/002-codesight/description.json` | create | repo-native schema, mirror 001 structure |
| `<PARENT>/001-...../spec.md` | patch | broken phase-research-prompt.md link |
| `<PARENT>/001-...../tasks.md` | patch | fold non-template sections |
| `<PARENT>/003-contextador/spec.md` | patch | broken link |
| `<PARENT>/003-contextador/implementation-summary.md` | patch | remove Files Changed table |
| `<PARENT>/002-codesight/spec.md` | patch | add metadata anchor |
| `<PARENT>/004-graphify/spec.md` | patch | add metadata anchor |
| `<PARENT>/005-claudest/spec.md` | patch | add metadata anchor |
| `<PARENT>/002-codesight/plan.md` | patch | add L2/L3 sections |
| `<PARENT>/005-claudest/plan.md` | patch | add L2/L3 sections |
| (other drift items per audit) | patch | per audit |
| `<PARENT>/scratch/spec-doc-phase-2-summary.md` | create | phase 2 report |

---

## Constraints

- **DO NOT modify any file under `<PARENT>/research/`** (the v1/v2 deliverables are frozen)
- **DO NOT modify any file under `<PARENT>/memory/`**
- **DO NOT modify any iteration prompt under `<PARENT>/scratch/iteration-*-prompt.md`**
- **DO NOT modify the audit at `<PARENT>/scratch/spec-doc-audit.md`** (it's the source of truth)
- DO NOT modify any template file under `.opencode/skill/system-spec-kit/templates/`
- DO NOT dispatch sub-agents (LEAF-only)
- Every section in created docs must have REAL content (not placeholder text)
- Every claim in spec.md / decision-record.md should be source-grounded (cite the research deliverable)
- Use literal absolute paths or workspace-relative paths in cross-references; avoid `phase-N/` aliases (they don't resolve)
- Preserve any custom sections in sub-folder docs that have unique value (e.g., 003-contextador's CONTEXT.md may stay if it serves a purpose); only fold/remove sections the audit specifically flagged
- If a section feels too short, expand it with real content from the research deliverables — don't leave thin sections

## When done

Exit. Phase 3 (validation) is next, dispatched by Claude orchestrator.
