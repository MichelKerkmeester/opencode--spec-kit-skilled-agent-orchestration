---
title: "Tasks: Perfect Session Capturing"
---
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

### Phase 6: Content Generation Quality

- [x] CG-01: Guard `AUTO_DECISION_TREES` duplication in `diagram-extractor.ts`.
- [x] CG-02: Word-boundary-aware truncation in `file-helpers.ts` and `decision-extractor.ts`.
- [x] CG-03: Session state detection for JSON-mode in `collect-session-data.ts`.
- [x] CG-04: Trigger phrase domain-stopword filter in `workflow.ts`.
- [x] CG-05: Semantic summary file extraction from any message with file paths in `semantic-summarizer.ts`.
- [x] CG-06: Tree thinning description generation in `tree-thinning.ts`.
- [x] CG-07: Quality gate medium-quality warning banner in `workflow.ts`.
- [x] CG-08: File classification for agent files in `implementation-guide-extractor.ts`.

#### speckit-enforce.yaml Backend (co-located)

- [x] SE-01: Warn on unrecognized `SPECKIT_RULES` in `validate.sh`.
- [x] SE-02: YAML comment handling in `pre-commit-spec-validate.sh`.
- [x] SE-03: Mode value validation in `pre-commit-spec-validate.sh`.
- [x] SE-04: Date format check in `pre-commit-spec-validate.sh`.
- [x] SE-05: Bullet-metadata level detection pattern in `validate.sh`.
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:verification -->
## 2. Verification

- [x] Run `cd .opencode/skill/system-spec-kit/scripts && npm run check`.
- [x] Run `cd .opencode/skill/system-spec-kit/scripts && npm run build`.
- [x] Run the expanded targeted scripts Vitest suite including `memory-sufficiency.vitest.ts`, `memory-template-contract.vitest.ts`, and `historical-memory-remediation.vitest.ts`.
- [x] Run `cd .opencode/skill/system-spec-kit/scripts/tests && node test-extractors-loaders.js`.
- [x] Run `cd .opencode/skill/system-spec-kit/scripts/tests && node test-bug-fixes.js`.
- [x] Run `cd .opencode/skill/system-spec-kit/scripts/tests && node test-integration.js`.
- [x] Run `cd .opencode/skill/system-spec-kit/scripts/tests && node test-memory-quality-lane.js`.
- [x] Run `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint`.
- [x] Run `cd .opencode/skill/system-spec-kit/mcp_server && npm run build`.
- [x] Run the targeted MCP save-quality suite.
- [x] Run `cd .opencode/skill/system-spec-kit/mcp_server && npm run test`.
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
- Treat `scratch/` artifacts as historical research, not canonical completion evidence.
- Do not claim completion before zero-warning spec validation.

### Blocked Task Protocol

- If a backend artifact format stores a different but equivalent path form, extend the shared identity helper instead of adding a one-off matcher exception.
- If a memory remains under-evidenced after formatting fixes, keep the insufficiency rejection instead of inventing semantic content.

---

<!-- ANCHOR:remediation -->
## 5. Remediation: GPT-5.4 Review Findings

### Remediation Tasks

- [x] P2-2: Fix fallback in `memory-parser.ts:311` to use `normalizedPath` instead of raw `filePath`.
- [x] P2-1: Add `isMissingPathError()` helper in `canonical-path.ts` and narrow catch to ENOENT/ENOTDIR only.
- [x] P0: Add 4 inner-symlink tests proving the bug exists without canonicalization and is fixed with it.
- [x] P2-1: Add ELOOP regression test using real circular symlinks.
- [x] P2-2: Add backslash fallback regression test.
- [x] P1-1: Bump `SCHEMA_VERSION` to 23 so re-canonicalization runs once as a migration.
- [x] P1-2: Replace SQL `LIKE '%/specs/%'` with JS-side normalized filter in migration v23.
- [x] P1-3: Add `migrateSessionStateSpecFolders()` to propagate old→new mapping to `session_state`.
- [x] Remove `normalizeStoredSpecFolders()` from `create_schema` hot path (replaced by v23 migration).

### Remediation Verification

- [x] `npx tsc --noEmit` in `mcp_server` — zero errors.
- [x] `npx vitest run tests/spec-folder-canonicalization.vitest.ts` — 20 tests pass (7 new).
- [x] `npx vitest run` full MCP suite — 282 files, 7,787 tests, 0 failures.
<!-- /ANCHOR:remediation -->

---

<!-- ANCHOR:completion -->
## 6. Completion Criteria

- [x] The native support matrix still includes `OpenCode`, `Claude`, `Codex`, `Copilot`, and `Gemini`.
- [x] Canonical `.opencode` workspace identity is enforced across all native backends.
- [x] No deferred code items remain for workspace identity, `V7`, safe prompt fallback, or cross-platform insufficiency handling.
- [x] The `010-perfect-session-capturing` folder validates with zero warnings.
<!-- /ANCHOR:completion -->
