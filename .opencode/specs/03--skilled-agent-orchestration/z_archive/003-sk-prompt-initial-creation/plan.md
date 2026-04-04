---
title: "Implementation Plan: sk-prompt-improver Initial Creation [03--commands-and-skills/003-sk-prompt-initial-creation/plan]"
description: "title: \"Implementation Plan: sk-prompt-improver Initial Creation\""
trigger_phrases:
  - "implementation"
  - "plan"
  - "prompt"
  - "improver"
  - "initial"
  - "003"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: sk-prompt-improver Initial Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python |
| **Framework** | OpenCode Skill Architecture (sk-doc standards) |
| **Storage** | None (file-based skill) |
| **Testing** | package_skill.py validation, skill_advisor.py routing |

### Overview
Convert the standalone Prompt Improver AI system (v0.200) into an OpenCode-native skill. The SKILL.md orchestrates 10 prompt frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT, VIBE, FRAME, MOTION), the DEPTH thinking methodology, and triple scoring (CLEAR/EVOKE/VISUAL) via progressive disclosure through bundled references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source system documented and accessible
- [x] sk-doc skill creation standards reviewed
- [x] Skill advisor registration format understood
- [x] Level 3 spec folder created

### Definition of Done
- [x] SKILL.md passes package_skill.py validation
- [x] All references created and linked
- [x] skill_advisor.py updated and tested
- [x] All tasks marked [x] in tasks.md

### Pre-Task Checklist
- Confirm scoped files and validation targets before editing.
- Confirm the change is structure-only and does not alter feature intent.
- Confirm the next validation batch is limited to the current spec folder.

### Task Execution Rules
- TASK-SEQ: Complete one compliance batch before re-validating.
- TASK-SCOPE: Preserve document meaning while fixing structure and validator-facing metadata only.
- TASK-VERIFY: Re-run `validate.sh --verbose` after each structural batch.

### Status Reporting Format
- STATUS=IN_PROGRESS when a compliance batch is underway.
- STATUS=BLOCKED when a validator warning or document shape cannot be resolved safely.
- STATUS=DONE only after the packet validates without blocking findings.

### Blocked Task Protocol
- BLOCKED: record the failing file, validator rule, and the smallest safe remediation path.
- If a fix would change implementation meaning, stop and keep the packet structure-only.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Progressive Disclosure (Level 1: metadata, Level 2: SKILL.md body, Level 3: bundled references)

### Key Components
- **SKILL.md**: Orchestrator with routing, workflow overview, rules (<5k words)
- **references/system_prompt.md**: Core routing logic and enhancement pipeline
- **references/depth_framework.md**: DEPTH thinking methodology and RICCE integration
- **references/patterns_evaluation.md**: 10 frameworks, CLEAR scoring, design directions
- **references/interactive_mode.md**: Conversation flow and state management
- **references/visual_mode.md**: VIBE/VIBE-MP framework, EVOKE scoring
- **references/image_mode.md**: FRAME framework, VISUAL scoring for image generators
- **references/video_mode.md**: MOTION framework for video generators
- **references/format_guides.md**: Consolidated Markdown/JSON/YAML format specifications

### Data Flow
```
User Request → SKILL.md (intent classification)
    → Smart Router (mode detection + framework selection)
    → Load relevant reference(s)
    → DEPTH processing (5-10 rounds)
    → Scoring (CLEAR/EVOKE/VISUAL)
    → Enhanced Prompt Output
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create .opencode/skill/sk-prompt-improver/ directory
- [ ] Create references/ subdirectory

### Phase 2: Core Implementation
- [ ] Create SKILL.md with all 8 sections
- [ ] Create references/system_prompt.md
- [ ] Create references/depth_framework.md
- [ ] Create references/patterns_evaluation.md
- [ ] Create references/interactive_mode.md
- [ ] Create references/visual_mode.md
- [ ] Create references/image_mode.md
- [ ] Create references/video_mode.md
- [ ] Create references/format_guides.md

### Phase 3: Integration & Verification
- [ ] Update skill_advisor.py with intent boosters
- [ ] Validate SKILL.md with package_skill.py
- [ ] Test routing with skill_advisor.py
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | SKILL.md validation | package_skill.py |
| Routing | Intent booster accuracy | skill_advisor.py |
| Manual | Skill invocation end-to-end | Read tool + review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Source Prompt Improver files | Internal | Green | Cannot adapt content |
| sk-doc SKILL.md template | Internal | Green | Cannot structure skill |
| skill_advisor.py | Internal | Green | Cannot register skill |
| package_skill.py | Internal | Green | Cannot validate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation failures or skill conflicts
- **Procedure**: Delete .opencode/skill/sk-prompt-improver/ directory; revert skill_advisor.py changes
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Integration)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Integration |
| Integration | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
<!-- /ANCHOR:dependencies -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Phase 1    │────►│    Phase 2      │────►│    Phase 3       │
│  Setup      │     │  SKILL.md +     │     │  Advisor +       │
│             │     │  References     │     │  Validation      │
└─────────────┘     └─────────────────┘     └──────────────────┘
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **SKILL.md creation** - CRITICAL (defines routing for all references)
2. **References adaptation** - CRITICAL (skill requires knowledge base)
3. **Skill advisor update** - CRITICAL (skill must be discoverable)

**Parallel Opportunities**:
- References T005-T012 can be created in parallel after SKILL.md routing is defined
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Progressive Reference Strategy

**Status**: Accepted

**Context**: Source Prompt Improver has ~250KB across 7+ documents. SKILL.md has a 5k word limit.

**Decision**: SKILL.md as orchestrator (<5k words); references/ holds detailed knowledge base.

**Consequences**:
- Positive: Keeps context window lean, follows sk-doc best practices
- Negative: Requires smart routing to load correct references per intent

**Alternatives Rejected**:
- Single-file: Exceeds 5k word limit
- Minimal subset: Loses framework functionality

### ADR-002: Adapt Rather Than Copy

**Status**: Accepted

**Context**: Source docs designed for standalone Claude Project with custom instructions model.

**Decision**: Adapt documents for OpenCode skill architecture; remove standalone project assumptions.

**Consequences**:
- Positive: Clean native skill integration
- Negative: Requires careful adaptation to preserve functionality

### ADR-003: Consolidated Format Guides

**Status**: Accepted

**Context**: Source has 3 separate format guides (JSON ~16KB, YAML ~15KB, Markdown ~14KB).

**Decision**: Consolidate into single references/format_guides.md.

**Consequences**:
- Positive: Reduces file count, content is complementary
- Negative: Larger single file (~45KB consolidated)

<!-- /ANCHOR:architecture -->
---
