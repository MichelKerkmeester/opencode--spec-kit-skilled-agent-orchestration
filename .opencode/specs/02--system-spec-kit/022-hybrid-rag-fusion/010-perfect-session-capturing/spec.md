---
title: "Feature Specification: Perfect Session Capturing"
---
# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## Executive Summary

Spec `010-perfect-session-capturing` now defines the shipped session-capture and save-readiness behavior around two canonical rules:

1. The repo-local `.opencode` folder is the workspace identity anchor for stateless native capture.
2. A memory must contain enough durable, spec-relevant evidence to stand on its own later, or the save aborts with `INSUFFICIENT_CONTEXT_ABORT`.

`generate-context.js` still treats explicit JSON as authoritative, but every save surface now uses the same semantic sufficiency contract after normalization:

- native stateless capture
- explicit JSON input
- MCP `memory_save`

This closure now covers the full end-to-end behavior discovered during manual verification:

1. Same-workspace generic infrastructure sessions no longer pass just because backend discovery matched the active workspace.
2. `V7` no longer fires just because a stateless capture has tool evidence but sparse `FILES`.
3. `V8` no longer reintroduces foreign-spec prompt text when relevance filtering finds no safe keyword hit.
4. Thin, metadata-only, or single-prompt saves no longer slip through with healthy-looking quality metadata.
5. `memory_save({ dryRun:true })` now surfaces insufficiency reasons before any write or index side effect occurs.
6. ANCHOR tags (`&lt;!-- ANCHOR:id --&gt;` / `&lt;!-- /ANCHOR:id --&gt;`) are no longer destroyed by the post-render HTML comment stripper.
7. Frontmatter `trigger_phrases` now use one shared session-specific YAML block instead of hardcoded generic strings or leaky nested Mustache sections.
8. Direct-path native capture can prefer the calling CLI via `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` before resuming the normal fallback chain.
9. Explicit JSON mode now accepts the documented snake_case save contract as well as the existing camelCase fields.

The final native support matrix remains:

1. `OpenCode`
2. `Claude Code`
3. `Codex CLI`
4. `Copilot CLI`
5. `Gemini CLI`
6. `NO_DATA_AVAILABLE`

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Level | 3 |
| Priority | P1 |
| Status | Complete |
| Created | 2026-03-08 |
| Completed | 2026-03-15 |
| Parent | 022-hybrid-rag-fusion |
| Scope | Canonical workspace identity, target-spec affinity, cross-platform semantic sufficiency, and canonical docs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem And Purpose

### Problem Statement

The earlier native-capture expansion proved the five-backend matrix in fixture coverage, but live verification exposed eight remaining closure gaps:

1. Native backends were still comparing raw absolute paths, even though different CLIs persist equivalent workspace paths in different forms.
2. Same-workspace generic infrastructure sessions could still proceed warning-only even when they lacked any target-spec anchor.
3. Stateless validation could falsely abort on `V7` when real tool activity survived normalization but `FILES` stayed sparse.
4. Relevance fallback could still re-include foreign-spec prompt text and trip `V8`, while the manual playbook overstated what precedence alone guarantees about save success.
5. Aligned but under-evidenced memories could still look healthy enough to save because the pipeline had no shared semantic sufficiency gate across `generate-context.js` and `memory_save`.
6. The post-render HTML comment stripper (`stripWorkflowHtmlOutsideCodeFences`) used a regex that matched all HTML comments including `&lt;!-- ANCHOR:id --&gt;` tags, destroying all 26 anchor pairs from the rendered output.
7. The template frontmatter hardcoded `trigger_phrases` as `["memory dashboard", "session summary", "context template"]`, and a first-pass nested Mustache fix still leaked raw template tags and repeated YAML headers in live output.
8. Direct-path mode still used raw fallback precedence, so an active OpenCode session could be selected even when the caller was another CLI unless the caller fell back to JSON mode.
9. The documented snake_case JSON save contract did not fully normalize into the live pipeline, so prompts and recent context could be dropped unless callers switched to camelCase.

