<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
# Feature Specification: Query-Routing Integration [024/020]

<!-- PHASE_LINKS: parent=../spec.md predecessor=019-code-graph-auto-trigger successor=021-cross-runtime-instruction-parity -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
### 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-31 |
| **Branch** | `020-query-routing-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
### 2. PROBLEM & PURPOSE
### Problem Statement

This packet drifted away from the shipped implementation. The stale docs described `memory_context` as selective backend routing, documented the wrong response metadata shape, claimed `session_resume` merged `ccc_status()`, and marked passive enrichment as deferred even though it is wired in.

### Purpose

Describe the current implementation precisely so users and future maintainers understand query-intent enrichment, `session_resume`, and passive enrichment as they actually work today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
### 3. SCOPE
### In Scope
- Document `memory_context` as additive enrichment over the existing traced semantic flow.
- Document the actual `queryIntentRouting` response metadata contract.
- Document `session_resume` as resume context + graph summary + CocoIndex availability, with the real schema and output shape.
- Document Part 3 passive enrichment as implemented in `context-server.ts` and `lib/enrichment/passive-enrichment.ts`.
- Remove references to the deleted `code-graph-enricher.ts` file.

### Out of Scope
- Changing handler behavior or tool schemas in code.
- Reintroducing selective backend dispatch from `memory_context` into `code_graph_context`.
- Expanding `session_resume` to return full `ccc_status()` or other status payloads not currently exposed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `handlers/memory-context.ts` | Modify | Query intent classification remains inside `memory_context`; optional graph context is appended to traced results. |
| `handlers/session-resume.ts` | Create | Composite resume tool returning memory context, code graph summary, and CocoIndex availability. |
| `context-server.ts` | Modify | Passive enrichment hook calls `runPassiveEnrichment(result.content[0].text)`. |
| `lib/enrichment/passive-enrichment.ts` | Create/Modify | Inline path extraction and code graph symbol enrichment logic. |
| `tool-schemas.ts` | Modify | Registers `session_resume` and the response metadata contract. |
| `schemas/tool-input-schemas.ts` | Modify | Limits `session_resume` inputs to `specFolder?` and `minimal?`. |
| `tools/lifecycle-tools.ts` | Modify | Wires `session_resume` into tool dispatch. |
| `tools/types.ts` | Modify | Adds `session_resume` type definitions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
### 4. REQUIREMENTS
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `memory_context` must be described as additive query-intent enrichment, not exclusive backend routing. | **Given** a structural or hybrid query, **when** `memory_context` handles it, **then** the docs state that normal semantic strategy execution still runs and optional `graphContext` is appended when available rather than replacing the main path. |
| REQ-002 | The response metadata contract must be documented as `queryIntentRouting`. | **Given** a documented `memory_context` response, **when** the metadata object is described, **then** it is named `queryIntentRouting` and lists `queryIntent`, `routedBackend`, `confidence`, and optional `matchedKeywords`, with no `fallbackApplied` field. |
| REQ-003 | `session_resume` must match the current schema and output behavior. | **Given** `session_resume`, **when** its behavior is documented, **then** the docs say it accepts only `specFolder?` and `minimal?`, calls `memory_context({ mode: "resume", profile: "resume" })` unless `minimal` is true, returns `codeGraph { status, lastScan, nodeCount, edgeCount, fileCount }`, and returns `cocoIndex { available, binaryPath }` without calling `ccc_status()`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Part 3 must be documented as implemented. | **Given** the passive enrichment phase, **when** the packet describes status, **then** it states that `context-server.ts` imports `./lib/enrichment/passive-enrichment.js` and calls `runPassiveEnrichment(...)` instead of marking the work deferred. |
| REQ-005 | The file inventory must reflect the current implementation. | **Given** the enrichment implementation description, **when** code files are listed, **then** the docs reference `lib/enrichment/passive-enrichment.ts` for code graph symbol enrichment and do not mention `code-graph-enricher.ts`. |
| REQ-006 | All packet files must use the same corrected terminology. | **Given** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`, **when** they describe this phase, **then** they consistently avoid claims about selective routing, hybrid dual-backend merging, `fallbackApplied`, `ccc_status()` merging, and deferred Part 3 work. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
### 5. SUCCESS CRITERIA
- **SC-001**: The packet consistently describes `memory_context` as semantic-first execution with optional graph enrichment for structural or hybrid queries.
- **SC-002**: Every file that mentions response metadata names `queryIntentRouting` and lists the correct fields only.
- **SC-003**: Every file that mentions `session_resume` describes the slim graph and CocoIndex summaries and omits `ccc_status()` claims.
- **SC-004**: Passive enrichment is documented as shipped and the deleted `code-graph-enricher.ts` file is no longer referenced anywhere in the packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Verified code audit from `handlers/memory-context.ts`, `handlers/session-resume.ts`, `context-server.ts`, and `lib/enrichment/passive-enrichment.ts` | Medium | Keep packet language tied to the verified implementation facts and line references already confirmed. |
| Risk | Future handler changes may reintroduce doc drift | Medium | Describe contracts precisely and keep this packet aligned with code on each implementation change. |
| Risk | Overstating `routedBackend` semantics as hard dispatch | High | Explicitly describe it as metadata on an additive enrichment flow, not as a guarantee that the request left `memory_context`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation must not imply extra backend calls that the implementation does not make.
- **NFR-P02**: Packet language must stay concise enough to serve as an accurate runtime reference during resume and debugging.

### Security
- **NFR-S01**: No spec file may claim access to tool outputs or status payloads that are not actually returned.
- **NFR-S02**: The packet must not invent hidden fallback behavior or unavailable diagnostic fields.

### Reliability
- **NFR-R01**: Terminology must remain internally consistent across all phase documents.
- **NFR-R02**: Status sections must distinguish shipped behavior from deferred follow-up work accurately.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or low-signal query: `queryIntentRouting.matchedKeywords` may be absent even when `confidence` is present.
- Minimal resume request: `session_resume` can skip full resume context when `minimal` is true.
- No graph context built: `memory_context` still returns the traced semantic result without routing away from its normal path.

### Error Scenarios
- Code graph unavailable: docs must describe optional enrichment rather than guaranteed structural answers.
- CocoIndex unavailable: `session_resume` exposes `cocoIndex.available = false` with a fixed `binaryPath`, not a full status dump.
- Passive enrichment failure: the packet should describe it as best-effort enrichment on response text, not a blocking requirement for tool success.

### State Transitions
- Structural query with graph support available: traced semantic result gains appended `graphContext` and `queryIntentRouting`.
- Hybrid query with partial graph support: semantic execution still completes; graph enrichment is additive when available.
- Resume after idle session: `session_resume` combines resume context with lightweight graph and CocoIndex summaries.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Cross-tool contract alignment across `memory_context`, `session_resume`, and passive enrichment. |
| Risk | 18/25 | Incorrect wording can mislead users about routing, fallback, and available status payloads. |
| Research | 13/20 | Requires verified implementation facts from multiple handlers and schema registrations. |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
### 10. OPEN QUESTIONS
- None at this time. The current goal is documentation alignment with verified runtime behavior, not additional feature scope.
<!-- /ANCHOR:questions -->

---