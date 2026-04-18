---
title: "Feature Specification: Canonical-Save Hardening (P0 #1 + P0 #2 + validator rules)"
description: "Fix two P0 defects surfaced by 019/001/001 canonical-save research: (P0 #1) repair 007/008/009/010 packet roots missing spec.md; (P0 #2) save_lineage runtime parity via wrapper+dist rebuild. Then roll out 5 new validator assertions with grandfathering."
trigger_phrases:
  - "canonical save hardening"
  - "save lineage fix"
  - "007 008 009 010 packet root repair"
  - "canonical save validator rules"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/002-canonical-save-hardening"
    last_updated_at: "2026-04-18T23:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Remediation child scaffolded from 019/001/001 research findings"
    next_safe_action: "Dispatch /spec_kit:implement :auto with cli-codex gpt-5.4 high fast"
    blockers: []

---
# Feature Specification: Canonical-Save Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Research** | ../001-initial-research/001-canonical-save-invariants/research.md |
| **Priority** | P0 |
| **Dispatch** | `/spec_kit:implement :auto` with cli-codex gpt-5.4 high fast |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (runtime parity defect + structural gaps) |
| **Status** | Spec Ready, Awaiting Implementation |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` |
| **Estimated Effort** | 3-5 days |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Research 019/001/001 surfaced two P0 defects:

**P0 #1**: Four active coordination-parent packet roots carry `description.json` and `graph-metadata.json` without a root `spec.md`:
- `026/007-release-alignment-revisits/`
- `026/008-cleanup-and-audit/`
- `026/009-playbook-and-remediation/`
- `026/010-search-and-routing-tuning/`

Their `graph-metadata.json.derived.source_docs` is `[]` because no root `spec.md` exists to seed it. Parent packet contract at `026 spec.md:131-132` explicitly states local directories do not become packet phases unless they contain a valid root `spec.md`. These are live defects, not archival drift.

**P0 #2**: `save_lineage` writeback bug from source/runtime parity mismatch:
- Source `workflow.ts:1434-1450` passes `saveLineage: 'same_pass'` to `refreshGraphMetadata()`
- Public indexing wrapper `indexing.ts:95-97` accepts only `specFolder: string` — discards refresh options
- Built workflow at `dist/core/workflow.js:1163-1167` calls `refreshGraphMetadata(validatedSpecFolderPath)` with no second argument
- Built parser at `dist/lib/graph/graph-metadata-parser.js:848-860` omits `save_lineage` field entirely
- Built schema at `dist/lib/graph/graph-metadata-schema.js:27-39` omits field

Result: even fresh canonical saves (e.g., on `019-system-hardening` itself) never persist `save_lineage`. The runtime contract differs from the source contract.

### Purpose

Close both P0 defects. First restore runtime parity (Wave A: lineage). Second repair the four structural gaps (Wave B: packet roots). Third roll out 5 new validator assertions with grandfathering (Wave C: validator).

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

**Wave A — Save-lineage runtime parity:**
- Widen `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts` to accept and forward `GraphMetadataRefreshOptions` including `saveLineage`
- Rebuild dist for `workflow`, `graph-metadata-parser`, `graph-metadata-schema`
- Add regression coverage at workflow + indexing API layers asserting `save_lineage: 'same_pass'` on fresh canonical saves

**Wave B — Packet-root remediation (007/008/009/010):**
- Add minimal coordination-parent root `spec.md` to each of 007/008/009/010 describing the packet role + source_docs references
- Rebuild graph metadata for each so `derived.source_docs` is no longer empty
- Re-run generate-context.js for each to refresh description.json

**Wave C — Validator assertions:**
- Add 5 new rules to `scripts/spec/validate.sh`:
  - `CANONICAL_SAVE_ROOT_SPEC_REQUIRED` (ERROR with 007-010 allowlist until Wave B)
  - `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED` (ERROR with same allowlist)
  - `CANONICAL_SAVE_LINEAGE_REQUIRED` (WARNING before Wave C, ERROR after cutoff)
  - `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` (WARNING only)
  - `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS` (WARNING only)

### 3.2 Out of Scope

- Rewriting the save pipeline itself
- Broadening the audit beyond the 026 tree
- Reconstructing historical lineage for pre-fix packets

### 3.3 Files to Change

- `mcp_server/api/indexing.ts`
- `scripts/dist/core/workflow.js` (rebuild)
- `mcp_server/dist/lib/graph/graph-metadata-parser.js` (rebuild)
- `mcp_server/dist/lib/graph/graph-metadata-schema.js` (rebuild)
- `026/007-release-alignment-revisits/spec.md` (create)
- `026/008-cleanup-and-audit/spec.md` (create)
- `026/009-playbook-and-remediation/spec.md` (create)
- `026/010-search-and-routing-tuning/spec.md` (create)
- `scripts/spec/validate.sh` (add 5 rules)
- `scripts/rules/check-canonical-save.sh` (new)
- Regression tests in `mcp_server/tests/`

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers (MUST complete)

- **R1** (Wave A): `save_lineage` persists to `graph-metadata.json.derived.save_lineage` on every fresh canonical save via the shipped dist runtime
- **R2** (Wave A): Regression coverage asserts `save_lineage: 'same_pass'` at workflow + indexing layers
- **R3** (Wave B): Each of 007/008/009/010 has a valid root `spec.md` and non-empty `derived.source_docs`
- **R4** (Wave C): 5 new validator rules pass strict-mode on the active packet set (with grandfathering)

### 4.2 P1 - Required

- **R5**: No regression on existing validator suite (all prior rules still pass on 026 tree)
- **R6**: Commit+push after each Wave completion

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Fresh canonical save on any active packet persists `save_lineage` field
- [ ] `validate.sh --strict` passes on 007/008/009/010 post-Wave B
- [ ] 5 new validator rules report expected failures on synthetic broken fixtures and pass on current active packets (with allowlist)
- [ ] Regression test suite passes
- [ ] Checklist fully verified with evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Dist rebuild breaks other consumers | Re-run full regression suite; compare pre/post snapshots |
| 007-010 root-doc shape controversial | Use minimal coordination-parent template; allow later enhancement |
| Validator rule false-positives on legitimate drift | Phased severity (WARNING → ERROR) with cutoff-based promotion |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- Exact release cutoff timestamp for `CANONICAL_SAVE_LINEAGE_REQUIRED` ERROR promotion — decide during implementation
- Coordination-parent root-doc shape: minimal `spec.md` vs coordination-oriented template — implementation chooses
<!-- /ANCHOR:open-questions -->
