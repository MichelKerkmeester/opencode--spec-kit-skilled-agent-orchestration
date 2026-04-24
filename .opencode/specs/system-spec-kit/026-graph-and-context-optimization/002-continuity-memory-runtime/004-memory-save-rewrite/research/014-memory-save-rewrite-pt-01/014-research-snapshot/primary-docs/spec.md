---
title: "...emory-runtime/004-memory-save-rewrite/research/014-memory-save-rewrite-pt-01/014-research-snapshot/primary-docs/spec]"
description: "Investigate whether generate-context.js and its save-flow backend remain proportionate to the remaining value after [spec]/memory/*.md retirement (v3.4.1.0 + 013 r2), or whether a simpler operator-visible command could do the work with less machinery."
trigger_phrases:
  - "save flow relevance"
  - "generate-context relevance"
  - "backend proportionality"
  - "save path audit"
  - "memory save simplification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-save-flow-backend-relevance-review"
    last_updated_at: "2026-04-15"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Seeded research packet for save-flow backend relevance post-v3.4.1.0"
    next_safe_action: "Dispatch 20 deep-research iterations via cli-codex"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js"
      - ".opencode/skill/system-spec-kit/scripts/core/workflow.ts"
      - ".opencode/command/memory/save.md"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-save-flow-backend-relevance-review-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is generate-context.js still load-bearing after [spec]/memory/*.md retirement?"
      - "Could an operator-visible command (e.g., /memory:save with better output) replace the save-flow backend?"
      - "What fraction of the save-flow code is now dead, vestigial, or over-engineered relative to the simplified contract?"
      - "What are the concrete risks of a simpler manual-update path vs the current automated pipeline?"
      - "Which save-flow features still deliver proportional value (semantic indexing, entity linking, quality gates, content routing, graph-metadata refresh, trigger-phrase harmonization, _memory.continuity sync)?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Research Seed: Save-Flow Backend Relevance Review Post-Memory-Folder Retirement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## PURPOSE

`v3.4.1.0` retired the `[spec]/memory/*.md` write path and routed save content into canonical spec docs via the content-router. The runtime kept a substantial save-flow backend around that routing (generate-context.js orchestrator, mcp_server/handlers/memory-save.ts, content-router, routing-prototypes.json, reconsolidation-bridge, pe-gating, chunking-orchestrator, quality gates, entity extraction, cross-doc linking, graph-metadata refresh, _memory.continuity sync). The question is whether that backend is still proportionate now that its original production artifact is gone.

Hypothesis (to test in this research, not asserted as truth): maybe an operator-visible command with better output could let the AI manually update canonical docs with less machinery, and some of the save-flow code is now dead weight.

## RESEARCH SCOPE

In scope:
- Live call graph of `generate-context.js` (scripts/dist/memory/generate-context.js) and everything it transitively invokes on a save
- mcp_server handlers and libs touched by a save: memory-save.ts, content-router.ts, routing-prototypes.json, reconsolidation-bridge, pe-gating, chunking-orchestrator, memory-crud-utils, vector-index mutations
- Scripts-side `core/workflow.ts` post-F026/F030 trim (F028-F040 closures already applied)
- Canonical spec docs that receive routed content (implementation-summary.md, decision-record.md, handover.md, research/research.md, tasks.md)
- `_memory.continuity` frontmatter block contract
- Graph-metadata.json refresh behaviour on save
- Trigger-phrase harmonization, entity extraction, cross-doc entity linking on save
- Quality gates (near-duplicate detection, sufficiency validation, V-rule enforcement, template contract validation)

Out of scope:
- MCP retrieval path (`memory_search`, `memory_context`, `memory_quick_search`) — retrieval-only, not save-flow
- Vector indexing internals (VectorIndex class API, better-sqlite3 transaction semantics) — already audited in BUG-001/BUG-002
- Stop-hook `runContextAutosave` — lifecycle trigger, not flow shape
- Code-graph MCP server — unrelated to save-flow

## RESEARCH QUESTIONS (initial)

1. **Load-bearingness**: For each save-flow subsystem, what is the user-visible behaviour loss if it is removed? (Categorise as: load-bearing, partial value, over-engineered, dead.)
2. **Command substitution feasibility**: Could a redesigned `/memory:save` (operator-visible, structured output, AI reads the diff it needs to apply) replace the current automated pipeline? What's the concrete design?
3. **Quality gate value**: Which quality gates (near-duplicate, sufficiency, V-rule, template contract) actually prevent real defects today vs gate ceremonial content?
4. **Semantic indexing dependency**: How much of the save-flow exists to feed the vector index vs to mutate canonical docs? Could retrieval-side re-indexing run independently of save-side work?
5. **Graph-metadata refresh necessity**: Could graph-metadata refresh be a separate command invocation instead of being tied to every save?
6. **Entity extraction + cross-doc linking value**: Does entity extraction earn its runtime cost given the retrieval-side smart-ranking already works without it? Can it be deferred to an indexing pass?
7. **Reconsolidation-bridge scope**: Is the PE-Gate reconsolidation logic (supersede / reinforce / create-linked) still proportionate when the content-router already routes to stable canonical docs?
8. **Routing-prototypes.json classifier scope**: Does the 8-category content-router need Tier 1 + Tier 2 + optional Tier 3 LLM reformulation, or has the router design been over-fitted?
9. **Trigger-phrase harmonization value**: Does harmonizing trigger_phrases at save time add retrieval value vs a lazy at-indexing harmonization?
10. **Continuity sync behaviour**: Is `_memory.continuity` frontmatter sync during save essential, or could AI update it directly via Edit (like it already does for some continuity hints per CLAUDE.md)?

## SUCCESS CRITERIA

- Categorised verdict per subsystem: load-bearing / partial-value / over-engineered / dead
- Proposed minimal replacement design for the subsystems classified as over-engineered or dead
- Concrete risk analysis per proposed simplification
- Decision recommendation: keep / trim / replace / redesign (with primary rationale each)

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `v3.4.1.0` release notes: `.opencode/changelog/01--system-spec-kit/v3.4.1.0.md`
- `013-memory-folder-deprecation-audit/` parent r2 audit
- `012-spec-kit-commands/` closed M9 middleware cleanup
- `.opencode/command/memory/save.md` operator-visible save command
- `.opencode/skill/system-spec-kit/SKILL.md` canonical memory routing model
<!-- /ANCHOR:cross-refs -->
