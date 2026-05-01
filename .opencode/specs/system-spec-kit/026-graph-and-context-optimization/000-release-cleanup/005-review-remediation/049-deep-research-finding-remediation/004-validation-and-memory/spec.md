---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 004 Validation And Memory Remediation [template:level_2/spec.md]"
description: "Closes 13 findings F-005-A5-01..06, F-008-B3-01..02, and F-009-B4-01..05 from packet 046. Tightens advisor schema validation, memory-parser causal-link extraction, causal-links insert accounting, description.json parsing, checkpoint snapshot restore, and four spec-validation shell rules. Adds typed schemas where generic JSON parses bypassed validation, and reuses the markdown anchor parser in shell rules so reference-link, evidence, and template-header checks share one truth."
trigger_phrases:
  - "F-005-A5"
  - "F-008-B3"
  - "F-009-B4"
  - "validation and memory remediation"
  - "advisor schema bounding"
  - "causal links parser"
  - "check-spec-doc-integrity"
  - "check-evidence rule"
  - "check-template-headers"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/004-validation-and-memory"
    last_updated_at: "2026-05-01T08:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored from worked-pilot 010 template"
    next_safe_action: "Author plan/tasks/checklist; then apply 13 surgical fixes in target files"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-004-validation-and-memory"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: 004 Validation And Memory Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (8 findings) + P2 (5 findings) |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 10 |
| **Predecessor** | 003-advisor-quality |
| **Successor** | 005-resource-leaks-silent-errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Thirteen validators and parsers across the advisor, memory, and spec-validation subsystems leak loose-typing, generic-parse, and false-positive bugs identified by packet 046's deep research:

- Advisor `workspaceRoot` flows from runtime input through `resolve()` without realpath canonicalization or allowlist bounding (F-005-A5-01).
- `advisor_validate` loads JSONL corpus and regression rows with bare `JSON.parse` and no per-row schema (F-005-A5-02), and its Python parity stdout is parsed as `unknown[]` without length or string-or-null shape validation (F-005-A5-03).
- The search-results formatter falls back to a generic `safeJsonParse<string[]>` for `triggerPhrases` without runtime element validation (F-005-A5-04).
- The memory parser hand-rolls `description.json` parsing instead of reusing `perFolderDescriptionSchema`, dropping path-aware error messages (F-005-A5-05).
- Checkpoint restore deserializes the gzipped snapshot blob with a single `JSON.parse(...) as CheckpointSnapshot` cast — malformed rows propagate into restore loops (F-005-A5-06).
- The causal-link YAML extractor only matches the camelCase token `causalLinks:` even though the rest of the parser ecosystem normalizes both `causal_links` and `causalLinks` (F-008-B3-01), and the insert-edge processor increments `inserted` even when the underlying edge insert returns null/throws — masking skipped reasons (F-008-B3-02).
- Four shell rules used by `validate.sh` mishandle markdown-aware constructs: `check-spec-doc-integrity.sh` strips angle-bracket and reference-style links (F-009-B4-01); `check-evidence.sh` treats any second checkbox on the same line as evidence and re-implements priority parsing inline rather than sharing the existing helper (F-009-B4-02, F-009-B4-03); and `check-template-headers.sh` discards mid-document extra-header drift and only matches lowercase `[x]` checkboxes (F-009-B4-04, F-009-B4-05).

### Purpose
Close all thirteen findings with surgical changes that keep behavior backward-compatible, preserve the 56-file / 163-test stress baseline, and emit clearer error messages when input drifts. Add zod schemas where they're missing, reuse the existing markdown anchor parser inside shell rules where one already exists, and gate insert-counter increments on the actual return shape of the storage layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Thirteen surgical product-code/shell-rule fixes, one per finding F-005-A5-01..06, F-008-B3-01..02, F-009-B4-01..05.
- New vitest cases for every TS/JS schema-or-parser change.
- Test fixtures under `scripts/test-fixtures/` for each new shell-rule edge case.
- Strict validation pass on this packet.
- One commit pushed to `origin main`.

