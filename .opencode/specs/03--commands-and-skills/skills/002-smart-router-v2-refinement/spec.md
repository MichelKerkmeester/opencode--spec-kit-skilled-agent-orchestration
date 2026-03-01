---
title: "Feature Specification: Smart Router V2 Refinement - Ambiguity & Efficiency [002-smart-router-v2-refinement/spec]"
description: "Smart Router V2 Refinement addresses ambiguity handling gaps and efficiency weaknesses discovered during initial deployment, implementing adaptive intent selection (top-2 → top-..."
trigger_phrases:
  - "feature"
  - "specification"
  - "smart"
  - "router"
  - "refinement"
  - "spec"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Smart Router V2 Refinement - Ambiguity & Efficiency Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Smart Router V2 Refinement addresses ambiguity handling gaps and efficiency weaknesses discovered during initial deployment, implementing adaptive intent selection (top-2 → top-3 for close scores), expanded synonym lexicon for noisy user language, strong UNKNOWN fallback bundles, candidate verification command sets, and comprehensive test suite alignment with benchmark reporting.

**Key Decisions**: Top-N adaptive selection (2→3 when delta <0.15), explicit ambiguity disambiguation checklist, separate test fixtures for ambiguity scenarios, optional benchmark harness for hidden-resource discovery.

**Critical Dependencies**: Smart Router V2 baseline (001-smart-router-v2) must be complete; test suite infrastructure already in progress with pseudocode and heading parsing improvements.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-17 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Smart Router V2 baseline (001-smart-router-v2) introduced weighted keyword classification and stack detection, but real-world usage reveals three critical gaps: (1) close intent scores (e.g., 0.72 vs 0.68) cause premature single-route selection missing relevant alternatives, (2) noisy user language ("janky", "unstable", "dirty workspace") lacks synonym coverage causing misclassification, (3) low-confidence scenarios (<0.5 aggregate) have no structured fallback guidance beyond generic routing, and (4) test coverage lacks dedicated ambiguity scenario fixtures.

### Purpose
Refine Smart Router V2 with adaptive intent selection, expanded synonym lexicon, explicit UNKNOWN handling bundles, verification command disambiguation sets, ambiguity-focused test scenarios, and optional efficiency benchmark reporting to achieve 60%+ routing accuracy in ambiguous prompts and 25% faster hidden-resource discovery.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adaptive top-N intent selection: top-2 baseline, expand to top-3 when score delta <0.15 or multi-symptom prompts detected
- Expanded synonym lexicon for ambiguity terms: "unstable", "janky", "freeze", "dirty workspace", "flaky", "intermittent", "wonky"
- Strong UNKNOWN handling fallback bundles: explicit disambiguation checklist when aggregate score <0.5
- Candidate verification command sets for ambiguous stack scenarios (e.g., React + React Native markers present)
- Smart router test suite alignment: new assertions for required Smart Router pseudocode, code-fence-safe heading parsing (already in progress)
- Ambiguity-focused test scenario fixtures: dedicated test cases for close-score and multi-symptom prompts
- Optional benchmark harness: hidden-resource discovery time, ambiguity resilience scoring with report generation
- Documentation updates in affected SKILL.md files (sk-code--full-stack, sk-code--web, sk-code--opencode, sk-git)

