---
title: "Feature Specification: sk-deep-research First [skilled-agent-orchestration/029-sk-deep-research-first-upgrade/spec]"
description: "Document the first upgrade pass for sk-deep-research based on comparative research into ResearcherSkill and autoresearch."
trigger_phrases:
  - "029"
  - "deep research"
  - "first upgrade"
  - "researcherskill"
  - "autoresearch"
importance_tier: "important"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/029-sk-deep-research-first-upgrade"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: sk-deep-research First Upgrade

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-26 |
| **Branch** | `029-sk-deep-research-first-upgrade` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The first sk-deep-research upgrade needed grounded input from comparable autonomous research systems. Without a documented comparison against ResearcherSkill and autoresearch, upgrade choices would lean on intuition instead of evidence.

### Purpose
Capture the research findings that identify which external patterns are worth adapting to sk-deep-research and which ones should remain out of scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Analyze the external references listed in `external_reference.md`.
- Synthesize the findings in `research/research.md`.
- Preserve the resulting upgrade priorities inside this spec packet.

### Out of Scope
- Implementing the upgrade in the skill runtime.
- Replacing the existing sk-deep-research loop architecture.
- Adding new runtime files outside this research packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/spec.md` | Create | Template-safe feature specification for the research packet |
| `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/plan.md` | Create | Research execution plan summarizing the completed approach |
| `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/tasks.md` | Create | Task ledger for the comparative research work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compare sk-deep-research against both external reference projects | `research/research.md` documents findings from both source repositories |
| REQ-002 | Preserve the core sk-deep-research strengths while identifying upgrades | The synthesis distinguishes direct transfers from ideas that require domain translation |
| REQ-003 | Produce actionable upgrade priorities | The research output includes ranked proposals and a rationale for each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Record the source artifacts used for the analysis | `external_reference.md` lists the two analyzed repositories |
| REQ-005 | Preserve research-state continuity | Memory and iteration artifacts remain available in the spec folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` explains what to adopt, what to defer, and why.
- **SC-002**: The packet keeps enough context for a later implementation pass without rereading the external repositories.
- **SC-003**: The created spec, plan, and tasks files reference the existing research artifacts cleanly.

### Acceptance Scenarios
1. **Given** the research packet is opened later, **when** a maintainer reads `spec.md` and `research/research.md`, **then** the top upgrade priorities are visible without hunting through scratch notes.
2. **Given** the source links are needed for verification, **when** a maintainer reads `external_reference.md`, **then** both analyzed repositories are listed explicitly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `research/research.md` | This spec depends on the research synthesis staying intact | Keep the packet references pointed at the committed research file |
| Dependency | `external_reference.md` | Missing source links would weaken traceability | Keep the external reference list alongside the packet |
| Risk | External patterns may not map cleanly to knowledge research | Directly copying code-optimization ideas could distort the upgrade | Keep the domain-translation caveat explicit in the packet |

<!-- ANCHOR:nfr -->
### Non-Functional Considerations
- Keep the repaired docs lightweight and traceable.
- Keep all claims tied to committed research artifacts inside this folder.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
### Edge Cases
- If a later implementation spec changes priorities, this packet should still remain a historical research record.
- If external repositories evolve, this packet should be read as a snapshot of the analyzed state at creation time.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
### Complexity Assessment
- Low implementation complexity inside this folder.
- Moderate research complexity because the upgrade ideas required domain translation.
<!-- /ANCHOR:complexity -->
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this repair pass. Future implementation questions should be tracked in the next upgrade packet rather than retrofitted here.
<!-- /ANCHOR:questions -->

---
