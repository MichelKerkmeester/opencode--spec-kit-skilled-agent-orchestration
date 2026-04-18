---
title: "Implementation Plan: Routing Accuracy Research (SSK-RR-1)"
description: "Dispatch plan for SSK-RR-1 deep-research."
trigger_phrases:
  - "ssk-rr-1 dispatch plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/001-initial-research/005-routing-accuracy"
    last_updated_at: "2026-04-18T17:55:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Wave 2 convergence then dispatch"

---
# Implementation Plan: Routing Accuracy Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (gate-3) + Python (skill-advisor) + Markdown |
| **Framework** | sk-deep-research |
| **Storage** | `026/research/019-system-hardening/001-initial-research/005-routing-accuracy/` |

### Overview

Dispatch `/spec_kit:deep-research :auto` on Gate 3 + skill-advisor accuracy. Build labeled corpus, run classifiers, report accuracy, propose changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Charter approved.
- [ ] Wave 2 converged.
- [ ] Metadata generated.

### Definition of Done
- [ ] Converges.
- [ ] Accuracy matrix + ranked proposals written.
- [ ] Findings propagated.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-DISPATCH-001 | Canonical `/spec_kit:deep-research :auto` | Gate 4 |
| AI-WAVE-ORDER | Wait Wave 2 | ADR-001 |
| AI-PRIVACY-001 | Anonymize transcript-derived prompts | NFR-S01 |

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical sk-deep-research; offline classifier evaluation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold.
- [ ] Metadata.

### Phase 2: Implementation
- [ ] Wait Wave 2.
- [ ] Dispatch.
- [ ] Iterate 12-15.

### Phase 3: Verification
- [ ] Validate.
- [ ] Corpus + accuracy review.
- [ ] Propagate.
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:deep-research :auto "Gate 3 classifier and skill-advisor routing accuracy research. Build ~200-prompt labeled corpus combining real session transcripts (anonymized) and synthetic edge cases. For each prompt, compute gate-3-classifier.ts classifyPrompt() verdict and skill_advisor.py top-1 recommendation plus confidence. Compare to human ground truth. Report precision/recall/F1 per classifier. Enumerate error classes including known CLAUDE.md false-positive tokens (analyze, decompose, phase). Compute compound Gate 3 x skill-advisor joint error rate. Rank rule-change proposals (threshold adjustments, new positive triggers, negative-trigger additions) with simulated before/after delta on the labeled corpus." --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | This packet | `validate.sh --strict --no-recursive` |
| Convergence | Iteration loop | dashboard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `/spec_kit:deep-research :auto` | Internal | Green |
| cli-codex | External | Green |
| Session transcripts | Optional | Unknown (synthetic fallback) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Budget exhausted with <150 corpus.
- **Procedure**: Report partial corpus + partial accuracy; propose follow-on scope.
<!-- /ANCHOR:rollback -->
