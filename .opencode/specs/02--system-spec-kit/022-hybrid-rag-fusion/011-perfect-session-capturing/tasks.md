# Tasks: Generate-Context Pipeline Quality

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + merged-partitions | v2.2 -->

<!-- ANCHOR:part-i -->
## Part I: Audit & Remediation

# Tasks: Perfect Session Capturing

## Phase A: Spec Folder Setup
- [x] A1: Create description.json
- [x] A2: Create spec.md
- [x] A3: Create plan.md
- [x] A4: Create tasks.md
- [x] A5: Create checklist.md
- [x] A6: Create decision-record.md

## Phase B: 25-Agent Deep Audit
- [x] B1: Create launch-session-audit.sh script
- [x] B2: Launch Stream 1 (X01-X05) — Codex deep analysis agents
- [x] B3: Launch Stream 2 (C01-C20) — Codex file-level verification agents
- [x] B4: Verify all 25 scratch files collected

## Phase C: Synthesis & Remediation Manifest
- [x] C1: Parse all 25 scratch files, extract FINDING blocks
- [x] C2: Create scratch/remediation-manifest.md (P0-P3 prioritized)
- [x] C3: Create scratch/analysis-summary.md (statistics, patterns)

## Phase D: Implementation

### D1: Critical Fixes (P0) — Security/Data Loss
- [x] Fix 1: Session ID uses `crypto.randomBytes()` instead of `Math.random()` (session-extractor.ts)
- [x] Fix 2: Temp file concurrency — random suffix instead of predictable `.tmp` (file-writer.ts)
- [x] Fix 3: Batch rollback — previously written files cleaned up on failure (file-writer.ts)

### D2: Quality Fixes (P1) — Scoring/Filtering/Correctness
- [x] Fix 4: Contamination filter expanded from 7 to 30+ denylist patterns (contamination-filter.ts)
- [x] Fix 5: Decision confidence computed from evidence (50/65/70) instead of hardcoded 75 (decision-extractor.ts)
- [x] Fix 6: HTML stripping is code-block-safe — selective tag removal (workflow.ts)
- [x] Fix 7: memoryId check uses `!== null` instead of truthiness — handles valid ID 0 (workflow.ts)
- [x] Fix 8: File description dedup prefers longer (more descriptive) descriptions (file-extractor.ts)
- [x] Fix 9: File action mapping expanded from 2 to 5 values (Created/Modified/Deleted/Read/Renamed) (file-extractor.ts)
- [x] Fix 10: Postflight delta computation only when both preflight and postflight scores exist (collect-session-data.ts)
- [x] Fix 11: No-tool sessions return RESEARCH phase instead of falling through to IMPLEMENTATION (session-extractor.ts)

### D3: Design Improvements (P2) — Configurability
- [x] Fix 12: TOOL_OUTPUT_MAX_LENGTH configurable via config.ts (opencode-capture.ts)
- [x] Fix 13: TIMESTAMP_MATCH_TOLERANCE_MS configurable via config.ts (opencode-capture.ts)
- [x] Fix 14: MAX_FILES_IN_MEMORY configurable via config.ts
- [x] Fix 15: MAX_OBSERVATIONS configurable via config.ts
- [x] Fix 16: MIN_PROMPT_LENGTH configurable via config.ts
- [x] Fix 17: MAX_CONTENT_PREVIEW configurable via config.ts
- [x] Fix 18: TOOL_PREVIEW_LINES configurable via config.ts

### D4: Code Hygiene (P3)
- [x] Fix 19: Cleaned redundant `catch (_error) { if (_error instanceof Error) { void _error.message; } }` pattern across all files
- [x] Fix 20: Cleaned description tracking error handling in workflow.ts

### D5: Build & Validate
- [x] `npx tsc --build` — zero compilation errors after all fixes

## Phase E: Documentation
- [x] E1: Update tasks.md with concrete items from manifest
- [x] E2: Update checklist.md with verification results
- [x] E3: Create implementation-summary.md
- [x] E4: Save memory context via generate-context.js

<!-- /ANCHOR:part-i -->
<!-- ANCHOR:part-ii -->
## Part II: Stateless Quality Improvements

