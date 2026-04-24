---
title: "...text-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/spec]"
description: "Deep-research sub-packet covering the SSK-RR-1 Tier 1 item. Build a labeled corpus, compute classifier accuracy for Gate 3 and skill-advisor, report precision/recall per classifier, and propose rule or threshold changes. Wave 3 dispatch per ADR-001 of 019/001."
trigger_phrases:
  - "routing accuracy research"
  - "gate 3 classifier accuracy"
  - "skill advisor accuracy"
  - "ssk-rr-1 routing"
  - "classifier evaluation"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy"
    last_updated_at: "2026-04-18T17:55:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Research packet scaffolded"
    next_safe_action: "Dispatch after Wave 2 convergence"
    blockers: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Gate 3 + Skill-Advisor Routing Accuracy Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Originating Source** | ../../../scratch/deep-review-research-suggestions.md §6 SSK-RR-1 |
| **Wave** | 3 (skill-wide audits, after Wave 2) |
| **Dispatch** | `/spec_kit:deep-research :auto` |

Two classifiers route every non-trivial task: `gate-3-classifier.ts` is a HARD-block gate for file-modification intent detection, and `skill_advisor.py` mandates skill invocation at confidence ≥ 0.8. Neither has had an offline accuracy evaluation. CLAUDE.md admits specific false-positive tokens (`analyze`, `decompose`, `phase`) on Gate 3, but the residual error surface of both classifiers is unquantified.

This packet builds a ~200-prompt labeled corpus, computes classifier verdicts + confidence, compares to human ground truth, reports precision/recall/F1 per classifier, enumerates error classes, and ranks rule or threshold changes by impact.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (HARD-block classifiers; errors damage every workflow) |
| **Status** | Spec Ready, Awaiting Wave 2 Convergence |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` |
| **Iteration Budget** | 12-15 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Gate 3 classifier (`gate-3-classifier.ts`) decides whether an incoming prompt requires a spec folder. False-negative = user modifies files without spec folder (governance breach). False-positive = Gate 3 blocks read-only prompts with an unnecessary A/B/C/D/E menu (UX friction). CLAUDE.md identifies known false-positive tokens (`analyze`, `decompose`, `phase`) in "review the decomposition phase" style prompts, but the full false-positive distribution is unknown.

Skill-advisor (`skill_advisor.py`) decides which skill to route a prompt to. At confidence ≥ 0.8, skill invocation is mandatory. False-negative (advisor missed skill) = user receives generic general-purpose handling instead of the specialized workflow. False-positive (advisor routes to wrong skill) = user gets the wrong workflow. Neither failure mode has been quantified.

Both classifiers interact: Gate 3 decides "is this a write?", skill-advisor decides "which skill handles it?". They must agree on routing for the system to function coherently. The compound error rate (Gate 3 × skill-advisor) is unknown.

### Purpose

Quantify the accuracy of both classifiers via offline evaluation against a labeled corpus. Produce ranked rule-change proposals that improve precision/recall/F1 with specific before/after evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Build ~200-prompt labeled corpus covering: (a) real prompts from recent sessions (transcript logs if accessible, anonymized), (b) synthetic edge cases (CLAUDE.md examples + intentionally adversarial phrasing).
- Label each prompt with Gate 3 ground truth (requires-spec-folder: yes/no) and skill-advisor ground truth (correct skill name, or "general-purpose").
- Run classifiers against the corpus: compute `classifyPrompt()` verdict + skill advisor top-1 recommendation + confidence.
- Compute per-classifier precision, recall, F1.
- Enumerate error classes: what patterns drive false-positives vs false-negatives? Does the `analyze/decompose/phase` token false-positive surface with similar density in real usage?
- Rank proposed changes: threshold adjustments (skill-advisor 0.8 → 0.75 or 0.85), rule additions (new positive triggers for Gate 3), negative-trigger additions (read-only disqualifiers).
- For each proposed change, report simulated precision/recall delta if adopted.

### 3.2 Out of Scope

- Implementing the rule changes. Belongs to a sibling child.
- User-interface changes to Gate 3 prompts (A/B/C/D/E menu design). That's UX scope.
- Gate 1 / Gate 2 / Gate 4 evaluation (only Gate 3 for now; skill-advisor is Gate 2 adjunct).

### 3.3 Files to Read (research inputs)

- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` (if accuracy depends on compiled graph)
- CLAUDE.md §2 Gates 1-4 (prose-level rules and known false-positive notes)
- Existing unit tests for gate-3-classifier + skill-advisor
- Recent session transcripts (if available; for real-prompt corpus)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Labeled corpus MUST cover ≥ 150 prompts (target 200) | research.md §Corpus lists ≥ 150 prompts |
| REQ-002 | Both classifiers MUST have precision/recall/F1 reported | research.md §Accuracy Matrix non-empty |
| REQ-003 | At least 3 ranked rule changes MUST be proposed per classifier | research.md §Proposed Changes has ≥ 6 entries |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Known false-positive tokens (analyze/decompose/phase) MUST be quantified in real usage | research.md §Known False-Positives reports count + density |
| REQ-005 | Simulated delta for each proposed change MUST be reported | research.md §Simulated Impact lists before/after per proposal |
| REQ-006 | Compound error rate (Gate 3 × skill-advisor) MUST be reported | research.md §Compound Error reports joint rate |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** the corpus is labeled, **when** classifiers run, **then** every prompt has a ground-truth + classifier-verdict pair.

