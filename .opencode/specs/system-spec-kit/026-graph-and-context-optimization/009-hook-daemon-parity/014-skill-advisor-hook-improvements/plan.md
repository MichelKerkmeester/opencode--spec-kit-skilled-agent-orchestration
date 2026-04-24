---
title: "Imp [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/plan]"
description: "Translate packet-02 skill-advisor research into a Level-2 implementation sequence focused on threshold parity, shared brief rendering, MCP surface normalization, and durable prompt-safe telemetry. The plan stays inside the skill-advisor and hook surfaces named by the 014 findings and defers optional P2 cleanup work to downstream follow-up."
trigger_phrases:
  - "skill-advisor hook improvements"
  - "014 skill-advisor"
  - "014-f-001"
  - "014-f-007"
  - "sa-t1"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T08:05:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Synthesized pt-02 research and merged Bucket B inputs into a Level-2 implementation plan"
    next_safe_action: "Execute Phase 1 setup tasks from tasks.md, then implement 014-F-001 through 014-F-007 in priority order"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/tasks.md"
    completion_pct: 20
    status: "planned"
---
# Implementation Plan: Skill-Advisor Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js hooks, Markdown operator docs |
| **Framework** | Shared skill-advisor builder/render contract plus runtime adapters |
| **Storage** | File-backed prompt-safe diagnostics only if added by `014-F-006`; no product-data migration |
| **Testing** | Vitest compat/handler suites, schema assertions, cross-consistency greps |

### Overview
This packet converts the packet-02 research synthesis into an implementation sequence for the P1 skill-advisor gaps: OpenCode threshold drift, OpenCode/Codex branch-specific brief behavior, MCP tool-surface asymmetry, validator threshold opacity, and non-durable telemetry/outcome feedback. The work is constrained by `spec.md` Section 3 to skill-advisor package code, hook adapters, public advisor schemas/handlers, and the operator docs directly attached to those surfaces; it does not reopen CF-019 or expand into broader hook-engine or memory redesign.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Scope stays within `spec.md` Section 3 boundaries and only addresses traced findings `014-F-001` through `014-F-007`
- [ ] Each implementation task cites its packet-02 or merged-synthesis finding ID and names the finding `target_files`
- [ ] Parity fixtures exist for OpenCode, Codex, MCP validation, and telemetry surfaces before core edits begin

### Definition of Done
- [ ] `014-F-001` through `014-F-007` are implemented with matching regression coverage across their target files
- [ ] OpenCode, Codex, and shared-hook runtimes expose one effective-threshold and brief-building story for equivalent prompts
- [ ] Advisor MCP tools and validation output expose explicit workspace/threshold state, and prompt-safe telemetry survives beyond stderr-only process memory
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared builder/render contract with runtime-adapter parity and operator-visible effective state

### Key Components
- **OpenCode bridge surfaces**: `.opencode/plugins/spec-kit-skill-advisor.js` and `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` must consume the same threshold/render contract for `014-F-001` and `014-F-002`.
- **Codex prompt hook surfaces**: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` must align with the shared builder for `014-F-003`.
- **Shared advisor core**: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`, `lib/render.ts`, and `lib/metrics.ts` remain the source of truth for effective thresholds, rendered brief invariants, and prompt-safe diagnostics.
- **Public MCP surface**: `schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-validate.ts`, and `handlers/advisor-status.ts` expose the effective operator contract for `014-F-004`, `014-F-005`, and downstream `014-F-008`.
- **Verification and operator docs**: compat tests plus `README.md` and hook reference docs confirm that the shipped runtime behavior and the documented contract match.

