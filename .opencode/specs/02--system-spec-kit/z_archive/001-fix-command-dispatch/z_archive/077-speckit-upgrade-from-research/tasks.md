---
title: "Tasks: System-Spec-Kit Upgrade from Research [077-speckit-upgrade-from-research/tasks]"
description: "Summary: 15 total tasks across 3 priority tiers and 4 implementation phases. ✅ ALL COMPLETE"
trigger_phrases:
  - "tasks"
  - "system"
  - "spec"
  - "kit"
  - "upgrade"
  - "077"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: System-Spec-Kit Upgrade from Research

## Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 077-speckit-upgrade-from-research |
| **Level** | 3+ (Consolidated Research Implementation) |
| **Status** | ✅ Implementation Complete |
| **Created** | 2026-01-22 |
| **Completed** | 2026-01-23 |
| **Sources** | 060, 061, 063 (System Upgrade Research 01-04) |
| **Target Version** | v1.0.7.0 → v1.0.9.0 |

---

## Task Summary Table

| ID | Task | Priority | Source | Effort | Dependencies | Status |
|----|------|----------|--------|--------|--------------|--------|
| 1.1 | Explicit uncertainty tracking (0.0-1.0) | P0 | 061 | Med | None | [x] ✅ |
| 1.2 | Dual-threshold validation | P0 | 061 | Med | 1.1 | [x] ✅ |
| 1.3 | Enhanced resume detection | P1 | 061 | Low | None | [x] ✅ |
| 1.4 | PREFLIGHT baseline capture | P0 | 061 | Med | None | [x] ✅ |
| 1.5 | POSTFLIGHT learning delta calculation | P0 | 061 | Med | 1.4 | [x] ✅ |
| 2.1 | Five Checks evaluation framework | P1 | 063 | Low | None | [x] ✅ |
| 2.2 | Structured gate decision format | P1 | 063 | Low | None | [x] ✅ |
| 2.3 | Enhanced skill_advisor.py with uncertainty | P1 | 061 | Med | 1.1 | [x] ✅ |
| 2.4 | Enhanced decision journaling | P2 | 063 | Med | 2.2 | [x] ✅ |
| 3.1 | MCP task_preflight() tool | P0 | 061 | Med | 1.4 | [x] ✅ |
| 3.2 | MCP task_postflight() tool | P0 | 061 | Med | 3.1 | [x] ✅ |
| 3.3 | MCP memory_get_learning_history tool | P1 | 061 | Med | 3.2 | [x] ✅ |
| 3.4 | generate-context.js PREFLIGHT/POSTFLIGHT | P0 | 061 | Med | 1.4 | [x] ✅ |
| 3.5 | Reference docs (epistemic, five-checks, decision-format) | P2 | ALL | Low | 1.1, 2.1, 2.2 | [x] ✅ |
| 3.6 | implement.md PREFLIGHT/POSTFLIGHT hooks | P1 | 061 | Low | 3.1 | [x] ✅ |

**Summary:** 15 total tasks across 3 priority tiers and 4 implementation phases. ✅ ALL COMPLETE

---

## Phase 1: Core Epistemic (v1.0.7.0)

**Estimated Effort:** 1-2 weeks
**Theme:** Foundation for epistemic awareness and learning baselines

### Task 1.1 - Explicit Uncertainty Tracking (0.0-1.0)

- [ ] **1.1** Add explicit uncertainty tracking separate from confidence
  - **Priority**: P0
  - **Source**: 061 (Empirica Analysis)
  - **Effort**: Medium (2-3 days)
  - **Dependencies**: None
  - **Do**:
    1. Add uncertainty field to confidence framework in AGENTS.md
    2. Update Section 4 (Confidence & Clarification Framework) with uncertainty dimension
    3. Define uncertainty thresholds (<=0.35 for proceeding)
    4. Add uncertainty to memory save schema in generate-context.js
    5. Update tier-classifier.js to consider uncertainty
  - **Files**:
    - `AGENTS.md` (modify - Section 4)
    - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.js` (modify)
    - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.js` (modify)
  - **Framework Addition**:
    ```markdown
    ## Uncertainty Tracking (NEW)

    | Metric | Threshold | Meaning |
    |--------|-----------|---------|
    | **Uncertainty** | <= 0.35 | Acceptable doubt level |
    | **Uncertainty** | 0.36-0.60 | Caution - verify before proceeding |
    | **Uncertainty** | > 0.60 | HIGH - require clarification |

    Note: High confidence + high uncertainty = "confident ignorance" (dangerous state)
    ```
  - **Done When**:
    - [ ] AGENTS.md Section 4 includes uncertainty tracking
    - [ ] Memory saves capture uncertainty field
    - [ ] Tier classifier incorporates uncertainty
    - [ ] Documentation explains confidence vs uncertainty distinction
  - **Verify**: Search AGENTS.md for "uncertainty" and verify section exists

