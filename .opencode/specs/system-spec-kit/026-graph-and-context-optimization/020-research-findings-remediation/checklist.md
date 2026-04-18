---
title: "Verification Checklist: Phase 020 Research-Findings Remediation"
description: "P0/P1 verification gate for R1-R12 remediation. Follows Phase 018/019 EVIDENCE-closer convention."
trigger_phrases: ["020 checklist"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-research-findings-remediation"
    last_updated_at: "2026-04-18T15:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 020 Research-Findings Remediation

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required or user-approved deferral |
| **[P2]** | Optional |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Problem + scope documented in spec.md §2-3
- [ ] CHK-002 [P0] Each R1-R12 acceptance criteria mapped in spec.md §4
- [ ] CHK-003 [P0] Atomic-ship groups called out in tasks.md §Atomic-Ship Groups
- [ ] CHK-004 [P0] Research.md synthesis cited as primary input

### Wave A (R1 + R2)

- [ ] CHK-010 [P0] Non-native iteration's first JSONL record has executor field
- [ ] CHK-011 [P0] post-dispatch-validate rejects missing provenance on non-native
- [ ] CHK-012 [P0] `dispatch_failure` event preserves executor identity
- [ ] CHK-013 [P0] All 4 YAMLs wire pre_dispatch_audit for non-native
- [ ] CHK-014 [P1] Existing post-hoc audit path still works (idempotent merge)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Wave B (R4 + R5)

- [ ] CHK-020 [P0] Loader returns `{ok, reason: 'parse_error' | 'schema_error', partial?}` discriminated result
- [ ] CHK-021 [P0] `mergePreserveRepair` keeps authored narrative on schema-invalid files
- [ ] CHK-022 [P0] Canonical derived fields win on conflict
- [ ] CHK-023 [P0] Feature flag `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` defaults to on
- [ ] CHK-024 [P0] Specimen regression tests cover rich 017 packet fixtures

### Wave C (R3)

- [ ] CHK-030 [P1] `if_cli_copilot` size-check branch present in all 4 YAMLs
- [ ] CHK-031 [P1] cli-matrix test covers oversized-prompt `@path` path
- [ ] CHK-032 [P1] Copilot bootstrap docs consistent (machine matrix vs prose)

### Wave D (R6 + R7)

- [ ] CHK-040 [P1] `graph-metadata.json derived.save_lineage` present on new saves
- [ ] CHK-041 [P1] Backfill script stamps `graph_only` on existing files
- [ ] CHK-042 [P1] Continuity threshold docs say "one-sided policy budget, heuristic"
- [ ] CHK-043 [P1] Date-only timestamps no longer false-stale

### Wave E (R9)

- [ ] CHK-050 [P1] Indented fences no longer produce false-positive evidence-marker warnings
- [ ] CHK-051 [P1] Nested line-start triple-backtick fences handled correctly
- [ ] CHK-052 [P1] Mismatched-fence false-negative remains documented (separate issue)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-060 [P0] `executor-audit.vitest.ts` green with new cases
- [ ] CHK-061 [P0] `post-dispatch-validate.vitest.ts` green
- [ ] CHK-062 [P0] New `dispatch-failure.vitest.ts` green
- [ ] CHK-063 [P0] New `description-repair.vitest.ts` green
- [ ] CHK-064 [P0] New `description-repair-specimens.vitest.ts` green
- [ ] CHK-065 [P1] Extended `cli-matrix.vitest.ts` green
- [ ] CHK-066 [P1] New `graph-metadata-lineage.vitest.ts` green
- [ ] CHK-067 [P1] Extended `evidence-marker-audit.vitest.ts` green
- [ ] CHK-068 [P1] New `retry-budget-telemetry.vitest.ts` green
- [ ] CHK-069 [P1] Extended `caller-context.vitest.ts` green
- [ ] CHK-070 [P0] All existing tests still pass (regression)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-080 [P0] No secrets introduced via R1 provenance (executor block already audited)
- [ ] CHK-081 [P1] Copilot `@path` fallback does not expose file contents beyond sandbox
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-090 [P1] Wave F (R8) docs: retry-budget said to be heuristic, not calibrated
- [ ] CHK-091 [P1] Wave F (R10) docs: caller-context coverage documented for new boundaries
- [ ] CHK-092 [P1] Wave F (R11) docs: readiness contract narrowed to 4 reachable values
- [ ] CHK-093 [P0] 3 changelogs drafted per canonical template: sk-deep-research v1.10.0.0, sk-deep-review v1.7.0.0, system-spec-kit v3.5.0.0
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-100 [P1] No modifications outside scope listed in spec.md §3
- [ ] CHK-101 [P1] Scratch files for 020 only in `020-research-findings-remediation/scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Summary Gate

- [ ] CHK-110 [P0] All P0 items verified with evidence closers
- [ ] CHK-111 [P1] All P1 items verified OR user-approved deferral
- [ ] CHK-112 [P0] 29-of-86 at-risk packet count drops to 0 (post R4+R5)
- [ ] CHK-113 [P0] Commit + push successful

### Counts

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | ~25 | 0 |
| P1 Items | ~20 | 0 |

**Verdict**: [DRAFT → CONDITIONAL → PASS]
<!-- /ANCHOR:summary -->
</content>
</invoke>
