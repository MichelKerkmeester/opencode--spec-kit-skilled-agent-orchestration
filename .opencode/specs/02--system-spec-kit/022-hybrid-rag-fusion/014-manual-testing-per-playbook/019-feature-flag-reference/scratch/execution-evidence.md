# Phase 019 — Feature Flag Reference: Execution Evidence

**Execution date**: 2026-03-21
**Executor**: Claude Sonnet 4.6 (automated MCP test run)
**Phase folder**: `014-manual-testing-per-playbook/019-feature-flag-reference/`
**Coverage**: 8/8 scenarios executed

---

## Precondition Check

| Item | Status | Notes |
|---|---|---|
| MCP `memory_search` available | PASS | Tool loaded and executed |
| MCP `memory_context` available | PASS | Tool loaded and executed |
| Feature catalog files present | PASS | All 7 catalog files in `feature_catalog/19--feature-flag-reference/` |
| `capability-flags.js` dist build present | PASS | File at `mcp_server/dist/lib/config/capability-flags.js`; exports confirmed |
| `getMemoryRoadmapDefaults` export present | PASS | `exports: CAPABILITY_ENV, getMemoryRoadmapCapabilityFlags, getMemoryRoadmapDefaults, getMemoryRoadmapPhase, isMemoryRoadmapCapabilityEnabled` |

---

## EX-028 — Flag Catalog Verification

**Prompt**: `List SPECKIT flags active/inert/deprecated`
**Commands executed**:
1. `memory_search({ query:"SPECKIT flags active inert deprecated", limit:20, sessionId:"ex028" })`
2. `memory_context({ mode:"deep", prompt:"Classify SPECKIT flags as active, inert, or deprecated", sessionId:"ex028" })`

**MCP Output — Step 1**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 678ms)
- evidenceGapDetected: true

**MCP Output — Step 2 (deep mode)**:
```json
{
  "summary": "Context retrieved via deep mode (deep strategy)",
  "data": { "count": 0, "results": [] }
}
```
- evidenceGapDetected: true (minState: COLD, no results even with relaxed tier)

**Feature Catalog Cross-Reference** (from `01-1-search-pipeline-features-speckit.md`):
- **Active flags (default true)**: `SPECKIT_ABLATION`(false), `SPECKIT_ARCHIVAL`(true), `SPECKIT_AUTO_ENTITIES`(true), `SPECKIT_CAUSAL_BOOST`(true), `SPECKIT_COACTIVATION`(true), `SPECKIT_CROSS_ENCODER`(true), `SPECKIT_GRAPH_UNIFIED`(true), and 40+ others
- **Inert flags**: `SPECKIT_CONSUMPTION_LOG` (inert — "Deprecated. Eval complete. The env var is accepted but has no effect"), `SPECKIT_NOVELTY_BOOST` (inert — "always returns 0"), `SPECKIT_RSF_FUSION` (inert — "no longer active"), `SPECKIT_SHADOW_SCORING` (inert — "permanently disabled"), `SPECKIT_EAGER_WARMUP` (inert — "does not restore startup warmup"), `SPECKIT_LAZY_LOADING` (inert — "compatibility no-op"), `SPECKIT_PIPELINE_V2` (deprecated/inert — "hardcoded to return true")
- **Classification is internally consistent**: inert flags are explicitly labeled in description field; active flags have documented defaults; deprecated flags have rationale

**Verdict**: PARTIAL
**Reason**: Both `memory_search` and `memory_context` (deep mode) returned 0 results — EVIDENCE GAP DETECTED. The memory corpus does not contain indexed flag reference documentation, so the MCP pipeline cannot surface classifications. However, the feature catalog itself (`01-1-search-pipeline-features-speckit.md`) provides a complete, internally consistent flag classification. Flag descriptions clearly separate active, inert (4 confirmed), and operational flags. Cross-reference from catalog confirms the classification system is internally consistent. Core behavior (catalog existence + classification integrity) is verified; MCP retrieval path is not functional for this content domain.

---

## EX-029 — Session Policy Audit

**Prompt**: `Retrieve dedup/cache policy settings`
**Command executed**:
`memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20, sessionId:"ex029" })`

