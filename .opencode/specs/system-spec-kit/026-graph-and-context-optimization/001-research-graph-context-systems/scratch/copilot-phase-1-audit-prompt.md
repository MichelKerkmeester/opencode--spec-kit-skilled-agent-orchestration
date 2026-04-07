# PHASE 1 — Spec documentation audit (read-only)

You are **GitHub Copilot CLI** (`gpt-5.4` / reasoning effort `high`), running phase 1 of 3 in a spec-documentation perfection task orchestrated by Claude. Your job is **audit only — do NOT modify any spec docs**. You may write ONE report file to `scratch/`.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

This is the PARENT folder. Hereafter `<PARENT>`.

## Mission

Audit the current state of spec documentation across the PARENT folder + its 5 sub-folders against the system-spec-kit templates. Produce a comprehensive gap report at `<PARENT>/scratch/spec-doc-audit.md`. **No file modifications outside `scratch/`.**

## Folders to audit

| # | Path | Current known state |
|---|---|---|
| 0 | `<PARENT>/` (this folder itself) | ❌ NO spec docs (only `research/`, `scratch/`, `memory/`, `iterations/`). User chose Level 3 — must be created in phase 2. |
| 1 | `<PARENT>/001-claude-optimization-settings/` | ✅ Has spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json |
| 2 | `<PARENT>/002-codesight/` | ✅ Same as #1 BUT missing description.json |
| 3 | `<PARENT>/003-contextador/` | ✅ Same as #1 + extra CONTEXT.md |
| 4 | `<PARENT>/004-graphify/` | ✅ Same as #1 |
| 5 | `<PARENT>/005-claudest/` | ✅ Same as #1 |

## Templates to read

| Template family | Location |
|---|---|
| Level 3 (chosen for PARENT) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/` |
| Level 3 example (reference for filling) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/` |
| Core templates (lighter base) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/core/` |
| Research template | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/research.md` |
| Description.json schema | search for `description.json` references in `.opencode/skill/system-spec-kit/` to find the schema |
| Templates README | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/README.md` |

You have read access to `<PARENT>` and `.opencode/skill/system-spec-kit/templates/`. Read the templates **before** auditing files so you know what "compliant" means.

## Existing research deliverables (PARENT v2 — these are the SOURCE for phase-2's parent doc creation)

These already exist in `<PARENT>/research/` and contain the full content for the parent's spec docs:

- `research/research-v2.md` (8576 words, 13 sections, master synthesis)
- `research/findings-registry-v2.json` (88 findings)
- `research/recommendations-v2.md` (10 recommendations)
- `research/cross-phase-matrix.md` (9 capability rubric)
- `research/iterations/v1-v2-diff-iter-18.md` (changelog)
- `research/deep-research-strategy.md` (charter recap + folder layout)

When phase 2 creates the parent's spec.md/plan.md/tasks.md, it will draw content from these.

## Audit output: `<PARENT>/scratch/spec-doc-audit.md`

```markdown
# Spec Documentation Audit (Phase 1)

> Read-only audit. No spec docs modified. Produced by cli-copilot/gpt-5.4/high.

## TL;DR
- ≤8 bullets: biggest gaps, most critical fixes, level recommendation confirmation, total file delta count

## Templates inventory

For each template file you read, note:
- Path
- Purpose / when used
- Required sections (header list)
- Mandatory vs optional fields

Group by level (level_3 main + level_3 example). Highlight any templates that look stale or contradictory.

## Per-folder audit

### 0. PARENT (`<PARENT>/`)

