---
title: "...tem-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-advisor-phrase-booster-tailoring/spec]"
description: "The advisor's INTENT_BOOSTERS has 24 multi-word keys that the tokenizer splits on whitespace, turning them into no-ops. PHRASE_INTENT_BOOSTERS exists but is under-used. Migrate tokenizer-broken entries, add missing phrase routes, hold ≥0.92 top-1 accuracy on regression fixture."
trigger_phrases:
  - "advisor phrase booster"
  - "phrase intent booster migration"
  - "skill advisor tailoring"
  - "tokenizer multi-word"
  - "gate 2 routing optimization"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-advisor-phrase-booster-tailoring"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "spec-kit-start"
    recent_action: "Authored Level 2 spec for PHRASE_INTENT_BOOSTERS migration + Barter-context additions"
    next_safe_action: "Review and proceed to implement per plan.md (Phase 1 audit → Phase 2 migration → Phase 3 regression)"
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor_regression.py"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor_bench.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-start-013-2026-04-15"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Q-A: for the 24 misplaced multi-word entries, delete (no-op cleanup) or add missing PHRASE_INTENT_BOOSTERS copies? Lean: audit per-entry — delete if duplicate, migrate with same weight otherwise"
      - "Q-B: should sk-code-web/opencode/full-stack phrase entries be added even though those skills are stack overlays (not always discovered)? Lean: yes, for natural-language routing"
      - "Q-C: regression fixture gain new test cases for newly-routed phrases? Lean: yes, add 5-10 P1 cases"
    answered_questions: []
---
# Feature Specification: Advisor Phrase-Booster Tailoring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-15 |
| **Branch** | `013-advisor-phrase-booster-tailoring` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Target File** | `.opencode/skill/skill-advisor/scripts/skill_advisor.py` |
| **Regression Harness** | `scripts/skill_advisor_regression.py` + `scripts/fixtures/skill_advisor_regression_cases.jsonl` (44 cases) |
| **Bench Harness** | `scripts/skill_advisor_bench.py` |
| **Min Top-1 Accuracy Threshold** | 0.92 (enforced by regression harness default) |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../002-skill-advisor-graph/spec.md |
| **Successor** | ../004-smart-router-context-efficacy/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill advisor's `INTENT_BOOSTERS` dict (`skill_advisor.py:496`) contains **24 multi-word keys** that the advisor's tokenizer splits on whitespace — making those booster entries effective no-ops. The separate `PHRASE_INTENT_BOOSTERS` dict (`skill_advisor.py:788`) already provides the correct mechanism (substring match against the raw prompt before tokenization), but it's under-used: 6 of the 24 misplaced multi-word keys have no PHRASE equivalent, and recently-added Barter-context phrases like "iron law", "barter-scrooge monorepo", "observe never modify" have no phrase route. Users asking natural-language questions with multi-word identifiers receive lower confidence or fall back to weaker token matches, eroding Gate 2 routing quality.

### Purpose

Migrate tokenizer-broken multi-word entries from `INTENT_BOOSTERS` to `PHRASE_INTENT_BOOSTERS`, add phrase routes for under-covered multi-word identifiers, and prove via the existing 44-case regression fixture that top-1 accuracy stays ≥ 0.92 with no P0 regressions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Audit** all 24 multi-word keys in `INTENT_BOOSTERS` against `PHRASE_INTENT_BOOSTERS`:
  - If already duplicated in PHRASE: delete from INTENT_BOOSTERS (dead code)
  - If not duplicated: migrate to PHRASE_INTENT_BOOSTERS with equivalent weight (single-skill boost rewrapped as `[(skill, weight)]` list form)
- **Add** new PHRASE entries for Public-skill multi-word identifiers that lack routes (e.g., "code standards overlay", "full stack workflow", "opencode skill creation", "spec folder workflow", "document quality enforcement")
- **Verify** regression harness: `skill_advisor_regression.py` must pass with `--min-top1-accuracy 0.92`
- **Optional** add 5-10 P1 fixture cases for newly-routed phrases to `scripts/fixtures/skill_advisor_regression_cases.jsonl`
- **Record** before/after metrics in `scratch/phrase-boost-delta.md`

### Out of Scope

