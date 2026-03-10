# 013 — Code Audit Per Feature Catalog — Plan

## Execution Plan

### Step 1: Create Phase Folder Structure
Create 20 phase folders under `013-code-audit-per-feature-catalog/`.

### Step 2: Create Phase Documentation
Each phase gets spec.md and plan.md with scope, features, and methodology.

### Step 3: Dispatch Agents (Batch 1 — 13 agents in parallel)

**Tier 1 — GPT 5.4 xhigh (cli-codex):**
- G1: Phase 014-pipeline-architecture (21 features)
- G2: Phase 011-scoring-and-calibration (17 features)
- G3: Phase 013-memory-quality-and-indexing (16 features)

**Tier 2 — Codex 5.3 xhigh (cli-copilot):**
- C1: Phase 001-retrieval (9 features)
- C2: Phase 002-mutation (10 features)
- C3: Phase 008-bug-fixes-and-data-integrity (11 features)
- C4: Phase 009-evaluation-and-measurement (14 features)
- C5: Phase 010-graph-signal-activation (11 features)
- C6: Phase 015-retrieval-enhancements (9 features)
- C7: Phase 018-ux-hooks (13 features)
- C8: Phase 005-lifecycle + 006-analysis (14 features)
- C9: Phase 012-query-intelligence + 016-tooling (14 features)
- C10: Phase 003-discovery + 004-maintenance + 007-evaluation + 017-governance + 019-decisions + 020-feature-flags (21 features)

### Step 4: Collect & Synthesize
Merge agent outputs into per-phase checklist.md files. Create cross-phase synthesis.

### Step 5: Save Context
Run `generate-context.js` on parent folder.

## Per-Phase Audit Methodology

1. **Feature Inventory** — Read feature .md files, extract source lists, map to playbook scenarios
2. **Code Review** — Correctness, standards, behavior match, edge cases per source file
3. **Test Coverage** — Verify tests exist and cover described behavior
4. **Playbook Cross-Ref** — Map features to EX-*/NEW-* scenarios
5. **Findings Report** — Structured per-feature findings with status, issues, recommendations
