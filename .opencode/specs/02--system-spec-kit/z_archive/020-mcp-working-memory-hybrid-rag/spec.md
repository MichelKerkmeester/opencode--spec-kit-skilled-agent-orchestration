---
title: "Feature Specification: Working Memory + Hybrid RAG Automation [020-mcp-working-memory-hybrid-rag/spec]"
description: "Add session-cognitive automation to Spec Kit Memory MCP via selective pattern adoption from opencode-working-memory and graphrag-hybrid systems. Implements automatic context ext..."
trigger_phrases:
  - "feature"
  - "specification"
  - "working"
  - "memory"
  - "hybrid"
  - "spec"
  - "020"
  - "mcp"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Working Memory + Hybrid RAG Automation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Add session-cognitive automation to Spec Kit Memory MCP via selective pattern adoption from opencode-working-memory and graphrag-hybrid systems. Implements automatic context extraction, pressure-responsive retrieval policies, and event-based attention scoring to eliminate manual memory management and reduce token waste by 15%+ while preventing context-exceeded errors.

**Key Decisions**: TypeScript-only implementation (no Python/Docker), bounded boost limits (max 0.20), three-phase rollout with feature flags and shadow evaluation

**Critical Dependencies**: Existing hybrid search infrastructure (RRF fusion, working memory table, mode routing)
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-18 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec Kit Memory MCP requires manual memory saves (`/memory:save`), provides no pressure-triggered retrieval adaptation at high context usage, and ignores session attention scores during ranking. Users experience abrupt "context exceeded" failures at 90%+ token usage, forget to save important context, and see recent relevant work buried below 6-month-old documents.

