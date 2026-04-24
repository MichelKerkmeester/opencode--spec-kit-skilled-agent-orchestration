<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
---
title: "Feature Specification: CLI Skill Prompt-Quality [skilled-agent-orchestration/043-cli-skill-improved-prompting/spec]"
description: "Add a lightweight prompt-quality layer to the four CLI orchestrator skills by using in-skill mirror cards for routine dispatches and an isolated improve-prompt agent for high-complexity escalations."
trigger_phrases:
  - "043"
  - "cli skill improved prompting"
  - "mirror cards"
  - "improve-prompt"
  - "prompt quality card"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-11T19:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented mirror-card prompt-quality routing and synced packet closeout docs"
    next_safe_action: "Commit validated packet and implementation surfaces on the 026 branch"
    blockers: []
    key_files:
      - ".opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/agent/improve-prompt.md"
      - ".opencode/command/improve/prompt.md"
    session_dedup:
      fingerprint: "sha256:043-cli-skill-improved-prompting"
      session_id: "043-cli-skill-improved-prompting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use local mirror cards instead of cross-skill paths because _guard_in_skill rejects ..-prefixed routes"
      - "Auto-select agent mode in /improve:prompt when complexity_hint >= 7 or isolation is requested"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: CLI Skill Prompt-Quality Integration via Mirror Cards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The four CLI orchestration skills currently build dispatch prompts ad hoc from their local prompt-template assets. That keeps dispatches lightweight, but it leaves framework choice, prompt-quality checks, and escalation behavior implicit. This packet adds a two-tier prompt-quality layer: a tiny guard-safe mirror card that every CLI skill can load by default, and a fresh-context `@improve-prompt` agent that handles only the hard cases.

**Key Decisions**: keep all routable assets inside each calling skill tree, use one canonical card in `sk-improve-prompt` plus four local mirrors, and route complexity-7+ or compliance-heavy prompts through a dedicated agent instead of inline full-skill loading.