---

### Task 1.2 - Dual-Threshold Validation

- [ ] **1.2** Implement dual-threshold validation (know >= 0.70 AND uncertainty <= 0.35)
  - **Priority**: P0
  - **Source**: 061 (Empirica Analysis)
  - **Effort**: Medium (2 days)
  - **Dependencies**: Task 1.1 (Uncertainty tracking)
  - **Do**:
    1. Update gate logic in AGENTS.md Section 2 to include dual threshold
    2. Create validation function in skill_advisor.py
    3. Add dual-threshold check to pre-execution gates
    4. Update confidence framework with combined readiness check
  - **Files**:
    - `AGENTS.md` (modify - Section 2, Section 4)
    - `.opencode/scripts/skill_advisor.py` (modify)
  - **Gate Logic**:
    ```python
    def is_ready_to_proceed(know: float, uncertainty: float) -> bool:
        """
        Dual-threshold validation: both conditions must pass.
        - know >= 0.70: Sufficient domain knowledge
        - uncertainty <= 0.35: Acceptable doubt level
        """
        return know >= 0.70 and uncertainty <= 0.35
    ```
  - **Done When**:
    - [ ] AGENTS.md gates include dual-threshold check
    - [ ] skill_advisor.py validates both thresholds
    - [ ] Documentation explains when to proceed vs clarify
  - **Verify**: Run skill_advisor.py with test cases for both thresholds

---

### Task 1.3 - Enhanced Resume Detection

- [ ] **1.3** Implement enhanced resume detection with memory file priority
  - **Priority**: P1
  - **Source**: 061 (Empirica Analysis)
  - **Effort**: Low (1-2 days)
  - **Dependencies**: None
  - **Do**:
    1. Update resume.md to use memory file priority order
    2. Implement priority order: recent memory files > folder heuristic
    3. Add fallback logic when memory files are stale/missing
    4. Document resume behavior in SKILL.md
  - **Files**:
    - `.opencode/skill/system-spec-kit/references/workflows/resume.md` (modify)
    - `.opencode/skill/system-spec-kit/SKILL.md` (modify)
  - **Priority Order**:
    ```markdown
    Resume Priority Order:
    1. Recent memory files in spec folder (last 7 days)
    2. Last modified spec folder heuristic
    3. User-provided spec folder path
    ```
  - **Done When**:
    - [ ] Resume uses memory file priority
    - [ ] Fallback to folder heuristic works
    - [ ] Documentation updated
  - **Verify**: Test resume with memory files present and absent

---

### Task 1.4 - PREFLIGHT Baseline Capture

