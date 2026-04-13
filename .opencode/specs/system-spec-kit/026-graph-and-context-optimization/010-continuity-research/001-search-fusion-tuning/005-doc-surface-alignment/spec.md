<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Doc Surface Alignment: Search Fusion Changes"
description: "Several operator-facing search docs still described pre-017 tuning behavior. This packet realigns only the requested surfaces so public guidance matches the shipped runtime for reranking, continuity fusion, and cache telemetry."
trigger_phrases:
  - "search fusion doc alignment"
  - "continuity search profile docs"
  - "reranker telemetry docs"
  - "doc-only parity pass"
importance_tier: "important"
contextType: "implementation"
status: complete
level: 2
type: implementation
parent: 001-search-fusion-tuning
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-continuity-research/001-search-fusion-tuning/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Specified and completed the search-fusion doc-surface alignment scope"
    next_safe_action: "Reuse this packet if adjacent search docs drift from the 017 runtime contract"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:017-phase-005-doc-surface-alignment-spec"
      session_id: "017-phase-005-doc-surface-alignment-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which requested surfaces needed edits versus scan-only confirmation"
---
# Feature Specification: Doc Surface Alignment: Search Fusion Changes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | `2` |
| **Priority** | `P1` |
| **Status** | `Complete` |
| **Created** | `2026-04-13` |
| **Branch** | `001-search-fusion-tuning` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several operator-facing search docs still described the pre-017 tuning state. The runtime now treats reranker length scaling as a neutral `1.0` multiplier, exposes reranker cache telemetry through `getRerankerStatus()`, applies a continuity-specific adaptive fusion profile, waits for at least four results before Stage 3 reranking, and includes continuity in the Stage 3 MMR lambda map, but not every requested surface reflected those changes.

### Purpose
Bring the requested documentation surfaces back into sync with the shipped search-fusion runtime without touching unrelated guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `README.md` where it describes search behavior.
- Update the active architecture surface at `.opencode/skill/system-spec-kit/ARCHITECTURE.md`.
- Update the requested command, skill, config, feature catalog, and manual testing surfaces that still describe stale search behavior.
- Create packet-local `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

### Out of Scope
- Runtime code or test changes. This packet is documentation-only.
- Surfaces that were scanned but do not directly describe the changed behavior, such as `.opencode/command/memory/manage.md`, `.opencode/agent/context.md`, and `AGENTS.md`.
- Commit, push, or release workflow steps.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Align public search pipeline and telemetry narrative with the current runtime |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Modify | Align architecture-level search behavior notes with the current runtime |
| `.opencode/command/memory/search.md` | Modify | Document the current search contract, continuity profile, rerank gate, and telemetry |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Update skill-level search guidance and continuity-profile references |
| `.opencode/skill/system-spec-kit/mcp_server/configs/README.md` | Modify | Point operators to the real runtime sources for fusion weights, rerank gating, and telemetry |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Align catalog-level summary text with shipped behavior |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md` | Modify | Align memory search feature details |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md` | Modify | Align Stage 3 pipeline behavior details |
| `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md` | Modify | Align reranker cache telemetry and length-penalty wording |
| `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` | Modify | Align feature-flag reference text with current search behavior |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` | Modify | Align simple-language summary of the search pipeline |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Align the main manual testing search narrative |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md` | Modify | Update reranker scenario expectations for telemetry and neutralized length scaling |
| `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create | Close the packet with required Level 2 execution docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document that reranker length scaling is now neutral | Updated surfaces state the old `<50` and `>2000` penalties no longer apply and the effective multiplier is `1.0` |
| REQ-002 | Document reranker cache telemetry | Updated surfaces mention `hits`, `misses`, `staleHits`, and `evictions` from `getRerankerStatus()` where reranker behavior is described |
| REQ-003 | Document the continuity adaptive fusion profile | Updated search docs cite continuity weights `semantic 0.52`, `keyword 0.18`, `recency 0.07`, `graph 0.23` |
| REQ-004 | Document the raised Stage 3 rerank threshold | Updated pipeline docs state `MIN_RESULTS_FOR_RERANK = 4` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Document the continuity Stage 3 MMR lambda entry | Updated docs mention continuity in `INTENT_LAMBDA_MAP` with the current runtime lambda |
| REQ-006 | Create Level 2 companion docs for this packet | `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` exist and pass strict validation with the packet |
| REQ-007 | Preserve scope discipline | Scan-only surfaces remain unchanged when they do not directly describe the changed runtime behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The requested doc surfaces describe the current search-fusion runtime instead of the pre-017 tuning behavior.
- **SC-002**: Surfaces that were scanned but did not document the changed behavior remain untouched.
- **SC-003**: The packet contains the required Level 2 companion docs and passes strict packet validation.

