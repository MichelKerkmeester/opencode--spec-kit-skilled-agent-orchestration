---
title: "018 / 012 — MCP config and feature-flag cleanup"
description: "Normalize the five Public MCP configs, remove redundant runtime flags, and verify the rerank and embedding defaults that now live in code."
trigger_phrases: ["018 012 spec", "mcp config cleanup", "feature flag cleanup"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "018/012-mcp-config-and-feature-flag-cleanup"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rebuilt the phase packet around the shipped config cleanup"
    next_safe_action: "Run strict validation and config/code verification"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
---
# Feature Specification: 018 / 012 — MCP config and feature-flag cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-12 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `011-spec-folder-graph-metadata` |
| **Successor** | `013-dead-code-and-architecture-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 018 left the Public MCP configs and packet docs in a partially cleaned state. The runtime already defaults many feature flags to ON, but stale config notes, mismatched packet docs, and incomplete packet artifacts make it unclear which environment variables still matter. The user wants the five Public MCP configs aligned, no `MEMORY_DB_PATH` overrides, no redundant `SPECKIT_*` flags in those checked-in env blocks, consistent `_NOTE_7` guidance for the seven opt-out flags, and direct verification that the code defaults match the docs.

### Purpose
Lock the cleanup to the current Public workspace: five MCP configs, the reranker/default-on flag code, the embedding-dimension behavior, and the packet docs that certify the result.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the five Public MCP configs: `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `opencode.json`.
- Confirm `MEMORY_DB_PATH` is absent from those five checked-in config env blocks.
- Confirm only `EMBEDDINGS_PROVIDER=auto` remains as a real checked-in Spec Kit Memory env var in those five configs.
- Confirm `_NOTE_7_FEATURE_FLAGS` lists the seven opt-out flags consistently and in the same order across the five configs.
- Confirm `cross-encoder.ts` uses `rerank-2.5`, `vector-index-store.ts` uses the provider-driven embedding dimension, and `rollout-policy.ts` treats undefined flags as ON.
- Rebuild this phase packet to a valid Level 2 state so strict validation can certify the cleanup.

### Out of Scope
- Changing non-Public configs in other repos or sibling workspaces.
- Reintroducing checked-in runtime feature flags now that the code defaults them to ON.
- Broad README rewrites outside the files required to remove stale command-surface references or to document this phase packet accurately.
- Git commit or push actions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.mcp.json` | Verify/modify if needed | Public MCP config env block parity. |
| `.claude/mcp.json` | Verify/modify if needed | Claude MCP config parity. |
| `.vscode/mcp.json` | Verify/modify if needed | VS Code wrapper parity. |
| `.gemini/settings.json` | Verify/modify if needed | Gemini MCP config parity. |
| `opencode.json` | Verify/modify if needed | OpenCode MCP config parity. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Verify/modify if needed | Voyage reranker model. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` | Verify/modify if needed | Default-on feature-flag semantics. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Verify/modify if needed | Provider-driven embedding dimension. |
| `012-mcp-config-and-feature-flag-cleanup/*.md` | Modify/create | Bring the packet to a valid Level 2 closeout. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The five Public MCP configs must not set `MEMORY_DB_PATH`. | `rg` across the five config files returns zero `MEMORY_DB_PATH` hits. |
| REQ-002 | The five Public MCP configs must keep only `EMBEDDINGS_PROVIDER=auto` as a real Spec Kit Memory env var. | No checked-in `SPECKIT_*` feature flags remain in the Spec Kit Memory env blocks. |
| REQ-003 | `_NOTE_7_FEATURE_FLAGS` must document the same seven opt-out flags in the same order across the five configs. | The note string is identical in `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `opencode.json`. |
| REQ-004 | Runtime defaults must match the config guidance. | `cross-encoder.ts` uses `rerank-2.5`, `vector-index-store.ts` derives `EMBEDDING_DIM` via `getEmbeddingDimension()`, and `rollout-policy.ts` returns `true` when a flag is undefined. |
| REQ-005 | The phase packet must validate as a complete Level 2 packet. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `graph-metadata.json` all exist and strict validation passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Config parity must stay limited to the five Public configs named by the user. | No Barter or non-Public config files are changed for this phase. |
| REQ-007 | Verification must use the actual `system-spec-kit` workspace root for the `npm run --workspace=...` commands. | Both requested workspace typechecks pass from `.opencode/skill/system-spec-kit`. |
| REQ-008 | Public docs and packet docs must stop claiming six Public configs or other out-of-scope surfaces for this phase. | The phase packet consistently describes five Public configs only. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five Public MCP configs share the same Spec Kit Memory env block content and ordering.
- **SC-002**: `MEMORY_DB_PATH` is absent from those configs, and redundant checked-in feature flags stay removed.
- **SC-003**: Code defaults prove the docs are accurate: `rerank-2.5`, provider-driven dimensions, and default-on flag semantics all match the implementation.
- **SC-004**: The Level 2 packet validates cleanly and records the exact verification commands.

### Acceptance Scenarios

**Given** any of the five Public MCP config files are opened, **when** the `spec_kit_memory` env block is inspected, **then** it matches the others and contains only `EMBEDDINGS_PROVIDER=auto` plus the note fields.

**Given** the config cleanup is reviewed for stale DB overrides, **when** the five Public MCP configs are searched, **then** `MEMORY_DB_PATH` is absent.

**Given** the runtime code is inspected, **when** the reranker, embedding store, and rollout policy are read, **then** they show `rerank-2.5`, provider-driven dimensions, and default-on flag behavior.

**Given** the phase packet is validated in strict mode, **when** the validator runs on `012-mcp-config-and-feature-flag-cleanup`, **then** it passes with no missing-file or template-shape errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Packet docs drift from the actual cleanup scope | Medium | Rebuild the phase packet from the live config/code evidence rather than the earlier shorthand summary. |
| Risk | Config parity claims ignore schema differences between runtimes | Medium | Compare only the shared `spec_kit_memory` env block, not the full file wrappers. |
| Dependency | Workspace typecheck commands must run from the actual workspace root | High | Use `.opencode/skill/system-spec-kit` as the command working directory. |
| Risk | Manual doc cleanup could miss stale wording about six configs | Medium | `rg` the phase packet for `6`/`six`/`Barter` before final verification. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator fixed the scope to the five Public configs and the listed code/default checks.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cleanup must not add new runtime configuration branches; it only removes redundant checked-in flags and keeps default-on behavior in code.
- **NFR-P02**: Verification must prove the two workspace typechecks still pass after packet/doc cleanup.

### Reliability
- **NFR-R01**: Runtime defaults and config notes must stay aligned so new sessions do not need undocumented env overrides.
- **NFR-R02**: Packet validation must be strict-clean so future resume/review flows can trust this phase folder.

### Maintainability
- **NFR-M01**: The five config env blocks must stay identical so future edits can be diffed mechanically.
- **NFR-M02**: Packet docs should reference only the five Public configs and the runtime files that actually implement the cleanup.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Config Surface
- `.vscode/mcp.json` uses the VS Code wrapper schema while the others use native runtime schemas, so parity must be checked at the env-block level instead of full-file equality.
- `opencode.json` uses `environment` instead of `env`, but the field contents still need to match the other four config env blocks.

### Verification Boundaries
- Running the workspace commands from the repo root fails because that root is not the `system-spec-kit` workspace root.
- Existing tests may still mention `MEMORY_DB_PATH` or `EMBEDDING_DIM` in fixture setup; that is acceptable as long as the checked-in Public MCP configs are clean.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Five config files, three runtime files, and one phase packet. |
| Risk | 18/25 | Drift risk is moderate because the cleanup mixes docs, configs, and code-default semantics. |
| Research | 8/20 | This is a direct repo-validation task with no external research. |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
