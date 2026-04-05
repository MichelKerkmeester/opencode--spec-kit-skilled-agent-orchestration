---
title: "Specification [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/spec]"
description: "This specification consolidates findings from four prior research specs (060-063) into a single implementation plan for upgrading the system-spec-kit skill. The research analyze..."
trigger_phrases:
  - "specification"
  - "system"
  - "spec"
  - "kit"
  - "upgrade"
  - "077"
  - "speckit"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Specification: System-Spec-Kit Upgrade from Research Synthesis

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 077-speckit-upgrade-from-research |
| **Version** | 1.0.0 |
| **Created** | 2026-01-22 |
| **Status** | draft |
| **Level** | 3+ |
| **Complexity Score** | 85 (Multi-system, architectural changes, governance patterns) |
| **Source Research** | 060, 061, 062, 063 (Smart-Ralph, Empirica, OpenCode Hooks, Superego) |
| **Environment** | OpenCode v1.0.6.0+ (no hooks support) |

---

<!-- /ANCHOR:metadata -->
## 1. Executive Summary

This specification consolidates findings from four prior research specs (060-063) into a single implementation plan for upgrading the system-spec-kit skill. The research analyzed Smart-Ralph (state management, recovery), Empirica (epistemic vectors, uncertainty tracking), OpenCode Hooks (design patterns), and Superego (evaluation frameworks, decision journaling) to identify transferable patterns that would enhance context preservation, decision quality, and workflow reliability.

After filtering recommendations against our OpenCode environment (which does not support hooks), approximately 40% of original recommendations remain actionable. The remaining items represent high-impact upgrades focusing on: (1) persistent state tracking via `.spec-state.json`, (2) explicit uncertainty measurement separate from confidence scoring, (3) dual-threshold validation gates, and (4) learning measurement through PREFLIGHT/POSTFLIGHT patterns. These upgrades address the most critical gaps identified: unreliable resume detection, "confident ignorance" in decision-making, and lack of measurable learning improvement tracking.

The implementation prioritizes backwards compatibility with existing spec folders while introducing progressive enhancement features that improve resume reliability, decision quality, and session continuity across context compaction events.

---

<!-- ANCHOR:problem -->
## 2. Problem Statement

### Current Gaps in System-Spec-Kit

| Gap ID | Category | Description | Impact |
|--------|----------|-------------|--------|
| **G1** | State Management | No persistent state file; relies solely on memory files for session state | Resume detection is unreliable; state lost if memory save fails |
| **G2** | Confidence Assessment | Single confidence percentage without explicit uncertainty tracking | "Confident ignorance" - high confidence despite knowledge gaps |
| **G3** | Learning Measurement | No baseline/delta tracking for knowledge improvement | Cannot measure or demonstrate learning during sessions |
| **G4** | Resume Detection | Memory-only detection with no priority order | Active vs paused specs unclear; wrong spec may resume |
| **G5** | Status Visibility | No dashboard command for spec status overview | Manual inspection required to understand project state |
| **G6** | Decision Quality | No structured evaluation framework for significant decisions | Gate responses lack consistency and auditability |
| **G7** | Skill Routing | No uncertainty check in skill_advisor.py | May route to skills despite high uncertainty about requirements |

### Root Cause Analysis

The current system-spec-kit was designed with memory files as the primary state persistence mechanism. While effective for context preservation, this approach has limitations:

1. **Single Point of Failure**: Memory save failures lose all state information
2. **Implicit State**: Phase, task index, and recovery attempts are inferred, not tracked
3. **No Learning Loop**: Pre/post task assessments not captured for improvement measurement
4. **Subjective Confidence**: Confidence is a single percentage without objective uncertainty factors

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:success-criteria -->
## 3. Goals and Success Criteria

### Primary Goals

| Goal ID | Description | Measurable Outcome |
|---------|-------------|-------------------|
| **PG1** | Reliable state persistence | `.spec-state.json` survives session compaction; resume success rate > 95% |
| **PG2** | Explicit uncertainty tracking | Uncertainty tracked separately from confidence; dual-threshold gates enforced |
| **PG3** | Learning measurement | Delta tracking shows improvement in knowledge scores across sessions |
| **PG4** | Decision quality improvement | Structured decision format used for all gate evaluations |

### Success Criteria

| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| **SC1** | `.spec-state.json` created/updated on every task transition | Unit test for state update function |
| **SC2** | Uncertainty score (0.0-1.0) captured in gate responses | Manual inspection of 10 gate interactions |
| **SC3** | Dual-threshold validation enforced: know >= 0.70 AND uncertainty <= 0.35 | Gate test cases |
| **SC4** | PREFLIGHT/POSTFLIGHT sections in memory files with delta calculations | Memory file inspection |
| **SC5** | `/spec_kit:status` command returns formatted spec overview | Command execution test |
| **SC6** | Five Checks framework applied to significant decisions | Audit of decision-record.md entries |
| **SC7** | skill_advisor.py includes uncertainty threshold check | Script execution with edge cases |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:scope -->
## 4. Scope

### In-Scope

| Category | Items |
|----------|-------|
| **Uncertainty Tracking** | Uncertainty vector (0.0-1.0), integration into AGENTS.md confidence framework |
| **Dual-Threshold Validation** | Gate enhancement: know >= 0.70 AND uncertainty <= 0.35 |
| **PREFLIGHT/POSTFLIGHT** | Memory file sections, delta calculation, learning history |
| **Resume Detection** | Enhanced detection using memory files with priority order |
| **Five Checks Framework** | Evaluation framework for significant decisions |
| **Structured Decision Format** | PASS/BLOCK + CONFIDENCE format for gate responses |
| **Skill Advisor Enhancement** | Uncertainty check in skill_advisor.py |
| **Decision Journaling** | Enhanced audit trail in decision-record.md |

### Out-of-Scope

| Category | Reason |
|----------|--------|
| **`.spec-state.json` State File** | Scope reduction; memory-based approach sufficient |
| **`/spec_kit:status` Dashboard** | Scope reduction; not critical path |
| **`:quick` Mode** | Scope reduction; adds complexity |
| **Domain-specific Overlays** | High effort; not critical path |
| **Git Notes Integration** | Medium effort; existing backup sufficient |
| **OpenCode Hooks Integration** | OpenCode does not support hooks; 062 research ~95% N/A |
| **Multi-Agent Architecture** | Existing skills system provides sufficient specialization |
| **npm Distribution** | Embedded distribution sufficient for current use case |
| **Retrospective HTML** | High effort; low immediate value |

### Deferred (Future Consideration)

| Item | Reason for Deferral | Target Iteration |
|------|---------------------|------------------|
| State file tracking | May revisit if resume reliability issues persist | v2.0 |
| Status dashboard | May revisit for UX improvements | v2.0 |
| Profile-based configuration | Nice-to-have, not critical path | v2.0 |
| Carryover context windows | Requires more design | v2.0 |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 5. Requirements

### Functional Requirements

#### FR-1: Memory-Based State Persistence (P0) - *Replaces State File*

**Description:** Use memory files with ANCHOR markers for persistent state tracking. State file (`.spec-state.json`) originally proposed but moved to Out-of-Scope after scope refinement. Memory-based approach provides sufficient reliability.

**Mechanism:**
- Memory files with `status: active` anchor indicate active spec
- Memory files < 24 hours old indicate recent work
- ANCHOR markers enable targeted retrieval of state information
- Timestamps enable priority ordering

**Acceptance Criteria:**
- AC-1.1: Memory files capture spec state via ANCHOR markers
- AC-1.2: Resume detection uses memory file priority order
- AC-1.3: Memory files survive session compaction
- AC-1.4: State information readable via anchor-based queries
- AC-1.5: Recovery context preserved in memory files

#### FR-2: Explicit Uncertainty Tracking (P0)

**Description:** Track uncertainty (0.0-1.0) as a separate vector from confidence.

**Factors Contributing to Uncertainty:**
- Epistemic gaps (what I don't know that I don't know)
- Model boundary awareness (limits of capability)
- Temporal variability (how stable is this knowledge)
- Situational completeness (is context sufficient)

**Acceptance Criteria:**
- AC-2.1: Uncertainty assessment section added to AGENTS.md Section 4
- AC-2.2: Uncertainty scores captured in gate responses
- AC-2.3: Uncertainty tracked separately from confidence percentage
- AC-2.4: Clear guidance on uncertainty factors provided

#### FR-3: Dual-Threshold Validation (P0)

**Description:** Implement dual-threshold validation for gate passage.

**Thresholds:**
- `know >= 0.70` (sufficient domain knowledge)
- `uncertainty <= 0.35` (acceptable doubt level)

**Acceptance Criteria:**
- AC-3.1: Dual-threshold check added to Gate 1 (Understanding)
- AC-3.2: BLOCK with INVESTIGATE if thresholds not met
- AC-3.3: Maximum 3 investigation loops before user escalation
- AC-3.4: Clear messaging when thresholds trigger BLOCK