### Data Flow
Prompt entry begins in a runtime adapter, which should resolve workspace and threshold inputs once, hand the request to the shared skill-advisor brief builder, render the brief through shared invariants, and emit prompt-safe diagnostics through a durable sink rather than stderr-only state. The same effective threshold, workspace, and diagnostic state then flows into `advisor_recommend`, `advisor_validate`, and verification coverage so runtime behavior, public MCP outputs, and docs all describe one contract instead of branch-local variants.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Seed OpenCode parity fixtures for `014-F-001` and `014-F-002` around `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- [ ] Seed Codex fast-path regression fixtures for `014-F-003` around `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`.
- [ ] Establish MCP and telemetry baselines for `014-F-004`, `014-F-005`, `014-F-006`, and `014-F-007` around `schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-validate.ts`, and `lib/metrics.ts`.

### Phase 2: Core Implementation
- [ ] `014-F-001` Threshold unification: route OpenCode native and fallback paths through one effective-threshold source in `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`, and `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.
- [ ] `014-F-002` OpenCode render parity: collapse native bridge rendering onto shared invariants in `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- [ ] `014-F-003` Codex shared-brief parity: normalize the native fast path in `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`.
- [ ] `014-F-004` MCP workspace normalization: expose explicit workspace selection across `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`.
- [ ] `014-F-005` Threshold semantics publication: align validator outputs and docs across `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`.
- [ ] `014-F-006` Durable diagnostics: add a prompt-safe health sink across `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`.
- [ ] `014-F-007` Outcome feedback loop: add accepted/corrected/ignored outcome capture through `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`.

### Phase 3: Verification
- [ ] Re-run OpenCode/Codex parity regressions for `014-F-001`, `014-F-002`, and `014-F-003` against `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- [ ] Re-run MCP schema and validator cross-checks for `014-F-004` and `014-F-005` against `schemas/advisor-tool-schemas.ts`, `handlers/advisor-recommend.ts`, `handlers/advisor-validate.ts`, and `README.md`.
- [ ] Re-run durable diagnostics and outcome-event verification for `014-F-006` and `014-F-007` against `lib/metrics.ts`, runtime hook adapters, and any handler-level analysis output introduced during implementation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Threshold helpers, shared render invariants, metrics event shapes in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`, `lib/render.ts`, and `lib/metrics.ts` for `014-F-001`, `014-F-002`, `014-F-005`, `014-F-006`, and `014-F-007` | Vitest |
| Integration | Runtime adapter and MCP handler behavior across `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, `hooks/codex/user-prompt-submit.ts`, `handlers/advisor-recommend.ts`, and `handlers/advisor-validate.ts` for `014-F-001` through `014-F-005` | Vitest compat/handler suites |
| Regression | Cross-runtime parity, workspaceRoot surfacing, effective-threshold output, and telemetry persistence checks for `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` plus handler/schema assertions tied to `014-F-001` through `014-F-007` | Vitest, targeted `rg` cross-consistency checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md` | Internal upstream | Green | Without the closed scorer baseline, `014-F-001` and `014-F-005` could be confounded with the already-fixed CF-019 defect |
| Prior sub-phases `001-skill-advisor-hook-surface`, `008-skill-advisor-plugin-hardening`, and `009-skill-advisor-standards-alignment` | Internal upstream | Green | These packets define the current runtime surfaces; if they are not treated as landed baseline, parity work will drift into re-implementing already-shipped behavior |
| Bucket B guidance in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-pt-02-merged-synthesis.md` | Internal planning input | Green | Losing the merged synthesis would weaken the grouping of `014-F-001` through `014-F-007` into the intended implementation order |
| Future implementation execution for this packet (`014-F-001` through `014-F-007`) | Internal downstream | Yellow | This plan is the contract the downstream implementation pass will consume; if it is stale, the execution packet will re-investigate instead of implementing |
| Deferred P2 follow-up for `014-F-008`, `014-F-009`, and `014-F-010` | Internal downstream | Yellow | If deferred cleanup is not tracked separately, optional live-weight and docs/promotion-contract debt may be lost or silently mixed into the P1 execution packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any phase reintroduces branch-specific threshold/render behavior, breaks advisor MCP compatibility, or records diagnostics in a non-prompt-safe way while implementing `014-F-001` through `014-F-007`.
- **Procedure**: Revert the affected phase in reverse order: remove outcome-event and diagnostics changes first (`014-F-007`, `014-F-006`), then MCP/schema changes (`014-F-004`, `014-F-005`), then runtime-parity edits (`014-F-001`, `014-F-002`, `014-F-003`), and re-run the phase-specific regression coverage after each rollback step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ─────────► Phase 2 (Core Implementation) ─────────► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research packet `014-skill-advisor-hook-improvements-pt-02` and merged Bucket B synthesis | Core Implementation, Verification |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Completion and downstream execution confidence |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC / Time |
|-------|------------|----------------------|
| Setup | Medium | ~80-140 LOC of tests and fixtures / 2-4 hours |
| Core Implementation | High | ~260-420 LOC across hooks, schemas, handlers, and metrics / 8-14 hours |
| Verification | Medium | ~40-90 LOC of regression assertions and doc truth-sync / 2-4 hours |
| **Total** | | **~380-650 LOC / 12-22 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] OpenCode and Codex parity fixtures fail before the change and pass after the change for `014-F-001` through `014-F-003`
- [ ] `workspaceRoot` and threshold fields are documented and schema-validated for `014-F-004` and `014-F-005`
- [ ] Any diagnostics persistence added for `014-F-006` and `014-F-007` is prompt-safe, bounded, and removable without migration work

### Rollback Procedure
1. Revert telemetry/outcome feedback edits tied to `014-F-007` and `014-F-006`, then confirm hooks no longer emit the new durable state.
2. Revert MCP/schema/README changes tied to `014-F-005` and `014-F-004`, then confirm public tool inputs/outputs match the prior contract.
3. Revert runtime-adapter edits tied to `014-F-003`, `014-F-002`, and `014-F-001`, then confirm OpenCode and Codex return to the prior branch-specific behavior without partial roll-forward state.
4. Re-run parity and handler regression coverage to verify the repository matches the intended pre-change baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Remove any prompt-safe diagnostics artifacts introduced by `014-F-006` and `014-F-007`; no schema or database migration reversal is required.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
