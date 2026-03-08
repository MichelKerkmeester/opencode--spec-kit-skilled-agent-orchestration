---
title: "Implementation Plan: Improve Stateless Mode Quality"
description: "Increase stateless memory save quality from ~30/100 to 60+/100 by adding a stateless enrichment layer that mines git history, spec folder contents, and Claude Code session logs before the workflow fan-out."
trigger_phrases:
  - "stateless mode"
  - "memory save quality"
  - "generate-context quality"
  - "improve stateless"
  - "enrichment layer"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Improve Stateless Mode Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, Bun runtime) |
| **Framework** | Custom pipeline (generate-context.js) |
| **Storage** | SQLite (memory MCP), filesystem (spec folders) |
| **Testing** | Vitest |

### Overview

Stateless memory saves via `generate-context.js` produce quality scores around 30/100 because the data loader skips the rich JSON schema and reconstructs only a thin session model from OpenCode capture or simulation fallback. This plan adds a **stateless enrichment layer** between data loading and the workflow fan-out that mines git history, spec folder contents, and optionally Claude Code session logs. The enrichment layer populates the same normalized data shape consumed by existing extractors, improving quality without modifying the stateful path.

### Root Cause Analysis (from 10 parallel research agents)

The stateless code path has 5 data loss points [R01]:

1. **JSON normalization skipped entirely** when `CONFIG.DATA_FILE = null` (`data-loader.ts:80-140`)
2. **OpenCode transform produces thin data**: 80-char titles, edit/write-only files, no decisions (`input-normalizer.ts:353-482`)
3. **Missing `SPEC_FOLDER` disables related-doc enrichment** (`collect-session-data.ts:725-739`)
4. **Learning telemetry (preflight/postflight) collapses to null** (`collect-session-data.ts:198-304`)
5. **Simulation fallback loses all semantic content** (`data-loader.ts:180-186`)

Quality scoring gap analysis [R06] revealed the legacy scorer **overestimates** stateless quality (~55-75, not ~30) because floor helpers rescue triggers/topics and template length maxes content. The real problem is semantic thinness, not numeric penalties. Key weak dimensions: observation dedup (repeated tool titles), generic summaries, missing decisions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md exists)
- [x] Success criteria measurable (quality score >= 60/100)
- [x] Dependencies identified (git, spec folder, optional Claude Code logs)

### Definition of Done
- [ ] Stateless quality score >= 60/100 on repos with git history
- [ ] No regression in stateful (JSON) mode quality
- [ ] No new CLI arguments required
- [ ] Semantic indexing succeeds for stateless saves
- [ ] All existing tests pass
- [ ] New enrichment modules have tests
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline enrichment (additive data augmentation before fan-out)

### Key Components

- **`scripts/extractors/git-context-extractor.ts`** (NEW): Mines git status, diff, and recent commits for file changes, observations, and context signals
- **`scripts/extractors/spec-folder-extractor.ts`** (NEW): Parses spec.md, plan.md, tasks.md, checklist.md, decision-record.md, description.json for structured context
- **`scripts/extractors/claude-code-capture.ts`** (NEW): Reads Claude Code session logs from `~/.claude/projects/` as alternate conversation source
- **`scripts/core/workflow.ts`** (MODIFY): Insert enrichment step after data loading, before parallel extraction fan-out
- **`scripts/loaders/data-loader.ts`** (MODIFY): Add Claude Code capture as Priority 2.5 fallback between OpenCode and simulation
- **`scripts/extractors/collect-session-data.ts`** (MODIFY): Consume enriched SPEC_FOLDER field for related-doc detection
- **`scripts/utils/input-normalizer.ts`** (MODIFY): Extend DataSource type, improve observation title quality

### Data Flow

**Current:**
```
CLI -> data-loader (file | OpenCode | simulation)
    -> workflow fan-out: collectSessionData + extractConversations + extractDecisions + extractDiagrams
    -> render + quality scoring
```

**Proposed:**
```
CLI -> data-loader (file | OpenCode | Claude Code | simulation seed)
    -> enrichStatelessData()
         -> git-context-extractor (status, diff, commits)
         -> spec-folder-extractor (spec.md, plan.md, tasks.md, etc.)
         -> mergeAndDedupe()
    -> workflow fan-out (enriched collectedData)
    -> render + quality scoring
```

### Enrichment Merge Rules [R10]

1. **File-backed JSON remains authoritative** - never overwrite explicit data with synthetic data
2. **Conversation capture outranks git/spec summaries** - OpenCode/Claude prompts form primary narrative
3. **Git/spec add coverage, not authority** - append synthetic observations with provenance markers
4. **Deduplicate by normalized file path** - prefer explicit descriptions over generic git descriptions
5. **Bound volume** - cap commit-derived observations (max 20) and spec-derived snippets to prevent flooding
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Enrichment Hook + Spec Folder Mining (highest impact)

