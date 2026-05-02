---
title: "MCP Runtime Improvement Research - Canonical Synthesis [RESEARCH-007]"
description: "Canonical synthesis for the 007 deep-research packet covering MCP memory layer, code graph, CocoIndex, causal graph, and intent-classifier runtime defects from packets 005 and 006."
trigger_phrases:
  - "RESEARCH-007"
  - "002-mcp-runtime-improvement-research"
  - "mcp runtime improvement synthesis"
  - "memory context truncation root cause"
  - "cocoindex mirror duplicate research"
  - "code graph recovery research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research"
    last_updated_at: "2026-04-27T07:17:21Z"
    last_updated_by: "codex"
    recent_action: "Compiled canonical RESEARCH-007 synthesis"
    next_safe_action: "Use research/research.md to decompose Phase C remediation packets"
    blockers:
      - "Q8 detailed iteration narrative was overwritten; use state-log evidence or rerun Q8 preflight before implementation"
    key_files:
      - "research/research.md"
      - "research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl"
      - "research/002-mcp-runtime-improvement-research-pt-01/deep-research-config.json"
    completion_pct: 100
    open_questions:
      - "Q8 detailed evidence should be reconstructed or refreshed before implementation"
    answered_questions:
      - "Q1-Q8 synthesized with evidence caveats"
