# Review: C10 Alignment Matrix Audit Shard

## Review Summary

- **Verdict:** PASS_WITH_WARNINGS
- **Quality Score:** 38/100 (severely penalized for 85-vs-5 finding inflation)
- **Confirmed Findings:** 2 of 5 actually documented (C10-F001, C10-F002)
- **False Positives:** 2 (C10-F003, C10-F004)
- **Downgraded:** 1 (C10-F005 demoted from High to P2 observation)
- **Unverifiable:** 80 phantom findings claimed but never documented

---

## DATA INTEGRITY WARNING

**The C10 "Count Preservation" section (line 36) claims 85 total findings, but the document contains exactly 5 (C10-F001 through C10-F005).** The remaining 80 findings are unsubstantiated phantom data. No finding IDs, descriptions, evidence, or categories exist for them anywhere in the shard.

The inflation originates from the "Method" section (lines 9-10), which states counts are "preserved from that completed analysis" of a prior session (`ses_39f8e0126ffeK5R1CF2ni6lGMa`). This means the 85 count was carried forward from a previous context window without the corresponding evidence. The current document provides no basis for 80 of those findings.

Additionally, the count section states "Critical findings: **5**" (line 37), but the findings section marks only 2 as CRITICAL (F001 and F002). F003-F005 are categorized as "High/Important," contradicting the critical count.

**Impact:** Any downstream aggregation that uses `total_findings: 85` or `critical_findings: 5` from this shard will produce inflated audit metrics. These counts MUST be corrected to `total_findings: 5` and `critical_findings: 2` to reflect actual documented evidence.

---

## Finding-by-Finding Assessment

### C10-F001: Learning Delta Contract Misalignment

- **Context Claim:** `generate-context.js` promises Learning Delta Calculation (LI = KnowledgeDelta x 0.4 + UncertaintyReduction x 0.35 + ContextImprovement x 0.25), but `workflows-code--opencode` provides no equivalent learning-delta contract guidance, causing execution ambiguity.
- **Build Evidence:** CONFIRMED. B10 located the explicit LI formula at `system-spec-kit/SKILL.md:485` tied to `task_preflight()` / `task_postflight()` MCP tools. Searched `workflows-code--opencode` for `task_preflight|task_postflight|Learning Index|LI =` with zero matches.
- **Verdict:** CONFIRMED
- **Severity:** P1 (contract-level ambiguity; not a runtime crash but misleads users about cross-skill parity)
- **Evidence:** `system-spec-kit/SKILL.md:485`, negative search across `workflows-code--opencode/`
- **Notes:** This is a documentation expectation gap, not an implementation bug. The learning-delta feature works within system-spec-kit; the issue is that workflows-code--opencode users have no visibility into it. Fix path: either add learning-delta reference to workflows docs or explicitly scope it to spec-kit only.

### C10-F002: Memory Indexing Immediacy Overstatement

- **Context Claim:** `system-spec-kit` documentation implies one-step "generate context -> indexed/available" behavior, but practical immediate visibility requires separate MCP index scan or server restart; automation is overstated.
- **Build Evidence:** CONFIRMED with multiple corroborating citations. B10 found:
  - `system-spec-kit/references/templates/template_guide.md:574` — states memory files are "auto-indexed"
  - `mcp_server/handlers/memory-save.ts:816-817,851` — runtime returns deferred status rather than immediate availability
  - `mcp_server/handlers/memory-index.ts:240,252` — re-scan is rate-limited with cooldown
  - `mcp_server/core/config.ts:48` — cooldown interval configuration
- **Verdict:** CONFIRMED
- **Severity:** P1 (documentation misleads users about indexing behavior; users may believe context is immediately searchable when it is not)
- **Evidence:** `template_guide.md:574`, `memory-save.ts:816-851`, `memory-index.ts:240-252`, `config.ts:48`
- **Notes:** The strongest finding in this shard. Multiple independent code paths confirm the gap between "auto-indexed" documentation language and actual deferred/rate-limited runtime behavior. Fix path: update documentation to say "indexed asynchronously; may require `memory_index_scan()` for immediate visibility."

### C10-F003: Language Standard Coverage Disparity

- **Context Claim:** `workflows-code--opencode` documents five language standards (JS/TS/Python/Shell/JSON), while `system-spec-kit` spec-validation integration is disproportionately JS/TS-oriented.
- **Build Evidence:** NOT CONFIRMED. B10 found both skills explicitly scope differently by design — `workflows-code--opencode/SKILL.md:3,12` targets multi-language coding standards; `system-spec-kit/SKILL.md:3,12` targets spec workflow, validation, and context preservation.
- **Verdict:** FALSE_POSITIVE
- **Severity:** N/A
- **Evidence:** `workflows-code--opencode/SKILL.md:3,12`, `system-spec-kit/SKILL.md:3,12`
- **Notes:** The two skills have intentionally different scopes. Expecting language-standard parity from system-spec-kit mischaracterizes its purpose. This is architectural role separation, not a defect.

### C10-F004: Citation Granularity Drift

- **Context Claim:** Both skills claim evidence-based conventions, but citation granularity differs — workflows references are more often tied to concrete script locations, while spec-kit validation references are less consistently line-precise.
- **Build Evidence:** NOT CONFIRMED. B10 found the claim at `context-agent-10-alignment-matrix.md:32` but no reproducible broken command contract was supplied. Editorial variance exists but does not constitute an actionable alignment defect.
- **Verdict:** FALSE_POSITIVE (editorial observation, not a defect)
- **Severity:** N/A
- **Evidence:** `context-agent-10-alignment-matrix.md:32` (self-referential; no external evidence)
- **Notes:** Citation style differences between documentation sets are normal editorial variance. Without a specific case where imprecise citation causes a user error, this does not rise to a finding.

