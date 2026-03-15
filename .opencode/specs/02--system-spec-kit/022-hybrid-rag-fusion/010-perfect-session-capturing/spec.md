# Feature Specification: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## Executive Summary

Spec `010-perfect-session-capturing` now defines the shipped session-capture behavior around one canonical rule: the repo-local `.opencode` folder is the workspace identity anchor for stateless native capture. `generate-context.js` still treats explicit JSON as authoritative, but native fallback can now safely accept equivalent backend paths recorded as repo root, `.opencode`, or git root as long as they normalize to the same workspace.

This closure also fixes the two stateless validation drifts discovered during manual verification:

1. `V7` no longer fires just because a stateless capture has tool evidence but sparse `FILES`.
2. `V8` no longer reintroduces foreign-spec prompt text when relevance filtering finds no safe keyword hit.

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
| Scope | Canonical workspace identity, native capture matching, stateless validation drift, and canonical docs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem And Purpose

### Problem Statement

The earlier native-capture expansion proved the five-backend matrix in fixture coverage, but live verification exposed three remaining closure gaps:

1. Native backends were still comparing raw absolute paths, even though different CLIs persist equivalent workspace paths in different forms.
2. Stateless validation could falsely abort on `V7` when real tool activity survived normalization but `FILES` stayed sparse.
3. Relevance fallback could still re-include foreign-spec prompt text and trip `V8`, while the manual playbook overstated what precedence alone guarantees about save success.

### Purpose

Make `.opencode` the canonical workspace identity, route every native backend through that equivalence layer, preserve strict contamination safety, and refresh the operator docs so `M-007` reflects actual shipped behavior instead of stale assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Keep JSON-mode input as the only authoritative stateful input path.
- Normalize native backend matching through the nearest repo-local `.opencode` directory.
- Accept repo root, `.opencode`, and git-root backend paths only when they resolve to the same workspace identity.
- Preserve fallback order: `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`.
- Keep all native backends stateless-only and normalized through the shared capture contract.
- Fix false stateless aborts caused by incomplete tool-count recovery.
- Prevent foreign-spec prompt fallback from contaminating generated memory content.
- Update spec `010`, feature-catalog entry `NEW-139`, and manual scenario `M-007` to the final contract.

### Out Of Scope

- Changing the `generate-context.js` CLI signature.
- Changing the JSON-mode input contract.
- Relaxing contamination, alignment, or quality gates.
- Adding new native backends beyond the shipped five-source matrix.

### Files Changed

| Path | Change Type | Purpose |
|------|-------------|---------|
| `scripts/utils/workspace-identity.ts` | Create | Canonical `.opencode` workspace identity and equivalence helpers |
| `scripts/utils/index.ts` | Modify | Export workspace identity helpers |
| `scripts/extractors/opencode-capture.ts` | Modify | Match OpenCode sessions via canonical workspace identity |
| `scripts/extractors/claude-code-capture.ts` | Modify | Match Claude history/transcripts via canonical workspace identity |
| `scripts/extractors/codex-cli-capture.ts` | Modify | Match Codex `cwd` via canonical workspace identity |
| `scripts/extractors/copilot-cli-capture.ts` | Modify | Match Copilot `cwd` / `git_root` via canonical workspace identity |
| `scripts/extractors/gemini-cli-capture.ts` | Modify | Match Gemini `.project_root` via canonical workspace identity |
| `scripts/utils/input-normalizer.ts` | Modify | Safe prompt/context fallback and native tool-call evidence tracking |
| `scripts/core/workflow.ts` | Modify | Recover stateless `TOOL_COUNT` from actual native tool evidence |
| `scripts/tests/workspace-identity.vitest.ts` | Create | `.opencode` equivalence coverage |
| `scripts/tests/claude-code-capture.vitest.ts` | Modify | Claude repo-root vs `.opencode` matching coverage |
| `scripts/tests/codex-cli-capture.vitest.ts` | Modify | Codex repo-root vs `.opencode` matching coverage |
| `scripts/tests/copilot-cli-capture.vitest.ts` | Modify | Copilot repo-root vs `.opencode` matching coverage |
| `scripts/tests/gemini-cli-capture.vitest.ts` | Modify | Gemini repo-root vs `.opencode` matching coverage |
| `scripts/tests/stateless-enrichment.vitest.ts` | Modify | Foreign-spec prompt fallback guardrail coverage |
| `scripts/tests/memory-render-fixture.vitest.ts` | Modify | `V7` stateless tool-evidence regression coverage |
| Canonical spec markdown set | Modify | Final workspace-identity contract and current evidence |
| Feature catalog entry `NEW-139` | Modify | Final source-of-truth operator guidance |
| Manual playbook scenario `M-007` | Modify | Final scenario pack and expectation wording |
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
| REQ-006 | Stateless tool evidence does not false-fail `V7` | Tool-rich captures without edited files can still produce non-zero rendered `tool_count` |
| REQ-007 | Relevance fallback does not reintroduce foreign-spec contamination | When no safe keyword hit exists, prompts/context either remain generic/current-spec or are dropped entirely |
| REQ-008 | The spec folder validates cleanly | `spec/validate.sh` returns zero errors and zero warnings |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-009 | A shared workspace-identity helper exists | Extractors reuse one internal `.opencode` equivalence layer |
| REQ-010 | Backend-specific matcher updates are regression-tested | Workspace-identity tests and backend parser tests pass |
| REQ-011 | Discovery precedence is distinct from final save success | Docs and `M-007` describe backend selection separately from later quality/alignment aborts |
| REQ-012 | Canonical docs reflect the final workspace-identity contract | Spec `010`, `NEW-139`, and `M-007` all describe `.opencode` as the workspace identity anchor |
| REQ-013 | Verification evidence is current | Final automated reruns on 2026-03-15 are recorded in canonical docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success -->
## 5. Success Criteria