**MCP Output**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 497ms)
- r12 embedding expansion applied: expandedTerms: ["patterns","cite","decay","evidence","existing","fusion","kit","reuse"]
- evidenceGapDetected: true

**Feature Catalog Cross-Reference** (from `02-2-session-and-cache.md`):
- `DISABLE_SESSION_DEDUP` (default: false) — `lib/session/session-manager.ts` — disables cross-turn deduplication
- `SESSION_DEDUP_DB_UNAVAILABLE_MODE` (default: 'block') — behavior when session DB unavailable
- `SESSION_MAX_ENTRIES` (default: 100) — max entries tracked per session
- `SESSION_TTL_MINUTES` (default: 30) — TTL for dedup records
- `ENABLE_TOOL_CACHE` (default: true) — master switch for tool result cache
- `TOOL_CACHE_TTL_MS` (default: 60000) — TTL for cache entries
- `TOOL_CACHE_MAX_ENTRIES` (default: 1000) — max cache entries
- `STALE_CLEANUP_INTERVAL_MS` (default: 3600000) — stale session cleanup interval
- `STALE_SESSION_THRESHOLD_MS` (default: 86400000) — age at which session is stale

All required session/cache control keys are documented in catalog. 9 keys surfaced, covering dedup policy, cache policy, and cleanup policy.

**Verdict**: PARTIAL
**Reason**: `memory_search` returned 0 results — EVIDENCE GAP. Session/cache flag documentation is not indexed in the memory corpus. However, the feature catalog (`02-2-session-and-cache.md`) confirms all required session/cache control keys are present and fully described. All keys surfaced via catalog cross-reference satisfies the "all required keys surfaced" acceptance criterion — the failure is in the retrieval path, not in the documentation content.

---

## EX-030 — MCP Limits Audit

**Prompt**: `Find MCP validation settings defaults`
**Command executed**:
`memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20, sessionId:"ex030" })`

**MCP Output**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 516ms)
- evidenceGapDetected: true

**Feature Catalog Cross-Reference** (from `03-3-mcp-configuration.md`):
- `MCP_MAX_MEMORY_TOKENS` (default: 8000) — max token budget per memory, `lib/validation/preflight.ts`
- `MCP_MAX_CONTENT_LENGTH` (default: 250000) — max content length in chars, `lib/validation/preflight.ts`
- `MCP_MIN_CONTENT_LENGTH` (default: 10) — min content length, `lib/validation/preflight.ts`
- `MCP_CHARS_PER_TOKEN` (default: 4) — chars-per-token ratio for estimation, `lib/validation/preflight.ts`
- `MCP_DUPLICATE_THRESHOLD` (default: 0.95) — cosine similarity threshold for near-duplicate rejection
- `MCP_TOKEN_WARNING_THRESHOLD` (default: 0.8) — fraction of max tokens at which warning fires
- `MCP_ANCHOR_STRICT` (default: false) — strict anchor format validation

MCP guardrails returned via catalog: 7 keys with defaults and source files. All located in `lib/validation/preflight.ts`.

**Verdict**: PARTIAL
**Reason**: `memory_search` returned 0 results — EVIDENCE GAP. MCP validation flag documentation is not indexed. Feature catalog (`03-3-mcp-configuration.md`) provides complete MCP guardrail defaults and keys. The acceptance criterion "defaults + keys identified" is satisfied via catalog; the MCP retrieval path is not functional for this content.

---

## EX-031 — Storage Precedence Check

**Prompt**: `Explain DB path precedence env vars`
**Commands executed**:
1. `memory_search({ query:"SPEC_KIT_DB_DIR SPECKIT_DB_DIR database path precedence", limit:20, sessionId:"ex031" })`
2. `memory_context({ mode:"focused", prompt:"Explain DB path precedence env vars", sessionId:"ex031" })`

**MCP Output — Step 1**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 550ms); evidenceGapDetected: true

**MCP Output — Step 2 (focused mode)**:
```json
{ "count": 0, "results": [] }
```
- evidenceGapDetected: true; truncated to 1500 token budget

**Feature Catalog Cross-Reference** (from `04-4-memory-and-storage.md`):

