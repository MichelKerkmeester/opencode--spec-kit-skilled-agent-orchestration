---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable — updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
[Review target description from config -- set during initialization]

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability — Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
[What this review session is NOT trying to assess -- populated during initialization]

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [PASS/CONDITIONAL/FAIL] | [N] | [1-sentence result] |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific review approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful review approaches in this category]
- Prefer for: [related dimensions where this category may help]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
[Recommended focus area for the next iteration -- updated at end of each iteration. Includes target dimension and/or specific files to review.]
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
[Populated during initialization from memory_context() results, if any prior work exists]

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->
<!-- /ANCHOR:review-boundaries -->
