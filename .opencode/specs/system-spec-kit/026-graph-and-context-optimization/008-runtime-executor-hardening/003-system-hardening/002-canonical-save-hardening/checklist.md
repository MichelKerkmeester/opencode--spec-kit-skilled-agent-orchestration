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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T22:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Checklist updated with Wave A-C evidence"
    next_safe_action: "Orchestrator review and commit"

---
# Verification Checklist: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Verification Protocol

Complete all items with evidence links. Use file:line references for code evidence.

## Pre-Implementation

- [ ] Spec folder valid: `validate.sh --strict --no-recursive` passed at spec creation — evidence: not passed during dispatch; inherited packet-doc anchor/reference and sandbox `tsx` blockers were present before edits
- [x] Source research reviewed: `../001-initial-research/001-canonical-save-invariants/research.md` — evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-04/research.md`
- [ ] Findings registry reviewed: `../001-initial-research/findings-registry.json` — evidence: not separately verified during this implementation dispatch

## Code Quality

- [x] Wave A: `mcp_server/api/indexing.ts` `refreshGraphMetadata` signature accepts `GraphMetadataRefreshOptions` — evidence: `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:96`
- [ ] Wave A: dist rebuild completes without errors — evidence: workspace build remains blocked by unrelated TypeScript baseline errors; relevant emitted dist was verified directly
- [x] Wave A: `dist/core/workflow.js` forwards refresh options — evidence: `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:1170`
- [x] Wave A: `dist/lib/graph/graph-metadata-parser.js` + schema include `save_lineage` — evidence: `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-parser.js:858`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/graph/graph-metadata-schema.js:9`
- [x] Wave B: each of 007/008/009/010 has valid root spec.md with `# Feature Specification:` header and frontmatter — evidence: `007-release-alignment-revisits/spec.md:1`, `008-cleanup-and-audit/spec.md:1`, `009-playbook-and-remediation/spec.md:1`, `010-search-and-routing-tuning/spec.md:1`
- [x] Wave B: generate-context.js refresh completed for all 4 — evidence: `007-release-alignment-revisits/description.json:38`, `008-cleanup-and-audit/description.json:38`, `009-playbook-and-remediation/description.json:37`, `010-search-and-routing-tuning/description.json:38`
- [x] Wave B: `derived.source_docs` non-empty for all 4 — evidence: `007-release-alignment-revisits/graph-metadata.json:95`, `008-cleanup-and-audit/graph-metadata.json:97`, `009-playbook-and-remediation/graph-metadata.json:95`, `010-search-and-routing-tuning/graph-metadata.json:95`
- [x] Wave C: `scripts/rules/check-canonical-save.sh` implements all 5 rules — evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh:1`, `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs:125`
- [x] Wave C: `scripts/spec/validate.sh` dispatches 5 new rules — evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:418`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:447`
- [x] Wave C: `show_help()` updated to list 5 new rules — evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:105`

## Testing

- [x] Wave A: regression test asserts `save_lineage: 'same_pass'` persists — evidence: `.opencode/skill/system-spec-kit/scripts/tests/workflow-canonical-save-metadata.vitest.ts:239`; targeted scripts run passed 2 files, 11 passed, 1 skipped
- [x] Wave A: indexing-API wrapper test asserts options preserved — evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/follow-up-api.vitest.ts:78`; targeted mcp-server run passed 3 files, 19 tests
- [x] Wave C: synthetic fixture tests pass (broken fixtures fail, good fixtures pass) — evidence: `.opencode/skill/system-spec-kit/scripts/tests/canonical-save-validation.vitest.ts:126`; 1 file passed, 6 tests passed
- [ ] Full mcp_server test suite green — evidence: not claimed; broad workspace suite has unrelated baseline failures outside this packet
- [x] `validate.sh --strict` passes on full 026 tree with allowlist — evidence: canonical-save rule subset on full 026 tree passed with 19 phases, 0 errors, 0 warnings

## Security

- [x] No new hard-coded secrets introduced — evidence: new code only adds option forwarding, validator rules, fixture metadata, and coordination docs
- [x] Input validation: refresh options have explicit Zod/type guards — evidence: `GraphMetadataRefreshOptions` typed at `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:17` and `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:99`
- [x] Allowlist scope bounded (only 007-010 explicitly listed) — evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs:13`

## Documentation

- [x] spec.md scope matches implemented changes — evidence: implemented only Wave A/B/C from packet scope
- [x] plan.md phases match actual execution — evidence: implementation followed Waves A-C order from dispatch
- [ ] tasks.md all tasks marked `[x]` with evidence — evidence: not complete because commit/push and full-baseline items remain intentionally open
- [x] implementation-summary.md populated post-completion — evidence: `implementation-summary.md` updated in this packet
- [x] Grandfathering cutoff documented in validator rule comments — evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-canonical-save.sh:6`

## File Organization

- [x] New files under expected paths (no orphan files) — evidence: validator files under `scripts/rules/` and test under `scripts/tests/`; root specs under 007/008/009/010 packet roots
- [x] No accidental deletions of adjacent code — evidence: no deliberate deletions outside replacing the malformed validator draft with the final rule bridge/helper
- [ ] Dist artifacts committed alongside source — evidence: not committed per user instruction; dist artifacts are present in working tree

## Verification Summary

Status: Scope-complete for Waves A-C. Targeted mcp-server and scripts regressions pass; recursive 026 canonical-save validator pack passes with 0 errors and 0 warnings. Remaining unchecked items are orchestrator-owned commit/push, inherited packet baseline validation, and broad-suite baseline claims that were not true for this dispatch.
