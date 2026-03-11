---
title: "Implementation Plan: Outsourced Agent Memory Capture"
description: "Design and implement a memory return protocol for externally dispatched CLI agents, updating cli-* skills with handback instructions and prompt epilogues."
trigger_phrases: ["outsourced agent memory", "memory handback plan", "cli agent protocol"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Outsourced Agent Memory Capture
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (generate-context.js), Markdown (SKILL, prompt templates) |
| **Framework** | Spec Kit Memory system, CLI skill ecosystem |
| **Storage** | SQLite (Spec Kit Memory DB) |
| **Testing** | Manual round-trip validation |

### Overview
Implement a standardized protocol that enables externally dispatched CLI agents (Codex, Copilot, Gemini, Claude Code) to produce structured session context in their output, which the calling AI then captures and saves to Spec Kit Memory via `generate-context.js` JSON mode. The approach is prompt-engineering-only — no external tool modifications required.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Memory return protocol defined and documented
- [ ] All 4 cli-* SKILL files updated with Memory Handback section
- [ ] All 4 prompt templates files updated with memory epilogue
- [ ] Round-trip validation successful (dispatch → structured output → memory save → searchable)
- [ ] Spec docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Prompt-engineering protocol layered on existing infrastructure.

### Key Components
- **Memory Return Protocol**: Standardized output format (markdown section with structured fields) that external agents append to their response
- **Prompt Epilogue**: Template suffix added to CLI skill prompts instructing external agents to produce the structured output
- **Calling AI Handler**: Instructions in SKILL for how the calling AI extracts the structured section and passes it to `generate-context.js`
- **generate-context.js JSON Mode**: Existing bridge that accepts structured data and writes it to Spec Kit Memory

### Data Flow
```
Calling AI dispatches task via cli-* skill
    → Prompt includes memory epilogue suffix
    → External agent executes task
    → External agent appends structured memory section to output
    → Calling AI receives stdout with memory section
    → Calling AI extracts memory section
    → Calling AI writes JSON to /tmp/save-context-data.json
    → Calling AI runs: node generate-context.js [spec-folder-path]
    → Memory saved to Spec Kit Memory DB
    → Future sessions can search and surface this context
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Protocol Design
- [ ] Research generate-context.js JSON mode input format
- [ ] Research existing context template v2.2 structure
- [ ] Define memory return protocol (structured output format)
- [ ] Define minimum viable fields (summary, files_modified, decisions, next_steps)

### Phase 2: Prompt Template Updates
- [ ] Design memory epilogue template (universal across all cli-* skills)
- [ ] Add epilogue to cli-codex prompt templates
- [ ] Add epilogue to cli-copilot prompt templates
- [ ] Add epilogue to cli-gemini prompt templates
- [ ] Add epilogue to cli-claude-code prompt templates

### Phase 3: SKILL Updates
- [ ] Design Memory Handback section (universal content, skill-specific examples)
- [ ] Add section to cli-codex SKILL
- [ ] Add section to cli-copilot SKILL
- [ ] Add section to cli-gemini SKILL
- [ ] Add section to cli-claude-code SKILL

### Phase 4: Verification
- [ ] Round-trip test with one CLI skill (e.g., cli-codex)
- [ ] Verify saved memory is searchable via `memory_search`
- [ ] Update spec folder docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Round-trip: dispatch → structured output → save → search | CLI skills, generate-context.js, memory_search |
| Manual | Graceful degradation: agent without epilogue | CLI dispatch without memory epilogue |
| Manual | Partial output: agent produces incomplete structured section | generate-context.js error handling |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `generate-context.js` JSON mode | Internal | Green | Core bridge; already exists |
| Context template v2.2 | Internal | Green | Template format; already stable |
| CLI skill prompt templates | Internal | Green | Files exist; need additions |
| CLI skill SKILL definitions | Internal | Green | Files exist; need new section |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Protocol causes issues with external agent behavior or breaks existing CLI skill workflows
- **Procedure**: Revert SKILL and prompt templates changes; epilogue is additive so removal is clean
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Protocol Design) ──► Phase 2 (Prompt Templates) ──► Phase 4 (Verify)
                          └──► Phase 3 (SKILL Updates) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Protocol Design | None | Prompt Templates, SKILL Updates |
| Prompt Templates | Protocol Design | Verification |
| SKILL Updates | Protocol Design | Verification |
| Verification | Prompt Templates, SKILL Updates | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Protocol Design | Med | Research + design |
| Prompt Templates | Low | 4 files, same epilogue |
| SKILL Updates | Low | 4 files, same section |
| Verification | Med | Manual round-trip test |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing CLI skill workflows tested without memory epilogue (baseline)
- [ ] generate-context.js JSON mode verified with sample data

### Rollback Procedure
1. Remove Memory Handback sections from all 4 SKILL files
2. Remove epilogue templates from all 4 prompt templates files
3. Verify CLI skills still dispatch correctly without epilogue
4. No data migration needed — memory entries are additive

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — memory entries from protocol are standard entries, can be individually deleted if needed
<!-- /ANCHOR:enhanced-rollback -->