**Given** accuracy is computed, **when** reported, **then** precision/recall/F1 values are < 100% (the interesting cases are errors, not successes).

**Given** proposed changes, **when** simulated, **then** each shows a before/after on the labeled corpus.

**Given** the known `analyze/decompose/phase` false-positives, **when** the real-usage density is computed, **then** the research.md quantifies how often they fire in a representative prompt sample.

**Given** compound error rate is computed, **when** the result surfaces a joint error > 10%, **then** the finding is classified as P1 at minimum.

**Given** the corpus uses real transcripts, **when** writing the research doc, **then** any user-identifying content is anonymized.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Corpus ≥ 150 prompts.
- **SC-002**: Accuracy matrix + proposed changes reported.
- **SC-003**: Simulated impact per change quantified.
- **SC-004**: Findings propagated to parent registry.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/spec_kit:deep-research :auto` | High | Gate 4 |
| Dependency | Transcript log access for corpus | Medium | Synthetic-only corpus acceptable fallback |
| Risk | Budget (12-15 iter) insufficient for 200-prompt corpus | Medium | Accept 150-prompt minimum; prioritize error-class coverage |
| Risk | Proposed changes collide with active skill-advisor updates | Low | Research is non-mutating; changes defer to implementation child |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Security

- **NFR-S01**: User-identifying content in the corpus MUST be anonymized.
- **NFR-S02**: Labeled corpus and error classes stay local.

### Reliability

- **NFR-R01**: Corpus revision tracked with date stamps.

---

## L2: EDGE CASES

- If transcript logs are unavailable, substitute with hand-crafted synthetic corpus and document the limitation.
- If the classifier code itself is in flux, snapshot the commit hash at corpus-run time.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 200-prompt corpus + 2 classifiers |
| Risk | 10/25 | Research only |
| Research | 18/20 | Empirical evaluation |
| Multi-Agent | 4/15 | Single executor |
| Coordination | 6/15 | Wave 3 position |
| **Total** | **54/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-001**: Should skill-advisor confidence threshold be a single fixed value (0.8) or adaptive per skill? Research must empirically test.
- **Q-002**: How should the corpus handle prompts where ground truth is ambiguous (e.g., read-only with possible follow-on writes)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
- **Scratch Source**: `../../../scratch/deep-review-research-suggestions.md` §6 SSK-RR-1