- **Tokenizer rewrite** — no changes to how `all_tokens` is built. Preserve existing behavior.
- **New booster mechanism** — no new dicts or scoring layers beyond the existing PHRASE_INTENT_BOOSTERS.
- **Barter-repo sync** — Public is canonical. Barter propagation handled in a separate follow-up or via the user's sync workflow (note in implementation-summary.md).
- **`_apply_graph_boosts` / `_apply_family_affinity`** — leave untouched.
- **Confidence formula changes** — do not alter `confidence = min(0.50 + score * 0.15, 0.95)`.
- **Fixture schema changes** — only add cases in existing schema, no field additions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | **Modify** | Clean `INTENT_BOOSTERS` (remove/migrate ~24 multi-word), expand `PHRASE_INTENT_BOOSTERS` |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | **Modify** (append) | Optional: 5-10 new P1 fixture cases for newly-routed phrases |
| `scratch/phrase-boost-delta.md` | **Create** | Before/after delta report: which keys moved, new entries added, regression metrics |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero multi-word keys remain in `INTENT_BOOSTERS` | `grep -cE '^\s*"[^"]+\s+[^"]+":' skill_advisor.py` in the INTENT_BOOSTERS block (lines 496-788) returns 0 |
| REQ-002 | Every deleted multi-word key is either (a) already in `PHRASE_INTENT_BOOSTERS` or (b) migrated to it with equivalent-or-higher total weight | Diff report in `scratch/phrase-boost-delta.md` shows per-key disposition: `duplicate-removed`, `migrated-to-phrase`, or `skipped-obsolete` with rationale for each |
| REQ-003 | Regression fixture top-1 accuracy ≥ 0.92 | `python3 skill_advisor_regression.py --min-top1-accuracy 0.92` exits 0 |
| REQ-004 | Zero P0 fixture case regressions | `p0_pass_rate` in regression output ≥ pre-change baseline |
| REQ-005 | Python syntax valid | `python3 -c "import ast; ast.parse(open('skill_advisor.py').read())"` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Confidence uplift on representative multi-word queries | At least 5 sample queries (listed below) improve confidence by ≥0.10 OR move from "NONE" to a valid match: <br>• "save this conversation context" → `system-spec-kit` ≥ 0.85 <br>• "deep research loop" → `sk-deep-research` ≥ 0.85 <br>• "code review merge readiness" → `sk-code-review` ≥ 0.85 <br>• "5-dimension agent scoring" → `sk-improve-agent` ≥ 0.80 <br>• "responsive css layout fix" → `sk-code-web` ≥ 0.85 |
| REQ-011 | New PHRASE entries for under-covered Public identifiers | At least 5 new phrase entries covering: "opencode skill creation", "spec folder workflow", "full stack implementation", "template validation", "document quality enforcement" (or equivalent substitutes with documented rationale) |
| REQ-012 | 5-10 new P1 regression fixture cases added | `wc -l fixtures/skill_advisor_regression_cases.jsonl` increases by 5-10; new cases use schema `{"id":"P1-PHRASE-NNN","priority":"P1",...}` |
| REQ-013 | Delta report generated | `scratch/phrase-boost-delta.md` exists with per-key disposition table + before/after confidence measurements for REQ-010 queries |

### P2 - Nice-to-have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Bench harness does not regress mean latency | `skill_advisor_bench.py` output `p95_latency_ms` ≤ pre-change + 5% |
| REQ-021 | Inline comment documents when to use INTENT_BOOSTERS vs PHRASE_INTENT_BOOSTERS | Comment block added near PHRASE_INTENT_BOOSTERS definition distinguishing single-token vs multi-word intent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `INTENT_BOOSTERS` contains zero multi-word (whitespace-separated) keys after migration.
- **SC-002**: Every removed key has a documented disposition (duplicate/migrated/obsolete).
- **SC-003**: Regression harness exits 0 with default thresholds (`--threshold 0.8 --min-top1-accuracy 0.92`).
- **SC-004**: P0 fixture cases retain 100% pass rate or match baseline.
- **SC-005**: At least 5 representative multi-word queries improve confidence by ≥0.10 (or recover from NONE).
- **SC-006**: `scratch/phrase-boost-delta.md` documents pre/post state with measurements.
- **SC-007**: No runtime errors; Python AST parses cleanly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Migrating a key weight incorrectly changes routing | Med | Per-key audit in delta report; preserve single-skill→(skill, weight) mapping; keep original weight unless explicit justification |
| Risk | Fixture expects old (broken) behavior | Low-Med | If a P0 case depends on a multi-word entry that was broken-but-expected, re-test and update fixture with rationale |
| Risk | Hidden callsites referencing removed INTENT_BOOSTERS keys | Low | Grep for each removed key across the advisor and regression scripts before removal; only direct `INTENT_BOOSTERS[key]` lookups matter |
| Risk | Confidence formula interaction (intent_boost flag) | Med | The scoring formula rewards having ANY intent_boost match. Migrating intent→phrase may shift which flag fires. Verify via regression + sample queries |
| Dependency | Regression fixture JSONL schema | Green | Existing schema used as-is |
| Dependency | `skill_advisor_regression.py` CLI flags | Green | Use defaults; `--min-top1-accuracy 0.92` enforced |
| Dependency | Public advisor as canonical | Green | Scope limited to Public; Barter sync is out-of-scope |
| Risk | PHRASE matcher is substring-based; short phrases could false-positive | Med | When adding new phrases, prefer phrases ≥2 words with distinctive tokens; avoid generic phrases like "code" or "test" |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Regression harness completes in same wall-time ±10% (the PHRASE loop iterates over dict; growing it by ~30 entries is O(n) scan, negligible)
- **NFR-P02**: Bench harness p95 latency ≤ current + 5%