### Purpose

Make `.opencode` the canonical workspace identity, require a second target-spec affinity gate before stateless save-path success, add one shared semantic sufficiency gate across all save surfaces, preserve strict contamination safety, and refresh the operator docs so `M-007` and `NEW-133` reflect actual shipped behavior instead of stale assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Keep JSON-mode input as the only authoritative stateful input path.
- Normalize native backend matching through the nearest repo-local `.opencode` directory.
- Accept repo root, `.opencode`, and git-root backend paths only when they resolve to the same workspace identity.
- Require at least one target-spec anchor beyond workspace identity before a stateless native save may proceed.
- Preserve fallback order: `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`.
- Allow direct-path mode to prefer the caller's native backend first through `SYSTEM_SPEC_KIT_CAPTURE_SOURCE`, then resume the documented fallback order if that preferred source is empty.
- Keep all native backends stateless-only and normalized through the shared capture contract.
- Preserve aligned tool evidence when commands, tool inputs, or tool output reference the target spec even if direct `filePath` fields are absent.
- Fix false stateless aborts caused by incomplete tool-count recovery.
- Prevent foreign-spec prompt fallback from contaminating generated memory content.
- Add one shared semantic sufficiency evaluator for normalized memories.
- Hard-block under-evidenced saves with `INSUFFICIENT_CONTEXT_ABORT`.
- Apply the sufficiency gate to native stateless capture, explicit JSON input, and MCP `memory_save`.
- Ensure `memory_save({ dryRun:true })` reports insufficiency reasons and evidence counts without any write or indexing side effects.
- Ensure `force:true` cannot bypass insufficiency, alignment, or contamination blocks.
- Update spec `010`, feature-catalog entry `NEW-139`, the memory-quality feature docs, manual scenario `M-007`, and manual scenario `NEW-133` to the final contract.

### Out Of Scope

- Changing the `generate-context.js` CLI signature.
- Breaking the documented JSON-mode input contract.
- Relaxing contamination, alignment, or quality gates.
- Adding new native backends beyond the shipped five-source matrix.

### Files Changed

