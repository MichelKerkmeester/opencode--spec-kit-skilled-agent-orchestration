# R10 - Stateless Mode Integration Architecture

## 1. Executive Recommendation

**Recommended architecture:** use **Option B as the main design**, with one **small Option A extension** for Claude Code capture.

- **Option B (primary):** add a dedicated enrichment layer **after** `data-loader.ts` returns data and **before** `collect-session-data.ts` plus the other parallel extractors run.
- **Option A (narrow exception):** keep alternate primary conversation capture inside `data-loader.ts`, so Claude Code capture sits beside OpenCode capture in the same acquisition tier.
- **Option C (fallback only):** reserve sparse-data backfill in `collect-session-data.ts` for guardrails, not for primary mining.

This split best matches the current pipeline: `runWorkflow()` loads `collectedData`, then fans out into `collectSessionData`, `extractConversations`, `extractDecisions`, `extractDiagrams`, and workflow generation in parallel, all from the same `collectedData` object [SOURCE: `scripts/core/workflow.ts:423-549`]. If enrichment happens only inside `collect-session-data.ts`, the parallel decision/conversation extractors never see the richer data.

## 2. Current Pipeline and Constraints

### Current flow

```text
CLI (generate-context.ts)
  -> loadCollectedData()
  -> detectSpecFolder()
  -> Promise.all(
       collectSessionData(collectedData),
       extractConversations(collectedData),
       extractDecisions(collectedData),
       extractDiagrams(collectedData),
       build workflow metadata
     )
  -> semantic summary / trigger extraction / render
```

### Current bottlenecks

1. `data-loader.ts` currently has only three outcomes:
   - explicit JSON file
   - OpenCode capture
   - simulation fallback
   [SOURCE: `scripts/loaders/data-loader.ts:76-186`]
2. `collect-session-data.ts` mostly synthesizes from `observations`, `userPrompts`, `recentContext`, and `FILES`; it does not mine git or parse spec content deeply [SOURCE: `scripts/extractors/collect-session-data.ts:673-817`].
3. `detectRelatedDocs()` only detects spec doc presence and labels; it does **not** parse `spec.md`, `plan.md`, `tasks.md`, or `checklist.md` content [SOURCE: `scripts/extractors/session-extractor.ts:304-355`].
4. `extractFilesFromData()` only reads:
   - `FILES`
   - legacy `filesModified`
   - `observations[].files`
   - `facts[].files`
   It does not consult git state at all [SOURCE: `scripts/extractors/file-extractor.ts:104-181`].

### Implication

Stateless quality is low because the pipeline receives a thin `collectedData` object too early. The render/scoring stages later in `workflow.ts` already reward richer summaries, decisions, trigger phrases, and file descriptions [SOURCE: `scripts/core/workflow.ts:551-849`], so the biggest win is to improve upstream data before that fan-out.

## 3. Placement Decision by Data Source

| Data Source | Recommended Placement | Why |
| --- | --- | --- |
| **Git status / diff / recent commits** | **Option B** - enrichment layer | Augments all downstream extractors equally and should be visible to `collectSessionData`, `extractDecisions`, and semantic summary generation. |
| **Spec folder parsing** | **Option B** - enrichment layer | Produces structured observations, pending tasks, blockers, and decisions before session synthesis. |
| **Claude Code session log capture** | **Option A** - inside `data-loader.ts` acquisition chain | It is an alternate primary conversation source, similar to OpenCode capture, not merely metadata enrichment. |
| **Enhanced file detection from git** | **Option B** - enrichment layer | Best treated as an upstream augmentation that merges into canonical `FILES` before `extractFilesFromData()` runs. |
| **Richer observation / decision building** | **Option B**, with **light Option C consumption logic** | Build synthetic observations before fan-out, then let `collect-session-data.ts` consume them. Keep a small guard in `collect-session-data.ts` for sparse sessions. |

### Why not pure Option A?

Putting all mining inside `data-loader.ts` would overload one module with acquisition, parsing, git execution, normalization, and merge policy. That blurs responsibilities and makes stateful vs stateless branching harder to reason about.

### Why not pure Option C?

Because `collectSessionData()` is only one branch of the `Promise.all()` fan-out. If mining happens there, `extractDecisions()` and `extractConversations()` still operate on the thin pre-enriched payload [SOURCE: `scripts/core/workflow.ts:500-548`].

