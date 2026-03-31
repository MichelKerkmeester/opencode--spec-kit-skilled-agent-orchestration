---
title: "Implementation Plan: UX Hooks Automation [02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/plan]"
description: "Introduce automated hook prechecks, command UX guardrails, and standardized remediation messaging for spec workflows."
trigger_phrases:
  - "implementation"
  - "plan"
  - "hooks"
  - "command ux"
  - "error reduction"
importance_tier: "normal"
contextType: "general"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
---
# Implementation Plan: UX Hooks Automation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest, Markdown docs |
| **Framework** | System-spec-kit MCP server handlers |
| **Storage** | None |
| **Testing** | `npx tsc -b`, `npm run lint`, combined targeted Vitest rerun (9 files / 525 tests), split playbook verification (`7 files / 510 tests` and `2 files / 15 tests`), plus real MCP SDK stdio smoke test |

### Overview
This phase adds shared post-mutation hook automation across memory mutation handlers, introduces dedicated UX hook modules, and closes the remaining P0-P2 review issues around checkpoint delete safety, duplicate-save no-op feedback, atomic-save parity, token metadata recomputation, README export drift, and end-to-end envelope verification. The implementation prioritizes consistent mutation follow-up behavior, explicit operator guidance, and a verified response contract backed by targeted Vitest coverage plus a real MCP SDK stdio smoke pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared mutation post-hook pattern (common post-mutation wiring + handler-local payloads)

### Key Components
- **Post-Mutation Hook Wrapper**: Executes shared follow-up behavior after successful mutations
- **Mutation Feedback Hook Module**: Builds consistent post-mutation metadata including latency and cache-clear signals
- **Response Hint Hook Module**: Builds and appends UX hints for successful responses
- **Health Repair Path**: Runs optional `autoRepair` and returns structured repair metadata
- **Checkpoint Delete Safety Layer**: Requires `confirmName` and returns metadata for destructive ops
- **Context Server Success Adapter**: Calls `appendAutoSurfaceHints(...)` before returning successful responses and preserves `autoSurfacedContext`

### Data Flow
Mutation request executes handler logic, then shared post-mutation hooks run and emit `postMutationHooks` plus UX hints before final response. Health operations optionally run repair and emit repair metadata. Checkpoint deletion validates `confirmName` before delete and reports result metadata. Context server appends auto-surface hints on success and preserves `autoSurfacedContext` in the same response.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory target mutation handlers and checkpoint delete behavior
- [x] Define shared post-mutation hook integration pattern
- [x] Capture failing baseline in targeted handler and modularization tests

### Phase 2: Core Implementation
- [x] Implement shared post-mutation hook automation in save/update/delete/bulk-delete + atomic save
- [x] Add `memory_health` optional `autoRepair` and repair metadata reporting
- [x] Add checkpoint delete `confirmName` safety param and metadata output
- [x] Add `hooks/mutation-feedback.ts` and `hooks/response-hints.ts` and export them via hooks barrel
- [x] Extend `MutationHookResult` with latency and cache-clear booleans for consistent response contracts
- [x] Update mutation handlers to expose `postMutationHooks` data and UX hint payloads
- [x] Update `context-server.ts` to call `appendAutoSurfaceHints(...)` before successful returns while preserving `autoSurfacedContext`
- [x] Update hooks README with module responsibilities and integration notes

### Phase 3: Verification
- [x] Add automated UX hook verification in `tests/hooks-ux-feedback.vitest.ts`
- [x] Update context-server verification tests for appended success-path hints
- [x] Close follow-up fixes: duplicate-save no-op feedback, atomic-save feedback parity/hints, token metadata recomputation before token-budget enforcement, and hooks README/export drift
- [x] Redirect runtime stdout emitters to stderr-safe logging across startup and runtime hook/indexing paths
- [x] Add regression coverage in `tests/stdio-logging-safety.vitest.ts` and provider-aware lazy model identity coverage in `tests/embeddings.vitest.ts`
- [x] Add end-to-end envelope assertion covering the finalized appended-envelope hint payload shape
- [x] Regenerate build artifacts with `npx tsc -b`
- [x] Run verification commands: `npx tsc -b`; `npm run lint`; and the combined Vitest rerun `npx vitest run tests/hooks-ux-feedback.vitest.ts tests/context-server.vitest.ts tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/memory-crud-extended.vitest.ts tests/memory-save-ux-regressions.vitest.ts tests/embeddings.vitest.ts tests/stdio-logging-safety.vitest.ts` (PASS, 9 files / 525 tests)
- [x] Confirm split playbook verification runs also pass for the same suite split (`7 files / 510 tests` and `2 files / 15 tests`)
- [x] Confirm a real MCP SDK stdio client connects to `node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` and lists 28 tools
- [x] Re-save context via `generate-context.js`, record existing phase memory artifacts `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md` and `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/08-03-26_09-42__5-agent-codex-review-synthesis.md`, and document that no new indexed memory ID is available because indexing still fails on the known 1024 vs 768 embedding mismatch
- [x] Update manual playbook with NEW-103+ scenarios covering UX hook capabilities

### Phase 4: Review-Driven Fixes
- [x] Apply 6-agent review findings: M1-M4 (Major), m1-m5+m10 (Minor), s3+s6+s7 (Suggestion) — 13 fixes across 12 files via 6 parallel agents
- [x] Fix 2 P1 findings from post-fix review: Windows path regex, unsanitized `repair.errors`
- [x] Verify: `npx tsc --noEmit` PASS, 416/416 tests PASS, dual-agent review scores 90/100 + 98/100
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Mutation feedback and response hint hook modules | Vitest (`tests/hooks-ux-feedback.vitest.ts`) |
| Integration | Mutation handlers + context-server success response hint append + end-to-end response envelope assertion | Vitest (`tests/context-server.vitest.ts`, `tests/handler-checkpoints.vitest.ts`, `tests/mcp-input-validation.vitest.ts`, `tests/memory-crud-extended.vitest.ts`, `tests/memory-save-ux-regressions.vitest.ts`, `tests/tool-input-schema.vitest.ts`) |
| Regression | Stdio-safe startup/runtime logging and provider-aware embeddings cache identity | Vitest (`tests/embeddings.vitest.ts`, `tests/stdio-logging-safety.vitest.ts`) |
| Smoke | Real MCP stdio transport handshake against compiled server | MCP SDK client against `node dist/context-server.js` (28 tools listed) |
| Manual | UX hint and post-mutation response verification scenarios | Manual playbook (manual test playbook document in folder 015-manual-testing-per-playbook, NEW-103+) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing spec_kit command files | Internal | Green | Scope can proceed immediately |
| Hook interfaces used by commands | Internal | Yellow | Requires normalization before broad rollout |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: False-positive guardrails block normal workflows, hook runner changes regress response behavior, or stdout pollution breaks MCP stdio startup/client negotiation
- **Procedure**: Revert the affected hook wiring or stdio logging change, rebuild with `npx tsc -b`, then rerun the stdio smoke check against `dist/context-server.js` before restoring impacted command flows
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit + Design) ──► Phase 2 (Automation + Guardrails) ──► Phase 3 (Verify + Tune)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit + Design | None | Automation + Guardrails |
| Automation + Guardrails | Audit + Design | Verify + Tune |
| Verify + Tune | Automation + Guardrails | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 2-3 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **8-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [x] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable hook automation flag for affected commands.
2. Revert guardrail message map and wrapper integration commits.
3. Run CLI smoke tests for plan/implement/complete paths.
4. Post rollback note in parent phase tracker.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
