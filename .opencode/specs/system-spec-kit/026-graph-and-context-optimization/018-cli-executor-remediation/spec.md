---
title: "Feature Specification: Phase 020 Research-Findings Remediation"
description: "Remediates the 12 prioritized findings (R1-R12) from the Phase 018 deep-loop-cli-executor research pass. Highest-leverage slice: shared deep-loop executor provenance (R1-R2), description.json repair safety (R4-R5), Copilot @path fallback (R3), metadata lineage (R6-R7), evidence-marker fence parser (R9), retry-budget + caller-context + docs parity smaller slices."
trigger_phrases: ["phase 020 remediation", "020 research findings", "deep-loop hardening", "description.json repair safety", "executor provenance first-write"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-cli-executor-remediation"
    last_updated_at: "2026-04-18T15:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Packet scaffolded from research.md synthesis"
    next_safe_action: "Approve spec; begin Wave A (R1+R2 shared deep-loop provenance)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Phase 020 Research-Findings Remediation

---

## EXECUTIVE SUMMARY

Remediates the 12 prioritized findings surfaced by the 30-iteration deep-research pass in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-pt-01/research.md`. Seven P1 findings plus five P2 findings span five atomic-ship groups. Highest-leverage slice is shared deep-loop executor provenance (R1-R2), followed by description.json repair safety (R4-R5), then Copilot `@path` fallback (R3), metadata lineage (R6-R7), and the evidence-marker fence parser (R9). Three smaller slices (R8 telemetry prep, R10 caller-context coverage, R11 docs parity) ship independently. Phase 017 parking-lot R55-P2-004 is the only adjacent cleanup worth bundling (R12).

**Key Decisions**: Wave structure follows the atomic-ship groups from research.md §11. Contract-first provenance (R1) precedes executor-specific hardening. Description repair safety (R4-R5) is independent from provenance and ships in parallel.

**Critical Dependencies**: Phase 018 + 019 shipped executor matrix. Phase 017 shipped continuity validator, retry budget, readiness-contract. None of the R# remediations introduce a new capability family — all harden existing surfaces.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (provenance + description safety are data-loss risks) |
| **Status** | Spec Ready |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` |
| **Immediate Predecessor** | `017-sk-deep-cli-runtime-execution/002-runtime-matrix/` (shipped 2026-04-18) |
| **Research Source** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-sk-deep-cli-runtime-execution-pt-01/research.md` (256 lines, 17 sections, 30 iterations) |
| **Effort Estimate** | ~30h total across 7 waves via cli-codex dogfooding pattern |
| **Wave Structure** | Wave A (R1+R2) → Wave B (R4+R5) → Wave C (R3) → Wave D (R6+R7) → Wave E (R9) → Wave F (R8+R10+R11 bundled) → Wave G (R12 deferrable) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research.md synthesis concluded that seven P1 findings plus five P2 findings remain on the deep-loop + metadata + validator surface after Phase 018/019 shipped executor selection. The headline risks are data-loss (description.json destructive regen affecting 29 of 86 packet files in the 026 tree) and auditability gaps (non-native executor provenance is optional, post-hoc, and failure-blind). Secondary risks include parity drift (Copilot `@path` fallback documented but not implemented), policy-as-measurement confusion (10-minute continuity threshold + N=3 retry budget both heuristic without telemetry), and validator edge cases (indented and nested fence handling in the evidence-marker parser).

### Purpose

Implement R1-R12 as sequenced waves per research.md §10 and §11 atomic-ship groups. Preserve every invariant shipped by Phase 018/019 (executor-selection dispatch contract, YAML-owned state, reducer exclusivity). Keep the retry-budget and continuity-threshold numeric values unchanged for this packet — the fix is documentation honesty + telemetry groundwork, not a numeric tuning attempt without data.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R1**: Non-native `executor` provenance appended on the first JSONL write, not the last.
- **R2**: Shared typed failure event (`dispatch_failure` or enriched `schema_mismatch`) that preserves executor identity when no valid iteration record exists.
- **R3**: Copilot `@path` large-prompt fallback in all 4 YAML branches + matrix test coverage.
- **R4**: Split `parse_error` from `schema_error` in the description.json loader. Add merge-preserving repair helper for parseable schema-invalid files.
- **R5**: Specimen-based regression tests using rich 017 packet files. Gate `generate-description.js` stale-file auto-repair on R4 completion.
- **R6**: Save-lineage tag added to graph-metadata.json `derived.*` so freshness claims stop depending on timestamp subtraction alone.
- **R7**: Normalize continuity threshold docs to one-sided heuristic language. Normalize date-only timestamps. Defer numeric tuning until telemetry lands.
- **R8**: Structured retry telemetry (attempt/outcome/reason/memoryId/step). Keep `MAX_RETRIES = 3`. Update docs to say heuristic, not calibrated.
- **R9**: Fix indented-fence and nested-fence handling in evidence-marker audit parser. Add regressions separating false-positive fences from false-negative unclosed fences.
- **R10**: Committed vitest coverage for `setImmediate`, `queueMicrotask`, `timers/promises` async boundaries on caller-context.
- **R11**: Narrow readiness docs to reachable 4-state subset. Fix Copilot bootstrap doc contradictions.
- **R12**: Revisit R55-P2-004 (YAML evolution cleanup) — AFTER R1-R3 ship.

### Out of Scope

- **Numeric tuning of `MAX_RETRIES` or the 10-minute continuity threshold.** Data-driven tuning is a separate future packet gated on R8 telemetry.
- **Q4 NFKC robustness research.** Research.md §13 flagged this as residual; it stays a future research slice, not an implementation remediation.
- **New executor kinds.** Cli-copilot/gemini/claude-code are already wired in Phase 019. Scope stays within existing 5-kind matrix.
- **`R55-P2-002` and `R55-P2-003`** from Phase 017 parking lot. Research.md §5 P2 confirmed they don't couple to active work.
- **Off-repo telemetry infrastructure.** R8 adds the signals at the emission site; analyzing them later is separate work.
- **Runtime recursion detection for cross-CLI delegation.** Phase 019 ADR-007 kept this as docs-only. No change.

### Files to Change (core remediations)

| Remediation | Primary files | Action |
|------------|---------------|--------|
| R1, R2 | `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`, `spec_kit_deep-review_{auto,confirm}.yaml`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`, `post-dispatch-validate.ts`; prompt-pack templates | Modify |
| R3 | Same 4 YAMLs + prompt-pack templates + `tests/deep-loop/cli-matrix.vitest.ts` | Modify |
| R4 | `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`; new `description-repair.ts` module; new tests | Modify + Create |
| R5 | New `tests/spec-folder/description-repair-specimens.vitest.ts` + fixtures | Create |
| R6 | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`; canonical save path writer; graph-metadata backfill script | Modify |
| R7 | Continuity validator docs + low-precision timestamp normalization helper | Modify |
| R8 | Retry-budget module: structured emit; docs update | Modify |
| R9 | Evidence-marker audit parser + tests | Modify |
| R10 | `tests/caller-context.vitest.ts` (extend) | Modify |
| R11 | Readiness-contract docs + Copilot bootstrap docs + SKILL.md entries | Modify |
| R12 | YAML evolution docs (R55-P2-004 scope) | Modify (conditional on R1-R3) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-R1 | Executor identity written on first JSONL record of every non-native iteration | Unit test + integration test: inspect iteration-NNN JSONL record line 1 → `executor.{kind,model,reasoningEffort,serviceTier}` present |
| REQ-R2 | Failure fallback preserves executor identity | Mock codex crash mid-iteration → conflict event + executor provenance present in the emitted record |
| REQ-R4 | description.json loader distinguishes parse-error vs schema-error | Unit test: malformed JSON → parse_error; valid JSON failing schema → schema_error |
| REQ-R5 | Merge-preserving repair keeps authored narrative on schema-invalid files | Specimen test with rich 017 packet file → repair result retains authored summary + non-canonical keys |

### P1 - Required

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-R3 | Copilot `@path` fallback ships in all 4 YAML branches + matrix tests | Grep + vitest: 4 YAMLs have `@path` branch; cli-matrix test covers oversized prompt path |
| REQ-R6 | graph-metadata.json records save-lineage tag (`description_only` / `graph_only` / `same_pass`) | Schema test: tag is required and enum-validated |
| REQ-R7 | Continuity threshold docs match one-sided semantics; low-precision timestamps normalized | Docs grep + unit test: date-only values no longer false-stale |
| REQ-R8 | Retry-budget emits structured telemetry (attempt/outcome/reason/memoryId/step) | Unit test: emit signature matches; no behavior change to N=3 |
| REQ-R9 | Evidence-marker parser handles indented fences + nested line-start backticks | Unit test: both cases stop producing false positives without regressing mismatched-fence detection |
| REQ-R10 | Caller-context coverage extended to `setImmediate`, `queueMicrotask`, `timers/promises` | Committed vitest cases |
| REQ-R11 | Readiness docs narrow to 4-state subset; Copilot bootstrap docs consistent | Docs review; DQI ≥ 0.85 |

### P2 - Optional

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-R12 | `R55-P2-004` (YAML evolution scope) addressed after R1-R3 land | Conditional on R1-R3 verification |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Every non-native iteration has executor identity attached on its first JSONL record.
- **SC-002**: Crashed or malformed iterations still emit an executor-attributed conflict event.
- **SC-003**: description.json repair preserves authored rich content for all parseable schema-invalid inputs.
- **SC-004**: The 29-of-86 at-risk packet count from research.md §5 P1 finding #3 drops to 0 after R4+R5 land.
- **SC-005**: Copilot `@path` fallback is exercised by cli-matrix test and grep shows presence in all 4 YAML branches.
- **SC-006**: All waves pass `tsc --noEmit` clean, full vitest suite green, `validate.sh --strict` on 020 exits 0 after implementation-summary lands.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R1 first-write reordering breaks reducer | High | Preserve record schema; audit-field append becomes merge-if-present |
| Risk | R4 parse/schema split changes historical load behavior | Med | Feature-flag the new branch; existing callers opt in |
| Risk | R5 specimen tests become flaky | Low | Pin specimens to committed fixture files |
| Risk | R6 new lineage tag breaks graph-metadata parsers | Med | Schema migration marker; tolerant deserialization |
| Risk | R9 parser changes regress existing evidence-marker tests | Med | Add regression tests before parser change |
| Dependency | Phase 018/019 shared modules | — | Consumed unchanged; wave edits extend shared surface |
| Dependency | generate-description.js currently auto-runs on save | High | R5 MUST gate stale-file auto-repair until R4 ships |
<!-- /ANCHOR:risks -->

---

## 7. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 12 remediations, ~30 files, ~800-1200 LOC estimated |
| Risk | 16/25 | Data-loss + provenance are correctness-sensitive |
| Research | 4/20 | Research.md already provides the analysis |
| Multi-Agent | 6/15 | cli-codex dogfooding per wave, sequential |
| Coordination | 10/15 | 5 atomic-ship groups + 7 waves + downstream deps |
| **Total** | **58/100** | **Level 3** |

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- **Q-001**: `schema_mismatch` enrichment vs new `dispatch_failure` sibling event for R2? (Research.md §13.) Current spec: enrich `schema_mismatch` with `executor` field; add `dispatch_failure` only if the enrichment proves insufficient.
- **Q-002**: R4 merge policy when authored rich content conflicts with a canonical derived field? Current spec: canonical derived fields always win; authored narrative + extension keys preserved.
- **Q-003**: R6 lineage tag values — just `description_only` / `graph_only` / `same_pass`, or a richer enum with `backfill` / `migration` / `restore`? Current spec: start with the 3-value set; extend if telemetry shows need.
- **Q-004**: R12 timing — same packet or separate? Current spec: include as conditional Wave G; skip if R1-R3 verification reveals unexpected blockers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research source**: `research/017-sk-deep-cli-runtime-execution-pt-01/research.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **ADRs**: `decision-record.md`
</content>
</invoke>