#### FR-4: PREFLIGHT/POSTFLIGHT Learning Measurement (P0)

**Description:** Implement PREFLIGHT baseline capture and POSTFLIGHT delta calculation.

**Pattern:**
```
PREFLIGHT (before task):
  - know: [score]
  - uncertainty: [score]
  - timestamp: [ISO timestamp]

[TASK EXECUTION]

POSTFLIGHT (after task):
  - know: [score]
  - uncertainty: [score]
  - timestamp: [ISO timestamp]
  - delta_know: [POSTFLIGHT.know - PREFLIGHT.know]
  - delta_uncertainty: [PREFLIGHT.uncertainty - POSTFLIGHT.uncertainty]
```

**Acceptance Criteria:**
- AC-4.1: PREFLIGHT section added to memory file template
- AC-4.2: POSTFLIGHT section added to memory file template
- AC-4.3: Delta calculation performed and stored
- AC-4.4: Learning history accessible via memory search

#### FR-5: Enhanced Resume Detection (P1)

**Description:** Improve resume detection using memory file priority order (memory-only approach).

**Priority Order:**
1. Memory files with `status: active` anchor (highest priority)
2. Memory files < 24 hours old in spec folder
3. User-provided spec folder path
4. Last modified spec folder heuristic (fallback)

**Acceptance Criteria:**
- AC-5.1: Memory file with `status: active` anchor checked first
- AC-5.2: Priority order followed when multiple signals exist
- AC-5.3: User prompted if signals conflict
- AC-5.4: Clear messaging about which signal triggered resume

#### FR-6: Status Dashboard Command - *OUT OF SCOPE*

**Status:** Moved to Out-of-Scope during scope refinement.

**Rationale:** Not on critical path for epistemic improvements. May revisit for UX improvements in future version.

**Deferred to:** v2.0 consideration

#### FR-7: Five Checks Evaluation Framework (P1)

**Description:** Implement Five Checks framework for evaluating significant decisions.

**Five Checks:**
1. **Necessary?** - Is this solving an actual need now?
2. **Beyond Local Maxima?** - Have alternatives been explored?
3. **Sufficient?** - Is this the simplest approach that works?
4. **Fits Goal?** - Does this stay on the critical path?
5. **Open Horizons?** - Does this maintain long-term alignment?

**Acceptance Criteria:**
- AC-7.1: Five Checks section added to decision-record.md template
- AC-7.2: Framework referenced in AGENTS.md for significant decisions
- AC-7.3: Each check requires explicit PASS or FAIL with rationale

#### FR-8: Structured Decision Format (P1)

**Description:** Implement structured format for gate responses.

**Format:**
```
GATE: [GATE_NAME]
DECISION: [PASS | BLOCK]
CONFIDENCE: [HIGH | MEDIUM | LOW]
UNCERTAINTY: [0.0-1.0]
EVIDENCE: [Specific justification]

[If BLOCK: RESOLUTION_PATH: How to unblock]
[If BLOCK: ALTERNATIVE: Suggested approach]
```

**Acceptance Criteria:**
- AC-8.1: Format documented in AGENTS.md gate sections
- AC-8.2: DECISION explicitly stated (not implied)
- AC-8.3: BLOCK always includes RESOLUTION_PATH

#### FR-9: Enhanced Skill Advisor (P1)

**Description:** Add uncertainty check to skill_advisor.py.

**Enhancement:**
```python
# Current: confidence threshold only
if confidence >= threshold:
    recommend_skill()

# Proposed: dual threshold
if confidence >= threshold and uncertainty <= 0.35:
    recommend_skill()
else:
    recommend_general_approach_with_caveats()
```

**Acceptance Criteria:**
- AC-9.1: Uncertainty parameter added to skill_advisor.py
- AC-9.2: Dual-threshold logic implemented
- AC-9.3: Output indicates when uncertainty caused non-recommendation

### Non-Functional Requirements

| ID | Requirement | Metric |
|----|-------------|--------|
| **NFR-1** | Memory file operations < 100ms | Performance benchmark |
| **NFR-2** | Backwards compatible with existing spec folders | Existing specs continue working |
| **NFR-3** | Memory search with anchors < 200ms typical | Performance benchmark |
| **NFR-4** | Resume detection < 500ms | Performance benchmark |

<!-- /ANCHOR:requirements -->
---

## 6. Architecture Overview

