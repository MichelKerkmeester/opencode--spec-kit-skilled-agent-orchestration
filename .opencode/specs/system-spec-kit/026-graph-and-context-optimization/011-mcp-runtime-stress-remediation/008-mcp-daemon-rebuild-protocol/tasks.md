---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: MCP daemon rebuild + restart protocol [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/tasks]"
description: "Author the 4 reference docs that codify the canonical rebuild + restart verification contract."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "MCP rebuild restart protocol tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol"
    last_updated_at: "2026-04-27T10:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Write the docs"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: MCP daemon rebuild + restart protocol

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
- [ ] T101 Create references/ subdir
- [ ] T102 Author references/mcp-rebuild-restart-protocol.md with the 4-part contract per 007 §5 Q1:
    1. sourceDiffPaths — list of MCP source files changed
    2. targetedTests — `cd mcp_server && npx vitest run <files>` command + pass output
    3. distVerification — `npm run build` clean + dist file timestamps newer than source AND new marker grep returns hit
    4. runtimeRestart — restart command for the MCP-owning client (varies; OpenCode/Codex/Claude)
    5. liveProbe — actual MCP tool response after restart, captured verbatim
    Include the lesson from 005 post-remediation: build alone is insufficient; client restart is mandatory.
- [ ] T103 Author references/live-probe-template.md with canonical probes:
    - memory_context: `memory_context({input:"Semantic Search", mode:"auto", includeTrace:true, tokenUsage:0.02})`
    - memory_search: `memory_search({query:"search bug debugging"})`
    - code_graph_query: `code_graph_query({operation:"callers", subject:"handleCodeGraphQuery"})`
    - causal_stats: `memory_causal_stats()`
    - For each: state expected outcome (e.g., for memory_context — task intent "understand", classificationKind separate, payload non-empty if budget allows)
- [ ] T104 Author references/dist-marker-grep-cheatsheet.md with grep patterns per layer:
    - handlers/memory-context.js → preEnforcementTokens, returnedTokens, droppedAllResultsReason (packet 008)
    - formatters/search-results.js → responsePolicy, citationPolicy (packet 014)
    - lib/search/recovery-payload.js → ask_disambiguation (packet 014)
    - code_graph/handlers/query.js → fallbackDecision, nextTool (packet 010)
    - handlers/causal-graph.js → deltaByRelation, balanceStatus (packet 011)
    - lib/search/intent-classifier.js → taskIntent, backendRouting, paraphraseGroup (packet 012)
- [ ] T105 Author references/implementation-verification-checklist.md as a copy-paste markdown block for implementation-summary.md "Verification" sections. Include 5 rows:
    - [ ] Source diff captured: `<list of files>`
    - [ ] Targeted vitest PASS: `<command + result>`
    - [ ] dist build clean + marker present: `npm run build` + `grep -l <marker> dist/<file>.js`
    - [ ] MCP-owning client restart documented (or completed by user)
    - [ ] Live MCP probe response captured verbatim
- [ ] T106 In packet 008 implementation-summary.md, replace the placeholder restart text with a citation to packet 013 (one-line link)
- [ ] T107 In packet 014 implementation-summary.md, add a citation to packet 013
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T201 All 4 reference docs lint-clean (no broken markdown)
- [ ] T202 `validate.sh --strict` on packet 013 → PASS
- [ ] T203 `grep -r "008-mcp-daemon-rebuild-protocol" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/` shows at least 1 sibling packet citing it
- [ ] T204 Commit + push: `docs(026/003/013): MCP daemon rebuild + restart protocol from 005 lesson + 007/Q1`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] 4 reference docs exist
- [ ] At least 1 sibling cite
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Sources**: ../005-memory-search-runtime-bugs (post-remediation lesson), ../002-mcp-runtime-improvement-research (Q1, §11 Rec #1)
- **Cited by**: ../003-memory-context-truncation-contract, ../009-memory-search-response-policy (and others)
<!-- /ANCHOR:cross-refs -->
