---
title: "Implementation Summary: Perfect Session Capturing"
---
# Implementation Summary: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:overview -->
## 1. Overview

Spec `010-perfect-session-capturing` now closes both of the remaining integrity gaps in the stateless save pipeline:

- portability across the five native CLI transcript sources through canonical `.opencode` workspace identity
- durability across all save surfaces through one shared semantic sufficiency gate

The finished behavior is now:

1. Prefer explicit JSON-mode input whenever it is provided.
2. Fall back through the ordered native support matrix.
3. Match native artifacts through canonical `.opencode` workspace identity rather than raw path equality.
4. Require a second target-spec affinity anchor before a stateless save may proceed.
5. Reject thin, metadata-only, or under-evidenced memories with `INSUFFICIENT_CONTEXT_ABORT`.
6. Apply that insufficiency rule consistently to native stateless capture, explicit JSON input, and MCP `memory_save`.
7. Keep contamination and foreign-spec safeguards intact, including `V8`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:code -->
## 2. Code Changes

### Canonical Workspace Identity

- Added `scripts/utils/workspace-identity.ts`.
  - Resolves the nearest repo-local `.opencode` anchor.
  - Preserves both raw and canonical path variants for backend portability.
  - Provides shared helpers for workspace equivalence and workspace-relative file filtering.

- Updated native matcher files to use the shared identity helper:
  - `scripts/extractors/opencode-capture.ts`
  - `scripts/extractors/claude-code-capture.ts`
  - `scripts/extractors/codex-cli-capture.ts`
  - `scripts/extractors/copilot-cli-capture.ts`
  - `scripts/extractors/gemini-cli-capture.ts`

### Stateless Alignment And Evidence Preservation

- Added `scripts/utils/spec-affinity.ts`.
  - Derives exact spec ids, phrases, and file targets from the target spec folder.
  - Evaluates whether a stateless capture contains a real target-spec anchor beyond workspace identity.

- Updated `scripts/utils/input-normalizer.ts`.
  - Tracks native tool-call evidence count in transformed stateless captures.
  - Preserves aligned tool evidence when commands or tool output reference target files.
  - Keeps generic/current-spec prompt fallback only when the capture already proves target-spec affinity.
  - Drops foreign-spec or anchorless prompt/context fallback when relevance matching finds no safe hit.

- Updated `scripts/core/workflow.ts`.
  - Hard-blocks same-workspace stateless saves that do not contain any target-spec anchor.
  - Builds a normalized evidence snapshot before write/index.
  - Runs the shared sufficiency gate and throws `INSUFFICIENT_CONTEXT_ABORT` when durable context is missing.
  - Recovers stateless `TOOL_COUNT` from real native tool evidence rather than only `FILES.length`.

### Shared Memory Sufficiency

- Added `shared/parsing/memory-sufficiency.ts`.
  - Evaluates one normalized evidence snapshot shape across all platforms.
  - Requires:
    - a specific title
    - at least one primary evidence item
    - at least two total evidence items
    - sufficient semantic substance
  - Returns:
    - `pass`
    - `rejectionCode`
    - `reasons`
    - `evidenceCounts`
    - `score`

- Updated `scripts/core/quality-scorer.ts` and `scripts/extractors/quality-scorer.ts`.
  - Legacy and v2 quality diagnostics now lower scores when sufficiency fails.
  - V2 quality now adds `has_insufficient_context`.

### Rendering Quality Fixes

- Updated `scripts/core/workflow.ts` line 108.
  - Changed `WORKFLOW_HTML_COMMENT_RE` from `/<!--[\s\S]*?-->/g` to `/<!--(?!\s*\/?ANCHOR:)[\s\S]*?-->/g`.
  - The negative lookahead preserves `&lt;!-- ANCHOR:id --&gt;` and `&lt;!-- /ANCHOR:id --&gt;` while still stripping all other HTML comments.
  - Root cause: `stripWorkflowHtmlOutsideCodeFences()` was destroying all 26 ANCHOR tag pairs rendered by the template, leaving output files with zero anchors despite the template containing them.
  - Escapes literal anchor examples from captured session text before render so real ANCHOR validation only sees structural anchors, not quoted examples from operator prompts.

- Updated the `context_template` frontmatter (lines 4-7).
  - Replaced hardcoded `trigger_phrases: ["memory dashboard", "session summary", "context template"]` with a pre-rendered `{{TRIGGER_PHRASES_YAML}}` block.
  - The frontmatter and trailing metadata blocks now share the same rendered YAML and both fall back to `trigger_phrases: []` when no triggers are available.
  - Root cause: the workflow correctly extracted session-specific trigger phrases, but nested identical Mustache sections leaked raw template tags and repeated YAML headers in live output.

- Updated `scripts/utils/input-normalizer.ts`.
  - Added compatibility for documented snake_case JSON save keys such as `user_prompts`, `recent_context`, `trigger_phrases`, `session_summary`, and `files_modified`.
  - Keeps existing camelCase support intact while making the CLI help text and real JSON-mode behavior match.

