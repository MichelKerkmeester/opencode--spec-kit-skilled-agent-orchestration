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

## Findings Summary

### P0 — Must Fix
1. [W2] summary_of_existing_features.md Stage 2 signal count wrong (9 → 11)
2. [W2] summary_of_existing_features.md Legacy V1 pipeline described as available
3. [W2] summary_of_existing_features.md SPECKIT_PIPELINE_V2 described as active toggle
4. [W2] summary_of_existing_features.md resolveEffectiveScore() not documented

### P0 (Deep Dive additions)
5. [DD] Stage 2 signal count is actually **12** (not 9 or 11) — confirmed in stage2-fusion.ts L335-515
6. [DD] Tool count is **25** in code, doc claims 23 — 2 undocumented tools
7. [DD] SPECKIT_ADAPTIVE_FUSION missing from feature flag documentation

### P1 — Should Fix
8. [W1] Mixed import patterns in scripts/ (10 files use relative paths instead of aliases)
9. [W1] Missing workspace deps in scripts/package.json
10. [W1] Hardcoded DB path in cleanup-orphaned-vectors.ts
11. [W2] summary_of_existing_features.md memory_update embedding description wrong
12. [W2] summary_of_existing_features.md memory_delete cleanup scope wrong
13. [W2] summary_of_existing_features.md Five-factor normalization missing
14. [W2] summary_of_existing_features.md R8 summary channel missing from Stage 1
15. [W3] specFolderLocks constant naming (camelCase → UPPER_SNAKE)
16. [W3] memory-indexer.ts import ordering
17. [W3] Task tokens missing AI-TRACE prefix
18. [DD] Template literal SQL in 5 files (not injection, but bypasses parameterization)
19. [DD] Missing transaction wrappers in 4 handlers (memory-save chunks, single delete, update, bulk delete ledger)
20. [DD] Math.max/min spread patterns in 6 files (stack overflow risk >100K elements)

### P2 — Low Priority (Future Spec)
21. [W1] Duplicate deps in scripts/package.json
22. [W1] quality-scorer, topic-extractor could move to shared/
23. [W3] File header format (19/20 files)
24. [W3] Narrative comments (19/20 files)
25. [W4] isFeatureEnabled() treats "1" as disabled
26. [W4] Missing transactions on single-item update/delete
