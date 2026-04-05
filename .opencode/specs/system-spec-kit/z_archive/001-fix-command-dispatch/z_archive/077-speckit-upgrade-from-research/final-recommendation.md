# Final Recommendation: SpecKit System Upgrade

> **Executive Recommendation Document**
> Synthesized from 4 research specifications using ~40 Opus 4.5 agents
> Date: 2026-01-22 | System Version: v1.0.6.0

---

## 1. Executive Summary

**The Opportunity:** Four research specifications (060-063) identified 130+ improvement patterns for the SpecKit system. After filtering for environment constraints and scope refinement, **9 actionable items remain** that will measurably improve agent reliability, context preservation, and decision quality.

**The Constraint:** OpenCode lacks lifecycle hooks, and several items (state file, status dashboard, quick mode, overlays, git notes, npm distribution) have been deferred or removed from scope.

**The Recommendation:** Implement in 3 phases over 3-4 weeks, focusing on epistemic awareness and decision quality.

**Expected ROI:**
- 40-60% reduction in context loss during session transitions
- Measurable improvement in agent decision confidence calibration
- Systematic framework for evaluating all future changes

---

## 2. Background & Context

### Research Foundation

| Spec | Focus | Patterns Found | Actionable | Status |
|------|-------|----------------|------------|--------|
| 060 | State Management | 35+ | 4 | Ready |
| 061 | Epistemic Framework | 40+ | 5 | Ready |
| 062 | Hooks Integration | 30+ | 2 | Limited (no hooks) |
| 063 | Decision Quality | 25+ | 5 | Ready |

### Environment Constraints

| Aspect | Current State | Impact |
|--------|--------------|--------|
| Platform | OpenCode CLI | No lifecycle hooks available |
| Database | SQLite | Sufficient for current scale |
| AI Model | Claude-only | No multi-model coordination needed |
| Scale | Single-user | Enterprise patterns deferred |

---

## 3. Priority Matrix

### P0: Critical (Implement First)

| # | Item | Source | Effort | Impact | Rationale |
|---|------|--------|--------|--------|-----------|
| 1 | Explicit uncertainty tracking | 061 | Med | High | Reduces "confident ignorance" |
| 2 | Dual-threshold validation | 061 | Med | High | Prevents premature execution |
| 3 | PREFLIGHT baseline capture | 061 | Med | High | Enables learning measurement |
| 4 | POSTFLIGHT delta calculation | 061 | Med | High | Quantifies knowledge gain |

### P1: High Priority (Implement Soon)

| # | Item | Source | Effort | Impact | Rationale |
|---|------|--------|--------|--------|-----------|
| 5 | Enhanced resume detection | 061 | Low | High | Improved memory-based resume |
| 6 | Five Checks framework | 063 | Low | High | Systematic evaluation standard |
| 7 | Structured decision format | 063 | Low | Med | Clearer gate documentation |
| 8 | skill_advisor.py uncertainty | 061 | Med | Med | Better routing confidence |

### P2: Medium Priority (Future)

| # | Item | Source | Effort | Impact |
|---|------|--------|--------|--------|
| 9 | Decision journaling | 063 | Med | Med |

---

## 3.1 Feature Outlines

### 1. Explicit Uncertainty Tracking (P0)
Add a separate uncertainty field (0.0-1.0) distinct from confidence. Uncertainty measures "what I don't know that I don't know" - epistemic gaps, model boundaries, temporal variability, and situational completeness. High confidence + high uncertainty = "confident ignorance" (dangerous). This field enables the dual-threshold validation gate.

### 2. Dual-Threshold Validation (P0)
Implement a readiness gate requiring BOTH: `know >= 0.70` AND `uncertainty <= 0.35`. Single confidence percentages are insufficient - an agent can be 90% confident while having 60% uncertainty about unknowns. If either threshold fails, the agent must INVESTIGATE (loop back max 3x) before proceeding with file modifications.

### 3. PREFLIGHT Baseline Capture (P0)
Capture epistemic baseline BEFORE starting any task: current know score, uncertainty level, and context understanding. Store in memory files with timestamps. This baseline enables measuring actual learning - without it, we cannot calculate deltas or demonstrate improvement across sessions.