**Status:** ❌ NO SPEC DOCS
**Level (user-chosen):** Level 3
**Files needed:**
| File | Source for content | Template to use |
|---|---|---|
| `spec.md` | `research-v2.md` §1 §2 §11 + `recommendations-v2.md` | `templates/level_3/spec.md` |
| `plan.md` | `research-v2.md` §8 (adoption roadmap) + `q-d-adoption-sequencing.md` | `templates/level_3/plan.md` |
| `tasks.md` | `research-v2.md` §8 + `recommendations-v2.md` (top 10) | `templates/level_3/tasks.md` |
| `checklist.md` | per template + research convergence checklist (charter §5) | `templates/level_3/checklist.md` |
| `decision-record.md` | `research-v2.md` §5 cross-phase findings + iter-12 falsifications + iter-16 verdicts | `templates/level_3/decision-record.md` |
| `implementation-summary.md` | the actual session summary (8 codex iters + 10 rigor lane iters) | `templates/level_3/implementation-summary.md` |
| `description.json` | metadata: title, description, status, level, owner | search for description.json schema |

**Notes for phase 2:**
- Bullet what content from each research deliverable maps to which spec doc section
- Flag any sections of the level_3 templates that DON'T fit a research-only initiative (e.g., test plan sections may be N/A)

### 1. 001-claude-optimization-settings/

**Status:** ✅ has full set
**Files audit (each existing file vs template):**
| File | LOC | Template alignment | Drift items |
|---|---|---|---|
| spec.md | <int> | match/partial/drift | (list) |
| plan.md | <int> | ... | ... |
| tasks.md | <int> | ... | ... |
| checklist.md | <int> | ... | ... |
| decision-record.md | <int> | ... | ... |
| implementation-summary.md | <int> | ... | ... |
| description.json | <int> | ... | ... |

For each `drift item`, be specific: missing section / extra section / placeholder text not filled / wrong heading depth / etc.

(repeat for folders 2-5)

### 2. 002-codesight/

**Status:** ✅ has set EXCEPT description.json
**Missing:** description.json (must be added in phase 2)
(audit existing files same as folder 1)

### 3. 003-contextador/
(audit including CONTEXT.md if it conforms to a known template)

### 4. 004-graphify/
(audit)

### 5. 005-claudest/
(audit)

## Total file delta

| Folder | Files to create | Files to patch | Files to delete |
|---|---|---|---|
| PARENT | 7 (spec/plan/tasks/checklist/decision-record/implementation-summary/description.json) | 0 | 0 |
| 001 | 0 | <int> | <int> |
| 002 | 1 (description.json) | <int> | <int> |
| 003 | 0 | <int> | 0 (keep CONTEXT.md if useful) |
| 004 | 0 | <int> | 0 |
| 005 | 0 | <int> | 0 |
| **Total** | **<int>** | **<int>** | **<int>** |

## Level confirmation

- User chose Level 3 for PARENT. Is this the right fit given the deliverables (research-only initiative producing 88-finding registry + 10 ranked recommendations + 4-deliverable master packet)?
- Recommend: confirm-level-3 OR escalate-to-level-3+ OR downgrade-to-level-2
- Justify in ≤200 words

## Phase 2 plan (concrete file-by-file)

| Order | Action | File | Source content | Estimated effort |
|---|---|---|---|---|
| 1 | create | `<PARENT>/spec.md` | research-v2.md §1+§2+§11 | M |
| 2 | create | `<PARENT>/plan.md` | research-v2.md §8 + q-d sequencing | M |
| ... |

## Phase 3 validation plan

Which validators/scripts to run after phase 2 lands.

## Open questions

If anything is unclear, list it here. (e.g. "Should description.json include the deep-research metadata or just the spec metadata?")
```

## Constraints

- **READ-ONLY for spec docs.** You may write `scratch/spec-doc-audit.md` only.
- DO NOT modify any spec.md / plan.md / tasks.md / checklist.md / decision-record.md / implementation-summary.md / description.json in any folder
- DO NOT modify research/ deliverables
- DO NOT modify templates
- DO NOT dispatch sub-agents (LEAF-only)
- READ the templates BEFORE auditing the folders
- Be honest if a folder is template-compliant (don't manufacture drift)
- If you can't find the description.json schema, search `.opencode/skill/system-spec-kit/scripts/` and `.opencode/skill/system-spec-kit/mcp_server/` for references
- Use absolute paths in the report so phase 2 can act on them directly

## When done

Exit. Phase 2 (creation + patching) is next, dispatched by Claude orchestrator after reviewing your audit.