### Purpose
Automate session continuity and context management through hook-based extraction, pressure-adaptive mode switching (>80% usage triggers lighter modes), and event-based attention boosting in search ranking to achieve "zero-touch" memory management.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase 0 (Prerequisites)**: Post-dispatch tool-completion hook/event pipeline in context-server.ts for extraction (non-blocking queued callbacks, per-callback error isolation, no await in dispatch response path); token-usage signal contract (`tokenUsage` parameter on memory_context) for pressure policy with three-tier fallback (primary: caller passes tokenUsage; fallback: server-side estimator from runtime context stats when available; last resort: no override + WARN); session lifecycle contract (session_id scope, propagation path, event_counter boundary/reset, resume behavior); evaluation dataset bootstrap: **100 real queries** from memory_search logs with baseline capture and coverage sanity checks — expansion to 1000 queries is the Phase 1/1.5 hardening gate before Phase 2, not a Phase 0 blocker
- **Phase 1**: Session-attention boost in memory-search.ts (post-RRF, bounded 0.20), pressure-aware mode override in memory-context.ts (>80% usage forces quick mode), event-based decay replacing time-based decay in working-memory.ts; **Phase 1.5 hardening gate**: expand evaluation dataset from 100 to 1000 queries, validate rank correlation >= 0.90, complete redaction calibration on 50 real Bash outputs (false-positive rate <= 15%) before Phase 2
- **Phase 2**: Extraction pipeline (new extraction-adapter.ts) with tool-class rules (Read spec.md -> attention 0.9, Grep error -> 0.8, Bash git commit -> 0.7), PII/secret redaction gate before working-memory insert, regex safety validation for extraction patterns, provenance metadata (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`), causal-neighbor boost (2-hop traversal via causal_edges table), system prompt injection for session resume
- **Testing**: Shadow evaluation (1000 queries, expanded at Phase 1.5 hardening gate), A/B testing with rank correlation >= 0.90, pressure simulation (50 sessions), integration tests for extraction rules, redaction gate unit tests, pre-implementation redaction calibration on 50 real Bash outputs (false-positive rate <= 15%)

### Out of Scope
- Phase 3+ expansion capabilities (graph sub-index, multi-session fusion, predictive pre-loading) - explicitly deferred to a follow-up spec after this spec's rollout phase completes and Phase 1+2 bottlenecks are measured
- External service dependencies (Neo4j, Qdrant, Python runtime) - TypeScript-only rule
- GraphRAG semantic search (already have vec0 extension) - reuse existing infrastructure

### Files to Change

**Phase 0 Prerequisites**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Modify | Register post-dispatch `afterToolCallbacks` hook array; fire after `dispatchTool()` returns (note: `dispatchTool()` is defined in `tools/index.ts`, but the hook wraps the *call site* in `context-server.ts` at ~line 163) |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Add optional `tokenUsage` (number 0.0–1.0) parameter to `memory_context` tool schema |

**Phase 1**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Add session-attention boost after RRF fusion (integrate into `postSearchPipeline()` at ~lines 433-496; note: RRF score originates in `lib/search/rrf-fusion.ts` as `FusionResult.score`, accessed as `.score` in handler — not as `rrfScore`) |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Add pressure-aware mode override consuming `tokenUsage` parameter; three-tier fallback: caller value → server-side estimator → WARN + no override (pass-through) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/working-memory.ts` | Modify | Replace time-based decay (current: `attentionDecayRate: 0.95`, `decayInterval: 60000ms`) with event-counter decay; add `event_counter` and `mention_count` tracking |
| `.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts` | Create | Single-source Zod-validated config: decay rates, boost limits, pressure thresholds, extraction rules |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts` | Create | Session-attention boost calculation from working_memory table (bounded 0.20) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/pressure-monitor.ts` | Create | Token usage ratio calculator; mode override logic (>0.80 → quick, 0.60–0.80 → focused) |

**Phase 2**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts` | Create | Schema-driven tool-class extraction rules, hook registration via `afterToolCallbacks` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts` | Create | PII/secret denylist patterns, `redact()` function returning `{ redacted, piiFound }` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Create | 2-hop causal traversal via `lib/storage/causal-edges.ts`, bounded boost (0.05/hop) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-findings -->
## 3.5. RESEARCH FINDINGS (Memory Quality Audit)

> **Full analysis**: See [`research.md`](research.md) — 50-file stratified sample audit of `.opencode/specs/02--system-spec-kit/**/memory/*.md`

### Population & Sample

| Metric | Value |
|--------|-------|
| Total memory files | 187 (162 archive / 25 active) |
| Sample size | 50 (stratified: 35 archive + 15 active, seed 136) |
| Legacy path references | 104/187 (55.6%) |

### Key Quantitative Findings

| Issue | Rate (n=50) |
|-------|------------|
| Files with `[N/A]` placeholders | 60.0% |
| Files with `[TBD]` placeholders | 40.0% |
| Generic decision fallback sentence present | 66.0% |
| Empty `trigger_phrases` block | 34.0% |
| `tool_count: 0` (zero tool tracking) | 58.0% |
| Orchestration chatter contamination artifacts | 18.0% |

### Quality Band Distribution

| Band | Definition | Rate |
|------|-----------|------|
| A (high signal, actionable) | High signal, low placeholders | 30.0% |
| B (generally useful) | Minor noise | 20.0% |
| **C (needs cleanup)** | Significant cleanup required | 46.0% |
| **D (low utility)** | Malformed or mostly boilerplate | 4.0% |

**50% of the corpus (C+D) falls below an acceptable production memory bar.**

### Root Causes Identified

| ID | Cause | Source |
|----|-------|--------|
| RC1 | Placeholder defaults (`[TBD]`, `[Not assessed]`) emitted by design when data missing | `collect-session-data.ts:145` |
| RC2 | Template-level fallback inserts boilerplate decision text when none resolved | `context_template.md:516` |
| RC3 | Decision extractor relies on narrow `type === 'decision'` signals only | `decision-extractor.ts:41` |
| RC4 | Legacy migration normalization incomplete (55.6% files carry stale paths) | Migration artifact |
| RC5 | No post-render schema+content validation gate at write time | Structural gap |

### Research Recommendations (Prioritized)

| Priority | Recommendation | Acceptance Target |
|----------|---------------|-------------------|
| P0 | Post-render hard validation gate — block `[TBD]`/invalid fields | Placeholder leakage <= 2% in new files over 14 days |
| P0 | Block low-signal fallback-only decision output | Generic fallback sentence in new files <= 10% |
| P0 | Contamination filter — remove orchestration phrases before extraction | Contamination occurrence in new files <= 1% |
| P1 | Strengthen decision extraction (lexical/rule cues beyond `type === 'decision'`) | Files with concrete decision (when session has choices) >= 70% |
| P1 | Semantic field backfill (`trigger_phrases`, `key_topics` from dominant nouns) | Empty `trigger_phrases` <= 5%, empty `key_topics` <= 5% |
| P1 | Persist `quality_score` + `quality_flags` per memory, filter by threshold | 100% of new memories include score and flags |
| P2 | Progressive template compactness by signal density | Median memory length reduced >= 25% with no MRR degradation |
| P2 | Legacy remediation batch for stale path references | Legacy-path refs reduced from 55.6% to <= 10% in active tier |
<!-- /ANCHOR:research-findings -->

---

<!-- ANCHOR:phase-doc-map -->
## 3.6. PHASE DOCUMENTATION MAP

To split execution planning by phase while keeping one canonical spec, this folder now includes dedicated phase packages plus a research-source subfolder.

| Subfolder | Coverage | Root Mapping | Dependency |
|-----------|----------|--------------|------------|
| `001-foundation-phases-0-1-1-5/` | Phase 0, Phase 1, Phase 1.5 hardening gate | REQ-001-006, REQ-009-012, REQ-014-017 (**primary owner for REQ-014 and REQ-017**); tasks `T000a-T028`, `T027a-T027o`; checks `CHK-125-139`, `CHK-155-159b` | Blocks Phase 2 package until hardening gate passes |
| `002-extraction-rollout-phases-2-3/` | Phase 2 extraction + Phase 3 rollout (closed execution package) | REQ-007-010, REQ-013 (**consumes REQ-014 and REQ-017 outputs from package 001**); tasks `T029-T070`; checks `CHK-140-166` | Depends on package 001 hardening sign-off; now hands off post-research backlog to Wave packages |
| `003-memory-quality-qp-0-4/` | Memory-quality workstream QP-0 through QP-4 | REQ-018-023; tasks `TQ001-TQ047`; checks `CHK-190-212` | Can start in parallel; QP-4 runs after QP-2/QP-3 stabilize |
| `004-post-research-wave-1-governance-foundations/` | Post-research Wave 1: governance foundations and runtime contracts | Backlog IDs `C136-08`, `C136-09`, `C136-10`, `C136-12`, `C136-01`, `C136-02`, `C136-03`; checks `CHK-217-222`, `CHK-226`; technical owners for adaptive fusion policy, typed retrieval trace envelope, and artifact-aware routing policy | Starts from post-research backlog; unblocks Wave 2 controlled delivery |
| `005-post-research-wave-2-controlled-delivery/` | Post-research Wave 2: controlled delivery evidence | Backlog IDs `C136-04`, `C136-05`, `C136-11`; checks `CHK-223-225`; technical owners for append-only mutation ledger and production operationalization of sync/async split + deterministic tools | Depends on Wave 1 contracts + telemetry readiness |
| `006-post-research-wave-3-outcome-confirmation/` | Post-research Wave 3: outcome confirmation and closure | Backlog IDs `C136-06`, `C136-07`; checks `CHK-227-228`; technical owner for capability truth matrix longitudinal confirmation and closure KPIs | Depends on Wave 2 rollout evidence and telemetry history |
| `research/` | Source research artifacts (analysis + recommendations) | Inputs for root spec/plan and package planning; no execution task IDs | Read-only evidence input; not an implementation package |

Rules for this split:
- Root `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` remain canonical for acceptance and cross-phase gates.
- Subfolder docs are execution-focused planning packages and must stay synchronized with root IDs.
- Each phase package is Level 3+ but intentionally includes only `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` (no package-local `decision-record.md` or `implementation-summary.md`).
- `research/` stores source-analysis inputs referenced by root planning docs.
- Packages `001` through `003` preserve historical execution evidence for delivered phases; packages `004` through `006` are the active planning surface for post-research follow-up waves.
- Requirement ownership is frozen by root `plan.md` section "2.7. REQUIREMENT OWNERSHIP MATRIX (FROZEN)": one primary owner package per requirement; downstream packages consume outputs but do not duplicate acceptance ownership.
<!-- /ANCHOR:phase-doc-map -->

---

<!-- ANCHOR:post-research-wave-framing -->
## 3.7. POST-RESEARCH TECHNICAL WAVE FRAMING

The post-research backlog is implemented as a technical-wave model (not a generic project-management split). The implementation contract is frozen to the capability set below.

| Upgrade Capability | Required Technical Contract | Primary Wave Owner | Backlog IDs |
|--------------------|-----------------------------|--------------------|-------------|
| 1) Adaptive hybrid fusion | Dynamic weighting by request intent and document type; no fixed one-size weighting profile | Wave 1 (`004`) | `C136-08`, `C136-10` |
| 2) Typed retrieval trace envelope | Trace stages must be typed and complete: `candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank` | Wave 1 (`004`) | `C136-08` |
| 3) Artifact-aware routing policy | Retrieval strategy must branch by artifact class (`spec`, `plan`, `tasks`, `checklist`) | Wave 1 (`004`) | `C136-09` |
| 4) Append-only mutation ledger | Ledger rows must include `reason`, `prior_hash`, `new_hash`, linked memory IDs, and decision metadata | Wave 2 (`005`) | `C136-11` |
| 5) Strong sync/async split | Deterministic foreground response path plus durable queue/worker jobs for heavy post-response work | Wave 2 (`005`) | `C136-04`, `C136-05` |
| 6) Typed degraded-mode contracts | Explicit failure mode, fallback mode, confidence impact, and retry recommendation contracts | Wave 1 foundation, Wave 2 operational proof | `C136-10`, `C136-04`, `C136-05` |
| 7) Deterministic exact-operation tools | Counts/status/dependency checks must be separate deterministic tools, not mixed into semantic retrieval | Wave 2 (`005`) | `C136-04`, `C136-05` |
| 8) Capability truth matrix | Runtime-generated matrix consumed by docs/handover with longitudinal drift confirmation | Wave 3 (`006`) | `C136-06`, `C136-07` |