### Out of Scope
- Refactoring `advisor-validate.ts` away from the inline Python `spawnSync` call (the parity check stays; only its stdout shape gets validated).
- Replacing the YAML matchers in `extractCausalLinks` with a full YAML library — the fix only widens the regex to accept both `causalLinks:` and `causal_links:` and centralizes parsing inside the existing helper.
- Bringing in a new markdown library; F-009-B4-01 uses an extended awk/regex that handles all three link formats described in the constraint.
- Behavioral changes to checkpoint-restore beyond rejecting malformed rows — failing closed with a quarantine bucket, not a redesign.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Modify | F-005-A5-01: add `boundWorkspaceRoot` validator that the schema references via `.refine()` so caller-supplied paths must resolve under repo root or `os.tmpdir()`. |
| `mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Modify | F-005-A5-01 (call site): canonicalize the resolved workspaceRoot via `realpathSync.native` and re-validate against allowlist before use. |
| `mcp_server/skill_advisor/handlers/advisor-validate.ts` | Modify | F-005-A5-01 (call site, same shape as recommend); F-005-A5-02: add `CorpusRowSchema` and `RegressionCaseSchema` zod schemas applied per-line in `loadCorpus`/`loadRegressionCases` with line-numbered errors; F-005-A5-03: add `PythonTopSkillsSchema = z.array(z.string().nullable())` and validate stdout shape and length against `rows.length`. |
| `mcp_server/formatters/search-results.ts` | Modify | F-005-A5-04: replace generic `safeJsonParse<string[]>(...)` with a typed validator that asserts every element is a string. |
| `mcp_server/lib/parsing/memory-parser.ts` | Modify | F-005-A5-05: parse `description.json` content via `perFolderDescriptionSchema.safeParse` and surface `filePath`-aware error messages. F-008-B3-01: widen the causal-link block matcher to accept both `causalLinks:` and `causal_links:` and centralize on a shared YAML extraction helper. |
| `mcp_server/lib/storage/checkpoints.ts` | Modify | F-005-A5-06: define `CheckpointSnapshotSchema` and validate the parsed snapshot before restore; quarantine malformed rows in `result.errors` rather than propagating them. |
| `mcp_server/handlers/causal-links-processor.ts` | Modify | F-008-B3-02: only increment `result.inserted` after `causalEdges.insertEdge` returns a real row id; record skipped reasons in `result.errors` when null is returned. |
| `scripts/rules/check-spec-doc-integrity.sh` | Modify | F-009-B4-01: extend `extract_markdown_link_targets` to also capture angle-bracket links (`<https://...>` style is excluded by purpose, but `<./relative.md>` IS captured), reference-style targets `[label]: ./path.md`, and shortcut reference links `[label][ref]`. |
| `scripts/rules/check-evidence.sh` | Modify | F-009-B4-02: replace the same-line-second-checkbox heuristic with a strict semantic-marker requirement (`[EVIDENCE: ...]`, `(verified)`, `(tested)`, `(confirmed)`, unicode marks, and `[DEFERRED: ...]`). F-009-B4-03: extract priority parsing into a sourced helper shared with the priority-tag rule. |
| `scripts/rules/check-template-headers.sh` | Modify | F-009-B4-04: preserve helper `extra_header` results and classify by document position so middle-of-document drift surfaces as a warning. F-009-B4-05: match `[x]`/`[X]` interchangeably in the bare-priority and CHK regexes. |
| `scripts/lib/check-priority-helper.sh` | Create | New shared sourced helper for priority parsing reused by check-evidence + the existing priority-tag rule. |
| `scripts/test-fixtures/064-link-formats/` | Create | New fixture exercising angle-bracket and reference-style markdown links for F-009-B4-01. |
| `scripts/test-fixtures/065-evidence-strict-marker/` | Create | New fixture exercising the strict-marker evidence rule (no longer accepting bare second checkbox) for F-009-B4-02. |
| `scripts/test-fixtures/066-template-header-drift-mid/` | Create | New fixture exercising mid-document header drift for F-009-B4-04. |
| `scripts/test-fixtures/067-checklist-uppercase-x/` | Create | New fixture using `[X]` checkbox for F-009-B4-05. |
| `mcp_server/skill_advisor/schemas/__tests__/advisor-tool-schemas.vitest.ts` | Create | F-005-A5-01 zod validation. |
| `mcp_server/skill_advisor/handlers/__tests__/advisor-validate-shapes.vitest.ts` | Create | F-005-A5-02, F-005-A5-03. |
| `mcp_server/formatters/__tests__/search-results-trigger-phrases.vitest.ts` | Create | F-005-A5-04. |
| `mcp_server/tests/memory-parser-description-schema.vitest.ts` | Create | F-005-A5-05. |
| `mcp_server/tests/memory-parser-causal-links-snake-case.vitest.ts` | Create | F-008-B3-01. |
| `mcp_server/tests/causal-links-processor-null-insert.vitest.ts` | Create | F-008-B3-02. |
| `mcp_server/tests/checkpoints-restore-snapshot-schema.vitest.ts` | Create | F-005-A5-06. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1 (F-005-A5-01): `AdvisorRecommendInputSchema.workspaceRoot` and `AdvisorValidateInputSchema.workspaceRoot` MUST resolve+realpath their input and reject paths outside the repo root or `os.tmpdir()` allowlist. Test-fixture workspaces under repo root or `os.tmpdir()` continue to work; arbitrary `/etc`, `/home/other-user`, etc. produce a `ZodError` at handler entry.
- FR-2 (F-005-A5-02): `loadCorpus()` and `loadRegressionCases()` validate each parsed JSONL row against a zod schema and emit line-numbered errors when validation fails. Malformed corpus halts validation immediately with `Error("Corpus row N: ...")`.
- FR-3 (F-005-A5-03): `runPythonTopSkills()` parses Python stdout with `z.array(z.string().nullable()).length(rows.length)` and throws a clear error when the shape or length does not match.
- FR-4 (F-005-A5-04): The `triggerPhrases` formatter validates every parsed element is a string and falls back to `[]` when validation fails.
- FR-5 (F-005-A5-05): `parseDescriptionMetadataContent()` runs the parsed object through `perFolderDescriptionSchema.safeParse` and includes `filePath` in error messages on failure.
- FR-6 (F-005-A5-06): `restoreCheckpoint()` validates the decompressed snapshot against a zod schema and pushes a `Malformed snapshot row N: <reason>` line into `result.errors` for each rejected row instead of propagating the cast through downstream `Array.isArray` / `getMemoryIds()` paths.
- FR-7 (F-008-B3-01): `extractCausalLinks()` matches both `causalLinks:` and `causal_links:` block headers (case-insensitive, anchored to the same regex helper).
- FR-8 (F-008-B3-02): `processCausalLinks()` only increments `result.inserted` when `causalEdges.insertEdge()` returns a non-null row id. When null is returned, the loop pushes `{ type, reference, error: "edge insert returned null" }` into `result.errors`.
- FR-9 (F-009-B4-01): `extract_markdown_link_targets` captures parenthesized links, angle-bracket links to relative `.md`/anchor targets, reference-style links (`[label]: ./path.md`), and shortcut reference links (`[label][ref]`).
- FR-10 (F-009-B4-02): A second checkbox on the same line is NOT evidence. Only `[EVIDENCE: ...]`, `(verified)`, `(tested)`, `(confirmed)`, unicode marks, `[DEFERRED: ...]`, and `| Evidence:` count.
- FR-11 (F-009-B4-03): Priority parsing in `check-evidence.sh` shares its implementation with the priority-tag rule via a sourced helper.
- FR-12 (F-009-B4-04): `extra_header` results from the helper are preserved in `check-template-headers.sh`. Headers AFTER the last required header are treated as valid extensions; headers BEFORE the last matched required header surface as warnings (`mid_document_extra_header`) and details show their position relative to required structure.
- FR-13 (F-009-B4-05): `[x]` and `[X]` are both matched by the checklist guard regexes.

