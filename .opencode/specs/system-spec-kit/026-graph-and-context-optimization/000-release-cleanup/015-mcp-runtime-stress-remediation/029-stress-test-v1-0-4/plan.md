---
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
title: "Implementation Plan: v1.0.4 Stress Test on Clean Infrastructure"
description: "Execution plan for the Phase K v1.0.4 measurement-only stress cycle using the live memory_search handler seam and search-quality harness telemetry export."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
trigger_phrases:
  - "v1.0.4 stress test plan"
  - "Phase K stress plan"
  - "clean infrastructure stress cycle"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/029-stress-test-v1-0-4"
    last_updated_at: "2026-04-29T12:40:00Z"
    last_updated_by: "codex"
    recent_action: "Plan verified"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "measurements/phase-k-v1-0-4-stress.test.ts"
    session_dedup:
      fingerprint: "sha256:029-v1-0-4-plan"
      session_id: "phase-k-v1-0-4"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Use the v1.0.3 12-case search-quality corpus layout for like-for-like telemetry comparison; document non-like-for-like limits against v1.0.2's 30 CLI cells."
---
# Implementation Plan: v1.0.4 Stress Test on Clean Infrastructure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest, Spec Kit Memory MCP runtime |
| **Storage** | Packet-local JSON/JSONL measurement artifacts |
| **Testing** | Packet-local Vitest runner plus strict spec validator |

### Overview

This packet re-runs the v1.0.3 search-quality stress layout on the post-v1.0.4 infrastructure. The runner uses the PP-1 live-handler seam by mocking `executePipeline` at the retrieval boundary while `handleMemorySearch` runs as production code. It also uses the PP-2 `telemetryExportPath` mode so the search-quality harness emits envelope, audit, and shadow samples without changing harness code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 target packet pre-approved by user.
- [x] Runtime, harness, and prior packets are read-only.
- [x] Prior v1.0.2 and v1.0.3 evidence files identified.
- [x] Stress-test pattern and templates identified.

### Definition of Done

- [ ] Measurement artifacts exist under `measurements/`.
- [ ] `findings-v1-0-4.md` follows the stress-test findings skeleton.
- [ ] `findings-rubric-v1-0-4.json` parses and records aggregate math.
- [ ] `implementation-summary.md` records final verdict and limitations.
- [ ] Strict packet validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measurement-only packet with a live handler seam.

### Key Components

- **Search-quality corpus**: `SEARCH_QUALITY_EXTENDED_CORPUS` provides the stable v1.0.3 12-case layout.
- **Harness telemetry export**: `runSearchQualityHarness(..., { telemetryExportPath })` emits sibling envelope, audit, and shadow JSONL rows.
- **Live handler seam**: `handleMemorySearch` is called directly while `executePipeline` and graph-readiness are deterministic test seams.
- **Packet artifacts**: JSONL telemetry samples, summary JSON, narrative findings, rubric sidecar, and implementation summary.

### Data Flow

The runner loads the frozen corpus, wraps each channel runner with a direct `handleMemorySearch` call, reads the audit row written through `SPECKIT_SEARCH_DECISION_AUDIT_PATH`, attaches telemetry to the harness output, exports JSONL via `telemetryExportPath`, computes aggregate metrics, and writes packet-local summaries for the findings pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Setup

- [x] Read the packet spec, prior cycle artifacts, stress-test playbook, templates, and runtime/harness seams.
- [x] Author Level 2 packet docs (`plan.md`, `tasks.md`, `checklist.md`).

### Phase 2: Measurement Execution

- [ ] Compose the packet-local Vitest runner.
- [ ] Run the 12-case v1.0.3 search-quality corpus layout through the PP-1 live handler seam.
- [ ] Export envelope, audit, and shadow JSONL with PP-2 `telemetryExportPath`.
- [ ] Compute aggregate metrics, SLA panel, W4 trigger counts, and comparison deltas.

### Phase 3: Findings and Verification

- [ ] Author `findings-v1-0-4.md`.
- [ ] Author `findings-rubric-v1-0-4.json`.
- [ ] Author `implementation-summary.md`.
- [ ] Update `spec.md` continuity to complete.
- [ ] Run strict validator and stage the packet directory.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Measurement runner | Live `handleMemorySearch` seam plus harness telemetry export | Vitest |
| Artifact validation | JSON/JSONL parseability, counts, and field completeness | Vitest + Node.js |
| Spec validation | Packet structure and metadata | `validate.sh --strict` |

### L2 Verification Addendum

- Validate every emitted JSON file parses.
- Confirm every envelope has `degradedReadiness.freshness`.
- Confirm audit rows were appended by `recordSearchDecision`.
- Confirm W4 triggers are non-placeholder.
- Confirm no runtime or harness files are modified.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| v1.0.2 findings/rubric | Internal evidence | Available | Needed for 83.8% baseline comparison. |
| v1.0.3 findings/rubric/summary | Internal evidence | Available | Needed for like-for-like telemetry comparison. |
| PP-1 live handler seam | Runtime test pattern | Available | Needed to avoid the old 30s readiness timeout. |
| PP-2 harness telemetry export | Harness feature | Available | Needed to avoid packet-local telemetry composition. |
| degraded-readiness mapper | Runtime wiring | Available | Needed for envelope completeness. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Measurement runner or generated artifacts are malformed, or a scoped write accidentally targets runtime/harness files.
- **Procedure**: Remove or regenerate only files under `029-stress-test-v1-0-4/`; do not modify runtime, harness, prior packets, or unrelated workspace changes.
<!-- /ANCHOR:rollback -->