### 4. POSTFLIGHT Delta Calculation (P0)
After task completion, reassess the same vectors and calculate deltas: `Δknow = POST.know - PRE.know`, `Δuncertainty = PRE.uncertainty - POST.uncertainty`. Positive learning shows knowledge gained; negative uncertainty shows doubt reduced. Store deltas for calibration feedback and session compounding.

### 5. Enhanced Resume Detection (P1)
Improve resume reliability with explicit priority order: (1) Recent memory files with `status: active` anchor, (2) Memory files < 24 hours old, (3) Last modified spec folder heuristic, (4) User-provided path. Clear messaging indicates which signal triggered resume. Fallback gracefully when signals conflict.

### 6. Five Checks Framework (P1)
Before any significant decision (>100 LOC or architectural), evaluate: (1) Necessary? - actual need now, (2) Beyond Local Maxima? - explored alternatives, (3) Sufficient? - simplest approach, (4) Fits Goal? - stays on critical path, (5) Open Horizons? - long-term alignment. Each check requires explicit PASS/FAIL with rationale.

### 7. Structured Decision Format (P1)
Standardize all gate responses with: `GATE: [name]`, `DECISION: PASS|BLOCK`, `CONFIDENCE: HIGH|MED|LOW`, `UNCERTAINTY: [0.0-1.0]`, `EVIDENCE: [citation]`. BLOCK decisions MUST include `RESOLUTION_PATH` (how to unblock) and `ALTERNATIVE` (suggested approach). Enables auditing and consistency.

### 8. skill_advisor.py Uncertainty (P1)
Enhance skill routing with dual-threshold: if `confidence >= 0.8` AND `uncertainty <= 0.35`, recommend skill. Otherwise, recommend general approach with caveats. Output includes both scores so routing decisions are transparent. Prevents routing to specialized skills when requirements are unclear.

### 9. Decision Journaling (P2)
Extended audit trail capturing: timestamp, session_id, decision_type, gate name, decision (PASS/BLOCK), confidence, evidence, and context (spec folder, task, files read). Queryable by session/spec/gate. Enables post-session retrospectives and debugging of decision patterns over time.

---

## 4. Quick Wins

**Implement immediately with minimal risk:**

### Win 1: Five Checks Framework (1-2 hours)
```
Before ANY significant decision, verify:
□ NECESSARY: Does this solve an actual need NOW?
□ BEYOND LOCAL MAXIMA: Have I explored alternatives?
□ SUFFICIENT: Is this the simplest approach that works?
□ FITS GOAL: Does this stay on the critical path?
□ OPEN HORIZONS: Does this align with long-term architecture?
```
**Why now:** Self-contained, immediately usable, no dependencies.

### Win 2: Structured Decision Format (1 hour)
```
GATE DECISION: [GATE_NAME]
├─ Status: PASS | BLOCK | DEFER
├─ Confidence: [0.0-1.0]
├─ Evidence: [citation or "NONE"]
└─ Rationale: [one sentence]
```
**Why now:** Documentation change only, improves all future decisions.

### Win 3: Uncertainty Tracking (2-3 hours)
Add explicit uncertainty field (0.0-1.0) separate from confidence.
**Why now:** Prevents "confident ignorance" - foundation for dual-threshold validation.

### Win 4: Enhanced Resume Detection (2-3 hours)
Improve memory-based resume with priority order.
**Why now:** High-frequency pain point, low risk.

---

## 5. Implementation Roadmap

```
Week 1-2: Phase 1 - Core Epistemic & Quick Wins
├─ Explicit uncertainty tracking
├─ Dual-threshold validation
├─ Enhanced resume detection
├─ PREFLIGHT baseline capture
└─ Five Checks framework

Week 3: Phase 2 - Learning Measurement
├─ POSTFLIGHT delta calculation
├─ Learning storage in memory files
└─ Structured decision format

Week 4: Phase 3 - Gate Enhancement
├─ skill_advisor.py uncertainty integration
├─ Decision journaling
└─ Integration testing & documentation
```

### Version Mapping

| Version | Phase | Key Deliverables |
|---------|-------|------------------|
| v1.0.7.0 | 1 | Uncertainty tracking, dual-threshold, PREFLIGHT, Five Checks |
| v1.0.8.0 | 2 | POSTFLIGHT deltas, learning storage, structured format |
| v1.0.9.0 | 3 | skill_advisor.py, decision journaling, documentation |

