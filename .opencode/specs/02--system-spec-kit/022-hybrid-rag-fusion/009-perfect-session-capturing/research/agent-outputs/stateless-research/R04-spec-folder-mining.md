# R04 - Spec Folder Mining for Stateless Memory Saves

## Goal

Improve `generate-context.js` direct/spec-folder mode by mining structured context from the target spec folder itself before falling back to shallow session capture. The target `013-improve-stateless-mode` folder is currently a good example of an early-phase folder: it has `spec.md` and `description.json`, but no `plan.md`, `tasks.md`, `checklist.md`, or `implementation-summary.md` yet.

## Typical Spec Folder Contents

### Core files by level

| File | Typical role | When present |
| --- | --- | --- |
| `spec.md` | Requirements, scope, acceptance criteria, risks, open questions | All levels |
| `plan.md` | Technical plan, phases, files to modify, verification commands | Usually after planning starts |
| `tasks.md` | Actionable work breakdown with completion markers | Usually after planning starts |
| `implementation-summary.md` | What was built, verification, remaining work | End of implementation phase, required by validation |
| `checklist.md` | Verification status and evidence by priority | Level 2+ or when QA tracking is needed |
| `decision-record.md` | Explicit architectural decisions and rationale | Level 3+ or when major decisions exist |
| `description.json` | Folder identity, metadata, parent relationship, status, memory bookkeeping | Common and intended primary metadata source |

### Subdirectories and optional artifacts

| Path | Role | Confidence |
| --- | --- | --- |
| `memory/*.md` | Prior saved context with normalized session summaries and state snapshots | High |
| `scratch/*.md` | Working notes, manifests, audit logs, fix reports, temporary research | Medium |
| `research/research.md` | Deep-dive research artifact for larger specs | High when present |
| `handover.md` | Explicit continuation state for next session | High when present |
| `README.md` / extra notes | Folder-specific instructions or catalogs in some older specs | Medium |

## Extractable Context Signals by File Type

### 1. `spec.md`

**Primary parsing mode:** YAML frontmatter + markdown headings + tables + anchor comments.

**Reliable signals:**
- Title from frontmatter `title:` or first H1.
- One-line problem framing from frontmatter `description:`.
- Trigger phrases from frontmatter `trigger_phrases:`.
- Importance/context hints from frontmatter (`importance_tier`, `contextType`).
- Declared level/status/priority/parent from the metadata table.
- Problem statement and purpose sections.
- In-scope / out-of-scope bullets.
- Requirements and acceptance criteria tables.
- Success criteria bullets.
- Risks/dependencies table.
- Files-to-change table for candidate file list.
- Open questions and unresolved items.

**Useful derived outputs:**
- `overview`: compact summary from problem + purpose.
- `observations`: scope boundaries, risks, constraints, open questions.
- `fileList`: normalized paths from the files-to-change table.
- `decisions`: implicit decisions from out-of-scope boundaries and constraints.
- `triggerPhrases`: frontmatter list plus extracted keywords from title/requirements.

### 2. `plan.md`

**Primary parsing mode:** markdown headings, bullet lists, tables, fenced code blocks.

**Reliable signals:**
- Named phases or streams (`## Phase A`, `## Verification`, `## Critical Files`).
- Ordered implementation steps and sequence.
- File tables with expected changes.
- Verification commands and success checks.
- Risk/mitigation notes.
- Architecture/workflow descriptions.

**Useful derived outputs:**
- `nextAction`: first unfinished phase or last listed phase after current coverage.
- `observations`: planned execution sequence, validation approach, critical-path files.
- `fileList`: files listed in tables or inline code references.
- `sessionPhaseHint`: planning / implementation / verification based on section mix.
- `verificationPlan`: commands and manual checks to surface in generated memory.

### 3. `tasks.md`

**Primary parsing mode:** markdown headings + checkbox regex.

**Reliable signals:**
- Task sections grouped by phase.
- Checkbox state (`[x]`, `[ ]`, `[B]`, sometimes `[P]` markers in templates).
- Task IDs (`T001`, `CHK-`, `A1`, `D5`, etc.).
- Explicit pending/completed/blocked work.
- Cross-references to `spec.md` / `plan.md`.

