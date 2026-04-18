---
title: "Verification Checklist: Template/Validator Contract Alignment"
description: "Verification for 5 ranked proposals."
trigger_phrases: ["validator alignment checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T23:52:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify post-implementation"
---
# Verification Checklist: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Pre-Implementation
- [ ] Audit reviewed: ../001-initial-research/006-template-validator-audit/review-report.md

## Code Quality
- [ ] Rank 1: `scripts/lib/validator-registry.{ts,json}` exists with full rule metadata — evidence
- [ ] Rank 1: validate.sh reads registry — evidence
- [ ] Rank 1: show_help() generated from registry — evidence
- [ ] Rank 2: check-frontmatter.sh rejects empty fields — evidence
- [ ] Rank 2: spec-doc-structure.ts requiredPairs treats empty as missing — evidence
- [ ] Rank 3: check-anchors.sh rejects duplicate IDs — evidence
- [ ] Rank 5: decision-record.md placeholder fixed — evidence file:line

## Testing
- [ ] Rule registry regression: same rules dispatched as before — evidence
- [ ] Empty-frontmatter fixture fails — evidence
- [ ] Duplicate-anchor fixture fails — evidence
- [ ] Full validator regression green — evidence
- [ ] Full mcp_server test suite green — evidence

## Security
- [ ] No new secrets
- [ ] Grandfathering allowlist bounded (time-limited cutoff)

## Documentation
- [ ] spec.md / plan.md / tasks.md aligned
- [ ] implementation-summary.md populated
- [ ] scripts/rules/README.md updated with registry reference

## File Organization
- [ ] Registry file in scripts/lib/
- [ ] No orphan files

## Verification Summary

Status: Pending
