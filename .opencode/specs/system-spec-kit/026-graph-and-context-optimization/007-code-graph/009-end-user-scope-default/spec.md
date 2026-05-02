---
title: "Feature Specification: End-User Scope Default for Code Graph Indexing"
description: "Code graph currently indexes everything under .opencode/skill/, polluting end-user code searches with skill/system internals. Default should be end-user-repo-only; skill indexing must require an explicit opt-in feature flag."
trigger_phrases:
  - "end user scope default"
  - "code graph skill indexing"
  - "skill code indexing flag"
  - "code graph opt-in"
  - "end-user-only indexing"
  - "speckit_code_graph_index_skills"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T11:41:37Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Plan tasks checklist resource-map authored"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Scope decision lives in code_graph/lib/indexer-types.ts plus lib/utils/index-scope.ts."
      - "Default exclusion should be path-prefix based for .opencode/skill/**."
      - "Opt-in granularity should be all skill internals on/off via SPECKIT_CODE_GRAPH_INDEX_SKILLS=true or includeSkills:true."
      - "Existing graph migration should force a loud full scan because incremental cleanup will not remove existing out-of-scope files."
      - "Advisor and skill graph use separate metadata storage and should not block this change."
      - "Validation/readiness surfaces need messaging only; no broad validation orchestrator scope rewrite is required."
      - "CocoIndex is separate and should be a follow-up if semantic scope cleanup is needed."
      - "Current live DB impact is 1,571/1,619 files and 34,274/34,850 nodes under .opencode/skill."
      - "Backward compatibility is explicit maintainer opt-in, not old default behavior."
      - "ADR-005 invariance holds if Gate 3/spec-level/public workflow text stays unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: End-User Scope Default for Code Graph Indexing

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The code graph (`mcp__spec_kit_memory__code_graph_scan`) currently indexes ALL workspace code, including 1,619 files / 34,844 nodes / 17,846 edges that include hundreds of spec-kit internal files end users never query. End users querying their application code get results polluted with spec-kit internals. This packet investigates and decides: make end-user-repo-only the **default**, gate skill indexing behind a new opt-in feature flag. Deep-research will produce the implementation plan.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-end-user-scope-default |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft (pre-research) |
| **Owner** | (TBD post-research) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Latest scan: 1,619 files / 34,844 nodes / 17,846 edges, with hundreds of those nodes being spec-kit MCP server internals (skill_advisor, code_graph subsystems, sk-* skills). End users get noisy results.

### Why This Matters

- **End-user UX degradation**: A user asking "find callers of my `processOrder` function" gets results mixed with calls inside the spec-kit's orchestrator.ts.
- **Performance**: ~1,619 file-scans includes hundreds of skill files end users never query.
- **Storage waste**: 34,844 nodes / 17,846 edges, significant fraction is dead weight.
- **Conceptual mismatch**: spec-kit ships AS infrastructure. Its internal code is implementation, not user-facing surface.

### Goal

