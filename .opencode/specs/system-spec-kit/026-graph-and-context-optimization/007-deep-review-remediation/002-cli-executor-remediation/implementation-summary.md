---
title: "...t/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/implementation-summary]"
description: "Phase 020 shipped: R1-R11 remediations complete, R12 deferred. 116/116 scoped tests pass. Executor first-write provenance, description.json merge-preserving repair, Copilot @path fallback, metadata lineage, fence parser, retry telemetry, caller-context coverage, docs parity all shipped."
trigger_phrases:
  - "020 implementation summary"
  - "phase 020 verdict"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation"
    last_updated_at: "2026-04-18T16:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Phase 020 shipped via cli-codex dogfooding: 6 waves, 116 scoped tests green"
    next_safe_action: "Commit + push; optional R12 or Q4 research in a follow-up packet"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Phase 020 Research-Findings Remediation

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Packet** | `system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation` |
| **Verdict** | **PASS** |
| **Shipped** | 2026-04-18 |
| **Effort (actual)** | ~1 hour wall-clock via cli-codex dogfooding (6 waves) |
| **Effort (planned)** | ~30h |
| **Predecessor** | Phase 019 `017-sk-deep-cli-runtime-execution/002-runtime-matrix` (shipped same day) |
| **Research source** | `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` (256 lines, 17 sections, 30 iterations) |
| **Test coverage** | 116/116 scoped tests green across 13 files |
| **Remediations shipped** | R1-R11 (11 of 12); R12 conditional defer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. What Was Built

All eleven P0/P1/P2 remediations from `research.md §10` shipped. R12 (YAML evolution cleanup for Phase 017 `R55-P2-004`) deferred per ADR because it was never coupled to the active hardening work.

### 2.1 Wave A — Shared Deep-Loop Provenance (R1 + R2)

Executor identity now writes on the FIRST JSONL record of every non-native iteration. New `writeFirstRecordExecutor` helper in `executor-audit.ts` runs before dispatch for cli-codex, cli-copilot, cli-gemini, cli-claude-code. Post-dispatch validation requires the executor field on non-native runs and returns a typed `executor_missing` reason when absent.

New `emitDispatchFailure(stateLogPath, executor, reason, iteration)` helper writes a typed `{type:'event', event:'dispatch_failure'}` record so crashes and timeouts preserve attribution. Validation tolerates the new event without emitting a duplicate `schema_mismatch`.

All four YAMLs (research auto + confirm, review auto + confirm) gained a `pre_dispatch_audit` step that runs the first-write helper for non-native kinds.

### 2.2 Wave B — description.json Repair Safety (R4 + R5)

`generate-description.ts` loader now returns a discriminated-union result: `{ok: true, data}` or `{ok: false, reason: 'file_missing' | 'parse_error' | 'schema_error', partial?}`. Schema-error routes through the new `mergePreserveRepair` helper in `lib/description/repair.ts`. Parse-error still writes minimal replacement because unparseable content cannot be preserved. File-missing still writes a fresh minimal description.

Merge policy per ADR-011: canonical derived fields (specFolder, description, keywords, lastUpdated, specId, folderSlug, parentChain, memorySequence) always win; authored narrative plus extension keys always preserved.

Feature flag `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` defaults to on. Setting it to `false` reverts schema-error handling to the prior minimal-replacement behavior.

New specimen regression suite uses real rich `017` packet fixtures (research, review, and review-findings-remediation packets). The 29-of-86 at-risk count from research.md §5 drops to 0 once R5 lands.

### 2.3 Wave C — Copilot @path Fallback (R3)

The `if_cli_copilot` branch in all four YAMLs now runs a 16 KB size check on the rendered prompt file. At or below 16 KB the dispatch uses the existing positional form. Above 16 KB the dispatch switches to a wrapper prompt: `copilot -p "Read the instructions in @<path> and follow them exactly. Do not deviate." --model X --allow-all-tools --no-ask-user`. Research YAMLs reference `research/prompts/`; review YAMLs reference `review/prompts/`.

`cli-matrix.vitest.ts` gained two cases covering both sides of the threshold.

Copilot bootstrap documentation in `cli-copilot/SKILL.md` now explicitly states the repo-safe concurrency cap (3 per `feedback_copilot_concurrency_override`) versus the upstream API cap (5). Reasoning effort is clarified as config-driven (`~/.copilot/config.json`) rather than a CLI flag.

