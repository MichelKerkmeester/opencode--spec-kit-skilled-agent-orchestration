# Deep Research Strategy: sk-deep-research Review Mode

---

## 1. Topic

Design of a "review mode" for sk-deep-research — an auto, iterative deep review flow that reuses the existing LEAF dispatch, JSONL state, and convergence infrastructure for automated code quality auditing. The review mode analyzes spec folders, code, skills, and their cross-references to find misalignments, bugs, and incomplete features. Goal: make things 100% bug-free and release-ready.

---

## 2. Key Questions

- [x] Q1: How much existing sk-deep-research infrastructure can be reused for review mode vs needs adaptation?
- [x] Q2: How does convergence work for reviews (no new findings) vs research (no new info)?
- [x] Q3: How should review scope be decomposed into per-iteration focus areas + cross-reference checks?
- [x] Q4: Should review mode use @review, create @deep-review, or adapt @deep-research dispatch context?
- [x] Q5: What should the review-report.md output look like and how does review mode integrate with commands?

---

## 3. Non-Goals

- Implementing the review mode (this is research only)
- Changing existing sk-deep-research v1.1.0 behavior
- Changing the @review agent
- Creating a separate skill (review mode stays within sk-deep-research)

---

## 4. Stop Conditions

- All 5 key questions answered with evidence-backed proposals
- No remaining contradictions between agent findings
- Implementation roadmap is actionable at file level

---

## 5. Answered Questions

- [x] Q1 (iteration-001): 2 REUSE-AS-IS, 12 ADAPT, 1 REPLACE. Recommends parallel YAML workflows. Found 5 existing inconsistencies.
- [x] Q2 (iteration-002): Severity-weighted newFindingsRatio with P0 override. Rolling avg window=2/threshold=0.08/weight=0.30, MAD weight reduced to 0.25, dimension coverage 100%/weight=0.45. 5 quality guards. Full pseudocode.
- [x] Q3 (iteration-003): 5 target types, 7 review dimensions, hybrid ordering (inventory → risk-ordered), 6 cross-reference protocols with severity, dedup strategy.
- [x] Q4 (iteration-004): Recommends new @deep-review agent (Option B). Hybrid of @review rubric + @deep-research state protocol. Tool budget 9-12, max 13. Full dispatch template and permission matrix.
- [x] Q5 (iteration-005): 11-section review-report.md. /spec_kit:deep-review[:auto|:confirm] command. 7-point progressive synthesis. 4-verdict post-review workflow.

---

## 6. What Worked

- Parallel agent dispatch (5 shards) gave comprehensive non-overlapping coverage
- Grounding analysis in actual file references prevented speculation
- Signal-by-signal convergence mapping (Agent 2) was thorough and concrete

---

## 7. What Failed

(none — single wave was sufficient)

---

## 8. Exhausted Approaches

(none)

---

## 9. Ruled Out Directions

- Config switch in same YAML (rejected: current system prefers workflow specialization)
- Reusing @review as LEAF (rejected: muddies read-only identity)
- Mode-switching @deep-research via dispatch context (rejected: fights base contract)
- Flat newFindingsRatio without severity weights (rejected: P0 discovery masked)
- Separate convergence algorithm (rejected: 80%+ maps cleanly)
- Per-dimension convergence trackers (rejected: excessive complexity)
- /spec_kit:review as command name (rejected: too ambiguous with single-pass @review)
- Auto-creating remediation plans (rejected: review and implementation should stay separate)
- Score-only convergence (rejected: hides untouched files)

---

## 10. Next Focus

Research complete. All 5 questions answered. Ready for synthesis → research.md.

---

## 11. Known Context

- sk-deep-research v1.1.0 shipped with dashboard, quality guards, negative knowledge, insight/thought statuses
- @review agent uses P0/P1/P2 severity, 5-dimension scoring, Hunter/Skeptic/Referee self-check
- sk-code--review provides baseline + overlay model
- User preference: single skill per sk-doc standards (no modular split)

---

## 12. Research Boundaries

- Max iterations: 10 (used 5)
- Convergence: all questions answered in single wave
- Agent model: GPT-5.4 xhigh (4 agents) + Opus native (1 agent)
- Sandbox: read-only (analysis only)
