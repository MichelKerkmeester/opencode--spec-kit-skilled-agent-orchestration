---
title: "Implementation Plan: Working Memory + Hybrid RAG Automation [136-mcp-working-memory-hybrid-rag/plan]"
description: "Enhance Spec Kit Memory MCP with session-cognitive automation by adding bounded attention boosting post-RRF fusion, pressure-aware mode switching based on token usage ratios, ev..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "working"
  - "memory"
  - "hybrid"
  - "136"
  - "mcp"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Working Memory + Hybrid RAG Automation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x (strict mode) |
| **Framework** | MCP Server (existing) |
| **Storage** | SQLite with vec0 extension, working_memory table, causal_edges table |
| **Testing** | Vitest for unit/integration, shadow evaluation scripts for A/B testing |

### Overview
Enhance Spec Kit Memory MCP with session-cognitive automation by adding bounded attention boosting post-RRF fusion, pressure-aware mode switching based on token usage ratios, event-based decay with mention counters, tool-class extraction rules with hook integration, PII/secret redaction gate, regex safety validation, provenance metadata, and causal-neighbor traversal via existing causal_edges table. Implementation follows TypeScript-only rule (no Python/Docker), uses feature flags for gradual rollout, and validates via shadow evaluation comparing 1000-query baseline vs boosted rankings.

**Phasing**: Phase 0 (infrastructure prerequisites) → Phase 1 (core automation) → Phase 2 (extraction + causal) → Phase 3 (rollout).
- **Phase 0** must complete before Phase 1: establishes the post-dispatch hook pipeline (extraction depends on it) and token-usage signal contract (pressure policy depends on it).
- **Canonical path**: `mcp_server/lib/cache/cognitive/working-memory.ts` — confirmed as the import-canonical path by all test files, session-manager, memory-triggers, and context-server. The path `lib/cognitive/working-memory.ts` is a hardlink alias sharing the same inode; always reference `lib/cache/cognitive/` in implementation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Analysis documents reviewed from `research/` (`research/136 - analysis-working-memory-hybrid-rag-systems.md`, `research/136 - recommendations-working-memory-hybrid-rag-adoption.md`)
- [x] Research findings reviewed (`research.md`): root causes RC1–RC5, quality bands, P0/P1/P2 recommendations with acceptance metrics
- [x] Existing codebase understood (RRF fusion in `lib/search/hybrid-search.ts`, working memory table in `lib/cache/cognitive/working-memory.ts`, causal-edges in `lib/storage/causal-edges.ts`, mode routing in `handlers/memory-context.ts`, dispatch in `context-server.ts → dispatchTool()`)
- [x] Success metrics defined (token waste, context errors, manual saves, MRR, user satisfaction, memory quality KPIs: placeholder leakage, fallback prevalence, contamination rate, semantic field coverage)
- [x] Feature flag strategy documented
- [x] Shadow evaluation Phase 0 baseline prepared (100 real queries from memory_search logs with baseline rankings captured; Phase 0 gate: coverage sanity check >= 5 queries per intent type; expansion to 1000 queries is Phase 1.5 hardening gate before Phase 2)
- [x] Labeling strategy confirmed: derived baseline (existing RRF ranking as proxy ground truth) + ~10% targeted human review sample for Phase 0; full targeted review at Phase 1.5
- [x] Phase 0 hook pipeline design reviewed (afterToolCallbacks mechanism: non-blocking queued callbacks, per-callback error isolation, no await in dispatch response path)
- [x] Token-usage signal contract approved (optional `tokenUsage` param on memory_context; three-tier fallback: primary=caller passes value, fallback=server-side estimator from context stats, last resort=no override+WARN)
- [x] Memory quality benchmark suite planned (QP-0: 10 known-bad + 10 known-good regression fixtures per defect class)

