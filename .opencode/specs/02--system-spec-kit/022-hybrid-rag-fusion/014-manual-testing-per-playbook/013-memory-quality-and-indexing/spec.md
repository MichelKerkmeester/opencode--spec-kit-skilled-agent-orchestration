---
title: "Feature Specification: manual-testing-per-playbook memory quality and indexing phase [template:level_1/spec.md]"
description: "Phase 013 documents the memory-quality-and-indexing manual test packet for the Spec Kit Memory system. It now tracks 42 exact scenario IDs by expanding the dedicated memory-section sub-scenarios alongside the original top-level inventory."
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
| **Predecessor Phase** | `012-query-intelligence` |
| **Successor Phase** | `014-pipeline-architecture` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for memory-quality-and-indexing currently live in the central playbook and need structured per-phase documentation that preserves exact prompts, command sequences, evidence expectations, and review-protocol verdict rules. The earlier Phase 013 packet only modeled `26` top-level scenarios and collapsed the dedicated memory-section sub-scenarios, which meant active exact IDs such as `M-005a`, `M-006b`, and `M-007g` were not represented literally in the phase documentation.

### Purpose
Provide a single memory-quality-and-indexing specification that maps all `42` exact Phase 013 scenario IDs to canonical feature context and playbook-derived acceptance criteria so execution and review remain consistent with the current manual testing playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Mapping Note |
|---------|---------------|-----------------|--------------|
| 039 | Verify-fix-verify memory quality loop (PI-A5) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md) | Direct category match for retry-then-reject quality-loop behavior. |
| 040 | Signal vocabulary expansion (TM-08) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md) | Direct category match for correction, preference, and reinforcement signal detection. |
| 041 | Pre-flight token budget validation (PI-A3) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md) | Direct category match for save-time preflight warnings and failures. |
| 042 | Spec folder description discovery (PI-B3) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Direct category match for description.json creation, repair, and routing. |
| 043 | Pre-storage quality gate (TM-04) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md) | Direct category match for the 3-layer warn-or-reject gate. |
| 044 | Reconsolidation-on-save (TM-06) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md) | Direct category match for merge, supersede, and independent-save thresholds. |
| 045 | Smarter memory content generation (S1) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md) | Direct category match for structure retention and concise normalization output. |
| 046 | Anchor-aware chunk thinning (R7) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) | Direct category match for anchor-priority chunk retention. |
| 047 | Encoding-intent capture at index time (R16) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md) | Direct category match for persisted document/code/structured_data intent labels. |
| 048 | Auto entity extraction (R10) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Direct category match for entity extraction, normalization, and denylist behavior. |
| 069 | Entity normalization consolidation | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md) | Direct category match for shared unicode-aware normalization parity. |
| 073 | Quality gate timer persistence | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md) | Direct category match for persisted warn-only activation timing. |
| 092 | Implemented: auto entity extraction (R10) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Implemented-status validation for the same entity extraction pipeline covered by 048. |
| 111 | Deferred lexical-only indexing | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) | Direct category match for embedding failure fallback and reindex recovery. |
| 119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Playbook cross-reference aligns this scenario to spec-folder description discovery; execution also touches filename collision and memorySequence history behavior. |
| 131 | Description.json batch backfill validation (PI-B3) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Direct playbook cross-reference to PI-B3 batch backfill coverage. |
| 132 | description.json schema field validation | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) | Direct playbook cross-reference to PI-B3 schema conformance checks. |
| 133 | Dry-run preflight for memory_save | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md) | Direct category match for dry-run sufficiency preview and no-side-effect checks. |
| M-001 | Context Recovery and Continuation | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) | Nearest category support: anchor-preserved memory sections back the anchored recovery flow when no dedicated catalog row exists. |
| M-002 | Targeted Memory Lookup | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) | Nearest category support: targeted anchor-based retrieval depends on retained high-value anchor chunks. |
| M-003 | Context Save + Index Update | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) | Nearest category support: the scenario validates post-save discoverability and indexing readiness. |
| M-004 | Main-Agent Review and Verdict Handoff | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md) | Nearest category support: structured, coherent saved output is the closest category behavior backing deterministic review handoff. |
| M-005 | Outsourced Agent Memory Capture Round-Trip | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md) | Direct category match for the umbrella outsourced-agent round-trip. |
| M-005a | JSON-mode hard-fail (REQ-001) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md) | Explicit child scenario for invalid JSON hard-fail behavior. |
| M-005b | nextSteps persistence (REQ-002) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md) | Explicit child scenario for `nextSteps` to `NEXT_ACTION` persistence. |
| M-005c | Verification freshness (REQ-004/REQ-005) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md) | Explicit child scenario for dated evidence and freshness of live round-trip claims. |
| M-006 | Stateless Enrichment and Alignment Guardrails | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md) | Direct category match for the umbrella stateless enrichment scenario. |
| M-006a | Unborn-HEAD and dirty snapshot fallback | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md) | Explicit child scenario for pre-commit repo snapshot behavior. |
| M-006b | Detached-HEAD snapshot preservation | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md) | Explicit child scenario for detached-HEAD commit identity retention. |
| M-006c | Similar-folder boundary protection | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-stateless-enrichment-and-alignment-guards.md) | Explicit child scenario for similarly named foreign-folder exclusion. |
| M-007 | Session Capturing Pipeline Quality | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Cross-category mapping to the exact session-capturing closure feature rather than the nearest memory-quality proxy. |
| M-007a | JSON authority and successful indexing | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for rich JSON-mode authority and successful indexing. |
| M-007b | Thin JSON insufficiency rejection and lower-score behavior | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for `INSUFFICIENT_CONTEXT_ABORT` and lower diagnostic quality. |
| M-007c | Mis-scoped stateless save rejection path | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for `ALIGNMENT_BLOCK` on same-workspace off-spec runs. |
| M-007d | Spec-folder and git-context enrichment presence | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for enrichment presence plus render-contract quality. |
| M-007e | OpenCode precedence | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for priority order without bypassing later gates. |
| M-007f | Claude fallback | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for Claude fallback under canonical workspace identity. |
| M-007g | Codex fallback | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for Codex fallback under canonical workspace identity. |
| M-007h | Copilot fallback | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for Copilot fallback under canonical workspace identity. |
| M-007i | Gemini fallback | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for Gemini fallback under canonical workspace identity. |
| M-007j | Final `NO_DATA_AVAILABLE` hard-fail | [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) | Explicit child scenario for the final no-data hard-fail. |
| M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | [`../../../../../skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md`](../../../../../skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md) | Direct cross-category mapping for per-memory history behavior. |