**Rationale**: Spec docs are always present in stateless runs (the spec folder IS the CLI target) and provide deterministic, high-quality context [R04].

- [ ] Create `scripts/extractors/spec-folder-extractor.ts` (~120-170 LOC)
  - Parse `description.json` for metadata (id, name, title, status, level, parent)
  - Parse `spec.md` YAML frontmatter for title, trigger_phrases, importance_tier
  - Parse `spec.md` problem/purpose sections for summary text
  - Parse `spec.md` files-to-change table for file list
  - Parse `plan.md` phases and implementation steps for next-action hints
  - Parse `tasks.md` checkbox status for completion percentage
  - Parse `checklist.md` for verification status
  - Parse `decision-record.md` for explicit decision observations
  - Return `SpecFolderExtraction { observations, FILES, recentContext, summary, triggerPhrases, decisions, sessionPhase }`
- [ ] Add `enrichStatelessData()` function in `scripts/core/workflow.ts` (~25-45 LOC)
  - Gate: only runs when `_source !== 'file'` (stateless path)
  - Call spec-folder-extractor with resolved spec folder path
  - Merge extracted data into collectedData object
  - Set `collectedData.SPEC_FOLDER` from CLI-known folder name (fixes data loss point 3)
- [ ] Fix `collect-session-data.ts` to use CLI-known spec folder for related-doc detection (~10 LOC)
  - When `collectedData.SPEC_FOLDER` is missing but `specFolderName` is known from CLI, use it for `specFolderPath` computation

### Phase 2: Git Context Mining (high impact)

**Rationale**: Git provides the strongest evidence of what changed during a session, even when conversation logs are absent [R03, R08, R09].

- [ ] Create `scripts/extractors/git-context-extractor.ts` (~140-190 LOC)
  - `git status --porcelain` for current uncommitted changes -> FILES with ACTION
  - `git diff --name-status HEAD~5` for recent committed changes -> FILES
  - `git log --format="%H%n%s%n%b%n---%n" --since="24 hours ago" -20` for recent commit subjects/bodies -> observations
  - Map conventional commit prefixes to observation types: `fix:` -> bugfix, `feat:` -> feature, `refactor:` -> refactor, `docs:` -> documentation
  - `git diff --stat HEAD~5` for change magnitude -> summary context
  - Error handling: graceful fallback if git unavailable (not in repo, git not installed)
  - Performance: cap at 20 commits, 24h window, no full patch bodies
- [ ] Extend `enrichStatelessData()` to call git-context-extractor
  - Merge git-derived FILES with spec-derived FILES (deduplicate by path)
  - Merge git-derived observations with spec-derived observations
  - Build enriched `recentContext` and `SUMMARY` from combined signals
- [ ] Improve observation titles in `input-normalizer.ts` (~15-25 LOC)
  - Change `Tool: ${tool.tool}` to `${tool.tool}: ${basename(file)} - ${tool.title || action}` for uniqueness
  - Fixes observation dedup penalty (largest legacy scoring weakness per R06)

### Phase 3: Claude Code Capture (medium impact, higher risk)

**Rationale**: Claude Code stores rich session logs at `~/.claude/projects/` with full tool call details and file-history snapshots [R05]. This provides conversation-level data when OpenCode capture is unavailable.

- [ ] Create `scripts/extractors/claude-code-capture.ts` (~110-170 LOC)
  - Discover project folder: sanitize cwd to `~/.claude/projects/<sanitized-path>/`
  - Find latest session transcript: newest `*.jsonl` in project folder
  - Parse `assistant` records for tool calls (name, input, file_path)
  - Parse `file-history-snapshot` records for touched files
  - Read `~/.claude/history.jsonl` for matching session prompts
  - Normalize into `TransformedCapture` shape (same as OpenCode output)
  - Security: canonicalize paths, scope to current project, avoid cross-project contamination
- [ ] Integrate into `data-loader.ts` as Priority 2.5 (~35-70 LOC)
  - After OpenCode capture fails, before simulation fallback
  - Same error handling pattern: try/catch with graceful degradation
- [ ] Add spec-folder relevance filtering (reuse existing pattern from `transformOpencodeCapture`)

### Phase 4: Quality Scoring Calibration (nice to have)

**Rationale**: R06 found scorers overestimate stateless quality. After enrichment raises real quality, calibrate scoring to differentiate truly rich vs thin saves.

- [ ] Add semantic density check to legacy scorer (file descriptions > 20 chars and not generic)
- [ ] Add summary specificity check (not generic fallback text)
- [ ] Add observation semantic diversity check (beyond title uniqueness)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | spec-folder-extractor parsing, git-context-extractor parsing, observation title generation | Vitest |
| Unit | Claude Code capture discovery, transcript parsing | Vitest |
| Integration | Full stateless workflow with enrichment (mock git, mock spec folder) | Vitest |
| Regression | Stateful mode produces identical output with enrichment disabled | Vitest |
| Manual | Run `node generate-context.js specs/folder` on real repo, verify score >= 60 | CLI |