**Critical Dependencies**: `sk-improve-prompt` framework/CLEAR source material, the existing `_guard_in_skill()` self-containment rule inside all CLI skills, current `/improve:prompt` command behavior, and parity across `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-11 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Spec Folder** | `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/` |
| **Primary Runtime Surface** | `.opencode/skill/cli-*`, `.opencode/skill/sk-improve-prompt/`, `.opencode/command/improve/prompt.md`, runtime agent mirrors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The CLI orchestrator skills currently rely on static prompt templates without a lightweight framework-selection or quality-check layer. The full `sk-improve-prompt` skill already contains the needed methodology, but loading its entire body on every dispatch would be too expensive, and cross-skill resource references are blocked by `_guard_in_skill()` plus same-skill markdown discovery.

### Purpose

Define and implement a guard-safe two-tier prompt-quality architecture that improves routine CLI dispatch prompts without paying the full `sk-improve-prompt` context cost, while still preserving an escalation path for complex or compliance-sensitive prompts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create one canonical prompt-quality card inside `sk-improve-prompt`.
- Create four short mirror prompt-quality cards inside the CLI skill trees.
- Update the four CLI skill definitions so the local card loads in the `ALWAYS` set and drives prompt-construction rules.
- Tag existing CLI prompt templates with framework annotations.
- Add a new `@improve-prompt` runtime agent across all active runtime directories.
- Update `/improve:prompt` so it can route either through inline skill loading or the isolated agent path.
- Document the new `sk-improve-prompt` agent-consumption contract and fast-path asset.
- Add a lightweight drift-detection shell check for prompt-quality-card mirror sync verification.

### Out of Scope

- Changing `skill_advisor.py`; existing routing is already sufficient.
- Introducing a shared cross-skill asset directory or any harness change to support `../` resource loading.
- Building a new template or regeneration engine for the four CLI skill definitions.
- Changing runtime code outside the skill, command, agent, and packet-local documentation surfaces named in this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-improve-prompt/assets/` | Create | Canonical prompt-quality card asset |
| `.opencode/skill/cli-claude-code/assets/` | Create | Claude Code local mirror asset |
| `.opencode/skill/cli-codex/assets/` | Create | Codex local mirror asset |
| `.opencode/skill/cli-copilot/assets/` | Create | Copilot local mirror asset |
| `.opencode/skill/cli-gemini/assets/` | Create | Gemini local mirror asset |
| `.opencode/skill/cli-claude-code/` | Modify | Add local card to resource domain, ALWAYS set, and prompt-construction rule |
| `.opencode/skill/cli-codex/` | Modify | Same pattern as Claude Code |
| `.opencode/skill/cli-copilot/` | Modify | Same pattern as Claude Code |
| `.opencode/skill/cli-gemini/` | Modify | Same pattern as Claude Code |
| `.opencode/skill/cli-*/assets/` | Modify | Add framework tags to existing templates |
| `.opencode/skill/sk-improve-prompt/` | Modify | Add agent contract, fast-path asset notes, and version bump |
| `.opencode/agent/` | Create | Primary OpenCode runtime agent surface |
| `.claude/agents/` | Create | Claude runtime mirror |
| `.codex/agents/` | Create | Codex runtime mirror |
| `.gemini/agents/` | Create | Gemini runtime mirror |
| `.opencode/command/improve/prompt.md` | Modify | Add dispatch-mode branch and agent routing documentation |
| `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh` | Create | Drift-check script that hashes the framework-selection table across the canonical card and four mirrors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create one canonical prompt-quality card in `sk-improve-prompt` | The canonical card exists and documents framework selection, task-to-framework mapping, CLEAR pre-dispatch checks, escalation triggers, failure patterns, and mirror ownership notes |
| REQ-002 | Keep every routable prompt-quality asset inside the calling skill tree | No CLI skill references `../sk-improve-prompt/...`; all routable card paths are local to each skill and pass the `_guard_in_skill()` self-containment rule |
| REQ-003 | Load the prompt-quality card in every CLI dispatch path | Each CLI skill adds the local prompt-quality card to the `ALWAYS` loading block and describes pre-dispatch framework selection plus CLEAR checks in its rules section |
| REQ-004 | Preserve the lightweight fast path | Routine CLI dispatches do not load the full `sk-improve-prompt` skill body; they use only the local mirror card and the existing skill-local prompt templates |
| REQ-005 | Add an escalation path for hard prompts | Complexity-7+, compliance/security-sensitive, multi-stakeholder, or ambiguous prompts route through a dedicated `@improve-prompt` agent and return a structured enhancement block |
| REQ-006 | Update `/improve:prompt` to share the same escalation surface | The command documents and supports both inline skill mode and agent-dispatch mode, with agent mode auto-selected when complexity signals require isolation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Tag every existing CLI prompt template with framework metadata | Each CLI prompt-template asset gains per-template `Framework:` tags that match the task-to-framework mapping |
| REQ-008 | Document the `sk-improve-prompt` agent-consumption contract | The `sk-improve-prompt` skill definition gains a stable input/output contract section for agent use plus a fast-path asset section |
| REQ-009 | Provide runtime parity across active agent directories | `@improve-prompt` exists in `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`, with Codex using TOML and the others using markdown mirrors |
| REQ-010 | Preserve current skill-advisor behavior | The packet explicitly leaves `skill_advisor.py` unchanged and documents why |
| REQ-011 | Add or explicitly defer mirror-drift detection | Either a lightweight fixture/check is added for card sync verification, or the implementation documents why the fixture was intentionally deferred |
| REQ-012 | Keep packet documentation aligned with the final architecture | Spec, plan, tasks, checklist, and decision record all describe the same fast-path/deep-path split and the same file inventory |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four CLI skills load a local prompt-quality card by default without violating the `_guard_in_skill()` invariant.
- **SC-002**: Routine CLI dispatches gain framework selection and CLEAR pre-check guidance with only a small context increase.
- **SC-003**: High-complexity or compliance-heavy prompts route through one shared `@improve-prompt` agent surface instead of inline full-skill loading.
- **SC-004**: `/improve:prompt` exposes both inline and agent dispatch modes so the command and CLI skills share one improvement surface.
- **SC-005**: Runtime mirrors for the new agent are available across every active runtime directory in this repo.
- **SC-006**: Verification proves local-card loading, no `..` routable paths, framework-tagged prompt templates, and documented escalation behavior.