- Updated `scripts/utils/validation-utils.ts` and `scripts/memory/validate-memory-quality.ts`.
  - Ignore literal Mustache tokens and placeholder-like text inside fenced code or inline code during placeholder-leak checks.
  - Prevent false `V5` and `V6` failures when captured operator/debug content discusses real template syntax.

- Updated `scripts/utils/slug-utils.ts`.
  - Strips literal Mustache tokens from generated memory title and slug candidates so captured debugging prompts cannot pollute saved filenames.

### Caller-Aware Native Selection

- Updated `scripts/loaders/data-loader.ts`.
  - Added direct-mode native source preference via `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=opencode|claude|codex|copilot|gemini`.
  - Kept explicit JSON authoritative and unchanged.
  - Preserved the documented fallback order by trying the hinted source first, then resuming the normal chain if that source returns no usable session.
  - Added conservative runtime inference for known CLI markers as a fallback when the explicit env override is absent.

- Updated `scripts/memory/generate-context.ts`.
  - Documented the direct-mode `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` override in CLI help text.
  - Root cause: cross-session contamination in direct-path mode came from backend selection precedence, not from `collectSessionData()` or JSON-mode post-processing.

### MCP Save Path

- Updated `mcp_server/handlers/memory-save.ts`.
  - Runs the quality loop first for recoverable formatting fixes.
  - Evaluates sufficiency after the loop and before embedding, deduplication, or persistence.
  - Rejects insufficient memories with `INSUFFICIENT_CONTEXT_ABORT`.
  - Keeps `dryRun:true` non-mutating while still returning:
    - preflight status
    - quality-loop status
    - sufficiency result
    - `rejectionCode`
  - Prevents `force:true` from bypassing insufficiency.

- Updated `mcp_server/handlers/save/types.ts` and `mcp_server/handlers/save/response-builder.ts`.
  - Rejected save responses now carry insufficiency details directly.

- Updated `mcp_server/lib/errors/recovery-hints.ts`.
  - Recovery guidance now tells operators to gather concrete file/tool/decision/outcome evidence instead of retrying blindly.
<!-- /ANCHOR:code -->

---

<!-- ANCHOR:tests -->
## 3. Test Coverage Added Or Expanded

| Test File | Purpose |
|-----------|---------|
| `scripts/tests/memory-sufficiency.vitest.ts` | Shared insufficiency contract coverage, including generic-title rejection |
| `scripts/tests/spec-affinity.vitest.ts` | Target-spec anchor detection and same-workspace rejection |
| `scripts/tests/workspace-identity.vitest.ts` | Canonical `.opencode` identity equivalence, rejection, and path normalization |
| `scripts/tests/claude-code-capture.vitest.ts` | Claude matching across repo-root and `.opencode` variants |
| `scripts/tests/codex-cli-capture.vitest.ts` | Codex matching across repo-root and `.opencode` variants |
| `scripts/tests/copilot-cli-capture.vitest.ts` | Copilot matching across repo-root and `.opencode` variants |
| `scripts/tests/gemini-cli-capture.vitest.ts` | Gemini matching across repo-root and `.opencode` variants |
| `scripts/tests/stateless-enrichment.vitest.ts` | Safe prompt fallback without foreign-spec contamination |
| `scripts/tests/task-enrichment.vitest.ts` | Thin explicit JSON insufficiency rejection |
| `scripts/tests/runtime-memory-inputs.vitest.ts` | Explicit JSON authority plus preferred native source ordering |
| `scripts/tests/memory-render-fixture.vitest.ts` | `V7` regression coverage for tool-rich sparse-file stateless saves plus ANCHOR/trigger rendering checks |
| `scripts/tests/test-memory-quality-lane.js` | Legacy/v2 score degradation and insufficiency flagging |
| `mcp_server/tests/handler-memory-save.vitest.ts` | `dryRun`, `force`, and insufficiency hard-block behavior |
| `mcp_server/tests/recovery-hints.vitest.ts` | Insufficiency-specific remediation guidance |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:audit -->
## 4. Final Behavior

The finished save behavior is now:

1. Discovery precedence stays `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`.
2. Discovery success is separate from save success.
3. Save success requires all of the following:
   - workspace identity match
   - target-spec affinity
   - no contamination hard-block
   - enough durable evidence for a future memory
4. Thin or metadata-only memories no longer save just because they have:
   - a matching workspace
   - a matching spec id
   - long generated output
   - synthetic enrichment
5. `memory_save({ dryRun:true })` shows insufficiency results without side effects.
6. `memory_save({ force:true })` still respects insufficiency, alignment, and contamination blocks.
7. ANCHOR tags survive post-render HTML comment cleanup through a negative lookahead regex.
8. Frontmatter trigger_phrases are session-specific, not hardcoded generic strings.
9. Direct-path mode can prefer the calling CLI's native capture source without weakening JSON authority or the fallback chain.
<!-- /ANCHOR:audit -->

---

<!-- ANCHOR:verification -->
## 5. Verification Results

