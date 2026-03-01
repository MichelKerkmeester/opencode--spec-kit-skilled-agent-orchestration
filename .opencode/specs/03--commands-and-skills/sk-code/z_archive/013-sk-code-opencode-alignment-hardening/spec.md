---
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
title: "Feature Specification: sk-code--opencode Alignment Hardening [040-sk-code-opencode-alignment-hardening/spec]"
description: "This document preserves the existing technical decisions and adds validator-required readme structure."
trigger_phrases:
  - "feature"
  - "specification"
  - "code"
  - "opencode"
  - "alignment"
  - "spec"
  - "040"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: sk-code--opencode Alignment Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---
## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The current alignment verifier produces high noise and misses key file classes, which weakens trust in failures and slows remediation work. Baseline output shows `853` files scanned and `354` violations, with `TS-MODULE-HEADER` dominating at `193` findings, indicating over-triggering and poor rule targeting.

**Key Decisions**: Add path-aware filtering and rule applicability controls; normalize and deduplicate scan roots while extending coverage to `.mts`.

**Critical Dependencies**: `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` and new regression tests/fixtures under `.opencode/skill/sk-code--opencode/tests/`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The alignment verifier currently reports too many non-actionable violations and misses intended language coverage. Baseline data shows inflated findings from archived/contextual trees, TS header checks firing on test and asset files, `.mts` files not scanned, JSONC comment handling that shifts error lines, and duplicate scans when roots overlap.

### Purpose
Deliver a deterministic, lower-noise verifier that preserves meaningful drift detection while improving coverage and diagnostic accuracy.

### Baseline Evidence (Provided Task Data)

| Metric | Value |
|--------|-------|
| Verifier Path | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` |
| Scanned Files | 853 |
| Violations | 354 |

| Rule ID | Count |
|---------|-------|
| TS-MODULE-HEADER | 193 |
| SH-STRICT-MODE | 48 |
| JS-USE-STRICT | 45 |
| SH-SHEBANG | 38 |
| PY-SHEBANG | 22 |
| PY-DOCSTRING | 6 |
| JSON-PARSE | 2 |

### Key Defects and Opportunities
- `tsconfig.json` comments produce false positives.
- High-noise directories are currently scanned (`z_archive`, `context`, `scratch`, `memory`, `research`, `asset`, `test`).
- `TS-MODULE-HEADER` over-triggers on tests and assets.
- `.mts` files are not scanned.
- JSONC block-comment stripping shifts parse error line numbers.
- Repeated and overlapping roots can scan the same file more than once.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Harden file discovery to reduce known noise directories without hiding production code.
- Add root normalization and deduplication to prevent duplicate scans.
- Expand extension coverage to include `.mts`.
- Refine TS module-header rule applicability to production modules only (exclude tests/assets by explicit policy).
- Replace line-dropping JSONC block-comment stripping with line-preserving behavior.
- Add regression tests for all known defects and rerun baseline comparison.

### Out of Scope
- Adding new drift rules beyond current rule set (focus is signal quality and correctness).
- Auto-fix behavior or code rewriting (verifier remains report-only).
- CI policy changes outside verifier execution and test updates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` | Modify | Implement all scanner/rule hardening logic and reporting correctness fixes |
| `.opencode/skill/sk-code--opencode/tests/test_verify_alignment_drift.py` | Create/Modify | Add unit and behavior tests for exclusions, `.mts`, dedupe, JSONC line mapping |
| `.opencode/skill/sk-code--opencode/tests/fixtures/alignment_drift/` | Create/Modify | Add fixture trees for overlap roots, noisy paths, assets/tests, JSONC edge cases |
| `.opencode/skill/sk-code--opencode/README.md` | Modify | Document updated scan policy and known exclusions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve existing CLI contract (`--root` repeatable, pass/fail output format) | Existing invocation patterns continue to run without argument changes |
| REQ-002 | Exclude known noise trees (`z_archive`, `context`, `scratch`, `memory`, `research`, `asset`, `test`) via explicit, test-backed policy | Fixture scan confirms those trees are ignored while production paths remain scanned |
| REQ-003 | Prevent duplicate scanning when `--root` values overlap or repeat | Same file appears once in scan set and contributes at most one pass through rule engine |
| REQ-004 | Include `.mts` in supported TypeScript scan extensions | `.mts` fixture is scanned and can trigger TS checks |
| REQ-005 | Restrict `TS-MODULE-HEADER` checks to intended module paths (not tests/assets) | Fixtures under test/asset paths do not raise `TS-MODULE-HEADER`; production module fixtures do |
| REQ-006 | Correct JSONC block-comment stripping to preserve line count and improve error localization | JSONC parse failures in fixtures report expected line numbers after comment stripping |
| REQ-007 | Eliminate known `tsconfig.json` comment-related false-positive behavior | `tsconfig`-style JSONC fixture with comments parses correctly and does not emit unrelated parse noise |
| REQ-008 | Keep verifier deterministic (same input roots => same file order and counts) | Repeated executions on same tree produce identical `scanned` and `violations` totals |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Add regression tests for each defect/opportunity listed in this spec | Test file includes explicit named cases mapped to each defect |
| REQ-010 | Provide before/after baseline comparison using the same root set | Report captures original (`853/354`) and post-hardening metrics |
| REQ-011 | Keep performance overhead bounded | Runtime increase <= 15% versus pre-change baseline on same machine/root set |
| REQ-012 | Update verifier usage docs for new scan policy and exclusions | README section reflects path policy and rule applicability rules |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Baseline rerun on same roots reduces violations by at least 30% from 354 while preserving actionable rule coverage.
- **SC-002**: `TS-MODULE-HEADER` findings reduce from 193 to <= 120 without suppressing production module violations.
- **SC-003**: Duplicate-scan count is zero for repeated/overlapping root invocations.
- **SC-004**: `.mts` fixtures are scanned and validated by TS checks.
- **SC-005**: JSONC error line mapping matches fixture expectations for block-comment scenarios.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Verifier script internals are currently single-file and tightly coupled | Refactor risk can break output format | Add focused tests first; keep CLI/output contract unchanged |
| Dependency | Representative fixture quality | Incomplete fixtures can hide regressions | Build fixtures from each known defect class and map to REQ IDs |
| Risk | Over-filtering paths may hide valid violations | False negatives in drift detection | Use explicit allow/deny rules with tests and documentation |
| Risk | JSONC parser changes alter behavior unexpectedly | New parse regressions | Keep changes minimal and add line-mapping regression tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: End-to-end scan runtime increase must stay <= 15% relative to baseline run on same root set.
- **NFR-P02**: Memory overhead remains linear in file count with no unbounded accumulation.