### Out of Scope
- Executing the 42 exact scenario IDs and assigning final run verdicts.
- Modifying the review protocol or feature catalog source files.
- Documenting manual testing phases outside `013-memory-quality-and-indexing/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Phase 013 requirements, exact-ID inventory, mappings, and acceptance criteria |
| `plan.md` | Modify | Phase 013 execution plan updated to the exact-ID model |
| `tasks.md` | Modify | Phase 013 tasks updated to the exact-ID model |
| `checklist.md` | Modify | Phase 013 QA updated to the exact-ID model |
| `implementation-summary.md` | Modify | Phase 013 summary updated to reflect the exact-ID draft packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document 039 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Quality loop retries up to max attempts then rejects with reason; FAIL: No retry attempted or infinite retry loop |
| REQ-002 | Document 040 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified |
| REQ-003 | Document 041 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior |
| REQ-004 | Document 042 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files |
| REQ-005 | Document 043 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Each failure class triggers the correct gate layer with appropriate warn/reject and a complete decision log |
| REQ-006 | Document 044 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Merge at >=0.88, supersede at 0.75-0.88, independent below 0.75 |
| REQ-007 | Document 045 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Structure preserved, output concise (<=2x input density), sections coherent |
| REQ-008 | Document 046 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: All anchor chunks retained, filler removed, retained set non-empty |
| REQ-009 | Document 047 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Correct intent label assigned per content type and labels remain immutable after save |
| REQ-010 | Document 048 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Entities extracted, normalized, persisted; denylist items absent |
| REQ-011 | Document 069 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Extractor and linker produce identical normalized entities for all test inputs including unicode |
| REQ-012 | Document 073 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Activation timestamp persists across restart and the quality gate honors the original timer |
| REQ-013 | Document 092 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Entity extraction runs automatically on save and produces correctly typed entities with default settings |
| REQ-014 | Document 111 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding |
| REQ-015 | Document 119 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Collision produces `-1` first, exhausting `-1..-100` produces a 12-hex random fallback, repeated fallback saves stay distinct, `memorySequence` increments, and `memoryNameHistory` tracks all names |
| REQ-016 | Document 131 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: description.json coverage matches the active spec inventory, every description.json is valid JSON, C1 field-type checks pass, and per-folder generation is preferred over spec.md fallback |
| REQ-017 | Document 132 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: All 9 fields are present with the exact string/array-of-strings/number matrix, save updates sequence/history, and regeneration repairs corrupted fields |
| REQ-018 | Document 133 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable |
| REQ-019 | Document M-001 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Continuation context is actionable and specific |
| REQ-020 | Document M-002 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Question answered with a traceable result |
| REQ-021 | Document M-003 with its exact playbook command sequence, evidence target, and mapped feature link. | PASS: Context appears in retrieval post-index |
| REQ-022 | Document M-004 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Deterministic verdict issued with rationale |
| REQ-023 | Document M-005 as the umbrella outsourced-agent round-trip scenario. | PASS: Parent `M-005` still documents the overall external-agent save/search loop |
| REQ-024 | Document M-006 as the umbrella stateless-enrichment scenario. | PASS: Parent `M-006` still documents the overall stateless save/enrichment loop |
| REQ-025 | Document M-007 as the umbrella session-capturing closure scenario. | PASS: Parent `M-007` still documents the full closure suite and its cross-references |
| REQ-026 | Document M-005a with its exact playbook command sequence and acceptance rule. | PASS: Invalid JSON hard-fails with `EXPLICIT_DATA_FILE_LOAD_FAILED` |
| REQ-027 | Document M-005b with its exact playbook command sequence and acceptance rule. | PASS: `nextSteps` persists into `Next:` or `NEXT_ACTION` observations |
| REQ-028 | Document M-005c with its exact playbook command sequence and acceptance rule. | PASS: Live outsourced round-trip claims are backed by fresh dated evidence |
| REQ-029 | Document M-006a with its exact playbook command sequence and acceptance rule. | PASS: Unborn-HEAD repo snapshot preserves branch, dirty state, null commit, and uncommitted files |
| REQ-030 | Document M-006b with its exact playbook command sequence and acceptance rule. | PASS: Detached-HEAD snapshot preserves `HEAD`, commit identity, detached status, and in-scope history |
| REQ-031 | Document M-006c with its exact playbook command sequence and acceptance rule. | PASS: Similar-folder foreign history is excluded from the target result |
| REQ-032 | Document M-007a with its exact playbook command sequence and acceptance rule. | PASS: Rich JSON-mode save validates and indexes successfully |
| REQ-033 | Document M-007b with its exact playbook command sequence and acceptance rule. | PASS: Thin aligned JSON fails `INSUFFICIENT_CONTEXT_ABORT` before file write with a lower diagnostic quality score |
| REQ-034 | Document M-007c with its exact playbook command sequence and acceptance rule. | PASS: Mis-scoped same-workspace stateless save hard-fails `ALIGNMENT_BLOCK` |
| REQ-035 | Document M-007d with its exact playbook command sequence and acceptance rule. | PASS: Spec-folder/git enrichment appears, ANCHOR comments are preserved, and trigger-phrase quality remains valid |
| REQ-036 | Document M-007e with its exact playbook command sequence and acceptance rule. | PASS: OpenCode precedence does not bypass later alignment blocking |
| REQ-037 | Document M-007f with its exact playbook command sequence and acceptance rule. | PASS: Claude fallback uses canonical workspace identity and still obeys later gates |
| REQ-038 | Document M-007g with its exact playbook command sequence and acceptance rule. | PASS: Codex fallback uses canonical workspace identity and no longer false-fails `V7` for aligned tool-rich sessions |
| REQ-039 | Document M-007h with its exact playbook command sequence and acceptance rule. | PASS: Copilot fallback uses canonical workspace identity and still requires durable evidence for save success |
| REQ-040 | Document M-007i with its exact playbook command sequence and acceptance rule. | PASS: Gemini fallback uses canonical workspace identity and still requires durable evidence for save success |
| REQ-041 | Document M-007j with its exact playbook command sequence and acceptance rule. | PASS: Final hard-fail returns explicit `NO_DATA_AVAILABLE` |
| REQ-042 | Document M-008 with its exact playbook prompt, command sequence, evidence target, and mapped feature link. | PASS: Direct operator run confirms per-memory history behavior without relying only on automated suites |

No P1 items are defined for this phase; all 42 exact scenario IDs are required for Phase 013 coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 42 exact Phase 013 scenario IDs are documented with exact prompts, command sequences, evidence expectations, and review-protocol verdict language.
- **SC-002**: Every exact scenario ID in this phase links to a feature-catalog file, including explicit source-backed mappings for `M-005a..c`, `M-006a..c`, and `M-007a..j`.
- **SC-003**: `plan.md` defines a preconditions -> execute -> evidence -> verdict pipeline for both non-destructive and sandboxed destructive scenarios.
- **SC-004**: Reviewers can assess the phase as 42/42 documented exact IDs with no omitted dedicated-memory sub-scenarios and no shorthand-only `M-007` coverage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`](../../../../../skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md) | Canonical source for prompts, commands, evidence targets, and pass criteria | Treat the current playbook text, including the suffixed memory sub-scenarios, as the source of truth |
| Dependency | [`../../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md`](../../../../../skill/system-spec-kit/manual_testing_playbook/review_protocol.md) | PASS, PARTIAL, FAIL, and coverage rules cannot be applied consistently without it | Use the protocol wording directly in execution review and final verdict reporting |
| Dependency | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/), [`../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](../../../../../skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md), and [`../../../../../skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md`](../../../../../skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md) | Exact scenario mappings lose canonical grounding if unavailable | Keep all exact-ID rows linked to feature sources and note cross-category mappings explicitly |
| Dependency | MCP runtime, CLI scripts, disposable sandbox spec folders, and restart-safe test environment | Many scenarios require saves, reindex, service restart, file corruption tests, or dry-run inspection | Run destructive cases only in sandboxes, create checkpoints before mutation, and restore runtime state after each destructive block |
| Risk | `042`, `119`, `131`, and `132` mutate or repair description metadata and can taint shared spec folders | High | Use disposable spec folders, isolate description.json corruption tests, and verify cleanup before proceeding |
| Risk | `M-007` now spans 11 exact IDs (umbrella + 10 sub-scenarios) and can overclaim if evidence is reused loosely | High | Track each exact `M-007*` ID separately so parent umbrella coverage never substitutes for child evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which disposable spec folder should Phase 013 treat as the canonical sandbox for description.json corruption, memory filename collision, and dry-run save scenarios?
- Should `M-001` through `M-004` remain mapped to nearest supporting memory-quality features, or should a future feature-catalog backfill create dedicated operator-flow entries for those scenarios?
<!-- /ANCHOR:questions -->

---
