---
title: "Implementation Plan: Q4 NFKC Robustness Research (RR-1)"
description: "Dispatch plan for the RR-1 deep-research iteration."
trigger_phrases:
  - "rr-1 dispatch plan"
  - "nfkc research plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/003-q4-nfkc-robustness"
    last_updated_at: "2026-04-18T17:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Dispatch plan scaffolded"
    next_safe_action: "Wait for Wave 1 convergence"

---
# Implementation Plan: Q4 NFKC Robustness Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (sanitizer code) + Markdown (research outputs) |
| **Framework** | sk-deep-research |
| **Storage** | `026/research/019-system-hardening/001-initial-research/003-q4-nfkc-robustness/` |

### Overview

Dispatch `/spec_kit:deep-research :auto` on the Q4 NFKC robustness topic. Wait for Wave 1 (sub-packets 001 + 002) convergence before dispatching; Wave 1 must not surface a canonical-save P0 that invalidates sanitizer state persistence, or this packet's attack-construction-then-test loop would be unreliable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent charter approved
- [ ] Wave 1 (sub-packets 001 + 002) converged
- [ ] Metadata generated

### Definition of Done

- [ ] `/spec_kit:deep-research :auto` converges
- [ ] Threat inventory ≥ 10 entries
- [ ] Version drift + cross-platform sections filled
- [ ] Findings propagated to parent registry
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-DISPATCH-001 | Use canonical `/spec_kit:deep-research :auto` | Gate 4 |
| AI-WAVE-ORDER | Do not dispatch before Wave 1 converges | ADR-001 of parent 019/001 |
| AI-SECURITY-001 | Practical bypasses treated as P0 | REQ-002 |

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical sk-deep-research; threat-inventory outputs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold.
- [ ] Metadata.

### Phase 2: Implementation
- [ ] Wait for Wave 1 convergence.
- [ ] Dispatch per §4.1.
- [ ] Iterate up to 20 rounds.

### Phase 3: Verification
- [ ] Strict validation.
- [ ] Threat inventory review.
- [ ] Propagate to parent.
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:deep-research :auto "Q4 NFKC robustness research for the canonical-equivalence attack surface introduced by phase 016 T-SAN-01/02/03 NFKC normalization at Gate 3, sanitizeRecoveredPayload, and trigger-phrase-sanitizer. Enumerate attacker-controlled constructions that survive NFKC but bypass downstream lexical filters or Zod validation. Cover Unicode 15 vs 16 drift, ligature collapse (ﬀ ff), fullwidth Latin, mathematical alphanumerics, Cyrillic/Latin visual lookalikes, cross-platform normalization drift (macOS HFS+, Windows codepage, Linux). Review CVE corpus for comparable Unicode-normalization sanitizer bypass attacks. Produce residual-threat inventory with severity classifications, plus concrete hardening proposals (extended normalization vs post-normalization deny-list)." --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | This packet | `validate.sh --strict --no-recursive` |
| Convergence | Iteration loop | the deep-research-dashboard output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `/spec_kit:deep-research :auto` | Internal | Green |
| cli-codex | External | Green |
| Wave 1 convergence | Upstream | Pending |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wave 1 surfaces P0; iteration budget exhausted.
- **Procedure**: Defer dispatch or accept PARTIAL convergence.
<!-- /ANCHOR:rollback -->
