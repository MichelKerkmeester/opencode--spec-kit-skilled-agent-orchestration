# Implementation Plan: Generate-Context Pipeline Quality

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + merged-partitions | v2.2 -->

## Part I: Audit & Remediation

### Phase Completion Status (012)

- [x] Phase A: Spec Folder Setup (Level 3) — COMPLETE
- [x] Phase B: 25-Agent Deep Audit — COMPLETE
- [x] Phase C: Synthesis & Remediation Manifest — COMPLETE
- [x] Phase D: Implementation (Fixes) — COMPLETE
- [x] Phase E: Documentation Update — COMPLETE

### Critical Files (Unified: Part I + Part II)

| File Path | Part | LOC / Phase | Notes |
|---|---|---|---|
| `scripts/extractors/opencode-capture.ts` | Part I + Part II | 539 + Phase 0 | Timestamp matching, truncation, validation; improve OpenCode session capture depth |
| `scripts/extractors/collect-session-data.ts` | Part I + Part II | 836 + Phase 0 | Task regex, learning formula, completion %; backfill SPEC_FOLDER and enrich context |
| `scripts/utils/input-normalizer.ts` | Part I + Part II | 499 + Phase 0 | Decision/confidence and relevance filtering; snake_case/camelCase fixes |
| `scripts/core/workflow.ts` | Part I + Part II | 950 + Phase 1 | Quality gates/error recovery; insert enrichment after alignment guards |
| `scripts/extractors/session-extractor.ts` | Part I | 478 | Session ID (crypto), phase detection |
| `scripts/core/quality-scorer.ts` (v1) | Part I + Part II | 146 + Phase 4 | Threshold calibration; deferred semantic density checks |
| `scripts/extractors/quality-scorer.ts` (v2) | Part I | 127 | Rule tuning, bonus math |
| `scripts/extractors/contamination-filter.ts` | Part I | 61 | Expand denylist (7 → 25+) |
| `scripts/core/config.ts` | Part I | 273 | Configurability for hardcoded values |
| `scripts/extractors/decision-extractor.ts` | Part I | 400 | Cue regex, sentence extraction |
| `scripts/loaders/data-loader.ts` | Part I + Part II | 195 + Phase 3 | Priority chain/sanitization; deferred Claude Code fallback integration |
| `scripts/renderers/template-renderer.ts` | Part I | 201 | Mustache rendering, placeholder suppression |
| `scripts/core/file-writer.ts` | Part I | n/a | Atomic write, placeholder validation, rollback |
| `scripts/core/tree-thinning.ts` | Part I | n/a | Token estimation, merge threshold, preservation |
| `scripts/memory/generate-context.ts` | Part I | 502 | CLI parsing, spec folder resolution |
| `templates/context_template.md` | Part I | ~27KB | Memory template output quality |
| `scripts/extractors/spec-folder-extractor.ts` | Part II | Phase 1 (new) | Parse spec folder docs for structured context |
| `scripts/extractors/git-context-extractor.ts` | Part II | Phase 2 (new) | Mine git status/diff/commits with provenance |
| `scripts/extractors/file-extractor.ts` | Part I + Part II | Phase 2 | Dedup/action mapping; preserve ACTION across pipeline |
| `scripts/extractors/claude-code-capture.ts` | Part II | Phase 3 (new, deferred) | Claude Code log ingestion with minimization |

### Preserved Source Content (Part I Source: 012/plan.md)

# Plan: Perfect Session Capturing

## Approach

Five-phase approach: spec setup → 25-agent deep audit → synthesis → implementation → documentation.

## Phase A: Spec Folder Setup (Level 3) ✅

Create L3 spec documentation in `012-perfect-session-capturing/`.

## Phase B: 25-Agent Deep Audit

### Stream 1: Deep Analysis — 5 Codex Agents (GPT-5.4 xhigh)

Cross-cutting architectural analysis across the entire pipeline.