---

## 6. Expected Outcomes

### Measurable Benefits

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Resume success rate | ~60% | 90%+ | State file + memory hybrid |
| Context preservation | Partial | Complete | POSTFLIGHT delta tracking |
| Decision confidence calibration | Uncalibrated | ±10% accuracy | Uncertainty tracking |
| Gate consistency | Variable | Standardized | Structured format adoption |

### Qualitative Benefits

- **Reduced rework:** Better state tracking prevents "starting over"
- **Improved trust:** Explicit uncertainty prevents overconfidence
- **Learning visibility:** PREFLIGHT/POSTFLIGHT shows knowledge gain
- **Decision audit trail:** Structured format enables retrospectives

---

## 7. What We're NOT Doing (and Why)

| Excluded Item | Reason | Revisit When |
|---------------|--------|--------------|
| `.spec-state.json` state file | Scope reduction; memory-based approach sufficient | Clear reliability need |
| `/spec_kit:status` dashboard | Scope reduction; not critical path | UX improvement request |
| `:quick` mode for commands | Scope reduction; adds complexity | User demand |
| Domain-specific overlays | High effort; not critical path | Architecture need |
| Git notes integration | Medium effort; existing backup sufficient | Distributed team need |
| Retrospective HTML reports | High effort; low immediate value | Analysis need |
| npm distribution | Low user demand; maintenance overhead | Community requests |
| Full hooks integration | OpenCode doesn't support lifecycle hooks | Platform adds hook support |
| LanceDB migration | SQLite sufficient at current scale | 10K+ memory files |
| Full 13-vector epistemic system | Diminishing returns; 4-5 vectors sufficient | Research shows clear benefit |

---

## 8. Risk Assessment

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| State file corruption | Low | High | JSON schema validation, backup on write |
| Performance regression | Low | Med | Benchmark before/after each phase |
| Migration complexity | Med | Med | Incremental rollout, feature flags |
| Scope creep | Med | High | Strict adherence to priority matrix |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| User confusion | Med | Med | Clear documentation, gradual rollout |
| Backward compatibility | Low | High | Version detection, graceful degradation |
| Testing gaps | Med | Med | Comprehensive test suite per phase |

---

## 9. Next Steps

### Immediate Actions (This Week)

1. **Create spec folder** for Phase 1 implementation under:
   ```
   .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/
   ```

2. **Add Five Checks** to AGENTS.md pre-execution gates
   - Update Section 5: Request Analysis
   - Add as soft-check before significant decisions

3. **Document structured decision format** in spec-kit templates
   - Update gate decision templates
   - Add examples to SKILL.md

4. **Add uncertainty tracking** to AGENTS.md Section 4
   - Define uncertainty field (0.0-1.0)
   - Document dual-threshold validation

### First Sprint Definition

**Sprint Goal:** Implement Quick Wins 1-4 with documentation

**Acceptance Criteria:**
- [ ] Five Checks visible in Claude's decision process
- [ ] Gate decisions follow structured format
- [ ] Uncertainty tracking documented in AGENTS.md
- [ ] Enhanced resume detection uses memory file priority
- [ ] All existing tests pass

**Estimated Effort:** 6-10 hours over 1-2 weeks

---

## 10. Appendix: Source Research Links

### Primary Research Specifications

| Spec | Path | Focus |
|------|------|-------|
| 060 | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/smart-ralph-synthesis.md` | State Management & UX |
| 061 | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/empirica-synthesis.md` | Uncertainty & Confidence |
| 062 | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md` | Lifecycle Hooks (limited) |
| 063 | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/superego-synthesis.md` | Gate Framework |

### Consolidation Documents

| Document | Path |
|----------|------|
| This Recommendation | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/final-recommendation.md` |
| Implementation Plan | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/plan.md` |
| Consolidated Findings | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/` |

### Related System Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Primary agent instructions (update for Five Checks) |
| `.opencode/skill/system-spec-kit/SKILL.md` | SpecKit skill definition |
| `.opencode/skill/system-spec-kit/templates/` | Spec folder templates |

---

**Document Status:** FINAL
**Prepared by:** Opus 4.5 Research Synthesis
**Review Required:** Human approval before Phase 1 implementation
**Next Review:** After Phase 1 completion
