# Implementation Plan: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript, Node.js |
| Framework | Custom `generate-context.js` pipeline plus MCP `memory_save` |
| Storage | Filesystem spec folders plus memory indexing pipeline |
| Testing | Vitest plus direct Node.js verification suites |

### Overview

This pass closes the remaining durability gap in spec `010` by adding one cross-platform semantic sufficiency contract after normalization and before storage, and fixes two rendering bugs that degraded output quality:

1. Keep `.opencode` as the canonical workspace identity for native capture.
2. Keep target-spec affinity as a separate gate after workspace discovery.
3. Add one shared semantic sufficiency evaluator for all save surfaces.
4. Reject thin, metadata-only, or single-prompt memories with `INSUFFICIENT_CONTEXT_ABORT`.
5. Apply the same rule to native capture, explicit JSON input, and MCP `memory_save`.
6. Refresh the feature catalog and manual playbook so operators can verify both `generate-context.js` and `memory_save` accurately.
7. Fix the post-render HTML comment stripper so ANCHOR tags survive template rendering.
8. Replace hardcoded frontmatter trigger_phrases with a shared rendered YAML block so frontmatter and trailing metadata stay in sync without leaking raw Mustache tags.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition Of Ready

- [x] The governing spec folder stayed `010-perfect-session-capturing`.
- [x] The user confirmed `.opencode` is the canonical workspace identity contract.
- [x] Existing matcher, validation, and manual-doc drift were inspected before editing.

### Definition Of Done

- [x] Native capture still matches through canonical workspace identity.
- [x] Stateless validation no longer false-fails on tool-rich sparse-file captures.
- [x] Under-evidenced saves now hard-fail with `INSUFFICIENT_CONTEXT_ABORT`.
- [x] `memory_save` dry-run surfaces insufficiency explicitly without writes.
- [x] `force:true` does not bypass insufficiency.
- [x] Targeted scripts tests, targeted MCP tests, JS verification, build, lint, alignment drift, and spec validation all pass.
- [x] Canonical docs and manual scenarios reflect the final shipped contract.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

JSON authority with additive stateless native fallbacks, fronted by canonical `.opencode` workspace identity normalization and followed by one shared semantic sufficiency gate before storage.

### Key Components

- `scripts/utils/workspace-identity.ts`: shared canonical workspace identity helper.
- `scripts/utils/spec-affinity.ts`: shared target-spec alignment helper.
- `shared/parsing/memory-sufficiency.ts`: shared semantic sufficiency evaluator.
- Native extractors:
  - `opencode-capture.ts`
  - `claude-code-capture.ts`
  - `codex-cli-capture.ts`
  - `copilot-cli-capture.ts`
  - `gemini-cli-capture.ts`
- `input-normalizer.ts`: safe prompt/context fallback and native tool-evidence shaping.
- `workflow.ts`: stateless alignment, sufficiency, and quality enforcement before write/index.
- `mcp_server/handlers/memory-save.ts`: dry-run, quality-loop, sufficiency, and persistence orchestration.

### Data Flow

`JSON input -> OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE -> normalization -> stateless enrichment -> alignment and contamination checks -> sufficiency gate -> quality threshold -> memory write/index flow`

`memory_save -> parse/validate -> quality loop -> sufficiency gate -> dedup / embedding / persistence`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. Execution Phases

### Phase 1: Shared Sufficiency Contract

- Add a shared evaluator that can judge whether a normalized memory has enough durable evidence to stand alone later.
- Keep the evaluator backend-agnostic so every save surface uses the same rule.

### Phase 2: Save-Path Integration

- Apply the shared sufficiency evaluator in `workflow.ts` for native and JSON save paths.
- Apply the same evaluator in `memory-save.ts` after the quality loop and before persistence.
- Keep `ALIGNMENT_BLOCK`, contamination blocking, and the existing quality-gate semantics distinct.

### Phase 3: Regression Coverage

- Add focused unit coverage for the evaluator contract.
- Expand workflow save-path coverage for thin explicit JSON rejection.
- Expand MCP save tests for dry-run and forced-save insufficiency handling.

### Phase 4: Rendering Quality Fixes