### Acceptance Scenarios

1. **Given** a CLI skill dispatches a routine generation or review task, **when** Smart Routing loads resources, **then** the local prompt-quality card is present in the loaded context and the full `sk-improve-prompt` skill is not required.
2. **Given** a prompt trips complexity or compliance escalation signals, **when** the CLI skill constructs the request, **then** it routes through `@improve-prompt` and receives a structured response containing framework, CLEAR score, rationale, enhanced prompt, and escalation notes.
3. **Given** `/improve:prompt` runs with ordinary input, **when** no escalation signals are present, **then** it stays in inline skill mode.
4. **Given** `/improve:prompt` runs with complexity `>= 7` or explicit isolation preference, **when** dispatch mode is resolved, **then** it uses the same `@improve-prompt` agent path documented for the CLI skills.
5. **Given** maintainers inspect the packet docs later, **when** they compare spec, plan, tasks, checklist, and ADRs, **then** the mirror-card design, runtime-mirror requirement, and out-of-scope boundaries all match.
6. **Given** a maintainer checks runtime coverage, **when** they inspect the active runtime directories, **then** the packet clearly requires parity across OpenCode, Claude, Codex, and Gemini surfaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The framework and CLEAR reference material under `sk-improve-prompt/references/` remains the source of truth | High | Keep the canonical card derived from those sources and document it as the upstream source for mirrors |
| Dependency | `_guard_in_skill()` and `discover_markdown_resources()` keep enforcing same-tree markdown routing | High | Keep every routable card under the calling skill's own `assets/` directory |
| Dependency | `/improve:prompt` currently forbids agent dispatch | High | Update the command contract and setup flow before claiming agent-mode support |
| Risk | Mirror cards drift from the canonical card over time | Medium | Add sync footer hashes plus either a fixture or an explicit maintenance rule |
| Risk | Runtime mirrors diverge across `.opencode`, `.claude`, `.codex`, and `.gemini` | Medium | Mirror one canonical agent contract and verify all active runtime directories are updated together |
| Risk | CLI `ALWAYS` loading grows too large and defeats the fast-path goal | Medium | Keep each mirror card compact and avoid moving full framework prose into the mirror files |
| Risk | Escalation criteria become too broad and route most prompts through the agent | Medium | Keep escalation triggers explicit and limited to complexity, compliance, stakeholder spread, or ambiguity count |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The routine path should add only a small markdown card to existing CLI skill baseline loads, not the full `sk-improve-prompt` body.
- **NFR-P02**: Agent escalation latency is acceptable only for the non-routine path and must not become the default for ordinary prompts.

### Reliability

- **NFR-R01**: Local card paths must remain compatible with `_guard_in_skill()` and same-skill markdown discovery.
- **NFR-R02**: The `@improve-prompt` output contract must stay deterministic enough for command and skill callers to parse reliably.

### Maintainability

- **NFR-M01**: There is exactly one canonical upstream card and four intentionally short mirrors.
- **NFR-M02**: Runtime agent mirrors must keep the same behavioral contract even though their file formats differ.

### Security

- **NFR-S01**: Compliance/security-sensitive prompts must escalate instead of relying on the lightweight mirror path alone.
- **NFR-S02**: No agent or command change should weaken current sandbox or runtime-boundary expectations documented in existing agent formats.

---

## 8. EDGE CASES

