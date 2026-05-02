---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 004 Validation And Memory Remediation [template:level_2/implementation-summary.md]"
description: "Thirteen surgical edits across the advisor, memory parser, causal-links processor, checkpoint storage, search-results formatter, and three shell rules close findings F-005-A5-01..06, F-008-B3-01..02, and F-009-B4-01..05. Adds zod schemas where generic JSON parses bypassed validation; reuses the markdown anchor parser inside shell rules; gates insert-counter on real return shape."
trigger_phrases:
  - "F-005-A5"
  - "F-008-B3"
  - "F-009-B4"
  - "004 validation and memory summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/004-validation-and-memory"
    last_updated_at: "2026-05-01T08:25:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "13 fixes applied; tests + stress green"
    next_safe_action: "Commit + push to origin main"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh"
      - ".opencode/skill/system-spec-kit/scripts/lib/check-priority-helper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-004-validation-and-memory"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-validation-and-memory |
| **Completed** | 2026-05-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Thirteen surgical fixes across the advisor schemas, memory parser, causal-links processor, checkpoint snapshot restore, search-results formatter, and three spec-validation shell rules close out the validation-and-memory subsystem findings from packet 046's deep research. The fixes share a common direction: replace generic-parse code paths with typed schemas, reuse existing parsers instead of re-implementing them inline, and tighten counters and validators so they fail loudly on drift instead of silently masking it.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-005-A5-01 (P1) | `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` + `handlers/advisor-recommend.ts` + `handlers/advisor-validate.ts` | Added `boundWorkspaceRoot` allowlist refinement to `AdvisorRecommendInputSchema` and `AdvisorValidateInputSchema`. Both handlers now `realpathSync.native` the `resolve()`'d path and re-validate against repo root + `os.tmpdir()` allowlist. Test fixtures using `os.tmpdir()` workspaces remain valid; arbitrary `/etc`, sibling-user homedirs, etc. get rejected with a `ZodError` at handler entry. |
| F-005-A5-02 (P1) | `mcp_server/skill_advisor/handlers/advisor-validate.ts` | Added `CorpusRowSchema` and `RegressionCaseSchema` zod schemas. `loadCorpus()` and `loadRegressionCases()` now run each parsed line through the schema and emit `Error("Corpus row N: <message>")` on the first violation, surfacing exactly which JSONL line drifted. |
| F-005-A5-03 (P2) | `mcp_server/skill_advisor/handlers/advisor-validate.ts` | Added `PythonTopSkillsSchema = z.array(z.string().nullable())`. `runPythonTopSkills()` validates the parsed stdout against the schema, then asserts the returned length equals `rows.length` before returning. Any drift in the Python script's output shape now surfaces immediately. |
| F-005-A5-04 (P2) | `mcp_server/formatters/search-results.ts` | Replaced `safeJsonParse<string[]>(rawResult.triggerPhrases as string, [])` with a typed `parseTriggerPhrases` that asserts every parsed element is a string and returns `[]` on validation failure. The fallback semantics are preserved for callers; element-shape drift is now caught. |
| F-005-A5-05 (P2) | `mcp_server/lib/parsing/memory-parser.ts` | `parseDescriptionMetadataContent()` runs the parsed object through `perFolderDescriptionSchema.safeParse` (already in `lib/description/description-schema.ts`). Validation failures emit a path-aware error message including `filePath`, replacing the per-field defensive coercions inline. |
| F-005-A5-06 (P2) | `mcp_server/lib/storage/checkpoints.ts` | Added `CheckpointSnapshotSchema` covering memory_index rows, edge ids, and ancillary tables. `restoreCheckpoint()` parses with `safeParse` and routes malformed rows into `result.errors` as `Malformed snapshot row N: <reason>` instead of propagating untyped data into `getMemoryIds()` and the INSERT loops. |
| F-008-B3-01 (P1) | `mcp_server/lib/parsing/memory-parser.ts` | `extractCausalLinks()` regex widened to `(?:^|\\n)\\s*(causalLinks\|causal_links):` (case-insensitive). Both casings now produce identical `CausalLinks` outputs, aligned with the `causal_links` token already used elsewhere in the parser ecosystem. |
| F-008-B3-02 (P1) | `mcp_server/handlers/causal-links-processor.ts` | `processCausalLinks()` now gates `result.inserted` on `causalEdges.insertEdge` returning a real (non-null) row id. When null is returned, the processor pushes `{ type, reference, error: "edge insert returned null (skipped)" }` into `result.errors`, preserving auditability of skipped reasons. |
| F-009-B4-01 (P1) | `scripts/rules/check-spec-doc-integrity.sh` | `extract_markdown_link_targets` now captures three additional formats: angle-bracket relative `.md` links (`<./path.md>`), reference-style definitions (`[label]: ./path.md`), and shortcut reference link references (`[label][ref]`). The awk fence-skip and the existing inline-parenthesized capture remain unchanged. |
| F-009-B4-02 (P1) | `scripts/rules/check-evidence.sh` | Removed the same-line second-checkbox heuristic (`\[[xX]\].*\[[xX]\]` no longer counts as evidence). Strict semantic markers required: `[EVIDENCE: ...]`, `(verified)`, `(tested)`, `(confirmed)`, unicode marks, `[DEFERRED: ...]`, and `\| Evidence:`. |
| F-009-B4-03 (P2) | `scripts/rules/check-evidence.sh` + `scripts/lib/check-priority-helper.sh` (new) | Extracted priority-section detection into a sourced helper at `scripts/lib/check-priority-helper.sh`. Both `check-evidence.sh` and the priority-tag rule (existing infrastructure already had inline parsing) now source the same helper, eliminating duplicate regex maintenance. |
| F-009-B4-04 (P1) | `scripts/rules/check-template-headers.sh` | The wrapper now preserves `extra_header` results from the helper script. Headers occurring AFTER the last matched required header continue to be valid extensions; headers occurring BEFORE the last matched required header are reported as `mid_document_extra_header` warnings with positional context. Document position is computed by the order in which the helper emits header lines vs. the order of the required-header sequence. |
| F-009-B4-05 (P2) | `scripts/rules/check-template-headers.sh` | Bare-priority and CHK regexes updated to match `\[[xX ]\]` (interchangeable lowercase + uppercase) so checklists using `[X]` (e.g. exported from external tools) no longer false-positive as missing-CHK errors. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Modified | F-005-A5-01: bound workspaceRoot allowlist refinement |
| `mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Modified | F-005-A5-01: realpath + allowlist re-validation at handler entry |
| `mcp_server/skill_advisor/handlers/advisor-validate.ts` | Modified | F-005-A5-01, F-005-A5-02, F-005-A5-03 |
| `mcp_server/formatters/search-results.ts` | Modified | F-005-A5-04: typed string[] validator for triggerPhrases |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | F-005-A5-05 (description schema) + F-008-B3-01 (snake_case causal links) |
| `mcp_server/lib/storage/checkpoints.ts` | Modified | F-005-A5-06: snapshot zod schema + quarantine |
| `mcp_server/handlers/causal-links-processor.ts` | Modified | F-008-B3-02: gate inserted on real return id |
| `scripts/rules/check-spec-doc-integrity.sh` | Modified | F-009-B4-01: 3-format link extraction |
| `scripts/rules/check-evidence.sh` | Modified | F-009-B4-02 + F-009-B4-03 |
| `scripts/rules/check-template-headers.sh` | Modified | F-009-B4-04 + F-009-B4-05 |
| `scripts/lib/check-priority-helper.sh` | Created | F-009-B4-03: shared sourced priority helper |
| `mcp_server/skill_advisor/schemas/__tests__/advisor-tool-schemas.vitest.ts` | Created | F-005-A5-01 zod validation |
| `mcp_server/skill_advisor/handlers/__tests__/advisor-validate-shapes.vitest.ts` | Created | F-005-A5-02 + F-005-A5-03 |
| `mcp_server/formatters/__tests__/search-results-trigger-phrases.vitest.ts` | Created | F-005-A5-04 |
| `mcp_server/tests/memory-parser-description-schema.vitest.ts` | Created | F-005-A5-05 |
| `mcp_server/tests/memory-parser-causal-links-snake-case.vitest.ts` | Created | F-008-B3-01 |
| `mcp_server/tests/causal-links-processor-null-insert.vitest.ts` | Created | F-008-B3-02 |
| `mcp_server/tests/checkpoints-restore-snapshot-schema.vitest.ts` | Created | F-005-A5-06 |
| `scripts/test-fixtures/064-link-formats/` | Created | F-009-B4-01 |
| `scripts/test-fixtures/065-evidence-strict-marker/` | Created | F-009-B4-02 |
| `scripts/test-fixtures/066-template-header-drift-mid/` | Created | F-009-B4-04 |
| `scripts/test-fixtures/067-checklist-uppercase-x/` | Created | F-009-B4-05 |
| Spec docs (this packet) | Created/Modified | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each cited finding from packet 046's research.md §5/§8/§9 and confirmed the line ranges in the live files before authoring spec.md. Each fix is the smallest doc-or-code change that resolves the specific bug the finding flagged. Every product code edit carries an inline `// F-NNN-XX-NN:` (TS) or `# F-NNN-XX-NN:` (shell) marker so the next reader can trace the change back to its source finding.

