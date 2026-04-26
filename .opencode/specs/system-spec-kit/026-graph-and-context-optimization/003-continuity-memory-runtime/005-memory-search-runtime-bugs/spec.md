---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/spec]"
description: "Findings spec cataloging /memory:search runtime bugs and refinements observed via live conversation + reproduction probes (intent classifier, truncation wrapper, output rendering, causal-stats hygiene)."
trigger_phrases:
  - "005-memory-search-runtime-bugs"
  - "memory search runtime bugs"
  - "memory_context truncation drops results"
  - "intent classifier dual-source dissonance"
  - "auto-triggered vocabulary violation"
  - "causal-stats relation omission"
  - "ephemeral session dedup"
  - "folder-discovery misfire"
  - "context quality degraded false hint"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs"
    last_updated_at: "2026-04-26T14:33:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored findings spec from live /memory:search reproduction"
    next_safe_action: "Cluster fixes by root cause, then sequence remediation work in plan.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:memory-search-runtime-bugs-2026-04-26"
      session_id: "005-memory-search-runtime-bugs-2026-04-26"
      parent_session_id: null
    completion_pct: 25
    open_questions:
      - "Is the truncation logic miscalculating per-result tokens, or is the wrapper over-pruning by design?"
      - "Should intent confidence below threshold T fall back to 'understand', or surface 'unknown'?"
      - "Are enabled/contradicts/derived_from edge types implemented but unused, or absent from the schema entirely?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: /memory:search Runtime Bugs and Refinements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Findings Captured |
| **Created** | 2026-04-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Sibling Phases** | `001-cache-warning-hooks`, `002-memory-quality-remediation`, `003-continuity-refactor-gates`, `004-memory-save-rewrite` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A live `/memory:search` session against the indexed-continuity runtime exposed contract violations and degraded UX across the retrieval, output rendering, and causal-graph subcommands. The empty-arguments gate fired correctly, but every downstream stage produced at least one observable defect: the intent classifier emitted `fix_bug` (confidence 0.098) for the query "Semantic Search" despite the spec mandating `understand` as the no-keyword-match fallback; the `memory_context` wrapper reported `truncated=true` and zero `results` while consuming only 2% of its 3000-3500 token budget; the assistant rendering used the explicitly-forbidden phrase "Auto-triggered memories"; `causal-stats` returned three of six valid relation types and labeled itself `health: "healthy"` while reporting `meetsTarget: false`. The root spec at `.opencode/command/memory/search.md` documents the intended behavior, but the runtime drifts from it on multiple axes.

### Purpose
Capture the bug catalog with reproducible runtime evidence so a subsequent remediation packet can address each cluster independently and re-verify against the same probes. This spec is intentionally findings-only — fixes belong to a follow-up implementation packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Documenting every observed defect from the conversation transcript and the live reproduction probes against `memory_context`, `memory_search`, and `memory_causal_stats`.
- Cross-referencing each defect against the canonical spec at `.opencode/command/memory/search.md` to separate documented contract violations from undocumented gaps.
- Clustering defects by root cause to enable independent remediation.
- Recording the literal probe output as evidence so later runs can detect regression or confirm a fix.