| Agent | Focus |
|-------|-------|
| X01 | Data Flow & Architecture — map complete data flow, identify data loss points |
| X02 | Quality & Scoring — audit both quality scorers, calibration, false positives/negatives |
| X03 | Error Handling & Edge Cases — 0 messages, 1000 messages, corrupted JSON, concurrent writes |
| X04 | Template & Output Quality — compare template vs actual output, find artifacts |
| X05 | Security & Reliability — path sanitization, session ID, atomicity, TOCTOU races |

### Stream 2: File-Level Verification — 20 Copilot Agents (GPT-5.3-Codex)

Each agent audits 1-2 specific files, reading every line and reporting issues.

| Agent | Files | Focus |
|-------|-------|-------|
| C01 | opencode-capture.ts | Timestamp matching, output truncation, buildExchanges |
| C02 | collect-session-data.ts (1-400) | Config, types, learning index, preflight/postflight |
| C03 | collect-session-data.ts (400-837) | collectSessionData(), task regex, completion % |
| C04 | data-loader.ts | Priority chain, path sanitization, error handling |
| C05 | input-normalizer.ts | transformOpencodeCapture(), decision regex, confidence |
| C06 | workflow.ts (1-300) | runWorkflow(), data loading, session collection |
| C07 | workflow.ts (300-600) | Semantic summary, tree thinning, template rendering |
| C08 | workflow.ts (600+) | Quality scoring, file writing, indexing, error recovery |
| C09 | session-extractor.ts | Tool counting, context type, importance tier, session ID |
| C10 | file-extractor.ts | File extraction from 4 sources, dedup, MAX_FILES |
| C11 | decision-extractor.ts | Decision cue regex, sentence extraction, confidence |
| C12 | conversation-extractor.ts | Message assembly, phase classification, tool detection |
| C13 | diagram-extractor.ts | Phase extraction, ASCII art, flowchart generation |
| C14 | quality-scorer.ts (v1) | 6-dimension scoring, threshold calibration |
| C15 | quality-scorer.ts (v2) | Rule V1-V9, penalty/bonus math, flag emission |
| C16 | template-renderer.ts | Mustache rendering, placeholder suppression |
| C17 | file-writer.ts | Atomic write, placeholder validation, substance check |
| C18 | tree-thinning.ts | Token estimation, merge threshold, data preservation |
| C19 | config.ts + contamination-filter.ts | Config loading, denylist patterns |
| C20 | generate-context.ts + folder-detector.ts | CLI parsing, spec folder resolution |

## Phase C: Synthesis & Remediation Manifest

Parse all 25 scratch files, deduplicate findings, create prioritized remediation manifest (P0-P3).

## Phase D: Implementation (Fixes)

- D1: Critical Fixes (P0) — correctness, data loss, security
- D2: Quality Fixes (P1) — scoring, contamination, dedup
- D3: Design Improvements (P2) — configurability, phase detection
- D4: Build & Validate — `npx tsc --build`, regression test

## Phase E: Documentation Update

Update tasks.md, checklist.md, create implementation-summary.md, save memory context.

## Critical Files

| File | LOC | Expected Changes |
|------|-----|-----------------|
| opencode-capture.ts | 539 | Timestamp matching, truncation, validation |
| collect-session-data.ts | 836 | Task regex, learning formula, completion % |
| input-normalizer.ts | 499 | Decision regex, confidence, verify recent fix |
| workflow.ts | 950 | Quality gates, semantic summary, error recovery |
| session-extractor.ts | 478 | Session ID (crypto), phase detection |
| quality-scorer.ts (v1) | 146 | Threshold calibration |
| quality-scorer.ts (v2) | 127 | Rule tuning, bonus math |
| contamination-filter.ts | 61 | Expand denylist (7 → 25+) |
| config.ts | 273 | Add configurability for hardcoded values |
| decision-extractor.ts | 400 | Cue regex, sentence extraction |

## Verification