| Path | Change Type | Purpose |
|------|-------------|---------|
| `scripts/utils/workspace-identity.ts` | Create | Canonical `.opencode` workspace identity and equivalence helpers |
| `scripts/utils/spec-affinity.ts` | Create | Shared target-spec affinity evaluation for stateless saves |
| `shared/parsing/memory-sufficiency.ts` | Create | Shared semantic sufficiency evaluator used across save surfaces |
| `scripts/utils/index.ts` | Modify | Export workspace identity helpers |
| `scripts/extractors/opencode-capture.ts` | Modify | Match OpenCode sessions via canonical workspace identity |
| `scripts/extractors/claude-code-capture.ts` | Modify | Match Claude history/transcripts via canonical workspace identity |
| `scripts/extractors/codex-cli-capture.ts` | Modify | Match Codex `cwd` via canonical workspace identity |
| `scripts/extractors/copilot-cli-capture.ts` | Modify | Match Copilot `cwd` / `git_root` via canonical workspace identity |
| `scripts/extractors/gemini-cli-capture.ts` | Modify | Match Gemini `.project_root` via canonical workspace identity |
| `scripts/utils/input-normalizer.ts` | Modify | Tighten safe prompt/context fallback, preserve aligned native tool-call evidence, and accept documented snake_case JSON save keys |
| `scripts/core/workflow.ts` | Modify | Enforce target-spec affinity and insufficiency hard-blocks before write/index; fix ANCHOR-preserving HTML comment regex; share rendered trigger-phrase YAML; escape literal anchor examples before render |
| `scripts/loaders/data-loader.ts` | Modify | Add caller-aware native source preference while keeping JSON authority and normal fallback order intact |
| `scripts/memory/generate-context.ts` | Modify | Document the direct-mode `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` override in CLI help text |
| `templates/context_template` | Modify | Replace hardcoded frontmatter `trigger_phrases` with a shared `TRIGGER_PHRASES_YAML` render block |
| `scripts/utils/validation-utils.ts` | Modify | Ignore literal Mustache placeholders inside code spans when checking for leaked template syntax |
| `scripts/memory/validate-memory-quality.ts` | Modify | Tighten `V5` and `V6` placeholder-leak checks so real rendered output passes while malformed output still fails |
| `scripts/utils/slug-utils.ts` | Modify | Strip literal Mustache tokens from title/slug candidates before file naming |
| `scripts/core/quality-scorer.ts` | Modify | Cap legacy score when sufficiency fails |
| `scripts/extractors/quality-scorer.ts` | Modify | Lower v2 score and add insufficiency flag for thin memories |
| `mcp_server/handlers/memory-save.ts` | Modify | Run sufficiency after quality-loop and surface explicit rejection payloads |
| `mcp_server/handlers/save/types.ts` | Modify | Carry sufficiency metadata through rejected save results |
| `mcp_server/handlers/save/response-builder.ts` | Modify | Return insufficiency rejection details in MCP responses |
| `mcp_server/lib/errors/recovery-hints.ts` | Modify | Add insufficiency-specific recovery guidance |
| `mcp_server/lib/collab/shared-spaces.ts` | Modify | Remove the stale unused helper so package-wide MCP lint returns cleanly |
| `scripts/tests/spec-affinity.vitest.ts` | Create | Target-spec affinity anchor coverage and same-workspace rejection |
| `scripts/tests/workspace-identity.vitest.ts` | Create | `.opencode` equivalence coverage |
| `scripts/tests/memory-sufficiency.vitest.ts` | Create | Shared sufficiency contract coverage |
| `scripts/tests/claude-code-capture.vitest.ts` | Modify | Claude repo-root vs `.opencode` matching coverage |
| `scripts/tests/codex-cli-capture.vitest.ts` | Modify | Codex repo-root vs `.opencode` matching coverage |
| `scripts/tests/copilot-cli-capture.vitest.ts` | Modify | Copilot repo-root vs `.opencode` matching coverage |
| `scripts/tests/gemini-cli-capture.vitest.ts` | Modify | Gemini repo-root vs `.opencode` matching coverage |
| `scripts/tests/stateless-enrichment.vitest.ts` | Modify | Foreign-spec prompt fallback guardrail coverage |
| `scripts/tests/memory-render-fixture.vitest.ts` | Modify | `V7` stateless tool-evidence regression coverage |
| `scripts/tests/task-enrichment.vitest.ts` | Modify | Thin explicit JSON insufficiency rejection coverage |
| `scripts/tests/test-bug-fixes.js` | Modify | Remap bug-fix assertions to current compiled modules and remove stale deferred skips |
| `scripts/tests/test-integration.js` | Modify | Remap integration assertions to current entrypoints and replace obsolete module-not-found skips |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Modify | Dry-run and force-path insufficiency coverage |
| `mcp_server/tests/recovery-hints.vitest.ts` | Modify | Insufficiency recovery-hint coverage |
| Canonical spec markdown set | Modify | Final workspace-identity contract and current evidence |
| Feature catalog entry `NEW-139` | Modify | Final source-of-truth operator guidance for generate-context save paths |
| Memory-quality feature docs | Modify | Clarify insufficiency versus quality-loop and save-quality-gate roles |
| Manual playbook scenarios `M-007` and `NEW-133` | Modify | Final scenario packs and expectation wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | JSON-mode remains authoritative | Loader still returns explicit JSON immediately when a data file is provided |
| REQ-002 | Native fallback order stays fixed | Loader still tries `OpenCode`, `Claude`, `Codex`, `Copilot`, `Gemini`, then `NO_DATA_AVAILABLE` |
| REQ-003 | Native matching uses canonical workspace identity | Repo root, `.opencode`, and git-root forms only match when they normalize to the same repo-local `.opencode` anchor |
| REQ-004 | Native thought/reasoning-only content is excluded | Claude `thinking`, Codex reasoning items, and Gemini `thoughts` do not appear in normalized output |
| REQ-005 | Out-of-workspace file hints are stripped | Foreign absolute paths are removed from normalized tool-call inputs and derived file hints |
| REQ-006 | Same-workspace off-spec sessions hard-fail before indexing | Stateless saves abort with `ALIGNMENT_BLOCK` when no target-spec anchor exists beyond workspace identity |
| REQ-007 | Aligned but under-evidenced saves hard-fail explicitly | Native and JSON save paths abort with `INSUFFICIENT_CONTEXT_ABORT` when durable evidence is missing |
| REQ-008 | Stateless tool evidence does not false-fail `V7` | Tool-rich captures without edited files can still produce non-zero rendered `tool_count` |
| REQ-009 | Relevance fallback does not reintroduce foreign-spec contamination | Generic fallback is only retained when the capture already proves target-spec affinity; otherwise prompts/context are dropped |
| REQ-010 | The spec folder validates cleanly | `spec/validate.sh` returns zero errors and zero warnings |
| REQ-021 | ANCHOR tags survive post-render cleanup | `grep -c 'ANCHOR' <output>.md` returns >0 after `generate-context.js` |
| REQ-022 | Frontmatter trigger_phrases are session-specific and YAML-valid | Output frontmatter contains one valid extracted trigger list or `[]`, with no raw Mustache tags or repeated headers |
| REQ-023 | Direct-path mode can prefer the calling CLI without weakening fallback safety | With `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` set, the hinted backend is tried first and the remaining backends still run in the documented order if needed |
| REQ-024 | Explicit JSON mode accepts the documented snake_case contract | Snake_case save payloads preserve prompts, recent context, and trigger phrases without invoking native capture |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-011 | A shared workspace-identity helper exists | Extractors reuse one internal `.opencode` equivalence layer |
| REQ-012 | A shared target-spec affinity helper exists | Workflow and stateless normalization reuse one internal spec-affinity evaluator |
| REQ-013 | A shared sufficiency helper exists | Workflow and MCP save handlers reuse one semantic sufficiency evaluator |
| REQ-014 | `memory_save` dry-run surfaces insufficiency without writes | Dry-run responses include `rejectionCode`, sufficiency reasons, and no indexing side effects |
| REQ-015 | `force:true` cannot bypass insufficiency | Forced saves still reject before embedding or persistence when insufficiency fails |
| REQ-016 | Quality-loop fixes do not invent semantic evidence | Formatting auto-fixes may help structure, but insufficiency still rejects thin memories |
| REQ-017 | Diagnostic quality scores reflect insufficiency | Legacy and v2 quality metadata score thin memories materially lower and add insufficiency flags |
| REQ-018 | Discovery precedence is distinct from final save success | Docs and `M-007` describe backend selection separately from later alignment, insufficiency, and contamination aborts |
| REQ-019 | Canonical docs reflect the final workspace-identity and sufficiency contract | Spec `010`, `NEW-139`, memory-quality feature docs, `M-007`, and `NEW-133` all describe the shared insufficiency gate |
| REQ-020 | Verification evidence is current | Final automated reruns on 2026-03-15 are recorded in canonical docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success -->
## 5. Success Criteria