### Correctness

- **NFR-C01**: No silent behavior change — any intentional routing change must be documented in delta report
- **NFR-C02**: All P0 fixture cases maintain or improve pass status

### Maintainability

- **NFR-M01**: Inline comment explaining INTENT_BOOSTERS (single-token) vs PHRASE_INTENT_BOOSTERS (multi-word) role division
- **NFR-M02**: Multi-word keys never re-added to INTENT_BOOSTERS — doc this as an anti-pattern
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Key migration

- **Entry already duplicated**: Example — `"deep research"` exists in both dicts. Action: delete from INTENT_BOOSTERS (keep in PHRASE).
- **Entry in INTENT_BOOSTERS only**: Example — `"code audit"` (1.0 weight in INTENT_BOOSTERS, not in PHRASE). Action: migrate to PHRASE_INTENT_BOOSTERS as `"code audit": [("sk-deep-review", 1.0)]`.
- **Weight mismatch between dicts**: Example — `"deep research"` is 1.5 in INTENT_BOOSTERS, 2.5 in PHRASE. Action: keep the PHRASE weight (already more aggressive); remove INTENT entry.
- **Multi-skill phrase in INTENT_BOOSTERS**: Should not exist — INTENT_BOOSTERS is `(skill, weight)` tuples only. If found, this is a schema violation worth flagging.

### Fixture additions

- Only P1 priority for new cases (no new P0 cases without user approval)
- `expect_kind: "skill"` — not `"command"`
- `allow_command_bridge: false` unless a command-route is intentional
- `expected_top_any` with 1-3 options (single preferred, 2-3 if the fix creates a legitimate ambiguity band)

### Regression failures

- If a P0 case regresses after migration, HALT and escalate — do not "tune to pass"
- If a P1 case regresses, document in delta report and discuss with user before proceeding
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 1 main file edit + 1 optional fixture append; ~50 LOC net change |
| Risk | 12/25 | Routing behavior change affects Gate 2 — needs regression coverage; rest is mechanical |
| Research | 5/20 | Mechanism already exists; just migrating entries — short discovery |
| **Total** | **27/70** | **Level 2** |

### Notes

- Level 2 chosen over Level 1 because the change affects production Gate 2 routing and requires explicit regression-test evidence. The verification checklist (checklist.md) enforces the min-top1-accuracy threshold as a hard gate.
- No `--with-phases` needed — single file, ~50 LOC, parallel tracks not applicable.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Q-A**: For the 24 misplaced multi-word entries, is the preferred disposition always "delete if duplicate, migrate with equivalent weight otherwise"? **Lean**: yes, with per-entry audit documented in delta report. If any entry has an intentionally lower weight (to act as a tiebreaker rather than a strong match), surface for discussion.
- **Q-B**: Should `sk-code-web`/`-opencode`/`-full-stack` gain phrase entries even though they're overlay skills (not always applicable)? **Lean**: yes — these ARE active skills in Public; phrase routing improves discovery when users type natural-language queries referencing them.
- **Q-C**: Should fixture cases be added for the Barter-specific phrases (iron law, barter-scrooge, observe never modify)? **Lean**: no — those are Barter-advisor concerns, out of scope for Public. Public fixtures should cover Public skills only.
- **Q-D**: Should I also audit `MULTI_SKILL_BOOSTERS` for multi-word keys? **Lean**: yes, include in Phase 1 audit; treat findings equivalently (migrate multi-word to PHRASE or equivalent structure).
<!-- /ANCHOR:questions -->

---

<!--
Level 2 spec (~230 lines)
- Narrow, mechanical fix: migrate broken boosters to working ones
- Regression harness is the verification floor (0.92 top-1)
- Public canonical; Barter sync deferred
-->