**Useful derived outputs:**
- `completionPercent`: checked / total, optionally weighted by section or priority.
- `pendingTasks`: unchecked items with section labels.
- `blockedTasks`: `[B]` items or lines containing `BLOCKED`, `REMAINING`, `NOT TESTED`.
- `lastAction`: last completed task in document order.
- `nextAction`: first pending task in document order.

### 4. `checklist.md`

**Primary parsing mode:** markdown headings + checkbox regex + evidence extraction.

**Reliable signals:**
- Priority buckets (`P0`, `P1`, `P2`).
- Verified vs pending validation items.
- Evidence strings after separators like `- VERIFIED:` or bracketed notes.
- Runtime/manual-test gaps via `NOT TESTED`, `REMAINING`, deferred notes.

**Useful derived outputs:**
- `verificationStatus`: counts by priority and percent complete.
- `blockers`: unchecked P0 items, deferred-without-approval items, or explicit blockers.
- `observations`: what has already been proven vs what still needs runtime validation.
- `qualitySignals`: presence of evidence, verified commands, unresolved test items.

### 5. `decision-record.md`

**Primary parsing mode:** markdown headings with decision IDs and labeled fields.

**Reliable signals:**
- Decision identifiers (`DR-001`, etc.).
- Context/problem statements.
- Chosen approach.
- Rationale.
- Alternatives considered.
- Consequences and trade-offs when present.

**Useful derived outputs:**
- `decisions`: strong, high-confidence decision objects for memory.
- `keyTopics`: keywords from decision titles and rationale.
- `observations`: trade-offs, reasons for rejecting alternatives.

### 6. `description.json`

**Primary parsing mode:** strict JSON parse with schema-version fallback.

**Reliable signals in newer schema (seen in target 013 folder):**
- `id`, `name`, `title`
- `description`
- `status`
- `level`
- `parent`
- `created`

**Reliable signals in older/expanded schema (seen in sibling specs):**
- `specFolder`, `description`, `keywords`, `lastUpdated`
- `specId`, `folderSlug`, `parentChain`
- `memorySequence`, `memoryNameHistory`

**Useful derived outputs:**
- Canonical spec identity and parent relationship.
- Lifecycle phase hint from `status`.
- Level inference if markdown metadata is missing.
- Prior memory save count/history from `memorySequence` and `memoryNameHistory`.
- Search/retrieval keywords from `keywords` or derived title tokens.

**Important note:** stateless mining should tolerate both schemas and merge fields rather than assuming one fixed shape.

### 7. `implementation-summary.md`

**Primary parsing mode:** markdown headings + tables + bullet lists.

**Reliable signals:**
- Overview of what was built.
- Files modified table.
- Fix categories / results.
- Verification/build outputs.
- Remaining work section.

**Useful derived outputs:**
- `observations`: completed outcomes and concrete results.
- `fileList`: high-confidence modified files.
- `decisions`: implementation choices if listed under categories.
- `sessionPhaseHint`: strong signal for implementation complete or near-complete.

### 8. `memory/*.md`

**Primary parsing mode:** YAML frontmatter + normalized memory sections.

**Reliable signals:**
- Previous session titles, summaries, spec folder path, phase, completion %, blockers.
- `CONTINUE SESSION` / `PROJECT STATE SNAPSHOT` / `DECISIONS` / `DETAILED CHANGES` sections.
- Previously extracted file lists and key topics.

**Useful derived outputs:**
- Historical continuity when the current spec docs are sparse.
- Last known phase, last action, next action, blockers.
- Previously recorded decisions and changed files.
- Candidate trigger phrases and topical keywords.

**Caution:** treat `memory/*.md` as prior derived state, not the sole source of truth if live spec docs disagree.

### 9. `scratch/*.md`

**Primary parsing mode:** opportunistic markdown parsing + regex for findings, files, commands, and decision language.