| Command | Result |
|---------|--------|
| `cd .opencode/skill/system-spec-kit/scripts && npm run check` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && npm run build` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/claude-code-capture.vitest.ts tests/codex-cli-capture.vitest.ts tests/copilot-cli-capture.vitest.ts tests/gemini-cli-capture.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/stateless-enrichment.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts tests/historical-memory-remediation.vitest.ts` | PASS, `14` files and `125` tests passed |
| `cd .opencode/skill/system-spec-kit/scripts/tests && node test-extractors-loaders.js` | PASS, `288` passed, `0` failed, `0` skipped |
| `cd .opencode/skill/system-spec-kit/scripts/tests && node test-bug-fixes.js` | PASS, `27` passed, `0` failed, `0` skipped |
| `cd .opencode/skill/system-spec-kit/scripts/tests && node test-integration.js` | PASS, `36` passed, `0` failed, `0` skipped |
| `cd .opencode/skill/system-spec-kit/scripts/tests && node test-memory-quality-lane.js` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run lint` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run test:core -- tests/handler-memory-save.vitest.ts tests/recovery-hints.vitest.ts tests/quality-loop.vitest.ts tests/save-quality-gate.vitest.ts tests/preflight.vitest.ts tests/integration-save-pipeline.vitest.ts` | PASS, `6` files and `298` tests passed |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run test` | PASS |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` | PASS, `226` scanned, `0` findings |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing` | PASS, `0` errors and `0` warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## 6. Documentation Updated

- Canonical spec document
- Canonical plan document
- Canonical task document
- Canonical checklist
- Canonical decision record
- Canonical implementation summary
- Feature-catalog entry `NEW-139`
- Feature-catalog entry for pre-storage quality gate
- Feature-catalog entry for the verify-fix-verify quality loop
- Feature-catalog entry for `memory_save` dry-run preflight
- Manual-testing playbook scenario `M-007`
- Manual-testing playbook scenario `NEW-133`
- Manual-testing playbook scenario `NEW-149`
- `scripts/core/workflow.ts` (ANCHOR-preserving HTML comment regex)
- `context_template` (shared trigger-phrase YAML rendering with empty-list fallback)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:remediation -->
## 7. Remediation Pass: GPT-5.4 Review Findings (2026-03-15)

A GPT-5.4 code review and ultra-think analysis identified 6 issues (1 P0, 3 P1, 2 P2) in the spec folder canonicalization implementation. All findings were remediated in a single pass.

### P0: Inner-Symlink Tests Prove the Bug

Added 4 tests to `mcp_server/tests/spec-folder-canonicalization.vitest.ts` that create a symlink **inside** `/specs/` aliasing a spec folder name. Without canonicalization, `extractSpecFolder("specs/current/memory/ctx.md")` returns `"current"` (wrong); with canonicalization it returns `"02--domain/010-feature"` (correct). One test explicitly demonstrates the naive regex producing the wrong result.

### P1-1: Migration Runs Once via Schema v23

Bumped `SCHEMA_VERSION` from 22 to 23 in `mcp_server/lib/search/vector-index-schema.ts`. The one-time re-canonicalization of `spec_folder` values now runs as a proper schema migration instead of on every startup via `normalizeStoredSpecFolders()`.

### P1-2: SQL Guard Replaced with JS Filter

Migration v23 selects all rows with non-empty `file_path`, then filters in JavaScript with normalized separators (`/specs/` or `specs/` prefix) instead of using `LIKE '%/specs/%'` which missed backslash and relative paths.

### P1-3: `session_state.spec_folder` Migrated

Added `migrateSessionStateSpecFolders()` helper that propagates the old-to-new spec_folder mapping from `memory_index` to `session_state`, skipping ambiguous 1:N mappings.

### P2-1: Error Handling Narrowed to ENOENT/ENOTDIR

Added `isMissingPathError()` helper in `mcp_server/lib/utils/canonical-path.ts`. The parent-walk fallback now only triggers for ENOENT/ENOTDIR. EACCES, ELOOP, and EPERM return `path.resolve()` without parent-walk, preserving the no-throw API contract.

### P2-2: Fallback Uses `normalizedPath`

Changed `memory-parser.ts:311` from `path.dirname(path.dirname(filePath))` to `path.dirname(path.dirname(normalizedPath))` so the last-resort fallback also uses the canonicalized path.

### Remediation Verification

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` (mcp_server) | PASS, zero errors |
| `npx vitest run tests/spec-folder-canonicalization.vitest.ts` (mcp_server) | PASS, 20 tests (7 new) |
| `npx vitest run` (mcp_server full suite) | PASS, 282 files, 7,787 tests, 0 failures |
<!-- /ANCHOR:remediation -->

Scratch artifacts under `scratch/` remain historical investigation notes only. Canonical closure evidence lives in the validated spec markdown set and the verification commands recorded above.
For historical remediation, apply-mode evidence must be read from the final canonical manifest and summary artifacts; preserved `*.pre-apply.*` sidecars are pre-repair snapshots only.