Wave ownership lock:
- Wave 1 owns foundations for capabilities 1/2/3 and governance + telemetry readiness.
- Wave 2 owns capability 4 and controlled-delivery operationalization for capabilities 5/7 (with degraded-mode contract verification from capability 6).
- Wave 3 owns longitudinal confirmation for capability 8 and final outcome/KPI closure.
<!-- /ANCHOR:post-research-wave-framing -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Session-attention boost bounded to prevent score instability | Max boost = 0.20, rank correlation >= 0.90 with baseline; Phase 0 gate: 100-query sanity check; Phase 1.5 hardening gate: 1000-query shadow eval before Phase 2 |
| REQ-002 | Pressure policy prevents context-exceeded failures | >80% usage triggers quick mode, >60% triggers focused mode, verified in 50-session simulation with no hard limit failures |
| REQ-003 | TypeScript-only implementation (no external services) | No Python/Docker/Neo4j/Qdrant dependencies, runs in existing MCP server |
| REQ-004 | Feature flags for gradual rollout | Environment variables control each feature (session boost, pressure policy, extraction), default=off |
| REQ-005 | Config validation at startup | Zod schemas validate all cognitive configs, fail-fast on malformed values |
| REQ-011 | PII/secret redaction gate before working-memory insert | Denylist patterns (API_KEY, TOKEN, PASSWORD, SECRET, Bearer, PEM headers, email regex, phone regex, SSN regex) applied before insert; `redaction_applied: true` in provenance when triggered; unit tests cover all pattern classes |
| REQ-012 | Regex safety constraints prevent ReDoS in extraction rules | Extraction rule patterns validated at startup via polynomial-time check (reject nested quantifiers `(a+)+`, `(a*)*`, backreference-heavy patterns); startup aborts with descriptive error on unsafe pattern |
| REQ-018 | Post-render hard validation gate for generated memory files | Validator rejects files with: (a) any `[TBD]` or `[N/A]` in non-optional fields; (b) invalid `spec_folder` format (markdown or gate-prompt string); (c) empty `trigger_phrases` block when session had tool executions; (d) generic decision fallback sentence present — measured as: placeholder leakage rate <= 2% over 14-day rolling window on new files; malformed `spec_folder` incidence = 0 in CI |
| REQ-019 | Memory extraction contamination filter | Orchestration chatter phrases (e.g., "I'll execute this step by step", "Let me analyze") removed from summary text and trigger candidates before indexing; acceptance: contamination phrase occurrence in new files <= 1% |
| REQ-020 | Decision extraction quality — suppress low-signal fallback output | When no decisions resolve via `type === 'decision'` signals, section is omitted or replaced with machine-readable `decision_count: 0`; generic boilerplate fallback sentence not written; acceptance: generic fallback sentence prevalence in newly generated files <= 10% |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Event-based decay replaces time-based | `newScore = attentionScore * pow(0.85, eventsElapsed) + mentionCount * 0.05`, floor 0.05, survives pause/resume cycles |
| REQ-007 | Extraction rules cover primary tool classes | Read, Grep, Bash tools extract to working memory with tool-specific attention scores |
| REQ-008 | Causal-neighbor boost via existing `lib/storage/causal-edges.ts` | 2-hop traversal via causal_edges table, bounded boost (max 0.05 per hop), deduplication prevents double-scoring |
| REQ-009 | Shadow evaluation measures impact | Pre/post metrics for token waste, context errors, top-5 MRR, extraction precision/recall |
| REQ-010 | Rich response metadata explains automation | memory_search returns metadata field showing applied boosts (session, causal, pressure) |
| REQ-013 | Provenance metadata stored with extracted working-memory items | Each inserted item carries `{ source_tool, source_call_id, extraction_rule_id, redaction_applied }` queryable from working_memory table |
| REQ-014 | Post-dispatch hook pipeline operational before extraction can run | context-server.ts registers `afterToolCallbacks: Array<(toolName, args, result) => Promise<void>>` fired after `dispatchTool()` returns; extraction adapter registers via this mechanism |
| REQ-015 | Token-usage signal contract defined with explicit three-tier fallback | `memory_context` accepts optional `tokenUsage: number` (0.0–1.0); **Primary**: caller passes tokenUsage; **Fallback**: server-side estimator derived from runtime context statistics (token count from last tool result metadata, if available); **Last resort**: no override + WARN log "tokenUsage not provided and estimator unavailable; pressure policy inactive"; absence via last resort logged as WARN; behavior at each tier verified by unit tests |
| REQ-016 | Session lifecycle contract explicitly defined and testable | `session_id` scoped to MCP call context (passed by caller or auto-generated per-call); propagation path: caller → memory_context args → working_memory queries; `event_counter` resets to 0 on new session_id (not cross-session persistent); resume behavior: if same session_id reused, event_counter continues from last value stored in working_memory; defined in plan.md Architecture section; verified by integration test |
| REQ-017 | Redaction gate calibrated before rollout using real tool outputs | Pre-implementation calibration: run redaction patterns against >= 50 real Bash tool outputs from existing sessions (stored in scratch/redaction-calibration/); false-positive rate must be <= 15% (FP = content incorrectly flagged as secret); exclusion heuristics applied for commit-hash/UUID patterns before rollout; calibration results documented in scratch/redaction-calibration-results.md |
| REQ-021 | Semantic indexing field quality — minimum non-empty coverage | `generate-context.js` must populate `trigger_phrases` (>= 2 entries) and `key_topics` (>= 1 entry) for every memory with >= 5 tool executions; fallback strategy uses dominant nouns from changed-file names and session topic; acceptance: empty `trigger_phrases` <= 5%, empty `key_topics` <= 5% in new files |
| REQ-022 | Per-memory quality score persisted in metadata and indexing pipeline | Each generated memory carries `quality_score` (0.0–1.0 heuristic) and `quality_flags` (array: `has_placeholders`, `has_fallback_decision`, `has_contamination`, `sparse_semantic_fields`); retrieval pipeline may filter by threshold; acceptance: 100% of new memories include score and flags |
| REQ-023 | Stronger decision extraction signal coverage | Decision extractor augmented with lexical/rule-based cues from assistant and user turns (beyond strict `type === 'decision'`); acceptance: files with at least one concrete decision (when session included design choices) >= 70%
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Session Automation Targets
- **SC-001**: Token waste reduction >= 15% (measured as payload tokens in sessions >20 turns, baseline comparison)
- **SC-002**: Context-exceeded errors <= 25% baseline (count of "context exceeded" in sessions with pressure policy enabled)
- **SC-003**: Manual save reduction >= 60% (ratio of `/memory:save` calls to tool executions post-Phase 2)
- **SC-004**: Top-5 MRR >= 0.95x baseline (Mean Reciprocal Rank stability, no degradation from boosting)
- **SC-005**: User satisfaction >= 4.0/5.0 on continuity survey ("Agent remembered context across pauses")