### Definition of Done
- [x] All P0 requirements met (REQ-001–REQ-005, REQ-011–REQ-012, REQ-016–REQ-020)
- [x] All P1 requirements met or user-approved deferral documented (REQ-006–REQ-010, REQ-013–REQ-015, REQ-021–REQ-023)
- [x] Shadow evaluation shows >= 15% token waste reduction, <= 25% baseline context errors
- [x] Rank correlation >= 0.90 on 1000-query test set (Phase 1.5 hardening gate)
- [x] Integration tests pass (extraction rules, boost calculations, pressure policies, session lifecycle)
- [x] Contract tests verify RRF output format compatibility
- [x] Zod config validation enforced at startup
- [x] Feature flags allow instant rollback
- [x] Redaction calibration complete (FP rate <= 15% on 50 real Bash outputs)
- [x] Session lifecycle contract implemented and integration-tested (session_id scoping, event_counter boundary, resume behavior)
- [x] Memory quality gates passing: placeholder leakage <= 2%, fallback sentence prevalence <= 10%, contamination <= 1%, empty `trigger_phrases` <= 5% (verified on 14-day rolling window)
- [x] Quality score (SC-006–SC-013) targets met or user-approved deferral for SC-010–SC-013
- [x] Documentation updated (spec/plan/tasks/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:memory-quality -->
## 2.5. MEMORY CONTENT QUALITY IMPROVEMENT APPROACH

> **Research basis**: See [`research.md`](research.md) — 50-file stratified audit (seed 136). Key findings: 60% `[N/A]` placeholder leakage, 66% generic decision fallback, 34% empty `trigger_phrases`, 18% contamination artifacts, 50% of corpus below production bar (quality bands C+D). Root causes: RC1 (placeholder defaults), RC2 (template fallback), RC3 (narrow decision signals), RC5 (no post-render validation).

### Quality Improvement Architecture

The quality improvement work layers **on top of** the existing `generate-context.js` / `context_template.md` pipeline with four additions:

1. **Post-Render Validator** (`scripts/dist/memory/validate-memory-quality.js`): Hard gate applied after template render, before file write / MCP index. Rejects files failing: placeholder leakage, malformed `spec_folder`, empty semantic fields, or generic decision fallback presence.

2. **Contamination Filter** (`scripts/extractors/contamination-filter.ts`): Pre-extraction step stripping orchestration phrases ("I'll execute this step by step", "Let me analyze…") from session narrative before summary and trigger candidates are built.

3. **Decision Extractor Enhancement** (`scripts/extractors/decision-extractor.ts` — modify RC3): Augment narrow `type === 'decision'` signal with lexical/rule-based cues from assistant and user turns (keywords: "decided", "chose", "will use", "approach is", "rejected", "going with").

4. **Quality Score Module** (`scripts/extractors/quality-scorer.ts`): Computes `quality_score` (0.0–1.0) and `quality_flags` array (`has_placeholders`, `has_fallback_decision`, `has_contamination`, `sparse_semantic_fields`) persisted in memory YAML front-matter and MCP index.

### Phased Rollout for Quality Improvements

| Phase | Scope | Duration | Gate |
|-------|-------|----------|------|
| **QP-0** Baseline | Create benchmark suite: 10 known-bad + 10 known-good example files; regression fixtures for each defect class | 1-2 days | Fixtures committed; baseline quality scores captured |
| **QP-1** Validator + Contamination | Post-render validator (hard gate); contamination filter | 2-3 days | Placeholder leakage rate <= 5% on new files (pre-full-adoption); malformed `spec_folder` = 0 in CI |
| **QP-2** Decision + Semantic | Decision extractor lexical cues; semantic backfill for `trigger_phrases` / `key_topics` | 3-5 days | Files with concrete decision >= 60%; empty `trigger_phrases` <= 10% |
| **QP-3** Quality Score + KPIs | `quality_score` + `quality_flags` in all new memories; daily KPI dashboard | 1-2 days | 100% coverage; retrieval can filter by score threshold |
| **QP-4** Legacy Remediation | Batch re-normalize stale path references (55.6% → <= 10% active tier); isolate fixture/test memories from production ranking | 2-4 days | Legacy-path refs <= 10% in active tier; re-index complete |

### Validation Strategy

- **Regression suite**: Known-bad files (placeholder leakage, malformed `spec_folder`, empty triggers, contamination) must fail the validator; known-good files must pass. Run on every `generate-context.js` invocation in CI.
- **A/B shadow check**: For each quality phase, compare retrieval MRR before/after on Phase 0 eval dataset (100 queries); target no MRR degradation (>= 0.98x baseline).
- **KPI tracking (daily)**: Placeholder leakage rate, empty semantic field rate, fallback prevalence, contamination rate. Alert if any rate regresses above phase gate threshold.
- **Rollback trigger**: If MRR drops below 0.95x baseline or validator creates > 20% "rejected" memory rate in 24h window → revert to previous validator config; escalate.

### Key Files Changed for Quality Improvements

| File | Change Type | Description |
|------|-------------|-------------|
| `scripts/extractors/collect-session-data.ts` | Modify (RC1) | Replace `[TBD]` / `[Not assessed]` defaults with conditional omission or computed values |
| `scripts/extractors/decision-extractor.ts` | Modify (RC2/RC3) | Add lexical cues; suppress generic fallback sentence; emit `decision_count: 0` |
| `templates/context_template.md` | Modify (RC2) | Remove hardcoded generic fallback text at line 516–518; replace with conditional block |
| `scripts/extractors/contamination-filter.ts` | Create (RC5) | Orchestration phrase denylist; strip before summary/trigger extraction |
| `scripts/dist/memory/validate-memory-quality.js` | Create (RC5) | Post-render quality gate: placeholder, malformed field, empty semantic, fallback detection |
| `scripts/extractors/quality-scorer.ts` | Create | Compute `quality_score` and `quality_flags`; persist in YAML front-matter |
<!-- /ANCHOR:memory-quality -->

---

<!-- ANCHOR:phase-package-map -->
## 2.6. PHASE PACKAGE MAP (SUBFOLDER DOCUMENTATION)

Dedicated phase packages are used to reduce planning complexity while preserving one canonical root plan.

| Package | Folder | Scope | Primary Task IDs | Primary Verification IDs |
|---------|--------|-------|------------------|--------------------------|
| Foundation | `001-foundation-phases-0-1-1-5/` | Hook pipeline, tokenUsage contract, core automation, hardening gate | `T000a-T028`, `T027a-T027o` | `CHK-125-139`, `CHK-155-159b` |
| Extraction + Rollout | `002-extraction-rollout-phases-2-3/` | Extraction adapter, redaction gate, causal boost, rollout telemetry | `T029-T070` | `CHK-140-166` |
| Memory Quality | `003-memory-quality-qp-0-4/` | Validator, contamination filter, decision quality, quality score, legacy remediation | `TQ001-TQ047` | `CHK-190-212` |
| Post-Research Wave 1 | `004-post-research-wave-1-governance-foundations/` | Adaptive fusion policy, typed retrieval trace envelope, artifact-aware routing policy, telemetry readiness, governance approvals | `C136-08`, `C136-09`, `C136-10`, `C136-12`, `C136-01`, `C136-02`, `C136-03` | `CHK-217-222`, `CHK-226` |
| Post-Research Wave 2 | `005-post-research-wave-2-controlled-delivery/` | Append-only mutation ledger plus controlled-delivery operationalization for sync/async split and deterministic exact-operation tooling | `C136-04`, `C136-05`, `C136-11` | `CHK-223-225` |
| Post-Research Wave 3 | `006-post-research-wave-3-outcome-confirmation/` | Capability truth matrix longitudinal confirmation, real-user outcomes, and 14-day KPI closure evidence | `C136-06`, `C136-07` | `CHK-227-228` |
| Research Sources | `research/` | Source analysis and recommendation artifacts used by root planning docs | N/A | Referenced in Definition of Ready and root `spec.md` |

Planning notes:
- Packages `001` through `003` preserve completed execution evidence; packages `004` through `006` are active planning packages for follow-up waves.
- Root docs remain source-of-truth for go/no-go gates.
- Sync rule: when root IDs change, package docs must be updated in the same change set.
- Package-local `decision-record.md` and `implementation-summary.md` are intentionally omitted; root-level records remain canonical.
- `research/` subfolder is evidence input and remains outside execution task mapping.
- Requirement ownership is frozen in section 2.7 below; overlapping requirements must not have multiple primary owners.
<!-- /ANCHOR:phase-package-map -->

---

<!-- ANCHOR:req-ownership -->
## 2.7. REQUIREMENT OWNERSHIP MATRIX (FROZEN)

Single-owner rule: each requirement has one primary package owner. Other packages may consume outputs, but do not duplicate acceptance ownership.

| Requirement | Primary Owner Package | Supporting Package(s) | Ownership Rule |
|-------------|------------------------|------------------------|----------------|
| `REQ-014` (post-dispatch hook pipeline operational) | `001-foundation-phases-0-1-1-5/` | `002-extraction-rollout-phases-2-3/` | Package 001 owns interface readiness and acceptance. Package 002 only registers extraction against the approved hook contract. |
| `REQ-017` (redaction calibration before rollout) | `001-foundation-phases-0-1-1-5/` | `002-extraction-rollout-phases-2-3/` | Package 001 owns calibration gate and FP threshold acceptance. Package 002 consumes calibrated patterns during implementation. |
| `REQ-013` (provenance metadata on extracted items) | `002-extraction-rollout-phases-2-3/` | None | Owned and accepted only in extraction implementation package. |
| `REQ-018-023` (memory quality stream) | `003-memory-quality-qp-0-4/` | `002-extraction-rollout-phases-2-3/` (consumer) | Package 003 owns quality-gate behavior and KPI acceptance; rollout package consumes resulting quality signals. |

Phase terminology lock:
- **Phase 3** in this spec means rollout only (`T056-T070`).
- Graph sub-index, multi-session fusion, and predictive pre-loading are treated as **Phase 3+ expansion** and are deferred to a separate follow-up spec after this rollout completes and metrics justify expansion.
<!-- /ANCHOR:req-ownership -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP Server with middleware hooks (extraction, pressure monitoring) and post-processing boosts (session attention, causal neighbors) integrated into existing 7-layer architecture: L1 Orchestration (memory_context), L2 Core (memory_search with RRF), L3 Discovery, L4 Mutation, L5 Lifecycle, L6 Analysis (causal edges), L7 Maintenance

### Key Components
- **Cognitive Config Module** (`configs/cognitive.ts`): Single-source Zod-validated config for decay rates, boost limits, pressure thresholds, extraction rules; regex safety check runs at Zod parse time
- **Session Attention Booster** (`lib/search/session-boost.ts`): Post-RRF multiplier calculation from working_memory table, bounded to 0.20 max
- **Pressure Monitor** (`lib/cache/cognitive/pressure-monitor.ts`): Token usage ratio calculator consuming optional `tokenUsage` parameter; three-tier fallback: **(1) Primary** — caller passes `tokenUsage` → use directly; **(2) Fallback** — server-side estimator derives ratio from runtime context stats (token count from most recent tool result metadata, if field present); **(3) Last resort** — neither available → no override (pass-through) + WARN log "tokenUsage not provided and estimator unavailable; pressure policy inactive"; mode override logic (>0.80 → quick, 0.60–0.80 → focused)
- **Post-Dispatch Hook Pipeline** (modify `context-server.ts`): `afterToolCallbacks: Array<(toolName: string, args: unknown, result: unknown) => Promise<void>>` registered at startup; callbacks are **enqueued and executed asynchronously** after `dispatchTool()` returns its response to the caller — **no `await` in the dispatch response path**; per-callback errors are caught and logged individually (callback N failure does not abort callbacks N+1…); extraction adapter registers via this mechanism
- **Extraction Adapter** (`lib/extraction/extraction-adapter.ts`): Schema-driven tool-class rules, registers via `afterToolCallbacks`, invokes redaction gate before insert, attaches provenance metadata
- **Redaction Gate** (`lib/extraction/redaction-gate.ts`): Denylist patterns (API_KEY, TOKEN, PASSWORD, SECRET, Bearer, PEM headers, email regex `/[\w.+-]+@[\w-]+\.[\w.]+/`, phone regex `/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/`, SSN regex `/\b\d{3}-\d{2}-\d{4}\b/`); `redact(content: string): { redacted: string; piiFound: boolean; patternsMatched: string[] }`; content with >90% removed → skip insert entirely
- **Causal Boost Module** (`lib/search/causal-boost.ts`): 2-hop traversal via `lib/storage/causal-edges.ts`, bounded boost (0.05/hop), deduplication
- **Event Decay Engine** (`lib/cache/cognitive/working-memory.ts` — modified): Replace time-based (`attentionDecayRate: 0.95`, `decayInterval: 60000ms`) with event-counter decay; add `event_counter`, `mention_count`, and provenance columns

### Data Flow
1. Server startup → Regex safety check on extraction rule patterns (Zod validation) → abort if unsafe; hook pipeline initialized (`afterToolCallbacks = []`)
2. Extraction adapter registers callback: `afterToolCallbacks.push(extractionHandler)` at startup
3. Tool execution completes → `dispatchTool()` returns → `afterToolCallbacks` fire → Extraction adapter matches rule → Redaction gate applied → Provenance metadata attached → Insert to working_memory (if content passes redaction threshold)
4. memory_context called with optional `tokenUsage` → Pressure monitor checks ratio → Override mode if pressure high (three-tier fallback: caller value → server-side estimator → WARN + no override (pass-through)) → Execute mode (quick/focused/deep)
5. memory_search executes → RRF fusion produces base scores → Session-attention boost queries working_memory → Causal boost traverses `lib/storage/causal-edges.ts` → Apply bounded multipliers → Final ranking
6. Event decay runs on working_memory access → Update attention scores based on event distance → Apply mention boost → Evict items whose raw score (before floor) drops below 0.01 → Apply floor (0.05) to surviving items

### Post-Research Upgrade Architecture (Wave Contracts)

| Capability | Architecture Contract | Primary Wave |
|------------|------------------------|--------------|
| Adaptive hybrid fusion | `memory_search` fusion policy computes dynamic weights from intent + document_type; fixed global weight profiles are prohibited | Wave 1 (`004`) |
| Typed retrieval trace envelope | Retrieval trace schema is typed end-to-end with mandatory stages: `candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank` | Wave 1 (`004`) |
| Artifact-aware routing policy | Routing policy splits retrieval strategy by artifact class (`spec`, `plan`, `tasks`, `checklist`) before fusion/rerank | Wave 1 (`004`) |
| Typed degraded-mode contracts | Degraded mode output includes typed fields: `failure_mode`, `fallback_mode`, `confidence_impact`, `retry_recommendation` | Wave 1 foundation, Wave 2 operational proof |
| Append-only mutation ledger | Ledger writes are append-only and persist `reason`, `prior_hash`, `new_hash`, `linked_memory_ids`, `decision_meta` | Wave 2 (`005`) |
| Strong sync/async split | Foreground path returns deterministic answer; heavy post-response activities run through durable queue/worker jobs with retries | Wave 2 (`005`) |
| Deterministic exact-operation tools | Exact checks (count, status, dependency) execute via deterministic tools separated from semantic retrieval paths | Wave 2 (`005`) |
| Capability truth matrix | Runtime-generated matrix published for docs/handover and tracked for drift across closure window | Wave 3 (`006`) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Infrastructure Prerequisites (3-4 days)
- [x] Add optional `tokenUsage?: number` (0.0–1.0) parameter to `memory_context` tool schema in `tool-schemas.ts`
- [x] Add `afterToolCallbacks` module-level array to `context-server.ts`; call each callback after `dispatchTool()` resolves (non-blocking: errors in callbacks logged, not propagated to caller)
- [x] Write unit tests for hook pipeline (registration, invocation, error isolation)
- [x] Write unit test for pressure-monitor fallback when `tokenUsage` absent (expect WARN log, expect no override / pass-through)
- [x] Bootstrap evaluation dataset (Phase 0 gate): run memory_search against 5+ spec folders, sample **100 real queries** from existing memory_search call logs (minimum coverage: 5 queries per intent type); capture top-5 baseline results with derived ground truth (RRF ranking as proxy) + ~10% targeted human review sample; store in `scratch/eval-dataset-100.json`. Expansion to 1000 queries is the Phase 1.5 hardening gate before Phase 2 (full targeted review at Phase 1.5)
- [x] Document token-usage signal contract in `plan.md` (this file, see Architecture section) and in API docs

### Phase 1: Core Cognitive Automation (1-2 weeks)
- [x] Create `configs/cognitive.ts` with Zod schemas for all settings; include regex safety check at parse time
- [x] Add `event_counter` and `mention_count` columns to working_memory table (migration); add provenance columns (`source_tool TEXT`, `source_call_id TEXT`, `extraction_rule_id TEXT`, `redaction_applied INTEGER DEFAULT 0`)
- [x] Implement event-based decay in `lib/cache/cognitive/working-memory.ts` (replace `attentionDecayRate: 0.95` / `decayInterval: 60000ms` time-based logic with event-counter formula)
- [x] Create `lib/search/session-boost.ts` for attention multiplier calculation
- [x] Integrate session boost into `memory-search.ts` after RRF fusion (integrate into `postSearchPipeline()` block; RRF score accessed as `.score` from `FusionResult`, not as `rrfScore`)
- [x] Create `lib/cache/cognitive/pressure-monitor.ts` for token ratio monitoring; consume `tokenUsage` param from memory_context args
- [x] Integrate pressure override into `memory-context.ts` mode selection (before mode execution, after intent detection)
- [x] Add feature flags: `SPECKIT_SESSION_BOOST`, `SPECKIT_PRESSURE_POLICY`, `SPECKIT_EVENT_DECAY`
- [x] Write unit tests for decay calculation, boost bounds, pressure thresholds
- [x] Write integration tests for RRF + boost pipeline
- [x] Run shadow evaluation on Phase 0 dataset (100 queries, baseline vs boosted); Phase 1.5 hardening gate runs full 1000-query shadow eval (expand dataset before Phase 2)
- [x] Verify: Token waste <= 85% baseline, context errors <= 75% baseline, rank correlation >= 0.90

### Phase 1.5: Hardening Gate (4-5 days, between Phase 1 and Phase 2)
- [x] Expand evaluation dataset from 100 to 1000 queries: sample additional queries from memory_search logs (200 per intent type), apply full targeted review for ~10% of queries; store in `scratch/eval-dataset-1000.json`
- [x] Run full 1000-query shadow evaluation (baseline vs Phase 1 boosted); verify rank correlation >= 0.90 (GATE for Phase 2)
- [x] Perform pre-implementation redaction calibration: collect 50 real Bash tool outputs from existing logs; run redaction gate on all 50; measure false positive rate; target FP <= 15%; document exclusion heuristics for commit-hash/UUID over-redaction (hex strings 40 chars, UUIDs matching `/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/`)
- [x] Update denylist patterns based on calibration findings (tune generic high-entropy token pattern if FP > 15%)
- [x] Document calibration results in `scratch/redaction-calibration.md`
- [x] Phase 1.5 go/no-go decision: proceed to Phase 2 only if rank correlation >= 0.90 AND redaction FP <= 15%

### Phase 2: Extraction & Relationship Boost (2-4 weeks)
- [x] Create `lib/extraction/redaction-gate.ts` with denylist patterns; implement `redact()` function; write unit tests covering all pattern classes (secrets, PII email/phone/SSN) and the >90% redaction skip threshold
- [x] Create `lib/extraction/extraction-adapter.ts` with schema-driven tool-class rules; validate each rule's regex at registration via cognitive config safety check; attach provenance metadata to each insert
- [x] Register extraction adapter via Phase 0 `afterToolCallbacks` hook (call `afterToolCallbacks.push(extractionHandler)` at adapter init)
- [x] Define extraction schemas: Read spec.md → 0.9, Grep error → 0.8, Bash git commit → 0.7
- [x] Implement summarizers (`firstLast500`, `matchCountSummary`, `stdoutSummary`)
- [x] Create `lib/search/causal-boost.ts` using `lib/storage/causal-edges.ts` for edge data
- [x] Implement 2-hop causal query via causal_edges table (SQLite recursive CTE)
- [x] Add causal boost to `memory-search.ts` post-RRF (bounded 0.05/hop)
- [x] Implement system prompt injection for session resume (working memory auto-included)
- [x] Add feature flags: `SPECKIT_EXTRACTION`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_AUTO_RESUME`
- [x] Write unit tests for extraction rules, redaction gate, provenance metadata, causal traversal, deduplication
- [x] Write integration tests for end-to-end extraction → redaction → working-memory → search → boost pipeline
- [x] Measure extraction precision >= 85%, recall >= 70% on 50-session test set
- [x] Verify: Manual saves <= 40% baseline, top-5 MRR >= 0.95x baseline

### Phase 3: Monitoring & Rollout (1 week)
- [x] Create telemetry dashboard for boost metrics (session boost rate, causal boost rate, pressure activation rate)
- [x] Add response metadata fields (`applied_boosts`, `pressure_level`, `extraction_count`, `redaction_count`)
- [x] Implement logging for extraction matches, pressure overrides, boost calculations, redaction events
- [x] Deploy with all feature flags OFF (dark launch)
- [x] Gradual rollout: Enable for 10% users -> 50% -> 100% over 1 week
- [x] Monitor rank correlation, token waste, context errors daily
- [x] Run user satisfaction survey (continuity, relevance, performance, trust)
- [x] Create runbook for rollback procedure (flip feature flags, verify baseline behavior)

### Memory Quality Phases (QP-0 through QP-4, derived from research.md findings)

> **Research baseline** (n=50 sample): 60% `[N/A]` leakage, 66% generic fallback, 34% empty `trigger_phrases`, 18% contamination. These phases run in parallel with the main Phase 0–3 roadmap where feasible (QP-0 and QP-1 can begin immediately; QP-4 legacy remediation runs after QP-2/QP-3 stabilize).

#### QP-0: Baseline & Test Harness (1-2 days)
- [x] Create deterministic quality benchmark suite: 10 known-bad examples (one per defect class: placeholder leakage, malformed `spec_folder`, empty semantic blocks, generic fallback, contamination phrase, migration artifact) and 10 known-good examples
- [x] Add regression fixtures to test suite: validator must reject all known-bad; pass all known-good
- [x] Capture baseline quality-band distribution from current corpus (run quality scorer on active 25 files)

#### QP-1: Quality Gate + Contamination Filter (2-3 days)
- [x] Implement `scripts/dist/memory/validate-memory-quality.js` — post-render hard gate checking: (a) any `[TBD]`/`[N/A]` in non-optional fields, (b) invalid `spec_folder` format (markdown or gate-prompt string), (c) generic fallback sentence present, (d) empty `trigger_phrases` when session had >= 5 tool executions
- [x] Wire validator into `generate-context.js` — on validation failure: skip MCP indexing, write to temporary tier (not permanent), log quality failures
- [x] Implement `scripts/extractors/contamination-filter.ts` — denylist of orchestration phrases; apply before summary and trigger candidate extraction
- [x] Gate: placeholder leakage <= 5% and malformed `spec_folder` = 0 in CI regression run

#### QP-2: Decision Extraction + Semantic Backfill (3-5 days)
- [x] Modify `scripts/extractors/decision-extractor.ts` — add lexical/rule-based cues from assistant and user turns (keywords: "decided", "chose", "will use", "approach is", "rejected", "going with"); suppress generic fallback sentence; emit `decision_count: 0` when no decisions found
- [x] Modify `templates/context_template.md` — replace hardcoded generic fallback sentence at line 516–518 with conditional Handlebars block (`{{#if decisions.length}}...{{else}}decision_count: 0{{/if}}`)
- [x] Implement semantic backfill for `trigger_phrases` / `key_topics` — fallback strategy: extract dominant nouns from changed file names + session topic string when extractor produces empty lists
- [x] Modify `scripts/extractors/collect-session-data.ts` — replace `[TBD]` / `[Not assessed]` defaults with conditional omission (omit field if data unavailable, rather than emitting placeholder)
- [x] Gate: files with concrete decision >= 60% (when session had design choices); empty `trigger_phrases` <= 10%

#### QP-3: Quality Score Persistence + KPI Dashboard (1-2 days)
- [x] Implement `scripts/extractors/quality-scorer.ts` — compute `quality_score` (0.0–1.0 heuristic) and `quality_flags` array; persist in YAML front-matter of generated memory files
- [x] Expose `quality_score` and `quality_flags` in MCP index (memory_save pipeline)
- [x] Enable retrieval filtering by `quality_score` threshold (configurable, default 0.3)
- [x] Gate: 100% of new memories include `quality_score` and `quality_flags`

#### QP-4: Legacy Remediation (2-4 days, deferred after QP-2/QP-3 stable)
- [x] Batch re-normalize stale path references (`003-memory-and-spec-kit` → `02--system-spec-kit`) in 104 affected files
- [x] Isolate fixture/test memories (`044-speckit-test-suite`, `030-gate3-enforcement`) from production ranking tiers
- [x] Re-index cleaned memories; run shadow retrieval comparison before and after
- [x] Gate: legacy-path references in active tier <= 10%

### Post-Research Wave 1: Governance Foundations (package `004-post-research-wave-1-governance-foundations/`)
- [ ] Implement typed contracts (`C136-08`) for `ContextEnvelope` and `RetrievalTrace` including required stage fields (`candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank`) and typed degraded-mode contract fields (`failure_mode`, `fallback_mode`, `confidence_impact`, `retry_recommendation`).
- [ ] Implement artifact-class routing policy (`C136-09`) with class-specific retrieval strategy for `spec`, `plan`, `tasks`, and `checklist`; verify deterministic branch selection in tests.
- [ ] Deliver adaptive hybrid fusion behind feature flag (`C136-10`) using dynamic weighting by intent + document type; prohibit fixed one-size weights; provide deterministic fallback parity report.
- [ ] Expand telemetry dimensions for latency/mode/fallback/quality-proxy signals (`C136-12`) to support reviewer interpretation and Wave 2 gate decisions.
- [ ] Finalize triad approvals: Tech Lead (`C136-01`), Data Reviewer (`C136-02`), Product Owner (`C136-03`).

### Post-Research Wave 2: Controlled Delivery (package `005-post-research-wave-2-controlled-delivery/`)
- [ ] Run dark-launch evidence pass for non-admin closure (`C136-04`) with deterministic-tool evidence for exact counts/status/dependency checks and degraded-mode contract behavior.
- [ ] Execute staged rollout evidence checkpoints (`10%`/`50%`/`100%`) with gate decisions, telemetry snapshots, and durable sync/async queue-worker behavior under load (`C136-05`).
- [ ] Implement append-only mutation ledger (`C136-11`) with required fields (`reason`, `prior_hash`, `new_hash`, `linked_memory_ids`, `decision_meta`) and append-integrity verification tests.

### Post-Research Wave 3: Outcome Confirmation (package `006-post-research-wave-3-outcome-confirmation/`)
- [ ] Run real-user survey and publish scored outcomes (`C136-06`) with capability truth matrix interpretation in the final report.
- [ ] Publish 14-day KPI closure evidence (`C136-07`) including runtime-generated capability truth matrix snapshots, baseline deltas, drift analysis, and final closure decision note.

Wave sequencing rule:
- Wave 1 completes first, Wave 2 depends on Wave 1 evidence readiness, and Wave 3 depends on Wave 2 delivery evidence and telemetry continuity.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Decay calculation, boost bounds, pressure thresholds, extraction rule matching | Vitest |
| Integration | RRF + boost pipeline, extraction -> working_memory, causal traversal | Vitest with test DB |
| Contract | RRF output format, working_memory schema, causal_edges schema | Vitest assertions |
| Shadow Evaluation | 1000 queries baseline vs boosted, rank correlation, MRR | Custom scripts |
| Pressure Simulation | 50 sessions with token usage 60-95%, context error rates | Custom scripts |
| Manual | End-to-end session flows (multi-turn, pause/resume, extraction verification) | Browser, CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| RRF Fusion Logic (`lib/search/hybrid-search.ts`) | Internal | Green | Boost integration requires stable RRF output format |
| Working Memory Table Schema (`lib/cache/cognitive/working-memory.ts`) | Internal | Green | Schema changes need migration scripts, backward compatibility |
| Causal Edges Table (`lib/storage/causal-edges.ts`) | Internal | Green | Causal boost relies on existing causal_edges, no Neo4j |
| Mode Routing (`handlers/memory-context.ts`) | Internal | Green | Pressure override requires stable mode selection interface |
| Tool Dispatch (`context-server.ts → dispatchTool()`) | Internal | Green | Phase 0 hook pipeline requires stable dispatch return contract |
| SQLite vec0 Extension | External | Green | Vector search unchanged, no new dependencies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rank correlation < 0.90, context error spike >2x baseline, user complaints >5% survey responses
- **Procedure**: 
  1. Flip feature flags to OFF (`SPECKIT_SESSION_BOOST=false`, `SPECKIT_PRESSURE_POLICY=false`, `SPECKIT_EXTRACTION=false`)
  2. Verify baseline behavior (no boosts applied, time-based decay active, manual saves required)
  3. Run smoke tests (memory_search returns expected results, no errors in logs)
  4. Notify stakeholders via communication plan (see L3+ Communication Plan section)
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Prerequisites) ────────────────────────┐
                                                 ├──► Phase 1 (Core) ──► Phase 1.5 (Hardening Gate) ──► Phase 2 (Extraction) ──► Phase 3 (Rollout)
                                                 │
(Hook pipeline + token-usage signal contract)────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0 Prerequisites | None | Phase 1 (pressure policy needs token-usage signal; extraction needs hook pipeline) |
| Phase 1 Core | Phase 0 | Phase 1.5 (hardening gate requires Phase 1 shadow eval baseline) |
| Phase 1.5 Hardening Gate | Phase 1 | Phase 2 (dataset expansion, redaction calibration, rank correlation gate) |
| Phase 2 Extraction | Phase 1.5 | Phase 3 Rollout |
| Phase 3 Rollout | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0 Prerequisites | Medium | 3-4 days (hook pipeline, token-usage contract, eval dataset 100 queries) |
| Phase 1 Core | High | 1-2 weeks (config, decay, boost, pressure, tests, shadow eval 100 queries) |
| Phase 1.5 Hardening Gate | Medium | 4-5 days (expand dataset to 1000, full shadow eval, redaction calibration) |
| Phase 2 Extraction | High | 2-4 weeks (redaction gate, extraction rules, hooks, provenance, causal boost, integration tests) |
| Phase 3 Rollout | Medium | 1 week (telemetry, gradual rollout over 1 week, monitoring, surveys) |
| **Total** | | **6-10 weeks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Feature flags configured and tested (toggle on/off verified)
- [x] Baseline metrics captured (token waste, context errors, MRR, rank correlation)
- [x] Telemetry dashboards live (boost rates, pressure activation, extraction counts)
- [x] Runbook reviewed by tech lead

### Rollback Procedure
1. **Immediate action**: Flip all feature flags to OFF via environment variables
2. **Verify rollback**: Run smoke tests (memory_search, memory_context, tool execution)
3. **Check metrics**: Confirm rank correlation returns to baseline, no boost metadata in responses
4. **Notify stakeholders**: Post to team channel, update status dashboard

### Data Reversal
- **Has data migrations?** Yes (working_memory table schema: `event_counter`, `mention_count` columns)
- **Reversal procedure**: 
  - Column additions are backward-compatible (nullable, default values)
  - If rollback permanent: Drop columns via migration script (not recommended, data loss)
  - If rollback temporary: Leave columns (no harm), re-enable features after fixes
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 0        │────►│   Phase 1        │────►│   Phase 2        │────►│   Phase 3        │
│   Prerequisites  │     │   Core Automation│     │   Extraction     │     │   Rollout        │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘     └──────────────────┘
         │                        │                        │
    ┌────▼──────────┐        ┌────▼────┐             ┌─────▼────────┐
    │ Hook Pipeline │        │ Config  │             │ Redaction    │
    │ + Token Signal│        │ + Decay │             │ Gate         │
    └───────────────┘        └────┬────┘             └─────┬────────┘
                                  │                        │
                             ┌────▼──────────┐       ┌─────▼────────┐
                             │ Session Boost │       │ Extraction   │
                             │ + Pressure    │       │ Adapter +    │
                             └───────────────┘       │ Provenance   │
                                                     └─────┬────────┘
                                                           │
                                                     ┌─────▼────────┐
                                                     │ Causal Boost │
                                                     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Hook Pipeline | None | `afterToolCallbacks` array in context-server | Extraction Adapter |
| Token-usage Signal | tool-schemas.ts `tokenUsage` param | Pressure policy input | Pressure Monitor |
| Config Module | None | Zod-validated settings + regex safety check | Decay, Boost, Pressure, Extraction |
| Event Decay | Config, working_memory schema | Updated attention scores | Session Boost |
| Session Boost | Event Decay, RRF output format | Attention multipliers | Phase 3 |
| Pressure Monitor | Config, token-usage signal | Mode overrides | Phase 3 |
| Redaction Gate | Config | `redact()` function | Extraction Adapter |
| Extraction Adapter | Hook Pipeline, Redaction Gate, Config, Provenance schema | Working memory inserts with provenance | Causal Boost |
| Causal Boost | `lib/storage/causal-edges.ts`, RRF output | Neighbor multipliers | Phase 3 |
| Rollout | Phase 1, Phase 2 | Production deployment | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Hook Pipeline + Token-usage Schema** - 2 days - CRITICAL (blocks all Phase 1 pressure work and all Phase 2 extraction work)
2. **Evaluation Dataset Bootstrap** - 1 day - CRITICAL (Phase 0 gate: 100 queries; Phase 1.5 hardening gate: expand to 1000; blocks shadow evaluation)
3. **Config + Schema Migration** - 2 days - CRITICAL (blocks all other Phase 1 work)
4. **Event Decay Implementation** - 3 days - CRITICAL (blocks session boost)
5. **Session Boost Integration** - 4 days - CRITICAL (core Phase 1 feature)
6. **Pressure Monitor Integration** - 3 days - CRITICAL (core Phase 1 feature)
7. **Shadow Evaluation** - 2 days - CRITICAL (validates Phase 1 before Phase 2)
8. **Redaction Gate** - 2 days - CRITICAL (blocks extraction adapter; safety prerequisite)
9. **Extraction Adapter** - 5 days - CRITICAL (core Phase 2 feature)
10. **Causal Boost Integration** - 4 days - CRITICAL (core Phase 2 feature)
11. **Integration Testing** - 3 days - CRITICAL (validates full pipeline)
12. **Gradual Rollout** - 5 days - CRITICAL (production deployment)

**Total Critical Path**: ~36 days (~5 weeks, optimistic)

**Parallel Opportunities**:
- Redaction Gate can begin as soon as Config module is done (before extraction adapter)
- Pressure Monitor and Session Boost can develop in parallel after Event Decay completes
- Extraction Adapter and Causal Boost can develop in parallel during Phase 2
- Unit tests can run concurrently with integration development
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Phase 0 Complete | Hook pipeline operational, token-usage param on memory_context (three-tier fallback documented), evaluation dataset Phase 0 gate (100 queries) in scratch/ | Week 1 |
| MQ0 | Quality QP-0 Complete | Benchmark suite created (10 bad + 10 good), regression fixtures committed, baseline quality-band distribution captured | Week 1 (parallel) |
| M1 | Phase 1 Complete | Event decay live, session boost working, pressure policy active, shadow eval shows >= 15% token reduction | Week 3 |
| MQ1 | Quality QP-1+QP-2 Complete | Post-render validator live, contamination filter active, decision extractor enhanced; placeholder leakage <= 5%, fallback sentence <= 20% (interim gate before 14-day window target) | Week 3 (parallel) |
| M1.5 | Phase 1.5 Hardening Gate | Eval dataset expanded to 1000 queries (full targeted review at ~10%), redaction calibration complete (50 Bash outputs, FP <= 15%), rank correlation >= 0.90 on 1000-query set | Week 4 |
| MQ2 | Quality QP-3 Complete | Quality score persisted in all new memories; retrieval filtering by score threshold active; KPI dashboard showing daily rates | Week 4 (parallel) |
| M2 | Phase 2 Complete | Redaction gate live, extraction rules live with provenance, causal boost working, manual saves <= 40% baseline | Week 8 |
| MQ3 | Quality SC-006–SC-013 Gate | Placeholder leakage <= 2%, fallback prevalence <= 10%, contamination <= 1%, empty `trigger_phrases` <= 5% — verified over 14-day rolling window | Week 9 |
| M3 | Rollout Complete | 100% user coverage, telemetry dashboards live, user satisfaction >= 4.0/5.0 | Week 9 |
| MQ4 | Quality QP-4 Complete | Legacy path references in active tier <= 10%, re-index complete, shadow retrieval comparison documented | Week 11 |
<!-- /ANCHOR:milestones -->

---

---

> **ADR-005 (PII/Secret Redaction Gate) and ADR-006 (Regex Safety Constraints)**: See `decision-record.md` for full ADR text, Five Checks evaluations, alternatives analysis, and implementation patterns. These ADRs are maintained exclusively in `decision-record.md` to prevent drift from duplicate copies.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: TypeScript-Only Implementation (No Python/Docker)

**Status**: Accepted

**Context**: Reference systems use Python (graphrag-hybrid with Neo4j, Qdrant, PyTorch) and TypeScript (opencode-working-memory with JSON files). Target system (Spec Kit Memory MCP) is TypeScript-based with SQLite storage. Adding Python would introduce cross-language maintenance burden, deployment complexity (Docker, 4GB RAM, ~15s cold start), and operational overhead (2 DBs to sync).

**Decision**: Port algorithmic patterns to TypeScript, reuse existing infrastructure (SQLite, vec0 extension, causal_edges table), avoid external services.

**Consequences**:
- **Positive**: Single runtime (Node.js), embedded storage (SQLite), no Docker, ~3/10 ops complexity vs 8/10 for graphrag-hybrid
- **Negative**: Cannot use Neo4j graph traversal optimizations (acceptable: 2-hop SQLite CTE sufficient for scale <10K docs)

**Alternatives Rejected**:
- **Python microservice**: Rejected due to deployment complexity, cross-language debugging, service sync requirements
- **Neo4j + Qdrant**: Rejected due to ops burden (Docker, 2 DBs, 4GB RAM), unnecessary for current scale

---

### ADR-002: Bounded Boost Limits (Max 0.20)

**Status**: Accepted

**Context**: Attention boosting can destabilize rankings if recent irrelevant items score higher than old highly-relevant docs. Analysis shows risk of over-boosting (R-001: High impact, Medium likelihood).

**Decision**: Hard cap all boosts (session attention + causal neighbors) at 0.20 multiplier applied post-RRF fusion. Enforced at code level: `finalScore = result.score * (1 + min(sessionBoost + causalBoost, 0.20))` where `result.score` is `FusionResult.score` from `rrf-fusion.ts`, accessed as `.score` in the handler (not as `rrfScore`).

**Consequences**:
- **Positive**: Prevents runaway scores, maintains rank stability (target >= 0.90 correlation), predictable behavior
- **Negative**: Limits maximum boost effectiveness (mitigated by tuning base boost values 0.15 session, 0.05/hop causal)

**Alternatives Rejected**:
- **Unbounded boost**: Rejected due to score instability risk, unpredictable ranking changes
- **Configurable cap**: Rejected for initial release (adds complexity), can add in a Phase 3+ follow-up spec if needed

---

### ADR-003: Event-Based Decay (Not Time-Based)

**Status**: Accepted

**Context**: Current time-based decay (`score * pow(0.95, minutesElapsed)`) breaks across pause/resume cycles. If user pauses for 24 hours, all working memory decays to near-zero even if still relevant. Interaction distance is better proxy for relevance than wall-clock time.

**Decision**: Replace with event-counter decay: `score * pow(0.85, eventsElapsed) + mentions * 0.05` where `eventsElapsed = currentEventCounter - item.lastEventCounter`. Floor at 0.05 prevents oscillation, delete threshold at 0.01 (separate from floor).

**Consequences**:
- **Positive**: Session continuity across pauses, relevance tied to interaction distance, mention boost rewards re-access
- **Negative**: Event counter requires tracking (`event_counter` column), modulo arithmetic for rollover prevention (acceptable: u32 max = 4B events)

**Alternatives Rejected**:
- **Hybrid decay (time + events)**: Rejected due to complexity, unclear weighting between factors
- **Fixed TTL**: Rejected due to same pause/resume issues as time-based decay

---

### ADR-004: Schema-Driven Extraction Rules (Not Hardcoded Logic)

**Status**: Accepted

**Context**: Tool outputs vary widely (Read returns file contents, Grep returns match lists, Bash returns stdout). Hardcoded if/else chains become unmaintainable as tool count grows. Need declarative approach for easy tuning without changing core logic.

**Decision**: Define extraction rules as schema objects: `{ toolPattern: /^Read/, contentPattern: /spec\.md$/, attention: 0.9, summarizer: 'firstLast500' }`. Rules matched in priority order, first match wins. Allows JSON config in future without code changes.

**Consequences**:
- **Positive**: Declarative rules, easy to add/tune, no core logic changes, future-proof for user config
- **Negative**: Schema validation overhead (mitigated by Zod), debugging less obvious than if/else (mitigated by logging)

**Alternatives Rejected**:
- **Hardcoded tool names**: Rejected due to brittleness, hard to extend
- **LLM-based extraction**: Rejected due to latency (>100ms vs <5ms for rules), non-determinism, token cost

---


---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist

Before starting ANY task in this spec:

- [x] Read spec.md sections 1-11 (metadata through acceptance scenarios)
- [x] Review decision-record.md ADR-001 through ADR-004 (key architectural constraints)
- [x] Verify feature flag environment variables documented (Phase 1: SPECKIT_SESSION_BOOST, SPECKIT_PRESSURE_POLICY, SPECKIT_EVENT_DECAY)
- [x] Confirm existing infrastructure available (RRF fusion, working_memory table, causal_edges table)
- [x] Load cognitive config schema from plan.md section 3 (Architecture - Key Components)
- [x] Verify TypeScript-only rule (no Python/Docker/Neo4j dependencies)
- [x] Check bounded boost limits (max 0.20 total for session + causal)
- [x] Review shadow evaluation baseline (1000 queries, rank correlation target >= 0.90)

### Execution Rules

| Rule | Description | Trigger | Action |
|------|-------------|---------|--------|
| ER-001 | Bounded boost enforcement | Any boost calculation (session, causal) | Verify total boost <= 0.20, apply cap before multiplying RRF score |
| ER-002 | Config validation | Server startup, config changes | Run Zod schema validation, fail-fast on malformed values |
| ER-003 | Feature flag check | Before any cognitive feature activation | Check environment variable, default OFF, log activation state |
| ER-004 | Schema migration | Before event decay implementation | Apply migration script for event_counter and mention_count columns |
| ER-005 | Contract test enforcement | Before modifying RRF integration points | Run contract tests to verify output format unchanged |
| ER-006 | Shadow evaluation gate | After Phase 1 completion | Run 1000-query shadow eval, block Phase 2 if rank correlation < 0.90 |
| ER-007 | Pressure threshold verification | Before deploying pressure policy | Test at 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95% token usage levels |
| ER-008 | Extraction precision target | After Phase 2 extraction implementation | Measure on 50-session test set, require >= 85% precision to proceed |

### Blocked Task Protocol

If a task is blocked:

1. **Identify blocker type**:
   - Dependency (Phase 1 incomplete, schema not migrated, RRF format changed)
   - Technical (SQLite query optimization needed, TypeScript type errors)
   - Validation (shadow eval failed, rank correlation < 0.90, extraction precision < 85%)

2. **Immediate actions**:
   - Log blocker in tasks.md with [BLOCKED] tag
   - Update plan.md dependency matrix with blocker details
   - Notify via communication plan escalation path (see L3+ Communication Plan)

3. **Unblocking criteria**:
   - Dependency: Upstream task completes and passes verification
   - Technical: Solution implemented and unit tests pass
   - Validation: Metrics meet targets OR target adjusted with approval (document in decision-record.md)

4. **Escalation threshold**: If blocked >2 days, escalate to Tech Lead for decision (defer to a Phase 3+ follow-up spec, adjust scope, or allocate additional resources)

### Tier 1: Sequential Foundation (Planning)
**Files**: spec.md (sections 1-9), plan.md (sections 1-3), tasks.md (phase structure)
**Duration**: ~90s
**Agent**: Primary (@speckit)
**Output**: Core documentation structure with problem/scope/requirements

### Tier 2: Parallel Execution (Detailed Design)
| Agent | Focus | Files | Duration |
|-------|-------|-------|----------|
| Plan Agent | Technical implementation details | plan.md (sections 4-7), decision-record.md | ~120s |
| Checklist Agent | Verification items (P0/P1/P2) | checklist.md (all sections) | ~90s |
| Requirements Agent | Detailed requirements, edge cases | spec.md (sections 10-17) | ~100s |

**Coordination**: Shared context (spec summary, success criteria), no file conflicts

### Tier 3: Integration (Review & Sync)
**Agent**: Primary (@speckit)
**Task**: Cross-reference validation (spec <-> plan <-> tasks), consistency checks, decision alignment
**Duration**: ~60s
**Output**: Fully synchronized Level 3+ documentation set
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-001 | Phase 1 Core | Primary | `configs/cognitive.ts`, `working-memory.ts`, `session-boost.ts`, `pressure-monitor.ts`, `memory-search.ts` (boost integration), `memory-context.ts` (pressure integration) | Active |
| W-002 | Phase 2 Extraction | Primary | `extraction-adapter.ts`, `causal-boost.ts`, hook registration | Blocked on W-001 |
| W-003 | Testing & Validation | Primary | Unit tests, integration tests, shadow evaluation scripts | Parallel with W-001, W-002 |
| W-004 | Rollout & Monitoring | Primary | Telemetry, feature flags, gradual rollout, runbooks | Blocked on W-001, W-002 |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Phase 1 complete (M1) | Primary | Shadow evaluation results, go/no-go for Phase 2 |
| SYNC-002 | Phase 2 complete (M2) | Primary | Integration tests pass, extraction precision >= 85% |
| SYNC-003 | 50% rollout | Primary + Tech Lead | Metrics review, rank correlation check, user feedback |
| SYNC-004 | 100% rollout (M3) | All stakeholders | User satisfaction survey, final metrics, post-launch review |

### File Ownership Rules
- Each file owned by ONE workstream (no conflicts by design, sequential phases)
- Shared files (memory-search.ts, memory-context.ts) modified only during assigned phase
- Integration points (RRF output, working_memory schema) frozen during Phase 1 to prevent breaking changes
- Contract tests enforce interface stability across phases
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: Update tasks.md with progress (phases completed, blockers encountered)
- **Per Phase**: Sync point meeting (SYNC-001, SYNC-002, SYNC-003, SYNC-004) with metrics review
- **Per Milestone**: Milestone report (M1, M2, M3) summarizing success criteria met/missed
- **Blockers**: Immediate escalation via communication plan (see below)

### Escalation Path
1. **Technical blockers** (RRF format changes, schema incompatibilities) -> Tech Lead (same-day response)
2. **Scope changes** (user requests Phase 3 features during rollout) -> Product Owner (defer to separate spec)
3. **Performance issues** (latency >20ms p95, rank correlation <0.90) -> Tech Lead + Data Reviewer (rollback consideration)
4. **User complaints** (>5% negative survey responses) -> Product Owner + Tech Lead (investigate root cause)

### Status Reporting
- **Green**: On track (milestones met, metrics within targets, no blockers)
- **Yellow**: Minor issues (1-2 day delay, metrics close to targets, workarounds available)
- **Red**: Major issues (>3 day delay, metrics miss targets, no clear path forward)
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN
- Core + L2 + L3 + L3+ addendums
- Three-phase implementation (Core, Extraction, Rollout)
- ADRs for key decisions (TypeScript-only, bounded boosts, event decay, schema rules)
- AI execution framework, workstream coordination, communication plan
- Derived from `research/136 - recommendations-working-memory-hybrid-rag-adoption.md` balanced path (Phase 1+2)
-->
