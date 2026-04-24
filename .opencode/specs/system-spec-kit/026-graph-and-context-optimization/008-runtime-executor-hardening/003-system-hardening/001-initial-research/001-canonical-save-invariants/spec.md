---
title: "...mization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/001-canonical-save-invariants/spec]"
description: "Deep-research sub-packet covering the SSK-RR-2 Tier 1 item from the 019 hardening charter. Enumerate every state write in the /memory:save pipeline, derive invariants, classify observed drift, and propose validator assertions. Wave 1 dispatch (infrastructure surfacing) per ADR-001 of 019/001."
trigger_phrases:
  - "canonical save invariants"
  - "memory save pipeline research"
  - "ssk-rr-2 invariants"
  - "h-56-1 invariant audit"
  - "graph-metadata invariant research"
  - "description.json invariant research"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/001-canonical-save-invariants"
    last_updated_at: "2026-04-18T17:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Research packet scaffolded"
    next_safe_action: "Dispatch /spec_kit:deep-research :auto"
    blockers: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Canonical-Save Pipeline Invariant Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Originating Source** | ../../../scratch/deep-review-research-suggestions.md §6 SSK-RR-2 |
| **Wave** | 1 (infrastructure surfacing) |
| **Dispatch** | `/spec_kit:deep-research :auto` |

After the H-56-1 fix shipped in phase 016/002, the canonical `/memory:save` path writes through four state layers: frontmatter `_memory.continuity` → `description.json` → `graph-metadata.json` → memory vector index. No single invariant spec connects these layers. Root validator runs already surface drift classified as "benign clock skew" (`CONTINUITY_FRESHNESS deltaMs=-8455798`). Without an invariant catalogue, that classification is unverified — the skew may be benign or it may mask state divergence that only appears under specific write orderings.

