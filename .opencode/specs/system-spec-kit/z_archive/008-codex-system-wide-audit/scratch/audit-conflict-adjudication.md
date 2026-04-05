# Audit Conflict Adjudication Report

**Date:** 2026-02-15  
**Arbitrator:** @context agent (read-only evidence analysis)  
**Reports Reviewed:** 4 primary sources  
**Evidence Standard:** Direct file+line citations, exact code analysis, impact path verification  
**Methodology:** Strict evidence arbitration with conflict resolution matrix

---

## DISPUTE RESOLUTION

### DISPUTE 1: True P0 Missing Error Guard for shell-common.sh Sourcing?

**Claim vs Claim:**
- **@context (context-124-audit.md)**: YES — CRITICAL BLOCKER, line 151-160, 557-562
- **@review (codex-audit-upgrade-level.md)**: NO P0 found (line 388: "No P0 blockers found")

**Evidence Analysis:**

| Evidence | Source | Line(s) | Finding |
|----------|--------|---------|---------|
| Source statement (no error guard) | context-124-audit.md | 155 | `source "${SCRIPT_DIR}/../lib/shell-common.sh"` — naked, unguarded |
| Failure path | context-124-audit.md | 158 | If missing → script continues → JSON mode calls undefined `_json_escape()` → crash |
| Exact impact | context-124-audit.md | 160 | "cryptic error if shell-common.sh is missing, instead of graceful error at startup" |
| Function dependency | context-124-audit.md | 1202, 1219, 1232-1243 | `_json_escape()` called 3 times in `output_json()` |
| Classification | context-124-audit.md | 557-562 | BLOCKER-1: Missing error check — CRITICAL severity — Production blocking |
| Severity assessment | context-124-audit.md | 873 | CONDITIONAL PRODUCTION READY — "Fix 2 critical blockers... before deployment" |

**Code Verification (from context-124-audit.md line 155):**
```bash
source "${SCRIPT_DIR}/../lib/shell-common.sh"
```
No `||` error handler, no `set -e` trap, no validation.

**Why the Discrepancy?**
- Codex audit: focuses on "does upgrade-level.sh code correctly transform specs?" (functional correctness)
- Context audit: focuses on "can upgrade-level.sh be safely deployed?" (production readiness)
- These are different lenses; not contradictory

**ADJUDICATION:**
✅ **VERDICT: YES, TRUE P0 (MUST FIX NOW)**

**Rationale:**
1. Source code at line 29 has zero error handling on critical dependency
2. Failure path is deterministic: missing file → silent continuation → later crash on JSON mode
3. Impact is verified: script will crash with cryptic error instead of failing fast
4. No mitigations documented that cover this
5. Codex audit's silence is due to different evaluation lens, not disagreement

**Status:** MUST FIX NOW — Production deployment blocked until fixed.

---

### DISPUTE 2: Are sed Metadata Updates Actually Fragile/Blocking?

**Claim vs Claim:**
- **@review (codex-audit-upgrade-level.md)**: YES, fragile — P1-02 (lines 82-122), P1-04 (lines 243-265), P2-02 (lines 243-265)
- **@context (context-124-audit.md)**: Moderate risk with good mitigations — lines 589-595, not blocking

**Key Findings:**

1. **Hardcoded Section Numbers (codex:243-265)**
   - Fragility: If core template gains/loses section, numbers break
   - Impact: L2→L3 upgrade renumbers incorrectly
   - Blocking? NO — context-124 shows testing (CHK-181-182) works correctly
   - Status: SHOULD FIX P1, not MUST FIX

2. **in_complexity Flag (codex:82-122)**
   - Fragility: Exit depends on /^## 9/ specifically
   - Impact: Custom content like ## 9.1 wouldn't clear flag
   - Blocking? NO — context-124 (CHK-181-182) verifies with standard flow
   - Status: SHOULD FIX P1, not MUST FIX

3. **Multi-Agent Detection (codex P1-04)**
   - Fragility: Pattern could false-positive on user content
   - Blocking? NO — CHK-180 catches duplicate rows
   - Status: SHOULD FIX P1, not MUST FIX

**ADJUDICATION:**
✅ **VERDICT: FRAGILE YES, BUT NOT BLOCKING (SHOULD FIX P1, NOT P0)**

**Rationale:**
1. Fragility issues are real and documented with exact code locations
2. NONE marked as "blocking production" by either audit
3. Context-124 shows 97% test coverage validates standard patterns work correctly
4. Failures only occur with non-standard/customized specs (edge cases)
5. Codex identifies as P1 (should fix), not P0 (must fix) — aligns with context

**Status:** SHOULD FIX — Queue for P1 hardening sprint, not blocking deployment.

---

### DISPUTE 3: Which Fixes Are Mandatory vs Optional for This Run?

**Analysis of Four Reports' Fix Classifications:**

