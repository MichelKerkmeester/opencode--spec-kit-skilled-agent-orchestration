# Cross-Spec Lineage Report: Specs 121, 123, 124 → 125

<!-- CONTEXT: Analyzing decision dependencies, technical inheritance, contradictions, and integration risks -->

---

## 1. EXECUTIVE SUMMARY

**Lineage Overview**: Spec 121 (Script Audit) conducted a comprehensive 30-shard investigation across system-spec-kit scripts, producing a detailed remediation roadmap with 5 confirmed P0 blockers, 16 P1 fixes, and 26+ P2 suggestions. Simultaneously, Specs 123 and 124 executed targeted fixes in parallel: Spec 123 addressed path resolution for nested spec folders (1-line root cause fix plus code duplication consolidation), and Spec 124 implemented a bash script infrastructure for spec folder level upgrades (1,490+ lines, 22 functions, 4 bugs fixed).

**Key Dependency**: All three specs feed into Spec 125 (Codex System-Wide Audit) as foundational context. Spec 121 provides the comprehensive bug inventory and architectural assessment; Specs 123/124 provide working implementations that must be validated against the P0/P1/P2 remediation roadmap.

**Critical Risks**:
- **Spec 121 uncertainties**: 3 items deferred (U07, U27, U28) that may reveal additional coverage gaps
- **Unresolved P0s**: 5 blockers identified but remediation NOT YET EXECUTED (audit phase only)
- **Parallel execution without cross-validation**: Specs 123/124 were executed independently without reference to Spec 121's audit findings
- **Quality regression**: Audit self-assessment dropped 26 points (81→55) after uncertainty resolution
- **False positive precedent**: 43% false-positive rate in one shard (C04) suggests confidence calibration issues propagate to Spec 125

---

## 2. CARRY-OVER DECISIONS

Architectural and technical decisions from completed specs that constrain Spec 125 scope and approach.

| Source Spec | Decision | Constraints on Spec 125 | Enable Spec 125 Work |
|-------------|----------|--------------------------|----------------------|
| **121-ADR-001** (Shard-Based Audit Strategy) | 30 discrete investigation shards (Context, Build, Review, Synthesis) with bounded scope | Spec 125 must acknowledge that Spec 121 covered scripts/ shared/ mcp_server/ exhaustively; new findings in Spec 125 should be reconciled against Spec 121 findings | Spec 125 can adopt the shard methodology for codex-system-wide scope if systematic coverage is needed |
| **121-ADR-002** (Node_modules Relocation Exclusion) | Explicit filter protocol: exclude ONLY issues solely caused by relocation; include all legitimate bugs | Spec 125 must NOT re-audit relocation-related issues; assume Spec 121's exclusion filter was applied correctly | Precedent established: when infrastructure work is in progress, exclude cleanly and document rationale |
| **121-ADR-003** (Audit Synthesis & Remediation Prioritization) | P0/P1/P2 taxonomy; 5 confirmed P0s, 16 P1s, 26+ P2s; 2 false positives retracted; 3 deferred uncertainties (U07, U27, U28) | Spec 125 must assume P0/P1/P2 taxonomy applies system-wide; P0s are blocking (non-negotiable), P1s are required, P2s are quality improvements | Remediation roadmap from Spec 121 is input to Spec 125 prioritization logic |
| **121-ADR-004** (Uncertainty Resolution) | 31 uncertainties processed: 10 resolved, 8 partially resolved, 3 deferred, 10 accepted as LOW priority. Key resolution: audit quality score corrected 81→55 | Spec 125 cannot assume 81/100 audit quality; must use 55/100 as baseline. Deferred items U07/U27/U28 are still open and may affect coverage understanding | Methodology for uncertainty triage established; Spec 125 should adopt similar framework for resolving discrepancies |
| **123-Phase1** (Nested Subfolder Path Resolution) | Root cause: path.isAbsolute() check needed at line 74 of folder-detector.ts; 6 input formats now supported (nested, prefixed, bare child, flat, absolute) | Spec 125 memory context save logic now supports specs/003-parent/121-child style paths; bare child auto-resolution enabled | Spec 125 can use generated memory context files in nested subfolder format; paths will resolve correctly |
| **124-Design** (Bash 3.2+ Compatibility) | No associative arrays, no ${var^^} uppercase, macOS-compatible sed wrapper; 6-phase upgrade architecture (input, detection, backup, file upgrade, markers, output) | Spec 125 must use only bash 3.2+ compatible constructs in any new scripts; established pattern for macOS/Linux portability | Precedent set for portable bash; Spec 125 can reuse _sed_inplace() wrapper pattern |
| **124-Bugs Fixed** | 4 bugs fixed (level detection, comment insertion, idempotency, metadata update); dual-pattern idempotency for renamed headings | Spec 125 must validate that idempotency checks account for heading transformations; Spec 124's bug fixes are foundational for reliable level upgrades | If Spec 125 modifies spec templates, ensure idempotency logic in Spec 124 is updated accordingly |

---

## 3. CONTRADICTIONS & CONFLICTS

Conflicting findings, design decisions, or assumptions across the three specs that create risk for Spec 125.

