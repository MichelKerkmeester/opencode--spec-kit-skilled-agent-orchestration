# Playbook Results — Wave 3 (DR-039 through DR-041)

**Executed:** 2026-03-24
**Operator:** Claude Opus 4.6 (1M context)
**Mode:** READ-ONLY inspection

---

## DR-039: Review-report.md synthesis has all 11 sections

**Verdict:** PARTIAL

**Evidence:**

### Source 1: Review auto YAML `phase_synthesis` — `step_compile_review_report`

The YAML (`spec_kit_deep-research_review_auto.yaml`, lines 511-559) defines `step_compile_review_report` with explicit instructions to create review-report.md with 11 sections. The sections listed in the YAML are:

| # | Section in YAML | Present |
|---|-----------------|---------|
| 1 | Executive Summary | Yes |
| 2 | Score Breakdown | Yes |
| 3 | P0 Findings (Blockers) | Yes |
| 4 | P1 Findings (Required) | Yes |
| 5 | P2 Findings (Suggestions) | Yes |
| 6 | Cross-Reference Results | Yes |
| 7 | Coverage Map | Yes |
| 8 | Positive Observations | Yes |
| 9 | Convergence Report | Yes |
| 10 | Remediation Priority | Yes |
| 11 | Release Readiness Verdict | Yes |

All 11 sections are present in the YAML synthesis step. This matches the scenario's expected 11-section list exactly.

### Source 2: `state_format.md` Section 8 — review-report.md section list

`state_format.md` (lines 559-575) contains a "review-report.md Section List" table listing 11 sections. However, the section names differ from the YAML in several places:

| # | state_format.md name | YAML name | Match? |
|---|---------------------|-----------|--------|
| 1 | Executive Summary | Executive Summary | YES |
| 2 | Scope | Score Breakdown | **MISMATCH** |
| 3 | Findings Registry | P0 Findings (Blockers) | **MISMATCH** |
| 4 | P0 Critical Findings | P1 Findings (Required) | **MISMATCH (shifted)** |
| 5 | P1 Major Findings | P2 Findings (Suggestions) | **MISMATCH (shifted)** |
| 6 | P2 Minor Findings | Cross-Reference Results | **MISMATCH (shifted)** |
| 7 | Dimension Summaries | Coverage Map | **MISMATCH** |
| 8 | Cross-Reference Results | Positive Observations | **MISMATCH (shifted)** |
| 9 | Resolved / Disproved | Convergence Report | **MISMATCH** |
| 10 | Recommendations | Remediation Priority | **MISMATCH** |
| 11 | Review Metadata | Release Readiness Verdict | **MISMATCH** |

The `state_format.md` has a fundamentally different 11-section schema than what the YAML produces. State format lists: Executive Summary, Scope, Findings Registry, P0 Critical Findings, P1 Major Findings, P2 Minor Findings, Dimension Summaries, Cross-Reference Results, Resolved/Disproved, Recommendations, Review Metadata. The YAML lists: Executive Summary, Score Breakdown, P0 Findings, P1 Findings, P2 Findings, Cross-Reference Results, Coverage Map, Positive Observations, Convergence Report, Remediation Priority, Release Readiness Verdict.

The two sources agree on section count (11) but disagree on which 11 sections compose the report. This is a significant inconsistency.

### Source 3: `loop_protocol.md` Section 6.3 — Review Synthesis

`loop_protocol.md` (lines 643-667) describes review synthesis. Line 661 says: "Compile review-report.md: Generate all 11 sections (see state_format.md Section 8)." It defers to `state_format.md` for the canonical section list, which conflicts with the YAML. The loop protocol also describes verdict logic (line 662): "Executive Summary with verdict: PASS (score >= qualityGateThreshold, 0 active P0), CONDITIONAL (score >= qualityGateThreshold but active P0/P1 exist), FAIL (score < qualityGateThreshold or active P0)" -- which only defines 3 verdicts, not the 4 in the YAML.

### Source 4: `quick_reference.md` — Review Mode section

The quick reference (lines 220-281) does NOT list the 11 review-report sections. It covers review commands, parameters, dimensions, verdicts, quality guards, and convergence -- but has no section listing the report's table of contents. Partial gap: the quick reference provides no section catalog for the report.

**Issues:**

