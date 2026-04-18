---
title: "Implementation Plan: Phase 020 Research-Findings Remediation"
description: "7-wave plan implementing R1-R12 from research.md §10. Atomic-ship groups honored. cli-codex dogfooding pattern per wave."
trigger_phrases: ["020 plan", "phase 020 remediation plan"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-cli-executor-remediation"
    last_updated_at: "2026-04-18T15:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Plan scaffolded"
    next_safe_action: "Begin Wave A"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

# Implementation Plan: Phase 020 Research-Findings Remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Seven waves, each matching an atomic-ship group from `research.md §11`. Waves A-E cover the P0/P1 remediations; Wave F bundles the three P2 smaller slices; Wave G is conditional on Wave A completion. Each wave dispatches via cli-codex (gpt-5.4, reasoning-effort=high, service-tier=fast) following the Phase 018/019 dogfooding pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done per wave

- `tsc --noEmit` clean
- vitest suite green (existing + new)
- Grep verification of expected structural changes
- Changelog entry drafted (global or local depending on impact)

### Definition of Done for packet

- All 12 remediations landed OR user-approved deferral documented
- Integration smoke test: 1-iteration dispatch via each CLI executor produces iteration artifact + JSONL with first-write executor provenance
- Specimen test: 017 packet description.json rich files repair cleanly
- `validate.sh --strict` on 020 exits 0 after implementation-summary lands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Contract-first hardening on shipped infrastructure.** No new capability families. All remediations are contract tightening + edge-case fixes + docs correction on shipped Phase 018/019 surfaces.

### Key changes by module

- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`: gain first-write helper + failure-emitter.
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`: require provenance on non-native; tolerate typed failure events.
- `.opencode/command/spec_kit/assets/spec_kit_deep-*.yaml` (×4): reorder dispatch to write provenance first; add `if_cli_copilot` `@path` fallback branch.
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`: split parse vs schema error; call new merge-preserving repair helper.
- New `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts`: deterministic merge-preserving repair.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`: add `derived.save_lineage` enum.
- Evidence-marker audit parser: indented/nested fence handling.
- Retry-budget module: structured telemetry emit.
- Caller-context tests: async boundary coverage extension.
- SKILL.md + readiness docs: parity fixes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Wave A — Shared Deep-Loop Provenance (R1 + R2)

**Goal**: Non-native executor identity present on FIRST JSONL record. Failure fallback preserves identity.

1. Extend `executor-audit.ts` with `writeFirstRecordExecutor(stateLogPath, executorConfig, iterationNumber)` that ensures the first JSONL write includes executor block.
2. Reorder YAML dispatch: `record_executor_audit` step becomes `pre_dispatch_audit` (before dispatch) for non-native kinds.
3. Keep existing `appendExecutorAuditToLastRecord` as the success-path merge (idempotent if already present).
4. Extend `post-dispatch-validate.ts` to REQUIRE `executor` field on non-native run's first record.
5. Add `emitDispatchFailure(stateLogPath, executorConfig, reason)` helper for crash/timeout/missing-output cases.
6. Update all 4 YAMLs to wire the new pre_dispatch_audit step.
7. Tests: extend `executor-audit.vitest.ts` + `post-dispatch-validate.vitest.ts` + new `dispatch-failure.vitest.ts`.

### Wave B — description.json Repair Safety (R4 + R5)

**Goal**: Schema-invalid but parseable description.json no longer gets its authored content destroyed.

1. Update `generate-description.ts` loader: return discriminated result `{ok: true, data}` | `{ok: false, reason: 'parse_error' | 'schema_error', partial?}`.
2. New module `lib/description/repair.ts`: `mergePreserveRepair(partial, target, canonicalOverrides)` that keeps authored narrative + non-canonical keys; canonical derived fields win.
3. Update generate-description.ts save path: schema_error routes to `mergePreserveRepair`; parse_error still writes minimal replacement (can't preserve what we can't parse).
4. Add specimen test: copy rich 017 packet description.json files into `tests/spec-folder/fixtures/`; assert repair preserves authored keys.
5. Gate stale-file auto-repair: add feature flag `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` (default true once R4 ships).
6. Tests: new `description-repair.vitest.ts` + fixture corpus.

### Wave C — Copilot @path Fallback (R3)

**Goal**: Copilot iterations with oversized prompts use `@path` reference; YAML + matrix tests aligned.

1. Update `if_cli_copilot` YAML branch: detect prompt size; if over threshold (e.g. 16KB), invoke via wrapper prompt `copilot -p "$(cat prompt.md)" ...` → `copilot -p "Read @{prompt.md} and follow its instructions." --model ... --allow-all-tools --no-ask-user`.
2. Mirror across all 4 YAMLs (research auto+confirm, review auto+confirm).
3. Update `cli-matrix.vitest.ts`: add oversized-prompt test case that asserts `@path` invocation.
4. Update Copilot bootstrap docs to resolve the contradictions in `.opencode/skill/cli-copilot/` references.

### Wave D — Metadata Lineage (R6 + R7)

**Goal**: graph-metadata records save-lineage tag; continuity threshold docs normalized.

1. Extend `graph-metadata-schema.ts` `derivedSchema`: add `save_lineage: z.enum(['description_only', 'graph_only', 'same_pass'])` required field.
2. Update `scripts/core/workflow.ts` canonical save path to write the correct lineage tag per branch.
3. Update `scripts/graph/backfill-graph-metadata.ts` to set `save_lineage: 'graph_only'` on existing files during migration.
4. Update continuity-freshness validator doc comment + any user-facing docs to say "one-sided policy budget" explicitly.
5. Add helper `normalizeTimestampPrecision` for date-only values in the validator.
6. Tests: schema test + backfill test + validator doc spot-check.

### Wave E — Evidence-Marker Fence Parser (R9)

**Goal**: Indented fences and nested line-start triple-backtick fences no longer produce false positives. False-negative unclosed-fence cases remain separate regression coverage.

1. Update evidence-marker audit parser: handle indented `    ```lang` fences; track nested fence state for line-start `` ``` `` inside open fence.
2. Add regression fixtures: indented-fence file, nested-fence file, mismatched-fence file (false-negative expectation documented).
3. Update vitest suite.

### Wave F — Smaller Slices Bundle (R8 + R10 + R11)

**Goal**: Three independent smaller slices in one ship.

1. **R8**: Retry-budget module emits structured telemetry `{memoryId, step, reason, attempt, outcome}` on each retry. Keep `MAX_RETRIES = 3`. Update docs to say "heuristic".
2. **R10**: Extend `tests/caller-context.vitest.ts` with committed cases for `setImmediate`, `queueMicrotask`, `timers/promises`.
3. **R11**: Narrow readiness-contract docs in `SKILL.md` to the 4-state reachable subset (`live`, `stale`, `absent`, `unavailable`). Resolve Copilot bootstrap contradictions.

### Wave G — R55-P2-004 YAML Evolution (R12, conditional)

**Goal**: After Waves A-C land, revisit the Phase 017 deferred `R55-P2-004` item if it now couples to shipped provenance work.

1. Audit YAML assets touched by Waves A+C.
2. If R55-P2-004's scope overlaps, merge; otherwise mark "not coupled, remains deferred."

### Wave H — Ship

1. Write changelogs (sk-deep-research v1.10.0.0, sk-deep-review v1.7.0.0, system-spec-kit).
2. Populate implementation-summary.md.
3. Refresh description.json + graph-metadata.json via generate-description.js.
4. `validate.sh` on 020 exits 0 errors.
5. Commit + push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Scope | Wave |
|------|-------|------|
| `executor-audit.vitest.ts` (extended) | First-write + failure-emit paths | A |
| `post-dispatch-validate.vitest.ts` (extended) | Provenance required; failure tolerated | A |
| `dispatch-failure.vitest.ts` (new) | Typed failure events | A |
| `description-repair.vitest.ts` (new) | Merge-preserving repair | B |
| `description-repair-specimens.vitest.ts` (new) | Rich 017 packet fixtures | B |
| `cli-matrix.vitest.ts` (extended) | Copilot `@path` fallback | C |
| `graph-metadata-lineage.vitest.ts` (new) | save_lineage schema | D |
| `continuity-threshold-docs.vitest.ts` (new) | Timestamp normalization | D |
| `evidence-marker-parser.vitest.ts` (extended) | Indented + nested fence | E |
| `retry-budget-telemetry.vitest.ts` (new) | Structured emit | F |
| `caller-context.vitest.ts` (extended) | New async boundaries | F |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact |
|------------|--------|--------|
| Phase 018 executor-selection infrastructure | Shipped | Remediations extend shared modules |
| Phase 019 cli-runtime-matrix | Shipped | Wave C builds on `if_cli_copilot` branch from 019 |
| Research.md synthesis | Committed | Primary spec input |
| Phase 017 retry-budget module | Shipped | Wave F extends telemetry emit |
| generate-description.js entry point | Shipped | Wave B refactors loader result shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Per-wave**: single-commit revert of the wave's PR restores the prior contract.
- **Group A rollback**: un-do reorder in all 4 YAMLs; `appendExecutorAuditToLastRecord` remains available for post-hoc audit.
- **Group C rollback (Wave B)**: gate the new `mergePreserveRepair` behind the feature flag default-false; shipped behavior reverts to minimal replacement.
- **Blast radius per wave**: each wave isolated enough that Wave N rollback doesn't invalidate Waves 1 to N-1.
<!-- /ANCHOR:rollback -->
</content>
</invoke>