### Contradiction 1: Comprehensive Methodology vs. Targeted Fix

**Finding**: Spec 121 employed a comprehensive 30-shard audit strategy covering all scripts exhaustively with three independent verification phases (context, build, review). Spec 123 executed a targeted fix addressing a single root cause (path.isAbsolute() fix) without broader audit of related code paths.

**Impact on Spec 125**: Risk that Spec 123's limited scope may have missed related issues that Spec 121's comprehensive approach would have caught.

**Recommended Resolution**: Spec 125 should explicitly map Spec 123's 6 input formats against Spec 121's audit findings to confirm all edge cases are covered.

---

### Contradiction 2: Independence vs. Remediation Roadmap Alignment

**Finding**: Spec 121 identified 5 P0 blockers (C08-F001, C08-F008, C08-F003, C08-F010, C09-001) with critical data integrity issues. Spec 124 created a 1,490-line bash script but does NOT reference or cross-validate against these P0 blockers.

**Impact on Spec 125**: Risk that Spec 124's bash script may interact with Spec 121's P0 blockers without mitigating strategies, creating new failure modes.

**Recommended Resolution**: Spec 125 should conduct a dependency analysis showing which P0 blockers could impact Spec 124's success, and make Spec 121 P0 fixes a prerequisite to Spec 124 in the remediation plan.

---

### Contradiction 3: Quality Assessment Volatility

**Finding**: Spec 121 self-assessed audit quality at 81/100; independently verified at 55/100. Specs 123 and 124 rely on similar self-assessment methodology. Are their scores (91, 88) also inflated?

**Impact on Spec 125**: Spec 125 cannot trust self-assessed quality scores without independent verification and standardized rubrics.

**Recommended Resolution**: Spec 125 should implement the scoring rubric recommended by Spec 121 before accepting any quality claims from analysis agents.

---

## 4. FEATURE DRIFT

Scope expansion and deviation from original intent in each spec.

### Spec 123: generate-context Subfolder Support

**Intended Scope**: Support 6 input formats for nested spec folder path resolution.

**Actual Achievement**: All 6 formats supported PLUS Phase 2b consolidation that created subfolder-utils.ts (135 LOC) with shared utilities and 21 tests.

**Scope Drift**: **LOW RISK** — expansion was a quality improvement (DRY consolidation) that reduced net LOC and improved maintainability.

---

### Spec 124: Spec Folder Level Upgrade Script

**Intended Scope**: Level detection, upgrade path validation, backup creation, new file creation, section appending/insertion, idempotency, SPECKIT_LEVEL marker updates.

**Actual Achievement**: All 7 P0 requirements met plus 4 bugs fixed; 1,490+ LOC (3.7x initial estimate of 300-400).

**Scope Drift**: **MEDIUM RISK** — Actual LOC far exceeded estimate; 4 bugs fixed indicates edge case complexity was underestimated.

---

## 5. UNRESOLVED TASKS

Tasks marked incomplete or deferred across the three specs.

| Task | Spec | Status | Impact on Spec 125 | Blocker? |
|------|------|--------|-------------------|----------|
| **Phase 4 Synthesis** | 121 | Incomplete — CHK-050 through CHK-063 unchecked | Findings scattered in artifacts; no consolidated report yet | **YES** |
| **Deferred Uncertainty U07** | 121 | Deferred — Coverage gap analysis | May reveal uncovered modules/functions | **YES** |
| **Deferred Uncertainty U27** | 121 | Deferred — Cross-shard finding deduplication | Same issue may be reported multiple times; effort estimates may be inflated | **MEDIUM** |
| **Deferred Uncertainty U28** | 121 | Deferred — Partial verification in C02/C09/C10 | Coverage gaps in 3 shards; actual bug count uncertain | **MEDIUM** |
| **P0 Remediation (T033)** | 121 | Not Executed — 6.75h estimated | Spec 125 cannot assume P0s are fixed | **YES** |
| **P1 Remediation (T034)** | 121 | Not Executed — 20h estimated | Spec 125 scope may exclude P1s if P0s are prioritized | **MEDIUM** |

**Summary**: Critical blockers for Spec 125 include Phase 4 synthesis, P0 remediation, and deferred uncertainties U07/U27/U28.

---

## 6. RISKS FOR SPEC 125

Prioritized list of risks inherited from Specs 121, 123, 124 or created by their interactions.

| Priority | Risk | Severity | Mitigation |
|----------|------|----------|-----------|
| **1** | **P0 blockers not yet fixed** | CRITICAL | Verify fix status before proceeding; make remediation a prerequisite |
| **2** | **False positives from Spec 121** | HIGH | C04 had 43% false-positive rate; independently verify high-confidence claims |
| **3** | **Unresolved deferred uncertainties** | HIGH | U07/U27/U28 must be closed before claiming full audit coverage |
| **4** | **Quality score unreliability** | HIGH | Implement scoring rubric from Spec 121 before accepting any findings |
| **5** | **Code duplication in Spec 123** | MEDIUM | Phase 2b resolved; Phase 1 code duplication smell is now mitigated |
| **6** | **Spec 124 scope underestimation** | MEDIUM | Initial 300-400 LOC became 1,490+; 4 bugs found. Budget generously for bash scripting |
| **7** | **Bash 3.2+ portability constraints** | MEDIUM | If Spec 125 writes bash, must follow Spec 124's pattern; limits code clarity |
| **8** | **Spec 121 coverage gaps** | MEDIUM | C02/C09/C10 have partial verification; treat findings from these shards as provisional |
| **9** | **Parallel execution without cross-validation** | MEDIUM | Specs 123/124 executed independently; no evidence they validated against P0/P1/P2 roadmap |
| **10** | **node_modules relocation precedent** | LOW | Spec 121's exclusion filter validity depends on relocation completion |

