# Strategy - 014 implementation review

## Review Charter

### Non-Goals
- Re-running the original research loop or grading the quality of `plan.md` as planning work.
- Modifying implementation files or fixing the packet in-place.
- Auditing sibling packets except where packet-014 docs explicitly depend on them.

### Stop Conditions
- A shipped-behavior correctness regression is proven with file:line evidence.
- Packet evidence cannot be reconciled because a cited artifact is missing on disk.
- Ten focused review iterations complete without a stronger convergence signal.

### Success Criteria
- Every recorded finding is about the implementation output and includes file:line evidence.
- The review covers correctness, traceability, verification quality, docs/code drift, and durable telemetry behavior.
- The final report leaves a clear future-fix queue with concrete target files.

## Scope

Files to audit:
- Packet docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `resource-map.md`
- Implementation files from `implementation-summary.md`
- Paired automated coverage and direct verification surfaces referenced by the packet

Sources of evidence:
- Packet docs in the requested read order
- Target files under `.opencode/plugins/`, `.opencode/plugin-helpers/`, and `.opencode/skill/system-spec-kit/mcp_server/**`
- Existing hook and handler vitest coverage for Codex, advisor handlers, privacy, and runtime parity
- Filesystem truth for whether cited packet artifacts actually exist

## Initial Hypotheses

1. Correctness: public `advisor_recommend` caching may not fully isolate explicit `workspaceRoot`.
2. Regression risk: packet 014 may still have renderer drift between the shared builder and the hook-visible shared renderer.
3. Test coverage: verification notes may not actually prove the newly changed Codex success path.
4. Error paths: durable JSONL telemetry may be robust for diagnostics but brittle for outcomes.
5. Concurrency/isolation: cache and temp-file behavior may blur workspace or run boundaries.
6. Contract boundaries: `skillSlug` validation may scope corpus slices but not telemetry summaries.
7. Cross-runtime parity: docs may claim parity while some surfaces still use older formatting or stale lineage.
8. Observability: packet evidence may overstate what was persisted or verified.
9. Docs-vs-code drift: packet docs may still describe research-only work or stale research lineage.
10. Auditability: packet-local evidence may be missing even though checklist items are marked complete.

## Iteration Plan

1. Packet scope and spec-to-implementation alignment
2. Evidence ledger and applied report integrity
3. `advisor_recommend` correctness and cache isolation
4. Shared builder vs shared renderer contract
5. Codex verification evidence and success-path traceability
6. Durable telemetry corruption handling
7. `skillSlug` validation semantics vs telemetry scope
8. Resource-map quality and lineage hygiene
9. Privacy / prompt-safety stabilization pass
10. Final convergence pass across remaining target files and docs
