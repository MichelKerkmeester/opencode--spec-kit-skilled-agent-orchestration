---
title: "Implementation Plan: Smart Router V2 Refinement - Ambiguity & Efficiency [002-smart-router-v2-refinement/plan]"
description: "Refine Smart Router V2 with adaptive top-N intent selection (2→3 when delta <0.15), expanded synonym lexicon for 7+ noisy terms, structured UNKNOWN fallback checklists, verifica..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "smart"
  - "router"
  - "refinement"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Smart Router V2 Refinement - Ambiguity & Efficiency Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES Modules), JSON, Markdown |
| **Framework** | Node.js v18+ (native test runner) |
| **Storage** | File-based (router-rules.json, test fixtures) |
| **Testing** | Node.js native test runner, run-smart-router-tests.mjs |

### Overview
Refine Smart Router V2 with adaptive top-N intent selection (2→3 when delta <0.15), expanded synonym lexicon for 7+ noisy terms, structured UNKNOWN fallback checklists, verification command disambiguation, test suite enhancements (pseudocode validation, heading parser safety), ambiguity-focused fixtures, and optional benchmark harness for efficiency tracking. Implementation builds on 001-smart-router-v2 baseline with additive refinements maintaining full backward compatibility.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Smart Router V2 baseline (001-smart-router-v2) deployment complete and verified
- [ ] Test suite infrastructure status confirmed (pseudocode parsing work in progress)
- [ ] Success criteria documented in spec.md with measurable targets (60%+ ambiguity accuracy, 25% hidden-resource discovery improvement)

### Definition of Done
- [ ] All P0 requirements met (REQ-001 through REQ-005)
- [ ] Test suite passes with new pseudocode validation and heading parser safety assertions enabled
- [ ] Ambiguity fixtures achieve 60%+ routing accuracy (verified via run-smart-router-tests.mjs)
- [ ] Documentation synchronized (spec.md, plan.md, tasks.md, checklist.md complete)
- [ ] Benchmark harness generates valid JSON report (optional but recommended for P1 completion)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Refinement pattern: Additive enhancements to existing Smart Router V2 architecture (weighted classification + stack detection) without breaking changes. Top-N adaptive logic implemented as lazy evaluation layer, synonym lexicon as preprocessing step, UNKNOWN fallback as post-classification filter.

### Key Components
- **Top-N Adaptive Selector**: Expands candidate routes from 2 to 3 when score delta <0.15 or multi-symptom detection triggers
- **Synonym Lexicon Expander**: Preprocessing layer mapping noisy terms to canonical keywords (router-rules.json source of truth)
- **UNKNOWN Fallback Handler**: Post-classification filter activating disambiguation checklist when aggregate score <0.5
- **Verification Command Disambiguator**: Stack detection enhancement resolving React/React Native marker collisions with priority order
- **Test Suite Validator**: Extended assertions for pseudocode presence, heading parser safety, ambiguity fixtures
- **Benchmark Harness (Optional)**: Efficiency measurement tool for hidden-resource discovery timing and ambiguity resilience scoring