1. `npx tsc --build` — zero compilation errors
2. Run `generate-context.js` on 3 spec folders — verify quality scores improve
3. Run `validate.sh` on 012 spec folder — expect exit 0
4. Manually inspect generated memory files for quality
5. Verify session ID uses crypto (not Math.random)
6. Verify contamination filter covers 25+ patterns

---

## Part II: Stateless Quality Improvements

### Preserved Source Content (Part II Source: 013/plan.md)

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
- [ ] `qualityValidation.valid === true` for stateless saves (primary gate)
- [ ] No V8 (cross-spec contamination) or V9 (generic title) failures
- [ ] Legacy quality score >= 60/100 on repos with git history (secondary signal)
- [ ] No regression in stateful (JSON) mode quality
- [ ] No new CLI arguments required
- [ ] Semantic indexing succeeds for stateless saves
- [ ] Synthetic data carries provenance markers (not treated as live session evidence)
- [ ] All existing tests pass
- [ ] New enrichment modules have tests
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline enrichment (additive data augmentation before fan-out)

### Key Components

- **`scripts/utils/input-normalizer.ts`** (MODIFY Phase 0): Fix snake_case/camelCase field mismatch, add prompt-level relevance filtering
- **`scripts/extractors/collect-session-data.ts`** (MODIFY Phase 0): Backfill SPEC_FOLDER from CLI-known folder name
- **`scripts/extractors/spec-folder-extractor.ts`** (NEW Phase 1): Parses spec.md, plan.md, tasks.md, checklist.md, decision-record.md, description.json for structured context
- **`scripts/extractors/git-context-extractor.ts`** (NEW Phase 2): Mines git status, diff, and recent commits for file changes, observations, and context signals
- **`scripts/extractors/file-extractor.ts`** (MODIFY Phase 2): Preserve ACTION field through extraction pipeline
- **`scripts/core/workflow.ts`** (MODIFY Phase 1-2): Insert enrichment step AFTER alignment guards and spec resolution, before fan-out
- **`scripts/extractors/claude-code-capture.ts`** (NEW Phase 3, deferred): Reads Claude Code session logs from `~/.claude/projects/`
- **`scripts/loaders/data-loader.ts`** (MODIFY Phase 3, deferred): Add Claude Code capture as Priority 2.5 fallback

### Data Flow

**Current:**
```
CLI -> data-loader (file | OpenCode | simulation)
    -> workflow fan-out: collectSessionData + extractConversations + extractDecisions + extractDiagrams
    -> render + quality scoring
```

**Proposed:**
```
CLI -> data-loader (file | OpenCode | simulation seed)
    -> contamination/alignment guards (existing)
    -> spec folder resolution (existing)
    -> enrichStatelessData()  [AFTER guards, not before]
         -> spec-folder-extractor (spec.md, plan.md, tasks.md, etc.)
         -> git-context-extractor (status, diff, commits)
         -> mergeAndDedupe() with provenance markers
    -> workflow fan-out (enriched collectedData)
    -> render + quality scoring
```

> **Critical timing**: Enrichment runs AFTER the existing contamination/alignment guards
> (workflow.ts:443-472) and spec folder resolution, not immediately after data loading.
> This prevents synthetic files from masking cross-spec contamination.

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

### Phase 0: OpenCode-Path Hardening (highest leverage, lowest risk)

**Rationale**: The existing OpenCode capture path has field-name mismatches and missing prompt filtering that silently drop data. Fixing these before adding new extractors prevents building on a broken foundation. [Review finding: GPT-5.4]

- [ ] Fix snake_case/camelCase metadata mismatch in `input-normalizer.ts` (~15-25 LOC)
  - `opencode-capture.ts` emits snake_case fields (e.g., `tool_calls`, `file_path`)
  - `input-normalizer.ts:399+` reads camelCase (e.g., `toolCalls`, `filePath`)
  - Map both conventions so existing OpenCode data is not silently dropped