### Component Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM-SPEC-KIT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐    ┌────────────────────┐    ┌──────────────────┐   │
│  │    AGENTS.md       │    │   SKILL.md         │    │  skill_advisor   │   │
│  │                    │    │                    │    │     .py          │   │
│  │  +Uncertainty      │    │  +/spec_kit:status │    │  +uncertainty    │   │
│  │   Section 4        │    │   command          │    │   threshold      │   │
│  │  +Dual-threshold   │    │                    │    │                  │   │
│  │   Gates            │    │                    │    │                  │   │
│  │  +Decision Format  │    │                    │    │                  │   │
│  └─────────┬──────────┘    └─────────┬──────────┘    └────────┬─────────┘   │
│            │                         │                        │             │
│            └─────────────────────────┼────────────────────────┘             │
│                                      │                                      │
│                                      ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        SPEC FOLDER STRUCTURE                          │   │
│  │                                                                       │   │
│  │  .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research    │   │
│  │  ├── .spec-state.json      ← NEW: Persistent state tracking          │   │
│  │  ├── spec.md               (existing)                                 │   │
│  │  ├── plan.md               (existing)                                 │   │
│  │  ├── tasks.md              (existing)                                 │   │
│  │  ├── checklist.md          (existing)                                 │   │
│  │  ├── decision-record.md    +Five Checks section                      │   │
│  │  ├── memory/                                                          │   │
│  │  │   └── *.md              +PREFLIGHT/POSTFLIGHT sections            │   │
│  │  └── research/             (existing)                                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                           SCRIPTS LAYER                               │   │
│  │                                                                       │   │
│  │  scripts/                                                             │   │
│  │  ├── spec/                                                            │   │
│  │  │   ├── state.js         ← NEW: State file management               │   │
│  │  │   └── status.js        ← NEW: Status dashboard                    │   │
│  │  └── memory/                                                          │   │
│  │      └── generate-context.js  +PREFLIGHT/POSTFLIGHT support          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                           MCP SERVER                                  │   │
│  │                                                                       │   │
│  │  context-server.js                                                    │   │
│  │  +task_preflight() tool   ← NEW: Capture baseline                    │   │
│  │  +task_postflight() tool  ← NEW: Capture delta                       │   │
│  │  +Enhanced memory_search with learning history                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State File Lifecycle

```
┌─────────────────┐
│ Spec Created    │
│ (create.sh)     │
└────────┬────────┘
         │
         ▼ Create .spec-state.json (initial state)
┌─────────────────┐
│ Planning Phase  │
│ phase: planning │
└────────┬────────┘
         │
         ▼ Update state (phase transition)
┌─────────────────┐
│ Implementation  │──────────┐
│ phase: impl     │          │
│ task: N         │          │ Update on each
└────────┬────────┘          │ task completion
         │                   │
         ▼                   │
┌─────────────────┐          │
│ Task Complete   │◄─────────┘
│ task: N+1       │
└────────┬────────┘
         │
         ▼ (All tasks complete)
┌─────────────────┐
│ Verification    │
│ phase: verify   │
└────────┬────────┘
         │
         ▼ Update state (complete)
┌─────────────────┐
│ Complete        │
│ phase: complete │
└─────────────────┘
```

---

## 7. Risk Assessment

| Risk ID | Description | Probability | Impact | Mitigation |
|---------|-------------|-------------|--------|------------|
| **R1** | State file corruption loses progress | Low | High | Atomic writes, backup before update |
| **R2** | Dual-threshold too strict (excessive blocks) | Medium | Medium | Calibrate thresholds based on initial testing |
| **R3** | PREFLIGHT overhead slows workflow | Low | Low | Make PREFLIGHT quick (<30s assessment) |
| **R4** | Backwards compatibility breaks existing specs | Low | High | Feature flags for new capabilities |
| **R5** | Status command performance degrades with many specs | Low | Low | Limit scan depth, cache results |
| **R6** | Uncertainty tracking adds cognitive overhead | Medium | Medium | Clear guidance, simple factors |

### Risk Mitigation Details

**R1 Mitigation (State File Corruption):**
```javascript
// Atomic write pattern
function updateState(specPath, updates) {
  const tempPath = `${statePath}.tmp`;
  const backupPath = `${statePath}.bak`;

  // 1. Read current state
  const current = readState(specPath);

  // 2. Create backup
  fs.copyFileSync(statePath, backupPath);

  // 3. Write to temp file
  fs.writeFileSync(tempPath, JSON.stringify({ ...current, ...updates }, null, 2));

  // 4. Atomic rename
  fs.renameSync(tempPath, statePath);

  // 5. Remove backup (success)
  fs.unlinkSync(backupPath);
}
```

