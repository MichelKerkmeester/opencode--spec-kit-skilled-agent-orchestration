---
title: "Implementation Plan: Advisor Phrase-Booster Tailoring"
description: "Single-file advisor edit in 3 phases — audit multi-word INTENT_BOOSTERS entries, migrate to PHRASE_INTENT_BOOSTERS, prove via regression fixture. Canonical Public repo advisor; Barter sync deferred."
trigger_phrases:
  - "advisor phrase booster plan"
  - "phrase booster migration plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "spec-kit-start"
    recent_action: "Authored Level 2 plan with 3-phase migration + regression gate"
    next_safe_action: "Review, then execute Phase 1 audit per tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-start-013-2026-04-15"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Advisor Phrase-Booster Tailoring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 |
| **Framework** | Skill Advisor runtime (internal) |
| **Storage** | In-memory dicts (`INTENT_BOOSTERS`, `PHRASE_INTENT_BOOSTERS`) + JSON skill graph |
| **Testing** | `skill_advisor_regression.py` (44 P0/P1 fixture cases) + `skill_advisor_bench.py` (latency) |

### Overview

Audit 24 multi-word entries in `INTENT_BOOSTERS` (tokenizer-broken no-ops), migrate each to `PHRASE_INTENT_BOOSTERS` with preserved weight, add 5+ new phrase entries for under-covered Public identifiers, and prove via the existing 44-case regression fixture that top-1 accuracy holds ≥0.92 with zero P0 regressions. Single-file change (`skill_advisor.py`) plus optional fixture appends.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Pre-change baseline captured: regression metrics (top-1, P0 pass rate), confidence scores for 5 representative multi-word queries
- [ ] Python AST parses current `skill_advisor.py` cleanly
- [ ] All 4 open questions (Q-A through Q-D) confirmed or operator applies leans

### Definition of Done

- [ ] All 5 P0 requirements met (REQ-001 to REQ-005) with evidence
- [ ] All P1 requirements met or deferred with user approval
- [ ] `scratch/phrase-boost-delta.md` has per-key disposition + before/after query metrics
- [ ] `checklist.md` all P0 items marked `[x]` with evidence
- [ ] Regression harness exits 0 with default thresholds
- [ ] No P0 fixture case regressions
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Config-data migration**: move dict entries between two existing data structures based on schema compatibility. No new abstractions, no behavior change to scoring functions, no new test harness. Regression coverage is the safety net.

### Key Components

- **`INTENT_BOOSTERS`** (line 496) — token-level: keyed by single tokens the tokenizer produces (stop-words-filtered). Multi-word keys here are dead code.
- **`PHRASE_INTENT_BOOSTERS`** (line 788) — phrase-level: keyed by substrings matched against the lowercased raw prompt. Values are lists of `(skill, weight)` tuples (supports multi-skill phrases).
- **Scoring loop** (around line 1660-1690) — reads both dicts. INTENT uses `token in INTENT_BOOSTERS`; PHRASE uses `phrase in prompt_lower`.
- **Regression runner** (`skill_advisor_regression.py`) — evaluates all fixture cases; enforces `--min-top1-accuracy` and P0 pass rate thresholds.

### Data Flow

```
Raw prompt
    ↓
PHRASE_INTENT_BOOSTERS substring check → skill_boosts (additive)
    ↓
Tokenize → all_tokens
    ↓
For each token: INTENT_BOOSTERS + MULTI_SKILL_BOOSTERS check → skill_boosts
    ↓
Graph boosts + family affinity → skill_boosts
    ↓
Per-skill name/description match → base score
    ↓
Confidence = f(score + boosts, has_intent_boost flag)
```

The fix: stop trying to match multi-word keys in the tokenized path; rely on PHRASE substring path where they actually work.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline + Audit

- [ ] Run `python3 skill_advisor_regression.py` and capture baseline: `top1_accuracy`, `p0_pass_rate`, per-case pass status → `scratch/baseline-regression.json`
- [ ] Measure baseline confidence for 5 representative multi-word queries (REQ-010 list) → `scratch/baseline-queries.md`
- [ ] Grep multi-word keys in `INTENT_BOOSTERS` and `MULTI_SKILL_BOOSTERS` (lines 496-788 and follow-on) → `scratch/multi-word-inventory.md`
- [ ] For each multi-word key: check presence in `PHRASE_INTENT_BOOSTERS`; classify as `duplicate-remove`, `migrate`, or `schema-violation` → `scratch/phrase-boost-delta.md` (per-key disposition table)
- [ ] Draft 5+ candidate new PHRASE entries for under-covered Public identifiers → append to delta report