| Report | P0 Count | P1 Count | Scope |
|--------|----------|----------|-------|
| context-124-audit.md | 2 CRITICAL | 8 bug candidates | upgrade-level.sh only |
| codex-audit-upgrade-level.md | 0 (line 388) | 5 P1 issues | code quality |
| fix-backlog-plan.md | 5 items | 5 items | Multi-spec synthesis |
| fix-backlog-extracted.md | 5 items | 5 items | Same synthesis |

**Key Finding:** Consolidated backlog synthesized from context audits (121, 123, 124, cross-spec-lineage, typo-path), NOT from codex-audit. Explains different fix counts.

---

## FINAL ADJUDICATED FIX LIST

### ✅ MUST FIX NOW (P0 - Blocking Production): 2 Items

**1. Add error guard on shell-common.sh sourcing**
- File: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` line 29
- Evidence: context-124-audit.md:155, :158, :160, :557-562
- Impact: Production deployment blocked; JSON mode crashes without this
- Status: MUST FIX NOW

**2. Implement recursive backup for all .md files (including memory/)**
- File: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` lines 299-315
- Evidence: context-124-audit.md:381-389, :564-569
- Impact: Prevents unrecoverable data loss of session/memory files
- Status: MUST FIX NOW

---

### 🟡 SHOULD FIX (P1 - High Priority Hardening): 8 Items

**From context-124-audit.md (3 items):**

3. Add warning path when OPEN QUESTIONS heading not found (lines 719-726)
4. Tighten L2→L3 Multi-Agent row detection to table context only (lines 907-914)
5. Add iteration guard/timeout to backward comment scan (lines 397-432)

**From codex-audit-upgrade-level.md (5 items - NOT in consolidated backlog):**

6. Fix instruction comment leak in plan/checklist upgrades (lines 489, 562)
   - Evidence: codex-audit:35-80 (P1-01)
   
7. Remove dead code: SED_INPLACE_FLAG variable (lines 664-668)
   - Evidence: codex-audit:125-151 (P1-03)
   
8. Tighten level detection pattern 4 to reduce false positives (line 228)
   - Evidence: codex-audit:154-184 (P1-04)
   
9. Tighten in_complexity flag exit condition (lines 918-920)
   - Evidence: codex-audit:82-122 (P1-02)
   
10. Add automatic rollback on partial upgrade failure (lines 1285-1328)
    - Evidence: codex-audit:187-215 (P1-05)

---

### 📋 DOC ONLY (Documentation/Verification, No Code): 5 Items

11. Spec 123 completion gate: verify and mark P0 checklist items
12. Resolve Spec 121 orphaned memory/filesystem mismatch
13. Close Spec 121 open blockers (P0 remediation, uncertainties)
14. Reconcile Spec 123 task/checklist/implementation-summary contradictions
15. Populate Spec 123 scratch/ with verification evidence logs

---

### ❌ DISCARD (Research Conclusion): 1 Item

16. Typo-path propagation research — Confirmed non-propagated; no action required

---

## SUMMARY STATISTICS

| Category | Count | Blocking |
|----------|-------|----------|
| MUST FIX NOW (P0) | 2 | YES |
| SHOULD FIX (P1) | 8 | NO |
| DOC ONLY | 5 | NO |
| DISCARD | 1 | N/A |
| **TOTAL** | **16** | |

---

## ANSWERS TO USER'S THREE DISPUTES

### Dispute 1: Is there a true P0 missing error guard for shell-common.sh sourcing?
✅ **YES, TRUE P0** (context-124-audit.md:151-160, 557-562). Exact code, exact failure path, exact impact. MUST FIX NOW.

### Dispute 2: Are sed metadata updates actually fragile/blocking?
✅ **FRAGILE YES, NOT BLOCKING** (codex-audit-upgrade-level.md:P1-01 through P1-05). Classification: SHOULD FIX P1, not MUST FIX P0.

### Dispute 3: Which fixes are mandatory vs optional?
✅ **Mandatory: 2** (shell-common sourcing + recursive backup). **High-priority: 8** (code hardening). **Optional: 5** (doc reconciliation). **Total: 16 actionable items.**

---

## PRODUCTION READINESS VERDICT

**Current Status:** 🟡 CONDITIONAL  
**After MUST FIX (2 items):** ✅ **PRODUCTION READY**

The script is functionally complete (97% test coverage) but cannot be safely deployed without:
1. Shell-common.sh error guard (prevents mid-execution crashes)
2. Recursive backup for memory/ (prevents data loss)

After these two P0 fixes, production readiness thresholds are met. P1/P2 items improve robustness and should be scheduled for next sprint.

---

**Adjudication Completed:** 2026-02-15  
**Confidence Level:** HIGH (all evidence directly cited with line numbers)  
**Conflicts Resolved:** 3 of 3  
**Recommendation:** Proceed with MUST FIX NOW items; queue SHOULD FIX for P1 sprint.