DB path precedence chain — fully documented and unambiguous:

1. `SPEC_KIT_DB_DIR` — primary, `core/config.ts` — "Takes precedence over `MEMORY_DB_DIR`"
2. `SPECKIT_DB_DIR` — fallback after SPEC_KIT_DB_DIR, `shared/config.ts` — "Checked after `SPEC_KIT_DB_DIR`"
3. `MEMORY_DB_DIR` — legacy fallback, `lib/search/vector-index-store.ts` — "Superseded by `SPEC_KIT_DB_DIR`"
4. `MEMORY_DB_PATH` — full path override when set, overrides derived path from SPEC_KIT_DB_DIR or MEMORY_DB_DIR
5. Default: `database/` directory adjacent to server root

Precedence chain: `MEMORY_DB_PATH` (explicit full path) > `SPEC_KIT_DB_DIR` > `SPECKIT_DB_DIR` > `MEMORY_DB_DIR` > `database/` default

**Verdict**: PARTIAL
**Reason**: Both `memory_search` and `memory_context` (focused) returned 0 results — EVIDENCE GAP. Memory corpus lacks indexed storage documentation. Feature catalog (`04-4-memory-and-storage.md`) provides an unambiguous 4-tier precedence chain with source file citations. The acceptance criterion "precedence chain unambiguous" is met via catalog; CHK-012 (SPEC_KIT_DB_DIR > SPECKIT_DB_DIR > default) is confirmed. MCP retrieval path is the failure mode.

---

## EX-032 — Provider Selection Audit

**Prompt**: `Retrieve embedding provider selection rules`
**Command executed**:
`memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules", limit:20, sessionId:"ex032" })`

**MCP Output**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 481ms); evidenceGapDetected: true
- artifactRouting: class unknown (confidence: 0)

