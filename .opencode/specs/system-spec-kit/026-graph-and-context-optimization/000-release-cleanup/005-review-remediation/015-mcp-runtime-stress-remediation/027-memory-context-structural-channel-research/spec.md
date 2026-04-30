---
title: "Research Charter: memory_context Structural Channel Routing"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "5-iteration deep research on extending memory_context's intent-aware routing to include code_graph_query as a structural retrieval channel. Three sub-questions: intent signal reliability, merged response shape, and SearchDecisionEnvelope coverage of routing trace."
trigger_phrases:
  - "027-memory-context-structural-channel-research"
  - "memory_context structural routing"
  - "code_graph_query channel fusion"
  - "structural-semantic retrieval fusion"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research"
    last_updated_at: "2026-04-29T09:33:36Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed 5-iter deep research on memory_context structural channel routing"
    next_safe_action: "Use research/research-report.md Planning Packet to seed implementation phase"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: memory_context Structural Channel Routing

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `015-mcp-runtime-stress-remediation` |
| **Mode** | Deep research (`/spec_kit:deep-research:auto` pattern) |
| **Iterations** | 5 (max); convergence allowed earlier |
| **Executor** | cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=default (normal) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Today the system has two parallel retrieval surfaces with no routing layer between them:

- **`memory_search`** retrieves indexed documents (specs, decisions, constitutional rules) via vector similarity. Augments ranking with graph topology BOOSTS but never invokes `handleCodeGraphQuery`.
- **`code_graph_query`** answers structural questions (callers, imports, outline) over the code graph. Standalone MCP tool.
- **`memory_context`** is the "intent-aware routing" entry point above `memory_search` (`tool-schemas.ts:48`), with intent detection and channel selection — but currently routes only to `memory_search` flavors.

The advisor at `context-server.ts:335-341` already detects "this looks like a structural question" and nudges users toward `code_graph_query`. So the intent signal exists. The natural next step is to route structural intents from `memory_context` into `code_graph_query` automatically and merge results — giving callers a single context-retrieval surface that doesn't require them to pre-select the right tool.

This is a fusion feature, not a wiring fix. It risks blurring the contracts of the two underlying tools, conflating heterogeneous result shapes, and complicating caching. It needs research before implementation.

### Purpose

Run 5 focused deep-research iterations answering three sub-questions, then synthesize a Planning Packet for an implementation phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (research questions)

- **RQ1 — Intent reliability**: What signals reliably distinguish structural queries (callers, imports, outline) from semantic queries (concepts, summaries, decisions)? Inventory existing intent-detection rules in the advisor (`context-server.ts:335`) and `memory_context` (`tool-schemas.ts:48`). Quantify false-positive / false-negative risk against the v1.0.3 corpus + Phase E gold battery.
- **RQ2 — Merged response shape**: What's the right schema for a fused response? Three options:
  - **Flatten**: structural results coerced into pseudo-documents in the candidate list (lossy, simple consumer story).
  - **Discriminated union**: each result tagged with `kind: 'document' | 'structural'` (rich, downstream complexity).
  - **Split-payload**: response has separate `documents` and `structural` sections under one envelope (cleanest contract, new shape).
  Evaluate against existing consumers (advisor, `memory_search` callers, MCP clients) and against the v1.0.3 corpus.
- **RQ3 — SearchDecisionEnvelope coverage**: Does the existing envelope already cover the routing trace via `selectedChannels` / `skippedChannels` / `routingReasons`? What new fields are needed, if any? Map each fusion path to envelope fields.

### Out of Scope (research only — no implementation)

- Implementing the routing change itself.
- Modifying `memory_context`, `memory_search`, `code_graph_query`, or any tool schema.
- Re-running stress tests.

### Files to Read (representative; iterations may add more)