**R2 Mitigation (Threshold Calibration):**
- Start with thresholds as SOFT (warn, not block)
- Collect data on gate responses for 2 weeks
- Adjust thresholds based on false positive/negative rates
- Move to HARD enforcement after calibration

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1-2) - P0 Items

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| T1 | Create state file schema and management script | `scripts/spec/state.js` | 4h |
| T2 | Add uncertainty section to AGENTS.md Section 4 | `AGENTS.md` | 2h |
| T3 | Implement dual-threshold validation in gates | `AGENTS.md` | 2h |
| T4 | Add PREFLIGHT/POSTFLIGHT to memory templates | `templates/`, `generate-context.js` | 4h |

### Phase 2: Enhancement (Week 2-3) - P1 Items

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| T5 | Implement enhanced resume detection | `resume.md`, state script | 3h |
| T6 | Create `/spec_kit:status` command | `status.md`, `status.js` | 4h |
| T7 | Add Five Checks to decision-record template | `templates/decision-record.md` | 2h |
| T8 | Implement structured decision format | `AGENTS.md` | 2h |
| T9 | Enhance skill_advisor.py with uncertainty | `skill_advisor.py` | 2h |

### Phase 3: Integration (Week 3-4)

| Task | Description | Files | Effort |
|------|-------------|-------|--------|
| T10 | Integration testing across all components | Test scripts | 4h |
| T11 | Documentation updates | SKILL.md, references | 3h |
| T12 | User acceptance testing | Manual testing | 4h |

**Total Estimated Effort:** 36 hours

---

<!-- ANCHOR:complexity -->
## 9. Complexity Assessment

| Dimension | Score (0-20) | Rationale |
|-----------|--------------|-----------|
| **Technical Complexity** | 14 | Multiple system modifications, new scripts, schema changes |
| **Integration Complexity** | 16 | Touches AGENTS.md, SKILL.md, templates, scripts, MCP server |
| **Domain Complexity** | 15 | Epistemic concepts (uncertainty, dual-threshold), learning measurement |
| **Coordination Complexity** | 12 | Single developer, but many files and systems |
| **Risk/Uncertainty** | 14 | New patterns, calibration needed, backwards compatibility |
| **Governance** | 14 | Architectural decisions, affects all future spec folders |

**Total Score:** 85 / 100 (Level 3+ threshold: 80)

<!-- /ANCHOR:complexity -->
---

## 10. References

### Source Research Synthesis Documents

*Note: Original external research was synthesized into local documents during this spec's creation. See `research/` folder for synthesis documents.*

| Synthesis | Location | Key Contributions |
|-----------|----------|-------------------|
| **Smart-Ralph** | `research/smart-ralph-synthesis.md` | State file tracking patterns, 5-attempt retry, POC-first workflow |
| **Empirica** | `research/empirica-synthesis.md` | Epistemic vectors, uncertainty tracking, PREFLIGHT/POSTFLIGHT, dual-threshold |
| **OpenCode Hooks** | `research/hooks-synthesis.md` | Design patterns (Zod validation, non-blocking errors) - ~95% N/A for OpenCode |
| **Superego** | `research/superego-synthesis.md` | Five Checks framework, gate structure, decision journaling, structured format |

### External Sources

| Source | URL | Key Takeaway |
|--------|-----|--------------|
| Smart-Ralph | https://github.com/tzachbon/smart-ralph | `.ralph-state.json` schema, bounded retry pattern |
| Empirica | https://github.com/Nubaeon/empirica | 13 epistemic vectors, CASCADE workflow, Bayesian calibration |
| Superego | https://github.com/open-horizon-labs/superego | Five Checks, DECISION/CONFIDENCE format, fail-safe defaults |

### Related Internal Documentation

- AGENTS.md Section 4: Confidence & Clarification Framework
- SKILL.md: System-Spec-Kit skill definition
- `templates/`: Spec folder templates
- `scripts/`: Automation scripts
- `mcp_server/context-server.js`: Memory MCP server

---

## 11. Approvals

| Role | Name | Status | Date |
|------|------|--------|------|
| Technical Lead | - | Pending | - |
| Product Owner | - | Pending | - |
| QA Lead | - | Pending | - |

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-22 | Claude Opus 4.5 | Initial specification synthesizing 060-063 research |