### Phase 2: Migration + Additions

- [ ] Apply per-key dispositions from Phase 1 audit:
  - **Duplicate-remove**: delete entry from INTENT_BOOSTERS
  - **Migrate**: delete from INTENT_BOOSTERS, add to PHRASE_INTENT_BOOSTERS with equivalent weight in `[(skill, weight)]` list form
  - **Schema-violation**: halt, escalate
- [ ] Add 5+ new phrase entries for under-covered identifiers (REQ-011)
- [ ] Add inline comment block near `PHRASE_INTENT_BOOSTERS` definition distinguishing single-token vs multi-word intent (REQ-021, P2)
- [ ] Append 5-10 P1 fixture cases for newly-routed phrases (REQ-012)
- [ ] Python AST parse-check (REQ-005)

### Phase 3: Regression + Delta

- [ ] Run `python3 skill_advisor_regression.py --min-top1-accuracy 0.92` — MUST exit 0 (REQ-003)
- [ ] Compare post vs baseline: P0 pass rate ≥ baseline (REQ-004)
- [ ] Re-measure confidence for 5 representative queries; confirm ≥0.10 uplift or NONE→match (REQ-010)
- [ ] Optional: run `skill_advisor_bench.py` for latency (REQ-020, P2)
- [ ] Finalize `scratch/phrase-boost-delta.md` with post-change metrics
- [ ] Author `implementation-summary.md`
- [ ] Mark `checklist.md` P0 + P1 items with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | 44 P0/P1 fixture cases, top-1 accuracy, P0 pass rate | `skill_advisor_regression.py --min-top1-accuracy 0.92` |
| Query uplift | 5 representative multi-word queries | Direct `skill_advisor.py` invocation, parse JSON output |
| Syntax | Python AST parse | `python3 -c "import ast; ast.parse(open(...).read())"` |
| Latency (P2) | Mean + p95 per query | `skill_advisor_bench.py` |
| Manual | Spot-check via interactive queries | `skill_advisor.py "<prompt>" --threshold 0.3` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_advisor.py` — current structure | Internal | Green | Revert to git HEAD if structure shifts mid-work |
| `skill_advisor_regression.py` | Internal | Green | Required for P0 gate (REQ-003/004) |
| `fixtures/skill_advisor_regression_cases.jsonl` | Internal | Green | Required for regression runs |
| Python 3 runtime | System | Green | Already required by advisor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: P0 fixture regression, top-1 accuracy < 0.92, or Python syntax failure
- **Procedure**: `git checkout HEAD -- .opencode/skill/skill-advisor/scripts/skill_advisor.py scripts/fixtures/skill_advisor_regression_cases.jsonl`; re-run regression to confirm baseline restored
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Audit) ──► Phase 2 (Migration + Additions) ──► Phase 3 (Regression + Delta)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline + Audit | None | Migration |
| Migration | Baseline complete | Regression |
| Regression | Migration complete | DoD |

Strictly serial — each phase consumes output from the prior.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline + Audit | Low | 30-45 min |
| Migration + Additions | Low-Med | 45-75 min |
| Regression + Delta | Low | 30-45 min |
| **Total** | | **1.75 - 2.75 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-work Checklist

- [ ] Git HEAD is clean in `.opencode/skill/skill-advisor/` (no uncommitted drift)
- [ ] Baseline regression snapshot exists in `scratch/baseline-regression.json`
- [ ] Python AST parse succeeds on pre-change file

### Rollback Procedure

1. Identify failure (P0 regression, syntax error, or unexplained top-1 drop)
2. `git checkout HEAD -- skill_advisor.py` (+ fixtures if modified)
3. Re-run `skill_advisor_regression.py --min-top1-accuracy 0.92` — confirm baseline restored
4. Re-read `scratch/phrase-boost-delta.md` + baseline; identify which migration entry caused regression
5. Retry with smaller-scope migration (single-entry batches) if wholesale rollback was required

### Data Reversal

- **Has data migrations?** No — in-code dict changes only.
- **Reversal procedure**: `git checkout HEAD -- <files>`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
Level 2 plan (~180 lines)
- 3 serial phases: audit → migrate → regress
- Single-file change with existing regression harness as safety net
-->