### Out of Scope
- Implementing fixes (deferred to a follow-up packet referenced from `plan.md`).
- Modifying the `/memory:search` command source file at `.opencode/command/memory/search.md`.
- Touching the runtime MCP server source code under `.opencode/skill/system-spec-kit/mcp_server/`.
- Re-architecting the hybrid retrieval pipeline (graph + vector + FTS5/BM25); only the observable surface defects are catalogued.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This findings spec. |
| `plan.md` | Create | Remediation strategy and root-cause clusters. |
| `tasks.md` | Create | Per-defect work units. |
| `implementation-summary.md` | Create | Placeholder until remediation lands. |
| `description.json` | Create | Spec metadata for memory indexing. |
| `graph-metadata.json` | Create | Graph-derived metadata for traversal. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Correctness Bugs (broken contract)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Intent classifier MUST honor the documented no-keyword-match fallback. | For queries with no keyword hit and `confidence < 0.30`, the classifier returns `understand` (per spec §4A "Default fallback") instead of an arbitrary low-confidence intent such as `fix_bug` (currently observed at 0.098 for "Semantic Search"). |
| REQ-002 | `memory_context` MUST NOT zero out results when token usage is far below budget. | Reproduction: `memory_context({input:"Semantic Search", mode:"auto"})` currently returns `meta.tokenBudgetEnforcement.{enforced:true, truncated:true, returnedResultCount:2}` with `actualTokens:71` against `budgetTokens:3000`, and `data.content[0].text` containing `{"count":0,"results":[]}`. After fix, when `actualTokens / budgetTokens < 0.50`, the result count must equal `originalResultCount`. |
| REQ-003 | Output rendering MUST use canonical vocabulary from spec §4A Step 4b. | Render layer (assistant or formatter) emits "Trigger-matched spec-doc records" and "Constitutional rules" — never "Auto-triggered memories", "Triggered memories", or "Memories". |
| REQ-004 | Single intent source-of-truth MUST be exposed per response. | Currently `meta.intent.type = "fix_bug"` (conf 0.098) and `data.queryIntentRouting.queryIntent = "semantic"` (conf 0.8) appear in the SAME response with different values. Define one as authoritative for downstream rendering and either remove the other or label it explicitly as a separate concern (e.g., backend-routing vs intent-classification). |

### P1 — Degraded Signal (incorrect data exposed to caller)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `causal-stats` MUST emit all six valid relation types (zero-filled if absent). | Spec §5B lists `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`. Runtime returns only the three with non-zero counts. After fix, `data.by_relation` always contains all six keys. |
| REQ-006 | `causal-stats` health field MUST agree with `meetsTarget`. | Currently returns `health: "healthy"` AND `meetsTarget: false`. After fix, `meetsTarget=false` ⇒ `health ∈ {"degraded","below_target"}`. |
| REQ-007 | `QUALITY=gap` flag MUST trigger automatic broadening before returning. | Spec §1 promises 3-tier FTS fallback (FTS5 → BM25 → Grep) on weak retrievals. Currently `avg_score:0.13`, `quality:"gap"` is reported but no broadening occurs. After fix, gap-flagged retrievals attempt at least one fallback tier before returning. |
| REQ-008 | Folder-discovery MUST NOT auto-bind on weak signal. | Currently "Semantic Search" caused `folderDiscovery.specFolder = "skilled-agent-orchestration/023-sk-deep-research-creation"` (no semantic relationship). After fix, folder-binding requires either explicit `specFolder` parameter or per-token similarity above a documented threshold. |
| REQ-009 | "Context quality is degraded" hint MUST be conditional on actual session state. | Currently emitted on every fresh ephemeral session. After fix, hint is suppressed when `sessionScope=="ephemeral"` and `eventCounterStart==0`. |
| REQ-010 | Causal-graph edge growth MUST be balanced across relation types. | Two snapshots ~15 minutes apart show 344 new edges, ALL `supersedes`. After fix, document the autonomous backfill job, expose its scope, and add per-relation coverage targets so `caused`/`supports`/etc. do not stagnate. |
| REQ-011 | Session deduplication MUST be effective across calls within a single user session. | Currently each `/memory:search` invocation gets a new ephemeral `effectiveSessionId`, so `enableDedup=true` never engages. After fix, command threads a stable session identifier (e.g., per OpenCode session) or documents the limitation explicitly. |

### P2 — Refinement Opportunities

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | CocoIndex daemon health MUST be checked before relying on the vector channel. | Current behavior: command attempts CocoIndex search, fails silently when daemon is down. After fix, command emits an explicit `WARN: vector channel unavailable, lexical-only` line in the result block when daemon is unreachable. |
| REQ-013 | Sub-target coverage MUST emit a remediation suggestion. | Currently `causal-stats` reports below-target coverage with no actionable hint. After fix, output includes "Top N unlinked records" or "Run X to backfill". |
| REQ-014 | AskUserQuestion custom-answer routing MUST be defined. | Spec §4 offers 7 intents + "Analysis tools". A custom answer like "Semantic Search" currently becomes the QUERY (auto-detect intent) — undocumented. Either document this routing or add explicit "Code search / Explore codebase" option that routes to CocoIndex. |
| REQ-015 | Trigger and constitutional channels SHOULD participate in dedup. | Currently the same 5 trigger matches resurface across calls in the same conversation; cosmetically redundant. |
| REQ-016 | Intent classifier MUST be stable across paraphrased queries. | "Semantic Search" → `fix_bug`; "Find stuff related to semantic search" → `understand`. Refinement: add a stability test corpus and tune keywords or add embedding-based classification for low-confidence cases. |
| REQ-017 | Naming collision between "code graph" (structural) and "causal graph" (memory) MUST be disambiguated. | Currently the startup hook says `Code Graph: empty` while `causal-stats` reports 1135 edges across 675 linked records. After fix, startup hook says "structural code graph" and `causal-stats` says "memory causal graph", or reuse a single canonical noun.|
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** a query with no documented intent keywords, **when** the classifier runs with confidence below 0.30, **then** it returns `understand` per spec §4A.