- `mcp_server/tool-schemas.ts:48-55` (memory_context + memory_search descriptions)
- `mcp_server/context-server.ts:226-340` (advisor structural-intent detection)
- `mcp_server/handlers/memory-context.ts` (memory_context handler — find it)
- `mcp_server/handlers/memory-search.ts:1100-1200` (envelope build site)
- `mcp_server/code_graph/handlers/query.ts` (code_graph_query response shape)
- `mcp_server/lib/search/search-decision-envelope.ts` (envelope contract)
- `mcp_server/lib/query/query-plan.ts` (intent + channels contract)
- v1.0.3 corpus and findings: `specs/.../011/021-stress-test-v1-0-3-with-w3-w13-wiring/`
- Phase J research output: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/research-report.md`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 iterations produce externalized state. | Numbered iteration files under `research/iterations/` and matching JSONL deltas under `research/deltas/`. |
| REQ-002 | RQ1 answered with evidence rating. | Intent-signal inventory; false-positive / false-negative analysis on representative queries. |
| REQ-003 | RQ2 answered with shape recommendation. | One of {flatten, union, split-payload} chosen with rationale; consumer-impact analysis. |
| REQ-004 | RQ3 answered. | Envelope-coverage map; new fields enumerated if any. |
| REQ-005 | Convergence detected honestly; loop stops at convergence or max=5. | Final iter file records stop reason + newInfoRatio sequence. |
| REQ-006 | Final research-report.md authored with 9-section structure + Planning Packet. | Standard 9-section deep-research report; Planning Packet seeds an L2 implementation phase. |
| REQ-007 | Strict validator green on this packet. | `validate.sh <packet> --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 5 iter files + 5 delta files written.
- **SC-002**: Convergence event recorded with newInfoRatio sequence.
- **SC-003**: Research report enumerates RQ1-RQ3 answers with file:line citations.
- **SC-004**: Planning Packet enables a follow-on implementation phase to act without re-investigating sources.
- **SC-005**: Strict validator green.

### Acceptance Scenarios

- **Given** the research loop starts from the approved 027 packet, **When** iteration 1 completes, **Then** `research/iterations/iteration-001.md`, `research/deltas/iteration-001.jsonl`, and an iteration state event exist with cited intent-rule evidence.
- **Given** the v1.0.3 corpus and Phase E gold battery are read-only sources, **When** iteration 2 completes, **Then** false-positive and false-negative findings are recorded with file:line citations and scope caveats.
- **Given** response-shape risk is the core RQ2 concern, **When** iteration 3 completes, **Then** flatten, discriminated-union, and split-payload options are evaluated against formatter and consumer evidence.
- **Given** SearchDecisionEnvelope already carries routing fields, **When** iteration 4 completes, **Then** selected/skipped channels and routing reasons are mapped to structural fusion paths.
- **Given** the loop reaches iteration 5 without two consecutive new-info ratios below 0.10, **When** synthesis completes, **Then** `research/research-report.md` contains the 9-section report and a Planning Packet for the implementation phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | xhigh reasoning + 5 iters can drift into speculation if grounding is weak | Per-iter file:line citations are MANDATORY; speculation findings get severity ≤ P2 |
| Risk | RQ2 picks a shape that breaks an existing consumer not yet inventoried | RQ2 must include a consumer audit; recommendations carry compatibility impact |
| Dependency | Phase J research (022) for context | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research execution must not run runtime stress tests, the harness, or mutate any production code path.

### Security
- **NFR-S01**: No secrets, credentials, or external service tokens are required.

### Reliability
- **NFR-R01**: Every concrete finding must cite file:line evidence or be labeled as speculation.
- **NFR-R02**: Convergence tracking must record the full newInfoRatio sequence and stop reason.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Intent signals tested only against the v1.0.3 corpus + Phase E gold battery; broader generalization claims must be flagged as directional.
- Consumer audit covers MCP-tool callers visible in this repo; external consumers are out of scope (flag if found).

### Error Scenarios
- Validator failure: repair packet-local docs only; no runtime code modifications.
- A consumer not yet inventoried: surface as a P1 finding rather than guess.

### State Transitions
- Planned to complete: state log gets 5 iteration events plus `synthesis_complete`.
- Research to remediation: final Planning Packet seeds an L2 implementation phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Research spans memory_context routing, memory_search, code_graph_query, advisor intent detection, envelope schema. |
| Risk | 8/25 | Research-only; no runtime/harness modifications. |
| Research | 18/20 | 5 focused iterations with source citations and synthesis. |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Q1: Should structural channel routing live in `memory_context` (orchestrator) or be a NEW orchestrator tool above both? **Default**: extend `memory_context` since it already declares intent-aware routing as its purpose.
- Q2: Does the advisor's structural-intent detection need to be promoted from advisory to actionable routing? **Default**: yes — extract its rule into a shared classifier consumed by both the advisor (advisory) and `memory_context` (actionable).
- Q3: How should fused responses cache? Per-channel cache with a fusion overlay, or unified cache key? **Default**: research RQ outcome; likely per-channel with a cheap fusion-merge step.
<!-- /ANCHOR:questions -->