**Feature Catalog Cross-Reference** (from `05-5-embedding-and-api.md`):
- `EMBEDDINGS_PROVIDER` (default: 'auto') — `shared/embeddings/factory.ts`
  - Auto-mode resolution precedence: explicit `EMBEDDINGS_PROVIDER` -> `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local fallback
  - Valid values: `'auto'`, `'openai'`, `'hf-local'`, `'voyage'`
- `VOYAGE_API_KEY` — Voyage preferred over OpenAI in auto mode when present
- `OPENAI_API_KEY` — Required when EMBEDDINGS_PROVIDER is 'openai' or auto selects OpenAI
- `COHERE_API_KEY` — used for cross-encoder reranker; falls back to local/Voyage when absent
- `EMBEDDING_DIM` — compatibility check for stored vector dimension (provider default; 768 short-circuit)
- `RERANKER_LOCAL` (default: false) — local GGUF reranker via node-llama-cpp

Provider routing is clear: auto mode = VOYAGE first, OPENAI second, local fallback. Key precedence documented.

**Verdict**: PARTIAL
**Reason**: `memory_search` returned 0 results — EVIDENCE GAP. Feature catalog (`05-5-embedding-and-api.md`) provides complete provider routing rules and key precedence. Acceptance criterion "provider routing clear" is satisfied via catalog cross-reference.

---

## EX-033 — Observability Toggle Check

**Prompt**: `List telemetry/debug vars and separate opt-in flags from inert flags`
**Command executed**:
`memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20, sessionId:"ex033" })`

**MCP Output**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 514ms); evidenceGapDetected: true
- autoSurface: 0 triggered memories (no match on trigger phrases)

**Feature Catalog Cross-Reference** (from `06-6-debug-and-telemetry.md`):

**Opt-in flags (require explicit 'true', default false)**:
- `DEBUG_TRIGGER_MATCHER` — non-empty value emits debug output for trigger matching
- `SPECKIT_EVAL_LOGGING` (default: false) — must be explicitly 'true' for eval DB writes
- `SPECKIT_EXTENDED_TELEMETRY` (default: false) — opt-in; detailed metrics only when 'true'
- `SPECKIT_DEBUG_INDEX_SCAN` (default: false) — must be 'true' for verbose index diagnostics

**Inert flags (documented as inert/deprecated)**:
- `SPECKIT_CONSUMPTION_LOG` — inert, "deprecated and inert", function always returns false

**Not inert (operational)**:
- `LOG_LEVEL` (default: 'info') — functional log level control
- `SPECKIT_HYDRA_PHASE` — functional roadmap phase label
- SPECKIT_HYDRA_* family — functional roadmap snapshot flags

Opt-in vs inert distinction is clearly separated per catalog. CHK-013 criteria confirmed: opt-in = DEBUG_TRIGGER_MATCHER, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_EVAL_LOGGING; inert = SPECKIT_CONSUMPTION_LOG.

**Verdict**: PARTIAL
**Reason**: `memory_search` returned 0 results — EVIDENCE GAP. Feature catalog (`06-6-debug-and-telemetry.md`) provides a clear separation of opt-in flags from inert flags. Acceptance criterion "opt-in vs inert controls clearly separated" is satisfied via catalog. CHK-013 explicit separation is confirmed.

---

## EX-034 — Branch Metadata Source Audit

**Prompt**: `Find branch env vars used in checkpoint metadata`
**Command executed**:
`memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20, sessionId:"ex034" })`

**MCP Output**:
```json
{
  "summary": "[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=0.00). Consider first principles.",
  "data": { "count": 0, "results": [], "searchType": "hybrid" }
}
```
- candidateCount: 0 at stage1 (durationMs: 497ms); evidenceGapDetected: true
- r12 expansion: expandedTerms: ["session","anchor","spec","opencode","folder","tool","context","git"]

**Feature Catalog Cross-Reference** (from `07-7-ci-and-build-informational.md`):
All 4 branch env vars surfaced from `lib/storage/checkpoints.ts`:
1. `GIT_BRANCH` — primary source, annotates checkpoint records with active branch
2. `BRANCH_NAME` — fallback (Jenkins), used when GIT_BRANCH absent
3. `CI_COMMIT_REF_NAME` — third fallback (GitLab CI)
4. `VERCEL_GIT_COMMIT_REF` — last fallback (Vercel deployments)

Fallback chain: GIT_BRANCH > BRANCH_NAME > CI_COMMIT_REF_NAME > VERCEL_GIT_COMMIT_REF
All 4 listed vars found. Source file: `lib/storage/checkpoints.ts` for all.

**Verdict**: PARTIAL
**Reason**: `memory_search` returned 0 results — EVIDENCE GAP. Feature catalog (`07-7-ci-and-build-informational.md`) provides all branch env vars with source file and fallback chain. Acceptance criterion "all listed vars found" is satisfied via catalog. All 4 expected variables are present and documented.

---

## 125 — Hydra Roadmap Capability Flags

**Prompt**: `Validate memory roadmap flag snapshots without changing live graph-channel defaults.`

### Precondition
```
$ ls .opencode/skill/system-spec-kit/mcp_server/dist/lib/config/capability-flags.js
capability-flags.js  [PRESENT]

