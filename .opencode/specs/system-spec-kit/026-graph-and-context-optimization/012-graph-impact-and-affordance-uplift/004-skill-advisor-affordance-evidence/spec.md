---
title: "Feature Specification: Skill Advisor Affordance Evidence (012/004)"
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Wire tool, resource, and MCP-resource affordances into existing derived and graph-causal lanes via an allowlist normalizer. No new scoring lane, entity kind, or relation type is introduced."
trigger_phrases:
  - "012 affordance evidence"
  - "skill advisor affordance"
  - "tool resource routing evidence"
  - "affordance normalizer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence"
    last_updated_at: "2026-04-25T14:03:00+02:00"
    last_updated_by: "copilot-gpt-5.5"
    recent_action: "Normalized spec doc"
    next_safe_action: "Review local commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "012/001 license audit approved clean-room adaptation"
---
# Feature Specification: Skill Advisor Affordance Evidence (012/004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-25 |
| **Branch** | `012/004-skill-advisor-affordance-evidence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill Advisor's compiler whitelist is intentionally limited to `skill`, `agent`, `script`, `config`, and `reference`. Tool and resource affordances can improve routing recall, but free-form descriptions could introduce prompt-stuffing input or leak private matched phrases if passed directly into scoring.

### Purpose

Add a privacy-preserving affordance normalizer so sanitized tool and resource hints can influence only the existing `derived_generated` and `graph_causal` lanes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `affordance-normalizer.ts` with typed allowlist filtering and privacy stripping.
- Add compile-time `derived.affordances[]` support as derived signals and existing sparse graph edges.
- Add score-time affordance support through `derived_generated` and `graph_causal` only.
- Add focused TypeScript and Python regression tests.
- Add per-packet feature catalog and manual testing playbook entries.

### Out of Scope

- New scoring lane, because RISK-05 requires reuse of existing routing lanes.
- New compiler entity kinds such as `tool` or `resource`, because the graph schema limit is deliberate.
- New relation types, because graph-causal weighting must reuse existing relation keys.
- Raw matched affordance phrase output, because recommendation payloads must preserve privacy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Create | Allowlist and privacy normalizer |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts` | Modify | Add affordance input option |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Modify | Normalize affordances before lane execution |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Modify | Consume sanitized triggers in `derived_generated` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Modify | Consume sanitized edges with existing multipliers |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Modify | Compile `derived.affordances[]` without new entity kinds |
| `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md` | Create | Document the capability |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md` | Create | Document manual verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004-1 | `affordance-normalizer.ts` exposes typed `normalize()` support for affordance inputs. | TypeScript imports compile and unit tests exercise allowlisted fields. |
| REQ-004-2 | Every score-time affordance path passes through the normalizer first. | `fusion.ts` normalizes `options.affordances` before lane scoring. |
| REQ-004-3 | Recommendation payloads do not include raw matched tool or resource phrases. | Privacy test asserts raw phrases are absent from scorer output. |
| REQ-004-4 | Compiler entity kinds remain exactly `skill`, `agent`, `script`, `config`, and `reference`. | Python test and static scan confirm the literal set. |
| REQ-004-5 | Graph-causal relations use only existing relation keys. | Static scan confirms `EDGE_MULTIPLIER` keys are unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004-6 | Affordance evidence appears only through `derived_generated` and `graph_causal`. | Lane-attribution test confirms no new lane appears. |
| REQ-004-7 | Affordance evidence improves recall without overpowering explicit author signals. | Routing fixture shows the candidate surfaces with affordances and explicit triggers still win. |
| REQ-004-8 | Per-packet docs describe the feature and manual test scenario. | Feature catalog and manual playbook entries both score DQI at least 85. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All T001 through T017 tasks are complete.
- **SC-002**: Focused affordance/native scorer Vitest checks pass.
- **SC-003**: Python Skill Advisor compiler tests pass.
- **SC-004**: `npm run typecheck` passes in `mcp_server`.
- **SC-005**: DQI is at least 85 for both new documentation entries.
- **SC-006**: Full `skill_advisor/tests/` attempt is recorded, with unrelated repository-health blockers identified if present.

### Acceptance Scenarios

1. **Given** an affordance with `name`, `triggers[]`, and `category`, when it is scored, then only sanitized trigger text contributes to `derived_generated`.
2. **Given** an affordance with free-form `description`, when it is normalized, then description text does not become a trigger.
3. **Given** an affordance relation using `dependsOn[]`, when graph-causal scoring runs, then the edge uses the existing `depends_on` multiplier.
4. **Given** a raw private phrase in an affordance, when recommendation output is inspected, then the raw phrase is absent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 012/001 license audit | Work must stay clean-room. | License was approved before implementation. |
| Risk | Prompt-stuffing through tool descriptions | Could contaminate routing evidence. | Ignore free-form descriptions and strip instruction-shaped strings. |
| Risk | Schema drift | New entities or relations could break graph invariants. | Static tests preserve entity and relation allowlists. |
| Risk | Local repository-health drift | Full Skill Advisor directory checks can fail outside this packet. | Record full-suite blockers and keep scoped regressions green. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Affordance matching stays lower weight than explicit author triggers.
- **NFR-P02**: Native scorer latency remains within existing native scorer test gates.

### Security

- **NFR-S01**: URLs, email addresses, token-shaped fragments, control characters, and instruction-shaped strings are stripped or dropped.
- **NFR-S02**: Public recommendation payloads use stable labels rather than raw matched affordance phrases.

### Reliability

- **NFR-R01**: Unknown affordance relation types do not affect scoring.
- **NFR-R02**: Empty or invalid affordance input yields no derived evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty input: normalizer returns no affordances.
- Maximum length: long phrases are truncated by sanitizer before scoring.
- Invalid format: non-object affordance inputs are ignored.

### Error Scenarios

- Unknown relation: skipped instead of assigned a fallback multiplier.
- Prompt-stuffing text: dropped if it matches instruction-shaped patterns.
- Private phrase: never exposed as a public evidence string.

### State Transitions

- Compile-time affordances become derived signals and sparse adjacency only.
- Score-time affordances remain request-local and do not mutate graph state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | TypeScript scorer, Python compiler, tests, and docs |
| Risk | 18/25 | Privacy and graph schema invariants are load-bearing |
| Research | 12/20 | pt-02 findings and license audit guided implementation |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