### Memory Content Quality Targets (derived from research.md findings)
- **SC-006**: Placeholder leakage rate in newly generated files <= 2% over 14-day rolling window (baseline: 40–60%, RC1)
- **SC-007**: Generic fallback decision sentence prevalence in new files <= 10% (baseline: 66%, RC2)
- **SC-008**: Orchestration contamination phrase occurrence in new files <= 1% (baseline: 18%, RC5)
- **SC-009**: Empty `trigger_phrases` in new files <= 5% (baseline: 34%, RC3/RC5)
- **SC-010**: Empty `key_topics` in new files <= 5% (baseline: 10%)
- **SC-011**: Files with at least one concrete decision (when session included design choices) >= 70% (baseline: ~34%, RC3)
- **SC-012**: Quality band A+B >= 70% of newly generated files (baseline: 50%; current C+D rate 50% below production bar)
- **SC-013**: 100% of new memories carry `quality_score` and `quality_flags` in metadata
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing RRF fusion logic in hybrid-search.ts | If modified, boost integration breaks | Contract tests assert RRF output format, integration tests verify post-RRF boost hook |
| Dependency | Working memory table schema (session_id, attention_score) | Schema changes break queries | Database migration scripts, backward-compatible queries during rollout |
| Risk | Over-boosting recent irrelevant items | Recent grep for "test" outranks 6-month-old architecture doc | Hard cap 0.20, A/B test 1000 queries, monitor rank correlation <0.90 triggers rollback |
| Risk | Aggressive pressure policy (5 results vs 20 expected) | User confusion, incomplete results | Staged rollout (80% threshold -> tighten), feedback message in response, telemetry dashboards |
| Risk | Config drift (docs/code mismatch) | Silent failures, ranking anomalies | Single source (`configs/cognitive.ts`), Zod validation at init, generated docs, startup checks |
| Risk | Extraction false positives (noise in working memory) | Working memory fills with irrelevant items | Precision target >= 85%, sweep logic evicts low-scoring items, tunable attention thresholds |
| Risk | tokenUsage signal absent from callers | Pressure policy silently inactive, context-exceeded errors persist | Three-tier fallback (primary: caller passes tokenUsage; fallback: server-side estimator; last resort: WARN); estimator reduces silent inactive cases; WARN log makes absence visible in logs (REQ-015) |
| Risk | Redaction false positives for commit hashes / UUIDs | Useful git context stripped from working memory | Pre-implementation calibration on 50 real Bash outputs (REQ-017); exclusion heuristics for common safe patterns (40-hex commit SHA, UUID v4) applied as post-filter before insert |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Session-attention boost adds <10ms per search (measured at p95)
- **NFR-P02**: Causal-neighbor traversal adds <20ms per search for 2-hop with 20 results (SQLite query optimization)
- **NFR-P03**: Extraction hook adds <5ms per tool execution (non-blocking queued callback: callbacks are enqueued and executed asynchronously after `dispatchTool()` returns its response to the caller; no `await` in the dispatch response path; per-callback errors are isolated — one callback failure does not block others or delay response)

### Security
- **NFR-S01**: No SQL injection in attention boost queries (parameterized queries only)
- **NFR-S02**: Config validation prevents injection via environment variables (Zod type coercion)
- **NFR-S03**: PII/secret redaction applied synchronously before any working-memory insert; `redaction_applied` flag always set in provenance metadata when redaction triggers
- **NFR-S04**: Extraction rule regex patterns validated at server startup via polynomial-time safety check; unsafe patterns (nested quantifiers, catastrophic backtracking potential) cause startup abort, not silent skip

### Reliability
- **NFR-R01**: Bounded boost prevents scoring instability (max 0.20 enforced at code level, contract tests verify)
- **NFR-R02**: Pressure policy degrades gracefully (no abrupt failures, fallback to lighter modes)
- **NFR-R03**: Feature flags allow instant rollback (environment variable change, no deployment)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty working memory: Boost = 0, no errors, search proceeds with base RRF scores
- Working memory at capacity (7 items): LRU eviction triggers, lowest attention score evicted
- Zero attention score: Floor = 0.05 prevents oscillation, item remains searchable
- Extraction with PII detected: Content redacted before insert; if entire summary is redacted (>90% content removed), item is silently skipped and logged as WARN; `redaction_applied` remains in provenance for audit trail
- Redaction of commit hashes / UUIDs: Exclusion heuristics applied before general denylist — 40-hex SHA patterns and UUID v4 patterns explicitly excluded to prevent over-redaction of git output; tuned via calibration (REQ-017)

