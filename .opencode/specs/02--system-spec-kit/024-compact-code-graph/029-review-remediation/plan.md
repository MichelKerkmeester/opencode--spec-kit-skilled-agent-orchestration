---
title: "Plan: Review Remediation [024/029]"
description: "Execution plan for resolving the active deep-review blocker set across bootstrap contracts, root evidence, hook safety, runtime guidance, and structural budget enforcement."
trigger_phrases:
  - "029 plan"
  - "review remediation plan"
  - "active findings remediation"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Plan: Review Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, runtime instruction surfaces |
| **Framework** | Spec Kit Memory MCP server plus packet documentation |
| **Storage** | SQLite-backed session/memory flows touched indirectly by hook behavior |
| **Testing** | Targeted hook/runtime checks, packet validation, deep-review rerun |

### Overview

This phase began as the planning packet for the seven active findings left by the deep review. The implementation pass closed the blocker set in five ordered workstreams and completed the advisory parity follow-up while keeping the scope inside the original review registry.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Active findings and workstreams confirmed from the parent deep review report in `../review/`
- [x] Scope limited to child packet `029-review-remediation`
- [x] Adjacent phase style reviewed from `../028-startup-highlights-remediation/`

### Definition of Done
- [x] All six active P1 findings are either implemented or explicitly downgraded with synchronized contract language
- [x] Root packet evidence is internally consistent for shipped Phase 015/016 status
- [x] Hook safety and autosave targeting are revalidated with current runtime evidence
- [x] A focused post-remediation review sweep confirms the original active P1 mismatches are closed in this slice
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scoped remediation program. Each workstream updates the smallest set of code and packet surfaces needed to make one review claim truthful.

### Key Components
- **Contract surfaces**: `tool-schemas.ts`, MCP README, session bootstrap handler
- **Root packet evidence**: root `checklist.md` and the parent implementation summary artifact
- **Hook safety surfaces**: Gemini SessionStart recovery path and Claude stop-hook autosave path
- **Historical guidance surfaces**: Phase 021 docs and runtime-facing instruction files
- **Structural budget surfaces**: Phase 027 docs and `session-snapshot.ts`
- **Optional runtime-agent surfaces**: OpenCode and Claude `context-prime` docs plus the Codex `context-prime` TOML/markdown surfaces that may need to stay aligned

### Data Flow
Deep-review evidence identifies a claim drift or safety gap, the remediation updates the owning code and documentation surfaces, targeted verification proves the repaired behavior, and a follow-up deep review confirms the packet now tells the truth.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract And Evidence Triage
- Confirm whether `session_bootstrap` should grow a `nextActions` payload or whether docs/schema should shrink to current output.
- Decide how root packet evidence should represent shipped status for phases 015 and 016.
- Freeze the active registry so implementation does not drift beyond the seven findings.

### Phase 2: Blocker Remediation
- **WS-1**: Truth-sync `session_bootstrap` schema, docs, and handler output for P1-001.
- **WS-2**: Repair stale root evidence ownership for P1-002.
- **WS-3**: Harden Gemini provenance fencing and Claude autosave target selection for P1-003 and P1-004.
- **WS-4**: Truth-sync Phase 021 to the bootstrap-first recovery contract for P1-005.
- **WS-5**: Enforce or relax the documented structural bootstrap hard ceiling for P1-006.

### Phase 3: Advisory Follow-Up And Rerun
- **WS-6**: Align `context-prime` structural Prime Package shape across runtimes if the team wants to retire that maintenance debt now.
- Re-run packet validation and targeted runtime verification.
- Re-run deep review with emphasis on root traceability and bootstrap contracts.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract verification | `session_bootstrap` output shape vs schema/docs | targeted handler checks, README/schema review |
| Documentation verification | root packet, Phase 021, Phase 027, runtime agent docs | `validate.sh`, file diff review |
| Hook/runtime verification | Gemini compact recovery fencing, Claude stop-hook autosave selection | focused hook tests or script-driven evidence |
| Regression review | packet closeout state after remediation | deep-review rerun against `024-compact-code-graph` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent deep review active registry | Internal | Green | Without it, the packet loses its evidence basis |
| Current runtime handler behavior in `session-bootstrap.ts` and hook files | Internal | Yellow | Ambiguous live behavior blocks truth-sync decisions |
| Root packet evidence ownership for phases 015/016 | Internal | Yellow | Checklist repair can stall if shipped proof stays ambiguous |
| Future deep-review rerun | Internal | Yellow | Parent packet cannot be re-cleared confidently without it |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation path broadens beyond the active findings or breaks an existing runtime contract without a replacement proof path.
- **Procedure**: Revert the specific workstream change set, restore the previous packet wording, and reopen the finding explicitly instead of leaving mixed truth states in-tree.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (triage) ---> Phase 2 (blocker remediation) ---> Phase 3 (rerun)
                         |          |          |
                         |          |          +--> WS-5 depends on WS-1 contract clarity
                         |          +-------------> WS-4 depends on root bootstrap-first contract truth
                         +------------------------> WS-2 and WS-3 can run in parallel after triage
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Triage | Review report and current packet tree | All remediation workstreams |
| WS-1 / WS-2 / WS-3 | Triage | Rerun confidence |
| WS-4 | Triage and current recovery contract decision | Rerun confidence |
| WS-5 | Triage and structural budget decision | Rerun confidence |
| WS-6 | P1 closure decision | Optional maintenance cleanup |
| Rerun | WS-1 through WS-5 complete | Parent packet closeout |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Triage and contract decisions | Medium | 2-4 hours |
| WS-1 and WS-2 | Medium | 3-6 hours |
| WS-3 | High | 4-8 hours |
| WS-4 and WS-5 | Medium | 3-6 hours |
| Verification and deep-review rerun | Medium | 2-5 hours |
| **Total** |  | **14-29 hours** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture before-state evidence for each workstream owner file
- [ ] Record whether each finding is being fixed in code, documentation, or both
- [ ] Keep the advisory WS-6 changes isolated from blocker remediation

### Rollback Procedure
1. Revert the failing workstream only.
2. Restore the previous documented claim if the implementation is also reverted.
3. Re-run targeted verification for the affected runtime or packet surface.
4. Mark the finding as still active rather than leaving partial remediation in place.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — changes are limited to runtime code paths and packet documentation
<!-- /ANCHOR:enhanced-rollback -->
