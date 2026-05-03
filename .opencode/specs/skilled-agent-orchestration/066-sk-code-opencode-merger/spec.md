---
title: "Feature Specification: sk-code-opencode-merger"
description: "Plan-only packet for merging sk-code-opencode into sk-code, removing Go and React/NextJS branches from sk-code, and auditing all downstream references before implementation."
trigger_phrases:
  - "sk-code-opencode merger"
  - "merge sk-code-opencode into sk-code"
  - "remove go react from sk-code"
  - "single sk-code"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/066-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T11:04:06Z"
    last_updated_by: "codex"
    recent_action: "Created plan-only Level 3 spec from analysis of sk-code and sk-code-opencode"
    next_safe_action: "Await implementation approval"
    blockers:
      - "User explicitly requested DO NOT IMPLEMENT during planning"
    key_files:
      - ".opencode/skill/sk-code/SKILL.md"
      - ".opencode/skill/sk-code-opencode/SKILL.md"
      - ".opencode/skill/sk-code-review/SKILL.md"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660660"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Should historical changelogs under sk-code-opencode be moved into sk-code, archived, or left as historical release artifacts?"
      - "Should generated telemetry JSONL be rewritten or left as historical measurement evidence?"
    answered_questions:
      - "Implementation is out of scope for this turn."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet plans the consolidation of the current `sk-code-opencode` OpenCode-system-code standards skill into the single remaining `sk-code` skill. The intended end state is one multi-stack `sk-code` that demonstrates how end users can combine stack branches by merging a language/system-code branch into the umbrella router, while removing the existing Go and React/NextJS placeholder branches from `sk-code`.

**Key Decisions**: do not implement during this packet, merge OpenCode standards into `sk-code` as a first-class route, remove Go and React/NextJS placeholder routes, rewrite downstream references away from the old overlay model.

