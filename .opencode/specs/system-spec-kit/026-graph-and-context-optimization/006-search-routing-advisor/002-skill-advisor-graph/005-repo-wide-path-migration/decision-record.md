---
title: "Decision Record: Repo-Wide Path Migration"
description: "Packet-closeout ADR for template restoration, prose-based history retention, and evidence-backed completion."
trigger_phrases:
  - "005-repo-wide-path-migration"
  - "path migration decisions"
  - "packet closeout adr"
importance_tier: "important"
contextType: "decisions"
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/005-repo-wide-path-migration"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "gpt-5"
    recent_action: "Recorded closeout ADR"
    next_safe_action: "Keep as rationale record"
    key_files: ["decision-record.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
# Decision Record: Repo-Wide Path Migration

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Close Phase 005 Through Packet Repair and Prose-Based Historical Cleanup

### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-04-13 |
| Deciders | User, GPT-5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The repo-wide skill-advisor path migration was already shipped across runtime scripts, playbooks, READMEs, changelog notes, and graph metadata. Phase 005 still remained open because the packet itself was incomplete, structurally invalid, and still repeated forbidden literal references to the retired layout inside the broader `011-skill-advisor-graph/` tree.

### Constraints

- Edit scope is limited to packet docs and packet JSON needed for closeout.
- The full `011-skill-advisor-graph/` root must satisfy the grep-zero requirement for the two forbidden legacy patterns.
- Completion claims must be backed by direct repo evidence and command output.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat Phase 005 as packet-closeout work, rebuild the packet on the active Level 3 scaffold, and rewrite historical notes in prose so the migration story survives without repeating the forbidden literal legacy strings.

**How it works**: The packet now records shipped repo evidence instead of planning more migration work. The sibling historical notes describe the retired shared scripts layout in plain language, while runtime verification, packet validation, and scoped grep provide the closeout proof.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Packet repair plus prose cleanup** | Satisfies validation and grep-zero together | Requires rewriting multiple packet docs | 9/10 |
| Keep the packet invalid and rely on repo state only | Avoids doc rewrite | Leaves Phase 005 unusable as a packet | 2/10 |
| Remove all historical notes | Simplifies grep cleanup | Loses migration context and packet continuity | 4/10 |

**Why this one**: It is the only option that keeps the packet truthful, recoverable, and compliant with the explicit grep-zero requirement.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Phase 005 becomes a valid Level 3 closeout packet.
- Future agents inherit packet docs that match the shipped repo state.

**What it costs**:
- Historical notes are less literal than before. Mitigation: keep the prose precise about the retired layout and the live `skill-advisor/scripts/*` contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future 007 doc reintroduces a forbidden literal | High | Keep the scoped grep gate in closeout evidence |
| Packet evidence drifts from repo truth | High | Re-run validation and runtime commands before final closeout |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet failed strict validation and grep-zero requirements |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives were considered: ignore packet drift, remove history, or repair and rephrase |
| 3 | **Sufficient?** | PASS | Template restoration plus prose cleanup addresses both closeout gates |
| 4 | **Fits Goal?** | PASS | The user requested packet-only closeout with zero forbidden matches under `007/` |
| 5 | **Open Horizons?** | PASS | Future packet maintenance can reuse the same pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Restore `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` to the active Level 3 scaffold.
- Add `decision-record.md` and `implementation-summary.md`.
- Normalize `graph-metadata.json` and refresh `description.json`.
- Rephrase the sibling `../003-skill-advisor-packaging/` notes that still used forbidden literals.

**How to roll back**: Restore the previous packet docs, rerun strict validation, and accept that Phase 005 will remain open until the packet is rebuilt and the grep-zero cleanup is re-applied.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