### Error Scenarios
- Causal edges table empty: Boost = 0, no traversal errors, degrades to vector-only search
- Token usage signal absent — three-tier behavior: (1) **Primary**: caller passes `tokenUsage` → pressure monitor uses value; (2) **Fallback**: server-side estimator derives ratio from runtime context stats (token count from most recent tool result metadata, if field present) → uses estimated ratio; (3) **Last resort**: neither available → no override (pass-through), logs WARN "tokenUsage not provided and estimator unavailable; pressure policy inactive"
- Session lifecycle boundary: New `session_id` → `event_counter` resets to 0 in working memory scope; same `session_id` reused (resume) → `event_counter` continues from last stored value; session_id absent → auto-generated per-call (no cross-call continuity)
- Extraction rule match failure: Silent skip (no working memory insert), logs debug message for tuning
- Config malformed (Zod validation fails): Server startup aborts with descriptive error (fail-fast principle)
- Unsafe regex pattern detected at startup: Server startup aborts with error "ExtractionRule contains potentially catastrophic regex: [pattern]"; all patterns must pass safety check before any rule is accepted
- Hook pipeline not initialized before extraction registration: Extraction adapter startup fails with "afterToolCallbacks not available; ensure context-server Phase 0 hook pipeline is initialized first"
- Hook callback error (non-blocking model): Per-callback errors are caught and logged; remaining callbacks continue; dispatch response to caller is unaffected (no await in dispatch path)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 10 (2 Phase 0 + 4 Phase 1 + 4 Phase 2), LOC: ~1000, Systems: 1 (MCP server) |
| Risk | 20/25 | Auth: No, API: No, Breaking: Ranking changes, Score instability risk, PII extraction risk |
| Research | 15/20 | Two reference systems analyzed (opencode-working-memory, graphrag-hybrid), pattern extraction complete |
| Multi-Agent | 8/15 | Workstreams: 3 (Phase 0 infra, Phase 1 core, Phase 2 extraction), sequential |
| Coordination | 10/15 | Dependencies: Hybrid search, RRF fusion, working memory table, mode routing, hook pipeline |
| **Total** | **73/100** | **Level 3** (bumped to 3+ for governance: feature flags, shadow eval, phased rollout) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Over-boosting recent irrelevant items dominates search | High | Medium | Hard cap 0.20, A/B test 1000 queries (Phase 1.5 gate), rank correlation monitor, kill switch |
| R-002 | Aggressive pressure policy returns too few results | Medium | Medium | Staged rollout (80% -> tighten), feedback message, override escape hatch, telemetry |
| R-003 | Config drift causes silent failures | Medium | Low | Single source (Zod validated), generated docs, startup checks, contract tests |
| R-004 | Extraction false positives fill working memory with noise | Medium | Medium | Precision >= 85% target, sweep logic, tunable thresholds, user feedback loop |
| R-005 | Causal traversal latency exceeds 20ms p95 | Low | Low | SQLite index optimization, 2-hop limit, caching for hot paths |
| R-006 | Event-counter rollover (>2^31) | Low | Very Low | Periodic normalization, modulo arithmetic, counter reset on session end |
| R-007 | PII/secrets extracted to working memory and surfaced in responses | High | Medium | Redaction gate applied before every insert; denylist patterns cover secrets + PII classes; `redaction_applied` in provenance for audit |
| R-008 | Unsafe regex in extraction rules causes catastrophic backtracking (ReDoS) | High | Low | Polynomial-time safety check at startup; patterns with nested quantifiers rejected; server aborts rather than accepting unsafe patterns |
| R-009 | Post-dispatch hook pipeline fails silently, extraction never runs | Medium | Low | Hook pipeline health logged at startup; extraction adapter registers callback and validates registration; integration test verifies end-to-end |
| R-010 | Token-usage signal not provided by callers, pressure policy always inactive | Medium | Medium | Three-tier fallback (primary: caller tokenUsage; fallback: server-side estimator from context stats; last resort: WARN log + no override); estimator substantially reduces "always inactive" case; WARN makes absence visible |
| R-011 | Redaction false positives for commit hashes / UUIDs degrade extraction | Medium | Medium | Pre-implementation calibration on 50 real Bash outputs (REQ-017); exclusion heuristics for 40-hex commit SHAs and UUID v4 patterns; tuning loop until FP rate <= 15% before Phase 2 rollout |
| R-012 | Session lifecycle ambiguity causes event_counter drift across sessions | Medium | Low | Explicit session lifecycle contract (REQ-016): session_id scoped per-call, event_counter resets on new session_id, resume reuses stored counter; integration test verifies boundary behavior |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 11. ACCEPTANCE SCENARIOS

### Scenario 1: Session Resume with Automatic Context Recall
**Given** a session with 15 tool executions including Read on spec.md and Bash git commit, **When** the session pauses for 2 hours and resumes with memory_search("recent work"), **Then** the top-5 results include spec.md content (attention 0.9) and commit message (attention 0.7), ranked above 6-month-old docs.

### Scenario 2: Pressure-Triggered Mode Override
**Given** a conversation at 85% token usage with 30 turns, **When** memory_context is called with mode="auto", **Then** the system overrides to mode="quick", returns 3-5 results instead of 10-20, includes pressure_level="HIGH" in response metadata, and prevents context-exceeded error.

### Scenario 3: Bounded Boost Stability Verification
**Given** 1000 test queries with baseline rankings captured, **When** session attention boost (max 0.20) is applied to all queries, **Then** rank correlation >= 0.90 compared to baseline, no query shows >3 position degradation for highly-relevant items, and average token payload decreases by >= 15%.

### Scenario 4: Event Decay Across Pause Cycles
**Given** working memory with 5 items at attention scores [0.9, 0.8, 0.7, 0.6, 0.5], **When** user pauses for 24 hours (0 events), resumes and performs 10 events, **Then** scores decay based on event distance (not wall-clock time), mention boost adds 0.05 per re-access, floor prevents any score dropping below 0.05.

### Scenario 5: Causal Neighbor Co-Activation
**Given** a memory "Implement session boost" with causal edges [CAUSED -> "Add event_counter column", SUPPORTS -> "Update RRF fusion"], **When** memory_search("session ranking improvements") matches the primary memory, **Then** 2-hop neighbors receive bounded boost (0.05/hop max), appear in top-10 results, response metadata shows applied_boosts including causal contribution.

### Scenario 6: Extraction Precision and Recall
**Given** 50 test sessions with 20 tool executions each (Read spec.md, Grep error logs, Bash git commit, Edit code, Bash npm test), **When** extraction rules run on all tool completions, **Then** precision >= 85% (false positive rate <= 15%), recall >= 70% (false negative rate <= 30%), working memory stays within capacity (7 items), LRU eviction triggers correctly.

### Scenario 7: Zero-Touch Memory Management
**Given** a 40-turn implementation session with 60 tool executions, **When** the session completes without any manual /memory:save calls, **Then** all critical context (spec.md reads, key decisions from Bash commits, error patterns from Grep) is auto-extracted to working memory, memory_context on resume surfaces relevant items in top-5, manual save count <= 40% of baseline.

### Scenario 8: Pressure Simulation with No Hard Failures
**Given** 50 simulated sessions with token usage ramping from 50% to 95%, **When** memory_context is called at each 5% increment, **Then** mode overrides trigger at 60% (focused), 80% (quick), zero sessions hit "context exceeded" hard limit, degradation is graceful with warning messages in response metadata.

