# Playbook Results Wave 2 (DR-035 through DR-038)

**Date:** 2026-03-24
**Operator:** Claude Opus 4.6 (1M context)
**Mode:** READ-ONLY testing

---

## DR-035: Review convergence uses severity-weighted newFindingsRatio

**Verdict:** PASS

**Evidence:**

1. **convergence.md Section 10.1** (line 626-648) defines the `newFindingsRatio` formula with severity weights:
   - `SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }` (line 631)
   - Formula: `newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal` (line 637)
   - P0 override rule present: "if ANY new P0 -> newFindingsRatio = max(calculated, 0.50)" (line 639)
   - Clean pass rule: "If total_findings == 0 -> newFindingsRatio = 0.0" (line 640)

2. **convergence.md Section 10.2** (lines 650-666) defines adapted signal weights matching scenario expectations:
   - Rolling Average: weight 0.30, window 2, threshold 0.08 (line 656)
   - MAD Noise Floor: weight 0.25, window all, scale factor 1.4826 (line 657)
   - Dimension Coverage: weight 0.45, threshold 1.0 (100%) (line 658)

3. **convergence.md Section 10.3** (lines 668-746) contains the complete `shouldContinue_review()` pseudocode. The pseudocode implements all three signals with the adapted parameters and invokes `checkReviewQualityGuards()` before finalizing a STOP (lines 734-742).

4. **Review auto YAML** (`spec_kit_deep-research_review_auto.yaml`) `step_check_convergence` (lines 276-306) references the adapted signals:
   - Rolling average: w=0.30, window=2, threshold 0.08 (lines 286-288)
   - MAD noise floor: w=0.25, needs 3+ iterations (lines 289-291)
   - Dimension coverage: w=0.45, threshold 1.0 (100%) (lines 292-294)
   - Quality guards referenced at line 297 before allowing STOP
   - P0 override rule is documented in the YAML's `reference_only_appendix.severity_weights` section (lines 656-663)

5. **@deep-review agent** (`deep-review.md` lines 249-258) also documents the severity-weighted newFindingsRatio formula and P0 override rule, consistent with convergence.md.

**Issues:** None. All parameters match across convergence.md, the review YAML, and the agent definition.

---

## DR-036: Review quality guards block premature stop

**Verdict:** PASS

**Evidence:**

1. **convergence.md Section 10.4** (lines 748-802) defines 5 quality guards with full pseudocode in `checkReviewQualityGuards()`:
   - Guard 1: **Evidence Completeness** -- Every P0/P1 finding must have `file:line` citation (lines 764-768)
   - Guard 2: **Scope Alignment** -- All findings must be within declared review scope (lines 770-775)
   - Guard 3: **No Inference-Only** -- No P0/P1 finding based solely on inference without code evidence (lines 777-781)
   - Guard 4: **Severity Coverage** -- Security + Correctness dimensions must have been reviewed (lines 783-790)
   - Guard 5: **Cross-Reference** (optional, 5+ iterations) -- At least one multi-dimension iteration performed (lines 792-797)
   - Guard failure returns `{ passed: false, violations }` and the caller overrides STOP to CONTINUE (lines 799-801)

2. **Review auto YAML** `step_check_convergence` (lines 297-305) references all 5 quality guards:
   - Lists them by name: Evidence Completeness, Scope Alignment, No Inference-Only, Severity Coverage, Cross-Reference (lines 298-302)
   - On guard failure: logs violation and overrides decision to CONTINUE (lines 303-305)

3. **SKILL.md Rule 12** (line 241): "Quality guards must pass before convergence -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger." Note: this text references the *research mode* guard names rather than the review-specific guard names (evidence completeness, scope alignment, etc.). However, the principle is the same: guards must pass before STOP.

4. **Guard failure overrides STOP to CONTINUE**: Confirmed in `shouldContinue_review()` pseudocode at convergence.md lines 738-742. When `guardResult.passed` is false, the function returns `{ action: "CONTINUE", reason: "guard_override", violations }`.