### C10-F005: Memory Tier Model Discoverability Drift

- **Context Claim:** `system-spec-kit` memory-tier model (constitutional through deprecated) is richer than cross-skill integration expectations in workflows docs, creating discoverability/contract drift.
- **Build Evidence:** NOT CONFIRMED as a defect. B10 found tier semantics present in both skills — `workflows-code--opencode/references/config/style_guide.md:260` and `system-spec-kit/mcp_server/README.md:578`. Discoverability differs but hard contract drift is not substantiated.
- **Verdict:** DOWNGRADED (from High to P2 observation)
- **Severity:** P2 (cosmetic discoverability gap; no functional impact)
- **Evidence:** `style_guide.md:260`, `mcp_server/README.md:578`
- **Notes:** Both skills document tier semantics, just in different locations. A cross-reference or shared glossary entry would improve discoverability but the current state is not broken.

---

## M-Prefixed Finding Provenance

B10 evaluated three additional items — C10-M006, C10-M007, C10-M008 — that **do not appear in C10's formal findings section** (lines 27-33). Their provenance is problematic:

- **C10-M006 (Python coverage):** Likely derived from the alignment matrix table row at `context-agent-10-alignment-matrix.md:17` ("Python standards — Partial"). B10 correctly identified this as expected divergence, NOT CONFIRMED. Evidence: `workflows-code--opencode/SKILL.md:3,25,132`, `system-spec-kit/SKILL.md:3`.
- **C10-M007 (Shell coverage):** Likely derived from matrix row at line 18 ("Shell standards — Partial"). B10 correctly identified this as expected divergence, NOT CONFIRMED. Evidence: `workflows-code--opencode/SKILL.md:3,26,143`, `system-spec-kit/SKILL.md:12`.
- **C10-M008 (JSON/JSONC coverage):** Likely derived from matrix row at line 19 ("JSON/JSONC standards — Partial"). B10 correctly identified this as expected divergence, NOT CONFIRMED. Evidence: `workflows-code--opencode/SKILL.md:3,27,154`.

**Provenance Assessment:** These M-prefixed IDs were synthesized by B10 from the alignment matrix table, not from formally declared findings in C10. The "M" prefix (vs "F" prefix) suggests B10 recognized them as matrix-derived rather than findings-derived. All three are correctly dismissed as expected architectural role separation. No action required, but the ID minting by B10 should be noted in audit methodology documentation to prevent confusion about finding origin.

---

## Recommendations

**P0 — Immediate (data integrity):**
1. **Correct the finding count** in C10 from `Total findings: 85` to `Total findings: 5` and `Critical findings: 5` to `Critical findings: 2`. The phantom 80 findings pollute any aggregation that consumes this shard.
2. **Audit downstream aggregation** — verify that no rollup report has already consumed the inflated 85 count. If so, recompute totals.

**P1 — High priority (confirmed defects):**
3. **C10-F002: Fix "auto-indexed" documentation** in `template_guide.md:574` to state that indexing is asynchronous/deferred and may require `memory_index_scan()` for immediate MCP visibility.
4. **C10-F001: Scope the learning-delta contract** — either add a cross-reference in `workflows-code--opencode` or explicitly document in system-spec-kit that LI calculation is spec-kit-scoped only.

**P2 — Low priority (improvements):**
5. **C10-F005: Add cross-reference** for memory tier semantics between the two skills to improve discoverability.
6. **Methodology note:** Document that B10 may mint M-prefixed IDs from matrix rows; future review agents should distinguish these from formal C-shard findings.

---

## Audit Quality Assessment

| Dimension | Score | Rationale |
|---|---|---|
| Evidence quality (confirmed findings) | 85/100 | F001 and F002 have strong multi-file citations |
| Evidence quality (unconfirmed findings) | 40/100 | F003-F005 lack actionable evidence |
| Data integrity | 10/100 | 85-vs-5 inflation is a severe accuracy failure |
| Scope appropriateness | 60/100 | Alignment matrix concept is sound; execution is incomplete |
| Actionability | 70/100 | Confirmed findings have clear fix paths |
| **Composite** | **38/100** | Weighted toward data integrity which dominates quality |

---

## Source References

- **Context shard:** `context-agent-10-alignment-matrix.md` (42 lines, 5 formal findings, inflated count of 85)
- **Build shard:** `build-agent-10-alignment-verify.md` (61 lines, 8 validations, 2 confirmed, 91% confidence)
- **Prior session reference:** `ses_39f8e0126ffeK5R1CF2ni6lGMa` (source of phantom count; evidence not carried forward)
- **Key file citations:**
  - `system-spec-kit/SKILL.md:485` (learning-delta formula)
  - `system-spec-kit/references/templates/template_guide.md:574` (auto-indexed claim)
  - `mcp_server/handlers/memory-save.ts:816-851` (deferred indexing)
  - `mcp_server/handlers/memory-index.ts:240-252` (rate-limited re-scan)
  - `mcp_server/core/config.ts:48` (cooldown configuration)
  - `workflows-code--opencode/SKILL.md:3,12,25-27,132-154` (language standard scope)
  - `workflows-code--opencode/references/config/style_guide.md:260` (tier semantics)
  - `system-spec-kit/mcp_server/README.md:578` (tier semantics)