1. **Section name mismatch between state_format.md and YAML.** The state_format.md defines a different set of 11 sections (Scope, Findings Registry, Dimension Summaries, Resolved/Disproved, Review Metadata) versus the YAML (Score Breakdown, Coverage Map, Positive Observations, Convergence Report, Release Readiness Verdict). Both have 11 sections and share some overlap (Executive Summary, P0/P1/P2 Findings, Cross-Reference Results), but 6 of 11 section names differ.
2. **Quick reference has no section catalog for review-report.md.**
3. **Loop protocol defers to state_format.md**, inheriting whatever section list is canonical there -- which conflicts with the YAML.

---

## DR-040: Review verdict determines post-review workflow

**Verdict:** PARTIAL

**Evidence:**

### Source 1: Review auto YAML — `step_compile_review_report` verdict definitions

The YAML (lines 553-558) defines 4 verdict levels in section 11 (Release Readiness Verdict):

| Verdict | Condition (YAML) |
|---------|-----------------|
| FAIL | Active P0 or composite score < 70 |
| CONDITIONAL | No P0, active P1 remaining |
| PASS WITH NOTES | Only P2 findings remain |
| PASS | No active findings |

The YAML `completion.next_steps` (lines 609-612) also documents post-review workflow:
- `"/spec_kit:plan [remediation] (if FAIL or CONDITIONAL verdict)"`
- `"/create:changelog (if PASS or PASS WITH NOTES)"`
- `"/spec_kit:deep-research:review [target] (for another review)"`
- `"/memory:save {spec_folder} (manual memory save)"`

### Source 2: `quick_reference.md` — Review Verdicts table

The quick reference (lines 253-259) defines only **3 verdicts**, not 4:

| Verdict | Condition (quick_reference) |
|---------|---------------------------|
| PASS | Score >= threshold, 0 active P0 |
| CONDITIONAL | Score >= threshold, active P0 or P1 exist |
| FAIL | Score < threshold or active P0 |

**Missing:** "PASS WITH NOTES" is absent from the quick reference. Also, the CONDITIONAL definition differs: the quick reference says "active P0 or P1 exist" (which would include P0), while the YAML says "No P0, active P1 remaining" (explicitly excludes P0). This is a logical contradiction -- the quick reference's CONDITIONAL overlaps with FAIL (both include active P0).

### Source 3: `loop_protocol.md` Section 6.3 — Synthesis verdict logic

The loop protocol (line 662) defines only **3 verdicts**:
- PASS: score >= qualityGateThreshold, 0 active P0
- CONDITIONAL: score >= qualityGateThreshold but active P0/P1 exist
- FAIL: score < qualityGateThreshold or active P0

Same issue as quick reference: CONDITIONAL includes "active P0/P1 exist" which contradicts the YAML's "No P0" requirement for CONDITIONAL. And "PASS WITH NOTES" is missing.

### Source 4: README — Post-review workflow

The README (lines 54, 296-297, 341-342) mentions:
- Line 54: "11-section review-report.md with release readiness verdict (PASS/CONDITIONAL/FAIL)" -- only 3 verdicts listed, no PASS WITH NOTES
- Line 296: "The verdict is FAIL and release is blocked. Run `/spec_kit:plan` to create a remediation plan"
- Line 342: "Post-review workflow: 4 verdicts with next-command recommendations" -- claims 4 verdicts but only (PASS/CONDITIONAL/FAIL) are explicitly named in the same README

### Source 5: `state_format.md` — Review section

The state_format.md (line 565) lists the Executive Summary section as containing "Verdict (PASS/CONDITIONAL/FAIL)" -- only 3 verdicts. No "PASS WITH NOTES."

**Issues:**

1. **Verdict count inconsistency.** The YAML defines 4 verdicts (PASS, PASS WITH NOTES, CONDITIONAL, FAIL). All other sources (quick_reference, loop_protocol, state_format, README inline) define only 3 verdicts (PASS, CONDITIONAL, FAIL). "PASS WITH NOTES" exists only in the YAML.
2. **CONDITIONAL definition contradiction.** The YAML says CONDITIONAL requires "No P0, active P1 remaining." The quick reference and loop protocol say CONDITIONAL allows "active P0 or P1 exist" -- which overlaps with FAIL's "active P0" condition. The YAML's definition is logically cleaner (FAIL catches P0, CONDITIONAL catches P1-only).
3. **README claims 4 verdicts** in version history (line 342) but only names 3 elsewhere. This suggests PASS WITH NOTES was intended but not propagated to all sources.
4. **Next-command recommendations** are present in the YAML `completion.next_steps` but are NOT in the quick reference or loop_protocol -- those sources don't map verdicts to specific follow-up commands.

