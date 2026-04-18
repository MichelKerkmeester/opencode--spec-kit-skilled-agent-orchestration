---
title: "Verification Checklist: Routing Accuracy Hardening"
description: "Verification for Wave A+B+optional C."
trigger_phrases: ["routing accuracy checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/004-routing-accuracy-hardening"
    last_updated_at: "2026-04-18T23:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify post-implementation"
---
# Verification Checklist: Routing Accuracy Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Pre-Implementation
- [ ] Research reviewed: ../001-initial-research/005-routing-accuracy/research.md
- [ ] Labeled corpus copied as regression fixture
- [ ] Baseline metrics captured

## Code Quality
- [ ] Wave A: command-bridge mapping table in skill_advisor.py — evidence
- [ ] Wave A: explicit-invocation guard with carve-outs — evidence
- [ ] Wave B: deep-loop positive markers in gate-3-classifier.ts — evidence

## Testing
- [ ] Advisor accuracy ≥ 60% on corpus — evidence
- [ ] Gate 3 F1 ≥ 83% on corpus — evidence
- [ ] Historical false-positives (analyze/decompose/phase) unchanged — evidence
- [ ] Joint matrix TT≥108, FT≤12, FF≤15 — evidence

## Security
- [ ] Normalization does not break slash-command routing
- [ ] Guard prevents over-flattening implementation targets

## Documentation
- [ ] spec.md / plan.md / tasks.md aligned with implementation
- [ ] implementation-summary.md populated

## File Organization
- [ ] No orphan files
- [ ] Regression fixture in expected path

## Verification Summary

Status: Pending