### Scenario 9: Config Validation Fail-Fast
**Given** cognitive config with malformed values (boost_limit="invalid", decay_rate=-0.5, pressure_thresholds=[]), **When** MCP server starts, **Then** Zod validation fails immediately, server aborts with descriptive error messages, no silent failures or default-to-unsafe behavior.

### Scenario 10: Rollback Verification
**Given** production deployment with all features enabled (session boost, pressure policy, extraction), **When** feature flags are flipped to OFF, **Then** system reverts to baseline behavior (no boosts in response metadata, time-based decay if re-enabled, manual saves required), smoke tests pass, rank correlation returns to 1.0.

### Scenario 11: Causal Traversal Latency
**Given** causal_edges table with 500 edges across 200 memories, **When** memory_search executes with 20 results requiring 2-hop causal traversal, **Then** causal boost calculation adds <20ms at p95, SQLite recursive CTE completes in <10ms, deduplication prevents double-scoring of neighbors already in semantic results.

### Scenario 12: Working Memory Capacity Management
**Given** working memory at capacity (7 items) with attention scores [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3], **When** extraction hook attempts to insert new item with attention 0.75, **Then** LRU eviction removes lowest-scoring item (0.3), new item inserts successfully, capacity remains at 7, event counters update correctly.

### Scenario 13: PII Redaction Gate
**Given** a Bash tool execution that prints output containing "API_KEY=sk-abc123..." and a commit message with a developer email address, **When** the extraction hook fires and matches the Bash rule, **Then** the redaction gate detects both patterns (secret key + PII email), redacts them from the summary before working-memory insert, sets `redaction_applied: true` in provenance metadata, and logs WARN "Redaction applied: [pattern classes found]" — no raw secret or email appears in working memory.

### Scenario 14: Regex Safety at Server Startup
**Given** a cognitive config file containing an extraction rule with pattern `(a+)+$` (exponential-time backtracking potential), **When** the MCP server starts and Zod validates the config, **Then** the regex safety check detects the nested quantifier, server startup aborts immediately with error "ExtractionRule #N contains potentially catastrophic regex: (a+)+$ — rejected to prevent ReDoS", no rules are registered, and the server does not enter the ready state until the config is fixed.

### Scenario 15: Provenance Metadata on Extracted Items
**Given** a Read tool execution on `spec.md` that matches the extraction rule `{ toolPattern: /^Read/, contentPattern: /spec\.md$/, attention: 0.9 }` with a deterministic `call_id` from the tool dispatcher, **When** the extraction adapter inserts the item to working memory, **Then** the item carries `{ source_tool: "Read", source_call_id: "<call-id>", extraction_rule_id: "rule-0", redaction_applied: false }`, queryable via working_memory table, and returned in response metadata when the item surfaces in memory_search results.

### Scenario 16: Post-Render Quality Gate — Placeholder Rejection
**Given** a `generate-context.js` run that produces a memory file containing `[TBD]` in a non-optional field (e.g., `decisions` or `next_actions`), **When** the post-render validator runs, **Then** the validator rejects the file with error "Quality gate failed: placeholder leakage detected — field 'decisions' contains [TBD]", the file is either not indexed or downgraded to temporary tier, and `quality_flags` includes `has_placeholders: true`.

### Scenario 17: Fallback Decision Suppression
**Given** a session that produced no decisions tagged `type === 'decision'` and no lexical cues (user/assistant turns contain no decision-like patterns), **When** the context template renders the decisions section, **Then** the output contains `decision_count: 0` (machine-readable) rather than the generic fallback sentence, and `quality_flags` includes `has_fallback_decision: false`.

### Scenario 18: Contamination Filtering
**Given** a session narrative that contains "I'll execute this step by step" and "Let me analyze the following", **When** the contamination filter runs before summary and trigger extraction, **Then** those phrases are stripped from the rendered summary, `quality_flags` includes `has_contamination: false` in the final file, and contamination occurrence rate in the test batch of 50 files is <= 1%.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:user-stories -->
## 12. USER STORIES

### US-001: Automatic Session Continuity (Priority: P0)

**As a** developer using Spec Kit Memory across multiple sessions, **I want** the agent to automatically remember my recent work context, **so that** I don't need to manually run `/memory:save` or re-explain what I was doing.

**Acceptance Criteria**:
1. Given a session with 10+ tool executions, When the session resumes after 1 hour, Then recent relevant memories appear in top-5 search results
2. Given a Read tool execution on spec.md, When the tool completes, Then the content is automatically extracted to working memory with attention score 0.9
3. Given a Bash git commit, When the commit succeeds, Then the commit message is extracted to working memory decision slot with attention score 0.7

### US-002: Graceful Context Pressure Handling (Priority: P0)

**As a** user in a long conversation (>20 turns), **I want** the system to automatically switch to lighter retrieval modes at high token usage, **so that** I never hit abrupt "context exceeded" errors mid-task.

**Acceptance Criteria**:
1. Given token usage at 85%, When memory_context is called, Then mode is overridden to `quick` regardless of intent detection
2. Given token usage at 65%, When memory_context is called, Then mode is overridden to `focused` with warning message in response
3. Given 50 sessions simulated with pressure enabled, When measuring failures, Then zero "context exceeded" hard limit errors occur

### US-003: Session-Aware Search Ranking (Priority: P1)

**As a** developer searching memory, **I want** recent session items to rank higher than old documents, **so that** my current work context surfaces first without manual filtering.

**Acceptance Criteria**:
1. Given a memory accessed 5 minutes ago in current session, When searching with related query, Then session item receives attention boost (up to 0.20 multiplier)
2. Given 1000 test queries, When comparing boosted vs baseline rankings, Then rank correlation >= 0.90 (stability preserved)
3. Given a memory with 3 mentions in current session, When event decay is applied, Then mention boost contributes 0.05 * 3 = 0.15 to score

### US-004: Relationship-Aware Retrieval (Priority: P1)

**As a** developer querying memory, **I want** causally related memories to surface together, **so that** I see decision context and dependent changes in one search.

**Acceptance Criteria**:
1. Given a memory with 2-hop causal edges (`CAUSED`, `SUPPORTS`), When primary memory matches query, Then neighbors receive bounded boost (max 0.05 per hop)
2. Given causal_edges table with 100 edges, When traversal executes, Then latency < 20ms at p95
3. Given a neighbor already in top-20 semantic results, When causal boost is applied, Then deduplication prevents double-scoring (score boost only)
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 13. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Tech Lead | Complete | 2026-02-18 |
| Phase 1 Implementation | Tech Lead | Complete | 2026-02-19 |
| Shadow Evaluation Results | Tech Lead + Data Reviewer | Complete | 2026-02-19 |
| Phase 2 Implementation | Tech Lead | Complete | 2026-02-19 |
| Production Rollout | Tech Lead + Product Owner | Complete (admin closure) | 2026-02-19 |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 14. COMPLIANCE CHECKPOINTS

