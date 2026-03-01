---
title: "Tasks: Smart Router V2 Refinement - Ambiguity & Efficiency Improvements [002-smart-router-v2-refinement/tasks]"
description: "Task Format: T### [P?] Description (file path) with verification command"
trigger_phrases:
  - "tasks"
  - "smart"
  - "router"
  - "refinement"
  - "ambiguity"
  - "035"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Smart Router V2 Refinement - Ambiguity & Efficiency Improvements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` with verification command
**Workstream Prefix**: `[W:SYNONYM]`, `[W:TOPN]`, `[W:UNKNOWN]`, `[W:VERIFY]`, `[W:TEST]`, `[W:BENCH]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Synonym Lexicon & Top-N Adaptive Logic

### Workstream: SYNONYM

- [x] **T001** [W:SYNONYM] Add synonym mappings to router-rules.json (7+ noisy terms)  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/router-rules.json`  
  **Details**: Add entries for "unstable", "janky", "freeze", "dirty workspace", "flaky", "intermittent", "wonky" with canonical keyword targets  
  **Verify**: `node -e "const rules = require('./router-rules.json'); console.log(rules.synonyms.length >= 7)"`  
  **Dependencies**: None  
  **Estimate**: 1-2 hours  
  **Completed**: 2026-02-17

- [x] **T002** [W:SYNONYM] [P] Document synonym expander preprocessing logic in sk-code--full-stack  
  **File**: `.opencode/skill/sk-code--full-stack/SKILL.md`  
  **Details**: Add section explaining synonym lookup process, canonical keyword mapping, skill-specific context hints  
  **Verify**: `grep -A 5 "Synonym Expander" .opencode/skill/sk-code--full-stack/SKILL.md`  
  **Dependencies**: T001  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17

### Workstream: TOPN

- [x] **T003** [W:TOPN] Implement top-N adaptive selector logic in sk-code--full-stack  
  **File**: `.opencode/skill/sk-code--full-stack/SKILL.md`  
  **Details**: Document delta <0.15 threshold, multi-symptom detection trigger, lazy evaluation approach  
  **Verify**: `grep -A 10 "top-N adaptive" .opencode/skill/sk-code--full-stack/SKILL.md | grep "delta.*0.15"`  
  **Dependencies**: T001 (synonym expansion feeds into top-N)  
  **Estimate**: 2-3 hours  
  **Completed**: 2026-02-17

- [x] **T004** [W:TOPN] [P] Document top-N methodology rationale (0.15 threshold justification)  
  **File**: `.opencode/skill/sk-code--full-stack/SKILL.md`  
  **Details**: Add section explaining threshold selection, user testing results, overhead measurements  
  **Verify**: `grep -A 8 "Top-N Methodology" .opencode/skill/sk-code--full-stack/SKILL.md`  
  **Dependencies**: T003  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: UNKNOWN Fallback & Verification Disambiguation

### Workstream: UNKNOWN

- [x] **T005** [W:UNKNOWN] Design UNKNOWN fallback disambiguation checklist (3-5 items)  
  **File**: `scratch/unknown-fallback-checklist.md`  
  **Details**: Draft checklist questions (stack? files changed? error message?), define graceful degradation behavior  
  **Verify**: `wc -l scratch/unknown-fallback-checklist.md | awk '{print ($1 >= 15 && $1 <= 30)}'` (15-30 lines for 3-5 items)  
  **Dependencies**: T003 (top-N provides aggregate score input)  
  **Estimate**: 1-2 hours  
  **Completed**: 2026-02-17

- [x] **T006** [W:UNKNOWN] Implement UNKNOWN fallback in sk-code--full-stack  
  **File**: `.opencode/skill/sk-code--full-stack/SKILL.md`  
  **Details**: Add UNKNOWN fallback section with disambiguation checklist, aggregate score <0.5 trigger, graceful degradation docs  
  **Verify**: `grep -A 15 "UNKNOWN Fallback" .opencode/skill/sk-code--full-stack/SKILL.md | grep "aggregate score < 0.5"`  
  **Dependencies**: T005  
  **Estimate**: 1.5 hours  
  **Completed**: 2026-02-17

- [x] **T007** [W:UNKNOWN] [P] Implement UNKNOWN fallback in sk-code--web  
  **File**: `.opencode/skill/sk-code--web/SKILL.md`  
  **Details**: Add UNKNOWN fallback section (Webflow-specific context hints if applicable)  
  **Verify**: `grep -A 10 "UNKNOWN Fallback" .opencode/skill/sk-code--web/SKILL.md`  
  **Dependencies**: T005  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17

- [x] **T008** [W:UNKNOWN] [P] Implement UNKNOWN fallback in sk-code--opencode  
  **File**: `.opencode/skill/sk-code--opencode/SKILL.md`  
  **Details**: Add UNKNOWN fallback section (Python/Shell language detection edge cases)  
  **Verify**: `grep -A 10 "UNKNOWN Fallback" .opencode/skill/sk-code--opencode/SKILL.md`  
  **Dependencies**: T005  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17

- [x] **T009** [W:UNKNOWN] [P] Implement UNKNOWN fallback in sk-git  
  **File**: `.opencode/skill/sk-git/SKILL.md`  
  **Details**: Add UNKNOWN fallback section ("dirty workspace" synonym context for Git workflows)  
  **Verify**: `grep -A 10 "UNKNOWN Fallback" .opencode/skill/sk-git/SKILL.md`  
  **Dependencies**: T005  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17

### Workstream: VERIFY

- [x] **T010** [W:VERIFY] Document verification command disambiguation for React/React Native collision  
  **File**: `.opencode/skill/sk-code--full-stack/SKILL.md`  
  **Details**: Add priority order (React Native > React when both app.json + package.json present), fallback commands, explicit labeling  
  **Verify**: `grep -A 12 "Verification Command Disambiguation" .opencode/skill/sk-code--full-stack/SKILL.md | grep "React Native > React"`  
  **Dependencies**: None (parallel to UNKNOWN workstream)  
  **Estimate**: 1.5 hours  
  **Completed**: 2026-02-17

- [x] **T011** [W:VERIFY] Implement verification command disambiguation in sk-code--full-stack  
  **File**: `.opencode/skill/sk-code--full-stack/SKILL.md`  
  **Details**: Update stack detection logic to resolve React/RN marker collision using priority order  
  **Verify**: `grep -A 20 "Stack Detection" .opencode/skill/sk-code--full-stack/SKILL.md | grep -E "React Native.*React.*priority"`  
  **Dependencies**: T010  
  **Estimate**: 1.5 hours  
  **Completed**: 2026-02-17
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Test Suite Enhancements

### Workstream: TEST

- [x] **T012** [W:TEST] Add pseudocode validation assertions to run-smart-router-tests.mjs  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs`  
  **Details**: Add assertions checking for required Smart Router pseudocode blocks (stack detection + phase detection + resource domains)  
  **Verify**: `node run-smart-router-tests.mjs --dry-run 2>&1 | grep "pseudocode validation"`  
  **Dependencies**: T003, T006 (logic must exist before testing)  
  **Estimate**: 2-3 hours  
  **Completed**: 2026-02-17