- Native capture works across all five supported local backends without relying on raw path equality.
- Equivalent repo-root and `.opencode` transcript/workspace records are accepted only when they resolve to the same workspace.
- Same-workspace captures without a target-spec anchor fail `ALIGNMENT_BLOCK` instead of indexing.
- Aligned but thin or metadata-only captures fail `INSUFFICIENT_CONTEXT_ABORT` instead of indexing.
- `memory_save({ dryRun:true })` returns insufficiency reasons and evidence counts without file, database, or embedding side effects.
- `memory_save({ force:true })` does not bypass insufficiency, alignment, or contamination blocks.
- Tool-rich stateless captures no longer false-abort on `V7`.
- Foreign-spec prompt fallback no longer contaminates generated memory content when relevance matching fails.
- The targeted scripts Vitest suite passes with `14` files and `125` tests.
- `test-bug-fixes.js` passes from `scripts/tests` with `27` passed, `0` failed, `0` skipped.
- `test-integration.js` passes from `scripts/tests` with `36` passed, `0` failed, `0` skipped.
- The targeted MCP save-quality suite passes with `6` files and `298` tests.
- Package-clean MCP verification passes for `npm run lint`, `npm run build`, and `npm run test`.
- `test-extractors-loaders.js` passes with `288` passed, `0` failed, `0` skipped.
- Alignment drift passes with `226` scanned files and `0` findings.
- Final spec validation returns zero errors and zero warnings.
- Rich snake_case JSON saves index successfully, while thin snake_case JSON inputs fail `INSUFFICIENT_CONTEXT_ABORT` before file write.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 6. Risks And Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Native CLIs persist different filesystem spellings for the same workspace | High | Canonical `.opencode` identity layer accepts only equivalent paths, not nearby guesses |
| Risk | Broader path equivalence could weaken contamination safety if over-broad | High | Matching still requires one shared `.opencode` anchor and file hints remain workspace-scoped |
| Risk | Aligned but thin saves can still look plausible if metadata is over-counted | High | Shared insufficiency gate counts only durable evidence and hard-blocks under-evidenced saves |
| Risk | Stateless captures with sparse file edits can still look low-signal | Medium | Keep numeric scorer active, preserve tool evidence, and preserve quality/alignment/insufficiency aborts after discovery succeeds |
| Dependency | Existing stateless enrichment pipeline | High | Native backends still feed the same downstream transform and render path |
| Dependency | MCP memory-save handler flow | High | Dry-run, quality-loop, and persistence now rely on the same sufficiency contract |
| Dependency | Local CLI storage layouts | Medium | Each backend remains bounded, fixture-tested, and empty-state safe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. Non-Functional Requirements

