---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: intent classifier stability [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability/tasks]"
description: "Per-REQ work units for IntentTelemetry normalized schema + paraphrase stability corpus."
trigger_phrases:
  - "intent classifier stability tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability"
    last_updated_at: "2026-04-27T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: intent classifier stability

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Author spec/plan/tasks
- [ ] T002 [P] Author implementation-summary.md placeholder
- [ ] T003 [P] Generate description.json + graph-metadata.json
- [ ] T004 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T101 Read mcp_server/lib/search/intent-classifier.ts (focus on classifyIntent function around line 404 per 005)
- [ ] T102 Read mcp_server/handlers/memory-context.ts:1180-1191 + :1576-1583 (where classificationKind annotations live from 005)
- [ ] T103 Define `IntentTelemetry` type per 007 §5 Q8:
    type IntentTelemetry = {
      taskIntent: { intent: string; confidence: number; classificationKind: "task-intent"; evidence: string[] };
      backendRouting: { route: string; confidence: number; classificationKind: "backend-routing"; seeAlso: "meta.intent" };
      paraphraseGroup?: string;
    }
- [ ] T104 Update classifier to emit IntentTelemetry. Preserve existing `meta.intent.type` and `meta.intent.confidence` as backward-compat aliases of `taskIntent.intent` and `taskIntent.confidence`
- [ ] T105 Implement simple `deriveParaphraseGroup(query)` heuristic — e.g., keyword-overlap or sorted-keyword hash
- [ ] T106 Update memory-context handler to embed full IntentTelemetry in response

### Paraphrase Corpus (NEW FILE)
- [ ] T201 Create mcp_server/tests/intent-paraphrase-stability.vitest.ts
- [ ] T202 Author 20+ paraphrase pairs covering 6 intents:
  - understand: "Semantic Search" / "Find stuff related to semantic search" / "Tell me about semantic search" / "What does semantic search mean"
  - fix_bug: "fix the login bug" / "the login is broken, fix it" / "debug login failure"
  - add_feature: "add dark mode toggle" / "implement dark mode" / "build a dark mode feature"
  - refactor: "refactor the auth module" / "clean up auth code" / "restructure auth"
  - debug: "debug the slow query" / "why is this query slow" / "investigate slow query"
  - At least 5 cross-CLI variants (codex / copilot / opencode prompt styles for the same intent)
- [ ] T203 Stability assertion per pair: assert all paraphrases classify to the SAME task intent label
- [ ] T204 Confidence drift assertion: |max(conf) - min(conf)| < 0.30 within a paraphrase group

### Existing test updates
- [ ] T301 Update mcp_server/tests/intent-classifier.vitest.ts to add at least 1 IntentTelemetry shape assertion
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T401 `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/intent-paraphrase-stability.vitest.ts tests/intent-classifier.vitest.ts` → green
- [ ] T402 npm run build
- [ ] T403 grep dist for `taskIntent`, `backendRouting`, `paraphraseGroup`, `classificationKind` markers
- [ ] T404 Document daemon restart
- [ ] T405 After restart: live `memory_context({input:"Semantic Search", mode:"auto"})` probe; verify normalized shape
- [ ] T406 Mark all REQ-001..004 PASSED
- [ ] T407 `validate.sh --strict` PASS
- [ ] T408 Commit + push: `feat(mcp/intent): normalized IntentTelemetry + paraphrase stability corpus per 007/Q8 + 005/REQ-001/004/016`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] REQ-001..004 PASSED
- [ ] Live probe verification recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Sources**: ../005-memory-search-runtime-bugs (REQ-001, REQ-004, REQ-016), ../002-mcp-runtime-improvement-research (Q8)
<!-- /ANCHOR:cross-refs -->