## 4. Proposed Pipeline

### Proposed high-level flow

```text
CLI
  -> data-loader
       -> file data OR OpenCode capture OR Claude Code capture OR simulation seed
  -> enrichment layer
       -> git-context-extractor
       -> spec-folder-extractor
       -> merge + dedupe + provenance tagging
  -> collect-session-data
  -> workflow / decisions / conversations / diagrams
  -> render + quality scoring
```

### Concrete workflow insertion point

Insert a new step in `runWorkflow()` immediately after `collectedData` is loaded and before Step 2/Step 4 fan-out.

**Suggested order inside `runWorkflow()`:**

1. Load base `collectedData`
2. Detect spec folder
3. **If running stateless path, enrich `collectedData`**
4. Setup context directory
5. Run existing `Promise.all()` extraction fan-out

This keeps enrichment before all consumers and avoids duplicating mining logic across extractors.

## 5. New Module Proposals

## 5.1 `scripts/extractors/git-context-extractor.ts`

### Purpose

Mine repository state when stateless input is sparse but git metadata is available.

### Responsibilities

- Read `git status --short` for modified/untracked/deleted files
- Read `git diff --name-only --cached` and `git diff --name-only` for staged/unstaged coverage
- Read a bounded set of recent commits (for example last 5-10) with subject/body only
- Optionally derive light diff summaries using `--stat` instead of full patch text by default
- Emit:
  - additional `FILES`
  - synthetic `observations`
  - `recentContext` hints
  - provenance metadata and degradation warnings

### Suggested output shape

```ts
interface GitContextExtraction {
  FILES: FileEntry[];
  observations: Observation[];
  recentContext: RecentContext[];
  metadata: {
    source: 'git';
    usedStatus: boolean;
    usedDiff: boolean;
    usedCommits: boolean;
    degraded?: string[];
  };
}
```

### Design notes

- Prefer **status + name-only diff + diffstat** over full patches for latency control.
- Commit messages should create **medium-confidence** observations/decisions, not hard facts.
- Git-derived file descriptions should be marked synthetic, e.g. `Modified in working tree (git status)` or `Touched in recent commit: <subject>`.

## 5.2 `scripts/extractors/spec-folder-extractor.ts`

### Purpose

Parse spec-folder documents into structured signals that stateless mode can reuse.

### Responsibilities

- Parse these docs when present:
  - `spec.md`
  - `plan.md`
  - `tasks.md`
  - `checklist.md`
  - `decision-record.md`
  - `research.md`
  - `handover.md`
- Extract:
  - feature title / task title
  - explicit goals and requirements
  - plan milestones
  - task status (`[ ]`, `[x]`, blockers, deferred items)
  - decision statements
  - next-action phrases
  - implementation-summary style cues if present in scratch or related docs later
- Convert parsed content into:
  - structured observations
  - high-value recent context
  - better default summary / quick summary
  - spec-file metadata richer than simple presence detection

### Key improvement over current behavior

Current `detectRelatedDocs()` only says a file exists and labels its role [SOURCE: `scripts/extractors/session-extractor.ts:304-355`]. The new extractor should parse **content**, not just filenames.

## 5.3 `scripts/extractors/claude-code-capture.ts`

### Purpose

Provide a stateless fallback conversation source when OpenCode capture is unavailable or too thin.

### Responsibilities

- Discover Claude Code session artifacts via runtime-aware path discovery and/or exported session JSON
- Normalize Claude transcript/tool-call structure into the same output shape used by `transformOpencodeCapture()`
- Emit:
  - `userPrompts`
  - `observations`
  - `recentContext`
  - `FILES`
  - capture metadata

### Design constraints

- Must be **best-effort** and **non-fatal**
- Must tolerate format drift and missing session files
- Should follow the same spec-folder relevance filtering idea already used in `transformOpencodeCapture()` [SOURCE: `scripts/utils/input-normalizer.ts:353-379`]

### Loader integration

`data-loader.ts` should try:

1. explicit data file
2. OpenCode capture
3. **Claude Code capture**
4. simulation seed

This is the one part I would keep in acquisition rather than enrichment.

## 6. Recommended Enrichment Contract

To keep the current extractor ecosystem stable, enrich by **merging into the existing normalized shape** instead of inventing a parallel object graph.