## Phase 0: OpenCode-Path Hardening (highest leverage, lowest risk)
- [ ] Fix snake_case/camelCase metadata mismatch in `input-normalizer.ts` (~15-25 LOC)
- [ ] Map both snake_case and camelCase conventions so existing OpenCode data is not silently dropped
- [ ] Add prompt-level relevance filtering in `input-normalizer.ts` (~20-30 LOC)
- [ ] Filter prompts by spec-folder relevance to prevent V8 cross-spec contamination
- [ ] Backfill `SPEC_FOLDER` from CLI-known folder name in `collect-session-data.ts` (~10 LOC)
- [ ] Re-enable `detectRelatedDocs()` path via `SPEC_FOLDER` backfill

## Phase 1: Enrichment Hook + Spec Folder Mining (highest impact)
- [ ] Create `scripts/extractors/spec-folder-extractor.ts` (~120-170 LOC)
- [ ] Parse `description.json` metadata (id, name, title, status, level, parent)
- [ ] Parse `spec.md` YAML frontmatter (title, trigger_phrases, importance_tier)
- [ ] Parse `spec.md` problem/purpose and files-to-change table
- [ ] Parse `plan.md` phases and implementation steps
- [ ] Parse `tasks.md` checkbox status for completion percentage
- [ ] Parse `checklist.md` verification status and `decision-record.md` decisions
- [ ] Return `SpecFolderExtraction { observations, FILES, recentContext, summary, triggerPhrases, decisions, sessionPhase }`
- [ ] Mark all extracted items with `_provenance: 'spec-folder'`
- [ ] Add `enrichStatelessData()` in `scripts/core/workflow.ts` (~25-45 LOC)
- [ ] Insert enrichment AFTER contamination/alignment guards and spec resolution
- [ ] Merge extracted data into `collectedData` with provenance markers
- [ ] Ensure synthetic timestamps use stable ordering (~5 LOC)

## Phase 2: Git Context Mining (high impact)
- [ ] Create `scripts/extractors/git-context-extractor.ts` (~140-190 LOC)
- [ ] Use `git status --porcelain` for uncommitted changes -> FILES with ACTION
- [ ] Use `git diff --name-status HEAD~N` for recent committed changes -> FILES
- [ ] Check available revision count first via `git rev-list --count HEAD`
- [ ] Use `git log --format="%H%n%s%n%b%n---%n" --since="24 hours ago" -20` for observations
- [ ] Map conventional commit prefixes (`fix:`, `feat:`, `refactor:`, `docs:`) to observation types
- [ ] Use `git diff --stat HEAD~N` for summary context
- [ ] Add graceful git fallback behavior (not in repo, git unavailable, shallow clone)
- [ ] Cap mining scope to 20 commits and 24-hour window
- [ ] Mark all git-derived items with `_provenance: 'git'`
- [ ] Extend `enrichStatelessData()` to merge git and spec-folder signals
- [ ] Deduplicate merged FILES by normalized file path
- [ ] Preserve ACTION field through `file-extractor.ts` (~15-20 LOC)
- [ ] Verify observation title uniqueness and only patch if dedup ratio remains below 0.7

## Phase 3: Claude Code Capture (deferred — medium impact, higher risk)
- [ ] Create `scripts/extractors/claude-code-capture.ts` (~110-170 LOC)
- [ ] Discover project folder at `~/.claude/projects/<sanitized-path>/`
- [ ] Parse newest session transcript `*.jsonl` in project folder
- [ ] Parse assistant tool calls (name, input, file_path)
- [ ] Exclude `thinking` content blocks from extraction
- [ ] Parse `file-history-snapshot` touched files
- [ ] Parse `~/.claude/history.jsonl` for matching prompts
- [ ] Require exact project and sessionId matching
- [ ] Normalize output into `TransformedCapture` shape
- [ ] Enforce content minimization and path/security safeguards
- [ ] Integrate Claude Code capture in `data-loader.ts` as Priority 2.5 (~35-70 LOC)
- [ ] Keep graceful fallback to simulation when capture unavailable
- [ ] Add spec-folder relevance filtering for Claude path

## Phase 4: Quality Scoring Calibration (deferred — nice to have)
- [ ] Add semantic density check to legacy scorer (file descriptions > 20 chars and not generic)
- [ ] Add summary specificity check (not generic fallback text)
- [ ] Add observation semantic diversity check (beyond title uniqueness)
<!-- /ANCHOR:part-ii -->