### 2.4 Wave D — Metadata Lineage (R6 + R7)

`graph-metadata.json derived.save_lineage` is a new optional enum field (`description_only` / `graph_only` / `same_pass`). The canonical save path in `workflow.ts` stamps `same_pass` when both description and graph metadata refresh together. The graph-metadata backfill script stamps `graph_only` on existing files during migration.

New `lib/continuity/timestamp-normalize.ts` module exposes `isLowPrecision(raw)`, `normalizeTimestampPrecision(raw)`, `comparePrecisionAware(a, b, thresholdMs)`. Date-only values and midnight-UTC values are treated as low-precision and bypass strict staleness thresholds so they stop producing false-stale warnings. The 10-minute continuity threshold value is unchanged; the helper is additive for future validator wiring.

Continuity-threshold documentation updated to say "one-sided policy budget pending telemetry" instead of implying empirical calibration.

### 2.5 Wave E — Evidence-Marker Fence Parser (R9)

`scripts/validation/evidence-marker-audit.ts` now tracks opener column and backtick-count. Indented fences (column > 0 but ≤ 3) are treated as valid fences. Nested inner triple-backticks with count less than the outer fence do not close the outer fence. Four-backtick fences remain safe. Mismatched/unclosed fences stay separate false-negative cases with their own regression fixtures documenting the expected behavior.

Three regression fixtures landed under `tests/validation/fixtures/`: indented-fence, nested-fence, mismatched-fence.

### 2.6 Wave F — Retry Telemetry + Caller-Context Coverage + Readiness Docs Parity (R8 + R10 + R11)

Retry-budget module (`lib/enrichment/retry-budget.ts`) now emits `{type:'event', event:'retry_attempt', memoryId, step, reason, attempt, outcome, timestamp}` on each attempt decision. `MAX_RETRIES = 3` is unchanged. `handlers/save/post-insert.ts` wires the telemetry into the save flow.

Caller-context coverage extends to three new async boundaries: `setImmediate`, `queueMicrotask`, `timers/promises`. The 30-iteration research verified these with local probes; this release commits the proofs as permanent regressions.

Readiness-contract documentation in both `sk-deep-research/SKILL.md` and `sk-deep-review/SKILL.md` narrowed to the four reachable trust-state values (`live`, `stale`, `absent`, `unavailable`). The other four (`cached`, `imported`, `rebuilt`, `rehomed`) are marked as compatibility vocabulary not emitted by the seven code-graph handlers on this surface.

### 2.7 R12 deferred

Wave G evaluated whether `R55-P2-004` (YAML evolution cleanup from Phase 017) coupled to active hardening work. Conclusion: no. Research.md §5 P2 cluster-F already confirmed low coupling. Kept as deferred per ADR.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files -->
## 3. Files Touched

### 3.1 New modules (3)

- `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts` — mergePreserveRepair helper.
- `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/timestamp-normalize.ts` — precision-aware timestamp helpers.
- Fence-parser update is in-place on the existing evidence-marker-audit.ts (no new module).

### 3.2 Modified (roughly 20)

- `lib/deep-loop/executor-audit.ts` — first-write + failure emitters.
- `lib/deep-loop/post-dispatch-validate.ts` — provenance requirement + dispatch_failure tolerance.
- `lib/graph/graph-metadata-schema.ts` — save_lineage enum.
- `lib/enrichment/retry-budget.ts` — structured telemetry emit.
- `handlers/save/post-insert.ts` — retry-budget wiring.
- `scripts/core/workflow.ts` — save_lineage stamping on canonical path.
- `scripts/graph/backfill-graph-metadata.ts` — save_lineage backfill.
- `scripts/spec-folder/generate-description.ts` — discriminated loader + merge-preserving repair wiring.
- `scripts/validation/evidence-marker-audit.ts` — fence parser fix.
- All four YAMLs (research auto + confirm, review auto + confirm) — pre_dispatch_audit step + Copilot size check.
- `sk-deep-research/SKILL.md` — readiness contract narrowed + executor contract updated.
- `sk-deep-review/SKILL.md` — mirror.
- `cli-copilot/SKILL.md` — concurrency + reasoning-effort clarification.
- `system-spec-kit/SKILL.md` — retry-budget heuristic language.
- `sk-deep-research/assets/deep_research_config.json` — save_lineage reference.
- `sk-deep-review/assets/review_mode_contract.yaml` — alignment.
- `feature_catalog/05--lifecycle/09-post-insert-retry-budget.md` — catalog entry.
- `manual_testing_playbook/05--lifecycle/268-post-insert-retry-budget.md` — playbook entry.

