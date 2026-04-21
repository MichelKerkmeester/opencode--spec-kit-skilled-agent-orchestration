---
title: "Implementation Plan: Canonical-Save Hardening"
description: "3-wave plan: Wave A lineage runtime parity, Wave B packet-root repair for 007/008/009/010, Wave C new validator assertions."
trigger_phrases:
  - "canonical save hardening plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T23:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch implementation"

---
# Implementation Plan: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript (MCP server), Bash (validator), Zod schema |
| **Runtime** | Node v25.6.1 |
| **Build** | esbuild dist |

### Overview

Implement 3 waves sequentially. Wave A: fix runtime parity so `save_lineage` actually persists. Wave B: repair 4 structural packet-root gaps. Wave C: add 5 validator rules with grandfathering.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research converged (019/001/001 research.md)
- [x] Spec scope approved

### Definition of Done
- [ ] All 3 waves pass their specific acceptance criteria
- [ ] No regression in existing validator or mcp_server test suite
- [ ] Checklist fully verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Phased rollout with independent acceptance per wave. Wave A can land first (no dependency). Wave B parallel-able with Wave A. Wave C depends on Wave A landing.

### Key Components

- `mcp_server/api/indexing.ts` — widen to accept refresh options
- `scripts/dist/**` — rebuild after source changes
- `026/007..010/spec.md` — new coordination-parent root docs
- `scripts/rules/check-canonical-save.sh` — new rule script
- `scripts/spec/validate.sh` — add 5 dispatch entries

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Wave A — Lineage runtime parity
- [ ] Widen `indexing.ts` `refreshGraphMetadata` signature
- [ ] Update callers in `workflow.ts`
- [ ] Rebuild dist (workflow, parser, schema)
- [ ] Add regression tests at workflow + indexing layers

### Phase 2: Wave B — Packet-root remediation
- [ ] Author 4 coordination-parent `spec.md` files (007/008/009/010)
- [ ] Run generate-context.js on each to refresh graph-metadata + description
- [ ] Confirm `derived.source_docs` non-empty

### Phase 3: Wave C — Validator rollout
- [ ] Write `scripts/rules/check-canonical-save.sh` with 5 rule implementations
- [ ] Add dispatch entries to `validate.sh`
- [ ] Update `show_help()` to list new rules
- [ ] Test against synthetic broken fixtures + current active packets
- [ ] Document grandfathering cutoff timestamps

### Phase 4: Verification
- [ ] `validate.sh --strict` passes on 026 tree (with allowlist)
- [ ] Regression suite green
- [ ] Update checklist.md with evidence
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:implement :auto --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | indexing wrapper signature | vitest |
| Integration | workflow.ts → graph-metadata persistence | vitest |
| Structural | `validate.sh --strict` on active packets | bash |
| Regression | full mcp_server test suite | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Node v25.6.1 | Runtime | Green |
| esbuild | Build | Green |
| 019/001/001 research | Input | Converged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Wave A**: revert indexing.ts + dist files; existing runtime keeps current (broken) behavior but nothing worse
- **Wave B**: revert spec.md creations; 007-010 return to current state
- **Wave C**: comment out new rule dispatches in validate.sh; no behavior change
<!-- /ANCHOR:rollback -->