- [ ] **1.4** Add PREFLIGHT baseline capture to memory workflow
  - **Priority**: P0
  - **Source**: 061 (Empirica Analysis)
  - **Effort**: Medium (2-3 days)
  - **Dependencies**: None
  - **Do**:
    1. Add PREFLIGHT section to memory file template
    2. Capture baseline vectors (know, uncertainty, context) at task start
    3. Update generate-context.js to include PREFLIGHT data
    4. Add PREFLIGHT prompting to spec workflow initiation
  - **Files**:
    - `.opencode/skill/system-spec-kit/templates/memory/context_v1.md` (modify)
    - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.js` (modify)
    - `.opencode/skill/system-spec-kit/references/workflows/complete.md` (modify)
  - **PREFLIGHT Format**:
    ```markdown
    ## PREFLIGHT BASELINE

    **Captured:** [timestamp]

    | Vector | Value | Notes |
    |--------|-------|-------|
    | know | 0.45 | Initial domain knowledge assessment |
    | uncertainty | 0.60 | Starting doubt level |
    | context | 0.50 | Environmental understanding |
    ```
  - **Done When**:
    - [ ] Memory template includes PREFLIGHT section
    - [ ] generate-context.js captures baseline vectors
    - [ ] Workflow prompts for PREFLIGHT at task initiation
  - **Verify**: Generate a context save and verify PREFLIGHT section appears

---

### Task 1.5 - POSTFLIGHT Learning Delta Calculation

- [ ] **1.5** Implement POSTFLIGHT learning delta calculation
  - **Priority**: P0
  - **Source**: 061 (Empirica Analysis)
  - **Effort**: Medium (2-3 days)
  - **Dependencies**: Task 1.4 (PREFLIGHT baseline)
  - **Do**:
    1. Add POSTFLIGHT section to memory file template
    2. Calculate learning deltas from PREFLIGHT baseline
    3. Implement learning_score calculation
    4. Store deltas in memory files for calibration feedback
  - **Files**:
    - `.opencode/skill/system-spec-kit/templates/memory/context_v1.md` (modify)
    - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.js` (modify)
    - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/learning-tracker.js` (NEW)
  - **POSTFLIGHT Format**:
    ```markdown
    ## POSTFLIGHT RESULTS

    **Captured:** [timestamp]

    | Vector | Before | After | Delta |
    |--------|--------|-------|-------|
    | know | 0.45 | 0.85 | +0.40 |
    | uncertainty | 0.60 | 0.15 | -0.45 |
    | context | 0.50 | 0.90 | +0.40 |

    **Learning Score:** 0.42
    ```
  - **Done When**:
    - [ ] Memory template includes POSTFLIGHT section
    - [ ] Delta calculations are performed and stored
    - [ ] Learning score is calculated
    - [ ] Deltas can be queried for calibration
  - **Verify**: Complete a task and verify POSTFLIGHT deltas appear in memory file

---

## Phase 2: Workflow & Gate Enhancement (v1.0.8.0)

**Estimated Effort:** 1-2 weeks
**Theme:** Improved evaluation frameworks and decision quality

### Task 2.1 - Five Checks Evaluation Framework

- [ ] **2.1** Add Five Checks evaluation framework to AGENTS.md
  - **Priority**: P1
  - **Source**: 063 (Superego Analysis)
  - **Effort**: Low (2-3 days)
  - **Dependencies**: None
  - **Do**:
    1. Add Five Checks section to AGENTS.md Section 5
    2. Define each check with clear criteria
    3. Add "apply when" guidance (>100 LOC or architectural)
    4. Create validation checklist format
  - **Files**:
    - `AGENTS.md` (modify - Section 5)
  - **Five Checks**:
    ```markdown
    ## Five Checks (For Significant Decisions)

    Before implementing a significant change (>100 LOC or architectural):

    1. **Necessary?** - Solving ACTUAL need NOW (not hypothetical)
    2. **Beyond Local Maxima?** - Explored at least 2 alternatives
    3. **Sufficient?** - Simplest approach that works (no over-engineering)
    4. **Fits Goal?** - Stays on critical path (no scope creep)
    5. **Open Horizons?** - Long-term alignment preserved (no tech debt)

    If any check fails: Document alternative considered and why current chosen
    ```
  - **Done When**:
    - [ ] Five Checks added to AGENTS.md Section 5
    - [ ] Clear guidance on when to apply
    - [ ] Validation checklist format defined
  - **Verify**: Search AGENTS.md for "Five Checks" section

---

### Task 2.2 - Structured Gate Decision Format

- [ ] **2.2** Standardize gate decision output format
  - **Priority**: P1
  - **Source**: 063 (Superego Analysis)
  - **Effort**: Low (1-2 days)
  - **Dependencies**: None
  - **Do**:
    1. Define structured format for gate responses
    2. Update AGENTS.md Section 2 gate definitions
    3. Add format examples for PASS and BLOCK scenarios
    4. Create format validation guidance
  - **Files**:
    - `AGENTS.md` (modify - Section 2)
  - **Format**:
    ```markdown
    ## Gate Response Format (BLOCK decisions)

    GATE: [GATE_NAME]
    DECISION: BLOCK
    CONFIDENCE: [HIGH | MEDIUM | LOW]
    EVIDENCE: [Specific justification]
    RESOLUTION_PATH: [Actionable steps to unblock]
    ```
  - **Done When**:
    - [ ] Format defined in AGENTS.md
    - [ ] Examples for PASS and BLOCK included
    - [ ] All gates use consistent format
  - **Verify**: Review gate outputs for format compliance

---

### Task 2.3 - Enhanced skill_advisor.py with Uncertainty

- [ ] **2.3** Add uncertainty check to skill_advisor.py
  - **Priority**: P1
  - **Source**: 061 (Empirica Analysis)
  - **Effort**: Medium (1-2 days)
  - **Dependencies**: Task 1.1 (Uncertainty tracking)
  - **Do**:
    1. Add uncertainty parameter to skill_advisor.py
    2. Implement combined confidence + uncertainty validation
    3. Output uncertainty status in routing recommendation
    4. Add CLI flag for uncertainty input
  - **Files**:
    - `.opencode/scripts/skill_advisor.py` (modify)
  - **Enhanced Output**:
    ```
    SKILL ROUTING: workflows-code
    CONFIDENCE: 0.85
    UNCERTAINTY: 0.20
    DUAL-THRESHOLD: PASS (know >= 0.70, uncertainty <= 0.35)
    ```
  - **Done When**:
    - [ ] skill_advisor.py accepts uncertainty parameter
    - [ ] Output includes dual-threshold status
    - [ ] CLI supports `--uncertainty` flag
  - **Verify**: `python3 skill_advisor.py "implement auth" --uncertainty 0.25`

---

## Phase 3: Decision Quality (v1.0.9.0)

**Estimated Effort:** 1 week
**Theme:** Extended decision tracking and audit capabilities

### Task 2.4 - Enhanced Decision Journaling

- [ ] **2.4** Extend decision journaling with full audit trail
  - **Priority**: P2
  - **Source**: 063 (Superego Analysis)
  - **Effort**: Medium (3-5 days)
  - **Dependencies**: Task 2.2 (Structured gate format)
  - **Do**:
    1. Add Session Decision Log section to decision-record.md
    2. Track gate evaluation records
    3. Record confidence evaluations and rationale
    4. Log memory save events
    5. Create journaling helper functions
  - **Files**:
    - `.opencode/skill/system-spec-kit/templates/level-3/decision-record.md` (modify)
    - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.js` (modify)
  - **Enhanced Format**:
    ```markdown
    ## Session Decision Log

    | Timestamp | Gate/Action | Decision | Confidence | Evidence |
    |-----------|-------------|----------|------------|----------|
    | 2026-01-22T10:00 | SPEC_FOLDER | PASS (A) | HIGH | User selected existing |
    | 2026-01-22T10:05 | CONFIDENCE | PROCEED | 85% | Pattern found |
    | 2026-01-22T10:30 | COMPLETION | BLOCK | HIGH | P0 items incomplete |
    ```
  - **Done When**:
    - [ ] Decision log section added to template
    - [ ] Gate decisions are recorded
    - [ ] Confidence evaluations logged
    - [ ] Memory saves tracked
  - **Verify**: Complete a task and review decision log entries