### Non-Functional
- NFR-1: `npm run stress` exits 0 with at least 56 files / 163+ tests after the change. Adding tests is allowed; regressing tests is not.
- NFR-2: `validate.sh --strict` exits 0 on this packet.
- NFR-3: All new tests run in <2s individually so the suite stays fast.
- NFR-4: Each edit carries an inline finding-ID marker (`// F-NNN-XX-NN:` for TS/JS, `# F-NNN-XX-NN:` for shell, `<!-- F-NNN-XX-NN -->` for markdown) for traceability.

### Constraints
- Stay on `main`; no feature branch.
- No new external dependencies (zod is already in `mcp_server/package.json`).
- Snake_case `causal_links` parsing must coexist with existing `causalLinks` consumers; do not break the camelCase path.
- Workspace-root allowlist MUST accept `os.tmpdir()` so the existing test fixtures continue to function.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [x] All 13 doc/code edits applied with finding-ID citations
- [x] All new vitest cases pass (55/55 across 7 files)
- [x] All new fixtures present under `scripts/test-fixtures/064..067-*`
- [x] `validate.sh --strict` exit 0 for this packet (Errors: 0, Warnings: 4 — parity with 010 pilot)
- [x] `npm run stress` exit 0 / 58 files / 195 tests
- [ ] One commit pushed to `origin main` (final step)
- [x] implementation-summary.md updated with Findings closed table (13 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| WorkspaceRoot bounding breaks existing test fixtures using `os.tmpdir()` workspaces | Allowlist explicitly includes `os.tmpdir()` and repo-root. New zod test asserts both pass. |
| Snake_case causal-link regex change drifts edge-extraction count | Add memory-parser-extended-style test that ingests a snake_case YAML block and asserts the same edge count as the camelCase path |
| Insert-counter tightening drops legitimate inserts | Keep `processed` count unchanged; only gate `inserted` and `resolved` on real return value. Verify with synthetic `insertEdge` that returns null. |
| Shell parser changes break existing fixtures | Run validate against ALL existing 60+ test fixtures, not just the new ones, before commit |
| Stress regression | Each change is local; expected impact 0. Verified via full `npm run stress` post-change. |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §5, §8, §9
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| WorkspaceRoot is symlink | Caller passes `/tmp/symlink-to-repo` | Resolve → realpath → check allowlist → accept if real path is under repo or tmpdir |
| Empty corpus.jsonl | File exists but has 0 lines | Validation passes; `correct=0`, `total=0` propagates with no zod error (each line is validated; no lines = no rows) |
| Snake_case YAML missing trailing colon | `causal_links\n  related_to: [...]` (no colon after the block name) | Same as missing-block: returns empty causal-links structure, no parser crash |
| `insertEdge` returns 0 | Storage layer treats 0 as falsy | The processor's gate uses `=== null` strictly; rows with id=0 still count as inserted |
| Reference-style link points outside spec folder | `[doc]: ../../README.md` | Helper resolves like normal markdown; missing-file detection still works |
| Mid-doc extra header followed by required header | Custom H2 inserted between two required H2s | Reported as `mid_document_extra_header` warning; build still passes |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-005-A5-01 | advisor schema + 2 handlers | 25 |
| F-005-A5-02 | advisor-validate corpus + regression | 20 |
| F-005-A5-03 | advisor-validate Python stdout | 10 |
| F-005-A5-04 | search-results triggerPhrases | 10 |
| F-005-A5-05 | memory-parser description.json | 15 |
| F-005-A5-06 | checkpoints snapshot schema | 25 |
| F-008-B3-01 | memory-parser causal-links regex | 15 |
| F-008-B3-02 | causal-links-processor inserted gate | 15 |
| F-009-B4-01 | check-spec-doc-integrity link extraction | 20 |
| F-009-B4-02 | check-evidence semantic marker | 10 |
| F-009-B4-03 | check-evidence priority helper | 15 |
| F-009-B4-04 | check-template-headers extra_header | 20 |
| F-009-B4-05 | check-template-headers uppercase X | 5 |
| Tests + fixtures | 4 fixtures, 7 vitest files | 60 |
| **Total** | | **~265 minutes (~4.5h)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The full architectural rewrite of `extractCausalLinks` to use a real YAML library is deferred (out of scope) — the regex fix is a localized widening that keeps behavior identical for existing callers.
<!-- /ANCHOR:questions -->