---
# MCP Runtime Improvement Research - Canonical Synthesis
Canonical deep-research synthesis for the 007 MCP runtime improvement packet.
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 | adapted:mcp-runtime-systems -->
---
## 1. METADATA
| Field | Value |
|-------|-------|
| Research ID | RESEARCH-007 |
| Feature/Spec | 002-mcp-runtime-improvement-research |
| Status | Complete |
| Date Started | 2026-04-27 |
| Date Completed | 2026-04-27 |
| Last Updated | 2026-04-27 |
| Iterations | 10 requested; state log contains duplicate reducer entries for iterations 1, 7, 8, and 9 |
| Executor | cli-codex, gpt-5.5, reasoning effort high, service tier fast, workspace-write |
| Scope | Read-only investigation; no MCP server source mutation |
Related documents:
| Document | Path |
|----------|------|
| Spec | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/spec.md` |
| Strategy | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-strategy.md` |
| State log | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/deep-research-state.jsonl` |
| Findings registry | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/002-mcp-runtime-improvement-research-pt-01/findings-registry.json` |
| Source packet 005 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/` |
| Source packet 006 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/` |
Provenance note: Q1-Q7 have detailed iteration markdown plus delta evidence. Q8 is represented in the state log as an answered intent-classifier consistency pass, but the visible `iteration-009.md` was later overwritten by a Q4 pass. This synthesis keeps Q8 as state-log-supported and labels residual evidence gaps instead of inventing missing narrative details.
---
<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT
### Request Summary
Packet 007 investigated eight MCP runtime defect clusters surfaced by sibling packets 005 and 006. The target systems were the Spec Kit Memory MCP layer, `memory_context` wrapper, `memory_search` recovery contract, structural code graph, CocoIndex code search, causal graph, and intent-classifier surfaces.
The investigation was read-only. Its job was to identify root causes, define remediation contracts, and leave downstream Phase C packets with implementable, testable changes.
### Current Behavior
The runtime has partial fixes and useful readiness signals, but several contracts remain too soft for autonomous callers:
- MCP TypeScript fixes can be built into `dist/` yet remain absent from the running daemon until the MCP-owning client restarts.
- `memory_context` can still represent empty fallbacks as normal truncation unless empty output is explicitly named as degraded.
- `memory_search` exposes weak retrieval as advisory metadata inside a success envelope, allowing model callers to cite weak candidates as canonical evidence.
- CocoIndex indexes mirror paths and prose research beside implementation source, then returns pure nearest-neighbor rows without deduplication or source-role reranking.
- Code graph read paths can block correctly, but the caller routing contract does not force `code_graph_scan` before expensive grep fallback.
- Causal graph stats report counts without relation-window balance diagnostics.
- Intent classifier telemetry separates task-intent and backend-routing only partially; cross-CLI paraphrase stability needs a shared contract and corpus.
### Key Findings
1. **Q1 - Phantom fix behavior is operational, not a missing build.** Iteration 001 ruled out a missing `dist/` rebuild for 005 Cluster 1 and 2 because compiled files were newer than sources and contained the claimed markers. Local `dist/` probes showed `Semantic Search` classified as `understand`; the remaining likely cause is a stale MCP daemon/client session, with live MCP probing blocked in that iteration. Evidence: `iteration-001.md:35-51`, `iteration-001.md:53-67`, `iteration-001.md:76-89`, `iteration-001.md:93-111`.
2. **Q2 - CocoIndex mirror duplicates are real alias duplication plus no query-time dedup.** Runtime spec roots under `.claude`, `.codex`, and `.gemini` are symlinks to `.opencode/specs`, while project settings exclude only `.opencode/specs`; the indexer stores alias `file_path` and the query path maps raw nearest-neighbor rows directly to outputs. Evidence: `iteration-003.md:19-38`, `iteration-003.md:40-63`, `iteration-003.md:64-88`, `iteration-003.md:89-115`.
3. **Q3 - CocoIndex source-vs-markdown ranking is a source-role policy gap.** Markdown and text files are indexed beside code, schema rows do not carry `path_class` or `source_role`, and ranking is pure vector distance. Natural-language research can outrank sparse source on implementation queries. Evidence: `iteration-004.md:17-45`, `iteration-004.md:49-81`.
4. **Q4 - Weak retrieval guardrails are advisory instead of binding.** The I2 `cli-opencode` failure received `requestQuality:"weak"` plus low-confidence recovery, then fabricated paths because the runtime had no hard no-invention policy and could emit `suggestedQueries:[]`. Evidence: `iteration-006.md:16-37`, `iteration-006.md:40-52`, `iteration-009.md:16-44`, `deltas/iter-009.jsonl:2-6`.
5. **Q5 - `memory_context` 2 percent truncation is post-fallback telemetry.** The wrapper begins enforcement from an over-budget outer strategy result, but fallback metadata can report the tiny reduced envelope as `actualTokens`. Survivor preservation is present, yet empty fallback candidates remain. Evidence: `iteration-002.md:16-34`, `iteration-005.md:16-37`, `iteration-010.md:16-50`.
6. **Q6 - Empty/stale code graph recovery is a routing contract problem.** Current read handlers block full-scan-required states with `requiredAction:"code_graph_scan"`, and full scans are intentionally skipped on read paths. The caller contract still allows late discovery and expensive grep fallback. Evidence: `iteration-007.md:16-46`, `iteration-007.md:49-61`, `deltas/iter-007.jsonl:2-6`.
7. **Q7 - Causal-edge growth skew comes from automatic supersession producers.** Prediction-error and reconsolidation paths produce automatic `supersedes` edges at higher volume than conditional `caused` or `supports` producers. Existing caps are per-node or strength-based, not per-relation per-window. Evidence: `iteration-008.md:17-31`, `iteration-008.md:33-48`, `iteration-008.md:49-60`.
8. **Q8 - Intent classifier consistency needs a normalized contract.** State-log evidence records Q8 as focused on task-intent centroid floors, backend-routing single-keyword confidence, normalized response schema, and paired paraphrase stability corpus. Detailed iteration markdown for this pass is not present after a later overwrite, so Q8 should be treated as lower-evidence than Q1-Q7. Evidence: `deep-research-state.jsonl:15`, `iteration-001.md:23-28`, `iteration-001.md:44-59`, `iteration-001.md:115-124`.
### Recommendations
Top 5 Phase C remediations:
1. **Make MCP runtime verification four-part and mandatory.** Every MCP TypeScript fix needs source diff, targeted tests, `npm run build` plus `dist/` marker/timestamp verification, MCP-owning client restart, and live MCP tool probe evidence.
2. **Add hard response-policy fields to `memory_search` and telemetry split fields to `memory_context`.** Weak retrieval needs `responsePolicy`/`citationPolicy`; truncation needs `preEnforcementTokens`, `returnedTokens`, `droppedAllResultsReason`, and final payload/count invariants.
3. **Make CocoIndex code-first by default, with canonical-path dedup if docs stay indexed.** Exclude runtime spec mirrors; add `source_realpath`/`content_hash`; over-fetch and dedupe before returning top-k.
4. **Promote structural graph readiness from advisory hint to routing contract.** Expose `fallbackDecision.nextTool:"code_graph_scan"` before structural reads in full-scan-required states and only fall back to `rg` after scan is unavailable, declined, or failed.
5. **Add runtime health diagnostics for relation and intent drift.** Causal graph needs `deltaByRelation` and skew status; intent classification needs normalized task-vs-routing schema plus paired paraphrase regression coverage across CLIs.
Alternative approaches and why they lose are listed in "Eliminated Alternatives" after Section 11.
<!-- /ANCHOR:investigation-report -->
---
## 3. EXECUTIVE OVERVIEW
### Executive Summary
The recurring pattern is not one broken function. The MCP runtime has multiple places where an internal signal exists but is not binding enough for autonomous callers: a compiled fix is not the same as a restarted daemon, weak retrieval metadata is not a refusal policy, and a blocked graph read is not yet a routing decision. The fix strategy should tighten contracts rather than add more prose instructions.
The highest-risk user-visible defects cluster around retrieval and citation authority. `memory_context` can return misleading truncation telemetry, `memory_search` can hand weak results to models without a no-invention contract, and CocoIndex can spend its top-k budget on duplicate aliases or research prose. These defects compound: a model receives weak or duplicate evidence, fills the gap, and produces confident but false paths.
Phase C should prioritize small, contract-level runtime changes with targeted regression tests. The recommended ordering is memory response contracts first, CocoIndex dedup/ranking second, code-graph routing third, causal graph diagnostics fourth, and intent-classifier stability fifth.
### Architecture Diagram
```text
               +-------------------------+
               | CLI callers             |
               | codex/copilot/opencode  |
               +-----------+-------------+
                           |
                           v
               +-------------------------+
               | MCP context-server      |
               | dist/context-server.js  |
               +----+----------+---------+
                    |          |
          +---------+          +----------------+
          v                                   v
+-------------------+             +----------------------+
| Memory layer      |             | Code graph layer     |
| memory_context    |             | query/context/scan   |
| memory_search     |             | ensure-ready         |
+----+----------+---+             +----------+-----------+
     |          |                            |
     |          v                            v
     |  +----------------+          +--------------------+
     |  | Recovery and   |          | graph DB / scanner |
     |  | confidence     |          +--------------------+
     |  +----------------+
     |
     v
+-------------------+       +---------------------+
| Vector memory DB  |       | CocoIndex code      |
| search/ranking    |<----->| index/query/server  |
+---------+---------+       +----------+----------+
          |                            |
          v                            v
+-------------------+       +---------------------+
| Causal graph      |       | Intent classifier   |
| relation stats    |       | task + routing      |
+-------------------+       +---------------------+
```
### Quick Reference Guide
Use this synthesis when:
- Implementing Phase C remediation packets for MCP runtime behavior.
- Deciding which runtime contract should own a failure mode.
- Writing regression tests for `memory_context`, `memory_search`, CocoIndex, code graph, causal graph, or intent routing.
Do not use this synthesis as:
- Proof that the live daemon currently reflects source changes; Q1 says live daemon probing must happen after restart.
- A replacement for code review during implementation.
- Evidence that Q8 has full narrative parity with Q1-Q7; Q8 needs revalidation or a fresh focused implementation preflight.
Key considerations:
- Treat `dist/` and the running daemon as separate deployment states.
- Treat retrieval confidence as a claim-authority contract, not only ranking telemetry.
- Prefer code-first CocoIndex defaults; Spec Kit Memory is the stronger channel for packet research.
### Research Sources
| Source Type | Description | Reference | Credibility |
|-------------|-------------|-----------|-------------|
| Iteration markdown | Q1-Q7 narrative findings, Q4/Q5 duplicate passes | `research/.../iterations/iteration-001.md` through `iteration-010.md` | High for Q1-Q7 |
| Delta JSONL | Machine-readable findings, invariants, graph events | `research/.../deltas/iter-001.jsonl` through `iter-010.jsonl` | High where present |
| State log | Convergence, duplicate reducer entries, Q8 graph event | `research/.../deep-research-state.jsonl` | Medium-high |
| Findings registry | Initial question registry; not reduced after iterations | `research/.../findings-registry.json` | Low for final status |
| Spec doc | Scope, acceptance, source packet mapping | `spec.md` | High for intended scope |
| Source reads | Handler and test line ranges sampled during synthesis | `.opencode/skill/system-spec-kit/mcp_server/...` | High for current checkout |
---
## 4. CORE ARCHITECTURE
### System Components
#### Memory Layer: `memory_context`
Purpose: Wrap memory retrieval into context-mode responses and enforce per-mode token budgets.
Responsibilities:
- Route context modes such as auto, focused, deep, and resume.
- Embed `memory_search` results inside MCP text content.
- Enforce wrapper token budgets through `enforceTokenBudget()`.
- Report enforcement metadata to callers.
Integration points:
- Handler source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`.
- Budget enforcement starts at `memory-context.ts:447`.
- Survivor-preserving fallback starts at `memory-context.ts:489`.
- Fallback token reporting happens at `memory-context.ts:810`.
#### Memory Layer: `memory_search`
Purpose: Search saved memory and render ranked results with confidence, recovery, and explainability metadata.
Responsibilities:
- Format search results into standardized envelopes.
- Attach request quality and recovery payloads.
- Expose weak/partial/no-result diagnostics.
- Serve model callers with enough authority signals to avoid unsupported claims.
Integration points:
- Formatter source: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`.
- Recovery insertion point: `search-results.ts:951-983` and `search-results.ts:1025-1035`.
- Recovery action vocabulary: `recovery-payload.ts:28-37`, `recovery-payload.ts:152-164`.
#### Code Graph
Purpose: Provide structural code navigation with readiness detection and explicit scan recovery.
Responsibilities:
- Detect graph freshness.
- Inline selective stale repair when safe.
- Block full-scan-required read paths.
- Provide `code_graph_scan` as first-class repair.
Integration points:
- Query handler: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`.
- Readiness check: `query.ts:1045-1059`.
- Blocked payload: `query.ts:775-796`.
- State detection: `ensure-ready.ts:151-220`.
#### CocoIndex
Purpose: Semantic code search over the repository.
Responsibilities:
- Index code chunks and, currently, eligible markdown/text chunks.
- Return nearest-neighbor search rows.
- Expose MCP results through project/server adapters.
Integration points from iteration evidence:
- Settings: `.cocoindex_code/settings.yml:1-44`.
- Index-time alias path storage: `cocoindex_code/indexer.py:180-189`.
- Query-time raw row mapping: `cocoindex_code/query.py:115-145`.
- Project/server pass-through: `cocoindex_code/project.py:174-203`, `cocoindex_code/server.py:139-155`.
#### Causal Graph
Purpose: Store relation edges between memory records and expose graph health.
Responsibilities:
- Insert causal relations such as `caused`, `supports`, and `supersedes`.
- Auto-record supersession during save/reconsolidation.
- Report graph stats to callers.
Integration points:
- Relation types and edge insertion: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`.
- Auto edge strength and per-node caps: `causal-edges.ts:234-253`.
- Batch paths: `causal-edges.ts:366-468`.
- Prediction-error supersedes producer: `handlers/save/create-record.ts:129-196`, `handlers/save/create-record.ts:386-396`.
#### Intent Classifier
Purpose: Classify task intent and help backend routing choose search strategies.
Responsibilities:
- Score user prompts against task-intent labels.
- Avoid centroid-only false positives such as `Semantic Search -> fix_bug`.
- Expose task-intent separately from backend routing.
- Preserve paraphrase stability across CLI caller styles.
Integration points:
- Classifier source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`.
- Intent labels and keywords: `intent-classifier.ts:7-73`.
- Centroid classifier seeds: `intent-classifier.ts:130-174`.
- Runtime response annotations cited by Q1: `classificationKind` and `seeAlso` in `memory_context`.
### Data Flow
```text
User prompt
  -> CLI runtime
  -> MCP context-server
  -> memory_context OR memory_search OR code_graph_query OR CocoIndex
  -> formatter/enforcer/readiness layer
  -> response envelope
  -> model-side answer or next tool decision