- [ ] Add prompt-level relevance filtering in `input-normalizer.ts` (~20-30 LOC)
  - `transformOpencodeCapture()` converts ALL exchanges into `userPrompts` (line 430)
  - Filter prompts by spec-folder relevance to prevent V8 cross-spec contamination
  - Reuse existing spec-folder-hint matching pattern
- [ ] Backfill `SPEC_FOLDER` from CLI-known folder name in `collect-session-data.ts` (~10 LOC)
  - When `collectedData.SPEC_FOLDER` is missing but `specFolderName` is known from CLI, set it
  - Fixes data loss point 3: `detectRelatedDocs()` re-enabled
  - Note: `detectRelatedDocs()` has a parent-doc assumption requiring grandparent to be `specs`; category-rooted `.opencode/specs/...` folders may still miss parent docs

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
  - All returned items include `_provenance: 'spec-folder'` marker
- [ ] Add `enrichStatelessData()` function in `scripts/core/workflow.ts` (~25-45 LOC)
  - Gate: only runs for stateless path (match existing detection at workflow.ts:447)
  - **Insert AFTER** contamination/alignment guards (workflow.ts:443-472) and spec resolution
  - Call spec-folder-extractor with resolved spec folder path
  - Merge extracted data into collectedData object with provenance markers
- [ ] Ensure synthetic timestamps use stable ordering (~5 LOC)
  - Enriched observations get timestamps that do not distort `lastAction`/`nextAction`
  - Use sentinel timestamps (e.g., epoch 0) or explicit `_synthetic: true` flag

### Phase 2: Git Context Mining (high impact)

**Rationale**: Git provides the strongest evidence of what changed during a session, even when conversation logs are absent [R03, R08, R09].

**Stale research note**: R02/R06 describe generic `Tool: read` observation titles, but current code already has `buildToolObservationTitle()` in `input-normalizer.ts:353`. Phase 2 observation title work should verify what is already fixed before adding changes.

- [ ] Create `scripts/extractors/git-context-extractor.ts` (~140-190 LOC)
  - `git status --porcelain` for current uncommitted changes -> FILES with ACTION
  - `git diff --name-status HEAD~N` for recent committed changes -> FILES
    - Check available rev count first: `git rev-list --count HEAD` to avoid HEAD~5 failure on shallow repos
  - `git log --format="%H%n%s%n%b%n---%n" --since="24 hours ago" -20` for recent commit subjects/bodies -> observations
  - Map conventional commit prefixes to observation types: `fix:` -> bugfix, `feat:` -> feature, `refactor:` -> refactor, `docs:` -> documentation
  - `git diff --stat HEAD~N` for change magnitude -> summary context
  - Error handling: graceful fallback if git unavailable (not in repo, git not installed, shallow clone)
  - Performance: cap at 20 commits, 24h window, no full patch bodies
  - All returned items include `_provenance: 'git'` marker
- [ ] Extend `enrichStatelessData()` to call git-context-extractor
  - Merge git-derived FILES with spec-derived FILES (deduplicate by path)
  - Merge git-derived observations with spec-derived observations
  - Build enriched `recentContext` and `SUMMARY` from combined signals
  - Provenance-aware merge: downstream extractors can distinguish synthetic vs live data
- [ ] Preserve ACTION field through file extraction in `file-extractor.ts` (~15-20 LOC)
  - Current `extractFilesFromData()` drops everything except path and description
  - Add optional `action` field (add/modify/delete/rename) so git rename/delete accuracy survives to render
- [ ] Verify observation title uniqueness (check if already fixed) (~5-15 LOC)
  - Audit current `buildToolObservationTitle()` output
  - Only add changes if dedup ratio still below 0.7

### Phase 3: Claude Code Capture (deferred — medium impact, higher risk)

