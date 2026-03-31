
---
title: "Spec: Adversarial Self-Check for Review, Debug [04--agent-orchestration/026-review-debug-agent-improvement/spec]"
description: "Adds adversarial self-check protocols to the review, debug, and ultra-think agents across the supported runtime variants."
trigger_phrases:
  - "spec"
  - "adversarial"
  - "review"
  - "debug"
  - "ultra-think"
  - "026"
importance_tier: "important"
contextType: "implementation"
---
# Spec: Adversarial Self-Check for Review, Debug, Ultra-Think Agents

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partially Reverted |
| **Created** | 2026-03-05 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
LLM agents are vulnerable to sycophancy bias. Reviewers may invent issues to appear thorough, debuggers may anchor on the first hypothesis, and planners may converge too early on a preferred strategy.

### Purpose
Add an internal adversarial self-check protocol to the review, debug, and ultra-think agents so each agent actively challenges its own initial conclusions before final delivery.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the Hunter/Skeptic/Referee protocol to the canonical `review`, `debug`, and `ultra-think` agents.
- Mirror the same behavioral changes to the Claude, Gemini-style, and Codex runtime variants that still exist in the repository.
- Record removed historical runtime variants in prose only.

### Out of Scope
- Changes to orchestrate, context, research, speckit, write, or handover agents.
- Runtime code enforcement or sub-agent orchestration changes.

### Files Affected
- Canonical agents under `.opencode/agent/`
- Claude variants under `.claude/agents/`
- Gemini-style variants under `.agents/agents/`
- Codex TOML variants under `.codex/agents/`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review agent includes adversarial self-check | Review variants contain Hunter/Skeptic/Referee guidance |
| REQ-002 | Debug agent challenges hypotheses before fixing | Debug variants include counter-evidence validation |
| REQ-003 | Ultra-think cross-critiques close strategy scores | Ultra-think variants include adversarial comparison guidance |
| REQ-004 | Supported runtime variants stay behaviorally aligned | Canonical, Claude, Gemini-style, and Codex variants reflect the same protocol |
| REQ-005 | Compliance normalization does not invent removed runtime files | Historical removed variants are described in prose instead of broken file links |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All surviving runtime variants of review, debug, and ultra-think contain the adversarial protocol.
- **SC-002**: Checklist verification confirms no out-of-scope agent families were changed.
- **SC-003**: The Level 2 docs validate without errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adversarial checks add overhead to trivial tasks | Medium | Keep a fast-path exception for low-complexity work |
| Risk | Runtime variants drift over time | Medium | Keep a single checklist item that verifies cross-variant alignment |
| Dependency | Canonical agent docs remain the source of truth | Medium | Normalize variant language from the canonical content |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: The added protocol must remain documentation-only.
- **NFR-002**: Existing safety and authority rules must remain intact.
- **NFR-003**: Fast-path behavior must still be explicit for low-complexity tasks.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Trivial tasks may skip the adversarial loop when the agent already documents a fast-path exception.
- Removed historical runtime variants must not be referenced as live repository files.
- Codex TOML variants must keep valid string escaping after content changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Three agent families across multiple runtime variants |
| Risk | 10/25 | Documentation-only but cross-variant consistency matters |
| Research | 6/20 | Existing protocol content already available |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. This compliance pass only normalizes structure around the documented adversarial protocol.
<!-- /ANCHOR:questions -->