**Good signals when present:**
- Audit findings (`FINDING`, `P0`, `P1`, `rootCause`, `solution`).
- Fix reports listing touched files.
- Research notes and manifests.
- Commands or scripts used during investigation.

**Useful derived outputs:**
- Supplemental observations and pending issues.
- Candidate file paths not yet promoted into formal docs.
- Evidence of what analysis has already been done.

**Caution:** scratch is noisy and inconsistent. Mine it with lower confidence than spec/plan/tasks/checklist/decision-record.

## Parsing Strategy

### Parse order (recommended)

1. `description.json`
2. `spec.md`
3. `plan.md`
4. `tasks.md`
5. `checklist.md`
6. `decision-record.md`
7. `implementation-summary.md`
8. `memory/*.md` (newest first)
9. `scratch/*.md` (bounded sample / low-confidence)

This order gives identity first, then requirements, then execution state, then historical and noisy supplements.

### Recommended parsers

#### YAML frontmatter
- Detect leading `---` block.
- Parse as YAML when valid.
- Keep raw fallback if YAML parse fails.
- Important fields: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`.

#### Markdown sections
- Split by ATX headings (`#`, `##`, `###`).
- Preserve heading hierarchy.
- Recognize anchor comments like `<!-- ANCHOR:problem -->` as stable section IDs.
- Extract tables under the current section for structured rows.

#### Checkbox lists
- Regex: `^- \[(.| )\] (.+)$` in multiline mode.
- Normalize states:
  - `x` => done
  - space => pending
  - `B` => blocked
  - `P` => parallelizable marker, not completion state
- Preserve current heading path so tasks can be grouped by phase/priority.

#### Tables
- Use markdown table parsing for metadata, requirements, file lists, checklist summaries.
- Especially useful for:
  - spec metadata tables
  - files-to-change tables
  - verification summaries
  - implementation file tables

#### JSON
- Parse `description.json` directly.
- Support schema drift by mapping aliases:
  - `id` or `specId`
  - `name` or `folderSlug`
  - `parent` or `parentChain`
  - `description` shared across both

#### Inline file references
- Regex for backticked paths like `` `scripts/core/workflow.ts` ``.
- Regex for Markdown bullet/file-table rows.
- Normalize and dedupe relative to repo root.

## Building Memory Inputs from Spec Folder Content

### Observations

Build observations from the highest-signal sections first:
- `spec.md` problem/scope/risks/open questions
- `plan.md` phases, critical files, verification strategy
- `tasks.md` pending or completed milestones
- `checklist.md` verified vs unverified checks
- `implementation-summary.md` outcomes and remaining work
- `scratch/*.md` only for supplemental findings

Suggested observation shapes:
- `spec_problem`: concise problem + purpose summary
- `scope_boundary`: in-scope/out-of-scope constraint
- `risk`: risk + mitigation pair
- `execution_progress`: completion summary from tasks/checklist
- `verification_gap`: unchecked P0/P1 or `NOT TESTED` items
- `implementation_result`: built outcome from implementation-summary

### Decisions

Populate decisions from multiple layers:
1. **High confidence:** explicit decision records.
2. **Medium confidence:** spec scope constraints and plan sections with words like `Decision`, `Choose`, `Use`, `Do not`.
3. **Low confidence:** scratch notes or prior memory summaries.

Suggested decision fields:
- `title`
- `chosen`
- `rationale`
- `alternatives`
- `sourceFile`
- `confidence`

### File lists

Rank file sources by trust:
1. `implementation-summary.md` file tables
2. `spec.md` files-to-change table
3. `plan.md` critical files / file tables
4. backticked file references across docs
5. scratch file lists
6. prior memory file lists

For each file, keep:
- `path`
- `sourceFile`
- `sourceSection`
- `confidence`
- `reason` (`planned change`, `implemented change`, `verification target`, `scratch finding`)

## Phase Detection from Spec Folder State

A stateless save can infer useful phase even with zero conversation data.

### Simple state machine

#### New / early planning
Signals:
- `spec.md` exists
- `description.json` status is `planning`, `draft`, or similar
- `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` absent or mostly empty