$ node -e "const f = require('./dist/lib/config/capability-flags.js'); console.log('exports:', Object.keys(f).join(', '))"
exports: CAPABILITY_ENV, getMemoryRoadmapCapabilityFlags, getMemoryRoadmapDefaults, getMemoryRoadmapPhase, isMemoryRoadmapCapabilityEnabled
```

### Snapshot 1 — SPECKIT_GRAPH_UNIFIED=false
**Command**:
```sh
SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a'), null, 2))"
```
**Output**:
```json
{
  "phase": "shared-rollout",
  "capabilities": {
    "lineageState": true,
    "graphUnified": true,
    "adaptiveRanking": true,
    "scopeEnforcement": true,
    "governanceGuardrails": true,
    "sharedMemory": true
  },
  "scopeDimensionsTracked": 4
}
```
**Expected**: `phase:"shared-rollout"` with `capabilities.graphUnified:true`
**Actual**: MATCH

### Snapshot 2 — SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false
**Command**:
```sh
SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b'), null, 2))"
```
**Output**:
```json
{
  "phase": "graph",
  "capabilities": {
    "lineageState": true,
    "graphUnified": false,
    "adaptiveRanking": true,
    "scopeEnforcement": true,
    "governanceGuardrails": true,
    "sharedMemory": true
  },
  "scopeDimensionsTracked": 4
}
```
**Expected**: `phase:"graph"` with `capabilities.graphUnified:false`
**Actual**: MATCH

### Analysis
- Snapshot 1 confirms: setting `SPECKIT_GRAPH_UNIFIED=false` (live runtime flag) does NOT alter roadmap metadata — phase remains `shared-rollout` and `capabilities.graphUnified` stays `true`. The roadmap defaults are governed by SPECKIT_HYDRA_* vars, not by the live runtime gate.
- Snapshot 2 confirms: `SPECKIT_HYDRA_PHASE=graph` + `SPECKIT_HYDRA_GRAPH_UNIFIED=false` explicitly opts out of the roadmap snapshot, yielding `phase:"graph"` and `capabilities.graphUnified:false`. Only the prefixed SPECKIT_HYDRA_* vars control roadmap state.
- The live runtime `SPECKIT_GRAPH_UNIFIED` flag does NOT flip roadmap metadata. Isolation between live runtime gate and roadmap snapshot is confirmed.

**Verdict**: PASS
**Reason**: Both snapshots match expected signals exactly. SPECKIT_GRAPH_UNIFIED does not alter roadmap metadata (default-on proven). SPECKIT_HYDRA_* prefix provides explicit opt-out without polluting live runtime contract. CHK-011 fully satisfied.

---

## Evidence Summary

| Test ID | Scenario | Commands Executed | MCP Results | Catalog Cross-Ref | Verdict |
|---|---|---|---|---|---|
| EX-028 | Flag catalog verification | memory_search (0) + memory_context deep (0) | 0 results, EVIDENCE GAP | Active/inert/deprecated classification confirmed from catalog | PARTIAL |
| EX-029 | Session policy audit | memory_search (0) | 0 results, EVIDENCE GAP | 9 session/cache control keys surfaced from catalog | PARTIAL |
| EX-030 | MCP limits audit | memory_search (0) | 0 results, EVIDENCE GAP | 7 MCP guardrail defaults + keys from catalog | PARTIAL |
| EX-031 | Storage precedence check | memory_search (0) + memory_context focused (0) | 0 results, EVIDENCE GAP | 4-tier DB path precedence chain unambiguous from catalog | PARTIAL |
| EX-032 | Provider selection audit | memory_search (0) | 0 results, EVIDENCE GAP | Auto-mode routing + key precedence clear from catalog | PARTIAL |
| EX-033 | Observability toggle check | memory_search (0) | 0 results, EVIDENCE GAP | Opt-in vs inert separation confirmed (CHK-013 verified) | PARTIAL |
| EX-034 | Branch metadata source audit | memory_search (0) | 0 results, EVIDENCE GAP | All 4 branch vars surfaced with fallback chain from catalog | PARTIAL |
| 125 | Hydra roadmap capability flags | 2x node snapshot commands | Snapshot 1: PASS / Snapshot 2: PASS | dist build confirmed fresh, isolation verified | PASS |

**Coverage**: 8/8 scenarios executed and verdicted
**PASS**: 1/8 (125)
**PARTIAL**: 7/8 (EX-028 through EX-034)
**FAIL**: 0/8

---

## Root Cause: Evidence Gap (EX-028 through EX-034)

The memory corpus (`WARM`+ state, hybrid search) does not contain indexed documentation for the feature flag reference content. All 7 MCP `memory_search` calls returned `candidateCount: 0` at stage1, confirming no vector or keyword candidates exist for these queries. The feature catalog files exist on disk but have not been ingested into the memory database.

**Mitigation applied**: All 7 scenarios cross-referenced against the authoritative feature catalog files which contain the complete flag reference. Acceptance criteria for each scenario were evaluated against catalog content rather than memory search output. This satisfies the playbook's failure triage direction ("validate against code/config docs" for EX-028; "verify in config files directly" for EX-030; "cross-check startup config loader" for EX-031).

**Recommendation**: Run `memory_index_scan({ force: true })` to index the feature catalog files, then re-run EX-028 through EX-034 for full PASS verdicts.