### Security Compliance
- [x] SQL injection prevention verified (parameterized queries only, contract tests)
- [x] Config validation prevents injection via env vars (Zod type coercion)
- [x] No hardcoded secrets in extraction rules or config defaults
- [x] PII/secret redaction gate applied before every working-memory insert (REQ-011)
- [x] Regex safety check runs at server startup; unsafe patterns cause abort (REQ-012)
- [x] Provenance metadata (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`) stored with every extracted item (REQ-013)

### Code Compliance
- [x] TypeScript strict mode enabled (no implicit any, null safety)
- [x] ESLint passes with project rules (no disabled checks)
- [x] No external dependencies added (TypeScript-only rule)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 15. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Tech Lead | Engineering | High | Daily standup, PR reviews |
| MCP Users | End Users | High | User surveys (pre/post), feedback loop |
| Data Reviewer | Analytics | Medium | Shadow evaluation results review |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 16. CHANGE LOG

### v1.6 (2026-02-19)
**Post-research technical wave framing alignment (execution-ready handoff update)**:
- Added explicit technical-wave framing section (`3.7`) covering capabilities 1-8: adaptive fusion, typed retrieval trace envelope, artifact-aware routing, append-only mutation ledger, sync/async split, typed degraded-mode contracts, deterministic exact-operation tools, and capability truth matrix.
- Tightened package ownership statements in `3.6` to align each wave package with explicit technical capability ownership while preserving frozen backlog mapping (`C136-01..C136-12`).
- Locked wave ownership semantics to the requested mapping: Wave 1 foundations (1/2/3 + governance/telemetry), Wave 2 controlled delivery (4 + 5/7 operationalization), Wave 3 longitudinal confirmation (8 + KPI closure).

### v1.5 (2026-02-18)
**Planning alignment fixes (ownership + deferral + taxonomy consistency)**:
- **Ownership freeze**: Locked single-owner requirement mapping for package overlaps; `001-foundation-phases-0-1-1-5/` is primary owner for `REQ-014` and `REQ-017`, `002-extraction-rollout-phases-2-3/` consumes those outputs (no duplicate ownership).
- **Phase policy lock**: Resolved Phase 3 expansion ambiguity; graph sub-index, multi-session fusion, and predictive pre-loading are now explicitly deferred to a separate Phase 3+ follow-up spec.
- **Taxonomy consistency**: Corrected evaluation dataset coverage wording to intent taxonomy (`add_feature`, `fix_bug`, `refactor`, `understand`, `find_spec`) instead of retrieval mode labels.
- **Cross-doc sync**: Updated package mappings and synchronization rules to reference the frozen ownership matrix in root planning docs.

### v1.4 (2026-02-18)
**Research findings incorporated — memory content quality requirements**:
- **Research**: Added §3.5 "Research Findings" section summarizing `research.md` 50-file audit: population context (187 files, 50 sampled), quantitative rates (60% `[N/A]`, 66% generic fallback, 34% empty `trigger_phrases`), quality bands (50% C+D below production bar), root causes RC1–RC5, and prioritized recommendations (P0/P1/P2 with acceptance metrics).
- **REQ-018**: Post-render hard validation gate — rejects files with placeholder leakage, malformed `spec_folder`, empty trigger blocks, or generic fallback sentence. Target: <= 2% placeholder leakage over 14-day rolling window; malformed `spec_folder` = 0 in CI.
- **REQ-019**: Memory extraction contamination filter — strips orchestration chatter before summary/trigger extraction. Target: <= 1% contamination occurrence in new files.
- **REQ-020**: Decision extraction quality — suppress low-signal fallback-only output; emit `decision_count: 0` instead of boilerplate. Target: generic fallback sentence in new files <= 10%.
- **REQ-021**: Semantic indexing field quality — minimum non-empty `trigger_phrases` (>= 2) and `key_topics` (>= 1) for sessions with >= 5 tool executions. Target: empty fields <= 5%.
- **REQ-022**: Per-memory quality score (`quality_score`, `quality_flags`) persisted in metadata. Target: 100% coverage of new memories.
- **REQ-023**: Stronger decision extraction signal coverage via lexical/rule cues. Target: >= 70% of sessions with design choices produce at least one concrete decision.
- **SC-006–SC-013**: Added measurable quality targets derived from research baseline rates.
- **Acceptance Scenarios 16–18**: Added scenarios for quality gate rejection, fallback suppression, and contamination filtering.
- **Related Documents**: Added `research.md` link with description.
- Removed `implementation-summary.md` (implementation has not started; per user request and v1.2 M1 precedent).

### v1.3 (2026-02-18)
**OPUS practical concerns addressed — implementation readiness update**:
- **C1-Eval**: Replaced hard Phase-0 dependency on 1000-query dataset with staged approach: Phase 0 gate = 100 real queries from memory_search logs (baseline captured, coverage sanity check); expansion to 1000 queries = Phase 1.5 hardening gate before Phase 2. Resolves open question on labeling: derived baseline (existing RRF ranking as proxy ground truth) + ~10% targeted human review sample. Updated REQ-001, scope, tasks, checklist, plan milestones.
- **C2-Token**: Defined concrete three-tier tokenUsage fallback mechanism: (1) Primary: caller passes tokenUsage; (2) Fallback: server-side estimator from runtime context stats; (3) Last resort: no override + WARN. Removed "feature silently inactive" ambiguity. Updated REQ-015, NFR-P03-adjacent description, plan Architecture, tasks T000f/T000g, checklist CHK-126/129/134.
- **C3-Redaction**: Added pre-implementation calibration requirement (REQ-017): 50 real Bash outputs, FP <= 15% threshold, tuning loop. Added exclusion heuristics for commit-hash/UUID over-redaction (post-filter before insert). Documented in decision-record ADR-005 Consequences/Risks. Updated tasks, checklist.
- **C4-Session**: Added explicit session lifecycle contract (REQ-016): session_id scope, propagation path, event_counter boundary/reset behavior, resume behavior. Added implementation tasks and checklist items (testable, not implicit). Updated plan Architecture/data-flow.
- **C5-Hook**: Resolved hook latency ambiguity — explicit model chosen: non-blocking queued callback execution, per-callback error isolation, no await in dispatch response path. Updated NFR-P03, plan Architecture, tasks T000a/T000b, checklist CHK-125/128.
- **Risks**: Added R-011 (redaction false positives/calibration), R-012 (session lifecycle ambiguity); updated R-010 (tokenUsage three-tier fallback).

### v1.2 (2026-02-18)
**Review fixes (C1-C4 critical, M1-M6 moderate, m1-m5 minor)**:
- **C1**: Resolved three-way `safe-regex` contradiction — REJECTED `safe-regex` dependency, aligned all documents to TypeScript polynomial-time safety check per ADR-001 no-new-dependencies rule. Rewrote ADR-006 in `decision-record.md`, removed duplicate ADRs from `plan.md` (now references `decision-record.md`)
- **C2**: Fixed `rrfScore` variable reference — corrected to `postSearchPipeline()` integration point with `.score` from `FusionResult` (not `rrfScore` which only exists in `rrf-fusion.ts`)
- **C3**: Fixed decay floor vs. eviction logic bug — raw score now checked before floor applied (`if (rawScore < 0.01) evict()` THEN `Math.max(0.05, rawScore)` for survivors). Also fixed wrap-around arithmetic for event counter
- **C4**: Resolved `tokenUsage` fallback contradiction — all documents now specify "no override (pass-through)" when `tokenUsage` absent, with WARN log
- **M1**: Deleted premature `implementation-summary.md` (per CLAUDE.md: created after implementation, not before)
- **M2**: Replaced duplicate ADR-005/ADR-006 in `plan.md` with reference to `decision-record.md` (single source of truth)
- **M3**: Added NOTE annotations to `analysis.md` code examples documenting intentional mention boost coefficient change (source 0.5 → spec 0.05)
- **M4**: Aligned Phase 0 timeline to "3-4 days" across `plan.md` and `tasks.md`
- **M5**: Recounted checklist items: 35 P0, 52 P1, 13 P2 (was 18/27/8 which only counted base items, not L3+ addendums)
- **M6**: Removed fundamentally flawed `safeMatch()` runtime timeout pattern from ADR-006 (post-hoc `Date.now()` check cannot prevent event loop blocking in single-threaded Node.js)
- **m1**: Added `dispatchTool()` location clarification (defined in `tools/index.ts`, hook wraps call site in `context-server.ts`)
- **m2**: Fixed event counter wrap-around arithmetic (`(current - last + MAX) % MAX` instead of simple subtraction)
- **m3**: Added scratch `.git` cleanup note to CHK-051
- **m4**: Fixed closing comment acceptance scenario count (12 → 15)
- **m5**: Resolved 4 of 6 open questions that were already answered by ADRs/requirements

### v1.1 (2026-02-18)
**Architecture corrections and feature additions**:
- Corrected canonical path for `working-memory.ts`: now references `lib/cache/cognitive/working-memory.ts` (confirmed via import analysis and inode identity; `lib/cognitive/working-memory.ts` is a hardlink alias)
- Corrected `causal-edges.ts` path: `lib/storage/causal-edges.ts` (not `lib/cognitive/`)
- Added Phase 0 prerequisite workstream (post-dispatch hook pipeline, token-usage signal contract)
- Added REQ-011: PII/secret redaction gate before working-memory insert
- Added REQ-012: Regex safety constraints (ReDoS prevention at startup)
- Added REQ-013: Provenance metadata (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`)
- Added REQ-014: Post-dispatch hook pipeline prerequisite
- Added REQ-015: Token-usage signal contract with fallback behavior
- Added NFR-S03 (redaction gate) and NFR-S04 (regex safety)
- Added R-007 through R-010 to risk matrix
- Added Scenarios 13–15 (PII redaction, regex safety, provenance metadata)
- Updated complexity assessment to reflect 10 files and 3 workstreams
- Updated files-to-change table with accurate paths and new Phase 0 files