**Rationale**: Claude Code stores rich session logs at `~/.claude/projects/` with full tool call details and file-history snapshots [R05]. However, schema drift, privacy concerns, and `thinking` content exposure require tighter specification before implementation. [Review recommendation: defer until OpenCode path is hardened]

**Prerequisites**: Phases 0-2 complete and validated.

- [ ] Create `scripts/extractors/claude-code-capture.ts` (~110-170 LOC)
  - Discover project folder: sanitize cwd to `~/.claude/projects/<sanitized-path>/`
  - Find latest session transcript: newest `*.jsonl` in project folder
  - Parse `assistant` records for tool calls (name, input, file_path)
  - **Exclude** `thinking` content blocks from extraction (privacy/size)
  - Parse `file-history-snapshot` records for touched files
  - Read `~/.claude/history.jsonl` for matching session prompts
  - **Require** exact project AND sessionId matching (prevent cross-project contamination)
  - Normalize into `TransformedCapture` shape (same as OpenCode output)
  - Security: canonicalize paths, scope to current project, redact sensitive content
  - **Hard requirement**: Content minimization — summarize rather than verbatim capture
- [ ] Integrate into `data-loader.ts` as Priority 2.5 (~35-70 LOC)
  - After OpenCode capture fails, before simulation fallback
  - Same error handling pattern: try/catch with graceful degradation
- [ ] Add spec-folder relevance filtering (reuse existing pattern from `transformOpencodeCapture`)

### Phase 4: Quality Scoring Calibration (deferred — nice to have)

**Rationale**: R06 found scorers overestimate stateless quality. After enrichment raises real quality, calibrate scoring to differentiate truly rich vs thin saves. Consider splitting into a separate spec folder. [Review recommendation: defer or split]

**Prerequisites**: Phases 0-2 complete and quality baselines established.

- [ ] Add semantic density check to legacy scorer (file descriptions > 20 chars and not generic)
- [ ] Add summary specificity check (not generic fallback text)
- [ ] Add observation semantic diversity check (beyond title uniqueness)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | snake_case/camelCase field mapping in input-normalizer | Vitest |
| Unit | prompt relevance filtering (spec-folder hint matching) | Vitest |
| Unit | spec-folder-extractor parsing, git-context-extractor parsing | Vitest |
| Unit | Provenance marker propagation through extraction pipeline | Vitest |
| Unit | Claude Code capture discovery, transcript parsing (Phase 3) | Vitest |
| Integration | Full stateless workflow with enrichment (mock git, mock spec folder) | Vitest |
| Regression | Stateful mode produces identical output with enrichment disabled | Vitest |
| Manual | Run `node generate-context.js specs/folder` on real repo, verify `qualityValidation.valid` | CLI |

### Key Test Cases

- OpenCode capture with snake_case metadata fields (field-name mismatch)
- Prompt filtering: foreign-spec prompts excluded, relevant prompts kept
- Spec folder with all docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- Spec folder with only spec.md and description.json (early-phase)
- Empty spec folder (only .gitkeep)
- Repo with rich git history (many recent commits)
- Repo with no git history (new repo)
- Shallow repo where HEAD~5 is unavailable
- Clean repo with no uncommitted changes
- Git not available (not in a repo)
- Git rename/delete ACTION preserved through file extraction
- Synthetic timestamps do not distort lastAction/nextAction ordering
- Cross-spec contamination: mixed-spec userPrompts filtered
- Provenance markers present on all enriched observations and files
- Claude Code logs present vs absent (Phase 3)
- Claude transcript with `thinking` blocks (must be excluded, Phase 3)
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

- **Trigger**: Stateful mode regression, enrichment causing errors, quality score decrease, V-rule failures
- **Procedure**: The enrichment step is gated by stateless detection (matching workflow.ts:447). Removing the `enrichStatelessData()` call in `workflow.ts` restores original behavior. Phase 0 fixes (field mapping, prompt filtering) are standalone improvements that should NOT be rolled back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (OpenCode Hardening) ──► Phase 1 (Spec Folder Mining) ─────────┐
                                                                        ├──► Phase 3 (Claude Code, deferred)
                                 Phase 2 (Git Mining) ─────────────────┘         |
                                                                        Phase 4 (Scoring, deferred)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0: OpenCode Hardening | None | Phases 1-4 |