- Reliability: no crash when backend storage is absent, malformed, or mismatched.
- Security: workspace matching must stay exact via canonical `.opencode` identity and must not accept cross-workspace opportunistic matches.
- Maintainability: one shared path-equivalence layer replaces duplicated raw-path logic.
- Maintainability: one shared sufficiency evaluator replaces backend-specific “thin memory” heuristics.
- Documentation integrity: manual scenarios describe discovery precedence, alignment, insufficiency, contamination, and dry-run behavior separately.
<!-- /ANCHOR:nfr -->

---

## 8. Edge Cases

- A backend stores repo root while the runtime is anchored at `.opencode`: the transcript is accepted only if both resolve to the same workspace identity.
- A backend stores `.opencode` directly: the transcript is accepted as the canonical identity form.
- A same-workspace session touches only shared infrastructure paths and never references the target spec: the stateless save aborts with `ALIGNMENT_BLOCK`.
- A same-workspace session references the target spec but only preserves one thin prompt and generic metadata: the save aborts with `INSUFFICIENT_CONTEXT_ABORT`.
- A stateless capture contains real read/search/bash telemetry but no edited files: rendered memory still reports non-zero `tool_count`.
- Relevance filtering finds no keyword hit and no other spec anchor exists: generic prompt/context fallback is dropped instead of rescued.
- Relevance filtering finds only foreign-spec prompt text: the prompt/context is dropped instead of reintroduced wholesale.
- `memory_save({ dryRun:true, skipPreflight:true })` still runs quality-loop and sufficiency evaluation, but produces no side effects.
- `memory_save({ force:true })` bypasses neither insufficiency nor contamination rejection.
- Discovery succeeds but later quality or alignment gates fail: docs and manual testing treat that as a save-path result, not a discovery-order regression.

---

## 9. Complexity Assessment

| Dimension | Notes |
|-----------|-------|
| Scope | Crosses five extractors, one shared utility, stateless validation behavior, tests, and canonical docs |
| Risk | Medium because discovery correctness directly affects memory integrity |
| Coordination | Requires code, tests, docs, and validation evidence to land together |
| Level | Remains Level 3 because the change spans architecture, verification, and operator documentation |