### Out of Scope
- Cross-skill routing (each skill remains self-contained, no change from V2 baseline)
- New skill creation or removal of existing skills
- Changes to skill invocation APIs, MCP tool definitions, or agent-level routing in AGENTS.md
- Modifications to system-spec-kit templates or validation scripts
- Full deployment to Barter repository (Barter updates are future work, not in this refinement scope)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code--full-stack/SKILL.md` | Modify | Add top-N adaptive logic, synonym lexicon, UNKNOWN fallback, verification command disambiguation |
| `.opencode/skill/sk-code--web/SKILL.md` | Modify | Add synonym lexicon, UNKNOWN fallback checklist |
| `.opencode/skill/sk-code--opencode/SKILL.md` | Modify | Add synonym lexicon, language detection disambiguation for Python/Shell edge cases |
| `.opencode/skill/sk-git/SKILL.md` | Modify | Add synonym lexicon for "dirty workspace", "uncommitted changes" ambiguity |
| `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/router-rules.json` | Modify | Add synonym rules, top-N adaptive thresholds |
| `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/fixtures` | Create | New fixture files for ambiguity scenarios (close-score, multi-symptom) |
| `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs` | Modify | Add pseudocode validation assertions, heading parser safety checks (already in progress) |
| `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs` | Modify | Optional efficiency benchmark script (hidden-resource discovery, ambiguity resilience) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Adaptive top-N intent selection (2→3 when delta <0.15) | sk-code--full-stack documents top-N logic with score delta threshold; test fixtures verify top-3 selection when delta <0.15 |
| REQ-002 | Expanded synonym lexicon for 7+ noisy terms | router-rules.json contains synonym mappings for "unstable", "janky", "freeze", "dirty workspace", "flaky", "intermittent", "wonky" |
| REQ-003 | Strong UNKNOWN fallback bundles with disambiguation checklist | Skills document fallback checklist when aggregate score <0.5 (e.g., ask user for stack, show candidate routes) |
| REQ-004 | Candidate verification command sets for ambiguous stacks | sk-code--full-stack documents verification disambiguation for React + React Native marker collisions |
| REQ-005 | Test suite alignment with pseudocode validation and heading parser safety | run-smart-router-tests.mjs includes assertions for required Smart Router pseudocode blocks, code-fence-safe heading parsing (no regex injection) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Ambiguity-focused test scenario fixtures | fixtures/ includes dedicated test cases for close-score (delta <0.15), multi-symptom prompts (3+ noisy terms) |
| REQ-007 | Optional benchmark harness for efficiency reporting | benchmark-smart-router.mjs exists with hidden-resource discovery timing, ambiguity resilience scoring, JSON report output |
| REQ-008 | Documentation of top-N adaptive methodology | sk-code--full-stack includes rationale for 0.15 delta threshold and multi-symptom detection logic |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Adaptive top-N selection verified: test fixtures with delta <0.15 produce top-3 routing (not top-1 premature selection)
- **SC-002**: Synonym lexicon coverage: 7+ noisy terms mapped in router-rules.json with verified synonym expansion in test assertions
- **SC-003**: UNKNOWN fallback checklist documented in 4 skills (sk-code--full-stack, web-dev, opencode, git) with disambiguation steps
- **SC-004**: Verification command disambiguation prevents React/React Native marker collisions: sk-code--full-stack documents priority order and fallback commands
- **SC-005**: Test suite includes pseudocode validation and heading parser safety: run-smart-router-tests.mjs passes with new assertions enabled
- **SC-006**: Ambiguity routing accuracy improvement measurable: 60%+ success rate on new ambiguity fixtures (baseline <40% from V2)
- **SC-007**: Optional benchmark harness generates report: benchmark-smart-router.mjs produces JSON report with timing and resilience scores
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Smart Router V2 baseline (001-smart-router-v2) completion | High | Verify V2 deployment status before starting refinement work |
| Dependency | Test suite infrastructure (pseudocode parsing already in progress) | Medium | Coordinate with existing test work to avoid conflicts |
| Risk | Top-N expansion (2→3) increases processing overhead | Medium | Implement lazy evaluation: only compute top-3 when delta <0.15 triggers |
| Risk | Synonym lexicon maintenance burden | Low | Document synonym addition process in decision-record.md |
| Risk | UNKNOWN fallback checklist too verbose for fast workflows | Medium | Keep checklist to 3-5 items max, prioritize actionable disambiguation questions |
| Risk | Benchmark harness optional status causes inconsistent efficiency tracking | Low | Document usage recommendation (weekly/monthly runs) in benchmark README |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Top-N adaptive selection adds <2ms overhead compared to V2 baseline (only when delta <0.15 triggers)
- **NFR-P02**: Synonym lexicon expansion lookup completes in <1ms per term (preprocessing recommended)
- **NFR-P03**: Benchmark harness completes full test corpus in <5 minutes on typical hardware

### Security
- **NFR-S01**: Heading parser safety: no regex injection vulnerabilities from malformed markdown headings
- **NFR-S02**: Benchmark harness does not log sensitive user prompts to disk without explicit consent

### Reliability
- **NFR-R01**: UNKNOWN fallback graceful degradation: if disambiguation fails, default to V2 baseline generic routing (no blocking errors)
- **NFR-R02**: Test suite backward compatibility: all V2 baseline tests continue passing after refinement changes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Score delta exactly 0.15: Inclusive trigger for top-3 expansion (>=0.15 stays top-2, <0.15 expands to top-3)
- All scores tied (delta 0.0): Expand to top-3, document priority order in sk-code--full-stack
- Single candidate route: Skip top-N logic entirely, proceed with single route (no overhead)
- Empty synonym lexicon lookup: Fallback to original term without error (graceful degradation)
- Missing verification command for detected stack: Fallback to generic verification ("run existing tests") with warning logged

### Error Scenarios
- Malformed router-rules.json synonym entries: Validation at load time with clear error messages, skip malformed entries
- Benchmark harness permission errors (cannot write report): Log to console instead of file, do not block execution
- Test fixture parse errors: Log specific fixture path and error, continue with remaining fixtures (fail gracefully)
- Heading parser encounters deeply nested or malformed headings: Max depth limit (5 levels), escape special characters before parsing
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 8 (4 SKILL.md + 1 router-rules.json + 1 test runner + 2 new), LOC: ~500, Systems: 1 repo |
| Risk | 15/25 | Auth: N, API: N, Breaking: Low (additive refinements, backward compat required) |
| Research | 14/20 | Top-N adaptive thresholds (0.15 delta), synonym corpus sourcing, benchmark methodology |
| Multi-Agent | 5/15 | Workstreams: 1 (Public repo only), sequential implementation phases |
| Coordination | 12/15 | Dependencies: V2 baseline completion, test suite coordination, benchmark integration |
| **Total** | **64/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Top-N expansion overhead impacts routing latency | M | L | Lazy evaluation: only expand to top-3 when delta <0.15 triggers |
| R-002 | Synonym lexicon becomes stale without maintenance process | L | M | Document synonym addition workflow in decision-record.md, schedule quarterly review |
| R-003 | UNKNOWN fallback too complex for fast workflows | M | M | Limit checklist to 3-5 items, user testing with real ambiguous prompts |
| R-004 | Test suite coordination conflicts with parallel work | M | L | Early communication with test maintainers, feature branch coordination |
| R-005 | Benchmark harness optional → inconsistent usage → no efficiency tracking | L | M | Document recommended usage cadence, integrate into CI/CD as optional step |
| R-006 | Verification command disambiguation incomplete (missing stack combinations) | M | L | Start with React/React Native collision (highest impact), document extension pattern for future stacks |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Adaptive Top-N Intent Selection (Priority: P0)

**As a** skill consumer, **I want** top-N intent selection to expand from 2 to 3 candidates when scores are close (delta <0.15), **so that** I don't miss relevant routes due to premature single-choice routing.

**Acceptance Criteria**:
1. Given intent scores [0.72, 0.68, 0.45], When delta (0.72 - 0.68 = 0.04) is <0.15, Then top-3 routes are considered (not just top-1)
2. Given intent scores [0.85, 0.50, 0.30], When delta (0.85 - 0.50 = 0.35) is >=0.15, Then top-2 routes are sufficient (no expansion)
3. Given multi-symptom prompt ("debug unstable React component"), When synonym expansion adds multiple keyword hits, Then top-N adaptive logic triggers regardless of initial delta

---

### US-002: Expanded Synonym Lexicon for Noisy Terms (Priority: P0)

**As a** skill router, **I want** synonym mappings for noisy user language (e.g., "janky" → "unstable", "wonky" → "flaky"), **so that** informal problem descriptions route correctly instead of misclassifying.

**Acceptance Criteria**:
1. Given user prompt "component is janky", When synonym expansion runs, Then "janky" maps to "unstable" keyword (weighted 0.8)
2. Given prompt "workspace is dirty", When synonym lookup runs, Then "dirty workspace" maps to "uncommitted changes" (Git workflow context)
3. Given prompt "tests are flaky", When synonym expansion runs, Then "flaky" maps to "intermittent failure" keyword (Testing/Debugging phase)
4. Given router-rules.json, When loaded, Then synonym entries include at least 7 noisy terms with documented keyword targets

---

### US-003: Strong UNKNOWN Fallback Bundles (Priority: P0)

**As a** skill consumer, **I want** explicit disambiguation checklists when aggregate intent score <0.5, **so that** low-confidence routing provides structured guidance instead of generic fallback.

**Acceptance Criteria**:
1. Given aggregate intent score 0.42 (<0.5 threshold), When UNKNOWN fallback triggers, Then skill presents disambiguation checklist (3-5 items: stack? files changed? error message?)
2. Given disambiguation checklist presented, When user provides stack info ("React Native"), Then router re-runs classification with stack context added
3. Given user declines disambiguation (empty response), When fallback proceeds, Then generic routing applies without blocking (graceful degradation)

---

### US-004: Candidate Verification Command Disambiguation (Priority: P0)

**As a** code workflow skill, **I want** verification command disambiguation for ambiguous stack scenarios (e.g., React + React Native markers present), **so that** verification phase selects correct stack-specific commands instead of failing.

**Acceptance Criteria**:
1. Given project with both package.json (react + react-native deps) and app.json (Expo), When stack detection runs, Then priority order documented in sk-code--full-stack determines primary stack (React Native > React for this collision)
2. Given ambiguous stack detection, When verification commands are selected, Then skill provides both primary + fallback commands with clear labeling
3. Given verification fails with primary stack commands, When fallback is available, Then skill suggests fallback commands explicitly (e.g., "If React Native commands fail, try React verification: npm test")

---

### US-005: Test Suite Alignment with Pseudocode Validation (Priority: P0)

**As a** test maintainer, **I want** test suite assertions for required Smart Router pseudocode blocks and code-fence-safe heading parsing, **so that** SKILL.md compliance and security are verified automatically.

**Acceptance Criteria**:
1. Given SKILL.md file, When run-smart-router-tests.mjs executes, Then assertions verify presence of Smart Router pseudocode block (stack detection + phase detection + resource domains)
2. Given SKILL.md with malformed headings, When heading parser runs, Then parser escapes special regex characters and limits nesting depth (max 5 levels) without errors
3. Given test suite run, When pseudocode validation fails, Then specific SKILL.md path and missing/malformed section reported in error output

---

### US-006: Ambiguity-Focused Test Fixtures (Priority: P1)

**As a** QA tester, **I want** dedicated test fixtures for close-score scenarios (delta <0.15) and multi-symptom prompts, **so that** ambiguity handling improvements are verified with realistic edge cases.

**Acceptance Criteria**:
1. Given fixtures/ambiguity-close-score.json, When tests run, Then fixtures include at least 5 test cases with intent score delta <0.15
2. Given fixtures/ambiguity-multi-symptom.json, When tests run, Then fixtures include prompts with 3+ noisy synonym terms requiring expansion
3. Given ambiguity fixtures, When routing accuracy is measured, Then success rate >=60% on these fixtures (compared to <40% baseline from V2)

---

### US-007: Optional Benchmark Harness for Efficiency Reporting (Priority: P1)

**As a** skill maintainer, **I want** an optional benchmark harness to measure hidden-resource discovery time and ambiguity resilience, **so that** efficiency improvements are quantifiable and regressions are detectable.

**Acceptance Criteria**:
1. Given benchmark-smart-router.mjs script, When executed with test corpus, Then report includes hidden-resource discovery time per fixture (avg/p50/p95)
2. Given ambiguity resilience scoring, When benchmark runs, Then report shows success rate on ambiguity fixtures with comparison to baseline
3. Given benchmark completion, When report is generated, Then JSON output includes timestamps, environment info, and actionable recommendations (e.g., "Top-N expansion added 1.2ms overhead but improved ambiguity success rate by 22%")
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 12. ACCEPTANCE SCENARIOS

### AS-001: Close-Score Top-N Expansion
**Given** user prompt "debug React component that's unstable"  
**When** intent scoring produces [Debug: 0.72, Implementation: 0.68, Research: 0.45]  
**Then** delta (0.72 - 0.68 = 0.04) < 0.15 triggers top-3 expansion  
**And** all three routes are presented for selection

### AS-002: Synonym Expansion for Noisy Language
**Given** user prompt "component is janky and freezes randomly"  
**When** synonym expander processes terms  
**Then** "janky" maps to "unstable" keyword  
**And** "freezes" maps to "crash" or "hang" keyword  
**And** routing classification uses canonical keywords

### AS-003: UNKNOWN Fallback Disambiguation
**Given** user prompt "make it better" (aggregate score 0.35 < 0.5 threshold)  
**When** UNKNOWN fallback triggers  
**Then** disambiguation checklist presented (stack? files? error?)  
**And** user provides "React Native, Login.tsx" context  
**And** router re-runs classification with enhanced context

### AS-004: Verification Command Disambiguation for Stack Collision
**Given** project has both package.json (react + react-native deps) and app.json (Expo config)  
**When** stack detection runs during verification phase  
**Then** priority order determines React Native as primary stack  
**And** verification commands selected: "expo start", "npm run ios/android"  
**And** fallback React commands documented if Expo fails

### AS-005: Multi-Symptom Top-N Trigger
**Given** user prompt "debug unstable flaky janky component" (3+ synonym terms)  
**When** multi-symptom detection runs  
**Then** top-N adaptive logic triggers expansion to top-3  
**And** ambiguity fixtures verify routing includes all relevant phases

### AS-006: Backward Compatibility with V2 Baseline
**Given** unambiguous user prompt "add authentication to Express app"  
**When** routing runs with refinement active  
**Then** intent scores clearly favor Implementation phase (score > 0.8)  
**And** delta > 0.15 keeps top-2 routing (no unnecessary expansion)  
**And** V2 baseline test cases continue passing without changes

### AS-007: Pseudocode Validation in Test Suite
**Given** SKILL.md file for sk-code--full-stack  
**When** run-smart-router-tests.mjs executes  
**Then** assertions verify Smart Router pseudocode block presence  
**And** required sections detected: stack detection, phase detection, resource domains  
**And** missing/malformed sections reported with file path + line numbers

### AS-008: Heading Parser Safety
**Given** SKILL.md with malformed heading: `### [Special $regex+ chars] <script>`  
**When** heading parser processes file  
**Then** special regex characters escaped before parsing  
**And** nesting depth limited to max 5 levels  
**And** no regex injection errors occur

### AS-009: Benchmark Efficiency Reporting
**Given** benchmark-smart-router.mjs executed with full test corpus  
**When** benchmark completes  
**Then** JSON report includes hidden-resource discovery timing (avg/p50/p95)  
**And** ambiguity resilience scoring shows success rate on fixtures  
**And** actionable recommendations provided (e.g., "Top-N expansion added 1.2ms overhead, improved accuracy by 22%")
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- What is the optimal delta threshold for top-N expansion (current proposal: 0.15)? Should this be configurable per skill?
- Should synonym lexicon be centralized in router-rules.json or distributed per-skill? (Proposal: centralized for consistency)
- How to handle future synonym additions without spec folder overhead? (Proposal: document lightweight addition process in decision-record.md)
- Should benchmark harness be integrated into CI/CD or remain manual execution? (Proposal: optional CI step with weekly scheduled runs)
- What is the priority order for React + React Native marker collision? (Proposal: React Native > React when both app.json and package.json present)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec (Baseline)**: See `../001-smart-router-v2/spec.md`
- **Test Suite**: See `../001-smart-router-v2/scratch/smart-router-tests/`

---

<!--
LEVEL 3 SPEC (~350 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
- Refinement-focused with explicit baseline dependency
-->
