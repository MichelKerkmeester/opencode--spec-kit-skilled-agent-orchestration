---
title: "Decision Record: skill references assets alignment [template:level_3/decision-record.md]"
description: "Audit-boundary decision for stale versus legitimate terminology during the Round 5 skill reference and asset sweep."
trigger_phrases:
  - "skill references assets alignment decisions"
  - "round 5 audit boundary"
  - "stale versus legitimate references"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "scaffold/005-skill-references-assets-alignment"
    last_updated_at: "2026-05-02T06:36:10Z"
    last_updated_by: "codex"
    recent_action: "Accepted audit boundary ADR"
    next_safe_action: "Apply stale-reference triage"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/SKILL.md"
      - ".opencode/skill/system-spec-kit/references/"
      - ".opencode/skill/system-spec-kit/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-references-assets-alignment"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Literal manifest directory references are allowed"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: skill references assets alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Audit boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-02 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The audit must remove stale template-system vocabulary without deleting live, concrete references that still describe actual files or runtime concepts. The risk runs both ways: stale references mislead agents, while over-cleaning removes useful implementation detail.

### Constraints

- Stale lines must be deleted or rewritten, not archived in comments.
- Historical spec folders outside this packet are out of scope.
- Private manifest documentation is allowlisted outside the user-facing audit scope.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: classify each hit as stale, concrete, or historical before editing.

**How it works**: User-facing prose must not reference `compose.sh`, `wrap-all-templates`, `templates/level_N/`, `templates/core/`, `templates/addendum/`, `templates/phase_parent/`, or the retired `CORE + ADDENDUM v2.2` architecture name. Literal `templates/manifest/` directory references and `spec-kit-docs.json` references remain valid. The words `kind` and `capability` remain valid when they describe actual schema, MCP, agent, or workflow concepts rather than retired template architecture naming.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Contextual triage** | Preserves accurate concrete docs while removing stale guidance | Requires reading surrounding context for every hit | 9/10 |
| Blind grep deletion | Fast and simple | Likely deletes live manifest and schema documentation | 3/10 |
| Leave ambiguous hits untouched | Lowest immediate risk | Allows stale prose to survive | 4/10 |

**Why this one**: The packet is a documentation alignment audit, not a vocabulary purge. Contextual triage is the smallest approach that meets the zero-stale requirement without corrupting accurate docs.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Audit decisions are explainable when a grep hit remains for a legitimate reason.
- User-facing references stop teaching deleted paths and retired architecture names.

**What it costs**:
- The audit takes longer than a raw search-and-replace. Mitigation: inspect only hit contexts and prioritize high-traffic docs if time runs short.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legitimate concrete terminology looks suspicious in grep output | M | Record reasoning in the implementation summary |
| Stale references hidden outside the initial regex survive | M | Pair stale-pattern grep with banned-vocabulary triage |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The user explicitly required stale versus legitimate triage |
| 2 | **Beyond Local Maxima?** | PASS | Blind deletion and laissez-faire alternatives were compared |
| 3 | **Sufficient?** | PASS | The boundary covers all named stale patterns and allowlisted terms |
| 4 | **Fits Goal?** | PASS | Directly supports zero stale user-facing prose |
| 5 | **Open Horizons?** | PASS | Future packets can reuse this boundary without reopening the vocabulary debate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Apply contextual triage to every stale-pattern and banned-vocabulary hit in the in-scope docs.
- Delete or rewrite stale lines and sections.
- Preserve concrete manifest, schema, MCP, and workflow terminology.

**How to roll back**: Revert the 005 packet doc edits and any in-scope skill reference or asset edits from this packet.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