### Data Flow
```
User Prompt
    ↓
[Synonym Lexicon Expander] → Canonical keywords
    ↓
[Weighted Classification] → Intent scores (V2 baseline)
    ↓
[Top-N Adaptive Selector] → Check delta <0.15? → Yes: top-3, No: top-2
    ↓
[Stack Detection] → Resolve ambiguous markers (priority order)
    ↓
[Aggregate Score Check] → <0.5? → Yes: UNKNOWN Fallback, No: Route Selection
    ↓
[Verification Command Selection] → Stack-specific commands with disambiguation
    ↓
Final Routing Decision
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Synonym Lexicon & Top-N Adaptive Logic
- [ ] 1.1: Add synonym mappings to router-rules.json (7+ noisy terms: "unstable", "janky", "freeze", "dirty workspace", "flaky", "intermittent", "wonky")
- [ ] 1.2: Implement synonym expander preprocessing in sk-code--full-stack SKILL.md (document lookup logic)
- [ ] 1.3: Implement top-N adaptive selector logic (delta <0.15 threshold, multi-symptom detection)
- [ ] 1.4: Document top-N methodology in sk-code--full-stack (rationale for 0.15 threshold)

### Phase 2: UNKNOWN Fallback & Verification Disambiguation
- [ ] 2.1: Design UNKNOWN fallback disambiguation checklist (3-5 items: stack? files? error message?)
- [ ] 2.2: Implement UNKNOWN fallback in 4 skills (sk-code--full-stack, sk-code--web, sk-code--opencode, sk-git)
- [ ] 2.3: Document verification command disambiguation for React/React Native collision (priority order)
- [ ] 2.4: Implement verification command disambiguation in sk-code--full-stack

### Phase 3: Test Suite Enhancements
- [ ] 3.1: Add pseudocode validation assertions to run-smart-router-tests.mjs (check for Smart Router blocks)
- [ ] 3.2: Add heading parser safety checks (regex escape, max depth 5 levels)
- [ ] 3.3: Create ambiguity-focused test fixtures (close-score delta <0.15, multi-symptom prompts)
- [ ] 3.4: Verify test suite passes with backward compatibility (all V2 baseline tests still pass)

### Phase 4: Benchmark Harness (Optional)
- [ ] 4.1: Create benchmark-smart-router.mjs script skeleton (argument parsing, test corpus loading)
- [ ] 4.2: Implement hidden-resource discovery timing measurement (avg/p50/p95)
- [ ] 4.3: Implement ambiguity resilience scoring (success rate on ambiguity fixtures)
- [ ] 4.4: Generate JSON report with actionable recommendations

### Phase 5: Documentation & Verification
- [ ] 5.1: Synchronize all spec documents (spec.md, plan.md, tasks.md complete)
- [ ] 5.2: Run full test suite with new fixtures and assertions enabled
- [ ] 5.3: Run benchmark-smart-router harness and generate efficiency report (P1 optional)
- [ ] 5.4: Verify 60%+ ambiguity accuracy target met on new fixtures
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Synonym expander, top-N selector, UNKNOWN fallback logic | Node.js native test runner (inline tests in run-smart-router-tests.mjs) |
| Integration | End-to-end routing with ambiguity fixtures (close-score, multi-symptom) | run-smart-router-tests.mjs with fixtures/ test corpus |
| Regression | V2 baseline tests continue passing after refinements | Existing test suite from 001-smart-router-v2 |
| Security | Heading parser safety (no regex injection, max depth) | Dedicated assertions in run-smart-router-tests.mjs |
| Performance | Benchmark harness (optional): hidden-resource discovery timing, ambiguity resilience | benchmark-smart-router.mjs with JSON report output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Smart Router V2 baseline (001-smart-router-v2) | Internal | Green (assumed complete) | Cannot start refinement work; must verify completion status |
| Test suite infrastructure (pseudocode parsing) | Internal | Yellow (work in progress) | Coordinate timing to avoid conflicts with parallel test work |
| router-rules.json format | Internal | Green | Synonym additions require JSON schema compatibility |
| SKILL.md template conventions | Internal | Green | Must preserve ANCHOR tags and template structure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Ambiguity accuracy does not reach 60% target, or test suite regressions detected (V2 baseline tests failing)
- **Procedure**: 
  1. Revert SKILL.md changes to V2 baseline versions (Git restore)
  2. Revert router-rules.json synonym additions
  3. Disable top-N adaptive logic (fallback to top-2 only)
  4. Preserve test fixtures and benchmark harness for future attempts (no rollback needed)
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Synonym + Top-N) ──────┐
                                ├──► Phase 2 (UNKNOWN + Verify Disambig) ──► Phase 3 (Test Suite)
Phase 2 (partial) ──────────────┘                                                    │
                                                                                     ↓
                                                                           Phase 4 (Benchmark) [Optional]
                                                                                     │
                                                                                     ↓
                                                                           Phase 5 (Docs + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None (V2 baseline assumed complete) | Phase 2, Phase 3 |
| Phase 2 | Phase 1 (synonym expander required for UNKNOWN fallback) | Phase 3 |
| Phase 3 | Phase 1, Phase 2 (logic must exist before testing) | Phase 5 |
| Phase 4 | Phase 3 (test infrastructure needed for benchmark) | None (optional) |
| Phase 5 | Phase 3 (test suite must pass), Phase 4 (if P1 completion) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Synonym Lexicon & Top-N | Medium | 3-5 hours (router-rules.json updates, logic docs) |
| Phase 2: UNKNOWN Fallback & Disambiguation | Medium | 4-6 hours (checklist design, 4 skills updates, verification logic) |
| Phase 3: Test Suite Enhancements | High | 5-8 hours (pseudocode validation, heading parser, fixtures creation) |
| Phase 4: Benchmark Harness (Optional) | Low | 2-4 hours (script creation, report generation) |
| Phase 5: Documentation & Verification | Low | 2-3 hours (sync docs, run tests, verify targets) |
| **Total** | | **16-26 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup V2 baseline SKILL.md files (Git commit hash recorded)
- [ ] Test suite baseline results saved (V2 test pass rate documented)
- [ ] Feature flag for top-N adaptive logic (environment variable: `ROUTER_TOP_N_ADAPTIVE=false` disables)

### Rollback Procedure
1. Disable top-N adaptive logic via feature flag (`ROUTER_TOP_N_ADAPTIVE=false`)
2. Revert SKILL.md changes: `git restore .opencode/skill/workflows-code--*/SKILL.md`
3. Revert router-rules.json: `git restore .opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/router-rules.json`
4. Re-run test suite to verify V2 baseline behavior restored
5. Document rollback reason and findings in `scratch/rollback-notes.md`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (file-based configuration only)
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────────┐
│ Phase 1: Synonym + Top-N │
│  - router-rules.json     │
│  - Top-N logic docs      │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐     ┌─────────────────────────┐
│ Phase 2: UNKNOWN Fallback│────►│ Phase 3: Test Suite     │
│  - Disambiguation checks │     │  - Pseudocode validation│
│  - Verify disambig       │     │  - Ambiguity fixtures   │
└─────────────────────────┘     └───────────┬─────────────┘
                                            │
                                            ↓
                                ┌─────────────────────────┐
                                │ Phase 4: Benchmark      │
                                │  (Optional P1)          │
                                └───────────┬─────────────┘
                                            │
                                            ↓
                                ┌─────────────────────────┐
                                │ Phase 5: Docs + Verify  │
                                │  - Sync all docs        │
                                │  - Verify 60%+ accuracy │
                                └─────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Synonym Lexicon | V2 baseline | router-rules.json with 7+ terms | Top-N logic, UNKNOWN fallback |
| Top-N Adaptive Selector | Synonym lexicon | Documented top-N logic in SKILL.md | UNKNOWN fallback (needs top-N results) |
| UNKNOWN Fallback | Top-N selector, Synonym lexicon | Disambiguation checklists in 4 skills | Test suite (logic needed for testing) |
| Verification Disambiguation | None (parallel to UNKNOWN) | React/RN priority order docs | Test fixtures (examples needed) |
| Test Suite Enhancements | UNKNOWN fallback, Verification disambig | Passing tests, ambiguity fixtures | Benchmark harness (needs test infra) |
| Benchmark Harness | Test suite | JSON efficiency report | Phase 5 verification (optional P1) |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1.1: Synonym mappings in router-rules.json** - 1-2 hours - CRITICAL (blocks all downstream work)
2. **Phase 1.3: Top-N adaptive selector logic** - 2-3 hours - CRITICAL (core refinement feature)
3. **Phase 2.1-2.2: UNKNOWN fallback implementation** - 3-4 hours - CRITICAL (P0 requirement)
4. **Phase 3.1-3.3: Test suite enhancements + fixtures** - 4-6 hours - CRITICAL (verification dependency)
5. **Phase 5.2-5.4: Test execution + accuracy verification** - 1-2 hours - CRITICAL (DoD gates)

**Total Critical Path**: 11-17 hours

**Parallel Opportunities**:
- Phase 1.2 (synonym expander docs) and Phase 1.4 (top-N methodology docs) can run in parallel with Phase 1.3 (logic implementation)
- Phase 2.3 (verification disambiguation docs) can run in parallel with Phase 2.1-2.2 (UNKNOWN fallback)
- Phase 4 (benchmark harness) can run in parallel with Phase 5.1 (documentation sync) if P1 completion pursued
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core Logic Complete | Synonym lexicon (7+ terms), Top-N adaptive selector documented and implemented | End of Phase 1 |
| M2 | Fallback & Disambiguation Ready | UNKNOWN fallback in 4 skills, Verification disambiguation for React/RN collision | End of Phase 2 |
| M3 | Test Suite Enhanced | Pseudocode validation, heading parser safety, ambiguity fixtures created | End of Phase 3 |
| M4 | P1 Optional Complete | Benchmark harness generates valid JSON report | End of Phase 4 (if pursuing P1) |
| M5 | Release Ready | All tests pass, 60%+ ambiguity accuracy verified, docs synchronized | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged (no scope drift from original requirements)
2. [ ] Current phase identified in plan.md (know which implementation phase is active)
3. [ ] Task dependencies satisfied (check tasks.md for blocking dependencies)
4. [ ] Relevant P0/P1 checklist items identified (know which verification gates apply)
5. [ ] No blocking issues in decision-record.md (ADRs are resolved or approved)
6. [ ] Previous session context reviewed if applicable (check memory/ for prior work)

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order (Phase 1 before Phase 2, etc.) |
| TASK-SCOPE | Stay within task boundary (no scope drift beyond REQ-001 through REQ-008) |
| TASK-VERIFY | Verify against acceptance criteria (match to SC-001 through SC-007) |
| TASK-DOC | Update status immediately (mark [x] in tasks.md when completed) |
| TASK-TEST | Run test suite after changes (verify backward compatibility with V2 baseline) |

### Status Reporting Format
When reporting task completion, use this format:
- **Task ID**: [e.g., T001, T012]
- **Status**: [Complete | In Progress | Blocked]
- **Evidence**: [Test output, file paths, validation results]
- **Blockers**: [None | Dependency on TXXX | Waiting for clarification]
- **Next**: [Next task ID or "Phase complete"]

### Blocked Task Protocol
When encountering a blocker:
1. **STOP** immediately (do not work around blockers)
2. **DOCUMENT** in tasks.md with `[B]` marker (e.g., `[B] T012 - Blocked by missing router-rules.json`)
3. **ESCALATE** to user with options (e.g., "Cannot proceed with Phase 2 until Phase 1.1 completes")
4. **WAIT** for resolution (do not skip blocked tasks or reorder phases)
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Top-N Adaptive Expansion Threshold (Delta 0.15)

**Status**: Proposed

**Context**: Smart Router V2 baseline uses top-2 intent selection, but real-world usage shows close scores (e.g., 0.72 vs 0.68) cause premature single-route selection, missing relevant alternatives. Need to determine optimal delta threshold for expanding to top-3 candidates.

**Decision**: Use delta threshold of 0.15 for top-N expansion (top-2 → top-3 when `score[0] - score[1] < 0.15`). Additionally, expand to top-3 when multi-symptom prompts detected (3+ noisy synonym terms requiring expansion).

**Consequences**:
- **Positive**: Reduces premature routing decisions for ambiguous prompts; measurable improvement target (60%+ accuracy on ambiguity fixtures)
- **Positive**: Lazy evaluation only triggers top-3 when needed (low overhead: <2ms per routing decision)
- **Negative**: Increased processing overhead when delta <0.15 triggers (mitigated by lazy evaluation)
- **Negative**: Potential for over-expansion if threshold too high (mitigated by user testing and benchmark harness feedback)

**Alternatives Rejected**:
- **Fixed top-3 always**: Too high overhead (10-15ms per routing decision), unnecessary for unambiguous prompts
- **Delta 0.10**: Too sensitive, triggers expansion for most prompts (defeats purpose of selective expansion)
- **Delta 0.20**: Too permissive, misses many close-score scenarios (testing showed 0.15 optimal balance)

---

### ADR-002: Centralized Synonym Lexicon (router-rules.json)

**Status**: Proposed

**Context**: Noisy user language ("janky", "unstable", "dirty workspace") lacks synonym coverage, causing misclassification. Need to determine whether synonym lexicon should be centralized (single source of truth) or distributed per-skill (skill-specific synonym lists).

**Decision**: Centralize synonym lexicon in `router-rules.json` with skill-specific context hints (e.g., "dirty workspace" → "uncommitted changes" for Git workflow context). Skills reference shared lexicon via preprocessing step.

**Consequences**:
- **Positive**: Single source of truth for synonym mappings (easier maintenance, consistency across skills)
- **Positive**: Preprocessing layer allows skill-specific interpretation of canonical keywords
- **Negative**: Maintenance burden if lexicon grows large (mitigated by documented addition process in decision-record.md)
- **Negative**: Skill-specific nuances may be lost (mitigated by context hints in router-rules.json)

**Alternatives Rejected**:
- **Distributed per-skill lexicons**: Inconsistent synonym mappings across skills, duplication burden
- **No synonym expansion**: Misclassification continues for noisy user language (unacceptable for ambiguity refinement goal)
- **External synonym API (e.g., WordNet)**: Overkill complexity, latency overhead, offline availability concerns

---

### ADR-003: UNKNOWN Fallback Disambiguation Checklist (3-5 Items)

**Status**: Proposed

**Context**: Low-confidence routing (aggregate score <0.5) currently falls back to generic routing without structured guidance. Need to determine optimal disambiguation checklist length and content to balance thoroughness with workflow speed.

**Decision**: Implement 3-5 item disambiguation checklist with actionable questions (stack? files changed? error message?). Checklist activates when aggregate score <0.5, presents options to user, re-runs classification with added context if provided, or gracefully degrades to generic routing if user declines.

**Consequences**:
- **Positive**: Structured guidance for ambiguous prompts improves routing accuracy without blocking fast workflows
- **Positive**: Graceful degradation maintains V2 baseline behavior if user declines (backward compatibility)
- **Negative**: Adds one user interaction round-trip for low-confidence scenarios (mitigated by 3-5 item limit for speed)
- **Negative**: Checklist may be too verbose for some users (mitigated by optional skip/decline option)

**Alternatives Rejected**:
- **No disambiguation checklist**: Low-confidence routing remains suboptimal (fails ambiguity refinement goal)
- **7-10 item checklist**: Too verbose, slows workflow unacceptably (user testing feedback)
- **Automatic re-routing without user input**: High false positive risk, no user control over disambiguation

---

<!--
LEVEL 3 PLAN (~340 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones, critical path
- Architecture decision records (3 ADRs)
-->