---

## DR-041: Review dashboard shows findings by severity and dimension coverage

**Verdict:** PASS

**Evidence:**

### Source 1: Dashboard template — `deep_review_dashboard.md`

The template (`.opencode/skill/sk-deep-research/assets/deep_review_dashboard.md`) contains 9 sections:

| # | Section | Required Element | Present |
|---|---------|-----------------|---------|
| 1 | Overview | Purpose, usage, data sources | Yes |
| 2 | Status | Target, iteration count, provisional verdict | Yes |
| 3 | Findings Summary | P0/P1/P2 counts with active, new, upgrades, resolved | **Yes** |
| 4 | Progress | Table with Focus, Files, Dimensions, New P0/P1/P2, Score, Ratio, Status | **Yes** |
| 5 | Coverage | Files reviewed X/Y, Dimensions complete X/7, Cross-reference checks X/Y | **Yes** |
| 6 | Trend | Score trend, Severity trend, New findings trend (all last 3) | **Yes** |
| 7 | Resolved / Ruled Out | Disproved findings, dead-end review paths | Yes |
| 8 | Next Focus | From strategy.md | Yes |
| 9 | Active Risks | Blockers, missing coverage, guard violations | Yes |

All 4 required elements from the scenario are present:
- **Findings Summary (P0/P1/P2):** Section 3 -- P0/P1/P2 with active/new/upgrade/resolved counts
- **Progress Table with dimensions:** Section 4 -- table includes Dimensions column
- **Coverage (files/dimensions):** Section 5 -- files reviewed X/Y, dimensions complete X/7
- **Trend:** Section 6 -- score, severity, and new findings trends with directional indicators

### Source 2: Review auto YAML — `step_generate_dashboard`

The YAML (lines 393-433) defines `step_generate_dashboard` with inline content that includes:

| Element | Present in YAML |
|---------|----------------|
| Status section | Yes (review target, status, iteration) |
| Findings Summary (P0/P1/P2 table) | Yes (severity/count/trend table) |
| Dimension Coverage table | Yes (per-dimension status/iteration/findings) |
| Progress table | Yes (per-iteration with dimension/ratio/P0/P1/P2/status) |
| Score Trend | Yes (last 3 ratios + trend + stuck count + guard violations) |
| Next Focus | Yes |

The YAML dashboard content aligns with the template sections. Minor difference: the YAML uses "Dimension Coverage" and "Progress" as separate tables, while the template has "Progress" (Section 4) and "Coverage" (Section 5) -- but the data coverage matches.

### Source 3: `state_format.md` Section 7 — Dashboard

`state_format.md` Section 7 (lines 403-447) describes the research-mode dashboard, not the review dashboard specifically. It lists sections: Iteration Table, Question Status, Convergence Trend, Dead Ends, Next Focus, Source Diversity. For review mode, `state_format.md` Section 8 ("Review Mode State") does not have a dedicated dashboard spec -- it focuses on JSONL records, config, strategy, and the review-report.md sections. The review dashboard is defined in the template and YAML rather than in state_format.md.

### Source 4: Quick reference and README

The quick reference does not describe dashboard sections in detail (it only mentions the dashboard exists). The README (line 33) mentions "Persistent dashboard auto-generated after each iteration" and the structure section (line 102) lists `deep_review_dashboard.md` as "Review dashboard template (severity, coverage)."

**Issues:** None. All 4 required dashboard elements are defined in the template and generated by the YAML step. The only minor note is that `state_format.md` does not have a dedicated review-dashboard specification (it only specifies the research dashboard in Section 7), but this is not a contradiction -- the review dashboard is specified in its own template file and the YAML workflow.

---

## Summary

| Scenario | Verdict | Key Issue |
|----------|---------|-----------|
| DR-039 | PARTIAL | 11-section count matches across sources, but section names differ significantly between state_format.md and YAML (6 of 11 names mismatch). Quick reference has no section catalog. |
| DR-040 | PARTIAL | YAML defines 4 verdicts (including PASS WITH NOTES) but all other sources define only 3 (PASS/CONDITIONAL/FAIL). CONDITIONAL definition contradicts between sources. Next-command recommendations exist only in YAML completion block. |
| DR-041 | PASS | All 4 required dashboard elements (Findings Summary, Progress Table, Coverage, Trend) present in both the template file and the YAML generation step. No contradictions. |