### Merge target

Extend `LoadedData` / normalized data with optional provenance:

```ts
interface EnrichedLoadedData extends LoadedData {
  _source?: 'file' | 'opencode-capture' | 'claude-code-capture' | 'simulation';
  _enrichment?: {
    applied: boolean;
    sources: Array<'git' | 'spec-folder'>;
    degraded: string[];
  };
}
```

### Merge rules

1. **File-backed JSON remains authoritative**
   - never overwrite explicit `FILES`, `observations`, or `recentContext` with weaker synthetic data
2. **Conversation capture outranks git/spec summaries**
   - OpenCode or Claude prompts form the primary narrative when present
3. **Git/spec add coverage, not authority**
   - append synthetic observations with provenance markers
4. **Deduplicate by normalized file path**
   - prefer explicit descriptions over generic git descriptions
5. **Bound volume**
   - cap commit-derived observations and spec-derived snippets so quality improves without flooding render/scoring

## 7. Richer Observation and Decision Building

## 7.1 Observation synthesis strategy

Build synthetic observations upstream from each source:

- **Git status/diff**
  - `type: implementation`
  - narrative like `Modified 4 files in working tree; staged 2 files`
- **Git commits**
  - `type: decision` or `discovery` when commit subject contains decision language
  - otherwise `type: implementation`
- **Spec documents**
  - `spec.md` -> requirements / purpose observations
  - `plan.md` -> next-step observations
  - `tasks.md` / `checklist.md` -> pending task observations
  - `decision-record.md` -> explicit decision observations
- **Claude/OpenCode capture**
  - preserve as primary conversational observations

## 7.2 Decision synthesis strategy

Do **not** create a new decision channel first. Instead, synthesize decision-shaped observations so the existing decision extractor can benefit with minimal refactoring.

Examples:

- `Decision: prioritize spec parsing before Claude capture because deterministic project docs are always present`
- `Decision: use git diff --stat instead of full patch capture to keep stateless latency bounded`

This keeps the current fan-out intact while improving `extractDecisions(collectedData)`.

## 7.3 File detection strategy

Enhance file detection **before** `extractFilesFromData()` runs by merging:

- explicit `FILES`
- OpenCode/Claude tool-call files
- `git status` files
- staged/unstaged diff file names
- optionally spec doc references when directly changed

That directly addresses the current narrow file extraction surface [SOURCE: `scripts/extractors/file-extractor.ts:130-165`].

## 8. Data Flow Diagram

### Current

```text
generate-context.ts
  -> loadCollectedData()
       -> file | OpenCode | simulation
  -> runWorkflow()
       -> collectSessionData()
       -> extractConversations()
       -> extractDecisions()
       -> extractDiagrams()
  -> render memory file
```

### Proposed

```text
generate-context.ts
  -> loadCollectedData()
       -> file | OpenCode | Claude Code | simulation seed
  -> enrichStatelessData()
       -> git-context-extractor()
       -> spec-folder-extractor()
       -> mergeAndDedupe()
  -> run existing parallel extraction fan-out
       -> collectSessionData()
       -> extractConversations()
       -> extractDecisions()
       -> extractDiagrams()
  -> render memory file
```

### Proposed source-to-signal mapping

```text
Git status/diff/commits
  -> FILES + observations + recentContext

Spec docs
  -> observations + recentContext + richer summary/next action

Claude/OpenCode capture
  -> userPrompts + observations + FILES

Merged collectedData
  -> collectSessionData + conversations + decisions + semantic summary + trigger extraction
```

## 9. Risk Assessment

| Risk Area | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| **Performance** | Git commands add latency, especially on large repos | Medium | Use bounded commands (`status`, `name-only`, `--stat`, last N commits), parallelize git/spec reads inside enrichment, and skip patch bodies by default. |
| **Reliability** | Git may be unavailable or repo may be detached/empty | Medium | Best-effort extractor that returns empty result + degradation note; never fail save path. |
| **Reliability** | Claude Code session artifacts may be missing or format-shifted | High | Treat Claude capture as optional acquisition source; catch and downgrade cleanly to git/spec enrichment. |
| **Quality** | Mined git/spec data can be noisy or generic | Medium | Add provenance tags, confidence tiers, hard caps, and dedupe; prefer explicit capture content when available. |
| **Backward compatibility** | Stateful JSON mode could be polluted by synthetic stateless enrichment | High | Gate enrichment to stateless paths only; never enrich explicit file-backed input unless an explicit future flag allows it. |
| **Maintenance** | Mining rules spread across modules | Medium | Keep clear boundaries: acquisition in loader, augmentation in enrichment, synthesis in collect-session-data. |