**Issues:** Minor naming inconsistency in SKILL.md Rule 12: it references research-mode guard names (source diversity, focus alignment, no single-weak-source) rather than the review-mode guard names (evidence completeness, scope alignment, no inference-only, severity coverage, cross-reference). The principle is correct, but the specific guard names do not match review mode. This is a documentation polish issue, not a behavioral gap.

---

## DR-037: Cross-reference verification detects spec-code misalignment

**Verdict:** PARTIAL

**Evidence:**

1. **@deep-review agent** (`deep-review.md`): Cross-reference checking is present in the workflow:
   - Step 3 "Execute Review" (lines 106-113) lists dimension-specific strategies including:
     - "Spec Alignment" (line 109): "Read spec claims, cross-reference against implementation code"
     - "Completeness" (line 110): "Glob for required files, read checklists, verify test coverage"
     - "Cross-Ref Integrity" (line 111): "Read IDs/links, verify anchors across runtime files"
   - Step 5 "Write Findings" template (lines 192-196) includes a "Cross-Reference Results" section with Confirmed/Contradictions/Unknowns
   - Step 2 (line 87): "If no dimensions remain, perform cross-reference analysis across completed dimensions"

2. **Loop protocol Section "6. REVIEW MODE LOOP"** (second section 6, starting line 534): Cross-reference is documented in scope discovery and dimension ordering:
   - Line 554: "D5 Cross-Reference Integrity" is an explicit review dimension
   - Section 6.3 Review Synthesis (line 643-666) describes compile step including cross-reference results
   - However, there is NO explicit "6 cross-reference protocols" section in loop_protocol.md. The 6 protocols are instead defined in the review auto YAML.

3. **Review auto YAML** `reference_only_appendix.cross_reference_protocols` (lines 674-682) defines 6 cross-reference protocols:
   - Spec vs Code: spec.md claims vs implementation
   - Checklist vs Evidence: [x] items vs cited evidence
   - SKILL.md vs Agent: Skill contracts vs agent files
   - Agent Cross-Runtime: .claude vs .codex/.opencode/.agents/.gemini
   - Feature Catalog vs Code: Catalog claims vs implementation
   - Playbook vs Capability: Scenario preconditions vs actual capability

4. **Review strategy template** (`deep_review_strategy.md` line 139): Has a "## 14. Cross-Reference Status" section with a table for tracking alignment checks.

5. **State format** (`state_format.md` line 541): Config schema includes `crossReference` object field: `{ spec: true, checklist: true, agentConsistency: true }`. The "Review Strategy Sections Mapping" table (line 553) lists "Cross-Reference Status" as a review-specific section.

6. **research.md reference file does NOT exist**: The scenario expected `research.md §4` to describe cross-reference output format. The file `.opencode/skill/sk-deep-research/references/research.md` does not exist. This is a gap -- the scenario's source anchor is invalid.

7. **State format §8**: The scenario expected cross-reference fields in state format section 8. State format section 8 is the "Review Report Format" which includes "Section 8: Cross-Reference Results" (line 572) as one of the 11 report sections. This partially satisfies the check.

**Issues:**
- `references/research.md` does not exist. The scenario references it as a source anchor for §4 (cross-reference output format), but the file was never created. The cross-reference output format is instead documented in the @deep-review agent's Step 5 template and the review YAML's `step_compile_review_report`.
- Loop protocol does not have a dedicated cross-reference protocols section. The 6 protocols are defined only in the review auto YAML's `reference_only_appendix`, not in loop_protocol.md §6 as the scenario suggests.
- The 6 protocols are in a `reference_only_appendix` section, which may raise questions about whether they are part of the live contract.

---

## DR-038: Adversarial self-check runs on P0 findings

**Verdict:** PASS

**Evidence:**