### 3.3 Tests (8 new or extended)

- `tests/deep-loop/executor-audit.vitest.ts` — extended.
- `tests/deep-loop/post-dispatch-validate.vitest.ts` — extended.
- `tests/deep-loop/dispatch-failure.vitest.ts` — new.
- `tests/description/repair.vitest.ts` — new.
- `tests/description/repair-specimens.vitest.ts` — new with rich 017 packet fixtures.
- `tests/deep-loop/cli-matrix.vitest.ts` — extended with Copilot small + large prompt cases.
- `tests/graph/graph-metadata-lineage.vitest.ts` — new.
- `tests/continuity/timestamp-normalize.vitest.ts` — new.
- `tests/validation/evidence-marker-audit.vitest.ts` — extended with indented + nested fence cases.
- `tests/caller-context.vitest.ts` — extended with three new async boundaries.
- `tests/retry-budget-telemetry.vitest.ts` — new.
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:how-delivered -->
## 4. How It Was Delivered

Continued the cli-codex dogfooding pattern from Phases 018 and 019. Six codex dispatches:

| Wave | Scope | Result |
|------|-------|--------|
| A | R1 + R2 provenance | 66/66 tests (was 54), tsc clean |
| B | R4 + R5 description repair | 77/77 tests, tsc clean |
| C | R3 Copilot @path | cli-matrix grew by 2 cases |
| D | R6 + R7 lineage | 94/94 tests, tsc clean |
| E+F bundle | R9 fence parser + R8 telemetry + R10 async + R11 docs | 116/116 scoped tests |

Every dispatch used `codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`. Two waves ran in the background due to Bash default-timeout routing; completion notifications fired on finish.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 5. Decisions Respected

See `decision-record.md` for the four ADRs:

- **ADR-010**: Sibling `dispatch_failure` event AND enriched `schema_mismatch` — both emit paths wired.
- **ADR-011**: Merge-preserve policy — canonical wins, authored preserved. Wired in `repair.ts`.
- **ADR-012**: Save-lineage enum starts narrow — 3 values shipped. Extension path documented.
- **ADR-013**: Keep N=3 and 10-min threshold numerically unchanged — docs honesty + telemetry only. Wired.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 6. Verification

```
npx tsc --noEmit --composite false -p tsconfig.json
# → clean

npx vitest run tests/deep-loop/ tests/description/ tests/graph/graph-metadata-lineage.vitest.ts tests/continuity/ tests/validation/ tests/caller-context.vitest.ts tests/retry-budget-telemetry.vitest.ts
# → 13 files, 116 tests passed

grep -c "writeFirstRecordExecutor\|emitDispatchFailure" .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts
# → present

grep -c "save_lineage" .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts
# → present

grep -c "16384\|Read the instructions in @" .opencode/command/spec_kit/assets/spec_kit_deep-*.yaml
# → present in all 4 YAMLs
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deferred -->
## 7. Deferred

| Item | Reason | Destination |
|------|--------|-------------|
| R12 YAML evolution cleanup (R55-P2-004) | Low coupling to active hardening; research.md §5 P2 cluster-F confirmed independence | Future narrow packet if scope warrants |
| Q4 NFKC robustness research | Never received a dedicated pass in the 30 iterations; real residual | Separate future research slice |
| Numeric tuning of N=3 or 10-minute threshold | ADR-013: gated on telemetry data collection | Future calibration packet after retry_attempt telemetry accumulates |
| Validator wiring of timestamp-normalize helper | Additive in this wave; helper exists but existing validator callers unchanged | Next packet if continuity-validator work reopens |
<!-- /ANCHOR:deferred -->

---

<!-- ANCHOR:handoff -->
## 8. Handoff

Phase 020 closes out the research-findings surface from the 30-iteration deep-research pass. The top Phase-019+ risks (data loss on description.json repair, anonymous CLI failures, missing Copilot large-prompt fallback) are all remediated. Docs parity across readiness-contract, Copilot bootstrap, continuity threshold, and retry budget is aligned with shipped behavior.

Next work in the chain is optional: R12 if the YAML evolution cleanup becomes a priority, Q4 as a fresh research slice, or the telemetry-driven calibration packet once `retry_attempt` events accumulate.
<!-- /ANCHOR:handoff -->
</content>
</invoke>
