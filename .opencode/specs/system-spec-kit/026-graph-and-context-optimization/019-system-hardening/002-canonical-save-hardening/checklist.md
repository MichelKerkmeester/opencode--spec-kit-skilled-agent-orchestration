---
title: "Verification Checklist: Canonical-Save Hardening"
description: "Pre-completion verification for canonical-save hardening child."
trigger_phrases:
  - "canonical save hardening checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T23:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify after implementation"

---
# Verification Checklist: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Verification Protocol

Complete all items with evidence links. Use file:line references for code evidence.

## Pre-Implementation

- [ ] Spec folder valid: `validate.sh --strict --no-recursive` passed at spec creation
- [ ] Source research reviewed: `../001-initial-research/001-canonical-save-invariants/research.md`
- [ ] Findings registry reviewed: `../001-initial-research/findings-registry.json`

## Code Quality

- [ ] Wave A: `mcp_server/api/indexing.ts` `refreshGraphMetadata` signature accepts `GraphMetadataRefreshOptions` — evidence: file:line
- [ ] Wave A: dist rebuild completes without errors — evidence: build log excerpt
- [ ] Wave A: `dist/core/workflow.js` forwards refresh options — evidence: file:line grep
- [ ] Wave A: `dist/lib/graph/graph-metadata-parser.js` + schema include `save_lineage` — evidence: file:line
- [ ] Wave B: each of 007/008/009/010 has valid root spec.md with `# Feature Specification:` header and frontmatter — evidence: 4 file paths
- [ ] Wave B: generate-context.js refresh completed for all 4 — evidence: 4 description.json timestamps
- [ ] Wave B: `derived.source_docs` non-empty for all 4 — evidence: 4 graph-metadata.json excerpts
- [ ] Wave C: `scripts/rules/check-canonical-save.sh` implements all 5 rules — evidence: file:line mapping
- [ ] Wave C: `scripts/spec/validate.sh` dispatches 5 new rules — evidence: file:line
- [ ] Wave C: `show_help()` updated to list 5 new rules — evidence: file:line

## Testing

- [ ] Wave A: regression test asserts `save_lineage: 'same_pass'` persists — evidence: test file path + status
- [ ] Wave A: indexing-API wrapper test asserts options preserved — evidence: test file path + status
- [ ] Wave C: synthetic fixture tests pass (broken fixtures fail, good fixtures pass) — evidence: test output summary
- [ ] Full mcp_server test suite green — evidence: test run summary
- [ ] `validate.sh --strict` passes on full 026 tree with allowlist — evidence: validator output

## Security

- [ ] No new hard-coded secrets introduced
- [ ] Input validation: refresh options have explicit Zod/type guards
- [ ] Allowlist scope bounded (only 007-010 explicitly listed)

## Documentation

- [ ] spec.md scope matches implemented changes
- [ ] plan.md phases match actual execution
- [ ] tasks.md all tasks marked `[x]` with evidence
- [ ] implementation-summary.md populated post-completion
- [ ] Grandfathering cutoff documented in validator rule comments

## File Organization

- [ ] New files under expected paths (no orphan files)
- [ ] No accidental deletions of adjacent code
- [ ] Dist artifacts committed alongside source

## Verification Summary

Status: Pending (to be updated post-implementation with PASSED/FAILED + evidence summary)