End-user-repo-only is the **default**. Skill code indexing becomes opt-in via feature flag (e.g., `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or a `capability-flags.ts` entry). Maintainers working ON the spec-kit enable the flag; end users get a clean repo-only graph.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### IN SCOPE

- Investigate WHERE the indexing scope decision lives today.
- Design the feature flag surface (env var / capability-flags.ts / opencode.json field / per-call API).
- Decide the default (end-user-only with opt-in).
- Define the precise default exclude path list.
- Migration path for existing indexed databases.
- Identify consumers that may break if skill nodes disappear.
- Investigate adjacent systems (validation orchestrator, advisor, CocoIndex).

### OUT OF SCOPE (this packet)

- Implementing the change (deep-research output → plan; implementation is a follow-on packet).
- Changing memory index scope.
- Re-architecting the code graph schema.
- Backporting to historical packet graphs.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional

- F1: Default `code_graph_scan` MUST exclude `.opencode/skill/` and adjacent skill-related paths.
- F2: A documented feature flag MUST enable skill indexing on demand.
- F3: Existing maintainer workflow (developing on spec-kit itself) MUST have a documented one-step setup for skill indexing.
- F4: Default behavior MUST not silently break consumers (advisor, hooks, blast_radius queries).

### Non-Functional

- NF1: Default scan time SHOULD improve proportionally to excluded file count.
- NF2: New flag surface MUST follow ADR-005 workflow invariance (no banned vocabulary in user-facing prose).
- NF3: Migration MUST be loud (warning) for existing maintainers, silent for end users.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Deep-research converges (≤5 iterations or threshold 0.05) on a recommendation: which flag surface, what default, what exclude paths, what migration path.
- Decision-record ADR-001 finalized with chosen design.
- Plan.md sketches a concrete refactor with file-level deltas.
- Risk register populated with consumer-impact findings.
- All research questions answered explicitly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **R1 (P0)**: Existing maintainers lose code-graph functionality silently if migration isn't loud enough.
- **R2 (P1)**: Advisor and skill_graph systems may break if they assume code graph contains skill internals.
- **R3 (P1)**: Hooks triggering code_graph_scan on session start may produce different result sets.
- **R4 (P2)**: CocoIndex semantic search has its own embeddings; separate cleanup needed.
- **R5 (P2)**: Existing graph databases that indexed skills won't auto-prune; need explicit `--rebuild`.

### Dependencies

- `mcp_server/lib/code_graph/scanner.ts`
- `mcp_server/lib/code_graph/exclude-rules.ts` (or equivalent)
- `mcp_server/lib/config/capability-flags.ts` (potential flag home)
- `opencode.json` (alternative flag home)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Same as §4 NFR set.
- Backward compat: `code_graph_scan({ includeSkills: true })` MUST work as opt-in if API-parameter route is chosen.

## 8. EDGE CASES

- User runs scan with no flag set → default end-user-only.
- Maintainer runs scan with flag set → skill files included.
- Mixed scan: previously-indexed skill nodes + new end-user-only scan → handle stale skill nodes gracefully.
- Scan triggered by hook (SessionStart) → which scope applies?

## 9. COMPLEXITY ASSESSMENT

- Code change: ~50-200 LOC (scanner + flag wiring + tests).
- Test coverage: 4-6 new vitest cases.
- Documentation: 2-3 README/SKILL.md edits.
- Estimated impl-only effort post-research: 4-8 hours focused.

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Severity |
|------|-----------|--------|----------|
| R1 silent maintainer breakage | M | H | P0 |
| R2 advisor break | M | M | P1 |
| R3 hook scope drift | L | M | P1 |
| R4 CocoIndex stale | L | L | P2 |
| R5 existing graph stale | H | L | P2 |

## 11. USER STORIES

- **US-1 (end user)**: As a Webflow developer using spec-kit, I want `code_graph_scan` to find callers of my JavaScript functions WITHOUT spec-kit internals appearing in results.
- **US-2 (spec-kit maintainer)**: As a contributor working on spec-kit MCP server code, I want a documented one-line opt-in to include skill code in the graph.
- **US-3 (CI/automation)**: As a CI script, I want the default scan to be smaller and faster.

## 12. OPEN QUESTIONS

(See `_memory.continuity.open_questions`. Will be resolved by deep-research.)
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- Sibling packet: `008-code-graph-backend-resilience/` (resilience research that may inform exclude-rule confidence tiers)
- Sibling packet: `003-code-graph-context-and-scan-scope/` (earlier scope work)
- Parent: `007-code-graph/spec.md`
- Architecture: `010-template-levels/002-template-greenfield-redesign/decision-record.md` (ADR-005 workflow invariance applies here)
- Implementation: `010-template-levels/004-deferred-followups/decision-record.md` (ADR-003 exit-code taxonomy may apply to new flag's error paths)