1. **@deep-review agent Section 5** (`deep-review.md` lines 374-410) defines the full "Adversarial Self-Check (Tiered)" protocol:
   - **P0 Candidate --> Full 3-Pass** (in same iteration BEFORE writing to JSONL) (line 378):
     - **Pass 1 -- HUNTER** (bias: find ALL issues) (lines 380-383)
     - **Pass 2 -- SKEPTIC** (bias: disprove findings) (lines 385-389)
     - **Pass 3 -- REFEREE** (neutral judgment) (lines 391-395)
     - "Only CONFIRMED findings enter the iteration file" (line 394)
   - **Gate-Relevant P1 --> Compact Skeptic/Referee** (lines 396-399)
   - **P2 --> No Self-Check** (lines 401-403)
   - **At Synthesis (orchestrator handles)** (line 406): "Full recheck on all carried-forward P0/P1 before final report"
   - Tiered policy is exactly as expected: P0 in-iteration, P1 compact, full at synthesis.

2. **Step 4 "Classify Findings"** in the agent (lines 143-146) reinforces the tiered policy:
   - "P0 candidate --> Run full Hunter/Skeptic/Referee in THIS iteration BEFORE writing to JSONL" (line 144)
   - "Gate-relevant P1 --> Run compact skeptic/referee pass in-iteration" (line 145)
   - "P2 --> No self-check needed (severity too low to warrant overhead)" (line 146)

3. **SKILL.md Rule 14** (line 242): "Run adversarial self-check on P0 findings before recording -- Re-read cited code to confirm P0 severity is genuine." This directly requires adversarial self-check on P0 findings.

4. **Review auto YAML synthesis phase** `step_adversarial_selfcheck` (lines 501-508): Defines the final adversarial self-check on all P0 and P1 findings at synthesis:
   - "For each active P0/P1 finding: 1. Hunter: Re-verify finding against source code (re-read file:line) 2. Skeptic: Challenge severity -- is this really P0/P1? Could it be P2? 3. Referee: Final call -- confirm, downgrade, or mark false_positive"
   - This confirms the synthesis-level recheck on P0/P1.

5. **Review auto YAML rules** (line 636): `run_adversarial_selfcheck_on_p0_p1` is listed as an ALWAYS rule.

6. **convergence.md Section 10.1** (line 639): P0 override rule ensures new P0 blocks convergence (`newFindingsRatio = max(calculated, 0.50)`), providing additional protection by keeping the loop running when critical findings are being discovered.

**Issues:** None. The Hunter/Skeptic/Referee protocol is fully defined, runs in-iteration for P0 candidates before JSONL write, applies compact form for gate-relevant P1, and runs full recheck at synthesis. SKILL.md Rule 14 and the YAML rules section both mandate it.

---

## Summary

| Scenario | Title | Verdict |
|----------|-------|---------|
| DR-035 | Review convergence uses severity-weighted newFindingsRatio | PASS |
| DR-036 | Review quality guards block premature stop | PASS |
| DR-037 | Cross-reference verification detects spec-code misalignment | PARTIAL |
| DR-038 | Adversarial self-check runs on P0 findings | PASS |

### Actionable Gaps (from PARTIAL verdicts)

1. **DR-037**: `references/research.md` does not exist. The scenario references it as a source anchor for cross-reference output format (§4). Either:
   - Create the file with the expected content, OR
   - Update scenario DR-037 to reference the correct source anchors (deep-review agent Step 5 template + review YAML `step_compile_review_report` Section 6)

2. **DR-037**: The 6 cross-reference protocols are defined in the review auto YAML's `reference_only_appendix`, not in loop_protocol.md §6 as the scenario suggests. Either:
   - Add a cross-reference protocols subsection to loop_protocol.md Section 6 (REVIEW MODE LOOP), OR
   - Update scenario DR-037 source anchors to point to the YAML's appendix

3. **DR-036 (minor)**: SKILL.md Rule 12 references research-mode guard names rather than the review-specific 5 guards. Consider adding a review-mode-specific rule or updating Rule 12 to mention both sets.
