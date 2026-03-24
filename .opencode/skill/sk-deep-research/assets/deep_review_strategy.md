---
title: Deep Review Strategy Template
description: Runtime template copied to scratch/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/scratch/` during initialization. Tracks review progress across iterations.

<!-- ANCHOR:overview -->
## 1. Overview

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/scratch/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable — updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. Topic
[Review target description from config -- set during initialization]

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. Review Dimensions (remaining)
- [ ] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Spec Alignment — Implementation matches spec.md, plan.md, and decision records
- [ ] D4 Completeness — Missing edge cases, unhandled error paths, TODO/FIXME items
- [ ] D5 Cross-Reference Integrity — Internal links, import paths, schema refs all resolve
- [ ] D6 Patterns — Consistency with codebase conventions, anti-pattern detection
- [ ] D7 Documentation Quality — Docstrings, comments, README accuracy, changelog entries

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. Non-Goals
[What this review session is NOT trying to assess -- populated during initialization]

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. Stop Conditions
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. Completed Dimensions
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Score | Iteration | Summary |
|-----------|-------|-----------|---------|
| [D1 Correctness] | [PASS/CONDITIONAL/FAIL] | [N] | [1-sentence result] |

---

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. Running Findings
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in the finding registry within JSONL state. This section provides a running count summary updated after each iteration.]

---

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. What Worked
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. What Failed
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. Exhausted Approaches (do not retry)
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
## 11. Ruled Out Directions
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. Next Focus
[Recommended focus area for the next iteration -- updated at end of each iteration. Includes target dimension and/or specific files to review.]

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. Known Context
[Populated during initialization from memory_context() results, if any prior work exists]

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. Cross-Reference Status
[Alignment checks completed across spec, checklist, and agent definitions]

| Check | Status | Iteration | Notes |
|-------|--------|-----------|-------|
| Spec vs Implementation | [pending/pass/fail] | [N] | [details] |
| Checklist vs Code | [pending/pass/fail] | [N] | [details] |
| Agent Consistency | [pending/pass/fail] | [N] | [details] |

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. Files Under Review
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. Review Boundaries
- Max iterations: [from config]
- Convergence threshold: [from config]
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Quality gate threshold: [from config.qualityGateThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: spec=[from config], checklist=[from config], agentConsistency=[from config]
- Started: [timestamp]
<!-- /ANCHOR:review-boundaries -->
