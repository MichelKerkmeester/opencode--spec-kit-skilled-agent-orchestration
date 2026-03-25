# Review Findings: Wave 2, Agent A2

## Metadata
- Dimension: correctness
- Files Reviewed: 8
- Model: gpt-5.3-codex
- Effort: xhigh
- Wave: 2 of 5

## Findings

### [F-011] [P1] Review hard-stop path bypasses required quality-gate check
- **File**: `spec_kit_deep-research_review_auto.yaml:286` (mirror: `review_confirm.yaml:314`)
- **Evidence**: YAML hard-stops on `all_dimensions_clean` directly, while quality guards are only evaluated later in a separate branch. Reference pseudocode requires gate check before `all_dimensions_clean` STOP (`convergence.md:684-688`).
- **Impact**: STOP can occur without enforcing evidence/scope/coverage gates in that hard-stop branch.
- **Fix**: Move gate evaluation into the `all_dimensions_clean` hard-stop branch.
- **Claim Adjudication**: Confidence 0.91. Downgrade if runtime engine injects implicit gate enforcement.

### [F-012] [P1] `dimensionCoverage` emitted as string, violating numeric state contract
- **File**: `spec_kit_deep-research_review_auto.yaml:577` (mirror: `review_confirm.yaml:680`)
- **Evidence**: Synthesis event appends `"dimensionCoverage":"{dimension_coverage}"` (quoted string), contract requires numeric ratio (`state_format.md:551,562`).
- **Impact**: Replay validation and downstream numeric comparisons can miscompute or fail.
- **Fix**: Compute numeric ratio and emit unquoted numeric JSON field.
- **Claim Adjudication**: Confidence 0.95.

### [F-013] [P1] Research convergence signals omit required "exclude thought iterations" rule
- **File**: `spec_kit_deep-research_auto.yaml:227` (mirror: `confirm.yaml:250`)
- **Evidence**: Composite signal logic uses `mean(last 3 newInfoRatios)` / `MAD(all ratios)` with no thought-status filtering. Canonical convergence requires thought-filtered input (`convergence.md:61-66,72-81`).
- **Impact**: Thought-only iterations can distort convergence signals and trigger premature stop.
- **Fix**: Explicitly filter out `status == "thought"` in research signal inputs.
- **Claim Adjudication**: Confidence 0.86.

### [F-014] [P1] Claim-adjudication failure branch is non-binding (no enforceable STOP block)
- **File**: `spec_kit_deep-research_review_auto.yaml:401` (mirror: `review_confirm.yaml:451`)
- **Evidence**: On adjudication failure, YAML only logs and says "require rewrite before STOP", but no state flag is wired into convergence checks.
- **Impact**: Iterations missing required P0/P1 claim packets may still contribute to convergence/termination.
- **Fix**: Persist `claim_adjudication_passed=false` and add it as a required convergence guard.
- **Claim Adjudication**: Confidence 0.84.

### [F-015] [P2] Auto-mode error JSONL append uses unresolved placeholders (`{N}`, `{focus}`)
- **File**: `spec_kit_deep-research_auto.yaml:307` (mirror: `review_auto.yaml:399`)
- **Evidence**: Error append uses `run:{N}` while workflow variables are named `current_iteration`/`next_focus`.
- **Fix**: Replace with defined bindings consistently.

### [F-016] [P2] Review config `reviewDimensions` type may drift from canonical array schema
- **File**: `spec_kit_deep-research_review_auto.yaml:194` (mirror: `review_confirm.yaml:197`)
- **Evidence**: Config writes scalar placeholder, while canonical schema expects string array.
- **Fix**: Normalize to array before config write.

## Summary
- Total findings: 6 (P0=0, P1=4, P2=2)
- newFindingsRatio: 0.83
