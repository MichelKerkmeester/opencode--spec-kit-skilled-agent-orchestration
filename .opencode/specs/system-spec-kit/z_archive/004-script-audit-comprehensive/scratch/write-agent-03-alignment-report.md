# Alignment Report: workflows-code--opencode vs system-spec-kit

**Date:** 2026-02-15  
**Scope:** Comparison of `.opencode/skill/system-spec-kit` vs `.opencode/skill/workflows-code--opencode`  
**Focus:** Language standards (JS/TS/Python/Shell/JSON), verification claims, command contracts, documentation promises vs scripts  
**Sources:** C10 (context-agent-10-alignment-matrix.md), B10 (build-agent-10-alignment-verify.md), R10 (review-agent-10-alignment.md)

**Exclusion Note:** The node_modules relocation currently in progress is excluded from this audit scope.

---

## 1. Confirmed Alignments

| Category | Evidence | Notes |
|---|---|---|
| **Tier semantics** | Present in both workflows references (`workflows-code--opencode/references/config/style_guide.md:260`) and system-spec-kit docs (`system-spec-kit/mcp_server/README.md:578`) | Discoverability differs but contract parity exists |
| **Role separation** | workflows-code--opencode scoped to multi-language coding standards (SKILL.md:3, 12); system-spec-kit scoped to spec workflow/validation/context preservation (SKILL.md:3, 12) | Expected divergence, not a defect |
| **Python coverage** | Explicit in workflows by design (SKILL.md:3, 25, 132); system-spec-kit not positioned as language-standard parity docs | Intentional separation of concerns |
| **Shell coverage** | Explicit in workflows by design (SKILL.md:3, 26, 143); system-spec-kit scoped to workflow/memory orchestration | Intentional separation of concerns |
| **JSON/JSONC coverage** | Explicit in workflows (SKILL.md:3, 27, 154); no equivalent requirement for system-spec-kit | Intentional separation of concerns |

---

## 2. Confirmed Misalignments

### C10-F001 [CRITICAL] - Learning Delta Contract Asymmetry
**Evidence:**
- `system-spec-kit/SKILL.md:485` defines explicit learning-delta contract: `LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25)` tied to `task_preflight()` / `task_postflight()`.
- No corresponding learning-delta contract appears in `workflows-code--opencode` docs (search for `task_preflight|task_postflight|Learning Index|LI =` returned no matches).

**Impact:** Contract-level misalignment causing execution ambiguity when users expect learning-delta calculation guidance across both skills.

---

### C10-F002 [CRITICAL] - Memory Indexing Immediacy Overstatement
**Evidence:**
- `system-spec-kit/references/templates/template_guide.md:574` claims memory files are "auto-indexed" with implied immediate availability.
- Runtime can return deferred status (`mcp_server/handlers/memory-save.ts:816, 817, 851`) rather than immediate indexed availability.
- Re-scan is rate limited (`mcp_server/handlers/memory-index.ts:240, 252`) with cooldown configured at `mcp_server/core/config.ts:48`.

**Impact:** One-step immediate availability messaging is overstated; practical immediate MCP visibility may require separate index scan or server restart conditions.

---

## 3. Uncertain Areas

### C10-F004 - Citation Granularity Quality Drift
**Claim:** workflows references are more often tied to concrete script locations, while spec-kit validation references are less consistently line-precise (C10:32).

**Status:** Editorial variance confirmed to exist, but **no reproducible broken command contract** was supplied by C10 or validated by B10.

**Recommended Action:** Track as documentation consistency improvement opportunity rather than critical misalignment.

---

### Finding Count Reconciliation (R10 Warning)
**Issue:** C10 claims "Total findings: 85" but only 5 substantiated findings appear in C10 findings section; B10 validated 8 items, confirmed only 2.

**Status:** Provenance gap between claimed count (85) and documented evidence (5 in C10, 8 validated by B10, 2 confirmed).

**Recommended Action:** Clarify M006-M008 provenance not present in C10 findings section; reconcile count methodology.

---

## 4. Recommended Policy Clarifications

| ID | Recommendation | Priority |
|---|---|---|
| **REC-01** | Add explicit learning-delta contract guidance to workflows-code--opencode or clarify its system-spec-kit exclusivity in both skill README files | HIGH |
| **REC-02** | Revise system-spec-kit memory indexing documentation to accurately reflect deferred/rate-limited indexing conditions and recommend explicit `memory_index_scan()` or server restart for immediate MCP visibility | HIGH |
| **REC-03** | Document expected role separation (language standards vs spec workflow) in both skills' RELATED RESOURCES sections to prevent future alignment audits flagging intentional divergence as defects | MEDIUM |
| **REC-04** | Standardize citation granularity expectations across both skills (prefer line-level precision for actionable references) | LOW |
| **REC-05** | Reconcile finding count methodology: clarify whether C10's "85 findings" refers to total scan observations vs. substantiated misalignments; align future C+B+R artifact counting | MEDIUM |

---

## Summary

**Confirmed Misalignments:** 2  
**Critical Issues:** C10-F001 (learning-delta contract asymmetry), C10-F002 (memory indexing immediacy overstatement)  
**Uncertain Areas:** 2 (citation quality drift, finding count reconciliation)  
**Alignment Confidence:** 89% (per R10)  
**Overall Status:** PASS_WITH_WARNINGS (per R10)

Primary misalignments are contract-level (what users are told will happen) rather than pure implementation defects. Highest-risk gaps are around memory indexing immediacy expectations and learning-delta calculation parity across skills.