### Security
- **NFR-S01**: Verifier remains read-only; no file writes outside console output.
- **NFR-S02**: Path handling must avoid following unsafe recursive loops through symlinks/overlaps.

### Reliability
- **NFR-R01**: Results must be deterministic across repeated runs on identical inputs.
- **NFR-R02**: CLI exit semantics remain stable (`0` on no violations, `1` on violations).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty directory root: scan reports `0` files and `0` violations, exits `0`.
- Repeated roots (`--root A --root A`): files are scanned once.
- Overlapping roots (`--root A --root A/subdir`): files in overlap are scanned once.

### Error Scenarios
- JSONC comments inside quoted strings: must not be stripped as comments.
- Multi-line JSONC block comments: line count must be preserved for error reporting.
- TS test/asset files with no module header: must not produce `TS-MODULE-HEADER` violations when excluded by policy.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 4+ code/test artifacts, scanner and parser behavior changes |
| Risk | 19/25 | Potential false-negative/false-positive trade-offs in rule filtering |
| Research | 14/20 | Requires precise fixture design for parser and path-policy edge cases |
| Multi-Agent | 5/15 | Single implementation stream; reviewer/test support optional |
| Coordination | 12/15 | Baseline metrics, acceptance criteria, and ADR alignment required |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Path exclusions remove genuine production targets | H | M | Apply exclusions narrowly, verify with positive/negative fixtures |
| R-002 | Root dedupe logic misses platform path normalization edge cases | M | M | Normalize real paths and cover repeated/overlap fixtures |
| R-003 | JSONC line-preserving changes break parsing in uncommon comment layouts | M | M | Add dedicated fixtures for nested/string/comment combinations |
| R-004 | Performance regression due to additional bookkeeping | M | L | Track baseline timing and enforce NFR-P01 threshold |
| R-005 | Rule applicability matrix diverges from future project layout | M | M | Centralize policy constants and document update procedure |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Trustworthy Drift Signal (Priority: P0)

**As a** maintainer, **I want** verifier output to focus on actionable issues, **so that** remediation work is not diluted by scanner noise.

**Acceptance Criteria**:
1. **Given** baseline roots, **when** the hardened verifier runs, **then** violation count drops by >= 30% from baseline without hiding production checks.
2. **Given** production module fixtures with known drift, **when** the verifier runs, **then** actionable violations are still reported.

---

### US-002: Accurate Coverage (Priority: P0)

**As a** TypeScript maintainer, **I want** `.mts` modules to be scanned and tested, **so that** module drift is not missed.

**Acceptance Criteria**:
1. **Given** `.mts` fixtures, **when** verifier runs, **then** TS checks apply and produce expected findings.
2. **Given** `.mts` fixtures without module header markers, **when** path policy marks them as production modules, **then** `TS-MODULE-HEADER` findings are emitted.

---

### US-003: Deterministic Diagnostics (Priority: P1)

**As a** developer investigating JSONC failures, **I want** line numbers to map to real source lines, **so that** I can fix issues quickly.

**Acceptance Criteria**:
1. **Given** block-comment JSONC fixtures, **when** parsing fails, **then** reported line numbers match expected fixture lines.
2. **Given** comment-like tokens inside JSON strings, **when** JSONC stripping runs, **then** string content remains intact and parse behavior is unchanged.

---

### US-004: Stable Operations (Priority: P1)

**As a** CI owner, **I want** repeated or overlapping roots to produce deterministic counts, **so that** reports are stable and comparable over time.

**Acceptance Criteria**:
1. **Given** repeated and overlapping root combinations, **when** verifier runs, **then** scanned-file set has no duplicates.
2. **Given** identical inputs across two runs, **when** verifier executes twice, **then** scanned and violation totals are identical.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions. Defaults for exclusions and rule applicability are captured in ADR-001 through ADR-004.
- Follow-up decision (post-implementation): whether exclusion policy should become user-configurable via CLI flag.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