| Phase 1: Spec Folder Mining | Phase 0 | Phase 3, Phase 4 |
| Phase 2: Git Mining | Phase 0 (parallel with Phase 1) | Phase 4 |
| Phase 3: Claude Code Capture (deferred) | Phases 0-2 | Phase 4 |
| Phase 4: Scoring Calibration (deferred) | Phases 0-2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC | Files |
|-------|------------|---------------|-------|
| Phase 0: OpenCode Hardening | Low-Medium | 45-65 | 2 modified |
| Phase 1: Spec Folder Mining + Hook | Medium | 150-220 | 1 new + 2 modified |
| Phase 2: Git Mining + File Extraction | Medium | 160-225 | 1 new + 2 modified |
| Phase 3: Claude Code Capture (deferred) | Medium-High | 145-240 | 1 new + 1 modified |
| Phase 4: Scoring Calibration (deferred) | Low | 30-50 | 1 modified |
| Tests (Phases 0-2) | Medium | 140-240 | 4-6 new test files |
| **Total (Phases 0-2)** | | **495-750 LOC** | **2 new + 6 modified** |
| **Total (all phases)** | | **670-1040 LOC** | **3 new + 7-8 modified** |
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
| `scripts/utils/input-normalizer.ts` | Modify | 0 | Fix snake_case/camelCase mismatch, add prompt relevance filtering |
| `scripts/extractors/collect-session-data.ts` | Modify | 0 | Backfill SPEC_FOLDER from CLI-known folder name |
| `scripts/extractors/spec-folder-extractor.ts` | Create | 1 | Parse spec folder docs for structured context with provenance |
| `scripts/core/workflow.ts` | Modify | 1 | Insert enrichment step AFTER alignment guards |
| `scripts/extractors/git-context-extractor.ts` | Create | 2 | Mine git status, diff, commits with provenance |
| `scripts/extractors/file-extractor.ts` | Modify | 2 | Preserve ACTION field through extraction pipeline |
| `scripts/extractors/claude-code-capture.ts` | Create | 3 (deferred) | Read Claude Code session logs with content minimization |
| `scripts/loaders/data-loader.ts` | Modify | 3 (deferred) | Add Claude Code as Priority 2.5 fallback |
| `scripts/core/quality-scorer.ts` | Modify | 4 (deferred) | Add semantic density checks |

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

### Stale Research Notes

| Report | Issue | Status |
|--------|-------|--------|
| R02 | Describes generic `Tool: read` titles, but `buildToolObservationTitle()` already exists | Partly fixed in current code |
| R04 | Claims "only spec.md + description.json" for early folders | Stale — current folders have more files |
| R06 | Observation dedup analysis assumes generic titles | Verify against current `buildToolObservationTitle()` output |

## REVIEW EVIDENCE

**Reviewer**: GPT-5.4 (xhigh reasoning, 496K tokens)
**Verdict**: REVISE (conditions applied)
**Date**: 2026-03-08

Fixes applied from review:
1. Added Phase 0 for OpenCode-path defect hardening (snake_case mismatch, prompt filtering)
2. Reframed acceptance criteria around `qualityValidation.valid` (primary) and legacy score (secondary)
3. Added provenance markers as mandatory on all synthetic observations and files
4. Added cross-spec contamination filtering as P0 requirement
5. Moved enrichment insertion AFTER alignment guards (workflow.ts:443-472)
6. Marked Phase 3 (Claude Code) and Phase 4 (scoring) as deferred
7. Added shallow repo, git rename/delete, timestamp ordering test cases
8. Noted stale research findings (R02, R04, R06) for verification before implementation
