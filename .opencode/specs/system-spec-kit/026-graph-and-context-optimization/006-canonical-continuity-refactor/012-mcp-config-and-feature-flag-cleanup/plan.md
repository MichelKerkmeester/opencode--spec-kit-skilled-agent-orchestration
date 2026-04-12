---
title: "018 / 012 — MCP config and feature-flag cleanup plan"
description: "Execution plan for the five-config cleanup, runtime default verification, and packet repair."
trigger_phrases: ["018 012 plan", "mcp config cleanup plan", "feature flag cleanup plan"]
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "018/012-mcp-config-and-feature-flag-cleanup"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Documented the cleanup plan and verification path"
    next_safe_action: "Review tasks and checklist"
    key_files: ["plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
---
# Implementation Plan: 018 / 012 — MCP config and feature-flag cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON/JSONC configs, TypeScript runtime, Markdown packet docs |
| **Framework** | `system-spec-kit`, Spec Kit Memory MCP |
| **Testing** | Workspace typecheck, targeted Vitest, strict packet validation |
| **Scope** | Five Public MCP configs plus the code paths that justify the minimal env surface |

### Overview
The phase verifies the five Public MCP configs first, then confirms the runtime defaults that replaced the removed config flags, then repairs the phase packet so validation evidence is durable. The implementation stays narrow: no non-Public config drift and no new flags added back to the checked-in env blocks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The five Public config files were identified and read directly.
- [x] The runtime default files (`cross-encoder.ts`, `rollout-policy.ts`, `vector-index-store.ts`) were read directly.
- [x] The phase packet gaps were confirmed by strict validation before editing.

### Definition of Done
- [x] Five Public configs remain aligned and clean.
- [x] Runtime default checks match the config guidance.
- [x] The Level 2 packet validates cleanly.
- [x] Required typechecks and targeted Vitest runs pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keep checked-in configs minimal and move default behavior into code.

### Key Components
- **Config surface**: `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `opencode.json`
- **Rerank default**: `mcp_server/lib/search/cross-encoder.ts`
- **Feature-flag default semantics**: `mcp_server/lib/cognitive/rollout-policy.ts`
- **Embedding dimension source**: `mcp_server/lib/search/vector-index-store.ts` and shared embeddings helpers
- **Packet verification**: this phase folder and `validate.sh`

### Data Flow
1. Compare the five Public config env blocks.
2. Verify the runtime code that makes those env blocks minimal.
3. Repair the phase packet to a valid Level 2 shape.
4. Run typecheck, targeted Vitest, strict validation, and final config sweeps.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence gathering
- [x] Inspect the five Public config files and note-only flag surface.
- [x] Inspect the reranker, rollout policy, and embedding-dimension code paths.

### Phase 2: Packet repair
- [x] Rewrite `spec.md` and `implementation-summary.md` to the active Level 2 templates.
- [x] Add the missing `plan.md`, `tasks.md`, and `checklist.md`.
- [x] Refresh `graph-metadata.json` for the packet root.

### Phase 3: Verification
- [x] Run the two workspace typechecks from the actual `system-spec-kit` workspace root.
- [x] Run targeted Vitest suites for tool/schema/config/graph/runtime defaults.
- [x] Run strict packet validation and final config sweeps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | `@spec-kit/mcp-server`, `@spec-kit/scripts` | `npm run --workspace=... typecheck` from `.opencode/skill/system-spec-kit` |
| MCP runtime tests | Tool schemas, graph metadata, reranker, rollout policy, docs parity | `vitest` from the `mcp_server` workspace |
| Scripts tests | Graph metadata refresh/backfill | `vitest` from the `scripts` workspace |
| Packet validation | Phase packet docs | `validate.sh --strict` |
| Config audit | Five Public config files | `rg` sweeps on the exact filenames |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Five Public configs remain the authoritative scope | External | Green | Scope drift would pull unrelated config work into this phase. |
| `system-spec-kit` workspace root remains available | Internal | Green | The requested workspace typecheck commands must run there. |
| Graph metadata tooling stays built and callable | Internal | Green | Packet graph metadata refresh depends on the shipped dist script. |
| Packet templates remain consistent with validator expectations | Internal | Green | Missing anchors or template headers would keep strict validation red. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation or targeted tests fail after packet/config cleanup.
- **Procedure**: Fix the failing packet/config/runtime surface in scope and rerun the exact failing command. Do not widen scope to other repos or reintroduce redundant checked-in flags.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Evidence gathering -> Packet repair -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence gathering | Existing config/code files | Accurate packet repair |
| Packet repair | Evidence gathering | Strict validation |
| Verification | Packet repair | Phase closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence gathering | Low | <1 hour |
| Packet repair | Medium | 1-2 hours |
| Verification | Medium | 1 hour |
| **Total** | | **One focused cleanup pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All config and runtime files were read before editing.
- [x] The phase scope stayed limited to the five Public configs and packet-local docs.
- [x] Verification commands were selected before edits landed.

### Rollback Procedure
1. Revert only the packet/config change that caused the failure.
2. Rerun the failed typecheck, test, or validation command.
3. Repeat until the packet and verification set are both clean.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Rebuild packet docs or config notes in place if a verification regression appears.
<!-- /ANCHOR:enhanced-rollback -->