### Key Test Cases

- Spec folder with all docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- Spec folder with only spec.md and description.json (early-phase)
- Empty spec folder (only .gitkeep)
- Repo with rich git history (many recent commits)
- Repo with no git history (new repo)
- Git not available (not in a repo)
- Claude Code logs present vs absent
- Stateful mode unchanged (no enrichment applied)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git CLI | External | Green | Graceful degradation: skip git mining |
| Spec folder files | Internal | Green | Always available (folder is CLI target) |
| Claude Code logs (~/.claude/) | External | Yellow | Optional: skip if unavailable |
| child_process (execSync) | Node stdlib | Green | Already used in session-extractor.ts |
| Existing extractor interfaces | Internal | Green | No interface changes needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stateful mode regression, enrichment causing errors, quality score decrease
- **Procedure**: The enrichment step is gated by `_source !== 'file'`. Removing the enrichment call in `workflow.ts` restores original behavior. All new modules are additive with no existing file modifications beyond the insertion point.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spec Folder Mining) ─────────┐
                                       ├──► Phase 3 (Claude Code) ──► Phase 4 (Scoring)
Phase 2 (Git Mining) ─────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Spec Folder Mining | None | Phase 3, Phase 4 |
| Phase 2: Git Mining | None (parallel with Phase 1) | Phase 4 |
| Phase 3: Claude Code Capture | Phase 1 (enrichment hook) | Phase 4 |
| Phase 4: Scoring Calibration | Phases 1-3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC | Files |
|-------|------------|---------------|-------|
| Phase 1: Spec Folder Mining + Hook | Medium | 150-215 | 3 new + 2 modified |
| Phase 2: Git Mining | Medium | 155-215 | 1 new + 1 modified |
| Phase 3: Claude Code Capture | Medium-High | 145-240 | 1 new + 1 modified |
| Phase 4: Scoring Calibration | Low | 30-50 | 1 modified |
| Tests | Medium | 120-220 | 3-5 new test files |
| **Total** | | **600-940 LOC** | **5-7 new + 4-5 modified** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing tests pass before changes
- [ ] Stateful mode baseline quality score recorded
- [ ] Enrichment gated behind stateless-only check

### Rollback Procedure
1. Comment out `enrichStatelessData()` call in workflow.ts
2. Run test suite to verify no regressions
3. Stateful mode behavior unchanged (never touched)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (additive changes only)
<!-- /ANCHOR:enhanced-rollback -->

---

## FILES TO CHANGE

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `scripts/extractors/spec-folder-extractor.ts` | Create | 1 | Parse spec folder docs for structured context |
| `scripts/core/workflow.ts` | Modify | 1 | Insert enrichment step before fan-out |
| `scripts/extractors/collect-session-data.ts` | Modify | 1 | Use CLI-known folder for related-doc detection |
| `scripts/extractors/git-context-extractor.ts` | Create | 2 | Mine git status, diff, commits |
| `scripts/utils/input-normalizer.ts` | Modify | 2 | Improve observation titles, extend DataSource |
| `scripts/extractors/claude-code-capture.ts` | Create | 3 | Read Claude Code session logs |
| `scripts/loaders/data-loader.ts` | Modify | 3 | Add Claude Code as Priority 2.5 fallback |
| `scripts/core/quality-scorer.ts` | Modify | 4 | Add semantic density checks |

## RESEARCH EVIDENCE

All findings documented in 10 scratch files by parallel research agents:

| Report | File | Key Finding |
|--------|------|-------------|
| R01 | `scratch/R01-code-path-trace.md` | 5 data loss points identified, SPEC_FOLDER missing is avoidable |
| R02 | `scratch/R02-opencode-capture-analysis.md` | OpenCode transform discards most tool call detail |
| R03 | `scratch/R03-git-history-mining.md` | Git barely used today, 5 bounded commands proposed |
| R04 | `scratch/R04-spec-folder-mining.md` | Rich structured data in spec docs never parsed |
| R05 | `scratch/R05-claude-code-logs.md` | Claude Code JSONL at ~/.claude/ with full tool traces |
| R06 | `scratch/R06-quality-scoring-gap.md` | Scorers overestimate stateless; semantic thinness is real issue |
| R07 | `scratch/R07-input-normalizer-enhancement.md` | Transform produces minimal data, many fields discarded |
| R08 | `scratch/R08-file-detection-enhancement.md` | Add git as Source 4 in extractFilesFromData |
| R09 | `scratch/R09-observation-decision-building.md` | Git commits strongest stateless signal for observations |
| R10 | `scratch/R10-integration-architecture.md` | Option B (enrichment layer) recommended architecture |
