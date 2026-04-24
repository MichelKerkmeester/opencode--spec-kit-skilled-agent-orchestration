# Iteration 30 - traceability - lib

## Dispatcher
- iteration: 30 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:11:50.190Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts
- .opencode/skill/system-spec-kit/scripts/spec/validate.sh

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Cross-anchor contamination is validating against stale route names, not the live 8-category router contract.** `validateCrossAnchorContamination()` still normalizes to legacy labels like `delivery_log`, `decision_log`, and `research_findings`, while the current save pipeline emits `narrative_delivery`, `decision`, and `research_finding`, then passes that raw category into `contaminationPlan.routeCategory`. Result: correct delivery/decision/research saves are reported as contaminated mismatches; under `validate.sh --strict`, those warnings become exit-code-2 failures. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:138-149,809-879`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1529-1533`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:163-171`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1058-1075,1273-1288`; `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:605-748`.

```json
{
  "claim": "The contamination validator has drifted away from the live router vocabulary and now warns on valid narrative_delivery/decision/research_finding routes.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:138-149",
    ".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:809-879",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1529-1533",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:163-171",
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1058-1075",
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288",
    ".opencode/skill/system-spec-kit/scripts/spec/validate.sh:605-748"
  ],
  "counterevidenceSought": "Looked for an adapter that rewrites current route categories into delivery_log/decision_log/research_findings before validation, or tests proving those modern categories pass the contamination rule.",
  "alternativeExplanation": "The validator may have been left on a backward-compatibility shim while the router migrated first, but no shim exists on the live memory-save path.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if another call site canonicalizes routeCategory into the validator's legacy names before CROSS_ANCHOR_CONTAMINATION runs."
}
```

### P2 Findings
- **`level` is a required public input, but this validator never consumes it.** `SpecDocRuleOptions` and the CLI require `level`, and `memory-save` computes/passes packet level into the validator, but none of the rule implementations read it. That leaves level-sensitive routing contracts unchecked here, even though the live router changes `decision` targets/merge modes by packet level. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:55-62,627-736,988-1052`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1518-1520,1572-1579`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1063-1067,1277-1288`.
- **The test surface never exercises the non-progress route categories that the validator is supposed to trace.** `spec-doc-structure.vitest.ts` only probes `CROSS_ANCHOR_CONTAMINATION` with `routeCategory: 'narrative_progress'`, and the Gate D regression test only covers a progress-style merge pass. There is no coverage for `narrative_delivery`, `decision`, `research_finding`, or any level-dependent validator behavior, which is why the route-name drift above can ship unnoticed. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:243-289`; `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts:90-119`.

## Traceability Checks
- **Mismatch found:** the live router contract is the 8-category namespace (`narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, `drop`), but `spec-doc-structure.ts` still validates contamination against an older `delivery_log`/`decision_log`/`research_findings` vocabulary.
- **Mismatch found:** the validator bridge advertises `--level` as required input, and `memory-save` forwards packet level into it, but the TS rule implementation treats `level` as dead metadata instead of enforcing any level-dependent invariants.

## Confirmed-Clean Surfaces
- **POST_SAVE_FINGERPRINT ordering is actually post-promotion.** `atomicIndexMemory()` promotes the pending file before calling `indexPrepared()`, and `memory-save.ts` runs `validateCanonicalPreparedSave()` inside that indexed phase, so the fingerprint rule is checking the already-promoted file rather than a pre-save snapshot. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:326-332`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3006-3031`.
- **MERGE_LEGALITY still enforces the core structural invariants it claims to own.** The rule rejects missing target docs, conflict markers, invalid anchors, incompatible merge-mode/anchor-shape pairings, malformed table-row widths, and missing checklist task IDs. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:635-736`.

## Next Focus
- Check adjacent validation/warning plumbing (`save-quality-gate.ts` and the memory-save response path) to see whether advisory validator drift is being surfaced as operator-visible blocker text elsewhere.