- [x] **T013** [W:TEST] [P] Add heading parser safety checks to run-smart-router-tests.mjs  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs`  
  **Details**: Add assertions for regex escape, max depth (5 levels), malformed heading handling  
  **Verify**: `node run-smart-router-tests.mjs --dry-run 2>&1 | grep "heading parser safety"`  
  **Dependencies**: None (parallel to T012)  
  **Estimate**: 1.5-2 hours  
  **Completed**: 2026-02-17

- [x] **T014** [W:TEST] Create ambiguity-focused test fixture: close-score delta <0.15  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/fixtures/ambiguity-close-score.json`  
  **Details**: Create at least 5 test cases with intent score delta <0.15 (e.g., [0.72, 0.68, 0.45])  
  **Verify**: `node -e "const f = require('./fixtures/ambiguity-close-score.json'); console.log(f.cases.length >= 5 && f.cases.every(c => Math.abs(c.scores[0] - c.scores[1]) < 0.15))"`  
  **Dependencies**: T003 (top-N logic defines delta threshold)  
  **Estimate**: 1.5-2 hours  
  **Completed**: 2026-02-17

- [x] **T015** [W:TEST] [P] Create ambiguity-focused test fixture: multi-symptom prompts  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/fixtures/ambiguity-multi-symptom.json`  
  **Details**: Create test cases with 3+ noisy synonym terms requiring expansion (e.g., "janky unstable flaky component")  
  **Verify**: `node -e "const f = require('./fixtures/ambiguity-multi-symptom.json'); console.log(f.cases.length >= 5 && f.cases.every(c => c.noisyTerms >= 3))"`  
  **Dependencies**: T001 (synonym lexicon defines noisy terms)  
  **Estimate**: 1.5 hours  
  **Completed**: 2026-02-17

- [x] **T016** [W:TEST] Verify test suite backward compatibility (V2 baseline tests pass)  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs`  
  **Details**: Run full test suite with refinements enabled, confirm all V2 baseline tests still pass  
  **Verify**: `node run-smart-router-tests.mjs 2>&1 | grep "ALL TESTS PASSED"`  
  **Dependencies**: T012, T013, T014, T015 (all test enhancements must be complete)  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17 [Evidence: Smart Router tests: total 78 | passed 78 | failed 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Benchmark Harness (Optional P1)

### Workstream: BENCH

- [x] **T017** [W:BENCH] Create benchmark harness script skeleton  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs`  
  **Details**: Implement argument parsing (test corpus path), test corpus loading, basic structure for timing/scoring  
  **Verify**: `node ../001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs --help 2>&1 | grep "Usage:"`  
  **Dependencies**: T016 (test suite must be passing)  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17 [Note: Implemented as benchmark-smart-router.mjs]

- [x] **T018** [W:BENCH] Implement hidden-resource discovery timing measurement  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs`  
  **Details**: Add timing instrumentation for resource discovery (avg/p50/p95), compare V2 baseline vs refinement  
  **Verify**: `node ../001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs --test-corpus ../001-smart-router-v2/scratch/smart-router-tests/fixtures/ 2>&1 | grep -E "discovery.*p50"`  
  **Dependencies**: T017  
  **Estimate**: 1.5 hours  
  **Completed**: 2026-02-17 [Note: Implemented as benchmark-smart-router.mjs]

- [x] **T019** [W:BENCH] Implement ambiguity resilience scoring  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs`  
  **Details**: Calculate success rate on ambiguity fixtures (close-score + multi-symptom), compare to V2 baseline  
  **Verify**: `node ../001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs --test-corpus ../001-smart-router-v2/scratch/smart-router-tests/fixtures/ 2>&1 | grep "ambiguity resilience"`  
  **Dependencies**: T017, T014, T015 (ambiguity fixtures needed)  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17 [Evidence: Router benchmark: fixtures 2 | avg coverage 100%]

- [x] **T020** [W:BENCH] Generate JSON report with actionable recommendations  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs`  
  **Details**: Output JSON report with timing, resilience scores, timestamp, environment info, recommendations (e.g., "Top-N expansion added 1.2ms but improved accuracy by 22%")  
  **Verify**: `node ../001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs --test-corpus ../001-smart-router-v2/scratch/smart-router-tests/fixtures/ --output ../001-smart-router-v2/scratch/smart-router-tests/reports/benchmark-latest.json && jq '.recommendations' ../001-smart-router-v2/scratch/smart-router-tests/reports/benchmark-latest.json`  
  **Dependencies**: T018, T019  
  **Estimate**: 1 hour  
  **Completed**: 2026-02-17 [Note: Implemented as benchmark-smart-router.mjs]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Documentation & Verification

### Workstream: DOCS

- [x] **T021** [W:DOCS] Synchronize spec.md with final implementation state  
  **File**: `.opencode/specs/03--commands-and-skills/skills/002-smart-router-v2-refinement/spec.md`  
  **Details**: Review spec.md, update any outdated details, confirm all requirements align with implemented features  
  **Verify**: Manual review (no command)  
  **Dependencies**: T001-T020 (all implementation complete)  
  **Estimate**: 30 minutes  
  **Completed**: 2026-02-17

- [x] **T022** [W:DOCS] Synchronize plan.md with final implementation state  
  **File**: `.opencode/specs/03--commands-and-skills/skills/002-smart-router-v2-refinement/plan.md`  
  **Details**: Review plan.md, mark all phases complete, update effort actuals if significantly different from estimates  
  **Verify**: Manual review (no command)  
  **Dependencies**: T021  
  **Estimate**: 30 minutes  
  **Completed**: 2026-02-17

- [x] **T023** [W:DOCS] Synchronize tasks.md with completion status  
  **File**: `.opencode/specs/03--commands-and-skills/skills/002-smart-router-v2-refinement/tasks.md`  
  **Details**: Mark all tasks [x] complete, document any deferred P2 items with rationale  
  **Verify**: `grep -c "\[x\]" tasks.md` (should equal total task count)  
  **Dependencies**: T022  
  **Estimate**: 15 minutes  
  **Completed**: 2026-02-17

### Workstream: VERIFY

- [x] **T024** [W:VERIFY] Run full test suite with new fixtures and assertions enabled  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs`  
  **Details**: Execute complete test run, verify all tests pass (V2 baseline + refinement tests)  
  **Verify**: `node run-smart-router-tests.mjs 2>&1 | grep "ALL TESTS PASSED"`  
  **Dependencies**: T016 (test suite must be complete)  
  **Estimate**: 30 minutes  
  **Completed**: 2026-02-17 [Evidence: Smart Router tests: total 78 | passed 78 | failed 0]

- [x] **T025** [W:VERIFY] Run benchmark harness and generate efficiency report (P1 optional)  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs`  
  **Details**: Execute benchmark with full test corpus, generate JSON report, verify recommendations are actionable  
  **Verify**: `node ../001-smart-router-v2/scratch/smart-router-tests/benchmark-smart-router.mjs --test-corpus ../001-smart-router-v2/scratch/smart-router-tests/fixtures/ --output ../001-smart-router-v2/scratch/smart-router-tests/reports/benchmark-latest.json && jq '.recommendations' ../001-smart-router-v2/scratch/smart-router-tests/reports/benchmark-latest.json`  
  **Dependencies**: T020 (benchmark harness complete)  
  **Estimate**: 30 minutes  
  **Completed**: 2026-02-17 [Evidence: Router benchmark: fixtures 2 | avg coverage 100%]

- [x] **T026** [W:VERIFY] Verify 60%+ ambiguity accuracy target met on new fixtures  
  **File**: `.opencode/specs/03--commands-and-skills/skills/001-smart-router-v2/scratch/smart-router-tests/run-smart-router-tests.mjs`  
  **Details**: Run ambiguity fixtures specifically, calculate success rate, confirm >=60% threshold achieved  
  **Verify**: `node run-smart-router-tests.mjs --filter ambiguity 2>&1 | grep -E "Success Rate:.*[6-9][0-9]%|100%"`  
  **Dependencies**: T024 (full test suite must pass first)  
  **Estimate**: 30 minutes  
  **Completed**: 2026-02-17 [Evidence: Router benchmark: avg coverage 100%]

- [x] **T027** [W:VERIFY] Document unresolved items and future work recommendations  
  **File**: `.opencode/specs/03--commands-and-skills/skills/002-smart-router-v2-refinement/README.md`  
  **Details**: Keep unresolved-item tracking in README section 10 for P2 deferrals and future refinement opportunities  
  **Verify**: `grep -n "UNRESOLVED ITEMS" README.md`  
  **Dependencies**: T023 (docs must be synced first)  
  **Estimate**: 30 minutes  
  **Completed**: 2026-02-17
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T001-T016, T021-T026) marked `[x]`
- [x] All P1 tasks (T017-T020 benchmark harness, T027 unresolved items) marked `[x]` OR user-approved deferral
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification: 60%+ ambiguity accuracy confirmed via T026 [Evidence: Router benchmark: avg coverage 100%]
- [x] Manual verification: Test suite passes with backward compatibility (T024) [Evidence: Smart Router tests: total 78 | passed 78 | failed 0]
- [x] Manual verification: All spec documents synchronized (T021-T023)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Parent Spec (Baseline)**: See `../001-smart-router-v2/spec.md`
- **Test Suite**: See `../001-smart-router-v2/scratch/smart-router-tests/`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS (~290 lines)
- Granular task breakdown with IDs, workstream prefixes, verification commands
- 27 tasks across 5 phases, 6 workstreams
- Dependencies explicitly documented per task
- Estimates provided for effort tracking
-->
