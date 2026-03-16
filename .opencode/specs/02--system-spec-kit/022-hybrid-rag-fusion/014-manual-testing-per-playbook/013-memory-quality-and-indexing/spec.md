---
title: "Feature Specification: manual-testing-per-playbook memory quality and indexing phase [template:level_1/spec.md]"
description: "Phase 013 documents the memory-quality-and-indexing manual test packet for the Spec Kit Memory system. It breaks 25 playbook scenarios into a bounded phase document so testers can execute prompts, commands, evidence capture, and verdict criteria from one canonical folder."
trigger_phrases:
  - "memory quality manual testing"
  - "phase 013 indexing tests"
  - "manual testing playbook memory phase"
  - "hybrid rag fusion memory quality"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook memory quality and indexing phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for memory-quality-and-indexing currently live in the central playbook and need structured per-phase documentation that preserves exact prompts, command sequences, evidence expectations, and review-protocol verdict rules. Without a dedicated Phase 013 packet, testers must reconstruct memory save, indexing, and review coverage from multiple source documents before they can execute or assess the category consistently.

### Purpose
Provide a single memory-quality-and-indexing specification that maps all 25 Phase 013 test IDs to canonical feature context and playbook-derived acceptance criteria so execution and review remain consistent with the manual testing playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Mapping Note |
|---------|---------------|-----------------|--------------|
| NEW-039 | Verify-fix-verify memory quality loop (PI-A5) | [`../../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md`](../../feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md) | Direct category match for retry-then-reject quality-loop behavior. |
| NEW-040 | Signal vocabulary expansion (TM-08) | [`../../feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md`](../../feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md) | Direct category match for correction, preference, and reinforcement signal detection. |
| NEW-041 | Pre-flight token budget validation (PI-A3) | [`../../feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md`](../../feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md) | Direct category match for save-time preflight warnings and failures. |
| NEW-042 | Spec folder description discovery (PI-B3) | [`../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Direct category match for description.json creation, repair, and routing. |
| NEW-043 | Pre-storage quality gate (TM-04) | [`../../feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md`](../../feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md) | Direct category match for the 3-layer warn-or-reject gate. |
| NEW-044 | Reconsolidation-on-save (TM-06) | [`../../feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md`](../../feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md) | Direct category match for merge, supersede, and independent-save thresholds. |
| NEW-045 | Smarter memory content generation (S1) | [`../../feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md`](../../feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md) | Direct category match for structure retention and concise normalization output. |
| NEW-046 | Anchor-aware chunk thinning (R7) | [`../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) | Direct category match for anchor-priority chunk retention. |
| NEW-047 | Encoding-intent capture at index time (R16) | [`../../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md`](../../feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md) | Direct category match for persisted document/code/structured_data intent labels. |
| NEW-048 | Auto entity extraction (R10) | [`../../feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Direct category match for entity extraction, normalization, and denylist behavior. |
| NEW-069 | Entity normalization consolidation | [`../../feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md`](../../feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md) | Direct category match for shared unicode-aware normalization parity. |
| NEW-073 | Quality gate timer persistence | [`../../feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md`](../../feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md) | Direct category match for persisted warn-only activation timing. |
| NEW-111 | Deferred lexical-only indexing | [`../../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md`](../../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) | Direct category match for embedding failure fallback and reindex recovery. |
| NEW-119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | [`../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Playbook cross-reference aligns this scenario to spec-folder description discovery; execution also touches filename collision and memorySequence history behavior. |
| NEW-131 | Description.json batch backfill validation (PI-B3) | [`../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Direct playbook cross-reference to PI-B3 batch backfill coverage. |
| NEW-132 | description.json schema field validation | [`../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Direct playbook cross-reference to PI-B3 schema conformance checks. |
| NEW-133 | Dry-run preflight for memory_save | [`../../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md`](../../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md) | Direct category match for dry-run sufficiency preview and no-side-effect checks. |
| M-001 | Context Recovery and Continuation | [`../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) | Nearest category support: anchor-preserved memory sections back the anchored recovery flow when no dedicated catalog row exists. |
| M-002 | Targeted Memory Lookup | [`../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](../../feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) | Nearest category support: targeted anchor-based retrieval depends on retained high-value anchor chunks. |
| M-003 | Context Save + Index Update | [`../../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md`](../../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) | Nearest category support: the scenario validates post-save discoverability and indexing readiness. |
| M-004 | Main-Agent Review and Verdict Handoff | [`../../feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md`](../../feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md) | Nearest category support: structured, coherent saved output is the closest category behavior backing deterministic review handoff. |
| M-005 | Outsourced Agent Memory Capture Round-Trip | [`../../feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`](../../feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md) | Direct user-provided mapping to outsourced agent memory capture. |
| M-006 | Stateless Enrichment and Alignment Guardrails | [`../../feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`](../../feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md) | Direct user-provided mapping to stateless enrichment and alignment guards. |
| M-007 | Session Capturing Pipeline Quality | [`../../feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`](../../feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md) | Closest category file for stateless enrichment, alignment, capture quality, and indexing readiness; the playbook also cross-references NEW-133 inside the scenario. |
| M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | [`../../feature_catalog/02--mutation/10-per-memory-history-log.md`](../../feature_catalog/02--mutation/10-per-memory-history-log.md) | Direct user-provided cross-category mapping for per-memory history behavior. |

### Out of Scope
- Executing the 25 Phase 013 scenarios and assigning final run verdicts.
- Modifying the manual testing playbook, review protocol, or feature catalog source files.
- Documenting manual testing phases outside `013-memory-quality-and-indexing/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 013 requirements, test inventory, mappings, and acceptance criteria |
| `plan.md` | Create | Phase 013 execution plan, quality gates, and review workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document NEW-039 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Quality loop retries up to max attempts then rejects with reason; FAIL: No retry attempted or infinite retry loop |
| REQ-002 | Document NEW-040 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified |
| REQ-003 | Document NEW-041 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior |
| REQ-004 | Document NEW-042 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails |
| REQ-005 | Document NEW-043 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Each failure class triggers correct gate layer with appropriate warn/reject; decision log complete; FAIL: Gate layer skipped or wrong severity for failure class |
| REQ-006 | Document NEW-044 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Merge at >=0.88, supersede at 0.75-0.88, independent below 0.75; FAIL: Wrong action for similarity range or threshold miscalibrated |
| REQ-007 | Document NEW-045 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Structure preserved, output concise (<=2x input density), sections coherent; FAIL: Structure lost, verbose output, or incoherent sections |
| REQ-008 | Document NEW-046 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: All anchor chunks retained; filler removed; retained set non-empty; FAIL: Anchor chunks removed or empty retained set |
| REQ-009 | Document NEW-047 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Correct intent label assigned per content type; labels immutable after save; FAIL: Wrong label or label modified post-save |
| REQ-010 | Document NEW-048 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Entities extracted, normalized, persisted; denylist items absent; FAIL: Missing entities, denormalized values, or denylist items present |
| REQ-011 | Document NEW-069 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if extractor and linker produce identical normalized entities for all test inputs including unicode |
| REQ-012 | Document NEW-073 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if activation timestamp persists across restart and quality gate honors the original timer |
| REQ-013 | Document NEW-111 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding |
| REQ-014 | Document NEW-119 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if collision produces -1 suffix first, exhausting -1..-100 produces a 12-hex random fallback suffix instead of SHA1, repeated fallback saves still produce distinct names, memorySequence increments through the hardened coercion path, and memoryNameHistory tracks all names |
| REQ-015 | Document NEW-131 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if description.json coverage matches the active spec inventory, every description.json is valid JSON, C1 field-type checks pass, and per-folder generation is preferred over spec.md fallback |
| REQ-016 | Document NEW-132 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if all 9 fields are present with the exact string / array-of-strings / number matrix, save updates sequence/history, and regeneration repairs corrupted fields |
| REQ-017 | Document NEW-133 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS if dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable |
| REQ-018 | Document M-001 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: Continuation context is actionable and specific. |
| REQ-019 | Document M-002 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: question answered with traceable result. |
| REQ-020 | Document M-003 with its exact playbook command sequence, evidence target, and mapped feature link. | Pass: context appears in retrieval post-index. |
| REQ-021 | Document M-004 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: deterministic verdict issued with rationale. |
| REQ-022 | Document M-005 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: Saved memory from outsourced agent session is searchable and contains session summary, files modified, decisions. |
| REQ-023 | Document M-006 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: stateless save succeeds for matching files, emits provenance-backed context, and still blocks unrelated captures when overlap is genuinely low. |
| REQ-024 | Document M-007 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: All automated commands pass; package-clean MCP verification passes alongside the scripts-side closure suite; M-007a validates and indexes successfully; M-007b proves thin aligned JSON now fails INSUFFICIENT_CONTEXT_ABORT with lower diagnostic quality than M-007a and with no new memory file written; M-007c proves the mis-scoped same-workspace stateless run hard-fails ALIGNMENT_BLOCK; M-007d shows provenance-tagged enrichment, ANCHOR preservation, rendered-memory contract compliance, and frontmatter trigger-phrase quality; M-007e proves OpenCode precedence does not override save-path alignment blocking; M-007f through M-007i prove per-backend fallback behavior under canonical .opencode workspace identity, the direct-mode caller hint, and the tightened alignment plus insufficiency gates without malformed trigger rendering or V5 corruption; M-007j proves final NO_DATA_AVAILABLE behavior. |
| REQ-025 | Document M-008 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | Pass: direct operator run confirms per-memory history behavior without relying only on automated suites. |

No P1 items are defined for this phase; all 25 scenarios are required for Phase 013 coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 25 Phase 013 tests are documented with exact prompts, command sequences, evidence expectations, and review-protocol verdict language.
- **SC-002**: Every test ID in this phase links to a feature-catalog file, including explicit source-backed mappings for M-001 through M-008.
- **SC-003**: `plan.md` defines a preconditions -> execute -> evidence -> verdict pipeline for both non-destructive and sandboxed destructive scenarios.
- **SC-004**: Reviewers can assess the phase as 25/25 documented scenarios with no omitted test IDs, placeholder text, or ambiguous coverage gaps.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for prompts, commands, evidence targets, and pass criteria | Treat the playbook as source of truth and update this phase packet only from extracted playbook rows |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | PASS, PARTIAL, FAIL, and coverage rules cannot be applied consistently without it | Use the protocol wording directly in execution review and final verdict reporting |
| Dependency | [`../../feature_catalog/13--memory-quality-and-indexing/`](../../feature_catalog/13--memory-quality-and-indexing/) and [`../../feature_catalog/02--mutation/10-per-memory-history-log.md`](../../feature_catalog/02--mutation/10-per-memory-history-log.md) | Test-to-feature context and cross-category M-008 coverage lose canonical grounding if unavailable | Keep all test rows linked to feature sources and note any cross-category mapping explicitly |
| Dependency | MCP runtime, CLI scripts, disposable sandbox spec folders, and restart-safe test environment | Many scenarios require saves, reindex, service restart, file corruption tests, or dry-run inspection | Run destructive cases only in sandboxes, create checkpoints before mutation, and restore runtime state after each destructive block |
| Risk | NEW-042, NEW-119, NEW-131, and NEW-132 mutate or repair description metadata and can taint shared spec folders | High | Use disposable spec folders, isolate description.json corruption tests, and verify cleanup before proceeding |
| Risk | M-007 is a large closure scenario with many backend and validation branches | High | Execute it last, checkpoint beforehand, and track each sub-scenario separately so partial evidence does not masquerade as a full PASS |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which disposable spec folder should Phase 013 treat as the canonical sandbox for description.json corruption, memory filename collision, and dry-run save scenarios?
- Should M-001 through M-004 remain mapped to nearest supporting memory-quality features, or should a future feature-catalog backfill create dedicated operator-flow entries for those scenarios?
<!-- /ANCHOR:questions -->

---