**Given** a `memory_context` call where `actualTokens` is under 50% of `budgetTokens`, **when** the response is built, **then** `returnedResultCount` equals `originalResultCount` and `data.content` contains the actual results (not `count:0,results:[]`).

**Given** a `causal-stats` call, **when** the response is built, **then** `by_relation` contains all six valid relation keys (zero-filled if absent) and `health` agrees with `meetsTarget`.

**Given** an empty-results situation with trigger matches, **when** the formatter renders, **then** the heading reads "Trigger-matched spec-doc records (matched on phrase \"<keyword>\")" and never "Auto-triggered memories".

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every defect in §4 has a reproducible probe (command + expected literal output diff) recorded in `tasks.md`.
- **SC-002**: Defects are clustered by root cause in `plan.md` so remediation can proceed cluster-by-cluster.
- **SC-003**: The follow-up remediation packet, when implemented, can re-run the probes here and observe each acceptance criterion pass.
- **SC-004**: Validation passes via `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Some defects may share a single root cause; over-counting could inflate scope. | Medium | `plan.md` clusters defects by root cause before remediation work begins. |
| Risk | Probes are timestamp-bound (causal-graph edge counts grow); regression detection needs a different metric. | Low | Use coverage percent and presence-of-relation-type rather than absolute edge counts. |
| Dependency | Remediation work touches `mcp_server/` source which is owned by sibling phases. | High | Coordinate with `004-memory-save-rewrite` and any active 005-memory-indexer-invariants work before landing changes. |
| Dependency | CocoIndex daemon must be runnable for REQ-012 verification. | Medium | Document the start command and add a smoke test before remediation lands. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the truncation logic miscalculating per-result tokens, or is the wrapper over-pruning by design? Probe: log `tokenUsageSource`, per-result token estimate, and pruning decisions to identify whether estimates are inflated 30-50× (which would explain dropping at 2% reported usage).
- Should intent confidence below threshold T fall back to `understand`, or surface a sentinel `unknown`? Spec says fallback is `understand`; runtime appears to skip the fallback.
- Are `enabled`, `contradicts`, `derived_from` edge types implemented in the schema but unused, or absent entirely? Inspect `causal_edges` table and `memory_causal_link` enum to confirm.
- Why does `health: "healthy"` co-exist with `meetsTarget: false`? Either definition is wrong, or "healthy" measures something else (orphaned edges = 0?).
- Is the supersedes-only edge growth driven by an autonomous backfill job? If so, where does it live, and how can other relation types participate?

### POST-REMEDIATION VERIFICATION (captured 2026-04-26 18:49)

Live MCP probes after the parallel remediation agent reported Cluster 1-3 P0 fixes landed. Verdict: **fixes NOT live in the running runtime.** Source patches may have been authored but `dist/` rebuild and/or MCP daemon restart was missed.

Probe A — Cluster 2 (intent classifier, REQ-001/004) regression:
```
memory_context({input:"Semantic Search", mode:"deep"})
→ meta.intent.type        = "fix_bug"     ← expected "understand" per fix
  meta.intent.confidence  = 0.0980        ← below 0.30 threshold; fallback should fire
  data.queryIntentRouting = "semantic" 0.8 ← dual-classifier dissonance still live
```

Probe B — Cluster 1 (truncation wrapper, REQ-002) regression:
```
memory_context({input:"Semantic Search"})
→ meta.tokenBudgetEnforcement = {budgetTokens:3500, actualTokens:65,
   enforced:true, truncated:true, originalResultCount:5, returnedResultCount:3}
  data.content[0].text = '{"summary":"Context truncated to fit token budget","data":{"count":0,"results":[]}, ...}'