### Acceptance Scenarios

- **Given** an operator reads the updated reranker guidance, **when** they review length-based scoring notes, **then** they are told the effective multiplier is now a neutral `1.0` instead of the retired short and long penalties.
- **Given** an operator inspects reranker observability guidance, **when** they look for cache status details, **then** they can find `hits`, `misses`, `staleHits`, and `evictions` exposed through `getRerankerStatus()`.
- **Given** an operator checks continuity-oriented search behavior, **when** they read the updated docs, **then** they see the continuity adaptive fusion profile `0.52 / 0.18 / 0.07 / 0.23` and the continuity Stage 3 MMR entry documented together.
- **Given** an operator reviews the Stage 3 pipeline contract, **when** they confirm rerank thresholds, **then** they see that reranking now starts only when at least four candidates are available.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime source-of-truth files under `.opencode/skill/system-spec-kit/mcp_server/lib/search/` and `.opencode/skill/system-spec-kit/shared/algorithms/` | Docs could drift further if the implementation facts are misread | Verify every changed claim against the actual implementation before patching docs |
| Risk | Over-editing generic search docs that do not mention the changed behavior | Scope drift and unnecessary churn | Update only files that explicitly describe the retired length penalty, reranker gate, telemetry, or continuity-specific search tuning |
| Risk | Packet docs fail the current Level 2 template contract | Packet cannot close cleanly even if the doc edits are correct | Normalize packet docs to the active template markers, anchors, and section names before final validation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Verification should rely on focused doc checks (`rg`, `git diff --check`, strict packet validation), not broad repository sweeps.
- **NFR-P02**: The packet should not introduce runtime overhead because it is documentation-only.

### Security
- **NFR-S01**: The updated docs must not expose new secrets, credentials, or privileged operational details.
- **NFR-S02**: Public guidance must describe runtime behavior accurately so operators do not make unsafe assumptions about search internals.

### Reliability
- **NFR-R01**: All changed behavior claims must map to the current implementation source of truth.
- **NFR-R02**: Packet closeout docs must satisfy strict validation so the packet is recoverable through the standard continuity ladder.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty result sets: docs should make clear that Stage 3 reranking does not run below the `4`-candidate threshold.
- Shallow result sets: docs should describe that continuity still benefits from adaptive fusion even when reranking is skipped.
- Operator shorthand: packet docs should use real repo paths for referenced markdown files so validation can resolve them.

### Error Scenarios
- Missing root architecture doc: the packet should point to `.opencode/skill/system-spec-kit/ARCHITECTURE.md` as the active architecture surface.
- Validator drift: if Level 2 headings or template markers are stale, packet docs must be repaired before completion is claimed.
- Scan-only surfaces: unchanged files still need to be recorded explicitly so future readers know they were evaluated.

### State Transitions
- Packet creation to closeout: packet docs are created after the doc pass stabilizes, then verified with strict validation.
- Follow-on search changes: the packet should remain a reliable reference for future doc parity work until runtime behavior changes again.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple requested doc surfaces plus packet-local closeout docs |
| Risk | 11/25 | Low runtime risk, moderate risk of doc drift or validator mismatch |
| Research | 12/20 | Required targeted verification against several runtime source files |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

## 10. OPEN QUESTIONS

- None. The requested behavior changes were explicit and verified against the runtime.
<!-- /ANCHOR:questions -->
