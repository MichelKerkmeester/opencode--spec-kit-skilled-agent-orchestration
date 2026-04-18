---
title: "Verification Checklist: NFKC Unification Hardening"
description: "Verification items for HP1-HP6."
trigger_phrases: ["nfkc hardening checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/003-nfkc-unification-hardening"
    last_updated_at: "2026-04-18T23:42:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify post-implementation"
---
# Verification Checklist: NFKC Unification Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Verification Protocol

All items must have evidence (file:line or test-run summary).

## Pre-Implementation
- [ ] Research reviewed: ../001-initial-research/003-q4-nfkc-robustness/research.md
- [ ] Baseline tests captured

## Code Quality
- [ ] HP1: `scripts/lib/unicode-normalization.ts` exports canonicalFold — evidence
- [ ] HP1: 3 surfaces import shared utility — evidence file:line each
- [ ] HP2: denylist checks post-canonicalization — evidence
- [ ] HP3: Greek-omicron in fold table — evidence
- [ ] HP4: semantic gate in hook-state — evidence
- [ ] HP4: 3 session-prime consumers wired — evidence file:line each
- [ ] HP5: provenance fingerprint in compact-cache — evidence
- [ ] HP6: adversarial corpus test file exists + passes — evidence

## Testing
- [ ] RT1-RT10 all blocked or quarantined — evidence per row
- [ ] Parity tests pass across 3 surfaces — evidence
- [ ] Full mcp_server suite green — evidence

## Security
- [ ] No new secrets introduced
- [ ] Quarantine-first semantics reversible
- [ ] Runtime fingerprint captured

## Documentation
- [ ] spec.md scope matches implementation
- [ ] tasks.md all T0NN `[x]` with evidence
- [ ] implementation-summary.md populated

## File Organization
- [ ] Shared utility placed correctly
- [ ] No orphan files
- [ ] Dist artifacts if applicable

## Verification Summary

Status: Pending