```
65 / 3500 = 1.9% utilization; same dump-to-empty bug as original Probe 2.

Probe C — direct memory_search bypasses the broken wrapper and works correctly:
```
memory_search({query:"CocoIndex semantic vector search hybrid retrieval"})
→ intent: "understand" (confidence 1.0)  ✓
  results[0]: #962 skilled-agent-orchestration/022-mcp-coco-integration (sim 79.76%)  ✓
  triggered: 022-hybrid-rag-fusion, 023-hybrid-rag-fusion-refinement  ✓
```

### NEW DEFECT CANDIDATES (surfaced via cocoindex_code probes 2026-04-26 18:49)

REQ-018 (P1): cocoindex_code returns mirrored-folder duplicates. Searching "semantic search vector embedding implementation" returned the SAME research-06 markdown chunk (lines 279-303) ten times, each from a different mirror (`.gemini/specs/`, `.agents/specs/`, `.claude/specs/`, `.codex/specs/`, `specs/`, `.opencode/specs/`). All scored identical 0.6811. Effective unique-result rate: 10%. Need cross-mirror dedup at the indexing or query layer.

REQ-019 (P1): cocoindex_code ranks markdown research above source code on technical queries. For "code graph traversal callers query", the top 9 results were duplicates of iteration-040 markdown (research notes with SQL examples); the actual implementation `mcp_server/handlers/code-graph/query.ts` ranked #10 at score 0.6648. For "semantic search vector embedding implementation" the actual cocoindex/vector-indexing source did not surface at all — only research markdown. Likely cause: keyword density in markdown narrative outweighs sparse symbols in source code under current ranking.

### Reproduction Evidence (captured 2026-04-26)

These probes are stored under §7 to keep the canonical Level 1 template structure intact while preserving the regression-detection anchor.

Probe 1 — Intent classifier mis-routing:
```
memory_context({input:"Semantic Search", mode:"auto"})
→ meta.intent.type = "fix_bug"
  meta.intent.confidence = 0.0980
  meta.intent.source = "auto-detected"
  data.queryIntentRouting.queryIntent = "semantic"
  data.queryIntentRouting.confidence = 0.8
  data.queryIntentRouting.matchedKeywords = ["search"]
```
Spec §4A keyword table assigns NONE of {"semantic","search"} to `fix_bug`; the documented fallback is `understand`.

Probe 2 — Truncation drops to zero at 2% budget:
```
memory_context({input:"Semantic Search", mode:"auto"})
→ meta.tokenBudgetEnforcement = {budgetTokens:3000, actualTokens:71,
   enforced:true, truncated:true, originalResultCount:5, returnedResultCount:2}
  data.content[0].text = '{"summary":"Context truncated to fit token budget","data":{"count":0,"results":[]}, ...}'
```
71 / 3000 = 2.4% utilization; 5 results pruned to 0 in payload despite meta claiming 2 returned.

Probe 3 — Causal-stats inconsistency:
```
memory_causal_stats()
→ data.by_relation = {caused: 236, supersedes: 786, supports: 113}
  data.health = "healthy"  data.meetsTarget = false
  data.targetCoverage = "60%"  data.currentCoverage = "56.21%"
```
Spec §5B template lists 6 relations; runtime emits 3. Health field contradicts target check.

Probe 4 — Folder-discovery misfire:
```
memory_context({input:"Semantic Search"})
→ meta.folderDiscovery.specFolder = "skilled-agent-orchestration/023-sk-deep-research-creation"
```
The query has no semantic relationship; folder bound on stop-word-class signal.

Probe 5 — Lopsided edge growth (T2 - T1 = ~15 min):
```
T1: total_edges=791  by_relation={supersedes:442, caused:236, supports:113}
T2: total_edges=1135 by_relation={supersedes:786, caused:236, supports:113}
```
+344 edges, all `supersedes`. `caused`/`supports` unchanged. Coverage moved 56.77% → 56.21% (negative despite adds).

Authoritative sources: `.opencode/command/memory/search.md` (canonical spec), `.opencode/skill/system-spec-kit/mcp_server/` (runtime), sibling packets `001-cache-warning-hooks` (token-budget patterns), `002-memory-quality-remediation` (prior repair history).
<!-- /ANCHOR:questions -->
