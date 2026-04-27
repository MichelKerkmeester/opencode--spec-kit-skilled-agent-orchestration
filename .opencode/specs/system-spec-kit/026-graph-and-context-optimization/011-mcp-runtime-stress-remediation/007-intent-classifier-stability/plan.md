---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: intent classifier stability [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability/plan]"
description: "Normalized IntentTelemetry schema + paired paraphrase corpus + cross-CLI drift metric."
trigger_phrases:
  - "intent classifier stability plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability"
    last_updated_at: "2026-04-27T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: intent classifier stability

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP server, intent-classifier subsystem |
| **Storage** | None (test fixtures) |
| **Testing** | vitest |

### Overview
Two-part fix: (a) schema — emit normalized `IntentTelemetry` separating taskIntent from backendRouting. (b) stability — paired paraphrase corpus with 20+ pairs covering all 6 intents and cross-CLI variants.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 005 Cluster 2 floor confirmed in place
- [x] 007/Q8 contract clear

### Definition of Done
- [ ] All REQs PASS
- [ ] Paraphrase corpus green
- [ ] dist marker grep PASS
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema additive layer + new test corpus.

### Key Components
- `lib/search/intent-classifier.ts`: emit `IntentTelemetry` shape per 007 §5 Q8.
- `handlers/memory-context.ts:1180-1191, 1576-1583`: pass-through with classificationKind already added in 005; extend to full schema.
- `tests/intent-paraphrase-stability.vitest.ts`: new corpus.

### Data Flow
```
query -> classify -> emit IntentTelemetry { taskIntent, backendRouting, paraphraseGroup? }
       -> handler embeds in response meta
       -> backward-compat aliases (type, confidence) preserved
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source
- [ ] Read intent-classifier.ts + memory-context.ts:1180-1191/1576-1583
- [ ] Define `IntentTelemetry` type
- [ ] Update classifier to emit shape (preserve existing fields as aliases)
- [ ] Add `paraphraseGroup` derivation (keyword-overlap heuristic for v1)

### Phase 2: Corpus
- [ ] Author 20+ paraphrase pairs across 6 intents (understand, fix_bug, add_feature, refactor, debug, search/etc.)
- [ ] Author 5+ cross-CLI variants
- [ ] Stability assertion: same intent label, confidence drift < 0.30

### Phase 3: Verify
- [ ] vitest sweep
- [ ] npm run build
- [ ] dist marker grep
- [ ] Document daemon restart
- [ ] Live `memory_context({input:"Semantic Search"})` after restart; verify normalized shape
- [ ] Update implementation-summary.md
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | IntentTelemetry shape | vitest |
| Stability | Paraphrase corpus | vitest fixture |
| Cross-CLI | Style variants | vitest fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005 Cluster 2 | Internal | Green | Floor must remain |
| 007/Q8 | Internal | Yellow | Lower evidence; document gap |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Schema change breaks downstream parsers.
- **Procedure**: Revert; aliases preserve compat so risk is minimal.
<!-- /ANCHOR:rollback -->