**Critical Dependencies**: skill advisor routing data, runtime agent instructions, command YAMLs, `sk-code-review` overlay contract, README/install guide inventories, and verification tests that currently assert `sk-code-opencode`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft plan, implementation blocked by user instruction |
| **Created** | 2026-05-03 |
| **Branch** | `scaffold/066-sk-code-opencode-merger` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code` currently advertises itself as an umbrella application-code router with Webflow, Go, and React/NextJS branches, while `sk-code-opencode` separately owns OpenCode system-code standards. That split now works against the desired end-user model: one visible `sk-code` should demonstrate multi-stack extension by absorbing OpenCode system-code routing, not by keeping a sibling standards skill.

The caveat is that `sk-code-opencode` is not isolated. Exact references exist in global/project instructions, runtime agent definitions, `spec_kit` command assets, CLI skills, `sk-code-review`, skill advisor scoring lanes, tests, READMEs, install guides, generated skill graphs, and historical changelogs.

### Purpose

Create an implementation-ready plan that explains what must change, what must be checked, and which file paths are in blast radius before any merge or removal happens.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Analyze `.opencode/skill/sk-code-opencode` and `.opencode/skill/sk-code`.
- Plan removal of Go and React/NextJS placeholder branches from `sk-code`.
- Plan merge of OpenCode standards resources, checklists, and verifier scripts into `sk-code`.
- Identify every active file path that is affected or must be checked before implementation.
- Document downstream reference classes: agents, commands, README/install guides, skills, advisor code, tests, metadata, and historical/generated artifacts.

### Out of Scope

- Implementation edits outside this spec folder. The user explicitly said `DO NOT IMPLEMENT`.
- Deleting or moving `sk-code-opencode` in this turn.
- Rewriting historical archived specs unless an implementation decision later chooses to update live indexes.
- Running semantic CocoIndex search. Startup context says CocoIndex is missing; exact `rg` and memory retrieval were used instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/spec.md` | Create | Planning specification |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/plan.md` | Create | Implementation plan only |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/tasks.md` | Create | Future implementation task list |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/checklist.md` | Create | Planning and future verification checklist |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md` | Create | ADR for the consolidation approach |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md` | Create | Detailed blast-radius path map |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md` | Create | Planning-only summary, no implementation claim |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Respect plan-only scope | No non-spec runtime files are edited in this turn |
| REQ-002 | Produce a detailed resource map | `resource-map.md` lists affected and checked paths by category |
| REQ-003 | Identify core merge work | Plan explains how `sk-code-opencode` resources would enter `sk-code` |
| REQ-004 | Identify removal work | Plan lists Go and React/NextJS branches and router references to remove from `sk-code` |
| REQ-005 | Identify reference fallout | Plan covers agents, commands, READMEs, install guides, skills, advisor code, tests, metadata, and generated artifacts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve current OpenCode standards capability | Future `sk-code` route must still cover JS, TS, Python, Shell, and JSON/JSONC |
| REQ-007 | Preserve alignment verifier behavior | Future verifier path and docs must remain runnable after relocation |
| REQ-008 | Rewrite the baseline/overlay contract | Agents and review skills stop requiring one `sk-code-*` overlay when only one `sk-code` remains |
| REQ-009 | Update skill advisor routing | Advisor fixtures, scoring lanes, skill graph, and hook tests no longer emit `sk-code-opencode` as a live skill |
| REQ-010 | Document end-user multi-stack pattern | `sk-code` docs explain that a multi-stack skill is made by adding a route/resource branch into `sk-code`, using this merger as the example |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plan identifies `sk-code-opencode` as a first-class route to merge into `sk-code`, not as a sibling overlay to keep.
- **SC-002**: The plan identifies Go and React/NextJS removal surfaces: `references/go`, `assets/go`, `references/nextjs`, `assets/nextjs`, and router references in `SKILL.md`, `README.md`, and `references/router/*`.
- **SC-003**: The resource map lists exact active file paths found by analysis, including commands, agents, skill advisor code/tests, docs, and skill files.
- **SC-004**: The packet does not modify runtime skill, command, agent, advisor, or README files.
- **SC-005**: **Given** a future implementer starts from this packet, **When** they open `resource-map.md`, **Then** they can see every planned path category before editing.
- **SC-006**: **Given** a future implementer removes `sk-code-opencode`, **When** they run exact reference search, **Then** no live references to the removed skill remain outside intentional historical artifacts.
- **SC-007**: **Given** a future implementer removes Go/React branches, **When** they inspect `sk-code`, **Then** stack detection no longer routes `GO` or `NEXTJS`.
- **SC-008**: **Given** a future implementer updates skill advisor tests, **When** hook/advisor tests run, **Then** expected skill labels align to the new `sk-code` route.
- **SC-009**: **Given** an end user reads `sk-code`, **When** they want a multi-stack skill, **Then** they see the pattern: add resource domains and routing branches inside `sk-code`, rather than creating sibling `sk-code-*` skills.
- **SC-010**: **Given** generated metadata references old skill IDs, **When** implementation completes, **Then** generated graphs/descriptions are refreshed or intentionally marked historical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Skill advisor scorer and fixtures | Routing may keep recommending deleted `sk-code-opencode` | Update scorer lanes, skill graph, fixtures, hook tests, and regression cases together |
| Dependency | Runtime agent copies | OpenCode, Claude, Codex, and Gemini agents may drift | Update all four runtime agent sets in one verification phase |
| Dependency | `sk-code-review` overlay contract | Formal review may continue looking for a non-existent overlay | Replace baseline plus overlay language with single `sk-code` plus detected route evidence |
| Risk | Historical changelogs and telemetry contain old names | Exact searches will still show old references | Decide whether to leave as historical, move under archive, or annotate in resource map |
| Risk | Removing Go/React from `sk-code` changes agent behavior | `@code` currently treats GO/NEXTJS as supported stacks | Rewrite supported-stack docs and UNKNOWN escalation language at the same time |
| Risk | Verifier path changes break docs | Existing docs call `.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py` | Move script into `sk-code/scripts/` and update every command example |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Skill advisor routing should not add extra runtime lookup cost; consolidation should reduce skill selection ambiguity.