For the TS schema/parser changes I added vitest cases under the existing test trees so the validation behaviors are pinned by tests. For shell-rule changes I added new test fixtures under `scripts/test-fixtures/` covering the previously-uncovered edge cases (angle-bracket links, strict semantic markers, mid-doc header drift, uppercase X). The full validate-against-all-fixtures sweep confirms no existing fixture regresses.

`npm run stress` confirms the 56-file / 163-test baseline is preserved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Allow `os.tmpdir()` in workspaceRoot allowlist alongside repo root | Existing test fixtures explicitly use `mkdtempSync` workspaces under `os.tmpdir()`. Rejecting them would break the existing test suite without security benefit. |
| Widen causal-links regex rather than introduce a YAML library | A regex change keeps the parser surface area unchanged; introducing js-yaml is out of scope per F-008 deferred-architecture note. |
| Strict semantic-marker evidence (drop same-line second checkbox) | The same-line heuristic produced false positives on multi-task lines and didn't enforce evidence quality. Strict markers force authors to cite. |
| Mid-doc extra headers as warning, not error | Hard-erroring on mid-doc drift would block legitimate packet extensions while authors are mid-edit. Warning preserves the signal without blocking. |
| Quarantine malformed checkpoint rows in `result.errors` rather than throw | Restore should be best-effort: surface what was rejected without losing the rest of the snapshot. |
| Use inline finding-ID markers for traceability | Markers don't render in skill briefs, don't affect skill-advisor scoring, and survive future edits. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | 9 product code files + 1 new shared helper + 4 new fixtures + 7 new test files + this packet's spec docs |
| `validate.sh --strict` (this packet) | Errors: 0, Warnings: 4 (warn-only, parity with the 010 pilot which committed at Errors: 0, Warnings: 5) |
| `npm run stress` | 58 files / 195 tests / exit 0 (>= 56-file / 163-test baseline) |
| Targeted vitest (7 new files) | 55/55 tests passed across 7 files |
| Existing advisor handler tests | 41/41 passed (advisor-recommend, advisor-validate, advisor-status, advisor-recommend-unavailable, advisor-tool-schemas) |
| Existing memory-parser tests | 47/47 passed (memory-parser-extended + 2 new) |
| Existing causal-edges + checkpoints tests | 190/190 passed (causal-edges-unit, causal-edges, causal-links-processor-null-insert, checkpoints-restore-snapshot-schema) |
| Existing checkpoint + search-results consumers | 73/73 passed (checkpoint-* + anchor-prefix-matching + empty-result-recovery) |
| All existing 62 fixtures still pass | Zero regressions vs PRE baseline (PRE/POST diff shows ONLY the 4 new fixtures 064-067 added) |
| Inline finding markers present | 13 markers found, one per finding (verified via `grep F-005-A5 / F-008-B3 / F-009-B4`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Causal-links YAML parser is still regex-based.** F-008-B3-01 widens the block matcher to accept both casings; a full migration to a YAML library is deferred to a follow-on packet (research.md §15 strategic question 2). The widening fix is identical-shape on existing camelCase callers.
2. **Workspace-root allowlist is repo-root + `os.tmpdir()` only.** Callers running advisor handlers from outside both prefixes will need the allowlist extended explicitly. This is intentional — the 046 finding flagged unbounded acceptance, not specific other prefixes.
3. **Mid-doc extra-header warning is positional, not semantic.** The classifier uses ordering against the helper's emitted required-header sequence. A future enhancement could classify by template-header role; out of scope here.
4. **Checkpoint snapshot schema covers row shapes, not full referential consistency.** Edge rows that point to memory ids missing from the snapshot are still resolved at insert time, not validation time.
<!-- /ANCHOR:limitations -->
