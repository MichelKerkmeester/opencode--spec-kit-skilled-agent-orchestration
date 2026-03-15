# Tasks: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:implementation -->
## 1. Implementation

### Phase 1: Canonical Workspace Identity

- [x] Create `scripts/utils/workspace-identity.ts`.
- [x] Export the workspace-identity helpers from `scripts/utils/index.ts`.
- [x] Match `OpenCode` sessions through canonical workspace identity instead of raw equality.
- [x] Match `Claude` history and transcript directories through canonical workspace identity.
- [x] Match `Codex`, `Copilot`, and `Gemini` through canonical workspace identity compatibility forms.

### Phase 2: Stateless Validation Drift

- [x] Preserve native tool-call evidence in normalized stateless capture output.
- [x] Recover stateless `TOOL_COUNT` from actual native tool evidence in `workflow.ts`.
- [x] Stop foreign-spec prompt fallback from re-entering generated output when relevance matching fails.
- [x] Keep safe generic/current-spec fallback behavior for prompt/context recovery.

### Phase 3: Regression Coverage

- [x] Add `scripts/tests/workspace-identity.vitest.ts`.
- [x] Expand backend parser suites with repo-root versus `.opencode` equivalence coverage.
- [x] Expand `scripts/tests/stateless-enrichment.vitest.ts` with foreign-spec fallback coverage.
- [x] Expand `scripts/tests/memory-render-fixture.vitest.ts` with stateless tool-evidence coverage.
- [x] Keep the existing fallback-order, scorer-calibration, and JS verification suites green.
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:verification -->
## 2. Verification

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run the targeted closure Vitest suite including workspace-identity coverage.
- [x] Run `node test-extractors-loaders.js`.
- [x] Run `node test-bug-fixes.js`.
- [x] Run `node test-integration.js`.
- [x] Run `node test-memory-quality-lane.js`.
- [x] Run alignment drift verification.
- [x] Run final spec validation after canonical doc refresh.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:documentation -->
## 3. Documentation

- [x] Rewrite the canonical spec document to the `.opencode` workspace-identity contract.
- [x] Rewrite the canonical plan document to the current execution and evidence set.
- [x] Rewrite the canonical task document to the final identity/validation work.
- [x] Refresh the canonical checklist with final post-doc validation evidence.
- [x] Rewrite the canonical decision record with final identity and fallback decisions.
- [x] Rewrite the implementation summary with exact final evidence from this pass.
- [x] Update feature-catalog entry `NEW-139`.
- [x] Expand and correct manual-testing playbook scenario `M-007`.
- [x] Run spec-folder validation until clean.
<!-- /ANCHOR:documentation -->

---

## 4. AI Execution Protocol

### Pre-Task Checklist

- [x] Read target files before editing.
- [x] Keep changes inside spec `010`, the touched pipeline files, and the named canonical docs.
- [x] Re-run verification after code edits.
- [x] Update canonical evidence from real command output rather than estimates.

### Execution Rules

| Rule | Applied |
|------|---------|
| Keep CLI signature unchanged | Yes |
| Keep JSON-mode authoritative | Yes |
| Prefer one shared identity layer over backend-local fixes | Yes |
| Keep contamination and alignment gates strict | Yes |

### Status Reporting Format

- Report code-path fixes before doc truth updates.
- Report exact counts and dates for rerun verification commands.
- Do not claim completion before zero-warning spec validation.

### Blocked Task Protocol

- If a backend artifact format stores a different but equivalent path form, extend the shared identity helper instead of adding a one-off matcher exception.
- If a manual expectation is stale, correct the docs to shipped behavior rather than forcing the code to satisfy a bad assumption.

---

<!-- ANCHOR:completion -->
## 5. Completion Criteria

- [x] The native support matrix still includes `OpenCode`, `Claude`, `Codex`, `Copilot`, and `Gemini`.
- [x] Canonical `.opencode` workspace identity is enforced across all native backends.
- [x] No deferred code items remain for workspace identity, `V7`, or safe prompt fallback.
- [x] The `010-perfect-session-capturing` folder validates with zero warnings.
<!-- /ANCHOR:completion -->