```
Flow steps:
1. Caller chooses a tool from startup context, prompt intent, or previous response.
2. Handler computes retrieval or structural results.
3. Formatter/enforcer attaches confidence, recovery, token, or readiness metadata.
4. Caller decides whether evidence is authoritative, needs scan/retry, or requires user disambiguation.
5. Regression tests must assert both payload contents and metadata, not metadata alone.
### Integration Points
Internal modules:
| Layer | Main Paths | Primary Contract Gap |
|-------|------------|----------------------|
| `memory_context` | `handlers/memory-context.ts` | Truncation telemetry and empty fallback naming |
| `memory_search` | `formatters/search-results.ts`, `lib/search/recovery-payload.ts` | Weak retrieval is advisory, not binding |
| Code graph | `code_graph/handlers/query.ts`, `code_graph/lib/ensure-ready.ts` | Scan-required state is not caller-binding early enough |
| CocoIndex | `.cocoindex_code/settings.yml`, `cocoindex_code/*` | Alias duplication, no dedup, no source role |
| Causal graph | `lib/storage/causal-edges.ts`, `handlers/save/create-record.ts` | Supersedes bursts not diagnosed by relation window |
| Intent | `lib/search/intent-classifier.ts`, `handlers/memory-context.ts` | Task intent vs routing intent needs normalized schema |
External/CLI callers:
| Caller | Interaction Pattern |
|--------|---------------------|
| `cli-codex` | Iteration executor; consumes MCP tool outputs and writes artifacts |
| `cli-opencode` | Strongest reproduced weak-retrieval hallucination evidence in 006 I2 |
| `cli-copilot` | Covered by sibling 006 stress-test scope; Q4 exact strongest evidence is `cli-opencode` |
| OpenCode/Codex client | Owns MCP child process; restart required to load rebuilt `dist/` |
---
## 5. TECHNICAL SPECIFICATIONS
### Q1 Contract: MCP Build, Restart, Live Probe
Current behavior:
- `opencode.json` starts the MCP server with `node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`.
- Rebuilding updates disk, but an already-running client continues using the old child process.
Recommended contract:
```text
source patched
  -> targeted tests pass
  -> npm run build
  -> dist marker/timestamp check
  -> restart MCP-owning client/runtime
  -> live MCP tool probe
  -> completion claim allowed
```
Required evidence fields for implementation summaries:
| Field | Meaning |
|-------|---------|
| `sourceDiffPaths` | MCP source files changed |
| `targetedTests` | Test commands and pass output |
| `distVerification` | Timestamps or marker grep showing compiled output updated |
| `runtimeRestart` | Client/session restart evidence |
| `liveProbe` | Actual MCP tool response after restart |
### Q2 Contract: CocoIndex Canonical Identity
Recommended index-time fields:
| Field | Type | Description |
|-------|------|-------------|
| `file_path` | string | Logical path used for display |
| `source_realpath` | string | Canonical real path used for duplicate detection |
| `content_hash` | string | Hash of normalized chunk content |
| `canonical_file_path` | string | Preferred display path |
| `path_aliases` | string[] | Suppressed aliases for telemetry |
Recommended query-time fields:
| Field | Type | Description |
|-------|------|-------------|
| `dedupedAliases` | number | Count of duplicate alias rows suppressed |
| `uniqueResultCount` | number | Count after deduplication |
| `duplicateGroups` | object[] | Optional debug grouping by hash or realpath |
### Q3 Contract: Path Class and Reranking
Recommended source-role values:
| `source_role` | Examples |
|---------------|----------|
| `implementation` | `mcp_server/**/*.ts`, `cocoindex_code/**/*.py` |
| `tests` | `**/*.vitest.ts`, test fixtures |
| `docs` | README and public docs |
| `spec_research` | `.opencode/specs/**/research/**` |
| `generated` | built `dist/`, generated metadata |
| `vendor` | vendored dependency code |
For implementation-intent queries, use over-fetch plus bounded reranking. Preserve raw vector score and expose `rankingSignals`.
### Q4 Contract: Non-Authoritative Retrieval Policy
Recommended response fields:
```ts
type ResponsePolicy = {
  requiredAction: "ask_disambiguation" | "broaden_or_ask" | "refuse_without_evidence";
  noCanonicalPathClaims: boolean;
  citationRequiredForPaths: boolean;
  safeResponse: string;
};
```
Trigger condition:
```text
requestQuality.label != "good"
AND recovery.status in ("low_confidence", "partial", "no_results")
AND recovery.recommendedAction in ("ask_user", "ask_disambiguation", "broaden_or_ask")
```
If `suggestedQueries.length === 0`, the runtime must either synthesize safe suggestions or require disambiguation.
### Q5 Contract: `memory_context` Truncation Recovery
Recommended token fields:
| Field | Type | Description |
|-------|------|-------------|
| `preEnforcementTokens` | number | Full wrapper size before truncation |
| `returnedTokens` | number | Final emitted payload size |
| `budgetTokens` | number | Active mode budget |
| `actualTokens` | number | Backward-compatible alias, documented |
| `droppedAllResultsReason` | string | Required if final nested `results` is empty |
Invariant:
```text
meta.tokenBudgetEnforcement.returnedResultCount
  == JSON.parse(data.content[0].text).data.results.length
```
### Q6 Contract: Code Graph Readiness and Fallback Decision
Recommended payload addition:
```ts
type FallbackDecision = {
  nextTool: "code_graph_scan" | "code_graph_query" | "rg";
  reason: "full_scan_required" | "selective_reindex" | "scan_failed" | "scan_declined";
  retryAfter?: "scan_complete";
};
```
Routing rules:
| Readiness | Action |
|-----------|--------|
| `fresh` | Use structural query |
| `stale + selective_reindex` | Allow read path self-heal |
| `empty` | Run `code_graph_scan` first |
| `stale + full_scan` | Run `code_graph_scan` first |
| `unavailable/error` | Use health diagnostics, then `rg` if scan cannot run |
### Q7 Contract: Causal Relation Balance
Recommended stats fields:
| Field | Type | Description |
|-------|------|-------------|
| `deltaByRelation` | object | New edge counts by relation in a time window |
| `dominantRelation` | string | Relation with largest new-edge share |
| `dominantRelationShare` | number | Share of new edges |
| `windowStartedAt` | string | ISO timestamp |
| `balanceStatus` | string | `balanced`, `relation_skewed`, or `insufficient_data` |
| `remediationHint` | string | Names likely producer, e.g. prediction-error supersede burst |
### Q8 Contract: Intent Classification Stability
Recommended response schema:
```ts
type IntentTelemetry = {
  taskIntent: {
    intent: string;
    confidence: number;
    classificationKind: "task-intent";
    evidence: string[];
  };
  backendRouting: {
    route: string;
    confidence: number;
    classificationKind: "backend-routing";
    seeAlso: "meta.intent";
  };
  paraphraseGroup?: string;
};
```
Regression corpus:
- `Semantic Search` and paraphrases should classify as `understand` for task intent.
- Bug-fix prompts such as `fix the login bug` should classify as `fix_bug`.
- Implementation search prompts should route to code/retrieval without overwriting task intent.
- Cross-CLI prompt variants from `cli-codex`, `cli-copilot`, and `cli-opencode` should remain within a defined drift threshold.
---
## 6. CONSTRAINTS & LIMITATIONS
### Research Constraints
- This packet is read-only research. Implementation belongs in downstream remediation packets.
- No MCP server source files were mutated for this synthesis.
- Q8 has lower evidence quality than Q1-Q7 because its detailed iteration narrative was not preserved.
- Some live probes were blocked or unavailable. Q1 live `memory_context` calls returned `user cancelled MCP tool call` in Iteration 001.
- Direct corpus-count telemetry for Q3 was blocked because plain `sqlite3` could not load the `vec0` virtual table.
### Runtime Limitations
- MCP daemon restart is outside TypeScript build output. The client/runtime owns the process lifecycle.
- `dist/` freshness can be checked from disk, but it does not prove the running daemon loaded the fresh code.
- Full code-graph scans are intentionally not run inline on read paths.
- CocoIndex implementation files cited by iterations may come from the installed package/runtime environment rather than a tracked repo-local source tree.
### Mutation Costs
| Fix Class | Mutation Needed | Cost |
|-----------|-----------------|------|
| Documentation/protocol updates | Spec docs only | Low |
| `memory_search` response policy | MCP source + tests + build + restart | Medium |
| `memory_context` telemetry fields | MCP source + backward compatibility tests | Medium |
| CocoIndex canonical identity | Schema/index migration + reindex | High |
| Code graph fallback decision | Handler contract + tests | Medium |
| Causal relation balance | Stats schema + ingestion guards | Medium-high |
| Intent corpus | Test fixtures + classifier telemetry | Medium |
### N/A Template Sections
Browser compatibility, markup requirements, CSS specifications, SPA initialization, and browser rate limiting are N/A for this runtime-systems research packet.
---
## 7. INTEGRATION PATTERNS
### CLI Caller Pattern
All CLI callers should treat MCP response metadata as machine-readable routing state:
```text
MCP response
  -> check responsePolicy / citationPolicy
  -> check recovery and requestQuality
  -> check code graph fallbackDecision
  -> only then synthesize an answer
```
### `cli-codex`
Pattern:
- Used as the deep-research executor.
- Reads iteration prompts and writes markdown/delta/state artifacts.
- Must not treat direct source reads as equivalent to live MCP daemon probes.
Expected contract:
- When implementing MCP runtime fixes, run tests/build locally, restart MCP owner, and run live tool probes before claiming completion.
### `cli-opencode`
Pattern:
- Strongest reproduced weak-retrieval hallucination cell in sibling 006.
- Consumed weak `memory_search` recovery signals but still produced fabricated paths.
Expected contract:
- Honor `responsePolicy.noCanonicalPathClaims`.
- Ask disambiguating questions when retrieval is non-authoritative.
- Do not turn weak candidates into canonical file/spec claims without a filesystem read or stronger retrieval.
### `cli-copilot`
Pattern:
- Part of the sibling 006 cross-AI stress-test scope.
- Exact Q4 strongest evidence in this packet points to `cli-opencode`; cross-runtime replay remains useful.
Expected contract:
- Same response-policy and citation-policy handling as other CLIs.
- Same paired paraphrase intent regression corpus.
### `cli-opencode-pure`
Pattern:
- Useful comparison cell from 006 for model behavior without the same retrieval augmentation.
- Can validate whether a failure is retrieval-contract-specific or general model-side behavior.
### Cross-CLI Consistency
Shared runtime fields should avoid caller-specific interpretation:
| Field | Consumer Rule |
|-------|---------------|
| `classificationKind` | Do not conflate task intent with backend routing |
| `responsePolicy` | Hard claim-authority policy |
| `citationPolicy` | Whether result paths are citeable |
| `fallbackDecision` | Next tool before textual fallback |
| `rankingSignals` | Explain source-role boosts/penalties |
---
## 8. IMPLEMENTATION GUIDE
### Phase C Packet Ordering
1. **Memory response contracts**: `memory_context` telemetry plus `memory_search` response policy. Highest leverage because it directly blocks hallucinated citations and misleading truncation.
2. **CocoIndex corpus and dedup**: settings mitigation first, schema/dedup second. This reduces duplicate and markdown-heavy retrieval noise.
3. **Code graph recovery routing**: add `fallbackDecision` and startup preflight binding to reduce expensive fallback loops.
4. **Causal graph relation balance**: add per-window stats and auto-edge caps.
5. **Intent classifier consistency**: normalize task-vs-routing telemetry and add paired paraphrase regressions.
### Handler-Level Changes
| Target | Change |
|--------|--------|
| `handlers/memory-context.ts` | Add `preEnforcementTokens`, `returnedTokens`, `droppedAllResultsReason`; assert payload/count invariant in helper |
| `formatters/search-results.ts` | Derive `responsePolicy` when request quality is weak/partial/no-results |
| `lib/search/recovery-payload.ts` | Extend `RecoveryAction` vocabulary and guarantee safe next action |
| `code_graph/handlers/query.ts` | Attach `fallbackDecision` to blocked and degraded payloads |
| `lib/storage/causal-edges.ts` | Route automatic batch paths through shared cap logic |
| `handlers/causal-graph.ts` | Add relation-window balance stats |
| `lib/search/intent-classifier.ts` | Emit stable task-intent telemetry and paired paraphrase tests |
### Schema/Field Changes
| Layer | Field |
|-------|-------|
| Memory context | `meta.tokenBudgetEnforcement.preEnforcementTokens` |
| Memory context | `meta.tokenBudgetEnforcement.returnedTokens` |
| Memory context | `meta.tokenBudgetEnforcement.droppedAllResultsReason` |
| Memory search | `data.responsePolicy.requiredAction` |
| Memory search | `data.responsePolicy.noCanonicalPathClaims` |
| Memory search | `data.citationPolicy` |
| Code graph | `data.fallbackDecision.nextTool` |
| CocoIndex | `source_realpath`, `content_hash`, `path_class`, `rankingSignals` |
| Causal graph | `deltaByRelation`, `balanceStatus`, `dominantRelationShare` |
| Intent | `meta.intent.classificationKind`, `data.queryIntentRouting.classificationKind` |
### Verification Commands
Use these as packet-level guides; exact commands belong in implementation packets:
```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm test -- --run tests/token-budget-enforcement.vitest.ts tests/memory-context.vitest.ts
npm test -- --run tests/d5-recovery-payload.vitest.ts tests/empty-result-recovery.vitest.ts
npm run build
```
Live probe after restart:
```text
memory_context({
  input: "Semantic Search",
  mode: "auto",
  includeTrace: true,
  tokenUsage: 0.02
})
```
Expected:
- Task intent is `understand`.
- `classificationKind` separates task intent from backend routing.
- Under-budget payloads are not zero-filled.
- If truncation occurs, final nested payload count matches metadata.
---
## 9. CODE EXAMPLES
### Pattern: `memory_context` Token Telemetry
Current evidence points:
- Enforcement starts at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:447-462`.
- Empty fallback candidates remain at `memory-context.ts:551-580`.
- Final empty fallback remains at `memory-context.ts:607-614`.
- Fallback token reporting occurs at `memory-context.ts:810-835`.
Recommended shape:
```ts
const preEnforcementTokens = estimateTokens(JSON.stringify(result));
if (preEnforcementTokens <= budgetTokens) {
  return {
    result,
    enforcement: {
      budgetTokens,
      actualTokens: preEnforcementTokens,
      preEnforcementTokens,
      returnedTokens: preEnforcementTokens,
      enforced: false,
      truncated: false,
    },
  };
}
const fallbackTokens = estimateTokens(JSON.stringify(fallbackResult));
const finalCount = extractNestedResultCount(fallbackResult);
return {
  result: fallbackResult,
  enforcement: {
    budgetTokens,
    actualTokens: fallbackTokens,
    preEnforcementTokens,
    returnedTokens: fallbackTokens,
    enforced: true,
    truncated: true,
    returnedResultCount: finalCount,
    ...(finalCount === 0 ? { droppedAllResultsReason: "impossible_budget" } : {}),
  },
};
```
### Pattern: Final Payload Count Assertion
Test gap evidence:
- `memory-context.vitest.ts:890-916` checks metadata but does not parse final nested payload.
- `memory-context.vitest.ts:956-969` says zero budget cannot truncate below one but only asserts `actualTokens > 0`.
- `token-budget-enforcement.vitest.ts:151-162` already shows the stronger parse-and-assert pattern.
Recommended helper:
```ts
function expectReturnedCountMatchesPayload(result: ContextResult, returnedResultCount?: number) {
  const content = result.content as Array<{ text: string }>;
  const parsed = JSON.parse(content[0].text) as { data?: { results?: unknown[] } };
  const actualCount = Array.isArray(parsed.data?.results) ? parsed.data.results.length : 0;
  expect(returnedResultCount).toBe(actualCount);
}
```
### Pattern: `memory_search` Hard Response Policy
Current insertion point:
- Confidence and request quality attach at `search-results.ts:951-960`.
- Recovery payload attaches at `search-results.ts:962-983`.
- Success envelope merges recovery at `search-results.ts:1025-1035`.
Recommended shape:
```ts
const responsePolicy = deriveResponsePolicy(requestQualityData, recoveryPayload);
const responseData: Record<string, unknown> = {
  searchType,
  count: formatted.length,
  constitutionalCount,
  results: resultsWithExplain,
  ...(requestQualityData !== null ? requestQualityData : {}),
  ...(recoveryPayload !== null ? { recovery: recoveryPayload } : {}),
  ...(responsePolicy !== null ? { responsePolicy } : {}),
};
```
Policy derivation:
```ts
function deriveResponsePolicy(requestQuality: RequestQuality | null, recovery: RecoveryPayload | null) {
  if (!requestQuality || requestQuality.requestQuality?.label === "good") return null;
  if (!recovery) return null;
  if (recovery.recommendedAction === "ask_user" && recovery.suggestedQueries.length === 0) {
    return {
      requiredAction: "ask_disambiguation",
      noCanonicalPathClaims: true,
      citationRequiredForPaths: true,
      safeResponse: "No canonical context found from the current retrieval. Ask a clarifying question or request a broader query.",
    };
  }
  return null;
}
```
### Pattern: Code Graph Fallback Decision
Current blocked payload:
- `shouldBlockReadPath()` returns true for full-scan-required reads at `query.ts:775-777`.
- Blocked payload sets `requiredAction:"code_graph_scan"` at `query.ts:779-796`.
Recommended addition:
```ts
data: buildGraphQueryPayload({
  operation,
  subject,
  blocked: true,
  degraded: true,
  graphAnswersOmitted: true,
  requiredAction: "code_graph_scan",
  fallbackDecision: {
    nextTool: "code_graph_scan",
    reason: "full_scan_required",
    retryAfter: "scan_complete",
  },
}, readiness, "code_graph_query blocked payload")
```
### Pattern: CocoIndex Dedup
Iteration evidence cites:
- Indexer stores alias path without canonical identity: `cocoindex_code/indexer.py:180-189`.
- Query maps raw rows directly: `cocoindex_code/query.py:115-145`.
- Project settings include markdown/text: `.cocoindex_code/settings.yml:16-44`.
Recommended query-stage sketch:
```python
rows = fetch_nearest_neighbors(limit * 4)
groups = {}
for row in rows:
    key = row.source_realpath and (row.source_realpath, row.start_line, row.end_line)
    if not key:
        key = (sha256(normalize(row.content)), row.start_line, row.end_line)
    groups.setdefault(key, []).append(row)
unique = [prefer_canonical_path(group) for group in groups.values()]
return rerank_by_path_class(unique)[:limit]
```
### Pattern: Causal Relation Balance
Current evidence:
- Auto edge strength and per-node cap live at `causal-edges.ts:234-253`.
- `insertEdgesBatch()` delegates to `insertEdge()` at `causal-edges.ts:366-414`.
- `bulkInsertEdges()` inserts directly at `causal-edges.ts:416-468`.
- Prediction-error supersedes are emitted at `create-record.ts:129-196` and called at `create-record.ts:386-396`.
Recommended stats shape:
```ts
type RelationBalance = {
  deltaByRelation: Record<string, number>;
  dominantRelation: string | null;
  dominantRelationShare: number;
  balanceStatus: "balanced" | "relation_skewed" | "insufficient_data";
  remediationHint?: string;
};
```
---
## 10. TESTING & DEBUGGING
### Regression Coverage Gaps
| Question | Gap | Recommended Test |
|----------|-----|------------------|
| Q1 | Build does not prove daemon loaded new `dist` | Live MCP probe after restart recorded in implementation summary |
| Q2 | Top-k duplicate collapse can return one effective unique chunk | Fixture with symlink aliases; assert `uniqueResultCount == limit` when enough unique chunks exist |
| Q3 | Markdown can outrank implementation for implementation-intent query | Probe `code graph traversal callers query`; assert implementation path top 3 |
| Q4 | Weak retrieval can be cited as canonical evidence | I2 fixture; assert `responsePolicy.noCanonicalPathClaims === true` |
| Q5 | Metadata can disagree with nested payload | Parse final `content[0].text`; assert returned count equals nested result length |
| Q6 | Caller may fall back to grep after blocked graph query | Empty graph fixture; assert `fallbackDecision.nextTool === "code_graph_scan"` |
| Q7 | Supersedes bursts are not diagnosed | Insert relation-window fixture; assert `balanceStatus:"relation_skewed"` |
| Q8 | Paraphrase drift across CLI prompt styles | Paired corpus for equivalent prompts; assert stable task intent and bounded confidence drift |
### Debugging Approaches
1. **Suspected stale MCP fix**
   - Check source diff.
   - Check `dist/` marker/timestamp.
   - Restart MCP-owning client.
   - Run live tool probe.
2. **Weak retrieval or invented path**
   - Inspect `requestQuality`, `recovery`, `responsePolicy`, and citations.
   - Require filesystem read for any path claim not backed by authoritative retrieval.
3. **CocoIndex duplicate collapse**
   - Check settings excludes.
   - Inspect path aliases and content hashes.
   - Compare `uniqueResultCount` against requested limit.
4. **Code graph sparse/empty response**
   - Inspect readiness state.
   - If `action:"full_scan"`, run `code_graph_scan`.
   - Only use `rg` after scan is unavailable, declined, or failed.
### Recommended Live Probes
```text
memory_context({ input: "Semantic Search", mode: "auto", includeTrace: true, tokenUsage: 0.02 })
```
```text
memory_search({ query: "search bug debugging" })
```
```text
code_graph_query({ operation: "callers", subject: "handleCodeGraphQuery" })
```
```bash
ccc search "memory_context truncation" --limit 10
ccc search "semantic search vector embedding implementation" --limit 10
```
### Debug Output to Record
| Output | Why |
|--------|-----|
| Raw MCP response envelope | Confirms machine-readable fields |
| Final nested payload text | Catches metadata/payload mismatch |
| `dist/` timestamps | Confirms build output changed |
| Live probe after restart | Confirms daemon state |
| Dedup telemetry | Confirms effective top-k diversity |
| Graph readiness | Distinguishes blocked-fast from slow-degraded |
---
## 11. PERFORMANCE OPTIMIZATION
### Top 5 Cross-Cutting Recommendations
1. **Contract-first memory responses.** Add hard response-policy and token-telemetry fields before doing broader ranking work. This prevents high-cost model hallucination and misleading wrapper telemetry.
2. **Over-fetch where dedup or rerank exists.** CocoIndex should fetch `limit * 4` candidates before dedup/rerank, then return `limit` unique results. Iterations recommend this for Q2 and Q3.
3. **Block fast, scan explicitly.** Code graph read paths should fail fast with `code_graph_scan` routing rather than spend minutes on sparse answers and grep fallback.
4. **Keep full scans out of read paths.** The current `allowInlineFullScan:false` policy is correct; make the operator action obvious instead of weakening this boundary.
5. **Measure relation/ranking drift by window.** Causal graph and intent classifier issues both need deltas and stability corpora, not only lifetime totals or one-off examples.
### Token-Budget Telemetry
Problem: `actualTokens` can describe the returned fallback payload rather than the original over-budget payload.
Optimization:
- Record `preEnforcementTokens` and `returnedTokens`.
- Preserve metadata-only survivors before empty fallback.
- Treat empty fallback as degraded output.
Expected result: callers stop retrying or misdiagnosing "2 percent budget truncation" because the telemetry distinguishes overflow from returned size.
### Scan Latency
Problem: sparse or empty graph state can lead to late fallback and multi-minute degraded paths, as 006 recorded 249.8s for Q1/cli-opencode.
Optimization:
- Surface readiness before the first structural query.
- Return `fallbackDecision.nextTool:"code_graph_scan"` on blocked reads.
- Track blocked-fast as a successful recovery state.
### Dedup Over-Fetch Sizing
Problem: top-k nearest-neighbor results can collapse to one semantic chunk through mirror aliases.
Optimization:
- Fetch `limit * 4` initially.
- Group by `source_realpath + line range` or `content_hash + line range`.
- Return `limit` unique groups where enough unique chunks exist.
### Ranking Signals
Problem: pure vector distance can favor research prose over implementation source.
Optimization:
- Add path class metadata.
- Apply bounded implementation-intent boosts and docs/spec-research penalties.
- Return raw and adjusted score.
---
## ELIMINATED ALTERNATIVES
| Alternative | Status | Evidence | Reason Ruled Out |
|-------------|--------|----------|------------------|
| Missing `dist/` rebuild explains 005 Cluster 1/2 phantom fixes | Ruled out | `iteration-001.md:35-51`, `deltas/iter-001.jsonl:2-14` | Compiled files were newer and contained claimed markers |
| Direct `node` import probe is enough to claim MCP runtime fixed | Ruled out | `iteration-001.md:76-89`, `iteration-001.md:101-111` | Running daemon may still be stale until client restart |
| The 2 percent `memory_context` result proves original payload was under budget | Ruled out | `iteration-002.md:16-23`, `iteration-010.md:16-20` | Telemetry can report post-fallback token size |
| Underlying `memory_search` caused Q5 zero-fill | Ruled out | `iteration-002.md:24-34`, `iteration-005.md:28-30` | Direct `memory_search` returned hits; wrapper zero-filled nested payload |
| Context-server generic budget pass caused nested `count:0` | Ruled out | `iteration-002.md:36-40`, `iteration-010.md:28-32` | Generic pass trims `envelope.data.results`, not nested `content[0].text` |
| Schema enum omission caused Q7 supersedes-only growth | Ruled out | `iteration-008.md:23-31`, `deltas/iter-008.jsonl:3` | Relation schema supports all six canonical relations |
| SQLite constraints should enforce causal burst policy | Ruled out | `iteration-008.md:53-60` | Burst-rate and relation-share policy needs ingestion/window logic |
| Global markdown exclusion is the only Q3 option | Rejected as insufficiently flexible | `iteration-004.md:53-71` | Code-first settings are conservative, but mixed corpus needs path-class reranking |
---
## 12. OPEN QUESTIONS
Residual gaps beyond the original eight:
- **Q8 evidence gap**: The state log records Q8 findings, but the detailed iteration markdown was overwritten by a Q4 pass. Before implementation, run a focused Q8 preflight or reconstruct from CLI logs if available.
- **Live daemon state**: Q1 live MCP probes were blocked in Iteration 001. The next runtime implementation packet must restart the client and record live probe output.
- **CocoIndex source location**: Iterations cite `cocoindex_code/*.py`, but those files were not present as repo-local tracked files during synthesis. Implementation should locate the installed package source or plugin source-of-truth before patching.
- **Cross-runtime Q4 replay**: The strongest hallucination evidence is `cli-opencode`; sibling 006 mentions broader cross-AI behavior, but this packet's source-backed details are strongest for the I2 `cli-opencode` cell.
- **Graph readiness UI**: Decide whether `fallbackDecision` belongs only in query/context responses or also in startup/autoprime surfaces.
- **Causal caps threshold**: The proposed `supersedes > 80%` and `newEdges >= 50` threshold is a starting point, not measured production tuning.
---
## 13. SECURITY CONSIDERATIONS
### Path Canonicalization
Mirror aliases are not only a relevance problem. If hidden runtime roots and symlink aliases are indexed as independent sources, callers can cite paths that look distinct but point to the same content. Canonicalization should:
- Resolve real paths during scan.
- Prefer canonical display paths.
- Suppress runtime mirror aliases in normal results.
- Expose aliases only as debug telemetry.
Security value: reduces accidental disclosure of runtime-specific mirror layout and prevents callers from treating aliases as independent corroboration.
### Refusal and Citation Guardrails
Weak retrieval needs a hard policy because model callers are prone to convert plausible candidates into unsupported claims. Response policy should forbid:
- Invented spec folder IDs.
- Invented file paths.
- Invented function names.
- Line-number claims without a retrieved or read source.
Recommended fields:
```ts
{
  responsePolicy: {
    requiredAction: "ask_disambiguation",
    noCanonicalPathClaims: true,
    citationRequiredForPaths: true
  }
}
```
### Data Leakage Boundaries
- Do not index runtime mirror folders by default.
- Do not use hidden runtime roots as preferred result paths.
- Do not expose full duplicate alias groups unless debug mode is explicitly requested.
- Treat `requestQuality:"weak"` as non-authoritative for path claims.
### N/A
Authentication headers, browser security headers, CSRF, XSS, and DOM sanitization are N/A for this runtime-systems research packet.
---
## 14. FUTURE-PROOFING
### Phase C/D Backlog
| Packet | Scope | Blast Radius | Reason |
|--------|-------|--------------|--------|
| 008 | Memory contracts: `memory_context` telemetry + `memory_search` response policy | High | Blocks hallucinated citations and misleading truncation |
| 009 | CocoIndex settings, canonical identity, dedup, source-role rerank | High | Fixes duplicate collapse and implementation-query ranking |
| 010 | Code graph readiness and `fallbackDecision` routing | Medium | Reduces slow fallback loops |
| 011 | Causal graph relation-window diagnostics and auto caps | Medium | Detects/reduces supersedes bursts |
| 012 | Intent classifier normalized schema and paraphrase corpus | Medium | Stabilizes task/routing interpretation across CLIs |
### Migration Notes
- `memory_context` telemetry can be additive if `actualTokens` remains backward-compatible.
- `memory_search` response policy can be additive, but renderers/agents must honor it for the guardrail to work.
- CocoIndex schema changes may require full reindex and migration handling.
- Causal graph relation-window stats may need persisted counters or derived query windows.
- Intent classifier schema should avoid breaking existing callers expecting `meta.intent`.
### Decision Tree
```text
Is the failure a model hallucination after retrieval?
  -> Patch memory_search response policy first.
Is the failure empty memory_context payload with low token usage?
  -> Patch memory_context telemetry and fallback invariants.
Is the failure duplicate or markdown-heavy code search?
  -> Patch CocoIndex settings/dedup/rerank.
Is the failure slow structural fallback?
  -> Patch code graph fallbackDecision and scan routing.
Is the failure graph health imbalance?
  -> Patch causal stats and auto-edge caps.
```
---
## 15. API REFERENCE
### `memory_context`
Current relevant shape:
```ts
{
  meta?: {
    intent?: {
      intent: string;
      classificationKind?: "task-intent";
    };
    tokenBudgetEnforcement?: {
      budgetTokens: number;
      actualTokens: number;
      enforced: boolean;
      truncated: boolean;
      originalResultCount?: number;
      returnedResultCount?: number;
    };
  };
  data?: {
    queryIntentRouting?: {
      classificationKind?: "backend-routing";
      seeAlso?: string;
    };
  };
}
```
Recommended additions:
```ts
{
  meta: {
    tokenBudgetEnforcement: {
      preEnforcementTokens: number;
      returnedTokens: number;
      droppedAllResultsReason?: "impossible_budget" | "parse_failed" | "no_survivor_fits";
    }
  }
}
```
### `memory_search`
Current relevant shape:
```ts
{
  data: {
    results: unknown[];
    requestQuality?: {
      label: "good" | "partial" | "weak";
    };
    recovery?: {
      status: "no_results" | "partial" | "low_confidence";
      reason: "spec_filter_too_narrow" | "low_signal_query" | "knowledge_gap";
      suggestedQueries: string[];
      recommendedAction: "retry_broader" | "switch_mode" | "save_memory" | "ask_user";
    };
  }
}
```
Recommended additions:
```ts
{
  data: {
    citationPolicy?: "cite_results" | "do_not_cite_results";
    responsePolicy?: {
      requiredAction: "ask_disambiguation" | "broaden_or_ask" | "refuse_without_evidence";
      noCanonicalPathClaims: boolean;
      citationRequiredForPaths: boolean;
      safeResponse: string;
    };
  }
}
```
### `code_graph_query`
Current blocked payload includes:
```ts
{
  status: "blocked",
  data: {
    blocked: true,
    degraded: true,
    graphAnswersOmitted: true,
    requiredAction: "code_graph_scan",
    blockReason: "full_scan_required"
  }
}
```
Recommended addition:
```ts
{
  data: {
    fallbackDecision: {
      nextTool: "code_graph_scan",
      reason: "full_scan_required",
      retryAfter: "scan_complete"
    }
  }
}
```
### Recovery Payload
Current `RecoveryAction` vocabulary:
```ts
type RecoveryAction = "retry_broader" | "switch_mode" | "save_memory" | "ask_user";
```
Recommended:
```ts
type RecoveryAction =
  | "retry_broader"
  | "switch_mode"
  | "save_memory"
  | "ask_user"
  | "ask_disambiguation"
  | "refuse_without_evidence"
  | "broaden_or_ask";
```
### CocoIndex Result
Recommended shape:
```ts
{
  filePath: string;
  canonicalFilePath: string;
  sourceRealpath?: string;
  contentHash?: string;
  pathClass: "implementation" | "tests" | "docs" | "spec_research" | "generated" | "vendor";
  rawScore: number;
  adjustedScore: number;
  rankingSignals: string[];
}
```
---
## 16. TROUBLESHOOTING GUIDE
| Failure Mode | Diagnostic Signal | Likely Cause | Fix |
|--------------|-------------------|--------------|-----|
| Source fixed but live MCP unchanged | `dist/` markers present, live tool still old | MCP-owning client was not restarted | Tests, build, verify `dist/`, restart client, live MCP probe |
| `memory_context` emits `count:0,results:[]` with tiny token usage | Truncated metadata plus empty nested payload | Returned fallback telemetry hides original overflow | Add `preEnforcementTokens`, `returnedTokens`, `droppedAllResultsReason`, and payload/count tests |
| Search answer invents files or packets | `requestQuality:"weak"`, `low_confidence`, no suggestions | Recovery metadata is advisory | Add `responsePolicy.noCanonicalPathClaims` and ask/broaden behavior |
| CocoIndex top-k repeats one chunk | Same content under mirror aliases with identical scores | Symlink alias indexing and no dedup | Exclude mirrors, store canonical identity, over-fetch and dedup |
| Markdown outranks implementation source | Implementation query returns research notes first | Pure vector distance, no source role | Code-first corpus or path-class rerank with raw/adjusted scores |
| Code graph falls back slowly to `rg` | Empty/stale graph, structural query tried first | Readiness is not binding preflight | Run `code_graph_scan` for full-scan-required states before query |
| Causal graph adds supersedes bursts | New edges dominated by `supersedes` | Prediction-error/reconsolidation replacement burst | Add relation-window stats and auto-edge caps |
| Equivalent prompts classify differently | Paraphrases route differently across CLIs | Task intent and backend routing are not normalized | Separate telemetry and add paired paraphrase corpus |
---
## 17. ACKNOWLEDGEMENTS
Research contributors and source surfaces:
- `cli-codex` executor: produced the per-iteration markdown and delta artifacts.
- `cli-opencode`: supplied the strongest reproduced weak-retrieval hallucination evidence via sibling 006 I2.
- `cli-copilot`: part of the sibling 006 cross-AI stress-test context and a required cross-runtime validation target.
- Packet 005: defect catalog and acceptance evidence for memory search runtime bugs, including REQ-001, REQ-002, REQ-004, REQ-010, REQ-016, REQ-017, REQ-018, and REQ-019.
- Packet 006: search-intelligence stress-test evidence, weak retrieval hallucination class, live probes, and cross-CLI scenario framing.
- `sk-deep-research`: provided the skill-owned loop, state files, deltas, and convergence structure.
- `system-spec-kit`: provided the research template and spec-folder governance.
---
## 18. APPENDIX
### Glossary
- **Authoritative retrieval**: Retrieval output strong enough to cite as current project truth.
- **Backend routing**: Internal routing decision for which retrieval/search path to use.
- **Causal graph**: Memory relation graph storing edges such as `caused`, `supports`, and `supersedes`.
- **CocoIndex**: Semantic code-search subsystem used for implementation-oriented discovery.
- **Daemon restart**: Restart of the MCP-owning client/runtime so rebuilt `dist/` code is loaded.
- **Fallback decision**: Machine-readable next-tool instruction for degraded or blocked tool states.
- **Mirror alias**: Runtime-specific symlink or alternate path exposing the same physical spec content.
- **Non-authoritative retrieval**: Results that may guide further search but must not be cited as canonical.
- **Path class**: Classification of a result path as implementation, test, docs, spec research, generated, or vendor.
- **Task intent**: User-facing prompt intent such as understand, fix bug, or add feature.
### Related Research
| Packet | Relevance |
|--------|-----------|
| 005-memory-search-runtime-bugs | Original defect catalog and claimed P0 remediation |
| 001-search-intelligence-stress-test | Cross-AI stress-test, live probes, weak-retrieval hallucination evidence |
| 024-compact-code-graph | Prior code graph and CocoIndex bridge context |
### Change Log
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-04-27 | 1.0.0 | Canonical synthesis from 10 deep-research iterations, deltas, state log, registry, strategy, and spec | Codex |
### Source Coverage Matrix
| Question | Narrative | Delta | State | Confidence |
|----------|-----------|-------|-------|------------|
| Q1 | `iteration-001.md` | `iter-001.jsonl` | yes | High |
| Q2 | `iteration-003.md` | `iter-003.jsonl` | yes | High |
| Q3 | `iteration-004.md` | `iter-004.jsonl` | yes | High |
| Q4 | `iteration-006.md`, `iteration-009.md` | `iter-006.jsonl`, `iter-009.jsonl` | yes | High |
| Q5 | `iteration-002.md`, `iteration-005.md`, `iteration-010.md` | `iter-002.jsonl`, `iter-005.jsonl`, `iter-010.jsonl` | yes | High |
| Q6 | `iteration-007.md` | `iter-007.jsonl` | yes | High |
| Q7 | `iteration-008.md` | `iter-008.jsonl` | yes | High |
| Q8 | missing detailed narrative | state event only | yes | Medium-low |
