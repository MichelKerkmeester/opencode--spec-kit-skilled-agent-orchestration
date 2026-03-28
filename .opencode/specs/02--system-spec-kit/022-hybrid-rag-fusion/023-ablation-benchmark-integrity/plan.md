---
title: "Implementation Plan: Ablation Benchmark Integrity"
description: "This plan restores benchmark validity by separating evaluation from live truncation behavior, validating ground-truth provenance against the active DB, and refreshing the canonical relevance dataset before rerunning ablations."
trigger_phrases:
  - "implementation plan"
  - "ablation benchmark"
  - "benchmark integrity"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Ablation Benchmark Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit Memory MCP server + CLI scripts |
| **Storage** | SQLite (`context-index.sqlite`, `speckit-eval.db`) |
| **Testing** | Vitest, targeted CLI reruns, SQLite integrity queries |

### Overview
The implementation keeps the live ranking pipeline intact while adding a benchmark-only escape hatch for truncation layers that invalidate `Recall@K`. In parallel, it adds a provenance guard so ablation cannot score against the wrong DB universe, then refreshes the canonical ground-truth dataset and reruns the FTS5 comparison on the aligned repo DB.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted runtime hardening inside the existing eval and search modules.

### Key Components
- **Ablation alignment preflight**: Validates that every relevance ID resolves to a parent memory in the active DB before scoring starts.
- **Evaluation-only search mode**: Preserves the requested candidate window by bypassing confidence truncation and token-budget truncation only for benchmark calls.
- **Ground-truth refresh utility**: Rewrites `ground-truth.json` deterministically from the active repo DB when explicitly asked.

### Data Flow
CLI or MCP ablation entrypoint opens the active DB, runs a ground-truth alignment preflight, then calls `hybridSearchEnhanced(..., { evaluationMode: true })` through a parent-normalizing adapter. Once the dataset is refreshed and aligned, the eval runner records clean results to `speckit-eval.db`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Benchmark Hardening
- [x] Add ground-truth alignment audit and fail-fast validation
- [x] Add evaluation-only search option to bypass truncation
- [x] Normalize parent IDs on all ablation adapters

### Phase 2: Dataset Refresh
- [x] Make the mapping script capable of rewriting `ground-truth.json`
- [x] Refresh the canonical relevance file against the repo DB
- [x] Re-validate parent-only alignment after refresh

### Phase 3: Verification
- [x] Run targeted Vitest coverage for integrity guards and eval-mode search
- [x] Rerun one full ablation and one focused `fts5` ablation on the repo DB
- [x] Update spec packet evidence and final recommendation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ground-truth alignment audit and failure messaging | Vitest |
| Integration | Handler search options, parent normalization, eval-mode bypass | Vitest |
| Manual | Dataset refresh, DB alignment checks, full/focused ablation reruns | `npx tsx`, `sqlite3`, targeted shell probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Repo DB `mcp_server/database/context-index.sqlite` | Internal | Green | Clean reruns cannot proceed without a stable repo DB target. |
| `VOYAGE_API_KEY` | External | Green | Embedding generation failures block full ablation reruns. |
| Existing ground-truth mapper heuristics | Internal | Yellow | A bad mapping forces manual investigation before trusting the refreshed dataset. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Evaluation-only mode changes live search behavior, or refreshed ground-truth mapping proves invalid.
- **Procedure**: Revert the narrow eval/search/mapping changes, restore the previous `ground-truth.json`, and keep the benchmark verdict marked unproven.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Hardening) ───► Phase 2 (Dataset Refresh) ───► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Hardening | Existing investigation findings | Dataset refresh, verification |
| Dataset Refresh | Hardening | Verification |
| Verification | Hardening, Dataset Refresh | Final verdict |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Benchmark Hardening | High | 2-4 hours |
| Dataset Refresh | Medium | 1-2 hours |
| Verification | High | 2-4 hours |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Ground-truth rewrite performed from the repo DB only
- [ ] Targeted tests green
- [ ] Full and focused reruns captured

### Rollback Procedure
1. Revert the eval/search/mapping code changes.
2. Restore the prior `ground-truth.json` from version control if the refreshed mapping is suspect.
3. Re-run the alignment audit to confirm the rollback state.
4. Mark FTS5 verdict as unproven until a new clean benchmark pass exists.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Restore `ground-truth.json` and rerun alignment audit if the refreshed mapping must be backed out.
<!-- /ANCHOR:enhanced-rollback -->