- Fix `WORKFLOW_HTML_COMMENT_RE` in `workflow.ts` to use a negative lookahead that preserves ANCHOR comment tags while still stripping all other HTML comments.
- Replace hardcoded frontmatter `trigger_phrases` in the `context_template` with a workflow-rendered `TRIGGER_PHRASES_YAML` block shared by both frontmatter and trailing metadata.

### Phase 5: Canonical Docs And Verification

- Rewrite spec `010` docs to the workspace-identity plus insufficiency contract.
- Update `NEW-139`, the memory-quality catalog entries, `M-007`, and `NEW-133`.
- Rerun the requested verification stack and record exact results.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Workspace identity, spec affinity, and semantic sufficiency | Vitest |
| Integration | Loader precedence, stateless transform, render-path validation, and MCP save handling | Vitest plus `node` suites |
| Standards | Build, lint, alignment drift, and spec validation | `tsc`, alignment script, `spec/validate.sh` |
| Manual | `M-007` for `generate-context.js` and `NEW-133` for `memory_save` sufficiency/dry-run behavior | `generate-context.js`, `memory_save`, and playbook scenarios |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:verification -->
## 6. Verification Plan

| Command | Status | Result |
|---------|--------|--------|
| `npm run lint` | Complete | Passed |
| `npm run build` | Complete | Passed |
| `npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts` | Complete | `12` files, `106` tests passed |
| `node test-extractors-loaders.js` | Complete | `288` passed, `0` failed, `0` skipped |
| `node test-bug-fixes.js` | Complete | `16` passed, `0` failed, `10` skipped |
| `node test-integration.js` | Complete | `26` passed, `0` failed, `2` skipped |
| `node test-memory-quality-lane.js` | Complete | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | Complete | Passed |
| `npm run test:core -- tests/handler-memory-save.vitest.ts tests/recovery-hints.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts tests/preflight.vitest.ts tests/integration-save-pipeline.vitest.ts` | Complete | `6` files, `297` tests passed |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` | Complete | PASS, `222` files scanned, `0` findings |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing` | Complete | Passed cleanly with `0` errors and `0` warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:dependencies -->
## 7. Dependencies

| Dependency | Type | Status | Impact If Blocked |
|------------|------|--------|-------------------|
| Local CLI artifact layouts | Internal runtime dependency | Green | Identity matching could not be proved across backends |
| Existing stateless enrichment pipeline | Internal code dependency | Green | Validation and render behavior depend on the shared downstream path |
| MCP save handler flow | Internal code dependency | Green | Dry-run and persistence behavior depend on shared insufficiency evaluation |
| `sk-code--opencode` alignment rules | Tooling dependency | Green | New utility/test files must conform to repo standards |
| Spec validator expectations | Tooling dependency | Green | Final doc rewrite must remain Level 3 and validation-clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. Rollback Plan

- Trigger: workspace-equivalence logic matches the wrong backend artifact, or the sufficiency gate rejects clearly good memories.
- Procedure: isolate the failing gate, revert the affected matcher or sufficiency integration path, rerun the focused parser/save regressions, and keep JSON authority unchanged throughout.
<!-- /ANCHOR:rollback -->

---

## 9. Dependency Graph

`workspace identity helper` -> `spec-affinity gate` -> `shared sufficiency evaluator` -> `workflow integration` -> `memory_save integration` -> `targeted regressions` -> `canonical docs` -> `spec validation`

---

## 10. Critical Path

1. Keep canonical `.opencode` workspace identity normalization intact.
2. Add shared semantic sufficiency evaluation.
3. Apply the new gate in both `generate-context.js` and `memory_save`.
4. Prove the fixes with focused regressions and the full verification stack.
5. Refresh canonical docs and pass final validation.

---

## 11. Milestones

| Milestone | Success Criteria |
|-----------|------------------|
| M1 | Shared sufficiency evaluator compiles and exposes the explicit rejection contract |
| M2 | Workflow and MCP save paths both hard-block insufficient memories |
| M3 | Targeted scripts and MCP verification stacks pass |
| M4 | Canonical docs validate cleanly and reflect the final cross-platform contract |
