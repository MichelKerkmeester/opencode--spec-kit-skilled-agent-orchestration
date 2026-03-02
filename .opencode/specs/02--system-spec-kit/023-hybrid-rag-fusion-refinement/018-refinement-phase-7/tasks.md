---
title: "Tasks: Refinement Phase 7 — Cross-AI Review Audit"
description: "Tracking review findings and their resolution status"
---
# Tasks: Refinement Phase 7 — Cross-AI Review Audit

<!-- SPECKIT_LEVEL: 2 -->

## Wave Execution

- [x] Wave 1: Script Location Analysis
  - [x] Task 1: Gemini architecture boundary review
  - [x] Task 2: Codex build system review
  - [x] Task 3: Opus import path mapping
  - [x] Wave 1 synthesis
- [x] Wave 2: Summary Document Verification
  - [x] Task 4: Gemini new features vs code (15/15 MATCH)
  - [x] Task 5: Codex existing features vs schemas (7/7 MATCH)
  - [x] Task 6: Opus cross-reference consistency (12 findings)
  - [x] Wave 2 synthesis
- [x] Wave 3: Code Standards Review
  - [x] Task 7: Gemini MCP server standards (9/10 FAIL — P1)
  - [x] Task 8: Codex scripts standards (10/10 FAIL — P2)
  - [x] Wave 3 synthesis
- [x] Wave 4: Bug Detection
  - [x] Task 9: Opus Phase 017 verification (10/10 VERIFIED)
  - [x] Task 10: Opus bug hunt (0 critical, 6 P2 minor)
  - [x] Wave 4 synthesis
- [x] Final synthesis (implementation-summary.md)
- [ ] Apply P0 fixes (summary_of_existing_features.md updates)

## Findings Summary (Recalibrated by Ultra-Think Meta-Review)

### P0 — Must Fix (4 items — all documentation)
1. summary_of_existing_features.md Stage 2 signal count wrong (should be "12 steps, 9 score-affecting")
2. summary_of_existing_features.md Legacy V1 pipeline described as available (removed Phase 017)
3. summary_of_existing_features.md SPECKIT_PIPELINE_V2 described as active toggle (deprecated, always true)
4. summary_of_existing_features.md resolveEffectiveScore() not documented at all

### P1 — Should Fix (11 items)
5. SPECKIT_ADAPTIVE_FUSION missing from feature flag documentation
6. Math.max/min spread patterns in 6 files — **most dangerous latent defect** (stack overflow >100K)
7. summary_of_existing_features.md memory_update embedding wrong (title-only → title+content)
8. summary_of_existing_features.md memory_delete cleanup scope wrong (1 table → 8 tables)
9. summary_of_existing_features.md Five-factor normalization not documented
10. summary_of_existing_features.md R8 summary channel missing from Stage 1 description
11. Mixed import patterns in scripts/ (10 files use relative paths instead of aliases)
12. Missing workspace deps in scripts/package.json
13. Hardcoded DB path in cleanup-orphaned-vectors.ts
14. specFolderLocks constant naming (camelCase → UPPER_SNAKE)
15. memory-indexer.ts import ordering + AI-TRACE tags

### P2 — Low Priority (11 items — recalibrated)
16. SQL template literals in 5 files (FALSE POSITIVE per Codex — fixed fragments, not user input)
17. Transaction wrappers for 3 handlers (low risk — single-process, self-healing)
18. stage2-fusion.ts internal docblock inconsistency (header=11, docblock=9, code=12)
19. spec.md metadata tool count stale (23 → 25)
20. "89 feature flags" claim unverified
21. Duplicate deps in scripts/package.json
22. quality-scorer, topic-extractor could move to shared/
23. File header format (19/20 files — consistent internal convention)
24. Narrative comments (19/20 files)
25. isFeatureEnabled() treats "1" as disabled
26. Co-activation spreading may be missing from new_features.md signal list

### RESOLVED (downgraded after cross-verification)
- ~~Tool count 25 vs 23~~ — Codex proved doc actually has 25. Only spec.md metadata stale (P2).
- ~~SQL template literals P1~~ — Codex proved 3/5 false positive. Downgraded to P2.
