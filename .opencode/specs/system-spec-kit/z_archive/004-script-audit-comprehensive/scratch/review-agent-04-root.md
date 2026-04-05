# Review: Shard C04 — Root Orchestration & Command Routing

**Review Date:** 2026-02-15  
**Reviewer:** @review (read-only)  
**Inputs:**  
- `context-agent-04-root-orchestration.md` (context agent findings, 7 issues)  
- `build-agent-04-root-verify.md` (build agent verification, 4/7 confirmed)

---

## Reliability Score: 76 / 100 — ACCEPTABLE (pass with notes)

| Dimension | Score | Max | Rationale |
|-----------|-------|-----|-----------|
| **Correctness** | 16 | 30 | 3 of 7 findings disproven by build agent (43% false-positive rate). C04-F003 claimed HIGH severity with 85% confidence but constitutional files DO have frontmatter+anchors. C04-F004 claimed 100% confidence on uniform paths but multiple valid invocation forms exist. C04-F002 is policy interpretation, not a concrete mismatch. |
| **Security** | 22 | 25 | No security-relevant claims in scope. No secrets or auth issues. Neutral — no errors, no relevance to deduct from. |
| **Patterns** | 17 | 20 | Audit structure is exemplary: clear severity table, evidence paths, remediation matrix with effort estimates. Minor deduction for inconsistent confidence calibration across findings. |
| **Maintainability** | 13 | 15 | Both documents well-structured and readable. Build agent is concise and effective. Context agent evidence citations are thorough. |
| **Performance** | 8 | 10 | Tool budget exhaustion noted and documented (12/12 calls). Build agent verified efficiently. Minor deduction: tool budget exhaustion contributed directly to false positives (F003 admitted "NOT READ"). |

---

## Issue Classification

### P0 — BLOCKER (2)

#### P0-1: False Positive C04-F003 — Constitutional Files Falsely Flagged as Missing Metadata
- **Source:** context-agent-04-root-orchestration.md, lines 82–109
- **Evidence:** Build agent directly read constitutional files and confirmed they include both `triggerPhrases` frontmatter AND `<!-- ANCHOR_EXAMPLE:... -->` tags.
- **Impact:** If acted upon, this would trigger unnecessary rework on correct files. Classified as HIGH severity in the original audit, amplifying risk of wasted effort.
- **Root cause:** Context agent admitted "Not read directly (toolbudget constraint)" at line 101 but still rated confidence at 85% — this is an overclaim. Unverified findings should not exceed 50% confidence.

#### P0-2: False Positive C04-F004 — Overclaimed Path Uniformity at 100% Confidence
- **Source:** context-agent-04-root-orchestration.md, lines 115–148
- **Evidence:** Build agent ran `rg -n "generate-context\\.js"` and found diverse command styles (`.opencode/...`, `scripts/dist/...`, `dist/...`, `../dist/...`), disproving the "all identical" claim.
- **Impact:** The claimed "90 matches across all .md files, all identical" (line 136) is factually incorrect. Remediation advice based on a false premise would miss the real path diversity issue.
- **Root cause:** Context agent likely searched a subset or applied a filter that masked variation. Confidence of 100% on a factually wrong claim is a calibration failure.

### P1 — REQUIRED (1)

#### P1-1: Severity Inflation on C04-F002 — Policy Interpretation Classified as HIGH
- **Source:** context-agent-04-root-orchestration.md, lines 53–78
- **Evidence:** Build agent noted "Facts are true... but no broken reference/command drift was verified; claim is policy interpretation, not a concrete mismatch."
- **Impact:** Classifying a policy interpretation question as HIGH severity alongside confirmed issues (F001, F005) dilutes the severity signal. Consumers of the audit may over-prioritize this item.
- **Remediation:** Downgrade to MEDIUM or reclassify as a documentation improvement suggestion.

### P2 — SUGGESTION (2)

#### P2-1: Confidence Calibration Drift
- **Source:** All 3 disproven findings carried confidence ratings of 85–100%.
- **Impact:** Undermines trust in the confidence metric across the entire audit. If 100% confidence can be wrong, the metric loses meaning.
- **Suggestion:** Adopt stricter calibration: unverified/inferred findings capped at 60%; only directly-read-and-confirmed findings may exceed 85%.

#### P2-2: Build Agent Lacks Severity Re-Assessment
- **Source:** build-agent-04-root-verify.md (lines 9–17)
- **Impact:** Build agent confirms/denies findings but does not re-score severity for confirmed items. A "CONFIRMED" finding at the original severity may still be over- or under-rated.
- **Suggestion:** Build verification should include a `revised_severity` column for confirmed findings.

---

## Summary Counts

| Metric | Value |
|--------|-------|
| **Reliability Score** | 76 / 100 |
| **P0 (Blocker)** | 2 |
| **P1 (Required)** | 1 |
| **P2 (Suggestion)** | 2 |

---

## Top Remediation Actions

1. **Retract C04-F003 and C04-F004** from the audit findings or re-classify as NOT CONFIRMED with corrected evidence. These false positives risk triggering unnecessary remediation work.
2. **Downgrade C04-F002 from HIGH to MEDIUM** — it is a documentation clarity question, not a functional break or gate enforcement failure.
3. **Implement confidence calibration rule**: Unverified findings (not directly read) capped at 60% confidence; 85%+ reserved for directly confirmed evidence only.

---

## Positive Highlights

- **C04-F001 (version mismatch)** is a genuine CRITICAL finding, well-documented with clear remediation options. High value.
- **C04-F005 and C04-F006** are solid MEDIUM findings with actionable, proportionate fixes.
- **Audit structure** is exemplary — severity tables, evidence paths, remediation matrix with effort estimates, tool budget tracking.
- **Build agent verification** was efficient and decisive, correctly challenging 3 of 7 findings with direct evidence.

---

**Review Status:** COMPLETE  
**Confidence:** HIGH (all files read, all claims cross-referenced against both inputs)