---

## Completion Criteria

### Phase 1 Complete When: ✅ DONE
- [x] All P0 tasks (1.1-1.5) marked complete with evidence
- [x] Uncertainty tracking in AGENTS.md
- [x] Dual-threshold validation working
- [x] Enhanced resume with memory file priority
- [x] PREFLIGHT/POSTFLIGHT in memory files
- [ ] v1.0.7.0 tagged and released (pending version tagging)

### Phase 2 Complete When: ✅ DONE
- [x] All P1 tasks (2.1-2.3) marked complete with evidence
- [x] Five Checks in AGENTS.md
- [x] Structured gate format documented
- [x] skill_advisor.py enhanced with uncertainty
- [ ] v1.0.8.0 tagged and released (pending version tagging)

### Phase 3 Complete When: ✅ DONE
- [x] Task 2.4 (Decision journaling) marked complete with evidence
- [x] Enhanced decision journaling operational
- [ ] v1.0.9.0 tagged and released (pending version tagging)

### Phase 4 Complete When: ✅ DONE (Runtime Integration)
- [x] Task 3.1 (MCP task_preflight tool) - Added to context-server.js
- [x] Task 3.2 (MCP task_postflight tool) - Added with delta calculation
- [x] Task 3.3 (MCP memory_get_learning_history) - Added with summary stats
- [x] Task 3.4 (generate-context.js) - PREFLIGHT/POSTFLIGHT placeholder replacement
- [x] Task 3.5 (Reference docs) - epistemic-vectors.md, five-checks.md, decision-format.md
- [x] Task 3.6 (implement.md) - Steps 5.5 and 7.5 added for PREFLIGHT/POSTFLIGHT

