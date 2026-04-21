---
title: "Implementation Plan: Graph Metadata Enrichment"
description: "Packet-closeout plan for documenting the already-completed schema v2 enrichment across 21 skill metadata files and restoring Level 3 packet validity."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "graph metadata closeout plan"
  - "schema v2 packet plan"
importance_tier: "important"
contextType: "implementation"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T14:05:00Z"
    last_updated_by: "gpt-5.4"
    recent_action: "Replaced the packet plan with an evidence-backed closeout plan"
    next_safe_action: "Sync tasks, checklist, and packet metadata to the finished-state narrative"
    key_files: ["plan.md", "tasks.md", "checklist.md", "decision-record.md"]
---
# Implementation Plan: Graph Metadata Enrichment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON packet artifacts, plus Python validation commands |
| **Framework** | system-spec-kit Level 3 packet validation and skill-advisor metadata validation |
| **Storage** | Packet-local markdown, packet `graph-metadata.json`, and live `.opencode/skill/*/graph-metadata.json` evidence |
| **Testing** | Strict packet validation, corpus count check, metadata validation, regression harness |

### Overview

The live enrichment work is already complete, so this plan is a packet-closeout plan rather than an implementation plan for new runtime changes. The work here is to align packet docs and packet metadata with the shipped 21-file schema v2 corpus, replace stale examples with live ones, and record reproducible proof that the compiler still validates the enriched metadata.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The packet path is confirmed: `004-graph-metadata-enrichment/`.
- [x] Review findings and all packet docs were read before rewriting the packet.
- [x] The live `sk-deep-review` metadata file was inspected as the canonical example source.
- [x] The packet scope is limited to packet markdown and packet JSON artifacts.

### Definition of Done

- [x] The packet describes the work as complete across 21 live skill metadata files.
- [x] The schema example matches live `sk-deep-review` metadata.
- [x] `decision-record.md` exists and records the rollout decisions.
- [x] Strict packet validation exits `0` or `1`, and compiler validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-backed packet closeout.

### Key Components

- **Packet docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` provide the canonical closeout narrative.
- **Packet metadata**: `graph-metadata.json` and `description.json` provide packet identity and retrieval support.
- **Live evidence sources**: `../../../../../skill/sk-deep-review/graph-metadata.json`, `../../../../../skill/skill-advisor/graph-metadata.json`, and `review/deep-review-findings.md` prove the enrichment already shipped.
- **Validation entrypoints**: `../../../../../skill/skill-advisor/scripts/skill_graph_compiler.py` and the skill-advisor regression harness provide command-backed proof.

### Data Flow

The review findings and live metadata files establish the delivered state. Packet docs then summarize that delivered state, packet metadata captures the closeout surface for retrieval, and strict validation confirms the rewritten packet matches the active Level 3 contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the current packet docs and review findings.
- [x] Read the active Level 3 templates and a nearby compliant packet in the same track.
- [x] Read the live `sk-deep-review` metadata example and confirm the live skill corpus count is 21.

### Phase 2: Core Implementation

- [x] Rewrite `spec.md` so it documents completed work instead of planned work.
- [x] Rewrite `plan.md`, `tasks.md`, and `checklist.md` on the required scaffold.
- [x] Add `decision-record.md` with the requested ADRs.
- [x] Replace the malformed packet `graph-metadata.json` with a concrete packet-schema version.
- [x] Update `description.json` so it matches the completed 21-file closeout narrative.

### Phase 3: Verification

- [x] Run strict packet validation after the rewrite.
- [x] Run a corpus count check to confirm 21 live skill metadata files.
- [x] Run `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only`.
- [x] Run the skill-advisor regression harness to attach a reproducible verification command.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet headers, anchors, file presence, packet metadata schema | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| Corpus reality | Live skill metadata file count and schema v2 coverage | `find .opencode/skill -name graph-metadata.json`, Python corpus check |
| Metadata validation | Compiler validation over the enriched metadata corpus | `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` |
| Regression | Skill-advisor routing behavior after the metadata rollout | `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl --out .opencode/skill/skill-advisor/scripts/out/regression-report.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review/deep-review-findings.md` | Internal evidence source | Green | The packet would lose the audit baseline for the six findings |
| `../../../../../skill/sk-deep-review/graph-metadata.json` | Internal evidence source | Green | The packet example could drift from live metadata |
| `../../../../../skill/skill-advisor/scripts/skill_graph_compiler.py` | Internal validation tool | Green | Compiler validation proof cannot be attached |
| `../../../../../skill/skill-advisor/scripts/skill_advisor_regression.py` | Internal validation tool | Green | Regression proof cannot be attached |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal validation tool | Green | Packet closeout cannot be structurally verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet rewrite reintroduces stale counts, incorrect example fields, or strict-validation failures.
- **Procedure**: Restore the last validated packet state, then reapply only the evidence-backed packet-local edits before rerunning validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verification |
| Implementation | Setup | Verification |
| Verification | Setup, Implementation | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | Medium | 60-90 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **1.75-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-closeout Checklist

- [x] Packet scope is limited to docs and packet JSON in `004-graph-metadata-enrichment/`.
- [x] Live example data was read before the schema example was rewritten.
- [x] Validation commands are recorded in the plan before completion is claimed.

### Rollback Procedure

1. Restore the last known-good packet docs.
2. Reapply the count, schema example, and decision-record fixes only.
3. Rerun strict packet validation and compiler validation.
4. Reattach task and checklist evidence from current command output.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Review findings ─┐
Live metadata ───┼──► Packet docs ───► Strict validation
Packet metadata ─┘          │
Compiler checks ────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet docs | Review findings, templates, live metadata | Closeout narrative | Validation |
| Packet metadata | Packet docs | Searchable packet identity | Validation |
| Compiler validation | Live skill metadata corpus | Runtime proof | Checklist closure |
| Regression harness | Live skill-advisor runtime | Behavioral proof | Checklist closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Read the packet and live example metadata.
2. Rewrite the packet docs on the active scaffold.
3. Add the decision record and normalize packet metadata.
4. Run strict validation and compiler validation.

**Total Critical Path**: 4 sequential closeout stages.

**Parallel Opportunities**:
- Packet `description.json` and `graph-metadata.json` can be updated while the markdown packet rewrite is in progress.
- Corpus counting and regression verification can run once the packet text stabilizes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet narrative corrected | All packet docs describe completed 21-file enrichment | Phase 2 |
| M2 | Packet contract restored | `decision-record.md` exists and packet metadata matches the validator schema | Phase 2 |
| M3 | Closeout verified | Strict validation and compiler validation pass, with reproducible commands recorded | Phase 3 |
<!-- /ANCHOR:milestones -->
