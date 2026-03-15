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
| Framework | Custom `generate-context.js` pipeline |
| Storage | Filesystem spec folders plus memory indexing pipeline |
| Testing | Vitest plus direct Node.js verification suites |

### Overview

This pass closes the remaining drift in spec `010` by making repo-local `.opencode` the canonical workspace identity for native capture, then fixing the downstream stateless behaviors that were failing real manual verification:

1. Add one shared workspace-identity utility instead of keeping five raw-path matcher variants.
2. Update all native backends to match via canonical `.opencode` equivalence rather than strict absolute-path equality.
3. Recover stateless `tool_count` from structured native tool evidence so valid captures do not false-fail `V7`.
4. Tighten relevance fallback so foreign-spec prompts do not re-enter generated memory content and trigger `V8`.
5. Rewrite `M-007` and the canonical docs around discovery precedence, workspace identity, and save-path truth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition Of Ready

- [x] The governing spec folder stayed `010-perfect-session-capturing`.
- [x] The user confirmed `.opencode` is the canonical workspace identity contract.
- [x] Existing matcher, validation, and manual-doc drift were inspected before editing.

### Definition Of Done

- [x] All native backends match through the shared workspace-identity layer.
- [x] Stateless validation no longer false-fails on tool-rich sparse-file captures.
- [x] Foreign-spec prompt fallback no longer re-enters generated output.
- [x] Targeted Vitest, JS verification, build, lint, alignment drift, and spec validation all pass.
- [x] Canonical docs and `M-007` reflect the final shipped contract.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

JSON authority with additive stateless native fallbacks, now fronted by canonical `.opencode` workspace identity normalization.

### Key Components

- `scripts/utils/workspace-identity.ts`: shared canonical workspace identity helper.
- Native extractors:
  - `opencode-capture.ts`
  - `claude-code-capture.ts`
  - `codex-cli-capture.ts`
  - `copilot-cli-capture.ts`
  - `gemini-cli-capture.ts`
- `input-normalizer.ts`: safe prompt/context fallback and native tool-evidence shaping.
- `workflow.ts`: stateless `TOOL_COUNT` recovery before render/validation.
- Canonical docs: spec `010`, feature-catalog entry `NEW-139`, and `M-007`.

### Data Flow

`JSON input -> OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE -> normalization -> stateless enrichment -> render -> quality validation -> memory write/index flow`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. Execution Phases

### Phase 1: Canonical Workspace Identity

- Create a shared helper that resolves the nearest repo-local `.opencode` anchor.
- Preserve both canonical and raw path variants so backend artifacts can match portable path spellings safely.
- Replace backend-local raw equality checks with the shared equivalence rule.

### Phase 2: Stateless Validation Drift Fixes

- Recover stateless `TOOL_COUNT` from structured native tool evidence instead of relying on `FILES.length`.
- Tighten relevance fallback so generic prompts can remain, but foreign-spec prompts do not get reintroduced.
- Keep contamination and alignment gates strict after discovery succeeds.

### Phase 3: Regression Coverage

- Add focused unit coverage for workspace identity.
- Expand backend parser suites to cover repo-root versus `.opencode` equivalence.
- Add regression coverage for `V7` tool-evidence rescue and safe `V8` fallback behavior.

### Phase 4: Canonical Docs And Verification

- Rewrite spec `010` docs to the `.opencode` identity contract.
- Update `NEW-139` and `M-007` so discovery precedence is clearly separated from later save outcomes.
- Rerun the full requested verification stack and record exact results.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Workspace identity and backend parser equivalence | Vitest |
| Integration | Loader precedence, stateless transform, render-path validation | Vitest plus `node` suites |
| Standards | Build, lint, alignment drift, and spec validation | `tsc`, alignment script, `spec/validate.sh` |
| Manual | `M-007` scenario pack for discovery precedence, save-path behavior, and hard-fail | `generate-context.js` and playbook scenarios |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:verification -->
## 6. Verification Plan

| Command | Status | Result |
|---------|--------|--------|
| `npm run lint` | Complete | Passed |
| `npm run build` | Complete | Passed |
| `npm test -- --run tests/workspace-identity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts` | Complete | `11` files, `87` tests passed |
| `node test-extractors-loaders.js` | Complete | `288` passed, `0` failed, `0` skipped |
| `node test-bug-fixes.js` | Complete | `16` passed, `0` failed, `10` skipped |
| `node test-integration.js` | Complete | `26` passed, `0` failed, `2` skipped |
| `node test-memory-quality-lane.js` | Complete | PASS |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` | Complete | PASS, `219` files scanned, `0` findings |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing` | Complete | Passed cleanly with `0` errors and `0` warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:dependencies -->
## 7. Dependencies

| Dependency | Type | Status | Impact If Blocked |
|------------|------|--------|-------------------|
| Local CLI artifact layouts | Internal runtime dependency | Green | Identity matching could not be proved across backends |
| Existing stateless enrichment pipeline | Internal code dependency | Green | Validation and render behavior depend on the shared downstream path |
| `sk-code--opencode` alignment rules | Tooling dependency | Green | New utility/test files must conform to repo standards |
| Spec validator expectations | Tooling dependency | Green | Final doc rewrite must remain Level 3 and validation-clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. Rollback Plan

- Trigger: workspace-equivalence logic matches the wrong backend artifact, or new stateless rescue logic weakens contamination safety.
- Procedure: remove the shared equivalence layer from the affected matcher, restore the prior backend-local rule, rerun the focused parser/render regressions, and keep JSON authority unchanged throughout.
<!-- /ANCHOR:rollback -->

---

## 9. Dependency Graph

`workspace identity helper` -> `native matcher updates` -> `stateless validation fixes` -> `targeted regressions` -> `canonical docs` -> `spec validation`

---

## 10. Critical Path

1. Implement canonical `.opencode` workspace identity normalization.
2. Update backend matchers and stateless validation behavior.
3. Prove the fixes with focused regressions and the full verification stack.
4. Refresh canonical docs and pass final validation.

---

## 11. Milestones

| Milestone | Success Criteria |
|-----------|------------------|
| M1 | Shared workspace-identity helper compiles and backend matchers use it |
| M2 | Focused Vitest regressions pass for identity, V7, and safe fallback |
| M3 | Full automated verification stack passes |
| M4 | Canonical docs validate cleanly and reflect the final `.opencode` contract |
