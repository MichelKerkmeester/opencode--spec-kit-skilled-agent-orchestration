---
title: "Feature Specification: Code Graph Upgrades [template:level_3/spec.md]"
description: "Plan the bounded post-R5/R6 code-graph upgrade packet that adds detector provenance, graph payload richness, and code-graph-local query ergonomics without overlapping packet 008."
trigger_phrases:
  - "005-code-graph-upgrades"
  - "code graph upgrades"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Code Graph Upgrades

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Ship the bounded code-graph upgrade lane that improves detector fidelity, graph payload richness, and code-graph-local query ergonomics while explicitly depending on existing trust and routing packets instead of competing with them. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:930-932]

**Key Decisions**: Depend on `007` for regression-floor discipline, depend on `011` for trust-axis payload validation, and reject or defer any startup-surface routing nudge that overlaps `008`. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:949-959] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1008-1011]

**Critical Dependencies**: `007` (detector regression floor) and `011` (graph payload validator and trust preservation) are hard predecessors; `014` sits as a post-R5/R6 side branch and not as a new prerequisite in the existing R1-R10 chain. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1008-1011]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-04-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `013-warm-start-bundle-conditional-validation` |
| **Successor** | Optional future graph-local rollout only; no new R-chain prerequisite |
| **Research Citation** | `002-codesight/research/research.md:924-1033` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current 026 graph work hardens trust (`011`) and advisory routing (`008`), but it does not add new detector provenance states, blast-radius correctness fixes, evidence-tagged edges, cluster metadata, export contracts, or graph-specific fallback behavior. The cross-phase research now shows several additive upgrades that fit Public's existing Code Graph MCP substrate without creating a second graph authority. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:926-928]

### Purpose
Ship the bounded code-graph upgrade lane that improves detector fidelity, graph payload richness, and code-graph-local query ergonomics while explicitly depending on existing trust and routing packets instead of competing with them. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:930-932]
<!-- /ANCHOR:problem -->

> **Runtime authorization:** As of 2026-04-09, runtime implementation of the adopt-now lane is explicitly authorized by the operator. Implementation remains bounded to code-graph-local detector, payload, and query surfaces inside `mcp_server/`. This packet still does NOT touch any `external/` tree and keeps packet `008` authoritative for startup, resume, compact, and response-surface nudges. Clustering, export, and routing-facade work remains prototype-later per ADR-003 and does not land in this run.

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Detector provenance taxonomy and AST or structured-fallback discipline.
- Blast-radius correctness, multi-file union mode, and honest degree-based hot-file breadcrumbs.
- Evidence-tagged edges, numeric confidence backfill, and additive graph metadata on current graph-owned payloads.
- Optional query fallback tiering for graph-local lexical helpers.
- Additive cluster and export contracts only if they stay on the current graph substrate.