Interpretation:
- Phase = `PLANNING`
- Last action = authored requirements/spec
- Next action = create plan/tasks

#### In progress
Signals:
- `plan.md` and/or `tasks.md` present
- unfinished tasks exist
- checklist has pending P0/P1 items
- no implementation summary yet, or summary exists but remaining work is non-empty

Interpretation:
- Phase = `IMPLEMENTATION` or `VERIFICATION` depending on whether checklist dominates
- Last action = last checked task or most recent completed checklist item
- Next action = first pending task / first unchecked P0-P1 checklist item

#### Complete / near complete
Signals:
- `implementation-summary.md` exists with substantive content
- tasks are mostly/all checked
- checklist P0/P1 items mostly/all verified
- `description.json` status is `complete`, `completed`, or similar if available
- latest memory file says session completed

Interpretation:
- Phase = `COMPLETE`
- Last action = final verification or summary write
- Next action = none / save memory / archive

#### Blocked
Signals:
- blocked markers (`[B]`) in tasks
- explicit `Blockers` fields not equal to `None`
- checklist/spec sections mention blockers or unresolved hard failures

Interpretation:
- Phase = `BLOCKED`
- Next action = unblock highest-priority blocker

### Suggested scoring heuristic

Use a weighted heuristic instead of one brittle rule:
- +4 planning: spec exists, plan/tasks absent, status planning/draft
- +4 implementation: tasks present with pending items
- +4 verification: checklist present with unchecked P0/P1
- +5 complete: implementation-summary present and tasks/checklist mostly done
- +6 blocked: explicit blockers or blocked tasks

Then select the dominant phase, with `BLOCKED` overriding everything else.

## Practical Recommendations for Stateless Mode

1. **Mine the spec folder before session capture.** Spec docs are more structured and usually higher signal than shallow conversation extraction.
2. **Treat `description.json` as identity seed, not full context.** It tells you who/where/status, but not enough about work done.
3. **Exploit markdown anchors and tables.** The spec format already exposes stable structure that is easy to parse deterministically.
4. **Use task/checklist completion to synthesize continuation data.** Even without chat history you can produce `completionPercent`, `pendingTasks`, `lastAction`, and `nextAction`.
5. **Support schema drift in `description.json`.** Existing folders use at least two shapes.
6. **Use `memory/*.md` as a backfill layer.** Especially valuable when the live folder is sparse, like the target 013 folder.
7. **Keep `scratch/*.md` low-confidence and bounded.** Good for enriching observations, bad as a primary truth source.
8. **Emit provenance.** Every mined observation/decision/file should record its source file and section so downstream quality scoring can reward grounded context.

## Suggested Output Model for Mining

```ts
interface SpecFolderMiningResult {
  identity: {
    specId?: string;
    title?: string;
    slug?: string;
    parent?: string | string[];
    level?: number | string;
    status?: string;
  };
  phase: 'PLANNING' | 'IMPLEMENTATION' | 'VERIFICATION' | 'COMPLETE' | 'BLOCKED';
  overview?: string;
  triggerPhrases: string[];
  observations: Array<{
    kind: string;
    text: string;
    sourceFile: string;
    sourceSection?: string;
    confidence: number;
  }>;
  decisions: Array<{
    title: string;
    chosen?: string;
    rationale?: string;
    sourceFile: string;
    sourceSection?: string;
    confidence: number;
  }>;
  files: Array<{
    path: string;
    reason: string;
    sourceFile: string;
    confidence: number;
  }>;
  progress: {
    taskCompletion?: number;
    checklistP0Open?: number;
    checklistP1Open?: number;
    pendingTasks: string[];
    blockedTasks: string[];
    lastAction?: string;
    nextAction?: string;
  };
}
```

## Bottom Line

Stateless mode is currently leaving substantial structured context on the table. Even a deterministic pass over `description.json`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, and the newest `memory/*.md` files would yield far richer observations, decisions, file lists, and phase status than shallow session capture alone.
<!-- /ANCHOR:problem -->