### Security

- **NFR-S01**: The merge must preserve prompt-injection safeguards in advisor fixture tests and shared payload tests that currently mention `sk-code-opencode`.

### Reliability

- **NFR-R01**: After implementation, no live runtime agent should instruct a worker to load a deleted skill.

---

## 8. EDGE CASES

### Historical Artifacts

- Changelogs and generated telemetry may intentionally preserve `sk-code-opencode` as history. The implementation must classify these as `historical` or update them deliberately.

### Generated Data

- `skill-graph.json`, `graph-metadata.json`, descriptions, and telemetry outputs may be regenerated instead of manually patched. The implementation plan must say which.

### Multi-Runtime Drift

- The same agent concept exists in `.opencode/agent`, `.claude/agents`, `.codex/agents`, and `.gemini/agents`. Updating only one runtime would leave conflicting instructions.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Two skill trees, four runtime agent trees, commands, tests, docs, generated metadata |
| Risk | 20/25 | Routing breakage, deleted-skill references, verification script relocation |
| Research | 16/20 | Exact reference inventory and prior spec review needed |
| Multi-Agent | 8/15 | Future implementation may parallelize by surface, but this packet is single-agent planning |
| Coordination | 13/15 | Skill advisor, review contract, and runtime agent docs must land together |
| **Total** | **79/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Advisor keeps recommending `sk-code-opencode` after deletion | High | High | Update scorer lanes, skill graph, fixtures, and hook tests in one phase |
| R-002 | `@code` rejects OpenCode system code because `sk-code` still thinks only app stacks are supported | High | Medium | Add `OPENCODE` or equivalent route before removing the sibling skill |
| R-003 | `sk-code-review` still requires an overlay | High | High | Rewrite review contract to load `sk-code-review` plus `sk-code` route evidence |
| R-004 | Go/React placeholder branches leave stale route entries | Medium | High | Remove folders and exact route constants together |
| R-005 | Historical refs make cleanup look incomplete | Medium | Medium | Explicitly classify archive/changelog/telemetry handling before implementation |

---

## 11. USER STORIES

### US-001: Single sk-code Skill (Priority: P0)

**As a** repository maintainer, **I want** one `sk-code` skill to own code standards and code-work routing, **so that** users do not have to understand sibling `sk-code-*` overlays.

**Acceptance Criteria**:
1. Given the old `sk-code-opencode` route, When implementation completes, Then OpenCode system-code standards are accessible through `sk-code`.

---

### US-002: Remove Placeholder Stacks (Priority: P0)

**As a** skill maintainer, **I want** Go and React/NextJS placeholder material removed from `sk-code`, **so that** the skill only advertises live or intentionally supported branches.

**Acceptance Criteria**:
1. Given `sk-code` stack detection, When a Go or NextJS marker appears after implementation, Then `sk-code` no longer claims those placeholder branches as supported without a new approved route.

---

### US-003: Reference-Safe Migration (Priority: P1)

**As a** future implementer, **I want** a complete path ledger, **so that** I can update every command, agent, README, skill, advisor, and test reference without blind spots.

**Acceptance Criteria**:
1. Given the resource map, When a path mentions `sk-code-opencode` or the overlay contract, Then it is classified for update, removal, regeneration, or historical retention.

---

## 12. OPEN QUESTIONS

- Should `sk-code-opencode/changelog/*` move into `sk-code/changelog/`, remain historical in a removed folder archive, or be summarized in one merger changelog?
- Should telemetry JSONL files containing `sk-code-opencode` be rewritten, regenerated, or left immutable as measurement history?
- Should the merged route be named `OPENCODE`, `SYSTEM_CODE`, or something more general like `TOOLING` inside `sk-code`?
- Should generic Node.js system-code work route to the new OpenCode branch or stay UNKNOWN unless under `.opencode/`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Resource Map**: See `resource-map.md`