- A CLI skill tries to route to `../sk-improve-prompt/assets/...`: this must fail planning review because `_guard_in_skill()` will raise on parent-directory traversal.
- A prompt is routine by task type but contains one compliance-sensitive requirement: compliance wins and routes to the agent.
- A prompt has complexity below 7 but contains multiple unresolved constraints or audiences: ambiguity count can still force escalation.
- `.gemini/agents/` appears inactive in another checkout: the implementation must verify runtime activity before assuming it can be skipped.
- The optional drift fixture adds more maintenance burden than value: the packet must explicitly decide whether to land it or defer it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Roughly 20 touched files across four skills, one shared skill, one command, four runtime agent mirrors, and packet docs |
| Risk | 21/25 | Guard-safe routing, prompt-quality behavior, runtime parity, and command contract changes all need to stay aligned |
| Research | 16/20 | The packet already has strong design evidence, but it still depends on current repo behavior and mirror strategy discipline |
| Multi-Agent | 12/15 | The design introduces a new agent surface and touches four runtime mirror directories |
| Coordination | 13/15 | Multiple skill families, agent formats, and command behavior must stay in sync |
| **Total** | **84/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cross-skill resource loading is attempted despite guard constraints | High | Medium | Keep mirror cards local to each CLI skill |
| R-002 | `/improve:prompt` remains inline-only while CLI skills expect shared escalation behavior | High | Medium | Update command routing and docs in the same packet |
| R-003 | Runtime mirrors drift across four agent directories | Medium | Medium | Treat the OpenCode agent definition as canonical and sync the mirrors in one pass |
| R-004 | Mirror cards expand beyond the intended lightweight footprint | Medium | Medium | Keep cards tabular and condensed; reserve deep explanation for the full skill |
| R-005 | Optional drift fixture widens scope late in the packet | Low | Medium | Make the fixture a late-phase task with explicit go/no-go review |

---

## 11. USER STORIES

### US-001: Improve Routine CLI Dispatches (Priority: P0)

**As a** caller using any CLI orchestration skill, **I want** a lightweight framework-selection and CLEAR-check layer to load automatically, **so that** my routine dispatch prompts improve without pulling a large prompt-engineering skill into context.

**Acceptance Criteria**:
1. Given a normal CLI dispatch, when the skill loads resources, then the local prompt-quality card is available through the `ALWAYS` resource path.
2. Given a routine prompt, when the caller constructs the dispatch, then the selected framework is explicit and the CLEAR pre-check has a documented prompt-construction rule.

### US-002: Escalate High-Risk Prompts Safely (Priority: P0)

**As a** caller handling a complex or compliance-sensitive prompt, **I want** an isolated prompt-enhancement agent, **so that** I can get the full `sk-improve-prompt` methodology without polluting the caller context window.

**Acceptance Criteria**:
1. Given a prompt with complexity `>= 7`, compliance/security requirements, or multiple unresolved constraints, when the skill evaluates escalation triggers, then it routes through `@improve-prompt`.
2. Given an agent-mode dispatch, when the agent completes, then it returns a structured markdown block with framework, CLEAR score, rationale, enhanced prompt, and escalation notes.

### US-003: Keep One Shared Improvement Surface (Priority: P1)

**As a** maintainer of prompt-improvement workflows, **I want** `/improve:prompt` and the CLI skills to share the same escalation agent, **so that** there is one documented high-complexity path instead of competing implementations.

**Acceptance Criteria**:
1. Given `/improve:prompt`, when dispatch mode is resolved, then inline mode and agent mode are both documented and selectable.
2. Given a complex prompt through the command, when agent mode is chosen, then it uses the same `@improve-prompt` contract documented for the CLI skills.

### US-004: Maintain Mirrors Without Guesswork (Priority: P1)

**As a** maintainer editing prompt-quality guidance later, **I want** sync provenance and drift-management rules, **so that** I can keep the canonical card and mirrors aligned without reverse engineering the relationship.

**Acceptance Criteria**:
1. Given the canonical card, when it is edited, then the file itself documents which mirrors must be updated.
2. Given a mirror card, when it is inspected, then it includes a sync footer that points back to the canonical source.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

No open questions remain for packet closeout.

- Resolved: the optional drift check landed as `.opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh`, and `bash .opencode/skill/skill-advisor/scripts/check-prompt-quality-card-sync.sh` reports `SYNC OK`.
- Resolved: `/improve:prompt` now auto-selects Agent mode from `complexity_hint >= 7` and from explicit isolation or fresh-context requests, while keeping Inline mode as the default otherwise.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
