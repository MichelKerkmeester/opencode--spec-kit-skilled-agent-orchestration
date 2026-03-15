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

### Phase 2: Stateless Alignment And Evidence Preservation

- [x] Add a shared target-spec affinity evaluator for stateless saves.
- [x] Hard-block same-workspace stateless sessions when they lack any target-spec anchor.
- [x] Preserve native tool-call evidence in normalized stateless capture output.
- [x] Recover stateless `TOOL_COUNT` from actual native tool evidence in `workflow.ts`.
- [x] Stop foreign-spec or anchorless prompt fallback from re-entering generated output when relevance matching fails.
- [x] Keep generic/current-spec fallback only when the capture already proves target-spec affinity.

### Phase 3: Cross-Platform Memory Sufficiency

- [x] Add `shared/parsing/memory-sufficiency.ts`.
- [x] Run the shared sufficiency gate in `scripts/core/workflow.ts`.
- [x] Reject thin explicit JSON and native saves with `INSUFFICIENT_CONTEXT_ABORT`.
- [x] Lower diagnostic quality scores when insufficiency fails.
- [x] Run the shared sufficiency gate in `mcp_server/handlers/memory-save.ts`.
- [x] Return insufficiency details in MCP save responses and recovery hints.
- [x] Keep `dryRun:true` non-mutating while surfacing insufficiency.
- [x] Prevent `force:true` from bypassing insufficiency.

### Phase 4: Rendering Quality Fixes

- [x] Fix HTML comment regex in `workflow.ts` to preserve `&lt;!-- ANCHOR:id --&gt;` and `&lt;!-- /ANCHOR:id --&gt;` tags during post-render cleanup.
- [x] Replace hardcoded frontmatter `trigger_phrases` in the `context_template` with a shared workflow-rendered `TRIGGER_PHRASES_YAML` block used by both frontmatter and trailing metadata.
- [x] Accept documented snake_case JSON save keys without breaking existing camelCase inputs.
- [x] Escape literal anchor examples and strip Mustache tokens from saved titles so render and validation paths only see real structural syntax.

### Phase 5: Regression Coverage

- [x] Add `scripts/tests/memory-sufficiency.vitest.ts`.
- [x] Expand `scripts/tests/task-enrichment.vitest.ts` with thin explicit JSON insufficiency coverage.
- [x] Expand `scripts/tests/test-memory-quality-lane.js` with insufficiency scoring coverage.
- [x] Expand `mcp_server/tests/handler-memory-save.vitest.ts` with `dryRun` and `force` insufficiency coverage.
- [x] Expand `mcp_server/tests/recovery-hints.vitest.ts` with insufficiency guidance coverage.
- [x] Keep the existing fallback-order, scorer-calibration, and JS verification suites green.
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:verification -->
## 2. Verification

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run the targeted scripts Vitest suite including `memory-sufficiency.vitest.ts`.
- [x] Run `node test-extractors-loaders.js`.
- [x] Run `node test-bug-fixes.js`.
- [x] Run `node test-integration.js`.
- [x] Run `node test-memory-quality-lane.js`.
- [x] Run `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`.
- [x] Run the targeted MCP save-quality suite.
- [x] Run alignment drift verification.
- [x] Run final spec validation after canonical doc refresh.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:documentation -->
## 3. Documentation

- [x] Rewrite the canonical spec document to the workspace-identity plus insufficiency contract.
- [x] Rewrite the canonical plan document to the current execution and evidence set.
- [x] Rewrite the canonical task document to the final identity, sufficiency, and verification work.
- [x] Refresh the canonical checklist with final post-doc validation evidence.
- [x] Rewrite the canonical decision record with final identity, alignment, and insufficiency decisions.
- [x] Rewrite the implementation summary with exact final evidence from this pass.
- [x] Update feature-catalog entry `NEW-139`.
- [x] Update the pre-storage quality gate feature doc.
- [x] Update the verify-fix-verify quality-loop feature doc.
- [x] Update the `memory_save` dry-run preflight feature doc.
- [x] Expand and correct manual-testing playbook scenarios `M-007` and `NEW-133`.
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
| Keep `.opencode` as canonical workspace identity | Yes |
| Keep insufficiency distinct from alignment and contamination | Yes |
| Keep `force:true` unable to bypass semantic integrity gates | Yes |

### Status Reporting Format

- Report code-path fixes before doc truth updates.
- Report exact counts and dates for rerun verification commands.
- Do not claim completion before zero-warning spec validation.

### Blocked Task Protocol

- If a backend artifact format stores a different but equivalent path form, extend the shared identity helper instead of adding a one-off matcher exception.
- If a memory remains under-evidenced after formatting fixes, keep the insufficiency rejection instead of inventing semantic content.

---

<!-- ANCHOR:completion -->
## 5. Completion Criteria

- [x] The native support matrix still includes `OpenCode`, `Claude`, `Codex`, `Copilot`, and `Gemini`.
- [x] Canonical `.opencode` workspace identity is enforced across all native backends.
- [x] No deferred code items remain for workspace identity, `V7`, safe prompt fallback, or cross-platform insufficiency handling.
- [x] The `010-perfect-session-capturing` folder validates with zero warnings.
<!-- /ANCHOR:completion -->