---

## Phase 4: Runtime Integration (v1.0.9.1)

**Estimated Effort:** Completed 2026-01-23 via parallel agent dispatch
**Theme:** MCP tools, runtime scripts, reference documentation

### Task 3.1 - MCP task_preflight() Tool

- [x] **3.1** Add task_preflight MCP tool for baseline capture
  - **Priority**: P0
  - **Effort**: Medium
  - **Dependencies**: Task 1.4
  - **Files Created**:
    - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.js` (NEW)
  - **Files Modified**:
    - `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
    - `.opencode/skill/system-spec-kit/mcp_server/handlers/index.js`
  - **Done When**: ✅ Tool registered and handler implemented

### Task 3.2 - MCP task_postflight() Tool

- [x] **3.2** Add task_postflight MCP tool for delta calculation
  - **Priority**: P0
  - **Effort**: Medium
  - **Dependencies**: Task 3.1
  - **Features**:
    - Delta calculation for knowledge, uncertainty, context
    - Learning Index formula: (Know × 0.4) + (Uncert × 0.35) + (Context × 0.25)
    - Error handling for missing preflight record
  - **Done When**: ✅ Tool registered with delta calculation

### Task 3.3 - MCP memory_get_learning_history Tool

- [x] **3.3** Add learning history retrieval tool
  - **Priority**: P1
  - **Effort**: Medium
  - **Dependencies**: Task 3.2
  - **Features**:
    - Query by spec folder
    - Filter by session, completeness
    - Summary statistics with trend interpretation
  - **Done When**: ✅ Tool registered with summary stats

### Task 3.4 - generate-context.js PREFLIGHT/POSTFLIGHT Support

- [x] **3.4** Update generate-context.js for runtime placeholder replacement
  - **Priority**: P0
  - **Effort**: Medium
  - **Dependencies**: Task 1.4
  - **Files Modified**:
    - `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.js`
  - **Features**:
    - `calculateLearningIndex()` function
    - `extractPreflightPostflightData()` function
    - Placeholder replacement for all PREFLIGHT/POSTFLIGHT variables
  - **Done When**: ✅ Functions added and exported

### Task 3.5 - Reference Documentation

- [x] **3.5** Create reference documentation for new features
  - **Priority**: P2
  - **Effort**: Low
  - **Dependencies**: Tasks 1.1, 2.1, 2.2
  - **Files Created**:
    - `.opencode/skill/system-spec-kit/references/epistemic/epistemic-vectors.md`
    - `.opencode/skill/system-spec-kit/references/five-checks.md`
    - `.opencode/skill/system-spec-kit/references/decision-format.md`
  - **Done When**: ✅ All three docs created

### Task 3.6 - implement.md PREFLIGHT/POSTFLIGHT Hooks

- [x] **3.6** Add PREFLIGHT/POSTFLIGHT steps to implementation workflow
  - **Priority**: P1
  - **Effort**: Low
  - **Dependencies**: Task 3.1
  - **Files Modified**:
    - `.opencode/command/spec_kit/implement.md`
  - **Changes**:
    - Step 5.5: PREFLIGHT Capture
    - Step 7.5: POSTFLIGHT Learning Delta
  - **Done When**: ✅ Steps added with skip conditions

---

## References

| Source Spec | Title | Primary Focus |
|-------------|-------|---------------|
| [060](./research/smart-ralph-synthesis.md) | Smart-Ralph Analysis | State management, recovery patterns |
| [061](./research/empirica-synthesis.md) | Empirica Analysis | Epistemic vectors, uncertainty, learning measurement |
| [062](./research/hooks-synthesis.md) | OpenCode Hooks Analysis | Command hooks, lifecycle events (limited applicability) |
| [063](./research/superego-synthesis.md) | Superego Analysis | Gate patterns, Five Checks, decision journaling |

---

*Created: 2026-01-22*
*Last Updated: 2026-01-22 (Scope reduction - removed state file, status dashboard, quick mode, overlays, git notes, retrospective HTML, npm distribution)*