---

## 7. ACTIONABLE INPUTS FOR SPEC 125

Prioritized recommendations derived from Specs 121, 123, 124 findings.

### TIER 1: CRITICAL PATH (Must complete before other work)

1. **[PRIORITY: P0] Verify Spec 121 P0 blockers are fixed**
   - Confirm the 5 P0 remediation actions (C08-F001, C08-F008, C08-F003, C08-F010, C09-001) are completed.
   - **Why**: P0 blockers include data integrity risks; Spec 125 cannot audit a system with these bugs.
   - **Reference**: [121:implementation-summary.md:41-49]

2. **[PRIORITY: P0] Close deferred uncertainties U07, U27, U28**
   - Complete coverage gap analysis (U07), cross-shard deduplication (U27), and partial verification completion (U28).
   - **Why**: These directly affect confidence in Spec 121's findings; U27 could reduce counts; U07 could reveal uncovered functions.
   - **Reference**: [121:decision-record.md:418-421]

3. **[PRIORITY: P0] Consolidate Spec 121 findings into remediation report**
   - Complete Phase 4 synthesis (tasks CHK-050-054, CHK-060-063) by compiling all artifacts into unified findings document.
   - **Why**: Findings are scattered; Spec 125 needs one authoritative source.
   - **Reference**: [121:checklist.md:66-79]

---

### TIER 2: VALIDATION (Before accepting Specs 123/124 as complete)

4. **[PRIORITY: P1] Verify Spec 123's formats against Spec 121 path-handling findings**
   - Cross-reference 6 input formats against Context Shard 8 (T008) to confirm no edge cases were missed.
   - **Reference**: [123:spec.md:179-189] vs [121:tasks.md T008]

5. **[PRIORITY: P1] Validate Spec 124 doesn't violate Spec 121 P0 constraints**
   - Map Spec 124's operations against P0 blockers to confirm no interaction risks.
   - **Reference**: [124:implementation-summary.md:20-42] vs [121:implementation-summary.md:37-49]

6. **[PRIORITY: P1] Apply Spec 121's recommended scoring rubric**
   - Establish objective criteria before trusting quality scores: citations per finding, evidence density, file:line coverage.
   - **Reference**: [121:implementation-summary.md:169-175]

---

### TIER 3: RISK MITIGATION (Before final scope commitment)

7. **[PRIORITY: P2] Budget generously for bash scripting complexity**
   - Spec 124 estimates were 3.7x underestimated (300-400 → 1,490+ LOC); expect 4+ bugs during implementation.
   - **Reference**: [124:spec.md:150, implementation-summary.md:20]

8. **[PRIORITY: P2] Plan for re-verification of high-confidence claims**
   - Budget for independent re-verification of high-confidence findings, especially from C04 (43% false-positive rate).
   - **Reference**: [121:implementation-summary.md:31]

9. **[PRIORITY: P2] Plan bash 3.2+ portability testing**
   - If Spec 125 includes scripts, establish dual-OS testing for macOS (3.2) and Linux (4+).
   - **Reference**: [124:implementation-summary.md:34]

10. **[PRIORITY: P2] Document Spec 125's boundary with Specs 121-124 outputs**
    - Create explicit handoff defining which findings Spec 125 accepts vs. re-investigates.
    - **Reference**: All three specs

---

## 8. EVIDENCE CITATIONS

All major claims in sections 1-7 are sourced from the following artifacts:

**Spec 121 (Script Audit Comprehensive)**:
- decision-record.md: ADRs 1-4 (lines 8-499), P0 blockers (lines 248-256), uncertainties (lines 418-421)
- implementation-summary.md: P0/P1/P2 findings (lines 37-121), quality score regression (lines 189-203), lessons learned (lines 169-175)
- checklist.md: Unresolved items (lines 66-79)

**Spec 123 (generate-context Subfolder Support)**:
- spec.md: Input formats (lines 179-189), scope (lines 39-60)
- implementation-summary.md: Root cause fix (lines 38), test results (lines 46-54), code duplication (lines 40, 62-121)

**Spec 124 (Upgrade Level Script)**:
- spec.md: Scope (lines 32-45), complexity (line 150)
- implementation-summary.md: Architecture (lines 20), bugs fixed (lines 63-72), design decisions (lines 30-42), test results (lines 47-57)

---

*Report generated 2026-02-15 for Spec 125 Codex System-Wide Audit preparation.*
