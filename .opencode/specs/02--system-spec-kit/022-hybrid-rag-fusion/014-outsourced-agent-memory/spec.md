---
title: "Feature Specification: Outsourced Agent Memory Capture"
description: "External CLI agents dispatched via cli-* skills run in sandboxed processes with no protocol for saving session context back to Spec Kit Memory, leaving garbage placeholder files and losing valuable work context."
trigger_phrases: ["outsourced agent memory", "cli agent context", "memory handback", "external agent save"]
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Outsourced Agent Memory Capture
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-11 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When the calling AI dispatches work via `cli-codex`, `cli-copilot`, `cli-gemini`, or `cli-claude-code`, the external agent runs in a sandboxed process. It has no protocol for saving session context back to Spec Kit Memory. The calling AI receives only stdout output — no structured memory data. This results in garbage placeholder memory files (zero content, simulated data, stale state) accumulating in spec folders, and valuable work context from delegated sessions being permanently lost.

### Purpose
Establish a standardized memory return protocol so that externally dispatched CLI agents can produce structured context data that the calling AI captures and saves to Spec Kit Memory via `generate-context.js` JSON mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Memory return protocol specification (standard output format for external agents)
- CLI skill updates — "Memory Handback" section in each cli-codex, cli-copilot, cli-gemini, cli-claude-code SKILL
- Prompt template additions — memory-save epilogue in each CLI skill's prompt templates reference
- Calling AI instructions for capturing and saving returned context
- Round-trip validation (dispatch → agent work → structured output → memory save → searchable)

### Out of Scope
- Changes to external CLI tools themselves (Codex, Copilot, Gemini, Claude Code binaries) — we control only the prompt/instructions
- Real-time streaming of memory during agent execution — only post-completion capture
- Automatic memory save without calling AI intervention — the calling AI must explicitly invoke `generate-context.js`

### Files to Change

**Files to change:**

- cli-codex SKILL — Modify: Add Memory Handback protocol section
- cli-copilot SKILL — Modify: Add Memory Handback protocol section
- cli-gemini SKILL — Modify: Add Memory Handback protocol section
- cli-claude-code SKILL — Modify: Add Memory Handback protocol section
- cli-codex prompt templates — Modify: Add memory epilogue template
- cli-copilot prompt templates — Modify: Add memory epilogue template
- cli-gemini prompt templates — Modify: Add memory epilogue template
- cli-claude-code prompt templates — Modify: Add memory epilogue template
- generate-context script — Modify (if needed): Enhance JSON mode for external agent data

All files under `.opencode/skill/sk-cli/` (CLI skills) and `.opencode/skill/system-spec-kit/scripts/memory/` (generate-context).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define memory return protocol — a structured output format that external agents include at end of their response | Protocol documented; includes session summary, files modified, decisions made, next steps |
| REQ-002 | Update all 4 cli-* SKILL files with Memory Handback section | Each SKILL has a section instructing the calling AI how to extract and save memory |
| REQ-003 | Update all 4 cli-* prompt template files with memory epilogue | Each template includes a suffix that instructs the external agent to output structured context |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Calling AI instructions in CLAUDE.md or agent definitions | Clear protocol for how the calling AI captures agent output and feeds to `generate-context.js` |
| REQ-005 | Round-trip validation test | Demonstrate: dispatch → agent produces structured output → calling AI saves via `generate-context.js` → memory is searchable via `memory_search` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: External agent sessions produce structured memory output that `generate-context.js` can consume
- **SC-002**: No more garbage placeholder memory files from outsourced agent sessions
- **SC-003**: Saved memories from external agents are searchable and surface relevant context in future sessions
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `generate-context.js` JSON mode | Core bridge for memory save | Already exists and works; may need minor enhancement |
| Dependency | External CLI tools (codex, copilot, gemini, claude-code) | Cannot modify their internal behavior | Protocol works via prompt engineering — we control only instructions |
| Risk | External agents may not follow memory epilogue format | Med | Design format to be simple; include fallback parsing for partial compliance |
| Risk | Large agent outputs may exceed memory size limits | Low | Context template v2.2 already handles truncation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Memory save from captured agent output completes in <5s
- **NFR-P02**: No measurable impact on agent dispatch latency

### Security
- **NFR-S01**: No secrets or credentials captured in memory output
- **NFR-S02**: Memory files follow existing permission model (600 permissions)

### Reliability
- **NFR-R01**: Graceful degradation if agent doesn't produce structured output — calling AI can still manually save
- **NFR-R02**: Partial structured output still produces usable memory (not all-or-nothing)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty agent output: Skip memory save, log warning
- Agent output without memory section: Calling AI manually extracts key points
- Extremely large output (>50KB): Truncate to summary + key decisions

### Error Scenarios
- `generate-context.js` fails on agent data: Fall back to manual memory save
- Agent crashes mid-execution: No structured output available; calling AI notes failure in memory
- Multiple agents dispatched in parallel: Each produces independent memory; calling AI saves sequentially

### State Transitions
- Agent partially completes work: Memory captures partial state with clear "incomplete" marker
- Agent modifies files that conflict with calling AI's work: Memory captures the conflict for resolution
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 8+ files across 4 CLI skills, prompt templates, possibly generate-context.js |
| Risk | 8/25 | Low risk — prompt-level changes only, no runtime code changes |
| Research | 10/20 | Need to verify generate-context.js JSON mode capabilities, test with each CLI |
| **Total** | **30/70** | **Level 2 appropriate** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the memory epilogue be opt-in (calling AI requests it) or always-on (every dispatch includes it)?
- Should `generate-context.js` JSON mode accept raw agent output or require the calling AI to pre-structure it?
- What's the minimum viable structured output format — JSON block, YAML frontmatter, or markdown section?
<!-- /ANCHOR:questions -->