## 10. Backward Compatibility Rules

1. **Do not change file-backed JSON behavior**
   - if `dataFile` is present, skip stateless enrichment by default
2. **Do not remove OpenCode capture**
   - Claude capture is additive, not a replacement
3. **Keep the normalized shape stable**
   - downstream extractors should still consume `observations`, `userPrompts`, `recentContext`, and `FILES`
4. **Keep simulation mode**
   - but convert it from the immediate fallback to the final fallback after capture + enrichment attempts

## 11. Implementation Order by Impact / Effort

## Phase 1 - Highest impact

**Implement the enrichment hook plus deterministic project-context mining**

- Add enrichment step in `workflow.ts`
- Add `spec-folder-extractor.ts`
- Add git-based file detection using `git status` + `git diff --name-only` + `--stat`
- Merge enriched `FILES`, `observations`, and `recentContext` before fan-out

### Why first

This is the best impact/effort ratio because spec docs and git working-tree state are usually present in stateless runs, deterministic, and immediately improve:

- `FILES`
- summary quality
- next-action extraction
- pending tasks / blockers
- trigger phrases and semantic summary

## Phase 2 - Medium impact

**Add bounded git history mining and richer synthetic decision building**

- Extend `git-context-extractor.ts` to mine recent commit subjects/bodies
- Create decision-shaped observations from commit messages and spec decision sections
- Teach `collect-session-data.ts` to use enrichment metadata for better `SUMMARY`, `QUICK_SUMMARY`, `NEXT_ACTION`, and resume context

### Why second

Commit mining adds good semantic depth, but it is slightly noisier and more latency-sensitive than status/spec parsing.

## Phase 3 - Nice to have / opportunistic

**Add Claude Code capture as alternate primary acquisition**

- Add `claude-code-capture.ts`
- Integrate it into `data-loader.ts` after OpenCode capture and before simulation
- Reuse the same normalization shape and relevance filtering ideas

### Why third

Claude capture can be valuable, but it has the highest format uncertainty and environment variance. It should improve quality when available, but the 60+ target should not depend on it.

## 12. Estimated LOC

## Core production changes

| File | Estimated LOC | Notes |
| --- | ---: | --- |
| `scripts/core/workflow.ts` | 25-45 | Insert enrichment step and stateless gating before parallel extraction |
| `scripts/loaders/data-loader.ts` | 35-70 | Add Claude fallback hook and source tagging |
| `scripts/utils/input-normalizer.ts` | 10-25 | Extend `DataSource` and optional enrichment metadata typing |
| `scripts/extractors/collect-session-data.ts` | 30-60 | Consume enriched summaries, context, and sparse-data fallback logic |
| `scripts/extractors/git-context-extractor.ts` | 140-190 | New git miner: status, diff names, diffstat, bounded commits |
| `scripts/extractors/spec-folder-extractor.ts` | 120-170 | New parser for spec / plan / tasks / checklist / decisions |
| `scripts/extractors/claude-code-capture.ts` | 110-170 | New alternate capture source with normalization |

### Estimated total

- **Without Claude capture (Phases 1-2):** ~360-560 LOC
- **With Claude capture (all phases):** ~470-730 LOC

## Optional validation/test additions

Expect an additional **120-220 LOC** of tests for:

- stateless enrichment merge behavior
- no-regression stateful mode tests
- git-unavailable fallback
- Claude capture unavailable / malformed cases

## 13. Final Architecture Decision

If the goal is to move stateless quality from ~30 to 60+ without risking stateful regressions, the cleanest design is:

1. **Keep `data-loader.ts` responsible for primary acquisition**
2. **Add a dedicated stateless enrichment layer before the workflow fan-out**
3. **Let downstream extractors keep consuming the same normalized shape**
4. **Use `collect-session-data.ts` only for synthesis plus a sparse-data safety net**

That gives the highest leverage with the least disruption to the current pipeline.