- Native capture works across all five supported local backends without relying on raw path equality.
- Equivalent repo-root and `.opencode` transcript/workspace records are accepted only when they resolve to the same workspace.
- Tool-rich stateless captures no longer false-abort on `V7`.
- Foreign-spec prompt fallback no longer contaminates generated memory content when relevance matching fails.
- The targeted closure Vitest suite passes with `11` files and `87` tests.
- `test-extractors-loaders.js` passes with `288` passed, `0` failed, `0` skipped.
- Alignment drift passes with `219` scanned files and `0` findings.
- Final spec validation returns zero errors and zero warnings.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 6. Risks And Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Native CLIs persist different filesystem spellings for the same workspace | High | Canonical `.opencode` identity layer accepts only equivalent paths, not nearby guesses |
| Risk | Broader path equivalence could weaken contamination safety if over-broad | High | Matching still requires one shared `.opencode` anchor and file hints remain workspace-scoped |
| Risk | Stateless captures with sparse file edits can still look low-signal | Medium | Keep numeric scorer active and preserve quality/alignment aborts after discovery succeeds |
| Dependency | Existing stateless enrichment pipeline | High | Native backends still feed the same downstream transform and render path |
| Dependency | Local CLI storage layouts | Medium | Each backend remains bounded, fixture-tested, and empty-state safe |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. Non-Functional Requirements

- Reliability: no crash when backend storage is absent, malformed, or mismatched.
- Security: workspace matching must stay exact via canonical `.opencode` identity and must not accept cross-workspace opportunistic matches.
- Maintainability: one shared path-equivalence layer replaces duplicated raw-path logic.
- Documentation integrity: manual scenarios describe discovery precedence, validation gates, and hard-fail behavior separately.
<!-- /ANCHOR:nfr -->

---

## 8. Edge Cases

- A backend stores repo root while the runtime is anchored at `.opencode`: the transcript is accepted only if both resolve to the same workspace identity.
- A backend stores `.opencode` directly: the transcript is accepted as the canonical identity form.
- A stateless capture contains real read/search/bash telemetry but no edited files: rendered memory still reports non-zero `tool_count`.
- Relevance filtering finds no keyword hit but the prompt is generic: the prompt can remain as a safe fallback.
- Relevance filtering finds only foreign-spec prompt text: the prompt/context is dropped instead of reintroduced wholesale.
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

As a maintainer, I want valid tool-rich stateless captures to survive quality validation without weakening contamination protection, so discovery does not fail for the wrong reason.

### US-003: Accurate Operator Guidance

As a future operator, I want `M-007` and the feature catalog to distinguish discovery precedence from later save-path aborts, so manual verification reflects the shipped system truth.

---

## 11. Acceptance Scenarios

### Scenario 1: Canonical workspace equivalence

**Given** the runtime is anchored at repo-local `.opencode`, **when** a backend persists the enclosing repo root or a nested `.opencode` path for the same workspace, **then** the transcript is accepted.

### Scenario 2: Foreign workspace rejection

**Given** a backend artifact points at another repo with a different `.opencode` anchor, **when** the loader evaluates it, **then** the artifact is rejected even if the basename is similar.

### Scenario 3: Stateless tool evidence

**Given** a stateless capture contains tool telemetry but no edited files, **when** the workflow renders memory output, **then** `tool_count` is non-zero and `V7` does not fail spuriously.

### Scenario 4: Safe prompt fallback

**Given** relevance filtering finds no keyword hit and only foreign-spec prompts are present, **when** the transform runs, **then** those prompts do not return as fallback content.

### Scenario 5: Backend precedence

**Given** multiple native sources are available for the same workspace, **when** the loader runs, **then** it still picks the first usable backend in the documented order.

### Scenario 6: Final hard fail

**Given** explicit JSON is absent and every backend is empty or mismatched, **when** the loader runs, **then** it returns `NO_DATA_AVAILABLE`.

### Scenario 7: Canonical docs validate

**Given** the rewritten `010` markdown set, **when** `spec/validate.sh` runs, **then** it returns zero errors and zero warnings.

---

## 12. Related Documents

- `plan`
- `tasks`
- `checklist`
- `decision record`
- `implementation summary`