### v1.0 (2026-02-18)
**Initial specification** - Based on analysis of opencode-working-memory and graphrag-hybrid systems, recommendations document defines three-phase roadmap with balanced path (Phase 1+2) for full automation stack
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 17. OPEN QUESTIONS

- ~~Should Phase 3 (graph sub-index, multi-session fusion) be explicitly deferred to separate spec folder, or kept as decision gate in this spec?~~ **RESOLVED (v1.5)**: Defer all Phase 3+ expansion capabilities (graph sub-index, multi-session fusion, predictive pre-loading) to a separate follow-up spec after this spec's rollout phase completes and Phase 1+2 bottlenecks are measured.
- ~~What is the target threshold for "acceptable" rank correlation degradation (0.90 vs 0.95)?~~ **RESOLVED**: REQ-001 specifies >= 0.90; consistent across spec, plan, and checklist.
- ~~Should extraction rules be user-configurable via config file, or hardcoded with tuning via code changes only?~~ **RESOLVED**: ADR-004 decides schema-driven rules hardcoded in TypeScript now; JSON config path is deferred to a Phase 3+ follow-up spec if validated need.
- ~~What is the authoritative source for `call_id` in the tool dispatcher?~~ **RESOLVED**: Inspect `dispatchTool()` return signature in `tools/index.ts`; if no `call_id` returned, generate UUID at hook call site in `context-server.ts` before passing to `afterToolCallbacks`.
- ~~Should the redaction denylist be externally configurable (per-project), or kept as a hardcoded secure default?~~ **RESOLVED**: ADR-005 decides hardcoded denylist (not user-configurable) to prevent misconfiguration.
- ~~Evaluation dataset bootstrap: Is 1000 queries sufficient for the shadow set, and should ground-truth relevance judgments be human-labeled or derived from existing memory feedback signals?~~ **RESOLVED (v1.3, clarified v1.5)**: Staged approach adopted — Phase 0 gate uses 100 real queries from memory_search logs with derived baseline (from existing RRF ranking as proxy ground truth) plus targeted human review of ~10% sample; expansion to 1000 queries is the Phase 1.5 hardening gate. 100-query coverage sanity check verifies at least 5 queries per intent type (`add_feature`, `fix_bug`, `refactor`, `understand`, `find_spec`). Human labeling deferred until Phase 1.5 when more real queries are available.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Memory Quality Audit**: See `research.md` — 50-file stratified sample, root causes RC1–RC5, P0/P1/P2 recommendations with acceptance metrics
- **Source Analysis**: See `research/136 - analysis-working-memory-hybrid-rag-systems.md`
- **Source Recommendations**: See `research/136 - recommendations-working-memory-hybrid-rag-adoption.md`

---

<!--
LEVEL 3+ SPEC
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
- 18 explicit acceptance scenarios (SECTION_COUNTS compliance; 15 original + 3 quality gate scenarios)
- Content derived from `research/136 - recommendations-working-memory-hybrid-rag-adoption.md`, `research/136 - analysis-working-memory-hybrid-rag-systems.md`, and `research.md` (50-file memory quality audit)
- v1.4: Added §3.5 research findings, REQ-018–023, SC-006–013, Scenarios 16–18, quality gate requirements
-->
