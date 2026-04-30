---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: code_graph fail-fast routing [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/plan]"
description: "Add fallbackDecision routing field to blocked code-graph read payloads; preserve allowInlineFullScan:false."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "code graph fast fail plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail"
    last_updated_at: "2026-04-27T09:42:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: code_graph fail-fast routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP server, code-graph subsystem |
| **Storage** | sqlite (graph DB) |
| **Testing** | vitest |

### Overview
Additive routing field on blocked/degraded payloads. No behavior change to scan logic itself — only the contract for what callers should do next.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 005/REQ-017 + 007/Q6 contract clear

### Definition of Done
- [ ] All REQs PASS
- [ ] dist marker grep PASS
- [ ] Live probe verifies fallbackDecision
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Server-side machine-readable routing contract.

### Key Components
- `code_graph/handlers/query.ts:775-796`: blocked-payload assembly site.
- `code_graph/lib/ensure-ready.ts:151-220`: state detection (no change; reference only).

### Data Flow
```
query -> readiness check -> if blocked: build payload with fallbackDecision
       -> if fresh: return structural results (no fallbackDecision)
       -> if selective stale: self-heal + return (no fallbackDecision)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source
- [ ] Read query.ts:775-796 + ensure-ready.ts:151-220
- [ ] Define `FallbackDecision` type per 007 §5 Q6
- [ ] Add fallbackDecision to blocked-payload builder in `buildGraphQueryPayload()`
- [ ] Map readiness states to FallbackDecision values per 007 §5 Q6 routing rules

### Phase 2: Tests
- [ ] Add test: empty graph state → fallbackDecision.nextTool:"code_graph_scan", reason:"full_scan_required", retryAfter:"scan_complete"
- [ ] Add test: stale+full_scan state → same fallbackDecision
- [ ] Add test: stale+selective state → no fallbackDecision (self-heal path)
- [ ] Add test: fresh state → no fallbackDecision
- [ ] Add test: unavailable/error → fallbackDecision with reason:"scan_failed" or appropriate value
- [ ] Add regression test confirming allowInlineFullScan:false unchanged

### Phase 3: Verify + naming disambiguation
- [ ] Run vitest suite
- [ ] npm run build
- [ ] dist marker grep for `fallbackDecision`, `nextTool`, `code_graph_scan`
- [ ] Audit naming collision per 005/REQ-017: search code for "Code Graph" and "causal graph" naming in startup hooks vs causal-stats; rename to qualified nouns
- [ ] Live probe `code_graph_query({operation:"callers", subject:"handleCodeGraphQuery"})`
- [ ] Update implementation-summary.md
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-state fallbackDecision shape | vitest |
| Regression | allowInlineFullScan:false preserved | vitest |
| Live probe | After daemon restart | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007 research | Internal | Green | Defines contract |
| Packet 013 | Internal | Green | Restart procedure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Routing field breaks downstream consumers.
- **Procedure**: Revert patch; field is additive so rollback is safe.
<!-- /ANCHOR:rollback -->