---

## 10. User Stories

### US-001: Portable Stateless Discovery

As a maintainer, I want repo-root and `.opencode` transcript metadata to resolve to the same workspace when they are genuinely equivalent, so native fallback works across different local CLI storage formats.

### US-002: Safe Stateless Saves

As a maintainer, I want valid tool-rich stateless captures to survive quality validation without weakening contamination protection, while same-workspace off-spec sessions fail early, so discovery does not fail for the wrong reason and unrelated work does not index.

### US-003: Durable Memory Protection

As a maintainer, I want thin or metadata-only memories to fail explicitly even when they are aligned, so future agents do not index low-value context that looks healthy only because of scaffolding.

### US-004: Accurate Operator Guidance

As a future operator, I want `M-007`, `NEW-133`, and the feature catalog to distinguish discovery precedence from later save-path aborts, so manual verification reflects the shipped system truth.

---

## 11. Acceptance Scenarios

### Scenario 1: Canonical workspace equivalence

**Given** the runtime is anchored at repo-local `.opencode`, **when** a backend persists the enclosing repo root or a nested `.opencode` path for the same workspace, **then** the transcript is accepted.

### Scenario 2: Foreign workspace rejection

**Given** a backend artifact points at another repo with a different `.opencode` anchor, **when** the loader evaluates it, **then** the artifact is rejected even if the basename is similar.

### Scenario 3: Stateless tool evidence

**Given** a stateless capture contains tool telemetry but no edited files, **when** the workflow renders memory output, **then** `tool_count` is non-zero and `V7` does not fail spuriously.

### Scenario 4: Same-workspace off-spec rejection

**Given** a native stateless capture belongs to the same `.opencode` workspace but contains no target-spec file, phrase, or spec-id anchor, **when** the workflow runs, **then** the save aborts with `ALIGNMENT_BLOCK`.

### Scenario 5: Safe prompt fallback

**Given** relevance filtering finds no keyword hit and the capture also lacks any other target-spec anchor, **when** the transform runs, **then** generic or foreign-spec prompts do not return as fallback content.

### Scenario 6: Backend precedence

**Given** multiple native sources are available for the same workspace, **when** the loader runs, **then** it still picks the first usable backend in the documented order.

### Scenario 6a: Caller-aware direct-mode preference

**Given** direct-path mode is running under an external CLI and `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` is set to that CLI, **when** multiple native sources are available, **then** the hinted source is tried first and the remaining backends continue in the documented order if the hinted source is empty.

### Scenario 7: Shared insufficiency hard-fail

**Given** a save path is aligned but preserves only generic or under-evidenced context, **when** the workflow or `memory_save` handler evaluates the normalized evidence snapshot, **then** the save aborts with `INSUFFICIENT_CONTEXT_ABORT`.

### Scenario 8: JSON snake_case compatibility

**Given** explicit JSON input uses documented snake_case save keys, **when** the loader normalizes the file, **then** prompts, recent context, and trigger phrases survive intact and native fallback is not consulted.

### Scenario 9: Dry-run insufficiency visibility

**Given** `memory_save({ dryRun:true })` receives an insufficient memory, **when** the handler completes validation, **then** the response includes the insufficiency rejection code, reasons, and evidence counts without indexing side effects.

### Scenario 10: Final hard fail

**Given** explicit JSON is absent and every backend is empty or mismatched, **when** the loader runs, **then** it returns `NO_DATA_AVAILABLE`.

### Scenario 11: Canonical docs validate

**Given** the rewritten `010` markdown set, **when** `spec/validate.sh` runs, **then** it returns zero errors and zero warnings.

---

## 12. Related Documents

- `plan`
- `tasks`
- `checklist`
- `decision record`
- `implementation summary`

Scratch audit artifacts under `scratch/` are historical research only. Canonical completion evidence for spec `010` lives in this markdown set plus fresh verification command output.