This packet runs the canonical sk-deep-research workflow to enumerate every state write, derive the intended invariants, observe actual invariant holding across the 26 active 026-tree packets, and classify divergences as expected / benign / latent / real.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (infrastructure integrity; could surface P0 if state divergence is real) |
| **Status** | Spec Ready, Awaiting Dispatch |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` (019-system-hardening/001-initial-research) |
| **Iteration Budget** | 12-15 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `/memory:save` pipeline writes across four state layers after H-56-1. Intended invariants include (non-exhaustive):
- `description.json.lastUpdated` should equal the max of `frontmatter._memory.continuity.last_updated_at` across packet docs.
- `graph-metadata.json.derived.status` should match the shipped state of the packet (complete / in_progress / planned).
- Memory index entries should point to valid packet docs without stale path references.
- `graph-metadata.json.derived.save_lineage` (added in phase 018 R6-R7) should tag freshness claims without relying solely on timestamp subtraction.

Observed drift: `CONTINUITY_FRESHNESS deltaMs=-8455798` (continuity timestamp newer than graph-metadata by 2.3 hours) on the 026 root — currently classified as "benign clock skew." The 026 recursive validation also surfaces `EVIDENCE_MARKER_LINT: 1 malformed` and `SPEC_DOC_INTEGRITY: 15 references missing`. These could be expected (skill-tree paths missing from this checkout) or latent (invariant violations masquerading as expected drift).

### Purpose

Produce a complete invariant catalogue for the canonical-save pipeline, with empirical classification of every observed divergence across the 26 active 026 packets. Output: validator assertion proposals + migration notes for existing packet-local drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Enumerate every state write performed during `/memory:save` (both plan-only and full-auto modes).
- Catalogue fields touched in frontmatter `_memory.continuity`, `description.json`, `graph-metadata.json.derived.*`, memory index rows, checkpoint state.
- Derive the intended invariants across those writes (cross-layer constraints, ordering constraints, monotonicity constraints).
- Observe actual invariant holding across the 26 active 026-tree packets.
- Classify each divergence: expected (docs say so), benign (harmless artifact), latent (could mask real bug), real (drops state).
- Propose validator assertions (as enhancements to `CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`) with migration notes for packet-local drift.

### 3.2 Out of Scope

- Code changes to the save pipeline. This is a research pass; remediation belongs to a sibling implementation child (e.g., `019/002-canonical-save-hardening`).
- Non-canonical save paths (legacy `memory/*.md` writes were retired in phase 014).
- External-tree invariants (memory index backends, SQLite schema).

### 3.3 Files to Read (research inputs)

- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (especially the H-56-1 fix at `:1259` dead-code guard and `:1333` plan-only gate)
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`
- Validator rules: `CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`
- Sample of 26 active 026 packet `description.json` + `graph-metadata.json` + continuity frontmatter blocks
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Invariant catalogue must cover all four state layers | research.md §Invariant Catalogue lists at least one invariant per layer (frontmatter, description.json, graph-metadata, memory index) |
| REQ-002 | Every observed divergence across the 26 active 026 packets must be classified | research.md §Observed Divergences table has classification column for every row |
| REQ-003 | P0 findings (real state drops) must trigger parent packet escalation | If P0 surfaces, `_memory.continuity.blockers` on this packet must include the finding ID immediately |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Proposed validator assertions must be implementable without breaking existing packet state | research.md §Proposed Assertions notes migration path for each new assertion |
| REQ-005 | H-56-1 fix scope must be verified as correct post-ship | research.md §H-56-1 Verification section explicitly confirms or challenges the fix |
| REQ-006 | Code-graph events must be emitted per iteration | `deep-research-state.jsonl` rows contain `graphEvents` field |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** the iteration loop reaches convergence, **when** the user opens the research.md output, **then** the Invariant Catalogue lists every cross-layer constraint with source-code citations.

**Given** a divergence is classified as "latent", **when** the user reads its row, **then** the evidence shows a specific pathway through which it could mask state loss.

**Given** a divergence is classified as "real", **when** the user reads the next_safe_action continuity field, **then** it points to a P0 escalation.

**Given** the H-56-1 fix is audited, **when** iteration findings are read, **then** the fix is either confirmed structurally correct or specific regression conditions are documented.

**Given** the validator assertion proposals are written, **when** reviewed for migration safety, **then** each includes a dry-run strategy against existing packet state.

**Given** code-graph signals are emitted, **when** `deep_loop_graph_convergence` is called, **then** the graph reports a stop signal that corroborates inline newInfoRatio convergence.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Convergence verdict written to `implementation-summary.md §Findings` within the 15-iteration budget.
- **SC-002**: research.md contains the Invariant Catalogue, Observed Divergences, Proposed Assertions, and H-56-1 Verification sections.
- **SC-003**: Any P0 finding triggers immediate parent packet notification via `_memory.continuity.blockers`.
- **SC-004**: Parent packet (`019/001`) findings registry receives this packet's consolidated output after convergence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical `/spec_kit:deep-research :auto` command | High | Gate 4; no workaround |
| Dependency | `cli-codex gpt-5.4 high fast` executor availability | Medium | Fallback to native via ADR in phase 017 |
| Risk | Research surfaces real state divergence (P0) | High | REQ-003 + continuity-block update + parent escalation |
| Risk | Iteration budget exhausted before convergence | Medium | Parent packet can extend budget or accept partial convergence per ADR-001 of 019/001 |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Iteration state machine is canonical; no custom state outside `deep-research-state.jsonl`.
- **NFR-R02**: Findings registry is write-once-per-iteration; amendments append revision blocks.

### Security

- **NFR-S01**: Research artifacts stay local to `research/` tree. No external publication.

---

## L2: EDGE CASES

- If `generate-context.ts` itself is broken, record the failure as a P0 finding and halt downstream packets in the wave.
- If canonical-save produces inconsistent results across runs, capture both runs as evidence and classify the non-determinism as latent.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Four-layer state write enumeration |
| Risk | 14/25 | Could surface real data-integrity P0 |
| Research | 18/20 | Pure research wave |
| Multi-Agent | 4/15 | Single executor |
| Coordination | 8/15 | Parent-child plus cross-packet findings |
| **Total** | **59/100** | **Level 2 appropriate** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-001**: Does `generate-context.js` re-use the H-56-1-guarded code path on the plan-only dispatch path? Research must confirm whether the fix fully closed the metadata no-op or if a plan-only variant still silently drops writes.
- **Q-002**: What threshold distinguishes "benign clock skew" from "real state divergence" in `CONTINUITY_FRESHNESS`? The current >0-second tolerance is heuristic.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` (contains dispatch command)
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Packet**: `../spec.md`
- **Scratch Source**: `../../../scratch/deep-review-research-suggestions.md` §6 Tier 1 SSK-RR-2