### Out of Scope
- Startup/resume or response-surface routing nudges already owned by `008`.
- Fail-closed trust validation already owned by `011`.
- Resume/bootstrap carriage of graph-edge enrichment beyond the graph-local owner surfaces.
- Graph subsystem replacement, new graph-only authority surfaces, or remote multimodal ingestion.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modify | Add detector provenance guards plus additive graph-edge enrichment and hot-file breadcrumb owner fields. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` | Modify | Persist detector-provenance summaries and expose file-degree plus graph-edge summary helpers for code-graph-local consumers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | Modify | Ship blast-radius traversal, explicit multi-file union semantics, advisory hot-file breadcrumbs, and additive edge enrichment on the query owner surface. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` | Modify | Surface detector provenance metadata on code-graph context responses. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts` | Modify | Serialize detector provenance and graph-edge enrichment summaries at scan time. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts` | Modify | Verify the detector provenance taxonomy stays separate from packet 006's trust-axis vocabulary. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modify | Verify detector provenance metadata on code-graph context responses. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts` | Modify | Verify detector provenance summaries persist through the scan handler. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts` | Modify | Verify blast-radius depth caps, explicit union mode, advisory breadcrumbs, and additive edge enrichment. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts` | Read-only verification | Confirm packet `011` trust surfaces remain unchanged while 014 stays graph-local. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts` | Modify | Verify numeric confidence validation on additive graph payload fields without claiming resume/bootstrap carriage. |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts` | Create | Add the packet-014 frozen regression floor for detector provenance and blast-radius depth behavior. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md` | Modify | Replace the planning placeholder with the shipped runtime closeout and verification record. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Graph detector outputs distinguish `ast`, `structured`, `regex`, or `heuristic` provenance and never mislabel non-AST results as AST. | Detector fixtures prove non-AST paths cannot emit `ast` provenance and that explicit fallback states survive serialization. |
| REQ-002 | Blast-radius traversal enforces depth before result inclusion and supports explicit multi-file union behavior. | A frozen blast-radius corpus proves that nodes beyond `maxDepth` never surface. |
| REQ-003 | Graph payloads surface edge evidence class and numeric confidence additively on current graph-owned contracts after `011`. | Graph payload snapshots prove edge evidence classes and numeric confidence are additive on graph-owned outputs, not parallel graph-only payload families. |
| REQ-004 | Every new detector or graph surface lands with frozen regression fixtures under the `007` discipline. | Regression fixtures fail on detector-provenance regressions and blast-radius depth regressions. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Honest degree-based hot-file breadcrumbs surface as low-authority "change carefully" hints. | Query outputs expose honest breadcrumb wording rather than authority claims. |
| REQ-006 | Graph-local lexical fallback surfaces explicit backend metadata and forced-degrade tests if a cascade tier is added. | If a fallback cascade is implemented, tests cover compile-probe miss, missing table or index, and runtime ranking failure while preserving explicit backend metadata. |
| REQ-007 | Any clustering or export contract stays additive to the current graph substrate and does not create a second owner surface. | Any optional clustering/export lane is feature-gated and omitted entirely when trust or payload prerequisites are missing. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Cluster labels, GraphML/Cypher export, or rationale-node support only ship if the P0/P1 lanes are already stable. | Optional structure upgrades remain prototype-later and do not block the packet's adopt-now lane. |
| REQ-009 | Packet docs stay explicit about side-branch status and non-overlap with packet `008`. | Spec, plan, tasks, and decision records preserve the post-R5/R6 side-branch placement and keep `008` authoritative for routing nudges. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code_graph_query` can return bounded blast-radius results with correct depth handling and explicit multi-file semantics. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:961-964]
- **SC-002**: Detector and query payloads expose provenance classes that are honest enough for downstream ranking and UI labeling. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:963-965]
- **SC-003**: Existing owner payloads remain authoritative; no new graph-only router or validator family appears. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:964-966]
- **SC-004**: Tests clearly separate detector-regression floors from higher-level query-quality evaluation. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:965-966]
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

**Given** a detector falls back from AST parsing, **when** graph metadata is serialized, **then** the payload records an honest fallback provenance class instead of mislabeling the result as AST. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:949-953]

**Given** a blast-radius query includes a `maxDepth`, **when** the traversal reaches nodes beyond that bound, **then** those nodes do not surface in the result set and multi-file union behavior remains explicit. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:950-951] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:990-991]

**Given** graph payloads add edge evidence classes or numeric confidence, **when** downstream consumers inspect the graph-local payloads, **then** the new fields appear additively on graph-owned outputs after `011` and never create a parallel graph-only family. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:952-953] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:992-994]

**Given** someone proposes startup, resume, or response-surface nudges during implementation, **when** the packet boundary is checked, **then** that work is rejected or deferred to packet `008`. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:943-945] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1001-1002]

**Given** optional clustering or export work is staged, **when** trust or payload prerequisites are missing, **then** those features remain gated and omitted from the shipped path. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:957-959] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:994-994]

**Given** packet `007` is not yet ready to enforce detector regression floors, **when** implementation planning resumes, **then** provenance taxonomy and blast-radius changes remain blocked rather than shipping without the frozen fixture discipline. [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:953-953] [SOURCE: ../001-research-graph-context-systems/002-codesight/research/research.md:1008-1008]

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `007-detector-regression-floor` must exist before provenance or blast-radius changes ship | High | Keep every detector and traversal change behind frozen regression fixtures owned by the `007` discipline. |
| Dependency | `011-graph-payload-validator-and-trust-preservation` must land before additive edge evidence and numeric confidence changes ship | High | Treat `011` as a hard predecessor and enrich only current owner payloads after its contract is in place. |
| Risk | Packet accidentally recreates `008` routing scope | High | Reject or defer startup, resume, compact, and response-surface nudges to `008` and keep this packet code-graph-local. |
| Risk | Clustering or export work creates a second graph authority | Medium | Stage clustering/export behind optional flags and persist only additive metadata on current entities. |
| Risk | Blast-radius or fallback surfaces overclaim precision | Medium | Use explicit low-authority labels, backend metadata, and frozen test corpora. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Keep graph upgrades bounded to detector, payload, and query seams already owned by the current Code Graph MCP surface.

### Security
- **NFR-S01**: Do not introduce new authority surfaces, new routing owners, or unsafe data exposure paths while upgrading graph-local payloads.

### Reliability
- **NFR-R01**: The same detector input and graph query input should always yield the same provenance classification and blast-radius depth behavior.

---

## 8. EDGE CASES

### Data Boundaries
- Missing prerequisite packet state: block implementation if `007` or `011` are not complete enough to support the upgrade lane.
- Partial provenance metadata: keep fallback states explicit rather than coercing them into `ast`.

### Error Scenarios
- Startup-surface overlap request: reject it as packet `008` scope rather than absorbing it here.
- Optional clustering/export without trust prerequisites: keep the feature flag off and omit the lane entirely.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Detector, schema, and query surfaces in one bounded owner lane |
| Risk | 17/25 | Payload compatibility and adjacency to `007`, `008`, and `011` |
| Research | 6/20 | Research is settled and should be copied, not re-derived |
| Multi-Agent | 4/15 | One packet lane with multiple verification seams |
| Coordination | 10/15 | Hard predecessor coordination with `007` and `011`, explicit sibling boundary with `008` |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Detector provenance labels drift into marketing language | H | M | Make provenance vocabulary schema-level and fixture-tested under `007`. |
| R-002 | Packet accidentally recreates `011` validation scope | H | M | Require `011` as a dependency and keep this packet additive on existing owner payloads only. |
| R-003 | Packet accidentally recreates `008` routing scope | H | M | Reject or defer any startup/resume/response-surface nudge work to `008`; keep this packet code-graph-local. |
| R-004 | Clustering or export work creates a second graph authority | M | M | Stage clustering/export behind optional flags and persist only additive metadata on current entities. |
| R-005 | Blast-radius or fallback surfaces overclaim precision | M | M | Use explicit low-authority labels, backend metadata, and frozen test corpora. |

---

## 11. USER STORIES

### US-001: Ship honest detector provenance and bounded traversal semantics (Priority: P0)

As a maintainer, I want detector provenance and blast-radius behavior to stay explicit and testable so graph outputs do not overclaim structural certainty.

**Acceptance Criteria**:
1. Given a non-AST detector path, when results are serialized, then provenance stays explicit and truthful.
2. Given a bounded blast-radius query, when traversal exceeds `maxDepth`, then out-of-bound nodes never surface.

---

### US-002: Enrich current owner payloads without creating a second graph authority (Priority: P0)

As a reviewer, I want edge evidence classes and numeric confidence to appear additively on current owner payloads so graph richness improves without replacing the shipped trust and owner model.

**Acceptance Criteria**:
1. Given additive payload enrichment, when downstream consumers inspect the result, then existing owner surfaces remain authoritative.
2. Given `011` is incomplete, when implementation planning resumes, then this packet remains blocked rather than replacing it.

---

### US-003: Keep runtime nudges and later prototypes out of day-one scope (Priority: P1)

As a packet owner, I want routing nudges, clustering, exports, and routing facades to remain bounded so the adopt-now lane stays executable and does not overlap packet `008`.

**Acceptance Criteria**:
1. Given a startup-surface nudge request, when it is compared to this spec, then it is rejected or deferred to `008`.
2. Given clustering or export proposals, when prerequisites are missing, then those lanes remain prototype-later and feature-gated.

---

## 12. OPEN QUESTIONS

- Should graph-local fallback tiering ship in the same implementation wave as the adopt-now detector and blast-radius work, or land behind a follow-on flag once the P0 lane is stable?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
