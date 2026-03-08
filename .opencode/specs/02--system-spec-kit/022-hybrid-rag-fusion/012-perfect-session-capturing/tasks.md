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
- [ ] E3: Create implementation-summary.md
- [ ] E4: Save memory context via generate-context.js
